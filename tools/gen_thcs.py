# Sinh trang dự án nhánh THCS (6 bước: Chơi, Nhiệm vụ, Soi, Thẻ kiến thức, Phá máy, Thử thách)
# Dùng: python3 tools/gen_thcs.py tools/p21.py   (chạy từ thư mục gốc repo), sau đó chạy python3 tools/seo.py
import sys, runpy
D = runpy.run_path(sys.argv[1])["D"]
R = "../../"
KINH = ('<svg class="kinh" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="kg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c6bff"/><stop offset="1" stop-color="#3fe0c5"/></linearGradient></defs>'
        '<path d="M32 4v8" stroke="#7c6bff" stroke-width="3" stroke-linecap="round"/><circle cx="32" cy="4" r="4" fill="#ffc34d"/>'
        '<rect x="8" y="12" width="48" height="40" rx="13" fill="#1d2152" stroke="url(#kg)" stroke-width="3"/><path d="M15 18h10" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>'
        '<circle cx="23" cy="31" r="5.5" fill="#3fe0c5"/><circle cx="41" cy="31" r="5.5" fill="#3fe0c5"/><circle cx="24.5" cy="29.5" r="1.8" fill="#fff"/><circle cx="42.5" cy="29.5" r="1.8" fill="#fff"/>'
        '<path d="M25 42q7 5 14 0" stroke="#ffc34d" stroke-width="3" fill="none" stroke-linecap="round"/><rect x="18" y="52" width="28" height="7" rx="3.5" fill="#7c6bff"/></svg>')
MEDAL = '<svg class="medal" viewBox="0 0 80 80" aria-hidden="true"><path d="M26 6h10l8 20-10 4zM54 6H44l-8 20 10 4z" class="f-violet" opacity=".85"/><circle cx="40" cy="48" r="24" class="f-amber"/><circle cx="40" cy="48" r="16" fill="none" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M40 38l3 7 7 .6-5.4 4.6 1.7 7L40 53.6 33.7 57.2l1.7-7L30 45.6l7-.6z" fill="#fff"/></svg>'

def guide(html, gid=None):
    i = f' id="{gid}"' if gid else ""
    return f'<div class="guide">{KINH}<div class="bubble"><b class="who">KÍNH NÓI</b><span{i}>{html}</span></div></div>'

def kicker(n, t): return f'<div class="kicker"><span class="kn">{n}</span>{t}<span class="kl"></span></div>'

o = []
a = o.append
a(f'''
<section id="choi" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("01","Chơi")}<h1>{D["h1"]}</h1><p class="lead">{D["lead"]}</p></div>
  {D["play"]}
</div></section>''')
chk = "".join(f'<li data-k="{k}"><span class="box"><i data-i="check"></i></span>{t}</li>' for k, t in D["checklist"])
les = "".join(f'<span class="chip">{x}</span>' for x in D["lessons"])
a(f'''
<section id="nhiem-vu" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("02","Nhiệm vụ")}<h2>{D["mission_h2"]}</h2></div>
  <div class="grid g2">
    <div class="card vf"><div class="ico-box"><i data-i="target"></i></div>
      <p>Câu hỏi lớn: <b>"{D["mission_q"]}"</b></p><p class="muted">{D["mission_p"]}</p>
      <div class="chips"><span class="chip"><i data-i="clock"></i>{D["minutes"]}</span><span class="chip mint"><i data-i="shield"></i>Không cần camera</span><span class="chip coral"><i data-i="book"></i>{len(D["cards"])} thẻ kiến thức</span></div>
      <p class="small muted" style="margin:14px 0 4px">Liên quan tới bài học trên lớp:</p><div class="lesson">{les}</div></div>
    <div class="card"><h3>Danh sách nhiệm vụ <span class="muted small">· tự đánh dấu khi em làm xong</span></h3><ul class="checklist" id="checklist">{chk}</ul></div>
  </div>
</div></section>''')
a(f'''
<section id="soi" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("03","Soi bên trong")}<h2>{D["soi_h2"]}</h2><p class="muted">{D["soi_p"]}</p></div>
  {guide(D["soi_guide"])}
  <svg id="pipeline" class="pipeline" viewBox="0 0 1100 124" role="tablist" aria-label="Sơ đồ các bước"></svg>
  <div class="soi-body">
    <div class="stage small-stage vf"><canvas id="soiCanvas" width="640" height="480" aria-label="Hình minh họa từng bước"></canvas></div>
    <div class="card soi-explain"><span class="chip" id="soiChip">BƯỚC 1/6</span><h3 id="soiTitle" style="margin-top:12px"></h3><div id="soiText"></div><div class="lab soi-live" id="soiLive"></div>
      <div class="soi-nav"><button class="btn small ghost" id="soiPrev"><i data-i="arrowL"></i>Bước trước</button><button class="btn small accent" id="soiNext">Bước tiếp<i data-i="arrowR"></i></button></div></div>
  </div>
</div></section>''')
cards = "".join(f'''
    <article class="card tcard vf"><div class="tc-top"><span class="chip">THẺ #{c["no"]}</span><span class="chip {c.get("cls","mint")}">{c["tag"]}</span></div>
      <h3>{c["title"]}</h3><svg viewBox="0 0 260 120" class="tc-ill" aria-hidden="true">{c["svg"]}</svg><p>{c["p"]}</p>
      <details><summary>Ví dụ đời thường</summary><p>{c["ex"]}</p></details></article>''' for c in D["cards"])
