# Hộp Kính AI

Website giúp học sinh **tự học trí tuệ nhân tạo qua 20 dự án trực quan**. AI chạy ngay trên trình duyệt: không cần cài đặt, ảnh của học sinh không rời khỏi máy.

## Chạy thử trên máy
```bash
python3 -m http.server 8000
# mở http://localhost:8000
```
(Camera chỉ hoạt động khi chạy qua `localhost` hoặc `https`.)

## Đăng lên GitHub Pages
1. Tạo repo mới trên GitHub, ví dụ `hop-kinh-ai`, rồi tải toàn bộ thư mục này lên.
2. Vào **Settings → Pages → Build and deployment**, chọn *Deploy from a branch*, nhánh `main`, thư mục `/ (root)`, rồi bấm **Save**.
3. Sau khoảng 1 phút, web sẽ có tại `https://<tên-tài-khoản>.github.io/hop-kinh-ai/`

## Cấu trúc
```
index.html                  Trang chủ và bản đồ 20 dự án
assets/style.css            Hệ thiết kế dùng chung (sáng/tối)
assets/ui.js                Bộ icon SVG + nút chuyển giao diện
assets/project.css|.js      Thư viện chung cho trang dự án: quiz, tiến độ, sơ đồ bước, camera, biểu đồ
assets/sim-hand.js          Bàn tay mô phỏng 21 điểm (dùng cho Dự án 2, 3, 15)
du-an/01-squat/             Dự án 1: Huấn luyện viên Squat (tư thế, góc, độ tin cậy)
du-an/02-oan-tu-ti/         Dự án 2: Oẳn tù tì với AI (đặc trưng, KNN)
du-an/03-hoa-si/            Dự án 3: Họa sĩ không chạm (nhiễu, làm mượt, độ trễ)
du-an/04-mat-na/            Dự án 4: Mặt nạ cảm xúc (lưới mặt, điểm neo, quyền riêng tư)
du-an/05-vu-cong/           Dự án 5: Vũ công AI (vector, chuẩn hóa, cosine)
du-an/06-thung-rac/          Dự án 6: Thùng rác thông minh (train/test, học chuyển giao, quá khớp)
du-an/07-diem-thi/           Dự án 7: Dự đoán điểm thi (hồi quy, MSE, gradient descent)
du-an/08-am-thanh/           Dự án 8: Nhận diện âm thanh (Fourier, ảnh phổ, tiếng ồn)
du-an/09-dem-xe/             Dự án 9: Đếm xe trên phố (khung bao, IoU, NMS, theo dõi)
du-an/10-tu-the-ngoi/        Dự án 10: Trợ lý tư thế ngồi học (cây quyết định, Gini)
du-an/11-chu-so/             Dự án 11: Đọc chữ số viết tay (nơ-ron, hàm kích hoạt, lan truyền ngược)
du-an/12-phong-nen/          Dự án 12: Phông nền ảo (phân vùng, bản đồ xác suất, ngưỡng, IoU)
du-an/13-phan-cum/           Dự án 13: Bảng màu thông minh (K-means, khuỷu tay, học không giám sát)
du-an/14-la-cay/             Dự án 14: Bác sĩ lá cây (tích chập, gộp, bản đồ che khuất)
du-an/15-thu-ngu/            Dự án 15: Cử chỉ chuyển động (chuỗi thời gian, cắt đoạn, DTW)
du-an/16-doan-chu/           Dự án 16: Đoán chữ tiếp theo (token, n-gram, nhiệt độ, ảo giác)
du-an/17-cam-xuc/            Dự án 17: Cảm xúc câu nói (vector từ, PPMI + SVD, phép tính vector, định kiến)
du-an/18-me-cung/            Dự án 18: Robot thoát mê cung (học tăng cường, bảng Q, ε, γ)
du-an/19-xe-tu-lai/          Dự án 19: Xe tự lái tiến hóa (cảm biến tia, thuật toán di truyền)
du-an/20-hoi-dap/            Dự án 20: Trợ lý hỏi đáp SGK (TF-IDF, RAG, trích dẫn, ngưỡng liên quan)
du-an/21-doan-con-vat/       Dự án 21 (THCS, lớp 6): Đoán con vật bằng câu hỏi Có/Không (cây quyết định, khóa lưỡng phân)
```
Mỗi dự án có chế độ **mô phỏng** (chạy ở mọi máy, không cần webcam hay micro) và chế độ **thiết bị thật**: camera dùng MediaPipe (Dự án 1–5, 10, 12, 15), camera/video dùng COCO-SSD (Dự án 9), micro (Dự án 8), camera chụp ảnh tự huấn luyện (Dự án 6), tải ảnh của em (Dự án 13), camera hoặc tải ảnh (Dự án 14).

## Thêm dự án mới
Từ Dự án 6, các trang được sinh từ dữ liệu bằng `tools/gen.py` (xem `tools/README.md`).

Sao chép thư mục `du-an/01-squat/` và giữ khung 9 bước: Mồi, Nhiệm vụ, Soi bên trong, Lý thuyết, Tự làm, Phá máy, Ngoài đời, Kiểm tra, Hướng phát triển. Mỗi dự án phải có đủ 4 loại trực quan: sơ đồ luồng động, bàn thí nghiệm, biểu đồ trực tiếp, trải nghiệm thân thể.

## Công nghệ
MediaPipe Tasks Vision (Pose Landmarker) tải từ CDN · Canvas/SVG · HTML/CSS/JS thuần, không cần build.

## Nhánh THCS (lớp 6–9)
20 dự án 21–40 gắn với bài học trên lớp theo Chương trình GDPT 2018, mỗi dự án vừa một tiết 45 phút, có **phiếu học tập in được** (`phieu.html`) và **hướng dẫn giáo viên** (`giao-vien.html`). Trang chủ có bộ chọn lộ trình THCS / nâng cao.

- Đã có: Dự án 21 · Đoán con vật bằng câu hỏi Có/Không (lớp 6).
- Sinh trang: `python3 tools/gen_thcs.py tools/p21.py` rồi `python3 tools/seo.py`.
- Kiểu dáng riêng của nhánh: `assets/thcs.css` (nhân vật dẫn đường Kính, thẻ con vật, trang in).

## SEO sau khi đăng
1. Khi đã có địa chỉ trang (ví dụ `https://ten-cua-ban.github.io/hop-kinh-ai/`), chạy:
   ```bash
   python3 tools/seo.py --base https://ten-cua-ban.github.io/hop-kinh-ai/
   ```
   Lệnh này thêm thẻ `canonical`, `og:url`, đường dẫn tuyệt đối cho ảnh chia sẻ, breadcrumb trong dữ liệu có cấu trúc và tạo `sitemap.xml`. Đẩy thay đổi lên lại.
2. Thêm trang vào [Google Search Console](https://search.google.com/search-console) và gửi `sitemap.xml`. Với trang dạng `ten.github.io/ten-repo/`, file `robots.txt` không nằm ở gốc tên miền nên công cụ tìm kiếm sẽ không đọc; hãy gửi sitemap trực tiếp trong Search Console.

`tools/seo.py` gắn cho mọi trang: mô tả, từ khóa, người biên soạn, ảnh chia sẻ riêng cho từng dự án (`assets/og/`), Open Graph, Twitter Card, biểu tượng, `manifest.webmanifest` và dữ liệu có cấu trúc schema.org (Course, LearningResource, Person). Sau mỗi lần sinh lại trang bằng `tools/gen.py`, hãy chạy lại `python3 tools/seo.py`.

## Biên soạn
Biên soạn: **Phạm Văn Tú**
