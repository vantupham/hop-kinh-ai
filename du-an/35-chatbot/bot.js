/* Hộp Kính AI · Dự án 35 · Chatbot theo luật (chuẩn hóa, từ khóa, chọn luật, câu mặc định) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-35");
  const BASE = [
    { n: "Chào hỏi", kw: ["xin chào", "chào", "hello"], a: "Chào bạn! Mình là Kính, trợ lý thư viện. Bạn cần hỏi gì?" },
    { n: "Giờ mở cửa", kw: ["mở cửa", "mấy giờ", "đóng cửa", "giờ"], a: "Thư viện mở cửa từ 7 giờ đến 17 giờ, thứ hai đến thứ sáu." },
    { n: "Mượn sách", kw: ["mượn", "mượn sách"], a: "Bạn mang thẻ học sinh đến quầy, mỗi lần được mượn tối đa 3 cuốn." },
    { n: "Hạn trả sách", kw: ["trả", "hạn", "bao lâu", "gia hạn"], a: "Bạn được mượn sách trong 14 ngày, có thể gia hạn thêm 7 ngày." },
    { n: "Mất, hỏng sách", kw: ["mất", "làm mất", "mất sách", "hỏng"], a: "Nếu làm mất hoặc hỏng sách, bạn báo cô thủ thư để đền một cuốn cùng loại." },
    { n: "Tìm sách", kw: ["tìm", "ở đâu", "kệ", "giá sách"], a: "Sách được xếp theo mã số trên giá. Bạn tra ở máy tính tại quầy hoặc hỏi cô thủ thư nhé." },
    { n: "Cảm ơn", kw: ["cảm ơn", "cám ơn"], a: "Không có gì! Chúc bạn đọc sách vui." }
  ];
  const FALLBACK = "Mình chưa hiểu câu hỏi này. Bạn hỏi cô thủ thư giúp mình nhé!";
  const TESTS = [["Chào Kính", "Chào hỏi"], ["Thư viện mở cửa lúc mấy giờ?", "Giờ mở cửa"], ["Mấy giờ thư viện đóng cửa?", "Giờ mở cửa"], ["Em muốn mượn sách thì làm thế nào?", "Mượn sách"], ["Được mượn sách trong bao lâu?", "Hạn trả sách"], ["Hạn trả sách là khi nào?", "Hạn trả sách"], ["Em lỡ làm hỏng sách rồi", "Mất, hỏng sách"], ["Sách khoa học ở kệ nào?", "Tìm sách"], ["Tìm truyện tranh ở đâu?", "Tìm sách"], ["Cảm ơn nhé", "Cảm ơn"], ["thu vien mo cua may gio", "Giờ mở cửa"], ["Thư viện có cho mượn máy tính không?", null]];
  const ST = { rules: BASE.map((r) => ({ ...r, kw: r.kw.slice() })), min: 1, strip: false, best: true, last: null, sent: 0, t: 0 };

  // ---------- xử lý chữ ----------
  const deacc = (s) => s.normalize("NFD").replace(/\p{M}/gu, "").replace(/đ/g, "d").replace(/Đ/g, "D");
  function norm(s) { let t = s.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim(); if (ST.strip) t = deacc(t); return t; }
  function match(msg) {
    const q = " " + norm(msg) + " ";
    const res = ST.rules.map((r, i) => { const hit = r.kw.filter((k) => { const kk = norm(k); return kk && q.includes(" " + kk + " "); }); return { i, r, hit, n: hit.length }; });
    const ok = res.filter((x) => x.n >= ST.min); let pick = null;
    if (ok.length) pick = ST.best ? ok.reduce((a, b) => (b.n > a.n ? b : a)) : ok[0];
    return { q: q.trim(), res, pick };
  }
  const answer = (m) => (m.pick ? m.pick.r.a : FALLBACK);
  const testScore = () => TESTS.reduce((s, [q, exp]) => { const p = match(q).pick; return s + ((exp === null ? !p || p.r.mine : p && p.r.n === exp) ? 1 : 0); }, 0);

  // ---------- giao diện ----------
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function send(msg) {
    if (!msg.trim()) return; const m = match(msg); ST.last = { msg, m }; ST.sent++; if (ST.sent >= 5) prog.done("chat");
    const log = $("log"); log.insertAdjacentHTML("beforeend", `<li class="me">${esc(msg)}</li><li class="bot${m.pick ? "" : " none"}"><span class="tag">${m.pick ? "Luật: " + esc(m.pick.r.n) : "Không khớp luật nào"}</span>${esc(answer(m))}</li>`);
    while (log.children.length > 24) log.removeChild(log.firstChild); log.scrollTop = log.scrollHeight;
    update();
  }
  function renderRules() {
    $("rules").innerHTML = ST.rules.map((r, i) => `<li class="${ST.last && ST.last.m.pick && ST.last.m.pick.i === i ? "on" : ""}"><b>${esc(r.n)}</b><span class="kws">${r.kw.map((k) => `<span class="k${ST.last && ST.last.m.res[i] && ST.last.m.res[i].hit.includes(k) ? " hit" : ""}">${esc(k)}</span>`).join("")}</span><span class="ans">→ ${esc(r.a)}</span>${r.mine ? `<button class="x" data-del="${i}" aria-label="Xóa luật ${esc(r.n)}">${HKA.icon("x")}</button>` : ""}</li>`).join("");
    $("rules").querySelectorAll("[data-del]").forEach((b) => (b.onclick = () => { ST.rules.splice(+b.dataset.del, 1); update(); }));
    $("ruleChip").textContent = ST.rules.length + " luật";
  }
  function update() {
    renderRules(); const sc = testScore(); $("bAcc").textContent = `${sc}/12`; $("bAcc").style.color = sc >= 11 ? "#5ef2d6" : sc >= 8 ? "#ffc34d" : "#ff8f6b"; if (sc >= 11) prog.done("score");
    const L = ST.last; if (L) { const m = match(L.msg); L.m = m; $("bRule").textContent = m.pick ? m.pick.r.n : "Không khớp"; $("bNorm").textContent = m.q || "(trống)"; const hits = m.res.flatMap((x) => x.hit.map((h) => [h, x.r.n])); $("bHit").innerHTML = hits.length ? hits.map(([h, n]) => `<span class="k good">${esc(h)} <i>${esc(n)}</i></span>`).join("") : '<span class="small" style="color:#c3c7f0">Không có từ khóa nào khớp</span>'; say(`Câu hỏi: <b>${esc(L.msg)}</b> → ${m.pick ? `luật <b>${esc(m.pick.r.n)}</b> (khớp ${m.pick.n} từ khóa)` : "<b>không khớp luật nào</b>, chatbot dùng câu mặc định"}.`); renderRules(); }
    else say("Gõ câu hỏi hoặc bấm một câu hỏi thử. Chatbot sẽ cho biết nó dùng luật nào.");
    renderChart();
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 40, B = 46, T = 16; ctx.clearRect(0, 0, W, H);
    const res = ST.last ? match(ST.last.msg).res : ST.rules.map((r, i) => ({ i, r, n: 0 })), mx = Math.max(3, ...res.map((x) => x.n)), bw = (W - L - 10) / res.length, Y = (v) => T + (1 - v / mx) * (H - T - B);
    ctx.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= mx; v++) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - 10, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v, 18, Y(v) + 4); }
    ctx.setLineDash([6, 4]); ctx.strokeStyle = TH.amber; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, Y(ST.min)); ctx.lineTo(W - 10, Y(ST.min)); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.amber; ctx.fillText("tối thiểu " + ST.min + " từ khóa", L + 8, Y(ST.min) - 6);
    const pick = ST.last ? match(ST.last.msg).pick : null;
    res.forEach((x, k) => { const xx = L + k * bw, on = pick && pick.i === x.i; ctx.fillStyle = on ? TH.mint : x.n ? TH.violet : TH.grid; D.rr(ctx, xx + bw * 0.18, Y(x.n), bw * 0.64, Math.max(2, H - B - Y(x.n)), 5); ctx.fill(); ctx.fillStyle = on ? TH.mint : TH.ink; ctx.font = (on ? "800 " : "600 ") + "11px Be Vietnam Pro, sans-serif"; const t = x.r.n.length > 14 ? x.r.n.slice(0, 13) + "…" : x.r.n; ctx.fillText(t, xx + bw / 2 - ctx.measureText(t).width / 2, H - 26); });
    if (!ST.last) { ctx.fillStyle = TH.text; ctx.font = "13px Be Vietnam Pro, sans-serif"; ctx.fillText("Gửi một câu hỏi để xem từng luật khớp bao nhiêu từ khóa.", L + 20, T + 30); }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Nhận câu hỏi", e: "msg", d: "Chatbot nhận một <b>xâu kí tự</b> (chuỗi chữ) em gõ vào. Nó không \"nghe\" ý nghĩa, chỉ thấy các chữ cái." },
    { t: "Chuẩn hóa", e: "wrench", d: "Đổi hết về <b>chữ thường</b>, bỏ dấu câu, bỏ khoảng trắng thừa; nếu bật thì bỏ cả <b>dấu tiếng Việt</b>. Cùng một ý gõ khác nhau sẽ trở nên giống nhau." },
    { t: "Dò từ khóa", e: "scan", d: "Với từng luật, chatbot kiểm tra câu đã chuẩn hóa có chứa <b>từ khóa</b> nào của luật đó, và đếm số từ khóa khớp." },
    { t: "Chọn luật", e: "target", d: "Luật nào khớp <b>nhiều từ khóa nhất</b> (và đạt số tối thiểu) được chọn. Nếu tắt chế độ đó, chatbot lấy <b>luật đầu tiên</b> có khớp: thứ tự luật trở nên quan trọng." },
    { t: "Trả lời", e: "send", d: "Chatbot gửi câu trả lời <b>viết sẵn</b> của luật được chọn. Không luật nào khớp thì dùng <b>câu mặc định</b>: \"Mình chưa hiểu…\"." },
    { t: "Luật hay học máy?", e: "cpu", d: "Chatbot theo luật dễ hiểu, dễ sửa nhưng chỉ biết những gì đã viết sẵn. Chatbot AI hiện đại học từ rất nhiều văn bản nên linh hoạt hơn, nhưng có thể sai mà vẫn rất tự tin." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  function chipsRow(ctx, arr, x0, y, color) { let x = x0; ctx.font = "700 13px Be Vietnam Pro, sans-serif"; arr.forEach((t) => { const w = ctx.measureText(t).width + 16; if (x + w > 620) { x = x0; y += 34; } ctx.fillStyle = color(t); D.rr(ctx, x, y, w, 26, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(t, x + 8, y + 18); x += w + 6; }); return y + 34; }
  function renderSoi() {
    const ctx = octx, s = soiStep, msg = ST.last ? ST.last.msg : "Thư viện MỞ CỬA lúc mấy giờ???", m = match(msg); D.labBg(ctx);
    lab(ctx, ST.last ? "Câu em vừa gửi" : "Câu ví dụ", 24, 32, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif"); lab(ctx, "“" + msg + "”", 24, 60, "#fff", "700 16px Be Vietnam Pro, sans-serif");
    if (s === 0) { let x = 24, y = 100; ctx.font = "700 14px JetBrains Mono, monospace"; [...msg].slice(0, 60).forEach((ch, i) => { ctx.fillStyle = "#1d2152"; ctx.fillRect(x, y, 18, 24); ctx.fillStyle = "#c3c7f0"; ctx.fillText(ch === " " ? "·" : ch, x + 4, y + 17); x += 20; if (x > 600) { x = 24; y += 30; } void i; }); lab(ctx, `${msg.length} kí tự`, 24, y + 60, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); return; }
    if (s === 1) { const lo = msg.toLowerCase(), np = lo.replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim(); [["Chữ thường", lo], ["Bỏ dấu câu", np], ["Bỏ dấu tiếng Việt" + (ST.strip ? "" : " (đang tắt)"), deacc(np)]].forEach(([t, v], i) => { lab(ctx, t, 24, 110 + i * 70, i === 2 && !ST.strip ? "#8f96d4" : "#ffc34d", "800 13px Be Vietnam Pro, sans-serif"); lab(ctx, v, 24, 136 + i * 70, i === 2 && !ST.strip ? "#6c74b8" : "#fff", "700 16px JetBrains Mono, monospace"); }); return; }
    if (s === 2 || s === 3) {
      let y = 90; m.res.forEach((x) => { const on = m.pick && m.pick.i === x.i; ctx.fillStyle = on && s === 3 ? "rgba(63,224,197,.15)" : "transparent"; ctx.fillRect(18, y - 4, 610, 40); lab(ctx, x.r.n, 24, y + 20, on && s === 3 ? "#5ef2d6" : "#c3c7f0", "800 13px Be Vietnam Pro, sans-serif"); let xx = 150; ctx.font = "600 12px Be Vietnam Pro, sans-serif"; x.r.kw.slice(0, 5).forEach((k) => { const w = ctx.measureText(k).width + 12, hit = x.hit.includes(k); ctx.fillStyle = hit ? "#3fe0c5" : "#2b2f6e"; D.rr(ctx, xx, y + 4, w, 22, 6); ctx.fill(); ctx.fillStyle = hit ? "#062b27" : "#8f96d4"; ctx.fillText(k, xx + 6, y + 19); xx += w + 5; }); lab(ctx, String(x.n), 610, y + 20, x.n ? "#ffc34d" : "#4a5088", "800 15px JetBrains Mono, monospace", "right"); y += 44; });
      if (s === 3) lab(ctx, m.pick ? `Chọn: ${m.pick.r.n} (${ST.best ? "khớp nhiều nhất" : "luật đầu tiên khớp"})` : "Không luật nào đạt số từ khóa tối thiểu", 24, Math.min(y + 24, 470), "#ffc34d", "800 15px Be Vietnam Pro, sans-serif");
      return;
    }
    if (s === 4) { ctx.fillStyle = "#5443ff"; D.rr(ctx, 260, 100, 360, 46, 14); ctx.fill(); lab(ctx, msg.length > 40 ? msg.slice(0, 40) + "…" : msg, 276, 129, "#fff", "600 14px Be Vietnam Pro, sans-serif"); const a = answer(m); ctx.fillStyle = m.pick ? "#1d4d47" : "#4d2a3a"; D.rr(ctx, 24, 170, 520, 90, 14); ctx.fill(); let line = "", y = 200; ctx.font = "600 14px Be Vietnam Pro, sans-serif"; a.split(" ").forEach((w) => { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > 480) { lab(ctx, line, 40, y, "#fff", "600 14px Be Vietnam Pro, sans-serif"); y += 22; line = w; } else line = t; }); lab(ctx, line, 40, y, "#fff", "600 14px Be Vietnam Pro, sans-serif"); lab(ctx, m.pick ? "Câu trả lời viết sẵn của luật " + m.pick.r.n : "Câu mặc định khi không hiểu", 24, 300, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif"); return; }
    [["Chatbot theo luật", "#a99dff", ["Người viết từng luật", "Biết rõ vì sao trả lời", "Dễ sửa từng chỗ", "Câu lạ thì bí hoặc sai", "Không bịa thông tin mới"]], ["Chatbot học máy", "#5ef2d6", ["Học từ rất nhiều văn bản", "Khó biết vì sao trả lời", "Trả lời linh hoạt, tự nhiên", "Hiểu được nhiều cách hỏi", "Có thể sai mà vẫn tự tin"]]].forEach(([t, c, items], k) => { const x = 24 + k * 310; ctx.fillStyle = "#1d2152"; D.rr(ctx, x, 100, 290, 260, 14); ctx.fill(); lab(ctx, t, x + 16, 132, c, "800 16px Be Vietnam Pro, sans-serif"); items.forEach((it, i) => lab(ctx, "• " + it, x + 16, 168 + i * 36, "#fff", "600 13px Be Vietnam Pro, sans-serif")); });
    void chipsRow;
  }
  function soiLive() { const el = $("soiLive"), m = ST.last ? match(ST.last.msg) : null; el.innerHTML = m ? `Luật chọn: <span class="hl">${m.pick ? m.pick.r.n : "không có"}</span>` : `Chatbot có <span class="hl">${ST.rules.length}</span> luật`; }

  // ---------- điều khiển ----------
  function bind() {
    $("chatForm").addEventListener("submit", (e) => { e.preventDefault(); const v = $("msgIn").value; $("msgIn").value = ""; send(v); });
    $("tests").innerHTML = TESTS.map(([q]) => `<button class="btn small ghost" type="button">${esc(q)}</button>`).join("");
    $("tests").querySelectorAll("button").forEach((b, i) => (b.onclick = () => send(TESTS[i][0])));
    $("addForm").addEventListener("submit", (e) => { e.preventDefault(); const kw = $("newKw").value.split(",").map((s) => s.trim()).filter(Boolean), a = $("newAns").value.trim(); if (!kw.length || !a) { guide("Hãy nhập ít nhất một từ khóa và một câu trả lời."); return; } ST.rules.push({ n: "Luật của em: " + kw[0], kw, a, mine: true }); $("newKw").value = ""; $("newAns").value = ""; prog.done("rule"); update(); guide(`Đã thêm luật mới với ${kw.length} từ khóa. Gửi lại câu hỏi để thử nhé!`); });
    const setMin = P.range("min", () => ST.min, (v) => (ST.min = v), (v) => v + " từ", update);
    $("optStrip").onchange = (e) => { ST.strip = e.target.checked; update(); };
    $("optBest").onchange = (e) => { ST.best = e.target.checked; update(); };
    const clear = () => { ST.rules = BASE.map((r) => ({ ...r, kw: r.kw.slice() })); ST.min = 1; setMin(); ST.strip = false; $("optStrip").checked = false; ST.best = true; $("optBest").checked = true; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "strange") { send("Thư viện có cho mượn máy tính không?"); guide("Chatbot thấy chữ \"mượn\" nên trả lời về <b>mượn sách</b>! Thêm một luật mới: từ khóa <b>máy tính, mượn máy tính</b>, câu trả lời tùy em, rồi hỏi lại."); }
      if (k === "noacc") { send("thu vien mo cua may gio"); guide("Câu không dấu không khớp từ khóa nào. Bật <b>Bỏ dấu tiếng Việt khi so</b> rồi gửi lại câu đó."); }
      if (k === "overlap") { ST.best = false; $("optBest").checked = false; send("Em làm mất sách thì phải trả bao nhiêu tiền?"); guide("Đang chọn <b>luật đầu tiên khớp</b>: chatbot trả lời về hạn trả sách. Bật <b>Chọn luật khớp nhiều từ khóa nhất</b> rồi gửi lại."); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); update(); guide("Mọi sự cố đã tắt, bộ luật trở lại 7 luật ban đầu."); };
  }

  const QUIZ = [
    { q: "Chatbot theo luật chọn câu trả lời dựa vào đâu?", o: ["Hiểu ý nghĩa của câu hỏi", "Từ khóa có trong câu hỏi khớp với luật nào", "Đoán ngẫu nhiên", "Hỏi người khác"], a: 1, e: "Nó dò từ khóa trong câu hỏi đã chuẩn hóa và chọn luật khớp nhất." },
    { q: "Vì sao cần chuẩn hóa câu hỏi (chữ thường, bỏ dấu câu…) trước khi so?", o: ["Để câu đẹp hơn", "Để những cách gõ khác nhau của cùng một ý vẫn khớp được từ khóa", "Để câu ngắn đi", "Không cần thiết"], a: 1, e: "\"MỞ CỬA???\" và \"mở cửa\" sau khi chuẩn hóa đều thành \"mở cửa\"." },
    { q: "Câu \"Thư viện có cho mượn máy tính không?\" bị trả lời về mượn sách. Cách sửa hợp lý nhất?", o: ["Xóa hết các luật", "Thêm luật mới có từ khóa \"máy tính\" với câu trả lời phù hợp", "Tắt chatbot", "Bỏ từ \"mượn\" khỏi tiếng Việt"], a: 1, e: "Chatbot theo luật chỉ biết những gì đã viết sẵn, nên cần bổ sung luật." },
    { q: "Điểm khác quan trọng giữa chatbot theo luật và chatbot AI học từ dữ liệu là gì?", o: ["Chatbot luật luôn thông minh hơn", "Chatbot luật dễ biết vì sao trả lời nhưng chỉ biết điều đã viết sẵn; chatbot AI linh hoạt hơn nhưng có thể sai mà vẫn tự tin", "Chatbot AI không bao giờ sai", "Hai loại giống hệt nhau"], a: 1, e: "Mỗi loại có điểm mạnh, điểm yếu; với cả hai, em vẫn cần kiểm tra lại thông tin quan trọng." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); $("log").innerHTML = `<li class="bot"><span class="tag">Kính</span>Chào bạn! Mình là Kính, trợ lý thư viện. Bạn cần hỏi gì?</li>`; update(); guide("Gõ một câu hỏi về thư viện, hoặc bấm các câu hỏi thử bên dưới. Xem chatbot chọn <b>luật</b> nào và vì sao.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka35 = { ST, match, testScore, send };
  requestAnimationFrame(tick);
})();
