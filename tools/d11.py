DAYS = [0, 2, 4, 6, 8, 10, 12, 14]
HS = ["2", "4,5", "7,5", "10", "13", "15", "19", "21,5"]
t1 = "<tr><th>Ngày x</th>" + "".join(f"<td>{d}</td>" for d in DAYS) + "</tr><tr><th>Chiều cao (cm)</th>" + "".join(f"<td><b>{h}</b></td>" for h in HS) + "</tr>"
t3 = "<tr><th>Ngày x</th>" + "".join(f"<td>{d}</td>" for d in DAYS) + "</tr><tr><th>Số đo thật</th>" + "".join(f"<td>{h}</td>" for h in HS) + "</tr><tr><th>Dự đoán 1,4x + 2</th>" + "".join("<td></td>" for _ in DAYS) + "</tr><tr><th>Sai số</th>" + "".join("<td></td>" for _ in DAYS) + "</tr>"
grid = '<div class="pix-grid" style="grid-template-columns:repeat(15,auto)">' + "".join("<span></span>" for _ in range(15 * 12)) + "</div>"

phieu_body = f'''
  <h2>Phần 1. Chấm số liệu</h2>
  <p>Nhóm em đo chiều cao cây đậu hai ngày một lần:</p>
  <table class="tick">{t1}</table>
  <p>Chấm 8 điểm lên lưới: trục ngang là số ngày (mỗi cột 1 ngày, từ 0 đến 14), trục dọc là chiều cao (mỗi hàng 2 cm, từ 0 ở hàng dưới cùng đến 22 cm ở hàng trên cùng).</p>
  {grid}

  <h2 class="page-break">Phần 2. Vẽ đường thẳng bằng mắt</h2>
  <p>Dùng thước kẻ một đường thẳng đi gần các chấm nhất có thể. Đường thẳng của em cắt trục dọc ở ……… cm (đó là b). Mỗi ngày đường thẳng đi lên khoảng ……… cm (đó là a). Hàm số của em: y = ……… x + ………</p>

  <h2>Phần 3. Tính sai số</h2>
  <p>Một bạn dùng hàm số <b>y = 1,4x + 2</b>. Hoàn thành bảng (sai số = |số đo thật − dự đoán|), rồi tính sai số trung bình.</p>
  <table class="tick">{t3}</table>
  <p>Tổng sai số: ……… · Sai số trung bình: ……… cm. So với hàm số em vẽ ở Phần 2, hàm số nào tốt hơn?</p>

  <h2>Phần 4. Dự đoán</h2>
  <p>Dùng y = 1,4x + 2: chiều cao ngày 10 là ……… cm; ngày 30 là ……… cm. Thực tế đo được ngày 30 cây chỉ cao khoảng 30 cm. Vì sao dự đoán ngày 30 sai nhiều như vậy?</p>
  <div class="lines"></div><div class="lines"></div>

  <h2>Phần 5. Tìm số đo nhầm</h2>
  <p>Một nhóm khác ghi: ngày 0: 2 cm; ngày 2: 5 cm; ngày 4: 8 cm; ngày 6: 10 cm; ngày 8: 31 cm; ngày 10: 16 cm. Số đo nào có thể bị ghi nhầm? Nếu cứ để nguyên số đó, đường thẳng máy tìm được sẽ thay đổi thế nào?</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 8 (học sau bài hàm số bậc nhất và đồ thị)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách trồng đậu ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Toán 8:</b> hàm số bậc nhất y = ax + b; đồ thị; hệ số góc; mặt phẳng tọa độ.<br><b>KHTN 8 (và Sinh học):</b> sinh trưởng của thực vật. <b>Tin học 8:</b> dùng máy tính xử lý dữ liệu.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Tốt nhất: 1 máy cho mỗi nhóm 2–3 học sinh. Phiếu học tập, thước kẻ. Không cần camera.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> dùng hàm số bậc nhất làm mô hình mô tả dữ liệu; hiểu ý nghĩa của a (tốc độ tăng) và b (giá trị ban đầu); tính sai số và sai số trung bình.</li>
    <li><b>Năng lực:</b> vẽ đường thẳng xấp xỉ dữ liệu; dự đoán bằng hàm số; nhận ra ba giới hạn: ngoại suy quá xa, số đo nhầm, mô hình quá phức tạp.</li>
    <li><b>Phẩm chất:</b> trung thực khi đo và ghi số liệu; thận trọng khi đưa ra dự đoán.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Chiếu 15 chấm số liệu. Hỏi: <i>"Ngày 20 cây cao bao nhiêu? Em dựa vào đâu để đoán?"</i> Ghi vài dự đoán lên bảng.</td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Học sinh làm <b>Phần 1, 2</b> của phiếu. Trên máy, các nhóm thi kéo a, b sao cho sai số trung bình nhỏ nhất. Mở <b>Soi bên trong</b> bước 1 đến 3.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Bấm <b>Máy tự tìm đường thẳng</b>, xem biểu đồ sai số giảm dần; so với kết quả của nhóm. Xem <b>Soi</b> bước 4, 5. Học sinh làm <b>Phần 3, 4</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>. Xem <b>Soi</b> bước 6. Học sinh làm <b>Phần 5</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại: mô hình đơn giản, đo sai số, chỉnh dần; dự đoán chỉ đáng tin gần khoảng dữ liệu. Giao thử thách trồng đậu.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Vì sao đường thẳng không đi qua đúng mọi chấm?</td><td>Số liệu thật luôn có dao động (đo lệch một chút, cây hôm nay lớn nhanh hơn hôm qua). Mô hình chỉ cần bắt được xu hướng chung.</td></tr>
    <tr><td>Đường uốn lượn có sai số gần 0, sao lại kém?</td><td>Nó "học thuộc" cả những dao động ngẫu nhiên nên dự đoán số đo mới rất tệ. Trong học máy gọi là <b>học quá khớp</b>.</td></tr>
    <tr><td>Làm sao dự đoán tốt hơn cho ngày 30?</td><td>Đo thêm số liệu những ngày sau và chọn mô hình phù hợp với việc cây lớn chậm lại; hoặc chỉ dự đoán gần khoảng đã đo.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 2:</b> nhiều đáp án; hợp lý khi a khoảng 1,3 đến 1,5 và b khoảng 1,5 đến 2,5.</p>
  <p><b>Phần 3:</b> dự đoán: 2; 4,8; 7,6; 10,4; 13,2; 16; 18,8; 21,6. Sai số: 0; 0,3; 0,1; 0,4; 0,2; 1; 0,2; 0,1. Tổng 2,3; sai số trung bình ≈ 0,29 cm.</p>
  <p><b>Phần 4:</b> ngày 10: 16 cm; ngày 30: 44 cm. Sai nhiều vì ngày 30 nằm xa khoảng có dữ liệu (0–14 ngày); cây lớn chậm lại nhưng đường thẳng giả định lớn đều mãi (ngoại suy).</p>
  <p><b>Phần 5:</b> ngày 8: 31 cm là bất thường (có thể là 13 cm bị viết ngược). Để nguyên thì đường thẳng bị kéo lên, hệ số a lớn hơn thật, mọi dự đoán đều lệch.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Trên trang, sai số dùng là sai số tuyệt đối trung bình (dễ hiểu với lớp 8); máy tự chỉnh bằng cách giảm dần trung bình bình phương sai số. Không cần nói tới bình phương nếu học sinh chưa hỏi.</li>
    <li>"Độ uốn lượn" là bậc của đa thức. Với lớp 8 chỉ cần mô tả là "đường cong được phép uốn nhiều lần".</li>
    <li>Số liệu trên trang là số liệu mô phỏng có dao động ngẫu nhiên; số liệu thật của lớp sẽ khác.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> cho sẵn b = 2, chỉ tìm a.</li>
    <li><b>Học sinh khá, giỏi:</b> tính a từ hai điểm (0; 2) và (14; 21,5) và so với a máy tìm được; giải thích vì sao khác nhau.</li>
    <li><b>Không có máy tính:</b> dùng sợi chỉ căng thẳng trên giấy kẻ ô để tìm đường đi gần các chấm nhất; cả lớp so sai số trung bình của các nhóm.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 27 (Dự đoán điểm thi) cho thấy máy dùng nhiều yếu tố cùng lúc để dự đoán, cũng bằng cách giảm dần sai số.</p>
'''

DOC = dict(num="11", folder="11-cay-dau", grade="8",
  phieu=dict(title="Phiếu học tập Dự án 11: Đường thẳng dự đoán cây đậu lớn", h1="Phiếu học tập: Đường thẳng dự đoán cây đậu lớn",
             lead="Dùng kèm Dự án 11 hoặc làm riêng trên lớp: chấm số liệu, vẽ đường thẳng, tính sai số, dự đoán bằng hàm số bậc nhất.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 11: Hàm số bậc nhất làm mô hình dự đoán (lớp 8)", h1="Dự án 11: Đường thẳng dự đoán cây đậu lớn",
             lead="Một tiết học 45 phút giúp học sinh lớp 8 dùng hàm số y = ax + b làm mô hình, đo sai số, hiểu cách máy tự chỉnh hệ số và giới hạn của dự đoán.", body=gv_body)})
