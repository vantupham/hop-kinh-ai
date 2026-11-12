/* Hộp Kính AI · Dự án 09 · Đếm xe trên phố (khung bao, ngưỡng tin cậy, IoU, NMS, theo dõi, đếm) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-09");
  const W = 640, H = 480, LINE_X = 320;
  const TYPES = { moto: { name: "Xe máy", w: 46, h: 22, col: "#ffc34d" }, oto: { name: "Ô tô", w: 92, h: 44, col: "#3ee9cf" }, bus: { name: "Xe buýt", w: 186, h: 58, col: "#9184ff" } };
  const KEYS = ["moto", "oto", "bus"];
  const LANES = [{ y: 112, dir: 1 }, { y: 197, dir: 1 }, { y: 282, dir: -1 }, { y: 367, dir: -1 }];
  const DEF = { conf: 0.5, nms: true, nmsIou: 0.45, maxAge: 0.6, predict: true, detHz: 15, rush: false };
  const ST = { src: "sim", ...DEF, t: 0, veh: [], nextSpawn: 0, vid: 0, raw: [], kept: [], afterNms: [], tracks: [], tid: 0, lastDet: 0, countAI: { moto: 0, oto: 0, bus: 0 }, countTrue: { moto: 0, oto: 0, bus: 0 }, hist: [], show: { raw: true, boxes: true, ids: true }, paused: false };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), video = $("video");
  const FP_SITES = [{ x: 322, y: 76, w: 70, h: 30 }, { x: 300, y: 404, w: 80, h: 34 }, { x: 140, y: 240, w: 40, h: 22 }, { x: 330, y: 241, w: 64, h: 24 }];

  // ---------- IoU & NMS ----------
  const area = (b) => Math.max(0, b.w) * Math.max(0, b.h);
  function iou(a, b) { const x1 = Math.max(a.x - a.w / 2, b.x - b.w / 2), y1 = Math.max(a.y - a.h / 2, b.y - b.h / 2), x2 = Math.min(a.x + a.w / 2, b.x + b.w / 2), y2 = Math.min(a.y + a.h / 2, b.y + b.h / 2); const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1); return inter / (area(a) + area(b) - inter || 1); }
  function nms(dets, th) { const s = dets.slice().sort((a, b) => b.conf - a.conf), keep = []; for (const d of s) { if (keep.every((k) => iou(k, d) < th)) keep.push(d); else d.suppressed = true; } return keep; }

  // ---------- thế giới mô phỏng ----------
  function spawn() {
    const lane = LANES[Math.floor(Math.random() * 4)], r = Math.random(), type = r < 0.58 ? "moto" : r < 0.88 ? "oto" : "bus", T = TYPES[type];
    const sp = (type === "bus" ? 70 : type === "oto" ? 105 : 120) * (0.85 + Math.random() * 0.3) * (ST.rush ? 1.9 : 1);
    if (ST.veh.some((v) => v.lane === lane && Math.abs(v.x - (lane.dir > 0 ? -T.w : W + T.w)) < T.w + v.w + 30)) return;
    ST.veh.push({ id: ++ST.vid, type, lane, x: lane.dir > 0 ? -T.w / 2 - 10 : W + T.w / 2 + 10, y: lane.y + (Math.random() - 0.5) * 16, w: T.w, h: T.h, vx: sp * lane.dir, counted: false, hue: Math.random() });
  }
  function stepWorld(dt) {
    if (ST.t > ST.nextSpawn) { spawn(); ST.nextSpawn = ST.t + (ST.rush ? 0.35 : 0.6) + Math.random() * (ST.rush ? 0.4 : 0.8); }
    for (const v of ST.veh) {
      const ahead = ST.veh.filter((o) => o !== v && o.lane === v.lane && Math.sign(o.x - v.x) === v.lane.dir).sort((a, b) => Math.abs(a.x - v.x) - Math.abs(b.x - v.x))[0];
      let sp = v.vx; if (ahead && Math.abs(ahead.x - v.x) < (ahead.w + v.w) / 2 + 22) sp = ahead.vx;
      const px = v.x; v.x += sp * dt;
      if (!v.counted && (px - LINE_X) * (v.x - LINE_X) <= 0) { v.counted = true; ST.countTrue[v.type]++; }
    }
    ST.veh = ST.veh.filter((v) => v.x > -260 && v.x < W + 260);
  }
  // bộ phát hiện mô phỏng: khung thô kèm độ tin cậy, có khung trùng và báo nhầm
  function detectSim() {
    const out = [];
    for (const v of ST.veh) {
      const vis = Math.min(v.x + v.w / 2, W) - Math.max(v.x - v.w / 2, 0); if (vis < v.w * 0.35) continue;
      if (Math.random() > 0.96) continue;
      const j = (k) => (Math.random() - 0.5) * k, base = v.type === "moto" ? 0.62 : 0.75;
      out.push({ x: v.x + j(v.w * 0.06), y: v.y + j(v.h * 0.1), w: v.w * (1 + j(0.1)), h: v.h * (1 + j(0.12)), conf: Math.min(0.99, base + Math.random() * 0.3), cls: v.type, truth: v.id });
      const dup = Math.random() < 0.7 ? 1 + (Math.random() < 0.4 ? 1 : 0) : 0;
      for (let k = 0; k < dup; k++) out.push({ x: v.x + j(v.w * 0.35), y: v.y + j(v.h * 0.35), w: v.w * (0.8 + Math.random() * 0.3), h: v.h * (0.8 + Math.random() * 0.3), conf: 0.35 + Math.random() * 0.45, cls: v.type, truth: v.id, dup: true });
    }
    for (const s of FP_SITES) { if (Math.random() < 0.85) out.push({ x: s.x + (Math.random() - 0.5) * 110, y: s.y + (Math.random() - 0.5) * 10, w: s.w * (0.7 + Math.random() * 0.5), h: s.h, conf: Math.random() * 0.42 + (Math.random() < 0.08 ? 0.2 : 0), cls: Math.random() < 0.5 ? "moto" : "oto", fp: true }); }
    return out;
  }
  // ---------- theo dõi + đếm ----------
  function track(dets, dt) {
    const cand = [];
    for (const t of ST.tracks) {
      const pb = ST.predict ? { ...t.box, x: t.box.x + t.vx * dt, y: t.box.y + t.vy * dt } : t.box;
      t.pred = pb;
      dets.forEach((d, j) => { const s = iou(pb, d); if (s > 0.15) cand.push({ t, j, s }); else if (ST.predict && d.cls === t.cls) { const dd = Math.hypot(pb.x - d.x, pb.y - d.y); if (dd < Math.max(pb.w, 40) * 2.2 && Math.abs(pb.y - d.y) < pb.h) cand.push({ t, j, s: 0.1 - dd / 1e4 }); } });
    }
    cand.sort((a, b) => b.s - a.s);
    const usedT = new Set(), usedD = new Set();
    for (const c of cand) {
      if (usedT.has(c.t) || usedD.has(c.j)) continue; usedT.add(c.t); usedD.add(c.j);
      const t = c.t, d = dets[c.j], px = t.box.x;
      if (dt > 0) { t.vx = 0.6 * t.vx + 0.4 * (d.x - t.box.x) / dt; t.vy = 0.6 * t.vy + 0.4 * (d.y - t.box.y) / dt; }
      t.box = { x: d.x, y: d.y, w: d.w, h: d.h }; t.cls = d.cls; t.miss = 0; t.hits++; t.trail.push({ x: d.x, y: d.y }); if (t.trail.length > 30) t.trail.shift();
      d.tid = t.id;
      if (!t.counted && t.hits >= 2 && (px - LINE_X) * (d.x - LINE_X) <= 0 && px !== d.x) { t.counted = true; ST.countAI[t.cls]++; t.flash = 1; }
    }
    for (const t of ST.tracks) if (!usedT.has(t)) { t.miss += dt; if (ST.predict) { t.box = { ...t.box, x: t.box.x + t.vx * dt, y: t.box.y + t.vy * dt }; } }
    ST.tracks = ST.tracks.filter((t) => t.miss <= ST.maxAge);
    dets.forEach((d, j) => { if (!usedD.has(j)) { const t = { id: ++ST.tid, box: { x: d.x, y: d.y, w: d.w, h: d.h }, cls: d.cls, vx: 0, vy: 0, miss: 0, hits: 1, counted: false, trail: [{ x: d.x, y: d.y }] }; ST.tracks.push(t); d.tid = t.id; } });
  }
  function pipeline(raw, dt) {
    ST.raw = raw; ST.kept = raw.filter((d) => d.conf >= ST.conf); ST.afterNms = ST.nms ? nms(ST.kept, ST.nmsIou) : ST.kept;
    track(ST.afterNms, dt);
  }

  // ---------- camera / video thật (COCO-SSD) ----------
  let cocoModel = null, stream = null, detBusy = false;
  const COCO = { motorcycle: "moto", bicycle: "moto", car: "oto", truck: "bus", bus: "bus" };
  async function loadCoco() {
    if (cocoModel) return;
    const add = (src) => new Promise((ok, no) => { const s = document.createElement("script"); s.src = src; s.onload = ok; s.onerror = () => no(new Error("không tải được " + src)); document.head.appendChild(s); });
    if (!window.tf) await add("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.20.0/dist/tf.min.js");
    if (!window.cocoSsd) await add("https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js");
    cocoModel = await window.cocoSsd.load({ base: "lite_mobilenet_v2" });
  }
  async function detectReal() {
    if (!cocoModel || video.readyState < 2 || detBusy) return null; detBusy = true;
    const preds = await cocoModel.detect(video, 30, 0.05); detBusy = false;
    const sx = W / video.videoWidth, sy = H / video.videoHeight;
    return preds.filter((p) => COCO[p.class]).map((p) => ({ x: (p.bbox[0] + p.bbox[2] / 2) * sx, y: (p.bbox[1] + p.bbox[3] / 2) * sy, w: p.bbox[2] * sx, h: p.bbox[3] * sy, conf: p.score, cls: COCO[p.class] }));
  }
  async function useReal(file) {
    P.msg($("stageMsg"), "Đang tải mô hình AI phát hiện vật thể COCO-SSD (khoảng 5 MB)…", "loader");
    try {
      await loadCoco();
      if (file) { if (stream) stream.getTracks().forEach((t) => t.stop()); video.srcObject = null; video.src = URL.createObjectURL(file); video.loop = true; await video.play(); }
      else stream = await P.camera(video);
      ST.src = "real"; P.srcButtons("cam"); $("srcTag").textContent = file ? "VIDEO" : "CAMERA"; P.msg($("stageMsg"), null); resetCounts();
    } catch (e) { useSim(); P.msg($("stageMsg"), "Chưa chạy được camera hoặc mô hình AI (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; video.pause(); ST.src = "sim"; P.srcButtons("sim"); resetCounts(); }
  function resetCounts() { KEYS.forEach((k) => { ST.countAI[k] = 0; ST.countTrue[k] = 0; }); ST.tracks = []; ST.hist = []; ST.t0 = ST.t; }

  // ---------- vẽ ----------
  function drawRoad(ctx) {
    ctx.fillStyle = "#6f8f5f"; ctx.fillRect(0, 0, W, 70); ctx.fillRect(0, 410, W, 70);
    ctx.fillStyle = "#b9b4a8"; ctx.fillRect(0, 56, W, 14); ctx.fillRect(0, 410, W, 14);
    ctx.fillStyle = "#3d4048"; ctx.fillRect(0, 70, W, 340);
    ctx.strokeStyle = "#f0e9d8"; ctx.lineWidth = 3; ctx.setLineDash([26, 22]);
    for (const y of [155, 325]) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
    ctx.setLineDash([]); ctx.strokeStyle = "#f2c14e"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, 238); ctx.lineTo(W, 238); ctx.moveTo(0, 244); ctx.lineTo(W, 244); ctx.stroke();
    // cây và bóng cây (nguồn báo nhầm)
    for (const [x, y] of [[300, 30], [340, 450], [130, 30], [520, 450], [560, 26]]) { ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(x + 24, y + (y < 100 ? 48 : -48), 46, 22, 0.3, 0, 7); ctx.fill(); ctx.fillStyle = "#2f6e2c"; ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.fill(); ctx.fillStyle = "#4fa34a"; ctx.beginPath(); ctx.arc(x - 8, y - 8, 18, 0, 7); ctx.fill(); }
    ctx.fillStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.ellipse(140, 240, 26, 12, 0, 0, 7); ctx.fill(); // vết dầu trên đường
  }
  function drawVehicle(ctx, v) {
    ctx.save(); ctx.translate(v.x, v.y); if (v.lane.dir < 0) ctx.scale(-1, 1);
    const w = v.w, h = v.h;
    if (v.type === "moto") { ctx.fillStyle = "#1d1d22"; D.rr(ctx, -w / 2, -4, w, 8, 4); ctx.fill(); ctx.fillStyle = `hsl(${v.hue * 360},70%,50%)`; D.rr(ctx, -w / 2 + 8, -h / 2 + 2, w - 18, h - 4, 6); ctx.fill(); ctx.fillStyle = "#f2c14e"; ctx.beginPath(); ctx.arc(2, 0, 7, 0, 7); ctx.fill(); }
    else { ctx.fillStyle = v.type === "bus" ? "#2f7bd6" : `hsl(${v.hue * 360},55%,${45 + v.hue * 15}%)`; D.rr(ctx, -w / 2, -h / 2, w, h, v.type === "bus" ? 8 : 12); ctx.fill(); ctx.fillStyle = "rgba(200,230,255,.85)"; if (v.type === "bus") { for (let i = 0; i < 6; i++) ctx.fillRect(-w / 2 + 14 + i * 28, -h / 2 + 6, 20, h - 12); } else { D.rr(ctx, w / 2 - 30, -h / 2 + 6, 16, h - 12, 4); ctx.fill(); D.rr(ctx, -w / 2 + 10, -h / 2 + 8, 12, h - 16, 3); ctx.fill(); } }
    ctx.restore();
  }
  function drawBox(ctx, b, col, label, dash, lw) {
    ctx.strokeStyle = col; ctx.lineWidth = lw || 2.5; if (dash) ctx.setLineDash(dash); ctx.strokeRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h); ctx.setLineDash([]);
    if (label) { ctx.font = "700 11px JetBrains Mono, monospace"; const tw = ctx.measureText(label).width + 8; ctx.fillStyle = col; ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2 - 16, tw, 16); ctx.fillStyle = "#0a0b1e"; ctx.fillText(label, b.x - b.w / 2 + 4, b.y - b.h / 2 - 4); }
  }
  function drawScene(ctx) {
    if (ST.src === "sim") { drawRoad(ctx); ST.veh.forEach((v) => drawVehicle(ctx, v)); }
    else if (video.readyState >= 2) ctx.drawImage(video, 0, 0, W, H); else D.labBg(ctx);
  }
  function drawLine(ctx) { ctx.strokeStyle = "#ff6f9e"; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(LINE_X, 64); ctx.lineTo(LINE_X, 416); ctx.stroke(); ctx.setLineDash([]); }
  function renderStage() {
    const ctx = sctx; drawScene(ctx); drawLine(ctx);
    if (ST.show.raw) ST.raw.forEach((d) => drawBox(ctx, d, `rgba(255,255,255,${0.15 + d.conf * 0.4})`, null, [4, 4], 1));
    if (ST.show.boxes) ST.afterNms.forEach((d) => drawBox(ctx, d, TYPES[d.cls].col, `${TYPES[d.cls].name} ${Math.round(d.conf * 100)}%`));
    if (ST.show.ids) for (const t of ST.tracks) {
      ctx.strokeStyle = "rgba(255,111,158,.8)"; ctx.lineWidth = 2; ctx.beginPath(); t.trail.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
      ctx.fillStyle = t.flash > 0 ? "#ff6f9e" : "rgba(10,12,38,.85)"; D.rr(ctx, t.box.x - 16, t.box.y - 9, 32, 18, 9); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "700 11px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText("#" + t.id, t.box.x, t.box.y + 4); ctx.textAlign = "left";
      if (t.flash > 0) t.flash -= 0.03;
    }
    // bảng đếm
    ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, 10, 10, 220, 92, 12); ctx.fill();
    ctx.font = "600 11px JetBrains Mono"; ctx.fillStyle = "#8f96d4"; ctx.fillText("ĐẾM QUA VẠCH   AI   THẬT", 22, 30);
    KEYS.forEach((k, i) => { ctx.fillStyle = TYPES[k].col; ctx.fillText(TYPES[k].name.padEnd(13, " "), 22, 52 + i * 18); ctx.fillStyle = "#fff"; ctx.fillText(String(ST.countAI[k]).padStart(4, " ") + (ST.src === "sim" ? String(ST.countTrue[k]).padStart(7, " ") : "      —"), 118, 52 + i * 18); });
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh đầu vào", e: "image", d: "Camera giao thông chụp khoảng <b>15 ảnh mỗi giây</b>. Mỗi ảnh được đưa vào mô hình phát hiện vật thể." },
    { t: "Khung thô", e: "robot", d: "Mô hình trả về <b>rất nhiều khung</b>, mỗi khung có loại xe và <b>độ tin cậy</b>. Có khung trùng lên cùng một xe, có khung báo nhầm bóng cây." },
    { t: "Lọc ngưỡng", e: "sliders", d: "Bỏ đi những khung có độ tin cậy <b>thấp hơn ngưỡng</b>. Ngưỡng cao thì ít báo nhầm nhưng dễ bỏ sót, ngưỡng thấp thì ngược lại." },
    { t: "NMS", e: "layers", d: "Nhiều khung chồng lên nhau (<b>IoU cao</b>) thường là cùng một xe. NMS giữ khung tự tin nhất và <b>xóa các khung trùng</b> (màu đỏ)." },
    { t: "Theo dõi", e: "crosshair", d: "Nối khung ở ảnh này với khung ở ảnh trước bằng IoU, để mỗi xe giữ một <b>số ID</b> qua thời gian. Vệt hồng là đường đi của từng ID." },
    { t: "Đếm qua vạch", e: "checkCircle", d: "Khi tâm một ID vượt qua <b>vạch đếm</b> thì cộng 1, và mỗi ID chỉ được đếm <b>một lần</b>. Nếu ID bị đổi giữa chừng, một xe có thể bị đếm hai lần." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 3) prog.done("see"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const s = pipe.get(), ctx = octx; drawScene(ctx);
    if (s === 0) return;
    ctx.fillStyle = "rgba(10,12,38,.35)"; ctx.fillRect(0, 0, W, H);
    if (s === 1) { ST.raw.forEach((d) => drawBox(ctx, d, d.fp ? "#ff7d5f" : "#ffffff", Math.round(d.conf * 100) + "%", null, 1.5)); return; }
    if (s === 2) { ST.raw.forEach((d) => drawBox(ctx, d, d.conf >= ST.conf ? "#5ef2d6" : "rgba(255,255,255,.18)", d.conf >= ST.conf ? Math.round(d.conf * 100) + "%" : null, d.conf >= ST.conf ? null : [3, 4], 1.5)); D.pill(ctx, `ngưỡng ${Math.round(ST.conf * 100)}%`, W / 2, 30, "#1c2048", 14); return; }
    if (s === 3) { ST.kept.forEach((d) => drawBox(ctx, d, d.suppressed && ST.nms ? "#ff5d5d" : "#5ef2d6", d.suppressed && ST.nms ? "xóa" : Math.round(d.conf * 100) + "%", d.suppressed && ST.nms ? [5, 4] : null, 2)); D.pill(ctx, ST.nms ? `NMS: xóa khung trùng khi IoU ≥ ${ST.nmsIou.toFixed(2)}` : "NMS đang TẮT", W / 2, 30, "#1c2048", 14); return; }
    drawLine(ctx);
    for (const t of ST.tracks) { ctx.strokeStyle = "#ff6f9e"; ctx.lineWidth = 3; ctx.beginPath(); t.trail.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke(); drawBox(ctx, t.box, t.counted ? "#ff6f9e" : "#5ef2d6", "#" + t.id + (s === 5 && t.counted ? " đã đếm" : "")); }
    if (s === 5) D.pill(ctx, `AI đếm ${KEYS.reduce((a, k) => a + ST.countAI[k], 0)} · thật ${KEYS.reduce((a, k) => a + ST.countTrue[k], 0)}`, W / 2, 30, "#1c2048", 14);
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive");
    const n = { raw: ST.raw.length, kept: ST.kept.length, nms: ST.afterNms.length, veh: ST.veh.filter((v) => v.x > 0 && v.x < W).length };
    if (s === 0) el.innerHTML = `Số xe thật đang trong khung hình: <span class="hl">${n.veh}</span>`;
    else if (s === 1) el.innerHTML = `Khung thô: <span class="w">${n.raw}</span> (xe thật: ${n.veh})\nKhung báo nhầm (cam): ${ST.raw.filter((d) => d.fp).length}\nKhung trùng: ${ST.raw.filter((d) => d.dup).length}`;
    else if (s === 2) el.innerHTML = `Ngưỡng: <span class="w">${Math.round(ST.conf * 100)}%</span>\nCòn lại: <span class="hl">${n.kept}</span> / ${n.raw} khung`;
    else if (s === 3) el.innerHTML = `Trước NMS: ${n.kept} khung\nSau NMS:  <span class="hl">${n.nms}</span> khung (xe thật: ${n.veh})`;
    else if (s === 4) el.innerHTML = `Đang theo dõi: <span class="hl">${ST.tracks.length}</span> ID\nID lớn nhất đã cấp: <span class="w">#${ST.tid}</span>\nTổng số xe thật đã xuất hiện: ${ST.vid}`;
    else { const a = KEYS.reduce((x, k) => x + ST.countAI[k], 0), t = KEYS.reduce((x, k) => x + ST.countTrue[k], 0); el.innerHTML = `AI đếm: <span class="hl">${a}</span> · Thật: <span class="w">${t}</span>\nSai lệch: <span class="${Math.abs(a - t) <= 1 ? "hl" : "w"}">${a - t > 0 ? "+" : ""}${a - t}</span>`; }
  }

  // ---------- bảng não, biểu đồ, IoU demo, code ----------
  function renderBrain() {
    const a = KEYS.reduce((x, k) => x + ST.countAI[k], 0), t = KEYS.reduce((x, k) => x + ST.countTrue[k], 0);
    $("bCount").textContent = a; $("bTrue").textContent = ST.src === "sim" ? t : "—";
    $("bErr").textContent = ST.src === "sim" && t ? (a - t > 0 ? "+" : "") + Math.round((a - t) / t * 100) + "%" : "—";
    $("bFunnel").innerHTML = [["Khung thô", ST.raw.length], ["Qua ngưỡng", ST.kept.length], ["Sau NMS", ST.afterNms.length], ["ID đang theo dõi", ST.tracks.length]].map(([n, v]) => `<div class="r"><span>${n}</span><span class="bar"><i style="width:${Math.min(100, v * 6)}%;background:#5ef2d6"></i></span><span>${v}</span></div>`).join("");
  }
  function renderChart() {
    const TH = P.TH, h = ST.hist, mx = Math.max(10, ...h.map((q) => Math.max(q.a, q.t)));
    P.lineChart($("chart"), [{ data: h.map((q) => ({ t: q.t, v: q.t2 })), color: TH.ink, width: 2, dash: [6, 5] }, { data: h.map((q) => ({ t: q.t, v: q.a })), color: TH.rose, width: 3 }],
      { min: 0, max: mx, span: 60, now: ST.t, ticks: [0, Math.round(mx / 2), mx] });
  }
  const iouA = { x: 200, y: 140, w: 180, h: 120 }, iouB = { x: 300, y: 180, w: 160, h: 130 };
  function renderIou() {
    const cv = $("iouCanvas"), ctx = cv.getContext("2d"), TH = P.TH; ctx.clearRect(0, 0, cv.width, cv.height);
    const x1 = Math.max(iouA.x - iouA.w / 2, iouB.x - iouB.w / 2), y1 = Math.max(iouA.y - iouA.h / 2, iouB.y - iouB.h / 2), x2 = Math.min(iouA.x + iouA.w / 2, iouB.x + iouB.w / 2), y2 = Math.min(iouA.y + iouA.h / 2, iouB.y + iouB.h / 2);
    for (const [b, c] of [[iouA, TH.violet], [iouB, TH.mint]]) { ctx.fillStyle = c; ctx.globalAlpha = 0.12; ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h); ctx.globalAlpha = 1; ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.strokeRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h); }
    if (x2 > x1 && y2 > y1) { ctx.fillStyle = TH.amber; ctx.globalAlpha = 0.55; ctx.fillRect(x1, y1, x2 - x1, y2 - y1); ctx.globalAlpha = 1; }
    const inter = Math.max(0, x2 - x1) * Math.max(0, y2 - y1), uni = area(iouA) + area(iouB) - inter, v = inter / uni;
    ctx.fillStyle = TH.ink; ctx.font = "700 15px JetBrains Mono, monospace"; ctx.fillText(`IoU = giao / hợp = ${Math.round(inter)} / ${Math.round(uni)} = ${v.toFixed(2)}`, 14, 26);
    ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillStyle = TH.text; ctx.fillText(v >= ST.nmsIou ? `≥ ${ST.nmsIou.toFixed(2)}: NMS coi là cùng một xe, xóa khung yếu hơn` : `< ${ST.nmsIou.toFixed(2)}: NMS coi là hai xe khác nhau`, 14, 290);
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${k("let")} khung = moHinh.phatHien(anh);                 ${c("// khung thô")}
khung = khung.filter(k => k.tinCay &gt;= ${n(ST.conf.toFixed(2))});       ${c("// 1. lọc ngưỡng")}
${ST.nms ? `khung = nms(khung, ${n(ST.nmsIou.toFixed(2))});                     ${c("// 2. xóa khung trùng")}` : c("// 2. (NMS đang tắt)")}
${k("for")} (${k("const")} id ${k("of")} dangTheoDoi) {                      ${c("// 3. theo dõi")}
  ${k("const")} viTriDoan = ${ST.predict ? "id.viTri + id.vanToc * dt" : "id.viTri"};
  ${k("const")} k = khungCoIoULonNhat(viTriDoan, khung);
  ${k("if")} (k) capNhat(id, k); ${k("else")} id.mat += dt;
}
xoaIdMatQua(${n(ST.maxAge.toFixed(1))} ${c("/* giây */")}); taoIdMoiChoKhungThua();
${k("if")} (vuotVach(id) && !id.daDem) { dem[id.loai]++; id.daDem = ${k("true")}; }  ${c("// 4. đếm")}`;
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = () => useReal(null);
    $("srcVid").onchange = (e) => e.target.files[0] && useReal(e.target.files[0]);
    $("btnReset").onclick = resetCounts;
    for (const k of ["raw", "boxes", "ids"]) $("show" + k[0].toUpperCase() + k.slice(1)).onchange = (e) => (ST.show[k] = e.target.checked);
    syncs.push(P.range("conf", () => ST.conf, (v) => (ST.conf = v), (v) => Math.round(v * 100) + "%", () => { genCode(); prog.done("tune"); }));
    syncs.push(P.range("nmsIou", () => ST.nmsIou, (v) => (ST.nmsIou = v), (v) => v.toFixed(2), genCode));
    syncs.push(P.range("maxAge", () => ST.maxAge, (v) => (ST.maxAge = v), (v) => v.toFixed(1) + " s", genCode));
    syncs.push(P.range("detHz", () => ST.detHz, (v) => (ST.detHz = v), (v) => v + " ảnh/giây"));
    $("nms").onchange = (e) => { ST.nms = e.target.checked; genCode(); }; $("predict").onchange = (e) => { ST.predict = e.target.checked; genCode(); };
    const cv = $("iouCanvas"); let drag = null;
    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; };
    cv.addEventListener("pointerdown", (e) => { const p = pos(e); for (const b of [iouB, iouA]) if (Math.abs(p.x - b.x) < b.w / 2 && Math.abs(p.y - b.y) < b.h / 2) { drag = { b, dx: p.x - b.x, dy: p.y - b.y }; cv.setPointerCapture(e.pointerId); break; } });
    cv.addEventListener("pointermove", (e) => { if (!drag) return; const p = pos(e); drag.b.x = p.x - drag.dx; drag.b.y = p.y - drag.dy; prog.done("iou"); });
    cv.addEventListener("pointerup", () => (drag = null));
    const sync = () => { syncs.forEach((f) => f()); $("nms").checked = ST.nms; $("predict").checked = ST.predict; genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF);
      if (k === "low") ST.conf = 0.12;
      if (k === "nonms") ST.nms = false;
      if (k === "lag") { ST.detHz = 3; ST.predict = false; ST.maxAge = 0.2; ST.rush = true; }
      if (ST.src !== "sim") useSim();
      sync(); resetCounts(); prog.done("broke");
      $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); sync(); resetCounts(); };
    sync();
  }

  const QUIZ = [
    { q: "Một khung bao có độ tin cậy 0,35 và ngưỡng đang là 0,5. Khung đó sẽ…", o: ["Được giữ lại", "Bị loại bỏ", "Được nhân đôi", "Được đổi thành ô tô"], a: 1, e: "Chỉ những khung có độ tin cậy từ ngưỡng trở lên mới được giữ." },
    { q: "Hai khung có diện tích giao nhau 600, diện tích hợp 1000. IoU bằng…", o: ["0,4", "0,6", "1,6", "600"], a: 1, e: "IoU = giao / hợp = 600 / 1000 = 0,6." },
    { q: "NMS (non-maximum suppression) dùng để làm gì?", o: ["Tăng độ sáng ảnh", "Xóa các khung trùng lặp trên cùng một vật, chỉ giữ khung tự tin nhất", "Đếm xe", "Đổi màu khung"], a: 1, e: "Mô hình thường đưa ra nhiều khung chồng lên cùng một xe. Không có NMS, một xe có thể bị tính thành nhiều xe." },
    { q: "Camera chỉ chụp 3 ảnh/giây, xe chạy nhanh nên khung ở hai ảnh liên tiếp không chồng lên nhau. Điều gì xảy ra?", o: ["Không ảnh hưởng", "Bộ theo dõi tưởng là xe mới, cấp ID mới, nên có thể đếm một xe hai lần", "Xe biến mất", "AI chạy nhanh hơn"], a: 1, e: "Dự đoán vị trí tiếp theo dựa vào vận tốc giúp bộ theo dõi nối đúng ID dù xe di chuyển xa giữa hai ảnh." },
    { q: "Khi dùng camera AI đếm xe ngoài đường, điều gì nên cân nhắc về quyền riêng tư?", o: ["Không cần gì", "Chỉ lưu số đếm, không lưu ảnh mặt người hay biển số nếu không cần thiết", "Lưu mọi video mãi mãi", "Đăng video lên mạng"], a: 1, e: "Chỉ thu thập đúng dữ liệu cần cho mục đích (số lượng xe) là nguyên tắc quan trọng khi làm AI." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0, histT = 0;
  async function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.src === "sim") {
      stepWorld(dt);
      if (ST.t - ST.lastDet >= 1 / ST.detHz) { const ddt = ST.t - ST.lastDet; ST.lastDet = ST.t; pipeline(detectSim(), ddt); }
    } else if (ST.t - ST.lastDet >= 1 / Math.min(ST.detHz, 8)) { const ddt = ST.t - ST.lastDet; const r = await detectReal(); if (r) { ST.lastDet = ST.t; pipeline(r, ddt); } }
    if (ST.t - histT > 0.5) { histT = ST.t; ST.hist.push({ t: ST.t, a: KEYS.reduce((x, k) => x + ST.countAI[k], 0), t2: ST.src === "sim" ? KEYS.reduce((x, k) => x + ST.countTrue[k], 0) : null }); while (ST.hist.length && ST.hist[0].t < ST.t - 61) ST.hist.shift(); }
    renderStage(); renderChart(); renderIou();
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; renderBrain(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); bind(); P.srcButtons("sim");
  requestAnimationFrame(tick);
})();
