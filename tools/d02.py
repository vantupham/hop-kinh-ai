ROBOT = ["0000110000", "0000110000", "0111111110", "0100000010", "0101001010", "0100000010", "0101111010", "0100000010", "0111111110", "0011001100"]
X5 = ["10001", "01010", "00100", "01010", "10001"]
DRAW = ["10001", "01010", "00100", "01100", "10000"]

def grid(rows, show=True, on=False):
    h = '<div class="pix-grid" style="grid-template-columns:repeat(%d,auto)">' % len(rows[0])
    for r in rows:
        for c in r:
            h += '<span%s>%s</span>' % (' class="on"' if on and c == "1" else "", c if show else "")
    return h + "</div>"

phieu_body = f'''
  <h2>Phần 1. Tranh theo số</h2>
  <p>Mỗi ô là một điểm ảnh. Số <b>1</b> nghĩa là ô có nét vẽ (tô đen), số <b>0</b> là ô trống. Hãy tô đen mọi ô số 1. Bức tranh là gì?</p>
  {grid(ROBOT)}
  <p>Bức tranh là: ………………………………… · Bức tranh có ……… điểm ảnh, trong đó ……… ô được tô.</p>

  <h2>Phần 2. Biến tranh thành số</h2>
  <p>Vẽ một hình đơn giản của em vào lưới trống 8 × 8 (bên trái), rồi viết <b>1</b> hoặc <b>0</b> vào lưới bên phải. Đổi bảng số với bạn bên cạnh và nhờ bạn tô lại xem có đúng tranh của em không.</p>
  <div style="display:flex;gap:28px;flex-wrap:wrap">{grid(["00000000"] * 8, False)}{grid(["00000000"] * 8, False)}</div>

  <h2 class="page-break">Phần 3. Ba con số tạo nên một màu</h2>
  <p>Mỗi điểm ảnh màu có ba số: đỏ (R), xanh lá (G), xanh dương (B), mỗi số từ 0 đến 255. Đoán màu của từng điểm ảnh.</p>
  <table><tr><th style="width:12%">R</th><th style="width:12%">G</th><th style="width:12%">B</th><th>Màu em đoán</th></tr>
    <tr><td>255</td><td>0</td><td>0</td><td></td></tr><tr><td>0</td><td>0</td><td>0</td><td></td></tr>
    <tr><td>255</td><td>255</td><td>0</td><td></td></tr><tr><td>255</td><td>255</td><td>255</td><td></td></tr>
    <tr><td>128</td><td>128</td><td>128</td><td></td></tr></table>

  <h2>Phần 4. Làm máy so khớp mẫu</h2>
  <p>Bên trái là <b>mẫu chữ X</b> máy đã học, bên phải là chữ X một bạn vừa vẽ. Đếm số ô số 1 <b>trùng nhau</b> ở cùng vị trí.</p>
  <div style="display:flex;gap:28px;flex-wrap:wrap;align-items:center"><div><p class="small"><b>Mẫu</b></p>{grid(X5)}</div><div><p class="small"><b>Hình bạn vẽ</b></p>{grid(DRAW)}</div></div>
  <p>Mẫu có ……… ô số 1. Hình bạn vẽ có ……… ô số 1. Số ô trùng nhau: ……… . Em có nghĩ máy sẽ đoán đây là chữ X không? Vì sao?</p>
  <div class="lines"></div><div class="lines"></div>

  <h2>Phần 5. Vì sao máy nhìn nhầm?</h2>
  <p>a) Nếu ta <b>đảo màu</b> tranh ở Phần 1 (số 1 thành 0, số 0 thành 1), mắt em vẫn nhận ra bức tranh. Vì sao máy lại có thể nhận nhầm?</p>
  <div class="lines"></div><div class="lines"></div>
  <p>b) Bức tranh ở Phần 1 nếu chỉ còn 2 × 2 = 4 ô thì còn nhận ra được không? Độ phân giải cao giúp gì cho máy?</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 6 (dùng được cho lớp 7, 8 khi học về dữ liệu số)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Tin học 6:</b> chủ đề Máy tính và cộng đồng: thông tin và dữ liệu, biểu diễn thông tin, dữ liệu trong máy tính được lưu bằng số.<br><b>Toán 6:</b> đọc bảng số, so sánh, tỉ số phần trăm (độ giống).<br><b>Khoa học tự nhiên 6:</b> ánh sáng và màu sắc (liên hệ ba màu đèn).</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Tốt nhất: 1 máy tính hoặc máy tính bảng cho mỗi nhóm 2–3 học sinh. Không cần camera, không cần cài đặt. Phiếu học tập in sẵn, bút chì đen.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> nêu được ảnh số gồm các điểm ảnh; mỗi điểm ảnh được lưu bằng số (một số độ sáng, hoặc ba số R, G, B); giải thích được máy nhận dạng hình bằng cách so bảng số với các mẫu.</li>
    <li><b>Năng lực:</b> chuyển đổi qua lại giữa hình vẽ và bảng số; giải thích được vì sao độ phân giải thấp, ảnh âm bản hay hình lệch làm máy nhận nhầm.</li>
    <li><b>Phẩm chất:</b> cẩn thận, chính xác khi ghi dữ liệu; hợp tác trong nhóm.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Học sinh làm <b>Phần 1</b> của phiếu (tranh theo số) trong 3 phút. Hỏi: <i>"Bảng số này và bức tranh robot có phải là cùng một thông tin không?"</i></td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Trên máy chiếu, vẽ một hình vào lưới ở mục <b>Chơi</b>, rồi bấm <b>Mắt máy</b>. Mở <b>Soi bên trong</b> bước 1 đến 3. Cho học sinh lên kéo ba thanh <b>R, G, B</b> để pha màu vàng, tím hồng. Học sinh làm <b>Phần 2, 3</b>.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Các nhóm vẽ từng hình và ghi lại máy đoán đúng hay sai, độ giống bao nhiêu. Xem <b>Soi</b> bước 4 đến 6. Học sinh làm <b>Phần 4</b> (đếm ô trùng nhau bằng tay).</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật lần lượt 3 sự cố ở mục <b>Phá máy</b>. Mỗi lần, cả lớp đoán vì sao máy nhầm trước khi mở lời giải. Nhóm thử <b>Dạy máy hình này</b> và xem số hình đoán đúng trên 40 hình vẽ tay thay đổi. Học sinh làm <b>Phần 5</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại 3 thẻ kiến thức. Giao thử thách một sao: tranh theo số 10 × 10 đổi với bạn.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Máy có thật sự "nhìn thấy" hình tròn không?</td><td>Không. Máy chỉ có bảng số và phép so sánh. Nó gọi tên "hình tròn" vì bảng số giống mẫu tròn nhất. Đây là điểm khác cơ bản giữa máy và người.</td></tr>
    <tr><td>Vì sao ảnh âm bản làm máy nhầm nhưng không làm người nhầm?</td><td>Người nhận ra hình dạng, đường viền. Máy so từng con số; đảo màu làm mọi số thay đổi. Sửa bằng cách cho máy biết trước: nếu ảnh quá tối thì đảo lại.</td></tr>
    <tr><td>Vì sao "dạy thêm mẫu" làm máy đoán tốt hơn?</td><td>Mỗi người vẽ một kiểu. Có nhiều mẫu đa dạng thì khả năng có một mẫu gần với cách vẽ mới càng cao. Các hệ thống AI thật học từ hàng nghìn, hàng triệu ảnh.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> hình đầu robot có ăng-ten (bạn Kính). 10 × 10 = <b>100</b> điểm ảnh, <b>40</b> ô được tô.</p>
  <p><b>Phần 2:</b> nhiều đáp án. Kiểm tra: bạn tô lại từ bảng số phải ra đúng tranh.</p>
  <p><b>Phần 3:</b> (255, 0, 0) đỏ · (0, 0, 0) đen · (255, 255, 0) vàng · (255, 255, 255) trắng · (128, 128, 128) xám.</p>
  <p><b>Phần 4:</b> mẫu có 9 ô số 1, hình bạn vẽ có 8 ô số 1, trùng nhau 7 ô. Phần lớn các ô trùng nhau nên máy nhiều khả năng vẫn đoán là chữ X; phần lệch nằm ở góc dưới.</p>
  <p><b>Phần 5:</b> a) máy so từng con số, đảo màu làm toàn bộ số thay đổi nên bảng số không còn giống mẫu. b) Gần như không nhận ra; độ phân giải cao giữ lại nhiều chi tiết (cạnh, góc) giúp máy phân biệt các hình.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Trên máy, ảnh đen trắng thường dùng số 0 cho màu đen và 255 cho màu trắng (1 byte). Trên phiếu, quy ước 1 là ô tô, 0 là ô trống để học sinh dễ làm; nên nói rõ đây là hai cách quy ước khác nhau.</li>
    <li>Cách pha màu R, G, B là <b>pha ánh sáng</b> (màn hình), khác với pha màu vẽ (màu nước). Đỏ + xanh lá ra vàng là đúng với ánh sáng, không đúng với màu nước; học sinh hay thắc mắc chỗ này.</li>
    <li>Máy trong dự án dùng cách so khớp mẫu đơn giản. Các hệ thống nhận dạng ảnh hiện nay (Dự án 34) tự học các bộ lọc tìm cạnh, góc, nên chịu được ảnh lệch, xoay tốt hơn nhiều.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> làm Phần 1 với lưới 6 × 6 trước; dùng thanh trượt R, G, B với từng màu một.</li>
    <li><b>Học sinh khá, giỏi:</b> tính xem một ảnh 1000 × 1000 điểm ảnh màu cần bao nhiêu con số (3 triệu); tìm hình vẽ khiến máy nhầm dù độ phân giải 16 × 16.</li>
    <li><b>Không có máy tính:</b> trò chơi "máy in người": một bạn đọc bảng số theo từng hàng, bạn kia tô vào giấy kẻ ô mà không nhìn tranh gốc; sau đó so khớp hai tranh bằng cách đếm ô trùng.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 34 (Bác sĩ lá cây) cho thấy máy tự học các bộ lọc trên ảnh màu để nhận ra lá bị bệnh.</p>
'''

DOC = dict(num="2", folder="02-may-nhin-anh",
  phieu=dict(title="Phiếu học tập Dự án 2: Máy nhìn ảnh như thế nào?", h1="Phiếu học tập: Máy nhìn ảnh như thế nào?",
             lead="Dùng kèm Dự án 2 hoặc làm riêng trên lớp: tranh theo số, pha màu bằng ba con số, tự làm máy so khớp mẫu.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 2: Điểm ảnh và ảnh là bảng số (lớp 6)", h1="Dự án 2: Máy nhìn ảnh như thế nào?",
             lead="Một tiết học 45 phút giúp học sinh lớp 6 hiểu ảnh số gồm các điểm ảnh, mỗi điểm ảnh là con số, và máy nhận dạng hình bằng cách so bảng số với các mẫu.", body=gv_body)})
