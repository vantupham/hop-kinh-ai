phieu_body = '''
  <h2>Phần 1. Khoảng cách Pythagore</h2>
  <p>Tính khoảng cách giữa hai điểm (làm tròn 2 chữ số thập phân nếu cần).</p>
  <table><tr><th>Điểm thứ nhất</th><th>Điểm thứ hai</th><th>Δx</th><th>Δy</th><th>Khoảng cách</th></tr>
    <tr><td>(0; 0)</td><td>(3; 4)</td><td></td><td></td><td></td></tr>
    <tr><td>(1; 2)</td><td>(7; 10)</td><td></td><td></td><td></td></tr>
    <tr><td>(5; 80)</td><td>(6,5; 95)</td><td></td><td></td><td></td></tr></table>

  <h2>Phần 2. Máy phân loại trên giấy</h2>
  <p>Dữ liệu (đường kính cm; khối lượng g): Chanh A(4,5; 85), Chanh B(4,8; 95); Quýt C(6,5; 90), Quýt D(6,8; 100). Có một quả bí ẩn X(5,0; 98).</p>
  <p>a) <b>Cộng thẳng</b> đơn vị: tính khoảng cách từ X tới A, B, C, D. Quả gần nhất là ……… → X là ………</p>
  <table><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr><tr><th>Khoảng cách (cộng thẳng)</th><td></td><td></td><td></td><td></td></tr><tr><th>Khoảng cách (cùng thang)</th><td></td><td></td><td></td><td></td></tr></table>
  <p>b) <b>Cùng thang</b>: chia đường kính cho 14 và khối lượng cho 450 trước khi tính. Quả gần nhất là ……… → X là ………</p>
  <p>c) Nhìn quả X (đường kính 5 cm), em nghĩ nó là chanh hay quýt? Cách nào cho kết quả hợp lý hơn?</p>
  <div class="lines"></div>

  <h2 class="page-break">Phần 3. Điểm đại diện</h2>
  <p>Tính điểm đại diện (trung bình tọa độ) của nhóm chanh (A, B) và nhóm quýt (C, D). Dùng cùng thang, X gần điểm đại diện nào hơn?</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>

  <h2>Phần 4. Quả lạ</h2>
  <p>Một quả dưa lê (12 cm; 420 g) được đưa vào máy chỉ biết chanh, quýt, cam, lựu. Máy sẽ trả lời gì? Em đề xuất máy nên làm gì trong trường hợp này?</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 8 (học sau bài định lý Pythagore và mặt phẳng tọa độ)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Toán 8:</b> mặt phẳng tọa độ; định lý Pythagore và ứng dụng tính độ dài; thu thập, biểu diễn dữ liệu.<br><b>Tin học 8:</b> giải quyết vấn đề với sự trợ giúp của máy tính.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Nên có: vài quả chanh, quýt, cam thật, thước đo và cân nhà bếp. Máy tính cầm tay. Không cần camera.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> biểu diễn đối tượng bằng điểm trên mặt phẳng tọa độ; tính khoảng cách giữa hai điểm bằng định lý Pythagore; hiểu vì sao cần đưa các đại lượng về cùng thang đo.</li>
    <li><b>Năng lực:</b> phân loại bằng hàng xóm gần nhất và điểm đại diện; đọc bản đồ phân loại; nhận ra ảnh hưởng của nhãn sai và đối tượng lạ.</li>
    <li><b>Phẩm chất:</b> cẩn thận khi đo, ghi nhãn dữ liệu.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Cho học sinh cân và đo một quả chanh, một quả quýt. Hỏi: <i>"Nếu chỉ có hai con số này, làm sao máy biết quả nào là quả nào?"</i></td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Học sinh làm <b>Phần 1</b>. Trên máy chiếu, đặt quả bí ẩn ở vài chỗ, đọc phép tính trong khung Bộ não. Mở <b>Soi bên trong</b> bước 1, 2.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Xem <b>Soi</b> bước 3 (hai đơn vị khác nhau). Học sinh làm <b>Phần 2</b>, rồi tắt/bật <b>Đưa hai trục về cùng thang</b> trên máy để kiểm tra. Thử cả hai cách phân loại; làm <b>Phần 3</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>, quan sát bản đồ thay đổi. Xem <b>Soi</b> bước 5, 6. Làm <b>Phần 4</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại: điểm, khoảng cách Pythagore, cùng thang đo; máy cần biết nói "không biết". Giao thử thách.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Nếu đổi khối lượng sang ki-lô-gam (không chuẩn hóa), chuyện gì xảy ra?</td><td>Δ khối lượng trở nên rất nhỏ (0,01–0,1), lúc đó đường kính lại lấn át. Kết quả phân loại phụ thuộc vào việc chọn đơn vị: đó là lý do cần đưa về cùng thang.</td></tr>
    <tr><td>Hàng xóm gần nhất hay điểm đại diện tốt hơn?</td><td>Hàng xóm gần nhất theo sát dữ liệu, vẽ được đường biên phức tạp nhưng nhạy với nhãn sai. Điểm đại diện đơn giản, ổn định hơn nhưng chỉ vẽ được đường biên thẳng.</td></tr>
    <tr><td>Máy thật dùng bao nhiêu đặc trưng?</td><td>Có khi hàng trăm, hàng nghìn (màu từng điểm ảnh…). Công thức khoảng cách vẫn giống Pythagore, chỉ là có nhiều Δ hơn.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> 5; 10 (Δx = 6, Δy = 8); √(1,5² + 15²) ≈ 15,07.</p>
  <p><b>Phần 2:</b> a) cộng thẳng: XA ≈ 13,01; XB ≈ 3,01; XC ≈ 8,14; XD ≈ 2,69 → gần nhất D → X là quýt. b) cùng thang: XA ≈ 0,046; XB ≈ 0,016; XC ≈ 0,109; XD ≈ 0,129 → gần nhất B → X là chanh. c) Đường kính 5 cm giống chanh (quýt khoảng 6,5 cm); cách cùng thang hợp lý hơn vì không để khối lượng lấn át.</p>
  <p><b>Phần 3:</b> đại diện chanh (4,65; 90), quýt (6,65; 95). Cùng thang: tới chanh ≈ √(0,025² + 0,018²) ≈ 0,031; tới quýt ≈ √(0,118² + 0,007²) ≈ 0,118 → X gần chanh.</p>
  <p><b>Phần 4:</b> máy sẽ trả lời loại gần nhất (lựu) dù khác hẳn. Nên đặt ngưỡng: nếu khoảng cách tới mọi loại đều lớn hơn ngưỡng thì trả lời "không biết", và bổ sung dữ liệu loại quả mới.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Trên trang, "cùng thang" là chia mỗi trục cho giá trị lớn nhất của trục (14 cm, 450 g). Cách này đủ để minh họa; trong thực tế còn có cách chuẩn hóa khác.</li>
    <li>Số liệu trái cây là số liệu mô phỏng gần với thực tế; quả thật có thể khác tùy giống và mùa vụ.</li>
    <li>Dự án 26 (lớp 7) đã giới thiệu hàng xóm gần nhất; dự án này tập trung vào phép tính khoảng cách và thang đo.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> làm Phần 1 với số nguyên, dùng giấy kẻ ô để đếm Δx, Δy.</li>
    <li><b>Học sinh khá, giỏi:</b> viết công thức khoảng cách với ba đặc trưng (thêm độ dày vỏ) và giải thích tại sao vẫn là Pythagore mở rộng.</li>
    <li><b>Không có máy tính:</b> cả lớp đo trái cây thật, dán chấm màu lên giấy kẻ ô khổ lớn, dùng thước để tìm hàng xóm gần nhất cho quả bí ẩn.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 13 (Phân cụm màu) cho thấy máy tự chia các điểm thành nhóm bằng khoảng cách tới điểm đại diện, không cần nhãn.</p>
'''

DOC = dict(num="32", folder="32-trai-cay", grade="8",
  phieu=dict(title="Phiếu học tập Dự án 32: Phân loại trái cây bằng khoảng cách Pythagore", h1="Phiếu học tập: Phân loại trái cây bằng khoảng cách Pythagore",
             lead="Dùng kèm Dự án 32 hoặc làm riêng trên lớp: tính khoảng cách giữa hai điểm, đưa về cùng thang đo, phân loại bằng hàng xóm gần nhất và điểm đại diện.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 32: Tọa độ, Pythagore và phân loại (lớp 8)", h1="Dự án 32: Phân loại trái cây trên mặt phẳng tọa độ",
             lead="Một tiết học 45 phút giúp học sinh lớp 8 dùng mặt phẳng tọa độ và định lý Pythagore để phân loại, và hiểu vì sao phải đưa các đại lượng về cùng thang đo.", body=gv_body)})
