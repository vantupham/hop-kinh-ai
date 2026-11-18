import math
def wave(cycles, amp, w=520, h=110):
    pts = " ".join(f"{x},{h/2 - amp*math.sin(2*math.pi*cycles*x/w):.1f}" for x in range(0, w + 1, 2))
    return f'<svg viewBox="0 0 {w} {h}" style="width:100%;max-width:{w}px;border:1.5px solid var(--line-strong);border-radius:10px;display:block;margin:6px 0"><line x1="0" y1="{h/2}" x2="{w}" y2="{h/2}" stroke="currentColor" opacity=".25"/><polyline points="{pts}" fill="none" stroke="currentColor" stroke-width="2.5"/></svg>'

phieu_body = f'''
  <h2>Phần 1. Đọc sóng âm</h2>
  <p>Mỗi khung dưới đây ghi lại sóng âm trong đúng <b>0,01 giây</b>.</p>
  <p><b>Sóng A</b></p>{wave(3, 40)}
  <p><b>Sóng B</b></p>{wave(5, 40)}
  <p><b>Sóng C</b></p>{wave(3, 15)}
  <table><tr><th>Sóng</th><th>Số dao động trong 0,01 s</th><th>Tần số (Hz)</th><th>To hay nhỏ so với A?</th></tr>
    <tr><td>A</td><td></td><td></td><td>(mốc so sánh)</td></tr><tr><td>B</td><td></td><td></td><td></td></tr><tr><td>C</td><td></td><td></td><td></td></tr></table>
  <p>Âm nào cao nhất? ……… Âm nào nhỏ nhất? ……… Hai âm nào cùng độ cao? ………</p>

  <h2 class="page-break">Phần 2. Làm máy tính tần số</h2>
  <p>Máy lấy <b>16 000 mẫu mỗi giây</b>. Tần số = 16 000 ÷ số mẫu của một chu kỳ.</p>
  <table><tr><th>Một chu kỳ dài</th><th>Tần số (Hz)</th><th>Nốt gần nhất (tra bảng)</th></tr>
    <tr><td>61 mẫu</td><td></td><td></td></tr><tr><td>41 mẫu</td><td></td><td></td></tr><tr><td>36 mẫu</td><td></td><td></td></tr><tr><td>31 mẫu</td><td></td><td></td></tr></table>
  <table><tr><th>Nốt</th><th>Đô</th><th>Rê</th><th>Mi</th><th>Fa</th><th>Sol</th><th>La</th><th>Si</th><th>Đô cao</th></tr>
    <tr><td><b>Hz</b></td><td>262</td><td>294</td><td>330</td><td>349</td><td>392</td><td>440</td><td>494</td><td>523</td></tr></table>

  <h2>Phần 3. Quãng tám</h2>
  <p>Nốt La chuẩn có tần số 440 Hz. Nốt La cao hơn một quãng tám có tần số ……… Hz. Nốt La thấp hơn một quãng tám có tần số ……… Hz.</p>

  <h2>Phần 4. Bác sĩ cho máy</h2>
  <p>Ghi nguyên nhân máy nghe nhầm và cách khắc phục.</p>
  <table><tr><th>Tình huống</th><th>Nguyên nhân</th><th>Cách khắc phục</th></tr>
    <tr><td>Hát trong lớp ồn ào, máy báo lúc Mi lúc Sol lúc La</td><td></td><td></td></tr>
    <tr><td>Hát thầm, máy báo "im lặng"</td><td></td><td></td></tr>
    <tr><td>Thổi sáo nốt Đô, máy báo Đô cao (523 Hz)</td><td></td><td></td></tr></table>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 7 (học cùng chủ đề Âm thanh)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>KHTN 7:</b> chủ đề Âm thanh: mô tả sóng âm; độ to và biên độ; độ cao và tần số (đơn vị Hz); phản xạ âm, chống ô nhiễm tiếng ồn.<br><b>Toán 7:</b> phép chia, làm tròn số. <b>Âm nhạc:</b> tên nốt, quãng tám.</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính có loa và máy chiếu. Micro là <b>không bắt buộc</b>: trang có đàn mô phỏng. Nếu dùng micro, trang chỉ phân tích trên máy, không ghi âm, không gửi đi đâu.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> nêu được âm thanh là dao động lan truyền; tần số quyết định độ cao, biên độ quyết định độ to; mô tả được cách máy đo tần số bằng cách tìm chu kỳ lặp lại.</li>
    <li><b>Năng lực:</b> đọc đồ thị sóng âm, tính tần số; giải thích được các nguyên nhân máy nghe nhầm (tiếng ồn, âm quá nhỏ, bồi âm).</li>
    <li><b>Phẩm chất:</b> ý thức giữ trật tự, giảm tiếng ồn nơi học tập; tôn trọng quyền riêng tư khi dùng micro.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Bấm <b>Máy tự chơi "Kìa con bướm vàng"</b> trên máy chiếu. Hỏi: <i>"Máy không có tai, sao nó biết nốt nào?"</i></td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Học sinh bấm từng phím, quan sát sóng âm dày lên khi nốt cao lên, sóng to lên khi kéo <b>Độ to</b>. Làm <b>Phần 1</b> của phiếu. Mở <b>Soi bên trong</b> bước 1 đến 4.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Học sinh làm <b>Phần 2, 3</b>, kiểm tra kết quả bằng bảng tần số trong khung Bộ não. Xem <b>Soi</b> bước 5. Nếu có micro, cho một nhóm hát thử.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>, quan sát biểu đồ khi máy tự chơi. Xem <b>Soi</b> bước 6. Học sinh làm <b>Phần 4</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại: tần số ↔ độ cao, biên độ ↔ độ to; máy nghe bằng con số. Giao thử thách đàn ống nước.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Vì sao đàn và sáo chơi cùng nốt Đô mà nghe vẫn khác nhau?</td><td>Cùng tần số chính nhưng khác <b>bồi âm</b> (âm sắc): hình dạng sóng khác nhau. Kéo thanh Bồi âm để thấy hình sóng thay đổi mà nốt không đổi.</td></tr>
    <tr><td>Hạ ngưỡng im lặng xuống thấp nhất có tốt không?</td><td>Máy nghe được âm nhỏ hơn, nhưng cũng "nghe" cả tiếng ồn thành nốt nhạc. Ngưỡng là sự cân bằng giữa bỏ sót và báo nhầm.</td></tr>
    <tr><td>Tai người có tốt hơn máy không?</td><td>Tai người rất giỏi lọc tiếng ồn và nhận ra giọng quen. Máy thì đo tần số rất chính xác, nhưng dễ bị đánh lừa bởi những thứ tai người bỏ qua.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> A: 3 dao động trong 0,01 s → 300 Hz. B: 5 dao động → 500 Hz, cao hơn A, cùng độ to. C: 3 dao động → 300 Hz, biên độ nhỏ hơn nên nhỏ hơn A. Cao nhất: B; nhỏ nhất: C; cùng độ cao: A và C.</p>
  <p><b>Phần 2:</b> 61 mẫu → ≈ 262 Hz (Đô); 41 mẫu → ≈ 390 Hz (Sol); 36 mẫu → ≈ 444 Hz (La); 31 mẫu → ≈ 516 Hz (Đô cao).</p>
  <p><b>Phần 3:</b> 880 Hz và 220 Hz.</p>
  <p><b>Phần 4:</b> (1) tiếng ồn lấn át, sóng không lặp lại rõ → đưa micro lại gần, hát to hơn, giữ lớp yên lặng. (2) âm nhỏ hơn ngưỡng im lặng → hát to hơn hoặc hạ ngưỡng vừa phải. (3) bồi âm mạnh làm máy đo nhầm nửa chu kỳ, tần số gấp đôi → máy cần kiểm tra kỹ chu kỳ lặp lại.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Tần số các nốt dùng trong trang theo chuẩn La = 440 Hz, làm tròn đến hàng đơn vị.</li>
    <li>Thuật toán trên trang là "tự tương quan" (so sóng với chính nó khi dịch đi). Học sinh lớp 7 chỉ cần hiểu ý "tìm chỗ sóng lặp lại".</li>
    <li>Một số trình duyệt chỉ cho dùng micro trên trang https (GitHub Pages là https). Nếu bị từ chối, dùng đàn mô phỏng.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> chỉ làm Phần 1 và 3, dùng bảng tần số để tra.</li>
    <li><b>Học sinh khá, giỏi:</b> giải thích vì sao nốt cao hơn nửa cung thì tần số nhân với khoảng 1,06 (12 nửa cung nhân lại thành 2).</li>
    <li><b>Không có máy tính:</b> dùng thước kẻ nhựa đặt chìa ra mép bàn, gảy với độ dài khác nhau, đếm dao động bằng mắt khi thước dài (âm trầm) và so sánh.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 28 (Máy nghe âm thanh) cho thấy máy nhận ra tiếng vỗ tay, tiếng huýt sáo nhờ phổ tần số.</p>
'''

DOC = dict(num="8", folder="08-nghe-not-nhac", grade="7",
  phieu=dict(title="Phiếu học tập Dự án 8: Máy nghe nốt nhạc", h1="Phiếu học tập: Máy nghe nốt nhạc",
             lead="Dùng kèm Dự án 8 hoặc làm riêng trên lớp: đọc sóng âm, tính tần số, tra nốt nhạc, tìm nguyên nhân máy nghe nhầm.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 8: Tần số, biên độ và máy nghe nốt nhạc (lớp 7)", h1="Dự án 8: Máy nghe nốt nhạc",
             lead="Một tiết học 45 phút giúp học sinh lớp 7 hiểu tần số và biên độ của âm, và cách máy đo tần số để nhận ra nốt nhạc.", body=gv_body)})
