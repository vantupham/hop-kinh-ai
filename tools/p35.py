D = dict(
  out="du-an/35-chatbot/index.html", num="35", grade="8", title="Dự án 35 · Tự làm chatbot theo luật",
  scripts=["bot.js"],
  h1='Tự làm <span class="hl-word">chatbot</span> cho thư viện trường',
  lead="Thư viện trường muốn có một trợ lý trả lời các câu hỏi quen thuộc: mấy giờ mở cửa, mượn sách thế nào, lỡ làm mất sách thì sao. Em sẽ tự làm chatbot đó bằng các luật \"nếu câu hỏi có từ khóa… thì trả lời…\", thử với câu hỏi thật của các bạn, và thấy rõ vì sao chatbot theo luật vừa dễ làm vừa rất dễ \"hỏng\".",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="chatbox vf" id="chatbox"><div class="phone-top"><span class="live-dot"></span><b>Kính · Trợ lý thư viện</b><span class="spacer"></span><span class="chip" id="ruleChip">7 luật</span></div>
        <ul class="chatlog" id="log" aria-live="polite"></ul>
        <form class="chatin" id="chatForm"><label for="msgIn" class="sr-only">Câu hỏi</label><input id="msgIn" autocomplete="off" placeholder="Gõ câu hỏi, ví dụ: Thư viện mở cửa mấy giờ?"><button class="btn small accent" type="submit"><i data-i="send"></i>Gửi</button></form></div>
      <div class="play-panel"><p class="small" style="margin:0 0 8px"><b>Câu hỏi của các bạn (bấm để gửi thử):</b></p><div class="btn-row" id="tests"></div>
        <p class="ask" id="askText" aria-live="polite" style="margin:12px 0 0"></p></div>
      {{GUIDE}}
      <div class="card" style="margin-top:6px">
        <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="code"></i></span>Bộ luật của chatbot</h2>
        <ol class="rules" id="rules"></ol>
        <form class="addrule" id="addForm"><label class="small">Nếu câu hỏi có từ khóa (cách nhau bằng dấu phẩy)<input id="newKw" placeholder="máy tính, mượn máy tính"></label><label class="small">thì trả lời<input id="newAns" placeholder="Thư viện có 10 máy tính, dùng tại chỗ theo giờ."></label><button class="btn small" type="submit"><i data-i="book"></i>Thêm luật</button></form>
      </div>
      <div class="card" style="margin-top:14px">
        <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
        <label class="ctl"><span>Số từ khóa tối thiểu phải khớp</span><b id="minV"></b><input type="range" id="min" min="1" max="3" step="1"></label>
        <div class="toggles"><label class="tog"><input type="checkbox" id="optStrip"><span>Bỏ dấu tiếng Việt khi so</span></label><label class="tog"><input type="checkbox" id="optBest" checked><span>Chọn luật khớp nhiều từ khóa nhất (tắt: chọn luật đầu tiên khớp)</span></label></div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của chatbot</div>
      <div class="metric-row"><div class="metric"><span>LUẬT ĐƯỢC CHỌN</span><b id="bRule" style="font-size:.92rem">—</b></div><div class="metric"><span>ĐÚNG / 12 CÂU HỎI THỬ</span><b id="bAcc">—</b></div></div>
      <div class="lbl" style="margin-top:12px">CÂU HỎI SAU KHI CHUẨN HÓA</div><div id="bNorm" class="calc"></div>
      <div class="lbl" style="margin-top:12px">TỪ KHÓA KHỚP</div><div class="kw" id="bHit"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Chatbot <b>không hiểu</b> câu hỏi. Nó chỉ tìm xem câu có chứa từ khóa nào, luật nào khớp nhiều nhất thì dùng câu trả lời của luật đó.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Số từ khóa khớp của từng luật với câu hỏi vừa gửi</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Gõ một câu hỏi về thư viện, hoặc bấm các câu hỏi thử bên dưới. Xem chatbot chọn <b>luật</b> nào và vì sao.",
  lessons=["Tin học 8 · Cấu trúc rẽ nhánh nếu… thì…", "Tin học 8 · Xử lý xâu kí tự", "Ngữ văn 8 · Câu hỏi, giao tiếp phù hợp"],
  mission_h2="Tự xây một chatbot và hiểu giới hạn của nó",
  mission_q="Chatbot trả lời đúng câu \"mấy giờ mở cửa\". Vậy nó có hiểu tiếng Việt không?",
  mission_p="Em sẽ thử chatbot với câu hỏi của các bạn, <b>thêm luật mới</b>, chỉnh cách <b>chuẩn hóa</b> và cách <b>chọn luật</b>, rồi phá máy bằng câu lạ, câu không dấu và luật chồng chéo. Cuối cùng em so sánh chatbot theo luật với chatbot học từ dữ liệu.",
  minutes="45 phút · 1 tiết học",
  checklist=[("chat", "Gửi ít nhất 5 câu hỏi cho chatbot"), ("rule", "Tự thêm một luật mới"), ("score", "Làm chatbot trả lời đúng ít nhất 11/12 câu thử"), ("soi", "Soi tới bước Chọn luật"), ("broke", "Làm chatbot trả lời sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Chatbot theo luật trả lời như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng câu hỏi em vừa gửi.",
  soi_guide="Bên trong chatbot chỉ là <b>xử lý chữ</b> và <b>nếu… thì…</b> em học ở Tin học. Cùng soi nhé!",
  cards=[
    dict(no="T1", tag="Lập trình", title="Luật nếu… thì…",
      svg='<rect x="14" y="18" width="232" height="30" rx="8" class="f-violet" opacity=".9"/><text x="24" y="38" font-size="12" fill="#fff" font-weight="700">NẾU câu có "mở cửa" hoặc "mấy giờ"</text><rect x="14" y="58" width="232" height="30" rx="8" class="f-mint" opacity=".9"/><text x="24" y="78" font-size="12" fill="#062b27" font-weight="700">THÌ trả lời "Mở cửa 7h–17h"</text><text x="16" y="108" font-size="11" class="f-ink">KHÔNG KHỚP luật nào → "Mình chưa hiểu"</text>',
      p="Mỗi <b>luật</b> gồm một danh sách <b>từ khóa</b> và một <b>câu trả lời</b> viết sẵn. Chatbot dò xem câu hỏi chứa từ khóa nào, chọn luật khớp nhất. Đó chính là cấu trúc <b>rẽ nhánh</b> em đã học.",
      ex="Tổng đài tự động \"bấm phím 1 để…, bấm phím 2 để…\" là một hệ thống theo luật rất đơn giản."),
    dict(no="T2", tag="Xử lý chữ", cls="amber", title="Chuẩn hóa câu hỏi",
      svg='<text x="14" y="34" font-size="13" class="f-ink" font-weight="700">"Thư viện MỞ CỬA mấy giờ???"</text><path d="M120 42v14" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><text x="14" y="78" font-size="13" class="f-mint" font-weight="700">thư viện mở cửa mấy giờ</text><text x="14" y="104" font-size="13" class="f-amber" font-weight="700">thu vien mo cua may gio</text>',
      p="Người gõ chữ hoa, chữ thường, thêm dấu chấm hỏi, gõ không dấu… Trước khi so, chatbot <b>chuẩn hóa</b>: đổi hết về chữ thường, bỏ dấu câu, có thể bỏ cả dấu tiếng Việt. Nhờ vậy cùng một ý viết khác nhau vẫn khớp được.",
      ex="Ô tìm kiếm trên mạng vẫn tìm đúng dù em gõ \"thu vien\" thay vì \"thư viện\"."),
    dict(no="T3", tag="So sánh", cls="coral", title="Chatbot luật và chatbot học máy",
      svg='<rect x="14" y="18" width="110" height="80" rx="10" class="f-violet" opacity=".2"/><text x="22" y="40" font-size="11" class="f-violet" font-weight="800">Theo luật</text><text x="22" y="60" font-size="10" class="f-ink">dễ hiểu, dễ sửa</text><text x="22" y="78" font-size="10" class="f-coral">câu lạ là bí</text><rect x="136" y="18" width="110" height="80" rx="10" class="f-mint" opacity=".2"/><text x="144" y="40" font-size="11" class="f-mint" font-weight="800">Học từ dữ liệu</text><text x="144" y="60" font-size="10" class="f-ink">linh hoạt hơn</text><text x="144" y="78" font-size="10" class="f-coral">có thể bịa</text>',
      p="Chatbot theo luật chỉ trả lời được những gì người viết đã nghĩ trước, nhưng <b>luôn biết vì sao</b> nó trả lời như vậy. Chatbot AI học từ rất nhiều văn bản nên trả lời linh hoạt hơn, nhưng có thể <b>trả lời sai một cách tự tin</b>. Dù dùng loại nào, em vẫn cần kiểm tra lại thông tin.",
      ex="Bảng câu hỏi thường gặp trên trang web là \"luật\"; trợ lý AI trò chuyện là \"học từ dữ liệu\"."),
  ],
  real=[("msg", "", "Trợ lý chăm sóc khách hàng", "Nhiều trang web dùng chatbot theo luật cho câu hỏi thường gặp, câu khó thì chuyển cho nhân viên thật."),
        ("cpu", "mint", "Trợ lý AI trò chuyện", "Học từ lượng văn bản khổng lồ để trả lời tự nhiên, nhưng vẫn cần kiểm tra vì có thể trả lời sai."),
        ("book", "amber", "Hỏi đáp trong trường học", "Một chatbot nhỏ trả lời lịch thi, thời khóa biểu, quy định thư viện giúp thầy cô bớt phải trả lời lặp lại.")],
  breaks_h2="Thử thách: hãy làm chatbot trả lời sai!",
  breaks_guide="Chatbot theo luật không hiểu câu hỏi, nó chỉ dò từ khóa. Thử ba cách làm nó bối rối!",
  breaks=[
    dict(icon="help", key="strange", title="Câu hỏi lạ", p="Một bạn hỏi: <b>\"Thư viện có cho mượn máy tính không?\"</b>",
      why="Câu có từ \"mượn\" nên luật <b>mượn sách</b> khớp và chatbot trả lời về mượn sách, sai hẳn ý. Chatbot không hiểu \"máy tính\" khác \"sách\". Tự <b>thêm một luật</b> với từ khóa \"máy tính, mượn máy tính\" ở ô bên dưới bộ luật, rồi hỏi lại."),
    dict(icon="code", key="noacc", title="Gõ không dấu", p="Bạn khác gõ vội: <b>\"thu vien mo cua may gio\"</b>.",
      why="Từ khóa trong luật có dấu (\"mở cửa\", \"mấy giờ\"), câu hỏi không dấu nên không khớp chữ nào, chatbot trả lời \"chưa hiểu\". Bật <b>Bỏ dấu tiếng Việt khi so</b>: cả câu hỏi và từ khóa đều được bỏ dấu trước khi so."),
    dict(icon="layers", key="overlap", title="Luật chồng chéo", p="Câu hỏi: <b>\"Em làm mất sách thì phải trả bao nhiêu tiền?\"</b>, và chatbot đang <b>chọn luật đầu tiên khớp</b>.",
      why="Câu có \"trả\" (luật hạn trả sách) và \"làm mất\", \"mất sách\" (luật mất sách). Luật hạn trả đứng trước nên được chọn, trả lời sai. Bật <b>Chọn luật khớp nhiều từ khóa nhất</b>: luật mất sách khớp 3 từ khóa sẽ thắng."),
  ],
  badge="Nhà Thiết Kế Chatbot", badge_p="Em đã mở khóa 3 thẻ kiến thức: Luật nếu… thì… · Chuẩn hóa câu hỏi · Chatbot luật và chatbot học máy.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Chatbot gia đình", "Viết 8 luật cho một chatbot trả lời câu hỏi về gia đình em (mấy giờ ăn tối, wifi tên gì…). Nhờ người nhà hỏi thử 10 câu và đếm số câu trả lời đúng."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Chatbot lớp học bằng Python", "Dùng xâu kí tự và câu lệnh if trong Python để viết chatbot theo luật cho lớp: lịch kiểm tra, trực nhật, câu lạc bộ."),
       (3, "Ý TƯỞNG KHKT", "Trợ lý thư viện thật", "Thu thập 100 câu hỏi thật của học sinh tại thư viện, xây bộ luật, đo tỉ lệ trả lời đúng và chuyển câu khó cho cô thủ thư.")],
  res=[("layers", "", "Phiếu học tập", "Viết luật, chuẩn hóa câu, thử chatbot trên giấy.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 20", "Máy tìm đoạn văn liên quan rồi mới trả lời, có ghi nguồn.", "../20-hoi-dap/index.html")],
  prev=("34-giay-quy", "34"), nextp=("36-bo-canh-cung", "36"),
)
