COLS = ["Nâu", "Xanh lá", "Vàng", "Đỏ", "Trắng"]
game = "".join(f"<tr><td>{c}</td><td>6</td><td></td><td></td><td></td></tr>" for c in COLS)
CAMO = [92, 35, 70, 15, 88, 60, 45, 81, 20, 74]
camo = "<tr><th>Con</th>" + "".join(f"<td>{i+1}</td>" for i in range(10)) + "</tr><tr><th>Độ lẫn (%)</th>" + "".join(f"<td>{v}</td>" for v in CAMO) + "</tr><tr><th>Bị ăn? (x)</th>" + "".join("<td></td>" for _ in CAMO) + "</tr>"
phieu_body = f'''
  <h2>Phần 1. Trò chơi bọ giấy</h2>
  <p>Cắt 30 "con bọ" giấy, mỗi màu 6 con, rải trên một tấm vải hoặc giấy báo có hoa văn. Một bạn làm "chim" nhặt 15 con trong 10 giây. Mỗi con còn lại "sinh" thêm một con cùng màu (đủ lại 30 con). Lặp lại 3 lượt.</p>
  <table class="tick"><tr><th>Màu bọ</th><th>Ban đầu</th><th>Sau lượt 1</th><th>Sau lượt 2</th><th>Sau lượt 3</th></tr>{game}<tr><td><b>Tổng</b></td><td>30</td><td>30</td><td>30</td><td>30</td></tr></table>
  <p>a) Màu nào tăng nhiều nhất? Tính <b>tần số</b> của màu đó sau lượt 3 (số con màu đó ÷ 30): ……………</p>
  <p>b) Màu nền tấm vải giống màu bọ nào nhất? Em có nhận xét gì?</p>
  <div class="lines"></div>

  <h2>Phần 2. Một thế hệ chọn lọc</h2>
  <p>Một đàn 10 con bọ có độ lẫn như bảng. Chim ăn <b>4 con dễ thấy nhất</b> (độ lẫn thấp nhất). Đánh dấu x vào con bị ăn.</p>
  <table class="tick">{camo}</table>
  <p>a) Độ lẫn trung bình của cả đàn trước khi chim ăn: ………… b) Độ lẫn trung bình của 6 con sống sót: ………… c) Vì sao thế hệ sau có xu hướng ngụy trang tốt hơn?</p>
  <div class="lines"></div>

  <h2 class="page-break">Phần 3. Lai và đột biến</h2>
  <p>Bố có gen màu (R; G; B) = (120; 90; 60), mẹ có (100; 130; 40). Bọ con nhận gen R từ bố, gen G từ mẹ, gen B từ bố. Sau đó gen G bị đột biến tăng thêm 15.</p>
  <table><tr><th></th><th>R</th><th>G</th><th>B</th></tr><tr><td>Con sau khi lai</td><td></td><td></td><td></td></tr><tr><td>Con sau đột biến</td><td></td><td></td><td></td></tr></table>
  <p>Nếu không bao giờ có đột biến, gen G của con cháu đời sau có thể lớn hơn 130 không? Vì sao?</p>
  <div class="lines"></div>

  <h2>Phần 4. Thí nghiệm trên máy</h2>
  <p>Dùng Dự án 36: chọn nền, bấm <b>Thả đàn bọ mới</b>, đặt mức đột biến, bấm <b>Tự chạy 20 thế hệ</b> rồi ghi độ lẫn trung bình.</p>
  <table><tr><th>Nền</th><th>Mức đột biến</th><th>Độ lẫn sau 20 thế hệ</th><th>Nhận xét</th></tr><tr><td></td><td>0</td><td></td><td></td></tr><tr><td></td><td>12</td><td></td><td></td></tr><tr><td></td><td>80</td><td></td><td></td></tr></table>

  <h2>Phần 5. Từ sinh học đến AI</h2>
  <p>Lớp em muốn dùng thuật toán di truyền để xếp <b>lịch trực nhật</b> cả học kì. Trong bài toán này, "cá thể" là gì? "Độ thích nghi" (điểm) của một cá thể nên tính theo tiêu chí nào?</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 9</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút)</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>KHTN 9:</b> gen, di truyền, biến dị, đột biến gen; tiến hóa, chọn lọc tự nhiên.<br><b>Tin học 9:</b> phần mềm mô phỏng; giải quyết vấn đề với sự trợ giúp của máy tính. <b>Toán:</b> tần số, số trung bình.</td></tr>
    <tr><th>Thiết bị</th><td>1 máy tính và máy chiếu (hoặc máy cho từng nhóm). Trò chơi bọ giấy: giấy màu (5 màu, mỗi nhóm 30 mảnh), một tấm vải hoặc giấy báo có hoa văn, đồng hồ bấm giờ.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> giải thích chọn lọc tự nhiên dựa trên biến dị di truyền; vai trò của đột biến trong việc tạo biến dị mới; mô tả vòng lặp của thuật toán di truyền (đánh giá, chọn lọc, lai, đột biến).</li>
    <li><b>Năng lực:</b> làm thí nghiệm mô phỏng, thu thập và so sánh số liệu qua các thế hệ; tính tần số và số trung bình; liên hệ một ý tưởng sinh học với cách máy tính giải bài toán.</li>
    <li><b>Phẩm chất:</b> trung thực khi ghi kết quả; tôn trọng tính đa dạng sinh học.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>8 phút</td><td>Trò chơi bọ giấy 2 lượt (Phần 1). Câu hỏi: màu nào sống sót nhiều hơn, vì sao?</td></tr>
    <tr><td><b>Khám phá</b></td><td>10 phút</td><td>Trên trang: một học sinh lên <b>Em làm chim</b> một thế hệ, cả lớp đọc lời nhận xét của Kính. Bấm <b>Tự chạy 20 thế hệ</b>, quan sát biểu đồ và dải màu. Mở <b>Soi bên trong</b> bước 1 đến 4.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>12 phút</td><td>Học sinh làm <b>Phần 2, 3</b>. Nhóm làm <b>Phần 4</b> trên máy (mỗi nhóm một nền).</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b> và sửa. Xem <b>Soi</b> bước 6; thảo luận <b>Phần 5</b>: máy tính dùng ý tưởng này thế nào.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Chốt: biến dị + chọn lọc + di truyền qua nhiều thế hệ → thích nghi. Không có "màu tốt nhất" mãi mãi.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Con bọ có "cố gắng" đổi màu để giống vỏ cây không?</td><td>Không. Mỗi con giữ nguyên màu cả đời. Cả đàn đổi màu vì con khó thấy để lại nhiều con cháu hơn. Đây là quan niệm sai hay gặp, cần nhấn mạnh.</td></tr>
    <tr><td>Đột biến có lợi hay có hại?</td><td>Phần lớn đột biến trung tính hoặc có hại, nhưng đột biến là nguồn biến dị mới. Trong mô phỏng, không đột biến thì đàn bọ mắc kẹt; đột biến quá nhiều thì không giữ được cái tốt.</td></tr>
    <tr><td>Vì sao máy tính cần "mô phỏng tiến hóa" thay vì tính thẳng ra đáp án?</td><td>Có những bài toán quá nhiều khả năng để thử hết (như xếp thời khóa biểu). Thuật toán di truyền tìm được lời giải đủ tốt mà không phải thử tất cả.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> kết quả tùy nhóm; thường màu gần màu nền tăng lên. Tần số = số con ÷ 30, ví dụ 12 ÷ 30 = 0,4.</p>
  <p><b>Phần 2:</b> bị ăn các con 4, 9, 2, 7 (độ lẫn 15, 20, 35, 45). a) Trung bình cả đàn = 580 ÷ 10 = <b>58%</b>. b) Sáu con sống: 92, 70, 88, 60, 81, 74 → 465 ÷ 6 = <b>77,5%</b>. c) Con sống sót truyền gen ngụy trang tốt cho con cháu.</p>
  <p><b>Phần 3:</b> sau khi lai (120; 130; 60); sau đột biến (120; 145; 60). Không đột biến thì gen G của con cháu chỉ lấy giá trị đã có trong đàn (90 hoặc 130), không thể lớn hơn 130.</p>
  <p><b>Phần 4:</b> (tham khảo, dao động tùy lần chạy) đột biến 0: thường dừng ở khoảng 55–85% tùy màu đàn ban đầu; đột biến 12: thường từ 85% trở lên; đột biến 80: khoảng 55–65%.</p>
  <p><b>Phần 5:</b> cá thể là một bảng lịch trực nhật đầy đủ. Độ thích nghi: mỗi bạn trực số buổi gần bằng nhau, không trùng lịch học thêm, không trực hai buổi liền nhau… lịch càng ít vi phạm điểm càng cao.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Mô phỏng đơn giản hóa: màu do 3 "gen" có giá trị số, con nhận mỗi gen từ bố hoặc mẹ. Thực tế di truyền theo quy luật Mendel (alen trội, lặn), và màu thường do nhiều gen. Nên nói rõ với học sinh để tránh hiểu sai.</li>
    <li>Trong mô phỏng, cá thể sống sót cũng ở lại thế hệ sau cùng con của chúng.</li>
    <li>Ví dụ thật: bướm sâu đo bạch dương (<i>Biston betularia</i>) ở Anh thời công nghiệp hóa.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> làm Phần 1, 2; giáo viên chạy máy trên màn chiếu.</li>
    <li><b>Học sinh khá, giỏi:</b> thử tắt "Chim tinh mắt" và giải thích vì sao tiến hóa chậm hơn; dự đoán ảnh hưởng của số bọ bị ăn mỗi thế hệ.</li>
    <li><b>Không có máy tính:</b> trò chơi bọ giấy 5–6 lượt, thêm "đột biến": mỗi lượt đổi một con sang màu pha trộn bằng bút màu.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 19 (Xe tự lái tiến hóa) dùng thuật toán tiến hóa để xe tự học cách lái.</p>
'''

DOC = dict(num="36", folder="36-bo-canh-cung", grade="9",
  phieu=dict(title="Phiếu học tập Dự án 36: Bọ cánh cứng ngụy trang", h1="Phiếu học tập: Bọ cánh cứng ngụy trang",
             lead="Dùng kèm Dự án 36: trò chơi bọ giấy, tính độ lẫn sau chọn lọc, lai và đột biến, thuật toán di truyền.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 36: Chọn lọc tự nhiên và thuật toán di truyền (lớp 9)", h1="Dự án 36: Bọ cánh cứng ngụy trang",
             lead="Một tiết học 45 phút giúp học sinh lớp 9 quan sát chọn lọc tự nhiên qua mô phỏng và hiểu thuật toán di truyền mượn ý tưởng đó như thế nào.", body=gv_body)})
