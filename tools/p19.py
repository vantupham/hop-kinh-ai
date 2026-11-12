D = dict(
  out="du-an/19-xe-tu-lai/index.html", num="19", level="4", title="Dự án 19 · Xe tự lái tiến hóa",
  scripts=["evo.js"],
  h1='Xe tự lái <span class="hl-word">tiến hóa</span>',
  lead="Bốn mươi chiếc xe đồ chơi, mỗi chiếc có một bộ não ngẫu nhiên. Thế hệ đầu, gần như chiếc nào cũng đâm vào lề. Nhưng những chiếc đi xa nhất được làm bố mẹ, và con của chúng thừa hưởng bộ não ấy, kèm vài thay đổi nhỏ. Sau vài chục thế hệ, cả đàn chạy vòng quanh đường đua mà không ai dạy chúng cách lái.",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Đường đua với đàn xe đang tiến hóa"></canvas><div class="stage-tag"><span class="live-dot"></span><span>TIẾN HÓA</span></div><div class="stage-msg" id="stageMsg" hidden></div></div>
      <div class="toolbar">
        <div class="seg"><button class="btn small" id="btnRun"></button><button class="btn small ghost" id="btnNext"><i data-i="skip"></i>Sang thế hệ sau</button><button class="btn small ghost" id="btnFast"><i data-i="bolt"></i>Tiến hóa nhanh 10 thế hệ</button></div>
      </div>
      <div class="game"><span class="small muted">Đường đua</span><div class="btn-row" id="trackBtns"><button class="btn small ghost" data-k="0">Dễ</button><button class="btn small ghost" data-k="1">Vừa</button><button class="btn small ghost" data-k="2">Đèo khó</button><button class="btn small" id="btnDraw"><i data-i="sparkle"></i>Tự vẽ đường đua</button><button class="btn small ghost" id="btnResetEvo"><i data-i="reset"></i>Bắt đầu lại</button></div></div>
      <p class="small muted" style="margin:8px 0 0"><i data-i="bulb"></i> Xe vàng là xe đang dẫn đầu, kèm 5 tia cảm biến. Xe mờ là xe đã đâm.</p>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não xe dẫn đầu</div>
      <canvas id="net" width="300" height="200" style="width:100%;height:auto"></canvas>
      <div class="metric-row" style="margin-top:8px"><div class="metric"><span>THẾ HỆ</span><b id="bGen">1</b></div><div class="metric"><span>XE CÒN CHẠY</span><b id="bAlive">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>XE GIỎI NHẤT THẾ HỆ TRƯỚC</span><b id="bBest">—</b></div><div class="metric"><span>XE DẪN ĐẦU BÂY GIỜ</span><b id="bNow">—</b></div></div>
    </aside>
  </div>''',
  mission_h2="Để chọn lọc tự nhiên dạy xe tự lái",
  mission_q="Không có đáp án, không có lan truyền ngược. Làm sao bộ não ngẫu nhiên lại biết lái?",
  mission_p="Em sẽ xem xe nhìn đường bằng <b>tia cảm biến</b>, ra quyết định bằng một <b>mạng nơ-ron</b> nhỏ, rồi cả đàn tiến hóa qua <b>chọn lọc</b>, <b>lai ghép</b> và <b>đột biến</b>. Em còn tự vẽ đường đua để thử thách đàn xe.",
  minutes="45–60 phút",
  checklist=[("gen5", "Xem đàn xe qua ít nhất 5 thế hệ"), ("lap", "Có một xe chạy hết 1 vòng"), ("soi", "Soi tới bước Lai & đột biến"), ("draw", "Tự vẽ một đường đua"), ("fast", "Tiến hóa nhanh 10 thế hệ"), ("broke", "Làm cho đàn xe tiến hóa hỏng ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Một thế hệ tiến hóa: 6 bước",
  soi_p="Hình bên dưới dùng đúng đàn xe đang chạy ở phần Mồi.",
  theory=[
    dict(no="73", tag="Thuật toán", title="Thuật toán di truyền",
      svg='<g><circle cx="40" cy="40" r="10" class="f-mint"/><circle cx="40" cy="80" r="10" class="f-mint"/><circle cx="40" cy="120" r="10" class="f-soft"/></g><path d="M56 60h40" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><g><circle cx="120" cy="40" r="10" class="f-mint"/><circle cx="120" cy="80" r="10" class="f-mint"/><circle cx="120" cy="120" r="10" class="f-amber"/></g><path d="M136 60h40" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><g><circle cx="200" cy="40" r="10" class="f-mint"/><circle cx="200" cy="80" r="10" class="f-amber"/><circle cx="200" cy="120" r="10" class="f-mint"/></g>',
      p="Bắt chước tiến hóa trong tự nhiên: tạo nhiều lời giải ngẫu nhiên, <b>chấm điểm</b>, giữ lại cái tốt, <b>lai ghép</b> và <b>đột biến</b> để tạo thế hệ mới. Lặp lại, lời giải tốt dần lên.",
      deep="Thuật toán di truyền được dùng để thiết kế ăng-ten vệ tinh, xếp thời khóa biểu, tối ưu hình dạng cánh máy bay: những bài toán khó viết công thức nhưng dễ chấm điểm."),
    dict(no="74", tag="Cảm biến", cls="amber", title="Cảm biến tia",
      svg='<rect x="100" y="70" width="34" height="18" rx="4" class="f-amber"/><g class="s-mint" stroke-width="2"><path d="M134 79 230 79M134 79 216 40M134 79 216 118M134 79 170 24M134 79 170 134"/></g><path d="M20 20h220M20 140h220" class="s-line" stroke-width="3"/>',
      p="Xe không \"nhìn\" ảnh như Dự án 9 mà dùng 5 <b>tia</b> đo khoảng cách tới mép đường, giống cảm biến siêu âm, lidar trên xe thật. 5 con số này là tất cả những gì bộ não của xe biết.",
      deep="Xe tự lái thật kết hợp camera, radar và lidar (tia laser quét hàng trăm nghìn điểm mỗi giây) rồi ghép lại thành bản đồ 3D xung quanh xe."),
    dict(no="75", tag="Học máy", cls="coral", title="Độ thích nghi",
      svg='<path d="M20 110C70 110 80 30 130 30S200 90 240 60" fill="none" class="s-violet" stroke-width="3"/><circle cx="130" cy="30" r="7" class="f-mint"/><text x="140" y="26" font-size="10" class="t-mono f-mint">tốt nhất</text><text x="20" y="128" font-size="10" class="t-mono f-muted">điểm thích nghi qua các lời giải</text>',
      p="<b>Độ thích nghi</b> là cách chấm điểm mỗi cá thể: ở đây là quãng đường đi được. Tiến hóa sẽ tối ưu đúng con số đó, nên chọn cách chấm điểm là việc quan trọng nhất.",
      deep="Chọn sai độ thích nghi, như \"sống càng lâu càng tốt\", thì tiến hóa tìm ra mẹo không mong muốn: quay vòng tại chỗ. Giống robot ham xu ở Dự án 18."),
    dict(no="76", tag="So sánh", cls="mint", title="Ba cách học",
      svg='<g font-size="11" class="f-ink"><rect x="10" y="20" width="76" height="90" rx="8" class="f-soft"/><text x="18" y="44">Có giám</text><text x="18" y="60">sát</text><text x="18" y="90" class="f-muted">đáp án</text><rect x="92" y="20" width="76" height="90" rx="8" class="f-soft"/><text x="100" y="44">Tăng</text><text x="100" y="60">cường</text><text x="100" y="90" class="f-muted">thưởng</text><rect x="174" y="20" width="76" height="90" rx="8" class="f-soft"/><text x="182" y="44">Tiến</text><text x="182" y="60">hóa</text><text x="182" y="90" class="f-muted">chọn lọc</text></g>',
      p="Học có giám sát cần <b>đáp án</b> cho từng ví dụ. Học tăng cường cần <b>phần thưởng</b> sau từng hành động. Tiến hóa chỉ cần <b>một điểm số</b> cho cả lần chạy, nhưng tốn rất nhiều lần thử.",
      deep="Trong thực tế, các phương pháp thường được kết hợp. Ví dụ dùng tiến hóa để tìm kiến trúc mạng nơ-ron tốt, rồi dùng lan truyền ngược để huấn luyện mạng đó."),
  ],
  tulam_h2="Bàn thí nghiệm: điều khiển quá trình tiến hóa",
  tulam_p="Thay đổi có hiệu lực từ thế hệ sau. Biểu đồ: đường xanh là xe giỏi nhất, đường tím là trung bình cả đàn qua từng thế hệ.",
  tulam='''
  <div class="card chart-card"><div class="chart-head"><b><i data-i="chart"></i> Độ thích nghi qua các thế hệ</b><span class="legend"><i class="lg" style="background:var(--mint)"></i>giỏi nhất <i class="lg" style="background:var(--violet)"></i>trung bình</span></div><canvas id="chart" width="1100" height="220"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Tiến hóa</h3>
      <label class="ctl"><span>Tỉ lệ đột biến (mỗi gen)</span><b id="rateV"></b><input type="range" id="rate" min="0" max="1" step="0.01"></label>
      <label class="ctl"><span>Độ lớn đột biến</span><b id="strengthV"></b><input type="range" id="strength" min="0.1" max="3" step="0.1"></label>
      <label class="ctl"><span>Số xe mỗi thế hệ</span><b id="popV"></b><input type="range" id="pop" min="6" max="80" step="2"></label>
      <label class="ctl"><span>Tốc độ mô phỏng</span><b id="spfV"></b><input type="range" id="spf" min="1" max="12" step="1"></label>
      <div class="lbl muted small" style="margin:8px 0 4px">CHẤM ĐIỂM XE THEO</div>
      <div class="btn-row" id="fitBtns"><button class="btn small ghost" data-f="dist">Quãng đường đi được</button><button class="btn small ghost" data-f="alive">Thời gian sống sót</button></div>
    </div>
    <div class="card"><h3 class="h-ic"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của một thế hệ</h3><pre class="code" id="genCode"></pre></div>
  </div>''',
  breaks_h2="Thử thách: hãy làm cho tiến hóa thất bại!",
  breaks=[
    dict(icon="lock", key="nomut", title="Không đột biến", p="Tỉ lệ đột biến <b>0%</b>, đàn chỉ có <b>12 xe</b>.",
      why="Chỉ lai ghép những gen sẵn có, sau vài thế hệ cả đàn giống hệt nhau và đường xanh trên biểu đồ nằm ngang. Không có gì mới thì chọn lọc không còn gì để chọn. Tăng đột biến lên khoảng 10% và số xe lên 40."),
    dict(icon="bolt", key="chaos", title="Đột biến hỗn loạn", p="Mọi gen đều đột biến (<b>100%</b>) với độ lớn rất lớn.",
      why="Con cái gần như ngẫu nhiên hoàn toàn, mất hết những gì bố mẹ đã tìm được. Chỉ 2 xe được giữ nguyên còn chạy tốt; xe giỏi nhất thỉnh thoảng nhích lên nhờ may mắn, còn đường trung bình (tím) gần như nằm sát đáy. Cần cân bằng: giữ phần lớn gen của bố mẹ, chỉ thay đổi một ít."),
    dict(icon="clock", key="alive", title="Chấm sai điểm", p="Xe được chấm điểm theo <b>thời gian sống sót</b> thay vì quãng đường.",
      why="Cách sống lâu nhất là… không đi đâu cả: các xe tiến hóa thành quay vòng tròn tại chỗ. Chúng không sai, chúng tối ưu đúng con số ta chấm. Đổi lại thành <b>Quãng đường đi được</b>."),
  ],
  real_h2="Tiến hóa và mô phỏng đang được dùng ở đâu?",
  real=[("globe", "", "Thiết kế kỹ thuật", "Ăng-ten vệ tinh, khung xe đạp, kết cấu cầu được \"tiến hóa\" trong máy tính để nhẹ mà vẫn chắc."),
        ("robot", "mint", "Xe tự lái thật", "Xe tự lái được thử hàng triệu kilômét trong mô phỏng trước khi chạy trên đường, kể cả những tình huống hiếm gặp."),
        ("activity", "amber", "Sinh học", "Các nhà khoa học dùng mô phỏng tiến hóa để hiểu cách vi khuẩn kháng thuốc kháng sinh.")],
  ethics=["Xe tự lái gây tai nạn. Ai chịu trách nhiệm: hãng xe, người lập trình, hay người ngồi trong xe?",
          "Xe chỉ được thử trong mô phỏng. Những tình huống nào ngoài đời (trời mưa, trẻ em chạy ra đường…) có thể bị bỏ sót?",
          "Tiến hóa tìm ra lời giải mà con người khó hiểu nổi. Có nên dùng lời giải đó cho việc quan trọng như lái xe không?"],
  badge="Nhà Lai Tạo Xe", badge_p="Em đã mở khóa 4 thẻ kiến thức: Thuật toán di truyền · Cảm biến tia · Độ thích nghi · Ba cách học.",
  dev_h2="Từ xe tự lái tiến hóa đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Thêm vật cản", "Đặt vài khối vật cản trên đường đua và thêm 2 tia cảm biến. Quan sát đàn xe tiến hóa cách né.", "Xong khi", "xe giỏi nhất chạy hết 1 vòng không đâm vật cản."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Sinh vật tiến hóa", "Tạo các sinh vật 2D có \"gen\" là kích thước, tốc độ, tầm nhìn; chúng tìm thức ăn và sinh sản. Xem loài nào thắng khi thức ăn khan hiếm.", "Xong khi", "có biểu đồ đặc điểm trung bình của quần thể qua 50 thế hệ."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Xe robot thật học bám vạch", "Lắp xe robot (micro:bit hoặc Arduino) với 3–5 cảm biến khoảng cách, tiến hóa bộ não trong mô phỏng rồi nạp vào xe thật chạy trên đường đua giấy.", "Đo kết quả", "khoảng cách giữa kết quả mô phỏng và ngoài đời, và cách thu hẹp khoảng cách đó.")],
  cur="19 · Xe tự lái", next=[("20 · Trợ lý hỏi đáp SGK", "AI dựa trên tài liệu"), ("18 · Robot mê cung", "học bằng phần thưởng"), ("11 · Chữ số", "mạng nơ-ron học bằng lan truyền ngược")],
  khkt=[("Vấn đề", "Huấn luyện robot ngoài đời tốn thời gian và dễ hỏng robot."), ("Câu hỏi nghiên cứu", "Bộ não tiến hóa trong mô phỏng có điều khiển tốt xe robot thật không?"), ("Giả thuyết", "Thêm nhiễu cảm biến khi mô phỏng giúp bộ não chạy tốt hơn ngoài đời."), ("Lưu ý đạo đức", "Chạy thử ở khu vực an toàn, có người giám sát, xe tốc độ thấp.")],
  prev=("18-me-cung", "18"), nextp=("20-hoi-dap", "20"),
)
