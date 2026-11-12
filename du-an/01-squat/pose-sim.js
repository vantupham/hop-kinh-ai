/* Hộp Kính AI · Bộ mô phỏng người tập squat (3D đơn giản → chiếu 2D)
   Trả về 33 điểm theo đúng chuẩn chỉ số của MediaPipe Pose, để
   chế độ mô phỏng và chế độ camera dùng CHUNG một đường xử lý. */
(function () {
  const RAD = Math.PI / 180;
  const L = { shin: 0.43, thigh: 0.43, torso: 0.52, upper: 0.29, fore: 0.26 };

  // d: độ sâu 0..1 · yaw: góc quay camera (90 = nhìn nghiêng, 0 = chính diện)
  function body(d) {
    const pts = {};
    const th = 38 * d * RAD;                 // ống chân ngả về trước
    const K = (178 - 108 * d) * RAD;         // góc gối thật (trong không gian 3D)
    const lean = 45 * d * RAD;               // thân người cúi về trước
    const arm = 85 * d * RAD;                // tay đưa ra trước giữ thăng bằng
    for (const [side, s] of [["L", 1], ["R", -1]]) {
      const ankle = [0, 0.08];
      const knee = [ankle[0] + L.shin * Math.sin(th), ankle[1] + L.shin * Math.cos(th)];
      const a0 = Math.atan2(-Math.cos(th), -Math.sin(th));
      const ah = a0 - K;
      const hip = [knee[0] + L.thigh * Math.cos(ah), knee[1] + L.thigh * Math.sin(ah)];
      const sh = [hip[0] + L.torso * Math.sin(lean), hip[1] + L.torso * Math.cos(lean)];
      const elb = [sh[0] + L.upper * Math.sin(arm), sh[1] - L.upper * Math.cos(arm)];
      const a2 = arm + 12 * d * RAD;
      const wr = [elb[0] + L.fore * Math.sin(a2), elb[1] - L.fore * Math.cos(a2)];
      const hand = [wr[0] + 0.07 * Math.sin(a2), wr[1] - 0.07 * Math.cos(a2)];
      pts["ankle" + side] = [...ankle, 0.11 * s];
      pts["knee" + side] = [...knee, 0.105 * s];
      pts["hip" + side] = [...hip, 0.09 * s];
      pts["sh" + side] = [...sh, 0.17 * s];
      pts["elb" + side] = [...elb, 0.2 * s];
      pts["wr" + side] = [...wr, 0.2 * s];
      pts["hand" + side] = [...hand, 0.2 * s];
      pts["heel" + side] = [ankle[0] - 0.05, 0.02, 0.11 * s];
      pts["toe" + side] = [ankle[0] + 0.16, 0.01, 0.12 * s];
    }
    const sh = pts.shL, lean2 = lean * 0.8;
    pts.head = [sh[0] + 0.24 * Math.sin(lean2), sh[1] + 0.24 * Math.cos(lean2), 0];
    return pts;
  }

  function project(p, yaw, cfg) {
    const f = p[0], u = p[1], l = p[2];
    const sy = Math.sin(yaw), cy = Math.cos(yaw);
    return {
      x: cfg.cx + (f * sy + l * cy) * cfg.S,
      y: cfg.ground - u * cfg.S,
      n: f * cy - l * sy // độ "gần camera"
    };
  }

  function frame(d, yawDeg, t, opts) {
    opts = opts || {};
    const yaw = yawDeg * RAD;
    const cfg = { S: 240, ground: 452, cx: 320 - 0.08 * 240 * Math.sin(yaw) };
    const b = body(d);
    const breathe = 0.004 * Math.sin(t * 2.1);
    for (const k in b) if (k.startsWith("sh") || k === "head" || k.startsWith("elb") || k.startsWith("wr") || k.startsWith("hand")) b[k][1] += breathe;
    const P = {};
    for (const k in b) P[k] = project(b[k], yaw, cfg);

    // các điểm trên mặt (tính quanh tâm đầu)
    const H = b.head, face = (df, du, dl) => project([H[0] + df, H[1] + du, dl], yaw, cfg);
    const sinY = Math.sin(yaw);
    const visNear = 0.98, visFar = 0.96 - 0.42 * sinY; // nhìn nghiêng: bên xa bị thân che
    // bên nào gần camera hơn?
    const rightNear = P.kneeR.n >= P.kneeL.n;
    const vis = (side) => (side === "R") === rightNear ? visNear : visFar;

    const lm = new Array(33);
    const put = (i, p, v) => (lm[i] = { x: p.x, y: p.y, n: p.n, v });
    put(0, face(0.1, -0.02, 0), 0.99 - 0.1 * sinY);
    put(1, face(0.085, 0.03, 0.02), 0.97); put(2, face(0.08, 0.03, 0.035), 0.97); put(3, face(0.07, 0.03, 0.05), 0.95);
    put(4, face(0.085, 0.03, -0.02), 0.97); put(5, face(0.08, 0.03, -0.035), 0.97); put(6, face(0.07, 0.03, -0.05), 0.95);
    put(7, face(0, 0.01, 0.075), vis("L")); put(8, face(0, 0.01, -0.075), vis("R"));
    put(9, face(0.085, -0.06, 0.025), 0.97); put(10, face(0.085, -0.06, -0.025), 0.97);
    const map = [[11, "sh"], [13, "elb"], [15, "wr"], [23, "hip"], [25, "knee"], [27, "ankle"], [29, "heel"], [31, "toe"]];
    for (const [i, k] of map) { put(i, P[k + "L"], vis("L")); put(i + 1, P[k + "R"], vis("R")); }
    for (const [side, base] of [["L", 17], ["R", 18]]) {
      const h = P["hand" + side], w = P["wr" + side];
      put(base, { x: h.x - 3, y: h.y + 3, n: h.n }, vis(side) * 0.9);
      put(base + 2, { x: h.x + 3, y: h.y - 2, n: h.n }, vis(side) * 0.9);
      put(base + 4, { x: (h.x + w.x) / 2 + 4, y: (h.y + w.y) / 2 - 4, n: h.n }, vis(side) * 0.9);
    }

    // nhiễu camera tự nhiên + các "sự cố" của phần Phá máy
    const jitter = (opts.noise ? 7 : 0.6);
    for (const p of lm) { p.x += (Math.random() - 0.5) * 2 * jitter; p.y += (Math.random() - 0.5) * 2 * jitter; }
    if (opts.occlude) {
      for (const i of [25, 26, 27, 28, 29, 30, 31, 32]) {
        const p = lm[i];
        p.v = 0.12 + Math.random() * 0.25;
        p.x += (Math.random() - 0.5) * 150; p.y += (Math.random() - 0.5) * 150;
      }
    }
    lm.head = P.head; lm.raw = P; lm.trueKnee = 178 - 108 * d;
    return lm;
  }

  // ---- vẽ "ảnh" người (lớp hình ảnh mà camera nhìn thấy) ----
  const C = { skin: "#f1c29a", skinD: "#d9a47a", shirt: "#ff6b4a", shirtD: "#d9543a", short: "#2d3268", shortD: "#21254f", shoe: "#f4f4f8", shoeD: "#c9cad6", hair: "#2a1e1a" };
  function drawBackground(ctx, w, h, dark) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    if (dark) { g.addColorStop(0, "#1a1d45"); g.addColorStop(0.78, "#23275a"); g.addColorStop(0.78, "#3a3360"); g.addColorStop(1, "#2a2549"); }
    else { g.addColorStop(0, "#ece9f8"); g.addColorStop(0.78, "#dcd6f0"); g.addColorStop(0.78, "#cbbfa3"); g.addColorStop(1, "#b9ab8b"); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = dark ? "rgba(140,150,255,.07)" : "rgba(255,255,255,.35)";
    for (let i = 0; i < 6; i++) ctx.fillRect(40 + i * 100, 60, 60, 120);
    ctx.fillStyle = "#6d5dfc"; ctx.globalAlpha = .18; ctx.beginPath(); ctx.ellipse(320, 458, 190, 14, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
  }
  function drawBody(ctx, lm) {
    const P = lm.raw, S = 240;
    const segs = [];
    const torsoN = (P.shL.n + P.shR.n + P.hipL.n + P.hipR.n) / 4;
    const add = (a, b, w, col, colD) => { const n = (P[a].n + P[b].n) / 2; segs.push({ n, draw: () => line(P[a], P[b], w, n < torsoN - 0.01 ? colD : col) }); };
    function line(a, b, w, col) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
    for (const s of ["L", "R"]) {
      add("hip" + s, "knee" + s, 0.14 * S, C.short, C.shortD);
      add("knee" + s, "ankle" + s, 0.1 * S, C.skin, C.skinD);
      add("heel" + s, "toe" + s, 0.075 * S, C.shoe, C.shoeD);
      add("sh" + s, "elb" + s, 0.09 * S, C.shirt, C.shirtD);
      add("elb" + s, "wr" + s, 0.07 * S, C.skin, C.skinD);
      add("wr" + s, "hand" + s, 0.075 * S, C.skin, C.skinD);
    }
    segs.push({ n: torsoN, draw: () => {
      ctx.fillStyle = C.shirt; ctx.strokeStyle = C.shirt; ctx.lineWidth = 0.12 * S; ctx.lineJoin = "round";
      ctx.beginPath(); ctx.moveTo(P.shL.x, P.shL.y); ctx.lineTo(P.shR.x, P.shR.y); ctx.lineTo(P.hipR.x, P.hipR.y); ctx.lineTo(P.hipL.x, P.hipL.y); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = C.short; ctx.lineWidth = 0.13 * S; ctx.beginPath(); ctx.moveTo(P.hipL.x, P.hipL.y); ctx.lineTo(P.hipR.x, P.hipR.y); ctx.stroke();
      // cổ + đầu
      const h = P.head; const sm = { x: (P.shL.x + P.shR.x) / 2, y: (P.shL.y + P.shR.y) / 2 };
      line(sm, h, 0.07 * S, C.skinD);
      ctx.fillStyle = C.skin; ctx.beginPath(); ctx.arc(h.x, h.y, 0.105 * S, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = C.hair; ctx.beginPath(); ctx.arc(h.x, h.y - 4, 0.108 * S, Math.PI * 1.05, Math.PI * 1.95); ctx.fill();
    }});
    segs.sort((a, b) => a.n - b.n).forEach((s) => s.draw());
  }

  window.PoseSim = { frame, drawBackground, drawBody };
})();
