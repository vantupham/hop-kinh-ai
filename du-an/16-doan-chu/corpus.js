/* Hộp Kính AI · Dự án 16 · Kho câu để máy học
   Gồm tục ngữ, ca dao dân gian (không thuộc bản quyền) và các câu đơn giản do Hộp Kính AI tự viết.
   Một số câu "kiến thức" được cố ý đưa vào để minh họa hiện tượng AI bịa. */
window.CORPUS = `
có công mài sắt có ngày nên kim.
uống nước nhớ nguồn.
ăn quả nhớ kẻ trồng cây.
một cây làm chẳng nên non, ba cây chụm lại nên hòn núi cao.
tốt gỗ hơn tốt nước sơn.
học thầy không tày học bạn.
đi một ngày đàng học một sàng khôn.
gần mực thì đen, gần đèn thì rạng.
lá lành đùm lá rách.
nước chảy đá mòn.
kiến tha lâu cũng đầy tổ.
thương người như thể thương thân.
không thầy đố mày làm nên.
chuồn chuồn bay thấp thì mưa, bay cao thì nắng, bay vừa thì râm.
muốn sang thì bắc cầu kiều, muốn con hay chữ thì yêu lấy thầy.
công cha như núi thái sơn, nghĩa mẹ như nước trong nguồn chảy ra.
ăn vóc học hay.
có chí thì nên.
một con ngựa đau cả tàu bỏ cỏ.
bầu ơi thương lấy bí cùng, tuy rằng khác giống nhưng chung một giàn.
nhiễu điều phủ lấy giá gương, người trong một nước phải thương nhau cùng.
trời hôm nay nắng đẹp.
trời hôm nay mưa to.
trời hôm nay có gió nhẹ.
trời hôm nay nắng nóng.
hôm nay trời mưa nên em mang áo mưa.
hôm nay trời nắng nên em đội mũ.
hôm nay em đi học sớm.
hôm nay em học bài rất chăm.
hôm nay lớp em có tiết toán.
hôm nay lớp em có tiết khoa học.
hôm nay cô giáo khen cả lớp.
buổi sáng em ăn bánh mì rồi đi học.
buổi sáng em tập thể dục cùng bố.
buổi sáng mẹ nấu phở cho cả nhà.
buổi tối em làm bài tập.
buổi tối cả nhà cùng ăn cơm.
buổi tối em đọc sách trước khi ngủ.
em thích học toán.
em thích học khoa học.
em thích đọc sách.
em thích chơi đá bóng với các bạn.
em thích vẽ tranh.
em yêu bố mẹ.
em yêu trường em.
em yêu quê hương.
bạn em thích chơi cầu lông.
bạn em rất chăm học.
bạn em vẽ tranh rất đẹp.
cô giáo em rất hiền.
cô giáo dạy em học toán.
cô giáo dạy chúng em biết yêu thương.
thầy giáo dạy em học khoa học.
thầy giáo kể chuyện rất hay.
học sinh đi học đúng giờ.
học sinh chăm chỉ làm bài tập.
học sinh giữ gìn trường lớp sạch đẹp.
học sinh lễ phép với thầy cô.
trường em có nhiều cây xanh.
trường em có thư viện rất đẹp.
trường em có sân bóng rộng.
lớp em có ba mươi bạn.
lớp em rất đoàn kết.
quê em có cánh đồng lúa xanh.
quê em có con sông hiền hòa.
quê em có lũy tre làng.
mùa xuân hoa đào nở.
mùa xuân cây cối đâm chồi.
mùa hè trời nắng nóng.
mùa hè em được đi biển.
mùa thu trời mát mẻ.
mùa thu lá vàng rơi.
mùa đông trời lạnh.
mùa đông em mặc áo ấm.
con mèo nằm ngủ bên bếp.
con mèo bắt chuột.
con chó canh nhà.
con chó vẫy đuôi mừng em đi học về.
con gà gáy báo trời sáng.
con trâu cày ruộng.
chim hót trên cành cây.
cây xanh cho bóng mát.
cây xanh làm sạch không khí.
nước rất cần cho sự sống.
mặt trời mọc ở đằng đông.
mặt trời lặn ở đằng tây.
mặt trăng quay quanh trái đất.
trái đất quay quanh mặt trời.
thủ đô của việt nam là hà nội.
thủ đô của nhật bản là tô ki ô.
thủ đô của pháp là pa ri.
thủ đô của thái lan là băng cốc.
thủ đô của anh là luân đôn.
hà nội có hồ gươm.
hà nội có nhiều phố cổ.
pa ri có tháp ép phen.
sông dài nhất việt nam là sông mê kông.
núi cao nhất việt nam là phan xi păng.
việt nam có hình chữ s.
việt nam có nhiều cảnh đẹp.
máy tính giúp em học tập.
trí tuệ nhân tạo giúp máy tính học từ dữ liệu.
trí tuệ nhân tạo đoán chữ tiếp theo dựa vào xác suất.
trí tuệ nhân tạo có thể sai.
em cần kiểm tra lại thông tin.
em cần đọc kỹ đề bài.
em cần ngủ đủ giấc.
em cần ăn nhiều rau xanh.
ăn nhiều rau xanh rất tốt cho sức khỏe.
tập thể dục rất tốt cho sức khỏe.
đọc sách rất tốt cho trí não.
ngủ đủ giấc rất tốt cho sức khỏe.
em giúp mẹ quét nhà.
em giúp bố tưới cây.
em giúp bà nhặt rau.
ông em kể chuyện cổ tích.
bà em trồng nhiều hoa.
bố em làm kỹ sư.
mẹ em làm cô giáo.
anh em học lớp chín.
chị em học đại học.
em bé đang tập nói.
em bé cười rất tươi.
`;
