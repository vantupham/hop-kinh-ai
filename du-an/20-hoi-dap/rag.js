/* Hộp Kính AI · Dự án 20 · Trợ lý hỏi đáp SGK (tìm kiếm TF-IDF + trả lời kèm trích dẫn, so với "đóng sách") */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-20");
  const STOP = new Set("là và của có các những được trong một khi thì mà này đó như cho với từ ra vào lên nên rồi gì nào bao nhiêu vì sao do đâu ai không hãy cho em biết thế ở hay hoặc bị làm".split(" "));
  const QS = ["Quang hợp cần những gì?", "Vì sao trời mưa?", "Hành tinh nào lớn nhất hệ Mặt Trời?", "Sông Mê Kông chảy qua bao nhiêu nước?", "Vì sao Mặt Trăng sáng?", "Động đất xảy ra do đâu?"];
  const DEF = { k: 3, thr: 0.1, rag: true, bad: false };
  const ST = { ...DEF, q: QS[0], extra: [], res: null, t: 0 };
  // ---------- vector TF-IDF ----------
  const syl = (s) => s.toLowerCase().replace(/[.,!?;:()"“”]/g, " ").split(/\s+/).filter(Boolean);
  function terms(s) { const w = syl(s), out = []; for (let i = 0; i < w.length; i++) { if (STOP.has(w[i])) continue; out.push(w[i]); if (i + 1 < w.length && !STOP.has(w[i + 1])) out.push(w[i] + " " + w[i + 1]); } return out; }
  let DOCS = [], IDF = new Map(), DV = [], POS2 = [];
  const sents = (t) => t.split(/(?<=\.)\s+/).filter(Boolean);
  function vecOf(s) { const tf = new Map(); terms(s).forEach((t) => tf.set(t, (tf.get(t) || 0) + 1)); const v = new Map(); let n = 0; tf.forEach((c, t) => { const w = (1 + Math.log(c)) * (IDF.get(t) || Math.log(1 + DOCS.length)); v.set(t, w); n += w * w; }); n = Math.sqrt(n) || 1; v.forEach((w, t) => v.set(t, w / n)); return v; }
  const cos = (a, b) => { let s = 0; const [x, y] = a.size < b.size ? [a, b] : [b, a]; x.forEach((w, t) => { const u = y.get(t); if (u) s += w * u; }); return s; };
  function build() {
    DOCS = [...window.DOCS, ...ST.extra, ...(ST.bad ? [window.BAD_DOC] : [])];
    const df = new Map(); DOCS.forEach((d) => new Set(terms(d.title + " " + d.text)).forEach((t) => df.set(t, (df.get(t) || 0) + 1)));
    IDF = new Map(); df.forEach((c, t) => IDF.set(t, Math.log((1 + DOCS.length) / (1 + c)) + 1));
    DV = DOCS.map((d) => vecOf(d.title + " " + d.text));
    // bản đồ 2D: phân tích thành phần chính trên ma trận độ giống nhau
    const n = DOCS.length, G = DV.map((a) => DV.map((b) => cos(a, b))), rm = G.map((r) => r.reduce((u, v) => u + v, 0) / n), m = rm.reduce((u, v) => u + v, 0) / n;
    const C = G.map((r, i) => r.map((v, j) => v - rm[i] - rm[j] + m));
    const ev = (A, skip) => { let v = A.map((_, i) => Math.sin(i * 1.7 + 1 + (skip ? 2 : 0))); for (let it = 0; it < 200; it++) { let w = A.map((r) => r.reduce((s, x, j) => s + x * v[j], 0)); if (skip) { const d = w.reduce((s, x, i) => s + x * skip[i], 0); w = w.map((x, i) => x - d * skip[i]); } const nr = Math.hypot(...w) || 1; v = w.map((x) => x / nr); } return v; };
    const e1 = ev(C), e2 = ev(C, e1); POS2 = DOCS.map((_, i) => [e1[i], e2[i]]); layout();
    $("bDocs").textContent = DOCS.length;
  }
  // xếp các thẻ trên bản đồ cho khỏi chồng lên nhau
  let SCR = [];
  function layout() {
    const n = DOCS.length, G = DV.map((x) => DV.map((y) => cos(x, y))), ang = POS2.map((p) => Math.atan2(p[1], p[0]));
    const order = [...Array(n).keys()].sort((i, j) => ang[i] - ang[j]);
    SCR = new Array(n); order.forEach((i, k) => { const t = (k / n) * Math.PI * 2; SCR[i] = { x: 320 + Math.cos(t) * 230, y: 250 + Math.sin(t) * 170, w: DOCS[i].title.length * 7.2 + 22 }; });
    for (let it = 0; it < 400; it++) {
      const f = SCR.map(() => [0, 0]);
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const a = SCR[i], b = SCR[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || 1, L = 90 + 360 * (1 - Math.min(1, G[i][j] * 3)), k = (d - L) * 0.004 * (0.3 + G[i][j] * 4); f[i][0] += (k * dx) / d; f[i][1] += (k * dy) / d; f[j][0] -= (k * dx) / d; f[j][1] -= (k * dy) / d; }
      SCR.forEach((c, i) => { c.x += Math.max(-8, Math.min(8, f[i][0])); c.y += Math.max(-8, Math.min(8, f[i][1])); });
    }
    const xs = SCR.map((c) => c.x), ys = SCR.map((c) => c.y), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
    SCR.forEach((c) => { c.x = 90 + ((c.x - x0) / ((x1 - x0) || 1)) * 460; c.y = 56 + ((c.y - y0) / ((y1 - y0) || 1)) * 390; });
    for (let it = 0; it < 200; it++) { let moved = false; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const a = SCR[i], b = SCR[j], ox = (a.w + b.w) / 2 + 8 - Math.abs(a.x - b.x), oy = 32 - Math.abs(a.y - b.y); if (ox > 0 && oy > 0) { moved = true; if (oy < ox) { const d = (oy / 2 + 0.5) * (a.y < b.y ? -1 : 1); a.y += d; b.y -= d; } else { const d = (ox / 2 + 0.5) * (a.x < b.x ? -1 : 1); a.x += d; b.x -= d; } } } SCR.forEach((c) => { c.x = Math.max(c.w / 2 + 8, Math.min(632 - c.w / 2, c.x)); c.y = Math.max(46, Math.min(466, c.y)); }); if (!moved) break; }
  }
  // ---------- hỏi ----------
  function ask() {
    const qv = vecOf(ST.q), sc = DV.map((v, i) => ({ i, s: cos(qv, v) })).sort((a, b) => b.s - a.s), top = sc.slice(0, ST.k);
    const res = { qv, sc, top, found: top.length && top[0].s >= ST.thr };
    if (ST.rag) {
      if (!res.found) res.answer = { text: "Mình không tìm thấy thông tin này trong tài liệu. Em hãy hỏi thầy cô hoặc tìm thêm sách tham khảo nhé.", cites: [] };
      else { const cand = []; top.forEach((t, r) => { if (t.s < ST.thr) return; sents(DOCS[t.i].text).forEach((s) => cand.push({ s, r, sc: cos(qv, vecOf(s)) + 0.15 * t.s })); }); cand.sort((a, b) => b.sc - a.sc); const pick = [cand[0]]; if (cand[1] && cand[1].sc > 0.75 * cand[0].sc && cand[1].sc > 0.15) pick.push(cand[1]); res.cand = cand; res.answer = { text: pick.map((p) => `${p.s} [${p.r + 1}]`).join(" "), cites: [...new Set(pick.map((p) => p.r))], pick }; }
    } else res.answer = { text: closedBook(ST.q), cites: [], closed: true };
    ST.res = res; render(); return res;
  }
  // đóng sách: mô hình ngôn ngữ nhỏ (như Dự án 16) học từ chính các tài liệu, trả lời không tra cứu
  let LM = null;
  let LM2 = null;
  function closedBook(q) {
    if (!LM) { LM = new Map(); LM2 = new Map(); const add = (M, k, v) => { if (!M.has(k)) M.set(k, []); M.get(k).push(v); }; window.DOCS.forEach((d) => sents(d.text).forEach((s) => { const w = ["^", ...syl(s), "."]; for (let i = 0; i + 1 < w.length; i++) { add(LM, w[i], w[i + 1]); if (i + 2 < w.length) add(LM2, w[i] + " " + w[i + 1], w[i + 2]); } })); }
    const pick = (a) => a[Math.floor(Math.random() * a.length)], qw = syl(q).filter((w) => !STOP.has(w));
    let out = []; for (let i = 0; i + 1 < qw.length && !out.length; i++) if (LM2.has(qw[i] + " " + qw[i + 1])) out = [qw[i], qw[i + 1]];
    if (!out.length) { const w = qw.find((x) => LM.has(x)); out = w ? [w, pick(LM.get(w))] : ["^", pick(LM.get("^"))]; if (out[0] === "^") out.shift(); }
    for (let i = 0; i < 45; i++) {
      const a = out[out.length - 2], b = out[out.length - 1], tri = a && LM2.get(a + " " + b);
      let z = tri && Math.random() > 0.22 ? pick(tri) : pick(LM.get(b) || ["."]);
      if (z === "." && out.length < 14) z = pick((LM.get(b) || ["."]).filter((x) => x !== ".") .concat(["."]));
      if (z === ".") break; out.push(z);
    }
    let t = out.join(" ") + "."; t = t.charAt(0).toUpperCase() + t.slice(1);
    ["Mặt Trời", "Trái Đất", "Mặt Trăng", "Việt Nam", "Tây Nguyên", "Biển Đông", "Tây Tạng", "Mê Kông", "Cửu Long", "Trung Quốc", "Thái Lan", "Lào", "Cam-pu-chia", "Mi-an-ma"].forEach((p) => (t = t.replace(new RegExp(p, "gi"), p)));
    return t;
  }
  // ---------- hiển thị ----------
  function render() {
    const r = ST.res; if (!r) return; const a = r.answer;
    $("ansText").innerHTML = a.text.replace(/\[(\d)\]/g, (m, n) => `<button class="cite" data-c="${+n - 1}">${n}</button>`);
    $("ansBox").className = "ans " + (a.closed ? "closed" : r.found ? "ok" : "none");
    $("ansTag").innerHTML = a.closed ? HKA.icon("alert") + " ĐÓNG SÁCH · không có nguồn để kiểm tra" : r.found ? HKA.icon("checkCircle") + " CÓ TRÍCH DẪN NGUỒN" : HKA.icon("help") + " KHÔNG ĐỦ THÔNG TIN";
    $("ansSrc").innerHTML = a.closed ? "" : r.top.filter((t) => t.s >= ST.thr).map((t, i) => `<div class="src ${DOCS[t.i].bad ? "bad" : ""}" data-c="${i}"><b>[${i + 1}] ${DOCS[t.i].title}</b> <span>${DOCS[t.i].src} · độ liên quan ${t.s.toFixed(2)}</span></div>`).join("");
    $("ansText").querySelectorAll(".cite").forEach((b) => (b.onclick = () => showDoc(+b.dataset.c))); $("ansSrc").querySelectorAll(".src").forEach((b) => (b.onclick = () => showDoc(+b.dataset.c)));
    $("bTop").innerHTML = r.top.map((t, i) => `<div class="r"><span>${i + 1}. ${DOCS[t.i].title}</span><span class="bar"><i style="width:${Math.min(100, t.s * 160)}%;background:${t.s >= ST.thr ? (DOCS[t.i].bad ? "#ff7d5f" : "#5ef2d6") : "#6b72a8"}"></i></span><span>${t.s.toFixed(2)}</span></div>`).join("");
    $("bMode").textContent = ST.rag ? "Tra tài liệu" : "Đóng sách"; $("bMode").style.color = ST.rag ? "#5ef2d6" : "#ff7d5f";
    $("docView").hidden = true; genCode(); renderLab();
  }
  function showDoc(rank) { const t = ST.res.top[rank]; if (!t) return; const d = DOCS[t.i]; $("docView").hidden = false; const hl = new Set((ST.res.answer.pick || []).filter((p) => p.r === rank).map((p) => p.s)); $("docView").innerHTML = `<b>[${rank + 1}] ${d.title}</b> · <i>${d.src}</i><br>` + sents(d.text).map((s) => (hl.has(s) ? `<mark>${s}</mark>` : s)).join(" "); prog.done("cite"); }

  // ---------- sân khấu: bản đồ tài liệu ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  function mapXY() { return (p) => { const c = SCR[POS2.indexOf(p)]; return [c.x, c.y]; }; }
  function renderStage() {
    const ctx = sctx, r = ST.res; D.labBg(ctx); if (!POS2.length) return; const F = mapXY(), rank = new Map(r ? r.top.map((t, i) => [t.i, i]) : []);
    let q = null; if (r && ST.rag) { let sx = 0, sy = 0, sw = 0; r.sc.forEach((t) => { const w = Math.max(0, t.s) ** 2; const [x, y] = F(POS2[t.i]); sx += w * x; sy += w * y; sw += w; }); q = sw > 1e-6 ? [sx / sw, sy / sw] : [320, 240]; }
    if (q) r.top.forEach((t, i) => { const [x, y] = F(POS2[t.i]), ok = t.s >= ST.thr, ph = (ST.t * 1.2 + i * 0.2) % 1; ctx.strokeStyle = ok ? (DOCS[t.i].bad ? "rgba(255,125,95,.85)" : "rgba(94,242,214,.85)") : "rgba(150,156,200,.35)"; ctx.lineWidth = 1 + t.s * 10; ctx.setLineDash(ok ? [] : [5, 5]); ctx.beginPath(); ctx.moveTo(q[0], q[1]); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]); if (ok) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(x + (q[0] - x) * ph, y + (q[1] - y) * ph, 3, 0, 7); ctx.fill(); } });
    DOCS.forEach((d, i) => { const [x, y] = F(POS2[i]), rk = rank.get(i), on = rk != null && r.top[rk].s >= ST.thr; ctx.font = on ? "700 12px Be Vietnam Pro, sans-serif" : "11px Be Vietnam Pro, sans-serif"; const w = ctx.measureText(d.title).width + 16; ctx.fillStyle = d.bad ? (on ? "#ff7d5f" : "rgba(255,125,95,.35)") : on ? "#5ef2d6" : "rgba(35,40,102,.92)"; D.rr(ctx, x - w / 2, y - 12, w, 24, 8); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = on ? "#11142e" : "#e8eaff"; ctx.fillText(d.title, x - w / 2 + 8, y + 4); if (on) D.pill(ctx, String(rk + 1), x - w / 2 - 2, y - 12, "#5443ff", 10); });
    if (q) { ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(q[0], q[1], 11, 0, 7); ctx.fill(); ctx.fillStyle = "#11142e"; ctx.font = "800 13px Be Vietnam Pro, sans-serif"; ctx.fillText("?", q[0] - 4, q[1] + 5); }
    if (!ST.rag) { ctx.fillStyle = "rgba(10,12,38,.7)"; ctx.fillRect(0, 0, 640, 480); D.pill(ctx, "ĐÓNG SÁCH: trợ lý không mở tài liệu nào", 320, 240, "#ff5d3c", 14); }
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText(`BẢN ĐỒ ${DOCS.length} ĐOẠN TÀI LIỆU · ĐOẠN GIỐNG NHAU NẰM GẦN NHAU`, 16, 22);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Chia tài liệu", e: "book", d: "Sách được chia thành các <b>đoạn</b> ngắn, mỗi đoạn nói về một ý. Trợ lý sẽ tìm trong các đoạn này chứ không đọc cả cuốn sách mỗi lần." },
    { t: "Biến thành vector", e: "layers", d: "Mỗi đoạn và câu hỏi được biến thành <b>vector</b> từ khóa. Từ nào hiếm (chỉ xuất hiện ở ít đoạn) được tính <b>nặng</b> hơn từ phổ biến: đó là TF-IDF." },
    { t: "Tìm đoạn gần nhất", e: "scan", d: "Đo độ giống nhau (cosine) giữa câu hỏi và từng đoạn. Đoạn dưới <b>ngưỡng liên quan</b> (vạch đỏ) bị bỏ qua." },
    { t: "Chọn top-k", e: "target", d: "Lấy <b>k</b> đoạn liên quan nhất làm tài liệu tham khảo cho câu trả lời." },
    { t: "Ghép câu trả lời", e: "msg", d: "Trong các đoạn đã chọn, chấm điểm từng câu theo độ khớp với câu hỏi và lấy câu tốt nhất. Chatbot thật sẽ <b>viết lại</b> câu trả lời từ các đoạn này bằng mô hình ngôn ngữ." },
    { t: "Trích dẫn", e: "checkCircle", d: "Mỗi ý trong câu trả lời ghi rõ <b>lấy từ nguồn nào</b> để em tự kiểm tra lại. Không tìm thấy đoạn nào đủ liên quan thì trợ lý nói thẳng là không biết." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 2) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (ctx, t, x, y, c, f) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
  function wrap(ctx, text, x, y, w, lh) { const ws = text.split(" "); let line = ""; for (const t of ws) { const tt = line ? line + " " + t : t; if (ctx.measureText(tt).width > w) { ctx.fillText(line, x, y); y += lh; line = t; } else line = tt; } if (line) ctx.fillText(line, x, y); return y + lh; }
  function renderSoi() {
    const ctx = octx, s = soiStep, r = ST.res; D.labBg(ctx); if (!r) return;
    if (s === 0) { DOCS.forEach((d, i) => { const x = 14 + (i % 4) * 156, y = 14 + Math.floor(i / 4) * 92; ctx.fillStyle = d.bad ? "rgba(255,125,95,.25)" : "rgba(35,40,102,.95)"; D.rr(ctx, x, y, 148, 84, 10); ctx.fill(); lab(ctx, d.title, x + 8, y + 20, "#fff"); ctx.fillStyle = "#8f96d4"; ctx.font = "10px Be Vietnam Pro, sans-serif"; wrap(ctx, d.text.slice(0, 90) + "…", x + 8, y + 38, 132, 13); }); return; }
    if (s === 1) { const qt = terms(ST.q); lab(ctx, `Câu hỏi: “${ST.q}”`, 20, 32, "#fff"); lab(ctx, "Từ khóa (đã bỏ từ hỏi như \"vì sao\", \"là\", \"của\")", 20, 60); const rows = [...r.qv.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10); rows.forEach(([t, w], i) => { const y = 80 + i * 36; lab(ctx, t, 20, y + 16, "#fff", "600 14px Be Vietnam Pro, sans-serif"); lab(ctx, `có ở ${Math.max(0, Math.round((1 + DOCS.length) / Math.exp((IDF.get(t) || 1) - 1) - 1))} đoạn`, 200, y + 16, "#8f96d4", "11px Be Vietnam Pro, sans-serif"); ctx.fillStyle = "#232866"; ctx.fillRect(330, y + 4, 250, 16); ctx.fillStyle = "#7c8cff"; ctx.fillRect(330, y + 4, w * 250, 16); lab(ctx, w.toFixed(2), 586, y + 17, "#c3c7f0", "11px JetBrains Mono, monospace"); }); if (!qt.length) lab(ctx, "Không còn từ khóa nào!", 20, 100, "#ff7d5f"); return; }
    if (s === 2) { const mx = Math.max(0.3, r.sc[0].s), bh = Math.min(24, 440 / DOCS.length); r.sc.forEach((t, i) => { const y = 20 + i * bh; lab(ctx, DOCS[t.i].title, 20, y + bh * 0.7, t.s >= ST.thr ? "#fff" : "#8f96d4", `600 ${Math.min(12, bh * 0.55)}px Be Vietnam Pro, sans-serif`); ctx.fillStyle = t.s >= ST.thr ? (DOCS[t.i].bad ? "#ff7d5f" : "#5ef2d6") : "#4a4f7a"; ctx.fillRect(200, y + 3, (t.s / mx) * 400, bh - 6); }); const tx = 200 + (ST.thr / mx) * 400; ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.beginPath(); ctx.moveTo(tx, 10); ctx.lineTo(tx, 470); ctx.stroke(); ctx.setLineDash([]); return; }
    if (s === 3) { r.top.forEach((t, i) => { const d = DOCS[t.i], y = 16 + i * 92, ok = t.s >= ST.thr; ctx.fillStyle = ok ? (d.bad ? "rgba(255,125,95,.25)" : "rgba(94,242,214,.15)") : "rgba(74,79,122,.3)"; D.rr(ctx, 16, y, 608, 84, 10); ctx.fill(); lab(ctx, `[${i + 1}] ${d.title} · ${t.s.toFixed(2)} ${ok ? "" : "· dưới ngưỡng, bỏ"}`, 28, y + 22, ok ? "#fff" : "#8f96d4"); ctx.fillStyle = "#c3c7f0"; ctx.font = "11px Be Vietnam Pro, sans-serif"; wrap(ctx, d.text, 28, y + 42, 580, 14); }); return; }
    if (s === 4) { if (!ST.rag) { lab(ctx, "Đang ở chế độ Đóng sách: không có đoạn nào để ghép.", 80, 240, "#ff7d5f"); return; } if (!r.cand) { lab(ctx, "Không có đoạn nào vượt ngưỡng, nên không có câu nào để ghép.", 60, 240, "#ff7d5f"); return; } const pk = new Set((r.answer.pick || []).map((p) => p.s)); r.cand.slice(0, 8).forEach((c, i) => { const y = 14 + i * 56; ctx.fillStyle = pk.has(c.s) ? "rgba(255,195,77,.25)" : "rgba(35,40,102,.8)"; D.rr(ctx, 16, y, 608, 50, 8); ctx.fill(); lab(ctx, `[${c.r + 1}] ${c.sc.toFixed(2)}`, 26, y + 18, pk.has(c.s) ? "#ffc34d" : "#8f96d4", "700 11px JetBrains Mono, monospace"); ctx.fillStyle = "#e8eaff"; ctx.font = "11px Be Vietnam Pro, sans-serif"; wrap(ctx, c.s, 110, y + 18, 500, 14); }); return; }
    ctx.fillStyle = "rgba(35,40,102,.9)"; D.rr(ctx, 16, 16, 608, 200, 12); ctx.fill(); lab(ctx, "Câu trả lời", 30, 42, "#ffc34d"); ctx.fillStyle = "#fff"; ctx.font = "14px Be Vietnam Pro, sans-serif"; wrap(ctx, r.answer.text, 30, 70, 580, 20);
    if (r.answer.closed) lab(ctx, "Không có nguồn nào: em không thể kiểm tra câu trả lời này!", 30, 260, "#ff7d5f", "800 14px Be Vietnam Pro, sans-serif");
    else r.top.filter((t) => t.s >= ST.thr).forEach((t, i) => { const y = 236 + i * 40, d = DOCS[t.i]; D.pill(ctx, String(i + 1), 34, y + 14, "#5443ff", 11); lab(ctx, `${d.title} · nguồn: ${d.src}`, 54, y + 18, d.bad ? "#ff7d5f" : "#fff"); });
  }
  function soiLive() {
    const s = soiStep, r = ST.res, el = $("soiLive"); if (!r) return;
    if (s === 0) el.innerHTML = `<span class="hl">${DOCS.length}</span> đoạn tài liệu${ST.bad ? ' · <span class="w">có 1 đoạn không đáng tin</span>' : ""}`;
    else if (s === 1) el.innerHTML = `Câu hỏi có <span class="hl">${r.qv.size}</span> từ khóa (cả cặp từ)`;
    else if (s === 2) el.innerHTML = `Đoạn gần nhất: <span class="hl">${DOCS[r.sc[0].i].title}</span> (${r.sc[0].s.toFixed(2)}) · ngưỡng ${ST.thr.toFixed(2)}`;
    else if (s === 3) el.innerHTML = `top-k = <span class="hl">${ST.k}</span> · vượt ngưỡng: <span class="w">${r.top.filter((t) => t.s >= ST.thr).length}</span>`;
    else if (s === 4) el.innerHTML = r.answer.pick ? `Chọn <span class="hl">${r.answer.pick.length}</span> câu` : "Không có câu nào được chọn";
    else el.innerHTML = r.answer.closed ? '<span class="w">Không có trích dẫn</span>' : r.found ? `Trích dẫn: <span class="hl">${r.answer.cites.map((c) => "[" + (c + 1) + "]").join(" ")}</span>` : "Trả lời: không đủ thông tin";
  }
  // ---------- Tự làm ----------
  function renderLab() {
    const r = ST.res, cv = $("chart"); if (!r || !cv) return; const ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 40, B = 70, T = 14; ctx.clearRect(0, 0, W, H);
    const mx = Math.max(0.3, r.sc[0].s), bw = (W - L - 10) / DOCS.length, by = DOCS.map((d, i) => r.sc.find((t) => t.i === i).s);
    ctx.font = "11px JetBrains Mono, monospace"; [0, mx / 2, mx].forEach((v) => { const y = T + (1 - v / mx) * (H - T - B); ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - 10, y); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v.toFixed(2), 2, y + 4); });
    by.forEach((v, i) => { const h = (Math.max(0, v) / mx) * (H - T - B), x = L + i * bw; ctx.fillStyle = v >= ST.thr ? (DOCS[i].bad ? TH.coral : TH.mint) : TH.violet; ctx.globalAlpha = v >= ST.thr ? 1 : 0.45; ctx.fillRect(x + 3, H - B - h, bw - 6, h); ctx.globalAlpha = 1; ctx.save(); ctx.translate(x + bw / 2, H - B + 8); ctx.rotate(Math.PI / 4); ctx.fillStyle = TH.ink; ctx.font = "11px Be Vietnam Pro, sans-serif"; ctx.fillText(DOCS[i].title, 0, 0); ctx.restore(); });
    const ty = T + (1 - ST.thr / mx) * (H - T - B); ctx.setLineDash([6, 4]); ctx.strokeStyle = TH.coral; ctx.beginPath(); ctx.moveTo(L, ty); ctx.lineTo(W - 10, ty); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.coral; ctx.fillText("ngưỡng liên quan", W - 140, ty - 6);
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML = ST.rag ?
`${k("const")} q = vectorTFIDF(cauHoi);
${k("const")} xepHang = doan.map(d =&gt; ({ d, diem: cosine(q, d.vector) }))
                  .sort((a, b) =&gt; b.diem - a.diem).slice(${n(0)}, ${n(ST.k)});
${k("const")} nguon = xepHang.filter(x =&gt; x.diem &gt;= ${n(ST.thr.toFixed(2))});
${k("if")} (!nguon.length) ${k("return")} ${'"Mình không tìm thấy trong tài liệu."'};
${k("return")} cauKhopNhat(nguon) + trichDan(nguon);   ${c("// [1], [2]…")}` :
`${c("// đóng sách: chỉ đoán chữ tiếp theo, không tra cứu")}
${k("return")} moHinhNgonNgu.vietTiep(cauHoi);   ${c("// không có nguồn để kiểm tra!")}`;
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function setQ(q) { ST.q = q; $("qIn").value = q; ask(); }
  function bind() {
    $("qBtns").innerHTML = QS.map((q, i) => `<button class="btn small ghost" data-i="${i}">${q}</button>`).join(""); $("qBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { setQ(QS[+b.dataset.i]); prog.done("ask"); }));
    $("qIn").addEventListener("keydown", (e) => { if (e.key === "Enter") { ST.q = $("qIn").value; ask(); prog.done("ask"); } }); $("btnAsk").onclick = () => { ST.q = $("qIn").value; ask(); prog.done("ask"); };
    $("modeBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.rag = b.dataset.m === "rag"; if (!ST.rag) prog.done("closed"); markMode(); ask(); }));
    syncs.push(P.range("k", () => ST.k, (v) => (ST.k = v), (v) => v + " đoạn", ask));
    syncs.push(P.range("thr", () => ST.thr, (v) => (ST.thr = v), (v) => v.toFixed(2), ask));
    $("bad").onchange = (e) => { ST.bad = e.target.checked; build(); ask(); };
    $("btnAdd").onclick = () => { const t = $("addTitle").value.trim(), x = $("addText").value.trim(); if (!t || x.length < 20) { $("addInfo").textContent = "Hãy nhập tên đoạn và ít nhất một câu."; return; } ST.extra.push({ id: "em-" + ST.extra.length, title: t, src: "Tài liệu của em", text: x }); build(); ask(); $("addInfo").textContent = `Đã thêm đoạn \"${t}\". Kho có ${DOCS.length} đoạn.`; prog.done("add"); };
    function markMode() { $("modeBtns").querySelectorAll("button").forEach((b) => b.classList.toggle("ghost", (b.dataset.m === "rag") !== ST.rag)); }
    const sync = () => { syncs.forEach((f) => f()); $("bad").checked = ST.bad; markMode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); if (k === "outside") ST.thr = 0; if (k === "badsrc") ST.bad = true; if (k === "closed") ST.rag = false; build(); sync();
      setQ({ outside: "Ai là người phát minh ra điện thoại?", badsrc: "Vì sao Mặt Trăng sáng?", closed: "Sông Mê Kông chảy qua bao nhiêu nước?" }[k]); prog.done("broke"); $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); build(); sync(); ask(); };
    sync();
  }

  const QUIZ = [
    { q: "RAG (tạo câu trả lời có tra cứu) khác chatbot \"đóng sách\" ở điểm nào?", o: ["Không khác gì", "Trợ lý tìm các đoạn tài liệu liên quan trước, rồi trả lời dựa trên đó và ghi nguồn", "RAG không dùng mô hình ngôn ngữ", "RAG chỉ trả lời bằng hình ảnh"], a: 1, e: "Nhờ tra cứu, câu trả lời bám vào tài liệu cụ thể và em kiểm tra lại được." },
    { q: "Trong TF-IDF, vì sao từ hiếm được tính nặng hơn từ phổ biến?", o: ["Vì từ hiếm dài hơn", "Vì từ xuất hiện ở hầu hết các đoạn (như \"là\", \"của\") không giúp phân biệt đoạn nào liên quan", "Vì máy thích từ hiếm", "Vì từ phổ biến bị viết sai"], a: 1, e: "\"Diệp lục\" chỉ có ở đoạn quang hợp nên rất có ích để tìm đúng đoạn; \"Trái Đất\" có ở nhiều đoạn nên ít giúp hơn." },
    { q: "Hỏi một điều không có trong tài liệu, trợ lý tốt nên làm gì?", o: ["Trả lời đại cho xong", "Nói rõ là không tìm thấy thông tin trong tài liệu", "Lấy đoạn gần nhất dù không liên quan", "Im lặng"], a: 1, e: "Ngưỡng liên quan giúp trợ lý biết khi nào mình không biết. Nói \"không biết\" tốt hơn nhiều so với bịa." },
    { q: "Kho tài liệu có một bài viết sai, và trợ lý trích dẫn nó. Bài học là gì?", o: ["Trích dẫn luôn đảm bảo đúng", "AI chỉ tốt bằng tài liệu nó dựa vào; trích dẫn giúp em phát hiện nguồn kém tin cậy", "Phải bỏ trích dẫn", "Tài liệu trên mạng luôn đúng"], a: 1, e: "Rác vào thì rác ra. Hãy luôn bấm vào trích dẫn để xem nguồn là gì, có đáng tin không." },
    { q: "Ở chế độ đóng sách, trợ lý trả lời trôi chảy nhưng trộn lẫn các ý không liên quan. Vì sao?", o: ["Vì máy mệt", "Vì nó chỉ đoán chữ tiếp theo theo xác suất (Dự án 16), không tra cứu nên không kiểm tra được đúng sai", "Vì câu hỏi quá dài", "Vì thiếu internet"], a: 1, e: "Đây chính là ảo giác. RAG không xóa hết ảo giác, nhưng giúp giảm và cho em cách kiểm tra." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now(), slow = 0;
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; renderStage(); if (soiVisible) renderSoi(); if (now - slow > 250) { slow = now; if (soiVisible) soiLive(); } requestAnimationFrame(tick); }
  P.nav(); build(); bind(); setQ(QS[0]);
  window.__hka20 = { ST, ask, setQ, build };
  requestAnimationFrame(tick);
})();
