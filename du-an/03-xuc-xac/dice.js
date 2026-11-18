/* Hộp Kính AI · Dự án 3 · Thám tử tìm xúc xắc gian lận (tần số, xác suất thực nghiệm, phát hiện bất thường) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-23");
  const NAMES = ["A", "B", "C"], COL = ["#7c6bff", "#3fe0c5", "#ffbf2e"], WIN = 120, MAXN = 5000;
  const PIPS = { 1: [[0, 0]], 2: [[-1, -1], [1, 1]], 3: [[-1, -1], [0, 0], [1, 1]], 4: [[-1, -1], [1, -1], [-1, 1], [1, 1]], 5: [[-1, -1], [1, -1], [0, 0], [-1, 1], [1, 1]], 6: [[-1, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [1, 1]] };

  const ST = { dice: [0, 1, 2].map(() => ({ t: [], r: [], s: [] })), loaded: 0, p: 0.4, misread: false, minN: 30, thr: 15, win: false, anim: 0, face: [1, 1, 1], pred: { ok: 0, n: 0 }, guess: null, t: 0, brk: null };
  function newSet(loaded) {
    ST.dice = [0, 1, 2].map(() => ({ t: [], r: [], s: [] })); ST.loaded = loaded == null ? Math.floor(Math.random() * 3) : loaded;
    ST.pred = { ok: 0, n: 0 }; ST.guess = null; ST.misread = false; ST.face = [1, 1, 1];
    document.querySelectorAll("#guessRow [data-g]").forEach((b) => { b.classList.add("ghost"); b.classList.remove("accent"); });
  }
  const rnd = Math.random;
  function sample(d) { if (d === ST.loaded && ST.p > 0.175) return rnd() < ST.p ? 6 : 1 + Math.floor(rnd() * 5); return 1 + Math.floor(rnd() * 6); }
  const record = (d, f) => (ST.misread && d === 1 && f === 1 ? 6 : f);
  function counts(arr) { const c = [0, 0, 0, 0, 0, 0]; arr.forEach((f) => c[f - 1]++); return c; }
  const view = (d) => (ST.win ? ST.dice[d].r.slice(-WIN) : ST.dice[d].r);
  function dev(arr) { const n = arr.length; if (!n) return 0; const E = n / 6; return counts(arr).reduce((s, o) => s + ((o - E) * (o - E)) / E, 0); }
  function predictFace(d) { const c = counts(ST.dice[d].r), m = Math.max(...c); const best = c.map((v, i) => (v === m ? i + 1 : 0)).filter(Boolean); return best[Math.floor(rnd() * best.length)]; }
  function rollOnce() {
    for (let d = 0; d < 3; d++) {
      const D_ = ST.dice[d]; if (D_.t.length >= MAXN) return false;
      const pf = predictFace(d), f = sample(d); ST.pred.n++; if (pf === f) ST.pred.ok++;
      D_.t.push(f); D_.r.push(record(d, f)); const k = D_.r.length; D_.s.push(counts(D_.r.slice(-1))[5] + (k > 1 ? D_.s[k - 2] * (k - 1) : 0)); D_.s[k - 1] /= k; ST.face[d] = f;
    }
    return true;
  }
  function roll(n) { let ok = true; for (let i = 0; i < n && ok; i++) ok = rollOnce(); ST.anim = n === 1 ? 0.55 : 0.3; update(); if (!ok) guide("Mỗi viên đã tung tới 5000 lần. Bấm <b>Bộ xúc xắc mới</b> để chơi lại."); }
  function verdict() {
    const n = Math.min(...[0, 1, 2].map((d) => view(d).length)), dv = [0, 1, 2].map((d) => dev(view(d)));
    if (n < Math.max(1, ST.minN)) return { st: "wait", n, dv };
    const b = dv.indexOf(Math.max(...dv)); return dv[b] > ST.thr ? { st: "accuse", d: b, n, dv } : { st: "none", n, dv };
  }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  function die(ctx, cx, cy, s, f, col, ang) {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(ang || 0); ctx.fillStyle = "#f6f5ff"; ctx.shadowColor = col; ctx.shadowBlur = 18; D.rr(ctx, -s / 2, -s / 2, s, s, s * 0.17); ctx.fill(); ctx.shadowBlur = 0; ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = f === 6 ? "#e2433b" : "#1b1f4a"; PIPS[f].forEach(([x, y]) => { ctx.beginPath(); ctx.arc(x * s * 0.27, y * s * 0.27, s * 0.085, 0, 7); ctx.fill(); }); ctx.restore();
  }
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  function bars(ctx, x, y, w, h, arr, col, o) {
    o = o || {}; const c = counts(arr), n = arr.length, E = n / 6, mx = Math.max(E * 1.8, ...c, 1), bw = w / 6;
    for (let i = 0; i < 6; i++) { const bh = (c[i] / mx) * h, bx = x + i * bw + 5; ctx.fillStyle = col; ctx.globalAlpha = i === 5 ? 1 : 0.7; D.rr(ctx, bx, y + h - bh, bw - 10, Math.max(bh, 1), 4); ctx.fill(); ctx.globalAlpha = 1; if (n) lab(ctx, String(c[i]), bx + (bw - 10) / 2, y + h - bh - 5, "#fff", "700 11px JetBrains Mono, monospace", "center"); lab(ctx, String(i + 1), bx + (bw - 10) / 2, y + h + 15, i === 5 ? "#ff8f6b" : "#8f96d4", "700 12px JetBrains Mono, monospace", "center"); }
    if (n) { const ey = y + h - (E / mx) * h; ctx.setLineDash([5, 4]); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(x, ey); ctx.lineTo(x + w, ey); ctx.stroke(); ctx.setLineDash([]); if (o.label) lab(ctx, "mong đợi", x + w - 2, ey - 4, "#ffc34d", "600 10px Be Vietnam Pro, sans-serif", "right"); }
  }
  let V = verdict();
  function renderStage() {
    const ctx = sctx, W = stage.width; D.labBg(ctx); const cw = W / 3;
    for (let d = 0; d < 3; d++) {
      const x = d * cw, cx = x + cw / 2, D_ = ST.dice[d], n = D_.r.length, spin = ST.anim > 0, acc = V.st === "accuse" && V.d === d, reveal = ST.guess != null && ST.loaded === d;
      if (acc) { ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 3; D.rr(ctx, x + 10, 12, cw - 20, 416, 16); ctx.stroke(); D.pill(ctx, "BỊ NGHI", cx, 26, "#e2433b", 11); }
      die(ctx, cx, 100, 96, spin ? 1 + Math.floor(rnd() * 6) : ST.face[d], COL[d], spin ? Math.sin(ST.t * 40 + d) * 0.35 : 0);
      lab(ctx, "Xúc xắc " + NAMES[d], cx, 172, COL[d], "800 15px Be Vietnam Pro, sans-serif", "center");
      if (reveal) D.pill(ctx, "VIÊN GIAN LẬN", cx, 196, "#c77700", 10);
      const v = view(d), k6 = counts(v)[5]; lab(ctx, `${n} lần · mặt 6: ${v.length ? Math.round((k6 / v.length) * 100) : 0}%`, cx, reveal ? 220 : 196, "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif", "center");
      bars(ctx, x + 22, 236, cw - 44, 150, v, COL[d]);
      if (ST.win && n > WIN) lab(ctx, `chỉ xét ${WIN} lần gần nhất`, cx, 424, "#ffc34d", "600 11px Be Vietnam Pro, sans-serif", "center");
    }
    ctx.strokeStyle = "rgba(255,255,255,.08)"; for (let d = 1; d < 3; d++) { ctx.beginPath(); ctx.moveTo(d * cw, 30); ctx.lineTo(d * cw, 410); ctx.stroke(); }
  }
  const guide = (h) => ($("guideText").innerHTML = h);
  function update() {
    V = verdict(); const n = Math.min(...ST.dice.map((x) => x.r.length));
    if (n >= 100) prog.done("roll");
    if (V.st === "accuse" && V.d === ST.loaded && !ST.brk && n >= 30) prog.done("detect");
    $("bN").textContent = n; $("bVerdict").textContent = V.st === "wait" ? "Chưa đủ dữ liệu" : V.st === "none" ? "Chưa thấy viên nào" : "Nghi xúc xắc " + NAMES[V.d];
    $("bVerdict").style.color = V.st === "accuse" ? "#ff8f6b" : "#c3c7f0";
    const mx = Math.max(ST.thr * 2, ...V.dv);
    $("bDev").innerHTML = V.dv.map((v, d) => `<div class="r"><span style="color:${COL[d]}">Viên ${NAMES[d]}</span><div class="bar"><i style="width:${Math.min(100, (v / mx) * 100)}%;background:${v > ST.thr ? "#ff7d5f" : COL[d]}"></i></div><span>${v.toFixed(1)}</span></div>`).join("") + `<div class="small" style="color:#8f96d4">Ngưỡng nghi ngờ: lớn hơn <b style="color:#ffc34d">${ST.thr}</b></div>`;
    $("bPred").textContent = ST.pred.n ? Math.round((ST.pred.ok / ST.pred.n) * 100) + "%" : "—";
    const v6 = [0, 1, 2].map((d) => { const v = view(d); return v.length ? Math.round((counts(v)[5] / v.length) * 100) : 0; });
    $("askText").innerHTML = !n ? "Ba viên xúc xắc trông giống hệt nhau. Bấm <b>Tung</b> để bắt đầu thu thập dữ liệu." : `Tỉ lệ ra mặt 6: <b style="color:${COL[0]}">A ${v6[0]}%</b> · <b style="color:${COL[1]}">B ${v6[1]}%</b> · <b style="color:${COL[2]}">C ${v6[2]}%</b>. Xúc xắc công bằng: khoảng <b>17%</b>.`;
    $("stageTag").textContent = ST.misread ? "DỮ LIỆU VIÊN B BỊ GHI NHẦM" : `${n} LẦN TUNG MỖI VIÊN`;
    renderChart();
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 50, R = 16, T = 14, B = 34; ctx.clearRect(0, 0, W, H);
    const N = Math.max(50, ...ST.dice.map((x) => x.s.length)), X = (i) => L + (i / N) * (W - L - R), Y = (v) => T + (1 - v / 0.6) * (H - T - B);
    ctx.font = "11px JetBrains Mono, monospace";
    [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6].forEach((v) => { ctx.strokeStyle = TH.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(v * 100) + "%", 8, Y(v) + 4); });
    if (ST.win && N > WIN) { ctx.fillStyle = TH.amber; ctx.globalAlpha = TH.dark ? 0.12 : 0.1; ctx.fillRect(X(N - WIN), T, X(N) - X(N - WIN), H - T - B); ctx.globalAlpha = 1; }
    ctx.setLineDash([6, 5]); ctx.strokeStyle = TH.coral; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, Y(1 / 6)); ctx.lineTo(W - R, Y(1 / 6)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.coral; ctx.fillText("xúc xắc công bằng: 1/6 ≈ 17%", W - R - 220, Y(1 / 6) - 6);
    ST.dice.forEach((dd, d) => { const s = dd.s; if (!s.length) return; const step = Math.max(1, Math.floor(s.length / 500)); ctx.strokeStyle = COL[d]; ctx.lineWidth = 2.4; ctx.beginPath(); for (let i = 0; i < s.length; i += step) { const x = X(i + 1), y = Y(Math.min(0.6, s[i])); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.lineTo(X(s.length), Y(Math.min(0.6, s[s.length - 1]))); ctx.stroke(); ctx.fillStyle = COL[d]; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(NAMES[d], Math.min(W - R - 12, X(s.length) + 4), Y(Math.min(0.6, s[s.length - 1])) + 4); });
    ctx.fillStyle = TH.text; ctx.font = "11px JetBrains Mono, monospace"; ctx.fillText("0", L, H - 12); ctx.fillText(`${N} lần tung`, W - R - 90, H - 12);
    if (!ST.dice[0].s.length) { ctx.fillStyle = TH.text; ctx.font = "13px Be Vietnam Pro, sans-serif"; ctx.fillText("Tung xúc xắc để vẽ đường. Tung càng nhiều, đường càng bớt lắc lư.", L + 20, T + 30); }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Tung và ghi lại", e: "book", d: "Mỗi lần tung là một <b>dữ liệu</b>. Thám tử ghi lại tất cả kết quả của từng viên, không bỏ sót lần nào. Dữ liệu càng nhiều, kết luận càng đáng tin." },
    { t: "Đếm tần số", e: "layers", d: "Thám tử đếm mỗi mặt xuất hiện bao nhiêu lần: đó là <b>tần số</b>. Bảng đếm biến một dãy số dài thành 6 con số dễ so sánh." },
    { t: "Chia để có tỉ lệ", e: "cpu", d: "<b>Xác suất thực nghiệm</b> của mặt 6 = số lần ra mặt 6 chia cho tổng số lần tung. Chia như vậy thì so sánh được các viên dù số lần tung khác nhau." },
    { t: "So với điều mong đợi", e: "scan", d: "Xúc xắc công bằng: mỗi mặt ra khoảng <b>1/6</b> số lần (đường vàng). Thám tử cộng dồn các khoảng chênh lệch thành một con số gọi là <b>độ lệch</b>." },
    { t: "Nhiều lần thì chắc hơn", e: "chart", d: "Tung ít lần thì tỉ lệ <b>lắc lư</b> rất mạnh, kể cả với viên công bằng. Tung nhiều lần, tỉ lệ <b>ổn định</b> dần quanh giá trị thật. Vì vậy thám tử chờ đủ dữ liệu mới kết luận." },
    { t: "Kết luận, đoán trước", e: "target", d: "Viên có độ lệch <b>lớn nhất</b> và <b>vượt ngưỡng</b> bị nghi gian lận. Thám tử còn đoán trước mặt sắp ra bằng mặt xuất hiện nhiều nhất: với viên gian lận, máy đoán trúng nhiều hơn đoán bừa." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const DEMO = (() => { const r = P.rng(23), out = [[], [], []]; for (let i = 0; i < 90; i++) for (let d = 0; d < 3; d++) out[d].push(d === 2 ? (r() < 0.4 ? 6 : 1 + Math.floor(r() * 5)) : 1 + Math.floor(r() * 6)); return out; })();
  const data = () => (Math.min(...ST.dice.map((x) => x.r.length)) >= 12 ? [0, 1, 2].map((d) => ST.dice[d].r) : DEMO);
  const FUN = (() => { const r = P.rng(7), a = [], b = []; let ka = 0, kb = 0; for (let i = 1; i <= 600; i++) { if (r() < 1 / 6) ka++; if (r() < 0.4) kb++; a.push(ka / i); b.push(kb / i); } return [a, b]; })();
  function renderSoi() {
    const ctx = octx, s = soiStep, dt = data(); D.labBg(ctx); const demo = dt === DEMO;
    if (demo && s < 4) lab(ctx, "Số liệu mẫu (em hãy tung ít nhất 12 lần để dùng số liệu của em)", 20, 466, "#8f96d4", "11px Be Vietnam Pro, sans-serif");
    if (s === 0) {
      const k = Math.floor(ST.t * 3) % 24;
      dt.forEach((arr, d) => { lab(ctx, "Xúc xắc " + NAMES[d], 30, 50 + d * 140, COL[d], "800 14px Be Vietnam Pro, sans-serif"); arr.slice(-24).forEach((f, i) => { const x = 30 + (i % 12) * 48, y = 64 + d * 140 + Math.floor(i / 12) * 48; ctx.globalAlpha = i <= k ? 1 : 0.15; die(ctx, x + 18, y + 18, 34, f, COL[d]); ctx.globalAlpha = 1; }); });
      return;
    }
    if (s === 1) {
      lab(ctx, "Mặt", 30, 50, "#8f96d4"); NAMES.forEach((n, d) => lab(ctx, "Xúc xắc " + n, 150 + d * 160, 50, COL[d], "800 13px Be Vietnam Pro, sans-serif"));
      const C = dt.map(counts); for (let f = 0; f < 6; f++) { const y = 70 + f * 58; die(ctx, 60, y + 20, 38, f + 1, "#8f96d4"); C.forEach((c, d) => { const x = 150 + d * 160; ctx.fillStyle = COL[d]; ctx.globalAlpha = 0.8; ctx.fillRect(x, y + 8, Math.min(110, (c[f] / Math.max(...C.flat())) * 110), 24); ctx.globalAlpha = 1; lab(ctx, String(c[f]), x + 116, y + 26, "#fff", "800 14px JetBrains Mono, monospace"); }); }
      return;
    }
    if (s === 2) {
      dt.forEach((arr, d) => { const k = counts(arr)[5], n = arr.length, y = 70 + d * 130; lab(ctx, "Xúc xắc " + NAMES[d], 30, y, COL[d], "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, String(k), 210, y + 22, "#fff", "800 22px JetBrains Mono, monospace", "center"); ctx.fillStyle = "#c3c7f0"; ctx.fillRect(170, y + 32, 80, 2); lab(ctx, String(n), 210, y + 60, "#fff", "800 22px JetBrains Mono, monospace", "center"); lab(ctx, "=", 280, y + 44, "#c3c7f0", "800 24px Be Vietnam Pro, sans-serif"); lab(ctx, Math.round((k / n) * 100) + "%", 320, y + 46, k / n > 0.25 ? "#ff8f6b" : "#5ef2d6", "800 30px JetBrains Mono, monospace"); lab(ctx, "lần ra mặt 6", 30, y + 24, "#8f96d4", "11px Be Vietnam Pro, sans-serif"); lab(ctx, "lần tung", 30, y + 58, "#8f96d4", "11px Be Vietnam Pro, sans-serif"); });
      return;
    }
    if (s === 3) {
      dt.forEach((arr, d) => { lab(ctx, `Xúc xắc ${NAMES[d]} · độ lệch ${dev(arr).toFixed(1)}`, 30 + d * 205, 50, COL[d], "800 13px Be Vietnam Pro, sans-serif"); bars(ctx, 26 + d * 205, 80, 185, 300, arr, COL[d], { label: d === 0 }); });
      lab(ctx, "Đường vàng: số lần mong đợi nếu xúc xắc công bằng (tổng số lần ÷ 6).", 30, 436, "#ffc34d", "600 12px Be Vietnam Pro, sans-serif");
      return;
    }
    if (s === 4) {
      const n = Math.min(600, Math.floor((ST.t * 120) % 760)), X = (i) => 44 + (i / 600) * 570, Y = (v) => 40 + (1 - v / 0.7) * 360;
      ctx.setLineDash([5, 4]); ctx.strokeStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(40, Y(1 / 6)); ctx.lineTo(610, Y(1 / 6)); ctx.moveTo(40, Y(0.4)); ctx.lineTo(610, Y(0.4)); ctx.stroke(); ctx.setLineDash([]); lab(ctx, "17%", 8, Y(1 / 6) + 4, "#ffc34d", "700 11px JetBrains Mono, monospace"); lab(ctx, "40%", 8, Y(0.4) + 4, "#ffc34d", "700 11px JetBrains Mono, monospace");
      [[FUN[0], "#3fe0c5", "viên công bằng"], [FUN[1], "#ff7d5f", "viên gian lận (40%)"]].forEach(([a, c, t], k) => { ctx.strokeStyle = c; ctx.lineWidth = 2.5; ctx.beginPath(); for (let i = 0; i < n; i++) { const x = X(i + 1), y = Y(Math.min(0.7, a[i])); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); lab(ctx, t, 420, 60 + k * 22, c, "700 12px Be Vietnam Pro, sans-serif"); });
      lab(ctx, `${n} lần tung`, 40, 430, "#fff", "800 16px JetBrains Mono, monospace"); lab(ctx, "Lúc đầu hai đường còn lẫn vào nhau, về sau mới tách hẳn.", 200, 430, "#c3c7f0"); return;
    }
    const v = verdict(), real = !demo, dv = real ? v.dv : DEMO.map(dev), mx = Math.max(ST.thr * 2, ...dv);
    lab(ctx, "Độ lệch của từng viên", 30, 44);
    dv.forEach((x, d) => { const y = 70 + d * 70; lab(ctx, "Xúc xắc " + NAMES[d], 30, y + 26, COL[d], "800 14px Be Vietnam Pro, sans-serif"); ctx.fillStyle = "#232866"; ctx.fillRect(150, y + 8, 440, 28); ctx.fillStyle = x > ST.thr ? "#ff7d5f" : COL[d]; ctx.fillRect(150, y + 8, Math.min(1, x / mx) * 440, 28); lab(ctx, x.toFixed(1), 156, y + 28, "#fff", "800 13px JetBrains Mono, monospace"); });
    const tx = 150 + (ST.thr / mx) * 440; ctx.strokeStyle = "#ffc34d"; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(tx, 66); ctx.lineTo(tx, 290); ctx.stroke(); ctx.setLineDash([]); lab(ctx, "ngưỡng " + ST.thr, tx + 4, 300, "#ffc34d");
    const msg = real ? (v.st === "accuse" ? `Kết luận: nghi xúc xắc ${NAMES[v.d]}` : v.st === "wait" ? "Kết luận: chưa đủ dữ liệu" : "Kết luận: chưa thấy viên nào gian lận") : "Kết luận (số liệu mẫu): nghi xúc xắc C";
    lab(ctx, msg, 30, 350, "#ff8f6b", "800 18px Be Vietnam Pro, sans-serif");
    lab(ctx, "Máy đoán mặt sắp ra: " + (real ? [0, 1, 2].map((d) => NAMES[d] + " → " + predictFace(d)).join(" · ") : "A → ? · B → ? · C → 6"), 30, 390, "#c3c7f0", "700 13px Be Vietnam Pro, sans-serif");
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), dt = data();
    if (s <= 1) el.innerHTML = `Mỗi viên có <span class="hl">${dt[0].length}</span> dữ liệu`;
    else if (s === 2) el.innerHTML = dt.map((a, d) => `${NAMES[d]}: <span class="${counts(a)[5] / a.length > 0.25 ? "w" : "hl"}">${Math.round((counts(a)[5] / a.length) * 100)}%</span>`).join(" · ");
    else if (s === 3) el.innerHTML = dt.map((a, d) => `${NAMES[d]}: <span class="hl">${dev(a).toFixed(1)}</span>`).join(" · ");
    else if (s === 4) el.innerHTML = `Càng nhiều lần tung, tỉ lệ càng gần <span class="hl">giá trị thật</span>`;
    else el.innerHTML = `Ngưỡng <span class="hl">${ST.thr}</span> · cần ít nhất <span class="w">${ST.minN}</span> lần`;
  }

  // ---------- điều khiển ----------
  let fixBtn = null;
  function bind() {
    $("roll1").onclick = () => roll(1); $("roll10").onclick = () => roll(10); $("roll100").onclick = () => roll(100);
    $("btnNew").onclick = () => { clearBreaks(); newSet(); update(); guide("Bộ xúc xắc mới: một viên bất kỳ đã bị làm lệch. Tung thật nhiều để tìm ra nó!"); };
    stage.addEventListener("click", () => roll(1));
    document.querySelectorAll("#guessRow [data-g]").forEach((b) => (b.onclick = () => {
      const g = +b.dataset.g, n = Math.min(...ST.dice.map((x) => x.r.length)); ST.guess = g;
      document.querySelectorAll("#guessRow [data-g]").forEach((x) => { x.classList.toggle("ghost", x !== b); x.classList.toggle("accent", x === b); });
      if (ST.loaded < 0) guide("Thật ra lần này <b>cả ba viên đều công bằng</b>. Viên B chỉ trông như gian lận vì dữ liệu bị ghi nhầm!");
      else if (g === ST.loaded) { if (n >= 30) prog.done("guess"); guide(n >= 30 ? `<b>Chính xác!</b> Xúc xắc ${NAMES[g]} là viên gian lận. Em đã dùng dữ liệu của ${n} lần tung để tìm ra nó.` : `Đúng là viên ${NAMES[g]}, nhưng mới ${n} lần tung thì em đoán hơi may đấy. Hãy tung ít nhất 30 lần mỗi viên rồi đoán lại.`); }
      else guide(`Chưa đúng: viên gian lận là <b>xúc xắc ${NAMES[ST.loaded]}</b>. ${n < 60 ? "Với ít lần tung, viên công bằng cũng có lúc trông như gian lận. Tung thêm và quan sát đường trên biểu đồ!" : "Xem lại cột mặt 6 của từng viên nhé."}`);
      update();
    }));
    P.range("minN", () => ST.minN, (v) => (ST.minN = v), (v) => v + " lần", update);
    const setThr = P.range("thr", () => ST.thr, (v) => (ST.thr = v), (v) => v, update);
    const setP = P.range("p", () => ST.p, (v) => (ST.p = v), (v) => Math.round(v * 100) + "%", update);
    $("optWin").onchange = (e) => { ST.win = e.target.checked; update(); };
    const setMin = () => { $("minN").value = ST.minN; $("minNV").textContent = ST.minN + " lần"; };
    function clearBreaks() { ST.brk = null; ST.minN = 30; setMin(); ST.thr = 15; setThr(); ST.win = false; $("optWin").checked = false; if (fixBtn) { fixBtn.remove(); fixBtn = null; } document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); }
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clearBreaks(); b.closest(".break").classList.add("on"); prog.done("broke"); ST.brk = k; ST.p = 0.4; setP();
      if (k === "few") {
        newSet(0); [[2, 5, 1, 6, 3, 4], [6, 6, 3, 6, 2, 6], [1, 4, 2, 5, 3, 1]].forEach((a, d) => a.forEach((f) => { const x = ST.dice[d]; x.t.push(f); x.r.push(f); x.s.push(counts(x.r)[5] / x.r.length); ST.face[d] = f; }));
        ST.minN = 0; setMin(); ST.thr = 5; setThr(); update();
        guide(`Mới tung 6 lần, thám tử đã kết luận: <b>nghi xúc xắc B</b>! Thật ra B là viên công bằng. Bấm <b>Tung 100 lần</b> vài lần và kéo <b>số lần tối thiểu</b> lên 30 xem kết luận thay đổi thế nào.`);
      }
      if (k === "misread") {
        newSet(-1); ST.misread = true; roll(300);
        fixBtn = document.createElement("button"); fixBtn.className = "btn small accent"; fixBtn.innerHTML = HKA.icon("wrench") + "Sửa lại dữ liệu ghi chép"; $("guessRow").appendChild(fixBtn);
        fixBtn.onclick = () => { ST.misread = false; ST.dice.forEach((x) => { x.r = x.t.slice(); x.s = []; let k6 = 0; x.r.forEach((f, i) => { if (f === 6) k6++; x.s.push(k6 / (i + 1)); }); }); fixBtn.remove(); fixBtn = null; update(); guide(`Dữ liệu đã được sửa. Bây giờ thám tử thấy: <b>${V.st === "accuse" ? "nghi xúc xắc " + NAMES[V.d] : "không có viên nào gian lận"}</b>. Cả ba viên đều công bằng, chỉ có bản ghi bị sai.`); };
        guide(`Cả ba viên đều công bằng, nhưng thám tử kết luận <b>${V.st === "accuse" ? "nghi xúc xắc " + NAMES[V.d] : "chưa thấy gì"}</b>. Nhìn cột mặt 1 của viên B: gần như bằng 0! Bấm <b>Sửa lại dữ liệu ghi chép</b>.`);
      }
      if (k === "swap") {
        newSet(0); roll(400); ST.loaded = 2; roll(150);
        guide(`Kẻ gian đã đổi viên gian lận sang <b>C</b> ở lần tung thứ 400. Thám tử dùng toàn bộ dữ liệu nên vẫn <b>${V.st === "accuse" ? "nghi xúc xắc " + NAMES[V.d] : "chưa kết luận"}</b>. Nhìn biểu đồ: đường C đang đi lên! Bật <b>Chỉ xét 120 lần tung gần nhất</b>.`);
      }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clearBreaks(); newSet(); update(); guide("Mọi sự cố đã tắt. Một bộ xúc xắc mới đã sẵn sàng, viên gian lận được chọn ngẫu nhiên."); };
  }

  const QUIZ = [
    { q: "Tung một viên xúc xắc 60 lần, mặt 6 xuất hiện 12 lần. Xác suất thực nghiệm ra mặt 6 là bao nhiêu?", o: ["12/6", "12/60 = 1/5", "6/60", "60/12"], a: 1, e: "Xác suất thực nghiệm = số lần ra mặt 6 ÷ tổng số lần tung = 12/60 = 1/5 = 20%." },
    { q: "Vì sao chỉ tung 6 lần thì chưa nên kết luận viên xúc xắc gian lận?", o: ["Vì 6 là số xấu", "Vì với ít lần tung, kết quả có thể lệch nhiều chỉ do may rủi", "Vì xúc xắc cần nóng lên", "Vì máy tính không đếm được số nhỏ"], a: 1, e: "Ít dữ liệu thì tỉ lệ lắc lư mạnh. Tung nhiều lần, tỉ lệ mới ổn định quanh giá trị thật." },
    { q: "Bạn ghi chép đọc nhầm mặt 1 thành mặt 6. Thám tử máy sẽ thế nào?", o: ["Vẫn kết luận đúng vì máy rất thông minh", "Có thể nghi oan một viên công bằng vì dữ liệu bị sai", "Tự phát hiện bạn ghi nhầm", "Không bị ảnh hưởng gì"], a: 1, e: "Máy chỉ biết những gì được ghi lại. Dữ liệu sai thì kết luận sai: \"rác vào, rác ra\"." },
    { q: "Với một viên xúc xắc công bằng, máy đoán trước mặt sắp ra có đúng nhiều hơn 1/6 số lần không?", o: ["Có, vì máy đã học rất nhiều", "Không, vì không có quy luật nào để học, mọi mặt đều như nhau", "Có, nếu máy đoán mặt 6", "Có, nếu tung thật nhanh"], a: 1, e: "Máy học được khi dữ liệu có quy luật. Xúc xắc công bằng không có quy luật nên máy cũng chỉ đúng khoảng 1/6 như đoán bừa." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; if (ST.anim > 0) ST.anim -= dt; renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); newSet(); bind(); update(); guide("Mỗi viên xúc xắc có 6 mặt. Tung vài lần thì chưa thấy gì đâu. Hãy tung thật nhiều rồi nhìn bảng đếm!");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka23 = { ST, verdict, roll, newSet, dev, counts };
  requestAnimationFrame(tick);
})();
