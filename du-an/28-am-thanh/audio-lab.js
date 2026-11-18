/* Hộp Kính AI · Phòng thí nghiệm âm thanh: tổng hợp âm, FFT, dải tần, đặc trưng ảnh phổ */
(function () {
  const SR = 16000, N = 512, HOP = 256, NB = 64;
  const CLS = ["Vỗ tay", "Huýt sáo", "Nốt đàn", "Tiếng trống", "Chó sủa"];
  const COL = ["#ffc34d", "#3ee9cf", "#9184ff", "#ff7d5f", "#c3c7f0"];
  // ---- tổng hợp âm thanh (mảng mẫu ở 16 kHz) ----
  function synth(cls, rnd) {
    const len = Math.floor(SR * 0.62), out = new Float32Array(len), r = rnd || Math.random, A = 0.5 + r() * 0.3;
    if (cls === 0) { const n = 2 + Math.floor(r() * 2); for (let k = 0; k < n; k++) { const st = Math.floor((0.02 + k * (0.14 + r() * 0.06)) * SR); for (let i = 0; i < 0.06 * SR && st + i < len; i++) { const e = Math.exp(-i / (SR * 0.008)); out[st + i] += A * e * (r() * 2 - 1) * (i % 2 ? 1 : -0.6); } } }
    if (cls === 1) { const f0 = 1200 + r() * 900, sl = (r() - 0.5) * 900, vib = 4 + r() * 4; let ph = 0; for (let i = 0; i < len; i++) { const t = i / SR, env = Math.min(1, t / 0.05) * Math.min(1, (0.55 - t) / 0.08); if (env <= 0) continue; const f = f0 + sl * t / 0.55 + 40 * Math.sin(2 * Math.PI * vib * t); ph += 2 * Math.PI * f / SR; out[i] += A * 0.6 * env * Math.sin(ph) + 0.02 * (r() * 2 - 1) * env; } }
    if (cls === 2) { const f0 = [196, 220, 262, 294, 330, 392, 440, 523][Math.floor(r() * 8)]; for (let i = 0; i < len; i++) { const t = i / SR, env = Math.min(1, t / 0.005) * Math.exp(-t / 0.22); let v = 0; for (let h = 1; h <= 7; h++) v += Math.sin(2 * Math.PI * f0 * h * t) / (h * 1.3) * Math.exp(-t * h * 0.8); out[i] += A * 0.5 * env * v; } }
    if (cls === 3) { const f0 = 70 + r() * 50; let ph = 0; for (let i = 0; i < len; i++) { const t = i / SR, f = f0 * (1 + 1.5 * Math.exp(-t / 0.03)); ph += 2 * Math.PI * f / SR; out[i] += A * 1.1 * Math.exp(-t / 0.12) * Math.sin(ph) + (t < 0.015 ? A * 0.5 * (r() * 2 - 1) * (1 - t / 0.015) : 0); } }
    if (cls === 4) { for (const st of [0.02, 0.3]) { const f0 = 350 + r() * 150; for (let i = 0; i < 0.16 * SR; i++) { const t = i / SR, env = Math.sin(Math.PI * t / 0.16) ** 0.6, f = f0 * (1 + 0.4 * Math.sin(Math.PI * t / 0.16)); let v = 0; for (let h = 1; h <= 9; h++) v += Math.sin(2 * Math.PI * f * h * t + h) * (h > 2 && h < 6 ? 0.8 : 0.35) / h * 2; const j = Math.floor(st * SR) + i; if (j < len) out[j] += A * 0.35 * env * (v + 0.6 * (r() * 2 - 1)); } } }
    return out;
  }
  // nhiễu nền kiểu tiếng quạt (nhiễu hồng đơn giản)
  function noiseGen() { let b0 = 0, b1 = 0, b2 = 0; return () => { const w = Math.random() * 2 - 1; b0 = 0.997 * b0 + w * 0.029; b1 = 0.985 * b1 + w * 0.032; b2 = 0.95 * b2 + w * 0.048; return (b0 + b1 + b2 + w * 0.04) * 0.6; }; }
  // ---- FFT radix-2 ----
  const win = new Float64Array(N); for (let i = 0; i < N; i++) win[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N - 1));
  function fft(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) { let bit = n >> 1; for (; j & bit; bit >>= 1) j ^= bit; j ^= bit; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
    for (let len = 2; len <= n; len <<= 1) { const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a); for (let i = 0; i < n; i += len) { let cr = 1, ci = 0; for (let k = 0; k < len / 2; k++) { const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr; re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi; const t = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = t; } } }
  }
  // biên dải tần theo thang log từ 60 Hz tới 7.8 kHz
  const EDGES = []; for (let b = 0; b <= NB; b++) EDGES.push(60 * Math.pow(7800 / 60, b / NB));
  function bandsFromPower(pow, binHz) { const out = new Float32Array(NB); for (let b = 0; b < NB; b++) { let s = 0, n = 0; const k0 = Math.floor(EDGES[b] / binHz), k1 = Math.max(k0, Math.floor(EDGES[b + 1] / binHz)); for (let k = k0; k <= k1 && k < pow.length; k++) { s += pow[k]; n++; } out[b] = 10 * Math.log10(s / Math.max(1, n) + 1e-10); } return out; }
  function frameSpectrum(frame) { const re = new Float64Array(N), im = new Float64Array(N); for (let i = 0; i < N; i++) re[i] = frame[i] * win[i]; fft(re, im); const pow = new Float64Array(N / 2); for (let k = 0; k < N / 2; k++) pow[k] = (re[k] * re[k] + im[k] * im[k]) / N; return pow; }
  function columnsOf(sig) { const cols = []; for (let s = 0; s + N <= sig.length; s += HOP) cols.push(bandsFromPower(frameSpectrum(sig.subarray(s, s + N)), SR / N)); return cols; }
  // ---- đặc trưng: 40 khung × 64 dải → 8 × 16 = 128 số ----
  const SEG = 36;
  function features(cols, norm) {
    const T = 8, F = 16, out = new Array(T * F).fill(0);
    let mx = -1e9; for (const c of cols) for (const v of c) mx = Math.max(mx, v);
    for (let t = 0; t < T; t++) for (let f = 0; f < F; f++) {
      let s = 0, n = 0; for (let i = Math.floor(t * cols.length / T); i < Math.floor((t + 1) * cols.length / T); i++) for (let b = f * 4; b < f * 4 + 4; b++) { s += cols[i][b]; n++; }
      const v = s / Math.max(1, n); out[t * F + f] = norm ? Math.max(0, Math.min(1, (v - mx) / 60 + 1)) : Math.max(0, Math.min(1, (v + 70) / 70));
    }
    return out;
  }
  function colormap(t) { t = Math.max(0, Math.min(1, t)); const r = Math.min(255, 30 + 330 * t), g = Math.max(0, Math.min(255, 10 + 255 * (t - 0.35) * 1.6)), b = Math.max(0, Math.min(255, 70 + 200 * Math.sin(Math.PI * Math.min(1, t * 1.3)) - 60 * t)); return [r | 0, g | 0, b | 0]; }
  window.AudioLab = { SR, N, HOP, NB, SEG, CLS, COL, EDGES, synth, noiseGen, frameSpectrum, bandsFromPower, columnsOf, features, colormap };
})();
