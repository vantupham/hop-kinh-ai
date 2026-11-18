/* Hộp Kính AI · Dự án 12 · Phân loại trái cây (tọa độ, khoảng cách Pythagore, chuẩn hóa thang đo) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-32");
  const CLS = [{ n: "Chanh", c: "#9be15d", d: [4.6, 0.35], m: [86, 14] }, { n: "Quýt", c: "#ffb648", d: [6.6, 0.4], m: [96, 14] }, { n: "Cam", c: "#ff7d3b", d: [8.0, 0.55], m: [210, 28] }, { n: "Lựu", c: "#e0457b", d: [9.6, 0.7], m: [320, 38] }];
  const DM = 14, MM = 450;
  const gen = (seed, k) => { const r = P.rng(seed), g = () => { let u = 0, v = 0; while (!u) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * v); }, o = []; for (let i = 0; i < k; i++) CLS.forEach((c, j) => o.push({ c: j, d: +(c.d[0] + g() * c.d[1]).toFixed(1), m: Math.round(c.m[0] + g() * c.m[1]) })); return o; };
  const BASE = gen(32, 8), TEST = gen(320, 10);
  const BAD = [{ c: 0, d: 8.1, m: 205, bad: true }, { c: 0, d: 7.7, m: 222, bad: true }];
  const ST = { mode: "nn", norm: true, maxd: 0.6, data: BASE.slice(), q: { d: 6.5, m: 95 }, drag: false, t: 0, modes: new Set(["nn"]) };

  // ---------- khoảng cách và phân loại ----------
  const sc = () => (ST.norm ? [DM, MM] : [1, 1]);
  function dist(a, b) { const [sx, sy] = sc(), dx = (a.d - b.d) / sx, dy = (a.m - b.m) / sy; return { dx, dy, d: Math.sqrt(dx * dx + dy * dy) }; }
  function centroids() { return CLS.map((_, j) => { const pts = ST.data.filter((p) => p.c === j); return { c: j, d: pts.reduce((s, p) => s + p.d, 0) / pts.length, m: pts.reduce((s, p) => s + p.m, 0) / pts.length, cen: true }; }); }
  function classify(q) {
    const refs = ST.mode === "nn" ? ST.data : centroids();
    let best = null; refs.forEach((r) => { const k = dist(q, r); if (!best || k.d < best.k.d) best = { r, k }; });
    const per = CLS.map((_, j) => Math.min(...refs.filter((r) => r.c === j).map((r) => dist(q, r).d)));
    const unsure = ST.norm && ST.maxd < 0.59 && best.k.d > ST.maxd;
    return { best, per, c: unsure ? -1 : best.r.c };
  }
  const acc = () => CLS.map((_, j) => TEST.filter((t) => t.c === j && classify(t).c === j).length);

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d"), L = 70, R = 20, T = 20, B = 44, W = 880, H = 440;
  const X = (d) => L + (d / DM) * (W - L - R), Y = (m) => T + (1 - m / MM) * (H - T - B), Dd = (x) => ((x - L) / (W - L - R)) * DM, Mm = (y) => (1 - (y - T) / (H - T - B)) * MM;
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  const nf = (v, k) => v.toFixed(k == null ? 2 : k).replace(".", ",");
  let map = null, mapKey = "";
  function buildMap() {
    const key = ST.mode + ST.norm + ST.maxd + ST.data.length + ST.data.map((p) => p.c).join(""); if (key === mapKey) return; mapKey = key;
    const cw = 8, ch = 8, cols = Math.ceil((W - L - R) / cw), rows = Math.ceil((H - T - B) / ch); map = { cw, ch, cols, rows, v: new Int8Array(cols * rows) };
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) map.v[j * cols + i] = classify({ d: Dd(L + (i + 0.5) * cw), m: Mm(T + (j + 0.5) * ch) }).c;
  }
  function fruit(ctx, x, y, c, r, ring) { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = ring || "rgba(0,0,0,.35)"; ctx.lineWidth = ring ? 2.5 : 1; ctx.stroke(); ctx.fillStyle = "rgba(255,255,255,.55)"; ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.35, r * 0.28, 0, 7); ctx.fill(); }
  function star(ctx, x, y) { ctx.fillStyle = "#fff"; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? 6 : 14; ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#1b1f4a"; ctx.lineWidth = 2; ctx.stroke(); }
  function renderStage() {
    const ctx = sctx; D.labBg(ctx); buildMap();
    for (let j = 0; j < map.rows; j++) for (let i = 0; i < map.cols; i++) { const v = map.v[j * map.cols + i]; ctx.fillStyle = v < 0 ? "rgba(255,255,255,.05)" : CLS[v].c; ctx.globalAlpha = v < 0 ? 1 : 0.22; ctx.fillRect(L + i * map.cw, T + j * map.ch, map.cw, map.ch); } ctx.globalAlpha = 1;
    ctx.font = "11px JetBrains Mono, monospace"; for (let m = 0; m <= MM; m += 50) { ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.moveTo(L, Y(m)); ctx.lineTo(W - R, Y(m)); ctx.stroke(); if (m % 100 === 0) lab(ctx, m + " g", L - 8, Y(m) + 4, "#8f96d4", "11px JetBrains Mono, monospace", "right"); }
    for (let d = 0; d <= DM; d += 1) { ctx.strokeStyle = "rgba(255,255,255,.07)"; ctx.beginPath(); ctx.moveTo(X(d), T); ctx.lineTo(X(d), H - B); ctx.stroke(); if (d % 2 === 0) lab(ctx, d + " cm", X(d), H - B + 18, "#8f96d4", "11px JetBrains Mono, monospace", "center"); }
    lab(ctx, "đường kính →", W - R, H - 6, "#8f96d4", "600 11px Be Vietnam Pro, sans-serif", "right"); lab(ctx, "khối lượng ↑", 6, T + 8, "#8f96d4", "600 11px Be Vietnam Pro, sans-serif");
    ST.data.forEach((p) => fruit(ctx, X(p.d), Y(p.m), CLS[p.c].c, 7, p.bad ? "#ff3b3b" : p.mine ? "#fff" : null));
    if (ST.mode === "cen") centroids().forEach((c) => { ctx.strokeStyle = CLS[c.c].c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(X(c.d), Y(c.m), 15, 0, 7); ctx.stroke(); ctx.beginPath(); ctx.moveTo(X(c.d) - 6, Y(c.m)); ctx.lineTo(X(c.d) + 6, Y(c.m)); ctx.moveTo(X(c.d), Y(c.m) - 6); ctx.lineTo(X(c.d), Y(c.m) + 6); ctx.stroke(); });
    const r = classify(ST.q), b = r.best.r, qx = X(ST.q.d), qy = Y(Math.min(ST.q.m, MM)), bx = X(b.d), by = Y(b.m);
    ctx.setLineDash([5, 4]); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(bx, qy); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(bx, by); ctx.stroke();
    lab(ctx, "Δx", (qx + bx) / 2, qy + (by < qy ? 16 : -8), "#ffc34d", "800 12px JetBrains Mono, monospace", "center"); lab(ctx, "Δy", bx + 8, (qy + by) / 2, "#ffc34d", "800 12px JetBrains Mono, monospace");
    star(ctx, qx, qy);
    CLS.forEach((c, i) => { fruit(ctx, L + 14 + i * 84, T + 14, c.c, 6); lab(ctx, c.n, L + 24 + i * 84, T + 18, "#fff", "700 12px Be Vietnam Pro, sans-serif"); });
    if (!ST.norm) lab(ctx, "Đang cộng thẳng cm và g!", W - R - 8, T + 18, "#ff8f6b", "800 13px Be Vietnam Pro, sans-serif", "right");
  }
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function update() {
    const r = classify(ST.q), k = r.best.k, b = r.best.r, [sx, sy] = sc();
    $("bGuess").textContent = r.c < 0 ? "Không biết" : CLS[r.c].n; $("bGuess").style.color = r.c < 0 ? "#fff" : CLS[r.c].c;
    const ux = ST.norm ? ` ÷ ${DM}` : " cm", uy = ST.norm ? ` ÷ ${MM}` : " g", p3 = ST.norm ? 3 : 2;
    $("bCalc").innerHTML = `Tới ${b.cen ? "điểm đại diện" : "quả gần nhất"} (${CLS[b.c].n}):<br>Δx = (${nf(ST.q.d, 1)} − ${nf(b.d, 1)})${ux} = <b>${nf(Math.abs(k.dx), p3)}</b><br>Δy = (${Math.round(ST.q.m)} − ${Math.round(b.m)})${uy} = <b>${nf(Math.abs(k.dy), p3)}</b><br>d = √(${nf(Math.abs(k.dx), p3)}² + ${nf(Math.abs(k.dy), p3)}²) = <b style="color:#ffc34d">${nf(k.d, p3)}</b>`;
    const mx = Math.max(...r.per.filter(isFinite)); $("bDist").innerHTML = CLS.map((c, j) => `<div class="r"><span style="color:${c.c}">${c.n}</span><div class="bar"><i style="width:${(1 - r.per[j] / (mx * 1.05)) * 100}%;background:${c.c}"></i></div><span>${nf(r.per[j])}</span></div>`).join("");
    const a = acc(), tot = a.reduce((x, y) => x + y, 0); $("bAcc").textContent = `${tot}/40`; $("bAcc").style.color = tot >= 34 ? "#5ef2d6" : tot >= 26 ? "#ffc34d" : "#ff8f6b";
    say(`Quả bí ẩn: đường kính <b>${nf(ST.q.d, 1)} cm</b>, nặng <b>${Math.round(ST.q.m)} g</b>. Máy xếp vào loại <b>${r.c < 0 ? "không biết" : CLS[r.c].n.toLowerCase()}</b>, khoảng cách tới ${b.cen ? "điểm đại diện" : "quả gần nhất"} là ${nf(k.d)}${ST.norm ? "" : " (đơn vị lẫn lộn cm và g)"}.`);
    $("stageTag").textContent = ST.mode === "nn" ? "HÀNG XÓM GẦN NHẤT" : "ĐIỂM ĐẠI DIỆN";
    renderChart(a);
  }
  function renderChart(a) {
    const cv = $("chart"), ctx = cv.getContext("2d"), Wc = cv.width, Hc = cv.height, TH = P.TH, l = 46, b = 30, t = 16; ctx.clearRect(0, 0, Wc, Hc);
    const bw = (Wc - l - 10) / 4, Yc = (v) => t + (1 - v / 10) * (Hc - t - b);
    ctx.font = "11px JetBrains Mono, monospace"; [0, 5, 10].forEach((v) => { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(l, Yc(v)); ctx.lineTo(Wc - 10, Yc(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v, 18, Yc(v) + 4); });
    CLS.forEach((c, j) => { const x = l + j * bw; ctx.fillStyle = c.c; D.rr(ctx, x + bw * 0.25, Yc(a[j]), bw * 0.5, Hc - b - Yc(a[j]), 6); ctx.fill(); ctx.fillStyle = TH.ink; ctx.font = "800 14px JetBrains Mono, monospace"; ctx.fillText(`${a[j]}/10`, x + bw / 2 - 18, Yc(a[j]) - 6); ctx.font = "700 13px Be Vietnam Pro, sans-serif"; ctx.fillText(c.n, x + bw / 2 - 16, Hc - 10); });
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Quả thành điểm", e: "crosshair", d: "Máy cân và đo mỗi quả, được hai số (đường kính, khối lượng). Hai số đó là <b>tọa độ</b> của một điểm trên mặt phẳng." },
    { t: "Tam giác vuông", e: "angle", d: "Giữa hai điểm vẽ được một tam giác vuông với hai cạnh góc vuông Δx, Δy. Khoảng cách là cạnh huyền: <b>d = √(Δx² + Δy²)</b> (định lý Pythagore)." },
    { t: "Hai đơn vị khác nhau", e: "sliders", d: "Δx tính bằng xăng-ti-mét (vài cm), Δy tính bằng gam (hàng chục, hàng trăm g). Cộng thẳng thì Δy lấn át. Máy <b>chia mỗi trục cho giá trị lớn nhất</b> (14 cm, 450 g) để hai trục cùng thang 0 đến 1." },
    { t: "Điểm đại diện", e: "target", d: "Cách thứ hai: lấy <b>trung bình tọa độ</b> của mọi quả cùng loại làm một điểm đại diện. Quả mới gần điểm đại diện nào thì thuộc loại đó." },
    { t: "Bản đồ phân loại", e: "map", d: "Làm phép tính đó cho mọi điểm trên mặt phẳng, tô màu theo kết quả: được <b>bản đồ phân loại</b>. Chỗ hai màu giáp nhau là <b>đường biên</b>, nơi máy dễ nhầm nhất." },
    { t: "Quá xa thì nói không biết", e: "help", d: "Nếu điểm mới cách <b>mọi</b> loại đã biết quá xa, có lẽ đó là loại quả mới. Máy tốt nên nói \"không biết\" thay vì đoán bừa." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 2) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const ctx = octx, s = soiStep; D.labBg(ctx);
    if (s === 0) { [[5.1, 82, 0], [6.4, 98, 1], [8.2, 215, 2]].forEach(([d, m, c], i) => { const y = 70 + i * 120; fruit(ctx, 70, y, CLS[c].c, 30); lab(ctx, `${CLS[c].n}: ${nf(d, 1)} cm, ${m} g`, 120, y - 6, "#fff", "800 16px Be Vietnam Pro, sans-serif"); lab(ctx, `→ điểm (${nf(d, 1)}; ${m})`, 120, y + 20, "#ffc34d", "700 14px JetBrains Mono, monospace"); }); return; }
    if (s === 1 || s === 2) {
      const a = { d: 5.0, m: 80 }, b = { d: 6.6, m: 100 }, ox = 80, oy = 380, kx = s === 1 ? 260 : 30, ky = s === 1 ? 10 : 2.6;
      const ax = ox, ay = oy, bx = s === 1 ? ox + (b.d - a.d) * 260 : ox + ((b.d - a.d) / DM) * 1500, by = s === 1 ? oy - (b.m - a.m) * ky : oy - ((b.m - a.m) / MM) * 1500; void kx;
      ctx.setLineDash([6, 4]); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]); ctx.strokeStyle = "#fff"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); fruit(ctx, ax, ay, CLS[0].c, 12); fruit(ctx, bx, by, CLS[1].c, 12);
      if (s === 1) { lab(ctx, "Δx = 1,6 cm", (ax + bx) / 2, ay + 26, "#ffc34d", "800 15px JetBrains Mono, monospace", "center"); lab(ctx, "Δy = 20 g", bx + 12, (ay + by) / 2, "#ffc34d", "800 15px JetBrains Mono, monospace"); lab(ctx, "Cộng thẳng: d = √(1,6² + 20²) ≈ 20,06", 40, 50, "#ff8f6b", "800 17px Be Vietnam Pro, sans-serif"); lab(ctx, "Gần như chỉ còn phần khối lượng!", 40, 78, "#c3c7f0", "600 14px Be Vietnam Pro, sans-serif"); }
      else { const dx = 1.6 / DM, dy = 20 / MM; lab(ctx, `Chia cho 14 cm: Δx = 1,6 ÷ 14 ≈ ${nf(dx, 3)}`, 40, 50, "#5ef2d6", "800 16px Be Vietnam Pro, sans-serif"); lab(ctx, `Chia cho 450 g: Δy = 20 ÷ 450 ≈ ${nf(dy, 3)}`, 40, 80, "#5ef2d6", "800 16px Be Vietnam Pro, sans-serif"); lab(ctx, `d = √(${nf(dx, 3)}² + ${nf(dy, 3)}²) ≈ ${nf(Math.hypot(dx, dy), 3)}`, 40, 116, "#fff", "800 18px Be Vietnam Pro, sans-serif"); lab(ctx, "Bây giờ cả đường kính và khối lượng đều được tính.", 40, 146, "#c3c7f0", "600 14px Be Vietnam Pro, sans-serif"); }
      return;
    }
    const sp = (d, m) => [40 + (d / DM) * 560, 440 - (m / MM) * 400];
    if (s === 3) { ST.data.forEach((p) => { const [x, y] = sp(p.d, p.m); fruit(ctx, x, y, CLS[p.c].c, 6); }); centroids().forEach((c) => { const [x, y] = sp(c.d, c.m); ctx.strokeStyle = CLS[c.c].c; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 16, 0, 7); ctx.stroke(); lab(ctx, `${CLS[c.c].n} (${nf(c.d, 1)}; ${Math.round(c.m)})`, x + 20, y + 4, "#fff", "700 12px Be Vietnam Pro, sans-serif"); }); return; }
    if (s === 4) { buildMap(); for (let j = 0; j < map.rows; j += 2) for (let i = 0; i < map.cols; i += 2) { const v = map.v[j * map.cols + i]; ctx.fillStyle = v < 0 ? "#2b2f6e" : CLS[v].c; ctx.globalAlpha = 0.5; ctx.fillRect(40 + (i / map.cols) * 560, 40 + (j / map.rows) * 400, (2 / map.cols) * 560 + 1, (2 / map.rows) * 400 + 1); } ctx.globalAlpha = 1; ST.data.forEach((p) => { const [x, y] = sp(p.d, p.m); fruit(ctx, x, y, CLS[p.c].c, 5); }); lab(ctx, ST.mode === "nn" ? "Bản đồ theo hàng xóm gần nhất" : "Bản đồ theo điểm đại diện", 50, 30, "#fff", "800 14px Be Vietnam Pro, sans-serif"); return; }
    const q = { d: 12, m: 420 }, r = classify(q); ST.data.forEach((p) => { const [x, y] = sp(p.d, p.m); fruit(ctx, x, y, CLS[p.c].c, 6); }); const [qx, qy] = sp(q.d, q.m); star(ctx, qx, qy); const [bx, by] = sp(r.best.r.d, r.best.r.m); ctx.strokeStyle = "#fff"; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(qx, qy); ctx.lineTo(bx, by); ctx.stroke(); ctx.setLineDash([]);
    lab(ctx, `Quả dưa lê: gần nhất là ${CLS[r.best.r.c].n.toLowerCase()}, cách ${nf(r.best.k.d)}`, 40, 40, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, r.c < 0 ? "Máy nói: không biết" : `Máy nói: ${CLS[r.c].n} (chưa bật ngưỡng)`, 40, 66, r.c < 0 ? "#5ef2d6" : "#ff8f6b", "700 14px Be Vietnam Pro, sans-serif");
  }
  function soiLive() { const s = soiStep, el = $("soiLive"), r = classify(ST.q); if (s <= 2) el.innerHTML = ST.norm ? `Hai trục <span class="hl">cùng thang</span>` : `Đang <span class="w">cộng thẳng cm và g</span>`; else el.innerHTML = `Quả bí ẩn → <span class="hl">${r.c < 0 ? "không biết" : CLS[r.c].n}</span> · đúng <span class="w">${acc().reduce((a, b) => a + b, 0)}/40</span>`; }

  // ---------- điều khiển ----------
  let setD, setM, setMax;
  function bind() {
    setD = P.range("d", () => ST.q.d, (v) => (ST.q.d = v), (v) => nf(v, 1) + " cm", () => { prog.done("place"); update(); });
    setM = P.range("m", () => ST.q.m, (v) => (ST.q.m = v), (v) => Math.round(v) + " g", () => { prog.done("place"); update(); });
    setMax = P.range("maxd", () => ST.maxd, (v) => (ST.maxd = v), (v) => (v >= 0.59 ? "tắt" : nf(v)), update);
    const pos = (e) => { const rc = stage.getBoundingClientRect(); return [((e.clientX - rc.left) / rc.width) * W, ((e.clientY - rc.top) / rc.height) * H]; };
    const put = (e) => { const [x, y] = pos(e); ST.q.d = Math.max(2, Math.min(14, Dd(x))); ST.q.m = Math.max(20, Math.min(450, Mm(y))); setD(); setM(); prog.done("place"); update(); };
    stage.addEventListener("pointerdown", (e) => { ST.drag = true; stage.setPointerCapture(e.pointerId); put(e); });
    stage.addEventListener("pointermove", (e) => ST.drag && put(e)); const up = () => (ST.drag = false); stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    $("modeBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.mode = b.dataset.m; ST.modes.add(ST.mode); if (ST.modes.size >= 2) prog.done("mode"); $("modeBtns").querySelectorAll("button").forEach((x) => x.classList.toggle("ghost", x !== b)); update(); }));
    $("optNorm").onchange = (e) => { ST.norm = e.target.checked; update(); };
    $("btnRand").onclick = () => { const t = TEST[Math.floor(Math.random() * TEST.length)]; ST.q = { d: t.d, m: t.m }; setD(); setM(); update(); guide(`Một quả <b>${CLS[t.c].n.toLowerCase()}</b> thật vừa được đặt lên cân. Máy có xếp đúng không?`); };
    $("teachSel").innerHTML = CLS.map((c, i) => `<option value="${i}">${c.n}</option>`).join("");
    $("btnTeach").onclick = () => { const c = +$("teachSel").value; ST.data.push({ c, d: +ST.q.d.toFixed(1), m: Math.round(ST.q.m), mine: true }); prog.done("teach"); update(); guide(`Đã thêm một quả <b>${CLS[c].n.toLowerCase()}</b> (viền trắng) vào dữ liệu. Bản đồ phân loại đổi ngay.`); };
    $("btnResetData").onclick = () => { ST.data = BASE.slice(); update(); };
    const clear = () => { ST.data = BASE.slice(); ST.norm = true; $("optNorm").checked = true; ST.maxd = 0.6; setMax(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    const setMode = (m) => $("modeBtns").querySelector(`[data-m=${m}]`).click();
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "units") { setMode("nn"); ST.norm = false; $("optNorm").checked = false; const w = TEST.find((t) => t.c === 1 && classify(t).c !== 1) || { d: 6.7, m: 84 }; ST.q = { d: w.d, m: w.m }; setD(); setM(); update(); guide(`Cộng thẳng cm với g: bản đồ thành các dải ngang. Quả quýt ${nf(w.d, 1)} cm, ${w.m} g bị xếp thành <b>${CLS[classify(ST.q).c].n.toLowerCase()}</b>. Máy chỉ đúng <b>${acc().reduce((a, c) => a + c, 0)}/40</b> quả. Bật lại <b>Đưa hai trục về cùng thang</b>.`); }
      if (k === "typo") { setMode("nn"); ST.data = BASE.concat(BAD); ST.q = { d: 7.9, m: 212 }; setD(); setM(); update(); guide(`Hai quả cam bị dán nhãn chanh (viền đỏ) tạo ra một hòn đảo màu chanh giữa vùng cam. Quả cam bí ẩn bị xếp thành <b>${CLS[classify(ST.q).c].n.toLowerCase()}</b>. Thử chuyển sang <b>Điểm đại diện mỗi loại</b>.`); }
      if (k === "weird") { ST.q = { d: 12, m: 420 }; setD(); setM(); update(); guide(`Quả dưa lê bị xếp thành <b>${CLS[classify(ST.q).c].n.toLowerCase()}</b>. Kéo thanh <b>Nói "không biết"</b> xuống khoảng 0,15.`); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); ST.q = { d: 6.5, m: 95 }; setD(); setM(); update(); guide("Mọi sự cố đã tắt, dữ liệu trở lại như cũ."); };
  }

  const QUIZ = [
    { q: "Điểm A(1; 2) và điểm B(4; 6). Khoảng cách AB là bao nhiêu?", o: ["7", "5", "25", "3"], a: 1, e: "Δx = 3, Δy = 4, AB = √(9 + 16) = √25 = 5." },
    { q: "Vì sao phải đưa đường kính (cm) và khối lượng (g) về cùng thang trước khi tính khoảng cách?", o: ["Vì máy tính không cộng được số lẻ", "Vì nếu không, khối lượng có số rất lớn sẽ lấn át đường kính", "Vì đường kính luôn quan trọng hơn", "Vì để số đẹp hơn"], a: 1, e: "Δ khối lượng hàng chục, hàng trăm gam lấn át Δ đường kính vài cm nếu cộng thẳng." },
    { q: "Điểm đại diện của một loại quả được tính thế nào?", o: ["Lấy quả to nhất", "Lấy trung bình tọa độ của các quả cùng loại", "Lấy quả đầu tiên được đo", "Chọn ngẫu nhiên"], a: 1, e: "Trung bình đường kính và trung bình khối lượng của các quả cùng loại." },
    { q: "Vài quả cam bị dán nhãn chanh. Cách phân loại nào ít bị ảnh hưởng hơn?", o: ["Hàng xóm gần nhất", "Điểm đại diện mỗi loại, vì lấy trung bình nhiều quả", "Cả hai bị ảnh hưởng như nhau", "Không cách nào bị ảnh hưởng"], a: 1, e: "Một vài điểm sai chỉ làm điểm đại diện xê dịch ít, còn hàng xóm gần nhất bị kéo theo ngay quanh điểm sai." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); update(); guide("Bấm vào một chỗ bất kỳ trên mặt phẳng để đặt <b>quả bí ẩn</b>. Máy vẽ một tam giác vuông tới quả gần nhất và tính khoảng cách bằng <b>định lý Pythagore</b>.");
  window.addEventListener("hka:theme", () => setTimeout(update, 50));
  window.__hka32 = { ST, classify, acc, TEST, BASE };
  requestAnimationFrame(tick);
})();
