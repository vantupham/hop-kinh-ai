/* Hộp Kính AI · cấu hình kênh nộp Phiếu tự học
   Mặc định học sinh nộp bằng mã phiếu, tệp phiếu hoặc PDF qua bất kỳ kênh nào (Zalo, Google Classroom, email, LMS...).
   Muốn có thêm nút "Nộp qua Google Biểu mẫu": làm theo hướng dẫn trong giao-vien/so-theo-doi.html rồi điền 5 dòng dưới đây. */
window.HKA_CFG = {
  formUrl: "",   // ví dụ: "https://docs.google.com/forms/d/e/1FAIpQLS.../viewform"
  entry: {
    ten: "",     // ví dụ: "entry.111111111"  (câu hỏi: Họ và tên)
    lop: "",     // ví dụ: "entry.222222222"  (câu hỏi: Lớp)
    duAn: "",    // ví dụ: "entry.333333333"  (câu hỏi: Dự án)
    ma: ""       // ví dụ: "entry.444444444"  (câu hỏi: Mã phiếu, dạng đoạn văn dài)
  }
};
