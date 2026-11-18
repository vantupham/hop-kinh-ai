phieu_body = '''
  <h2>Phần 1. Tần số tương đối theo nhóm</h2>
  <p>Năm ngoái, hội đồng cũ xét 240 hồ sơ: Phường Đông có 141 bạn, 59 bạn được nhận; Xã Tây có 99 bạn, 20 bạn được nhận. Điểm và giờ hoạt động của hai khu phân bố như nhau.</p>
  <table><tr><th>Khu</th><th>Số hồ sơ</th><th>Được nhận</th><th>Tần số tương đối (làm tròn đến %)</th></tr>
    <tr><td>Phường Đông</td><td>141</td><td>59</td><td></td></tr><tr><td>Xã Tây</td><td>99</td><td>20</td><td></td></tr></table>
  <p>a) Vẽ biểu đồ cột so sánh hai tần số tương đối. b) Có dấu hiệu thiên vị không? Vì sao chỉ nhìn tần số tương đối thì chưa đủ để kết luận chắc chắn?</p>
  <div class="lines"></div><div class="lines"></div>

  <h2>Phần 2. Máy học được gì?</h2>
  <p>Máy học từ quyết định cũ và có trọng số: Điểm trung bình <b>+1,8</b> · Giờ hoạt động <b>+1,0</b> · Ở Xã Tây <b>−0,8</b>. Điểm máy chấm = tổng (thông tin × trọng số), trong đó "Ở Xã Tây" bằng 1 nếu ở Xã Tây, bằng 0 nếu ở Phường Đông. Để đơn giản, điểm và giờ hoạt động đã được quy về thang nhỏ (cột "đã quy đổi").</p>
  <table><tr><th>Bạn</th><th>Điểm (đã quy đổi)</th><th>Giờ HĐ (đã quy đổi)</th><th>Khu</th><th>Điểm máy chấm</th></tr>
    <tr><td>An</td><td>1,0</td><td>0,5</td><td>Phường Đông</td><td></td></tr>
    <tr><td>Bình</td><td>1,0</td><td>0,5</td><td>Xã Tây</td><td></td></tr>
    <tr><td>Chi</td><td>0,5</td><td>1,0</td><td>Phường Đông</td><td></td></tr></table>
  <p>Máy chọn bạn có điểm máy chấm từ <b>2,0</b> trở lên. Ai được chọn? An và Bình khác nhau ở điểm nào? Đây có phải là quyết định công bằng không?</p>
  <div class="lines"></div>

  <h2 class="page-break">Phần 3. Phép thử đổi nơi ở</h2>
  <p>Trên Dự án 18, bật sự cố <b>Dữ liệu cũ thiên vị</b>. Chọn 3 hồ sơ (ít nhất 1 hình tam giác gần đường ngưỡng), ghi lại:</p>
  <table><tr><th>Hồ sơ số</th><th>Khu</th><th>Điểm</th><th>Giờ HĐ</th><th>Máy chọn?</th><th>Nếu đổi khu?</th><th>Đổi kết quả?</th></tr>
    <tr><td style="height:30px"></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td style="height:30px"></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td style="height:30px"></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table>
  <p>Ghi số hồ sơ bị đổi kết quả chỉ vì nơi ở khi: (1) dùng khu vực: ……/80 · (2) chỉ dùng khoảng cách: ……/80 · (3) học từ dữ liệu đã xét lại: ……/80</p>

  <h2>Phần 4. Thông tin đại diện</h2>
  <p>Vì sao giấu cột "khu vực" mà máy vẫn thiên vị khi được biết "khoảng cách đến trường"? Nêu thêm một ví dụ thông tin có thể "tố" một đặc điểm khác của học sinh.</p>
  <div class="lines"></div><div class="lines"></div>

  <h2>Phần 5. Bộ quy tắc của lớp em</h2>
  <p>Nếu trường dùng AI để hỗ trợ xét học bổng, em đề xuất 3 quy tắc để đảm bảo công bằng.</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 9</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút)</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Toán 9:</b> bảng tần số, tần số tương đối, biểu đồ.<br><b>GDCD 9:</b> khách quan và công bằng. <b>Tin học 9:</b> đạo đức, pháp luật và văn hóa trong môi trường số; mặt trái của công nghệ.</td></tr>
    <tr><th>Thiết bị</th><td>1 máy tính và máy chiếu (hoặc máy cho từng nhóm).</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> giải thích thiên kiến của AI bắt nguồn từ dữ liệu; nhận biết thông tin đại diện; phân biệt "khớp dữ liệu" với "công bằng".</li>
    <li><b>Năng lực:</b> tính và so sánh tần số tương đối theo nhóm; dùng phép thử đổi một đặc điểm để kiểm tra; đề xuất cách giảm thiên kiến.</li>
    <li><b>Phẩm chất:</b> khách quan, công bằng; tôn trọng sự khác biệt; có trách nhiệm khi xây dựng và sử dụng công nghệ.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Hỏi: "Máy tính chỉ làm theo số liệu, vậy máy có thể thiên vị không?" Học sinh biểu quyết, ghi lại để quay lại cuối giờ.</td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Xem biểu đồ ở chế độ mặc định, kéo số suất học bổng. Bật sự cố <b>Dữ liệu cũ thiên vị</b>; quan sát hai đường ngưỡng tách nhau; bấm vào hồ sơ để làm phép thử đổi nơi ở. Mở <b>Soi</b> bước 1, 2.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Học sinh làm <b>Phần 1, 2</b>; nhóm làm <b>Phần 3</b> trên máy.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Hai sự cố còn lại; thảo luận <b>Phần 4</b>. Xem <b>Soi</b> bước 5, 6; nhóm viết <b>Phần 5</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Quay lại câu hỏi khởi động. Chốt: máy bắt chước dữ liệu; cần kiểm tra công bằng và để con người chịu trách nhiệm quyết định.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Tỉ lệ được chọn của hai khu khác nhau có chắc là thiên vị không?</td><td>Chưa chắc: cần so với năng lực thật của mỗi nhóm. Trong dự án, hai khu có năng lực như nhau nên chênh lệch lớn là dấu hiệu thiên vị. Phép thử đổi nơi ở cho bằng chứng rõ hơn.</td></tr>
    <tr><td>Bỏ hết thông tin về nơi ở là đủ chưa?</td><td>Chưa: thông tin đại diện như khoảng cách đến trường vẫn tiết lộ nơi ở. Cách sửa tận gốc là xét lại dữ liệu và kiểm tra kết quả.</td></tr>
    <tr><td>Có nên để AI tự quyết định học bổng?</td><td>Không nên. AI chỉ nên hỗ trợ; hội đồng xem lại, công khai tiêu chí, cho học sinh đề nghị xem xét lại.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> Phường Đông 59 ÷ 141 ≈ 0,42 = <b>42%</b>; Xã Tây 20 ÷ 99 ≈ 0,20 = <b>20%</b>. Có dấu hiệu thiên vị vì năng lực hai khu như nhau mà tỉ lệ chênh hơn gấp đôi. Chỉ nhìn tần số chưa đủ vì nếu năng lực hai nhóm khác nhau thật thì tỉ lệ cũng có thể khác.</p>
  <p><b>Phần 2:</b> An: 1,8 × 1,0 + 1,0 × 0,5 + (−0,8) × 0 = <b>2,3</b> (được chọn). Bình: 1,8 + 0,5 − 0,8 = <b>1,5</b> (bị loại). Chi: 1,8 × 0,5 + 1,0 × 1,0 = 0,9 + 1,0 = <b>1,9</b> (bị loại). An và Bình giống hệt nhau, chỉ khác nơi ở, nhưng kết quả khác nhau: không công bằng.</p>
  <p><b>Phần 3:</b> (với 20 suất) dùng khu vực: <b>16/80</b>; chỉ dùng khoảng cách: <b>16/80</b>; học từ dữ liệu đã xét lại: <b>0/80</b>.</p>
  <p><b>Phần 4:</b> học sinh Xã Tây đều ở xa trường nên khoảng cách gần như cho biết nơi ở. Ví dụ khác: trường tiểu học đã học, phương tiện đi học, có máy tính ở nhà hay không…</p>
  <p><b>Phần 5:</b> ví dụ: công khai tiêu chí; không dùng thông tin về nơi ở, giới tính, hoàn cảnh gia đình để trừ điểm; kiểm tra tỉ lệ theo nhóm mỗi năm; hội đồng xem lại danh sách; cho phép đề nghị xem xét lại.</p>

  <h2>5. Lưu ý</h2>
  <ul>
    <li>Toàn bộ hồ sơ, tên khu (Phường Đông, Xã Tây) và quyết định là <b>hư cấu</b>, do máy tạo ngẫu nhiên. Không dùng thông tin thật của học sinh trong lớp khi làm các hoạt động mở rộng.</li>
    <li>Máy trên trang dùng hồi quy logistic đơn giản (một dạng nơ-ron) với 2 đến 4 thông tin. "Xứng đáng theo năng lực" được tính từ điểm và giờ hoạt động, không có nhiễu.</li>
    <li>Tránh để thảo luận đi vào so sánh các nhóm học sinh thật trong lớp; giữ trọng tâm ở cách dữ liệu và máy tạo ra thiên vị.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> làm Phần 1, 2 với máy tính cầm tay; giáo viên thao tác máy trên màn chiếu.</li>
    <li><b>Học sinh khá, giỏi:</b> tìm số suất học bổng làm chênh lệch lớn nhất; giải thích vì sao "khớp dữ liệu đã học" tăng khi máy được biết nơi ở.</li>
    <li><b>Không có máy tính:</b> in 20 thẻ hồ sơ hư cấu, chia lớp thành hai "hội đồng" với hai bộ quy tắc (một bộ có điều kiện khắt khe theo nơi ở), so sánh danh sách và tính tần số tương đối.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 37 (Cảm xúc câu nói) cho thấy định kiến cũng có thể ẩn trong dữ liệu ngôn ngữ mà máy học.</p>
'''

DOC = dict(num="18", folder="18-hoc-bong", grade="9",
  phieu=dict(title="Phiếu học tập Dự án 18: Ai được nhận học bổng?", h1="Phiếu học tập: Ai được nhận học bổng?",
             lead="Dùng kèm Dự án 18: tần số tương đối theo nhóm, trọng số của máy, phép thử đổi nơi ở, thông tin đại diện.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 18: Thiên kiến và công bằng trong AI (lớp 9)", h1="Dự án 18: Ai được nhận học bổng?",
             lead="Một tiết học 45 phút giúp học sinh lớp 9 phát hiện thiên kiến của AI bằng tần số tương đối và phép thử đổi đặc điểm, rồi đề xuất cách làm cho máy công bằng.", body=gv_body)})
