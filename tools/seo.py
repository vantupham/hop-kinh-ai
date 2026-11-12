"""Hộp Kính AI · gắn thông tin SEO, người biên soạn, dữ liệu có cấu trúc cho mọi trang.

Chạy từ thư mục gốc của repo, SAU KHI sinh/sửa trang:
    python3 tools/seo.py                                   # dùng địa chỉ đã lưu trong tools/site.json
    python3 tools/seo.py --base https://ten.github.io/hop-kinh-ai/   # lưu địa chỉ GitHub Pages rồi chạy

Có địa chỉ (base) thì sinh thêm: thẻ canonical, og:url, đường dẫn tuyệt đối cho ảnh chia sẻ, sitemap.xml.
Lệnh có thể chạy lại nhiều lần: các khối cũ được thay thế, không bị nhân đôi.
"""
import glob, html, json, os, re, sys, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CFG_PATH = os.path.join(ROOT, "tools", "site.json")
cfg = {"base": "", "author": "Phạm Văn Tú", "name": "Hộp Kính AI", "year": 2026}
if os.path.exists(CFG_PATH):
    cfg.update(json.load(open(CFG_PATH, encoding="utf-8")))
if "--base" in sys.argv:
    b = sys.argv[sys.argv.index("--base") + 1].strip()
    cfg["base"] = b if b.endswith("/") else b + "/"
json.dump(cfg, open(CFG_PATH, "w", encoding="utf-8"), ensure_ascii=False, indent=2)
BASE, AUTHOR, NAME = cfg["base"], cfg["author"], cfg["name"]
TODAY = datetime.date.today().isoformat()

HOME_DESC = "Website miễn phí giúp học sinh tự học trí tuệ nhân tạo qua 20 dự án trực quan, chạy ngay trên trình duyệt, có lý thuyết từng bước và gợi ý đề tài KHKT."
KEYWORDS_BASE = ["trí tuệ nhân tạo", "AI cho học sinh", "học máy", "tự học AI", "dự án AI", "STEM", "KHKT", "Hộp Kính AI"]
person = {"@type": "Person", "name": AUTHOR}


