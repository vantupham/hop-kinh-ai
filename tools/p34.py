D = dict(
  out="du-an/34-giay-quy/index.html", num="34", grade="8", title="Dự án 34 · Giấy quỳ thông minh",
  scripts=["ph.js"], device="Camera: không bắt buộc",
  h1='Giấy chỉ thị <span class="hl-word">thông minh</span> đọc độ pH',
  lead="Nhúng giấy chỉ thị vào nước chanh, giấy chuyển đỏ; vào nước xà phòng, giấy chuyển xanh tím. Mắt người so màu với bảng mẫu để đọc pH. Một máy có camera cũng làm được: đọc ba con số màu, so với bảng mẫu, báo axit hay bazơ. Nhưng dưới ánh đèn vàng, mọi màu đều ngả vàng. Máy có bị lừa không?",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px"><div class="seg"><button class="btn small" id="srcSim" aria-pressed="true"><i data-i="flask"></i>Phòng thí nghiệm ảo</button><button class="btn small ghost" id="srcCam" aria-pressed="false"><i data-i="camera"></i>Dùng camera</button></div></div>
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Cốc dung dịch, giấy chỉ thị, ảnh máy chụp và bảng màu pH mẫu"></canvas><video id="video" playsinline muted></video><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div class="stage-msg" id="msg" hidden></div></div>
      <div class="play-panel sim-only"><p class="small" style="margin:0 0 8px"><b>Chọn dung dịch để nhúng giấy:</b></p><div class="btn-row" id="liquids"></div></div>
      <p class="ask" id="askText" aria-live="polite" style="margin:12px 0 0;font-size:1.02rem"></p>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="sun"></i></span>Ánh sáng khi chụp</h2>
          <label class="ctl"><span>Màu đèn (trắng → vàng)</span><b id="warmV"></b><input type="range" id="warm" min="0" max="1" step="0.05"></label>
          <label class="ctl"><span>Độ sáng</span><b id="brightV"></b><input type="range" id="bright" min="0.4" max="1.2" step="0.05"></label>
          <label class="ctl sim-only"><span>Giấy bị nhạt màu (nhúng quá lâu, pha loãng)</span><b id="fadeV"></b><input type="range" id="fade" min="0" max="0.8" step="0.05"></label>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="cpu"></i></span>Cách máy đọc màu</h2>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optWB" checked><span>Cân bằng trắng nhờ ô giấy trắng</span></label><label class="tog"><input type="checkbox" id="optHue"><span>Chỉ so sắc màu, bỏ qua đậm nhạt</span></label><label class="tog"><input type="checkbox" id="optFull" checked><span>Dùng đủ 14 màu mẫu</span></label></div>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy</div>
      <div class="metric-row"><div class="metric"><span>MÁY ĐỌC pH</span><b id="bPH">—</b></div><div class="metric"><span>LOẠI</span><b id="bKind" style="font-size:.95rem">—</b></div></div>
      <div class="lbl" style="margin-top:12px">BA SỐ MÀU MÁY ĐỌC ĐƯỢC</div><div id="bRGB" class="calc"></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>pH THẬT</span><b id="bTrue">—</b></div><div class="metric"><span>ĐỌC ĐÚNG (±1) / 11 DUNG DỊCH</span><b id="bAcc">—</b></div></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px"><b style="color:#ffc34d">An toàn:</b> không nếm, không ngửi trực tiếp hóa chất. Nước tẩy, nước vôi có thể gây bỏng da và mắt: luôn đeo găng tay khi làm thí nghiệm thật.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Màu giấy giống mỗi màu mẫu đến mức nào? (cột cao = càng giống)</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Bấm một dung dịch để nhúng giấy chỉ thị. Máy chụp ảnh tờ giấy, đọc <b>ba số màu</b> rồi so với bảng màu mẫu bên phải.",
  lessons=["KHTN 8 · Acid, base, thang pH", "KHTN 8 · Chất chỉ thị màu", "KHTN 7 · Ánh sáng, màu sắc (ôn tập)"],
  mission_h2="Dùng máy đọc màu để đo độ pH, và biết khi nào không tin máy",
  mission_q="Cùng một tờ giấy chỉ thị, sao chụp dưới đèn vàng máy lại đọc ra pH khác?",
  mission_p="Em sẽ thử giấy chỉ thị với 11 dung dịch quen thuộc, xem máy biến màu thành <b>ba con số</b>, so với <b>bảng màu mẫu</b>, rồi phá máy bằng <b>ánh đèn vàng</b>, <b>giấy nhạt màu</b> và <b>bảng mẫu quá thô</b>.",
  minutes="45 phút · 1 tiết học",
  checklist=[("dip", "Thử ít nhất 5 dung dịch"), ("acidbase", "Tìm một axit, một bazơ và một chất trung tính"), ("light", "Đổi ánh đèn và xem máy đọc thay đổi"), ("soi", "Soi tới bước Cân bằng trắng"), ("broke", "Làm máy đọc sai pH ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy đọc pH từ màu như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng dung dịch và ánh sáng hiện tại.",
  soi_guide="Máy không biết \"đỏ\" là gì. Nó chỉ có <b>ba con số</b> đỏ, xanh lá, xanh dương. Cùng xem máy biến ba số đó thành độ pH!",
  cards=[
    dict(no="T1", tag="Hóa học", title="Thang pH và chất chỉ thị",
      svg=''.join(f'<rect x="{12+i*16.5}" y="34" width="15" height="40" rx="3" fill="{c}"/>' for i, c in enumerate(["#e8202a", "#ef4a28", "#f47f20", "#f6a51f", "#f7d117", "#dfe31f", "#8cc63f", "#3fae49", "#1fa27f", "#2d8ec9", "#3c6ab3", "#4f4fa3", "#5a3e94", "#4b2c7a"])) + '<text x="12" y="26" font-size="10" class="t-mono f-coral">axit</text><text x="110" y="26" font-size="10" class="t-mono f-mint">trung tính</text><text x="200" y="26" font-size="10" class="t-mono f-violet">bazơ</text><text x="14" y="92" font-size="10" class="t-mono f-ink">1</text><text x="110" y="92" font-size="10" class="t-mono f-ink">7</text><text x="226" y="92" font-size="10" class="t-mono f-ink">14</text>',
      p="pH cho biết dung dịch là <b>axit</b> (pH &lt; 7), <b>trung tính</b> (pH = 7) hay <b>bazơ</b> (pH &gt; 7). <b>Chất chỉ thị</b> đổi màu theo pH: giấy chỉ thị vạn năng đi từ đỏ (axit mạnh), qua vàng, xanh lá, tới xanh tím (bazơ mạnh).",
      ex="Nước chanh có pH khoảng 2, nước lọc khoảng 7, nước xà phòng khoảng 10."),
    dict(no="T2", tag="Thị giác máy tính", cls="amber", title="Màu là ba con số, so với mẫu",
      svg='<rect x="16" y="30" width="44" height="44" rx="8" fill="#f47f20"/><text x="70" y="46" font-size="11" class="t-mono f-coral">R 244</text><text x="70" y="62" font-size="11" class="t-mono f-mint">G 127</text><text x="70" y="78" font-size="11" class="t-mono f-violet">B 32</text><path d="M140 52h24" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="172" y="30" width="22" height="44" rx="4" fill="#ef4a28"/><rect x="198" y="26" width="22" height="52" rx="4" fill="#f47f20" stroke="#fff" stroke-width="2"/><rect x="224" y="30" width="22" height="44" rx="4" fill="#f6a51f"/>',
      p="Camera đọc màu giấy thành ba số <b>R, G, B</b>. Máy tính <b>khoảng cách</b> từ ba số đó tới ba số của từng màu trong bảng mẫu và chọn màu <b>gần nhất</b>: đó là độ pH máy đọc được.",
      ex="Ứng dụng chọn màu sơn tường chụp ảnh căn phòng rồi tìm mã màu gần nhất trong bảng màu của hãng sơn."),
    dict(no="T3", tag="Giới hạn", cls="coral", title="Ánh sáng đánh lừa máy",
      svg='<rect x="16" y="30" width="60" height="50" rx="8" fill="#8cc63f"/><text x="20" y="96" font-size="10" class="t-mono f-ink">đèn trắng</text><rect x="110" y="30" width="60" height="50" rx="8" fill="#b8b72a"/><text x="112" y="96" font-size="10" class="t-mono f-amber">đèn vàng</text><rect x="196" y="30" width="44" height="50" rx="8" fill="#f5f0dc" stroke="#ffc34d" stroke-width="2"/><text x="196" y="96" font-size="10" class="t-mono f-ink">ô trắng</text>',
      p="Màu máy chụp được là màu giấy <b>nhân với màu đèn</b>. Dưới đèn vàng, giấy xanh lá trông như vàng chanh và máy đọc nhầm pH. Đặt một <b>ô giấy trắng</b> cạnh giấy chỉ thị: máy biết đèn vàng bao nhiêu và <b>trừ bớt</b> phần đó đi (cân bằng trắng).",
      ex="Ảnh chụp dưới đèn sợi đốt thường bị ngả vàng; điện thoại có chế độ cân bằng trắng để sửa lại."),
  ],
  real=[("flask", "", "Phòng thí nghiệm, nhà máy nước", "Máy đo màu tự động đọc que thử để theo dõi pH nước hồ bơi, nước sinh hoạt liên tục cả ngày."),
        ("heart", "mint", "Que thử y tế", "Ứng dụng điện thoại chụp que thử rồi đọc kết quả, giảm nhầm lẫn do mắt mỗi người nhìn màu khác nhau."),
        ("sun", "amber", "Nông nghiệp", "Đo pH đất bằng dung dịch chỉ thị và camera để biết đất chua hay kiềm, chọn loại phân bón phù hợp.")],
  breaks_h2="Thử thách: hãy làm máy đọc sai pH!",
  breaks_guide="Máy chỉ có ba con số màu. Thứ gì làm ba số đó thay đổi đều có thể làm máy đọc sai. Thử xem!",
  breaks=[
    dict(icon="sun", key="warm", title="Chụp dưới đèn vàng", p="Máy chụp giấy chỉ thị dưới <b>bóng đèn vàng</b>, lại bị tắt <b>cân bằng trắng</b>. Thử với nước xà phòng (pH 10).",
      why="Đèn vàng làm tăng phần đỏ, giảm phần xanh dương của mọi màu, nên giấy xanh dương (bazơ) trông ngả xanh lá và máy đọc nhầm pH thấp hơn. Bật <b>Cân bằng trắng nhờ ô giấy trắng</b>: máy chia màu giấy cho màu của ô trắng, đưa màu về như dưới đèn trắng."),
    dict(icon="eye", key="fade", title="Giấy bị nhạt màu", p="Giấy chỉ thị nhúng quá lâu nên <b>bị nhạt</b>, màu loang gần như trắng. Thử với giấm ăn (pH 3).",
      why="Màu nhạt có ba số gần với màu trắng, nên khoảng cách tới màu mẫu sáng nhất (vàng, xanh lá vàng) lại nhỏ nhất: giấm bị đọc thành gần trung tính. Bật <b>Chỉ so sắc màu</b>: máy chỉ xét giấy ngả về màu nào (sắc màu), bỏ qua đậm hay nhạt."),
    dict(icon="layers", key="coarse", title="Bảng mẫu quá thô", p="Bảng mẫu chỉ có <b>3 màu</b>: đỏ (pH 1), xanh lá (pH 7), tím (pH 13). Thử với nước cam (pH 4).",
      why="Máy chỉ chọn được trong 3 đáp án nên pH 4 bị làm tròn thành 1 hoặc 7: sai rất xa. Bảng mẫu (dữ liệu tham chiếu) càng chi tiết thì máy đọc càng chính xác. Bật lại <b>Dùng đủ 14 màu mẫu</b>."),
  ],
  badge="Nhà Hóa Học Số", badge_p="Em đã mở khóa 3 thẻ kiến thức: Thang pH và chất chỉ thị · Màu là ba con số, so với mẫu · Ánh sáng đánh lừa máy.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Chất chỉ thị từ bắp cải tím", "Cùng người lớn đun bắp cải tím lấy nước màu tím, nhỏ vào nước chanh, giấm, nước vôi trong (đeo găng). Chụp ảnh các màu và dùng chế độ camera để máy đọc."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Bảng màu của nhóm", "Chụp giấy chỉ thị với 8 dung dịch dưới đèn trắng và đèn vàng. Ghi ba số R, G, B, so sánh và giải thích vì sao cần cân bằng trắng."),
       (3, "Ý TƯỞNG KHKT", "Máy theo dõi nước bể cá", "Dùng camera đọc que thử pH đặt trong bể cá mỗi ngày, cảnh báo khi nước quá chua hoặc quá kiềm.")],
  res=[("layers", "", "Phiếu học tập", "Đọc pH từ bảng màu, tính khoảng cách màu, cân bằng trắng.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, an toàn hóa chất, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 13", "Máy gom các màu giống nhau thành nhóm.", "../13-phan-cum/index.html")],
  prev=("33-no-ron", "33"), nextp=("35-chatbot", "35"),
)
