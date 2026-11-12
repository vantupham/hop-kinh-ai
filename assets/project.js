/* Hộp Kính AI · thư viện dùng chung cho mọi trang dự án
   Cần nạp sau assets/ui.js. Cung cấp: HKA.P = { nav, progress, quiz, pipeline, vision, camera, msg, draw, theme, ... } */
(function () {
  const $ = (id) => document.getElementById(id);
  const P = { $ };

  // ---------- thanh 9 bước: tô sáng mục đang xem ----------
  P.nav = function () {
    const links = [...document.querySelectorAll(".steps a")];
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("section.sec").forEach((s) => io.observe(s));
    document.querySelectorAll(".lvl[data-stars]").forEach((el) => el.insertAdjacentHTML("afterbegin", HKA.stars(+el.dataset.stars)));
  };
  P.visible = function (el, cb) { new IntersectionObserver((es) => cb(es[0].isIntersecting)).observe(el); };

  // ---------- tiến độ + danh sách nhiệm vụ ----------
  P.progress = function (key) {
    let prog = {};
    try { prog = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}
    const items = [...document.querySelectorAll("#checklist li")];
    function render() {
      items.forEach((li) => li.classList.toggle("done", !!prog[li.dataset.k]));
      const n = items.filter((li) => prog[li.dataset.k]).length;
      const chip = $("progressChip"); if (chip) chip.innerHTML = HKA.icon("checkCircle") + `${n}/${items.length}`;
    }
    render();
    return {
      done(k) { if (prog[k]) return; prog[k] = 1; try { localStorage.setItem(key, JSON.stringify(prog)); } catch (e) {} render(); },
      has(k) { return !!prog[k]; }
    };
  };

  // ---------- bài kiểm tra ----------
  P.quiz = function (boxId, QUIZ, onAll) {
    const box = $(boxId), ok = new Set();
    box.innerHTML = QUIZ.map((x, i) => `<div class="q" data-i="${i}"><h3><span class="qn">${String(i + 1).padStart(2, "0")}</span><span>${x.q}</span></h3><div class="opts">${x.o.map((o, j) => `<button data-j="${j}">${o}</button>`).join("")}</div><div class="exp" hidden></div></div>`).join("");
    box.querySelectorAll(".q").forEach((q) => {
      const i = +q.dataset.i;
      q.querySelectorAll("button").forEach((b) => b.addEventListener("click", () => {
        const right = +b.dataset.j === QUIZ[i].a;
        q.querySelectorAll("button").forEach((x) => x.classList.remove("right", "wrong"));
        b.classList.add(right ? "right" : "wrong");
        const e = q.querySelector(".exp"); e.hidden = false; e.className = "exp " + (right ? "ok" : "no");
        e.innerHTML = HKA.icon(right ? "checkCircle" : "help") + "<span>" + (right ? "<b>Chính xác!</b> " + QUIZ[i].e : "<b>Chưa đúng, thử lại nhé.</b>") + "</span>";
        right ? ok.add(i) : ok.delete(i);
        if (ok.size === QUIZ.length) onAll();
      }));
    });
  };

  // ---------- sơ đồ luồng 6 bước + phần giải thích ----------
  P.pipeline = function (steps, onChange) {
    const svg = $("pipeline"); let h = "", cur = 0;
    const N = steps.length, W = 158, gap = (1100 - N * W) / (N - 1);
    for (let i = 0; i < N - 1; i++) { const x1 = i * (W + gap) + W, x2 = x1 + gap; h += `<line x1="${x1}" y1="62" x2="${x2}" y2="62" style="stroke:var(--line-strong)" stroke-width="2"/><line class="flow" x1="${x1}" y1="62" x2="${x2}" y2="62" style="stroke:var(--violet)" stroke-width="2.5"/>`; }
    steps.forEach((s, i) => {
      const x = i * (W + gap);
      h += `<g class="node" data-i="${i}" role="tab" tabindex="0"><rect x="${x}" y="18" width="${W}" height="88" rx="14" stroke-width="1.5"/>` +
        `<text x="${x + 14}" y="38" font-size="11" font-weight="700" class="t-mono nlab" aria-hidden="true">${String(i + 1).padStart(2, "0")}</text>` +
        `<svg x="${x + W / 2 - 13}" y="30" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="nic">${HKA.icon(s.e).replace(/^<svg[^>]*>|<\/svg>$/g, "")}</svg>` +
        `<text x="${x + W / 2}" y="84" text-anchor="middle" font-weight="700" font-size="14" class="ntx">${s.t}</text></g>`;
    });
    svg.innerHTML = h;
    function set(i) {
      cur = Math.max(0, Math.min(N - 1, i));
      svg.querySelectorAll(".node").forEach((n, k) => {
        const on = k === cur, past = k < cur, r = n.querySelector("rect");
        r.style.fill = on ? "var(--violet)" : past ? "var(--violet-soft)" : "var(--surface-solid)";
        r.style.stroke = on ? "var(--violet)" : past ? "color-mix(in srgb,var(--violet) 40%,transparent)" : "var(--line-strong)";
        n.querySelector(".ntx").style.fill = on ? "#fff" : "var(--text)";
        n.querySelector(".nlab").style.fill = on ? "rgba(255,255,255,.7)" : "var(--muted)";
        n.querySelector(".nic").style.stroke = on ? "#fff" : "var(--violet)";
      });
      $("soiChip").textContent = `BƯỚC ${cur + 1}/${N}`;
      $("soiTitle").innerHTML = `<span class="ico-box sm">${HKA.icon(steps[cur].e)}</span>` + steps[cur].t;
      $("soiText").innerHTML = "<p>" + steps[cur].d + "</p>";
      $("soiPrev").disabled = cur === 0; $("soiNext").disabled = cur === N - 1;
      onChange && onChange(cur);
    }
    svg.querySelectorAll(".node").forEach((n) => {
      const go = () => set(+n.dataset.i);
      n.addEventListener("click", go); n.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); } });
    });
    $("soiPrev").onclick = () => set(cur - 1); $("soiNext").onclick = () => set(cur + 1);
    set(0);
    return { set, get: () => cur };
  };

  // ---------- thông báo trên màn hình sân khấu ----------
  P.msg = function (el, t, ic, ms) {
    if (!t) { el.hidden = true; return; }
    el.hidden = false; el.innerHTML = HKA.icon(ic || "alert", ic === "loader" ? "spin" : "") + "<span>" + t + "</span>";
    if (ms) setTimeout(() => (el.hidden = true), ms);
  };
  P.FAIL = "Trên trang GitHub Pages của dự án, camera sẽ hoạt động khi em bấm <b>Cho phép</b>. Bây giờ em hãy dùng chế độ <b>Mô phỏng</b> nhé.";

  // ---------- MediaPipe (tải khi cần) ----------
  const MP = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
  const MODELS = {
    pose: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
    hand: "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
    face: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
    seg: "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_segmenter/float16/latest/selfie_segmenter.tflite"
  };
  const cache = {};
  P.vision = async function (kind) {
    if (cache[kind]) return cache[kind];
    const mp = await import(MP + "/vision_bundle.mjs");
    const fs = await mp.FilesetResolver.forVisionTasks(MP + "/wasm");
    const base = { baseOptions: { modelAssetPath: MODELS[kind], delegate: "GPU" }, runningMode: "VIDEO" };
    if (kind === "pose") cache[kind] = await mp.PoseLandmarker.createFromOptions(fs, { ...base, numPoses: 1 });
    if (kind === "hand") cache[kind] = await mp.HandLandmarker.createFromOptions(fs, { ...base, numHands: 1 });
    if (kind === "seg") cache[kind] = await mp.ImageSegmenter.createFromOptions(fs, { ...base, outputConfidenceMasks: true, outputCategoryMask: false });
    if (kind === "face") cache[kind] = await mp.FaceLandmarker.createFromOptions(fs, { ...base, numFaces: 1, outputFaceBlendshapes: true });
    return cache[kind];
  };
  P.camera = async function (video) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("trình duyệt hoặc trang xem trước này không cho dùng camera");
    const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480, facingMode: "user" } });
    video.srcObject = stream; await video.play();
    return stream;
  };

  // ---------- màu theo giao diện (cho canvas) ----------
  P.TH = {};
  function readTheme() { const c = HKA.css; Object.assign(P.TH, { grid: c("--line"), text: c("--muted"), ink: c("--text"), violet: c("--violet"), mint: c("--mint"), coral: c("--coral"), amber: c("--amber"), rose: c("--rose"), dark: HKA.theme() === "dark" }); }
  readTheme(); window.addEventListener("hka:theme", () => requestAnimationFrame(readTheme));

  // ---------- vẽ canvas ----------
  const D = {};
  D.rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
  D.pill = (ctx, t, x, y, bg, fs) => {
    fs = fs || 14; ctx.font = `700 ${fs}px JetBrains Mono, monospace`;
    const w = ctx.measureText(t).width + 16, h = fs + 12;
    ctx.fillStyle = bg; D.rr(ctx, x - w / 2, y - h / 2, w, h, h / 2); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(t, x, y + 1);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  };
  D.arrow = (ctx, a, b, col, w) => {
    const t = Math.atan2(b.y - a.y, b.x - a.x); w = w || 4;
    ctx.strokeStyle = col; ctx.fillStyle = col; ctx.lineWidth = w; ctx.lineCap = "round";
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x - 10 * Math.cos(t), b.y - 10 * Math.sin(t)); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(b.x, b.y); ctx.lineTo(b.x - 16 * Math.cos(t - 0.4), b.y - 16 * Math.sin(t - 0.4)); ctx.lineTo(b.x - 16 * Math.cos(t + 0.4), b.y - 16 * Math.sin(t + 0.4)); ctx.closePath(); ctx.fill();
  };
  D.labBg = (ctx) => {
    const W = ctx.canvas.width, H = ctx.canvas.height;
    ctx.fillStyle = "#121633"; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#20255a"; ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  };
  D.room = (ctx, dark) => {
    const W = ctx.canvas.width, H = ctx.canvas.height, g = ctx.createLinearGradient(0, 0, 0, H);
    if (dark) { g.addColorStop(0, "#1a1d45"); g.addColorStop(1, "#262a5e"); } else { g.addColorStop(0, "#ece9f8"); g.addColorStop(1, "#d8d1ef"); }
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = dark ? "rgba(140,150,255,.06)" : "rgba(255,255,255,.4)";
    for (let i = 0; i < 6; i++) ctx.fillRect(40 + i * 100, 50, 60, 130);
  };
  D.visCol = (v) => v > 0.75 ? "#5ef2d6" : v > 0.5 ? "#ffbf2e" : "#ff6b4a";
  P.draw = D;

  // ---------- biểu đồ đường theo thời gian (dùng chung) ----------
  // series: [{data:[{t,v}], color, width, alpha, dash}], opts: {min,max,span,now,ticks,thresholds:[{v,label,color}],marks:[{t,v,color,label}]}
  P.lineChart = function (canvas, series, o) {
    const ctx = canvas.getContext("2d"), W = canvas.width, H = canvas.height, L = 46, R = 14, T = 12, B = 26, TH = P.TH;
    ctx.clearRect(0, 0, W, H);
    const X = (t) => L + (1 - (o.now - t) / o.span) * (W - L - R), Y = (v) => T + (1 - (v - o.min) / (o.max - o.min)) * (H - T - B);
    ctx.font = "11px JetBrains Mono, monospace";
    for (const v of o.ticks) { ctx.strokeStyle = TH.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(o.fmt ? o.fmt(v) : v, 4, Y(v) + 4); }
    ctx.fillStyle = TH.text; ctx.fillText(`−${o.span} giây`, L, H - 6); ctx.fillText("bây giờ", W - R - 50, H - 6);
    (o.bands || []).forEach((b) => { ctx.globalAlpha = TH.dark ? .1 : .07; ctx.fillStyle = b.color; ctx.fillRect(L, Y(b.to), W - L - R, Y(b.from) - Y(b.to)); ctx.globalAlpha = 1; });
    ctx.setLineDash([6, 5]);
    (o.thresholds || []).forEach((th) => { ctx.strokeStyle = th.color || TH.coral; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(L, Y(th.v)); ctx.lineTo(W - R, Y(th.v)); ctx.stroke(); ctx.fillStyle = th.color || TH.coral; ctx.fillText(th.label, W - R - ctx.measureText(th.label).width - 4, Y(th.v) - 5); });
    ctx.setLineDash([]);
    for (const s of series) {
      ctx.strokeStyle = s.color; ctx.lineWidth = s.width || 2; ctx.globalAlpha = s.alpha == null ? 1 : s.alpha; if (s.dash) ctx.setLineDash(s.dash);
      ctx.beginPath(); let on = false;
      for (const p of s.data) { if (p.v == null || isNaN(p.v) || p.t < o.now - o.span) { on = false; continue; } const x = X(p.t), y = Y(Math.max(o.min, Math.min(o.max, p.v))); on ? ctx.lineTo(x, y) : ctx.moveTo(x, y); on = true; }
      ctx.stroke(); ctx.globalAlpha = 1; ctx.setLineDash([]);
    }
    (o.marks || []).forEach((m) => { if (m.t < o.now - o.span) return; ctx.fillStyle = m.color || TH.rose; ctx.beginPath(); ctx.arc(X(m.t), Y(m.v), 6, 0, 7); ctx.fill(); if (m.label) { ctx.fillStyle = "#fff"; ctx.font = "700 9px JetBrains Mono"; ctx.fillText(m.label, X(m.t) - 6, Y(m.v) + 3); ctx.font = "11px JetBrains Mono, monospace"; } });
  };

  // ---------- điều khiển chung ----------
  P.range = function (id, get, set, fmt, cb) {
    const el = $(id), out = $(id + "V");
    el.value = get(); if (out) out.textContent = fmt(get());
    el.addEventListener("input", () => { set(+el.value); if (out) out.textContent = fmt(+el.value); cb && cb(); });
    return () => { el.value = get(); if (out) out.textContent = fmt(get()); };
  };
  P.srcButtons = function (src) {
    for (const [id, k] of [["srcSim", "sim"], ["srcCam", "cam"]]) { const b = $(id); if (!b) continue; b.setAttribute("aria-pressed", src === k); b.classList.toggle("ghost", src !== k); }
    const tag = $("srcTag"); if (tag) tag.textContent = src === "sim" ? "MÔ PHỎNG" : "CAMERA";
    document.querySelectorAll(".sim-only").forEach((e) => (e.hidden = src !== "sim"));
  };

  // ---------- học máy: hồi quy softmax (lớp cuối của mạng) ----------
  P.Softmax = function (nIn, nOut) {
    const m = { nIn, nOut, W: Array.from({ length: nOut }, () => new Float64Array(nIn)), b: new Float64Array(nOut), mu: null, sd: null };
    m.fitScaler = (X) => {
      m.mu = new Float64Array(nIn); m.sd = new Float64Array(nIn);
      X.forEach((x) => x.forEach((v, j) => (m.mu[j] += v / X.length)));
      X.forEach((x) => x.forEach((v, j) => (m.sd[j] += (v - m.mu[j]) ** 2 / X.length)));
      for (let j = 0; j < nIn; j++) m.sd[j] = Math.sqrt(m.sd[j]) || 1;
    };
    const sc = (x) => (m.mu ? x.map((v, j) => (v - m.mu[j]) / m.sd[j]) : x);
    m.logits = (x) => { const z = sc(x); return m.W.map((w, k) => w.reduce((s, wj, j) => s + wj * z[j], m.b[k])); };
    m.predict = (x) => { const l = m.logits(x), mx = Math.max(...l), e = l.map((v) => Math.exp(v - mx)), s = e.reduce((a, b) => a + b, 0); return e.map((v) => v / s); };
    m.epoch = (X, Y, lr, l2) => {
      let loss = 0; const idx = X.map((_, i) => i).sort(() => Math.random() - 0.5);
      for (const i of idx) {
        const z = sc(X[i]), p = m.predict(X[i]); loss += -Math.log(Math.max(1e-9, p[Y[i]]));
        for (let k = 0; k < nOut; k++) { const g = p[k] - (k === Y[i] ? 1 : 0); for (let j = 0; j < nIn; j++) m.W[k][j] -= lr * (g * z[j] + (l2 || 0) * m.W[k][j]); m.b[k] -= lr * g; }
      }
      return loss / X.length;
    };
    m.loss = (X, Y) => X.reduce((s, x, i) => s - Math.log(Math.max(1e-9, m.predict(x)[Y[i]])), 0) / (X.length || 1);
    m.acc = (X, Y) => X.reduce((s, x, i) => { const p = m.predict(x); return s + (p.indexOf(Math.max(...p)) === Y[i] ? 1 : 0); }, 0) / (X.length || 1);
    return m;
  };
  P.argmax = (a) => a.indexOf(Math.max(...a));
  // ma trận nhầm lẫn (HTML, nền tối)
  P.confusion = function (labels, colors, M) {
    const n = labels.length, rowSum = M.map((r) => r.reduce((a, b) => a + b, 0) || 1);
    let h = `<table class="coords conf-m"><tr><td></td>${labels.map((l, j) => `<th scope="col" style="color:${colors[j]}">${l}</th>`).join("")}</tr>`;
    for (let i = 0; i < n; i++) h += `<tr><th scope="row" style="color:${colors[i]}">${labels[i]}</th>${M[i].map((v, j) => `<td style="background:${i === j ? "rgba(94,242,214," : "rgba(255,125,95,"}${(v / rowSum[i] * .6).toFixed(2)})">${v}</td>`).join("")}</tr>`;
    return h + "</table>";
  };
  P.gauss = () => { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  P.rng = function (seed) { let s = seed >>> 0 || 1; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };

  HKA.P = P;
})();
