D = dict(
  out="du-an/12-phong-nen/index.html", num="12", level="3", title="Dự án 12 · Phông nền ảo",
  scripts=["seg.js"],
  h1='Tự làm <span class="hl-word">phông nền ảo</span>',
  lead="Mỗi lần học trực tuyến, phần mềm thay phòng của em bằng bãi biển hay làm mờ phía sau. Bí mật là AI phải trả lời gần 7.000 câu hỏi \"điểm ảnh này là người hay nền?\" cho mỗi khung hình, khoảng 30 lần mỗi giây. Hãy xem nó làm thế nào và khi nào nó bị lừa.",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" width="640" height="480" aria-label="Cuộc gọi video với phông nền ảo"></canvas><video id="video" playsinline muted hidden></video><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div class="stage-msg" id="stageMsg" hidden></div></div>
      <div class="toolbar">
        <div class="seg"><button class="btn small" id="srcSim"><i data-i="film"></i>Mô phỏng</button><button class="btn small ghost" id="srcCam"><i data-i="camera"></i>Camera thật</button></div>
        <button class="btn small ghost" id="btnNew"><i data-i="reset"></i>Cảnh khác</button>
      </div>
      <div class="game"><span class="small muted">Phông nền</span><div class="btn-row" id="bgBtns"><button class="btn small ghost" data-b="bien">Bãi biển</button><button class="btn small ghost" data-b="vu-tru">Vũ trụ</button><button class="btn small ghost" data-b="lop-hoc">Lớp học</button><button class="btn small ghost" data-b="lam-mo">Làm mờ</button></div></div>
      <div class="game"><span class="small muted">Xem</span><div class="btn-row" id="viewBtns"><button class="btn small ghost" data-v="out">Kết quả</button><button class="btn small ghost" data-v="goc">Ảnh gốc</button><button class="btn small ghost" data-v="xs">Bản đồ xác suất</button><button class="btn small ghost" data-v="loi">Chỗ sai</button></div></div>
      <p class="small muted" style="margin:8px 0 0"><i data-i="bulb"></i> Ở chế độ <b>Chỗ sai</b>: đỏ là nền bị tưởng là người, xanh lam là người bị tưởng là nền.</p>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="result" id="bIouBox"><small>ĐỘ KHỚP VỚI ĐÁP ÁN (IoU)</small><span id="bIou">—</span></div>
      <div class="metric-row"><div class="metric"><span>NỀN TƯỞNG LÀ NGƯỜI</span><b id="bFp">—</b></div><div class="metric"><span>NGƯỜI BỊ BỎ SÓT</span><b id="bFn">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>ĐIỂM ẢNH PHÂN VÂN</span><b id="bUnsure">—</b></div><div class="metric"><span>ĐIỂM ẢNH MỖI KHUNG</span><b>6.912</b></div></div>
      <div class="lbl" style="margin-top:12px">DỮ LIỆU ĐÃ HỌC</div><div id="trainInfo" style="color:#fff"></div>
    </aside>
  </div>''',
  mission_h2="Dạy máy tô màu từng điểm ảnh: người hay nền?",
  mission_q="Máy không biết \"người\" là gì. Vậy làm sao nó cắt đúng viền tóc của em?",
  mission_p="Em sẽ thấy ảnh biến thành <b>bản đồ xác suất</b>, chọn <b>ngưỡng</b> để có mặt nạ, đo độ khớp bằng <b>IoU</b>, rồi tìm ra những lúc AI bị lừa: áo trùng màu tường, ngồi lệch, ngược sáng.",
  minutes="45–60 phút",
  checklist=[("views", "Xem đủ 3 chế độ: kết quả, bản đồ xác suất, chỗ sai"), ("see", "Soi tới bước Bản đồ xác suất"), ("tune", "Kéo thanh ngưỡng và xem mặt nạ thay đổi"), ("broke", "Làm AI tách sai ít nhất 1 lần"), ("retrain", "Học lại với dữ liệu đa dạng hơn"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ khung hình tới phông nền ảo: 6 bước",
  soi_p="Hình bên dưới dùng đúng khung hình đang chạy ở phần Mồi.",
  theory=[
    dict(no="45", tag="Thị giác máy", title="Phân vùng ảnh",
      svg='<rect x="20" y="20" width="96" height="80" rx="6" class="f-soft"/><circle cx="68" cy="50" r="14" class="f-violet"/><path d="M44 100c4-24 44-24 48 0z" class="f-violet"/><path d="M126 60h20" class="s-line" stroke-width="2" marker-end="url(#arV)"/><rect x="156" y="20" width="96" height="80" rx="6" fill="#111"/><circle cx="204" cy="50" r="14" fill="#fff"/><path d="M180 100c4-24 44-24 48 0z" fill="#fff"/>',
      p="<b>Phân vùng</b> (segmentation) là gán nhãn cho <b>từng điểm ảnh</b>. Khác với Dự án 9 chỉ vẽ khung bao quanh xe, ở đây máy phải biết chính xác đường viền tới từng sợi tóc.",
      deep="Có nhiều kiểu phân vùng: tách người/nền (2 lớp), tách mọi loại vật (đường, xe, cây, trời…), hay tách riêng từng người một. Xe tự lái và máy chụp X-quang dùng phân vùng rất nhiều."),
    dict(no="46", tag="Xác suất", cls="amber", title="Bản đồ xác suất & ngưỡng",
      svg='<defs><linearGradient id="g12" x1="0" x2="1"><stop offset="0" stop-color="#1e145a"/><stop offset="1" stop-color="#ffd84d"/></linearGradient></defs><rect x="20" y="40" width="220" height="30" rx="6" fill="url(#g12)"/><path d="M130 30v50" class="s-coral" stroke-width="3"/><text x="104" y="24" font-size="11" class="t-mono f-coral">ngưỡng 0,5</text><text x="20" y="96" font-size="11" class="t-mono f-muted">0 = nền</text><text x="178" y="96" font-size="11" class="t-mono f-muted">1 = người</text>',
      p="Máy không nói chắc \"người\" hay \"nền\" mà cho một <b>xác suất</b> từ 0 tới 1. Ta chọn một <b>ngưỡng</b>: trên ngưỡng là người. Ngưỡng thấp thì ít bỏ sót người nhưng dễ lẫn nền; ngưỡng cao thì ngược lại.",
      deep="Đây chính là sự đánh đổi giữa bỏ sót và báo nhầm mà em gặp ở Dự án 9 và 10. Để đo độ khớp, người ta dùng <b>IoU</b> = phần chung ÷ phần gộp của mặt nạ máy và mặt nạ đúng."),
    dict(no="47", tag="Học máy", cls="coral", title="Ngữ cảnh & đường tắt",
      svg='<rect x="20" y="20" width="100" height="80" rx="6" class="f-soft"/><rect x="50" y="20" width="40" height="80" class="f-mint" opacity=".5"/><text x="32" y="114" font-size="10" class="t-mono f-muted">học: người ở giữa</text><rect x="150" y="20" width="100" height="80" rx="6" class="f-soft"/><circle cx="226" cy="50" r="12" class="f-coral"/><path d="M208 100c3-20 33-20 36 0z" class="f-coral"/><text x="160" y="114" font-size="10" class="t-mono f-coral">lệch → sai</text>',
      p="Chỉ nhìn màu một điểm ảnh thì không đủ: áo trắng và tường trắng giống hệt nhau. Máy cần <b>ngữ cảnh</b>: các điểm ảnh xung quanh, hình dáng. Nhưng nếu dữ liệu học thiếu đa dạng, máy lại học <b>đường tắt</b> như \"người luôn ở giữa\".",
      deep="Các mô hình thật dùng mạng tích chập (Dự án 14) nhìn những vùng rất rộng xung quanh mỗi điểm ảnh, và học từ hàng chục nghìn ảnh với đủ tư thế, ánh sáng, màu áo."),
    dict(no="48", tag="Đạo đức", cls="mint", title="Làm mờ nền & quyền riêng tư",
      svg='<rect x="20" y="20" width="220" height="86" rx="8" class="f-soft"/><g opacity=".45"><rect x="34" y="34" width="40" height="60" rx="4" class="f-amber"/><rect x="190" y="34" width="36" height="40" rx="4" class="f-mint"/></g><circle cx="130" cy="52" r="16" class="f-violet"/><path d="M100 106c6-32 54-32 60 0z" class="f-violet"/>',
      p="Làm mờ hoặc thay phông nền giúp che nhà cửa, đồ đạc và người thân phía sau, những thứ em không cần chia sẻ. Nhưng AI <b>không hoàn hảo</b>: ở viền hay khi nó sai, nền vẫn có thể lộ ra.",
      deep="Cũng công nghệ này có thể dùng để ghép người vào cảnh giả. Hãy nhớ: một bức ảnh hay video có phông nền đẹp chưa chắc là thật."),
  ],
  tulam_h2="Bàn thí nghiệm: chỉnh ngưỡng, làm mượt và dạy lại AI",
  tulam_p="Kéo các thanh và xem ngay trên sân khấu phần Mồi. Biểu đồ cho thấy độ khớp IoU trong 20 giây qua.",
  tulam='''
  <div class="card chart-card"><div class="chart-head"><b><i data-i="chart"></i> Độ khớp IoU theo thời gian</b><span class="legend"><i class="lg" style="background:var(--mint)"></i>IoU</span></div><canvas id="chart" width="1100" height="220"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Từ xác suất tới mặt nạ</h3>
      <label class="ctl"><span>Ngưỡng</span><b id="thV"></b><input type="range" id="th" min="0.05" max="0.95" step="0.01"></label>
      <label class="ctl"><span>Làm mờ bản đồ xác suất</span><b id="blurV"></b><input type="range" id="blur" min="0" max="4" step="1"></label>
      <label class="ctl"><span>Làm mềm viền</span><b id="featherV"></b><input type="range" id="feather" min="0" max="4" step="1"></label>
      <h3 class="h-ic" style="margin-top:18px"><span class="ico-box sm coral"><i data-i="layers"></i></span>Dữ liệu dạy AI</h3>
      <p class="small muted">Mặc định, AI chỉ học từ ảnh người ngồi giữa, phòng đủ sáng, áo khác màu tường. Hãy thêm dữ liệu đa dạng:</p>
      <label class="tog" style="display:block;margin:6px 0"><input type="checkbox" id="dPos"><span>Người ở nhiều vị trí</span></label>
      <label class="tog" style="display:block;margin:6px 0"><input type="checkbox" id="dLight"><span>Có cảnh ngược sáng</span></label>
      <label class="tog" style="display:block;margin:6px 0 12px"><input type="checkbox" id="dColor"><span>Có áo trùng màu tường</span></label>
      <button class="btn small accent" id="btnRetrain"><i data-i="play"></i>Học lại</button>
    </div>
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của phông nền ảo</h3><pre class="code" id="genCode"></pre>
      <p class="small muted">Mỗi điểm ảnh được hỏi riêng. Đó là lý do phân vùng cần máy tính nhanh: 6.912 điểm ảnh × 30 khung hình = hơn 200.000 lần đoán mỗi giây, mà đây còn là ảnh rất nhỏ.</p>
    </div>
  </div>''',
  breaks_h2="Thử thách: hãy làm phông nền ảo \"nuốt\" mất người!",
  breaks=[
    dict(icon="image", key="wall", title="Áo trùng màu tường", p="Bạn trong video mặc áo <b>đúng màu bức tường</b> phía sau.",
      why="AI nhìn chủ yếu vào màu, nên thân áo bị coi là tường và biến mất (vùng xanh lam ở chế độ Chỗ sai). Bật <b>Có áo trùng màu tường</b> rồi Học lại: kết quả khá hơn nhưng vẫn còn lỗi, vì ở cấp từng điểm ảnh áo và tường giống hệt nhau; máy chỉ đoán được nhờ vị trí và vùng xung quanh. Có lúc thêm dữ liệu chưa đủ mà phải nâng cấp <b>mô hình</b>: cần mô hình nhìn được hình dáng cả vùng lớn, như mạng tích chập ở Dự án 14."),
    dict(icon="crosshair", key="side", title="Ngồi lệch sang bên", p="Bạn ấy dịch ghế sang <b>sát mép khung hình</b>.",
      why="Dữ liệu học chỉ có người ngồi giữa, nên AI học đường tắt \"giữa khung = người, mép = nền\". Bật <b>Người ở nhiều vị trí</b> rồi Học lại: AI buộc phải dựa vào màu và ngữ cảnh thay vì vị trí."),
    dict(icon="sun", key="backlit", title="Ngồi ngược sáng", p="Phía sau là <b>cửa sổ chói nắng</b>, người trong video tối sẫm.",
      why="Màu da và áo bị tối đi, khác hẳn lúc học. Bật <b>Có cảnh ngược sáng</b> rồi Học lại. Ngoài đời, cách đơn giản nhất là quay mặt về phía cửa sổ: dữ liệu đầu vào tốt luôn giúp AI."),
  ],
  real_h2="Phân vùng ảnh đang được dùng ở đâu?",
  real=[("camera", "", "Học và họp trực tuyến", "Phông nền ảo, làm mờ nền trong các ứng dụng gọi video chạy ngay trên máy tính hoặc điện thoại."),
        ("image", "mint", "Chụp ảnh xóa phông", "Chế độ chân dung trên điện thoại tách người ra rồi làm mờ phía sau, giống máy ảnh chuyên nghiệp."),
        ("heart", "amber", "Y tế", "Phân vùng khối u hay cơ quan trên ảnh chụp cắt lớp, giúp bác sĩ đo kích thước chính xác hơn.")],
  ethics=["Phông nền ảo giúp em giữ riêng tư. Nhưng nếu nó sai và làm lộ phòng của em, ai chịu trách nhiệm?",
          "Nếu dữ liệu học có ít người tóc xoăn, da sẫm hay đội khăn, phông nền ảo có tách những người đó kém hơn không? Làm sao kiểm tra?",
          "Ghép người vào cảnh giả rất dễ. Em sẽ kiểm tra thế nào trước khi tin một video?"],
  badge="Thợ Tách Nền", badge_p="Em đã mở khóa 4 thẻ kiến thức: Phân vùng ảnh · Bản đồ xác suất & ngưỡng · Ngữ cảnh & đường tắt · Làm mờ nền & quyền riêng tư.",
  dev_h2="Từ phông nền ảo đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Phông nền tự chọn", "Thêm nút tải ảnh của em làm phông nền, và hiệu ứng \"bóng\" người đổ lên phông cho tự nhiên hơn.", "Xong khi", "chạy với camera thật ít nhất 20 khung hình mỗi giây."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Đo độ công bằng của phông nền ảo", "Chụp 30–50 ảnh (có đồng ý) với màu áo, kiểu tóc, ánh sáng khác nhau, tự tô mặt nạ đúng và đo IoU cho từng nhóm.", "Xong khi", "có bảng IoU theo nhóm và chỉ ra nhóm AI tách kém nhất."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Phân vùng lá lúa bị bệnh trên đồng ruộng", "Dùng phân vùng để tách phần lá bị đốm khỏi lá khỏe trên ảnh chụp ruộng, rồi tính tỉ lệ diện tích bệnh.", "Đo kết quả", "IoU so với mặt nạ do người tô, và độ lệch tỉ lệ diện tích bệnh so với chuyên gia.")],
  cur="12 · Phông nền ảo", next=[("13 · Bảng màu thông minh", "học không cần nhãn"), ("14 · Bác sĩ lá cây", "mạng tích chập"), ("17 · Cảm xúc câu nói", "vector cho từ ngữ")],
  khkt=[("Vấn đề", "Ước lượng tỉ lệ lá lúa bị bệnh bằng mắt thường chậm và thiếu đồng đều."), ("Câu hỏi nghiên cứu", "Phân vùng ảnh có đo tỉ lệ diện tích bệnh sát với chuyên gia không?"), ("Giả thuyết", "Sai lệch dưới 10% với ảnh chụp trong điều kiện ánh sáng ổn định."), ("Lưu ý đạo đức", "Hỏi ý kiến chủ ruộng; không dùng kết quả thay cho chẩn đoán của cán bộ nông nghiệp.")],
  prev=("11-chu-so", "11"), nextp=("13-phan-cum", "13"),
)
