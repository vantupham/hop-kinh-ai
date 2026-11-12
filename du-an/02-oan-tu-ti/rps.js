/* Hộp Kính AI · Dự án 02 · Oẳn tù tì với AI (đặc trưng + KNN) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, H = HandSim;
  const CLS = ["bua", "keo", "bao"];
  const NAME = { bua: "Búa", keo: "Kéo", bao: "Bao", chi: "Chỉ tay", like: "Like", ok: "OK", "?": "Không biết" };
  const COL = { bua: "#ff7d5f", keo: "#9184ff", bao: "#3ee9cf", "?": "#8c92c8" };
  const BEATS = { bua: "keo", keo: "bao", bao: "bua" };
  const prog = P.progress("hka-02");

  const ST = {
    src: "sim", gesture: "keo", curl: [0.85, 0, 0, 1, 1], rot: 0, size: 115, shake: 2, t: 0,
    lm: null, feat: [0, 0, 0, 0, 0], data: [], K: 5, allowUnknown: false, unk: 0.35,
    pred: null, probs: {}, nbrs: [], nearest: 0, ax: 1, ay: 3,
    game: null, score: [0, 0], rounds: 0, wrongSeen: false
  };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d");
  const scat = $("scatter"), scx = scat.getContext("2d"), video = $("video");

  // ---------- dữ liệu ----------
  function sample(g, opt) {
    opt = opt || {};
    const base = H.GESTURES[g], c = base.map((v) => Math.max(0, Math.min(1, v + (Math.random() - 0.5) * 0.45)));
    const p = H.frame(c, 320, 330, 80 + Math.random() * 70, (Math.random() - 0.5) * 60, 2);
    return H.features(p);
  }
  function seed(counts) {
    ST.data = [];
    CLS.forEach((c) => { for (let i = 0; i < (counts ? counts[c] : 12); i++) ST.data.push({ f: sample(c), y: c }); });
    renderData();
  }

  // ---------- KNN ----------
  const dist = (a, b) => Math.sqrt(a.reduce((s, v, i) => s + (v - b[i]) ** 2, 0));
  function knn(f) {
    if (!ST.data.length) return { pred: null, probs: {}, nbrs: [], nearest: 0 };
    const ds = ST.data.map((m, i) => ({ i, d: dist(f, m.f), y: m.y })).sort((a, b) => a.d - b.d);
    const nb = ds.slice(0, Math.min(ST.K, ds.length)), votes = {};
    nb.forEach((n) => (votes[n.y] = (votes[n.y] || 0) + 1));
    let pred = nb[0].y, best = 0;
    for (const c of CLS) if ((votes[c] || 0) > best) { best = votes[c]; pred = c; }
    const probs = {}; CLS.forEach((c) => (probs[c] = (votes[c] || 0) / nb.length));
    if (ST.allowUnknown && nb[0].d > ST.unk) pred = "?";
    return { pred, probs, nbrs: nb, nearest: nb[0].d };
  }

  // ---------- nguồn hình ----------
  let landmarker = null, stream = null, lastVT = -1;
  function frameSim(dt) {
    ST.t += dt;
    const target = H.GESTURES[ST.gesture];
    ST.curl = ST.curl.map((v, i) => v + (target[i] - v) * Math.min(1, dt * 8) + Math.sin(ST.t * 2 + i) * 0.004);
    const wob = Math.sin(ST.t * 1.3) * 3;
    return H.frame(ST.curl, 320 + Math.sin(ST.t * 0.7) * 6, 340, ST.size, ST.rot + wob, ST.shake * 0.6);
  }
  function frameCam() {
    if (!landmarker || video.readyState < 2) return ST.lm;
    if (video.currentTime === lastVT) return ST.lm; lastVT = video.currentTime;
    const r = landmarker.detectForVideo(video, performance.now()), p = r.landmarks && r.landmarks[0];
    if (!p) return null;
    return p.map((q) => ({ x: (1 - q.x) * stage.width, y: q.y * stage.height, z: 0, v: 1 }));
  }
  async function useCam() {
    P.msg($("stageMsg"), "Đang tải mô hình AI bàn tay (khoảng 8 MB, chỉ tải lần đầu)…", "loader");
    try {
      landmarker = await P.vision("hand"); stream = await P.camera(video);
      ST.src = "cam"; P.srcButtons("cam"); P.msg($("stageMsg"), null);
    } catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; ST.src = "sim"; P.srcButtons("sim"); }

  // ---------- vẽ ----------
  function drawImage(ctx, fade) {
    if (ST.src === "sim") { D.room(ctx, P.TH.dark); if (ST.lm) H.drawHand(ctx, ST.lm, ST.size); }
    else if (video.readyState >= 2) { ctx.save(); ctx.translate(ctx.canvas.width, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, ctx.canvas.width, ctx.canvas.height); ctx.restore(); }
    else D.labBg(ctx);
    if (fade) { ctx.fillStyle = `rgba(14,16,40,${fade})`; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); }
  }
  function hud(ctx) {
    const W = ctx.canvas.width;
    ctx.fillStyle = "rgba(10,12,38,.82)"; D.rr(ctx, 14, 14, 176, 64, 14); ctx.fill();
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText("AI ĐOÁN", 28, 34);
    ctx.fillStyle = ST.pred ? COL[ST.pred] : "#fff"; ctx.font = "800 26px Be Vietnam Pro, sans-serif"; ctx.fillText(ST.pred ? NAME[ST.pred] : "—", 28, 64);
    if (ST.pred && ST.pred !== "?") { ctx.fillStyle = "#8f96d4"; ctx.font = "600 13px JetBrains Mono"; ctx.fillText(Math.round(ST.probs[ST.pred] * 100) + "%", 138, 64); }
    const g = ST.game;
    if (g) {
      const el = performance.now() - g.start;
      if (el < 2400) { const n = 3 - Math.floor(el / 800); ctx.fillStyle = "rgba(10,12,38,.55)"; ctx.fillRect(0, 0, W, ctx.canvas.height); ctx.fillStyle = "#fff"; ctx.font = "800 120px Be Vietnam Pro"; ctx.textAlign = "center"; ctx.fillText(n, W / 2, 290); ctx.font = "700 20px Be Vietnam Pro"; ctx.fillText(["Oẳn", "tù", "tì!"][3 - n] || "", W / 2, 340); ctx.textAlign = "left"; }
      else if (g.res) {
        ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, W - 214, 14, 200, 92, 14); ctx.fill();
        ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono"; ctx.fillText("MÁY RA", W - 198, 34);
        ctx.fillStyle = COL[g.cpu]; ctx.font = "800 24px Be Vietnam Pro"; ctx.fillText(NAME[g.cpu], W - 198, 62);
        ctx.fillStyle = g.res === "win" ? "#3ee9cf" : g.res === "lose" ? "#ff7d5f" : "#ffc34d"; ctx.font = "700 15px Be Vietnam Pro";
        ctx.fillText(g.res === "win" ? "Em thắng!" : g.res === "lose" ? "Máy thắng!" : g.res === "draw" ? "Hòa!" : "AI không đọc được tay", W - 198, 92);
      }
    }
  }
  function renderStage() {
    drawImage(sctx);
    if (ST.lm) H.drawSkeleton(sctx, ST.lm);
    hud(sctx);
  }
  function scatterDraw(ctx, big) {
    const W = ctx.canvas.width, Hh = ctx.canvas.height, L = 56, B = 50, T = 20, R = 20, TH = P.TH;
    const X = (v) => L + v * (W - L - R), Y = (v) => Hh - B - v * (Hh - B - T);
    ctx.clearRect(0, 0, W, Hh);
    if (big) D.labBg(ctx);
    ctx.strokeStyle = big ? "#2a2f70" : TH.grid; ctx.lineWidth = 1; ctx.font = "12px JetBrains Mono, monospace"; ctx.fillStyle = big ? "#8f96d4" : TH.text;
    for (let i = 0; i <= 4; i++) { const v = i / 4; ctx.beginPath(); ctx.moveTo(X(v), T); ctx.lineTo(X(v), Hh - B); ctx.stroke(); ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.fillText(v.toFixed(2), X(v) - 14, Hh - B + 18); ctx.fillText(v.toFixed(2), 22, Y(v) + 4); }
    ctx.font = "700 13px Be Vietnam Pro, sans-serif";
    ctx.fillText(H.FINGERS[ST.ax] + " duỗi →", W / 2 - 50, Hh - 10);
    ctx.save(); ctx.translate(14, Hh / 2 + 50); ctx.rotate(-Math.PI / 2); ctx.fillText(H.FINGERS[ST.ay] + " duỗi →", 0, 0); ctx.restore();
    const jit = (i, k) => ((Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1) * 0.025;
    ST.data.forEach((m, i) => { ctx.fillStyle = COL[m.y]; ctx.globalAlpha = .85; ctx.beginPath(); ctx.arc(X(m.f[ST.ax] + jit(i, 1)), Y(m.f[ST.ay] + jit(i, 2)), 6, 0, 7); ctx.fill(); });
    ctx.globalAlpha = 1;
    if (ST.lm) {
      const cx = X(ST.feat[ST.ax]), cy = Y(ST.feat[ST.ay]);
      ctx.strokeStyle = big ? "#ffffff" : TH.ink; ctx.lineWidth = 1.5;
      ST.nbrs.forEach((n) => { const m = ST.data[n.i]; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(X(m.f[ST.ax] + jit(n.i, 1)), Y(m.f[ST.ay] + jit(n.i, 2))); ctx.stroke(); ctx.beginPath(); ctx.arc(X(m.f[ST.ax] + jit(n.i, 1)), Y(m.f[ST.ay] + jit(n.i, 2)), 9, 0, 7); ctx.stroke(); });
      star(ctx, cx, cy, 13, ST.pred ? COL[ST.pred] : "#ffc34d");
    }
  }
  function star(ctx, x, y, r, col) {
    ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh bàn tay", e: "image", d: "Camera gửi tới AI một bảng điểm ảnh. Ở dự án này, ta dùng mô hình <b>MediaPipe Hand</b>, đã được huấn luyện từ trước để tìm bàn tay trong ảnh." },
    { t: "21 điểm mốc", e: "robot", d: "Mô hình trả về <b>21 điểm</b>: cổ tay (0) và 4 khớp cho mỗi ngón. Đầu các ngón là điểm 4, 8, 12, 16, 20 (màu cam)." },
    { t: "Đo độ duỗi", e: "angle", d: "Với mỗi ngón, ta đo khoảng cách từ đầu ngón tới cổ tay rồi <b>chia cho cỡ bàn tay</b> (đường vàng). Nhờ vậy tay gần hay xa camera vẫn cho cùng một con số." },
    { t: "Vector 5 số", e: "layers", d: "Cả bàn tay giờ chỉ còn <b>5 con số từ 0 đến 1</b>. Đó là \"vân tay\" của cử chỉ, máy gọi nó là <b>vector đặc trưng</b>." },
    { t: "Tìm K hàng xóm", e: "crosshair", d: "Máy đo khoảng cách từ vector hiện tại tới <b>từng mẫu</b> trong dữ liệu đã học, rồi giữ lại K mẫu gần nhất." },
    { t: "Bỏ phiếu", e: "checkCircle", d: "Mỗi hàng xóm bỏ một phiếu cho nhãn của mình. Nhãn <b>nhiều phiếu nhất</b> là câu trả lời, và tỉ lệ phiếu là độ tự tin." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 1) prog.done("see"); });
  P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const s = pipe.get(), ctx = octx, p = ST.lm;
    if (s === 0) { drawImage(ctx); return; }
    if (s === 1) { drawImage(ctx, .5); if (p) H.drawSkeleton(ctx, p, { idx: true }); return; }
    if (s === 2) {
      drawImage(ctx, .6); if (!p) return;
      H.drawSkeleton(ctx, p, { dim: true });
      ctx.setLineDash([6, 5]); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y); ctx.lineTo(p[9].x, p[9].y); ctx.stroke(); ctx.setLineDash([]);
      const pairs = [[4, 17], [8, 0], [12, 0], [16, 0], [20, 0]], cols = ["#ff7d5f", "#9184ff", "#3ee9cf", "#ffc34d", "#ff6f9e"];
      pairs.forEach(([a, b], i) => { D.arrow(ctx, p[b], p[a], cols[i], 3); D.pill(ctx, ST.feat[i].toFixed(2), p[a].x, p[a].y - 22, cols[i], 12); });
      return;
    }
    if (s === 3) {
      D.labBg(ctx); const W = ctx.canvas.width, Hh = ctx.canvas.height, cols = ["#ff7d5f", "#9184ff", "#3ee9cf", "#ffc34d", "#ff6f9e"];
      ST.feat.forEach((v, i) => {
        const x = 70 + i * 110, h = v * 280;
        ctx.fillStyle = "#232866"; D.rr(ctx, x, 100, 60, 280, 10); ctx.fill();
        ctx.fillStyle = cols[i]; D.rr(ctx, x, 380 - h, 60, Math.max(8, h), 10); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "700 16px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText(v.toFixed(2), x + 30, 90);
        ctx.fillStyle = "#8f96d4"; ctx.font = "600 12px Be Vietnam Pro"; ctx.fillText(H.FINGERS[i].replace("Ngón ", ""), x + 30, 404); ctx.textAlign = "left";
      });
      ctx.fillStyle = "#5ef2d6"; ctx.font = "700 18px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText("[ " + ST.feat.map((v) => v.toFixed(2)).join(", ") + " ]", W / 2, 450); ctx.textAlign = "left";
      return;
    }
    if (s === 4) { scatterDraw(ctx, true); return; }
    // bỏ phiếu: các thùng phiếu
    D.labBg(ctx); const W = ctx.canvas.width;
    CLS.forEach((c, k) => {
      const x = 50 + k * 190, n = ST.nbrs.filter((q) => q.y === c).length, win = ST.pred === c;
      ctx.strokeStyle = COL[c]; ctx.lineWidth = win ? 5 : 2; D.rr(ctx, x, 150, 160, 240, 16); ctx.stroke();
      if (win) { ctx.fillStyle = COL[c] + "33"; ctx.fill(); }
      for (let j = 0; j < n; j++) { ctx.fillStyle = COL[c]; D.rr(ctx, x + 20 + (j % 3) * 42, 350 - Math.floor(j / 3) * 34, 34, 26, 6); ctx.fill(); }
      ctx.fillStyle = "#fff"; ctx.font = "800 22px Be Vietnam Pro"; ctx.textAlign = "center"; ctx.fillText(NAME[c], x + 80, 136); ctx.font = "700 16px JetBrains Mono"; ctx.fillText(n + " phiếu", x + 80, 420); ctx.textAlign = "left";
    });
    ctx.fillStyle = "#5ef2d6"; ctx.font = "800 26px Be Vietnam Pro"; ctx.textAlign = "center"; ctx.fillText(ST.pred ? "→ " + NAME[ST.pred] : "Chưa có dữ liệu", W / 2, 70); ctx.textAlign = "left";
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"), p = ST.lm; if (!p) { el.textContent = "Đang chờ bàn tay…"; return; }
    const f = (v) => v.toFixed(0);
    if (s === 0) el.innerHTML = `Ảnh <span class="hl">640 × 480</span> = 921.600 con số màu\nMô hình cần tìm: <span class="hl">1 bàn tay</span>`;
    else if (s === 1) el.innerHTML = `AI trả về <span class="hl">21 điểm × (x, y)</span> = 42 con số\n` + [[0, "cổ tay"], [4, "đầu ngón cái"], [8, "đầu ngón trỏ"], [12, "đầu ngón giữa"]].map(([i, n]) => `#${String(i).padStart(2, " ")} ${n.padEnd(14, " ")} (${f(p[i].x)}, ${f(p[i].y)})`).join("\n");
    else if (s === 2) { const palm = Math.hypot(p[0].x - p[9].x, p[0].y - p[9].y); el.innerHTML = `Cỡ bàn tay (0→9) = <span class="w">${f(palm)} px</span>\nĐầu ngón trỏ → cổ tay = ${f(Math.hypot(p[8].x - p[0].x, p[8].y - p[0].y))} px\nTỉ lệ = ${(Math.hypot(p[8].x - p[0].x, p[8].y - p[0].y) / palm).toFixed(2)} → quy về 0–1 = <span class="hl">${ST.feat[1].toFixed(2)}</span>`; }
    else if (s === 3) el.innerHTML = `vector = [${ST.feat.map((v) => `<span class="hl">${v.toFixed(2)}</span>`).join(", ")}]\n(cái, trỏ, giữa, áp út, út)`;
    else if (s === 4) el.innerHTML = `Đã so với <span class="hl">${ST.data.length}</span> mẫu, giữ K = <span class="w">${ST.K}</span> mẫu gần nhất:\n` + ST.nbrs.slice(0, 5).map((n, i) => `${i + 1}. ${NAME[n.y].padEnd(4, " ")} khoảng cách ${n.d.toFixed(3)}`).join("\n") + (ST.nbrs.length > 5 ? "\n…" : "");
    else el.innerHTML = CLS.map((c) => `${NAME[c].padEnd(4, " ")} ${"█".repeat(ST.nbrs.filter((q) => q.y === c).length).padEnd(15, "·")} ${Math.round((ST.probs[c] || 0) * 100)}%`).join("\n") + `\nKết quả: <span class="hl">${ST.pred ? NAME[ST.pred] : "—"}</span>` + (ST.pred === "?" ? `  (hàng xóm gần nhất cách ${ST.nearest.toFixed(2)})` : "");
  }

  // ---------- bảng não AI ----------
  function renderBrain() {
    $("bResult").innerHTML = `<small>AI ĐOÁN</small><span style="color:${ST.pred ? COL[ST.pred] : "#fff"}">${ST.pred ? NAME[ST.pred] : "—"}</span>`;
    $("bProbs").innerHTML = CLS.map((c) => `<div class="r"><span>${NAME[c]}</span><span class="bar"><i style="width:${(ST.probs[c] || 0) * 100}%;background:${COL[c]}"></i></span><span>${Math.round((ST.probs[c] || 0) * 100)}%</span></div>`).join("");
    $("bFeat").innerHTML = ST.feat.map((v, i) => `<div class="r"><span>${H.FINGERS[i].replace("Ngón ", "")}</span><span class="bar"><i style="width:${v * 100}%;background:#5ef2d6"></i></span><span>${v.toFixed(2)}</span></div>`).join("");
    $("bK").textContent = ST.K; $("bN").textContent = ST.data.length;
  }
  function renderData() {
    $("dataCount").innerHTML = CLS.map((c) => `<span class="chip" style="background:${COL[c]}22;color:${COL[c]}"><span class="cls-dot" style="background:${COL[c]}"></span>${NAME[c]}: ${ST.data.filter((m) => m.y === c).length} mẫu</span>`).join("");
    if (CLS.every((c) => ST.data.filter((m) => m.y === c && m.own).length >= 5)) prog.done("data");
  }
  function genCode() {
    $("genCode").innerHTML =
`<span class="c">// KNN: đoán nhãn bằng cách hỏi K hàng xóm gần nhất</span>
<span class="k">function</span> duDoan(diemMoi, duLieu, K = <span class="n">${ST.K}</span>) {
  <span class="c">// 1. đo khoảng cách tới từng mẫu (${ST.data.length} mẫu)</span>
  <span class="k">const</span> ds = duLieu.map(m => ({ nhan: m.nhan, kc: khoangCach(diemMoi, m.dacTrung) }));
  <span class="c">// 2. sắp xếp và lấy K mẫu gần nhất</span>
  ds.sort((a, b) => a.kc - b.kc);
  <span class="k">const</span> hangXom = ds.slice(<span class="n">0</span>, K);${ST.allowUnknown ? `
  <span class="c">// 2b. nếu cả mẫu gần nhất cũng quá xa → thừa nhận không biết</span>
  <span class="k">if</span> (hangXom[<span class="n">0</span>].kc &gt; <span class="n">${ST.unk.toFixed(2)}</span>) <span class="k">return</span> <span class="s">"Không biết"</span>;` : ""}
  <span class="c">// 3. bỏ phiếu</span>
  <span class="k">return</span> nhanNhieuPhieuNhat(hangXom);
}
<span class="k">function</span> khoangCach(a, b) {  <span class="c">// Pythagoras trong 5 chiều</span>
  <span class="k">return</span> Math.sqrt(a.reduce((tong, ai, i) => tong + (ai - b[i]) ** <span class="n">2</span>, <span class="n">0</span>));
}`;
  }

  // ---------- kiểm tra độ chính xác ----------
  function runTest() {
    const M = {}; CLS.forEach((a) => { M[a] = {}; [...CLS, "?"].forEach((b) => (M[a][b] = 0)); });
    let ok = 0, n = 0;
    CLS.forEach((c) => { for (let i = 0; i < 30; i++) { const r = knn(sample(c)); M[c][r.pred || "?"]++; if (r.pred === c) ok++; n++; } });
    const cols = ST.allowUnknown ? [...CLS, "?"] : CLS;
    let h = `<div class="lab" style="font-size:.8rem"><div class="lbl">ĐỘ CHÍNH XÁC</div><div class="big" style="font-size:2rem">${Math.round(ok / n * 100)}%</div><div class="lbl" style="margin-top:10px">MA TRẬN NHẦM LẪN (hàng = đáp án đúng, cột = AI đoán)</div><table class="coords"><tr><td></td>${cols.map((c) => `<td style="color:${COL[c]}">${NAME[c]}</td>`).join("")}</tr>`;
    CLS.forEach((a) => { h += `<tr><td style="color:${COL[a]}">${NAME[a]}</td>${cols.map((b) => `<td style="background:${a === b ? "rgba(94,242,214," : "rgba(255,125,95,"}${(M[a][b] / 30 * .55).toFixed(2)})">${M[a][b]}</td>`).join("")}</tr>`; });
    $("testOut").innerHTML = h + "</table></div>";
    if (ok < n) ST.wrongSeen = true;
  }

  // ---------- trò chơi ----------
  function play() {
    if (ST.game && !ST.game.res) return;
    ST.game = { start: performance.now(), cpu: CLS[Math.floor(Math.random() * 3)], res: null };
    $("gameMsg").textContent = "Oẳn… tù… tì!";
    setTimeout(() => {
      const g = ST.game, me = ST.pred;
      if (!me || me === "?" || !CLS.includes(me)) g.res = "unk";
      else if (me === g.cpu) g.res = "draw";
      else g.res = BEATS[me] === g.cpu ? "win" : "lose";
      if (g.res === "win") ST.score[0]++; if (g.res === "lose") ST.score[1]++;
      ST.rounds++; if (ST.rounds >= 3) prog.done("play");
      $("gameScore").textContent = `Em ${ST.score[0]} – ${ST.score[1]} Máy`;
      $("gameMsg").textContent = g.res === "unk" ? "AI không đọc được cử chỉ của em." : `AI thấy em ra ${NAME[me]}, máy ra ${NAME[g.cpu]}.`;
      if (ST.src === "sim" && me !== ST.gesture && CLS.includes(ST.gesture)) { ST.wrongSeen = true; prog.done("broke"); }
    }, 2400);
  }

  // ---------- giao diện ----------
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    const gb = $("gestBtns");
    gb.innerHTML = ["bua", "keo", "bao", "chi", "like"].map((g) => `<button class="btn small ghost" data-g="${g}">${NAME[g]}</button>`).join("");
    const mark = () => gb.querySelectorAll("button").forEach((b) => { const on = b.dataset.g === ST.gesture; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); });
    gb.querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.gesture = b.dataset.g; mark(); }));
    mark();
    P.range("rot", () => ST.rot, (v) => (ST.rot = v), (v) => v + "°");
    P.range("size", () => ST.size, (v) => (ST.size = v), (v) => (v > 120 ? "gần" : v > 85 ? "vừa" : "xa"));
    P.range("shake", () => ST.shake, (v) => (ST.shake = v), (v) => (v < 3 ? "ít" : v < 7 ? "vừa" : "nhiều"));
    const syncK = P.range("k", () => ST.K, (v) => (ST.K = v), (v) => v, genCode);
    const syncU = P.range("unk", () => ST.unk, (v) => (ST.unk = v), (v) => v.toFixed(2), genCode);
    $("allowUnknown").onchange = (e) => { ST.allowUnknown = e.target.checked; genCode(); };
    $("btnPlay").onclick = play;
    const opts = H.FINGERS.map((n, i) => `<option value="${i}">${n}</option>`).join("");
    $("axX").innerHTML = opts; $("axY").innerHTML = opts; $("axX").value = ST.ax; $("axY").value = ST.ay;
    $("axX").onchange = (e) => (ST.ax = +e.target.value); $("axY").onchange = (e) => (ST.ay = +e.target.value);
    $("addBtns").innerHTML = CLS.map((c) => `<button class="btn small cls-btn" style="background:${COL[c]};color:#0a0b1e" data-c="${c}"><i data-i="upload"></i>Ghi mẫu ${NAME[c]}</button>`).join("");
    HKA.hydrate($("addBtns"));
    $("addBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { if (!ST.lm) return; ST.data.push({ f: ST.feat.slice(), y: b.dataset.c, own: true }); renderData(); }));
    $("btnSeed").onclick = () => seed();
    $("btnClear").onclick = () => { ST.data = []; renderData(); };
    $("btnTest").onclick = runTest;
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      if (k === "skew") { seed({ bua: 20, keo: 2, bao: 12 }); ST.K = 9; ST.gesture = "keo"; }
      if (k === "noise") { seed(); ST.data.forEach((m) => { if (Math.random() < 0.3) m.y = CLS[Math.floor(Math.random() * 3)]; }); ST.K = 1; }
      if (k === "unknown") { seed(); ST.gesture = "like"; ST.allowUnknown = false; $("allowUnknown").checked = false; }
      if (ST.src !== "sim") useSim();
      syncK(); syncU(); mark(); genCode(); renderData(); prog.done("broke");
      $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); seed(); ST.K = 5; syncK(); genCode(); };
  }

  const QUIZ = [
    { q: "Vì sao ta chia khoảng cách đầu ngón – cổ tay cho \"cỡ bàn tay\"?", o: ["Để số nhỏ hơn cho dễ nhìn", "Để đặc trưng không thay đổi khi tay ở gần hay xa camera", "Vì MediaPipe yêu cầu", "Để máy chạy nhanh hơn"], a: 1, e: "Tay ở gần camera thì mọi khoảng cách đều lớn hơn. Chia cho cỡ tay sẽ khử ảnh hưởng đó, gọi là chuẩn hóa." },
    { q: "KNN đoán nhãn cho một bàn tay mới bằng cách nào?", o: ["Dùng luật if-else do lập trình viên viết", "Tìm K mẫu đã học giống nó nhất rồi cho chúng bỏ phiếu", "Đoán ngẫu nhiên", "Hỏi người dùng"], a: 1, e: "KNN không có luật: nó so sánh với các ví dụ đã học và để các ví dụ gần nhất bỏ phiếu." },
    { q: "Với K = 1, điều gì xảy ra nếu có vài mẫu bị gắn nhãn sai?", o: ["Không ảnh hưởng gì", "AI dễ đoán sai khi mẫu gần nhất là một mẫu bị gắn nhãn sai", "AI tự sửa nhãn", "AI dừng hoạt động"], a: 1, e: "K = 1 tin tuyệt đối vào đúng một hàng xóm. K lớn hơn giúp các mẫu đúng \"áp đảo\" mẫu sai." },
    { q: "Bộ dữ liệu có 20 mẫu Búa, 2 mẫu Kéo và K = 9. AI sẽ…", o: ["Đoán Kéo rất tốt", "Gần như không bao giờ đoán được Kéo", "Đoán chính xác 100%", "Đoán Bao nhiều hơn"], a: 1, e: "Dù hai mẫu Kéo gần nhất đều bỏ phiếu Kéo, vẫn còn 7 phiếu thuộc nhãn khác. Dữ liệu lệch gây ra AI thiên vị." },
    { q: "Em giơ ngón cái \"Like\", thứ AI chưa từng học. Một AI được thiết kế tốt nên…", o: ["Luôn chọn Búa", "Tự tin trả lời một trong ba nhãn", "Thừa nhận \"Không biết\" khi mẫu mới quá khác dữ liệu đã học", "Tự tắt"], a: 2, e: "AI chỉ biết những gì nó đã học. Biết nói \"không biết\" là một đức tính quan trọng của hệ thống AI an toàn." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now;
    ST.lm = ST.src === "sim" ? frameSim(dt) : frameCam();
    if (ST.lm) { ST.feat = H.features(ST.lm); Object.assign(ST, knn(ST.feat)); } else { ST.pred = null; ST.probs = {}; ST.nbrs = []; }
    renderStage(); scatterDraw(scx, false);
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; renderBrain(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); bind(); seed(); genCode(); P.srcButtons("sim");
  requestAnimationFrame(tick);
})();
