# Hộp Kính AI

Website giúp học sinh **tự học trí tuệ nhân tạo qua 40 dự án trực quan**. AI chạy ngay trên trình duyệt: không cần cài đặt, ảnh của học sinh không rời khỏi máy.

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
index.html                  Trang chủ và bản đồ 40 dự án (THCS và nâng cao)
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
du-an/22-may-nhin-anh/       Dự án 22 (THCS, lớp 6): Máy nhìn ảnh như thế nào? (điểm ảnh, ảnh là bảng số, RGB, so khớp mẫu)
du-an/23-xuc-xac/            Dự án 23 (THCS, lớp 6): Thám tử tìm xúc xắc gian lận (tần số, xác suất thực nghiệm)
du-an/24-robot-hoc/          Dự án 24 (THCS, lớp 6): Robot làm theo lệnh và robot tự học (thuật toán, thử và ghi nhớ)
du-an/25-la-chan/            Dự án 25 (THCS, lớp 6): Lá chắn tin nhắn lừa đảo (từ khóa có điểm, ngưỡng, học từ ví dụ)
du-an/26-doan-hinh/          Dự án 26 (THCS, lớp 7): Đoán hình em vẽ (đặc trưng, k hàng xóm gần nhất)
du-an/27-tham-tu-du-lieu/    Dự án 27 (THCS, lớp 7): Thám tử dữ liệu lớp học (tổng thể, mẫu, mẫu bị lệch)
du-an/28-nghe-not-nhac/      Dự án 28 (THCS, lớp 7): Máy nghe nốt nhạc (tần số, biên độ; micro không bắt buộc)
du-an/29-robot-giao-thu/     Dự án 29 (THCS, lớp 7): Robot giao thư (tìm kiếm tuần tự, tìm kiếm nhị phân)
du-an/30-toc-do-chay/        Dự án 30 (THCS, lớp 7): Máy chấm tốc độ chạy (theo dõi vật, đồ thị quãng đường – thời gian; camera không bắt buộc)
du-an/31-cay-dau/             Dự án 31 (THCS, lớp 8): Đường thẳng dự đoán cây đậu lớn (hàm bậc nhất, sai số, quá khớp)
du-an/32-trai-cay/            Dự án 32 (THCS, lớp 8): Phân loại trái cây (mặt phẳng tọa độ, khoảng cách Pythagore, chuẩn hóa)
du-an/33-no-ron/              Dự án 33 (THCS, lớp 8): Nơ-ron đầu tiên (trọng số, ngưỡng, học từ lỗi, XOR)
du-an/34-giay-quy/            Dự án 34 (THCS, lớp 8): Giấy chỉ thị thông minh (thang pH, màu RGB, cân bằng trắng; camera không bắt buộc)
du-an/35-chatbot/             Dự án 35 (THCS, lớp 8): Tự làm chatbot theo luật (chuẩn hóa câu, từ khóa, chọn luật)
du-an/36-bo-canh-cung/        Dự án 36 (THCS, lớp 9): Bọ cánh cứng ngụy trang (gen, đột biến, chọn lọc tự nhiên, thuật toán di truyền)
du-an/37-may-dich/            Dự án 37 (THCS, lớp 9): Máy dịch ngây ngô (từ nhiều nghĩa, ngữ cảnh, thành ngữ, trật tự từ)
du-an/38-hoc-bong/            Dự án 38 (THCS, lớp 9): Ai được nhận học bổng? (tần số tương đối, thiên kiến, thông tin đại diện)
du-an/39-anh-that/            Dự án 39 (THCS, lớp 9): Ảnh thật hay ảnh ghép? (hạt nhiễu, bóng đổ, máy dò, kiểm tra nguồn)
du-an/40-tro-ly-lop/          Dự án 40 (THCS, lớp 9): Trợ lý lớp học của em (dự án tổng kết: ghép khối, riêng tư, tự đánh giá)
```
Mỗi dự án có chế độ **mô phỏng** (chạy ở mọi máy, không cần webcam hay micro) và chế độ **thiết bị thật**: camera dùng MediaPipe (Dự án 1–5, 10, 12, 15), camera/video dùng COCO-SSD (Dự án 9), micro (Dự án 8), camera chụp ảnh tự huấn luyện (Dự án 6), tải ảnh của em (Dự án 13), camera hoặc tải ảnh (Dự án 14).

## Thêm dự án mới
Từ Dự án 6, các trang được sinh từ dữ liệu bằng `tools/gen.py` (xem `tools/README.md`).

Sao chép thư mục `du-an/01-squat/` và giữ khung 9 bước: Mồi, Nhiệm vụ, Soi bên trong, Lý thuyết, Tự làm, Phá máy, Ngoài đời, Kiểm tra, Hướng phát triển. Mỗi dự án phải có đủ 4 loại trực quan: sơ đồ luồng động, bàn thí nghiệm, biểu đồ trực tiếp, trải nghiệm thân thể.

## Công nghệ
MediaPipe Tasks Vision (Pose Landmarker) tải từ CDN · Canvas/SVG · HTML/CSS/JS thuần, không cần build.

## Nhánh THCS (lớp 6–9)
20 dự án 21–40 gắn với bài học trên lớp theo Chương trình GDPT 2018, mỗi dự án vừa một tiết 45 phút, có **phiếu học tập in được** (`phieu.html`) và **hướng dẫn giáo viên** (`giao-vien.html`). Trang chủ có bộ chọn lộ trình THCS / nâng cao.

- Đã có đủ khối lớp 6: Dự án 21 (đoán con vật), 22 (máy nhìn ảnh), 23 (xúc xắc gian lận), 24 (robot làm theo lệnh và tự học), 25 (lá chắn tin nhắn lừa đảo).
- Đã có đủ khối lớp 7: Dự án 26 (đoán hình em vẽ), 27 (thám tử dữ liệu), 28 (máy nghe nốt nhạc), 29 (robot giao thư), 30 (máy chấm tốc độ chạy).
- Đã có đủ khối lớp 8: Dự án 31 (cây đậu), 32 (trái cây), 33 (nơ-ron), 34 (giấy chỉ thị pH), 35 (chatbot theo luật).
- Đã có đủ khối lớp 9: Dự án 36 (bọ cánh cứng), 37 (máy dịch), 38 (học bổng), 39 (ảnh thật hay ghép), 40 (trợ lý lớp học). Nhánh THCS hoàn chỉnh 20 dự án.
- Sinh trang dự án: `python3 tools/gen_thcs.py tools/p22.py`; sinh phiếu học tập và hướng dẫn giáo viên: `python3 tools/gen_doc.py tools/d22.py`; sau đó chạy `python3 tools/seo.py`.
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
