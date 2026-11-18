/* Hộp Kính AI · gợi ý đáp án Phiếu tự học, chỉ dùng trong Sổ theo dõi (sinh từ tools/tu_hoc_noi_dung.py) */
window.HKA_GOIY = {
 "1": {
  "q3": [
   "Tùy cây của học sinh. Cây tốt thường chỉ cần khoảng 4–5 câu cho con xa nhất.",
   "13 câu (14 con vật, mỗi câu chỉ loại được 1 con).",
   "Ví dụ chim cánh cụt với câu \"Sống chủ yếu dưới nước không?\". Câu hỏi phải tách được con mới khỏi con bị đoán nhầm."
  ],
  "q4": [
   "Câu hỏi tốt: trả lời chắc chắn có hoặc không, ai trả lời cũng giống nhau, chia nhóm thành hai phần gần bằng nhau (ví dụ \"Có lông vũ không?\"). Câu chưa tốt: mơ hồ (\"Có to không?\") hoặc chỉ loại một con (\"Có phải con mèo không?\").",
   "Máy chỉ biết những gì có trong cây, gặp con lạ thì đi theo nhánh gần nhất và đoán nhầm. Giống em: học thêm từ ví dụ mới và từ lỗi sai, thêm đặc điểm phân biệt."
  ]
 },
 "2": {
  "q3": [
   "Khoảng R = 255, G = 255, B = 0 (đỏ cộng xanh lá, không có xanh dương).",
   "Độ phân giải thấp thường đúng ít hơn; ghi theo số trên trang.",
   "Tùy hình vẽ của học sinh."
  ],
  "q4": [
   "Ảnh gồm nhiều ô (điểm ảnh), mỗi ô là con số (độ sáng hoặc ba số R, G, B). Máy chỉ so các con số, không hiểu hình.",
   "Máy so từng ô ở cùng vị trí với hình mẫu; hình lệch thì các ô không trùng nên độ giống thấp. Căn giữa đưa hình về cùng vị trí trước khi so."
  ]
 },
 "3": {
  "q3": [
   "Viên thường khoảng 1/6 ≈ 17%; viên gian lận cao hơn rõ (tùy tỉ lệ cài đặt).",
   "Tùy học sinh.",
   "Tùy số lần tung tối thiểu và độ khắt khe đã đặt."
  ],
  "q4": [
   "Ít lần tung thì tỉ lệ dao động nhiều do may rủi; tung nhiều thì tần số thực nghiệm tiến gần xác suất thật nên kết luận đáng tin hơn.",
   "Máy đếm tần số từng mặt rồi so với tỉ lệ mong đợi 1/6. Dữ liệu ghi sai làm tần số sai nên kết luận sai (rác vào, rác ra)."
  ]
 },
 "4": {
  "q3": [
   "Tùy chương trình; chương trình đúng thì robot tới cờ.",
   "Lần đầu nhiều bước (đi lang thang), các lần sau giảm dần tới bằng đường ngắn nhất.",
   "Theo số trên trang."
  ],
  "q4": [
   "Robot làm theo lệnh thực hiện đúng từng bước người viết: nhanh, chính xác nhưng hỏng khi tình huống đổi. Robot tự học thử, ghi nhớ, cải thiện dần: cần nhiều lần thử nhưng thích nghi được.",
   "Chương trình viết cho mê cung cũ sẽ đi sai. Thuật toán bám tường hoặc robot tự học (học lại) vẫn tới được vì không phụ thuộc một đường cố định."
  ]
 },
 "5": {
  "q3": [
   "Ngưỡng tốt cân bằng hai loại lỗi; ghi theo số trên trang.",
   "Tùy tin nhắn.",
   "Ngưỡng thấp làm số tin thật bị chặn nhầm tăng rõ."
  ],
  "q4": [
   "Mỗi từ khóa nghi ngờ có điểm (học từ các tin đã dán nhãn); cộng điểm các từ có trong tin, vượt ngưỡng thì chặn.",
   "Máy chỉ so đúng chữ; viết khác đi thì không khớp từ khóa (chuẩn hóa chữ giúp một phần). Tự bảo vệ: không bấm liên kết lạ, không gửi mã OTP, hỏi người lớn, kiểm tra qua kênh chính thức."
  ]
 },
 "6": {
  "q3": [
   "Ghi theo trang; k = 1 dễ sai khi có mẫu dán nhãn sai.",
   "Thường k lớn hơn 1 một chút cho kết quả ổn định hơn.",
   "Thấp hơn rõ so với đo bằng đặc trưng tốt."
  ],
  "q4": [
   "Mỗi hình đổi thành vài con số (đặc trưng) và là một điểm trên mặt phẳng; máy tìm k mẫu gần nhất và lấy nhãn chiếm đa số.",
   "Đặc trưng kém làm các loại hình chồng lên nhau nên hàng xóm gần nhất thường khác loại; đặc trưng tốt (độ tròn, số góc) tách rõ các loại."
  ]
 },
 "7": {
  "q3": [
   "Mẫu ngẫu nhiên 100 bạn thường lệch ít so với toàn trường.",
   "Cao hơn hẳn tỉ lệ toàn trường.",
   "Lệch nhiều và thay đổi mỗi lần hỏi."
  ],
  "q4": [
   "Tổng thể là toàn bộ học sinh trường; mẫu là nhóm được hỏi. Chọn ngẫu nhiên để mẫu đại diện cho tổng thể, không nghiêng về nhóm nào.",
   "AI học theo dữ liệu lệch và kết luận sai cho cả tổng thể; ví dụ chỉ học từ đội bóng sẽ nghĩ hầu hết học sinh thích bóng đá."
  ]
 },
 "8": {
  "q3": [
   "Đô (C4) khoảng 262 Hz, La (A4) khoảng 440 Hz.",
   "Cao hơn mức tiếng ồn nền nhưng thấp hơn độ to khi chơi nhạc.",
   "Ghi theo trang."
  ],
  "q4": [
   "Máy đo tần số (số lần dao động mỗi giây) bằng cách tìm chu kì lặp lại của sóng âm, rồi so với bảng tần số các nốt.",
   "Bồi âm có tần số gấp 2, 3… lần âm gốc; bồi âm mạnh khiến máy bắt nhầm chu kì nên đọc ra tần số gấp đôi (cao hơn một quãng tám)."
  ]
 },
 "9": {
  "q3": [
   "Tuần tự 100 cửa, nhị phân khoảng 7 cửa.",
   "Tuần tự 1000 cửa, nhị phân khoảng 10 cửa.",
   "Không chắc tìm được: có thể bỏ qua đúng phòng cần tìm."
  ],
  "q4": [
   "Mở cửa ở giữa, so số phòng, bỏ một nửa không thể chứa phòng cần tìm; mỗi lần loại được nửa còn lại nên số lần chỉ tăng rất chậm (khoảng log₂ n).",
   "Chỉ khi đã sắp xếp mới biết phòng cần tìm nằm ở nửa nào. Ứng dụng: tra từ điển, danh bạ, chỉ mục của máy tìm kiếm và cơ sở dữ liệu."
  ]
 },
 "10": {
  "q3": [
   "Tốc độ = 60 m ÷ thời gian; ví dụ 10 giây ứng với 6 m/s.",
   "Chênh nhỏ khi máy theo dõi tốt.",
   "Tùy kiểu chạy (kiểu tăng tốc về đích dốc nhất ở cuối)."
  ],
  "q4": [
   "Máy tìm các điểm ảnh có màu giống màu đã chọn (áo, mũ), lấy vị trí trung bình mỗi khung hình, rồi đổi điểm ảnh ra mét.",
   "Độ dốc là tốc độ: càng dốc chạy càng nhanh. Khi bị che, máy mất dấu hoặc bám nhầm vật khác nên quãng đường nhảy sai."
  ]
 },
 "11": {
  "q3": [
   "Sai số dưới 1,5 cm là đạt nhiệm vụ.",
   "a khoảng 1,4 cm/ngày, b khoảng 2 cm (ghi theo trang).",
   "Máy dự đoán khoảng 44,2 cm, thật khoảng 29,4 cm: dự đoán quá xa vùng dữ liệu thì sai lớn."
  ],
  "q4": [
   "a là số xăng-ti-mét cây cao thêm mỗi ngày, b là chiều cao lúc đầu. Máy chỉnh a, b từng chút theo hướng làm sai số trung bình giảm, lặp lại nhiều lần.",
   "Đường uốn lượn học cả những sai lệch ngẫu nhiên của số đo, không phải quy luật chung (quá khớp), nên với số đo mới sai số lớn hơn (khoảng 2,4 cm so với 0,98 cm)."
  ]
 },
 "12": {
  "q3": [
   "Tùy vị trí đặt quả.",
   "Khoảng 32/40 khi chưa đưa về cùng thang, khoảng 39/40 khi đã đưa về.",
   "Không có ngưỡng: xếp nhầm vào loại gần nhất; có ngưỡng: trả lời không biết."
  ],
  "q4": [
   "Mỗi quả là một điểm (đường kính, khối lượng); khoảng cách = √(Δx² + Δy²); quả mới thuộc loại của quả gần nhất (hoặc tâm nhóm gần nhất).",
   "Khối lượng có số lớn hơn nhiều nên chi phối khoảng cách, đường kính gần như bị bỏ qua; đưa về cùng thang để hai đặc điểm có vai trò ngang nhau."
  ]
 },
 "13": {
  "q3": [
   "Ví dụ quy tắc AND: trọng số bằng nhau, ngưỡng lớn hơn từng trọng số nhưng nhỏ hơn tổng; kiểm tra lại cả 8 dòng.",
   "Tùy quy tắc, thường vài vòng.",
   "Không thể về 0 với một nơ-ron; cần mạng 2 lớp."
  ],
  "q4": [
   "Nhân mỗi đầu vào với trọng số, cộng lại, so với ngưỡng: lớn hơn ngưỡng thì Có. Trọng số lớn nghĩa là yếu tố đó quan trọng.",
   "Một nơ-ron chỉ chia các trường hợp bằng một đường thẳng, XOR cần hai đường. Mạng 2 lớp ghép nhiều nơ-ron nên chia được."
  ]
 },
 "14": {
  "q3": [
   "Nước chanh khoảng pH 2, nước xà phòng khoảng pH 10 (ghi theo trang).",
   "Khoảng pH 8 (sai).",
   "Thường 10–11/11."
  ],
  "q4": [
   "Máy đo ba số R, G, B của màu giấy, so với 14 màu mẫu và chọn màu gần nhất (khoảng cách màu nhỏ nhất).",
   "Đèn vàng thêm đỏ, bớt xanh dương nên ba số thay đổi dù giấy không đổi. Cân bằng trắng dùng ô giấy trắng để biết đèn làm lệch bao nhiêu rồi chỉnh ngược lại."
  ]
 },
 "15": {
  "q3": [
   "Lúc đầu 9/12; bật bỏ dấu và thêm luật về máy tính thì được 11/12.",
   "Ví dụ: máy tính, mượn máy tính → câu trả lời về máy tính của thư viện.",
   "Đầu tiên khớp: Hạn trả sách (sai); khớp nhiều nhất: Mất, hỏng sách (đúng)."
  ],
  "q4": [
   "Chuẩn hóa câu, dò từ khóa của từng luật, chọn luật khớp nhiều nhất (đạt mức tối thiểu), trả lời câu viết sẵn. Nó không hiểu nghĩa, chỉ so chữ.",
   "Chatbot luật dễ hiểu, dễ sửa nhưng chỉ biết điều đã viết sẵn; chatbot AI linh hoạt nhưng có thể sai mà vẫn tự tin. Cần kiểm tra lại thông tin quan trọng."
  ]
 },
 "16": {
  "q3": [
   "Đột biến 12 thường cao nhất (từ khoảng 85%); 0 dễ mắc kẹt; 80 thấp (khoảng 55–65%).",
   "Thường thấp hơn mức chung, vì em bắt con dễ thấy trước.",
   "Khoảng 88% xuống khoảng 21%."
  ],
  "q4": [
   "Chọn lọc tự nhiên: con khó thấy sống sót và truyền gen cho con cháu; qua nhiều thế hệ gen ngụy trang trở nên phổ biến.",
   "Đánh giá, chọn lọc, lai, đột biến, rồi lặp lại. Đột biến tạo biến dị mới: không có thì mắc kẹt, quá nhiều thì mất cái tốt."
  ]
 },
 "17": {
  "q3": [
   "Với ngữ cảnh 4 từ: tắt ngữ cảnh 7/12; tắt thành ngữ 9/12; tắt trật tự từ 7/12.",
   "4 từ.",
   "Tùy câu của học sinh."
  ],
  "q4": [
   "Đếm từ gợi ý của mỗi nghĩa nằm trong vùng nhìn quanh từ đó; nghĩa nhiều gợi ý nhất được chọn, không có gợi ý thì lấy nghĩa đầu.",
   "Thành ngữ có nghĩa cả cụm; tiếng Anh và tiếng Việt xếp tính từ, sở hữu khác nhau. Dùng máy dịch để tham khảo, tự kiểm tra thành ngữ, từ nhiều nghĩa và ngữ pháp."
  ]
 },
 "18": {
  "q3": [
   "Phường Đông 16/50 = 32%, Xã Tây 4/30 ≈ 13%.",
   "16/80 ở mỗi sự cố (20 suất); 0/80 sau khi sửa.",
   "Tùy hồ sơ."
  ],
  "q4": [
   "Máy bắt chước quyết định cũ; hội đồng cũ khắt khe với Xã Tây nên máy học trọng số âm cho Xã Tây.",
   "Là thông tin gắn chặt với một đặc điểm khác (khoảng cách đến trường tố nơi ở). Kiểm tra: so tần số tương đối theo nhóm với tỉ lệ xứng đáng; phép thử đổi một đặc điểm không liên quan; không chỉ nhìn độ chính xác."
  ]
 },
 "19": {
  "q3": [
   "1 thật, 2 ghép, 3 AI tạo, 4 ghép (sao chép một vùng), 5 thật, 6 AI tạo.",
   "Gốc khoảng 5; nén nhiều còn gần 0 (máy dò tưởng là ảnh AI).",
   "Ví dụ: bóng khủng long ngược hướng bóng cây; chữ trên biển bị lặp."
  ],
  "q4": [
   "Vùng dán từ ảnh khác có mức nhiễu khác phần còn lại; ngoài trời chỉ có một Mặt Trời nên mọi bóng cùng hướng, bóng lệch là dấu hiệu ghép.",
   "Máy dò sai cả hai chiều: ảnh thật nén nhiều bị nói là AI, ảnh giả tinh vi bị nói là thật. Năm câu: ai đăng, khi nào, có ảnh gốc không, báo chí và cơ quan chính thống có đưa tin không, nội dung có vô lí không."
  ]
 },
 "20": {
  "q3": [
   "Khoảng 100%, 100%, 100%, 98%.",
   "Khoảng 0,4. Ngưỡng 0: trả lời bừa (trung thực 0%); 0,9: chuyển cả câu trả lời được (hữu ích giảm).",
   "0,8 (4 từ khớp ÷ 5 từ quan trọng)."
  ],
  "q4": [
   "Hiểu câu hỏi (chatbot luật, Dự án 15), tra sổ tay (hỏi đáp tìm đoạn văn, Dự án 40), lọc riêng tư, kiểm tra độ tự tin (ngưỡng, Dự án 5), chia nhóm công bằng (Dự án 18).",
   "Trả lời bừa làm người dùng tin điều sai; chuyển cho người thật an toàn hơn. Đọc được dữ liệu không có nghĩa là được chia sẻ; lộ thông tin cá nhân gây hại cho bạn bè."
  ]
 },
 "21": {
  "q3": [
   "Hai ngưỡng cách nhau đủ xa, ví dụ khoảng 100° (xuống) và 160° (lên).",
   "Khoảng 0,5.",
   "Số đếm bằng số lần thật, ví dụ 5/5."
  ],
  "q4": [
   "Góc rung quanh một ngưỡng sẽ vượt qua lại nhiều lần nên bị đếm thừa. Hai ngưỡng tạo vùng đệm: phải xuống dưới ngưỡng thấp rồi lên trên ngưỡng cao mới tính 1 lần.",
   "Độ tin cậy là mức máy chắc chắn điểm đó đúng (từ 0 đến 1). Khi bị che, rung, thiếu sáng thì độ tin cậy thấp và vị trí có thể sai; nên bỏ qua khung hình có độ tin cậy thấp."
  ]
 },
 "22": {
  "q3": [
   "Ít nhất 5 mẫu mỗi cử chỉ; kết quả tùy học sinh.",
   "K lẻ, vừa phải (3 hoặc 5) để tránh hòa và giảm ảnh hưởng của mẫu sai.",
   "Thường nghiêng về Búa vì Búa có nhiều mẫu hơn."
  ],
  "q4": [
   "21 điểm mốc bàn tay được đổi thành 5 đặc trưng (mức duỗi của các ngón, đã chuẩn hóa theo kích thước tay); máy tìm K mẫu gần nhất và lấy nhãn chiếm đa số.",
   "Lớp nhiều mẫu chiếm đa số trong hàng xóm; mẫu sai nhãn kéo kết quả sai. Khắc phục: cân bằng số mẫu, kiểm tra nhãn, chọn K hợp lí, dùng ngưỡng \"không biết\" cho cử chỉ lạ."
  ]
 },
 "23": {
  "q3": [
   "α lớn: mượt hơn nhưng trễ hơn; cần cân bằng.",
   "Thường là bộ lọc thích ứng (tay đứng yên lọc mạnh, tay di chuyển nhanh lọc nhẹ); chấp nhận lí do hợp lí khác.",
   "Trễ lớn, nét vẽ theo sau tay rõ rệt."
  ],
  "q4": [
   "Camera rung, ánh sáng, AI ước lượng điểm hơi lệch ở mỗi khung hình. Bộ lọc lấy trung bình có trọng số với các vị trí trước nên triệt các dao động nhỏ.",
   "Nhớ nhiều vị trí cũ thì vị trí mới ảnh hưởng ít, nét phải đợi lâu mới bắt kịp tay. Chọn mức vừa phải hoặc lọc thích ứng theo tốc độ tay."
  ]
 },
 "24": {
  "q3": [
   "Tùy học sinh, cần có ngưỡng cụ thể.",
   "Giảm rõ so với bình thường.",
   "Thường là cười gượng (miệng cười nhưng mắt không cười) hoặc khi đeo khẩu trang."
  ],
  "q4": [
   "Máy đo vị trí, khoảng cách các điểm mốc (khóe miệng, mắt, lông mày) rồi so ngưỡng. Nó chỉ thấy hình dạng cơ mặt; cười gượng hay che mặt sẽ bị nhầm.",
   "Khuôn mặt dùng để nhận ra danh tính và không đổi được như mật khẩu. Cần xin phép, xử lí trên máy khi có thể, không lưu hay gửi đi khi không cần, xóa khi không dùng nữa."
  ]
 },
 "25": {
  "q3": [
   "Tùy học sinh.",
   "So tọa độ: điểm giảm mạnh; so vector chuẩn hóa: gần như không đổi.",
   "Đủ rộng để bao được độ lệch nửa nhịp."
  ],
  "q4": [
   "Tọa độ thay đổi khi người đứng xa, lệch chỗ, khác chiều cao; hướng vector đã chuẩn hóa chỉ phụ thuộc dáng người, nên so dáng công bằng hơn.",
   "Ví dụ nhảy kiểu soi gương: bật lật gương; chậm nhịp: dùng cửa sổ thời gian để tìm độ lệch nhịp tốt nhất; đứng xa: dùng vector chuẩn hóa."
  ]
 },
 "26": {
  "q3": [
   "Hai số gần nhau là mô hình tốt.",
   "Khi học rất cao, khi kiểm tra thấp hẳn.",
   "Đủ cao để vật lạ không bị xếp bừa vào một ngăn."
  ],
  "q4": [
   "Kiểm tra trên ảnh máy chưa từng thấy mới biết máy học được quy luật chung hay chỉ nhớ ảnh cũ.",
   "Mô hình nhớ chi tiết riêng của ảnh học (quá ít ảnh, học theo phông nền) nên làm tốt bài cũ, kém ảnh mới. Tránh: thêm ảnh đa dạng, đổi phông nền, kiểm tra trên tập riêng, không học quá nhiều vòng."
  ]
 },
 "27": {
  "q3": [
   "MSE dưới 1,0 là đạt nhiệm vụ.",
   "Tùy tốc độ học; vừa phải thì MSE giảm đều.",
   "Tăng vọt hoặc nhảy qua lại, không hội tụ."
  ],
  "q4": [
   "Tính độ dốc của hàm sai số tại vị trí hiện tại rồi bước ngược hướng dốc; như viên bi lăn dần xuống đáy thung lũng, nơi MSE nhỏ nhất.",
   "MSE bình phương sai số nên điểm ở rất xa bị phạt rất nặng; đường thẳng bị kéo về phía các điểm đó."
  ]
 },
 "28": {
  "q3": [
   "Tùy học sinh.",
   "Ghi theo trang.",
   "Đủ cao để âm lạ không bị xếp vào loại đã biết."
  ],
  "q4": [
   "Fourier tách một đoạn âm thành các tần số và độ mạnh của chúng; xếp theo thời gian được ảnh phổ, rồi máy phân loại như phân loại ảnh.",
   "Chuẩn hóa để âm to, nhỏ (gần, xa micro) có cùng hình dạng phổ; trừ ồn nền để bỏ phần không thuộc âm cần nhận."
  ]
 },
 "29": {
  "q3": [
   "Gần bằng thực tế là tốt.",
   "IoU = diện tích phần chung ÷ diện tích phần hợp của hai khung.",
   "Đếm thừa nhiều vì mỗi xe có nhiều khung trùng nhau."
  ],
  "q4": [
   "IoU đo mức chồng lên nhau của hai khung (từ 0 đến 1). NMS giữ khung tin cậy cao nhất và xóa các khung chồng lên nó với IoU vượt ngưỡng.",
   "Quá thấp: nhận cả bóng, vật khác là xe (đếm thừa). Quá cao: bỏ sót xe bị che, ở xa (đếm thiếu)."
  ]
 },
 "30": {
  "q3": [
   "Độ sâu vừa phải thường tốt nhất; quá sâu thì học cả nhãn lỗi.",
   "Tùy tư thế.",
   "Các bạn thấp."
  ],
  "q4": [
   "Thử các câu hỏi dạng \"đặc trưng < ngưỡng\", chọn câu chia dữ liệu thành các nhóm thuần nhất nhất (Gini nhỏ nhất), rồi lặp lại ở mỗi nhánh.",
   "Cây sâu tạo nhánh riêng cho từng mẫu, kể cả mẫu dán nhãn lỗi (quá khớp). Dữ liệu chỉ từ một nhóm thì ngưỡng học được không đúng với nhóm khác."
  ]
 },
 "31": {
  "q3": [
   "Nhiều nơ-ron hơn thường chính xác hơn nhưng nhiều trọng số hơn.",
   "Giảm rõ.",
   "Tùy học sinh."
  ],
  "q4": [
   "Nơ-ron nhân các điểm ảnh với trọng số, cộng lại, qua hàm kích hoạt; mỗi nơ-ron nhạy với một kiểu nét, lớp sau ghép các nét thành chữ số. Trọng số được học bằng lan truyền ngược.",
   "Mạng học từ chữ to, ở giữa; trọng số gắn với vị trí điểm ảnh nên chữ ở chỗ khác kích hoạt sai nơ-ron. Cần căn giữa, phóng to, hoặc dùng mạng tích chập."
  ]
 },
 "32": {
  "q3": [
   "IoU càng gần 1 càng tốt.",
   "Tăng mạnh.",
   "Cao hơn rõ."
  ],
  "q4": [
   "Phân vùng là gán nhãn người hoặc nền cho từng điểm ảnh; mỗi điểm có xác suất là người, vượt ngưỡng thì giữ.",
   "Điểm ảnh của người và nền giống nhau (màu, độ sáng) nên xác suất không rõ ràng; dữ liệu học thiếu những trường hợp này."
  ]
 },
 "33": {
  "q3": [
   "K lớn hơn thì sai lệch nhỏ hơn.",
   "Thường vài đến vài chục vòng.",
   "Số bit = log₂ K (ví dụ K = 8 ứng với 3 bit)."
  ],
  "q4": [
   "Chọn K tâm; gán mỗi điểm cho tâm gần nhất; dời mỗi tâm về trung bình nhóm của nó; lặp tới khi không còn thay đổi.",
   "Không cần nhãn, máy tự tìm nhóm. Kết quả tệ khi K quá nhỏ, xuất phát tồi, hoặc dữ liệu không có nhóm thật."
  ]
 },
 "34": {
  "q3": [
   "Ghi theo trang.",
   "Chẩn đoán đổi sang có bệnh khi đủ đốm.",
   "AI nhìn vào phông nền thay vì lá."
  ],
  "q4": [
   "Bộ lọc dò một mẫu nhỏ (cạnh, đốm) ở mọi vị trí; cùng một bộ trọng số được dùng lại khắp ảnh nên ít trọng số và nhận ra đốm ở bất kì đâu.",
   "Máy học theo dấu hiệu không liên quan (phông nền) vì nó trùng với nhãn trong dữ liệu; bản đồ cho thấy máy dựa vào nền chứ không phải đốm bệnh."
  ]
 },
 "35": {
  "q3": [
   "Ghi theo trang.",
   "Cử chỉ đúng có khoảng cách nhỏ hơn rõ.",
   "Quá ngắn thì cắt vội, quá dài thì phản hồi chậm."
  ],
  "q4": [
   "Cùng một cử chỉ có thể nhanh chậm khác nhau; DTW co giãn trục thời gian để ghép các khung tương ứng rồi mới đo khoảng cách.",
   "Cắt đoạn là xác định lúc bắt đầu và kết thúc một cử chỉ trong chuỗi chuyển động liên tục; cắt vội làm thiếu phần cử chỉ nên không giống mẫu."
  ]
 },
 "36": {
  "q3": [
   "Tùy học sinh.",
   "Thấp: lặp lại, cứng nhắc; cao: lộn xộn, vô nghĩa.",
   "Ngữ cảnh dài trên dữ liệu nhỏ dễ chép nguyên văn."
  ],
  "q4": [
   "Máy đếm xem sau ngữ cảnh hiện tại chữ nào hay xuất hiện, đổi thành xác suất rồi bốc chữ tiếp theo theo xác suất; nhiệt độ cao làm các lựa chọn đều nhau hơn.",
   "Máy chọn chữ theo xác suất, không kiểm tra sự thật; một chuỗi chữ hợp lí về ngôn ngữ chưa chắc đúng về nội dung."
  ]
 },
 "37": {
  "q3": [
   "Tùy học sinh.",
   "Kết quả là từ có vector gần nhất với vector tính được.",
   "Dễ chấm sai (vẫn tích cực) nếu máy chỉ cộng nghĩa từng từ."
  ],
  "q4": [
   "Từ xuất hiện cạnh những từ giống nhau thì có nghĩa gần nhau; máy đếm hàng xóm rồi nén thành vector ít chiều, từ gần nghĩa có vector gần nhau.",
   "Vector học từ cách dùng từ trong văn bản; văn bản thiên lệch (ví dụ gắn nghề nghiệp với giới tính) thì vector lặp lại thiên lệch đó."
  ]
 },
 "38": {
  "q3": [
   "Tùy học sinh; tới đích nhiều lần là tốt.",
   "Lặp lại đường cũ, có thể không bao giờ tìm ra đích.",
   "Thưởng xu quá lớn khiến robot đi vòng nhặt xu thay vì tới đích."
  ],
  "q4": [
   "Bảng Q lưu điểm giá trị của mỗi hành động ở mỗi ô; sau mỗi bước, điểm được chỉnh về phía (thưởng nhận được + γ × giá trị tốt nhất ở ô mới) với tốc độ α.",
   "Khám phá là thử hướng mới (tỉ lệ ε), khai thác là đi theo điều đã biết là tốt. Robot tối đa hóa đúng phần thưởng được đặt, không phải ý định của người đặt."
  ]
 },
 "39": {
  "q3": [
   "Tùy cài đặt.",
   "Dừng tăng sớm (mắc kẹt).",
   "Tùy độ khó của đường đua."
  ],
  "q4": [
   "Các tia cảm biến đo khoảng cách tới mép đường làm đầu vào cho mạng nơ-ron điều khiển lái; trọng số là gen, xe đi xa nhất được chọn để lai và đột biến.",
   "Thuật toán tối ưu đúng thứ được chấm; chấm sai thì xe giỏi việc khác (ví dụ đứng yên cho an toàn) thay vì chạy hết vòng."
  ]
 },
 "40": {
  "q3": [
   "Tùy học sinh.",
   "Ngưỡng vừa đủ để câu ngoài sách được trả lời \"không biết\".",
   "Có thể bịa hoặc trả lời sai vì không dựa vào tài liệu."
  ],
  "q4": [
   "Tìm các đoạn tài liệu liên quan nhất (TF-IDF) rồi trả lời chỉ dựa trên các đoạn đó, kèm nguồn để người đọc tự kiểm tra.",
   "Trợ lý chỉ tốt bằng nguồn nó dùng (rác vào, rác ra); khi không có đoạn đủ liên quan, ngưỡng giúp trợ lý nói \"không biết\" thay vì bịa."
  ]
 }
};
