/* Hộp Kính AI · Dự án 8 · Máy nghe nốt nhạc (sóng âm, tần số, tự tương quan, tra nốt) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-28");
  const SR = 16000, N = 1024;
  const NAMES = ["Đô", "Đô#", "Rê", "Rê#", "Mi", "Fa", "Fa#", "Sol", "Sol#", "La", "La#", "Si"];
  const KEYS = [["Đô", 60, "A"], ["Rê", 62, "S"], ["Mi", 64, "D"], ["Fa", 65, "F"], ["Sol", 67, "G"], ["La", 69, "H"], ["Si", 71, "J"], ["Đô cao", 72, "K"]];
  const hz = (m) => 440 * Math.pow(2, (m - 69) / 12), midiOf = (f) => 69 + 12 * Math.log2(f / 440);
  const noteName = (m) => NAMES[((m % 12) + 12) % 12] + (Math.floor(m / 12) - 1);
  const ST = { src: "sim", vol: 0.6, noise: 0.05, harm: 0.3, gate: 0.05, careful: true, mute: false, note: null, t0: 0, t: 0, buf: new Float32Array(N), det: null, track: [], played: [], score: { ok: 0, n: 0 }, song: null, mic: null, keysUsed: new Set(), phase: 0 };

  // ---------- tín hiệu ----------
  let gs = 0; const gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(6.283 * v); };
  function synth(f, amp, harm, noise, n, sr, ph) {
    const b = new Float32Array(n), w = [1 - harm, harm, 0.3 * harm], s = w[0] + w[1] + w[2];
    for (let i = 0; i < n; i++) { const t = i / sr; let v = 0; if (f) for (let k = 0; k < 3; k++) v += (w[k] / s) * Math.sin(6.2832 * f * (k + 1) * t + ph * (k + 1)); b[i] = amp * v + noise * 0.25 * gauss(); }
    return b;
  }
  // ---------- tìm chu kỳ bằng tự tương quan ----------
  function analyse(b, sr, careful) {
    const n = b.length; let e = 0; for (let i = 0; i < n; i++) e += b[i] * b[i]; const rms = Math.sqrt(e / n);
    const lo = Math.floor(sr / 1100), hi = Math.min(Math.floor(sr / 70), Math.floor(n / 2)), r = new Float32Array(hi + 2);
    for (let l = lo; l <= hi + 1; l++) { let s = 0, a = 0, c = 0; for (let i = 0; i + l < n; i++) { s += b[i] * b[i + l]; a += b[i] * b[i]; c += b[i + l] * b[i + l]; } r[l] = s / Math.sqrt(a * c + 1e-12); }
    let mx = -1; for (let l = lo; l <= hi; l++) mx = Math.max(mx, r[l]);
    const th = (careful ? 0.97 : 0.7) * mx; let lag = -1;
    for (let l = lo + 1; l <= hi; l++) if (r[l] >= th && r[l] >= r[l - 1] && r[l] >= r[l + 1]) { lag = l; break; }
    let fl = lag; if (lag > lo) { const a = r[lag - 1], b2 = r[lag], c = r[lag + 1], d = a - 2 * b2 + c; if (d) fl = lag + (0.5 * (a - c)) / d; }
    return { rms, r, lo, hi, lag, fl, conf: lag > 0 ? r[lag] : 0, f: lag > 0 ? sr / fl : 0, quiet: rms < ST.gate };
  }
  // ---------- âm thanh thật (loa) ----------
  let AC = null; const ac = () => { if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { AC = null; } } if (AC && AC.state === "suspended") AC.resume(); return AC; };
  function beep(f, dur) {
    if (ST.mute || ST.src !== "sim") return; const c = ac(); if (!c) return;
    try { const o = c.createOscillator(), g = c.createGain(), w = [0, 1 - ST.harm + 0.05, ST.harm, 0.3 * ST.harm]; o.setPeriodicWave(c.createPeriodicWave(new Float32Array(w.length), new Float32Array(w))); o.frequency.value = f; g.gain.setValueAtTime(0.0001, c.currentTime); g.gain.exponentialRampToValueAtTime(Math.max(0.0002, 0.25 * ST.vol), c.currentTime + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur); o.connect(g).connect(c.destination); o.start(); o.stop(c.currentTime + dur + 0.05); } catch (e) {}
  }
  function press(m, dur) { ST.note = m; ST.t0 = ST.t; ST.dur = dur || 0.9; ST.played.push({ m, t: ST.t, dur: ST.dur, heard: [] }); beep(hz(m), ST.dur); ST.keysUsed.add(ST.played.length); if (ST.played.length >= 5) prog.done("play"); markKey(m); }

  // ---------- vòng phân tích ----------
  function frame() {
    if (ST.src === "mic" && ST.mic) { const a = ST.mic.an, tmp = new Float32Array(a.fftSize); a.getFloatTimeDomainData(tmp); const sr = ST.mic.ctx.sampleRate, k = Math.max(1, Math.round(sr / SR)); for (let i = 0; i < N; i++) ST.buf[i] = tmp[i * k] || 0; ST.det = analyse(ST.buf, sr / k, ST.careful); }
    else { const on = ST.note != null && ST.t - ST.t0 < ST.dur, amp = on ? ST.vol * Math.max(0.2, 1 - ((ST.t - ST.t0) / ST.dur) * 0.6) : 0; ST.phase += 0.7; ST.buf = synth(on ? hz(ST.note) : 0, amp, ST.harm, ST.noise, N, SR, ST.phase); ST.det = analyse(ST.buf, SR, ST.careful); }
    const d = ST.det, m = d.quiet || d.lag < 0 ? null : midiOf(d.f); ST.track.push({ t: ST.t, m }); while (ST.track.length && ST.track[0].t < ST.t - 10) ST.track.shift();
    const cur = ST.played[ST.played.length - 1]; if (cur && ST.t - cur.t < cur.dur && ST.t - cur.t > 0.15) cur.heard.push(m == null ? null : Math.round(m));
    brain();
  }
  function finishScore() { const done = ST.played.filter((p) => ST.t - p.t >= p.dur && !p.scored); done.forEach((p) => { p.scored = true; const h = p.heard.filter((x) => x != null), c = {}; h.forEach((x) => (c[x] = (c[x] || 0) + 1)); const best = Object.keys(c).sort((a, b) => c[b] - c[a])[0]; p.ok = best != null && +best === p.m; ST.score.n++; if (p.ok) ST.score.ok++; }); }
  function brain() {
    const d = ST.det, m = d.quiet || d.lag < 0 ? null : Math.round(midiOf(d.f));
    $("bNote").textContent = d.quiet ? "im lặng" : m == null ? "?" : noteName(m); $("bHz").textContent = d.quiet || m == null ? "—" : Math.round(d.f) + " Hz";
    $("bRms").textContent = d.rms.toFixed(2); $("bRms").style.color = d.quiet ? "#ff8f6b" : "#5ef2d6";
    finishScore(); $("bScore").textContent = ST.score.n ? `${ST.score.ok}/${ST.score.n} nốt` : "—";
  }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  function wave(ctx, b, x, y, w, h, n, col, lag) {
    ctx.fillStyle = "#171b40"; D.rr(ctx, x, y, w, h, 10); ctx.fill(); ctx.strokeStyle = "#2c3270"; ctx.beginPath(); ctx.moveTo(x, y + h / 2); ctx.lineTo(x + w, y + h / 2); ctx.stroke();
    let mx = 0.05; for (let i = 0; i < n; i++) mx = Math.max(mx, Math.abs(b[i])); const sc = Math.max(mx, 0.6);
    if (lag > 0) for (let k = 0; k * lag < n; k++) { const xx = x + ((k * lag) / n) * w; ctx.strokeStyle = k % 2 ? "rgba(255,195,77,.25)" : "rgba(255,195,77,.6)"; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(xx, y + 6); ctx.lineTo(xx, y + h - 6); ctx.stroke(); ctx.setLineDash([]); }
    ctx.strokeStyle = col || "#5ef2d6"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < n; i++) { const xx = x + (i / n) * w, yy = y + h / 2 - (b[i] / sc) * (h / 2 - 8); i ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke();
  }
  function renderStage() {
    const ctx = sctx, d = ST.det; D.labBg(ctx); if (!d) return;
    lab(ctx, "SÓNG ÂM MÁY NHẬN ĐƯỢC (25 phần nghìn giây)", 24, 32, "#8f96d4", "600 11px JetBrains Mono, monospace");
    wave(ctx, ST.buf, 20, 42, 600, 200, 400, "#5ef2d6", d.quiet ? 0 : d.lag);
    const m = d.quiet || d.lag < 0 ? null : midiOf(d.f);
    if (d.quiet) lab(ctx, "Máy nghe thấy: im lặng (nhỏ hơn ngưỡng)", 24, 290, "#ff8f6b", "800 18px Be Vietnam Pro, sans-serif");
    else if (m != null) {
      lab(ctx, `1 chu kỳ = ${d.fl.toFixed(1)} mẫu (vạch vàng)`, 24, 280, "#ffc34d", "700 14px Be Vietnam Pro, sans-serif");
      lab(ctx, `Tần số = 16 000 ÷ ${d.fl.toFixed(1)} ≈ ${Math.round(d.f)} Hz`, 24, 318, "#fff", "800 22px Be Vietnam Pro, sans-serif");
      lab(ctx, `Không khí dao động ${Math.round(d.f)} lần mỗi giây`, 24, 346, "#c3c7f0", "600 13px Be Vietnam Pro, sans-serif");
      lab(ctx, `Độ giống khi chồng sóng: ${Math.round(d.conf * 100)}%`, 24, 372, d.conf > 0.8 ? "#5ef2d6" : "#ff8f6b", "600 13px Be Vietnam Pro, sans-serif");
    }
    lab(ctx, `Độ to: ${d.rms.toFixed(2)}`, 24, 410, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif"); ctx.fillStyle = "#232866"; ctx.fillRect(110, 400, 300, 12); ctx.fillStyle = d.quiet ? "#ff7d5f" : "#3fe0c5"; ctx.fillRect(110, 400, Math.min(1, d.rms / 0.8) * 300, 12); const gx = 110 + Math.min(1, ST.gate / 0.8) * 300; ctx.fillStyle = "#ffc34d"; ctx.fillRect(gx - 1, 394, 3, 24); lab(ctx, "ngưỡng", gx + 4, 432, "#ffc34d", "600 10px Be Vietnam Pro, sans-serif");
    // bàn phím dọc
    const x0 = 650, kh = 46;
    KEYS.slice().reverse().forEach(([n, mm], i) => { const y = 40 + i * kh, hit = m != null && Math.round(m) === mm, played = ST.note === mm && ST.t - ST.t0 < ST.dur; ctx.fillStyle = hit ? "#3fe0c5" : "#f5f4ff"; D.rr(ctx, x0, y, 150, kh - 6, 8); ctx.fill(); if (played) { ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.stroke(); } lab(ctx, n, x0 + 12, y + 26, "#1b1f4a", "800 14px Be Vietnam Pro, sans-serif"); lab(ctx, Math.round(hz(mm)) + " Hz", x0 + 140, y + 26, "#6c74b8", "600 11px JetBrains Mono, monospace", "right"); });
    if (m != null) { const yy = 40 + (72 - m) * 0 + (7 - KEYS.findIndex((k) => k[1] >= Math.round(m))) * kh; const off = m < 59.5 || m > 72.5; lab(ctx, noteName(Math.round(m)), 815, off ? 250 : Math.max(60, Math.min(400, yy + 26)), off ? "#ff8f6b" : "#5ef2d6", "800 15px Be Vietnam Pro, sans-serif"); if (off) lab(ctx, "ngoài bàn phím", 812, 270, "#ff8f6b", "600 10px Be Vietnam Pro, sans-serif"); }
    lab(ctx, "Viền vàng: nốt chơi · Ô xanh: máy nghe", 650, 428, "#8f96d4", "600 10px Be Vietnam Pro, sans-serif");
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 70, R = 14, T = 12, B = 24; ctx.clearRect(0, 0, W, H);
    const lo = 57, hi = 86, X = (t) => L + (1 - (ST.t - t) / 10) * (W - L - R), Y = (m) => T + (1 - (m - lo) / (hi - lo)) * (H - T - B);
    ctx.font = "11px Be Vietnam Pro, sans-serif"; KEYS.concat([["Đô (cao 2)", 84]]).forEach(([n, m]) => { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(m)); ctx.lineTo(W - R, Y(m)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(n, 6, Y(m) + 4); });
    ST.played.forEach((p) => { if (p.t + p.dur < ST.t - 10) return; ctx.strokeStyle = TH.amber; ctx.lineWidth = 8; ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.moveTo(X(Math.max(p.t, ST.t - 10)), Y(p.m)); ctx.lineTo(X(Math.min(ST.t, p.t + p.dur)), Y(p.m)); ctx.stroke(); ctx.globalAlpha = 1; });
    ctx.fillStyle = TH.mint; ST.track.forEach((q) => { if (q.m == null || q.m < lo - 1 || q.m > hi + 1) return; ctx.beginPath(); ctx.arc(X(q.t), Y(Math.max(lo, Math.min(hi, q.m))), 2.6, 0, 7); ctx.fill(); });
    ctx.fillStyle = TH.text; ctx.fillText("Vạch vàng: nốt được chơi · Chấm xanh: nốt máy nghe · −10 giây → bây giờ", L, H - 6);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Âm là dao động", e: "activity", d: "Dây đàn rung làm không khí bị nén, giãn liên tục: đó là <b>sóng âm</b>. Micro biến sóng âm thành tín hiệu điện lên xuống theo đúng nhịp đó." },
    { t: "Lấy mẫu thành số", e: "cpu", d: "Máy đo tín hiệu <b>16 000 lần mỗi giây</b>, mỗi lần được một con số. Với máy, một nốt nhạc chỉ là một dãy số rất dài." },
    { t: "Chồng sóng để so", e: "layers", d: "Máy dịch sóng sang phải từng chút một và so với chính nó. Khi dịch đúng <b>một chu kỳ</b>, hai sóng <b>trùng khít</b>: độ giống cao nhất." },
    { t: "Tính tần số", e: "target", d: "Tần số = số mẫu mỗi giây ÷ số mẫu của một chu kỳ. Ví dụ 16 000 ÷ 61 ≈ <b>262 Hz</b>: không khí dao động 262 lần mỗi giây." },
    { t: "Tra bảng nốt", e: "book", d: "Máy so tần số với <b>bảng tần số các nốt</b> và chọn nốt gần nhất. Nốt cao hơn một quãng tám có tần số <b>gấp đôi</b>: Đô 262 Hz, Đô cao 523 Hz." },
    { t: "Khi nào nghe nhầm", e: "alert", d: "Âm <b>quá nhỏ</b> (dưới ngưỡng), <b>tiếng ồn</b> lấn át, hay <b>bồi âm</b> mạnh làm sóng lặp lại ở nửa chu kỳ: máy sẽ nghe nhầm. Người làm máy phải chọn ngưỡng và cách kiểm tra cho hợp." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  let demoM = 64;
  function renderSoi() {
    const ctx = octx, s = soiStep; D.labBg(ctx); if (ST.played.length) demoM = ST.played[ST.played.length - 1].m;
    const f = hz(demoM), b = synth(f, 0.8, ST.harm, 0.02, N, SR, 0), an = analyse(b, SR, true);
    lab(ctx, `Nốt ${KEYS.find((k) => k[1] === demoM)?.[0] || noteName(demoM)} · ${Math.round(f)} Hz`, 20, 28, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif");
    if (s === 0) { wave(ctx, b, 20, 50, 600, 220, 400, "#5ef2d6", 0); for (let i = 0; i < 40; i++) { const x = 30 + i * 15, ph = Math.sin(6.283 * (i / 15) - ST.t * 6); ctx.fillStyle = "#a99dff"; ctx.globalAlpha = 0.4 + 0.6 * (ph + 1) / 2; for (let k = 0; k < 6; k++) { ctx.beginPath(); ctx.arc(x + ph * 4, 310 + k * 22, 3, 0, 7); ctx.fill(); } } ctx.globalAlpha = 1; lab(ctx, "Không khí nén lại, giãn ra theo nhịp dao động", 20, 460, "#c3c7f0", "600 13px Be Vietnam Pro, sans-serif"); return; }
    if (s === 1) { const n = 60; wave(ctx, b, 20, 50, 600, 220, n, "rgba(94,242,214,.35)", 0); for (let i = 0; i < n; i++) { const x = 20 + (i / n) * 600, y = 160 - (b[i] / 0.8) * 102; ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(x, y, 3.5, 0, 7); ctx.fill(); } lab(ctx, "60 mẫu đầu tiên:", 20, 300, "#ffc34d"); for (let i = 0; i < 24; i++) lab(ctx, b[i].toFixed(2), 20 + (i % 8) * 76, 328 + Math.floor(i / 8) * 24, "#c3c7f0", "600 12px JetBrains Mono, monospace"); lab(ctx, "… và 16 000 số như vậy mỗi giây", 20, 420); return; }
    if (s === 2) { const L0 = Math.round(an.fl), k = (Math.sin(ST.t * 0.8) + 1) / 2, sh = Math.round(k * L0 * 1.5); wave(ctx, b, 20, 50, 600, 150, 300, "#5ef2d6", 0); const b2 = new Float32Array(300); for (let i = 0; i < 300; i++) b2[i] = b[i + sh] || 0; wave(ctx, b2, 20, 210, 600, 150, 300, "#a99dff", 0); let s2 = 0, a = 0, c = 0; for (let i = 0; i + sh < N; i++) { s2 += b[i] * b[i + sh]; a += b[i] * b[i]; c += b[i + sh] * b[i + sh]; } const sim = s2 / Math.sqrt(a * c); lab(ctx, `Dịch ${sh} mẫu · độ giống ${Math.round(sim * 100)}%`, 20, 400, sim > 0.95 ? "#5ef2d6" : "#fff", "800 18px Be Vietnam Pro, sans-serif"); if (sim > 0.95 && sh > 5) lab(ctx, "Trùng khít: đã dịch đúng một chu kỳ!", 20, 430, "#5ef2d6", "700 14px Be Vietnam Pro, sans-serif"); return; }
    if (s === 3) { const r = an.r, X = (l) => 30 + ((l - an.lo) / (an.hi - an.lo)) * 580, Y = (v) => 240 - v * 160; ctx.strokeStyle = "#2c3270"; ctx.beginPath(); ctx.moveTo(30, Y(0)); ctx.lineTo(610, Y(0)); ctx.stroke(); ctx.strokeStyle = "#a99dff"; ctx.lineWidth = 2; ctx.beginPath(); for (let l = an.lo; l <= an.hi; l++) l === an.lo ? ctx.moveTo(X(l), Y(r[l])) : ctx.lineTo(X(l), Y(r[l])); ctx.stroke(); ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(X(an.lag), Y(r[an.lag]), 7, 0, 7); ctx.fill(); lab(ctx, "Độ giống theo số mẫu dịch đi", 30, 50, "#c3c7f0"); lab(ctx, `đỉnh đầu tiên: ${an.fl.toFixed(1)} mẫu`, X(an.lag) + 10, Y(r[an.lag]) + 4, "#ffc34d"); lab(ctx, `16 000 ÷ ${an.fl.toFixed(1)} = ${Math.round(an.f)} Hz`, 30, 380, "#fff", "800 24px Be Vietnam Pro, sans-serif"); return; }
    if (s === 4) { KEYS.forEach(([n, m], i) => { const y = 50 + i * 46, on = m === Math.round(midiOf(an.f)); ctx.fillStyle = on ? "#3fe0c5" : "#1d2152"; D.rr(ctx, 30, y, 360, 38, 8); ctx.fill(); lab(ctx, n, 46, y + 25, on ? "#062b27" : "#fff", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, hz(m).toFixed(1) + " Hz", 370, y + 25, on ? "#062b27" : "#c3c7f0", "700 13px JetBrains Mono, monospace", "right"); }); lab(ctx, `Đo được ${Math.round(an.f)} Hz`, 420, 90, "#ffc34d", "800 16px Be Vietnam Pro, sans-serif"); lab(ctx, "→ nốt gần nhất", 420, 116); lab(ctx, "Đô 262 × 2 = Đô cao 523", 420, 200, "#a99dff"); return; }
    const cases = [["Bình thường", synth(f, 0.7, 0.3, 0.03, N, SR, 0)], ["Tiếng ồn mạnh", synth(f, 0.5, 0.3, 1.4, N, SR, 0)], ["Quá nhỏ", synth(f, 0.03, 0.3, 0.02, N, SR, 0)], ["Bồi âm mạnh, máy vội", synth(f, 0.7, 0.9, 0.02, N, SR, 0)]];
    cases.forEach(([t, bb], i) => { const y = 40 + i * 104, a2 = analyse(bb, SR, i !== 3), mm = a2.quiet || a2.lag < 0 ? null : Math.round(midiOf(a2.f)), ok = mm === demoM; wave(ctx, bb, 20, y, 380, 84, 300, ok ? "#5ef2d6" : "#ff7d5f", 0); lab(ctx, t, 412, y + 30, "#fff", "800 13px Be Vietnam Pro, sans-serif"); lab(ctx, a2.quiet ? "im lặng" : mm == null ? "?" : `${noteName(mm)} · ${Math.round(a2.f)} Hz`, 412, y + 56, ok ? "#5ef2d6" : "#ff8f6b", "700 13px Be Vietnam Pro, sans-serif"); });
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), f = hz(demoM);
    if (s <= 1) el.innerHTML = `Nốt đang soi: <span class="hl">${Math.round(f)} Hz</span>`;
    else if (s <= 3) el.innerHTML = `Một chu kỳ dài <span class="hl">${(SR / f).toFixed(1)}</span> mẫu`;
    else if (s === 4) el.innerHTML = `${Math.round(f)} Hz → <span class="hl">${noteName(demoM)}</span>`;
    else el.innerHTML = `Ngưỡng im lặng hiện tại: <span class="w">${ST.gate}</span>`;
  }

  // ---------- điều khiển ----------
  const guide = (h) => ($("guideText").innerHTML = h);
  function markKey(m) { document.querySelectorAll("#keys button").forEach((b) => b.classList.toggle("on", +b.dataset.m === m)); setTimeout(() => document.querySelectorAll("#keys button").forEach((b) => b.classList.remove("on")), 350); }
  const SONG = [60, 62, 64, 60, 60, 62, 64, 60, 64, 65, 67, 64, 65, 67];
  function playSong() { if (ST.song) clearInterval(ST.song); let i = 0; const start = ST.score.n; ST.songStart = ST.played.length; ST.song = setInterval(() => { if (i >= SONG.length) { clearInterval(ST.song); ST.song = null; setTimeout(() => { finishScore(); const ps = ST.played.slice(ST.songStart), ok = ps.filter((p) => p.ok).length; if (ps.length === SONG.length) prog.done("song"); $("askText").innerHTML = `Máy nghe đúng <b>${ok}/${ps.length}</b> nốt của bài hát.${ok < ps.length ? " Xem biểu đồ: chỗ nào chấm xanh lệch khỏi vạch vàng là máy nghe nhầm." : ""}`; void start; }, 900); return; } press(SONG[i++], 0.42); }, 480); }
  async function useMic() {
    try { if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("no"); const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); const c = ac(); const an = c.createAnalyser(); an.fftSize = 4096; c.createMediaStreamSource(stream).connect(an); ST.mic = { ctx: c, an, stream }; ST.src = "mic"; P.srcButtons("cam"); $("srcTag").textContent = "MICRO"; P.msg($("msg"), null); guide("Micro đã bật. Hãy hát \"Đô… Rê… Mi…\" thật đều hơi, hoặc gõ nhẹ vào ly thủy tinh. Máy chỉ nghe, không ghi âm lại."); }
    catch (e) { P.msg($("msg"), "Trên trang GitHub Pages của dự án, micro sẽ hoạt động khi em bấm <b>Cho phép</b>. Bây giờ em hãy dùng <b>Đàn mô phỏng</b> nhé.", "alert", 6000); }
  }
  function bind() {
    $("keys").innerHTML = KEYS.map(([n, m, k]) => `<button data-m="${m}" title="Nốt ${n}, phím ${k}"><b>${n}</b><span>${k}</span></button>`).join("");
    $("keys").querySelectorAll("button").forEach((b) => (b.onclick = () => press(+b.dataset.m)));
    window.addEventListener("keydown", (e) => { if (e.target.tagName === "INPUT" || e.repeat) return; const k = KEYS.find((x) => x[2] === e.key.toUpperCase()); if (k) press(k[1]); });
    $("btnSong").onclick = () => { if (ST.src !== "sim") setSim(); playSong(); };
    $("optMute").onchange = (e) => (ST.mute = e.target.checked);
    const labDone = () => prog.done("lab");
    const setVol = P.range("vol", () => ST.vol, (v) => (ST.vol = v), (v) => v.toFixed(2), labDone);
    const setNoise = P.range("noise", () => ST.noise, (v) => (ST.noise = v), (v) => v.toFixed(2), labDone);
    const setHarm = P.range("harm", () => ST.harm, (v) => (ST.harm = v), (v) => Math.round(v * 100) + "%", labDone);
    const setGate = P.range("gate", () => ST.gate, (v) => (ST.gate = v), (v) => v.toFixed(2));
    $("optCareful").onchange = (e) => (ST.careful = e.target.checked);
    function setSim() { ST.src = "sim"; if (ST.mic) { ST.mic.stream.getTracks().forEach((t) => t.stop()); ST.mic = null; } P.srcButtons("sim"); $("srcTag").textContent = "MÔ PHỎNG"; }
    $("srcSim").onclick = setSim; $("srcCam").onclick = useMic;
    const clear = () => { ST.vol = 0.6; setVol(); ST.noise = 0.05; setNoise(); ST.harm = 0.3; setHarm(); ST.gate = 0.05; setGate(); ST.careful = true; $("optCareful").checked = true; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); setSim(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "noisy") { ST.noise = 1.3; setNoise(); ST.vol = 0.45; setVol(); guide("Phòng rất ồn! Bấm <b>Máy tự chơi</b> và xem biểu đồ: chấm xanh nhảy lung tung. Kéo <b>Tiếng ồn</b> xuống hoặc <b>Độ to</b> lên rồi thử lại."); }
      if (k === "quiet") { ST.vol = 0.03; setVol(); guide("Bạn nhỏ hát quá khẽ: độ to nhỏ hơn <b>ngưỡng im lặng</b> (vạch vàng ở dưới sóng âm). Máy chỉ nghe thấy im lặng. Kéo <b>Độ to</b> lên."); }
      if (k === "octave") { ST.harm = 0.9; setHarm(); ST.careful = false; $("optCareful").checked = false; guide("Nhạc cụ có bồi âm rất mạnh, máy lại vội vàng. Bấm phím <b>Đô</b>: máy nghe ra <b>Đô cao</b>, gấp đôi tần số! Bật <b>Máy kiểm tra kỹ chu kỳ lặp lại</b>."); }
      playSong(); $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); guide("Mọi sự cố đã tắt. Thử bấm <b>Máy tự chơi</b> lần nữa nhé!"); };
    $("bTable").innerHTML = KEYS.map(([n, m]) => `<span>${n} <b>${Math.round(hz(m))}</b></span>`).join("");
  }

  const QUIZ = [
    { q: "Tần số của âm cho biết điều gì?", o: ["Âm to hay nhỏ", "Số dao động mỗi giây, quyết định âm cao hay thấp", "Âm phát ra từ đâu", "Âm kéo dài bao lâu"], a: 1, e: "Tần số càng lớn, âm càng cao. Độ to thì phụ thuộc biên độ." },
    { q: "Máy lấy 16 000 mẫu mỗi giây, một chu kỳ dài 40 mẫu. Tần số là bao nhiêu?", o: ["40 Hz", "400 Hz", "640 000 Hz", "16 040 Hz"], a: 1, e: "Tần số = 16 000 ÷ 40 = 400 Hz." },
    { q: "Nốt Đô có tần số khoảng 262 Hz. Nốt Đô cao hơn một quãng tám có tần số khoảng bao nhiêu?", o: ["131 Hz", "262 Hz", "524 Hz", "1000 Hz"], a: 2, e: "Lên một quãng tám thì tần số gấp đôi." },
    { q: "Em hát rất nhỏ trong phòng yên tĩnh, máy báo \"im lặng\". Vì sao?", o: ["Máy bị hỏng micro", "Độ to của tiếng hát nhỏ hơn ngưỡng im lặng của máy", "Tần số quá cao", "Máy không thích bài hát"], a: 1, e: "Máy bỏ qua mọi âm có biên độ nhỏ hơn ngưỡng để không \"nghe\" nhầm tiếng ồn." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now(), acc = 0;
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; acc += dt; if (acc > 0.05) { acc = 0; frame(); renderStage(); renderChart(); } if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); P.srcButtons("sim"); $("askText").innerHTML = "Bấm phím đàn để chơi một nốt, hoặc để máy tự chơi cả bài hát."; guide("Bấm các phím đàn (hoặc phím <b>A S D F G H J K</b> trên bàn phím máy tính). Nhìn sóng âm: nốt càng cao, sóng càng <b>dày</b>!"); frame();
  window.__hka28 = { ST, analyse, synth, hz, midiOf, press, playSong, SONG };
  requestAnimationFrame(tick);
})();
