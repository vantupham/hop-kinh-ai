tally_rows = "".join(f"<tr><td><b>{f}</b></td><td></td><td></td><td></td><td></td></tr>" for f in range(1, 7))
phieu_body = f'''
  <h2>Phần 1. Tung và kiểm đếm</h2>
  <p>Nhóm em tung một viên xúc xắc (thật hoặc trên trang Dự án 23) <b>60 lần</b>. Mỗi lần tung, gạch một nét vào cột kiểm đếm.</p>
  <table><tr><th style="width:10%">Mặt</th><th>Kiểm đếm (gạch nét)</th><th style="width:14%">Tần số</th><th style="width:22%">Xác suất thực nghiệm</th><th style="width:16%">Mong đợi</th></tr>{tally_rows}
    <tr><td><b>Cộng</b></td><td></td><td>60</td><td>1</td><td>60</td></tr></table>
  <p class="small muted">Cột "Mong đợi": nếu xúc xắc công bằng, mỗi mặt ra khoảng bao nhiêu lần trong 60 lần? ……… lần.</p>

  <h2>Phần 2. Vẽ biểu đồ cột</h2>
  <p>Vẽ biểu đồ cột tần số 6 mặt từ Phần 1. Kẻ thêm một đường ngang ở mức "mong đợi".</p>
  <div class="tree-box" style="height:260px"></div>

  <h2 class="page-break">Phần 3. Thám tử nhí</h2>
  <p>Ba bạn tung ba viên xúc xắc, mỗi viên 120 lần. Bảng dưới là số lần ra mặt 6.</p>
  <table><tr><th>Viên</th><th>Số lần ra mặt 6</th><th>Tổng số lần tung</th><th>Xác suất thực nghiệm mặt 6</th></tr>
    <tr><td>A</td><td>22</td><td>120</td><td></td></tr><tr><td>B</td><td>45</td><td>120</td><td></td></tr><tr><td>C</td><td>18</td><td>120</td><td></td></tr></table>
  <p>a) Xúc xắc công bằng ra mặt 6 khoảng ……… lần trong 120 lần. b) Viên em nghi gian lận là: ……… Vì sao?</p>
  <div class="lines"></div><div class="lines"></div>

  <h2>Phần 4. Bao nhiêu lần thì đủ?</h2>
  <p>Bạn Nam tung một viên xúc xắc <b>6 lần</b> và được: 6, 2, 6, 6, 3, 6. Nam kết luận: "Viên này chắc chắn gian lận!" Em đồng ý không? Em sẽ làm gì để chắc chắn hơn?</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>

  <h2>Phần 5. Rác vào, rác ra</h2>
  <p>Kể một tình huống trong đời sống mà <b>dữ liệu bị ghi sai</b> hoặc <b>dữ liệu đã cũ</b> dẫn tới kết luận sai.</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 6 (ôn tập ở lớp 7 khi học xác suất của biến cố)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Toán 6:</b> Một số yếu tố thống kê và xác suất: thu thập, phân loại dữ liệu; bảng thống kê, biểu đồ cột; xác suất thực nghiệm.<br><b>Tin học 6:</b> thông tin và dữ liệu, xử lý thông tin.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Nên có: mỗi nhóm 1 viên xúc xắc thật để làm Phần 1 của phiếu. Không cần camera, không cần cài đặt.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> thu thập, kiểm đếm dữ liệu; lập bảng tần số và biểu đồ cột; tính xác suất thực nghiệm; nhận biết số lần thử càng lớn thì xác suất thực nghiệm càng ổn định.</li>
    <li><b>Năng lực:</b> dùng dữ liệu để đưa ra và kiểm tra một giả thuyết; nhận ra kết luận sai do dữ liệu ít, ghi sai hoặc đã cũ; liên hệ với cách AI học quy luật từ dữ liệu.</li>
    <li><b>Phẩm chất:</b> trung thực khi ghi chép; thận trọng, không vội kết luận khi chưa đủ bằng chứng.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Chiếu mục <b>Chơi</b>, bấm <b>Tung 1 lần</b> vài lần. Hỏi: <i>"Ba viên trông y hệt nhau. Nhìn thế này đã biết viên nào gian lận chưa? Cần làm gì?"</i></td></tr>
    <tr><td><b>Khám phá</b></td><td>13 phút</td><td>Các nhóm tung xúc xắc thật 60 lần, làm <b>Phần 1, 2</b> của phiếu. Giáo viên cho cả lớp so sánh biểu đồ của các nhóm: không nhóm nào giống hệt nhau, nhưng đều gần mức "mong đợi".</td></tr>
    <tr><td><b>Luyện tập</b></td><td>12 phút</td><td>Trên máy chiếu, bấm <b>Tung 10 lần</b> rồi cho cả lớp đoán viên gian lận; sau đó <b>Tung 100 lần</b> và quan sát biểu đồ đường tách ra. Đi qua <b>Soi bên trong</b> 6 bước. Học sinh làm <b>Phần 3</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>; với mỗi sự cố, cho học sinh đoán vì sao thám tử sai trước khi mở lời giải. Học sinh làm <b>Phần 4, 5</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại 3 thẻ kiến thức và câu "rác vào, rác ra". Giao thử thách một sao: tung đồng xu 50 lần.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Tung 60 lần, mặt 6 ra 14 lần (nhiều hơn 10). Có phải xúc xắc gian lận không?</td><td>Chưa chắc. Chênh lệch nhỏ như vậy thường do may rủi. Cần tung thêm và xem chênh lệch có lớn dần lên không, hay quay về gần mức mong đợi.</td></tr>
    <tr><td>Thám tử máy có "biết" viên nào gian lận không?</td><td>Không. Nó chỉ đếm và so sánh với mức mong đợi. Nó có thể sai khi dữ liệu ít, sai hoặc cũ; giống như con người.</td></tr>
    <tr><td>Vì sao máy đoán trước mặt sắp ra chỉ đúng khoảng 1/6 với viên công bằng?</td><td>Vì mọi mặt đều có khả năng như nhau, không có quy luật nào để học. AI chỉ dự đoán tốt khi dữ liệu thật sự có quy luật.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1, 2:</b> tùy kết quả của nhóm. Mức mong đợi: 60 ÷ 6 = <b>10</b> lần mỗi mặt. Xác suất thực nghiệm mỗi mặt = tần số ÷ 60, tổng các xác suất bằng 1.</p>
  <p><b>Phần 3:</b> A: 22/120 ≈ 18%; B: 45/120 = 37,5%; C: 18/120 = 15%. Mong đợi: 120 ÷ 6 = 20 lần. Nghi viên <b>B</b> vì ra mặt 6 gấp hơn 2 lần mức mong đợi; A và C chỉ lệch ít, có thể do may rủi.</p>
  <p><b>Phần 4:</b> không nên kết luận chắc chắn: 6 lần quá ít, viên công bằng vẫn có thể ra mặt 6 nhiều lần do may rủi. Cần tung thêm nhiều lần (ví dụ 100 lần trở lên) rồi so với mức mong đợi.</p>
  <p><b>Phần 5:</b> ví dụ: điểm danh ghi nhầm làm thống kê sĩ số sai; dự báo lượng khách dựa trên số liệu năm cũ khi trường đã đổi giờ học; bản đồ chưa cập nhật đường mới.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>"Độ lệch" trên trang là tổng của (tần số − mong đợi)² ÷ mong đợi qua 6 mặt (đại lượng khi bình phương dùng trong thống kê). Với học sinh lớp 6, chỉ cần hiểu: chênh lệch càng lớn so với mức mong đợi thì con số càng lớn; không cần dạy công thức.</li>
    <li>Ngưỡng mặc định 15 được chọn để một viên công bằng rất hiếm khi bị nghi oan khi đã tung đủ nhiều lần. Kéo ngưỡng thấp xuống sẽ thấy thám tử hay nghi oan hơn: có thể thảo luận về sự cân bằng giữa "bắt nhầm" và "bỏ sót".</li>
    <li>Tránh nói "tung đủ nhiều thì mặt nào cũng ra đúng 1/6". Đúng hơn là: tỉ lệ sẽ <b>gần</b> 1/6 hơn, và dao động ngày càng nhỏ.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> dùng đồng xu (2 mặt) trước khi chuyển sang xúc xắc 6 mặt.</li>
    <li><b>Học sinh khá, giỏi:</b> gộp dữ liệu của cả lớp (ví dụ 10 nhóm × 60 lần = 600 lần) và so sánh với dữ liệu từng nhóm: dữ liệu gộp có gần 1/6 hơn không?</li>
    <li><b>Không có máy tính:</b> làm một viên xúc xắc giấy, dán một miếng đất nặn nhỏ ở mặt đối diện mặt 6. Các nhóm tung, gộp dữ liệu và thử phát hiện viên bị làm lệch.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 16 (Máy đoán chữ) cho thấy máy cũng đếm tần số, nhưng là đếm chữ nào hay đi sau chữ nào, để viết tiếp câu.</p>
'''

DOC = dict(num="23", folder="23-xuc-xac",
  phieu=dict(title="Phiếu học tập Dự án 23: Thám tử tìm xúc xắc gian lận", h1="Phiếu học tập: Thám tử tìm xúc xắc gian lận",
             lead="Dùng kèm Dự án 23 hoặc làm riêng trên lớp với xúc xắc thật: kiểm đếm, vẽ biểu đồ cột, tính xác suất thực nghiệm.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 23: Xác suất thực nghiệm và dữ liệu (lớp 6)", h1="Dự án 23: Thám tử tìm xúc xắc gian lận",
             lead="Một tiết học 45 phút giúp học sinh lớp 6 thu thập dữ liệu, tính xác suất thực nghiệm và hiểu vì sao máy cần đủ dữ liệu, dữ liệu đúng và mới để kết luận.", body=gv_body)})
