/* Hộp Kính AI · Dự án 5 · Lá chắn tin nhắn lừa đảo (từ khóa có điểm, ngưỡng, học từ ví dụ có nhãn) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, M = window.SMS;
  const prog = P.progress("hka-25");
  const THR0 = 3;
  const ST = { thr: THR0, minc: 2, norm: false, extra: [], teach: new Map(), t: 0, brk: null };

  // ---------- đọc chữ ----------
  const split = (msg) => { const i = msg.indexOf(": "); return i >= 0 ? [msg.slice(0, i), msg.slice(i + 2)] : ["", msg]; };
  const DIG = { 0: "o", 1: "i", 3: "e", 4: "a", "@": "a" };
  function words(text, norm) {
    let s = text.toLowerCase();
    if (norm == null ? ST.norm : norm) { s = s.replace(/([\p{L}\d])[.\-_*]+(?=[\p{L}\d])/gu, "$1"); s = s.replace(/[\p{L}\d@]+/gu, (w) => (/\p{L}/u.test(w) ? w.replace(/[0134@]/g, (c) => DIG[c]) : w)); }
    return s.split(/[^\p{L}\p{N}]+/u).filter(Boolean);
  }
  function feats(text, norm) { const w = words(text, norm), f = new Set(w); for (let i = 0; i + 1 < w.length; i++) f.add(w[i] + " " + w[i + 1]); return [...f]; }

  // ---------- học điểm từ ví dụ ----------
  let W = new Map(), CNT = new Map(), NS = 0, NH = 0;
  const all = () => M.INBOX.concat(ST.extra);
  function train() {
    const data = M.TRAIN.map(([y, m]) => [y, m, 1]); ST.teach.forEach((y, m) => data.push([y, m, 1])); const TF = new Set(); ST.teach.forEach((y, m) => feats(split(m)[1]).forEach((f) => TF.add(f)));
    CNT = new Map(); NS = 0; NH = 0; data.forEach(([y, , k]) => (y ? (NS += k) : (NH += k)));
    data.forEach(([y, m, k]) => feats(split(m)[1]).forEach((f) => { const c = CNT.get(f) || [0, 0]; c[y ? 0 : 1] += k; CNT.set(f, c); }));
    W = new Map(); const a = 0.5; CNT.forEach(([s, h], f) => { if (s + h >= ST.minc || TF.has(f)) W.set(f, Math.log((s + a) / (NS + 2 * a)) - Math.log((h + a) / (NH + 2 * a))); });
  }
  function score(msg) { const fs = feats(split(msg)[1]); let s = 0; const hit = []; fs.forEach((f) => { if (W.has(f)) { s += W.get(f); hit.push([f, W.get(f)]); } }); return { s, hit }; }

  // ---------- giao diện hộp thư ----------
  const esc = (t) => t.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  function highlight(body) {
    return body.split(/(\s+)/).map((chunk) => { if (/^\s+$/.test(chunk) || !chunk) return chunk; const w = words(chunk).reduce((s, t) => s + (W.get(t) || 0), 0); return Math.abs(w) >= 0.7 ? `<mark class="${w > 0 ? "bad" : "good"}">${esc(chunk)}</mark>` : esc(chunk); }).join("");
  }
  let SC = [];
  function renderInbox() {
    const list = all(); SC = list.map(([y, m]) => ({ y, m, ...score(m) }));
    $("inbox").innerHTML = SC.map((x, i) => {
      const [who, body] = split(x.m), bl = x.s >= ST.thr, wrong = bl !== !!x.y, t = ST.teach.get(x.m);
      return `<li class="sms${bl ? " blocked" : ""}${i >= M.INBOX.length ? " fresh" : ""}"><div class="sms-h"><b>${esc(who)}</b><span class="sc ${bl ? "hi" : "lo"}">${x.s >= 0 ? "+" : ""}${x.s.toFixed(1)} điểm</span><span class="st">${bl ? HKA.icon("shield") + "Đã chặn" : HKA.icon("msg") + "Hộp thư"}</span>${wrong ? `<span class="oops">${bl ? "chặn nhầm" : "lọt lưới"}</span>` : ""}</div>
        <p>${highlight(body)}</p><div class="sms-b"><span class="small muted">Dạy máy:</span><button class="btn small ${t === 1 ? "coral" : "ghost"}" data-i="${i}" data-y="1">Tin lừa đảo</button><button class="btn small ${t === 0 ? "mint" : "ghost"}" data-i="${i}" data-y="0">Tin an toàn</button></div></li>`;
    }).join("");
    $("inbox").querySelectorAll("button[data-i]").forEach((b) => (b.onclick = () => { const x = SC[+b.dataset.i], y = +b.dataset.y; if (ST.teach.get(x.m) === y) ST.teach.delete(x.m); else ST.teach.set(x.m, y); prog.done("teach"); refresh(); guide(`Máy đã học thêm: tin của <b>${esc(split(x.m)[0])}</b> là <b>${y ? "tin lừa đảo" : "tin an toàn"}</b>. Điểm của các từ trong tin này thay đổi, xem cột từ khóa trong Bộ não.`); }));
    $("inboxChip").textContent = `${list.length} tin`;
  }
  function renderBrain() {
    const n = SC.length, bl = SC.filter((x) => x.s >= ST.thr), fp = bl.filter((x) => !x.y).length, fn = SC.filter((x) => x.y && x.s < ST.thr).length;
    $("bBlocked").textContent = `${bl.length}/${n}`; $("bAcc").textContent = `${n - fp - fn}/${n}`; $("bFP").textContent = fp; $("bFN").textContent = fn;
    $("bFP").style.color = fp ? "#ff8f6b" : "#5ef2d6"; $("bFN").style.color = fn ? "#ff8f6b" : "#5ef2d6";
    const arr = [...W.entries()].filter(([f]) => !/^\d+$/.test(f));
    arr.sort((a, b) => b[1] - a[1] || b[0].length - a[0].length);
    $("bBad").innerHTML = arr.slice(0, 10).map(([f, w]) => `<span class="k bad">${esc(f)} <i>+${w.toFixed(1)}</i></span>`).join("");
    $("bGood").innerHTML = arr.slice(-6).reverse().map(([f, w]) => `<span class="k good">${esc(f)} <i>${w.toFixed(1)}</i></span>`).join("");
    $("trainInfo").innerHTML = `Máy đang học từ <b>${NS + NH}</b> tin có nhãn: <b style="color:var(--coral)">${NS}</b> lừa đảo, <b style="color:var(--mint)">${NH}</b> an toàn${ST.teach.size ? `, trong đó <b>${ST.teach.size}</b> tin do em dạy` : ""}.`;
    $("trainList").innerHTML = M.TRAIN.map(([y, m]) => `<li class="${y ? "bad" : "good"}"><b>${y ? "Lừa đảo" : "An toàn"}</b> ${esc(split(m)[1])}</li>`).join("") + [...ST.teach.entries()].map(([m, y]) => `<li class="${y ? "bad" : "good"} mine"><b>${y ? "Lừa đảo" : "An toàn"} · em dạy</b> ${esc(split(m)[1])}</li>`).join("");
  }
  const TRY = () => $("tryText").value.trim();
  function renderTry() {
    const t = TRY(); if (!t) { $("askText").innerHTML = "Gõ thử một tin nhắn, máy sẽ chấm điểm ngay khi em gõ."; return; }
    const r = score(": " + t), bl = r.s >= ST.thr; if (t.length > 10) prog.done("test");
    $("askText").innerHTML = `Điểm nghi ngờ: <b>${r.s.toFixed(1)}</b> · ngưỡng ${ST.thr} → máy sẽ <b style="color:var(${bl ? "--coral" : "--mint"})">${bl ? "chặn tin này" : "cho tin này vào hộp thư"}</b>.<br><span class="small">${highlight(t)}</span>`;
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), Wd = cv.width, H = cv.height, TH = P.TH, L = 150, R = 20; ctx.clearRect(0, 0, Wd, H);
    const vals = SC.map((x) => x.s).concat([ST.thr]); const t = TRY(); let tv = null; if (t) { tv = score(": " + t).s; vals.push(tv); }
    const lo = Math.min(-6, Math.floor(Math.min(...vals)) - 1), hi = Math.max(10, Math.ceil(Math.max(...vals)) + 1), X = (v) => L + ((v - lo) / (hi - lo)) * (Wd - L - R);
    ctx.fillStyle = TH.coral; ctx.globalAlpha = TH.dark ? 0.1 : 0.07; ctx.fillRect(X(ST.thr), 10, Wd - R - X(ST.thr), H - 46); ctx.globalAlpha = 1;
    ctx.font = "11px JetBrains Mono, monospace"; for (let v = Math.ceil(lo / 2) * 2; v <= hi; v += 2) { ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(X(v), 10); ctx.lineTo(X(v), H - 36); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v, X(v) - 6, H - 20); }
    const lanes = [[1, 66, "Tin lừa đảo thật", TH.coral], [0, 136, "Tin thật, an toàn", TH.mint]];
    lanes.forEach(([y, py, name, col]) => { ctx.fillStyle = col; ctx.font = "700 13px Be Vietnam Pro, sans-serif"; ctx.fillText(name, 10, py + 4); SC.forEach((x, i) => { if (x.y !== y) return; const px = X(x.s), wrong = (x.s >= ST.thr) !== !!y; ctx.beginPath(); ctx.arc(px, py + ((i % 3) - 1) * 9, 8, 0, 7); ctx.fillStyle = col; ctx.fill(); if (wrong) { ctx.strokeStyle = TH.amber; ctx.lineWidth = 3; ctx.stroke(); } ctx.fillStyle = "#fff"; ctx.font = "700 9px JetBrains Mono, monospace"; ctx.fillText(i + 1, px - (i >= 9 ? 6 : 3), py + ((i % 3) - 1) * 9 + 3); }); });
    if (tv != null) { const px = X(tv); ctx.fillStyle = TH.amber; ctx.beginPath(); ctx.moveTo(px, 176); ctx.lineTo(px + 8, 186); ctx.lineTo(px, 196); ctx.lineTo(px - 8, 186); ctx.fill(); ctx.font = "700 11px Be Vietnam Pro, sans-serif"; ctx.fillText("tin em viết", px + 12, 190); }
    ctx.setLineDash([6, 5]); ctx.strokeStyle = TH.violet; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(ST.thr), 10); ctx.lineTo(X(ST.thr), H - 36); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = TH.violet; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(`ngưỡng ${ST.thr} · bên phải bị chặn`, Math.min(X(ST.thr) + 8, Wd - 220), 24);
    ctx.fillStyle = TH.text; ctx.font = "11px Be Vietnam Pro, sans-serif"; ctx.fillText("điểm nghi ngờ", Wd - R - 84, H - 6); ctx.fillText("Viền vàng: máy quyết định sai", 10, H - 6);
  }
  function refresh() { train(); renderInbox(); renderBrain(); renderTry(); renderChart(); }
  const guide = (h) => ($("guideText").innerHTML = h);

  // ---------- SOI ----------
  const SOI = [
    { t: "Tách thành từ", e: "layers", d: "Máy cắt tin nhắn thành từng <b>tiếng</b> (từ) và từng <b>cặp tiếng</b> đứng cạnh nhau, như \"mã otp\", \"chuyển khoản\". Máy không đọc hiểu cả câu như em." },
    { t: "Tra điểm từng từ", e: "book", d: "Mỗi từ có một <b>điểm nghi ngờ</b> máy đã học: <b style=\"color:var(--coral)\">dương</b> nếu hay gặp trong tin lừa đảo, <b style=\"color:var(--mint)\">âm</b> nếu hay gặp trong tin thật. Từ máy chưa gặp bao giờ thì không có điểm." },
    { t: "Cộng điểm", e: "cpu", d: "Máy <b>cộng</b> điểm của tất cả các từ tìm thấy. Tổng đó là <b>điểm nghi ngờ</b> của tin nhắn." },
    { t: "So với ngưỡng", e: "target", d: "Nếu điểm nghi ngờ <b>từ ngưỡng trở lên</b>, máy chặn tin. Ngưỡng do người chọn: thấp thì chặn nhiều, dễ chặn nhầm; cao thì dễ lọt lưới." },
    { t: "Học điểm từ ví dụ", e: "sparkle", d: "Điểm của mỗi từ không do ai gõ vào. Máy <b>đếm</b> từ đó có mặt trong bao nhiêu tin <b>lừa đảo</b> và bao nhiêu tin <b>an toàn</b> đã được dán nhãn. Gặp nhiều ở tin lừa đảo thì điểm cao." },
    { t: "Em là lá chắn cuối", e: "shield", d: "Máy lọc nào cũng có lúc sai. Nhớ các dấu hiệu: <b>đòi mã OTP</b>, <b>giục gấp</b>, <b>quà quá hời</b>, <b>link lạ</b>, <b>xin chuyển tiền</b>. Gặp là dừng lại, hỏi bố mẹ, gọi lại bằng số quen." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 4) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (ctx, t, x, y, c, f, al) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.textAlign = al || "left"; ctx.fillText(t, x, y); ctx.textAlign = "left"; };
  function chips(ctx, list, x0, y0, maxW, colorOf) {
    let x = x0, y = y0; ctx.font = "700 13px Be Vietnam Pro, sans-serif";
    list.forEach((t) => { const w = ctx.measureText(t).width + 18; if (x + w > x0 + maxW) { x = x0; y += 36; } ctx.fillStyle = colorOf ? colorOf(t) : "#5443ff"; D.rr(ctx, x, y, w, 26, 7); ctx.fill(); ctx.fillStyle = "#fff"; ctx.fillText(t, x + 9, y + 18); x += w + 8; });
    return y + 36;
  }
  function wrapText(ctx, t, x, y, maxW, lh, c, f) { ctx.font = f || "600 15px Be Vietnam Pro, sans-serif"; ctx.fillStyle = c || "#fff"; let line = ""; t.split(" ").forEach((w) => { const s = line ? line + " " + w : w; if (ctx.measureText(s).width > maxW) { ctx.fillText(line, x, y); y += lh; line = w; } else line = s; }); ctx.fillText(line, x, y); return y + lh; }
  function renderSoi() {
    const ctx = octx, s = soiStep, msg = TRY() ? ": " + TRY() : M.INBOX[0][1], body = split(msg)[1], ws = words(body), r = score(msg); D.labBg(ctx);
    const colW = (w) => (w > 0.3 ? `rgba(255,93,93,${Math.min(1, 0.35 + w / 3)})` : w < -0.3 ? `rgba(63,224,197,${Math.min(1, 0.35 - w / 3)})` : "#2b2f6e");
    lab(ctx, TRY() ? "Tin em viết" : "Tin mẫu", 24, 34, "#8f96d4", "600 12px Be Vietnam Pro, sans-serif");
    let y = wrapText(ctx, "“" + body + "”", 24, 62, 590, 22);
    if (s === 0) { lab(ctx, `${ws.length} tiếng:`, 24, y + 10, "#ffc34d"); y = chips(ctx, ws, 24, y + 22, 590); const bi = []; for (let i = 0; i + 1 < ws.length && bi.length < 8; i++) bi.push(ws[i] + " " + ws[i + 1]); lab(ctx, "và các cặp tiếng:", 24, y + 10, "#ffc34d"); chips(ctx, bi, 24, y + 22, 590, () => "#2b2f6e"); return; }
    if (s === 1) { lab(ctx, "Từ máy tìm thấy trong bảng điểm:", 24, y + 10, "#ffc34d"); const hit = r.hit.slice().sort((a, b) => Math.abs(b[1]) - Math.abs(a[1])).slice(0, 14); chips(ctx, hit.map(([f, w]) => `${f}  ${w > 0 ? "+" : ""}${w.toFixed(1)}`), 24, y + 22, 590, (t) => colW(+t.split("  ")[1])); return; }
    if (s === 2) {
      const hit = r.hit.slice().sort((a, b) => b[1] - a[1]).slice(0, 12); let acc = 0; const cum = [0]; hit.forEach((h) => cum.push((acc += h[1]))); acc = 0;
      const lo = Math.min(0, ...cum), hi = Math.max(0, ...cum), X = (v) => 250 + ((v - lo) / Math.max(1e-6, hi - lo)) * 360, x0 = X(0);
      hit.forEach(([f, w], i) => { const yy = y + 10 + i * 24; lab(ctx, f, 24, yy + 14, "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif"); const a = X(acc); acc += w; const b = X(acc); ctx.fillStyle = w > 0 ? "#ff7d5f" : "#3fe0c5"; ctx.fillRect(Math.min(a, b), yy, Math.max(2, Math.abs(b - a)), 18); lab(ctx, (w > 0 ? "+" : "") + w.toFixed(1), 180, yy + 14, w > 0 ? "#ff8f6b" : "#5ef2d6", "700 11px JetBrains Mono, monospace"); });
      ctx.strokeStyle = "#8f96d4"; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0, y + 10 + hit.length * 24); ctx.stroke(); lab(ctx, "0", x0 - 4, y - 2, "#8f96d4");
      lab(ctx, `Tổng: ${r.s.toFixed(1)} điểm${r.hit.length > hit.length ? ` (${r.hit.length} từ, hình chỉ vẽ ${hit.length} từ)` : ""}`, 24, Math.min(462, y + 30 + hit.length * 24), "#ffc34d", "800 16px Be Vietnam Pro, sans-serif"); return;
    }
    if (s === 3) {
      const lo = -8, hi = 14, X = (v) => 40 + ((Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo)) * 560, yy = y + 90;
      ctx.fillStyle = "rgba(255,93,93,.15)"; ctx.fillRect(X(ST.thr), yy - 40, 600 - X(ST.thr), 80); ctx.strokeStyle = "#8f96d4"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(40, yy); ctx.lineTo(600, yy); ctx.stroke();
      for (let v = lo; v <= hi; v += 2) lab(ctx, String(v), X(v), yy + 22, "#8f96d4", "11px JetBrains Mono, monospace", "center");
      ctx.setLineDash([5, 4]); ctx.strokeStyle = "#a99dff"; ctx.beginPath(); ctx.moveTo(X(ST.thr), yy - 46); ctx.lineTo(X(ST.thr), yy + 30); ctx.stroke(); ctx.setLineDash([]); lab(ctx, "ngưỡng " + ST.thr, X(ST.thr) + 6, yy - 30, "#a99dff");
      const bl = r.s >= ST.thr; ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(X(r.s), yy, 11, 0, 7); ctx.fill(); lab(ctx, r.s.toFixed(1), X(r.s), yy - 18, "#ffc34d", "800 13px JetBrains Mono, monospace", "center");
      lab(ctx, bl ? "Kết quả: CHẶN tin này" : "Kết quả: cho vào hộp thư", 40, yy + 80, bl ? "#ff8f6b" : "#5ef2d6", "800 20px Be Vietnam Pro, sans-serif"); return;
    }
    if (s === 4) {
      const hit = r.hit.filter(([f]) => CNT.has(f)).sort((a, b) => b[1] - a[1]), f = hit.length ? hit[0][0] : "otp", c = CNT.get(f) || [0, 0];
      lab(ctx, `Máy học điểm của từ "${f}" như thế nào?`, 24, y + 14, "#ffc34d", "800 15px Be Vietnam Pro, sans-serif");
      [["Có trong tin lừa đảo", c[0], NS, "#ff7d5f"], ["Có trong tin an toàn", c[1], NH, "#3fe0c5"]].forEach(([t, k, n, col], i) => { const yy = y + 50 + i * 70; lab(ctx, t, 24, yy + 18); ctx.fillStyle = "#232866"; ctx.fillRect(200, yy, 300, 28); ctx.fillStyle = col; ctx.fillRect(200, yy, (k / Math.max(1, n)) * 300, 28); lab(ctx, `${k} / ${n} tin`, 512, yy + 19, "#fff", "800 14px JetBrains Mono, monospace"); });
      const w = W.get(f) || 0; lab(ctx, `→ điểm của "${f}": ${w > 0 ? "+" : ""}${w.toFixed(1)}`, 24, y + 200, w > 0 ? "#ff8f6b" : "#5ef2d6", "800 18px Be Vietnam Pro, sans-serif");
      lab(ctx, "Gặp ở tin lừa đảo nhiều hơn tin an toàn → điểm dương, càng chênh càng cao.", 24, y + 232, "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif"); return;
    }
    D.labBg(ctx); lab(ctx, "5 dấu hiệu tin nhắn lừa đảo", 24, 44, "#ffc34d", "800 18px Be Vietnam Pro, sans-serif");
    [["Đòi mã OTP, mật khẩu", "Không ai có quyền xin mã của em, kể cả người tự xưng ngân hàng."], ["Giục gấp, dọa khóa tài khoản", "Kẻ gian muốn em không kịp suy nghĩ."], ["Quà quá hời, trúng thưởng bất ngờ", "Không tham gia mà vẫn trúng thưởng là dấu hiệu lạ."], ["Đường link lạ", "Không bấm vào link từ số lạ."], ["Xin chuyển tiền, nạp thẻ", "Gọi lại cho người thân bằng số quen trước đã."]].forEach(([t, d], i) => {
      const yy = 80 + i * 74, k = Math.floor(ST.t * 1.2) % 6; ctx.fillStyle = i < k ? "#3fe0c5" : "#2b2f6e"; D.rr(ctx, 24, yy, 30, 30, 8); ctx.fill(); lab(ctx, String(i + 1), 39, yy + 21, i < k ? "#062b27" : "#fff", "800 14px JetBrains Mono, monospace", "center"); lab(ctx, t, 68, yy + 14, "#fff", "800 15px Be Vietnam Pro, sans-serif"); lab(ctx, d, 68, yy + 36, "#c3c7f0", "600 12px Be Vietnam Pro, sans-serif"); });
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive"), msg = TRY() ? ": " + TRY() : M.INBOX[0][1], r = score(msg);
    if (s === 0) el.innerHTML = `Tin có <span class="hl">${words(split(msg)[1]).length}</span> tiếng`;
    else if (s <= 2) el.innerHTML = `Tìm thấy <span class="hl">${r.hit.length}</span> từ có điểm · tổng <span class="w">${r.s.toFixed(1)}</span>`;
    else if (s === 3) el.innerHTML = `Điểm <span class="w">${r.s.toFixed(1)}</span> so với ngưỡng <span class="hl">${ST.thr}</span>`;
    else if (s === 4) el.innerHTML = `Máy học từ <span class="hl">${NS + NH}</span> tin có nhãn`;
    else el.innerHTML = `Máy lọc giúp em, <span class="hl">em</span> quyết định cuối cùng`;
  }

  // ---------- điều khiển ----------
  function bind() {
    const setThr = P.range("thr", () => ST.thr, (v) => (ST.thr = v), (v) => v, () => { renderInbox(); renderBrain(); renderTry(); renderChart(); });
    $("optNorm").onchange = (e) => { ST.norm = e.target.checked; refresh(); };
    $("tryText").addEventListener("input", () => { renderTry(); renderChart(); });
    $("btnShowTrain").onclick = () => { const l = $("trainList"); l.hidden = !l.hidden; $("btnShowTrain").innerHTML = HKA.icon("layers") + (l.hidden ? "Xem các tin máy đã học" : "Ẩn danh sách"); };
    $("btnResetTeach").onclick = () => { ST.teach.clear(); refresh(); };
    P.visible($("phone"), (v) => v && prog.done("read"));
    const clear = () => { ST.extra = []; ST.thr = THR0; setThr(); ST.norm = false; $("optNorm").checked = false; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke"); ST.brk = k;
      if (k === "obf") { ST.extra = M.OBF.slice(); refresh(); const lot = SC.slice(M.INBOX.length).filter((x) => x.s < ST.thr).length; guide(`Ba tin lừa mới viết kiểu <b>tr.ú.n.g</b>, <b>0TP</b>, <b>ch-uyển</b> ở cuối hộp thư: <b>${lot}/3</b> tin lọt lưới. Bật <b>Chuẩn hóa chữ trước khi đọc</b> xem sao.`); }
      if (k === "low") { ST.thr = -2; setThr(); refresh(); const mom = SC[1]; guide(`Ngưỡng bị hạ xuống <b>−2</b>. Tin của mẹ (${mom.s.toFixed(1)} điểm) bị <b>${mom.s >= ST.thr ? "chặn nhầm" : "cho qua"}</b>, cùng ${SC.filter((x) => !x.y && x.s >= ST.thr).length - 1} tin thật khác. Kéo ngưỡng lên, hoặc bấm <b>Tin an toàn</b> dưới tin của mẹ.`); }
      if (k === "new") { ST.extra = M.NEW.slice(); refresh(); const lot = SC.slice(M.INBOX.length).filter((x) => x.s < ST.thr).length; guide(`Hai tin lừa <b>kiểu mới</b> ở cuối hộp thư: <b>${lot}/2</b> tin lọt lưới vì máy chưa học những từ như "quét QR", "cộng tác viên". Bấm <b>Tin lừa đảo</b> dưới hai tin đó để dạy máy.`); }
      $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); refresh(); guide("Mọi sự cố đã tắt. Hộp thư trở lại 8 tin ban đầu, ngưỡng về " + THR0 + "."); };
  }

  const QUIZ = [
    { q: "Một tin nhắn xưng là ngân hàng, xin em đọc mã OTP vừa nhận. Em nên làm gì?", o: ["Đọc mã cho nhanh", "Không đưa mã cho bất kỳ ai và báo bố mẹ", "Hỏi lại họ tên rồi đọc mã", "Gửi mã cho bạn thân giữ hộ"], a: 1, e: "Mã OTP là chìa khóa của tài khoản. Không ai, kể cả ngân hàng, có quyền xin mã của em." },
    { q: "Kẻ gian viết \"tr.ú.n.g th.ư.ở.n.g\" thay vì \"trúng thưởng\" để làm gì?", o: ["Cho đẹp hơn", "Để máy lọc không nhận ra từ khóa và cho tin lọt qua", "Vì bàn phím bị hỏng", "Để tin nhắn ngắn hơn"], a: 1, e: "Máy tra điểm theo đúng từng chữ. Chữ bị chèn dấu chấm là chữ lạ với máy, trừ khi máy có bước chuẩn hóa." },
    { q: "Hạ ngưỡng chặn xuống thật thấp thì điều gì dễ xảy ra?", o: ["Không chặn tin nào", "Chặn nhầm cả tin nhắn thật của người thân", "Máy chạy nhanh hơn", "Tin lừa đảo lọt lưới nhiều hơn"], a: 1, e: "Ngưỡng thấp thì tin nào có vài từ đáng nghi cũng bị chặn, kể cả tin của mẹ nhắc chuyển khoản tiền điện." },
    { q: "Máy lọc biết điểm nghi ngờ của mỗi từ nhờ đâu?", o: ["Máy tự nghĩ ra", "Đếm từ đó xuất hiện trong các tin đã được dán nhãn lừa đảo hay an toàn", "Tra từ điển tiếng Việt", "Hỏi người gửi tin"], a: 1, e: "Máy học từ ví dụ có nhãn. Dán nhãn thêm tin mới thì điểm của các từ thay đổi theo." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 300);
  P.nav(); bind(); refresh(); guide("Mỗi tin có một <b>điểm nghi ngờ</b>. Tin nào điểm cao hơn ngưỡng sẽ bị chặn. Máy chấm có đúng không? Nếu sai, hãy bấm nút dưới tin để <b>dạy máy</b>!");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka25 = { ST, score, words, feats, train, refresh, get SC() { return SC; }, W: () => W };
  requestAnimationFrame(tick);
})();
