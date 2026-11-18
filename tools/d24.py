MAZE = ["#######", "#....G#", "#.##.##", "#.#...#", "#.#.#.#", "#S..#.#", "#######"]

def maze(rows, nums=None):
    h = '<div class="pix-grid" style="grid-template-columns:repeat(%d,auto)">' % len(rows[0])
    for y, r in enumerate(rows):
        for x, c in enumerate(r):
            if c == "#": h += '<span class="on"></span>'
            elif c == "S": h += '<span>R</span>'
            elif c == "G": h += '<span>C</span>'
            else: h += '<span></span>'
    return h + "</div>"

phieu_body = f'''
  <p class="small muted">Quy ước trong phiếu: ô tô đậm là <b>tường</b>, <b>R</b> là robot (lúc đầu quay mặt lên trên), <b>C</b> là lá cờ.</p>
  <h2>Phần 1. Lập trình cho robot</h2>
  <p>Dùng các lệnh <b>Tiến</b>, <b>Rẽ trái</b>, <b>Rẽ phải</b> (rẽ là quay tại chỗ, không di chuyển) để đưa robot tới cờ. Viết từng lệnh một.</p>
  {maze(MAZE)}
  <div class="lines"></div><div class="lines"></div>
  <p>Chương trình của em có ……… lệnh.</p>

  <h2>Phần 2. Gom lệnh bằng vòng lặp</h2>
  <p>Viết lại chương trình ở Phần 1, gom các lệnh <b>Tiến</b> liền nhau thành "Tiến × số lần". Chương trình mới có ……… khối.</p>
  <div class="lines"></div><div class="lines"></div>

  <h2 class="page-break">Phần 3. Sơ đồ khối bám tường</h2>
  <p>Hoàn thành sơ đồ khối của thuật toán <b>bám tường phải</b> bằng cách điền vào chỗ trống: <b>Tiến</b>, <b>Rẽ trái</b>, <b>Rẽ phải rồi tiến</b>.</p>
  <table><tr><th style="width:45%">Điều kiện</th><th>Nếu đúng thì</th></tr>
    <tr><td>Đã tới cờ?</td><td>Dừng lại</td></tr>
    <tr><td>Bên phải trống?</td><td>…………………………………</td></tr>
    <tr><td>Phía trước trống?</td><td>…………………………………</td></tr>
    <tr><td>Không ô nào trống</td><td>…………………………………</td></tr></table>
  <p>Sau mỗi lần làm, quay lại kiểm tra từ dòng đầu. Đây là cấu trúc <b>lặp</b> kết hợp <b>rẽ nhánh</b>.</p>

  <h2>Phần 4. Làm robot tự học</h2>
  <p>Robot đã đi thử và tới được cờ. Hãy giúp robot ghi nhớ: viết vào mỗi ô trống <b>số bước ít nhất</b> để đi từ ô đó tới cờ (ô cờ là 0).</p>
  {maze(MAZE)}
  <p>Từ ô R, nếu luôn đi sang ô bên cạnh có số <b>nhỏ hơn</b>, robot cần ……… bước để tới cờ.</p>

  <h2>Phần 5. Lệnh hay học?</h2>
  <p>Mê cung bị đổi chỗ một bức tường. Chương trình ở Phần 1 còn dùng được không? Robot tự học sẽ làm gì? Cách nào em thấy hợp hơn cho robot hút bụi trong nhà em? Vì sao?</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 6 (dùng được cho lớp 7, 8 khi học lập trình trực quan)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Tin học 6:</b> chủ đề Giải quyết vấn đề với sự trợ giúp của máy tính: khái niệm thuật toán; ba cấu trúc điều khiển tuần tự, rẽ nhánh, lặp; mô tả thuật toán bằng sơ đồ khối.<br>Có thể nối tiếp với Scratch ở lớp 7.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Tốt nhất: 1 máy tính cho mỗi nhóm 2–3 học sinh. Không cần camera, không cần cài đặt. Phiếu học tập in sẵn.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> nêu được thuật toán là dãy các bước rõ ràng; nhận biết ba cấu trúc tuần tự, lặp, rẽ nhánh; mô tả được cách một máy "học" từ các lần thử và ghi nhớ.</li>
    <li><b>Năng lực:</b> viết và gỡ lỗi chương trình đơn giản bằng khối lệnh; so sánh ưu, nhược điểm của chương trình viết sẵn và máy tự học.</li>
    <li><b>Phẩm chất:</b> kiên trì khi tìm lỗi; làm việc nhóm, thay phiên điều khiển.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Trò chơi "robot người": một học sinh bịt mắt, cả lớp đọc lệnh Tiến/Rẽ trái/Rẽ phải để đưa bạn tới cửa lớp. Hỏi: <i>"Nếu đổi chỗ một cái bàn, dãy lệnh vừa rồi còn đúng không?"</i></td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Học sinh làm <b>Phần 1, 2</b> của phiếu, sau đó nhập chương trình vào mục <b>Chơi</b> và bấm <b>Chạy</b> để kiểm tra. Giáo viên giới thiệu khối <b>Lặp: bám tường phải</b> và mở <b>Soi bên trong</b> bước 1 đến 3. Học sinh làm <b>Phần 3</b>.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Các nhóm bấm <b>Thử 1 lần</b> vài lần rồi <b>Thử 20 lần</b> cho robot tự học, quan sát biểu đồ và các con số trên mê cung. Xem <b>Soi</b> bước 4 đến 6. Học sinh làm <b>Phần 4</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>. Với sự cố "Sai một lệnh", cho các nhóm thi tìm và sửa lệnh lỗi nhanh nhất. Thảo luận câu hỏi ở Phần 5.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại 3 thẻ kiến thức. Giao thử thách một sao: robot người ở nhà.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Vì sao khối bám tường chạy được ở cả hai mê cung, còn dãy lệnh thì không?</td><td>Khối bám tường có rẽ nhánh: robot nhìn tình huống ở mỗi ô rồi mới chọn việc. Dãy lệnh cố định chỉ đúng cho đúng một mê cung.</td></tr>
    <tr><td>Robot tự học có "thông minh" hơn robot làm theo lệnh không?</td><td>Mỗi cách có điểm mạnh riêng. Robot làm theo lệnh nhanh, chính xác, không cần thử; robot tự học thích nghi được nhưng tốn nhiều lần thử và cần trí nhớ. Nhiều hệ thống AI thật kết hợp cả hai.</td></tr>
    <tr><td>Nếu tắt trí nhớ, robot tự học còn "học" không?</td><td>Không. Học nghĩa là dùng kinh nghiệm cũ cho lần sau; không ghi nhớ thì mỗi lần thử đều như lần đầu.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> một đáp án (robot ở cột 2 hàng 6, quay lên trên): Tiến, Tiến, Tiến, Tiến, Rẽ phải, Tiến, Tiến, Tiến, Tiến. Đường đi qua hàng trên cùng: lên 4 ô rồi sang phải 4 ô. Có 9 lệnh. (Đường khác qua giữa mê cung cũng được chấp nhận nếu không đi xuyên tường.)</p>
  <p><b>Phần 2:</b> Tiến × 4, Rẽ phải, Tiến × 4: <b>3 khối</b>.</p>
  <p><b>Phần 3:</b> bên phải trống → Rẽ phải rồi tiến; phía trước trống → Tiến; không ô nào trống → Rẽ trái.</p>
  <p><b>Phần 4:</b> ô cạnh cờ là 1, tăng dần 1 theo mỗi bước ra xa cờ; ô R ghi <b>8</b>. Đi theo số nhỏ dần cần <b>8</b> bước.</p>
  <p><b>Phần 5:</b> chương trình cố định có thể va tường; robot tự học đi thử lại, cập nhật trí nhớ và tìm được đường mới. Robot hút bụi trong nhà hay thay đổi đồ đạc nên cần biết thích nghi (cảm biến, rẽ nhánh, ghi nhớ bản đồ).</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Rẽ trái, rẽ phải trong dự án là <b>quay tại chỗ</b>, không di chuyển. Học sinh thường nhầm "rẽ phải" là "đi sang ô bên phải"; nên làm mẫu bằng trò robot người.</li>
    <li>Robot tự học trong dự án ghi nhớ bản đồ những ô đã đi qua và tính số bước tới cờ từ mỗi ô. Dự án 18 giới thiệu cách học khác, phổ biến hơn trong AI: học bằng phần thưởng (bảng Q).</li>
    <li>Thuật toán bám tường luôn tìm được lối ra nếu cờ nằm sát tường bao ngoài, nhưng thường không đi đường ngắn nhất: học sinh có thể so số bước của nó với robot tự học.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> dùng nút <b>Gợi ý một chương trình</b>, đọc lại từng lệnh và đối chiếu với đường đi trên mê cung.</li>
    <li><b>Học sinh khá, giỏi:</b> tìm một mê cung (nút Mê cung mới) mà thuật toán bám tường đi dài gấp đôi đường ngắn nhất; viết thuật toán "bám tường trái" và so sánh.</li>
    <li><b>Không có máy tính:</b> kẻ mê cung bằng phấn trên sân trường; một nhóm đóng vai robot làm theo lệnh, một nhóm đóng vai robot tự học (đi thử, đặt viên phấn ghi số bước ở mỗi ô).</li>
  </ul>
  <p class="muted small">Học lên: Dự án 18 (Robot mê cung) cho thấy robot học bằng phần thưởng, cân bằng giữa khám phá và khai thác.</p>
'''

DOC = dict(num="24", folder="24-robot-hoc",
  phieu=dict(title="Phiếu học tập Dự án 24: Robot làm theo lệnh và robot tự học", h1="Phiếu học tập: Robot làm theo lệnh và robot tự học",
             lead="Dùng kèm Dự án 24 hoặc làm riêng trên lớp: viết chương trình trên giấy, vẽ sơ đồ khối, giúp robot ghi nhớ đường đi.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 24: Thuật toán và máy tự học (lớp 6)", h1="Dự án 24: Robot làm theo lệnh và robot tự học",
             lead="Một tiết học 45 phút giúp học sinh lớp 6 hiểu thuật toán với ba cấu trúc tuần tự, lặp, rẽ nhánh, và so sánh với cách máy tự học bằng thử và ghi nhớ.", body=gv_body)})
