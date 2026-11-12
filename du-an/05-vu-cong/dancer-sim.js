/* Hộp Kính AI · Vũ công mô phỏng nhìn chính diện (kiểu soi gương)
   Tư thế = góc khớp → 33 điểm theo chỉ số MediaPipe Pose (11/13/15 = vai/khuỷu/cổ tay bên TRÁI màn hình). */
(function () {
  const R = Math.PI / 180;
  // aL/aR: tay giơ ra (0 = buông, 90 = ngang, 180 = thẳng lên) · eL/eR: gập khuỷu
  // hL/hR: chân mở ra · kL/kR: gập gối · tilt: nghiêng thân · dip: hạ người
  const POSES = [
    { name: "Đứng nghiêm", aL: 10, eL: 5, aR: 10, eR: 5, hL: 4, kL: 0, hR: 4, kR: 0, tilt: 0, dip: 0 },
    { name: "Chữ V", aL: 145, eL: 0, aR: 145, eR: 0, hL: 8, kL: 0, hR: 8, kR: 0, tilt: 0, dip: 0 },
    { name: "Chữ T", aL: 90, eL: 0, aR: 90, eR: 0, hL: 16, kL: 0, hR: 16, kR: 0, tilt: 0, dip: 0 },
    { name: "Chống hông, vẫy tay", aL: 45, eL: 115, aR: 160, eR: 0, hL: 10, kL: 10, hR: 10, kR: 10, tilt: 0, dip: 0.02 },
    { name: "Vươn tay trái", aL: 170, eL: 0, aR: 80, eR: 20, hL: 6, kL: 0, hR: 22, kR: 0, tilt: 8, dip: 0 },
    { name: "Tấn ngựa", aL: 75, eL: 40, aR: 165, eR: 10, hL: 28, kL: 45, hR: 28, kR: 45, tilt: 0, dip: 0.12 },
    { name: "Vươn tay phải", aL: 80, eL: 20, aR: 170, eR: 0, hL: 22, kL: 0, hR: 6, kR: 0, tilt: -8, dip: 0 },
    { name: "Ngôi sao", aL: 130, eL: 0, aR: 130, eR: 0, hL: 26, kL: 0, hR: 26, kR: 0, tilt: 0, dip: 0 }
  ];
  const KEYS = ["aL", "eL", "aR", "eR", "hL", "kL", "hR", "kR", "tilt", "dip"];
  const lerp = (a, b, t) => { const o = {}; for (const k of KEYS) o[k] = a[k] + (b[k] - a[k]) * t; return o; };
  const BEAT = 0.6; // giây mỗi nhịp (100 BPM)
  function choreo(t) {
    const per = BEAT * 2, n = POSES.length, i = Math.floor(((t / per) % n + n) % n), f = ((t % per) + per) % per / per;
    const e = f < 0.55 ? 0 : (f - 0.55) / 0.45, s = e * e * (3 - 2 * e);
    return lerp(POSES[i], POSES[(i + 1) % n], s);
  }
  // hai đoạn xương từ gốc theo góc (độ, 0 = thẳng xuống, dương = ra ngoài)
  function limb(o, side, a, bend, L1, L2) {
    const s = side < 0 ? -1 : 1;
    const d1 = [s * Math.sin(a * R), Math.cos(a * R)];
    const a2 = a - bend;
    const d2 = [s * Math.sin(a2 * R), Math.cos(a2 * R)];
    const m = { x: o.x + d1[0] * L1, y: o.y + d1[1] * L1 }, e = { x: m.x + d2[0] * L2, y: m.y + d2[1] * L2 };
    return [m, e];
  }
  function leg(o, side, h, k) {
    const s = side < 0 ? -1 : 1, L = 0.44;
    const knee = { x: o.x + s * Math.sin(h * R) * L, y: o.y + Math.cos(h * R) * L * (1 - 0.18 * Math.sin(k * R)) };
    const ank = { x: knee.x + s * Math.sin((h - k * 0.55) * R) * L * 0.95, y: knee.y + Math.cos((h - k * 0.55) * R) * L * (1 - 0.12 * Math.sin(k * R)) };
    return [knee, ank];
  }
  // trả về mảng 33 điểm {x,y,v} theo đơn vị cơ thể, tâm hông ở (0,0)
  function skeleton(p) {
    const lm = new Array(33);
    const hip = { x: 0, y: p.dip }, tl = p.tilt * R;
    const sh = { x: hip.x + Math.sin(tl) * 0.52, y: hip.y - Math.cos(tl) * 0.52 };
    const px = Math.cos(tl), py = Math.sin(tl);
    const shL = { x: sh.x - px * 0.19, y: sh.y - py * 0.19 }, shR = { x: sh.x + px * 0.19, y: sh.y + py * 0.19 };
    const hpL = { x: hip.x - px * 0.11, y: hip.y - py * 0.11 }, hpR = { x: hip.x + px * 0.11, y: hip.y + py * 0.11 };
    const [elL, wrL] = limb(shL, -1, p.aL, p.eL, 0.3, 0.27), [elR, wrR] = limb(shR, 1, p.aR, p.eR, 0.3, 0.27);
    const [knL, anL] = leg(hpL, -1, p.hL, p.kL), [knR, anR] = leg(hpR, 1, p.hR, p.kR);
    const head = { x: sh.x + Math.sin(tl) * 0.24, y: sh.y - Math.cos(tl) * 0.24 };
    const set = (i, q) => (lm[i] = { x: q.x, y: q.y, v: 0.97 });
    set(0, head);
    for (let i = 1; i <= 10; i++) set(i, { x: head.x + [0, -0.03, -0.04, -0.05, 0.03, 0.04, 0.05, -0.08, 0.08, -0.025, 0.025][i], y: head.y + [0, -0.03, -0.03, -0.03, -0.03, -0.03, -0.03, -0.01, -0.01, 0.05, 0.05][i] });
    set(11, shL); set(12, shR); set(13, elL); set(14, elR); set(15, wrL); set(16, wrR);
    for (const [i, w, e] of [[17, wrL, elL], [19, wrL, elL], [21, wrL, elL], [18, wrR, elR], [20, wrR, elR], [22, wrR, elR]]) set(i, { x: w.x + (w.x - e.x) * 0.25, y: w.y + (w.y - e.y) * 0.25 });
    set(23, hpL); set(24, hpR); set(25, knL); set(26, knR); set(27, anL); set(28, anR);
    set(29, { x: anL.x + 0.01, y: anL.y + 0.04 }); set(30, { x: anR.x - 0.01, y: anR.y + 0.04 });
    set(31, { x: anL.x - 0.06, y: anL.y + 0.05 }); set(32, { x: anR.x + 0.06, y: anR.y + 0.05 });
    return lm;
  }
  function place(lm, cx, cy, S) { return lm.map((q) => ({ x: cx + q.x * S, y: cy + q.y * S, v: q.v })); }
  // nghịch đảo 2 khớp: kéo cổ tay/cổ chân tới điểm T → tính lại khuỷu/gối
  function ik(root, mid, end, T, L1, L2, bendSign) {
    let dx = T.x - root.x, dy = T.y - root.y, d = Math.hypot(dx, dy);
    const maxD = (L1 + L2) * 0.999, minD = Math.abs(L1 - L2) + 1;
    if (d > maxD) { dx *= maxD / d; dy *= maxD / d; d = maxD; } if (d < minD) { dx *= minD / d; dy *= minD / d; d = minD; }
    const a = Math.atan2(dy, dx), c = Math.acos(Math.max(-1, Math.min(1, (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d))));
    const ang = a + bendSign * c;
    return [{ x: root.x + Math.cos(ang) * L1, y: root.y + Math.sin(ang) * L1 }, { x: root.x + dx, y: root.y + dy }];
  }
  function drawBody(ctx, P, S, col, colD) {
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    const L = (a, b, w, c) => { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(P[a].x, P[a].y); ctx.lineTo(P[b].x, P[b].y); ctx.stroke(); };
    for (const [a, b] of [[23, 25], [25, 27], [24, 26], [26, 28]]) L(a, b, S * 0.12, colD);
    for (const [a, b] of [[27, 31], [28, 32]]) L(a, b, S * 0.07, "#f4f4f8");
    ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = S * 0.1;
    ctx.beginPath(); for (const i of [11, 12, 24, 23]) ctx.lineTo(P[i].x, P[i].y); ctx.closePath(); ctx.fill(); ctx.stroke();
    for (const [a, b] of [[11, 13], [12, 14]]) L(a, b, S * 0.085, col);
    for (const [a, b] of [[13, 15], [14, 16]]) L(a, b, S * 0.07, "#f1c29a");
    const sm = { x: (P[11].x + P[12].x) / 2, y: (P[11].y + P[12].y) / 2 };
    ctx.strokeStyle = "#e3ad85"; ctx.lineWidth = S * 0.06; ctx.beginPath(); ctx.moveTo(sm.x, sm.y); ctx.lineTo(P[0].x, P[0].y); ctx.stroke();
    ctx.fillStyle = "#f1c29a"; ctx.beginPath(); ctx.arc(P[0].x, P[0].y, S * 0.1, 0, 7); ctx.fill();
    ctx.fillStyle = "#2a1e1a"; ctx.beginPath(); ctx.arc(P[0].x, P[0].y - 3, S * 0.104, Math.PI * 1.02, Math.PI * 1.98); ctx.fill();
  }
  window.DancerSim = { POSES, BEAT, choreo, skeleton, place, ik, drawBody };
})();
