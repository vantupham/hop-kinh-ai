/* Hộp Kính AI · Dự án 04 · Mặt nạ cảm xúc (lưới mặt, điểm neo, đo tỉ lệ, luật biểu cảm, filter) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, F = FaceSim;
  const prog = P.progress("hka-04");
  const W = 640, HH = 480;
  const PRE = {
    binh: { name: "Bình thường", cuoi: 0, mieng: 0.05, may: 0, nham: 0 },
    vui: { name: "Vui", cuoi: 0.9, mieng: 0.15, may: 0.1, nham: 0.25 },
    buon: { name: "Buồn", cuoi: -0.55, mieng: 0, may: -0.4, nham: 0.2 },
    ngac: { name: "Ngạc nhiên", cuoi: 0, mieng: 0.8, may: 0.9, nham: 0 },
    ngu: { name: "Buồn ngủ", cuoi: -0.1, mieng: 0.1, may: -0.2, nham: 1 }
  };
  const ORDER = ["binh", "vui", "ngac", "buon", "ngu"];
  const EXPR_COL = { "Vui": "#ffc34d", "Buồn": "#9184ff", "Ngạc nhiên": "#3ee9cf", "Buồn ngủ": "#ff7d5f", "Bình thường": "#c3c7f0", "—": "#8f96d4" };
  const MASKS = [["none", "Không"], ["kinh", "Kính râm"], ["meo", "Tai mèo"], ["ria", "Ria mép"], ["mien", "Vương miện"]];
  const DEF_RULE = { tNham: 0.7, tGiay: 0.8, tMieng: 0.4, tMay: 0.4, tVui: 0.4, tBuon: -0.3 };
  const ST = {
    src: "sim", auto: true, autoT: 0, f: { cuoi: 0, mieng: 0.05, may: 0, nham: 0, quay: 0, nghieng: 0, sang: 1, khauTrang: false },
    target: "binh", mask: "kinh", masksUsed: new Set(["kinh"]), show: { img: true, mesh: true, mask: true },
    fr: null, feat: { cuoi: 0, mieng: 0, may: 0, nham: 0 }, expr: "—", sleepT: 0, conf: 1, nPts: 0, ...DEF_RULE, time: 0, hist: [], path: []
  };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), video = $("video");
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y), mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // ---------- đo 4 cơ mặt từ điểm neo (mô phỏng) ----------
  function measure(a) {
    const fh = dist(a.forehead, a.chin), ang = Math.atan2(a.eyeR.y - a.eyeL.y, a.eyeR.x - a.eyeL.x);
    const rot = (p) => ({ x: p.x * Math.cos(-ang) - p.y * Math.sin(-ang), y: p.x * Math.sin(-ang) + p.y * Math.cos(-ang) });
    const lift = (rot(a.lipTop).y - (rot(a.mouthL).y + rot(a.mouthR).y) / 2) / fh;
    const gap = dist(a.lipTop, a.lipBot) / fh;
    const brow = ((dist(a.browL, a.eyeL) + dist(a.browR, a.eyeR)) / 2) / fh;
    const eo = ((dist(a.eyeLTop, a.eyeLBot) / dist(a.eyeLOut, a.eyeLIn)) + (dist(a.eyeRTop, a.eyeRBot) / dist(a.eyeROut, a.eyeRIn))) / 2;
    return {
      raw: { fh, lift, gap, brow, eo, ang },
      cuoi: clamp((lift + 0.005) / 0.06, -1, 1), mieng: clamp((gap - 0.014) / 0.127, 0, 1),
      may: clamp((brow - 0.148) / 0.06, 0, 1), nham: clamp((0.5 - eo) / 0.45, 0, 1)
    };
  }
  // ---------- camera: điểm neo từ lưới 478 điểm + blendshapes của MediaPipe ----------
  const IDX = { forehead: 10, chin: 152, eyeLOut: 33, eyeLIn: 133, eyeROut: 263, eyeRIn: 362, eyeLTop: 159, eyeLBot: 145, eyeRTop: 386, eyeRBot: 374, browL: 105, browR: 334, nose: 1, mouthL: 61, mouthR: 291, lipTop: 13, lipBot: 14 };
  let landmarker = null, stream = null, lastVT = -1, camFr = null;
  function camFrame() {
    if (!landmarker || video.readyState < 2) return camFr;
    if (video.currentTime === lastVT) return camFr; lastVT = video.currentTime;
    const r = landmarker.detectForVideo(video, performance.now()), p = r.faceLandmarks && r.faceLandmarks[0];
    if (!p) return (camFr = null);
    const pts = p.map((q) => ({ x: (1 - q.x) * W, y: q.y * HH }));
    const an = {}; for (const k in IDX) an[k] = pts[IDX[k]];
    // ảnh lật gương: mắt trái/phải trên màn hình đổi chỗ
    an.eyeL = mid(pts[33], pts[133]); an.eyeR = mid(pts[263], pts[362]);
    const bs = {}; ((r.faceBlendshapes && r.faceBlendshapes[0] && r.faceBlendshapes[0].categories) || []).forEach((c) => (bs[c.categoryName] = c.score));
    camFr = { pts, anchors: an, bs };
    return camFr;
  }
  function camFeat(fr) {
    const b = fr.bs, g = (k) => b[k] || 0, base = measure(fr.anchors);
    return { raw: base.raw, cuoi: clamp((g("mouthSmileLeft") + g("mouthSmileRight")) / 2 - (g("mouthFrownLeft") + g("mouthFrownRight")) / 2, -1, 1), mieng: g("jawOpen"), may: Math.max(g("browInnerUp"), (g("browOuterUpLeft") + g("browOuterUpRight")) / 2), nham: (g("eyeBlinkLeft") + g("eyeBlinkRight")) / 2 };
  }

  // ---------- luật biểu cảm ----------
  function decide(fe, dt) {
    ST.sleepT = fe.nham > ST.tNham ? ST.sleepT + dt : 0;
    if (ST.sleepT > ST.tGiay) return { e: "Buồn ngủ", rule: 0 };
    if (fe.mieng > ST.tMieng && fe.may > ST.tMay) return { e: "Ngạc nhiên", rule: 1 };
    if (fe.cuoi > ST.tVui) return { e: "Vui", rule: 2 };
    if (fe.cuoi < ST.tBuon) return { e: "Buồn", rule: 3 };
    return { e: "Bình thường", rule: 4 };
  }

  // ---------- mặt nạ ----------
  function maskXf(a) {
    const c = mid(a.eyeL, a.eyeR), ang = Math.atan2(a.eyeR.y - a.eyeL.y, a.eyeR.x - a.eyeL.x), sc = dist(a.eyeL, a.eyeR) / 120;
    return { c, ang, sc };
  }
  function drawMask(ctx, a, kind) {
    if (kind === "none") return;
    const { c, ang, sc } = maskXf(a);
    ctx.save();
    const anchor = kind === "kinh" ? c : kind === "ria" ? mid(a.nose, a.lipTop) : a.forehead;
    ctx.translate(anchor.x, anchor.y); ctx.rotate(ang); ctx.scale(sc, sc);
    if (kind === "kinh") {
      const g = ctx.createLinearGradient(0, -30, 0, 30); g.addColorStop(0, "rgba(40,30,90,.95)"); g.addColorStop(1, "rgba(10,10,30,.92)");
      ctx.fillStyle = g; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 6;
      for (const x of [-62, 62]) { D.rr(ctx, x - 52, -30, 104, 62, 22); ctx.fill(); ctx.stroke(); }
      ctx.beginPath(); ctx.moveTo(-12, -8); ctx.quadraticCurveTo(0, -18, 12, -8); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 4; for (const x of [-80, 44]) { ctx.beginPath(); ctx.moveTo(x, -16); ctx.lineTo(x + 18, -16); ctx.stroke(); }
    } else if (kind === "meo") {
      for (const sd of [-1, 1]) {
        ctx.fillStyle = "#2a1e1a"; ctx.beginPath(); ctx.moveTo(sd * 40, 20); ctx.lineTo(sd * 105, -90); ctx.lineTo(sd * 125, 35); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#ff8fb1"; ctx.beginPath(); ctx.moveTo(sd * 62, 14); ctx.lineTo(sd * 103, -58); ctx.lineTo(sd * 112, 22); ctx.closePath(); ctx.fill();
      }
    } else if (kind === "ria") {
      ctx.fillStyle = "#2a1e1a";
      for (const sd of [-1, 1]) { ctx.beginPath(); ctx.moveTo(0, -4); ctx.bezierCurveTo(sd * 30, -22, sd * 70, -10, sd * 82, 6); ctx.bezierCurveTo(sd * 92, 20, sd * 104, 4, sd * 100, -6); ctx.bezierCurveTo(sd * 104, 18, sd * 72, 26, sd * 52, 10); ctx.bezierCurveTo(sd * 36, 2, sd * 14, 10, 0, 8); ctx.closePath(); ctx.fill(); }
    } else if (kind === "mien") {
      const g = ctx.createLinearGradient(0, -110, 0, 0); g.addColorStop(0, "#ffe08a"); g.addColorStop(1, "#d98c00");
      ctx.fillStyle = g; ctx.strokeStyle = "#8a5a00"; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-110, 0); ctx.lineTo(-120, -80); ctx.lineTo(-60, -40); ctx.lineTo(0, -110); ctx.lineTo(60, -40); ctx.lineTo(120, -80); ctx.lineTo(110, 0); ctx.closePath(); ctx.fill(); ctx.stroke();
      for (const [x, y, col] of [[-120, -84, "#3ee9cf"], [0, -114, "#ff6f9e"], [120, -84, "#9184ff"]]) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 11, 0, 7); ctx.fill(); }
    }
    ctx.restore();
  }

  // ---------- vẽ lưới ----------
  function drawMesh(ctx, fr, dim) {
    if (!fr) return;
    if (fr.groups) {
      ctx.strokeStyle = dim ? "rgba(255,255,255,.18)" : "rgba(94,242,214,.7)"; ctx.lineWidth = 1.4;
      for (const g of F.LINES) { F.poly(ctx, fr.pts, fr.groups[g], g !== "browL" && g !== "browR" && g !== "noseB" && g !== "noseN"); ctx.stroke(); }
      ctx.fillStyle = dim ? "rgba(255,255,255,.25)" : "#5ef2d6";
      fr.pts.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 2.2, 0, 7); ctx.fill(); });
    } else {
      ctx.fillStyle = dim ? "rgba(255,255,255,.25)" : "rgba(94,242,214,.85)";
      fr.pts.forEach((p) => ctx.fillRect(p.x - 1, p.y - 1, 2, 2));
    }
  }
  function drawImage(ctx, fade) {
    if (ST.src === "sim") { if (ST.fr) F.drawFace(ctx, ST.fr.img, P.TH.dark); }
    else if (video.readyState >= 2) { ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, W, HH); ctx.restore(); }
    else D.labBg(ctx);
    if (fade) { ctx.fillStyle = `rgba(14,16,40,${fade})`; ctx.fillRect(0, 0, W, HH); }
  }
  function renderStage() {
    const ctx = sctx;
    if (ST.show.img) drawImage(ctx); else D.labBg(ctx);
    if (ST.show.mesh) drawMesh(ctx, ST.fr && ST.fr.anchors ? ST.fr : null);
    if (ST.show.mask && ST.fr && ST.fr.anchors) drawMask(ctx, ST.fr.anchors, ST.mask);
    ctx.fillStyle = "rgba(10,12,38,.82)"; D.rr(ctx, 14, 14, 200, 62, 14); ctx.fill();
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText("AI THẤY BIỂU CẢM", 28, 34);
    ctx.fillStyle = EXPR_COL[ST.expr] || "#fff"; ctx.font = "800 24px Be Vietnam Pro, sans-serif"; ctx.fillText(ST.expr, 28, 63);
    if (!ST.fr || !ST.fr.anchors) D.pill(ctx, "Không thấy khuôn mặt", W / 2, 34, "#c2402a", 14);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh khuôn mặt", e: "image", d: "Ảnh từ camera được đưa vào mô hình <b>MediaPipe Face</b>. Mô hình này đã học từ rất nhiều ảnh khuôn mặt để biết các bộ phận nằm ở đâu." },
    { t: "Lưới điểm", e: "robot", d: "AI trả về một <b>lưới điểm</b> phủ khuôn mặt (camera thật có 478 điểm, bản mô phỏng rút gọn còn khoảng 100). Mỗi điểm có tọa độ x, y, z." },
    { t: "Điểm neo", e: "crosshair", d: "Ta chỉ cần vài <b>điểm neo</b>: trán, cằm, khóe mắt, mí mắt, lông mày, chóp mũi, khóe môi và môi trong." },
    { t: "Đo cơ mặt", e: "angle", d: "Đo các khoảng cách rồi <b>chia cho chiều cao khuôn mặt</b> (vạch vàng). Ta xoay hệ trục theo đường hai mắt nên nghiêng đầu không làm sai phép đo." },
    { t: "Áp luật", e: "blocks", d: "Bốn con số đi qua <b>chuỗi luật</b> từ trên xuống. Luật đầu tiên đúng sẽ quyết định biểu cảm. Đường sáng là đường đi hiện tại." },
    { t: "Gắn mặt nạ", e: "sparkle", d: "Mặt nạ được vẽ sẵn quanh gốc tọa độ, rồi <b>dịch</b> tới điểm neo, <b>xoay</b> theo góc hai mắt và <b>phóng to</b> theo khoảng cách hai mắt." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 1) prog.done("see"); });
  P.visible($("soi"), (v) => (soiVisible = v));
  function seg(ctx, a, b, col, label) {
    ctx.strokeStyle = col; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    for (const p of [a, b]) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(p.x, p.y, 5, 0, 7); ctx.fill(); }
    if (label) D.pill(ctx, label, (a.x + b.x) / 2 + 60, (a.y + b.y) / 2, col === "#ffc34d" ? "#8a5a00" : "#1c2048", 11);
  }
  function renderSoi() {
    const s = pipe.get(), ctx = octx, fr = ST.fr, a = fr && fr.anchors;
    if (s === 0) { drawImage(ctx); return; }
    if (s === 1) { drawImage(ctx, .55); drawMesh(ctx, fr); return; }
    if (s === 2) {
      drawImage(ctx, .6); drawMesh(ctx, fr, true); if (!a) return;
      const show = [["forehead", "trán"], ["chin", "cằm"], ["eyeL", "mắt"], ["eyeR", "mắt"], ["browL", "mày"], ["browR", "mày"], ["nose", "mũi"], ["mouthL", "khóe môi"], ["mouthR", "khóe môi"], ["lipTop", "môi trên"], ["lipBot", "môi dưới"]];
      show.forEach(([k, n], i) => { const p = a[k]; ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, 7); ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); ctx.fillStyle = "#fff"; ctx.font = "600 11px Be Vietnam Pro"; ctx.fillText(n, p.x + (k.endsWith("R") ? 10 : -10 - ctx.measureText(n).width), p.y - 8); });
      return;
    }
    if (s === 3) {
      drawImage(ctx, .65); drawMesh(ctx, fr, true); if (!a) return;
      const r = ST.feat.raw || {};
      seg(ctx, a.forehead, a.chin, "#ffc34d", "chiều cao mặt");
      seg(ctx, a.lipTop, a.lipBot, "#3ee9cf"); seg(ctx, a.browL, a.eyeL, "#9184ff"); seg(ctx, a.browR, a.eyeR, "#9184ff");
      seg(ctx, a.eyeLTop, a.eyeLBot, "#ff7d5f"); seg(ctx, a.eyeRTop, a.eyeRBot, "#ff7d5f");
      ctx.setLineDash([5, 4]); ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(a.mouthL.x, a.mouthL.y); ctx.lineTo(a.mouthR.x, a.mouthR.y); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = "#ff7d5f"; ctx.setLineDash([8, 6]); ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(a.eyeL.x - 60 * Math.cos(r.ang || 0), a.eyeL.y - 60 * Math.sin(r.ang || 0)); ctx.lineTo(a.eyeR.x + 60 * Math.cos(r.ang || 0), a.eyeR.y + 60 * Math.sin(r.ang || 0)); ctx.stroke(); ctx.setLineDash([]);
      return;
    }
    if (s === 4) {
      D.labBg(ctx);
      const rules = [["nhắm mắt > " + ST.tNham + " trong " + ST.tGiay + "s ?", "Buồn ngủ"], ["há miệng > " + ST.tMieng + " và mày > " + ST.tMay + " ?", "Ngạc nhiên"], ["khóe miệng > " + ST.tVui + " ?", "Vui"], ["khóe miệng < " + ST.tBuon + " ?", "Buồn"]];
      const act = ST.rule;
      rules.forEach(([q, r], i) => {
        const y = 40 + i * 90, on = i <= act, hit = i === act;
        ctx.strokeStyle = on ? "#9184ff" : "#2c3170"; ctx.lineWidth = hit ? 4 : 2; ctx.fillStyle = hit ? "rgba(145,132,255,.25)" : "#161a40";
        D.rr(ctx, 40, y, 340, 56, 12); ctx.fill(); ctx.stroke();
        ctx.fillStyle = on ? "#fff" : "#6a6f96"; ctx.font = "600 14px JetBrains Mono, monospace"; ctx.fillText(q, 56, y + 34);
        ctx.strokeStyle = hit ? "#5ef2d6" : "#2c3170"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(380, y + 28); ctx.lineTo(440, y + 28); ctx.stroke();
        ctx.fillStyle = hit ? EXPR_COL[r] : "#2c3170"; D.rr(ctx, 444, y + 8, 160, 40, 10); ctx.fill();
        ctx.fillStyle = hit ? "#0a0b1e" : "#6a6f96"; ctx.font = "800 15px Be Vietnam Pro"; ctx.fillText("Đúng → " + r, 456, y + 34);
        if (i < 3) { ctx.strokeStyle = i < act ? "#ff7d5f" : "#2c3170"; ctx.beginPath(); ctx.moveTo(210, y + 56); ctx.lineTo(210, y + 90); ctx.stroke(); ctx.fillStyle = i < act ? "#ff7d5f" : "#4b52a8"; ctx.font = "600 11px JetBrains Mono"; ctx.fillText("sai", 218, y + 78); }
      });
      ctx.fillStyle = act === 4 ? "#c3c7f0" : "#4b52a8"; ctx.font = "800 16px Be Vietnam Pro"; ctx.fillText(act === 4 ? "→ Không luật nào đúng: Bình thường" : "", 56, 440);
      return;
    }
    drawImage(ctx, .25); if (!a) return;
    const { c, ang, sc } = maskXf(a);
    drawMask(ctx, a, ST.mask === "none" ? "kinh" : ST.mask);
    ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.beginPath(); ctx.moveTo(a.eyeL.x, a.eyeL.y); ctx.lineTo(a.eyeR.x, a.eyeR.y); ctx.stroke(); ctx.setLineDash([]);
    ctx.strokeStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(c.x, c.y); ctx.lineTo(c.x + 90, c.y); ctx.stroke(); ctx.beginPath(); ctx.arc(c.x, c.y, 60, 0, ang, ang < 0); ctx.stroke();
    D.pill(ctx, `xoay ${(ang * 180 / Math.PI).toFixed(0)}°`, c.x + 130, c.y - 20, "#8a5a00", 12);
    D.pill(ctx, `phóng ×${sc.toFixed(2)}`, c.x - 130, c.y + 70, "#1c2048", 12);
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"), fr = ST.fr, a = fr && fr.anchors; if (!a) { el.textContent = "Không thấy khuôn mặt…"; return; }
    const f0 = (v) => v.toFixed(0), r = ST.feat.raw || {};
    if (s === 0) el.innerHTML = `Ảnh <span class="hl">640 × 480</span>\nĐộ tin cậy có khuôn mặt: <span class="hl">${Math.round(ST.conf * 100)}%</span>`;
    else if (s === 1) el.innerHTML = `Số điểm: <span class="hl">${fr.pts.length}</span> (camera thật: 478)\nMỗi điểm: (x, y, z) → <span class="w">${fr.pts.length * 3}</span> con số`;
    else if (s === 2) el.innerHTML = ["forehead", "chin", "eyeL", "eyeR", "lipTop", "lipBot"].map((k) => `${k.padEnd(9, " ")} (${f0(a[k].x)}, ${f0(a[k].y)})`).join("\n");
    else if (s === 3) el.innerHTML = `chiều cao mặt = <span class="w">${f0(r.fh || 0)} px</span>\nmôi hở / cao mặt = ${(r.gap || 0).toFixed(3)} → há miệng <span class="hl">${ST.feat.mieng.toFixed(2)}</span>\nkhóe nâng / cao mặt = ${(r.lift || 0).toFixed(3)} → khóe miệng <span class="hl">${ST.feat.cuoi.toFixed(2)}</span>\nmày–mắt / cao mặt = ${(r.brow || 0).toFixed(3)} → nhướng mày <span class="hl">${ST.feat.may.toFixed(2)}</span>\nmắt mở / rộng mắt = ${(r.eo || 0).toFixed(3)} → nhắm mắt <span class="hl">${ST.feat.nham.toFixed(2)}</span>`;
    else if (s === 4) el.innerHTML = `khóe miệng ${ST.feat.cuoi.toFixed(2)} · há miệng ${ST.feat.mieng.toFixed(2)}\nnhướng mày ${ST.feat.may.toFixed(2)} · nhắm mắt ${ST.feat.nham.toFixed(2)} (${ST.sleepT.toFixed(1)}s)\nKết quả: <span class="hl">${ST.expr}</span>`;
    else { const x = maskXf(a); el.innerHTML = `dịch tới  (${f0(x.c.x)}, ${f0(x.c.y)})\nxoay      <span class="hl">${(x.ang * 180 / Math.PI).toFixed(1)}°</span>  (góc đường nối hai mắt)\nphóng to  <span class="hl">×${x.sc.toFixed(2)}</span>  (= khoảng cách hai mắt / 120)`; }
  }

  // ---------- bảng não, radar, biểu đồ, code ----------
  const FEAT_UI = [["cuoi", "khóe miệng", "#ffc34d"], ["mieng", "há miệng", "#3ee9cf"], ["may", "nhướng mày", "#9184ff"], ["nham", "nhắm mắt", "#ff7d5f"]];
  function renderBrain() {
    $("bExpr").innerHTML = `<small>BIỂU CẢM AI ĐOÁN</small><span style="color:${EXPR_COL[ST.expr]}">${ST.expr}</span>`;
    $("bFeat").innerHTML = FEAT_UI.map(([k, n, c]) => { const v = ST.feat[k]; const w = k === "cuoi" ? Math.abs(v) * 50 : v * 100, l = k === "cuoi" ? (v < 0 ? 50 - w : 50) : 0; return `<div class="r"><span>${n}</span><span class="bar" style="position:relative"><i style="position:absolute;left:${l}%;width:${w}%;background:${c}"></i>${k === "cuoi" ? '<b style="position:absolute;left:50%;top:-2px;bottom:-2px;width:1px;background:#8f96d4"></b>' : ""}</span><span>${v.toFixed(2)}</span></div>`; }).join("");
    $("bConf").textContent = ST.fr && ST.fr.anchors ? Math.round(ST.conf * 100) + "%" : "—";
    $("bPts").textContent = ST.fr && ST.fr.pts ? ST.fr.pts.length : "—";
  }
  function renderRadar() {
    const cv = $("radar"), ctx = cv.getContext("2d"), cx = 150, cy = 120, R = 82;
    ctx.clearRect(0, 0, cv.width, cv.height);
    const ax = [["vui", Math.max(0, ST.feat.cuoi), "#ffc34d"], ["há miệng", ST.feat.mieng, "#3ee9cf"], ["nhướng mày", ST.feat.may, "#9184ff"], ["nhắm mắt", ST.feat.nham, "#ff7d5f"], ["buồn", Math.max(0, -ST.feat.cuoi), "#c3c7f0"]];
    const pt = (i, r) => { const a = -Math.PI / 2 + i * Math.PI * 2 / ax.length; return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }; };
    ctx.strokeStyle = "#2c3170"; ctx.lineWidth = 1;
    for (const f of [0.33, 0.66, 1]) { ctx.beginPath(); ax.forEach((_, i) => { const p = pt(i, R * f); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.stroke(); }
    ax.forEach((a, i) => { const p = pt(i, R); ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(p.x, p.y); ctx.stroke(); const q = pt(i, R + 18); ctx.fillStyle = a[2]; ctx.font = "600 11px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText(a[0], q.x, q.y + 4); });
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(94,242,214,.25)"; ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 2;
    ctx.beginPath(); ax.forEach((a, i) => { const p = pt(i, R * Math.max(0.04, a[1])); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); }); ctx.closePath(); ctx.fill(); ctx.stroke();
  }
  function renderChart() {
    const TH = P.TH, h = ST.hist;
    P.lineChart($("chart"), [["cuoi", TH.amber], ["mieng", TH.mint], ["may", TH.violet], ["nham", TH.coral]].map(([k, c]) => ({ data: h.map((q) => ({ t: q.t, v: q[k] })), color: c, width: 2.5 })),
      { min: -1, max: 1, span: 10, now: ST.time, ticks: [-1, -0.5, 0, 0.5, 1], fmt: (v) => v.toFixed(1), thresholds: [{ v: ST.tVui, label: "ngưỡng vui " + ST.tVui, color: TH.amber }] });
  }
  function genCode() {
    const n = (t) => `<span class="n">${t}</span>`, k = (t) => `<span class="k">${t}</span>`, s = (t) => `<span class="s">"${t}"</span>`;
    $("genCode").innerHTML =
`${k("function")} bieuCam(co, thoiGianNham) {
  ${k("if")} (co.nhamMat &gt; ${n(ST.tNham)} && thoiGianNham &gt; ${n(ST.tGiay)}) ${k("return")} ${s("Buồn ngủ")};
  ${k("if")} (co.haMieng &gt; ${n(ST.tMieng)} && co.nhuongMay &gt; ${n(ST.tMay)}) ${k("return")} ${s("Ngạc nhiên")};
  ${k("if")} (co.khoeMieng &gt; ${n(ST.tVui)}) ${k("return")} ${s("Vui")};
  ${k("if")} (co.khoeMieng &lt; ${n(ST.tBuon)}) ${k("return")} ${s("Buồn")};
  ${k("return")} ${s("Bình thường")};
}
<span class="c">// co.haMieng = (môi trên − môi dưới) / chiều cao khuôn mặt, quy về 0–1</span>`;
  }

  // ---------- điều khiển ----------
  async function useCam() {
    P.msg($("stageMsg"), "Đang tải mô hình AI khuôn mặt (khoảng 4 MB, chỉ tải lần đầu)…", "loader");
    try { landmarker = await P.vision("face"); stream = await P.camera(video); ST.src = "cam"; P.srcButtons("cam"); P.msg($("stageMsg"), null); }
    catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; ST.src = "sim"; P.srcButtons("sim"); }
  const syncs = [];
  function markAuto() { const b = $("btnAuto"); b.setAttribute("aria-pressed", ST.auto); b.classList.toggle("ghost", !ST.auto); }
  function markExpr() { $("exprBtns").querySelectorAll("button").forEach((b) => { const on = !ST.auto && b.dataset.e === ST.target; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  function markMask() { $("maskBtns").querySelectorAll("button").forEach((b) => { const on = b.dataset.m === ST.mask; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    $("exprBtns").innerHTML = ORDER.map((k) => `<button class="btn small ghost" data-e="${k}">${PRE[k].name}</button>`).join("");
    $("exprBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.target = b.dataset.e; ST.auto = false; ST.useTarget = true; markAuto(); markExpr(); }));
    $("maskBtns").innerHTML = MASKS.map(([k, n]) => `<button class="btn small ghost" data-m="${k}">${n}</button>`).join("");
    $("maskBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.mask = b.dataset.m; if (ST.mask !== "none") ST.masksUsed.add(ST.mask); if (ST.masksUsed.size >= 3) prog.done("mask"); markMask(); }));
    $("btnAuto").onclick = () => { ST.auto = !ST.auto; markAuto(); markExpr(); };
    for (const [id, fmt] of [["cuoi", (v) => v.toFixed(2)], ["mieng", (v) => v.toFixed(2)], ["may", (v) => v.toFixed(2)], ["nham", (v) => v.toFixed(2)], ["quay", (v) => v + "°"], ["nghieng", (v) => v + "°"]])
      syncs.push(P.range(id, () => ST.f[id], (v) => { ST.f[id] = v; ST.auto = false; ST.useTarget = false; markAuto(); markExpr(); }, fmt));
    for (const k of ["img", "mesh", "mask"]) $("show" + k[0].toUpperCase() + k.slice(1)).onchange = (e) => (ST.show[k] = e.target.checked);
    const ruleIds = ["tNham", "tGiay", "tMieng", "tMay", "tVui", "tBuon"];
    const syncRules = () => { ruleIds.forEach((id) => ($(id).value = ST[id])); genCode(); };
    ruleIds.forEach((id) => $(id).addEventListener("input", (e) => { const v = parseFloat(e.target.value); if (!isNaN(v)) { ST[id] = v; genCode(); prog.done("rules"); } }));
    $("btnDefaults").onclick = () => { Object.assign(ST, DEF_RULE); syncRules(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      ST.f.sang = 1; ST.f.khauTrang = false; ST.fake = false;
      if (k === "dark") { ST.f.sang = 0.2; ST.auto = true; }
      if (k === "mask") { ST.f.khauTrang = true; ST.auto = false; ST.useTarget = true; ST.target = "vui"; }
      if (k === "fake") { ST.fake = true; ST.auto = false; ST.useTarget = false; Object.assign(ST.f, { cuoi: 0.75, mieng: 0.05, may: -0.45, nham: 0.35 }); }
      if (ST.src !== "sim") useSim();
      markAuto(); markExpr(); syncs.forEach((f) => f()); prog.done("broke");
      $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); ST.f.sang = 1; ST.f.khauTrang = false; ST.fake = false; ST.auto = true; markAuto(); markExpr(); };
    syncRules(); markAuto(); markMask(); markExpr();
  }

  const QUIZ = [
    { q: "Để gắn kính râm đúng chỗ, chương trình cần những thông tin gì từ khuôn mặt?", o: ["Màu da", "Vị trí hai mắt: để dịch, xoay và phóng to mặt nạ", "Tuổi của người dùng", "Tên của người dùng"], a: 1, e: "Trung điểm hai mắt cho vị trí, đường nối hai mắt cho góc xoay, khoảng cách hai mắt cho tỉ lệ phóng to." },
    { q: "Vì sao ta chia khoảng cách giữa hai môi cho chiều cao khuôn mặt?", o: ["Để kết quả không phụ thuộc việc em ngồi gần hay xa camera", "Để số đẹp hơn", "Vì MediaPipe yêu cầu", "Để chạy nhanh hơn"], a: 0, e: "Ngồi gần thì mọi khoảng cách đều lớn hơn. Tỉ lệ thì giữ nguyên. Đây là chuẩn hóa." },
    { q: "AI nói một người đang \"Vui\" vì khóe miệng nâng lên. Kết luận nào ĐÚNG?", o: ["Người đó chắc chắn đang hạnh phúc", "AI chỉ biết hình dạng khuôn mặt giống nụ cười, không biết cảm xúc thật bên trong", "AI đọc được suy nghĩ", "AI luôn đúng khi đủ dữ liệu"], a: 1, e: "Biểu cảm khác cảm xúc. Người ta có thể cười khi buồn, hoặc giữ mặt tỉnh bơ khi vui." },
    { q: "Khi người dùng đeo khẩu trang, mô hình vẫn trả về điểm cho miệng. Điều đó có nghĩa là…", o: ["AI nhìn xuyên được khẩu trang", "Các điểm đó chỉ là đoán mò; chương trình tốt nên coi vùng bị che là không xác định", "Khẩu trang không ảnh hưởng gì", "AI bị hỏng"], a: 1, e: "Mô hình luôn trả về đủ số điểm, kể cả những điểm nó không thấy. Đừng tin tuyệt đối vào đầu ra của AI." },
    { q: "Vì sao dữ liệu khuôn mặt cần được bảo vệ đặc biệt?", o: ["Vì ảnh khuôn mặt rất nặng", "Vì khuôn mặt có thể dùng để nhận ra một người và không thể \"đổi\" như mật khẩu", "Vì luật cấm chụp ảnh", "Vì không quan trọng"], a: 1, e: "Khuôn mặt là dữ liệu sinh trắc học. Bị lộ một lần là lộ mãi mãi, nên cần có sự đồng ý và bảo mật cẩn thận." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0, histT = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.time += dt;
    if (ST.src === "sim") {
      const f = ST.f;
      if (ST.auto || ST.useTarget) {
        let tgt;
        if (ST.auto) { ST.autoT += dt; tgt = PRE[ORDER[Math.floor(ST.autoT / 2.8) % ORDER.length]]; f.quay = Math.sin(ST.autoT * 0.6) * 22; f.nghieng = Math.sin(ST.autoT * 0.45) * 12; }
        else tgt = PRE[ST.target];
        for (const k of ["cuoi", "mieng", "may", "nham"]) f[k] += (tgt[k] - f[k]) * Math.min(1, dt * 6);
        if (ST.auto && ORDER[Math.floor(ST.autoT / 2.8) % ORDER.length] === "ngu") f.nham = 1;
        if (now - (ST.lastSync || 0) > 200) { ST.lastSync = now; syncs.forEach((s) => s()); }
      }
      const noise = 0.5 + (1 - f.sang) * 9;
      ST.conf = clamp(0.3 + 0.7 * f.sang + (Math.random() - 0.5) * 0.08 * (1 - f.sang) * 4, 0, 1);
      if (f.sang < 0.3 && Math.random() < 0.2) ST.fr = { img: F.frame(f, 0).img }; // mất dấu khuôn mặt khung này
      else ST.fr = F.frame(f, noise);
      if (ST.fr.anchors) ST.feat = measure(ST.fr.anchors);
    } else {
      const fr = camFrame(); ST.fr = fr; ST.conf = fr ? 0.95 : 0;
      if (fr) ST.feat = camFeat(fr);
    }
    if (ST.fr && ST.fr.anchors) { const d = decide(ST.feat, dt); ST.expr = d.e; ST.rule = d.rule; } else ST.expr = "—";
    if (ST.time - histT > 0.05) { histT = ST.time; ST.hist.push({ t: ST.time, ...ST.feat }); while (ST.hist.length && ST.hist[0].t < ST.time - 10.5) ST.hist.shift(); }
    renderStage(); renderChart();
    if (soiVisible) renderSoi();
    if (now - slow > 140) { slow = now; renderBrain(); renderRadar(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); bind(); genCode(); P.srcButtons("sim");
  requestAnimationFrame(tick);
})();
