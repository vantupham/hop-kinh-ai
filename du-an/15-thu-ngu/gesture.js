/* Hộp Kính AI · Dự án 15 · Cử chỉ chuyển động (cắt đoạn, chuẩn hóa, so khớp DTW) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, HS = window.HandSim;
  const prog = P.progress("hka-15");
  const NPT = 32, SC = 0.13, FPS = 30;
  // ---------- 5 cử chỉ tự đặt (không phải ký hiệu của ngôn ngữ ký hiệu thật) ----------
  const G = {
    vay: { name: "Vẫy tay", col: "#5ef2d6", f: (t) => [Math.sin(t * Math.PI * 4), 0.15 * Math.sin(t * Math.PI * 8)] },
    tron: { name: "Vòng tròn", col: "#7c8cff", f: (t) => [Math.sin(t * Math.PI * 2), -Math.cos(t * Math.PI * 2)] },
    z: { name: "Chữ Z", col: "#ffc34d", poly: [[-1, -1], [1, -1], [-1, 1], [1, 1]] },
    len: { name: "Vuốt lên", col: "#ff8fd0", poly: [[0, 1.1], [0, -1.1]] },
    v: { name: "Chữ V", col: "#ff7d5f", poly: [[-1, -1], [0, 1], [1, -1]] }
  };
  const KEYS = Object.keys(G);
  // đường gấp khúc có dừng ngắn ở mỗi góc
  function polyAt(poly, t, pause) {
    const segs = []; let tot = 0; for (let i = 1; i < poly.length; i++) { const l = Math.hypot(poly[i][0] - poly[i - 1][0], poly[i][1] - poly[i - 1][1]); segs.push(l); tot += l; }
    const nP = poly.length - 2, mv = 1 - nP * pause; let acc = 0;
    for (let i = 0; i < segs.length; i++) {
      const d = (segs[i] / tot) * mv;
      if (t <= acc + d) { let u = (t - acc) / d; u = 0.5 - 0.5 * Math.cos(Math.PI * u); return [poly[i][0] + (poly[i + 1][0] - poly[i][0]) * u, poly[i][1] + (poly[i + 1][1] - poly[i][1]) * u]; }
      acc += d; if (i < nP) { if (t <= acc + pause) return poly[i + 1].slice(); acc += pause; }
    }
    return poly[poly.length - 1].slice();
  }
  const gAt = (k, t, pause) => (G[k].poly ? polyAt(G[k].poly, t, pause == null ? 0.07 : pause) : G[k].f(0.5 - 0.5 * Math.cos(Math.PI * t)));
  const DEF = { norm: true, dtw: true, thr: 0.55, rest: 0.3, warp: 0.35, speed: 1, offset: false };
  const ST = { ...DEF, src: "sim", mode: "auto", t: 0, perf: null, hand: null, pts: [], rec: null, seg: null, segs: [], hist: [], speedHist: [], tpl: [], sel: "z", seen: new Set(), mouse: null, held: 0 };

  // ---------- mẫu ----------
  function resample(seq, n) { const out = [], L = seq.length; for (let i = 0; i < n; i++) { const u = (i / (n - 1)) * (L - 1), a = Math.floor(u), b = Math.min(L - 1, a + 1), w = u - a; out.push([seq[a][0] * (1 - w) + seq[b][0] * w, seq[a][1] * (1 - w) + seq[b][1] * w]); } return out; }
  function normalize(s) { let mx = 0, my = 0; s.forEach((p) => { mx += p[0]; my += p[1]; }); mx /= s.length; my /= s.length; let r = 0; s.forEach((p) => (r += (p[0] - mx) ** 2 + (p[1] - my) ** 2)); r = Math.sqrt(r / s.length) || 1; return s.map((p) => [(p[0] - mx) / r, (p[1] - my) / r]); }
  function canonical(k) { const s = []; for (let i = 0; i < NPT; i++) { const [x, y] = gAt(k, i / (NPT - 1)); s.push([0.5 + x * SC, 0.38 + y * SC]); } return s; }
  function resetTpl() { ST.tpl = KEYS.map((k) => ({ k, raw: canonical(k), own: false })); }
  const prep = (raw) => (ST.norm ? normalize(raw) : raw.map((p) => p.slice()));
  // ---------- so khớp ----------
  function dtw(a, b) {
    const n = a.length, m = b.length, C = [], Dm = [];
    for (let i = 0; i < n; i++) { C.push(new Float32Array(m)); Dm.push(new Float32Array(m)); for (let j = 0; j < m; j++) C[i][j] = Math.hypot(a[i][0] - b[j][0], a[i][1] - b[j][1]); }
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const best = i && j ? Math.min(Dm[i - 1][j], Dm[i][j - 1], Dm[i - 1][j - 1]) : i ? Dm[i - 1][j] : j ? Dm[i][j - 1] : 0; Dm[i][j] = C[i][j] + best; }
    const path = []; let i = n - 1, j = m - 1; path.push([i, j]);
    while (i || j) { if (!i) j--; else if (!j) i--; else { const c = Math.min(Dm[i - 1][j - 1], Dm[i - 1][j], Dm[i][j - 1]); if (c === Dm[i - 1][j - 1]) { i--; j--; } else if (c === Dm[i - 1][j]) i--; else j--; } path.push([i, j]); }
    path.reverse(); let s = 0; for (const [p, q] of path) s += C[p][q];
    return { d: s / path.length, C, path };
  }
  function pointwise(a, b) { let s = 0; const path = []; for (let i = 0; i < a.length; i++) { s += Math.hypot(a[i][0] - b[i][0], a[i][1] - b[i][1]); path.push([i, i]); } const C = a.map((p) => new Float32Array(b.map((q) => Math.hypot(p[0] - q[0], p[1] - q[1])))); return { d: s / a.length, C, path }; }
  function classify(seg) {
    const a = prep(ST.dtw ? seg.rs : Array.from({ length: NPT }, (_, i) => seg.raw[Math.min(i, seg.raw.length - 1)])), res = ST.tpl.map((tp) => ({ tp, ...(ST.dtw ? dtw : pointwise)(a, prep(tp.raw)) }));
    const byClass = {}; for (const r of res) if (!byClass[r.tp.k] || r.d < byClass[r.tp.k].d) byClass[r.tp.k] = r;
    const best = res.reduce((x, y) => (y.d < x.d ? y : x));
    seg.a = a; seg.res = byClass; seg.best = best; seg.label = best.d < ST.thr ? best.tp.k : null;
  }

  // ---------- người diễn mô phỏng ----------
  function nextPerf(k) {
    const r = Math.random, g = k || KEYS[Math.floor(r() * KEYS.length)];
    const cx = ST.offset ? 0.6 : 0.5 + (r() - 0.5) * 0.06, cy = ST.offset ? 0.16 : 0.38 + (r() - 0.5) * 0.05, s = ST.offset ? SC * 0.55 : SC * (0.85 + r() * 0.3);
    ST.perf = { g, cx, cy, s, dur: (1.5 / ST.speed) * (0.85 + r() * 0.3), warp: ST.warp * (0.6 + r() * 0.4), ph: r() * 6.283, gam: Math.pow(1 + 2 * ST.warp, r() * 2 - 1), t0: ST.t, phase: "show" };
  }
  function perfPos(pf, t) { t = Math.pow(t, pf.gam || 1); const tw = Math.min(1, Math.max(0, t + (pf.warp * (Math.sin(2 * Math.PI * t + pf.ph) - Math.sin(pf.ph))) / (2 * Math.PI))), [x, y] = gAt(pf.g, tw); return [pf.cx + x * pf.s, pf.cy + y * pf.s]; }
  function stepPerf() {
    let pf = ST.perf; if (!pf) { nextPerf(); pf = ST.perf; }
    const e = ST.t - pf.t0;
    if (pf.phase === "show") { ST.hand = perfPos(pf, 0); if (e > 0.45) { pf.phase = "move"; pf.t0 = ST.t; ST.truth = pf.g; } }
    else if (pf.phase === "move") { ST.hand = perfPos(pf, Math.min(1, e / pf.dur)); if (e > pf.dur) { pf.phase = "hold"; pf.t0 = ST.t; } }
    else if (pf.phase === "hold") { ST.hand = perfPos(pf, 1); if (e > 0.75) { pf.phase = "hide"; pf.t0 = ST.t; } }
    else { ST.hand = null; if (e > 0.5) nextPerf(ST.queue || null), (ST.queue = null); }
  }

  // ---------- cắt đoạn ----------
  let still = 0;
  function sample(p) {
    const now = ST.t, prev = ST.pts[ST.pts.length - 1];
    const p3 = ST.pts.length >= 3 ? ST.pts[ST.pts.length - 3] : null; let v = 0; if (p && p3 && p3.p && prev && prev.p && ST.pts[ST.pts.length - 2] && ST.pts[ST.pts.length - 2].p) v = (Math.hypot(p[0] - p3.p[0], p[1] - p3.p[1]) * FPS) / 3; else if (p && prev && prev.p) v = Math.hypot(p[0] - prev.p[0], p[1] - prev.p[1]) * FPS;
    ST.pts.push({ t: now, p, v }); if (ST.pts.length > 90) ST.pts.shift();
    ST.speedHist.push({ t: now, v: p ? v : null }); while (ST.speedHist.length && ST.speedHist[0].t < now - 10.5) ST.speedHist.shift();
    const VTH = 0.12;
    if (!ST.rec) {
      if (p && v > VTH) { const back = []; for (let i = ST.pts.length - 1; i >= 0 && back.length < 4 && ST.pts[i].p; i--) back.unshift(ST.pts[i].p); ST.rec = { raw: back, truth: ST.src === "sim" && ST.mode === "auto" ? ST.truth : null, t0: now, cuts: [] }; still = 0; }
    } else {
      if (!p) return endSeg();
      ST.rec.raw.push(p);
      if (v < VTH) { still += 1 / FPS; if (still >= ST.rest) return endSeg(Math.round(still * FPS)); } else still = 0;
      if (ST.rec.raw.length > 150) endSeg();
    }
  }
  function endSeg(trim) {
    const r = ST.rec; ST.rec = null; still = 0; if (!r) return;
    let raw = r.raw; if (trim) raw = raw.slice(0, Math.max(2, raw.length - trim + 1));
    if (raw.length < 8) return;
    const seg = { raw, rs: resample(raw, NPT), truth: r.truth, frames: raw.length, t: ST.t, dur: raw.length / FPS };
    classify(seg); ST.seg = seg; ST.held = ST.t;
    if (seg.truth) { if (ST.perf && ST.perf.phase === "move") seg.cutEarly = true; ST.hist.push({ ok: seg.label === seg.truth ? 1 : seg.label ? 0 : -1, label: seg.label, truth: seg.truth }); if (ST.hist.length > 20) ST.hist.shift(); }
    if (seg.label) { ST.seen.add(seg.label); if (ST.seen.size >= 3) prog.done("see3"); }
    if (ST.mode === "mouse" || ST.src === "cam") prog.done("own");
  }

  // ---------- camera ----------
  let lm = null, stream = null, lastVT = -1;
  const video = $("video");
  async function useCam() {
    P.msg($("stageMsg"), "Đang tải mô hình AI bàn tay…", "loader");
    try { lm = await P.vision("hand"); stream = await P.camera(video); ST.src = "cam"; ST.perf = null; ST.rec = null; P.srcButtons("cam"); P.msg($("stageMsg"), null); }
    catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; ST.src = "sim"; ST.camPts = null; P.srcButtons("sim"); }
  function camStep() {
    if (!lm || video.readyState < 2 || video.currentTime === lastVT) return undefined; lastVT = video.currentTime;
    const r = lm.detectForVideo(video, performance.now()), p = r.landmarks && r.landmarks[0];
    if (!p) { ST.camPts = null; return null; }
    ST.camPts = p.map((q) => ({ x: (1 - q.x) * 640, y: q.y * 480, z: q.z }));
    const ids = [0, 5, 9, 13, 17]; let x = 0, y = 0; ids.forEach((i) => { x += ST.camPts[i].x; y += ST.camPts[i].y; }); return [x / 5 / 640, y / 5 / 640];
  }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d");
  function thumb(ctx, s, x0, y0, w, col, lw) { const n = normalize(s); ctx.strokeStyle = col; ctx.lineWidth = lw || 2.5; ctx.lineJoin = "round"; ctx.beginPath(); n.forEach((p, i) => { const X = x0 + w / 2 + p[0] * w * 0.27, Y = y0 + w / 2 + p[1] * w * 0.27; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); const e = n[n.length - 1]; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x0 + w / 2 + e[0] * w * 0.27, y0 + w / 2 + e[1] * w * 0.27, 3.5, 0, 7); ctx.fill(); }
  function trail(ctx, raw, col, alpha) { if (raw.length < 2) return; ctx.lineCap = "round"; for (let i = 1; i < raw.length; i++) { ctx.strokeStyle = col; ctx.globalAlpha = alpha * (0.25 + 0.75 * (i / raw.length)); ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(raw[i - 1][0] * 640, raw[i - 1][1] * 640); ctx.lineTo(raw[i][0] * 640, raw[i][1] * 640); ctx.stroke(); } ctx.globalAlpha = 1; }
  function renderStage() {
    const ctx = sctx, TH = P.TH; D.room(ctx, TH.dark);
    if (ST.src === "cam" && video.readyState >= 2) { ctx.save(); ctx.translate(640, 0); ctx.scale(-1, 1); ctx.globalAlpha = 0.55; ctx.drawImage(video, 0, 0, 640, 480); ctx.restore(); ctx.globalAlpha = 1; }
    // vệt cử chỉ
    if (ST.seg && ST.t - ST.held < 2.2) trail(ctx, ST.seg.raw, ST.seg.label ? G[ST.seg.label].col : "#9aa0c8", 0.6 * (1 - (ST.t - ST.held) / 2.2));
    if (ST.rec) trail(ctx, ST.rec.raw, "#ff5d5d", 0.9);
    // bàn tay
    if (ST.src === "cam") { if (ST.camPts) HS.drawSkeleton(ctx, ST.camPts); }
    else if (ST.hand) { const sz = 62, rot = -8 + Math.sin(ST.t * 3) * 4; const f = HS.frame([0.1, 0, 0, 0, 0.05], ST.hand[0] * 640, ST.hand[1] * 640 + sz * 0.55, sz, rot, 0.4); HS.drawHand(ctx, f, sz); }
    if (ST.rec) { ctx.fillStyle = "#ff5d5d"; ctx.beginPath(); ctx.arc(30, 32, 7 + Math.sin(ST.t * 8), 0, 7); ctx.fill(); ctx.fillStyle = TH.dark ? "#fff" : "#1b1f4a"; ctx.font = "700 13px JetBrains Mono, monospace"; ctx.fillText(`ĐANG GHI · ${ST.rec.raw.length} khung`, 46, 37); }
    else { ctx.fillStyle = TH.dark ? "#9aa0c8" : "#5a5f8a"; ctx.font = "600 12px JetBrains Mono, monospace"; ctx.fillText(ST.mode === "mouse" && ST.src === "sim" ? "GIỮ CHUỘT/NGÓN TAY VÀ VẼ CỬ CHỈ" : "CHỜ CHUYỂN ĐỘNG…", 22, 37); }
    // bảng mẫu
    const x0 = 452; ctx.fillStyle = "rgba(10,12,38,.82)"; D.rr(ctx, x0 - 10, 52, 196, 418, 14); ctx.fill();
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 10px JetBrains Mono, monospace"; ctx.fillText("KHOẢNG CÁCH TỚI MẪU", x0, 72);
    const s = ST.seg, mxd = Math.max(ST.thr * 2, 0.01);
    KEYS.forEach((k, i) => {
      const y = 82 + i * 62, r = s && s.res[k], hit = s && s.label === k;
      ctx.fillStyle = hit ? G[k].col + "33" : "rgba(255,255,255,.04)"; D.rr(ctx, x0 - 4, y, 184, 56, 10); ctx.fill();
      thumb(ctx, ST.tpl.find((tp) => tp.k === k).raw, x0, y + 4, 48, G[k].col, 2);
      ctx.fillStyle = "#fff"; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(G[k].name, x0 + 54, y + 20);
      ctx.fillStyle = "#232866"; ctx.fillRect(x0 + 54, y + 30, 96, 8); if (r) { ctx.fillStyle = r.d < ST.thr ? G[k].col : "#6b72a8"; ctx.fillRect(x0 + 54, y + 30, Math.min(96, (r.d / mxd) * 96), 8); ctx.fillStyle = "#c3c7f0"; ctx.font = "10px JetBrains Mono, monospace"; ctx.fillText(r.d.toFixed(2), x0 + 152, y + 38); }
      ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x0 + 54 + 48, y + 27); ctx.lineTo(x0 + 54 + 48, y + 41); ctx.stroke();
    });
    ctx.fillStyle = "#8f96d4"; ctx.font = "10px Be Vietnam Pro, sans-serif"; ctx.fillText("vạch đỏ = ngưỡng", x0, 400);
    if (s) { ctx.fillStyle = s.label ? G[s.label].col : "#ff7d5f"; ctx.font = "800 20px Be Vietnam Pro, sans-serif"; ctx.fillText(s.label ? G[s.label].name : "Không rõ", x0, 432); if (s.truth) { ctx.fillStyle = "#c3c7f0"; ctx.font = "11px Be Vietnam Pro, sans-serif"; ctx.fillText(`Thật ra là: ${G[s.truth].name}`, x0, 454); } }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Bàn tay mỗi khung", e: "figure", d: "Mỗi khung hình, mô hình bàn tay (Dự án 3) cho 21 điểm. Ta chỉ giữ <b>tâm lòng bàn tay</b>: một điểm (x, y) mỗi khung, 30 khung mỗi giây." },
    { t: "Chuỗi theo thời gian", e: "chart", d: "Cử chỉ là một <b>chuỗi</b>: các điểm nối tiếp nhau theo thời gian. Hai đường cong cho thấy x và y thay đổi ra sao. Thứ tự là quan trọng: vuốt lên khác vuốt xuống!" },
    { t: "Cắt đoạn", e: "scan", d: "Máy theo dõi <b>tốc độ</b> bàn tay. Khi tốc độ vượt ngưỡng thì bắt đầu ghi, khi bàn tay đứng yên đủ lâu thì kết thúc một cử chỉ." },
    { t: "Chuẩn hóa", e: "crosshair", d: "Dời đoạn cử chỉ về giữa và co giãn về cùng kích thước. Nhờ vậy vẽ to hay nhỏ, ở góc trái hay góc phải vẫn so được với mẫu." },
    { t: "So khớp DTW", e: "repeat", d: "<b>DTW</b> ghép từng điểm của cử chỉ với điểm tương ứng của mẫu, cho phép một bên nhanh hơn, một bên chậm hơn. Các nét nối cho thấy điểm nào được ghép với điểm nào." },
    { t: "Quyết định", e: "target", d: "Chọn mẫu có khoảng cách <b>nhỏ nhất</b>. Nếu ngay cả mẫu gần nhất vẫn xa hơn ngưỡng, máy trả lời \"Không rõ\" thay vì đoán bừa." }
  ];
  let soiVisible = false, soiStep = 0;
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); });
  P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const ctx = octx, s = soiStep, seg = ST.seg; D.labBg(ctx);
    const lab = (t, x, y, c) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
    if (s === 0) { const p = ST.hand || [0.5, 0.38], sz = 150, f = HS.frame([0.1, 0, 0, 0, 0.05], 320, 300, sz, -8, 0); HS.drawSkeleton(ctx, f, { idx: true }); let cx = 0, cy = 0; [0, 5, 9, 13, 17].forEach((i) => { cx += f[i].x / 5; cy += f[i].y / 5; }); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, 7); ctx.stroke(); D.pill(ctx, `tâm lòng bàn tay (${p[0].toFixed(2)}, ${p[1].toFixed(2)})`, cx, cy + 40, "#5443ff", 12); return; }
    if (!seg) { lab("Hãy làm một cử chỉ ở phần Mồi (hoặc chờ máy diễn).", 150, 240); return; }
    if (s === 1) {
      const raw = seg.raw, n = raw.length; lab("Đường đi trên màn hình", 20, 30); ctx.save(); ctx.translate(20, 40); ctx.scale(0.42, 0.42); trail(ctx, raw, "#5ef2d6", 1); ctx.restore(); ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.strokeRect(20, 40, 269, 202);
      const mnx = Math.min(...raw.map((p) => p[0])), mxx = Math.max(...raw.map((p) => p[0])), mny = Math.min(...raw.map((p) => p[1])), mxy = Math.max(...raw.map((p) => p[1]));
      [[0, "x (ngang)", "#ff7d5f", mnx, mxx, 60], [1, "y (dọc)", "#7c8cff", mny, mxy, 260]].forEach(([c, t, col, lo, hi, y0]) => { lab(t + " theo thời gian", 320, y0 - 10, col); ctx.strokeStyle = "rgba(255,255,255,.15)"; ctx.strokeRect(320, y0, 300, 150); ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); raw.forEach((p, i) => { const X = 320 + (i / (n - 1)) * 300, Y = y0 + 140 - ((p[c] - lo) / ((hi - lo) || 1)) * 130; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); });
      lab(`${n} khung = ${seg.dur.toFixed(2)} giây`, 20, 270); return;
    }
    if (s === 2) {
      const H = ST.speedHist, t1 = ST.t, x0 = 30, w = 580, y0 = 60, h = 300, mx = 1.6, X = (t) => x0 + (1 - (t1 - t) / 10) * w, Y = (v) => y0 + h - Math.min(1, v / mx) * h;
      lab("Tốc độ bàn tay trong 10 giây qua", x0, 40); ctx.strokeStyle = "rgba(255,255,255,.15)"; ctx.strokeRect(x0, y0, w, h);
      ST.segs.forEach((g) => { if (g.t1 < t1 - 10) return; ctx.fillStyle = "rgba(94,242,214,.15)"; ctx.fillRect(X(g.t0), y0, X(g.t1) - X(g.t0), h); });
      ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 2; ctx.beginPath(); let on = false; for (const q of H) { if (q.v == null) { on = false; continue; } const x = X(q.t), y = Y(q.v); on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; } ctx.stroke();
      ctx.setLineDash([6, 5]); ctx.strokeStyle = "#ff7d5f"; ctx.beginPath(); ctx.moveTo(x0, Y(0.12)); ctx.lineTo(x0 + w, Y(0.12)); ctx.stroke(); ctx.setLineDash([]); lab("ngưỡng tốc độ", x0 + w - 100, Y(0.12) - 6, "#ff7d5f");
      lab(`Vùng xanh = đoạn đã cắt · đứng yên ${ST.rest.toFixed(2)} s thì kết thúc`, x0, 400); return;
    }
    if (s === 3) {
      lab("Trước: tọa độ thật trên màn hình", 20, 30); ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.strokeRect(20, 40, 288, 216); ctx.save(); ctx.translate(20, 40); ctx.scale(0.45, 0.45); trail(ctx, seg.raw, "#ffc34d", 1); ctx.restore();
      const best = seg.best.tp; lab("Sau: dời về giữa, cùng cỡ", 332, 30); ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.strokeRect(332, 40, 288, 216);
      thumb(ctx, best.raw, 332 + 36, 40 - 0, 216, G[best.k].col + "88", 6); thumb(ctx, seg.rs, 332 + 36, 40, 216, "#ffc34d", 3);
      ctx.fillStyle = "#c3c7f0"; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText(`Vàng: cử chỉ của em · Màu nhạt: mẫu "${G[best.k].name}"`, 332, 280);
      lab(ST.norm ? "Chuẩn hóa: BẬT" : "Chuẩn hóa: TẮT, máy so tọa độ thật!", 20, 300, ST.norm ? "#5ef2d6" : "#ff7d5f"); return;
    }
    if (s === 4) {
      const best = seg.best, b = prep(best.tp.raw), a = seg.a, n = a.length, x0 = 30, w = 380, X = (i) => x0 + (i / (n - 1)) * w, c = (p) => p[0] * 0.6 + p[1] * 0.8;
      const all = a.concat(b).map(c), lo = Math.min(...all), hi = Math.max(...all), Y = (v, y0) => y0 + 90 - ((v - lo) / ((hi - lo) || 1)) * 90;
      lab("Cử chỉ của em", x0, 36, "#ffc34d"); lab(`Mẫu "${G[best.tp.k].name}"`, x0, 248, G[best.tp.k].col);
      ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1; for (const [i, j] of best.path) { ctx.beginPath(); ctx.moveTo(X(i), Y(c(a[i]), 46)); ctx.lineTo(X(j), Y(c(b[j]), 258)); ctx.stroke(); }
      [[a, 46, "#ffc34d"], [b, 258, G[best.tp.k].col]].forEach(([s2, y0, col]) => { ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); s2.forEach((p, i) => (i ? ctx.lineTo(X(i), Y(c(p), y0)) : ctx.moveTo(X(i), Y(c(p), y0)))); ctx.stroke(); });
      matrix(ctx, best, 440, 60, 180); lab("Ma trận chi phí", 440, 50); lab(ST.dtw ? "DTW: BẬT" : "DTW: TẮT, ghép theo thứ tự cứng", 440, 270, ST.dtw ? "#5ef2d6" : "#ff7d5f"); return;
    }
    const thr = ST.thr, mx = thr * 2.2; lab("Khoảng cách tới từng mẫu (thấp hơn = giống hơn)", 30, 40);
    KEYS.forEach((k, i) => { const r = seg.res[k], y = 70 + i * 62; ctx.fillStyle = "#fff"; ctx.font = "700 13px Be Vietnam Pro, sans-serif"; ctx.fillText(G[k].name, 30, y + 22); ctx.fillStyle = "#232866"; ctx.fillRect(150, y + 8, 420, 22); ctx.fillStyle = r.d < thr ? G[k].col : "#6b72a8"; ctx.fillRect(150, y + 8, Math.min(420, (r.d / mx) * 420), 22); ctx.fillStyle = "#fff"; ctx.font = "11px JetBrains Mono, monospace"; ctx.fillText(r.d.toFixed(3), 576, y + 24); });
    const tx = 150 + (thr / mx) * 420; ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(tx, 60); ctx.lineTo(tx, 380); ctx.stroke(); ctx.setLineDash([]); D.pill(ctx, `ngưỡng ${thr.toFixed(2)}`, tx, 396, "#ff5d3c", 11);
    D.pill(ctx, seg.label ? `→ ${G[seg.label].name}` : "→ Không rõ", 320, 440, seg.label ? "#5443ff" : "#ff5d3c", 15);
  }
  function matrix(ctx, r, x0, y0, size) {
    const n = r.C.length, m = r.C[0].length, cw = size / m, ch = size / n; let mx = 0; r.C.forEach((row) => row.forEach((v) => (mx = Math.max(mx, v))));
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const v = 1 - r.C[i][j] / (mx || 1); ctx.fillStyle = `rgb(${18 + v * 60},${22 + v * 120},${60 + v * 150})`; ctx.fillRect(x0 + j * cw, y0 + i * ch, cw + 0.5, ch + 0.5); }
    ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2.5; ctx.beginPath(); r.path.forEach(([i, j], k) => { const X = x0 + (j + 0.5) * cw, Y = y0 + (i + 0.5) * ch; k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), seg = ST.seg;
    if (s === 0) el.innerHTML = `21 điểm × 30 khung/giây → giữ <span class="hl">1 điểm</span> mỗi khung`;
    else if (!seg) el.innerHTML = "Chưa có cử chỉ nào.";
    else if (s === 1) el.innerHTML = `Đoạn vừa rồi: <span class="hl">${seg.frames}</span> khung · ${seg.dur.toFixed(2)} s\nĐược lấy mẫu lại thành <span class="w">${NPT}</span> điểm`;
    else if (s === 2) el.innerHTML = `Ngưỡng tốc độ: <span class="w">0,12</span> · thời gian nghỉ để cắt: <span class="hl">${ST.rest.toFixed(2)} s</span>`;
    else if (s === 3) el.innerHTML = `Chuẩn hóa: <span class="hl">${ST.norm ? "bật" : "tắt"}</span>`;
    else if (s === 4) el.innerHTML = `Cách so: <span class="hl">${ST.dtw ? "DTW" : "từng cặp theo thứ tự"}</span> · khoảng cách <span class="w">${seg.best.d.toFixed(3)}</span>\nĐường ghép đi qua <span class="w">${seg.best.path.length}</span> ô`;
    else el.innerHTML = `Gần nhất: <span class="hl">${G[seg.best.tp.k].name}</span> (${seg.best.d.toFixed(3)}) · ngưỡng ${ST.thr.toFixed(2)}`;
  }

  // ---------- Tự làm ----------
  function renderLab() {
    const cv = $("dtwM"), ctx = cv.getContext("2d"); D.labBg(ctx); const seg = ST.seg;
    if (seg) { const tp = ST.tpl.filter((q) => q.k === ST.sel).map((q) => ({ q, ...(ST.dtw ? dtw : pointwise)(seg.a, prep(q.raw)) })).reduce((x, y) => (y.d < x.d ? y : x)); matrix(ctx, tp, 70, 50, 300); ctx.fillStyle = "#c3c7f0"; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText(`Mẫu "${G[ST.sel].name}" (cột) ↔ cử chỉ vừa rồi (hàng)`, 70, 34); ctx.fillText(`Khoảng cách: ${tp.d.toFixed(3)}`, 70, 376); thumb(ctx, seg.rs, 0, 50, 70, "#ffc34d", 2); thumb(ctx, tp.q.raw, 380, 50, 60, G[ST.sel].col, 2); }
    else { ctx.fillStyle = "#c3c7f0"; ctx.font = "13px Be Vietnam Pro, sans-serif"; ctx.fillText("Chờ một cử chỉ…", 160, 200); }
    // lịch sử 20 cử chỉ
    const hv = $("histV"), hx = hv.getContext("2d"), TH = P.TH; hx.clearRect(0, 0, hv.width, hv.height);
    const H = ST.hist, ok = H.filter((h) => h.ok === 1).length; ST.acc = H.length ? ok / H.length : null;
    H.forEach((h, i) => { const x = 10 + i * 26; hx.fillStyle = h.ok === 1 ? TH.mint : h.ok === 0 ? TH.coral : TH.text; D.rr(hx, x, 20, 22, 40, 6); hx.fill(); hx.fillStyle = TH.ink; hx.font = "9px JetBrains Mono, monospace"; hx.save(); hx.translate(x + 15, 112); hx.rotate(-Math.PI / 2); hx.fillText(h.label ? G[h.label].name : "?", 0, 0); hx.restore(); });
    $("bAcc").textContent = ST.acc == null ? "—" : Math.round(ST.acc * 100) + "%"; $("labAcc").textContent = $("bAcc").textContent; $("bAcc").style.color = ST.acc == null ? "" : ST.acc > 0.85 ? "#5ef2d6" : ST.acc > 0.6 ? "#ffc34d" : "#ff7d5f";
    $("tplCount").textContent = `${ST.tpl.length} mẫu (${ST.tpl.filter((q) => q.own).length} của em)`;
    P.lineChart($("chart"), [{ data: ST.speedHist, color: TH.mint, width: 2.5 }], { min: 0, max: 1.6, span: 10, now: ST.t, ticks: [0, 0.4, 0.8, 1.2, 1.6], fmt: (v) => v.toFixed(1), thresholds: [{ v: 0.12, label: "ngưỡng chuyển động", color: TH.coral }] });
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML = ST.dtw ?
`${c("// D[i][j]: chi phí nhỏ nhất để ghép i điểm đầu với j điểm đầu")}
${k("for")} (i = ${n(0)}; i &lt; ${n(NPT)}; i++) ${k("for")} (j = ${n(0)}; j &lt; ${n(NPT)}; j++)
  D[i][j] = khoangCach(cuChi[i], mau[j]) + Math.min(
    D[i-${n(1)}][j],      ${c("// cử chỉ chậm hơn mẫu")}
    D[i][j-${n(1)}],      ${c("// cử chỉ nhanh hơn mẫu")}
    D[i-${n(1)}][j-${n(1)}]);  ${c("// cùng nhịp")}
${k("const")} ketQua = D[${n(NPT - 1)}][${n(NPT - 1)}] / doDaiDuong &lt; ${n(ST.thr.toFixed(2))} ? mau.ten : ${'"Không rõ"'};` :
`${c("// so khung thứ i của em với khung thứ i của mẫu,")}
${c("// không co giãn thời gian: làm chậm hơn mẫu là lệch ngay")}
${k("let")} s = ${n(0)};
${k("for")} (i = ${n(0)}; i &lt; ${n(NPT)}; i++) s += khoangCach(khung[i], mau[i]);
${k("const")} ketQua = s / ${n(NPT)} &lt; ${n(ST.thr.toFixed(2))} ? mau.ten : ${'"Không rõ"'};`;
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function markSel(id, key, attr) { $(id).querySelectorAll("button").forEach((b) => { const on = b.dataset[attr] === ST[key]; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    $("modeBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.mode = b.dataset.m; ST.rec = null; ST.hand = ST.mode === "auto" ? null : [0.35, 0.38]; ST.perf = null; markSel("modeBtns", "mode", "m"); if (ST.src !== "sim") useSim(); }));
    $("gBtns").innerHTML = KEYS.map((k) => `<button class="btn small ghost" data-g="${k}">${G[k].name}</button>`).join("");
    $("gBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.mode = "auto"; markSel("modeBtns", "mode", "m"); if (ST.src !== "sim") useSim(); ST.queue = b.dataset.g; if (!ST.perf || ST.perf.phase === "hide") nextPerf(b.dataset.g); }));
    const pos = (e) => { const r = stage.getBoundingClientRect(); return [((e.clientX - r.left) / r.width), ((e.clientY - r.top) / r.height) * 0.75]; };
    stage.addEventListener("pointerdown", (e) => { if (ST.src !== "sim") return; if (ST.mode !== "mouse") { ST.mode = "mouse"; markSel("modeBtns", "mode", "m"); } ST.pts.push({ t: ST.t, p: null, v: 0 }); ST.rec = null; ST.perf = null; stage.setPointerCapture(e.pointerId); ST.mouse = pos(e); });
    stage.addEventListener("pointermove", (e) => { if (ST.mouse) ST.mouse = pos(e); });
    const up = () => { ST.mouse = null; }; stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    $("tplBtns").innerHTML = KEYS.map((k) => `<button class="btn small ghost" data-k="${k}">${G[k].name}</button>`).join("");
    $("tplBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.sel = b.dataset.k; markSel("tplBtns", "sel", "k"); }));
    $("btnSave").onclick = () => { if (!ST.seg) return; ST.tpl.push({ k: ST.sel, raw: ST.seg.rs.map((p) => p.slice()), own: true }); prog.done("save"); classify(ST.seg); };
    $("btnResetTpl").onclick = () => { resetTpl(); if (ST.seg) classify(ST.seg); };
    for (const k of ["norm", "dtw"]) $(k).onchange = (e) => { ST[k] = e.target.checked; if (ST.seg) classify(ST.seg); genCode(); };
    syncs.push(P.range("thr", () => ST.thr, (v) => (ST.thr = v), (v) => v.toFixed(2), () => { if (ST.seg) classify(ST.seg); genCode(); }));
    syncs.push(P.range("rest", () => ST.rest, (v) => (ST.rest = v), (v) => v.toFixed(2) + " s"));
    syncs.push(P.range("warp", () => ST.warp, (v) => (ST.warp = v), (v) => Math.round(v * 100) + "%"));
    syncs.push(P.range("speed", () => ST.speed, (v) => (ST.speed = v), (v) => v.toFixed(1) + "×"));
    const sync = () => { syncs.forEach((f) => f()); $("norm").checked = ST.norm; $("dtw").checked = ST.dtw; markSel("modeBtns", "mode", "m"); markSel("tplBtns", "sel", "k"); genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); ST.mode = "auto"; useSim(); ST.hist = []; ST.perf = null; ST.rec = null;
      if (k === "speed") { ST.dtw = false; ST.warp = 0.5; ST.speed = 0.7; } if (k === "cut") ST.rest = 0.05; if (k === "pos") { ST.norm = false; ST.offset = true; }
      sync(); prog.done("broke"); $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); ST.hist = []; sync(); };
    sync();
  }

  const QUIZ = [
    { q: "Vì sao nhận dạng cử chỉ chuyển động khó hơn nhận dạng một tư thế tay (Dự án 3)?", o: ["Vì camera chậm hơn", "Vì phải xét cả một chuỗi khung hình theo đúng thứ tự, không chỉ một khung", "Vì bàn tay nhỏ hơn", "Không khó hơn"], a: 1, e: "Một khung hình của \"vuốt lên\" và \"vuốt xuống\" có thể giống hệt nhau. Chỉ khi xem cả chuỗi mới phân biệt được." },
    { q: "DTW giải quyết vấn đề gì?", o: ["Làm ảnh nét hơn", "Cùng một cử chỉ có thể làm nhanh, chậm, hoặc nhanh chỗ này chậm chỗ kia; DTW co giãn thời gian để ghép đúng điểm tương ứng", "Tìm bàn tay trong ảnh", "Làm cử chỉ ngắn lại"], a: 1, e: "DTW (Dynamic Time Warping) tìm cách ghép hai chuỗi có tổng chi phí nhỏ nhất, cho phép một điểm ghép với nhiều điểm." },
    { q: "Tắt chuẩn hóa vị trí và kích thước thì chuyện gì xảy ra khi em làm cử chỉ ở góc màn hình?", o: ["Vẫn nhận đúng", "Khoảng cách tới mọi mẫu đều rất lớn vì tọa độ khác hẳn, nên máy trả lời Không rõ hoặc sai", "Máy chạy nhanh hơn", "Cử chỉ to ra"], a: 1, e: "Chuẩn hóa giúp máy so hình dạng của cử chỉ, không phụ thuộc em đứng ở đâu hay xa camera bao nhiêu." },
    { q: "Thời gian nghỉ để cắt đoạn quá ngắn thì chữ Z sẽ…", o: ["Được nhận tốt hơn", "Bị cắt thành nhiều mẩu ở các góc (nơi tay dừng một chút), mỗi mẩu bị nhận sai", "Biến thành vòng tròn", "Không bị ảnh hưởng"], a: 1, e: "Cắt đoạn là bước đầu tiên; cắt sai thì các bước sau làm tốt mấy cũng sai." },
    { q: "Vì sao máy nên có câu trả lời \"Không rõ\"?", o: ["Để trông khiêm tốn", "Để không ép mọi chuyển động (gãi đầu, chỉnh tóc…) vào một cử chỉ có nghĩa, tránh hiểu sai", "Vì máy hết bộ nhớ", "Không cần thiết"], a: 1, e: "Một hệ thống hiểu cử chỉ hay ngôn ngữ ký hiệu mà đoán bừa có thể truyền sai ý của người dùng." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), acc = 0, slow = 0, tuVisible = false; P.visible($("tu-lam"), (v) => (tuVisible = v));
  let recStart = null;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; acc += dt;
    while (acc >= 1 / FPS) {
      acc -= 1 / FPS; ST.t += 1 / FPS;
      let p = null;
      if (ST.src === "cam") { const q = camStep(); p = q === undefined ? (ST.pts.length ? ST.pts[ST.pts.length - 1].p : null) : q; }
      else if (ST.mode === "auto") { stepPerf(); p = ST.hand && [ST.hand[0] + (Math.random() - 0.5) * 0.002, ST.hand[1] + (Math.random() - 0.5) * 0.002]; }
      else { if (ST.mouse) ST.hand = ST.mouse.slice(); p = ST.mouse ? ST.hand.slice() : null; if (!ST.mouse && ST.hand) p = null; }
      const wasRec = !!ST.rec; sample(p);
      if (!wasRec && ST.rec) recStart = ST.t; if (wasRec && !ST.rec) { ST.segs.push({ t0: recStart, t1: ST.t }); if (ST.segs.length > 20) ST.segs.shift(); }
    }
    renderStage();
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; if (soiVisible) soiLive(); if (tuVisible) renderLab(); else { const H = ST.hist, ok = H.filter((h) => h.ok === 1).length; $("bAcc").textContent = H.length ? Math.round((ok / H.length) * 100) + "%" : "—"; } $("bSeg").textContent = ST.seg ? ST.seg.frames : "—"; $("bDist").textContent = ST.seg ? ST.seg.best.d.toFixed(2) : "—"; $("bRes").textContent = ST.seg ? (ST.seg.label ? G[ST.seg.label].name : "Không rõ") : "—"; }
    requestAnimationFrame(tick);
  }
  P.nav(); resetTpl(); bind(); P.srcButtons("sim");
  window.__hka15 = ST;
  requestAnimationFrame(tick);
})();
