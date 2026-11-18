# Sinh phiếu học tập (phieu.html) và hướng dẫn giáo viên (giao-vien.html) cho dự án THCS
# Dùng: python3 tools/gen_doc.py tools/d02.py   rồi chạy python3 tools/seo.py
import sys, runpy
X = runpy.run_path(sys.argv[1])["DOC"]
num, folder, grade = X["num"], X["folder"], X.get("grade", "6")

def page(kind, d):
    is_p = kind == "phieu"
    crumb = "PHIẾU HỌC TẬP" if is_p else "GIÁO VIÊN"
    other = ('<a class="btn ghost" href="giao-vien.html"><i data-i="book"></i>Hướng dẫn giáo viên</a>' if is_p
             else '<a class="btn ghost" href="phieu.html"><i data-i="layers"></i>Phiếu học tập</a><a class="btn ghost" href="../../giao-vien/so-theo-doi.html"><i data-i="chart"></i>Sổ theo dõi tự học</a>')
    kick = f"HỘP KÍNH AI · NHÁNH THCS · LỚP {grade}" + ("" if is_p else " · HƯỚNG DẪN GIÁO VIÊN")
    foot = (f"Phiếu học tập Dự án {num} · Được in và sao chép tự do cho mục đích học tập." if is_p
            else f"Hướng dẫn giáo viên Dự án {num} · Được sử dụng tự do cho mục đích giáo dục.")
    return f'''<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>{d["title"]} | Hộp Kính AI</title>
<script>try{{document.documentElement.dataset.theme=localStorage.getItem("hka-theme")||"light"}}catch(e){{document.documentElement.dataset.theme="light"}}</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../../assets/style.css">
<link rel="stylesheet" href="../../assets/thcs.css">
</head>
<body>
<header class="topbar"><div class="wrap"><a class="logo" href="../../index.html">Hộp Kính AI</a><span class="crumbs"><a href="index.html">DỰ ÁN {num}</a> / {crumb}</span><span class="spacer"></span><button class="theme-tg" data-theme-toggle></button></div></header>
<main class="doc-page">
  <div class="print-bar"><button class="btn accent" onclick="window.print()"><i data-i="upload"></i>{"In phiếu (khổ A4)" if is_p else "In hướng dẫn"}</button><a class="btn ghost" href="index.html"><i data-i="arrowL"></i>Về Dự án {num}</a>{other}</div>
  <p class="kicker" style="margin:0">{kick}</p>
  <h1>{d["h1"]}</h1>
  <p class="lead">{d["lead"]}</p>
{d["body"]}
</main>
<footer class="site"><div class="wrap"><i data-i="shield"></i>Hộp Kính AI · {foot}<!--by--><span class="by">Biên soạn: <a href="../../index.html#bien-soan" rel="author">Phạm Văn Tú</a> · © 2026 Hộp Kính AI</span></div></footer>
{d.get("script", "")}
<script src="../../assets/ui.js"></script>
</body>
</html>
'''

NAME = '<table><tr><th style="width:50%">Họ và tên:</th><th>Lớp:</th><th>Nhóm:</th></tr></table>'
X["phieu"]["body"] = "  " + NAME + "\n" + X["phieu"]["body"]
for kind in ("phieu", "giao-vien"):
    out = f"du-an/{folder}/{kind}.html"
    open(out, "w", encoding="utf-8").write(page(kind, X[kind]))
    print("built", out)
