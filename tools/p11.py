D = dict(
  out="du-an/11-chu-so/index.html", num="11", level="3", title="Dự án 11 · Đọc chữ số viết tay",
  scripts=["digit-gen.js", "digits.js"],
  h1='Đọc <span class="hl-word">chữ số viết tay</span>',
  lead="Vẽ một chữ số bằng chuột hoặc ngón tay, và xem bộ não nhân tạo đọc nó: 256 ô ảnh chảy qua các nơ-ron, từng nơ-ron sáng lên, rồi 10 đầu ra \"bỏ phiếu\". Lần đầu tiên, em mở hẳn một mạng nơ-ron ra để xem bên trong!",
  moi='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Bảng vẽ chữ số và sơ đồ mạng nơ-ron"></canvas><div class="stage-tag"><span class="live-dot"></span><span>MẠNG NƠ-RON</span></div></div>
      <div class="toolbar">
        <div class="seg"><button class="btn small ghost" id="btnClear"><i data-i="reset"></i>Xóa bảng</button><button class="btn small" id="btnDemo" aria-pressed="true"><i data-i="play"></i>Máy tự viết mẫu</button></div>
        <span class="muted small"><i data-i="bulb"></i> Bấm vào chấm tròn ở cột giữa để chọn nơ-ron</span>
      </div>
      <div class="game"><span class="small muted">Dạy thêm: chữ em vừa vẽ là số</span><div class="btn-row" id="labelBtns"></div></div>
      <p class="small muted" id="ownInfo" style="margin:8px 0 0"></p>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="result" id="bResult"><small>AI ĐỌC ĐƯỢC</small>—</div>
      <div class="lbl" style="margin-top:12px">XÁC SUẤT 10 ĐẦU RA</div>
      <div class="bars" id="bProbs"></div>
      <div class="metric-row"><div class="metric"><span>ĐỘ CHÍNH XÁC KIỂM TRA</span><b id="bTest">—</b></div><div class="metric"><span>SỐ TRỌNG SỐ</span><b id="nParams">—</b></div></div>
      <div class="lbl" style="margin-top:12px">TRẠNG THÁI</div><div id="trainStatus" style="color:#fff"></div>
    </aside>
  </div>''',
  mission_h2="Mở một mạng nơ-ron ra và xem nó tự học cách đọc chữ",
  mission_q="Không ai viết luật \"số 8 có hai vòng tròn\". Vậy làm sao mạng nơ-ron biết?",
  mission_p="Em sẽ xem từng <b>nơ-ron</b> tính toán, hiểu vì sao cần <b>hàm kích hoạt</b>, và thấy các nơ-ron ẩn <b>tự học</b> ra những nét đặc trưng. Cuối cùng là <b>lan truyền ngược</b>: cách cả mạng học từ sai lầm của mình.",
  minutes="60–75 phút",
  checklist=[("draw", "Tự vẽ ít nhất 3 chữ số và xem AI đọc"), ("neuron", "Xem bên trong một nơ-ron"), ("train", "Huấn luyện lại mạng với số nơ-ron khác"), ("broke", "Làm mạng đọc sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ nét vẽ tới con số: 6 bước bên trong mạng nơ-ron",
  soi_p="Hình bên dưới dùng đúng chữ số đang có trên bảng vẽ ở phần Mồi.",
  theory=[
    dict(no="41", tag="Mạng nơ-ron", title="Nơ-ron nhân tạo",
      svg='<g class="f-mint"><circle cx="30" cy="30" r="8"/><circle cx="30" cy="60" r="8"/><circle cx="30" cy="90" r="8"/></g><g class="s-line" stroke-width="2"><path d="M38 30 118 60M38 60 118 60M38 90 118 60"/></g><text x="64" y="34" font-size="10" class="t-mono f-coral">w₁</text><text x="64" y="56" font-size="10" class="t-mono f-coral">w₂</text><text x="64" y="86" font-size="10" class="t-mono f-coral">w₃</text><circle cx="134" cy="60" r="18" class="f-violet"/><text x="134" y="65" text-anchor="middle" font-size="14" fill="#fff">Σ</text><path d="M152 60h30" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><text x="190" y="64" font-size="11" class="t-mono f-ink">f(Σ)</text>',
      p="Một nơ-ron nhận nhiều số đầu vào, nhân mỗi số với một <b>trọng số</b> (độ quan trọng), cộng lại, rồi cho qua một hàm. Đơn giản vậy thôi! Sức mạnh đến từ việc ghép <b>rất nhiều</b> nơ-ron lại với nhau.",
      deep="Ý tưởng này lấy cảm hứng từ tế bào thần kinh, nhưng nơ-ron nhân tạo đơn giản hơn rất nhiều. Mạng trong dự án này có vài nghìn trọng số; các mô hình ngôn ngữ lớn có tới hàng trăm tỉ."),
    dict(no="42", tag="Toán + AI", title="Hàm kích hoạt",
      svg='<path d="M20 90H240M130 20v90" class="s-line" stroke-width="1"/><path d="M20 90 130 90 230 24" fill="none" class="s-violet" stroke-width="3"/><text x="150" y="104" font-size="11" class="t-mono f-violet">ReLU(z) = max(0, z)</text><text x="24" y="80" font-size="10" class="t-mono f-muted">âm → tắt</text><text x="180" y="60" font-size="10" class="t-mono f-muted">dương → sáng</text>',
      p="Sau khi cộng, nơ-ron quyết định có \"sáng\" hay không. <b>ReLU</b> giữ số dương và biến số âm thành 0. Nếu bỏ bước này, nhiều lớp nơ-ron ghép lại cũng chỉ bằng một phép tính thẳng, không học được điều phức tạp.",
      deep="Sigmoid (hình chữ S) từng rất phổ biến nhưng học chậm khi mạng sâu. ReLU đơn giản hơn và giúp mạng sâu học tốt, nên trở thành lựa chọn mặc định. Em có thể đổi hàm kích hoạt trong Bàn thí nghiệm để so sánh."),
    dict(no="43", tag="Học máy", cls="coral", title="Đặc trưng tự học",
      svg='<g><rect x="20" y="30" width="56" height="56" rx="6" class="f-soft"/><path d="M36 46a12 12 0 1 0 24 0a12 12 0 1 0-24 0" fill="none" stroke="#ff7d5f" stroke-width="5"/></g><g><rect x="100" y="30" width="56" height="56" rx="6" class="f-soft"/><path d="M140 36v44" stroke="#ff7d5f" stroke-width="5"/></g><g><rect x="180" y="30" width="56" height="56" rx="6" class="f-soft"/><path d="M188 76h40" stroke="#ff7d5f" stroke-width="5"/></g><text x="22" y="106" font-size="10" class="t-mono f-muted">vòng trên · nét dọc · nét ngang</text>',
      p="Ở Dự án 2 và 6, <b>con người</b> chọn đặc trưng. Ở đây, mỗi nơ-ron ẩn <b>tự học</b> ra một mẫu nét có ích, như vòng tròn phía trên hay nét dọc bên phải. Lớp sau ghép các nét đó lại để nhận ra chữ số.",
      deep="Mạng càng nhiều lớp thì đặc trưng càng trừu tượng: lớp đầu thấy nét, lớp sau thấy hình, lớp sau nữa thấy vật. Đây là lý do có tên \"học sâu\" (deep learning)."),
    dict(no="44", tag="Thuật toán", cls="amber", title="Lan truyền ngược",
      svg='<g class="f-violet"><circle cx="40" cy="60" r="12"/><circle cx="130" cy="40" r="12"/><circle cx="130" cy="80" r="12"/><circle cx="220" cy="60" r="12"/></g><g class="s-line" stroke-width="1.5"><path d="M52 60 118 40M52 60 118 80M142 40 208 60M142 80 208 60"/></g><path d="M208 72 150 92" class="s-coral" stroke-width="2.5" marker-end="url(#arC)"/><path d="M118 92 58 74" class="s-coral" stroke-width="2.5" marker-end="url(#arC)"/><text x="150" y="112" font-size="10" class="t-mono f-coral">sai số chảy ngược</text>',
      p="Khi mạng đoán sai, ta đo <b>sai số</b> ở đầu ra rồi truyền nó <b>ngược</b> về từng lớp để biết mỗi trọng số đã góp bao nhiêu vào cái sai. Mỗi trọng số được chỉnh một chút theo hướng làm sai số nhỏ đi.",
      deep="Toán học đằng sau là <b>quy tắc đạo hàm của hàm hợp</b> (chain rule). Lan truyền ngược cộng với gradient descent (Dự án 7) là cách gần như mọi mạng nơ-ron hiện đại được huấn luyện."),
  ],
  tulam_h2="Bàn thí nghiệm: xây và huấn luyện bộ não của em",
  tulam_p="Chọn số nơ-ron, hàm kích hoạt, tốc độ học, rồi bấm Huấn luyện. Bên dưới là \"mẫu nét\" mà từng nơ-ron ẩn tự học được: đỏ là thích, xanh là ghét.",
  tulam='''
  <div class="card chart-card"><div class="chart-head"><b><i data-i="chart"></i> Độ chính xác qua từng vòng học</b><span class="legend"><i class="lg sm"></i>tập học <i class="lg" style="background:var(--mint)"></i>tập kiểm tra</span></div><canvas id="chart" width="1100" height="220"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Kiến trúc & cách học</h3>
      <label class="ctl"><span>Số nơ-ron lớp ẩn</span><b id="HV"></b><input type="range" id="H" min="2" max="64" step="1"></label>
      <div class="lbl muted small" style="margin:6px 0">HÀM KÍCH HOẠT</div>
      <div class="btn-row" id="actBtns"><button class="btn small ghost" data-a="relu">ReLU</button><button class="btn small ghost" data-a="sigmoid">Sigmoid</button><button class="btn small ghost" data-a="linear">Không có</button></div>
      <label class="ctl" style="margin-top:12px"><span>Tốc độ học</span><b id="lrV"></b><input type="range" id="lr" min="0.005" max="3" step="0.005"></label>
      <label class="ctl"><span>Số vòng học</span><b id="epochsV"></b><input type="range" id="epochs" min="1" max="40" step="1"></label>
      <label class="tog" style="display:inline-block;margin:6px 0 10px"><input type="checkbox" id="norm"><span>Căn giữa & phóng vừa chữ số</span></label>
      <div><button class="btn small accent" id="btnTrain"><i data-i="play"></i>Huấn luyện</button></div>
      <h3 class="h-ic" style="margin-top:18px"><span class="ico-box sm coral"><i data-i="checkCircle"></i></span>Ma trận nhầm lẫn (200 chữ số kiểm tra)</h3>
      <div class="lab" id="confOut"></div>
    </div>
    <div class="card canvas-card">
      <h3 class="h-ic"><span class="ico-box sm amber"><i data-i="eye"></i></span>Mẫu nét mỗi nơ-ron ẩn đã tự học</h3>
      <canvas id="weights" width="680" height="350"></canvas>
      <h3 class="h-ic" style="margin-top:14px"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của mạng</h3><pre class="code" id="genCode"></pre>
    </div>
  </div>''',
  breaks_h2="Thử thách: hãy làm mạng nơ-ron đọc sai!",
  breaks=[
    dict(icon="cpu", key="tiny", title="Bộ não tí hon", p="Lớp ẩn chỉ còn <b>2 nơ-ron</b>. Liệu 2 nơ-ron có đủ để phân biệt 10 chữ số?",
      why="Hai nơ-ron chỉ học được hai \"mẫu nét\", quá ít để phân biệt 10 chữ số. Xem độ chính xác và ma trận nhầm lẫn. Tăng lên 16–32 nơ-ron. Nhưng nhiều quá cũng không tốt: tốn thời gian và dễ quá khớp (Dự án 6)."),
    dict(icon="bolt", key="lr", title="Tốc độ học quá lớn", p="Tốc độ học tăng vọt lên <b>2,5</b>. Mỗi lần học, các trọng số bị đẩy đi quá xa.",
      why="Giống viên bi ở Dự án 7, các trọng số nhảy lung tung và không bao giờ ổn định, thậm chí nhiều nơ-ron \"chết\" (luôn ra 0 với ReLU). Giảm tốc độ học xuống khoảng 0,05."),
    dict(icon="crosshair", key="small", title="Chữ nhỏ trong góc", p="Máy viết mẫu bắt đầu viết chữ <b>rất nhỏ ở góc</b> bảng, và bước <b>căn giữa</b> bị tắt.",
      why="Mạng chỉ từng thấy chữ số to và ở giữa, nên chữ nhỏ ở góc trông như một thứ hoàn toàn khác. Bật <b>Căn giữa & phóng vừa</b> rồi huấn luyện lại. Mạng tích chập ở Dự án 14 giải quyết vấn đề này theo cách thông minh hơn."),
  ],
  real_h2="Mạng nơ-ron đọc chữ đang được dùng ở đâu?",
  real=[("send", "", "Phân loại thư", "Bưu điện dùng máy đọc mã bưu chính viết tay trên phong bì từ nhiều chục năm nay; đây là một trong những ứng dụng đầu tiên của mạng nơ-ron."),
        ("camera", "mint", "Quét chữ bằng điện thoại", "Ứng dụng chụp ảnh và chuyển chữ in hoặc chữ viết tay thành văn bản, kể cả tiếng Việt có dấu."),
        ("checkCircle", "amber", "Chấm bài trắc nghiệm", "Máy quét phiếu trả lời trắc nghiệm, đọc số báo danh và mã đề viết tay của thí sinh.")],
  ethics=["Nếu máy chấm thi đọc nhầm số báo danh của một bạn, ai chịu trách nhiệm? Làm sao để phát hiện lỗi?",
          "Máy học từ chữ viết của học sinh thành phố có đọc tốt chữ của người lớn tuổi, hay chữ viết bằng tay trái không?",
          "Mạng nơ-ron có hàng nghìn trọng số, khó giải thích hơn cây quyết định (Dự án 10). Khi nào ta chấp nhận dùng một mô hình khó giải thích?"],
  badge="Kỹ Sư Nơ-ron", badge_p="Em đã mở khóa 4 thẻ kiến thức: Nơ-ron nhân tạo · Hàm kích hoạt · Đặc trưng tự học · Lan truyền ngược.",
  dev_h2="Từ đọc chữ số đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Thêm chữ cái và dấu", "Thêm các lớp mới như +, −, × hoặc vài chữ cái. Mỗi lớp vẽ 20–30 mẫu bằng tay của cả nhóm và tăng số đầu ra của mạng.", "Xong khi", "đọc đúng trên 80% với mẫu của bạn ngoài nhóm."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Máy tính bỏ túi viết tay", "Cắt dòng chữ thành từng ký tự (tách theo cột trống), đọc từng ký tự rồi tính kết quả, ví dụ \"12+7\" thành 19.", "Xong khi", "giải đúng 8/10 phép tính viết tay."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Đọc chữ viết tay tiếng Việt có dấu", "Xây bộ dữ liệu chữ cái tiếng Việt viết tay của học sinh. Nghiên cứu cách tách và nhận dạng riêng phần dấu (sắc, huyền, hỏi, ngã, nặng) với phần chữ.", "Đo kết quả", "độ chính xác theo từng loại dấu, so sánh giữa nhận dạng gộp và nhận dạng tách riêng.")],
  cur="11 · Chữ số", next=[("12 · Phông nền ảo", "phân loại từng điểm ảnh"), ("14 · Bác sĩ lá cây", "mạng tích chập"), ("16 · Đoán chữ tiếp theo", "mạng cho ngôn ngữ")],
  khkt=[("Vấn đề", "Chữ viết tay tiếng Việt có dấu khó nhận dạng hơn chữ tiếng Anh."), ("Câu hỏi nghiên cứu", "Tách nhận dạng dấu riêng có cải thiện độ chính xác so với nhận dạng cả chữ không?"), ("Giả thuyết", "Tách dấu giúp tăng độ chính xác với các chữ cùng gốc như a, á, à, ả, ã, ạ."), ("Lưu ý đạo đức", "Thu thập chữ viết có sự đồng ý; không ghi tên người viết vào dữ liệu.")],
  prev=("10-tu-the-ngoi", "10"), nextp=("12-phong-nen", "12"),
)
