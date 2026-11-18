D = dict(
  out="du-an/25-la-chan/index.html", num="25", grade="6", title="Dự án 25 · Lá chắn tin nhắn lừa đảo",
  scripts=["data.js", "shield.js"],
  h1='Lá chắn <span class="hl-word">tin nhắn lừa đảo</span>',
  lead="Hộp thư của em có tin của mẹ, của cô giáo, và có cả tin của kẻ gian. Máy lọc đọc từng tin, chấm điểm nghi ngờ dựa trên những từ nó đã học từ các ví dụ, rồi quyết định chặn hay cho qua. Em sẽ dạy máy, chỉnh máy, và thấy vì sao em vẫn là lá chắn cuối cùng.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="phone vf" id="phone"><div class="phone-top"><span class="live-dot"></span><b>Hộp thư của em</b><span class="spacer"></span><span class="chip" id="inboxChip">0 tin</span></div><ul class="inbox" id="inbox" aria-live="polite"></ul></div>
      <div class="play-panel"><label for="tryText" class="small" style="display:block;margin-bottom:6px"><b>Thử viết một tin nhắn</b> để máy chấm điểm:</label>
        <textarea id="tryText" rows="2" class="tryarea" placeholder="Ví dụ: Chúc mừng bạn trúng thưởng, bấm link để nhận quà"></textarea>
        <p class="ask" id="askText" aria-live="polite" style="margin:10px 0 0;font-size:1rem"></p></div>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>Ngưỡng chặn: tin có điểm từ mức này trở lên bị chặn</span><b id="thrV"></b><input type="range" id="thr" min="-4" max="12" step="0.5"></label>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optNorm"><span>Chuẩn hóa chữ trước khi đọc</span></label></div>
          <p class="small muted" style="margin:10px 0 0">Chuẩn hóa: bỏ dấu chấm, gạch xen giữa chữ và đổi số giống chữ (0 thành o) để đọc ra từ thật.</p>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm mint"><i data-i="book"></i></span>Máy học từ ví dụ</h2>
          <p class="small" style="margin:0 0 8px" id="trainInfo"></p>
          <div class="btn-row"><button class="btn small ghost" id="btnShowTrain"><i data-i="layers"></i>Xem các tin máy đã học</button><button class="btn small ghost" id="btnResetTeach"><i data-i="reset"></i>Xóa nhãn em đã dạy</button></div>
          <ul class="train-list" id="trainList" hidden></ul>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não máy lọc</div>
      <div class="metric-row"><div class="metric"><span>ĐÃ CHẶN</span><b id="bBlocked">—</b></div><div class="metric"><span>ĐÚNG</span><b id="bAcc">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>CHẶN NHẦM TIN THẬT</span><b id="bFP">—</b></div><div class="metric"><span>LỌT LƯỚI TIN LỪA</span><b id="bFN">—</b></div></div>
      <div class="lbl" style="margin-top:12px">TỪ ĐÁNG NGHI NHẤT (MÁY TỰ HỌC)</div><div class="kw" id="bBad"></div>
      <div class="lbl" style="margin-top:10px">TỪ HAY GẶP Ở TIN THẬT</div><div class="kw" id="bGood"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Điểm của tin = cộng điểm các từ trong tin. Từ <b style="color:#ff8f6b">đỏ</b> làm tăng điểm nghi ngờ, từ <b style="color:#5ef2d6">xanh</b> làm giảm.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Điểm nghi ngờ của từng tin trong hộp thư và ngưỡng chặn</b></div><canvas id="chart" width="1100" height="230"></canvas></div>''',
  play_guide="Mỗi tin có một <b>điểm nghi ngờ</b>. Tin nào điểm cao hơn ngưỡng sẽ bị chặn. Máy chấm có đúng không? Nếu sai, hãy bấm nút dưới tin để <b>dạy máy</b>!",
  lessons=["Tin học 6 · An toàn thông tin trên Internet", "Tin học 6 · Đạo đức, văn hóa trong môi trường số", "GDCD 6 · Ứng phó với tình huống nguy hiểm"],
  mission_h2="Hiểu máy lọc tin nhắn, và biết tự bảo vệ mình",
  mission_q="Máy lọc tin nhắn lừa đảo có chặn được mọi kẻ gian không?",
  mission_p="Em sẽ xem máy <b>chấm điểm</b> từng tin, chỉnh <b>ngưỡng chặn</b>, <b>dạy máy</b> bằng cách dán nhãn, và tìm ra những mánh kẻ gian dùng để <b>lách</b> máy lọc. Cuối cùng, em biết những dấu hiệu để tự nhận ra tin lừa đảo.",
  minutes="45 phút · 1 tiết học",
  checklist=[("read", "Xem máy chấm điểm hộp thư"), ("test", "Viết thử một tin nhắn cho máy chấm"), ("teach", "Dạy máy bằng cách dán nhãn một tin"), ("soi", "Soi tới bước Học điểm từ ví dụ"), ("broke", "Làm máy lọc sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy lọc quyết định như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng tin nhắn em vừa viết, hoặc một tin mẫu.",
  soi_guide="Máy lọc không hiểu tin nhắn như em. Nó chỉ <b>tách từ, tra điểm, cộng lại</b> rồi so với ngưỡng. Cùng xem nhé!",
  cards=[
    dict(no="T1", tag="Cách AI đọc chữ", title="Từ khóa và điểm nghi ngờ",
      svg='<g font-size="12" font-weight="700"><rect x="14" y="20" width="62" height="24" rx="6" class="f-coral"/><text x="22" y="37" fill="#fff">trúng</text><rect x="82" y="20" width="76" height="24" rx="6" class="f-coral"/><text x="90" y="37" fill="#fff">mã otp</text><rect x="164" y="20" width="44" height="24" rx="6" class="f-mint"/><text x="172" y="37" fill="#062b27">nhé</text></g><text x="16" y="70" font-size="12" class="t-mono f-coral">+2.1</text><text x="84" y="70" font-size="12" class="t-mono f-coral">+2.4</text><text x="166" y="70" font-size="12" class="t-mono f-mint">−1.6</text><text x="16" y="104" font-size="13" class="f-ink" font-weight="800">Tổng: 2.9 điểm</text>',
      p="Máy tách tin nhắn thành <b>từ</b> và cặp từ, tra xem mỗi từ được bao nhiêu <b>điểm nghi ngờ</b>, rồi <b>cộng lại</b>. Từ hay gặp trong tin lừa đảo (trúng thưởng, mã OTP, chuyển khoản gấp) có điểm cao.",
      ex="Cô giáo chấm bài trắc nghiệm: mỗi câu đúng cộng điểm, cộng hết lại thành điểm bài. Máy lọc cũng cộng điểm như vậy."),
    dict(no="T2", tag="Quyết định", cls="amber", title="Ngưỡng: chặn nhầm và lọt lưới",
      svg='<path d="M14 70h232" class="s-line" stroke-width="2"/>' + ''.join(f'<circle cx="{x}" cy="{y}" r="7" class="{c}"/>' for x, y, c in [(30, 70, "f-mint"), (60, 70, "f-mint"), (92, 70, "f-mint"), (120, 70, "f-coral"), (150, 70, "f-mint"), (178, 70, "f-coral"), (206, 70, "f-coral"), (232, 70, "f-coral")]) + '<path d="M140 30v70" class="s-violet" stroke-width="3" stroke-dasharray="5 4"/><text x="146" y="30" font-size="11" class="f-violet" font-weight="700">ngưỡng</text><text x="16" y="108" font-size="10" class="t-mono f-mint">cho qua</text><text x="196" y="108" font-size="10" class="t-mono f-coral">chặn</text>',
      p="Tin có điểm từ <b>ngưỡng</b> trở lên thì bị chặn. Ngưỡng <b>thấp</b>: chặn được nhiều tin lừa nhưng dễ <b>chặn nhầm</b> tin thật của người thân. Ngưỡng <b>cao</b>: ít chặn nhầm nhưng nhiều tin lừa <b>lọt lưới</b>. Không có ngưỡng nào hoàn hảo.",
      ex="Bảo vệ trường kiểm tra quá kỹ thì phụ huynh phải chờ lâu, kiểm tra quá lỏng thì người lạ dễ vào."),
    dict(no="T3", tag="Học máy", cls="coral", title="Máy học từ ví dụ có nhãn",
      svg='<rect x="14" y="16" width="100" height="26" rx="6" class="f-coral" opacity=".85"/><text x="22" y="34" font-size="11" fill="#fff">lừa đảo: 10 tin</text><rect x="14" y="50" width="100" height="26" rx="6" class="f-mint" opacity=".85"/><text x="22" y="68" font-size="11" fill="#062b27">an toàn: 10 tin</text><path d="M122 46h30" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><text x="162" y="40" font-size="11" class="f-ink" font-weight="700">"otp": 3 / 0</text><text x="162" y="62" font-size="11" class="f-coral" font-weight="700">điểm cao</text>',
      p="Không ai gõ điểm cho từng từ. Máy đếm mỗi từ xuất hiện trong bao nhiêu tin <b>đã được dán nhãn</b> lừa đảo và bao nhiêu tin an toàn, rồi tự tính điểm. Gặp kiểu lừa <b>mới</b>, máy chỉ giỏi lên khi có người <b>dán nhãn thêm ví dụ</b>.",
      ex="Bấm \"Báo cáo thư rác\" trong hộp thư điện tử chính là dán nhãn, giúp máy lọc của mọi người học thêm."),
  ],
  real=[("shield", "", "Lọc thư rác", "Hộp thư điện tử tự đưa thư quảng cáo, thư lừa đảo vào mục Thư rác nhờ máy đã học từ hàng triệu thư được báo cáo."),
        ("msg", "mint", "Cảnh báo tin nhắn, cuộc gọi lạ", "Điện thoại có thể gắn nhãn \"nghi lừa đảo\" cho số lạ hoặc tin nhắn có đường link đáng ngờ."),
        ("alert", "amber", "Em là lá chắn cuối cùng", "Không đưa mã OTP cho bất kỳ ai, không bấm link lạ, gọi lại cho người thân bằng số quen trước khi chuyển tiền.")],
  breaks_h2="Thử thách: hãy làm máy lọc sai!",
  breaks_guide="Kẻ gian luôn tìm cách <b>lách</b> máy lọc, còn máy lọc chỉnh quá tay lại <b>chặn nhầm</b> người thân. Thử xem nào!",
  breaks=[
    dict(icon="code", key="obf", title="Lách từ khóa", p="Kẻ gian viết <b>\"tr.ú.n.g th.ư.ở.n.g\"</b>, <b>\"0TP\"</b>, <b>\"ch-uyển kh-oản\"</b>. Người đọc vẫn hiểu, nhưng máy lọc thì sao?",
      why="Máy tra điểm theo <b>đúng từng chữ</b> đã học. \"tr.ú.n.g\" hay \"0TP\" là những chữ lạ, không có điểm, nên tin lọt lưới. Bật <b>Chuẩn hóa chữ trước khi đọc</b>: máy bỏ dấu chấm, gạch và đổi 0 thành o, nhận ra từ thật."),
    dict(icon="heart", key="low", title="Ngưỡng quá thấp", p="Để chặn cho chắc, ngưỡng bị hạ xuống rất thấp. Tin của <b>mẹ</b> nhắc chuyển khoản tiền điện xuất hiện.",
      why="Ngưỡng thấp quá thì chỉ cần vài từ như \"chuyển khoản\" là tin bị chặn, kể cả tin thật của mẹ. Kéo <b>ngưỡng</b> lên lại, hoặc bấm <b>Tin an toàn</b> dưới tin của mẹ để dạy máy. Luôn phải cân bằng giữa chặn nhầm và lọt lưới."),
    dict(icon="sparkle", key="new", title="Kiểu lừa mới", p="Xuất hiện kiểu lừa máy <b>chưa từng thấy</b>: đòi quét mã QR để đóng phí, mời làm cộng tác viên phải đóng tiền giữ chỗ.",
      why="Máy chỉ biết những gì có trong ví dụ đã học. Các từ \"quét QR\", \"cộng tác viên\", \"giữ chỗ\" chưa có điểm nên tin lọt lưới. Bấm <b>Tin lừa đảo</b> dưới hai tin đó: máy học thêm và lần sau nhận ra kiểu lừa này."),
  ],
  badge="Lá Chắn Số", badge_p="Em đã mở khóa 3 thẻ kiến thức: Từ khóa và điểm nghi ngờ · Ngưỡng: chặn nhầm và lọt lưới · Máy học từ ví dụ có nhãn.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Bộ sưu tập dấu hiệu lừa đảo", "Cùng bố mẹ liệt kê 5 dấu hiệu của tin nhắn lừa đảo (đòi mã OTP, giục gấp, quà quá hời…). Dán lên tủ lạnh để cả nhà cùng nhớ."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Bộ dữ liệu của lớp", "Mỗi bạn tự viết (không chép tin thật có số điện thoại) 3 tin lừa đảo và 3 tin an toàn. Gộp lại, thử dán nhãn trên trang và đo máy lọc đúng bao nhiêu phần trăm."),
       (3, "Ý TƯỞNG KHKT", "Trợ lý cảnh báo lừa đảo cho ông bà", "Thiết kế một trợ lý đọc tin nhắn và nhắc người cao tuổi bằng lời nói khi gặp từ đáng ngờ, có nút gọi nhanh cho con cháu để hỏi lại.")],
  res=[("layers", "", "Phiếu học tập", "Chấm điểm tin nhắn bằng tay, chọn ngưỡng, nhận diện dấu hiệu lừa đảo.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 17", "Máy hiểu cảm xúc trong câu bằng cách biến từ thành số.", "../17-cam-xuc/index.html")],
  prev=("24-robot-hoc", "24"), nextp=("26-doan-hinh", "26"),
)
