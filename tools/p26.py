D = dict(
  out="du-an/26-doan-hinh/index.html", num="26", grade="7", title="Dự án 26 · Đoán hình em vẽ",
  scripts=["knn.js"],
  h1='Máy đoán hình em vẽ bằng <span class="hl-word">hàng xóm gần nhất</span>',
  lead="Em vẽ một hình bằng một nét. Máy đo hình đó bằng hai con số, đặt nó thành một chấm trên mặt phẳng, rồi nhìn xem các chấm mẫu ở gần nhất là hình gì. Không có công thức nào cả: máy chỉ nhớ ví dụ và hỏi ý kiến \"hàng xóm\".",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Khung vẽ bên trái, mặt phẳng đặc trưng bên phải"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">MẶT PHẲNG ĐẶC TRƯNG</span></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn small accent" id="btnHelp"><i data-i="sparkle"></i>Máy vẽ giúp một hình</button><button class="btn small ghost" id="btnClear"><i data-i="reset"></i>Xóa nét vẽ</button>
        <label class="small" style="display:inline-flex;align-items:center;gap:6px">Đây là <select id="teachSel"></select></label><button class="btn small ghost" id="btnTeach"><i data-i="book"></i>Thêm làm mẫu</button></div></div>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>k: hỏi bao nhiêu hàng xóm</span><b id="kV"></b><input type="range" id="k" min="1" max="15" step="2"></label>
          <label class="ctl"><span>Nói "không chắc" khi hàng xóm gần nhất xa hơn</span><b id="maxdV"></b><input type="range" id="maxd" min="0.05" max="0.6" step="0.05"></label>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="chart"></i></span>Máy đo hình bằng gì?</h2>
          <label class="small" style="display:flex;gap:8px;align-items:center;margin-bottom:8px">Trục ngang <select id="fx"></select></label>
          <label class="small" style="display:flex;gap:8px;align-items:center">Trục dọc <select id="fy"></select></label>
          <p class="small muted" style="margin:10px 0 0">Máy chỉ dùng <b>hai số</b> trên hai trục này để so sánh các hình.</p>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy</div>
      <div class="metric-row"><div class="metric"><span>MÁY ĐOÁN</span><b id="bGuess">—</b></div><div class="metric"><span>ĐÚNG / 40 HÌNH KIỂM TRA</span><b id="bAcc">—</b></div></div>
      <div class="lbl" style="margin-top:12px">PHIẾU BẦU CỦA HÀNG XÓM</div><div class="conf" id="bVotes"></div>
      <div class="lbl" style="margin-top:12px">ĐẶC TRƯNG CỦA HÌNH EM VẼ</div><div id="bFeat" style="color:#fff;font-size:.86rem;line-height:1.7"></div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>SỐ MẪU MÁY NHỚ</span><b id="bN">—</b></div><div class="metric"><span>HÀNG XÓM GẦN NHẤT CÁCH</span><b id="bDist">—</b></div></div>
      <button class="btn small ghost" id="btnResetTrain" style="margin-top:10px"><i data-i="reset"></i>Trả lại bộ mẫu ban đầu</button>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Đúng bao nhiêu hình trong 40 hình kiểm tra, với mỗi giá trị k?</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Kéo chuột hoặc ngón tay trong khung trắng, vẽ <b>một nét</b> thành hình tròn, tam giác, hình vuông hoặc ngôi sao. Chấm của hình em vẽ sẽ hiện trên mặt phẳng bên phải.",
  lessons=["Toán 7 · Hình học trực quan, chu vi và diện tích", "Toán 7 · Thu thập, phân loại dữ liệu", "Tin học 7 · Giải quyết vấn đề với máy tính"],
  mission_h2="Hiểu cách máy học từ ví dụ mà không cần công thức",
  mission_q="Máy chưa bao giờ thấy hình em vẽ. Làm sao nó gọi đúng tên?",
  mission_p="Em sẽ xem máy <b>đo hình bằng con số</b> (đặc trưng), đặt hình thành <b>chấm trên mặt phẳng</b>, hỏi <b>k hàng xóm gần nhất</b> rồi bỏ phiếu. Em sẽ thêm mẫu, đổi đặc trưng và tìm hiểu vì sao dữ liệu xấu làm máy đoán sai.",
  minutes="45 phút · 1 tiết học",
  checklist=[("draw", "Vẽ một hình và để máy đoán"), ("teach", "Thêm một hình em vẽ làm mẫu"), ("k", "Thử ít nhất 3 giá trị k khác nhau"), ("soi", "Soi tới bước Tìm hàng xóm"), ("broke", "Làm máy đoán sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy đoán hình như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng hình em vừa vẽ.",
  soi_guide="Máy không biết \"hình tròn\" là gì. Nó chỉ <b>đo</b>, <b>đặt chấm</b> và <b>hỏi hàng xóm</b>. Cùng xem nhé!",
  cards=[
    dict(no="T1", tag="Dữ liệu", title="Đặc trưng: đo hình bằng số",
      svg='<circle cx="50" cy="60" r="34" fill="none" class="s-mint" stroke-width="4"/><rect x="118" y="28" width="62" height="62" fill="none" class="s-violet" stroke-width="4"/><text x="22" y="112" font-size="11" class="t-mono f-mint">tròn 1.0 · 0 góc</text><text x="120" y="112" font-size="11" class="t-mono f-violet">tròn .79 · 4 góc</text><path d="M200 70l20-40 20 40z" fill="none" class="s-coral" stroke-width="4"/>',
      p="Máy không nhìn hình như em. Nó <b>đo</b> hình bằng vài con số gọi là <b>đặc trưng</b>: <b>độ tròn</b> (so diện tích với chu vi) và <b>số góc nhọn</b>. Chọn đặc trưng tốt thì các loại hình nằm tách xa nhau.",
      ex="Bác sĩ không nhìn mặt để biết em lớn nhanh hay chậm, mà đo chiều cao và cân nặng: đó là hai đặc trưng."),
    dict(no="T2", tag="Học máy", cls="amber", title="Hàng xóm gần nhất",
      svg='<circle cx="130" cy="60" r="44" fill="none" class="s-amber" stroke-width="2" stroke-dasharray="5 4"/>' + ''.join(f'<circle cx="{x}" cy="{y}" r="7" class="{c}"/>' for x, y, c in [(110, 40, "f-mint"), (150, 50, "f-mint"), (120, 80, "f-mint"), (155, 85, "f-violet"), (40, 30, "f-violet"), (60, 90, "f-violet"), (220, 40, "f-coral"), (230, 95, "f-coral")]) + '<path d="M130 60l-20-20M130 60l20-10M130 60l-10 20" class="s-ink" stroke-width="1.5"/><path d="M130 50l3 7h7l-6 4 2 7-6-4-6 4 2-7-6-4h7z" class="f-amber"/>',
      p="Để đoán hình mới, máy tìm <b>k chấm mẫu gần nhất</b> trên mặt phẳng rồi cho chúng <b>bỏ phiếu</b>. Loại nào nhiều phiếu nhất là câu trả lời. Máy không có công thức: nó <b>nhớ ví dụ</b> và so sánh.",
      ex="Chuyển tới trường mới, muốn biết căng tin có ngon không, em hỏi 5 bạn ngồi gần nhất rồi nghe theo số đông."),
    dict(no="T3", tag="Dữ liệu tốt", cls="coral", title="Mẫu đúng, đủ, biết nói không chắc",
      svg='<rect x="16" y="22" width="70" height="26" rx="6" class="f-coral" opacity=".85"/><text x="24" y="40" font-size="11" fill="#fff">nhãn sai</text><rect x="96" y="22" width="80" height="26" rx="6" class="f-amber" opacity=".9"/><text x="104" y="40" font-size="11" fill="#1b1f4a">đặc trưng kém</text><rect x="16" y="60" width="160" height="26" rx="6" class="f-violet" opacity=".85"/><text x="24" y="78" font-size="11" fill="#fff">hình lạ chưa từng thấy</text><path d="M196 54h44" class="s-mint" stroke-width="3" marker-end="url(#arV)"/>',
      p="Máy học từ ví dụ nên chỉ tốt bằng ví dụ của nó. Vài mẫu <b>dán nhãn sai</b>, <b>đặc trưng không phân biệt được</b> các hình, hay gặp <b>hình lạ</b> chưa từng học đều làm máy đoán sai. Máy tốt nên biết nói \"<b>không chắc</b>\".",
      ex="Nếu trong sách ảnh, con mèo bị ghi nhầm là con chó, một em nhỏ học theo sách cũng sẽ gọi nhầm."),
  ],
  real=[("image", "", "Gợi ý hình vẽ", "Ứng dụng vẽ có thể đoán em đang vẽ con mèo hay cái nhà, và gợi ý biểu tượng đẹp hơn."),
        ("star", "mint", "Gợi ý bài hát, bộ phim", "Máy tìm những người có sở thích gần với em nhất rồi gợi ý thứ họ thích: một kiểu hỏi hàng xóm."),
        ("heart", "amber", "Hỗ trợ chẩn đoán", "So số đo của người bệnh mới với những ca bệnh có số đo gần giống nhất trong hồ sơ.")],
  breaks_h2="Thử thách: hãy làm máy đoán sai!",
  breaks_guide="Máy học từ ví dụ nên dữ liệu và cách đo quyết định tất cả. Thử làm hỏng chúng xem sao!",
  breaks=[
    dict(icon="alert", key="noisy", title="Mẫu dán nhãn sai", p="Vài hình tam giác trong bộ mẫu bị ghi nhầm là <b>hình vuông</b>, và máy chỉ hỏi <b>1 hàng xóm</b> (k = 1).",
      why="Với k = 1, hình mới nằm cạnh đúng mẫu sai là máy đoán sai theo. Hỏi nhiều hàng xóm hơn (k = 5 hoặc 7) thì các mẫu đúng xung quanh <b>thắng phiếu</b>. Cách tốt nhất vẫn là kiểm tra lại nhãn của dữ liệu."),
    dict(icon="chart", key="feat", title="Đo bằng đặc trưng kém", p="Máy đổi sang đo hình bằng <b>chiều rộng</b> và <b>chiều cao</b> thay cho độ tròn và số góc.",
      why="Hình tròn to và hình vuông to có chiều rộng, chiều cao giống nhau, nên các chấm trộn lẫn vào nhau và máy không phân biệt được. Đặc trưng tốt phải <b>khác nhau giữa các loại hình</b>, không phụ thuộc em vẽ to hay nhỏ. Đổi lại trục về <b>Độ tròn</b> và <b>Số góc nhọn</b>."),
    dict(icon="bolt", key="weird", title="Hình lạ", p="Em vẽ một <b>dấu cộng</b>, hình mà máy chưa từng có mẫu nào.",
      why="Máy chỉ biết 4 tên nên vẫn gọi dấu cộng bằng một trong 4 tên đó, dù hàng xóm gần nhất ở rất xa. Kéo thanh <b>Nói \"không chắc\"</b> xuống khoảng 0.15: khi hàng xóm ở quá xa, máy sẽ thừa nhận mình không biết."),
  ],
  badge="Bậc Thầy Hàng Xóm", badge_p="Em đã mở khóa 3 thẻ kiến thức: Đặc trưng · Hàng xóm gần nhất · Mẫu đúng, đủ, biết nói không chắc.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Hàng xóm gần nhất trên giấy", "Đo chiều dài và chiều rộng của 10 chiếc lá hai loại, chấm lên giấy kẻ ô. Hái thêm một chiếc lá lạ, chấm vào và hỏi 3 hàng xóm gần nhất."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Bộ mẫu của cả lớp", "Mỗi bạn thêm 2 mẫu cho mỗi hình. Đo xem số hình kiểm tra đoán đúng thay đổi thế nào khi bộ mẫu lớn dần."),
       (3, "Ý TƯỞNG KHKT", "Nhận dạng chữ cái viết tay cho em nhỏ", "Thiết kế đặc trưng (số nét, số góc, có vòng kín không…) để máy đoán chữ cái các em lớp 1 viết, giúp các em tự luyện viết.")],
  res=[("layers", "", "Phiếu học tập", "Đo đặc trưng, chấm lên mặt phẳng, hỏi hàng xóm bằng thước.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 2", "Máy nhận ra oẳn tù tì từ các điểm trên bàn tay.", "../02-oan-tu-ti/index.html")],
  prev=("25-la-chan", "25"), nextp=("27-tham-tu-du-lieu", "27"),
)
