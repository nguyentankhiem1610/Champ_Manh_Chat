# Kiến trúc RAG khuyến nghị xâm nhập mặn cho lúa

## Mục tiêu

Chuyển dữ liệu độ mặn thành hành động có thể thực hiện cho đúng ruộng, đúng giống và đúng giai đoạn; ưu tiên độ chính xác, khả năng giải thích và phản ứng kịp thời hơn văn phong tự do của mô hình ngôn ngữ.

## Luồng xử lý đang được cài đặt

1. Hoàn thiện ngữ cảnh: số đo tại ruộng được ưu tiên; nếu thiếu thì dùng dữ liệu dự báo/trạm theo tỉnh và gắn cảnh báo sai khác không gian.
2. Chuẩn hóa giai đoạn: dùng giai đoạn người dùng xác nhận; nếu thiếu thì ước tính từ ngày gieo sạ theo 7 nhóm của tài liệu EUREKA.
3. Truy xuất có ràng buộc: lọc theo `giống × giai đoạn × mức mặn`, sau đó lấy thêm tri thức chung về sinh lý lúa và quản lý nước.
4. Sinh có căn cứ: bộ sinh chỉ kết hợp tác động, hành động và điều cần tránh từ các đoạn tri thức đã truy xuất; không tự tạo ngưỡng hoặc liều lượng vật tư.
5. Kiểm soát an toàn: không suy rộng giữa giống/giai đoạn, không coi chế phẩm thay cho kiểm soát nước, và yêu cầu đo xác nhận ở tình huống khẩn cấp.
6. Giải thích đầu ra: trả về mức rủi ro, hành động ngay, việc theo dõi, điều không nên làm, nguồn tài liệu và mức tin cậy.
7. Hiển thị kịp thời: kết quả được đưa vào chuông cảnh báo trên màn hình chính; khuyến nghị tự đổi khi độ mặn, giống hoặc giai đoạn thay đổi.

## Kiến trúc triển khai sản xuất đề xuất

```text
Dữ liệu ruộng / Prophet / trạm quan trắc
                 |
        Context & freshness gate
                 |
  Metadata filter (giống, giai đoạn, mức mặn)
                 |
 Hybrid retriever (BM25 + vector + reranker)
                 |
       Knowledge chunks có phiên bản
                 |
  Grounded generator + rule safety guardrails
                 |
 Confidence / citation / contradiction checks
                 |
 Thông báo màn hình chính + nhật ký phản hồi
```

Kho tri thức sản xuất nên lưu từng đoạn với metadata bắt buộc: tài liệu, trang, ngày hiệu lực, giống, giai đoạn, khoảng mặn, loại bằng chứng, địa bàn, hành động, chống chỉ định và phiên bản. Truy xuất phải dùng metadata filter trước semantic search để tránh lấy nhầm bằng chứng của giống hoặc giai đoạn khác.

## Cơ chế thông báo

- Tạo lại khuyến nghị khi có số đo mới, dự báo vượt sang một dải mặn khác, hoặc cây chuyển giai đoạn.
- Mức `critical` cần gửi ngay; mức `high` gửi khi mới xuất hiện hoặc tăng; mức `medium/low` chỉ cập nhật khi thay đổi đáng kể để tránh mệt mỏi vì cảnh báo.
- Khóa chống lặp nên dùng `user + ruộng + giai đoạn + dải mặn + phiên bản tri thức`.
- Mọi khuyến nghị cần lưu input, đoạn tri thức đã truy xuất, phiên bản quy tắc và phản hồi thực tế để kiểm toán.

## Đánh giá trước khi dùng rộng rãi

- Retrieval recall@k trên bộ câu hỏi do chuyên gia nông học gán nhãn.
- Groundedness: mọi hành động phải được hỗ trợ bởi ít nhất một đoạn truy xuất.
- Sai giống/sai giai đoạn phải bằng 0 trong bộ kiểm thử ràng buộc.
- Đánh giá riêng độ đúng mức rủi ro, tính khả thi, độ kịp thời và tỷ lệ cảnh báo lặp.
- Phản hồi thực địa chỉ điều chỉnh thứ tự ưu tiên; không được ghi đè quy tắc an toàn khoa học nếu chưa có chuyên gia phê duyệt.

## Nguồn tri thức ban đầu

- `EUREKA (3).pdf`: khung bốn mức mặn, bảy giai đoạn, cơ chế khuyến nghị và ma trận OM18, OM5451, Đài Thơm 8, IR4625, IR50404.
- `EUREKA (2).pdf`: bằng chứng bổ sung và ma trận chi tiết cho OM5451, IR4625, IR50404, ST24.

