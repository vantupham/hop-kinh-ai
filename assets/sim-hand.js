/* Hộp Kính AI · Bàn tay mô phỏng: 21 điểm theo đúng chỉ số MediaPipe Hand
   0 cổ tay · 1–4 ngón cái · 5–8 trỏ · 9–12 giữa · 13–16 áp út · 17–20 út
   curl[i] ∈ [0,1]: 0 = duỗi thẳng, 1 = co hết (thứ tự: cái, trỏ, giữa, áp út, út) */
(function () {
  const R = Math.PI / 180;
  const BASE = [null, [-0.33, -1.0], [-0.1, -1.06], [0.13, -1.0], [0.34, -0.88]]; // gốc ngón (MCP) so với cổ tay
  const DIR = [null, -100, -92, -84, -76];                                            // hướng ngón khi duỗi (độ)
  const LEN = [[0.42, 0.33, 0.28], [0.46, 0.28, 0.22], [0.5, 0.32, 0.24], [0.46, 0.29, 0.22], [0.36, 0.22, 0.19]];
  const BEND = [70, 100, 75];
  const GESTURES = {
    bua: [0.85, 1, 1, 1, 1], keo: [0.85, 0, 0, 1, 1], bao: [0, 0, 0, 0, 0],
    chi: [0.85, 0, 1, 1, 1], like: [0, 1, 1, 1, 1], ok: [0.55, 0.62, 0, 0, 0]
  };

  // trả về mảng 21 điểm {x, y, z, v}
  function frame(curl, cx, cy, size, rot, noise) {
    const pts = new Array(21), c = Math.cos(rot * R), s = Math.sin(rot * R);
    const put = (i, x, y, z) => { pts[i] = { x: cx + (x * c - y * s) * size, y: cy + (x * s + y * c) * size, z, v: 0.97 }; };
    put(0, 0, 0, 0);
    // ngón cái: xoay từ ngoài vào lòng bàn tay khi co
    {
      const k = curl[0], a0 = (-150 + 95 * k) * R, cmc = [-0.36, -0.32];
      put(1, cmc[0], cmc[1], 0);
      let x = cmc[0], y = cmc[1], cum = 0;
      for (let j = 0; j < 3; j++) {
        cum += k * [10, 30, 40][j] * R;
        const L = LEN[0][j] * (1 - 0.25 * k * (j > 0));
        x += Math.cos(a0 + cum) * L; y += Math.sin(a0 + cum) * L;
        put(2 + j, x, y, k * 0.2 * (j + 1));
      }
    }
    for (let f = 1; f <= 4; f++) {
      const k = curl[f], b = BASE[f], d = DIR[f] * R, ax = Math.cos(d), ay = Math.sin(d);
      put(f * 4 + 1, b[0], b[1], 0);
      let along = 0, depth = 0, cum = 0;
      for (let j = 0; j < 3; j++) {
        cum += k * BEND[j] * R;
        along += LEN[f][j] * Math.cos(cum); depth += LEN[f][j] * Math.sin(cum);
        // nhìn hơi nghiêng: phần gập về phía camera hiện xuống dưới một chút
        put(f * 4 + 2 + j, b[0] + ax * along, b[1] + ay * along + depth * 0.28, depth);
      }
    }
    if (noise) for (const p of pts) { p.x += (Math.random() - 0.5) * 2 * noise; p.y += (Math.random() - 0.5) * 2 * noise; }
    return pts;
  }

  const SKIN = "#f1c29a", SKIN_D = "#d9a47a";
  function drawHand(ctx, p, size) {
    ctx.lineCap = "round"; ctx.lineJoin = "round";
    // lòng bàn tay
    ctx.fillStyle = SKIN; ctx.strokeStyle = SKIN; ctx.lineWidth = size * 0.22;
    ctx.beginPath(); for (const i of [0, 1, 5, 9, 13, 17]) { i ? ctx.lineTo(p[i].x, p[i].y) : ctx.moveTo(p[i].x, p[i].y); } ctx.closePath(); ctx.fill(); ctx.stroke();
    // cổ tay
    ctx.lineWidth = size * 0.55; ctx.beginPath(); ctx.moveTo(p[0].x, p[0].y); ctx.lineTo(p[0].x + (p[0].x - p[9].x) * 0.45, p[0].y + (p[0].y - p[9].y) * 0.45); ctx.stroke();
    // ngón: ngón co (z lớn) vẽ sau để đè lên lòng bàn tay
    const fingers = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16], [17, 18, 19, 20]];
    fingers.map((f) => ({ f, z: p[f[3]].z || 0 })).sort((a, b) => a.z - b.z).forEach(({ f }, k) => {
      const w = size * (f[0] === 17 ? 0.15 : f[0] === 1 ? 0.19 : 0.17);
      ctx.strokeStyle = SKIN_D; ctx.lineWidth = w + 2.5; ctx.beginPath(); ctx.moveTo(p[f[0]].x, p[f[0]].y); for (const i of f.slice(1)) ctx.lineTo(p[i].x, p[i].y); ctx.stroke();
      ctx.strokeStyle = SKIN; ctx.lineWidth = w; ctx.stroke();
    });
  }
  const CONN = [[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15], [15, 16], [13, 17], [0, 17], [17, 18], [18, 19], [19, 20]];
  function drawSkeleton(ctx, p, o) {
    o = o || {};
    ctx.lineCap = "round";
    for (const [a, b] of CONN) { ctx.strokeStyle = o.dim ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.85)"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(p[a].x, p[a].y); ctx.lineTo(p[b].x, p[b].y); ctx.stroke(); }
    p.forEach((q, i) => {
      const tip = [4, 8, 12, 16, 20].includes(i);
      ctx.fillStyle = o.color ? o.color(i) : tip ? "#ff7d5f" : "#5ef2d6";
      ctx.beginPath(); ctx.arc(q.x, q.y, tip ? 6 : 4.5, 0, 7); ctx.fill();
      if (o.idx) { ctx.font = "600 11px JetBrains Mono, monospace"; ctx.strokeStyle = "rgba(0,0,0,.6)"; ctx.lineWidth = 3; ctx.strokeText(i, q.x + 7, q.y - 6); ctx.fillStyle = "#fff"; ctx.fillText(i, q.x + 7, q.y - 6); }
    });
  }
  // 5 đặc trưng: độ duỗi của từng ngón (0 = co, 1 = duỗi), chia cho cỡ bàn tay để không phụ thuộc xa/gần
  function features(p) {
    const d = (a, b) => Math.hypot(p[a].x - p[b].x, p[a].y - p[b].y);
    const palm = d(0, 9) || 1;
    const raw = [d(4, 17) / palm, d(8, 0) / palm, d(12, 0) / palm, d(16, 0) / palm, d(20, 0) / palm];
    const lo = [0.05, 0.5, 0.48, 0.47, 0.5], hi = [1.75, 2.15, 2.25, 2.1, 1.8];
    return raw.map((r, i) => Math.max(0, Math.min(1, (r - lo[i]) / (hi[i] - lo[i]))));
  }
  window.HandSim = { frame, drawHand, drawSkeleton, features, GESTURES, CONN, FINGERS: ["Ngón cái", "Ngón trỏ", "Ngón giữa", "Ngón áp út", "Ngón út"] };
})();
