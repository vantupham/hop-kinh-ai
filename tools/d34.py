HEX = ["#e8202a", "#ef4a28", "#f47f20", "#f6a51f", "#f7d117", "#dfe31f", "#8cc63f", "#3fae49", "#1fa27f", "#2d8ec9", "#3c6ab3", "#4f4fa3", "#5a3e94", "#4b2c7a"]
chart = "<tr>" + "".join(f'<td style="background:{h};-webkit-print-color-adjust:exact;print-color-adjust:exact;height:28px"></td>' for h in HEX) + "</tr><tr>" + "".join(f"<td>{i+1}</td>" for i in range(14)) + "</tr>"
phieu_body = f'''
  <h2>Phần 1. Bảng màu pH</h2>
  <table class="tick">{chart}</table>
  <p>Ghi dự đoán của em trước khi thử, rồi ghi kết quả (trên trang Dự án 34 hoặc với giấy chỉ thị thật, có giáo viên hướng dẫn).</p>
  <table><tr><th>Dung dịch</th><th>Em đoán (axit / trung tính / bazơ)</th><th>Màu giấy</th><th>pH đọc được</th><th>Kết luận</th></tr>
    <tr><td>Nước chanh</td><td></td><td></td><td></td><td></td></tr><tr><td>Nước lọc</td><td></td><td></td><td></td><td></td></tr><tr><td>Nước xà phòng</td><td></td><td></td><td></td><td></td></tr><tr><td>Sữa tươi</td><td></td><td></td><td></td><td></td></tr><tr><td>Nước vôi trong</td><td></td><td></td><td></td><td></td></tr></table>

  <h2 class="page-break">Phần 2. Máy so màu</h2>
  <p>Máy đọc màu giấy được (R; G; B) = (245; 160; 35). Ba màu mẫu gần nhất: pH 3 = (244; 127; 32), pH 4 = (246; 165; 31), pH 5 = (247; 209; 23). Tính khoảng cách (gợi ý: √(ΔR² + ΔG² + ΔB²)) và cho biết máy đọc pH mấy.</p>
  <table><tr><th>Màu mẫu</th><th>ΔR</th><th>ΔG</th><th>ΔB</th><th>Khoảng cách</th></tr><tr><td>pH 3</td><td></td><td></td><td></td><td></td></tr><tr><td>pH 4</td><td></td><td></td><td></td><td></td></tr><tr><td>pH 5</td><td></td><td></td><td></td><td></td></tr></table>

  <h2>Phần 3. Cân bằng trắng</h2>
  <p>Dưới đèn vàng, ô giấy trắng (màu thật (240; 240; 240)) được chụp thành (240; 192; 96). Giấy chỉ thị được chụp thành (50; 120; 60).</p>
  <p>a) Đèn làm kênh xanh dương (B) yếu đi còn bao nhiêu phần? ……… b) Màu thật của giấy chỉ thị (sau cân bằng trắng): R = 50 ÷ 240 × 240 = ……; G = 120 ÷ 192 × 240 = ……; B = 60 ÷ 96 × 240 = …… c) Màu đó gần pH mấy trong bảng?</p>
  <div class="lines"></div>

  <h2>Phần 4. An toàn</h2>
  <p>Viết 3 quy tắc an toàn khi làm thí nghiệm với axit và bazơ.</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 8 (học cùng chủ đề Acid, base, thang pH)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút); có thể kết hợp tiết thực hành với giấy chỉ thị thật</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>KHTN 8:</b> acid, base; thang pH; chất chỉ thị (quỳ tím, giấy chỉ thị vạn năng); an toàn khi làm thí nghiệm.<br><b>KHTN 7:</b> ánh sáng, màu sắc (ôn tập). <b>Tin học:</b> biểu diễn màu bằng ba số R, G, B.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Nếu thực hành thật: giấy chỉ thị vạn năng, cốc nhỏ, nước chanh, giấm, nước xà phòng loãng, găng tay, kính bảo hộ. <b>Không</b> dùng nước tẩy, nước vôi đặc với học sinh. Camera không bắt buộc.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> phân biệt axit, bazơ, trung tính theo pH; đọc pH bằng bảng màu chỉ thị; mô tả cách máy biểu diễn màu bằng ba số và so với bảng mẫu.</li>
    <li><b>Năng lực:</b> tính khoảng cách màu; giải thích ảnh hưởng của ánh sáng và cách cân bằng trắng; nhận ra giới hạn của máy đo màu.</li>
    <li><b>Phẩm chất:</b> tuân thủ quy tắc an toàn hóa chất; cẩn thận, trung thực khi ghi kết quả.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Học sinh đoán dung dịch nào là axit, bazơ (Phần 1, cột dự đoán). Giáo viên nhắc quy tắc an toàn.</td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Thử 11 dung dịch trên trang (hoặc 3–4 dung dịch thật do giáo viên làm mẫu). Hoàn thành Phần 1. Mở <b>Soi bên trong</b> bước 1, 2.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Kéo thanh <b>Màu đèn</b> sang vàng, quan sát ba số R, G, B thay đổi; bật/tắt cân bằng trắng. Xem <b>Soi</b> bước 3 đến 5. Học sinh làm <b>Phần 2, 3</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>, quan sát số dung dịch đọc đúng. Thảo luận: khi nào nên tin máy, khi nào nên kiểm tra lại bằng mắt và bằng máy đo pH chuẩn.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại thang pH, ba số màu, cân bằng trắng; học sinh làm <b>Phần 4</b> (an toàn).</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Mắt người có bị đèn vàng đánh lừa như máy không?</td><td>Ít hơn: não người tự "cân bằng trắng" nên ta vẫn thấy tờ giấy trắng là trắng. Nhưng mắt mỗi người nhìn màu hơi khác nhau, máy thì đo ổn định nếu ánh sáng chuẩn.</td></tr>
    <tr><td>Vì sao bảng mẫu càng chi tiết càng tốt?</td><td>Máy chỉ chọn được một trong các màu mẫu; ít màu mẫu thì kết quả bị làm tròn rất thô.</td></tr>
    <tr><td>Máy đọc pH 3 cho nước cam có chắc chắn không?</td><td>Giấy chỉ thị chỉ cho kết quả gần đúng (sai khoảng 1 đơn vị). Cần máy đo pH điện tử để đo chính xác.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> nước chanh ~2 (axit), nước lọc ~7 (trung tính), nước xà phòng ~10 (bazơ), sữa tươi ~6,5 (gần trung tính, hơi axit), nước vôi trong ~12 (bazơ).</p>
  <p><b>Phần 2:</b> pH 3: ΔR = 1, ΔG = 33, ΔB = 3 → ≈ 33,2. pH 4: 1, 5, 4 → ≈ 6,5. pH 5: 2, 49, 12 → ≈ 50,5. Máy đọc <b>pH 4</b>.</p>
  <p><b>Phần 3:</b> a) B còn 96/240 = 0,4 (40%). b) R = 50; G = 150; B = 150. c) (50; 150; 150) gần màu pH 9 (31; 162; 127): xanh ngọc, bazơ yếu.</p>
  <p><b>Phần 4:</b> ví dụ: không nếm, không ngửi trực tiếp; đeo găng tay, kính; dùng lượng nhỏ, có giáo viên; rửa ngay bằng nhiều nước nếu dính vào da, mắt.</p>

  <h2>5. Lưu ý về kiến thức và an toàn</h2>
  <ul>
    <li>Màu bảng pH trên trang là màu gần đúng của giấy chỉ thị vạn năng; mỗi hãng giấy có bảng màu hơi khác nhau.</li>
    <li>Giá trị pH của các dung dịch là giá trị điển hình; thực tế thay đổi theo nồng độ.</li>
    <li>Trong tiết thực hành thật, chỉ dùng dung dịch an toàn (chanh, giấm, xà phòng loãng, nước muối nở loãng). Nước tẩy, nước vôi đặc chỉ dùng trong mô phỏng.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> chỉ phân loại axit/trung tính/bazơ bằng màu, chưa cần tính khoảng cách.</li>
    <li><b>Học sinh khá, giỏi:</b> giải thích vì sao "chỉ so sắc màu" giúp với giấy nhạt màu nhưng có thể nhầm giữa hai màu cùng sắc khác độ đậm.</li>
    <li><b>Không có máy tính:</b> làm chất chỉ thị bằng nước bắp cải tím, so màu bằng mắt dưới đèn trắng và đèn vàng, ghi nhận sự khác biệt.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 13 (Phân cụm màu) cho thấy máy gom các điểm ảnh có ba số màu gần nhau thành nhóm.</p>
'''

DOC = dict(num="34", folder="34-giay-quy", grade="8",
  phieu=dict(title="Phiếu học tập Dự án 34: Giấy chỉ thị thông minh đọc độ pH", h1="Phiếu học tập: Giấy chỉ thị thông minh",
             lead="Dùng kèm Dự án 34 hoặc tiết thực hành: đọc pH bằng bảng màu, tính khoảng cách màu, cân bằng trắng và quy tắc an toàn.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 34: Thang pH và máy đọc màu (lớp 8)", h1="Dự án 34: Giấy chỉ thị thông minh",
             lead="Một tiết học 45 phút giúp học sinh lớp 8 đọc pH bằng chất chỉ thị, hiểu cách máy đọc màu bằng ba số R, G, B, và vì sao ánh sáng làm máy đọc sai.", body=gv_body)})
