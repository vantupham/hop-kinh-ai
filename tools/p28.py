D = dict(
  out="du-an/28-nghe-not-nhac/index.html", num="28", grade="7", title="Dự án 28 · Máy nghe nốt nhạc",
  scripts=["pitch.js"], device="Micro: không bắt buộc",
  h1='Máy nghe <span class="hl-word">nốt nhạc</span> như thế nào?',
  lead="Em bấm phím đàn hoặc hát vào micro. Máy không có tai: nó chỉ nhận được một dãy số lên xuống rất nhanh. Bằng cách tìm chỗ sóng âm lặp lại và đếm xem mỗi giây lặp lại bao nhiêu lần, máy biết tần số, rồi tra ra nốt nhạc. Đây chính là bài âm thanh em học ở Khoa học tự nhiên 7.",
  play='''
  <div class="playground">
    <div class="stage-col">
      <div class="toolbar" style="margin:0 0 10px"><div class="seg"><button class="btn small" id="srcSim" aria-pressed="true"><i data-i="sliders"></i>Đàn mô phỏng</button><button class="btn small ghost" id="srcCam" aria-pressed="false"><i data-i="activity"></i>Dùng micro</button></div><span class="small muted" id="srcNote"></span></div>
      <div class="stage vf"><canvas id="stage" width="880" height="440" aria-label="Sóng âm, tần số và nốt nhạc máy nghe được"></canvas><div class="stage-tag"><span class="live-dot"></span><span id="srcTag">MÔ PHỎNG</span></div><div class="stage-msg" id="msg" hidden></div></div>
      <div class="play-panel"><div class="keys" id="keys" aria-label="Bàn phím đàn 8 nốt"></div>
        <div class="btn-row" style="margin-top:12px"><button class="btn small accent" id="btnSong"><i data-i="play"></i>Máy tự chơi "Kìa con bướm vàng"</button><label class="tog"><input type="checkbox" id="optMute"><span>Tắt tiếng loa</span></label></div>
        <p class="ask" id="askText" aria-live="polite" style="margin:12px 0 0;font-size:1.02rem"></p></div>
      {{GUIDE}}
      <div class="card" style="margin-top:6px">
        <h2 class="h-ic" style="font-size:1.1rem"><span class="ico-box sm"><i data-i="sliders"></i></span>Bàn thí nghiệm âm thanh</h2>
        <div class="grid g2" style="gap:6px 22px">
          <label class="ctl"><span>Độ to (biên độ)</span><b id="volV"></b><input type="range" id="vol" min="0" max="1" step="0.02"></label>
          <label class="ctl"><span>Tiếng ồn xung quanh</span><b id="noiseV"></b><input type="range" id="noise" min="0" max="1.5" step="0.05"></label>
          <label class="ctl"><span>Bồi âm (âm sắc của nhạc cụ)</span><b id="harmV"></b><input type="range" id="harm" min="0" max="0.95" step="0.05"></label>
          <label class="ctl"><span>Ngưỡng im lặng của máy</span><b id="gateV"></b><input type="range" id="gate" min="0.01" max="0.3" step="0.01"></label>
        </div>
        <div class="toggles"><label class="tog"><input type="checkbox" id="optCareful" checked><span>Máy kiểm tra kỹ chu kỳ lặp lại</span></label></div>
      </div>
    </div>
    <aside class="lab brain" aria-live="polite">
      <div class="lab-h"><span class="live-dot"></span>Bộ não của máy</div>
      <div class="metric-row"><div class="metric"><span>NỐT MÁY NGHE ĐƯỢC</span><b id="bNote">—</b></div><div class="metric"><span>TẦN SỐ</span><b id="bHz">—</b></div></div>
      <div class="metric-row"><div class="metric"><span>ĐỘ TO</span><b id="bRms">—</b></div><div class="metric"><span>NGHE ĐÚNG</span><b id="bScore">—</b></div></div>
      <div class="lbl" style="margin-top:12px">BẢNG TẦN SỐ CÁC NỐT (Hz)</div><div id="bTable" class="ftable"></div>
      <p class="small" style="color:#c3c7f0;margin-top:12px">Máy đo xem sóng âm <b style="color:#5ef2d6">lặp lại bao nhiêu lần mỗi giây</b> (tần số, đơn vị Hz). Tần số càng lớn, âm càng <b>cao</b>.</p>
    </aside>
  </div>
  <div class="card chart-card" style="margin-top:18px"><div class="chart-head"><b><i data-i="chart"></i> Nốt máy nghe được trong 10 giây gần nhất</b></div><canvas id="chart" width="1100" height="240"></canvas></div>''',
  play_guide="Bấm các phím đàn (hoặc phím <b>A S D F G H J K</b> trên bàn phím máy tính). Nhìn sóng âm: nốt càng cao, sóng càng <b>dày</b>!",
  lessons=["KHTN 7 · Sóng âm, nguồn âm", "KHTN 7 · Độ cao của âm và tần số", "KHTN 7 · Độ to của âm và biên độ"],
  mission_h2="Hiểu cách máy biến âm thanh thành nốt nhạc",
  mission_q="Máy không có tai. Làm sao nó biết em vừa hát nốt Mi?",
  mission_p="Em sẽ thấy <b>sóng âm</b> của từng nốt, đo <b>tần số</b> và <b>biên độ</b>, cho máy nghe cả một bài hát, rồi tìm hiểu vì sao tiếng ồn, hát quá nhỏ hay âm sắc nhạc cụ làm máy nghe nhầm.",
  minutes="45 phút · 1 tiết học",
  checklist=[("play", "Chơi ít nhất 5 nốt trên đàn"), ("song", "Cho máy nghe trọn bài Kìa con bướm vàng"), ("lab", "Thay đổi độ to, tiếng ồn hoặc bồi âm"), ("soi", "Soi tới bước Tính tần số"), ("broke", "Làm máy nghe nhầm ít nhất 1 lần"), ("quiz", "Trả lời đúng hết bài kiểm tra")],
  soi_h2="Máy nghe nốt nhạc như thế nào? 6 bước",
  soi_p="Bấm từng bước trên sơ đồ, hoặc bấm Bước tiếp. Hình minh họa dùng nốt em vừa chơi.",
  soi_guide="Máy nghe bằng <b>con số</b>. Cùng xem một nốt đàn đi qua máy như thế nào nhé!",
  cards=[
    dict(no="T1", tag="Vật lí", title="Âm thanh là dao động",
      svg='<path d="M10 60q15-40 30 0t30 0 30 0 30 0" fill="none" class="s-violet" stroke-width="3"/><path d="M140 60q7-40 15 0t15 0 15 0 15 0 15 0 15 0 15 0 15 0" fill="none" class="s-mint" stroke-width="3"/><text x="16" y="110" font-size="11" class="t-mono f-violet">âm trầm: ít dao động</text><text x="146" y="110" font-size="11" class="t-mono f-mint">âm cao: nhiều</text>',
      p="Dây đàn, dây thanh quản rung làm không khí dao động thành <b>sóng âm</b>. Số dao động mỗi giây là <b>tần số</b> (Hz): tần số lớn thì âm <b>cao</b>. Dao động mạnh hay yếu là <b>biên độ</b>: biên độ lớn thì âm <b>to</b>.",
      ex="Nốt La dùng để lên dây đàn có tần số 440 Hz: không khí dao động 440 lần trong một giây."),
    dict(no="T2", tag="Đặc trưng", cls="amber", title="Tìm chỗ lặp lại để đo tần số",
      svg='<path d="M10 50q12-34 24 0t24 0 24 0 24 0 24 0" fill="none" class="s-violet" stroke-width="3"/><path d="M34 80q12-34 24 0t24 0 24 0 24 0 24 0" fill="none" class="s-mint" stroke-width="3" opacity=".8"/><path d="M10 96h48" class="s-coral" stroke-width="3"/><text x="64" y="100" font-size="11" class="t-mono f-coral">1 chu kỳ</text><text x="150" y="40" font-size="12" class="f-ink" font-weight="700">f = 16000 ÷ 61</text><text x="150" y="60" font-size="12" class="f-ink" font-weight="700">≈ 262 Hz</text>',
      p="Máy nhận <b>16 000 con số mỗi giây</b> từ micro. Nó dịch sóng sang phải từng chút một tới khi sóng <b>trùng khít</b> với chính nó: đoạn dịch đó là một <b>chu kỳ</b>. Tần số = số mẫu mỗi giây ÷ độ dài chu kỳ.",
      ex="Muốn đếm nhịp tim, em đếm số lần mạch đập trong 15 giây rồi nhân 4: cũng là đo \"tần số\"."),
    dict(no="T3", tag="Giới hạn của máy", cls="coral", title="Khi nào máy nghe nhầm",
      svg='<path d="M10 60l8-30 6 50 7-40 6 30 8-45 6 50 8-30 6 20 8-35 7 40 7-30" fill="none" class="s-coral" stroke-width="2.5"/><path d="M140 60q15-6 30 0t30 0 30 0" fill="none" class="s-violet" stroke-width="2.5"/><text x="20" y="110" font-size="10" class="t-mono f-coral">tiếng ồn lấn át</text><text x="146" y="110" font-size="10" class="t-mono f-violet">hát quá nhỏ</text>',
      p="<b>Tiếng ồn</b> lấn át làm sóng không còn lặp lại rõ. Hát <b>quá nhỏ</b> thì máy tưởng là im lặng. Nhạc cụ có <b>bồi âm</b> mạnh làm máy dễ nghe cao lên gấp đôi (sai một quãng tám). Người làm máy phải đặt ngưỡng và cách kiểm tra phù hợp.",
      ex="Nói chuyện điện thoại ở chợ đông, người nghe khó nghe rõ: tiếng ồn cũng làm khó cả máy."),
  ],
  real=[("activity", "", "Máy lên dây đàn", "Ứng dụng chỉnh dây đàn ghi ta nghe tần số từng dây và báo dây đang cao hay thấp so với nốt chuẩn."),
        ("star", "mint", "Chấm điểm hát karaoke", "Máy so tần số giọng em hát với tần số của bài hát gốc theo từng khoảnh khắc để chấm điểm."),
        ("msg", "amber", "Trợ lý giọng nói", "Trước khi hiểu lời nói, máy cũng biến âm thanh thành các con số đặc trưng như tần số và độ to.")],
  breaks_h2="Thử thách: hãy làm máy nghe nhầm!",
  breaks_guide="Máy nghe bằng con số, nên những thứ làm sóng âm \"lộn xộn\" sẽ làm máy nhầm. Thử xem nào!",
  breaks=[
    dict(icon="alert", key="noisy", title="Phòng rất ồn", p="Em chơi đàn trong một căn phòng <b>rất ồn</b>: tiếng ồn mạnh hơn cả tiếng đàn.",
      why="Tiếng ồn cộng vào sóng âm làm sóng không còn lặp lại đều đặn, máy tìm chu kỳ sai nên nhảy lung tung giữa các nốt (xem biểu đồ). Kéo <b>Tiếng ồn</b> xuống, hoặc kéo <b>Độ to</b> lên (giống như đưa micro lại gần đàn)."),
    dict(icon="activity", key="quiet", title="Hát quá nhỏ", p="Bạn nhỏ hát <b>rất khẽ</b>, nhỏ hơn ngưỡng im lặng của máy.",
      why="Biên độ nhỏ hơn <b>ngưỡng im lặng</b> nên máy coi như không có ai hát và bỏ qua. Kéo <b>Độ to</b> lên. Có thể hạ ngưỡng xuống, nhưng hạ quá thấp thì máy sẽ \"nghe\" cả tiếng ồn thành nốt nhạc."),
    dict(icon="repeat", key="octave", title="Nhạc cụ nhiều bồi âm", p="Một nhạc cụ có <b>bồi âm</b> rất mạnh, và máy bị tắt bước kiểm tra kỹ chu kỳ.",
      why="Bồi âm dao động nhanh gấp đôi âm chính. Máy vội chọn chỗ lặp lại <b>đầu tiên</b> nên đo ra chu kỳ chỉ bằng một nửa, tần số gấp đôi: nghe cao lên một quãng tám (Đô thành Đô cao). Bật <b>Máy kiểm tra kỹ chu kỳ lặp lại</b>."),
  ],
  badge="Đôi Tai Số", badge_p="Em đã mở khóa 3 thẻ kiến thức: Âm thanh là dao động · Tìm chỗ lặp lại để đo tần số · Khi nào máy nghe nhầm.",
  dev=[(1, "MỞ RỘNG · Ở NHÀ", "Đàn ống nước", "Đổ nước vào 5 chai thủy tinh với lượng khác nhau, gõ nhẹ và dùng chế độ micro để đo tần số. Mực nước thay đổi thì nốt thay đổi thế nào?"),
       (2, "DỰ ÁN NHÓM · 1 TUẦN", "Ai hát đúng nhạc nhất?", "Mỗi bạn hát 5 nốt Đô Rê Mi Fa Sol vào micro. Ghi tần số máy đo được, so với bảng tần số, tính sai lệch."),
       (3, "Ý TƯỞNG KHKT", "Máy nghe tiếng máy bơm", "Đo tần số tiếng máy bơm nước hay quạt điện mỗi ngày. Tần số thay đổi bất thường có thể là dấu hiệu máy sắp hỏng.")],
  res=[("layers", "", "Phiếu học tập", "Đọc sóng âm, tính tần số, tra nốt nhạc.", "phieu.html"),
       ("book", "mint", "Hướng dẫn giáo viên", "Tiến trình 45 phút, câu hỏi thảo luận, đáp án.", "giao-vien.html"),
       ("rocket", "amber", "Học lên: Dự án 8", "Máy nhận ra âm thanh nhờ phổ tần số.", "../08-am-thanh/index.html")],
  prev=("27-tham-tu-du-lieu", "27"), nextp=("29-robot-giao-thu", "29"),
)
