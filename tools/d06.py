PTS = [("A", "Hình tròn", "0,95", 0), ("B", "Hình tròn", "0,90", 1), ("C", "Hình tròn", "0,88", 0), ("D", "Hình vuông", "0,80", 4), ("E", "Hình vuông", "0,76", 4), ("F", "Hình vuông", "0,80", 3), ("G", "Tam giác", "0,60", 3), ("H", "Tam giác", "0,62", 3), ("I", "Tam giác", "0,58", 2)]
rows = "".join(f"<tr><td><b>{a}</b></td><td>{b}</td><td>{c}</td><td>{d}</td></tr>" for a, b, c, d in PTS)
grid = '<div class="pix-grid" style="grid-template-columns:repeat(11,auto)">' + "".join("<span></span>" for _ in range(55)) + "</div>"

phieu_body = f'''
  <h2>Phần 1. Đo độ tròn</h2>
  <p>Độ tròn = 4 × 3,14 × diện tích ÷ (chu vi × chu vi). Tính độ tròn (làm tròn 2 chữ số thập phân).</p>
  <table><tr><th>Hình</th><th>Diện tích</th><th>Chu vi</th><th>Độ tròn</th></tr>
    <tr><td>Hình vuông cạnh 4 cm</td><td></td><td></td><td></td></tr>
    <tr><td>Hình tròn bán kính 2 cm</td><td></td><td></td><td></td></tr>
    <tr><td>Tam giác đều cạnh 6 cm (diện tích ≈ 15,59 cm²)</td><td>15,59</td><td></td><td></td></tr>
    <tr><td>Hình chữ nhật 2 cm × 8 cm</td><td></td><td></td><td></td></tr></table>
  <p>Hình nào "tròn" nhất? Hình chữ nhật dài có độ tròn lớn hay nhỏ? ……………………………………………</p>

  <h2>Phần 2. Chấm mẫu lên mặt phẳng đặc trưng</h2>
  <p>Mỗi mẫu có hai đặc trưng. Chấm 9 mẫu lên lưới: trục ngang là độ tròn từ 0,50 (cột đầu) đến 1,00 (cột cuối), mỗi ô 0,05; trục dọc là số góc nhọn từ 0 (hàng dưới cùng) đến 4 (hàng trên cùng). Ghi chữ cái cạnh mỗi chấm.</p>
  <table><tr><th>Mẫu</th><th>Tên</th><th>Độ tròn</th><th>Số góc nhọn</th></tr>{rows}</table>
  {grid}

  <h2 class="page-break">Phần 3. Hỏi hàng xóm</h2>
  <p>Hai hình mới: <b>X</b> có độ tròn 0,74 và 3 góc nhọn; <b>Y</b> có độ tròn 0,66 và 3 góc nhọn. Chấm X, Y lên lưới rồi dùng thước đo xem mẫu nào gần nhất.</p>
  <table><tr><th>Hình mới</th><th>3 mẫu gần nhất</th><th>Đoán với k = 1</th><th>Đoán với k = 3</th></tr><tr><td><b>X</b></td><td></td><td></td><td></td></tr><tr><td><b>Y</b></td><td></td><td></td><td></td></tr></table>

  <h2>Phần 4. Dữ liệu xấu</h2>
  <p>a) Nếu mẫu E bị ghi nhầm là "Tam giác", kết quả đoán X với k = 1 thay đổi thế nào? Với k = 3 thì sao?</p>
  <div class="lines"></div><div class="lines"></div>
  <p>b) Bạn Minh đề nghị đo hình bằng <b>chiều rộng</b> và <b>chiều cao</b>. Em có đồng ý không? Vì sao?</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 7 (dùng được cho lớp 8 khi học mặt phẳng tọa độ)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Toán 7:</b> hình học trực quan (các hình quen thuộc, chu vi, diện tích); thu thập, phân loại dữ liệu.<br><b>Tin học 7:</b> giải quyết vấn đề với sự trợ giúp của máy tính.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Tốt nhất: 1 máy tính hoặc máy tính bảng cho mỗi nhóm 2–3 học sinh (vẽ bằng ngón tay rất thuận tiện). Phiếu học tập, thước kẻ, máy tính cầm tay.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> nêu được đặc trưng là các số đo mô tả một đối tượng; mô tả được thuật toán k hàng xóm gần nhất (đo khoảng cách, chọn k mẫu gần nhất, bỏ phiếu).</li>
    <li><b>Năng lực:</b> tính độ tròn từ chu vi, diện tích; biểu diễn dữ liệu bằng điểm trên lưới; giải thích ảnh hưởng của nhãn sai, đặc trưng kém và hình lạ.</li>
    <li><b>Phẩm chất:</b> cẩn thận khi ghi nhãn dữ liệu; hợp tác khi xây bộ mẫu chung.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Một học sinh vẽ hình trên máy chiếu, máy đoán. Hỏi: <i>"Máy không có mắt, cũng không ai viết luật 'tròn là thế này'. Vậy nó dựa vào đâu?"</i></td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Học sinh làm <b>Phần 1</b> (tính độ tròn). Mở <b>Soi bên trong</b> bước 1 đến 3: hình biến thành hai con số, rồi thành một chấm.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>15 phút</td><td>Học sinh làm <b>Phần 2, 3</b>: chấm mẫu, đo khoảng cách bằng thước. Trên máy, các nhóm vẽ thử, kéo thanh <b>k</b>, thêm mẫu của mình và theo dõi số hình kiểm tra đoán đúng. Xem <b>Soi</b> bước 4 đến 6.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>10 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>, thảo luận vì sao máy sai. Học sinh làm <b>Phần 4</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại 3 thẻ kiến thức. Giao thử thách một sao: hàng xóm gần nhất với lá cây.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Vì sao độ tròn không phụ thuộc hình to hay nhỏ?</td><td>Phóng to hình k lần thì diện tích tăng k² lần, chu vi bình phương cũng tăng k² lần, nên tỉ số giữ nguyên. Đặc trưng như vậy rất tốt cho máy.</td></tr>
    <tr><td>k lớn quá có tốt không?</td><td>Không hẳn. k quá lớn thì cả các mẫu ở xa (khác loại) cũng được bỏ phiếu; xem biểu đồ: số hình đúng giảm khi k tới 13, 15.</td></tr>
    <tr><td>Máy có "hiểu" hình tam giác không?</td><td>Không. Máy chỉ so con số với các ví dụ đã nhớ. Đó là lý do dữ liệu (nhãn đúng, đủ loại) quan trọng như vậy.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> hình vuông: S = 16, P = 16, độ tròn ≈ 0,79. Hình tròn: S ≈ 12,56, P ≈ 12,56, độ tròn ≈ 1,00. Tam giác đều: P = 18, độ tròn ≈ 0,60. Hình chữ nhật 2 × 8: S = 16, P = 20, độ tròn ≈ 0,50. Hình tròn tròn nhất; hình càng dài, càng nhiều gai thì độ tròn càng nhỏ.</p>
  <p><b>Phần 3:</b> tính theo ô lưới (ngang mỗi ô 0,05; dọc mỗi ô 1 góc). X ở (0,74; 3): gần nhất E, F, D → k = 1: hình vuông (E); k = 3: hình vuông. Y ở (0,66; 3): gần nhất H, G, rồi I → k = 1: tam giác (H); k = 3: tam giác (3 phiếu).</p>
  <p><b>Phần 4:</b> a) k = 1: X bị đoán là tam giác (theo nhãn sai của E); k = 3: E (tam giác) bị F, D (vuông) thắng phiếu, X vẫn là hình vuông. b) Không nên: hình tròn và hình vuông cùng cỡ có chiều rộng, chiều cao như nhau; kích thước phụ thuộc vẽ to hay nhỏ chứ không phụ thuộc loại hình.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>"Số góc nhọn" trên trang là chỗ nét vẽ đổi hướng đột ngột (khoảng 55 độ trở lên), không phải góc nhọn theo nghĩa hình học (nhỏ hơn 90 độ). Nên nói rõ để tránh nhầm với bài học về góc.</li>
    <li>Khoảng cách trên mặt phẳng đặc trưng được tính sau khi đưa hai trục về cùng thang 0–1; đây là cầu nối sang Dự án 12 (lớp 8) về khoảng cách và Pythagore.</li>
    <li>Vẽ trên máy tính bảng bằng ngón tay giúp học sinh vẽ một nét liền dễ hơn chuột.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> chỉ dùng một đặc trưng (độ tròn) trên trục số, hỏi 1 hàng xóm.</li>
    <li><b>Học sinh khá, giỏi:</b> đề xuất một đặc trưng thứ ba (ví dụ độ dài cạnh dài nhất ÷ chu vi) để tách tam giác và hình vuông tốt hơn.</li>
    <li><b>Không có máy tính:</b> cắt hình bằng giấy bìa, đo bằng thước, cả lớp góp mẫu lên một tờ giấy kẻ ô lớn dán bảng.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 22 (Oẳn tù tì) cho thấy máy học từ ví dụ với các đặc trưng là tọa độ 21 điểm trên bàn tay.</p>
'''

DOC = dict(num="6", folder="06-doan-hinh", grade="7",
  phieu=dict(title="Phiếu học tập Dự án 6: Đoán hình bằng hàng xóm gần nhất", h1="Phiếu học tập: Đoán hình bằng hàng xóm gần nhất",
             lead="Dùng kèm Dự án 6 hoặc làm riêng trên lớp: tính độ tròn, chấm mẫu lên mặt phẳng đặc trưng, hỏi hàng xóm bằng thước.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 6: Đặc trưng và hàng xóm gần nhất (lớp 7)", h1="Dự án 6: Đoán hình em vẽ",
             lead="Một tiết học 45 phút giúp học sinh lớp 7 hiểu máy học từ ví dụ: đo hình bằng đặc trưng, đặt thành điểm, hỏi k hàng xóm gần nhất và bỏ phiếu.", body=gv_body)})
