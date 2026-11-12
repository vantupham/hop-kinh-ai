D = dict(
  out="du-an/18-me-cung/index.html", num="18", level="4", title="Dự án 18 · Robot thoát mê cung",
  scripts=["rl.js"],
  h1='Robot <span class="hl-word">thoát mê cung</span>',
  lead="Không ai chỉ đường cho chú robot này. Nó chỉ biết mình đang đứng ở ô nào, được thưởng khi tới đích và bị phạt khi rơi bẫy. Ban đầu nó đi lung tung, nhưng sau vài trăm lượt, em sẽ thấy \"giá trị\" của đích lan dần khắp mê cung như một tấm bản đồ nhiệt, và robot tìm ra đường.",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Mê cung với bản đồ giá trị và robot"></canvas><div class="stage-tag"><span class="live-dot"></span><span>HỌC TĂNG CƯỜNG</span></div></div>
      <div class="toolbar">
        <div class="seg"><button class="btn small" id="btnRun"></button><button class="btn small ghost" id="btnStep"><i data-i="skip"></i>1 bước</button><button class="btn small ghost" id="btnFast"><i data-i="bolt"></i>Học nhanh 200 lượt</button></div>
        <div class="seg"><button class="btn small ghost" id="btnPath"><i data-i="arrowR"></i>Đường đi tốt nhất</button><button class="btn small ghost" id="btnFour"><i data-i="blocks"></i>4 giá trị Q</button></div>
      </div>
      <div class="game"><span class="small muted">Vẽ lên mê cung</span><div class="btn-row" id="toolBtns"><button class="btn small" data-t="#">Tường</button><button class="btn small ghost" data-t="X">Bẫy</button><button class="btn small ghost" data-t="$">Xu</button><button class="btn small ghost" data-t="G">Đích</button><button class="btn small ghost" data-t=".">Xóa</button><button class="btn small ghost" data-t="S">Chỗ xuất phát</button></div></div>
      <div class="game"><span class="small muted">Mê cung</span><div class="btn-row" id="mapBtns"><button class="btn small ghost" data-m="mau">Mê cung mẫu</button><button class="btn small ghost" data-m="trong">Sân trống</button><button class="btn small ghost" id="btnReset"><i data-i="reset"></i>Xóa trí nhớ robot</button></div></div>
      <p class="small muted" style="margin:8px 0 0"><i data-i="bulb"></i> Màu ô: vàng sáng là ô có giá trị cao (gần đích), tím là ô nguy hiểm. Mũi tên là hướng robot cho là tốt nhất.</p>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="metric-row"><div class="metric"><span>LƯỢT CHƠI</span><b id="bEp">0</b></div><div class="metric"><span>BƯỚC TRONG LƯỢT</span><b id="bStep">0</b></div></div>
      <div class="metric-row"><div class="metric"><span>SỐ LẦN TỚI ĐÍCH</span><b id="bWin">0</b></div><div class="metric"><span>TỚI ĐÍCH / 20 LƯỢT GẦN NHẤT</span><b id="bRate">—</b></div></div>
      <div class="lbl" style="margin-top:12px">NƯỚC ĐI VỪA RỒI</div><div id="bAct" style="color:#fff"></div>
      <div class="lbl" style="margin-top:12px">BẢNG Q CỦA Ô ĐANG ĐỨNG</div><div class="bars" id="bQ"></div>
    </aside>
  </div>''',
  mission_h2="Dạy robot bằng phần thưởng thay vì đáp án",
  mission_q="Không có bản đồ, không có người chỉ đường. Robot học bằng cách nào?",
  mission_p="Em sẽ thấy robot <b>thử và sai</b>, nhận <b>phần thưởng</b>, ghi kinh nghiệm vào <b>bảng Q</b>, cân bằng giữa <b>khám phá</b> và <b>khai thác</b>, rồi tự vẽ mê cung để thử thách nó. Cuối cùng là bài học quan trọng nhất: thưởng sai thì robot học sai.",
  minutes="45–60 phút",
  checklist=[("win", "Xem robot tới đích ít nhất 3 lần"), ("fast", "Cho robot học nhanh 200 lượt"), ("path", "Bật Đường đi tốt nhất"), ("soi", "Soi tới bước Cập nhật bảng Q"), ("edit", "Tự vẽ thêm tường, bẫy hoặc xu"), ("broke", "Làm robot học hỏng ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Một bước học của robot: 6 bước",
  soi_p="Hình bên dưới dùng đúng bước vừa diễn ra ở phần Mồi. Tạm dừng rồi bấm \"1 bước\" để xem chậm.",
  theory=[
    dict(no="69", tag="Học máy", title="Học tăng cường",
      svg='<rect x="20" y="40" width="70" height="44" rx="10" class="f-violet"/><text x="34" y="67" font-size="12" fill="#fff">Robot</text><rect x="170" y="40" width="74" height="44" rx="10" class="f-soft"/><text x="178" y="67" font-size="12" class="f-ink">Mê cung</text><path d="M92 52h74" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><path d="M168 74H96" class="s-coral" stroke-width="2.5" marker-end="url(#arC)"/><text x="106" y="44" font-size="10" class="t-mono f-violet">hành động</text><text x="100" y="98" font-size="10" class="t-mono f-coral">thưởng, ô mới</text>',
      p="Trong <b>học tăng cường</b>, không ai đưa đáp án. Robot (tác tử) <b>hành động</b>, môi trường trả lại <b>phần thưởng</b> và trạng thái mới. Mục tiêu: tìm cách hành động để tổng phần thưởng lớn nhất.",
      deep="Đây là cách AI học chơi cờ vây, điều khiển robot đi bộ, và một phần cách huấn luyện chatbot (học từ đánh giá của con người)."),
    dict(no="70", tag="Thuật toán", cls="amber", title="Bảng Q",
      svg='<g class="s-line" stroke-width="1"><rect x="80" y="20" width="90" height="90" fill="none"/><path d="M80 20l90 90M170 20l-90 90"/></g><g font-size="12" class="t-mono"><text x="114" y="44" class="f-mint">2.1</text><text x="140" y="70" class="f-mint">6.4</text><text x="114" y="98" class="f-coral">-3</text><text x="86" y="70" class="f-ink">0.5</text></g><text x="20" y="124" font-size="10" class="t-mono f-muted">4 giá trị cho 4 hướng của một ô</text>',
      p="Mỗi ô có 4 con số <b>Q</b>, một cho mỗi hướng: \"nếu ở đây mà đi hướng này thì sau cùng được bao nhiêu điểm?\". Sau mỗi bước, robot sửa con số của nước vừa đi theo những gì vừa xảy ra.",
      deep="Công thức cập nhật dùng <b>α</b> (tốc độ học) và <b>γ</b> (mức coi trọng tương lai). Khi trò chơi quá lớn để có bảng, người ta thay bảng bằng mạng nơ-ron: đó là <b>Deep Q-Network</b>."),
    dict(no="71", tag="Chiến lược", cls="coral", title="Khám phá & khai thác",
      svg='<circle cx="70" cy="64" r="34" class="f-soft"/><path d="M70 64 70 30A34 34 0 0 1 99 81Z" class="f-coral"/><text x="80" y="54" font-size="10" fill="#fff">ε</text><text x="120" y="50" font-size="12" class="f-coral">khám phá: thử hướng lạ</text><text x="120" y="80" font-size="12" class="f-violet">khai thác: đi hướng tốt nhất</text>',
      p="Chỉ đi đường quen thì không bao giờ tìm được đường tốt hơn; chỉ thử lung tung thì không tận dụng được kinh nghiệm. Với xác suất <b>ε</b>, robot thử ngẫu nhiên, còn lại nó đi theo bảng Q.",
      deep="Con người cũng gặp thế cân bằng này hằng ngày: gọi món quen hay món mới, đi đường quen hay thử đường khác."),
    dict(no="72", tag="Đạo đức", cls="mint", title="Thưởng sai, học sai",
      svg='<circle cx="60" cy="64" r="16" fill="#ffd84d"/><path d="M90 50c20-20 40-20 60 0M150 78c-20 20-40 20-60 0" fill="none" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><path d="M216 50l8 18 18 2-14 12 4 18-16-10-16 10 4-18-14-12 18-2z" class="f-amber" opacity=".35"/><text x="170" y="120" font-size="10" class="t-mono f-coral">đích bị bỏ quên</text>',
      p="Robot làm đúng điều <b>được thưởng</b>, chưa chắc là điều <b>ta muốn</b>. Nếu nhặt xu được điểm mãi, nó sẽ nhặt xu mãi thay vì về đích. Đây gọi là <b>lách luật phần thưởng</b>.",
      deep="Đã có AI chơi game đua thuyền chạy vòng tròn mãi để ăn điểm thưởng thay vì về đích. Với AI mạnh hơn, đặt đúng mục tiêu là vấn đề an toàn rất quan trọng."),
  ],
  tulam_h2="Bàn thí nghiệm: chỉnh cách học và luật thưởng",
  tulam_p="Mọi thay đổi có hiệu lực ngay với robot ở phần Mồi. Biểu đồ: mỗi chấm là tổng điểm một lượt (xanh: tới đích, cam: không), đường tím là trung bình 10 lượt gần nhất.",
  tulam='''
  <div class="card chart-card"><div class="chart-head"><b><i data-i="chart"></i> Tổng phần thưởng mỗi lượt</b><span class="legend"><i class="lg" style="background:var(--mint)"></i>tới đích <i class="lg" style="background:var(--coral)"></i>không tới <i class="lg" style="background:var(--violet)"></i>trung bình</span></div><canvas id="chart" width="1100" height="220"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Cách học</h3>
      <label class="ctl"><span>α · tốc độ học</span><b id="alphaV"></b><input type="range" id="alpha" min="0.05" max="1" step="0.05"></label>
      <label class="ctl"><span>γ · coi trọng tương lai</span><b id="gammaV"></b><input type="range" id="gamma" min="0" max="0.99" step="0.01"></label>
      <label class="ctl"><span>ε · tỉ lệ khám phá</span><b id="epsV"></b><input type="range" id="eps" min="0" max="1" step="0.05"></label>
      <label class="ctl"><span>Tốc độ chạy</span><b id="speedV"></b><input type="range" id="speed" min="1" max="60" step="1"></label>
    </div>
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm amber"><i data-i="award"></i></span>Luật thưởng</h3>
      <p class="small muted">Tới đích: <b>+10</b> · Rơi bẫy: <b>−10</b></p>
      <label class="ctl"><span>Mỗi bước đi</span><b id="rStepV"></b><input type="range" id="rStep" min="-1" max="0" step="0.1"></label>
      <label class="ctl"><span>Nhặt một đồng xu</span><b id="rCoinV"></b><input type="range" id="rCoin" min="0" max="5" step="0.5"></label>
      <label class="tog" style="display:block;margin:8px 0"><input type="checkbox" id="coinRespawn"><span>Xu mọc lại ngay sau khi nhặt</span></label>
      <h3 class="h-ic" style="margin-top:14px"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật</h3><pre class="code" id="genCode"></pre>
    </div>
  </div>''',
  breaks_h2="Thử thách: hãy làm robot học hỏng!",
  breaks=[
    dict(icon="lock", key="noexp", title="Không dám thử", p="Robot có trí nhớ trắng tinh, <b>ε = 0</b> (không bao giờ khám phá), và đi thêm bước cũng không bị trừ điểm.",
      why="Mọi hướng đều có Q bằng 0, robot luôn chọn hướng đầu tiên là \"lên\", đụng tường, không mất gì, nên chọn lại đúng hướng đó mãi mãi. Nó không bao giờ biết đích tồn tại (biểu đồ toàn chấm cam). Sửa bằng hai việc: tăng ε lên 0,2 và đặt lại phạt mỗi bước −0,1. Phạt mỗi bước khiến hướng đã thử mất điểm, nên robot tự chuyển sang thử hướng khác. Chỉ tăng ε thôi thì robot đi lang thang rất lâu mới tình cờ gặp đích."),
    dict(icon="eye", key="myopic", title="Cận thị", p="<b>γ = 0</b>: robot chỉ quan tâm phần thưởng ngay ở bước tiếp theo.",
      why="Giá trị của đích không lan ngược ra xa được: chỉ những ô sát đích mới sáng, còn lại tối đen, nên robot ở xa không biết đi đâu. Tăng γ lên khoảng 0,9 và xem bản đồ nhiệt lan ra."),
    dict(icon="award", key="coin", title="Ham xu", p="Có một <b>đồng xu +2 mọc lại mãi</b> ngay gần chỗ xuất phát.",
      why="Bước qua bước lại để nhặt xu được nhiều điểm hơn đi một quãng xa về đích, nên robot học cách \"cày xu\" mãi mãi (bật Đường đi tốt nhất để thấy). Robot không sai: nó làm đúng điều ta thưởng. Tắt <b>Xu mọc lại</b> hoặc giảm thưởng xu, rồi Xóa trí nhớ robot."),
  ],
  real_h2="Học tăng cường đang được dùng ở đâu?",
  real=[("gamepad", "", "Trò chơi", "AI tự học chơi cờ vây, cờ vua và trò chơi điện tử tới mức vượt nhà vô địch, chỉ từ luật chơi và điểm số."),
        ("robot", "mint", "Robot", "Robot học đi, cầm nắm đồ vật trong mô phỏng trước khi chạy ngoài đời thật."),
        ("bolt", "amber", "Tiết kiệm năng lượng", "Điều khiển làm mát trung tâm dữ liệu, đèn giao thông thông minh tự điều chỉnh theo lưu lượng xe.")],
  ethics=["Một ứng dụng mạng xã hội được \"thưởng\" khi em xem lâu hơn. Nó có thể học những cách nào để giữ chân em? Điều đó có tốt cho em không?",
          "Vì sao robot trong thế giới thật nên học trong mô phỏng trước? Học bằng thử và sai ngoài đời có thể gây nguy hiểm gì?",
          "Khi đặt mục tiêu cho một AI mạnh, làm sao chắc rằng nó không \"lách luật\" như robot ham xu?"],
  badge="Huấn Luyện Viên Robot", badge_p="Em đã mở khóa 4 thẻ kiến thức: Học tăng cường · Bảng Q · Khám phá & khai thác · Thưởng sai, học sai.",
  dev_h2="Từ robot mê cung đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Mê cung có cửa và chìa khóa", "Thêm ô chìa khóa: robot phải lấy chìa trước khi qua cửa. Trạng thái giờ gồm cả vị trí và \"đã có chìa chưa\".", "Xong khi", "robot học được thứ tự lấy chìa rồi mới về đích."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "AI chơi trò chim vỗ cánh", "Tự viết trò chơi né ống nước đơn giản, chia khoảng cách tới ống thành vài ô, dùng bảng Q để AI học khi nào vỗ cánh.", "Xong khi", "AI vượt được 50 ống liên tiếp."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Đèn giao thông tự học ở ngã tư gần trường", "Mô phỏng ngã tư với lưu lượng xe đo thực tế giờ tan học, dùng học tăng cường để điều khiển đèn, so sánh với đèn chu kỳ cố định.", "Đo kết quả", "thời gian chờ trung bình, độ dài hàng xe, và kiểm tra AI có \"bỏ đói\" một hướng không.")],
  cur="18 · Mê cung", next=[("19 · Xe tự lái tiến hóa", "học bằng tiến hóa thay vì phần thưởng từng bước"), ("7 · Dự đoán điểm thi", "tốc độ học α"), ("20 · Trợ lý hỏi đáp SGK", "AI có trách nhiệm")],
  khkt=[("Vấn đề", "Ùn tắc ở ngã tư gần trường giờ tan học, đèn chu kỳ cố định không linh hoạt."), ("Câu hỏi nghiên cứu", "Đèn điều khiển bằng học tăng cường có giảm thời gian chờ trong mô phỏng không?"), ("Giả thuyết", "Giảm ít nhất 15% thời gian chờ trung bình so với chu kỳ cố định."), ("Lưu ý đạo đức", "Chỉ thử trong mô phỏng; ưu tiên an toàn người đi bộ hơn tốc độ xe.")],
  prev=("17-cam-xuc", "17"), nextp=("19-xe-tu-lai", "19"),
)
