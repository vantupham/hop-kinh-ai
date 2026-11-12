/* Hộp Kính AI · bộ icon SVG dùng chung + chuyển giao diện sáng/tối
   Dùng trong HTML:  <i data-i="ten-icon"></i>   ·   trong JS:  HKA.icon("ten-icon") */
(function () {
  const P = {
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pause: '<rect x="6" y="4.5" width="4" height="15" rx="1"/><rect x="14" y="4.5" width="4" height="15" rx="1"/>',
    skip: '<path d="M5 4.5v15l10-7.5z"/><path d="M19 5v14"/>',
    reset: '<path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5"/><path d="M3.5 3.5v5h5"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
    scan: '<path d="M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3"/><path d="M3 12h18"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/>',
    cpu: '<rect x="5" y="5" width="14" height="14" rx="2.5"/><rect x="9" y="9" width="6" height="6" rx="1"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.5 2.5-2.4-.6-.6-2.4z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    award: '<circle cx="12" cy="9" r="6"/><path d="M8.6 13.9 7 22l5-3 5 3-1.6-8.1"/>',
    rocket: '<path d="M5 15c-1.5 1.3-2 5-2 5s3.7-.5 5-2c.7-.8.7-2.1-.1-2.9a2.1 2.1 0 0 0-2.9-.1z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.9A12.9 12.9 0 0 1 22 2c0 2.7-.8 7.5-6 11a22 22 0 0 1-4 2z"/><path d="M9 12H4s.6-3 2-4c1.6-1.1 5 0 5 0M12 15v5s3-.6 4-2c1.1-1.6 0-5 0-5"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3.5"/>',
    film: '<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 3v18M17 3v18M3 8h4M3 16h4M17 8h4M17 16h4M3 12h18"/>',
    figure: '<circle cx="12" cy="4.5" r="2.2"/><path d="M12 7.5v6.5M7.5 10.5h9M12 14l-3.5 7M12 14l3.5 7"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M20.5 13.2A8.5 8.5 0 1 1 10.8 3.5a6.6 6.6 0 0 0 9.7 9.7z"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    star: '<path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-5-5L5 21"/>',
    robot: '<rect x="4" y="8" width="16" height="12" rx="3"/><path d="M12 4v4M9 13v1M15 13v1M9 17h6"/><circle cx="12" cy="3" r="1"/>',
    crosshair: '<circle cx="12" cy="12" r="8"/><path d="M22 12h-5M7 12H2M12 7V2M12 22v-5"/>',
    angle: '<path d="M3 20h18M3 20 15 5"/><path d="M9.5 20a6.5 6.5 0 0 0-2.2-4.9"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
    dumbbell: '<path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/>',
    pulse: '<path d="M3 12h4l2-6 4 12 2-6h6"/>',
    trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
    help: '<circle cx="12" cy="12" r="9"/><path d="M9.2 9a3 3 0 0 1 5.8 1c0 2-3 2.8-3 2.8M12 17h.01"/>',
    bulb: '<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V16h8v-1.3A7 7 0 0 0 12 2z"/>',
    map: '<path d="M1.5 6 8 3l8 3 6.5-3v15L16 21l-8-3-6.5 3z"/><path d="M8 3v15M16 6v15"/>',
    flask: '<path d="M9 3h6M10 3v6L4.3 19a2 2 0 0 0 1.7 3h12a2 2 0 0 0 1.7-3L14 9V3"/><path d="M7 15h10"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6"/>',
    blocks: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><path d="M17 13v8M13 17h8"/>',
    chart: '<path d="M3 3v18h18"/><path d="m7 15 4-5 4 3 5-7"/>',
    arrowR: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    lock: '<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    loader: '<path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.2 16.2l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.2 7.8l2.8-2.8"/>',
    gamepad: '<rect x="2" y="7" width="20" height="11" rx="5.5"/><path d="M7 10.5v4M5 12.5h4M15.5 11.5h.01M18 14h.01"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5M2 17l10 5 10-5"/>',
    sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21.2l8.8-8.8a5.5 5.5 0 0 0 0-7.8z"/>',
    activity: '<circle cx="12" cy="12" r="9"/><path d="M8 14l2.5-4 3 3L16 9"/>',
    msg: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>'
  };
  function icon(name, cls) {
    const body = P[name] || P.sparkle;
    return `<svg class="ic${cls ? " " + cls : ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  }
  function stars(n, of) { let s = ""; for (let i = 0; i < (of || 3); i++) s += icon("star", i < n ? "star on" : "star"); return `<span class="stars" role="img" aria-label="${n} sao">${s}</span>`; }
  function hydrate(root) {
    (root || document).querySelectorAll("i[data-i]").forEach((el) => {
      const t = document.createElement("span"); t.innerHTML = icon(el.dataset.i, el.className);
      el.replaceWith(t.firstChild);
    });
  }

  // ---- giao diện sáng/tối ----
  function theme() { return document.documentElement.dataset.theme || "light"; }
  function setTheme(t) {
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem("hka-theme", t); } catch (e) {}
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.setAttribute("aria-label", t === "dark" ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"));
    window.dispatchEvent(new CustomEvent("hka:theme", { detail: t }));
  }
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  window.HKA = { icon, stars, hydrate, theme, setTheme, css };
  hydrate();
  document.querySelectorAll("[data-theme-toggle]").forEach((b) => {
    b.innerHTML = icon("sun", "i-sun") + icon("moon", "i-moon"); b.setAttribute("aria-label", "Đổi giao diện sáng / tối"); b.title = "Đổi giao diện sáng / tối";
    b.addEventListener("click", () => setTheme(theme() === "dark" ? "light" : "dark"));
  });
  setTheme(theme());
})();
