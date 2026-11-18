D = dict(
  out="du-an/38-hoc-bong/index.html", num="38", grade="9", title="Dự án 38 · Ai được nhận học bổng?",
  scripts=["data.js", "hb.js"],
  h1='Ai được nhận <span class="hl-word">học bổng</span>? Khi máy học cả sự thiên vị',
  lead="Một trường muốn dùng AI xếp hạng 80 hồ sơ xin học bổng, nên cho máy học từ 240 quyết định của hội đồng những năm trước. Nghe rất khách quan, nhưng nếu quyết định cũ đã thiên vị thì sao? Em sẽ soi xem máy học được gì, đo tỉ lệ được chọn của từng nhóm, thử đổi nơi ở của một bạn, và tìm cách làm cho máy công bằng.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="460" aria-label="Biểu đồ 80 hồ sơ: trục ngang điểm trung bình, trục dọc giờ hoạt động. Hình tròn là Phường Đông, tam giác là Xã Tây, hình tô kín là được chọn. Bấm vào một hồ sơ để kiểm tra."></canvas><div class="stage-tag"><span class="live-dot"></span>80 HỒ SƠ NĂM NAY</div></div>
      <div class="play-panel"><div class="legend-row"><span><em class="lg lg-dot"></em>Phường Đông</span><span><em class="lg lg-tri"></em>Xã Tây</span><span><em class="lg lg-fill"></em>Được chọn</span><span><em class="lg lg-miss"></em>Xứng đáng nhưng bị loại</span></div></div>
      <p class="ask" id="askText" aria-live="polite" style="margin:12px 0 0;font-size:1.02rem"></p>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>Số suất học bổng năm nay</span><b id="kV"></b><input type="range" id="k" min="10" max="40" step="2"></label>
          <p class="small" style="margin:6px 0 0">Máy chấm điểm từng hồ sơ rồi chọn những hồ sơ điểm cao nhất.</p>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="cpu"></i></span>Máy được biết gì, học từ đâu?</h2>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optZone"><span>Cho máy biết bạn ở khu nào</span></label><label class="tog"><input type="checkbox" id="optDist"><span>Cho máy biết khoảng cách đến trường</span></label><label class="tog"><input type="checkbox" id="optFix"><span>Học từ dữ liệu đã được xét lại công bằng</span></label></div>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy xét học bổng</div>
      <div class="lbl">MÁY HỌC ĐƯỢC TRỌNG SỐ</div><div id="bW" class="wbars"></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>KHỚP DỮ LIỆU ĐÃ HỌC</span><b id="bAgree">—</b></div><div class="metric"><span>BỊ ĐỔI KẾT QUẢ CHỈ VÌ NƠI Ở</span><b id="bFlip">—</b></div></div>
      <div class="lbl" style="margin-top:12px">HỒ SƠ EM ĐANG KIỂM TRA</div><div id="bCard" class="calc">Bấm vào một hồ sơ trên biểu đồ.</div>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Tần số tương đối: tỉ lệ được máy chọn và tỉ lệ xứng đáng theo năng lực, ở từng khu</b></div><canvas id="chart" width="1100" height="240"></canvas></div>''',
  play_guide="Mỗi hình là một hồ sơ. <b>Bấm vào một hồ sơ</b> để xem máy chấm thế nào, và kết quả có đổi không nếu bạn ấy sống ở khu kia.",
  lessons=["Toán 9 · Tần số, tần số tương đối", "GDCD 9 · Khách quan và công bằng", "Tin học 9 · Đạo đức và văn hóa khi dùng công nghệ"],
  mission_h2="Kiểm tra xem máy có công bằng không, và sửa khi nó thiên vị",
  mission_q="Máy chỉ học từ số liệu, vậy máy có thể thiên vị được không?",
  mission_p="Em sẽ xem máy chọn ai, đo <b>tần số tương đối</b> được chọn của học sinh Phường Đông và Xã Tây, làm phép thử <b>\"nếu bạn ấy ở khu kia thì sao?\"</b>, rồi phá máy bằng <b>dữ liệu cũ thiên vị</b>, <b>thông tin đại diện</b> và <b>độ chính xác đánh lừa</b>.",
  minutes="45 phút · 1 tiết học",
  checklist=[("click", "Kiểm tra một hồ sơ: nếu đổi nơi ở thì sao?"), ("k", "Thay đổi số suất học bổng"), ("fair", "Sửa máy sau sự cố để không bạn nào bị đổi kết quả chỉ vì nơi ở"), ("soi", "Soi tới bước Kiểm tra công bằng"), ("broke", "Làm máy thiên vị ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy xét học bổng làm việc thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng đúng cài đặt máy em đang chọn.",
  soi_guide="Máy không có ý xấu. Nó chỉ <b>bắt chước</b> dữ liệu nó được học. Cùng soi nhé!",
  cards=[
    dict(no="T1", tag="Toán 9", title="Tần số tương đối theo nhóm",
      svg='<rect x="30" y="40" width="40" height="66" class="f-violet"/><rect x="74" y="64" width="40" height="42" class="f-mint" opacity=".7"/><rect x="150" y="80" width="40" height="26" class="f-amber"/><rect x="194" y="58" width="40" height="48" class="f-mint" opacity=".7"/><text x="40" y="30" font-size="11" class="f-ink" font-weight="700">Đông 32%</text><text x="150" y="30" font-size="11" class="f-ink" font-weight="700">Tây 13%</text>',
      p="<b>Tần số tương đối</b> = số bạn được chọn ÷ số bạn trong nhóm. So tần số tương đối giữa các nhóm là cách đơn giản để phát hiện máy có thể đang thiên vị. Nhưng cần so với tỉ lệ <b>xứng đáng thật</b> của mỗi nhóm.",
      ex="Phường Đông 16 trên 50 bạn được chọn (32%), Xã Tây 4 trên 30 bạn (13%), dù năng lực hai nhóm như nhau."),
    dict(no="T2", tag="Dữ liệu", cls="amber", title="Thiên kiến từ dữ liệu cũ",
      svg='<rect x="14" y="20" width="100" height="80" rx="10" class="f-amber" opacity=".25"/><text x="24" y="44" font-size="11" class="f-ink" font-weight="700">Quyết định cũ</text><text x="24" y="66" font-size="11" class="f-coral" font-weight="700">khắt khe với</text><text x="24" y="84" font-size="11" class="f-coral" font-weight="700">Xã Tây</text><path d="M120 60h20" class="s-violet" stroke-width="3" marker-end="url(#arV)"/><rect x="146" y="20" width="100" height="80" rx="10" class="f-violet" opacity=".25"/><text x="160" y="56" font-size="11" class="f-ink" font-weight="700">Máy học</text><text x="160" y="76" font-size="11" class="f-coral" font-weight="700">y hệt</text>',
      p="Máy học bằng cách <b>bắt chước</b> quyết định trong dữ liệu. Nếu hội đồng cũ đòi học sinh Xã Tây phải giỏi hơn mới được nhận, máy sẽ học đúng điều đó. Đó là <b>thiên kiến</b> (định kiến) đi từ dữ liệu vào máy.",
      ex="Bỏ cột \"khu\" chưa đủ: khoảng cách đến trường tiết lộ gần như chắc chắn bạn ở khu nào."),
    dict(no="T3", tag="Công bằng", cls="coral", title="Kiểm tra và sửa cho công bằng",
      svg='<circle cx="70" cy="60" r="26" fill="none" class="s-violet" stroke-width="3"/><text x="56" y="66" font-size="16" class="f-ink" font-weight="800">?</text><path d="M100 60h50" class="s-violet" stroke-width="3" marker-end="url(#arV)"/><text x="160" y="52" font-size="11" class="f-ink" font-weight="700">Đổi nơi ở</text><text x="160" y="72" font-size="11" class="f-mint" font-weight="700">kết quả giữ nguyên?</text>',
      p="Ba cách kiểm tra: so <b>tần số tương đối</b> giữa các nhóm; thử <b>đổi một đặc điểm không liên quan</b> (nơi ở) xem kết quả có đổi không; đừng chỉ nhìn <b>độ chính xác</b>. Cách sửa tận gốc là <b>làm sạch dữ liệu</b>, và để <b>con người</b> xem lại quyết định.",
      ex="Nhiều nước yêu cầu hệ thống AI dùng cho tuyển dụng, xét tuyển phải được kiểm tra công bằng trước khi dùng."),
  ],
  real=[("award", "", "Tuyển dụng", "Một số hệ thống lọc hồ sơ xin việc từng bị phát hiện chấm thấp một nhóm người vì học từ quyết định tuyển cũ."),
        ("shield", "mint", "Cho vay, bảo hiểm", "Máy chấm điểm tín dụng cần được kiểm tra để không đối xử khác nhau chỉ vì nơi ở hay giới tính."),
        ("book", "amber", "Giáo dục", "Khi dùng AI hỗ trợ xét tuyển, nhà trường cần công khai tiêu chí và cho phép học sinh đề nghị xem xét lại.")],
  breaks_h2="Thử thách: hãy làm máy thiên vị!",
  breaks_guide="Máy học từ quyết định cũ, vốn khắt khe với học sinh Xã Tây. Thử ba cách để sự thiên vị lọt vào máy!",
  breaks=[
    dict(icon="map", key="zone", title="Dữ liệu cũ thiên vị", p="Cho máy biết <b>bạn ở khu nào</b> và học từ quyết định cũ.",
      why="Máy phát hiện \"ở Xã Tây thì ít được chọn\" trong dữ liệu cũ và học <b>trọng số âm</b> cho Xã Tây. 16 bạn bị đổi kết quả chỉ vì nơi ở. Tắt <b>Cho máy biết bạn ở khu nào</b>, hoặc bật <b>Học từ dữ liệu đã được xét lại công bằng</b>."),
    dict(icon="crosshair", key="proxy", title="Thông tin đại diện", p="Đã giấu khu vực, nhưng cho máy biết <b>khoảng cách đến trường</b>.",
      why="Học sinh Xã Tây ở xa trường, nên khoảng cách \"tố\" nơi ở. Máy học trọng số âm cho khoảng cách và thiên vị y như cũ. Tắt <b>khoảng cách đến trường</b>, hoặc học từ <b>dữ liệu đã xét lại</b>."),
    dict(icon="target", key="acc", title="Chính xác mà bất công", p="Cho máy biết cả khu vực và khoảng cách. Độ <b>khớp với quyết định cũ</b> tăng lên!",
      why="Máy khớp quyết định cũ tốt hơn chính là vì nó <b>bắt chước giỏi hơn</b> cả sự thiên vị. Chính xác so với dữ liệu sai không có nghĩa là đúng. Bật <b>Học từ dữ liệu đã được xét lại công bằng</b>: trọng số của nơi ở về gần 0."),
  ],
  badge="Người Gác Công Bằng", badge_p="Em đã mở khóa 3 thẻ kiến thức: Tần số tương đối theo nhóm · Thiên kiến từ dữ liệu cũ · Kiểm tra và sửa cho công bằng.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Bộ tiêu chí công bằng", "Viết 5 tiêu chí xét học bổng của lớp em. Với mỗi tiêu chí, tự hỏi: nó có vô tình bất lợi cho nhóm bạn nào không (nhà xa, không có máy tính…)?"),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Kiểm tra bảng số liệu", "Dùng bảng tính với số liệu tự tạo (không dùng thông tin thật của bạn bè): tính tần số tương đối theo nhóm, vẽ biểu đồ, viết nhận xét về công bằng."),
       (3, "Ý TƯỞNG KHKT", "Bộ công cụ kiểm tra thiên kiến", "Xây công cụ đơn giản nhập bảng quyết định, tự tính tỉ lệ theo nhóm và phép thử đổi đặc điểm, giúp thầy cô kiểm tra trước khi dùng AI.")],
  res=[("layers", "", "Phiếu học tập", "Tính tần số tương đối, phép thử đổi nơi ở, viết tiêu chí công bằng.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 17", "Máy học cả định kiến ẩn trong ngôn ngữ.", "../17-cam-xuc/index.html")],
  prev=("37-may-dich", "37"), nextp=("39-anh-that", "39"),
)
