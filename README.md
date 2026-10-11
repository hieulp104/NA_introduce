# NA Web Agency

Trang giới thiệu của NA Web Agency: website, phần mềm quản lý và web học tập.

Trang tĩnh, không cần build. Mở `index.html` trong trình duyệt, hoặc chạy server cục bộ để video bìa phát ổn định:

```bash
npx serve .
```

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Toàn bộ trang: HTML, CSS và JS |
| `assets/cover-*.jpg` | Ảnh bìa 3 cuốn sách ở hero |
| `assets/motion-*.mp4` | Video chuyển động trên bìa |
| `THREEUI-LICENSE.txt` | Giấy phép MIT của ThreeUI |
| `apps-script/` | Script Google nhận form liên hệ, gửi về Gmail. Cài theo `apps-script/HUONG-DAN.md` |

## Sửa nội dung thường gặp

- **3 dịch vụ (panel khi bấm vào sách):** object `books` trong script cuối `index.html`.
- **Sổ dự án:** các `<article class="pg">` trong `#sbkSource`. Mỗi cặp trái/phải là một trang đôi. Khi có ảnh chụp màn hình thật, thay `<svg class="sketch">` ở trang phải bằng `<img>`.
- **Bảng giá:** section `#bang-gia`.
- **Form liên hệ:** hằng số `FORM_ENDPOINT` trong script, dán URL Web App của Apps Script vào đó.

## Giấy phép

Hero dựa trên [ThreeUI](https://github.com/MengTo/threeui) (MIT), xem `THREEUI-LICENSE.txt`.
