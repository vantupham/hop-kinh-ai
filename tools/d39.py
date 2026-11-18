phieu_body = '''
  <h2>Phần 1. Bảng kiểm chứng 6 bức ảnh</h2>
  <p>Dùng Dự án 39. Với mỗi ảnh, ghi kết quả từng công cụ rồi kết luận.</p>
  <table><tr><th>Ảnh</th><th>Máy dò nói</th><th>Bản đồ nhiễu</th><th>Hướng bóng</th><th>Dấu vết khác</th><th>Nguồn</th><th>Kết luận của em</th></tr>
    <tr><td>1. Hoàng hôn</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>2. Khủng long</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>3. Thành phố</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>4. Mây, cánh đồng</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>5. Rừng thông</td><td></td><td></td><td></td><td></td><td></td><td></td></tr>
    <tr><td>6. Tuyết, đồng lúa</td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>
  <p>Máy dò tự động kết luận đúng mấy ảnh? Công cụ nào giúp em nhiều nhất?</p>
  <div class="lines"></div>

  <h2>Phần 2. Tự tính mức nhiễu</h2>
  <p>Mức nhiễu của một điểm = |giá trị điểm đó − trung bình 4 điểm trên, dưới, trái, phải|. Tính cho điểm ở giữa của hai mảnh ảnh (độ sáng 0–255):</p>
  <table class="tick"><tr><th></th><th colspan="3">Mảnh A</th><th></th><th colspan="3">Mảnh B</th></tr>
    <tr><td></td><td></td><td>120</td><td></td><td></td><td></td><td>120</td><td></td></tr>
    <tr><td></td><td>112</td><td><b>129</b></td><td>126</td><td></td><td>120</td><td><b>121</b></td><td>120</td></tr>
    <tr><td></td><td></td><td>118</td><td></td><td></td><td></td><td>122</td><td></td></tr></table>
  <p>Mức nhiễu điểm giữa mảnh A: ……… mảnh B: ……… Mảnh nào giống ảnh chụp bằng máy ảnh hơn? Mảnh nào giống vùng bị dán hoặc ảnh AI tạo?</p>
  <div class="lines"></div>

  <h2 class="page-break">Phần 3. Khi máy dò sai</h2>
  <p>Bật lần lượt 3 sự cố ở mục <b>Phá máy</b>. Ghi lại máy dò nói gì, sự thật là gì, và công cụ nào giúp em tìm ra sự thật.</p>
  <table><tr><th>Sự cố</th><th>Máy dò nói</th><th>Sự thật</th><th>Công cụ giúp phát hiện</th></tr>
    <tr><td>Ảnh đăng lại nhiều lần</td><td></td><td></td><td></td></tr>
    <tr><td>Sao chép một vùng</td><td></td><td></td><td></td></tr>
    <tr><td>Ảnh giả rất giống thật</td><td></td><td></td><td></td></tr></table>
  <p>Vì sao không được kết luận một người "dùng ảnh giả" chỉ dựa vào máy dò?</p>
  <div class="lines"></div>

  <h2>Phần 4. Năm câu hỏi trước khi chia sẻ</h2>
  <p>Viết năm câu hỏi em sẽ tự hỏi trước khi chia sẻ một bức ảnh gây sốc trên mạng.</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>
  <p>Một bạn gửi vào nhóm lớp ảnh "trường mình được nghỉ học vì bão" chưa rõ nguồn. Em sẽ làm gì?</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 9</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút)</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Tin học 9:</b> đánh giá chất lượng thông tin; đạo đức, pháp luật và văn hóa trong môi trường số.<br><b>GDCD 9:</b> sống có trách nhiệm, tôn trọng sự thật. <b>KHTN:</b> ánh sáng truyền thẳng, bóng đổ (ôn tập).</td></tr>
    <tr><th>Thiết bị</th><td>1 máy tính và máy chiếu (hoặc máy cho từng nhóm). Toàn bộ ảnh trên trang được vẽ bằng mã lệnh, <b>không có ảnh người thật</b>.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> nêu được dấu hiệu của ảnh bị ghép (mức nhiễu khác, bóng lệch hướng, vùng sao chép) và ảnh AI tạo (mịn bất thường, chữ méo, chi tiết vô lí); hiểu giới hạn của máy dò tự động.</li>
    <li><b>Năng lực:</b> dùng nhiều công cụ để kiểm chứng; tính mức nhiễu đơn giản; đánh giá nguồn thông tin.</li>
    <li><b>Phẩm chất:</b> trung thực, có trách nhiệm khi chia sẻ thông tin; không vội kết tội người khác.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Chiếu nhanh 6 ảnh, học sinh đoán bằng trực giác ảnh nào thật, ghi lại.</td></tr>
    <tr><td><b>Khám phá</b></td><td>15 phút</td><td>Nhóm dùng đồ nghề thám tử, làm <b>Phần 1</b>. Mở <b>Soi bên trong</b> bước 1 đến 4.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>8 phút</td><td>Làm <b>Phần 2</b>; so với kết quả trực giác lúc đầu.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>14 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>, làm <b>Phần 3</b>. Xem <b>Soi</b> bước 5, 6; làm <b>Phần 4</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Chốt: dùng nhiều bằng chứng, nguồn là quan trọng nhất; chưa chắc chắn thì không chia sẻ.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Ảnh có chỉnh sửa có phải luôn là ảnh "xấu"?</td><td>Không. Chỉnh sáng, cắt ảnh, ghép ảnh vui là bình thường nếu <b>không dùng để lừa người xem</b>. Vấn đề là ảnh sửa được đưa ra như sự thật, hoặc vi phạm quy định (thi ảnh, tin tức).</td></tr>
    <tr><td>Vì sao trực giác dễ sai?</td><td>Ảnh giả ngày càng giống thật; ta dễ tin những gì hợp với cảm xúc của mình. Cần bằng chứng, không chỉ "trông có vẻ thật".</td></tr>
    <tr><td>Nếu nghi ảnh giả trong nhóm lớp thì làm gì?</td><td>Không chia sẻ tiếp; nhắn riêng người gửi; hỏi thầy cô hoặc kiểm tra nguồn chính thức (trang của trường, cơ quan chức năng).</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> 1 thật (nhiễu đều, bóng cùng hướng, nguồn rõ). 2 ghép (bóng khủng long ngược hướng, vùng khủng long không có nhiễu, ảnh gốc không có khủng long). 3 AI tạo (ảnh mịn bất thường, chữ trên biển méo, bóng hai cột đèn ngược chiều, cửa sổ méo, trang đăng ghi rõ AI). 4 ghép kiểu sao chép (hai đám mây giống hệt; máy dò nói thật nhưng sai). 5 thật. 6 AI tạo (mịn, chữ lặp, nội dung vô lí). Máy dò đúng 5/6 ảnh (sai ảnh 4).</p>
  <p><b>Phần 2:</b> Mảnh A: trung bình 4 điểm = (120 + 112 + 126 + 118) ÷ 4 = 119; |129 − 119| = <b>10</b>. Mảnh B: (120 + 120 + 120 + 122) ÷ 4 = 120,5; |121 − 120,5| = <b>0,5</b>. Mảnh A giống ảnh máy ảnh (có hạt nhiễu); mảnh B mịn, giống vùng dán hoặc ảnh AI (hoặc ảnh bị nén nhiều).</p>
  <p><b>Phần 3:</b> đăng lại nhiều lần: máy dò nói AI tạo, sự thật là ảnh thật, phát hiện nhờ kiểm tra nguồn (tìm bản gốc). Sao chép một vùng: máy dò nói thật, sự thật là ảnh sửa, phát hiện nhờ kính lúp và nguồn. Ảnh giả rất giống thật: máy dò nói thật, sự thật là AI tạo, chỉ phát hiện nhờ nguồn. Không được kết tội chỉ dựa vào máy dò vì máy có thể sai cả hai chiều.</p>
  <p><b>Phần 4:</b> ai đăng đầu tiên; đăng khi nào, ở đâu; có ảnh gốc, ảnh khác của sự kiện không; báo chí, cơ quan chính thống có đưa tin không; nội dung có vô lí, gây sốc quá mức không. Tình huống: không chia sẻ tiếp, kiểm tra trang chính thức của trường, hỏi giáo viên chủ nhiệm.</p>

  <h2>5. Lưu ý</h2>
  <ul>
    <li>Bản đồ nhiễu trên trang được <b>tính thật</b> từ điểm ảnh (trung vị độ lệch của mỗi điểm so với 4 điểm xung quanh). Máy dò tự động trong dự án rất đơn giản, cố ý để học sinh thấy giới hạn.</li>
    <li>Công cụ phân tích ảnh chuyên nghiệp phức tạp hơn nhiều, nhưng nguyên tắc "nhiều bằng chứng, kiểm tra nguồn" vẫn giữ nguyên.</li>
    <li>Không dùng ảnh thật của học sinh, giáo viên để thực hành ghép ảnh. Nhắc học sinh về quyền hình ảnh và hậu quả của việc lan truyền ảnh ghép.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> chỉ dùng hướng bóng và kiểm tra nguồn cho 3 ảnh đầu.</li>
    <li><b>Học sinh khá, giỏi:</b> giải thích vì sao vùng sao chép không lộ trên bản đồ nhiễu; đề xuất cách máy có thể phát hiện vùng sao chép (tìm hai vùng giống hệt nhau).</li>
    <li><b>Không có máy tính:</b> in các ảnh ở khổ lớn, học sinh dùng thước kẻ vẽ hướng bóng đổ và kính lúp; giáo viên đọc thông tin nguồn của từng ảnh.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 16 (Đoán chữ tiếp theo) cho thấy AI tạo sinh tạo nội dung từng phần một, và vì sao nó có thể "bịa".</p>
'''

DOC = dict(num="39", folder="39-anh-that", grade="9",
  phieu=dict(title="Phiếu học tập Dự án 39: Ảnh thật hay ảnh ghép?", h1="Phiếu học tập: Ảnh thật hay ảnh ghép?",
             lead="Dùng kèm Dự án 39: bảng kiểm chứng ảnh, tự tính mức nhiễu, khi máy dò sai, năm câu hỏi trước khi chia sẻ.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 39: Kiểm chứng ảnh và AI tạo sinh (lớp 9)", h1="Dự án 39: Ảnh thật hay ảnh ghép?",
             lead="Một tiết học 45 phút giúp học sinh lớp 9 nhận biết ảnh ghép, ảnh AI tạo bằng nhiều bằng chứng, hiểu giới hạn của máy dò và chia sẻ thông tin có trách nhiệm.", body=gv_body)})
