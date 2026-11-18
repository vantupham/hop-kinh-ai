/* Hộp Kính AI · Dự án 24 · Robot làm theo lệnh và robot tự học (thuật toán: tuần tự, lặp, rẽ nhánh; học thử và sai) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-24");
  const N = 11, DX = [0, 1, 0, -1], DY = [-1, 0, 1, 0], S = { x: 1, y: 9 }, G = { x: 9, y: 1 };
  const id = (x, y) => y * N + x;

  // ---------- mê cung ----------
  function genMaze(seed) {
    const r = P.rng(seed), m = new Uint8Array(N * N).fill(1), seen = new Set();
    const st = [[1, 9]]; m[id(1, 9)] = 0; seen.add("1,9");
    while (st.length) {
      const [x, y] = st[st.length - 1], nb = [0, 1, 2, 3].map((d) => [x + DX[d] * 2, y + DY[d] * 2, d]).filter(([a, b]) => a > 0 && b > 0 && a < N - 1 && b < N - 1 && !seen.has(a + "," + b));
      if (!nb.length) { st.pop(); continue; }
      const [a, b, d] = nb[Math.floor(r() * nb.length)]; m[id(x + DX[d], y + DY[d])] = 0; m[id(a, b)] = 0; seen.add(a + "," + b); st.push([a, b]);
    }
    const walls = []; for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) if (m[id(x, y)] && (x % 2) !== (y % 2)) walls.push([x, y]);
    for (let k = 0; k < 4 && walls.length; k++) { const i = Math.floor(r() * walls.length), [x, y] = walls.splice(i, 1)[0]; m[id(x, y)] = 0; }
    return m;
  }
  const MAZES = [genMaze(5), genMaze(41)];
  const open = (m, x, y) => x >= 0 && y >= 0 && x < N && y < N && !m[id(x, y)];
  function bfs(m) {
    const prev = new Int16Array(N * N).fill(-1), q = [id(S.x, S.y)]; prev[q[0]] = q[0];
    while (q.length) { const c = q.shift(); if (c === id(G.x, G.y)) break; const x = c % N, y = (c / N) | 0; for (let d = 0; d < 4; d++) { const a = x + DX[d], b = y + DY[d]; if (open(m, a, b) && prev[id(a, b)] < 0) { prev[id(a, b)] = c; q.push(id(a, b)); } } }
    const path = []; let c = id(G.x, G.y); if (prev[c] < 0) return null; while (c !== id(S.x, S.y)) { path.unshift(c); c = prev[c]; } path.unshift(c); return path;
  }

  // ---------- trạng thái ----------
  const ST = { mi: 0, maze: MAZES[0], prog: [], run: null, eps: 0.15, memOn: true, heat: true, mem: new Float32Array(N * N).fill(Infinity), K: new Uint8Array(N * N), tries: [], lpath: null, lrun: null, err: -1, cur: -1, t: 0, brk: null };
  let SHORT = bfs(ST.maze).length - 1;

  // ---------- robot làm theo lệnh ----------
  function trace(m, blocks) {
    let x = S.x, y = S.y, d = 0; const steps = [{ x, y, d, b: -1 }];
    const goal = () => x === G.x && y === G.y;
    for (let i = 0; i < blocks.length; i++) {
      const B = blocks[i];
      if (B.c === "L" || B.c === "R") { d = (d + (B.c === "R" ? 1 : 3)) % 4; steps.push({ x, y, d, b: i }); continue; }
      if (B.c === "F") { for (let k = 0; k < B.n; k++) { const a = x + DX[d], b = y + DY[d]; if (!open(m, a, b)) return { steps, ok: false, crash: i, at: { x: a, y: b } }; x = a; y = b; steps.push({ x, y, d, b: i }); if (goal()) return { steps, ok: true }; } continue; }
      for (let k = 0; k < 400 && !goal(); k++) {
        const rd = (d + 1) % 4;
        if (open(m, x + DX[rd], y + DY[rd])) { d = rd; steps.push({ x, y, d, b: i }); x += DX[d]; y += DY[d]; }
        else if (open(m, x + DX[d], y + DY[d])) { x += DX[d]; y += DY[d]; }
        else d = (d + 3) % 4;
        steps.push({ x, y, d, b: i });
      }
      if (goal()) return { steps, ok: true, wall: true };
    }
    return { steps, ok: goal(), end: true };
  }
  function sample(m) {
    const p = bfs(m), out = []; let d = 0;
    for (let i = 1; i < p.length; i++) {
      const dx = (p[i] % N) - (p[i - 1] % N), dy = ((p[i] / N) | 0) - ((p[i - 1] / N) | 0), nd = DX.findIndex((v, k) => v === dx && DY[k] === dy), t = (nd - d + 4) % 4;
      if (t === 1) out.push({ c: "R" }); else if (t === 3) out.push({ c: "L" }); else if (t === 2) out.push({ c: "R" }, { c: "R" });
      d = nd; const last = out[out.length - 1]; if (last && last.c === "F") last.n++; else out.push({ c: "F", n: 1 });
    }
    return out;
  }
  const NAME = { F: "Tiến", L: "Rẽ trái", R: "Rẽ phải", W: "Lặp: bám tường phải" };
  function renderProg() {
    const ol = $("progList");
    ol.innerHTML = ST.prog.map((B, i) => `<li class="${B.c === "W" ? "w" : ""}${i === ST.err ? " err" : ""}${i === ST.cur ? " cur" : ""}"><button data-i="${i}" title="${B.c === "F" ? "Bấm để tăng số bước" : B.c === "W" ? "" : "Bấm để đổi trái/phải"}">${NAME[B.c]}${B.c === "F" ? " × " + B.n : ""}</button><button class="x" data-x="${i}" aria-label="Xóa lệnh ${i + 1}">${HKA.icon("x")}</button></li>`).join("");
    ol.querySelectorAll("button[data-i]").forEach((b) => (b.onclick = () => { const B = ST.prog[+b.dataset.i]; if (B.c === "F") B.n = B.n >= 8 ? 1 : B.n + 1; else if (B.c !== "W") B.c = B.c === "L" ? "R" : "L"; changed(); }));
    ol.querySelectorAll("button[data-x]").forEach((b) => (b.onclick = () => { ST.prog.splice(+b.dataset.x, 1); changed(); }));
    $("bCmds").textContent = ST.prog.length;
  }
  function changed() { ST.err = -1; ST.cur = -1; ST.run = null; $("bProg").textContent = "—"; renderProg(); }
  function runProg() {
    if (!ST.prog.length) { say("Chương trình đang trống. Hãy thêm vài khối lệnh, hoặc bấm <b>Gợi ý một chương trình</b>."); return; }
    ST.err = -1; const tr = trace(ST.maze, ST.prog); ST.run = { tr, i: 0, acc: 0 };
  }
  const moves = (tr) => tr.steps.reduce((n, p, i) => n + (i && (p.x !== tr.steps[i - 1].x || p.y !== tr.steps[i - 1].y) ? 1 : 0), 0);
  function progDone() {
    const tr = ST.run.tr, last = tr.steps[tr.steps.length - 1]; ST.cur = -1;
    if (tr.ok) { prog.done("prog"); if (tr.wall) prog.done("loop"); $("bProg").textContent = "Tới cờ!"; $("bProg").style.color = "#5ef2d6"; say(`Robot làm theo lệnh <b>tới cờ</b> sau ${moves(tr)} bước đi${tr.wall ? ", nhờ thuật toán bám tường có <b>lặp</b> và <b>rẽ nhánh</b>" : ""}.`); }
    else if (tr.crash != null) { ST.err = tr.crash; $("bProg").textContent = "Va tường"; $("bProg").style.color = "#ff8f6b"; say(`Robot <b>va tường</b> ở lệnh số <b>${tr.crash + 1}</b>. Máy làm đúng từng lệnh, kể cả lệnh sai!`); }
    else { $("bProg").textContent = "Chưa tới"; $("bProg").style.color = "#ffc34d"; say(`Hết lệnh nhưng robot mới ở ô (${last.x}, ${last.y}), chưa tới cờ. Thêm lệnh nữa nhé.`); }
    renderProg();
  }

  // ---------- robot tự học ----------
  function remap() {
    ST.mem.fill(Infinity); const g = id(G.x, G.y); if (!ST.K[g]) return; ST.mem[g] = 0; const q = [g];
    while (q.length) { const c = q.shift(), x = c % N, y = (c / N) | 0; for (let d = 0; d < 4; d++) { const a = x + DX[d], b = y + DY[d]; if (a < 0 || b < 0 || a >= N || b >= N) continue; const k = id(a, b); if (ST.K[k] && !isFinite(ST.mem[k])) { ST.mem[k] = ST.mem[c] + 1; q.push(k); } } }
  }
  function learnTry(rnd) {
    rnd = rnd || Math.random; const m = ST.maze, path = [id(S.x, S.y)], seen = new Set(path); let x = S.x, y = S.y, explore = false;
    const look = () => { if (!ST.memOn) return; ST.K[id(x, y)] = 1; for (let d = 0; d < 4; d++) { const a = x + DX[d], b = y + DY[d]; if (a >= 0 && b >= 0 && a < N && b < N && m[id(a, b)]) ST.K[id(a, b)] = 0; } };
    look();
    for (let k = 0; k < 600 && !(x === G.x && y === G.y); k++) {
      const nb = [0, 1, 2, 3].map((d) => [x + DX[d], y + DY[d]]).filter(([a, b]) => open(m, a, b)), known = ST.memOn ? nb.filter(([a, b]) => isFinite(ST.mem[id(a, b)])) : [];
      let pick;
      const unknown = ST.memOn ? nb.filter(([a, b]) => !ST.K[id(a, b)]) : [];
      if (known.length && unknown.length && (explore || rnd() < ST.eps)) { pick = unknown[Math.floor(rnd() * unknown.length)]; explore = true; }
      else if (known.length) { explore = false; const best = Math.min(...known.map(([a, b]) => ST.mem[id(a, b)])); const c = known.filter(([a, b]) => ST.mem[id(a, b)] === best); pick = c[Math.floor(rnd() * c.length)]; }
      else { const fresh = nb.filter(([a, b]) => !seen.has(id(a, b))), pool = fresh.length && rnd() < 0.85 ? fresh : nb; pick = pool[Math.floor(rnd() * pool.length)]; }
      [x, y] = pick; path.push(id(x, y)); seen.add(id(x, y)); look();
    }
    const ok = x === G.x && y === G.y;
    if (ST.memOn) remap();
    ST.tries.push({ n: path.length - 1, ok }); return { path, ok };
  }
  function doTry(n) {
    let r; for (let i = 0; i < n; i++) r = learnTry();
    ST.lrun = { path: r.path, i: n === 1 ? 0 : r.path.length - 1 }; ST.lpath = r.path; brain(); renderChart();
    const last = ST.tries[ST.tries.length - 1];
    if (ST.memOn && last.n === SHORT) prog.done("learn");
    say(`Robot tự học: lần thử thứ <b>${ST.tries.length}</b> đi <b>${last.n}</b> bước${last.n === SHORT ? " (đường ngắn nhất!)" : `, đường ngắn nhất là ${SHORT} bước`}.`);
  }
  const memCount = () => ST.mem.reduce((s, v) => s + (isFinite(v) ? 1 : 0), 0);
  function brain() {
    $("bTries").textContent = ST.tries.length; const l = ST.tries[ST.tries.length - 1]; $("bLast").textContent = l ? (l.ok ? l.n : "lạc") : "—";
    $("bLast").style.color = l && l.n === SHORT ? "#5ef2d6" : "#fff"; $("bMem").textContent = memCount() + " ô"; $("bBest").textContent = SHORT + " bước";
  }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d"), CS = 36, OX = [22, 462], OY = 48;
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  function drawMaze(ctx, m, ox, oy, cs, o) {
    o = o || {};
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
      const w = m[id(x, y)], px = ox + x * cs, py = oy + y * cs;
      if (w) { ctx.fillStyle = "#3a3f8f"; ctx.fillRect(px, py, cs, cs); ctx.fillStyle = "#4a50a8"; ctx.fillRect(px, py, cs, 4); }
      else {
        ctx.fillStyle = "#171b40"; ctx.fillRect(px, py, cs, cs);
        if (o.mem && isFinite(o.mem[id(x, y)])) { const v = o.mem[id(x, y)], a = Math.max(0.12, 0.6 - v * 0.02); ctx.fillStyle = `rgba(63,224,197,${a})`; ctx.fillRect(px + 2, py + 2, cs - 4, cs - 4); lab(ctx, String(v), px + cs / 2, py + cs / 2 + 4, "#e9fffb", `700 ${Math.round(cs * 0.27)}px JetBrains Mono, monospace`, "center"); }
      }
    }
    const fx = ox + G.x * cs, fy = oy + G.y * cs; ctx.strokeStyle = "#e8eaff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(fx + cs * 0.32, fy + cs * 0.85); ctx.lineTo(fx + cs * 0.32, fy + cs * 0.15); ctx.stroke(); ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(fx + cs * 0.34, fy + cs * 0.15); ctx.lineTo(fx + cs * 0.8, fy + cs * 0.3); ctx.lineTo(fx + cs * 0.34, fy + cs * 0.46); ctx.fill();
    const sx = ox + S.x * cs, sy = oy + S.y * cs; ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.setLineDash([3, 3]); ctx.strokeRect(sx + 3, sy + 3, cs - 6, cs - 6); ctx.setLineDash([]);
  }
  function drawPath(ctx, path, ox, oy, cs, col, upto) {
    if (!path || path.length < 2) return; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.lineJoin = "round"; ctx.globalAlpha = 0.75; ctx.beginPath();
    const n = Math.min(path.length, (upto == null ? path.length - 1 : upto) + 1);
    for (let i = 0; i < n; i++) { const p = path[i], x = typeof p === "number" ? p % N : p.x, y = typeof p === "number" ? (p / N) | 0 : p.y, px = ox + x * cs + cs / 2, py = oy + y * cs + cs / 2; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.stroke(); ctx.globalAlpha = 1;
  }
  function bot(ctx, px, py, cs, d, col) {
    ctx.save(); ctx.translate(px + cs / 2, py + cs / 2); const r = cs * 0.34;
    ctx.fillStyle = col; D.rr(ctx, -r, -r, 2 * r, 2 * r, r * 0.45); ctx.fill(); ctx.fillStyle = "#1d2152"; D.rr(ctx, -r * 0.7, -r * 0.45, r * 1.4, r * 0.8, r * 0.3); ctx.fill();
    ctx.fillStyle = "#5ef2d6"; ctx.beginPath(); ctx.arc(-r * 0.3, -r * 0.05, r * 0.16, 0, 7); ctx.arc(r * 0.3, -r * 0.05, r * 0.16, 0, 7); ctx.fill();
    if (d != null) { ctx.rotate(d * Math.PI / 2); ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(0, -r - 9); ctx.lineTo(-6, -r - 1); ctx.lineTo(6, -r - 1); ctx.fill(); }
    ctx.restore();
  }
  function renderStage() {
    const ctx = sctx; D.labBg(ctx);
    lab(ctx, "ROBOT LÀM THEO LỆNH", OX[0], 30, "#a99dff", "800 13px Be Vietnam Pro, sans-serif"); lab(ctx, "ROBOT TỰ HỌC", OX[1], 30, "#5ef2d6", "800 13px Be Vietnam Pro, sans-serif");
    drawMaze(ctx, ST.maze, OX[0], OY, CS); drawMaze(ctx, ST.maze, OX[1], OY, CS, { mem: ST.heat ? ST.mem : null });
    // robot trái
    let pos = { x: S.x, y: S.y, d: 0 };
    if (ST.run) { const st = ST.run.tr.steps, i = Math.min(ST.run.i, st.length - 1); drawPath(ctx, st, OX[0], OY, CS, "#a99dff", i); pos = st[i];
      if (ST.run.i >= st.length - 1 && ST.run.tr.crash != null) { const a = ST.run.tr.at, px = OX[0] + a.x * CS, py = OY + a.y * CS; if (a.x >= 0 && a.y >= 0 && a.x < N && a.y < N) { ctx.strokeStyle = "#ff5d5d"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(px + 10, py + 10); ctx.lineTo(px + CS - 10, py + CS - 10); ctx.moveTo(px + CS - 10, py + 10); ctx.lineTo(px + 10, py + CS - 10); ctx.stroke(); } } }
    bot(ctx, OX[0] + pos.x * CS, OY + pos.y * CS, CS, pos.d, "#7c6bff");
    // robot phải
    let lp = { x: S.x, y: S.y };
    if (ST.lrun) { const p = ST.lrun.path, i = Math.min(Math.floor(ST.lrun.i), p.length - 1); drawPath(ctx, p, OX[1], OY, CS, "#ffc34d", i); lp = { x: p[i] % N, y: (p[i] / N) | 0 }; }
    bot(ctx, OX[1] + lp.x * CS, OY + lp.y * CS, CS, null, "#3fe0c5");
    lab(ctx, ST.run ? `Bước ${Math.min(ST.run.i, ST.run.tr.steps.length - 1)}` : `${ST.prog.length} khối lệnh`, OX[0], 462, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif");
    lab(ctx, ST.lrun ? `Lần thử ${ST.tries.length} · ${Math.min(Math.floor(ST.lrun.i), ST.lrun.path.length - 1)} bước` : (ST.memOn ? "Chưa thử lần nào" : "Trí nhớ đang TẮT"), OX[1], 462, ST.memOn ? "#8f96d4" : "#ff8f6b", "600 12px Be Vietnam Pro, sans-serif");
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 46, B = 30, T = 14; ctx.clearRect(0, 0, W, H);
    const tr = ST.tries.slice(-50), off = ST.tries.length - tr.length, mx = Math.max(40, ...tr.map((t) => t.n)), Y = (v) => T + (1 - v / mx) * (H - T - B), bw = (W - L - 10) / 50;
    ctx.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= mx; v += Math.ceil(mx / 4 / 10) * 10) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - 10, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v, 10, Y(v) + 4); }
    tr.forEach((t, i) => { const x = L + i * bw; ctx.fillStyle = !t.ok ? TH.coral : t.n === SHORT ? TH.mint : TH.violet; D.rr(ctx, x + 2, Y(t.n), bw - 4, Math.max(1, H - B - Y(t.n)), 3); ctx.fill(); if ((i + off + 1) % 5 === 0 || i === 0) { ctx.fillStyle = TH.text; ctx.fillText(i + off + 1, x + bw / 2 - 6, H - 10); } });
    ctx.setLineDash([6, 5]); ctx.strokeStyle = TH.amber; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, Y(SHORT)); ctx.lineTo(W - 10, Y(SHORT)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.amber; ctx.fillText(`đường ngắn nhất: ${SHORT} bước`, W - 230, Y(SHORT) - 6);
    if (!tr.length) { ctx.fillStyle = TH.text; ctx.font = "13px Be Vietnam Pro, sans-serif"; ctx.fillText("Bấm Thử 1 lần hoặc Thử 20 lần để xem robot học dần.", L + 20, T + 30); }
  }
  const say = (h) => ($("askText").innerHTML = h);
  const guide = (h) => ($("guideText").innerHTML = h);

  // ---------- SOI ----------
  const SOI = [
    { t: "Dãy lệnh", e: "code", d: "Robot bên trái chỉ biết làm <b>lần lượt</b> từng lệnh: tiến, rẽ trái, rẽ phải. Một dãy lệnh rõ ràng để giải quyết việc gì đó gọi là <b>thuật toán</b>." },
    { t: "Lặp lại", e: "repeat", d: "Nhiều lệnh <b>giống nhau</b> liền nhau có thể gom thành một khối <b>lặp</b>: \"Tiến × 3\" thay cho ba lệnh Tiến. Chương trình ngắn hơn, dễ đọc hơn." },
    { t: "Rẽ nhánh", e: "help", d: "Khối <b>bám tường phải</b> dùng <b>rẽ nhánh</b>: nếu bên phải trống thì rẽ phải; nếu không, phía trước trống thì tiến; nếu không nữa thì rẽ trái. Lặp lại tới khi gặp cờ. Robot nhìn tình huống rồi mới chọn việc." },
    { t: "Thử và sai", e: "sparkle", d: "Robot bên phải không có chương trình đi đường. Lần đầu nó <b>đi thử</b>, ưu tiên ô chưa tới, nên thường đi vòng rất xa." },
    { t: "Ghi nhớ", e: "book", d: "Robot vẽ lại <b>bản đồ</b> những ô đã đi qua và chỗ có tường. Từ bản đồ đó, nó ghi vào mỗi ô: <b>còn bao nhiêu bước nữa tới cờ</b>. Đó là <b>trí nhớ</b> (kinh nghiệm) của robot." },
    { t: "Lần sau giỏi hơn", e: "chart", d: "Lần sau, robot đi về phía ô có <b>số nhỏ hơn</b>, thỉnh thoảng <b>tò mò</b> thử lối khác để tìm đường tắt. Sau nhiều lần thử, nó tìm ra đường ngắn nhất mà không ai chỉ cho." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  let demoKey = "", DEMO = null;
  function demo() {
    if (demoKey === ST.mi + "|" + ST.maze.join("")) return DEMO; demoKey = ST.mi + "|" + ST.maze.join("");
    const save = { mem: ST.mem, K: ST.K, tries: ST.tries, eps: ST.eps, memOn: ST.memOn }, r = P.rng(24); ST.mem = new Float32Array(N * N).fill(Infinity); ST.K = new Uint8Array(N * N); ST.tries = []; ST.eps = 0.15; ST.memOn = true;
    const first = learnTry(r); const mem1 = Float32Array.from(ST.mem); for (let i = 0; i < 29; i++) learnTry(r);
    DEMO = { first: first.path, mem1, tries: ST.tries.map((t) => t.n), memEnd: Float32Array.from(ST.mem) }; Object.assign(ST, save); return DEMO;
  }
  function expand(bl) { const o = []; bl.forEach((B) => { if (B.c === "F") for (let k = 0; k < B.n; k++) o.push("Tiến"); else o.push(NAME[B.c]); }); return o; }
  function renderSoi() {
    const ctx = octx, s = soiStep, cs = 32; D.labBg(ctx);
    const smp = ST.prog.length && !ST.prog.some((b) => b.c === "W") ? ST.prog : sample(ST.maze);
    if (s === 0 || s === 1) {
      drawMaze(ctx, ST.maze, 16, 50, cs); const tr = trace(ST.maze, smp), k = Math.floor(ST.t * 4) % (tr.steps.length + 6), i = Math.min(k, tr.steps.length - 1); drawPath(ctx, tr.steps, 16, 50, cs, "#a99dff", i); const p = tr.steps[i]; bot(ctx, 16 + p.x * cs, 50 + p.y * cs, cs, p.d, "#7c6bff");
      if (s === 0) { const ex = expand(smp); lab(ctx, `${ex.length} lệnh lần lượt:`, 380, 40, "#ffc34d"); ex.forEach((t, j) => lab(ctx, `${j + 1}. ${t}`, 380 + Math.floor(j / 18) * 130, 64 + (j % 18) * 21, j === Math.max(0, i - 1) ? "#ffc34d" : "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif")); }
      else { const ex = expand(smp); lab(ctx, `${ex.length} lệnh → ${smp.length} khối`, 380, 40, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); smp.forEach((B, j) => { const y = 60 + j * 30; ctx.fillStyle = B.c === "F" ? "#5443ff" : "#2b2f6e"; D.rr(ctx, 380, y, 200, 24, 7); ctx.fill(); lab(ctx, `${j + 1}. ${NAME[B.c]}${B.c === "F" ? " × " + B.n : ""}`, 390, y + 17, "#fff", "700 12px Be Vietnam Pro, sans-serif"); }); }
      lab(ctx, "Mê cung đang chọn", 16, 30, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif"); return;
    }
    if (s === 2) {
      const ph = Math.floor(ST.t * 1.2) % 4, box = (x, y, w, h, t, on, dia) => { ctx.fillStyle = on ? "#ffc34d" : dia ? "#2b2f6e" : "#5443ff"; if (dia) { ctx.beginPath(); ctx.moveTo(x + w / 2, y); ctx.lineTo(x + w, y + h / 2); ctx.lineTo(x + w / 2, y + h); ctx.lineTo(x, y + h / 2); ctx.closePath(); ctx.fill(); } else { D.rr(ctx, x, y, w, h, 10); ctx.fill(); } lab(ctx, t, x + w / 2, y + h / 2 + 5, on ? "#1b1f4a" : "#fff", "700 13px Be Vietnam Pro, sans-serif", "center"); };
      box(220, 20, 200, 44, "Tới cờ chưa?", ph === 0, true); box(220, 100, 200, 60, "Bên phải trống?", ph === 1, true); box(470, 108, 150, 44, "Rẽ phải, tiến", false); box(220, 200, 200, 60, "Phía trước trống?", ph === 2, true); box(470, 208, 150, 44, "Tiến", false); box(245, 300, 150, 44, "Rẽ trái", ph === 3);
      box(470, 20, 150, 44, "Dừng: tới cờ!", false);
      const ar = (a, b, c, t) => { D.arrow(ctx, a, b, c || "#8f96d4", 2.5); if (t) lab(ctx, t, a.y === b.y ? a.x + 4 : a.x + 8, a.y === b.y ? a.y - 8 : (a.y + b.y) / 2 + 4, c, "700 11px Be Vietnam Pro, sans-serif"); };
      ar({ x: 420, y: 42 }, { x: 468, y: 42 }, "#5ef2d6", "có"); ar({ x: 320, y: 64 }, { x: 320, y: 98 }, "#ff8f6b", "chưa"); ar({ x: 420, y: 130 }, { x: 468, y: 130 }, "#5ef2d6", "có"); ar({ x: 320, y: 160 }, { x: 320, y: 198 }, "#ff8f6b", "không"); ar({ x: 420, y: 230 }, { x: 468, y: 230 }, "#5ef2d6", "có"); ar({ x: 320, y: 260 }, { x: 320, y: 298 }, "#ff8f6b", "không");
      ctx.strokeStyle = "#8f96d4"; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.beginPath(); ctx.moveTo(245, 322); ctx.lineTo(150, 322); ctx.lineTo(150, 42); ctx.lineTo(214, 42); ctx.moveTo(620, 130); ctx.lineTo(636, 130); ctx.lineTo(636, 380); ctx.lineTo(150, 380); ctx.lineTo(150, 322); ctx.moveTo(620, 230); ctx.lineTo(636, 230); ctx.stroke(); ctx.setLineDash([]);
      lab(ctx, "lặp lại", 100, 200, "#8f96d4", "700 12px Be Vietnam Pro, sans-serif"); lab(ctx, "Robot nhìn quanh rồi mới chọn việc: đó là rẽ nhánh.", 20, 430, "#ffc34d", "600 14px Be Vietnam Pro, sans-serif"); return;
    }
    const dm = demo();
    if (s === 3) { drawMaze(ctx, ST.maze, 16, 50, cs); const k = Math.floor(ST.t * 8) % (dm.first.length + 12); drawPath(ctx, dm.first, 16, 50, cs, "#ffc34d", k); const c = dm.first[Math.min(k, dm.first.length - 1)]; bot(ctx, 16 + (c % N) * cs, 50 + ((c / N) | 0) * cs, cs, null, "#3fe0c5"); lab(ctx, `Lần thử đầu tiên: ${dm.first.length - 1} bước`, 380, 80, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, `Đường ngắn nhất: ${SHORT} bước`, 380, 110, "#5ef2d6", "700 13px Be Vietnam Pro, sans-serif"); lab(ctx, "Robot chưa biết gì,", 380, 150); lab(ctx, "cứ đi tới ô chưa tới.", 380, 170); return; }
    if (s === 4) { const mine = memCount() > 0; drawMaze(ctx, ST.maze, 16, 50, cs, { mem: mine ? ST.mem : dm.mem1 }); lab(ctx, mine ? "Trí nhớ thật của robot" : "Trí nhớ sau lần thử đầu", 380, 80, "#5ef2d6", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, "Số trong mỗi ô:", 380, 112); lab(ctx, "còn bao nhiêu bước tới cờ", 380, 132, "#ffc34d"); lab(ctx, `Đã ghi nhớ ${mine ? memCount() : dm.mem1.reduce((a, v) => a + (isFinite(v) ? 1 : 0), 0)} ô`, 380, 170); return; }
    const t = dm.tries, mx = Math.max(...t), bw = 560 / t.length; lab(ctx, "Số bước qua 30 lần thử (robot mẫu)", 30, 40, "#c3c7f0", "800 14px Be Vietnam Pro, sans-serif");
    t.forEach((v, i) => { const h = (v / mx) * 300; ctx.fillStyle = v === SHORT ? "#3fe0c5" : "#7c6bff"; D.rr(ctx, 40 + i * bw + 2, 380 - h, bw - 4, h, 3); ctx.fill(); });
    const sy = 380 - (SHORT / mx) * 300; ctx.setLineDash([5, 4]); ctx.strokeStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(40, sy); ctx.lineTo(600, sy); ctx.stroke(); ctx.setLineDash([]); lab(ctx, `ngắn nhất ${SHORT}`, 500, sy - 6, "#ffc34d");
    lab(ctx, "lần 1", 40, 400, "#8f96d4", "11px Be Vietnam Pro, sans-serif"); lab(ctx, "lần 30", 560, 400, "#8f96d4", "11px Be Vietnam Pro, sans-serif");
    lab(ctx, "Không ai viết đường đi cho robot: nó tự rút ngắn từ kinh nghiệm.", 30, 440, "#5ef2d6", "600 13px Be Vietnam Pro, sans-serif");
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), smp = sample(ST.maze);
    if (s === 0) el.innerHTML = `Chương trình mẫu có <span class="hl">${expand(smp).length}</span> lệnh`;
    else if (s === 1) el.innerHTML = `Gom lại còn <span class="hl">${smp.length}</span> khối`;
    else if (s === 2) el.innerHTML = `Một khối, chạy được ở <span class="hl">mọi mê cung</span> trong trò chơi`;
    else if (s === 3) el.innerHTML = `Lần thử đầu: <span class="w">${demo().first.length - 1}</span> bước`;
    else if (s === 4) el.innerHTML = `Robot của em đã nhớ <span class="hl">${memCount()}</span> ô`;
    else el.innerHTML = `Robot của em: <span class="hl">${ST.tries.length}</span> lần thử, lần gần nhất <span class="w">${ST.tries.length ? ST.tries[ST.tries.length - 1].n : "—"}</span> bước`;
  }

  // ---------- điều khiển ----------
  function setMaze(i, keepMem) {
    ST.mi = i; if (i === 2) { MAZES[2] = genMaze(100 + Math.floor(Math.random() * 9000)); }
    ST.maze = MAZES[i]; SHORT = bfs(ST.maze).length - 1; ST.run = null; ST.err = -1; ST.lrun = null;
    if (!keepMem) { ST.mem.fill(Infinity); ST.K.fill(0); ST.tries = []; } else remap();
    $("mazeBtns").querySelectorAll("button").forEach((b) => b.classList.toggle("ghost", +b.dataset.m !== i));
    $("stageTag").textContent = i === 2 ? "MÊ CUNG MỚI" : "MÊ CUNG " + (i + 1); $("bProg").textContent = "—"; renderProg(); brain(); renderChart();
  }
  function bind() {
    $("mazeBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { setMaze(+b.dataset.m); say("Mê cung đã đổi. Chương trình của em vẫn giữ nguyên, trí nhớ của robot tự học được xóa. Thử chạy lại cả hai robot xem!"); }));
    document.querySelectorAll(".palette [data-b]").forEach((b) => (b.onclick = () => { const c = b.dataset.b, last = ST.prog[ST.prog.length - 1]; if (ST.prog.length >= 30) return; if (c === "F" && last && last.c === "F" && last.n < 8) last.n++; else ST.prog.push(c === "F" ? { c, n: 1 } : { c }); changed(); }));
    $("btnRun").onclick = runProg; $("btnClearProg").onclick = () => { ST.prog = []; changed(); };
    $("btnSample").onclick = () => { ST.prog = sample(ST.maze); changed(); say("Đây là một chương trình đi đúng đường ngắn nhất của mê cung này. Bấm <b>Chạy</b> để kiểm tra."); };
    $("btnTry").onclick = () => doTry(1); $("btnTry20").onclick = () => doTry(20);
    $("btnForget").onclick = () => { ST.mem.fill(Infinity); ST.K.fill(0); ST.tries = []; ST.lrun = null; brain(); renderChart(); say("Robot tự học đã quên hết. Lần thử tới sẽ như lần đầu tiên."); };
    const setEps = P.range("eps", () => ST.eps, (v) => (ST.eps = v), (v) => Math.round(v * 100) + "%");
    $("optMem").onchange = (e) => { ST.memOn = e.target.checked; say(ST.memOn ? "Trí nhớ đã bật: robot sẽ dùng kinh nghiệm cũ cho lần sau." : "Trí nhớ đã tắt: robot sẽ không ghi nhớ gì nữa."); };
    $("optHeat").onchange = (e) => (ST.heat = e.target.checked);
    const clear = () => { ST.brk = null; ST.memOn = true; $("optMem").checked = true; ST.eps = 0.15; setEps(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke"); ST.brk = k;
      if (k === "newmaze") { setMaze(0); ST.prog = sample(MAZES[0]); for (let i = 0; i < 30; i++) learnTry(); setMaze(1, true); ST.tries = []; renderProg(); runProg(); doTry(1); guide("Chương trình viết cho Mê cung 1 chạy trên <b>Mê cung 2</b>: robot trái va tường. Robot phải mang trí nhớ cũ nên cũng đi lạc. Bấm <b>Thử 20 lần</b> cho robot phải, và thử thay chương trình bằng khối <b>Lặp: bám tường phải</b>."); }
      if (k === "bug") { ST.prog = sample(ST.maze); const t = ST.prog.findIndex((B) => B.c === "L" || B.c === "R"); if (t >= 0) ST.prog[t].c = ST.prog[t].c === "L" ? "R" : "L"; changed(); runProg(); guide(`Chương trình bị đổi <b>một lệnh rẽ</b>. Robot làm đúng từng lệnh nên đi sai hướng. Xem lệnh tô đỏ khi robot dừng, bấm vào lệnh rẽ số ${t + 1} để sửa rồi chạy lại.`); }
      if (k === "nomem") { ST.mem.fill(Infinity); ST.K.fill(0); ST.tries = []; ST.memOn = false; $("optMem").checked = false; doTry(20); guide("Robot đã thử 20 lần mà <b>không ghi nhớ gì</b>. Nhìn biểu đồ: số bước không hề giảm! Bật lại <b>Robot có trí nhớ</b> rồi bấm <b>Thử 20 lần</b>."); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); setMaze(0); ST.prog = []; changed(); guide("Mọi sự cố đã tắt. Quay lại Mê cung 1, chương trình trống, robot tự học chưa có trí nhớ."); };
  }

  const QUIZ = [
    { q: "Thuật toán là gì?", o: ["Một loại robot", "Dãy các bước rõ ràng để giải quyết một việc", "Một con số rất lớn", "Một mê cung khó"], a: 1, e: "Thuật toán là dãy các bước rõ ràng, làm theo đúng thứ tự thì giải quyết được việc cần làm." },
    { q: "Chương trình \"Tiến × 3, Rẽ phải, Tiến × 2\" viết cho mê cung A. Chạy nó trên mê cung B thì sao?", o: ["Robot tự sửa lệnh cho đúng", "Robot có thể va tường, vì dãy lệnh chỉ đúng với mê cung A", "Robot luôn tới cờ", "Robot đứng yên"], a: 1, e: "Dãy lệnh cố định không tự thích nghi. Muốn chạy ở nhiều mê cung, cần rẽ nhánh (nếu… thì…) hoặc cho máy tự học." },
    { q: "Vì sao robot tự học đi đường ngắn hơn sau nhiều lần thử?", o: ["Vì nó được người chỉ đường", "Vì nó ghi nhớ khoảng cách tới cờ từ các lần thử trước và dùng lại", "Vì mê cung ngắn lại", "Vì nó chạy nhanh hơn"], a: 1, e: "Học là dùng kinh nghiệm cũ cho lần sau. Tắt trí nhớ thì số bước không giảm." },
    { q: "Câu lệnh \"Nếu bên phải trống thì rẽ phải, nếu không thì đi thẳng\" là cấu trúc gì?", o: ["Tuần tự", "Lặp", "Rẽ nhánh", "Không phải thuật toán"], a: 2, e: "Rẽ nhánh giúp chương trình chọn việc khác nhau tùy theo tình huống." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now();
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.run && ST.run.i < ST.run.tr.steps.length - 1) { ST.run.acc += dt * (ST.run.tr.steps.length > 40 ? 12 : 5); while (ST.run.acc >= 1 && ST.run.i < ST.run.tr.steps.length - 1) { ST.run.acc -= 1; ST.run.i++; ST.cur = ST.run.tr.steps[ST.run.i].b; if (ST.run.i === ST.run.tr.steps.length - 1) progDone(); else renderProg(); } }
    else if (ST.run && !ST.run.fin) { ST.run.fin = true; if (ST.run.tr.steps.length === 1) progDone(); }
    if (ST.run && ST.run.i >= ST.run.tr.steps.length - 1) ST.run.fin = true;
    if (ST.lrun && ST.lrun.i < ST.lrun.path.length - 1) ST.lrun.i += dt * 14;
    renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick);
  }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); setMaze(0); say("Robot trái chờ chương trình của em. Robot phải chờ em bấm <b>Thử</b>."); guide("Viết chương trình cho robot bên trái bằng các khối lệnh. Robot bên phải thì cứ để nó <b>tự thử</b>!");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka24 = { ST, trace, sample, learnTry, bfs, MAZES, get SHORT() { return SHORT; } };
  requestAnimationFrame(tick);
})();
