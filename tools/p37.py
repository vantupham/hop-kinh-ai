D = dict(
  out="du-an/37-may-dich/index.html", num="37", grade="9", title="Dự án 37 · Máy dịch ngây ngô",
  scripts=["dict.js", "mt.js"],
  h1='Máy dịch <span class="hl-word">ngây ngô</span>: vì sao dịch cần ngữ cảnh?',
  lead="\"It is raining cats and dogs\" mà dịch thành \"Nó mưa những con mèo và những con chó\" thì thật buồn cười. Em sẽ mở bên trong một máy dịch Anh – Việt nhỏ, xem nó tra từ điển, chọn nghĩa, sắp xếp lại trật tự từ, rồi tự tay dạy nó nhìn ngữ cảnh và hiểu thành ngữ.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf mt-stage"><canvas id="stage" class="touch" width="880" height="420" aria-label="Ba hàng: câu tiếng Anh, nghĩa máy chọn cho từng từ, câu tiếng Việt sau khi sắp xếp. Bấm vào một từ tiếng Anh để xem các nghĩa của nó."></canvas><div class="stage-tag"><span class="live-dot"></span>MÁY DỊCH ANH → VIỆT</div></div>
      <div class="play-panel"><form class="chatin mt-in" id="mtForm"><label for="mtIn" class="sr-only">Câu tiếng Anh cần dịch</label><input id="mtIn" autocomplete="off" placeholder="Gõ câu tiếng Anh ngắn, ví dụ: I have a red bag"><button class="btn small accent" type="submit"><i data-i="globe"></i>Dịch</button></form>
        <p class="small" style="margin:10px 0 8px"><b>12 câu thử (bấm để dịch):</b></p><div class="btn-row" id="tests"></div></div>
      <p class="ask" id="askText" aria-live="polite" style="margin:12px 0 0;font-size:1.02rem"></p>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>Độ rộng ngữ cảnh (số từ nhìn mỗi bên)</span><b id="winV"></b><input type="range" id="win" min="0" max="6" step="1"></label>
          <p class="small" style="margin:6px 0 0">Vùng tô vàng trên hình là những từ máy được \"nhìn\" khi chọn nghĩa cho từ đang xét.</p>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="cpu"></i></span>Máy dịch biết làm gì?</h2>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optContext" checked><span>Chọn nghĩa theo ngữ cảnh</span></label><label class="tog"><input type="checkbox" id="optIdiom" checked><span>Dùng từ điển thành ngữ</span></label><label class="tog"><input type="checkbox" id="optOrder" checked><span>Sắp xếp lại trật tự từ kiểu tiếng Việt</span></label></div>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy dịch</div>
      <div class="lbl">BẢN DỊCH</div><div id="bOut" class="mt-out">—</div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>DỊCH ĐÚNG / 12 CÂU THỬ</span><b id="bAcc">—</b></div><div class="metric"><span>TỪ ĐANG XÉT</span><b id="bWord" style="font-size:.95rem">—</b></div></div>
      <div class="lbl" style="margin-top:12px">CÁC NGHĨA TRONG TỪ ĐIỂN VÀ ĐIỂM NGỮ CẢNH</div><div id="bSense" class="calc"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Máy <b>không hiểu</b> câu. Nó chọn nghĩa nhờ đếm <b>từ gợi ý</b> nằm gần, và dùng quy tắc để đổi trật tự từ.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Điểm ngữ cảnh của từng nghĩa (số từ gợi ý tìm thấy trong vùng nhìn)</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Bấm một câu thử hoặc gõ câu của em. Sau đó <b>bấm vào một từ tiếng Anh</b> trên hình để xem máy chọn nghĩa nào, vì sao.",
  lessons=["Tiếng Anh 9 · Từ nhiều nghĩa, thành ngữ", "Ngữ văn 9 · Nghĩa của từ trong ngữ cảnh", "Tin học 9 · AI trong đời sống"],
  mission_h2="Hiểu vì sao máy dịch cần ngữ cảnh, và vì sao vẫn cần người kiểm tra",
  mission_q="Từ \"bank\" lúc là ngân hàng, lúc là bờ sông. Máy làm sao biết chọn nghĩa nào?",
  mission_p="Em sẽ dịch 12 câu thử, soi từng bước của máy, chỉnh <b>độ rộng ngữ cảnh</b>, bật tắt <b>từ điển thành ngữ</b> và <b>quy tắc trật tự từ</b>, rồi phá máy bằng thành ngữ, từ nhiều nghĩa và câu nhiều tính từ.",
  minutes="45 phút · 1 tiết học",
  checklist=[("try", "Dịch ít nhất 5 câu"), ("click", "Bấm vào một từ để xem các nghĩa của nó"), ("score", "Làm máy dịch đúng cả 12 câu thử"), ("soi", "Soi tới bước Chọn nghĩa theo ngữ cảnh"), ("broke", "Làm máy dịch sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy dịch theo quy tắc làm việc thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng câu em đang dịch.",
  soi_guide="Máy dịch đơn giản này làm đúng những việc em làm khi dịch bài tập tiếng Anh, chỉ là <b>máy móc</b> hơn. Cùng soi nhé!",
  cards=[
    dict(no="T1", tag="Từ vựng", title="Từ nhiều nghĩa và ngữ cảnh",
      svg='<rect x="80" y="14" width="100" height="30" rx="8" class="f-violet"/><text x="110" y="34" font-size="14" fill="#fff" font-weight="800">bank</text><path d="M110 46 60 76M150 46 200 76" class="s-violet" stroke-width="2.5"/><rect x="14" y="78" width="100" height="28" rx="8" class="f-mint" opacity=".85"/><text x="24" y="97" font-size="12" fill="#062b27" font-weight="800">ngân hàng</text><rect x="146" y="78" width="100" height="28" rx="8" class="f-amber" opacity=".85"/><text x="164" y="97" font-size="12" fill="#1b1f4a" font-weight="800">bờ sông</text>',
      p="Một từ có thể có nhiều nghĩa. Người đọc chọn nghĩa nhờ <b>ngữ cảnh</b>: những từ xung quanh. Máy đơn giản bắt chước bằng cách đếm <b>từ gợi ý</b> (money, river…) nằm gần từ đó, nghĩa nào nhiều gợi ý hơn thì chọn.",
      ex="\"Đường\" trong \"đường phố\" và \"đường mía\" cũng khác nghĩa: em đoán được nhờ từ đi kèm."),
    dict(no="T2", tag="Thành ngữ", cls="amber", title="Cụm từ không dịch từng chữ",
      svg='<text x="14" y="34" font-size="13" class="f-ink" font-weight="700">a piece of cake</text><text x="14" y="62" font-size="12" class="f-coral" font-weight="700">Sai: một miếng của bánh ngọt</text><text x="14" y="90" font-size="12" class="f-mint" font-weight="700">Đúng: dễ như ăn bánh</text>',
      p="<b>Thành ngữ</b> có nghĩa chung của cả cụm, không bằng tổng nghĩa từng chữ. Máy cần một <b>từ điển cụm từ</b>: thấy cả cụm thì dịch cả cụm. Thành ngữ nào chưa có trong từ điển, máy sẽ dịch ngây ngô.",
      ex="\"Ăn cháo đá bát\" dịch từng chữ sang tiếng Anh sẽ khiến người nước ngoài khó hiểu."),
    dict(no="T3", tag="Ngữ pháp", cls="coral", title="Trật tự từ hai ngôn ngữ",
      svg='<text x="14" y="34" font-size="13" class="f-ink" font-weight="700">a small black cat</text><path d="M60 42 60 66M100 42 176 66M140 42 140 66M190 42 100 66" class="s-violet" stroke-width="2"/><text x="14" y="84" font-size="13" class="f-mint" font-weight="700">một con mèo đen nhỏ</text>',
      p="Tiếng Anh đặt tính từ <b>trước</b> danh từ (black cat), tiếng Việt đặt <b>sau</b> (mèo đen). \"My sister\" thành \"chị gái <b>của tôi</b>\". Máy dịch cần <b>quy tắc</b> sắp xếp lại, nếu không câu sẽ lủng củng.",
      ex="Máy dịch hiện đại học trật tự từ từ hàng triệu cặp câu song ngữ thay vì quy tắc viết tay."),
  ],
  real=[("globe", "", "Ứng dụng dịch trên điện thoại", "Học từ hàng triệu cặp câu song ngữ, xét cả câu cùng lúc nên dịch tự nhiên hơn nhiều, nhưng vẫn có lúc sai."),
        ("camera", "mint", "Dịch biển hiệu bằng camera", "Đọc chữ trong ảnh rồi dịch tại chỗ, giúp khách du lịch đọc thực đơn, biển báo."),
        ("book", "amber", "Hỗ trợ học ngoại ngữ", "Máy dịch giúp tra nghĩa nhanh, nhưng em cần tự kiểm tra: nhất là thành ngữ, tên riêng và câu nhiều nghĩa.")],
  breaks_h2="Thử thách: hãy làm máy dịch ngây ngô!",
  breaks_guide="Máy dịch theo quy tắc chỉ giỏi khi có đủ từ điển và quy tắc. Thử ba cách làm nó dịch sai!",
  breaks=[
    dict(icon="msg", key="idiom", title="Thành ngữ", p="Câu: <b>\"It is raining cats and dogs\"</b>, và máy <b>không dùng</b> từ điển thành ngữ.",
      why="Máy dịch từng chữ: \"Nó mưa những con mèo và những con chó\". Cả cụm có nghĩa là mưa rất to. Bật <b>Dùng từ điển thành ngữ</b>: máy nhận ra cả cụm và dịch thành \"Trời mưa như trút nước\"."),
    dict(icon="eye", key="poly", title="Từ nhiều nghĩa", p="Câu: <b>\"We sat on the bank and watched the boats\"</b>, máy chỉ nhìn <b>1 từ</b> mỗi bên.",
      why="Từ gợi ý \"boats\" nằm cách \"bank\" 4 từ, ngoài vùng nhìn. Không thấy gợi ý nào, máy chọn nghĩa mặc định \"ngân hàng\". Kéo <b>độ rộng ngữ cảnh</b> lên 4: máy thấy \"boats\" và chọn \"bờ sông\"."),
    dict(icon="layers", key="order", title="Trật tự từ", p="Câu: <b>\"My sister has a small black cat\"</b>, máy <b>không sắp xếp</b> lại trật tự từ.",
      why="Giữ nguyên trật tự tiếng Anh: \"Của tôi chị gái có một nhỏ đen con mèo\". Bật <b>Sắp xếp lại trật tự từ</b>: tính từ chuyển ra sau danh từ, \"của tôi\" chuyển ra sau \"chị gái\"."),
  ],
  badge="Phiên Dịch Viên Nhí", badge_p="Em đã mở khóa 3 thẻ kiến thức: Từ nhiều nghĩa và ngữ cảnh · Cụm từ không dịch từng chữ · Trật tự từ hai ngôn ngữ.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Săn lỗi máy dịch", "Dùng một ứng dụng dịch thật để dịch 5 thành ngữ tiếng Việt sang tiếng Anh (như \"nước đổ đầu vịt\"). Ghi lại câu nào máy dịch đúng ý, câu nào ngây ngô."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Từ điển ngữ cảnh của lớp", "Cả nhóm chọn 10 từ tiếng Anh nhiều nghĩa trong sách giáo khoa, viết từ gợi ý cho từng nghĩa và thử bằng Python hoặc bảng tính."),
       (3, "Ý TƯỞNG KHKT", "Máy dịch thuật ngữ cho môn học", "Xây bộ từ điển song ngữ thuật ngữ KHTN 9, đo tỉ lệ dịch đúng của máy dịch phổ biến trên 50 câu trong sách, đề xuất cách sửa.")],
  res=[("layers", "", "Phiếu học tập", "Chọn nghĩa theo ngữ cảnh, dịch thành ngữ, sắp xếp trật tự từ.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 17", "Máy biểu diễn nghĩa của từ bằng vector số.", "../17-cam-xuc/index.html")],
  prev=("36-bo-canh-cung", "36"), nextp=("38-hoc-bong", "38"),
)
