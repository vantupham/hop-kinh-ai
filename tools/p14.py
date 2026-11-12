D = dict(
  out="du-an/14-la-cay/index.html", num="14", level="3", title="Dự án 14 · Bác sĩ lá cây",
  scripts=["leaf-gen.js", "cnn.js"],
  h1='Bác sĩ <span class="hl-word">lá cây</span>',
  lead="Người nông dân chụp một chiếc lá, ứng dụng báo ngay: \"lá bị đốm, nên xử lý sớm\". Bên trong là mạng tích chập, loại mạng nơ-ron giúp máy tính nhìn thấy ảnh. Ở dự án này em sẽ tự tay thiết kế các bộ lọc của nó, chấm \"bệnh\" lên lá, và hỏi máy: em đang nhìn vào đâu?",
  moi='''
  <style>.file-btn{position:relative;overflow:hidden}.file-btn input{position:absolute;inset:0;opacity:0;cursor:pointer}
  .filters{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.flt{border:1px solid var(--line);border-radius:14px;padding:10px;background:var(--surface);cursor:pointer;min-width:0}.flt.on{border-color:var(--amber);box-shadow:0 0 0 2px color-mix(in srgb,var(--amber) 35%,transparent)}
  .flt-h{display:flex;gap:8px;align-items:center;margin-bottom:6px}.flt-h b{font-family:"JetBrains Mono",monospace;color:var(--violet)}.flt-h select{flex:1;min-width:0;background:var(--surface-solid);color:var(--text);border:1px solid var(--line-strong);border-radius:8px;padding:4px 6px;font:inherit;font-size:.8rem}
  .flt .chs{gap:4px;margin-bottom:6px}.flt .chs .btn{padding:3px 7px;font-size:.7rem}.kgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-bottom:6px}.kgrid input{width:100%;min-width:0;text-align:center;font:600 .85rem "JetBrains Mono",monospace;padding:5px 0;border-radius:6px;border:1px solid var(--line-strong);background:var(--surface-solid);color:var(--text)}.kgrid input.pos{background:color-mix(in srgb,var(--mint) 22%,var(--surface-solid))}.kgrid input.neg{background:color-mix(in srgb,var(--coral) 22%,var(--surface-solid))}
  .flt canvas{width:100%;aspect-ratio:1;border-radius:8px;image-rendering:pixelated;display:block}
  @media(max-width:760px){.filters{grid-template-columns:repeat(2,minmax(0,1fr))}}</style>
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="640" height="480" aria-label="Ảnh lá, 6 bản đồ đặc trưng và chẩn đoán"></canvas><video id="video" playsinline muted hidden></video><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div class="stage-msg" id="stageMsg" hidden></div></div>
      <div class="toolbar">
        <div class="seg"><button class="btn small" id="srcSim"><i data-i="film"></i>Mô phỏng</button><button class="btn small ghost" id="srcCam"><i data-i="camera"></i>Camera thật</button></div>
        <button class="btn small ghost" id="btnHeat" aria-pressed="false"><i data-i="eye"></i>AI nhìn vào đâu?</button>
      </div>
      <div class="game"><span class="small muted">Lá mới</span><div class="btn-row" id="clsBtns"><button class="btn small ghost" data-c="0">Lá khỏe</button><button class="btn small ghost" data-c="1">Đốm lá</button><button class="btn small ghost" data-c="2">Vàng lá</button><button class="btn small ghost" data-c="r"><i data-i="reset"></i>Ngẫu nhiên</button><label class="btn small ghost file-btn"><i data-i="upload"></i>Ảnh lá của em<input type="file" id="fileIn" accept="image/*"></label></div></div>
      <p class="small muted" style="margin:8px 0 0"><i data-i="bulb"></i> Chạm vào chiếc lá để chấm thêm đốm bệnh. Chạm vào một bản đồ đặc trưng để chọn bộ lọc đó.</p>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não AI · cấu tạo</div>
      <div class="lbl">CÁC LỚP CỦA MẠNG</div>
      <div class="layers-list" style="display:grid;gap:6px;color:#fff;font-size:.82rem;margin-top:6px">
        <div>1. Ảnh 48×48×3</div><div>2. Tích chập: <b style="color:#ffc34d">6 bộ lọc 3×3</b> (em thiết kế)</div><div>3. ReLU → gộp max 2×2</div><div>4. Tóm tắt: 12 đặc trưng</div><div>5. Phân loại: 3 bệnh (máy tự học)</div>
      </div>
      <div class="metric-row" style="margin-top:12px"><div class="metric"><span>ĐỘ CHÍNH XÁC KIỂM TRA</span><b id="bTest">—</b></div><div class="metric"><span>LÁ ĐỂ HỌC</span><b>600</b></div></div>
    </aside>
  </div>''',
  mission_h2="Xây \"đôi mắt\" cho máy: các bộ lọc tích chập",
  mission_q="Máy tìm đốm bệnh thế nào khi đốm có thể nằm ở bất kỳ chỗ nào trên lá?",
  mission_p="Em sẽ xem một <b>bộ lọc 3×3</b> trượt qua ảnh, thấy <b>bản đồ đặc trưng</b> sáng lên ở chỗ bệnh, hiểu bước <b>gộp</b>, rồi tự thiết kế bộ lọc. Cuối cùng em sẽ bắt quả tang máy học <b>đường tắt</b> bằng bản đồ \"AI nhìn vào đâu\".",
  minutes="60–75 phút",
  checklist=[("paint", "Chấm ít nhất 3 đốm lên một lá và xem chẩn đoán đổi"), ("heat", "Bật bản đồ AI nhìn vào đâu"), ("soi", "Soi tới bước Trượt bộ lọc"), ("filter", "Tự sửa một bộ lọc"), ("broke", "Làm bác sĩ AI chẩn đoán sai ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Bên trong mạng tích chập: 6 bước",
  soi_p="Hình bên dưới dùng đúng chiếc lá ở phần Mồi và bộ lọc em đang chọn (khung vàng).",
  theory=[
    dict(no="53", tag="Thị giác máy", title="Phép tích chập",
      svg='<g class="f-soft"><rect x="20" y="20" width="90" height="90" rx="4"/></g><g class="s-line" stroke-width="1"><path d="M50 20v90M80 20v90M20 50h90M20 80h90"/></g><rect x="20" y="20" width="60" height="60" fill="none" stroke="#ffc34d" stroke-width="3"/><path d="M118 50h40" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="170" y="30" width="60" height="60" rx="4" class="f-soft"/><rect x="170" y="30" width="20" height="20" fill="#ffc34d"/><text x="166" y="112" font-size="10" class="t-mono f-muted">nhân 9 ô rồi cộng</text>',
      p="Một <b>bộ lọc</b> nhỏ 3×3 trượt qua từng vị trí của ảnh. Ở mỗi chỗ, nhân 9 điểm ảnh với 9 trọng số rồi cộng lại. Kết quả là một <b>bản đồ đặc trưng</b>: chỗ nào giống mẫu của bộ lọc thì sáng lên.",
      deep="Vì cùng một bộ lọc dùng cho mọi vị trí, mạng tích chập cần ít trọng số hơn nhiều so với mạng ở Dự án 11, và nhận ra đốm bệnh dù nó nằm ở góc nào. Đây là ý tưởng giúp máy tính nhìn được ảnh."),
    dict(no="54", tag="Toán + AI", cls="amber", title="Gộp (pooling)",
      svg='<g font-size="12" class="t-mono"><rect x="20" y="30" width="80" height="80" rx="4" class="f-soft"/><text x="32" y="58" class="f-ink">1 3</text><text x="32" y="90" class="f-ink">2 9</text><text x="68" y="58" class="f-ink">4 0</text><text x="68" y="90" class="f-ink">5 1</text></g><path d="M108 70h40" class="s-violet" stroke-width="2.5" marker-end="url(#arV)"/><rect x="160" y="40" width="60" height="60" rx="4" class="f-soft"/><text x="172" y="68" font-size="12" class="t-mono f-coral">9 5</text><text x="160" y="118" font-size="10" class="t-mono f-muted">giữ số lớn nhất</text>',
      p="Sau tích chập, mỗi ô 2×2 chỉ giữ lại <b>số lớn nhất</b>. Bản đồ nhỏ đi 4 lần nhưng vẫn giữ tín hiệu mạnh nhất, và đốm lệch một chút cũng không làm kết quả thay đổi nhiều.",
      deep="Xếp nhiều lần tích chập rồi gộp, mỗi lớp sau \"nhìn\" được một vùng rộng hơn: lớp đầu thấy cạnh và đốm, lớp sau thấy hình dạng, lớp sau nữa thấy cả chiếc lá."),
    dict(no="55", tag="Học máy", cls="coral", title="Mạng tích chập (CNN)",
      svg='<rect x="14" y="40" width="44" height="44" rx="4" class="f-mint"/><g class="f-violet" opacity=".85"><rect x="78" y="34" width="34" height="34" rx="3"/><rect x="84" y="40" width="34" height="34" rx="3"/><rect x="90" y="46" width="34" height="34" rx="3"/></g><g class="f-amber"><rect x="146" y="46" width="20" height="20" rx="2"/><rect x="150" y="50" width="20" height="20" rx="2"/></g><g class="f-coral"><circle cx="210" cy="40" r="7"/><circle cx="210" cy="62" r="7"/><circle cx="210" cy="84" r="7"/></g><text x="12" y="116" font-size="10" class="t-mono f-muted">ảnh → lọc → gộp → phân loại</text>',
      p="<b>Mạng tích chập</b> = các lớp tích chập + gộp để trích đặc trưng, rồi một lớp phân loại ở cuối. Ở đây em thiết kế bộ lọc bằng tay. Trong mạng thật, <b>máy tự học</b> các con số trong bộ lọc bằng lan truyền ngược.",
      deep="Các mạng nhận dạng ảnh nổi tiếng có hàng chục tới hàng trăm lớp tích chập. Người ta còn dùng <b>học chuyển giao</b>: lấy một mạng đã học từ hàng triệu ảnh, chỉ dạy lại lớp cuối cho bài toán của mình, như ở Dự án 6."),
    dict(no="56", tag="Đạo đức", cls="mint", title="Đường tắt & giải thích được",
      svg='<rect x="20" y="20" width="100" height="90" rx="6" fill="#4a3426"/><ellipse cx="70" cy="64" rx="20" ry="30" fill="#3f8f3a"/><rect x="140" y="20" width="100" height="90" rx="6" fill="#4a3426"/><ellipse cx="190" cy="64" rx="20" ry="30" fill="#3f8f3a"/><g fill="#ff5d3c" opacity=".7"><rect x="140" y="20" width="30" height="90"/><rect x="210" y="20" width="30" height="90"/></g><text x="146" y="124" font-size="10" class="t-mono f-coral">nhìn vào nền!</text>',
      p="Máy có thể đạt điểm cao vì học <b>đường tắt</b>: ví dụ \"nền đất = lá bệnh\". Cách bắt quả tang: che từng phần ảnh bằng một ô xám và xem dự đoán thay đổi bao nhiêu. Chỗ nào che vào làm dự đoán đổi nhiều nhất là chỗ máy đang dựa vào.",
      deep="Cách này gọi là <b>bản đồ che khuất</b> (occlusion map), một kỹ thuật của AI giải thích được. Khi học, máy cũng được xem các ảnh bị che ngẫu nhiên một ô xám để quen với việc này. Trong y tế, đã có mô hình đọc X-quang học nhầm theo ký hiệu của bệnh viện in trên phim thay vì hình ảnh phổi."),
  ],
  tulam_h2="Bàn thí nghiệm: thiết kế 6 bộ lọc của em",
  tulam_p="Chọn bộ lọc mẫu, đổi kênh, hoặc gõ số vào 9 ô (từ −9 tới 9). Ô xanh là trọng số dương, ô đỏ là trọng số âm. Mỗi lần sửa, lớp phân loại được huấn luyện lại ngay.",
  tulam='''
  <div class="card"><div class="chart-head"><b><i data-i="sliders"></i> 6 bộ lọc và bản đồ đặc trưng trên chiếc lá hiện tại</b><button class="btn small ghost" id="btnPreset"><i data-i="reset"></i>Khôi phục bộ lọc mẫu</button></div><div class="filters" id="filters"></div></div>
  <div class="two-col" style="margin-top:18px">
    <div class="card">
      <h3 class="h-ic"><span class="ico-box sm coral"><i data-i="layers"></i></span>Dữ liệu & tiền xử lý</h3>
      <label class="tog" style="display:block;margin:6px 0"><input type="checkbox" id="augBg"><span>Trộn phông nền khi học</span></label>
      <label class="tog" style="display:block;margin:6px 0 12px"><input type="checkbox" id="norm"><span>Chuẩn hóa độ sáng</span></label>
      <div id="trainStatus" class="small"></div>
      <h3 class="h-ic" style="margin-top:14px"><span class="ico-box sm"><i data-i="checkCircle"></i></span>Ma trận nhầm lẫn (150 lá kiểm tra)</h3>
      <div class="lab" id="confOut"></div>
    </div>
    <div class="card">
      <div class="chart-head"><b><i data-i="chart"></i> Độ chính xác qua từng vòng học</b><span class="legend"><i class="lg" style="background:var(--violet)"></i>tập học <i class="lg" style="background:var(--mint)"></i>tập kiểm tra</span></div>
      <canvas id="chart" width="540" height="200"></canvas>
      <h3 class="h-ic" style="margin-top:14px"><span class="ico-box sm mint"><i data-i="code"></i></span>Code thật của bộ lọc đang chọn</h3><pre class="code" id="genCode"></pre>
    </div>
  </div>''',
  breaks_h2="Thử thách: hãy làm bác sĩ AI chẩn đoán sai!",
  breaks=[
    dict(icon="image", key="shortcut", title="Đường tắt phông nền", p="Khi thu thập dữ liệu, lá khỏe đều chụp trên <b>bàn</b>, còn lá bệnh đều chụp ngoài <b>ruộng</b> trên nền đất.",
      why="Máy học được rằng \"nền đất = bệnh\" vì như vậy dễ hơn tìm đốm. Bản đồ AI nhìn vào đâu sáng ở <b>phần đất</b> chứ không phải chiếc lá. Bật <b>Trộn phông nền khi học</b>. Ngoài đời: thu thập ảnh ở nhiều nơi, nhiều nền khác nhau."),
    dict(icon="eye", key="blind", title="Bộ lọc mù màu", p="Cả 6 bộ lọc bị đổi thành <b>làm mờ trên kênh độ sáng</b>.",
      why="Bộ lọc làm mờ không phát hiện được đốm, còn kênh độ sáng không phân biệt được vàng với xanh. Lớp phân loại học giỏi đến đâu cũng không cứu được khi đặc trưng đầu vào không chứa thông tin. Bấm <b>Khôi phục bộ lọc mẫu</b>, hoặc tự thiết kế lại."),
    dict(icon="sun", key="dark", title="Chụp lúc trời tối", p="Ảnh kiểm tra được chụp lúc <b>chạng vạng</b>, tối hơn hẳn ảnh lúc học, và bước chuẩn hóa độ sáng bị tắt.",
      why="Màu vàng úa trở nên tối, giống màu lá khỏe, nên máy nhầm. Bật <b>Chuẩn hóa độ sáng</b>: mọi ảnh được đưa về cùng mức sáng trước khi tính. Đây là bước <b>tiền xử lý</b>, quan trọng không kém mô hình."),
  ],
  real_h2="Mạng tích chập đang được dùng ở đâu?",
  real=[("camera", "", "Nông nghiệp", "Ứng dụng chụp lá để nhận diện bệnh lúa, cà phê, sầu riêng; máy bay không người lái chụp cả cánh đồng để tìm vùng bị bệnh."),
        ("heart", "mint", "Y tế", "Hỗ trợ bác sĩ đọc ảnh X-quang, ảnh da liễu, ảnh võng mạc để phát hiện bệnh sớm."),
        ("figure", "amber", "Mọi dự án trước", "Mô hình dáng người, bàn tay, khuôn mặt ở Cấp 1 đều có mạng tích chập bên trong.")],
  ethics=["Ứng dụng nói lá bị bệnh và khuyên phun thuốc, nhưng nó sai. Ai chịu thiệt hại? Ứng dụng nên nói gì khi không chắc chắn?",
          "Nếu dữ liệu học chỉ có giống lúa ở một vùng, ứng dụng có công bằng với nông dân ở vùng khác không?",
          "Vì sao một mô hình y tế cần cho bác sĩ xem \"máy đang nhìn vào đâu\" chứ không chỉ đưa ra kết luận?"],
  badge="Bác Sĩ Thị Giác", badge_p="Em đã mở khóa 4 thẻ kiến thức: Phép tích chập · Gộp · Mạng tích chập · Đường tắt & giải thích được.",
  dev_h2="Từ bác sĩ lá cây đến dự án của riêng em",
  dev=[(1, "MỞ RỘNG NHỎ · 1 BUỔI", "Bộ lọc của riêng em", "Thiết kế một bộ lọc mới phát hiện vết rách hoặc lỗ thủng trên lá, thêm lớp \"lá rách\" vào bộ tạo dữ liệu.", "Xong khi", "độ chính xác với 4 lớp vẫn trên 80%."),
       (2, "DỰ ÁN MỚI · 1–2 TUẦN", "Bác sĩ lá thật với Teachable Machine", "Chụp 50–100 ảnh lá thật mỗi loại (khỏe, bệnh) ở vườn trường, dạy một mạng tích chập có sẵn bằng học chuyển giao.", "Xong khi", "kiểm tra trên ảnh mới chụp ở chỗ khác, và báo cáo cả những lần đoán sai."),
       (3, "ĐỀ TÀI NGHIÊN CỨU · KHKT", "Phát hiện sớm bệnh trên cây trồng địa phương", "Hợp tác với cán bộ khuyến nông, xây bộ ảnh bệnh của một loại cây ở địa phương, so sánh mô hình với chẩn đoán chuyên gia.", "Đo kết quả", "độ chính xác, số ca bỏ sót bệnh, và kiểm tra bằng bản đồ che khuất xem mô hình có học đường tắt không.")],
  cur="14 · Lá cây", next=[("15 · Cử chỉ chuyển động", "chuỗi theo thời gian"), ("19 · Xe tự lái tiến hóa", "mạng nơ-ron học bằng tiến hóa"), ("20 · Trợ lý hỏi đáp SGK", "AI có trích dẫn nguồn")],
  khkt=[("Vấn đề", "Nông dân thường phát hiện bệnh lá khi đã lan rộng."), ("Câu hỏi nghiên cứu", "Mạng tích chập trên điện thoại có phát hiện bệnh sớm chính xác như cán bộ khuyến nông không?"), ("Giả thuyết", "Độ chính xác trên 85% với ảnh chụp theo hướng dẫn chuẩn."), ("Lưu ý đạo đức", "Ứng dụng chỉ gợi ý, không thay chuyên gia; báo rõ khi không chắc chắn.")],
  prev=("13-phan-cum", "13"), nextp=("15-thu-ngu", "15"),
)
