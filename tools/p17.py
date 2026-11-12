D = dict(
  out="du-an/17-cam-xuc/index.html", num="17", level="4", title="Dự án 17 · Cảm xúc câu nói",
  scripts=["emb.js"],
  h1='Cảm xúc <span class="hl-word">câu nói</span>',
  lead="Máy tính chỉ hiểu con số. Vậy làm sao nó biết \"tuyệt vời\" là vui còn \"thất vọng\" là buồn? Bí quyết là biến mỗi từ thành một dãy số, sao cho từ gần nghĩa nằm gần nhau trên một tấm bản đồ. Gõ một câu và xem nó \"rơi\" vào đâu trên bản đồ cảm xúc.",
  moi='''
  <style>.sent-in{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--line-strong);background:var(--surface-solid);color:var(--text);font:inherit;font-size:1.05rem;margin-bottom:10px}
  .chips{min-height:44px;margin-bottom:10px;line-height:2.1}.tk{display:inline-block;padding:0 8px;margin:0 3px 4px 0;border-radius:7px;color:#11142e;font-weight:600}.tk.oov{background:var(--line-strong);color:var(--muted);text-decoration:line-through dotted}.tk.ng{background:var(--amber)}
  .gauge{height:16px;border-radius:8px;background:#232866;overflow:hidden;margin:8px 0}.gauge i{display:block;height:100%;border-radius:8px;transition:width .25s}
  .ana{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:10px}.ana select{min-width:0;flex:1;padding:6px 8px;border-radius:8px;border:1px solid var(--line-strong);background:var(--surface-solid);color:var(--text);font:inherit}.ana b{font-size:1.2rem}</style>
  <div class="playground">
    <div class="stage-col">
      <input class="sent-in" id="sentIn" aria-label="Câu của em" placeholder="Gõ một câu, ví dụ: trà sữa ở quán này ngon tuyệt vời">
      <div class="chips" id="chips" aria-live="polite"></div>
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Bản đồ từ: mỗi chấm là một từ"></canvas><div class="stage-tag"><span class="live-dot"></span><span>BẢN ĐỒ TỪ</span></div></div>
      <div class="toolbar"><div class="seg" id="mapBtns"><button class="btn small" data-m="pca"><i data-i="map"></i>Bản đồ nghĩa</button><button class="btn small ghost" data-m="sent"><i data-i="activity"></i>Trục cảm xúc</button></div><span class="muted small"><i data-i="bulb"></i> Chạm vào một từ để xem từ gần nghĩa</span></div>
      <div class="game"><span class="small muted">Thử câu</span><div class="btn-row" id="preBtns"></div></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="result"><small>CẢM XÚC CỦA CÂU</small><span id="bLabel">—</span></div>
      <div class="gauge"><i id="gaugeFill"></i></div><div style="display:flex;justify-content:space-between;font-size:.75rem;color:#c3c7f0"><span>tiêu cực</span><b id="bScore" style="color:#fff">—</b><span>tích cực</span></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>TỪ MÁY CHƯA BIẾT</span><b id="bOov">0</b></div><div class="metric"><span>SỐ TỪ TRONG TỪ ĐIỂN</span><b id="bVoc">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>ĐÚNG VỚI TỪ CHƯA HỌC NHÃN</span><b id="bTest">—</b></div><div class="metric"><span>CÁCH TÍNH CÂU</span><b style="font-size:.9rem">trung bình</b></div></div>
      <div class="lbl" style="margin-top:12px">TỪ GẦN NGHĨA</div><div id="bNb" class="small" style="color:#c3c7f0;line-height:1.7"></div>
    </aside>
  </div>''',
  mission_h2="Biến từ thành vector và vẽ bản đồ nghĩa",
  mission_q="Không ai dạy máy \"hạnh phúc\" là từ vui. Vậy sao máy vẫn đoán đúng?",
  mission_p="Em sẽ thấy máy học <b>vector của từ</b> chỉ bằng cách đếm <b>từ nào hay đứng cạnh từ nào</b>, nhìn các từ tự xếp thành nhóm trên <b>bản đồ</b>, làm <b>phép tính với từ</b>, rồi tìm ra chỗ yếu: phủ định, từ lạ, và định kiến học từ dữ liệu.",
  minutes="45–60 phút",
  checklist=[("try", "Thử chấm cảm xúc ít nhất 3 câu"), ("map", "Chạm vào một từ trên bản đồ"), ("soi", "Soi tới bước Nghĩa từ hàng xóm"), ("math", "Làm một phép tính với từ"), ("broke", "Làm máy chấm sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ câu nói tới điểm cảm xúc: 6 bước",
  soi_p="Hình bên dưới dùng đúng câu em đang gõ ở phần Mồi.",
  theory=[
    dict(no="65", tag="Ngôn ngữ", title="Vector của từ",
      svg='<g font-size="12" class="f-ink"><text x="14" y="40">vui</text><text x="14" y="76">hạnh phúc</text><text x="14" y="112">buồn</text></g><g><rect x="90" y="28" width="30" height="18" class="f-mint"/><rect x="122" y="28" width="30" height="18" class="f-coral" opacity=".4"/><rect x="154" y="28" width="30" height="18" class="f-mint" opacity=".6"/><rect x="90" y="64" width="30" height="18" class="f-mint" opacity=".9"/><rect x="122" y="64" width="30" height="18" class="f-coral" opacity=".3"/><rect x="154" y="64" width="30" height="18" class="f-mint" opacity=".5"/><rect x="90" y="100" width="30" height="18" class="f-coral"/><rect x="122" y="100" width="30" height="18" class="f-mint" opacity=".4"/><rect x="154" y="100" width="30" height="18" class="f-coral" opacity=".6"/></g>',
      p="Mỗi từ được đổi thành một <b>vector</b>: một dãy số. Từ gần nghĩa có dãy số gần nhau. Nhờ vậy máy đo được độ giống nhau về nghĩa, giống như đo khoảng cách giữa hai điểm.",
      deep="Các mô hình thật dùng vector vài trăm tới vài nghìn chiều. Trong chatbot, mỗi token cũng có một vector như vậy ở lớp đầu tiên của mạng."),
    dict(no="66", tag="Học máy", cls="amber", title="Nghĩa từ hàng xóm",
      svg='<g font-size="12"><text x="10" y="40" class="f-muted">em</text><text x="40" y="40" class="f-mint">mỉm cười</text><text x="104" y="40" class="f-muted">vì phở</text><text x="150" y="40" class="f-ink" font-weight="700">ngon</text><text x="10" y="90" class="f-muted">em</text><text x="40" y="90" class="f-mint">mỉm cười</text><text x="104" y="90" class="f-muted">vì kem</text><text x="150" y="90" class="f-ink" font-weight="700">tuyệt</text></g><path d="M170 46v28" class="s-violet" stroke-width="2" stroke-dasharray="4 3"/><text x="180" y="66" font-size="10" class="t-mono f-violet">gần nghĩa</text>',
      p="Máy biết nghĩa của một từ qua <b>những từ đứng cạnh nó</b>. Đếm số lần mỗi cặp từ đứng gần nhau, rồi nén bảng đếm khổng lồ thành vector ngắn: từ có hàng xóm giống nhau sẽ có vector giống nhau.",
      deep="Đây gọi là <b>giả thuyết phân bố</b>. Cách nén ở đây là PPMI và phân tích ma trận (SVD); các phương pháp nổi tiếng khác là word2vec và GloVe."),
    dict(no="67", tag="Toán + AI", cls="coral", title="Phép tính với từ",
      svg='<g class="f-violet"><circle cx="40" cy="90" r="6"/><circle cx="40" cy="40" r="6"/></g><g class="f-mint"><circle cx="190" cy="96" r="6"/><circle cx="190" cy="46" r="6"/></g><path d="M40 84V48M190 90V54" class="s-coral" stroke-width="2.5" marker-end="url(#arC)"/><g font-size="11" class="f-ink"><text x="50" y="94">bà</text><text x="50" y="44">ông</text><text x="200" y="100">mẹ</text><text x="200" y="50">bố ?</text></g>',
      p="Hướng đi từ \"bà\" tới \"ông\" (nữ → nam) gần giống hướng từ \"mẹ\" tới \"bố\". Vì vậy <b>ông − bà + mẹ ≈ bố</b>. Quan hệ về nghĩa trở thành <b>hướng</b> trong không gian vector.",
      deep="Phép tính này không phải lúc nào cũng đúng, nhất là với dữ liệu ít. Nó cho thấy vector chứa nhiều \"trục nghĩa\" mà không ai dạy trực tiếp: giới tính, tuổi tác, cảm xúc…"),
    dict(no="68", tag="Đạo đức", cls="mint", title="Định kiến trong vector",
      svg='<path d="M20 64h220" class="s-line" stroke-width="2"/><text x="14" y="56" font-size="10" class="t-mono f-violet">nam</text><text x="214" y="56" font-size="10" class="t-mono f-coral">nữ</text><circle cx="70" cy="64" r="8" class="f-violet"/><text x="54" y="92" font-size="11" class="f-ink">bác sĩ</text><circle cx="190" cy="64" r="8" class="f-coral"/><text x="178" y="92" font-size="11" class="f-ink">y tá</text>',
      p="Vector học từ cách con người viết. Nếu dữ liệu toàn viết \"bác sĩ ấy là người đàn ông\", thì vector \"bác sĩ\" sẽ <b>lệch về phía nam</b>, và mọi ứng dụng dùng vector đó mang theo <b>định kiến</b> này.",
      deep="Đã có hệ thống tuyển dụng tự động bị phát hiện chấm thấp hồ sơ của phụ nữ vì học từ dữ liệu cũ. Cách giảm: cân bằng dữ liệu, đo độ lệch như ở Bàn thí nghiệm, và luôn có con người kiểm tra."),
  ],
  tulam_h2="Bàn thí nghiệm: phép tính với từ, đo định kiến, chỉnh cách học",
  tulam_p="Thay đổi số chiều hoặc cửa sổ làm máy học lại toàn bộ vector (mất chưa tới 1 giây). Xem bản đồ ở phần Mồi thay đổi theo.",
  tulam='''
  <div class="card chart-card"><div class="chart-head"><b><i data-i="activity"></i> Cảm xúc thay đổi khi đọc từng từ của câu</b></div><canvas id="chart" width="1100" height="220"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sparkle"></i></span>Phép tính với từ</h3>
      <div class="ana"><select id="selA" aria-label="Từ A"></select><b>−</b><select id="selB" aria-label="Từ B"></select><b>+</b><select id="selC" aria-label="Từ C"></select><b>≈</b></div>
      <div class="lab bars" id="anaOut"></div>
      <div class="btn-row" id="anaBtns" style="margin-top:8px"><button class="btn small ghost" data-q="ông,bà,mẹ">ông − bà + mẹ</button><button class="btn small ghost" data-q="anh_trai,chị_gái,em_gái">anh trai − chị gái + em gái</button><button class="btn small ghost" data-q="bố,mẹ,bà">bố − mẹ + bà</button></div>
      <h3 class="h-ic" style="margin-top:18px"><span class="ico-box sm coral"><i data-i="shield"></i></span>Đo độ lệch giới của nghề nghiệp</h3>
      <div class="lab bars" id="biasOut"></div>
      <label class="tog" style="display:block;margin:8px 0"><input type="checkbox" id="balance"><span>Dữ liệu cân bằng nam / nữ cho mọi nghề</span></label>
    </div>
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm amber"><i data-i="sliders"></i></span>Cách học vector</h3>
      <label class="ctl"><span>Số chiều của vector</span><b id="dimV"></b><input type="range" id="dim" min="2" max="16" step="1"></label>
      <label class="ctl"><span>Cửa sổ hàng xóm</span><b id="winV"></b><input type="range" id="win" min="1" max="4" step="1"></label>
      <label class="tog" style="display:block;margin:8px 0"><input type="checkbox" id="neg"><span>Hiểu chữ \"không\": đảo nghĩa từ đứng sau</span></label>
      <button class="btn small ghost" id="btnTeach"><i data-i="book"></i>Dạy từ mới \"xịn\"</button><p class="small muted" id="teachInfo"></p>
      <h3 class="h-ic" style="margin-top:14px"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật</h3><pre class="code" id="genCode"></pre>
    </div>
  </div>''',
  breaks_h2="Thử thách: hãy làm máy hiểu sai cảm xúc!",
  breaks=[
    dict(icon="repeat", key="neg", title="Chữ \"không\"", p="Câu: <b>\"bài kiểm tra hôm nay không vui chút nào\"</b>.",
      why="Máy lấy trung bình vector các từ, nên chữ \"vui\" vẫn kéo câu về phía tích cực; chữ \"không\" thậm chí không có trong từ điển. Bật <b>Hiểu chữ \"không\"</b>: từ đứng sau bị đảo dấu. Đây là cách vá tạm; mô hình hiện đại đọc cả câu theo thứ tự nên hiểu phủ định tốt hơn."),
    dict(icon="help", key="oov", title="Từ lóng mới", p="Câu: <b>\"trà sữa quán này xịn quá\"</b>. Máy chưa từng gặp chữ \"xịn\".",
      why="Từ lạ bị bỏ qua (gạch ngang), nên câu chỉ còn \"trà sữa\" trung tính. Bấm <b>Dạy từ mới \"xịn\"</b>: máy đọc thêm vài câu có \"xịn\" đứng cạnh \"mỉm cười\", \"vỗ tay\", và tự xếp \"xịn\" vào nhóm từ vui. Không ai dán nhãn cho \"xịn\" cả!"),
    dict(icon="shield", key="bias", title="Dữ liệu thiên lệch", p="Kho câu học gần như luôn viết bác sĩ, kỹ sư, đầu bếp là <b>người đàn ông</b>, còn y tá, giáo viên là <b>người phụ nữ</b>.",
      why="Xem bảng <b>Đo độ lệch giới</b> ở Bàn thí nghiệm: các nghề bị kéo hẳn về một phía. Máy không \"nghĩ\" vậy, nó chỉ phản chiếu dữ liệu. Bật <b>Dữ liệu cân bằng</b> để thấy độ lệch biến mất. Ngoài đời, dữ liệu thật thường có định kiến khó phát hiện hơn nhiều."),
  ],
  real_h2="Vector từ và phân tích cảm xúc được dùng ở đâu?",
  real=[("msg", "", "Đọc bình luận", "Cửa hàng, nhà hàng, ứng dụng dùng máy đọc hàng nghìn bình luận để biết khách hài lòng hay không."),
        ("scan", "mint", "Tìm kiếm theo nghĩa", "Gõ \"giày chạy bộ\" vẫn tìm được \"giày thể thao\": máy so vector, không chỉ so từng chữ."),
        ("shield", "amber", "Lọc bình luận độc hại", "Mạng xã hội dùng mô hình ngôn ngữ để phát hiện lời lẽ xúc phạm, bắt nạt trên mạng.")],
  ethics=["Mỉa mai như \"Hay quá, lại mất điện!\" làm máy hiểu sai. Nếu máy dùng để kiểm duyệt bình luận, ai bị thiệt?",
          "Máy chấm cảm xúc bài viết của học sinh để \"phát hiện bạn đang buồn\". Có nên không? Cần những điều kiện gì?",
          "Định kiến trong vector từ có thể ảnh hưởng tới ai khi máy được dùng để lọc hồ sơ xin việc?"],
  badge="Nhà Bản Đồ Ngôn Từ", badge_p="Em đã mở khóa 4 thẻ kiến thức: Vector của từ · Nghĩa từ hàng xóm · Phép tính với từ · Định kiến trong vector.",
  dev_h2="Từ cảm xúc câu nói đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Thêm cảm xúc thứ ba", "Thêm nhóm từ \"ngạc nhiên\" (bất ngờ, không ngờ, ồ…) với ngữ cảnh riêng, đổi phân loại thành 3 lớp.", "Xong khi", "bản đồ có 3 vùng cảm xúc tách rõ."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Hộp thư cảm xúc ẩn danh của lớp", "Mỗi tuần cả lớp gửi một câu ẩn danh về việc học; máy vẽ biểu đồ cảm xúc chung của lớp theo thời gian (không theo từng người).", "Xong khi", "có biểu đồ 4 tuần và cả lớp thảo luận cách bảo vệ sự ẩn danh."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Phát hiện lời lẽ bắt nạt trên mạng bằng tiếng Việt", "Xây bộ câu có nhãn (có đồng ý, ẩn danh), so sánh trung bình vector với mô hình đọc theo thứ tự, đặc biệt với phủ định, mỉa mai và từ lóng.", "Đo kết quả", "tỉ lệ phát hiện đúng, tỉ lệ báo nhầm, và phân tích các câu máy sai.")],
  cur="17 · Cảm xúc", next=[("16 · Đoán chữ tiếp theo", "mô hình ngôn ngữ"), ("20 · Trợ lý hỏi đáp SGK", "tìm kiếm theo nghĩa"), ("13 · Bảng màu", "không gian vector")],
  khkt=[("Vấn đề", "Bắt nạt trên mạng bằng tiếng Việt thường dùng từ lóng, viết tắt, khó lọc tự động."), ("Câu hỏi nghiên cứu", "Vector từ học từ bình luận tiếng Việt có giúp phát hiện lời lẽ bắt nạt không?"), ("Giả thuyết", "Mô hình phát hiện tốt lời lẽ trực tiếp nhưng kém với mỉa mai."), ("Lưu ý đạo đức", "Ẩn danh hoàn toàn dữ liệu; không dùng để trừng phạt mà để hỗ trợ.")],
  prev=("16-doan-chu", "16"), nextp=("18-me-cung", "18"),
)
