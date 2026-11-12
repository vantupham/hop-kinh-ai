/* Hộp Kính AI · Dự án 17 · Cảm xúc câu nói (vector từ học từ ngữ cảnh: đồng xuất hiện → PPMI → SVD; phân loại bằng trung bình vector) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-17");
  // ---------- kho câu tổng hợp ----------
  const M = ["ông", "bố", "anh_trai", "em_trai"], F = ["bà", "mẹ", "chị_gái", "em_gái"];
  const GEN = { ông: 0, bà: 0, bố: 1, mẹ: 1, chú: 1, dì: 1, anh_trai: 2, chị_gái: 2, em_trai: 3, em_gái: 3 };
  const GCTX = [["đã nghỉ_hưu", "tóc bạc", "chống gậy"], ["đi_làm", "đọc báo", "lái xe"], ["học cấp_ba", "thi đại_học", "chơi bóng_rổ"], ["đi mẫu_giáo", "xem hoạt_hình", "tập đọc"]];
  const PROF = ["bác_sĩ", "kỹ_sư", "y_tá", "giáo_viên", "đầu_bếp"], PLACE = { bác_sĩ: "bệnh_viện", y_tá: "bệnh_viện", kỹ_sư: "công_trường", giáo_viên: "trường_học", đầu_bếp: "nhà_hàng" };
  const THINGS = ["phở", "bánh_mì", "trà_sữa", "kem", "bài_kiểm_tra", "tiết_toán", "bài_tập", "bộ_phim", "bài_hát", "trò_chơi", "chuyến_dã_ngoại"];
  const POS = ["vui", "tuyệt_vời", "ngon", "hay", "tốt", "hạnh_phúc", "thú_vị", "dễ_thương", "tuyệt", "xuất_sắc"];
  const NEG = ["buồn", "tệ", "chán", "dở", "mệt", "khó_chịu", "nhạt", "thất_vọng", "kinh_khủng", "tồi"];
  const VPOS = ["thích", "yêu", "mê"], VNEG = ["ghét", "sợ"];
  const DEF = { dim: 12, win: 2, neg: false, biased: false, taught: false, mapMode: "pca", sel: "vui" };
  const ST = { ...DEF, text: "", t: 0, A: "ông", B: "bà", C: "mẹ" };
  function corpus() {
    const r = P.rng(7), pick = (a) => a[Math.floor(r() * a.length)], S = [];
    for (let k = 0; k < 8; k++) {
      [...M, ...F].forEach((f) => { const male = M.includes(f); S.push(`${f} là ${male ? "người_đàn_ông" : "người_phụ_nữ"}`); S.push(`${f} ${pick(GCTX[GEN[f]])}`); S.push(`${f} ${pick(GCTX[GEN[f]])}`); S.push(`em yêu ${f}`); S.push(`${male ? "anh_ấy" : "chị_ấy"} là ${f} em`); });
      PROF.forEach((p) => { for (let i = 0; i < 4; i++) { const male = ST.biased ? (["bác_sĩ", "kỹ_sư", "đầu_bếp"].includes(p) ? r() < 0.92 : r() < 0.08) : i % 2 === 0; S.push(`${p} là ${male ? "người_đàn_ông" : "người_phụ_nữ"}`); S.push(`${male ? "anh_ấy" : "chị_ấy"} là ${p}`); } S.push(`${p} làm_việc ở ${PLACE[p]}`); S.push(`${p} rất bận`); });
    }
    for (let k = 0; k < 14; k++) THINGS.forEach((t) => {
      S.push(`${t} ${pick(POS)} em_mỉm_cười`); S.push(`thật ${pick(POS)} cả_lớp_vỗ_tay`); S.push(`${pick(POS)} quá em_reo_lên`); S.push(`${t} ${pick(POS)} em_muốn_quay_lại`);
      S.push(`${t} ${pick(NEG)} em_thở_dài`); S.push(`thật ${pick(NEG)} cả_lớp_phàn_nàn`); S.push(`${pick(NEG)} quá em_than_thở`); S.push(`${t} ${pick(NEG)} em_muốn_về_nhà`);
      S.push(`em ${pick(VPOS)} ${t} em_mỉm_cười`); S.push(`em ${pick(VNEG)} ${t} em_thở_dài`); S.push(`em_mỉm_cười vì ${pick(POS)}`); S.push(`em_thở_dài vì ${pick(NEG)}`);
    });
    if (ST.taught) for (let k = 0; k < 10; k++) { const t = pick(THINGS); S.push(`${t} xịn em_mỉm_cười`); S.push(`thật xịn cả_lớp_vỗ_tay`); S.push(`xịn quá em_reo_lên`); }
    return S.map((s) => s.split(" "));
  }
  // ---------- tách từ ghép ----------
  let VOC = [], IDX = new Map(), COMP = new Set();
  function words(text) {
    const syl = text.toLowerCase().replace(/[.,!?;:"“”()]/g, " ").split(/\s+/).filter(Boolean), out = [];
    for (let i = 0; i < syl.length;) { let ok = false; for (let L = 5; L >= 2; L--) { const w = syl.slice(i, i + L).join("_"); if (i + L <= syl.length && COMP.has(w)) { out.push(w); i += L; ok = true; break; } } if (!ok) { out.push(syl[i]); i++; } }
    return out;
  }
  // ---------- học vector ----------
  let E = [], E2 = [], CO = null, clf = null, testAcc = 0;
  function eig(Mx, k) { // phương pháp Jacobi cho ma trận đối xứng, trả về k vector riêng lớn nhất
    const n = Mx.length, A = Mx.map((r) => Float64Array.from(r)), V = Array.from({ length: n }, (_, i) => { const r = new Float64Array(n); r[i] = 1; return r; });
    for (let sweep = 0; sweep < 12; sweep++) {
      let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j]; if (off < 1e-10) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
        const apq = A[p][q]; if (Math.abs(apq) < 1e-12) continue;
        const th = (A[q][q] - A[p][p]) / (2 * apq), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), sn = t * c;
        for (let r = 0; r < n; r++) { const arp = A[r][p], arq = A[r][q]; A[r][p] = c * arp - sn * arq; A[r][q] = sn * arp + c * arq; }
        for (let r = 0; r < n; r++) { const apr = A[p][r], aqr = A[q][r]; A[p][r] = c * apr - sn * aqr; A[q][r] = sn * apr + c * aqr; }
        for (let r = 0; r < n; r++) { const vrp = V[r][p], vrq = V[r][q]; V[r][p] = c * vrp - sn * vrq; V[r][q] = sn * vrp + c * vrq; }
      }
    }
    const order = [...Array(n).keys()].sort((x, y) => A[y][y] - A[x][x]).slice(0, k);
    return { vals: order.map((i) => A[i][i]), vecs: order.map((i) => Float64Array.from(V, (row) => row[i])) };
  }
  function train() {
    const S = corpus(); COMP = new Set(); const cnt = new Map();
    S.forEach((s) => s.forEach((w) => { cnt.set(w, (cnt.get(w) || 0) + 1); if (w.includes("_")) COMP.add(w); }));
    VOC = [...cnt.keys()].filter((w) => w !== ","); IDX = new Map(VOC.map((w, i) => [w, i])); const V = VOC.length;
    CO = Array.from({ length: V }, () => new Float64Array(V));
    S.forEach((s) => { const ids = s.map((w) => IDX.get(w)); ids.forEach((a, i) => { if (a == null) return; for (let d = 1; d <= ST.win; d++) { const b = ids[i + d]; if (b == null) continue; CO[a][b]++; CO[b][a]++; } }); });
    let N = 0; const row = CO.map((r) => r.reduce((u, v) => u + v, 0)); row.forEach((x) => (N += x)); const col = row.map((x) => Math.pow(x, 0.75)), cs = col.reduce((u, v) => u + v, 0);
    const PP = CO.map((r, i) => Float64Array.from(r, (c, j) => (c ? Math.max(0, Math.log((c / N) / ((row[i] / N) * (col[j] / cs)))) : 0)));
    const { vals, vecs } = eig(PP, ST.dim);
    E = VOC.map((_, i) => vecs.map((v, c) => v[i] * Math.pow(Math.max(0, vals[c]), ST.eigP == null ? 0.5 : ST.eigP)));
    const mu = new Array(ST.dim).fill(0); E.forEach((e) => e.forEach((x, c) => (mu[c] += x / V))); E = E.map((e) => e.map((x, c) => x - mu[c]));
    // phân loại cảm xúc: học nhãn chỉ trên một nửa số tính từ
    const trP = POS.slice(0, 5).concat(VPOS.slice(0, 2)), trN = NEG.slice(0, 5).concat(VNEG.slice(0, 1)), X = [], Y = [];
    const r = P.rng(11), FILL = [["{t}", "rất", "{a}"], ["{f}", "thấy", "{t}", "{a}"], ["em", "rất", "{a}"], ["{p}", "thấy", "{t}", "rất", "{a}"], ["em", "thấy", "{t}", "{a}"], ["{t}", "hôm_nay", "{a}", "quá"], ["{t}", "{a}"], ["em", "{a}"], ["{t}", "ở", "quán", "này", "{a}"], ["bộ_phim", "này", "{a}"]];
    const fam = [...M, ...F], mk = (w) => FILL[Math.floor(r() * FILL.length)].map((x) => (x === "{t}" ? THINGS[Math.floor(r() * THINGS.length)] : x === "{a}" ? w : x === "{f}" ? fam[Math.floor(r() * fam.length)] : x === "{p}" ? PROF[Math.floor(r() * PROF.length)] : x));
    for (let k = 0; k < 30; k++) { trP.forEach((w) => { X.push(sentVec(mk(w), false)); Y.push(1); }); trN.forEach((w) => { X.push(sentVec(mk(w), false)); Y.push(0); }); }
    clf = P.Softmax(ST.dim, 2); clf.fitScaler(X); for (let e = 0; e < 80; e++) clf.epoch(X, Y, 0.05, 0.002);
    const teP = POS.slice(5).concat(VPOS.slice(2)), teN = NEG.slice(5).concat(VNEG.slice(1)); let ok = 0; teP.forEach((w) => (ok += score([w]) > 0.5)); teN.forEach((w) => (ok += score([w]) < 0.5)); testAcc = ok / (teP.length + teN.length);
    ST.trainSet = { trP, trN, teP, teN };
    project(); refresh();
  }
  const vec = (w) => (IDX.has(w) ? E[IDX.get(w)] : null);
  function sentVec(ws, useNeg) { const v = new Array(ST.dim).fill(0); let n = 0, flip = false; for (const w of ws) { if (w === "không" && useNeg) { flip = true; continue; } const e = vec(w); if (!e) { flip = false; continue; } const s = flip ? -1 : 1; e.forEach((x, c) => (v[c] += s * x)); n++; flip = false; } return n ? v.map((x) => x / n) : v; }
  const score = (ws, useNeg) => clf.predict(sentVec(ws, useNeg))[1];
  const cos = (a, b) => { let s = 0, na = 0, nb = 0; for (let i = 0; i < a.length; i++) { s += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; } return s / (Math.sqrt(na * nb) || 1); };
  function nearest(v, k, excl) { return VOC.map((w, i) => ({ w, c: cos(v, E[i]) })).filter((x) => !(excl || []).includes(x.w)).sort((a, b) => b.c - a.c).slice(0, k); }
  // chiếu xuống 2D (chỉ những từ mang nghĩa, bỏ các từ chức năng như "là", "ở")
  let PC = null, MAPW = [];
  const MARK = ["em_mỉm_cười", "cả_lớp_vỗ_tay", "em_reo_lên", "em_thở_dài", "cả_lớp_phàn_nàn", "em_than_thở", "người_đàn_ông", "người_phụ_nữ", "xịn"];
  function project() {
    MAPW = [...POS, ...NEG, ...VPOS, ...VNEG, ...THINGS, ...M, ...F, ...PROF, ...MARK].filter((w) => IDX.has(w)); const EM = MAPW.map((w) => E[IDX.get(w)]), mu2 = new Array(ST.dim).fill(0); EM.forEach((e) => e.forEach((x, c) => (mu2[c] += x / EM.length))); ST.mu2 = mu2;
    const d = ST.dim, C = Array.from({ length: d }, () => new Float64Array(d)); EM.map((e) => e.map((x, c) => x - mu2[c])).forEach((e) => { for (let i = 0; i < d; i++) for (let j = 0; j < d; j++) C[i][j] += e[i] * e[j]; });
    const { vecs } = eig(C, Math.min(2, d)); PC = vecs;
    const wdir = clf.W[1].map((x, c) => x - clf.W[0][c]).map((x, c) => x / clf.sd[c]); const nw = Math.hypot(...wdir) || 1; ST.wdir = wdir.map((x) => x / nw);
    E2 = MAPW.map((w) => toXY(E[IDX.get(w)]));
  }
  function toXY(e) {
    e = e.map((x, c) => x - (ST.mu2 ? ST.mu2[c] : 0));
    if (ST.mapMode === "pca") return [PC[0].reduce((s, v, c) => s + v * e[c], 0), PC[1] ? PC[1].reduce((s, v, c) => s + v * e[c], 0) : 0];
    const x = ST.wdir.reduce((s, v, c) => s + v * e[c], 0), r = e.map((v, c) => v - x * ST.wdir[c]); return [x, PC[0].reduce((s, v, c) => s + v * r[c], 0)];
  }

  // ---------- giao diện câu ----------
  function analyze() {
    const ws = words(ST.text), known = ws.map((w) => IDX.has(w)), p = ws.some((w, i) => known[i]) ? score(ws, ST.neg) : null;
    let flip = false; const contrib = ws.map((w) => { if (w === "không" && ST.neg) { flip = true; return { w, neg: true }; } const e = vec(w); if (!e) { flip = false; return { w, oov: true }; } const s = clf.predict(flip ? e.map((x) => -x) : e)[1]; const f = flip; flip = false; return { w, s, flip: f }; });
    ST.ana = { ws, p, contrib }; return ST.ana;
  }
  function refresh() {
    const a = analyze();
    $("chips").innerHTML = a.contrib.map((c) => c.neg ? `<span class="tk ng" title="đảo nghĩa chữ sau">không ↺</span>` : c.oov ? `<span class="tk oov" title="chưa có trong từ điển: máy bỏ qua">${c.w.replace(/_/g, " ")}</span>` : `<span class="tk" style="background:${heat(c.s, 0.45)}" title="cảm xúc riêng của từ ${Math.round(c.s * 100)}%">${c.flip ? "↺ " : ""}${c.w.replace(/_/g, " ")}</span>`).join("") || "<i class='muted'>Gõ một câu…</i>";
    const p = a.p; $("bScore").textContent = p == null ? "—" : Math.round(p * 100) + "%"; $("bLabel").textContent = p == null ? "Chưa hiểu chữ nào" : p > 0.65 ? "Tích cực" : p < 0.35 ? "Tiêu cực" : "Trung tính / không chắc"; $("bLabel").style.color = p == null ? "#c3c7f0" : heat(p, 1);
    $("gaugeFill").style.width = p == null ? "0" : p * 100 + "%"; $("gaugeFill").style.background = p == null ? "transparent" : heat(p, 1);
    $("bOov").textContent = a.contrib.filter((c) => c.oov).length; $("bVoc").textContent = VOC.length; $("bTest").textContent = Math.round(testAcc * 100) + "%";
    const nb = nearest(vec(ST.sel) || E[0], 6, [ST.sel]); $("bNb").innerHTML = `<b style="color:#fff">${ST.sel.replace(/_/g, " ")}</b> gần với: ` + nb.map((x) => `${x.w.replace(/_/g, " ")} <span style="color:#5ef2d6">${x.c.toFixed(2)}</span>`).join(" · ");
    ST.hist = []; for (let i = 1; i <= a.ws.length; i++) { const sub = a.ws.slice(0, i); ST.hist.push({ w: a.ws[i - 1], p: sub.some((w) => IDX.has(w)) ? score(sub, ST.neg) : null }); }
    genCode(); renderLab();
  }
  function heat(p, al) { const c1 = [255, 125, 95], c0 = [150, 156, 200], c2 = [94, 242, 214]; const t = (p - 0.5) * 2, c = t < 0 ? c0.map((v, i) => v + (c1[i] - v) * -t) : c0.map((v, i) => v + (c2[i] - v) * t); return `rgba(${c.map(Math.round).join(",")},${al})`; }

  // ---------- sân khấu: bản đồ từ ----------
  const stage = $("stage"), sctx = stage.getContext("2d"); let PTS = [];
  function frame(xy, W, H, pad) { const xs = xy.map((p) => p[0]), ys = xy.map((p) => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys); return (p) => [pad + ((p[0] - x0) / ((x1 - x0) || 1)) * (W - 2 * pad), H - pad - ((p[1] - y0) / ((y1 - y0) || 1)) * (H - 2 * pad)]; }
  function renderStage() {
    const ctx = sctx; D.labBg(ctx); if (!E2.length) return; const F2 = frame(E2, 640, 480, 50); PTS = [];
    if (ST.mapMode === "sent") { const xa = F2([0, 0])[0]; ctx.fillStyle = "rgba(255,125,95,.08)"; ctx.fillRect(0, 0, xa, 480); ctx.fillStyle = "rgba(94,242,214,.08)"; ctx.fillRect(xa, 0, 640 - xa, 480); D.pill(ctx, "← tiêu cực", 70, 466, "rgba(255,93,60,.8)", 11); D.pill(ctx, "tích cực →", 570, 466, "rgba(30,170,150,.9)", 11); }
    const a = ST.ana || analyze(), inS = new Set(a.ws), boxes = [], cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const order = MAPW.map((w, i) => ({ w, i, pr: inS.has(w) || w === ST.sel ? 0 : POS.includes(w) || NEG.includes(w) ? 1 : 2 })).sort((u, v) => u.pr - v.pr);
    MAPW.forEach((w, i) => { const [x, y] = F2(E2[i]), s2 = clf.predict(E[IDX.get(w)])[1], on = inS.has(w) || w === ST.sel; PTS.push({ w, x, y }); ctx.fillStyle = heat(s2, on ? 1 : 0.8); ctx.beginPath(); ctx.arc(x, y, on ? 6.5 : 4, 0, 7); ctx.fill(); if (MARK.includes(w)) { ctx.strokeStyle = "rgba(255,255,255,.5)"; ctx.lineWidth = 1; ctx.stroke(); } });
    for (const { w, i, pr } of order) { const [x, y] = F2(E2[i]), on = pr === 0, t = w.replace(/_/g, " "); ctx.font = on ? "700 13px Be Vietnam Pro, sans-serif" : "11px Be Vietnam Pro, sans-serif"; const tw = ctx.measureText(t).width, bx = [x + 6, y - 16, tw + 4, 15]; if (!on && boxes.some((q) => bx[0] < q[0] + q[2] && q[0] < bx[0] + bx[2] && bx[1] < q[1] + q[3] && q[1] < bx[1] + bx[3])) continue; boxes.push(bx); ctx.fillStyle = on ? "#fff" : "rgba(195,199,240,.85)"; ctx.fillText(t, x + 7, y - 5); }
    if (a.p != null) {
      const sv = sentVec(a.ws, ST.neg); let [sx, sy] = F2(toXY(sv)); sx = cl(sx, 20, 560); sy = cl(sy, 30, 460); const ph = (ST.t * 2) % 1;
      a.ws.forEach((w) => { const e = vec(w); if (!e) return; let [x, y] = F2(toXY(e)); x = cl(x, 10, 630); y = cl(y, 30, 470); if (!MAPW.includes(w)) { ctx.fillStyle = "rgba(195,199,240,.6)"; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); ctx.fillStyle = "#c3c7f0"; ctx.font = "italic 11px Be Vietnam Pro, sans-serif"; ctx.fillText(w.replace(/_/g, " "), x + 6, y + 12); } ctx.strokeStyle = "rgba(255,195,77,.55)"; ctx.lineWidth = 1.5; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(sx, sy); ctx.stroke(); ctx.setLineDash([]); ctx.fillStyle = "#ffc34d"; ctx.beginPath(); ctx.arc(x + (sx - x) * ph, y + (sy - y) * ph, 2.5, 0, 7); ctx.fill(); });
      star(ctx, sx, sy, 13, heat(a.p, 1)); ctx.fillStyle = "#fff"; ctx.font = "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText("CÂU CỦA EM", sx + 16, sy + 4);
    }
    ctx.fillStyle = "#8f96d4"; ctx.font = "600 11px JetBrains Mono, monospace"; ctx.fillText(ST.mapMode === "pca" ? `BẢN ĐỒ TỪ · ${MAPW.length} TỪ MANG NGHĨA · ${ST.dim} CHIỀU → 2 CHIỀU` : "BẢN ĐỒ THEO TRỤC CẢM XÚC MÁY HỌC ĐƯỢC", 16, 22);
  }
  function star(ctx, x, y, r, col) { ctx.fillStyle = col; ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r * 0.45 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); ctx.stroke(); }

  // ---------- SOI ----------
  const SOI = [
    { t: "Tách từ", e: "blocks", d: "Tiếng Việt viết cách theo âm tiết, nhưng nhiều <b>từ</b> có hai, ba âm tiết như \"tuyệt vời\", \"bài kiểm tra\". Máy ghép chúng lại trước. Chữ màu xám là từ máy chưa từng gặp." },
    { t: "Tra vector", e: "layers", d: "Mỗi từ có một <b>vector</b>: một dãy số (ở đây {dim} số). Ô xanh là số dương, ô đỏ là số âm. Hai từ có dãy số giống nhau là hai từ có nghĩa gần nhau." },
    { t: "Nghĩa từ hàng xóm", e: "eye", d: "Vector được học từ việc <b>từ này hay đứng cạnh từ nào</b>. \"Vui\" hay đứng gần \"mỉm cười\", \"vỗ tay\"; \"buồn\" hay đứng gần \"thở dài\", \"phàn nàn\". Đây là số lần đếm được." },
    { t: "Bản đồ từ", e: "map", d: "Ép {dim} chiều xuống <b>2 chiều</b> để vẽ được. Từ cùng nhóm nghĩa nằm gần nhau: người trong nhà, nghề nghiệp, món ăn, từ vui, từ buồn." },
    { t: "Vector của câu", e: "crosshair", d: "Cách đơn giản nhất để có vector của cả câu: lấy <b>trung bình</b> vector các từ. Ngôi sao là trung bình đó. Cách này bỏ qua thứ tự từ!" },
    { t: "Chấm cảm xúc", e: "target", d: "Lớp phân loại (giống Dự án 6) nhân vector câu với trọng số đã học, rồi đổi thành xác suất <b>tích cực</b>." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), octx = soi.getContext("2d");
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 2) prog.done("soi"); $("soiText").innerHTML = "<p>" + SOI[i].d.replace(/\{dim\}/g, ST.dim) + "</p>"; }); P.visible($("soi"), (v) => (soiVisible = v));
  const lab = (ctx, t, x, y, c, f) => { ctx.fillStyle = c || "#c3c7f0"; ctx.font = f || "700 12px Be Vietnam Pro, sans-serif"; ctx.fillText(t, x, y); };
  function renderSoi() {
    const ctx = octx, s = soiStep, a = ST.ana || analyze(); D.labBg(ctx);
    if (s === 0) { lab(ctx, "Âm tiết", 20, 40); const syl = ST.text.toLowerCase().replace(/[.,!?]/g, " ").split(/\s+/).filter(Boolean); let x = 20; syl.forEach((w) => { ctx.font = "600 14px Be Vietnam Pro, sans-serif"; const tw = ctx.measureText(w).width + 16; if (x + tw > 630) return; ctx.fillStyle = "#232866"; D.rr(ctx, x, 54, tw, 30, 6); ctx.fill(); lab(ctx, w, x + 8, 74, "#fff", "600 14px Be Vietnam Pro, sans-serif"); x += tw + 6; }); D.arrow(ctx, { x: 320, y: 100 }, { x: 320, y: 140 }, "#7c8cff", 3); lab(ctx, "Từ", 20, 170); x = 20; a.contrib.forEach((c) => { const w = c.w.replace(/_/g, " "); ctx.font = "700 15px Be Vietnam Pro, sans-serif"; const tw = ctx.measureText(w).width + 18; if (x + tw > 630) return; ctx.fillStyle = c.oov ? "#4a4f7a" : c.neg ? "#ffc34d" : "#5443ff"; D.rr(ctx, x, 184, tw, 36, 8); ctx.fill(); lab(ctx, w, x + 9, 208, c.neg ? "#1b1f4a" : "#fff", "700 15px Be Vietnam Pro, sans-serif"); x += tw + 8; }); return; }
    if (s === 1) { const ws = a.ws.filter((w) => IDX.has(w)).slice(0, 9); ws.forEach((w, r) => { const e = vec(w), y = 30 + r * 48, mx = 0.9 * Math.max(...E.flat().map(Math.abs)); lab(ctx, w.replace(/_/g, " "), 20, y + 22, "#fff", "700 13px Be Vietnam Pro, sans-serif"); e.forEach((v, c) => { const t = Math.max(-1, Math.min(1, v / mx)); ctx.fillStyle = t >= 0 ? `rgba(94,242,214,${0.15 + t * 0.85})` : `rgba(255,125,95,${0.15 - t * 0.85})`; const cw = Math.min(54, 440 / ST.dim); ctx.fillRect(150 + c * cw, y, cw - 3, 32); if (cw > 40) lab(ctx, v.toFixed(2), 152 + c * cw, y + 21, "#121633", "10px JetBrains Mono, monospace"); }); }); return; }
    if (s === 2) { const w = IDX.has(ST.sel) ? ST.sel : a.ws.find((x) => IDX.has(x)) || "vui", i = IDX.get(w), row = [...CO[i]].map((c, j) => ({ w: VOC[j], c })).filter((x) => x.c).sort((u, v) => v.c - u.c).slice(0, 12), mx = row[0] ? row[0].c : 1; lab(ctx, `Những từ hay đứng cạnh “${w.replace(/_/g, " ")}” (cửa sổ ±${ST.win} từ)`, 20, 32); row.forEach((x, r) => { const y = 50 + r * 34; lab(ctx, x.w.replace(/_/g, " "), 20, y + 15, "#fff", "600 13px Be Vietnam Pro, sans-serif"); ctx.fillStyle = "#232866"; ctx.fillRect(170, y + 3, 380, 16); ctx.fillStyle = "#7c8cff"; ctx.fillRect(170, y + 3, (x.c / mx) * 380, 16); lab(ctx, String(x.c), 558, y + 16, "#c3c7f0", "11px JetBrains Mono, monospace"); }); lab(ctx, "Chạm một từ trên bản đồ ở phần Mồi để đổi từ.", 20, 470, "#8f96d4", "11px Be Vietnam Pro, sans-serif"); return; }
    if (s === 3) { ctx.drawImage(stage, 0, 0); return; }
    if (s === 4) { const ws = a.ws.filter((w) => IDX.has(w)).slice(0, 7), sv = sentVec(a.ws, ST.neg), rows = [...ws.map((w) => ({ w, e: vec(w) })), { w: "TRUNG BÌNH", e: sv }], mx = 0.9 * Math.max(...E.flat().map(Math.abs)); rows.forEach((r2, k) => { const y = 30 + k * 50 + (k === rows.length - 1 ? 16 : 0); lab(ctx, r2.w.replace(/_/g, " "), 20, y + 22, k === rows.length - 1 ? "#ffc34d" : "#fff", "700 13px Be Vietnam Pro, sans-serif"); const cw = Math.min(54, 440 / ST.dim); r2.e.forEach((v, c) => { const t = Math.max(-1, Math.min(1, v / mx)); ctx.fillStyle = t >= 0 ? `rgba(94,242,214,${0.15 + t * 0.85})` : `rgba(255,125,95,${0.15 - t * 0.85})`; ctx.fillRect(150 + c * cw, y, cw - 3, 32); }); if (k === rows.length - 2) { ctx.strokeStyle = "#ffc34d"; ctx.beginPath(); ctx.moveTo(150, y + 48); ctx.lineTo(600, y + 48); ctx.stroke(); } }); return; }
    if (a.p == null) { lab(ctx, "Câu chưa có từ nào máy biết.", 200, 240); return; }
    const sv = sentVec(a.ws, ST.neg), z = sv.map((v, c) => (v - clf.mu[c]) / clf.sd[c]), con = z.map((v, c) => v * (clf.W[1][c] - clf.W[0][c])), mx = Math.max(...con.map(Math.abs), 0.01);
    lab(ctx, "Mỗi chiều đẩy về tích cực (xanh) hay tiêu cực (cam)", 20, 32); con.forEach((v, c) => { const y = 50 + c * Math.min(44, 300 / ST.dim); lab(ctx, `chiều ${c + 1}`, 20, y + 14, "#c3c7f0", "11px JetBrains Mono, monospace"); ctx.fillStyle = v >= 0 ? "#5ef2d6" : "#ff7d5f"; const w = (Math.abs(v) / mx) * 200; ctx.fillRect(v >= 0 ? 330 : 330 - w, y + 2, w, 16); });
    ctx.strokeStyle = "rgba(255,255,255,.4)"; ctx.beginPath(); ctx.moveTo(330, 44); ctx.lineTo(330, 370); ctx.stroke();
    ctx.fillStyle = "#232866"; D.rr(ctx, 120, 400, 400, 24, 12); ctx.fill(); ctx.fillStyle = heat(a.p, 1); D.rr(ctx, 120, 400, Math.max(24, 400 * a.p), 24, 12); ctx.fill(); lab(ctx, `Tích cực ${Math.round(a.p * 100)}%`, 260, 450, "#fff", "800 18px Be Vietnam Pro, sans-serif");
  }
  function soiLive() {
    const s = soiStep, a = ST.ana, el = $("soiLive");
    if (s === 0) el.innerHTML = `<span class="hl">${a.ws.length}</span> từ · máy chưa biết <span class="w">${a.contrib.filter((c) => c.oov).length}</span> từ`;
    else if (s === 1 || s === 4) el.innerHTML = `Mỗi từ = <span class="hl">${ST.dim}</span> con số · từ điển ${VOC.length} từ`;
    else if (s === 2) el.innerHTML = `Bảng đếm có ${VOC.length} × ${VOC.length} = <span class="hl">${(VOC.length * VOC.length).toLocaleString("vi-VN")}</span> ô, được nén còn ${VOC.length} × ${ST.dim}`;
    else if (s === 3) el.innerHTML = `Kiểu bản đồ: <span class="hl">${ST.mapMode === "pca" ? "nén đều" : "trục cảm xúc"}</span>`;
    else el.innerHTML = a.p == null ? "—" : `Xác suất tích cực: <span class="hl">${Math.round(a.p * 100)}%</span>`;
  }

  // ---------- Tự làm ----------
  function renderLab() {
    if (!$("anaOut")) return;
    const A = vec(ST.A), B = vec(ST.B), C = vec(ST.C);
    if (A && B && C) { const r = A.map((x, i) => x - B[i] + C[i]), nb = nearest(r, 4, [ST.A, ST.B, ST.C]); ST.anaRes = nb; $("anaOut").innerHTML = nb.map((x, i) => `<div class="r"><span>${i === 0 ? "<b>" : ""}${x.w.replace(/_/g, " ")}${i === 0 ? "</b>" : ""}</span><span class="bar"><i style="width:${Math.max(0, x.c) * 100}%;background:${i ? "#7c8cff" : "#5ef2d6"}"></i></span><span>${x.c.toFixed(2)}</span></div>`).join(""); }
    // độ lệch giới của nghề
    const g = ["người_đàn_ông", "người_phụ_nữ"].map(vec); if (g[0] && g[1]) { const ax = g[0].map((x, i) => x - g[1][i]); $("biasOut").innerHTML = PROF.map((p) => { const c = cos(vec(p), ax); return `<div class="r"><span>${p.replace(/_/g, " ")}</span><span class="bar" style="position:relative"><i style="position:absolute;left:${50 + Math.min(0, c) * 50}%;width:${Math.abs(c) * 50}%;background:${c > 0 ? "#7c8cff" : "#ff8fd0"}"></i><i style="position:absolute;left:50%;width:2px;background:#fff"></i></span><span>${c > 0.08 ? "nam" : c < -0.08 ? "nữ" : "cân"}</span></div>`; }).join(""); }
    // biểu đồ cảm xúc theo từng từ
    const cv = $("chart"), ctx = cv.getContext("2d"), W = cv.width, H = cv.height, TH = P.TH, L = 44, B2 = 40, T = 12; ctx.clearRect(0, 0, W, H); ctx.font = "11px JetBrains Mono, monospace";
    [0, 0.35, 0.5, 0.65, 1].forEach((v) => { const y = T + (1 - v) * (H - T - B2); ctx.strokeStyle = TH.grid; ctx.beginPath(); ctx.moveTo(L, y); ctx.lineTo(W - 10, y); ctx.stroke(); ctx.fillStyle = TH.text; ctx.fillText(Math.round(v * 100) + "%", 4, y + 4); });
    const Hh = ST.hist || [], n = Math.max(2, Hh.length), X = (i) => L + (i / (n - 1)) * (W - L - 30), Y = (v) => T + (1 - v) * (H - T - B2);
    ctx.strokeStyle = TH.violet; ctx.lineWidth = 3; ctx.beginPath(); let on = false; Hh.forEach((h, i) => { if (h.p == null) return; on ? ctx.lineTo(X(i), Y(h.p)) : ctx.moveTo(X(i), Y(h.p)); on = true; }); ctx.stroke();
    Hh.forEach((h, i) => { if (h.p != null) { ctx.fillStyle = heat(h.p, 1); ctx.beginPath(); ctx.arc(X(i), Y(h.p), 5, 0, 7); ctx.fill(); } ctx.fillStyle = TH.ink; ctx.font = "12px Be Vietnam Pro, sans-serif"; ctx.fillText(h.w.replace(/_/g, " "), X(i) - 12, H - 14); });
  }
  function genCode() {
    const k = (t) => `<span class="k">${t}</span>`, n = (t) => `<span class="n">${t}</span>`, c = (t) => `<span class="c">${t}</span>`;
    $("genCode").innerHTML =
`${c("// 1. học vector từ ngữ cảnh (làm một lần)")}
dem = demCanhNhau(khoCau, ${n(ST.win)});      ${c("// từ nào đứng cạnh từ nào")}
vector = nen(PPMI(dem), ${n(ST.dim)});        ${c("// " + VOC.length + " từ × " + ST.dim + " số")}
${c("// 2. chấm cảm xúc một câu")}
${k("const")} tu = tachTu(cau)${ST.neg ? `.map(daoNghiaSauChuKhong)` : ""};
${k("const")} v = trungBinh(tu.map(w =&gt; vector[w]));  ${c("// bỏ qua từ lạ")}
${k("const")} tichCuc = sigmoid(nhan(trongSo, v) + b);`;
  }

  // ---------- điều khiển ----------
  const PRE = ["phở ở quán này ngon tuyệt vời", "bài kiểm tra hôm nay khó, em thất vọng", "cả lớp vỗ tay vì chuyến dã ngoại thú vị", "bộ phim này nhạt và chán", "em rất thích tiết toán"];
  const syncs = [];
  function setText(t) { ST.text = t; $("sentIn").value = t; refresh(); }
  function bind() {
    $("preBtns").innerHTML = PRE.map((p, i) => `<button class="btn small ghost" data-i="${i}">${p}</button>`).join(""); $("preBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { setText(PRE[+b.dataset.i]); prog.done("try"); }));
    $("sentIn").addEventListener("input", (e) => { ST.text = e.target.value; refresh(); if (ST.text.length > 8) prog.done("try"); });
    stage.addEventListener("click", (e) => { const r = stage.getBoundingClientRect(), x = ((e.clientX - r.left) / r.width) * 640, y = ((e.clientY - r.top) / r.height) * 480; let best = null, bd = 400; PTS.forEach((p) => { const d = (p.x - x) ** 2 + (p.y - y) ** 2; if (d < bd) { bd = d; best = p; } }); if (best) { ST.sel = best.w; refresh(); prog.done("map"); } });
    $("mapBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { ST.mapMode = b.dataset.m; project(); markMap(); }));
    const opts = () => VOC.slice().sort((a, b) => a.localeCompare(b, "vi")).map((w) => `<option value="${w}">${w.replace(/_/g, " ")}</option>`).join("");
    const fillSel = () => ["selA", "selB", "selC"].forEach((id, i) => { $(id).innerHTML = opts(); $(id).value = [ST.A, ST.B, ST.C][i]; });
    fillSel(); ["selA", "selB", "selC"].forEach((id, i) => ($(id).onchange = (e) => { ST["ABC"[i]] = e.target.value; renderLab(); prog.done("math"); }));
    $("anaBtns").querySelectorAll("button").forEach((b) => (b.onclick = () => { [ST.A, ST.B, ST.C] = b.dataset.q.split(","); fillSel(); renderLab(); prog.done("math"); }));
    syncs.push(P.range("dim", () => ST.dim, (v) => (ST.dim = v), (v) => v + " số", train));
    syncs.push(P.range("win", () => ST.win, (v) => (ST.win = v), (v) => "±" + v + " từ", train));
    $("neg").onchange = (e) => { ST.neg = e.target.checked; refresh(); }; $("balance").onchange = (e) => { ST.biased = !e.target.checked; train(); };
    $("btnTeach").onclick = () => { ST.taught = true; train(); fillSel(); $("teachInfo").textContent = "Đã thêm 30 câu có chữ \"xịn\" vào dữ liệu và học lại."; };
    const sync = () => { syncs.forEach((f) => f()); $("neg").checked = ST.neg; $("balance").checked = !ST.biased; markMap(); };
    function markMap() { $("mapBtns").querySelectorAll("button").forEach((b) => b.classList.toggle("ghost", b.dataset.m !== ST.mapMode)); }
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); b.closest(".break").classList.add("on");
      Object.assign(ST, DEF); if (k === "bias") { ST.biased = true; ST.sel = "bác_sĩ"; } sync(); train(); fillSel();
      setText({ neg: "bài kiểm tra hôm nay không vui chút nào", oov: "trà sữa quán này xịn quá", bias: "bác sĩ rất bận" }[k]); prog.done("broke"); $("moi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); Object.assign(ST, DEF); sync(); train(); fillSel(); setText(PRE[0]); };
    sync();
  }

  const QUIZ = [
    { q: "Vector của một từ (word embedding) là gì?", o: ["Hình vẽ của từ", "Một dãy số đại diện cho từ, sao cho từ có nghĩa gần nhau thì có dãy số gần nhau", "Số chữ cái của từ", "Vị trí của từ trong từ điển"], a: 1, e: "Nhờ biến từ thành vector, máy có thể đo độ giống nhau về nghĩa bằng khoảng cách, như em đã làm với điểm ảnh, màu sắc và tư thế." },
    { q: "Máy học được rằng \"vui\" và \"hạnh phúc\" gần nghĩa nhau bằng cách nào?", o: ["Có người dạy từng cặp", "Hai từ này hay xuất hiện cạnh những từ giống nhau (mỉm cười, vỗ tay…)", "Tra từ điển đồng nghĩa", "Đếm số chữ cái"], a: 1, e: "Ý tưởng \"biết nghĩa một từ qua những từ đứng cạnh nó\" là nền tảng của mọi mô hình ngôn ngữ hiện đại." },
    { q: "Câu \"không vui chút nào\" bị chấm là tích cực. Vì sao?", o: ["Máy bị hỏng", "Lấy trung bình vector bỏ qua thứ tự từ, nên chữ \"không\" không đảo được nghĩa của \"vui\"", "Câu quá ngắn", "Chữ \"vui\" viết sai"], a: 1, e: "Các mô hình hiện đại đọc cả câu theo thứ tự (và chú ý tới quan hệ giữa các từ) nên xử lý phủ định tốt hơn nhiều." },
    { q: "Phép tính vector \"ông − bà + mẹ\" cho kết quả gần \"bố\" nghĩa là gì?", o: ["Máy biết làm toán cộng", "Hướng từ \"bà\" tới \"ông\" (nữ → nam) cũng là hướng từ \"mẹ\" tới \"bố\": quan hệ nghĩa trở thành hướng trong không gian", "Ông và bố là một người", "Máy đoán bừa"], a: 1, e: "Những hướng như nam ↔ nữ, già ↔ trẻ tự xuất hiện trong không gian vector khi máy học từ ngữ cảnh." },
    { q: "Nếu dữ liệu luôn viết \"bác sĩ\" đi với \"người đàn ông\", vector của \"bác sĩ\" sẽ…", o: ["Không bị ảnh hưởng", "Lệch về phía nam, và máy mang theo định kiến đó vào các ứng dụng sau này", "Biến mất", "Gần \"phở\" hơn"], a: 1, e: "AI học định kiến từ dữ liệu. Cần kiểm tra và cân bằng dữ liệu, nhất là khi AI dùng để tuyển dụng hay đánh giá con người." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;

  let last = performance.now(), slow = 0;
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; renderStage(); if (soiVisible) renderSoi(); if (now - slow > 250) { slow = now; if (soiVisible) soiLive(); } requestAnimationFrame(tick); }
  P.nav(); train(); bind(); setText(PRE[0]);
  window.__hka17 = { ST, vec, nearest, score: (t) => score(words(t), ST.neg), testAcc: () => testAcc, words };
  requestAnimationFrame(tick);
})();
