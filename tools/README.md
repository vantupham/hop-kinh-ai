# Bộ tạo trang dự án

Các trang Dự án 6 trở đi được sinh tự động: phần khung 9 bước (Nhiệm vụ, Soi, Lý thuyết, Phá máy, Ngoài đời, Kiểm tra, Phát triển) lấy từ một file dữ liệu Python, còn phần tương tác viết trong file `.js` của từng dự án.

Chạy từ thư mục gốc của repo:
```bash
python3 tools/gen.py tools/p06.py   # sinh lại du-an/06-thung-rac/index.html
```
Muốn làm dự án mới: sao chép một file `pXX.py`, sửa nội dung, viết file `.js` tương tác (dùng thư viện `assets/project.js`), rồi chạy lệnh trên.

Sau khi sinh lại bất kỳ trang nào, chạy `python3 tools/seo.py` để gắn lại thẻ SEO, tiêu đề tối ưu và dòng "Biên soạn" ở chân trang.
