D = dict(
  out="du-an/13-no-ron/index.html", num="13", grade="8", title="Dự án 13 · Nơ-ron đầu tiên: có nên đi chơi?",
  scripts=["neuron.js"],
  h1='Nơ-ron đầu tiên: <span class="hl-word">có nên đi chơi?</span>',
  lead="Chiều thứ bảy, em quyết định có đi chơi hay không dựa vào ba điều: trời có nắng, có bạn đi cùng, đã làm xong bài tập chưa. Một nơ-ron nhân tạo làm đúng việc đó: nhân mỗi điều với một trọng số, cộng lại, so với một ngưỡng. Em sẽ chỉnh nơ-ron bằng tay, cho nó tự học theo quy tắc của mẹ, rồi gặp bài toán nổi tiếng mà một nơ-ron không bao giờ học được.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px"><div class="seg" id="ruleBtns"><button class="btn small" data-r="mom">Quy tắc của mẹ</button><button class="btn small ghost" data-r="and">VÀ</button><button class="btn small ghost" data-r="or">HOẶC</button><button class="btn small ghost" data-r="xor">Chỉ một trong hai</button></div></div>
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Sơ đồ nơ-ron với ba đầu vào, trọng số, tổng, ngưỡng và bảng chân trị"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">MỘT NƠ-RON</span></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn small accent" id="btnLearn"><i data-i="cpu"></i>Cho nơ-ron tự học</button><button class="btn small ghost" id="btnZero"><i data-i="reset"></i>Xóa trọng số về 0</button></div>
        <p class="small muted" style="margin:8px 0 0">Bấm vào ba vòng tròn đầu vào để bật, tắt. Bấm vào cột <b>Đúng ra</b> trong bảng để tự đặt quy tắc riêng.</p></div>
      {{GUIDE}}
      <div class="card" style="margin-top:6px">
        <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Trọng số và ngưỡng</h2>
        <div class="grid g2" style="gap:6px 22px">
          <label class="ctl"><span>w₁: trời nắng</span><b id="w1V"></b><input type="range" id="w1" min="-3" max="3" step="0.5"></label>
          <label class="ctl"><span>w₂: có bạn đi cùng</span><b id="w2V"></b><input type="range" id="w2" min="-3" max="3" step="0.5"></label>
          <label class="ctl"><span>w₃: đã làm xong bài</span><b id="w3V"></b><input type="range" id="w3" min="-3" max="3" step="0.5"></label>
          <label class="ctl"><span>Ngưỡng θ</span><b id="thV"></b><input type="range" id="th" min="-3" max="6" step="0.5"></label>
        </div>
        <div class="toggles"><label class="tog"><input type="checkbox" id="optHidden"><span>Dùng mạng 2 lớp (thêm 2 nơ-ron ẩn)</span></label></div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của nơ-ron</div>
      <div class="metric-row"><div class="metric"><span>QUYẾT ĐỊNH</span><b id="bOut">—</b></div><div class="metric"><span>ĐÚNG / SỐ DÒNG</span><b id="bAcc">—</b></div></div>
      <div class="lbl" style="margin-top:12px">PHÉP TÍNH</div><div id="bCalc" class="calc"></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>VÒNG HỌC</span><b id="bEp">0</b></div><div class="metric"><span>LẦN CHỈNH</span><b id="bUpd">0</b></div></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Mỗi đầu vào là <b style="color:#5ef2d6">1</b> (có) hoặc <b>0</b> (không). Nơ-ron trả lời <b style="color:#5ef2d6">1: đi chơi</b> khi tổng có trọng số đạt ngưỡng.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Số dòng nơ-ron trả lời sai sau mỗi vòng học</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Bấm vào ba vòng tròn bên trái để đổi tình huống. Kéo các <b>trọng số</b> và <b>ngưỡng</b> sao cho cột <b>Nơ-ron</b> trong bảng khớp hết với cột <b>Đúng ra</b>.",
  lessons=["Tin học 8 · Biểu thức logic: VÀ, HOẶC, KHÔNG", "Tin học 8 · Cấu trúc rẽ nhánh", "Toán 8 · Biểu thức, giá trị của biểu thức"],
  mission_h2="Hiểu viên gạch nhỏ nhất của trí tuệ nhân tạo",
  mission_q="Một phép nhân, một phép cộng, một phép so sánh: như vậy đã \"thông minh\" chưa?",
  mission_p="Em sẽ <b>tự chỉnh</b> trọng số và ngưỡng để nơ-ron làm phép VÀ, HOẶC và quy tắc của mẹ, xem nơ-ron <b>tự học</b> từ bảng ví dụ, rồi khám phá vì sao một nơ-ron không học được phép \"chỉ một trong hai\" và mạng nhiều nơ-ron giải quyết thế nào.",
  minutes="45 phút · 1 tiết học",
  checklist=[("hand", "Tự chỉnh nơ-ron đúng cả 8 dòng một quy tắc"), ("learn", "Xem nơ-ron tự học tới khi đúng hết"), ("custom", "Tự đặt một quy tắc riêng trong bảng"), ("soi", "Soi tới bước So với ngưỡng"), ("broke", "Gặp một bài nơ-ron không học được"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Một nơ-ron suy nghĩ như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng đúng trọng số và tình huống hiện tại.",
  soi_guide="Một nơ-ron chỉ làm <b>nhân, cộng, so sánh</b>. Hàng tỉ nơ-ron như thế ghép lại thành những AI lớn!",
  cards=[
    dict(no="T1", tag="Học máy", title="Trọng số, tổng và ngưỡng",
      svg='<circle cx="30" cy="30" r="14" class="f-mint"/><circle cx="30" cy="62" r="14" class="f-line"/><circle cx="30" cy="94" r="14" class="f-mint"/><path d="M44 30L130 62M44 62L130 62M44 94L130 62" class="s-violet" stroke-width="3"/><text x="70" y="36" font-size="10" class="t-mono f-violet">×1</text><text x="70" y="98" font-size="10" class="t-mono f-violet">×2</text><circle cx="150" cy="62" r="24" class="f-violet"/><text x="140" y="67" font-size="13" fill="#fff" font-weight="800">Σ=3</text><path d="M174 62h30" class="s-ink" stroke-width="2.5" marker-end="url(#arV)"/><text x="206" y="58" font-size="11" class="f-mint" font-weight="800">≥ 3 → 1</text>',
      p="Mỗi đầu vào (0 hoặc 1) được nhân với một <b>trọng số</b>: điều quan trọng có trọng số lớn, điều làm em không muốn đi có trọng số âm. Nơ-ron <b>cộng</b> lại rồi so với <b>ngưỡng</b>: đạt ngưỡng thì trả lời 1.",
      ex="Chấm thi đỗ: điểm Toán nhân 2, điểm Văn nhân 2, điểm Anh nhân 1, cộng lại từ 24 trở lên thì đỗ."),
    dict(no="T2", tag="Học máy", cls="amber", title="Tự học bằng cách sửa sai",
      svg='<rect x="16" y="20" width="96" height="26" rx="6" class="f-coral" opacity=".85"/><text x="24" y="38" font-size="11" fill="#fff">trả lời 0, đúng ra 1</text><path d="M120 33h24" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="150" y="20" width="96" height="26" rx="6" class="f-mint" opacity=".85"/><text x="158" y="38" font-size="11" fill="#062b27">tăng w, giảm θ</text><text x="16" y="80" font-size="11" class="f-ink">lặp qua bảng ví dụ tới khi không còn sai</text>',
      p="Nơ-ron xem từng dòng trong bảng ví dụ. Nếu trả lời <b>0 mà đúng ra là 1</b>, nó tăng trọng số của các đầu vào đang bật và hạ ngưỡng; nếu ngược lại thì làm ngược lại. Lặp tới khi không còn dòng sai.",
      ex="Tập ném bóng vào rổ: ném thiếu thì lần sau ném mạnh hơn, ném quá thì nhẹ tay hơn."),
    dict(no="T3", tag="Giới hạn", cls="coral", title="Một nơ-ron chỉ vẽ được đường thẳng",
      svg='<circle cx="40" cy="90" r="8" class="f-coral"/><circle cx="160" cy="30" r="8" class="f-coral"/><circle cx="40" cy="30" r="8" class="f-mint"/><circle cx="160" cy="90" r="8" class="f-mint"/><path d="M20 70L190 20" class="s-violet" stroke-width="2.5" stroke-dasharray="5 4"/><text x="196" y="64" font-size="12" class="f-coral" font-weight="800">?</text>',
      p="Một nơ-ron chia các tình huống bằng <b>một đường thẳng</b>. Phép \"chỉ một trong hai\" (gọi là XOR) cần hai đường nên một nơ-ron không học được. Ghép <b>nhiều nơ-ron thành nhiều lớp</b> thì làm được: đó là <b>mạng nơ-ron</b>.",
      ex="Một chiếc kéo cắt thẳng một nhát không thể tách bốn ô cờ đen trắng xen kẽ; cần nhiều nhát cắt."),
  ],
  real=[("cpu", "", "Mạng nơ-ron sâu", "Nhận dạng ảnh, dịch tiếng nói, trò chuyện… đều do hàng triệu tới hàng tỉ nơ-ron như thế này ghép thành nhiều lớp."),
        ("heart", "mint", "Lấy cảm hứng từ não", "Nơ-ron thần kinh nhận tín hiệu qua nhiều nhánh, đủ mạnh thì phát tín hiệu đi: nơ-ron nhân tạo bắt chước ý tưởng này."),
        ("code", "amber", "Từ biểu thức logic tới AI", "Phép VÀ, HOẶC em viết trong lệnh nếu… thì… cũng làm được bằng một nơ-ron với trọng số phù hợp.")],
  breaks_h2="Thử thách: tìm bài nơ-ron không học được!",
  breaks_guide="Không phải bài nào một nơ-ron cũng học được. Thử ba tình huống này và xem biểu đồ số dòng sai!",
  breaks=[
    dict(icon="repeat", key="xor", title="Chỉ một trong hai", p="Quy tắc mới: đi chơi khi <b>trời nắng</b> hoặc <b>có bạn</b>, nhưng <b>không phải cả hai</b> (cả hai thì đông quá!).",
      why="Trên mặt phẳng, hai tình huống \"đi\" nằm ở hai góc chéo nhau, hai tình huống \"không đi\" ở hai góc còn lại. <b>Không đường thẳng nào</b> tách được, nên nơ-ron học mãi vẫn sai (biểu đồ không về 0). Bật <b>Dùng mạng 2 lớp</b>: hai nơ-ron ẩn mỗi cái vẽ một đường, nơ-ron cuối ghép lại."),
    dict(icon="alert", key="conflict", title="Dữ liệu mâu thuẫn", p="Cùng một tình huống (nắng, có bạn, làm xong bài) nhưng <b>mẹ nói đi</b>, <b>bố nói không</b>. Cả hai dòng đều vào bảng ví dụ.",
      why="Cùng đầu vào mà hai đáp án khác nhau thì không nơ-ron nào đúng được cả hai: luôn còn ít nhất 1 dòng sai. Trước khi dạy máy, phải thống nhất dữ liệu. Bấm <b>Tắt mọi sự cố</b> để bỏ dòng của bố."),
    dict(icon="eye", key="missing", title="Thiếu thông tin", p="Nơ-ron <b>không được hỏi</b> \"đã làm xong bài chưa\" (đầu vào thứ ba bị ngắt), nhưng quy tắc của mẹ lại phụ thuộc vào điều đó.",
      why="Hai tình huống giống hệt nhau ở hai đầu vào còn lại nhưng đáp án khác nhau, nên nơ-ron không thể phân biệt. Máy không học được điều mà dữ liệu không cho nó biết. Nối lại đầu vào bằng <b>Tắt mọi sự cố</b>."),
  ],
  badge="Kỹ Sư Nơ-ron", badge_p="Em đã mở khóa 3 thẻ kiến thức: Trọng số, tổng và ngưỡng · Tự học bằng cách sửa sai · Một nơ-ron chỉ vẽ được đường thẳng.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Nơ-ron chọn món ăn", "Chọn 3 điều (đói không, trời lạnh không, có tiền không) và tự đặt trọng số, ngưỡng để quyết định có ăn phở không. Thử với 8 tình huống."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Nơ-ron bằng Scratch hoặc Python", "Viết chương trình nhận 3 số 0/1, tính tổng có trọng số và in ra quyết định. Thêm vòng lặp để nơ-ron tự học từ bảng ví dụ."),
       (3, "Ý TƯỞNG KHKT", "Nơ-ron tưới cây", "Dùng cảm biến độ ẩm đất, ánh sáng, giờ trong ngày làm đầu vào cho một nơ-ron quyết định bật máy bơm, cho nó tự học từ nhật ký tưới của em.")],
  res=[("layers", "", "Phiếu học tập", "Tính tổng có trọng số, tìm trọng số cho phép VÀ, HOẶC, thử XOR.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 31", "Mạng nơ-ron nhiều lớp nhận dạng chữ số viết tay.", "../31-chu-so/index.html")],
  prev=("12-trai-cay", "12"), nextp=("14-giay-quy", "14"),
)
