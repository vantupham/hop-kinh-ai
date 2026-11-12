/* Hộp Kính AI · Dự án 14 · Bộ tạo ảnh lá cây tổng hợp (khỏe / đốm lá / vàng lá) */
(function () {
  "use strict";
  const S = 96;
  const BG = {
    ban(c, r) { c.fillStyle = "#e9e4d8"; c.fillRect(0, 0, S, S); for (let i = 0; i < 120; i++) { c.fillStyle = r() < 0.5 ? "rgba(0,0,0,.04)" : "rgba(255,255,255,.25)"; c.fillRect(r() * S, r() * S, 2, 2); } },
    dat(c, r) { c.fillStyle = "#4a3426"; c.fillRect(0, 0, S, S); for (let i = 0; i < 260; i++) { c.fillStyle = ["#5d4331", "#3a281c", "#6b5040", "#2e2017"][Math.floor(r() * 4)]; c.fillRect(r() * S, r() * S, 1 + r() * 3, 1 + r() * 3); } },
    "be-tong"(c, r) { c.fillStyle = "#9a9a9e"; c.fillRect(0, 0, S, S); for (let i = 0; i < 200; i++) { c.fillStyle = r() < 0.5 ? "#88888c" : "#acacb0"; c.fillRect(r() * S, r() * S, 2, 2); } }
  };
  const BGS = Object.keys(BG);
  function leafPath(c, L) {
    c.beginPath(); c.moveTo(0, -L); c.bezierCurveTo(L * 0.62, -L * 0.55, L * 0.6, L * 0.5, 0, L); c.bezierCurveTo(-L * 0.6, L * 0.5, -L * 0.62, -L * 0.55, 0, -L); c.closePath();
  }
  function spot(c, x, y, rad) {
    const g = c.createRadialGradient(x, y, rad * 0.4, x, y, rad * 1.9); g.addColorStop(0, "rgba(214,190,60,.95)"); g.addColorStop(1, "rgba(214,190,60,0)"); c.fillStyle = g; c.beginPath(); c.arc(x, y, rad * 1.9, 0, 7); c.fill();
    c.fillStyle = "#6b3b1a"; c.beginPath(); c.arc(x, y, rad, 0, 7); c.fill(); c.fillStyle = "#4a2610"; c.beginPath(); c.arc(x - rad * 0.2, y - rad * 0.2, rad * 0.45, 0, 7); c.fill();
  }
  // cls: 0 khỏe, 1 đốm lá, 2 vàng lá
  function draw(c, o, r) {
    BG[o.bg](c, r);
    const L = S * 0.42 * o.size;
    c.save(); c.translate(S / 2 + o.dx, S / 2 + o.dy); c.rotate(o.rot);
    leafPath(c, L); c.save(); c.clip();
    c.fillStyle = `hsl(${o.hue},${o.sat}%,${o.lig}%)`; c.fillRect(-L, -L, 2 * L, 2 * L);
    if (o.cls === 2) {
      for (let i = 0; i < 7; i++) { const yy = -L * 0.8 + i * L * 0.27, side = i % 2 ? 1 : -1, g = c.createRadialGradient(side * L * 0.32, yy, 1, side * L * 0.32, yy, L * 0.42); g.addColorStop(0, `rgba(222,206,70,${0.4 + o.sev * 0.55})`); g.addColorStop(1, "rgba(222,206,70,0)"); c.fillStyle = g; c.fillRect(-L, -L, 2 * L, 2 * L); }
      const g = c.createRadialGradient(0, 0, L * 0.3, 0, 0, L); g.addColorStop(0, "rgba(220,200,60,0)"); g.addColorStop(1, `rgba(220,200,60,${0.2 + o.sev * 0.6})`); c.fillStyle = g; c.fillRect(-L, -L, 2 * L, 2 * L);
    }
    c.strokeStyle = `hsla(${o.hue + 10},40%,${o.lig + 18}%,.8)`; c.lineWidth = 1.6; c.beginPath(); c.moveTo(0, -L); c.lineTo(0, L); c.stroke(); c.lineWidth = 0.9;
    for (let i = 1; i < 6; i++) { const yy = -L + (i / 6) * 2 * L; c.beginPath(); c.moveTo(0, yy); c.lineTo(L * 0.5, yy - L * 0.22); c.moveTo(0, yy); c.lineTo(-L * 0.5, yy - L * 0.22); c.stroke(); }
    if (o.cls === 1) for (let i = 0; i < o.nSpots; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 0.5; spot(c, Math.cos(a) * L * d * 0.85, Math.sin(a) * L * d * 1.3, 1.2 + r() * 2.6); }
    if (o.cls === 0 && o.sev > 0.6) for (let i = 0; i < 3; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 0.45; c.fillStyle = "rgba(190,210,110,.55)"; c.beginPath(); c.arc(Math.cos(a) * L * d * 0.8, Math.sin(a) * L * d * 1.2, 2 + r() * 3, 0, 7); c.fill(); }
    c.restore();
    c.strokeStyle = "rgba(0,0,0,.25)"; c.lineWidth = 1; leafPath(c, L); c.stroke();
    c.strokeStyle = `hsl(${o.hue},35%,28%)`; c.lineWidth = 2.2; c.beginPath(); c.moveTo(0, L); c.lineTo(0, L + 8); c.stroke();
    c.restore();
    if (o.light !== 1) { c.fillStyle = o.light < 1 ? `rgba(0,0,0,${1 - o.light})` : `rgba(255,255,255,${o.light - 1})`; c.fillRect(0, 0, S, S); }
  }
  function sample(cls, r, opt) {
    opt = opt || {};
    return { cls, bg: opt.bg || BGS[Math.floor(r() * BGS.length)], size: 0.8 + r() * 0.25, rot: (r() - 0.5) * 1.3, dx: (r() - 0.5) * 10, dy: (r() - 0.5) * 8, hue: 100 + r() * 28, sat: 45 + r() * 20, lig: 30 + r() * 10, nSpots: 1 + Math.floor(r() * 10), sev: r(), light: opt.light || 0.92 + r() * 0.16, seed: Math.floor(r() * 1e6) };
  }
  window.LeafGen = { S, BGS, sample, draw, spot, render(c, o) { draw(c, o, HKA.P.rng(o.seed)); } };
})();
