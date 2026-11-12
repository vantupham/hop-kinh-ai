/* Hộp Kính AI · Dự án 18 · Robot thoát mê cung (học tăng cường, bảng Q) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-18");
  const CW = 10, CH = 8, NS = CW * CH, CS = 56, OX = 40, OY = 16, MAXSTEP = 150;
  const ACT = [[0, -1], [1, 0], [0, 1], [-1, 0]], ANAME = ["lên", "phải", "xuống", "trái"];
  // . trống · # tường · X bẫy · G đích · S xuất phát · $ xu
  const MAP0 = [
    "S...#.....",
    ".##.#.##.X",
    ".#.....#..",
    ".#.###.#.#",
    "...#...#..",
    "##.#.###X.",
    "....X.....",
    ".####....G"];
  const MAPCOIN = MAP0.map((r, y) => (y === 0 ? "S.$.#....." : r));
  const DEF = { alpha: 0.5, gamma: 0.9, eps: 0.2, rGoal: 10, rTrap: -10, rStep: -0.1, rCoin: 2, coinRespawn: true, speed: 4 };
  const ST = { ...DEF, grid: null, Q: null, s: 0, start: 0, ep: 0, step: 0, ret: 0, hist: [], last: null, running: true, trail: [], coins: new Set(), tool: "#", showQ: false, t: 0, wins: 0 };
  function loadMap(m) { ST.grid = m.join("").split(""); ST.start = ST.grid.indexOf("S"); resetQ(); }
  function resetQ() { ST.Q = Array.from({ length: NS }, () => new Float64Array(4)); ST.ep = 0; ST.hist = []; ST.wins = 0; newEp(); }
  function newEp() { ST.s = ST.start; ST.step = 0; ST.ret = 0; ST.trail = [ST.s]; ST.coins = new Set(ST.grid.map((c, i) => (c === "$" ? i : -1)).filter((i) => i >= 0)); }
  const xy = (s) => [s % CW, Math.floor(s / CW)];
  function move(s, a) { const [x, y] = xy(s), nx = x + ACT[a][0], ny = y + ACT[a][1]; if (nx < 0 || ny < 0 || nx >= CW || ny >= CH) return s; const n = ny * CW + nx; return ST.grid[n] === "#" ? s : n; }
  const argmax = (q) => { let b = 0; for (let i = 1; i < 4; i++) if (q[i] > q[b]) b = i; return b; };
  function choose(s) { if (Math.random() < ST.eps) return { a: Math.floor(Math.random() * 4), explore: true }; const q = ST.Q[s], mx = Math.max(...q), best = [0, 1, 2, 3].filter((i) => q[i] === mx); return { a: ST.eps === 0 ? best[0] : best[Math.floor(Math.random() * best.length)], explore: false }; }
  function stepOnce(record) {
    const s = ST.s, { a, explore } = choose(s), n = move(s, a), c = ST.grid[n];
    let r = ST.rStep, done = false, kind = n === s ? "đụng tường" : "đi";
    if (c === "G") { r += ST.rGoal; done = true; kind = "tới đích"; } else if (c === "X") { r += ST.rTrap; done = true; kind = "rơi bẫy"; } else if (c === "$" && ST.coins.has(n)) { r += ST.rCoin; kind = "nhặt xu"; if (!ST.coinRespawn) ST.coins.delete(n); }
    const q0 = ST.Q[s][a], target = r + (done ? 0 : ST.gamma * Math.max(...ST.Q[n])); ST.Q[s][a] = q0 + ST.alpha * (target - q0);
    if (record) ST.last = { s, a, n, r, done, explore, q0, q1: ST.Q[s][a], maxN: done ? 0 : Math.max(...ST.Q[n]), target, kind };
    ST.s = n; ST.step++; ST.ret += r; ST.trail.push(n); if (ST.trail.length > 60) ST.trail.shift();
    if (done || ST.step >= MAXSTEP) { ST.hist.push({ ret: ST.ret, steps: ST.step, win: c === "G" && done }); if (ST.hist.length > 400) ST.hist.shift(); if (c === "G" && done) { ST.wins++; if (ST.wins >= 3) prog.done("win"); } ST.ep++; newEp(); return true; }
    return false;
  }
  function fastTrain(n) { let e = 0; while (e < n) if (stepOnce(false)) e++; prog.done("fast"); }
  function greedyPath() { const path = [ST.start], seen = new Set([ST.start]); let s = ST.start; for (let i = 0; i < 80; i++) { const q = ST.Q[s]; if (Math.max(...q) === 0 && Math.min(...q) === 0) break; const n = move(s, argmax(q)); if (n === s || seen.has(n)) { path.push(n); break; } path.push(n); seen.add(n); s = n; if ("GX".includes(ST.grid[n])) break; } return path; }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  const V = (s) => Math.max(...ST.Q[s]);
  function vCol(v, al) { const t = Math.max(-1, Math.min(1, v / Math.max(2, ST.rGoal * 0.8))); return t >= 0 ? `rgba(${Math.round(20 + 235 * t)},${Math.round(24 + 186 * t)},${Math.round(52 + 8 * t)},${al})` : `rgba(${Math.round(20 + 150 * -t)},${Math.round(24 + 6 * -t)},${Math.round(52 + 90 * -t)},${al})`; }
  function drawGrid(ctx, o) {
    o = o || {}; const cs = o.cs || CS, ox = o.ox == null ? OX : o.ox, oy = o.oy == null ? OY : o.oy;
    for (let s = 0; s < NS; s++) {
      const [x, y] = xy(s), X = ox + x * cs, Y = oy + y * cs, c = ST.grid[s];
      if (c === "#") { ctx.fillStyle = "#7a7fb8"; ctx.fillRect(X, Y, cs, cs); ctx.strokeStyle = "#4b5088"; ctx.lineWidth = 2; for (let r = 0; r < 3; r++) { const yy = Y + (r * cs) / 3; ctx.beginPath(); ctx.moveTo(X, yy); ctx.lineTo(X + cs, yy); ctx.stroke(); const off = r % 2 ? cs / 2 : cs / 4; ctx.beginPath(); ctx.moveTo(X + off, yy); ctx.lineTo(X + off, yy + cs / 3); ctx.moveTo(X + off + cs / 2, yy); ctx.lineTo(X + off + cs / 2, yy + cs / 3); ctx.stroke(); } continue; }
      ctx.fillStyle = o.heat === false ? "#14183a" : vCol(V(s), 1); ctx.fillRect(X, Y, cs, cs); ctx.strokeStyle = "rgba(255,255,255,.06)"; ctx.strokeRect(X, Y, cs, cs);
      if (o.four && c !== "G" && c !== "X") { const q = ST.Q[s], cx = X + cs / 2, cy = Y + cs / 2; [[cx, Y + 2, cx - cs / 2 + 2, Y + 2, cx + cs / 2 - 2, Y + 2], [X + cs - 2, cy, X + cs - 2, Y + 2, X + cs - 2, Y + cs - 2], [cx, Y + cs - 2, X + 2, Y + cs - 2, X + cs - 2, Y + cs - 2], [X + 2, cy, X + 2, Y + 2, X + 2, Y + cs - 2]].forEach((t, a) => { ctx.fillStyle = vCol(q[a], 0.95); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(t[2], t[3]); ctx.lineTo(t[4], t[5]); ctx.closePath(); ctx.fill(); }); ctx.strokeStyle = "rgba(0,0,0,.25)"; ctx.beginPath(); ctx.moveTo(X, Y); ctx.lineTo(X + cs, Y + cs); ctx.moveTo(X + cs, Y); ctx.lineTo(X, Y + cs); ctx.stroke(); }
      if (c === "G") icon(ctx, "goal", X, Y, cs); else if (c === "X") icon(ctx, "trap", X, Y, cs); else if (c === "$" && ST.coins.has(s)) icon(ctx, "coin", X, Y, cs); else if (c === "S") { ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 2; ctx.setLineDash([4, 3]); ctx.strokeRect(X + 5, Y + 5, cs - 10, cs - 10); ctx.setLineDash([]); }
      if (o.arrows !== false && !"GX".includes(c) && (Math.max(...ST.Q[s]) !== 0 || Math.min(...ST.Q[s]) !== 0) && !o.four) { const a = argmax(ST.Q[s]), cx = X + cs / 2, cy = Y + cs / 2, L = cs * 0.28; D.arrow(ctx, { x: cx - ACT[a][0] * L, y: cy - ACT[a][1] * L }, { x: cx + ACT[a][0] * L, y: cy + ACT[a][1] * L }, "rgba(255,255,255,.75)", 2.5); }
      if (o.nums && !"#GX".includes(c)) { ctx.fillStyle = "#fff"; ctx.font = `600 ${Math.round(cs / 4.6)}px JetBrains Mono, monospace`; ctx.fillText(V(s).toFixed(1), X + 4, Y + cs - 5); }
    }
  }
  function icon(ctx, k, X, Y, cs) {
    const cx = X + cs / 2, cy = Y + cs / 2, r = cs * 0.3;
    if (k === "goal") { ctx.fillStyle = "#ffc34d"; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
    if (k === "trap") { ctx.fillStyle = "#ff5d5d"; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.strokeStyle = "#1b1f4a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cx - r * 0.5, cy - r * 0.5); ctx.lineTo(cx + r * 0.5, cy + r * 0.5); ctx.moveTo(cx + r * 0.5, cy - r * 0.5); ctx.lineTo(cx - r * 0.5, cy + r * 0.5); ctx.stroke(); }
    if (k === "coin") { ctx.fillStyle = "#ffd84d"; ctx.beginPath(); ctx.arc(cx, cy, r * 0.75, 0, 7); ctx.fill(); ctx.strokeStyle = "#c99a1a"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#c99a1a"; ctx.font = `800 ${Math.round(r)}px JetBrains Mono, monospace`; ctx.fillText("$", cx - r * 0.3, cy + r * 0.35); }
  }
  function robot(ctx, s, cs, ox, oy) { const [x, y] = xy(s), cx = ox + x * cs + cs / 2, cy = oy + y * cs + cs / 2, r = cs * 0.32; ctx.fillStyle = "#e8eaff"; D.rr(ctx, cx - r, cy - r * 0.8, 2 * r, 1.6 * r, 6); ctx.fill(); ctx.fillStyle = "#5443ff"; ctx.beginPath(); ctx.arc(cx - r * 0.4, cy - r * 0.1, r * 0.2, 0, 7); ctx.arc(cx + r * 0.4, cy - r * 0.1, r * 0.2, 0, 7); ctx.fill(); ctx.strokeStyle = "#e8eaff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx, cy - r * 0.8); ctx.lineTo(cx, cy - r * 1.2); ctx.stroke(); ctx.fillStyle = "#ff7d5f"; ctx.beginPath(); ctx.arc(cx, cy - r * 1.25, 3, 0, 7); ctx.fill(); }
  function renderStage() {
    const ctx = sctx; ctx.fillStyle = "#121633"; ctx.fillRect(0, 0, 640, 480); drawGrid(ctx, { four: ST.showQ });
    // vệt đi
    ctx.strokeStyle = "rgba(94,242,214,.5)"; ctx.lineWidth = 3; ctx.beginPath(); ST.trail.forEach((s, i) => { const [x, y] = xy(s), X = OX + x * CS + CS / 2, Y = OY + y * CS + CS / 2; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke();
    if (ST.showPath) { const p = greedyPath(); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 4; ctx.setLineDash([8, 6]); ctx.beginPath(); p.forEach((s, i) => { const [x, y] = xy(s), X = OX + x * CS + CS / 2, Y = OY + y * CS + CS / 2; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); ctx.setLineDash([]); }
    robot(ctx, ST.s, CS, OX, OY);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Trạng thái", e: "map", d: "Robot chỉ biết mình đang ở <b>ô nào</b>: đó là <b>trạng thái</b>. Nó không nhìn thấy cả mê cung, cũng không biết đích ở đâu." },
    { t: "Chọn hành động", e: "help", d: "Với xác suất <b>ε</b>, robot thử một hướng ngẫu nhiên (<b>khám phá</b>). Còn lại nó chọn hướng có giá trị Q cao nhất (<b>khai thác</b>)." },
    { t: "Nhận thưởng", e: "award", d: "Môi trường trả lại <b>phần thưởng</b>: mỗi bước bị trừ một chút, rơi bẫy bị phạt nặng, tới đích được thưởng lớn." },
    { t: "Cập nhật bảng Q", e: "sliders", d: "Robot sửa lại giá trị của nước đi vừa rồi: Q mới = Q cũ + α × (thưởng + γ × giá trị tốt nhất ở ô mới − Q cũ)." },
    { t: "Giá trị lan tỏa", e: "activity", d: "Qua nhiều lượt, giá trị tốt <b>lan ngược</b> từ đích ra xa, như mùi thơm lan khắp mê cung. Ô càng gần đích càng sáng." },
    { t: "Chính sách", e: "arrowR", d: "Ở mỗi ô, đi theo hướng có Q cao nhất. Ghép lại thành <b>chính sách</b>: đường vàng là đường robot sẽ đi nếu không khám phá nữa." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (ctx, t, x, y, c, f) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
  function renderSoi() {
    const ctx = octx, s = soiStep, L = ST.last; D.labBg(ctx);
    const cs = 40, ox = 12, oy = 70;
    if (s === 4) { drawGrid(ctx, { cs: 60, ox: 20, oy: 0, nums: true, arrows: false }); robot(ctx, ST.s, 60, 20, 0); return; }
    if (s === 5) { drawGrid(ctx, { cs: 60, ox: 20, oy: 0 }); const p = greedyPath(); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 5; ctx.beginPath(); p.forEach((q, i) => { const [x, y] = xy(q), X = 20 + x * 60 + 30, Y = y * 60 + 30; i ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }); ctx.stroke(); return; }
    drawGrid(ctx, { cs, ox, oy, heat: s >= 3, arrows: false });
    if (!L) { lab(ctx, "Robot chưa đi bước nào.", 440, 240); return; }
    const [x, y] = xy(L.s), X = ox + x * cs, Y = oy + y * cs; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.strokeRect(X, Y, cs, cs);
    if (s >= 2) { const [nx, ny] = xy(L.n); D.arrow(ctx, { x: X + cs / 2, y: Y + cs / 2 }, { x: ox + nx * cs + cs / 2 + (L.n === L.s ? ACT[L.a][0] * 14 : 0), y: oy + ny * cs + cs / 2 + (L.n === L.s ? ACT[L.a][1] * 14 : 0) }, "#ffc34d", 3); }
    robot(ctx, s >= 2 ? L.n : L.s, cs, ox, oy);
    const px = 430; lab(ctx, `Ô (${x}, ${y})`, px, 40, "#fff", "800 18px Be Vietnam Pro, sans-serif");
    if (s === 0) { lab(ctx, "4 giá trị Q của ô này:", px, 80); ST.Q[L.s].forEach((v, a) => lab(ctx, `${ANAME[a]}: ${v.toFixed(2)}`, px, 110 + a * 28, "#c3c7f0", "13px JetBrains Mono, monospace")); return; }
    if (s === 1) { lab(ctx, `ε = ${ST.eps.toFixed(2)}`, px, 80); ctx.fillStyle = "#232866"; ctx.fillRect(px, 96, 180, 22); ctx.fillStyle = "#ff8fd0"; ctx.fillRect(px, 96, 180 * ST.eps, 22); lab(ctx, "khám phá", px, 136, "#ff8fd0", "11px Be Vietnam Pro, sans-serif"); lab(ctx, "khai thác", px + 120, 136, "#7c8cff", "11px Be Vietnam Pro, sans-serif"); lab(ctx, L.explore ? "→ Lần này: KHÁM PHÁ" : "→ Lần này: KHAI THÁC", px, 176, L.explore ? "#ff8fd0" : "#7c8cff", "800 14px Be Vietnam Pro, sans-serif"); lab(ctx, `Chọn hướng: ${ANAME[L.a]}`, px, 206, "#fff"); return; }
    if (s === 2) { lab(ctx, `Kết quả: ${L.kind}`, px, 80, "#fff"); lab(ctx, `Phần thưởng: ${L.r > 0 ? "+" : ""}${L.r.toFixed(1)}`, px, 112, L.r > 0 ? "#5ef2d6" : "#ff7d5f", "800 18px Be Vietnam Pro, sans-serif"); lab(ctx, `mỗi bước ${ST.rStep} · đích +${ST.rGoal} · bẫy ${ST.rTrap}`, px, 142, "#8f96d4", "11px Be Vietnam Pro, sans-serif"); return; }
    lab(ctx, "Q mới = Q cũ + α × (mục tiêu − Q cũ)", px, 80, "#c3c7f0", "12px Be Vietnam Pro, sans-serif");
    const rows = [["Q cũ", L.q0.toFixed(2)], ["thưởng r", L.r.toFixed(2)], ["γ × max Q ô mới", `${ST.gamma} × ${L.maxN.toFixed(2)}`], ["mục tiêu", L.target.toFixed(2)], ["α", ST.alpha.toFixed(2)], ["Q mới", L.q1.toFixed(2)]];
    rows.forEach(([a, b], i) => { lab(ctx, a, px, 116 + i * 30, "#c3c7f0", "12px Be Vietnam Pro, sans-serif"); lab(ctx, b, px + 120, 116 + i * 30, i === 5 ? "#ffc34d" : "#fff", "700 13px JetBrains Mono, monospace"); });
  }
  function soiLive() {
    const s = soiStep, L = ST.last, el = $("soiLive"); if (!L) { el.textContent = "—"; return; }
    if (s === 0) el.innerHTML = `Mê cung có <span class="hl">${ST.grid.filter((c) => c !== "#").length}</span> ô đi được × 4 hướng = <span class="w">${ST.grid.filter((c) => c !== "#").length * 4}</span> giá trị Q`;
    else if (s === 1) el.innerHTML = `Lượt vừa rồi: <span class="hl">${L.explore ? "khám phá" : "khai thác"}</span>, đi <span class="w">${ANAME[L.a]}</span>`;
    else if (s === 2) el.innerHTML = `Phần thưởng: <span class="hl">${L.r.toFixed(1)}</span> (${L.kind})`;
    else if (s === 3) el.innerHTML = `Q: <span class="w">${L.q0.toFixed(2)}</span> → <span class="hl">${L.q1.toFixed(2)}</span>`;
    else if (s === 4) el.innerHTML = `Đã chơi <span class="hl">${ST.ep}</span> lượt · tới đích <span class="w">${ST.wins}</span> lần`;
    else { const p = greedyPath(); el.innerHTML = `Đường theo chính sách: <span class="hl">${p.length - 1}</span> bước · ${ST.grid[p[p.length - 1]] === "G" ? '<span class="w">tới đích</span>' : "chưa tới đích"}`; }
  }

  // ---------- não, biểu đồ, code ----------
  function renderBrain() {
    $("bEp").textContent = ST.ep; $("bStep").textContent = ST.step; $("bWin").textContent = ST.wins;
    const last20 = ST.hist.slice(-20); $("bRate").textContent = last20.length ? Math.round((last20.filter((h) => h.win).length / last20.length) * 100) + "%" : "—";
    $("bAct").innerHTML = ST.last ? `${ST.last.explore ? '<span style="color:#ff8fd0">khám phá</span>' : '<span style="color:#7c8cff">khai thác</span>'} · ${ANAME[ST.last.a]} · ${ST.last.kind}` : "—";
    const q = ST.Q[ST.s]; $("bQ").innerHTML = ANAME.map((n, a) => `<div class="r"><span>${n}</span><span class="bar"><i style="width:${Math.min(100, Math.abs(q[a]) / Math.max(1, ST.rGoal) * 100)}%;background:${q[a] >= 0 ? "#5ef2d6" : "#ff7d5f"}"></i></span><span>${q[a].toFixed(1)}</span></div>`).join("");
    $("btnRun").innerHTML = HKA.icon(ST.running ? "pause" : "play") + (ST.running ? "Tạm dừng" : "Chạy");
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 46, B = 26, T = 12; ctx.clearRect(0, 0, W, H); ctx.font = "11px JetBrains Mono, monospace";
    const h = ST.hist.slice(-200); if (!h.length) { ctx.fillStyle = TH.text; ctx.fillText("Chưa có lượt nào hoàn thành", L, H / 2); return; }
    const lo = Math.min(-15, ...h.map((x) => x.ret)), hi = Math.max(12, ...h.map((x) => x.ret)), Y = (v) => T + (1 - (v - lo) / (hi - lo)) * (H - T - B), X = (i) => L + (i / Math.max(1, h.length - 1)) * (W - L - 12);
    [lo, 0, hi].forEach((v) => { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - 12, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v.toFixed(0), 4, Y(v) + 4); });
    h.forEach((x, i) => { ctx.fillStyle = x.win ? TH.mint : TH.coral; ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(X(i), Y(x.ret), 2.5, 0, 7); ctx.fill(); }); ctx.globalAlpha = 1;
    ctx.strokeStyle = TH.violet; ctx.lineWidth = 3; ctx.beginPath(); h.forEach((x, i) => { const w = h.slice(Math.max(0, i - 9), i + 1), m = w.reduce((u, v) => u + v.ret, 0) / w.length; i ? ctx.lineTo(X(i), Y(m)) : ctx.moveTo(X(i), Y(m)); }); ctx.stroke();
    ctx.fillStyle = TH.text; ctx.fillText(`${ST.hist.length > 200 ? "200 lượt gần nhất" : h.length + " lượt"}`, L, H - 6);
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${k("const")} a = Math.random() &lt; ${n(ST.eps.toFixed(2))}        ${c("// ε: khám phá")}
  ? huongNgauNhien() : huongCoQCaoNhat(o);
${k("const")} [oMoi, thuong, xong] = moiTruong.di(o, a);
${k("const")} mucTieu = thuong + (xong ? ${n(0)} : ${n(ST.gamma.toFixed(2))} * max(Q[oMoi]));
Q[o][a] += ${n(ST.alpha.toFixed(2))} * (mucTieu - Q[o][a]);    ${c("// α: tốc độ học")}
o = oMoi;`;
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function bind() {
    $("btnRun").onclick = () => (ST.running = !ST.running);
    $("btnStep").onclick = () => { ST.running = false; stepOnce(true); };
    $("btnFast").onclick = () => { fastTrain(200); };
    $("btnReset").onclick = () => resetQ();
    $("btnPath").onclick = () => { ST.showPath = !ST.showPath; $("btnPath").classList.toggle("ghost", !ST.showPath); prog.done("path"); };
    $("btnFour").onclick = () => { ST.showQ = !ST.showQ; $("btnFour").classList.toggle("ghost", !ST.showQ); };
    $("toolBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.tool = b.dataset.t; $("toolBtns").querySelectorAll("button").forEach((q) => q.classList.toggle("ghost", q !== b)); }));
    let down = false; const paint = (e) => { const r = stage.getBoundingClientRect(), x = Math.floor((((e.clientX - r.left) / r.width) * 640 - OX) / CS), y = Math.floor((((e.clientY - r.top) / r.height) * 480 - OY) / CS); if (x < 0 || y < 0 || x >= CW || y >= CH) return; const s = y * CW + x; if (ST.tool === "S") { if (ST.grid[s] === "#") return; ST.grid[ST.start] = "."; ST.grid[s] = "S"; ST.start = s; newEp(); } else { if (ST.grid[s] === "S" || ST.grid[s] === ST.tool) return; ST.grid[s] = ST.tool; ST.Q[s] = new Float64Array(4); if (ST.tool === "$") ST.coins.add(s); } prog.done("edit"); };
    stage.addEventListener("pointerdown", (e) => { down = true; stage.setPointerCapture(e.pointerId); paint(e); }); stage.addEventListener("pointermove", (e) => down && ST.tool !== "S" && paint(e)); stage.addEventListener("pointerup", () => (down = false));
    $("mapBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { loadMap(b.dataset.m === "trong" ? Array(CH).fill("..........").map((r, y) => (y === 0 ? "S........." : y === CH - 1 ? ".........G" : r)) : MAP0); }));
    syncs.push(P.range("alpha", () => ST.alpha, (v) => (ST.alpha = v), (v) => v.toFixed(2), genCode));
    syncs.push(P.range("gamma", () => ST.gamma, (v) => (ST.gamma = v), (v) => v.toFixed(2), genCode));
    syncs.push(P.range("eps", () => ST.eps, (v) => (ST.eps = v), (v) => v.toFixed(2), genCode));
    syncs.push(P.range("speed", () => ST.speed, (v) => (ST.speed = v), (v) => v + " bước/khung"));
    syncs.push(P.range("rStep", () => ST.rStep, (v) => (ST.rStep = v), (v) => v.toFixed(1)));
    syncs.push(P.range("rCoin", () => ST.rCoin, (v) => (ST.rCoin = v), (v) => "+" + v));
    $("coinRespawn").onchange = (e) => (ST.coinRespawn = e.target.checked);
    const sync = () => { syncs.forEach((f) => f()); $("coinRespawn").checked = ST.coinRespawn; genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); ST.running = true; ST.showPath = true; $("btnPath").classList.remove("ghost");
      if (k === "noexp") { ST.eps = 0; ST.rStep = 0; loadMap(MAP0); } if (k === "myopic") { ST.gamma = 0; loadMap(MAP0); } if (k === "coin") { loadMap(MAPCOIN); ST.speed = 12; }
      if (k !== "coin") ST.speed = 12;
      sync(); prog.done("broke"); $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); ST.running = true; loadMap(MAP0); sync(); };
    sync();
  }

  const QUIZ = [
    { q: "Học tăng cường khác học có giám sát ở điểm nào?", o: ["Không khác", "Không ai đưa đáp án đúng; robot tự thử, nhận phần thưởng hoặc hình phạt, và rút kinh nghiệm", "Cần nhiều ảnh hơn", "Chỉ dùng cho trò chơi"], a: 1, e: "Giống như em học đi xe đạp: không ai cho em \"nhãn\" của từng động tác, em chỉ biết ngã (phạt) hay giữ thăng bằng được (thưởng)." },
    { q: "Giá trị Q(ô, hướng) cho biết điều gì?", o: ["Khoảng cách tới đích", "Tổng phần thưởng robot kỳ vọng nhận được nếu ở ô đó đi theo hướng đó rồi tiếp tục chơi tốt", "Số lần đã đi qua ô", "Màu của ô"], a: 1, e: "Robot không cần bản đồ: chỉ cần ở mỗi ô chọn hướng có Q cao nhất." },
    { q: "Đặt ε = 0 ngay từ đầu (không bao giờ khám phá) thì sao?", o: ["Robot học nhanh hơn", "Robot cứ lặp lại lựa chọn đầu tiên, có thể không bao giờ tìm ra đích", "Robot đi thẳng tới đích", "Robot dừng lại"], a: 1, e: "Đây là thế cân bằng khám phá và khai thác: phải thử cái mới mới tìm được cái tốt hơn." },
    { q: "γ (gamma) = 0 nghĩa là robot…", o: ["Rất kiên nhẫn", "Chỉ quan tâm phần thưởng ngay trước mắt, không thấy được đích ở xa", "Không bị phạt", "Đi nhanh hơn"], a: 1, e: "γ gần 1 giúp giá trị của đích lan ngược ra xa; γ = 0 làm robot \"cận thị\"." },
    { q: "Robot nhặt xu qua lại mãi mà không chịu về đích. Lỗi nằm ở đâu?", o: ["Robot hư", "Cách đặt phần thưởng: nhặt xu mãi được nhiều điểm hơn về đích, nên robot làm đúng điều ta thưởng chứ không phải điều ta muốn", "Mê cung quá nhỏ", "Thiếu bộ nhớ"], a: 1, e: "Hiện tượng này gọi là \"lách luật phần thưởng\". Thiết kế phần thưởng đúng ý muốn là một trong những bài toán khó nhất của AI." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now(), slow = 0, acc = 0, tuVisible = false; P.visible($("tu-lam"), (v) => (tuVisible = v));
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.running) { if (ST.speed <= 2) { acc += dt; if (acc > (ST.speed === 1 ? 0.35 : 0.12)) { acc = 0; stepOnce(true); } } else for (let i = 0; i < ST.speed; i++) stepOnce(i === ST.speed - 1); }
    renderStage();
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; renderBrain(); if (soiVisible) soiLive(); if (tuVisible) renderChart(); }
    requestAnimationFrame(tick);
  }
  P.nav(); loadMap(MAP0); bind();
  window.__hka18 = { ST, fastTrain, greedyPath };
  requestAnimationFrame(tick);
})();