rw = "".join(f'<div class="card"><div class="ico-box {c}"><i data-i="{ic}"></i></div><h3>{t}</h3><p class="muted">{p}</p></div>' for ic, c, t, p in D["real"])
a(f'''
<section id="kien-thuc" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("04","Thẻ kiến thức")}<h2>{len(D["cards"])} thẻ kiến thức em sẽ thu thập</h2></div>
  <div class="grid g3 theory">{cards}</div>
  <h3 class="h-ic" style="margin-top:26px"><span class="ico-box sm amber"><i data-i="globe"></i></span>AI quanh em</h3>
  <div class="grid g3">{rw}</div>
</div></section>''')
br = "".join(f'''
    <div class="card break"><div class="ico-box coral"><i data-i="{b["icon"]}"></i></div><span class="chip coral">SỰ CỐ {i+1}</span><h3>{b["title"]}</h3><p>{b["p"]}</p>
      <button class="btn small coral" data-break="{b["key"]}"><i data-i="bolt"></i>Bật sự cố</button>
      <details><summary>Vì sao máy sai? Sửa thế nào?</summary><p>{b["why"]}</p></details></div>''' for i, b in enumerate(D["breaks"]))
a(f'''
<section id="pha-may" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("05","Phá máy")}<h2>{D["breaks_h2"]}</h2></div>
  {guide(D["breaks_guide"])}
  <div class="grid g3">{br}</div>
  <p class="center" style="margin-top:18px"><button class="btn small ghost" id="btnFixAll"><i data-i="wrench"></i>Tắt mọi sự cố</button></p>
</div></section>''')
dv = "".join(f'''
    <div class="card dev vf"><div class="lvl" data-stars="{s}"><span>{lab}</span></div><h3>{t}</h3><p>{h}</p></div>''' for s, lab, t, h in D["dev"])
