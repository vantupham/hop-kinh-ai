/* Hộp Kính AI · Dự án 06 · Thùng rác thông minh (train/test, học chuyển giao, quá khớp, học vẹt phông nền) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, T = TrashSim;
  const prog = P.progress("hka-06");
  const NC = 4, CLS = T.CLS, COL = T.COL;
  const DEF = { nTrain: 20, mode: "feat", lr: 0.05, epochs: 50, bias: false, skew: false, pin: false, unsure: false, unsureTh: 0.6 };
  const ST = { src: "sim", ...DEF, train: [], test: [], model: null, hist: [], ep: 0, training: false, seed: 7, conv: null, stats: [0, 0], lastPred: null, wrongTest: new Set(), own: [] };
  const c32 = document.createElement("canvas"); c32.width = c32.height = 32; const x32 = c32.getContext("2d", { willReadFrequently: true });
  const c12 = document.createElement("canvas"); c12.width = c12.height = 12; const x12 = c12.getContext("2d", { willReadFrequently: true });
  const big = document.createElement("canvas"); big.width = big.height = 200; const xb = big.getContext("2d");
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), video = $("video");

  // ---------- mã hóa một ảnh thành đặc trưng ----------
  function encodeFrom(drawFn) {
    drawFn(x32, 32); const fe = T.features(x32.getImageData(0, 0, 32, 32));
    drawFn(x12, 12); const px = T.pixels(x12.getImageData(0, 0, 12, 12));
    return { f: fe.f, mask: fe.mask, px };
  }
  function encode(item) { return Object.assign({ item, y: item.cls }, encodeFrom((ctx, S) => T.draw(ctx, S, item))); }
  const X = (d) => (ST.mode === "feat" ? d.f : d.px);

  // ---------- dữ liệu ----------
  function buildData() {
    const rnd = P.rng(ST.seed), rt = P.rng(ST.seed + 999);
    ST.train = []; ST.test = [];
    for (let c = 0; c < NC; c++) {
      const n = ST.skew ? [40, 12, 3, 30][c] : ST.nTrain;
      for (let i = 0; i < n; i++) ST.train.push(encode(T.sample(c, rnd, { bias: ST.bias })));
      for (let i = 0; i < 15; i++) ST.test.push(encode(T.sample(c, rt)));
    }
    ST.train.push(...ST.own);
    renderGallery();
  }
  function startTraining() {
    const tr = ST.train; if (!tr.length) return;
    ST.model = P.Softmax(X(tr[0]).length, NC); ST.model.fitScaler(tr.map(X));
    ST.hist = []; ST.ep = 0; ST.training = true; record();
  }
  function record() {
    const m = ST.model, Xtr = ST.train.map(X), Ytr = ST.train.map((d) => d.y), Xte = ST.test.map(X), Yte = ST.test.map((d) => d.y);
    ST.hist.push({ ep: ST.ep, lossTr: m.loss(Xtr, Ytr), lossTe: m.loss(Xte, Yte), accTr: m.acc(Xtr, Ytr), accTe: m.acc(Xte, Yte) });
    const h = ST.hist[ST.hist.length - 1];
    if (h.accTr - h.accTe > 0.25 && ST.ep > 10) prog.done("gap");
  }
  function trainStep() {
    if (!ST.training) return;
    const per = ST.mode === "px" ? 2 : 3;
    for (let k = 0; k < per && ST.ep < ST.epochs; k++) { ST.model.epoch(ST.train.map(X), ST.train.map((d) => d.y), ST.lr); ST.ep++; record(); }
    if (ST.ep >= ST.epochs) { ST.training = false; afterTrain(); }
  }
  function afterTrain() {
    ST.wrongTest = new Set(); const M = Array.from({ length: NC }, () => new Array(NC).fill(0));
    ST.test.forEach((d, i) => { const p = P.argmax(ST.model.predict(X(d))); M[d.y][p]++; if (p !== d.y) ST.wrongTest.add(i); });
    $("confOut").innerHTML = P.confusion(CLS.slice(0, NC), COL, M);
    renderGallery(); renderWeights(); genCode();
  }
  function predict(d) {
    if (!ST.model) return { p: [0.25, 0.25, 0.25, 0.25], k: 0, unsure: true };
    const p = ST.model.predict(X(d)), k = P.argmax(p);
    return { p, k, unsure: ST.unsure && p[k] < ST.unsureTh };
  }

  // ---------- băng chuyền phân loại ----------
  const crnd = P.rng(12345);
  function newItem() {
    const cls = ST.pin && crnd() < 0.3 ? 4 : Math.floor(crnd() * NC);
    const it = T.sample(cls, crnd), d = encode(it);
    const r = predict(d);
    ST.conv = { d, it, r, t: 0, bin: r.unsure ? NC : r.k };
  }
  function binX(i) { const n = ST.unsure ? 5 : 4, w = 600 / n; return 20 + i * w + w / 2; }
  function renderStage(dt) {
    const ctx = sctx; D.room(ctx, P.TH.dark);
    const n = ST.unsure ? 5 : 4, w = 600 / n;
    for (let i = 0; i < n; i++) {
      const x = 20 + i * w, col = i < NC ? COL[i] : "#ffc34d";
      ctx.fillStyle = "rgba(10,12,38,.55)"; D.rr(ctx, x + 6, 372, w - 12, 96, 12); ctx.fill();
      ctx.strokeStyle = col; ctx.lineWidth = 3; D.rr(ctx, x + 6, 372, w - 12, 96, 12); ctx.stroke();
      ctx.fillStyle = col; ctx.fillRect(x + 6, 372, w - 12, 10);
      ctx.fillStyle = "#fff"; ctx.font = "700 14px Be Vietnam Pro, sans-serif"; ctx.textAlign = "center"; ctx.fillText(i < NC ? CLS[i] : "Hỏi người lớn", x + w / 2, 446); ctx.textAlign = "left";
    }
    if (ST.src !== "sim") {
      if (video.readyState >= 2) { const vw = video.videoWidth, vh = video.videoHeight, s = Math.min(vw, vh); ctx.save(); ctx.translate(420, 30); ctx.scale(-1, 1); ctx.drawImage(video, (vw - s) / 2, (vh - s) / 2, s, s, 0, 0, 200, 200); ctx.restore(); }
      ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.strokeRect(220, 30, 200, 200);
      if (ST.lastPred) D.pill(ctx, `${ST.lastPred.unsure ? "Không chắc" : CLS[ST.lastPred.k]} · ${Math.round(Math.max(...ST.lastPred.p) * 100)}%`, 320, 260, ST.lastPred.unsure ? "#8a5a00" : "#1c2048", 15);
      return;
    }
    const c = ST.conv; if (!c) return;
    c.t += dt;
    T.draw(xb, 200, c.it);
    const fall = Math.max(0, Math.min(1, (c.t - 1.1) / 0.6)), e = fall * fall;
    if (fall <= 0) {
      ctx.fillStyle = "rgba(10,12,38,.4)"; D.rr(ctx, 210, 20, 220, 220, 16); ctx.fill();
      ctx.drawImage(big, 220, 30, 200, 200); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.strokeRect(220, 30, 200, 200);
      const pr = c.r; D.pill(ctx, `${pr.unsure ? "Không chắc" : CLS[pr.k]} · ${Math.round(pr.p[pr.k] * 100)}%`, 320, 262, pr.unsure ? "#8a5a00" : "#1c2048", 15);
    } else {
      const s = 200 - 130 * e, x = 320 + (binX(c.bin) - 320) * e - s / 2, y = 30 + (330 - 30) * e;
      ctx.drawImage(big, x, y, s, s);
    }
    if (c.t > 1.75) {
      const ok = c.it.cls === 4 ? c.bin === NC : c.bin === c.it.cls;
      if (!c.counted) { c.counted = true; ST.stats[1]++; if (ok) ST.stats[0]++; }
      D.pill(ctx, ok ? "ĐÚNG" : `SAI · thật ra là ${CLS[c.it.cls]}`, binX(c.bin), 350, ok ? "#0b7d71" : "#c2402a", 13);
    }
    if (c.t > 2.6) newItem();
  }

  // ---------- thư viện ảnh, trọng số, biểu đồ ----------
  function thumb(d, cls) { const cv = document.createElement("canvas"); cv.width = cv.height = 48; T.draw(cv.getContext("2d"), 48, d.item); if (cls) cv.className = cls; cv.title = CLS[d.y]; return cv; }
  function renderGallery() {
    for (const [id, arr, test] of [["galTrain", ST.train, false], ["galTest", ST.test, true]]) {
      const el = $(id); el.innerHTML = "";
      arr.forEach((d, i) => { if (!d.item) return; el.appendChild(thumb(d, test ? (ST.wrongTest.has(i) ? "test wrong" : "test") : "")); });
    }
    $("dataInfo").innerHTML = CLS.slice(0, NC).map((c, k) => `<span class="chip" style="background:${COL[k]}26;color:var(--text)"><span class="cls-dot" style="background:${COL[k]}"></span>${c}: ${ST.train.filter((d) => d.y === k).length}</span>`).join("");
  }
  function renderWeights() {
    const cv = $("weights"), ctx = cv.getContext("2d"), m = ST.model; ctx.clearRect(0, 0, cv.width, cv.height); if (!m) return;
    const TH = P.TH; ctx.font = "600 12px Be Vietnam Pro, sans-serif";
    if (ST.mode === "px") {
      // mỗi lớp: 12×12 ảnh trọng số (đỏ = ủng hộ, xanh = phản đối)
      for (let k = 0; k < NC; k++) {
        const w = m.W[k], mx = Math.max(...w.map(Math.abs)) || 1, x0 = 20 + k * 160;
        for (let i = 0; i < 144; i++) { const v = (w[i * 3] + w[i * 3 + 1] + w[i * 3 + 2]) / 3 / mx; ctx.fillStyle = v > 0 ? `rgba(255,125,95,${Math.min(1, v * 2.2)})` : `rgba(84,140,255,${Math.min(1, -v * 2.2)})`; ctx.fillRect(x0 + (i % 12) * 11, 30 + Math.floor(i / 12) * 11, 11, 11); }
        ctx.fillStyle = TH.ink; ctx.fillText(CLS[k], x0, 20);
      }
      ctx.fillStyle = TH.text; ctx.fillText("Mỗi ô là trọng số của một điểm ảnh. Lộn xộn = máy đang học vẹt từng điểm ảnh.", 20, 182);
      return;
    }
    const nf = m.nIn, cw = 20, x0 = 96, y0 = 20, rh = 30;
    let mx = 0; m.W.forEach((w) => w.forEach((v) => (mx = Math.max(mx, Math.abs(v))))); mx = mx || 1;
    for (let k = 0; k < NC; k++) {
      ctx.fillStyle = COL[k]; ctx.fillText(CLS[k], 8, y0 + k * rh + 20);
      for (let j = 0; j < nf; j++) { const v = m.W[k][j] / mx; ctx.fillStyle = v > 0 ? `rgba(255,125,95,${Math.abs(v)})` : `rgba(84,140,255,${Math.abs(v)})`; ctx.fillRect(x0 + j * cw, y0 + k * rh, cw - 2, rh - 2); }
    }
    ctx.save(); ctx.fillStyle = TH.text; ctx.font = "11px Be Vietnam Pro, sans-serif";
    T.NAMES.forEach((n, j) => { ctx.save(); ctx.translate(x0 + j * cw + 14, y0 + NC * rh + 6); ctx.rotate(Math.PI / 3); ctx.fillText(n, 0, 0); ctx.restore(); });
    ctx.restore();
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, L = 46, R = 14, Tp = 14, B = 28, TH = P.TH;
    ctx.clearRect(0, 0, W, H);
    const E = Math.max(ST.epochs, 1), X = (e) => L + e / E * (W - L - R), Y = (v) => Tp + (1 - v) * (H - Tp - B);
    ctx.font = "11px JetBrains Mono, monospace";
    for (const v of [0, 0.25, 0.5, 0.75, 1]) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(v * 100) + "%", 6, Y(v) + 4); }
    ctx.fillText("vòng 0", L, H - 8); ctx.fillText("vòng " + E, W - R - 60, H - 8);
    const h = ST.hist, maxL = Math.max(1, ...h.map((q) => Math.max(q.lossTr, q.lossTe)));
    const line = (key, col, w, dash, sc) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); h.forEach((q, i) => { const v = sc ? q[key] / maxL : q[key]; i ? ctx.lineTo(X(q.ep), Y(v)) : ctx.moveTo(X(q.ep), Y(v)); }); ctx.stroke(); ctx.setLineDash([]); };
    line("lossTr", TH.violet, 1.5, [5, 4], true); line("lossTe", TH.mint, 1.5, [5, 4], true);
    line("accTr", TH.violet, 3); line("accTe", TH.mint, 3);
    const last = h[h.length - 1];
    if (last) { ctx.font = "700 13px JetBrains Mono"; ctx.fillStyle = TH.violet; ctx.fillText(`học: ${Math.round(last.accTr * 100)}%`, W - 200, 30); ctx.fillStyle = TH.mint; ctx.fillText(`kiểm tra: ${Math.round(last.accTe * 100)}%`, W - 200, 50); }
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${c(ST.mode === "feat" ? "// 1. Bộ trích xuất đặc trưng ĐÃ CÓ SẴN (không cần học) → 28 con số" : "// 1. Dùng thẳng 12×12×3 = 432 điểm ảnh, không có bộ trích xuất")}
${k("const")} X = anhHoc.map(anh => ${ST.mode === "feat" ? "trichDacTrung(anh)" : "diemAnh(anh)"});
${c("// 2. Chỉ huấn luyện LỚP CUỐI: " + NC + " lớp × " + (ST.mode === "feat" ? 28 : 432) + " trọng số")}
${k("for")} (${k("let")} vong = ${n(0)}; vong &lt; ${n(ST.epochs)}; vong++) {
  ${k("for")} (${k("const")} [x, nhan] ${k("of")} tronNgauNhien(X, Y)) {
    ${k("const")} p = softmax(W · x + b);          ${c("// xác suất 4 loại")}
    ${k("for")} (${k("let")} loai = ${n(0)}; loai &lt; ${n(NC)}; loai++) {
      ${k("const")} sai = p[loai] - (loai === nhan ? ${n(1)} : ${n(0)});
      W[loai] -= ${n(ST.lr)} * sai * x;              ${c("// tốc độ học = " + ST.lr)}
    }
  }
}`;
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh chụp", e: "image", d: "Ảnh được thu nhỏ còn <b>32 × 32 điểm ảnh</b>. Với máy, đó là 32 × 32 × 3 = 3.072 con số màu." },
    { t: "Tách vật", e: "scan", d: "Bộ trích xuất đoán màu nền từ <b>viền ảnh</b>, rồi đánh dấu những điểm khác hẳn màu nền là \"vật\". Trắng = vật, đen = nền." },
    { t: "Trích đặc trưng", e: "layers", d: "Từ ảnh, ta tính <b>28 đặc trưng</b>: màu nào nhiều, sáng hay tối, có điểm lóa kim loại không, cạnh nhiều không, vật dài hay tròn, và màu riêng của vật. Phần này <b>đã có sẵn</b>, giống phần đầu của một mạng đã học từ trước." },
    { t: "Nhân trọng số", e: "sliders", d: "Lớp cuối có một bộ <b>trọng số</b> cho mỗi loại rác. Mỗi đặc trưng nhân với trọng số rồi cộng lại thành một <b>điểm</b>. Đây là phần duy nhất được huấn luyện." },
    { t: "Softmax", e: "chart", d: "Biến các điểm thành <b>xác suất</b> có tổng bằng 100%: lấy e mũ từng điểm, rồi chia cho tổng." },
    { t: "Chọn thùng", e: "checkCircle", d: "Chọn loại có xác suất cao nhất. Nếu bật \"hỏi lại khi không chắc\" mà xác suất cao nhất vẫn thấp, máy sẽ nhờ người lớn quyết định." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 2) prog.done("see"); });
  P.visible($("soi"), (v) => (soiVisible = v));
  function cur() { return ST.conv ? ST.conv.d : ST.test[0]; }
  function renderSoi() {
    const s = pipe.get(), ctx = octx, d = cur(); D.labBg(ctx); if (!d) return;
    if (s === 0) {
      x32.clearRect(0, 0, 32, 32); T.draw(x32, 32, d.item); ctx.imageSmoothingEnabled = false; ctx.drawImage(c32, 64, 64, 352, 352); ctx.imageSmoothingEnabled = true;
      ctx.strokeStyle = "rgba(0,0,0,.25)"; for (let i = 0; i <= 32; i++) { ctx.beginPath(); ctx.moveTo(64 + i * 11, 64); ctx.lineTo(64 + i * 11, 416); ctx.moveTo(64, 64 + i * 11); ctx.lineTo(416, 64 + i * 11); ctx.stroke(); }
      const px = x32.getImageData(16, 16, 1, 1).data; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.strokeRect(64 + 16 * 11, 64 + 16 * 11, 11, 11);
      D.pill(ctx, `R=${px[0]} G=${px[1]} B=${px[2]}`, 530, 240, "#8a5a00", 14);
    } else if (s === 1) {
      const m = d.mask; for (let i = 0; i < 1024; i++) { ctx.fillStyle = m[i] ? "#f0f2ff" : "#0b0d26"; ctx.fillRect(64 + (i % 32) * 11, 64 + Math.floor(i / 32) * 11, 10, 10); }
      ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.setLineDash([6, 5]); ctx.strokeRect(60, 60, 360, 360); ctx.setLineDash([]);
      D.pill(ctx, "viền = mẫu màu nền", 530, 80, "#8a5a00", 13); D.pill(ctx, `vật chiếm ${Math.round(d.f[19] / 3 * 100)}% ảnh`, 530, 240, "#0b7d71", 13);
    } else if (s === 2) {
      const f = d.f, bw = 19, x0 = 30, base = 380;
      T.GROUPS.forEach(([a, b, name], g) => { ctx.fillStyle = "#8f96d4"; ctx.font = "700 11px Be Vietnam Pro"; ctx.fillText(name, x0 + a * bw + g * 8, 60 + (g % 2) * 16); });
      f.forEach((v, j) => { const g = T.GROUPS.findIndex(([a, b]) => j >= a && j < b), x = x0 + j * bw + g * 8, h = Math.min(1, v) * 280; ctx.fillStyle = "#232866"; ctx.fillRect(x, base - 280, bw - 4, 280); ctx.fillStyle = ["#ff7d5f", "#ffc34d", "#9184ff", "#3ee9cf", "#ff6f9e"][g]; ctx.fillRect(x, base - h, bw - 4, h); });
      ctx.fillStyle = "#c3c7f0"; ctx.font = "11px JetBrains Mono"; ctx.fillText("28 cột = 28 con số mô tả bức ảnh", x0, 420);
    } else if (s === 3 || s === 4) {
      const m = ST.model; if (!m) return;
      const z = m.mu ? X(d).map((v, j) => (v - m.mu[j]) / m.sd[j]) : X(d), lg = m.logits(X(d)), p = m.predict(X(d));
      if (s === 3) {
        for (let k = 0; k < NC; k++) {
          const y = 50 + k * 100, contrib = Array.from(m.W[k]).map((w, j) => ({ j, v: w * z[j] })).sort((a, b) => Math.abs(b.v) - Math.abs(a.v)).slice(0, 4);
          ctx.fillStyle = COL[k]; ctx.font = "800 16px Be Vietnam Pro"; ctx.fillText(CLS[k], 30, y + 20);
          let x = 320; ctx.strokeStyle = "#4b52a8"; ctx.beginPath(); ctx.moveTo(320, y); ctx.lineTo(320, y + 60); ctx.stroke();
          contrib.forEach((c, i) => { const w = Math.max(3, Math.min(130, Math.abs(c.v) * 40)); ctx.fillStyle = c.v > 0 ? "#ff7d5f" : "#548cff"; const xx = c.v > 0 ? 320 + i * 0 : 320 - w; ctx.fillRect(xx, y + 4 + i * 13, w, 10); ctx.fillStyle = "#c3c7f0"; ctx.font = "10px Be Vietnam Pro"; ctx.fillText((ST.mode === "feat" ? T.NAMES[c.j] : "điểm ảnh " + Math.floor(c.j / 3)), c.v > 0 ? 320 + w + 6 : 320 - w - 90, y + 13 + i * 13); });
          D.pill(ctx, "điểm " + lg[k].toFixed(1), 580, y + 28, "#1c2048", 13);
        }
      } else {
        const mx = Math.max(...lg), ex = lg.map((v) => Math.exp(v - mx)), sm = ex.reduce((a, b) => a + b, 0);
        ctx.font = "700 13px JetBrains Mono"; ctx.fillStyle = "#8f96d4"; ctx.fillText("điểm", 150, 50); ctx.fillText("e^điểm", 300, 50); ctx.fillText("xác suất", 470, 50);
        for (let k = 0; k < NC; k++) {
          const y = 90 + k * 90; ctx.fillStyle = COL[k]; ctx.font = "800 15px Be Vietnam Pro"; ctx.fillText(CLS[k], 20, y + 22);
          ctx.fillStyle = "#fff"; ctx.font = "700 15px JetBrains Mono"; ctx.fillText(lg[k].toFixed(2), 150, y + 22); ctx.fillText((ex[k] / Math.max(...ex)).toFixed(3), 300, y + 22);
          ctx.fillStyle = "#232866"; ctx.fillRect(470, y + 6, 140, 22); ctx.fillStyle = COL[k]; ctx.fillRect(470, y + 6, 140 * p[k], 22);
          ctx.fillStyle = "#fff"; ctx.fillText(Math.round(p[k] * 100) + "%", 476, y + 23);
        }
      }
    } else {
      const r = predict(d), n = ST.unsure ? 5 : 4;
      for (let k = 0; k < NC; k++) { const x = 50 + k * 140, h = r.p[k] * 300; ctx.fillStyle = "#232866"; D.rr(ctx, x, 100, 90, 300, 10); ctx.fill(); ctx.fillStyle = COL[k]; D.rr(ctx, x, 400 - h, 90, Math.max(6, h), 10); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "700 14px Be Vietnam Pro"; ctx.textAlign = "center"; ctx.fillText(CLS[k], x + 45, 430); ctx.fillText(Math.round(r.p[k] * 100) + "%", x + 45, 90); ctx.textAlign = "left"; }
      if (ST.unsure) { const y = 400 - ST.unsureTh * 300; ctx.setLineDash([7, 5]); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(610, y); ctx.stroke(); ctx.setLineDash([]); D.pill(ctx, "ngưỡng chắc chắn", 540, y - 14, "#8a5a00", 11); }
      D.pill(ctx, r.unsure ? "→ Hỏi người lớn" : "→ Thùng " + CLS[r.k], 320, 44, r.unsure ? "#8a5a00" : "#0b7d71", 16);
    }
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"), d = cur(); if (!d) return;
    const f = d.f;
    if (s === 0) el.innerHTML = `Ảnh 32 × 32 × 3 = <span class="hl">3.072</span> con số\nNền: <span class="w">${T.BG[d.item.bg].name}</span> · Thật ra là: <span class="hl">${CLS[d.item.cls]}</span>`;
    else if (s === 1) el.innerHTML = `Tỉ lệ vật / ảnh: <span class="hl">${(f[19] / 3).toFixed(2)}</span>\nĐộ dài/rộng: <span class="hl">${(f[20] * 2).toFixed(2)}</span> · Độ đặc: <span class="hl">${f[21].toFixed(2)}</span>`;
    else if (s === 2) el.innerHTML = [[9, "độ sáng"], [11, "điểm lóa sáng"], [14, "mật độ cạnh"], [2, "sắc vàng"], [26, "vật: sáng"], [27, "vật: lóa kim loại"]].map(([j, n]) => `${n.padEnd(14, " ")} <span class="hl">${f[j].toFixed(2)}</span>`).join("\n");
    else if (s === 3 || s === 4) { if (!ST.model) { el.textContent = "Chưa huấn luyện"; return; } const lg = ST.model.logits(X(d)), p = ST.model.predict(X(d)); el.innerHTML = CLS.slice(0, NC).map((c, k) => `${c.padEnd(9, " ")} điểm ${lg[k].toFixed(2).padStart(6, " ")} → <span class="hl">${Math.round(p[k] * 100)}%</span>`).join("\n"); }
    else { const r = predict(d); el.innerHTML = `Cao nhất: <span class="hl">${CLS[r.k]} ${Math.round(r.p[r.k] * 100)}%</span>\n${ST.unsure ? `Ngưỡng chắc chắn: <span class="w">${Math.round(ST.unsureTh * 100)}%</span> → ${r.unsure ? '<span class="w">hỏi người lớn</span>' : "đủ chắc"}` : "Không kiểm tra độ chắc chắn"}\nThật ra là: <span class="hl">${CLS[d.item.cls]}</span>`; }
  }

  // ---------- bảng não ----------
  function renderBrain() {
    const r = ST.src === "sim" ? (ST.conv && ST.conv.r) : ST.lastPred;
    $("bResult").innerHTML = `<small>AI ĐOÁN</small><span style="color:${r ? (r.unsure ? "#ffc34d" : COL[r.k]) : "#fff"}">${r ? (r.unsure ? "Không chắc" : CLS[r.k]) : "—"}</span>`;
    $("bProbs").innerHTML = CLS.slice(0, NC).map((c, k) => `<div class="r"><span>${c}</span><span class="bar"><i style="width:${r ? r.p[k] * 100 : 0}%;background:${COL[k]}"></i></span><span>${r ? Math.round(r.p[k] * 100) : 0}%</span></div>`).join("");
    $("bStats").textContent = `${ST.stats[0]}/${ST.stats[1]}`;
    const h = ST.hist[ST.hist.length - 1]; $("bTest").textContent = h ? Math.round(h.accTe * 100) + "%" : "—";
    $("trainStatus").textContent = ST.training ? `Đang học… vòng ${ST.ep}/${ST.epochs}` : `Đã học xong ${ST.ep} vòng`;
  }

  // ---------- camera ----------
  let stream = null;
  function camEncode() { return encodeFrom((ctx, S) => { const vw = video.videoWidth, vh = video.videoHeight, s = Math.min(vw, vh); ctx.save(); ctx.translate(S, 0); ctx.scale(-1, 1); ctx.drawImage(video, (vw - s) / 2, (vh - s) / 2, s, s, 0, 0, S, S); ctx.restore(); }); }
  async function useCam() {
    try { stream = await P.camera(video); ST.src = "cam"; P.srcButtons("cam"); document.querySelectorAll(".cam-only").forEach((e) => (e.hidden = false)); }
    catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; ST.src = "sim"; P.srcButtons("sim"); document.querySelectorAll(".cam-only").forEach((e) => (e.hidden = true)); }

  // ---------- điều khiển ----------
  const syncs = [];
  function markMode() { $("modeBtns").querySelectorAll("button").forEach((b) => { const on = b.dataset.m === ST.mode; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  function retrain() { buildData(); startTraining(); prog.done("train"); }
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    syncs.push(P.range("nTrain", () => ST.nTrain, (v) => (ST.nTrain = v), (v) => v + " ảnh"));
    syncs.push(P.range("lr", () => ST.lr, (v) => (ST.lr = v), (v) => v.toFixed(3), genCode));
    syncs.push(P.range("epochs", () => ST.epochs, (v) => (ST.epochs = v), (v) => v + " vòng", genCode));
    syncs.push(P.range("unsureTh", () => ST.unsureTh, (v) => (ST.unsureTh = v), (v) => Math.round(v * 100) + "%"));
    $("unsure").onchange = (e) => (ST.unsure = e.target.checked);
    $("modeBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.mode = b.dataset.m; markMode(); genCode(); }));
    $("btnTrain").onclick = retrain;
    $("btnNewSeed").onclick = () => { ST.seed++; retrain(); };
    $("capBtns").innerHTML = CLS.slice(0, NC).map((c, k) => `<button class="btn small" style="background:${COL[k]};color:#0a0b1e" data-k="${k}"><i data-i="camera"></i>Chụp: ${c}</button>`).join("");
    HKA.hydrate($("capBtns"));
    $("capBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { if (ST.src !== "cam" || video.readyState < 2) return; const e = camEncode(); const cv = document.createElement("canvas"); cv.width = cv.height = 48; const k = +b.dataset.k; ST.own.push(Object.assign(e, { y: k, item: null, snap: true })); $("ownInfo").textContent = CLS.slice(0, NC).map((c, j) => `${c}: ${ST.own.filter((d) => d.y === j).length}`).join(" · "); }));
    $("btnOwn").onclick = () => { if (ST.own.length < 4) return; ST.train = ST.own.slice(); ST.mode = "feat"; markMode(); startTraining(); };
    const sync = () => { syncs.forEach((f) => f()); $("unsure").checked = ST.unsure; markMode(); genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF);
      if (k === "overfit") { ST.nTrain = 3; ST.mode = "px"; ST.epochs = 120; ST.lr = 0.08; }
      if (k === "bias") ST.bias = true;
      if (k === "pin") ST.pin = true;
      if (ST.src !== "sim") useSim();
      sync(); retrain(); newItem(); prog.done("broke");
      $(k === "pin" ? "moi" : "tu-lam").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); sync(); retrain(); };
    sync();
  }

  const QUIZ = [
    { q: "Vì sao phải giữ riêng một \"tập kiểm tra\" mà máy KHÔNG được học?", o: ["Để máy học nhanh hơn", "Để đo xem máy có làm tốt với ảnh MỚI hay chỉ thuộc lòng ảnh đã học", "Vì máy không đủ bộ nhớ", "Để có thêm dữ liệu huấn luyện"], a: 1, e: "Giống như đề kiểm tra không được trùng bài tập về nhà: phải dùng ảnh mới thì mới biết máy thật sự hiểu." },
    { q: "Máy đạt 100% trên tập học nhưng chỉ 45% trên tập kiểm tra. Đây là hiện tượng gì?", o: ["Học thiếu", "Quá khớp (học vẹt)", "Máy bị hỏng", "Dữ liệu kiểm tra sai"], a: 1, e: "Máy đã thuộc lòng các ảnh học, kể cả chi tiết vô nghĩa, nên không áp dụng được cho ảnh mới." },
    { q: "\"Học chuyển giao\" có nghĩa là…", o: ["Chép mô hình của bạn khác", "Dùng lại phần trích xuất đặc trưng đã học từ rất nhiều ảnh trước đó, chỉ huấn luyện lại lớp cuối", "Chuyển máy tính sang phòng khác", "Học từ video thay vì ảnh"], a: 1, e: "Nhờ dùng lại kiến thức có sẵn, chỉ cần vài chục ảnh là đủ huấn luyện một bộ phân loại mới." },
    { q: "Mọi ảnh nhựa trong dữ liệu học đều chụp trên nền gạch xanh. Điều gì dễ xảy ra?", o: ["Máy nhận nhựa tốt hơn ở mọi nơi", "Máy học vẹt \"nền xanh = nhựa\" và đoán sai khi nhựa nằm trên nền khác", "Không ảnh hưởng gì", "Máy từ chối học"], a: 1, e: "AI tìm \"đường tắt\" dễ nhất trong dữ liệu. Muốn AI học đúng thứ cần học, dữ liệu phải đa dạng." },
    { q: "Băng chuyền gặp một cục pin (chưa từng có trong dữ liệu học). Cách thiết kế an toàn nhất là…", o: ["Luôn bỏ vào thùng kim loại", "Khi xác suất cao nhất vẫn thấp, máy dừng lại và nhờ người kiểm tra", "Bỏ ngẫu nhiên", "Tắt băng chuyền vĩnh viễn"], a: 1, e: "Pin là rác nguy hại. Một hệ thống AI tốt phải biết lúc nào nó không chắc và chuyển cho con người quyết định." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0, camT = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;
    trainStep();
    if (ST.src === "cam" && video.readyState >= 2 && now - camT > 250 && ST.model) { camT = now; ST.lastPred = predict(camEncode()); }
    renderStage(dt);
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; renderBrain(); renderChart(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); bind(); buildData(); startTraining();
  // huấn luyện xong ngay từ đầu để băng chuyền chạy được
  while (ST.training) trainStep();
  newItem(); P.srcButtons("sim");
  requestAnimationFrame(tick);
})();
