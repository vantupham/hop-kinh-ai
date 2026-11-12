/* Hộp Kính AI · Dự án 10 · Trợ lý tư thế ngồi học (đặc trưng góc, cây quyết định CART, Gini, độ sâu) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, R = Math.PI / 180;
  const prog = P.progress("hka-10");
  const CLS = ["Đúng tư thế", "Gù lưng", "Cúi sát", "Ngả người"], COL = ["#3ee9cf", "#ff7d5f", "#ffc34d", "#9184ff"];
  const TIPS = ["Tuyệt vời, giữ nguyên nhé!", "Thẳng lưng lên một chút nào!", "Mắt gần sách quá, lùi ra xa hơn!", "Ngồi thẳng lại để tập trung hơn!"];
  const FEATS = [
    { k: "lung", name: "góc lưng", unit: "°", fmt: (v) => v.toFixed(0) + "°" },
    { k: "co", name: "góc cổ", unit: "°", fmt: (v) => v.toFixed(0) + "°" },
    { k: "mat", name: "mắt–tay (theo thân)", unit: "", fmt: (v) => v.toFixed(2) },
    { k: "matpx", name: "mắt–tay (pixel)", unit: "px", fmt: (v) => v.toFixed(0) + "px" },
    { k: "vai", name: "vai nhô trước hông", unit: "", fmt: (v) => v.toFixed(2) }
  ];
  const DEF = { depth: 4, minLeaf: 4, use: [true, true, true, false, true], noise: 0, tallOnly: false, ax: 0, ay: 2 };
  const ST = { src: "sim", ...DEF, auto: true, autoT: 0, pose: { lung: 5, co: 10, cao: 1 }, target: { lung: 5, co: 10 }, lm: null, f: null, pred: 0, path: [], tree: null, train: [], test: [], timeIn: [0, 0, 0, 0], grow: 99, grownAt: 0 };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), video = $("video");

  // ---------- người ngồi mô phỏng (nhìn nghiêng) ----------
  const HIP = { x: 230, y: 330 }, DESK_Y = 292, WRIST = { x: 430, y: 288 };
  function sitter(p, noise) {
    const s = p.cao, L = 150 * s, b = p.lung * R, n = (p.lung * 0.5 + p.co) * R;
    const sh = { x: HIP.x + Math.sin(b) * L, y: HIP.y - Math.cos(b) * L };
    const ear = { x: sh.x + Math.sin(n) * 46 * s, y: sh.y - Math.cos(n) * 46 * s };
    const head = { x: ear.x + Math.cos(n) * 10 * s, y: ear.y + Math.sin(n) * 10 * s };
    const eye = { x: head.x + Math.cos(n) * 20 * s, y: head.y + Math.sin(n) * 20 * s - 4 * s };
    const nose = { x: head.x + Math.cos(n) * 28 * s, y: head.y + Math.sin(n) * 28 * s + 4 * s };
    const knee = { x: HIP.x + 120 * s, y: HIP.y + 6 }, ankle = { x: knee.x + 6, y: 440 };
    // khuỷu tay: hai đoạn từ vai tới cổ tay đặt trên bàn
    const dx = WRIST.x - sh.x, dy = WRIST.y - sh.y, d = Math.min(Math.hypot(dx, dy), 190 * s), L1 = 100 * s, L2 = 100 * s, a = Math.atan2(dy, dx), c = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
    const elb = { x: sh.x + Math.cos(a + c) * L1, y: sh.y + Math.sin(a + c) * L1 };
    const j = (q) => ({ x: q.x + (Math.random() - 0.5) * 2 * noise, y: q.y + (Math.random() - 0.5) * 2 * noise, v: 0.95 });
    const lm = new Array(33).fill(null).map(() => ({ x: 0, y: 0, v: 0.2 }));
    lm[0] = j(nose); lm[2] = j(eye); lm[5] = j(eye); lm[7] = j(ear); lm[8] = j(ear); lm[11] = j(sh); lm[12] = j(sh); lm[13] = j(elb); lm[14] = j(elb); lm[15] = j(WRIST); lm[16] = j(WRIST); lm[23] = j(HIP); lm[24] = j(HIP); lm[25] = j(knee); lm[26] = j(knee); lm[27] = j(ankle); lm[28] = j(ankle);
    lm.head = head; lm.s = s; return lm;
  }
  // 5 đặc trưng tính từ điểm khớp (dùng chung cho mô phỏng và camera)
  function features(lm) {
    const sh = lm[11], hip = lm[23], ear = lm[7], eye = lm[2], wr = lm[15], torso = Math.hypot(sh.x - hip.x, sh.y - hip.y) || 1, dir = Math.sign(wr.x - hip.x) || 1;
    return [Math.atan2((sh.x - hip.x) * dir, hip.y - sh.y) / R, Math.atan2((ear.x - sh.x) * dir, sh.y - ear.y) / R - Math.atan2((sh.x - hip.x) * dir, hip.y - sh.y) / R * 0.5, (wr.y - eye.y) / torso, wr.y - eye.y, (sh.x - hip.x) * dir / torso];
  }
  // "chuyên gia" gắn nhãn từ tư thế thật (máy không được biết luật này)
  function expert(f) { if (f[2] < 0.78) return 2; if (f[0] > 17) return 1; if (f[0] < -9) return 3; return 0; }
  function makeData(n, seed, tallOnly) {
    const r = P.rng(seed), out = [];
    for (let i = 0; i < n; i++) {
      const p = { lung: -22 + r() * 58, co: r() * 48, cao: tallOnly ? 1.1 + r() * 0.15 : 0.78 + r() * 0.44 };
      const clean = features(sitter(p, 0)), y0 = expert(clean), f = features(sitter(p, 3));
      out.push({ f, y: ST.noise && r() < ST.noise ? Math.floor(r() * 4) : y0, p });
    }
    return out;
  }

  // ---------- cây quyết định CART ----------
  const gini = (c) => { const n = c.reduce((a, b) => a + b, 0) || 1; return 1 - c.reduce((s, v) => s + (v / n) ** 2, 0); };
  const counts = (rows) => { const c = [0, 0, 0, 0]; rows.forEach((r) => c[r.y]++); return c; };
  function build(rows, depth) {
    const c = counts(rows), node = { c, n: rows.length, g: gini(c), cls: c.indexOf(Math.max(...c)), depth };
    if (depth >= ST.depth || rows.length < 2 * ST.minLeaf || node.g === 0) return node;
    let best = null;
    ST.use.forEach((on, j) => {
      if (!on) return;
      const vals = rows.map((r) => r.f[j]).sort((a, b) => a - b);
      for (let q = 1; q < 40; q++) {
        const t = (vals[Math.floor(q / 40 * vals.length)] + vals[Math.floor(q / 40 * vals.length) - 1]) / 2;
        const L = rows.filter((r) => r.f[j] <= t), Rr = rows.filter((r) => r.f[j] > t);
        if (L.length < ST.minLeaf || Rr.length < ST.minLeaf) continue;
        const g = (L.length * gini(counts(L)) + Rr.length * gini(counts(Rr))) / rows.length;
        if (!best || g < best.g) best = { j, t, g, L, Rr };
      }
    });
    if (!best || best.g >= node.g - 1e-6) return node;
    node.j = best.j; node.t = best.t; node.gain = node.g - best.g;
    node.left = build(best.L, depth + 1); node.right = build(best.Rr, depth + 1);
    return node;
  }
  function predict(node, f, path) { if (path) path.push(node); if (node.j == null) return node.cls; return predict(f[node.j] <= node.t ? node.left : node.right, f, path); }
  const acc = (rows) => rows.reduce((s, r) => s + (predict(ST.tree, r.f) === r.y ? 1 : 0), 0) / (rows.length || 1);
  function leaves(n) { return n.j == null ? 1 : leaves(n.left) + leaves(n.right); }
  function maxD(n) { return n.j == null ? n.depth : Math.max(maxD(n.left), maxD(n.right)); }
  function train() {
    ST.train = makeData(220, 11, ST.tallOnly); ST.test = makeData(160, 99, false);
    ST.tree = build(ST.train, 0); ST.grow = 0; ST.grownAt = performance.now();
    const M = Array.from({ length: 4 }, () => [0, 0, 0, 0]); ST.test.forEach((r) => M[r.y][predict(ST.tree, r.f)]++);
    $("confOut").innerHTML = P.confusion(CLS, COL, M);
    $("accTrain").textContent = Math.round(acc(ST.train) * 100) + "%"; $("accTest").textContent = Math.round(acc(ST.test) * 100) + "%";
    $("treeInfo").textContent = `${leaves(ST.tree)} lá · sâu ${maxD(ST.tree)} tầng`;
    regionImg = null; genCode();
  }

  // ---------- vẽ cây ----------
  function layout(node, x0, x1, y, out, dy) { const x = (x0 + x1) / 2; out.push({ node, x, y }); node._x = x; node._y = y; if (node.j != null) { layout(node.left, x0, x, y + dy, out, dy); layout(node.right, x, x1, y + dy, out, dy); } return out; }
  function drawTree(ctx, W, Hh, dark) {
    const items = layout(ST.tree, 10, W - 10, 24, [], Math.min(78, (Hh - 44) / Math.max(1, maxD(ST.tree)))), onPath = new Set(ST.path), grow = ST.grow, TH = P.TH;
    const ink = dark ? "#e8eaff" : TH.ink, mut = dark ? "#8f96d4" : TH.text;
    for (const { node } of items) if (node.j != null && node.depth < grow) for (const ch of [node.left, node.right]) {
      ctx.strokeStyle = onPath.has(node) && onPath.has(ch) ? "#5ef2d6" : dark ? "#2c3170" : TH.grid; ctx.lineWidth = onPath.has(node) && onPath.has(ch) ? 4 : 1.5;
      ctx.beginPath(); ctx.moveTo(node._x, node._y + 14); ctx.lineTo(ch._x, ch._y - 14); ctx.stroke();
      ctx.fillStyle = mut; ctx.font = "600 10px JetBrains Mono, monospace"; ctx.fillText(ch === node.left ? "đúng" : "sai", (node._x + ch._x) / 2 + (ch === node.left ? -26 : 6), (node._y + ch._y) / 2);
    }
    const n = items.length, small = n > 40;
    for (const { node, x, y } of items) {
      if (node.depth > grow) continue;
      const on = onPath.has(node), leaf = node.j == null || node.depth === grow;
      const txt = leaf ? (small ? "" : CLS[node.cls]) : `${FEATS[node.j].name} ≤ ${FEATS[node.j].fmt(node.t)}?`;
      ctx.font = `${leaf ? 700 : 600} ${small ? 9 : 11}px Be Vietnam Pro, sans-serif`;
      const w = Math.max(small ? 14 : 30, ctx.measureText(txt).width + 14), h = small ? 16 : 26;
      ctx.fillStyle = leaf ? COL[node.cls] : dark ? "#1c2048" : TH.dark ? "#1c2048" : "#ffffff";
      ctx.globalAlpha = leaf ? (on ? 1 : 0.75) : 1; D.rr(ctx, x - w / 2, y - h / 2, w, h, 7); ctx.fill(); ctx.globalAlpha = 1;
      ctx.strokeStyle = on ? "#5ef2d6" : leaf ? "transparent" : dark ? "#3a3f8a" : TH.grid; ctx.lineWidth = on ? 3 : 1.2; D.rr(ctx, x - w / 2, y - h / 2, w, h, 7); ctx.stroke();
      ctx.fillStyle = leaf ? "#0a0b1e" : ink; ctx.textAlign = "center"; ctx.fillText(txt, x, y + 4); ctx.textAlign = "left";
    }
  }
  // ---------- bản đồ vùng quyết định ----------
  let regionImg = null;
  const RANGE = [[-25, 40], [-10, 65], [-0.2, 1.4], [-30, 220], [-0.3, 0.75]];
  function renderRegions() {
    const cv = $("regions"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, L = 56, B = 40, T = 12, Rm = 12, TH = P.TH;
    const [ax, ay] = [ST.ax, ST.ay], rx = RANGE[ax], ry = RANGE[ay];
    const X = (v) => L + (v - rx[0]) / (rx[1] - rx[0]) * (W - L - Rm), Y = (v) => H - B - (v - ry[0]) / (ry[1] - ry[0]) * (H - B - T);
    if (!regionImg) {
      regionImg = ctx.createImageData(W, H); const base = ST.f ? ST.f.slice() : [5, 10, 0.8, 120, 0.1];
      for (let py = T; py < H - B; py += 4) for (let px = L; px < W - Rm; px += 4) {
        const f = base.slice(); f[ax] = rx[0] + (px - L) / (W - L - Rm) * (rx[1] - rx[0]); f[ay] = ry[0] + (H - B - py) / (H - B - T) * (ry[1] - ry[0]);
        const c = COL[predict(ST.tree, f)], rr = parseInt(c.slice(1, 3), 16), gg = parseInt(c.slice(3, 5), 16), bb = parseInt(c.slice(5, 7), 16);
        for (let dy = 0; dy < 4; dy++) for (let dx = 0; dx < 4; dx++) { const i = ((py + dy) * W + px + dx) * 4; regionImg.data[i] = rr; regionImg.data[i + 1] = gg; regionImg.data[i + 2] = bb; regionImg.data[i + 3] = 70; }
      }
    }
    ctx.clearRect(0, 0, W, H); ctx.putImageData(regionImg, 0, 0);
    ctx.font = "11px JetBrains Mono, monospace"; ctx.fillStyle = TH.text;
    for (let i = 0; i <= 4; i++) { const v = rx[0] + i / 4 * (rx[1] - rx[0]); ctx.fillText(FEATS[ax].fmt(v), X(v) - 12, H - B + 16); const u = ry[0] + i / 4 * (ry[1] - ry[0]); ctx.fillText(FEATS[ay].fmt(u), 4, Y(u) + 4); }
    ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillStyle = TH.ink; ctx.fillText(FEATS[ax].name + " →", W / 2 - 40, H - 6);
    for (const r of ST.train) { ctx.fillStyle = COL[r.y]; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.arc(X(r.f[ax]), Y(r.f[ay]), 3.5, 0, 7); ctx.fill(); }
    ctx.globalAlpha = 1;
    if (ST.f) { ctx.strokeStyle = TH.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(X(ST.f[ax]), Y(ST.f[ay]), 9, 0, 7); ctx.stroke(); }
  }

  // ---------- sân khấu ----------
  function drawScene(ctx, lm, fade) {
    const W = 640, H = 480, dark = P.TH.dark;
    ctx.fillStyle = dark ? "#1b1e48" : "#ece9f8"; ctx.fillRect(0, 0, W, H); ctx.fillStyle = dark ? "#2a2550" : "#cbbfa3"; ctx.fillRect(0, 440, W, 40);
    ctx.fillStyle = dark ? "#40386e" : "#9a6a40"; ctx.fillRect(360, DESK_Y, 260, 14); ctx.fillRect(590, DESK_Y, 14, 150); ctx.fillRect(380, DESK_Y, 12, 150);
    ctx.fillStyle = "#f6f3ea"; ctx.fillRect(400, DESK_Y - 8, 80, 8); ctx.fillStyle = "#d8343a"; ctx.fillRect(400, DESK_Y - 10, 80, 3);
    ctx.fillStyle = dark ? "#2f2a5a" : "#6d5dfc"; ctx.fillRect(150, 338, 130, 12); ctx.fillRect(150, 230, 14, 120); ctx.fillRect(170, 350, 10, 90); ctx.fillRect(260, 350, 10, 90);
    if (!lm || !lm.head) return;
    const s = lm.s, J = (i) => lm[i];
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    ctx.strokeStyle = "#2d3268"; ctx.lineWidth = 34 * s; ctx.beginPath(); ctx.moveTo(J(23).x, J(23).y); ctx.lineTo(J(25).x, J(25).y); ctx.stroke();
    ctx.strokeStyle = "#f1c29a"; ctx.lineWidth = 22 * s; ctx.beginPath(); ctx.moveTo(J(25).x, J(25).y); ctx.lineTo(J(27).x, J(27).y); ctx.stroke();
    // lưng hơi cong khi gù
    const sh = J(11), hp = J(23), mx = (sh.x + hp.x) / 2 - Math.max(0, ST.pose.lung) * 0.7 * s, my = (sh.y + hp.y) / 2;
    ctx.strokeStyle = "#ff6b4a"; ctx.lineWidth = 46 * s; ctx.beginPath(); ctx.moveTo(hp.x, hp.y); ctx.quadraticCurveTo(mx, my, sh.x, sh.y); ctx.stroke();
    ctx.strokeStyle = "#e3ad85"; ctx.lineWidth = 16 * s; ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(J(7).x, J(7).y); ctx.stroke();
    ctx.fillStyle = "#f1c29a"; ctx.beginPath(); ctx.arc(lm.head.x, lm.head.y, 28 * s, 0, 7); ctx.fill();
    ctx.fillStyle = "#2a1e1a"; ctx.beginPath(); ctx.arc(lm.head.x - 4 * s, lm.head.y - 6 * s, 28 * s, Math.PI * 0.85, Math.PI * 1.9); ctx.fill();
    ctx.strokeStyle = "#ff6b4a"; ctx.lineWidth = 18 * s; ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(J(13).x, J(13).y); ctx.stroke();
    ctx.strokeStyle = "#f1c29a"; ctx.lineWidth = 13 * s; ctx.beginPath(); ctx.moveTo(J(13).x, J(13).y); ctx.lineTo(J(15).x, J(15).y); ctx.stroke();
    if (fade) { ctx.fillStyle = `rgba(14,16,40,${fade})`; ctx.fillRect(0, 0, W, H); }
  }
  function drawJoints(ctx, lm, labels) {
    const pts = [[2, "mắt"], [7, "tai"], [11, "vai"], [13, "khuỷu"], [15, "cổ tay"], [23, "hông"], [25, "gối"]];
    ctx.strokeStyle = "rgba(255,255,255,.8)"; ctx.lineWidth = 2.5; ctx.beginPath(); for (const [a, b] of [[23, 11], [11, 7], [11, 13], [13, 15], [23, 25], [25, 27]]) { ctx.moveTo(lm[a].x, lm[a].y); ctx.lineTo(lm[b].x, lm[b].y); } ctx.stroke();
    for (const [i, n] of pts) { ctx.fillStyle = "#5ef2d6"; ctx.beginPath(); ctx.arc(lm[i].x, lm[i].y, 6, 0, 7); ctx.fill(); if (labels) { ctx.fillStyle = "#fff"; ctx.font = "600 11px Be Vietnam Pro"; ctx.fillText(n, lm[i].x + 9, lm[i].y - 7); } }
  }
  function drawFeatures(ctx, lm) {
    const sh = lm[11], hp = lm[23], ear = lm[7], eye = lm[2], wr = lm[15];
    ctx.setLineDash([5, 5]); ctx.strokeStyle = "rgba(255,255,255,.6)"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(hp.x, hp.y); ctx.lineTo(hp.x, hp.y - 170); ctx.moveTo(sh.x, sh.y); ctx.lineTo(sh.x, sh.y - 70); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(hp.x, hp.y); ctx.lineTo(sh.x, sh.y); ctx.stroke();
    ctx.strokeStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(sh.x, sh.y); ctx.lineTo(ear.x, ear.y); ctx.stroke();
    ctx.strokeStyle = "#3ee9cf"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(eye.x, eye.y); ctx.lineTo(eye.x, wr.y); ctx.lineTo(wr.x, wr.y); ctx.stroke();
    D.pill(ctx, "góc lưng " + FEATS[0].fmt(ST.f[0]), hp.x - 70, hp.y - 90, "#c2402a", 12);
    D.pill(ctx, "góc cổ " + FEATS[1].fmt(ST.f[1]), ear.x - 30, ear.y - 40, "#8a5a00", 12);
    D.pill(ctx, "mắt–tay " + ST.f[2].toFixed(2), eye.x + 70, (eye.y + wr.y) / 2, "#0b7d71", 12);
  }
  function renderStage() {
    const ctx = sctx;
    if (ST.src === "sim") drawScene(ctx, ST.lm);
    else if (video.readyState >= 2) { ctx.save(); ctx.translate(640, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, 640, 480); ctx.restore(); }
    else D.labBg(ctx);
    if (ST.lm && ST.show !== false) drawJoints(ctx, ST.lm);
    if (ST.f) {
      const c = ST.pred; ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, 14, 14, 270, 70, 14); ctx.fill();
      ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText("CÂY QUYẾT ĐỊNH NÓI", 28, 34);
      ctx.fillStyle = COL[c]; ctx.font = "800 22px Be Vietnam Pro, sans-serif"; ctx.fillText(CLS[c], 28, 62);
      D.pill(ctx, TIPS[c], 320, 456, c ? "#c2402a" : "#0b7d71", 14);
    }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh nghiêng", e: "image", d: "Camera đặt <b>bên cạnh bàn học</b>, nhìn nghiêng. Từ góc này dễ thấy lưng thẳng hay cong (nhớ lại Dự án 1: góc nhìn rất quan trọng)." },
    { t: "Điểm khớp", e: "robot", d: "Mô hình tư thế cho ra các điểm: mắt, tai, vai, khuỷu, cổ tay, hông, gối." },
    { t: "Đặc trưng", e: "angle", d: "Tính <b>góc lưng</b> (hông → vai so với phương thẳng đứng), <b>góc cổ</b>, <b>khoảng cách mắt tới tay</b> (chia cho chiều dài thân) và độ nhô của vai." },
    { t: "Đi trên cây", e: "map", d: "Bắt đầu từ gốc, trả lời từng <b>câu hỏi đúng/sai</b> rồi đi xuống nhánh tương ứng. Đường xanh là đường đi của tư thế hiện tại." },
    { t: "Tới lá", e: "checkCircle", d: "Mỗi <b>lá</b> chứa những mẫu dữ liệu giống nhau. Kết luận là nhãn chiếm nhiều nhất trong lá đó." },
    { t: "Vì sao hỏi câu này?", e: "help", d: "Máy thử <b>mọi câu hỏi có thể</b> và chọn câu chia dữ liệu \"sạch\" nhất, tức là hai nhóm sau khi chia ít bị lẫn lộn nhất (<b>Gini</b> nhỏ nhất)." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 3) prog.done("see"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const s = pipe.get(), ctx = octx;
    if (s <= 2) { if (ST.src === "sim") drawScene(ctx, ST.lm, s ? 0.45 : 0); else D.labBg(ctx); if (!ST.lm) return; if (s === 1) drawJoints(ctx, ST.lm, true); if (s === 2 && ST.f) { drawJoints(ctx, ST.lm); drawFeatures(ctx, ST.lm); } return; }
    D.labBg(ctx);
    if (s === 3) { drawTree(ctx, 640, 480, true); return; }
    if (s === 4) {
      const leaf = ST.path[ST.path.length - 1]; if (!leaf) return; const n = leaf.n || 1;
      ctx.fillStyle = "#fff"; ctx.font = "700 15px Be Vietnam Pro"; ctx.fillText(`Lá này chứa ${leaf.n} mẫu dữ liệu học:`, 40, 70);
      CLS.forEach((c, k) => { const y = 110 + k * 70, w = leaf.c[k] / n * 420; ctx.fillStyle = "#232866"; ctx.fillRect(170, y, 420, 34); ctx.fillStyle = COL[k]; ctx.fillRect(170, y, w, 34); ctx.fillStyle = COL[k]; ctx.font = "700 14px Be Vietnam Pro"; ctx.fillText(c, 40, y + 23); ctx.fillStyle = "#fff"; ctx.font = "700 13px JetBrains Mono"; ctx.fillText(`${leaf.c[k]} (${Math.round(leaf.c[k] / n * 100)}%)`, 180, y + 23); });
      D.pill(ctx, "→ " + CLS[leaf.cls], 320, 420, "#0b7d71", 16); return;
    }
    const root = ST.tree; if (root.j == null) return;
    const side = (node, x, title) => { ctx.fillStyle = "#fff"; ctx.font = "700 13px Be Vietnam Pro"; ctx.fillText(title, x, 150); CLS.forEach((c, k) => { const w = node.c[k] / (node.n || 1) * 230; ctx.fillStyle = COL[k]; ctx.fillRect(x, 170 + k * 34, Math.max(2, w), 26); ctx.fillStyle = "#c3c7f0"; ctx.font = "11px JetBrains Mono"; ctx.fillText(node.c[k], x + w + 6, 188 + k * 34); }); ctx.fillStyle = "#5ef2d6"; ctx.font = "700 13px JetBrains Mono"; ctx.fillText(`Gini = ${node.g.toFixed(2)}`, x, 330); };
    D.pill(ctx, `Câu hỏi ở gốc: ${FEATS[root.j].name} ≤ ${FEATS[root.j].fmt(root.t)}?`, 320, 50, "#5443ff", 14);
    ctx.fillStyle = "#c3c7f0"; ctx.font = "13px JetBrains Mono"; ctx.fillText(`Trước khi chia: Gini = ${root.g.toFixed(2)} (rất lẫn lộn)`, 40, 100);
    side(root.left, 40, `ĐÚNG (${root.left.n} mẫu)`); side(root.right, 340, `SAI (${root.right.n} mẫu)`);
    ctx.fillStyle = "#ffc34d"; ctx.font = "700 13px Be Vietnam Pro"; ctx.fillText(`Độ lẫn lộn giảm được: ${root.gain.toFixed(3)}, nhiều nhất trong mọi câu hỏi đã thử`, 40, 400);
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"), f = ST.f; if (!f) { el.textContent = "Đang chờ dữ liệu…"; return; }
    if (s <= 1) el.innerHTML = `vai #11 (${ST.lm[11].x.toFixed(0)}, ${ST.lm[11].y.toFixed(0)}) · hông #23 (${ST.lm[23].x.toFixed(0)}, ${ST.lm[23].y.toFixed(0)})\ntai #7 (${ST.lm[7].x.toFixed(0)}, ${ST.lm[7].y.toFixed(0)}) · mắt #2 (${ST.lm[2].x.toFixed(0)}, ${ST.lm[2].y.toFixed(0)})`;
    else if (s === 2) el.innerHTML = FEATS.map((F, j) => `${F.name.padEnd(20, " ")} <span class="${ST.use[j] ? "hl" : "w"}">${F.fmt(f[j])}</span>${ST.use[j] ? "" : "  (không dùng)"}`).join("\n");
    else if (s === 3) el.innerHTML = ST.path.filter((n) => n.j != null).map((n, i) => `${i + 1}. ${FEATS[n.j].name} ≤ ${FEATS[n.j].fmt(n.t)}? → <span class="hl">${f[n.j] <= n.t ? "đúng" : "sai"}</span> (${FEATS[n.j].fmt(f[n.j])})`).join("\n") + `\n→ <span class="w">${CLS[ST.pred]}</span>`;
    else if (s === 4) el.innerHTML = `Lá ở tầng ${ST.path.length - 1}\nKết luận: <span class="hl">${CLS[ST.pred]}</span>`;
    else el.innerHTML = `Gini = 1 − Σ (tỉ lệ mỗi nhãn)²\nToàn đúng một nhãn → Gini = 0 (sạch)\nBốn nhãn chia đều → Gini = 0,75 (lẫn lộn)`;
  }

  // ---------- bảng não, code ----------
  function renderBrain() {
    if (!ST.f) return;
    $("bResult").innerHTML = `<small>CÂY QUYẾT ĐỊNH NÓI</small><span style="color:${COL[ST.pred]}">${CLS[ST.pred]}</span>`;
    $("bPath").innerHTML = ST.path.filter((n) => n.j != null).map((n) => `${FEATS[n.j].name} ≤ ${FEATS[n.j].fmt(n.t)}? <b style="color:#5ef2d6">${ST.f[n.j] <= n.t ? "đúng" : "sai"}</b>`).join("<br>") || "—";
    const tot = ST.timeIn.reduce((a, b) => a + b, 0) || 1;
    $("bTime").innerHTML = CLS.map((c, k) => `<div class="r"><span>${c}</span><span class="bar"><i style="width:${ST.timeIn[k] / tot * 100}%;background:${COL[k]}"></i></span><span>${Math.round(ST.timeIn[k] / tot * 100)}%</span></div>`).join("");
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, s = (t) => `<span class="s">"${t}"</span>`;
    const lines = [], nm = ["gocLung", "gocCo", "matTay", "matTayPx", "vaiNho"];
    (function walk(node, ind) { const p = "  ".repeat(ind); if (node.j == null) { lines.push(`${p}${k("return")} ${s(CLS[node.cls])};`); return; } lines.push(`${p}${k("if")} (${nm[node.j]} &lt;= ${n(+node.t.toFixed(2))}) {`); walk(node.left, ind + 1); lines.push(`${p}} ${k("else")} {`); walk(node.right, ind + 1); lines.push(`${p}}`); })(ST.tree, 1);
    $("genCode").innerHTML = `<span class="c">// Đoạn code này do MÁY tự viết ra từ ${ST.train.length} mẫu dữ liệu</span>\n${k("function")} tuThe(${nm.filter((_, j) => ST.use[j]).join(", ")}) {\n${lines.join("\n")}\n}`;
  }

  // ---------- camera ----------
  let landmarker = null, stream = null, lastVT = -1, camLm = null;
  async function useCam() {
    P.msg($("stageMsg"), "Đang tải mô hình AI tư thế… Hãy đặt camera bên cạnh, nhìn nghiêng vào em.", "loader");
    try { landmarker = await P.vision("pose"); stream = await P.camera(video); ST.src = "cam"; P.srcButtons("cam"); P.msg($("stageMsg"), null); }
    catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; ST.src = "sim"; P.srcButtons("sim"); }
  function camFrame() {
    if (!landmarker || video.readyState < 2) return camLm; if (video.currentTime === lastVT) return camLm; lastVT = video.currentTime;
    const r = landmarker.detectForVideo(video, performance.now()), p = r.landmarks && r.landmarks[0]; if (!p) return (camLm = null);
    const lm = p.map((q) => ({ x: (1 - q.x) * 640, y: q.y * 480, v: q.visibility || 1 }));
    // chọn bên người nhìn rõ hơn
    if ((lm[12].v || 0) > (lm[11].v || 0)) for (const [a, b] of [[11, 12], [13, 14], [15, 16], [23, 24], [25, 26], [27, 28], [7, 8], [2, 5]]) lm[a] = lm[b];
    return (camLm = lm);
  }

  // ---------- điều khiển ----------
  const syncs = [];
  const POSES = [{ lung: 4, co: 12 }, { lung: 28, co: 20 }, { lung: 18, co: 42 }, { lung: -17, co: 6 }, { lung: 2, co: 30 }];
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    $("btnAuto").onclick = () => { ST.auto = !ST.auto; markAuto(); };
    syncs.push(P.range("lung", () => ST.pose.lung, (v) => { ST.pose.lung = v; ST.auto = false; markAuto(); }, (v) => v.toFixed(0) + "°"));
    syncs.push(P.range("co", () => ST.pose.co, (v) => { ST.pose.co = v; ST.auto = false; markAuto(); }, (v) => v.toFixed(0) + "°"));
    syncs.push(P.range("cao", () => ST.pose.cao, (v) => (ST.pose.cao = v), (v) => (v < 0.9 ? "thấp" : v < 1.1 ? "vừa" : "cao")));
    syncs.push(P.range("depth", () => ST.depth, (v) => (ST.depth = v), (v) => v + " tầng", () => { train(); prog.done("grow"); }));
    syncs.push(P.range("minLeaf", () => ST.minLeaf, (v) => (ST.minLeaf = v), (v) => v + " mẫu", train));
    $("featBox").innerHTML = FEATS.map((F, j) => `<label class="tog"><input type="checkbox" data-j="${j}"><span>${F.name}</span></label>`).join("");
    $("featBox").querySelectorAll("input").forEach((el) => (el.onchange = () => { ST.use[+el.dataset.j] = el.checked; if (!ST.use.some(Boolean)) { ST.use[0] = true; } train(); syncFeat(); }));
    const opts = FEATS.map((F, j) => `<option value="${j}">${F.name}</option>`).join("");
    $("axX").innerHTML = opts; $("axY").innerHTML = opts;
    $("axX").onchange = (e) => { ST.ax = +e.target.value; regionImg = null; prog.done("regions"); }; $("axY").onchange = (e) => { ST.ay = +e.target.value; regionImg = null; prog.done("regions"); };
    $("btnRegrow").onclick = () => { ST.grow = 0; ST.grownAt = performance.now(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF, { use: DEF.use.slice() });
      if (k === "deep") { ST.depth = 12; ST.minLeaf = 1; ST.noise = 0.2; }
      if (k === "tall") { ST.tallOnly = true; ST.use = [true, true, false, true, true]; ST.pose.cao = 0.8; }
      if (k === "nofeat") { ST.use = [true, false, false, false, true]; }
      if (ST.src !== "sim") useSim();
      syncAll(); train(); prog.done("broke");
      $(k === "tall" ? "moi" : "tu-lam").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF, { use: DEF.use.slice() }); ST.pose.cao = 1; syncAll(); train(); };
    syncAll();
  }
  function syncFeat() { $("featBox").querySelectorAll("input").forEach((el) => (el.checked = ST.use[+el.dataset.j])); }
  function syncAll() { syncs.forEach((f) => f()); syncFeat(); $("axX").value = ST.ax; $("axY").value = ST.ay; regionImg = null; }
  function markAuto() { const b = $("btnAuto"); b.setAttribute("aria-pressed", ST.auto); b.classList.toggle("ghost", !ST.auto); }

  const QUIZ = [
    { q: "Cây quyết định đưa ra kết luận bằng cách nào?", o: ["Tính trung bình mọi đặc trưng", "Trả lời lần lượt các câu hỏi đúng/sai từ gốc xuống tới một lá", "Hỏi K hàng xóm", "Đoán ngẫu nhiên"], a: 1, e: "Mỗi nút là một câu hỏi kiểu \"góc lưng ≤ 17°?\". Trả lời xong thì đi xuống nhánh tương ứng cho tới lá." },
    { q: "Khi xây cây, máy chọn câu hỏi ở mỗi nút như thế nào?", o: ["Theo thứ tự bảng chữ cái", "Thử nhiều câu hỏi và chọn câu chia dữ liệu thành các nhóm ít lẫn lộn nhất (Gini nhỏ nhất)", "Hỏi người dùng", "Chọn ngẫu nhiên"], a: 1, e: "Câu hỏi tốt là câu tách được các nhãn khác nhau ra hai phía, để mỗi phía \"sạch\" hơn." },
    { q: "Cây sâu 12 tầng đạt 100% trên tập học nhưng thấp hơn hẳn trên tập kiểm tra. Đây là…", o: ["Cây rất giỏi", "Quá khớp: cây đã học thuộc cả những mẫu bị gắn nhãn nhầm", "Dữ liệu kiểm tra bị lỗi", "Cây quá nông"], a: 1, e: "Giới hạn độ sâu và số mẫu tối thiểu ở mỗi lá giúp cây học quy luật chung thay vì học vẹt." },
    { q: "Dữ liệu học chỉ lấy từ các bạn cao, và dùng khoảng cách mắt–tay tính bằng pixel. Điều gì xảy ra với bạn thấp ngồi đúng tư thế?", o: ["Luôn được chấm đúng", "Dễ bị máy cho là \"cúi sát\" vì mắt của bạn ấy vốn gần bàn hơn", "Máy từ chối chấm", "Không ảnh hưởng gì"], a: 1, e: "Dữ liệu thiếu đa dạng cộng với đặc trưng chưa chuẩn hóa tạo ra AI thiếu công bằng với những người khác dữ liệu học." },
    { q: "Ưu điểm lớn của cây quyết định so với nhiều mô hình khác là gì?", o: ["Luôn chính xác nhất", "Con người đọc và hiểu được luật mà máy học ra", "Không cần dữ liệu", "Chạy được không cần máy tính"], a: 1, e: "Ta có thể in cây ra thành code if-else và kiểm tra xem máy có học điều gì vô lý không. Đây là AI \"giải thích được\"." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;
    if (ST.src === "sim") {
      if (ST.auto) { ST.autoT += dt; const tg = POSES[Math.floor(ST.autoT / 3) % POSES.length]; ST.pose.lung += (tg.lung - ST.pose.lung) * Math.min(1, dt * 3); ST.pose.co += (tg.co - ST.pose.co) * Math.min(1, dt * 3); if (now - (ST.ls || 0) > 200) { ST.ls = now; syncs[0](); syncs[1](); } }
      ST.lm = sitter(ST.pose, 1.2);
    } else ST.lm = camFrame();
    if (ST.lm) { ST.f = features(ST.lm); ST.path = []; ST.pred = predict(ST.tree, ST.f, ST.path); ST.timeIn[ST.pred] += dt; }
    ST.grow = Math.min(99, Math.floor((now - ST.grownAt) / 450));
    renderStage();
    const tc = $("treeCanvas"), tx = tc.getContext("2d"); tx.clearRect(0, 0, tc.width, tc.height); drawTree(tx, tc.width, tc.height, false);
    if (soiVisible) renderSoi();
    if (now - slow > 160) { slow = now; renderBrain(); renderRegions(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); bind(); train(); P.srcButtons("sim"); markAuto();
  requestAnimationFrame(tick);
})();
