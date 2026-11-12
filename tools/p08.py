D = dict(
  out="du-an/08-am-thanh/index.html", num="08", level="2", title="Dự án 8 · Nhận diện âm thanh",
  scripts=["audio-lab.js", "sound.js"],
  h1='Nhận diện <span class="hl-word">âm thanh</span>',
  lead="Vỗ tay, huýt sáo, gảy đàn hay gõ trống: AI nghe và gọi tên âm thanh ngay lập tức. Bí mật là gì? Máy biến âm thanh thành một bức ảnh, rồi nhìn bức ảnh đó!",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" width="640" height="480" aria-label="Sóng âm và ảnh phổ đang chạy"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div id="stageMsg" class="stage-msg" hidden></div></div>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="Nguồn âm thanh"><button class="btn small" id="srcSim" aria-pressed="true"><i data-i="pulse"></i>Âm thanh mô phỏng</button><button class="btn small ghost" id="srcCam" aria-pressed="false"><i data-i="msg"></i>Micro</button></div>
        <div class="seg sim-only"><button class="btn small" id="btnAuto" aria-pressed="true"><i data-i="repeat"></i>Phát ngẫu nhiên</button><button class="btn small ghost" id="btnPlay"><i data-i="play"></i>Nghe âm vừa rồi</button></div>
      </div>
      <div class="toolbar sim-only"><span class="muted small">Tạo âm thanh:</span><div class="seg" id="makeBtns"></div></div>
      <div class="panel-ctl sim-only"><label class="ctl"><span>Tiếng ồn nền</span><b id="noiseV"></b><input type="range" id="noise" min="0" max="0.35" step="0.01"></label><label class="ctl"><span>Âm lượng (gần hay xa micro)</span><b id="volV"></b><input type="range" id="vol" min="0.05" max="1.5" step="0.05"></label></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="result" id="bResult"><small>AI NGHE THẤY</small>—</div>
      <div class="lbl" style="margin-top:14px">XÁC SUẤT TỪNG LOẠI</div>
      <div class="bars" id="bProbs"></div>
      <div class="metric-row"><div class="metric"><span>NHẬN ĐÚNG</span><b id="bStats">0/0</b></div><div class="metric"><span>TIẾNG ỒN NỀN</span><b id="bNoise">—</b></div></div>
    </aside>
  </div>''',
  mission_h2="Biến âm thanh thành hình ảnh, rồi dạy máy nhận ra hình ảnh đó",
  mission_q="Máy không có tai. Vậy làm sao nó phân biệt được tiếng vỗ tay và tiếng huýt sáo?",
  mission_p="Em sẽ thấy âm thanh chỉ là một dãy số, dùng <b>phép biến đổi Fourier</b> để tách nó thành các tần số, rồi vẽ thành <b>ảnh phổ</b>. Từ đây, nhận diện âm thanh trở thành nhận diện ảnh, việc em đã làm ở Dự án 6!",
  minutes="45–60 phút",
  checklist=[("make", "Tạo đủ 4 loại âm thanh và xem ảnh phổ của chúng"), ("see", "Xem phép biến đổi Fourier tách một khung âm thanh"), ("record", "Ghi ít nhất 3 mẫu âm thanh của em"), ("broke", "Làm AI nghe nhầm ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ dãy số tới tên âm thanh: 6 bước",
  soi_p="Ba bước đầu dùng âm thanh vừa phát, ba bước sau dùng âm vừa được AI nhận diện ở phần Mồi.",
  theory=[
    dict(no="29", tag="Vật lý + AI", title="Âm thanh là sóng",
      svg='<path d="M10 60 C25 20 40 20 55 60 S85 100 100 60 S130 20 145 60" fill="none" class="s-violet" stroke-width="2.5"/><path d="M150 60 C155 45 160 45 165 60 S175 75 180 60 S190 45 195 60 S205 75 210 60 S220 45 225 60 S235 75 240 60" fill="none" class="s-coral" stroke-width="2.5"/><text x="30" y="112" font-size="11" class="t-mono f-violet">trầm (tần số thấp)</text><text x="150" y="112" font-size="11" class="t-mono f-coral">bổng (tần số cao)</text>',
      p="Âm thanh là không khí dao động. <b>Tần số</b> (số dao động mỗi giây, đơn vị Hz) quyết định âm trầm hay bổng, còn <b>biên độ</b> quyết định to hay nhỏ. Micro đo dao động này 16.000 lần mỗi giây.",
      deep="Tai người nghe được khoảng 20 Hz tới 20.000 Hz. Tiếng trống chủ yếu dưới 150 Hz, huýt sáo khoảng 1.000–2.500 Hz, còn tiếng vỗ tay trải rộng khắp các tần số, giống như \"nhiễu\"."),
    dict(no="30", tag="Toán + AI", title="Phép biến đổi Fourier",
      svg='<path d="M20 70 C40 30 50 100 70 60 S100 40 110 70" fill="none" class="s-ink" stroke-width="2"/><path d="M120 60h24" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><g><rect x="156" y="70" width="10" height="34" class="f-coral"/><rect x="170" y="40" width="10" height="64" class="f-amber"/><rect x="184" y="84" width="10" height="20" class="f-mint"/><rect x="198" y="58" width="10" height="46" class="f-violet"/><rect x="212" y="92" width="10" height="12" class="f-mint"/><rect x="226" y="96" width="10" height="8" class="f-mint"/></g>',
      p="Một âm thanh phức tạp là <b>tổng của nhiều sóng đơn giản</b> ở các tần số khác nhau. Phép biến đổi Fourier tìm ra mỗi tần số góp bao nhiêu, giống như lăng kính tách ánh sáng trắng thành cầu vồng.",
      deep="FFT (Fast Fourier Transform) là cách tính nhanh, được coi là một trong những thuật toán quan trọng nhất thế kỷ 20. Nó có mặt trong nén nhạc MP3, ảnh JPEG, wifi, và cả máy chụp cộng hưởng từ trong bệnh viện."),
    dict(no="31", tag="Thị giác máy tính", cls="coral", title="Ảnh phổ: nghe bằng mắt",
      svg='<g><rect x="20" y="20" width="220" height="80" fill="#0b0d26"/><rect x="40" y="30" width="6" height="66" fill="#ffc34d" opacity=".9"/><rect x="50" y="32" width="6" height="62" fill="#ffc34d" opacity=".7"/><path d="M100 46 Q130 36 160 42" stroke="#3ee9cf" stroke-width="4" fill="none"/><rect x="190" y="80" width="30" height="16" fill="#ff7d5f"/></g>',
      p="Xếp kết quả Fourier của từng khung cạnh nhau, ta được <b>ảnh phổ</b>: ngang là thời gian, dọc là tần số. Vỗ tay là vạch dọc, huýt sáo là đường mảnh ở trên cao, trống là khối ở dưới đáy. Máy chỉ cần <b>nhận diện ảnh</b>.",
      deep="Đây là ví dụ đẹp của việc tái sử dụng ý tưởng trong AI: nhiều hệ thống nhận dạng giọng nói và nhận diện tiếng chim đều chuyển âm thanh thành ảnh phổ rồi dùng mạng nhận diện ảnh (Dự án 14)."),
    dict(no="32", tag="Dữ liệu", cls="amber", title="Tiếng ồn & chuẩn hóa âm lượng",
      svg='<rect x="20" y="20" width="100" height="80" fill="#0b0d26"/><rect x="20" y="20" width="100" height="80" fill="#ff7d5f" opacity=".25"/><path d="M40 46 Q70 36 100 42" stroke="#3ee9cf" stroke-width="3" fill="none" opacity=".5"/><path d="M128 60h24" class="s-mint" stroke-width="2.5" marker-end="url(#arM)"/><rect x="160" y="20" width="80" height="80" fill="#0b0d26"/><path d="M172 46 Q200 36 228 42" stroke="#3ee9cf" stroke-width="4" fill="none"/>',
      p="Ngoài đời luôn có tiếng quạt, tiếng xe, tiếng mưa che lấp âm cần nghe. Người ta <b>ước lượng tiếng ồn nền</b> rồi trừ bớt đi. Âm lượng cũng thay đổi theo khoảng cách, nên cần <b>chuẩn hóa</b>: chỉ so hình dạng ảnh phổ, không so độ to.",
      deep="Tai nghe chống ồn và cuộc gọi video đều dùng kỹ thuật lọc tiếng ồn, ngày nay thường bằng mạng nơ-ron. Nhưng lọc quá tay cũng có thể xóa luôn âm thanh cần nghe."),
  ],
  tulam_h2="Bàn thí nghiệm: xử lý âm thanh và tự huấn luyện",
  tulam_p="Bật hoặc tắt từng bước xử lý rồi xem AI nghe đúng hay sai. Bên dưới là \"ảnh phổ trung bình\" của mỗi loại âm mà máy đã học, tức là máy nhớ mỗi âm \"trông như thế nào\".",
  tulam='''
  <div class="two-col">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Các bước xử lý</h3>
      <div class="btn-row" style="margin-bottom:10px"><label class="tog"><input type="checkbox" id="norm"><span>Chuẩn hóa âm lượng</span></label><label class="tog"><input type="checkbox" id="sub"><span>Trừ tiếng ồn nền</span></label><label class="tog"><input type="checkbox" id="unk"><span>Cho phép trả lời "Không biết"</span></label></div>
      <label class="ctl"><span>"Không biết" khi xác suất cao nhất dưới</span><b id="unkThV"></b><input type="range" id="unkTh" min="0.3" max="0.95" step="0.05"></label>
      <h3 class="h-ic" style="margin-top:18px"><span class="ico-box sm coral"><i data-i="checkCircle"></i></span>Kiểm tra với 40 âm mới</h3>
      <p class="small muted">Dùng đúng mức tiếng ồn và âm lượng đang chọn ở phần Mồi.</p>
      <div class="btn-row"><button class="btn small accent" id="btnTest"><i data-i="flask"></i>Chạy kiểm tra</button><span class="chip mint">Độ chính xác: <b id="testAcc">—</b></span></div>
      <div class="lab" id="confOut" style="margin-top:10px"></div>
    </div>
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của đường xử lý</h3><pre class="code" id="genCode"></pre>
      <h3 class="h-ic" style="margin-top:18px"><span class="ico-box sm amber"><i data-i="upload"></i></span>Dạy máy bằng âm thanh của em</h3>
      <p class="small muted">Sau khi AI vừa nghe một âm (mô phỏng hoặc micro), bấm đúng tên âm đó để lưu làm mẫu:</p>
      <div class="btn-row" id="recBtns"></div>
      <p class="small muted" id="ownInfo" style="margin:8px 0">Chưa có mẫu nào.</p>
      <button class="btn small accent" id="btnOwn"><i data-i="play"></i>Huấn luyện bằng mẫu của em</button>
    </div>
  </div>
  <div class="card canvas-card" style="margin-top:18px"><h3 class="h-ic"><span class="ico-box sm"><i data-i="image"></i></span>Ảnh phổ trung bình mà máy đã học</h3><canvas id="protos" width="670" height="180"></canvas></div>''',
  breaks_h2="Thử thách: hãy làm AI nghe nhầm!",
  breaks=[
    dict(icon="pulse", key="noisy", title="Phòng rất ồn", p="Bật quạt to hết cỡ: tiếng ồn nền lấp gần hết ảnh phổ.",
      why="Ảnh phổ bị phủ một lớp \"sương mù\" màu, nên các hình dạng khó nhận ra. Bật <b>Trừ tiếng ồn nền</b> trong Bàn thí nghiệm rồi chạy kiểm tra lại. Lưu ý là trừ tiếng ồn giúp được một phần, nhưng không thần kỳ."),
    dict(icon="msg", key="quiet", title="Âm thanh ở xa", p="Âm lượng chỉ còn 12% (như đứng cuối lớp), và <b>tắt chuẩn hóa âm lượng</b>.",
      why="Máy đã học từ âm thanh to rõ. Không có chuẩn hóa, âm nhỏ trông \"nhạt\" hẳn đi trên ảnh phổ nên máy đoán sai. Bật lại <b>Chuẩn hóa âm lượng</b> để máy chỉ so hình dạng."),
    dict(icon="help", key="dog", title="Âm lạ: chó sủa", p="Thỉnh thoảng có tiếng chó sủa, âm thanh mà máy chưa từng học.",
      why="Máy vẫn tự tin gọi nó là một trong 4 loại đã học. Bật <b>Cho phép trả lời \"Không biết\"</b>. Đây là bài học em đã gặp ở Dự án 2 và 6: AI chỉ biết những gì nó đã thấy."),
  ],
  real_h2="Nhận diện âm thanh đang được dùng ở đâu?",
  real=[("heart", "", "Bảo tồn thiên nhiên", "Các nhà khoa học đặt micro trong rừng, dùng AI nhận ra tiếng chim, tiếng vượn hay tiếng cưa máy của lâm tặc."),
        ("alert", "mint", "Cảnh báo an toàn", "Điện thoại có thể nhận ra tiếng còi báo cháy, tiếng em bé khóc hay chuông cửa để báo cho người khiếm thính."),
        ("msg", "amber", "Trợ lý giọng nói", "Nhận dạng giọng nói cũng bắt đầu từ ảnh phổ, nhưng phức tạp hơn nhiều: phải hiểu cả chuỗi âm tiết nối nhau.")],
  ethics=["Một chiếc loa thông minh luôn \"nghe\" để chờ lệnh. Em có biết nó gửi những gì lên máy chủ không? Làm sao để biết?",
          "Nếu trường lắp micro AI để phát hiện đánh nhau, lời nói riêng của học sinh có bị thu lại không? Ai được nghe?",
          "Trang web này phân tích âm thanh ngay trên máy em và không ghi âm lại. Vì sao cách thiết kế này quan trọng?"],
  badge="Đôi Tai Fourier", badge_p="Em đã mở khóa 4 thẻ kiến thức: Âm thanh là sóng · Biến đổi Fourier · Ảnh phổ · Tiếng ồn & chuẩn hóa.",
  dev_h2="Từ nhận diện âm thanh đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Chuông báo tiếng vỗ tay", "Dùng micro, ghi 10 mẫu vỗ tay và 10 mẫu \"im lặng/nói chuyện\". Khi nhận ra 2 tiếng vỗ tay liên tiếp, đổi màu màn hình hoặc bật nhạc.", "Xong khi", "không bị kích hoạt nhầm trong 5 phút cả lớp nói chuyện."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Nhận diện tiếng chim quanh trường", "Ghi âm tiếng chim ở sân trường (nhờ thầy cô sinh học giúp nhận biết loài), tạo ảnh phổ và huấn luyện bộ phân loại 3–5 loài phổ biến.", "Xong khi", "nhận đúng loài trong 7/10 đoạn ghi âm mới."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Cảnh báo âm thanh cho người khiếm thính", "Phát hiện tiếng chuông cửa, còi báo cháy, nồi cơm sôi… rồi rung điện thoại hoặc nháy đèn. Nghiên cứu cách giảm báo động nhầm trong nhà nhiều tiếng ồn.", "Đo kết quả", "tỉ lệ phát hiện đúng và số lần báo nhầm mỗi giờ trong môi trường thật.")],
  cur="08 · Âm thanh", next=[("11 · Đọc chữ số", "mạng nơ-ron nhiều lớp"), ("14 · Bác sĩ lá cây", "mạng tích chập nhìn ảnh"), ("15 · Ngôn ngữ ký hiệu", "chuỗi theo thời gian")],
  khkt=[("Vấn đề", "Người khiếm thính không nghe được các âm thanh cảnh báo trong nhà."), ("Câu hỏi nghiên cứu", "Một điện thoại cũ có thể nhận diện 5 âm cảnh báo trong nhà với độ chính xác bao nhiêu?"), ("Giả thuyết", "Trừ tiếng ồn nền và chuẩn hóa âm lượng giúp giảm báo nhầm ở nhà có tivi bật."), ("Lưu ý đạo đức", "Không ghi âm lời nói; xử lý trên máy; thiết kế cùng người dùng khiếm thính.")],
  prev=("07-diem-thi", "07"), nextp=("09-dem-xe", "09"),
)
