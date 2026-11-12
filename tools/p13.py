D = dict(
  out="du-an/13-phan-cum/index.html", num="13", level="3", title="Dự án 13 · Bảng màu thông minh",
  scripts=["kmeans.js"],
  h1='Bảng màu <span class="hl-word">thông minh</span>',
  lead="Một bức ảnh có hàng chục nghìn màu. Nếu chỉ được giữ 5 màu, nên giữ màu nào? Không ai chỉ cho máy đáp án: nó tự thả từng điểm ảnh vào một khối màu 3 chiều, rồi tự gom chúng thành nhóm. Chào mừng em đến với học không giám sát!",
  moi='''
  <style>.pal{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.sw{display:flex;align-items:center;gap:6px;font:11px "JetBrains Mono",monospace;color:#c3c7f0;min-width:0}.sw i{width:22px;height:22px;border-radius:6px;flex:none;border:1px solid rgba(255,255,255,.25)}.sw b{margin-left:auto;color:#fff}.file-btn{position:relative;overflow:hidden}.file-btn input{position:absolute;inset:0;opacity:0;cursor:pointer}</style>
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Ảnh gốc và ảnh sau khi gom màu, kéo để so sánh"></canvas><div class="stage-tag"><span class="live-dot"></span><span>K-MEANS</span></div></div>
      <div class="toolbar">
        <div class="seg"><button class="btn small" id="btnRun"></button><button class="btn small ghost" id="btnStep"><i data-i="skip"></i>Bước tiếp</button></div>
        <span class="muted small"><i data-i="bulb"></i> Kéo vạch trắng trên ảnh để so sánh</span>
      </div>
      <div class="game"><span class="small muted">Ảnh</span><div class="btn-row" id="imgBtns"><button class="btn small ghost" data-m="vuon-hoa">Vườn hoa</button><button class="btn small ghost" data-m="hoang-hon">Hoàng hôn</button><button class="btn small ghost" data-m="den-long">Đèn lồng</button><button class="btn small ghost" data-m="cau-vong">Dải màu</button><label class="btn small ghost file-btn" data-m="upload"><i data-i="upload"></i>Ảnh của em<input type="file" id="fileIn" accept="image/*"></label></div></div>
      <div class="game"><span class="small muted">Số màu K</span><div class="btn-row" id="kBtns"><button class="btn small ghost" data-k="2">2</button><button class="btn small ghost" data-k="3">3</button><button class="btn small ghost" data-k="5">5</button><button class="btn small ghost" data-k="8">8</button><button class="btn small ghost" data-k="12">12</button></div></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="lbl">BẢNG MÀU MÁY TỰ TÌM</div><div class="pal" id="bPal"></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>VÒNG LẶP</span><b id="bIter">0</b></div><div class="metric"><span>SAI LỆCH MÀU TB</span><b id="bErr">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>TÂM KHÔNG CÓ ĐIỂM</span><b id="bEmpty">0</b></div><div class="metric"><span>BIT MỖI ĐIỂM ẢNH</span><b id="bBits">—</b></div></div>
      <div class="lbl" style="margin-top:12px">TRẠNG THÁI</div><div id="bStatus" style="color:#fff"></div>
    </aside>
  </div>''',
  mission_h2="Để máy tự tìm ra bảng màu của một bức ảnh",
  mission_q="Không có đáp án, không có nhãn. Máy dựa vào đâu để chia nhóm?",
  mission_p="Em sẽ thấy mỗi điểm ảnh biến thành một <b>điểm trong không gian màu</b>, xem thuật toán <b>K-means</b> gán và dời tâm từng vòng, tự chọn <b>K</b> bằng biểu đồ <b>khuỷu tay</b>, và hiểu vì sao điểm xuất phát lại quan trọng.",
  minutes="45–60 phút",
  checklist=[("run", "Xem K-means chạy tới khi hội tụ"), ("soi", "Soi tới bước Dời tâm"), ("k", "Thử ít nhất 3 giá trị K khác nhau"), ("upload", "Thử với một ảnh của em"), ("broke", "Làm K-means cho kết quả tệ ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="K-means từng bước trong khối màu 3D",
  soi_p="Khối màu dùng đúng bức ảnh và đúng lần chạy ở phần Mồi. Kéo để xoay khối.",
  theory=[
    dict(no="49", tag="Học máy", title="Học không giám sát",
      svg='<g class="f-violet"><circle cx="40" cy="40" r="5"/><circle cx="52" cy="50" r="5"/><circle cx="34" cy="56" r="5"/><circle cx="48" cy="34" r="5"/></g><g class="f-mint"><circle cx="190" cy="40" r="5"/><circle cx="204" cy="52" r="5"/><circle cx="196" cy="30" r="5"/><circle cx="214" cy="38" r="5"/></g><g class="f-coral"><circle cx="120" cy="90" r="5"/><circle cx="132" cy="96" r="5"/><circle cx="112" cy="102" r="5"/></g><text x="64" y="118" font-size="11" class="t-mono f-muted">không nhãn → tự thành nhóm</text>',
      p="Từ đầu khóa, ta luôn cho máy <b>đáp án</b> để học (học có giám sát). <b>Học không giám sát</b> thì khác: máy chỉ có dữ liệu và phải tự tìm ra cấu trúc bên trong, ví dụ những nhóm điểm nằm gần nhau.",
      deep="Gom cụm (clustering) là dạng phổ biến nhất của học không giám sát. Ngoài ra còn có giảm số chiều, phát hiện điểm bất thường… Phần lớn dữ liệu trên đời không có nhãn, nên học không giám sát rất quan trọng."),
    dict(no="50", tag="Toán + AI", cls="amber", title="Màu là một điểm trong không gian",
      svg='<path d="M70 100V30M70 100l70 0M70 100l-40 20" class="s-line" stroke-width="2"/><text x="60" y="24" font-size="11" class="t-mono f-mint">G</text><text x="146" y="104" font-size="11" class="t-mono f-coral">R</text><text x="18" y="124" font-size="11" class="t-mono f-violet">B</text><circle cx="120" cy="56" r="7" fill="#e88a3a"/><circle cx="196" cy="56" r="7" fill="#e8963f"/><path d="M127 56h62" class="s-line" stroke-dasharray="4 4"/><text x="134" y="48" font-size="10" class="t-mono f-muted">gần nhau</text>',
      p="Một màu gồm 3 số (đỏ, lục, lam), giống tọa độ (x, y, z) trong không gian. Hai màu <b>giống nhau</b> thì nằm <b>gần nhau</b>. Khoảng cách được tính bằng định lý Py-ta-go mở rộng cho 3 chiều.",
      deep="Đây là ý tưởng xuyên suốt AI: biến mọi thứ (màu, âm thanh, chữ, khuôn mặt) thành các điểm trong một không gian, rồi dùng khoảng cách để đo độ giống nhau. Em đã gặp nó ở KNN (Dự án 2) và sẽ gặp lại ở Dự án 16."),
    dict(no="51", tag="Thuật toán", cls="coral", title="Thuật toán K-means",
      svg='<rect x="20" y="40" width="90" height="40" rx="10" class="f-soft"/><text x="65" y="65" text-anchor="middle" font-size="12" class="f-ink">1. Gán</text><rect x="150" y="40" width="90" height="40" rx="10" class="f-soft"/><text x="195" y="65" text-anchor="middle" font-size="12" class="f-ink">2. Dời tâm</text><path d="M112 52h34" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><path d="M195 82c0 30-130 30-130 0" fill="none" class="s-coral" stroke-width="2.5" marker-end="url(#arC)"/><text x="104" y="118" font-size="10" class="t-mono f-coral">lặp lại</text>',
      p="Chỉ hai bước lặp đi lặp lại: <b>gán</b> mỗi điểm về tâm gần nhất, rồi <b>dời</b> mỗi tâm về trung bình của đội mình. Mỗi vòng, tổng sai lệch chỉ giảm chứ không tăng, nên chắc chắn sẽ dừng.",
      deep="Nhưng K-means chỉ tìm được lời giải tốt <b>gần chỗ xuất phát</b>, chưa chắc là tốt nhất. Vì vậy người ta chạy nhiều lần với tâm xuất phát khác nhau, hoặc dùng <b>K-means++</b> để chọn tâm xuất phát trải đều."),
    dict(no="52", tag="Đánh giá", cls="mint", title="Chọn K: biểu đồ khuỷu tay",
      svg='<path d="M30 20V100H240" class="s-line" stroke-width="1.5"/><path d="M40 26 70 70 100 86 140 92 180 95 230 97" fill="none" class="s-violet" stroke-width="3"/><circle cx="100" cy="86" r="10" fill="none" class="s-mint" stroke-width="2.5" stroke-dasharray="4 3"/><text x="110" y="72" font-size="10" class="t-mono f-mint">khuỷu tay</text>',
      p="K càng lớn thì sai lệch càng nhỏ, nhưng lợi ích giảm dần. Vẽ sai lệch theo K, tìm chỗ đường cong <b>gãy</b> như khuỷu tay: thêm nhóm sau chỗ đó không còn đáng.",
      deep="Không phải dữ liệu nào cũng có khuỷu rõ ràng. Khi đó việc chọn K phụ thuộc vào <b>mục đích</b>: in tranh 4 màu thì K = 4, dù dữ liệu \"muốn\" nhiều hơn."),
  ],
  tulam_h2="Bàn thí nghiệm: khối màu, tâm xuất phát và biểu đồ khuỷu tay",
  tulam_p="Kéo khối màu để xoay. Mỗi thay đổi sẽ chạy lại K-means ngay trên sân khấu phần Mồi.",
  tulam='''
  <div class="two-col">
    <div class="card canvas-card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="blocks"></i></span>Khối màu RGB · trực tiếp</h3>
      <canvas id="cube" class="touch" width="560" height="420" aria-label="Khối màu RGB 3D, kéo để xoay"></canvas>
      <div class="btn-row" id="colorBtns" style="margin-top:8px"><button class="btn small ghost" data-c="that">Tô màu thật</button><button class="btn small ghost" data-c="cum">Tô theo đội</button></div>
    </div>
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm coral"><i data-i="sliders"></i></span>Điều chỉnh</h3>
      <label class="ctl"><span>Số màu K</span><b id="KV"></b><input type="range" id="K" min="1" max="16" step="1"></label>
      <div class="lbl muted small" style="margin:6px 0">CÁCH CHỌN TÂM XUẤT PHÁT</div>
      <div class="btn-row" id="initBtns"><button class="btn small ghost" data-n="random">Ngẫu nhiên</button><button class="btn small ghost" data-n="kpp">K-means++</button><button class="btn small ghost" data-n="bad">Dồn vào góc</button></div>
      <label class="ctl" style="margin-top:12px"><span>Thời gian mỗi vòng</span><b id="speedV"></b><input type="range" id="speed" min="50" max="1500" step="50"></label>
      <button class="btn small ghost" id="btnSeed"><i data-i="reset"></i>Chạy lại với xuất phát khác</button>
      <h3 class="h-ic" style="margin-top:18px"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của K-means</h3><pre class="code" id="genCode"></pre>
    </div>
  </div>
  <div class="two-col" style="margin-top:18px">
    <div class="card chart-card"><div class="chart-head"><b><i data-i="chart"></i> Sai lệch qua từng vòng lặp</b></div><canvas id="chartConv" width="540" height="220"></canvas></div>
    <div class="card chart-card"><div class="chart-head"><b><i data-i="activity"></i> Biểu đồ khuỷu tay: sai lệch theo K</b></div><canvas id="chartElbow" width="540" height="220"></canvas></div>
  </div>''',
  breaks_h2="Thử thách: hãy làm bảng màu thông minh trở nên ngớ ngẩn!",
  breaks=[
    dict(icon="layers", key="few", title="Chỉ 2 màu", p="Bức vườn hoa rực rỡ chỉ được giữ lại <b>2 màu</b>.",
      why="Hai tâm phải chia nhau cả bầu trời, cỏ và hoa, nên hoa đỏ, vàng, tím biến mất vào màu trung bình. Nhìn biểu đồ khuỷu tay để chọn K hợp lý hơn. K quá nhỏ là <b>chưa khớp</b>, giống Dự án 7."),
    dict(icon="target", key="init", title="Xuất phát tồi", p="Tất cả 8 tâm bị <b>dồn vào góc đen</b> của khối màu trước khi chạy, với ảnh đèn lồng.",
      why="Ở lượt gán đầu tiên, gần như mọi điểm chọn cùng một tâm; các tâm còn lại không có ai và <b>đứng yên mãi mãi</b> (xem ô \"Tâm không có điểm\"). Chuyển sang <b>K-means++</b> hoặc Ngẫu nhiên. Bài học: K-means chỉ tìm được lời giải gần chỗ xuất phát."),
    dict(icon="activity", key="smooth", title="Dữ liệu không có nhóm", p="Ảnh là một <b>dải màu chuyển mượt</b>, không có nhóm màu nào tách biệt.",
      why="K-means vẫn ngoan ngoãn trả về đúng 6 nhóm, tạo ra các <b>vệt sọc</b> trên ảnh. Biểu đồ khuỷu tay không có chỗ gãy. Thuật toán không bao giờ nói \"dữ liệu này không có nhóm\": việc kiểm tra các nhóm có ý nghĩa hay không là của con người."),
  ],
  real_h2="Gom cụm đang được dùng ở đâu?",
  real=[("image", "", "Nén ảnh và in ấn", "Ảnh GIF, ảnh pixel trong trò chơi và in lụa đều cần giảm số màu; gom cụm chọn ra bảng màu đẹp nhất."),
        ("globe", "mint", "Ảnh vệ tinh", "Gom các điểm ảnh vệ tinh thành nhóm đất, rừng, nước, đô thị mà không cần ai tô nhãn trước."),
        ("chart", "amber", "Nhóm khách hàng", "Cửa hàng gom khách có thói quen mua giống nhau để gợi ý sản phẩm phù hợp.")],
  ethics=["Một ứng dụng gom học sinh thành nhóm \"giỏi\", \"trung bình\", \"yếu\" chỉ từ điểm số. Điều gì có thể bị bỏ qua?",
          "Gom cụm khách hàng có thể dẫn tới việc mỗi nhóm thấy giá khác nhau. Như vậy có công bằng không?",
          "Máy luôn trả về K nhóm. Khi một nhóm do máy \"cắt\" ra được đặt tên và dùng để đối xử với con người, ai phải kiểm tra?"],
  badge="Thợ Pha Màu", badge_p="Em đã mở khóa 4 thẻ kiến thức: Học không giám sát · Màu là một điểm · Thuật toán K-means · Chọn K bằng khuỷu tay.",
  dev_h2="Từ bảng màu thông minh đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Biến ảnh thành tranh pixel", "Thu nhỏ ảnh còn 32×32, gom thành 8 màu rồi phóng to không làm mờ: em có ngay tranh kiểu trò chơi cổ điển.", "Xong khi", "xuất được ảnh tranh pixel và bảng màu kèm mã màu."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Gom nhóm thói quen ngủ của lớp", "Thu (ẩn danh, có đồng ý) giờ ngủ, giờ dậy, thời gian dùng điện thoại; gom thành nhóm rồi tìm hiểu đặc điểm mỗi nhóm.", "Xong khi", "mô tả được từng nhóm bằng lời và kiểm tra lại với chính các bạn."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Theo dõi mặt nước ao hồ bằng ảnh", "Chụp ảnh mặt ao định kỳ, gom màu điểm ảnh để ước lượng tỉ lệ rêu tảo xanh theo thời gian.", "Đo kết quả", "tương quan giữa tỉ lệ cụm màu xanh tảo và đo đạc thực tế (độ trong, bộ test nước).")],
  cur="13 · Bảng màu", next=[("14 · Bác sĩ lá cây", "mạng tích chập"), ("16 · Đoán chữ tiếp theo", "không gian từ ngữ"), ("17 · Cảm xúc câu nói", "bản đồ vector của từ")],
  khkt=[("Vấn đề", "Tảo nở hoa làm ô nhiễm ao hồ nhưng khó theo dõi thường xuyên."), ("Câu hỏi nghiên cứu", "Gom cụm màu ảnh chụp có ước lượng được mức độ tảo không?"), ("Giả thuyết", "Tỉ lệ cụm màu xanh lục đậm tăng cùng mật độ tảo đo bằng bộ test."), ("Lưu ý đạo đức", "Không tự ý vào khu vực nguy hiểm; hỏi phép chủ ao.")],
  prev=("12-phong-nen", "12"), nextp=("14-la-cay", "14"),
)
