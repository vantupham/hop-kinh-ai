D = dict(
  out="du-an/31-cay-dau/index.html", num="31", grade="8", title="Dự án 31 · Đường thẳng dự đoán cây đậu lớn",
  scripts=["line.js"],
  h1='Một <span class="hl-word">đường thẳng</span> dự đoán cây đậu lớn',
  lead="Lớp em gieo hạt đậu và đo chiều cao mỗi ngày trong hai tuần. Từ 15 chấm số liệu, em và máy sẽ tìm một hàm số bậc nhất y = ax + b đi gần các chấm nhất, đo sai số, rồi dùng nó để dự đoán. Đây là mô hình học máy đơn giản nhất, và cũng là nơi dễ thấy nhất vì sao mô hình có lúc sai rất xa.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Mặt phẳng tọa độ với số liệu chiều cao cây đậu và đường thẳng dự đoán"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">y = ax + b</span></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn small accent" id="btnFit"><i data-i="cpu"></i>Máy tự tìm đường thẳng</button><button class="btn small ghost" id="btnReset"><i data-i="reset"></i>Đặt lại đường thẳng</button><button class="btn small ghost" id="btnFuture"><i data-i="eye"></i>Xem số đo các ngày sau</button></div></div>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Hàm số của em</h2>
          <label class="ctl"><span>Hệ số a (cây cao thêm mỗi ngày, cm)</span><b id="aV"></b><input type="range" id="a" min="-1" max="5" step="0.05"></label>
          <label class="ctl"><span>Hệ số b (chiều cao lúc đầu, cm)</span><b id="bV"></b><input type="range" id="b" min="-10" max="20" step="0.1"></label>
          <p class="small muted" style="margin:8px 0 0">Hoặc kéo hai nút tròn trên đường thẳng.</p>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="target"></i></span>Dự đoán</h2>
          <label class="ctl"><span>Ngày muốn dự đoán</span><b id="dayV"></b><input type="range" id="day" min="0" max="30" step="1"></label>
          <label class="ctl"><span>Độ uốn lượn của đường (1 = thẳng)</span><b id="degV"></b><input type="range" id="deg" min="1" max="8" step="1"></label>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy</div>
      <div class="metric-row"><div class="metric"><span>HÀM SỐ</span><b id="bEq" style="font-size:.92rem">—</b></div><div class="metric"><span>SAI SỐ TRUNG BÌNH</span><b id="bErr">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>DỰ ĐOÁN</span><b id="bPred">—</b></div><div class="metric"><span>SAI SỐ VỚI SỐ ĐO MỚI</span><b id="bTest">—</b></div></div>
      <div class="lbl" style="margin-top:12px">SỐ LIỆU ĐO (BẤM CHẤM ĐỂ BỎ / LẤY LẠI)</div><div id="bData" class="kw"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Mỗi <b style="color:#ff8f6b">đoạn đỏ</b> là sai số của một chấm: khoảng cách theo chiều dọc giữa số đo thật và đường thẳng. Máy chỉnh a, b để các đoạn đỏ ngắn nhất.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Sai số trung bình sau mỗi lần chỉnh</b></div><canvas id="chart" width="1100" height="220"></canvas></div>''',
  play_guide="Kéo thanh <b>a</b> và <b>b</b> (hoặc hai nút tròn) để đường thẳng đi sát các chấm nhất có thể. Nhìn con số <b>sai số trung bình</b>: càng nhỏ càng tốt!",
  lessons=["Toán 8 · Hàm số bậc nhất y = ax + b", "Toán 8 · Đồ thị hàm số bậc nhất, hệ số góc", "KHTN 8 · Sinh trưởng ở thực vật"],
  mission_h2="Dùng hàm số bậc nhất làm một mô hình dự đoán",
  mission_q="Ngày thứ 30 cây đậu cao bao nhiêu? Đường thẳng có trả lời đúng không?",
  mission_p="Em sẽ <b>tự đặt</b> một đường thẳng, đo <b>sai số</b>, xem máy <b>tự chỉnh</b> a và b, dùng hàm số để <b>dự đoán</b>, rồi tìm hiểu ba cách một mô hình có thể sai: dự đoán quá xa, số đo nhầm và đường quá uốn lượn.",
  minutes="45 phút · 1 tiết học",
  checklist=[("manual", "Tự đặt đường thẳng có sai số dưới 1,5 cm"), ("fit", "Xem máy tự tìm đường thẳng"), ("pred", "Dùng hàm số dự đoán một ngày"), ("soi", "Soi tới bước Máy tự chỉnh"), ("broke", "Làm mô hình dự đoán sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy tìm đường thẳng như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng số liệu và đường thẳng hiện tại.",
  soi_guide="\"Học\" ở đây nghĩa là <b>tìm hai con số a và b</b> làm sai số nhỏ nhất. Cùng xem máy làm từng bước!",
  cards=[
    dict(no="T1", tag="Toán học", title="Mô hình là một hàm số",
      svg='<path d="M20 100V14M20 100h220" class="s-ink" stroke-width="2"/>' + ''.join(f'<circle cx="{30+i*16}" cy="{94-i*5.5+((i*37)%7-3)}" r="4" class="f-violet"/>' for i in range(13)) + '<path d="M24 96L236 26" class="s-mint" stroke-width="3"/><text x="140" y="96" font-size="13" class="t-mono f-mint">y = ax + b</text>',
      p="Một <b>mô hình</b> là một quy tắc đơn giản mô tả dữ liệu. Ở đây: chiều cao <b>y</b> = <b>a</b> × số ngày <b>x</b> + <b>b</b>. Hệ số <b>a</b> cho biết mỗi ngày cây cao thêm bao nhiêu, <b>b</b> là chiều cao lúc bắt đầu.",
      ex="Tiền taxi = giá mỗi km × số km + giá mở cửa: cũng là một hàm số bậc nhất."),
    dict(no="T2", tag="Học máy", cls="amber", title="Sai số và tự chỉnh",
      svg='<path d="M20 90L240 30" class="s-mint" stroke-width="3"/>' + ''.join(f'<path d="M{x} {y1}V{y2}" class="s-coral" stroke-width="2.5"/><circle cx="{x}" cy="{y1}" r="4.5" class="f-violet"/>' for x, y1, y2 in [(50, 70, 82), (90, 84, 71), (130, 50, 60), (170, 62, 49), (210, 30, 38)]),
      p="<b>Sai số</b> là khoảng cách giữa số đo thật và giá trị đường thẳng dự đoán. Máy tính sai số trung bình, rồi <b>nhích a và b từng chút</b> theo hướng làm sai số nhỏ đi, lặp lại hàng chục lần. Đó là \"học\".",
      ex="Chỉnh vòi nước cho vừa ấm: nóng quá thì vặn bớt, lạnh quá thì vặn thêm, mỗi lần một chút."),
    dict(no="T3", tag="Giới hạn", cls="coral", title="Khi mô hình sai xa",
      svg='<path d="M20 100V14M20 100h220" class="s-ink" stroke-width="2"/><path d="M20 96L240 12" class="s-mint" stroke-width="2.5" stroke-dasharray="6 4"/><path d="M20 96C90 70 120 40 240 36" fill="none" class="s-coral" stroke-width="3"/><text x="150" y="70" font-size="10" class="t-mono f-coral">thật: chậm lại</text><text x="160" y="24" font-size="10" class="t-mono f-mint">đường thẳng</text>',
      p="Mô hình chỉ đáng tin <b>trong khoảng có dữ liệu</b>: cây không lớn mãi theo đường thẳng. Một <b>số đo nhầm</b> kéo lệch cả đường. Đường <b>quá uốn lượn</b> đi qua đúng mọi chấm nhưng dự đoán số đo mới rất tệ.",
      ex="Em cao thêm 6 cm năm lớp 7 không có nghĩa là 30 năm nữa em cao thêm 180 cm!"),
  ],
  real=[("chart", "", "Dự báo doanh số, dân số", "Người ta tìm đường thẳng hoặc đường cong đi sát số liệu các năm trước để dự đoán năm tới, và luôn ghi rõ dự báo có thể sai."),
        ("sun", "mint", "Nông nghiệp thông minh", "Máy học mối liên hệ giữa lượng nước, ánh sáng và tốc độ lớn của cây để tưới vừa đủ."),
        ("cpu", "amber", "Mạng nơ-ron", "Các AI lớn cũng \"học\" bằng cách nhích hàng tỉ con số giống a và b theo hướng làm sai số nhỏ đi.")],
  breaks_h2="Thử thách: hãy làm mô hình dự đoán sai!",
  breaks_guide="Một đường thẳng vẽ đẹp vẫn có thể dự đoán sai bét. Thử ba cách làm hỏng mô hình nhé!",
  breaks=[
    dict(icon="arrowR", key="far", title="Dự đoán quá xa", p="Dùng đường thẳng học từ 2 tuần đầu để dự đoán chiều cao cây vào <b>ngày thứ 30</b>.",
      why="Đường thẳng giả định cây lớn đều mãi mãi. Thật ra sau khoảng 3 tuần cây lớn chậm lại (các chấm xanh mới). Dự đoán xa ngoài khoảng dữ liệu gọi là <b>ngoại suy</b>, rất dễ sai. Kéo <b>Ngày muốn dự đoán</b> về trong khoảng 0–14 ngày, hoặc phải đo thêm và dùng mô hình khác."),
    dict(icon="alert", key="typo", title="Số đo bị ghi nhầm", p="Ngày thứ 10, bạn ghi nhầm <b>15 cm thành 51 cm</b>.",
      why="Máy cố làm sai số trung bình nhỏ nhất nên bị chấm sai kéo cả đường thẳng lên, mọi dự đoán đều lệch. Bấm vào chấm bất thường (ở khung Bộ não hoặc trên hình) để bỏ nó, rồi cho máy tìm lại."),
    dict(icon="activity", key="wiggle", title="Đường quá uốn lượn", p="Cho đường được <b>uốn lượn</b> thật nhiều để đi qua sát từng chấm.",
      why="Sai số trên số liệu cũ gần bằng 0, nhưng với <b>số đo mới</b> của nhóm bạn (chấm vàng), sai số lại rất lớn: đường đã \"học thuộc lòng\" cả những dao động ngẫu nhiên. Kéo <b>Độ uốn lượn</b> về 1: đơn giản mà dự đoán tốt hơn."),
  ],
  badge="Nhà Dự Báo Nhí", badge_p="Em đã mở khóa 3 thẻ kiến thức: Mô hình là một hàm số · Sai số và tự chỉnh · Khi mô hình sai xa.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Trồng đậu thật", "Gieo 3 hạt đậu trong cốc, đo chiều cao mỗi ngày trong 3 tuần. Nhập số liệu thay cho số liệu mẫu (bằng giấy kẻ ô) và tìm hệ số a của cây em."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Ánh sáng và tốc độ lớn", "Hai nhóm trồng đậu ở chỗ sáng và chỗ tối. So hệ số a của hai đường thẳng: chỗ nào cây lớn nhanh hơn?"),
       (3, "Ý TƯỞNG KHKT", "Dự báo mực nước bể", "Đo mực nước bể chứa mỗi giờ, tìm hàm số mô tả, dự báo khi nào bể cạn để bật máy bơm kịp thời.")],
  res=[("layers", "", "Phiếu học tập", "Vẽ đường thẳng, tính sai số, dự đoán bằng hàm số.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 7", "Máy dự đoán điểm thi từ nhiều yếu tố cùng lúc.", "../07-diem-thi/index.html")],
  prev=("30-toc-do-chay", "30"), nextp=("32-trai-cay", "32"),
)
