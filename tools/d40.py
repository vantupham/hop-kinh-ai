phieu_body = '''
  <h2>Phần 1. Soi trợ lý mẫu</h2>
  <p>Dùng Dự án 40. Hỏi trợ lý từng câu, ghi lại khối nào quyết định câu trả lời và trợ lý làm gì (trả lời, từ chối, chuyển cô chủ nhiệm, chia nhóm).</p>
  <table><tr><th style="width:40%">Câu hỏi</th><th>Khối quyết định</th><th>Trợ lý làm gì</th><th>Có đúng mong đợi?</th></tr>
    <tr><td>Tuần này tổ nào trực nhật?</td><td></td><td></td><td></td></tr>
    <tr><td>Số điện thoại của bạn Nam là gì?</td><td></td><td></td><td></td></tr>
    <tr><td>Năm sau trường có xây bể bơi không?</td><td></td><td></td><td></td></tr>
    <tr><td>Chia lớp thành 4 nhóm thảo luận giúp mình</td><td></td><td></td><td></td></tr></table>

  <h2>Phần 2. Tính độ tự tin</h2>
  <p>Câu hỏi: "Khi nào kiểm tra giữa kì Toán?" Sau khi bỏ từ thừa ("khi", "nào"), từ quan trọng là: <b>kiem, tra, giua, ki, toan</b>. Đoạn sổ tay "Lịch kiểm tra" có từ khóa: kiem, tra, giua, ki, lich, thi.</p>
  <p>a) Số từ khớp: ……… b) Độ tự tin = số từ khớp ÷ số từ quan trọng = ……… c) Với ngưỡng 0,4, trợ lý trả lời hay chuyển cô chủ nhiệm? Với ngưỡng 0,9 thì sao?</p>
  <div class="lines"></div>

  <h2 class="page-break">Phần 3. Bản thiết kế trợ lý của nhóm em</h2>
  <p>Chọn một nhiệm vụ cho trợ lý (hỏi đáp lịch lớp, nhắc bài tập, gợi ý sách đọc, hỏi đáp câu lạc bộ…).</p>
  <table><tr><th style="width:32%">Mục</th><th>Nhóm em quyết định</th></tr>
    <tr><td>Trợ lý giúp ai, làm việc gì?</td><td style="height:44px"></td></tr>
    <tr><td>Dữ liệu cần có (không có thông tin cá nhân)</td><td style="height:44px"></td></tr>
    <tr><td>Thông tin trợ lý tuyệt đối không được nói ra</td><td style="height:44px"></td></tr>
    <tr><td>Khi không chắc chắn, trợ lý chuyển cho ai?</td><td style="height:44px"></td></tr>
    <tr><td>Các khối (vẽ sơ đồ)</td><td style="height:90px"></td></tr></table>

  <h2>Phần 4. Bộ câu kiểm thử và tự đánh giá</h2>
  <p>Viết 8 câu kiểm thử: ít nhất 4 câu trợ lý phải trả lời được, 2 câu hỏi thông tin riêng (phải từ chối), 2 câu ngoài phạm vi (phải chuyển cho người thật).</p>
  <table><tr><th style="width:6%">#</th><th style="width:44%">Câu kiểm thử</th><th>Loại</th><th>Mong đợi</th></tr>
    <tr><td>1</td><td></td><td></td><td></td></tr><tr><td>2</td><td></td><td></td><td></td></tr><tr><td>3</td><td></td><td></td><td></td></tr><tr><td>4</td><td></td><td></td><td></td></tr>
    <tr><td>5</td><td></td><td></td><td></td></tr><tr><td>6</td><td></td><td></td><td></td></tr><tr><td>7</td><td></td><td></td><td></td></tr><tr><td>8</td><td></td><td></td><td></td></tr></table>
  <table><tr><th>Tiêu chí</th><th>Hữu ích</th><th>Trung thực</th><th>Riêng tư</th><th>Công bằng</th></tr><tr><td>Nhóm tự chấm (0–10)</td><td></td><td></td><td></td><td></td></tr><tr><td>Nhóm bạn chấm (0–10)</td><td></td><td></td><td></td><td></td></tr></table>
  <p>Điều nhóm em sẽ sửa sau khi nhận góp ý:</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 9 (dự án tổng kết nhánh THCS)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút) trên lớp; dự án nhóm 1–2 tuần nếu triển khai Phần 3, 4 đầy đủ</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Hoạt động trải nghiệm, hướng nghiệp 9:</b> dự án phục vụ cộng đồng lớp học.<br><b>Tin học 9:</b> giải quyết vấn đề với sự trợ giúp của máy tính; đạo đức, pháp luật trong môi trường số. <b>GDCD 9:</b> tôn trọng quyền riêng tư, công bằng, trách nhiệm.</td></tr>
    <tr><th>Thiết bị</th><td>1 máy tính và máy chiếu; máy cho từng nhóm nếu có. Dự án nhóm có thể làm trên giấy hoặc bằng Python.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> mô tả một hệ thống AI được ghép từ nhiều khối; giải thích vai trò của lọc riêng tư, ngưỡng tự tin, kiểm tra công bằng.</li>
    <li><b>Năng lực:</b> thiết kế một trợ lý đơn giản, viết bộ câu kiểm thử, tự đánh giá theo tiêu chí và tiếp nhận góp ý.</li>
    <li><b>Phẩm chất:</b> trách nhiệm với cộng đồng lớp học; tôn trọng quyền riêng tư; trung thực (biết nói "không biết").</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Câu hỏi: "Trợ lý trả lời được mọi câu có phải trợ lý tốt?" Ghi ý kiến lên bảng.</td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Hỏi 12 câu kiểm thử, theo dõi sơ đồ khối và bảng tự đánh giá. Mở <b>Soi bên trong</b> bước 1 đến 5. Làm <b>Phần 1, 2</b>.</td></tr>
    <tr><td><b>Phá máy</b></td><td>10 phút</td><td>Bật 3 sự cố, sửa bằng công tắc trên sơ đồ. Thảo luận mỗi lỗi gây hại cho ai.</td></tr>
    <tr><td><b>Thiết kế</b></td><td>15 phút</td><td>Nhóm làm <b>Phần 3</b> và bắt đầu <b>Phần 4</b>; giao phần còn lại làm dự án ở nhà.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Quay lại câu hỏi khởi động. Chốt: AI tốt là AI hữu ích, trung thực, tôn trọng riêng tư và công bằng.</td></tr>
  </table>
  <p><b>Gợi ý dự án nhóm (1–2 tuần):</b> tuần 1 hoàn thiện bản thiết kế và bộ câu kiểm thử, giáo viên duyệt dữ liệu (không có thông tin cá nhân); tuần 2 làm trợ lý (trên giấy, bảng tính hoặc Python), trình bày, các nhóm chấm chéo theo 4 tiêu chí.</p>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Nếu trợ lý không cần bảng điểm, có nên đưa bảng điểm vào không?</td><td>Không. Nguyên tắc tối thiểu dữ liệu: chỉ đưa những gì thật sự cần. Dữ liệu không có thì không thể bị lộ.</td></tr>
    <tr><td>Ngưỡng tự tin bao nhiêu là hợp lí?</td><td>Phải cân bằng: thấp quá thì trả lời bừa (kém trung thực), cao quá thì chuyển cả câu dễ (kém hữu ích). Thử nhiều mức trên bộ câu kiểm thử để chọn.</td></tr>
    <tr><td>Vì sao cần nhóm khác chấm trợ lý của mình?</td><td>Người làm dễ bỏ sót lỗi của chính mình; người dùng thật nghĩ ra những câu hỏi khác.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> trực nhật: khối 2 (tra sổ tay) → trả lời "Tổ 2", đúng. Số điện thoại: khối 3 (lọc riêng tư) → từ chối, đúng. Bể bơi: khối 4 (tự tin 0,33 dưới ngưỡng 0,40) → chuyển cô chủ nhiệm, đúng. Chia nhóm: khối chia nhóm cân bằng → 4 nhóm sức học gần bằng nhau, đúng.</p>
  <p><b>Phần 2:</b> a) khớp 4 từ (kiem, tra, giua, ki). b) 4 ÷ 5 = <b>0,8</b>. c) Ngưỡng 0,4: trả lời. Ngưỡng 0,9: chuyển cô chủ nhiệm (dù sổ tay có thông tin): kém hữu ích.</p>
  <p><b>Phần 3, 4:</b> tùy nhóm. Kiểm tra: dữ liệu không có thông tin cá nhân; có danh sách thông tin cấm nói; có người thật nhận câu hỏi khó; bộ câu kiểm thử đủ ba loại.</p>

  <h2>5. Lưu ý</h2>
  <ul>
    <li>Tên học sinh, số điện thoại (dạng 09xx xxx …), địa chỉ và điểm trên trang đều <b>hư cấu</b>. Khi làm dự án thật, tuyệt đối không dùng thông tin cá nhân của học sinh.</li>
    <li>Chia nhóm cân bằng dùng điểm số nội bộ; trợ lý chỉ thông báo tên thành viên các nhóm. Hình minh họa trên trang hiển thị trung bình nhóm để học sinh thấy sự chênh lệch; khi dùng thật không nên công khai.</li>
    <li>Đây là dự án tổng kết: khuyến khích học sinh nhắc lại dự án nào đã học được mỗi khối (xem <b>Soi</b> bước 1).</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> làm Phần 1, 2; tham gia Phần 3 với vai trò viết câu kiểm thử.</li>
    <li><b>Học sinh khá, giỏi:</b> lập trình trợ lý bằng Python với 5 khối, tự động chấm bộ câu kiểm thử.</li>
    <li><b>Không có máy tính:</b> "trợ lý người": mỗi học sinh đóng vai một khối, cầm thẻ quy tắc của khối mình; câu hỏi được chuyền qua từng bạn.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 20 (Trợ lý hỏi đáp SGK) cho thấy cách máy tìm đoạn văn liên quan rồi trả lời có ghi nguồn. Sau Dự án 40, học sinh có thể chuyển sang nhánh nâng cao (Dự án 1–20).</p>
'''

DOC = dict(num="40", folder="40-tro-ly-lop", grade="9",
  phieu=dict(title="Phiếu học tập Dự án 40: Trợ lý lớp học của em", h1="Phiếu học tập: Trợ lý lớp học của em",
             lead="Dùng kèm Dự án 40: soi trợ lý mẫu, tính độ tự tin, bản thiết kế trợ lý của nhóm, bộ câu kiểm thử và tự đánh giá.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 40: Trợ lý lớp học có trách nhiệm (lớp 9)", h1="Dự án 40: Trợ lý lớp học của em",
             lead="Dự án tổng kết nhánh THCS: học sinh lắp ráp, kiểm thử và tự đánh giá một trợ lý AI cho lớp theo bốn tiêu chí hữu ích, trung thực, riêng tư, công bằng.", body=gv_body)})
