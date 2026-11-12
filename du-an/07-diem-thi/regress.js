/* Hộp Kính AI · Dự án 07 · Dự đoán điểm thi (hồi quy tuyến tính, MSE, gradient descent) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-07");
  const W = 640, H = 480, L = 62, R = 22, Tp = 24, B = 52;
  const WR = [-0.4, 1.0], BR = [-2, 8];
  const ST = { data: [], w: 0.05, b: 6.5, lr: 0.004, running: false, path: [], lossHist: [], step: 0, edit: false, predX: 10, squares: true, drag: null, exploded: false, best: null };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), surf = $("surface"), fctx = surf.getContext("2d");

  function makeData(seed) {
    const r = P.rng(seed || 3), out = [];
    for (let i = 0; i < 30; i++) { const x = 1 + r() * 18, n = (r() + r() + r() - 1.5) * 1.6; out.push({ x, y: Math.max(0.5, Math.min(10, 3 + 0.31 * x + n)) }); }
    return out;
  }
  const mse = (w, b, d) => (d || ST.data).reduce((s, p) => s + (w * p.x + b - p.y) ** 2, 0) / (d || ST.data).length;
  function grad(w, b) { let gw = 0, gb = 0; const n = ST.data.length; for (const p of ST.data) { const e = w * p.x + b - p.y; gw += 2 * e * p.x / n; gb += 2 * e / n; } return [gw, gb]; }
  function bestFit() { const n = ST.data.length, mx = ST.data.reduce((s, p) => s + p.x, 0) / n, my = ST.data.reduce((s, p) => s + p.y, 0) / n; let sxy = 0, sxx = 0; for (const p of ST.data) { sxy += (p.x - mx) * (p.y - my); sxx += (p.x - mx) ** 2; } const w = sxy / (sxx || 1); return { w, b: my - w * mx }; }
  function dataChanged() { ST.best = bestFit(); surfImg = null; ST.path = [[ST.w, ST.b]]; }

  // ---------- trục toạ độ ----------
  function axes() { const xm = Math.max(20, ST.predX + 2), ym = Math.max(10, ST.w * ST.predX + ST.b + 1); return { xm, ym, X: (x) => L + x / xm * (W - L - R), Y: (y) => H - B - y / ym * (H - Tp - B), ix: (px) => (px - L) / (W - L - R) * xm, iy: (py) => (H - B - py) / (H - Tp - B) * ym }; }
  function drawPlot(ctx, o) {
    o = o || {}; const A = axes(), TH = P.TH, dark = o.lab || TH.dark;
    ctx.fillStyle = dark ? "#121633" : "#fbfaf6"; ctx.fillRect(0, 0, W, H);
    ctx.font = "11px JetBrains Mono, monospace"; ctx.lineWidth = 1;
    for (let x = 0; x <= A.xm; x += A.xm > 30 ? 10 : 2) { ctx.strokeStyle = dark ? "#20255a" : "#ebe7dc"; ctx.beginPath(); ctx.moveTo(A.X(x), Tp); ctx.lineTo(A.X(x), H - B); ctx.stroke(); ctx.fillStyle = dark ? "#8f96d4" : "#6a6f96"; ctx.fillText(x, A.X(x) - 6, H - B + 16); }
    for (let y = 0; y <= A.ym; y += A.ym > 15 ? 5 : 1) { ctx.strokeStyle = dark ? "#20255a" : "#ebe7dc"; ctx.beginPath(); ctx.moveTo(L, A.Y(y)); ctx.lineTo(W - R, A.Y(y)); ctx.stroke(); ctx.fillStyle = dark ? "#8f96d4" : "#6a6f96"; ctx.fillText(y, L - 22, A.Y(y) + 4); }
    if (A.ym > 10) { ctx.fillStyle = "rgba(255,90,60,.12)"; ctx.fillRect(L, Tp, W - L - R, A.Y(10) - Tp); ctx.fillStyle = "#e2502f"; ctx.font = "700 12px Be Vietnam Pro"; ctx.fillText("Vùng không thể: điểm > 10", L + 8, Tp + 18); }
    if (A.xm > 20) { ctx.fillStyle = "rgba(255,195,77,.12)"; ctx.fillRect(A.X(20), Tp, W - R - A.X(20), H - B - Tp); ctx.fillStyle = "#b07800"; ctx.font = "700 12px Be Vietnam Pro"; ctx.fillText("ngoài vùng dữ liệu", A.X(20) + 6, H - B - 8); }
    ctx.fillStyle = dark ? "#c3c7f0" : "#383d66"; ctx.font = "700 13px Be Vietnam Pro, sans-serif"; ctx.fillText("Giờ tự học mỗi tuần →", W - 190, H - 12);
    ctx.save(); ctx.translate(16, Tp + 150); ctx.rotate(-Math.PI / 2); ctx.fillText("Điểm thi →", 0, 0); ctx.restore();
    const w = o.w != null ? o.w : ST.w, b = o.b != null ? o.b : ST.b;
    // sai số
    for (const p of ST.data) {
      const yh = w * p.x + b, x = A.X(p.x), y1 = A.Y(p.y), y2 = A.Y(yh), e = Math.abs(y2 - y1);
      if (o.squares && ST.squares) { ctx.fillStyle = "rgba(255,125,95,.13)"; ctx.strokeStyle = "rgba(255,125,95,.45)"; ctx.fillRect(x, Math.min(y1, y2), e, e); ctx.strokeRect(x, Math.min(y1, y2), e, e); }
      if (o.resid !== false) { ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y1); ctx.lineTo(x, y2); ctx.stroke(); }
    }
    for (const p of ST.data) { ctx.fillStyle = p.out ? "#ffc34d" : (dark ? "#3ee9cf" : "#009e88"); ctx.beginPath(); ctx.arc(A.X(p.x), A.Y(p.y), p.out ? 7 : 5.5, 0, 7); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke(); }
    if (o.line !== false) {
      ctx.strokeStyle = dark ? "#9184ff" : "#5443ff"; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(A.X(0), A.Y(b)); ctx.lineTo(A.X(A.xm), A.Y(w * A.xm + b)); ctx.stroke();
      if (o.handles) for (const hx of [2, 18]) { const hy = w * hx + b; ctx.fillStyle = "#fff"; ctx.strokeStyle = dark ? "#9184ff" : "#5443ff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(A.X(hx), A.Y(hy), 9, 0, 7); ctx.fill(); ctx.stroke(); }
    }
    return A;
  }
  function renderStage() {
    const ctx = sctx, A = drawPlot(ctx, { handles: true, squares: true });
    const y = ST.w * ST.predX + ST.b;
    ctx.setLineDash([5, 5]); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(A.X(ST.predX), H - B); ctx.lineTo(A.X(ST.predX), A.Y(y)); ctx.lineTo(L, A.Y(y)); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(A.X(ST.predX), A.Y(y), 7, 0, 7); ctx.fill();
    D.pill(ctx, `học ${ST.predX.toFixed(0)} giờ → ${y.toFixed(1)} điểm`, Math.min(W - 120, A.X(ST.predX) + 10), Math.max(40, A.Y(y) - 22), "#8a5a00", 13);
    if (ST.exploded) D.pill(ctx, "BÙNG NỔ! Tốc độ học quá lớn", W / 2, 40, "#c2402a", 15);
    if (ST.edit) D.pill(ctx, "Bấm vào chỗ trống để thêm bạn mới · bấm vào chấm để xóa", W / 2, H - 30 - 0, "#1c2048", 12);
  }

  // ---------- bản đồ thung lũng sai số ----------
  let surfImg = null;
  const SW = surf.width, SH = surf.height;
  const sx = (w) => (w - WR[0]) / (WR[1] - WR[0]) * SW, sy = (b) => SH - (b - BR[0]) / (BR[1] - BR[0]) * SH;
  const iw = (x) => WR[0] + x / SW * (WR[1] - WR[0]), ib = (y) => BR[0] + (SH - y) / SH * (BR[1] - BR[0]);
  function buildSurf() {
    const img = fctx.createImageData(SW, SH), step = 2, vals = [];
    for (let y = 0; y < SH; y += step) for (let x = 0; x < SW; x += step) vals.push(Math.log(1 + mse(iw(x), ib(y))));
    const mn = Math.min(...vals), mx = Math.max(...vals); let k = 0;
    for (let y = 0; y < SH; y += step) for (let x = 0; x < SW; x += step) {
      const t = (vals[k++] - mn) / (mx - mn), band = Math.abs(((t * 12) % 1) - 0.5) < 0.035;
      const r = band ? 255 : 30 + 225 * t ** 0.9, g = band ? 255 : 26 + 90 * (1 - t) + 40 * t, bb = band ? 255 : 90 + 140 * (1 - t);
      for (let dy = 0; dy < step; dy++) for (let dx = 0; dx < step; dx++) { const i = ((y + dy) * SW + x + dx) * 4; if (i >= img.data.length) continue; img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = bb; img.data[i + 3] = band ? 90 : 255; }
    }
    surfImg = img;
  }
  function renderSurface(ctx, scale) {
    if (!surfImg) buildSurf();
    fctx.putImageData(surfImg, 0, 0);
    const c = ctx || fctx, s = scale || 1;
    if (ctx) { ctx.drawImage(surf, 0, 0, SW * s, SH * s); }
    c.save(); c.scale(s, s);
    if (ST.best) { const x = sx(ST.best.w), y = sy(ST.best.b); c.fillStyle = "#ffc34d"; c.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 4 : 10; c.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r); } c.closePath(); c.fill(); }
    c.strokeStyle = "#fff"; c.lineWidth = 2; c.beginPath(); ST.path.forEach(([w, b], i) => { const x = Math.max(-50, Math.min(SW + 50, sx(w))), y = Math.max(-50, Math.min(SH + 50, sy(b))); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
    ST.path.forEach(([w, b]) => { c.fillStyle = "rgba(255,255,255,.8)"; c.beginPath(); c.arc(sx(w), sy(b), 2.5, 0, 7); c.fill(); });
    c.fillStyle = "#5ef2d6"; c.strokeStyle = "#062b27"; c.lineWidth = 2; c.beginPath(); c.arc(sx(ST.w), sy(ST.b), 8, 0, 7); c.fill(); c.stroke();
    c.fillStyle = "#fff"; c.font = "11px JetBrains Mono, monospace"; c.fillText("w (độ dốc) →", SW - 92, SH - 8); c.save(); c.translate(12, 90); c.rotate(-Math.PI / 2); c.fillText("b (điểm gốc) →", 0, 0); c.restore();
    c.restore();
  }

  // ---------- gradient descent ----------
  function gdStep() {
    if (ST.exploded) return;
    const [gw, gb] = grad(ST.w, ST.b); ST.w -= ST.lr * gw; ST.b -= ST.lr * gb; ST.step++;
    const l = mse(ST.w, ST.b); ST.path.push([ST.w, ST.b]); if (ST.path.length > 400) ST.path.shift();
    ST.lossHist.push(l); if (ST.lossHist.length > 400) ST.lossHist.shift();
    if (!isFinite(l) || l > 1e4) { ST.exploded = true; ST.running = false; ST.w = Math.max(-5, Math.min(5, ST.w)) || 0; ST.b = Math.max(-20, Math.min(20, ST.b)) || 0; }
  }
  function renderLossChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), Wc = cv.width, Hc = cv.height, l = ST.lossHist, TH = P.TH;
    ctx.clearRect(0, 0, Wc, Hc); ctx.font = "11px JetBrains Mono, monospace";
    const mx = Math.max(1, ...l.filter(isFinite).slice(0, 400)), Lc = 50, Bc = 26, X = (i) => Lc + i / Math.max(40, l.length - 1) * (Wc - Lc - 14), Y = (v) => 12 + (1 - Math.min(1, v / mx)) * (Hc - 12 - Bc);
    for (const f of [0, 0.5, 1]) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(Lc, Y(mx * f)); ctx.lineTo(Wc - 14, Y(mx * f)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText((mx * f).toFixed(1), 4, Y(mx * f) + 4); }
    ctx.fillText("bước 0", Lc, Hc - 6); ctx.fillText(`bước ${ST.step}`, Wc - 90, Hc - 6);
    if (ST.best) { const v = mse(ST.best.w, ST.best.b); ctx.setLineDash([6, 5]); ctx.strokeStyle = TH.amber; ctx.beginPath(); ctx.moveTo(Lc, Y(v)); ctx.lineTo(Wc - 14, Y(v)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.amber; ctx.fillText("đáy thung lũng " + v.toFixed(2), Wc - 190, Y(v) - 6); }
    ctx.strokeStyle = TH.violet; ctx.lineWidth = 3; ctx.beginPath(); l.forEach((v, i) => (i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)))); ctx.stroke();
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${k("let")} w = ${n(ST.w.toFixed(3))}, b = ${n(ST.b.toFixed(3))};   ${c("// đường thẳng: điểm = w × giờ + b")}
${k("for")} (${k("let")} buoc = ${n(0)}; buoc &lt; ${n(500)}; buoc++) {
  ${k("let")} dw = ${n(0)}, db = ${n(0)};
  ${k("for")} (${k("const")} ban ${k("of")} duLieu) {             ${c("// " + ST.data.length + " bạn")}
    ${k("const")} sai = (w * ban.gio + b) - ban.diem;  ${c("// dự đoán − thật")}
    dw += ${n(2)} * sai * ban.gio / duLieu.length;      ${c("// độ dốc theo w")}
    db += ${n(2)} * sai / duLieu.length;                ${c("// độ dốc theo b")}
  }
  w -= ${n(ST.lr)} * dw;   ${c("// bước xuống dốc, tốc độ học = " + ST.lr)}
  b -= ${n(ST.lr)} * db;
}`;
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Dữ liệu", e: "layers", d: "Mỗi chấm là một bạn: <b>số giờ tự học</b> mỗi tuần (trục ngang) và <b>điểm thi</b> (trục dọc). Máy chỉ có những cặp số này." },
    { t: "Đường dự đoán", e: "chart", d: "Ta đoán điểm bằng một đường thẳng: <b>điểm = w × giờ + b</b>. w là độ dốc (mỗi giờ học thêm được bao nhiêu điểm), b là điểm khi không học giờ nào." },
    { t: "Sai số từng bạn", e: "crosshair", d: "Với mỗi bạn, đo khoảng cách theo chiều dọc giữa <b>điểm thật</b> và <b>điểm dự đoán</b>. Đó là sai số của đường thẳng với bạn ấy." },
    { t: "Hàm mất mát", e: "blocks", d: "Bình phương mỗi sai số (chính là diện tích các hình vuông cam), rồi lấy trung bình. Con số này gọi là <b>MSE</b>: càng nhỏ thì đường càng khớp." },
    { t: "Tìm hướng dốc", e: "angle", d: "Trên bản đồ \"thung lũng\", mỗi điểm là một cặp (w, b), màu càng tối thì MSE càng nhỏ. <b>Đạo hàm</b> cho biết hướng dốc lên, nên ta đi ngược lại." },
    { t: "Bước xuống dốc", e: "repeat", d: "Đi một bước nhỏ ngược hướng dốc: <b>w ← w − tốc độ học × độ dốc</b>. Lặp lại hàng trăm lần cho tới đáy thung lũng. Đây là cách hầu hết AI hiện đại học." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, () => {}); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const s = pipe.get(), ctx = octx;
    if (s === 0) { drawPlot(ctx, { lab: true, line: false, resid: false }); return; }
    if (s === 1) { drawPlot(ctx, { lab: true, resid: false }); return; }
    if (s === 2) { const A = drawPlot(ctx, { lab: true }); const p = ST.data[0]; if (p) D.pill(ctx, `sai ${(ST.w * p.x + ST.b - p.y).toFixed(2)}`, A.X(p.x) + 46, A.Y(p.y), "#c2402a", 12); return; }
    if (s === 3) { const keep = ST.squares; ST.squares = true; drawPlot(ctx, { lab: true, squares: true }); ST.squares = keep; D.pill(ctx, `MSE = ${mse(ST.w, ST.b).toFixed(2)}`, W / 2, 30, "#5443ff", 15); return; }
    ctx.fillStyle = "#121633"; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.translate((W - SW * 1.45) / 2, 20); renderSurface(ctx, 1.45);
    const [gw, gb] = grad(ST.w, ST.b), x = sx(ST.w) * 1.45, y = sy(ST.b) * 1.45, len = Math.hypot(gw / (WR[1] - WR[0]) * SW, gb / (BR[1] - BR[0]) * SH) || 1;
    const ux = -(gw / (WR[1] - WR[0]) * SW) / len, uy = (gb / (BR[1] - BR[0]) * SH) / len;
    D.arrow(ctx, { x, y }, { x: x + ux * 70, y: y + uy * 70 }, "#ffc34d", 4);
    if (s === 4) D.arrow(ctx, { x, y }, { x: x - ux * 70, y: y - uy * 70 }, "#ff7d5f", 3);
    ctx.restore();
    D.pill(ctx, s === 4 ? "cam: dốc lên · vàng: hướng đi xuống" : "mỗi chấm trắng là một bước đã đi", W / 2, H - 26, "#1c2048", 12);
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"), d = ST.data;
    if (s === 0) el.innerHTML = `Số bạn: <span class="hl">${d.length}</span>\n` + d.slice(0, 4).map((p, i) => `Bạn ${i + 1}: ${p.x.toFixed(1)} giờ → ${p.y.toFixed(1)} điểm`).join("\n") + "\n…";
    else if (s === 1) el.innerHTML = `điểm = <span class="hl">${ST.w.toFixed(3)}</span> × giờ + <span class="hl">${ST.b.toFixed(2)}</span>\nVí dụ học 10 giờ → <span class="w">${(ST.w * 10 + ST.b).toFixed(2)}</span> điểm`;
    else if (s === 2) el.innerHTML = d.slice(0, 5).map((p, i) => `Bạn ${i + 1}: dự đoán ${(ST.w * p.x + ST.b).toFixed(2)} − thật ${p.y.toFixed(2)} = <span class="w">${(ST.w * p.x + ST.b - p.y).toFixed(2)}</span>`).join("\n");
    else if (s === 3) el.innerHTML = `MSE = (sai₁² + sai₂² + … + sai${d.length}²) / ${d.length}\n     = <span class="hl">${mse(ST.w, ST.b).toFixed(3)}</span>\nĐường tốt nhất có MSE = <span class="w">${ST.best ? mse(ST.best.w, ST.best.b).toFixed(3) : "—"}</span>`;
    else { const [gw, gb] = grad(ST.w, ST.b); el.innerHTML = `độ dốc theo w = <span class="w">${gw.toFixed(3)}</span>\nđộ dốc theo b = <span class="w">${gb.toFixed(3)}</span>\nw mới = ${ST.w.toFixed(3)} − ${ST.lr} × ${gw.toFixed(2)} = <span class="hl">${(ST.w - ST.lr * gw).toFixed(4)}</span>\nb mới = ${ST.b.toFixed(3)} − ${ST.lr} × ${gb.toFixed(2)} = <span class="hl">${(ST.b - ST.lr * gb).toFixed(4)}</span>`; }
  }

  // ---------- bảng não ----------
  function renderBrain() {
    const l = mse(ST.w, ST.b);
    $("bMse").textContent = isFinite(l) ? l.toFixed(2) : "∞";
    $("bW").textContent = ST.w.toFixed(3); $("bB").textContent = ST.b.toFixed(2);
    $("bBest").textContent = ST.best ? mse(ST.best.w, ST.best.b).toFixed(2) : "—";
    $("bStep").textContent = ST.step;
    $("bEq").innerHTML = `điểm = <b style="color:#5ef2d6">${ST.w.toFixed(2)}</b> × giờ + <b style="color:#5ef2d6">${ST.b.toFixed(2)}</b>`;
    if (l < 1.0 && !ST.running && ST.step === 0) prog.done("drag");
  }

  // ---------- tương tác ----------
  function pos(e, el) { const r = el.getBoundingClientRect(); return { x: (e.clientX - r.left) * el.width / r.width, y: (e.clientY - r.top) * el.height / r.height }; }
  function bind() {
    stage.addEventListener("pointerdown", (e) => {
      const p = pos(e, stage), A = axes();
      if (ST.edit) {
        const hit = ST.data.findIndex((q) => Math.hypot(A.X(q.x) - p.x, A.Y(q.y) - p.y) < 10);
        if (hit >= 0) ST.data.splice(hit, 1); else { const x = A.ix(p.x), y = A.iy(p.y); if (x > 0 && x <= 20 && y >= 0 && y <= 10) ST.data.push({ x, y }); }
        dataChanged(); return;
      }
      for (const hx of [2, 18]) if (Math.hypot(A.X(hx) - p.x, A.Y(ST.w * hx + ST.b) - p.y) < 18) { ST.drag = hx; ST.running = false; ST.step = 0; ST.exploded = false; stage.setPointerCapture(e.pointerId); }
    });
    stage.addEventListener("pointermove", (e) => {
      if (ST.drag == null) return; const p = pos(e, stage), A = axes(), y = A.iy(p.y);
      const other = ST.drag === 2 ? 18 : 2, yo = ST.w * other + ST.b;
      ST.w = (y - yo) / (ST.drag - other); ST.b = y - ST.w * ST.drag; ST.path = [[ST.w, ST.b]]; ST.lossHist = [];
    });
    const up = () => (ST.drag = null); stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    surf.addEventListener("pointerdown", (e) => { const p = pos(e, surf); ST.w = iw(p.x); ST.b = ib(p.y); ST.path = [[ST.w, ST.b]]; ST.lossHist = []; ST.step = 0; ST.exploded = false; prog.done("surface"); });
    $("btnRun").onclick = () => { if (ST.exploded) reset(); ST.running = !ST.running; markRun(); prog.done("gd"); };
    $("btnStep1").onclick = () => { ST.running = false; markRun(); gdStep(); prog.done("gd"); };
    $("btnReset").onclick = reset;
    $("btnEdit").onclick = () => { ST.edit = !ST.edit; $("btnEdit").classList.toggle("ghost", !ST.edit); $("btnEdit").setAttribute("aria-pressed", ST.edit); };
    $("btnNewData").onclick = () => { ST.data = makeData(Math.floor(Math.random() * 1000)); dataChanged(); };
    $("showSq").onchange = (e) => (ST.squares = e.target.checked);
    syncs.push(P.range("lr", () => ST.lr, (v) => (ST.lr = v), (v) => v.toFixed(4), genCode));
    syncs.push(P.range("predX", () => ST.predX, (v) => (ST.predX = v), (v) => v + " giờ"));
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      ST.data = makeData(); ST.predX = 10; ST.lr = 0.004; ST.exploded = false; ST.running = false; markRun();
      if (k === "lr") { ST.lr = 0.0125; reset(); ST.running = true; markRun(); }
      if (k === "outlier") { ST.data.push({ x: 19, y: 0.5, out: true }, { x: 17.5, y: 1.2, out: true }); dataChanged(); const bf = bestFit(); ST.w = bf.w; ST.b = bf.b; ST.path = [[ST.w, ST.b]]; }
      if (k === "extra") { const bf = bestFit(); ST.w = bf.w; ST.b = bf.b; ST.predX = 50; }
      dataChanged(); syncs.forEach((f) => f()); genCode(); prog.done("broke");
      $(k === "lr" ? "tu-lam" : "moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); ST.data = makeData(); ST.lr = 0.004; ST.predX = 10; dataChanged(); reset(); syncs.forEach((f) => f()); genCode(); };
  }
  const syncs = [];
  function markRun() { $("btnRun").innerHTML = HKA.icon(ST.running ? "pause" : "play") + (ST.running ? "Dừng" : "Cho máy tự học"); }
  function reset() { ST.w = 0.05; ST.b = 6.5; ST.path = [[ST.w, ST.b]]; ST.lossHist = []; ST.step = 0; ST.exploded = false; ST.running = false; markRun(); }

  const QUIZ = [
    { q: "Đường dự đoán là điểm = 0,3 × giờ + 3. Một bạn học 10 giờ mỗi tuần, máy dự đoán bao nhiêu điểm?", o: ["3", "6", "10", "0,3"], a: 1, e: "0,3 × 10 + 3 = 6 điểm." },
    { q: "Vì sao người ta bình phương sai số trước khi lấy trung bình?", o: ["Cho số to hơn", "Để sai số âm và dương không triệt tiêu nhau, và phạt nặng những lần sai nhiều", "Vì máy không cộng được số âm", "Không có lý do"], a: 1, e: "Nếu không bình phương, sai +2 và sai −2 sẽ cộng lại thành 0, như thể đường thẳng không sai gì cả." },
    { q: "Trong gradient descent, \"tốc độ học\" quá lớn thì điều gì có thể xảy ra?", o: ["Học nhanh và chính xác hơn", "Mỗi bước nhảy quá xa, vượt qua đáy thung lũng, rồi sai số tăng vọt", "Không thay đổi gì", "Máy dừng lại ngay"], a: 1, e: "Bước quá dài sẽ nhảy qua lại hai bên thung lũng, ngày càng xa đáy, gọi là \"bùng nổ\"." },
    { q: "Dữ liệu chỉ có các bạn học 1–19 giờ. Máy dự đoán bạn học 50 giờ được 18 điểm (thang 10). Vấn đề là gì?", o: ["Máy tính sai phép nhân", "Đây là ngoại suy: đường thẳng không còn đúng ngoài vùng dữ liệu đã thấy", "Bạn đó thật sự được 18 điểm", "Cần thêm tốc độ học"], a: 1, e: "Mô hình chỉ đáng tin trong vùng dữ liệu nó đã học. Ngoài vùng đó, nó có thể cho kết quả vô lý." },
    { q: "Dữ liệu cho thấy ai học nhiều giờ thì điểm cao hơn. Kết luận nào CẨN THẬN nhất?", o: ["Học nhiều giờ chắc chắn làm điểm tăng", "Hai đại lượng có tương quan, nhưng chưa chứng minh được cái này gây ra cái kia", "Điểm cao làm bạn học nhiều hơn", "Dữ liệu sai"], a: 1, e: "Tương quan không phải nhân quả. Có thể còn yếu tố khác (sức khỏe, gia đình, cách học…) ảnh hưởng cả hai." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let slow = 0;
  function tick(now) {
    if (ST.running) for (let i = 0; i < 3; i++) gdStep();
    renderStage(); renderSurface(); renderLossChart();
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; renderBrain(); genCode(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  ST.data = makeData(); dataChanged(); P.nav(); bind(); reset(); genCode(); syncs.forEach((f) => f());
  window.addEventListener("hka:theme", () => (surfImg = null));
  requestAnimationFrame(tick);
})();
