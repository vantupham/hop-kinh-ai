/* Hộp Kính AI · Dự án 6 · Đoán hình em vẽ (đặc trưng, k hàng xóm gần nhất, dữ liệu tốt) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-26");
  const CLS = [{ id: "tron", name: "Hình tròn", col: "#3fe0c5" }, { id: "tamgiac", name: "Tam giác", col: "#a99dff" }, { id: "vuong", name: "Hình vuông", col: "#ffc34d" }, { id: "sao", name: "Ngôi sao", col: "#ff7d5f" }];
  const FEAT = { round: { n: "Độ tròn", max: 1, min: 0.2 }, corners: { n: "Số góc nhọn", max: 12 }, w: { n: "Chiều rộng", max: 400 }, h: { n: "Chiều cao", max: 400 } };
  const PAD = { x: 20, y: 20, w: 420, h: 400 };

  // ---------- sinh nét vẽ ----------
  function outline(id, cx, cy, r, rot, rnd, wob) {
    let V = [];
    if (id === "tron") for (let i = 0; i < 40; i++) { const a = rot + (i / 40) * 6.283, rr = r * (1 + (rnd() - 0.5) * wob * 0.15); V.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
    else { const n = id === "tamgiac" ? 3 : id === "vuong" ? 4 : id === "sao" ? 10 : 0; for (let i = 0; i < n; i++) { const a = rot + (i / n) * 6.283 - Math.PI / 2, rr = id === "sao" && i % 2 ? r * 0.42 : r; V.push([cx + rr * Math.cos(a) + (rnd() - 0.5) * wob * 8, cy + rr * Math.sin(a) + (rnd() - 0.5) * wob * 8]); } }
    if (id === "cong") V = [[-0.3, -1], [0.3, -1], [0.3, -0.3], [1, -0.3], [1, 0.3], [0.3, 0.3], [0.3, 1], [-0.3, 1], [-0.3, 0.3], [-1, 0.3], [-1, -0.3], [-0.3, -0.3]].map(([x, y]) => [cx + x * r, cy + y * r]);
    const pts = []; for (let i = 0; i < V.length; i++) { const a = V[i], b = V[(i + 1) % V.length], steps = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6)); for (let k = 0; k < steps; k++) pts.push([a[0] + ((b[0] - a[0]) * k) / steps + (rnd() - 0.5) * wob * 2, a[1] + ((b[1] - a[1]) * k) / steps + (rnd() - 0.5) * wob * 2]); }
    return pts;
  }
  function randomShape(rnd, id) { const r = 55 + rnd() * 110; return outline(id, PAD.w / 2 + (rnd() - 0.5) * (PAD.w - 2 * r - 20), PAD.h / 2 + (rnd() - 0.5) * (PAD.h - 2 * r - 20), r * (id === "tron" ? 0.85 : 1), rnd() * 6.283, rnd, 0.5 + rnd() * 1.2); }

  // ---------- đo đặc trưng ----------
  function resample(pts, n) {
    const c = pts.concat([pts[0]]); let L = 0; for (let i = 1; i < c.length; i++) L += Math.hypot(c[i][0] - c[i - 1][0], c[i][1] - c[i - 1][1]);
    const step = L / n, out = [c[0].slice()]; let acc = 0;
    for (let i = 1; i < c.length && out.length < n; i++) { let a = c[i - 1], b = c[i], d = Math.hypot(b[0] - a[0], b[1] - a[1]); while (acc + d >= step && out.length < n) { const t = (step - acc) / d, p = [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]; out.push(p); a = p; d = Math.hypot(b[0] - a[0], b[1] - a[1]); acc = 0; } acc += d; }
    return out;
  }
  function measure(pts) {
    if (!pts || pts.length < 8) return null;
    const R = resample(pts, 64), n = R.length; let A = 0, Pm = 0, x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (let i = 0; i < n; i++) { const a = R[i], b = R[(i + 1) % n]; A += a[0] * b[1] - b[0] * a[1]; Pm += Math.hypot(b[0] - a[0], b[1] - a[1]); x0 = Math.min(x0, a[0]); x1 = Math.max(x1, a[0]); y0 = Math.min(y0, a[1]); y1 = Math.max(y1, a[1]); }
    A = Math.abs(A) / 2; if (x1 - x0 < 15 && y1 - y0 < 15) return null;
    const turn = R.map((p, i) => { const a = R[(i - 3 + n) % n], b = R[(i + 3) % n], v1 = Math.atan2(p[1] - a[1], p[0] - a[0]), v2 = Math.atan2(b[1] - p[1], b[0] - p[0]); let d = Math.abs(v2 - v1); if (d > Math.PI) d = 2 * Math.PI - d; return (d * 180) / Math.PI; });
    const cs = []; turn.forEach((t, i) => { if (t < 55) return; for (let k = -3; k <= 3; k++) if (k && turn[(i + k + n) % n] > t) return; if (!cs.some((j) => Math.min(Math.abs(j - i), n - Math.abs(j - i)) < 4)) cs.push(i); });
    return { round: Math.min(1, (4 * Math.PI * A) / (Pm * Pm)), corners: cs.length, w: x1 - x0, h: y1 - y0, R, cs };
  }

  // ---------- dữ liệu ----------
  const mk = (rnd, id, c) => ({ c, f: measure(randomShape(rnd, id)) });
  const BASE = (() => { const r = P.rng(26), o = []; for (let k = 0; k < 8; k++) CLS.forEach((c, i) => o.push(mk(r, c.id, i))); return o; })();
  const TEST = (() => { const r = P.rng(260), o = []; for (let k = 0; k < 10; k++) CLS.forEach((c, i) => o.push(mk(r, c.id, i))); return o; })();
  const NOISY = (() => { const r = P.rng(2626), o = []; for (let k = 0; k < 4; k++) o.push({ c: 2, f: measure(randomShape(r, "tamgiac")), bad: true }); return o; })();
  const ST = { train: BASE.slice(), k: 3, maxd: 0.6, fx: "round", fy: "corners", stroke: [], drawing: false, cur: null, ks: new Set(), t: 0, brk: null };
  const nz = (f, k) => (f[k] - (FEAT[k].min || 0)) / (FEAT[k].max - (FEAT[k].min || 0)), coord = (f, fx, fy) => [nz(f, fx || ST.fx), nz(f, fy || ST.fy)];
  function knn(f, k, train) {
    train = train || ST.train; const q = coord(f), ds = train.map((t) => { const p = coord(t.f); return { t, d: Math.hypot(p[0] - q[0], p[1] - q[1]) }; }).sort((a, b) => a.d - b.d), nb = ds.slice(0, k || ST.k);
    const votes = CLS.map(() => 0); nb.forEach((x) => votes[x.t.c]++); const mx = Math.max(...votes), win = votes.map((v, i) => (v === mx ? i : -1)).filter((i) => i >= 0);
    const best = win.length > 1 ? nb.find((x) => win.includes(x.t.c)).t.c : win[0], unsure = ST.maxd < 0.59 && nb[0].d > ST.maxd;
    return { nb, votes, best: unsure ? -1 : best, d0: nb[0].d };
  }
  const accFor = (k) => TEST.reduce((s, x) => s + (knn(x.f, k).best === x.c ? 1 : 0), 0);

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d"), SP = { x: 490, y: 52, w: 350, h: 340 };
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  const SX = (v, sp) => sp.x + Math.min(1.05, v) * sp.w, SY = (v, sp) => sp.y + sp.h - Math.min(1.05, v) * sp.h;
  function plane(ctx, sp, o) {
    o = o || {}; ctx.fillStyle = "#171b40"; ctx.fillRect(sp.x, sp.y, sp.w, sp.h); ctx.strokeStyle = "#2c3270"; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) { ctx.beginPath(); ctx.moveTo(sp.x + (i * sp.w) / 4, sp.y); ctx.lineTo(sp.x + (i * sp.w) / 4, sp.y + sp.h); ctx.moveTo(sp.x, sp.y + (i * sp.h) / 4); ctx.lineTo(sp.x + sp.w, sp.y + (i * sp.h) / 4); ctx.stroke(); }
    lab(ctx, FEAT[ST.fx].n + " →", sp.x + sp.w, sp.y + sp.h + 18, "#8f96d4", "700 11px Be Vietnam Pro, sans-serif", "right"); ctx.save(); ctx.translate(sp.x - 8, sp.y); ctx.rotate(-Math.PI / 2); lab(ctx, "← " + FEAT[ST.fy].n, -sp.h, 0, "#8f96d4", "700 11px Be Vietnam Pro, sans-serif"); ctx.restore();
    const r = o.r || 5, jit = (t) => (((t.f.round * 997) % 1) - 0.5) * 0.02;
    ST.train.forEach((t) => { const [a, b] = coord(t.f), x = SX(a, sp), y = SY(b + jit(t), sp); ctx.fillStyle = CLS[t.c].col; ctx.globalAlpha = 0.85; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.globalAlpha = 1; if (t.mine || t.bad) { ctx.strokeStyle = t.bad ? "#ff5d5d" : "#fff"; ctx.lineWidth = 2; ctx.stroke(); } });
    if (o.res && o.f) { const [a, b] = coord(o.f), x = SX(a, sp), y = SY(b, sp); if (o.lines) o.res.nb.forEach((n) => { const [c, d] = coord(n.t.f); ctx.strokeStyle = CLS[n.t.c].col; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(SX(c, sp), SY(d + jit(n.t), sp)); ctx.stroke(); });
      if (o.ring) { const rr = o.res.nb[o.res.nb.length - 1].d; ctx.setLineDash([4, 4]); ctx.strokeStyle = "#ffc34d"; ctx.beginPath(); ctx.ellipse(x, y, rr * sp.w, rr * sp.h, 0, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
      ctx.fillStyle = "#fff"; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? 5 : 12; ctx.lineTo(x + rr * Math.cos(a), y + rr * Math.sin(a)); } ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#1b1f4a"; ctx.lineWidth = 1.5; ctx.stroke(); }
  }
  function renderStage() {
    const ctx = sctx; D.labBg(ctx); ctx.fillStyle = "#f5f4ff"; D.rr(ctx, PAD.x, PAD.y, PAD.w, PAD.h, 14); ctx.fill();
    const pts = ST.stroke; if (pts.length > 1) { ctx.strokeStyle = "#1b1f4a"; ctx.lineWidth = 5; ctx.lineCap = ctx.lineJoin = "round"; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(PAD.x + p[0], PAD.y + p[1]) : ctx.moveTo(PAD.x + p[0], PAD.y + p[1]))); if (!ST.drawing) ctx.closePath(); ctx.stroke(); }
    else lab(ctx, "Vẽ một nét ở đây", PAD.x + PAD.w / 2, PAD.y + PAD.h / 2, "#9aa0c8", "600 16px Be Vietnam Pro, sans-serif", "center");
    if (ST.cur && !ST.drawing) ST.cur.f.cs.forEach((i) => { const p = ST.cur.f.R[i]; ctx.fillStyle = "#ff5d5d"; ctx.beginPath(); ctx.arc(PAD.x + p[0], PAD.y + p[1], 6, 0, 7); ctx.fill(); });
    plane(sctx, SP, ST.cur && !ST.drawing ? { res: ST.cur.res, f: ST.cur.f, lines: true, ring: true } : {});
    CLS.forEach((c, i) => { ctx.fillStyle = c.col; ctx.beginPath(); ctx.arc(SP.x + 8 + i * 92, 430, 5, 0, 7); ctx.fill(); lab(ctx, c.name, SP.x + 16 + i * 92, 434, "#c3c7f0", "600 11px Be Vietnam Pro, sans-serif"); });
  }
  const guide = (h) => ($("guideText").innerHTML = h);
  function classify() {
    const f = measure(ST.stroke); if (!f) { ST.cur = null; update(); return; }
    ST.cur = { f, res: knn(f) }; update();
  }
  function update() {
    const c = ST.cur;
    if (!c) $("askText").innerHTML = "Vẽ một hình bằng <b>một nét liền</b> trong khung trắng: hình tròn, tam giác, hình vuông hoặc ngôi sao.";
    else { const b = c.res.best; $("askText").innerHTML = b < 0 ? `Máy nói: <b>Không chắc</b>. Hàng xóm gần nhất ở xa tới ${c.res.d0.toFixed(2)}, có lẽ đây là hình máy chưa từng học.` : `Máy đoán: <b style="color:${CLS[b].col}">${CLS[b].name}</b>. ${c.res.nb.length} hàng xóm gần nhất bỏ phiếu: ${c.res.votes.map((v, i) => (v ? `${CLS[i].name} ${v}` : "")).filter(Boolean).join(", ")}.`; }
    $("bGuess").textContent = c ? (c.res.best < 0 ? "Không chắc" : CLS[c.res.best].name) : "—"; $("bGuess").style.color = c && c.res.best >= 0 ? CLS[c.res.best].col : "#fff";
    $("bVotes").innerHTML = CLS.map((k, i) => { const v = c ? c.res.votes[i] : 0; return `<div class="r"><span style="color:${k.col}">${k.name.replace("Hình ", "")}</span><div class="bar"><i style="width:${(v / ST.k) * 100}%;background:${k.col}"></i></div><span>${v}</span></div>`; }).join("");
    $("bFeat").innerHTML = c ? `Độ tròn <b style="color:#5ef2d6">${c.f.round.toFixed(2)}</b> · Số góc nhọn <b style="color:#ff8f6b">${c.f.corners}</b><br>Rộng ${Math.round(c.f.w)} · Cao ${Math.round(c.f.h)} (điểm ảnh)` : "Chưa có hình";
    $("bN").textContent = ST.train.length; $("bDist").textContent = c ? c.res.d0.toFixed(2) : "—";
    const a = accFor(ST.k); $("bAcc").textContent = `${a}/40`; $("bAcc").style.color = a >= 34 ? "#5ef2d6" : a >= 24 ? "#ffc34d" : "#ff8f6b";
    renderChart();
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 46, B = 34, T = 16; ctx.clearRect(0, 0, W, H);
    const ks = [1, 3, 5, 7, 9, 11, 13, 15], bw = (W - L - 10) / ks.length, Y = (v) => T + (1 - v / 40) * (H - T - B);
    ctx.font = "11px JetBrains Mono, monospace"; [0, 10, 20, 30, 40].forEach((v) => { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - 10, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v, 14, Y(v) + 4); });
    ks.forEach((k, i) => { const a = accFor(k), x = L + i * bw, on = k === ST.k; ctx.fillStyle = on ? TH.mint : TH.violet; ctx.globalAlpha = on ? 1 : 0.55; D.rr(ctx, x + bw * 0.2, Y(a), bw * 0.6, H - B - Y(a), 6); ctx.fill(); ctx.globalAlpha = 1; ctx.fillStyle = TH.ink; ctx.font = "700 13px JetBrains Mono, monospace"; ctx.fillText(a, x + bw / 2 - 8, Y(a) - 6); ctx.font = (on ? "800 " : "600 ") + "12px Be Vietnam Pro, sans-serif"; ctx.fillStyle = on ? TH.mint : TH.text; ctx.fillText("k = " + k, x + bw / 2 - 18, H - 12); });
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Nét vẽ thành điểm", e: "image", d: "Máy ghi lại nét vẽ thành một dãy <b>điểm</b> có tọa độ, rồi rải lại thành 64 điểm cách đều nhau để hình to hay nhỏ đều được đo như nhau." },
    { t: "Đo đặc trưng", e: "scan", d: "Máy đo hai con số. <b>Độ tròn</b>: so diện tích với chu vi (hình tròn gần 1, ngôi sao rất nhỏ). <b>Số góc nhọn</b>: đếm chỗ nét đổi hướng đột ngột (chấm đỏ)." },
    { t: "Thành một chấm", e: "crosshair", d: "Hai con số là <b>tọa độ</b> của một chấm trên mặt phẳng đặc trưng. Mỗi hình mẫu máy nhớ cũng là một chấm, tô màu theo tên của nó." },
    { t: "Tìm hàng xóm", e: "target", d: "Máy đo <b>khoảng cách</b> từ chấm mới tới mọi chấm mẫu và lấy <b>k chấm gần nhất</b> (vòng tròn vàng)." },
    { t: "Bỏ phiếu", e: "chart", d: "Mỗi hàng xóm bỏ một phiếu cho tên của nó. Tên nhiều phiếu nhất là câu trả lời. Nếu hàng xóm gần nhất ở quá xa, máy nên nói <b>không chắc</b>." },
    { t: "Học thêm mẫu", e: "book", d: "Máy không có công thức nào: muốn máy giỏi hơn, chỉ cần <b>thêm mẫu đúng</b>. Đây là cách học máy đơn giản nhất: <b>học bằng cách nhớ ví dụ</b>." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const ctx = octx, s = soiStep, f = ST.cur ? ST.cur.f : TEST[3].f, res = ST.cur ? ST.cur.res : knn(TEST[3].f); D.labBg(ctx);
    const box = { x: 20, y: 40, w: 290, h: 290 }, sc = 290 / 420, R = f.R;
    const drawShape = (pts, close) => { ctx.fillStyle = "#f5f4ff"; D.rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill(); ctx.strokeStyle = "#1b1f4a"; ctx.lineWidth = 3; ctx.beginPath(); pts.forEach((p, i) => (i ? ctx.lineTo(box.x + p[0] * sc, box.y + p[1] * sc) : ctx.moveTo(box.x + p[0] * sc, box.y + p[1] * sc))); if (close) ctx.closePath(); ctx.stroke(); };
    lab(ctx, ST.cur ? "Hình em vẽ" : "Hình mẫu (em hãy vẽ một hình)", 20, 28, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif");
    if (s === 0) { drawShape(R, true); const k = Math.floor(ST.t * 12) % (R.length + 10); R.forEach((p, i) => { if (i > k) return; ctx.fillStyle = "#7c6bff"; ctx.beginPath(); ctx.arc(box.x + p[0] * sc, box.y + p[1] * sc, 4, 0, 7); ctx.fill(); }); lab(ctx, `${Math.min(k + 1, R.length)} / 64 điểm`, 340, 80, "#ffc34d", "800 18px JetBrains Mono, monospace"); R.slice(0, 6).forEach((p, i) => lab(ctx, `(${Math.round(p[0])}, ${Math.round(p[1])})`, 340, 120 + i * 22, "#c3c7f0", "600 12px JetBrains Mono, monospace")); lab(ctx, "…", 340, 254); return; }
    if (s === 1) { ctx.fillStyle = "#f5f4ff"; D.rr(ctx, box.x, box.y, box.w, box.h, 12); ctx.fill(); ctx.fillStyle = "rgba(124,107,255,.3)"; ctx.beginPath(); R.forEach((p, i) => (i ? ctx.lineTo(box.x + p[0] * sc, box.y + p[1] * sc) : ctx.moveTo(box.x + p[0] * sc, box.y + p[1] * sc))); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#1b1f4a"; ctx.lineWidth = 3; ctx.stroke(); f.cs.forEach((i) => { const p = R[i]; ctx.fillStyle = "#ff5d5d"; ctx.beginPath(); ctx.arc(box.x + p[0] * sc, box.y + p[1] * sc, 7, 0, 7); ctx.fill(); });
      lab(ctx, "Độ tròn", 340, 80, "#5ef2d6", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, "= 4 × 3,14 × diện tích ÷ chu vi²", 340, 102, "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif"); lab(ctx, f.round.toFixed(2), 340, 140, "#5ef2d6", "800 30px JetBrains Mono, monospace");
      lab(ctx, "Số góc nhọn (chấm đỏ)", 340, 200, "#ff8f6b", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, String(f.corners), 340, 244, "#ff8f6b", "800 30px JetBrains Mono, monospace"); lab(ctx, "Hình tròn ≈ 1.00 · vuông ≈ 0.78 · tam giác ≈ 0.60", 20, 370, "#ffc34d", "600 12px Be Vietnam Pro, sans-serif"); return; }
    const sp = { x: 70, y: 40, w: 380, h: 380 };
    plane(ctx, sp, { res, f, lines: s >= 3, ring: s >= 3, r: 6 });
    if (s === 2) { lab(ctx, `(${f[ST.fx].toFixed ? (+f[ST.fx]).toFixed(2) : f[ST.fx]}, ${(+f[ST.fy]).toFixed(ST.fy === "corners" ? 0 : 2)})`, 470, 80, "#fff", "800 16px JetBrains Mono, monospace"); lab(ctx, "Ngôi sao trắng:", 470, 110); lab(ctx, "hình cần đoán", 470, 128); lab(ctx, `Chấm màu: ${ST.train.length} mẫu`, 470, 170); return; }
    if (s === 3) { lab(ctx, `k = ${ST.k} hàng xóm`, 470, 80, "#ffc34d", "800 16px Be Vietnam Pro, sans-serif"); res.nb.slice(0, 9).forEach((n, i) => lab(ctx, `${CLS[n.t.c].name.replace("Hình ", "")} · ${n.d.toFixed(2)}`, 470, 110 + i * 20, CLS[n.t.c].col, "600 12px Be Vietnam Pro, sans-serif")); return; }
    if (s === 4) { lab(ctx, "Phiếu bầu", 470, 80, "#ffc34d", "800 16px Be Vietnam Pro, sans-serif"); CLS.forEach((c, i) => { const y = 100 + i * 40; ctx.fillStyle = "#232866"; ctx.fillRect(470, y, 150, 24); ctx.fillStyle = c.col; ctx.fillRect(470, y, (res.votes[i] / ST.k) * 150, 24); lab(ctx, `${c.name.replace("Hình ", "")} ${res.votes[i]}`, 476, y + 17, "#fff"); }); lab(ctx, res.best < 0 ? "Không chắc" : CLS[res.best].name, 470, 290, res.best < 0 ? "#fff" : CLS[res.best].col, "800 18px Be Vietnam Pro, sans-serif"); return; }
    lab(ctx, `${ST.train.length} mẫu`, 470, 80, "#ffc34d", "800 16px Be Vietnam Pro, sans-serif"); lab(ctx, `${ST.train.filter((t) => t.mine).length} mẫu do em thêm`, 470, 104, "#fff"); lab(ctx, "(viền trắng)", 470, 122); lab(ctx, `Đúng ${accFor(ST.k)}/40 hình`, 470, 170, "#5ef2d6", "800 15px Be Vietnam Pro, sans-serif");
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), f = ST.cur ? ST.cur.f : TEST[3].f, res = ST.cur ? ST.cur.res : knn(TEST[3].f);
    if (s <= 1) el.innerHTML = `Độ tròn <span class="hl">${f.round.toFixed(2)}</span> · số góc <span class="w">${f.corners}</span>`;
    else if (s === 2) el.innerHTML = `Máy đang nhớ <span class="hl">${ST.train.length}</span> chấm mẫu`;
    else if (s <= 4) el.innerHTML = `k = <span class="hl">${ST.k}</span> · gần nhất cách <span class="w">${res.d0.toFixed(2)}</span>`;
    else el.innerHTML = `Đúng <span class="hl">${accFor(ST.k)}</span>/40 hình kiểm tra`;
  }

  // ---------- điều khiển ----------
  function bind() {
    const pos = (e) => { const r = stage.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * stage.width - PAD.x, ((e.clientY - r.top) / r.height) * stage.height - PAD.y]; };
    const inPad = (p) => p[0] >= 0 && p[1] >= 0 && p[0] <= PAD.w && p[1] <= PAD.h;
    stage.addEventListener("pointerdown", (e) => { const p = pos(e); if (!inPad(p)) return; ST.drawing = true; ST.stroke = [p]; ST.cur = null; stage.setPointerCapture(e.pointerId); });
    stage.addEventListener("pointermove", (e) => { if (!ST.drawing) return; const p = pos(e); p[0] = Math.max(0, Math.min(PAD.w, p[0])); p[1] = Math.max(0, Math.min(PAD.h, p[1])); const l = ST.stroke[ST.stroke.length - 1]; if (Math.hypot(p[0] - l[0], p[1] - l[1]) > 3) ST.stroke.push(p); });
    const up = () => { if (!ST.drawing) return; ST.drawing = false; classify(); if (ST.cur) prog.done("draw"); };
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    $("btnClear").onclick = () => { ST.stroke = []; ST.cur = null; update(); };
    $("btnHelp").onclick = () => { const i = Math.floor(Math.random() * 4); ST.stroke = randomShape(Math.random, CLS[i].id); classify(); guide(`Máy vẽ giúp một <b>${CLS[i].name.toLowerCase()}</b> hơi méo, như người vẽ tay. Máy có đoán đúng không?`); };
    $("teachSel").innerHTML = CLS.map((c, i) => `<option value="${i}">${c.name}</option>`).join("");
    $("btnTeach").onclick = () => { if (!ST.cur) { guide("Em hãy vẽ một hình trước đã."); return; } const c = +$("teachSel").value; ST.train.push({ c, f: ST.cur.f, mine: true }); prog.done("teach"); classify(); guide(`Máy đã nhớ thêm một mẫu <b>${CLS[c].name.toLowerCase()}</b> (chấm viền trắng). Bây giờ máy có ${ST.train.length} mẫu.`); };
    $("btnResetTrain").onclick = () => { ST.train = BASE.slice(); classify(); };
    const opts = Object.keys(FEAT).map((k) => `<option value="${k}">${FEAT[k].n}</option>`).join(""); $("fx").innerHTML = opts; $("fy").innerHTML = opts; $("fx").value = ST.fx; $("fy").value = ST.fy;
    $("fx").onchange = (e) => { ST.fx = e.target.value; classify(); }; $("fy").onchange = (e) => { ST.fy = e.target.value; classify(); };
    const setK = P.range("k", () => ST.k, (v) => (ST.k = v), (v) => v, () => { ST.ks.add(ST.k); if (ST.ks.size >= 3) prog.done("k"); classify(); });
    const setD = P.range("maxd", () => ST.maxd, (v) => (ST.maxd = v), (v) => (v >= 0.59 ? "tắt" : v.toFixed(2)), classify);
    const clear = () => { ST.train = BASE.slice(); ST.k = 3; setK(); ST.maxd = 0.6; setD(); ST.fx = "round"; ST.fy = "corners"; $("fx").value = "round"; $("fy").value = "corners"; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "noisy") { ST.train = BASE.concat(NOISY); ST.k = 1; setK(); ST.stroke = outline("tamgiac", 210, 210, 150, 0.3, P.rng(9), 0.6); classify(); guide(`Bộ mẫu có 4 tam giác bị ghi nhầm là hình vuông (chấm vàng viền đỏ). Với k = 1, máy chỉ đúng <b>${accFor(1)}/40</b> hình kiểm tra. Thử kéo <b>k</b> lên 5 hoặc 7.`); }
      if (k === "feat") { ST.fx = "w"; ST.fy = "h"; $("fx").value = "w"; $("fy").value = "h"; ST.stroke = outline("tron", 210, 200, 150, 0, P.rng(3), 0.5); classify(); guide(`Đo bằng chiều rộng và chiều cao, các màu trộn lẫn hết vào nhau: máy chỉ đúng <b>${accFor(ST.k)}/40</b> hình. Đổi trục về <b>Độ tròn</b> và <b>Số góc nhọn</b>.`); }
      if (k === "weird") { ST.stroke = outline("cong", 210, 200, 160, 0, P.rng(4), 0.3); classify(); guide(`Một <b>dấu cộng</b>! Máy vẫn gọi nó là <b>${ST.cur.res.best < 0 ? "không chắc" : CLS[ST.cur.res.best].name.toLowerCase()}</b>, dù hàng xóm gần nhất cách tới ${ST.cur.res.d0.toFixed(2)}. Kéo thanh <b>Nói "không chắc"</b> xuống khoảng 0.15.`); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); ST.stroke = []; ST.cur = null; update(); guide("Mọi sự cố đã tắt. Vẽ thử một hình mới nhé!"); };
  }

  const QUIZ = [
    { q: "Trong dự án, \"đặc trưng\" của một hình là gì?", o: ["Màu của nét vẽ", "Những con số đo được từ hình, như độ tròn và số góc nhọn", "Tên của hình", "Người đã vẽ hình"], a: 1, e: "Máy biến hình thành các con số đo được, gọi là đặc trưng, rồi so sánh các con số đó." },
    { q: "Với k = 5, máy quyết định thế nào?", o: ["Chọn mẫu xa nhất", "Lấy 5 mẫu gần nhất, loại nào nhiều phiếu nhất thì chọn", "Đoán ngẫu nhiên 5 lần", "Hỏi người vẽ"], a: 1, e: "5 hàng xóm gần nhất bỏ phiếu, số đông quyết định." },
    { q: "Vì sao chiều rộng và chiều cao là đặc trưng kém để phân biệt hình tròn với hình vuông?", o: ["Vì khó đo", "Vì hình tròn và hình vuông cùng cỡ có chiều rộng, chiều cao gần như nhau", "Vì máy không biết đo chiều cao", "Vì chiều rộng luôn bằng 0"], a: 1, e: "Đặc trưng tốt phải khác nhau giữa các loại; kích thước thì phụ thuộc em vẽ to hay nhỏ." },
    { q: "Em vẽ một hình máy chưa từng học. Một máy đoán tốt nên làm gì?", o: ["Luôn chọn hình tròn", "Nói \"không chắc\" khi hàng xóm gần nhất ở quá xa", "Tắt máy", "Chọn tên dài nhất"], a: 1, e: "Biết mình không biết là một điểm quan trọng của máy đáng tin." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); update(); guide("Kéo chuột hoặc ngón tay trong khung trắng, vẽ <b>một nét</b> thành hình tròn, tam giác, hình vuông hoặc ngôi sao. Chấm của hình em vẽ sẽ hiện trên mặt phẳng bên phải.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka26 = { ST, knn, accFor, measure, TEST, BASE, outline };
  requestAnimationFrame(tick);
})();
