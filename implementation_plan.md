# Kế Hoạch Thực Hiện Chi Tiết - Phần Mềm Quản Lý Thư Viện

## Công Nghệ

- **Frontend**: React (Vite), Tailwind CSS, Lucide React (Icons), React Router DOM.
- **Backend**: Node.js, Express.
- **Database**: SQLite (Sử dụng `better-sqlite3` hoặc `sequelize` để lưu dữ liệu cục bộ, không cần cài đặt phức tạp).
- **Kiến trúc**: Client-Server (REST API).

## Lộ Trình Triển Khai

### Giai đoạn 1: Khởi tạo Project (Đang thực hiện)

1.  [ ] Khởi tạo Frontend (`client`): React + Vite.
2.  [ ] Cài đặt Tailwind CSS cho Frontend.
3.  [ ] Khởi tạo Backend (`server`): Node.js + Express.
4.  [ ] Cài đặt các thư viện cần thiết (`concurrently` để chạy cả 2 cùng lúc).

### Giai đoạn 2: Thiết kế Cơ sở dữ liệu & API Nền tảng

1.  [ ] Thiết kế Schema: `Books` (Sách), `Readers` (Độc giả), `BorrowSlips` (Phiếu mượn).
2.  [ ] Setup kết nối SQLite.
3.  [ ] Viết API CRUD cơ bản cho Sách.

### Giai đoạn 3: Phát triển Giao diện (Frontend)

1.  [ ] **Layout chính**: Sidebar, Header đẹp mắt (Glassmorphism).
2.  [ ] **Dashboard**: Hiển thị thống kê nhanh.
3.  [ ] **Trang Quản lý Sách**:
    - Lưới hiển thị sách (Grid/Table).
    - Form thêm/sửa sách (Modal).

### Giai đoạn 4: Nghiệp vụ Mượn Trả

1.  [ ] **Trang Mượn Sách**: Chọn độc giả -> Chọn sách -> Tạo phiếu.
2.  [ ] **Trang Trả Sách**: Tìm phiếu -> Xác nhận trả -> Tính phạt.

### Giai đoạn 5: Hoàn thiện

1.  [ ] Kiểm tra lỗi.
2.  [ ] Tối ưu UI/UX.
