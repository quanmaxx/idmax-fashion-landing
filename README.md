# IDMAX Fashion Landing Page

Đây là bản source được tách từ file HTML mới nhất bạn gửi. Giao diện, font, màu sắc, bố cục và nội dung gốc được giữ nguyên; phần dễ thay thế đã được đưa ra thành các thư mục riêng.

## Mở và chỉnh sửa bằng VS Code

1. Mở thư mục "idmax-fashion-landing-v2" bằng VS Code.
2. Cài extension Live Server nếu bạn muốn xem thay đổi tự động.
3. Chuột phải vào "index.html" → "Open with Live Server".

Trang đang dùng Tailwind CDN, Google Fonts và Font Awesome CDN giống file gốc nên cần có kết nối mạng khi xem bằng trình duyệt.

## Cấu trúc chính

~~~text
index.html
assets/
├── css/theme.css              # CSS tùy biến gốc của trang
├── data/projects.js           # Nội dung và gallery của 6 dự án
├── js/main.js                 # FAQ và hành vi gallery
└── images/
    ├── backgrounds/           # Ảnh nền hero và phần vấn đề
    └── projects/              # Mỗi dự án một thư mục riêng
        ├── billuxury/
        ├── hat/
        ├── badass/
        ├── beskarman/
        ├── tezo/
        └── baritta/
~~~

## Thay ảnh dự án

Trong từng thư mục dự án:

- "card.jpg": ảnh dùng trên thẻ dự án ở section “Dự án tiêu biểu”.
- "gallery-01.jpg" đến "gallery-04.jpg": ảnh hiển thị khi mở gallery.

Giữ nguyên tên file và thay ảnh mới vào đúng vị trí là trang sẽ tự dùng ảnh mới. Nếu muốn thêm ảnh thứ 5, thêm đường dẫn vào "images" của dự án tương ứng trong "assets/data/projects.js".

## Thay nội dung dự án

Mở "assets/data/projects.js" và chỉnh các trường:

- "title": tên dự án.
- "category": nhóm ngành hoặc định vị.
- "description": mô tả dự án.
- "highlights": các điểm nổi bật.
- "quote": phản hồi hoặc câu kết.
- "images": danh sách ảnh gallery.

## Thay ảnh nền

Thay trực tiếp:

- "assets/images/backgrounds/hero-bg.jpg"
- "assets/images/backgrounds/problem-bg.jpg"

Hai đường dẫn này đã được nối sẵn trong "index.html".

## Lưu ý khi đưa lên hosting

Đây là static site, không cần bước build. Chỉ cần upload toàn bộ thư mục, giữ nguyên cấu trúc tương đối giữa "index.html" và "assets/".
