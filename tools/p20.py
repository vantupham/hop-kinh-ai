D = dict(
  out="du-an/20-hoi-dap/index.html", num="20", level="4", title="Dự án 20 · Trợ lý hỏi đáp SGK",
  scripts=["docs.js", "rag.js"],
  h1='Trợ lý <span class="hl-word">hỏi đáp SGK</span>',
  lead="Hỏi chatbot một câu về bài học, nó trả lời ngay, rất tự tin, nhưng đúng hay sai? Ở dự án cuối cùng này, em xây một trợ lý biết lật sách trước khi trả lời: tìm đúng đoạn tài liệu, trả lời dựa trên đó, ghi rõ nguồn, và dám nói \"mình không biết\". Rồi em so nó với một trợ lý đóng sách để thấy AI bịa ra sao.",
  moi='''
  <style>.q-row{display:flex;gap:8px;margin-bottom:10px}.q-row input,.add input,.add textarea{flex:1;min-width:0;padding:10px 12px;border-radius:10px;border:1px solid var(--line-strong);background:var(--surface-solid);color:var(--text);font:inherit}.add input,.add textarea{width:100%;margin-bottom:8px}.add textarea{min-height:80px;resize:vertical}
  .ans{border-radius:14px;padding:14px 16px;margin-top:12px;border:1.5px solid var(--line-strong);background:var(--surface-solid)}.ans.ok{border-color:var(--mint)}.ans.none{border-color:var(--amber)}.ans.closed{border-color:var(--coral);border-style:dashed}
  .ans-tag{font:700 .72rem "JetBrains Mono",monospace;letter-spacing:.04em;display:flex;align-items:center;gap:6px;margin-bottom:6px;color:var(--muted)}.ans-tag svg{width:16px;height:16px}.ans p{margin:0;font-size:1.05rem;line-height:1.6}
  .cite{display:inline-flex;align-items:center;justify-content:center;min-width:22px;height:20px;border-radius:6px;border:0;background:var(--violet);color:#fff;font:700 .75rem "JetBrains Mono",monospace;cursor:pointer;margin:0 2px;vertical-align:1px}
  .src{font-size:.85rem;padding:6px 10px;border-radius:8px;background:color-mix(in srgb,var(--mint) 12%,transparent);margin-top:6px;cursor:pointer}.src.bad{background:color-mix(in srgb,var(--coral) 18%,transparent)}.src span{color:var(--text-2)}
  .doc-view{margin-top:10px;padding:12px 14px;border-radius:12px;background:color-mix(in srgb,var(--violet) 10%,transparent);font-size:.92rem;line-height:1.6}.doc-view mark{background:color-mix(in srgb,var(--amber) 55%,transparent);color:inherit;border-radius:4px;padding:0 2px}</style>
  <div class="playground">
    <div class="stage-col">
      <div class="q-row"><input id="qIn" aria-label="Câu hỏi" placeholder="Hỏi một câu về khoa học tự nhiên hoặc địa lí"><button class="btn small accent" id="btnAsk"><i data-i="send"></i>Hỏi</button></div>
      <div class="btn-row" id="qBtns" style="margin-bottom:10px"></div>
      <div class="stage vf"><canvas id="stage" width="640" height="480" aria-label="Bản đồ các đoạn tài liệu và tia nối từ câu hỏi tới nguồn"></canvas><div class="stage-tag"><span class="live-dot"></span><span>TÌM NGUỒN</span></div></div>
      <div class="toolbar"><div class="seg" id="modeBtns"><button class="btn small" data-m="rag"><i data-i="book"></i>Tra tài liệu</button><button class="btn small ghost" data-m="closed"><i data-i="lock"></i>Đóng sách</button></div></div>
      <div class="ans" id="ansBox"><div class="ans-tag" id="ansTag"></div><p id="ansText"></p><div id="ansSrc"></div></div>
      <div class="doc-view" id="docView" hidden></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · trực tiếp</div>
      <div class="metric-row"><div class="metric"><span>CÁCH TRẢ LỜI</span><b id="bMode">—</b></div><div class="metric"><span>SỐ ĐOẠN TÀI LIỆU</span><b id="bDocs">—</b></div></div>
      <div class="lbl" style="margin-top:12px">CÁC ĐOẠN LIÊN QUAN NHẤT</div><div class="bars" id="bTop"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Bấm vào số trích dẫn <b>[1]</b> trong câu trả lời để xem đoạn tài liệu gốc.</p>
    </aside>
  </div>''',
  mission_h2="Xây một trợ lý biết tra cứu và biết nói \"không biết\"",
  mission_q="Làm sao để AI trả lời dựa trên sách, và em kiểm tra lại được?",
  mission_p="Em sẽ thấy tài liệu được chia thành <b>đoạn</b>, biến thành <b>vector</b>, trợ lý <b>tìm</b> đoạn gần câu hỏi nhất, <b>trả lời kèm trích dẫn</b>, và dùng <b>ngưỡng</b> để biết khi nào nên từ chối. Em cũng sẽ thấy trợ lý <b>đóng sách</b> bịa ra sao, và vì sao nguồn sai dẫn tới câu trả lời sai.",
  minutes="45–60 phút",
  checklist=[("ask", "Hỏi ít nhất 3 câu"), ("cite", "Bấm vào một trích dẫn để xem nguồn"), ("soi", "Soi tới bước Tìm đoạn gần nhất"), ("closed", "Thử chế độ Đóng sách"), ("add", "Thêm một đoạn tài liệu của em"), ("broke", "Làm trợ lý trả lời sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Từ câu hỏi tới câu trả lời có nguồn: 6 bước",
  soi_p="Hình bên dưới dùng đúng câu hỏi em vừa hỏi ở phần Mồi.",
  theory=[
    dict(no="77", tag="Tìm kiếm", title="Tìm kiếm theo từ khóa",
      svg='<g font-size="12"><text x="14" y="34" class="f-ink">quang hợp</text><text x="14" y="58" class="f-ink">diệp lục</text><text x="14" y="82" class="f-muted">Trái Đất</text><text x="14" y="106" class="f-muted">là</text></g><g><rect x="100" y="24" width="140" height="12" rx="4" class="f-violet"/><rect x="100" y="48" width="120" height="12" rx="4" class="f-violet"/><rect x="100" y="72" width="40" height="12" rx="4" class="f-violet" opacity=".5"/><rect x="100" y="96" width="4" height="12" class="f-violet" opacity=".3"/></g>',
      p="Câu hỏi và mỗi đoạn tài liệu được biến thành vector từ khóa. Từ <b>hiếm</b> như \"diệp lục\" được tính nặng, từ <b>phổ biến</b> như \"là\" gần như bỏ qua: đó là <b>TF-IDF</b>. Đoạn nào có vector giống câu hỏi nhất là đoạn liên quan nhất.",
      deep="Trợ lý hiện đại thường dùng vector nghĩa (như Dự án 17) thay vì chỉ từ khóa, nên tìm được cả đoạn dùng từ khác mà cùng ý. Người ta hay kết hợp cả hai cách."),
    dict(no="78", tag="Mô hình ngôn ngữ", cls="amber", title="RAG: trả lời có tra cứu",
      svg='<circle cx="30" cy="64" r="14" class="f-amber"/><text x="25" y="69" font-size="13" fill="#11142e" font-weight="800">?</text><path d="M46 64h30" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><g class="f-soft"><rect x="84" y="30" width="56" height="20" rx="4"/><rect x="84" y="56" width="56" height="20" rx="4"/><rect x="84" y="82" width="56" height="20" rx="4"/></g><rect x="84" y="56" width="56" height="20" rx="4" class="f-mint"/><path d="M144 66h30" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="180" y="46" width="64" height="40" rx="8" class="f-violet"/><text x="190" y="70" font-size="11" fill="#fff">trả lời [2]</text>',
      p="<b>RAG</b> (Retrieval-Augmented Generation): trước khi trả lời, trợ lý <b>tìm</b> những đoạn tài liệu liên quan, rồi dựa vào đó để trả lời và <b>ghi nguồn</b>. Câu trả lời bám vào tài liệu thay vì trí nhớ mơ hồ của mô hình.",
      deep="Ở đây trợ lý chép nguyên câu phù hợp nhất. Chatbot thật đưa các đoạn tìm được vào mô hình ngôn ngữ lớn để nó viết lại câu trả lời tự nhiên, kèm trích dẫn."),
    dict(no="79", tag="Đánh giá", cls="coral", title="Biết mình không biết",
      svg='<path d="M20 100H240" class="s-line" stroke-width="1"/><g><rect x="30" y="40" width="30" height="60" class="f-mint"/><rect x="70" y="64" width="30" height="36" class="f-violet" opacity=".5"/><rect x="110" y="84" width="30" height="16" class="f-violet" opacity=".4"/></g><path d="M20 70H240" class="s-coral" stroke-width="2" stroke-dasharray="6 4"/><text x="160" y="64" font-size="10" class="t-mono f-coral">ngưỡng liên quan</text>',
      p="Nếu không đoạn nào đủ liên quan (dưới <b>ngưỡng</b>), trợ lý nên nói \"mình không tìm thấy\" thay vì cố trả lời. Ngưỡng quá thấp: trả lời bừa. Ngưỡng quá cao: từ chối cả câu hỏi trả lời được.",
      deep="Đây lại là sự đánh đổi giữa báo nhầm và bỏ sót mà em đã gặp từ Dự án 9. Trong giáo dục và y tế, một câu \"không biết\" thường an toàn hơn một câu trả lời sai."),
    dict(no="80", tag="Đạo đức", cls="mint", title="Rác vào, rác ra",
      svg='<rect x="20" y="30" width="80" height="64" rx="8" class="f-soft"/><text x="30" y="56" font-size="11" class="f-coral">nguồn sai</text><path d="M104 62h40" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="150" y="30" width="90" height="64" rx="8" class="f-soft"/><text x="158" y="56" font-size="11" class="f-coral">trả lời sai</text><text x="158" y="76" font-size="11" class="f-violet">kèm trích dẫn</text>',
      p="Trợ lý chỉ tốt bằng tài liệu nó dựa vào. Nguồn sai cho câu trả lời sai, dù có trích dẫn trông rất đáng tin. Vì vậy em luôn cần <b>bấm vào nguồn</b> và tự hỏi: ai viết, có đáng tin không?",
      deep="Kỹ năng kiểm tra nguồn tin là kỹ năng quan trọng nhất khi học cùng AI. AI là trợ lý, không phải thầy cô hay sách giáo khoa."),
  ],
  tulam_h2="Bàn thí nghiệm: chỉnh cách tìm nguồn và tự thêm tài liệu",
  tulam_p="Biểu đồ cho thấy độ liên quan của từng đoạn với câu hỏi hiện tại. Kéo ngưỡng và xem đoạn nào được dùng.",
  tulam='''
  <div class="card chart-card"><div class="chart-head"><b><i data-i="chart"></i> Độ liên quan của từng đoạn với câu hỏi</b></div><canvas id="chart" width="1100" height="260"></canvas></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm"><i data-i="sliders"></i></span>Cách tìm nguồn</h3>
      <label class="ctl"><span>Số đoạn lấy (top-k)</span><b id="kV"></b><input type="range" id="k" min="1" max="5" step="1"></label>
      <label class="ctl"><span>Ngưỡng liên quan</span><b id="thrV"></b><input type="range" id="thr" min="0" max="0.5" step="0.01"></label>
      <label class="tog" style="display:block;margin:8px 0"><input type="checkbox" id="bad"><span>Đưa một bài viết sai trên mạng vào kho</span></label>
      <h3 class="h-ic" style="margin-top:14px"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật</h3><pre class="code" id="genCode"></pre>
    </div>
    <div class="card add">
      <h3 class="h-ic"><span class="ico-box sm coral"><i data-i="book"></i></span>Thêm tài liệu của em</h3>
      <p class="small muted">Chép một đoạn ngắn từ vở ghi của em (môn nào cũng được), rồi đặt câu hỏi về nó ở phần Mồi.</p>
      <input id="addTitle" aria-label="Tên đoạn" placeholder="Tên đoạn, ví dụ: Hô hấp">
      <textarea id="addText" aria-label="Nội dung đoạn" placeholder="Hô hấp là quá trình cơ thể lấy khí ôxi và thải khí cacbon điôxít…"></textarea>
      <button class="btn small accent" id="btnAdd"><i data-i="upload"></i>Thêm vào kho</button><p class="small muted" id="addInfo"></p>
    </div>
  </div>''',
  breaks_h2="Thử thách: hãy làm trợ lý trả lời sai!",
  breaks=[
    dict(icon="help", key="outside", title="Câu hỏi ngoài sách", p="Hỏi <b>\"Ai là người phát minh ra điện thoại?\"</b>, điều tài liệu không hề nhắc tới, và ngưỡng liên quan bị hạ về <b>0</b>.",
      why="Không có ngưỡng, trợ lý luôn lấy đoạn \"ít không liên quan nhất\" và trích một câu chẳng ăn nhập gì, kèm cả số trích dẫn. Kéo <b>ngưỡng liên quan</b> lên khoảng 0,1: trợ lý sẽ nói thẳng là không tìm thấy."),
    dict(icon="alert", key="badsrc", title="Nguồn kém tin cậy", p="Một <b>bài viết sai trên mạng</b> được đưa vào kho, rồi em hỏi \"Vì sao Mặt Trăng sáng?\".",
      why="Bài viết sai dùng đúng những từ trong câu hỏi nên được xếp hạng cao nhất. Trợ lý đưa câu sai lên đầu, có cả trích dẫn, ngay cạnh câu đúng từ sách: hai nguồn mâu thuẫn nhau mà trợ lý không biết nguồn nào đáng tin. Bấm vào trích dẫn: nguồn là \"trang mạng không rõ tác giả\". Bỏ chọn ô <b>Đưa bài viết sai vào kho</b>. Bài học: luôn kiểm tra nguồn."),
    dict(icon="lock", key="closed", title="Đóng sách", p="Trợ lý trả lời <b>không tra tài liệu</b>, chỉ dùng một mô hình ngôn ngữ nhỏ (như Dự án 16) đã học từ chính các tài liệu này.",
      why="Câu trả lời nghe như văn sách giáo khoa nhưng trộn lẫn các ý không liên quan, và không có nguồn nào để kiểm tra. Đây là ảo giác. Bấm <b>Tra tài liệu</b> để trợ lý quay lại dựa vào nguồn."),
  ],
  real_h2="Trợ lý có tra cứu đang được dùng ở đâu?",
  real=[("book", "", "Học tập", "Trợ lý học tập trả lời dựa trên sách giáo khoa và bài giảng của chính lớp em, kèm số trang để tra lại."),
        ("scan", "mint", "Tìm kiếm thông minh", "Công cụ tìm kiếm có AI tóm tắt câu trả lời từ nhiều trang web và đính kèm đường dẫn nguồn."),
        ("shield", "amber", "Công việc", "Bác sĩ, luật sư, kỹ sư dùng trợ lý tra cứu trong tài liệu chuyên ngành, nhưng vẫn tự kiểm tra trước khi quyết định.")],
  ethics=["Một bạn chép câu trả lời của trợ lý vào bài kiểm tra mà không đọc nguồn. Điều gì có thể xảy ra?",
          "Ai chịu trách nhiệm khi trợ lý trích dẫn đúng một tài liệu nhưng tài liệu đó sai?",
          "Trợ lý chỉ được nạp tài liệu của một phía trong một vấn đề tranh cãi. Câu trả lời của nó sẽ thế nào?"],
  badge="Thủ Thư AI", badge_p="Em đã mở khóa 4 thẻ kiến thức: Tìm kiếm theo từ khóa · RAG · Biết mình không biết · Rác vào, rác ra. Chúc mừng em đã hoàn thành cả 20 dự án của Hộp Kính AI!",
  dev_h2="Từ trợ lý hỏi đáp đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Trợ lý cho môn em thích", "Nạp 20–30 đoạn ngắn từ vở ghi một môn học (lịch sử, sinh học…), viết 10 câu hỏi và kiểm tra trợ lý trả lời đúng bao nhiêu câu.", "Xong khi", "có bảng 10 câu hỏi với kết quả đúng, sai, \"không biết\"."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Máy tạo câu hỏi ôn tập", "Đảo ngược trợ lý: từ mỗi đoạn, chọn câu chứa từ khóa hiếm và đục lỗ từ đó thành câu hỏi điền vào chỗ trống, kèm đáp án và nguồn.", "Xong khi", "tạo được 20 câu hỏi mà bạn cùng lớp thấy hữu ích."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Gia sư AI biết tự kiểm tra trích dẫn", "So sánh câu trả lời của một chatbot có và không có tra cứu trên 50 câu hỏi sách giáo khoa; xây công cụ tự kiểm tra xem câu trả lời có thật sự nằm trong nguồn được trích không.", "Đo kết quả", "tỉ lệ trả lời đúng, tỉ lệ bịa, tỉ lệ trích dẫn sai nguồn của mỗi cách.")],
  cur="20 · Hỏi đáp SGK", next=[("16 · Đoán chữ tiếp theo", "mô hình ngôn ngữ đằng sau"), ("17 · Cảm xúc câu nói", "vector nghĩa để tìm kiếm"), ("1 · Squat", "ôn lại từ đầu")],
  khkt=[("Vấn đề", "Học sinh hỏi chatbot về bài học và nhận câu trả lời sai mà không biết."), ("Câu hỏi nghiên cứu", "Trợ lý có tra cứu sách giáo khoa có giảm tỉ lệ trả lời sai so với chatbot đóng sách không?"), ("Giả thuyết", "Tỉ lệ bịa giảm rõ rệt, và trích dẫn giúp học sinh phát hiện lỗi còn lại."), ("Lưu ý đạo đức", "Tôn trọng bản quyền sách khi nạp tài liệu; không dùng trợ lý để làm bài hộ.")],
  prev=("19-xe-tu-lai", "19"), nextp=None,
)
