D = dict(
  out="du-an/09-dem-xe/index.html", num="09", level="2", title="Dự án 9 · Đếm xe trên phố",
  scripts=["traffic.js"],
  h1='Đếm xe <span class="hl-word">trên phố</span>',
  lead="Một camera nhìn xuống con đường trước cổng trường. AI phải tìm từng chiếc xe máy, ô tô, xe buýt, theo dõi chúng và đếm khi chúng đi qua vạch. Nghe đơn giản, nhưng có rất nhiều cách để đếm sai!",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" width="640" height="480" aria-label="Đường phố nhìn từ trên cao với các khung phát hiện xe"></canvas><video id="video" playsinline muted></video><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div id="stageMsg" class="stage-msg" hidden></div></div>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="Nguồn hình ảnh"><button class="btn small" id="srcSim" aria-pressed="true"><i data-i="map"></i>Đường phố ảo</button><button class="btn small ghost" id="srcCam" aria-pressed="false"><i data-i="camera"></i>Camera</button><label class="btn small ghost"><i data-i="film"></i>Video giao thông<input type="file" id="srcVid" accept="video/*" hidden></label></div>
        <button class="btn small ghost" id="btnReset"><i data-i="reset"></i>Đếm lại</button>
      </div>
      <div class="toggles"><span class="muted small"><i data-i="eye"></i> Hiển thị</span><label class="tog"><input type="checkbox" id="showRaw" checked><span>Khung thô</span></label><label class="tog"><input type="checkbox" id="showBoxes" checked><span>Khung sau lọc</span></label><label class="tog"><input type="checkbox" id="showIds" checked><span>ID theo dõi</span></label></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="metric-row" style="margin-top:0"><div class="metric"><span>AI ĐẾM</span><b id="bCount" style="font-size:2rem">0</b></div><div class="metric"><span>THỰC TẾ</span><b id="bTrue" style="font-size:2rem;color:#fff">0</b></div></div>
      <div class="metric" style="margin-top:10px"><span>SAI LỆCH</span><b id="bErr">—</b></div>
      <div class="lbl" style="margin-top:14px">PHỄU XỬ LÝ (KHUNG HÌNH NÀY)</div>
      <div class="bars" id="bFunnel"></div>
    </aside>
  </div>''',
  mission_h2="Biến hàng trăm khung bao lộn xộn thành một con số đếm chính xác",
  mission_q="Mô hình AI đã tìm được xe rồi, vậy sao việc đếm vẫn dễ sai?",
  mission_p="Phát hiện vật thể chỉ là bước đầu. Em sẽ lần lượt <b>lọc ngưỡng</b>, <b>xóa khung trùng</b> bằng IoU và NMS, <b>theo dõi</b> từng xe bằng số ID, rồi mới <b>đếm</b>. Bước nào sai thì con số cuối cùng sai.",
  minutes="45–60 phút",
  checklist=[("see", "Xem các khung trùng bị NMS xóa"), ("iou", "Kéo hai khung trong máy tính IoU"), ("tune", "Tự chỉnh ngưỡng tin cậy"), ("broke", "Làm AI đếm sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ ảnh đường phố tới con số đếm: 6 bước",
  soi_p="Hình bên dưới chạy trực tiếp theo đường phố ở phần Mồi.",
  theory=[
    dict(no="33", tag="Thị giác máy tính", title="Phát hiện vật thể",
      svg='<rect x="20" y="20" width="220" height="80" rx="6" fill="#3d4048"/><rect x="40" y="44" width="70" height="34" rx="8" fill="#3ee9cf" opacity=".6"/><rect x="36" y="40" width="78" height="42" fill="none" stroke="#3ee9cf" stroke-width="2.5"/><rect x="36" y="28" width="66" height="12" fill="#3ee9cf"/><text x="40" y="37" font-size="9" fill="#0a0b1e" font-weight="700">Ô tô 92%</text><rect x="150" y="56" width="34" height="16" rx="5" fill="#ffc34d" opacity=".7"/><rect x="146" y="52" width="42" height="24" fill="none" stroke="#ffc34d" stroke-width="2.5"/>',
      p="Phân loại ảnh trả lời \"ảnh này là gì?\", còn <b>phát hiện vật thể</b> trả lời \"có những vật gì, ở <b>đâu</b>?\". Mỗi vật được đóng trong một <b>khung bao</b> kèm tên loại và <b>độ tin cậy</b>.",
      deep="Mô hình COCO-SSD dùng ở chế độ camera nhận ra 80 loại vật thể thường gặp. Các mô hình hiện đại như YOLO có thể phát hiện hàng trăm vật trong mỗi ảnh, nhanh hơn cả tốc độ quay video."),
    dict(no="34", tag="Toán + AI", title="IoU: hai khung chồng nhau bao nhiêu?",
      svg='<rect x="40" y="24" width="110" height="70" class="f-vs s-violet" stroke-width="2.5"/><rect x="100" y="44" width="110" height="64" class="f-ms s-mint" stroke-width="2.5"/><rect x="100" y="44" width="50" height="50" class="f-amber" opacity=".55"/><text x="164" y="30" font-size="11" class="t-mono f-ink">IoU = giao / hợp</text>',
      p="<b>IoU</b> (Intersection over Union) = diện tích phần giao chia cho diện tích phần hợp của hai khung. Trùng khít thì IoU = 1, không chạm nhau thì IoU = 0.",
      deep="IoU còn dùng để <b>chấm điểm</b> mô hình: một khung dự đoán được tính là \"đúng\" nếu IoU với khung đáp án từ 0,5 trở lên. Em có thể thử trong máy tính IoU ở Bàn thí nghiệm."),
    dict(no="35", tag="Thuật toán", cls="coral", title="NMS: xóa khung trùng",
      svg='<rect x="40" y="30" width="90" height="56" fill="none" class="s-mint" stroke-width="3"/><rect x="48" y="36" width="88" height="54" fill="none" class="s-coral" stroke-width="2" stroke-dasharray="4 3"/><rect x="34" y="24" width="84" height="60" fill="none" class="s-coral" stroke-width="2" stroke-dasharray="4 3"/><text x="150" y="50" font-size="11" class="t-mono f-mint">giữ 94%</text><text x="150" y="72" font-size="11" class="t-mono f-coral">xóa 71%, 55%</text>',
      p="Mô hình hay đưa ra nhiều khung gần giống nhau cho cùng một xe. <b>NMS</b> sắp xếp các khung theo độ tin cậy, giữ khung cao nhất, rồi xóa mọi khung chồng lên nó quá nhiều (IoU vượt ngưỡng).",
      deep="Ngưỡng IoU của NMS cũng là một sự đánh đổi: thấp quá thì hai xe đi sát nhau bị gộp thành một, cao quá thì khung trùng không bị xóa hết."),
    dict(no="36", tag="Kỹ thuật", cls="amber", title="Theo dõi đối tượng & đếm",
      svg='<g class="f-violet"><circle cx="30" cy="80" r="5"/><circle cx="70" cy="70" r="5"/><circle cx="110" cy="62" r="5"/></g><g class="f-coral"><circle cx="170" cy="50" r="5"/><circle cx="210" cy="44" r="5"/></g><text x="24" y="104" font-size="11" class="t-mono f-violet">ID #7</text><text x="164" y="30" font-size="11" class="t-mono f-coral">ID #8 (?)</text><path d="M140 20v90" class="s-coral" stroke-width="2" stroke-dasharray="5 4"/>',
      p="Mỗi ảnh được xử lý riêng, nên máy cần <b>nối</b> khung ở ảnh này với khung ở ảnh trước để biết \"đây vẫn là chiếc xe đó\". Mỗi xe được gán một <b>số ID</b>, và mỗi ID chỉ được đếm một lần khi qua vạch.",
      deep="Nếu xe bị che hoặc camera giật hình, bộ theo dõi có thể <b>đổi ID</b> và đếm một xe thành hai. Các bộ theo dõi tốt dùng thêm <b>dự đoán chuyển động</b> (đoán xe sẽ ở đâu tiếp theo) và đặc điểm hình dạng để nối đúng."),
  ],
  tulam_h2="Bàn thí nghiệm: tinh chỉnh từng tầng của phễu xử lý",
  tulam_p="Chỉnh các núm vặn rồi nhìn đồ thị: đường đứt là số xe thật đã qua vạch, đường hồng là số AI đếm được. Hai đường càng sát nhau càng tốt.",
  tulam='''
  <div class="card chart-card"><div class="chart-head"><b><i data-i="chart"></i> Tổng số xe đã đếm · 60 giây gần nhất</b><span class="legend"><i class="lg" style="background:var(--text)"></i>thực tế <i class="lg" style="background:var(--rose)"></i>AI đếm</span></div><canvas id="chart" width="1100" height="220"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Các núm vặn</h3>
      <label class="ctl"><span>1. Ngưỡng tin cậy</span><b id="confV"></b><input type="range" id="conf" min="0.05" max="0.95" step="0.01"></label>
      <label class="tog" style="display:inline-block;margin:4px 0 8px"><input type="checkbox" id="nms"><span>2. Bật NMS</span></label>
      <label class="ctl"><span>…xóa khung trùng khi IoU ≥</span><b id="nmsIouV"></b><input type="range" id="nmsIou" min="0.1" max="0.9" step="0.05"></label>
      <label class="tog" style="display:inline-block;margin:4px 0 8px"><input type="checkbox" id="predict"><span>3. Dự đoán chuyển động khi theo dõi</span></label>
      <label class="ctl"><span>…giữ ID khi mất dấu tối đa</span><b id="maxAgeV"></b><input type="range" id="maxAge" min="0.1" max="2" step="0.1"></label>
      <label class="ctl"><span>Tốc độ chụp của camera</span><b id="detHzV"></b><input type="range" id="detHz" min="2" max="30" step="1"></label>
    </div>
    <div class="card canvas-card">
      <h3 class="h-ic"><span class="ico-box sm amber"><i data-i="layers"></i></span>Máy tính IoU: kéo hai khung</h3>
      <canvas id="iouCanvas" class="touch" width="520" height="300" style="cursor:move"></canvas>
    </div>
  </div>
  <div class="card" style="margin-top:18px"><h3 class="h-ic"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của phễu xử lý</h3><pre class="code" id="genCode"></pre></div>''',
  breaks_h2="Thử thách: hãy làm AI đếm sai!",
  breaks=[
    dict(icon="sliders", key="low", title="Ngưỡng quá thấp", p="Hạ ngưỡng tin cậy xuống <b>12%</b>. Bóng cây và vết dầu trên đường bắt đầu được coi là xe…",
      why="Những khung báo nhầm rung rinh qua lại vạch đếm và được cộng vào. Kéo ngưỡng lên khoảng 40–60%. Không có ngưỡng nào hoàn hảo: cao quá thì bắt đầu bỏ sót những chiếc xe máy nhỏ."),
    dict(icon="layers", key="nonms", title="Tắt NMS", p="Không còn bước xóa khung trùng: mỗi xe có thể có 2–3 khung, và mỗi khung được theo dõi như một xe riêng.",
      why="Số đếm tăng vọt so với thực tế. Bật lại <b>NMS</b>. Thử kéo ngưỡng IoU của NMS lên 0,9: khung trùng lại lọt qua. Kéo xuống 0,1: hai xe đi sát nhau bị gộp làm một."),
    dict(icon="clock", key="lag", title="Camera giật hình, giờ cao điểm", p="Camera chỉ chụp <b>3 ảnh mỗi giây</b>, xe đông và chạy nhanh, bộ theo dõi không dự đoán chuyển động.",
      why="Giữa hai ảnh, xe đã chạy xa nên khung cũ và khung mới không còn chồng nhau. Bộ theo dõi tưởng là xe mới, cấp ID mới, nên có xe bị đếm hai lần hoặc bị bỏ sót. Bật <b>Dự đoán chuyển động</b>, tăng thời gian giữ ID, hoặc dùng camera nhanh hơn."),
  ],
  real_h2="Phát hiện & theo dõi vật thể đang được dùng ở đâu?",
  real=[("map", "", "Điều khiển đèn giao thông", "Đếm xe ở từng hướng để điều chỉnh thời gian đèn xanh, giảm ùn tắc giờ cao điểm."),
        ("eye", "mint", "Xe tự lái", "Ô tô tự lái liên tục phát hiện và theo dõi người đi bộ, xe máy, ô tô xung quanh để dự đoán họ sẽ đi đâu."),
        ("activity", "amber", "Thể thao & cửa hàng", "Theo dõi cầu thủ và quả bóng trên sân; đếm lượt khách vào cửa hàng mà không cần biết họ là ai.")],
  ethics=["Một camera AI đếm xe cũng có thể đọc biển số và nhận diện khuôn mặt. Ai được quyết định camera được phép làm gì?",
          "Nếu số đếm của AI sai 20% và thành phố dựa vào đó để xây thêm đường, hậu quả là gì? Cần kiểm tra AI thế nào trước khi tin?",
          "Ở Việt Nam xe máy rất nhiều và đi sát nhau. Một mô hình học từ video giao thông nước ngoài có đếm tốt ở đây không?"],
  badge="Người Gác Ngã Tư", badge_p="Em đã mở khóa 4 thẻ kiến thức: Phát hiện vật thể · IoU · NMS · Theo dõi & đếm.",
  dev_h2="Từ đếm xe ảo đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Đếm người vào thư viện", "Đặt camera nhìn cửa thư viện, dùng lớp \"person\" của COCO-SSD và vạch đếm hai chiều để biết lúc nào có bao nhiêu người bên trong.", "Xong khi", "số người trong thư viện sai lệch không quá 2 sau 30 phút."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Bản đồ mật độ xe cổng trường", "Quay video cổng trường giờ tan học ở nhiều ngày (không quay rõ mặt), đếm xe theo từng 5 phút và vẽ biểu đồ để đề xuất giờ tan học lệch giữa các khối.", "Xong khi", "có biểu đồ lưu lượng 5 ngày và một đề xuất gửi nhà trường."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Phát hiện người không đội mũ bảo hiểm", "Huấn luyện thêm một bộ phân loại trên vùng đầu của người đi xe máy (dựa vào khung bao xe máy). Nghiên cứu độ chính xác theo ánh sáng và góc camera.", "Đo kết quả", "độ chính xác và tỉ lệ báo nhầm trên video thật, có xin phép và làm mờ mặt.")],
  cur="09 · Đếm xe", next=[("12 · Phông nền ảo", "từ khung bao tới từng điểm ảnh"), ("14 · Bác sĩ lá cây", "bên trong mô hình nhìn ảnh"), ("19 · Xe tự lái tiến hóa", "xe tự quyết định")],
  khkt=[("Vấn đề", "Cổng trường ùn tắc nghiêm trọng vào giờ tan học."), ("Câu hỏi nghiên cứu", "Lưu lượng xe theo từng 5 phút thay đổi thế nào, và tan học lệch giờ giữa các khối giảm ùn tắc được bao nhiêu?"), ("Giả thuyết", "Tan học lệch 10 phút giữa hai khối giảm lưu lượng đỉnh ít nhất 30%."), ("Lưu ý đạo đức", "Không lưu video, chỉ lưu số đếm; không nhận diện cá nhân; xin phép nhà trường.")],
  prev=("08-am-thanh", "08"), nextp=("10-tu-the-ngoi", "10"),
)
