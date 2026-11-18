/* Hộp Kính AI · Sổ theo dõi tự học (chạy hoàn toàn trong trình duyệt của giáo viên) */
(function () {
  "use strict";
  const T = HKA.TUHOC, $ = (id) => document.getElementById(id), KEY = "hka-so-theo-doi";
  const LV = T.LV, LVK = T.LVK, SHORT = { T: "T", K: "K", D: "Đ", C: "C" };
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const norm = (s) => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  let DB = { recs: {} };
  try { DB = JSON.parse(localStorage.getItem(KEY)) || DB; } catch (e) {}
  const store = () => { try { localStorage.setItem(KEY, JSON.stringify(DB)); } catch (e) { msg("addMsg", "Trình duyệt hết chỗ lưu. Hãy sao lưu rồi xóa bớt.", true); } };
  const recs = () => Object.values(DB.recs);
  const who = (d) => `${norm(d.lop)}|${norm(d.ten)}`;
  const msg = (id, h, bad) => { $(id).innerHTML = h; $(id).className = "th-msg" + (bad ? " bad" : ""); };

  // ---------- nhận phiếu ----------
  function addText(text) {
    let add = 0, dup = 0, bad = 0, upd = 0;
    // tệp sao lưu
    if (/^\s*\{/.test(text)) { try { const o = JSON.parse(text); if (o && o.recs) { let n = 0; Object.values(o.recs).forEach((r) => { if (!DB.recs[r.id]) { DB.recs[r.id] = r; n++; } }); store(); render(); return `Đã khôi phục ${n} phiếu từ tệp sao lưu.`; } } catch (e) {} }
    T.decodeAll(text).forEach((x) => {
      if (!x.data) { bad++; return; }
      const id = T.fnv(x.code); if (DB.recs[id]) { dup++; return; }
      const d = x.data, same = recs().find((r) => r.data.p === d.p && who(r.data) === who(d));
      if (same) { if (same.data.ts >= d.ts) { dup++; return; } delete DB.recs[same.id]; upd++; }
      DB.recs[id] = { id, data: d, valid: x.valid, code: x.code, at: new Date().toISOString(), rv: {}, resub: !!same }; add++;
    });
    store(); render();
    const parts = []; if (add) parts.push(`thêm <b>${add - upd}</b> phiếu mới`); if (upd) parts.push(`cập nhật <b>${upd}</b> phiếu nộp lại`); if (dup) parts.push(`bỏ qua ${dup} phiếu đã có`); if (bad) parts.push(`<span style="color:var(--coral)">${bad} mã bị hỏng (có thể bị cắt mất khi sao chép)</span>`);
    return parts.length ? "Đã " + parts.join(", ") + "." : "Không tìm thấy mã phiếu nào. Mã phiếu bắt đầu bằng HKA1.";
  }
  $("btnAdd").onclick = () => { const r = addText($("paste").value); msg("addMsg", r, /Không tìm thấy/.test(r)); if (!/Không tìm thấy/.test(r)) $("paste").value = ""; };
  $("files").onchange = async (e) => { const out = []; for (const f of e.target.files) { const t = await f.text(); out.push(`${esc(f.name)}: ${addText(t)}`); } msg("addMsg", out.join("<br>")); e.target.value = ""; };

  // ---------- cảnh báo ----------
  function warnings(r) {
    const d = r.data, e = d.ev || {}, w = [];
    if (!r.valid) w.push("Mã kiểm tra không khớp: phiếu có thể đã bị sửa tay.");
    if (e.t < 10) w.push(`Thời gian học trên trang chỉ ${e.t} phút.`);
    if (e.total && e.done / e.total < 0.5) w.push(`Mới làm ${e.done}/${e.total} nhiệm vụ.`);
    (d.q4 || []).forEach((q, i) => { const a = norm(q.a); if (a.length < 30) return; const o = recs().find((x) => x.id !== r.id && x.data.p === d.p && norm(((x.data.q4 || [])[i] || {}).a) === a); if (o) w.push(`Câu giải thích ${i + 1} giống hệt phiếu của ${o.data.ten} (${o.data.lop}).`); });
    if (r.resub) w.push("Phiếu nộp lại: đã thay phiếu cũ, cần đánh giá lại.");
    return w;
  }

  // ---------- bảng ----------
  const projName = (p) => { const r = recs().find((x) => x.data.p === p); return r ? r.data.tt : ""; };
  function filtered() {
    const L = $("fLop").value, N = $("fNhanh").value, S = $("fState").value, Q = norm($("fName").value);
    return recs().filter((r) => (!L || r.data.lop === L) && (!N || r.data.b === N) && (!Q || norm(r.data.ten).includes(Q)) &&
      (!S || (S === "new" && !r.rv.all) || (S === "done" && r.rv.all) || (S === "warn" && warnings(r).length)));
  }
  function render() {
    const lops = [...new Set(recs().map((r) => r.data.lop))].sort(), cur = $("fLop").value;
    $("fLop").innerHTML = `<option value="">Mọi lớp</option>` + lops.map((l) => `<option${l === cur ? " selected" : ""}>${esc(l)}</option>`).join("");
    const F = filtered(), all = recs();
    $("stats").innerHTML = [["Tổng số phiếu", all.length], ["Chưa đánh giá", all.filter((r) => !r.rv.all).length], ["Có cảnh báo", all.filter((r) => warnings(r).length).length], ["Học sinh", new Set(all.map((r) => who(r.data))).size]].map(([t, v]) => `<div class="metric"><span>${t}</span><b>${v}</b></div>`).join("");
    if (!F.length) { $("grid").innerHTML = `<tbody><tr><td class="st-empty">${all.length ? "Không có phiếu nào khớp bộ lọc." : "Chưa có phiếu nào. Dán mã phiếu hoặc chọn tệp ở mục 1."}</td></tr></tbody>`; return; }
    const ps = [...new Set(F.map((r) => r.data.p))].sort((a, b) => a - b);
    const studs = [...new Map(F.map((r) => [who(r.data), r.data])).values()].sort((a, b) => a.lop.localeCompare(b.lop) || a.ten.split(" ").pop().localeCompare(b.ten.split(" ").pop(), "vi") || a.ten.localeCompare(b.ten, "vi"));
    const cell = (s, p) => { const r = F.find((x) => x.data.p === p && who(x.data) === who(s)); if (!r) return "<td></td>"; const w = warnings(r).length, a = r.rv.all;
      return `<td><button class="st-cell lv-${a || "none"}${w ? " warn" : ""}" data-id="${r.id}" title="${esc(s.ten)} · Dự án ${p}${w ? " · có cảnh báo" : ""}">${a ? SHORT[a] : "●"}</button></td>`; };
    $("grid").innerHTML = `<thead><tr><th>Lớp</th><th>Học sinh</th>${ps.map((p) => `<th title="${esc(projName(p))}">DA ${p}</th>`).join("")}<th>Đã nộp</th></tr></thead><tbody>` +
      studs.map((s) => `<tr><td>${esc(s.lop)}</td><td class="st-name">${esc(s.ten)}</td>${ps.map((p) => cell(s, p)).join("")}<td>${recs().filter((x) => who(x.data) === who(s)).length}</td></tr>`).join("") + "</tbody>";
    $("grid").querySelectorAll(".st-cell").forEach((b) => (b.onclick = () => open(b.dataset.id)));
  }
  ["fLop", "fNhanh", "fState"].forEach((id) => ($(id).onchange = render)); $("fName").oninput = render;

  // ---------- chi tiết và đánh giá ----------
  const QUICK = ["Em giải thích rõ ràng bằng lời của mình.", "Em cần giải thích bằng lời của em, không chép lại nội dung trên trang.", "Em làm thí nghiệm cẩn thận, số liệu hợp lí.", "Em nên thử thêm các sự cố ở phần Phá máy và giải thích vì sao máy sai.", "Câu hỏi và ý tưởng của em rất hay, hãy thử làm tiếp ở nhà.", "Em cần dành thêm thời gian để hoàn thành các nhiệm vụ của dự án."];
  const AUTO = { ht: { T: "Em hoàn thành đầy đủ các nhiệm vụ của dự án.", K: "Em hoàn thành phần lớn nhiệm vụ.", D: "Em cần làm thêm các nhiệm vụ còn thiếu.", C: "Em cần làm lại dự án và hoàn thành các nhiệm vụ." },
    hieu: { T: "Em hiểu bài, giải thích đúng và đủ ý.", K: "Em hiểu bài, cần giải thích đầy đủ hơn.", D: "Em cần ôn lại phần Soi bên trong và Thẻ kiến thức.", C: "Em cần học lại kiến thức chính của dự án." },
    vd: { T: "Em phân tích sự cố và cách sửa rất tốt.", K: "Em phân tích được sự cố, cần nói rõ hơn cách sửa.", D: "Em cần giải thích rõ vì sao máy sai.", C: "Em cần thử lại phần Phá máy." },
    tu: { T: "Em tự đánh giá sát và có ý tưởng riêng.", K: "Em tự đánh giá khá sát.", D: "Em cần tự đánh giá kĩ hơn.", C: "Em cần tự đánh giá bài làm của mình." } };
  let openId = null;
  function open(id) {
    const r = DB.recs[id]; if (!r) return; openId = id; const d = r.data, e = d.ev || {}, G = (window.HKA_GOIY || {})[d.p] || {}, w = warnings(r), rv = r.rv, sug = T.suggestHT(e);
    const sel = (k) => `<div class="th-rate">${LVK.map((l) => `<label class="th-lv"><input type="radio" name="g_${k}" value="${l}"${(rv[k] || (k === "ht" && !rv.ht ? sug : "")) === l ? " checked" : ""}><span title="${esc(T.RUBRIC.find((x) => x.k === k).m[l])}">${LV[l]}</span></label>`).join("")}</div>`;
    $("detail").hidden = false;
    $("detail").innerHTML = `<div class="st-dh"><div><p class="kicker" style="margin:0">DỰ ÁN ${d.p} · ${esc(d.b)} · ${esc(d.tt)}</p><h2 style="margin:4px 0">${esc(d.ten)} <span class="muted">· Lớp ${esc(d.lop)}</span></h2><p class="small muted" style="margin:0">Làm ngày ${esc(d.ngay)} · nhận vào sổ ${new Date(r.at).toLocaleString("vi-VN")}</p></div><button class="btn ghost small" id="dClose" type="button">Đóng</button></div>
      ${w.length ? `<div class="st-warn">${w.map((x) => `<p>${HKA.icon("alert")}${esc(x)}</p>`).join("")}</div>` : `<p class="st-ok">${HKA.icon("checkCircle")}Mã kiểm tra khớp, không có cảnh báo.</p>`}
      <div class="st-cols"><div>
        <h3>Minh chứng quá trình</h3><ul class="th-evl"><li class="${e.t >= 10 ? "ok" : ""}">${HKA.icon("clock")}<span>${e.t} phút học trên trang</span></li><li class="${e.done === e.total ? "ok" : ""}">${HKA.icon("checkCircle")}<span>Nhiệm vụ ${e.done}/${e.total}</span></li><li class="${e.soi >= e.soiN ? "ok" : ""}">${HKA.icon("scan")}<span>Soi tới bước ${e.soi}/${e.soiN}</span></li><li class="${(e.br || []).length >= 2 ? "ok" : ""}">${HKA.icon("bolt")}<span>Thử ${(e.br || []).length} sự cố${e.fix ? ", đã tắt sự cố" : ""}</span></li><li class="${e.badge ? "ok" : ""}">${HKA.icon("award")}<span>Kiểm tra: đúng lần đầu ${e.qFirst}/${e.qn}${e.badge ? ", có huy hiệu" : ""}</span></li></ul>
        ${(e.tasks || []).length ? `<p class="small muted">Nhiệm vụ đã xong: ${e.tasks.map(esc).join("; ")}</p>` : ""}
        <h3>Kết quả thí nghiệm</h3>${(d.q3 || []).map((x, i) => `<div class="st-qa"><p class="q">${esc(x.q)}</p><p class="a">${esc(x.a) || "<i>(bỏ trống)</i>"}</p>${G.q3 && G.q3[i] ? `<p class="h">Gợi ý: ${esc(G.q3[i])}</p>` : ""}</div>`).join("")}
        <h3>Giải thích bằng lời</h3>${(d.q4 || []).map((x, i) => `<div class="st-qa"><p class="q">${esc(x.q)}</p><p class="a">${esc(x.a)}</p>${G.q4 && G.q4[i] ? `<p class="h">Gợi ý: ${esc(G.q4[i])}</p>` : ""}</div>`).join("")}
        <h3>Phá máy và sửa</h3><div class="st-qa"><p class="q">${esc(d.br.t)}</p><p class="a"><b>Vì sao sai:</b> ${esc(d.br.why)}<br><b>Cách sửa:</b> ${esc(d.br.fix) || "<i>(bỏ trống)</i>"}</p></div>
        <h3>Học sinh tự đánh giá</h3><p>${T.RUBRIC.map((x) => `${x.n}: <b>${LV[d.s[x.k]] || "?"}</b>`).join(" · ")}</p>
        <div class="st-qa"><p class="q">Thắc mắc</p><p class="a">${esc(d.hoi) || "<i>(không)</i>"}</p><p class="q">Ý tưởng mở rộng</p><p class="a">${esc(d.yt) || "<i>(không)</i>"}</p></div>
      </div><div class="st-grade">
        <h3>Giáo viên đánh giá</h3>
        ${T.RUBRIC.map((x) => `<div class="st-crit"><b>${x.n}</b>${x.k === "ht" ? `<span class="small muted">Gợi ý từ minh chứng: ${LV[sug]}</span>` : ""}${sel(x.k)}</div>`).join("")}
        <div class="st-crit"><b>Mức chung</b><span class="small muted" id="allHint"></span><div class="th-rate">${LVK.map((l) => `<label class="th-lv"><input type="radio" name="g_all" value="${l}"${rv.all === l ? " checked" : ""}><span>${LV[l]}</span></label>`).join("")}</div></div>
        <label class="st-lab">Nhận xét<textarea id="nx" rows="4">${esc(rv.nx || "")}</textarea></label>
        <div class="st-chips"><button class="chip" type="button" id="autoNx">${HKA.icon("sparkle")}Gợi ý nhận xét từ các mức</button>${QUICK.map((q, i) => `<button class="chip" type="button" data-q="${i}">${esc(q)}</button>`).join("")}</div>
        <div class="btn-row" style="margin-top:12px"><button class="btn accent" id="dSave" type="button">${HKA.icon("checkCircle")}Lưu và mở phiếu chưa đánh giá tiếp theo</button><button class="btn ghost small" id="dDel" type="button">Xóa phiếu này</button></div>
        <p id="dMsg" class="th-msg" aria-live="polite"></p>
      </div></div>`;
    const get = (k) => { const c = $("detail").querySelector(`input[name="g_${k}"]:checked`); return c ? c.value : ""; };
    const lv4 = () => Object.fromEntries(T.RUBRIC.map((x) => [x.k, get(x.k)]));
    const hint = () => { const o = T.overall(lv4()); $("allHint").textContent = o ? `Gợi ý: ${LV[o]}` : "Chọn đủ 4 tiêu chí để có gợi ý"; if (o && !get("all")) { const c = $("detail").querySelector(`input[name="g_all"][value="${o}"]`); if (c) c.checked = true; } };
    $("detail").querySelectorAll('input[type=radio]:not([name="g_all"])').forEach((x) => (x.onchange = hint)); hint();
    $("detail").querySelectorAll("[data-q]").forEach((b) => (b.onclick = () => { const t = $("nx"); t.value = (t.value ? t.value.trim() + " " : "") + QUICK[+b.dataset.q]; }));
    $("autoNx").onclick = () => { const L = lv4(); $("nx").value = T.RUBRIC.filter((x) => L[x.k]).map((x) => AUTO[x.k][L[x.k]]).join(" "); };
    $("dClose").onclick = () => { $("detail").hidden = true; openId = null; };
    $("dDel").onclick = () => { if ($("dDel").dataset.sure) { delete DB.recs[id]; store(); $("detail").hidden = true; render(); } else { $("dDel").dataset.sure = 1; $("dDel").textContent = "Bấm lần nữa để xóa"; } };
    $("dSave").onclick = () => {
      const L = lv4(), all = get("all"); if (!all) { msg("dMsg", "Hãy chọn mức chung.", true); return; }
      r.rv = { ...L, all, nx: $("nx").value.trim(), at: new Date().toISOString() }; r.resub = false; store(); render();
      const next = filtered().find((x) => !x.rv.all); if (next) open(next.id); else { msg("dMsg", "Đã lưu. Không còn phiếu nào chưa đánh giá trong bộ lọc hiện tại."); }
    };
    $("detail").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ---------- xuất, sao lưu ----------
  const dl = (name, text, type) => { const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  const today = () => new Date().toISOString().slice(0, 10);
  $("btnCsv").onclick = () => {
    const q = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
    const head = ["Lớp", "Họ và tên", "Dự án", "Tên dự án", "Nhánh", "Ngày làm", "Thời gian (phút)", "Nhiệm vụ", "Soi", "Sự cố đã thử", "Kiểm tra đúng lần đầu", "HS tự đánh giá", "Hoàn thành nhiệm vụ", "Hiểu bài", "Vận dụng", "Tự học, tự đánh giá", "Mức chung", "Nhận xét", "Cảnh báo"];
    const rows = filtered().sort((a, b) => a.data.lop.localeCompare(b.data.lop) || a.data.ten.localeCompare(b.data.ten, "vi") || a.data.p - b.data.p).map((r) => { const d = r.data, e = d.ev || {}, v = r.rv;
      return [d.lop, d.ten, d.p, d.tt, d.b, d.ngay, e.t, `${e.done}/${e.total}`, `${e.soi}/${e.soiN}`, (e.br || []).length, `${e.qFirst}/${e.qn}`, T.RUBRIC.map((x) => LV[d.s[x.k]] || "").join(" / "), LV[v.ht] || "", LV[v.hieu] || "", LV[v.vd] || "", LV[v.tu] || "", LV[v.all] || "Chưa đánh giá", v.nx || "", warnings(r).join(" ")].map(q).join(","); });
    dl(`so-theo-doi-tu-hoc-${today()}.csv`, "﻿" + [head.map(q).join(","), ...rows].join("\r\n"), "text/csv;charset=utf-8");
  };
  $("btnBak").onclick = () => dl(`sao-luu-so-theo-doi-${today()}.json`, JSON.stringify(DB), "application/json");
  $("btnClear").onclick = () => { const b = $("btnClear"); if (b.dataset.sure) { DB = { recs: {} }; store(); render(); $("detail").hidden = true; b.dataset.sure = ""; b.innerHTML = HKA.icon("alert") + "Xóa toàn bộ sổ trên máy này"; msg("clearMsg", "Đã xóa toàn bộ sổ trên máy này."); } else { b.dataset.sure = 1; b.textContent = "Bấm lần nữa để xóa hẳn (nên sao lưu trước)"; } };
  $("rubricHelp").innerHTML = `<div class="st-grid-wrap"><table class="st-rub"><thead><tr><th>Tiêu chí</th>${LVK.map((l) => `<th>${LV[l]}</th>`).join("")}</tr></thead><tbody>${T.RUBRIC.map((x) => `<tr><td><b>${x.n}</b></td>${LVK.map((l) => `<td>${esc(x.m[l])}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  window.__so = { DB, addText, open, render };
  render();
})();
