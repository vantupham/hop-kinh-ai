/* Hộp Kính AI · Dự án 33 · Nơ-ron đầu tiên (trọng số, tổng, ngưỡng, học perceptron, XOR, mạng 2 lớp) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-33");
  const IN = ["Trời nắng", "Có bạn đi cùng", "Đã làm xong bài"];
  const RULES = { mom: (x) => x[2] && (x[0] || x[1]), and: (x) => x[0] && x[1], or: (x) => x[0] || x[1], xor: (x) => x[0] !== x[1] };
  const RN = { mom: "Quy tắc của mẹ: làm xong bài VÀ (nắng HOẶC có bạn)", and: "VÀ: nắng VÀ có bạn", or: "HOẶC: nắng HOẶC có bạn", xor: "Chỉ một trong hai: nắng hoặc có bạn, không phải cả hai", custom: "Quy tắc riêng của em" };
  const ST = { w: [0.5, 0.5, 0.5], th: 2, x: [1, 0, 1], rule: "mom", rows: [], cut3: false, hidden: false, learn: null, errs: [], ep: 0, upd: 0, t: 0 };
  function makeRows() { ST.rows = []; for (let i = 0; i < 8; i++) { const x = [(i >> 2) & 1, (i >> 1) & 1, i & 1]; ST.rows.push({ x, y: ST.rule === "custom" ? 0 : +!!RULES[ST.rule](x) }); } }
  const eff = (x) => (ST.cut3 ? [x[0], x[1], 0] : x);
  const sum = (x) => { const e = eff(x); return ST.w[0] * e[0] + ST.w[1] * e[1] + ST.w[2] * e[2]; };
  function out(x) { if (ST.hidden) { const h1 = x[0] + x[1] >= 1 ? 1 : 0, h2 = x[0] + x[1] >= 2 ? 1 : 0; return h1 - 2 * h2 >= 1 ? 1 : 0; } return sum(x) >= ST.th - 1e-9 ? 1 : 0; }
  const wrong = () => ST.rows.filter((r) => out(r.x) !== r.y).length;

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  const nf = (v) => (Math.round(v * 10) / 10).toString().replace(".", ",");
  const INY = [110, 220, 330], TX = 600, TY = 84, RH = 38;
  function edge(ctx, a, b, w, label) { ctx.strokeStyle = w > 0 ? "#a99dff" : w < 0 ? "#ff7d5f" : "#3a3f7a"; ctx.lineWidth = 1.5 + Math.abs(w) * 2.4; ctx.setLineDash(w ? [] : [5, 5]); ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]); if (label != null) { const mx = a.x + (b.x - a.x) * 0.45, my = a.y + (b.y - a.y) * 0.45; ctx.fillStyle = "#0c1030"; D.rr(ctx, mx - 24, my - 12, 48, 22, 6); ctx.fill(); lab(ctx, label, mx, my + 4, w > 0 ? "#c9c1ff" : w < 0 ? "#ff8f6b" : "#8f96d4", "800 12px JetBrains Mono, monospace", "center"); } }
  function node(ctx, x, y, r, fill, t1, t2) { ctx.fillStyle = fill; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 2; ctx.stroke(); if (t1) lab(ctx, t1, x, y + (t2 ? -2 : 5), "#fff", "800 14px Be Vietnam Pro, sans-serif", "center"); if (t2) lab(ctx, t2, x, y + 18, "#fff", "700 12px JetBrains Mono, monospace", "center"); }
  function renderStage() {
    const ctx = sctx, x = ST.x, o = out(x); D.labBg(ctx);
    const S = { x: 330, y: 220 }, C = { x: 455, y: 220 }, Lp = { x: 548, y: 220 };
    if (!ST.hidden) {
      INY.forEach((y, i) => edge(ctx, { x: 120, y }, S, ST.cut3 && i === 2 ? 0 : ST.w[i], ST.cut3 && i === 2 ? "ngắt" : "×" + nf(ST.w[i])));
      node(ctx, S.x, S.y, 50, "#5443ff", "Tổng", nf(sum(x)));
      ctx.strokeStyle = "#8f96d4"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(S.x + 50, S.y); ctx.lineTo(C.x - 44, C.y); ctx.stroke();
      ctx.fillStyle = "#1d2152"; D.rr(ctx, C.x - 44, C.y - 30, 88, 60, 12); ctx.fill(); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.stroke(); lab(ctx, "≥ θ ?", C.x, C.y - 4, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif", "center"); lab(ctx, "θ = " + nf(ST.th), C.x, C.y + 18, "#fff", "700 12px JetBrains Mono, monospace", "center");
    } else {
      const H1 = { x: 290, y: 150 }, H2 = { x: 290, y: 290 }, O = { x: 440, y: 220 };
      [0, 1].forEach((i) => { edge(ctx, { x: 120, y: INY[i] }, H1, 1, "×1"); edge(ctx, { x: 120, y: INY[i] }, H2, 1, "×1"); });
      edge(ctx, H1, O, 1, "×1"); edge(ctx, H2, O, -2, "×−2");
      const h1 = x[0] + x[1] >= 1, h2 = x[0] + x[1] >= 2;
      node(ctx, H1.x, H1.y, 40, h1 ? "#3fe0c5" : "#2b2f6e", "HOẶC", "θ=1"); node(ctx, H2.x, H2.y, 40, h2 ? "#3fe0c5" : "#2b2f6e", "VÀ", "θ=2"); node(ctx, O.x, O.y, 44, "#5443ff", "Ra", "θ=1");
      lab(ctx, "Mạng 2 lớp chỉnh sẵn cho phép \"chỉ một trong hai\"", 300, 410, "#ffc34d", "700 12px Be Vietnam Pro, sans-serif", "center");
    }
    ctx.strokeStyle = "#8f96d4"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ST.hidden ? 484 : C.x + 44, 220); ctx.lineTo(Lp.x - 32, 220); ctx.stroke();
    ctx.shadowColor = o ? "#3fe0c5" : "transparent"; ctx.shadowBlur = o ? 24 : 0; node(ctx, Lp.x, Lp.y, 32, o ? "#3fe0c5" : "#3a3f7a", o ? "ĐI" : "Ở NHÀ"); ctx.shadowBlur = 0;
    INY.forEach((y, i) => { const off = ST.cut3 && i === 2; node(ctx, 84, y, 36, off ? "#20244f" : x[i] ? "#3fe0c5" : "#2b2f6e", off ? "?" : String(x[i])); lab(ctx, IN[i], 84, y + 52, off ? "#6c74b8" : "#c3c7f0", "700 11px Be Vietnam Pro, sans-serif", "center"); });
    // bảng
    const cols = ["Nắng", "Bạn", "Bài", "Đúng ra", "Nơ-ron"], cx = [TX + 18, TX + 62, TX + 104, TX + 160, TX + 228];
    ctx.fillStyle = "#171b40"; D.rr(ctx, TX - 4, 42, 276, TY - 42 + ST.rows.length * RH + 4, 12); ctx.fill();
    cols.forEach((c, i) => lab(ctx, c, cx[i], 68, "#8f96d4", "700 11px Be Vietnam Pro, sans-serif", "center"));
    ST.rows.forEach((r, k) => {
      const y = TY + k * RH, cur = r.x.every((v, i) => v === x[i]), o2 = out(r.x), bad = o2 !== r.y, lr = ST.learn && ST.learn.k === k;
      ctx.fillStyle = lr ? "rgba(255,195,77,.25)" : cur ? "rgba(124,107,255,.25)" : "transparent"; D.rr(ctx, TX, y, 268, RH - 6, 8); ctx.fill();
      r.x.forEach((v, i) => lab(ctx, ST.cut3 && i === 2 ? "?" : String(v), cx[i], y + 21, v ? "#5ef2d6" : "#6c74b8", "800 14px JetBrains Mono, monospace", "center"));
      ctx.fillStyle = r.y ? "#3fe0c5" : "#3a3f7a"; D.rr(ctx, cx[3] - 24, y + 4, 48, 24, 6); ctx.fill(); lab(ctx, (r.who ? r.who + ": " : "") + (r.y ? "đi" : "ở"), cx[3], y + 21, r.y ? "#062b27" : "#c3c7f0", "800 11px Be Vietnam Pro, sans-serif", "center");
      lab(ctx, o2 ? "đi" : "ở", cx[4], y + 21, bad ? "#ff8f6b" : "#5ef2d6", "800 13px Be Vietnam Pro, sans-serif", "center"); if (bad) { ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 2; ctx.strokeRect(cx[4] - 22, y + 3, 44, 26); }
    });
  }
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function update() {
    const x = ST.x, e = eff(x), o = out(x), n = ST.rows.length, w = wrong();
    $("bOut").textContent = o ? "Đi chơi" : "Ở nhà"; $("bOut").style.color = o ? "#5ef2d6" : "#fff";
    $("bAcc").textContent = `${n - w}/${n}`; $("bAcc").style.color = w ? "#ffc34d" : "#5ef2d6";
    $("bCalc").innerHTML = ST.hidden ? "Mạng 2 lớp:<br>h₁ = HOẶC(nắng, bạn)<br>h₂ = VÀ(nắng, bạn)<br>ra = h₁ − 2·h₂ ≥ 1" : `${e.map((v, i) => `${v}×${nf(ST.w[i])}`).join(" + ")}<br>= <b>${nf(sum(x))}</b> ${sum(x) >= ST.th ? "≥" : "<"} θ = ${nf(ST.th)}<br>→ <b style="color:${o ? "#5ef2d6" : "#ff8f6b"}">${o}: ${o ? "đi chơi" : "ở nhà"}</b>`;
    $("bEp").textContent = ST.ep; $("bUpd").textContent = ST.upd;
    if (!w && !ST.hidden && !ST.learn && ST.rule !== "custom" && n === 8 && !ST.cut3 && ST.byHand) prog.done("hand");
    say(`${RN[ST.rule]}. Nơ-ron đang đúng <b>${n - w}/${n}</b> dòng${w ? `, sai ${w} dòng (viền đỏ)` : ": khớp hết!"}`);
    $("stageTag").textContent = ST.hidden ? "MẠNG 2 LỚP" : "MỘT NƠ-RON";
    renderChart();
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 46, B = 30, T = 16; ctx.clearRect(0, 0, W, H);
    const n = ST.rows.length || 8, Y = (v) => T + (1 - v / n) * (H - T - B), bw = (W - L - 10) / 25;
    ctx.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= n; v += 2) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - 10, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v, 20, Y(v) + 4); }
    ST.errs.forEach((e, i) => { const x = L + i * bw; ctx.fillStyle = e ? TH.coral : TH.mint; D.rr(ctx, x + 3, Y(Math.max(e, 0.08)), bw - 6, H - B - Y(Math.max(e, 0.08)), 4); ctx.fill(); ctx.fillStyle = TH.text; if (i % 2 === 0) ctx.fillText(i + 1, x + bw / 2 - 4, H - 10); });
    if (!ST.errs.length) { ctx.fillStyle = TH.text; ctx.font = "13px Be Vietnam Pro, sans-serif"; ctx.fillText("Bấm \"Cho nơ-ron tự học\" để xem số dòng sai giảm dần qua từng vòng.", L + 20, T + 30); }
  }
  // ---------- tự học ----------
  function learnStart() { if (ST.hidden) { $("optHidden").click(); } ST.errs = []; ST.ep = 0; ST.upd = 0; ST.learn = { k: 0, acc: 0, epErr: 0 }; guide("Nơ-ron đang xem từng dòng trong bảng (dòng vàng). Sai dòng nào thì chỉnh trọng số và ngưỡng một chút."); }
  function learnStep() {
    const L = ST.learn, r = ST.rows[L.k], e = eff(r.x), yh = out(r.x), err = r.y - yh;
    if (err) { L.epErr++; ST.upd++; for (let i = 0; i < 3; i++) if (!(ST.cut3 && i === 2)) ST.w[i] = Math.max(-3, Math.min(3, ST.w[i] + 0.5 * err * e[i])); ST.th = Math.max(-3, Math.min(6, ST.th - 0.5 * err)); syncSliders(); }
    ST.x = r.x.slice(); L.k++;
    if (L.k >= ST.rows.length) { ST.ep++; ST.errs.push(wrong()); L.k = 0; const done = wrong() === 0; if (done || ST.ep >= 25) { ST.learn = null; if (done) { prog.done("learn"); guide(`Học xong sau <b>${ST.ep}</b> vòng, ${ST.upd} lần chỉnh: w = (${ST.w.map(nf).join("; ")}), θ = ${nf(ST.th)}. Nơ-ron đúng cả bảng!`); } else guide(ST.rows.some((q) => q.who) ? `Học 25 vòng vẫn còn <b>${wrong()}</b> dòng sai: dòng của mẹ và dòng của bố cùng đầu vào mà khác đáp án, không cách nào đúng cả hai.` : ST.cut3 ? `Học 25 vòng vẫn còn <b>${wrong()}</b> dòng sai: không biết em đã làm xong bài chưa thì nơ-ron không thể theo quy tắc của mẹ.` : `Đã học <b>25 vòng</b> mà vẫn còn <b>${wrong()}</b> dòng sai. Biểu đồ không chịu về 0: bài này <b>một nơ-ron không học được</b>. Thử bật <b>Dùng mạng 2 lớp</b>.`); } }
    update();
  }
  let syncSliders = () => {};

  // ---------- SOI ----------
  const SOI = [
    { t: "Đầu vào 0 hoặc 1", e: "check", d: "Mỗi câu hỏi có/không thành một số: <b>1</b> là có, <b>0</b> là không. Giống giá trị đúng/sai trong biểu thức logic em học ở Tin học." },
    { t: "Nhân trọng số", e: "sliders", d: "Mỗi đầu vào được nhân với một <b>trọng số</b>. Trọng số lớn: điều đó quan trọng. Trọng số âm: điều đó khiến em <b>không muốn</b> đi." },
    { t: "Cộng lại", e: "layers", d: "Nơ-ron <b>cộng</b> tất cả các tích lại thành một con số: \"mức muốn đi chơi\"." },
    { t: "So với ngưỡng", e: "target", d: "Nếu tổng <b>đạt ngưỡng θ</b> thì trả lời 1 (đi chơi), ngược lại trả lời 0. Ngưỡng cao: khó tính; ngưỡng thấp: dễ dãi." },
    { t: "Tự học", e: "repeat", d: "Với mỗi dòng sai: đúng ra 1 mà trả lời 0 thì <b>tăng</b> trọng số của các đầu vào đang bật và <b>hạ</b> ngưỡng; ngược lại thì làm ngược lại. Lặp qua bảng nhiều vòng." },
    { t: "Một đường thẳng", e: "angle", d: "Một nơ-ron chia các tình huống bằng <b>một đường thẳng</b>. Phép \"chỉ một trong hai\" cần hai đường, nên phải ghép <b>nhiều nơ-ron, nhiều lớp</b>." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const ctx = octx, s = soiStep, x = eff(ST.x); D.labBg(ctx);
    if (s <= 3) {
      IN.forEach((n, i) => { const y = 80 + i * 110, on = x[i]; node(ctx, 70, y, 32, on ? "#3fe0c5" : "#2b2f6e", String(x[i])); lab(ctx, n, 70, y + 48, "#c3c7f0", "700 11px Be Vietnam Pro, sans-serif", "center");
        if (s >= 1) { lab(ctx, `${x[i]} × ${nf(ST.w[i])} = ${nf(x[i] * ST.w[i])}`, 130, y + 6, "#fff", "800 18px JetBrains Mono, monospace"); } });
      if (s >= 2) { lab(ctx, `Tổng = ${nf(sum(ST.x))}`, 380, 200, "#a99dff", "800 26px Be Vietnam Pro, sans-serif"); }
      if (s >= 3) { const X = (v) => 360 + ((v + 3) / 9) * 250; ctx.strokeStyle = "#8f96d4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(360, 300); ctx.lineTo(610, 300); ctx.stroke(); ctx.fillStyle = "rgba(63,224,197,.25)"; ctx.fillRect(X(ST.th), 286, 610 - X(ST.th), 28); ctx.strokeStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(X(ST.th), 276); ctx.lineTo(X(ST.th), 324); ctx.stroke(); lab(ctx, "θ = " + nf(ST.th), X(ST.th), 270, "#ffc34d", null, "center"); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(X(Math.max(-3, Math.min(6, sum(ST.x)))), 300, 8, 0, 7); ctx.fill(); lab(ctx, out(ST.x) ? "→ 1: đi chơi" : "→ 0: ở nhà", 380, 370, out(ST.x) ? "#5ef2d6" : "#ff8f6b", "800 22px Be Vietnam Pro, sans-serif"); }
      return;
    }
    if (s === 4) {
      const r = ST.rows.find((q) => out(q.x) !== q.y) || ST.rows[0], e = eff(r.x), err = r.y - out(r.x);
      lab(ctx, `Dòng (${r.x.join(", ")}): nơ-ron trả lời ${out(r.x)}, đúng ra ${r.y}`, 30, 50, err ? "#ff8f6b" : "#5ef2d6", "800 16px Be Vietnam Pro, sans-serif");
      if (!err) { lab(ctx, "Không còn dòng nào sai, nơ-ron không cần chỉnh nữa.", 30, 90, "#c3c7f0", "600 14px Be Vietnam Pro, sans-serif"); return; }
      e.forEach((v, i) => lab(ctx, `w${i + 1}: ${nf(ST.w[i])} → ${nf(ST.w[i] + 0.5 * err * v)}${v ? "" : "   (đầu vào tắt, giữ nguyên)"}`, 50, 110 + i * 40, v ? "#fff" : "#8f96d4", "700 15px JetBrains Mono, monospace"));
      lab(ctx, `θ: ${nf(ST.th)} → ${nf(ST.th - 0.5 * err)}`, 50, 240, "#ffc34d", "700 15px JetBrains Mono, monospace");
      lab(ctx, err > 0 ? "Đúng ra phải đi: tăng trọng số đầu vào đang bật, hạ ngưỡng." : "Đúng ra phải ở nhà: giảm trọng số đầu vào đang bật, nâng ngưỡng.", 30, 300, "#c3c7f0", "600 13px Be Vietnam Pro, sans-serif"); return;
    }
    const X = (v) => 120 + v * 300, Y = (v) => 380 - v * 300; lab(ctx, "Trục ngang: trời nắng · trục dọc: có bạn (đã làm xong bài)", 30, 30, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif");
    ctx.strokeStyle = "#2c3270"; ctx.lineWidth = 2; ctx.strokeRect(X(0), Y(1), 300, 300);
    if (!ST.hidden) { const w1 = ST.w[0], w2 = ST.w[1], c = ST.th - (ST.cut3 ? 0 : ST.w[2]); ctx.strokeStyle = "#a99dff"; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.beginPath(); if (Math.abs(w2) > 1e-6) { ctx.moveTo(X(-0.3), Y((c - w1 * -0.3) / w2)); ctx.lineTo(X(1.3), Y((c - w1 * 1.3) / w2)); } else if (Math.abs(w1) > 1e-6) { ctx.moveTo(X(c / w1), Y(-0.3)); ctx.lineTo(X(c / w1), Y(1.3)); } ctx.stroke(); ctx.setLineDash([]); }
    [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(([a, b]) => { const r = ST.rows.find((q) => q.x[0] === a && q.x[1] === b && q.x[2] === 1); if (!r) return; node(ctx, X(a), Y(b), 22, r.y ? "#3fe0c5" : "#ff7d5f", r.y ? "đi" : "ở"); });
    const tl = ST.rule === "xor" ? ["Không đường thẳng nào", "tách được xanh và đỏ!"] : ["Đường tím:", "ranh giới của nơ-ron"]; tl.forEach((t, i) => lab(ctx, t, 450, 190 + i * 22, ST.rule === "xor" ? "#ff8f6b" : "#a99dff", "800 14px Be Vietnam Pro, sans-serif"));
  }
  function soiLive() { const s = soiStep, el = $("soiLive"); if (s <= 3) el.innerHTML = `Tổng <span class="hl">${nf(sum(ST.x))}</span> · ngưỡng <span class="w">${nf(ST.th)}</span>`; else el.innerHTML = `Đang sai <span class="w">${wrong()}</span>/${ST.rows.length} dòng`; }

  // ---------- điều khiển ----------
  function bind() {
    const s1 = P.range("w1", () => ST.w[0], (v) => (ST.w[0] = v), nf, hand), s2 = P.range("w2", () => ST.w[1], (v) => (ST.w[1] = v), nf, hand), s3 = P.range("w3", () => ST.w[2], (v) => (ST.w[2] = v), nf, hand), s4 = P.range("th", () => ST.th, (v) => (ST.th = v), nf, hand);
    function hand() { ST.byHand = true; update(); }
    syncSliders = () => { s1(); s2(); s3(); s4(); };
    const setRule = (r) => { ST.rule = r; $("ruleBtns").querySelectorAll("button").forEach((b) => b.classList.toggle("ghost", b.dataset.r !== r)); if (r !== "custom") makeRows(); ST.errs = []; update(); };
    $("ruleBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => setRule(b.dataset.r)));
    stage.addEventListener("click", (e) => {
      const rc = stage.getBoundingClientRect(), x = ((e.clientX - rc.left) / rc.width) * 880, y = ((e.clientY - rc.top) / rc.height) * 440;
      const i = INY.findIndex((yy) => Math.hypot(84 - x, yy - y) < 40); if (i >= 0 && !(ST.cut3 && i === 2)) { ST.x[i] = 1 - ST.x[i]; update(); return; }
      const k = Math.floor((y - TY) / RH); if (x > TX && k >= 0 && k < ST.rows.length && y >= TY) { if (x > TX + 132 && x < TX + 190) { ST.rows[k].y = 1 - ST.rows[k].y; ST.rule = "custom"; $("ruleBtns").querySelectorAll("button").forEach((b) => b.classList.add("ghost")); prog.done("custom"); ST.errs = []; } else ST.x = ST.rows[k].x.slice(); update(); }
    });
    $("btnLearn").onclick = learnStart;
    $("btnZero").onclick = () => { ST.w = [0, 0, 0]; ST.th = 0.5; syncSliders(); ST.errs = []; update(); };
    $("optHidden").onchange = (e) => { ST.hidden = e.target.checked; ["w1", "w2", "w3", "th"].forEach((id) => ($(id).disabled = ST.hidden)); update(); if (ST.hidden) guide(ST.rule === "xor" ? "Hai nơ-ron ẩn: một làm phép HOẶC, một làm phép VÀ. Nơ-ron cuối lấy HOẶC trừ đi gấp đôi VÀ: ra đúng \"chỉ một trong hai\". Cả bảng đều đúng!" : "Mạng 2 lớp này được chỉnh sẵn cho phép \"chỉ một trong hai\". Chọn quy tắc đó để xem nó đúng hết."); };
    const clear = () => { ST.cut3 = false; $("w3").disabled = false; if (ST.hidden) $("optHidden").click(); ST.learn = null; ST.w = [0.5, 0.5, 0.5]; ST.th = 2; syncSliders(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "xor") { setRule("xor"); learnStart(); }
      if (k === "conflict") { setRule("mom"); ST.rows.push({ x: [1, 1, 1], y: 0, who: "bố" }); update(); learnStart(); }
      if (k === "missing") { setRule("mom"); ST.cut3 = true; ST.w[2] = 0; syncSliders(); $("w3").disabled = true; update(); learnStart(); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); setRule("mom"); ST.errs = []; update(); guide("Mọi sự cố đã tắt. Quay về quy tắc của mẹ, 8 dòng, đủ 3 đầu vào."); };
    setRule("mom");
  }

  const QUIZ = [
    { q: "Nơ-ron có w₁ = 1, w₂ = 2, w₃ = 1, ngưỡng θ = 3. Đầu vào (1, 1, 0). Nơ-ron trả lời gì?", o: ["0, vì tổng là 2", "1, vì tổng là 3, đạt ngưỡng", "1, vì có hai đầu vào bật", "0, vì đầu vào thứ ba tắt"], a: 1, e: "Tổng = 1×1 + 1×2 + 0×1 = 3 ≥ 3 nên trả lời 1." },
    { q: "Muốn một nơ-ron hai đầu vào làm phép VÀ, chọn trọng số và ngưỡng nào?", o: ["w = (1; 1), θ = 2", "w = (1; 1), θ = 1", "w = (1; 1), θ = 0", "w = (−1; −1), θ = 2"], a: 0, e: "Chỉ khi cả hai đầu vào bằng 1 thì tổng mới bằng 2, đạt ngưỡng." },
    { q: "Khi tự học, nơ-ron trả lời 0 nhưng đúng ra là 1. Nó chỉnh thế nào?", o: ["Giảm trọng số của các đầu vào đang bật", "Tăng trọng số của các đầu vào đang bật và hạ ngưỡng", "Xóa dòng đó khỏi bảng", "Không chỉnh gì"], a: 1, e: "Tăng trọng số và hạ ngưỡng để lần sau tổng dễ đạt ngưỡng hơn." },
    { q: "Vì sao một nơ-ron không học được phép \"chỉ một trong hai\" (XOR)?", o: ["Vì phép đó quá dễ", "Vì không đường thẳng nào tách được các tình huống đi và không đi", "Vì máy tính không biết số 0", "Vì thiếu ngưỡng"], a: 1, e: "Một nơ-ron chỉ vẽ được một đường thẳng; XOR cần ghép nhiều nơ-ron thành nhiều lớp." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; if (ST.learn) { ST.learn.acc += dt * 16; while (ST.learn && ST.learn.acc >= 1) { ST.learn.acc -= 1; learnStep(); } } renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); makeRows(); bind(); update(); guide("Bấm vào ba vòng tròn bên trái để đổi tình huống. Kéo các <b>trọng số</b> và <b>ngưỡng</b> sao cho cột <b>Nơ-ron</b> trong bảng khớp hết với cột <b>Đúng ra</b>.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka33 = { ST, out, wrong, learnStart, learnStep };
  requestAnimationFrame(tick);
})();
