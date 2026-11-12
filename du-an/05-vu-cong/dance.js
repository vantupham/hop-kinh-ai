/* Hộp Kính AI · Dự án 05 · Vũ công AI (vector xương, chuẩn hóa, cosine, cửa sổ thời gian) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, DS = DancerSim;
  const prog = P.progress("hka-05");
  const W = 640, HH = 480, S = 200, TCX = 160, CY = 250;
  const BONES = [[11, 13, "Cánh tay T"], [13, 15, "Cẳng tay T"], [12, 14, "Cánh tay P"], [14, 16, "Cẳng tay P"], [23, 25, "Đùi T"], [25, 27, "Cẳng chân T"], [24, 26, "Đùi P"], [26, 28, "Cẳng chân P"]];
  const METHODS = [["vitri", "Vị trí thô"], ["chuanhoa", "Chuẩn hóa"], ["cosine", "Cosine"]];
  const MIR = {}; [[11, 12], [13, 14], [15, 16], [17, 18], [19, 20], [21, 22], [23, 24], [25, 26], [27, 28], [29, 30], [31, 32], [1, 4], [2, 5], [3, 6], [7, 8], [9, 10]].forEach(([a, b]) => { MIR[a] = b; MIR[b] = a; });
  const GAME = [1, 2, 3, 5, 7];
  const ST = {
    src: "sim", mode: "dance", t: 0, err: 0, delay: 0, far: 1, method: "cosine", methodsUsed: new Set(["cosine"]), maxAng: 60,
    mirror: false, mirrorFix: false, win: false, ghost: true, color: true,
    T: null, Sx: null, res: null, all: {}, tau: 0, hist: [], level: 0, passed: 0, holdT: 0, poseLm: null, drag: null, flash: 0
  };
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d"), video = $("video");
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  // ---------- tạo hai bộ khung xương ----------
  function mirrorPose(p) { return { aL: p.aR, eL: p.eR, aR: p.aL, eR: p.eL, hL: p.hR, kL: p.kR, hR: p.hL, kR: p.kL, tilt: -p.tilt, dip: p.dip }; }
  function studentPlace() { const f = ST.far; return { cx: 480 + (1 - f) * 70, cy: CY - (1 - f) * 70, s: S * f }; }
  function teacherAt(t) { return DS.place(DS.skeleton(ST.mode === "pose" ? DS.POSES[GAME[ST.level % GAME.length]] : DS.choreo(t)), TCX, CY, S); }
  function studentSim() {
    if (ST.mode === "pose") return ST.poseLm;
    let p = DS.choreo(ST.t - ST.delay); p = { ...p, aL: p.aL + ST.err };
    if (ST.mirror) p = mirrorPose(p);
    const sp = studentPlace();
    return DS.place(DS.skeleton(p), sp.cx, sp.cy, sp.s);
  }
  function resetPoseLm() { const sp = studentPlace(); ST.poseLm = DS.place(DS.skeleton(DS.POSES[0]), sp.cx, sp.cy, sp.s); }

  // ---------- so sánh ----------
  function flip(lm) { const c = mid(lm[23], lm[24]); return lm.map((_, i) => { const q = lm[MIR[i] != null ? MIR[i] : i]; return { ...q, x: 2 * c.x - q.x }; }); }
  function norm(lm) { const c = mid(lm[23], lm[24]), sh = mid(lm[11], lm[12]), L = dist(c, sh) || 1; return lm.map((q) => ({ x: (q.x - c.x) / L, y: (q.y - c.y) / L })); }
  function compare(T, Sx, method) {
    const per = BONES.map(([a, b, name]) => {
      let s;
      if (method === "cosine") {
        const u = { x: T[b].x - T[a].x, y: T[b].y - T[a].y }, v = { x: Sx[b].x - Sx[a].x, y: Sx[b].y - Sx[a].y };
        const cos = (u.x * v.x + u.y * v.y) / ((Math.hypot(u.x, u.y) * Math.hypot(v.x, v.y)) || 1), ang = Math.acos(clamp(cos, -1, 1)) * 180 / Math.PI;
        s = clamp(1 - ang / ST.maxAng, 0, 1);
        return { name, a, b, s, cos, ang, u, v };
      }
      if (method === "chuanhoa") { const nT = ST._nT, nS = ST._nS; s = (clamp(1 - dist(nT[a], nS[a]) / 0.35, 0, 1) + clamp(1 - dist(nT[b], nS[b]) / 0.35, 0, 1)) / 2; return { name, a, b, s }; }
      const off = (q) => ({ x: q.x - 320, y: q.y });
      s = (clamp(1 - dist(T[a], off(Sx[a])) / 70, 0, 1) + clamp(1 - dist(T[b], off(Sx[b])) / 70, 0, 1)) / 2;
      return { name, a, b, s };
    });
    return { per, score: Math.round(per.reduce((t, p) => t + p.s, 0) / per.length * 100) };
  }
  function evaluate(T, Sx) {
    if (ST.mirrorFix) Sx = flip(Sx);
    ST._nT = norm(T); ST._nS = norm(Sx);
    const out = {}; for (const [m] of METHODS) out[m] = compare(T, Sx, m);
    return { out, Sx };
  }

  // ---------- camera ----------
  let landmarker = null, stream = null, lastVT = -1, camLm = null;
  function camStudent() {
    if (!landmarker || video.readyState < 2) return camLm;
    if (video.currentTime === lastVT) return camLm; lastVT = video.currentTime;
    const r = landmarker.detectForVideo(video, performance.now()), p = r.landmarks && r.landmarks[0];
    if (!p) return (camLm = null);
    const vw = video.videoWidth || 640, vh = video.videoHeight || 480, cw = vh * 320 / 480, x0 = (vw - cw) / 2;
    camLm = p.map((q) => ({ x: 320 + (1 - (q.x * vw - x0) / cw) * 320, y: q.y * HH, v: q.visibility == null ? 1 : q.visibility }));
    return camLm;
  }
  async function useCam() {
    P.msg($("stageMsg"), "Đang tải mô hình AI tư thế (khoảng 6 MB, chỉ tải lần đầu)…", "loader");
    try { landmarker = await P.vision("pose"); stream = await P.camera(video); ST.src = "cam"; ST.mode = "dance"; markMode(); P.srcButtons("cam"); P.msg($("stageMsg"), null); }
    catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được camera (" + (e.message || e) + "). " + P.FAIL, "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; ST.src = "sim"; P.srcButtons("sim"); markMode(); }

  // ---------- vẽ ----------
  const scoreCol = (s) => `hsl(${Math.round(s * 130)}, 85%, 55%)`;
  function skel(ctx, lm, col, w, dash, per) {
    const all = [[11, 12], [11, 23], [12, 24], [23, 24]];
    ctx.lineCap = "round"; if (dash) ctx.setLineDash(dash);
    ctx.strokeStyle = col; ctx.lineWidth = w * 0.7;
    for (const [a, b] of all) { ctx.beginPath(); ctx.moveTo(lm[a].x, lm[a].y); ctx.lineTo(lm[b].x, lm[b].y); ctx.stroke(); }
    BONES.forEach(([a, b], i) => { ctx.strokeStyle = per ? scoreCol(per[i].s) : col; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(lm[a].x, lm[a].y); ctx.lineTo(lm[b].x, lm[b].y); ctx.stroke(); });
    ctx.setLineDash([]);
    for (const i of [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]) { ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(lm[i].x, lm[i].y, w * 0.55, 0, 7); ctx.fill(); }
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(lm[0].x, lm[0].y, w * 1.6, 0, 7); ctx.fill();
  }
  function ghostOn(T, Sx) {
    const nT = norm(T), c = mid(Sx[23], Sx[24]), L = dist(c, mid(Sx[11], Sx[12]));
    return nT.map((q) => ({ x: c.x + q.x * L, y: c.y + q.y * L }));
  }
  function bgStage(ctx) {
    D.room(ctx, P.TH.dark);
    ctx.fillStyle = P.TH.dark ? "rgba(145,132,255,.08)" : "rgba(84,67,255,.06)"; ctx.fillRect(0, 0, 320, HH);
    ctx.strokeStyle = P.TH.dark ? "#3a3f8a" : "#c9c2f5"; ctx.setLineDash([6, 6]); ctx.beginPath(); ctx.moveTo(320, 0); ctx.lineTo(320, HH); ctx.stroke(); ctx.setLineDash([]);
  }
  function renderStage() {
    const ctx = sctx; bgStage(ctx);
    if (ST.src !== "sim" && video.readyState >= 2) {
      const vw = video.videoWidth || 640, vh = video.videoHeight || 480, cw = vh * 320 / 480, x0 = (vw - cw) / 2;
      ctx.save(); ctx.translate(640, 0); ctx.scale(-1, 1); ctx.drawImage(video, x0, 0, cw, vh, 0, 0, 320, HH); ctx.restore();
    }
    if (ST.T) DS.drawBody(ctx, ST.T, S, "#7b6dff", "#3d3299");
    if (ST.Sx) {
      if (ST.src === "sim") DS.drawBody(ctx, ST.Sx, S * (ST.mode === "pose" ? 1 : ST.far), "#ff7d5f", "#b8462f");
      const per = ST.res && ST.color ? ST.res.per : null;
      skel(ctx, ST.Sx, "#fff", 5, null, per);
      if (ST.ghost && ST.T) skel(ctx, ghostOn(ST.T, ST.Sx), "rgba(145,132,255,.85)", 3, [7, 6]);
      if (ST.mode === "pose" && ST.src === "sim") for (const i of [15, 16, 27, 28]) { const q = ST.Sx[i]; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(q.x, q.y, 13, 0, 7); ctx.stroke(); ctx.fillStyle = "rgba(255,195,77,.3)"; ctx.fill(); }
    }
    ctx.font = "700 12px JetBrains Mono, monospace"; ctx.fillStyle = P.TH.dark ? "#c3c7f0" : "#383d66";
    ctx.fillText(ST.mode === "pose" ? "MẪU: " + DS.POSES[GAME[ST.level % GAME.length]].name.toUpperCase() : "VŨ CÔNG MẪU", 16, 26); ctx.fillText("EM", 336, 26);
    const sc = ST.res ? ST.res.score : 0;
    ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, W - 132, HH - 74, 118, 60, 14); ctx.fill();
    ctx.fillStyle = scoreCol(sc / 100); ctx.font = "800 34px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText(ST.res ? sc : "—", W - 73, HH - 32); ctx.textAlign = "left";
    if (ST.flash > 0) { ctx.fillStyle = `rgba(62,233,207,${ST.flash * 0.35})`; ctx.fillRect(320, 0, 320, HH); D.pill(ctx, "ĐẠT! Sang dáng tiếp theo", 480, 60, "#0b7d71", 15); }
    if (!ST.Sx && ST.src !== "sim") D.pill(ctx, "Không thấy em trong khung hình", 480, 60, "#c2402a", 13);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Hai khung xương", e: "figure", d: "Mô hình tư thế (như ở Dự án 1) cho ra <b>33 điểm</b> của mỗi người. Ta có hai bộ điểm: của vũ công mẫu và của em." },
    { t: "Chuẩn hóa", e: "layers", d: "Dời cả hai về cùng một tâm (giữa hai hông) và chia cho chiều dài thân. Giờ hai người <b>cùng cỡ, cùng chỗ</b>, chỉ còn khác nhau ở dáng." },
    { t: "8 vector xương", e: "arrowR", d: "Mỗi đoạn xương thành một mũi tên. Ta đặt từng cặp mũi tên (tím = mẫu, cam = em) chung một gốc để so hướng." },
    { t: "Tính cosine", e: "angle", d: "Với đoạn xương lệch nhiều nhất, ta tính <b>cos θ = (a·b) / (|a|·|b|)</b>, rồi đổi góc lệch ra điểm: lệch 0° được 100%, lệch từ góc giới hạn trở lên được 0%." },
    { t: "Điểm tổng", e: "chart", d: "Điểm cuối cùng là <b>trung bình</b> điểm của 8 đoạn xương. Đoạn nào đỏ là chỗ em cần sửa." },
    { t: "Theo thời gian", e: "clock", d: "Một bài nhảy là một chuỗi khung hình. So từng khung hình thì chậm nhịp bị phạt nặng, còn <b>cửa sổ thời gian</b> thì tìm khung hình khớp nhất trong vòng 0,6 giây." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 2) prog.done("see"); });
  P.visible($("soi"), (v) => (soiVisible = v));
  function dial(ctx, cx, cy, r, b, label) {
    ctx.strokeStyle = "#2c3170"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    const un = (v) => { const L = Math.hypot(v.x, v.y) || 1; return { x: v.x / L, y: v.y / L }; };
    const u = un(b.u), v = un(b.v);
    D.arrow(ctx, { x: cx, y: cy }, { x: cx + u.x * r, y: cy + u.y * r }, "#9184ff", 3.5);
    D.arrow(ctx, { x: cx, y: cy }, { x: cx + v.x * r, y: cy + v.y * r }, "#ff7d5f", 3.5);
    ctx.fillStyle = "#fff"; ctx.font = "600 12px Be Vietnam Pro"; ctx.textAlign = "center"; ctx.fillText(label, cx, cy + r + 18);
    ctx.fillStyle = scoreCol(b.s); ctx.font = "700 12px JetBrains Mono"; ctx.fillText(`${b.ang.toFixed(0)}°`, cx, cy - r - 8); ctx.textAlign = "left";
  }
  function renderSoi() {
    const s = pipe.get(), ctx = octx; D.labBg(ctx);
    if (!ST.T || !ST.Sx) return;
    const cosRes = ST.all.cosine;
    if (s === 0) { skel(ctx, ST.T, "#9184ff", 5); skel(ctx, ST.Sx, "#ff7d5f", 5); for (const i of [11, 15, 25]) for (const L of [ST.T, ST.Sx]) { ctx.fillStyle = "#fff"; ctx.font = "600 11px JetBrains Mono"; ctx.fillText("#" + i, L[i].x + 8, L[i].y - 6); } return; }
    if (s === 1) {
      const sc = 120, cx = W / 2, cy = 230, tr = (n) => n.map((q) => ({ x: cx + q.x * sc, y: cy + q.y * sc }));
      ctx.strokeStyle = "#2f3580"; ctx.beginPath(); ctx.moveTo(cx - 200, cy); ctx.lineTo(cx + 200, cy); ctx.moveTo(cx, 40); ctx.lineTo(cx, 440); ctx.stroke();
      skel(ctx, tr(ST._nT), "#9184ff", 5); skel(ctx, tr(ST._nS), "#ff7d5f", 4, [8, 6]);
      ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, 7); ctx.fill(); D.pill(ctx, "tâm hông = (0, 0)", cx + 90, cy + 20, "#8a5a00", 12);
      return;
    }
    if (s === 2) { cosRes.per.forEach((b, i) => dial(ctx, 90 + (i % 4) * 155, 120 + Math.floor(i / 4) * 210, 52, b, b.name)); return; }
    if (s === 3) {
      const b = cosRes.per.reduce((m, x) => (x.s < m.s ? x : m), cosRes.per[0]);
      dial(ctx, W / 2, 220, 150, b, b.name + " (lệch nhiều nhất)");
      const un = (v) => { const L = Math.hypot(v.x, v.y) || 1; return Math.atan2(v.y / L, v.x / L); };
      const a1 = un(b.u), a2 = un(b.v); let d = a2 - a1; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
      ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(W / 2, 220, 60, a1, a1 + d, d < 0); ctx.stroke();
      return;
    }
    if (s === 4) {
      const per = (ST.res || cosRes).per;
      per.forEach((b, i) => { const x = 40 + i * 72, h = b.s * 300; ctx.fillStyle = "#232866"; D.rr(ctx, x, 80, 48, 300, 8); ctx.fill(); ctx.fillStyle = scoreCol(b.s); D.rr(ctx, x, 380 - h, 48, Math.max(6, h), 8); ctx.fill(); ctx.save(); ctx.translate(x + 30, 396); ctx.rotate(Math.PI / 5); ctx.fillStyle = "#c3c7f0"; ctx.font = "600 11px Be Vietnam Pro"; ctx.fillText(b.name, 0, 0); ctx.restore(); ctx.fillStyle = "#fff"; ctx.font = "700 12px JetBrains Mono"; ctx.textAlign = "center"; ctx.fillText(Math.round(b.s * 100), x + 24, 70); ctx.textAlign = "left"; });
      const avg = ST.res.score, y = 380 - avg * 3; ctx.setLineDash([7, 5]); ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(30, y); ctx.lineTo(620, y); ctx.stroke(); ctx.setLineDash([]); D.pill(ctx, "trung bình " + avg, 560, y - 16, "#0b7d71", 12);
      return;
    }
    const h = ST.hist.filter((q) => q.t > ST.t - 6), X = (t) => 40 + (1 - (ST.t - t) / 6) * 570, Y = (v) => 400 - v * 3.2;
    ctx.strokeStyle = "#2c3170"; for (const v of [0, 50, 85, 100]) { ctx.beginPath(); ctx.moveTo(40, Y(v)); ctx.lineTo(610, Y(v)); ctx.stroke(); ctx.fillStyle = "#8f96d4"; ctx.font = "11px JetBrains Mono"; ctx.fillText(v, 10, Y(v) + 4); }
    for (const [k, c, w] of [["noWin", "#ff7d5f", 2.5], ["win", "#5ef2d6", 3]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); h.forEach((q, i) => (i ? ctx.lineTo(X(q.t), Y(q[k])) : ctx.moveTo(X(q.t), Y(q[k])))); ctx.stroke(); }
    D.pill(ctx, "từng khung hình", 140, 40, "#c2402a", 12); D.pill(ctx, "cửa sổ 0,6 giây", 330, 40, "#0b7d71", 12);
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"); if (!ST.T || !ST.Sx) { el.textContent = "Đang chờ vũ công…"; return; }
    const f0 = (v) => v.toFixed(0), c = ST.all.cosine;
    if (s === 0) el.innerHTML = `Mẫu:  vai trái #11 (${f0(ST.T[11].x)}, ${f0(ST.T[11].y)})\nEm:   vai trái #11 (${f0(ST.Sx[11].x)}, ${f0(ST.Sx[11].y)})\nMỗi người: <span class="hl">33 điểm × (x, y)</span>`;
    else if (s === 1) { const L1 = dist(mid(ST.T[23], ST.T[24]), mid(ST.T[11], ST.T[12])), L2 = dist(mid(ST.Sx[23], ST.Sx[24]), mid(ST.Sx[11], ST.Sx[12])); el.innerHTML = `Chiều dài thân mẫu: <span class="w">${f0(L1)} px</span>\nChiều dài thân em:  <span class="w">${f0(L2)} px</span>\nSau khi chia → cả hai thân dài đúng <span class="hl">1,00</span>`; }
    else if (s === 2) el.innerHTML = c.per.map((b) => `${b.name.padEnd(12, " ")} lệch <span class="${b.ang < 20 ? "hl" : "w"}">${b.ang.toFixed(0).padStart(3, " ")}°</span>`).join("\n");
    else if (s === 3) { const b = c.per.reduce((m, x) => (x.s < m.s ? x : m), c.per[0]); el.innerHTML = `${b.name}\na = (${f0(b.u.x)}, ${f0(b.u.y)})   b = (${f0(b.v.x)}, ${f0(b.v.y)})\na·b = ${f0(b.u.x * b.v.x + b.u.y * b.v.y)}   |a|·|b| = ${f0(Math.hypot(b.u.x, b.u.y) * Math.hypot(b.v.x, b.v.y))}\ncos θ = <span class="hl">${b.cos.toFixed(3)}</span> → θ = <span class="w">${b.ang.toFixed(1)}°</span>\nđiểm = 1 − ${b.ang.toFixed(0)}/${ST.maxAng} = <span class="hl">${Math.round(b.s * 100)}%</span>`; }
    else if (s === 4) el.innerHTML = `Cách so sánh: <span class="w">${METHODS.find((m) => m[0] === ST.method)[1]}</span>\nĐiểm tổng = trung bình 8 đoạn = <span class="hl">${ST.res.score}</span>`;
    else el.innerHTML = `Chậm nhịp cài đặt: <span class="w">${ST.delay.toFixed(2)} s</span>\nCửa sổ tìm được lệch tốt nhất: <span class="hl">${ST.tau.toFixed(2)} s</span>\nĐiểm từng khung: ${ST.lastNoWin} · có cửa sổ: <span class="hl">${ST.lastWin}</span>`;
  }

  // ---------- bảng não, biểu đồ, bảng so sánh, code ----------
  function renderBrain() {
    const r = ST.res; $("bScore").textContent = r ? r.score : "—"; $("bScore").style.color = r ? scoreCol(r.score / 100) : "";
    $("bBones").innerHTML = r ? r.per.map((b) => `<div class="r"><span>${b.name}</span><span class="bar"><i style="width:${b.s * 100}%;background:${scoreCol(b.s)}"></i></span><span>${Math.round(b.s * 100)}</span></div>`).join("") : "";
    $("bBeat").textContent = ST.mode === "pose" ? "—" : (Math.floor(ST.t / DS.BEAT) % 8) + 1 + "/8";
    $("bTau").textContent = ST.win && ST.mode === "dance" ? ST.tau.toFixed(2) + " s" : "tắt";
    $("cmpTable").innerHTML = `<tr><th>Cách so sánh</th><th>Điểm lúc này</th><th>Bị ảnh hưởng bởi</th></tr>` + METHODS.map(([m, n]) => `<tr class="${m === ST.method ? "on" : ""}"><td>${n}</td><td class="mono"><b style="color:${scoreCol((ST.all[m] ? ST.all[m].score : 0) / 100)}">${ST.all[m] ? ST.all[m].score : "—"}</b></td><td>${m === "vitri" ? "vị trí, chiều cao, khoảng cách" : m === "chuanhoa" ? "chỉ dáng (và tỉ lệ cơ thể)" : "chỉ hướng xương"}</td></tr>`).join("");
  }
  function renderChart() {
    const TH = P.TH, h = ST.hist, marks = [];
    P.lineChart($("chart"), [{ data: h.map((q) => ({ t: q.t, v: q.score })), color: TH.violet, width: 3 }],
      { min: 0, max: 100, span: 10, now: ST.t, ticks: [0, 25, 50, 75, 100], thresholds: [{ v: 85, label: "mức đạt 85", color: TH.coral }], marks });
    const ctx = $("chart").getContext("2d"), Wc = 1100, L = 46, R = 14;
    if (ST.mode === "dance") { ctx.strokeStyle = TH.grid; ctx.lineWidth = 1; for (let b = Math.ceil((ST.t - 10) / DS.BEAT); b * DS.BEAT <= ST.t; b++) { const x = L + (1 - (ST.t - b * DS.BEAT) / 10) * (Wc - L - R); ctx.beginPath(); ctx.moveTo(x, 12); ctx.lineTo(x, 214); ctx.stroke(); } }
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${k("function")} diemGiong(mau, em) {
  ${k("const")} xuong = [[${n(11)},${n(13)}], [${n(13)},${n(15)}], [${n(12)},${n(14)}], [${n(14)},${n(16)}],
                 [${n(23)},${n(25)}], [${n(25)},${n(27)}], [${n(24)},${n(26)}], [${n(26)},${n(28)}]];
  ${k("let")} tong = ${n(0)};
  ${k("for")} (${k("const")} [dau, cuoi] ${k("of")} xuong) {
    ${k("const")} a = vector(mau[dau], mau[cuoi]);   ${c("// mũi tên của mẫu")}
    ${k("const")} b = vector(em[dau], em[cuoi]);     ${c("// mũi tên của em")}
    ${k("const")} cos = (a.x*b.x + a.y*b.y) / (doDai(a) * doDai(b));
    ${k("const")} gocLech = Math.acos(cos) * ${n(180)} / Math.PI;
    tong += Math.max(${n(0)}, ${n(1)} - gocLech / ${n(ST.maxAng)});   ${c("// lệch ≥ " + ST.maxAng + "° → 0 điểm")}
  }
  ${k("return")} Math.round(tong / xuong.length * ${n(100)});
}`;
  }

  // ---------- kéo thả (trò chơi tạo dáng) ----------
  function pick(e) { const r = stage.getBoundingClientRect(); return { x: (e.clientX - r.left) * W / r.width, y: (e.clientY - r.top) * HH / r.height }; }
  function applyIK(i, T) {
    const lm = ST.poseLm, sp = studentPlace(), arm = i === 15 || i === 16;
    const root = lm[arm ? (i === 15 ? 11 : 12) : (i === 27 ? 23 : 24)], midI = arm ? (i === 15 ? 13 : 14) : (i === 27 ? 25 : 26);
    const L1 = (arm ? 0.3 : 0.44) * sp.s, L2 = (arm ? 0.27 : 0.42) * sp.s, cx = mid(lm[23], lm[24]).x;
    const sols = [1, -1].map((sg) => DS.ik(root, lm[midI], lm[i], T, L1, L2, sg));
    const best = sols.reduce((m, s) => (Math.abs(s[0].x - cx) > Math.abs(m[0].x - cx) ? s : m), sols[0]);
    lm[midI] = { ...lm[midI], ...best[0] }; lm[i] = { ...lm[i], ...best[1] };
    const e = lm[midI], w = lm[i];
    if (arm) for (const j of i === 15 ? [17, 19, 21] : [18, 20, 22]) lm[j] = { x: w.x + (w.x - e.x) * 0.25, y: w.y + (w.y - e.y) * 0.25, v: 1 };
    else { lm[i === 27 ? 29 : 30] = { x: w.x, y: w.y + 8, v: 1 }; lm[i === 27 ? 31 : 32] = { x: w.x + (i === 27 ? -12 : 12), y: w.y + 10, v: 1 }; }
  }
  function bindDrag() {
    stage.addEventListener("pointerdown", (e) => {
      if (ST.mode !== "pose" || ST.src !== "sim") return;
      const p = pick(e); let best = null, bd = 30;
      for (const i of [15, 16, 27, 28]) { const d = dist(p, ST.poseLm[i]); if (d < bd) { bd = d; best = i; } }
      if (best != null) { ST.drag = best; stage.setPointerCapture(e.pointerId); }
    });
    stage.addEventListener("pointermove", (e) => { if (ST.drag != null) applyIK(ST.drag, pick(e)); });
    const up = () => (ST.drag = null); stage.addEventListener("pointerup", up); stage.addEventListener("pointercancel", up);
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function markMode() {
    for (const [id, m] of [["modeDance", "dance"], ["modePose", "pose"]]) { const b = $(id); b.classList.toggle("ghost", ST.mode !== m); b.setAttribute("aria-pressed", ST.mode === m); }
    $("danceCtl").hidden = ST.mode !== "dance" || ST.src !== "sim"; $("poseCtl").hidden = ST.mode !== "pose" || ST.src !== "sim";
    $("poseLevel").textContent = `Dáng ${ST.level % GAME.length + 1}/${GAME.length} · đã qua ${ST.passed}`;
  }
  function markMethod() { $("methodBtns").querySelectorAll("button").forEach((b) => { const on = b.dataset.m === ST.method; b.classList.toggle("ghost", !on); b.setAttribute("aria-pressed", on); }); }
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useCam;
    $("modeDance").onclick = () => { ST.mode = "dance"; markMode(); };
    $("modePose").onclick = () => { ST.mode = "pose"; ST.far = 1; syncs.forEach((f) => f()); resetPoseLm(); markMode(); };
    $("btnSkip").onclick = () => { ST.level++; resetPoseLm(); markMode(); };
    $("methodBtns").innerHTML = METHODS.map(([m, n]) => `<button class="btn small ghost" data-m="${m}">${n}</button>`).join("");
    $("methodBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.method = b.dataset.m; ST.methodsUsed.add(ST.method); if (ST.methodsUsed.size === 3) prog.done("method"); markMethod(); }));
    syncs.push(P.range("err", () => ST.err, (v) => (ST.err = v), (v) => v + "°"));
    syncs.push(P.range("delay", () => ST.delay, (v) => (ST.delay = v), (v) => v.toFixed(2) + " s"));
    syncs.push(P.range("far", () => ST.far, (v) => (ST.far = v), (v) => (v > 0.95 ? "bằng mẫu" : v > 0.75 ? "xa hơn" : "rất xa")));
    syncs.push(P.range("maxAng", () => ST.maxAng, (v) => (ST.maxAng = v), (v) => v + "°", genCode));
    $("showGhost").onchange = (e) => (ST.ghost = e.target.checked); $("showColor").onchange = (e) => (ST.color = e.target.checked);
    $("mirrorFix").onchange = (e) => (ST.mirrorFix = e.target.checked); $("window").onchange = (e) => (ST.win = e.target.checked);
    const syncT = () => { $("mirrorFix").checked = ST.mirrorFix; $("window").checked = ST.win; syncs.forEach((f) => f()); markMethod(); markMode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, { err: 0, delay: 0, far: 1, mirror: false, mirrorFix: false, win: false, mode: "dance" });
      if (k === "far") { ST.far = 0.6; ST.method = "vitri"; }
      if (k === "mirror") { ST.mirror = true; ST.method = "cosine"; }
      if (k === "late") { ST.delay = 0.35; ST.method = "cosine"; }
      if (ST.src !== "sim") useSim();
      ST.methodsUsed.add(ST.method); syncT(); prog.done("broke");
      $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, { err: 0, delay: 0, far: 1, mirror: false, mirrorFix: false, win: false, method: "cosine" }); syncT(); };
    bindDrag(); syncT();
  }

  const QUIZ = [
    { q: "Vector của cẳng tay (từ khuỷu #13 ở (100, 200) tới cổ tay #15 ở (160, 120)) là…", o: ["(160, 120)", "(60, −80)", "(260, 320)", "(−60, 80)"], a: 1, e: "Vector = điểm cuối − điểm đầu = (160 − 100, 120 − 200) = (60, −80)." },
    { q: "Vì sao so sánh \"vị trí thô\" lại không công bằng?", o: ["Vì nó chạy chậm", "Vì người thấp hơn, đứng xa hơn hay lệch chỗ đều bị trừ điểm dù động tác đúng", "Vì nó chỉ dùng 2 điểm", "Vì máy tính không cộng được"], a: 1, e: "Vị trí thô phụ thuộc chiều cao và chỗ đứng. Chuẩn hóa hoặc so hướng xương sẽ loại bỏ những yếu tố đó." },
    { q: "Hai vector cùng hướng nhưng một cái dài gấp đôi. cos của góc giữa chúng là…", o: ["0", "0,5", "1", "2"], a: 2, e: "Cosine chỉ quan tâm hướng: cùng hướng thì góc 0°, cos = 1, dù độ dài khác nhau." },
    { q: "Em nhảy đúng nhưng chậm nửa nhịp. Cách nào giúp chấm điểm hợp lý hơn?", o: ["Tăng độ sáng camera", "Tìm khung hình của mẫu khớp nhất trong một cửa sổ thời gian ngắn", "Chỉ so tay trái", "Bỏ qua chân"], a: 1, e: "Cửa sổ thời gian (hoặc DTW) cho phép lệch nhịp một chút mà không phạt quá nặng." },
    { q: "Em làm \"như soi gương\": mẫu giơ tay trái, em giơ tay phải. Điều nào ĐÚNG?", o: ["Máy tự hiểu ý em", "Máy so tay trái với tay trái nên chấm thấp, trừ khi được thiết kế để lật gương", "Cosine tự sửa lỗi này", "Không ảnh hưởng gì"], a: 1, e: "Máy không đoán được ý định. Người thiết kế phải quyết định có lật gương trước khi so sánh hay không." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0, histT = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; ST.flash = Math.max(0, ST.flash - dt * 1.5);
    ST.T = teacherAt(ST.t);
    ST.Sx = ST.src === "sim" ? studentSim() : camStudent();
    if (ST.Sx) {
      const ev = evaluate(ST.T, ST.Sx); ST.all = ev.out;
      let res = ev.out[ST.method], noWin = res.score, bestTau = 0;
      if (ST.mode === "dance") {
        let best = res;
        for (let tau = 0.05; tau <= 0.6; tau += 0.05) { const e2 = evaluate(teacherAt(ST.t - tau), ST.Sx).out[ST.method]; if (e2.score > best.score) { best = e2; bestTau = tau; } }
        ST.lastNoWin = noWin; ST.lastWin = best.score; ST.tau = bestTau;
        if (ST.win) { res = best; ST.T = teacherAt(ST.t - bestTau); }
        evaluate(ST.T, ST.Sx); // giữ dữ liệu chuẩn hóa khớp với khung đang hiển thị
      }
      ST.res = res;
      if (ST.mode === "pose" && ST.src === "sim" && ST.flash <= 0) {
        ST.holdT = res.score >= 85 ? ST.holdT + dt : 0;
        $("poseMsg").innerHTML = res.score >= 85 ? `<b style="color:var(--mint)">Giữ nguyên…</b>` : `Cần đạt 85 điểm`;
        if (ST.holdT > 0.6) { ST.holdT = 0; ST.passed++; ST.level++; ST.flash = 1; if (ST.passed >= 3) prog.done("match"); setTimeout(() => { resetPoseLm(); markMode(); }, 700); }
      }
      if (ST.t - histT > 0.05) { histT = ST.t; ST.hist.push({ t: ST.t, score: res.score, noWin: ST.lastNoWin || res.score, win: ST.lastWin || res.score }); while (ST.hist.length && ST.hist[0].t < ST.t - 10.5) ST.hist.shift(); }
    } else ST.res = null;
    renderStage(); renderChart();
    if (soiVisible) renderSoi();
    if (now - slow > 130) { slow = now; renderBrain(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); resetPoseLm(); bind(); genCode(); P.srcButtons("sim"); markMode(); markMethod();
  requestAnimationFrame(tick);
})();
