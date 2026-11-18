/* Hộp Kính AI · Dự án 2 · Máy nhìn ảnh như thế nào? (điểm ảnh, ảnh là bảng số, RGB, so khớp mẫu) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-22");
  const N = 16, RES = [2, 4, 8, 16];
  const CLS = [{ id: "tron", name: "Hình tròn" }, { id: "vuong", name: "Hình vuông" }, { id: "tamgiac", name: "Tam giác" }, { id: "cong", name: "Dấu cộng" }, { id: "x", name: "Chữ X" }];

  // ---------- vẽ hình bằng công thức (cho hình mẫu, hình vẽ giúp, bài kiểm tra) ----------
  function segD(px, py, ax, ay, bx, by) { const vx = bx - ax, vy = by - ay, t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / (vx * vx + vy * vy))); return Math.hypot(px - ax - t * vx, py - ay - t * vy); }
  const TRI = [[0, -0.85], [-0.86, 0.72], [0.86, 0.72]];
  function inkAt(id, x, y, t) {
    if (id === "tron") return Math.abs(Math.hypot(x, y) - 0.8) < t;
    if (id === "vuong") return Math.abs(Math.max(Math.abs(x), Math.abs(y)) - 0.78) < t;
    if (id === "tamgiac") return Math.min(segD(x, y, ...TRI[0], ...TRI[1]), segD(x, y, ...TRI[1], ...TRI[2]), segD(x, y, ...TRI[2], ...TRI[0])) < t;
    if (id === "cong") return (Math.abs(x) < t && Math.abs(y) < 0.86) || (Math.abs(y) < t && Math.abs(x) < 0.86);
    return (Math.abs(x - y) / 1.414 < t || Math.abs(x + y) / 1.414 < t) && Math.abs(x) < 0.82 && Math.abs(y) < 0.82;
  }
  function render(id, o) {
    o = Object.assign({ cx: 8, cy: 8, s: 6.8, rot: 0, w: 1.1, wob: 0, ph: 0 }, o);
    const g = new Float32Array(N * N), c = Math.cos(-o.rot), s = Math.sin(-o.rot), t = o.w / o.s;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      let hit = 0;
      for (let a = 0; a < 4; a++) for (let b = 0; b < 4; b++) {
        let dx = (i + (a + 0.5) / 4 - o.cx) / o.s, dy = (j + (b + 0.5) / 4 - o.cy) / o.s; const rx = dx * c - dy * s, ry = dx * s + dy * c;
        dx = rx + o.wob * Math.sin(ry * 4 + o.ph); dy = ry + o.wob * Math.cos(rx * 3 + o.ph);
        if (inkAt(id, dx, dy, t)) hit++;
      }
      g[j * N + i] = hit / 16 > 0.3 ? 1 : 0;
    }
    return g;
  }
  function randomDrawing(rnd, id) {
    const s = 3.2 + rnd() * 4, m = s + 0.6;
    return render(id, { s, cx: m + rnd() * (N - 2 * m), cy: m + rnd() * (N - 2 * m), rot: (rnd() - 0.5) * 0.5, w: 0.75 + rnd() * 0.55, wob: rnd() * 0.12, ph: rnd() * 6 });
  }
  const TEST = (() => { const r = P.rng(22), out = []; for (let k = 0; k < 40; k++) { const c = k % 5; out.push({ c, g: randomDrawing(r, CLS[c].id) }); } return out; })();

  // ---------- xử lý ảnh như máy ----------
  const ST = { grid: new Float32Array(N * N), view: "human", tool: 1, res: 3, center: true, negFix: false, neg: false, mine: [], hover: -1, t: 0, mix: { r: 120, g: 60, b: 200 }, goal: 0, drawing: false, dirty: true };
  const mean = (g) => g.reduce((a, b) => a + b, 0) / g.length;
  function see(raw, o) {
    o = o || ST; let g = Float32Array.from(raw);
    if (o.neg) g = g.map((v) => 1 - v);
    if (o.negFix && mean(g) > 0.5) g = g.map((v) => 1 - v);
    let x0 = N, y0 = N, x1 = -1, y1 = -1;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) if (g[j * N + i] > 0.25) { x0 = Math.min(x0, i); x1 = Math.max(x1, i); y0 = Math.min(y0, j); y1 = Math.max(y1, j); }
    if (x1 < 0) return null;
    const box = { x0, y0, x1, y1 };
    if (o.center) {
      const w = x1 - x0 + 1, h = y1 - y0 + 1, sc = (N - 3) / Math.max(w, h), cx = (x0 + x1 + 1) / 2, cy = (y0 + y1 + 1) / 2, out = new Float32Array(N * N);
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let s = 0; for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { const sx = Math.floor(cx + (i + (a + 0.5) / 3 - N / 2) / sc), sy = Math.floor(cy + (j + (b + 0.5) / 3 - N / 2) / sc); if (sx >= 0 && sy >= 0 && sx < N && sy < N) s += g[sy * N + sx]; } out[j * N + i] = s / 9; }
      g = out;
    }
    const R = RES[o.res], k = N / R;
    if (R < N) { const out = new Float32Array(N * N); for (let bj = 0; bj < R; bj++) for (let bi = 0; bi < R; bi++) { let s = 0; for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) s += g[(bj * k + j) * N + bi * k + i]; s /= k * k; for (let j = 0; j < k; j++) for (let i = 0; i < k; i++) out[(bj * k + j) * N + bi * k + i] = s; } g = out; }
    const bl = new Float32Array(N * N), K = [1, 2, 1];
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { let s = 0, w = 0; for (let b = -1; b <= 1; b++) for (let a = -1; a <= 1; a++) { const x = i + a, y = j + b; if (x < 0 || y < 0 || x >= N || y >= N) continue; const kk = K[a + 1] * K[b + 1]; s += g[y * N + x] * kk; w += kk; } bl[j * N + i] = s / w; }
    return { g: bl, sharp: g, box };
  }
  const cosine = (a, b) => { let s = 0, na = 0, nb = 0; for (let i = 0; i < a.length; i++) { s += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; } return na && nb ? s / Math.sqrt(na * nb) : 0; };
  const BASE = CLS.map((c, k) => ({ c: k, g: render(c.id), base: true }));
  let tplCache = null, tplKey = "";
  function templates() { const key = ST.res + "|" + ST.center + "|" + ST.mine.length; if (key !== tplKey) { tplKey = key; tplCache = BASE.concat(ST.mine).map((t) => ({ ...t, p: see(t.g, { res: ST.res, center: ST.center }) })); } return tplCache; }
  function classify(raw, o) {
    const v = see(raw, o); if (!v) return null;
    const sc = CLS.map(() => ({ s: 0, t: null }));
    templates().forEach((t) => { const s = cosine(v.g, t.p.g); if (s > sc[t.c].s) sc[t.c] = { s, t }; });
    const best = sc.reduce((bi, x, i) => (x.s > sc[bi].s ? i : bi), 0);
    return { v, sc, best };
  }
  function testAcc() { let ok = 0; TEST.forEach((x) => { const r = classify(x.g, ST); if (r && r.best === x.c) ok++; }); return ok; }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d"), GX = 24, GY = 24, CS = 32;
  const shade = (v) => { const a = Math.round(244 - v * 224); return `rgb(${a},${a + 1},${Math.min(255, a + 11)})`; };
  const shown = () => (ST.neg ? ST.grid.map((v) => 1 - v) : ST.grid);
  let cur = null, acc = 0;
  function recompute() { cur = classify(ST.grid, ST); acc = testAcc(); ST.dirty = false; renderBrain(); renderChart(); say(); }
  function drawSmall(ctx, g, x, y, size, o) {
    o = o || {}; const c = size / N;
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const v = g[j * N + i], tv = o.tpl ? o.tpl[j * N + i] : null;
      if (tv != null) { const a = v > 0.35, b = tv > 0.35; ctx.fillStyle = a && b ? "#3fe0c5" : a ? "#ff7d5f" : b ? "rgba(124,107,255,.55)" : "#1b1f4a"; }
      else ctx.fillStyle = shade(v);
      ctx.fillRect(x + i * c, y + j * c, c + 0.5, c + 0.5);
    }
    ctx.strokeStyle = "#2c3270"; ctx.lineWidth = 1; ctx.strokeRect(x, y, size, size);
  }
  const lab = (ctx, t, x, y, c, f) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
  function renderStage() {
    const ctx = sctx, g = shown(); D.labBg(ctx);
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const v = g[j * N + i], x = GX + i * CS, y = GY + j * CS;
      if (ST.view === "human") { ctx.fillStyle = shade(v); ctx.fillRect(x, y, CS, CS); ctx.strokeStyle = "rgba(120,130,200,.25)"; ctx.strokeRect(x + 0.5, y + 0.5, CS - 1, CS - 1); }
      else { const n = Math.round(255 * (1 - v)); ctx.fillStyle = v > 0.5 ? "#2b2f6e" : v > 0.2 ? "#20245a" : "#151938"; ctx.fillRect(x, y, CS, CS); ctx.strokeStyle = "#262b66"; ctx.strokeRect(x + 0.5, y + 0.5, CS - 1, CS - 1); ctx.fillStyle = v > 0.5 ? "#5ef2d6" : v > 0.2 ? "#ffc34d" : "#6c74b8"; ctx.font = "700 10px JetBrains Mono, monospace"; const tw = ctx.measureText(n).width; ctx.fillText(n, x + CS / 2 - tw / 2, y + CS / 2 + 4); }
    }
    if (ST.hover >= 0) { const i = ST.hover % N, j = (ST.hover / N) | 0; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2.5; ctx.strokeRect(GX + i * CS + 1, GY + j * CS + 1, CS - 2, CS - 2); ctx.lineWidth = 1; }
    const RX = 584; lab(ctx, "MÁY THẤY SAU KHI XỬ LÝ", RX, 80, "#8f96d4", "600 11px JetBrains Mono, monospace");
    if (cur) {
      drawSmall(ctx, cur.v.sharp, RX, 90, 176);
      if (!ST.center) { const b = cur.v.box, c = 176 / N; ctx.setLineDash([4, 3]); ctx.strokeStyle = "#ffc34d"; ctx.strokeRect(RX + b.x0 * c, 90 + b.y0 * c, (b.x1 - b.x0 + 1) * c, (b.y1 - b.y0 + 1) * c); ctx.setLineDash([]); }
      const w = cur.sc[cur.best]; lab(ctx, "SO VỚI MẪU GIỐNG NHẤT", RX, 292, "#8f96d4", "600 11px JetBrains Mono, monospace");
      drawSmall(ctx, cur.v.sharp, RX, 302, 176, { tpl: w.t.p.sharp });
      lab(ctx, `${CLS[cur.best].name} · ${Math.round(w.s * 100)}%`, RX, 502, "#ffc34d", "800 16px Be Vietnam Pro, sans-serif");
      [["#3fe0c5", "trùng"], ["#ff7d5f", "chỉ hình em"], ["rgba(124,107,255,.8)", "chỉ mẫu"]].forEach(([c, t], k) => { ctx.fillStyle = c; ctx.fillRect(RX + k * 92, 514, 10, 10); lab(ctx, t, RX + 14 + k * 92, 523, "#c3c7f0", "11px Be Vietnam Pro, sans-serif"); });
    } else { ctx.strokeStyle = "#2c3270"; ctx.setLineDash([5, 4]); ctx.strokeRect(RX, 90, 176, 176); ctx.setLineDash([]); lab(ctx, "Chưa có hình", RX + 48, 182, "#6c74b8"); }
    if (ST.view === "machine" && ST.hover >= 0) { const i = ST.hover % N, j = (ST.hover / N) | 0, n = Math.round(255 * (1 - g[ST.hover])); lab(ctx, `Hàng ${j + 1}, cột ${i + 1}: số ${n}`, RX, 550, "#ffc34d", "700 13px Be Vietnam Pro, sans-serif"); }
  }
  function say() {
    const n = ST.grid.reduce((a, v) => a + (v > 0 ? 1 : 0), 0);
    if (!cur) { $("askText").innerHTML = "Vẽ một hình lên lưới bên trái: <b>tròn, vuông, tam giác, dấu cộng</b> hoặc <b>chữ X</b>. Kéo chuột hoặc ngón tay để tô các ô."; return; }
    const s = cur.sc.map((x, i) => [i, x.s]).sort((a, b) => b[1] - a[1]);
    $("askText").innerHTML = `Máy đoán: <b>${CLS[s[0][0]].name}</b> (giống ${Math.round(s[0][1] * 100)}%). Đứng thứ hai: ${CLS[s[1][0]].name} (${Math.round(s[1][1] * 100)}%). <span class="muted small">Em đã tô ${n} ô.</span>`;
  }

  // ---------- não, biểu đồ, mẫu ----------
  function thumb(g, mine, name) { const c = document.createElement("canvas"); c.width = c.height = N; const x = c.getContext("2d"); for (let i = 0; i < N * N; i++) { x.fillStyle = shade(g[i]); x.fillRect(i % N, (i / N) | 0, 1, 1); } const f = document.createElement("figure"); if (mine) f.className = "mine"; f.appendChild(c); f.insertAdjacentHTML("beforeend", `<figcaption>${name}</figcaption>`); return f; }
  function renderTpl() { const box = $("bTpl"); box.innerHTML = ""; BASE.concat(ST.mine).forEach((t) => box.appendChild(thumb(t.g, !t.base, t.base ? CLS[t.c].name.replace("Hình ", "") : "em dạy"))); }
  function renderBrain() {
    $("bGuess").textContent = cur ? CLS[cur.best].name : "—"; $("bSim").textContent = cur ? Math.round(cur.sc[cur.best].s * 100) + "%" : "—";
    const R = RES[ST.res]; $("bPix").textContent = `${R}×${R} = ${R * R}`; $("bAcc").textContent = `${acc}/40`;
    $("bAcc").style.color = acc >= 34 ? "#5ef2d6" : acc >= 22 ? "#ffc34d" : "#ff8f6b";
    $("stageTag").textContent = ST.neg ? "CAMERA GỬI ẢNH ÂM BẢN" : `${N} × ${N} = ${N * N} ĐIỂM ẢNH`;
  }
  const TIMG = {};
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 46, B = 52, T = 16; ctx.clearRect(0, 0, W, H);
    ctx.font = "11px JetBrains Mono, monospace";
    for (let v = 0; v <= 100; v += 25) { const y = T + (1 - v / 100) * (H - T - B); ctx.strokeStyle = TH.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - 10, y); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v + "%", 6, y + 4); }
    const bw = (W - L - 10) / CLS.length;
    CLS.forEach((c, i) => {
      const x = L + i * bw, s = cur ? cur.sc[i].s : 0, h = s * (H - T - B), win = cur && cur.best === i;
      ctx.fillStyle = win ? TH.mint : TH.violet; ctx.globalAlpha = win ? 1 : 0.55; D.rr(ctx, x + bw * 0.22, H - B - h, bw * 0.56, Math.max(h, 1), 6); ctx.fill(); ctx.globalAlpha = 1;
      if (cur) { ctx.fillStyle = TH.ink; ctx.font = "700 13px JetBrains Mono, monospace"; const t = Math.round(s * 100) + "%", tw = ctx.measureText(t).width; ctx.fillText(t, x + bw / 2 - tw / 2, H - B - h - 6); }
      if (!TIMG[i]) { const t = document.createElement("canvas"); t.width = t.height = N; const tx = t.getContext("2d"); BASE[i].g.forEach((v, k) => { tx.fillStyle = v ? "#5443ff" : "rgba(0,0,0,0)"; tx.fillRect(k % N, (k / N) | 0, 1, 1); }); TIMG[i] = t; }
      ctx.imageSmoothingEnabled = false; ctx.drawImage(TIMG[i], x + bw / 2 - 52, H - B + 10, 32, 32); ctx.imageSmoothingEnabled = true;
      ctx.fillStyle = win ? TH.mint : TH.ink; ctx.font = (win ? "800 " : "600 ") + "13px Be Vietnam Pro, sans-serif"; ctx.fillText(c.name, x + bw / 2 - 14, H - B + 31);
    });
    if (!cur) { ctx.fillStyle = TH.text; ctx.font = "13px Be Vietnam Pro, sans-serif"; ctx.fillText("Vẽ một hình để xem máy so sánh với từng mẫu.", L + 20, T + 30); }
  }

  // ---------- pha màu ----------
  const GOALS = [{ n: "vàng", ok: (m) => m.r >= 200 && m.g >= 200 && m.b <= 60 }, { n: "tím hồng", ok: (m) => m.r >= 200 && m.g <= 60 && m.b >= 200 }, { n: "xanh lơ", ok: (m) => m.r <= 60 && m.g >= 200 && m.b >= 200 }, { n: "trắng", ok: (m) => m.r >= 230 && m.g >= 230 && m.b >= 230 }];
  function renderMix() {
    const cv = $("mix"), ctx = cv.getContext("2d"), m = ST.mix; ctx.fillStyle = "#121633"; ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#0b0e26"; D.rr(ctx, 8, 8, 96, 134, 10); ctx.fill();
    [["r", "255,70,70"], ["g", "60,230,110"], ["b", "80,120,255"]].forEach(([k, rgb], i) => { const a = m[k] / 255; ctx.fillStyle = `rgba(${rgb},${0.08 + a * 0.92})`; D.rr(ctx, 16 + i * 29, 16, 22, 100, 6); ctx.fill(); ctx.fillStyle = "#c3c7f0"; ctx.font = "700 10px JetBrains Mono, monospace"; ctx.fillText(String(m[k]), 16 + i * 29 + (m[k] > 99 ? 0 : m[k] > 9 ? 3 : 7), 132); });
    ctx.fillStyle = `rgb(${m.r},${m.g},${m.b})`; D.rr(ctx, 116, 8, 96, 134, 10); ctx.fill(); ctx.strokeStyle = "#2c3270"; ctx.stroke();
    const g = GOALS[ST.goal];
    if (g && g.ok(m)) { if (ST.goal === 0) prog.done("color"); ST.goal++; }
    const nx = GOALS[ST.goal];
    $("mixGoal").innerHTML = nx ? `${ST.goal ? `<b style="color:var(--mint)">Đúng rồi!</b> ` : ""}Thử thách ${ST.goal + 1}/4: hãy pha ra màu <b>${nx.n}</b>. Mắt em thấy một màu, máy chỉ lưu <b>ba số</b>: (${m.r}, ${m.g}, ${m.b}).` : `<b style="color:var(--mint)">Em đã pha đủ 4 màu!</b> Màn hình chỉ có ba loại đèn đỏ, xanh lá, xanh dương. Mọi màu em thấy là do ba đèn sáng mạnh yếu khác nhau: (${m.r}, ${m.g}, ${m.b}).`;
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh là lưới ô", e: "image", d: "Máy chia bức ảnh thành <b>lưới ô vuông nhỏ</b> gọi là điểm ảnh. Bức vẽ của em có 16 × 16 = <b>256</b> điểm ảnh. Ảnh chụp bằng điện thoại có hàng triệu điểm ảnh." },
    { t: "Mỗi ô là một số", e: "cpu", d: "Mỗi điểm ảnh được lưu bằng một <b>số độ sáng</b>: 0 là đen, 255 là trắng, ở giữa là xám. Máy đọc lần lượt từng hàng, từ trái sang phải. Với máy, bức vẽ chỉ là <b>bảng 256 con số</b>." },
    { t: "Ảnh màu: 3 số", e: "sun", d: "Ảnh màu thì mỗi điểm ảnh cần <b>ba số</b>: độ sáng của đèn <b>đỏ (R)</b>, <b>xanh lá (G)</b>, <b>xanh dương (B)</b>. Hình bên dùng đúng màu em đang pha ở phần Chơi." },
    { t: "Căn giữa, làm gọn", e: "crosshair", d: "Trước khi so, máy <b>cắt sát</b> phần có nét vẽ, <b>phóng to</b> ra giữa và làm mềm nét một chút. Nhờ vậy hình to hay nhỏ, lệch trái hay lệch phải đều được so công bằng." },
    { t: "So với mẫu", e: "layers", d: "Máy đặt bảng số của em chồng lên bảng số của từng <b>hình mẫu</b>. Ô <b style=\"color:var(--mint)\">xanh</b> là chỗ cả hai cùng có nét. Càng nhiều ô trùng thì <b>độ giống</b> càng cao." },
    { t: "Chọn mẫu giống nhất", e: "target", d: "Máy chọn mẫu có độ giống <b>cao nhất</b> làm câu trả lời. Máy không \"hiểu\" hình tròn là gì: nó chỉ so số. Vì vậy dạy máy <b>nhiều mẫu</b> khác nhau sẽ giúp máy đoán tốt hơn." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const demoGrid = () => (cur ? shown() : BASE[0].g);
  function renderSoi() {
    const ctx = octx, s = soiStep, g = demoGrid(); D.labBg(ctx);
    if (s === 0) {
      const z = (Math.sin(ST.t * 0.8) + 1) / 2;
      lab(ctx, "Em thấy", 40, 40); lab(ctx, "Phóng to: thấy từng ô", 340, 40, "#ffc34d");
      const off = document.createElement("canvas"); off.width = off.height = N; const ox = off.getContext("2d"); g.forEach((v, k) => { ox.fillStyle = shade(v); ox.fillRect(k % N, (k / N) | 0, 1, 1); });
      ctx.imageSmoothingEnabled = true; ctx.drawImage(off, 40, 60, 260, 260); ctx.imageSmoothingEnabled = false;
      const bx = cur ? cur.v.box : { x0: 4, x1: 11, y0: 4, y1: 11 }, zs = 4 + Math.round(z * 4), sx = Math.max(0, Math.min(N - zs, Math.round((bx.x0 + bx.x1 + 1) / 2 - zs / 2))), sy = Math.max(0, Math.min(N - zs, Math.round((bx.y0 + bx.y1 + 1) / 2 - zs / 2))); ctx.drawImage(off, sx, sy, zs, zs, 340, 60, 260, 260); ctx.imageSmoothingEnabled = true;
      ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.strokeRect(40 + sx * 260 / N, 60 + sy * 260 / N, zs * 260 / N, zs * 260 / N); ctx.strokeRect(340, 60, 260, 260);
      const c = 260 / zs; ctx.strokeStyle = "rgba(255,195,77,.5)"; ctx.lineWidth = 1; for (let k = 1; k < zs; k++) { ctx.beginPath(); ctx.moveTo(340 + k * c, 60); ctx.lineTo(340 + k * c, 320); ctx.moveTo(340, 60 + k * c); ctx.lineTo(600, 60 + k * c); ctx.stroke(); }
      lab(ctx, `16 × 16 = 256 điểm ảnh`, 40, 360, "#5ef2d6", "800 18px Be Vietnam Pro, sans-serif"); lab(ctx, "Mỗi ô vuông chỉ có một màu duy nhất.", 40, 392); return;
    }
    if (s === 1) {
      const c = 26, x0 = 20, y0 = 34, row = Math.floor(ST.t * 2) % N;
      for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) { const v = g[j * N + i], n = Math.round(255 * (1 - v)); ctx.fillStyle = j === row ? "rgba(255,195,77,.18)" : "#151938"; ctx.fillRect(x0 + i * c, y0 + j * c, c - 1, c - 1); ctx.fillStyle = v > 0.5 ? "#5ef2d6" : "#59609e"; ctx.font = "700 8.5px JetBrains Mono, monospace"; const tw = ctx.measureText(n).width; ctx.fillText(n, x0 + i * c + c / 2 - tw / 2, y0 + j * c + c / 2 + 3); }
      lab(ctx, `Máy đọc hàng ${row + 1}:`, 452, 60, "#ffc34d"); const nums = Array.from({ length: N }, (_, i) => Math.round(255 * (1 - g[row * N + i])));
      nums.forEach((n, i) => lab(ctx, String(n), 452 + (i % 4) * 44, 90 + Math.floor(i / 4) * 24, n < 128 ? "#5ef2d6" : "#8f96d4", "700 13px JetBrains Mono, monospace"));
      lab(ctx, "0 = đen", 452, 220, "#5ef2d6"); lab(ctx, "255 = trắng", 452, 242); return;
    }
    if (s === 2) {
      const m = ST.mix; lab(ctx, "Một điểm ảnh màu phóng to", 30, 40);
      [["Đỏ R", m.r, "255,70,70"], ["Xanh lá G", m.g, "60,230,110"], ["Xanh dương B", m.b, "80,120,255"]].forEach(([n, v, rgb], i) => { ctx.fillStyle = `rgba(${rgb},${0.08 + (v / 255) * 0.92})`; D.rr(ctx, 40 + i * 70, 60, 56, 220, 10); ctx.fill(); lab(ctx, String(v), 50 + i * 70, 306, "#fff", "800 16px JetBrains Mono, monospace"); lab(ctx, n, 40 + i * 70, 330, "#c3c7f0", "600 11px Be Vietnam Pro, sans-serif"); });
      ctx.font = "800 30px Be Vietnam Pro, sans-serif"; ctx.fillStyle = "#c3c7f0"; ctx.fillText("=", 270, 180);
      ctx.fillStyle = `rgb(${m.r},${m.g},${m.b})`; D.rr(ctx, 320, 60, 220, 220, 16); ctx.fill();
      [["(255, 255, 0)", "255,255,0", "vàng"], ["(255, 0, 255)", "255,0,255", "tím hồng"], ["(255, 255, 255)", "255,255,255", "trắng"], ["(0, 0, 0)", "0,0,0", "đen"]].forEach(([t, rgb, n], i) => { const x = 30 + i * 150; ctx.fillStyle = `rgb(${rgb})`; D.rr(ctx, x, 380, 28, 28, 6); ctx.fill(); ctx.strokeStyle = "#2c3270"; ctx.stroke(); lab(ctx, t, x + 34, 392, "#fff", "700 11px JetBrains Mono, monospace"); lab(ctx, n, x + 34, 408, "#8f96d4", "11px Be Vietnam Pro, sans-serif"); });
      return;
    }
    const r = cur || classify(BASE[0].g, ST);
    if (s === 3) {
      lab(ctx, "Ảnh gốc", 30, 40); lab(ctx, ST.center ? "Sau khi cắt sát và phóng to" : "Bước căn giữa đang TẮT", 360, 40, ST.center ? "#5ef2d6" : "#ff8f6b");
      drawSmall(ctx, g, 30, 60, 260); const b = r.v.box, c = 260 / N; ctx.setLineDash([6, 4]); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.strokeRect(30 + b.x0 * c, 60 + b.y0 * c, (b.x1 - b.x0 + 1) * c, (b.y1 - b.y0 + 1) * c); ctx.setLineDash([]);
      D.arrow(ctx, { x: 300, y: 190 }, { x: 350, y: 190 }, "#7c6bff", 3); drawSmall(ctx, r.v.sharp, 360, 60, 260);
      lab(ctx, "Khung vàng: phần có nét vẽ. Máy phóng phần này cho vừa khung.", 30, 370); return;
    }
    if (s === 4) {
      CLS.forEach((c, i) => { const t = r.sc[i].t, x = 20 + i * 122; drawSmall(ctx, r.v.sharp, x, 90, 110, { tpl: t.p.sharp }); lab(ctx, c.name, x, 76); const sv = r.sc[i].s; lab(ctx, Math.round(sv * 100) + "%", x + 30, 232, i === r.best ? "#5ef2d6" : "#fff", "800 20px JetBrains Mono, monospace"); });
      [["#3fe0c5", "cả hai cùng có nét"], ["#ff7d5f", "chỉ hình em có"], ["rgba(124,107,255,.8)", "chỉ mẫu có"]].forEach(([c, t], k) => { ctx.fillStyle = c; ctx.fillRect(30 + k * 200, 290, 14, 14); lab(ctx, t, 50 + k * 200, 302); });
      lab(ctx, "Độ giống được tính từ các ô trùng nhau trên tổng số ô có nét.", 30, 350, "#ffc34d"); return;
    }
    const s2 = r.sc.map((x, i) => [i, x.s]).sort((a, b) => b[1] - a[1]); lab(ctx, "Xếp hạng độ giống", 30, 40);
    s2.forEach(([i, v], k) => { const y = 70 + k * 64; lab(ctx, CLS[i].name, 30, y + 26, k ? "#c3c7f0" : "#5ef2d6", "700 14px Be Vietnam Pro, sans-serif"); ctx.fillStyle = "#232866"; ctx.fillRect(150, y + 8, 420, 28); ctx.fillStyle = k ? "#7c6bff" : "#3fe0c5"; ctx.fillRect(150, y + 8, v * 420, 28); lab(ctx, Math.round(v * 100) + "%", 160 + v * 420 > 560 ? 520 : 156 + v * 420, y + 28, "#fff", "800 13px JetBrains Mono, monospace"); });
    lab(ctx, `Máy trả lời: ${CLS[r.best].name}`, 30, 420, "#ffc34d", "800 18px Be Vietnam Pro, sans-serif");
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), g = demoGrid(), r = cur || classify(BASE[0].g, ST);
    if (s === 0) el.innerHTML = `Bức vẽ có <span class="hl">${g.filter((v) => v > 0.5).length}</span> ô tô đậm trên <span class="w">256</span> ô`;
    else if (s === 1) el.innerHTML = `Một bức 16 × 16 cần <span class="hl">256</span> con số`;
    else if (s === 2) el.innerHTML = `Màu đang pha: <span class="hl">(${ST.mix.r}, ${ST.mix.g}, ${ST.mix.b})</span>`;
    else if (s === 3) el.innerHTML = ST.center ? `Căn giữa: <span class="hl">BẬT</span>` : `Căn giữa: <span class="w">TẮT</span>`;
    else el.innerHTML = `Máy chọn <span class="hl">${CLS[r.best].name}</span> · giống <span class="w">${Math.round(r.sc[r.best].s * 100)}%</span>`;
  }

  // ---------- điều khiển ----------
  const guide = (h) => ($("guideText").innerHTML = h);
  function cellAt(e) { const r = stage.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * stage.width, y = ((e.clientY - r.top) / r.height) * stage.height, i = Math.floor((x - GX) / CS), j = Math.floor((y - GY) / CS); return i >= 0 && j >= 0 && i < N && j < N ? j * N + i : -1; }
  function paint(e) { const k = cellAt(e); ST.hover = k; if (!ST.drawing || k < 0) return; if (ST.grid[k] !== ST.tool) { ST.grid[k] = ST.tool; ST.dirty = true; } }
  function setView(v) { ST.view = v; $("viewBtns").querySelectorAll("button").forEach((b) => b.classList.toggle("ghost", b.dataset.v !== v)); if (v === "machine") { prog.done("numbers"); guide("Đây là thứ máy thật sự \"nhìn\" thấy: <b>256 con số</b>. Số 0 là ô đen, 255 là ô trắng. Di chuột lên một ô để đọc số của ô đó."); } else guide("Mắt người thấy <b>hình</b>. Bấm <b>Mắt máy</b> để thấy cùng bức vẽ đó dưới dạng <b>bảng số</b>."); }
  function setGrid(g) { ST.grid = Float32Array.from(g); ST.dirty = true; }
  function bind() {
    stage.addEventListener("pointerdown", (e) => { ST.drawing = true; stage.setPointerCapture(e.pointerId); paint(e); });
    stage.addEventListener("pointermove", paint);
    const up = () => { if (!ST.drawing) return; ST.drawing = false; if (ST.dirty) recompute(); if (cur && ST.grid.filter((v) => v > 0).length >= 8) prog.done("draw"); };
    stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up); stage.addEventListener("pointerleave", () => { ST.hover = -1; });
    $("viewBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => setView(b.dataset.v)));
    $("toolBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.tool = +b.dataset.t; $("toolBtns").querySelectorAll("button").forEach((x) => x.classList.toggle("ghost", x !== b)); }));
    $("btnClear").onclick = () => { setGrid(new Float32Array(N * N)); recompute(); };
    $("btnHelp").onclick = () => { const c = Math.floor(Math.random() * 5); setGrid(randomDrawing(Math.random, CLS[c].id)); recompute(); guide(`Máy vẽ giúp một <b>${CLS[c].name.toLowerCase()}</b> hơi lệch, nét hơi run như người vẽ tay. Máy có đoán đúng không?`); };
    $("teachSel").innerHTML = CLS.map((c, i) => `<option value="${i}">${c.name}</option>`).join("");
    $("btnTeach").onclick = () => { if (!cur) { guide("Em hãy vẽ một hình trước, rồi mới dạy máy được."); return; } const c = +$("teachSel").value; ST.mine.push({ c, g: Float32Array.from(ST.grid) }); prog.done("teach"); renderTpl(); recompute(); guide(`Máy có thêm một mẫu <b>${CLS[c].name.toLowerCase()}</b> do em vẽ. Bây giờ máy có <b>${BASE.length + ST.mine.length}</b> mẫu. Xem số hình đoán đúng trong 40 hình vẽ tay có thay đổi không?`); };
    $("btnResetTpl").onclick = () => { ST.mine = []; renderTpl(); recompute(); };
    const fmtR = (v) => `${RES[v]} × ${RES[v]}`;
    const setRes = P.range("res", () => ST.res, (v) => (ST.res = v), fmtR, recompute);
    $("optCenter").onchange = (e) => { ST.center = e.target.checked; recompute(); };
    $("optNeg").onchange = (e) => { ST.negFix = e.target.checked; recompute(); };
    ["r", "g", "b"].forEach((k) => P.range(k, () => ST.mix[k], (v) => (ST.mix[k] = v), (v) => v, renderMix));
    const scene = (o) => { ST.res = o.res == null ? 3 : o.res; setRes(); ST.center = o.center !== false; $("optCenter").checked = ST.center; ST.negFix = !!o.negFix; $("optNeg").checked = ST.negFix; ST.neg = !!o.neg; if (o.grid) setGrid(o.grid); recompute(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on"); prog.done("broke"); setView("human");
      if (k === "lowres") { scene({ res: 1, grid: TEST[7].g }); guide(`Ảnh chỉ còn <b>4 × 4 = 16 ô</b>. Em vẫn đoán được đây từng là tam giác, nhưng máy thì đoán <b>${CLS[cur.best].name.toLowerCase()}</b>. Kéo thanh <b>Độ phân giải</b> lên xem sao.`); }
      if (k === "neg") { scene({ neg: true, grid: render("cong", { s: 6, w: 1.1 }) }); guide(`Camera gửi ảnh <b>âm bản</b>: nền đen, nét trắng. Mắt em vẫn thấy dấu cộng, máy lại đoán <b>${CLS[cur.best].name.toLowerCase()}</b>, và chỉ đúng <b>${acc}/40</b> hình. Bật <b>Tự nhận ra ảnh âm bản</b>.`); }
      if (k === "corner") { scene({ center: false, grid: render("tron", { s: 3.2, cx: 4, cy: 4, w: 0.75 }) }); guide(`Hình tròn nhỏ ở góc, bước căn giữa bị tắt. Máy đoán <b>${CLS[cur.best].name.toLowerCase()}</b>. Bật <b>Căn giữa trước khi so</b>.`); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); scene({ grid: render("tron", { s: 6, w: 1 }) }); guide("Mọi sự cố đã tắt, máy nhìn lại bình thường. Vẽ thử một hình mới nhé!"); };
  }

  const QUIZ = [
    { q: "Một bức ảnh đen trắng có 16 × 16 điểm ảnh. Máy cần lưu bao nhiêu con số độ sáng?", o: ["16", "32", "256", "1"], a: 2, e: "Mỗi điểm ảnh cần một số, 16 × 16 = 256 điểm ảnh nên cần 256 số." },
    { q: "Một điểm ảnh có R = 255, G = 255, B = 0. Điểm ảnh đó màu gì?", o: ["Đen", "Vàng", "Xanh dương", "Trắng"], a: 1, e: "Đèn đỏ và đèn xanh lá sáng hết cỡ, đèn xanh dương tắt: ta thấy màu vàng." },
    { q: "Vì sao máy đoán sai khi ảnh bị âm bản, dù mắt em vẫn thấy rõ hình?", o: ["Vì máy bị hỏng", "Vì mọi con số trong bảng đều thay đổi, mà máy chỉ so số chứ không thấy hình", "Vì ảnh âm bản nhỏ hơn", "Vì máy không thích màu đen"], a: 1, e: "Đảo màu biến 0 thành 255 và ngược lại. Bảng số khác hẳn bảng số của các mẫu nên máy chọn sai." },
    { q: "Muốn máy nhận ra nhiều kiểu viết chữ X khác nhau, cách nào tốt nhất?", o: ["Giảm độ phân giải xuống 4 × 4", "Dạy máy thêm nhiều mẫu chữ X do nhiều người viết", "Tắt bước căn giữa", "Chỉ dùng một mẫu chữ X thật đẹp"], a: 1, e: "Máy so với các mẫu đã có. Càng nhiều mẫu đa dạng, máy càng dễ tìm thấy một mẫu giống với cách em viết." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now(), slow = 0;
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; if (ST.drawing && ST.dirty && now - slow > 120) { slow = now; recompute(); } renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); renderTpl(); renderMix(); setView("human"); guide("Hãy vẽ một hình tròn, hình vuông, tam giác, dấu cộng hoặc chữ X. Rồi bấm <b>Mắt máy</b> để xem máy thực sự \"nhìn\" thấy gì!"); recompute();
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka22 = { ST, classify, testAcc, render, see, CLS, TEST, recompute, get cur() { return cur; } };
  requestAnimationFrame(tick);
})();