def text(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def clip(s, n=158):
    if len(s) <= n:
        return s
    cut = s[:n].rsplit(" ", 1)[0].rstrip(",.;:")
    return cut + "…"


def url(rel):
    return BASE + rel if BASE else ""


pages = [("index.html", "")] + [(p, p[: -len("index.html")]) for p in sorted(glob.glob("du-an/*/index.html", root_dir=ROOT))]
projects = []
for path, folder in pages[1:]:
    s = open(os.path.join(ROOT, path), encoding="utf-8").read()
    num = int(re.match(r"du-an/(\d+)", path).group(1)); name = text(re.search(r"<h1[^>]*>(.*?)</h1>", s, re.S).group(1))
    projects.append({"path": path, "folder": folder, "num": num, "name": name, "title": f"Dự án {num}: {name}",
                     "seo_title": f"{name} · Dự án AI {num} cho học sinh | {NAME}"})


def head_block(path, folder, s):
    root = "../../" if folder else ""
    is_home = not folder
    if is_home:
        title = re.search(r"<title>(.*?)</title>", s).group(1)
        desc, og_img, keywords = HOME_DESC, "assets/og/home.jpg", KEYWORDS_BASE
    else:
        pr = next(p for p in projects if p["folder"] == folder); title = pr["seo_title"]
        lead = text(re.search(r'<p class="lead">(.*?)</p>', s, re.S).group(1))
        desc = clip(lead)
        num = pr["num"]
        og_img = f"assets/og/{num:02d}.jpg"
        m = re.search(r"mở khóa 4 thẻ kiến thức: (.*?)\.", s)
        teaches = [t.strip() for t in m.group(1).split("·")] if m else []
        keywords = teaches + KEYWORDS_BASE[:4]
    img_abs = url(og_img) or root + og_img
    page_url = url(folder) if folder else url("")
    L = ['<!--seo:start-->',
         f'<meta name="description" content="{html.escape(desc)}">',
         f'<meta name="keywords" content="{html.escape(", ".join(keywords))}">',
         f'<meta name="author" content="{AUTHOR}">',
         '<meta name="robots" content="index,follow,max-image-preview:large">',
         '<meta name="theme-color" content="#f4f2fb" media="(prefers-color-scheme: light)">',
         '<meta name="theme-color" content="#0b0d26" media="(prefers-color-scheme: dark)">',
         '<meta name="color-scheme" content="light dark">',
         f'<link rel="icon" href="{root}assets/favicon.svg" type="image/svg+xml">',
         f'<link rel="icon" href="{root}assets/icons/icon-192.png" type="image/png" sizes="192x192">',
         f'<link rel="apple-touch-icon" href="{root}assets/icons/apple-touch-icon.png">',
         f'<link rel="manifest" href="{root}manifest.webmanifest">',
         f'<link rel="author" href="{root}index.html#bien-soan">']
    if page_url:
        L.append(f'<link rel="canonical" href="{page_url}">')
    L += [f'<meta property="og:site_name" content="{NAME}">',
          '<meta property="og:locale" content="vi_VN">',
          f'<meta property="og:type" content="{"website" if is_home else "article"}">',
          f'<meta property="og:title" content="{html.escape(title)}">',
          f'<meta property="og:description" content="{html.escape(desc)}">',
          f'<meta property="og:image" content="{img_abs}">',
          '<meta property="og:image:width" content="1200">', '<meta property="og:image:height" content="630">',
          f'<meta property="og:image:alt" content="{html.escape(title)}">']
    if page_url:
        L.append(f'<meta property="og:url" content="{page_url}">')
    if not is_home:
        L.append(f'<meta property="article:author" content="{AUTHOR}">')
    L += ['<meta name="twitter:card" content="summary_large_image">',
          f'<meta name="twitter:title" content="{html.escape(title)}">',
          f'<meta name="twitter:description" content="{html.escape(desc)}">',
          f'<meta name="twitter:image" content="{img_abs}">']
    # dữ liệu có cấu trúc (schema.org)
    course = {"@type": "Course", "name": f"{NAME}: tự học trí tuệ nhân tạo qua 20 dự án", "description": HOME_DESC, "inLanguage": "vi",
              "provider": person, "author": person, "isAccessibleForFree": True, "educationalLevel": "Trung học cơ sở và trung học phổ thông"}
    if BASE:
        course["url"] = BASE
    if is_home:
        course["hasPart"] = [dict({"@type": "LearningResource", "name": p["title"], "position": p["num"]}, **({"url": url(p["folder"])} if BASE else {})) for p in projects]
        site = {"@type": "WebSite", "name": NAME, "inLanguage": "vi", "author": person, "description": HOME_DESC}
        if BASE:
            site["url"] = BASE
        graph = [site, dict(person, **{"@id": "#bien-soan"}), course]
    else:
        mins = re.search(r'<i data-i="clock"></i>([^<]*)phút', s)
        mx = re.findall(r"\d+", mins.group(1)) if mins else []
        res = {"@type": "LearningResource", "name": pr["title"], "description": desc, "inLanguage": "vi", "author": person,
               "learningResourceType": "Dự án thực hành tương tác", "educationalLevel": "Trung học cơ sở và trung học phổ thông",
               "isAccessibleForFree": True, "teaches": teaches, "isPartOf": {"@type": "Course", "name": course["name"]},
               "image": img_abs, "datePublished": "2026-11-12"}
        if mx:
            res["timeRequired"] = f"PT{max(map(int, mx))}M"
        if page_url:
            res["url"] = page_url
        graph = [res]
        if BASE:
            graph.append({"@type": "BreadcrumbList", "itemListElement": [
                {"@type": "ListItem", "position": 1, "name": NAME, "item": BASE},
                {"@type": "ListItem", "position": 2, "name": pr["title"], "item": page_url}]})
    L.append('<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False) + "</script>")
    L.append("<!--seo:end-->")
    return "\n".join(L)


def footer(s, folder):
    root = "../../" if folder else ""
    by = (f'<!--by--><span class="by">Biên soạn: <a href="{root}index.html#bien-soan" rel="author">{AUTHOR}</a> · © {cfg["year"]} {NAME}</span>')
    def rep(m):
        inner = re.sub(r"<!--by-->.*", "", m.group(1), flags=re.S)
        return f'<footer class="site"><div class="wrap">{inner}{by}</div></footer>'
    return re.sub(r'<footer class="site"><div class="wrap">(.*?)</div></footer>', rep, s, flags=re.S)


for path, folder in pages:
    fp = os.path.join(ROOT, path)
    s = open(fp, encoding="utf-8").read()
    s = re.sub(r"\n?<!--seo:start-->.*?<!--seo:end-->", "", s, flags=re.S)
    if folder:
        pr = next(p for p in projects if p["folder"] == folder)
        s = re.sub(r"<title>.*?</title>", f"<title>{html.escape(pr['seo_title'], quote=False)}</title>", s, count=1)
    s = s.replace('<meta name="viewport" content="width=device-width,initial-scale=1">', '<meta name="viewport" content="width=device-width,initial-scale=1">\n' + head_block(path, folder, s), 1)
    s = footer(s, folder)
    open(fp, "w", encoding="utf-8").write(s)

# robots.txt, sitemap.xml, manifest
robots = "User-agent: *\nAllow: /\n" + (f"\nSitemap: {BASE}sitemap.xml\n" if BASE else "")
open(os.path.join(ROOT, "robots.txt"), "w").write(robots)
if BASE:
    urls = [("", "1.0")] + [(p["folder"], "0.8") for p in projects]
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + "".join(
        f"  <url><loc>{BASE}{u}</loc><lastmod>{TODAY}</lastmod><priority>{pr}</priority></url>\n" for u, pr in urls) + "</urlset>\n"
    open(os.path.join(ROOT, "sitemap.xml"), "w").write(xml)
elif os.path.exists(os.path.join(ROOT, "sitemap.xml")):
    os.remove(os.path.join(ROOT, "sitemap.xml"))
manifest = {"name": f"{NAME} – Tự học AI qua 20 dự án", "short_name": NAME, "description": HOME_DESC, "lang": "vi", "start_url": "./", "scope": "./",
            "display": "standalone", "background_color": "#0b0d26", "theme_color": "#5443ff",
            "icons": [{"src": "assets/icons/icon-192.png", "sizes": "192x192", "type": "image/png"}, {"src": "assets/icons/icon-512.png", "sizes": "512x512", "type": "image/png"},
                      {"src": "assets/favicon.svg", "sizes": "any", "type": "image/svg+xml"}]}
json.dump(manifest, open(os.path.join(ROOT, "manifest.webmanifest"), "w", encoding="utf-8"), ensure_ascii=False, indent=2)
print(f"SEO: {len(pages)} trang · biên soạn: {AUTHOR} · base = {BASE or '(chưa đặt: chạy lại với --base https://ten.github.io/ten-repo/)'}")
