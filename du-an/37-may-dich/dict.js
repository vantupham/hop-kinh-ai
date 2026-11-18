/* Hộp Kính AI · Dự án 37 · Từ điển và bộ máy dịch Anh – Việt đơn giản (tách từ, chọn nghĩa theo ngữ cảnh, thành ngữ, trật tự từ) */
(function (root) {
  "use strict";
  // mỗi từ: danh sách nghĩa; mỗi nghĩa có từ loại (pos) và từ gợi ý ngữ cảnh (clue)
  const S = (vi, pos, clue) => ({ vi, pos: pos || "x", clue: clue || [] });
  const LEX = {
    i: [S("tôi")], we: [S("chúng tôi")], you: [S("bạn")], he: [S("anh ấy")], she: [S("cô ấy")], it: [S("nó")], they: [S("họ")],
    my: [S("của tôi", "poss")], your: [S("của bạn", "poss")], his: [S("của anh ấy", "poss")], her: [S("của cô ấy", "poss")], our: [S("của chúng tôi", "poss")], this: [S("này", "poss")], that: [S("đó", "poss")],
    the: [S("", "det")], a: [S("một", "det")], an: [S("một", "det")], many: [S("nhiều", "det")],
    is: [S("")], are: [S("")], am: [S("")], was: [S("")],
    sat: [S("ngồi")], sit: [S("ngồi")], watched: [S("xem")], watch: [S("xem")], saw: [S("thấy")], see: [S("thấy")], has: [S("có")], have: [S("có")], hit: [S("đánh")], works: [S("làm việc")], work: [S("làm việc")],
    like: [S("thích")], love: [S("yêu")], go: [S("đi")], read: [S("đọc")], eat: [S("ăn")], drink: [S("uống")], raining: [S("mưa")], break: [S("làm gãy")], open: [S("mở")], swim: [S("bơi")],
    on: [S("trên")], in: [S("trong")], at: [S("ở")], near: [S("gần")], with: [S("bằng")], to: [S("đến")], of: [S("của")], and: [S("và")], but: [S("nhưng")], very: [S("rất")],
    bag: [S("cái túi", "n")], box: [S("cái hộp", "n")], room: [S("phòng", "n")], cave: [S("hang động", "n")], ball: [S("quả bóng", "n")], boats: [S("những chiếc thuyền", "n")], boat: [S("chiếc thuyền", "n")], river: [S("con sông", "n")],
    cat: [S("con mèo", "n")], cats: [S("những con mèo", "n")], dog: [S("con chó", "n")], dogs: [S("những con chó", "n")], sister: [S("chị gái", "n")], brother: [S("anh trai", "n")], mother: [S("mẹ", "n")], father: [S("bố", "n")], friend: [S("người bạn", "n")],
    test: [S("bài kiểm tra", "n")], piece: [S("miếng", "n")], cake: [S("bánh ngọt", "n")], leg: [S("cái chân", "n")], school: [S("trường", "n")], teacher: [S("giáo viên", "n")], book: [S("quyển sách", "n")], money: [S("tiền", "n")], water: [S("nước", "n")], house: [S("ngôi nhà", "n")], team: [S("đội", "n")], football: [S("bóng đá", "n")], tonight: [S("tối nay")], today: [S("hôm nay")], fish: [S("con cá", "n")],
    small: [S("nhỏ", "adj")], big: [S("to", "adj")], black: [S("đen", "adj")], white: [S("trắng", "adj")], red: [S("đỏ", "adj")], new: [S("mới", "adj")], old: [S("cũ", "adj")], hot: [S("nóng", "adj")], bright: [S("sáng", "adj")], broken: [S("bị hỏng", "adj")], heavy: [S("nặng", "adj")], easy: [S("dễ", "adj")], beautiful: [S("đẹp", "adj")],
    // từ nhiều nghĩa: nghĩa đứng đầu là nghĩa "mặc định" khi máy không xét ngữ cảnh
    bank: [S("ngân hàng", "n", ["money", "works", "work", "account", "open"]), S("bờ sông", "n", ["river", "boats", "boat", "fish", "water", "swim"])],
    bat: [S("cây gậy", "n", ["hit", "ball", "player", "baseball"]), S("con dơi", "n", ["cave", "night", "fly", "wings"])],
    light: [S("đèn", "n", ["room", "bright", "turn", "off"]), S("nhẹ", "adj", ["bag", "box", "heavy", "carry"])],
    fan: [S("người hâm mộ", "n", ["team", "football", "match", "watched"]), S("cái quạt", "n", ["room", "hot", "broken", "cool"])],
    fans: [S("những chiếc quạt", "n", ["room", "hot", "broken", "cool"]), S("người hâm mộ", "n", ["team", "football", "match", "watched", "many"])],
    match: [S("que diêm", "n", ["fire", "box", "light"]), S("trận đấu", "n", ["football", "watched", "watch", "team", "fans", "win"])]
  };
  const IDIOMS = [
    ["it is raining cats and dogs", "trời mưa như trút nước"],
    ["a piece of cake", "dễ như ăn bánh"],
    ["break a leg", "chúc may mắn"],
    ["under the weather", "không được khỏe"]
  ];
  const TESTS = [
    ["I saw a bat in the cave", "Tôi thấy một con dơi trong hang động"],
    ["He hit the ball with a bat", "Anh ấy đánh quả bóng bằng một cây gậy"],
    ["The bag is light", "Cái túi nhẹ"],
    ["The light in my room is bright", "Đèn trong phòng của tôi sáng"],
    ["The fan in my room is broken", "Cái quạt trong phòng của tôi bị hỏng"],
    ["Many fans watched the match", "Nhiều người hâm mộ xem trận đấu"],
    ["My mother works at the bank", "Mẹ của tôi làm việc ở ngân hàng"],
    ["We sat on the bank and watched the boats", "Chúng tôi ngồi trên bờ sông và xem những chiếc thuyền"],
    ["It is raining cats and dogs", "Trời mưa như trút nước"],
    ["This test is a piece of cake", "Bài kiểm tra này dễ như ăn bánh"],
    ["Break a leg tonight", "Chúc may mắn tối nay"],
    ["My sister has a small black cat", "Chị gái của tôi có một con mèo đen nhỏ"]
  ];
  const words = (s) => s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z\s]/g, " ").split(/\s+/).filter(Boolean);

  // o = { idiom, context, order, win }
  function translate(sentence, o) {
    const w = words(sentence), toks = [];
    for (let i = 0; i < w.length; ) {
      let id = null;
      if (o.idiom) for (const [en, vi] of IDIOMS) { const p = en.split(" "); if (p.every((x, k) => w[i + k] === x)) { id = { en: p, vi }; break; } }
      if (id) { toks.push({ i, n: id.en.length, en: id.en.join(" "), idiom: true, senses: [S(id.vi)], pick: 0, scores: [0] }); i += id.en.length; continue; }
      const L = LEX[w[i]];
      toks.push({ i, n: 1, en: w[i], senses: L || [S("[" + w[i] + "]", "unk")], unknown: !L, pick: 0, scores: [] }); i++;
    }
    toks.forEach((t) => {
      t.scores = t.senses.map((s) => s.clue.filter((c) => w.some((x, j) => x === c && j !== t.i && Math.abs(j - t.i) <= o.win)).length);
      t.hits = t.senses.map((s) => s.clue.filter((c) => w.some((x, j) => x === c && j !== t.i && Math.abs(j - t.i) <= o.win)));
      if (o.context && t.senses.length > 1) { let b = 0; t.scores.forEach((v, k) => { if (v > t.scores[b]) b = k; }); t.pick = b; }
      t.vi = t.senses[t.pick].vi; t.pos = t.senses[t.pick].pos;
    });
    // trật tự từ: (tính từ…) + danh từ → danh từ + tính từ (đảo); của tôi / này + cụm danh từ → cụm danh từ + của tôi
    let out = toks.map((t, k) => ({ k, vi: t.vi, pos: t.pos }));
    if (o.order) {
      const res = [];
      for (let k = 0; k < out.length; ) {
        let j = k; while (j < out.length && out[j].pos === "adj") j++;
        if (j > k && j < out.length && out[j].pos === "n") { res.push(out[j], ...out.slice(k, j).reverse()); k = j + 1; } else { res.push(out[k]); k++; }
      }
      out = res; const res2 = [];
      for (let k = 0; k < out.length; ) {
        if (out[k].pos === "poss" && k + 1 < out.length && out[k + 1].pos === "n") { let j = k + 1; res2.push(out[j]); j++; while (j < out.length && out[j].pos === "adj") { res2.push(out[j]); j++; } res2.push(out[k]); k = j; }
        else { res2.push(out[k]); k++; }
      }
      out = res2;
    }
    const parts = out.filter((x) => x.vi);
    let text = parts.map((x) => x.vi).join(" ");
    text = text.charAt(0).toUpperCase() + text.slice(1);
    return { words: w, toks, out: parts, text };
  }
  const norm = (s) => s.toLowerCase().replace(/\s+/g, " ").trim();
  const score = (o) => TESTS.filter(([en, vi]) => norm(translate(en, o).text) === norm(vi)).length;
  root.MT37 = { LEX, IDIOMS, TESTS, translate, score, norm, words };
})(typeof window !== "undefined" ? window : globalThis);
