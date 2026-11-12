/* Hộp Kính AI · Dự án 12 · Phông nền ảo (phân loại từng điểm ảnh, bản đồ xác suất, ngưỡng, viền, IoU) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-12");
  const W = 640, H = 480, GW = 96, GH = 72, N = GW * GH, NF = 14;
  const DEF = { th: 0.5, blur: 1, feather: 1, bg: "bien", view: "out", wallShirt: false, side: false, backlit: false, dPos: false, dLight: false, dColor: false };
  const ST = { src: "sim", ...DEF, t: 0, scene: null, prob: new Float32Array(N), mask: new Uint8Array(N), gt: new Uint8Array(N), iou: null, hist: [], model: null, viewsSeen: new Set(["out"]) };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), video = $("video");
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d", { willReadFrequently: true })]; };
  const [full, fctx] = mk(W, H), [small, smctx] = mk(GW, GH), [gtC, gctx] = mk(GW, GH), [maskC, mctx] = mk(GW, GH), [bgC, bctx] = mk(W, H), [tmp, tctx] = mk(W, H);

  // ---------- cảnh gọi video mô phỏng ----------
  const SHIRTS = ["#2f7bd6", "#d8343a", "#2fa35a", "#f2b632", "#8a3fd1", "#ff8fb1", "#ffffff", "#333333"];
  function newScene(opt, rnd) {
    const r = rnd || Math.random, wallCol = ["#e8dcc4", "#cfe0e8", "#e8d0d6", "#d8e6cf"][Math.floor(r() * 4)];
    const s = { kind: ["phong", "tuong", "quan"][Math.floor(r() * 3)], wall: wallCol, shirt: SHIRTS[Math.floor(r() * SHIRTS.length)], hair: r() < 0.5 ? "#2a1e1a" : "#5a3a22", dx: (r() - 0.5) * 60, scale: 0.9 + r() * 0.2, dark: 0, wave: r() < 0.4, seed: r() * 100 };
    if (opt.wallShirt) { s.kind = "tuong"; s.shirt = s.wall; }
    if (opt.side) s.dx = (r() < 0.5 ? -1 : 1) * (150 + r() * 50);
    if (opt.anyPos) s.dx = (r() * 2 - 1) * 210;
    if (opt.backlit) { s.kind = "phong"; s.backlit = true; s.dark = 0.72; }
    return s;
  }
  function drawBg(ctx, s) {
    ctx.fillStyle = s.wall; ctx.fillRect(0, 0, W, H);
    if (s.kind === "phong") {
      ctx.fillStyle = "#7a5230"; ctx.fillRect(20, 60, 170, 380); ctx.fillStyle = "#5e3e22"; for (let i = 0; i < 4; i++) ctx.fillRect(20, 140 + i * 90, 170, 10);
      const bc = ["#d8343a", "#2f7bd6", "#f2b632", "#2fa35a", "#8a3fd1"]; for (let sh = 0; sh < 4; sh++) for (let i = 0; i < 7; i++) { ctx.fillStyle = bc[(i + sh) % 5]; ctx.fillRect(30 + i * 22, 70 + sh * 90, 18, 66); }
      ctx.fillStyle = s.backlit ? "#ffffff" : "#bfe3f7"; ctx.fillRect(430, 50, 190, 240); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 8; ctx.strokeRect(430, 50, 190, 240); ctx.beginPath(); ctx.moveTo(525, 50); ctx.lineTo(525, 290); ctx.stroke();
      if (s.backlit) { const g = ctx.createRadialGradient(525, 170, 20, 525, 170, 360); g.addColorStop(0, "rgba(255,255,240,.95)"); g.addColorStop(1, "rgba(255,255,240,0)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
      ctx.fillStyle = "#2f6e2c"; ctx.beginPath(); ctx.ellipse(590, 400, 40, 70, 0, 0, 7); ctx.fill();
    } else if (s.kind === "quan") {
      ctx.fillStyle = "#3b2a22"; ctx.fillRect(0, 0, W, H);
      const r = P.rng(Math.floor(s.seed * 1000)); for (let i = 0; i < 26; i++) { ctx.fillStyle = `rgba(${200 + r() * 55},${140 + r() * 80},${60 + r() * 60},${0.25 + r() * 0.35})`; ctx.beginPath(); ctx.arc(r() * W, r() * H * 0.8, 14 + r() * 30, 0, 7); ctx.fill(); }
    }
  }
  function drawPerson(ctx, s, t, maskMode) {
    const cx = 320 + s.dx + Math.sin(t * 0.8) * 14, sc = s.scale, col = (c) => (maskMode ? "#fff" : c);
    ctx.save(); ctx.translate(cx, 0);
    ctx.fillStyle = col(s.shirt); ctx.beginPath(); ctx.moveTo(-150 * sc, 480); ctx.lineTo(-138 * sc, 330); ctx.quadraticCurveTo(-120 * sc, 285, -50 * sc, 280); ctx.lineTo(50 * sc, 280); ctx.quadraticCurveTo(120 * sc, 285, 138 * sc, 330); ctx.lineTo(150 * sc, 480); ctx.closePath(); ctx.fill();
    if (s.wave) { const a = -0.6 + Math.sin(t * 3) * 0.35; ctx.save(); ctx.translate(120 * sc, 320); ctx.rotate(a); ctx.fillStyle = col(s.shirt); D.rr(ctx, -20 * sc, -140 * sc, 40 * sc, 150 * sc, 18 * sc); ctx.fill(); ctx.fillStyle = col("#f1c29a"); ctx.beginPath(); ctx.arc(0, -150 * sc, 22 * sc, 0, 7); ctx.fill(); ctx.restore(); }
    ctx.fillStyle = col("#e3ad85"); ctx.fillRect(-26 * sc, 220, 52 * sc, 70);
    ctx.fillStyle = col("#f1c29a"); ctx.beginPath(); ctx.ellipse(0, 190, 58 * sc, 72 * sc, 0, 0, 7); ctx.fill();
    ctx.fillStyle = col(s.hair); ctx.beginPath(); ctx.ellipse(0, 150, 66 * sc, 48 * sc, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-66 * sc, 148, 16 * sc, 70); ctx.fillRect(50 * sc, 148, 16 * sc, 70);
    for (let i = 0; i < 9; i++) { const a = Math.PI + (i / 8) * Math.PI; ctx.strokeStyle = col(s.hair); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 60 * sc, 150 + Math.sin(a) * 44 * sc); ctx.lineTo(Math.cos(a) * 74 * sc, 150 + Math.sin(a) * 58 * sc + Math.sin(t * 2 + i) * 3); ctx.stroke(); }
    if (!maskMode) { ctx.fillStyle = "#2a1e1a"; ctx.beginPath(); ctx.arc(-20 * sc, 190, 5, 0, 7); ctx.arc(20 * sc, 190, 5, 0, 7); ctx.fill(); ctx.strokeStyle = "#c9566a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 210, 16 * sc, 0.2, Math.PI - 0.2); ctx.stroke(); }
    ctx.restore();
    if (!maskMode && s.dark) { /* ngược sáng: người tối đi */ }
  }
  function renderScene(ctxOut, s, t) {
    drawBg(fctx, s); tctx.clearRect(0, 0, W, H); drawPerson(tctx, s, t, false);
    if (s.dark) { tctx.globalCompositeOperation = "source-atop"; tctx.fillStyle = `rgba(10,10,20,${s.dark})`; tctx.fillRect(0, 0, W, H); tctx.globalCompositeOperation = "source-over"; }
    fctx.drawImage(tmp, 0, 0);
    if (ctxOut) ctxOut.drawImage(full, 0, 0);
    smctx.drawImage(full, 0, 0, GW, GH);
    gctx.fillStyle = "#000"; gctx.fillRect(0, 0, GW, GH); gctx.save(); gctx.scale(GW / W, GH / H); drawPerson(gctx, s, t, true); gctx.restore();
    const g = gctx.getImageData(0, 0, GW, GH).data; for (let i = 0; i < N; i++) ST.gt[i] = g[i * 4] > 127 ? 1 : 0;
  }

  // ---------- đặc trưng từng điểm ảnh ----------
  function pixelFeatures(img) {
    const d = img.data, R = new Float32Array(N), G2 = new Float32Array(N), B = new Float32Array(N), V = new Float32Array(N);
    for (let i = 0; i < N; i++) { R[i] = d[i * 4] / 255; G2[i] = d[i * 4 + 1] / 255; B[i] = d[i * 4 + 2] / 255; V[i] = Math.max(R[i], G2[i], B[i]); }
    const box = (A) => { const o = new Float32Array(N); for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { let s = 0, n = 0; for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && xx < GW && yy >= 0 && yy < GH) { s += A[yy * GW + xx]; n++; } } o[y * GW + x] = s / n; } return o; };
    const mR = box(R), mG = box(G2), mB = box(B), mV = box(V), F = new Array(N);
    for (let i = 0; i < N; i++) {
      const r = R[i], g = G2[i], b = B[i], mx = V[i], mn = Math.min(r, g, b), s = mx ? (mx - mn) / mx : 0; let h = 0; if (mx - mn) { h = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4; h /= 6; }
      const x = (i % GW) / GW * 2 - 1, y = Math.floor(i / GW) / GH;
      F[i] = [r, g, b, s, mx, Math.cos(h * 6.283) * s, Math.sin(h * 6.283) * s, x, y, Math.abs(x), mR[i], mG[i], mB[i], Math.abs(mx - mV[i]) * 3];
    }
    return F;
  }
  // ---------- mạng nhỏ 14 → 16 → 1 ----------
  function makeModel() { const r = P.rng(9), n = () => (r() * 2 - 1) * 0.5; return { W1: Array.from({ length: 16 }, () => Array.from({ length: NF }, n)), b1: new Array(16).fill(0), W2: Array.from({ length: 16 }, n), b2: 0, mu: null, sd: null }; }
  function fwd(m, f) { const x = f.map((v, j) => (v - m.mu[j]) / m.sd[j]), a = m.W1.map((w, h) => { let s = m.b1[h]; for (let j = 0; j < NF; j++) s += w[j] * x[j]; return s > 0 ? s : 0; }); let z = m.b2; for (let h = 0; h < 16; h++) z += m.W2[h] * a[h]; return { x, a, p: 1 / (1 + Math.exp(-z)) }; }
  const TP = { frames: 36, per: 320, epochs: 10, lr: 0.04 };
  function train() {
    const r = P.rng(5), X = [], Y = [];
    for (let k = 0; k < TP.frames; k++) {
      const o = { anyPos: ST.dPos && r() < 0.7, wallShirt: ST.dColor && r() < 0.3, backlit: ST.dLight && r() < 0.3 };
      const s = newScene(o, r); renderScene(null, s, r() * 10);
      const F = pixelFeatures(smctx.getImageData(0, 0, GW, GH)), pos = [], neg = [];
      for (let i = 0; i < N; i++) (ST.gt[i] ? pos : neg).push(i);
      for (let i = 0; i < TP.per; i++) { const src = i % 2 ? pos : neg, j = src[Math.floor(r() * src.length)]; X.push(F[j]); Y.push(ST.gt[j]); }
    }
    const m = makeModel(); m.mu = new Array(NF).fill(0); m.sd = new Array(NF).fill(0);
    X.forEach((f) => f.forEach((v, j) => (m.mu[j] += v / X.length))); X.forEach((f) => f.forEach((v, j) => (m.sd[j] += (v - m.mu[j]) ** 2 / X.length))); m.sd = m.sd.map((v) => Math.sqrt(v) || 1);
    const idx = X.map((_, i) => i);
    for (let ep = 0; ep < TP.epochs; ep++) {
      const lr = TP.lr / (1 + ep * 0.3);
      for (let a = idx.length - 1; a > 0; a--) { const b = Math.floor(r() * (a + 1)); [idx[a], idx[b]] = [idx[b], idx[a]]; }
      for (const i of idx) {
        const o = fwd(m, X[i]), e = o.p - Y[i];
        for (let h = 0; h < 16; h++) { const g = e * m.W2[h] * (o.a[h] > 0 ? 1 : 0); m.W2[h] -= lr * e * o.a[h]; if (g) { const w = m.W1[h]; for (let j = 0; j < NF; j++) w[j] -= lr * g * o.x[j]; m.b1[h] -= lr * g; } }
        m.b2 -= lr * e;
      }
    }
    ST.model = m;
    const extra = [ST.dPos && "vị trí đa dạng", ST.dLight && "ánh sáng đa dạng", ST.dColor && "màu áo đa dạng"].filter(Boolean);
    $("trainInfo").textContent = `Đã học từ ${X.length.toLocaleString("vi-VN")} điểm ảnh của ${TP.frames} khung hình` + (extra.length ? " · " + extra.join(", ") : " · chỉ người ngồi giữa, đủ sáng");
  }
  function segment() {
    const F = pixelFeatures(smctx.getImageData(0, 0, GW, GH));
    for (let i = 0; i < N; i++) ST.prob[i] = fwd(ST.model, F[i]).p;
    ST.F = F;
  }
  function postprocess() {
    let p = ST.prob;
    if (ST.blur > 0) { const o = new Float32Array(N), r = ST.blur; for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { let s = 0, n = 0; for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && xx < GW && yy >= 0 && yy < GH) { s += p[yy * GW + xx]; n++; } } o[y * GW + x] = s / n; } p = o; }
    ST.smooth = p; let inter = 0, uni = 0;
    for (let i = 0; i < N; i++) { ST.mask[i] = p[i] >= ST.th ? 1 : 0; if (ST.src === "sim") { if (ST.mask[i] && ST.gt[i]) inter++; if (ST.mask[i] || ST.gt[i]) uni++; } }
    ST.iou = ST.src === "sim" ? inter / (uni || 1) : null;
    // mặt nạ mềm cho ảnh ghép
    const img = mctx.createImageData(GW, GH), f = ST.feather;
    for (let i = 0; i < N; i++) { const a = f ? Math.max(0, Math.min(1, (p[i] - ST.th) / (0.12 * f) + 0.5)) : ST.mask[i]; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = 255; img.data[i * 4 + 3] = a * 255; }
    mctx.putImageData(img, 0, 0);
  }

  // ---------- phông nền ảo ----------
  function drawVirtualBg(ctx, kind) {
    if (kind === "lam-mo") { ctx.filter = "blur(14px)"; ctx.drawImage(full, -20, -20, W + 40, H + 40); ctx.filter = "none"; return; }
    if (kind === "bien") { const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#7fd3ff"); g.addColorStop(0.55, "#bdeaff"); g.addColorStop(0.56, "#1b8fc7"); g.addColorStop(0.75, "#3fb4e0"); g.addColorStop(0.76, "#f2d9a0"); g.addColorStop(1, "#e8c98a"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#fff6c0"; ctx.beginPath(); ctx.arc(520, 90, 40, 0, 7); ctx.fill(); return; }
    if (kind === "vu-tru") { ctx.fillStyle = "#070818"; ctx.fillRect(0, 0, W, H); const r = P.rng(4); for (let i = 0; i < 140; i++) { ctx.fillStyle = `rgba(255,255,255,${r()})`; ctx.fillRect(r() * W, r() * H, 2, 2); } ctx.fillStyle = "#9184ff"; ctx.beginPath(); ctx.arc(120, 120, 60, 0, 7); ctx.fill(); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(120, 120, 100, 22, -0.3, 0, 7); ctx.stroke(); return; }
    if (kind === "lop-hoc") { ctx.fillStyle = "#f3efe2"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = "#1f4d3a"; ctx.fillRect(60, 60, 520, 240); ctx.strokeStyle = "#8a6236"; ctx.lineWidth = 10; ctx.strokeRect(60, 60, 520, 240); ctx.fillStyle = "#e8eaff"; ctx.font = "700 30px Be Vietnam Pro"; ctx.fillText("y = w·x + b", 110, 150); ctx.fillText("Hộp Kính AI", 110, 220); }
  }
  function compose(ctx) {
    drawVirtualBg(bctx, ST.bg); ctx.drawImage(bgC, 0, 0);
    tctx.clearRect(0, 0, W, H); tctx.drawImage(full, 0, 0); tctx.globalCompositeOperation = "destination-in"; tctx.imageSmoothingEnabled = true; if (ST.feather) tctx.filter = `blur(${ST.feather * 2.5}px)`; tctx.drawImage(maskC, 0, 0, W, H); tctx.filter = "none"; tctx.globalCompositeOperation = "source-over";
    ctx.drawImage(tmp, 0, 0);
  }
  function heatProb(ctx, p, x0, y0, w, h) { const img = ctx.createImageData(GW, GH); for (let i = 0; i < N; i++) { const v = p[i], [r, g, b] = [30 + 225 * v, 20 + 200 * Math.max(0, v - 0.5) * 2, 90 + 120 * (1 - v)]; img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = 255; } const [c, cx] = mk(GW, GH); cx.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(c, x0, y0, w, h); ctx.imageSmoothingEnabled = true; }
  function errorMap(ctx, x0, y0, w, h) { const img = ctx.createImageData(GW, GH); for (let i = 0; i < N; i++) { const m = ST.mask[i], g = ST.gt[i]; const c = m && g ? [62, 233, 207, 140] : m && !g ? [255, 93, 93, 255] : !m && g ? [84, 140, 255, 255] : [0, 0, 0, 0]; img.data.set(c, i * 4); } const [c, cx] = mk(GW, GH); cx.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(c, x0, y0, w, h); ctx.imageSmoothingEnabled = true; }
  function renderStage() {
    const ctx = sctx;
    if (ST.view === "out") compose(ctx);
    else if (ST.view === "goc") ctx.drawImage(full, 0, 0);
    else if (ST.view === "xs") heatProb(ctx, ST.smooth || ST.prob, 0, 0, W, H);
    else if (ST.view === "loi") { ctx.drawImage(full, 0, 0); ctx.fillStyle = "rgba(10,12,38,.55)"; ctx.fillRect(0, 0, W, H); if (ST.src === "sim") errorMap(ctx, 0, 0, W, H); }
    if (ST.iou != null) { ctx.fillStyle = "rgba(10,12,38,.82)"; D.rr(ctx, 14, 14, 170, 52, 12); ctx.fill(); ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText("ĐỘ KHỚP (IoU)", 28, 34); ctx.fillStyle = ST.iou > 0.85 ? "#5ef2d6" : ST.iou > 0.7 ? "#ffc34d" : "#ff7d5f"; ctx.font = "800 20px JetBrains Mono, monospace"; ctx.fillText(Math.round(ST.iou * 100) + "%", 28, 58); }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh vào", e: "image", d: "Khung hình được thu nhỏ còn <b>96 × 72 = 6.912 điểm ảnh</b>. Máy sẽ phải trả lời 6.912 câu hỏi \"đây là người hay nền?\" cho <b>mỗi</b> khung hình." },
    { t: "Đặc trưng điểm ảnh", e: "layers", d: "Mỗi điểm ảnh có <b>14 con số</b>: màu (đỏ, lục, lam, độ đậm, độ sáng, sắc), <b>vị trí</b> trong khung và màu trung bình xung quanh nó. Ô vàng là điểm ảnh đang được soi." },
    { t: "Bản đồ xác suất", e: "chart", d: "Mạng nơ-ron nhỏ cho mỗi điểm ảnh một <b>xác suất là người</b>. Vàng sáng là chắc chắn người, tím đậm là chắc chắn nền, màu ở giữa là \"phân vân\"." },
    { t: "Ngưỡng → mặt nạ", e: "sliders", d: "Điểm nào có xác suất ≥ <b>ngưỡng</b> thì là người (trắng), còn lại là nền (đen). Kết quả là một <b>mặt nạ</b> đen trắng." },
    { t: "Làm mượt viền", e: "sparkle", d: "Mặt nạ thô có răng cưa và đốm lẻ. Ta <b>làm mờ</b> bản đồ xác suất trước khi so ngưỡng, rồi làm <b>mềm viền</b> để ảnh ghép tự nhiên hơn." },
    { t: "Ghép phông nền", e: "image", d: "Vẽ phông nền ảo trước, rồi dán người lên trên <b>qua mặt nạ</b>. Mỗi khung hình làm lại từ đầu, khoảng 30 lần mỗi giây." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 2) prog.done("see"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const PIX = { x: 48, y: 40 };
  function renderSoi() {
    const s = pipe.get(), ctx = octx; D.labBg(ctx);
    if (s === 0) { ctx.imageSmoothingEnabled = false; ctx.drawImage(small, 32, 24, 576, 432); ctx.imageSmoothingEnabled = true; ctx.strokeStyle = "rgba(0,0,0,.25)"; for (let x = 0; x <= GW; x += 4) { ctx.beginPath(); ctx.moveTo(32 + x * 6, 24); ctx.lineTo(32 + x * 6, 456); ctx.stroke(); } for (let y = 0; y <= GH; y += 4) { ctx.beginPath(); ctx.moveTo(32, 24 + y * 6); ctx.lineTo(608, 24 + y * 6); ctx.stroke(); } return; }
    if (s === 1) {
      ctx.imageSmoothingEnabled = false; ctx.drawImage(small, 20, 60, 288, 216); ctx.imageSmoothingEnabled = true; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.strokeRect(20 + PIX.x * 3 - 2, 60 + PIX.y * 3 - 2, 7, 7);
      const f = ST.F && ST.F[PIX.y * GW + PIX.x]; if (!f) return; const names = ["đỏ", "lục", "lam", "độ đậm", "độ sáng", "sắc cos", "sắc sin", "vị trí x", "vị trí y", "|x|", "TB đỏ", "TB lục", "TB lam", "tương phản"];
      names.forEach((n, j) => { const y = 40 + j * 29, v = f[j]; ctx.fillStyle = "#c3c7f0"; ctx.font = "12px Be Vietnam Pro"; ctx.fillText(n, 340, y + 14); ctx.fillStyle = "#232866"; ctx.fillRect(430, y + 3, 160, 14); ctx.fillStyle = j >= 7 && j <= 9 ? "#ffc34d" : "#5ef2d6"; ctx.fillRect(j === 7 || j === 5 || j === 6 ? 510 : 430, y + 3, (j === 7 || j === 5 || j === 6 ? v * 80 : Math.min(1, v) * 160), 14); ctx.fillStyle = "#fff"; ctx.fillText(v.toFixed(2), 596, y + 14); });
      D.pill(ctx, `P(người) = ${Math.round(ST.prob[PIX.y * GW + PIX.x] * 100)}%`, 164, 320, "#5443ff", 14); return;
    }
    if (s === 2) { heatProb(ctx, ST.prob, 32, 24, 576, 432); return; }
    if (s === 3) { const img = ctx.createImageData(GW, GH); for (let i = 0; i < N; i++) { const v = (ST.prob[i] >= ST.th) * 255; img.data[i * 4] = img.data[i * 4 + 1] = img.data[i * 4 + 2] = v; img.data[i * 4 + 3] = 255; } const [c, cx] = mk(GW, GH); cx.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(c, 32, 24, 576, 432); ctx.imageSmoothingEnabled = true; D.pill(ctx, `ngưỡng ${ST.th.toFixed(2)}`, 320, 40, "#5443ff", 14); return; }
    if (s === 4) {
      // phóng to vùng vai: trước và sau làm mượt
      const zx = Math.max(0, Math.min(GW - 24, Math.round((320 + (ST.scene ? ST.scene.dx : 0) + 90) / W * GW) - 12)), zy = 36;
      for (const [k, src, x0] of [[0, ST.prob, 20], [1, ST.smooth, 330]]) { for (let y = 0; y < 18; y++) for (let x = 0; x < 24; x++) { const v = src[(zy + y) * GW + zx + x] >= ST.th; ctx.fillStyle = v ? "#f0f2ff" : "#0b0d26"; ctx.fillRect(x0 + x * 12, 90 + y * 12, 11, 11); } ctx.fillStyle = "#fff"; ctx.font = "700 13px Be Vietnam Pro"; ctx.fillText(k ? `sau khi làm mờ bán kính ${ST.blur}` : "mặt nạ thô", x0, 76); }
      return;
    }
    compose(ctx);
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"); const pers = ST.mask.reduce((a, b) => a + b, 0);
    if (s === 0) el.innerHTML = `Điểm ảnh: <span class="hl">6.912</span> · đặc trưng mỗi điểm: <span class="hl">14</span>\n→ <span class="w">96.768</span> con số mỗi khung hình`;
    else if (s === 1) el.innerHTML = `Điểm ảnh (${PIX.x}, ${PIX.y}): P(người) = <span class="hl">${Math.round(ST.prob[PIX.y * GW + PIX.x] * 100)}%</span>\nThật ra là: <span class="w">${ST.src === "sim" ? (ST.gt[PIX.y * GW + PIX.x] ? "người" : "nền") : "—"}</span>`;
    else if (s === 2) { const unsure = Array.from(ST.prob).filter((v) => v > 0.3 && v < 0.7).length; el.innerHTML = `Điểm ảnh "phân vân" (30–70%): <span class="w">${unsure}</span>\nChắc chắn là người (> 90%): <span class="hl">${Array.from(ST.prob).filter((v) => v > 0.9).length}</span>`; }
    else if (s === 3) el.innerHTML = `Ngưỡng: <span class="w">${ST.th.toFixed(2)}</span>\nĐiểm ảnh được tính là người: <span class="hl">${pers}</span> (${Math.round(pers / N * 100)}%)`;
    else if (s === 4) el.innerHTML = `Làm mờ: <span class="w">${ST.blur}</span> · Làm mềm viền: <span class="w">${ST.feather}</span>\nIoU: <span class="hl">${ST.iou != null ? Math.round(ST.iou * 100) + "%" : "—"}</span>`;
    else el.innerHTML = `Phông nền: <span class="hl">${{ bien: "bãi biển", "vu-tru": "vũ trụ", "lop-hoc": "lớp học", "lam-mo": "làm mờ phòng thật" }[ST.bg]}</span>`;
  }

  // ---------- bảng não, biểu đồ, code ----------
  function renderBrain() {
    $("bIou").textContent = ST.iou != null ? Math.round(ST.iou * 100) + "%" : "—"; $("bIou").style.color = ST.iou == null ? "" : ST.iou > 0.85 ? "#5ef2d6" : ST.iou > 0.7 ? "#ffc34d" : "#ff7d5f";
    let fp = 0, fn = 0; if (ST.src === "sim") for (let i = 0; i < N; i++) { if (ST.mask[i] && !ST.gt[i]) fp++; if (!ST.mask[i] && ST.gt[i]) fn++; }
    $("bFp").textContent = ST.src === "sim" ? fp : "—"; $("bFn").textContent = ST.src === "sim" ? fn : "—";
    $("bUnsure").textContent = Math.round(Array.from(ST.prob).filter((v) => v > 0.3 && v < 0.7).length / N * 100) + "%";
  }
  function renderChart() { const TH = P.TH; P.lineChart($("chart"), [{ data: ST.hist.map((q) => ({ t: q.t, v: q.v })), color: TH.mint, width: 3 }], { min: 0, max: 1, span: 20, now: ST.t, ticks: [0, 0.5, 0.7, 0.85, 1], fmt: (v) => Math.round(v * 100) + "%", thresholds: [{ v: 0.85, label: "tốt", color: TH.mint }] }); }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${k("for")} (${k("let")} i = ${n(0)}; i &lt; ${n(6912)}; i++) { ${c("// mỗi điểm ảnh")}
  ${k("const")} f = [mau(i), viTri(i), quanhDo(i)]; ${c("// 14 số")}
  xacSuat[i] = mangNoRon(f);   ${c("// 0..1: là người?")}
}
${ST.blur ? `xacSuat = lamMo(xacSuat, ${n(ST.blur)}); ${c("// bớt đốm lẻ")}\n` : ""}${k("const")} matNa = xacSuat.map(p =&gt; p &gt;= ${n(ST.th.toFixed(2))});
ve(phongNenAo);
ve(anhCamera, matNa${ST.feather ? `, vienMem = ${n(ST.feather)}` : ""});`;
  }

  // ---------- camera ----------
  let segmenter = null, stream = null, lastVT = -1;
  async function useCam() {
    P.msg($("stageMsg"), "Đang tải mô hình AI phân vùng người (khoảng 0,3 MB)…", "loader");
    try { segmenter = await P.vision("seg"); stream = await P.camera(video); ST.src = "cam"; P.srcButtons("cam"); P.msg($("stageMsg"), null); }
    catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; ST.src = "sim"; P.srcButtons("sim"); }
  function camStep() {
    if (video.readyState < 2) return;
    fctx.save(); fctx.translate(W, 0); fctx.scale(-1, 1); fctx.drawImage(video, 0, 0, W, H); fctx.restore(); smctx.drawImage(full, 0, 0, GW, GH);
    if (!segmenter || video.currentTime === lastVT) return; lastVT = video.currentTime;
    const r = segmenter.segmentForVideo(video, performance.now()), m = r.confidenceMasks && r.confidenceMasks[0]; if (!m) return;
    const a = m.getAsFloat32Array(), mw = m.width, mh = m.height;
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { const sx = Math.floor((1 - (x + 0.5) / GW) * mw), sy = Math.floor((y + 0.5) / GH * mh); ST.prob[y * GW + x] = a[sy * mw + Math.min(mw - 1, sx)]; }
    if (r.close) r.close();
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function markSel(id, key, attr) { $(id).querySelectorAll("button").forEach((b) => { const on = b.dataset[attr] === ST[key]; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    $("bgBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.bg = b.dataset.b; markSel("bgBtns", "bg", "b"); }));
    $("viewBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.view = b.dataset.v; ST.viewsSeen.add(ST.view); if (ST.viewsSeen.size >= 3) prog.done("views"); markSel("viewBtns", "view", "v"); }));
    $("btnNew").onclick = () => (ST.scene = newScene(ST));
    syncs.push(P.range("th", () => ST.th, (v) => (ST.th = v), (v) => v.toFixed(2), () => { genCode(); prog.done("tune"); }));
    syncs.push(P.range("blur", () => ST.blur, (v) => (ST.blur = v), (v) => v, genCode));
    syncs.push(P.range("feather", () => ST.feather, (v) => (ST.feather = v), (v) => v, genCode));
    for (const k of ["dPos", "dLight", "dColor"]) $(k).onchange = (e) => (ST[k] = e.target.checked);
    $("btnRetrain").onclick = () => { train(); prog.done("retrain"); };
    const sync = () => { syncs.forEach((f) => f()); for (const k of ["dPos", "dLight", "dColor"]) $(k).checked = ST[k]; markSel("bgBtns", "bg", "b"); markSel("viewBtns", "view", "v"); genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); if (k === "wall") ST.wallShirt = true; if (k === "side") ST.side = true; if (k === "backlit") ST.backlit = true;
      ST.view = "loi"; if (ST.src !== "sim") useSim(); ST.scene = newScene(ST, P.rng({ wall: 7, side: 4, backlit: 14 }[k])); train(); sync(); prog.done("broke");
      $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); ST.scene = newScene(ST); train(); sync(); };
    sync();
  }

  const QUIZ = [
    { q: "Phân vùng ảnh (segmentation) khác phát hiện vật thể (Dự án 9) ở điểm nào?", o: ["Không khác gì", "Phân vùng trả lời cho TỪNG điểm ảnh là thuộc vật nào, thay vì chỉ vẽ một khung bao", "Phân vùng chỉ dùng cho video", "Phân vùng không cần AI"], a: 1, e: "Khung bao chỉ cho biết vật ở khoảng nào. Phân vùng cho biết đường viền chính xác tới từng điểm ảnh." },
    { q: "Hạ ngưỡng từ 0,5 xuống 0,2 thì mặt nạ người sẽ…", o: ["Nhỏ đi", "To ra: nhiều điểm ảnh \"phân vân\" được tính là người, kể cả một phần nền", "Không đổi", "Biến mất"], a: 1, e: "Ngưỡng thấp thì dễ tính là người hơn: ít bỏ sót nhưng nhiều nhầm lẫn nền thành người." },
    { q: "Mô hình chỉ học từ ảnh người đứng giữa khung hình. Khi em ngồi lệch sang bên, chuyện gì xảy ra?", o: ["Vẫn tách tốt", "Tách kém, vì mô hình đã học đường tắt \"người thường ở giữa\"", "Phông nền tự đổi", "Camera tắt"], a: 1, e: "Đặc trưng vị trí giúp ích khi dữ liệu giống lúc học, nhưng thành bẫy khi tình huống khác đi. Cách sửa là cho máy học từ dữ liệu đa dạng hơn." },
    { q: "Vì sao áo cùng màu với tường làm AI dễ sai?", o: ["Vì AI ghét màu đó", "Vì nếu chỉ nhìn màu của từng điểm ảnh, áo và tường giống hệt nhau; cần thêm thông tin về hình dạng và ngữ cảnh", "Vì camera mờ", "Vì thiếu ánh sáng"], a: 1, e: "Mạng thực tế dùng mạng tích chập (Dự án 14) để \"nhìn\" cả vùng xung quanh, nhận ra hình dáng người chứ không chỉ màu." },
    { q: "Làm mờ phông nền khi học trực tuyến có lợi gì về quyền riêng tư?", o: ["Không có lợi gì", "Che bớt nhà cửa, đồ đạc và người khác phía sau, những thông tin riêng tư không cần chia sẻ", "Làm mạng nhanh hơn", "Làm ảnh nét hơn"], a: 1, e: "Nhưng hãy nhớ nó không hoàn hảo: ở viền hoặc khi AI sai, một phần phông nền vẫn có thể lộ ra." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0, histT = 0, segT = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.src === "sim") { renderScene(null, ST.scene, ST.t); if (now - segT > 66) { segT = now; segment(); postprocess(); } }
    else { camStep(); if (now - segT > 66) { segT = now; postprocess(); } }
    if (ST.iou != null && ST.t - histT > 0.25) { histT = ST.t; ST.hist.push({ t: ST.t, v: ST.iou }); while (ST.hist.length && ST.hist[0].t < ST.t - 21) ST.hist.shift(); }
    renderStage();
    if (soiVisible) renderSoi();
    if (now - slow > 160) { slow = now; renderBrain(); renderChart(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); ST.scene = newScene(ST, P.rng(2)); ST.scene.kind = "phong"; train(); bind(); P.srcButtons("sim");
  window.__hka12 = { TP, ST, newScene, renderScene, segment, postprocess, train };
  requestAnimationFrame(tick);
})();
