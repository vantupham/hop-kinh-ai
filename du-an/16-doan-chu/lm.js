/* Hộp Kính AI · Dự án 16 · Đoán chữ tiếp theo (mô hình n-gram theo âm tiết, nhiệt độ, lấy mẫu) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-16");
  const DEF = { T: 0.8, n: 2, topK: 0, backoff: true };
  const ST = { ...DEF, out: [], auto: false, lastPick: null, lastCands: null, lastInfo: null, t: 0, extra: [] };
  const PROMPTS = ["trời hôm nay", "em thích", "có công", "mùa thu", "học sinh", "cô giáo"];

  // ---------- học từ kho câu ----------
  const tok = (s) => s.toLowerCase().replace(/([,.])/g, " $1 ").split(/\s+/).filter(Boolean);
  let TABLE, SENTS, VOCAB, NTOK, GRAM6;
  function train() {
    const lines = (window.CORPUS + "\n" + ST.extra.join("\n")).split("\n").map((l) => l.trim()).filter(Boolean);
    TABLE = new Map(); SENTS = []; VOCAB = new Set(); NTOK = 0; GRAM6 = new Set();
    for (const l of lines) {
      const t = ["^", ...tok(l)]; if (t[t.length - 1] !== ".") t.push(".");
      SENTS.push(t); NTOK += t.length - 1; t.forEach((w) => w !== "^" && VOCAB.add(w));
      for (let i = 1; i < t.length; i++) for (let n = 0; n <= 4 && n <= i; n++) { const key = n + "|" + t.slice(i - n, i).join(" "); let m = TABLE.get(key); if (!m) TABLE.set(key, (m = new Map())); m.set(t[i], (m.get(t[i]) || 0) + 1); }
      for (let i = 1; i + 6 <= t.length; i++) GRAM6.add(t.slice(i, i + 6).join(" "));
    }
    $("bVocab").textContent = VOCAB.size; $("bTok").textContent = NTOK.toLocaleString("vi-VN");
  }
  const ctxTokens = () => { const a = ["^"]; for (const o of ST.out) { a.push(o.w); if (o.w === ".") a.push("^"); } return a; };
  // tìm ngữ cảnh dài nhất có trong dữ liệu (lùi dần nếu chưa gặp)
  function lookup(ctx, want) {
    const trace = [];
    for (let n = Math.min(want, ctx.length); n >= 0; n--) {
      const c = ctx.slice(ctx.length - n), m = TABLE.get(n + "|" + c.join(" "));
      trace.push({ n, c, found: !!m });
      if (m) return { n, c, m, trace };
      if (!ST.backoff) return { n, c, m: null, trace };
    }
    return { n: 0, c: [], m: null, trace };
  }
  const LAM = 0.75;
  function blend(L, ctx) {
    const tot = (m) => [...m.values()].reduce((u, v) => u + v, 0), t1 = tot(L.m), M = new Map();
    for (const [w, c] of L.m) M.set(w, { w, c, p: c / t1 });
    if (ST.backoff && L.n >= 2) { const lo = TABLE.get((L.n - 1) + "|" + ctx.slice(ctx.length - L.n + 1).join(" ")); if (lo) { const t0 = tot(lo); M.forEach((x) => (x.p *= LAM)); for (const [w, c] of lo) { const x = M.get(w) || { w, c: 0, p: 0 }; x.p += (1 - LAM) * (c / t0); M.set(w, x); } } }
    return [...M.values()].sort((x, y) => y.p - x.p || y.c - x.c);
  }
  function temper(a, T, topK) {
    a = a.map((x) => ({ ...x, p0: x.p })); if (topK) a = a.slice(0, topK);
    if (T <= 0.001) { a.forEach((x, i) => (x.p = i ? 0 : 1)); return a; }
    const z = a.map((x) => Math.pow(x.p0, 1 / T)), s = z.reduce((u, v) => u + v, 0); a.forEach((x, i) => (x.p = z[i] / s)); return a;
  }
  function predict(ctx) { ctx = ctx || ctxTokens(); ctx = ctx.slice(ctx.lastIndexOf("^")); const L = lookup(ctx, ST.n); if (!L.m) return { ...L, d: [], d1: [] }; const b = blend(L, ctx); return { ...L, d: temper(b, ST.T, ST.topK), d1: temper(b, 1, ST.topK) }; }
  function sample(d) { let r = Math.random(), acc = 0; for (const x of d) { acc += x.p; if (r <= acc) return x; } return d[d.length - 1]; }

  // ---------- viết ----------
  function setPrompt(s) { ST.auto = false; ST.out = tok(s).map((w) => ({ w, prompt: true })); ST.lastPick = null; refresh(); }
  function addToken(x, info) { ST.out.push({ w: x.w, p: x.p, n: info.n, cands: info.d.length }); ST.lastPick = x; ST.lastCands = info.d; ST.lastInfo = info; if (ST.out.filter((o) => !o.prompt).length >= 3) prog.done("write"); refresh(); }
  function step() {
    const info = predict(); if (!info.d.length) { ST.auto = false; $("bNote").innerHTML = "Ngữ cảnh này chưa từng gặp trong dữ liệu và việc <b>lùi ngữ cảnh</b> đang tắt, nên máy dừng lại."; refresh(); return false; }
    const x = sample(info.d); addToken(x, info); return x.w !== "." || genCount() < 14;
  }
  const genCount = () => ST.out.filter((o) => !o.prompt).length;
  function refresh() { renderText(); renderBrain(); genCode(); }
  function renderText() {
    const html = ST.out.map((o) => { if (o.prompt) return `<span class="tk pr">${o.w}</span>`; const c = o.p > 0.6 ? "hi" : o.p > 0.25 ? "md" : "lo"; return `<span class="tk ${c}" title="xác suất ${Math.round(o.p * 100)}% · ngữ cảnh ${o.n} chữ">${o.w}</span>`; }).join("");
    $("textOut").innerHTML = html + (ST.auto ? '<span class="caret"></span>' : "");
  }
  function novelty() { if (genCount() < 4) return null; let hit = 0, tot = 0; const sents = ctxTokens().join(" ").split("^").map((x) => x.trim().split(" ").filter(Boolean)); for (const t of sents) for (let i = 0; i + 6 <= t.length; i++) { tot++; if (GRAM6.has(t.slice(i, i + 6).join(" "))) hit++; } return tot ? hit / tot : null; }
  function renderBrain() {
    const info = predict(); ST.cur = info;
    $("bCtx").innerHTML = info.c.length ? info.c.map((w) => `<span class="tk pr">${w === "^" ? "đầu câu" : w}</span>`).join("") : "<i>không có</i>";
    $("bCand").textContent = info.d.length;
    $("bConf").textContent = ST.lastPick ? Math.round(ST.lastPick.p * 100) + "%" : "—";
    const nv = novelty(); $("bCopy").textContent = nv == null ? "—" : Math.round(nv * 100) + "%"; $("bCopy").style.color = nv == null ? "" : nv > 0.8 ? "#ff7d5f" : nv > 0.4 ? "#ffc34d" : "#5ef2d6";
    const back = info.trace.length > 1 && info.trace[0].n > info.n;
    if (!$("bNote").dataset.lock) $("bNote").innerHTML = !info.d.length ? "" : back ? `Chưa từng gặp “${info.trace[0].c.join(" ")}” → <b>lùi</b> về ngữ cảnh ${info.n} chữ.` : `Đã gặp ngữ cảnh này <b>${[...info.m.values()].reduce((a, b) => a + b, 0)}</b> lần trong dữ liệu.`;
  }

  // ---------- sân khấu: cây xác suất ----------
  const stage = $("stage"), sctx = stage.getContext("2d"); let NODES = [];
  function renderStage() {
    const ctx = sctx, TH = P.TH; D.labBg(ctx); NODES = [];
    const info = ST.cur || predict(), ctxT = ctxTokens();
    ctx.fillStyle = "#c3c7f0"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText("CÂY XÁC SUẤT · CHẠM VÀO MỘT CHỮ ĐỂ CHỌN", 18, 24);
    // gốc
    const rx = 18, ry = 222; ctx.fillStyle = "#5443ff"; D.rr(ctx, rx, ry, 140, 52, 12); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "700 13px Be Vietnam Pro, sans-serif";
    const last = ctxT.slice(-3).map((w) => (w === "^" ? "▸" : w)).join(" "); ctx.fillText(last.length > 17 ? "…" + last.slice(-16) : last, rx + 10, ry + 22); ctx.font = "10px JetBrains Mono, monospace"; ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillText(`ngữ cảnh ${info.n} chữ`, rx + 10, ry + 40);
    if (!info.d.length) { ctx.fillStyle = "#ff7d5f"; ctx.font = "700 14px Be Vietnam Pro, sans-serif"; ctx.fillText("Máy không biết viết tiếp", 200, 250); return; }
    const L1 = info.d.slice(0, 5), others = info.d.slice(5).reduce((s, x) => s + x.p, 0);
    const y1 = (i) => 60 + i * 84;
    L1.forEach((x, i) => {
      const y = y1(i), w = 2 + x.p * 18, hl = ST.lastPick && ST.lastPick.w === x.w && ST.pulse > 0;
      ctx.strokeStyle = `rgba(124,140,255,${0.25 + x.p * 0.75})`; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(rx + 140, ry + 26); ctx.bezierCurveTo(200, ry + 26, 190, y + 22, 240, y + 22); ctx.stroke();
      ctx.fillStyle = hl ? "#ffc34d" : "#232866"; D.rr(ctx, 240, y, 130, 44, 10); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 1; ctx.stroke();
      ctx.fillStyle = hl ? "#1b1f4a" : "#fff"; ctx.font = "700 15px Be Vietnam Pro, sans-serif"; ctx.fillText(x.w === "." ? "· (hết câu)" : x.w, 252, y + 20);
      ctx.fillStyle = hl ? "#1b1f4a" : "#5ef2d6"; ctx.font = "700 11px JetBrains Mono, monospace"; ctx.fillText(Math.round(x.p * 100) + "%", 252, y + 37);
      ctx.fillStyle = "rgba(94,242,214,.25)"; ctx.fillRect(300, y + 30, 62, 6); ctx.fillStyle = "#5ef2d6"; ctx.fillRect(300, y + 30, 62 * x.p, 6);
      NODES.push({ x: 240, y, w: 130, h: 44, path: [x] });
      if (i < 3 && x.w !== ".") {
        const sub = predict([...ctxT, x.w]); sub.d.slice(0, 3).forEach((z, j) => {
          const ny = 44 + (i * 3 + j) * 46;
          ctx.strokeStyle = `rgba(94,242,214,${0.2 + z.p * 0.6})`; ctx.lineWidth = 1 + z.p * 6; ctx.beginPath(); ctx.moveTo(370, y + 22); ctx.bezierCurveTo(410, y + 22, 400, ny + 14, 440, ny + 14); ctx.stroke();
          ctx.fillStyle = "rgba(35,40,102,.9)"; D.rr(ctx, 440, ny, 180, 28, 8); ctx.fill();
          ctx.fillStyle = "#fff"; ctx.font = "600 13px Be Vietnam Pro, sans-serif"; ctx.fillText(x.w + " " + (z.w === "." ? "·" : z.w), 450, ny + 19); ctx.fillStyle = "#8f96d4"; ctx.font = "10px JetBrains Mono, monospace"; ctx.fillText(Math.round(z.p * 100) + "%", 584, ny + 18);
          NODES.push({ x: 440, y: ny, w: 180, h: 28, path: [x, z], sub });
        });
      }
    });
    if (others > 0.005) { ctx.fillStyle = "#8f96d4"; ctx.font = "11px Be Vietnam Pro, sans-serif"; ctx.fillText(`+ ${info.d.length - 5} chữ khác: ${Math.round(others * 100)}%`, 240, 474); }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Tách token", e: "blocks", d: "Câu được cắt thành các <b>token</b>. Ở đây mỗi âm tiết tiếng Việt là một token, dấu phẩy và dấu chấm cũng là token. Máy chỉ làm việc với các token này." },
    { t: "Nhìn ngữ cảnh", e: "eye", d: "Máy chỉ nhìn <b>n token cuối</b> (ngữ cảnh). Nếu ngữ cảnh đó chưa từng xuất hiện trong dữ liệu, máy <b>lùi</b> về ngữ cảnh ngắn hơn." },
    { t: "Đếm trong dữ liệu", e: "scan", d: "Máy tìm mọi chỗ ngữ cảnh này xuất hiện trong kho câu, và đếm xem <b>token nào theo sau</b> bao nhiêu lần." },
    { t: "Thành xác suất", e: "chart", d: "Chia mỗi số đếm cho tổng để được <b>xác suất</b>. Để bớt cứng nhắc, máy <b>trộn</b> thêm một phần xác suất từ ngữ cảnh ngắn hơn, nhờ vậy có nhiều lựa chọn hơn." },
    { t: "Nhiệt độ", e: "sun", d: "<b>Nhiệt độ</b> nắn lại xác suất: nhiệt độ thấp làm token mạnh càng mạnh (an toàn, dễ lặp lại), nhiệt độ cao san đều ra (bất ngờ, dễ vô nghĩa)." },
    { t: "Bốc thăm", e: "target", d: "Máy quay một <b>vòng quay may mắn</b> chia theo xác suất. Ô to dễ trúng hơn, nhưng ô nhỏ vẫn có thể trúng. Token trúng được nối vào câu, rồi lặp lại từ đầu." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (ctx, t, x, y, c, f) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
  function bars(ctx, d, x0, y0, w, rowH, col, label) { d.slice(0, 8).forEach((x, i) => { const y = y0 + i * rowH; lab(ctx, x.w === "." ? "· (hết câu)" : x.w, x0, y + 13, "#fff", "600 13px Be Vietnam Pro, sans-serif"); ctx.fillStyle = "#232866"; ctx.fillRect(x0 + 96, y + 2, w, 14); ctx.fillStyle = col; ctx.fillRect(x0 + 96, y + 2, w * x.p, 14); lab(ctx, label(x), x0 + 100 + w, y + 14, "#c3c7f0", "11px JetBrains Mono, monospace"); }); }
  function renderSoi() {
    const ctx = octx, s = soiStep, info = ST.cur || predict(), ctxT = ctxTokens(); D.labBg(ctx);
    if (s === 0) {
      let x = 20, y = 70; lab(ctx, "Câu → token → số thứ tự trong từ điển", 20, 40); const V = [...VOCAB];
      ctxT.slice(1).forEach((w) => { ctx.font = "700 16px Be Vietnam Pro, sans-serif"; const tw = Math.max(44, ctx.measureText(w).width + 20); if (x + tw > 620) { x = 20; y += 86; } ctx.fillStyle = "#5443ff"; D.rr(ctx, x, y, tw, 36, 8); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(w, x + 10, y + 24); lab(ctx, "#" + V.indexOf(w), x + 6, y + 56, "#5ef2d6", "11px JetBrains Mono, monospace"); x += tw + 8; });
      lab(ctx, `Từ điển có ${VOCAB.size} token khác nhau.`, 20, 440, "#8f96d4", "12px Be Vietnam Pro, sans-serif"); return;
    }
    if (s === 1) {
      lab(ctx, `Ngữ cảnh muốn dùng: ${ST.n} token cuối`, 20, 40); let x = 20; const k0 = ctxT.length - info.n;
      ctxT.forEach((w, i) => { const on = i >= k0, tw = Math.max(36, w.length * 10 + 20); if (x + tw > 620) return; ctx.fillStyle = on ? "#ffc34d" : "#232866"; D.rr(ctx, x, 70, tw, 36, 8); ctx.fill(); lab(ctx, w === "^" ? "▸" : w, x + 10, 94, on ? "#1b1f4a" : "#c3c7f0", "700 14px Be Vietnam Pro, sans-serif"); x += tw + 6; });
      info.trace.forEach((t, i) => { const y = 160 + i * 46; ctx.fillStyle = t.found ? "rgba(94,242,214,.15)" : "rgba(255,125,95,.15)"; D.rr(ctx, 20, y, 600, 36, 8); ctx.fill(); lab(ctx, `${t.n} token: “${t.c.map((w) => (w === "^" ? "▸" : w)).join(" ") || "(không có)"}”`, 34, y + 23, "#fff"); lab(ctx, t.found ? "ĐÃ GẶP → dùng" : "CHƯA GẶP → lùi", 470, y + 23, t.found ? "#5ef2d6" : "#ff7d5f"); });
      return;
    }
    if (s === 2) {
      const c = info.c, hits = []; for (const t of SENTS) for (let i = c.length; i < t.length; i++) if (c.every((w, k) => t[i - c.length + k] === w)) { hits.push({ t, i }); break; }
      lab(ctx, `Những câu có “${c.map((w) => (w === "^" ? "▸" : w)).join(" ") || "bất kỳ"}” (${hits.length} câu, hiện 9)`, 20, 36);
      hits.slice(0, 9).forEach(({ t, i }, r) => { let x = 20; const y = 66 + r * 42; t.slice(1).forEach((w, j) => { const jj = j + 1, isC = jj >= i - c.length && jj < i, isN = jj === i; ctx.font = "600 13px Be Vietnam Pro, sans-serif"; const tw = ctx.measureText(w).width + 8; if (x + tw > 630) return; if (isC || isN) { ctx.fillStyle = isN ? "#5ef2d6" : "rgba(255,195,77,.35)"; D.rr(ctx, x - 2, y - 15, tw, 22, 5); ctx.fill(); } ctx.fillStyle = isN ? "#1b1f4a" : "#e8eaff"; ctx.fillText(w, x + 2, y); x += tw; }); });
      return;
    }
    if (s === 3) { const tot = info.d1.reduce((a, x) => a + x.c, 0); lab(ctx, ST.backoff && info.n ? `Số lần ÷ tổng ${tot}, trộn ${LAM * 100}% với ${(1 - LAM) * 100}% của ngữ cảnh ngắn hơn` : `Số lần đếm được ÷ tổng ${tot} = xác suất`, 20, 40); bars(ctx, info.d1, 20, 64, 380, 46, "#7c8cff", (x) => `${x.c} lần → ${Math.round(x.p * 100)}%`); return; }
    if (s === 4) { lab(ctx, "Nhiệt độ 1 (gốc)", 20, 40); bars(ctx, info.d1, 20, 60, 170, 46, "#7c8cff", (x) => Math.round(x.p * 100) + "%"); lab(ctx, `Nhiệt độ ${ST.T.toFixed(1)}`, 330, 40, "#ffc34d"); bars(ctx, info.d, 330, 60, 170, 46, "#ffc34d", (x) => Math.round(x.p * 100) + "%"); return; }
    // vòng quay
    const d = ST.lastCands || info.d; if (!d.length) return; const cx = 220, cy = 240, R = 180, rot = ST.t * 0.6; let a = rot; const pal = ["#7c8cff", "#5ef2d6", "#ffc34d", "#ff8fd0", "#ff7d5f", "#9be15d", "#58c4ff", "#c58bff"];
    d.forEach((x, i) => { const da = x.p * Math.PI * 2; if (da < 0.0001) return; ctx.fillStyle = pal[i % pal.length]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, a, a + da); ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#121633"; ctx.lineWidth = 2; ctx.stroke(); if (da > 0.25) { const m = a + da / 2; lab(ctx, x.w === "." ? "·" : x.w, cx + Math.cos(m) * R * 0.62 - 14, cy + Math.sin(m) * R * 0.62 + 5, "#121633", "700 14px Be Vietnam Pro, sans-serif"); } a += da; });
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.moveTo(cx + R + 4, cy); ctx.lineTo(cx + R + 26, cy - 12); ctx.lineTo(cx + R + 26, cy + 12); ctx.fill();
    lab(ctx, "Chữ vừa trúng", 450, 200); lab(ctx, ST.lastPick ? (ST.lastPick.w === "." ? "· (hết câu)" : ST.lastPick.w) : "—", 450, 240, "#ffc34d", "800 28px Be Vietnam Pro, sans-serif"); if (ST.lastPick) lab(ctx, `xác suất ${Math.round(ST.lastPick.p * 100)}%`, 450, 266, "#c3c7f0", "12px JetBrains Mono, monospace");
  }
  function soiLive() {
    const s = soiStep, info = ST.cur || predict(), el = $("soiLive");
    if (s === 0) el.innerHTML = `Câu hiện tại có <span class="hl">${ST.out.length}</span> token · từ điển <span class="w">${VOCAB.size}</span> token`;
    else if (s === 1) el.innerHTML = `Muốn dùng <span class="w">${ST.n}</span> token · thật sự dùng <span class="hl">${info.n}</span> token${ST.backoff ? "" : " · lùi ngữ cảnh: TẮT"}`;
    else if (s === 2 || s === 3) el.innerHTML = `Có <span class="hl">${info.d.length}</span> token khác nhau từng theo sau ngữ cảnh này`;
    else if (s === 4) el.innerHTML = `Nhiệt độ <span class="hl">${ST.T.toFixed(1)}</span> · token mạnh nhất: <span class="w">${info.d[0] ? Math.round(info.d1[0].p * 100) + "% → " + Math.round(info.d[0].p * 100) + "%" : "—"}</span>`;
    else el.innerHTML = ST.lastPick ? `Trúng: <span class="hl">${ST.lastPick.w}</span> (${Math.round(ST.lastPick.p * 100)}%)` : "Bấm Viết tiếp 1 chữ ở phần Mồi để quay.";
  }

  // ---------- Tự làm ----------
  function renderLab() {
    const info = ST.cur || predict();
    $("countTbl").innerHTML = info.d.length ? `<table class="coords"><tr><th scope="col">Token tiếp theo</th><th scope="col">Số lần (ngữ cảnh dài)</th><th scope="col">Xác suất (nhiệt độ ${ST.T.toFixed(1)})</th></tr>` + info.d.slice(0, 10).map((x) => `<tr><td><b>${x.w === "." ? "· (hết câu)" : x.w}</b></td><td>${x.c}</td><td>${(x.p * 100).toFixed(1)}%</td></tr>`).join("") + "</table>" : "<p class='small muted'>Không có ứng viên nào.</p>";
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 40, B = 46, T = 14; ctx.clearRect(0, 0, W, H); ctx.font = "11px JetBrains Mono, monospace";
    [0, 0.25, 0.5, 0.75, 1].forEach((v) => { const y = T + (1 - v) * (H - T - B); ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - 8, y); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(v * 100) + "%", 2, y + 4); });
    const g = ST.out.filter((o) => !o.prompt).slice(-24), bw = (W - L - 8) / 24;
    g.forEach((o, i) => { const h = o.p * (H - T - B), x = L + i * bw; ctx.fillStyle = o.p > 0.6 ? TH.mint : o.p > 0.25 ? TH.amber : TH.coral; ctx.fillRect(x + 2, H - B - h, bw - 4, h); ctx.save(); ctx.translate(x + bw / 2 + 4, H - B + 6); ctx.rotate(Math.PI / 3); ctx.fillStyle = TH.ink; ctx.font = "11px Be Vietnam Pro, sans-serif"; ctx.fillText(o.w, 0, 0); ctx.restore(); });
    if (!g.length) { ctx.fillStyle = TH.text; ctx.fillText("Chưa có chữ nào do máy viết", L + 10, H / 2); }
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${k("const")} nguCanh = cau.slice(-${n(ST.n)});        ${c("// " + ST.n + " token cuối")}
${k("const")} dem = bangDem[nguCanh]${ST.backoff ? " ⊕ nguCanhNganHon" : ""};  ${c("// token nào hay theo sau")}
${k("const")} diem = dem.map(x =&gt; x.soLan ** (${n(1)} / ${n(ST.T.toFixed(1))}));  ${c("// nhiệt độ")}
${k("const")} xacSuat = diem.map(v =&gt; v / tong(diem));
cau.push(bocTham(dem, xacSuat));          ${c("// quay vòng may mắn")}`;
  }

  // ---------- điều khiển ----------
  let autoT = 0; const syncs = [];
  function startAuto() { ST.auto = true; autoT = 0; $("bNote").dataset.lock = ""; delete $("bNote").dataset.lock; refresh(); }
  function bind() {
    $("promptBtns").innerHTML = PROMPTS.map((p) => `<button class="btn small ghost" data-p="${p}">${p}…</button>`).join("");
    $("promptBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { setPrompt(b.dataset.p); $("promptIn").value = b.dataset.p; }));
    $("promptIn").addEventListener("keydown", (e) => { if (e.key === "Enter") { setPrompt($("promptIn").value); startAuto(); } });
    $("btnStep").onclick = () => { ST.auto = false; if (genCount() >= 28) setPrompt($("promptIn").value || "em thích"); step(); ST.pulse = 1; };
    $("btnAuto").onclick = () => { if (ST.out.length && ST.out[ST.out.length - 1].w === ".") setPrompt($("promptIn").value || "em thích"); startAuto(); };
    $("btnClear").onclick = () => setPrompt($("promptIn").value || "");
    $("btnLie").onclick = () => { Object.assign(ST, DEF); sync(); $("promptIn").value = "thủ đô của lào là"; setPrompt("thủ đô của lào là"); startAuto(); $("lieBox").hidden = false; prog.done("lie"); };
    stage.addEventListener("click", (e) => { const r = stage.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 640, y = ((e.clientY - r.top) / r.height) * 480; const nd = NODES.find((q) => x >= q.x && x <= q.x + q.w && y >= q.y && y <= q.y + q.h); if (!nd) return; ST.auto = false; let info = predict(); addToken(nd.path[0], info); if (nd.path[1]) addToken(nd.path[1], nd.sub); ST.pulse = 1; prog.done("pick"); });
    syncs.push(P.range("T", () => ST.T, (v) => (ST.T = v), (v) => v.toFixed(1), refresh));
    syncs.push(P.range("n", () => ST.n, (v) => (ST.n = v), (v) => v + " token", refresh));
    syncs.push(P.range("topK", () => ST.topK, (v) => (ST.topK = v), (v) => (v ? v : "tất cả"), refresh));
    $("backoff").onchange = (e) => { ST.backoff = e.target.checked; refresh(); };
    $("btnTeach").onclick = () => { const lines = $("teachIn").value.split(/\n|(?<=\.)/).map((s) => s.trim()).filter((s) => s.length > 3); if (!lines.length) return; ST.extra.push(...lines); train(); refresh(); $("teachInfo").textContent = `Đã dạy thêm ${ST.extra.length} câu. Kho dữ liệu bây giờ có ${NTOK.toLocaleString("vi-VN")} token.`; prog.done("teach"); };
    const sync = () => { syncs.forEach((f) => f()); $("backoff").checked = ST.backoff; refresh(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); $("lieBox").hidden = true;
      const pr = { hot: "em thích", cold: "em", parrot: "trời hôm nay" }[k];
      if (k === "hot") { ST.T = 3; ST.n = 1; } if (k === "cold") { ST.T = 0; ST.n = 1; } if (k === "parrot") { ST.n = 4; ST.T = 1; ST.backoff = false; }
      sync(); $("promptIn").value = pr; setPrompt(pr); startAuto(); prog.done("broke"); $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); sync(); setPrompt("em thích"); startAuto(); };
    sync();
  }

  const QUIZ = [
    { q: "Một mô hình ngôn ngữ như ở dự án này thật ra làm việc gì?", o: ["Hiểu ý nghĩa câu như con người", "Đoán token tiếp theo dựa trên xác suất học từ dữ liệu, rồi lặp lại", "Tra từ điển", "Chép lại câu có sẵn"], a: 1, e: "Các chatbot lớn cũng làm đúng việc này, chỉ là với mạng nơ-ron khổng lồ, ngữ cảnh rất dài và dữ liệu cực nhiều." },
    { q: "Tăng nhiệt độ lên rất cao thì câu viết ra sẽ…", o: ["Chính xác hơn", "Lộn xộn, khó hiểu, vì các token hiếm cũng có cơ hội gần bằng token hay gặp", "Lặp lại một câu mãi", "Ngắn hơn"], a: 1, e: "Nhiệt độ cao san đều xác suất. Nhiệt độ thấp thì ngược lại: an toàn nhưng dễ lặp." },
    { q: "Với nhiệt độ 0, máy luôn chọn token có xác suất cao nhất. Điều gì dễ xảy ra?", o: ["Câu rất sáng tạo", "Máy rơi vào vòng lặp, viết đi viết lại một cụm", "Máy dừng ngay", "Máy viết tiếng Anh"], a: 1, e: "Khi ngữ cảnh ngắn, cùng một ngữ cảnh luôn dẫn tới cùng một token, nên câu quay vòng." },
    { q: "Hỏi \"thủ đô của lào là\", máy trả lời \"băng cốc\" dù dữ liệu chưa từng nói về Lào. Đây là…", o: ["Máy đã tra mạng", "Ảo giác (bịa): máy ghép tiếp chữ nghe hợp lý theo xác suất, không kiểm tra đúng sai", "Máy cố tình nói dối", "Lỗi bàn phím"], a: 1, e: "Mô hình chỉ biết chữ nào hay đi sau chữ nào. Câu trôi chảy không có nghĩa là đúng; luôn kiểm tra lại với nguồn tin cậy." },
    { q: "Ngữ cảnh dài 4 token trên một kho dữ liệu nhỏ làm máy…", o: ["Thông minh hơn hẳn", "Chép nguyên văn các câu trong dữ liệu (học vẹt), vì mỗi ngữ cảnh dài chỉ gặp đúng một lần", "Không viết được gì", "Viết sai chính tả"], a: 1, e: "Ngữ cảnh dài cần rất nhiều dữ liệu. Đây cũng là lý do các mô hình lớn cần học từ lượng chữ khổng lồ." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now(), slow = 0, tuVisible = false; P.visible($("tu-lam"), (v) => (tuVisible = v));
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; ST.pulse = Math.max(0, (ST.pulse || 0) - dt);
    if (ST.auto) { autoT += dt; if (autoT > 0.4) { autoT = 0; ST.pulse = 0.35; const go = step(); if (!go || genCount() >= 28) { ST.auto = false; refresh(); } } }
    renderStage();
    if (soiVisible) renderSoi();
    if (now - slow > 200) { slow = now; if (soiVisible) soiLive(); if (tuVisible) renderLab(); }
    requestAnimationFrame(tick);
  }
  P.nav(); train(); bind(); $("promptIn").value = "trời hôm nay"; setPrompt("trời hôm nay"); startAuto();
  window.__hka16 = { ST, predict, train };
  requestAnimationFrame(tick);
})();
