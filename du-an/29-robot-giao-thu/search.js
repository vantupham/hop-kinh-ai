/* Hộp Kính AI · Dự án 29 · Robot giao thư (tìm kiếm tuần tự, tìm kiếm nhị phân, dữ liệu đã sắp xếp) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-29");
  const NS = [8, 16, 32, 64, 128, 256, 512, 1000];
  const ST = { ni: 2, sorted: true, bug: false, mode: "user", rooms: [], target: 0, run: null, user: { opened: new Set(), found: false }, results: {}, t: 0, history: [] };
  const N = () => NS[ST.ni];

  function newHall() {
    const n = N(), r = []; let v = 101; for (let i = 0; i < n; i++) { r.push(v); v += 1 + (Math.random() < 0.35 ? 1 : 0); }
    if (!ST.sorted) for (let i = n - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    ST.rooms = r; newLetter();
  }
  function newLetter(idx) { const n = N(); ST.target = ST.rooms[idx == null ? Math.floor(Math.random() * n) : idx]; ST.run = null; ST.user = { opened: new Set(), found: false }; ST.results = {}; update(); }

  // ---------- hai thuật toán (ghi lại từng bước để vẽ) ----------
  function seqTrace() { const s = []; for (let i = 0; i < ST.rooms.length; i++) { s.push({ i, lo: i, hi: ST.rooms.length - 1 }); if (ST.rooms[i] === ST.target) return { steps: s, found: i }; } return { steps: s, found: -1 }; }
  function binTrace() {
    const s = []; let lo = 0, hi = ST.rooms.length - 1;
    while (lo <= hi && s.length < 40) { const mid = (lo + hi) >> 1; s.push({ i: mid, lo, hi }); const v = ST.rooms[mid]; if (v === ST.target) return { steps: s, found: mid }; if (v < ST.target) lo = ST.bug ? mid : mid + 1; else hi = ST.bug ? mid : mid - 1; }
    return { steps: s, found: -1, loop: s.length >= 40 };
  }
  function start(mode) { ST.run = { mode, tr: mode === "seq" ? seqTrace() : binTrace(), k: 0, acc: 0 }; }
  const worstSeq = (n) => n, worstBin = (n) => Math.floor(Math.log2(n)) + 1;

  // ---------- vẽ ----------
  const stage = $("stage"), sctx = stage.getContext("2d"), HX = 30, HW = 820, DY = 150, DH = 120;
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  const dx = (i) => HX + ((i + 0.5) / N()) * HW;
  function opened() {
    if (ST.mode === "user") return { set: ST.user.opened, cur: null, lo: 0, hi: N() - 1 };
    if (!ST.run) return { set: new Set(), cur: null, lo: 0, hi: N() - 1 };
    const st = ST.run.tr.steps.slice(0, ST.run.k + 1), c = st[st.length - 1]; return { set: new Set(st.map((x) => x.i)), cur: c ? c.i : null, lo: c ? c.lo : 0, hi: c ? c.hi : N() - 1 };
  }
  function renderStage() {
    const ctx = sctx, n = N(), w = HW / n, O = opened(); D.labBg(ctx);
    ctx.fillStyle = "#2a2f6e"; ctx.fillRect(HX - 10, DY - 20, HW + 20, DH + 70); ctx.fillStyle = "#1d2152"; ctx.fillRect(HX - 10, DY + DH, HW + 20, 50);
    if (ST.mode !== "user" && ST.run) { ctx.fillStyle = "rgba(255,195,77,.12)"; ctx.fillRect(HX + O.lo * w, DY - 16, (O.hi - O.lo + 1) * w, DH + 12); }
    for (let i = 0; i < n; i++) {
      const x = HX + i * w, isOpen = O.set.has(i), hit = isOpen && ST.rooms[i] === ST.target, out = ST.mode !== "user" && ST.run && (i < O.lo || i > O.hi);
      ctx.fillStyle = hit ? "#3fe0c5" : isOpen ? "#f5f4ff" : out ? "#3a3f7a" : "#7c6bff"; ctx.globalAlpha = out ? 0.45 : 1; D.rr(ctx, x + Math.min(2, w * 0.1), DY, Math.max(0.8, w - Math.min(4, w * 0.2)), DH, Math.min(6, w / 3)); ctx.fill(); ctx.globalAlpha = 1;
      if (w >= 22) { if (isOpen) lab(ctx, String(ST.rooms[i]), x + w / 2, DY + 66, hit ? "#062b27" : "#1b1f4a", `800 ${Math.min(14, w * 0.4)}px JetBrains Mono, monospace`, "center"); else { ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(x + w * 0.75, DY + DH / 2, Math.min(3, w / 8), 0, 7); ctx.fill(); } }
      if (O.cur === i) { ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.strokeRect(x + 1, DY - 3, Math.max(2, w - 2), DH + 6); }
    }
    // robot
    const ri = O.cur != null ? O.cur : ST.mode === "user" && ST.user.last != null ? ST.user.last : -0.6, rx = HX + ((ri + 0.5) / n) * HW, ry = DY + DH + 26;
    ctx.fillStyle = "#3fe0c5"; D.rr(ctx, rx - 14, ry - 14, 28, 28, 9); ctx.fill(); ctx.fillStyle = "#1d2152"; D.rr(ctx, rx - 10, ry - 7, 20, 11, 4); ctx.fill(); ctx.fillStyle = "#5ef2d6"; ctx.beginPath(); ctx.arc(rx - 4, ry - 2, 2.2, 0, 7); ctx.arc(rx + 4, ry - 2, 2.2, 0, 7); ctx.fill();
    ctx.fillStyle = "#fff"; D.rr(ctx, rx + 10, ry - 30, 30, 20, 3); ctx.fill(); ctx.strokeStyle = "#ff7d5f"; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(rx + 10, ry - 30); ctx.lineTo(rx + 25, ry - 19); ctx.lineTo(rx + 40, ry - 30); ctx.stroke();
    lab(ctx, `Lá thư gửi phòng ${ST.target}`, HX, 40, "#ffc34d", "800 20px Be Vietnam Pro, sans-serif");
    lab(ctx, `${n} phòng · ${ST.sorted ? "số phòng tăng dần từ trái sang phải" : "số phòng LỘN XỘN"}`, HX, 66, ST.sorted ? "#c3c7f0" : "#ff8f6b", "600 13px Be Vietnam Pro, sans-serif");
    lab(ctx, `Đầu hành lang: ${ST.sorted ? ST.rooms[0] : "?"}`, HX, 112, "#8f96d4", "600 11px Be Vietnam Pro, sans-serif"); lab(ctx, `Cuối hành lang: ${ST.sorted ? ST.rooms[n - 1] : "?"}`, HX + HW, 112, "#8f96d4", "600 11px Be Vietnam Pro, sans-serif", "right");
    const cnt = ST.mode === "user" ? ST.user.opened.size : ST.run ? Math.min(ST.run.k + 1, ST.run.tr.steps.length) : 0; lab(ctx, `Đã mở ${cnt} cửa`, HX + HW, 40, "#fff", "800 18px Be Vietnam Pro, sans-serif", "right");
    if (w < 22) lab(ctx, "Hành lang dài quá, số phòng chỉ hiện ở khung Sổ giao thư", HX, DY + DH + 64, "#8f96d4", "600 11px Be Vietnam Pro, sans-serif");
  }
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  const NAME = { seq: "Tìm tuần tự", bin: "Tìm nhị phân", user: "Em" };
  function update() {
    $("bTarget").textContent = ST.target; const R = ST.results;
    $("bOpens").innerHTML = ["user", "seq", "bin"].map((k) => { const v = R[k]; return `<div class="r"><span>${NAME[k]}</span><div class="bar"><i style="width:${v ? Math.min(100, (v.n / Math.max(8, N())) * 100 * (N() > 64 ? 4 : 1)) : 0}%;background:${k === "bin" ? "#3fe0c5" : k === "seq" ? "#ff7d5f" : "#a99dff"}"></i></div><span>${v ? v.n + (v.ok ? "" : " sai") : "—"}</span></div>`; }).join("");
    const O = opened(); $("bRange").innerHTML = ST.sorted && ST.mode !== "user" && ST.run ? `Từ cửa ${O.lo + 1} (phòng ${ST.rooms[O.lo] ?? "?"}) tới cửa ${O.hi + 1} (phòng ${ST.rooms[O.hi] ?? "?"}): <b style="color:#ffc34d">${Math.max(0, O.hi - O.lo + 1)}</b> cửa` : ST.mode === "user" ? `Em đã mở ${ST.user.opened.size} cửa` : "—";
    const last = ST.mode !== "user" && R[ST.mode]; $("bRes").textContent = last ? (last.ok ? "Đã giao thư" : last.loop ? "Đi lòng vòng" : "Không tìm thấy") : ST.user.found && ST.mode === "user" ? "Đã giao thư" : "—";
    $("bRes").style.color = last && !last.ok ? "#ff8f6b" : "#5ef2d6";
    renderChart();
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 56, R = 70, T = 14, B = 30; ctx.clearRect(0, 0, W, H);
    const X = (n) => L + ((Math.log2(n) - 3) / (Math.log2(1000) - 3)) * (W - L - R), mx = 1000, Y = (v) => T + (1 - Math.log10(Math.max(1, v)) / 3) * (H - T - B);
    ctx.font = "11px JetBrains Mono, monospace"; [1, 10, 100, 1000].forEach((v) => { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, Y(v)); ctx.lineTo(W - R, Y(v)); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v, 10, Y(v) + 4); });
    NS.forEach((n) => { ctx.fillStyle = n === N() ? TH.ink : TH.text; ctx.font = (n === N() ? "800 " : "") + "11px JetBrains Mono, monospace"; ctx.fillText(n + " phòng", X(n) - 22, H - 10); });
    [[worstSeq, TH.coral, "Tìm tuần tự: n cửa"], [worstBin, TH.mint, "Tìm nhị phân: khoảng 10 cửa với 1000 phòng"]].forEach(([f, c, t], k) => { ctx.strokeStyle = c; ctx.lineWidth = 3; ctx.beginPath(); NS.forEach((n, i) => (i ? ctx.lineTo(X(n), Y(f(n))) : ctx.moveTo(X(n), Y(f(n))))); ctx.stroke(); NS.forEach((n) => { ctx.fillStyle = c; ctx.beginPath(); ctx.arc(X(n), Y(f(n)), 4, 0, 7); ctx.fill(); ctx.font = "700 11px JetBrains Mono, monospace"; ctx.fillText(f(n), X(n) + 6, Y(f(n)) - 6); }); ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, L + 10, T + 14 + k * 18); });
    ST.history.forEach((h) => { ctx.strokeStyle = h.mode === "seq" ? TH.coral : h.mode === "bin" ? TH.mint : TH.violet; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(X(h.n), Y(h.k), 7, 0, 7); ctx.stroke(); });
    ctx.fillStyle = TH.text; ctx.font = "11px Be Vietnam Pro, sans-serif"; ctx.fillText("Vòng tròn rỗng: các lần chạy thật của em và robot (trục dọc chia theo 1, 10, 100, 1000)", L + 10, T + 52);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Bài toán tìm kiếm", e: "help", d: "Có một dãy dữ liệu (các số phòng) và một giá trị cần tìm (phòng ghi trên thư). Mỗi lần chỉ xem được <b>một</b> dữ liệu. Cần tìm ra vị trí của nó, hoặc biết chắc là không có." },
    { t: "Tìm tuần tự", e: "arrowR", d: "Xem lần lượt từ phần tử đầu tiên. Gặp đúng giá trị thì dừng; hết dãy mà không gặp thì báo không có. Đơn giản, luôn đúng, nhưng chậm khi dãy dài." },
    { t: "Dữ liệu đã sắp xếp", e: "chart", d: "Nếu dãy đã <b>xếp tăng dần</b>, mỗi lần xem một phần tử ta biết thêm: giá trị cần tìm nằm <b>bên trái</b> hay <b>bên phải</b> nó." },
    { t: "Tìm nhị phân", e: "layers", d: "Xem phần tử <b>ở giữa</b> khoảng còn lại. Lớn hơn giá trị cần tìm thì bỏ nửa phải, nhỏ hơn thì bỏ nửa trái. Lặp lại tới khi tìm thấy hoặc khoảng tìm rỗng." },
    { t: "Đếm số bước", e: "clock", d: "Mỗi bước, tìm nhị phân <b>chia đôi</b> khoảng tìm: 1000 → 500 → 250 → … → 1, chỉ khoảng <b>10 bước</b>. Tìm tuần tự xấu nhất phải xem cả 1000 phần tử." },
    { t: "Tìm kiếm quanh em", e: "globe", d: "Máy tìm kiếm, danh bạ, thư viện, AI chơi cờ đều dựa vào việc <b>sắp xếp và lập chỉ mục</b> trước, để khi cần thì tìm cực nhanh. Dữ liệu sai thứ tự thì tìm nhị phân cho kết quả sai." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const DEMO = Array.from({ length: 16 }, (_, i) => 101 + i * 2 + (i > 7 ? 1 : 0));
  function strip(ctx, arr, y, o) { const n = arr.length, w = 600 / n; arr.forEach((v, i) => { const x = 20 + i * w, isO = o.open && o.open.has(i), out = o.lo != null && (i < o.lo || i > o.hi), hit = o.hit === i; ctx.fillStyle = hit ? "#3fe0c5" : isO ? "#f5f4ff" : out ? "#2b2f6e" : "#7c6bff"; D.rr(ctx, x + 2, y, w - 4, 46, 6); ctx.fill(); if (isO || o.show) lab(ctx, String(v), x + w / 2, y + 28, hit ? "#062b27" : isO ? "#1b1f4a" : "#fff", "800 12px JetBrains Mono, monospace", "center"); if (o.cur === i) { ctx.strokeStyle = "#ffc34d"; ctx.lineWidth = 3; ctx.strokeRect(x + 1, y - 2, w - 2, 50); } }); }
  function renderSoi() {
    const ctx = octx, s = soiStep, tgt = DEMO[14]; D.labBg(ctx); lab(ctx, `Dãy 16 phòng · cần tìm phòng ${tgt}`, 20, 30, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif");
    const k = Math.floor(ST.t * 1.2);
    if (s === 0) { strip(ctx, DEMO, 70, {}); lab(ctx, "Mỗi cửa đóng là một dữ liệu chưa xem.", 20, 160); lab(ctx, "Câu hỏi: phòng cần tìm ở cửa thứ mấy?", 20, 186); return; }
    if (s === 1) { const steps = Math.min(15, k % 18 + 1), open = new Set(Array.from({ length: steps }, (_, i) => i)); strip(ctx, DEMO, 70, { open, cur: steps - 1, hit: steps === 15 ? 14 : -1 }); lab(ctx, `Đã xem ${steps} cửa${steps === 15 ? ": tìm thấy!" : ""}`, 20, 160, "#ff8f6b", "800 16px Be Vietnam Pro, sans-serif"); return; }
    if (s === 2) { strip(ctx, DEMO, 70, { show: true }); for (let i = 0; i < 15; i++) lab(ctx, "<", 20 + (i + 1) * 37.5, 140, "#5ef2d6", "800 14px JetBrains Mono, monospace", "center"); lab(ctx, "Số nhỏ ở bên trái, số lớn ở bên phải", 20, 180, "#5ef2d6", "700 14px Be Vietnam Pro, sans-serif"); return; }
    if (s === 3 || s === 4) {
      let lo = 0, hi = 15; const rows = []; while (lo <= hi) { const mid = (lo + hi) >> 1; rows.push({ lo, hi, mid }); if (DEMO[mid] === tgt) break; if (DEMO[mid] < tgt) lo = mid + 1; else hi = mid - 1; }
      const show = s === 3 ? Math.min(rows.length, (k % (rows.length + 2)) + 1) : rows.length;
      rows.slice(0, show).forEach((r, j) => { const open = new Set(rows.slice(0, j + 1).map((q) => q.mid)); strip(ctx, DEMO, 60 + j * 70, { open, lo: r.lo, hi: r.hi, cur: r.mid, hit: DEMO[r.mid] === tgt ? r.mid : -1 }); lab(ctx, `Bước ${j + 1}: còn ${r.hi - r.lo + 1} cửa, mở cửa giữa`, 20, 56 + j * 70 - 4, "#c3c7f0", "600 11px Be Vietnam Pro, sans-serif"); });
      if (s === 4) { lab(ctx, "Số cửa còn lại: 16 → 8 → 4 → 2 → 1", 20, 380, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, "1000 phòng: 1000 → 500 → 250 → 125 → 63 → 32 → 16 → 8 → 4 → 2 → 1", 20, 410, "#fff", "700 13px Be Vietnam Pro, sans-serif"); lab(ctx, "Chỉ khoảng 10 bước!", 20, 438, "#5ef2d6", "800 15px Be Vietnam Pro, sans-serif"); }
      return;
    }
    [["Máy tìm kiếm", "Lập chỉ mục từ khóa trước, khi cần thì tra rất nhanh"], ["Danh bạ, từ điển", "Xếp theo vần để tìm kiểu chia đôi"], ["Thư viện", "Sách xếp theo mã số trên giá"], ["AI chơi cờ", "Tìm trong rất nhiều nước đi, bỏ qua nhánh kém"]].forEach(([t, d], i) => { const y = 60 + i * 90; ctx.fillStyle = "#1d2152"; D.rr(ctx, 20, y, 600, 70, 12); ctx.fill(); lab(ctx, t, 40, y + 30, "#5ef2d6", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, d, 40, y + 54, "#c3c7f0", "600 13px Be Vietnam Pro, sans-serif"); });
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), n = N();
    if (s <= 1) el.innerHTML = `Hành lang của em: <span class="hl">${n}</span> phòng · tuần tự xấu nhất <span class="w">${n}</span> cửa`;
    else if (s === 2) el.innerHTML = ST.sorted ? `Hành lang của em <span class="hl">đã xếp</span> tăng dần` : `Hành lang của em đang <span class="w">lộn xộn</span>`;
    else el.innerHTML = `${n} phòng → nhị phân xấu nhất <span class="hl">${worstBin(n)}</span> cửa`;
  }

  // ---------- điều khiển ----------
  function setMode(m) { ST.mode = m; ST.run = null; $("modeBtns").querySelectorAll("button").forEach((b) => b.classList.toggle("ghost", b.dataset.m !== m)); $("btnGo").hidden = m === "user"; say(m === "user" ? `Bấm vào một cửa để mở. Tìm phòng <b>${ST.target}</b> với ít lần mở nhất!` : `Bấm <b>Chạy</b> để robot ${m === "seq" ? "mở lần lượt từng cửa" : "mở cửa ở giữa rồi loại một nửa"}.`); update(); }
  function finish() {
    const r = ST.run, tr = r.tr, ok = tr.found >= 0, n = tr.steps.length; ST.results[r.mode] = { n, ok, loop: tr.loop }; ST.history.push({ mode: r.mode, n: N(), k: n }); if (ST.history.length > 30) ST.history.shift();
    if (ok) { prog.done(r.mode); if (N() >= 1000) prog.done("big"); }
    say(ok ? `${NAME[r.mode]}: tìm thấy phòng ${ST.target} sau <b>${n}</b> lần mở cửa.` : tr.loop ? `Robot đi qua đi lại giữa hai cửa mãi không xong (đã mở ${n} lần)! Có lỗi trong thuật toán.` : `${NAME[r.mode]}: robot báo <b>không có phòng ${ST.target}</b> sau ${n} lần mở cửa${!ST.sorted && r.mode === "bin" ? ", dù phòng đó có thật!" : "."}`);
    update();
  }
  function bind() {
    $("modeBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => setMode(b.dataset.m)));
    $("btnGo").onclick = () => { start(ST.mode); update(); };
    $("btnNew").onclick = () => { newLetter(); setMode(ST.mode); };
    $("btnHall").onclick = () => { newHall(); setMode(ST.mode); };
    stage.addEventListener("click", (e) => {
      if (ST.mode !== "user" || ST.user.found) return; const r = stage.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * stage.width, y = ((e.clientY - r.top) / r.height) * stage.height; if (y < DY - 10 || y > DY + DH + 10) return;
      const i = Math.floor(((x - HX) / HW) * N()); if (i < 0 || i >= N()) return; ST.user.opened.add(i); ST.user.last = i; const v = ST.rooms[i];
      if (v === ST.target) { ST.user.found = true; prog.done("user"); const n = ST.user.opened.size; ST.results.user = { n, ok: true }; ST.history.push({ mode: "user", n: N(), k: n }); say(`Tìm thấy rồi! Em mở <b>${n}</b> cửa. Tìm nhị phân xấu nhất cần ${worstBin(N())} cửa, tìm tuần tự xấu nhất cần ${N()} cửa.`); }
      else say(`Cửa này là phòng <b>${v}</b>. ${ST.sorted ? (v < ST.target ? "Phòng cần tìm ở <b>bên phải</b>." : "Phòng cần tìm ở <b>bên trái</b>.") : "Số phòng lộn xộn, không biết nên tìm bên nào!"}`);
      update();
    });
    const setN = P.range("n", () => ST.ni, (v) => (ST.ni = v), (v) => NS[v] + " phòng", () => { newHall(); setMode(ST.mode); });
    $("optSorted").onchange = (e) => { ST.sorted = e.target.checked; newHall(); setMode(ST.mode); };
    $("optBug").onchange = (e) => { ST.bug = e.target.checked; ST.run = null; update(); };
    const clear = () => { ST.ni = 2; setN(); ST.sorted = true; $("optSorted").checked = true; ST.bug = false; $("optBug").checked = false; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "unsorted") { ST.sorted = false; $("optSorted").checked = false; for (let t = 0; t < 30; t++) { newHall(); if (binTrace().found < 0) break; } setMode("bin"); start("bin"); guide("Số phòng lộn xộn mà robot vẫn chia đôi: nó sẽ loại nhầm nửa có phòng cần tìm. Xem kết quả!"); }
      if (k === "big") { ST.ni = 7; setN(); newHall(); setMode("seq"); start("seq"); guide("Hành lang <b>1000 phòng</b>, robot tuần tự mở từng cửa một. Chờ xem, rồi thử <b>Robot tìm nhị phân</b> với cùng lá thư."); }
      if (k === "bug") { ST.bug = true; $("optBug").checked = true; for (let t = 0; t < 40; t++) { newHall(); if (binTrace().loop) break; } setMode("bin"); start("bin"); guide("Robot nhị phân có lỗi một chi tiết nhỏ. Xem nó mở cửa thế nào khi khoảng tìm chỉ còn hai cửa!"); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); newHall(); setMode("user"); guide("Mọi sự cố đã tắt. Hành lang 32 phòng đã xếp tăng dần."); };
  }

  const QUIZ = [
    { q: "Tìm kiếm nhị phân cần điều kiện gì?", o: ["Dãy phải có ít hơn 10 phần tử", "Dãy phải được sắp xếp theo thứ tự", "Giá trị cần tìm phải ở giữa", "Không cần điều kiện gì"], a: 1, e: "Chỉ khi dãy đã sắp xếp, so với phần tử giữa mới cho biết nên tìm bên trái hay bên phải." },
    { q: "Dãy 16 phần tử đã sắp xếp. Tìm nhị phân cần xem nhiều nhất khoảng bao nhiêu phần tử?", o: ["16", "8", "5", "1"], a: 2, e: "16 → 8 → 4 → 2 → 1: tối đa 5 lần xem." },
    { q: "Khi nào nên dùng tìm kiếm tuần tự?", o: ["Khi dãy chưa sắp xếp hoặc rất ngắn", "Khi dãy có hàng triệu phần tử đã sắp xếp", "Không bao giờ", "Chỉ khi tìm số chẵn"], a: 0, e: "Tìm tuần tự luôn đúng kể cả với dãy lộn xộn; với dãy ngắn thì cũng đủ nhanh." },
    { q: "Vì sao máy tìm kiếm trả lời nhanh dù có hàng tỉ trang web?", o: ["Vì nó đọc lại từng trang mỗi lần em tìm", "Vì dữ liệu đã được sắp xếp, lập chỉ mục từ trước", "Vì chỉ có ít trang web", "Vì nó đoán ngẫu nhiên"], a: 1, e: "Sắp xếp và lập chỉ mục trước giúp việc tìm sau đó cực nhanh, giống tìm nhị phân." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) {
    const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt;
    if (ST.run && !ST.run.done) { const L = ST.run.tr.steps.length, sp = L > 60 ? 150 : ST.run.tr.loop ? 6 : ST.run.mode === "bin" ? 1.6 : 4; ST.run.acc += dt * sp; while (ST.run.acc >= 1 && ST.run.k < L - 1) { ST.run.acc -= 1; ST.run.k++; update(); } if (ST.run.k >= L - 1 && ST.run.acc >= 0.6) { ST.run.done = true; finish(); } }
    renderStage(); if (soiVisible) renderSoi(); requestAnimationFrame(tick);
  }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); newHall(); bind(); setMode("user"); guide("Chế độ <b>Em tự tìm</b>: bấm vào một cửa để mở và đọc số phòng. Tìm phòng ghi trên lá thư với <b>ít lần mở cửa nhất</b>!");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka29 = { ST, seqTrace, binTrace, newHall, start };
  requestAnimationFrame(tick);
})();
