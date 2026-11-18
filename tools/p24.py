D = dict(
  out="du-an/24-robot-hoc/index.html", num="24", grade="6", title="Dự án 24 · Robot làm theo lệnh và robot tự học",
  scripts=["robot.js"],
  h1='Robot <span class="hl-word">làm theo lệnh</span> và robot tự học',
  lead="Hai robot cùng phải tới lá cờ trong một mê cung. Robot bên trái làm đúng từng lệnh em viết, không hơn không kém. Robot bên phải không được ai chỉ đường: nó tự đi thử, nhớ lại, và lần sau đi giỏi hơn. Khi mê cung thay đổi, robot nào xoay xở tốt hơn?",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px"><div class="seg" id="mazeBtns"><button class="btn small" data-m="0"><i data-i="map"></i>Mê cung 1</button><button class="btn small ghost" data-m="1"><i data-i="map"></i>Mê cung 2</button><button class="btn small ghost" data-m="2"><i data-i="sparkle"></i>Mê cung mới</button></div></div>
      <div class="stage vf"><canvas id="stage" width="880" height="470" aria-label="Hai mê cung: robot làm theo lệnh bên trái, robot tự học bên phải"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">MÊ CUNG 1</span></div></div>
      <div class="two-col" style="margin-top:12px">
        <div class="play-panel" style="margin:0">
          <h2 class="h-ic" style="font-size:1.05rem;margin:0 0 8px"><span class="ico-box sm"><i data-i="code"></i></span>Chương trình của em</h2>
          <div class="btn-row palette"><button class="btn small ghost" data-b="F"><i data-i="arrowR"></i>Tiến</button><button class="btn small ghost" data-b="L"><i data-i="arrowL"></i>Rẽ trái</button><button class="btn small ghost" data-b="R"><i data-i="repeat"></i>Rẽ phải</button><button class="btn small ghost" data-b="W"><i data-i="blocks"></i>Lặp: bám tường phải</button></div>
          <ol class="prog-list" id="progList" aria-live="polite"></ol>
          <div class="btn-row"><button class="btn small accent" id="btnRun"><i data-i="play"></i>Chạy</button><button class="btn small ghost" id="btnSample"><i data-i="bulb"></i>Gợi ý một chương trình</button><button class="btn small ghost" id="btnClearProg"><i data-i="reset"></i>Xóa</button></div>
          <p class="small muted" style="margin:8px 0 0">Bấm vào một lệnh <b>Tiến</b> để tăng số bước, bấm vào lệnh <b>Rẽ</b> để đổi trái/phải, bấm dấu × để xóa.</p>
        </div>
        <div class="play-panel" style="margin:0">
          <h2 class="h-ic" style="font-size:1.05rem;margin:0 0 8px"><span class="ico-box sm mint"><i data-i="sparkle"></i></span>Robot tự học</h2>
          <div class="btn-row"><button class="btn small accent" id="btnTry"><i data-i="play"></i>Thử 1 lần</button><button class="btn small" id="btnTry20"><i data-i="skip"></i>Thử 20 lần</button><button class="btn small ghost" id="btnForget"><i data-i="reset"></i>Xóa trí nhớ</button></div>
          <label class="ctl" style="margin-top:12px"><span>Tò mò (thỉnh thoảng thử đường mới)</span><b id="epsV"></b><input type="range" id="eps" min="0" max="0.5" step="0.05"></label>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optMem" checked><span>Robot có trí nhớ</span></label><label class="tog"><input type="checkbox" id="optHeat" checked><span>Hiện trí nhớ trên mê cung</span></label></div>
        </div>
      </div>
      <p class="ask" id="askText" aria-live="polite" style="margin:14px 0 0;font-size:1.05rem"></p>
      {{GUIDE}}
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Hai bộ não</div>
      <div class="lbl">ROBOT LÀM THEO LỆNH</div>
      <div class="metric-row"><div class="metric"><span>SỐ LỆNH</span><b id="bCmds">0</b></div><div class="metric"><span>KẾT QUẢ</span><b id="bProg" style="font-size:.95rem">—</b></div></div>
      <div class="lbl" style="margin-top:12px">ROBOT TỰ HỌC</div>
      <div class="metric-row"><div class="metric"><span>SỐ LẦN THỬ</span><b id="bTries">0</b></div><div class="metric"><span>BƯỚC LẦN VỪA RỒI</span><b id="bLast">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>Ô ĐÃ GHI NHỚ</span><b id="bMem">0</b></div><div class="metric"><span>ĐƯỜNG NGẮN NHẤT</span><b id="bBest">—</b></div></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Robot tự học ghi vào mỗi ô nó đã đi qua: <b style="color:#5ef2d6">từ đây tới cờ còn bao nhiêu bước</b>. Lần sau nó đi về phía ô có số nhỏ hơn.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Robot tự học cần bao nhiêu bước ở mỗi lần thử?</b></div><canvas id="chart" width="1100" height="230"></canvas></div>''',
  play_guide="Viết chương trình cho robot bên trái bằng các khối lệnh. Robot bên phải thì cứ để nó <b>tự thử</b>!",
  lessons=["Tin học 6 · Thuật toán", "Tin học 6 · Cấu trúc tuần tự, lặp, rẽ nhánh", "Tin học 6 · Mô tả thuật toán bằng sơ đồ khối"],
  mission_h2="So sánh hai cách làm cho máy giải quyết vấn đề",
  mission_q="Viết lệnh cho máy, hay để máy tự học: cách nào tốt hơn?",
  mission_p="Em sẽ <b>lập trình</b> robot bằng khối lệnh có <b>lặp</b> và <b>rẽ nhánh</b>, xem robot kia <b>tự học</b> bằng cách thử và nhớ, rồi đổi mê cung để thấy điểm mạnh, điểm yếu của mỗi cách.",
  minutes="45 phút · 1 tiết học",
  checklist=[("prog", "Viết chương trình đưa robot tới cờ"), ("loop", "Chạy thuật toán bám tường thành công"), ("learn", "Cho robot tự học tới khi đi đường ngắn nhất"), ("soi", "Soi tới bước Ghi nhớ"), ("broke", "Làm một robot thất bại ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Hai robot suy nghĩ như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng mê cung đang chọn.",
  soi_guide="Một robot đi theo <b>thuật toán</b> do người viết, robot kia tự tìm ra cách đi từ <b>kinh nghiệm</b>. Cùng soi từng robot nhé!",
  cards=[
    dict(no="T1", tag="Thuật toán", title="Dãy lệnh, lặp và rẽ nhánh",
      svg='<rect x="16" y="14" width="80" height="22" rx="6" class="f-violet"/><text x="24" y="29" font-size="11" fill="#fff">Tiến × 3</text><rect x="16" y="42" width="80" height="22" rx="6" class="f-violet"/><text x="24" y="57" font-size="11" fill="#fff">Rẽ phải</text><path d="M140 20l40 22-40 22-40-22z" class="f-amber" opacity=".9" transform="translate(30 10)"/><text x="148" y="56" font-size="10" fill="#1b1f4a" font-weight="700">tường?</text><path d="M210 52h34" class="s-mint" stroke-width="2.5"/><text x="214" y="46" font-size="10" class="f-mint">có</text><path d="M170 74v26" class="s-coral" stroke-width="2.5"/><text x="176" y="96" font-size="10" class="f-coral">không</text>',
      p="<b>Thuật toán</b> là dãy các bước rõ ràng để giải quyết một việc. Ba cách ghép lệnh cơ bản: làm <b>lần lượt</b>, <b>lặp lại</b> nhiều lần, và <b>rẽ nhánh</b> (nếu… thì…) để chọn việc theo tình huống.",
      ex="Công thức nấu mì: đun nước (lần lượt), khuấy tới khi sợi mềm (lặp), nếu thích cay thì thêm ớt (rẽ nhánh)."),
    dict(no="T2", tag="Học máy", cls="amber", title="Học bằng thử và sai",
      svg='<path d="M20 100c30-70 50 10 70-40s40 30 60-20 40 10 60-10" fill="none" class="s-coral" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M20 100 230 28" class="s-mint" stroke-width="3"/><circle cx="20" cy="100" r="6" class="f-violet"/><rect x="226" y="18" width="12" height="16" class="f-amber"/><text x="24" y="20" font-size="10" class="t-mono f-coral">lần 1</text><text x="140" y="90" font-size="10" class="t-mono f-mint">lần 20</text>',
      p="Robot tự học không được ai chỉ đường. Nó <b>đi thử</b>, <b>ghi nhớ</b> những ô đã đi qua và tính mỗi ô còn cách cờ bao xa. Lần sau nó dùng trí nhớ đó, thỉnh thoảng <b>tò mò</b> thử lối mới, nên đường đi ngắn dần.",
      ex="Lần đầu tới trường mới em có thể đi vòng. Sau vài ngày, em tự tìm ra đường tắt và nhớ luôn."),
    dict(no="T3", tag="So sánh", cls="coral", title="Viết lệnh hay để máy học?",
      svg='<rect x="16" y="20" width="100" height="80" rx="10" class="f-violet" opacity=".2"/><text x="26" y="44" font-size="11" class="f-violet" font-weight="700">Viết lệnh</text><text x="26" y="64" font-size="10" class="f-ink">nhanh, chính xác</text><text x="26" y="82" font-size="10" class="f-coral">đổi bài là hỏng</text><rect x="140" y="20" width="104" height="80" rx="10" class="f-mint" opacity=".2"/><text x="150" y="44" font-size="11" class="f-mint" font-weight="700">Tự học</text><text x="150" y="64" font-size="10" class="f-ink">tự thích nghi</text><text x="150" y="82" font-size="10" class="f-coral">cần nhiều lần thử</text>',
      p="Chương trình viết sẵn chạy <b>nhanh và chính xác</b> nhưng chỉ đúng cho tình huống người viết nghĩ tới. Máy tự học <b>thích nghi</b> được với tình huống mới nhưng cần <b>nhiều lần thử</b> và <b>trí nhớ</b>. AI ngày nay thường kết hợp cả hai.",
      ex="Máy tính bỏ túi làm phép chia theo lệnh viết sẵn, luôn đúng. Ứng dụng gõ phím đoán chữ thì tự học thói quen của em."),
  ],
  real=[("robot", "", "Robot hút bụi", "Có loại đi theo luật viết sẵn (gặp tường thì rẽ), có loại vẽ và ghi nhớ bản đồ căn nhà để lần sau đi gọn hơn."),
        ("map", "mint", "Ứng dụng chỉ đường", "Tìm đường ngắn nhất bằng thuật toán, và học từ dữ liệu giao thông để biết giờ nào đường nào hay tắc."),
        ("gamepad", "amber", "Nhân vật trong trò chơi", "Nhân vật máy có thể đi theo kịch bản lập trình sẵn, hoặc được huấn luyện bằng cách chơi thử hàng nghìn ván.")],
  breaks_h2="Thử thách: hãy làm robot thất bại!",
  breaks_guide="Mỗi robot có một điểm yếu riêng. Tìm ra điểm yếu đó, em sẽ hiểu vì sao người ta cần cả hai cách!",
  breaks=[
    dict(icon="map", key="newmaze", title="Đổi mê cung", p="Chương trình đúng cho <b>Mê cung 1</b> được chạy trên <b>Mê cung 2</b>. Robot tự học cũng mang trí nhớ cũ sang.",
      why="Dãy lệnh viết cho mê cung cũ nên đi tới đâu va tường tới đó: robot làm theo lệnh <b>không tự thích nghi</b>. Robot tự học lúc đầu cũng đi lạc vì trí nhớ cũ, nhưng thử vài lần là nó học lại. Thử khối <b>Lặp: bám tường phải</b>: có <b>rẽ nhánh</b> nên chạy được ở cả hai mê cung."),
    dict(icon="code", key="bug", title="Sai một lệnh", p="Chương trình đúng bị đổi <b>một lệnh rẽ</b> từ phải thành trái.",
      why="Máy làm <b>chính xác</b> từng lệnh, kể cả lệnh sai: chỉ một lệnh sai là robot va tường. Lệnh gây lỗi được tô đỏ. Bấm vào lệnh đó để đổi lại. Tìm và sửa lỗi như vậy gọi là <b>gỡ lỗi</b>, việc lập trình viên làm hằng ngày."),
    dict(icon="alert", key="nomem", title="Robot không có trí nhớ", p="Robot tự học bị <b>tắt trí nhớ</b>, rồi thử 20 lần liền.",
      why="Không ghi nhớ thì mỗi lần thử như lần đầu tiên: số bước không giảm (xem biểu đồ). Học nghĩa là <b>dùng kinh nghiệm cũ cho lần sau</b>. Bật lại <b>Robot có trí nhớ</b> và thử tiếp."),
  ],
  badge="Kỹ Sư Robot Nhí", badge_p="Em đã mở khóa 3 thẻ kiến thức: Dãy lệnh, lặp và rẽ nhánh · Học bằng thử và sai · Viết lệnh hay để máy học?",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Robot người", "Vẽ một mê cung trên nền nhà bằng phấn hoặc băng dính. Viết chương trình trên giấy rồi đọc cho một người nhà bịt mắt đi theo."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Cuộc đua hai robot", "Mỗi nhóm thiết kế 3 mê cung bằng nút Mê cung mới. Ghi lại: chương trình bám tường mất bao nhiêu bước, robot tự học cần bao nhiêu lần thử để đi ngắn nhất."),
       (3, "Ý TƯỞNG KHKT", "Robot dò đường bằng cảm biến", "Dùng bộ robot giáo dục có cảm biến khoảng cách để chạy thuật toán bám tường thật, so sánh với robot được điều khiển bằng dãy lệnh cố định.")],
  res=[("layers", "", "Phiếu học tập", "Viết chương trình trên giấy, vẽ sơ đồ khối, mô phỏng robot tự học.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 18", "Robot học bằng phần thưởng với bảng Q.", "../18-me-cung/index.html")],
  prev=("23-xuc-xac", "23"), nextp=("25-la-chan", "25"),
)
