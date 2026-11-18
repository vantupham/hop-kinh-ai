/* Hộp Kính AI · Dự án 19 · Ảnh thật hay ảnh ghép? (hạt nhiễu, bóng đổ, kính lúp, máy dò, kiểm tra nguồn) */
(function () {
  "use strict";
  const P = HKA.P, $ = P.$, D = P.draw;
  const prog = P.progress("hka-39");
  const W = 880, H = 440, CW = 80, CH = 88, NX = 11, NY = 5;
  const ST = { img: 0, q: 1, zoom: 3, lens: false, noise: false, shadow: false, ptr: null, found: {}, ans: {}, src: {}, cache: {}, stats: null, t: 0 };

  // ---------- vẽ cảnh ----------
  const lin = (c, x0, y0, x1, y1, stops) => { const g = c.createLinearGradient(x0, y0, x1, y1); stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s)); return g; };
  const ell = (c, x, y, rx, ry, col, rot) => { c.fillStyle = col; c.beginPath(); c.ellipse(x, y, rx, ry, rot || 0, 0, 7); c.fill(); };
  const shadow = (c, x, y, rx, ry) => ell(c, x, y, rx, ry, "rgba(30,25,20,.33)");
  function addNoise(c, sigma, seed) {
    if (!sigma) return; const id = c.getImageData(0, 0, W, H), d = id.data, r = P.rng(seed); let spare = null;
    const g = () => { if (spare !== null) { const s = spare; spare = null; return s; } const u = r() || 1e-9, v = r(), m = Math.sqrt(-2 * Math.log(u)); spare = m * Math.sin(6.2832 * v); return m * Math.cos(6.2832 * v); };
    for (let i = 0; i < d.length; i += 4) { const n = g() * sigma; d[i] += n + g() * sigma * 0.25; d[i + 1] += n; d[i + 2] += n + g() * sigma * 0.25; }
    c.putImageData(id, 0, 0);
  }
  function tree(c, x, y, h, col) { c.fillStyle = "#6b4a2b"; c.fillRect(x - 6, y - h * 0.45, 12, h * 0.45); ell(c, x, y - h * 0.62, h * 0.32, h * 0.3, col); ell(c, x - h * 0.14, y - h * 0.55, h * 0.2, h * 0.18, col); }
  function pine(c, x, y, h, col) { c.fillStyle = "#5b3d22"; c.fillRect(x - 5, y - h * 0.25, 10, h * 0.25); c.fillStyle = col; for (let k = 0; k < 3; k++) { const yy = y - h * 0.2 - k * h * 0.24, w = h * (0.34 - k * 0.07); c.beginPath(); c.moveTo(x - w, yy); c.lineTo(x + w, yy); c.lineTo(x, yy - h * 0.38); c.closePath(); c.fill(); } }
  function cloud(c, x, y, s) { [[0, 0, 40], [34, -12, 34], [66, 2, 36], [-34, 6, 28], [96, 10, 24]].forEach(([dx, dy, r]) => ell(c, x + dx * s, y + dy * s, r * s, r * s * 0.8, "#ffffff")); c.fillStyle = "rgba(160,175,200,.35)"; c.fillRect(x - 60 * s, y + 14 * s, 180 * s, 10 * s); }
  function windows(c, x0, y0, cols, rows, w, h, gx, gy, col, weird) {
    for (let r = 0; r < rows; r++) for (let k = 0; k < cols; k++) {
      let x = x0 + k * (w + gx), y = y0 + r * (h + gy), ww = w, hh = h; c.fillStyle = col;
      if (weird && (r * 7 + k * 3) % 5 === 0) { ww = w * (0.6 + ((r + k) % 3) * 0.3); y += (k % 2) * 5; c.beginPath(); c.ellipse(x + ww / 2, y + hh / 2, ww / 2, hh / 2 + (k % 3) * 3, 0.3 * (k % 2 ? 1 : -1), 0, 7); c.fill(); continue; }
      c.fillRect(x, y, ww, hh);
    }
  }
  const SCENES = [
    { n: "Hoàng hôn trên biển", truth: "real", sigma: 7,
      draw(c) {
        c.fillStyle = lin(c, 0, 0, 0, 250, ["#ff9f6e", "#ffd7a0"]); c.fillRect(0, 0, W, 250);
        ell(c, 170, 150, 70, 70, "rgba(255,240,200,.35)"); ell(c, 170, 150, 42, 42, "#fff1c1");
        c.fillStyle = lin(c, 0, 250, 0, 330, ["#3b7ea6", "#2b5f86"]); c.fillRect(0, 250, W, 80);
        for (let k = 0; k < 7; k++) { c.fillStyle = "rgba(255,230,180,.45)"; c.fillRect(140 - k * 6, 258 + k * 10, 60 + k * 12, 3); }
        c.fillStyle = lin(c, 0, 330, 0, 440, ["#e9cf9b", "#dcb97f"]); c.fillRect(0, 330, W, 110);
        shadow(c, 720, 400, 90, 10); shadow(c, 470, 398, 55, 8);
        c.strokeStyle = "#7a5230"; c.lineWidth = 14; c.beginPath(); c.moveTo(640, 392); c.quadraticCurveTo(650, 290, 600, 210); c.stroke();
        for (let k = 0; k < 6; k++) ell(c, 600 + Math.cos(k) * 40, 205 + Math.sin(k * 1.3) * 12, 58, 13, "#2f6b3a", k * 1.05);
        c.fillStyle = "#555"; c.fillRect(418, 300, 4, 92); c.fillStyle = "#d9443a"; c.beginPath(); c.ellipse(420, 302, 62, 30, 0, Math.PI, 0); c.fill(); c.fillStyle = "#fff"; c.beginPath(); c.moveTo(420, 272); c.lineTo(400, 302); c.lineTo(440, 302); c.fill();
      },
      shadows: [[640, 392, 790, 402], [420, 392, 515, 400]], clues: [],
      src: "Đăng lần đầu bởi bạn Minh (lớp 9A) trên trang của lớp, kèm thông tin máy ảnh và ngày chụp. Tìm ảnh ngược: không thấy ở đâu sớm hơn. <b>Nguồn đáng tin.</b>" },
    { n: "Khủng long ở sân trường", truth: "edit", sigma: 7,
      draw(c) {
        c.fillStyle = lin(c, 0, 0, 0, 330, ["#8ec9f0", "#d6eefb"]); c.fillRect(0, 0, W, 330); c.fillStyle = lin(c, 0, 330, 0, 440, ["#cdbd9e", "#b9a682"]); c.fillRect(0, 330, W, 110);
        c.fillStyle = "#c4513a"; c.fillRect(455, 128, 400, 24); c.fillStyle = "#f2d16b"; c.fillRect(470, 152, 370, 180); windows(c, 490, 172, 6, 3, 38, 30, 20, 20, "#6aa6c9"); c.fillStyle = "#8a5a3a"; c.fillRect(630, 272, 50, 60);
        shadow(c, 175, 393, 66, 9); shadow(c, 320, 393, 60, 9); tree(c, 110, 392, 170, "#3f8f4a"); tree(c, 262, 392, 150, "#4a9a50");
      },
      paste(c) { // vật dán vào: không có nhiễu, bóng ngược chiều
        shadow(c, 300, 394, 90, 10); c.fillStyle = "#5cc45f";
        c.beginPath(); c.moveTo(270, 300); c.quadraticCurveTo(200, 290, 150, 330); c.quadraticCurveTo(220, 320, 280, 330); c.fill();
        ell(c, 360, 300, 100, 58, "#5cc45f"); c.fillRect(300, 330, 26, 60); c.fillRect(400, 330, 26, 60);
        c.beginPath(); c.moveTo(430, 280); c.quadraticCurveTo(470, 200, 450, 160); c.lineTo(480, 160); c.quadraticCurveTo(500, 220, 455, 300); c.fill();
        ell(c, 478, 158, 34, 20, "#5cc45f"); ell(c, 488, 152, 4, 4, "#1b1b1b"); c.fillStyle = "#3e9a42"; for (let k = 0; k < 5; k++) { c.beginPath(); c.moveTo(300 + k * 24, 248 - (k % 2) * 4); c.lineTo(312 + k * 24, 228); c.lineTo(324 + k * 24, 250); c.fill(); }
      },
      shadows: [[110, 392, 225, 395], [262, 392, 370, 395], [360, 390, 215, 396]],
      clues: [{ x: 280, y: 394, r: 60, t: "Bóng khủng long đổ sang <b>trái</b>, còn bóng hai cây đổ sang <b>phải</b>: như có hai Mặt Trời. Vật này được ghép vào." }, { x: 370, y: 290, r: 80, t: "Vùng khủng long <b>mịn</b>, không có hạt nhiễu như phần còn lại của ảnh: dấu hiệu dán từ một ảnh khác." }],
      src: "Tìm ảnh ngược: ảnh gốc sân trường đăng trên trang của trường năm ngoái, <b>không có khủng long</b>. Con khủng long giống hệt một hình minh họa trong sách khoa học." },
    { n: "Thành phố tương lai", truth: "ai", sigma: 0.6,
      draw(c) {
        c.fillStyle = lin(c, 0, 0, 0, 360, ["#6a5acd", "#f0a6c8"]); c.fillRect(0, 0, W, 360); c.fillStyle = lin(c, 0, 360, 0, 440, ["#9095b0", "#7a7f99"]); c.fillRect(0, 360, W, 80);
        [[20, 170, 120, "#3d4a7a"], [150, 120, 110, "#55609a"], [270, 190, 90, "#47528a"], [600, 140, 120, "#3d4a7a"], [730, 100, 130, "#55609a"]].forEach(([x, y, w, col], i) => { c.fillStyle = col; c.fillRect(x, y, w, 360 - y); windows(c, x + 12, y + 16, Math.floor((w - 12) / 26), Math.floor((340 - y) / 34), 16, 20, 10, 14, "#ffd97a", i === 1 || i === 4); });
        c.fillStyle = "#f6f1e1"; c.fillRect(300, 98, 300, 54); c.fillStyle = "#3a2f6a"; c.fillRect(300, 152, 8, 60); c.fillRect(592, 152, 8, 60);
        c.fillStyle = "#2b2140"; c.font = "800 24px Be Vietnam Pro, sans-serif"; c.fillText("TRƯƠỜNG HỌOC SỐỐ BA", 316, 134);
        shadow(c, 255, 398, 55, 8); shadow(c, 645, 398, 55, 8);
        [[200, "#2b2f4f"], [700, "#2b2f4f"]].forEach(([x, col]) => { c.fillStyle = col; c.fillRect(x - 3, 262, 6, 132); ell(c, x, 258, 14, 9, "#ffe9a8"); });
      },
      shadows: [[200, 394, 300, 400], [700, 394, 600, 400]],
      clues: [{ x: 450, y: 125, r: 110, t: "Chữ trên biển bị <b>lặp, méo, vô nghĩa</b> (\"TRƯƠỜNG HỌOC SỐỐ\"): lỗi rất hay gặp của ảnh AI tạo." }, { x: 640, y: 398, r: 60, t: "Hai cột đèn đứng gần nhau nhưng <b>bóng đổ ngược chiều</b> nhau." }, { x: 200, y: 200, r: 80, t: "Cửa sổ <b>méo, tròn, lệch hàng</b> lẫn với cửa sổ vuông: chi tiết kì lạ của ảnh AI." }],
      src: "Đăng bởi một trang chuyên đăng ảnh tạo bằng AI, chú thích ghi <b>\"tạo bằng công cụ AI\"</b>. Không có trường nào tên như trên biển." },
    { n: "Mây trên cánh đồng", truth: "edit", sigma: 7, copy: [140, 40, 190, 100, 552, 62],
      draw(c) {
        c.fillStyle = lin(c, 0, 0, 0, 260, ["#7fc0ee", "#e2f3ff"]); c.fillRect(0, 0, W, 260);
        c.fillStyle = "#7a9f8a"; c.beginPath(); c.moveTo(0, 270); for (let x = 0; x <= W; x += 40) c.lineTo(x, 230 + Math.sin(x / 90) * 22); c.lineTo(W, 300); c.lineTo(0, 300); c.fill();
        c.fillStyle = lin(c, 0, 280, 0, 440, ["#86c95a", "#5c9e3c"]); c.fillRect(0, 285, W, 155); c.strokeStyle = "rgba(40,90,30,.35)"; c.lineWidth = 2; for (let k = 0; k < 14; k++) { c.beginPath(); c.moveTo(440, 285); c.lineTo(-300 + k * 110, 440); c.stroke(); }
        cloud(c, 220, 95, 1); c.fillStyle = "#e9e0cf"; c.fillRect(690, 282, 70, 40); c.fillStyle = "#b5503c"; c.beginPath(); c.moveTo(680, 284); c.lineTo(725, 255); c.lineTo(770, 284); c.fill();
      },
      shadows: [], clues: [{ x: 650, y: 115, r: 85, t: "Đám mây này <b>giống hệt</b> đám mây bên trái đến từng chi tiết, kể cả hạt nhiễu: một vùng ảnh bị <b>sao chép rồi dán</b>." }],
      src: "Tìm ảnh ngược: ảnh gốc chỉ có <b>một đám mây</b>. Người đăng đã thêm mây \"cho đẹp\" khi gửi dự thi, dù cuộc thi không cho phép chỉnh sửa." },
    { n: "Rừng thông buổi sáng", truth: "real", sigma: 7,
      draw(c) {
        c.fillStyle = lin(c, 0, 0, 0, 300, ["#cfe8d8", "#f5f3dc"]); c.fillRect(0, 0, W, 300); ell(c, 800, 60, 70, 70, "rgba(255,250,220,.6)"); ell(c, 800, 60, 34, 34, "#fffbe6");
        c.fillStyle = lin(c, 0, 300, 0, 440, ["#7aa35a", "#5d8a45"]); c.fillRect(0, 300, W, 140); c.fillStyle = "#c9b48a"; c.beginPath(); c.moveTo(380, 440); c.lineTo(460, 300); c.lineTo(480, 300); c.lineTo(560, 440); c.fill();
        [[90, 380, 200], [200, 400, 230], [300, 350, 160], [620, 360, 170], [720, 395, 220], [820, 370, 190]].forEach(([x, y, h]) => { shadow(c, x - 70, y + 4, 70, 9); });
        [[90, 380, 200], [200, 400, 230], [300, 350, 160], [620, 360, 170], [720, 395, 220], [820, 370, 190]].forEach(([x, y, h], i) => pine(c, x, y, h, i % 2 ? "#2f6b3a" : "#3c7a45"));
      },
      shadows: [[200, 400, 110, 404], [720, 395, 630, 399], [300, 350, 210, 354]], clues: [],
      src: "Bài dự thi của câu lạc bộ nhiếp ảnh trường, có <b>tệp gốc</b> từ máy ảnh và thông tin ngày giờ chụp. <b>Nguồn đáng tin.</b>" },
    { n: "Tuyết rơi trên đồng lúa", truth: "ai", sigma: 0.6,
      draw(c) {
        c.fillStyle = lin(c, 0, 0, 0, 280, ["#b9d9f0", "#eef7ff"]); c.fillRect(0, 0, W, 280);
        ["#e74c3c", "#f39c12", "#f1c40f", "#2ecc71", "#3498db", "#8e44ad"].forEach((col, k) => { c.strokeStyle = col; c.globalAlpha = 0.55; c.lineWidth = 10; c.beginPath(); c.arc(440, 420, 330 - k * 10, Math.PI, 0); c.stroke(); }); c.globalAlpha = 1;
        c.fillStyle = lin(c, 0, 280, 0, 440, ["#69c255", "#3f9a36"]); c.fillRect(0, 280, W, 160); c.strokeStyle = "rgba(30,90,30,.4)"; c.lineWidth = 2; for (let y = 292; y < 440; y += 12) { c.beginPath(); c.moveTo(0, y); c.lineTo(W, y); c.stroke(); }
        const r = P.rng(61); for (let k = 0; k < 160; k++) ell(c, r() * W, r() * H, 2 + r() * 3, 2 + r() * 3, "rgba(255,255,255,.9)");
        for (let k = 0; k < 12; k++) ell(c, r() * W, 300 + r() * 130, 30 + r() * 30, 6, "rgba(255,255,255,.85)");
        c.fillStyle = "#c0392b"; c.fillRect(240, 330, 400, 44); c.fillStyle = "#ffe066"; c.font = "800 22px Be Vietnam Pro, sans-serif"; c.fillText("CHÀO MỪNG MÙA LÚAA MỚIỚI", 262, 360);
      },
      shadows: [], clues: [{ x: 440, y: 352, r: 120, t: "Chữ trên băng rôn bị <b>lặp chữ, sai dấu</b> (\"LÚAA MỚIỚI\"): lỗi hay gặp của ảnh AI tạo." }, { x: 440, y: 150, r: 150, t: "<b>Nội dung vô lí</b>: tuyết rơi trên đồng lúa xanh, lại có cầu vồng giữa trời tuyết." }],
      src: "Đăng kèm chú thích \"tuyết rơi ở đồng lúa quê em\" bởi tài khoản không rõ danh tính. <b>Không cơ quan khí tượng nào ghi nhận tuyết.</b> Ảnh có dấu hiệu từ công cụ tạo ảnh AI." },
    { n: "Mưa đá khổng lồ", truth: "ai", sigma: 7, special: true,
      draw(c) {
        c.fillStyle = lin(c, 0, 0, 0, 250, ["#8d98a6", "#c2c8cf"]); c.fillRect(0, 0, W, 250);
        [[0, 150, 200, "#a7a196"], [200, 170, 160, "#bcb6a8"], [360, 140, 220, "#9f998e"], [580, 165, 300, "#b3ad9f"]].forEach(([x, y, w, col]) => { c.fillStyle = col; c.fillRect(x, y, w, 250 - y); windows(c, x + 16, y + 16, Math.floor((w - 16) / 34), 2, 22, 24, 12, 14, "#59636e", false); });
        c.fillStyle = "#5a5f66"; c.fillRect(0, 250, W, 190); c.fillStyle = "#e8e2c8"; for (let x = 20; x < W; x += 90) c.fillRect(x, 340, 50, 6);
        c.fillStyle = "#2f5e8a"; c.fillRect(600, 60, 230, 40); c.fillStyle = "#fff"; c.font = "800 20px Be Vietnam Pro, sans-serif"; c.fillText("THỊ TRẤN AN BÌNH", 616, 87);
        const r = P.rng(7); for (let k = 0; k < 22; k++) { const x = 30 + r() * 820, y = 270 + r() * 160, s = 14 + r() * 16; shadow(c, x + s * 1.1, y + s * 0.7, s * 1.1, s * 0.3); const g = c.createRadialGradient(x - s * 0.3, y - s * 0.3, 2, x, y, s); g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#b9c4cc"); c.fillStyle = g; c.beginPath(); c.arc(x, y, s, 0, 7); c.fill(); }
      },
      shadows: [], clues: [],
      src: "Tài khoản đăng ảnh <b>mới lập hôm qua</b>. Không có ảnh gốc, không có ảnh nào khác của sự kiện. <b>Không báo chí hay cơ quan khí tượng nào đưa tin.</b> Cùng ảnh này xuất hiện ở nơi khác với tên thị trấn khác: ảnh do AI tạo." }
  ];
  const fx = (v) => v.toFixed(1).replace(".", ",");
  const LABEL = { real: "Ảnh thật", edit: "Bị ghép, sửa", ai: "Do AI tạo" };

  // ---------- ảnh đã tạo + nén ----------
  function render(i, q) {
    const key = i + ":" + q; if (ST.cache[key]) return ST.cache[key];
    let cv;
    if (q === 1) {
      cv = document.createElement("canvas"); cv.width = W; cv.height = H; const c = cv.getContext("2d", { willReadFrequently: true }), S = SCENES[i];
      S.draw(c); addNoise(c, S.sigma, 100 + i); if (S.paste) S.paste(c);
      if (S.copy) { const [x, y, w, h, x2, y2] = S.copy; c.putImageData(c.getImageData(x, y, w, h), x2, y2); }
    } else {
      const src = render(i, 1), f = [1, 0.5, 0.34, 0.25][q - 1], sm = document.createElement("canvas"); sm.width = Math.round(W * f); sm.height = Math.round(H * f);
      sm.getContext("2d").drawImage(src, 0, 0, sm.width, sm.height); cv = document.createElement("canvas"); cv.width = W; cv.height = H; const c = cv.getContext("2d", { willReadFrequently: true }); c.imageSmoothingEnabled = true; c.drawImage(sm, 0, 0, W, H);
    }
    return (ST.cache[key] = cv);
  }
  function noiseStats(cv) {
    const d = cv.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, W, H).data, L = new Float32Array(W * H);
    for (let i = 0, j = 0; i < d.length; i += 4, j++) L[j] = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
    const cells = [];
    for (let cy = 0; cy < NY; cy++) for (let cx = 0; cx < NX; cx++) {
      const hist = new Uint32Array(64); let n = 0;
      for (let y = cy * CH + 1; y < (cy + 1) * CH - 1; y += 2) for (let x = cx * CW + 1; x < (cx + 1) * CW - 1; x += 2) { const k = y * W + x, r = Math.abs(L[k] - (L[k - 1] + L[k + 1] + L[k - W] + L[k + W]) / 4); hist[Math.min(63, Math.round(r * 2))]++; n++; }
      let acc = 0, med = 0; for (let b = 0; b < 64; b++) { acc += hist[b]; if (acc >= n / 2) { med = b / 2; break; } } cells.push(med);
    }
    const sorted = cells.slice().sort((a, b) => a - b), med = sorted[Math.floor(sorted.length / 2)];
    const low = cells.map((v, i) => (med > 2 && v < med * 0.45 ? i : -1)).filter((i) => i >= 0);
    let verdict, score;
    if (med < 2) { verdict = "ai"; score = 0.85; } else if (low.length >= 3) { verdict = "edit"; score = 0.8; } else { verdict = "real"; score = 0.15; }
    return { cells, med, low, verdict, score };
  }

  // ---------- vẽ sân khấu ----------
  const cv = $("stage"), ctx = cv.getContext("2d");
  function draw() {
    const S = SCENES[ST.img], img = render(ST.img, ST.q); ctx.imageSmoothingEnabled = true; ctx.drawImage(img, 0, 0);
    const st = ST.stats;
    if (ST.noise && st) st.cells.forEach((v, i) => { const x = (i % NX) * CW, y = Math.floor(i / NX) * CH, rel = st.med ? v / st.med : 0; ctx.fillStyle = v < 2 ? "rgba(70,120,255,.42)" : rel < 0.45 ? "rgba(70,120,255,.5)" : rel > 1.8 ? "rgba(255,90,60,.35)" : "rgba(63,224,197,.16)"; ctx.fillRect(x, y, CW, CH); ctx.strokeStyle = "rgba(255,255,255,.25)"; ctx.strokeRect(x + 0.5, y + 0.5, CW - 1, CH - 1); ctx.fillStyle = "#fff"; ctx.font = "700 11px JetBrains Mono, monospace"; ctx.fillText(fx(v), x + 6, y + 16); });
    if (ST.shadow) S.shadows.forEach(([x0, y0, x1, y1]) => { D.arrow(ctx, { x: x0, y: y0 }, { x: x1, y: y1 }, "#ffe14d", 4); ctx.fillStyle = "#ffe14d"; ctx.beginPath(); ctx.arc(x0, y0, 5, 0, 7); ctx.fill(); });
    if (ST.shadow && !S.shadows.length) D.pill(ctx, "Ảnh này không có bóng đổ rõ để so", W / 2, 30, "rgba(18,22,51,.85)", 12);
    (ST.found[ST.img] || []).forEach((k) => { const c = S.clues[k]; ctx.strokeStyle = "#ff5a3c"; ctx.lineWidth = 3; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.arc(c.x, c.y, c.r * 0.8, 0, 7); ctx.stroke(); ctx.setLineDash([]); D.pill(ctx, "dấu vết " + (k + 1), c.x, c.y - c.r * 0.8 - 4, "#e2366e", 11); });
    if (ST.lens && ST.ptr) { const { x, y } = ST.ptr, r = 78, z = ST.zoom; ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.clip(); ctx.imageSmoothingEnabled = false; ctx.drawImage(img, x - r / z, y - r / z, (2 * r) / z, (2 * r) / z, x - r, y - r, 2 * r, 2 * r); ctx.restore(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.stroke(); ctx.strokeStyle = "#5443ff"; ctx.lineWidth = 2; ctx.stroke(); D.pill(ctx, "×" + z, x + r - 10, y + r - 6, "#5443ff", 11); }
    if (ST.q > 1) D.pill(ctx, `Ảnh đã bị nén ${ST.q - 1} lần`, 110, H - 20, "rgba(226,54,110,.9)", 12);
  }
  function pos(e) { const r = cv.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; }
  cv.addEventListener("pointermove", (e) => { ST.ptr = pos(e); });
  cv.addEventListener("pointerleave", () => { if (!ST.lens) ST.ptr = null; });
  cv.addEventListener("pointerdown", (e) => {
    const p = pos(e); ST.ptr = p; const S = SCENES[ST.img], f = (ST.found[ST.img] = ST.found[ST.img] || []);
    const k = S.clues.findIndex((c) => Math.hypot(c.x - p.x, c.y - p.y) < c.r);
    if (k >= 0) { if (!f.includes(k)) f.push(k); const tot = Object.values(ST.found).reduce((s, a) => s + a.length, 0); if (tot >= 3) prog.done("clue"); guide("Tìm thấy dấu vết! " + S.clues[k].t); }
    else if (!ST.lens) guide(S.clues.length ? "Chỗ này chưa thấy gì lạ. Thử bật <b>kính lúp</b>, <b>bản đồ nhiễu</b> hoặc <b>kẻ hướng bóng</b> để tìm dấu vết." : "Chỗ này không có gì bất thường.");
    panel();
  });

  // ---------- bảng ----------
  const guide = (h) => ($("guideText").innerHTML = h), say = (h) => ($("askText").innerHTML = h);
  function refresh() { ST.stats = noiseStats(render(ST.img, ST.q)); panel(); }
  function panel() {
    const S = SCENES[ST.img], st = ST.stats;
    $("imgTag").textContent = S.special ? "ẢNH ĐẶC BIỆT" : `ẢNH ${ST.img + 1}/6`;
    $("bDet").textContent = `${LABEL[st.verdict]} (${Math.round(st.score * 100)}% bị chỉnh sửa)`; $("bDet").style.color = st.verdict === "real" ? "#5ef2d6" : "#ffc34d";
    const ok = [0, 1, 2, 3, 4, 5].filter((i) => ST.ans[i] === SCENES[i].truth).length; $("bAcc").textContent = `${ok}/6`; if (ok >= 5) prog.done("verdict");
    const f = ST.found[ST.img] || []; $("bClues").innerHTML = S.clues.length ? (f.length ? f.map((k) => `• ${S.clues[k].t}`).join("<br>") : "Chưa tìm thấy dấu vết nào.") + `<br><span style="color:#8f96d4">Đã tìm ${f.length} trên ${S.clues.length} dấu vết có thể thấy trên ảnh.</span>` : "Không có dấu vết nhìn thấy được trên ảnh này.";
    $("bSrc").innerHTML = ST.src[ST.img] ? ST.src[ST.img] : "Chưa kiểm tra. Bấm <b>Kiểm tra nguồn</b>.";
    document.querySelectorAll("#gallery button").forEach((b, i) => { b.classList.toggle("ghost", i !== ST.img); b.setAttribute("aria-pressed", i === ST.img); });
    document.querySelectorAll("#verdicts [data-v]").forEach((b) => b.classList.toggle("ghost", ST.ans[ST.img] !== b.dataset.v));
    const a = ST.ans[ST.img];
    say(`<b>${S.n}</b>: máy dò nói <b>${LABEL[st.verdict]}</b>` + (a ? ` · em kết luận <b>${LABEL[a]}</b> ` + (a === S.truth ? '<span style="color:var(--mint)">(đúng)</span>' : '<span style="color:var(--coral)">(chưa đúng, tìm thêm bằng chứng)</span>') : " · em chưa kết luận."));
    renderChart();
  }
  function renderChart() {
    const c = $("chart"), x = c.getContext("2d"), cw = c.width, chh = c.height, TH = P.TH, L = 44, B = 30, T = 14, st = ST.stats; x.clearRect(0, 0, cw, chh); if (!st) return;
    const mx = Math.max(10, ...st.cells), Y = (v) => T + (1 - v / mx) * (chh - T - B), bw = (cw - L - 10) / st.cells.length;
    x.font = "11px JetBrains Mono, monospace"; for (let v = 0; v <= mx; v += 2) { x.strokeStyle = TH.grid; x.beginPath(); x.moveTo(L, Y(v)); x.lineTo(cw - 10, Y(v)); x.stroke(); x.fillStyle = TH.text; x.fillText(v, 14, Y(v) + 4); }
    st.cells.forEach((v, i) => { const rel = st.med ? v / st.med : 0; x.fillStyle = v < 2 || rel < 0.45 ? TH.violet : rel > 1.8 ? TH.coral : TH.mint; D.rr(x, L + i * bw + 1, Y(v), bw - 2, Math.max(2, chh - B - Y(v)), 3); x.fill(); });
    x.setLineDash([6, 4]); x.strokeStyle = TH.amber; x.lineWidth = 2; x.beginPath(); x.moveTo(L, Y(st.med)); x.lineTo(cw - 10, Y(st.med)); x.stroke(); x.setLineDash([]); x.fillStyle = TH.amber; x.fillText(`trung vị ${fx(st.med)}`, cw - 120, Y(st.med) - 6);
    x.fillStyle = TH.text; x.fillText("vùng 1 (góc trên trái) … vùng 55 (góc dưới phải)", L, chh - 8);
  }

  // ---------- SOI ----------
  const SOI = [
    { t: "Ảnh là bảng số", e: "image", d: "Ảnh số gồm rất nhiều <b>điểm ảnh</b>, mỗi điểm là ba số R, G, B. Mọi cách chỉnh sửa đều là thay đổi những con số này." },
    { t: "Hạt nhiễu", e: "scan", d: "Cảm biến máy ảnh tạo ra <b>hạt nhiễu</b>: các điểm cạnh nhau lệch nhau một chút, khá đều trên cả ảnh. Đo bằng cách so mỗi điểm với trung bình 4 điểm xung quanh." },
    { t: "Dấu vết ghép", e: "layers", d: "Vùng dán từ ảnh khác thường có <b>mức nhiễu khác</b>, <b>bóng đổ lệch hướng</b>, viền quá sắc. Vùng sao chép trong cùng ảnh thì <b>giống hệt</b> một vùng khác." },
    { t: "Ảnh do AI tạo", e: "sparkle", d: "Nhiều công cụ AI tạo ảnh bắt đầu từ <b>nhiễu ngẫu nhiên</b> rồi <b>khử nhiễu dần</b> theo câu lệnh. Ảnh thường <b>mịn bất thường</b>, chữ méo, chi tiết vô lí." },
    { t: "Kiểm tra nguồn", e: "globe", d: "Ai đăng đầu tiên? Khi nào? Có ảnh gốc không? Báo chí, cơ quan chính thống có đưa tin không? <b>Tìm ảnh ngược</b> để thấy ảnh từng xuất hiện ở đâu." },
    { t: "Kết luận có trách nhiệm", e: "shield", d: "Gộp mọi bằng chứng, không tin một công cụ duy nhất. Chưa chắc chắn thì <b>không chia sẻ</b>, và nói rõ là chưa kiểm chứng được." }
  ];
  let soiVisible = false, soiStep = 0; const soi = $("soiCanvas"), sx = soi.getContext("2d");
  const noiseCv = document.createElement("canvas"); noiseCv.width = 600; noiseCv.height = 300; (() => { const c = noiseCv.getContext("2d"), id = c.createImageData(600, 300), r = P.rng(5); for (let i = 0; i < id.data.length; i += 4) { const v = r() * 255; id.data[i] = r() * 255; id.data[i + 1] = v; id.data[i + 2] = r() * 255; id.data[i + 3] = 255; } c.putImageData(id, 0, 0); })();
  P.pipeline(SOI, (i) => { soiStep = i; if (i >= 3) prog.done("soi"); }); P.visible($("soi"), (v) => (soiVisible = v));
  const lb = (t, x, y, c, f) => { sx.fillStyle = c || "#c3c7f0"; sx.font = f || "700 12px Be Vietnam Pro, sans-serif"; sx.fillText(t, x, y); };
  function patch(img, px, py, n, x0, y0, sz) { const d = img.getContext("2d", { willReadFrequently: true }).getImageData(px, py, n, n).data; for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const k = (j * n + i) * 4; sx.fillStyle = `rgb(${d[k]},${d[k + 1]},${d[k + 2]})`; sx.fillRect(x0 + i * sz, y0 + j * sz, sz - 1, sz - 1); } return d; }
  function renderSoi() {
    const s = soiStep, img = render(ST.img, ST.q), st = ST.stats, S = SCENES[ST.img]; D.labBg(sx);
    if (s === 0) { lb("Phóng to 8 × 8 điểm ảnh ở giữa ảnh", 24, 34, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif"); const d = patch(img, 436, 216, 8, 24, 50, 48); for (let j = 0; j < 3; j++) { const k = j * 4 * 8 + 0; lb(`(${d[k]}, ${d[k + 1]}, ${d[k + 2]})`, 420, 80 + j * 48, "#fff", "700 13px JetBrains Mono, monospace"); } lb("← ba số của vài điểm", 420, 230, "#8f96d4"); return; }
    if (s === 1) { lb("Hai mảnh 12 × 12 điểm của ảnh đang xem", 24, 34, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif"); patch(img, 40, 40, 12, 24, 60, 22); patch(img, 600, 380, 12, 330, 60, 22); lb(`Mức nhiễu trung vị cả ảnh: ${fx(st.med)}`, 24, 360, "#fff", "800 15px Be Vietnam Pro, sans-serif"); lb(st.med < 2 ? "Rất thấp: ảnh mịn bất thường (AI tạo, hoặc ảnh bị nén nhiều)" : "Bình thường với ảnh chụp bằng máy ảnh", 24, 388, st.med < 2 ? "#ff8f6b" : "#5ef2d6"); return; }
    if (s === 2) { sx.drawImage(img, 20, 40, 600, 300); st.cells.forEach((v, i) => { const x = 20 + (i % NX) * (600 / NX), y = 40 + Math.floor(i / NX) * 60, rel = st.med ? v / st.med : 0; sx.fillStyle = v < 2 || rel < 0.45 ? "rgba(70,120,255,.5)" : "rgba(63,224,197,.15)"; sx.fillRect(x, y, 600 / NX, 60); }); S.shadows.forEach(([a, b, c2, d2]) => D.arrow(sx, { x: 20 + a * 600 / W, y: 40 + b * 300 / H }, { x: 20 + c2 * 600 / W, y: 40 + d2 * 300 / H }, "#ffe14d", 3)); lb(`Vùng nhiễu khác thường (xanh đậm): ${st.low.length} · mũi tên vàng: hướng bóng`, 24, 380, "#ffc34d", "800 13px Be Vietnam Pro, sans-serif"); return; }
    if (s === 3) { const t = (ST.t % 5) / 4, k = Math.min(1, t); sx.drawImage(img, 20, 60, 600, 300); sx.globalAlpha = 1 - k; sx.drawImage(noiseCv, 20, 60); sx.globalAlpha = 1; lb(k < 0.15 ? "Bước đầu: chỉ có nhiễu ngẫu nhiên" : k < 0.95 ? `Khử nhiễu dần theo câu lệnh… ${Math.round(k * 100)}%` : "Ảnh hoàn chỉnh: mịn, nhưng có thể sai chi tiết", 24, 44, "#ffc34d", "800 14px Be Vietnam Pro, sans-serif"); lb("(minh họa đơn giản cách một số công cụ AI tạo ảnh)", 24, 392, "#8f96d4"); return; }
    if (s === 4) { const qs = ["Ai đăng ảnh này đầu tiên?", "Đăng khi nào, ở đâu?", "Có ảnh gốc, ảnh khác của sự kiện không?", "Báo chí, cơ quan chính thống có đưa tin?", "Nội dung có vô lí không?"]; qs.forEach((q, i) => { sx.fillStyle = "#1d2152"; D.rr(sx, 24, 40 + i * 64, 592, 50, 12); sx.fill(); lb(`${i + 1}. ${q}`, 44, 71 + i * 64, "#fff", "700 15px Be Vietnam Pro, sans-serif"); }); lb(ST.src[ST.img] ? "Em đã kiểm tra nguồn của ảnh này." : "Em chưa kiểm tra nguồn của ảnh này.", 24, 380, ST.src[ST.img] ? "#5ef2d6" : "#ff8f6b", "800 14px Be Vietnam Pro, sans-serif"); return; }
    const rows = [["Máy dò tự động", LABEL[st.verdict]], ["Bản đồ nhiễu", st.med < 2 ? "mịn bất thường" : st.low.length >= 3 ? `${st.low.length} vùng lạ` : "đều"], ["Dấu vết trên ảnh", `${(ST.found[ST.img] || []).length}/${S.clues.length}`], ["Nguồn", ST.src[ST.img] ? "đã kiểm tra" : "chưa kiểm tra"], ["Kết luận của em", ST.ans[ST.img] ? LABEL[ST.ans[ST.img]] : "chưa có"]];
    rows.forEach(([a, b], i) => { lb(a, 40, 80 + i * 50, "#c3c7f0", "700 15px Be Vietnam Pro, sans-serif"); lb(b, 300, 80 + i * 50, "#fff", "800 15px Be Vietnam Pro, sans-serif"); }); lb("Chưa chắc chắn thì không chia sẻ.", 40, 380, "#ffc34d", "800 16px Be Vietnam Pro, sans-serif");
  }
  function soiLive() { $("soiLive").innerHTML = `Máy dò: <span class="hl">${ST.stats ? LABEL[ST.stats.verdict] : ""}</span>`; }

  // ---------- điều khiển ----------
  function show(i) { ST.img = i; ST.q = 1; $("qual").value = 1; $("qualV").textContent = qf(1); refresh(); }
  const qf = (v) => (v === 1 ? "gốc" : `nén ${v - 1} lần`);
  function bind() {
    $("gallery").innerHTML = SCENES.filter((s) => !s.special).map((s, i) => `<button class="btn small${i ? " ghost" : ""}" type="button" aria-pressed="${!i}">${HKA.icon("image")}${i + 1}. ${s.n}</button>`).join("");
    document.querySelectorAll("#gallery button").forEach((b, i) => (b.onclick = () => { show(i); guide(`Ảnh ${i + 1}: <b>${SCENES[i].n}</b>. Dùng đồ nghề thám tử, bấm vào chỗ nghi ngờ, kiểm tra nguồn rồi kết luận.`); }));
    document.querySelectorAll("#verdicts [data-v]").forEach((b) => (b.onclick = () => { const S = SCENES[ST.img], v = b.dataset.v; ST.ans[ST.img] = v; guide(v === S.truth ? `Đúng: ảnh này <b>${LABEL[S.truth].toLowerCase()}</b>. ${S.special ? "Chỉ kiểm tra nguồn mới phát hiện được." : ""}` : `Chưa đúng. Hãy tìm thêm bằng chứng: bản đồ nhiễu, hướng bóng, kính lúp, và đặc biệt là <b>kiểm tra nguồn</b>.`); panel(); }));
    $("btnSource").onclick = () => { ST.src[ST.img] = SCENES[ST.img].src; if (ST.img === 0 && ST.q > 1) { ST.src[0] = "Bản em đang xem đã bị nén nhiều lần. Tìm ảnh ngược thấy <b>bản gốc chất lượng cao</b> trên trang của lớp 9A, kèm thông tin máy ảnh và ngày chụp: <b>ảnh thật</b>. Đã chuyển sang bản gốc."; ST.q = 1; $("qual").value = 1; $("qualV").textContent = qf(1); ST.stats = noiseStats(render(0, 1)); } guide("Kết quả kiểm tra nguồn ở bảng bên phải. Nguồn thường là bằng chứng mạnh nhất."); panel(); };
    P.range("zoom", () => ST.zoom, (v) => (ST.zoom = v), (v) => "×" + v);
    P.range("qual", () => ST.q, (v) => (ST.q = v), qf, refresh);
    $("optLens").onchange = (e) => { ST.lens = e.target.checked; if (ST.lens && !ST.ptr) ST.ptr = { x: W / 2, y: H / 2 }; };
    $("optNoise").onchange = (e) => { ST.noise = e.target.checked; if (ST.noise) prog.done("tool"); };
    $("optShadow").onchange = (e) => { ST.shadow = e.target.checked; if (ST.shadow) prog.done("tool"); };
    const clear = () => { ["optLens", "optNoise", "optShadow"].forEach((id) => ($(id).checked = false)); Object.assign(ST, { lens: false, noise: false, shadow: false }); document.querySelectorAll(".break").forEach((c) => c.classList.remove("on")); };
    document.querySelectorAll("[data-break]").forEach((b) => b.addEventListener("click", () => {
      const k = b.dataset.break; clear(); b.closest(".break").classList.add("on"); prog.done("broke");
      if (k === "repost") { show(0); delete ST.src[0]; ST.q = 4; $("qual").value = 4; $("qualV").textContent = qf(4); ST.noise = true; $("optNoise").checked = true; refresh(); guide(`Ảnh thật bị nén nhiều lần: máy dò nói <b>${LABEL[ST.stats.verdict]}</b>. Bản đồ nhiễu xanh đậm khắp nơi vì hạt nhiễu đã mất. Bấm <b>Kiểm tra nguồn</b>.`); }
      if (k === "copy") { show(3); ST.noise = true; $("optNoise").checked = true; guide(`Máy dò nói <b>${LABEL[ST.stats.verdict]}</b> vì vùng sao chép mang theo hạt nhiễu thật. Bật <b>kính lúp</b>, so hai đám mây rồi bấm vào đám mây bên phải.`); }
      if (k === "perfect") { show(6); ST.noise = true; ST.shadow = true; $("optNoise").checked = true; $("optShadow").checked = true; delete ST.src[6]; guide(`Mọi công cụ kĩ thuật đều không thấy gì lạ, máy dò nói <b>${LABEL[ST.stats.verdict]}</b>. Bấm <b>Kiểm tra nguồn</b>.`); }
      panel(); $("choi").scrollIntoView({ behavior: "smooth" });
    }));
    $("btnFixAll").onclick = () => { clear(); show(0); guide("Mọi sự cố đã tắt. Quay lại ảnh 1, chất lượng gốc."); };
  }

  const QUIZ = [
    { q: "Vì sao vùng bị dán từ ảnh khác thường lộ ra trên bản đồ nhiễu?", o: ["Vì vùng đó luôn màu đỏ", "Vì mức hạt nhiễu của vùng đó khác phần còn lại của ảnh", "Vì máy tính nhớ ai đã sửa ảnh", "Vì vùng đó to hơn"], a: 1, e: "Mỗi ảnh gốc có mức nhiễu riêng; vùng dán mang mức nhiễu khác." },
    { q: "Trong một ảnh ngoài trời, bóng cây đổ sang phải nhưng bóng một con vật đổ sang trái. Điều đó gợi ý gì?", o: ["Trời có hai Mặt Trời", "Con vật có thể đã được ghép vào ảnh", "Ảnh chụp ban đêm", "Không có gì lạ"], a: 1, e: "Một nguồn sáng thì mọi bóng đổ cùng hướng." },
    { q: "Máy dò nói một ảnh là \"thật\". Em nên làm gì trước khi chia sẻ?", o: ["Chia sẻ ngay", "Kiểm tra thêm nguồn: ai đăng, khi nào, có ảnh gốc, báo chính thống có đưa tin không", "Hỏi máy dò lần nữa", "Xóa ảnh"], a: 1, e: "Máy dò có thể sai (ảnh giả rất giống thật, vùng sao chép…)." },
    { q: "Một ảnh thật bị nén, đăng lại nhiều lần có thể bị máy dò nhận nhầm là ảnh AI tạo vì sao?", o: ["Vì ảnh bị đổi màu", "Vì nén làm mất hạt nhiễu, ảnh trở nên mịn giống ảnh AI", "Vì ảnh có chữ", "Vì ảnh quá cũ"], a: 1, e: "Đó là lí do không được kết tội ai chỉ dựa vào một máy dò." }
  ];
  P.quiz("quiz", QUIZ, () => { $("badge").hidden = false; prog.done("quiz"); });
  if (prog.has("quiz")) $("badge").hidden = false;
  let last = performance.now();
  function tick(now) { const dt = Math.max(0, Math.min(0.1, (now - last) / 1000)); last = now; ST.t += dt; draw(); if (soiVisible) renderSoi(); requestAnimationFrame(tick); }
  setInterval(() => soiVisible && soiLive(), 400);
  P.nav(); bind(); show(0); guide("Chọn một ảnh, dùng đồ nghề thám tử để tìm dấu vết, <b>bấm vào chỗ nghi ngờ</b> trên ảnh, kiểm tra nguồn, rồi đưa ra kết luận.");
  window.addEventListener("hka:theme", () => setTimeout(renderChart, 50));
  window.__hka39 = { ST, SCENES, render, noiseStats, show };
  requestAnimationFrame(tick);
})();
