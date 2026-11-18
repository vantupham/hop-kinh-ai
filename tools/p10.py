D = dict(
  out="du-an/10-toc-do-chay/index.html", num="10", grade="7", title="Dự án 10 · Máy chấm tốc độ chạy",
  scripts=["track.js"], device="Camera: không bắt buộc",
  h1='Máy chấm <span class="hl-word">tốc độ chạy</span> từ video',
  lead="Thầy thể dục quay video bạn Minh chạy 60 m. Máy xem từng khung hình, tìm chiếc áo đỏ, ghi lại vị trí theo thời gian, vẽ đồ thị quãng đường – thời gian và tính tốc độ. Đúng như bài tốc độ ở Khoa học tự nhiên 7, chỉ khác là máy tự làm hết. Nhưng nếu áo bị che, hay có quả bóng cũng màu đỏ thì sao?",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px"><div class="seg"><button class="btn small" id="srcSim" aria-pressed="true"><i data-i="film"></i>Video mô phỏng</button><button class="btn small ghost" id="srcCam" aria-pressed="false"><i data-i="camera"></i>Dùng camera</button></div>
        <div class="seg sim-only" id="profBtns"><button class="btn small" data-p="even">Chạy đều</button><button class="btn small ghost" data-p="acc">Tăng tốc dần</button><button class="btn small ghost" data-p="rest">Chạy, nghỉ, chạy</button></div></div>
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Video người chạy và vùng màu máy theo dõi"></canvas><video id="video" playsinline muted></video><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div class="stage-msg" id="msg" hidden></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn small accent" id="btnRun"><i data-i="play"></i>Chạy và đo</button><button class="btn small ghost" id="btnReset"><i data-i="reset"></i>Về vạch xuất phát</button></div></div>
      {{GUIDE}}
      <div class="card" style="margin-top:6px">
        <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
        <div class="grid g2" style="gap:6px 22px">
          <label class="ctl"><span>Độ lệch màu cho phép</span><b id="tolV"></b><input type="range" id="tol" min="20" max="200" step="5"></label>
          <label class="ctl sim-only"><span>Tốc độ thật của Minh</span><b id="vV"></b><input type="range" id="v" min="3" max="9" step="0.5"></label>
        </div>
        <div class="toggles"><label class="tog"><input type="checkbox" id="optWin"><span>Chỉ tìm gần vị trí cũ</span></label><label class="tog"><input type="checkbox" id="optPred"><span>Đoán vị trí khi mất dấu</span></label></div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy</div>
      <div class="metric-row"><div class="metric"><span>THỜI GIAN</span><b id="bT">0,0 s</b></div><div class="metric"><span>QUÃNG ĐƯỜNG</span><b id="bS">0 m</b></div></div>
      <div class="metric-row"><div class="metric"><span>TỐC ĐỘ LÚC NÀY</span><b id="bV">—</b></div><div class="metric"><span>KHUNG MẤT DẤU</span><b id="bLost">0</b></div></div>
      <div class="metric-row"><div class="metric"><span>TỐC ĐỘ TRUNG BÌNH (MÁY)</span><b id="bAvg">—</b></div><div class="metric"><span>TỐC ĐỘ TRUNG BÌNH (THẬT)</span><b id="bTrue">—</b></div></div>
      <div class="lbl" style="margin-top:12px">MÀU MÁY ĐANG TÌM</div><div class="swatch-row"><span class="swatch" id="bColor"></span><span id="bColorTxt" class="small" style="color:#c3c7f0"></span></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Bấm vào áo của Minh trên video để chọn màu cho máy theo dõi. Thử bấm vào cây hoặc bầu trời xem sao!</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Đồ thị quãng đường – thời gian</b></div><canvas id="chart" width="1100" height="250"></canvas></div>''',
  play_guide="Bấm <b>Chạy và đo</b>. Khung nhỏ phía dưới là thứ máy thấy: chỉ những điểm ảnh có màu giống áo đỏ được tô sáng.",
  lessons=["KHTN 7 · Tốc độ chuyển động", "KHTN 7 · Đồ thị quãng đường – thời gian", "KHTN 7 · Đo tốc độ (đồng hồ bấm giây, cổng quang)"],
  mission_h2="Đo tốc độ bằng video và hiểu cách máy theo dõi một vật",
  mission_q="Máy chỉ có những khung hình. Làm sao nó biết Minh chạy nhanh bao nhiêu?",
  mission_p="Em sẽ xem máy <b>tìm vật theo màu</b> trong từng khung hình, đổi điểm ảnh ra <b>mét</b>, vẽ <b>đồ thị quãng đường – thời gian</b>, tính <b>tốc độ</b>, rồi làm máy mất dấu để hiểu giới hạn của nó.",
  minutes="45 phút · 1 tiết học",
  checklist=[("run", "Đo trọn một lần chạy 60 m"), ("pick", "Chọn màu theo dõi bằng cách bấm lên video"), ("prof", "Thử cả 3 kiểu chạy và so sánh đồ thị"), ("soi", "Soi tới bước Đổi ra mét"), ("broke", "Làm máy mất dấu ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy đo tốc độ từ video như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Số liệu là lần chạy em vừa đo.",
  soi_guide="Máy không biết \"Minh\" là ai. Nó chỉ tìm <b>một mảng màu đỏ</b> trong từng ảnh. Cùng xem nhé!",
  cards=[
    dict(no="T1", tag="Thị giác máy tính", title="Theo dõi vật theo màu",
      svg=''.join(f'<rect x="{12+i*40}" y="30" width="34" height="50" rx="4" class="f-line" opacity=".35"/><rect x="{20+i*40+i*3}" y="48" width="7" height="12" class="f-coral"/>' for i in range(6)) + '<path d="M24 96h200" class="s-coral" stroke-width="2.5" marker-end="url(#arC)"/>',
      p="Video là chuỗi <b>khung hình</b> (ảnh). Trong mỗi ảnh, máy tìm các điểm ảnh có màu <b>giống</b> màu áo, lấy <b>điểm chính giữa</b> của vùng đó làm vị trí người chạy. Làm lại với ảnh tiếp theo là <b>theo dõi</b> được vật.",
      ex="Camera giao thông tìm và theo dõi từng chiếc xe qua các khung hình để biết xe đi nhanh hay chậm."),
    dict(no="T2", tag="Vật lí", cls="amber", title="Đồ thị quãng đường – thời gian",
      svg='<path d="M24 100V14M24 100h220" class="s-ink" stroke-width="2"/><path d="M24 100L110 50 150 50 230 10" fill="none" class="s-violet" stroke-width="3"/><text x="60" y="68" font-size="10" class="t-mono f-violet">chạy</text><text x="114" y="44" font-size="10" class="t-mono f-amber">đứng yên</text><text x="186" y="40" font-size="10" class="t-mono f-violet">chạy nhanh</text>',
      p="Ghi vị trí theo thời gian rồi nối lại, ta có đồ thị quãng đường – thời gian. Đường <b>càng dốc</b>, chạy <b>càng nhanh</b>; đoạn <b>nằm ngang</b> là đứng yên. Tốc độ = quãng đường ÷ thời gian.",
      ex="Ứng dụng chạy bộ trên điện thoại vẽ đúng loại đồ thị này từ vị trí GPS ghi lại mỗi giây."),
    dict(no="T3", tag="Giới hạn của máy", cls="coral", title="Mất dấu và nhầm vật",
      svg='<rect x="100" y="20" width="40" height="80" rx="6" class="f-mint" opacity=".8"/><rect x="60" y="50" width="12" height="20" class="f-coral"/><circle cx="200" cy="66" r="12" class="f-coral"/><text x="150" y="30" font-size="10" class="t-mono f-ink">bị che</text><text x="180" y="100" font-size="10" class="t-mono f-coral">cùng màu</text>',
      p="Khi người chạy <b>bị che</b>, đi vào <b>bóng râm</b> làm màu tối đi, hay có <b>vật khác cùng màu</b>, máy sẽ mất dấu hoặc nhầm. Máy tốt hơn thì <b>chỉ tìm gần vị trí cũ</b> và <b>đoán tiếp</b> theo tốc độ trước đó khi tạm mất dấu.",
      ex="Khi một cầu thủ bị che sau cầu thủ khác, máy phân tích trận đấu vẫn đoán được anh ấy đang chạy hướng nào."),
  ],
  real=[("activity", "", "Phân tích thể thao", "Máy theo dõi cầu thủ và quả bóng trong video để đo quãng đường chạy và tốc độ của từng người."),
        ("camera", "mint", "Camera giao thông", "Theo dõi từng xe qua các khung hình để phát hiện xe chạy quá tốc độ hay đi ngược chiều."),
        ("robot", "amber", "Robot và xe tự lái", "Theo dõi người đi bộ, xe đạp xung quanh và đoán họ sẽ đi đâu tiếp theo để tránh va chạm.")],
  breaks_h2="Thử thách: hãy làm máy mất dấu!",
  breaks_guide="Máy chỉ tìm một mảng màu. Thứ gì làm mảng màu đó biến mất hay có thêm một mảng khác đều làm máy rối!",
  breaks=[
    dict(icon="eye", key="hide", title="Bị che khuất", p="Một <b>cột cờ có biển lớn</b> dựng giữa đường chạy, che khuất Minh trong vài giây.",
      why="Không thấy điểm ảnh màu đỏ nào nên máy mất dấu: đồ thị bị đứt, tốc độ đo sai. Bật <b>Đoán vị trí khi mất dấu</b>: máy dùng tốc độ vừa đo để đoán Minh đang ở đâu cho tới khi thấy lại."),
    dict(icon="target", key="ball", title="Vật cùng màu", p="Một <b>quả bóng đỏ</b> lăn ngược chiều trên đường chạy, cùng màu với áo Minh.",
      why="Máy gộp cả áo và quả bóng thành một vùng màu đỏ, nên lấy điểm giữa của cả hai: vị trí đo nhảy lung tung. Bật <b>Chỉ tìm gần vị trí cũ</b>: máy chỉ xét vùng quanh chỗ Minh vừa ở, bỏ qua quả bóng ở xa."),
    dict(icon="sun", key="shade", title="Chạy vào bóng râm", p="Một đoạn đường chạy nằm dưới <b>bóng cây</b>, áo đỏ trông tối hẳn đi.",
      why="Trong bóng râm, màu áo khác xa màu máy đang tìm nên máy không nhận ra. Tăng <b>Độ lệch màu cho phép</b> để máy chấp nhận cả màu đỏ sẫm. Nhưng tăng quá nhiều thì máy lại nhận nhầm cả những màu khác."),
  ],
  badge="Trọng Tài Số", badge_p="Em đã mở khóa 3 thẻ kiến thức: Theo dõi vật theo màu · Đồ thị quãng đường – thời gian · Mất dấu và nhầm vật.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Đo tốc độ đi bộ", "Đánh dấu 2 vạch cách nhau 10 m, nhờ người nhà bấm giờ khi em đi bộ, đi nhanh và chạy. Tính tốc độ và vẽ đồ thị quãng đường – thời gian."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Máy chấm giờ cho giờ thể dục", "Dùng chế độ camera, cho bạn chạy qua khung hình với một tấm bìa màu. So tốc độ máy đo với tốc độ đo bằng đồng hồ bấm giây."),
       (3, "Ý TƯỞNG KHKT", "Cảnh báo xe chạy nhanh trước cổng trường", "Thiết kế hệ thống dùng camera theo dõi xe qua hai vạch mốc, ước tính tốc độ và bật đèn nhắc giảm tốc vào giờ tan học.")],
  res=[("layers", "", "Phiếu học tập", "Đọc vị trí từ ảnh, vẽ đồ thị, tính tốc độ.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 29", "Máy đếm xe trên đường bằng cách theo dõi vật.", "../29-dem-xe/index.html")],
  prev=("09-robot-giao-thu", "9"), nextp=("11-cay-dau", "11"),
)
