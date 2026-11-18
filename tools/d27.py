phieu_body = '''
  <h2>Phần 1. Câu hỏi khảo sát</h2>
  <p>Đánh dấu câu hỏi <b>trung lập</b> (T) hay <b>gợi ý</b> (G). Viết lại các câu gợi ý cho trung lập.</p>
  <table><tr><th>Câu hỏi</th><th style="width:10%">T / G</th><th>Viết lại (nếu cần)</th></tr>
    <tr><td>Bạn thích bóng đá đúng không?</td><td></td><td></td></tr>
    <tr><td>Môn thể thao bạn thích nhất là gì?</td><td></td><td></td></tr>
    <tr><td>Ai cũng thấy căng tin ngon, bạn thấy sao?</td><td></td><td></td></tr>
    <tr><td>Mỗi ngày bạn ngủ khoảng mấy giờ?</td><td></td><td></td></tr></table>

  <h2>Phần 2. Khảo sát thật trong lớp</h2>
  <p>Viết số thứ tự của các bạn trong lớp lên giấy, <b>bốc thăm 10 số</b>. Hỏi 10 bạn đó: "Môn thể thao bạn thích nhất là gì?" Kiểm đếm rồi tính tỉ lệ.</p>
  <table><tr><th>Môn</th><th>Kiểm đếm</th><th style="width:14%">Số bạn</th><th style="width:16%">Tỉ lệ (%)</th></tr>
    <tr><td>Bóng đá</td><td></td><td></td><td></td></tr><tr><td>Cầu lông</td><td></td><td></td><td></td></tr><tr><td>Bơi lội</td><td></td><td></td><td></td></tr><tr><td>Cờ vua</td><td></td><td></td><td></td></tr><tr><td>Môn khác</td><td></td><td></td><td></td></tr></table>

  <h2 class="page-break">Phần 3. Ba cuộc khảo sát, ba kết quả</h2>
  <p>Ba nhóm cùng khảo sát môn thể thao yêu thích của trường (480 bạn). Kết quả ghi số bạn chọn mỗi môn.</p>
  <table><tr><th>Nhóm</th><th>Cách chọn mẫu</th><th>Bóng đá</th><th>Cầu lông</th><th>Môn khác</th></tr>
    <tr><td>1</td><td>Hỏi 20 bạn trong đội bóng</td><td>20</td><td>0</td><td>0</td></tr>
    <tr><td>2</td><td>Bốc thăm 60 bạn trong cả trường</td><td>13</td><td>22</td><td>25</td></tr>
    <tr><td>3</td><td>Hỏi 5 bạn đứng gần cổng</td><td>1</td><td>3</td><td>1</td></tr></table>
  <p>a) Tính tỉ lệ bạn chọn cầu lông theo từng nhóm. b) Kết quả của nhóm nào đáng tin nhất? Vì sao hai nhóm còn lại chưa đáng tin?</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>

  <h2>Phần 4. Vẽ biểu đồ</h2>
  <p>Vẽ biểu đồ cột tỉ lệ các môn theo kết quả của nhóm 2.</p>
  <div class="tree-box" style="height:240px"></div>

  <h2>Phần 5. Máy học từ dữ liệu</h2>
  <p>Một máy chia 20 bộ dụng cụ theo tỉ lệ trong khảo sát. Nếu máy dùng dữ liệu của nhóm 1 thì máy sẽ mua gì? Điều đó công bằng không? Ai cần chịu trách nhiệm kiểm tra dữ liệu?</p>
  <div class="lines"></div><div class="lines"></div><div class="lines"></div>
'''

