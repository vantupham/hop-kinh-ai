/* Hộp Kính AI · Bộ sinh "ảnh chụp rác" + bộ trích xuất đặc trưng
   Lớp: 0 Nhựa · 1 Giấy · 2 Kim loại · 3 Hữu cơ · 4 Pin (rác nguy hại, KHÔNG có trong dữ liệu học) */
(function () {
  const BG = [
    { name: "bàn gỗ", c: "#b07a4a", grain: "#9a6638" }, { name: "sàn xám", c: "#8d8f96", grain: "#7d7f86" },
    { name: "nền trắng", c: "#ecebe6", grain: "#dedcd5" }, { name: "gạch xanh", c: "#4f8a8b", grain: "#437778" }, { name: "nền tối", c: "#34343e", grain: "#2a2a33" }
  ];
  const BIAS_BG = [3, 2, 4, 0]; // khi "học vẹt phông nền": mỗi loại luôn chụp trên một nền
  function sample(cls, rnd, opt) {
    opt = opt || {};
    const pick = (a) => a[Math.floor(rnd() * a.length)];
    return {
      cls, kind: Math.floor(rnd() * 3), rot: (rnd() - 0.5) * 1.6, sc: 0.75 + rnd() * 0.35, dx: (rnd() - 0.5) * 0.18, dy: (rnd() - 0.5) * 0.18,
      light: 0.8 + rnd() * 0.35, bg: opt.bias ? BIAS_BG[cls] != null ? BIAS_BG[cls] : Math.floor(rnd() * 5) : Math.floor(rnd() * 5),
      hue: rnd(), band: pick(["#d8343a", "#2f7bd6", "#2fa35a", "#f2b632", "#8a3fd1"]), seed: rnd() * 1000
    };
  }
  function draw(ctx, S, it) {
    const bg = BG[it.bg];
    ctx.save(); ctx.fillStyle = bg.c; ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = bg.grain; ctx.lineWidth = S / 64;
    for (let i = 0; i < 6; i++) { const y = ((i * 0.19 + it.seed % 0.17) % 1) * S; ctx.beginPath(); ctx.moveTo(0, y); ctx.bezierCurveTo(S * 0.3, y + S * 0.03, S * 0.6, y - S * 0.03, S, y + S * 0.01); ctx.stroke(); }
    // bóng đổ
    ctx.translate(S * (0.5 + it.dx), S * (0.5 + it.dy)); ctx.rotate(it.rot); ctx.scale(it.sc * S / 64, it.sc * S / 64);
    ctx.fillStyle = "rgba(0,0,0,.22)"; ctx.beginPath(); ctx.ellipse(3, 4, 20, 12, 0, 0, 7); ctx.fill();
    const c = it.cls, k = it.kind;
    if (c === 0) { // nhựa: chai / hộp / túi trong suốt
      if (k < 2) {
        const g = ctx.createLinearGradient(-9, 0, 9, 0); g.addColorStop(0, "rgba(190,225,240,.85)"); g.addColorStop(0.45, "rgba(240,250,255,.95)"); g.addColorStop(1, "rgba(160,205,225,.85)");
        ctx.fillStyle = g; rr(ctx, -9, -20, 18, 38, 6); ctx.fill(); ctx.strokeStyle = "rgba(120,170,200,.9)"; ctx.lineWidth = 1; ctx.stroke();
        ctx.fillStyle = "rgba(200,232,245,.95)"; rr(ctx, -5, -26, 10, 8, 3); ctx.fill();
        ctx.fillStyle = k ? "#2f7bd6" : "#f2f2f2"; rr(ctx, -4, -30, 8, 5, 1.5); ctx.fill();
        ctx.fillStyle = it.band; ctx.fillRect(-9, -4, 18, 9);
        ctx.strokeStyle = "rgba(255,255,255,.9)"; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(-5, -16); ctx.lineTo(-5, 12); ctx.stroke();
      } else { ctx.fillStyle = "rgba(215,235,245,.9)"; rr(ctx, -16, -11, 32, 22, 4); ctx.fill(); ctx.strokeStyle = "rgba(130,175,205,.9)"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.strokeStyle = "rgba(255,255,255,.95)"; ctx.beginPath(); ctx.moveTo(-12, -7); ctx.lineTo(10, -7); ctx.stroke(); }
    } else if (c === 1) { // giấy: giấy vo / hộp carton / giấy báo
      if (k === 1) { ctx.fillStyle = "#b98a55"; rr(ctx, -16, -12, 32, 24, 2); ctx.fill(); ctx.fillStyle = "#a57744"; ctx.fillRect(-16, -12, 32, 6); ctx.fillStyle = "#d9c49a"; ctx.fillRect(-3, -12, 6, 24); ctx.strokeStyle = "#8a6236"; ctx.lineWidth = 1; ctx.strokeRect(-16, -12, 32, 24); }
      else {
        ctx.fillStyle = k ? "#e9e4d6" : "#f6f3ea"; ctx.beginPath(); const n = 11;
        for (let i = 0; i < n; i++) { const a = i / n * 6.283, r = 15 + 4 * Math.sin(it.seed + i * 2.7); ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r * 0.9); }
        ctx.closePath(); ctx.fill(); ctx.strokeStyle = "#c9c2b0"; ctx.lineWidth = 1; ctx.stroke();
        ctx.strokeStyle = k ? "#7d7a72" : "#cfc8b6"; ctx.lineWidth = 0.9;
        for (let i = 0; i < 6; i++) { const a = it.seed + i * 1.3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 3, Math.sin(a) * 3); ctx.lineTo(Math.cos(a + 0.6) * 13, Math.sin(a + 0.6) * 12); ctx.stroke(); }
        if (k) { ctx.fillStyle = "#6f6c66"; for (let i = 0; i < 4; i++) ctx.fillRect(-9, -8 + i * 4, 18, 1.4); }
      }
    } else if (c === 2) { // kim loại: lon nhôm / hộp sắt
      const g = ctx.createLinearGradient(-10, 0, 10, 0);
      g.addColorStop(0, "#7d828a"); g.addColorStop(0.3, "#f4f6f8"); g.addColorStop(0.5, "#b8bdc4"); g.addColorStop(0.8, "#eef0f2"); g.addColorStop(1, "#6d727a");
      if (k < 2) {
        ctx.fillStyle = g; rr(ctx, -10, -17, 20, 34, 3); ctx.fill();
        ctx.fillStyle = it.band; ctx.fillRect(-10, -9, 20, 15);
        ctx.fillStyle = "rgba(255,255,255,.75)"; ctx.fillRect(-5, -9, 2.2, 15);
        ctx.fillStyle = "#c9cdd2"; ctx.beginPath(); ctx.ellipse(0, -17, 10, 3, 0, 0, 7); ctx.fill(); ctx.strokeStyle = "#8a8f96"; ctx.lineWidth = 1; ctx.stroke();
        if (k === 1) { ctx.strokeStyle = "rgba(60,60,70,.7)"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-10, 4); ctx.lineTo(10, -2); ctx.stroke(); }
      } else { ctx.fillStyle = g; rr(ctx, -15, -10, 30, 20, 2); ctx.fill(); ctx.strokeStyle = "#868b92"; ctx.lineWidth = 1.2; ctx.stroke(); ctx.fillStyle = it.band; ctx.fillRect(-15, -3, 30, 6); }
    } else if (c === 3) { // hữu cơ: vỏ chuối / lá rau / lõi táo
      if (k === 0) {
        ctx.fillStyle = "#f2d13a"; ctx.beginPath(); ctx.moveTo(-18, -4); ctx.quadraticCurveTo(0, 18, 18, -6); ctx.quadraticCurveTo(0, 8, -18, -4); ctx.fill();
        ctx.strokeStyle = "#c9a321"; ctx.lineWidth = 1; ctx.stroke(); ctx.fillStyle = "#5a3d1e"; ctx.beginPath(); ctx.arc(-18, -4, 2.2, 0, 7); ctx.arc(18, -6, 2, 0, 7); ctx.fill();
        ctx.fillStyle = "rgba(110,80,30,.5)"; for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(-8 + i * 5, 4 - Math.abs(i - 1.5), 1.2, 0, 7); ctx.fill(); }
      } else if (k === 1) {
        ctx.fillStyle = it.hue > 0.5 ? "#4fa34a" : "#7cbf3d"; ctx.beginPath(); ctx.ellipse(0, 0, 18, 10, 0.2, 0, 7); ctx.fill();
        ctx.strokeStyle = "#2f6e2c"; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(-18, -3); ctx.lineTo(18, 4); ctx.stroke();
        for (let i = -2; i <= 2; i++) { ctx.beginPath(); ctx.moveTo(i * 6, i * 1.2); ctx.lineTo(i * 6 + 4, i * 1.2 - 7); ctx.moveTo(i * 6, i * 1.2); ctx.lineTo(i * 6 + 4, i * 1.2 + 7); ctx.stroke(); }
      } else {
        ctx.fillStyle = "#efe2b5"; rr(ctx, -6, -12, 12, 24, 5); ctx.fill();
        ctx.fillStyle = it.hue > 0.5 ? "#c8312e" : "#8cc63e"; ctx.beginPath(); ctx.ellipse(0, -13, 11, 5, 0, 0, 7); ctx.ellipse(0, 13, 11, 5, 0, 0, 7); ctx.fill();
        ctx.fillStyle = "#5a3d1e"; ctx.fillRect(-1, -22, 2, 6); ctx.beginPath(); ctx.arc(-2, 0, 1.2, 0, 7); ctx.arc(2, 3, 1.2, 0, 7); ctx.fill();
      }
    } else { // pin
      ctx.fillStyle = "#1d1d22"; rr(ctx, -7, -16, 14, 32, 3); ctx.fill();
      ctx.fillStyle = it.hue > 0.5 ? "#e8b51e" : "#3fae49"; ctx.fillRect(-7, -16, 14, 13);
      ctx.fillStyle = "#c8ccd2"; rr(ctx, -3, -20, 6, 5, 1); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.font = "bold 7px sans-serif"; ctx.textAlign = "center"; ctx.fillText("+", 0, -7); ctx.fillText("AA", 0, 8);
    }
    ctx.restore();
    if (it.light !== 1) { ctx.fillStyle = it.light < 1 ? `rgba(0,0,0,${(1 - it.light) * 0.9})` : `rgba(255,255,255,${(it.light - 1) * 0.6})`; ctx.fillRect(0, 0, S, S); }
  }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // ---- bộ trích xuất đặc trưng (đóng vai phần "đã học sẵn" của mạng) ----
  const NAMES = ["sắc đỏ", "sắc cam", "sắc vàng", "sắc lục", "sắc ngọc", "sắc lam", "sắc tím", "sắc hồng", "độ đậm màu", "độ sáng", "độ tương phản", "điểm lóa sáng", "vùng tối", "độ sắc cạnh", "mật độ cạnh", "cạnh ngang", "cạnh chéo /", "cạnh dọc", "cạnh chéo \\", "diện tích vật", "độ dài/rộng", "độ đặc", "vật: đỏ", "vật: lục", "vật: lam", "vật: đậm màu", "vật: sáng", "vật: lóa kim loại"];
  const GROUPS = [[0, 8, "Màu sắc"], [8, 13, "Độ sáng"], [13, 19, "Cạnh & vân"], [19, 22, "Hình dạng"], [22, 28, "Màu của vật"]];
  function hsv(r, g, b) { const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h /= 6; if (h < 0) h += 1; } return [h, mx ? d / mx : 0, mx]; }
  function features(img) { // img: ImageData 32×32
    const N = 32, px = img.data, H = [], Sv = [], V = [];
    for (let i = 0; i < N * N; i++) { const [h, s, v] = hsv(px[i * 4] / 255, px[i * 4 + 1] / 255, px[i * 4 + 2] / 255); H.push(h); Sv.push(s); V.push(v); }
    const f = new Array(22).fill(0);
    for (let i = 0; i < N * N; i++) if (Sv[i] > 0.2 && V[i] > 0.15) f[Math.floor(H[i] * 8) % 8] += 1 / (N * N) * 4;
    const mean = (a) => a.reduce((x, y) => x + y, 0) / a.length;
    f[8] = mean(Sv); f[9] = mean(V); const mv = f[9]; f[10] = Math.sqrt(mean(V.map((v) => (v - mv) ** 2))) * 3;
    f[11] = V.filter((v, i) => v > 0.9 && Sv[i] < 0.15).length / (N * N) * 4; f[12] = V.filter((v) => v < 0.22).length / (N * N) * 2;
    let ed = 0, ms = 0; const ori = [0, 0, 0, 0];
    for (let y = 1; y < N - 1; y++) for (let x = 1; x < N - 1; x++) {
      const v = (dx, dy) => V[(y + dy) * N + x + dx];
      const gx = v(1, -1) + 2 * v(1, 0) + v(1, 1) - v(-1, -1) - 2 * v(-1, 0) - v(-1, 1), gy = v(-1, 1) + 2 * v(0, 1) + v(1, 1) - v(-1, -1) - 2 * v(0, -1) - v(1, -1);
      const m = Math.hypot(gx, gy); ms += m; if (m > 0.5) { ed++; const a = ((Math.atan2(gy, gx) + Math.PI) % Math.PI) / Math.PI; ori[Math.floor(a * 4) % 4]++; }
    }
    f[13] = ms / ((N - 2) ** 2); f[14] = ed / ((N - 2) ** 2) * 3; for (let k = 0; k < 4; k++) f[15 + k] = ed ? ori[k] / ed : 0;
    // tách vật khỏi nền: so với màu trung bình ở viền ảnh
    let br = 0, bg = 0, bb = 0, nb = 0;
    for (let i = 0; i < N; i++) for (const j of [i, (N - 1) * N + i, i * N, i * N + N - 1]) { br += px[j * 4]; bg += px[j * 4 + 1]; bb += px[j * 4 + 2]; nb++; }
    br /= nb; bg /= nb; bb /= nb;
    let n = 0, sx = 0, sy = 0, sxx = 0, syy = 0, sxy = 0, x0 = N, x1 = 0, y0 = N, y1 = 0; const mask = new Uint8Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) { const i = y * N + x, d = Math.hypot(px[i * 4] - br, px[i * 4 + 1] - bg, px[i * 4 + 2] - bb); if (d > 45) { mask[i] = 1; n++; sx += x; sy += y; sxx += x * x; syy += y * y; sxy += x * y; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); } }
    f[19] = n / (N * N) * 3;
    // màu của riêng vật (không tính nền)
    let orr = 0, og = 0, ob = 0, os = 0, ov = 0, osp = 0;
    for (let i = 0; i < N * N; i++) if (mask[i]) { orr += px[i * 4]; og += px[i * 4 + 1]; ob += px[i * 4 + 2]; os += Sv[i]; ov += V[i]; if (V[i] > 0.85 && Sv[i] < 0.15) osp++; }
    const on = Math.max(1, n); f.push(orr / on / 255, og / on / 255, ob / on / 255, os / on, ov / on, osp / on * 3);
    if (n > 4) { const mx = sx / n, my = sy / n, cxx = sxx / n - mx * mx, cyy = syy / n - my * my, cxy = sxy / n - mx * my, tr = cxx + cyy, det = cxx * cyy - cxy * cxy, l1 = tr / 2 + Math.sqrt(Math.max(0, tr * tr / 4 - det)), l2 = tr / 2 - Math.sqrt(Math.max(0, tr * tr / 4 - det)); f[20] = Math.min(4, Math.sqrt(l1 / Math.max(0.5, l2))) / 2; f[21] = n / ((x1 - x0 + 1) * (y1 - y0 + 1)); }
    return { f, mask };
  }
  function pixels(img12) { const out = []; for (let i = 0; i < 144; i++) out.push(img12.data[i * 4] / 255, img12.data[i * 4 + 1] / 255, img12.data[i * 4 + 2] / 255); return out; }
  window.TrashSim = { sample, draw, features, pixels, NAMES, GROUPS, BG, CLS: ["Nhựa", "Giấy", "Kim loại", "Hữu cơ", "Pin"], COL: ["#4fb3e8", "#d9c49a", "#b8bdc4", "#7cbf3d", "#ff7d5f"] };
})();
