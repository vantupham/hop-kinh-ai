/* Hộp Kính AI · Dự án 21 · Dữ liệu con vật: hình vẽ (SVG tự vẽ) và bảng đặc điểm
   Đặc điểm được chọn để học sinh lớp 6 trả lời chắc chắn được Có/Không, theo kiến thức KHTN 6. */
(function () {
  "use strict";
  const S = (inner) => `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
  const ICON = {
    meo: S('<path d="M16 22 20 8l10 10M48 22 44 8 34 18" fill="#f2a24a"/><circle cx="32" cy="34" r="19" fill="#f2a24a"/><path d="M19 9l3 9M45 9l-3 9" stroke="#d9822b" stroke-width="2"/><circle cx="25" cy="31" r="3" fill="#2a1e1a"/><circle cx="39" cy="31" r="3" fill="#2a1e1a"/><path d="M30 38h4l-2 3z" fill="#e05a6a"/><path d="M14 38h10M14 43l10-2M50 38H40M50 43l-10-2" stroke="#7a4a1e" stroke-width="1.5" stroke-linecap="round"/><path d="M28 44q4 3 8 0" stroke="#7a4a1e" stroke-width="1.8" fill="none" stroke-linecap="round"/>'),
    doi: S('<path d="M32 26C24 14 10 16 4 22c5 2 6 7 4 12 5-3 10-1 12 3 2-5 7-6 12-4" fill="#5b4a8a"/><path d="M32 26c8-12 22-10 28-4-5 2-6 7-4 12-5-3-10-1-12 3-2-5-7-6-12-4" fill="#5b4a8a"/><ellipse cx="32" cy="34" rx="8" ry="12" fill="#3f3263"/><path d="M26 24l2-8 4 6 4-6 2 8" fill="#3f3263"/><circle cx="29" cy="28" r="1.8" fill="#ffd84d"/><circle cx="35" cy="28" r="1.8" fill="#ffd84d"/>'),
    cheo: S('<path d="M6 40c6-16 26-22 44-14 4 2 8 1 10-2-1 6-4 9-8 10 2 8-6 14-18 14-14 0-24-2-28-8z" fill="#4a90d9"/><path d="M26 26l6-10 6 12z" fill="#3a76b8"/><path d="M8 44c10 4 26 5 40 1-8 6-26 8-40-1z" fill="#cfe6fb"/><circle cx="46" cy="34" r="2.2" fill="#14213d"/><path d="M4 40 0 32l8 4z" fill="#3a76b8"/>'),
    chimse: S('<ellipse cx="30" cy="38" rx="17" ry="13" fill="#a8743f"/><circle cx="42" cy="24" r="10" fill="#8b5a2b"/><path d="M51 24l9 3-9 3z" fill="#f2b632"/><circle cx="44" cy="22" r="2" fill="#1b1b1b"/><path d="M18 34c6-6 18-6 22 2-8 4-16 4-22-2z" fill="#6f4520"/><path d="M14 40 4 36l4 8z" fill="#6f4520"/><path d="M28 50v8M34 50v8" stroke="#f2b632" stroke-width="2.5" stroke-linecap="round"/>'),
    ga: S('<ellipse cx="30" cy="38" rx="18" ry="15" fill="#f6f1e7" stroke="#d9cfbd" stroke-width="1.5"/><circle cx="42" cy="22" r="10" fill="#f6f1e7" stroke="#d9cfbd" stroke-width="1.5"/><path d="M36 13c1-5 4-6 5-2 1-4 5-4 5 0 2-3 5-1 3 3z" fill="#e0322f"/><path d="M51 22l7 3-7 3z" fill="#f2b632"/><path d="M48 28c2 4 1 7-2 7-1-3 0-5 2-7z" fill="#e0322f"/><circle cx="44" cy="20" r="1.9" fill="#1b1b1b"/><path d="M26 52v8M34 52v8" stroke="#f2b632" stroke-width="3" stroke-linecap="round"/><path d="M12 32c-6-2-8 4-4 8" stroke="#d9cfbd" stroke-width="3" fill="none"/>'),
    thanlan: S('<path d="M8 50c8 4 14-2 20-6s12-4 18-2" stroke="#5aa95a" stroke-width="6" fill="none" stroke-linecap="round"/><ellipse cx="44" cy="40" rx="12" ry="6" fill="#5aa95a"/><ellipse cx="56" cy="38" rx="6" ry="4.5" fill="#4b9a4b"/><circle cx="58" cy="36.5" r="1.4" fill="#1b1b1b"/><path d="M38 44l-4 8M48 44l3 8M40 36l-5-7M50 36l4-7" stroke="#4b9a4b" stroke-width="3" stroke-linecap="round"/><circle cx="42" cy="40" r="1.2" fill="#8fd18f"/><circle cx="47" cy="41" r="1.2" fill="#8fd18f"/>'),
    cachep: S('<ellipse cx="30" cy="32" rx="20" ry="12" fill="#f28c38"/><path d="M48 32l12-10v20z" fill="#e0702a"/><path d="M22 22l8-6 6 7z" fill="#e0702a"/><circle cx="16" cy="30" r="2.4" fill="#1b1b1b"/><g fill="none" stroke="#fbc086" stroke-width="1.6"><path d="M24 26a4 4 0 0 1 0 8M30 24a4 4 0 0 1 0 8M36 26a4 4 0 0 1 0 8M30 32a4 4 0 0 1 0 8"/></g><path d="M10 34q2 2 4 1" stroke="#7a3410" stroke-width="1.5" fill="none"/>'),
    ran: S('<path d="M10 52c10 0 10-12 20-12s10 12 20 12M30 40c-10 0-10-12 0-14s16 0 20-6" stroke="#3f9a5a" stroke-width="7" fill="none" stroke-linecap="round"/><ellipse cx="51" cy="18" rx="7" ry="5" fill="#3f9a5a"/><circle cx="53" cy="16.5" r="1.4" fill="#1b1b1b"/><path d="M57 19l5 1-3 2" stroke="#e0322f" stroke-width="1.5" fill="none"/><g fill="#8fd18f"><circle cx="20" cy="45" r="1.3"/><circle cx="40" cy="46" r="1.3"/><circle cx="34" cy="28" r="1.3"/></g>'),
    buom: S('<ellipse cx="20" cy="22" rx="13" ry="11" fill="#8a4fd8"/><ellipse cx="44" cy="22" rx="13" ry="11" fill="#8a4fd8"/><ellipse cx="22" cy="42" rx="10" ry="9" fill="#ff8fd0"/><ellipse cx="42" cy="42" rx="10" ry="9" fill="#ff8fd0"/><circle cx="18" cy="21" r="4" fill="#ffd84d"/><circle cx="46" cy="21" r="4" fill="#ffd84d"/><rect x="30" y="14" width="4" height="38" rx="2" fill="#2a1e1a"/><path d="M31 15 26 6M33 15l5-9" stroke="#2a1e1a" stroke-width="1.6" fill="none" stroke-linecap="round"/>'),
    ong: S('<ellipse cx="22" cy="20" rx="10" ry="7" fill="#cfe9ff" opacity=".9"/><ellipse cx="38" cy="18" rx="10" ry="7" fill="#cfe9ff" opacity=".9"/><ellipse cx="32" cy="36" rx="18" ry="12" fill="#f5c518"/><path d="M24 25v22M32 24v24M40 25v22" stroke="#2a1e1a" stroke-width="4"/><circle cx="14" cy="34" r="7" fill="#2a1e1a"/><circle cx="12" cy="32" r="1.6" fill="#fff"/><path d="M50 36l8 0-8 3z" fill="#2a1e1a"/>'),
    nhen: S('<g stroke="#2a1e1a" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M26 30 12 18 6 24M26 34 8 32 4 38M28 38 14 46 10 54M30 40 22 52 22 60M38 30l14-12 6 6M38 34l18-2 4 6M36 38l14 8 4 8M34 40l8 12v8"/></g><circle cx="32" cy="34" r="9" fill="#2a1e1a"/><circle cx="32" cy="22" r="6" fill="#3a2e2a"/><circle cx="30" cy="21" r="1.3" fill="#e0322f"/><circle cx="34" cy="21" r="1.3" fill="#e0322f"/>'),
    cua: S('<g stroke="#c0392b" stroke-width="2.6" stroke-linecap="round" fill="none"><path d="M18 40 8 46M18 44l-8 8M46 40l10 6M46 44l8 8M22 46l-6 10M42 46l6 10"/><path d="M20 30 12 20M44 30l8-10"/></g><ellipse cx="32" cy="38" rx="16" ry="11" fill="#e0503a"/><path d="M6 16c2-6 10-6 10 0l-4 2 4 2c0 6-8 6-10 0z" fill="#e0503a"/><path d="M58 16c-2-6-10-6-10 0l4 2-4 2c0 6 8 6 10 0z" fill="#e0503a"/><circle cx="27" cy="27" r="2.2" fill="#1b1b1b"/><circle cx="37" cy="27" r="2.2" fill="#1b1b1b"/>'),
    giun: S('<path d="M6 44c6-10 12-10 16 0s10 10 16 0 12-10 18 0" stroke="#e08a9a" stroke-width="9" fill="none" stroke-linecap="round"/><g stroke="#c96a7c" stroke-width="1.4"><path d="M12 40v6M20 36v7M28 44v6M36 46v6M44 38v6M52 40v6"/></g><circle cx="57" cy="43" r="1.3" fill="#5a2a33"/>'),
    oc: S('<path d="M6 50c4-4 10-6 20-6h26c4 0 6 3 4 6z" fill="#c9a07a"/><path d="M50 44l4-12M54 44l6-10" stroke="#c9a07a" stroke-width="2.5" stroke-linecap="round"/><circle cx="54" cy="31" r="2" fill="#5a3a20"/><circle cx="60" cy="33" r="2" fill="#5a3a20"/><circle cx="28" cy="32" r="15" fill="#a0612e"/><path d="M28 32m-10 0a10 10 0 1 0 10-10 7 7 0 1 0 6 8 4 4 0 1 0-5 2" stroke="#e0b27a" stroke-width="2.5" fill="none"/>'),
    canhcut: S('<ellipse cx="32" cy="36" rx="16" ry="22" fill="#1f2433"/><ellipse cx="32" cy="40" rx="10" ry="16" fill="#f4f4f4"/><circle cx="27" cy="22" r="2" fill="#fff"/><circle cx="37" cy="22" r="2" fill="#fff"/><circle cx="27" cy="22" r="1" fill="#1b1b1b"/><circle cx="37" cy="22" r="1" fill="#1b1b1b"/><path d="M29 27h6l-3 4z" fill="#f2a01b"/><path d="M16 34l-6 12 8-4zM48 34l6 12-8-4z" fill="#1f2433"/><path d="M24 58h8M34 58h8" stroke="#f2a01b" stroke-width="3" stroke-linecap="round"/>')
  };
  // Câu hỏi: khóa, câu đầy đủ, nhãn ngắn để vẽ trên cây
  const Q = {
    xs: { q: "Có xương sống không?", s: "Xương sống?" },
    sua: { q: "Nuôi con bằng sữa không?", s: "Nuôi con bằng sữa?" },
    longvu: { q: "Có lông vũ không?", s: "Lông vũ?" },
    bay: { q: "Biết bay không?", s: "Biết bay?" },
    nuoc: { q: "Sống chủ yếu dưới nước không?", s: "Sống dưới nước?" },
    vay: { q: "Da có vảy không?", s: "Có vảy?" },
    chan: { q: "Có chân không?", s: "Có chân?" },
    chan6: { q: "Có đúng 6 chân không?", s: "6 chân?" },
    chan8: { q: "Có đúng 8 chân không?", s: "8 chân?" },
    mai: { q: "Có mai hoặc vỏ cứng không?", s: "Mai / vỏ cứng?" },
    ngoi: { q: "Có ngòi đốt không?", s: "Ngòi đốt?" }
  };
  const A = (id, name, t) => ({ id, name, icon: ICON[id], t });
  const T = (s) => { const o = {}; Object.keys(Q).forEach((k) => (o[k] = 0)); s.split(" ").forEach((k) => k && (o[k] = 1)); return o; };
  const ANIMALS = [
    A("meo", "Mèo", T("xs sua chan")), A("doi", "Dơi", T("xs sua bay chan")), A("cheo", "Cá heo", T("xs sua nuoc")),
    A("chimse", "Chim sẻ", T("xs longvu bay chan")), A("ga", "Gà", T("xs longvu chan")), A("thanlan", "Thằn lằn", T("xs vay chan")),
    A("cachep", "Cá chép", T("xs nuoc vay")), A("ran", "Rắn", T("xs vay")), A("buom", "Bướm", T("bay chan chan6")),
    A("ong", "Ong", T("bay chan chan6 ngoi")), A("nhen", "Nhện", T("chan chan8")), A("cua", "Cua", T("nuoc chan mai")),
    A("giun", "Giun đất", T("")), A("oc", "Ốc sên", T("mai"))
  ];
  const STRANGER = A("canhcut", "Chim cánh cụt", T("xs longvu chan nuoc"));
  window.ZOO = { ICON, Q, ANIMALS, STRANGER };
})();
