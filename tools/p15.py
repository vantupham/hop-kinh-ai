D = dict(
  out="du-an/15-thu-ngu/index.html", num="15", level="3", title="Dự án 15 · Cử chỉ chuyển động",
  scripts=["../../assets/sim-hand.js", "gesture.js"],
  h1='Hiểu <span class="hl-word">cử chỉ chuyển động</span>',
  lead="Vẫy tay chào, vẽ vòng tròn trong không khí, vuốt lên để lật trang… Những cử chỉ này không nằm trong một khung hình mà trải dài theo thời gian. Đây cũng là bước đầu tiên để máy hiểu được ngôn ngữ ký hiệu. Hãy xem máy cắt, kéo giãn và so khớp từng chuỗi chuyển động.",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Bàn tay làm cử chỉ và bảng so khớp với 5 mẫu"></canvas><video id="video" playsinline muted hidden></video><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div class="stage-msg" id="stageMsg" hidden></div></div>
      <div class="toolbar">
        <div class="seg"><button class="btn small" id="srcSim"><i data-i="film"></i>Mô phỏng</button><button class="btn small ghost" id="srcCam"><i data-i="camera"></i>Camera thật</button></div>
        <div class="seg sim-only" id="modeBtns"><button class="btn small ghost" data-m="auto"><i data-i="play"></i>Máy tự diễn</button><button class="btn small ghost" data-m="mouse"><i data-i="figure"></i>Em tự vẽ</button></div>
      </div>
      <div class="game sim-only"><span class="small muted">Bảo máy diễn</span><div class="btn-row" id="gBtns"></div></div>
      <p class="small muted" style="margin:8px 0 0"><i data-i="bulb"></i> Giữ chuột (hoặc ngón tay) trên sân khấu và vẽ một trong 5 cử chỉ, rồi thả ra.</p>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="result"><small>CỬ CHỈ VỪA RỒI</small><span id="bRes">—</span></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>SỐ KHUNG TRONG ĐOẠN</span><b id="bSeg">—</b></div><div class="metric"><span>KHOẢNG CÁCH GẦN NHẤT</span><b id="bDist">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>ĐÚNG / 20 LẦN GẦN NHẤT</span><b id="bAcc">—</b></div><div class="metric"><span>ĐIỂM MỖI CỬ CHỈ</span><b>32</b></div></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">5 cử chỉ ở đây do Hộp Kính AI tự đặt ra để học cách làm, <b>không phải</b> ký hiệu của Ngôn ngữ ký hiệu Việt Nam.</p>
    </aside>
  </div>''',
  mission_h2="Dạy máy hiểu một chuyển động, không chỉ một tư thế",
  mission_q="Cùng một cử chỉ, mỗi lần làm lại nhanh chậm khác nhau. Máy so sánh thế nào?",
  mission_p="Em sẽ biến bàn tay thành một <b>chuỗi điểm theo thời gian</b>, xem máy <b>cắt đoạn</b> chuyển động, <b>chuẩn hóa</b>, rồi dùng <b>DTW</b> để co giãn thời gian khi so với mẫu. Em còn có thể dạy máy cử chỉ của riêng em.",
  minutes="60–75 phút",
  checklist=[("see3", "Để máy nhận đúng ít nhất 3 cử chỉ khác nhau"), ("own", "Tự vẽ một cử chỉ bằng chuột hoặc camera"), ("soi", "Soi tới bước So khớp DTW"), ("save", "Lưu một cử chỉ của em làm mẫu"), ("broke", "Làm máy nhận sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ bàn tay tới cử chỉ: 6 bước",
  soi_p="Hình bên dưới dùng đúng cử chỉ vừa diễn ra ở phần Mồi.",
  theory=[
    dict(no="57", tag="Dữ liệu", title="Chuỗi thời gian",
      svg='<path d="M20 100H240" class="s-line" stroke-width="1"/><path d="M20 80C50 30 70 30 90 70S140 110 160 60S210 30 240 50" fill="none" class="s-violet" stroke-width="3"/><g class="f-coral"><circle cx="20" cy="80" r="4"/><circle cx="90" cy="70" r="4"/><circle cx="160" cy="60" r="4"/><circle cx="240" cy="50" r="4"/></g><text x="190" y="116" font-size="10" class="t-mono f-muted">thời gian →</text>',
      p="<b>Chuỗi thời gian</b> là dãy số đo nối tiếp nhau theo thời gian: nhịp tim, nhiệt độ, giá cả, hay vị trí bàn tay mỗi khung hình. Với chuỗi, <b>thứ tự</b> mang ý nghĩa: đảo ngược vuốt lên sẽ thành vuốt xuống.",
      deep="Em đã gặp chuỗi thời gian ở Dự án 1 (đếm squat theo góc gối), Dự án 8 (âm thanh) và Dự án 10. Ở đây cả chuỗi là một mẫu dữ liệu cần phân loại."),
    dict(no="58", tag="Xử lý", cls="amber", title="Cắt đoạn & chuẩn hóa",
      svg='<rect x="20" y="30" width="220" height="60" rx="6" class="f-soft"/><path d="M20 80h40l20-40 20 40 20-40 20 40h100" fill="none" class="s-violet" stroke-width="2.5"/><rect x="60" y="30" width="80" height="60" fill="none" class="s-mint" stroke-width="2.5" stroke-dasharray="5 4"/><text x="62" y="110" font-size="10" class="t-mono f-mint">một cử chỉ</text>',
      p="Máy phải tự tìm <b>lúc bắt đầu và kết thúc</b> một cử chỉ: dựa vào tốc độ bàn tay. Sau đó đưa đoạn về cùng vị trí và cùng kích thước để chỉ còn lại <b>hình dạng</b> của chuyển động.",
      deep="Cắt đoạn là phần khó nhất của nhận dạng ngôn ngữ ký hiệu thật, vì người ký hiệu nối các từ liền mạch, không dừng giữa các từ. Các hệ thống hiện đại dùng mạng nơ-ron học luôn cả việc cắt đoạn."),
    dict(no="59", tag="Thuật toán", cls="coral", title="Co giãn thời gian (DTW)",
      svg='<path d="M20 40C60 10 80 70 120 40S200 20 240 40" fill="none" class="s-violet" stroke-width="3"/><path d="M20 100C40 70 60 130 100 100S200 80 240 100" fill="none" class="s-coral" stroke-width="3"/><g class="s-line" stroke-width="1"><path d="M20 40 20 100M60 34 40 94M120 40 100 100M180 30 150 94M240 40 240 100"/></g>',
      p="Hai lần vẫy tay không bao giờ cùng nhịp. <b>DTW</b> (Dynamic Time Warping) tìm cách ghép từng điểm của chuỗi này với điểm tương ứng của chuỗi kia, cho phép <b>kéo giãn</b> hay <b>nén</b> thời gian, sao cho tổng khoảng cách nhỏ nhất.",
      deep="DTW dùng <b>quy hoạch động</b>: điền dần một bảng, mỗi ô dựa trên 3 ô bên cạnh đã tính. Đây là một kỹ thuật thuật toán quan trọng em sẽ gặp lại trong tin học, ví dụ khi so sánh hai đoạn ADN."),
    dict(no="60", tag="Đạo đức", cls="mint", title="AI và ngôn ngữ ký hiệu",
      svg='<circle cx="80" cy="60" r="34" class="f-soft"/><path d="M64 60l10 10 20-22" fill="none" class="s-mint" stroke-width="4"/><circle cx="180" cy="60" r="34" class="f-soft"/><path d="M180 44v18M180 72v4" class="s-coral" stroke-width="5" stroke-linecap="round"/>',
      p="Ngôn ngữ ký hiệu có ngữ pháp riêng, dùng cả bàn tay, nét mặt và cơ thể. Nhận được vài cử chỉ <b>chưa phải</b> là hiểu ngôn ngữ. Một hệ thống thật phải được xây <b>cùng</b> cộng đồng người Điếc, không chỉ <b>cho</b> họ.",
      deep="Ngôn ngữ ký hiệu ở mỗi nước, thậm chí mỗi vùng, khác nhau. Dữ liệu phải do người dùng ngôn ngữ đó cung cấp và đồng ý, và họ cần được tham gia đánh giá xem hệ thống có hữu ích, có tôn trọng ngôn ngữ của họ không."),
  ],
  tulam_h2="Bàn thí nghiệm: ma trận DTW và cử chỉ của riêng em",
  tulam_p="Chọn một mẫu để xem ma trận chi phí giữa nó và cử chỉ vừa rồi. Ô sáng là cặp điểm gần nhau; đường vàng là cách ghép tốt nhất.",
  tulam='''
  <div class="two-col">
    <div class="card canvas-card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="blocks"></i></span>Ma trận chi phí DTW</h3>
      <canvas id="dtwM" width="460" height="400"></canvas>
      <div class="btn-row" id="tplBtns" style="margin-top:8px"></div>
    </div>
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm coral"><i data-i="sliders"></i></span>Điều chỉnh</h3>
      <label class="tog" style="display:block;margin:6px 0"><input type="checkbox" id="norm"><span>Chuẩn hóa vị trí & kích thước</span></label>
      <label class="tog" style="display:block;margin:6px 0 10px"><input type="checkbox" id="dtw"><span>Dùng DTW (tắt = so từng khung theo thời gian thật)</span></label>
      <label class="ctl"><span>Ngưỡng khoảng cách</span><b id="thrV"></b><input type="range" id="thr" min="0.1" max="1.5" step="0.01"></label>
      <label class="ctl"><span>Đứng yên bao lâu thì cắt đoạn</span><b id="restV"></b><input type="range" id="rest" min="0.05" max="0.8" step="0.01"></label>
      <div class="lbl muted small" style="margin:10px 0 4px">NGƯỜI DIỄN MÔ PHỎNG</div>
      <label class="ctl"><span>Nhịp thất thường</span><b id="warpV"></b><input type="range" id="warp" min="0" max="0.95" step="0.05"></label>
      <label class="ctl"><span>Tốc độ diễn</span><b id="speedV"></b><input type="range" id="speed" min="0.5" max="2" step="0.1"></label>
      <div class="btn-row" style="margin-top:8px"><button class="btn small accent" id="btnSave"><i data-i="upload"></i>Lưu cử chỉ vừa rồi làm mẫu</button><button class="btn small ghost" id="btnResetTpl"><i data-i="reset"></i>Về mẫu gốc</button></div>
      <p class="small muted" style="margin:6px 0 0">Mẫu được lưu vào loại đang chọn bên trái. Hiện có: <b id="tplCount"></b></p>
    </div>
  </div>
  <div class="two-col" style="margin-top:18px">
    <div class="card chart-card"><div class="chart-head"><b><i data-i="activity"></i> Tốc độ bàn tay (dùng để cắt đoạn)</b></div><canvas id="chart" width="540" height="200"></canvas></div>
    <div class="card"><div class="chart-head"><b><i data-i="checkCircle"></i> 20 cử chỉ gần nhất của máy diễn · đúng <span id="labAcc">—</span></b></div><canvas id="histV" width="540" height="130"></canvas><p class="small muted" style="margin:4px 0 0">Xanh: đúng · Cam: sai · Xám: Không rõ</p>
      <h3 class="h-ic" style="margin-top:12px"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật</h3><pre class="code" id="genCode"></pre></div>
  </div>''',
  breaks_h2="Thử thách: hãy làm máy hiểu sai cử chỉ!",
  breaks=[
    dict(icon="clock", key="speed", title="Nhịp thất thường", p="Người diễn làm cử chỉ <b>chậm hơn mẫu, lại nhanh chỗ này chậm chỗ kia</b>, và máy bị tắt DTW: khung thứ 1 so với khung thứ 1, khung thứ 2 với khung thứ 2…",
      why="Khi so cứng theo thời gian, lúc mẫu đã vẽ xong thì em mới vẽ được nửa đường, nên máy nhận sai hoặc nói Không rõ. Bật <b>Dùng DTW</b>: máy co giãn thời gian để ghép đúng điểm tương ứng. Xem ma trận: đường vàng không còn là đường chéo thẳng."),
    dict(icon="scan", key="cut", title="Cắt đoạn vội vàng", p="Chỉ cần bàn tay dừng <b>0,05 giây</b> là máy coi như cử chỉ đã xong.",
      why="Chữ Z và chữ V có những chỗ tay dừng rất ngắn ở góc. Máy cắt cử chỉ thành nhiều mẩu, mỗi mẩu trông như \"vuốt\" một đường. Tăng <b>thời gian đứng yên</b> lên khoảng 0,3 giây. Đặt quá dài thì hai cử chỉ liền nhau sẽ bị dính vào nhau."),
    dict(icon="crosshair", key="pos", title="Đứng lệch, ở xa", p="Người diễn đứng ở <b>góc trên bên phải</b>, xa camera nên cử chỉ nhỏ, và bước chuẩn hóa bị tắt.",
      why="Không chuẩn hóa thì máy so tọa độ thật: cử chỉ nhỏ ở góc cách xa mọi mẫu ở giữa, nên máy chọn mẫu \"ít xa nhất\" một cách vô nghĩa (thường cứ ra một cử chỉ) hoặc nói Không rõ. Bật <b>Chuẩn hóa vị trí & kích thước</b>."),
  ],
  real_h2="Nhận dạng chuyển động đang được dùng ở đâu?",
  real=[("msg", "", "Hỗ trợ giao tiếp", "Các dự án nghiên cứu nhận dạng ngôn ngữ ký hiệu từ video, giúp người Điếc và người nghe trao đổi dễ hơn. Đây là bài toán còn rất khó."),
        ("gamepad", "mint", "Điều khiển không chạm", "Vẫy tay để chuyển bài, xoay tay để chỉnh âm lượng trong ô tô, trò chơi vận động trước màn hình."),
        ("activity", "amber", "Sức khỏe & thể thao", "So khớp động tác tập phục hồi chức năng với động tác mẫu của bác sĩ, kể cả khi bệnh nhân làm chậm hơn.")],
  ethics=["Một ứng dụng \"phiên dịch ngôn ngữ ký hiệu\" chỉ biết vài chục từ và hay dịch sai. Quảng cáo nó như một phiên dịch viên có ổn không?",
          "Ai nên được tham gia khi xây dựng công nghệ cho cộng đồng người Điếc? Vì sao?",
          "Dữ liệu video ký hiệu cho thấy rõ khuôn mặt người làm. Cần bảo vệ quyền riêng tư của họ thế nào?"],
  badge="Bậc Thầy Chuyển Động", badge_p="Em đã mở khóa 4 thẻ kiến thức: Chuỗi thời gian · Cắt đoạn & chuẩn hóa · DTW · AI và ngôn ngữ ký hiệu.",
  dev_h2="Từ cử chỉ chuyển động đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Điều khiển trình chiếu bằng cử chỉ", "Gán vuốt lên, vòng tròn, chữ V thành các phím chuyển trang, phóng to, tắt màn hình cho bài thuyết trình của em.", "Xong khi", "trình bày được 5 phút chỉ bằng cử chỉ, sai không quá 1 lần."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Cử chỉ bằng cả hai tay và hình dạng bàn tay", "Mỗi khung dùng thêm 5 độ duỗi ngón tay (Dự án 3) và vị trí tay thứ hai, rồi so khớp DTW trên chuỗi nhiều chiều.", "Xong khi", "phân biệt được hai cử chỉ có cùng đường đi nhưng khác hình bàn tay."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Trợ lý học ký hiệu cho người mới", "Cùng thầy cô và cộng đồng người Điếc ở địa phương chọn 10–20 ký hiệu thông dụng, thu dữ liệu có đồng ý, xây công cụ chấm điểm động tác cho người học.", "Đo kết quả", "độ chính xác, và đánh giá của chính người Điếc về độ hữu ích và độ tôn trọng ngôn ngữ.")],
  cur="15 · Cử chỉ động", next=[("16 · Đoán chữ tiếp theo", "chuỗi chữ thay cho chuỗi chuyển động"), ("5 · Vũ công AI", "so khớp động tác"), ("18 · Robot thoát mê cung", "AI tự quyết định")],
  khkt=[("Vấn đề", "Người mới học ngôn ngữ ký hiệu khó biết mình làm đúng hay chưa khi không có giáo viên."), ("Câu hỏi nghiên cứu", "So khớp DTW với mẫu của người Điếc có chấm điểm động tác sát với đánh giá của họ không?"), ("Giả thuyết", "Điểm DTW tương quan chặt với điểm do người Điếc chấm."), ("Lưu ý đạo đức", "Hợp tác và ghi công cộng đồng người Điếc; có đồng ý khi quay video; không công bố khuôn mặt.")],
  prev=("14-la-cay", "14"), nextp=("16-doan-chu", "16"),
)
