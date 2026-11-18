# Bộ tạo trang dự án

Các trang Dự án 26 trở đi được sinh tự động: phần khung 9 bước (Nhiệm vụ, Soi, Lý thuyết, Phá máy, Ngoài đời, Kiểm tra, Phát triển) lấy từ một file dữ liệu Python, còn phần tương tác viết trong file `.js` của từng dự án.

Chạy từ thư mục gốc của repo:
```bash
python3 tools/gen.py tools/p26.py   # sinh lại du-an/26-thung-rac/index.html
```
Muốn làm dự án mới: sao chép một file `pXX.py`, sửa nội dung, viết file `.js` tương tác (dùng thư viện `assets/project.js`), rồi chạy lệnh trên.

Sau khi sinh lại bất kỳ trang nào, chạy `python3 tools/seo.py` để gắn lại thẻ SEO, tiêu đề tối ưu và dòng "Biên soạn" ở chân trang.

## Nhánh THCS (Dự án 1 trở đi)
Trang THCS có 6 bước (Chơi, Nhiệm vụ, Soi bên trong, Thẻ kiến thức, Phá máy, Thử thách) và bạn hướng dẫn Kính.
```bash
python3 tools/gen_thcs.py tools/p02.py   # sinh du-an/02-may-nhin-anh/index.html
python3 tools/gen_doc.py tools/d02.py    # sinh phieu.html và giao-vien.html của Dự án 2
python3 tools/seo.py                     # gắn thẻ SEO, sitemap, dòng Biên soạn
```
Mỗi file `pXX.py` chứa nội dung trang, mỗi file `dXX.py` chứa nội dung phiếu học tập và hướng dẫn giáo viên.
