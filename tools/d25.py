MSGS = [("A", "Bạn trúng thưởng, bấm link nhận quà miễn phí"), ("B", "Mẹ nhắc con chuyển khoản tiền học cho cô nhé"),
        ("C", "Gửi mã OTP gấp để mở khóa tài khoản"), ("D", "Link bài tập cô gửi trong nhóm lớp nhé"), ("E", "Con bị tai nạn, chuyển khoản gấp cho con")]
rows = "".join(f"<tr><td><b>{k}</b></td><td>{m}</td><td></td><td></td></tr>" for k, m in MSGS)
th = "".join(f"<tr><td>{t}</td><td></td><td></td><td></td></tr>" for t in ["0", "3", "5"])

phieu_body = f'''
  <h2>Phần 1. Bảng điểm của máy lọc</h2>
  <p>Máy lọc đã học được bảng điểm dưới đây. Từ không có trong bảng được 0 điểm.</p>
  <table><tr><th>Từ</th><th>trúng thưởng</th><th>mã OTP</th><th>chuyển khoản</th><th>gấp</th><th>miễn phí</th><th>link</th><th>nhé</th></tr>
    <tr><td><b>Điểm</b></td><td>+3</td><td>+4</td><td>+2</td><td>+2</td><td>+2</td><td>+1</td><td>−2</td></tr></table>

  <h2>Phần 2. Em làm máy lọc</h2>
  <p>Gạch chân các từ có trong bảng, cộng điểm cho từng tin. Theo em, tin đó là lừa đảo (L) hay an toàn (A)?</p>
  <table><tr><th style="width:6%">Tin</th><th>Nội dung</th><th style="width:14%">Điểm</th><th style="width:16%">Em nghĩ: L / A</th></tr>{rows}</table>

  <h2 class="page-break">Phần 3. Chọn ngưỡng chặn</h2>
  <p>Tin có điểm <b>từ ngưỡng trở lên</b> bị chặn. Với mỗi ngưỡng, ghi các tin bị chặn, đếm số tin <b>chặn nhầm</b> (tin an toàn bị chặn) và <b>lọt lưới</b> (tin lừa đảo không bị chặn).</p>
  <table><tr><th style="width:14%">Ngưỡng</th><th>Các tin bị chặn</th><th style="width:16%">Chặn nhầm</th><th style="width:16%">Lọt lưới</th></tr>{th}</table>
  <p>Em chọn ngưỡng nào? Vì sao?</p>
  <div class="lines"></div><div class="lines"></div>

  <h2>Phần 4. Kẻ gian lách luật</h2>
  <p>Kẻ gian sửa tin C thành: <b>"G.ửi m.ã 0TP g.ấ.p để mở khóa tài khoản"</b>. Máy lọc ở Phần 1 chấm được mấy điểm? Vì sao? Máy lọc nên làm gì để không bị lừa?</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>

  <h2>Phần 5. Em là lá chắn cuối cùng</h2>
  <p>Viết 3 việc em sẽ làm khi nhận được một tin nhắn giống tin E.</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 6 (dùng được cho lớp 7, 8 trong chủ đề an toàn thông tin)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà cùng gia đình</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Tin học 6:</b> chủ đề Đạo đức, pháp luật và văn hóa trong môi trường số: an toàn thông tin trên Internet, nhận biết thông tin xấu, lừa đảo; bảo vệ thông tin cá nhân.<br><b>GDCD 6:</b> ứng phó với tình huống nguy hiểm.<br><b>Toán 6:</b> cộng số nguyên (điểm âm, điểm dương).</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Tốt nhất: 1 máy tính cho mỗi nhóm 2–3 học sinh. Không cần camera, không cần cài đặt, không gửi dữ liệu đi đâu.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> nêu được các dấu hiệu thường gặp của tin nhắn lừa đảo; mô tả được cách máy lọc chấm điểm từ khóa, so với ngưỡng và học điểm từ các ví dụ có nhãn.</li>
    <li><b>Năng lực:</b> tính điểm và chọn ngưỡng cho một bộ lọc đơn giản; giải thích sự đánh đổi giữa chặn nhầm và lọt lưới; nhận ra cách kẻ gian lách bộ lọc.</li>
    <li><b>Phẩm chất:</b> cảnh giác, có trách nhiệm bảo vệ thông tin cá nhân của mình và của gia đình.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Đọc to 2 tin trong hộp thư ở mục <b>Chơi</b>. Hỏi: <i>"Tin nào em sẽ trả lời ngay? Tin nào làm em thấy lạ? Vì sao?"</i> Ghi các dấu hiệu học sinh nêu lên bảng.</td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Học sinh làm <b>Phần 1, 2</b> của phiếu: tự làm máy lọc bằng tay. Sau đó gõ vài tin vào ô <b>Thử viết một tin nhắn</b> để so với điểm máy chấm. Đi qua <b>Soi bên trong</b> bước 1 đến 4.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Học sinh làm <b>Phần 3</b>, rồi kéo thanh <b>Ngưỡng chặn</b> trên trang và quan sát biểu đồ, số chặn nhầm, lọt lưới. Xem <b>Soi</b> bước 5 (máy học điểm từ ví dụ) và thử dán nhãn một tin.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>. Học sinh làm <b>Phần 4</b>. Kết thúc bằng <b>Soi</b> bước 6: 5 dấu hiệu lừa đảo, và <b>Phần 5</b> của phiếu.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại: máy lọc giúp em nhưng có lúc sai; không đưa mã OTP cho ai; gọi lại bằng số quen trước khi chuyển tiền. Giao thử thách một sao làm cùng bố mẹ.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Vì sao từ "để", "nhận" lại có điểm nghi ngờ cao?</td><td>Trong bộ dữ liệu nhỏ, các từ này hay xuất hiện trong tin lừa đảo ("để nhận quà"). Máy chỉ đếm, không hiểu nghĩa, nên học cả những từ bình thường. Cần nhiều ví dụ đa dạng hơn để máy học tốt hơn.</td></tr>
    <tr><td>Nên chọn ngưỡng thấp hay cao?</td><td>Tùy hậu quả. Chặn nhầm tin của mẹ gây phiền; lọt lưới tin lừa có thể mất tiền. Thường người ta chọn ngưỡng vừa phải và đưa tin nghi ngờ vào mục riêng để người dùng tự xem.</td></tr>
    <tr><td>Có máy lọc nào chặn được mọi tin lừa đảo không?</td><td>Không. Kẻ gian luôn nghĩ ra kiểu mới hoặc cách viết lách. Vì vậy mỗi người vẫn cần biết các dấu hiệu và cách tự bảo vệ.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 2:</b> A: trúng thưởng (+3), link (+1), miễn phí (+2) = <b>6</b>, L. B: chuyển khoản (+2), nhé (−2) = <b>0</b>, A. C: mã OTP (+4), gấp (+2) = <b>6</b>, L. D: link (+1), nhé (−2) = <b>−1</b>, A. E: chuyển khoản (+2), gấp (+2) = <b>4</b>, L.</p>
  <p><b>Phần 3:</b> ngưỡng 0: chặn A, B, C, E (chặn nhầm 1 là tin B, lọt lưới 0). Ngưỡng 3: chặn A, C, E (chặn nhầm 0, lọt lưới 0). Ngưỡng 5: chặn A, C (chặn nhầm 0, lọt lưới 1 là tin E). Ngưỡng 3 tốt nhất với 5 tin này.</p>
  <p><b>Phần 4:</b> chỉ còn 0 điểm vì "m.ã 0TP", "g.ấ.p" không khớp với từ trong bảng. Máy lọc nên chuẩn hóa chữ (bỏ dấu chấm xen giữa, đổi số 0 thành chữ o) trước khi tra điểm, và học thêm từ các tin lách luật được báo cáo.</p>
  <p><b>Phần 5:</b> ví dụ: không chuyển tiền ngay; gọi lại cho người thân bằng số điện thoại quen; báo bố mẹ, thầy cô; không bấm link, không đưa mã OTP.</p>

  <h2>5. Lưu ý về kiến thức và an toàn</h2>
  <ul>
    <li>Toàn bộ tin nhắn trong dự án là tin <b>tự viết, hư cấu</b>; đường link dùng tên miền <code>.example</code> không tồn tại. Khi học sinh làm thử thách nhóm, nhắc các em <b>không chép tin thật có số điện thoại, số tài khoản</b>.</li>
    <li>Máy lọc trong dự án là bộ lọc kiểu "Bayes ngây thơ" rất đơn giản: điểm mỗi từ = mức chênh giữa tỉ lệ xuất hiện trong tin lừa và tin an toàn. Nhiều bộ lọc thư rác thật từng dùng ý tưởng này.</li>
    <li>Tên người gửi (ví dụ "Số lạ") không được tính điểm, để học sinh thấy máy chỉ dựa vào nội dung. Có thể thảo luận: trong thực tế, số lạ cũng là một dấu hiệu cần cảnh giác.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> chỉ dùng 3 từ khóa đầu tiên trong bảng điểm.</li>
    <li><b>Học sinh khá, giỏi:</b> đề xuất thêm từ mới vào bảng điểm Phần 1 sao cho không còn tin nào bị chặn nhầm hay lọt lưới ở ngưỡng 3.</li>
    <li><b>Không có máy tính:</b> trò chơi "máy lọc người": giáo viên đọc tin, một nhóm cộng điểm theo bảng, nhóm kia đóng vai kẻ gian sửa tin để lách luật.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 17 (Máy hiểu cảm xúc) cho thấy máy biến mỗi từ thành một dãy số để hiểu nghĩa tốt hơn là chỉ đếm từ khóa.</p>
'''

DOC = dict(num="25", folder="25-la-chan",
  phieu=dict(title="Phiếu học tập Dự án 25: Lá chắn tin nhắn lừa đảo", h1="Phiếu học tập: Lá chắn tin nhắn lừa đảo",
             lead="Dùng kèm Dự án 25 hoặc làm riêng trên lớp: tự làm máy lọc bằng bảng điểm từ khóa, chọn ngưỡng chặn, nhận diện cách kẻ gian lách luật.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 25: Máy lọc tin nhắn và an toàn thông tin (lớp 6)", h1="Dự án 25: Lá chắn tin nhắn lừa đảo",
             lead="Một tiết học 45 phút giúp học sinh lớp 6 nhận biết tin nhắn lừa đảo, hiểu cách máy lọc chấm điểm, chọn ngưỡng và học từ ví dụ có nhãn.", body=gv_body)})
