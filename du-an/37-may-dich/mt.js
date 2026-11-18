/* Hộp Kính AI · Dự án 37 · Máy dịch ngây ngô (giao diện, sơ đồ ba hàng, soi, phá máy) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, M = window.MT37;
  const prog = P.progress("hka-37");
  const ST = { idiom: true, context: true, order: true, win: 4, sent: M.TESTS[7][0], focus: null, R: null, tried: new Set(), boxes: [] };
  const opt = () => ({ idiom: ST.idiom, context: ST.context, order: ST.order, win: ST.win });
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);

  function run() {
    ST.R = M.translate(ST.sent, opt());
    const toks = ST.R.toks;
    if (ST.focus == null || ST.focus >= toks.length) { const k = toks.findIndex((t) => t.senses.length > 1); ST.focus = k >= 0 ? k : 0; }
    panel();
  }
  function translateNew(s) { if (!s.trim()) return; ST.sent = s.trim(); ST.focus = null; ST.tried.add(M.norm(s)); if (ST.tried.size >= 5) prog.done("try"); run(); }

  // ---------- hình ba hàng ----------
  const cv = $("stage"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
  const Y1 = 92, Y2 = 212, Y3 = 342;
  function draw() {
    const R = ST.R; if (!R) return; const toks = R.toks;
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#14183d"); g.addColorStop(1, "#1d2254"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    [["TIẾNG ANH", Y1], ["NGHĨA ĐƯỢC CHỌN", Y2], ["TIẾNG VIỆT", Y3]].forEach(([t, y]) => { ctx.fillStyle = "#8f96d4"; ctx.font = "700 11px JetBrains Mono, monospace"; ctx.fillText(t, 18, y - 34); });
    // độ rộng mỗi cột = max(chữ Anh, chữ Việt)
    let fs = 17; const measure = () => { ctx.font = `700 ${fs}px Be Vietnam Pro, sans-serif`; return toks.map((t) => Math.max(ctx.measureText(t.en).width, ctx.measureText(t.vi || "∅").width) + 22); };
    let ws = measure(), tot = ws.reduce((a, b) => a + b, 0) + 8 * (ws.length - 1);
    while (tot > W - 36 && fs > 10) { fs--; ws = measure(); tot = ws.reduce((a, b) => a + b, 0) + 8 * (ws.length - 1); }
    let x = Math.max(18, (W - tot) / 2); const cols = ws.map((w) => { const c = { x, w, cx: x + w / 2 }; x += w + 8; return c; });
    const ch = fs + 18, F = toks[ST.focus];
    // vùng nhìn ngữ cảnh
    if (F && F.senses.length > 1 && ST.context) {
      const lo = Math.max(0, F.i - ST.win), hi = F.i + F.n - 1 + ST.win; const inWin = toks.map((t, k) => k).filter((k) => toks[k].i + toks[k].n - 1 >= lo && toks[k].i <= hi);
      const a = cols[inWin[0]], b = cols[inWin[inWin.length - 1]]; ctx.fillStyle = "rgba(255,195,77,.14)"; ctx.strokeStyle = "rgba(255,195,77,.6)"; ctx.setLineDash([6, 4]); D.rr(ctx, a.x - 6, Y1 - ch / 2 - 8, b.x + b.w - a.x + 12, ch + 16, 12); ctx.fill(); ctx.stroke(); ctx.setLineDash([]);
    }
    const hitWords = F ? new Set(F.hits.flat()) : new Set();
    ST.boxes = [];
    toks.forEach((t, k) => {
      const c = cols[k], foc = k === ST.focus, amb = t.senses.length > 1, clue = !foc && t.n === 1 && hitWords.has(t.en);
      ctx.fillStyle = foc ? "#5443ff" : t.idiom ? "#8a5a12" : clue ? "#ffc34d" : amb ? "#3a2f86" : "#262b66"; D.rr(ctx, c.x, Y1 - ch / 2, c.w, ch, 9); ctx.fill();
      if (amb && !foc) { ctx.strokeStyle = "#a99dff"; ctx.lineWidth = 2; D.rr(ctx, c.x, Y1 - ch / 2, c.w, ch, 9); ctx.stroke(); }
      ctx.fillStyle = clue ? "#1b1f4a" : "#fff"; ctx.font = `700 ${fs}px Be Vietnam Pro, sans-serif`; ctx.textAlign = "center"; ctx.fillText(t.en, c.cx, Y1 + fs / 3); ctx.textAlign = "left";
      ST.boxes.push({ k, x: c.x, y: Y1 - ch / 2, w: c.w, h: ch });
      // hàng 2
      ctx.strokeStyle = "#4a5088"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(c.cx, Y1 + ch / 2); ctx.lineTo(c.cx, Y2 - ch / 2); ctx.stroke();
      const empty = !t.vi; ctx.fillStyle = t.unknown ? "#5a2436" : empty ? "transparent" : t.idiom ? "#a86c10" : amb ? (t.pick === 0 ? "#2d4f8a" : "#1d6a5e") : "#1f3a4e"; if (!empty) { D.rr(ctx, c.x, Y2 - ch / 2, c.w, ch, 9); ctx.fill(); }
      ctx.fillStyle = empty ? "#6c74b8" : "#fff"; ctx.textAlign = "center"; ctx.fillText(empty ? "(bỏ)" : t.vi, c.cx, Y2 + fs / 3); ctx.textAlign = "left";
      if (amb) { ctx.fillStyle = "#c3c7f0"; ctx.font = "600 10px JetBrains Mono, monospace"; ctx.textAlign = "center"; ctx.fillText(`nghĩa ${t.pick + 1}/${t.senses.length}`, c.cx, Y2 + ch / 2 + 14); ctx.textAlign = "left"; }
    });
    // hàng 3 theo thứ tự mới
    ctx.font = `700 ${fs}px Be Vietnam Pro, sans-serif`; const ow = R.out.map((o) => ctx.measureText(o.vi).width + 22), ot = ow.reduce((a, b) => a + b, 0) + 8 * (ow.length - 1);
    let fs3 = fs; if (ot > W - 36) fs3 = Math.max(9, Math.floor(fs * (W - 36) / ot));
    ctx.font = `700 ${fs3}px Be Vietnam Pro, sans-serif`; const ow3 = R.out.map((o) => ctx.measureText(o.vi).width + 18), ot3 = ow3.reduce((a, b) => a + b, 0) + 8 * (ow3.length - 1);
    let x3 = Math.max(18, (W - ot3) / 2); const ch3 = fs3 + 18;
    R.out.forEach((o, j) => {
      const c = cols[o.k], w = ow3[j], cx = x3 + w / 2, moved = Math.abs(cx - c.cx) > 30 && ST.order;
      ctx.strokeStyle = moved ? "#ffc34d" : "#4a5088"; ctx.lineWidth = moved ? 2.5 : 1.5; ctx.beginPath(); ctx.moveTo(c.cx, Y2 + ch / 2 + (toks[o.k].senses.length > 1 ? 18 : 0)); ctx.bezierCurveTo(c.cx, Y2 + 70, cx, Y3 - 70, cx, Y3 - ch3 / 2); ctx.stroke();
      ctx.fillStyle = "#10372f"; D.rr(ctx, x3, Y3 - ch3 / 2, w, ch3, 9); ctx.fill(); ctx.strokeStyle = "#3fe0c5"; ctx.lineWidth = 1.5; D.rr(ctx, x3, Y3 - ch3 / 2, w, ch3, 9); ctx.stroke();
      ctx.fillStyle = "#e8fffa"; ctx.textAlign = "center"; ctx.fillText(j === 0 ? o.vi.charAt(0).toUpperCase() + o.vi.slice(1) : o.vi, cx, Y3 + fs3 / 3); ctx.textAlign = "left";
      x3 += w + 8;
    });
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 12px Be Vietnam Pro, sans-serif"; ctx.fillText("Bấm vào một từ tiếng Anh để xem các nghĩa của nó", 18, H - 14);
  }
  cv.addEventListener("pointerdown", (e) => {
    const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
    const b = ST.boxes.find((b) => x >= b.x - 4 && x <= b.x + b.w + 4 && y >= b.y - 10 && y <= b.y + b.h + 10);
    if (!b) return; ST.focus = b.k; prog.done("click"); const t = ST.R.toks[b.k];
    guide(t.idiom ? `\"${esc(t.en)}\" là một <b>thành ngữ</b>: máy dịch cả cụm thành \"${esc(t.vi)}\".` : t.unknown ? `Từ \"${esc(t.en)}\" chưa có trong từ điển của máy, nên máy để nguyên trong ngoặc vuông.` : t.senses.length > 1 ? `\"${esc(t.en)}\" có <b>${t.senses.length} nghĩa</b>. Xem bảng bên phải: nghĩa nào có nhiều từ gợi ý trong vùng nhìn hơn thì được chọn.` : `\"${esc(t.en)}\" chỉ có một nghĩa trong từ điển: \"${esc(t.vi || "(bỏ, tiếng Việt không cần)")}\".`);
    panel();
  });

  // ---------- bảng và biểu đồ ----------
  function panel() {
    const R = ST.R, F = R.toks[ST.focus]; $("bOut").textContent = R.text || "—";
    const sc = M.score(opt()); $("bAcc").textContent = `${sc}/12`; $("bAcc").style.color = sc === 12 ? "#5ef2d6" : sc >= 9 ? "#ffc34d" : "#ff8f6b"; if (sc === 12) prog.done("score");
    $("bWord").textContent = F ? F.en : "—";
    $("bSense").innerHTML = F ? F.senses.map((s, k) => `<div${k === F.pick ? ' style="color:#5ef2d6"' : ""}>${k === F.pick ? "→" : "&nbsp;"} ${k + 1}. ${esc(s.vi || "(bỏ)")}${F.senses.length > 1 ? ` · điểm ${F.scores[k]}${F.hits[k].length ? " (" + F.hits[k].join(", ") + ")" : ""}` : ""}</div>`).join("") + (F.senses.length > 1 && !ST.context ? '<div style="color:#ffc34d">Đang tắt ngữ cảnh: luôn chọn nghĩa 1</div>' : "") : "";
    const ref = M.TESTS.find(([en]) => M.norm(en) === M.norm(ST.sent));
    say(`<b>${esc(ST.sent)}</b> → ${esc(R.text)}` + (ref ? (M.norm(ref[1]) === M.norm(R.text) ? ' <span style="color:var(--mint)">(đúng)</span>' : ` <span style="color:var(--coral)">(chưa đúng; đáp án: ${esc(ref[1])})</span>`) : ""));
    document.querySelectorAll("#tests button").forEach((b, i) => { const ok = M.norm(M.translate(M.TESTS[i][0], opt()).text) === M.norm(M.TESTS[i][1]); b.classList.toggle("ok", ok); b.classList.toggle("bad", !ok); });
    renderChart();
  }
  function renderChart() {
    const c = $("chart"), x = c.getContext("2d"), CW = c.width, CH = c.height, TH = P.TH, L = 46, B = 44, T = 16; x.clearRect(0, 0, CW, CH);
    const F = ST.R && ST.R.toks[ST.focus]; x.font = "13px Be Vietnam Pro, sans-serif";
    if (!F || F.senses.length < 2) { x.fillStyle = TH.text; x.fillText(F ? `\"${F.en}\" chỉ có một nghĩa. Bấm vào một từ có viền tím (từ nhiều nghĩa) trên hình.` : "", L, CH / 2); return; }
    const mx = Math.max(3, ...F.scores), n = F.senses.length, bw = Math.min(260, (CW - L - 20) / n), Y = (v) => T + (1 - v / mx) * (CH - T - B);
    x.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= mx; v++) { x.strokeStyle = TH.grid; x.beginPath(); x.moveTo(L, Y(v)); x.lineTo(CW - 10, Y(v)); x.stroke(); x.fillStyle = TH.text; x.fillText(v, 20, Y(v) + 4); }
    F.senses.forEach((s, k) => { const xx = L + 20 + k * (bw + 40), on = k === F.pick; x.fillStyle = on ? TH.mint : TH.violet; D.rr(x, xx, Y(F.scores[k]), bw, Math.max(3, CH - B - Y(F.scores[k])), 6); x.fill(); x.fillStyle = on ? TH.mint : TH.ink; x.font = (on ? "800 " : "600 ") + "13px Be Vietnam Pro, sans-serif"; x.fillText(`${k + 1}. ${s.vi}${on ? " (được chọn)" : ""}`, xx, CH - 22); x.fillStyle = TH.text; x.font = "11px JetBrains Mono, monospace"; x.fillText("gợi ý: " + s.clue.slice(0, 4).join(", "), xx, CH - 6); });
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Tách từ", e: "scan", d: "Máy bỏ dấu câu, đổi về chữ thường rồi cắt câu thành <b>từng từ</b>." },
    { t: "Tìm thành ngữ", e: "msg", d: "Máy dò xem có cụm nào nằm trong <b>từ điển thành ngữ</b> không. Có thì giữ cả cụm, dịch cả cụm." },
    { t: "Tra từ điển", e: "book", d: "Mỗi từ còn lại được tra từ điển. Nhiều từ có <b>nhiều nghĩa</b>; từ như \"the\", \"is\" không cần dịch sang tiếng Việt." },
    { t: "Chọn nghĩa theo ngữ cảnh", e: "eye", d: "Với từ nhiều nghĩa, máy đếm <b>từ gợi ý</b> nằm trong vùng nhìn. Nghĩa nhiều gợi ý nhất thắng; không có gợi ý thì lấy nghĩa đầu." },
    { t: "Sắp xếp trật tự", e: "layers", d: "Quy tắc tiếng Việt: <b>tính từ ra sau danh từ</b>, \"của tôi\", \"này\" ra sau danh từ. Rồi viết hoa chữ đầu câu." },
    { t: "Máy dịch hiện đại", e: "cpu", d: "Ứng dụng dịch ngày nay không dùng quy tắc viết tay mà <b>học từ hàng triệu cặp câu song ngữ</b>, xét cả câu cùng lúc. Dịch tốt hơn nhiều, nhưng vẫn có thể sai: cần người đọc lại." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), sx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (t, x, y, c, f, al) => { sx.fillStyle = c || "#c3c7f0"; sx.font = f || "700 12px Be Vietnam Pro, sans-serif"; sx.textAlign = al || "left"; sx.fillText(t, x, y); sx.textAlign = "left"; };
  function chips(arr, x0, y, col, fcol) { let x = x0; sx.font = "700 13px Be Vietnam Pro, sans-serif"; arr.forEach((t, i) => { const w = sx.measureText(t).width + 16; if (x + w > 620) { x = x0; y += 34; } sx.fillStyle = typeof col === "function" ? col(i) : col; D.rr(sx, x, y, w, 26, 7); sx.fill(); sx.fillStyle = fcol || "#fff"; sx.fillText(t, x + 8, y + 18); x += w + 6; }); return y + 40; }
  function renderSoi() {
    const s = soiStep, R = ST.R; if (!R) return; D.labBg(sx);
    lab("Câu đang dịch", 24, 30, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif"); lab(ST.sent, 24, 56, "#fff", "700 16px Be Vietnam Pro, sans-serif");
    if (s === 0) { chips(R.words, 24, 90, "#2b2f6e"); lab(`${R.words.length} từ`, 24, 200, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); return; }
    if (s === 1) { const y = chips(R.toks.map((t) => t.en), 24, 90, (i) => (R.toks[i].idiom ? "#a86c10" : "#2b2f6e")); lab(R.toks.some((t) => t.idiom) ? "Tìm thấy thành ngữ (màu cam): dịch cả cụm" : ST.idiom ? "Không có thành ngữ nào trong câu này" : "Đang tắt từ điển thành ngữ", 24, y + 20, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif"); lab("Từ điển thành ngữ của máy:", 24, y + 60, "#8f96d4"); M.IDIOMS.forEach(([en, vi], i) => lab(`${en}  →  ${vi}`, 24, y + 86 + i * 24, "#c3c7f0", "600 13px Be Vietnam Pro, sans-serif")); return; }
    if (s === 2) { let y = 90; R.toks.slice(0, 11).forEach((t) => { lab(t.en, 24, y + 4, t.senses.length > 1 ? "#a99dff" : "#fff", "800 14px Be Vietnam Pro, sans-serif"); lab(t.senses.map((z, k) => `${k + 1}. ${z.vi || "(bỏ)"}`).join("    "), 200, y + 4, t.unknown ? "#ff8f6b" : "#c3c7f0", "600 13px Be Vietnam Pro, sans-serif"); y += 32; }); return; }
    if (s === 3) {
      const amb = R.toks.filter((t) => t.senses.length > 1); if (!amb.length) { lab("Câu này không có từ nhiều nghĩa.", 24, 120, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); return; }
      let y = 96; amb.slice(0, 3).forEach((t) => { lab(`"${t.en}" (nhìn ${ST.win} từ mỗi bên)`, 24, y, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif"); y += 10; t.senses.forEach((z, k) => { const on = k === t.pick; sx.fillStyle = on ? "#3fe0c5" : "#2b2f6e"; D.rr(sx, 24, y + 6, 40 + t.scores[k] * 60, 22, 6); sx.fill(); lab(`${z.vi}: ${t.scores[k]} gợi ý${t.hits[k].length ? " (" + t.hits[k].join(", ") + ")" : ""}`, 80 + t.scores[k] * 60, y + 22, on ? "#5ef2d6" : "#c3c7f0", "700 13px Be Vietnam Pro, sans-serif"); y += 30; }); y += 26; });
      if (!ST.context) lab("Đang tắt ngữ cảnh: máy luôn lấy nghĩa đầu tiên", 24, 460, "#ff8f6b", "800 13px Be Vietnam Pro, sans-serif"); return;
    }
    if (s === 4) { lab("Trước khi sắp xếp", 24, 96, "#8f96d4"); const y = chips(R.toks.filter((t) => t.vi).map((t) => t.vi), 24, 106, "#1f3a4e"); lab(ST.order ? "Sau khi sắp xếp" : "Đang tắt sắp xếp: giữ nguyên thứ tự", 24, y + 20, ST.order ? "#5ef2d6" : "#ff8f6b"); chips(R.out.map((o) => o.vi), 24, y + 30, "#10372f"); return; }
    [["Theo quy tắc (dự án này)", "#a99dff", ["Người viết từ điển, quy tắc", "Biết rõ vì sao dịch như vậy", "Thiếu từ, thiếu quy tắc là sai", "Không hiểu cả câu"]], ["Học từ dữ liệu (ứng dụng thật)", "#5ef2d6", ["Học từ hàng triệu cặp câu", "Xét cả câu, cả đoạn", "Dịch tự nhiên hơn nhiều", "Vẫn sai thành ngữ, tên riêng"]]].forEach(([t, c, items], k) => { const x = 24 + k * 310; sx.fillStyle = "#1d2152"; D.rr(sx, x, 100, 290, 230, 14); sx.fill(); lab(t, x + 16, 132, c, "800 15px Be Vietnam Pro, sans-serif"); items.forEach((it, i) => lab("• " + it, x + 16, 170 + i * 36, "#fff", "600 13px Be Vietnam Pro, sans-serif")); });
  }
  function soiLive() { $("soiLive").innerHTML = `Bản dịch: <span class="hl">${esc(ST.R ? ST.R.text : "")}</span>`; }

  // ---------- điều khiển ----------
  function bind() {
    $("mtForm").addEventListener("submit", (e) => { e.preventDefault(); translateNew($("mtIn").value); });
    $("tests").innerHTML = M.TESTS.map(([en]) => `<button class="btn small ghost" type="button">${esc(en)}</button>`).join("");
    $("tests").querySelectorAll("button").forEach((b, i) => (b.onclick = () => { $("mtIn").value = M.TESTS[i][0]; translateNew(M.TESTS[i][0]); }));
    const setWin = P.range("win", () => ST.win, (v) => (ST.win = v), (v) => v + " từ", run);
    $("optContext").onchange = (e) => { ST.context = e.target.checked; run(); };
    $("optIdiom").onchange = (e) => { ST.idiom = e.target.checked; ST.focus = null; run(); };
    $("optOrder").onchange = (e) => { ST.order = e.target.checked; run(); };
    const clear = () => { Object.assign(ST, { idiom: true, context: true, order: true, win: 4 }); setWin(); ["optContext", "optIdiom", "optOrder"].forEach((id) => ($(id).checked = true)); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "idiom") { ST.idiom = false; $("optIdiom").checked = false; translateNew(M.TESTS[8][0]); guide("Không có từ điển thành ngữ, máy dịch <b>từng chữ</b>. Bật <b>Dùng từ điển thành ngữ</b>."); }
      if (k === "poly") { ST.win = 1; setWin(); translateNew(M.TESTS[7][0]); guide("Máy chỉ nhìn 1 từ mỗi bên nên không thấy \"boats\", chọn nhầm \"ngân hàng\". Kéo <b>độ rộng ngữ cảnh</b> lên 4."); }
      if (k === "order") { ST.order = false; $("optOrder").checked = false; translateNew(M.TESTS[11][0]); guide("Giữ trật tự tiếng Anh nên câu lủng củng. Bật <b>Sắp xếp lại trật tự từ kiểu tiếng Việt</b>."); }
      $("mtIn").value = ST.sent; $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); run(); guide("Mọi sự cố đã tắt: máy dùng ngữ cảnh 4 từ, từ điển thành ngữ và quy tắc trật tự từ."); };
  }

  const QUIZ = [
    { q: "Máy đơn giản trong dự án chọn nghĩa của \"bank\" như thế nào?", o: ["Hiểu ý cả câu như người", "Đếm từ gợi ý nằm gần \"bank\" cho mỗi nghĩa", "Chọn ngẫu nhiên", "Luôn chọn nghĩa ngắn nhất"], a: 1, e: "Nghĩa nào có nhiều từ gợi ý (river, money…) trong vùng nhìn hơn thì được chọn." },
    { q: "Vì sao \"a piece of cake\" không nên dịch từng chữ?", o: ["Vì tiếng Việt không có từ \"bánh\"", "Vì đó là thành ngữ, nghĩa của cả cụm là \"rất dễ\"", "Vì câu quá dài", "Vì máy không biết từ \"piece\""], a: 1, e: "Thành ngữ phải tra cả cụm; nghĩa cả cụm khác tổng nghĩa từng chữ." },
    { q: "\"a small black cat\" dịch thành \"một con mèo đen nhỏ\" cần quy tắc gì?", o: ["Bỏ tính từ", "Đưa tính từ ra sau danh từ", "Đưa danh từ lên đầu câu", "Không cần quy tắc"], a: 1, e: "Tiếng Việt thường đặt tính từ sau danh từ, ngược với tiếng Anh." },
    { q: "Khi dùng ứng dụng dịch để làm bài tập tiếng Anh, em nên làm gì?", o: ["Chép nguyên bản dịch, máy luôn đúng", "Dùng để tham khảo, rồi tự kiểm tra thành ngữ, từ nhiều nghĩa và ngữ pháp", "Không bao giờ dùng", "Chỉ dịch từng từ một"], a: 1, e: "Máy dịch rất hữu ích nhưng vẫn có thể sai; em cần hiểu và kiểm tra lại." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  function tick() { draw(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 400);
  P.nav(); bind(); $("mtIn").value = ST.sent; run(); guide("Bấm một câu thử hoặc gõ câu của em. Sau đó <b>bấm vào một từ tiếng Anh</b> trên hình để xem máy chọn nghĩa nào, vì sao.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka37 = { ST, run, translateNew, opt };
  requestAnimationFrame(tick);
})();
