D = dict(
  out="du-an/10-tu-the-ngoi/index.html", num="10", level="2", title="Dự án 10 · Trợ lý tư thế ngồi học",
  scripts=["posture.js"],
  h1='Trợ lý <span class="hl-word">tư thế ngồi học</span>',
  lead="Ngồi học sai tư thế lâu ngày có thể làm cong lưng và cận thị. Trợ lý AI này nhìn em từ bên cạnh và nhắc khi em gù lưng, cúi sát hay ngả người. Điều đặc biệt: luật nhắc nhở do máy tự học, và em đọc được từng dòng!",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" width="640" height="480" aria-label="Bạn học sinh ngồi học nhìn nghiêng"></canvas><video id="video" playsinline muted></video><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div id="stageMsg" class="stage-msg" hidden></div></div>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="Nguồn hình ảnh"><button class="btn small" id="srcSim" aria-pressed="true"><i data-i="figure"></i>Bạn học ảo</button><button class="btn small ghost" id="srcCam" aria-pressed="false"><i data-i="camera"></i>Camera</button></div>
        <button class="btn small sim-only" id="btnAuto" aria-pressed="true"><i data-i="repeat"></i>Đổi tư thế tự động</button>
      </div>
      <div class="panel-ctl sim-only"><label class="ctl"><span>Góc lưng</span><b id="lungV"></b><input type="range" id="lung" min="-22" max="36" step="1"></label><label class="ctl"><span>Cúi đầu</span><b id="coV"></b><input type="range" id="co" min="0" max="48" step="1"></label><label class="ctl"><span>Chiều cao bạn học</span><b id="caoV"></b><input type="range" id="cao" min="0.78" max="1.22" step="0.02"></label></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="result" id="bResult"><small>CÂY QUYẾT ĐỊNH NÓI</small>—</div>
      <div class="lbl" style="margin-top:14px">ĐƯỜNG ĐI TRÊN CÂY</div>
      <div id="bPath" style="color:#c3c7f0;font-size:.8rem;line-height:1.8"></div>
      <div class="lbl" style="margin-top:14px">THỐNG KÊ BUỔI HỌC</div>
      <div class="bars" id="bTime"></div>
    </aside>
  </div>''',
  mission_h2="Để máy tự tìm ra luật, rồi đọc và kiểm tra luật đó",
  mission_q="Ở Dự án 1 em tự viết luật. Máy có tự viết được luật từ dữ liệu không? Và ta có hiểu được luật đó không?",
  mission_p="<b>Cây quyết định</b> học từ dữ liệu giống KNN hay softmax, nhưng kết quả là một chuỗi câu hỏi <b>con người đọc được</b>. Em sẽ xem cây mọc lên, xem máy tự viết code, và phát hiện khi nào cây học sai.",
  minutes="45–60 phút",
  checklist=[("see", "Đi theo đường của tư thế hiện tại trên cây"), ("grow", "Huấn luyện cây với độ sâu khác"), ("regions", "Đổi trục trên bản đồ vùng quyết định"), ("broke", "Làm cây học sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ tư thế ngồi tới lời nhắc nhở: 6 bước",
  soi_p="Hình bên dưới chạy trực tiếp theo bạn học ở phần Mồi.",
  theory=[
    dict(no="37", tag="Học máy", title="Cây quyết định",
      svg='<rect x="90" y="8" width="80" height="22" rx="6" class="f-paper s-line"/><text x="130" y="23" text-anchor="middle" font-size="10" class="f-ink">lưng ≤ 17°?</text><path d="M110 30 60 56M150 30 200 56" class="s-line" stroke-width="1.5"/><rect x="20" y="56" width="80" height="22" rx="6" class="f-paper s-line"/><text x="60" y="71" text-anchor="middle" font-size="10" class="f-ink">mắt ≤ 0,78?</text><rect x="168" y="56" width="70" height="22" rx="6" fill="#ff7d5f"/><text x="203" y="71" text-anchor="middle" font-size="10" fill="#0a0b1e" font-weight="700">Gù lưng</text><path d="M44 78 30 96M76 78 92 96" class="s-line" stroke-width="1.5"/><rect x="2" y="96" width="56" height="20" rx="6" fill="#ffc34d"/><text x="30" y="110" text-anchor="middle" font-size="9" fill="#0a0b1e" font-weight="700">Cúi sát</text><rect x="66" y="96" width="56" height="20" rx="6" fill="#3ee9cf"/><text x="94" y="110" text-anchor="middle" font-size="9" fill="#0a0b1e" font-weight="700">Đúng</text>',
      p="Giống trò \"20 câu hỏi\": mỗi nút là một câu hỏi đúng/sai về một đặc trưng. Trả lời từ <b>gốc</b> xuống, cuối cùng tới một <b>lá</b> chứa kết luận. Máy tự chọn câu hỏi và con số ngưỡng từ dữ liệu.",
      deep="Cây quyết định là một trong những thuật toán học máy lâu đời và phổ biến nhất. Ghép hàng trăm cây lại (gọi là \"rừng ngẫu nhiên\") thì được một mô hình rất mạnh cho dữ liệu dạng bảng."),
    dict(no="38", tag="Toán + AI", title="Độ lẫn lộn Gini",
      svg='<g><circle cx="30" cy="40" r="6" fill="#3ee9cf"/><circle cx="46" cy="52" r="6" fill="#ff7d5f"/><circle cx="34" cy="64" r="6" fill="#ffc34d"/><circle cx="54" cy="36" r="6" fill="#3ee9cf"/><circle cx="58" cy="66" r="6" fill="#ff7d5f"/></g><text x="16" y="100" font-size="11" class="t-mono f-coral">Gini 0,64</text><path d="M84 52h26" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><g><circle cx="140" cy="44" r="6" fill="#3ee9cf"/><circle cx="156" cy="56" r="6" fill="#3ee9cf"/><circle cx="210" cy="44" r="6" fill="#ff7d5f"/><circle cx="226" cy="58" r="6" fill="#ff7d5f"/></g><text x="130" y="100" font-size="11" class="t-mono f-mint">0,0</text><text x="200" y="100" font-size="11" class="t-mono f-mint">0,0</text>',
      p="Một nhóm dữ liệu càng <b>lẫn lộn</b> nhiều nhãn thì Gini càng lớn. Nhóm chỉ có một nhãn thì Gini = 0. Ở mỗi nút, máy thử rất nhiều câu hỏi và chọn câu làm hai nhóm con <b>sạch nhất</b>.",
      deep="Gini = 1 − (tỉ lệ nhãn 1)² − (tỉ lệ nhãn 2)² − … Ví dụ nhóm có 50% Đúng, 50% Gù lưng: Gini = 1 − 0,25 − 0,25 = 0,5. Một số thư viện dùng \"entropy\" thay cho Gini, ý tưởng tương tự."),
    dict(no="39", tag="Bản chất AI", cls="coral", title="Độ sâu & quá khớp",
      svg='<rect x="20" y="20" width="100" height="80" class="f-soft"/><rect x="20" y="20" width="50" height="80" fill="#3ee9cf" opacity=".3"/><rect x="70" y="20" width="50" height="80" fill="#ff7d5f" opacity=".3"/><rect x="140" y="20" width="100" height="80" class="f-soft"/><g opacity=".35"><rect x="140" y="20" width="14" height="30" fill="#3ee9cf"/><rect x="154" y="20" width="20" height="18" fill="#ff7d5f"/><rect x="174" y="38" width="12" height="40" fill="#3ee9cf"/><rect x="186" y="20" width="18" height="26" fill="#ff7d5f"/><rect x="204" y="46" width="22" height="20" fill="#3ee9cf"/><rect x="226" y="20" width="14" height="80" fill="#ff7d5f"/><rect x="140" y="70" width="30" height="30" fill="#ff7d5f"/></g><text x="34" y="114" font-size="10" class="t-mono f-mint">cây nông</text><text x="150" y="114" font-size="10" class="t-mono f-coral">cây quá sâu</text>',
      p="Cây càng sâu thì càng chia nhỏ dữ liệu, tới mức mỗi lá chỉ còn một mẫu và cây <b>thuộc lòng</b> cả những mẫu bị gắn nhãn nhầm. Trên bản đồ vùng quyết định, cây quá sâu tạo ra nhiều ô vụn vặt.",
      deep="Giới hạn <b>độ sâu tối đa</b> và <b>số mẫu tối thiểu ở mỗi lá</b> là hai cách \"tỉa cây\" phổ biến. Em đã gặp quá khớp ở Dự án 6, và sẽ còn gặp lại trong gần như mọi mô hình."),
    dict(no="40", tag="Đạo đức AI", cls="amber", title="AI giải thích được",
      svg='<rect x="14" y="20" width="110" height="80" rx="8" fill="#0a0c26"/><text x="22" y="42" font-size="9" fill="#ff9ad5" font-family="JetBrains Mono">if</text><text x="34" y="42" font-size="9" fill="#e8eaff" font-family="JetBrains Mono">(lung &lt;= 17)</text><text x="30" y="58" font-size="9" fill="#e8eaff" font-family="JetBrains Mono">return "Đúng"</text><text x="22" y="74" font-size="9" fill="#ff9ad5" font-family="JetBrains Mono">else</text><text x="30" y="90" font-size="9" fill="#e8eaff" font-family="JetBrains Mono">return "Gù"</text><rect x="140" y="20" width="100" height="80" rx="8" class="f-ink"/><text x="190" y="66" text-anchor="middle" font-size="22" fill="#fff" font-weight="800">?</text><text x="190" y="114" text-anchor="middle" font-size="10" class="t-mono f-muted">hộp đen</text>',
      p="Cây quyết định có thể in ra thành <b>code if-else</b>, nên con người kiểm tra được máy đã học gì, có hợp lý không, có thiên vị không. Nhiều mô hình mạnh hơn (như mạng nơ-ron) lại khó giải thích hơn nhiều.",
      deep="Trong y tế, ngân hàng, tuyển dụng… người bị ảnh hưởng bởi quyết định của AI có quyền hỏi \"vì sao?\". Vì vậy khả năng giải thích được không chỉ là chuyện kỹ thuật mà còn là chuyện công bằng."),
  ],
  tulam_h2="Bàn thí nghiệm: trồng cây và đọc code máy tự viết",
  tulam_p="Kéo thanh độ sâu và xem cây mọc lại. Đường xanh là đường đi của tư thế hiện tại. Bản đồ vùng quyết định cho thấy cây chia không gian đặc trưng thành các hình chữ nhật (mỗi chấm là một mẫu học).",
  tulam='''
  <div class="card canvas-card"><div class="chart-head"><b><i data-i="map"></i> Cây quyết định máy vừa học</b><span class="legend"><span id="treeInfo"></span> <button class="btn small ghost" id="btnRegrow" style="margin-left:10px"><i data-i="repeat"></i>Xem cây mọc lại</button></span></div><canvas id="treeCanvas" width="1100" height="440"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Cách trồng cây</h3>
      <label class="ctl"><span>Độ sâu tối đa</span><b id="depthV"></b><input type="range" id="depth" min="1" max="12" step="1"></label>
      <label class="ctl"><span>Số mẫu tối thiểu ở mỗi lá</span><b id="minLeafV"></b><input type="range" id="minLeaf" min="1" max="30" step="1"></label>
      <div class="lbl muted small" style="margin:8px 0 6px">ĐẶC TRƯNG CÂY ĐƯỢC DÙNG</div>
      <div class="btn-row" id="featBox"></div>
      <div class="metric-row" style="margin-top:14px"><div class="chip">Tập học: <b id="accTrain">—</b></div><div class="chip mint">Tập kiểm tra: <b id="accTest">—</b></div></div>
      <div class="lab" id="confOut" style="margin-top:12px"></div>
    </div>
    <div class="card canvas-card">
      <h3 class="h-ic"><span class="ico-box sm amber"><i data-i="layers"></i></span>Bản đồ vùng quyết định</h3>
      <canvas id="regions" width="520" height="360"></canvas>
      <div class="axis-pick">Trục ngang <select id="axX" aria-label="Trục ngang"></select> Trục dọc <select id="axY" aria-label="Trục dọc"></select></div>
    </div>
  </div>
  <div class="card" style="margin-top:18px"><h3 class="h-ic"><span class="ico-box sm mint"><i data-i="code"></i></span>Code do máy tự viết</h3><pre class="code" id="genCode" style="max-height:420px"></pre>
    <details><summary>So với luật "chuyên gia" đã dùng để gắn nhãn dữ liệu</summary><p>Dữ liệu được gắn nhãn theo luật: nếu mắt–tay (theo thân) &lt; 0,78 thì <b>Cúi sát</b>; nếu không, góc lưng &gt; 17° thì <b>Gù lưng</b>; góc lưng &lt; −9° thì <b>Ngả người</b>; còn lại là <b>Đúng tư thế</b>. Máy <b>không được biết</b> luật này, chỉ thấy dữ liệu. Em hãy so sánh xem cây tìm lại luật gần đúng tới đâu.</p></details></div>''',
  breaks_h2="Thử thách: hãy làm cây học sai!",
  breaks=[
    dict(icon="layers", key="deep", title="Cây quá sâu, nhãn lẫn lỗi", p="20% dữ liệu bị gắn nhãn nhầm, cây được mọc sâu 12 tầng, mỗi lá chỉ cần 1 mẫu.",
      why="Cây chia nhỏ mãi để học thuộc cả những mẫu sai. Xem tập học gần 100% mà tập kiểm tra thấp hơn hẳn, bản đồ vùng quyết định vụn vặt, và đoạn code dài khó đọc. Giảm độ sâu xuống 3–5 và tăng số mẫu tối thiểu ở lá."),
    dict(icon="figure", key="tall", title="Dữ liệu chỉ từ các bạn cao", p="Dữ liệu học chỉ lấy từ các bạn cao, và dùng <b>khoảng cách mắt–tay tính bằng pixel</b>. Giờ bạn học ảo là một bạn thấp ngồi đúng tư thế…",
      why="Bạn thấp có mắt vốn gần bàn hơn tính theo pixel, nên cây cho là \"Cúi sát\". Đây là thiên vị do dữ liệu thiếu đa dạng cộng với đặc trưng chưa chuẩn hóa. Sửa: dùng đặc trưng <b>mắt–tay (theo thân)</b> và thu thập dữ liệu từ nhiều bạn khác nhau."),
    dict(icon="eye", key="nofeat", title="Thiếu đặc trưng quan trọng", p="Cây chỉ được dùng <b>góc lưng</b> và <b>vai nhô</b>, không biết gì về đầu và mắt.",
      why="Không có thông tin về khoảng cách mắt, cây không thể nhận ra \"Cúi sát\" (xem ma trận nhầm lẫn). Dữ liệu tốt mà thiếu đặc trưng thì thuật toán giỏi mấy cũng chịu. Chọn đúng đặc trưng là một nửa thành công (thẻ #05)."),
  ],
  real_h2="Cây quyết định & trợ lý sức khỏe ở đâu quanh em?",
  real=[("heart", "", "Y tế", "Bác sĩ dùng các cây quyết định đơn giản để phân loại mức độ khẩn cấp của bệnh nhân. Ưu điểm là ai cũng đọc và kiểm tra được."),
        ("activity", "mint", "Thiết bị đeo", "Đồng hồ thông minh nhắc đứng dậy vận động, phát hiện ngã, đếm bước chân từ dữ liệu cảm biến chuyển động."),
        ("chart", "amber", "Dữ liệu dạng bảng", "Dự đoán khách hàng có hủy dịch vụ không, khoản vay có rủi ro không. Các \"rừng cây\" thường là lựa chọn số một.")],
  ethics=["Nếu trường dùng camera chấm điểm tư thế ngồi của học sinh, ai được xem dữ liệu? Điểm đó có nên ảnh hưởng tới hạnh kiểm không?",
          "Một bạn có vấn đề về cột sống bẩm sinh sẽ luôn bị chấm \"Gù lưng\". Làm sao để hệ thống công bằng với bạn ấy?",
          "Vì sao việc đọc được luật của AI (như code bên trên) giúp ta phát hiện thiên vị dễ hơn?"],
  badge="Người Trồng Cây Quyết Định", badge_p="Em đã hoàn thành Cấp 2 và mở khóa 4 thẻ kiến thức: Cây quyết định · Gini · Độ sâu & quá khớp · AI giải thích được.",
  dev_h2="Từ trợ lý tư thế đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Thêm khoảng cách mắt–màn hình", "Khi học trên máy tính, dùng mô hình khuôn mặt (Dự án 4) để ước lượng khoảng cách mắt tới màn hình qua khoảng cách giữa hai mắt trên ảnh, rồi thêm làm đặc trưng mới cho cây.", "Xong khi", "cây nhắc đúng khi em ngồi gần màn hình dưới khoảng 40 cm."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Nhật ký tư thế cả tuần", "Lưu (trên máy) tỉ lệ thời gian mỗi tư thế theo từng buổi học, vẽ biểu đồ cả tuần và đặt mục tiêu cải thiện. Thêm nhắc nhở nhẹ nhàng sau 10 phút ngồi sai liên tục.", "Xong khi", "có biểu đồ 7 ngày và tỉ lệ \"Đúng tư thế\" tăng lên."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Cây quyết định hay mạng nơ-ron?", "So sánh cây quyết định với mạng nơ-ron nhỏ (Dự án 11) trên cùng dữ liệu tư thế của cả lớp: mô hình nào chính xác hơn, mô hình nào dễ giải thích hơn, mô hình nào công bằng hơn giữa các bạn cao và thấp.", "Đo kết quả", "độ chính xác chung và độ chính xác riêng theo từng nhóm chiều cao.")],
  cur="10 · Tư thế ngồi", next=[("11 · Đọc chữ số", "bắt đầu Cấp 3: mạng nơ-ron"), ("13 · Phân cụm màu sắc", "học không cần nhãn"), ("18 · Robot thoát mê cung", "máy tự học bằng thử sai")],
  khkt=[("Vấn đề", "Học sinh ngồi học sai tư thế lâu ngày gây cận thị và đau lưng."), ("Câu hỏi nghiên cứu", "Một trợ lý nhắc nhở bằng camera có giúp tăng thời gian ngồi đúng tư thế sau 2 tuần không?"), ("Giả thuyết", "Nhắc nhở nhẹ nhàng sau 10 phút ngồi sai làm tăng ít nhất 20% thời gian ngồi đúng."), ("Lưu ý đạo đức", "Xử lý trên máy, không lưu ảnh; người dùng tự xem dữ liệu của mình; có sự đồng ý của phụ huynh.")],
  prev=("09-dem-xe", "09"), nextp=("11-chu-so", "11"),
)
