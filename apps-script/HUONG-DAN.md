# Nhận yêu cầu từ form liên hệ về Gmail

Khi khách bấm **Gửi yêu cầu** trên website:

1. Gmail `nawebagency37@gmail.com` (team) và `hieulp3a2004@gmail.com` cùng nhận email "Khách mới: …", có nút **Gọi** và **Nhắn Zalo**. Danh sách người nhận nằm ở `NOTIFY_EMAILS` đầu file `Code.gs`.
2. Google Sheet ghi thêm một dòng (thời gian, tên, SĐT, dịch vụ, ngân sách, mô tả, ô tích "Đã liên hệ").

Cài một lần, mất khoảng 5 phút.

## Bước 1. Tạo Google Sheet và dán script

1. Vào <https://sheets.new> (đăng nhập bằng `hieulp3a2004@gmail.com`), đặt tên ví dụ **NA Web – Khách hàng**.
2. Menu **Tiện ích mở rộng → Apps Script** (Extensions → Apps Script).
3. Xóa hết code có sẵn, dán toàn bộ nội dung file [`Code.gs`](Code.gs), bấm biểu tượng **Lưu**.

## Bước 2. Gửi thử một email

1. Ở thanh trên, chọn hàm **guiThu**, bấm **Chạy** (Run).
2. Google hỏi quyền: bấm **Xem lại quyền** → chọn tài khoản của bạn.
3. Nếu hiện "Google chưa xác minh ứng dụng này": bấm **Nâng cao** → **Chuyển đến … (không an toàn)** → **Cho phép**.
   Đây là script do chính bạn tạo, chỉ chạy trên tài khoản của bạn.
4. Mở Gmail: phải thấy email "Khách mới: Khách thử · Phần mềm quản lý". Sheet có thêm tab **Yêu cầu** với một dòng.

## Bước 3. Triển khai thành Web App

1. Bấm **Triển khai → Tùy chọn triển khai mới** (Deploy → New deployment).
2. Bấm biểu tượng bánh răng, chọn **Ứng dụng web** (Web app).
3. Điền:
   - **Thực thi với tư cách:** Tôi (`hieulp3a2004@gmail.com`)
   - **Ai có quyền truy cập:** Bất kỳ ai (Anyone)
4. Bấm **Triển khai**, sao chép **URL ứng dụng web**. Nó có dạng
   `https://script.google.com/macros/s/AKfy…/exec`.
5. Dán URL đó vào trình duyệt: phải thấy `{"ok":true,"service":"NA Web contact form"}`.

## Bước 4. Gắn vào website

Trong `index.html`, tìm dòng:

```js
const FORM_ENDPOINT = "";
```

Dán URL vào giữa hai dấu ngoặc kép, lưu file, rồi `git commit` và `git push`.

Khi `FORM_ENDPOINT` còn để trống, form tạm mở ứng dụng email của khách như trước.

## Sửa script sau này

Sau khi sửa `Code.gs`, phải **Triển khai → Quản lý các lần triển khai → Chỉnh sửa → Phiên bản: Phiên bản mới → Triển khai**.
Làm như vậy thì URL giữ nguyên, không cần sửa lại website.

## Giới hạn

- Gmail cá nhân gửi được khoảng 100 email mỗi ngày qua Apps Script, thừa đủ cho form liên hệ.
- Cùng một số điện thoại gửi lại trong vòng 60 giây chỉ được ghi một lần, để tránh khách bấm hai lần.
- Bot spam điền vào ô ẩn `website` sẽ bị bỏ qua.
