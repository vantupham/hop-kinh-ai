D = dict(
  out="du-an/32-trai-cay/index.html", num="32", grade="8", title="Dự án 32 · Phân loại trái cây trên mặt phẳng tọa độ",
  scripts=["fruit.js"],
  h1='Phân loại trái cây bằng khoảng cách <span class="hl-word">Pythagore</span>',
  lead="Một máy phân loại ở chợ đầu mối cân và đo từng quả: chanh, quýt, cam hay lựu? Mỗi quả thành một điểm trên mặt phẳng tọa độ, và máy dùng định lý Pythagore để đo xem điểm đó gần loại nào nhất. Nhưng xăng-ti-mét và gam là hai đơn vị khác nhau, cộng chung vào một công thức thì chuyện gì xảy ra?",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px"><div class="seg" id="modeBtns"><button class="btn small" data-m="nn"><i data-i="target"></i>Hàng xóm gần nhất</button><button class="btn small ghost" data-m="cen"><i data-i="crosshair"></i>Điểm đại diện mỗi loại</button></div></div>
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Mặt phẳng tọa độ: đường kính và khối lượng của trái cây, vùng màu là bản đồ phân loại"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">BẢN ĐỒ PHÂN LOẠI</span></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn small accent" id="btnRand"><i data-i="sparkle"></i>Quả ngẫu nhiên</button><label class="small" style="display:inline-flex;align-items:center;gap:6px">Đây thật ra là <select id="teachSel"></select></label><button class="btn small ghost" id="btnTeach"><i data-i="book"></i>Thêm vào dữ liệu</button><button class="btn small ghost" id="btnResetData"><i data-i="reset"></i>Dữ liệu ban đầu</button></div></div>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Cân và đo quả bí ẩn</h2>
          <label class="ctl"><span>Đường kính</span><b id="dV"></b><input type="range" id="d" min="2" max="14" step="0.1"></label>
          <label class="ctl"><span>Khối lượng</span><b id="mV"></b><input type="range" id="m" min="20" max="450" step="1"></label>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="wrench"></i></span>Cách máy đo khoảng cách</h2>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optNorm" checked><span>Đưa hai trục về cùng thang (chia cho giá trị lớn nhất)</span></label></div>
          <label class="ctl"><span>Nói "không biết" khi xa hơn</span><b id="maxdV"></b><input type="range" id="maxd" min="0.05" max="0.6" step="0.05"></label>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy</div>
      <div class="metric-row"><div class="metric"><span>MÁY PHÂN LOẠI</span><b id="bGuess">—</b></div><div class="metric"><span>ĐÚNG / 40 QUẢ KIỂM TRA</span><b id="bAcc">—</b></div></div>
      <div class="lbl" style="margin-top:12px">TÍNH KHOẢNG CÁCH (PYTHAGORE)</div><div id="bCalc" class="calc"></div>
      <div class="lbl" style="margin-top:12px">KHOẢNG CÁCH TỚI MỖI LOẠI</div><div class="conf" id="bDist"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Bấm hoặc kéo trên mặt phẳng để đặt quả bí ẩn (ngôi sao trắng). Vùng màu cho biết máy sẽ xếp một quả ở đó vào loại nào.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Mỗi loại trái cây bị máy xếp đúng bao nhiêu quả (trong 10 quả kiểm tra mỗi loại)?</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Bấm vào một chỗ bất kỳ trên mặt phẳng để đặt <b>quả bí ẩn</b>. Máy vẽ một tam giác vuông tới quả gần nhất và tính khoảng cách bằng <b>định lý Pythagore</b>.",
  lessons=["Toán 8 · Mặt phẳng tọa độ", "Toán 8 · Định lý Pythagore", "Toán 8 · Thu thập và biểu diễn dữ liệu"],
  mission_h2="Dùng tọa độ và định lý Pythagore để máy phân loại",
  mission_q="Quả nặng 95 g, đường kính 6,5 cm là quả gì? Máy trả lời bằng phép tính nào?",
  mission_p="Em sẽ biến mỗi quả thành <b>một điểm</b>, tính <b>khoảng cách</b> giữa hai điểm bằng định lý Pythagore, so hai cách phân loại (hàng xóm gần nhất và điểm đại diện), và xem bản đồ phân loại thay đổi thế nào khi <b>hai trục khác đơn vị</b>.",
  minutes="45 phút · 1 tiết học",
  checklist=[("place", "Đặt quả bí ẩn và đọc phép tính khoảng cách"), ("mode", "Thử cả hai cách phân loại"), ("teach", "Thêm một quả vào dữ liệu"), ("soi", "Soi tới bước Hai đơn vị khác nhau"), ("broke", "Làm máy phân loại sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy phân loại trái cây như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng quả bí ẩn hiện tại.",
  soi_guide="Toàn bộ \"trí thông minh\" ở đây là <b>tọa độ</b> và <b>định lý Pythagore</b> em học ở lớp 8. Cùng xem nhé!",
  cards=[
    dict(no="T1", tag="Toán học", title="Mỗi quả là một điểm",
      svg='<path d="M24 100V14M24 100h220" class="s-ink" stroke-width="2"/>' + ''.join(f'<circle cx="{x}" cy="{y}" r="6" class="{c}"/>' for x, y, c in [(50, 88, "f-mint"), (60, 82, "f-mint"), (90, 72, "f-amber"), (100, 66, "f-amber"), (130, 52, "f-coral"), (142, 46, "f-coral"), (210, 20, "f-violet")]) + '<text x="150" y="96" font-size="10" class="t-mono f-ink">đường kính →</text><text x="28" y="22" font-size="10" class="t-mono f-ink">khối lượng</text>',
      p="Đo hai số của mỗi quả (đường kính, khối lượng) rồi dùng chúng làm <b>tọa độ</b>. Mỗi quả thành một điểm; các quả cùng loại tụ lại thành <b>đám điểm</b> gần nhau trên mặt phẳng.",
      ex="Trên bản đồ, mỗi ngôi nhà có tọa độ (kinh độ, vĩ độ); nhà cùng một xóm nằm gần nhau."),
    dict(no="T2", tag="Toán học", cls="amber", title="Khoảng cách Pythagore",
      svg='<circle cx="40" cy="90" r="6" class="f-violet"/><circle cx="200" cy="30" r="6" class="f-mint"/><path d="M40 90H200V30" fill="none" class="s-amber" stroke-width="2.5" stroke-dasharray="5 4"/><path d="M40 90L200 30" class="s-coral" stroke-width="3"/><text x="110" y="106" font-size="11" class="t-mono f-amber">Δx</text><text x="206" y="66" font-size="11" class="t-mono f-amber">Δy</text><text x="70" y="52" font-size="12" class="t-mono f-coral">d = √(Δx² + Δy²)</text>',
      p="Khoảng cách giữa hai điểm là cạnh huyền của tam giác vuông có hai cạnh góc vuông là Δx và Δy: <b>d = √(Δx² + Δy²)</b>. Máy tính khoảng cách tới các quả đã biết và chọn loại <b>gần nhất</b>.",
      ex="Đo đường chim bay từ nhà tới trường khi biết đi sang ngang 3 km và đi lên 4 km: √(9 + 16) = 5 km."),
    dict(no="T3", tag="Dữ liệu", cls="coral", title="Cùng thang đo trước khi so",
      svg='<rect x="16" y="30" width="200" height="16" rx="4" class="f-coral" opacity=".85"/><text x="20" y="26" font-size="10" class="t-mono f-coral">khối lượng: 0 → 450 g</text><rect x="16" y="76" width="3" height="16" class="f-mint"/><text x="20" y="72" font-size="10" class="t-mono f-mint">đường kính: 0 → 14 cm</text><path d="M226 60h20" class="s-violet" stroke-width="2"/>',
      p="1 cm và 1 g không \"to\" như nhau. Nếu cộng thẳng, khối lượng (hàng trăm gam) lấn át đường kính (vài xăng-ti-mét) và máy gần như <b>bỏ qua</b> đường kính. Cần đưa hai trục về <b>cùng thang</b>, ví dụ chia mỗi số cho giá trị lớn nhất của nó.",
      ex="So điểm Toán (thang 10) với điểm thi đấu (thang 100) thì phải đổi về cùng thang trước khi cộng."),
  ],
  real=[("cpu", "", "Máy phân loại nông sản", "Băng chuyền có camera và cân tự xếp xoài, thanh long theo cỡ và màu để đóng hộp xuất khẩu."),
        ("map", "mint", "Tìm cửa hàng gần nhất", "Ứng dụng bản đồ tính khoảng cách từ vị trí của em tới từng cửa hàng rồi xếp từ gần đến xa."),
        ("heart", "amber", "Theo dõi sức khỏe", "Chiều cao và cân nặng của em được đặt lên biểu đồ để so với các bạn cùng tuổi.")],
  breaks_h2="Thử thách: hãy làm máy phân loại sai!",
  breaks_guide="Phép tính Pythagore luôn đúng, nhưng <b>con số đưa vào</b> thì chưa chắc. Thử xem!",
  breaks=[
    dict(icon="sliders", key="units", title="Hai trục khác đơn vị", p="Máy cộng thẳng <b>xăng-ti-mét</b> và <b>gam</b> vào công thức Pythagore, không đưa về cùng thang.",
      why="Δ khối lượng thường là hàng chục, hàng trăm gam, còn Δ đường kính chỉ vài xăng-ti-mét, nên khoảng cách gần như chỉ phụ thuộc khối lượng. Bản đồ thành những <b>dải nằm ngang</b>: quả quýt nặng gần bằng quả chanh to bị xếp nhầm. Bật lại <b>Đưa hai trục về cùng thang</b>."),
    dict(icon="alert", key="typo", title="Một quả bị dán nhầm nhãn", p="Hai quả <b>cam</b> trong dữ liệu bị dán nhầm nhãn thành <b>chanh</b>.",
      why="Với cách <b>hàng xóm gần nhất</b>, quanh hai điểm sai mọc ra một \"hòn đảo\" màu chanh giữa vùng cam: những quả cam ở đó bị xếp nhầm. Cách <b>điểm đại diện</b> lấy trung bình nhiều quả nên ít bị ảnh hưởng hơn. Thử đổi cách phân loại, hoặc bấm <b>Dữ liệu ban đầu</b>."),
    dict(icon="help", key="weird", title="Quả lạ: quả dưa lê", p="Một quả <b>dưa lê</b> nhỏ (đường kính 12 cm, nặng 420 g) lăn vào máy, loại máy chưa từng học.",
      why="Máy chỉ biết 4 loại nên chọn loại gần nhất là <b>lựu</b>, dù khoảng cách khá xa. Kéo thanh <b>Nói \"không biết\"</b> xuống khoảng 0,15: khi quả ở quá xa mọi loại đã biết, máy thừa nhận không biết."),
  ],
  badge="Kiểm Định Viên Trái Cây", badge_p="Em đã mở khóa 3 thẻ kiến thức: Mỗi quả là một điểm · Khoảng cách Pythagore · Cùng thang đo trước khi so.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Phân loại bằng thước và cân", "Đo đường kính và cân 10 quả trong bếp nhà em (chanh, quất, cà chua…). Chấm lên giấy kẻ ô và kiểm tra các loại có tách thành đám riêng không."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Thêm đặc trưng thứ ba", "Đo thêm độ dày vỏ của cam và quýt. Hai loại này có tách nhau rõ hơn không? Viết công thức khoảng cách với ba số."),
       (3, "Ý TƯỞNG KHKT", "Máy chọn cỡ trứng gà", "Thiết kế máy cân và đo chiều dài quả trứng để xếp loại cỡ S, M, L cho trang trại địa phương.")],
  res=[("layers", "", "Phiếu học tập", "Tính khoảng cách Pythagore, chuẩn hóa thang đo, phân loại trên giấy.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 13", "Máy tự chia dữ liệu thành các nhóm mà không cần nhãn.", "../13-phan-cum/index.html")],
  prev=("31-cay-dau", "31"), nextp=("33-no-ron", "33"),
)
