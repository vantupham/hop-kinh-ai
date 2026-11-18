/* Hộp Kính AI · Bộ sinh chữ số "viết tay" + tiền xử lý về lưới 16×16 (giống cách làm của bộ dữ liệu MNIST) */
(function () {
  const arc = (cx, cy, rx, ry, a0, a1, n) => { const p = []; n = n || 18; for (let i = 0; i <= n; i++) { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; p.push([cx + rx * Math.cos(a), cy + ry * Math.sin(a)]); } return p; };
  const line = (x0, y0, x1, y1, n) => { const p = []; n = n || 6; for (let i = 0; i <= n; i++) p.push([x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n]); return p; };
  // mỗi chữ số: danh sách nét, mỗi nét là dãy điểm trong ô vuông 0..1 (y hướng xuống); một số chữ có 2 kiểu viết
  const T = {
    0: [() => [arc(0.5, 0.5, 0.27, 0.4, -90, 275, 26)]],
    1: [() => [line(0.36, 0.26, 0.54, 0.1, 3).concat(line(0.54, 0.1, 0.54, 0.9))], () => [line(0.5, 0.1, 0.5, 0.9)]],
    2: [() => [arc(0.5, 0.32, 0.25, 0.22, 200, 380, 12).concat(line(0.74, 0.38, 0.24, 0.88, 6), line(0.24, 0.88, 0.8, 0.88, 4))]],
    3: [() => [arc(0.48, 0.3, 0.24, 0.2, 200, 450, 14).concat(arc(0.48, 0.7, 0.27, 0.21, 270, 520, 14))]],
    4: [() => [line(0.62, 0.1, 0.18, 0.64, 6).concat(line(0.18, 0.64, 0.84, 0.64, 5)), line(0.64, 0.38, 0.64, 0.92, 5)], () => [line(0.25, 0.1, 0.22, 0.55, 4).concat(line(0.22, 0.55, 0.78, 0.55, 4)), line(0.7, 0.1, 0.7, 0.92, 6)]],
    5: [() => [line(0.76, 0.1, 0.32, 0.1, 4).concat(line(0.32, 0.1, 0.28, 0.46, 4), arc(0.47, 0.64, 0.28, 0.25, 230, 480, 16))]],
    6: [() => [line(0.68, 0.1, 0.38, 0.4, 5).concat(arc(0.5, 0.66, 0.26, 0.25, 205, 565, 22))]],
    7: [() => [line(0.2, 0.12, 0.82, 0.12, 5).concat(line(0.82, 0.12, 0.42, 0.92, 7))], () => [line(0.2, 0.12, 0.82, 0.12, 5).concat(line(0.82, 0.12, 0.42, 0.92, 7)), line(0.4, 0.5, 0.74, 0.5, 3)]],
    8: [() => [arc(0.5, 0.3, 0.21, 0.19, 90, 450, 18), arc(0.5, 0.7, 0.26, 0.21, -90, 270, 18)]],
    9: [() => [arc(0.5, 0.33, 0.25, 0.22, 0, 360, 20).concat(line(0.75, 0.33, 0.66, 0.92, 6))]]
  };
  function sample(d, rnd) {
    const r = rnd || Math.random, styles = T[d], strokes = styles[Math.floor(r() * styles.length)]();
    const rot = (r() - 0.5) * 0.4, sh = (r() - 0.5) * 0.35, sx = 0.8 + r() * 0.35, sy = 0.85 + r() * 0.25, j = 0.025;
    const wob = [r() * 6, r() * 6, 0.015 + r() * 0.02];
    return {
      d, width: 0.07 + r() * 0.06,
      strokes: strokes.map((s) => s.map(([x, y], i) => {
        x += Math.sin(i * 0.7 + wob[0]) * wob[2] + (r() - 0.5) * j; y += Math.cos(i * 0.6 + wob[1]) * wob[2] + (r() - 0.5) * j;
        let u = (x - 0.5) * sx + sh * (y - 0.5), v = (y - 0.5) * sy;
        return [0.5 + u * Math.cos(rot) - v * Math.sin(rot), 0.5 + u * Math.sin(rot) + v * Math.cos(rot)];
      }))
    };
  }
  function draw(ctx, S, s, progress) {
    ctx.fillStyle = "#000"; ctx.fillRect(0, 0, S, S);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = s.width * S; ctx.lineCap = "round"; ctx.lineJoin = "round";
    let total = 0; s.strokes.forEach((st) => (total += st.length)); let left = progress == null ? total : Math.floor(total * progress);
    for (const st of s.strokes) { if (left <= 0) break; ctx.beginPath(); st.slice(0, left).forEach(([x, y], i) => (i ? ctx.lineTo(x * S, y * S) : ctx.moveTo(x * S, y * S))); ctx.stroke(); left -= st.length; }
  }
  // tiền xử lý: cắt khung chữ → phóng vừa 12×12 → đặt giữa lưới 16×16 theo trọng tâm
  const c16 = document.createElement("canvas"); c16.width = c16.height = 16; const x16 = c16.getContext("2d", { willReadFrequently: true });
  function toVector(src, normalize) {
    const S = src.width, ctx = src.getContext("2d", { willReadFrequently: true }), img = ctx.getImageData(0, 0, S, S).data;
    x16.fillStyle = "#000"; x16.fillRect(0, 0, 16, 16);
    if (!normalize) { x16.drawImage(src, 0, 0, 16, 16); }
    else {
      let x0 = S, y0 = S, x1 = -1, y1 = -1;
      for (let y = 0; y < S; y++) for (let x = 0; x < S; x++) if (img[(y * S + x) * 4] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      if (x1 < 0) return new Array(256).fill(0);
      const w = x1 - x0 + 1, h = y1 - y0 + 1, sc = 12 / Math.max(w, h), dw = w * sc, dh = h * sc;
      x16.imageSmoothingEnabled = true; x16.drawImage(src, x0, y0, w, h, (16 - dw) / 2, (16 - dh) / 2, dw, dh);
    }
    let v = Array.from(x16.getImageData(0, 0, 16, 16).data.filter((_, i) => i % 4 === 0), (a) => a / 255);
    if (normalize) { // dời theo trọng tâm
      let m = 0, mx = 0, my = 0; v.forEach((a, i) => { m += a; mx += a * (i % 16); my += a * Math.floor(i / 16); });
      if (m > 0) { const dx = Math.round(7.5 - mx / m), dy = Math.round(7.5 - my / m), out = new Array(256).fill(0); v.forEach((a, i) => { const x = (i % 16) + dx, y = Math.floor(i / 16) + dy; if (x >= 0 && x < 16 && y >= 0 && y < 16) out[y * 16 + x] = a; }); v = out; }
    }
    return v;
  }
  window.DigitGen = { sample, draw, toVector };
})();
