/* Hộp Kính AI · Khuôn mặt mô phỏng (lưới rút gọn ~100 điểm)
   Tham số: cuoi (-0.6..1), mieng (0..1), may (-0.5..1), nham (0..1), quay (độ), nghieng (độ), sang (0.15..1), khauTrang
   Trả về { pts, lines, anchors, img } — anchors dùng chung tên với chế độ camera. */
(function () {
  const R = Math.PI / 180;
  function build(f) {
    const pts = [], groups = {};
    const add = (g, u, v, zb) => { const i = pts.length; pts.push({ u, v, zb: zb || 0 }); (groups[g] = groups[g] || []).push(i); return i; };
    const s = f.cuoi, j = f.mieng, b = f.may, k = f.nham;
    // viền mặt
    for (let i = 0; i < 36; i++) { const t = -Math.PI / 2 + i * Math.PI * 2 / 36; let u = 0.47 * Math.cos(t), v = 0.63 * Math.sin(t); if (v > 0) { u *= 1 - 0.28 * (v / 0.63) ** 2; v += 0.07 * j * (v / 0.63) ** 3; } add("oval", u, v); }
    // lông mày
    for (const sd of [-1, 1]) for (let i = 0; i < 5; i++) { const t = i / 4, u = sd * (0.09 + 0.27 * t); const inner = 1 - t; add(sd < 0 ? "browL" : "browR", u, -0.28 - b * 0.075 - 0.035 * Math.sin(Math.PI * t) + (b < 0 ? -b * 0.05 * inner * -1 : 0) - (b < 0 ? -b * 0.06 * inner : 0)); }
    // mắt
    for (const sd of [-1, 1]) {
      const cx = sd * 0.2, cy = -0.13, hw = 0.088, open = Math.max(0.003, 0.046 * (1 - k)) * (1 + 0.25 * Math.max(0, b)) * (1 - 0.25 * Math.max(0, s));
      for (let i = 0; i < 8; i++) { const t = i * Math.PI * 2 / 8, up = Math.sin(t) < 0; add(sd < 0 ? "eyeL" : "eyeR", cx + hw * Math.cos(t), cy + Math.sin(t) * (up ? open * 1.15 : open * 0.85), 0.02); }
      add(sd < 0 ? "irisL" : "irisR", cx, cy, 0.03);
    }
    // mũi
    for (let i = 0; i < 4; i++) add("noseB", 0, -0.12 + i * 0.065, 0.06 + i * 0.04);
    for (let i = 0; i < 5; i++) add("noseN", -0.075 + i * 0.0375, 0.1 - (i === 2 ? 0.0 : 0.012 * Math.abs(i - 2)), 0.12);
    // miệng
    const mw = 0.165 + 0.05 * Math.max(0, s) - 0.02 * j, cyM = 0.3, lift = 0.075 * s, gap = 0.012 + 0.17 * j;
    for (let i = 0; i < 16; i++) {
      const t = i / 16 * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t), u = mw * c;
      const edge = Math.abs(c) ** 3;
      let v = cyM - lift * edge;
      v += sn < 0 ? sn * (0.035 + 0.01 * (1 - edge)) : sn * (0.045 + gap * (1 - edge));
      add("lipO", u, v, 0.05);
    }
    for (let i = 0; i < 12; i++) {
      const t = i / 12 * Math.PI * 2, c = Math.cos(t), sn = Math.sin(t), u = (mw - 0.02) * c, edge = Math.abs(c) ** 3;
      let v = cyM - lift * edge + (sn < 0 ? sn * 0.006 : sn * gap * (1 - edge));
      add("lipI", u, v, 0.05);
    }
    return { pts, groups };
  }
  function project(face, f, cfg) {
    const yaw = f.quay * R, roll = f.nghieng * R, out = [];
    for (const p of face.pts) {
      const z = Math.sqrt(Math.max(0, 1 - (p.u / 0.5) ** 2 - (p.v / 0.7) ** 2)) * 0.42 + p.zb;
      const x1 = p.u * Math.cos(yaw) + z * Math.sin(yaw), y1 = p.v;
      const x2 = x1 * Math.cos(roll) - y1 * Math.sin(roll), y2 = x1 * Math.sin(roll) + y1 * Math.cos(roll);
      out.push({ x: cfg.cx + x2 * cfg.S, y: cfg.cy + y2 * cfg.S, z: z * Math.cos(yaw) - p.u * Math.sin(yaw) });
    }
    return out;
  }
  const mid = (a, b) => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  function anchorsOf(P, g) {
    const at = (name, i) => P[g[name][i]];
    return {
      forehead: at("oval", 0), chin: at("oval", 18),
      eyeLOut: at("eyeL", 4), eyeLIn: at("eyeL", 0), eyeROut: at("eyeR", 0), eyeRIn: at("eyeR", 4),
      eyeLTop: at("eyeL", 6), eyeLBot: at("eyeL", 2), eyeRTop: at("eyeR", 6), eyeRBot: at("eyeR", 2),
      eyeL: at("irisL", 0), eyeR: at("irisR", 0),
      browL: at("browL", 2), browR: at("browR", 2), nose: at("noseB", 3),
      mouthL: at("lipO", 8), mouthR: at("lipO", 0), lipTop: at("lipI", 9), lipBot: at("lipI", 3)
    };
  }
  function frame(f, noise) {
    const face = build(f), cfg = { cx: 320, cy: 250, S: 300 };
    let P = project(face, f, cfg);
    const img = { P, g: face.groups, f };
    // AI nhìn thấy: thêm nhiễu; khẩu trang → miệng là "đoán mò"
    let A = P.map((p) => ({ ...p, x: p.x + (Math.random() - 0.5) * 2 * noise, y: p.y + (Math.random() - 0.5) * 2 * noise }));
    if (f.khauTrang) {
      const neutral = project(build({ ...f, cuoi: 0, mieng: 0.05 }), f, cfg);
      for (const gname of ["lipO", "lipI"]) for (const i of face.groups[gname]) A[i] = { ...neutral[i], x: neutral[i].x + (Math.random() - 0.5) * 6, y: neutral[i].y + (Math.random() - 0.5) * 6 };
    }
    return { pts: A, groups: face.groups, anchors: anchorsOf(A, face.groups), img };
  }

  // ---- vẽ "ảnh" khuôn mặt ----
  function poly(ctx, P, idx, close) { ctx.beginPath(); idx.forEach((i, k) => (k ? ctx.lineTo(P[i].x, P[i].y) : ctx.moveTo(P[i].x, P[i].y))); if (close) ctx.closePath(); }
  function drawFace(ctx, img, dark) {
    const { P, g, f } = img, W = ctx.canvas.width, H = ctx.canvas.height;
    const bg = ctx.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, dark ? "#1b1e48" : "#e8e4f6"); bg.addColorStop(1, dark ? "#2a2e66" : "#d4cdee");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
    // cổ + vai
    const ch = P[g.oval[18]];
    ctx.fillStyle = "#e3ad85"; ctx.fillRect(ch.x - 55, ch.y - 30, 110, 110);
    ctx.fillStyle = "#5443ff"; ctx.beginPath(); ctx.ellipse(ch.x, H + 40, 230, 120, 0, Math.PI, 0); ctx.fill();
    // tóc sau
    const top = P[g.oval[0]];
    ctx.fillStyle = "#2a1e1a"; ctx.beginPath(); ctx.ellipse(top.x, top.y + 95, 158, 150, (f.nghieng || 0) * R, Math.PI, 0); ctx.fill();
    // mặt
    ctx.fillStyle = "#f1c29a"; poly(ctx, P, g.oval, true); ctx.fill();
    // tóc mái
    ctx.fillStyle = "#2a1e1a"; ctx.beginPath(); ctx.ellipse(top.x, top.y + 52, 148, 70, (f.nghieng || 0) * R, Math.PI, 0); ctx.fill();
    // lông mày
    ctx.strokeStyle = "#3a2a22"; ctx.lineWidth = 9; ctx.lineCap = "round";
    for (const b of ["browL", "browR"]) { poly(ctx, P, g[b]); ctx.stroke(); }
    // mắt
    for (const [e, ir] of [["eyeL", "irisL"], ["eyeR", "irisR"]]) {
      ctx.fillStyle = "#fff"; poly(ctx, P, g[e], true); ctx.fill();
      ctx.save(); poly(ctx, P, g[e], true); ctx.clip(); const c = P[g[ir][0]];
      ctx.fillStyle = "#4a3324"; ctx.beginPath(); ctx.arc(c.x, c.y, 13, 0, 7); ctx.fill(); ctx.fillStyle = "#111"; ctx.beginPath(); ctx.arc(c.x, c.y, 6, 0, 7); ctx.fill(); ctx.restore();
      ctx.strokeStyle = "#3a2a22"; ctx.lineWidth = 2.5; poly(ctx, P, g[e], true); ctx.stroke();
    }
    // mũi
    ctx.strokeStyle = "#d39672"; ctx.lineWidth = 3; poly(ctx, P, g.noseN); ctx.stroke();
    // miệng
    ctx.fillStyle = "#c9566a"; poly(ctx, P, g.lipO, true); ctx.fill();
    ctx.fillStyle = "#5a1d2c"; poly(ctx, P, g.lipI, true); ctx.fill();
    if (f.khauTrang) {
      const nL = P[g.oval[27]], nR = P[g.oval[9]], c2 = P[g.oval[18]], nb = P[g.noseB[2]];
      ctx.fillStyle = "#cfe6f2"; ctx.strokeStyle = "#9cc3d8"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(nL.x, nb.y); ctx.quadraticCurveTo((nL.x + nR.x) / 2, nb.y - 26, nR.x, nb.y); ctx.lineTo(P[g.oval[13]].x, P[g.oval[13]].y); ctx.quadraticCurveTo(c2.x, c2.y + 14, P[g.oval[23]].x, P[g.oval[23]].y); ctx.closePath(); ctx.fill(); ctx.stroke();
      ctx.strokeStyle = "#9cc3d8"; for (let i = 1; i <= 3; i++) { ctx.beginPath(); ctx.moveTo(nL.x + 20, nb.y + i * 24); ctx.lineTo(nR.x - 20, nb.y + i * 24); ctx.stroke(); }
    }
    if (f.sang < 1) { ctx.fillStyle = `rgba(5,6,18,${(1 - f.sang) * 0.92})`; ctx.fillRect(0, 0, W, H); }
  }
  const LINES = ["oval", "browL", "browR", "eyeL", "eyeR", "noseB", "noseN", "lipO", "lipI"];
  window.FaceSim = { frame, drawFace, LINES, poly };
})();
