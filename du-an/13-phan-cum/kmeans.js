/* Hộp Kính AI · Dự án 13 · Bảng màu thông minh (K-means trong khối màu RGB) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-13");
  const IW = 320, IH = 240, NPIX = IW * IH, NS = 3000, NSHOW = 1300;
  const DEF = { img: "vuon-hoa", K: 5, init: "random", speed: 450, seed: 1 };
  const ST = { ...DEF, C: [], hist: [], assign: null, iter: 0, done: false, running: true, split: 0.5, yaw: -0.7, pitch: 0.42, dragging: false, ks: new Set(), elbow: [], colorBy: "that" };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d");
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d", { willReadFrequently: true })]; };
  const [srcC, srcX] = mk(IW, IH), [qC, qX] = mk(IW, IH);
  let PIXD = null, SAMP = null, SHOW = null;

  // ---------- ảnh mẫu (vẽ bằng code) ----------
  const IMGS = {
    "vuon-hoa"(c) {
      const r = P.rng(3), g = c.createLinearGradient(0, 0, 0, 90); g.addColorStop(0, "#7cc4f5"); g.addColorStop(1, "#d3efff"); c.fillStyle = g; c.fillRect(0, 0, IW, 90);
      c.fillStyle = "#6fae5a"; c.beginPath(); c.moveTo(0, 100); for (let x = 0; x <= IW; x += 20) c.lineTo(x, 78 + Math.sin(x / 40) * 12); c.lineTo(IW, 110); c.lineTo(0, 110); c.fill();
      c.fillStyle = "#3f8f3a"; c.fillRect(0, 100, IW, 140); for (let i = 0; i < 500; i++) { c.fillStyle = r() < 0.5 ? "#2f7a2e" : "#56a648"; c.fillRect(r() * IW, 100 + r() * 140, 2, 5 + r() * 6); }
      const F = ["#e23a4a", "#ffd23f", "#f5f5f5", "#8a4fd8"];
      for (let i = 0; i < 46; i++) { const x = r() * IW, y = 115 + r() * 120, s = 5 + (y - 110) / 16, col = F[i % 4]; c.fillStyle = col; for (let p = 0; p < 5; p++) { const a = (p / 5) * 6.283; c.beginPath(); c.arc(x + Math.cos(a) * s * 0.7, y + Math.sin(a) * s * 0.7, s * 0.55, 0, 7); c.fill(); } c.fillStyle = "#f7a51b"; c.beginPath(); c.arc(x, y, s * 0.35, 0, 7); c.fill(); }
    },
    "hoang-hon"(c) {
      const g = c.createLinearGradient(0, 0, 0, 140); g.addColorStop(0, "#2b1b5a"); g.addColorStop(0.55, "#d9475b"); g.addColorStop(1, "#ffb347"); c.fillStyle = g; c.fillRect(0, 0, IW, 140);
      c.fillStyle = "#ffe08a"; c.beginPath(); c.arc(214, 132, 28, 0, 7); c.fill();
      const s = c.createLinearGradient(0, 140, 0, 240); s.addColorStop(0, "#22306a"); s.addColorStop(1, "#0b1230"); c.fillStyle = s; c.fillRect(0, 140, IW, 100);
      c.fillStyle = "rgba(255,200,110,.75)"; for (let i = 0; i < 9; i++) c.fillRect(214 - 30 + (i % 2) * 8, 146 + i * 9, 60 - i * 5, 3);
      c.fillStyle = "#120a1c"; c.beginPath(); c.moveTo(60, 176); c.lineTo(130, 176); c.lineTo(118, 190); c.lineTo(72, 190); c.fill(); c.fillRect(94, 130, 3, 46); c.beginPath(); c.moveTo(97, 132); c.lineTo(124, 170); c.lineTo(97, 170); c.fill();
    },
    "den-long"(c) {
      const g = c.createLinearGradient(0, 0, 0, IH); g.addColorStop(0, "#0e1030"); g.addColorStop(1, "#24163f"); c.fillStyle = g; c.fillRect(0, 0, IW, IH);
      c.fillStyle = "#4a2e1f"; c.fillRect(0, 180, IW, 60); c.fillStyle = "#3a2216"; for (let x = 0; x < IW; x += 26) c.fillRect(x, 180, 4, 60);
      c.fillStyle = "#e8c35a"; c.fillRect(0, 176, IW, 5);
      const L = [[40, 60, "#e0322f"], [100, 40, "#ffb52e"], [160, 70, "#e0322f"], [220, 44, "#2fa36b"], [280, 64, "#ffb52e"], [70, 120, "#ffb52e"], [130, 130, "#e0322f"], [200, 120, "#8a4fd8"], [260, 132, "#e0322f"]];
      c.strokeStyle = "#555"; c.lineWidth = 1; c.beginPath(); c.moveTo(0, 20); c.quadraticCurveTo(160, 50, IW, 18); c.stroke();
      for (const [x, y, col] of L) { const rg = c.createRadialGradient(x, y, 4, x, y, 44); rg.addColorStop(0, col + "88"); rg.addColorStop(1, col + "00"); c.fillStyle = rg; c.fillRect(x - 44, y - 44, 88, 88); c.fillStyle = col; c.beginPath(); c.ellipse(x, y, 17, 22, 0, 0, 7); c.fill(); c.fillStyle = "#ffe9a8"; c.beginPath(); c.ellipse(x - 4, y - 4, 5, 9, 0, 0, 7); c.fill(); c.fillStyle = "#3a2216"; c.fillRect(x - 8, y - 25, 16, 5); c.fillRect(x - 8, y + 20, 16, 5); }
    },
    "cau-vong"(c) {
      for (let x = 0; x < IW; x++) { const g = c.createLinearGradient(0, 0, 0, IH), h = (x / IW) * 330; g.addColorStop(0, `hsl(${h},90%,78%)`); g.addColorStop(0.5, `hsl(${h},90%,52%)`); g.addColorStop(1, `hsl(${h},80%,26%)`); c.fillStyle = g; c.fillRect(x, 0, 1, IH); }
    }
  };
  const IMG_NAME = { "vuon-hoa": "vườn hoa", "hoang-hon": "hoàng hôn", "den-long": "đèn lồng", "cau-vong": "dải màu mượt", "upload": "ảnh của em" };
  function loadImage(name, imgEl) {
    ST.img = name; srcX.clearRect(0, 0, IW, IH);
    if (imgEl) { const s = Math.max(IW / imgEl.width, IH / imgEl.height); srcX.drawImage(imgEl, (IW - imgEl.width * s) / 2, (IH - imgEl.height * s) / 2, imgEl.width * s, imgEl.height * s); }
    else IMGS[name](srcX);
    PIXD = srcX.getImageData(0, 0, IW, IH).data;
    const r = P.rng(7); SAMP = new Float32Array(NS * 3);
    for (let i = 0; i < NS; i++) { const j = Math.floor(r() * NPIX) * 4; SAMP[i * 3] = PIXD[j]; SAMP[i * 3 + 1] = PIXD[j + 1]; SAMP[i * 3 + 2] = PIXD[j + 2]; }
    SHOW = Array.from({ length: NSHOW }, (_, i) => i);
    computeElbow(); restart();
  }

  // ---------- K-means ----------
  const d2 = (a, ai, c) => { const x = a[ai] - c[0], y = a[ai + 1] - c[1], z = a[ai + 2] - c[2]; return x * x + y * y + z * z; };
  function nearest(a, ai, C) { let b = 0, bd = Infinity; for (let k = 0; k < C.length; k++) { const d = d2(a, ai, C[k]); if (d < bd) { bd = d; b = k; } } return [b, bd]; }
  function initC(K, method, rnd) {
    if (method === "bad") return Array.from({ length: K }, () => [4 + rnd() * 18, 4 + rnd() * 18, 4 + rnd() * 18]);
    if (method === "random") return Array.from({ length: K }, () => { const i = Math.floor(rnd() * NS) * 3; return [SAMP[i], SAMP[i + 1], SAMP[i + 2]]; });
    const C = [], i0 = Math.floor(rnd() * NS) * 3; C.push([SAMP[i0], SAMP[i0 + 1], SAMP[i0 + 2]]);
    const dd = new Float32Array(NS);
    while (C.length < K) { let s = 0; for (let i = 0; i < NS; i++) { dd[i] = nearest(SAMP, i * 3, C)[1]; s += dd[i]; } let t = rnd() * s, j = 0; while (j < NS - 1 && (t -= dd[j]) > 0) j++; C.push([SAMP[j * 3], SAMP[j * 3 + 1], SAMP[j * 3 + 2]]); }
    return C;
  }
  function assignAll(C, out) { let s = 0, ch = 0; for (let i = 0; i < NS; i++) { const [b, d] = nearest(SAMP, i * 3, C); if (out[i] !== b) ch++; out[i] = b; s += d; } return { inertia: s / NS, changed: ch }; }
  function update(C, A) { const S = C.map(() => [0, 0, 0, 0]); for (let i = 0; i < NS; i++) { const s = S[A[i]]; s[0] += SAMP[i * 3]; s[1] += SAMP[i * 3 + 1]; s[2] += SAMP[i * 3 + 2]; s[3]++; } return C.map((c, k) => (S[k][3] ? [S[k][0] / S[k][3], S[k][1] / S[k][3], S[k][2] / S[k][3]] : c.slice())); }
  function runFull(K, method, seed, maxIt) { const r = P.rng(seed), A = new Int32Array(NS).fill(-1); let C = initC(K, method, r), res; for (let it = 0; it < (maxIt || 40); it++) { res = assignAll(C, A); if (!res.changed) break; C = update(C, A); } return { C, inertia: assignAll(C, A).inertia }; }
  function counts(A, K) { const n = new Array(K).fill(0); for (let i = 0; i < NS; i++) n[A[i]]++; return n; }

  function restart() {
    const r = P.rng(ST.seed * 97 + ST.K);
    ST.C = initC(ST.K, ST.init, r); ST.assign = new Int32Array(NS).fill(-1);
    const a = assignAll(ST.C, ST.assign);
    ST.hist = [{ C: ST.C.map((c) => c.slice()), inertia: a.inertia, changed: NS }]; ST.iter = 0; ST.done = false; ST.running = true; ST.lastStep = performance.now();
    ST.ks.add(ST.K); if (ST.ks.size >= 3) prog.done("k");
    paintQuant(); genCode();
  }
  function step() {
    if (ST.done) return;
    const C = update(ST.C, ST.assign), a = assignAll(C, ST.assign);
    ST.C = C; ST.iter++; ST.hist.push({ C: C.map((c) => c.slice()), inertia: a.inertia, changed: a.changed });
    if (!a.changed || ST.iter >= 40) { ST.done = true; ST.running = false; prog.done("run"); }
    paintQuant();
  }
  function paintQuant() {
    const img = qX.createImageData(IW, IH), d = img.data, C = ST.C;
    for (let p = 0; p < NPIX; p++) { const k = nearest(PIXD, p * 4, C)[0]; d[p * 4] = C[k][0]; d[p * 4 + 1] = C[k][1]; d[p * 4 + 2] = C[k][2]; d[p * 4 + 3] = 255; }
    qX.putImageData(img, 0, 0);
  }
  function computeElbow() { ST.elbow = []; for (let k = 1; k <= 10; k++) ST.elbow.push(runFull(k, "kpp", 3, 25).inertia); let best = 2, bv = -1; for (let k = 2; k <= 9; k++) { const v = ST.elbow[k - 2] - 2 * ST.elbow[k - 1] + ST.elbow[k]; if (v > bv) { bv = v; best = k; } } ST.elbowK = best; }

  // ---------- vẽ ----------
  const hex = (c) => "#" + c.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("");
  const rgb = (c) => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  function renderStage() {
    const ctx = sctx, sx = Math.round(ST.split * 640);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(srcC, 0, 0, 640, 480);
    ctx.save(); ctx.beginPath(); ctx.rect(sx, 0, 640 - sx, 480); ctx.clip(); ctx.drawImage(qC, 0, 0, 640, 480); ctx.restore();
    ctx.fillStyle = "#fff"; ctx.fillRect(sx - 1.5, 0, 3, 440); ctx.beginPath(); ctx.arc(sx, 220, 16, 0, 7); ctx.fill(); ctx.fillStyle = "#5443ff"; ctx.beginPath(); ctx.moveTo(sx - 4, 213); ctx.lineTo(sx - 10, 220); ctx.lineTo(sx - 4, 227); ctx.moveTo(sx + 4, 213); ctx.lineTo(sx + 10, 220); ctx.lineTo(sx + 4, 227); ctx.fill();
    if (sx > 90) D.pill(ctx, "ẢNH GỐC", 60, 64, "rgba(10,12,38,.8)", 11);
    if (sx < 560) D.pill(ctx, `${ST.K} MÀU`, 590, 64, "rgba(84,67,255,.9)", 11);
    // dải bảng màu
    const n = counts(ST.assign, ST.K), order = n.map((v, k) => k).sort((a, b) => n[b] - n[a]); let x = 0;
    ctx.fillStyle = "rgba(10,12,38,.85)"; ctx.fillRect(0, 440, 640, 40);
    for (const k of order) { if (!n[k]) continue; const w = (n[k] / NS) * 632; ctx.fillStyle = rgb(ST.C[k]); ctx.fillRect(4 + x, 446, Math.max(1, w - 2), 28); x += w; }
  }
  // khối màu RGB 3D
  function proj(c, cx, cy, S) {
    const x = c[0] / 255 - 0.5, y = c[1] / 255 - 0.5, z = c[2] / 255 - 0.5, cyw = Math.cos(ST.yaw), syw = Math.sin(ST.yaw), cp = Math.cos(ST.pitch), sp = Math.sin(ST.pitch);
    const x1 = x * cyw - z * syw, z1 = x * syw + z * cyw, y2 = y * cp - z1 * sp, z2 = y * sp + z1 * cp, f = 2.4 / (2.4 + z2);
    return { x: cx + x1 * S * f, y: cy - y2 * S * f, z: z2, f };
  }
  const KC = ["#ff5d5d", "#ffc34d", "#5ef2d6", "#7c8cff", "#ff8fd0", "#9be15d", "#ff9a3c", "#58c4ff", "#c58bff", "#ffffff", "#ff6f91", "#00d1a0", "#ffd166", "#8ecae6", "#bdb2ff", "#f4a261"];
  function cube(ctx, o) {
    const W = ctx.canvas.width, H = ctx.canvas.height, cx = o.cx || W / 2, cy = o.cy || H / 2 + 10, S = o.S || Math.min(W, H) * 0.5;
    const V = [0, 255].flatMap((r) => [0, 255].flatMap((g) => [0, 255].map((b) => [r, g, b])));
    ctx.lineWidth = 1.2; ctx.strokeStyle = "rgba(180,190,255,.35)";
    for (let i = 0; i < 8; i++) for (let j = i + 1; j < 8; j++) { const dd = V[i].reduce((s, v, t) => s + (v !== V[j][t]), 0); if (dd === 1) { const a = proj(V[i], cx, cy, S), b = proj(V[j], cx, cy, S); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); } }
    for (const v of V) { const p = proj(v, cx, cy, S); ctx.fillStyle = rgb(v); ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 7); ctx.fill(); }
    ctx.font = "700 12px JetBrains Mono, monospace";
    [[[255, 0, 0], "R (đỏ)", "#ff7d7d"], [[0, 255, 0], "G (lục)", "#7dff9a"], [[0, 0, 255], "B (lam)", "#8fa2ff"]].forEach(([v, t, col]) => { const p = proj(v, cx, cy, S); ctx.fillStyle = col; ctx.fillText(t, p.x + 8, p.y - 6); });
    const pts = SHOW.map((i) => ({ i, p: proj([SAMP[i * 3], SAMP[i * 3 + 1], SAMP[i * 3 + 2]], cx, cy, S) })).sort((a, b) => b.p.z - a.p.z);
    const A = o.assign;
    for (const { i, p } of pts) {
      const s = 4 * p.f;
      ctx.fillStyle = A && o.by === "cum" ? KC[A[i] % KC.length] : `rgb(${SAMP[i * 3]},${SAMP[i * 3 + 1]},${SAMP[i * 3 + 2]})`;
      if (A && o.lines && i % 4 === 0) { const q = proj(o.C[A[i]], cx, cy, S); ctx.strokeStyle = KC[A[i] % KC.length] + "55"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    if (o.trail) for (let k = 0; k < ST.K; k++) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); o.trail.forEach((h, t) => { const q = proj(h.C[k], cx, cy, S); t ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); }); ctx.stroke(); ctx.setLineDash([]); }
    if (o.from) o.C.forEach((c, k) => { const a = proj(o.from[k], cx, cy, S), b = proj(c, cx, cy, S); if (Math.hypot(a.x - b.x, a.y - b.y) > 6) D.arrow(ctx, a, b, "#fff", 2.5); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(a.x, a.y, 6, 0, 7); ctx.stroke(); });
    if (o.C) o.C.forEach((c, k) => { const p = proj(c, cx, cy, S); ctx.fillStyle = rgb(c); ctx.strokeStyle = o.by === "cum" ? KC[k % KC.length] : "#fff"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(p.x, p.y, 11, 0, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = "#0b0d26"; ctx.beginPath(); ctx.arc(p.x, p.y, 2.5, 0, 7); ctx.fill(); });
  }
  function dragRotate(cv) {
    let last = null;
    cv.addEventListener("pointerdown", (e) => { last = [e.clientX, e.clientY]; cv.setPointerCapture(e.pointerId); ST.userRot = true; });
    cv.addEventListener("pointermove", (e) => { if (!last) return; ST.yaw += (e.clientX - last[0]) * 0.01; ST.pitch = Math.max(-1.2, Math.min(1.2, ST.pitch + (e.clientY - last[1]) * 0.01)); last = [e.clientX, e.clientY]; });
    cv.addEventListener("pointerup", () => (last = null));
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Điểm ảnh → điểm màu", e: "image", d: "Mỗi điểm ảnh có 3 số <b>đỏ, lục, lam</b> (0–255). Ta coi 3 số đó là <b>tọa độ</b> và đặt điểm ảnh vào một <b>khối lập phương màu</b>. Màu giống nhau thì nằm gần nhau. <i>Kéo hình để xoay khối.</i>" },
    { t: "Chọn K tâm", e: "target", d: "Máy rải <b>K tâm cụm</b> (vòng tròn lớn) vào khối màu. Ở đây dùng cách <b>{init}</b>. Chưa ai nói cho máy biết ảnh có những màu nào: đây là <b>học không giám sát</b>." },
    { t: "Gán về tâm gần nhất", e: "crosshair", d: "Mỗi điểm màu tìm <b>tâm gần nhất</b> và nhận tâm đó làm \"đội trưởng\". Các nét mảnh nối điểm với tâm của nó. Khối màu được chia thành K vùng." },
    { t: "Dời tâm về giữa đội", e: "arrowR", d: "Mỗi tâm <b>dời tới trung bình</b> của các điểm trong đội mình (mũi tên). Tâm nào không có điểm nào thì đứng yên tại chỗ." },
    { t: "Lặp tới khi đứng yên", e: "repeat", d: "Lặp lại gán rồi dời. Đường đứt nét là <b>hành trình</b> của từng tâm. Khi không còn điểm nào đổi đội, thuật toán <b>hội tụ</b>." },
    { t: "Tô lại ảnh", e: "sparkle", d: "Mỗi điểm ảnh được tô bằng màu của tâm cụm của nó. Ảnh chỉ còn K màu: đó là <b>bảng màu thông minh</b> của bức ảnh." }
  ];
  let soiVisible = false, soiStep = 0;
  const pipe = P.pipeline(SOI.map((s) => ({ ...s, d: s.d })), (i) => { soiStep = i; if (i >= 3) prog.done("soi"); $("soiText").innerHTML = "<p>" + SOI[i].d.replace("{init}", { random: "chọn ngẫu nhiên K điểm ảnh", kpp: "K-means++ (tâm sau ở xa các tâm trước)", bad: "dồn hết vào góc đen" }[ST.init]) + "</p>"; });
  P.visible($("soi"), (v) => (soiVisible = v)); dragRotate(soi);
  let A0 = null;
  function renderSoi() {
    const ctx = octx, s = soiStep; D.labBg(ctx);
    if (s === 5) { ctx.drawImage(srcC, 20, 70, 290, 218); ctx.drawImage(qC, 330, 70, 290, 218); ctx.fillStyle = "#fff"; ctx.font = "700 13px Be Vietnam Pro, sans-serif"; ctx.fillText("Ảnh gốc: hàng chục nghìn màu", 20, 56); ctx.fillText(`Sau K-means: ${ST.K} màu`, 330, 56); ST.C.forEach((c, k) => { ctx.fillStyle = rgb(c); D.rr(ctx, 20 + k * (600 / ST.K), 320, 600 / ST.K - 6, 60, 8); ctx.fill(); ctx.fillStyle = "#c3c7f0"; ctx.font = "11px JetBrains Mono, monospace"; ctx.fillText(hex(c), 26 + k * (600 / ST.K), 398); }); return; }
    const h0 = ST.hist[0], h1 = ST.hist[1] || ST.hist[0];
    if (s >= 2 && (!A0 || A0.key !== ST.hist[0])) { A0 = new Int32Array(NS); assignAll(h0.C, A0); A0.key = ST.hist[0]; }
    if (s === 0) cube(ctx, {});
    else if (s === 1) cube(ctx, { C: h0.C });
    else if (s === 2) cube(ctx, { C: h0.C, assign: A0, by: "cum", lines: true });
    else if (s === 3) cube(ctx, { C: h1.C, from: h0.C, assign: A0, by: "cum" });
    else if (s === 4) { cube(ctx, { C: ST.C, assign: ST.assign, by: "cum", trail: ST.hist, cx: 250 }); miniConv(ctx, 470, 300, 150, 140); }
  }
  function miniConv(ctx, x, y, w, h) {
    ctx.fillStyle = "rgba(10,12,38,.8)"; D.rr(ctx, x - 8, y - 22, w + 16, h + 30, 10); ctx.fill(); ctx.fillStyle = "#c3c7f0"; ctx.font = "10px JetBrains Mono, monospace"; ctx.fillText("SAI LỆCH THEO VÒNG", x, y - 8);
    const H = ST.hist, mx = H[0].inertia || 1, n = Math.max(H.length, 8), bw = w / n; H.forEach((q, i) => { const bh = (q.inertia / mx) * (h - 10); ctx.fillStyle = i === H.length - 1 ? "#5ef2d6" : "#7c8cff"; ctx.fillRect(x + i * bw, y + h - bh, bw - 2, bh); });
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), H = ST.hist;
    if (s === 0) el.innerHTML = `Ảnh ${IW}×${IH} = <span class="w">${NPIX.toLocaleString("vi-VN")}</span> điểm ảnh · máy học trên <span class="hl">${NS.toLocaleString("vi-VN")}</span> điểm lấy mẫu\nĐang vẽ ${NSHOW.toLocaleString("vi-VN")} điểm trong khối màu`;
    else if (s === 1) el.innerHTML = `K = <span class="hl">${ST.K}</span>\n` + H[0].C.map((c, k) => `tâm ${k + 1}: (${c.map((v) => Math.round(v)).join(", ")})`).slice(0, 5).join("\n");
    else if (s === 2) { const n = counts(A0, ST.K); el.innerHTML = `Số điểm mỗi đội lúc đầu:\n<span class="w">${n.join(" · ")}</span>${n.includes(0) ? `\n<span class="hl">Có ${n.filter((v) => !v).length} tâm không có điểm nào!</span>` : ""}`; }
    else if (s === 3) { const mv = H[0].C.map((c, k) => Math.hypot(...c.map((v, t) => v - (H[1] || H[0]).C[k][t]))); el.innerHTML = `Quãng đường mỗi tâm vừa dời:\n<span class="w">${mv.map((v) => Math.round(v)).join(" · ")}</span>`; }
    else if (s === 4) el.innerHTML = `Vòng lặp: <span class="hl">${ST.iter}</span> ${ST.done ? "· <span class=\"w\">đã hội tụ</span>" : "· đang chạy"}\nĐiểm đổi đội ở vòng cuối: <span class="w">${H[H.length - 1].changed}</span>`;
    else el.innerHTML = `Mỗi điểm ảnh: <span class="w">24 bit</span> → <span class="hl">${Math.max(1, Math.ceil(Math.log2(ST.K)))} bit</span> + một bảng ${ST.K} màu`;
  }

  // ---------- bảng não, biểu đồ, code ----------
  function renderBrain() {
    $("bIter").textContent = ST.iter + (ST.done ? " · xong" : ""); $("bErr").textContent = Math.round(Math.sqrt(ST.hist[ST.hist.length - 1].inertia));
    const n = counts(ST.assign, ST.K), empty = n.filter((v) => !v).length; $("bEmpty").textContent = empty; $("bEmpty").style.color = empty ? "#ff7d5f" : "";
    $("bBits").textContent = `24 → ${Math.max(1, Math.ceil(Math.log2(ST.K)))}`;
    const order = n.map((v, k) => k).sort((a, b) => n[b] - n[a]);
    $("bPal").innerHTML = order.map((k) => `<div class="sw"><i style="background:${rgb(ST.C[k])}"></i><span>${hex(ST.C[k])}</span><b>${Math.round((n[k] / NS) * 100)}%</b></div>`).join("");
    $("bStatus").textContent = ST.done ? "Đã hội tụ: không điểm nào đổi đội nữa." : ST.running ? "Đang lặp: gán → dời tâm…" : "Đang tạm dừng. Bấm Bước tiếp hoặc Chạy.";
    $("btnRun").innerHTML = HKA.icon(ST.running ? "pause" : "play") + (ST.running ? "Tạm dừng" : "Chạy");
  }
  function chartAxes(ctx, W, H, L, B, T) { ctx.clearRect(0, 0, W, H); const TH = P.TH; ctx.strokeStyle = TH.grid; ctx.lineWidth = 1; for (let i = 0; i <= 4; i++) { const y = T + (i / 4) * (H - T - B); ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - 10, y); ctx.stroke(); } ctx.fillStyle = TH.text; ctx.font = "11px JetBrains Mono, monospace"; }
  function renderCharts() {
    const TH = P.TH;
    { const cv = $("chartConv"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, L = 40, B = 26, T = 14; chartAxes(ctx, W, H, L, B, T);
      const Hs = ST.hist, mx = Hs[0].inertia || 1, n = Math.max(12, Hs.length), bw = (W - L - 10) / n;
      Hs.forEach((q, i) => { const bh = (q.inertia / mx) * (H - T - B); ctx.fillStyle = i === Hs.length - 1 ? TH.mint : TH.violet; ctx.fillRect(L + i * bw + 2, H - B - bh, bw - 4, bh); if (n <= 20 || i % 2 === 0) { ctx.fillStyle = TH.text; ctx.fillText(i, L + i * bw + bw / 2 - 4, H - 8); } });
      ctx.fillStyle = TH.text; ctx.fillText("100%", 2, T + 4); ctx.fillText("0", 26, H - B + 4); }
    { const cv = $("chartElbow"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, L = 40, B = 26, T = 14; chartAxes(ctx, W, H, L, B, T);
      const E = ST.elbow, mx = E[0] || 1, X = (k) => L + ((k - 1) / 9) * (W - L - 30), Y = (v) => T + (1 - v / mx) * (H - T - B);
      ctx.strokeStyle = TH.violet; ctx.lineWidth = 3; ctx.beginPath(); E.forEach((v, i) => (i ? ctx.lineTo(X(i + 1), Y(v)) : ctx.moveTo(X(1), Y(v)))); ctx.stroke();
      E.forEach((v, i) => { const k = i + 1; ctx.fillStyle = k === ST.K ? TH.coral : TH.violet; ctx.beginPath(); ctx.arc(X(k), Y(v), k === ST.K ? 8 : 5, 0, 7); ctx.fill(); ctx.fillStyle = TH.text; ctx.fillText("K=" + k, X(k) - 12, H - 8); });
      if (ST.img !== "cau-vong") { const k = ST.elbowK; ctx.strokeStyle = TH.mint; ctx.lineWidth = 2; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.arc(X(k), Y(E[k - 1]), 15, 0, 7); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.mint; ctx.fillText("khuỷu tay?", X(k) + 18, Y(E[k - 1]) - 10); }
      else { ctx.fillStyle = TH.coral; ctx.fillText("không có khuỷu rõ ràng", W - 210, T + 14); } }
    const ctx = $("cube").getContext("2d"); ctx.fillStyle = "#121633"; ctx.fillRect(0, 0, 560, 420); cube(ctx, { C: ST.C, assign: ST.assign, by: ST.colorBy === "cum" ? "cum" : "that", S: 220 });
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${k("let")} tam = ${{ random: `chonNgauNhien(diemAnh, ${n(ST.K)})`, kpp: `kMeansPlusPlus(diemAnh, ${n(ST.K)})`, bad: `goc(${n(0)}, ${n(0)}, ${n(0)}, ${n(ST.K)})` }[ST.init]};
${k("while")} (${k("true")}) {
  ${c("// 1. gán: mỗi điểm về tâm gần nhất")}
  ${k("const")} doi = diemAnh.map(p =&gt; ganNhat(p, tam));
  ${c("// 2. dời: tâm = trung bình của đội")}
  ${k("const")} moi = tam.map((t, k) =&gt; trungBinh(diemAnh, doi, k) ?? t);
  ${k("if")} (giongNhau(moi, tam)) ${k("break")};  ${c("// hội tụ")}
  tam = moi;
}`;
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function markSel(id, key, attr) { $(id).querySelectorAll("button").forEach((b) => { const on = String(b.dataset[attr]) === String(ST[key]); b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  function bind() {
    let drag = false; const setSplit = (e) => { const r = stage.getBoundingClientRect(); ST.split = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)); };
    stage.addEventListener("pointerdown", (e) => { drag = true; stage.setPointerCapture(e.pointerId); setSplit(e); }); stage.addEventListener("pointermove", (e) => drag && setSplit(e)); stage.addEventListener("pointerup", () => (drag = false));
    $("imgBtns").querySelectorAll("button[data-m]").forEach((b) => (b.onclick = () => { loadImage(b.dataset.m); markSel("imgBtns", "img", "m"); }));
    $("fileIn").onchange = (e) => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { loadImage("upload", im); markSel("imgBtns", "img", "m"); prog.done("upload"); URL.revokeObjectURL(im.src); }; im.src = URL.createObjectURL(f); };
    $("btnRun").onclick = () => { if (ST.done) restart(); else ST.running = !ST.running; };
    $("btnStep").onclick = () => { ST.running = false; if (ST.done) restart(); else step(); };
    $("btnSeed").onclick = () => { ST.seed++; restart(); };
    $("initBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.init = b.dataset.n; markSel("initBtns", "init", "n"); restart(); }));
    $("colorBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.colorBy = b.dataset.c; markSel("colorBtns", "colorBy", "c"); }));
    syncs.push(P.range("K", () => ST.K, (v) => (ST.K = v), (v) => v, () => { restart(); markSel("kBtns", "K", "k"); }));
    $("kBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.K = +b.dataset.k; syncs.forEach((f) => f()); markSel("kBtns", "K", "k"); restart(); }));
    syncs.push(P.range("speed", () => ST.speed, (v) => (ST.speed = v), (v) => (v / 1000).toFixed(2).replace(".", ",") + " s"));
    dragRotate($("cube"));
    const sync = () => { syncs.forEach((f) => f()); markSel("imgBtns", "img", "m"); markSel("initBtns", "init", "n"); markSel("kBtns", "K", "k"); markSel("colorBtns", "colorBy", "c"); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); if (k === "few") { ST.K = 2; } if (k === "init") { ST.img = "den-long"; ST.K = 8; ST.init = "bad"; } if (k === "smooth") { ST.img = "cau-vong"; ST.K = 6; }
      ST.split = 0.5; loadImage(ST.img); sync(); prog.done("broke"); $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); loadImage(ST.img); sync(); };
    sync();
  }

  const QUIZ = [
    { q: "K-means được gọi là học không giám sát vì…", o: ["Không cần máy tính", "Không ai dán nhãn cho dữ liệu; máy tự tìm ra các nhóm", "Không có ai theo dõi khi máy chạy", "Chỉ chạy được một lần"], a: 1, e: "Ở Dự án 2, 6, 11 ta đều cho máy đáp án (nhãn). Ở đây máy chỉ có các điểm màu và tự chia nhóm." },
    { q: "Ở bước \"dời tâm\", mỗi tâm cụm được dời tới đâu?", o: ["Tới góc của khối màu", "Tới trung bình (điểm giữa) của các điểm trong đội của nó", "Tới điểm xa nhất", "Tới một chỗ ngẫu nhiên"], a: 1, e: "Trung bình là điểm làm tổng khoảng cách bình phương tới các thành viên nhỏ nhất, nên mỗi vòng sai lệch chỉ có thể giảm." },
    { q: "Rải tất cả tâm vào cùng một góc đen thì chuyện gì có thể xảy ra?", o: ["Kết quả luôn tốt nhất", "Nhiều tâm không giành được điểm nào và đứng yên mãi, ảnh chỉ còn ít màu", "Thuật toán chạy nhanh hơn và đẹp hơn", "Ảnh chuyển sang đen trắng"], a: 1, e: "K-means chỉ tìm được lời giải gần điểm xuất phát. K-means++ chọn tâm xuất phát trải đều để tránh điều này." },
    { q: "Biểu đồ \"khuỷu tay\" giúp em làm gì?", o: ["Chọn K hợp lý: chỗ mà tăng thêm K không còn giảm sai lệch nhiều", "Đo tốc độ máy tính", "Đổi màu ảnh", "Đếm điểm ảnh"], a: 0, e: "Tăng K luôn làm sai lệch giảm, nhưng tới một lúc giảm rất ít. Chỗ \"gãy\" đó thường là số nhóm tự nhiên của dữ liệu." },
    { q: "Chạy K-means với K = 6 trên dải màu mượt, không có nhóm rõ ràng nào. Kết quả là…", o: ["Báo lỗi và dừng", "Vẫn chia đúng 6 nhóm, dù các nhóm đó do máy \"cắt\" ra chứ không có sẵn", "Tự chọn K = 1", "Ảnh không đổi"], a: 1, e: "K-means luôn trả về K nhóm. Việc của con người là kiểm tra xem các nhóm đó có ý nghĩa thật không." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let slow = 0, tuVisible = false; P.visible($("tu-lam"), (v) => (tuVisible = v));
  function tick(now) {
    if (ST.running && now - ST.lastStep > ST.speed) { ST.lastStep = now; step(); }
    if (!ST.userRot) ST.yaw += 0.003;
    renderStage();
    if (soiVisible) renderSoi();
    if (now - slow > 120) { slow = now; renderBrain(); if (tuVisible) renderCharts(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); loadImage(ST.img); bind(); renderCharts();
  requestAnimationFrame(tick);
})();
