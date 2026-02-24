const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
if (!fs.existsSync(filePath)) {
  console.error("File not found:", filePath);
  process.exit(1);
}
let htmlContent = fs.readFileSync(filePath, "utf8");

function escapeHtml(text) {
  if (!text) return text;
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* --- Generators --- */

// 1. Form/Input Loop (Interactive: Input -> Check -> Error/Retry or Success)
function genForm(
  actor,
  start,
  uiShow,
  input,
  submit,
  sysCheck,
  condition,
  errorMsg,
  successAction,
) {
  return `@startuml
skinparam backgroundColor white
skinparam activity {
  BackgroundColor #FEF3C7
  BorderColor #D97706
  FontName Arial
  FontSize 13
}
skinparam swimlane {
  TitleBackgroundColor #DBEAFE
  BorderColor #1E40AF
  BorderThickness 1.5
  TitleFontName Arial
  TitleFontSize 14
  TitleFontColor #1E3A8A
}
skinparam arrow {
  Color #B45309
  Thickness 1.5
}

|User| ${actor}
|UI| Giao diện
|System| Hệ thống

|User|
start
:${start};
|UI|
:${uiShow};
repeat
|User|
:${input};
:${submit};
|System|
:${sysCheck};
if (${condition}) then (no)
  |UI|
  :${errorMsg};
  :Yêu cầu nhập lại;
else (yes)
  |System|
  :${successAction};
  stop
endif
repeat while (Thử lại)
@enduml`;
}

// 2. Simple Action (Trigger -> Check -> Result) - No Loop
function genAction(actor, start, sysCheck, condition, errorMsg, successAction) {
  return `@startuml
skinparam backgroundColor white
skinparam activity {
  BackgroundColor #FEF3C7
  BorderColor #D97706
  FontName Arial
  FontSize 13
}
skinparam swimlane {
  TitleBackgroundColor #DBEAFE
  BorderColor #1E40AF
  BorderThickness 1.5
  TitleFontName Arial
  TitleFontSize 14
  TitleFontColor #1E3A8A
}
skinparam arrow {
  Color #B45309
  Thickness 1.5
}

|User| ${actor}
|System| Hệ thống
|UI| Giao diện

|User|
start
:${start};
|System|
:${sysCheck};
if (${condition}) then (no)
  |UI|
  :${errorMsg};
  stop
else (yes)
  |System|
  :${successAction};
  stop
endif
@enduml`;
}

// 3. View/Data Retrieval (Select -> Fetch -> Show)
function genView(actor, start, sysFetch, condition, emptyMsg, showData) {
  return `@startuml
skinparam backgroundColor white
skinparam activity {
  BackgroundColor #FEF3C7
  BorderColor #D97706
  FontName Arial
  FontSize 13
}
skinparam swimlane {
  TitleBackgroundColor #DBEAFE
  BorderColor #1E40AF
  BorderThickness 1.5
  TitleFontName Arial
  TitleFontSize 14
  TitleFontColor #1E3A8A
}
skinparam arrow {
  Color #B45309
  Thickness 1.5
}

|User| ${actor}
|System| Hệ thống
|UI| Giao diện

|User|
start
:${start};
|System|
:${sysFetch};
if (${condition}) then (no)
  |UI|
  :${emptyMsg};
  stop
else (yes)
  |UI|
  :${showData};
  stop
endif
@enduml`;
}

// 4. System Process (Background task)
function genSystemProcess(start, step1, step2, condition, branchNo, branchYes) {
  return `@startuml
skinparam backgroundColor white
skinparam activity {
  BackgroundColor #FEF3C7
  BorderColor #D97706
  FontName Arial
  FontSize 13
}
skinparam swimlane {
  TitleBackgroundColor #DBEAFE
  BorderColor #1E40AF
  BorderThickness 1.5
  TitleFontName Arial
  TitleFontSize 14
  TitleFontColor #1E3A8A
}
skinparam arrow {
  Color #B45309
  Thickness 1.5
}

|System| Hệ thống

|System|
start
:${start};
:${step1};
:${step2};
if (${condition}) then (no)
  :${branchNo};
  stop
else (yes)
  :${branchYes};
  stop
endif
@enduml`;
}

// Data Definition
const ucs = {
  // UC01: Register (Form Loop)
  uc01: genForm(
    "Bạn đọc",
    "Truy cập trang Đăng ký",
    "Hiển thị form đăng ký",
    "Nhập thông tin cá nhân",
    "Nhấn Đăng ký",
    "Kiểm tra thông tin",
    "Hợp lệ và Chưa tồn tại?",
    "Thông báo lỗi",
    "Tạo tài khoản mới",
  ),

  // UC02: Login (Form Loop)
  uc02: genForm(
    "Người dùng",
    "Chọn nút đăng nhập",
    "Hiển thị giao diện\\nđăng nhập",
    "Nhập thông tin tài\\nkhoản",
    "Chọn đăng nhập",
    "Kiểm tra credentials",
    "Tài khoản tồn tại?",
    "Thông báo nhập sai",
    "Đăng nhập & Chuyển trang",
  ),

  // UC03: Logout (Simple Action - No retry loop needed usually)
  uc03: genAction(
    "Người dùng",
    "Chọn Đăng xuất",
    "Xử lý đăng xuất (Xóa session)",
    "Session hợp lệ?",
    "Báo lỗi hệ thống",
    "Hủy phiên & Quay về login",
  ),

  // UC04: Forgot Password (Form Loop)
  uc04: genForm(
    "Bạn đọc",
    "Chọn Quên mật khẩu",
    "Form nhập email",
    "Nhập email đăng ký",
    "Gửi yêu cầu",
    "Kiểm tra email",
    "Email tồn tại?",
    "Báo email không đúng",
    "Gửi mã xác thực qua email",
  ),

  // UC05: Search (Form Loop - Retry with new keyword)
  uc05: genForm(
    "Bạn đọc",
    "Chọn Tra cứu",
    "Giao diện tìm kiếm",
    "Nhập từ khóa",
    "Nhấn Tìm kiếm",
    "Truy vấn sách",
    "Có kết quả?",
    "Thông báo không tìm thấy",
    "Hiển thị danh sách sách",
  ),

  // UC06: View Detail (View Pattern)
  uc06: genView(
    "Bạn đọc",
    "Chọn sách từ danh sách",
    "Lấy thông tin chi tiết sách",
    "Sách tồn tại?",
    "Báo sách không còn tồn tại",
    "Hiển thị chi tiết sách",
  ),

  // UC07: Extend (Simple Action)
  uc07: genAction(
    "Bạn đọc",
    "Chọn nút gia hạn",
    "Kiểm tra điều kiện gia hạn",
    "Đủ điều kiện (Chưa quá hạn/Số lần)?",
    "Báo không được phép gia hạn",
    "Cập nhật ngày trả mới",
  ),

  // UC08: Mượn sách trực tuyến (Form Loop)
  uc08: genForm(
    "Bạn đọc",
    "Tìm sách cần mượn",
    "Trang chi tiết sách",
    "Nhấn nút Mượn sách",
    "Gửi yêu cầu mượn",
    "Kiểm tra sách & Hạn ngạch",
    "Hợp lệ?",
    "Báo lỗi (Hết sách/Quá hạn ngạch)",
    "Tạo yêu cầu mượn",
  ),

  // UC09: Trả sách (Action)
  uc09: genAction(
    "Bạn đọc",
    "Chọn sách & Nhấn Trả",
    "Xử lý trả sách",
    "Sách hợp lệ?",
    "Báo lỗi trả sách",
    "Cập nhật đã trả & Tính phí (nếu có)",
  ),

  // UC10: Rate (Form Loop)
  uc10: genForm(
    "Bạn đọc",
    "Chọn Đánh giá",
    "Form đánh giá",
    "Chọn sao & Viết review",
    "Gửi đánh giá",
    "Kiểm tra điều kiện",
    "Đã mượn sách này?",
    "Báo chưa đủ điều kiện đánh giá",
    "Lưu đánh giá",
  ),

  // UC11: Pay Fine (Form Loop - Input money)
  uc11: genForm(
    "Thủ thư",
    "Chọn Thu phạt",
    "Form thu tiền phạt",
    "Nhập số tiền khách đưa",
    "Xác nhận thu",
    "Xử lý thanh toán",
    "Số tiền >= Phí phạt?",
    "Báo số tiền không đủ",
    "Cập nhật trạng thái phiếu phạt",
  ),

  // UC12: History (View Pattern)
  uc12: genView(
    "Bạn đọc",
    "Vào menu Lịch sử",
    "Truy vấn lịch sử mượn",
    "Có dữ liệu?",
    "Hiển thị thông báo trống",
    "Hiển thị bảng lịch sử",
  ),

  // UC13: Profile (Form Loop)
  uc13: genForm(
    "Người dùng",
    "Vào trang cá nhân",
    "Form thông tin",
    "Cập nhật thông tin",
    "Lưu thay đổi",
    "Validate dữ liệu",
    "Dữ liệu hợp lệ?",
    "Báo lỗi định dạng",
    "Cập nhật DB",
  ),

  // UC14: Create Loan (Form Loop)
  uc14: genForm(
    "Thủ thư",
    "Quét thẻ độc giả",
    "Hiển thị thông tin độc giả",
    "Quét mã sách & Nhập hạn",
    "Lập phiếu mượn",
    "Kiểm tra điều kiện mượn",
    "Độc giả đủ điều kiện?",
    "Báo vi phạm/Quá hạn ngạch",
    "Tạo phiếu mượn",
  ),

  // UC15: Manage Books (Form Loop - Add/Edit)
  uc15: genForm(
    "Thủ thư",
    "Mở form thêm sách",
    "Form nhập sách",
    "Nhập thông tin sách",
    "Lưu sách",
    "Kiểm tra dữ liệu",
    "Hợp lệ?",
    "Báo lỗi nhập liệu",
    "Cập nhật kho sách",
  ),

  // UC16: Reader Status (Simple Action)
  uc16: genAction(
    "Thủ thư",
    "Khóa/Mở khóa độc giả",
    "Cập nhật trạng thái thẻ",
    "Thành công?",
    "Báo lỗi cập nhật",
    "Lưu trạng thái mới",
  ),

  // UC17: Book Status (Simple Action)
  uc17: genAction(
    "Thủ thư",
    "Cập nhật tình trạng sách",
    "Kiểm tra & Cập nhật",
    "Sách tồn tại?",
    "Báo lỗi mã sách",
    "Lưu tình trạng (Mất/Hỏng)",
  ),

  // UC18: Scan Overdue (System Process)
  uc18: genSystemProcess(
    "Chạy quét định kỳ (Timer)",
    "Lấy tất cả phiếu đang mượn",
    "So sánh Ngày Trả vs Hiện tại",
    "Có phiếu quá hạn?",
    "Kết thúc quy trình (0 updates)",
    "Tạo phiếu phạt & Gửi thông báo",
  ),

  // UC19: Stats (View Pattern)
  uc19: genView(
    "Admin",
    "Truy cập Dashboard",
    "Tổng hợp số liệu thống kê",
    "Dữ liệu sẵn sàng?",
    "Hiển thị dashboard trống",
    "Hiển thị biểu đồ & Số liệu",
  ),

  // UC20: Manage Staff (Action/Form)
  uc20: genForm(
    "Admin",
    "Chọn nhân viên",
    "Form phân quyền",
    "Chọn vai trò mới",
    "Lưu phân quyền",
    "Kiểm tra quyền hạn",
    "Hợp lệ?",
    "Báo lỗi",
    "Cập nhật quyền hạn",
  ),

  // UC21: Permissions (Form)
  uc21: genForm(
    "Admin",
    "Cấu hình nhóm quyền",
    "Bảng chức năng",
    "Tích chọn quyền hạn",
    "Lưu cấu hình",
    "Kiểm tra logic",
    "Không xung đột?",
    "Báo xung đột quyền",
    "Cập nhật hệ thống",
  ),

  // UC22: Config (Form)
  uc22: genForm(
    "Admin",
    "Vào Cấu hình hệ thống",
    "Form tham số quy định",
    "Sửa giá trị quy định",
    "Lưu thay đổi",
    "Validate giá trị",
    "Trong khoảng cho phép?",
    "Báo giá trị không hợp lệ",
    "Lưu cấu hình mới",
  ),

  // UC23: Report (Form)
  uc23: genForm(
    "Admin",
    "Chọn loại báo cáo",
    "Preview báo cáo",
    "Chọn định dạng & Thời gian",
    "Xuất file",
    "Tạo file báo cáo",
    "Tạo thành công?",
    "Báo lỗi xuất file",
    "Tải xuống file báo cáo",
  ),

  // UC09: Trả sách trực tuyến (Action)
  uc09: genAction(
    "Bạn đọc",
    "Chọn sách & Nhấn Trả",
    "Xử lý trả sách",
    "Sách hợp lệ?",
    "Báo lỗi trả sách",
    "Cập nhật đã trả & Tính phí (nếu có)",
  ),
};

// Replace Logic
let count = 0;
Object.keys(ucs).forEach((ucId) => {
  let newCode = ucs[ucId];
  newCode = escapeHtml(newCode);

  const startRegex = new RegExp(`<div id="${ucId}"`, "i");
  const match = htmlContent.match(startRegex);

  if (match) {
    const start = match.index;
    const nextMatch = htmlContent.substring(start + 1).match(/<div id="uc/i);
    const end = nextMatch ? start + 1 + nextMatch.index : htmlContent.length;

    let block = htmlContent.substring(start, end);

    const headerIndex = block.indexOf(">Activity Diagram<");
    if (headerIndex !== -1) {
      const subBlock = block.substring(headerIndex);
      const umlRegex = /data-uml='([\s\S]*?)'/;
      const m = subBlock.match(umlRegex);

      if (m) {
        const fullMatch = m[0];
        const newSubBlock = subBlock.replace(
          fullMatch,
          `data-uml='${newCode}'`,
        );
        const newBlock = block.substring(0, headerIndex) + newSubBlock;
        htmlContent = htmlContent.replace(block, newBlock);
        count++;
        console.log(`Updated Activity for ${ucId}`);
      }
    }
  }
});

fs.writeFileSync(filePath, htmlContent, "utf8");
console.log(`\nUpdated ${count} Activity Diagrams with correct logic types.`);
