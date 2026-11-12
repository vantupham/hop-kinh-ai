/* Hộp Kính AI · Dự án 11 · Đọc chữ số viết tay (mạng nơ-ron 256 → H → 10, lan truyền ngược) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, G = DigitGen;
  const prog = P.progress("hka-11");
  const DEF = { H: 24, lr: 0.05, epochs: 15, act: "relu", norm: true, small: false };
  const ST = { ...DEF, net: null, train: [], test: [], hist: [], ep: 0, training: false, x: new Array(256).fill(0), out: null, selN: 0, demo: true, demoS: null, demoT: 0, drawn: 0, own: [] };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d");
  const PAD = { x: 24, y: 96, s: 280 };
  const pad = document.createElement("canvas"); pad.width = pad.height = 140; const pctx = pad.getContext("2d", { willReadFrequently: true });
  const g64 = document.createElement("canvas"); g64.width = g64.height = 64; const gctx = g64.getContext("2d", { willReadFrequently: true });

  // ---------- mạng nơ-ron ----------
  const ACT = {
    relu: { f: (z) => (z > 0 ? z : 0), d: (z) => (z > 0 ? 1 : 0), name: "ReLU" },
    sigmoid: { f: (z) => 1 / (1 + Math.exp(-z)), d: (z) => { const s = 1 / (1 + Math.exp(-z)); return s * (1 - s); }, name: "Sigmoid" },
    linear: { f: (z) => z, d: () => 1, name: "Không có (tuyến tính)" }
  };
  function makeNet(H) {
    const r = P.rng(42), n = (k) => (r() * 2 - 1) * Math.sqrt(6 / k);
    return { H, W1: Array.from({ length: H }, () => Float64Array.from({ length: 256 }, () => n(256 + H))), b1: new Float64Array(H), W2: Array.from({ length: 10 }, () => Float64Array.from({ length: H }, () => n(H + 10))), b2: new Float64Array(10) };
  }
  function forward(net, x) {
    const A = ACT[ST.act], z1 = new Float64Array(net.H), a1 = new Float64Array(net.H), z2 = new Float64Array(10);
    for (let h = 0; h < net.H; h++) { let s = net.b1[h]; const w = net.W1[h]; for (let i = 0; i < 256; i++) s += w[i] * x[i]; z1[h] = s; a1[h] = A.f(s); }
    for (let k = 0; k < 10; k++) { let s = net.b2[k]; const w = net.W2[k]; for (let h = 0; h < net.H; h++) s += w[h] * a1[h]; z2[k] = s; }
    const mx = Math.max(...z2), e = Array.from(z2, (v) => Math.exp(v - mx)), sum = e.reduce((a, b) => a + b, 0);
    return { z1, a1, z2, p: e.map((v) => v / sum) };
  }
  function backward(net, x, y, lr) {
    const o = forward(net, x), A = ACT[ST.act], d2 = o.p.map((v, k) => v - (k === y ? 1 : 0)), d1 = new Float64Array(net.H);
    for (let h = 0; h < net.H; h++) { let s = 0; for (let k = 0; k < 10; k++) s += net.W2[k][h] * d2[k]; d1[h] = s * A.d(o.z1[h]); }
    for (let k = 0; k < 10; k++) { const w = net.W2[k]; for (let h = 0; h < net.H; h++) w[h] -= lr * d2[k] * o.a1[h]; net.b2[k] -= lr * d2[k]; }
    for (let h = 0; h < net.H; h++) { if (d1[h] === 0) continue; const w = net.W1[h], g = lr * d1[h]; for (let i = 0; i < 256; i++) if (x[i]) w[i] -= g * x[i]; net.b1[h] -= g; }
    return -Math.log(Math.max(1e-9, o.p[y]));
  }
  const evalSet = (set) => { let loss = 0, ok = 0; for (const s of set) { const o = forward(ST.net, s.x); loss -= Math.log(Math.max(1e-9, o.p[s.y])); if (P.argmax(o.p) === s.y) ok++; } return { loss: loss / set.length, acc: ok / set.length }; };

  // ---------- dữ liệu ----------
  function vecOf(s, small, rnd) {
    if (!small) { G.draw(gctx, 64, s); return G.toVector(g64, ST.norm); }
    gctx.fillStyle = "#000"; gctx.fillRect(0, 0, 64, 64); const t = document.createElement("canvas"); t.width = t.height = 64; G.draw(t.getContext("2d"), 64, s);
    const sc = 0.45, ox = (rnd || Math.random)() < 0.5 ? 2 : 64 - 64 * sc - 2, oy = (rnd || Math.random)() < 0.5 ? 2 : 64 - 64 * sc - 2; gctx.drawImage(t, ox, oy, 64 * sc, 64 * sc);
    return G.toVector(g64, ST.norm);
  }
  function buildData() {
    const r = P.rng(3), rt = P.rng(77); ST.train = []; ST.test = [];
    for (let d = 0; d < 10; d++) { for (let i = 0; i < 60; i++) { const s = G.sample(d, r); ST.train.push({ x: vecOf(s), y: d }); } for (let i = 0; i < 20; i++) { const s = G.sample(d, rt); ST.test.push({ x: vecOf(s, ST.small, rt), y: d, s }); } }
    ST.train.push(...ST.own);
  }
  function startTrain() { ST.net = makeNet(ST.H); ST.hist = []; ST.ep = 0; ST.training = true; ST.order = []; ST.pos = 0; record(); }
  function record() { const tr = evalSet(ST.train), te = evalSet(ST.test); ST.hist.push({ ep: ST.ep, lossTr: tr.loss, lossTe: te.loss, accTr: tr.acc, accTe: te.acc }); }
  function trainStep(budget) {
    if (!ST.training) return;
    let n = 0;
    while (n < budget && ST.training) {
      if (ST.pos >= ST.order.length) { if (ST.order.length) { ST.ep++; record(); if (ST.ep >= ST.epochs) { ST.training = false; afterTrain(); break; } } ST.order = ST.train.map((_, i) => i).sort(() => Math.random() - 0.5); ST.pos = 0; }
      const s = ST.train[ST.order[ST.pos++]]; const l = backward(ST.net, s.x, s.y, ST.lr); n++;
      if (!isFinite(l)) { ST.training = false; record(); afterTrain(); break; }
    }
  }
  function afterTrain() {
    const M = Array.from({ length: 10 }, () => new Array(10).fill(0)); ST.test.forEach((s) => M[s.y][P.argmax(forward(ST.net, s.x).p)]++);
    $("confOut").innerHTML = P.confusion([...Array(10).keys()].map(String), Array(10).fill("#c3c7f0"), M);
    $("nParams").textContent = (256 * ST.H + ST.H + ST.H * 10 + 10).toLocaleString("vi-VN"); renderWeights(); genCode();
  }

  // ---------- bảng vẽ ----------
  function clearPad() { pctx.fillStyle = "#000"; pctx.fillRect(0, 0, 140, 140); }
  function padPos(e) { const r = stage.getBoundingClientRect(), x = (e.clientX - r.left) * 640 / r.width, y = (e.clientY - r.top) * 480 / r.height; return { x: (x - PAD.x) / PAD.s * 140, y: (y - PAD.y) / PAD.s * 140, inPad: x >= PAD.x && x <= PAD.x + PAD.s && y >= PAD.y && y <= PAD.y + PAD.s, sx: x, sy: y }; }
  let drawing = false, lastP = null;
  function bindPad() {
    stage.addEventListener("pointerdown", (e) => {
      const p = padPos(e);
      if (!p.inPad) { // bấm chọn một nơ-ron ẩn
        const H = ST.net.H; for (let h = 0; h < H; h++) { const y = nY(h, H); if (Math.hypot(p.sx - 470, p.sy - y) < 12) { ST.selN = h; prog.done("neuron"); } }
        return;
      }
      if (ST.demo) { ST.demo = false; markDemo(); clearPad(); }
      drawing = true; lastP = p; stage.setPointerCapture(e.pointerId);
    });
    stage.addEventListener("pointermove", (e) => { if (!drawing) return; const p = padPos(e); pctx.strokeStyle = "#fff"; pctx.lineWidth = 11; pctx.lineCap = "round"; pctx.beginPath(); pctx.moveTo(lastP.x, lastP.y); pctx.lineTo(p.x, p.y); pctx.stroke(); lastP = p; });
    const up = () => { if (drawing) { ST.drawn++; if (ST.drawn >= 3) prog.done("draw"); } drawing = false; };
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
  }

  // ---------- vẽ sân khấu ----------
  const nY = (h, H) => 70 + (h + 0.5) * Math.min(26, 380 / H) + (380 - H * Math.min(26, 380 / H)) / 2;
  const oY = (k) => 70 + k * 38 + 19;
  function heat(ctx, x0, y0, cell, v, signed) { for (let i = 0; i < 256; i++) { const a = v[i]; ctx.fillStyle = signed ? (a > 0 ? `rgba(255,125,95,${Math.min(1, a)})` : `rgba(84,140,255,${Math.min(1, -a)})`) : `rgb(${a * 255 | 0},${a * 255 | 0},${a * 255 | 0})`; ctx.fillRect(x0 + (i % 16) * cell, y0 + Math.floor(i / 16) * cell, cell, cell); } }
  function renderStage() {
    const ctx = sctx, TH = P.TH; ctx.fillStyle = TH.dark ? "#121633" : "#f6f4ee"; ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = "#000"; D.rr(ctx, PAD.x - 4, PAD.y - 4, PAD.s + 8, PAD.s + 8, 14); ctx.fill(); ctx.drawImage(pad, PAD.x, PAD.y, PAD.s, PAD.s);
    ctx.strokeStyle = "#5443ff"; ctx.lineWidth = 2; ctx.setLineDash([6, 6]); ctx.strokeRect(PAD.x + 30, PAD.y + 30, PAD.s - 60, PAD.s - 60); ctx.setLineDash([]);
    ctx.fillStyle = TH.text; ctx.font = "600 12px Be Vietnam Pro, sans-serif"; ctx.fillText(ST.demo ? "Máy đang tự viết mẫu… bấm vào để tự vẽ" : "Vẽ một chữ số (0–9) vào ô đen", PAD.x, PAD.y + PAD.s + 26);
    // mạng
    const net = ST.net, o = ST.out; if (!net || !o) return;
    heat(ctx, 320, 205, 4.5, ST.x); ctx.strokeStyle = TH.grid; ctx.strokeRect(320, 205, 72, 72);
    ctx.fillStyle = TH.text; ctx.font = "600 10px JetBrains Mono, monospace"; ctx.fillText("16×16 = 256", 322, 296);
    const H = net.H, mxA = Math.max(1e-6, ...o.a1);
    for (let h = 0; h < H; h++) { const a = o.a1[h] / mxA; ctx.strokeStyle = `rgba(94,242,214,${0.05 + a * 0.5})`; ctx.lineWidth = 0.5 + a * 1.5; ctx.beginPath(); ctx.moveTo(392, 241); ctx.lineTo(462, nY(h, H)); ctx.stroke(); }
    const kTop = P.argmax(o.p);
    for (let k = 0; k < 10; k++) for (let h = 0; h < H; h++) { const c = net.W2[k][h] * o.a1[h]; if (Math.abs(c) < 0.25 * mxA) continue; ctx.strokeStyle = c > 0 ? `rgba(255,125,95,${Math.min(0.85, Math.abs(c) / 3) * (k === kTop ? 1 : 0.35)})` : `rgba(84,140,255,${Math.min(0.6, Math.abs(c) / 3) * (k === kTop ? 1 : 0.35)})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(478, nY(h, H)); ctx.lineTo(552, oY(k)); ctx.stroke(); }
    for (let h = 0; h < H; h++) { const a = o.a1[h] / mxA, y = nY(h, H), r = Math.min(9, 180 / H); ctx.fillStyle = `rgba(94,242,214,${0.12 + a * 0.88})`; ctx.beginPath(); ctx.arc(470, y, r, 0, 7); ctx.fill(); if (h === ST.selN) { ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2.5; ctx.stroke(); } }
    for (let k = 0; k < 10; k++) { const y = oY(k), p = o.p[k]; ctx.fillStyle = `rgba(145,132,255,${0.15 + p * 0.85})`; ctx.beginPath(); ctx.arc(560, y, 13, 0, 7); ctx.fill(); if (k === kTop) { ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.stroke(); } ctx.fillStyle = "#fff"; ctx.font = "800 13px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText(k, 560, y + 5); ctx.textAlign = "left"; ctx.fillStyle = TH.violet; ctx.fillRect(580, y - 5, p * 52, 10); }
    ctx.fillStyle = TH.text; ctx.font = "600 11px Be Vietnam Pro"; ctx.fillText("đầu vào", 330, 190); ctx.fillText(`${H} nơ-ron ẩn`, 440, 56); ctx.fillText("10 đầu ra", 540, 56);
    ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, PAD.x, 18, 280, 58, 14); ctx.fill();
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono"; ctx.fillText("AI ĐỌC ĐƯỢC", PAD.x + 14, 38);
    const empty = ST.x.every((v) => v < 0.05);
    ctx.fillStyle = "#5ef2d6"; ctx.font = "800 26px JetBrains Mono"; ctx.fillText(empty ? "—" : `${kTop}`, PAD.x + 14, 66); if (!empty) { ctx.fillStyle = "#c3c7f0"; ctx.font = "700 14px JetBrains Mono"; ctx.fillText(`${Math.round(o.p[kTop] * 100)}% chắc chắn`, PAD.x + 50, 64); }
  }
  // ---------- SOI ----------
  const SOI = [
    { t: "256 con số", e: "image", d: "Nét vẽ được cắt khung, phóng vừa và đặt giữa một lưới <b>16 × 16</b>. Mỗi ô là một con số từ 0 (đen) tới 1 (trắng): đó là đầu vào của mạng." },
    { t: "Một nơ-ron", e: "cpu", d: "Mỗi nơ-ron ẩn có <b>256 trọng số</b> (đỏ = thích, xanh = ghét). Nhân từng ô của ảnh với trọng số tương ứng rồi cộng lại. Bấm vào một chấm ở cột giữa trong phần Mồi để chọn nơ-ron khác." },
    { t: "Hàm kích hoạt", e: "angle", d: "Tổng vừa tính đi qua <b>hàm kích hoạt</b>. Với ReLU, số âm thành 0 (nơ-ron \"tắt\"), số dương giữ nguyên (nơ-ron \"sáng\"). Chính chỗ \"bẻ cong\" này giúp mạng học được những điều phức tạp." },
    { t: "Lớp ẩn", e: "layers", d: "Mỗi nơ-ron ẩn tự học để phát hiện một <b>nét</b> nào đó: vòng tròn trên, nét dọc bên phải, nét ngang dưới… Đây là các đặc trưng <b>máy tự học</b>, không ai dạy." },
    { t: "Lớp ra", e: "chart", d: "Mười nơ-ron đầu ra (0 tới 9) lại tính tổng có trọng số từ lớp ẩn, rồi <b>softmax</b> biến thành xác suất. Chữ số có xác suất cao nhất là câu trả lời." },
    { t: "Học: lan truyền ngược", e: "repeat", d: "Khi biết đáp án đúng, ta tính <b>sai số</b> ở đầu ra, rồi truyền ngược về lớp ẩn để biết mỗi trọng số cần tăng hay giảm. Đây vẫn là gradient descent của Dự án 7, chỉ là với hàng nghìn trọng số." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 1) prog.done("neuron"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const s = pipe.get(), ctx = octx, net = ST.net, o = ST.out; D.labBg(ctx); if (!net || !o) return;
    const h = ST.selN, w = Array.from(net.W1[h]), mw = Math.max(...w.map(Math.abs)) || 1;
    if (s === 0) { heat(ctx, 112, 32, 26, ST.x); ctx.font = "9px JetBrains Mono"; ctx.fillStyle = "#ffc34d"; for (let i = 0; i < 256; i += 1) if (ST.x[i] > 0.05) ctx.fillText(ST.x[i].toFixed(1), 112 + (i % 16) * 26 + 3, 32 + Math.floor(i / 16) * 26 + 16); return; }
    if (s === 1) {
      heat(ctx, 30, 120, 11, ST.x); heat(ctx, 236, 120, 11, w.map((v) => v / mw), true); heat(ctx, 442, 120, 11, w.map((v, i) => v * ST.x[i] / mw * 3), true);
      ctx.fillStyle = "#fff"; ctx.font = "800 26px Be Vietnam Pro"; ctx.fillText("×", 208, 216); ctx.fillText("=", 414, 216);
      ctx.font = "700 13px Be Vietnam Pro"; ctx.fillStyle = "#c3c7f0"; ctx.fillText("ảnh vào", 70, 106); ctx.fillText(`trọng số nơ-ron #${h + 1}`, 250, 106); ctx.fillText("đóng góp", 486, 106);
      D.pill(ctx, `tổng + b = z = ${o.z1[h].toFixed(2)}`, 320, 380, "#5443ff", 15); return;
    }
    if (s === 2) {
      const A = ACT[ST.act], X = (z) => 320 + z * 60, Y = (a) => 300 - a * 60;
      ctx.strokeStyle = "#2f3580"; ctx.beginPath(); ctx.moveTo(40, 300); ctx.lineTo(600, 300); ctx.moveTo(320, 40); ctx.lineTo(320, 440); ctx.stroke();
      ctx.strokeStyle = "#9184ff"; ctx.lineWidth = 3; ctx.beginPath(); for (let z = -4.6; z <= 4.6; z += 0.05) { const y = Y(Math.max(-2.5, Math.min(4, A.f(z)))); z === -4.6 ? ctx.moveTo(X(z), y) : ctx.lineTo(X(z), y); } ctx.stroke();
      const z = Math.max(-4.5, Math.min(4.5, o.z1[h])), a = A.f(z); ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(X(z), Y(Math.min(4, a)), 9, 0, 7); ctx.fill();
      D.pill(ctx, `${A.name}: z = ${o.z1[h].toFixed(2)} → ${o.a1[h].toFixed(2)}`, 320, 40, "#5443ff", 14); return;
    }
    if (s === 3) {
      const H = net.H, cols = Math.ceil(Math.sqrt(H * 1.4)), cell = Math.min(3.4, 560 / cols / 17), mxA = Math.max(1e-6, ...o.a1);
      for (let k = 0; k < H; k++) { const x0 = 30 + (k % cols) * (cell * 17 + 6), y0 = 30 + Math.floor(k / cols) * (cell * 17 + 20), wk = Array.from(net.W1[k]), m = Math.max(...wk.map(Math.abs)) || 1; heat(ctx, x0, y0, cell, wk.map((v) => v / m), true); ctx.fillStyle = "#5ef2d6"; ctx.fillRect(x0, y0 + cell * 16 + 3, cell * 16 * o.a1[k] / mxA, 5); if (k === ST.selN) { ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.strokeRect(x0 - 2, y0 - 2, cell * 16 + 4, cell * 16 + 4); } }
      return;
    }
    if (s === 4) { for (let k = 0; k < 10; k++) { const x = 30 + k * 60, hh = o.p[k] * 300; ctx.fillStyle = "#232866"; ctx.fillRect(x, 80, 44, 300); ctx.fillStyle = "#9184ff"; ctx.fillRect(x, 380 - hh, 44, hh); ctx.fillStyle = "#fff"; ctx.font = "800 18px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText(k, x + 22, 410); ctx.font = "11px JetBrains Mono"; ctx.fillText(o.z2[k].toFixed(1), x + 22, 432); ctx.fillText(Math.round(o.p[k] * 100) + "%", x + 22, 70); ctx.textAlign = "left"; } ctx.fillStyle = "#8f96d4"; ctx.fillText("điểm (trước softmax)", 30, 455); return; }
    const y = ST.demo && ST.demoS ? ST.demoS.d : P.argmax(o.p), d2 = o.p.map((v, k) => v - (k === y ? 1 : 0)), A = ACT[ST.act];
    const d1 = Array.from({ length: net.H }, (_, hh) => { let t = 0; for (let k = 0; k < 10; k++) t += net.W2[k][hh] * d2[k]; return t * A.d(o.z1[hh]); }), m1 = Math.max(1e-6, ...d1.map(Math.abs));
    ctx.fillStyle = "#c3c7f0"; ctx.font = "700 13px Be Vietnam Pro"; ctx.fillText(`Đáp án ${ST.demo ? "" : "(giả sử) "}là ${y}. Sai số đầu ra = xác suất − đáp án:`, 30, 40);
    for (let k = 0; k < 10; k++) { const x = 30 + k * 60, v = d2[k]; ctx.fillStyle = v < 0 ? "#3ee9cf" : "#ff7d5f"; ctx.fillRect(x, 140, 44, -v * 80); ctx.fillStyle = "#fff"; ctx.font = "700 13px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText(k, x + 22, 170); ctx.textAlign = "left"; }
    ctx.fillStyle = "#c3c7f0"; ctx.font = "700 13px Be Vietnam Pro"; ctx.fillText("↓ truyền ngược về lớp ẩn: mỗi nơ-ron nên đổi bao nhiêu", 30, 220);
    d1.forEach((v, k) => { const x = 30 + k * (580 / net.H); ctx.fillStyle = v < 0 ? "#3ee9cf" : "#ff7d5f"; ctx.fillRect(x, 330, Math.max(2, 580 / net.H - 3), -v / m1 * 80); });
    D.pill(ctx, `trọng số mới = trọng số − ${ST.lr} × sai số × đầu vào`, 320, 440, "#5443ff", 13);
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"), o = ST.out, net = ST.net; if (!o) return; const h = ST.selN;
    if (s === 0) el.innerHTML = `Số ô sáng (> 0,5): <span class="hl">${ST.x.filter((v) => v > 0.5).length}</span> / 256\nCăn giữa & phóng vừa: <span class="w">${ST.norm ? "BẬT" : "TẮT"}</span>`;
    else if (s === 1 || s === 2) el.innerHTML = `Nơ-ron #${h + 1}: z = Σ(ô × trọng số) + b\n   = <span class="w">${o.z1[h].toFixed(3)}</span>\n${ACT[ST.act].name}(z) = <span class="hl">${o.a1[h].toFixed(3)}</span> ${o.a1[h] > 0.01 ? "(sáng)" : "(tắt)"}`;
    else if (s === 3) el.innerHTML = `Nơ-ron đang sáng: <span class="hl">${Array.from(o.a1).filter((a) => a > 0.01).length}</span> / ${net.H}\nỞ đây mỗi ô vuông là \"mẫu\" mà một nơ-ron thích`;
    else if (s === 4) el.innerHTML = [...Array(10).keys()].sort((a, b) => o.p[b] - o.p[a]).slice(0, 3).map((k) => `chữ ${k}: <span class="hl">${(o.p[k] * 100).toFixed(1)}%</span>`).join("\n");
    else el.innerHTML = `Số trọng số cần chỉnh: <span class="hl">${(256 * net.H + net.H * 10).toLocaleString("vi-VN")}</span>\nTốc độ học: <span class="w">${ST.lr}</span>`;
  }

  // ---------- bảng não, biểu đồ, trọng số, code ----------
  function renderBrain() {
    const o = ST.out; if (!o) return; const k = P.argmax(o.p), empty = ST.x.every((v) => v < 0.05);
    $("bResult").innerHTML = `<small>AI ĐỌC ĐƯỢC</small><span style="color:#5ef2d6">${empty ? "—" : k}</span>`;
    $("bProbs").innerHTML = [...Array(10).keys()].map((d) => `<div class="r"><span>chữ ${d}</span><span class="bar"><i style="width:${empty ? 0 : o.p[d] * 100}%;background:#9184ff"></i></span><span>${empty ? 0 : Math.round(o.p[d] * 100)}%</span></div>`).join("");
    const h = ST.hist[ST.hist.length - 1]; $("bTest").textContent = h ? Math.round(h.accTe * 100) + "%" : "—";
    $("trainStatus").textContent = ST.training ? `Đang học… vòng ${ST.ep}/${ST.epochs}` : `Đã học xong ${ST.ep} vòng`;
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, L = 46, R = 14, T = 14, B = 28, TH = P.TH;
    ctx.clearRect(0, 0, W, H); const E = Math.max(ST.epochs, 1), X = (e) => L + e / E * (W - L - R), Y = (v) => T + (1 - v) * (H - T - B);
    ctx.font = "11px JetBrains Mono, monospace";
    for (const v of [0, 0.25, 0.5, 0.75, 1]) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(v * 100) + "%", 6, Y(v) + 4); }
    ctx.fillText("vòng 0", L, H - 8); ctx.fillText("vòng " + E, W - R - 60, H - 8);
    const h = ST.hist, line = (k, c, w) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); h.forEach((q, i) => (i ? ctx.lineTo(X(q.ep), Y(q[k])) : ctx.moveTo(X(q.ep), Y(q[k])))); ctx.stroke(); };
    line("accTr", TH.violet, 3); line("accTe", TH.mint, 3);
    const l = h[h.length - 1]; if (l) { ctx.font = "700 13px JetBrains Mono"; ctx.fillStyle = TH.violet; ctx.fillText(`học: ${Math.round(l.accTr * 100)}%`, W - 200, 34); ctx.fillStyle = TH.mint; ctx.fillText(`kiểm tra: ${Math.round(l.accTe * 100)}%`, W - 200, 54); }
  }
  function renderWeights() {
    const cv = $("weights"), ctx = cv.getContext("2d"), net = ST.net; ctx.clearRect(0, 0, cv.width, cv.height);
    const H = net.H, cols = 8, cell = 4.6, rows = Math.ceil(H / cols);
    cv.height = rows * 92 + 8;
    for (let k = 0; k < H; k++) { const wk = Array.from(net.W1[k]), m = Math.max(...wk.map(Math.abs)) || 1, x0 = 8 + (k % cols) * 84, y0 = 6 + Math.floor(k / cols) * 92; heat(ctx, x0, y0, cell, wk.map((v) => v / m), true); ctx.fillStyle = P.TH.text; ctx.font = "11px JetBrains Mono"; ctx.fillText("#" + (k + 1), x0, y0 + 88); }
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${c("// Lan truyền xuôi: 256 → " + ST.H + " → 10")}
${k("for")} (h = ${n(0)}; h &lt; ${n(ST.H)}; h++) z1[h] = b1[h] + Σ W1[h][i] * x[i];
a1 = z1.map(${ST.act === "relu" ? "z => Math.max(0, z)" : ST.act === "sigmoid" ? "z => 1 / (1 + Math.exp(-z))" : "z => z"});   ${c("// " + ACT[ST.act].name)}
${k("for")} (k = ${n(0)}; k &lt; ${n(10)}; k++) z2[k] = b2[k] + Σ W2[k][h] * a1[h];
p = softmax(z2);
${c("// Lan truyền ngược với đáp án y")}
d2 = p - motNong(y);                                  ${c("// sai số đầu ra")}
d1[h] = (Σ W2[k][h] * d2[k]) * daoHamKichHoat(z1[h]);  ${c("// sai số lớp ẩn")}
W2[k][h] -= ${n(ST.lr)} * d2[k] * a1[h];
W1[h][i] -= ${n(ST.lr)} * d1[h] * x[i];`;
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function markDemo() { const b = $("btnDemo"); b.setAttribute("aria-pressed", ST.demo); b.classList.toggle("ghost", !ST.demo); }
  function markAct() { $("actBtns").querySelectorAll("button").forEach((b) => { const on = b.dataset.a === ST.act; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  function retrain() { buildData(); startTrain(); }
  function bind() {
    bindPad();
    $("btnClear").onclick = () => { ST.demo = false; markDemo(); clearPad(); };
    $("btnDemo").onclick = () => { ST.demo = !ST.demo; ST.demoT = 99; markDemo(); };
    syncs.push(P.range("H", () => ST.H, (v) => (ST.H = v), (v) => v + " nơ-ron"));
    syncs.push(P.range("lr", () => ST.lr, (v) => (ST.lr = v), (v) => v.toFixed(3), genCode));
    syncs.push(P.range("epochs", () => ST.epochs, (v) => (ST.epochs = v), (v) => v + " vòng"));
    $("actBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.act = b.dataset.a; markAct(); genCode(); }));
    $("norm").onchange = (e) => { ST.norm = e.target.checked; };
    $("btnTrain").onclick = () => { ST.selN = 0; retrain(); prog.done("train"); };
    $("labelBtns").innerHTML = [...Array(10).keys()].map((d) => `<button class="btn small ghost" data-d="${d}">${d}</button>`).join("");
    $("labelBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { if (ST.x.every((v) => v < 0.05)) return; ST.own.push({ x: ST.x.slice(), y: +b.dataset.d }); $("ownInfo").textContent = `Đã thêm ${ST.own.length} chữ số của em vào dữ liệu học. Bấm Huấn luyện để máy học lại.`; clearPad(); }));
    const sync = () => { syncs.forEach((f) => f()); markAct(); $("norm").checked = ST.norm; genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); ST.selN = 0;
      if (k === "tiny") ST.H = 2;
      if (k === "lr") ST.lr = 2.5;
      if (k === "small") { ST.small = true; ST.norm = false; }
      sync(); retrain(); ST.demo = true; ST.demoT = 99; markDemo(); prog.done("broke");
      $(k === "small" ? "moi" : "tu-lam").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); ST.selN = 0; sync(); retrain(); };
    sync();
  }

  const QUIZ = [
    { q: "Một nơ-ron nhân tạo làm phép tính gì?", o: ["Đếm số điểm ảnh trắng", "Nhân mỗi đầu vào với một trọng số, cộng tất cả lại, rồi cho qua hàm kích hoạt", "Tra từ điển", "Chọn ngẫu nhiên một số"], a: 1, e: "Tổng có trọng số + hàm kích hoạt. Hàng nghìn phép tính đơn giản như vậy ghép lại thành một mạng." },
    { q: "Vì sao cần hàm kích hoạt như ReLU?", o: ["Để mạng chạy nhanh hơn", "Để mạng học được những quan hệ \"cong\", phức tạp; không có nó, nhiều lớp cũng chỉ bằng một lớp", "Để đổi màu ảnh", "Không cần thiết"], a: 1, e: "Ghép nhiều phép tính tuyến tính vẫn ra một phép tính tuyến tính. Hàm kích hoạt tạo ra chỗ \"bẻ cong\"." },
    { q: "Các ô vuông đỏ/xanh của từng nơ-ron ẩn cho thấy điều gì?", o: ["Ảnh gốc", "Mẫu nét mà nơ-ron đó \"thích\" (đỏ) hoặc \"ghét\" (xanh), do máy tự học ra", "Màu nền", "Lỗi của mạng"], a: 1, e: "Không ai dạy nơ-ron nào phát hiện nét nào. Chúng tự hình thành trong quá trình học." },
    { q: "Lan truyền ngược (backpropagation) dùng để…", o: ["Vẽ chữ số", "Tính xem mỗi trọng số cần thay đổi bao nhiêu để giảm sai số, từ lớp ra lùi về lớp vào", "Xóa dữ liệu", "Tăng số nơ-ron"], a: 1, e: "Đây là gradient descent (Dự án 7) áp dụng cho rất nhiều trọng số, nhờ quy tắc đạo hàm của hàm hợp." },
    { q: "Máy học từ chữ số được căn giữa. Em viết số rất nhỏ ở góc và tắt bước căn giữa. Chuyện gì xảy ra?", o: ["Vẫn đọc đúng", "Dễ đọc sai vì ảnh đầu vào khác hẳn những gì mạng đã thấy", "Mạng tự căn giữa", "Mạng dừng lại"], a: 1, e: "Mạng nhiều lớp đơn giản này không tự hiểu \"dịch chuyển\". Tiền xử lý (hoặc mạng tích chập ở Dự án 14) giúp giải quyết điều đó." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;
    trainStep(200);
    if (ST.demo) {
      ST.demoT += dt;
      if (ST.demoT > 2.8 || !ST.demoS) { const t = ST.test[Math.floor(Math.random() * ST.test.length)]; ST.demoS = t.s; ST.demoT = 0; }
      const prog2 = Math.min(1, ST.demoT / 1.1);
      if (ST.small) { const t = document.createElement("canvas"); t.width = t.height = 140; G.draw(t.getContext("2d"), 140, ST.demoS, prog2); clearPad(); pctx.drawImage(t, 6, 6, 60, 60); }
      else G.draw(pctx, 140, ST.demoS, prog2);
    }
    ST.x = G.toVector(pad, ST.norm); if (ST.net) ST.out = forward(ST.net, ST.x);
    renderStage();
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; renderBrain(); renderChart(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); clearPad(); bind(); buildData(); startTrain(); while (ST.training) trainStep(1e9);
  requestAnimationFrame(tick);
})();