res = "".join(f'<a class="card" href="{href}"><div class="ico-box {c}"><i data-i="{ic}"></i></div><div><h3>{t}</h3><p class="small muted">{p}</p></div></a>' for ic, c, t, p, href in D["res"])
nav = ""
if D.get("prev"): nav += f'<a class="btn ghost" href="{R}du-an/{D["prev"][0]}/index.html"><i data-i="arrowL"></i>Dự án {D["prev"][1]}</a> '
nav += f'<a class="btn" href="{R}index.html#ban-do"><i data-i="map"></i>Bản đồ</a>'
if D.get("nextp"): nav += f' <a class="btn accent" href="{R}du-an/{D["nextp"][0]}/index.html">Dự án {D["nextp"][1]}<i data-i="arrowR"></i></a>'
a(f'''
<section id="thu-thach" class="sec"><div class="wrap">
  <div class="sec-head">{kicker("06","Thử thách")}<h2>Kiểm tra nhanh và thử thách tiếp theo</h2></div>
  <div id="quiz" class="quiz"></div>
  <div id="badge" class="badge" hidden>{MEDAL}<div><h3>Huy hiệu "{D["badge"]}"</h3><p>{D["badge_p"]}</p></div></div>
  <h3 class="h-ic" style="margin-top:28px"><span class="ico-box sm"><i data-i="trophy"></i></span>Thử thách cho em</h3>
  <div class="grid g3">{dv}</div>
  <div class="res" style="margin-top:18px">{res}</div>
  <p class="center" style="margin-top:30px">{nav}</p>
</div></section>''')

head = f'''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{D["title"]} – Hộp Kính AI</title>
<script>try{{document.documentElement.dataset.theme=localStorage.getItem("hka-theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light")}}catch(e){{document.documentElement.dataset.theme="light"}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{R}assets/style.css">
<link rel="stylesheet" href="{R}assets/project.css">
<link rel="stylesheet" href="{R}assets/thcs.css">
</head>
<body>
<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
  <marker id="arV" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="f-violet"/></marker>
  <marker id="arC" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" class="f-coral"/></marker>
  <linearGradient id="lgE" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--violet)"/><stop offset="1" style="stop-color:var(--mint)"/></linearGradient>
</defs></svg>
<header class="topbar"><div class="wrap">
  <a class="logo" href="{R}index.html"><svg viewBox="0 0 32 32" aria-hidden="true"><rect x="10" y="2.5" width="19" height="19" rx="4" fill="none" stroke="url(#lgE)" stroke-width="1.5" opacity=".55"/><path d="M5 10.5 11 4.5M22.5 10.5l5.5-6M22.5 28l5.5-6" stroke="url(#lgE)" stroke-width="1.5" opacity=".55"/><rect x="3" y="10.5" width="19" height="19" rx="4" fill="var(--surface-solid)" stroke="url(#lgE)" stroke-width="2"/><circle cx="12.5" cy="20" r="3.2" fill="var(--mint)"/></svg>Hộp Kính AI</a>
  <span class="crumbs"><a href="{R}index.html#ban-do">THCS · LỚP {D["grade"]}</a> / DỰ ÁN {D["num"]}</span>
  <span class="spacer"></span>
  <span class="chip mint" id="progressChip"><i data-i="checkCircle"></i>0/5</span>
  <button class="theme-tg" data-theme-toggle></button>
</div></header>
<nav class="steps" aria-label="Các bước của dự án"><div class="wrap">
  <a href="#choi"><i data-i="play"></i>Chơi</a><a href="#nhiem-vu"><i data-i="target"></i>Nhiệm vụ</a><a href="#soi"><i data-i="scan"></i>Soi bên trong</a><a href="#kien-thuc"><i data-i="book"></i>Thẻ kiến thức</a><a href="#pha-may"><i data-i="bolt"></i>Phá máy</a><a href="#thu-thach"><i data-i="trophy"></i>Thử thách</a>
</div></nav>
'''
foot = f'''
<footer class="site"><div class="wrap"><i data-i="shield"></i>Hộp Kính AI · Nhánh THCS · Dự án {D["num"]} · Chạy hoàn toàn trên trình duyệt của em.</div></footer>
<script src="{R}assets/ui.js"></script>
<script src="{R}assets/project.js"></script>
{chr(10).join(f'<script src="{s}"></script>' for s in D["scripts"])}
</body>
</html>
'''
body = "\n".join(o).replace("{{GUIDE}}", guide(D.get("play_guide", ""), "guideText"))
open(D["out"], "w", encoding="utf-8").write(head + body + foot)
print("built", D["out"])
