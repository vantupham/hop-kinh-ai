/* Hộp Kính AI · Phiếu tự học sau mỗi dự án
   - Tự ghi minh chứng quá trình học trên trang (thời gian, nhiệm vụ, soi, phá máy, kiểm tra), chỉ lưu trên máy học sinh.
   - Học sinh điền phiếu, tạo MÃ PHIẾU (có mã kiểm tra), nộp qua bất kỳ kênh nào: sao chép mã, chia sẻ, tải tệp, in/lưu PDF, Google Biểu mẫu.
   - Dùng chung với trang giáo viên giao-vien/so-theo-doi.html (HKA.TUHOC.decode).
   Trên trang dự án: <script src="../../assets/tu-hoc.js" data-du-an="1"></script> */
(function () {
  "use strict";
  const LV = { T: "Tốt", K: "Khá", D: "Đạt", C: "Chưa đạt" }, LVK = ["T", "K", "D", "C"];
  const RUBRIC = [
    { k: "ht", n: "Hoàn thành nhiệm vụ", m: { T: "Làm đủ các nhiệm vụ, thử ít nhất 2 sự cố, hoàn thành bài kiểm tra", K: "Làm được phần lớn nhiệm vụ", D: "Làm được khoảng một nửa nhiệm vụ", C: "Làm được ít nhiệm vụ" } },
    { k: "hieu", n: "Hiểu bài", m: { T: "Giải thích đúng, đủ ý bằng lời của mình, dùng đúng thuật ngữ", K: "Giải thích đúng nhưng chưa đủ ý", D: "Đúng một phần, còn lúng túng hoặc chép lại", C: "Chưa giải thích được hoặc giải thích sai" } },
    { k: "vd", n: "Vận dụng", m: { T: "Số liệu hợp lí; nêu đúng nguyên nhân và cách sửa sự cố", K: "Số liệu hợp lí; nêu được nguyên nhân hoặc cách sửa", D: "Có số liệu nhưng phân tích sự cố còn sai sót", C: "Thiếu số liệu, chưa phân tích được sự cố" } },
    { k: "tu", n: "Tự học, tự đánh giá", m: { T: "Tự đánh giá sát thực tế, có câu hỏi hoặc ý tưởng của riêng mình", K: "Tự đánh giá khá sát, có câu hỏi hoặc ý tưởng", D: "Tự đánh giá chưa sát hoặc còn sơ sài", C: "Chưa tự đánh giá" } }
  ];
  // ---------- mã phiếu ----------
  const SALT = "hop-kinh-ai/tu-hoc/v1";
  function fnv(s) { let h = 0x811c9dc5; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, "0"); }
  function b64e(str) { const b = new TextEncoder().encode(str); let s = ""; b.forEach((x) => (s += String.fromCharCode(x))); return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
  function b64d(s) { s = s.replace(/-/g, "+").replace(/_/g, "/"); while (s.length % 4) s += "="; const bin = atob(s), b = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i); return new TextDecoder().decode(b); }
  function encode(obj) { const j = JSON.stringify(obj); return `HKA1.${obj.p}.${b64e(j)}.${fnv(j + SALT)}`; }
  const CODE_RE = /HKA1\.(\d{1,2})\.([A-Za-z0-9_\-\s]+?)\.([0-9a-f]{8})(?![0-9a-f])/g;
  function decodeAll(text) {
    const out = []; let m; CODE_RE.lastIndex = 0;
    while ((m = CODE_RE.exec(text))) {
      try { const j = b64d(m[2].replace(/\s+/g, "")), o = JSON.parse(j); out.push({ data: o, valid: fnv(j + SALT) === m[3] && String(o.p) === m[1], code: m[0].replace(/\s+/g, "") }); } catch (e) { out.push({ data: null, valid: false, code: m[0] }); }
    }
    return out;
  }
  function suggestHT(ev) {
    if (!ev) return "C"; const r = ev.total ? ev.done / ev.total : 0, br = (ev.br || []).length;
    return r >= 0.85 && br >= 2 && ev.badge ? "T" : r >= 0.65 ? "K" : r >= 0.4 ? "D" : "C";
  }
  function overall(lv) { // lv: {ht,hieu,vd,tu} → mức chung gợi ý
    const v = RUBRIC.map((r) => lv[r.k]).filter(Boolean); if (v.length < 4) return "";
    const sc = { T: 4, K: 3, D: 2, C: 1 }, avg = v.reduce((s, x) => s + sc[x], 0) / 4, anyC = v.includes("C");
    let k = avg >= 3.5 ? "T" : avg >= 2.75 ? "K" : avg >= 1.75 ? "D" : "C"; if (anyC && (k === "T" || k === "K")) k = "D"; return k;
  }
  window.HKA = window.HKA || {};
  HKA.TUHOC = { LV, LVK, RUBRIC, encode, decodeAll, suggestHT, overall, fnv };

  // ---------- trên trang dự án ----------
  const me = document.currentScript, NUM = me && +me.dataset.duAn;
  if (!NUM) return;
  const $ = (id) => document.getElementById(id), EVK = "hka-tuhoc-ev-" + NUM, DRK = "hka-tuhoc-phieu-" + NUM;
  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ev = load(EVK, { t: 0, soi: 0, br: {}, fix: 0, qz: {}, qc: 0, first: new Date().toISOString() });
  const saveEv = () => save(EVK, ev);
  // thời gian học thật: chỉ tính khi trang đang mở và có thao tác trong 90 giây gần nhất
  let lastAct = Date.now();
  ["pointerdown", "keydown", "scroll", "input"].forEach((e) => addEventListener(e, () => (lastAct = Date.now()), { passive: true }));
  setInterval(() => { if (document.visibilityState === "visible" && Date.now() - lastAct < 90000) { ev.t += 5; if (ev.t % 30 === 0) saveEv(); } }, 5000);
  addEventListener("pagehide", saveEv);
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-break]"); if (b) { ev.br[b.dataset.break] = 1; saveEv(); }
    if (e.target.closest("#btnFixAll")) { ev.fix = 1; saveEv(); }
    const q = e.target.closest("#quiz .opts button");
    if (q) { const qi = q.closest(".q").dataset.i; ev.qc++; if (!(qi in ev.qz)) ev.qz[qi] = q.classList.contains("right") ? 1 : 0; saveEv(); }
  });
  const chip = $("soiChip");
  if (chip) new MutationObserver(() => { const m = chip.textContent.match(/(\d+)\s*\/\s*(\d+)/); if (m && +m[1] > ev.soi) { ev.soi = +m[1]; ev.soiN = +m[2]; saveEv(); } }).observe(chip, { childList: true, characterData: true, subtree: true });

  function evidence() {
    const items = [...document.querySelectorAll("#checklist li")], done = items.filter((li) => li.classList.contains("done"));
    const nq = document.querySelectorAll("#quiz .q").length, first = Object.values(ev.qz).filter((x) => x).length;
    return { t: Math.round(ev.t / 60), done: done.length, total: items.length, tasks: done.map((li) => li.textContent.trim()), soi: ev.soi || 0, soiN: ev.soiN || document.querySelectorAll("#pipeline .node").length,
      br: Object.keys(ev.br), fix: ev.fix, qn: nq, qFirst: first, qTried: Object.keys(ev.qz).length, qc: ev.qc, badge: !!($("badge") && !$("badge").hidden), first: ev.first };
  }

  // ---------- giao diện phiếu ----------
  const DATA = (window.HKA_TUHOC || {})[NUM] || { q3: ["Số liệu quan trọng nhất em đo được trong dự án"], q4: ["Điều quan trọng nhất em học được trong dự án này là gì? Giải thích bằng lời của em."] };
  const title = (document.querySelector("h1") || {}).textContent ? document.querySelector("h1").textContent.replace(/\s+/g, " ").trim() : "";
  const branch = /THCS/.test((document.querySelector(".crumbs") || {}).textContent || "") ? "THCS" : "Nâng cao";
  const breaks = [...document.querySelectorAll(".break")].map((c) => ({ k: (c.querySelector("[data-break]") || {}).dataset?.break, t: (c.querySelector("h3") || {}).textContent || "" })).filter((b) => b.k);
  const secs = document.querySelectorAll("section.sec"), last = secs[secs.length - 1];
  if (!last) return;
  const kn = String(secs.length + 1).padStart(2, "0");
  const sec = document.createElement("section"); sec.id = "tu-hoc"; sec.className = "sec";
  const rate = (k) => `<div class="th-rate" role="radiogroup" aria-label="${esc(RUBRIC.find((r) => r.k === k).n)}">${LVK.map((l) => `<label class="th-lv"><input type="radio" name="s_${k}" value="${l}"><span>${LV[l]}</span></label>`).join("")}</div>`;
  sec.innerHTML = `<div class="wrap">
  <div class="sec-head"><div class="kicker"><span class="kn">${kn}</span>Phiếu tự học<span class="kl"></span></div>
    <h2>Phiếu tự học sau dự án</h2><p class="lead">Làm phiếu này sau khi em học xong dự án. Phần minh chứng do trang tự ghi lại, các phần còn lại em trả lời bằng lời của mình. Xong thì tạo <b>mã phiếu</b> và nộp cho thầy cô qua kênh lớp em đang dùng.</p></div>
  <form class="th-form" id="thForm" novalidate>
    <div class="card th-part"><h3><span class="th-no">1</span>Thông tin</h3>
      <div class="th-row"><label>Họ và tên<input name="ten" autocomplete="name" required></label><label>Lớp<input name="lop" required placeholder="ví dụ 7A2"></label><label>Ngày làm<input name="ngay" type="date"></label></div></div>
    <div class="card th-part th-ev"><h3><span class="th-no">2</span>Minh chứng quá trình <span class="small muted">· trang tự ghi, em không cần điền</span></h3><div id="thEv"></div></div>
    <div class="card th-part"><h3><span class="th-no">3</span>Kết quả thí nghiệm của em</h3>${DATA.q3.map((q, i) => `<label class="th-q">${esc(q)}<input name="q3_${i}"></label>`).join("")}</div>
    <div class="card th-part"><h3><span class="th-no">4</span>Giải thích bằng lời của em</h3>${DATA.q4.map((q, i) => `<label class="th-q">${esc(q)}<textarea name="q4_${i}" rows="3" required></textarea></label>`).join("")}</div>
    <div class="card th-part"><h3><span class="th-no">5</span>Phá máy và sửa</h3>
      <label class="th-q">Em chọn sự cố nào?<select name="br"><option value="">Chọn một sự cố</option>${breaks.map((b, i) => `<option value="${esc(b.k)}">Sự cố ${i + 1}: ${esc(b.t)}</option>`).join("")}</select></label>
      <label class="th-q">Máy sai thế nào? Vì sao?<textarea name="brWhy" rows="2" required></textarea></label>
      <label class="th-q">Em đã sửa thế nào? Sau khi sửa máy chạy ra sao?<textarea name="brFix" rows="2"></textarea></label></div>
    <div class="card th-part"><h3><span class="th-no">6</span>Tự đánh giá</h3>
      <div class="th-rub">${RUBRIC.map((r) => `<div class="th-rr"><div><b>${r.n}</b><span class="small muted">Tốt: ${esc(r.m.T)}</span></div>${rate(r.k)}</div>`).join("")}</div>
      <label class="th-q">Điều em còn thắc mắc<textarea name="hoi" rows="2"></textarea></label>
      <label class="th-q">Ý tưởng của em để mở rộng dự án<textarea name="ytuong" rows="2"></textarea></label></div>
    <p class="th-msg" id="thMsg" aria-live="polite"></p>
    <div class="btn-row"><button class="btn accent" type="submit">${HKA.icon("checkCircle")}Hoàn tất và tạo mã phiếu</button><span class="small muted">Phiếu tự lưu trên máy này, em có thể quay lại sửa.</span></div>
  </form>
  <div class="card th-out" id="thOut" hidden>
    <h3>${HKA.icon("award")}Mã phiếu của em</h3>
    <p class="small">Gửi mã này cho thầy cô qua kênh lớp em đang dùng (Zalo, Google Classroom, email, LMS…), hoặc tải tệp phiếu, in ra giấy. Nếu sửa phiếu, hãy tạo mã mới và gửi lại.</p>
    <textarea id="thCode" rows="4" readonly aria-label="Mã phiếu"></textarea>
    <div class="btn-row" style="margin-top:10px"><button class="btn accent" type="button" id="thCopy">${HKA.icon("layers")}Sao chép mã</button><button class="btn" type="button" id="thShare">${HKA.icon("send")}Chia sẻ</button><button class="btn" type="button" id="thFile">${HKA.icon("upload")}Tải tệp phiếu</button><button class="btn" type="button" id="thPrint">${HKA.icon("book")}In hoặc lưu PDF</button><button class="btn" type="button" id="thForm2" hidden>${HKA.icon("globe")}Nộp qua Google Biểu mẫu</button></div>
    <p class="small th-msg" id="thNote" hidden>Mã phiếu đã được sao chép. Trong biểu mẫu, em dán (giữ ngón tay hoặc Ctrl+V) vào ô <b>Mã phiếu</b>.</p>
  </div></div>`;
  last.insertAdjacentElement("afterend", sec);
  const steps = document.querySelector(".steps .wrap") || document.querySelector(".steps");
  if (steps && !steps.querySelector('a[href="#tu-hoc"]')) steps.insertAdjacentHTML("beforeend", `<a href="#tu-hoc">${HKA.icon("layers")}Phiếu tự học</a>`);
  if (window.HKA.P && HKA.P.nav) { /* nav đã chạy trước, gắn thêm quan sát cho mục mới */ const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) document.querySelectorAll(".steps a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#tu-hoc")); }), { rootMargin: "-45% 0px -50% 0px" }); io.observe(sec); }

  const form = $("thForm"), f = (n) => form.elements[n];
  function renderEv() {
    const e = evidence(), row = (ok, t) => `<li class="${ok ? "ok" : ""}">${HKA.icon(ok ? "checkCircle" : "help")}<span>${t}</span></li>`;
    $("thEv").innerHTML = `<ul class="th-evl">
      ${row(e.t >= 10, `Thời gian học trên trang: <b>${e.t} phút</b>`)}
      ${row(e.done === e.total && e.total > 0, `Nhiệm vụ đã xong: <b>${e.done}/${e.total}</b>`)}
      ${row(e.soi >= e.soiN && e.soiN > 0, `Soi bên trong: tới bước <b>${e.soi}/${e.soiN}</b>`)}
      ${row(e.br.length >= 2, `Phá máy: đã thử <b>${e.br.length}/${breaks.length}</b> sự cố${e.fix ? ", đã bấm tắt mọi sự cố" : ""}`)}
      ${row(e.badge, `Bài kiểm tra: đúng ngay lần đầu <b>${e.qFirst}/${e.qn}</b> câu${e.badge ? ", đã nhận huy hiệu" : ""}`)}</ul>
      <p class="small muted" style="margin:6px 0 0">Muốn minh chứng đầy đủ hơn? Quay lên làm tiếp các nhiệm vụ, rồi quay lại đây.</p>`;
  }
  // lưu nháp
  const draft = load(DRK, {});
  [...form.elements].forEach((el) => { if (!el.name) return; if (el.type === "radio") el.checked = draft[el.name] === el.value; else if (draft[el.name] != null) el.value = draft[el.name]; });
  if (!f("ngay").value) f("ngay").value = new Date().toISOString().slice(0, 10);
  form.addEventListener("input", () => { const d = {}; [...form.elements].forEach((el) => { if (!el.name) return; if (el.type === "radio") { if (el.checked) d[el.name] = el.value; } else d[el.name] = el.value; }); save(DRK, d); });
  new IntersectionObserver((es) => { if (es[0].isIntersecting) renderEv(); }).observe(sec); renderEv();

  function collect() {
    const v = (n) => (f(n) ? f(n).value.trim() : ""), s = {}; RUBRIC.forEach((r) => { const c = form.querySelector(`input[name="s_${r.k}"]:checked`); s[r.k] = c ? c.value : ""; });
    const brk = v("br"), bt = breaks.find((b) => b.k === brk);
    return { v: 1, p: NUM, b: branch, tt: title, ten: v("ten"), lop: v("lop").toUpperCase(), ngay: v("ngay"), ts: new Date().toISOString(), ev: evidence(),
      q3: DATA.q3.map((q, i) => ({ q, a: v("q3_" + i) })), q4: DATA.q4.map((q, i) => ({ q, a: v("q4_" + i) })),
      br: { k: brk, t: bt ? bt.t : "", why: v("brWhy"), fix: v("brFix") }, s, hoi: v("hoi"), yt: v("ytuong") };
  }
  function problems(o) {
    const p = []; if (!o.ten) p.push("họ và tên"); if (!o.lop) p.push("lớp");
    o.q4.forEach((x, i) => { if (x.a.length < 20) p.push(`câu giải thích ${i + 1} (viết ít nhất một câu đầy đủ)`); });
    if (!o.br.k) p.push("chọn một sự cố"); if (o.br.why.length < 15) p.push("giải thích vì sao máy sai");
    if (RUBRIC.some((r) => !o.s[r.k])) p.push("tự đánh giá đủ 4 tiêu chí"); return p;
  }
  let cur = null;
  form.addEventListener("submit", (e) => {
    e.preventDefault(); renderEv(); const o = collect(), p = problems(o);
    if (p.length) { $("thMsg").innerHTML = `${HKA.icon("alert")}Em còn thiếu: <b>${p.join(", ")}</b>.`; $("thMsg").className = "th-msg bad"; return; }
    $("thMsg").textContent = ""; cur = o; $("thCode").value = encode(o); $("thOut").hidden = false;
    const cfg = window.HKA_CFG || {}; $("thForm2").hidden = !(cfg.formUrl && cfg.entry && cfg.entry.ma);
    $("thOut").scrollIntoView({ behavior: "smooth", block: "center" });
  });
  const copy = async (t) => { try { await navigator.clipboard.writeText(t); return true; } catch (e) { const ta = $("thCode"); ta.select(); try { return document.execCommand("copy"); } catch (e2) { return false; } } };
  const flash = (b, t) => { const o = b.innerHTML; b.innerHTML = HKA.icon("checkCircle") + t; setTimeout(() => (b.innerHTML = o), 1800); };
  function summary(o) {
    const e = o.ev, L = [`PHIẾU TỰ HỌC · HỘP KÍNH AI`, `Dự án ${o.p} (${o.b}): ${o.tt}`, `Học sinh: ${o.ten} · Lớp ${o.lop} · Ngày ${o.ngay}`, "",
      `MINH CHỨNG: ${e.t} phút · nhiệm vụ ${e.done}/${e.total} · soi ${e.soi}/${e.soiN} · phá máy ${e.br.length} sự cố · kiểm tra đúng lần đầu ${e.qFirst}/${e.qn}${e.badge ? " · có huy hiệu" : ""}`, "",
      "KẾT QUẢ THÍ NGHIỆM", ...o.q3.map((x) => `- ${x.q}: ${x.a || "(bỏ trống)"}`), "", "GIẢI THÍCH", ...o.q4.map((x, i) => `${i + 1}. ${x.q}\n   ${x.a}`), "",
      `PHÁ MÁY: ${o.br.t}`, `- Vì sao sai: ${o.br.why}`, `- Cách sửa: ${o.br.fix || "(bỏ trống)"}`, "", "TỰ ĐÁNH GIÁ: " + RUBRIC.map((r) => `${r.n}: ${LV[o.s[r.k]]}`).join(" · "),
      `Thắc mắc: ${o.hoi || "(không)"}`, `Ý tưởng: ${o.yt || "(không)"}`, "", "MÃ PHIẾU (gửi nguyên văn cho thầy cô):", encode(o)];
    return L.join("\n");
  }
  $("thCopy").onclick = async () => { if (await copy($("thCode").value)) flash($("thCopy"), "Đã sao chép"); };
  $("thShare").onclick = async () => { const t = summary(cur); if (navigator.share) { try { await navigator.share({ title: `Phiếu tự học Dự án ${NUM}`, text: t }); return; } catch (e) { if (e && e.name === "AbortError") return; } } if (await copy(t)) flash($("thShare"), "Đã sao chép, dán vào tin nhắn"); };
  $("thFile").onclick = () => { const slug = (cur.ten || "hoc-sinh").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").replace(/[^A-Za-z0-9]+/g, "-").toLowerCase(); const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + summary(cur)], { type: "text/plain;charset=utf-8" })); a.download = `phieu-tu-hoc-du-an-${String(NUM).padStart(2, "0")}-${cur.lop.toLowerCase()}-${slug}.txt`; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  $("thPrint").onclick = () => {
    let root = $("thPrintRoot"); if (!root) { root = document.createElement("div"); root.id = "thPrintRoot"; document.body.appendChild(root); }
    root.innerHTML = `<pre>${esc(summary(cur))}</pre>`; document.body.classList.add("th-printing"); setTimeout(() => { window.print(); setTimeout(() => document.body.classList.remove("th-printing"), 500); }, 50);
  };
  $("thForm2").onclick = async () => {
    const c = window.HKA_CFG, E = c.entry, code = $("thCode").value, q = new URLSearchParams({ usp: "pp_url" });
    if (E.ten) q.set(E.ten, cur.ten); if (E.lop) q.set(E.lop, cur.lop); if (E.duAn) q.set(E.duAn, `Dự án ${NUM}: ${title}`);
    let url = c.formUrl + "?" + q.toString(); const withCode = url + "&" + encodeURIComponent(E.ma) + "=" + encodeURIComponent(code);
    if (withCode.length < 7500) url = withCode; else { await copy(code); $("thNote").hidden = false; }
    window.open(url, "_blank", "noopener");
  };
})();
