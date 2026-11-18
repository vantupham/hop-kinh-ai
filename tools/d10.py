PX = [50, 110, 170, 230, 230, 230, 290, "?", "?", 470, 530]
rows = "<tr><th>Thời gian (s)</th>" + "".join(f"<td>{t}</td>" for t in range(11)) + "</tr><tr><th>Vị trí điểm giữa (điểm ảnh)</th>" + "".join(f"<td><b>{p}</b></td>" for p in PX) + "</tr><tr><th>Quãng đường (m)</th>" + "".join("<td></td>" for _ in range(11)) + "</tr>"
grid = '<div class="pix-grid" style="grid-template-columns:repeat(11,auto)">' + "".join("<span></span>" for _ in range(66)) + "</div>"

phieu_body = f'''
  <h2>Phần 1. Từ điểm ảnh ra mét</h2>
  <p>Máy theo dõi bạn Lan chạy, mỗi giây ghi lại vị trí điểm giữa chiếc áo trong ảnh. Trên ảnh, vạch <b>0 m</b> ở điểm ảnh <b>50</b>, và cứ <b>10 điểm ảnh = 1 m</b>. Ở giây thứ 7 và 8, Lan bị một tấm biển che nên máy không thấy (dấu ?).</p>
  <table class="tick">{rows}</table>
  <p>Gợi ý: quãng đường = (vị trí − 50) ÷ 10.</p>

  <h2>Phần 2. Vẽ đồ thị quãng đường – thời gian</h2>
  <p>Trục ngang: thời gian từ 0 đến 10 s (mỗi cột 1 s). Trục dọc: quãng đường từ 0 (hàng dưới cùng) đến 50 m (hàng trên cùng), mỗi hàng 10 m. Chấm các điểm đã biết rồi nối lại.</p>
  {grid}

  <h2 class="page-break">Phần 3. Tính tốc độ</h2>
  <table><tr><th>Đoạn</th><th>Quãng đường (m)</th><th>Thời gian (s)</th><th>Tốc độ (m/s)</th><th>Lan đang làm gì?</th></tr>
    <tr><td>Từ 0 s đến 3 s</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Từ 3 s đến 5 s</td><td></td><td></td><td></td><td></td></tr>
    <tr><td>Từ 5 s đến 10 s</td><td></td><td></td><td></td><td></td></tr>
    <tr><td><b>Cả lần chạy</b></td><td></td><td></td><td></td><td>(tốc độ trung bình)</td></tr></table>

  <h2>Phần 4. Đoán vị trí khi mất dấu</h2>
  <p>Dựa vào tốc độ đoạn từ 5 s đến 6 s, hãy đoán vị trí (điểm ảnh) của Lan ở giây thứ 7 và 8. Kiểm tra lại với vị trí ở giây thứ 9.</p>
  <div class="lines"></div><div class="lines"></div>

  <h2>Phần 5. Vì sao máy nhầm?</h2>
  <p>Máy đo thấy ở giây thứ 4, vị trí của Lan nhảy từ 230 lên 600 điểm ảnh rồi giây sau lại về 230. Em đoán chuyện gì đã xảy ra? Máy nên làm gì để tránh lỗi này?</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 7 (học cùng chủ đề Tốc độ)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà hoặc trong giờ thể dục</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>KHTN 7:</b> chủ đề Tốc độ: tốc độ chuyển động, đơn vị m/s; đo tốc độ; đồ thị quãng đường – thời gian; tốc độ và an toàn giao thông.<br><b>Toán 7:</b> tỉ lệ thức (đổi điểm ảnh ra mét). <b>Giáo dục thể chất:</b> chạy cự li ngắn.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Camera là <b>không bắt buộc</b>: trang có video mô phỏng. Nếu dùng camera, hình ảnh chỉ được xử lý trên máy, không lưu, không gửi đi.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> tính tốc độ từ quãng đường và thời gian; đọc và vẽ đồ thị quãng đường – thời gian; mô tả cách máy theo dõi vật theo màu qua các khung hình.</li>
    <li><b>Năng lực:</b> đổi đơn vị từ điểm ảnh ra mét; suy luận vị trí khi thiếu dữ liệu; giải thích các nguyên nhân máy theo dõi sai.</li>
    <li><b>Phẩm chất:</b> trung thực khi đo đạc; ý thức an toàn khi tham gia giao thông (tốc độ, khoảng cách).</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Bấm <b>Chạy và đo</b> trên máy chiếu. Hỏi: <i>"Máy không có đồng hồ bấm giây trên đường chạy. Nó biết Minh chạy nhanh bao nhiêu bằng cách nào?"</i></td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Mở <b>Soi bên trong</b> bước 1 đến 4: ảnh → vùng màu → điểm giữa → mét. Học sinh làm <b>Phần 1</b> của phiếu.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Các nhóm thử 3 kiểu chạy, so sánh hình dạng đồ thị. Xem <b>Soi</b> bước 5, 6. Học sinh làm <b>Phần 2, 3</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>, bấm vào cây hoặc bầu trời để chọn sai màu. Học sinh làm <b>Phần 4, 5</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại công thức tốc độ, ý nghĩa độ dốc đồ thị, và cách máy theo dõi vật. Giao thử thách đo tốc độ đi bộ.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Vì sao máy cần hai vạch mốc 0 m và 60 m trên đường chạy?</td><td>Để biết bao nhiêu điểm ảnh ứng với 1 m (tỉ lệ). Không có mốc, máy chỉ đo được tốc độ theo điểm ảnh mỗi giây (như chế độ camera).</td></tr>
    <tr><td>Tăng "độ lệch màu cho phép" thật lớn có tốt không?</td><td>Máy nhận được cả áo trong bóng râm, nhưng cũng nhận nhầm những vật có màu gần giống (thân cây, mái tóc). Luôn phải cân bằng.</td></tr>
    <tr><td>Camera bắn tốc độ trên đường hoạt động thế nào?</td><td>Cùng ý tưởng: theo dõi xe qua các khung hình, biết khoảng cách thật giữa hai vạch mốc, chia cho thời gian. Liên hệ: chạy quá tốc độ rất nguy hiểm vì cần quãng đường dài để dừng.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> quãng đường lần lượt: 0, 6, 12, 18, 18, 18, 24, ?, ?, 42, 48 m.</p>
  <p><b>Phần 3:</b> 0–3 s: 18 m, 6 m/s, đang chạy. 3–5 s: 0 m, 0 m/s, đứng yên (nghỉ). 5–10 s: 30 m, 6 m/s, chạy tiếp. Cả lần: 48 m trong 10 s, tốc độ trung bình 4,8 m/s.</p>
  <p><b>Phần 4:</b> từ 5 s đến 6 s Lan đi 60 điểm ảnh mỗi giây, đoán giây 7: 350, giây 8: 410; giây 9 thật là 470, khớp với dự đoán (410 + 60).</p>
  <p><b>Phần 5:</b> có thể máy đã nhầm sang một vật khác cùng màu ở xa (quả bóng, áo của khán giả). Máy nên chỉ tìm quanh vị trí cũ (người không thể chạy 37 m trong 1 giây), hoặc loại các vị trí nhảy quá xa.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Trên trang, máy đo 10 khung hình mỗi giây; tốc độ "lúc này" được tính từ các vị trí trong 1 giây gần nhất nên có độ trễ nhỏ.</li>
    <li>Tốc độ trung bình máy đo có thể chênh vài phần trăm so với thật vì máy dùng điểm giữa chiếc áo, không phải mũi chân chạm vạch.</li>
    <li>Theo dõi vật theo màu là cách đơn giản nhất. Dự án 29 (nâng cao) dùng mô hình nhận dạng vật thể rồi mới theo dõi.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> chỉ làm Phần 1 và đoạn đầu của Phần 3.</li>
    <li><b>Học sinh khá, giỏi:</b> vẽ thêm đồ thị tốc độ – thời gian cho lần chạy "Tăng tốc dần" và giải thích hình dạng.</li>
    <li><b>Không có máy tính:</b> trong giờ thể dục, đặt người bấm giờ ở các mốc 10 m, 20 m, 30 m…; mỗi người ghi thời gian khi bạn chạy qua mốc của mình, rồi cả lớp vẽ đồ thị.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 29 (Đếm xe) cho thấy máy nhận dạng và theo dõi nhiều chiếc xe cùng lúc trên đường.</p>
'''

DOC = dict(num="10", folder="10-toc-do-chay", grade="7",
  phieu=dict(title="Phiếu học tập Dự án 10: Máy chấm tốc độ chạy", h1="Phiếu học tập: Máy chấm tốc độ chạy",
             lead="Dùng kèm Dự án 10 hoặc làm riêng trên lớp: đổi vị trí trong ảnh ra mét, vẽ đồ thị quãng đường – thời gian, tính tốc độ, đoán vị trí khi máy mất dấu.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 10: Tốc độ, đồ thị và theo dõi vật (lớp 7)", h1="Dự án 10: Máy chấm tốc độ chạy",
             lead="Một tiết học 45 phút giúp học sinh lớp 7 tính tốc độ, đọc đồ thị quãng đường – thời gian và hiểu cách máy theo dõi một vật qua các khung hình video.", body=gv_body)})
