A = [101, 103, 104, 106, 109, 110, 112, 115, 117, 118, 121, 123, 126, 127, 130, 132]
B = [118, 103, 130, 109, 126, 101, 115, 121, 106, 132, 110, 127, 104, 123, 112, 117]
def row(arr):
    return "<tr><th>Cửa</th>" + "".join(f"<td>{i+1}</td>" for i in range(len(arr))) + "</tr><tr><th>Phòng</th>" + "".join(f"<td><b>{v}</b></td>" for v in arr) + "</tr>"

phieu_body = f'''
  <h2>Phần 1. Hành lang lộn xộn</h2>
  <p>Hành lang 16 phòng, số phòng gắn lộn xộn:</p>
  <table class="tick">{row(B)}</table>
  <p>a) Dùng <b>tìm kiếm tuần tự</b> để tìm phòng <b>123</b>. Phải xem bao nhiêu cửa? ……… b) Tìm phòng <b>120</b>: phải xem bao nhiêu cửa mới biết chắc là không có? ………</p>

  <h2>Phần 2. Hành lang đã xếp</h2>
  <p>Hành lang khác, số phòng xếp tăng dần:</p>
  <table class="tick">{row(A)}</table>
  <p>Dùng <b>tìm kiếm nhị phân</b> để tìm phòng <b>126</b>. Mỗi bước ghi khoảng còn lại, cửa ở giữa (lấy phần nguyên của (đầu + cuối) ÷ 2) và số phòng của cửa đó.</p>
  <table><tr><th>Bước</th><th>Khoảng (cửa đầu – cửa cuối)</th><th>Cửa giữa</th><th>Số phòng</th><th>Lớn hơn / nhỏ hơn / bằng 126?</th></tr>
    <tr><td>1</td><td>1 – 16</td><td></td><td></td><td></td></tr><tr><td>2</td><td></td><td></td><td></td><td></td></tr><tr><td>3</td><td></td><td></td><td></td><td></td></tr><tr><td>4</td><td></td><td></td><td></td><td></td></tr></table>

  <h2 class="page-break">Phần 3. Chia đôi bao nhiêu lần?</h2>
  <table><tr><th>Số phòng</th><th>8</th><th>16</th><th>32</th><th>64</th><th>1000</th></tr>
    <tr><td>Tìm tuần tự, xấu nhất</td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Tìm nhị phân, xấu nhất</td><td></td><td></td><td></td><td></td><td></td></tr></table>
  <p>Gợi ý: tìm nhị phân xấu nhất = số lần chia đôi cho tới khi còn 1 phòng, cộng thêm 1.</p>

  <h2>Phần 4. Viết thuật toán</h2>
  <p>Điền vào chỗ trống để hoàn thành thuật toán tìm kiếm nhị phân:</p>
  <ol>
    <li>Đặt <b>đầu</b> = cửa 1, <b>cuối</b> = cửa cuối cùng.</li>
    <li>Trong khi <b>đầu</b> ≤ <b>cuối</b>: lấy <b>giữa</b> = (đầu + cuối) ÷ 2, bỏ phần dư.</li>
    <li>Nếu số phòng ở cửa giữa bằng số cần tìm thì ………………………………</li>
    <li>Nếu số phòng ở cửa giữa nhỏ hơn số cần tìm thì đặt <b>đầu</b> = ………………</li>
    <li>Ngược lại, đặt <b>cuối</b> = ………………</li>
    <li>Hết vòng lặp mà chưa thấy thì báo ………………………………</li>
  </ol>
  <p>Nếu ở bước 4 viết nhầm "<b>đầu</b> = giữa", chuyện gì có thể xảy ra?</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 7 (học cùng chủ đề thuật toán tìm kiếm)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Tin học 7:</b> chủ đề Giải quyết vấn đề với sự trợ giúp của máy tính: thuật toán tìm kiếm tuần tự, thuật toán tìm kiếm nhị phân; điều kiện áp dụng; so sánh số bước.<br><b>Toán 7:</b> lũy thừa của 2, so sánh số.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Tốt nhất: 1 máy cho mỗi nhóm 2–3 học sinh. Có thể chuẩn bị 16 tờ giấy úp, mỗi tờ ghi một số phòng, để chơi trực tiếp.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> mô tả được thuật toán tìm kiếm tuần tự và tìm kiếm nhị phân; nêu được điều kiện của tìm nhị phân (dãy đã sắp xếp).</li>
    <li><b>Năng lực:</b> thực hiện từng bước hai thuật toán trên dãy số cụ thể; so sánh số bước khi dữ liệu lớn dần; phát hiện lỗi trong mô tả thuật toán.</li>
    <li><b>Phẩm chất:</b> cẩn thận, chính xác khi viết thuật toán; kiên trì tìm lỗi.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Một học sinh lên máy chiếu, chế độ <b>Em tự tìm</b>, tìm phòng trên lá thư. Cả lớp đếm số cửa bạn mở. Hỏi: <i>"Có cách nào chắc chắn tìm được với ít lần mở nhất?"</i></td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Chạy <b>Robot tìm tuần tự</b> rồi <b>Robot tìm nhị phân</b> với cùng lá thư. Mở <b>Soi bên trong</b> bước 1 đến 4. Học sinh làm <b>Phần 1, 2</b>.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Các nhóm kéo thanh số phòng từ 8 lên 1000, chạy hai robot, quan sát biểu đồ. Xem <b>Soi</b> bước 5, 6. Học sinh làm <b>Phần 3</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>. Học sinh làm <b>Phần 4</b>, đặc biệt câu hỏi về lỗi "đầu = giữa".</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại: tuần tự luôn đúng nhưng chậm; nhị phân rất nhanh nhưng cần dãy đã sắp xếp và phải viết đúng từng chi tiết. Giao trò đoán số ở nhà.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Nếu dãy chưa sắp xếp, có nên sắp xếp rồi mới tìm nhị phân?</td><td>Nếu chỉ tìm một lần thì sắp xếp tốn công hơn tìm tuần tự. Nếu tìm rất nhiều lần (như máy tìm kiếm) thì sắp xếp một lần rồi tìm nhị phân nhiều lần sẽ lợi hơn hẳn.</td></tr>
    <tr><td>Tìm tuần tự có lúc nhanh hơn tìm nhị phân không?</td><td>Có, khi giá trị cần tìm nằm ngay đầu dãy. Ta so sánh thuật toán bằng trường hợp <b>xấu nhất</b> hoặc trung bình.</td></tr>
    <tr><td>Việc tìm kiếm liên quan gì tới AI?</td><td>Nhiều hệ thống AI phải tìm trong rất nhiều khả năng (nước cờ, đường đi, tài liệu). Tìm kiếm nhanh và chuẩn bị dữ liệu tốt là nền tảng của chúng.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> a) phòng 123 ở cửa 14: xem <b>14</b> cửa. b) phòng 120 không có: phải xem cả <b>16</b> cửa mới biết chắc.</p>
  <p><b>Phần 2:</b> bước 1: khoảng 1–16, giữa = 8, phòng 115 &lt; 126 → đầu = 9. Bước 2: khoảng 9–16, giữa = 12, phòng 123 &lt; 126 → đầu = 13. Bước 3: khoảng 13–16, giữa = 14, phòng 127 &gt; 126 → cuối = 13. Bước 4: khoảng 13–13, giữa = 13, phòng 126: <b>tìm thấy</b> sau 4 bước.</p>
  <p><b>Phần 3:</b> tuần tự: 8, 16, 32, 64, 1000. Nhị phân: 4, 5, 6, 7, 10.</p>
  <p><b>Phần 4:</b> 3. dừng lại, báo tìm thấy ở cửa giữa; 4. giữa + 1; 5. giữa − 1; 6. không có phòng cần tìm. Viết "đầu = giữa" thì khi chỉ còn hai cửa, khoảng tìm không nhỏ đi nữa: thuật toán lặp mãi không dừng.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Số phòng trên trang tăng dần nhưng không liên tiếp (có chỗ nhảy 2), để học sinh không tính thẳng ra vị trí mà phải tìm thật.</li>
    <li>Biểu đồ dùng thang chia theo 1, 10, 100, 1000 trên trục dọc để hai đường cùng nhìn rõ; có thể nhắc học sinh đọc kỹ các mốc.</li>
    <li>Khi thực hành trên giấy, quy ước "cửa giữa = phần nguyên của (đầu + cuối) ÷ 2" giống trên trang để đáp án khớp nhau.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> làm với 8 phòng trước, dùng thẻ giấy úp để lật thật.</li>
    <li><b>Học sinh khá, giỏi:</b> giải thích vì sao với 1 triệu phần tử chỉ cần khoảng 20 bước; viết thuật toán bằng sơ đồ khối.</li>
    <li><b>Không có máy tính:</b> 16 bạn đứng thành hàng, mỗi bạn cầm một thẻ số úp; "robot" chỉ được hỏi từng bạn lật thẻ. Thi giữa đội tuần tự và đội nhị phân.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 40 (Hỏi đáp có nguồn) cho thấy máy tìm những đoạn văn liên quan nhất trước khi trả lời câu hỏi.</p>
'''

DOC = dict(num="9", folder="09-robot-giao-thu", grade="7",
  phieu=dict(title="Phiếu học tập Dự án 9: Robot giao thư và thuật toán tìm kiếm", h1="Phiếu học tập: Robot giao thư và thuật toán tìm kiếm",
             lead="Dùng kèm Dự án 9 hoặc làm riêng trên lớp: thực hiện tìm kiếm tuần tự, tìm kiếm nhị phân trên giấy, đếm số bước và tìm lỗi thuật toán.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 9: Tìm kiếm tuần tự và tìm kiếm nhị phân (lớp 7)", h1="Dự án 9: Robot giao thư trong trường",
             lead="Một tiết học 45 phút giúp học sinh lớp 7 thực hiện và so sánh thuật toán tìm kiếm tuần tự, tìm kiếm nhị phân, và hiểu điều kiện dãy đã sắp xếp.", body=gv_body)})
