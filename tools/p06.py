D = dict(
  out="du-an/06-thung-rac/index.html", num="06", level="2", title="Dự án 6 · Thùng rác thông minh",
  scripts=["trash-sim.js", "trash.js"],
  h1='Thùng rác <span class="hl-word">thông minh</span>',
  lead="Một băng chuyền đưa rác tới, AI nhìn ảnh rồi phân loại vào thùng nhựa, giấy, kim loại hay hữu cơ. Lần này em không viết luật: em sẽ tự huấn luyện mô hình, xem nó học từng vòng, và bắt quả tang khi nó học vẹt.",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf">
        <canvas id="stage" width="640" height="480" aria-label="Băng chuyền phân loại rác"></canvas>
        <video id="video" playsinline muted></video>
        <div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div>
        <div id="stageMsg" class="stage-msg" hidden></div>
      </div>
      <div class="toolbar">
        <div class="seg" role="group" aria-label="Nguồn hình ảnh">
          <button class="btn small" id="srcSim" aria-pressed="true"><i data-i="layers"></i>Băng chuyền ảo</button>
          <button class="btn small ghost" id="srcCam" aria-pressed="false"><i data-i="camera"></i>Camera</button>
        </div>
        <label class="tog"><input type="checkbox" id="unsure"><span>Hỏi lại khi không chắc</span></label>
      </div>
      <div class="panel-ctl"><label class="ctl"><span>Chắc chắn tối thiểu</span><b id="unsureThV"></b><input type="range" id="unsureTh" min="0.3" max="0.95" step="0.05"></label></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="result" id="bResult"><small>AI ĐOÁN</small>—</div>
      <div class="lbl" style="margin-top:14px">XÁC SUẤT TỪNG LOẠI</div>
      <div class="bars" id="bProbs"></div>
      <div class="metric-row">
        <div class="metric"><span>PHÂN LOẠI ĐÚNG</span><b id="bStats">0/0</b></div>
        <div class="metric"><span>ĐỘ CHÍNH XÁC KIỂM TRA</span><b id="bTest">—</b></div>
      </div>
      <div class="lbl" style="margin-top:14px">TRẠNG THÁI MÔ HÌNH</div>
      <div id="trainStatus" style="color:#fff"></div>
    </aside>
  </div>''',
  mission_h2="Tự tay huấn luyện một bộ phân loại ảnh, rồi kiểm tra xem nó học thật hay học vẹt",
  mission_q="Làm sao biết AI đã thật sự hiểu, hay chỉ thuộc lòng những bức ảnh đã xem?",
  mission_p="Em sẽ chia ảnh thành <b>tập học</b> và <b>tập kiểm tra</b>, theo dõi mô hình học từng vòng, rồi khám phá ba cái bẫy lớn của học máy: <b>quá khớp</b>, <b>học vẹt phông nền</b>, và gặp thứ <b>chưa từng thấy</b>.",
  minutes="50–60 phút",
  checklist=[("see", "Xem 28 đặc trưng mà máy rút ra từ một bức ảnh"), ("train", "Tự huấn luyện lại mô hình ít nhất 1 lần"), ("gap", "Tạo ra một mô hình học vẹt (học giỏi, kiểm tra kém)"), ("broke", "Làm AI phân loại sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ bức ảnh tới chiếc thùng: 6 bước",
  soi_p="Hình bên dưới dùng đúng món rác đang nằm trên băng chuyền ở phần Mồi.",
  theory=[
    dict(no="21", tag="Học máy", title="Tập học & tập kiểm tra",
      svg='<g><rect x="14" y="20" width="150" height="80" rx="10" class="f-vs"/><text x="89" y="66" text-anchor="middle" font-size="13" class="f-violet" font-weight="700">tập học 80%</text><rect x="172" y="20" width="74" height="80" rx="10" class="f-as"/><text x="209" y="58" text-anchor="middle" font-size="12" class="f-amber" font-weight="700">kiểm tra</text><text x="209" y="76" text-anchor="middle" font-size="11" class="f-amber">20%</text></g>',
      p="Ta chia dữ liệu làm hai: máy chỉ được <b>học</b> trên phần lớn, còn phần nhỏ được <b>giấu đi</b> để chấm điểm. Giống như đề kiểm tra không được trùng bài tập về nhà, có vậy mới biết máy hiểu thật hay chỉ thuộc lòng.",
      deep="Điểm trên tập học luôn đẹp hơn thực tế. Con số đáng tin là điểm trên <b>tập kiểm tra</b>, những ảnh máy chưa từng thấy. Trong nghiên cứu, người ta còn giữ thêm một tập thứ ba và chỉ mở ra đúng một lần cuối cùng."),
    dict(no="22", tag="Học máy", title="Học chuyển giao",
      svg='<rect x="14" y="30" width="120" height="60" rx="10" class="f-soft s-line"/><text x="74" y="56" text-anchor="middle" font-size="11" class="f-ink" font-weight="700">phần đã học sẵn</text><text x="74" y="74" text-anchor="middle" font-size="10" class="f-muted">(giữ nguyên)</text><path d="M138 60h24" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="168" y="36" width="78" height="48" rx="10" class="f-vs s-violet"/><text x="207" y="58" text-anchor="middle" font-size="11" class="f-violet" font-weight="700">lớp cuối</text><text x="207" y="74" text-anchor="middle" font-size="10" class="f-violet">(học mới)</text>',
      p="Các mô hình ảnh lớn đã học từ hàng triệu bức ảnh nên biết nhận ra màu, cạnh, hình dạng. Ta <b>giữ lại phần đó</b> và chỉ huấn luyện <b>lớp cuối</b> cho việc mới. Vì thế chỉ cần vài chục ảnh rác là đủ.",
      deep="Ở bản mô phỏng, bộ trích xuất 28 đặc trưng đóng vai \"phần đã học sẵn\". Thử chọn chế độ <b>Điểm ảnh thô</b> trong Bàn thí nghiệm (không có phần học sẵn): với ít ảnh, máy học kém hơn hẳn. Đó chính là giá trị của học chuyển giao."),
    dict(no="23", tag="Bản chất AI", cls="coral", title="Quá khớp (học vẹt)",
      svg='<path d="M20 100 C60 96 80 60 120 50 S200 40 240 36" fill="none" class="s-violet" stroke-width="3"/><path d="M20 100 C60 96 80 70 120 74 S200 92 240 98" fill="none" class="s-mint" stroke-width="3"/><text x="150" y="30" font-size="11" class="t-mono f-violet">điểm tập học</text><text x="150" y="112" font-size="11" class="t-mono f-mint">điểm kiểm tra</text>',
      p="Khi dữ liệu quá ít mà mô hình lại có quá nhiều \"núm vặn\", nó sẽ <b>thuộc lòng</b> từng ảnh, kể cả các chi tiết vô nghĩa. Điểm tập học lên tới 100%, nhưng điểm kiểm tra thì đứng yên hoặc tụt xuống.",
      deep="Cách chống quá khớp: thêm dữ liệu, dùng đặc trưng tốt (học chuyển giao), giảm số vòng học, hoặc dừng sớm khi đường kiểm tra bắt đầu đi xuống."),
    dict(no="24", tag="Dữ liệu", cls="amber", title="AI học \"đường tắt\"",
      svg='<rect x="20" y="22" width="76" height="76" rx="8" fill="#4f8a8b"/><rect x="48" y="38" width="20" height="44" rx="6" fill="#dff1f8"/><text x="120" y="50" font-size="12" class="t-mono f-ink">AI nghĩ:</text><text x="120" y="72" font-size="12" class="t-mono f-coral" font-weight="700">"nền xanh = nhựa"</text>',
      p="AI luôn tìm <b>cách dễ nhất</b> để đúng trên dữ liệu học. Nếu mọi ảnh nhựa đều chụp trên nền xanh, nó có thể học \"nền xanh là nhựa\" thay vì học hình dạng cái chai. Ra đời thực là sai ngay.",
      deep="Đây là lỗi có thật trong các hệ thống AI y tế, ví dụ mô hình học theo ký hiệu của từng bệnh viện trên phim X-quang thay vì học dấu hiệu bệnh. Cách phòng tránh: dữ liệu đa dạng và luôn kiểm tra xem AI đang \"nhìn\" vào đâu."),
  ],
  tulam_h2="Bàn thí nghiệm: tự huấn luyện mô hình phân loại rác",
  tulam_p="Chỉnh dữ liệu và cách học, bấm Huấn luyện, rồi quan sát hai đường trên biểu đồ: tím là điểm trên tập học, ngọc là điểm trên tập kiểm tra. Ảnh viền đỏ trong tập kiểm tra là ảnh máy đoán sai.",
  tulam='''
  <div class="card chart-card">
    <div class="chart-head"><b><i data-i="chart"></i> Quá trình học · độ chính xác (nét liền) và độ sai (nét đứt)</b><span class="legend"><i class="lg sm"></i>tập học <i class="lg" style="background:var(--mint)"></i>tập kiểm tra</span></div>
    <canvas id="chart" width="1100" height="240"></canvas>
  </div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Cài đặt huấn luyện</h3>
      <div class="lbl muted small" style="margin-bottom:6px">ĐẦU VÀO CỦA MÔ HÌNH</div>
      <div class="btn-row" id="modeBtns"><button class="btn small ghost" data-m="feat">28 đặc trưng có sẵn (học chuyển giao)</button><button class="btn small ghost" data-m="px">Điểm ảnh thô (432 số)</button></div>
      <label class="ctl" style="margin-top:14px"><span>Số ảnh học mỗi loại</span><b id="nTrainV"></b><input type="range" id="nTrain" min="2" max="40" step="1"></label>
      <label class="ctl"><span>Tốc độ học</span><b id="lrV"></b><input type="range" id="lr" min="0.005" max="0.3" step="0.005"></label>
      <label class="ctl"><span>Số vòng học</span><b id="epochsV"></b><input type="range" id="epochs" min="5" max="150" step="5"></label>
      <div class="btn-row" style="margin-top:8px"><button class="btn small accent" id="btnTrain"><i data-i="play"></i>Huấn luyện</button><button class="btn small ghost" id="btnNewSeed"><i data-i="reset"></i>Bộ ảnh khác</button></div>
      <h3 class="h-ic" style="margin-top:20px"><span class="ico-box sm coral"><i data-i="checkCircle"></i></span>Ma trận nhầm lẫn (tập kiểm tra)</h3>
      <div class="lab" id="confOut"></div>
      <p class="muted small" style="margin-top:6px">Hàng = loại thật, cột = máy đoán. Đường chéo xanh là đoán đúng, ô đỏ là nhầm lẫn.</p>
    </div>
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm mint"><i data-i="image"></i></span>Dữ liệu</h3>
      <div class="data-count" id="dataInfo"></div>
      <div class="lbl muted small">TẬP HỌC</div><div class="gallery" id="galTrain"></div>
      <div class="lbl muted small" style="margin-top:10px">TẬP KIỂM TRA <span style="color:var(--amber)">(viền vàng)</span> · đoán sai <span style="color:var(--coral)">(viền đỏ)</span></div><div class="gallery" id="galTest"></div>
      <div class="cam-only" hidden style="margin-top:14px">
        <div class="lbl muted small">ẢNH CỦA EM TỪ CAMERA</div>
        <div class="btn-row" id="capBtns"></div>
        <p class="small muted" id="ownInfo" style="margin:8px 0">Chưa có ảnh nào.</p>
        <button class="btn small accent" id="btnOwn"><i data-i="play"></i>Huấn luyện chỉ với ảnh của em</button>
      </div>
    </div>
  </div>
  <div class="two-col" style="margin-top:18px">
    <div class="card canvas-card">
      <h3 class="h-ic"><span class="ico-box sm amber"><i data-i="eye"></i></span>Máy đã học được gì? (trọng số lớp cuối)</h3>
      <canvas id="weights" width="680" height="200"></canvas>
      <p class="muted small" style="margin-top:8px"><b style="color:var(--coral)">Đỏ</b>: đặc trưng này làm máy nghĩ "đúng loại này". <b style="color:#548cff">Xanh</b>: làm máy nghĩ "không phải".</p>
    </div>
    <div class="card"><h3 class="h-ic"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của vòng huấn luyện</h3><pre class="code" id="genCode"></pre></div>
  </div>''',
  breaks_h2="Thử thách: ba cái bẫy lớn của học máy",
  breaks=[
    dict(icon="layers", key="overfit", title="Học vẹt vì quá ít ảnh", p="Chỉ <b>3 ảnh mỗi loại</b>, học thẳng trên <b>điểm ảnh thô</b>, 120 vòng. Xem hai đường trên biểu đồ tách nhau ra.",
      why="Với 432 \"núm vặn\" mà chỉ có 12 ảnh, máy dễ dàng thuộc lòng cả 12 ảnh (tập học 100%) nhưng không hiểu gì về rác (tập kiểm tra thấp). Cách sửa: chuyển sang <b>28 đặc trưng có sẵn</b>, hoặc tăng số ảnh học."),
    dict(icon="image", key="bias", title="Học vẹt phông nền", p="Trong tập học, mỗi loại rác luôn được chụp trên <b>một nền riêng</b> (nhựa trên gạch xanh, giấy trên nền trắng…). Tập kiểm tra thì chụp trên nền ngẫu nhiên.",
      why="Xem bản đồ trọng số: máy dựa nhiều vào <b>màu nền</b> thay vì hình dạng vật. Điểm tập học rất cao nhưng điểm kiểm tra tụt hẳn. Cách sửa: chụp mỗi loại trên nhiều nền khác nhau."),
    dict(icon="alert", key="pin", title="Rác lạ: cục pin", p="Băng chuyền bắt đầu có <b>pin</b>, loại rác nguy hại mà máy chưa từng học. Máy vẫn tự tin bỏ pin vào một thùng nào đó!",
      why="Máy chỉ biết chọn trong 4 loại đã học. Bật <b>\"Hỏi lại khi không chắc\"</b> ở phần Mồi: khi xác suất cao nhất thấp hơn ngưỡng, rác được chuyển sang ô \"Hỏi người lớn\". Lưu ý là cách này không bắt được mọi trường hợp, vì máy đôi khi vẫn <i>tự tin mà sai</i>."),
  ],
  fix="Về cài đặt chuẩn",
  real_h2="Phân loại ảnh đang được dùng ở đâu?",
  real=[("layers", "", "Nhà máy tái chế", "Camera và AI trên băng chuyền nhận ra từng loại vật liệu, rồi dùng luồng khí thổi chúng sang đúng làn."),
        ("camera", "mint", "Ứng dụng hỏi đáp rác", "Chụp ảnh một món đồ, ứng dụng gợi ý nên bỏ vào thùng nào theo quy định của địa phương."),
        ("checkCircle", "amber", "Kiểm tra chất lượng", "Nhà máy dùng AI để soi sản phẩm lỗi trên dây chuyền: vết nứt, sai màu, thiếu linh kiện.")],
  ethics=["Nếu AI bỏ nhầm pin vào thùng tái chế và gây cháy, ai chịu trách nhiệm: người làm AI, người dùng, hay nhà máy?",
          "Bao bì ở Việt Nam khác với ở nước khác. Một mô hình học từ ảnh nước ngoài có dùng tốt ở trường em không? Làm sao kiểm tra?",
          "Có nên để AI tự quyết hoàn toàn, hay luôn cần một người kiểm tra những ca máy không chắc chắn?"],
  badge="Nhà Huấn Luyện Tỉnh Táo", badge_p="Em đã mở khóa 4 thẻ kiến thức: Tập học & tập kiểm tra · Học chuyển giao · Quá khớp · AI học đường tắt.",
  dev_h2="Từ thùng rác ảo đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Thêm loại \"Thủy tinh\"", "Chụp 20–30 ảnh chai lọ thủy tinh bằng camera, thêm làm loại thứ 5 và xem ma trận nhầm lẫn: thủy tinh hay bị nhầm với nhựa không? Vì sao?", "Xong khi", "độ chính xác kiểm tra với 5 loại đạt trên 80%."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Thùng rác thật tự mở nắp", "Gửi kết quả phân loại từ trình duyệt sang micro:bit hoặc Arduino (qua cổng USB), điều khiển động cơ servo mở đúng nắp thùng.", "Xong khi", "phân loại đúng 8/10 món rác thật trong lớp."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Bộ dữ liệu ảnh rác Việt Nam", "Thu thập ảnh rác thật ở trường (bao bì, ly nhựa, hộp xốp…) trên nhiều phông nền và ánh sáng. So sánh mô hình học từ dữ liệu nước ngoài với dữ liệu tự thu thập.", "Đo kết quả", "độ chính xác trên tập kiểm tra chụp ở các điểm thu gom rác thật của trường.")],
  cur="06 · Thùng rác", next=[("08 · Nhận diện âm thanh", "phân loại cả âm thanh"), ("11 · Đọc chữ số", "mạng nhiều lớp"), ("14 · Bác sĩ lá cây", "mạng tự học đặc trưng")],
  khkt=[("Vấn đề", "Rác ở trường thường bị bỏ lẫn lộn, khiến việc tái chế khó khăn."), ("Câu hỏi nghiên cứu", "Cần tối thiểu bao nhiêu ảnh mỗi loại để AI phân loại rác ở trường đạt độ chính xác 90%?"), ("Giả thuyết", "Học chuyển giao với ảnh chụp trên nhiều nền khác nhau cần ít ảnh hơn hẳn so với học từ đầu."), ("Lưu ý đạo đức", "Không chụp người trong ảnh; luôn có người kiểm tra rác nguy hại.")],
  prev=("05-vu-cong", "05"), nextp=("07-diem-thi", "07"),
)
