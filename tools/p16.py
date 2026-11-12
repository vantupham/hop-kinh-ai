D = dict(
  out="du-an/16-doan-chu/index.html", num="16", level="4", title="Dự án 16 · Đoán chữ tiếp theo",
  scripts=["corpus.js", "lm.js"],
  h1='Đoán <span class="hl-word">chữ tiếp theo</span>',
  lead="Các chatbot viết được cả bài văn, nhưng bí mật cốt lõi lại rất đơn giản: đoán chữ tiếp theo, nối vào, rồi đoán tiếp. Ở đây em sẽ tự tay xây một \"mô hình ngôn ngữ\" tí hon học từ ca dao, tục ngữ và những câu chuyện ở trường, xem nó tung xúc xắc chọn chữ, và bắt quả tang nó bịa chuyện.",
  moi='''
  <style>.gen-box{min-height:92px;padding:14px 16px;border-radius:14px;background:var(--surface-solid);border:1px solid var(--line-strong);font-size:1.15rem;line-height:2;margin-bottom:12px}
  .tk{display:inline-block;padding:0 6px;margin:0 2px 4px 0;border-radius:6px;line-height:1.6}.tk.pr{background:color-mix(in srgb,var(--violet) 18%,transparent)}.tk.hi{background:color-mix(in srgb,var(--mint) 30%,transparent)}.tk.md{background:color-mix(in srgb,var(--amber) 32%,transparent)}.tk.lo{background:color-mix(in srgb,var(--coral) 34%,transparent)}
  .lab .tk.pr{background:rgba(124,140,255,.3);color:#fff}.caret{display:inline-block;width:10px;height:1.1em;background:var(--violet);vertical-align:middle;animation:blink 1s steps(2) infinite}@keyframes blink{50%{opacity:0}}
  .prompt-row{display:flex;gap:8px;margin-bottom:10px}.prompt-row input,.teach textarea{flex:1;min-width:0;padding:9px 12px;border-radius:10px;border:1px solid var(--line-strong);background:var(--surface-solid);color:var(--text);font:inherit}.teach textarea{width:100%;min-height:90px;resize:vertical}</style>
  <div class="playground">
    <div class="stage-col">
      <div class="prompt-row"><input id="promptIn" aria-label="Câu mở đầu" placeholder="Gõ vài chữ mở đầu rồi bấm Enter"><button class="btn small accent" id="btnAuto"><i data-i="play"></i>Tự viết</button><button class="btn small ghost" id="btnStep"><i data-i="skip"></i>1 chữ</button></div>
      <div class="gen-box" id="textOut" aria-live="polite"></div>
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Cây xác suất các chữ tiếp theo"></canvas><div class="stage-tag"><span class="live-dot"></span><span>MÔ HÌNH NGÔN NGỮ</span></div></div>
      <div class="toolbar"><div class="btn-row" id="promptBtns"></div></div>
      <div class="toolbar"><button class="btn small ghost" id="btnClear"><i data-i="reset"></i>Viết lại</button><button class="btn small" id="btnLie"><i data-i="alert"></i>Xem AI bịa</button></div>
      <div class="note" id="lieBox" hidden><i data-i="alert"></i><span>Kho dữ liệu <b>chưa từng có câu nào về nước Lào</b>. Máy không biết, nhưng nó không biết là mình không biết: nó vẫn ghép tiếp chữ hay đi sau \"là\", tạo ra một câu trôi chảy, tự tin và <b>sai</b>. Đây là hiện tượng <b>ảo giác</b> của AI.</span></div>
      <p class="small muted" style="margin:8px 0 0"><i data-i="bulb"></i> Màu của từng chữ: xanh là máy rất chắc, vàng là phân vân, cam là chữ hiếm được bốc trúng.</p>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="lbl">NGỮ CẢNH ĐANG NHÌN</div><div id="bCtx" style="margin:6px 0 4px;line-height:2"></div>
      <div class="small" id="bNote" style="color:#c3c7f0;min-height:40px"></div>
      <div class="metric-row" style="margin-top:10px"><div class="metric"><span>SỐ ỨNG VIÊN</span><b id="bCand">—</b></div><div class="metric"><span>XÁC SUẤT CHỮ VỪA CHỌN</span><b id="bConf">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>ĐOẠN CHÉP NGUYÊN VĂN</span><b id="bCopy">—</b></div><div class="metric"><span>TỪ ĐIỂN</span><b id="bVocab">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>SỐ TOKEN ĐÃ HỌC</span><b id="bTok">—</b></div><div class="metric"><span>CÁCH HỌC</span><b style="font-size:.9rem">đếm n-gram</b></div></div>
    </aside>
  </div>''',
  mission_h2="Xây một mô hình ngôn ngữ tí hon và nhìn nó \"nghĩ\"",
  mission_q="Máy không hiểu câu chữ. Vậy làm sao nó viết được câu nghe như thật?",
  mission_p="Em sẽ thấy câu bị cắt thành <b>token</b>, xem máy <b>đếm</b> trong dữ liệu để ra <b>xác suất</b>, chỉnh <b>nhiệt độ</b> để máy bớt hoặc thêm \"liều\", quay <b>vòng bốc thăm</b>, và hiểu vì sao AI có thể <b>bịa</b> một cách rất tự tin.",
  minutes="45–60 phút",
  checklist=[("write", "Cho máy viết ít nhất một câu"), ("pick", "Tự chọn chữ trên cây xác suất"), ("soi", "Soi tới bước Nhiệt độ"), ("lie", "Xem AI bịa"), ("teach", "Dạy máy thêm câu của em"), ("broke", "Làm máy viết hỏng ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Viết một chữ tiếp theo: 6 bước",
  soi_p="Hình bên dưới dùng đúng câu đang viết ở phần Mồi. Bấm \"1 chữ\" ở trên để xem từng bước thay đổi.",
  theory=[
    dict(no="61", tag="Ngôn ngữ", title="Token",
      svg='<g font-size="13" class="f-ink"><rect x="14" y="40" width="52" height="34" rx="8" class="f-soft"/><text x="26" y="62">trời</text><rect x="72" y="40" width="52" height="34" rx="8" class="f-soft"/><text x="84" y="62">hôm</text><rect x="130" y="40" width="44" height="34" rx="8" class="f-soft"/><text x="140" y="62">nay</text><rect x="180" y="40" width="58" height="34" rx="8" class="f-mint"/><text x="190" y="62" fill="#1b1f4a">nắng</text></g><text x="20" y="100" font-size="10" class="t-mono f-muted">#412 #198 #233 #57</text>',
      p="Máy không đọc chữ như em mà cắt văn bản thành các mẩu gọi là <b>token</b>, rồi đổi mỗi token thành một con số. Ở đây mỗi âm tiết tiếng Việt là một token.",
      deep="Các mô hình lớn cắt token theo cách thông minh hơn: từ hay gặp là một token, từ hiếm bị cắt thành nhiều mảnh. Tiếng Việt có dấu thường tốn nhiều token hơn tiếng Anh cho cùng một câu."),
    dict(no="62", tag="Xác suất", cls="amber", title="Mô hình ngôn ngữ",
      svg='<rect x="14" y="44" width="88" height="34" rx="8" class="f-violet"/><text x="24" y="66" font-size="12" fill="#fff">trời hôm nay</text><g class="s-line" stroke-width="2"><path d="M104 60 150 30M104 60 150 60M104 60 150 90"/></g><g font-size="12" class="f-ink"><text x="156" y="34">nắng 50%</text><text x="156" y="64">mưa 25%</text><text x="156" y="94">có 25%</text></g>',
      p="<b>Mô hình ngôn ngữ</b> cho biết: với những token đã có, token tiếp theo có thể là gì và với <b>xác suất</b> bao nhiêu. Mô hình ở đây học bằng cách đếm; chatbot lớn dùng mạng nơ-ron khổng lồ, nhưng vẫn làm đúng việc này.",
      deep="Mô hình chỉ nhìn vài token cuối được gọi là <b>n-gram</b>. Mạng nơ-ron hiện đại (Transformer) nhìn được hàng nghìn tới hàng triệu token phía trước, và tự học token nào quan trọng."),
    dict(no="63", tag="Thuật toán", cls="coral", title="Nhiệt độ & lấy mẫu",
      svg='<g><rect x="20" y="70" width="20" height="30" class="f-violet"/><rect x="44" y="50" width="20" height="50" class="f-violet"/><rect x="68" y="85" width="20" height="15" class="f-violet"/></g><text x="22" y="118" font-size="10" class="t-mono f-muted">thấp: chắc</text><g><rect x="160" y="62" width="20" height="38" class="f-amber"/><rect x="184" y="58" width="20" height="42" class="f-amber"/><rect x="208" y="66" width="20" height="34" class="f-amber"/></g><text x="160" y="118" font-size="10" class="t-mono f-muted">cao: liều</text>',
      p="Máy không luôn chọn token mạnh nhất mà <b>bốc thăm</b> theo xác suất. <b>Nhiệt độ</b> quyết định bốc thăm \"liều\" tới đâu: thấp thì an toàn, lặp lại; cao thì bất ngờ, dễ lộn xộn.",
      deep="Ngoài nhiệt độ, người ta còn dùng <b>top-k</b>: chỉ bốc trong k token mạnh nhất, để loại các lựa chọn quá vô lý. Em có thể thử cả hai ở Bàn thí nghiệm."),
    dict(no="64", tag="Đạo đức", cls="mint", title="Ảo giác của AI",
      svg='<rect x="20" y="30" width="220" height="60" rx="12" class="f-soft"/><text x="34" y="66" font-size="13" class="f-ink">thủ đô của lào là băng cốc.</text><path d="M30 100l200 0" class="s-coral" stroke-width="3" stroke-dasharray="6 5"/><text x="176" y="118" font-size="10" class="t-mono f-coral">trôi chảy ≠ đúng</text>',
      p="Mô hình chỉ học chữ nào hay đi với chữ nào, <b>không</b> có cách kiểm tra điều nó viết có đúng không. Khi thiếu hiểu biết, nó vẫn viết trôi chảy và tự tin: đó là <b>ảo giác</b> (bịa).",
      deep="Chatbot lớn cũng bịa: sự kiện, con số, cả tên sách và đường link không tồn tại. Vì vậy em luôn cần <b>kiểm tra lại với nguồn tin cậy</b>. Dự án 20 sẽ giới thiệu một cách giảm bịa: bắt AI trả lời dựa trên tài liệu."),
  ],
  tulam_h2="Bàn thí nghiệm: chỉnh bộ não ngôn ngữ và dạy nó câu mới",
  tulam_p="Mỗi thay đổi có hiệu lực ngay với chữ tiếp theo ở phần Mồi. Biểu đồ cho thấy xác suất của từng chữ mà máy đã chọn.",
  tulam='''
  <div class="card chart-card"><div class="chart-head"><b><i data-i="chart"></i> Độ chắc chắn của từng chữ máy vừa viết</b></div><canvas id="chart" width="1100" height="230"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Cách đoán</h3>
      <label class="ctl"><span>Nhiệt độ</span><b id="TV"></b><input type="range" id="T" min="0" max="3" step="0.1"></label>
      <label class="ctl"><span>Độ dài ngữ cảnh</span><b id="nV"></b><input type="range" id="n" min="1" max="4" step="1"></label>
      <label class="ctl"><span>Chỉ bốc trong top-k</span><b id="topKV"></b><input type="range" id="topK" min="0" max="10" step="1"></label>
      <label class="tog" style="display:block;margin:6px 0 12px"><input type="checkbox" id="backoff"><span>Trộn với ngữ cảnh ngắn hơn (và lùi khi chưa gặp)</span></label>
      <h3 class="h-ic"><span class="ico-box sm amber"><i data-i="layers"></i></span>Bảng đếm cho ngữ cảnh hiện tại</h3>
      <div class="lab" id="countTbl"></div>
    </div>
    <div class="card teach">
      <h3 class="h-ic"><span class="ico-box sm coral"><i data-i="book"></i></span>Dạy máy thêm câu của em</h3>
      <p class="small muted">Mỗi dòng một câu, ví dụ ca dao em thích hoặc câu kể về lớp em. Máy học lại ngay bằng cách đếm.</p>
      <textarea id="teachIn" aria-label="Câu dạy thêm" placeholder="lớp em có bể cá rất đẹp.&#10;bể cá có ba con cá vàng."></textarea>
      <div style="margin-top:8px"><button class="btn small accent" id="btnTeach"><i data-i="upload"></i>Dạy máy</button></div>
      <p class="small muted" id="teachInfo"></p>
      <h3 class="h-ic" style="margin-top:14px"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật</h3><pre class="code" id="genCode"></pre>
    </div>
  </div>''',
  breaks_h2="Thử thách: hãy làm mô hình ngôn ngữ viết hỏng!",
  breaks=[
    dict(icon="sun", key="hot", title="Sốt cao", p="Nhiệt độ vọt lên <b>3</b>, và máy chỉ nhìn <b>1 token</b> cuối.",
      why="Xác suất bị san gần như đều nhau, nên những chữ rất hiếm cũng dễ được bốc. Câu thành một mớ chữ lộn xộn (nhiều chữ màu cam). Hạ nhiệt độ về khoảng 0,7–1 và tăng ngữ cảnh lên 2."),
    dict(icon="repeat", key="cold", title="Lạnh cứng", p="Nhiệt độ <b>0</b>: máy luôn chọn chữ mạnh nhất, chỉ nhìn 1 token.",
      why="Cùng một chữ luôn dẫn tới cùng một chữ tiếp theo, nên máy dễ quay vòng một cụm từ tới khi hết lượt. Tăng nhiệt độ lên một chút để có sự đa dạng, hoặc tăng ngữ cảnh."),
    dict(icon="book", key="parrot", title="Học vẹt", p="Ngữ cảnh dài tới <b>4 token</b>, tắt việc trộn với ngữ cảnh ngắn, trong khi kho dữ liệu chỉ có hơn trăm câu.",
      why="Mỗi ngữ cảnh 4 token gần như chỉ xuất hiện một lần, nên máy chép <b>nguyên văn</b> câu trong dữ liệu (xem ô Đoạn chép nguyên văn). Máy không sáng tạo, chỉ nhớ. Ngữ cảnh dài chỉ có ích khi có rất nhiều dữ liệu. Giảm ngữ cảnh xuống 2 và bật lại việc trộn."),
  ],
  real_h2="Mô hình ngôn ngữ đang được dùng ở đâu?",
  real=[("msg", "", "Gợi ý chữ trên bàn phím", "Bàn phím điện thoại gợi ý chữ tiếp theo khi em nhắn tin: đó là một mô hình ngôn ngữ nhỏ chạy ngay trên máy."),
        ("robot", "mint", "Chatbot", "Các chatbot viết thư, giải thích bài, viết code đều đoán từng token một, với mạng nơ-ron rất lớn."),
        ("globe", "amber", "Dịch máy", "Dịch một câu cũng là đoán lần lượt các token của câu ở ngôn ngữ đích.")],
  ethics=["Một bạn dùng chatbot làm bài văn rồi nộp. Bài viết đó thể hiện điều gì về bạn ấy? Thầy cô nên phản ứng thế nào?",
          "Chatbot nói một thông tin sai rất tự tin. Em sẽ kiểm tra bằng cách nào trước khi tin hay chia sẻ?",
          "Mô hình học từ văn bản trên mạng, trong đó có cả định kiến. Điều gì xảy ra với câu văn nó viết ra?"],
  badge="Thợ Dệt Chữ", badge_p="Em đã mở khóa 4 thẻ kiến thức: Token · Mô hình ngôn ngữ · Nhiệt độ & lấy mẫu · Ảo giác của AI.",
  dev_h2="Từ đoán chữ tiếp theo đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Máy làm ca dao", "Dạy máy 50–100 câu ca dao (dân gian, không có bản quyền) rồi cho nó viết câu mới. Thêm nút đếm số chữ để kiểm tra nhịp 6–8.", "Xong khi", "cả lớp bình chọn được 3 câu máy viết nghe giống ca dao nhất."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Máy viết thơ lục bát", "Ràng buộc máy theo luật lục bát: câu 6 chữ rồi câu 8 chữ, chữ thứ 6 câu 8 vần với chữ thứ 6 câu 6. Chỉ bốc những chữ thỏa luật.", "Xong khi", "máy viết được 4 câu đúng số chữ và đúng vần."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Phát hiện văn bản do AI viết", "So sánh độ \"bất ngờ\" (xác suất trung bình của từng chữ) giữa bài văn học sinh tự viết và bài do chatbot viết, trên một mô hình ngôn ngữ chung.", "Đo kết quả", "tỉ lệ phân biệt đúng, và đặc biệt tỉ lệ nghi oan bài học sinh tự viết.")],
  cur="16 · Đoán chữ", next=[("17 · Cảm xúc câu nói", "biến chữ thành vector"), ("20 · Trợ lý hỏi đáp SGK", "giảm bịa bằng tài liệu"), ("11 · Chữ số", "mạng nơ-ron bên trong mô hình lớn")],
  khkt=[("Vấn đề", "Khó phân biệt bài văn học sinh tự viết với bài do AI viết."), ("Câu hỏi nghiên cứu", "Độ bất ngờ của từng chữ có giúp phân biệt hai loại văn bản không?"), ("Giả thuyết", "Văn bản AI có độ bất ngờ thấp và đều hơn văn bản học sinh."), ("Lưu ý đạo đức", "Không dùng kết quả để buộc tội bạn nào; công cụ có thể nghi oan.")],
  prev=("15-thu-ngu", "15"), nextp=("17-cam-xuc", "17"),
)
