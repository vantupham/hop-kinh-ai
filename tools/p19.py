D = dict(
  out="du-an/19-anh-that/index.html", num="19", grade="9", title="Dự án 19 · Ảnh thật hay ảnh ghép?",
  scripts=["photo.js"],
  h1='Ảnh thật hay <span class="hl-word">ảnh ghép</span>? Làm thám tử kiểm chứng',
  lead="Trên mạng có ảnh thật, ảnh bị ghép và ảnh do AI tạo ra từ một câu lệnh. Em sẽ dùng bộ đồ nghề của thám tử: kính lúp, bản đồ nhiễu, thước kẻ hướng bóng, máy dò tự động và kiểm tra nguồn, để xét 6 bức ảnh. Rồi em sẽ thấy vì sao một công cụ thôi là chưa đủ, và vì sao kiểm chứng nguồn luôn là bước quan trọng nhất.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Bức ảnh đang kiểm tra. Bấm vào chỗ nghi ngờ để tìm dấu vết; bật kính lúp để phóng to."></canvas><div class="stage-tag"><span class="live-dot"></span><span id="imgTag">ẢNH 1/6</span></div></div>
      <div class="play-panel"><p class="small" style="margin:0 0 8px"><b>Chọn ảnh cần kiểm tra:</b></p><div class="btn-row" id="gallery"></div>
        <p class="small" style="margin:12px 0 8px"><b>Kết luận của em về ảnh này:</b></p><div class="btn-row" id="verdicts"><button class="btn small" type="button" data-v="real"><i data-i="checkCircle"></i>Ảnh thật</button><button class="btn small" type="button" data-v="edit"><i data-i="layers"></i>Bị ghép, sửa</button><button class="btn small" type="button" data-v="ai"><i data-i="sparkle"></i>Do AI tạo</button><button class="btn small ghost" type="button" id="btnSource"><i data-i="globe"></i>Kiểm tra nguồn</button></div></div>
      <p class="ask" id="askText" aria-live="polite" style="margin:12px 0 0;font-size:1.02rem"></p>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>Độ phóng của kính lúp</span><b id="zoomV"></b><input type="range" id="zoom" min="2" max="6" step="1"></label>
          <label class="ctl"><span>Chất lượng ảnh (bị nén khi đăng lại nhiều lần)</span><b id="qualV"></b><input type="range" id="qual" min="1" max="4" step="1"></label>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="scan"></i></span>Đồ nghề thám tử</h2>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optLens"><span>Kính lúp (rê chuột hoặc chạm lên ảnh)</span></label><label class="tog"><input type="checkbox" id="optNoise"><span>Bản đồ nhiễu (hạt li ti của máy ảnh)</span></label><label class="tog"><input type="checkbox" id="optShadow"><span>Kẻ hướng bóng đổ</span></label></div>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Hồ sơ thám tử</div>
      <div class="metric-row"><div class="metric"><span>MÁY DÒ TỰ ĐỘNG NÓI</span><b id="bDet" style="font-size:.95rem">—</b></div><div class="metric"><span>EM KẾT LUẬN ĐÚNG</span><b id="bAcc">0/6</b></div></div>
      <div class="lbl" style="margin-top:12px">DẤU VẾT EM ĐÃ TÌM THẤY</div><div id="bClues" class="calc">Bấm vào chỗ nghi ngờ trên ảnh.</div>
      <div class="lbl" style="margin-top:12px">NGUỒN ẢNH</div><div id="bSrc" class="calc">Chưa kiểm tra. Bấm <b>Kiểm tra nguồn</b>.</div>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Mức nhiễu (hạt li ti) đo được ở 55 vùng của ảnh, tính trực tiếp từ điểm ảnh</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Chọn một ảnh, dùng đồ nghề thám tử để tìm dấu vết, <b>bấm vào chỗ nghi ngờ</b> trên ảnh, kiểm tra nguồn, rồi đưa ra kết luận.",
  lessons=["Tin học 9 · Đánh giá chất lượng thông tin", "GDCD 9 · Sống có trách nhiệm, tôn trọng sự thật", "KHTN 9 · Ánh sáng, bóng đổ (ôn tập)"],
  mission_h2="Kiểm chứng ảnh bằng nhiều cách, không tin vội một công cụ nào",
  mission_q="Máy dò ảnh AI nói một bức ảnh là \"thật\". Em có nên tin ngay không?",
  mission_p="Em sẽ xét 6 bức ảnh bằng <b>kính lúp</b>, <b>bản đồ nhiễu</b>, <b>hướng bóng đổ</b>, <b>máy dò tự động</b> và <b>kiểm tra nguồn</b>, rồi phá máy bằng ảnh <b>đăng lại nhiều lần</b>, ảnh <b>sao chép một vùng</b> và ảnh giả <b>rất giống thật</b>.",
  minutes="45 phút · 1 tiết học",
  checklist=[("tool", "Bật bản đồ nhiễu hoặc kẻ hướng bóng đổ"), ("clue", "Tìm được ít nhất 3 dấu vết trên ảnh"), ("verdict", "Kết luận đúng ít nhất 5 trên 6 ảnh"), ("soi", "Soi tới bước Ảnh do AI tạo"), ("broke", "Làm máy dò tự động kết luận sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Kiểm chứng một bức ảnh: 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng bức ảnh em đang xem.",
  soi_guide="Mỗi bức ảnh số là một bảng số, và mỗi cách tạo ảnh để lại <b>dấu vết</b> khác nhau. Cùng soi nhé!",
  cards=[
    dict(no="T1", tag="Ảnh số", title="Hạt nhiễu: vân tay của máy ảnh",
      svg='<rect x="14" y="20" width="100" height="80" rx="6" fill="#6e8fb0"/><g fill="#fff" opacity=".35"><rect x="20" y="26" width="3" height="3"/><rect x="40" y="50" width="3" height="3"/><rect x="70" y="34" width="3" height="3"/><rect x="96" y="80" width="3" height="3"/><rect x="30" y="86" width="3" height="3"/><rect x="60" y="70" width="3" height="3"/></g><rect x="146" y="20" width="100" height="80" rx="6" fill="#6e8fb0"/><text x="20" y="116" font-size="11" class="f-ink" font-weight="700">thật: có hạt</text><text x="150" y="116" font-size="11" class="f-ink" font-weight="700">quá mịn: đáng ngờ</text>',
      p="Cảm biến máy ảnh luôn tạo ra <b>hạt nhiễu</b> li ti, khá đều trên cả bức ảnh. Vùng bị dán từ ảnh khác thường có mức nhiễu khác hẳn. Ảnh AI tạo thường <b>mịn bất thường</b>. Nhưng ảnh nén, thu nhỏ khi đăng lại cũng mất hạt nhiễu.",
      ex="Bản đồ nhiễu trong dự án tính thật từ các điểm ảnh: mỗi điểm so với trung bình 4 điểm xung quanh."),
    dict(no="T2", tag="Vật lí", cls="amber", title="Ánh sáng và bóng đổ",
      svg='<circle cx="40" cy="30" r="14" class="f-amber"/><rect x="120" y="50" width="12" height="40" class="f-violet"/><path d="M132 90l60 10" stroke="#555" stroke-width="6"/><rect x="200" y="50" width="12" height="40" class="f-coral"/><path d="M200 90l-60 12" stroke="#555" stroke-width="6" opacity=".6"/>',
      p="Ngoài trời chỉ có <b>một Mặt Trời</b>, nên mọi bóng đổ cùng một hướng, ngược phía Mặt Trời. Vật được ghép vào ảnh thường có <b>bóng lệch hướng</b>, ánh sáng sai phía. Ảnh AI tạo đôi khi có bóng đổ lung tung.",
      ex="Em đã học ở KHTN: ánh sáng truyền thẳng, bóng tối nằm phía sau vật, ngược phía nguồn sáng."),
    dict(no="T3", tag="Kiểm chứng", cls="coral", title="Nguồn quan trọng nhất",
      svg='<circle cx="60" cy="60" r="34" fill="none" class="s-violet" stroke-width="4"/><path d="M84 84l26 26" class="s-violet" stroke-width="6"/><text x="130" y="44" font-size="11" class="f-ink" font-weight="700">Ai đăng? Khi nào?</text><text x="130" y="66" font-size="11" class="f-ink" font-weight="700">Ảnh gốc ở đâu?</text><text x="130" y="88" font-size="11" class="f-ink" font-weight="700">Báo chính thống?</text>',
      p="Ảnh giả ngày càng giống thật, máy dò cũng có lúc sai. Vì vậy cần <b>kiểm tra nguồn</b>: ai đăng đầu tiên, khi nào, có ảnh gốc không, báo chí và cơ quan chính thống có đưa tin không. Chưa chắc chắn thì <b>đừng chia sẻ</b>.",
      ex="Tìm kiếm bằng hình ảnh (tìm ảnh ngược) giúp thấy ảnh đã xuất hiện ở đâu, từ khi nào."),
  ],
  real=[("eye", "", "Phóng viên kiểm chứng tin", "Các tòa soạn có nhóm chuyên kiểm tra ảnh, video trước khi đăng, bằng chính những bước em vừa làm."),
        ("shield", "mint", "Chống tin giả", "Ảnh ghép, ảnh AI tạo về thiên tai, sự kiện thường lan nhanh và gây hoang mang; kiểm chứng giúp ngăn tin giả."),
        ("sparkle", "amber", "Đánh dấu ảnh AI", "Một số công cụ tạo ảnh gắn dấu hiệu (nhãn, thông tin ẩn) cho biết ảnh do AI tạo, giúp người xem nhận biết.")],
  breaks_h2="Thử thách: hãy đánh lừa máy dò ảnh!",
  breaks_guide="Máy dò tự động chỉ nhìn mức nhiễu của ảnh. Thử ba cách làm nó kết luận sai!",
  breaks=[
    dict(icon="repeat", key="repost", title="Ảnh đăng lại nhiều lần", p="Ảnh hoàng hôn thật, nhưng đã bị tải về, đăng lại, nén đi nén lại.",
      why="Mỗi lần nén, ảnh mờ đi và mất hạt nhiễu, nên máy dò tưởng là ảnh <b>AI tạo</b>: kết luận sai, có thể làm oan người chụp. Bấm <b>Kiểm tra nguồn</b> để tìm bản gốc chất lượng cao."),
    dict(icon="layers", key="copy", title="Sao chép một vùng", p="Ảnh cánh đồng có một đám mây được <b>sao chép</b> từ chính ảnh đó rồi dán sang chỗ khác.",
      why="Vùng dán mang theo cả hạt nhiễu thật, nên mức nhiễu đều và máy dò nói <b>ảnh thật</b>. Bật <b>kính lúp</b>, so hai đám mây: giống hệt nhau đến từng chi tiết. Bấm vào đám mây bên phải để ghi dấu vết."),
    dict(icon="sparkle", key="perfect", title="Ảnh giả rất giống thật", p="Một ảnh \"mưa đá to bằng quả bóng\" do AI tạo, đã được thêm hạt nhiễu giả và sửa hết lỗi chữ.",
      why="Nhiễu đều, bóng đổ hợp lí, chữ đúng: mọi công cụ kĩ thuật đều nói <b>thật</b>. Chỉ khi <b>kiểm tra nguồn</b> mới thấy: tài khoản lập hôm qua, không có ảnh gốc, không cơ quan khí tượng nào đưa tin."),
  ],
  badge="Thám Tử Hình Ảnh", badge_p="Em đã mở khóa 3 thẻ kiến thức: Hạt nhiễu · Ánh sáng và bóng đổ · Nguồn quan trọng nhất.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Năm câu hỏi trước khi chia sẻ", "Viết thành thẻ nhỏ 5 câu hỏi kiểm chứng ảnh (ai đăng, khi nào, ảnh gốc, báo chính thống, có vô lí không) và dùng thử với 3 ảnh em thấy trên mạng."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Bản đồ nhiễu bằng Python", "Dùng thư viện xử lí ảnh để tính mức nhiễu từng vùng của ảnh tự chụp, rồi ghép thử một vật vào và so sánh bản đồ nhiễu trước, sau."),
       (3, "Ý TƯỞNG KHKT", "Cẩm nang kiểm chứng cho học sinh", "Thu thập 30 ảnh (tự tạo, tự chụp, ảnh công khai), kiểm chứng bằng nhiều công cụ, đo tỉ lệ đúng của từng công cụ và viết cẩm nang cho trường.")],
  res=[("layers", "", "Phiếu học tập", "Bảng kiểm chứng ảnh, tính mức nhiễu, năm câu hỏi trước khi chia sẻ.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 36", "Máy tạo nội dung bằng cách đoán từng phần tiếp theo.", "../36-doan-chu/index.html")],
  prev=("18-hoc-bong", "18"), nextp=("20-tro-ly-lop", "20"),
)
