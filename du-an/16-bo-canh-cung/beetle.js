/* Hộp Kính AI · Dự án 16 · Bọ cánh cứng ngụy trang (chọn lọc, lai, đột biến = thuật toán di truyền) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-36");
  const W = 880, H = 440, N = 24, MAXD = 220;
  const ENVS = [
    { id: "bark", n: "Vỏ cây nâu", c: [110, 78, 52] },
    { id: "leaf", n: "Lá cây xanh", c: [70, 128, 58] },
    { id: "sand", n: "Cát vàng", c: [214, 186, 120] },
    { id: "stone", n: "Đá xám", c: [128, 130, 136] }
  ];
  let rnd = P.rng(36);
  const gauss = () => { const u = rnd() || 1e-9, v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); };
  const cl = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const ST = { env: 0, mut: 12, eat: 12, cross: true, sharp: true, pop: [], gen: 0, hist: [], mode: "auto", caught: [], run: 0, ghosts: [], sel: null, t: 0, lastKids: null };
  const env = () => ENVS[ST.env].c;
  const camo = (g) => Math.max(0, 1 - dist(g, env()) / MAXD);
  const camoMean = () => ST.pop.reduce((s, b) => s + camo(b.g), 0) / ST.pop.length;
  const meanColor = () => [0, 1, 2].map((i) => ST.pop.reduce((s, b) => s + b.g[i], 0) / ST.pop.length);
  const rgb = (c, a) => `rgba(${cl(c[0])},${cl(c[1])},${cl(c[2])},${a == null ? 1 : a})`;
  const pct = (v) => Math.round(v * 100) + "%";

  // ---------- quần thể ----------
  function place(pop) {
    const cells = []; for (let r = 0; r < 5; r++) for (let c = 0; c < 11; c++) cells.push([c, r]);
    for (let i = cells.length - 1; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [cells[i], cells[j]] = [cells[j], cells[i]]; }
    pop.forEach((b, k) => { const [c, r] = cells[k]; b.x = 40 + c * 80 + (rnd() - 0.5) * 36; b.y = 44 + r * 88 + (rnd() - 0.5) * 36; b.a = rnd() * 6.28; b.born = ST.t; });
    return pop;
  }
  let uid = 0;
  const mk = (g, par) => ({ g, id: ++uid, par: par || null });
  function randomPop(kind) {
    return place(Array.from({ length: N }, () => mk(kind === "red" ? [150 + rnd() * 80, 40 + rnd() * 50, 40 + rnd() * 50].map(cl) : [rnd() * 255, rnd() * 255, rnd() * 255].map(cl))));
  }
  function record() { ST.hist.push({ c: camoMean(), m: meanColor() }); if (ST.hist.length > 80) ST.hist.shift(); }
  function reset(kind) { ST.pop = randomPop(kind); ST.gen = 0; ST.hist = []; ST.caught = []; ST.sel = null; ST.lastKids = null; record(); }
  function chooseEaten() {
    const noise = ST.sharp ? 22 : 140;
    return ST.pop.map((b, i) => ({ i, s: dist(b.g, env()) + noise * gauss() })).sort((a, b) => b.s - a.s).slice(0, ST.eat).map((x) => x.i);
  }
  function nextGen(eatenIdx) {
    const eaten = new Set(eatenIdx);
    ST.ghosts = ST.pop.filter((_, i) => eaten.has(i)).map((b) => ({ x: b.x, y: b.y, g: b.g, t: ST.t }));
    const surv = ST.pop.filter((_, i) => !eaten.has(i)), kids = [];
    while (surv.length + kids.length < N) {
      const A = surv[(rnd() * surv.length) | 0], B = surv[(rnd() * surv.length) | 0];
      const mix = [0, 1, 2].map((i) => (ST.cross && rnd() < 0.5 ? B.g[i] : A.g[i]));
      const g = mix.map((v) => cl(v + gauss() * ST.mut));
      kids.push(mk(g, { a: A.g, b: ST.cross ? B.g : null, mix }));
    }
    ST.lastKids = kids; ST.pop = place(surv.concat(kids)); ST.gen++; ST.caught = []; record();
    if (ST.gen >= 20) prog.done("gens"); if (camoMean() >= 0.85) prog.done("camo");
  }
  function silent(n) { for (let i = 0; i < n; i++) nextGen(chooseEaten()); ST.ghosts = []; }

  // ---------- nền ----------
  const bgCache = {};
  function bg(i) {
    if (bgCache[i]) return bgCache[i];
    const cv = document.createElement("canvas"); cv.width = W; cv.height = H; const c = cv.getContext("2d"), E = ENVS[i], r = P.rng(100 + i), base = E.c;
    c.fillStyle = rgb(base); c.fillRect(0, 0, W, H);
    const shade = (k, j) => rgb(base.map((v) => v * k + j * (r() - 0.5)));
    if (E.id === "bark") { for (let k = 0; k < 140; k++) { const x = r() * W; c.strokeStyle = shade(0.7 + r() * 0.6, 20); c.lineWidth = 2 + r() * 6; c.beginPath(); c.moveTo(x, 0); for (let y = 0; y <= H; y += 40) c.lineTo(x + Math.sin(y / 60 + k) * 8, y); c.stroke(); } }
    if (E.id === "leaf") { for (let k = 0; k < 260; k++) { c.save(); c.translate(r() * W, r() * H); c.rotate(r() * 6.28); c.fillStyle = shade(0.7 + r() * 0.6, 24); c.beginPath(); c.ellipse(0, 0, 22 + r() * 18, 9 + r() * 6, 0, 0, 7); c.fill(); c.restore(); } }
    if (E.id === "sand") { for (let k = 0; k < 2600; k++) { c.fillStyle = shade(0.82 + r() * 0.36, 16); c.fillRect(r() * W, r() * H, 2 + r() * 3, 2 + r() * 3); } }
    if (E.id === "stone") { for (let k = 0; k < 120; k++) { const x = r() * W, y = r() * H, s = 20 + r() * 40; c.fillStyle = shade(0.75 + r() * 0.5, 14); c.beginPath(); for (let a = 0; a < 6; a++) { const t = (a / 6) * 6.28, q = s * (0.7 + r() * 0.5); c.lineTo(x + Math.cos(t) * q, y + Math.sin(t) * q); } c.closePath(); c.fill(); } }
    return (bgCache[i] = cv);
  }

  // ---------- vẽ ----------
  const cv = $("stage"), ctx = cv.getContext("2d");
  function beetle(c, b, s, alpha) {
    c.save(); c.translate(b.x, b.y); c.rotate(b.a); c.scale(s, s); c.globalAlpha = alpha;
    const dark = rgb(b.g.map((v) => v * 0.55)), body = rgb(b.g);
    c.strokeStyle = dark; c.lineWidth = 2; for (const k of [-1, 1]) for (const y of [-6, 2, 10]) { c.beginPath(); c.moveTo(k * 8, y); c.lineTo(k * 17, y + 4 * Math.sign(y || 1)); c.stroke(); }
    c.fillStyle = dark; c.beginPath(); c.ellipse(0, -15, 6, 5, 0, 0, 7); c.fill();
    c.fillStyle = body; c.beginPath(); c.ellipse(0, 3, 11, 15, 0, 0, 7); c.fill();
    c.strokeStyle = dark; c.lineWidth = 1.2; c.beginPath(); c.moveTo(0, -11); c.lineTo(0, 17); c.stroke();
    c.fillStyle = "rgba(255,255,255,.18)"; c.beginPath(); c.ellipse(-4, -2, 3, 6, 0, 0, 7); c.fill();
    c.restore();
  }
  function draw() {
    ctx.drawImage(bg(ST.env), 0, 0);
    ST.pop.forEach((b) => { const age = ST.t - (b.born || 0); beetle(ctx, b, 1, Math.min(1, age * 3)); });
    ST.ghosts.forEach((g) => { const a = 1 - (ST.t - g.t) / 0.8; if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = "#ff5a3c"; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(g.x - 14, g.y - 14); ctx.lineTo(g.x + 14, g.y + 14); ctx.moveTo(g.x + 14, g.y - 14); ctx.lineTo(g.x - 14, g.y + 14); ctx.stroke(); ctx.restore(); });
    ST.ghosts = ST.ghosts.filter((g) => ST.t - g.t < 0.8);
    ST.caught.forEach((i) => { const b = ST.pop[i]; ctx.strokeStyle = "#ff5a3c"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(b.x, b.y, 22, 0, 7); ctx.stroke(); });
    if (ST.sel != null && ST.pop[ST.sel]) { const b = ST.pop[ST.sel]; ctx.setLineDash([5, 4]); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(b.x, b.y, 25, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
    if (ST.mode === "bird") D.pill(ctx, `Em làm chim: đã bắt ${ST.caught.length}/${ST.eat}`, W / 2, H - 24, "rgba(226,54,110,.9)", 14);
    else D.pill(ctx, `Thế hệ ${ST.gen} · độ lẫn ${pct(camoMean())}`, W / 2, H - 24, "rgba(18,22,51,.8)", 13);
  }

  // ---------- bảng ----------
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function panel() {
    $("bGen").textContent = ST.gen; const cm = camoMean(); $("bCamo").textContent = pct(cm); $("bCamo").style.color = cm >= 0.85 ? "#5ef2d6" : cm >= 0.65 ? "#ffc34d" : "#ff8f6b";
    $("swEnv").style.background = rgb(env()); $("swPop").style.background = rgb(meanColor());
    $("bStrip").innerHTML = ST.pop.slice().sort((a, b) => camo(b.g) - camo(a.g)).map((b) => `<i style="background:${rgb(b.g)}" title="Độ lẫn ${pct(camo(b.g))}"></i>`).join("");
    const b = ST.sel != null ? ST.pop[ST.sel] : null;
    if (!b) $("bGene").textContent = "Chạm vào một con bọ để xem ba gen màu của nó."; else $("bGene").innerHTML = `Gen đỏ R = ${b.g[0]} · gen xanh lá G = ${b.g[1]} · gen xanh dương B = ${b.g[2]}<br>Khác màu nền: ${Math.round(dist(b.g, env()))} → độ lẫn <b>${pct(camo(b.g))}</b>`;
    $("envTag").textContent = ENVS[ST.env].n.toUpperCase();
    document.querySelectorAll("#envs button").forEach((x, i) => { x.classList.toggle("ghost", i !== ST.env); x.setAttribute("aria-pressed", i === ST.env); });
    say(ST.mode === "bird" ? `Em là chim: bắt <b>${ST.eat}</b> con em thấy trước. Đã bắt <b>${ST.caught.length}</b>.` : `Thế hệ <b>${ST.gen}</b> trên nền <b>${ENVS[ST.env].n.toLowerCase()}</b>: độ lẫn trung bình <b>${pct(cm)}</b>${ST.hist.length > 1 ? ` (thế hệ trước ${pct(ST.hist[ST.hist.length - 2].c)})` : ""}.`);
    renderChart();
  }
  function renderChart() {
    const c = $("chart"), x = c.getContext("2d"), CW = c.width, CH = c.height, L = 46, R = 14, T = 14, B = 54, TH = P.TH; x.clearRect(0, 0, CW, CH);
    const n = Math.max(20, ST.hist.length), X = (i) => L + (i / (n - 1)) * (CW - L - R), Y = (v) => T + (1 - v) * (CH - T - B);
    x.font = "11px JetBrains Mono, monospace";
    for (const v of [0, 0.25, 0.5, 0.75, 1]) { x.strokeStyle = TH.grid; x.lineWidth = 1; x.beginPath(); x.moveTo(L, Y(v)); x.lineTo(CW - R, Y(v)); x.stroke(); x.fillStyle = TH.text; x.fillText(Math.round(v * 100) + "%", 6, Y(v) + 4); }
    x.setLineDash([6, 4]); x.strokeStyle = TH.mint; x.beginPath(); x.moveTo(L, Y(0.85)); x.lineTo(CW - R, Y(0.85)); x.stroke(); x.setLineDash([]); x.fillStyle = TH.mint; x.fillText("mục tiêu 85%", CW - R - 96, Y(0.85) - 6);
    const h = ST.hist, off = Math.max(0, ST.gen - h.length + 1);
    x.strokeStyle = TH.violet; x.lineWidth = 3; x.beginPath(); h.forEach((p, i) => (i ? x.lineTo(X(i), Y(p.c)) : x.moveTo(X(i), Y(p.c)))); x.stroke();
    h.forEach((p, i) => { x.fillStyle = rgb(p.m); const w = (CW - L - R) / (n - 1); x.fillRect(X(i) - w / 2, CH - B + 10, w + 1, 16); });
    x.fillStyle = TH.text; x.fillText(`thế hệ ${off}`, L, CH - 8); if (h.length > 6) x.fillText(`thế hệ ${ST.gen}`, Math.min(CW - R - 80, X(h.length - 1) - 30), CH - 8);
    if (h.length) { const p = h[h.length - 1]; x.fillStyle = TH.violet; x.beginPath(); x.arc(X(h.length - 1), Y(p.c), 5, 0, 7); x.fill(); }
  }

  // ---------- tương tác ----------
  function pt(e) { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; }
  cv.addEventListener("pointerdown", (e) => {
    const p = pt(e), rr = cv.getBoundingClientRect(); let best = -1, bd = Math.max(26, (20 * W) / rr.width); ST.pop.forEach((b, i) => { const d = Math.hypot(b.x - p.x, b.y - p.y); if (d < bd) { bd = d; best = i; } });
    if (best < 0) return; ST.sel = best;
    if (ST.mode === "bird" && !ST.caught.includes(best)) {
      ST.caught.push(best);
      if (ST.caught.length >= ST.eat) {
        const cm0 = camoMean(), lostCamo = ST.caught.reduce((s, i) => s + camo(ST.pop[i].g), 0) / ST.caught.length;
        nextGen(ST.caught.slice()); ST.mode = "auto"; ST.sel = null; prog.done("bird"); $("btnBird").classList.remove("on");
        guide(lostCamo <= cm0 ? `Em đã bắt ${ST.eat} con, độ lẫn trung bình của chúng là <b>${pct(lostCamo)}</b>, thấp hơn mức chung ${pct(cm0)}: em bắt con dễ thấy trước, đúng như chim thật. Những con khó thấy sống sót và sinh con: đàn bọ mới có độ lẫn <b>${pct(camoMean())}</b>.` : `Em đã bắt ${ST.eat} con có độ lẫn trung bình <b>${pct(lostCamo)}</b>, cao hơn mức chung ${pct(cm0)}: em đã cố tìm cả con khó thấy! Chim thật thường bắt con <b>dễ thấy trước</b>. Thử lại và bắt tự nhiên hơn nhé. Đàn bọ mới có độ lẫn <b>${pct(camoMean())}</b>.`);
      }
    }
    panel();
  });
  function stopRun() { ST.run = 0; $("btnRun").innerHTML = HKA.icon("play") + "Tự chạy 20 thế hệ"; }
  function bind() {
    $("envs").innerHTML = ENVS.map((E, i) => `<button class="btn small${i ? " ghost" : ""}" type="button" aria-pressed="${!i}"><span class="swatch" style="width:16px;height:16px;border-radius:5px;background:${rgb(E.c)}"></span>${E.n}</button>`).join("");
    document.querySelectorAll("#envs button").forEach((b, i) => (b.onclick = () => { ST.env = i; record(); panel(); guide(`Nền đổi thành <b>${ENVS[i].n.toLowerCase()}</b>. Đàn bọ giữ nguyên gen, nên độ lẫn có thể thay đổi rất nhiều. Chạy thêm vài thế hệ để xem chúng thích nghi.`); }));
    $("btnBird").onclick = () => { stopRun(); ST.mode = "bird"; ST.caught = []; $("btnBird").classList.add("on"); guide(`Em là chim! Bấm vào ${ST.eat} con bọ em <b>nhìn thấy đầu tiên</b>. Đừng cố tìm con khó thấy, hãy bắt tự nhiên như chim thật.`); panel(); };
    $("btnStep").onclick = () => { stopRun(); ST.mode = "auto"; nextGen(chooseEaten()); panel(); };
    $("btnRun").onclick = () => { if (ST.run) { stopRun(); return; } ST.mode = "auto"; ST.run = 20; ST.acc = 0; $("btnRun").innerHTML = HKA.icon("pause") + "Dừng"; };
    $("btnNew").onclick = () => { stopRun(); ST.mode = "auto"; reset(); panel(); guide("Đã thả một đàn bọ mới với màu ngẫu nhiên. Mỗi con mang ba gen màu khác nhau."); };
    P.range("mut", () => ST.mut, (v) => (ST.mut = v), (v) => String(v), panel);
    P.range("eat", () => ST.eat, (v) => (ST.eat = v), (v) => v + " con", panel);
    $("optCross").onchange = (e) => (ST.cross = e.target.checked);
    $("optSharp").onchange = (e) => (ST.sharp = e.target.checked);
    const setAll = () => { ["mut", "eat"].forEach((id) => { $(id).value = ST[id]; $(id + "V").textContent = id === "eat" ? ST.eat + " con" : ST.mut; }); $("optCross").checked = ST.cross; $("optSharp").checked = ST.sharp; };
    const clear = () => { stopRun(); Object.assign(ST, { env: 0, mut: 12, eat: 12, cross: true, sharp: true, mode: "auto" }); $("btnBird").classList.remove("on"); rnd = P.rng(36); setAll(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "change") { ST.env = 2; reset(); silent(30); const before = camoMean(); ST.env = 1; record(); guide(`Sau 30 thế hệ trên cát vàng, đàn bọ lẫn <b>${pct(before)}</b>. Chuyển lên lá xanh: chỉ còn <b>${pct(camoMean())}</b>. Bấm <b>Tự chạy 20 thế hệ</b> để xem chúng thích nghi lại.`); }
      if (k === "nomut") { ST.env = 1; ST.mut = 0; setAll(); reset("red"); silent(30); guide(`Không có đột biến: sau 30 thế hệ, độ lẫn chỉ <b>${pct(camoMean())}</b> và không tăng nữa. Kéo <b>mức đột biến</b> lên 10 đến 20 rồi bấm Tự chạy.`); }
      if (k === "toomuch") { ST.env = 3; ST.mut = 80; setAll(); reset(); silent(30); guide(`Đột biến quá mạnh: sau 30 thế hệ, độ lẫn chỉ <b>${pct(camoMean())}</b>, đàn bọ vẫn loang lổ. Giảm <b>mức đột biến</b> về khoảng 10 rồi bấm Tự chạy.`); }
      panel(); $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); reset(); panel(); guide("Mọi sự cố đã tắt: nền vỏ cây, đột biến 12, chim ăn 12 con mỗi thế hệ."); };
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Quần thể", e: "layers", d: "Bắt đầu với <b>24 cá thể</b>. Mỗi con có ba gen màu (R, G, B). Trong AI, mỗi cá thể là một <b>lời giải thử</b>." },
    { t: "Đánh giá", e: "target", d: "Đo xem mỗi con <b>khác màu nền</b> bao nhiêu. Càng giống nền, độ lẫn càng cao. Trong AI gọi là <b>độ thích nghi</b> (điểm của lời giải)." },
    { t: "Chọn lọc", e: "eye", d: "Chim ăn những con <b>dễ thấy nhất</b> (có chút may rủi). Những con còn lại được quyền sinh sản." },
    { t: "Lai", e: "repeat", d: "Bọ con nhận <b>mỗi gen từ bố hoặc mẹ</b>. Lai giúp ghép những gen tốt của hai cá thể khác nhau." },
    { t: "Đột biến", e: "bolt", d: "Thỉnh thoảng một gen <b>lệch đi</b> một chút. Đây là nguồn duy nhất tạo ra màu <b>chưa từng có</b> trong đàn." },
    { t: "Lặp lại", e: "chart", d: "Thế hệ mới lại bị đánh giá, chọn lọc, lai, đột biến… Sau nhiều vòng, đàn bọ (hay lời giải) <b>tốt dần lên</b>. Đó là <b>thuật toán di truyền</b>." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), sx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (t, x, y, c, f, al) => { sx.fillStyle = c || "#c3c7f0"; sx.font = f || "700 12px Be Vietnam Pro, sans-serif"; sx.textAlign = al || "left"; sx.fillText(t, x, y); sx.textAlign = "left"; };
  const mini = (g, x, y, s) => beetle(sx, { g, x, y, a: 0 }, s || 0.9, 1);
  function geneBoxes(g, x, y, hl) { ["R", "G", "B"].forEach((k, i) => { sx.fillStyle = hl && hl[i] ? "#ffc34d" : ["#c8503c", "#3fae49", "#3c6ab3"][i]; D.rr(sx, x + i * 58, y, 52, 26, 6); sx.fill(); lab(`${k} ${g[i]}`, x + i * 58 + 26, y + 18, hl && hl[i] ? "#1b1f4a" : "#fff", "800 12px JetBrains Mono, monospace", "center"); }); }
  function renderSoi() {
    const s = soiStep, pop = ST.pop, E = env(); D.labBg(sx);
    const order = pop.map((b, i) => ({ b, i, c: camo(b.g) })).sort((a, b) => b.c - a.c);
    if (s === 0) { pop.forEach((b, k) => mini(b.g, 60 + (k % 6) * 104, 70 + Math.floor(k / 6) * 92)); lab("24 cá thể, mỗi con 3 gen màu", 24, 450, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); geneBoxes(pop[0].g, 360, 432); return; }
    if (s === 1 || s === 2) {
      sx.fillStyle = rgb(E); D.rr(sx, 24, 22, 28, 28, 6); sx.fill(); lab("Màu nền", 60, 42, "#fff", "700 13px Be Vietnam Pro, sans-serif");
      const K = ST.eat; order.forEach((o, k) => { const y = 66 + k * 16.5, w = o.c * 440, eaten = s === 2 && k >= N - K; sx.fillStyle = rgb(o.b.g); sx.fillRect(24, y, 26, 13); sx.fillStyle = eaten ? "#4a2033" : "#2f6f66"; sx.fillRect(60, y, w, 13); lab(pct(o.c), 66 + w, y + 11, eaten ? "#ff8f6b" : "#5ef2d6", "700 10px JetBrains Mono, monospace"); if (eaten) { sx.strokeStyle = "#ff5a3c"; sx.lineWidth = 2; sx.beginPath(); sx.moveTo(22, y + 6); sx.lineTo(560, y + 6); sx.stroke(); } });
      lab(s === 1 ? "Xếp từ khó thấy (trên) đến dễ thấy (dưới)" : `Chim ăn ${K} con dễ thấy nhất`, 340, 42, "#ffc34d", "800 13px Be Vietnam Pro, sans-serif");
      return;
    }
    const kid = (ST.lastKids && ST.lastKids.find((k) => k.par)) || null;
    if (s === 3 || s === 4) {
      if (!kid) { lab("Chạy ít nhất 1 thế hệ để xem bọ con được sinh ra.", 24, 240, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); return; }
      const A = kid.par.a, B = kid.par.b || kid.par.a, mixd = kid.par.mix;
      mini(A, 90, 100, 1.3); lab("Bố", 90, 150, "#c3c7f0", "700 12px Be Vietnam Pro, sans-serif", "center"); geneBoxes(A, 150, 88);
      mini(B, 90, 210, 1.3); lab(kid.par.b ? "Mẹ" : "Bố (không lai)", 90, 260, "#c3c7f0", "700 12px Be Vietnam Pro, sans-serif", "center"); geneBoxes(B, 150, 198);
      D.arrow(sx, { x: 250, y: 236 }, { x: 250, y: 290 }, "#8f96d4", 3);
      mini(mixd, 90, 330, 1.3); geneBoxes(mixd, 150, 318); lab("Con (sau khi lai)", 340, 336, "#c3c7f0", "700 12px Be Vietnam Pro, sans-serif");
      if (s === 4) { D.arrow(sx, { x: 250, y: 352 }, { x: 250, y: 396 }, "#ffc34d", 3); mini(kid.g, 90, 430, 1.3); geneBoxes(kid.g, 150, 418, kid.g.map((v, i) => v !== mixd[i])); lab(`Đột biến (mức ${ST.mut})`, 340, 436, "#ffc34d", "800 13px Be Vietnam Pro, sans-serif"); }
      return;
    }
    const h = ST.hist; lab("Độ lẫn trung bình qua các thế hệ", 24, 40, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif");
    sx.strokeStyle = "#2b2f6e"; sx.strokeRect(40, 60, 560, 220); sx.strokeStyle = "#a99dff"; sx.lineWidth = 3; sx.beginPath(); h.forEach((p, i) => { const x = 40 + (i / Math.max(1, h.length - 1)) * 560, y = 280 - p.c * 220; i ? sx.lineTo(x, y) : sx.moveTo(x, y); }); sx.stroke();
    sx.strokeStyle = "#3a3f86"; sx.lineWidth = 2; sx.beginPath(); sx.ellipse(320, 382, 120, 66, 0, 0, 7); sx.stroke(); lab("lặp lại", 320, 388, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif", "center"); ["Tạo quần thể", "Đánh giá", "Chọn lọc", "Lai", "Đột biến"].forEach((t, i) => { const a = -1.57 + (i / 5) * 6.28, x = 320 + Math.cos(a) * 120, y = 382 + Math.sin(a) * 66; D.pill(sx, t, x, y, i === 0 ? "#5443ff" : "#2b2f6e", 12); });
  }
  function soiLive() { $("soiLive").innerHTML = `Thế hệ <span class="hl">${ST.gen}</span> · độ lẫn <span class="hl">${pct(camoMean())}</span>`; }

  const QUIZ = [
    { q: "Vì sao sau nhiều thế hệ, đàn bọ có màu giống vỏ cây?", o: ["Bọ tự đổi màu theo ý muốn", "Con khó thấy sống sót và truyền gen cho con cháu nhiều hơn", "Chim thích ăn bọ nâu", "Do may mắn hoàn toàn"], a: 1, e: "Đó là chọn lọc tự nhiên: biến dị có lợi được giữ lại qua sinh sản." },
    { q: "Khi mức đột biến bằng 0, điều gì xảy ra với đàn bọ toàn màu đỏ trên lá xanh?", o: ["Vẫn thành màu xanh, chỉ chậm hơn", "Mắc kẹt, vì không có màu mới nào xuất hiện", "Chết hết ngay", "Đổi màu nhanh hơn"], a: 1, e: "Chọn lọc chỉ chọn trong những gì đang có; đột biến mới tạo ra biến dị mới." },
    { q: "Đột biến quá mạnh làm đàn bọ ngụy trang kém vì sao?", o: ["Con sinh ra lệch quá xa bố mẹ nên gen tốt không được giữ lại", "Chim tinh mắt hơn", "Bọ đẻ ít con hơn", "Nền đổi màu"], a: 0, e: "Cần cân bằng: đủ đột biến để khám phá, đủ ổn định để giữ cái tốt." },
    { q: "Trong thuật toán di truyền của máy tính, \"cá thể\" là gì?", o: ["Một con bọ thật", "Một lời giải thử cho bài toán", "Một máy tính", "Một người lập trình"], a: 1, e: "Ví dụ mỗi cá thể là một hình dạng ăng-ten hay một thời khóa biểu; điểm đánh giá đóng vai trò độ thích nghi." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now();
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.run) { ST.acc += dt; if (ST.acc > 0.45) { ST.acc = 0; nextGen(chooseEaten()); ST.run--; panel(); if (!ST.run) { stopRun(); guide(`Đã chạy thêm 20 thế hệ. Độ lẫn trung bình bây giờ là <b>${pct(camoMean())}</b>. Nhìn dải màu dưới biểu đồ: màu của đàn đổi dần theo nền.`); } } }
    draw(); if (soiVisible) renderSoi(); requestAnimationFrame(tick);
  }
  setInterval(() => soiVisible && soiLive(), 400);
  P.nav(); bind(); reset(); panel(); guide("Bấm <b>Em làm chim</b> rồi bắt những con bọ em nhìn thấy trước. Sau khi em bắt đủ, những con còn lại sinh con. Hoặc bấm <b>Tự chạy</b> để chim máy săn mồi.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka36 = { ST, nextGen, chooseEaten, camoMean, silent, reset };
  requestAnimationFrame(tick);
})();
