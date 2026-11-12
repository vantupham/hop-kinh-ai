/* Hộp Kính AI · Dự án 03 · Họa sĩ không chạm (nhiễu, làm mượt, ngoại lai, độ trễ) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, H = HandSim;
  const prog = P.progress("hka-03");
  const W = 640, HH = 480;
  const DEF = { filter: "ema", N: 6, alpha: 0.7, outlier: true, jump: 60, sigma: 4, drop: 1 };
  const ST = {
    src: "sim", auto: true, ...DEF, show: { hand: true, raw: true, smooth: true, dots: false },
    tru: { x: 320, y: 240 }, raw: null, acc: null, sm: null, prevSm: null, pen: false, prevPen: false,
    buf: [], rawTrail: [], hist: [], time: 0, autoT: 0, curl: H.GESTURES.chi.slice(), lm: null, feat: [0, 0, 0, 0, 0],
    rejects: 0, rejectedNow: false, lag: null, jit: null, userSeg: 0, used: new Set(), ptr: { down: false, x: 320, y: 240, last: -1e9 }
  };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), video = $("video");
  const mk = () => { const c = document.createElement("canvas"); c.width = W; c.height = HH; return c; };
  const rawL = mk(), smL = mk(), rctx = rawL.getContext("2d"), mctx = smL.getContext("2d");
  const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  // ---------- đường mẫu tự vẽ ----------
  function shape(k, u) {
    if (k === 0) { const t = u * Math.PI * 2; return { x: 320 + 11 * 16 * Math.sin(t) ** 3, y: 225 - 11 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) }; }
    const s = 250, x0 = 320 - s / 2, y0 = 240 - s / 2, q = (u * 4) % 4, i = Math.floor(q), f = q - i;
    return [{ x: x0 + s * f, y: y0 }, { x: x0 + s, y: y0 + s * f }, { x: x0 + s - s * f, y: y0 + s }, { x: x0, y: y0 + s - s * f }][i];
  }
  const DRAW_T = 5, HOLD_T = 1.2;
  function autoStep(dt) {
    const cyc = DRAW_T + HOLD_T, k = Math.floor(ST.autoT / cyc) % 2, ph = ST.autoT % cyc;
    const prevK = Math.floor((ST.autoT - dt) / cyc) % 2;
    ST.autoT += dt;
    if (prevK !== k || ST.autoT < dt * 1.5) clearArt();
    if (ph < DRAW_T) { ST.pen = true; return shape(k, ph / DRAW_T); }
    ST.pen = false; return shape(k, 1);
  }
  function clearArt() { rctx.clearRect(0, 0, W, HH); mctx.clearRect(0, 0, W, HH); ST.prevPen = false; }

  // ---------- 1 khung hình ----------
  let landmarker = null, stream = null, lastVT = -1, camLm = null;
  function step(dt) {
    ST.time += dt;
    let rawPt = null;
    if (ST.src === "sim") {
      if (ST.auto) ST.tru = autoStep(dt);
      else { ST.tru = { x: ST.ptr.x, y: ST.ptr.y }; ST.pen = ST.ptr.down; }
      // bàn tay ảo: đặt sao cho đầu ngón trỏ (#8) đúng vị trí tay thật
      const tgt = ST.pen ? H.GESTURES.chi : H.GESTURES.bao;
      ST.curl = ST.curl.map((v, i) => v + (tgt[i] - v) * Math.min(1, dt * 10));
      const lm = H.frame(ST.curl, 0, 0, 95, -12, 0), tip = lm[8];
      ST.lm = lm.map((p) => ({ ...p, x: p.x - tip.x + ST.tru.x, y: p.y - tip.y + ST.tru.y }));
      // AI "nhìn" qua camera rung: thêm nhiễu và thỉnh thoảng nhận nhầm
      rawPt = { x: ST.tru.x + gauss() * ST.sigma, y: ST.tru.y + gauss() * ST.sigma };
      if (Math.random() < ST.drop / 100) { const a = Math.random() * 6.28, r = 90 + Math.random() * 120; rawPt.x += Math.cos(a) * r; rawPt.y += Math.sin(a) * r; }
    } else {
      if (landmarker && video.readyState >= 2 && video.currentTime !== lastVT) {
        lastVT = video.currentTime;
        const r = landmarker.detectForVideo(video, performance.now()), p = r.landmarks && r.landmarks[0];
        camLm = p ? p.map((q) => ({ x: (1 - q.x) * W, y: q.y * HH, z: 0, v: 1 })) : null;
      }
      ST.lm = camLm; ST.tru = null;
      if (camLm) {
        rawPt = { x: camLm[8].x, y: camLm[8].y };
        const f = H.features(camLm);
        if (!ST.pen && f[1] > 0.55 && f[2] < 0.35) ST.pen = true;
        else if (ST.pen && (f[1] < 0.4 || f[2] > 0.5)) ST.pen = false;
      } else ST.pen = false;
    }
    if (ST.lm) ST.feat = H.features(ST.lm);
    if (!rawPt) return;
    ST.raw = rawPt;
    ST.rawTrail.push(rawPt); if (ST.rawTrail.length > 40) ST.rawTrail.shift();
    // bỏ điểm ngoại lai
    ST.rejectedNow = false;
    if (ST.outlier && ST.acc && dist(rawPt, ST.acc) > ST.jump && ST.rejects < 6) { ST.rejects++; ST.rejectedNow = true; }
    else { ST.acc = rawPt; ST.rejects = 0; }
    // lọc
    ST.prevSm = ST.sm ? { ...ST.sm } : null;
    if (ST.filter === "none" || !ST.sm) ST.sm = { ...ST.acc };
    if (ST.filter === "ma") { ST.buf.push(ST.acc); while (ST.buf.length > ST.N) ST.buf.shift(); ST.sm = { x: ST.buf.reduce((s, p) => s + p.x, 0) / ST.buf.length, y: ST.buf.reduce((s, p) => s + p.y, 0) / ST.buf.length }; }
    else ST.buf = [ST.acc];
    if (ST.filter === "ema" && ST.prevSm) ST.sm = { x: ST.alpha * ST.prevSm.x + (1 - ST.alpha) * ST.acc.x, y: ST.alpha * ST.prevSm.y + (1 - ST.alpha) * ST.acc.y };
    // vẽ lên 2 lớp
    if (ST.pen && ST.prevPen && ST.lastRaw && ST.lastSm) {
      rctx.strokeStyle = "rgba(255,125,95,.75)"; rctx.lineWidth = 2; rctx.lineCap = "round";
      rctx.beginPath(); rctx.moveTo(ST.lastRaw.x, ST.lastRaw.y); rctx.lineTo(rawPt.x, rawPt.y); rctx.stroke();
      mctx.strokeStyle = "#7b6dff"; mctx.lineWidth = 7; mctx.lineCap = "round"; mctx.lineJoin = "round";
      mctx.beginPath(); mctx.moveTo(ST.lastSm.x, ST.lastSm.y); mctx.lineTo(ST.sm.x, ST.sm.y); mctx.stroke();
      if (!ST.auto) { ST.userSeg++; if (ST.userSeg > 90) prog.done("draw"); }
    }
    ST.prevPen = ST.pen; ST.lastRaw = rawPt; ST.lastSm = { ...ST.sm };
    ST.hist.push({ t: ST.time, tx: ST.tru ? ST.tru.x : null, ty: ST.tru ? ST.tru.y : null, rx: rawPt.x, sx: ST.sm.x, sy: ST.sm.y });
    while (ST.hist.length && ST.hist[0].t < ST.time - 5.2) ST.hist.shift();
  }

  // ---------- đo độ rung & độ trễ (chỉ được khi biết vị trí thật) ----------
  function metrics() {
    if (ST.src !== "sim") { ST.lag = ST.jit = null; return; }
    const h = ST.hist.filter((q) => q.t > ST.time - 2.5 && q.tx != null);
    if (h.length < 30) return;
    let path = 0; for (let i = 1; i < h.length; i++) path += Math.hypot(h[i].tx - h[i - 1].tx, h[i].ty - h[i - 1].ty);
    const speed = path / (h[h.length - 1].t - h[0].t);
    const errAt = (L) => {
      let j = 0, s = 0, n = 0;
      for (let i = 0; i < h.length; i++) {
        const tt = h[i].t - L; if (tt < h[0].t) continue;
        while (j < h.length - 1 && h[j + 1].t <= tt) j++;
        s += Math.hypot(h[i].sx - h[j].tx, h[i].sy - h[j].ty); n++;
      }
      return n ? s / n : 1e9;
    };
    if (speed < 40) { ST.lag = null; ST.jit = errAt(0); return; }
    let best = 1e9, bl = 0;
    for (let L = 0; L <= 0.6; L += 1 / 60) { const e = errAt(L); if (e < best) { best = e; bl = L; } }
    ST.lag = bl * 1000; ST.jit = best;
  }

  // ---------- vẽ ----------
  function drawScene(ctx) {
    if (ST.src === "sim") D.room(ctx, P.TH.dark);
    else if (video.readyState >= 2) { ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, W, HH); ctx.restore(); ctx.fillStyle = "rgba(14,16,40,.35)"; ctx.fillRect(0, 0, W, HH); }
    else D.labBg(ctx);
  }
  function renderStage() {
    const ctx = sctx; drawScene(ctx);
    if (ST.show.raw) ctx.drawImage(rawL, 0, 0);
    if (ST.show.smooth) ctx.drawImage(smL, 0, 0);
    if (ST.show.hand && ST.lm && ST.src === "sim") H.drawHand(ctx, ST.lm, 95);
    if (ST.show.hand && ST.lm && ST.src !== "sim") H.drawSkeleton(ctx, ST.lm, { dim: true });
    if (ST.show.dots) ST.rawTrail.forEach((p, i) => { ctx.fillStyle = `rgba(255,125,95,${0.2 + i / 50})`; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, 7); ctx.fill(); });
    if (ST.sm) { ctx.strokeStyle = ST.pen ? "#3ee9cf" : "#ffffff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(ST.sm.x, ST.sm.y, ST.pen ? 9 : 13, 0, 7); ctx.stroke(); }
    ctx.fillStyle = "rgba(10,12,38,.8)"; D.rr(ctx, 14, 14, 168, 40, 12); ctx.fill();
    ctx.fillStyle = ST.pen ? "#3ee9cf" : "#8f96d4"; ctx.beginPath(); ctx.arc(34, 34, 7, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.font = "700 14px Be Vietnam Pro, sans-serif"; ctx.fillText(ST.pen ? "Đang vẽ" : "Bút đang nhấc", 50, 39);
    if (ST.rejectedNow) D.pill(ctx, "BỎ ĐIỂM NHẢY XA", W / 2, 34, "#c2402a", 13);
  }
  // ---------- SOI ----------
  const SOI = [
    { t: "Vị trí thô", e: "crosshair", d: "Mỗi khung hình, mô hình bàn tay trả về vị trí đầu ngón trỏ (điểm #8). Nối các điểm đó lại, ta được một đường <b>run rẩy</b>, dù tay thật đi rất mượt." },
    { t: "Nhiễu", e: "pulse", d: "Phóng to quanh đầu ngón tay thật (dấu +): các điểm AI thấy tạo thành một <b>đám mây</b>. Độ rộng đám mây chính là mức nhiễu." },
    { t: "Trung bình N khung", e: "layers", d: "Lấy trung bình N điểm gần nhất (các đường nối). Lệch trái và lệch phải <b>triệt tiêu</b> nhau, nên điểm trung bình (tím) gần vị trí thật hơn." },
    { t: "EMA", e: "repeat", d: "Thay vì nhớ N điểm, EMA chỉ nhớ <b>một điểm mượt cũ</b>, rồi mỗi khung hình nhích về điểm mới một đoạn bằng (1 − α) quãng đường." },
    { t: "Mượt ↔ trễ", e: "clock", d: "So sánh đường tay thật (trắng đứt) với đường đã lọc (tím). Lọc càng mạnh thì đường tím càng <b>đi chậm phía sau</b> và cắt góc." },
    { t: "Bật / tắt bút", e: "figure", d: "Bút bật khi <b>ngón trỏ duỗi và ngón giữa co</b>. Ta dùng hai ngưỡng khác nhau để bật và tắt (vùng đệm), giống hệt bộ đếm squat ở Dự án 1." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 1) prog.done("see"); });
  P.visible($("soi"), (v) => (soiVisible = v));
  function cross(ctx, x, y, col, r) { ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r); ctx.stroke(); }
  function renderSoi() {
    const s = pipe.get(), ctx = octx; D.labBg(ctx);
    const T = ST.rawTrail;
    if (s === 0) {
      ctx.strokeStyle = "rgba(255,125,95,.7)"; ctx.lineWidth = 2; ctx.beginPath(); T.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y))); ctx.stroke();
      T.forEach((p, i) => { ctx.fillStyle = `rgba(255,125,95,${0.3 + i / 57})`; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, 7); ctx.fill(); });
      if (ST.raw) D.pill(ctx, `(${ST.raw.x.toFixed(0)}, ${ST.raw.y.toFixed(0)})`, ST.raw.x, ST.raw.y - 26, "#c2402a", 12);
    } else if (s === 1) {
      const cx = W / 2, cy = HH / 2, Z = 5;
      ctx.strokeStyle = "#2f3580"; for (let r = 20; r <= 200; r += 20 * 1) { ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke(); }
      let sx = 0, n = 0;
      const pairs = ST.pairs || [];
      pairs.forEach((d) => { ctx.fillStyle = "rgba(255,125,95,.75)"; ctx.beginPath(); ctx.arc(cx + d.x * Z, cy + d.y * Z, 5, 0, 7); ctx.fill(); sx += d.x * d.x + d.y * d.y; n++; });
      const sd = n ? Math.sqrt(sx / n) : 0; ST.sdEst = sd;
      ctx.strokeStyle = "#ffc34d"; ctx.setLineDash([6, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, Math.max(4, sd * Z), 0, 7); ctx.stroke(); ctx.setLineDash([]);
      cross(ctx, cx, cy, "#fff", 14);
      ctx.fillStyle = "#8f96d4"; ctx.font = "600 12px JetBrains Mono"; ctx.fillText("phóng to ×5 · mỗi vòng = 4 px", 16, HH - 16);
      if (ST.src !== "sim") { ctx.fillStyle = "#ffcf6b"; ctx.fillText("Ở chế độ camera không biết vị trí thật", 16, 28); }
    } else if (s === 2) {
      T.forEach((p) => { ctx.fillStyle = "rgba(255,125,95,.25)"; ctx.beginPath(); ctx.arc(p.x, p.y, 3.5, 0, 7); ctx.fill(); });
      const buf = ST.filter === "ma" ? ST.buf : T.slice(-ST.N);
      const m = { x: buf.reduce((s, p) => s + p.x, 0) / (buf.length || 1), y: buf.reduce((s, p) => s + p.y, 0) / (buf.length || 1) };
      buf.forEach((p) => { ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(m.x, m.y); ctx.stroke(); ctx.fillStyle = "#ff7d5f"; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 7); ctx.fill(); });
      ctx.fillStyle = "#9184ff"; ctx.beginPath(); ctx.arc(m.x, m.y, 9, 0, 7); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      if (ST.tru) cross(ctx, ST.tru.x, ST.tru.y, "#fff", 10);
      D.pill(ctx, `trung bình ${buf.length} điểm`, m.x, m.y - 30, "#5443ff", 12);
    } else if (s === 3) {
      if (ST.prevSm && ST.raw) {
        const a = ST.prevSm, r = ST.acc || ST.raw, al = ST.filter === "ema" ? ST.alpha : 0.7, n = { x: al * a.x + (1 - al) * r.x, y: al * a.y + (1 - al) * r.y };
        // phóng to quanh điểm mượt
        const Z = 3, cx = W / 2, cy = HH / 2, tr = (p) => ({ x: cx + (p.x - a.x) * Z, y: cy + (p.y - a.y) * Z });
        const A = tr(a), R = tr(r), N = tr(n);
        ctx.setLineDash([6, 5]); ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(R.x, R.y); ctx.stroke(); ctx.setLineDash([]);
        D.arrow(ctx, A, N, "#5ef2d6", 4);
        ctx.fillStyle = "#9184ff"; ctx.beginPath(); ctx.arc(A.x, A.y, 9, 0, 7); ctx.fill();
        ctx.fillStyle = "#ff7d5f"; ctx.beginPath(); ctx.arc(R.x, R.y, 9, 0, 7); ctx.fill();
        ctx.fillStyle = "#5ef2d6"; ctx.beginPath(); ctx.arc(N.x, N.y, 7, 0, 7); ctx.fill();
        D.pill(ctx, "mượt cũ", A.x, A.y + 30, "#5443ff", 12); D.pill(ctx, "điểm mới", R.x, R.y - 28, "#c2402a", 12);
        D.pill(ctx, `đi ${Math.round((1 - al) * 100)}% quãng đường`, (A.x + N.x) / 2, (A.y + N.y) / 2 - 26, "#0b7d71", 12);
        ctx.fillStyle = "#8f96d4"; ctx.font = "600 12px JetBrains Mono"; ctx.fillText("phóng to ×3 quanh điểm mượt cũ", 16, HH - 16);
      }
    } else if (s === 4) {
      const h = ST.hist.filter((q) => q.t > ST.time - 2);
      if (ST.src === "sim") { ctx.setLineDash([7, 6]); ctx.strokeStyle = "#ffffff"; ctx.lineWidth = 2.5; ctx.beginPath(); h.forEach((q, i) => (i ? ctx.lineTo(q.tx, q.ty) : ctx.moveTo(q.tx, q.ty))); ctx.stroke(); ctx.setLineDash([]); }
      ctx.strokeStyle = "#9184ff"; ctx.lineWidth = 5; ctx.beginPath(); h.forEach((q, i) => (i ? ctx.lineTo(q.sx, q.sy) : ctx.moveTo(q.sx, q.sy))); ctx.stroke();
      if (ST.tru && ST.sm) { ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ST.tru.x, ST.tru.y); ctx.lineTo(ST.sm.x, ST.sm.y); ctx.stroke(); cross(ctx, ST.tru.x, ST.tru.y, "#fff", 9); }
      D.pill(ctx, ST.lag != null ? `trễ ≈ ${Math.round(ST.lag)} ms` : "hãy cho tay di chuyển", W / 2, 34, "#5443ff", 14);
    } else {
      if (ST.src === "sim") { D.room(ctx, true); if (ST.lm) H.drawHand(ctx, ST.lm, 95); }
      if (ST.lm) H.drawSkeleton(ctx, ST.lm, { dim: true });
      const bars = [["Ngón trỏ duỗi", ST.feat[1], 0.55, 0.4, "> 0,55 để bật · < 0,40 để tắt"], ["Ngón giữa duỗi", ST.feat[2], 0.35, 0.5, "< 0,35 để bật · > 0,50 để tắt"]];
      bars.forEach(([n, v, on, off, note], k) => {
        const x = 30, y = 340 + k * 64, w = 580;
        ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, x - 10, y - 26, w + 20, 58, 12); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "700 13px Be Vietnam Pro"; ctx.fillText(n + "  " + v.toFixed(2), x, y - 8);
        ctx.fillStyle = "#8f96d4"; ctx.font = "11px JetBrains Mono"; ctx.fillText(note, x + 250, y - 8);
        ctx.fillStyle = "#232866"; D.rr(ctx, x, y, w, 12, 6); ctx.fill();
        ctx.fillStyle = "#5ef2d6"; D.rr(ctx, x, y, Math.max(6, w * v), 12, 6); ctx.fill();
        for (const [t, c] of [[on, "#3ee9cf"], [off, "#ff7d5f"]]) { ctx.fillStyle = c; ctx.fillRect(x + w * t - 1.5, y - 6, 3, 24); }
      });
      D.pill(ctx, ST.pen ? "BÚT: BẬT" : "BÚT: TẮT", W / 2, 34, ST.pen ? "#0b7d71" : "#4b52a8", 15);
    }
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"), f = (v) => (v == null ? "—" : v.toFixed(0));
    if (!ST.raw) { el.textContent = "Đang chờ ngón tay…"; return; }
    if (s === 0) el.innerHTML = `Điểm #8 khung này: (<span class="w">${f(ST.raw.x)}, ${f(ST.raw.y)}</span>)\n${ST.tru ? `Tay thật đang ở:   (<span class="hl">${f(ST.tru.x)}, ${f(ST.tru.y)}</span>)\nLệch: <span class="w">${dist(ST.raw, ST.tru).toFixed(1)} px</span>` : "Ở chế độ camera, máy không biết vị trí thật"}`;
    else if (s === 1) el.innerHTML = `Độ rung cài đặt: σ = <span class="w">${ST.sigma} px</span>\nĐo được từ 40 khung gần nhất: <span class="hl">${(ST.sdEst || 0).toFixed(1)} px</span>\n(vòng vàng đứt = 1 độ lệch chuẩn)`;
    else if (s === 2) el.innerHTML = `N = <span class="w">${ST.N}</span> điểm gần nhất\nTrung bình x = (x₁ + x₂ + … + x${ST.N}) / ${ST.N}\nKết quả: (<span class="hl">${f(ST.sm.x)}, ${f(ST.sm.y)}</span>)${ST.filter !== "ma" ? '\n<span class="w">(bộ lọc đang dùng không phải Trung bình)</span>' : ""}`;
    else if (s === 3) { const al = ST.filter === "ema" ? ST.alpha : 0.7; el.innerHTML = `mượt = α × mượt_cũ + (1 − α) × mới\n     = ${al.toFixed(2)} × ${f(ST.prevSm && ST.prevSm.x)} + ${(1 - al).toFixed(2)} × ${f((ST.acc || ST.raw).x)}\n     = <span class="hl">${f(al * (ST.prevSm ? ST.prevSm.x : 0) + (1 - al) * (ST.acc || ST.raw).x)}</span>  (trục x)${ST.filter !== "ema" ? '\n<span class="w">(minh họa với α = 0,70)</span>' : ""}`; }
    else if (s === 4) el.innerHTML = `Độ trễ: <span class="hl">${ST.lag != null ? Math.round(ST.lag) + " ms" : "—"}</span>\nĐộ rung còn lại: <span class="hl">${ST.jit != null ? ST.jit.toFixed(1) + " px" : "—"}</span>\nBộ lọc: <span class="w">${filterName()}</span>`;
    else el.innerHTML = `Ngón trỏ duỗi = <span class="hl">${ST.feat[1].toFixed(2)}</span>\nNgón giữa duỗi = <span class="hl">${ST.feat[2].toFixed(2)}</span>\nBút: <span class="${ST.pen ? "hl" : "w"}">${ST.pen ? "BẬT" : "TẮT"}</span>`;
  }
  function filterName() { return ST.filter === "none" ? "Không lọc" : ST.filter === "ma" ? `Trung bình ${ST.N} khung` : `EMA, α = ${ST.alpha.toFixed(2)}`; }

  // ---------- bảng não + biểu đồ + code ----------
  function renderBrain() {
    $("bPen").innerHTML = `<small>BÚT</small><span style="color:${ST.pen ? "#3ee9cf" : "#8f96d4"}">${ST.pen ? "Đang vẽ" : "Đang nhấc"}</span>`;
    $("bJit").textContent = ST.jit != null ? ST.jit.toFixed(1) + " px" : "—";
    $("bLag").textContent = ST.lag != null ? Math.round(ST.lag) + " ms" : "—";
    $("bFilter").textContent = filterName() + (ST.outlier ? ` · bỏ điểm nhảy > ${ST.jump} px` : "");
    const f = (p) => (p ? `(${p.x.toFixed(0)}, ${p.y.toFixed(0)})` : "—");
    $("bCoords").innerHTML = `<tr><td>tay thật</td><td>${ST.src === "sim" ? f(ST.tru) : "không biết"}</td></tr><tr><td>AI thấy</td><td>${f(ST.raw)}</td></tr><tr><td>đã lọc</td><td>${f(ST.sm)}</td></tr>`;
    $("bGest").innerHTML = [["trỏ", ST.feat[1]], ["giữa", ST.feat[2]]].map(([n, v]) => `<div class="r"><span>${n} duỗi</span><span class="bar"><i style="width:${v * 100}%;background:#5ef2d6"></i></span><span>${v.toFixed(2)}</span></div>`).join("");
  }
  function renderChart() {
    const TH = P.TH, h = ST.hist;
    P.lineChart($("chart"), [
      { data: h.map((q) => ({ t: q.t, v: q.tx })), color: TH.ink, width: 2, dash: [6, 5] },
      { data: h.map((q) => ({ t: q.t, v: q.rx })), color: TH.coral, width: 1.5, alpha: 0.55 },
      { data: h.map((q) => ({ t: q.t, v: q.sx })), color: TH.violet, width: 3 }
    ], { min: 0, max: 640, span: 5, now: ST.time, ticks: [0, 160, 320, 480, 640], fmt: (v) => v + "px" });
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    let body = "";
    if (ST.filter === "none") body = `  ${c("// không lọc: dùng thẳng điểm AI thấy")}\n  muot = moi;`;
    if (ST.filter === "ma") body = `  ${c("// trung bình " + ST.N + " điểm gần nhất")}\n  boNho.push(moi);\n  ${k("if")} (boNho.length &gt; ${n(ST.N)}) boNho.shift();\n  muot.x = tong(boNho, ${'"x"'}) / boNho.length;\n  muot.y = tong(boNho, ${'"y"'}) / boNho.length;`;
    if (ST.filter === "ema") body = `  ${c("// EMA: nhớ " + Math.round(ST.alpha * 100) + "% điểm cũ, lấy " + Math.round((1 - ST.alpha) * 100) + "% điểm mới")}\n  muot.x = ${n(ST.alpha.toFixed(2))} * muot.x + ${n((1 - ST.alpha).toFixed(2))} * moi.x;\n  muot.y = ${n(ST.alpha.toFixed(2))} * muot.y + ${n((1 - ST.alpha).toFixed(2))} * moi.y;`;
    $("genCode").innerHTML =
`${k("function")} capNhat(moi) {   ${c("// moi = điểm #8 AI vừa thấy")}
${ST.outlier ? `  ${c("// 1. bỏ điểm ngoại lai")}\n  ${k("if")} (khoangCach(moi, truoc) &gt; ${n(ST.jump)}) ${k("return")} muot;\n  truoc = moi;\n` : `  ${c("// (không kiểm tra điểm ngoại lai)")}\n`}${body}
  ${k("return")} muot;
}`;
  }

  // ---------- điều khiển ----------
  async function useCam() {
    P.msg($("stageMsg"), "Đang tải mô hình AI bàn tay (khoảng 8 MB, chỉ tải lần đầu)…", "loader");
    try { landmarker = await P.vision("hand"); stream = await P.camera(video); ST.src = "cam"; ST.auto = false; markAuto(); P.srcButtons("cam"); P.msg($("stageMsg"), null); clearArt(); }
    catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; ST.src = "sim"; P.srcButtons("sim"); }
  function markAuto() { const b = $("btnAuto"); b.setAttribute("aria-pressed", ST.auto); b.classList.toggle("ghost", !ST.auto); }
  function markFilter() { $("filterBtns").querySelectorAll("button").forEach((b) => { const on = b.dataset.f === ST.filter; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  const syncs = [];
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    $("btnAuto").onclick = () => { ST.auto = !ST.auto; ST.autoT = 0; clearArt(); markAuto(); };
    $("btnClear").onclick = clearArt;
    const pos = (e) => { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * HH / r.height }; };
    stage.addEventListener("pointerdown", (e) => { if (ST.src !== "sim") return; if (ST.auto) { ST.auto = false; markAuto(); clearArt(); ST.sm = ST.acc = null; ST.buf = []; } Object.assign(ST.ptr, pos(e), { down: true }); stage.setPointerCapture(e.pointerId); });
    stage.addEventListener("pointermove", (e) => { if (ST.src !== "sim" || ST.auto) return; Object.assign(ST.ptr, pos(e)); });
    const up = () => (ST.ptr.down = false); stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
    for (const k of ["hand", "raw", "smooth", "dots"]) $("show" + k[0].toUpperCase() + k.slice(1)).onchange = (e) => (ST.show[k] = e.target.checked);
    $("filterBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.filter = b.dataset.f; ST.used.add(ST.filter); if (ST.used.size === 3) prog.done("tune"); markFilter(); genCode(); }));
    syncs.push(P.range("n", () => ST.N, (v) => (ST.N = v), (v) => v, genCode));
    syncs.push(P.range("alpha", () => ST.alpha, (v) => (ST.alpha = v), (v) => v.toFixed(2), genCode));
    syncs.push(P.range("jump", () => ST.jump, (v) => (ST.jump = v), (v) => v + " px", genCode));
    syncs.push(P.range("sigma", () => ST.sigma, (v) => (ST.sigma = v), (v) => v + " px"));
    syncs.push(P.range("drop", () => ST.drop, (v) => (ST.drop = v), (v) => v + "%"));
    $("outlier").onchange = (e) => { ST.outlier = e.target.checked; genCode(); };
    const sync = () => { syncs.forEach((f) => f()); $("outlier").checked = ST.outlier; markFilter(); genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF);
      if (k === "shake") { ST.sigma = 14; ST.filter = "none"; }
      if (k === "drop") { ST.drop = 10; ST.outlier = false; ST.filter = "ma"; }
      if (k === "lag") { ST.alpha = 0.96; ST.filter = "ema"; }
      if (ST.src !== "sim") useSim();
      ST.auto = true; ST.autoT = 0; markAuto(); clearArt(); sync(); prog.done("broke");
      $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); sync(); clearArt(); };
    sync(); markAuto();
  }

  const QUIZ = [
    { q: "\"Nhiễu\" trong dữ liệu vị trí ngón tay là gì?", o: ["Tiếng ồn từ loa máy tính", "Những sai lệch nhỏ, ngẫu nhiên giữa vị trí AI đo được và vị trí thật", "Lỗi lập trình", "Ánh sáng quá mạnh"], a: 1, e: "Mỗi khung hình AI đoán hơi lệch một chút theo hướng ngẫu nhiên. Đó là nhiễu." },
    { q: "Vì sao lấy trung bình nhiều điểm lại giảm được nhiễu?", o: ["Vì các lệch trái và lệch phải triệt tiêu nhau", "Vì máy tính chạy nhanh hơn", "Vì điểm cuối cùng luôn đúng", "Vì nó xóa hết các điểm"], a: 0, e: "Nhiễu ngẫu nhiên có lúc dương, lúc âm. Cộng nhiều điểm lại thì chúng bù trừ cho nhau." },
    { q: "Với EMA, tăng α từ 0,5 lên 0,95 sẽ làm nét vẽ…", o: ["Run hơn và nhanh hơn", "Mượt hơn nhưng trễ hơn", "Không thay đổi", "Biến mất"], a: 1, e: "α lớn nghĩa là nhớ điểm cũ nhiều hơn, nên nét mượt hơn nhưng phản ứng chậm hơn với chuyển động mới." },
    { q: "Bỗng nhiên một điểm nhảy xa 150 px trong 1/60 giây. Cách xử lý hợp lý nhất là…", o: ["Vẽ một đường thẳng tới điểm đó", "Coi đó là điểm ngoại lai và bỏ qua vì tay thật không thể di chuyển nhanh như vậy", "Tắt chương trình", "Tăng độ rung"], a: 1, e: "Dùng hiểu biết về thế giới thực (tay không dịch chuyển tức thời) để kiểm tra kết quả của AI." },
    { q: "Ở chế độ camera thật, máy không đo được \"độ trễ\". Vì sao?", o: ["Vì camera quá chậm", "Vì ngoài đời máy không biết vị trí THẬT của ngón tay để so sánh", "Vì thiếu bộ nhớ", "Vì EMA không chạy được với camera"], a: 1, e: "Trong mô phỏng ta biết đáp án đúng nên đo được sai số. Ngoài đời phải thiết kế thí nghiệm riêng để có \"đáp án\"." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000)); last = now;
    step(dt);
    // cặp (điểm thấy − vị trí thật) cho bước Nhiễu
    if (ST.src === "sim" && ST.raw && ST.tru) { (ST.pairs = ST.pairs || []).push({ x: ST.raw.x - ST.tru.x, y: ST.raw.y - ST.tru.y }); if (ST.pairs.length > 40) ST.pairs.shift(); }
    renderStage(); renderChart();
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; metrics(); renderBrain(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); bind(); P.srcButtons("sim");
  requestAnimationFrame(tick);
})();
