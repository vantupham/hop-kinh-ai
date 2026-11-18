D = dict(
  out="du-an/40-tro-ly-lop/index.html", num="40", grade="9", title="Dự án 40 · Trợ lý lớp học của em",
  scripts=["core.js", "assistant.js"],
  h1='Trợ lý lớp học <span class="hl-word">của em</span>: ghép mọi thứ đã học',
  lead="Dự án tổng kết: em lắp ráp một trợ lý AI cho lớp 9A từ những khối đã học: hiểu câu hỏi bằng từ khóa, tra sổ tay lớp, lọc thông tin riêng tư, biết nói \"mình không biết\", chia nhóm công bằng. Rồi em tự chấm trợ lý theo bốn tiêu chí: hữu ích, trung thực, riêng tư, công bằng, trước khi \"giao\" nó cho cả lớp.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf mt-stage"><canvas id="stage" class="touch" width="880" height="440" aria-label="Sơ đồ trợ lý lớp học: các khối xử lí nối nhau, kết quả từng khối và câu trả lời. Bấm vào khối có công tắc để bật hoặc tắt."></canvas><div class="stage-tag"><span class="live-dot"></span>TRỢ LÝ LỚP 9A</div></div>
      <div class="play-panel"><form class="chatin mt-in" id="askForm"><label for="askIn" class="sr-only">Câu hỏi cho trợ lý</label><input id="askIn" autocomplete="off" placeholder="Hỏi trợ lý, ví dụ: Tuần này tổ nào trực nhật?"><button class="btn small accent" type="submit"><i data-i="send"></i>Hỏi</button></form>
        <p class="small" style="margin:10px 0 8px"><b>12 câu hỏi kiểm thử của lớp (bấm để hỏi):</b></p><div class="btn-row" id="tests"></div></div>
      <p class="ask" id="askText" aria-live="polite" style="margin:12px 0 0;font-size:1.02rem"></p>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>Ngưỡng tự tin (dưới ngưỡng thì chuyển cho cô chủ nhiệm)</span><b id="thV"></b><input type="range" id="th" min="0" max="1" step="0.05"></label>
          <p class="small" style="margin:6px 0 0">Độ tự tin = số từ của câu hỏi khớp với đoạn sổ tay ÷ số từ quan trọng của câu hỏi.</p>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="blocks"></i></span>Các khối có công tắc</h2>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optPriv" checked><span>Khối lọc riêng tư</span></label><label class="tog"><input type="checkbox" id="optConf" checked><span>Khối kiểm tra độ tự tin</span></label><label class="tog"><input type="checkbox" id="optBal" checked><span>Chia nhóm cân bằng sức học</span></label></div>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bảng tự đánh giá</div>
      <div class="metric-row"><div class="metric"><span>HỮU ÍCH</span><b id="sHelp">—</b></div><div class="metric"><span>TRUNG THỰC</span><b id="sHonest">—</b></div></div>
      <div class="metric-row" style="margin-top:10px"><div class="metric"><span>RIÊNG TƯ</span><b id="sPriv">—</b></div><div class="metric"><span>CÔNG BẰNG</span><b id="sFair">—</b></div></div>
      <div class="lbl" style="margin-top:12px">TRỢ LÝ TRẢ LỜI</div><div id="bAns" class="mt-out" style="font-size:.95rem">—</div>
      <div class="lbl" style="margin-top:12px">12 CÂU KIỂM THỬ</div><div id="bTests" class="test-dots"></div>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Bốn tiêu chí tự đánh giá (mục tiêu: cả bốn từ 90% trở lên)</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Hỏi trợ lý một câu, xem câu hỏi đi qua từng khối trên sơ đồ. <b>Bấm vào khối có công tắc</b> để bật, tắt và xem bảng tự đánh giá thay đổi.",
  lessons=["Hoạt động trải nghiệm 9 · Dự án phục vụ lớp học", "Tin học 9 · Giải quyết vấn đề với máy tính", "GDCD 9 · Tôn trọng quyền riêng tư, công bằng"],
  mission_h2="Lắp ráp một trợ lý AI có trách nhiệm cho lớp em",
  mission_q="Một trợ lý \"trả lời được mọi câu\" có phải là trợ lý tốt không?",
  mission_p="Em sẽ hỏi trợ lý 12 câu kiểm thử của lớp, theo dõi câu hỏi đi qua từng khối, chỉnh <b>ngưỡng tự tin</b>, bật tắt <b>lọc riêng tư</b> và <b>chia nhóm cân bằng</b>, rồi phá máy để thấy trợ lý có thể làm lộ thông tin bạn bè, trả lời bừa hoặc chia nhóm bất công. Cuối cùng em viết bản thiết kế trợ lý của riêng lớp mình.",
  minutes="1 tiết học · có dự án nhóm",
  checklist=[("ask", "Hỏi trợ lý ít nhất 6 câu"), ("module", "Bật hoặc tắt một khối trên sơ đồ"), ("score", "Đạt từ 90% trở lên ở cả bốn tiêu chí"), ("soi", "Soi tới bước Biết nói không biết"), ("broke", "Làm trợ lý mắc lỗi ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Trợ lý lớp học được ghép từ những gì? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng câu hỏi em vừa hỏi.",
  soi_guide="Mỗi khối là một điều em đã học trong các dự án trước. Cùng soi nhé!",
  cards=[
    dict(no="T1", tag="Thiết kế", title="Ghép khối thành hệ thống",
      svg='<rect x="10" y="44" width="54" height="34" rx="8" class="f-violet"/><rect x="74" y="44" width="54" height="34" rx="8" class="f-violet"/><rect x="138" y="44" width="54" height="34" rx="8" class="f-amber"/><rect x="202" y="44" width="48" height="34" rx="8" class="f-mint"/><text x="16" y="66" font-size="10" fill="#fff" font-weight="700">Hiểu</text><text x="80" y="66" font-size="10" fill="#fff" font-weight="700">Tra</text><text x="144" y="66" font-size="10" fill="#1b1f4a" font-weight="700">Lọc</text><text x="206" y="66" font-size="10" fill="#062b27" font-weight="700">Đáp</text>',
      p="Hệ thống AI thật hiếm khi là một mô hình duy nhất. Nó là chuỗi <b>khối</b> nối nhau: hiểu câu hỏi, tìm thông tin, lọc, kiểm tra, rồi mới trả lời. Mỗi khối có thể kiểm thử và sửa riêng.",
      ex="Trợ lý của em dùng lại: từ khóa (Dự án 35), tìm đoạn văn (Dự án 20), ngưỡng (Dự án 25), công bằng (Dự án 38)."),
    dict(no="T2", tag="Trách nhiệm", cls="amber", title="Riêng tư và trung thực",
      svg='<rect x="80" y="30" width="100" height="70" rx="12" class="f-amber" opacity=".3"/><path d="M110 56v-10a20 20 0 0 1 40 0v10" class="s-violet" stroke-width="5" fill="none"/><rect x="100" y="56" width="60" height="38" rx="6" class="f-violet"/>',
      p="Trợ lý có thể đọc được dữ liệu riêng (số điện thoại, điểm của từng bạn) nhưng <b>không được tiết lộ</b>. Khi không chắc chắn, trợ lý tốt phải <b>nói \"mình không biết\"</b> và chuyển cho người thật, thay vì trả lời bừa.",
      ex="Nguyên tắc: chỉ đưa vào trợ lý những dữ liệu thật sự cần, và không bao giờ đưa mật khẩu hay thông tin nhạy cảm."),
    dict(no="T3", tag="Đánh giá", cls="coral", title="Tự đánh giá trước khi dùng",
      svg='<rect x="20" y="70" width="40" height="36" class="f-mint"/><rect x="74" y="40" width="40" height="66" class="f-mint"/><rect x="128" y="20" width="40" height="86" class="f-mint"/><rect x="182" y="80" width="40" height="26" class="f-coral"/><path d="M14 30h220" stroke-dasharray="6 4" class="s-violet" stroke-width="2"/>',
      p="Trước khi giao trợ lý cho cả lớp, chấm nó bằng <b>bộ câu kiểm thử</b> theo nhiều tiêu chí: hữu ích, trung thực, riêng tư, công bằng. Một tiêu chí thấp là đủ để chưa được dùng. Sau đó tiếp tục <b>lắng nghe góp ý</b> của các bạn.",
      ex="Các công ty AI cũng thử nghiệm mô hình với rất nhiều câu hỏi khó trước khi phát hành."),
  ],
  real=[("msg", "", "Trợ lý của trường học", "Nhiều trường dùng trợ lý trả lời câu hỏi về lịch học, thủ tục; câu khó vẫn chuyển cho thầy cô."),
        ("lock", "mint", "Bảo vệ dữ liệu cá nhân", "Thông tin cá nhân như số điện thoại, địa chỉ, điểm số được pháp luật bảo vệ; hệ thống AI phải tuân thủ."),
        ("award", "amber", "Cuộc thi KHKT", "Dự án trợ lý có kiểm thử, đánh giá công bằng và riêng tư là đề tài phù hợp cho cuộc thi khoa học kĩ thuật cấp trường.")],
  breaks_h2="Thử thách: hãy làm trợ lý mắc lỗi!",
  breaks_guide="Mỗi khối có một nhiệm vụ. Tắt hoặc chỉnh sai một khối, trợ lý sẽ mắc lỗi ngay. Thử xem!",
  breaks=[
    dict(icon="lock", key="privacy", title="Lộ thông tin riêng", p="Tắt <b>khối lọc riêng tư</b>, rồi hỏi: <b>\"Số điện thoại của bạn Nam là gì?\"</b>",
      why="Trợ lý đọc được danh bạ lớp và đọc luôn số điện thoại, địa chỉ của bạn Nam (số hư cấu): lộ thông tin cá nhân. Bật lại <b>khối lọc riêng tư</b>: trợ lý từ chối lịch sự và gợi ý hỏi trực tiếp."),
    dict(icon="help", key="unsure", title="Trả lời bừa", p="Đặt <b>ngưỡng tự tin = 0</b>, rồi hỏi: <b>\"Năm sau trường có xây bể bơi không?\"</b>",
      why="Sổ tay lớp không có thông tin này, nhưng trợ lý vẫn trả lời bằng đoạn khớp nhất (thời khóa biểu): trả lời <b>sai một cách tự tin</b>. Kéo <b>ngưỡng tự tin</b> lên khoảng 0,4: trợ lý chuyển câu hỏi cho cô chủ nhiệm."),
    dict(icon="layers", key="fair", title="Chia nhóm bất công", p="Tắt <b>chia nhóm cân bằng</b>, rồi nhờ trợ lý chia lớp thành 4 nhóm.",
      why="Trợ lý chia theo thứ tự điểm: nhóm 1 toàn bạn điểm cao, nhóm 4 toàn bạn điểm thấp, trung bình chênh gần 3 điểm. Bật <b>chia nhóm cân bằng</b>: trợ lý chia kiểu \"rắn bò\" (1, 2, 3, 4, 4, 3, 2, 1…), các nhóm gần như bằng sức."),
  ],
  badge="Kĩ Sư AI Có Trách Nhiệm", badge_p="Em đã hoàn thành nhánh THCS và mở khóa 3 thẻ kiến thức: Ghép khối thành hệ thống · Riêng tư và trung thực · Tự đánh giá trước khi dùng.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Sổ tay lớp của em", "Viết 10 đoạn sổ tay cho lớp em (lịch, nội quy, câu lạc bộ…), mỗi đoạn kèm 5 từ khóa. Không đưa thông tin cá nhân của bạn nào."),
       (2, "DỰ ÁN NHÓM · 2 TUẦN", "Trợ lý lớp bằng Python", "Lập trình trợ lý theo 5 khối của dự án, viết 30 câu kiểm thử, chấm theo 4 tiêu chí và trình bày trước lớp, có thầy cô duyệt dữ liệu."),
       (3, "Ý TƯỞNG KHKT", "Trợ lý trường học có trách nhiệm", "Xây trợ lý hỏi đáp cho trường, đo tỉ lệ trả lời đúng, tỉ lệ chuyển câu khó cho người thật, kiểm tra riêng tư và thu thập góp ý của 100 học sinh.")],
  res=[("layers", "", "Phiếu học tập", "Bản thiết kế trợ lý của nhóm, câu kiểm thử, bảng tự đánh giá.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, gợi ý tổ chức dự án nhóm, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 20", "Trợ lý hỏi đáp tìm đoạn văn trong sách rồi trả lời, có ghi nguồn.", "../20-hoi-dap/index.html")],
  prev=("39-anh-that", "39"), nextp=None,
)
