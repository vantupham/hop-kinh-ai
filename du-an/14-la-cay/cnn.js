/* Hộp Kính AI · Dự án 14 · Bác sĩ lá cây (lớp tích chập do em thiết kế + gộp + đầu phân loại học được) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, LG = window.LeafGen;
  const prog = P.progress("hka-14");
  const N = 48, NN = N * N, PN = 24, CLS = ["Lá khỏe", "Đốm lá", "Vàng lá"], COL = ["#5ef2d6", "#ff7d5f", "#ffc34d"];
  const CH = { L: "Sáng", X: "Xanh", V: "Vàng-nâu" };
  const PRE = {
    dom: { name: "Đốm nâu", ch: "V", k: [-1, -1, -1, -1, 8, -1, -1, -1, -1] },
    vang: { name: "Vàng úa", ch: "V", k: [0, 0, 0, 0, 1, 0, 0, 0, 0] },
    xanh: { name: "Độ xanh", ch: "X", k: [0, 0, 0, 0, 1, 0, 0, 0, 0] },
    doc: { name: "Cạnh dọc", ch: "L", k: [-1, 0, 1, -2, 0, 2, -1, 0, 1] },
    ngang: { name: "Cạnh ngang", ch: "L", k: [-1, -2, -1, 0, 0, 0, 1, 2, 1] },
    mo: { name: "Làm mờ", ch: "L", k: [1, 1, 1, 1, 1, 1, 1, 1, 1] }
  };
  const PRE_ORDER = ["dom", "vang", "xanh", "doc", "ngang", "mo"];
  const clone = (f) => ({ name: f.name, ch: f.ch, k: f.k.slice() });
  const DEF = { augBg: true, norm: true, dark: false, heat: false, brush: true };
  const ST = { ...DEF, src: "sim", F: PRE_ORDER.map((k) => clone(PRE[k])), sel: 0, leaf: null, model: null, testAcc: 0, accHist: [], conf: null, pred: null, maps: null, heatMap: null, dirty: true, t: 0, painted: 0 };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), video = $("video");
  const mk = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d", { willReadFrequently: true })]; };
  const [leafC, leafX] = mk(LG.S, LG.S), [smC, smX] = mk(N, N), [dsC, dsX] = mk(LG.S, LG.S);

  // ---------- từ ảnh tới đặc trưng ----------
  function rgbOf(canvas) { smX.drawImage(canvas, 0, 0, N, N); const d = smX.getImageData(0, 0, N, N).data, a = new Float32Array(NN * 3); for (let i = 0; i < NN; i++) { a[i * 3] = d[i * 4] / 255; a[i * 3 + 1] = d[i * 4 + 1] / 255; a[i * 3 + 2] = d[i * 4 + 2] / 255; } return a; }
  function channels(rgb) {
    let s = 1; if (ST.norm) { let m = 0; for (let i = 0; i < NN; i++) m = Math.max(m, (rgb[i * 3] + rgb[i * 3 + 1] + rgb[i * 3 + 2]) / 3); const Ls = []; for (let i = 0; i < NN; i += 7) Ls.push((rgb[i * 3] + rgb[i * 3 + 1] + rgb[i * 3 + 2]) / 3); Ls.sort((a, b) => a - b); s = 0.85 / Math.max(0.05, Ls[Math.floor(Ls.length * 0.95)]); }
    const L = new Float32Array(NN), X = new Float32Array(NN), V = new Float32Array(NN);
    for (let i = 0; i < NN; i++) { const r = Math.min(1, rgb[i * 3] * s), g = Math.min(1, rgb[i * 3 + 1] * s), b = Math.min(1, rgb[i * 3 + 2] * s); L[i] = (r + g + b) / 3; X[i] = g - (r + b) / 2; V[i] = r - b; }
    return { L, X, V };
  }
  function conv(ch, k) {
    const o = new Float32Array(NN), sa = k.reduce((s, v) => s + Math.abs(v), 0) || 1;
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { let s = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = Math.min(N - 1, Math.max(0, y + dy)), xx = Math.min(N - 1, Math.max(0, x + dx)); s += k[(dy + 1) * 3 + dx + 1] * ch[yy * N + xx]; } o[y * N + x] = s / sa; }
    return o;
  }
  function pool(a) { const o = new Float32Array(PN * PN); for (let y = 0; y < PN; y++) for (let x = 0; x < PN; x++) { const i = y * 2 * N + x * 2; o[y * PN + x] = Math.max(0, a[i], a[i + 1], a[i + N], a[i + N + 1]); } return o; }
  function forward(rgb, keep) {
    const C = channels(rgb), f = [], maps = [];
    for (const F of ST.F) { const cv = conv(C[F.ch], F.k), pl = pool(cv); let s = 0, m = 0; for (const v of pl) { s += v; if (v > m) m = v; } f.push(s / pl.length * 10, m * 10); if (keep) maps.push({ cv, pl }); }
    return keep ? { f, maps, C } : { f };
  }
  const FNAMES = () => ST.F.flatMap((F) => [F.name + " · TB", F.name + " · max"]);

  // ---------- dữ liệu & huấn luyện ----------
  const cache = {};
  function dataset(kind) {
    const key = kind + (kind === "train" ? ST.augBg : ST.dark);
    if (cache[key]) return cache[key];
    const r = P.rng(kind === "train" ? 11 : 23), n = kind === "train" ? 300 : 150, out = [];
    for (let i = 0; i < n; i++) {
      const cls = i % 3, opt = {};
      if (kind === "train" && !ST.augBg) opt.bg = cls === 0 ? "ban" : "dat";
      if (kind === "test" && ST.dark) opt.light = 0.42 + r() * 0.1;
      const o = LG.sample(cls, r, opt); LG.render(dsX, o); const rgb = rgbOf(dsC); out.push({ rgb, y: cls, o });
      if (kind === "train") { const a = rgb.slice(), px = Math.floor(r() * 37), py = Math.floor(r() * 37); for (let y = py; y < py + 12; y++) for (let x = px; x < px + 12; x++) { const j = (y * N + x) * 3; a[j] = a[j + 1] = a[j + 2] = 0.5; } out.push({ rgb: a, y: cls, o }); }
    }
    return (cache[key] = out);
  }
  function train() {
    const tr = dataset("train"), te = dataset("test"), X = tr.map((s) => forward(s.rgb).f), Y = tr.map((s) => s.y), XT = te.map((s) => forward(s.rgb).f), YT = te.map((s) => s.y);
    const m = P.Softmax(12, 3); m.fitScaler(X); ST.accHist = [];
    for (let e = 0; e < 50; e++) { m.epoch(X, Y, 0.05, 0.001); if (e % 2 === 1) ST.accHist.push({ tr: m.acc(X, Y), te: m.acc(XT, YT) }); }
    ST.model = m; ST.testAcc = m.acc(XT, YT);
    const M = [0, 1, 2].map(() => [0, 0, 0]); XT.forEach((x, i) => M[YT[i]][P.argmax(m.predict(x))]++); ST.conf = M;
    ST.dirty = true; renderTrainUI();
  }
  let trainTimer = 0; const retrain = () => { clearTimeout(trainTimer); $("trainStatus").textContent = "Đang huấn luyện lại…"; trainTimer = setTimeout(train, 60); };

  // ---------- lá hiện tại ----------
  function newLeaf(cls, opt) { const r = Math.random; opt = opt || {}; if (ST.dark && !opt.light) opt.light = 0.45; ST.leaf = LG.sample(cls == null ? Math.floor(r() * 3) : cls, r, opt); LG.render(leafX, ST.leaf); ST.painted = 0; ST.dirty = true; }
  function classify() {
    const rgb = rgbOf(leafC), o = forward(rgb, true), p = ST.model.predict(o.f);
    ST.pred = { p, f: o.f, c: P.argmax(p) }; ST.maps = o.maps; ST.C = o.C; ST.rgb = rgb;
    if (ST.heat) occlusion(rgb, p);
    ST.dirty = false;
  }
  function occlusion(rgb, p0) {
    const c = P.argmax(p0), G = 7, H = new Float32Array(G * G), P2 = 12;
    const margin = (f) => { const l = ST.model.logits(f); return l[c] - Math.max(...l.filter((_, k) => k !== c)); }, m0 = margin(forward(rgb).f);
    for (let gy = 0; gy < G; gy++) for (let gx = 0; gx < G; gx++) {
      const a = rgb.slice(); for (let y = gy * 6; y < gy * 6 + P2 && y < N; y++) for (let x = gx * 6; x < gx * 6 + P2 && x < N; x++) { const i = (y * N + x) * 3; a[i] = a[i + 1] = a[i + 2] = 0.5; }
      H[gy * G + gx] = Math.max(0, m0 - margin(forward(a).f));
    }
    const mx = Math.max(1, ...H), [hc, hx] = mk(G, G), img = hx.createImageData(G, G);
    for (let i = 0; i < G * G; i++) { const v = H[i] / mx; img.data.set([255, 60 + 160 * (1 - v), 40, 220 * v], i * 4); }
    hx.putImageData(img, 0, 0); ST.heatMap = hc; ST.heatMax = mx;
  }

  // ---------- vẽ ----------
  function heatCol(v, mx) { const t = Math.max(-1, Math.min(1, v / (mx || 1))); return t >= 0 ? [255 * t + 18 * (1 - t), 220 * t * t + 22 * (1 - t), 90 * t + 51 * (1 - t)] : [18 - 0 * t, 22 + 120 * -t, 51 + 200 * -t]; }
  function drawMap(ctx, a, w, x0, y0, size, sym) {
    let mx = 0; for (const v of a) mx = Math.max(mx, Math.abs(v)); const [c, cx] = mk(w, w), img = cx.createImageData(w, w);
    for (let i = 0; i < w * w; i++) { const [r, g, b] = heatCol(sym ? a[i] : Math.max(0, a[i]), mx); img.data.set([r, g, b, 255], i * 4); }
    cx.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(c, x0, y0, size, size); ctx.imageSmoothingEnabled = true;
  }
  function chanMap(ctx, a, x0, y0, size, kind) {
    const [c, cx] = mk(N, N), img = cx.createImageData(N, N);
    for (let i = 0; i < NN; i++) { const v = a[i]; const col = kind === "L" ? [v * 255, v * 255, v * 255] : kind === "X" ? [20, 40 + Math.max(0, v) * 600, 30] : [40 + Math.max(0, v) * 400, 30 + Math.max(0, v) * 300, 20]; img.data.set([...col.map((q) => Math.min(255, q)), 255], i * 4); }
    cx.putImageData(img, 0, 0); ctx.imageSmoothingEnabled = false; ctx.drawImage(c, x0, y0, size, size); ctx.imageSmoothingEnabled = true;
  }
  function renderStage() {
    const ctx = sctx, TH = P.TH; D.labBg(ctx);
    ctx.drawImage(leafC, 20, 20, 300, 300);
    if (ST.heat && ST.heatMap) { ctx.globalAlpha = 0.75; ctx.drawImage(ST.heatMap, 20, 20, 300, 300); ctx.globalAlpha = 1; D.pill(ctx, "AI NHÌN VÀO ĐÂY", 170, 36, "rgba(255,93,60,.9)", 11); }
    ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = 2; ctx.strokeRect(20, 20, 300, 300);
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText(ST.src === "cam" ? "CAMERA · GIỮ LÁ Ở GIỮA" : ST.brush ? "CHẠM VÀO LÁ ĐỂ CHẤM BỆNH" : "ẢNH LÁ", 20, 340);
    // 6 bản đồ đặc trưng
    ctx.fillStyle = "#c3c7f0"; ctx.fillText("6 BẢN ĐỒ ĐẶC TRƯNG", 344, 22);
    if (ST.maps) ST.maps.forEach((m, i) => { const x = 344 + (i % 3) * 94, y = 30 + Math.floor(i / 3) * 112; drawMap(ctx, m.pl, PN, x, y, 86, false); ctx.strokeStyle = i === ST.sel ? "#ffc34d" : "rgba(255,255,255,.15)"; ctx.lineWidth = i === ST.sel ? 3 : 1; ctx.strokeRect(x, y, 86, 86); ctx.fillStyle = "#c3c7f0"; ctx.font = "10px Be Vietnam Pro, sans-serif"; ctx.fillText(ST.F[i].name.slice(0, 14), x, y + 100); });
    // mũi tên
    const ph = (ST.t * 0.8) % 1; ctx.fillStyle = "#7c8cff"; for (let i = 0; i < 3; i++) { const x = 322 + ((ph + i / 3) % 1) * 20; ctx.beginPath(); ctx.arc(x, 170, 2.5, 0, 7); ctx.fill(); }
    // chẩn đoán
    if (ST.pred) {
      const { p, c } = ST.pred; ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, 344, 262, 276, 198, 14); ctx.fill();
      ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText("CHẨN ĐOÁN", 360, 286);
      ctx.fillStyle = COL[c]; ctx.font = "800 26px Be Vietnam Pro, sans-serif"; ctx.fillText(CLS[c], 360, 320);
      p.forEach((v, k) => { const y = 344 + k * 34; ctx.fillStyle = "#c3c7f0"; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText(CLS[k], 360, y + 10); ctx.fillStyle = "#232866"; D.rr(ctx, 440, y, 130, 12, 6); ctx.fill(); ctx.fillStyle = COL[k]; D.rr(ctx, 440, y, Math.max(6, 130 * v), 12, 6); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "700 11px JetBrains Mono, monospace"; ctx.fillText(Math.round(v * 100) + "%", 576, y + 10); });
    }
    if (ST.leaf && ST.src === "sim") { ctx.fillStyle = "#8f96d4"; ctx.font = "11px Be Vietnam Pro, sans-serif"; ctx.fillText(`Đáp án thật: ${ST.painted ? "đã bị chấm thêm " + ST.painted + " đốm" : CLS[ST.leaf.cls]} · nền: ${{ ban: "bàn", dat: "đất", "be-tong": "bê tông" }[ST.leaf.bg] || "ảnh"}`, 20, 362); }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh 48×48", e: "image", d: "Ảnh lá được thu nhỏ còn <b>48 × 48</b> điểm ảnh. Mỗi điểm ảnh có 3 số đỏ, lục, lam." },
    { t: "Tách kênh", e: "layers", d: "Ta tách thành 3 <b>kênh</b>: độ sáng, độ xanh (lục trừ đỏ, lam) và độ vàng-nâu (đỏ trừ lam). Chỗ bệnh nổi rõ trên kênh vàng-nâu." },
    { t: "Trượt bộ lọc", e: "scan", d: "Một <b>bộ lọc 3×3</b> trượt qua từng vị trí: nhân 9 ô ảnh với 9 trọng số rồi cộng lại. Đây là phép <b>tích chập</b>. Bộ lọc đang soi là bộ em chọn (ô vàng) ở phần Mồi." },
    { t: "ReLU & gộp", e: "blocks", d: "Bỏ số âm (<b>ReLU</b>), rồi <b>gộp</b>: mỗi ô 2×2 chỉ giữ số lớn nhất. Bản đồ nhỏ đi 4 lần nhưng vẫn giữ chỗ \"sáng\" nhất, và không quan tâm đốm lệch một chút sang trái hay phải." },
    { t: "Tóm tắt đặc trưng", e: "chart", d: "Mỗi bản đồ được tóm tắt thành 2 số: <b>trung bình</b> (cả lá có nhiều không) và <b>lớn nhất</b> (có chỗ nào rất mạnh không). 6 bộ lọc cho 12 đặc trưng." },
    { t: "Phân loại", e: "target", d: "Lớp cuối nhân 12 đặc trưng với trọng số đã học (giống Dự án 6) để ra xác suất 3 bệnh. Cột xanh đẩy về chẩn đoán này, cột đỏ kéo ra xa." }
  ];
  let soiVisible = false, soiStep = 0;
  const pipe = P.pipeline(SOI, (i) => { soiStep = i; if (i >= 2) prog.done("soi"); });
  P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const ctx = octx, s = soiStep; D.labBg(ctx); if (!ST.maps) return;
    const F = ST.F[ST.sel], lab = (t, x, y) => { ctx.fillStyle = "#c3c7f0"; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
    if (s === 0) { rgbOf(leafC); ctx.imageSmoothingEnabled = false; ctx.drawImage(smC, 104, 24, 432, 432); ctx.imageSmoothingEnabled = true; ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.lineWidth = 1; for (let i = 0; i <= N; i += 4) { ctx.beginPath(); ctx.moveTo(104 + i * 9, 24); ctx.lineTo(104 + i * 9, 456); ctx.stroke(); ctx.beginPath(); ctx.moveTo(104, 24 + i * 9); ctx.lineTo(536, 24 + i * 9); ctx.stroke(); } return; }
    if (s === 1) { [["L", "Độ sáng"], ["X", "Độ xanh"], ["V", "Độ vàng-nâu"]].forEach(([k, t], i) => { chanMap(ctx, ST.C[k], 20 + i * 205, 120, 190, k); lab(t, 20 + i * 205, 104); }); return; }
    if (s === 2) {
      const ch = ST.C[F.ch], cs = 6.5, x0 = 16, y0 = 50, pos = Math.floor(ST.t * 60) % NN, py = Math.floor(pos / N), px = pos % N;
      chanMap(ctx, ch, x0, y0, N * cs, F.ch); lab(`Kênh ${CH[F.ch]}`, x0, 40);
      ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2.5; ctx.strokeRect(x0 + (px - 1) * cs, y0 + (py - 1) * cs, 3 * cs, 3 * cs);
      const cv = ST.maps[ST.sel].cv, part = new Float32Array(NN); for (let i = 0; i <= pos; i++) part[i] = cv[i];
      drawMap(ctx, part, N, 340, 50, 280, true); lab(`Kết quả bộ lọc "${F.name}"`, 340, 40); ctx.strokeStyle = "#ffc34d"; ctx.strokeRect(340 + px * (280 / N) - 1, 50 + py * (280 / N) - 1, 280 / N + 2, 280 / N + 2);
      ctx.font = "12px JetBrains Mono, monospace"; let sum = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const yy = Math.min(N - 1, Math.max(0, py + dy)), xx = Math.min(N - 1, Math.max(0, px + dx)), v = ch[yy * N + xx], w = F.k[(dy + 1) * 3 + dx + 1]; sum += v * w; const X = 30 + (dx + 1) * 108, Y = 386 + (dy + 1) * 26; ctx.fillStyle = w > 0 ? "#5ef2d6" : w < 0 ? "#ff7d5f" : "#6b72a8"; ctx.fillText(`${v.toFixed(2)}×${w}`, X, Y); }
      ctx.fillStyle = "#fff"; ctx.font = "700 14px JetBrains Mono, monospace"; ctx.fillText(`= ${sum.toFixed(2)} → chia ${F.k.reduce((a, b) => a + Math.abs(b), 0) || 1} → ${cv[pos].toFixed(3)}`, 360, 412);
      return;
    }
    if (s === 3) { const cv = ST.maps[ST.sel].cv, rl = cv.map((v) => Math.max(0, v)); drawMap(ctx, cv, N, 16, 90, 190, true); lab("Sau tích chập (có số âm)", 16, 76); drawMap(ctx, rl, N, 222, 90, 190, false); lab("Sau ReLU", 222, 76); drawMap(ctx, ST.maps[ST.sel].pl, PN, 428, 90, 190, false); lab("Sau gộp 2×2 (24×24)", 428, 76); D.arrow(ctx, { x: 208, y: 185 }, { x: 220, y: 185 }, "#7c8cff", 3); D.arrow(ctx, { x: 414, y: 185 }, { x: 426, y: 185 }, "#7c8cff", 3); ctx.fillStyle = "#8f96d4"; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText("Đỏ: số dương · Xanh lam: số âm · Đen: 0", 16, 320); ctx.fillText(`${NN.toLocaleString("vi-VN")} số → ${(PN * PN).toLocaleString("vi-VN")} số`, 428, 320); return; }
    if (s === 4) { const f = ST.pred.f, mx = Math.max(...f, 0.01), nm = FNAMES(); f.forEach((v, i) => { const y = 30 + i * 35; ctx.fillStyle = "#c3c7f0"; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText(nm[i], 20, y + 14); ctx.fillStyle = "#232866"; ctx.fillRect(220, y + 2, 340, 16); ctx.fillStyle = i % 2 ? "#ffc34d" : "#7c8cff"; ctx.fillRect(220, y + 2, (v / mx) * 340, 16); ctx.fillStyle = "#fff"; ctx.font = "11px JetBrains Mono, monospace"; ctx.fillText(v.toFixed(2), 568, y + 15); }); return; }
    const m = ST.model, c = ST.pred.c, z = ST.pred.f.map((v, j) => (v - m.mu[j]) / m.sd[j]), con = z.map((v, j) => v * m.W[c][j]), mx = Math.max(...con.map(Math.abs), 0.01), nm = FNAMES();
    lab(`Vì sao máy nói "${CLS[c]}"?`, 20, 24);
    con.forEach((v, i) => { const y = 40 + i * 33; ctx.fillStyle = "#c3c7f0"; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText(nm[i], 20, y + 14); ctx.fillStyle = v >= 0 ? "#5ef2d6" : "#ff7d5f"; const w = (Math.abs(v) / mx) * 170; ctx.fillRect(v >= 0 ? 390 : 390 - w, y + 2, w, 16); });
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.beginPath(); ctx.moveTo(390, 36); ctx.lineTo(390, 440); ctx.stroke();
    ST.pred.p.forEach((v, k) => D.pill(ctx, `${CLS[k]} ${Math.round(v * 100)}%`, 110 + k * 200, 456, COL[k] + (k === c ? "" : "66"), 12));
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), F = ST.F[ST.sel]; if (!ST.pred) return;
    if (s === 0) el.innerHTML = `48 × 48 × 3 = <span class="hl">6.912</span> con số vào mạng`;
    else if (s === 1) el.innerHTML = `3 kênh × 2.304 điểm · chuẩn hóa độ sáng: <span class="w">${ST.norm ? "bật" : "tắt"}</span>`;
    else if (s === 2) el.innerHTML = `Bộ lọc <span class="hl">${F.name}</span> trên kênh <span class="w">${CH[F.ch]}</span>\n[${F.k.slice(0, 3).join(", ")}]\n[${F.k.slice(3, 6).join(", ")}]\n[${F.k.slice(6).join(", ")}]`;
    else if (s === 3) el.innerHTML = `Gộp 2×2 lấy số lớn nhất: 2.304 → <span class="hl">576</span> số mỗi bản đồ`;
    else if (s === 4) el.innerHTML = `6 bộ lọc × 2 = <span class="hl">12</span> đặc trưng\nTrọng số của em: <span class="w">54</span> · trọng số máy học: <span class="w">39</span>`;
    else el.innerHTML = `Chẩn đoán: <span class="hl">${CLS[ST.pred.c]}</span> (${Math.round(ST.pred.p[ST.pred.c] * 100)}%)`;
  }

  // ---------- Tự làm ----------
  function buildFilterUI() {
    $("filters").innerHTML = ST.F.map((F, i) => `<div class="flt" data-f="${i}"><div class="flt-h"><b>${i + 1}</b><select data-p="${i}" aria-label="Bộ lọc mẫu">${PRE_ORDER.map((k) => `<option value="${k}">${PRE[k].name}</option>`).join("")}<option value="tu-che">Tự chế</option></select></div><div class="btn-row chs">${Object.keys(CH).map((c) => `<button class="btn small ghost" data-ch="${c}" data-fi="${i}">${CH[c]}</button>`).join("")}</div><div class="kgrid">${F.k.map((v, j) => `<input type="number" step="1" min="-9" max="9" value="${v}" data-k="${j}" data-fi="${i}" aria-label="Trọng số ${j + 1}">`).join("")}</div><canvas width="96" height="96" data-m="${i}"></canvas></div>`).join("");
    $("filters").querySelectorAll("select").forEach((s) => (s.onchange = () => { const i = +s.dataset.p; if (s.value !== "tu-che") ST.F[i] = clone(PRE[s.value]); ST.sel = i; syncFilterUI(); retrain(); prog.done("filter"); }));
    $("filters").querySelectorAll("[data-ch]").forEach((b) => (b.onclick = () => { const i = +b.dataset.fi; ST.F[i].ch = b.dataset.ch; ST.F[i].name = "Tự chế " + (i + 1); ST.sel = i; syncFilterUI(); retrain(); prog.done("filter"); }));
    $("filters").querySelectorAll("input").forEach((inp) => (inp.onchange = () => { const i = +inp.dataset.fi; ST.F[i].k[+inp.dataset.k] = Math.max(-9, Math.min(9, Math.round(+inp.value || 0))); ST.F[i].name = "Tự chế " + (i + 1); ST.sel = i; syncFilterUI(); retrain(); prog.done("filter"); }));
    $("filters").querySelectorAll(".flt").forEach((d) => d.addEventListener("click", () => { ST.sel = +d.dataset.f; syncFilterUI(); }));
    syncFilterUI();
  }
  function syncFilterUI() {
    ST.F.forEach((F, i) => {
      const d = $("filters").querySelector(`[data-f="${i}"]`); d.classList.toggle("on", i === ST.sel);
      const pk = PRE_ORDER.find((k) => PRE[k].name === F.name); d.querySelector("select").value = pk || "tu-che";
      d.querySelectorAll("[data-ch]").forEach((b) => b.classList.toggle("ghost", b.dataset.ch !== F.ch));
      d.querySelectorAll("input").forEach((inp) => { inp.value = F.k[+inp.dataset.k]; inp.className = F.k[+inp.dataset.k] > 0 ? "pos" : F.k[+inp.dataset.k] < 0 ? "neg" : ""; });
    });
    genCode();
  }
  function renderFilterMaps() { if (!ST.maps) return; $("filters").querySelectorAll("canvas").forEach((c) => { const i = +c.dataset.m, x = c.getContext("2d"); x.fillStyle = "#121633"; x.fillRect(0, 0, 96, 96); drawMap(x, ST.maps[i].pl, PN, 0, 0, 96, false); }); }
  function renderTrainUI() {
    $("trainStatus").innerHTML = `Độ chính xác trên 150 lá kiểm tra: <b style="color:${ST.testAcc > 0.85 ? "#5ef2d6" : ST.testAcc > 0.6 ? "#ffc34d" : "#ff7d5f"}">${Math.round(ST.testAcc * 100)}%</b>`;
    $("bTest").textContent = Math.round(ST.testAcc * 100) + "%";
    $("confOut").innerHTML = P.confusion(CLS, COL, ST.conf);
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, L = 46, B = 26, T = 12, TH = P.TH; ctx.clearRect(0, 0, W, H); ctx.font = "11px JetBrains Mono, monospace";
    const X = (i) => L + (i / Math.max(1, ST.accHist.length - 1)) * (W - L - 14), Y = (v) => T + (1 - v) * (H - T - B);
    [0, 0.33, 0.5, 0.75, 1].forEach((v) => { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - 14, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(v * 100) + "%", 4, Y(v) + 4); });
    ctx.fillStyle = TH.text; ctx.fillText("vòng học 1", L, H - 6); ctx.fillText("50", W - 34, H - 6);
    [["tr", TH.violet, 2], ["te", TH.mint, 3]].forEach(([k, c, w]) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ST.accHist.forEach((a, i) => (i ? ctx.lineTo(X(i), Y(a[k])) : ctx.moveTo(X(i), Y(a[k])))); ctx.stroke(); });
    ctx.setLineDash([5, 5]); ctx.strokeStyle = TH.coral; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Y(1 / 3)); ctx.lineTo(W - 14, Y(1 / 3)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.coral; ctx.fillText("đoán bừa", W - 90, Y(1 / 3) - 5);
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`, F = ST.F[ST.sel];
    $("genCode").innerHTML =
`${k("const")} boLoc = [[${F.k.slice(0, 3).map(n).join(", ")}],   ${c(`// "${F.name}"`)}
              [${F.k.slice(3, 6).map(n).join(", ")}],
              [${F.k.slice(6).map(n).join(", ")}]];
${k("for")} (y ${k("of")} hang) ${k("for")} (x ${k("of")} cot) {
  ${k("let")} s = ${n(0)};
  ${k("for")} (dy ${k("of")} [-${n(1)}, ${n(0)}, ${n(1)}]) ${k("for")} (dx ${k("of")} [-${n(1)}, ${n(0)}, ${n(1)}])
    s += boLoc[dy+${n(1)}][dx+${n(1)}] * kenh${F.ch}[y+dy][x+dx];
  banDo[y][x] = Math.max(${n(0)}, s);     ${c("// ReLU")}
}
${k("const")} gon = gopMax(banDo, ${n(2)});   ${c("// 48×48 → 24×24")}`;
  }

  // ---------- camera ----------
  let stream = null;
  async function useCam() {
    P.msg($("stageMsg"), "Đang bật camera…", "loader");
    try { stream = await P.camera(video); ST.src = "cam"; P.srcButtons("cam"); P.msg($("stageMsg"), "Đưa một chiếc lá vào giữa khung hình, nền trơn. Mô hình chỉ học từ ảnh vẽ nên có thể đoán sai ảnh thật: đó cũng là một bài học!", "bulb", 7000); }
    catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; if (ST.src !== "sim") { ST.src = "sim"; newLeaf(); } P.srcButtons("sim"); }

  // ---------- điều khiển ----------
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    $("clsBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { if (ST.src !== "sim") useSim(); newLeaf(b.dataset.c === "r" ? null : +b.dataset.c); }));
    $("btnHeat").onclick = () => { ST.heat = !ST.heat; ST.dirty = true; $("btnHeat").classList.toggle("ghost", !ST.heat); $("btnHeat").setAttribute("aria-pressed", ST.heat); if (ST.heat) prog.done("heat"); };
    $("fileIn").onchange = (e) => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { useSim(); const S = LG.S, s = Math.max(S / im.width, S / im.height); leafX.drawImage(im, (S - im.width * s) / 2, (S - im.height * s) / 2, im.width * s, im.height * s); ST.leaf = { cls: -1, bg: "anh" }; ST.painted = 0; ST.dirty = true; URL.revokeObjectURL(im.src); }; im.src = URL.createObjectURL(f); };
    let down = false;
    const paint = (e) => { if (ST.src !== "sim") return; const r = stage.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 640, y = ((e.clientY - r.top) / r.height) * 480; if (x >= 20 && x <= 320 && y >= 20 && y <= 320) { const lx = ((x - 20) / 300) * LG.S, ly = ((y - 20) / 300) * LG.S; LG.spot(leafX, lx, ly, 2.4); ST.painted++; ST.dirty = true; if (ST.painted >= 3) prog.done("paint"); } else { for (let i = 0; i < 6; i++) { const xx = 344 + (i % 3) * 94, yy = 30 + Math.floor(i / 3) * 112; if (x >= xx && x <= xx + 86 && y >= yy && y <= yy + 86) { ST.sel = i; syncFilterUI(); } } } };
    let lastP = 0; stage.addEventListener("pointerdown", (e) => { down = true; stage.setPointerCapture(e.pointerId); paint(e); lastP = performance.now(); });
    stage.addEventListener("pointermove", (e) => { if (down && performance.now() - lastP > 70) { lastP = performance.now(); paint(e); } }); stage.addEventListener("pointerup", () => (down = false));
    for (const k of ["augBg", "norm"]) $(k).onchange = (e) => { ST[k] = e.target.checked; retrain(); };
    $("btnPreset").onclick = () => { ST.F = PRE_ORDER.map((k) => clone(PRE[k])); syncFilterUI(); retrain(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); ST.F = PRE_ORDER.map((q) => clone(PRE[q])); useSim();
      if (k === "shortcut") ST.augBg = false; if (k === "blind") ST.F = ST.F.map((F, i) => ({ name: "Tự chế " + (i + 1), ch: "L", k: [1, 1, 1, 1, 1, 1, 1, 1, 1] })); if (k === "dark") { ST.norm = false; ST.dark = true; }
      sync(); train(); newLeaf(k === "shortcut" ? 0 : k === "dark" ? 2 : 1, k === "shortcut" ? { bg: "dat" } : null); ST.heat = k === "shortcut"; $("btnHeat").classList.toggle("ghost", !ST.heat);
      prog.done("broke"); $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); ST.F = PRE_ORDER.map((q) => clone(PRE[q])); sync(); train(); newLeaf(1); $("btnHeat").classList.add("ghost"); };
    const sync = () => { $("augBg").checked = ST.augBg; $("norm").checked = ST.norm; syncFilterUI(); };
    sync();
  }

  const QUIZ = [
    { q: "Một bộ lọc 3×3 trong lớp tích chập làm gì?", o: ["Cắt ảnh thành 9 mảnh", "Trượt qua từng vị trí, nhân 9 ô ảnh với 9 trọng số rồi cộng lại, để tìm một mẫu nhỏ như đốm hay cạnh", "Đổi ảnh màu thành đen trắng", "Đếm số điểm ảnh"], a: 1, e: "Cùng một bộ lọc dùng cho mọi vị trí, nên đốm ở góc nào của lá cũng được phát hiện." },
    { q: "Bước gộp (max pooling) 2×2 có tác dụng gì?", o: ["Phóng to ảnh", "Giảm kích thước bản đồ mà vẫn giữ tín hiệu mạnh nhất, và chịu được việc vật lệch đi một chút", "Thêm màu", "Xóa đốm bệnh"], a: 1, e: "Bản đồ nhỏ đi 4 lần, tính toán nhẹ hơn, và đốm lệch 1 điểm ảnh vẫn cho kết quả gần như cũ." },
    { q: "Lá khỏe đặt trên nền đất bị chẩn đoán là bệnh, và bản đồ \"AI nhìn vào đâu\" sáng ở phần đất. Chuyện gì đã xảy ra?", o: ["Đất bị bệnh", "Trong dữ liệu học, lá bệnh luôn chụp trên nền đất nên máy học đường tắt \"nền đất = bệnh\"", "Bộ lọc bị hỏng", "Ảnh quá to"], a: 1, e: "Đây là lỗi đường tắt rất hay gặp ngoài đời. Cách sửa: trộn phông nền trong dữ liệu học, và luôn kiểm tra máy đang nhìn vào đâu." },
    { q: "Trong mạng tích chập thật (như các ứng dụng nhận diện bệnh cây), ai chọn các con số trong bộ lọc?", o: ["Kỹ sư gõ tay từng số", "Máy tự học các số đó bằng lan truyền ngược, giống trọng số ở Dự án 11", "Chọn ngẫu nhiên và giữ nguyên", "Người nông dân"], a: 1, e: "Ở dự án này em tự thiết kế bộ lọc để hiểu chúng làm gì. Mạng thật có hàng trăm bộ lọc, xếp nhiều lớp, và học hết từ dữ liệu." },
    { q: "Ảnh chụp lúc trời tối làm máy chẩn đoán sai. Bật \"chuẩn hóa độ sáng\" giúp được vì…", o: ["Làm ảnh nét hơn", "Đưa mọi ảnh về cùng mức sáng trước khi tính, nên màu vàng-nâu không bị \"chìm\" khi tối", "Làm máy học nhanh hơn", "Xóa phông nền"], a: 1, e: "Tiền xử lý dữ liệu (chuẩn hóa) giúp mô hình bớt phụ thuộc vào điều kiện chụp." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0, clsT = 0, tuVisible = false; P.visible($("tu-lam"), (v) => (tuVisible = v));
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.src === "cam" && video.readyState >= 2) { const s = Math.min(video.videoWidth, video.videoHeight); leafX.drawImage(video, (video.videoWidth - s) / 2, (video.videoHeight - s) / 2, s, s, 0, 0, LG.S, LG.S); if (now - clsT > 250) { clsT = now; ST.dirty = true; } }
    if (ST.dirty && ST.model) classify();
    renderStage();
    if (soiVisible) renderSoi();
    if (now - slow > 200) { slow = now; if (soiVisible) soiLive(); if (tuVisible) renderFilterMaps(); }
    requestAnimationFrame(tick);
  }
  P.nav(); buildFilterUI(); bind(); train(); newLeaf(1); P.srcButtons("sim");
  requestAnimationFrame(tick);
})();
