/* Hộp Kính AI · Dự án 20 · Trợ lý lớp học của em (sơ đồ khối, tự đánh giá 4 tiêu chí, phá máy) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, T = window.TL40;
  const prog = P.progress("hka-40");
  const ST = { priv: true, conf: true, th: 0.4, balance: true, q: T.TESTS[2][0], R: null, E: null, asked: new Set(), anim: 0, boxes: [], t: 0 };
  const opt = () => ({ priv: ST.priv, conf: ST.conf, th: ST.th, balance: ST.balance });
  const pct = (v) => Math.round(v * 100) + "%";
  const f2 = (v) => v.toFixed(2).replace(".", ",");
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function run(newQ) { ST.R = T.ask(ST.q, opt()); ST.E = T.evaluate(opt()); if (newQ) ST.anim = 0; panel(); }
  function askQ(q) { if (!q.trim()) return; ST.q = q.trim(); ST.asked.add(q.trim().toLowerCase()); if (ST.asked.size >= 6) prog.done("ask"); run(true); }

  // ---------- sơ đồ khối ----------
  const cv = $("stage"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height;
  const BX = [14, 186, 358, 530, 702], BW = 160, BY = 72, BH = 136;
  function wrap(t, x, y, maxW, lh, maxL) { const words = t.split(" "); let line = "", n = 0; for (const w of words) { const s = line ? line + " " + w : w; if (ctx.measureText(s).width > maxW && line) { ctx.fillText(line, x, y + n * lh); n++; line = w; if (n >= maxL) return; } else line = s; } if (n < maxL) ctx.fillText(line, x, y + n * lh); }
  function box(k, title, lines, state, sw) {
    const x = BX[k], active = ST.anim * 5.2 >= k, dim = state === "skip";
    ctx.globalAlpha = dim ? 0.35 : 1;
    ctx.fillStyle = state === "off" ? "#181b3d" : state === "bad" ? "#4d2033" : active ? "#262c6e" : "#1d2152"; D.rr(ctx, x, BY, BW, BH, 14); ctx.fill();
    ctx.strokeStyle = state === "off" ? "#4a5088" : state === "bad" ? "#ff7d5f" : active ? "#8f86ff" : "#353b80"; ctx.lineWidth = 2; if (state === "off") ctx.setLineDash([6, 5]); D.rr(ctx, x, BY, BW, BH, 14); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = "#fff"; ctx.font = "800 13px Be Vietnam Pro, sans-serif"; ctx.fillText(title, x + 12, BY + 24);
    if (sw != null) { const on = sw; ctx.fillStyle = on ? "#3fe0c5" : "#4a5088"; D.rr(ctx, x + BW - 46, BY + 10, 36, 20, 10); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + BW - (on ? 20 : 36), BY + 20, 7, 0, 7); ctx.fill(); ST.boxes.push({ k, x, y: BY, w: BW, h: BH }); }
    ctx.font = "600 12px Be Vietnam Pro, sans-serif"; lines.forEach((l, i) => { ctx.fillStyle = l[1] || "#c3c7f0"; wrap(l[0], x + 12, BY + 50 + i * 36, BW - 22, 15, 2); });
    ctx.globalAlpha = 1;
  }
  function draw() {
    const R = ST.R; if (!R) return; ST.boxes = [];
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#14183d"); g.addColorStop(1, "#1b2050"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.font = "700 15px Be Vietnam Pro, sans-serif"; const qw = Math.min(W - 40, ctx.measureText(R.q).width + 30); ctx.fillStyle = "#5443ff"; D.rr(ctx, 14, 16, qw, 36, 18); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(R.q, 29, 40);
    for (let k = 0; k < 4; k++) D.arrow(ctx, { x: BX[k] + BW + 1, y: BY + BH / 2 }, { x: BX[k + 1] - 2, y: BY + BH / 2 }, "#4a5088", 2);
    const grp = R.action === "grp", e = R.entry;
    box(0, "1 · Hiểu câu hỏi", [[R.tk.slice(0, 5).join(" · ") || "(không có từ)", "#fff"], [grp ? "Ý định: chia nhóm" : `${R.tk.length} từ quan trọng`]], "on");
    box(1, "2 · Tra sổ tay lớp", grp ? [["Không cần tra", "#8f96d4"]] : [[e.t, e.priv ? "#ffc34d" : "#fff"], [`khớp ${R.scores[R.best]} từ`]], "on");
    box(2, "3 · Lọc riêng tư", grp ? [["Bỏ qua"]] : !ST.priv ? [["ĐANG TẮT", "#ff8f6b"], [e.priv ? "Thông tin riêng lọt qua!" : "Cho qua"]] : [[e.priv ? "Thông tin riêng" : "Thông tin chung", e.priv ? "#ffc34d" : "#5ef2d6"], [e.priv ? "→ chặn lại" : "→ cho qua"]], grp ? "skip" : !ST.priv ? (e.priv ? "bad" : "off") : "on", ST.priv);
    const blocked = R.action === "block";
    box(3, "4 · Đủ tự tin?", grp || blocked ? [["Bỏ qua"]] : !ST.conf ? [["ĐANG TẮT", "#ff8f6b"], ["Luôn trả lời"]] : [[`tự tin ${f2(R.conf)}`, "#fff"], [R.conf >= ST.th ? `≥ ${f2(ST.th)} → trả lời` : `< ${f2(ST.th)} → chuyển cô`]], grp || blocked ? "skip" : !ST.conf ? "off" : "on", ST.conf);
    const out = { ans: ["Trả lời", "#5ef2d6"], block: ["Từ chối lịch sự", "#ffc34d"], fwd: ["Chuyển cô chủ nhiệm", "#a99dff"], leak: ["LỘ THÔNG TIN RIÊNG", "#ff8f6b"], grp: ["Chia 4 nhóm", "#5ef2d6"] }[R.action];
    box(4, "5 · Phản hồi", [[out[0], out[1]]], R.action === "leak" ? "bad" : "on");
    // tia chạy qua các khối
    const px = 14 + Math.min(1, ST.anim) * (BX[4] + BW - 14); ctx.fillStyle = "#ffe14d"; ctx.beginPath(); ctx.arc(px, BY + BH + 12, 6, 0, 7); ctx.fill();
    // vùng dưới
    const y0 = 238;
    if (grp) {
      const G = R.groups; ctx.fillStyle = "#c3c7f0"; ctx.font = "800 13px Be Vietnam Pro, sans-serif"; ctx.fillText(ST.balance ? "Chia nhóm cân bằng: BẬT" : "Chia nhóm cân bằng: TẮT (chia theo thứ tự điểm)", 18, y0 + 4);
      ctx.fillStyle = ST.balance ? "#3fe0c5" : "#4a5088"; D.rr(ctx, 400, y0 - 11, 36, 20, 10); ctx.fill(); ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ST.balance ? 426 : 410, y0 - 1, 7, 0, 7); ctx.fill(); ST.boxes.push({ k: 5, x: 14, y: y0 - 16, w: 440, h: 28 });
      G.G.forEach((g2, k) => { const x = 14 + k * 216, y = y0 + 18; ctx.fillStyle = "#1d2152"; D.rr(ctx, x, y, 204, 172, 12); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "800 13px Be Vietnam Pro, sans-serif"; ctx.fillText(`Nhóm ${k + 1}`, x + 12, y + 22); ctx.font = "600 12px Be Vietnam Pro, sans-serif"; ctx.fillStyle = "#c3c7f0"; ctx.fillText(g2.map((p) => p.n).slice(0, 3).join(", "), x + 12, y + 46); ctx.fillText(g2.map((p) => p.n).slice(3).join(", "), x + 12, y + 64);
        const a = G.avg[k]; ctx.fillStyle = "#8f96d4"; ctx.fillText("sức học trung bình", x + 12, y + 96); ctx.fillStyle = "#2b2f6e"; ctx.fillRect(x + 12, y + 106, 180, 14); ctx.fillStyle = Math.abs(a - 7.3) > 0.8 ? "#ff7d5f" : "#3fe0c5"; ctx.fillRect(x + 12, y + 106, ((a - 5) / 5) * 180, 14); ctx.fillStyle = "#fff"; ctx.font = "800 14px JetBrains Mono, monospace"; ctx.fillText(a.toFixed(1).replace(".", ","), x + 12, y + 148); });
      ctx.fillStyle = G.diff < 0.5 ? "#5ef2d6" : "#ff8f6b"; ctx.font = "800 12px Be Vietnam Pro, sans-serif"; ctx.fillText(`chênh lệch giữa nhóm mạnh nhất và yếu nhất: ${G.diff.toFixed(1).replace(".", ",")} điểm (điểm trong bảng điểm riêng, trợ lý không hiển thị cho cả lớp)`, 18, H - 12);
    } else {
      const col = { ans: "#10372f", block: "#4a3a10", fwd: "#2b2560", leak: "#5a2030" }[R.action]; ctx.fillStyle = col; D.rr(ctx, 14, y0, W - 28, 120, 16); ctx.fill();
      ctx.fillStyle = "#8f96d4"; ctx.font = "700 11px JetBrains Mono, monospace"; ctx.fillText("TRỢ LÝ TRẢ LỜI", 32, y0 + 24); ctx.fillStyle = "#fff"; ctx.font = "600 16px Be Vietnam Pro, sans-serif"; wrap(R.text, 32, y0 + 52, W - 70, 24, 3);
      ctx.fillStyle = "#8f96d4"; ctx.font = "600 12px Be Vietnam Pro, sans-serif"; ctx.fillText("Bấm vào khối có công tắc (khối 3, 4) để bật hoặc tắt.", 18, H - 16);
    }
  }
  cv.addEventListener("pointerdown", (e) => {
    const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * H;
    const b = ST.boxes.find((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h); if (!b) return;
    if (b.k === 2) ST.priv = !ST.priv; if (b.k === 3) ST.conf = !ST.conf; if (b.k === 5) ST.balance = !ST.balance;
    sync(); prog.done("module"); run(false);
    guide(b.k === 2 ? `Khối lọc riêng tư đã <b>${ST.priv ? "bật" : "tắt"}</b>. Xem cột <b>Riêng tư</b> trên bảng tự đánh giá.` : b.k === 3 ? `Khối kiểm tra độ tự tin đã <b>${ST.conf ? "bật" : "tắt"}</b>. Xem cột <b>Trung thực</b>.` : `Chia nhóm cân bằng đã <b>${ST.balance ? "bật" : "tắt"}</b>. Xem cột <b>Công bằng</b>.`);
  });
  function sync() { $("optPriv").checked = ST.priv; $("optConf").checked = ST.conf; $("optBal").checked = ST.balance; }

  // ---------- bảng ----------
  function panel() {
    const E = ST.E, R = ST.R;
    [["sHelp", E.helpful], ["sHonest", E.honest], ["sPriv", E.privacy], ["sFair", E.fair]].forEach(([id, v]) => { $(id).textContent = pct(v); $(id).style.color = v >= 0.9 ? "#5ef2d6" : v >= 0.6 ? "#ffc34d" : "#ff8f6b"; });
    if ([E.helpful, E.honest, E.privacy, E.fair].every((v) => v >= 0.9)) prog.done("score");
    $("bAns").textContent = R.action === "grp" ? R.text + " " + R.groups.G.map((g, k) => `Nhóm ${k + 1}: ${g.map((p) => p.n).join(", ")}.`).join(" ") : R.text;
    $("bTests").innerHTML = E.res.map((x, i) => `<span class="${x.ok ? "ok" : "bad"}" title="${esc(x.q)}">${i + 1}</span>`).join("");
    const kind = { ans: "trả lời từ sổ tay", block: "từ chối vì là thông tin riêng", fwd: "chuyển cho cô chủ nhiệm", leak: "làm lộ thông tin riêng của bạn", grp: "chia nhóm" }[R.action];
    const tst = E.res.find((x) => x.q === ST.q);
    say(`Trợ lý <b>${kind}</b>.` + (tst ? (tst.ok ? ' <span style="color:var(--mint)">Đúng như mong đợi.</span>' : ' <span style="color:var(--coral)">Chưa đúng như mong đợi.</span>') : ""));
    document.querySelectorAll("#tests button").forEach((b, i) => { b.classList.toggle("ok", E.res[i].ok); b.classList.toggle("bad", !E.res[i].ok); });
    renderChart();
  }
  function renderChart() {
    const c = $("chart"), x = c.getContext("2d"), CW = c.width, CH = c.height, TH = P.TH, L = 50, B = 34, Tt = 16, E = ST.E; x.clearRect(0, 0, CW, CH);
    const Y = (v) => Tt + (1 - v) * (CH - Tt - B); x.font = "11px JetBrains Mono, monospace";
    for (const v of [0, 0.25, 0.5, 0.75, 1]) { x.strokeStyle = TH.grid; x.beginPath(); x.moveTo(L, Y(v)); x.lineTo(CW - 10, Y(v)); x.stroke(); x.fillStyle = TH.text; x.fillText(Math.round(v * 100) + "%", 8, Y(v) + 4); }
    x.setLineDash([6, 4]); x.strokeStyle = TH.mint; x.lineWidth = 2; x.beginPath(); x.moveTo(L, Y(0.9)); x.lineTo(CW - 10, Y(0.9)); x.stroke(); x.setLineDash([]);
    const items = [["Hữu ích", E.helpful, "12 câu kiểm thử xử lí đúng"], ["Trung thực", E.honest, "không trả lời bừa câu chưa biết"], ["Riêng tư", E.privacy, "không lộ thông tin của bạn"], ["Công bằng", E.fair, "các nhóm cân bằng sức học"]], bw = (CW - L - 40) / 4;
    items.forEach(([n, v, d], k) => { const xx = L + 20 + k * bw, w = bw * 0.55; x.fillStyle = v >= 0.9 ? TH.mint : v >= 0.6 ? TH.amber : TH.coral; D.rr(x, xx, Y(v), w, Math.max(2, CH - B - Y(v)), 6); x.fill(); x.fillStyle = TH.ink; x.font = "800 14px JetBrains Mono, monospace"; x.fillText(pct(v), xx + w + 8, Y(v) + 14); x.font = "800 13px Be Vietnam Pro, sans-serif"; x.fillText(n, xx, CH - 16); x.font = "11px Be Vietnam Pro, sans-serif"; x.fillStyle = TH.text; x.fillText(d, xx, CH - 2); });
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ghép khối", e: "blocks", d: "Trợ lý gồm 5 khối nối nhau. Mỗi khối là một điều em đã học ở các dự án trước, có thể kiểm thử và sửa riêng." },
    { t: "Hiểu câu hỏi", e: "msg", d: "Bỏ dấu, chữ thường, bỏ <b>từ thừa</b> (có, là, của, không…), giữ lại <b>từ quan trọng</b>. Giống chatbot theo luật ở Dự án 15." },
    { t: "Tra sổ tay lớp", e: "book", d: "So từ quan trọng với từ khóa của từng đoạn trong <b>sổ tay lớp</b>, đoạn khớp nhiều nhất được chọn. Giống trợ lý hỏi đáp ở Dự án 40." },
    { t: "Lọc riêng tư", e: "lock", d: "Đoạn nào đánh dấu <b>riêng tư</b> (danh bạ, bảng điểm) thì không bao giờ được đọc ra cho người hỏi." },
    { t: "Biết nói không biết", e: "help", d: "Tính <b>độ tự tin</b>. Dưới ngưỡng thì không đoán bừa mà chuyển cho người thật. Giống ngưỡng ở Dự án 5." },
    { t: "Tự đánh giá", e: "award", d: "Chấm trợ lý bằng bộ câu kiểm thử theo 4 tiêu chí: <b>hữu ích, trung thực, riêng tư, công bằng</b>. Rồi xin góp ý của các bạn và thầy cô trước khi dùng thật." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), sx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lb = (t, x, y, c, f) => { sx.fillStyle = c || "#c3c7f0"; sx.font = f || "700 12px Be Vietnam Pro, sans-serif"; sx.fillText(t, x, y); };
  function renderSoi() {
    const s = soiStep, E = ST.E; let R = ST.R; if (!R) return; if (R.action === "grp" && s >= 2 && s <= 4) R = T.ask(T.TESTS[s === 3 ? 6 : s === 4 ? 10 : 0][0], opt()); D.labBg(sx);
    if (s === 0) { [["1 · Hiểu câu hỏi", "Dự án 15: chatbot theo luật"], ["2 · Tra sổ tay lớp", "Dự án 40: hỏi đáp tìm đoạn văn"], ["3 · Lọc riêng tư", "Dự án 5, 18: an toàn và công bằng"], ["4 · Biết nói không biết", "Dự án 5: ngưỡng"], ["5 · Chia nhóm công bằng", "Dự án 18: kiểm tra thiên vị"]].forEach(([a, b], i) => { sx.fillStyle = "#1d2152"; D.rr(sx, 24, 30 + i * 84, 592, 64, 12); sx.fill(); lb(a, 44, 60 + i * 84, "#fff", "800 15px Be Vietnam Pro, sans-serif"); lb("học ở " + b, 44, 82 + i * 84, "#a99dff", "600 13px Be Vietnam Pro, sans-serif"); }); return; }
    lb(R.q, 24, 34, "#fff", "700 15px Be Vietnam Pro, sans-serif");
    if (s === 1) { const all = R.q.split(/\s+/); let x = 24, y = 70; sx.font = "700 14px Be Vietnam Pro, sans-serif"; all.forEach((w) => { const keep = T.tokens(w).length > 0, ww = sx.measureText(w).width + 16; if (x + ww > 620) { x = 24; y += 40; } sx.fillStyle = keep ? "#5443ff" : "#2b2f6e"; D.rr(sx, x, y, ww, 28, 7); sx.fill(); sx.fillStyle = keep ? "#fff" : "#6c74b8"; sx.fillText(w, x + 8, y + 19); if (!keep) { sx.strokeStyle = "#ff7d5f"; sx.lineWidth = 2; sx.beginPath(); sx.moveTo(x + 4, y + 14); sx.lineTo(x + ww - 4, y + 14); sx.stroke(); } x += ww + 6; }); lb("Từ quan trọng: " + (R.tk.join(", ") || "(không có)"), 24, y + 70, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif"); return; }
    if (s === 2) { if (R.action === "grp") { lb("Câu này là yêu cầu chia nhóm, không cần tra sổ tay.", 24, 80, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif"); return; } T.NOTE.forEach((n, i) => { const y = 60 + i * 46, v = R.scores[i], on = i === R.best; lb(n.t, 24, y + 18, n.priv ? "#ffc34d" : "#fff", (on ? "800 " : "600 ") + "13px Be Vietnam Pro, sans-serif"); sx.fillStyle = on ? "#3fe0c5" : "#4a5088"; sx.fillRect(250, y + 4, Math.max(3, v * 60), 20); lb(String(v), 260 + v * 60, y + 19, "#fff", "700 13px JetBrains Mono, monospace"); }); return; }
    if (s === 3) { const e = R.entry; if (!e) { lb("Câu này là yêu cầu chia nhóm.", 24, 80, "#ffc34d"); return; } lb(`Đoạn được chọn: ${e.t}`, 24, 80, "#fff", "800 15px Be Vietnam Pro, sans-serif"); lb(e.priv ? "Đoạn này được đánh dấu RIÊNG TƯ" : "Đoạn này là thông tin chung của lớp", 24, 112, e.priv ? "#ffc34d" : "#5ef2d6", "800 14px Be Vietnam Pro, sans-serif"); lb(!e.priv ? "→ cho qua" : ST.priv ? "→ chặn lại, trả lời từ chối lịch sự" : "→ khối lọc đang TẮT: thông tin riêng bị lộ!", 24, 144, !e.priv || ST.priv ? "#c3c7f0" : "#ff8f6b", "700 14px Be Vietnam Pro, sans-serif"); lb("Quy tắc: không đọc ra số điện thoại, địa chỉ, điểm số,", 24, 220, "#8f96d4"); lb("hay so sánh, xếp hạng các bạn với nhau.", 24, 240, "#8f96d4"); return; }
    if (s === 4) { if (R.action === "grp" || R.action === "block") { lb("Câu này không cần kiểm tra độ tự tin.", 24, 80, "#ffc34d"); return; } lb(`Độ tự tin = ${R.scores[R.best]} từ khớp ÷ ${Math.max(2, R.tk.length)} = ${f2(R.conf)}`, 24, 80, "#fff", "800 15px Be Vietnam Pro, sans-serif"); sx.fillStyle = "#2b2f6e"; sx.fillRect(24, 110, 560, 26); sx.fillStyle = R.conf >= ST.th ? "#3fe0c5" : "#ff7d5f"; sx.fillRect(24, 110, R.conf * 560, 26); sx.strokeStyle = "#ffc34d"; sx.lineWidth = 3; sx.beginPath(); sx.moveTo(24 + ST.th * 560, 100); sx.lineTo(24 + ST.th * 560, 146); sx.stroke(); lb(`ngưỡng ${f2(ST.th)}${ST.conf ? "" : " (khối đang tắt)"}`, 24 + ST.th * 560 - 30, 166, "#ffc34d"); lb(R.action === "fwd" ? "Dưới ngưỡng → chuyển cho cô chủ nhiệm" : "Trả lời", 24, 210, "#c3c7f0", "700 14px Be Vietnam Pro, sans-serif"); return; }
    [["Hữu ích", E.helpful], ["Trung thực", E.honest], ["Riêng tư", E.privacy], ["Công bằng", E.fair]].forEach(([n, v], i) => { const y = 70 + i * 64; lb(n, 24, y + 20, "#fff", "800 15px Be Vietnam Pro, sans-serif"); sx.fillStyle = "#2b2f6e"; sx.fillRect(160, y, 400, 28); sx.fillStyle = v >= 0.9 ? "#3fe0c5" : v >= 0.6 ? "#ffc34d" : "#ff7d5f"; sx.fillRect(160, y, v * 400, 28); lb(pct(v), 570, y + 20, "#fff", "800 14px JetBrains Mono, monospace"); }); lb("Đạt cả bốn → dùng thử → xin góp ý → sửa", 24, 360, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif");
  }
  function soiLive() { const E = ST.E; $("soiLive").innerHTML = E ? `Hữu ích <span class="hl">${pct(E.helpful)}</span> · Riêng tư <span class="hl">${pct(E.privacy)}</span>` : ""; }

  // ---------- điều khiển ----------
  function bind() {
    $("askForm").addEventListener("submit", (e) => { e.preventDefault(); askQ($("askIn").value); });
    $("tests").innerHTML = T.TESTS.map(([q]) => `<button class="btn small ghost" type="button">${esc(q)}</button>`).join("");
    $("tests").querySelectorAll("button").forEach((b, i) => (b.onclick = () => { $("askIn").value = T.TESTS[i][0]; askQ(T.TESTS[i][0]); }));
    const setTh = P.range("th", () => ST.th, (v) => (ST.th = v), f2, () => run(false));
    $("optPriv").onchange = (e) => { ST.priv = e.target.checked; prog.done("module"); run(false); };
    $("optConf").onchange = (e) => { ST.conf = e.target.checked; prog.done("module"); run(false); };
    $("optBal").onchange = (e) => { ST.balance = e.target.checked; prog.done("module"); run(false); };
    const clear = () => { Object.assign(ST, { priv: true, conf: true, th: 0.4, balance: true }); setTh(); sync(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "privacy") { ST.priv = false; sync(); askQ(T.TESTS[6][0]); guide("Khối lọc riêng tư đã tắt: trợ lý đọc luôn số điện thoại và địa chỉ của bạn Nam (số hư cấu). Bấm vào <b>khối 3</b> trên sơ đồ để bật lại."); }
      if (k === "unsure") { ST.th = 0; setTh(); askQ(T.TESTS[10][0]); guide("Ngưỡng tự tin bằng 0: trợ lý trả lời bằng thời khóa biểu cho câu hỏi về bể bơi. Kéo <b>ngưỡng tự tin</b> lên khoảng 0,40."); }
      if (k === "fair") { ST.balance = false; sync(); askQ(T.TESTS[11][0]); guide("Chia theo thứ tự điểm: các nhóm chênh nhau gần 3 điểm. Bấm công tắc <b>Chia nhóm cân bằng</b> trên sơ đồ."); }
      $("askIn").value = ST.q; $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); run(false); guide("Mọi sự cố đã tắt: lọc riêng tư bật, ngưỡng tự tin 0,40, chia nhóm cân bằng."); };
  }

  const QUIZ = [
    { q: "Trợ lý đọc được bảng điểm của lớp. Khi có người hỏi điểm của một bạn, trợ lý nên làm gì?", o: ["Trả lời ngay cho nhanh", "Từ chối lịch sự vì đó là thông tin riêng", "Trả lời nhưng làm tròn điểm", "Đọc điểm của cả lớp"], a: 1, e: "Đọc được dữ liệu không có nghĩa là được tiết lộ." },
    { q: "Vì sao trợ lý cần ngưỡng tự tin?", o: ["Để trả lời chậm hơn", "Để không đoán bừa khi sổ tay không có thông tin, mà chuyển cho người thật", "Để từ chối mọi câu hỏi", "Để tiết kiệm điện"], a: 1, e: "Trợ lý trung thực biết nói \"mình không biết\"." },
    { q: "Ngưỡng tự tin đặt quá cao (ví dụ 0,9) thì điều gì xảy ra?", o: ["Trợ lý trả lời bừa nhiều hơn", "Trợ lý chuyển cả những câu nó trả lời được, nên kém hữu ích", "Không thay đổi gì", "Trợ lý làm lộ thông tin"], a: 1, e: "Phải cân bằng: hữu ích và trung thực đều quan trọng." },
    { q: "Trước khi giao trợ lý cho cả lớp, việc nào quan trọng nhất?", o: ["Đổi màu giao diện", "Kiểm thử bằng nhiều câu hỏi theo các tiêu chí hữu ích, trung thực, riêng tư, công bằng và xin góp ý", "Thêm thật nhiều dữ liệu cá nhân", "Không cần kiểm tra"], a: 1, e: "Đó là cách các nhóm làm AI có trách nhiệm vẫn làm." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; ST.anim = Math.min(1.2, ST.anim + dt / 1.4); draw(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 400);
  P.nav(); bind(); $("askIn").value = ST.q; run(true); guide("Hỏi trợ lý một câu, xem câu hỏi đi qua từng khối trên sơ đồ. <b>Bấm vào khối có công tắc</b> để bật, tắt và xem bảng tự đánh giá thay đổi.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka40 = { ST, run, askQ };
  requestAnimationFrame(tick);
})();
