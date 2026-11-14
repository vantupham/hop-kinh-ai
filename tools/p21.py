D = dict(
  out="du-an/21-doan-con-vat/index.html", num="21", grade="6", title="Dự án 21 · Đoán con vật bằng câu hỏi Có/Không",
  scripts=["animals.js", "tree.js"],
  h1='Đoán con vật bằng câu hỏi <span class="hl-word">Có / Không</span>',
  lead="Em nghĩ thầm một con vật, máy hỏi vài câu Có/Không rồi đoán. Máy không đọc được suy nghĩ của em: nó chỉ đi theo một sơ đồ câu hỏi gọi là cây quyết định. Đoán sai thì em dạy máy, và cây lớn lên. Đây cũng chính là khóa lưỡng phân em học ở môn Khoa học tự nhiên.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px"><div class="seg" id="modeBtns"><button class="btn small" data-m="play"><i data-i="robot"></i>Máy đoán</button><button class="btn small ghost" data-m="build"><i data-i="blocks"></i>Em xây cây</button></div></div>
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="560" aria-label="Cây câu hỏi Có/Không của máy"></canvas><div class="stage-tag"><span class="live-dot"></span><span>CÂY QUYẾT ĐỊNH</span></div></div>
      <div class="play-panel" id="playPanel"><p class="ask" id="askText" aria-live="polite"></p><div class="btn-row" id="askBtns"></div></div>
      <div class="play-panel" id="buildPanel" hidden><div id="buildSel"></div>
        <div class="btn-row" style="margin-top:12px"><button class="btn small accent" id="btnAutoBuild"><i data-i="sparkle"></i>Máy tự xây (chia đều)</button><button class="btn small ghost" id="btnChain"><i data-i="repeat"></i>Hỏi từng con một</button><button class="btn small ghost" id="btnResetBuild"><i data-i="reset"></i>Xây lại từ đầu</button></div></div>
      {{GUIDE}}
      <h2 class="h-ic" style="margin-top:6px;font-size:1.15rem"><span class="ico-box sm mint"><i data-i="layers"></i></span>14 con vật trong trò chơi</h2>
      <p class="small muted" style="margin:0">Bấm vào một con vật để xem bảng đặc điểm của nó.</p>
      <div class="zoo" id="zoo"></div><div class="traits" id="traitBox"></div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy</div>
      <div class="metric-row"><div class="metric"><span>CON VẬT MÁY BIẾT</span><b id="bKnown">—</b></div><div class="metric"><span>SỐ CÂU HỎI TRONG CÂY</span><b id="bQs">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>SỐ CÂU HỎI TRUNG BÌNH ĐỂ ĐOÁN</span><b id="bAvg">—</b></div><div class="metric"><span>KẾT QUẢ</span><b id="bScore" style="font-size:.95rem">—</b></div></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Mỗi ô tím là một câu hỏi. Đi nhánh <b style="color:#5ef2d6">Có</b> hay <b style="color:#ff8f6b">Không</b> tùy câu trả lời, tới hình con vật là tới câu trả lời của máy.</p>
      <button class="btn small ghost" id="btnResetPlay" style="margin-top:6px"><i data-i="reset"></i>Xóa trí nhớ của máy</button>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Máy cần mấy câu hỏi để đoán ra từng con vật?</b></div><canvas id="chart" width="1100" height="230"></canvas></div>''',
  play_guide="Em nghĩ, máy đoán. Nếu máy đoán sai, em sẽ <b>dạy</b> cho máy!",
  lessons=["KHTN 6 · Phân loại thế giới sống", "KHTN 6 · Xây dựng khóa lưỡng phân", "Tin học 6 · Thuật toán, cấu trúc rẽ nhánh"],
  mission_h2="Hiểu cách máy đoán, rồi tự xây \"bộ não\" cho máy",
  mission_q="Máy không biết em nghĩ gì. Vậy sao nó đoán trúng?",
  mission_p="Em sẽ chơi đoán con vật với máy, <b>dạy máy</b> khi nó đoán sai, tự <b>xây cây câu hỏi</b> cho 14 con vật, và tìm ra bí quyết của một câu hỏi tốt.",
  minutes="45 phút · 1 tiết học",
  checklist=[("play", "Chơi ít nhất một ván với máy"), ("teach", "Dạy máy biết thêm một con vật"), ("build", "Tự xây cây tách riêng được cả 14 con vật"), ("soi", "Soi tới bước Đi theo đường"), ("broke", "Làm máy đoán sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy đoán như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp.",
  soi_guide="Bí mật của máy chỉ là một <b>sơ đồ câu hỏi</b>. Cùng xem sơ đồ đó được làm ra sao nhé!",
  cards=[
    dict(no="T1", tag="Cách AI suy luận", title="Cây quyết định",
      svg='<rect x="95" y="10" width="70" height="26" rx="8" class="f-violet"/><text x="104" y="28" font-size="11" fill="#fff">Biết bay?</text><path d="M110 36 60 66M150 36l50 30" class="s-line" stroke-width="2"/><circle cx="60" cy="82" r="16" class="f-mint"/><circle cx="200" cy="82" r="16" class="f-coral"/><text x="44" y="114" font-size="10" class="t-mono f-mint">Có</text><text x="196" y="114" font-size="10" class="t-mono f-coral">Không</text>',
      p="Một sơ đồ gồm các <b>câu hỏi Có/Không</b> nối với nhau. Đi từ câu hỏi trên cùng, chọn nhánh theo câu trả lời, cuối cùng tới <b>lá</b> là kết quả. Khóa lưỡng phân trong môn Khoa học tự nhiên chính là một cây quyết định.",
      ex="Bác sĩ hỏi: \"Có sốt không? Có ho không?\" để khoanh vùng bệnh. Trò chơi đoán nhân vật trên mạng cũng hỏi dần từng câu như vậy."),
    dict(no="T2", tag="Dữ liệu", cls="amber", title="Đặc điểm và câu hỏi tốt",
      svg='<g font-size="12"><text x="14" y="34" class="f-mint">Có xương sống?</text><text x="14" y="62" class="f-mint">Có 6 chân?</text><text x="150" y="34" class="f-coral">Có đẹp không?</text><text x="150" y="62" class="f-coral">Có to không?</text></g><path d="M20 82h100" class="s-mint" stroke-width="3"/><path d="M150 82h100" class="s-coral" stroke-width="3" stroke-dasharray="6 5"/><text x="20" y="104" font-size="10" class="t-mono f-mint">ai trả lời cũng giống</text><text x="150" y="104" font-size="10" class="t-mono f-coral">mỗi người một ý</text>',
      p="Máy chỉ dùng được những <b>đặc điểm</b> có câu trả lời chắc chắn: có xương sống, có lông vũ, có 6 chân… Câu hỏi tốt còn <b>chia các con vật thành hai nhóm gần bằng nhau</b>, nên đoán nhanh hơn.",
      ex="Chơi \"Ai là ai?\" với bạn, hỏi \"Bạn ấy có đeo kính không?\" loại được nửa lớp ngay, còn hỏi \"Có phải bạn Nam không?\" chỉ loại được một người."),
    dict(no="T3", tag="Học máy", cls="coral", title="Học từ lỗi sai",
      svg='<circle cx="60" cy="60" r="20" class="f-coral" opacity=".8"/><text x="52" y="66" font-size="16" fill="#fff" font-weight="800">?</text><path d="M86 60h40" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="136" y="44" width="66" height="30" rx="8" class="f-violet"/><text x="142" y="64" font-size="10" fill="#fff">câu hỏi mới</text><path d="M168 74 146 98M172 74l22 24" class="s-line" stroke-width="2"/>',
      p="Khi đoán sai, máy hỏi lại em đáp án đúng và một câu hỏi mới, rồi <b>gắn thêm nhánh</b> vào cây. Máy càng chơi nhiều, càng gặp nhiều con vật mới thì càng biết nhiều: đó là ý tưởng của <b>học máy</b>.",
      ex="Lần đầu em nhầm cá heo là cá. Sau khi biết cá heo nuôi con bằng sữa, em nhớ thêm một \"câu hỏi\" để không nhầm nữa."),
  ],
  real=[("help", "", "Trò chơi đoán nhân vật", "Các trò chơi trên mạng đoán nhân vật em nghĩ bằng chuỗi câu hỏi, và học thêm mỗi khi đoán sai."),
        ("heart", "mint", "Hỗ trợ khám bệnh", "Phần mềm hỏi lần lượt các triệu chứng để gợi ý bác sĩ nên kiểm tra gì trước."),
        ("msg", "amber", "Tổng đài tự động", "\"Bấm phím 1 nếu… bấm phím 2 nếu…\": mỗi lựa chọn đưa em sang một nhánh của cây.")],
  breaks_h2="Thử thách: hãy làm máy đoán sai!",
  breaks_guide="Máy nào cũng có lúc sai. Tìm ra <b>vì sao</b> máy sai là cách hay nhất để hiểu máy!",
  breaks=[
    dict(icon="help", key="vague", title="Câu hỏi mơ hồ", p="Cây bắt đầu bằng câu hỏi <b>\"Con vật có to không?\"</b>. Hai bạn cùng nghĩ con mèo nhưng trả lời khác nhau.",
      why="\"To\" là so với cái gì? So với con kiến thì mèo to, so với con voi thì mèo nhỏ. Hai bạn đi hai nhánh khác nhau nên máy đoán ra hai con khác nhau. Câu hỏi trong cây phải có câu trả lời <b>chắc chắn</b>, ai trả lời cũng giống nhau. Bấm <b>Đổi sang câu hỏi rõ ràng</b>."),
    dict(icon="sparkle", key="stranger", title="Con vật lạ", p="<b>Chim cánh cụt</b> xuất hiện: có lông vũ, không biết bay, bơi rất giỏi. Máy chưa từng gặp con vật này.",
      why="Máy chỉ biết những con vật có trong cây, nên nó đi theo nhánh \"có lông vũ, không biết bay\" và đoán nhầm là gà. Hãy <b>dạy máy</b> một câu hỏi phân biệt chim cánh cụt với gà, ví dụ \"Sống chủ yếu dưới nước không?\". Máy học từ ví dụ mới, giống như em."),
    dict(icon="repeat", key="chain", title="Hỏi từng con một", p="Cây chỉ toàn câu hỏi kiểu <b>\"Có phải con mèo không?\", \"Có phải con dơi không?\"</b>…",
      why="Mỗi câu hỏi chỉ loại được đúng một con vật, nên con cuối cùng phải hỏi tới 13 câu (xem biểu đồ). Câu hỏi về <b>đặc điểm</b> chia đôi được cả nhóm, chỉ cần khoảng 4 câu. Bấm <b>Máy tự xây</b> để so sánh."),
  ],
  badge="Nhà Phân Loại Nhí", badge_p="Em đã mở khóa 3 thẻ kiến thức: Cây quyết định · Đặc điểm và câu hỏi tốt · Học từ lỗi sai.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Dạy máy 3 con vật mới", "Chơi với máy và dạy nó thêm 3 con vật không có trong bảng (con trâu, con muỗi, con mực…). Ghi lại 3 câu hỏi em đã dạy."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Khóa lưỡng phân cây trong vườn trường", "Chụp hoặc vẽ 8 loại lá cây trong trường, chọn đặc điểm (mép lá răng cưa? gân song song?…) và xây cây phân loại. Nhờ bạn lớp khác thử dùng."),
       (3, "Ý TƯỞNG KHKT", "Thẻ bài nhận biết côn trùng có ích và có hại", "Xây khóa lưỡng phân giúp bà con nhận ra côn trùng trên ruộng vườn, đo xem người dùng tra đúng bao nhiêu phần trăm.")],
  res=[("layers", "", "Phiếu học tập", "In ra để làm trên lớp, không cần máy tính.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 10", "Máy tự học cây quyết định từ dữ liệu tư thế ngồi.", "../10-tu-the-ngoi/index.html")],
  prev=None, nextp=None,
)