gv_body = '''
  <table>
    <tr><th style="width:28%">Đối tượng</th><td>Học sinh lớp 7 (dùng được cho lớp 8, 9 khi học thống kê)</td></tr>
    <tr><th>Thời lượng</th><td>1 tiết (45 phút), có phần thử thách làm ở nhà</td></tr>
    <tr><th>Gắn với nội dung</th><td><b>Toán 7:</b> Một số yếu tố thống kê: thu thập, phân loại dữ liệu theo tiêu chí; tính đại diện của dữ liệu; biểu đồ cột, biểu đồ hình quạt tròn.<br><b>Tin học 7:</b> xử lý dữ liệu, bảng tính (có thể nhập kết quả khảo sát vào bảng tính).</td></tr>
    <tr><th>Thiết bị</th><td>Tối thiểu: 1 máy tính và máy chiếu. Phiếu học tập, giấy nhỏ để bốc thăm. Không cần camera.</td></tr>
  </table>

  <h2>1. Mục tiêu</h2>
  <ul>
    <li><b>Kiến thức:</b> phân biệt tổng thể và mẫu; nhận biết mẫu không đại diện (mẫu lệch) và câu hỏi gợi ý; tính tỉ lệ phần trăm, vẽ biểu đồ cột.</li>
    <li><b>Năng lực:</b> thiết kế và thực hiện một khảo sát nhỏ; đánh giá tính đại diện của dữ liệu; giải thích vì sao máy học từ dữ liệu lệch sẽ ra quyết định lệch.</li>
    <li><b>Phẩm chất:</b> trung thực, khách quan khi thu thập dữ liệu; tôn trọng ý kiến khác nhau.</li>
  </ul>

  <h2>2. Tiến trình gợi ý (45 phút)</h2>
  <table>
    <tr><th style="width:18%">Hoạt động</th><th style="width:10%">Thời gian</th><th>Giáo viên và học sinh</th></tr>
    <tr><td><b>Khởi động</b></td><td>5 phút</td><td>Trên máy chiếu, bấm <b>Hỏi ở sân bóng</b>, đọc kết quả. Hỏi: <i>"Vậy thầy hiệu trưởng nên mua toàn quả bóng?"</i> Bấm tiếp <b>Hỏi một lớp</b>: kết quả lại khác hẳn.</td></tr>
    <tr><td><b>Khám phá</b></td><td>12 phút</td><td>Học sinh làm <b>Phần 1</b>, rồi <b>Phần 2</b> (bốc thăm, hỏi thật trong lớp). Mở <b>Soi bên trong</b> bước 1 đến 4.</td></tr>
    <tr><td><b>Luyện tập</b></td><td>13 phút</td><td>Các nhóm thử cả ba cách hỏi trên trang, mỗi lần bấm <b>Công bố</b> để so với toàn trường và ghi lại mức lệch. Kéo thanh số bạn được hỏi từ 5 lên 200. Học sinh làm <b>Phần 3, 4</b>.</td></tr>
    <tr><td><b>Vận dụng</b></td><td>12 phút</td><td>Bật 3 sự cố ở <b>Phá máy</b>, quan sát chiếc máy mua dụng cụ. Xem <b>Soi</b> bước 5, 6. Học sinh làm <b>Phần 5</b>.</td></tr>
    <tr><td><b>Tổng kết</b></td><td>3 phút</td><td>Nhắc lại: mẫu ngẫu nhiên, đủ lớn, câu hỏi trung lập. Giao thử thách một sao.</td></tr>
  </table>

  <h2>3. Câu hỏi thảo luận và gợi ý trả lời</h2>
  <table>
    <tr><th style="width:45%">Câu hỏi</th><th>Gợi ý</th></tr>
    <tr><td>Hỏi 100 bạn ngẫu nhiên mà vẫn lệch vài phần trăm so với toàn trường, có phải sai không?</td><td>Không. Mẫu ngẫu nhiên luôn có sai lệch nhỏ do may rủi, mẫu càng lớn sai lệch càng nhỏ. Mẫu lệch thì khác: sai lệch lớn và không giảm khi hỏi thêm người cùng nhóm.</td></tr>
    <tr><td>Hỏi ở căng tin có phải là chọn ngẫu nhiên không?</td><td>Chưa hẳn: chỉ những bạn ra căng tin mới có cơ hội được hỏi. Muốn ngẫu nhiên thật, mỗi bạn phải có cơ hội như nhau (bốc thăm theo danh sách).</td></tr>
    <tr><td>AI có thể tự phát hiện dữ liệu lệch không?</td><td>Thường là không: máy coi dữ liệu được đưa vào là sự thật. Con người phải kiểm tra dữ liệu có đủ đa dạng, đủ đại diện hay chưa.</td></tr>
  </table>

  <h2>4. Đáp án phiếu học tập</h2>
  <p><b>Phần 1:</b> câu 1 và 3 là gợi ý (G); câu 2 và 4 trung lập (T). Ví dụ viết lại: "Bạn thấy đồ ăn ở căng tin thế nào?"</p>
  <p><b>Phần 3:</b> cầu lông: nhóm 1: 0%; nhóm 2: 22/60 ≈ 37%; nhóm 3: 3/5 = 60%. Nhóm 2 đáng tin nhất vì chọn ngẫu nhiên trong cả trường và đủ đông. Nhóm 1 chỉ hỏi đội bóng (mẫu lệch); nhóm 3 hỏi quá ít và chỉ những bạn ở gần cổng.</p>
  <p><b>Phần 4:</b> bóng đá ≈ 22%, cầu lông ≈ 37%, môn khác ≈ 42%.</p>
  <p><b>Phần 5:</b> máy sẽ mua cả 20 bộ cho bóng đá; không công bằng với các bạn thích môn khác. Người thu thập và người dùng dữ liệu (ở đây là nhóm khảo sát và nhà trường) phải kiểm tra.</p>

  <h2>5. Lưu ý về kiến thức</h2>
  <ul>
    <li>Kết quả toàn trường trên trang là dữ liệu giả lập: trường có 480 bạn, lớp 7A được cố ý cho nhiều bạn mê cầu lông để minh họa "một lớp không đại diện cho cả trường".</li>
    <li>Câu hỏi gợi ý được mô phỏng bằng cách cho khoảng 40% số bạn không thích bóng đá "gật đầu theo". Con số này chỉ để minh họa.</li>
    <li>Nhắc học sinh tôn trọng quyền riêng tư khi khảo sát thật: không ghi tên, chỉ ghi câu trả lời.</li>
  </ul>

  <h2>6. Phân hóa và phương án không có máy tính</h2>
  <ul>
    <li><b>Học sinh cần hỗ trợ:</b> chỉ so sánh hai cách hỏi (đội bóng và ngẫu nhiên).</li>
    <li><b>Học sinh khá, giỏi:</b> vẽ biểu đồ hình quạt tròn cho kết quả nhóm 2; thử nghĩ cách chọn mẫu "phân tầng" (mỗi khối hỏi số bạn bằng nhau).</li>
    <li><b>Không có máy tính:</b> cả lớp làm Phần 2 với 3 cách chọn khác nhau (bốc thăm, chỉ bàn đầu, chỉ các bạn nam) rồi so kết quả trên bảng.</li>
  </ul>
  <p class="muted small">Học lên: Dự án 7 (Dự đoán điểm thi) cho thấy máy học từ dữ liệu học sinh và vì sao cần dữ liệu đủ đại diện.</p>
'''

DOC = dict(num="27", folder="27-tham-tu-du-lieu", grade="7",
  phieu=dict(title="Phiếu học tập Dự án 27: Thám tử dữ liệu lớp học", h1="Phiếu học tập: Thám tử dữ liệu lớp học",
             lead="Dùng kèm Dự án 27 hoặc làm riêng trên lớp: viết câu hỏi trung lập, bốc thăm mẫu, kiểm đếm, vẽ biểu đồ và tìm mẫu bị lệch.", body=phieu_body),
  **{"giao-vien": dict(title="Hướng dẫn giáo viên Dự án 27: Tổng thể, mẫu và dữ liệu lệch (lớp 7)", h1="Dự án 27: Thám tử dữ liệu lớp học",
             lead="Một tiết học 45 phút giúp học sinh lớp 7 thu thập dữ liệu đáng tin, nhận biết mẫu bị lệch, câu hỏi gợi ý, và hiểu vì sao máy học từ dữ liệu lệch sẽ quyết định lệch.", body=gv_body)})
