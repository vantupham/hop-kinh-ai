# Sinh phần thân trang dự án (9 bước) từ một từ điển dữ liệu, rồi ghép head/foot.
# Dùng: python3 gen.py p06.py  (file p06.py định nghĩa biến D)
import sys, runpy, html
D = runpy.run_path(sys.argv[1])["D"]
MEDAL = '<svg class="medal" viewBox="0 0 80 80" aria-hidden="true"><path d="M26 6h10l8 20-10 4zM54 6H44l-8 20 10 4z" class="f-violet" opacity=".85"/><circle cx="40" cy="48" r="24" class="f-amber"/><circle cx="40" cy="48" r="17" fill="none" stroke="#fff" stroke-width="2" opacity=".6"/><path d="m40 36 3.6 7.4 8.1 1.2-5.9 5.7 1.4 8.1L40 54.6l-7.2 3.8 1.4-8.1-5.9-5.7 8.1-1.2z" fill="#fff"/></svg>'

def kicker(n, t): return f'<div class="kicker"><span class="kn">{n}</span>{t}<span class="kl"></span></div>'

out = []
a = out.append
# 1. MỒI
a(f'''
<section id="moi" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("01","Mồi")}<h1>{D["h1"]}</h1><p class="lead">{D["lead"]}</p></div>
  {D["moi"]}
</div></section>''')
# 2. NHIỆM VỤ
chk = "".join(f'<li data-k="{k}"><span class="box"><i data-i="check"></i></span>{t}</li>' for k, t in D["checklist"])
a(f'''
<section id="nhiem-vu" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("02","Nhiệm vụ")}<h2>{D["mission_h2"]}</h2></div>
  <div class="grid g2">
    <div class="card vf"><div class="ico-box"><i data-i="target"></i></div>
      <p>Câu hỏi lớn: <b>"{D["mission_q"]}"</b></p><p class="muted">{D["mission_p"]}</p>
      <div class="chips"><span class="chip"><i data-i="clock"></i>{D["minutes"]}</span><span class="chip mint"><i data-i="shield"></i>Không cần cài đặt</span><span class="chip coral"><i data-i="book"></i>4 thẻ kiến thức</span></div></div>
    <div class="card"><h3>Danh sách nhiệm vụ <span class="muted small">· tự đánh dấu khi em làm xong</span></h3><ul class="checklist" id="checklist">{chk}</ul></div>
  </div>
</div></section>''')
# 3. SOI
a(f'''
<section id="soi" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("03","Soi bên trong")}<h2>{D["soi_h2"]}</h2><p class="muted">{D["soi_p"]}</p></div>
  <svg id="pipeline" class="pipeline" viewBox="0 0 1100 124" role="tablist" aria-label="Sơ đồ luồng xử lý"></svg>
  <div class="soi-body">
    <div class="stage small-stage vf"><canvas id="soiCanvas" width="640" height="480"></canvas></div>
    <div class="card soi-explain"><span class="chip" id="soiChip">BƯỚC 1/6</span><h3 id="soiTitle" style="margin-top:12px"></h3><div id="soiText"></div><div class="lab soi-live" id="soiLive"></div>
      <div class="soi-nav"><button class="btn small ghost" id="soiPrev"><i data-i="arrowL"></i>Bước trước</button><button class="btn small accent" id="soiNext">Bước tiếp<i data-i="arrowR"></i></button></div></div>
  </div>
</div></section>''')
# 4. LÝ THUYẾT
cards = "".join(f'''
    <article class="card tcard vf"><div class="tc-top"><span class="chip">THẺ #{c["no"]}</span><span class="chip {c.get("cls","mint")}">{c["tag"]}</span></div>
      <h3>{c["title"]}</h3><svg viewBox="0 0 260 120" class="tc-ill" aria-hidden="true">{c["svg"]}</svg><p>{c["p"]}</p>
      <details><summary>{c.get("deep_t","Hiểu sâu hơn")}</summary><p>{c["deep"]}</p></details></article>''' for c in D["theory"])
a(f'''
<section id="ly-thuyet" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("04","Thẻ lý thuyết")}<h2>4 thẻ kiến thức em sẽ thu thập</h2></div>
  <div class="grid g2 theory">{cards}</div>
</div></section>''')
# 5. TỰ LÀM
a(f'''
<section id="tu-lam" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("05","Tự làm")}<h2>{D["tulam_h2"]}</h2><p class="muted">{D["tulam_p"]}</p></div>
  {D["tulam"]}
</div></section>''')
# 6. PHÁ MÁY
br = "".join(f'''
    <div class="card break"><div class="ico-box coral"><i data-i="{b["icon"]}"></i></div><span class="chip coral">SỰ CỐ {i+1}</span><h3>{b["title"]}</h3><p>{b["p"]}</p>
      <button class="btn small coral" data-break="{b["key"]}"><i data-i="bolt"></i>Bật sự cố</button>
      <details><summary>{b.get("why_t","Vì sao AI sai? Cách sửa?")}</summary><p>{b["why"]}</p></details></div>''' for i, b in enumerate(D["breaks"]))
