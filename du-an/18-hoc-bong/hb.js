/* Hộp Kính AI · Dự án 18 · Ai được nhận học bổng? (thiên kiến từ dữ liệu, tần số tương đối, phép thử đổi nơi ở) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, H = window.HB38;
  const prog = P.progress("hka-38");
  const ST = { K: 20, zone: false, dist: false, fix: false, sel: null, m: null, E: null, broken: false };
  const lab = () => (ST.fix ? "fair" : "old");
  const pct = (v) => Math.round(v * 100) + "%";
  const f1 = (v) => (Math.round(v * 10) / 10).toString().replace(".", ",");
  const sgn = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2).replace(".", ",");
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function retrain() { ST.m = H.train([1, 1, ST.zone ? 1 : 0, ST.dist ? 1 : 0], lab()); recompute(); }
  function recompute() { ST.E = H.evaluate(ST.m, ST.K, lab()); if (ST.broken && ST.E.flips === 0) prog.done("fair"); panel(); }

  // ---------- biểu đồ phân tán ----------
  const cv = $("stage"), ctx = cv.getContext("2d"), W = cv.width, Hh = cv.height, L = 64, R = 24, T = 44, B = 54;
  const X = (s) => L + ((s - 5) / 5) * (W - L - R), Y = (a) => T + (1 - a / 40) * (Hh - T - B);
  function shape(p, x, y, r) { ctx.beginPath(); if (p.tay) { ctx.moveTo(x, y - r * 1.15); ctx.lineTo(x + r * 1.05, y + r * 0.75); ctx.lineTo(x - r * 1.05, y + r * 0.75); ctx.closePath(); } else ctx.arc(x, y, r, 0, 7); }
  function draw() {
    const E = ST.E; if (!E) return; const m = ST.m;
    const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, "#14183d"); g.addColorStop(1, "#1b2050"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
    ctx.font = "11px JetBrains Mono, monospace"; ctx.lineWidth = 1;
    for (let s = 5; s <= 10; s++) { ctx.strokeStyle = "#262b66"; ctx.beginPath(); ctx.moveTo(X(s), T); ctx.lineTo(X(s), Hh - B); ctx.stroke(); ctx.fillStyle = "#8f96d4"; ctx.fillText(s, X(s) - 4, Hh - B + 18); }
    for (let a = 0; a <= 40; a += 10) { ctx.strokeStyle = "#262b66"; ctx.beginPath(); ctx.moveTo(L, Y(a)); ctx.lineTo(W - R, Y(a)); ctx.stroke(); ctx.fillStyle = "#8f96d4"; ctx.fillText(a, L - 26, Y(a) + 4); }
    ctx.fillStyle = "#c3c7f0"; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText("Điểm trung bình →", W - R - 130, Hh - 14); ctx.save(); ctx.translate(18, T + 150); ctx.rotate(-1.5708); ctx.fillText("Giờ hoạt động →", 0, 0); ctx.restore();
    // đường ranh giới chọn của từng khu (tại khoảng cách trung bình của khu)
    const lines = [[false, "#a99dff", 2.2], [true, "#ffc34d", 10.5]].map(([tay, col, dist]) => {
      const pts = []; for (let s = 5; s <= 10.001; s += 0.25) { const zs = (s - H.ST.score[0]) / H.ST.score[1], zt = ((tay ? 1 : 0) - H.ST.tay[0]) / H.ST.tay[1], zd = (dist - H.ST.dist[0]) / H.ST.dist[1]; const za = (E.cut - m.b - m.w[0] * zs - m.w[2] * zt - m.w[3] * zd) / (m.w[1] || 1e-6); pts.push([s, za * H.ST.act[1] + H.ST.act[0]]); }
      return { tay, col, pts };
    });
    const gap = Math.abs(lines[0].pts[10][1] - lines[1].pts[10][1]) > 1.5;
    ctx.save(); ctx.beginPath(); ctx.rect(L, T, W - L - R, Hh - T - B); ctx.clip();
    (gap ? lines : [lines[0]]).forEach((ln) => { ctx.strokeStyle = gap ? ln.col : "#5ef2d6"; ctx.lineWidth = 2.5; ctx.setLineDash([8, 6]); ctx.beginPath(); ln.pts.forEach(([s, a], i) => (i ? ctx.lineTo(X(s), Y(a)) : ctx.moveTo(X(s), Y(a)))); ctx.stroke(); ctx.setLineDash([]); });
    ctx.restore();
    const top = (ln) => { let b = ln.pts[0]; ln.pts.forEach((q) => { if (Math.abs(q[1] - 39) < Math.abs(b[1] - 39)) b = q; }); return Math.min(9.6, Math.max(5.6, b[0])); };
    if (gap) { D.pill(ctx, "ngưỡng Đông", X(top(lines[0])), T + 6, "#5443ff", 11); D.pill(ctx, "ngưỡng Tây", X(top(lines[1])), T + 6, "#a86c10", 11); }
    else D.pill(ctx, "ngưỡng chung", X(top(lines[0])), T + 6, "#1d6a5e", 11);
    H.NOW.forEach((p, i) => {
      const x = X(p.score), y = Y(p.act), on = E.pick[i], miss = !on && E.fairPick.has(i), col = p.tay ? "#ffc34d" : "#a99dff";
      shape(p, x, y, 7); if (on) { ctx.fillStyle = col; ctx.fill(); } ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.stroke();
      if (miss) { ctx.strokeStyle = "#ff7d5f"; ctx.setLineDash([3, 3]); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, y, 13, 0, 7); ctx.stroke(); ctx.setLineDash([]); }
      if (ST.sel === i) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, 17, 0, 7); ctx.stroke(); }
    });
    D.pill(ctx, `Chọn ${ST.K} suất · Đông ${E.dong.sel}/${E.dong.n} · Tây ${E.tay.sel}/${E.tay.n}`, L + 150, Hh - 14, "rgba(18,22,51,.85)", 12);
  }
  cv.addEventListener("pointerdown", (e) => {
    const r = cv.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * W, y = ((e.clientY - r.top) / r.height) * Hh, rad = Math.max(16, (14 * W) / r.width);
    let best = -1, bd = rad; H.NOW.forEach((p, i) => { const d = Math.hypot(X(p.score) - x, Y(p.act) - y); if (d < bd) { bd = d; best = i; } });
    if (best < 0) return; ST.sel = best; prog.done("click"); panel();
    const p = H.NOW[best], on = ST.E.pick[best], cf = ST.E.cf(p, best);
    guide(on === cf ? `Phép thử: nếu bạn số ${p.id} sống ở <b>${p.tay ? "Phường Đông" : "Xã Tây"}</b>, kết quả <b>vẫn giữ nguyên</b>. Với hồ sơ này, nơi ở không ảnh hưởng.` : `Phép thử: nếu bạn số ${p.id} sống ở <b>${p.tay ? "Phường Đông" : "Xã Tây"}</b>, kết quả <b>đổi từ ${on ? "được chọn thành bị loại" : "bị loại thành được chọn"}</b>, dù điểm và giờ hoạt động y hệt. Máy đang <b>thiên vị theo nơi ở</b>.`);
  });

  // ---------- bảng ----------
  function panel() {
    const E = ST.E, m = ST.m;
    $("bW").innerHTML = H.FEATS.map(([k, n], j) => { const v = m.w[j], used = [1, 1, ST.zone, ST.dist][j]; const w = Math.min(100, Math.abs(v) * 20); return `<div class="wb${used ? "" : " off"}"><span>${n}</span><i style="width:${w}%;background:${v < -0.2 ? "#ff7d5f" : "#5ef2d6"}"></i><b>${used ? sgn(v) : "không dùng"}</b></div>`; }).join("");
    $("bAgree").textContent = pct(E.agree); $("bFlip").textContent = `${E.flips}/80`; $("bFlip").style.color = E.flips ? "#ff8f6b" : "#5ef2d6";
    const p = ST.sel != null ? H.NOW[ST.sel] : null;
    if (p) { const on = E.pick[ST.sel], cf = E.cf(p, ST.sel); $("bCard").innerHTML = `Hồ sơ số ${p.id} · ${p.tay ? "Xã Tây" : "Phường Đông"} · cách trường ${f1(p.dist)} km<br>Điểm ${f1(p.score)} · ${p.act} giờ hoạt động<br>Máy: <b style="color:${on ? "#5ef2d6" : "#ff8f6b"}">${on ? "ĐƯỢC CHỌN" : "BỊ LOẠI"}</b><br>Nếu ở ${p.tay ? "Phường Đông" : "Xã Tây"}: <b style="color:${cf ? "#5ef2d6" : "#ff8f6b"}">${cf ? "ĐƯỢC CHỌN" : "BỊ LOẠI"}</b>${cf !== on ? ' <b style="color:#ffc34d">(đổi kết quả!)</b>' : ""}`; }
    else $("bCard").textContent = "Bấm vào một hồ sơ trên biểu đồ.";
    const rd = E.dong.sel / E.dong.n, rt = E.tay.sel / E.tay.n;
    say(`Máy chọn <b>${E.dong.sel}/${E.dong.n}</b> bạn Phường Đông (${pct(rd)}) và <b>${E.tay.sel}/${E.tay.n}</b> bạn Xã Tây (${pct(rt)}). Theo năng lực thật, tỉ lệ xứng đáng là ${pct(E.dong.fair / E.dong.n)} và ${pct(E.tay.fair / E.tay.n)}.`);
    renderChart();
  }
  function renderChart() {
    const c = $("chart"), x = c.getContext("2d"), CW = c.width, CH = c.height, TH = P.TH, L = 50, B = 40, T = 18, E = ST.E; x.clearRect(0, 0, CW, CH);
    const mx = 0.6, Y = (v) => T + (1 - v / mx) * (CH - T - B);
    x.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= 0.6001; v += 0.1) { x.strokeStyle = TH.grid; x.beginPath(); x.moveTo(L, Y(v)); x.lineTo(CW - 10, Y(v)); x.stroke(); x.fillStyle = TH.text; x.fillText(Math.round(v * 100) + "%", 8, Y(v) + 4); }
    const groups = [["Phường Đông", E.dong], ["Xã Tây", E.tay]], gw = (CW - L - 40) / 2;
    groups.forEach(([n, g], k) => {
      const x0 = L + 20 + k * gw, bw = gw * 0.3;
      [[g.sel / g.n, TH.violet, "máy chọn"], [g.fair / g.n, TH.mint, "xứng đáng"]].forEach(([v, col, t], j) => { const xx = x0 + j * (bw + 16); x.fillStyle = col; D.rr(x, xx, Y(v), bw, Math.max(2, CH - B - Y(v)), 6); x.fill(); x.fillStyle = TH.ink; x.font = "800 14px JetBrains Mono, monospace"; x.fillText(pct(v), xx + bw / 2 - 16, Y(v) - 6); x.font = "600 11px Be Vietnam Pro, sans-serif"; x.fillStyle = TH.text; x.fillText(t, xx + 4, CH - B + 14); });
      x.fillStyle = TH.ink; x.font = "800 13px Be Vietnam Pro, sans-serif"; x.fillText(`${n} (${g.n} bạn)`, x0, CH - 6);
    });
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Dữ liệu cũ", e: "layers", d: "Máy được cho xem <b>240 hồ sơ</b> các năm trước cùng quyết định của hội đồng cũ: nhận hay không nhận học bổng." },
    { t: "Học trọng số", e: "sliders", d: "Máy tìm <b>trọng số</b> cho mỗi thông tin sao cho bắt chước quyết định cũ tốt nhất. Trọng số dương: càng cao càng dễ được chọn; âm: càng bất lợi." },
    { t: "Chấm điểm năm nay", e: "target", d: "Mỗi hồ sơ năm nay được tính điểm = tổng (thông tin × trọng số). Máy xếp hạng từ cao đến thấp." },
    { t: "Chọn K suất", e: "award", d: "Lấy K hồ sơ điểm cao nhất. Ranh giới trên biểu đồ là nơi điểm bằng điểm của hồ sơ thứ K." },
    { t: "Kiểm tra công bằng", e: "shield", d: "So <b>tần số tương đối</b> được chọn của từng nhóm với tỉ lệ xứng đáng, và làm <b>phép thử đổi nơi ở</b> cho mọi hồ sơ." },
    { t: "Con người quyết định", e: "eye", d: "AI chỉ nên <b>gợi ý</b>. Hội đồng cần xem lại, công khai tiêu chí, cho học sinh đề nghị xem xét lại và kiểm tra máy định kì." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), sx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lb = (t, x, y, c, f, al) => { sx.fillStyle = c || "#c3c7f0"; sx.font = f || "700 12px Be Vietnam Pro, sans-serif"; sx.textAlign = al || "left"; sx.fillText(t, x, y); sx.textAlign = "left"; };
  function renderSoi() {
    const s = soiStep, E = ST.E, m = ST.m; if (!E) return; D.labBg(sx);
    if (s === 0) {
      lb(ST.fix ? "Dữ liệu đã được hội đồng mới xét lại" : "Quyết định của hội đồng cũ", 24, 34, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif");
      ["Số", "Điểm", "Giờ HĐ", "Khu", "Cách (km)", "Nhận?"].forEach((h, i) => lb(h, 24 + i * 100, 70, "#8f96d4"));
      H.HIST.slice(0, 10).forEach((p, r) => { const y = 98 + r * 26, ok = p[lab()]; [p.id, f1(p.score), p.act, p.tay ? "Tây" : "Đông", f1(p.dist), ok ? "Có" : "Không"].forEach((v, i) => lb(String(v), 24 + i * 100, y, i === 5 ? (ok ? "#5ef2d6" : "#ff8f6b") : i === 3 && p.tay ? "#ffc34d" : "#fff", "600 13px JetBrains Mono, monospace")); });
      const rate = (t) => { const g = H.HIST.filter((p) => p.tay === t); return g.filter((p) => p[lab()]).length / g.length; };
      lb(`Tỉ lệ được nhận: Phường Đông ${pct(rate(false))} · Xã Tây ${pct(rate(true))}`, 24, 400, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif");
      lb("(hai khu có điểm và giờ hoạt động phân bố như nhau)", 24, 426, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif"); return;
    }
    if (s === 1) { H.FEATS.forEach(([k, n], j) => { const v = m.w[j], y = 90 + j * 80, x0 = 320; lb(n, 24, y + 22, "#fff", "700 14px Be Vietnam Pro, sans-serif"); sx.fillStyle = v < -0.2 ? "#ff7d5f" : "#3fe0c5"; const w = v * 60; sx.fillRect(Math.min(x0, x0 + w), y + 6, Math.abs(w), 24); sx.strokeStyle = "#8f96d4"; sx.beginPath(); sx.moveTo(x0, y - 4); sx.lineTo(x0, y + 40); sx.stroke(); lb(sgn(v), x0 + (v >= 0 ? w + 8 : w - 60), y + 24, "#fff", "700 13px JetBrains Mono, monospace"); }); lb("0", 316, 420, "#8f96d4"); return; }
    if (s === 2 || s === 3) { const ord = E.z.map((v, i) => i).sort((a, b) => E.z[b] - E.z[a]); const show = ord.slice(Math.max(0, ST.K - 7), ST.K + 6); lb(`Hạng   Hồ sơ   Khu    Điểm máy chấm`, 24, 40, "#8f96d4", "700 13px JetBrains Mono, monospace"); show.forEach((i, r) => { const rank = ord.indexOf(i) + 1, p = H.NOW[i], y = 72 + r * 28, on = E.pick[i] && s === 3; if (on) { sx.fillStyle = "rgba(63,224,197,.14)"; sx.fillRect(18, y - 18, 600, 26); } lb(`${String(rank).padStart(3)}    ${String(p.id).padStart(3)}     ${p.tay ? "Tây " : "Đông"}   ${E.z[i].toFixed(2).replace(".", ",")}`, 24, y, p.tay ? "#ffc34d" : "#c3c7f0", "700 13px JetBrains Mono, monospace"); if (s === 3 && rank === ST.K) { sx.strokeStyle = "#ff7d5f"; sx.lineWidth = 2; sx.beginPath(); sx.moveTo(18, y + 10); sx.lineTo(620, y + 10); sx.stroke(); lb(`ranh giới: ${ST.K} suất`, 430, y + 26, "#ff7d5f", "800 12px Be Vietnam Pro, sans-serif"); } }); return; }
    if (s === 4) { [["Phường Đông", E.dong], ["Xã Tây", E.tay]].forEach(([n, g], k) => { const y = 80 + k * 120; lb(n, 24, y, "#fff", "800 15px Be Vietnam Pro, sans-serif"); lb(`Máy chọn ${g.sel}/${g.n} = ${pct(g.sel / g.n)}`, 24, y + 30, "#a99dff", "700 14px Be Vietnam Pro, sans-serif"); lb(`Xứng đáng ${g.fair}/${g.n} = ${pct(g.fair / g.n)}`, 24, y + 56, "#5ef2d6", "700 14px Be Vietnam Pro, sans-serif"); sx.fillStyle = "#a99dff"; sx.fillRect(330, y + 16, (g.sel / g.n) * 400, 18); sx.fillStyle = "#3fe0c5"; sx.fillRect(330, y + 42, (g.fair / g.n) * 400, 18); }); lb(`Phép thử đổi nơi ở: ${E.flips}/80 hồ sơ đổi kết quả`, 24, 370, E.flips ? "#ff8f6b" : "#5ef2d6", "800 15px Be Vietnam Pro, sans-serif"); lb(E.flips ? "Máy đang thiên vị theo nơi ở." : "Nơi ở không làm thay đổi kết quả.", 24, 400, "#c3c7f0", "600 13px Be Vietnam Pro, sans-serif"); return; }
    ["AI gợi ý danh sách", "Hội đồng xem lại từng hồ sơ", "Công khai tiêu chí xét", "Học sinh được đề nghị xem xét lại", "Kiểm tra công bằng mỗi năm"].forEach((t, i) => { sx.fillStyle = i ? "#1d2152" : "#5443ff"; D.rr(sx, 60, 60 + i * 76, 520, 54, 12); sx.fill(); lb(t, 84, 94 + i * 76, "#fff", "700 15px Be Vietnam Pro, sans-serif"); if (i < 4) D.arrow(sx, { x: 320, y: 116 + i * 76 }, { x: 320, y: 134 + i * 76 }, "#8f96d4", 2); });
  }
  function soiLive() { $("soiLive").innerHTML = `Đổi kết quả vì nơi ở: <span class="hl">${ST.E ? ST.E.flips : 0}/80</span>`; }

  // ---------- điều khiển ----------
  function bind() {
    P.range("k", () => ST.K, (v) => (ST.K = v), (v) => v + " suất", () => { prog.done("k"); recompute(); });
    const sync = () => { $("optZone").checked = ST.zone; $("optDist").checked = ST.dist; $("optFix").checked = ST.fix; };
    $("optZone").onchange = (e) => { ST.zone = e.target.checked; retrain(); };
    $("optDist").onchange = (e) => { ST.dist = e.target.checked; retrain(); };
    $("optFix").onchange = (e) => { ST.fix = e.target.checked; retrain(); };
    const clear = () => { Object.assign(ST, { zone: false, dist: false, fix: false, K: 20 }); $("k").value = 20; $("kV").textContent = "20 suất"; sync(); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke"); ST.broken = true;
      if (k === "zone") ST.zone = true; if (k === "proxy") ST.dist = true; if (k === "acc") { ST.zone = true; ST.dist = true; }
      sync(); retrain(); const E = ST.E;
      guide(k === "acc" ? `Độ khớp với quyết định cũ tăng lên <b>${pct(E.agree)}</b>, nhưng <b>${E.flips} bạn</b> bị đổi kết quả chỉ vì nơi ở. Bật <b>Học từ dữ liệu đã được xét lại công bằng</b>.` : `Bây giờ <b>${E.flips} bạn</b> bị đổi kết quả chỉ vì nơi ở; Xã Tây chỉ còn ${pct(E.tay.sel / E.tay.n)} được chọn. Thấy hai đường ngưỡng tách nhau trên biểu đồ chứ? Bấm vào một hình tam giác gần đường ngưỡng để kiểm tra.`);
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); retrain(); guide("Mọi sự cố đã tắt: máy chỉ dùng điểm trung bình và giờ hoạt động."); };
  }

  const QUIZ = [
    { q: "Máy học từ quyết định cũ của hội đồng. Vì sao máy có thể thiên vị?", o: ["Máy có ý xấu", "Máy bắt chước cả sự thiên vị có sẵn trong quyết định cũ", "Máy tính sai phép cộng", "Vì máy không có dữ liệu"], a: 1, e: "Dữ liệu thiên vị dạy cho máy cách thiên vị." },
    { q: "Đã giấu thông tin khu vực nhưng máy vẫn thiên vị. Lí do có thể là gì?", o: ["Máy đoán ngẫu nhiên", "Một thông tin khác (khoảng cách đến trường) tiết lộ nơi ở", "Máy nhìn thấy ảnh học sinh", "Không thể xảy ra"], a: 1, e: "Đó là thông tin đại diện: nó gắn chặt với nơi ở nên mang theo thiên kiến." },
    { q: "Phường Đông có 16/50 bạn được chọn, Xã Tây 4/30. Tần số tương đối của Xã Tây là bao nhiêu?", o: ["4%", "13% (4 ÷ 30)", "30%", "40%"], a: 1, e: "4 ÷ 30 ≈ 0,13 = 13%, thấp hơn nhiều so với 32% của Phường Đông." },
    { q: "Cách kiểm tra nào cho thấy rõ máy thiên vị theo nơi ở?", o: ["Chỉ xem độ chính xác so với quyết định cũ", "Giữ nguyên điểm, giờ hoạt động, chỉ đổi nơi ở rồi xem kết quả có đổi không", "Hỏi máy có thiên vị không", "Đếm tổng số suất"], a: 1, e: "Phép thử đổi một đặc điểm không liên quan là cách kiểm tra rất trực tiếp." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  function tick() { draw(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 400);
  P.nav(); bind(); retrain(); guide("Mỗi hình là một hồ sơ. <b>Bấm vào một hồ sơ</b> để xem máy chấm thế nào, và kết quả có đổi không nếu bạn ấy sống ở khu kia.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka38 = { ST, retrain, recompute };
  requestAnimationFrame(tick);
})();
