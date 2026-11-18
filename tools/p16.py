D = dict(
  out="du-an/16-bo-canh-cung/index.html", num="16", grade="9", title="Dự án 16 · Bọ cánh cứng ngụy trang",
  scripts=["beetle.js"],
  h1='Bọ cánh cứng <span class="hl-word">ngụy trang</span>: tiến hóa trong máy tính',
  lead="Một đàn bọ cánh cứng đủ màu sống trên thân cây. Chim ăn những con dễ thấy, con khó thấy sống sót và sinh con mang gen của bố mẹ, thỉnh thoảng có đột biến. Em sẽ tự làm chim, xem đàn bọ đổi màu qua từng thế hệ, và hiểu vì sao các kĩ sư dùng chính ý tưởng này để máy tính tự tìm lời giải: thuật toán di truyền.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="stage vf"><canvas id="stage" class="touch" width="880" height="440" aria-label="Đàn bọ cánh cứng trên nền môi trường, bấm vào bọ để bắt khi làm chim"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="envTag">VỎ CÂY NÂU</span></div><div class="stage-msg" id="msg" hidden></div></div>
      <div class="play-panel"><p class="small" style="margin:0 0 8px"><b>Môi trường sống:</b></p><div class="seg" id="envs"></div>
        <div class="btn-row" style="margin-top:12px"><button class="btn small accent" id="btnBird" type="button"><i data-i="target"></i>Em làm chim</button><button class="btn small" id="btnStep" type="button"><i data-i="skip"></i>Chạy 1 thế hệ</button><button class="btn small" id="btnRun" type="button"><i data-i="play"></i>Tự chạy 20 thế hệ</button><button class="btn small ghost" id="btnNew" type="button"><i data-i="reset"></i>Thả đàn bọ mới</button></div></div>
      <p class="ask" id="askText" aria-live="polite" style="margin:12px 0 0;font-size:1.02rem"></p>
      {{GUIDE}}
      <div class="two-col" style="margin-top:6px">
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm amber"><i data-i="sliders"></i></span>Bàn thí nghiệm</h2>
          <label class="ctl"><span>Mức đột biến (gen con lệch khỏi gen bố mẹ)</span><b id="mutV"></b><input type="range" id="mut" min="0" max="80" step="2"></label>
          <label class="ctl"><span>Số bọ bị chim ăn mỗi thế hệ (trên 24 con)</span><b id="eatV"></b><input type="range" id="eat" min="4" max="20" step="2"></label>
        </div>
        <div class="card">
          <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="repeat"></i></span>Cách sinh sản và săn mồi</h2>
          <div class="toggles"><label class="tog"><input type="checkbox" id="optCross" checked><span>Bọ con nhận gen từ cả bố và mẹ (lai)</span></label><label class="tog"><input type="checkbox" id="optSharp" checked><span>Chim tinh mắt (tắt: chim bắt khá ngẫu nhiên)</span></label></div>
        </div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của mô phỏng</div>
      <div class="metric-row"><div class="metric"><span>THẾ HỆ</span><b id="bGen">0</b></div><div class="metric"><span>ĐỘ LẪN TRUNG BÌNH</span><b id="bCamo">—</b></div></div>
      <div class="lbl" style="margin-top:12px">MÀU NỀN VÀ MÀU TRUNG BÌNH CỦA ĐÀN BỌ</div>
      <div class="swatch-row" style="margin-top:6px"><span class="swatch" id="swEnv"></span><span class="small" style="color:#c3c7f0">nền</span><span class="swatch" id="swPop"></span><span class="small" style="color:#c3c7f0">đàn bọ</span></div>
      <div class="lbl" style="margin-top:12px">GEN CỦA CON BỌ EM CHẠM VÀO</div><div id="bGene" class="calc">Chạm vào một con bọ để xem ba gen màu của nó.</div>
      <div class="lbl" style="margin-top:12px">MÀU CỦA 24 CON (XẾP TỪ KHÓ THẤY ĐẾN DỄ THẤY)</div><div id="bStrip" class="pop-strip"></div>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Độ lẫn trung bình của đàn bọ qua từng thế hệ (dải màu dưới: màu trung bình của đàn)</b></div><canvas id="chart" width="1100" height="240"></canvas></div>''',
  play_guide="Bấm <b>Em làm chim</b> rồi bắt những con bọ em nhìn thấy trước. Sau khi em bắt đủ, những con còn lại sinh con. Hoặc bấm <b>Tự chạy</b> để chim máy săn mồi.",
  lessons=["KHTN 9 · Gen, di truyền và biến dị", "KHTN 9 · Tiến hóa, chọn lọc tự nhiên", "Tin học 9 · Mô phỏng và giải quyết vấn đề"],
  mission_h2="Xem chọn lọc tự nhiên diễn ra, và mượn ý tưởng đó cho máy tính",
  mission_q="Không ai \"sơn\" cho bọ, vậy sao sau vài chục thế hệ cả đàn lại cùng màu với vỏ cây?",
  mission_p="Em sẽ làm chim săn bọ, chạy mô phỏng qua nhiều thế hệ, chỉnh <b>mức đột biến</b> và <b>áp lực chọn lọc</b>, rồi phá máy bằng <b>môi trường đổi màu</b>, <b>không có đột biến</b> và <b>đột biến quá mạnh</b>. Cuối cùng em thấy máy tính dùng cùng vòng lặp \"chọn lọc, lai, đột biến\" để tự tìm lời giải.",
  minutes="45 phút · 1 tiết học",
  checklist=[("bird", "Tự làm chim bắt bọ trong 1 thế hệ"), ("gens", "Cho đàn bọ sống qua ít nhất 20 thế hệ"), ("camo", "Đạt độ lẫn trung bình từ 85% trở lên"), ("soi", "Soi tới bước Đột biến"), ("broke", "Làm cho đàn bọ không ngụy trang được ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Một thế hệ của thuật toán di truyền: 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng chính đàn bọ đang có trên màn hình.",
  soi_guide="Đây là vòng lặp em học ở KHTN 9, được viết thành <b>thuật toán</b>. Cùng soi nhé!",
  cards=[
    dict(no="T1", tag="KHTN 9", title="Gen và biến dị",
      svg='<rect x="20" y="22" width="60" height="26" rx="6" fill="#c8503c"/><text x="34" y="40" font-size="12" fill="#fff" font-weight="800">R 200</text><rect x="90" y="22" width="60" height="26" rx="6" fill="#3fae49"/><text x="104" y="40" font-size="12" fill="#fff" font-weight="800">G 90</text><rect x="160" y="22" width="60" height="26" rx="6" fill="#3c6ab3"/><text x="174" y="40" font-size="12" fill="#fff" font-weight="800">B 60</text><ellipse cx="120" cy="88" rx="22" ry="16" fill="rgb(200,90,60)"/><text x="160" y="94" font-size="11" class="f-ink">= màu thân</text>',
      p="Trong mô phỏng, màu mỗi con bọ do <b>ba gen</b> quyết định (lượng đỏ, xanh lá, xanh dương). Bọ con nhận gen từ bố và mẹ, nhưng thỉnh thoảng một gen bị <b>đột biến</b> lệch đi một chút: đó là nguồn tạo ra <b>biến dị</b> mới.",
      ex="Thật ra màu thân do nhiều gen phức tạp hơn; mô phỏng giữ lại ý chính: tính trạng do gen quy định và được di truyền."),
    dict(no="T2", tag="Tiến hóa", cls="amber", title="Chọn lọc tự nhiên",
      svg='<rect x="14" y="16" width="232" height="90" rx="10" fill="#6e4e34"/><ellipse cx="60" cy="50" rx="12" ry="9" fill="#e0c040"/><ellipse cx="120" cy="70" rx="12" ry="9" fill="#704f36"/><ellipse cx="190" cy="44" rx="12" ry="9" fill="#5a8fd0"/><ellipse cx="160" cy="84" rx="12" ry="9" fill="#73513a"/><path d="M50 40l20 20M70 40l-20 20M180 34l20 20M200 34l-20 20" stroke="#ff7d5f" stroke-width="3"/>',
      p="Con nào <b>dễ thấy</b> thì bị chim ăn trước, con <b>khó thấy</b> sống sót và để lại con cháu. Lặp lại nhiều thế hệ, gen giúp ngụy trang ngày càng phổ biến. Không ai chọn màu cho bọ: môi trường <b>chọn lọc</b> những biến dị có lợi.",
      ex="Bướm sâu đo bạch dương ở Anh: khi khói nhà máy làm thân cây đen đi, bướm màu sẫm tăng nhanh; khi không khí sạch lại, bướm màu sáng tăng trở lại."),
    dict(no="T3", tag="AI", cls="coral", title="Thuật toán di truyền",
      svg='<circle cx="130" cy="62" r="40" fill="none" class="s-violet" stroke-width="3"/><text x="104" y="20" font-size="11" class="f-ink" font-weight="700">Chọn lọc</text><text x="182" y="70" font-size="11" class="f-ink" font-weight="700">Lai</text><text x="96" y="116" font-size="11" class="f-ink" font-weight="700">Đột biến</text><text x="20" y="70" font-size="11" class="f-ink" font-weight="700">Đánh giá</text>',
      p="Máy tính bắt chước vòng lặp tự nhiên: tạo nhiều <b>lời giải thử</b>, <b>đánh giá</b> lời giải nào tốt, giữ lại lời giải tốt, <b>lai</b> và <b>đột biến</b> chúng để tạo thế hệ mới. Sau nhiều vòng, lời giải tốt dần lên mà không ai phải tính trước đáp án.",
      ex="Các kĩ sư đã dùng thuật toán di truyền để thiết kế ăng-ten vệ tinh, xếp thời khóa biểu, tìm hình dạng cánh tối ưu."),
  ],
  real=[("rocket", "", "Thiết kế ăng-ten vệ tinh", "Máy tính thử hàng nghìn hình dạng ăng-ten, giữ lại và lai những hình thu sóng tốt nhất."),
        ("clock", "mint", "Xếp thời khóa biểu", "Mỗi thời khóa biểu là một \"cá thể\"; ít trùng tiết, ít tiết trống thì \"khỏe\" hơn và được giữ lại."),
        ("activity", "amber", "Nghiên cứu sinh học", "Các nhà khoa học mô phỏng quần thể trên máy tính để dự đoán loài thích nghi thế nào khi môi trường thay đổi.")],
  breaks_h2="Thử thách: hãy làm đàn bọ hết ngụy trang!",
  breaks_guide="Tiến hóa cần đủ điều kiện mới diễn ra. Thử ba cách làm nó thất bại!",
  breaks=[
    dict(icon="globe", key="change", title="Môi trường đổi màu", p="Đàn bọ đã sống 30 thế hệ trên bãi cát vàng. Rồi mưa nhiều năm liền, cây cỏ mọc kín: nền sống thành <b>lá cây xanh</b>.",
      why="Gen tốt ở môi trường cũ trở nên bất lợi ở môi trường mới: độ lẫn tụt mạnh. Không có màu nào là \"tốt nhất\" mãi mãi. Bấm <b>Tự chạy 20 thế hệ</b>: nhờ đột biến, đàn bọ dần thích nghi lại, nhưng cần thời gian và nhiều con bị ăn."),
    dict(icon="lock", key="nomut", title="Không có đột biến", p="Một đàn bọ toàn màu đỏ sống trên lá xanh, và <b>mức đột biến = 0</b>. Máy đã chạy 30 thế hệ.",
      why="Chọn lọc chỉ giữ lại con tốt nhất <b>đang có</b>. Không đột biến thì không có biến dị mới, đàn bọ mắc kẹt ở màu đỏ nâu. Kéo <b>mức đột biến</b> lên khoảng 10 đến 20 rồi chạy tiếp."),
    dict(icon="bolt", key="toomuch", title="Đột biến quá mạnh", p="Đàn bọ trên nền đá xám, nhưng <b>mức đột biến = 80</b>. Máy đã chạy 30 thế hệ.",
      why="Con sinh ra lệch quá xa bố mẹ nên gen tốt không được giữ lại, đàn bọ loang lổ mãi. Đột biến cần <b>vừa đủ</b>: đủ để tạo cái mới, không nhiều đến mức xóa mất cái tốt. Giảm về khoảng 10 rồi chạy tiếp."),
  ],
  badge="Nhà Sinh Học Số", badge_p="Em đã mở khóa 3 thẻ kiến thức: Gen và biến dị · Chọn lọc tự nhiên · Thuật toán di truyền.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Trò chơi bọ giấy", "Cắt 30 \"con bọ\" bằng giấy nhiều màu, rải trên một tấm vải hoa. Nhờ người nhà nhặt 15 con trong 10 giây, ghi lại màu con còn sót. Lặp 3 lượt và vẽ biểu đồ."),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Thuật toán di truyền tìm số", "Viết chương trình Python tìm dãy 10 chữ số trùng với một dãy bí mật bằng cách chọn lọc, lai, đột biến. Đếm số thế hệ cần với các mức đột biến khác nhau."),
       (3, "Ý TƯỞNG KHKT", "Xếp lịch trực nhật công bằng", "Dùng thuật toán di truyền xếp lịch trực nhật cả học kì sao cho mỗi bạn trực số buổi gần bằng nhau và không trùng lịch học thêm.")],
  res=[("layers", "", "Phiếu học tập", "Trò chơi bọ giấy, bảng thế hệ, tính tần số.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 39", "Xe tự lái học lái bằng thuật toán tiến hóa.", "../39-xe-tu-lai/index.html")],
  prev=("15-chatbot", "15"), nextp=("17-may-dich", "17"),
)