a(f'''
<section id="pha-may" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("06","Phá máy")}<h2>{D.get("breaks_h2","Thử thách: hãy làm AI sai!")}</h2><p class="muted">{D.get("breaks_p","")}</p></div>
  <div class="grid g3">{br}</div>
  <p class="center" style="margin-top:18px"><button class="btn small ghost" id="btnFixAll"><i data-i="wrench"></i>{D.get("fix","Tắt mọi sự cố")}</button></p>
</div></section>''')
# 7. NGOÀI ĐỜI
rw = "".join(f'<div class="card"><div class="ico-box {c}"><i data-i="{ic}"></i></div><h3>{t}</h3><p class="muted">{p}</p></div>' for ic, c, t, p in D["real"])
eth = "".join(f"<li>{x}</li>" for x in D["ethics"])
a(f'''
<section id="ngoai-doi" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("07","AI ngoài đời")}<h2>{D["real_h2"]}</h2></div>
  <div class="grid g3">{rw}</div>
  <div class="card ethics" style="margin-top:18px"><h3 class="h-ic"><span class="ico-box sm coral"><i data-i="help"></i></span>Cùng suy nghĩ</h3><ul>{eth}</ul></div>
</div></section>''')
# 8. KIỂM TRA
a(f'''
<section id="kiem-tra" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("08","Kiểm tra")}<h2>5 câu hỏi để nhận huy hiệu</h2></div>
  <div id="quiz" class="quiz"></div>
  <div id="badge" class="badge" hidden>{MEDAL}<div><h3>Huy hiệu "{D["badge"]}"</h3><p>{D["badge_p"]}</p></div></div>
</div></section>''')
# 9. PHÁT TRIỂN
dv = "".join(f'''
    <div class="card dev vf"><div class="lvl" data-stars="{s}"><span>{lab}</span></div><h3>{t}</h3><p><b>Gợi ý:</b> {h}</p>
      <p class="done"><i data-i="checkCircle"></i><span><b>{dl}:</b> {dd}</span></p></div>''' for s, lab, t, h, dl, dd in D["dev"])
ys = [16, 91, 166]
nodes = "".join(f'<rect x="320" y="{y}" width="190" height="48" rx="12" class="f-paper s-line"/><text x="415" y="{y+21}" text-anchor="middle" font-weight="700" class="f-ink">{t}</text><text x="415" y="{y+38}" text-anchor="middle" class="f-muted" font-size="11">{s}</text>' for (t, s), y in zip(D["next"], ys))
kh = "".join(f"<dt>{t}</dt><dd>{d}</dd>" for t, d in D["khkt"])
nav = ""
if D.get("prev"): nav += f'<a class="btn ghost" href="../{D["prev"][0]}/index.html"><i data-i="arrowL"></i>Dự án {D["prev"][1]}</a> '
nav += '<a class="btn" href="../../index.html#ban-do"><i data-i="map"></i>Bản đồ</a>'
if D.get("nextp"): nav += f' <a class="btn accent" href="../{D["nextp"][0]}/index.html">Dự án {D["nextp"][1]}<i data-i="arrowR"></i></a>'
a(f'''
<section id="phat-trien" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("09","Hướng phát triển")}<h2>{D["dev_h2"]}</h2></div>
  <div class="grid g3">{dv}</div>
  <div class="grid g2" style="margin-top:18px">
    <div class="card"><h3 class="h-ic"><span class="ico-box sm"><i data-i="map"></i></span>Đi tiếp trên bản đồ</h3>
      <svg viewBox="0 0 520 230" class="next-map" aria-label="Các dự án nối tiếp">
        <g class="s-violet flowdash" stroke-width="2" fill="none" marker-end="url(#arV)" stroke-dasharray="6 5"><path d="M150 115 C220 115 230 40 316 40"/><path d="M150 115 L316 115"/><path d="M150 115 C220 115 230 190 316 190"/></g>
        <g font-size="13"><rect x="10" y="88" width="140" height="54" rx="12" class="f-violet"/><text x="80" y="112" text-anchor="middle" fill="#fff" font-weight="700">{D["cur"]}</text><text x="80" y="130" text-anchor="middle" fill="#fff" opacity=".75" font-size="11">em đang ở đây</text>{nodes}</g>
      </svg></div>
    <div class="card khkt"><h3 class="h-ic"><span class="ico-box sm mint"><i data-i="flask"></i></span>Thẻ ý tưởng KHKT</h3><dl>{kh}</dl>
      <p class="muted small showcase"><i data-i="upload"></i><span><b>Góc trưng bày:</b> Làm xong rồi? Gửi sản phẩm qua GitHub để được đăng lên trang.</span></p></div>
  </div>
  <p class="center" style="margin-top:30px">{nav}</p>
</div></section>''')

body = "\n".join(out)
h = open('tools/head.html', encoding='utf-8').read().replace('{{TITLE}}', D["title"]).replace('{{LEVEL}}', D["level"]).replace('{{NUM}}', D["num"])
f = open('tools/foot.html', encoding='utf-8').read().replace('{{NUM}}', D["num"]).replace('{{SCRIPTS}}', '\n'.join(f'<script src="{s}"></script>' for s in D["scripts"]))
open(D["out"], "w", encoding="utf-8").write(h + body + f)
print("built", D["out"])
