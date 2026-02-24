# Hệ Thống Quản Lý Thư Viện

## Tổng Quan Đồ Án

Đây là dự án phần mềm Quản lý Thư viện, hỗ trợ thủ thư quản lý sách, độc giả và các giao dịch mượn/trả sách một cách hiệu quả.

## Các Chức Năng Yêu Cầu (Dự Kiến)

Dựa trên yêu cầu chung của môn học (Đồ án môn học/Công nghệ phần mềm):

### 1. Quản lý Sách

- Thêm, Xóa, Sửa thông tin sách.
- Quản lý thể loại/tác giả.
- Tra cứu sách (theo tên, tác giả, mã sách).
- Quản lý tình trạng sách (Sẵn có, Đang mượn, Đã mất).

### 2. Quản lý Độc giả

- Đăng ký/Lập thẻ độc giả.
- Sửa thông tin độc giả.
- Xem lịch sử mượn trả.
- Xóa thẻ độc giả (hoặc khóa thẻ).

### 3. Quản lý Mượn/Trả (Nghiệp vụ cốt lõi)

- Lập phiếu mượn sách.
- Kiểm tra quy định mượn (số lượng tối đa, hạn trả).
- Lập phiếu trả sách.
- Tính tiền phạt (nếu trả quá hạn).

### 4. Thống kê & Báo cáo

- Thống kê số lượng sách mượn theo thể loại/tháng.
- Báo cáo sách trả trễ.
- Báo cáo độc giả mượn nhiều.

## Công Nghệ Sử Dụng (Đề Xuất)

- **Frontend**: React (Vite) + Tailwind CSS (Giao diện hiện đại)
- **Backend**: Node.js (Express)
- **Cơ sở dữ liệu**: SQLite (Gọn nhẹ, dễ cài đặt) hoặc MongoDB/MySQL

## Cấu Trúc Thư Mục

- `/client`: Mã nguồn Frontend (Giao diện)
- `/server`: Mã nguồn Backend (API)
- `/database`: File cơ sở dữ liệu
