RULES = [("1", "Chào hỏi", "xin chào, chào, hello"), ("2", "Giờ mở cửa", "mở cửa, mấy giờ, đóng cửa, giờ"), ("3", "Mượn sách", "mượn, mượn sách"), ("4", "Hạn trả sách", "trả, hạn, bao lâu, gia hạn"), ("5", "Mất, hỏng sách", "mất, làm mất, mất sách, hỏng"), ("6", "Tìm sách", "tìm, ở đâu, kệ, giá sách"), ("7", "Cảm ơn", "cảm ơn, cám ơn")]
rules = "".join(f"<tr><td>{a}</td><td>{b}</td><td>{c}</td></tr>" for a, b, c in RULES)
QS = ["Mấy giờ thư viện đóng cửa?", "Được mượn sách trong bao lâu?", "Em làm mất sách thì phải trả bao nhiêu tiền?", "Em muốn tìm sách ở đâu?"]
qs = "".join(f"<tr><td>{chr(97+i)}) {q}</td><td></td><td></td><td></td><td></td></tr>" for i, q in enumerate(QS))
phieu_body = f'''
  <h2>Phần 1. Chuẩn hóa câu hỏi</h2>
  <p>Viết lại mỗi câu sau khi: đổi về chữ thường, bỏ dấu câu, bỏ khoảng trắng thừa. Cột cuối: viết thêm bản đã bỏ dấu tiếng Việt.</p>
  <table><tr><th>Câu gốc</th><th>Chữ thường, bỏ dấu câu</th><th>Bỏ dấu tiếng Việt</th></tr>
    <tr><td>Thư viện MỞ CỬA lúc mấy giờ???</td><td></td><td></td></tr>
    <tr><td>Cảm   ơn   Kính!!</td><td></td><td></td></tr>
    <tr><td>Đóng cửa lúc nào vậy?</td><td></td><td></td></tr></table>

  <h2>Phần 2. Làm chatbot bằng tay</h2>
  <p>Bộ luật của chatbot (theo thứ tự):</p>
  <table><tr><th style="width:8%">Số</th><th style="width:26%">Luật</th><th>Từ khóa</th></tr>{rules}</table>
  <p>Với mỗi câu hỏi, ghi các luật có khớp và số từ khóa khớp (ví dụ: 2 → 3 từ). Cho biết luật được chọn khi <b>chọn luật khớp nhiều nhất</b> và khi <b>chọn luật đầu tiên khớp</b>. Đánh dấu nếu chatbot trả lời sai ý.</p>
  <table><tr><th style="width:34%">Câu hỏi</th><th>Luật khớp (số từ)</th><th>Khớp nhiều nhất</th><th>Đầu tiên khớp</th><th>Đúng ý?</th></tr>{qs}</table>

  <h2 class="page-break">Phần 3. Sửa chatbot</h2>
  <p>a) Ở Phần 2, câu nào chatbot trả lời sai dù dùng cách "khớp nhiều nhất"? Em sẽ sửa thế nào (thêm, bớt từ khóa hay đổi luật)?</p>
  <div class="lines"></div><div class="lines"></div>
  <p>b) Câu "Thư viện có cho mượn máy tính không?" được trả lời về mượn sách. Viết một luật mới để sửa.</p>
  <table><tr><th style="width:40%">Nếu câu hỏi có từ khóa</th><th>thì trả lời</th></tr><tr><td style="height:40px"></td><td></td></tr></table>

  <h2>Phần 4. Chatbot của em</h2>
  <p>Chọn một chủ đề (căng tin, câu lạc bộ, lịch kiểm tra…) và viết 3 luật. Đổi phiếu với bạn: bạn hỏi 5 câu, em ghi số câu chatbot trả lời đúng.</p>
  <table><tr><th style="width:8%">Số</th><th style="width:40%">Từ khóa</th><th>Câu trả lời</th></tr><tr><td>1</td><td></td><td></td></tr><tr><td>2</td><td></td><td></td></tr><tr><td>3</td><td></td><td></td></tr></table>
  <p>Số câu đúng: …… / 5. Một câu bạn hỏi mà chatbot của em không trả lời được: ……………………………………</p>

  <h2>Phần 5. So sánh</h2>
  <p>Nêu một điểm mạnh và một điểm yếu của chatbot theo luật so với chatbot AI học từ dữ liệu.</p>
  <div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 8</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút); mở rộng thêm 1 tiết nếu cho học sinh lập trình bằng Python</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Tin học 8:</b> cấu trúc rẽ nhánh (nếu… thì…), kiểu dữ liệu xâu kí tự, giải quyết vấn đề với sự trợ giúp của máy tính; đạo đức và văn hóa khi dùng AI.<br><b>Ngữ văn 8:</b> đặt câu hỏi rõ ràng, các cách diễn đạt khác nhau cho cùng một ý.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Tốt hơn: mỗi nhóm 2–3 học sinh một máy. Không cần camera, micro hay mạng sau khi tải trang.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> mô tả chatbot theo luật gồm các bước chuẩn hóa, dò từ khóa, chọn luật, trả lời; phân biệt chatbot theo luật và chatbot học từ dữ liệu.</li>
    <li><b>Năng lực:</b> viết luật nếu… thì…; kiểm thử chatbot bằng bộ câu hỏi; tìm và sửa lỗi (câu lạ, câu không dấu, luật chồng chéo).</li>
    <li><b>Phẩm chất:</b> có trách nhiệm khi làm công cụ trả lời người khác; biết kiểm tra lại thông tin chatbot đưa ra.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Một học sinh đóng vai "chatbot" chỉ được trả lời bằng 5 câu viết sẵn trên bảng; cả lớp hỏi và xem "chatbot" lúng túng ra sao.</td></tr>
    <tr><td><b>Khám phá</b></td><td>10 phút</td><td>Hỏi chatbot trên trang bằng các câu thử; quan sát luật được chọn và từ khóa khớp. Mở <b>Soi bên trong</b> bước 1 đến 4. Làm <b>Phần 1</b>.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Làm <b>Phần 2</b> bằng tay rồi kiểm tra trên trang (bật/tắt "Chọn luật khớp nhiều nhất"). Nâng điểm câu thử lên 11/12 bằng cách bật bỏ dấu và thêm luật.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>14 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b> và sửa. Nhóm làm <b>Phần 3, 4</b>: viết chatbot cho chủ đề riêng, đổi phiếu kiểm thử.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Xem <b>Soi</b> bước 6, làm <b>Phần 5</b>. Nhấn mạnh: dù chatbot nào, thông tin quan trọng vẫn cần kiểm tra lại.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Chatbot có "hiểu" câu hỏi không?</td><td>Không. Nó chỉ so chữ: câu có chứa từ khóa nào. Vì vậy câu có chữ "mượn" nhưng hỏi về máy tính vẫn bị trả lời về sách.</td></tr>
    <tr><td>Thêm thật nhiều từ khóa có làm chatbot tốt hơn không?</td><td>Không hẳn. Từ khóa quá chung (như "giờ", "trả") khớp với cả những câu không liên quan và gây chồng chéo. Cần thử lại bộ câu hỏi sau mỗi lần sửa.</td></tr>
    <tr><td>Vì sao chatbot cần câu mặc định "chưa hiểu"?</td><td>Trả lời "chưa hiểu, hãy hỏi cô thủ thư" an toàn hơn trả lời bừa. Chatbot tốt biết giới hạn của mình.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> "thư viện mở cửa lúc mấy giờ" → "thu vien mo cua luc may gio"; "cảm ơn kính" → "cam on kinh"; "đóng cửa lúc nào vậy" → "dong cua luc nao vay".</p>
  <p><b>Phần 2:</b></p>
  <table><tr><th>Câu</th><th>Luật khớp (số từ)</th><th>Khớp nhiều nhất</th><th>Đầu tiên khớp</th><th>Đúng ý?</th></tr>
    <tr><td>a</td><td>2 (3 từ: mấy giờ, đóng cửa, giờ)</td><td>2 Giờ mở cửa</td><td>2 Giờ mở cửa</td><td>Đúng</td></tr>
    <tr><td>b</td><td>3 (2 từ: mượn, mượn sách); 4 (1 từ: bao lâu)</td><td>3 Mượn sách</td><td>3 Mượn sách</td><td>Sai (hỏi thời hạn)</td></tr>
    <tr><td>c</td><td>4 (1 từ: trả); 5 (3 từ: mất, làm mất, mất sách)</td><td>5 Mất, hỏng sách</td><td>4 Hạn trả sách</td><td>Đúng với "nhiều nhất", sai với "đầu tiên"</td></tr>
    <tr><td>d</td><td>6 (2 từ: tìm, ở đâu)</td><td>6 Tìm sách</td><td>6 Tìm sách</td><td>Đúng</td></tr></table>
  <p><b>Phần 3:</b> a) Câu b. Cách sửa ví dụ: thêm từ khóa "trong bao lâu", "được mượn" vào luật 4, khi đó luật 4 khớp 3 từ, nhiều hơn luật 3 (2 từ). Lưu ý: nếu hai luật khớp bằng nhau, chatbot chọn luật đứng trước. b) Ví dụ: từ khóa "máy tính, mượn máy tính" → "Thư viện có 10 máy tính, dùng tại chỗ theo giờ, không cho mang về."</p>
  <p><b>Phần 5:</b> điểm mạnh: biết rõ vì sao trả lời, dễ sửa, không bịa thông tin ngoài luật. Điểm yếu: chỉ biết những gì đã viết, câu hỏi lạ hoặc diễn đạt khác thì trả lời sai hoặc không trả lời được.</p>

  <h2>5. Lưu ý</h2>
  <ul>
    <li>Trang dùng cách khớp cả cụm từ (cả từ "giờ" chứ không phải chữ "giờ" bên trong từ khác) để học sinh dễ dự đoán; chatbot thật thường phức tạp hơn.</li>
    <li>Luật học sinh thêm chỉ lưu trên trang đang mở, tải lại trang sẽ mất. Khuyến khích ghi luật vào phiếu.</li>
    <li>Chatbot AI hiện đại (như các trợ lý trò chuyện) không dùng luật viết tay mà học từ dữ liệu rất lớn. Nhắc học sinh không nhập thông tin cá nhân vào chatbot trên mạng.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> làm Phần 2 chỉ với cách "khớp nhiều nhất".</li>
    <li><b>Học sinh khá, giỏi:</b> viết chatbot theo luật bằng Python (dùng <code>lower()</code>, <code>in</code> và <code>if</code>), thêm bộ câu thử để tự đếm số câu đúng.</li>
    <li><b>Không có máy tính:</b> làm chatbot bằng thẻ giấy: mỗi luật một thẻ ghi từ khóa và câu trả lời; một học sinh đóng vai máy, đọc câu hỏi và chọn thẻ theo đúng quy tắc.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 20 (Hỏi đáp) cho thấy máy tìm câu trả lời bằng cách đo độ giống nhau giữa câu hỏi và các đoạn văn, thay vì luật viết tay.</p>
'''

DOC = dict(num="35", folder="35-chatbot", grade="8",
  phieu=dict(title="Phiếu học tập Dự án 35: Tự làm chatbot theo luật", h1="Phiếu học tập: Tự làm chatbot theo luật",
             lead="Dùng kèm Dự án 35: chuẩn hóa câu hỏi, chạy chatbot bằng tay, sửa luật và viết chatbot của riêng em.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 35: Chatbot theo luật (lớp 8)", h1="Dự án 35: Tự làm chatbot theo luật",
             lead="Một tiết học 45 phút giúp học sinh lớp 8 tự xây chatbot bằng luật nếu… thì…, kiểm thử bằng câu hỏi thật và thấy rõ giới hạn của nó.", body=gv_body)})
