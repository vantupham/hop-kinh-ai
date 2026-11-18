/* Hộp Kính AI · Dự án 30 · Máy chấm tốc độ chạy (theo dõi vật theo màu, đồ thị quãng đường – thời gian, tốc độ) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-30");
  const VW = 880, VH = 280, X0 = 60, X1 = 820, PPM = (X1 - X0) / 60, SC = 0.25, FW = VW * SC, FH = VH * SC, DT = 0.1;
  const SHIRT = [229, 57, 53];
  const ST = { src: "sim", prof: "even", v: 6, tol: 60, win: false, pred: false, color: SHIRT.slice(), run: false, t: 0, clock: 0, samples: [], lost: 0, last: null, flags: {}, profs: new Set(), mask: null, cent: null, done: false, cam: null };

  // ---------- chuyển động thật của Minh ----------
  function sTrue(t) {
    const v = ST.v; let s;
    if (ST.prof === "even") s = v * t;
    else if (ST.prof === "acc") { const T0 = 4; s = t < T0 ? (v * t * t) / (2 * T0) : (v * T0) / 2 + v * (t - T0); }
    else { const a = 3, b = 5; s = t < a ? v * t : t < b ? v * a : v * a + v * (t - b); }
    return Math.max(0, Math.min(60, s));
  }
  const tEnd = () => { let t = 0; while (sTrue(t) < 60 && t < 40) t += 0.01; return t; };

  // ---------- vẽ cảnh ----------
  function drawScene(ctx, t, f) {
    const g = ctx.createLinearGradient(0, 0, 0, VH); g.addColorStop(0, "#9ed0ff"); g.addColorStop(0.55, "#dff1ff"); ctx.fillStyle = g; ctx.fillRect(0, 0, VW, VH);
    ctx.fillStyle = "#7cc68a"; ctx.beginPath(); ctx.moveTo(0, 150); for (let x = 0; x <= VW; x += 40) ctx.lineTo(x, 130 + Math.sin(x / 70) * 14); ctx.lineTo(VW, 170); ctx.lineTo(0, 170); ctx.fill();
    for (let i = 0; i < 9; i++) { const x = 40 + i * 105; ctx.fillStyle = "#7a5230"; ctx.fillRect(x - 4, 120, 8, 50); ctx.fillStyle = "#2f8f4e"; ctx.beginPath(); ctx.arc(x, 112, 24, 0, 7); ctx.fill(); }
    ctx.fillStyle = "#8fbf7a"; ctx.fillRect(0, 170, VW, 30); ctx.fillStyle = "#4a6fa5"; ctx.fillRect(0, 196, VW, 54); ctx.fillStyle = "#8fbf7a"; ctx.fillRect(0, 250, VW, 30);
    ctx.strokeStyle = "#f2f6ff"; ctx.lineWidth = 2; [196, 223, 250].forEach((y) => { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(VW, y); ctx.stroke(); });
    for (let m = 0; m <= 60; m += 10) { const x = X0 + m * PPM; ctx.fillStyle = "#f2f6ff"; ctx.fillRect(x - 1, 192, 3, 62); ctx.fillStyle = "#1b1f4a"; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = "center"; ctx.fillText(m + " m", x, 272); ctx.textAlign = "left"; }
    if (f.shade) { ctx.fillStyle = "#1f5e33"; ctx.beginPath(); ctx.ellipse(410, 40, 170, 50, 0, 0, 7); ctx.fill(); }
    // Minh
    const x = X0 + sTrue(t) * PPM, run = sTrue(t + 0.05) > sTrue(t) + 0.01, ph = run ? Math.sin(t * 16) : 0, y = 236;
    ctx.strokeStyle = "#f1c27d"; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x, y - 18); ctx.lineTo(x + ph * 9, y); ctx.moveTo(x, y - 18); ctx.lineTo(x - ph * 9, y); ctx.stroke();
    ctx.fillStyle = "#263238"; ctx.fillRect(x - 7, y - 24, 14, 8); ctx.fillStyle = `rgb(${SHIRT})`; ctx.fillRect(x - 8, y - 46, 16, 23);
    ctx.strokeStyle = "#f1c27d"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(x, y - 42); ctx.lineTo(x - ph * 10, y - 30); ctx.moveTo(x, y - 42); ctx.lineTo(x + ph * 10, y - 30); ctx.stroke();
    ctx.fillStyle = "#f1c27d"; ctx.beginPath(); ctx.arc(x, y - 54, 7, 0, 7); ctx.fill(); ctx.fillStyle = "#3b2a1f"; ctx.beginPath(); ctx.arc(x, y - 57, 7, Math.PI, 0); ctx.fill();
    if (f.ball && t > 1) { const bx = X1 - (t - 1) * 4.5 * PPM; if (bx > -10) { ctx.fillStyle = `rgb(${SHIRT})`; ctx.beginPath(); ctx.arc(bx, 240, 10, 0, 7); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(bx, 240, 6, t * 3, t * 3 + 2); ctx.stroke(); } }
    if (f.shade) { ctx.fillStyle = "rgba(0,8,30,.4)"; ctx.fillRect(300, 60, 230, VH - 60); }
    if (f.hide) { ctx.fillStyle = "#6d4c41"; ctx.fillRect(500, 20, 14, VH - 20); ctx.fillStyle = "#2e7d32"; D.rr(ctx, 440, 120, 134, 140, 8); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "800 15px Be Vietnam Pro, sans-serif"; ctx.textAlign = "center"; ctx.fillText("CỐ LÊN", 507, 185); ctx.fillText("CÁC BẠN!", 507, 206); ctx.textAlign = "left"; }
  }

  // ---------- máy theo dõi ----------
  const oc = document.createElement("canvas"); oc.width = FW; oc.height = FH; const octx2 = oc.getContext("2d", { willReadFrequently: true });
  function sense(drawFn) {
    octx2.save(); octx2.scale(SC, SC); drawFn(octx2); octx2.restore();
    const d = octx2.getImageData(0, 0, FW, FH).data, m = new Uint8Array(FW * FH), [r0, g0, b0] = ST.color, tol2 = ST.tol * ST.tol, lc = ST.last && ST.win ? ST.last.cx + (ST.vpx || 0) : null;
    let n = 0, sx = 0, sy = 0;
    for (let i = 0, p = 0; i < m.length; i++, p += 4) { const dr = d[p] - r0, dg = d[p + 1] - g0, db = d[p + 2] - b0; if (dr * dr + dg * dg + db * db < tol2) { const x = i % FW; if (lc != null && Math.abs(x - lc) > 14) { m[i] = 2; continue; } m[i] = 1; n++; sx += x; sy += (i / FW) | 0; } }
    if (lc != null && n >= 3) {
      // tách các vùng màu theo cột, chỉ giữ vùng gần vị trí dự đoán nhất
      const col = new Float32Array(FW), cy = new Float32Array(FW); for (let i = 0; i < m.length; i++) if (m[i] === 1) { col[i % FW]++; cy[i % FW] += (i / FW) | 0; }
      const groups = []; let g = null; for (let x = 0; x < FW; x++) { if (col[x]) { if (!g || x - g.x1 > 1) { g = { x0: x, x1: x, n: 0, sx: 0, sy: 0 }; groups.push(g); } g.x1 = x; g.n += col[x]; g.sx += x * col[x]; g.sy += cy[x]; } }
      const best = groups.filter((q) => q.n >= 3).sort((p1, p2) => Math.abs(p1.sx / p1.n - lc) - Math.abs(p2.sx / p2.n - lc))[0];
      if (best) { for (let i = 0; i < m.length; i++) if (m[i] === 1) { const x = i % FW; if (x < best.x0 || x > best.x1) m[i] = 2; } ST.mask = m; return { cx: best.sx / best.n, cy: best.sy / best.n, n: best.n }; }
    }
    ST.mask = m; return n >= 3 ? { cx: sx / n, cy: sy / n, n } : null;
  }
  const toM = (cx) => (cx / SC - X0) / PPM;
  function speedNow() { const pts = ST.samples.filter((q) => q.s != null && q.t > ST.clock - 1.05); if (pts.length < 3) return null; const mt = pts.reduce((a, q) => a + q.t, 0) / pts.length, ms = pts.reduce((a, q) => a + q.s, 0) / pts.length; let num = 0, den = 0; pts.forEach((q) => { num += (q.t - mt) * (q.s - ms); den += (q.t - mt) ** 2; }); return den ? num / den : null; }
  function step() {
    const t = ST.clock, c = ST.src === "sim" ? sense((ctx) => drawScene(ctx, t, ST.flags)) : sense((ctx) => camDraw(ctx));
    let s = null, kind = "lost";
    if (c) { s = ST.src === "sim" ? toM(c.cx) : (c.cx / FW) * 100; kind = "seen"; ST.cent = c; if (ST.last && t - ST.last.t < 0.25) ST.vpx = 0.6 * (ST.vpx || 0) + 0.4 * (c.cx - ST.last.cx); ST.last = { cx: c.cx, s, t }; }
    else { ST.cent = null; ST.lost++; const v = speedNow(); if (ST.pred && ST.last && v != null) { s = ST.last.s + v * (t - ST.last.t); kind = "pred"; ST.last = { cx: (s * PPM + X0) * SC, s, t }; } }
    ST.samples.push({ t, s, kind, tr: ST.src === "sim" ? sTrue(t) : null });
  }
  function stepCam() { step(); if (ST.samples.length > 150) ST.samples.shift(); }

  // ---------- vẽ sân khấu ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  function drawMask(ctx, x, y, w, h, cent) {
    ctx.fillStyle = "#0b0e26"; ctx.fillRect(x, y, w, h); const m = ST.mask; if (!m) return; const k = w / FW;
    for (let i = 0; i < m.length; i++) if (m[i]) { ctx.fillStyle = m[i] === 1 ? "#ff5d5d" : "rgba(255,93,93,.25)"; ctx.fillRect(x + (i % FW) * k, y + ((i / FW) | 0) * k, Math.ceil(k), Math.ceil(k)); }
    if (ST.win && ST.last) { const lx = x + (ST.last.cx + (ST.vpx || 0)) * k; ctx.strokeStyle = "#ffc34d"; ctx.setLineDash([4, 3]); ctx.strokeRect(lx - 14 * k, y + 1, 28 * k, h - 2); ctx.setLineDash([]); }
    if (cent) { ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x + cent.cx * k - 9, y + cent.cy * k); ctx.lineTo(x + cent.cx * k + 9, y + cent.cy * k); ctx.moveTo(x + cent.cx * k, y + cent.cy * k - 9); ctx.lineTo(x + cent.cx * k, y + cent.cy * k + 9); ctx.stroke(); }
  }
  function renderStage() {
    const ctx = sctx; D.labBg(ctx);
    if (ST.src === "sim") drawScene(ctx, ST.clock, ST.flags); else camDraw(ctx);
    if (ST.cent) { const x = ST.cent.cx / SC, y = ST.cent.cy / SC; ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 3; ctx.strokeRect(x - 16, y - 22, 32, 44); }
    else if (ST.last && ST.samples.length && ST.samples[ST.samples.length - 1].kind === "pred") { const x = ST.last.cx / SC; ctx.strokeStyle = "#a99dff"; ctx.setLineDash([5, 4]); ctx.lineWidth = 3; ctx.strokeRect(x - 16, 168, 32, 50); ctx.setLineDash([]); }
    lab(ctx, "MÁY NHÌN THẤY: CHỈ NHỮNG ĐIỂM ẢNH CÓ MÀU GIỐNG MÀU ĐANG TÌM", 20, 300, "#8f96d4", "600 11px JetBrains Mono, monospace");
    drawMask(ctx, 20, 308, 440, 126, ST.cent);
    const last = ST.samples[ST.samples.length - 1], v = speedNow();
    lab(ctx, `t = ${ST.clock.toFixed(1)} s`, 490, 338, "#fff", "800 22px JetBrains Mono, monospace");
    if (ST.src === "sim") lab(ctx, last && last.s != null ? `Máy đo: ${last.s.toFixed(1)} m${last.kind === "pred" ? " (đoán)" : ""}` : "Máy đo: mất dấu!", 490, 370, last && last.s == null ? "#ff8f6b" : last && last.kind === "pred" ? "#a99dff" : "#5ef2d6", "800 17px Be Vietnam Pro, sans-serif");
    else lab(ctx, ST.cent ? `Vị trí: ${((ST.cent.cx / FW) * 100).toFixed(0)}% chiều ngang` : "Chưa thấy màu đang tìm", 490, 370, ST.cent ? "#5ef2d6" : "#ff8f6b", "800 16px Be Vietnam Pro, sans-serif");
    lab(ctx, v != null ? `Tốc độ: ${v.toFixed(1)} ${ST.src === "sim" ? "m/s" : "% khung/giây"}` : "Tốc độ: —", 490, 400, "#ffc34d", "800 17px Be Vietnam Pro, sans-serif");
    if (ST.src === "sim") lab(ctx, `Thật: ${sTrue(ST.clock).toFixed(1)} m`, 490, 426, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif");
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 50, R = 16, T = 14, B = 30; ctx.clearRect(0, 0, W, H);
    const sim = ST.src === "sim", tmax = sim ? Math.max(12, Math.ceil(tEnd()) + 1) : Math.max(15, ST.clock), t0 = sim ? 0 : Math.max(0, ST.clock - 15), smax = sim ? 60 : 100, X = (t) => L + ((t - t0) / (tmax - t0)) * (W - L - R), Y = (s) => T + (1 - Math.max(0, Math.min(smax, s)) / smax) * (H - T - B);
    ctx.font = "11px JetBrains Mono, monospace"; for (let s = 0; s <= smax; s += sim ? 10 : 20) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(s)); ctx.lineTo(W - R, Y(s)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(s + (sim ? " m" : "%"), 6, Y(s) + 4); }
    for (let t = Math.ceil(t0); t <= tmax; t += 2) { ctx.fillStyle = TH.text; ctx.fillText(t + " s", X(t) - 8, H - 10); }
    if (sim) { ctx.setLineDash([6, 5]); ctx.strokeStyle = TH.amber; ctx.lineWidth = 2; ctx.beginPath(); for (let t = 0; t <= tEnd(); t += 0.1) t ? ctx.lineTo(X(t), Y(sTrue(t))) : ctx.moveTo(X(t), Y(0)); ctx.stroke(); ctx.setLineDash([]); }
    ST.samples.forEach((q) => { if (q.t < t0) return; if (q.s == null) { ctx.fillStyle = TH.coral; ctx.fillRect(X(q.t) - 2, H - B - 8, 4, 8); return; } ctx.fillStyle = q.kind === "pred" ? TH.violet : TH.mint; ctx.beginPath(); ctx.arc(X(q.t), Y(q.s), 3.2, 0, 7); ctx.fill(); });
    ctx.fillStyle = TH.text; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText(sim ? "Nét đứt vàng: Minh chạy thật · Chấm xanh: máy đo · Chấm tím: máy đoán · Vạch đỏ: mất dấu" : "Chấm xanh: vị trí vật theo phần trăm chiều ngang khung hình", L + 8, T + 12);
  }
  function brain() {
    const s = ST.samples.filter((q) => q.s != null), last = s[s.length - 1], v = speedNow(), sim = ST.src === "sim";
    $("bT").textContent = ST.clock.toFixed(1).replace(".", ",") + " s"; $("bS").textContent = last ? last.s.toFixed(1).replace(".", ",") + (sim ? " m" : "%") : "—"; $("bV").textContent = v != null ? v.toFixed(1).replace(".", ",") + (sim ? " m/s" : "%/s") : "—"; $("bLost").textContent = ST.lost; $("bLost").style.color = ST.lost ? "#ff8f6b" : "#5ef2d6";
    if (sim && ST.done) { const fin = s.filter((q) => q.s >= 59)[0], tt = tEnd(); $("bAvg").textContent = fin ? (60 / fin.t).toFixed(2).replace(".", ",") + " m/s" : "không đo được"; $("bTrue").textContent = (60 / tt).toFixed(2).replace(".", ",") + " m/s"; }
    else if (sim) { $("bAvg").textContent = "—"; $("bTrue").textContent = "—"; }
    $("bColor").style.background = `rgb(${ST.color})`; $("bColorTxt").textContent = `Đỏ ${ST.color[0]}, xanh lá ${ST.color[1]}, xanh dương ${ST.color[2]}`;
  }
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function reset() { ST.vpx = 0; ST.run = false; ST.done = false; ST.clock = 0; ST.samples = []; ST.lost = 0; ST.last = null; ST.cent = null; ST.mask = null; step(); ST.samples = []; ST.lost = 0; ST.last = null; brain(); renderChart(); say("Minh đứng ở vạch xuất phát. Bấm <b>Chạy và đo</b>."); }
  function finish() {
    ST.run = false; ST.done = true; brain(); prog.done("run"); ST.profs.add(ST.prof); if (ST.profs.size >= 3) prog.done("prof");
    const s = ST.samples.filter((q) => q.s != null), fin = s.filter((q) => q.s >= 59)[0], tt = tEnd();
    const vn = (x, d) => x.toFixed(d).replace(".", ","); say(fin ? `Minh về đích sau <b>${vn(tt, 1)} s</b>. Máy đo tốc độ trung bình <b>${vn(60 / fin.t, 2)} m/s</b> (thật: ${vn(60 / tt, 2)} m/s). Máy mất dấu <b>${ST.lost}</b> khung hình.` : `Máy không theo dõi được Minh tới đích (mất dấu ${ST.lost} khung hình) nên không tính được tốc độ trung bình.`);
  }

  // ---------- camera ----------
  const video = $("video");
  function camDraw(ctx) { if (video.readyState >= 2) { ctx.save(); ctx.translate(VW, 0); ctx.scale(-1, 1); const vw = video.videoWidth, vh = video.videoHeight, sc = Math.max(VW / vw, VH / vh); ctx.drawImage(video, (VW - vw * sc) / 2, (VH - vh * sc) / 2, vw * sc, vh * sc); ctx.restore(); } else { ctx.fillStyle = "#1d2152"; ctx.fillRect(0, 0, VW, VH); } }
  async function useCam() {
    try { await P.camera(video); ST.src = "cam"; P.srcButtons("cam"); reset(); ST.color = [40, 120, 230]; guide("Camera đã bật. Cầm một vật có màu nổi bật (nắp hộp, tấm bìa) rồi <b>bấm vào vật đó trên hình</b> để máy học màu. Di chuyển vật từ trái sang phải và xem đồ thị."); ST.run = true; }
    catch (e) { P.msg($("msg"), P.FAIL, "alert", 6000); }
  }
  function setSim() { if (video.srcObject) { video.srcObject.getTracks().forEach((t) => t.stop()); video.srcObject = null; } ST.src = "sim"; P.srcButtons("sim"); ST.color = SHIRT.slice(); reset(); }

  // ---------- SOI ----------
  const SOI = [
    { t: "Video là chuỗi ảnh", e: "film", d: "Camera chụp <b>10 ảnh mỗi giây</b> (khung hình). Máy xử lý từng ảnh một, rất nhanh, nên trông như đang xem video." },
    { t: "Tìm màu áo", e: "scan", d: "Trong mỗi ảnh, máy so màu của từng điểm ảnh với màu đang tìm. Điểm ảnh nào <b>đủ giống</b> (độ lệch nhỏ hơn mức cho phép) được tô đỏ." },
    { t: "Lấy điểm giữa", e: "crosshair", d: "Máy tính <b>trung bình</b> vị trí của các điểm đỏ: đó là vị trí của Minh trong ảnh, tính bằng <b>điểm ảnh</b>." },
    { t: "Đổi ra mét", e: "map", d: "Vạch 0 m và vạch 60 m cách nhau 760 điểm ảnh, nên <b>1 m ≈ 12,7 điểm ảnh</b>. Chia vị trí (tính từ vạch 0) cho 12,7 là ra số mét." },
    { t: "Vẽ đồ thị", e: "chart", d: "Mỗi ảnh cho một cặp số (thời gian, quãng đường). Chấm tất cả lên mặt phẳng là được <b>đồ thị quãng đường – thời gian</b>." },
    { t: "Tính tốc độ", e: "activity", d: "Tốc độ = quãng đường ÷ thời gian. Trên đồ thị, đường <b>càng dốc</b> thì càng nhanh, đoạn <b>nằm ngang</b> là đứng yên." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), sctx2 = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const ctx = sctx2, s = soiStep, tt = ST.src === "sim" ? Math.min(Math.max(ST.clock, 3.5), tEnd()) : 3.5; D.labBg(ctx);
    if (s === 0) { [0, 2, 4, 6, 8, 10].forEach((t, i) => { const x = 20 + (i % 2) * 310, y = 20 + Math.floor(i / 2) * 150; ctx.save(); ctx.beginPath(); ctx.rect(x, y, 290, 92); ctx.clip(); ctx.translate(x, y); ctx.scale(290 / VW, 290 / VW); drawScene(ctx, t, {}); ctx.restore(); lab(ctx, `Ảnh lúc ${t} s`, x, y + 112, "#ffc34d"); }); return; }
    const save = { mask: ST.mask, last: ST.last }; ST.last = null; const c = sense((cc) => drawScene(cc, tt, ST.flags)); const mk = ST.mask;
    ctx.save(); ctx.translate(20, 20); ctx.scale(600 / VW, 600 / VW); drawScene(ctx, tt, ST.flags); ctx.restore();
    ST.mask = mk; if (s >= 1) drawMask(ctx, 20, 220, 600, 191, s >= 2 ? c : null); ST.mask = save.mask; ST.last = save.last;
    if (s === 1) lab(ctx, "Điểm ảnh đỏ: màu giống áo", 20, 440, "#ff8f6b", "700 13px Be Vietnam Pro, sans-serif");
    if (s === 2 && c) lab(ctx, `Điểm giữa: x = ${(c.cx / SC).toFixed(0)} điểm ảnh (từ ${c.n} điểm đỏ)`, 20, 440, "#5ef2d6", "700 13px Be Vietnam Pro, sans-serif");
    if (s === 3 && c) { ctx.fillStyle = "rgba(10,12,38,.85)"; ctx.fillRect(20, 220, 600, 191); const k = 600 / VW; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(20 + X0 * k, 260); ctx.lineTo(20 + X1 * k, 260); ctx.stroke(); lab(ctx, "0 m", 20 + X0 * k, 250, "#ffc34d"); lab(ctx, "60 m", 20 + X1 * k, 250, "#ffc34d", null, "right"); lab(ctx, "760 điểm ảnh = 60 m → 1 m ≈ 12,7 điểm ảnh", 40, 300, "#fff", "700 14px Be Vietnam Pro, sans-serif"); lab(ctx, `(${(c.cx / SC).toFixed(0)} − ${X0}) ÷ 12,7 ≈ ${toM(c.cx).toFixed(1).replace(".", ",")} m`, 40, 340, "#5ef2d6", "800 20px Be Vietnam Pro, sans-serif"); }
    if (s >= 4) {
      ctx.fillStyle = "#121633"; ctx.fillRect(0, 0, 640, 480); const pts = ST.samples.length > 10 && ST.src === "sim" ? ST.samples : null, te = tEnd(), Xp = (t) => 50 + (t / Math.max(12, te + 1)) * 560, Yp = (v) => 420 - (v / 60) * 380;
      ctx.strokeStyle = "#2c3270"; for (let m = 0; m <= 60; m += 10) { ctx.beginPath(); ctx.moveTo(50, Yp(m)); ctx.lineTo(610, Yp(m)); ctx.stroke(); lab(ctx, m + " m", 8, Yp(m) + 4, "#8f96d4", "11px JetBrains Mono, monospace"); }
      if (pts) pts.forEach((q) => { if (q.s == null) return; ctx.fillStyle = q.kind === "pred" ? "#a99dff" : "#5ef2d6"; ctx.beginPath(); ctx.arc(Xp(q.t), Yp(q.s), 3, 0, 7); ctx.fill(); });
      else { ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 3; ctx.beginPath(); for (let t = 0; t <= te; t += 0.1) t ? ctx.lineTo(Xp(t), Yp(sTrue(t))) : ctx.moveTo(Xp(0), Yp(0)); ctx.stroke(); lab(ctx, "(em hãy bấm Chạy và đo để dùng số liệu của em)", 60, 30, "#8f96d4", "11px Be Vietnam Pro, sans-serif"); }
      if (s === 5) { const a = 1, b = Math.min(te - 0.5, a + 3), sa = sTrue(a), sb = sTrue(b); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(Xp(a), Yp(sa)); ctx.lineTo(Xp(b), Yp(sa)); ctx.lineTo(Xp(b), Yp(sb)); ctx.stroke(); ctx.setLineDash([]); const c1 = (x) => x.toFixed(1).replace(".", ","); lab(ctx, `${c1(b - a)} s`, (Xp(a) + Xp(b)) / 2, Yp(sa) + 18, "#ffc34d", null, "center"); lab(ctx, `${c1(sb - sa)} m`, Xp(b) + 8, (Yp(sa) + Yp(sb)) / 2, "#ffc34d"); lab(ctx, `Tốc độ = ${c1(sb - sa)} ÷ ${c1(b - a)} ≈ ${c1((sb - sa) / (b - a))} m/s`, 330, 450, "#fff", "800 16px Be Vietnam Pro, sans-serif", "center"); }
    }
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive");
    if (s === 0) el.innerHTML = `Lần đo vừa rồi có <span class="hl">${ST.samples.length}</span> khung hình`;
    else if (s <= 2) el.innerHTML = `Màu đang tìm <span class="hl">(${ST.color.join(", ")})</span> · độ lệch cho phép <span class="w">${ST.tol}</span>`;
    else if (s === 3) el.innerHTML = `1 m ≈ <span class="hl">12,7</span> điểm ảnh`;
    else { const v = speedNow(); el.innerHTML = `Tốc độ máy đo lúc này: <span class="hl">${v != null ? v.toFixed(1) + " m/s" : "—"}</span>`; }
  }

  // ---------- điều khiển ----------
  function bind() {
    $("btnRun").onclick = () => { if (ST.src !== "sim") return; reset(); ST.run = true; say("Minh đang chạy… máy đang theo dõi từng khung hình."); };
    $("btnReset").onclick = reset;
    $("profBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.prof = b.dataset.p; $("profBtns").querySelectorAll("button").forEach((x) => x.classList.toggle("ghost", x !== b)); reset(); }));
    stage.addEventListener("click", (e) => { const r = stage.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * stage.width, y = ((e.clientY - r.top) / r.height) * stage.height; if (y > VH) return; const d = sctx.getImageData(Math.round(x), Math.round(y), 1, 1).data; ST.color = [d[0], d[1], d[2]]; ST.last = null; prog.done("pick"); brain(); const near = Math.hypot(d[0] - SHIRT[0], d[1] - SHIRT[1], d[2] - SHIRT[2]) < 40; guide(near || ST.src !== "sim" ? `Máy sẽ tìm màu (${ST.color.join(", ")}). ${ST.src === "sim" ? "Đó là màu áo của Minh." : "Di chuyển vật đó trước camera."}` : `Em vừa chọn màu (${ST.color.join(", ")}), không phải áo của Minh. Bấm <b>Chạy và đo</b> xem máy theo dõi cái gì! Bấm lại vào áo đỏ để sửa.`); if (ST.src === "sim") { step(); ST.samples = []; ST.lost = 0; } });
    const setTol = P.range("tol", () => ST.tol, (v) => (ST.tol = v), (v) => v);
    const setV = P.range("v", () => ST.v, (v) => (ST.v = v), (v) => v.toFixed(1).replace(".", ",") + " m/s", reset);
    $("optWin").onchange = (e) => (ST.win = e.target.checked); $("optPred").onchange = (e) => (ST.pred = e.target.checked);
    $("srcSim").onclick = setSim; $("srcCam").onclick = useCam;
    const clear = () => { ST.flags = {}; ST.tol = 60; setTol(); ST.win = false; $("optWin").checked = false; ST.pred = false; $("optPred").checked = false; ST.color = SHIRT.slice(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; if (ST.src !== "sim") setSim(); clear(); b.closest(".break").classList.add("on"); prog.done("broke"); ST.flags = { [k]: true };
      reset(); ST.run = true;
      guide(k === "hide" ? "Tấm biển cổ vũ che mất Minh trong vài giây. Xem đồ thị: những vạch đỏ là lúc máy mất dấu. Bật <b>Đoán vị trí khi mất dấu</b> rồi đo lại." : k === "ball" ? "Một quả bóng đỏ lăn ngược chiều! Xem khung \"máy nhìn thấy\": có hai vùng đỏ, vị trí đo nhảy lung tung. Bật <b>Chỉ tìm gần vị trí cũ</b> rồi đo lại." : "Đoạn giữa có bóng cây, áo đỏ tối hẳn đi và máy không nhận ra. Tăng <b>Độ lệch màu cho phép</b> lên khoảng 100 rồi đo lại.");
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); reset(); guide("Mọi sự cố đã tắt. Bấm <b>Chạy và đo</b> để đo lại nhé!"); };
  }

  const QUIZ = [
    { q: "Máy theo dõi người chạy trong video bằng cách nào?", o: ["Hỏi người chạy đang ở đâu", "Tìm các điểm ảnh có màu giống màu áo trong từng khung hình và lấy điểm giữa", "Đo bằng thước dây", "Đoán ngẫu nhiên"], a: 1, e: "Mỗi khung hình, máy tìm vùng màu giống áo, lấy điểm giữa làm vị trí." },
    { q: "Minh chạy 60 m hết 10 s. Tốc độ trung bình là bao nhiêu?", o: ["600 m/s", "6 m/s", "0,6 m/s", "70 m/s"], a: 1, e: "Tốc độ = quãng đường ÷ thời gian = 60 ÷ 10 = 6 m/s." },
    { q: "Trên đồ thị quãng đường – thời gian, đoạn nằm ngang nghĩa là gì?", o: ["Chạy rất nhanh", "Đứng yên: thời gian trôi nhưng quãng đường không đổi", "Chạy lùi", "Máy bị hỏng"], a: 1, e: "Quãng đường không tăng thì tốc độ bằng 0, người đó đang đứng yên." },
    { q: "Một quả bóng cùng màu áo lăn vào khung hình. Cách nào giúp máy không nhầm?", o: ["Tăng độ lệch màu cho phép thật nhiều", "Chỉ tìm màu ở gần vị trí người chạy vừa ở", "Tắt máy", "Đổi sang tìm màu xanh của cây"], a: 1, e: "Người chạy không thể nhảy xa trong 0,1 giây, nên chỉ cần tìm quanh vị trí cũ." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now(), acc = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.run) { acc += dt; while (acc >= DT && ST.run) { acc -= DT; ST.clock += DT; if (ST.src === "sim") { step(); if (ST.clock > tEnd() + 0.5) finish(); } else stepCam(); } brain(); renderChart(); }
    renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick);
  }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); P.srcButtons("sim"); reset(); guide("Bấm <b>Chạy và đo</b>. Khung nhỏ phía dưới là thứ máy thấy: chỉ những điểm ảnh có màu giống áo đỏ được tô sáng.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka30 = { ST, sTrue, tEnd, reset, finish, step, speedNow };
  requestAnimationFrame(tick);
})();
