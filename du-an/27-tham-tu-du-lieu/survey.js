/* Hộp Kính AI · Dự án 27 · Thám tử dữ liệu lớp học (tổng thể, mẫu, mẫu lệch, máy học từ dữ liệu lệch) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-27");
  const SP = [{ n: "Bóng đá", c: "#3fe0c5" }, { n: "Cầu lông", c: "#a99dff" }, { n: "Bơi lội", c: "#5aa9ff" }, { n: "Cờ vua", c: "#ffc34d" }, { n: "Nhảy dây", c: "#ff7d5f" }];
  const ZONES = [
    { id: "san", n: "Sân bóng", x: 20, y: 20, w: 300, h: 250, k: 90, mix: [0.7, 0.08, 0.1, 0.04, 0.08], bg: "#1f4d3b" },
    { id: "cl", n: "Sân cầu lông", x: 340, y: 20, w: 200, h: 160, k: 80, mix: [0.06, 0.74, 0.08, 0.04, 0.08], bg: "#2c2f6e" },
    { id: "tv", n: "Thư viện", x: 560, y: 20, w: 140, h: 160, k: 60, mix: [0.06, 0.12, 0.16, 0.52, 0.14], bg: "#3a2f55" },
    { id: "ct", n: "Căng tin", x: 720, y: 20, w: 140, h: 200, k: 110, mix: [0.2, 0.26, 0.2, 0.14, 0.2], bg: "#4a3a2a" },
    { id: "lop", n: "Hành lang các lớp", x: 340, y: 200, w: 360, h: 220, k: 110, mix: [0.18, 0.26, 0.22, 0.16, 0.18], bg: "#23285c" },
    { id: "ve", n: "Ghế đá", x: 20, y: 290, w: 300, h: 130, k: 30, mix: [0.16, 0.26, 0.2, 0.14, 0.24], bg: "#2a3a4a" }
  ];
  // 480 học sinh, mỗi bạn thuộc một lớp (12 lớp) và đang ở một khu giờ ra chơi
  const POP = (() => {
    const r = P.rng(27), o = []; let id = 0;
    ZONES.forEach((z) => { for (let i = 0; i < z.k; i++) { let u = r(), s = 0; while (s < 4 && u > z.mix[s]) { u -= z.mix[s]; s++; } o.push({ id: id++, z: z.id, x: z.x + 12 + r() * (z.w - 24), y: z.y + 26 + r() * (z.h - 36), s, cls: Math.floor(r() * 12), team: false, a: null }); } });
    // lớp 7A (cls 4) có nhiều bạn mê cầu lông: một lớp không đại diện cho cả trường
    o.filter((p) => p.cls === 4).forEach((p, i) => { if (i % 3 !== 2) p.s = 1; });
    const fans = o.filter((p) => p.z === "san" && p.s === 0); for (let i = 0; i < 20 && i < fans.length; i++) fans[i].team = true;
    return o;
  })();
  const CLASSES = ["6A", "6B", "6C", "7A", "7B", "7C", "8A", "8B", "8C", "9A", "9B", "9C"];
  const TRUTH = SP.map((_, i) => POP.filter((p) => p.s === i).length / POP.length);
  const ST = { n: 30, lead: false, reveal: false, from: new Set(), clicks: 0, t: 0, hover: -1, flash: [] };

  const asked = () => POP.filter((p) => p.a != null);
  function ask(p, how) {
    if (p.a != null) return; p.a = ST.lead && p.s !== 0 && Math.random() < 0.4 ? 0 : p.s; p.how = how; ST.from.add(how); ST.flash.push({ p, t: ST.t });
  }
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function askGroup(list, how) { shuffle(list.filter((p) => p.a == null)).slice(0, ST.n).forEach((p) => ask(p, how)); update(); }
  const share = () => { const A = asked(), c = SP.map((_, i) => A.filter((p) => p.a === i).length); return { c, n: A.length, f: c.map((v) => (A.length ? v / A.length : 0)) }; };
  const err = (f) => Math.round(f.reduce((s, v, i) => s + Math.abs(v - TRUTH[i]), 0) * 50);

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  function renderStage() {
    const ctx = sctx; D.labBg(ctx);
    ZONES.forEach((z) => { ctx.fillStyle = z.bg; D.rr(ctx, z.x, z.y, z.w, z.h, 12); ctx.fill(); lab(ctx, z.n, z.x + 10, z.y + 18, "#e8eaff", "700 12px Be Vietnam Pro, sans-serif"); });
    const sb = ZONES[0]; ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.lineWidth = 2; ctx.strokeRect(sb.x + 20, sb.y + 30, sb.w - 40, sb.h - 45); ctx.beginPath(); ctx.arc(sb.x + sb.w / 2, sb.y + 30 + (sb.h - 45) / 2, 26, 0, 7); ctx.stroke();
    POP.forEach((p) => {
      const on = p.a != null; ctx.fillStyle = on ? SP[p.a].c : "#6b72a8"; ctx.globalAlpha = on ? 1 : 0.55; ctx.beginPath(); ctx.arc(p.x, p.y, on ? 5.5 : 4, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
      if (p.team) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2; ctx.stroke(); }
      if (ST.reveal && !on) { ctx.fillStyle = SP[p.s].c; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 7); ctx.fill(); ctx.globalAlpha = 1; }
    });
    ST.flash = ST.flash.filter((f) => ST.t - f.t < 0.6); ST.flash.forEach((f) => { const k = (ST.t - f.t) / 0.6; ctx.strokeStyle = `rgba(255,195,77,${1 - k})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(f.p.x, f.p.y, 6 + k * 14, 0, 7); ctx.stroke(); });
    if (ST.hover >= 0) { const p = POP[ST.hover]; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, 7); ctx.stroke(); const t = `Lớp ${CLASSES[p.cls]}${p.team ? " · đội bóng" : ""}${p.a != null ? " · " + SP[p.a].n : ""}`; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; const w = ctx.measureText(t).width + 14, x = Math.min(p.x + 12, 870 - w); ctx.fillStyle = "rgba(10,12,38,.92)"; D.rr(ctx, x, p.y - 26, w, 22, 6); ctx.fill(); lab(ctx, t, x + 7, p.y - 11, "#fff"); }
    SP.forEach((s, i) => { ctx.fillStyle = s.c; ctx.beginPath(); ctx.arc(740 + 0, 240 + i * 22, 5, 0, 7); ctx.fill(); lab(ctx, s.n, 752, 244 + i * 22, "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif"); });
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.arc(740, 240 + 5 * 22, 4.5, 0, 7); ctx.stroke(); lab(ctx, "đội bóng", 752, 244 + 5 * 22, "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif");
  }
  const guide = (h) => ($("guideText").innerHTML = h);
  const FROM = { click: "bấm tay", rand: "ngẫu nhiên", field: "sân bóng", cls: "một lớp", team: "đội bóng" };
  function update() {
    const S = share(); if (S.n >= 100 && [...ST.from].every((f) => f === "rand")) prog.done("random");
    $("bN").textContent = S.n; const top = S.n ? S.c.indexOf(Math.max(...S.c)) : -1; $("bTop").textContent = top < 0 ? "—" : SP[top].n; $("bTop").style.color = top < 0 ? "#fff" : SP[top].c;
    $("bTally").innerHTML = SP.map((s, i) => `<div class="r"><span style="color:${s.c}">${s.n}</span><div class="bar"><i style="width:${S.f[i] * 100}%;background:${s.c}"></i></div><span>${S.c[i]}</span></div>`).join("");
    $("bFrom").textContent = ST.from.size ? [...ST.from].map((f) => FROM[f]).join(", ") : "—";
    $("bErr").textContent = ST.reveal && S.n ? err(S.f) + "%" : "?"; $("bErr").style.color = !ST.reveal ? "#fff" : err(S.f) <= 6 ? "#5ef2d6" : err(S.f) <= 15 ? "#ffc34d" : "#ff8f6b";
    let left = 20; const parts = S.f.map((f, i) => { const v = i === 4 ? left : Math.round(f * 20); left -= v; return v; });
    $("buy").innerHTML = S.n ? SP.map((s, i) => `<span class="k" style="border-color:${s.c}"><b style="color:${s.c}">${Math.max(0, parts[i])}</b> bộ ${s.n.toLowerCase()}</span>`).join("") : '<span class="small muted">Chưa có dữ liệu để máy quyết định.</span>';
    $("askText").innerHTML = !S.n ? "Chưa hỏi bạn nào. Bấm vào một chấm để hỏi, hoặc dùng nút hỏi nhanh." : `Em đã hỏi <b>${S.n}</b> bạn. Theo mẫu của em, môn được yêu thích nhất là <b style="color:${SP[top].c}">${SP[top].n}</b> (${Math.round(S.f[top] * 100)}%).${ST.reveal ? ` Toàn trường: <b>${SP[TRUTH.indexOf(Math.max(...TRUTH))].n}</b> (${Math.round(Math.max(...TRUTH) * 100)}%).` : ""}`;
    $("stageTag").textContent = ST.lead ? "ĐANG HỎI KIỂU GỢI Ý" : "GIỜ RA CHƠI · 480 BẠN";
    renderChart();
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 46, B = 30, T = 16; ctx.clearRect(0, 0, W, H);
    const S = share(), mx = Math.max(0.5, ...S.f, ...TRUTH), Y = (v) => T + (1 - v / mx) * (H - T - B), gw = (W - L - 10) / SP.length;
    ctx.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= mx + 1e-9; v += 0.1) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - 10, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(v * 100) + "%", 6, Y(v) + 4); }
    SP.forEach((s, i) => {
      const x = L + i * gw; ctx.fillStyle = s.c; D.rr(ctx, x + gw * 0.14, Y(S.f[i]), gw * 0.34, Math.max(1, H - B - Y(S.f[i])), 5); ctx.fill(); if (S.n) { ctx.fillStyle = TH.ink; ctx.font = "700 12px JetBrains Mono, monospace"; ctx.fillText(Math.round(S.f[i] * 100) + "%", x + gw * 0.16, Y(S.f[i]) - 5); }
      if (ST.reveal) { ctx.strokeStyle = TH.ink; ctx.lineWidth = 2; ctx.setLineDash([5, 4]); ctx.strokeRect(x + gw * 0.52, Y(TRUTH[i]), gw * 0.34, H - B - Y(TRUTH[i])); ctx.setLineDash([]); ctx.fillStyle = TH.ink; ctx.fillText(Math.round(TRUTH[i] * 100) + "%", x + gw * 0.55, Y(TRUTH[i]) - 5); }
      ctx.fillStyle = TH.ink; ctx.font = "700 13px Be Vietnam Pro, sans-serif"; ctx.fillText(s.n, x + gw * 0.14, H - 10);
    });
    ctx.fillStyle = TH.text; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText(ST.reveal ? "Cột màu: mẫu của em · Cột nét đứt: toàn trường" : "Cột màu: mẫu của em · Bấm Công bố để xem toàn trường", W - 380, T + 4);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Câu hỏi rõ ràng", e: "msg", d: "Câu hỏi phải <b>trung lập</b>: \"Môn thể thao bạn thích nhất là gì?\", không gợi ý câu trả lời. Câu hỏi gợi ý làm dữ liệu lệch ngay từ đầu." },
    { t: "Chọn mẫu", e: "target", d: "Không hỏi hết 480 bạn được, ta chọn một <b>mẫu</b>. Mẫu tốt được chọn <b>ngẫu nhiên</b> trong cả trường: ai cũng có cơ hội được hỏi như nhau." },
    { t: "Kiểm đếm", e: "layers", d: "Ghi lại từng câu trả lời và <b>đếm</b> mỗi môn được bao nhiêu bạn chọn. Đó là bảng tần số." },
    { t: "Biểu đồ, tỉ lệ", e: "chart", d: "Chia số bạn chọn mỗi môn cho tổng số bạn được hỏi để có <b>tỉ lệ phần trăm</b>, rồi vẽ biểu đồ cột để dễ so sánh." },
    { t: "Mẫu bị lệch", e: "alert", d: "Cùng một câu hỏi, ba cách chọn mẫu cho ba kết quả rất khác nhau. Chỉ <b>mẫu ngẫu nhiên, đủ lớn</b> mới gần với toàn trường." },
    { t: "Máy học theo mẫu", e: "cpu", d: "Chiếc máy mua dụng cụ chỉ biết dữ liệu em đưa. Dữ liệu lệch thì máy <b>quyết định lệch</b>, mà không hề biết mình sai. AI thật cũng vậy." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const sampleOf = (list, n, seed) => { const r = P.rng(seed), a = list.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a.slice(0, n); };
  const fr = (list) => SP.map((_, i) => list.filter((p) => p.s === i).length / Math.max(1, list.length));
  const DEMO = { rand: fr(sampleOf(POP, 60, 1)), field: fr(sampleOf(POP.filter((p) => p.z === "san"), 60, 2)), cls: fr(POP.filter((p) => p.cls === 4)) };
  function bars(ctx, f, x, y, w, h, title, col) {
    lab(ctx, title, x, y - 8, col || "#fff", "800 13px Be Vietnam Pro, sans-serif"); const bw = w / 5;
    f.forEach((v, i) => { const bh = Math.min(1, v / 0.8) * (h - 14); ctx.fillStyle = SP[i].c; D.rr(ctx, x + i * bw + 3, y + h - bh, bw - 6, Math.max(1, bh), 4); ctx.fill(); lab(ctx, Math.round(v * 100) + "%", x + i * bw + bw / 2, y + h - bh - 4, "#fff", "700 10px JetBrains Mono, monospace", "center"); });
    ctx.strokeStyle = "#2c3270"; ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w, y + h); ctx.stroke();
  }
  function renderSoi() {
    const ctx = octx, s = soiStep, S = share(); D.labBg(ctx);
    if (s === 0) { [["“Môn thể thao bạn thích nhất là gì?”", "#5ef2d6", "Câu hỏi trung lập"], ["“Bạn thích bóng đá đúng không?”", "#ff8f6b", "Câu hỏi gợi ý"], ["“Bạn có thích thể thao không, môn nào?”", "#ffc34d", "Hỏi hai ý một lúc"]].forEach(([q, c, t], i) => { const y = 60 + i * 120; ctx.fillStyle = "#1d2152"; D.rr(ctx, 30, y, 580, 80, 14); ctx.fill(); ctx.strokeStyle = c; ctx.lineWidth = 2; ctx.stroke(); lab(ctx, t, 50, y + 28, c, "800 14px Be Vietnam Pro, sans-serif"); lab(ctx, q, 50, y + 58, "#fff", "600 16px Be Vietnam Pro, sans-serif"); }); return; }
    if (s === 1) { const pick = new Set(sampleOf(POP, 40, Math.floor(ST.t / 2)).map((p) => p.id)); POP.forEach((p, i) => { const x = 30 + (i % 30) * 19, y = 50 + Math.floor(i / 30) * 22; ctx.fillStyle = pick.has(p.id) ? SP[p.s].c : "#3a3f7a"; ctx.beginPath(); ctx.arc(x, y, pick.has(p.id) ? 6 : 4, 0, 7); ctx.fill(); }); lab(ctx, "480 bạn · 40 bạn được bốc thăm ngẫu nhiên (đổi sau mỗi 2 giây)", 30, 440, "#ffc34d", "600 13px Be Vietnam Pro, sans-serif"); return; }
    const f = S.n ? S.f : DEMO.rand, c = S.n ? S.c : f.map((v) => Math.round(v * 60)), n = S.n || 60; if (!S.n && s < 4) lab(ctx, "Số liệu mẫu: em hãy hỏi vài bạn để dùng số liệu của em", 30, 460, "#8f96d4", "11px Be Vietnam Pro, sans-serif");
    if (s === 2) { lab(ctx, `Kiểm đếm ${n} câu trả lời`, 30, 40, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); SP.forEach((sp, i) => { const y = 70 + i * 66; lab(ctx, sp.n, 30, y + 24, sp.c, "800 15px Be Vietnam Pro, sans-serif"); ctx.strokeStyle = sp.c; ctx.lineWidth = 2.5; for (let k = 0; k < Math.min(c[i], 40); k++) { const g = Math.floor(k / 5), j = k % 5, x = 150 + g * 44 + j * 7; if (j === 4) { ctx.beginPath(); ctx.moveTo(x - 30, y + 30); ctx.lineTo(x + 2, y + 6); ctx.stroke(); } else { ctx.beginPath(); ctx.moveTo(x, y + 4); ctx.lineTo(x, y + 32); ctx.stroke(); } } lab(ctx, String(c[i]), 600, y + 26, "#fff", "800 16px JetBrains Mono, monospace", "right"); }); return; }
    if (s === 3) { bars(ctx, f, 40, 80, 560, 260, `Tỉ lệ = số bạn chọn ÷ ${n}`, "#ffc34d"); SP.forEach((sp, i) => lab(ctx, sp.n, 40 + i * 112 + 56, 360, sp.c, "700 12px Be Vietnam Pro, sans-serif", "center")); return; }
    if (s === 4) { bars(ctx, DEMO.rand, 20, 70, 290, 150, "Ngẫu nhiên 60 bạn", "#5ef2d6"); bars(ctx, DEMO.field, 330, 70, 290, 150, "60 bạn ở sân bóng", "#ff8f6b"); bars(ctx, DEMO.cls, 20, 280, 290, 150, "Cả lớp 7A", "#ffc34d"); bars(ctx, TRUTH, 330, 280, 290, 150, "Toàn trường (480 bạn)", "#fff"); return; }
    const team = POP.filter((p) => p.team), fl = fr(team); lab(ctx, "Máy chia 20 bộ dụng cụ", 30, 40, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif");
    [["Học từ đội bóng", fl], ["Học từ mẫu ngẫu nhiên", DEMO.rand]].forEach(([t, ff], k) => { const y = 80 + k * 170; lab(ctx, t, 30, y, k ? "#5ef2d6" : "#ff8f6b", "800 14px Be Vietnam Pro, sans-serif"); let x = 30; ff.forEach((v, i) => { const m = Math.round(v * 20); for (let j = 0; j < m; j++) { ctx.fillStyle = SP[i].c; D.rr(ctx, x, y + 16, 24, 24, 5); ctx.fill(); x += 28; if (x > 590) x = 30; } }); });
    lab(ctx, "Máy không biết dữ liệu bị lệch. Người thu thập phải kiểm tra.", 30, 440, "#c3c7f0", "600 13px Be Vietnam Pro, sans-serif");
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), S = share();
    if (s <= 1) el.innerHTML = `Tổng thể <span class="hl">480</span> bạn · em đã hỏi <span class="w">${S.n}</span>`;
    else if (s <= 3) el.innerHTML = S.n ? `Nhiều nhất: <span class="hl">${SP[S.c.indexOf(Math.max(...S.c))].n}</span>` : "Chưa có câu trả lời";
    else el.innerHTML = `Mẫu của em lệch <span class="w">${S.n ? err(S.f) + "%" : "?"}</span> so với toàn trường`;
  }

  // ---------- điều khiển ----------
  function bind() {
    const pos = (e) => { const r = stage.getBoundingClientRect(); return [((e.clientX - r.left) / r.width) * stage.width, ((e.clientY - r.top) / r.height) * stage.height]; };
    const near = (e) => { const [x, y] = pos(e); let b = -1, bd = 12; POP.forEach((p, i) => { const d = Math.hypot(p.x - x, p.y - y); if (d < bd) { bd = d; b = i; } }); return b; };
    stage.addEventListener("pointermove", (e) => (ST.hover = near(e))); stage.addEventListener("pointerleave", () => (ST.hover = -1));
    stage.addEventListener("click", (e) => { const i = near(e); if (i < 0) return; const p = POP[i]; if (p.a == null) { ask(p, "click"); ST.clicks++; if (ST.clicks >= 10) prog.done("click"); } guide(`Bạn lớp ${CLASSES[p.cls]} trả lời: <b style="color:${SP[p.a].c}">${SP[p.a].n}</b>.${ST.lead && p.a !== p.s ? " (Thật ra bạn ấy thích " + SP[p.s].n.toLowerCase() + ", nhưng gật đầu theo câu hỏi gợi ý!)" : ""}`); update(); });
    $("btnRandom").onclick = () => askGroup(POP, "rand");
    $("btnField").onclick = () => askGroup(POP.filter((p) => p.z === "san"), "field");
    $("btnClass").onclick = () => { const c = 4; askGroup(POP.filter((p) => p.cls === c), "cls"); guide("Em vừa hỏi các bạn lớp <b>7A</b>. Một lớp có thể có \"phong trào\" riêng, nên chưa chắc giống cả trường."); };
    $("btnClear").onclick = () => { POP.forEach((p) => (p.a = null)); ST.from.clear(); update(); };
    $("btnReveal").onclick = () => { ST.reveal = !ST.reveal; if (ST.reveal) prog.done("reveal"); $("btnReveal").innerHTML = HKA.icon("eye") + (ST.reveal ? "Ẩn kết quả toàn trường" : "Công bố kết quả toàn trường"); update(); };
    const setN = P.range("n", () => ST.n, (v) => (ST.n = v), (v) => v + " bạn");
    $("optLead").onchange = (e) => { ST.lead = e.target.checked; update(); };
    const clear = () => { POP.forEach((p) => (p.a = null)); ST.from.clear(); ST.lead = false; $("optLead").checked = false; ST.n = 30; setN(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "team") { POP.filter((p) => p.team).forEach((p) => ask(p, "team")); update(); guide("Chỉ hỏi <b>20 bạn đội bóng</b> (chấm viền trắng): 100% thích bóng đá, máy đặt mua toàn quả bóng! Bấm <b>Công bố</b> để so với toàn trường."); }
      if (k === "few") { ST.n = 5; setN(); askGroup(POP, "rand"); guide("Chỉ hỏi <b>5 bạn</b>. Xóa câu trả lời rồi hỏi lại vài lần: mỗi lần một kết quả khác! Kéo thanh lên 100 bạn và thử lại."); }
      if (k === "lead") { ST.lead = true; $("optLead").checked = true; ST.n = 100; setN(); askGroup(POP, "rand"); ST.reveal = true; prog.done("reveal"); $("btnReveal").innerHTML = HKA.icon("eye") + "Ẩn kết quả toàn trường"; update(); const S = share(); guide(`Mẫu ngẫu nhiên 100 bạn nhưng hỏi kiểu gợi ý: bóng đá được <b>${Math.round(S.f[0] * 100)}%</b>, trong khi toàn trường chỉ ${Math.round(TRUTH[0] * 100)}%. Tắt <b>Hỏi kiểu gợi ý</b>, xóa câu trả lời và hỏi lại.`); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); update(); guide("Mọi sự cố đã tắt, sổ tay thám tử đã xóa trắng."); };
  }

  const QUIZ = [
    { q: "Muốn biết ý kiến của 480 bạn mà chỉ hỏi được 50 bạn, cách chọn nào tốt nhất?", o: ["Hỏi 50 bạn thân của em", "Bốc thăm ngẫu nhiên 50 bạn trong cả trường", "Hỏi 50 bạn đầu tiên đi qua cổng", "Hỏi 50 bạn ở sân bóng"], a: 1, e: "Chọn ngẫu nhiên giúp mọi bạn có cơ hội được hỏi như nhau, nên mẫu giống cả trường thu nhỏ." },
    { q: "Câu hỏi nào trung lập, không gợi ý?", o: ["Bạn thích bóng đá đúng không?", "Ai cũng thích cầu lông, còn bạn?", "Môn thể thao bạn thích nhất là gì?", "Bóng đá là hay nhất phải không?"], a: 2, e: "Câu hỏi trung lập không đưa sẵn câu trả lời nào." },
    { q: "Máy mua dụng cụ học từ khảo sát chỉ hỏi đội bóng. Điều gì xảy ra?", o: ["Máy tự nhận ra dữ liệu lệch", "Máy mua gần như toàn dụng cụ bóng đá, không công bằng với các bạn khác", "Máy chia đều cho mọi môn", "Máy từ chối làm việc"], a: 1, e: "Máy chỉ biết dữ liệu được đưa vào: dữ liệu lệch thì quyết định lệch." },
    { q: "Vì sao hỏi 5 bạn thì kết quả mỗi lần một khác?", o: ["Vì các bạn hay đổi ý", "Vì mẫu quá nhỏ, may rủi ảnh hưởng rất nhiều", "Vì máy tính bị lỗi", "Vì 5 là số lẻ"], a: 1, e: "Mẫu càng lớn, kết quả càng ổn định và gần tổng thể." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); update(); guide("Bấm vào vài chấm trên sân trường để hỏi từng bạn. Rồi thử các nút hỏi nhanh: <b>ngẫu nhiên</b>, <b>ở sân bóng</b>, <b>một lớp</b>. Kết quả có giống nhau không?");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka27 = { ST, POP, TRUTH, share, err };
  requestAnimationFrame(tick);
})();
