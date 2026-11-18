/* Hộp Kính AI · Dự án 34 · Giấy chỉ thị thông minh (màu RGB, so với bảng mẫu, cân bằng trắng) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-34");
  const HEX = ["#e8202a", "#ef4a28", "#f47f20", "#f6a51f", "#f7d117", "#dfe31f", "#8cc63f", "#3fae49", "#1fa27f", "#2d8ec9", "#3c6ab3", "#4f4fa3", "#5a3e94", "#4b2c7a"];
  const REF = HEX.map((h) => [1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16)));
  const PAPER = [246, 244, 236];
  const LIQ = [["Nước chanh", 2, "#f3f0b0"], ["Giấm ăn", 3, "#f5f1e6"], ["Nước cam", 4, "#ffb347"], ["Cà phê", 5, "#6f4e37"], ["Sữa tươi", 6.5, "#fbfaf3"], ["Nước lọc", 7, "#d9f1ff"], ["Nước biển", 8, "#b8e1f0"], ["Nước pha muối nở", 9, "#eef3f6"], ["Nước xà phòng", 10, "#e9f3ff"], ["Nước vôi trong", 12, "#f2f7f7"], ["Nước tẩy", 13, "#f6f9e8"]];
  const ST = { src: "sim", li: 5, warm: 0, bright: 1, fade: 0, wb: true, hue: false, full: true, tried: new Set(), kinds: new Set(), t: 0, dip: 1, cam: null, pick: [0.5, 0.5] };

  // ---------- màu ----------
  const mix = (a, b, t) => a.map((v, i) => v + (b[i] - v) * t);
  function stripColor(ph) { const x = Math.max(1, Math.min(14, ph)) - 1, i = Math.min(12, Math.floor(x)); return mix(REF[i], REF[i + 1], x - i); }
  const lightRGB = () => [1 + 0.15 * ST.warm, 1 - 0.2 * ST.warm, 1 - 0.65 * ST.warm].map((v) => v * ST.bright);
  const cl = (c) => c.map((v) => Math.max(0, Math.min(255, Math.round(v))));
  function capture(ph) { const L = lightRGB(), base = mix(stripColor(ph), PAPER, ST.fade); return { obs: cl(base.map((v, i) => v * L[i])), white: cl(PAPER.map((v, i) => v * L[i])) }; }
  function correct(obs, white) { return ST.wb ? cl(obs.map((v, i) => (v / Math.max(1, white[i])) * PAPER[i])) : obs; }
  function hsv(c) { const [r, g, b] = c.map((v) => v / 255), mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; let h = 0; if (d) { if (mx === r) h = ((g - b) / d) % 6; else if (mx === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; } h *= 60; if (h < 0) h += 360; return [h, mx ? d / mx : 0, mx]; }
  const refIdx = () => (ST.full ? REF.map((_, i) => i) : [0, 6, 12]);
  function dist(c, r) { if (ST.hue) { const a = hsv(c)[0], b = hsv(r)[0], d = Math.abs(a - b); return Math.min(d, 360 - d) / 180; } return Math.hypot(c[0] - r[0], c[1] - r[1], c[2] - r[2]) / 441.7; }
  function read(c) { const ids = refIdx(), ds = ids.map((i) => ({ i, d: dist(c, REF[i]) })); ds.sort((a, b) => a.d - b.d); return { ph: ds[0].i + 1, ds }; }
  const kind = (ph) => (ph < 6.5 ? "Axit" : ph <= 7.5 ? "Trung tính" : "Bazơ");
  function measure(ph) { const c = capture(ph), corr = correct(c.obs, c.white); return { ...c, corr, r: read(corr) }; }
  const accAll = () => LIQ.filter(([, ph]) => Math.abs(measure(ph).r.ph - ph) <= 1).length;

  // ---------- camera ----------
  const video = $("video"), oc = document.createElement("canvas"); oc.width = 160; oc.height = 120; const ocx = oc.getContext("2d", { willReadFrequently: true });
  function camColor() { if (video.readyState < 2) return null; ocx.save(); ocx.translate(160, 0); ocx.scale(-1, 1); ocx.drawImage(video, 0, 0, 160, 120); ocx.restore(); const x = Math.round(ST.pick[0] * 160) - 8, y = Math.round(ST.pick[1] * 120) - 8, d = ocx.getImageData(Math.max(0, x), Math.max(0, y), 16, 16).data; let r = 0, g = 0, b = 0; for (let i = 0; i < d.length; i += 4) { r += d[i]; g += d[i + 1]; b += d[i + 2]; } const n = d.length / 4; return [r / n, g / n, b / n].map(Math.round); }

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d");
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  const rgb = (c) => `rgb(${c.join(",")})`;
  const nf = (v) => String(v).replace(".", ",");
  function swatch(ctx, x, y, w, h, c, t1, t2) { ctx.fillStyle = rgb(c); D.rr(ctx, x, y, w, h, 8); ctx.fill(); ctx.strokeStyle = "rgba(255,255,255,.3)"; ctx.lineWidth = 1.5; ctx.stroke(); if (t1) lab(ctx, t1, x + w / 2, y + h + 15, "#c3c7f0", "700 11px Be Vietnam Pro, sans-serif", "center"); if (t2) lab(ctx, t2, x + w / 2, y + h + 30, "#8f96d4", "600 10px JetBrains Mono, monospace", "center"); }
  let M = null;
  function renderStage() {
    const ctx = sctx; D.labBg(ctx);
    if (ST.src === "sim") {
      const [name, ph, col] = LIQ[ST.li];
      ctx.fillStyle = "rgba(255,255,255,.08)"; D.rr(ctx, 40, 150, 180, 230, 18); ctx.fill(); ctx.fillStyle = col; ctx.globalAlpha = 0.75; D.rr(ctx, 46, 230, 168, 144, 14); ctx.fill(); ctx.globalAlpha = 1; ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 3; D.rr(ctx, 40, 150, 180, 230, 18); ctx.stroke();
      const dy = 60 + 120 * ST.dip; ctx.fillStyle = rgb(PAPER); ctx.fillRect(116, dy, 28, 190); ctx.fillStyle = rgb(cl(mix(stripColor(ph), PAPER, ST.fade))); ctx.fillRect(116, dy + 110, 28, 80);
      lab(ctx, name, 130, 410, "#fff", "800 14px Be Vietnam Pro, sans-serif", "center"); lab(ctx, "CỐC DUNG DỊCH", 130, 40, "#8f96d4", "600 11px JetBrains Mono, monospace", "center");
      const L = lightRGB(); ctx.fillStyle = "#11142e"; D.rr(ctx, 270, 50, 280, 210, 14); ctx.fill(); ctx.fillStyle = rgb(cl([60, 64, 90].map((v, i) => v * L[i]))); D.rr(ctx, 280, 60, 260, 190, 10); ctx.fill();
      ctx.fillStyle = rgb(M.white); ctx.fillRect(310, 90, 80, 130); lab(ctx, "ô trắng", 350, 238, "#0c1030", "700 11px Be Vietnam Pro, sans-serif", "center"); ctx.fillStyle = rgb(M.obs); ctx.fillRect(420, 90, 90, 130);
      lab(ctx, "ẢNH MÁY CHỤP", 410, 40, "#8f96d4", "600 11px JetBrains Mono, monospace", "center"); if (ST.warm > 0.05) { ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(530, 70, 10, 0, 7); ctx.fill(); }
    } else { ctx.save(); ctx.beginPath(); ctx.rect(20, 40, 530, 220); ctx.clip(); if (video.readyState >= 2) { ctx.translate(550, 40); ctx.scale(-1, 1); ctx.drawImage(video, 0, 0, 530, 220); } ctx.restore(); const px = 20 + ST.pick[0] * 530, py = 40 + ST.pick[1] * 220; ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.strokeRect(px - 18, py - 18, 36, 36); lab(ctx, "Bấm lên hình để chọn chỗ có giấy chỉ thị", 285, 30, "#8f96d4", "600 11px Be Vietnam Pro, sans-serif", "center"); }
    if (M) { swatch(ctx, 280, 300, 70, 50, M.obs, "giấy (chụp)", M.obs.join(" ")); if (ST.src === "sim") { swatch(ctx, 370, 300, 70, 50, M.white, "ô trắng", M.white.join(" ")); swatch(ctx, 460, 300, 70, 50, M.corr, ST.wb ? "sau cân bằng" : "không cân bằng", M.corr.join(" ")); } }
    const ids = refIdx(); HEX.forEach((h, i) => { const col = i < 7 ? 0 : 1, row = i % 7, x = 600 + col * 130, y = 66 + row * 52, on = ids.includes(i), best = M && M.r.ph === i + 1; ctx.globalAlpha = on ? 1 : 0.18; ctx.fillStyle = h; D.rr(ctx, x, y, 56, 38, 8); ctx.fill(); ctx.globalAlpha = 1; if (best) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 3.5; D.rr(ctx, x - 3, y - 3, 62, 44, 10); ctx.stroke(); } lab(ctx, "pH " + (i + 1), x + 64, y + 24, best ? "#fff" : on ? "#c3c7f0" : "#4a5088", (best ? "800 " : "600 ") + "13px Be Vietnam Pro, sans-serif"); });
    lab(ctx, "BẢNG MÀU MẪU", 600, 52, "#8f96d4", "600 11px JetBrains Mono, monospace");
    if (M) lab(ctx, `Máy đọc: pH ${M.r.ph} · ${kind(M.r.ph)}`, 285, 412, "#ffc34d", "800 18px Be Vietnam Pro, sans-serif");
  }
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function update() {
    if (ST.src === "sim") M = measure(LIQ[ST.li][1]); else { const c = camColor(); if (!c) return; M = { obs: c, white: PAPER, corr: c, r: read(c) }; }
    const ph = ST.src === "sim" ? LIQ[ST.li][1] : null, ok = ph == null || Math.abs(M.r.ph - ph) <= 1;
    $("bPH").textContent = "pH " + M.r.ph; $("bPH").style.color = ok ? "#5ef2d6" : "#ff8f6b"; $("bKind").textContent = kind(M.r.ph);
    const hh = hsv(M.corr); $("bRGB").innerHTML = `R = ${M.corr[0]} · G = ${M.corr[1]} · B = ${M.corr[2]}<br>Sắc màu ${Math.round(hh[0])}° · đậm ${Math.round(hh[1] * 100)}%<br>Gần nhất: pH ${M.r.ds[0].i + 1} (cách ${M.r.ds[0].d.toFixed(2).replace(".", ",")})`;
    $("bTrue").textContent = ph == null ? "?" : "pH " + nf(ph); const a = accAll(); $("bAcc").textContent = `${a}/11`; $("bAcc").style.color = a >= 10 ? "#5ef2d6" : a >= 7 ? "#ffc34d" : "#ff8f6b";
    if (ST.src === "sim") say(`<b>${LIQ[ST.li][0]}</b> có pH thật khoảng <b>${nf(ph)}</b>. Máy đọc <b>pH ${M.r.ph}</b> (${kind(M.r.ph).toLowerCase()})${ok ? "." : ': <span style="color:var(--coral)">sai!</span>'}`); else say(`Màu ở ô vàng: (${M.corr.join(", ")}). Máy đọc <b>pH ${M.r.ph}</b>. Ở chế độ camera không có ô trắng để cân bằng, nên hãy chụp dưới ánh sáng trắng.`);
    renderChart();
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 46, B = 30, T = 16; ctx.clearRect(0, 0, W, H); if (!M) return;
    const bw = (W - L - 10) / 14, Y = (v) => T + (1 - v) * (H - T - B), ids = refIdx();
    ctx.font = "11px JetBrains Mono, monospace"; [0, 0.5, 1].forEach((v) => { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - 10, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(v * 100) + "%", 6, Y(v) + 4); });
    HEX.forEach((h, i) => { const x = L + i * bw, on = ids.includes(i); ctx.fillStyle = TH.text; ctx.fillText("pH " + (i + 1), x + bw / 2 - 16, H - 10); if (!on) return; const sim = Math.max(0, 1 - dist(M.corr, REF[i]) * 1.6), best = M.r.ph === i + 1; ctx.fillStyle = h; D.rr(ctx, x + 6, Y(sim), bw - 12, H - B - Y(sim), 5); ctx.fill(); if (best) { ctx.strokeStyle = TH.ink; ctx.lineWidth = 3; ctx.stroke(); } });
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Chất chỉ thị đổi màu", e: "flask", d: "Giấy chỉ thị chứa chất <b>đổi màu theo pH</b>: axit mạnh làm giấy đỏ, trung tính xanh lá, bazơ mạnh xanh tím. Bảng màu mẫu cho biết màu nào ứng với pH nào." },
    { t: "Màu thành ba số", e: "camera", d: "Camera đo mỗi điểm ảnh bằng ba số <b>R, G, B</b> (đỏ, xanh lá, xanh dương) từ 0 đến 255. Máy lấy trung bình vùng giấy chỉ thị." },
    { t: "Ánh sáng nhân vào", e: "sun", d: "Màu chụp được = màu giấy <b>nhân</b> màu đèn. Đèn vàng có nhiều đỏ, ít xanh dương, nên mọi màu đều ngả vàng: ba số thay đổi dù giấy không đổi." },
    { t: "Cân bằng trắng", e: "sliders", d: "Ô giấy trắng chụp cùng lúc cho biết màu đèn. Máy <b>chia</b> ba số của giấy chỉ thị cho ba số của ô trắng, rồi nhân với màu trắng chuẩn: màu trở về như dưới đèn trắng." },
    { t: "So với bảng mẫu", e: "scan", d: "Máy tính <b>khoảng cách</b> giữa ba số của giấy và ba số của từng màu mẫu (giống công thức Pythagore, nhưng với 3 số). Màu mẫu gần nhất cho ra pH." },
    { t: "Kết luận, an toàn", e: "shield", d: "pH &lt; 7: <b>axit</b>; pH = 7: <b>trung tính</b>; pH &gt; 7: <b>bazơ</b>. Khi làm thí nghiệm thật: không nếm, không ngửi trực tiếp, đeo găng tay và kính." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  function renderSoi() {
    const ctx = octx, s = soiStep, ph = ST.src === "sim" ? LIQ[ST.li][1] : 7, m = measure(ph); D.labBg(ctx);
    if (s === 0) { HEX.forEach((h, i) => { ctx.fillStyle = h; D.rr(ctx, 20 + i * 43, 120, 38, 120, 8); ctx.fill(); lab(ctx, String(i + 1), 39 + i * 43, 262, "#fff", "800 13px JetBrains Mono, monospace", "center"); }); lab(ctx, "axit", 30, 100, "#ff8f6b", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, "trung tính", 300, 100, "#5ef2d6", "800 15px Be Vietnam Pro, sans-serif", "center"); lab(ctx, "bazơ", 600, 100, "#a99dff", "800 15px Be Vietnam Pro, sans-serif", "right"); LIQ.forEach(([n, p], k) => lab(ctx, `${n} ~ ${nf(p)}`, 20 + (k % 3) * 205, 310 + Math.floor(k / 3) * 26, "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif")); return; }
    if (s === 1) { swatch(ctx, 40, 60, 160, 160, m.obs); const n = 6; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { ctx.strokeStyle = "rgba(0,0,0,.15)"; ctx.strokeRect(40 + i * 160 / n, 60 + j * 160 / n, 160 / n, 160 / n); } [["R", m.obs[0], "#ff5d5d"], ["G", m.obs[1], "#3fe07a"], ["B", m.obs[2], "#5a8cff"]].forEach(([k, v, c], i) => { lab(ctx, `${k} = ${v}`, 260, 100 + i * 56, c, "800 26px JetBrains Mono, monospace"); ctx.fillStyle = "#232866"; ctx.fillRect(420, 80 + i * 56, 180, 22); ctx.fillStyle = c; ctx.fillRect(420, 80 + i * 56, (v / 255) * 180, 22); }); return; }
    if (s === 2) { const save = ST.warm; ST.warm = 0; const a = measure(ph); ST.warm = 1; const b = measure(ph); ST.warm = save; swatch(ctx, 60, 80, 200, 150, a.obs, "dưới đèn trắng", a.obs.join(", ")); swatch(ctx, 380, 80, 200, 150, b.obs, "dưới đèn vàng", b.obs.join(", ")); lab(ctx, "Cùng một tờ giấy!", 320, 320, "#ffc34d", "800 20px Be Vietnam Pro, sans-serif", "center"); return; }
    if (s === 3) { swatch(ctx, 30, 60, 120, 100, m.obs, "giấy chụp", m.obs.join(", ")); swatch(ctx, 180, 60, 120, 100, m.white, "ô trắng", m.white.join(", ")); const c2 = cl(m.obs.map((v, i) => (v / Math.max(1, m.white[i])) * PAPER[i])); swatch(ctx, 470, 60, 120, 100, c2, "sau cân bằng", c2.join(", ")); lab(ctx, "→", 380, 120, "#fff", "800 30px Be Vietnam Pro, sans-serif", "center"); ["R", "G", "B"].forEach((k, i) => lab(ctx, `${k}: ${m.obs[i]} ÷ ${m.white[i]} × ${PAPER[i]} = ${c2[i]}`, 40, 260 + i * 34, "#fff", "700 15px JetBrains Mono, monospace")); return; }
    if (s === 4) { m.r.ds.slice(0, 6).forEach((q, k) => { const y = 50 + k * 64; swatch(ctx, 30, y, 60, 46, REF[q.i]); lab(ctx, `pH ${q.i + 1}`, 104, y + 22, "#fff", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, `khoảng cách ${q.d.toFixed(3).replace(".", ",")}`, 104, y + 42, k ? "#c3c7f0" : "#5ef2d6", "600 12px JetBrains Mono, monospace"); }); swatch(ctx, 420, 120, 160, 140, m.corr, "màu giấy (đã xử lý)"); return; }
    lab(ctx, `pH ${m.r.ph}: ${kind(m.r.ph).toUpperCase()}`, 320, 120, m.r.ph < 6.5 ? "#ff8f6b" : m.r.ph <= 7.5 ? "#5ef2d6" : "#a99dff", "800 34px Be Vietnam Pro, sans-serif", "center");
    ["Không nếm, không ngửi trực tiếp hóa chất", "Đeo găng tay và kính bảo hộ", "Nước tẩy, nước vôi có thể gây bỏng: rửa ngay bằng nhiều nước nếu dính vào da", "Làm thí nghiệm khi có thầy cô hoặc người lớn"].forEach((t, i) => lab(ctx, "• " + t, 40, 220 + i * 36, "#fff", "600 14px Be Vietnam Pro, sans-serif"));
  }
  function soiLive() { const el = $("soiLive"); if (!M) return; el.innerHTML = `Màu <span class="hl">(${M.corr.join(", ")})</span> → <span class="w">pH ${M.r.ph}</span>`; }

  // ---------- điều khiển ----------
  async function useCam() { try { await P.camera(video); ST.src = "cam"; P.srcButtons("cam"); guide("Camera đã bật. Đưa một tờ giấy chỉ thị (hoặc vật có màu) vào giữa khung, <b>bấm lên hình</b> để chọn chỗ đo. Nên chụp dưới ánh sáng trắng."); } catch (e) { P.msg($("msg"), P.FAIL, "alert", 6000); } }
  function setSim() { if (video.srcObject) { video.srcObject.getTracks().forEach((t) => t.stop()); video.srcObject = null; } ST.src = "sim"; P.srcButtons("sim"); update(); }
  let setWarm, setBright, setFade;
  function dip(i) { ST.li = i; ST.dip = 0; ST.tried.add(i); if (ST.tried.size >= 5) prog.done("dip"); const ph = LIQ[i][1]; ST.kinds.add(kind(ph)); if (ST.kinds.size >= 3) prog.done("acidbase"); document.querySelectorAll("#liquids button").forEach((b, k) => b.classList.toggle("ghost", k !== i)); update(); }
  function bind() {
    $("liquids").innerHTML = LIQ.map(([n], i) => `<button class="btn small ghost" data-i="${i}">${n}</button>`).join("");
    $("liquids").querySelectorAll("button").forEach((b) => (b.onclick = () => dip(+b.dataset.i)));
    const lt = () => { prog.done("light"); update(); };
    setWarm = P.range("warm", () => ST.warm, (v) => (ST.warm = v), (v) => (v < 0.05 ? "trắng" : Math.round(v * 100) + "% vàng"), lt);
    setBright = P.range("bright", () => ST.bright, (v) => (ST.bright = v), (v) => Math.round(v * 100) + "%", lt);
    setFade = P.range("fade", () => ST.fade, (v) => (ST.fade = v), (v) => Math.round(v * 100) + "%", update);
    $("optWB").onchange = (e) => { ST.wb = e.target.checked; update(); }; $("optHue").onchange = (e) => { ST.hue = e.target.checked; update(); }; $("optFull").onchange = (e) => { ST.full = e.target.checked; update(); };
    $("srcSim").onclick = setSim; $("srcCam").onclick = useCam;
    stage.addEventListener("click", (e) => { if (ST.src !== "cam") return; const r = stage.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 880, y = ((e.clientY - r.top) / r.height) * 440; if (x < 20 || x > 550 || y < 40 || y > 260) return; ST.pick = [(x - 20) / 530, (y - 40) / 220]; });
    const clear = () => { ST.warm = 0; setWarm(); ST.bright = 1; setBright(); ST.fade = 0; setFade(); ST.wb = true; $("optWB").checked = true; ST.hue = false; $("optHue").checked = false; ST.full = true; $("optFull").checked = true; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    const LI = (n) => LIQ.findIndex((l) => l[0] === n);
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; if (ST.src !== "sim") setSim(); clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "warm") { ST.warm = 1; setWarm(); ST.bright = 0.85; setBright(); ST.wb = false; $("optWB").checked = false; dip(LI(BRK.warm)); guide(`Dưới đèn vàng, không cân bằng trắng: <b>${LIQ[ST.li][0].toLowerCase()}</b> (pH ${nf(LIQ[ST.li][1])}) bị đọc thành <b>pH ${M.r.ph}</b>. Cả bộ chỉ đọc đúng ${accAll()}/11. Bật <b>Cân bằng trắng</b>.`); }
      if (k === "fade") { ST.fade = 0.7; setFade(); dip(LI(BRK.fade)); guide(`Giấy nhạt màu: <b>${LIQ[ST.li][0].toLowerCase()}</b> (pH ${nf(LIQ[ST.li][1])}) bị đọc thành <b>pH ${M.r.ph}</b>. Bật <b>Chỉ so sắc màu, bỏ qua đậm nhạt</b>.`); }
      if (k === "coarse") { ST.full = false; $("optFull").checked = false; dip(LI("Nước cam")); guide(`Chỉ có 3 màu mẫu: nước cam (pH 4) bị đọc thành <b>pH ${M.r.ph}</b>. Bật lại <b>Dùng đủ 14 màu mẫu</b>.`); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); update(); guide("Mọi sự cố đã tắt: đèn trắng, cân bằng trắng bật, đủ 14 màu mẫu."); };
  }
  const BRK = { warm: "Nước xà phòng", fade: "Giấm ăn" };

  const QUIZ = [
    { q: "Giấy chỉ thị chuyển màu đỏ khi nhúng vào một dung dịch. Dung dịch đó có pH thế nào?", o: ["pH lớn hơn 7, là bazơ", "pH nhỏ hơn 7, là axit", "pH bằng 7, trung tính", "Không xác định được"], a: 1, e: "Màu đỏ ứng với pH thấp: dung dịch có tính axit." },
    { q: "Camera đọc màu của giấy chỉ thị thành gì?", o: ["Một chữ cái", "Ba số R, G, B cho độ sáng đỏ, xanh lá, xanh dương", "Một bức tranh", "Nhiệt độ của giấy"], a: 1, e: "Mỗi màu được biểu diễn bằng ba con số R, G, B." },
    { q: "Vì sao chụp dưới đèn vàng làm máy đọc sai pH?", o: ["Vì đèn vàng làm giấy đổi pH", "Vì màu chụp được bị nhân với màu đèn, ba số R, G, B thay đổi", "Vì máy không thích màu vàng", "Vì giấy bị ướt"], a: 1, e: "Ánh đèn làm thay đổi màu ghi lại, dù màu của giấy không đổi." },
    { q: "Ô giấy trắng đặt cạnh giấy chỉ thị dùng để làm gì?", o: ["Để trang trí", "Để máy biết màu của đèn và cân bằng trắng", "Để thấm dung dịch thừa", "Để ghi tên"], a: 1, e: "Ô trắng cho máy biết đèn làm lệch màu bao nhiêu để trừ bớt phần đó." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now(), acc = 0;
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; ST.dip = Math.min(1, ST.dip + dt * 2.5); if (ST.src === "cam") { acc += dt; if (acc > 0.2) { acc = 0; update(); } } renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); P.srcButtons("sim"); dip(5); guide("Bấm một dung dịch để nhúng giấy chỉ thị. Máy chụp ảnh tờ giấy, đọc <b>ba số màu</b> rồi so với bảng màu mẫu bên phải.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka34 = { ST, measure, accAll, LIQ, read, capture, correct };
  requestAnimationFrame(tick);
})();
