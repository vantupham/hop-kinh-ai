/* Hộp Kính AI · Dự án 31 · Đường thẳng dự đoán cây đậu (hàm bậc nhất, sai số, tự chỉnh, ngoại suy) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-31");
  const H = (d) => 36 * (1 - Math.exp(-d / 18)) + 1;
  const r = P.rng(31), nz = () => (r() - 0.5) * 2.6;
  const BASE = Array.from({ length: 15 }, (_, d) => ({ d, h: +(H(d) + nz()).toFixed(1) })); BASE[10].h = 15.2;
  const FUTURE = Array.from({ length: 8 }, (_, i) => ({ d: 16 + i * 2, h: +(H(16 + i * 2) + nz()).toFixed(1) }));
  const TEST = Array.from({ length: 7 }, (_, i) => ({ d: 0.5 + i * 2, h: +(H(0.5 + i * 2) + nz()).toFixed(1) }));
  const ST = { a: 0.5, b: 8, deg: 1, day: 10, data: BASE.map((p) => ({ ...p, off: false })), future: false, test: false, hist: [], fit: null, coef: null, drag: null, t: 0 };

  // ---------- mô hình ----------
  const used = () => ST.data.filter((p) => !p.off);
  function polyFit(pts, deg) {
    const n = deg + 1, A = Array.from({ length: n }, () => new Float64Array(n + 1)), u = (d) => d / 7 - 1;
    pts.forEach((p) => { const pw = []; for (let k = 0; k < n; k++) pw.push(Math.pow(u(p.d), k)); for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) A[i][j] += pw[i] * pw[j]; A[i][n] += pw[i] * p.h; } });
    for (let i = 0; i < n; i++) A[i][i] += 1e-9;
    for (let c = 0; c < n; c++) { let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i; [A[c], A[m]] = [A[m], A[c]]; for (let i = 0; i < n; i++) if (i !== c) { const f = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= f * A[c][j]; } }
    return A.map((row, i) => row[n] / row[i]);
  }
  function f(d) { if (ST.deg === 1) return ST.a * d + ST.b; const u = d / 7 - 1; return ST.coef.reduce((s, c, k) => s + c * Math.pow(u, k), 0); }
  const mae = (pts) => (pts.length ? pts.reduce((s, p) => s + Math.abs(p.h - f(p.d)), 0) / pts.length : 0);
  function refit() { if (ST.deg > 1) ST.coef = polyFit(used(), ST.deg); }
  function gdStart() {
    ST.deg = 1; setDeg(); const pts = used(); let b = ST.b, a = ST.a * 14; const steps = [];
    for (let it = 0; it < 70; it++) { let gb = 0, ga = 0; pts.forEach((p) => { const u = p.d / 14, e = a * u + b - p.h; gb += e; ga += e * u; }); b -= (0.9 * gb) / pts.length; a -= (2.2 * ga) / pts.length; steps.push([a / 14, b]); }
    ST.fit = { steps, k: 0, acc: 0 };
  }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d"), L = 60, R = 24, T = 22, B = 42, W = 880, Hh = 440, XM = 32, YM = 60;
  const X = (d) => L + (d / XM) * (W - L - R), Y = (h) => T + (1 - h / YM) * (Hh - T - B), Dx = (px) => ((px - L) / (W - L - R)) * XM, Hy = (py) => (1 - (py - T) / (Hh - T - B)) * YM;
  const lab = (ctx, t, x, y, c, f2, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f2 || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  const nf = (v, k) => v.toFixed(k == null ? 1 : k).replace(".", ",");
  function axes(ctx) {
    ctx.font = "11px JetBrains Mono, monospace";
    for (let h = 0; h <= YM; h += 10) { ctx.strokeStyle = "#2c3270"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Y(h)); ctx.lineTo(W - R, Y(h)); ctx.stroke(); lab(ctx, h + " cm", L - 8, Y(h) + 4, "#8f96d4", "11px JetBrains Mono, monospace", "right"); }
    for (let d = 0; d <= XM; d += 2) { ctx.strokeStyle = d === 14 ? "rgba(255,195,77,.4)" : "#232866"; ctx.beginPath(); ctx.moveTo(X(d), T); ctx.lineTo(X(d), Hh - B); ctx.stroke(); if (d % 4 === 0) lab(ctx, String(d), X(d), Hh - B + 18, "#8f96d4", "11px JetBrains Mono, monospace", "center"); }
    lab(ctx, "số ngày →", W - R, Hh - 6, "#8f96d4", "600 11px Be Vietnam Pro, sans-serif", "right");
    ctx.fillStyle = "rgba(124,107,255,.08)"; ctx.fillRect(X(0), T, X(14) - X(0), Hh - T - B); lab(ctx, "khoảng có dữ liệu", X(7), T + 14, "#a99dff", "600 11px Be Vietnam Pro, sans-serif", "center");
  }
  function curve(ctx, col, w, dash) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); let on = false; for (let d = 0; d <= XM; d += 0.1) { const v = f(d); if (v < -5 || v > YM + 5) { on = false; continue; } on ? ctx.lineTo(X(d), Y(v)) : ctx.moveTo(X(d), Y(v)); on = true; } ctx.stroke(); ctx.setLineDash([]); }
  function renderStage() {
    const ctx = sctx; D.labBg(ctx); axes(ctx);
    used().forEach((p) => { ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X(p.d), Y(p.h)); ctx.lineTo(X(p.d), Y(Math.max(-2, Math.min(YM + 2, f(p.d))))); ctx.stroke(); });
    curve(ctx, "#3fe0c5", 3);
    if (ST.future) FUTURE.forEach((p) => { ctx.fillStyle = "#3fe0c5"; ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(p.d), Y(p.h), 6, 0, 7); ctx.fill(); ctx.stroke(); });
    if (ST.test) TEST.forEach((p) => { ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(X(p.d), Y(p.h) - 7); ctx.lineTo(X(p.d) + 7, Y(p.h)); ctx.lineTo(X(p.d), Y(p.h) + 7); ctx.lineTo(X(p.d) - 7, Y(p.h)); ctx.fill(); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 1.5; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(p.d), Y(p.h)); ctx.lineTo(X(p.d), Y(Math.max(-2, Math.min(YM + 2, f(p.d))))); ctx.stroke(); ctx.setLineDash([]); });
    ST.data.forEach((p) => { const y = Math.min(p.h, YM); ctx.fillStyle = p.off ? "transparent" : "#a99dff"; ctx.strokeStyle = p.off ? "#6c74b8" : "#fff"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(X(p.d), Y(y), 6, 0, 7); ctx.fill(); ctx.stroke(); if (p.off) { ctx.beginPath(); ctx.moveTo(X(p.d) - 5, Y(y) - 5); ctx.lineTo(X(p.d) + 5, Y(y) + 5); ctx.stroke(); } });
    if (ST.deg === 1) [0, 14].forEach((d) => { ctx.fillStyle = "#3fe0c5"; ctx.strokeStyle = "#0c1030"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(X(d), Y(f(d)), 9, 0, 7); ctx.fill(); ctx.stroke(); });
    const pv = f(ST.day); ctx.strokeStyle = "#ffc34d"; ctx.setLineDash([5, 4]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(X(ST.day), Hh - B); ctx.lineTo(X(ST.day), Y(Math.max(0, Math.min(YM, pv)))); ctx.lineTo(L, Y(Math.max(0, Math.min(YM, pv)))); ctx.stroke(); ctx.setLineDash([]);
    if (pv >= 0 && pv <= YM) { ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(X(ST.day), Y(pv), 7, 0, 7); ctx.fill(); lab(ctx, `ngày ${ST.day}: ${nf(pv)} cm`, Math.min(X(ST.day) + 10, W - 150), Y(pv) - 10, "#ffc34d", "800 13px Be Vietnam Pro, sans-serif"); }
    $("stageTag").textContent = ST.deg === 1 ? `y = ${nf(ST.a, 2)}x + ${nf(ST.b)}` : `ĐƯỜNG UỐN LƯỢN MỨC ${ST.deg}`;
  }
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function update(push) {
    refit(); const e = mae(used()), te = mae(TEST), pv = f(ST.day);
    if (push !== false) { ST.hist.push({ e, te: ST.test ? te : null }); if (ST.hist.length > 140) ST.hist.shift(); }
    $("bEq").textContent = ST.deg === 1 ? `y = ${nf(ST.a, 2)}x + ${nf(ST.b)}` : `uốn lượn mức ${ST.deg}`; $("bErr").textContent = nf(e, 2) + " cm"; $("bErr").style.color = e < 1.5 ? "#5ef2d6" : e < 4 ? "#ffc34d" : "#ff8f6b";
    $("bPred").textContent = `ngày ${ST.day}: ${nf(pv)} cm`; const fu = FUTURE.find((p) => p.d === ST.day);
    $("bTest").textContent = ST.test ? nf(te, 2) + " cm" : fu && ST.future ? `thật ${nf(fu.h)} cm` : "—"; $("bTest").style.color = ST.test && te > 3 ? "#ff8f6b" : "#fff";
    $("bData").innerHTML = ST.data.map((p, i) => `<button class="k ${p.off ? "" : p.h > H(p.d) + 15 ? "bad" : "good"}" data-i="${i}" style="border:0;cursor:pointer;${p.off ? "opacity:.45;text-decoration:line-through" : ""}">${p.d}: ${nf(p.h)}</button>`).join("");
    $("bData").querySelectorAll("button").forEach((b) => (b.onclick = () => toggle(+b.dataset.i)));
    if (ST.deg === 1 && e < 1.5 && !ST.fit && ST.manual) prog.done("manual");
    say(`Hàm số ${ST.deg === 1 ? `<b>y = ${nf(ST.a, 2)}x + ${nf(ST.b)}</b>: mỗi ngày cây cao thêm khoảng <b>${nf(ST.a, 2)} cm</b>` : "uốn lượn"}. Sai số trung bình <b>${nf(e, 2)} cm</b>. Dự đoán ngày ${ST.day}: <b>${nf(pv)} cm</b>${ST.day > 14 ? ' <span style="color:var(--coral)">(ngoài khoảng có dữ liệu!)</span>' : ""}.`);
    renderChart();
  }
  function toggle(i) { ST.data[i].off = !ST.data[i].off; update(); guide(ST.data[i].off ? `Đã bỏ số đo ngày ${ST.data[i].d}. Bấm <b>Máy tự tìm đường thẳng</b> để máy học lại không có chấm này.` : `Đã lấy lại số đo ngày ${ST.data[i].d}.`); }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), Wc = cv.width, Hc = cv.height, TH = P.TH, l = 50, rr = 14, t = 14, b = 26; ctx.clearRect(0, 0, Wc, Hc);
    const h = ST.hist, mx = Math.max(4, ...h.map((q) => Math.max(q.e, q.te || 0))), Yc = (v) => t + (1 - Math.min(v, mx) / mx) * (Hc - t - b), Xc = (i) => l + (i / 139) * (Wc - l - rr);
    ctx.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= mx; v += Math.ceil(mx / 4)) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(l, Yc(v)); ctx.lineTo(Wc - rr, Yc(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v + " cm", 4, Yc(v) + 4); }
    [["e", TH.mint], ["te", TH.amber]].forEach(([k, c]) => { ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); let on = false; h.forEach((q, i) => { if (q[k] == null) { on = false; return; } on ? ctx.lineTo(Xc(i), Yc(q[k])) : ctx.moveTo(Xc(i), Yc(q[k])); on = true; }); ctx.stroke(); });
    ctx.fillStyle = TH.text; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText("Xanh: sai số trên số liệu dùng để học · Vàng: sai số trên số đo mới của nhóm bạn (khi bật)", l + 8, t + 12);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Số liệu đo", e: "layers", d: "Mỗi ngày đo một lần được một cặp số (ngày, chiều cao). 15 cặp số là 15 chấm trên mặt phẳng tọa độ. Đây là <b>dữ liệu</b> để máy học." },
    { t: "Chọn mô hình", e: "chart", d: "Máy đoán rằng chiều cao tăng gần như đều, nên chọn mô hình <b>y = ax + b</b>. <b>a</b>: cây cao thêm mỗi ngày; <b>b</b>: chiều cao ở ngày 0. Học là tìm hai số a, b." },
    { t: "Đo sai số", e: "scan", d: "Với mỗi chấm, sai số = |số đo thật − giá trị trên đường thẳng|. Cộng tất cả rồi chia cho số chấm: <b>sai số trung bình</b>." },
    { t: "Máy tự chỉnh", e: "repeat", d: "Máy xem nếu nhích a hoặc b lên một chút thì sai số tăng hay giảm, rồi nhích theo hướng làm sai số <b>giảm</b>. Lặp lại vài chục lần là đường thẳng nằm sát các chấm." },
    { t: "Dự đoán", e: "target", d: "Có a và b rồi, muốn biết ngày x thì chỉ cần tính <b>y = a × x + b</b>. Đó là dự đoán của mô hình." },
    { t: "Giới hạn", e: "alert", d: "Mô hình chỉ đáng tin <b>gần khoảng có dữ liệu</b>. Xa hơn, cây lớn chậm lại nhưng đường thẳng vẫn đi lên: dự đoán sai càng lúc càng xa." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const ctx = octx, s = soiStep, pts = used(); D.labBg(ctx);
    const sx = (d) => 60 + (d / (s === 5 ? 32 : 15)) * 540, sy = (h) => 420 - (h / (s === 5 ? 45 : 30)) * 380;
    ctx.strokeStyle = "#2c3270"; for (let h = 0; h <= (s === 5 ? 45 : 30); h += 5) { ctx.beginPath(); ctx.moveTo(60, sy(h)); ctx.lineTo(610, sy(h)); ctx.stroke(); lab(ctx, h + "", 50, sy(h) + 4, "#8f96d4", "11px JetBrains Mono, monospace", "right"); }
    const dot = (p, c) => { ctx.fillStyle = c || "#a99dff"; ctx.beginPath(); ctx.arc(sx(p.d), sy(Math.min(p.h, 44)), 5, 0, 7); ctx.fill(); };
    let a = ST.deg === 1 ? ST.a : 1.4, b = ST.deg === 1 ? ST.b : 2;
    if (s === 3) { const k = (Math.sin(ST.t * 0.7) + 1) / 2; a = 0.4 + (1.45 - 0.4) * (1 - k); b = 9 - 7 * (1 - k); }
    const line = (col) => { ctx.strokeStyle = col || "#3fe0c5"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx(0), sy(b)); const de = s === 5 ? 32 : 15; ctx.lineTo(sx(de), sy(a * de + b)); ctx.stroke(); };
    if (s === 0) { pts.forEach((p) => dot(p)); ctx.fillStyle = "rgba(12,16,48,.85)"; D.rr(ctx, 380, 250, 230, 160, 10); ctx.fill(); pts.slice(0, 6).forEach((p, i) => lab(ctx, `ngày ${p.d} → ${nf(p.h)} cm`, 396, 278 + i * 22, "#fff", "600 13px JetBrains Mono, monospace")); return; }
    if (s === 1) { pts.forEach((p) => dot(p)); line(); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx(4), sy(4 * a + b)); ctx.lineTo(sx(5), sy(4 * a + b)); ctx.lineTo(sx(5), sy(5 * a + b)); ctx.stroke(); lab(ctx, `+1 ngày → +${nf(a, 2)} cm = a`, sx(5) + 8, sy(5 * a + b) + 14, "#ffc34d"); lab(ctx, `b = ${nf(b)} cm`, sx(0) + 8, sy(b) - 10, "#ffc34d"); return; }
    if (s === 2 || s === 3) { const e = pts.reduce((q, p) => q + Math.abs(p.h - (a * p.d + b)), 0) / pts.length; pts.forEach((p) => { ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx(p.d), sy(Math.min(p.h, 44))); ctx.lineTo(sx(p.d), sy(a * p.d + b)); ctx.stroke(); dot(p); }); line(); lab(ctx, `Sai số trung bình: ${nf(e, 2)} cm`, 70, 50, s === 3 ? "#5ef2d6" : "#ff8f6b", "800 18px Be Vietnam Pro, sans-serif"); if (s === 3) lab(ctx, `a = ${nf(a, 2)} · b = ${nf(b)}`, 70, 76, "#fff", "700 14px JetBrains Mono, monospace"); return; }
    if (s === 4) { pts.forEach((p) => dot(p)); line(); const d = Math.min(ST.day, 15), v = a * d + b; ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(sx(d), sy(v), 8, 0, 7); ctx.fill(); lab(ctx, `y = ${nf(a, 2)} × ${d} + ${nf(b)} = ${nf(v)} cm`, 70, 50, "#ffc34d", "800 18px Be Vietnam Pro, sans-serif"); return; }
    pts.forEach((p) => dot(p)); FUTURE.forEach((p) => dot(p, "#3fe0c5")); line("#a99dff"); const v30 = a * 30 + b, t30 = FUTURE[FUTURE.length - 1]; ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(sx(30), sy(Math.min(v30, 44))); ctx.lineTo(sx(30), sy(t30.h)); ctx.stroke();
    lab(ctx, `Ngày 30: đường thẳng nói ${nf(v30)} cm, thật chỉ ${nf(t30.h)} cm`, 70, 50, "#ff8f6b", "800 16px Be Vietnam Pro, sans-serif");
  }
  function soiLive() { const s = soiStep, el = $("soiLive"), e = mae(used()); if (s <= 1) el.innerHTML = `<span class="hl">${used().length}</span> chấm số liệu`; else if (s <= 3) el.innerHTML = `Sai số hiện tại <span class="hl">${nf(e, 2)} cm</span>`; else el.innerHTML = `Dự đoán ngày ${ST.day}: <span class="w">${nf(f(ST.day))} cm</span>`; }

  // ---------- điều khiển ----------
  let setA, setB, setDay, setDeg;
  function bind() {
    setA = P.range("a", () => ST.a, (v) => (ST.a = v), (v) => nf(v, 2), () => { ST.manual = true; update(); });
    setB = P.range("b", () => ST.b, (v) => (ST.b = v), (v) => nf(v), () => { ST.manual = true; update(); });
    setDay = P.range("day", () => ST.day, (v) => (ST.day = v), (v) => "ngày " + v, () => { prog.done("pred"); update(false); });
    setDeg = P.range("deg", () => ST.deg, (v) => (ST.deg = v), (v) => (v === 1 ? "1 (thẳng)" : String(v)), () => { if (ST.deg > 1) ST.test = true; $("a").disabled = $("b").disabled = ST.deg > 1; update(); });
    const pos = (e) => { const rc = stage.getBoundingClientRect(); return [((e.clientX - rc.left) / rc.width) * W, ((e.clientY - rc.top) / rc.height) * Hh]; };
    stage.addEventListener("pointerdown", (e) => {
      const [x, y] = pos(e);
      if (ST.deg === 1) for (const d of [0, 14]) if (Math.hypot(X(d) - x, Y(f(d)) - y) < 16) { ST.drag = d; stage.setPointerCapture(e.pointerId); return; }
      const i = ST.data.findIndex((p) => Math.hypot(X(p.d) - x, Y(Math.min(p.h, YM)) - y) < 10); if (i >= 0) toggle(i);
    });
    stage.addEventListener("pointermove", (e) => { if (ST.drag == null) return; const [, y] = pos(e), h = Hy(y), y0 = ST.drag === 0 ? h : f(0), y14 = ST.drag === 14 ? h : f(14); ST.b = Math.max(-10, Math.min(20, y0)); ST.a = Math.max(-1, Math.min(5, (y14 - ST.b) / 14)); ST.manual = true; setA(); setB(); update(); });
    const up = () => (ST.drag = null); stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    $("btnFit").onclick = () => { gdStart(); guide("Máy đang nhích <b>a</b> và <b>b</b> từng chút theo hướng làm sai số nhỏ đi. Xem biểu đồ sai số đi xuống!"); };
    $("btnReset").onclick = () => { ST.a = 0.5; ST.b = 8; ST.deg = 1; setA(); setB(); setDeg(); $("a").disabled = $("b").disabled = false; ST.fit = null; update(); };
    $("btnFuture").onclick = () => { ST.future = !ST.future; $("btnFuture").innerHTML = HKA.icon("eye") + (ST.future ? "Ẩn số đo các ngày sau" : "Xem số đo các ngày sau"); update(false); };
    const clear = () => { ST.data = BASE.map((p) => ({ ...p, off: false })); ST.future = false; ST.test = false; ST.deg = 1; setDeg(); $("a").disabled = $("b").disabled = false; ST.day = 10; setDay(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "far") { const fit = polyFit(used(), 1); ST.b = fit[0] - fit[1]; ST.a = fit[1] / 7; setA(); setB(); ST.day = 30; setDay(); ST.future = true; update(); guide(`Đường thẳng dự đoán ngày 30 cây cao <b>${nf(f(30))} cm</b>, nhưng số đo thật chỉ <b>${nf(FUTURE[7].h)} cm</b> (chấm xanh viền trắng). Cây lớn chậm lại, đường thẳng thì không!`); }
      if (k === "typo") { ST.data[10].h = 51; gdStart(); guide("Ngày 10 bị ghi <b>51 cm</b> thay vì 15 cm. Xem máy tìm đường thẳng: chấm sai kéo cả đường lên. Bấm vào chấm đó để bỏ, rồi cho máy tìm lại."); }
      if (k === "wiggle") { ST.deg = 12; setDeg(); ST.test = true; $("a").disabled = $("b").disabled = true; update(); guide(`Đường uốn lượn mức 12 đi sát gần như mọi chấm (sai số ${nf(mae(used()), 2)} cm), nhưng với số đo mới của nhóm bạn (hình thoi vàng), sai số lên tới <b>${nf(mae(TEST), 1)} cm</b>. Kéo <b>Độ uốn lượn</b> về 1.`); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); $("btnReset").click(); guide("Mọi sự cố đã tắt, số liệu trở lại như cũ."); };
  }

  const QUIZ = [
    { q: "Hàm số y = 1,5x + 2 mô tả chiều cao cây đậu (cm) theo số ngày x. Hệ số 1,5 có nghĩa gì?", o: ["Cây cao 1,5 cm lúc đầu", "Mỗi ngày cây cao thêm khoảng 1,5 cm", "Cây sống 1,5 ngày", "Sai số là 1,5 cm"], a: 1, e: "Hệ số a cho biết y tăng bao nhiêu khi x tăng 1: mỗi ngày cây cao thêm 1,5 cm." },
    { q: "Với y = 1,5x + 2, dự đoán chiều cao ngày thứ 8 là bao nhiêu?", o: ["10 cm", "12 cm", "14 cm", "9,5 cm"], a: 2, e: "y = 1,5 × 8 + 2 = 14 cm." },
    { q: "Máy \"học\" đường thẳng bằng cách nào?", o: ["Đoán ngẫu nhiên một lần", "Nhích a, b từng chút theo hướng làm sai số trung bình nhỏ đi, lặp lại nhiều lần", "Hỏi giáo viên", "Nối các chấm lại với nhau"], a: 1, e: "Đo sai số, chỉnh một chút, đo lại: lặp nhiều lần là sai số giảm dần." },
    { q: "Vì sao dự đoán chiều cao cây đậu ngày thứ 100 bằng đường thẳng học từ 2 tuần đầu là không đáng tin?", o: ["Vì máy tính không tính được số 100", "Vì ngày 100 nằm rất xa khoảng có dữ liệu, cây không lớn đều mãi", "Vì cây đậu không có chiều cao", "Vì đường thẳng luôn đúng"], a: 1, e: "Ngoại suy quá xa khoảng dữ liệu thì mô hình dễ sai rất nhiều." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.fit) { ST.fit.acc += dt * 35; while (ST.fit && ST.fit.acc >= 1) { ST.fit.acc -= 1; const [a, b] = ST.fit.steps[ST.fit.k++]; ST.a = Math.max(-1, Math.min(5, a)); ST.b = Math.max(-10, Math.min(20, b)); setA(); setB(); update(); if (ST.fit.k >= ST.fit.steps.length) { ST.fit = null; prog.done("fit"); guide(`Máy tìm được <b>y = ${nf(ST.a, 2)}x + ${nf(ST.b)}</b>, sai số trung bình ${nf(mae(used()), 2)} cm. Thử kéo <b>Ngày muốn dự đoán</b>.`); } } }
    renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick);
  }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); update(); guide("Kéo thanh <b>a</b> và <b>b</b> (hoặc hai nút tròn) để đường thẳng đi sát các chấm nhất có thể. Nhìn con số <b>sai số trung bình</b>: càng nhỏ càng tốt!");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka31 = { ST, f, mae, used, polyFit, TEST, FUTURE, BASE, gdStart };
  requestAnimationFrame(tick);
})();
