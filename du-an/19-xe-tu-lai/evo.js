/* Hộp Kính AI · Dự án 19 · Xe tự lái tiến hóa (cảm biến tia + mạng nơ-ron nhỏ + thuật toán di truyền) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-19");
  const NC = 200, NIN = 5, NH = 6, NOUT = 2, NG = (NIN + 1) * NH + (NH + 1) * NOUT, RAY = 130, MAXT = 900;
  const ANG = [-1.05, -0.5, 0, 0.5, 1.05];
  const DEF = { rate: 0.12, strength: 0.6, pop: 40, fit: "dist", spf: 3, elite: 2 };
  const ST = { ...DEF, track: null, cars: [], gen: 1, t: 0, hist: [], running: true, bestEver: 0, lastParents: null, draw: null, simT: 0, lapsBest: 0 };
  // ---------- đường đua ----------
  function buildTrack(center, W) {
    const n = center.length, cum = [0]; for (let i = 1; i <= n; i++) { const a = center[i - 1], b = center[i % n]; cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
    const nrm = center.map((p, i) => { const a = center[(i - 1 + n) % n], b = center[(i + 1) % n], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [-dy / L, dx / L]; });
    const inner = center.map((p, i) => [p[0] + nrm[i][0] * W / 2, p[1] + nrm[i][1] * W / 2]), outer = center.map((p, i) => [p[0] - nrm[i][0] * W / 2, p[1] - nrm[i][1] * W / 2]);
    return { C: center, n, cum, total: cum[n], W, inner, outer };
  }
  function presetTrack(k) {
    const pts = []; for (let i = 0; i < NC; i++) { const t = (i / NC) * Math.PI * 2; const r = 1 + [0.12, 0.2, 0.22][k] * Math.sin(2 * t) + [0, 0.16, 0.1][k] * Math.cos(3 * t) + [0, 0, 0.2][k] * Math.sin(5 * t), sc = [1, 0.95, 0.86][k]; pts.push([320 + Math.cos(t) * 255 * r * sc, 240 + Math.sin(t) * 168 * r * sc]); }
    return buildTrack(pts, [60, 46, 40][k]);
  }
  function resampleLoop(raw) {
    const pts = raw.concat([raw[0]]), cum = [0]; for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const tot = cum[cum.length - 1], out = []; let j = 0; for (let i = 0; i < NC; i++) { const d = (i / NC) * tot; while (cum[j + 1] < d) j++; const u = (d - cum[j]) / ((cum[j + 1] - cum[j]) || 1); out.push([pts[j][0] + (pts[j + 1][0] - pts[j][0]) * u, pts[j][1] + (pts[j + 1][1] - pts[j][1]) * u]); }
    for (let it = 0; it < 6; it++) for (let i = 0; i < NC; i++) { const a = out[(i - 1 + NC) % NC], b = out[(i + 1) % NC]; out[i] = [(a[0] + 2 * out[i][0] + b[0]) / 4, (a[1] + 2 * out[i][1] + b[1]) / 4]; }
    return { pts: out, tot };
  }
  // ---------- mạng nơ-ron của xe ----------
  const rnd = () => Math.random() * 2 - 1;
  function think(g, x) {
    const h = new Array(NH); let k = 0;
    for (let j = 0; j < NH; j++) { let s = g[k++]; for (let i = 0; i < NIN; i++) s += g[k++] * x[i]; h[j] = Math.tanh(s); }
    const o = []; for (let j = 0; j < NOUT; j++) { let s = g[k++]; for (let i = 0; i < NH; i++) s += g[k++] * h[i]; o.push(Math.tanh(s)); }
    return { h, o };
  }
  function newCar(g) { const T = ST.track, a = T.C[0], b = T.C[2]; return { g, x: a[0], y: a[1], h: Math.atan2(b[1] - a[1], b[0] - a[0]), v: 2, alive: true, idx: 0, prog: 0, best: 0, stall: 0, age: 0, fit: 0, sens: ANG.map(() => 1), out: [0, 0], hid: new Array(NH).fill(0) }; }
  function populate(genomes) { ST.cars = genomes.map(newCar); ST.t = 0; }
  // ---------- mô phỏng ----------
  function segHit(px, py, dx, dy, a, b) { const ex = b[0] - a[0], ey = b[1] - a[1], den = dx * ey - dy * ex; if (Math.abs(den) < 1e-9) return Infinity; const t = ((a[0] - px) * ey - (a[1] - py) * ex) / den, u = ((a[0] - px) * dy - (a[1] - py) * dx) / den; return t >= 0 && u >= 0 && u <= 1 ? t : Infinity; }
  function sense(c) {
    const T = ST.track; return ANG.map((da) => { const dx = Math.cos(c.h + da), dy = Math.sin(c.h + da); let best = RAY; for (let k = -30; k <= 30; k++) { const i = (c.idx + k + T.n * 4) % T.n, j = (i + 1) % T.n; best = Math.min(best, segHit(c.x, c.y, dx, dy, T.inner[i], T.inner[j]), segHit(c.x, c.y, dx, dy, T.outer[i], T.outer[j])); } return best / RAY; });
  }
  function updateIdx(c) { const T = ST.track; let bi = c.idx, bd = Infinity; for (let k = -8; k <= 12; k++) { const i = (c.idx + k + T.n * 4) % T.n, d = (T.C[i][0] - c.x) ** 2 + (T.C[i][1] - c.y) ** 2; if (d < bd) { bd = d; bi = i; } } let dIdx = bi - (c.idx % T.n); if (dIdx > T.n / 2) dIdx -= T.n; if (dIdx < -T.n / 2) dIdx += T.n; c.idx = (c.idx + dIdx + T.n) % T.n; c.prog += dIdx; return Math.sqrt(bd); }
  function stepCar(c) {
    if (!c.alive) return;
    c.sens = sense(c); const { h, o } = think(c.g, c.sens); c.hid = h; c.out = o;
    c.h += o[0] * 0.08; c.v = 1 + (o[1] + 1) * 1.8; c.x += Math.cos(c.h) * c.v; c.y += Math.sin(c.h) * c.v; c.age++;
    const off = updateIdx(c); const T = ST.track;
    if (off > T.W / 2 || c.x < 0 || c.y < 0 || c.x > 640 || c.y > 480) { c.alive = false; }
    if (c.prog > c.best) { c.best = c.prog; c.stall = 0; } else c.stall++;
    if (ST.fit === "dist" && c.stall > 160) c.alive = false;
    c.fit = ST.fit === "dist" ? Math.max(0, c.best) * (T.total / T.n) : c.age;
  }
  function stepAll() { let alive = 0; for (const c of ST.cars) { stepCar(c); if (c.alive) alive++; } ST.t++; if (!alive || ST.t >= MAXT) nextGen(); }
  // ---------- di truyền ----------
  function gauss() { return P.gauss(); }
  function nextGen() {
    const cars = ST.cars.slice().sort((a, b) => b.fit - a.fit), fits = cars.map((c) => c.fit), avg = fits.reduce((a, b) => a + b, 0) / fits.length;
    const laps = cars[0].best / ST.track.n;
    ST.hist.push({ best: fits[0], avg, laps, mode: ST.fit }); if (ST.hist.length > 120) ST.hist.shift(); if (laps >= 1) prog.done("lap");
    ST.lastRank = cars.map((c) => ({ fit: c.fit, laps: c.best / ST.track.n }));
    const top = cars.slice(0, Math.max(2, Math.floor(cars.length / 2))), pick = () => { const a = top[Math.floor(Math.random() * top.length)], b = top[Math.floor(Math.random() * top.length)]; return a.fit > b.fit ? a : b; };
    const G = cars.slice(0, Math.min(ST.elite, ST.pop)).map((c) => c.g.slice());
    let demo = null;
    while (G.length < ST.pop) {
      const pa = pick(), pb = pick(), mask = [], mut = [], child = pa.g.map((w, i) => { const fromB = Math.random() < 0.5; mask.push(fromB); let v = fromB ? pb.g[i] : w; if (Math.random() < ST.rate) { v += gauss() * ST.strength; mut.push(i); } return v; });
      if (!demo) demo = { a: pa.g.slice(), b: pb.g.slice(), mask, mut, child: child.slice() };
      G.push(child);
    }
    ST.lastParents = demo; ST.gen++; if (ST.gen >= 6) prog.done("gen5");
    populate(G);
  }
  function resetEvo() { ST.gen = 1; ST.hist = []; ST.lastParents = null; ST.lastRank = null; populate(Array.from({ length: ST.pop }, () => Array.from({ length: NG }, rnd))); }
  function fastGens(n) { for (let k = 0; k < n; k++) { const g0 = ST.gen; let guard = 0; while (ST.gen === g0 && guard++ < MAXT + 5) stepAll(); } }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  function drawTrack(ctx, T) {
    ctx.fillStyle = "#1b3a24"; ctx.fillRect(0, 0, 640, 480);
    ctx.fillStyle = "#3a3d55"; ctx.beginPath(); T.outer.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); T.inner.slice().reverse().forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.fill("evenodd");
    [T.inner, T.outer].forEach((L) => { ctx.strokeStyle = "#e8eaff"; ctx.lineWidth = 2.5; ctx.beginPath(); L.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke(); });
    ctx.setLineDash([10, 12]); ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 1.5; ctx.beginPath(); T.C.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]);
    const a = T.inner[0], b = T.outer[0]; for (let k = 0; k < 6; k++) { ctx.fillStyle = k % 2 ? "#fff" : "#111"; ctx.fillRect(a[0] + ((b[0] - a[0]) * k) / 6 - 3, a[1] + ((b[1] - a[1]) * k) / 6 - 3, 6, 6); }
  }
  function drawCar(ctx, c, col, big) { ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(c.h); ctx.globalAlpha = c.alive ? 1 : 0.22; ctx.fillStyle = col; const s = big ? 1.4 : 1; D.rr(ctx, -9 * s, -5 * s, 18 * s, 10 * s, 3); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.8)"; ctx.fillRect(3 * s, -3.5 * s, 4 * s, 7 * s); ctx.restore(); ctx.globalAlpha = 1; }
  const leader = () => { let b = null; for (const c of ST.cars) if (c.alive && (!b || c.fit > b.fit)) b = c; return b || ST.cars.reduce((x, y) => (y.fit > x.fit ? y : x)); };
  function rays(ctx, c, wide) { ANG.forEach((da, i) => { const d = c.sens[i] * RAY, x2 = c.x + Math.cos(c.h + da) * d, y2 = c.y + Math.sin(c.h + da) * d; ctx.strokeStyle = c.sens[i] < 0.35 ? "rgba(255,93,93,.9)" : "rgba(94,242,214,.7)"; ctx.lineWidth = wide ? 2 : 1.5; ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(x2, y2); ctx.stroke(); ctx.fillStyle = ctx.strokeStyle; ctx.beginPath(); ctx.arc(x2, y2, 3, 0, 7); ctx.fill(); }); }
  function renderStage() {
    const ctx = sctx; if (ST.draw) { ctx.fillStyle = "#1b3a24"; ctx.fillRect(0, 0, 640, 480); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 50; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.globalAlpha = 0.5; ctx.beginPath(); ST.draw.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]))); ctx.stroke(); ctx.globalAlpha = 1; ctx.fillStyle = "#fff"; ctx.font = "700 15px Be Vietnam Pro, sans-serif"; ctx.fillText("Giữ chuột và vẽ một vòng khép kín, rồi thả ra", 150, 30); return; }
    drawTrack(ctx, ST.track); const L = leader();
    ST.cars.forEach((c) => c !== L && drawCar(ctx, c, c.alive ? "#7c8cff" : "#9aa0c8"));
    if (L) { rays(ctx, L); drawCar(ctx, L, "#ffc34d", true); }
    ctx.fillStyle = "rgba(10,12,38,.8)"; D.rr(ctx, 10, 10, 196, 54, 10); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "800 15px Be Vietnam Pro, sans-serif"; ctx.fillText(`Thế hệ ${ST.gen}`, 22, 32); ctx.font = "11px JetBrains Mono, monospace"; ctx.fillStyle = "#c3c7f0"; ctx.fillText(`còn chạy ${ST.cars.filter((c) => c.alive).length}/${ST.cars.length} · ${Math.round((ST.t / MAXT) * 100)}% thời gian`, 22, 52);
  }
  function renderNet(cv, c) {
    const ctx = cv.getContext("2d"), W = cv.width, H = cv.height; ctx.clearRect(0, 0, W, H); if (!c) return;
    const col = (x) => (x[0] === "i" ? 30 : x[0] === "h" ? W / 2 : W - 30), pos = { i: (k) => 20 + k * ((H - 40) / (NIN - 1)), h: (k) => 14 + k * ((H - 28) / (NH - 1)), o: (k) => H / 2 - 30 + k * 60 };
    let k = 0; const g = c.g;
    for (let j = 0; j < NH; j++) { k++; for (let i = 0; i < NIN; i++) { const w = g[k++]; ctx.strokeStyle = w > 0 ? `rgba(94,242,214,${Math.min(0.9, Math.abs(w) * 0.4)})` : `rgba(255,125,95,${Math.min(0.9, Math.abs(w) * 0.4)})`; ctx.lineWidth = 1 + Math.min(3, Math.abs(w)); ctx.beginPath(); ctx.moveTo(30, pos.i(i)); ctx.lineTo(W / 2, pos.h(j)); ctx.stroke(); } }
    for (let j = 0; j < NOUT; j++) { k++; for (let i = 0; i < NH; i++) { const w = g[k++]; ctx.strokeStyle = w > 0 ? `rgba(94,242,214,${Math.min(0.9, Math.abs(w) * 0.4)})` : `rgba(255,125,95,${Math.min(0.9, Math.abs(w) * 0.4)})`; ctx.lineWidth = 1 + Math.min(3, Math.abs(w)); ctx.beginPath(); ctx.moveTo(W / 2, pos.h(i)); ctx.lineTo(W - 30, pos.o(j)); ctx.stroke(); } }
    const node = (x, y, v, lbl) => { ctx.fillStyle = v >= 0 ? `rgba(94,242,214,${0.25 + Math.abs(v) * 0.75})` : `rgba(255,125,95,${0.25 + Math.abs(v) * 0.75})`; ctx.beginPath(); ctx.arc(x, y, 9, 0, 7); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1; ctx.stroke(); if (lbl) { ctx.fillStyle = "#c3c7f0"; ctx.font = "9px JetBrains Mono, monospace"; ctx.fillText(lbl, x + (x < W / 2 ? -28 : 12), y + 3); } };
    c.sens.forEach((v, i) => node(30, pos.i(i), v, ["T60", "T30", "giữa", "P30", "P60"][i])); c.hid.forEach((v, j) => node(W / 2, pos.h(j), v)); c.out.forEach((v, j) => node(W - 30, pos.o(j), v, ["lái", "ga"][j]));
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Cảm biến", e: "scan", d: "Mỗi xe có 5 <b>tia cảm biến</b> đo khoảng cách tới mép đường theo 5 hướng. Xe không thấy cả đường đua, chỉ có 5 con số này. Tia đỏ: mép đường đã rất gần." },
    { t: "Bộ não nhỏ", e: "cpu", d: "5 con số đi qua một <b>mạng nơ-ron</b> nhỏ (5 → 6 → 2) như Dự án 11. Màu nét: trọng số dương (xanh) hay âm (cam). Mỗi xe có một bộ trọng số riêng: đó là <b>gen</b> của nó." },
    { t: "Lái và ga", e: "arrowR", d: "Hai đầu ra quyết định <b>đánh lái</b> trái/phải bao nhiêu và <b>nhấn ga</b> mạnh hay nhẹ. Lặp lại 60 lần mỗi giây." },
    { t: "Chấm điểm", e: "award", d: "Khi hết giờ hoặc mọi xe đều đâm, mỗi xe được chấm <b>độ thích nghi</b>: ở đây là quãng đường đi được dọc theo đường đua." },
    { t: "Chọn lọc", e: "chart", d: "Xếp hạng cả đàn. Một nửa xe tốt nhất được làm <b>bố mẹ</b>; 2 xe giỏi nhất được giữ nguyên sang thế hệ sau." },
    { t: "Lai & đột biến", e: "sparkle", d: "Con nhận mỗi gen ngẫu nhiên từ bố hoặc mẹ (<b>lai ghép</b>), rồi một vài gen bị thay đổi nhẹ (<b>đột biến</b>, ô vàng). Không ai dạy xe cách lái: cách lái tốt tự <b>tiến hóa</b>." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 5) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (ctx, t, x, y, c, f) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
  function renderSoi() {
    const ctx = octx, s = soiStep, L = leader(); D.labBg(ctx);
    if (s === 0) { ctx.save(); ctx.translate(320, 240); ctx.scale(2.2, 2.2); ctx.translate(-L.x, -L.y); drawTrack(ctx, ST.track); rays(ctx, L, true); drawCar(ctx, L, "#ffc34d", true); ctx.restore(); ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, 10, 10, 200, 150, 10); ctx.fill(); ["trái 60°", "trái 30°", "thẳng", "phải 30°", "phải 60°"].forEach((n, i) => { lab(ctx, n, 22, 36 + i * 26); ctx.fillStyle = "#232866"; ctx.fillRect(96, 26 + i * 26, 100, 12); ctx.fillStyle = L.sens[i] < 0.35 ? "#ff7d5f" : "#5ef2d6"; ctx.fillRect(96, 26 + i * 26, 100 * L.sens[i], 12); }); return; }
    if (s === 1 || s === 2) { const cv = document.createElement("canvas"); cv.width = 380; cv.height = 300; renderNet(cv, L); ctx.drawImage(cv, s === 1 ? 130 : 20, 60); if (s === 2) { lab(ctx, "Đánh lái", 430, 100); ctx.fillStyle = "#232866"; ctx.fillRect(430, 116, 180, 16); ctx.fillStyle = "#ffc34d"; const v = L.out[0]; ctx.fillRect(520 + Math.min(0, v) * 90, 116, Math.abs(v) * 90, 16); ctx.fillStyle = "#fff"; ctx.fillRect(519, 112, 2, 24); lab(ctx, v < -0.1 ? "← trái" : v > 0.1 ? "phải →" : "thẳng", 430, 156, "#fff"); lab(ctx, "Ga", 430, 200); ctx.fillStyle = "#232866"; ctx.fillRect(430, 216, 180, 16); ctx.fillStyle = "#5ef2d6"; ctx.fillRect(430, 216, ((L.out[1] + 1) / 2) * 180, 16); lab(ctx, `tốc độ ${L.v.toFixed(1)}`, 430, 256, "#fff"); } lab(ctx, `${NG} trọng số = ${NG} gen`, 20, 40, "#ffc34d"); return; }
    if (s === 3) { drawTrack(ctx, ST.track); const T = ST.track; ST.cars.forEach((c) => { const i = ((Math.round(c.best) % T.n) + T.n) % T.n; ctx.fillStyle = c === L ? "#ffc34d" : c.alive ? "#7c8cff" : "#ff7d5f"; ctx.beginPath(); ctx.arc(T.C[i][0], T.C[i][1], c === L ? 7 : 4, 0, 7); ctx.fill(); }); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i <= Math.min(T.n, Math.max(0, L.best)); i++) { const p = T.C[i % T.n]; i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); lab(ctx, `Xe dẫn đầu: ${Math.round(L.fit)} ${ST.fit === "dist" ? "px quãng đường" : "khung hình sống sót"}`, 20, 470, "#fff"); return; }
    if (s === 4) { const R = ST.lastRank; if (!R) { lab(ctx, "Chờ hết thế hệ đầu tiên…", 220, 240); return; } const mx = Math.max(1, R[0].fit), bw = 600 / R.length; lab(ctx, `Độ thích nghi của ${R.length} xe ở thế hệ trước`, 20, 30); R.forEach((r, i) => { const h = (r.fit / mx) * 360; ctx.fillStyle = i < ST.elite ? "#ffc34d" : i < R.length / 2 ? "#5ef2d6" : "#4a4f7a"; ctx.fillRect(20 + i * bw, 420 - h, bw - 2, h); }); lab(ctx, "vàng: giữ nguyên · xanh: được làm bố mẹ · xám: bị loại", 20, 450); return; }
    const Pp = ST.lastParents; if (!Pp) { lab(ctx, "Chờ hết thế hệ đầu tiên…", 220, 240); return; }
    const cw = 600 / NG, row = (g, y, col) => g.forEach((w, i) => { ctx.fillStyle = col(w, i); ctx.fillRect(20 + i * cw, y, cw - 1, 46); });
    const wc = (w) => (w >= 0 ? `rgba(94,242,214,${0.2 + Math.min(0.8, Math.abs(w) * 0.4)})` : `rgba(255,125,95,${0.2 + Math.min(0.8, Math.abs(w) * 0.4)})`);
    lab(ctx, "Bố", 20, 50); row(Pp.a, 60, wc); lab(ctx, "Mẹ", 20, 150); row(Pp.b, 160, wc);
    lab(ctx, "Con", 20, 290); row(Pp.child, 300, wc); Pp.mask.forEach((m, i) => { ctx.fillStyle = m ? "#7c8cff" : "#ff8fd0"; ctx.fillRect(20 + i * cw, 352, cw - 1, 6); }); Pp.mut.forEach((i) => { ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2.5; ctx.strokeRect(20 + i * cw, 298, cw - 1, 50); });
    lab(ctx, `Vạch hồng: gen từ bố · vạch tím: gen từ mẹ · ô vàng: ${Pp.mut.length} gen đột biến`, 20, 390);
  }
  function soiLive() {
    const s = soiStep, L = leader(), el = $("soiLive");
    if (s === 0) el.innerHTML = `Cảm biến xe dẫn đầu: <span class="hl">${L.sens.map((v) => Math.round(v * RAY)).join(" · ")}</span> px`;
    else if (s <= 2) el.innerHTML = `Lái <span class="hl">${L.out[0].toFixed(2)}</span> · ga <span class="w">${L.out[1].toFixed(2)}</span>`;
    else if (s === 3) el.innerHTML = `Độ thích nghi: <span class="hl">${ST.fit === "dist" ? "quãng đường" : "thời gian sống sót"}</span>`;
    else if (s === 4) el.innerHTML = `Giữ nguyên <span class="hl">${ST.elite}</span> xe · bố mẹ chọn trong <span class="w">${Math.floor(ST.pop / 2)}</span> xe tốt nhất`;
    else el.innerHTML = `Tỉ lệ đột biến <span class="hl">${Math.round(ST.rate * 100)}%</span> · độ lớn <span class="w">${ST.strength.toFixed(1)}</span>`;
  }
  // ---------- não, biểu đồ, code ----------
  function renderBrain() { const L = leader(); renderNet($("net"), L); $("bGen").textContent = ST.gen; $("bAlive").textContent = ST.cars.filter((c) => c.alive).length + "/" + ST.cars.length; const h = ST.hist[ST.hist.length - 1]; $("bBest").textContent = h ? (ST.fit === "dist" ? (h.laps).toFixed(2) + " vòng" : Math.round(h.best) + " khung") : "—"; $("bNow").textContent = (L.best / ST.track.n).toFixed(2) + " vòng"; $("btnRun").innerHTML = HKA.icon(ST.running ? "pause" : "play") + (ST.running ? "Tạm dừng" : "Chạy"); }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 46, B = 26, T = 12; ctx.clearRect(0, 0, W, H); ctx.font = "11px JetBrains Mono, monospace";
    const h = ST.hist.filter((x) => x.mode === ST.fit); if (!h.length) { ctx.fillStyle = TH.text; ctx.fillText("Chờ hết thế hệ đầu tiên…", L, H / 2); return; }
    const mx = Math.max(...h.map((x) => x.best)) || 1, X = (i) => L + (i / Math.max(1, h.length - 1)) * (W - L - 12), Y = (v) => T + (1 - v / mx) * (H - T - B);
    [0, 0.5, 1].forEach((f) => { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(mx * f)); ctx.lineTo(W - 12, Y(mx * f)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(mx * f), 2, Y(mx * f) + 4); });
    if (ST.fit === "dist") { const lap = ST.track.total; if (lap < mx) { ctx.setLineDash([6, 5]); ctx.strokeStyle = TH.coral; ctx.beginPath(); ctx.moveTo(L, Y(lap)); ctx.lineTo(W - 12, Y(lap)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.coral; ctx.fillText("1 vòng", W - 70, Y(lap) - 5); } }
    [["best", TH.mint, 3], ["avg", TH.violet, 2]].forEach(([k, c, w]) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); h.forEach((x, i) => (i ? ctx.lineTo(X(i), Y(x[k])) : ctx.moveTo(X(i), Y(x[k])))); ctx.stroke(); });
    ctx.fillStyle = TH.text; ctx.fillText(`thế hệ (${h.length})`, L, H - 6);
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`dan.sort((a, b) =&gt; b.${ST.fit === "dist" ? "quangDuong" : "thoiGianSong"} - a.${ST.fit === "dist" ? "quangDuong" : "thoiGianSong"});
${k("const")} boMe = dan.slice(${n(0)}, dan.length / ${n(2)});     ${c("// chọn lọc")}
${k("const")} moi = dan.slice(${n(0)}, ${n(ST.elite)}).map(xe =&gt; xe.gen);
${k("while")} (moi.length &lt; ${n(ST.pop)}) {
  ${k("const")} [a, b] = [chon(boMe), chon(boMe)];
  ${k("const")} con = a.gen.map((g, i) =&gt; Math.random() &lt; ${n(0.5)} ? g : b.gen[i]);  ${c("// lai")}
  con.forEach((g, i) =&gt; { ${k("if")} (Math.random() &lt; ${n(ST.rate.toFixed(2))}) con[i] += ngauNhien() * ${n(ST.strength.toFixed(1))}; }); ${c("// đột biến")}
  moi.push(con);
}`;
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function bind() {
    $("btnRun").onclick = () => (ST.running = !ST.running);
    $("btnNext").onclick = () => nextGen();
    $("btnFast").onclick = () => { $("btnFast").disabled = true; setTimeout(() => { fastGens(10); $("btnFast").disabled = false; prog.done("fast"); }, 30); };
    $("btnResetEvo").onclick = () => resetEvo();
    $("trackBtns").querySelectorAll("button[data-k]").forEach((b) => (b.onclick = () => { ST.track = presetTrack(+b.dataset.k); resetEvo(); }));
    $("btnDraw").onclick = () => { ST.draw = []; ST.running = false; };
    const pos = (e) => { const r = stage.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * 640, ((e.clientY - r.top) / r.height) * 480]; };
    stage.addEventListener("pointerdown", (e) => { if (!ST.draw) return; stage.setPointerCapture(e.pointerId); ST.draw = [pos(e)]; ST.drawing = true; });
    stage.addEventListener("pointermove", (e) => { if (ST.draw && ST.drawing) { const p = pos(e), q = ST.draw[ST.draw.length - 1]; if (Math.hypot(p[0] - q[0], p[1] - q[1]) > 6) ST.draw.push(p); } });
    stage.addEventListener("pointerup", () => { if (!ST.draw || !ST.drawing) return; ST.drawing = false; const r = resampleLoop(ST.draw); if (ST.draw.length < 20 || r.tot < 700) { ST.draw = []; P.msg($("stageMsg"), "Vòng đua quá ngắn. Hãy vẽ một vòng to hơn, khép kín.", "alert", 3000); return; } ST.track = buildTrack(r.pts, 56); ST.draw = null; ST.running = true; resetEvo(); prog.done("draw"); });
    syncs.push(P.range("rate", () => ST.rate, (v) => (ST.rate = v), (v) => Math.round(v * 100) + "%", genCode));
    syncs.push(P.range("strength", () => ST.strength, (v) => (ST.strength = v), (v) => v.toFixed(1), genCode));
    syncs.push(P.range("pop", () => ST.pop, (v) => (ST.pop = v), (v) => v + " xe", genCode));
    syncs.push(P.range("spf", () => ST.spf, (v) => (ST.spf = v), (v) => v + "×"));
    $("fitBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.fit = b.dataset.f; markFit(); resetEvo(); genCode(); }));
    function markFit() { $("fitBtns").querySelectorAll("button").forEach((b) => b.classList.toggle("ghost", b.dataset.f !== ST.fit)); }
    const sync = () => { syncs.forEach((f) => f()); markFit(); genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); ST.running = true; ST.track = presetTrack(2); if (k === "nomut") { ST.rate = 0; ST.pop = 12; } if (k === "chaos") { ST.rate = 1; ST.strength = 3; } if (k === "alive") ST.fit = "alive"; ST.spf = 6;
      sync(); resetEvo(); prog.done("broke"); $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); ST.running = true; sync(); resetEvo(); };
    sync();
  }

  const QUIZ = [
    { q: "Trong dự án này, xe học lái bằng cách nào?", o: ["Có người lái mẫu cho xe học theo", "Qua nhiều thế hệ: xe đi xa được chọn làm bố mẹ, con thừa hưởng gen của bố mẹ kèm vài đột biến", "Xe tra bản đồ", "Xe được lập trình sẵn từng khúc cua"], a: 1, e: "Đây là thuật toán di truyền, mô phỏng chọn lọc tự nhiên. Không có lan truyền ngược, không có đáp án đúng cho từng bước." },
    { q: "\"Gen\" của mỗi chiếc xe là gì?", o: ["Màu sơn", "Các trọng số trong mạng nơ-ron điều khiển xe", "Tốc độ tối đa", "Vị trí xuất phát"], a: 1, e: "Mỗi xe có 50 trọng số. Thay đổi trọng số là thay đổi cách xe phản ứng với cảm biến." },
    { q: "Tắt đột biến hoàn toàn và đàn chỉ có 12 xe thì sao?", o: ["Tiến hóa nhanh hơn", "Cả đàn nhanh chóng giống hệt nhau, không còn gì mới để thử, nên dậm chân tại chỗ", "Xe chạy ngược", "Không ảnh hưởng"], a: 1, e: "Đột biến tạo ra sự đa dạng. Không có đa dạng thì chọn lọc không còn gì để chọn." },
    { q: "Đột biến 100% với độ lớn rất lớn dẫn tới…", o: ["Xe giỏi hơn ngay", "Con cái gần như ngẫu nhiên hoàn toàn, mất hết những gì bố mẹ đã học được", "Xe chạy chậm lại", "Đàn đông hơn"], a: 1, e: "Cần cân bằng: đủ đột biến để có cái mới, nhưng không quá nhiều để giữ lại cái tốt." },
    { q: "Chấm điểm theo \"thời gian sống sót\" thì xe học được gì?", o: ["Chạy nhanh hơn", "Quay vòng tròn một chỗ cho an toàn, vì như vậy sống lâu nhất", "Về đích sớm", "Chạy ngược chiều"], a: 1, e: "Giống robot ham xu ở Dự án 18: tiến hóa tối ưu đúng thứ ta đo, không phải thứ ta muốn." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let slow = 0, tuVisible = false; P.visible($("tu-lam"), (v) => (tuVisible = v));
  function tick(now) {
    if (ST.running && !ST.draw) for (let i = 0; i < ST.spf; i++) stepAll();
    renderStage(); if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; renderBrain(); if (soiVisible) soiLive(); if (tuVisible) renderChart(); }
    requestAnimationFrame(tick);
  }
  P.nav(); ST.track = presetTrack(2); resetEvo(); bind();
  window.__hka19 = { ST, fastGens };
  requestAnimationFrame(tick);
})();
