D = dict(
  out="du-an/07-tham-tu-du-lieu/index.html", num="7", grade="7", title="Dự án 7 · Thám tử dữ liệu lớp học",
  scripts=["survey.js"],
  h1='Thám tử dữ liệu: <span class="hl-word">hỏi ai</span> mới đúng?',
  lead="Trường có 480 bạn. Thầy hiệu trưởng muốn biết môn thể thao nào được yêu thích nhất để mua dụng cụ, và nhờ một chiếc máy tính toán từ kết quả khảo sát. Không thể hỏi hết cả trường, em sẽ hỏi một nhóm nhỏ. Nhưng hỏi nhóm nào? Chọn sai nhóm, cả em và chiếc máy đều kết luận sai.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Sân trường giờ ra chơi với 480 học sinh, bấm vào một bạn để hỏi"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">GIỜ RA CHƠI</span></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn small accent" id="btnRandom"><i data-i="sparkle"></i>Hỏi ngẫu nhiên</button><button class="btn small" id="btnField"><i data-i="map"></i>Hỏi ở sân bóng</button><button class="btn small" id="btnClass"><i data-i="layers"></i>Hỏi một lớp</button><button class="btn small ghost" id="btnClear"><i data-i="reset"></i>Xóa câu trả lời</button><button class="btn small mint" id="btnReveal"><i data-i="eye"></i>Công bố kết quả toàn trường</button></div></div>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>Mỗi lần bấm nút hỏi: hỏi bao nhiêu bạn</span><b id="nV"></b><input type="range" id="n" min="5" max="200" step="5"></label>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optLead"><span>Hỏi kiểu gợi ý: "Bạn thích bóng đá đúng không?"</span></label></div>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="cpu"></i></span>Máy mua dụng cụ</h2>
          <p class="small" style="margin:0 0 8px">Máy chia <b>20 bộ dụng cụ</b> theo đúng tỉ lệ trong khảo sát của em:</p>
          <div id="buy" class="buy"></div>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Sổ tay thám tử</div>
      <div class="metric-row"><div class="metric"><span>ĐÃ HỎI</span><b id="bN">0</b></div><div class="metric"><span>NHIỀU NHẤT TRONG MẪU</span><b id="bTop" style="font-size:.95rem">—</b></div></div>
      <div class="lbl" style="margin-top:12px">BẢNG KIỂM ĐẾM</div><div class="conf" id="bTally"></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>MẪU ĐẾN TỪ</span><b id="bFrom" style="font-size:.9rem">—</b></div><div class="metric"><span>LỆCH SO VỚI TOÀN TRƯỜNG</span><b id="bErr">?</b></div></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Mỗi chấm là một bạn. Chấm xám là bạn chưa được hỏi. Bấm vào chấm để hỏi từng bạn, hoặc dùng các nút hỏi nhanh.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Tỉ lệ yêu thích mỗi môn: trong mẫu em hỏi và trong toàn trường</b></div><canvas id="chart" width="1100" height="230"></canvas></div>''',
  play_guide="Bấm vào vài chấm trên sân trường để hỏi từng bạn. Rồi thử các nút hỏi nhanh: <b>ngẫu nhiên</b>, <b>ở sân bóng</b>, <b>một lớp</b>. Kết quả có giống nhau không?",
  lessons=["Toán 7 · Thu thập, phân loại dữ liệu", "Toán 7 · Biểu đồ cột, biểu đồ hình quạt", "Tin học 7 · Bảng tính, xử lý dữ liệu"],
  mission_h2="Thu thập dữ liệu sao cho đáng tin",
  mission_q="Hỏi 30 bạn có đủ biết ý kiến của 480 bạn không?",
  mission_p="Em sẽ <b>khảo sát</b> trên sân trường, <b>kiểm đếm</b>, vẽ <b>biểu đồ</b>, so với kết quả toàn trường, và xem một chiếc máy <b>học từ mẫu lệch</b> sẽ đưa ra quyết định sai ra sao.",
  minutes="45 phút · 1 tiết học",
  checklist=[("click", "Tự bấm hỏi ít nhất 10 bạn"), ("random", "Hỏi ngẫu nhiên ít nhất 100 bạn"), ("reveal", "Công bố và so với kết quả toàn trường"), ("soi", "Soi tới bước Mẫu bị lệch"), ("broke", "Làm khảo sát sai lệch ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Làm một cuộc khảo sát đáng tin: 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Số liệu dùng đúng cuộc khảo sát em vừa làm.",
  soi_guide="Dữ liệu tốt không tự nhiên mà có. Thám tử phải <b>hỏi đúng câu</b> và <b>hỏi đúng người</b>!",
  cards=[
    dict(no="T1", tag="Dữ liệu", title="Tổng thể và mẫu",
      svg=''.join(f'<circle cx="{20+(i%16)*14}" cy="{18+(i//16)*14}" r="4.5" class="{"f-violet" if i in (3,9,18,27,36,44,53,61,70,75) else "f-line"}" opacity="{1 if i in (3,9,18,27,36,44,53,61,70,75) else .5}"/>' for i in range(96)) + '<text x="20" y="114" font-size="10" class="t-mono f-violet">10 bạn được chọn ngẫu nhiên</text>',
      p="<b>Tổng thể</b> là tất cả những người ta muốn biết ý kiến (480 bạn). <b>Mẫu</b> là nhóm nhỏ ta thật sự hỏi. Mẫu tốt phải <b>giống tổng thể thu nhỏ</b>: chọn <b>ngẫu nhiên</b> và đủ nhiều.",
      ex="Nếm một thìa canh để biết cả nồi đã vừa chưa: phải khuấy đều trước, nếu không thìa đầu chỉ toàn nước."),
    dict(no="T2", tag="Toán học", cls="amber", title="Mẫu bị lệch",
      svg='<rect x="16" y="30" width="40" height="70" rx="4" class="f-mint"/><rect x="62" y="70" width="40" height="30" rx="4" class="f-violet"/><rect x="108" y="80" width="40" height="20" rx="4" class="f-amber"/><text x="16" y="22" font-size="10" class="t-mono f-coral">chỉ hỏi ở sân bóng</text><rect x="170" y="56" width="20" height="44" rx="3" class="f-mint" opacity=".6"/><rect x="194" y="46" width="20" height="54" rx="3" class="f-violet" opacity=".6"/><rect x="218" y="64" width="20" height="36" rx="3" class="f-amber" opacity=".6"/><text x="168" y="22" font-size="10" class="t-mono f-mint">toàn trường</text>',
      p="Chỉ hỏi ở sân bóng, chỉ hỏi đội bóng, hỏi quá ít người hay đặt <b>câu hỏi gợi ý</b> đều làm mẫu <b>không giống tổng thể</b>. Biểu đồ vẽ đẹp đến đâu cũng cho kết luận sai.",
      ex="Hỏi ở cửa hàng bánh ngọt \"Bạn có thích đồ ngọt không?\" thì gần như ai cũng trả lời có."),
    dict(no="T3", tag="Học máy", cls="coral", title="Máy học từ dữ liệu lệch",
      svg='<rect x="16" y="30" width="80" height="60" rx="10" class="f-coral" opacity=".25"/><text x="24" y="58" font-size="11" class="f-coral" font-weight="700">dữ liệu lệch</text><text x="24" y="76" font-size="10" class="f-ink">90% bóng đá</text><path d="M104 60h30" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="142" y="30" width="100" height="60" rx="10" class="f-violet" opacity=".25"/><text x="150" y="58" font-size="11" class="f-violet" font-weight="700">máy quyết định</text><text x="150" y="76" font-size="10" class="f-ink">mua 18 quả bóng</text>',
      p="AI học từ dữ liệu con người thu thập. Dữ liệu lệch thì máy học lệch và đưa ra <b>quyết định không công bằng</b>, mà máy không hề biết mình sai. Người thu thập dữ liệu phải chịu trách nhiệm kiểm tra.",
      ex="Một máy nhận dạng giọng nói chỉ được học từ giọng người lớn sẽ nghe trẻ em nói kém hơn hẳn."),
  ],
  real=[("chart", "", "Thăm dò ý kiến", "Các cuộc thăm dò dư luận chọn mẫu ngẫu nhiên vài nghìn người để ước đoán ý kiến của hàng triệu người."),
        ("cpu", "mint", "AI học từ dữ liệu", "Ảnh, chữ, giọng nói dùng để huấn luyện AI phải đủ đa dạng, nếu không AI sẽ làm kém với những nhóm người ít xuất hiện."),
        ("shield", "amber", "Kiểm tra chất lượng", "Nhà máy lấy ngẫu nhiên vài sản phẩm trong lô để kiểm tra, thay vì mở tất cả.")],
  breaks_h2="Thử thách: hãy làm cuộc khảo sát sai lệch!",
  breaks_guide="Mỗi sự cố là một lỗi thật mà người lớn vẫn hay mắc khi thu thập dữ liệu. Thử và xem chiếc máy mua dụng cụ quyết định ra sao!",
  breaks=[
    dict(icon="target", key="team", title="Chỉ hỏi đội bóng", p="Để nhanh, bạn lớp trưởng chỉ hỏi <b>20 bạn trong đội bóng</b> của trường.",
      why="Cả đội bóng đều thích bóng đá, nên mẫu cho 100% bóng đá và máy đặt mua toàn quả bóng. Mẫu này chỉ đại diện cho đội bóng, không đại diện cho cả trường. Bấm <b>Xóa câu trả lời</b> rồi <b>Hỏi ngẫu nhiên</b> 100 bạn."),
    dict(icon="clock", key="few", title="Hỏi quá ít", p="Chỉ hỏi <b>5 bạn</b> ngẫu nhiên rồi kết luận cho cả 480 bạn.",
      why="Với 5 bạn, chỉ cần một vài bạn tình cờ cùng thích một môn là tỉ lệ lệch hẳn. Hãy bấm hỏi lại vài lần: mỗi lần ra một kết quả khác. Kéo thanh lên 100 rồi hỏi lại: kết quả ổn định và gần toàn trường hơn."),
    dict(icon="msg", key="lead", title="Câu hỏi gợi ý", p="Người khảo sát hỏi: <b>\"Bạn thích bóng đá đúng không?\"</b> thay vì hỏi bạn thích môn nào.",
      why="Câu hỏi gợi ý làm một số bạn <b>gật đầu theo</b>, dù họ thích môn khác. Mẫu chọn ngẫu nhiên vẫn bị lệch vì <b>câu hỏi</b> lệch. Tắt <b>Hỏi kiểu gợi ý</b>, xóa câu trả lời và hỏi lại."),
  ],
  badge="Thám Tử Dữ Liệu", badge_p="Em đã mở khóa 3 thẻ kiến thức: Tổng thể và mẫu · Mẫu bị lệch · Máy học từ dữ liệu lệch.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Món ăn sáng yêu thích", "Hỏi 10 người trong khu phố về món ăn sáng yêu thích. Nhóm người em hỏi có giống cả khu phố không? Ghi lại vì sao."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Khảo sát thật của lớp", "Thiết kế câu hỏi không gợi ý, chọn ngẫu nhiên 30 bạn trong trường bằng cách bốc thăm số thứ tự, vẽ biểu đồ và so với khi chỉ hỏi bạn thân."),
       (3, "Ý TƯỞNG KHKT", "Kiểm tra dữ liệu huấn luyện", "Xây bộ ảnh lá cây để dạy máy nhận dạng, kiểm tra xem bộ ảnh có đủ các loại lá, đủ điều kiện ánh sáng chưa, và đo máy làm kém ở nhóm nào.")],
  res=[("layers", "", "Phiếu học tập", "Bốc thăm mẫu ngẫu nhiên, kiểm đếm, vẽ biểu đồ, tìm lỗi khảo sát.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 27", "Máy học dự đoán điểm thi từ dữ liệu học sinh.", "../27-diem-thi/index.html")],
  prev=("06-doan-hinh", "6"), nextp=("08-nghe-not-nhac", "8"),
)
