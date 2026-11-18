D = dict(
  out="du-an/02-may-nhin-anh/index.html", num="2", grade="6", title="Dự án 2 · Máy nhìn ảnh như thế nào?",
  scripts=["pixel.js"],
  h1='Máy nhìn ảnh <span class="hl-word">như thế nào?</span>',
  lead="Em nhìn thấy một hình tròn. Máy tính thì chỉ thấy một bảng số. Em sẽ vẽ trên lưới điểm ảnh, xem bức vẽ biến thành những con số ra sao, pha màu bằng ba số đỏ, xanh lá, xanh dương, rồi xem máy đoán hình bằng cách so bảng số của em với các hình mẫu.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px">
        <div class="seg" id="viewBtns"><button class="btn small" data-v="human"><i data-i="eye"></i>Mắt người</button><button class="btn small ghost" data-v="machine"><i data-i="cpu"></i>Mắt máy</button></div>
        <div class="seg" id="toolBtns"><button class="btn small" data-t="1">Bút đen</button><button class="btn small ghost" data-t="0.5">Bút xám</button><button class="btn small ghost" data-t="0">Tẩy</button></div>
      </div>
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="560" aria-label="Lưới 16 nhân 16 điểm ảnh để vẽ"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="stageTag">16 × 16 = 256 ĐIỂM ẢNH</span></div></div>
      <div class="play-panel"><p class="ask" id="askText" aria-live="polite"></p>
        <div class="btn-row"><button class="btn small accent" id="btnHelp"><i data-i="sparkle"></i>Vẽ giúp em một hình</button><button class="btn small ghost" id="btnClear"><i data-i="reset"></i>Xóa hết</button>
        <label class="small" style="display:inline-flex;align-items:center;gap:6px">Đây là hình <select id="teachSel" class="sel"></select></label><button class="btn small ghost" id="btnTeach"><i data-i="book"></i>Dạy máy hình này</button></div></div>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>Độ phân giải (số ô mỗi cạnh)</span><b id="resV"></b><input type="range" id="res" min="0" max="3" step="1"></label>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optCenter" checked><span>Căn giữa trước khi so</span></label><label class="tog"><input type="checkbox" id="optNeg"><span>Tự nhận ra ảnh âm bản</span></label></div>
          <p class="small muted" style="margin:10px 0 0">Thay đổi có hiệu lực ngay với hình em vẽ và với bài kiểm tra 40 hình vẽ tay ở khung Bộ não của máy.</p>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm coral"><i data-i="sun"></i></span>Pha màu một điểm ảnh</h2>
          <div class="mixer"><canvas id="mix" width="220" height="150" aria-label="Điểm ảnh phóng to gồm ba đèn đỏ, xanh lá, xanh dương"></canvas>
          <div><label class="ctl"><span>Đỏ (R)</span><b id="rV"></b><input type="range" id="r" min="0" max="255" step="5"></label>
          <label class="ctl"><span>Xanh lá (G)</span><b id="gV"></b><input type="range" id="g" min="0" max="255" step="5"></label>
          <label class="ctl"><span>Xanh dương (B)</span><b id="bV"></b><input type="range" id="b" min="0" max="255" step="5"></label></div></div>
          <p class="small" id="mixGoal" style="margin:8px 0 0"></p>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy</div>
      <div class="metric-row"><div class="metric"><span>MÁY ĐOÁN</span><b id="bGuess">—</b></div><div class="metric"><span>ĐỘ GIỐNG</span><b id="bSim">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>SỐ Ô MÁY SO SÁNH</span><b id="bPix">—</b></div><div class="metric"><span>ĐÚNG / 40 HÌNH VẼ TAY</span><b id="bAcc">—</b></div></div>
      <div class="lbl" style="margin-top:12px">HÌNH MẪU MÁY ĐÃ HỌC</div><div id="bTpl" class="tpl-row"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Máy không thấy "hình tròn". Máy chỉ có <b style="color:#5ef2d6">256 con số</b> và so chúng với bảng số của từng hình mẫu. Mẫu nào có số giống nhất thì máy chọn.</p>
      <button class="btn small ghost" id="btnResetTpl" style="margin-top:6px"><i data-i="reset"></i>Xóa các mẫu em đã dạy</button>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Hình em vẽ giống mỗi hình mẫu bao nhiêu phần trăm?</b></div><canvas id="chart" width="1100" height="230"></canvas></div>''',
  play_guide="Hãy vẽ một hình tròn, hình vuông, tam giác, dấu cộng hoặc chữ X. Rồi bấm <b>Mắt máy</b> để xem máy thực sự \"nhìn\" thấy gì!",
  lessons=["Tin học 6 · Thông tin và dữ liệu", "Tin học 6 · Biểu diễn thông tin trong máy tính", "Toán 6 · Bảng số, so sánh số"],
  mission_h2="Hiểu vì sao với máy, một bức ảnh chỉ là bảng số",
  mission_q="Máy tính không có mắt. Vậy làm sao nó nhận ra hình em vẽ?",
  mission_p="Em sẽ <b>vẽ trên lưới điểm ảnh</b>, xem bức vẽ dưới dạng <b>bảng số</b>, <b>pha màu</b> bằng ba con số, rồi tìm ra máy đoán hình bằng cách nào và khi nào máy nhìn nhầm.",
  minutes="45 phút · 1 tiết học",
  checklist=[("draw", "Vẽ một hình và để máy đoán"), ("numbers", "Chuyển sang Mắt máy để xem bảng số"), ("color", "Pha ra màu vàng bằng ba số R, G, B"), ("teach", "Dạy máy một hình mẫu mới"), ("soi", "Soi tới bước So với mẫu"), ("broke", "Làm máy nhìn nhầm ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy đoán hình như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng đúng bức vẽ của em.",
  soi_guide="Máy không có mắt, chỉ có <b>những con số</b>. Cùng xem bức vẽ của em đi qua máy như thế nào nhé!",
  cards=[
    dict(no="T1", tag="Dữ liệu", title="Điểm ảnh",
      svg='<g>' + ''.join(f'<rect x="{20+(i%8)*14}" y="{14+(i//8)*12}" width="13" height="11" class="{"f-violet" if (i%8-3.5)**2+(i//8-3.5)**2<9 and (i%8-3.5)**2+(i//8-3.5)**2>3 else "f-line"}" opacity="{1 if (i%8-3.5)**2+(i//8-3.5)**2<9 and (i%8-3.5)**2+(i//8-3.5)**2>3 else .25}"/>' for i in range(64)) + '</g><path d="M150 60h30" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><circle cx="222" cy="60" r="32" fill="none" class="s-violet" stroke-width="7"/>',
      p="Mọi bức ảnh trên máy tính đều được chia thành rất nhiều <b>ô vuông nhỏ</b> gọi là <b>điểm ảnh</b> (pixel). Ô càng nhiều, ảnh càng rõ. Số ô mỗi cạnh gọi là <b>độ phân giải</b>.",
      ex="Điện thoại \"12 megapixel\" chụp ảnh có khoảng 12 triệu điểm ảnh. Ghé sát màn hình tivi, em có thể thấy những chấm nhỏ li ti."),
    dict(no="T2", tag="Biểu diễn thông tin", cls="amber", title="Ảnh là bảng số",
      svg='<g font-size="12" class="t-mono"><text x="16" y="34" class="f-mint">255 255 0 255</text><text x="16" y="56" class="f-mint">255 0 0 0</text><text x="16" y="78" class="f-mint">255 255 0 255</text></g><circle cx="190" cy="48" r="20" fill="#ff5d5d" opacity=".85"/><circle cx="210" cy="48" r="20" fill="#3fe07a" opacity=".85"/><circle cx="200" cy="66" r="20" fill="#4d7cff" opacity=".85"/><text x="170" y="108" font-size="10" class="t-mono f-amber">R · G · B</text>',
      p="Máy lưu mỗi điểm ảnh bằng <b>con số</b>: ảnh đen trắng dùng một số độ sáng từ 0 (đen) tới 255 (trắng). Ảnh màu dùng <b>ba số</b> cho ba đèn <b>đỏ, xanh lá, xanh dương</b>. Cả bức ảnh là một <b>bảng số</b>.",
      ex="Đỏ 255, xanh lá 255, xanh dương 0 cho ra màu vàng. Ba số đều 255 là màu trắng, ba số đều 0 là màu đen."),
    dict(no="T3", tag="Cách AI nhận dạng", cls="coral", title="So khớp với mẫu",
      svg='<rect x="20" y="20" width="70" height="70" rx="8" class="f-violet" opacity=".25"/><circle cx="55" cy="55" r="24" fill="none" class="s-violet" stroke-width="6"/><text x="104" y="62" font-size="20" class="f-amber" font-weight="800">≈</text><rect x="136" y="20" width="70" height="70" rx="8" class="f-mint" opacity=".25"/><circle cx="171" cy="55" r="26" fill="none" class="s-mint" stroke-width="6"/><text x="214" y="62" font-size="13" class="t-mono f-mint">92%</text>',
      p="Máy đặt bảng số của hình em vẽ cạnh bảng số của từng <b>hình mẫu</b> và đếm xem các ô <b>trùng nhau</b> nhiều hay ít. Mẫu giống nhất là câu trả lời. Có nhiều mẫu hơn thì máy nhận ra được nhiều kiểu vẽ hơn.",
      ex="Khi em so dấu vân tay hoặc tìm \"điểm khác nhau\" giữa hai bức tranh, em cũng đang so từng chỗ một như máy."),
  ],
  real=[("camera", "", "Camera điện thoại", "Mỗi tấm ảnh em chụp là hàng triệu điểm ảnh, mỗi điểm gồm ba số đỏ, xanh lá, xanh dương."),
        ("scan", "mint", "Quét mã QR", "Máy đọc mã QR bằng cách xem từng ô vuông đen hay trắng, tức là 0 hay 1."),
        ("image", "amber", "Nhận dạng chữ viết tay", "Ứng dụng quét bài làm, đọc số trên phong bì thư cũng biến chữ thành bảng số rồi so với các mẫu đã học.")],
  breaks_h2="Thử thách: hãy làm máy nhìn nhầm!",
  breaks_guide="Máy chỉ thấy số. Đổi một chút cách các con số được tạo ra là máy có thể nhìn nhầm. Thử xem nào!",
  breaks=[
    dict(icon="image", key="lowres", title="Ảnh mờ, ít điểm ảnh", p="Ảnh của em bị thu nhỏ còn <b>4 × 4 = 16 ô</b>. Máy vẫn phải đoán hình tam giác.",
      why="Chỉ còn 16 ô thì các hình đều thành vài mảng xám giống nhau, máy không còn thấy cạnh hay góc nữa nên dễ đoán nhầm. Kéo thanh <b>Độ phân giải</b> lên 16 để máy có lại đủ chi tiết. Xem số hình đoán đúng trong 40 hình vẽ tay thay đổi thế nào."),
    dict(icon="sun", key="neg", title="Ảnh âm bản", p="Camera gửi ảnh bị <b>đảo màu</b>: nền thành đen, nét vẽ thành trắng. Với em vẫn là cùng một hình.",
      why="Đảo màu làm <b>mọi con số</b> trong bảng thay đổi: 255 thành 0, 0 thành 255. Máy so số nên thấy một hình hoàn toàn khác. Bật <b>Tự nhận ra ảnh âm bản</b>: nếu ảnh có quá nhiều ô tối, máy đảo lại trước khi so."),
    dict(icon="crosshair", key="corner", title="Vẽ lệch vào góc", p="Một hình tròn <b>nhỏ xíu</b> nằm ở góc ảnh, và máy bị tắt bước <b>căn giữa</b>.",
      why="Các mẫu đều to và nằm giữa ảnh. Hình nhỏ ở góc thì hầu như không có ô nào trùng với mẫu tròn, lại trùng với góc của mẫu vuông. Bật <b>Căn giữa trước khi so</b>: máy cắt sát hình, phóng to ra giữa rồi mới so."),
  ],
  badge="Mắt Thần Điểm Ảnh", badge_p="Em đã mở khóa 3 thẻ kiến thức: Điểm ảnh · Ảnh là bảng số · So khớp với mẫu.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Tranh theo số", "Vẽ một bức tranh 10 × 10 ô trên giấy kẻ ô, ghi số 0 và 1 vào từng ô, rồi đưa bảng số cho bạn tô lại. Bạn có ra đúng tranh của em không?"),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Dạy máy chữ số", "Dùng chế độ Dạy máy để dạy các chữ số 0, 1, 7 (chọn tên gần nhất hoặc ghi lại riêng). Mỗi bạn vẽ 5 lần, ghi lại máy đoán đúng bao nhiêu lần."),
       (3, "Ý TƯỞNG KHKT", "Máy đếm lá vàng", "Chụp ảnh lá cây, dùng ba số R, G, B của từng điểm ảnh để đếm phần trăm diện tích lá bị vàng, giúp theo dõi cây trồng.")],
  res=[("layers", "", "Phiếu học tập", "Tranh theo số, pha màu trên giấy, không cần máy tính.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 34", "Máy tự học bộ lọc để nhận ra lá cây bị bệnh.", "../34-la-cay/index.html")],
  prev=("01-doan-con-vat", "1"), nextp=("03-xuc-xac", "3"),
)
