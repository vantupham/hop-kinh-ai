D = dict(
  out="du-an/09-robot-giao-thu/index.html", num="9", grade="7", title="Dự án 9 · Robot giao thư trong trường",
  scripts=["search.js"],
  h1='Robot giao thư và <span class="hl-word">thuật toán tìm kiếm</span>',
  lead="Robot nhận một lá thư gửi tới một phòng trong trường. Hành lang có rất nhiều cửa, robot chỉ đọc được số phòng khi mở từng cửa. Mở lần lượt từ đầu, hay mở cửa ở giữa rồi loại bỏ một nửa? Em sẽ thi với robot, rồi xem vì sao máy tìm kiếm trên mạng trả lời được trong nháy mắt.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px"><div class="seg" id="modeBtns"><button class="btn small" data-m="user"><i data-i="figure"></i>Em tự tìm</button><button class="btn small ghost" data-m="seq"><i data-i="arrowR"></i>Robot tìm tuần tự</button><button class="btn small ghost" data-m="bin"><i data-i="layers"></i>Robot tìm nhị phân</button></div></div>
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="400" aria-label="Hành lang với các cửa phòng và robot giao thư"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">HÀNH LANG</span></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn small accent" id="btnGo"><i data-i="play"></i>Chạy</button><button class="btn small" id="btnNew"><i data-i="sparkle"></i>Lá thư mới</button><button class="btn small ghost" id="btnHall"><i data-i="reset"></i>Hành lang mới</button></div></div>
      {{GUIDE}}
      <div class="card" style="margin-top:6px">
        <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
        <label class="ctl"><span>Số phòng trên hành lang</span><b id="nV"></b><input type="range" id="n" min="0" max="7" step="1"></label>
        <div class="toggles"><label class="tog"><input type="checkbox" id="optSorted" checked><span>Số phòng được xếp theo thứ tự tăng dần</span></label><label class="tog"><input type="checkbox" id="optBug"><span>Robot nhị phân có lỗi khi thu hẹp khoảng tìm</span></label></div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Sổ giao thư</div>
      <div class="metric-row"><div class="metric"><span>THƯ GỬI PHÒNG</span><b id="bTarget">—</b></div><div class="metric"><span>KẾT QUẢ</span><b id="bRes" style="font-size:.95rem">—</b></div></div>
      <div class="lbl" style="margin-top:12px">SỐ CỬA ĐÃ MỞ</div><div class="conf" id="bOpens"></div>
      <div class="lbl" style="margin-top:12px">KHOẢNG CÒN PHẢI TÌM</div><div id="bRange" style="color:#fff;font-size:.88rem"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Mỗi lần mở một cửa là một bước. Thuật toán tốt là thuật toán cần <b style="color:#5ef2d6">ít bước</b>, nhất là khi có rất nhiều phòng.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Cần mở bao nhiêu cửa khi hành lang dài dần? (trường hợp xấu nhất)</b></div><canvas id="chart" width="1100" height="240"></canvas></div>''',
  play_guide="Chế độ <b>Em tự tìm</b>: bấm vào một cửa để mở và đọc số phòng. Tìm phòng ghi trên lá thư với <b>ít lần mở cửa nhất</b>!",
  lessons=["Tin học 7 · Thuật toán tìm kiếm tuần tự", "Tin học 7 · Thuật toán tìm kiếm nhị phân", "Toán 7 · Lũy thừa: 2, 4, 8, 16…"],
  mission_h2="So sánh hai cách tìm kiếm và hiểu vì sao sắp xếp lại quan trọng",
  mission_q="Có 1000 phòng. Cần mở ít nhất mấy cửa thì chắc chắn tìm được phòng cần tìm?",
  mission_p="Em sẽ tự tìm phòng, xem robot <b>tìm tuần tự</b> và <b>tìm nhị phân</b>, đo số bước khi hành lang dài dần, rồi phá máy để thấy tìm nhị phân cần điều kiện gì.",
  minutes="45 phút · 1 tiết học",
  checklist=[("user", "Tự tìm một phòng bằng cách mở cửa"), ("seq", "Cho robot tìm tuần tự"), ("bin", "Cho robot tìm nhị phân"), ("big", "Thử với hành lang 1000 phòng"), ("soi", "Soi tới bước Tìm nhị phân"), ("broke", "Làm robot tìm sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Hai cách tìm kiếm của robot: 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng đúng hành lang và lá thư hiện tại.",
  soi_guide="Hai robot cùng tìm một phòng, nhưng một robot <b>thông minh hơn</b> nhờ biết dữ liệu đã được sắp xếp. Cùng soi nhé!",
  cards=[
    dict(no="T1", tag="Thuật toán", title="Tìm kiếm tuần tự",
      svg=''.join(f'<rect x="{10+i*30}" y="40" width="24" height="40" rx="4" class="{"f-violet" if i<5 else "f-line"}" opacity="{1 if i<5 else .4}"/>' for i in range(8)) + '<path d="M22 96h130" class="s-coral" stroke-width="2.5" marker-end="url(#arC)"/><text x="12" y="28" font-size="11" class="t-mono f-violet">mở lần lượt từng cửa</text>',
      p="Mở cửa <b>lần lượt từ đầu</b> tới khi thấy phòng cần tìm. Cách này luôn đúng, kể cả khi số phòng lộn xộn. Nhưng có n phòng thì xấu nhất phải mở <b>n cửa</b>.",
      ex="Tìm tên mình trong danh sách lớp chưa xếp theo vần: em dò từ trên xuống từng dòng một."),
    dict(no="T2", tag="Thuật toán", cls="amber", title="Tìm kiếm nhị phân",
      svg=''.join(f'<rect x="{10+i*30}" y="40" width="24" height="40" rx="4" class="{"f-amber" if i==3 else "f-line"}" opacity="{1 if i in (3,4,5,6,7) else .25}"/>' for i in range(8)) + '<text x="98" y="30" font-size="11" class="t-mono f-amber">giữa</text><path d="M10 96h106" class="s-coral" stroke-width="3"/><text x="18" y="112" font-size="10" class="t-mono f-coral">loại một nửa</text>',
      p="Khi số phòng đã <b>xếp tăng dần</b>, mở cửa <b>ở giữa</b>: số cần tìm lớn hơn thì bỏ nửa trái, nhỏ hơn thì bỏ nửa phải. Mỗi bước loại một nửa, nên 1000 phòng chỉ cần khoảng <b>10 bước</b>.",
      ex="Tra từ điển: mở khoảng giữa, thấy vần đứng trước thì lật về sau, đứng sau thì lật về trước."),
    dict(no="T3", tag="AI và máy tìm kiếm", cls="coral", title="Sắp xếp sẵn để tìm nhanh",
      svg='<path d="M20 100Q80 98 240 20" fill="none" class="s-coral" stroke-width="3"/><path d="M20 100Q120 90 240 84" fill="none" class="s-mint" stroke-width="3"/><text x="170" y="40" font-size="11" class="t-mono f-coral">tuần tự</text><text x="170" y="78" font-size="11" class="t-mono f-mint">nhị phân</text>',
      p="Dữ liệu càng lớn, cách tìm càng quan trọng. Máy tìm kiếm trên mạng và các hệ thống AI <b>sắp xếp, lập chỉ mục</b> dữ liệu từ trước để có thể tìm trong hàng tỉ trang chỉ trong tích tắc. Đổi lại, dữ liệu phải được sắp xếp <b>đúng</b>.",
      ex="Thư viện xếp sách theo mã số nên thủ thư tìm được một cuốn trong vài chục nghìn cuốn rất nhanh."),
  ],
  real=[("globe", "", "Máy tìm kiếm", "Các trang web được lập chỉ mục sẵn theo từ khóa, nên kết quả hiện ra chỉ trong một phần nhỏ của giây."),
        ("book", "mint", "Danh bạ điện thoại", "Danh bạ xếp theo tên nên điện thoại tìm được một người trong hàng nghìn liên lạc ngay khi em gõ vài chữ."),
        ("cpu", "amber", "AI tìm nước đi", "Máy chơi cờ phải tìm trong rất nhiều nước đi có thể; thuật toán tìm kiếm thông minh giúp nó bỏ qua những nhánh chắc chắn kém.")],
  breaks_h2="Thử thách: hãy làm robot tìm sai!",
  breaks_guide="Tìm nhị phân rất nhanh nhưng đòi hỏi <b>điều kiện</b> và phải viết <b>đúng từng chi tiết</b>. Thử phá xem!",
  breaks=[
    dict(icon="repeat", key="unsorted", title="Số phòng lộn xộn", p="Hành lang mới sửa, số phòng gắn <b>lộn xộn</b>, không còn tăng dần. Robot vẫn dùng tìm nhị phân.",
      why="Tìm nhị phân dựa vào điều kiện \"bên trái nhỏ hơn, bên phải lớn hơn\". Khi số phòng lộn xộn, robot loại nhầm nửa có chứa phòng cần tìm và báo <b>không có phòng</b>. Bật lại <b>xếp theo thứ tự tăng dần</b>, hoặc dùng tìm tuần tự (chậm nhưng vẫn đúng)."),
    dict(icon="map", key="big", title="Hành lang 1000 phòng", p="Trường xây thêm, hành lang dài tới <b>1000 phòng</b>, robot tìm tuần tự vẫn mở từng cửa.",
      why="Tìm tuần tự có thể phải mở hàng trăm cửa (xem biểu đồ: đường đỏ tăng vọt). Tìm nhị phân chỉ cần khoảng 10 cửa vì 2 nhân 10 lần đã được 1024. Dữ liệu càng lớn, chọn thuật toán đúng càng quan trọng."),
    dict(icon="code", key="bug", title="Lỗi thu hẹp khoảng tìm", p="Người lập trình viết nhầm: khi số cần tìm lớn hơn, robot đặt đầu khoảng <b>bằng</b> cửa giữa thay vì cửa <b>sau</b> cửa giữa.",
      why="Khi chỉ còn hai cửa, khoảng tìm không bao giờ nhỏ đi nữa: robot mở đi mở lại cùng một cửa, đi qua đi lại mãi. Chỉ sai một chi tiết nhỏ là thuật toán hỏng. Tắt <b>Robot nhị phân có lỗi</b> để sửa."),
  ],
  badge="Bậc Thầy Tìm Kiếm", badge_p="Em đã mở khóa 3 thẻ kiến thức: Tìm kiếm tuần tự · Tìm kiếm nhị phân · Sắp xếp sẵn để tìm nhanh.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Trò đoán số", "Người nhà nghĩ một số từ 1 đến 100, em đoán và được nói \"lớn hơn\" hay \"nhỏ hơn\". Dùng cách chia đôi, em có luôn đoán trúng trong 7 lần không?"),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Tìm sách trong tủ sách lớp", "Xếp tủ sách lớp theo mã số. Đo thời gian tìm 5 cuốn trước và sau khi xếp, vẽ biểu đồ so sánh."),
       (3, "Ý TƯỞNG KHKT", "Robot giao đồ trong trường", "Thiết kế bản đồ trường, đánh số phòng theo quy luật, và thuật toán giúp robot giao giấy tờ tới đúng phòng với quãng đường ngắn nhất.")],
  res=[("layers", "", "Phiếu học tập", "Tìm tuần tự, tìm nhị phân trên giấy, đếm số bước.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 40", "Máy tìm đoạn văn liên quan trước khi trả lời câu hỏi.", "../40-hoi-dap/index.html")],
  prev=("08-nghe-not-nhac", "8"), nextp=("10-toc-do-chay", "10"),
)
