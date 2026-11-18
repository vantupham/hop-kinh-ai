/* Hộp Kính AI · Dự án 18 · Dữ liệu hồ sơ học bổng (hư cấu) và mô hình chấm điểm học từ dữ liệu */
(function (root) {
  "use strict";
  const rng = (s) => () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  function people(n, seed) {
    const r = rng(seed), g = () => { const u = r() || 1e-9, v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.2832 * v); };
    return Array.from({ length: n }, (_, i) => {
      const tay = r() < 0.4, score = Math.max(5, Math.min(10, 7.6 + 0.9 * g())), act = Math.round(r() * 40), dist = tay ? 6 + r() * 9 : 0.5 + r() * 3.5;
      const merit = (score - 7.5) + ((act - 20) / 20) * 0.8, noise = 0.35 * g();
      return { id: i + 1, tay, score: Math.round(score * 10) / 10, act, dist: Math.round(dist * 10) / 10, merit, old: merit + noise > (tay ? 1.0 : 0.3), fair: merit + noise > 0.55 };
    });
  }
  const HIST = people(240, 2024), NOW = people(80, 2026);
  const FEATS = [["score", "Điểm trung bình"], ["act", "Giờ hoạt động"], ["tay", "Ở Xã Tây"], ["dist", "Khoảng cách đến trường"]];
  const stat = (k) => { const v = HIST.map((p) => +p[k]), m = v.reduce((a, b) => a + b, 0) / v.length, s = Math.sqrt(v.reduce((a, b) => a + (b - m) ** 2, 0) / v.length) || 1; return [m, s]; };
  const ST = Object.fromEntries(FEATS.map(([k]) => [k, stat(k)]));
  const vec = (p) => FEATS.map(([k]) => (+p[k] - ST[k][0]) / ST[k][1]);
  // hồi quy logistic, chỉ dùng các đặc trưng được bật
  function train(use, labelKey) {
    const w = [0, 0, 0, 0]; let b = 0; const X = HIST.map(vec), Y = HIST.map((p) => (p[labelKey] ? 1 : 0));
    for (let it = 0; it < 400; it++) {
      const gw = [0, 0, 0, 0]; let gb = 0;
      X.forEach((x, i) => { const z = b + x.reduce((s, v, j) => s + (use[j] ? v * w[j] : 0), 0), e = 1 / (1 + Math.exp(-z)) - Y[i]; x.forEach((v, j) => (gw[j] += e * v)); gb += e; });
      w.forEach((_, j) => (w[j] = use[j] ? w[j] - 0.5 * (gw[j] / X.length + 0.03 * w[j]) : 0)); b -= (0.5 * gb) / X.length;
    }
    return { w, b };
  }
  const zOf = (m, p) => m.b + vec(p).reduce((s, v, j) => s + v * m.w[j], 0);
  const flipZone = (p) => ({ ...p, tay: !p.tay, dist: p.tay ? 2.2 : 10.5 });
  function evaluate(m, K, labelKey) {
    const z = NOW.map((p) => zOf(m, p)), ord = z.map((v, i) => i).sort((a, b) => z[b] - z[a]), cut = z[ord[K - 1]];
    const pick = NOW.map((_, i) => z[i] >= cut);
    const cf = (p, i) => { const zf = zOf(m, flipZone(p)); return Math.abs(zf - z[i]) <= 0.05 ? pick[i] : zf >= cut; };
    const flips = NOW.filter((p, i) => cf(p, i) !== pick[i]).length;
    const fairOrd = NOW.map((p, i) => i).sort((a, b) => NOW[b].merit - NOW[a].merit), fairPick = new Set(fairOrd.slice(0, K));
    const grp = (t) => { const idx = NOW.map((p, i) => i).filter((i) => NOW[i].tay === t); return { n: idx.length, sel: idx.filter((i) => pick[i]).length, fair: idx.filter((i) => fairPick.has(i)).length }; };
    const agree = HIST.filter((p) => (zOf(m, p) > 0) === p[labelKey]).length / HIST.length;
    const agreeFair = HIST.filter((p) => (zOf(m, p) > 0) === p.fair).length / HIST.length;
    return { z, cut, pick, flips, cf, dong: grp(false), tay: grp(true), agree, agreeFair, fairPick };
  }
  root.HB38 = { HIST, NOW, FEATS, train, evaluate, zOf, flipZone, vec, ST };
})(typeof window !== "undefined" ? window : globalThis);
