/* Hộp Kính AI · Dự án 01 · Huấn luyện viên Squat
   Một đường xử lý dùng chung cho 3 nguồn: mô phỏng, camera, video tải lên. */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const MP_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
  const MODEL_URL = "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task";
  const CONN = [[11,12],[11,13],[13,15],[12,14],[14,16],[11,23],[12,24],[23,24],[23,25],[25,27],[24,26],[26,28],[27,29],[29,31],[27,31],[28,30],[30,32],[28,32],[15,17],[15,19],[15,21],[17,19],[16,18],[16,20],[16,22],[18,20],[0,1],[1,2],[2,3],[3,7],[0,4],[4,5],[5,6],[6,8],[9,10]];
  const NAMES = ["mũi","mắt T trong","mắt T","mắt T ngoài","mắt P trong","mắt P","mắt P ngoài","tai T","tai P","miệng T","miệng P","vai T","vai P","khuỷu T","khuỷu P","cổ tay T","cổ tay P","ngón út T","ngón út P","ngón trỏ T","ngón trỏ P","ngón cái T","ngón cái P","hông T","hông P","gối T","gối P","cổ chân T","cổ chân P","gót T","gót P","mũi chân T","mũi chân P"];
  const SIDES = { T: [23, 25, 27], P: [24, 26, 28] };
  const DEF = { down: 90, up: 160, countMode: "up", smooth: 0.6, minVis: 0.5 };

  // ---------------- trạng thái ----------------
  const ST = {
    src: "sim", paused: false, stepOnce: false, simT: 0, speed: 1, depth: 1, yaw: 90, mirror: false,
    show: { img: true, skel: true, idx: false, angle: true },
    ...DEF, breaks: { noise: false, occlude: false },
    lm: null, raw: NaN, sm: NaN, state: "DUNG", count: 0, skipped: false, side: "P", used: [24, 26, 28],
    minRep: 180, repStart: 0, reps: [], hist: [], time: 0, dipMin: 180, coach: null, coachT: 0,
    fired: { r1: 0, r2: 0 }, soiStep: 0, noPerson: false
  };
  let progress = {};
  try { progress = JSON.parse(localStorage.getItem("hka-01") || "{}"); } catch (e) {}

  const stage = $("stage"), sctx = stage.getContext("2d");
  const soi = $("soiCanvas"), octx = soi.getContext("2d", { willReadFrequently: true });
  const chart = $("chart"), cctx = chart.getContext("2d");
  const video = $("video");

  // ---------------- toán ----------------
  function angleAt(A, B, C) {
    const v1x = A.x - B.x, v1y = A.y - B.y, v2x = C.x - B.x, v2y = C.y - B.y;
    const m = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y) || 1;
    return Math.acos(Math.max(-1, Math.min(1, (v1x * v2x + v1y * v2y) / m))) * 180 / Math.PI;
  }
  function depthProfile(t) {
    const p = (t % 2.6) / 2.6, e = (x) => x * x * (3 - 2 * x);
    let d = 0;
    if (p < 0.12) d = 0; else if (p < 0.45) d = e((p - 0.12) / 0.33);
    else if (p < 0.58) d = 1; else if (p < 0.9) d = 1 - e((p - 0.58) / 0.32); else d = 0;
    return d * ST.depth;
  }

  // ---------------- xử lý 1 khung hình ----------------
  function process(lm, dt) {
    ST.time += dt;
    const vis = (k) => Math.min(...SIDES[k].map((i) => lm[i].v));
    ST.side = vis("P") >= vis("T") ? "P" : "T";
    ST.used = SIDES[ST.side];
    const [A, B, C] = ST.used.map((i) => lm[i]);
    const vmin = Math.min(A.v, B.v, C.v);
    ST.raw = angleAt(A, B, C);
    if (vmin < ST.minVis) {
      ST.skipped = true;
      pushHist(null); return;
    }
    ST.skipped = false;
    ST.sm = isNaN(ST.sm) ? ST.raw : ST.smooth * ST.sm + (1 - ST.smooth) * ST.raw;
    let ev = null;
    if (ST.state === "DUNG" && ST.sm < ST.down) {
      ST.state = "NGOI"; ST.minRep = ST.sm; ST.fired.r1 = performance.now(); ST.dipMin = 180;
    } else if (ST.state === "NGOI" && ST.sm > ST.up) {
      ST.state = "DUNG"; ST.fired.r2 = performance.now();
      if (ST.countMode === "up") { ST.count++; ev = "count"; addRep(); }
    }
    if (ST.state === "NGOI") ST.minRep = Math.min(ST.minRep, ST.sm);
    else {
      if (ST.sm < ST.up - 12) ST.dipMin = Math.min(ST.dipMin, ST.sm);
      else if (ST.dipMin < ST.up - 12) {
        coach(`Chưa đủ sâu! Mới xuống tới ${ST.dipMin.toFixed(0)}°, cần dưới ${ST.down}°`);
        ST.dipMin = 180;
      }
    }
    pushHist(ev);
  }
  function pushHist(ev) {
    ST.hist.push({ t: ST.time, raw: ST.raw, sm: ST.sm, skip: ST.skipped, ev });
    while (ST.hist.length && ST.hist[0].t < ST.time - 10) ST.hist.shift();
  }
  function addRep() {
    const a = ST.minRep, dur = ST.time - ST.repStart; ST.repStart = ST.time;
    const stars = a <= 80 ? 3 : a <= 95 ? 2 : 1;
    ST.reps.push({ n: ST.count, a, dur, stars });
    coach(a <= 80 ? "Tuyệt! Squat rất sâu" : "Đạt! Thử hạ thấp thêm chút nữa");
    if (ST.count >= 5) done("count5");
    renderReps();
  }
  function coach(msg) { ST.coach = msg; ST.coachT = performance.now(); }

  // ---------------- nguồn hình ảnh ----------------
  let landmarker = null, stream = null, lastVT = -1;
  async function ensureModel() {
    if (landmarker) return;
    const mp = await import(MP_URL + "/vision_bundle.mjs");
    const fs = await mp.FilesetResolver.forVisionTasks(MP_URL + "/wasm");
    landmarker = await mp.PoseLandmarker.createFromOptions(fs, {
      baseOptions: { modelAssetPath: MODEL_URL, delegate: "GPU" }, runningMode: "VIDEO", numPoses: 1
    });
  }
  function msg(t, ic) { const m = $("stageMsg"); if (!t) { m.hidden = true; return; } m.hidden = false; m.innerHTML = HKA.icon(ic || "alert", ic === "loader" ? "spin" : "") + "<span>" + t + "</span>"; }
  function setSrcButtons() {
    $("srcSim").setAttribute("aria-pressed", ST.src === "sim");
    $("srcCam").setAttribute("aria-pressed", ST.src === "cam");
    $("srcSim").classList.toggle("ghost", ST.src !== "sim");
    $("srcCam").classList.toggle("ghost", ST.src !== "cam");
    $("srcVidLabel").classList.toggle("ghost", ST.src !== "vid");
    document.querySelector(".sim-only").hidden = ST.src !== "sim";
    $("srcTag").textContent = { sim: "MÔ PHỎNG", cam: "CAMERA", vid: "VIDEO" }[ST.src];
  }
  function stopStream() { if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; } video.pause(); }
  function sizeTo(w, h) { const H = Math.round(640 * h / w); for (const c of [stage, soi]) { c.width = 640; c.height = H; } }
  function useSim() { stopStream(); ST.src = "sim"; ST.mirror = false; sizeTo(640, 480); setSrcButtons(); msg(null); resetCount(); }
  const FAIL = "Trên trang GitHub Pages của dự án, camera sẽ hoạt động khi em bấm <b>Cho phép</b>. Bây giờ em hãy dùng chế độ <b>Mô phỏng</b> nhé.";
  async function useCam() {
    msg("Đang tải mô hình AI (khoảng 6 MB, chỉ tải lần đầu)…", "loader");
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("trình duyệt hoặc trang xem trước này không cho dùng camera");
      await ensureModel();
      stopStream();
      stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } });
      video.srcObject = stream; await video.play();
      sizeTo(video.videoWidth || 640, video.videoHeight || 480);
      ST.src = "cam"; ST.mirror = true; setSrcButtons(); msg(null); resetCount();
    } catch (e) {
      useSim(); msg("Chưa bật được camera (" + (e && e.message ? e.message : e) + "). " + FAIL);
      setTimeout(() => msg(null), 9000);
    }
  }
  async function useVideo(file) {
    msg("Đang tải mô hình AI…", "loader");
    try {
      await ensureModel(); stopStream();
      video.srcObject = null; video.src = URL.createObjectURL(file); video.loop = true;
      await video.play();
      sizeTo(video.videoWidth, video.videoHeight);
      ST.src = "vid"; ST.mirror = false; setSrcButtons(); msg(null); resetCount();
    } catch (e) { useSim(); msg("Chưa chạy được mô hình AI ở đây (" + (e.message || e) + "). Hãy mở trang trên GitHub Pages."); setTimeout(() => msg(null), 9000); }
  }
  function detect() {
    if (!landmarker || video.readyState < 2) return ST.lm;
    if (video.currentTime === lastVT) return ST.lm;
    lastVT = video.currentTime;
    const r = landmarker.detectForVideo(video, performance.now());
    const p = r.landmarks && r.landmarks[0];
    if (!p) { ST.noPerson = true; return null; }
    ST.noPerson = false;
    const W = stage.width, H = stage.height;
    return p.map((q) => ({ x: (ST.mirror ? 1 - q.x : q.x) * W, y: q.y * H, v: q.visibility == null ? 1 : q.visibility }));
  }

  // ---------------- vẽ ----------------
  function drawImageLayer(ctx, faded) {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    if (ST.src === "sim") {
      PoseSim.drawBackground(ctx, W, H, TH.dark);
      if (ST.lm && ST.lm.raw) PoseSim.drawBody(ctx, ST.lm);
    } else if (video.readyState >= 2) {
      ctx.save();
      if (ST.mirror) { ctx.translate(W, 0); ctx.scale(-1, 1); }
      ctx.drawImage(video, 0, 0, W, H); ctx.restore();
    } else { ctx.fillStyle = "#20244a"; ctx.fillRect(0, 0, W, H); }
    if (faded) { ctx.fillStyle = `rgba(18,21,48,${faded})`; ctx.fillRect(0, 0, W, H); }
  }
  function darkBg(ctx) {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    ctx.fillStyle = "#151935"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#232860"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  }
  const visCol = (v) => v > 0.75 ? "#5ef2d6" : v > 0.5 ? "#ffbf2e" : "#ff6b4a";
  function drawSkeleton(ctx, lm, o) {
    o = o || {};
    const used = new Set(ST.used);
    ctx.lineWidth = 3; ctx.lineCap = "round";
    for (const [a, b] of CONN) {
      const dim = o.focus && !(used.has(a) && used.has(b));
      ctx.strokeStyle = dim ? "rgba(255,255,255,.12)" : (used.has(a) && used.has(b) ? "#ffd166" : "rgba(255,255,255,.75)");
      ctx.lineWidth = used.has(a) && used.has(b) ? 5 : 3;
      ctx.beginPath(); ctx.moveTo(lm[a].x, lm[a].y); ctx.lineTo(lm[b].x, lm[b].y); ctx.stroke();
    }
    lm.forEach((p, i) => {
      const u = used.has(i);
      if (o.focus && !u) { ctx.fillStyle = "rgba(255,255,255,.18)"; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 7); ctx.fill(); return; }
      ctx.fillStyle = visCol(p.v); ctx.beginPath(); ctx.arc(p.x, p.y, u ? 7 : 4.5, 0, 7); ctx.fill();
      if (u) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); }
      if (o.idx) { ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillStyle = "#fff"; ctx.strokeStyle = "rgba(0,0,0,.6)"; ctx.lineWidth = 3; ctx.strokeText(i, p.x + 6, p.y - 6); ctx.fillText(i, p.x + 6, p.y - 6); }
    });
  }
  function drawAngle(ctx, lm, big) {
    const [A, B, C] = ST.used.map((i) => lm[i]);
    const a1 = Math.atan2(A.y - B.y, A.x - B.x), a2 = Math.atan2(C.y - B.y, C.x - B.x);
    let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    const col = ST.state === "NGOI" ? "#11b5a4" : "#6d5dfc";
    ctx.fillStyle = col + "55"; ctx.strokeStyle = col; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(B.x, B.y); ctx.arc(B.x, B.y, big ? 46 : 34, a1, a1 + d, d < 0); ctx.closePath(); ctx.fill(); ctx.stroke();
    const mid = a1 + d / 2, val = isNaN(ST.sm) ? ST.raw : ST.sm;
    const tx = B.x + Math.cos(mid) * (big ? 74 : 60) * -1, ty = B.y + Math.sin(mid) * (big ? 74 : 60) * -1;
    pill(ctx, `${val.toFixed(0)}°`, tx, ty, col, big ? 20 : 16);
  }
  function pill(ctx, t, x, y, bg, fs) {
    ctx.font = `700 ${fs}px JetBrains Mono, monospace`;
    const w = ctx.measureText(t).width + 16, h = fs + 12;
    ctx.fillStyle = bg; roundRect(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y + 1);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function arrow(ctx, from, to, col) {
    const a = Math.atan2(to.y - from.y, to.x - from.x);
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(from.x, from.y); ctx.lineTo(to.x - 10 * Math.cos(a), to.y - 10 * Math.sin(a)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(to.x, to.y); ctx.lineTo(to.x - 16 * Math.cos(a - 0.4), to.y - 16 * Math.sin(a - 0.4)); ctx.lineTo(to.x - 16 * Math.cos(a + 0.4), to.y - 16 * Math.sin(a + 0.4)); ctx.closePath(); ctx.fill();
  }
  function hud(ctx) {
    const W = ctx.canvas.width;
    ctx.fillStyle = "rgba(18,21,48,.82)"; roundRect(ctx, 14, 14, 150, 64, 16); ctx.fill();
    ctx.fillStyle = "#9aa0d6"; ctx.font = "600 12px Be Vietnam Pro, sans-serif"; ctx.fillText("SỐ LẦN SQUAT", 28, 36);
    ctx.fillStyle = "#5ef2d6"; ctx.font = "700 30px JetBrains Mono, monospace"; ctx.fillText(ST.count, 28, 68);
    ctx.fillStyle = ST.state === "NGOI" ? "#11b5a4" : "#6d5dfc"; roundRect(ctx, 84, 46, 70, 24, 12); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "700 12px JetBrains Mono, monospace"; ctx.fillText(ST.state === "NGOI" ? "NGỒI" : "ĐỨNG", 98, 63);
    if (ST.skipped) pill(ctx, "BỎ QUA · AI không chắc chắn", W / 2, 34, "#c2402a", 14);
    else if (ST.noPerson && ST.src !== "sim") pill(ctx, "Không thấy người trong khung hình", W / 2, 34, "#c2402a", 14);
    if (ST.coach && performance.now() - ST.coachT < 1800) pill(ctx, ST.coach, W / 2, ctx.canvas.height - 30, "#1b1f3b", 15);
  }
  function renderStage() {
    if (ST.show.img) drawImageLayer(sctx); else darkBg(sctx);
    if (ST.lm) {
      if (ST.show.skel) drawSkeleton(sctx, ST.lm, { idx: ST.show.idx });
      if (ST.show.angle) drawAngle(sctx, ST.lm);
    }
    hud(sctx);
  }

  // ---------------- SOI BÊN TRONG ----------------
  const SOI = [
    { t: "Ảnh đầu vào", e: "image", d: "Với máy tính, một khung hình chỉ là một bảng số khổng lồ. Mỗi điểm ảnh gồm 3 số Đỏ–Xanh lá–Xanh dương (0–255). Ô phóng to bên phải cho em thấy các điểm ảnh quanh đầu gối." },
    { t: "AI tìm 33 điểm", e: "robot", d: "Mô hình AI (mạng nơ-ron đã được huấn luyện từ trước) nhận bảng số đó và trả về 33 điểm mốc. Màu của điểm cho biết độ tin cậy: <b style='color:var(--mint)'>xanh</b> là chắc chắn, <b style='color:var(--amber)'>vàng</b> là tạm được, <b style='color:var(--coral)'>đỏ</b> là không chắc." },
    { t: "Chọn 3 điểm", e: "crosshair", d: "Để đo độ gập chân, ta chỉ cần 3 điểm: <b>hông – gối – cổ chân</b>. Chương trình tự chọn bên chân mà AI nhìn rõ hơn (độ tin cậy cao hơn), và bỏ qua khung hình nếu độ tin cậy quá thấp." },
    { t: "Tính góc", e: "angle", d: "Từ 3 điểm ta lập hai vector <b>BA</b> (gối→hông) và <b>BC</b> (gối→cổ chân), rồi dùng công thức tích vô hướng để ra góc. Đây là toán Hình học 10!" },
    { t: "Máy trạng thái", e: "repeat", d: "Chương trình nhớ em đang <b>ĐỨNG</b> hay <b>NGỒI</b>. Nó chỉ đổi trạng thái khi góc vượt qua ngưỡng. Hai ngưỡng tách xa nhau tạo ra vùng đệm chống đếm nhầm." },
    { t: "Đếm & nhận xét", e: "checkCircle", d: "Mỗi lần đi từ NGỒI trở lại ĐỨNG được tính <b>+1</b>. Góc nhỏ nhất trong lần đó cho biết em squat sâu đến đâu. Vậy là xong: từ điểm ảnh đã ra được lời khuyên!" }
  ];
  function buildPipeline() {
    const svg = $("pipeline"); let h = "";
    const W = 158, gap = (1100 - 6 * W) / 5;
    for (let i = 0; i < 5; i++) { const x1 = i * (W + gap) + W, x2 = x1 + gap; h += `<line x1="${x1}" y1="62" x2="${x2}" y2="62" style="stroke:var(--line-strong)" stroke-width="2"/><line class="flow" x1="${x1}" y1="62" x2="${x2}" y2="62" style="stroke:var(--violet)" stroke-width="2.5"/>`; }
    SOI.forEach((s, i) => {
      const x = i * (W + gap);
      h += `<g class="node" data-i="${i}" role="tab" tabindex="0"><rect x="${x}" y="18" width="${W}" height="88" rx="14" stroke-width="1.5"/>` +
        `<text x="${x + 14}" y="38" font-size="11" font-weight="700" class="t-mono nlab" aria-hidden="true">${String(i + 1).padStart(2, "0")}</text>` +
        `<svg x="${x + W / 2 - 13}" y="30" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="nic">${HKA.icon(s.e).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>` +
        `<text x="${x + W / 2}" y="84" text-anchor="middle" font-weight="700" font-size="14" class="ntx">${s.t}</text></g>`;
    });
    svg.innerHTML = h;
    svg.querySelectorAll(".node").forEach((n) => {
      const go = () => setSoi(+n.dataset.i);
      n.addEventListener("click", go); n.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
  }
  function setSoi(i) {
    ST.soiStep = Math.max(0, Math.min(5, i));
    $("pipeline").querySelectorAll(".node").forEach((n, k) => {
      const on = k === ST.soiStep, past = k < ST.soiStep;
      const r = n.querySelector("rect");
      r.style.fill = on ? "var(--violet)" : past ? "var(--violet-soft)" : "var(--surface-solid)";
      r.style.stroke = on ? "var(--violet)" : past ? "color-mix(in srgb,var(--violet) 40%,transparent)" : "var(--line-strong)";
      n.querySelector(".ntx").style.fill = on ? "#fff" : "var(--text)";
      n.querySelector(".nlab").style.fill = on ? "rgba(255,255,255,.7)" : "var(--muted)";
      n.querySelector(".nic").style.stroke = on ? "#fff" : "var(--violet)";
    });
    $("soiChip").textContent = `BƯỚC ${ST.soiStep + 1}/6`;
    $("soiTitle").innerHTML = `<span class="ico-box sm">${HKA.icon(SOI[ST.soiStep].e)}</span>` + SOI[ST.soiStep].t;
    $("soiText").innerHTML = "<p>" + SOI[ST.soiStep].d + "</p>";
    $("soiPrev").disabled = ST.soiStep === 0; $("soiNext").disabled = ST.soiStep === 5;
    if (ST.soiStep >= 1) done("see33");
  }
  function renderSoi() {
    const ctx = octx, W = soi.width, H = soi.height, lm = ST.lm, s = ST.soiStep;
    if (s === 0) {
      drawImageLayer(ctx);
      if (lm) {
        const k = lm[ST.used[1]], zx = Math.max(0, Math.min(W - 32, k.x - 16)), zy = Math.max(0, Math.min(H - 24, k.y - 12));
        ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 2; ctx.strokeRect(zx, zy, 32, 24);
        const bx = W - 214, by = 14;
        ctx.imageSmoothingEnabled = false; ctx.drawImage(soi, zx, zy, 32, 24, bx, by, 200, 150); ctx.imageSmoothingEnabled = true;
        ctx.strokeStyle = "#ffd166"; ctx.lineWidth = 3; ctx.strokeRect(bx, by, 200, 150);
        ctx.beginPath(); ctx.moveTo(zx + 32, zy); ctx.lineTo(bx, by + 150); ctx.stroke();
        ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1;
        for (let i = 1; i < 32; i++) { ctx.beginPath(); ctx.moveTo(bx + i * 6.25, by); ctx.lineTo(bx + i * 6.25, by + 150); ctx.stroke(); }
        for (let i = 1; i < 24; i++) { ctx.beginPath(); ctx.moveTo(bx, by + i * 6.25); ctx.lineTo(bx + 200, by + i * 6.25); ctx.stroke(); }
        try { const px = ctx.getImageData(Math.round(k.x), Math.round(k.y), 1, 1).data; ST.px = [px[0], px[1], px[2]]; } catch (e) { ST.px = null; }
      }
    } else if (s === 1) {
      drawImageLayer(ctx, 0.55); if (lm) drawSkeleton(ctx, lm, { idx: true });
    } else if (s === 2) {
      drawImageLayer(ctx, 0.7); if (lm) { drawSkeleton(ctx, lm, { focus: true }); const nm = ["A · hông", "B · gối", "C · cổ chân"]; ST.used.forEach((i, k) => pill(ctx, nm[k], lm[i].x - 70, lm[i].y, ["#ff6b4a", "#6d5dfc", "#11b5a4"][k], 13)); }
    } else if (s === 3) {
      darkBg(ctx);
      if (lm) {
        const [A, B, C] = ST.used.map((i) => lm[i]);
        drawAngle(ctx, lm, true); arrow(ctx, B, A, "#ff6b4a"); arrow(ctx, B, C, "#11b5a4");
        for (const [p, l, c] of [[A, "A", "#ff6b4a"], [B, "B", "#6d5dfc"], [C, "C", "#11b5a4"]]) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "700 14px JetBrains Mono"; ctx.fillText(l, p.x + 14, p.y + 5); }
        ctx.fillStyle = "#ff6b4a"; ctx.font = "700 15px JetBrains Mono"; ctx.fillText("BA", (A.x + B.x) / 2 + 10, (A.y + B.y) / 2);
        ctx.fillStyle = "#11b5a4"; ctx.fillText("BC", (C.x + B.x) / 2 + 10, (C.y + B.y) / 2);
      }
    } else if (s === 4) {
      darkBg(ctx); drawStateMachine(ctx, W, H);
    } else {
      drawImageLayer(ctx, 0.35); if (lm) { drawSkeleton(ctx, lm); drawAngle(ctx, lm); }
      hud(ctx);
    }
  }
  function drawStateMachine(ctx, W, H) {
    const cy = H * 0.42, r = 70, xs = [W * 0.27, W * 0.73], now = performance.now();
    const st = [["DUNG", "ĐỨNG", "#6d5dfc"], ["NGOI", "NGỒI", "#11b5a4"]];
    const f1 = now - ST.fired.r1 < 600, f2 = now - ST.fired.r2 < 600;
    ctx.lineWidth = 4;
    ctx.strokeStyle = f1 ? "#ffd166" : "#4b52a8"; ctx.beginPath(); ctx.moveTo(xs[0] + 50, cy - 50); ctx.quadraticCurveTo(W / 2, cy - 140, xs[1] - 50, cy - 50); ctx.stroke();
    ctx.strokeStyle = f2 ? "#ffd166" : "#4b52a8"; ctx.beginPath(); ctx.moveTo(xs[1] - 50, cy + 50); ctx.quadraticCurveTo(W / 2, cy + 140, xs[0] + 50, cy + 50); ctx.stroke();
    pill(ctx, `góc < ${ST.down}°`, W / 2, cy - 96, f1 ? "#c48a00" : "#2b2f6a", 14);
    pill(ctx, `góc > ${ST.up}°  →  +1`, W / 2, cy + 96, f2 ? "#c48a00" : "#2b2f6a", 14);
    st.forEach(([k, label, col], i) => {
      const on = ST.state === k;
      ctx.fillStyle = on ? col : "#1f2350"; ctx.strokeStyle = col; ctx.lineWidth = on ? 6 : 3;
      ctx.beginPath(); ctx.arc(xs[i], cy, r, 0, 7); ctx.fill(); ctx.stroke();
      ctx.fillStyle = "#fff"; ctx.font = "800 22px Be Vietnam Pro, sans-serif"; ctx.textAlign = "center"; ctx.fillText(label, xs[i], cy + 8); ctx.textAlign = "left";
    });
    // thước góc
    const y = H - 52, x0 = 40, x1 = W - 40, X = (a) => x0 + (a / 180) * (x1 - x0);
    ctx.fillStyle = "#11b5a4"; ctx.fillRect(x0, y, X(ST.down) - x0, 14);
    ctx.fillStyle = "#3a3f7a"; ctx.fillRect(X(ST.down), y, X(ST.up) - X(ST.down), 14);
    ctx.fillStyle = "#6d5dfc"; ctx.fillRect(X(ST.up), y, x1 - X(ST.up), 14);
    ctx.fillStyle = "#9aa0d6"; ctx.font = "12px JetBrains Mono"; ctx.fillText("0°", x0, y + 32); ctx.fillText("180°", x1 - 30, y + 32); ctx.fillText("vùng đệm", (X(ST.down) + X(ST.up)) / 2 - 30, y + 32);
    const v = isNaN(ST.sm) ? 180 : ST.sm;
    ctx.fillStyle = "#ffd166"; ctx.beginPath(); ctx.moveTo(X(v), y - 2); ctx.lineTo(X(v) - 8, y - 16); ctx.lineTo(X(v) + 8, y - 16); ctx.closePath(); ctx.fill();
    ctx.font = "700 13px JetBrains Mono"; ctx.fillText(v.toFixed(0) + "°", X(v) - 14, y - 22);
  }
  function soiLive() {
    const lm = ST.lm, s = ST.soiStep, el = $("soiLive"); if (!lm) { el.textContent = "Đang chờ dữ liệu…"; return; }
    const [A, B, C] = ST.used.map((i) => lm[i]), f = (n) => n.toFixed(0);
    if (s === 0) {
      const W = soi.width, H = soi.height, px = ST.px;
      el.innerHTML = `Kích thước ảnh: <span class="hl">${W} × ${H}</span> = ${(W * H).toLocaleString("vi-VN")} điểm ảnh\n× 3 kênh màu = <span class="hl">${(W * H * 3).toLocaleString("vi-VN")} con số</span> mỗi khung hình\nĐiểm ảnh tại đầu gối: ${px ? `<span class="w">R=${px[0]} G=${px[1]} B=${px[2]}</span>` : "—"}`;
    } else if (s === 1) {
      const pick = [0, 11, 23, 25, 27, 31];
      el.innerHTML = `AI trả về <span class="hl">33 điểm × (x, y, độ tin cậy)</span>\n` + pick.map((i) => `#${String(i).padStart(2, " ")} ${NAMES[i].padEnd(11, " ")} (${f(lm[i].x)}, ${f(lm[i].y)})  <span class="${lm[i].v > .75 ? "hl" : "w"}">${lm[i].v.toFixed(2)}</span>`).join("\n");
    } else if (s === 2) {
      el.innerHTML = `Bên chân được chọn: <span class="hl">${ST.side === "P" ? "PHẢI (24·26·28)" : "TRÁI (23·25·27)"}</span>\n` + [["A hông", A], ["B gối", B], ["C cổ chân", C]].map(([n, p]) => `${n.padEnd(10, " ")} (${f(p.x)}, ${f(p.y)})  tin cậy <span class="${p.v >= ST.minVis ? "hl" : "w"}">${p.v.toFixed(2)}</span>`).join("\n") + `\n${ST.skipped ? '<span class="w">[!] Có điểm dưới ngưỡng ' + ST.minVis.toFixed(2) + ' → bỏ qua khung này</span>' : '<span class="hl">[OK]</span> Đủ tin cậy, tiếp tục tính'}`;
    } else if (s === 3) {
      const ba = [A.x - B.x, A.y - B.y], bc = [C.x - B.x, C.y - B.y], dot = ba[0] * bc[0] + ba[1] * bc[1], m1 = Math.hypot(...ba), m2 = Math.hypot(...bc);
      el.innerHTML = `BA = A − B = (<span class="w">${f(ba[0])}, ${f(ba[1])}</span>)\nBC = C − B = (<span class="w">${f(bc[0])}, ${f(bc[1])}</span>)\nBA·BC = ${f(dot)}   |BA| = ${f(m1)}   |BC| = ${f(m2)}\ncos θ = ${f(dot)} / (${f(m1)} × ${f(m2)}) = ${(dot / (m1 * m2 || 1)).toFixed(3)}\nθ = <span class="hl">${ST.raw.toFixed(1)}°</span>  → làm mượt → <span class="hl">${isNaN(ST.sm) ? "—" : ST.sm.toFixed(1) + "°"}</span>`;
    } else if (s === 4) {
      el.innerHTML = `Trạng thái hiện tại: <span class="hl">${ST.state === "NGOI" ? "NGỒI" : "ĐỨNG"}</span>\nGóc (đã làm mượt): <span class="hl">${isNaN(ST.sm) ? "—" : ST.sm.toFixed(0) + "°"}</span>\nĐỨNG → NGỒI khi góc < <span class="w">${ST.down}°</span>\nNGỒI → ĐỨNG khi góc > <span class="w">${ST.up}°</span> (và đếm +1)`;
    } else {
      const last = ST.reps[ST.reps.length - 1];
      el.innerHTML = `Tổng số lần: <span class="hl">${ST.count}</span>\n` + (last ? `Lần gần nhất: sâu nhất <span class="hl">${last.a.toFixed(0)}°</span> · ${last.dur.toFixed(1)} giây · ${last.stars}/3 sao` : "Chưa có lần nào. Chờ nhân vật squat xong nhé!");
    }
  }

  // ---------------- BỘ NÃO AI (bảng bên phải) ----------------
  function buildGauge() {
    const g = $("gauge"), cx = 110, cy = 112, r = 88;
    const pt = (a, rr) => { const t = Math.PI - (a / 180) * Math.PI; return [cx + rr * Math.cos(t), cy - rr * Math.sin(t)]; };
    const arc = (a0, a1, col) => { const [x0, y0] = pt(a0, r), [x1, y1] = pt(a1, r); return `<path d="M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}" stroke="${col}" stroke-width="14" fill="none"/>`; };
    g.innerHTML = arc(0, ST.down, "#11b5a4") + arc(ST.down, ST.up, "#3a3f7a") + arc(ST.up, 180, "#6d5dfc") +
      `<text x="${pt(ST.down, r + 2)[0]}" y="${pt(ST.down, r + 2)[1] - 10}" fill="#9aa0d6" font-size="10" text-anchor="middle">${ST.down}°</text>` +
      `<text x="${pt(ST.up, r + 2)[0] + 8}" y="${pt(ST.up, r + 2)[1] - 6}" fill="#9aa0d6" font-size="10" text-anchor="middle">${ST.up}°</text>` +
      `<line id="needle" x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy - r + 16}" stroke="#ffd166" stroke-width="4" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="7" fill="#ffd166"/>` +
      `<text id="gaugeV" x="${cx}" y="${cy - 26}" fill="#5ef2d6" font-size="24" font-weight="700" text-anchor="middle">—</text>`;
  }
  function updateBrain() {
    const v = isNaN(ST.sm) ? ST.raw : ST.sm;
    const n = $("needle"); if (n && !isNaN(v)) n.setAttribute("transform", `rotate(${v - 90} 110 112)`);
    const gv = $("gaugeV"); if (gv) gv.textContent = isNaN(v) ? "—" : v.toFixed(0) + "°";
  }
  function updateBrainSlow() {
    $("bCount").textContent = ST.count;
    const bs = $("bState"); bs.textContent = ST.skipped ? "BỎ QUA" : ST.state === "NGOI" ? "NGỒI" : "ĐỨNG";
    bs.className = "state-pill" + (ST.skipped ? " skip" : ST.state === "NGOI" ? " ngoi" : "");
    if (!ST.lm) return;
    const [ia, ib, ic] = ST.used, lm = ST.lm;
    $("bConf").innerHTML = [["gối", ib], ["cổ chân", ic], ["hông", ia]].map(([n, i]) => `<div class="r"><span>${n}</span><span class="bar"><i style="width:${(lm[i].v * 100).toFixed(0)}%;background:${visCol(lm[i].v)}"></i></span><span>${lm[i].v.toFixed(2)}</span></div>`).join("");
    $("bCoords").innerHTML = [["hông #" + ia, ia], ["gối #" + ib, ib], ["cổ chân #" + ic, ic]].map(([n, i]) => `<tr><th scope="row">${n}</th><td>x = ${lm[i].x.toFixed(0)}</td><td>y = ${lm[i].y.toFixed(0)}</td></tr>`).join("");
  }
  function renderReps() {
    $("bReps").innerHTML = ST.reps.length ? ST.reps.slice(-12).map((r) => `<span class="rep">#${r.n} · ${r.a.toFixed(0)}° ${HKA.stars(r.stars)}</span>`).join("") : '<span class="dim">Chưa có lần nào…</span>';
  }

  // ---------------- BIỂU ĐỒ ----------------
  let TH = {};
  function readTheme() { const c = HKA.css; TH = { grid: c("--line"), text: c("--muted"), violet: c("--violet"), mint: c("--mint"), coral: c("--coral"), rose: c("--rose"), dark: HKA.theme() === "dark" }; }
  function renderChart() {
    const ctx = cctx, W = chart.width, H = chart.height, L = 44, R = 14, T = 12, B = 26;
    ctx.clearRect(0, 0, W, H);
    const X = (t) => L + (1 - (ST.time - t) / 10) * (W - L - R), Y = (a) => T + (1 - a / 180) * (H - T - B);
    ctx.font = "11px JetBrains Mono, monospace"; ctx.fillStyle = TH.text;
    for (const a of [0, 45, 90, 135, 180]) { ctx.strokeStyle = TH.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Y(a)); ctx.lineTo(W - R, Y(a)); ctx.stroke(); ctx.fillText(a + "°", 6, Y(a) + 4); }
    ctx.fillText("−10 giây", L, H - 6); ctx.fillText("bây giờ", W - R - 50, H - 6);
    ctx.globalAlpha = TH.dark ? .1 : .07; ctx.fillStyle = TH.mint; ctx.fillRect(L, Y(ST.down), W - L - R, Y(0) - Y(ST.down));
    ctx.fillStyle = TH.violet; ctx.fillRect(L, Y(180), W - L - R, Y(ST.up) - Y(180)); ctx.globalAlpha = 1;
    const hs = ST.hist;
    ctx.fillStyle = TH.coral; ctx.globalAlpha = .18;
    for (let i = 0; i < hs.length; i++) if (hs[i].skip) { const x = X(hs[i].t); ctx.fillRect(x - 2, T, 4, H - T - B); }
    ctx.globalAlpha = 1;
    ctx.setLineDash([6, 5]); ctx.strokeStyle = TH.coral; ctx.lineWidth = 1.5;
    for (const [a, lab] of [[ST.down, "xuống " + ST.down + "°"], [ST.up, "lên " + ST.up + "°"]]) { ctx.beginPath(); ctx.moveTo(L, Y(a)); ctx.lineTo(W - R, Y(a)); ctx.stroke(); ctx.fillStyle = TH.coral; ctx.fillText(lab, W - R - 80, Y(a) - 5); }
    ctx.setLineDash([]);
    const line = (key, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); let s = false; for (const h of hs) { const v = h[key]; if (isNaN(v)) { s = false; continue; } const x = X(h.t), y = Y(v); s ? ctx.lineTo(x, y) : ctx.moveTo(x, y); s = true; } ctx.stroke(); };
    ctx.globalAlpha = .35; line("raw", TH.violet, 1.5); ctx.globalAlpha = 1; line("sm", TH.violet, 3);
    for (const h of hs) if (h.ev === "count") { ctx.fillStyle = TH.rose; ctx.beginPath(); ctx.arc(X(h.t), Y(h.sm), 6, 0, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "700 9px JetBrains Mono"; ctx.fillText("+1", X(h.t) - 6, Y(h.sm) + 3); ctx.font = "11px JetBrains Mono"; }
  }

  // ---------------- LUẬT & CODE ----------------
  function genCode() {
    const now = performance.now(), f1 = now - ST.fired.r1 < 500, f2 = now - ST.fired.r2 < 500;
    const k = (t) => `<span class="k">${t}</span>`, s = (t) => `<span class="s">"${t}"</span>`, n = (t) => `<span class="n">${t}</span>`;
    const cnt = ST.countMode === "up" ? " dem = dem + 1;" : "";
    $("genCode").innerHTML =
`<span class="c">// Luật đếm squat của em — chạy mỗi khung hình</span>
${k("function")} capNhat(goc, trangThai) {
<span class="${f1 ? "flash" : ""}">  ${k("if")} (trangThai === ${s("DUNG")} && goc &lt; ${n(ST.down)}) {
    trangThai = ${s("NGOI")};
  }</span>
<span class="${f2 ? "flash" : ""}">  ${k("if")} (trangThai === ${s("NGOI")} && goc &gt; ${n(ST.up)}) {
    trangThai = ${s("DUNG")};${cnt}
  }</span>
  ${k("return")} trangThai;
}
<span class="c">// làm mượt: gocMuot = ${ST.smooth.toFixed(2)} × gocMuot + ${(1 - ST.smooth).toFixed(2)} × gocMoi</span>
<span class="c">// bỏ qua nếu độ tin cậy &lt; ${ST.minVis.toFixed(2)}</span>`;
  }
  function syncControls() {
    $("rDown").value = ST.down; $("rUp").value = ST.up; $("rCount").value = ST.countMode;
    $("smooth").value = ST.smooth; $("smoothV").textContent = ST.smooth.toFixed(2);
    $("minVis").value = ST.minVis; $("minVisV").textContent = ST.minVis.toFixed(2);
    $("yaw").value = ST.yaw; $("yawV").textContent = ST.yaw + "°";
    buildGauge(); genCode();
  }

  // ---------------- tiến độ ----------------
  const KEYS = ["see33", "count5", "rules", "broke", "quiz"];
  function done(k) { if (progress[k]) return; progress[k] = 1; try { localStorage.setItem("hka-01", JSON.stringify(progress)); } catch (e) {} renderProgress(); }
  function renderProgress() {
    document.querySelectorAll("#checklist li").forEach((li) => li.classList.toggle("done", !!progress[li.dataset.k]));
    $("progressChip").innerHTML = HKA.icon("checkCircle") + `${KEYS.filter((k) => progress[k]).length}/5`;
  }
  function resetCount() { ST.count = 0; ST.reps = []; ST.state = "DUNG"; ST.sm = NaN; ST.hist = []; ST.dipMin = 180; ST.repStart = ST.time; renderReps(); }

  // ---------------- QUIZ ----------------
  const QUIZ = [
    { q: "Trong ảnh máy tính, điểm (0, 0) nằm ở đâu?", o: ["Chính giữa ảnh", "Góc dưới bên trái", "Góc trên bên trái", "Góc trên bên phải"], a: 2, e: "Gốc tọa độ ở góc trên bên trái và y tăng khi đi xuống. Vì vậy khi em squat, y của hông tăng lên." },
    { q: "Vì sao bộ đếm dùng HAI ngưỡng (90° và 160°) thay vì một?", o: ["Để chạy nhanh hơn", "Để góc rung quanh ngưỡng không bị đếm thành nhiều lần", "Vì mô hình AI yêu cầu như vậy", "Để tiết kiệm pin"], a: 1, e: "Khoảng giữa hai ngưỡng là vùng đệm. Ở trong đó máy giữ nguyên trạng thái nên không bị nhiễu đánh lừa." },
    { q: "Điểm đầu gối có độ tin cậy 0.2 nghĩa là gì?", o: ["Đầu gối gập 20%", "AI không chắc đầu gối nằm ở đâu, có thể do bị che khuất", "Đầu gối cách camera 0.2 mét", "AI đã tìm đúng 20 điểm"], a: 1, e: "Độ tin cậy cho biết AI tự tin đến đâu. Khi giá trị thấp, chương trình tốt sẽ bỏ qua khung hình đó." },
    { q: "Đứng chính diện camera, AI không đếm được squat vì…", o: ["Camera quá tối", "Ảnh 2D mất chiều sâu nên góc gối trên ảnh gần như không đổi", "AI chỉ nhận ra người đứng nghiêng", "Mô hình bị lỗi"], a: 1, e: "Đầu gối gập về phía camera nên trên ảnh phẳng, đùi chỉ ngắn lại. Có thể sửa bằng cách đứng nghiêng hoặc dùng tọa độ 3D." },
    { q: "Trong dự án này, phần nào do AI HỌC từ dữ liệu, phần nào do NGƯỜI viết luật?", o: ["Cả hai phần đều do AI tự học", "Cả hai phần đều do người viết", "Tìm 33 điểm là AI học; đếm squat là luật do người viết", "Tìm 33 điểm là luật; đếm squat là AI học"], a: 2, e: "Mô hình pose được huấn luyện trên rất nhiều ảnh. Luật đếm là do chính em viết. Nhiều hệ thống AI thực tế kết hợp cả hai cách như vậy." }
  ];
  function buildQuiz() {
    const box = $("quiz"), ok = new Set();
    box.innerHTML = QUIZ.map((x, i) => `<div class="q" data-i="${i}"><h3><span class="qn">${String(i + 1).padStart(2, "0")}</span><span>${x.q}</span></h3><div class="opts">${x.o.map((o, j) => `<button data-j="${j}">${o}</button>`).join("")}</div><div class="exp" hidden></div></div>`).join("");
    box.querySelectorAll(".q").forEach((q) => {
      const i = +q.dataset.i;
      q.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        const j = +b.dataset.j, right = j === QUIZ[i].a;
        q.querySelectorAll("button").forEach((x) => x.classList.remove("right", "wrong"));
        b.classList.add(right ? "right" : "wrong");
        const e = q.querySelector(".exp"); e.hidden = false; e.className = "exp " + (right ? "ok" : "no"); e.innerHTML = HKA.icon(right ? "checkCircle" : "help") + "<span>" + (right ? "<b>Chính xác!</b> " + QUIZ[i].e : "<b>Chưa đúng, thử lại nhé.</b>") + "</span>";
        right ? ok.add(i) : ok.delete(i);
        if (ok.size === QUIZ.length) { $("badge").hidden = false; done("quiz"); }
      }));
    });
    if (progress.quiz) $("badge").hidden = false;
  }

  // ---------------- sự kiện ----------------
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    $("srcVid").onchange = (e) => e.target.files[0] && useVideo(e.target.files[0]);
    $("btnPause").onclick = () => { ST.paused = !ST.paused; $("btnPause").innerHTML = HKA.icon(ST.paused ? "play" : "pause") + `<span>${ST.paused ? "Chạy tiếp" : "Dừng"}</span>`; if (ST.src !== "sim") ST.paused ? video.pause() : video.play(); };
    $("btnStep").onclick = () => { if (!ST.paused) $("btnPause").click(); ST.stepOnce = true; };
    $("btnReset").onclick = resetCount;
    const rng = (id, key, fmt, cb) => $(id).addEventListener("input", (e) => { ST[key] = +e.target.value; $(id + "V").textContent = fmt(ST[key]); cb && cb(); });
    rng("speed", "speed", (v) => v.toFixed(1) + "×");
    rng("depth", "depth", (v) => Math.round(v * 100) + "%");
    rng("yaw", "yaw", (v) => v + "°");
    rng("smooth", "smooth", (v) => v.toFixed(2), () => { genCode(); done("rules"); });
    rng("minVis", "minVis", (v) => v.toFixed(2), () => { genCode(); done("rules"); });
    for (const k of ["img", "skel", "idx", "angle"]) $("show" + k[0].toUpperCase() + k.slice(1)).onchange = (e) => { ST.show[k] = e.target.checked; if (k === "idx" && e.target.checked) done("see33"); };
    const num = (id, key) => $(id).addEventListener("input", (e) => { const v = Math.max(1, Math.min(180, +e.target.value || 0)); ST[key] = v; buildGauge(); genCode(); done("rules"); });
    num("rDown", "down"); num("rUp", "up");
    $("rCount").onchange = (e) => { ST.countMode = e.target.value; genCode(); done("rules"); };
    $("btnDefaults").onclick = () => { Object.assign(ST, DEF); syncControls(); };
    $("soiPrev").onclick = () => setSoi(ST.soiStep - 1); $("soiNext").onclick = () => setSoi(ST.soiStep + 1);
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      if (ST.src !== "sim") useSim();
      const k = b.dataset.break, card = b.closest(".break");
      if (k === "noise") { ST.breaks.noise = true; ST.down = 120; ST.up = 120; ST.smooth = 0; }
      if (k === "occlude") { ST.breaks.occlude = true; ST.minVis = 0; ST.smooth = 0.2; }
      if (k === "front") { ST.yaw = 0; }
      card.classList.add("on"); syncControls(); resetCount(); done("broke");
      document.getElementById("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { ST.breaks.noise = ST.breaks.occlude = false; ST.yaw = 90; Object.assign(ST, DEF); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); syncControls(); resetCount(); };
    // tô sáng mục trên thanh bước
    const links = [...document.querySelectorAll(".steps a")];
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id)); }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section.sec").forEach((s) => io.observe(s));
    // chỉ vẽ phần Soi khi đang nhìn thấy
    const soiSec = $("soi"); ST.soiVisible = false;
    new IntersectionObserver((es) => (ST.soiVisible = es[0].isIntersecting)).observe(soiSec);
  }

  // ---------------- vòng lặp chính ----------------
  let last = performance.now(), slowT = 0;
  function tick(now) {
    let dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;
    if (!ST.paused || ST.stepOnce) {
      if (ST.stepOnce) dt = 1 / 30;
      if (ST.src === "sim") {
        ST.simT += dt * ST.speed;
        ST.lm = PoseSim.frame(depthProfile(ST.simT), ST.yaw, ST.simT, ST.breaks);
        process(ST.lm, dt * ST.speed);
      } else {
        const lm = detect();
        if (lm && lm !== ST.lm) { ST.lm = lm; process(lm, dt); }
        else if (!lm) ST.lm = null;
      }
      ST.stepOnce = false;
    }
    renderStage(); updateBrain();
    if (ST.soiVisible) renderSoi();
    renderChart();
    if (now - slowT > 120) { slowT = now; updateBrainSlow(); genCode(); if (ST.soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }

  readTheme(); window.addEventListener("hka:theme", () => requestAnimationFrame(readTheme));
  document.querySelectorAll(".lvl[data-stars]").forEach((el) => el.insertAdjacentHTML("afterbegin", HKA.stars(+el.dataset.stars)));
  buildPipeline(); setSoi(0); buildQuiz(); bind(); syncControls(); renderProgress(); setSrcButtons();
  requestAnimationFrame(tick);
})();
