D = dict(
  out="du-an/07-diem-thi/index.html", num="07", level="2", title="Dự án 7 · Dự đoán điểm thi",
  scripts=["regress.js"],
  h1='Dự đoán <span class="hl-word">điểm thi</span>',
  lead="Học thêm một giờ mỗi tuần thì được thêm bao nhiêu điểm? Hãy kéo một đường thẳng sao cho khớp nhất với dữ liệu của 30 bạn, rồi xem máy tự tìm đường thẳng bằng cách \"lăn bi xuống dốc\". Đây là thuật toán đứng sau gần như mọi AI hiện đại.",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Biểu đồ giờ học và điểm thi, kéo hai chấm tròn trên đường thẳng"></canvas><div class="stage-tag"><span class="live-dot"></span><span>DỮ LIỆU 30 BẠN</span></div></div>
      <p class="muted small" style="margin:10px 0 0"><i data-i="bulb"></i> <b>Kéo hai chấm tròn trắng</b> trên đường thẳng để làm sai số (các đoạn cam) nhỏ nhất. Hình vuông cam càng nhỏ thì đường càng khớp.</p>
      <div class="toolbar">
        <div class="seg"><button class="btn small accent" id="btnRun"></button><button class="btn small ghost" id="btnStep1"><i data-i="skip"></i>1 bước</button><button class="btn small ghost" id="btnReset"><i data-i="reset"></i>Đặt lại</button></div>
        <div class="seg"><button class="btn small ghost" id="btnEdit" aria-pressed="false"><i data-i="figure"></i>Thêm / xóa bạn</button><button class="btn small ghost" id="btnNewData"><i data-i="sparkle"></i>Lớp khác</button></div>
      </div>
      <div class="panel-ctl"><label class="ctl"><span>Dự đoán cho bạn học</span><b id="predXV"></b><input type="range" id="predX" min="0" max="60" step="1"></label></div>
      <div class="toggles"><label class="tog"><input type="checkbox" id="showSq" checked><span>Hình vuông sai số</span></label></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="lbl">ĐỘ SAI TRUNG BÌNH (MSE)</div>
      <div class="score-big" id="bMse">—</div>
      <div class="lbl" style="margin-top:12px">ĐƯỜNG DỰ ĐOÁN</div>
      <div id="bEq" style="color:#fff;font-size:1rem"></div>
      <div class="metric-row">
        <div class="metric"><span>w (ĐỘ DỐC)</span><b id="bW">—</b></div>
        <div class="metric"><span>b (ĐIỂM GỐC)</span><b id="bB">—</b></div>
        <div class="metric"><span>MSE TỐT NHẤT CÓ THỂ</span><b id="bBest">—</b></div>
        <div class="metric"><span>SỐ BƯỚC ĐÃ ĐI</span><b id="bStep">0</b></div>
      </div>
    </aside>
  </div>''',
  mission_h2="Hiểu cách máy \"học\": tìm con số làm sai số nhỏ nhất",
  mission_q="Máy tính không biết suy nghĩ. Vậy làm sao nó tự tìm ra đường thẳng khớp nhất?",
  mission_p="Em sẽ biến \"khớp\" thành một con số (<b>hàm mất mát</b>), vẽ ra cả một <b>thung lũng sai số</b>, rồi thả một viên bi lăn xuống đáy. Mạng nơ-ron khổng lồ như ChatGPT cũng học theo đúng nguyên lý này, chỉ là với hàng tỉ con số thay vì 2.",
  minutes="45–60 phút",
  checklist=[("drag", "Tự kéo đường thẳng sao cho MSE nhỏ hơn 1,0"), ("gd", "Cho máy tự học bằng gradient descent"), ("surface", "Bấm lên bản đồ thung lũng để chọn điểm xuất phát"), ("broke", "Làm máy học hỏng ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ 30 chấm điểm tới đường thẳng tốt nhất: 6 bước",
  soi_p="Hình bên dưới chạy trực tiếp theo đường thẳng ở phần Mồi. Thử bấm \"Cho máy tự học\" rồi quay lại xem bước 5 và 6.",
  theory=[
    dict(no="25", tag="Học máy", title="Hồi quy tuyến tính",
      svg='<g class="f-mint"><circle cx="30" cy="96" r="4"/><circle cx="56" cy="84" r="4"/><circle cx="80" cy="88" r="4"/><circle cx="104" cy="70" r="4"/><circle cx="130" cy="64" r="4"/><circle cx="156" cy="58" r="4"/><circle cx="182" cy="40" r="4"/><circle cx="210" cy="36" r="4"/><circle cx="236" cy="22" r="4"/></g><path d="M20 100 246 20" class="s-violet" stroke-width="3"/>',
      p="<b>Hồi quy</b> là dự đoán một <b>con số</b> (điểm thi, giá nhà, nhiệt độ), khác với phân loại là dự đoán một <b>nhóm</b>. Dạng đơn giản nhất là vẽ một đường thẳng đi qua \"giữa\" đám dữ liệu: y = w × x + b.",
      deep="Khi có nhiều yếu tố (giờ học, giờ ngủ, giờ chơi game), công thức thành y = w₁x₁ + w₂x₂ + w₃x₃ + b. Nhìn kỹ, mỗi nơ-ron trong mạng nơ-ron cũng chính là một phép tính như vậy, cộng thêm một bước \"uốn cong\"."),
    dict(no="26", tag="Toán + AI", title="Hàm mất mát (MSE)",
      svg='<path d="M20 100 240 30" class="s-violet" stroke-width="2.5"/><g><rect x="60" y="52" width="34" height="34" class="f-cs s-coral"/><rect x="150" y="40" width="20" height="20" class="f-cs s-coral"/><rect x="200" y="44" width="14" height="14" class="f-cs s-coral"/></g><g class="f-mint"><circle cx="60" cy="52" r="4"/><circle cx="150" cy="40" r="4"/><circle cx="200" cy="58" r="4"/></g>',
      p="Để máy biết đường nào \"tốt hơn\", ta cần một con số đo độ sai: lấy từng sai số, <b>bình phương</b> lên (là diện tích hình vuông cam), rồi lấy <b>trung bình</b>. Đó là MSE. Học máy chính là đi tìm cách làm con số này nhỏ nhất.",
      deep="Bình phương giúp sai số âm và dương không triệt tiêu nhau, đồng thời phạt nặng những lần sai nhiều. Nhược điểm là một vài điểm \"ngoại lai\" có thể kéo lệch cả đường thẳng (thử sự cố 2)."),
    dict(no="27", tag="Thuật toán", cls="coral", title="Gradient descent: lăn bi xuống dốc",
      svg='<path d="M14 24 C60 24 80 100 130 100 S200 24 246 24" fill="none" class="s-ink" stroke-width="2.5"/><g class="f-amber"><circle cx="44" cy="34" r="6"/><circle cx="72" cy="66" r="5" opacity=".7"/><circle cx="96" cy="88" r="5" opacity=".5"/><circle cx="118" cy="98" r="5" opacity=".35"/></g><text x="150" y="70" font-size="11" class="t-mono f-muted">bước = tốc độ học</text><text x="150" y="86" font-size="11" class="t-mono f-muted">× độ dốc</text>',
      p="Hãy tưởng tượng em đứng trên đồi trong sương mù, muốn xuống thung lũng. Em dò xem chân đang dốc về hướng nào, rồi bước <b>ngược hướng dốc</b>. Lặp lại mãi là tới đáy. Máy làm y hệt, với \"độ dốc\" tính bằng <b>đạo hàm</b>.",
      deep="Đạo hàm của MSE theo w là trung bình của 2 × sai × giờ, theo b là trung bình của 2 × sai. Em sẽ học đạo hàm ở lớp 11, nhưng ý tưởng thì đơn giản: đo xem nếu nhích w một chút thì MSE tăng hay giảm."),
    dict(no="28", tag="Tư duy phản biện", cls="amber", title="Tương quan ≠ nhân quả · Ngoại suy",
      svg='<g class="f-mint"><circle cx="40" cy="90" r="4"/><circle cx="70" cy="78" r="4"/><circle cx="100" cy="66" r="4"/><circle cx="130" cy="58" r="4"/></g><path d="M30 94 250 6" class="s-violet" stroke-width="2.5" stroke-dasharray="0"/><rect x="150" y="6" width="100" height="108" class="f-as"/><text x="160" y="104" font-size="11" class="t-mono f-amber" font-weight="700">ngoài vùng dữ liệu</text>',
      p="Hai thứ cùng tăng không có nghĩa thứ này <b>gây ra</b> thứ kia. Và đường thẳng chỉ đáng tin <b>trong vùng dữ liệu</b> đã thấy: học 50 giờ một tuần không làm em được 20 điểm!",
      deep="Mùa hè, bán được nhiều kem và cũng nhiều vụ đuối nước, nhưng kem không gây đuối nước: cả hai đều do trời nóng. Khi đọc một kết quả AI hay một bài báo dùng số liệu, hãy luôn hỏi: còn yếu tố nào khác không?"),
  ],
  tulam_h2="Bàn thí nghiệm: thả viên bi vào thung lũng sai số",
  tulam_p="Mỗi điểm trên bản đồ bên trái là một đường thẳng (w, b). Màu tím tối là MSE nhỏ, màu sáng là MSE lớn, ngôi sao vàng là đáy thung lũng. Bấm vào bản đồ để đặt viên bi, rồi cho máy tự học và xem đường đi.",
  tulam='''
  <div class="two-col">
    <div class="card canvas-card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="map"></i></span>Bản đồ thung lũng sai số</h3>
      <canvas id="surface" class="touch" width="420" height="300" style="cursor:crosshair"></canvas>
      <label class="ctl" style="margin-top:12px"><span>Tốc độ học (độ dài mỗi bước)</span><b id="lrV"></b><input type="range" id="lr" min="0.0005" max="0.0140" step="0.0005"></label>
      <p class="muted small">Gợi ý: với tốc độ quá nhỏ, viên bi đi rất chậm. Với tốc độ quá lớn, nó nhảy qua lại và văng ra ngoài.</p>
    </div>
    <div class="card"><h3 class="h-ic"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của gradient descent</h3><pre class="code" id="genCode"></pre></div>
  </div>
  <div class="card chart-card" style="margin-top:18px">
    <div class="chart-head"><b><i data-i="chart"></i> Độ sai (MSE) sau mỗi bước</b><span class="legend"><i class="lg sm"></i>MSE hiện tại <i class="lg" style="background:var(--amber)"></i>đáy thung lũng</span></div>
    <canvas id="chart" width="1100" height="220"></canvas>
  </div>''',
  breaks_h2="Thử thách: hãy làm máy học hỏng!",
  breaks=[
    dict(icon="bolt", key="lr", title="Tốc độ học quá lớn", p="Đặt tốc độ học là <b>0,0125</b> rồi cho máy tự học. Xem viên bi trên bản đồ thung lũng.",
      why="Mỗi bước quá dài nên viên bi nhảy vượt qua đáy sang sườn bên kia, cao hơn chỗ cũ, rồi càng ngày càng văng xa: MSE <b>bùng nổ</b>. Hãy giảm tốc độ học xuống khoảng 0,004. Chọn tốc độ học là một trong những việc khó nhất khi huấn luyện AI thật."),
    dict(icon="alert", key="outlier", title="Hai bạn \"ngoại lai\"", p="Thêm hai bạn học rất nhiều giờ nhưng điểm cực thấp (có thể bị ốm hôm thi, hoặc nhập nhầm dữ liệu). Chấm vàng là hai bạn ấy.",
      why="MSE bình phương sai số, nên hai điểm sai rất nhiều có \"tiếng nói\" cực lớn và kéo cả đường thẳng nghiêng xuống. Bật <b>Thêm / xóa bạn</b> rồi bấm vào chấm vàng để xóa, nhưng chỉ xóa khi chắc chắn đó là lỗi nhập liệu, đừng xóa chỉ vì nó \"không đẹp\"."),
    dict(icon="arrowR", key="extra", title="Dự đoán quá xa", p="Hỏi máy: một bạn học <b>50 giờ mỗi tuần</b> sẽ được bao nhiêu điểm? Đường thẳng tự tin trả lời… hơn 10 điểm!",
      why="Dữ liệu chỉ có các bạn học 1–19 giờ. Ngoài vùng đó, máy chỉ đơn giản kéo dài đường thẳng ra, gọi là <b>ngoại suy</b>, và có thể cho kết quả vô lý. Mọi mô hình AI đều chỉ đáng tin trong phạm vi dữ liệu nó đã học."),
  ],
  fix="Về dữ liệu chuẩn",
  real_h2="Hồi quy và gradient descent đang ở đâu quanh em?",
  real=[("sun", "", "Dự báo thời tiết & nhu cầu điện", "Dự đoán nhiệt độ ngày mai, hay lượng điện thành phố sẽ dùng, từ dữ liệu của những ngày trước."),
        ("chart", "mint", "Ước tính giá cả", "Ước tính giá nhà từ diện tích, vị trí, số phòng; hay giá một chiếc xe cũ từ tuổi và số km đã chạy."),
        ("cpu", "amber", "Huấn luyện mọi mạng nơ-ron", "Mạng nhận diện ảnh, dịch thuật, trò chuyện… đều học bằng gradient descent, chỉ với hàng tỉ \"w\" thay vì một.")],
  ethics=["Một trường dùng mô hình dự đoán điểm để xếp học sinh vào lớp \"giỏi\" và lớp \"thường\" ngay từ đầu năm. Điều gì có thể đi sai? Dự đoán có trở thành \"số phận\" không?",
          "Mô hình nói học nhiều giờ thì điểm cao. Vậy ép mọi bạn học 20 giờ một tuần có đúng không? Còn những yếu tố nào khác?",
          "Khi dữ liệu có lỗi nhập liệu, ai nên được quyền sửa hay xóa dữ liệu? Làm sao để không \"chỉnh\" dữ liệu cho đẹp?"],
  badge="Người Lăn Bi Xuống Dốc", badge_p="Em đã mở khóa 4 thẻ kiến thức: Hồi quy tuyến tính · Hàm mất mát · Gradient descent · Tương quan ≠ nhân quả.",
  dev_h2="Từ dự đoán điểm thi đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Thêm yếu tố giờ ngủ", "Thu thập (ẩn danh) số giờ tự học và số giờ ngủ của các bạn trong lớp. Dùng công thức điểm = w₁ × giờ học + w₂ × giờ ngủ + b và gradient descent cho cả 3 con số.", "Xong khi", "MSE trên dữ liệu mới nhỏ hơn mô hình chỉ có giờ học."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Dự đoán nhiệt độ ngày mai", "Ghi nhiệt độ mỗi sáng trong 1 tháng, rồi dự đoán nhiệt độ ngày mai từ nhiệt độ 3 ngày trước. So sánh với dự báo của đài khí tượng.", "Xong khi", "sai số trung bình của em dưới 2°C trong 1 tuần kiểm tra."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Đường cong hay đường thẳng?", "Thử thay đường thẳng bằng đường cong (đa thức bậc 2, 3, 10…). Bậc càng cao thì khớp dữ liệu học càng tốt, nhưng dự đoán dữ liệu mới thế nào? Liên hệ với hiện tượng quá khớp ở Dự án 6.", "Đo kết quả", "MSE trên tập học và tập kiểm tra theo từng bậc đa thức.")],
  cur="07 · Điểm thi", next=[("10 · Tư thế ngồi học", "một cách học khác: cây"), ("11 · Đọc chữ số", "gradient descent trong mạng"), ("16 · Đoán chữ tiếp theo", "dự đoán ở quy mô lớn")],
  khkt=[("Vấn đề", "Học sinh khó biết thói quen nào ảnh hưởng nhiều nhất tới kết quả học tập."), ("Câu hỏi nghiên cứu", "Trong giờ tự học, giờ ngủ và giờ dùng điện thoại, yếu tố nào có trọng số lớn nhất khi dự đoán điểm?"), ("Giả thuyết", "Giờ ngủ có ảnh hưởng tương đương giờ tự học."), ("Lưu ý đạo đức", "Khảo sát ẩn danh, có sự đồng ý; nhắc rõ đây là tương quan, không phải nhân quả.")],
  prev=("06-thung-rac", "06"), nextp=("08-am-thanh", "08"),
)
