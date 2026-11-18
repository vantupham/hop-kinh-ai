rows = "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td><td></td><td></td><td></td></tr>" for a in (0, 1) for b in (0, 1) for c in (0, 1))
phieu_body = f'''
  <h2>Phần 1. Tính như một nơ-ron</h2>
  <p>Nơ-ron có trọng số w₁ = 1 (trời nắng), w₂ = 1 (có bạn), w₃ = 2 (làm xong bài), ngưỡng θ = 3. Hoàn thành bảng: tổng = 1·x₁ + 1·x₂ + 2·x₃; trả lời 1 nếu tổng ≥ 3.</p>
  <table><tr><th>Nắng x₁</th><th>Bạn x₂</th><th>Bài x₃</th><th>Tổng</th><th>Nơ-ron (0/1)</th><th>Quy tắc của mẹ</th></tr>{rows}</table>
  <p class="small muted">Quy tắc của mẹ: được đi chơi khi đã làm xong bài VÀ (trời nắng HOẶC có bạn). Nơ-ron có khớp hết với quy tắc của mẹ không?</p>

  <h2 class="page-break">Phần 2. Tìm trọng số cho phép logic</h2>
  <p>Nơ-ron hai đầu vào x₁, x₂. Tìm w₁, w₂, θ để nơ-ron làm đúng mỗi phép:</p>
  <table><tr><th>Phép</th><th>w₁</th><th>w₂</th><th>θ</th><th>Kiểm tra 4 trường hợp</th></tr>
    <tr><td>VÀ (cả hai đều 1)</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>HOẶC (ít nhất một bằng 1)</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>KHÔNG x₁ (chỉ dùng x₁)</td><td></td><td>0</td><td></td><td></td></tr></table>

  <h2>Phần 3. Tự học một bước</h2>
  <p>Nơ-ron đang có w = (0,5; 0,5; 0,5), θ = 2. Gặp dòng (1; 0; 1), đúng ra phải là 1. Nơ-ron trả lời ……… Theo quy tắc tự học (mỗi lần chỉnh 0,5), trọng số và ngưỡng mới là: w = (……; ……; ……), θ = ………</p>

  <h2>Phần 4. Bài toán không có lời giải</h2>
  <p>Vẽ 4 điểm (0;0), (1;0), (0;1), (1;1) lên giấy. Tô xanh các điểm "đi chơi" theo phép <b>chỉ một trong hai</b>, tô đỏ các điểm còn lại. Em có vẽ được <b>một đường thẳng</b> tách xanh và đỏ không? Cần ít nhất mấy đường?</p>
  <div class="tree-box" style="height:200px"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 8 (học sau phần biểu thức logic và cấu trúc rẽ nhánh)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách lập trình ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Tin học 8:</b> biểu thức logic (VÀ, HOẶC, KHÔNG), cấu trúc rẽ nhánh, lập trình trực quan hoặc Python.<br><b>Toán 8:</b> giá trị của biểu thức; đường thẳng trên mặt phẳng tọa độ.<br><b>KHTN 8:</b> hệ thần kinh (liên hệ nơ-ron sinh học).</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Tốt nhất: 1 máy cho mỗi nhóm 2–3 học sinh. Không cần camera.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> mô tả nơ-ron nhân tạo gồm đầu vào, trọng số, tổng, ngưỡng; biểu diễn phép VÀ, HOẶC bằng nơ-ron; mô tả quy tắc tự học sửa sai.</li>
    <li><b>Năng lực:</b> tính đầu ra của nơ-ron; tìm trọng số cho một quy tắc; giải thích vì sao một nơ-ron không học được XOR và cần mạng nhiều lớp.</li>
    <li><b>Phẩm chất:</b> kiên trì thử và điều chỉnh; tôn trọng dữ liệu thống nhất, nhất quán.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Hỏi: <i>"Chiều thứ bảy em quyết định có đi chơi không dựa vào những gì? Điều gì quan trọng nhất?"</i> Ghi ba điều lên bảng, cho lớp chấm "mức quan trọng".</td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Giới thiệu sơ đồ nơ-ron trên máy chiếu; mở <b>Soi bên trong</b> bước 1 đến 4. Học sinh làm <b>Phần 1</b> của phiếu.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Các nhóm thi chỉnh tay trọng số cho quy tắc VÀ, HOẶC, của mẹ (tới khi đúng 8/8). Bấm <b>Cho nơ-ron tự học</b>, xem <b>Soi</b> bước 5. Học sinh làm <b>Phần 2, 3</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>. Với "Chỉ một trong hai", cho học sinh làm <b>Phần 4</b> trước rồi mới bật <b>mạng 2 lớp</b>. Xem <b>Soi</b> bước 6.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại: nhân, cộng, so ngưỡng; học là sửa sai; một nơ-ron chỉ vẽ một đường thẳng. Giao thử thách lập trình.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Trọng số âm có ý nghĩa gì?</td><td>Điều đó làm giảm khả năng trả lời 1, ví dụ "trời mưa" sẽ có trọng số âm với quyết định đi chơi.</td></tr>
    <tr><td>Có nhiều bộ trọng số cùng đúng không?</td><td>Có. Ví dụ phép VÀ: (1; 1; θ = 2) hay (2; 2; θ = 3) đều đúng. Máy tự học dừng ở một bộ đúng bất kỳ.</td></tr>
    <tr><td>Mạng nơ-ron trong AI thật khác gì nơ-ron này?</td><td>Cùng nguyên tắc nhân, cộng; nhưng có hàng triệu tới hàng tỉ nơ-ron, nhiều lớp, đầu vào là số thực, và ngưỡng được làm "mềm" để học dễ hơn.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> tổng theo thứ tự các dòng (000 đến 111): 0, 2, 1, 3, 1, 3, 2, 4. Nơ-ron: 0, 0, 0, 1, 0, 1, 0, 1. Quy tắc của mẹ: 0, 0, 0, 1, 0, 1, 0, 1. Khớp hết.</p>
  <p><b>Phần 2:</b> VÀ: w = (1; 1), θ = 2. HOẶC: w = (1; 1), θ = 1. KHÔNG x₁: w₁ = −1, θ = 0 (x₁ = 0 → tổng 0 ≥ 0 → 1; x₁ = 1 → tổng −1 → 0). Chấp nhận các đáp án đúng khác.</p>
  <p><b>Phần 3:</b> tổng = 0,5 + 0 + 0,5 = 1 &lt; 2 → trả lời 0 (sai). Chỉnh: w = (1; 0,5; 1), θ = 1,5.</p>
  <p><b>Phần 4:</b> (1;0) và (0;1) xanh; (0;0) và (1;1) đỏ. Không vẽ được một đường thẳng; cần ít nhất hai đường (tương ứng hai nơ-ron ẩn).</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Nơ-ron trên trang là "perceptron" (Rosenblatt, 1958). Quy tắc tự học: w ← w + 0,5 × (đúng − trả lời) × x; θ ← θ − 0,5 × (đúng − trả lời).</li>
    <li>Bài XOR từng được dùng để chỉ ra giới hạn của một nơ-ron; mạng nhiều lớp giải quyết được nó.</li>
    <li>Ở sự cố "Dữ liệu mâu thuẫn", bảng có 9 dòng (thêm dòng của bố), nên kết quả hiển thị trên 9.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> chỉ dùng hai đầu vào, làm phép VÀ, HOẶC.</li>
    <li><b>Học sinh khá, giỏi:</b> viết chương trình nơ-ron tự học bằng Python hoặc Scratch; tự tìm trọng số cho mạng 2 lớp làm XOR.</li>
    <li><b>Không có máy tính:</b> "nơ-ron người": ba bạn giơ thẻ 0/1, một bạn nhân và cộng theo trọng số ghi trên bảng, một bạn so ngưỡng và hô "đi" hoặc "ở nhà".</li>
  </ul>
  <p class="muted small">Học lên: Dự án 11 (Chữ số viết tay) cho thấy mạng nhiều lớp với hàng nghìn trọng số nhận dạng chữ số.</p>
'''

DOC = dict(num="33", folder="33-no-ron", grade="8",
  phieu=dict(title="Phiếu học tập Dự án 33: Nơ-ron đầu tiên", h1="Phiếu học tập: Nơ-ron đầu tiên, có nên đi chơi?",
             lead="Dùng kèm Dự án 33 hoặc làm riêng trên lớp: tính đầu ra của nơ-ron, tìm trọng số cho phép VÀ, HOẶC, KHÔNG, thử một bước tự học và bài toán XOR.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 33: Nơ-ron nhân tạo và biểu thức logic (lớp 8)", h1="Dự án 33: Nơ-ron đầu tiên, có nên đi chơi?",
             lead="Một tiết học 45 phút giúp học sinh lớp 8 hiểu nơ-ron nhân tạo (trọng số, tổng, ngưỡng), liên hệ với biểu thức logic và thấy giới hạn của một nơ-ron.", body=gv_body)})
