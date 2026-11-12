/* Hộp Kính AI · Dự án 08 · Nhận diện âm thanh (sóng âm, FFT, ảnh phổ, tiếng ồn, chuẩn hóa) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, A = AudioLab;
  const prog = P.progress("hka-08");
  const NC = 4, CLS = A.CLS, COL = A.COL, COLS = 200;
  const DEF = { noise: 0.01, vol: 1, norm: true, sub: false, unk: false, unkTh: 0.65, dog: false };
  const ST = {
    src: "sim", ...DEF, auto: true, nextAt: 0.8, t: 0, queue: [], qpos: 0, curTruth: null, buf: new Float32Array(A.N), bufFill: 0,
    cols: [], floor: new Float32Array(A.NB).fill(-60), inEvent: false, evCols: [], evStart: 0, cool: 0, events: [], last: null, lastSig: null,
    made: new Set(), stats: [0, 0], train: [], own: [], model: null, colCount: 0, wave: new Float32Array(1600), wpos: 0
  };
  const ng = A.noiseGen();
  const stage = $("stage"), sctx = stage.getContext("2d"), soi = $("soiCanvas"), octx = soi.getContext("2d");
  const wf = document.createElement("canvas"); wf.width = COLS; wf.height = A.NB; const wctx = wf.getContext("2d");
  wctx.fillStyle = "#0b0d26"; wctx.fillRect(0, 0, COLS, A.NB);

  // ---------- huấn luyện mô hình trên âm mô phỏng ----------
  // đi qua đúng đường xử lý như khi nghe trực tiếp: 0,4 giây tiếng ồn nền, rồi tới âm thanh
  function featOfSig(sig, noise, vol) {
    const pre = Math.floor(0.4 * A.SR), s = new Float32Array(pre + sig.length + A.N), g = A.noiseGen();
    for (let i = 0; i < s.length; i++) s[i] = (i >= pre && i - pre < sig.length ? sig[i - pre] * vol : 0) + g() * noise * 1.8;
    const cols = A.columnsOf(s), np = Math.floor(pre / A.HOP) - 2, floor = new Float32Array(A.NB);
    for (let b = 0; b < A.NB; b++) { let m = 0; for (let t = 2; t < np; t++) m += Math.pow(10, cols[t][b] / 10) / (np - 2); floor[b] = 10 * Math.log10(m + 1e-12); }
    let seg = cols.slice(np - 1, np - 1 + A.SEG);
    if (ST.sub) seg = seg.map((c) => c.map((v, b) => 10 * Math.log10(Math.max(1e-9, Math.pow(10, v / 10) - 2.5 * Math.pow(10, floor[b] / 10)))));
    return A.features(seg, ST.norm);
  }
  function buildTrain() {
    const r = P.rng(5); ST.train = [];
    for (let c = 0; c < NC; c++) for (let i = 0; i < 18; i++) ST.train.push({ sig: A.synth(c, r), y: c });
  }
  function fit(data) {
    const X = data.map((d) => d.f || featOfSig(d.sig, 0.01, 1)), Y = data.map((d) => d.y);
    const m = P.Softmax(X[0].length, NC); m.fitScaler(X); for (let e = 0; e < 60; e++) m.epoch(X, Y, 0.02, 0.001); ST.model = m;
    renderProtos(); testModel();
  }
  function testModel() {
    const r = P.rng(77), M = Array.from({ length: NC }, () => new Array(NC).fill(0)); let ok = 0, n = 0;
    for (let c = 0; c < NC; c++) for (let i = 0; i < 10; i++) { const f = featOfSig(A.synth(c, r), ST.noise, ST.vol); const p = P.argmax(ST.model.predict(f)); M[c][p]++; if (p === c) ok++; n++; }
    $("confOut").innerHTML = P.confusion(CLS.slice(0, NC), COL, M); $("testAcc").textContent = Math.round(ok / n * 100) + "%";
  }

  // ---------- luồng âm thanh mô phỏng (giống như micro) ----------
  function inject(c) { ST.queue = A.synth(c); ST.qpos = 0; ST.curTruth = { c, t: ST.t }; ST.lastSig = ST.queue; ST.made.add(c); if (ST.made.size >= 4) prog.done("make"); }
  function nextSample() {
    let v = ng() * ST.noise * 1.8;
    if (ST.qpos < ST.queue.length) v += ST.queue[ST.qpos++] * ST.vol;
    return v;
  }
  function processColumn(col) {
    // ước lượng tiếng ồn nền theo từng dải: nhảy xuống ngay, nhích lên từ từ
    for (let b = 0; b < A.NB; b++) { const f = ST.floor[b], v = Math.max(-110, col[b]); ST.floor[b] = v < f ? 0.7 * f + 0.3 * v : 0.985 * f + 0.015 * v; }
    let c = col;
    if (ST.sub) { c = new Float32Array(A.NB); for (let b = 0; b < A.NB; b++) { const p = Math.pow(10, col[b] / 10) - 2.5 * Math.pow(10, ST.floor[b] / 10); c[b] = 10 * Math.log10(Math.max(1e-9, p)); } }
    ST.cols.push(c); if (ST.cols.length > COLS) ST.cols.shift(); ST.colCount++;
    // vẽ thêm một cột vào ảnh phổ thác nước
    wctx.drawImage(wf, -1, 0); const img = wctx.createImageData(1, A.NB);
    for (let b = 0; b < A.NB; b++) { const [r, g, bb] = A.colormap((c[b] + 75) / 75); const i = (A.NB - 1 - b) * 4; img.data[i] = r; img.data[i + 1] = g; img.data[i + 2] = bb; img.data[i + 3] = 255; }
    wctx.putImageData(img, COLS - 1, 0);
    // phát hiện sự kiện âm thanh
    let e = 0; for (let b = 0; b < A.NB; b++) e += Math.pow(10, col[b] / 10);
    const eDb = 10 * Math.log10(e + 1e-12);
    if (ST.floorE == null) ST.floorE = eDb;
    const rise = eDb - ST.floorE;
    if (!ST.inEvent) ST.floorE = eDb < ST.floorE ? 0.8 * ST.floorE + 0.2 * eDb : ST.floorE + 0.03;
    if (ST.cool > 0) ST.cool--;
    if (!ST.inEvent && ST.cool === 0 && rise > 9) { ST.inEvent = true; ST.evCols = ST.cols.slice(-3); ST.evStart = ST.colCount - 3; }
    else if (ST.inEvent) { ST.evCols.push(c); if (ST.evCols.length >= A.SEG) { ST.inEvent = false; ST.cool = 8; classify(ST.evCols.slice(0, A.SEG)); } }
  }
  function classify(cols) {
    const f = A.features(cols, ST.norm), p = ST.model.predict(f), k = P.argmax(p), unk = ST.unk && p[k] < ST.unkTh;
    const truth = ST.src === "sim" && ST.curTruth && ST.t - ST.curTruth.t < 1.2 ? ST.curTruth.c : null;
    ST.last = { f, p, k, unk, cols, truth, col: ST.evStart };
    ST.events.push(ST.last);
    if (truth != null) { ST.stats[1]++; const ok = truth === 4 ? unk : !unk && k === truth; if (ok) ST.stats[0]++; ST.last.ok = ok; }
  }

  // ---------- micro thật ----------
  let actx = null, analyser = null, stream = null;
  async function useMic() {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("trình duyệt hoặc trang xem trước này không cho dùng micro");
      stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false } });
      actx = actx || new AudioContext(); const src = actx.createMediaStreamSource(stream); analyser = actx.createAnalyser(); analyser.fftSize = 1024; analyser.smoothingTimeConstant = 0; src.connect(analyser);
      ST.src = "mic"; P.srcButtons("cam"); $("srcTag").textContent = "MICRO"; document.querySelectorAll(".mic-only").forEach((e) => (e.hidden = false));
    } catch (e) { useSim(); P.msg($("stageMsg"), "Chưa bật được micro (" + (e.message || e) + "). Trên trang GitHub Pages của dự án, micro sẽ hoạt động khi em bấm <b>Cho phép</b>. Bây giờ em hãy dùng chế độ <b>Âm thanh mô phỏng</b> nhé.", "alert", 9000); }
  }
  function useSim() { if (stream) stream.getTracks().forEach((t) => t.stop()); stream = null; analyser = null; ST.src = "sim"; P.srcButtons("sim"); document.querySelectorAll(".mic-only").forEach((e) => (e.hidden = true)); }
  const micFreq = new Float32Array(512), micWave = new Float32Array(1024);
  function micColumn() {
    analyser.getFloatFrequencyData(micFreq); analyser.getFloatTimeDomainData(micWave);
    for (let i = 0; i < 1024; i += 4) { ST.wave[ST.wpos] = micWave[i]; ST.wpos = (ST.wpos + 1) % ST.wave.length; }
    const binHz = actx.sampleRate / 1024, pow = new Float64Array(512); for (let k = 0; k < 512; k++) pow[k] = Math.pow(10, micFreq[k] / 10) * 30;
    processColumn(A.bandsFromPower(pow, binHz));
  }

  // ---------- vẽ sân khấu ----------
  function renderStage() {
    const ctx = sctx, W = 640, H = 480;
    ctx.fillStyle = "#0e1130"; ctx.fillRect(0, 0, W, H);
    // dạng sóng
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText("SÓNG ÂM (2 GIÂY GẦN NHẤT)", 14, 20);
    ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 1.2; ctx.beginPath();
    const n = ST.wave.length; for (let i = 0; i < n; i++) { const v = ST.wave[(ST.wpos + i) % n], x = i / n * W, y = 82 - v * 120; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    // ảnh phổ thác nước
    ctx.fillStyle = "#8f96d4"; ctx.fillText("ẢNH PHỔ: NGANG = THỜI GIAN, DỌC = TẦN SỐ (THẤP → CAO)", 14, 158);
    ctx.imageSmoothingEnabled = true; ctx.drawImage(wf, 0, 166, W, 250);
    ctx.fillStyle = "#c3c7f0"; for (const [hz, lab] of [[100, "100 Hz"], [1000, "1 kHz"], [5000, "5 kHz"]]) { const b = Math.log(hz / 60) / Math.log(7800 / 60) * A.NB, y = 166 + 250 - b / A.NB * 250; ctx.fillRect(0, y, 6, 1); ctx.fillText(lab, 8, y + 4); }
    // nhãn sự kiện
    const now = ST.colCount;
    ST.events = ST.events.filter((e) => now - e.col < COLS + 60);
    for (const e of ST.events) {
      const x = W - (now - e.col) / COLS * W, w = A.SEG / COLS * W;
      ctx.strokeStyle = e.unk ? "#ffc34d" : COL[e.k]; ctx.lineWidth = 2; ctx.strokeRect(x, 168, w, 246);
      D.pill(ctx, e.unk ? "Không biết" : CLS[e.k], Math.min(W - 50, Math.max(50, x + w / 2)), 440, e.ok === false ? "#c2402a" : e.unk ? "#8a5a00" : "#1c2048", 12);
    }
    if (ST.inEvent) { ctx.fillStyle = "rgba(94,242,214,.12)"; ctx.fillRect(W - ST.evCols.length / COLS * W, 166, ST.evCols.length / COLS * W, 250); }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Sóng âm", e: "pulse", d: "Micro đo áp suất không khí <b>16.000 lần mỗi giây</b>. Âm thanh với máy là một dãy số dài, lúc dương lúc âm." },
    { t: "Chia khung", e: "layers", d: "Cắt dãy số thành những <b>khung ngắn 32 mili giây</b>, khung sau chồng lên khung trước một nửa. Mỗi khung đủ ngắn để coi như âm thanh không đổi." },
    { t: "Tách tần số (FFT)", e: "sparkle", d: "Phép biến đổi <b>Fourier</b> tách mỗi khung thành các tần số, giống lăng kính tách ánh sáng thành cầu vồng. Cột càng cao thì tần số đó càng mạnh." },
    { t: "Ảnh phổ", e: "image", d: "Xếp các khung cạnh nhau: ngang là thời gian, dọc là tần số, màu là độ mạnh. Âm thanh đã trở thành một <b>bức ảnh</b>!" },
    { t: "Thu nhỏ thành vector", e: "blocks", d: "Thu nhỏ ảnh phổ còn <b>8 × 16 = 128 ô</b>. Đó là vector đặc trưng, giống hệt cách ta xử lý ảnh rác ở Dự án 6." },
    { t: "Phân loại", e: "checkCircle", d: "Lớp phân loại (softmax, như Dự án 6) biến 128 con số thành xác suất cho từng loại âm." }
  ];
  let soiVisible = false;
  const pipe = P.pipeline(SOI, (i) => { if (i >= 2) prog.done("see"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const s = pipe.get(), ctx = octx, W = 640, H = 480; D.labBg(ctx);
    const sig = ST.lastSig, ev = ST.last;
    if (s <= 2) {
      if (!sig) { D.pill(ctx, "Hãy tạo một âm thanh ở phần Mồi", W / 2, H / 2, "#1c2048", 14); return; }
      const n = Math.min(sig.length, A.SR * 0.5), y0 = s === 2 ? 110 : H / 2;
      ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 1; ctx.beginPath(); for (let i = 0; i < n; i += 2) { const x = 20 + i / n * 600, y = y0 - sig[i] * (s === 2 ? 90 : 180); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
      if (s >= 1) { for (let k = 0; k * A.HOP + A.N < n; k += 1) { const x = 20 + k * A.HOP / n * 600, w = A.N / n * 600; ctx.strokeStyle = k === 6 ? "#ffc34d" : "rgba(145,132,255,.35)"; ctx.lineWidth = k === 6 ? 3 : 1; ctx.strokeRect(x, y0 - (s === 2 ? 95 : 190) + (k % 2) * 6, w, s === 2 ? 190 : 380); } }
      if (s === 2) {
        const pow = A.frameSpectrum(sig.subarray(6 * A.HOP, 6 * A.HOP + A.N)), bands = A.bandsFromPower(pow, A.SR / A.N);
        for (let b = 0; b < A.NB; b++) { const v = Math.max(0, (bands[b] + 75) / 75), h = v * 200; const [r, g, bb] = A.colormap(v); ctx.fillStyle = `rgb(${r},${g},${bb})`; ctx.fillRect(20 + b * 9.3, 440 - h, 8, h); }
        ctx.fillStyle = "#c3c7f0"; ctx.font = "11px JetBrains Mono"; ctx.fillText("60 Hz", 20, 462); ctx.fillText("7,8 kHz", 560, 462); ctx.fillText("khung vàng → các tần số trong khung đó", 160, 230);
      }
      return;
    }
    if (!ev) { D.pill(ctx, "Chưa phát hiện âm thanh nào", W / 2, H / 2, "#1c2048", 14); return; }
    if (s === 3) {
      const cw = 600 / ev.cols.length, bh = 400 / A.NB;
      ev.cols.forEach((c, t) => { for (let b = 0; b < A.NB; b++) { const [r, g, bb] = A.colormap((c[b] + 75) / 75); ctx.fillStyle = `rgb(${r},${g},${bb})`; ctx.fillRect(20 + t * cw, 440 - (b + 1) * bh, cw + 0.5, bh + 0.5); } });
      ctx.fillStyle = "#fff"; ctx.font = "700 13px Be Vietnam Pro"; ctx.fillText(`${ev.cols.length} khung × ${A.NB} dải tần = ${ev.cols.length * A.NB} ô màu`, 20, 30);
    } else if (s === 4) {
      const f = ev.f, cw = 72, ch = 24;
      for (let t = 0; t < 8; t++) for (let b = 0; b < 16; b++) { const v = f[t * 16 + b], [r, g, bb] = A.colormap(v); ctx.fillStyle = `rgb(${r},${g},${bb})`; ctx.fillRect(30 + t * cw, 440 - (b + 1) * ch, cw - 2, ch - 2); if (t === 0 && b === 15) { ctx.fillStyle = "#fff"; ctx.font = "10px JetBrains Mono"; } }
      ctx.fillStyle = "#fff"; ctx.font = "700 13px Be Vietnam Pro"; ctx.fillText("8 cột thời gian × 16 hàng tần số = 128 con số", 30, 44);
    } else {
      for (let k = 0; k < NC; k++) { const x = 50 + k * 140, h = ev.p[k] * 300; ctx.fillStyle = "#232866"; D.rr(ctx, x, 100, 90, 300, 10); ctx.fill(); ctx.fillStyle = COL[k]; D.rr(ctx, x, 400 - h, 90, Math.max(6, h), 10); ctx.fill(); ctx.fillStyle = "#fff"; ctx.font = "700 14px Be Vietnam Pro"; ctx.textAlign = "center"; ctx.fillText(CLS[k], x + 45, 430); ctx.fillText(Math.round(ev.p[k] * 100) + "%", x + 45, 90); ctx.textAlign = "left"; }
      D.pill(ctx, ev.unk ? "→ Không biết" : "→ " + CLS[ev.k], 320, 44, "#0b7d71", 16);
    }
  }
  function soiLive() {
    const s = pipe.get(), el = $("soiLive"), sig = ST.lastSig, ev = ST.last;
    if (s === 0) el.innerHTML = sig ? `Số mẫu: <span class="hl">${sig.length.toLocaleString("vi-VN")}</span> (0,62 giây × 16.000)\nVài mẫu đầu: ${Array.from(sig.slice(400, 405)).map((v) => v.toFixed(3)).join(", ")}…` : "—";
    else if (s === 1) el.innerHTML = `Mỗi khung: <span class="hl">${A.N} mẫu</span> = 32 ms\nBước nhảy: ${A.HOP} mẫu = 16 ms\n→ khoảng <span class="w">62 khung mỗi giây</span>`;
    else if (s === 2) el.innerHTML = `FFT ${A.N} mẫu → ${A.N / 2} tần số, cách nhau ${(A.SR / A.N).toFixed(2)} Hz\nGộp lại thành <span class="hl">${A.NB} dải</span> theo thang log\n(tai người nghe tần số theo thang log)`;
    else if (!ev) el.textContent = "—";
    else if (s === 3) el.innerHTML = `Ảnh phổ của âm vừa nghe: <span class="hl">${ev.cols.length} × ${A.NB}</span>\nChuẩn hóa âm lượng: <span class="w">${ST.norm ? "BẬT" : "TẮT"}</span> · Trừ tiếng ồn: <span class="w">${ST.sub ? "BẬT" : "TẮT"}</span>`;
    else if (s === 4) el.innerHTML = `Vector: [${ev.f.slice(0, 6).map((v) => v.toFixed(2)).join(", ")}, …] (128 số)`;
    else el.innerHTML = CLS.slice(0, NC).map((c, k) => `${c.padEnd(12, " ")} <span class="hl">${Math.round(ev.p[k] * 100)}%</span>`).join("\n") + (ev.truth != null ? `\nThật ra là: <span class="w">${CLS[ev.truth]}</span>` : "");
  }

  // ---------- bảng não, mẫu trung bình, code ----------
  function renderBrain() {
    const e = ST.last;
    $("bResult").innerHTML = `<small>AI NGHE THẤY</small><span style="color:${e ? (e.unk ? "#ffc34d" : COL[e.k]) : "#fff"}">${e ? (e.unk ? "Không biết" : CLS[e.k]) : "—"}</span>`;
    $("bProbs").innerHTML = CLS.slice(0, NC).map((c, k) => `<div class="r"><span>${c}</span><span class="bar"><i style="width:${e ? e.p[k] * 100 : 0}%;background:${COL[k]}"></i></span><span>${e ? Math.round(e.p[k] * 100) : 0}%</span></div>`).join("");
    $("bStats").textContent = `${ST.stats[0]}/${ST.stats[1]}`;
    const fl = ST.floor.reduce((a, b) => a + b, 0) / A.NB; $("bNoise").textContent = fl.toFixed(0) + " dB";
  }
  function renderProtos() {
    const cv = $("protos"), ctx = cv.getContext("2d"); ctx.clearRect(0, 0, cv.width, cv.height);
    for (let c = 0; c < NC; c++) {
      const fs = ST.train.filter((d) => d.y === c).map((d) => d.f || featOfSig(d.sig, 0.01, 1)); if (!fs.length) continue;
      const m = fs[0].map((_, j) => fs.reduce((s, f) => s + f[j], 0) / fs.length), x0 = 10 + c * 165;
      for (let t = 0; t < 8; t++) for (let b = 0; b < 16; b++) { const [r, g, bb] = A.colormap(m[t * 16 + b]); ctx.fillStyle = `rgb(${r},${g},${bb})`; ctx.fillRect(x0 + t * 18, 150 - (b + 1) * 8, 17, 7.5); }
      ctx.fillStyle = COL[c]; ctx.font = "700 13px Be Vietnam Pro, sans-serif"; ctx.fillText(CLS[c] + ` (${fs.length})`, x0, 170);
    }
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${k("for")} (${k("let")} batDau = ${n(0)}; batDau + ${n(512)} &lt;= song.length; batDau += ${n(256)}) {
  ${k("const")} khung = song.slice(batDau, batDau + ${n(512)});   ${c("// 32 ms")}
  ${k("const")} tanSo = fft(nhanCuaSo(khung));                     ${c("// lăng kính âm thanh")}
  ${k("let")} cot = gopDaiTanLog(tanSo, ${n(64)});                    ${c("// 64 dải tần")}
${ST.sub ? `  cot = truTiengOn(cot, nenOn);                                  ${c("// bớt tiếng quạt, tiếng mưa")}\n` : ""}  anhPho.push(cot);
}
${k("let")} vector = thuNho(anhPho, ${n(8)}, ${n(16)});                  ${c("// 128 con số")}
${ST.norm ? `vector = vector.map(v => v - Math.max(...vector));        ${c("// chuẩn hóa: chỉ quan tâm hình dạng, không quan tâm to nhỏ")}\n` : ""}${k("const")} xacSuat = softmax(W · vector + b);${ST.unk ? `\n${k("if")} (Math.max(...xacSuat) &lt; ${n(ST.unkTh)}) ${k("return")} <span class="s">"Không biết"</span>;` : ""}`;
  }

  // ---------- âm thanh phát ra loa (chỉ khi em bấm) ----------
  function play() {
    if (!ST.lastSig) return;
    try { actx = actx || new AudioContext(); const b = actx.createBuffer(1, ST.lastSig.length, A.SR); b.copyToChannel(Float32Array.from(ST.lastSig, (v) => v * ST.vol), 0); const s = actx.createBufferSource(); s.buffer = b; s.connect(actx.destination); s.start(); }
    catch (e) { P.msg($("stageMsg"), "Trình duyệt này chưa cho phát âm thanh.", "alert", 4000); }
  }

  // ---------- điều khiển ----------
  const syncs = [];
  function bind() {
    $("srcSim").onclick = useSim; $("srcCam").onclick = useMic;
    $("makeBtns").innerHTML = CLS.slice(0, NC).map((c, k) => `<button class="btn small" style="background:${COL[k]};color:#0a0b1e" data-k="${k}">${c}</button>`).join("");
    $("makeBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.auto = false; markAuto(); inject(+b.dataset.k); }));
    $("btnAuto").onclick = () => { ST.auto = !ST.auto; markAuto(); };
    $("btnPlay").onclick = play;
    syncs.push(P.range("noise", () => ST.noise, (v) => (ST.noise = v), (v) => (v < 0.05 ? "yên tĩnh" : v < 0.15 ? "có quạt" : "rất ồn")));
    syncs.push(P.range("vol", () => ST.vol, (v) => (ST.vol = v), (v) => Math.round(v * 100) + "%"));
    syncs.push(P.range("unkTh", () => ST.unkTh, (v) => (ST.unkTh = v), (v) => Math.round(v * 100) + "%", genCode));
    for (const [id, key] of [["norm", "norm"], ["sub", "sub"], ["unk", "unk"]]) $(id).onchange = (e) => { ST[key] = e.target.checked; genCode(); if (key === "unk") return; if (key === "norm") fit(ST.own.length >= 8 ? ST.own : ST.train); else testModel(); };
    $("recBtns").innerHTML = CLS.slice(0, NC).map((c, k) => `<button class="btn small ghost" data-k="${k}"><i data-i="upload"></i>${c}</button>`).join(""); HKA.hydrate($("recBtns"));
    $("recBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { if (!ST.last) return; ST.own.push({ f: ST.last.f, y: +b.dataset.k }); $("ownInfo").textContent = CLS.slice(0, NC).map((c, k) => `${c}: ${ST.own.filter((d) => d.y === k).length}`).join(" · "); if (ST.own.length >= 3) prog.done("record"); }));
    $("btnOwn").onclick = () => { if (CLS.slice(0, NC).every((_, k) => ST.own.some((d) => d.y === k))) fit(ST.own); else P.msg($("stageMsg"), "Cần ít nhất 1 mẫu cho mỗi loại âm.", "alert", 3000); };
    $("btnTest").onclick = testModel;
    const sync = () => { syncs.forEach((f) => f()); for (const k of ["norm", "sub", "unk"]) $(k).checked = ST[k]; genCode(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      const needRefit = ST.norm !== DEF.norm || k === "quiet";
      Object.assign(ST, DEF);
      if (k === "noisy") ST.noise = 0.28;
      if (k === "quiet") { ST.vol = 0.12; ST.norm = false; }
      if (k === "dog") ST.dog = true;
      if (ST.src !== "sim") useSim();
      ST.auto = true; markAuto(); sync(); if (needRefit) fit(ST.train); testModel(); prog.done("broke");
      $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); sync(); fit(ST.train); };
    sync();
  }
  function markAuto() { const b = $("btnAuto"); b.setAttribute("aria-pressed", ST.auto); b.classList.toggle("ghost", !ST.auto); }

  const QUIZ = [
    { q: "Với máy tính, một đoạn âm thanh thực chất là gì?", o: ["Một bức ảnh", "Một dãy rất nhiều con số đo áp suất không khí theo thời gian", "Một từ trong từ điển", "Một nốt nhạc"], a: 1, e: "Micro đo áp suất hàng nghìn lần mỗi giây. Mỗi lần đo là một con số." },
    { q: "Phép biến đổi Fourier (FFT) làm gì?", o: ["Làm âm thanh to hơn", "Tách một khung âm thanh thành các tần số tạo nên nó, giống lăng kính tách ánh sáng", "Xóa tiếng ồn", "Ghi âm"], a: 1, e: "Nhờ FFT, ta biết trong khung đó có tần số thấp (trống), cao (huýt sáo) hay trải đều (vỗ tay)." },
    { q: "Vì sao biến âm thanh thành \"ảnh phổ\" lại có ích?", o: ["Vì đẹp hơn", "Vì có thể dùng lại các kỹ thuật nhận diện ẢNH để nhận diện âm thanh", "Vì máy không nghe được", "Vì tiết kiệm pin"], a: 1, e: "Huýt sáo là một vệt mảnh ở tần số cao, tiếng trống là một khối ở tần số thấp. Phân biệt hình dạng là việc AI ảnh làm rất giỏi." },
    { q: "Máy học từ âm thanh to rõ, nhưng người dùng nói nhỏ từ xa nên máy đoán sai. Cách sửa hợp lý là…", o: ["Bắt người dùng hét to", "Chuẩn hóa âm lượng: chỉ so hình dạng ảnh phổ, không so độ to tuyệt đối", "Tắt micro", "Xóa dữ liệu"], a: 1, e: "Chuẩn hóa giúp mô hình không phụ thuộc vào khoảng cách hay âm lượng thu được." },
    { q: "Nếu dùng AI nghe âm thanh ở trường học (ví dụ phát hiện tiếng kính vỡ), điều gì cần cân nhắc nhất?", o: ["Không cần cân nhắc gì", "Quyền riêng tư: micro có thể thu cả lời nói của mọi người, nên cần xử lý trên máy và không ghi âm lại", "Chỉ cần micro thật to", "Nên ghi âm cả ngày"], a: 1, e: "Âm thanh chứa thông tin rất riêng tư. Thiết kế tốt là chỉ phân tích ngay trên thiết bị, không lưu và không gửi đi." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  // ---------- vòng lặp ----------
  let last = performance.now(), slow = 0, colAcc = 0;
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.src === "sim") {
      if (ST.auto && ST.t > ST.nextAt) { inject(ST.dog && Math.random() < 0.35 ? 4 : Math.floor(Math.random() * NC)); ST.nextAt = ST.t + 1.3 + Math.random() * 0.9; }
      colAcc += dt * A.SR / A.HOP;
      while (colAcc >= 1) {
        colAcc--;
        ST.buf.copyWithin(0, A.HOP);
        for (let i = 0; i < A.HOP; i++) { const v = nextSample(); ST.buf[A.N - A.HOP + i] = v; if (i % 20 === 0) { ST.wave[ST.wpos] = v; ST.wpos = (ST.wpos + 1) % ST.wave.length; } }
        processColumn(A.bandsFromPower(A.frameSpectrum(ST.buf), A.SR / A.N));
      }
    } else if (analyser) micColumn();
    renderStage();
    if (soiVisible) renderSoi();
    if (now - slow > 150) { slow = now; renderBrain(); if (soiVisible) soiLive(); }
    requestAnimationFrame(tick);
  }
  P.nav(); buildTrain(); fit(ST.train); bind(); P.srcButtons("sim"); markAuto();
  requestAnimationFrame(tick);
})();
