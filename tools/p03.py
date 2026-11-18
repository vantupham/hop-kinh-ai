D = dict(
  out="du-an/03-xuc-xac/index.html", num="3", grade="6", title="Dự án 3 · Xúc xắc bị gian lận",
  scripts=["dice.js"],
  h1='Thám tử tìm <span class="hl-word">xúc xắc gian lận</span>',
  lead="Trong ba viên xúc xắc có một viên bị làm lệch, ra mặt 6 nhiều hơn bình thường. Nhìn bề ngoài không ai phân biệt được. Em và thám tử máy chỉ có một cách: tung thật nhiều lần, ghi lại, đếm, rồi so với điều ta mong đợi. Đây cũng là cách AI học quy luật từ dữ liệu.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Ba viên xúc xắc và bảng đếm số lần ra từng mặt"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">BA VIÊN XÚC XẮC</span></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn accent" id="roll1"><i data-i="play"></i>Tung 1 lần</button><button class="btn" id="roll10"><i data-i="skip"></i>Tung 10 lần</button><button class="btn" id="roll100"><i data-i="bolt"></i>Tung 100 lần</button><button class="btn ghost" id="btnNew"><i data-i="reset"></i>Bộ xúc xắc mới</button></div>
        <div class="btn-row" style="margin-top:10px" id="guessRow"><span class="small" style="align-self:center">Em nghĩ viên nào gian lận?</span><button class="btn small ghost" data-g="0">Xúc xắc A</button><button class="btn small ghost" data-g="1">Xúc xắc B</button><button class="btn small ghost" data-g="2">Xúc xắc C</button></div></div>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Bàn thí nghiệm của thám tử</h2>
          <label class="ctl"><span>Số lần tung tối thiểu trước khi kết luận</span><b id="minNV"></b><input type="range" id="minN" min="0" max="100" step="5"></label>
          <label class="ctl"><span>Độ lệch phải lớn hơn (độ khắt khe)</span><b id="thrV"></b><input type="range" id="thr" min="3" max="25" step="1"></label>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optWin"><span>Chỉ xét 120 lần tung gần nhất</span></label></div>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm coral"><i data-i="wrench"></i></span>Xưởng làm xúc xắc</h2>
          <label class="ctl"><span>Viên gian lận ra mặt 6 với tỉ lệ</span><b id="pV"></b><input type="range" id="p" min="0.17" max="0.6" step="0.01"></label>
          <p class="small muted" style="margin:6px 0 0">Xúc xắc công bằng: mỗi mặt ra khoảng <b>1 lần trong 6 lần</b> (khoảng 17%). Kéo thanh về 17% thì viên gian lận trở thành công bằng, thám tử sẽ không thể tìm ra nó nữa.</p>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Thám tử máy</div>
      <div class="metric-row"><div class="metric"><span>SỐ LẦN TUNG MỖI VIÊN</span><b id="bN">0</b></div><div class="metric"><span>KẾT LUẬN</span><b id="bVerdict" style="font-size:.95rem">—</b></div></div>
      <div class="lbl" style="margin-top:12px">ĐỘ LỆCH SO VỚI XÚC XẮC CÔNG BẰNG</div><div class="conf" id="bDev"></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>MÁY ĐOÁN TRƯỚC MẶT SẮP RA</span><b id="bPred">—</b></div><div class="metric"><span>ĐOÁN BỪA</span><b>17%</b></div></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Thám tử không nhìn được bên trong xúc xắc. Nó chỉ <b style="color:#5ef2d6">đếm</b> và so với điều mong đợi: mỗi mặt khoảng 1/6. Viên nào lệch nhiều nhất, và lệch đủ lớn, là viên bị nghi.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Tỉ lệ ra mặt 6 của mỗi viên khi tung càng nhiều lần</b></div><canvas id="chart" width="1100" height="250"></canvas></div>''',
  play_guide="Mỗi viên xúc xắc có 6 mặt. Tung vài lần thì chưa thấy gì đâu. Hãy tung thật nhiều rồi nhìn bảng đếm!",
  lessons=["Toán 6 · Xác suất thực nghiệm", "Toán 6 · Biểu đồ cột, bảng thống kê", "Tin học 6 · Thông tin và dữ liệu"],
  mission_h2="Dùng dữ liệu để tìm ra điều mắt thường không thấy",
  mission_q="Ba viên xúc xắc trông y hệt nhau. Làm sao biết viên nào gian lận?",
  mission_p="Em sẽ <b>tung và ghi lại</b> kết quả, tính <b>xác suất thực nghiệm</b>, so sánh với xúc xắc công bằng, và xem <b>thám tử máy</b> kết luận như thế nào. Em cũng sẽ thấy khi nào dữ liệu làm máy kết luận sai.",
  minutes="45 phút · 1 tiết học",
  checklist=[("roll", "Tung mỗi viên ít nhất 100 lần"), ("guess", "Đoán đúng viên xúc xắc gian lận"), ("detect", "Xem thám tử máy tìm ra viên gian lận"), ("soi", "Soi tới bước So với điều mong đợi"), ("broke", "Làm thám tử kết luận sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Thám tử máy suy luận như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Số liệu là số liệu thật em vừa tung.",
  soi_guide="Thám tử máy không đoán mò. Nó làm đúng như em học ở môn Toán: <b>ghi, đếm, chia</b>, rồi so sánh!",
  cards=[
    dict(no="T1", tag="Dữ liệu", title="Ghi lại và đếm tần số",
      svg='<g font-size="13" class="t-mono"><text x="16" y="30" class="f-ink">3 6 1 6 2</text><text x="16" y="52" class="f-ink">6 4 6 5 6</text></g><path d="M110 42h26" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/>' + ''.join(f'<rect x="{150+i*17}" y="{100-h}" width="13" height="{h}" rx="3" class="{"f-coral" if i==5 else "f-violet"}"/>' for i, h in enumerate([10, 10, 8, 10, 10, 50])) + '<text x="150" y="114" font-size="10" class="t-mono f-muted">1 2 3 4 5 6</text>',
      p="Mỗi lần tung là một <b>dữ liệu</b>. Ghi lại rồi <b>đếm</b> xem mỗi mặt xuất hiện bao nhiêu lần (gọi là <b>tần số</b>), vẽ thành biểu đồ cột. Nhìn biểu đồ dễ thấy hơn nhìn một dãy số dài.",
      ex="Lớp trưởng đếm phiếu bầu bằng cách gạch từng nét: đó là ghi dữ liệu và đếm tần số."),
    dict(no="T2", tag="Toán học", cls="amber", title="Xác suất thực nghiệm",
      svg='<text x="16" y="42" font-size="16" class="f-ink" font-weight="700">số lần ra mặt 6</text><path d="M16 52h150" class="s-ink" stroke-width="2"/><text x="40" y="74" font-size="16" class="f-ink" font-weight="700">tổng số lần tung</text><path d="M16 100q60-60 120-20t110-10" fill="none" class="s-violet" stroke-width="2.5"/><path d="M16 94h230" class="s-mint" stroke-width="2" stroke-dasharray="5 4"/>',
      p="<b>Xác suất thực nghiệm</b> = số lần sự kiện xảy ra chia cho tổng số lần thử. Tung <b>ít lần</b> thì kết quả có thể lệch nhiều do may rủi; tung <b>càng nhiều lần</b>, con số càng ổn định và đáng tin.",
      ex="Tung đồng xu 4 lần có thể ra 3 lần mặt ngửa (75%). Tung 1000 lần thì gần như chắc chắn ra khoảng 50%."),
    dict(no="T3", tag="Học máy", cls="coral", title="Máy học quy luật từ dữ liệu",
      svg='<circle cx="50" cy="60" r="30" class="f-violet" opacity=".25"/><path d="M36 60h28M50 46v28" class="s-violet" stroke-width="3"/><path d="M90 60h30" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="132" y="36" width="110" height="48" rx="10" class="f-coral" opacity=".85"/><text x="142" y="58" font-size="11" fill="#fff" font-weight="700">quy luật: mặt 6</text><text x="142" y="74" font-size="11" fill="#fff">hay ra hơn</text>',
      p="Máy tìm ra điều <b>khác thường</b> và <b>đoán trước</b> nhờ đếm rất nhiều dữ liệu. Nhưng nếu dữ liệu <b>quá ít</b>, bị <b>ghi sai</b> hoặc đã <b>cũ</b>, máy sẽ kết luận sai. Khi không có quy luật nào (xúc xắc công bằng), máy cũng không đoán hay hơn đoán bừa.",
      ex="Ngân hàng phát hiện thẻ bị lấy cắp khi thấy giao dịch khác hẳn thói quen chi tiêu thường ngày của chủ thẻ."),
  ],
  real=[("shield", "", "Phát hiện gian lận thẻ ngân hàng", "Máy so mỗi giao dịch với thói quen của chủ thẻ, giao dịch lệch hẳn sẽ bị tạm khóa để hỏi lại."),
        ("sun", "mint", "Dự báo thời tiết", "\"Khả năng mưa 70%\" nghĩa là trong nhiều ngày có điều kiện giống hôm nay, khoảng 7 trên 10 ngày đã có mưa."),
        ("wrench", "amber", "Kiểm tra sản phẩm trong nhà máy", "Máy đếm tỉ lệ sản phẩm lỗi mỗi giờ; tỉ lệ tăng bất thường là dấu hiệu máy móc cần sửa.")],
  breaks_h2="Thử thách: hãy làm thám tử kết luận sai!",
  breaks_guide="Thám tử máy chỉ giỏi khi <b>dữ liệu</b> tốt. Thử cho nó dữ liệu tệ xem chuyện gì xảy ra!",
  breaks=[
    dict(icon="clock", key="few", title="Kết luận quá vội", p="Mỗi viên mới tung <b>6 lần</b>. Xúc xắc B tình cờ ra mặt 6 tới 4 lần. Thám tử được phép kết luận ngay.",
      why="6 lần tung quá ít: một viên công bằng vẫn có thể ra mặt 6 nhiều lần do <b>may rủi</b>. Thám tử nghi oan cho viên B. Bấm <b>Tung 100 lần</b> vài lần và đặt lại <b>số lần tối thiểu</b> là 30: con số sẽ ổn định và thám tử tìm ra viên thật sự gian lận."),
    dict(icon="book", key="misread", title="Ghi chép sai", p="Cả ba viên đều <b>công bằng</b>. Nhưng bạn ghi kết quả cho viên B cứ thấy mặt 1 lại <b>ghi nhầm thành 6</b>.",
      why="Thám tử chỉ biết những gì được ghi lại. Dữ liệu sai thì kết luận sai, dù cách suy luận hoàn toàn đúng. Máy tính có câu: <b>\"rác vào, rác ra\"</b>. Bấm <b>Sửa lại dữ liệu ghi chép</b> để thám tử đếm lại từ kết quả thật."),
    dict(icon="repeat", key="swap", title="Đổi xúc xắc giữa chừng", p="Sau 400 lần tung, kẻ gian lén <b>đổi viên gian lận</b> từ A sang C rồi tung thêm 150 lần.",
      why="Thám tử dùng <b>toàn bộ</b> dữ liệu, mà 400 lần đầu A gian lận nên A vẫn lệch nhất. Dữ liệu <b>cũ</b> không còn đúng với hiện tại. Bật <b>Chỉ xét 120 lần tung gần nhất</b>: thám tử nhận ra ngay C mới là viên đang gian lận."),
  ],
  badge="Thám Tử Số Liệu", badge_p="Em đã mở khóa 3 thẻ kiến thức: Ghi lại và đếm tần số · Xác suất thực nghiệm · Máy học quy luật từ dữ liệu.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Đồng xu có công bằng không?", "Tung một đồng xu 50 lần, ghi lại kết quả. Tính xác suất thực nghiệm mặt ngửa sau 10, 20, 50 lần. Con số thay đổi thế nào?"),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Tự làm xúc xắc gian lận", "Gắn một miếng đất nặn nhỏ vào một mặt của xúc xắc giấy. Cả nhóm tung 120 lần, vẽ biểu đồ cột, rồi đố lớp bên đoán mặt nào bị làm lệch."),
       (3, "Ý TƯỞNG KHKT", "Máy phát hiện lỗi sản phẩm", "Đếm tỉ lệ bánh bị cháy, hạt bị lép… mỗi mẻ trong bếp hoặc ở nhà máy địa phương, vẽ biểu đồ theo ngày và đặt ngưỡng báo động khi tỉ lệ tăng bất thường.")],
  res=[("layers", "", "Phiếu học tập", "Bảng kiểm đếm, biểu đồ cột, tính xác suất thực nghiệm.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 36", "Máy đếm chữ đi sau chữ để đoán chữ tiếp theo.", "../36-doan-chu/index.html")],
  prev=("02-may-nhin-anh", "2"), nextp=("04-robot-hoc", "4"),
)
