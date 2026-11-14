/* Hộp Kính AI · Dự án 21 · Đoán con vật bằng câu hỏi Có/Không (cây quyết định, khóa lưỡng phân, máy học từ lỗi sai) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw, Z = window.ZOO;
  const prog = P.progress("hka-21");
  const Q = Object.assign({}, Z.Q, { to: { q: "Con vật có to không?", s: "To không?" } });
  const ALL = Z.ANIMALS.slice(), byId = (id) => ALL.concat([Z.STRANGER]).find((a) => a.id === id);
  const qText = (k) => (k.startsWith("is:") ? `Có phải con ${byId(k.slice(3)).name.toLowerCase()} không?` : Q[k].q);
  const qShort = (k) => (k.startsWith("is:") ? byId(k.slice(3)).name + "?" : Q[k].s);
  const truth = (a, k) => (k.startsWith("is:") ? (a.id === k.slice(3) ? 1 : 0) : a.t[k]);

  // ---------- hình con vật cho canvas ----------
  const IMG = {}; ALL.concat([Z.STRANGER]).forEach((a) => { const im = new Image(); im.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(a.icon); IMG[a.id] = im; });

  // ---------- dựng cây ----------
  const leaf = (id) => ({ leaf: id });
  function balanced(ids, keys) {
    if (ids.length <= 1) return leaf(ids[0]);
    keys = keys || Object.keys(Z.Q); let best = null, bd = 1e9;
    for (const k of keys) { const y = ids.filter((id) => byId(id).t[k]).length, d = Math.abs(ids.length - 2 * y); if (y && y < ids.length && d < bd) { bd = d; best = k; } }
    if (!best) return leaf(ids[0]);
    return { q: best, yes: balanced(ids.filter((id) => byId(id).t[best]), keys), no: balanced(ids.filter((id) => !byId(id).t[best]), keys) };
  }
  function chain(ids) { return ids.length === 1 ? leaf(ids[0]) : { q: "is:" + ids[0], yes: leaf(ids[0]), no: chain(ids.slice(1)) }; }
  const START = () => ({ q: "xs", yes: { q: "longvu", yes: leaf("chimse"), no: leaf("meo") }, no: { q: "chan6", yes: leaf("buom"), no: leaf("giun") } });
  function basketsFrom(ids) { return { set: ids.slice() }; }
  function leaves(n, out) { out = out || []; if (!n) return out; if (n.leaf || n.set) out.push(n); else { leaves(n.yes, out); leaves(n.no, out); } return out; }
  function depthOf(n, id, d) { d = d || 0; if (!n) return -1; if (n.leaf) return n.leaf === id ? d : -1; if (n.set) return n.set.length === 1 && n.set[0] === id ? d : -1; const a = depthOf(n.yes, id, d + 1); return a >= 0 ? a : depthOf(n.no, id, d + 1); }
  function countQ(n) { return !n || n.leaf || n.set ? 0 : 1 + countQ(n.yes) + countQ(n.no); }
  function known(n) { return leaves(n).filter((l) => l.leaf || (l.set && l.set.length === 1)).map((l) => l.leaf || l.set[0]); }

  // ---------- trạng thái ----------
  const ST = { mode: "play", play: START(), build: basketsFrom(ALL.map((a) => a.id)), phase: "idle", node: null, path: [], ans: [], guessLeaf: null, secret: null, wins: 0, losses: 0, sel: null, t: 0, pulse: 0, ambig: null, extra: [] };
  const zooList = () => ALL.concat(ST.extra);

  // ---------- vẽ cây ----------
  function layout(tree, W, H, top) {
    const L = leaves(tree), n = L.length, pos = new Map(); let maxD = 0;
    (function md(t, d) { maxD = Math.max(maxD, d); if (!(t.leaf || t.set)) { md(t.yes, d + 1); md(t.no, d + 1); } })(tree, 0);
    const dy = Math.min(92, (H - top - 70) / Math.max(1, maxD)), dx = W / n; let k = 0;
    (function place(t, d) { if (t.leaf || t.set) { pos.set(t, { x: dx * (k++ + 0.5), y: top + d * dy }); return; } place(t.yes, d + 1); place(t.no, d + 1); const a = pos.get(t.yes), b = pos.get(t.no); pos.set(t, { x: (a.x + b.x) / 2, y: top + d * dy }); })(tree, 0);
    return { pos, dx, dy };
  }
  const NODES = [];
  function drawTree(ctx, tree, o) {
    o = o || {}; const W = o.W || ctx.canvas.width, H = o.H || ctx.canvas.height, top = o.top || 40, { pos, dx } = layout(tree, W, H, top), hl = new Set(o.path || []), TH = P.TH;
    const isz = Math.max(22, Math.min(48, dx - 10)), clickable = o.clickable;
    if (clickable) NODES.length = 0;
    (function edges(t) { if (t.leaf || t.set) return; const a = pos.get(t); [["yes", "Có", "#5ef2d6"], ["no", "Không", "#ff8f6b"]].forEach(([k, lbl, col]) => { const c = t[k], b = pos.get(c), on = hl.has(t) && hl.has(c); ctx.strokeStyle = on ? "#ffc34d" : col + "99"; ctx.lineWidth = on ? 5 : 2.2; ctx.beginPath(); ctx.moveTo(a.x, a.y + 14); ctx.bezierCurveTo(a.x, (a.y + b.y) / 2, b.x, (a.y + b.y) / 2, b.x, b.y - 14); ctx.stroke(); const mx = (a.x + b.x) / 2 + (k === "yes" ? -6 : 6), my = (a.y + b.y) / 2 - 4; ctx.font = "700 10px Be Vietnam Pro, sans-serif"; const tw = ctx.measureText(lbl).width + 8; ctx.fillStyle = "rgba(18,22,51,.9)"; D.rr(ctx, mx - tw / 2, my - 9, tw, 15, 5); ctx.fill(); ctx.fillStyle = col; ctx.fillText(lbl, mx - tw / 2 + 4, my + 2); edges(c); }); })(tree);
    (function nodes(t) {
      const p = pos.get(t), on = hl.has(t), cur = o.cur === t;
      if (t.leaf || t.set) {
        const ids = t.leaf ? [t.leaf] : t.set, single = ids.length === 1, wrong = o.wrongLeaf === t;
        if (single) { const s = isz; ctx.fillStyle = cur ? "rgba(255,195,77,.35)" : on ? "rgba(255,195,77,.18)" : "rgba(35,40,102,.85)"; D.rr(ctx, p.x - s / 2 - 4, p.y - s / 2 - 4, s + 8, s + 8, 10); ctx.fill(); if (wrong) { ctx.strokeStyle = "#ff5d5d"; ctx.lineWidth = 3; ctx.stroke(); } const im = IMG[ids[0]]; if (im.complete) ctx.drawImage(im, p.x - s / 2, p.y - s / 2, s, s); ctx.fillStyle = "#e8eaff"; ctx.font = `600 ${Math.max(9, Math.min(12, dx / 6))}px Be Vietnam Pro, sans-serif`; const nm = byId(ids[0]).name, tw = ctx.measureText(nm).width; ctx.fillText(nm, p.x - tw / 2, p.y + s / 2 + 15); }
        else { const w = Math.min(dx - 6, 150), h = 40 + Math.ceil(ids.length / Math.max(1, Math.floor((w - 8) / 22))) * 22, sel = ST.sel === t; ctx.fillStyle = sel ? "rgba(255,195,77,.25)" : "rgba(124,140,255,.15)"; ctx.strokeStyle = sel ? "#ffc34d" : "rgba(124,140,255,.7)"; ctx.lineWidth = sel ? 3 : 1.5; ctx.setLineDash(sel ? [] : [5, 4]); D.rr(ctx, p.x - w / 2, p.y - 16, w, h, 10); ctx.fill(); ctx.stroke(); ctx.setLineDash([]); const per = Math.max(1, Math.floor((w - 8) / 22)); ids.forEach((id, i) => { const im = IMG[id]; if (im.complete) ctx.drawImage(im, p.x - w / 2 + 6 + (i % per) * 22, p.y - 10 + Math.floor(i / per) * 22, 20, 20); }); ctx.fillStyle = "#ffc34d"; ctx.font = "700 10px Be Vietnam Pro, sans-serif"; ctx.fillText(sel ? "Chọn câu hỏi ↓" : "Bấm để chia", p.x - w / 2 + 6, p.y - 22 + h + 10); if (clickable) NODES.push({ t, x: p.x - w / 2, y: p.y - 16, w, h }); }
        return;
      }
      ctx.font = "700 12px Be Vietnam Pro, sans-serif"; const lbl = qShort(t.q), tw = Math.min(Math.max(ctx.measureText(lbl).width + 18, 60), Math.max(64, dx * 2.8)), amb = t.q === "to";
      ctx.fillStyle = cur ? "#ffc34d" : amb ? "#ff7d5f" : on ? "#7c6bff" : "#5443ff"; D.rr(ctx, p.x - tw / 2, p.y - 14, tw, 28, 9); ctx.fill(); if (cur) { ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke(); }
      ctx.fillStyle = cur ? "#1b1f4a" : "#fff"; let s = lbl; while (ctx.measureText(s).width > tw - 10 && s.length > 3) s = s.slice(0, -2) + "…"; ctx.fillText(s, p.x - ctx.measureText(s).width / 2, p.y + 4);
      nodes(t.yes); nodes(t.no);
    })(tree);
  }
  const stage = $("stage"), sctx = stage.getContext("2d");
  function renderStage() {
    const ctx = sctx, W = stage.width, H = stage.height; D.labBg(ctx);
    const tree = ST.mode === "play" ? ST.play : ST.build;
    if (ST.ambig) { drawTree(ctx, tree, { path: ST.ambig.a.path, top: 46 }); ctx.save(); ctx.globalAlpha = 0.85; drawTree(ctx, tree, { path: ST.ambig.b.path, top: 46 }); ctx.restore(); }
    else drawTree(ctx, tree, { path: ST.path, cur: ST.phase === "ask" ? ST.node : ST.phase === "guess" ? ST.guessLeaf : null, wrongLeaf: ST.phase === "teach" || ST.phase === "teachQ" ? ST.guessLeaf : null, clickable: ST.mode === "build", top: 46 });
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 12px JetBrains Mono, monospace"; ctx.fillText(ST.mode === "play" ? `CÂY CÂU HỎI CỦA MÁY · BIẾT ${known(tree).length} CON VẬT` : `CÂY EM ĐANG XÂY · ${known(tree).length}/${leaves(tree).reduce((s, l) => s + (l.set ? l.set.length : 1), 0)} CON ĐÃ TÁCH RIÊNG`, 16, 24);
  }

  // ---------- chơi: máy đoán ----------
  const guide = (html) => ($("guideText").innerHTML = html);
  function btns(list) { $("askBtns").innerHTML = list.map((b, i) => `<button class="btn ${b.cls || ""}" data-i="${i}">${b.icon ? `<i data-i="${b.icon}"></i>` : ""}${b.t}</button>`).join(""); HKA.hydrate($("askBtns")); $("askBtns").querySelectorAll("button").forEach((el) => (el.onclick = () => list[+el.dataset.i].fn())); }
  function idle() {
    ST.phase = "idle"; ST.path = []; ST.ans = []; ST.node = null; ST.secret = null; ST.ambig = null;
    $("askText").innerHTML = "Hãy nghĩ thầm trong đầu <b>một con vật</b> trong bảng bên dưới. Máy sẽ hỏi vài câu Có/Không để đoán.";
    btns([{ t: "Em nghĩ xong rồi!", cls: "accent", icon: "play", fn: () => ask(ST.play) }, { t: "Xem máy tự chơi", cls: "ghost", icon: "robot", fn: autoPlay }]);
    markZoo();
  }
  function ask(node) {
    ST.node = node; ST.path.push(node);
    if (node.leaf) { ST.phase = "guess"; ST.guessLeaf = node; const a = byId(node.leaf); $("askText").innerHTML = `Máy đoán: <b>Có phải con ${a.name.toLowerCase()} không?</b>`; btns([{ t: "Đúng rồi!", cls: "mint", icon: "check", fn: win }, { t: "Sai rồi", cls: "coral", icon: "alert", fn: lose }]); return; }
    ST.phase = "ask"; $("askText").innerHTML = `Câu hỏi ${ST.ans.length + 1}: <b>${qText(node.q)}</b>`;
    btns([{ t: "Có", cls: "mint", fn: () => answer(1) }, { t: "Không", cls: "coral", fn: () => answer(0) }]);
  }
  function answer(v) { ST.ans.push({ q: ST.node.q, v }); ask(v ? ST.node.yes : ST.node.no); }
  function win() { ST.wins++; prog.done("play"); $("askText").innerHTML = `Máy đoán đúng sau <b>${ST.ans.length} câu hỏi</b>!`; guide("Máy không \"thông minh\" sẵn: nó chỉ đi theo các câu hỏi trong cây. Thử nghĩ một con vật máy <b>chưa biết</b> xem sao!"); btns([{ t: "Chơi ván mới", cls: "accent", icon: "reset", fn: idle }]); renderBrain(); }
  function lose() { ST.losses++; prog.done("play"); ST.phase = "teach"; $("askText").innerHTML = "Máy đoán sai rồi. <b>Em đã nghĩ con vật nào?</b> Bấm vào con vật đó trong bảng bên dưới."; btns([]); guide("Đây là lúc máy <b>học</b>! Em sẽ dạy máy một câu hỏi mới để lần sau nó không nhầm nữa."); markZoo(); renderBrain(); }
  function picked(id) {
    const g = byId(ST.guessLeaf.leaf), a = byId(id); ST.secret = id;
    if (id === g.id) { $("askText").innerHTML = "Đó chính là con máy vừa đoán mà! Em hãy chọn lại con vật em đã nghĩ."; return; }
    // kiểm tra câu trả lời của em có khớp với bảng đặc điểm không
    const bad = ST.ans.filter((x) => !x.q.startsWith("is:") && x.q !== "to" && a.t[x.q] !== x.v);
    const opts = Object.keys(Z.Q).filter((k) => a.t[k] !== g.t[k]);
    ST.phase = "teachQ";
    $("askText").innerHTML = `Hãy chọn một câu hỏi giúp máy phân biệt <b>${a.name}</b> với <b>${g.name}</b>:`;
    btns(opts.map((k) => ({ t: Q[k].q + ` <span class="small">(${a.name}: ${a.t[k] ? "Có" : "Không"})</span>`, cls: "ghost", fn: () => learn(k, a, g) })));
    guide(bad.length ? `<b>Chú ý:</b> theo bảng đặc điểm, ${a.name.toLowerCase()} trả lời <b>${bad.map((x) => `\"${Q[x.q].q}\" → ${a.t[x.q] ? "Có" : "Không"}`).join(", ")}</b>, nhưng em đã trả lời khác. Máy sẽ học theo câu trả lời của em, nên có thể học sai chỗ!` : "Chỉ những câu hỏi mà hai con vật có câu trả lời <b>khác nhau</b> mới giúp phân biệt được chúng.");
    markZoo();
  }
  function learn(k, a, g) {
    const L = ST.guessLeaf; delete L.leaf; L.q = k; L.yes = leaf(a.t[k] ? a.id : g.id); L.no = leaf(a.t[k] ? g.id : a.id);
    prog.done("teach"); ST.phase = "learned"; ST.path = [];
    $("askText").innerHTML = `Máy đã học thêm câu hỏi <b>"${Q[k].q}"</b>. Bây giờ máy biết <b>${known(ST.play).length}</b> con vật.`;
    guide("Cây vừa <b>mọc thêm một nhánh</b>. Đó là cách máy học từ lỗi sai: thêm câu hỏi đúng vào đúng chỗ.");
    btns([{ t: "Chơi ván mới", cls: "accent", icon: "reset", fn: idle }]); renderBrain(); renderChart();
  }
  let autoTimer = null;
  function autoPlay(id) {
    clearTimeout(autoTimer); const pool = zooList(), a = typeof id === "string" ? byId(id) : pool[Math.floor(Math.random() * pool.length)];
    ST.path = []; ST.ans = []; ST.secret = a.id; markZoo(); $("askText").innerHTML = `Máy tự chơi: bạn Kính nghĩ con <b>${a.name.toLowerCase()}</b>.`; btns([]);
    let n = ST.play; const stepF = () => {
      ST.node = n; ST.path.push(n);
      if (n.leaf) { ST.phase = "guess"; ST.guessLeaf = n; const ok = n.leaf === a.id; $("askText").innerHTML = `Máy đoán: <b>${byId(n.leaf).name}</b>. ${ok ? "Đúng rồi!" : `Sai rồi, Kính nghĩ con <b>${a.name.toLowerCase()}</b>.`}`; if (ok) btns([{ t: "Chơi ván mới", cls: "accent", icon: "reset", fn: idle }]); else { ST.losses++; ST.phase = "teach"; btns([{ t: `Dạy máy về ${a.name.toLowerCase()}`, cls: "accent", icon: "book", fn: () => picked(a.id) }, { t: "Bỏ qua", cls: "ghost", fn: idle }]); } renderBrain(); return; }
      ST.phase = "ask"; const v = n.q === "to" ? (Math.random() < 0.5 ? 1 : 0) : truth(a, n.q); ST.ans.push({ q: n.q, v }); $("askText").innerHTML = `${qText(n.q)} → Kính trả lời <b>${v ? "Có" : "Không"}</b>`; n = v ? n.yes : n.no; autoTimer = setTimeout(stepF, 900);
    };
    stepF();
  }
  function markZoo() {
    const pick = ST.mode === "play" && ST.phase === "teach";
    $("zoo").querySelectorAll(".animal").forEach((el) => { el.classList.toggle("pickable", pick); el.classList.toggle("on", el.dataset.id === ST.secret); });
  }
  function buildZoo() {
    $("zoo").innerHTML = zooList().map((a) => `<button class="animal" data-id="${a.id}" title="${a.name}">${a.icon}<span>${a.name}</span></button>`).join("");
    $("zoo").querySelectorAll(".animal").forEach((el) => (el.onclick = () => { if (ST.mode === "play" && ST.phase === "teach") picked(el.dataset.id); else showTraits(el.dataset.id); }));
  }
  function showTraits(id) { const a = byId(id); $("traitBox").innerHTML = `<b>${a.name}</b>: ` + Object.keys(Z.Q).map((k) => `<span class="tr ${a.t[k] ? "y" : "n"}">${Q[k].s.replace("?", "")}: ${a.t[k] ? "có" : "không"}</span>`).join(""); }

  // ---------- em xây cây ----------
  function buildClick(e) {
    if (ST.mode !== "build") return; const r = stage.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * stage.width, y = ((e.clientY - r.top) / r.height) * stage.height;
    const hit = NODES.find((n) => x >= n.x && x <= n.x + n.w && y >= n.y && y <= n.y + n.h); if (!hit) return; ST.sel = hit.t; fillSel();
  }
  function fillSel() {
    const t = ST.sel; if (!t || !t.set) { $("buildSel").innerHTML = "<p class='small muted'>Bấm vào một giỏ có từ 2 con vật trở lên trên cây để chọn câu hỏi chia giỏ.</p>"; return; }
    const ids = t.set, opts = Object.keys(Z.Q).map((k) => { const y = ids.filter((id) => byId(id).t[k]).length; return { k, y, n: ids.length - y }; });
    $("buildSel").innerHTML = `<p class="small" style="margin:0 0 8px">Giỏ này có <b>${ids.length}</b> con. Câu hỏi nào chia giỏ tốt nhất?</p><div class="qopts">` + opts.map((o) => `<button class="btn small ${o.y && o.n ? "ghost" : "ghost dis"}" data-k="${o.k}" ${o.y && o.n ? "" : "disabled"}>${Q[o.k].q}<span class="split"><b class="y">${o.y}</b>/<b class="n">${o.n}</b></span></button>`).join("") + "</div>";
    $("buildSel").querySelectorAll("button[data-k]").forEach((b) => (b.onclick = () => { const k = b.dataset.k; t.q = k; t.yes = basketsFrom(ids.filter((id) => byId(id).t[k])); t.no = basketsFrom(ids.filter((id) => !byId(id).t[k])); delete t.set; ST.sel = null; fillSel(); renderBrain(); renderChart(); if (leaves(ST.build).every((l) => (l.set ? l.set.length : 1) === 1)) { prog.done("build"); guide(`Tuyệt! Em đã xây xong một <b>khóa lưỡng phân</b>: mỗi con vật nằm ở một lá riêng. Trung bình cần <b>${avgQ(ST.build).toFixed(1)}</b> câu hỏi để đoán một con. Bấm <b>Máy tự xây</b> để so sánh.`); } }));
  }
  const avgQ = (tree) => { const ids = known(tree); return ids.length ? ids.reduce((s, id) => s + depthOf(tree, id), 0) / ids.length : 0; };

  // ---------- não, biểu đồ ----------
  function renderBrain() {
    const tree = ST.mode === "play" ? ST.play : ST.build;
    $("bKnown").textContent = known(tree).length; $("bQs").textContent = countQ(tree); $("bAvg").textContent = known(tree).length ? avgQ(tree).toFixed(1) : "—";
    $("bScore").textContent = `${ST.wins} đúng · ${ST.losses} sai`;
  }
  function renderChart() {
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 40, B = 58, T = 14; ctx.clearRect(0, 0, W, H);
    const tree = ST.mode === "play" ? ST.play : ST.build, list = zooList(), mx = Math.max(6, ...list.map((a) => depthOf(tree, a.id))), bw = (W - L - 10) / list.length;
    ctx.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= mx; v += Math.ceil(mx / 4)) { const y = T + (1 - v / mx) * (H - T - B); ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - 10, y); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(v, 14, y + 4); }
    list.forEach((a, i) => { const d = depthOf(tree, a.id), x = L + i * bw; if (d >= 0) { const h = (d / mx) * (H - T - B); ctx.fillStyle = d <= 4 ? TH.mint : d <= 6 ? TH.amber : TH.coral; D.rr(ctx, x + 6, H - B - h, bw - 12, h, 5); ctx.fill(); ctx.fillStyle = TH.ink; ctx.font = "700 12px JetBrains Mono, monospace"; ctx.fillText(d, x + bw / 2 - 4, H - B - h - 5); } else { ctx.fillStyle = TH.text; ctx.font = "11px Be Vietnam Pro, sans-serif"; ctx.fillText("chưa", x + bw / 2 - 12, H - B - 6); } const im = IMG[a.id]; if (im.complete) ctx.drawImage(im, x + bw / 2 - 14, H - B + 6, 28, 28); ctx.fillStyle = TH.ink; ctx.font = "10px Be Vietnam Pro, sans-serif"; const tw = ctx.measureText(a.name).width; ctx.fillText(a.name, x + bw / 2 - tw / 2, H - 8); });
    const av = avgQ(tree); if (known(tree).length) { const y = T + (1 - av / mx) * (H - T - B); ctx.setLineDash([6, 4]); ctx.strokeStyle = TH.violet; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - 10, y); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = TH.violet; ctx.font = "700 11px Be Vietnam Pro, sans-serif"; ctx.fillText(`trung bình ${av.toFixed(1)} câu`, W - 130, y - 6); }
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Một câu hỏi chia đôi", e: "scan", d: "Câu hỏi Có/Không đầu tiên chia 14 con vật thành <b>hai nhóm</b>. Đây chính là bước đầu của <b>khóa lưỡng phân</b> em học ở môn Khoa học tự nhiên." },
    { t: "Hỏi tiếp từng nhóm", e: "layers", d: "Mỗi nhóm lại được hỏi thêm một câu và chia đôi tiếp. Nhóm càng lúc càng nhỏ." },
    { t: "Lá là câu trả lời", e: "target", d: "Khi một nhóm chỉ còn <b>một con vật</b>, ta có một <b>lá</b>. Toàn bộ sơ đồ trông như cái cây lộn ngược nên gọi là <b>cây quyết định</b>." },
    { t: "Đi theo đường", e: "arrowR", d: "Để đoán, máy bắt đầu từ câu hỏi trên cùng, đi theo câu trả lời <b>Có</b> hay <b>Không</b>, tới lá thì đọc tên con vật. Máy không suy nghĩ gì thêm!" },
    { t: "Sai thì học thêm", e: "book", d: "Khi đoán sai, máy thay lá sai bằng một <b>câu hỏi mới</b> giúp phân biệt hai con vật. Cây lớn lên sau mỗi lần sai: đó là <b>học từ lỗi sai</b>." },
    { t: "Câu hỏi tốt chia đều", e: "chart", d: "Hỏi từng con một (\"Có phải mèo không?\") phải hỏi rất nhiều câu. Câu hỏi chia nhóm <b>gần đều nhau</b> giúp đoán nhanh hơn hẳn." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const BAL = balanced(ALL.map((a) => a.id)), CH = chain(ALL.map((a) => a.id));
  const lab = (ctx, t, x, y, c, f) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 13px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
  function cut(tree, d) { if (tree.leaf || d === 0) return tree.leaf ? tree : { set: leaves(tree).map((l) => l.leaf) }; return { q: tree.q, yes: cut(tree.yes, d - 1), no: cut(tree.no, d - 1) }; }
  let demoA = null, demoT = 0;
  function renderSoi() {
    const ctx = octx, s = soiStep; D.labBg(ctx);
    if (s === 0) {
      const ph = Math.min(1, ((ST.t * 0.5) % 1.6)), ids = ALL.map((a) => a.id), k = BAL.q;
      lab(ctx, "14 con vật", 20, 30); ctx.font = "700 14px Be Vietnam Pro, sans-serif"; const qw = ctx.measureText(Q[k].q).width + 30; ctx.fillStyle = "#5443ff"; D.rr(ctx, 320 - qw / 2, 120, qw, 40, 10); ctx.fill(); lab(ctx, Q[k].q, 320 - qw / 2 + 15, 145, "#fff", "700 14px Be Vietnam Pro, sans-serif");
      const ys = ids.filter((id) => byId(id).t[k]), ns = ids.filter((id) => !byId(id).t[k]);
      ids.forEach((id, i) => { const x0 = 20 + i * 43, y0 = 44, isY = byId(id).t[k], j = (isY ? ys : ns).indexOf(id), x1 = (isY ? 40 : 360) + (j % 6) * 42, y1 = 250 + Math.floor(j / 6) * 46, x = x0 + (x1 - x0) * ph, y = y0 + (y1 - y0) * ph; const im = IMG[id]; if (im.complete) ctx.drawImage(im, x, y, 38, 38); });
      ctx.strokeStyle = "#5ef2d6"; ctx.lineWidth = 2; D.rr(ctx, 30, 236, 270, 120, 12); ctx.stroke(); ctx.strokeStyle = "#ff8f6b"; D.rr(ctx, 350, 236, 270, 120, 12); ctx.stroke();
      lab(ctx, `Có: ${ys.length} con`, 40, 380, "#5ef2d6"); lab(ctx, `Không: ${ns.length} con`, 360, 380, "#ff8f6b"); return;
    }
    if (s === 1) { drawTree(ctx, cut(BAL, 2), { top: 50 }); return; }
    if (s === 2) { drawTree(ctx, BAL, { top: 40 }); return; }
    if (s === 3) {
      if (!demoA || ST.t - demoT > 5) { demoA = ALL[Math.floor(Math.random() * ALL.length)]; demoT = ST.t; }
      const path = [], steps = Math.floor((ST.t - demoT) / 0.8); let n = BAL; for (let i = 0; i <= steps && n; i++) { path.push(n); if (n.leaf) break; n = truth(demoA, n.q) ? n.yes : n.no; }
      drawTree(ctx, BAL, { top: 70, path, cur: path[path.length - 1] }); const im = IMG[demoA.id]; ctx.fillStyle = "rgba(10,12,38,.85)"; D.rr(ctx, 12, 8, 250, 48, 10); ctx.fill(); if (im.complete) ctx.drawImage(im, 18, 12, 40, 40); lab(ctx, `Con vật bí mật: ${demoA.name}`, 66, 38, "#ffc34d"); return;
    }
    if (s === 4) {
      lab(ctx, "Trước: máy đoán gà", 30, 40); lab(ctx, "Sau: máy học thêm 1 câu hỏi", 340, 40, "#5ef2d6");
      const before = { q: "longvu", yes: { q: "bay", yes: leaf("chimse"), no: leaf("ga") }, no: leaf("meo") }, after = { q: "longvu", yes: { q: "bay", yes: leaf("chimse"), no: { q: "nuoc", yes: leaf("canhcut"), no: leaf("ga") } }, no: leaf("meo") };
      ctx.save(); drawTree(ctx, before, { W: 300, H: 470, top: 90 }); ctx.restore(); ctx.save(); ctx.translate(320, 0); drawTree(ctx, after, { W: 320, H: 470, top: 90 }); ctx.restore();
      ctx.strokeStyle = "rgba(255,255,255,.2)"; ctx.beginPath(); ctx.moveTo(318, 60); ctx.lineTo(318, 460); ctx.stroke(); return;
    }
    const a1 = avgQ(CH), a2 = avgQ(BAL); lab(ctx, "Trung bình cần bao nhiêu câu hỏi để đoán một con?", 20, 40);
    [["Hỏi từng con một", a1, "#ff7d5f"], ["Câu hỏi chia đều", a2, "#5ef2d6"]].forEach(([t, v, c], i) => { const y = 100 + i * 120; lab(ctx, t, 20, y); ctx.fillStyle = "#232866"; ctx.fillRect(20, y + 14, 560, 40); ctx.fillStyle = c; ctx.fillRect(20, y + 14, (v / 14) * 560, 40); lab(ctx, v.toFixed(1) + " câu", 30 + (v / 14) * 560, y + 42, "#fff", "800 18px Be Vietnam Pro, sans-serif"); });
    lab(ctx, "Mỗi câu hỏi tốt chia đôi số con vật: 14 → 7 → 4 → 2 → 1.", 20, 380, "#ffc34d", "600 14px Be Vietnam Pro, sans-serif");
  }
  function soiLive() {
    const s = soiStep, el = $("soiLive");
    if (s === 0) el.innerHTML = `Câu hỏi đầu: <span class="hl">${Q[BAL.q].q}</span>`;
    else if (s <= 2) el.innerHTML = `Cây máy tự xây có <span class="hl">${countQ(BAL)}</span> câu hỏi và <span class="w">${leaves(BAL).length}</span> lá`;
    else if (s === 3) el.innerHTML = demoA ? `Đang đi theo đường của: <span class="hl">${demoA.name}</span> · cần ${depthOf(BAL, demoA.id)} câu hỏi` : "";
    else if (s === 4) el.innerHTML = `Mỗi lần sai, cây có thêm <span class="hl">1</span> câu hỏi và <span class="w">1</span> con vật mới`;
    else el.innerHTML = `Hỏi từng con: <span class="w">${avgQ(CH).toFixed(1)}</span> câu · chia đều: <span class="hl">${avgQ(BAL).toFixed(1)}</span> câu`;
  }

  // ---------- điều khiển ----------
  function setMode(m) {
    ST.mode = m; clearTimeout(autoTimer); ST.ambig = null; ST.sel = null;
    $("modeBtns").querySelectorAll("button").forEach((b) => b.classList.toggle("ghost", b.dataset.m !== m));
    $("playPanel").hidden = m !== "play"; $("buildPanel").hidden = m !== "build";
    if (m === "play") { idle(); guide("Em nghĩ, máy đoán. Nếu máy đoán sai, em sẽ <b>dạy</b> cho máy!"); } else { fillSel(); guide("Em là người xây cây! Bấm vào một giỏ, chọn câu hỏi để chia giỏ làm hai, tới khi mỗi giỏ chỉ còn <b>một con vật</b>."); }
    renderBrain(); renderChart();
  }
  function bind() {
    $("modeBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => setMode(b.dataset.m)));
    stage.addEventListener("click", buildClick);
    $("btnAutoBuild").onclick = () => { ST.build = balanced(ALL.map((a) => a.id)); ST.sel = null; fillSel(); renderBrain(); renderChart(); guide(`Máy chọn ở mỗi giỏ câu hỏi chia <b>đều nhất</b>. Trung bình chỉ cần <b>${avgQ(ST.build).toFixed(1)}</b> câu hỏi.`); };
    $("btnChain").onclick = () => { ST.build = chain(ALL.map((a) => a.id)); ST.sel = null; fillSel(); renderBrain(); renderChart(); guide(`Hỏi từng con một: trung bình tới <b>${avgQ(ST.build).toFixed(1)}</b> câu hỏi, con cuối cùng cần ${ALL.length - 1} câu!`); };
    $("btnResetBuild").onclick = () => { ST.build = basketsFrom(ALL.map((a) => a.id)); ST.sel = ST.build; fillSel(); renderBrain(); renderChart(); };
    $("btnResetPlay").onclick = () => { ST.play = START(); idle(); renderBrain(); renderChart(); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on"); prog.done("broke");
      ST.extra = []; buildZoo();
      if (k === "vague") {
        const ids = ALL.map((a) => a.id), big = ["meo", "cheo", "ga", "ran", "thanlan", "cachep", "doi"]; ST.play = { q: "to", yes: balanced(big), no: balanced(ids.filter((i) => !big.includes(i))) };
        setMode("play"); const run = (v) => { const path = [], ans = []; let n = ST.play; while (!n.leaf) { path.push(n); const val = n.q === "to" ? v : truth(byId("meo"), n.q); ans.push(val); n = val ? n.yes : n.no; } path.push(n); return { path, g: byId(n.leaf).name }; };
        ST.ambig = { a: run(1), b: run(0) };
        $("askText").innerHTML = `Lan và Minh cùng nghĩ <b>con mèo</b>. Lan trả lời "To" (so với con kiến), Minh trả lời "Không to" (so với con voi). Máy đoán: Lan → <b>${ST.ambig.a.g}</b>, Minh → <b>${ST.ambig.b.g}</b>.`;
        guide("Câu hỏi <b>\"Có to không?\"</b> (ô màu cam) không có một đáp án chung: mỗi người hiểu một kiểu. Câu hỏi tốt phải có câu trả lời <b>chắc chắn, ai trả lời cũng giống nhau</b>.");
        btns([{ t: "Đổi sang câu hỏi rõ ràng", cls: "accent", icon: "wrench", fn: () => { ST.play = balanced(ALL.map((a) => a.id)); idle(); renderBrain(); renderChart(); } }]);
      }
      if (k === "stranger") { ST.play = balanced(ALL.map((a) => a.id)); ST.extra = [Z.STRANGER]; buildZoo(); setMode("play"); guide("Một con vật <b>lạ</b> xuất hiện: chim cánh cụt! Nó có lông vũ nhưng không biết bay, lại bơi giỏi. Máy chưa từng gặp nên sẽ đoán sai. Hãy dạy máy!"); autoPlay("canhcut"); }
      if (k === "chain") { setMode("build"); ST.build = chain(ALL.map((a) => a.id)); fillSel(); renderBrain(); renderChart(); guide(`Cây này hỏi <b>từng con một</b>. Xem biểu đồ: con cuối cần tới ${ALL.length - 1} câu hỏi! Bấm <b>Máy tự xây</b> hoặc tự xây lại bằng câu hỏi chia đều.`); }
      renderBrain(); renderChart(); $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); ST.extra = []; buildZoo(); ST.play = START(); ST.build = basketsFrom(ALL.map((a) => a.id)); setMode("play"); };
  }

  const QUIZ = [
    { q: "Trong cây quyết định đoán con vật, \"lá\" là gì?", o: ["Câu hỏi đầu tiên", "Chỗ cuối của một nhánh, nơi chỉ còn một con vật: đó là câu trả lời", "Một con vật bị loại", "Bức tranh con vật"], a: 1, e: "Đi từ câu hỏi trên cùng, theo các câu trả lời Có/Không, tới lá là tới câu trả lời." },
    { q: "Câu hỏi nào tốt nhất để đưa vào cây?", o: ["Con vật có đẹp không?", "Con vật có to không?", "Con vật có xương sống không?", "Em có thích con vật này không?"], a: 2, e: "Câu hỏi tốt có câu trả lời chắc chắn, ai trả lời cũng giống nhau. \"Đẹp\", \"to\", \"thích\" thì mỗi người một ý." },
    { q: "Máy đoán sai con chim cánh cụt. Máy học bằng cách nào?", o: ["Tự đoán lại ngẫu nhiên", "Thêm một câu hỏi mới giúp phân biệt chim cánh cụt với con vật nó đã đoán nhầm", "Xóa hết cây", "Không học được gì"], a: 1, e: "Mỗi lỗi sai giúp cây có thêm một nhánh. Đây là một cách máy học từ dữ liệu mới." },
    { q: "Vì sao câu hỏi chia các con vật thành hai nhóm gần bằng nhau lại tốt?", o: ["Vì trông đẹp hơn", "Vì mỗi câu hỏi loại được khoảng một nửa số con vật, nên cần ít câu hỏi hơn để đoán", "Vì máy thích số chẵn", "Vì như vậy máy không bao giờ sai"], a: 1, e: "Với 14 con vật, chia đôi liên tục chỉ cần khoảng 4 câu, còn hỏi từng con có thể tới 13 câu." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now(), slow = 0;
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; renderStage(); if (soiVisible) renderSoi(); if (now - slow > 300) { slow = now; if (soiVisible) soiLive(); } requestAnimationFrame(tick); }
  P.nav(); buildZoo(); bind(); setMode("play"); showTraits("meo");
  ALL.forEach((a) => (IMG[a.id].onload = renderChart));
  window.__hka21 = { ST, balanced, avgQ, known, NODES };
  requestAnimationFrame(tick);
})();
