const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
let htmlContent = fs.readFileSync(filePath, "utf8");

// Helper to convert string to CamelCase function
function toFunc(str) {
  if (!str) return "method()";
  return (
    str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .split(" ")
      .map((word, index) =>
        index === 0
          ? word.toLowerCase()
          : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join("") + "()"
  );
}

function toLower(str) {
  return str.toLowerCase();
}

// Template Generator
function generateStyleV2(
  title,
  actorName,
  step1,
  step2,
  step3,
  step4,
  funcSystem,
  funcDb,
  successMsg,
  failMsg,
  dbCheck = true,
) {
  const titleLower = toLower(title);

  // Logic cho nhánh Alt
  let altBlock = "";
  if (dbCheck) {
    altBlock = `
alt Dữ liệu hợp lệ
    DB --> System : Thông tin hợp lệ
    deactivate DB
    
    System -> UI : ${funcSystem.replace("()", "")}Success()
    activate UI
    UI --> User : ${successMsg || "Hiển thị thông báo thành công"}
    UI -> User : Chuyển hướng / Cập nhật
    deactivate UI
else Dữ liệu không hợp lệ
    DB --> System : Lỗi / Không tồn tại
    deactivate DB
    
    System --> UI : ${funcSystem.replace("()", "")}Fail()
    activate UI
    UI --> User : ${failMsg || "Hiển thị thông báo lỗi"}
    UI --> User : Quay lại màn hình cũ
    deactivate UI
end`;
  } else {
    // Read-only logic (Tìm kiếm/Báo cáo)
    altBlock = `
alt Có dữ liệu trả về
    DB --> System : Danh sách kết quả
    deactivate DB
    
    System -> UI : returnData()
    activate UI
    UI --> User : Hiển thị bảng dữ liệu
    deactivate UI
else Không tìm thấy dữ liệu
    DB --> System : Danh sách rỗng
    deactivate DB
    
    System --> UI : returnEmpty()
    activate UI
    UI --> User : Thông báo không có dữ liệu
    deactivate UI
end`;
  }

  return `@startuml
title Biểu đồ tuần tự ${titleLower}
autonumber
skinparam maxMessageSize 200
skinparam wrapWidth 300

actor "${actorName}" as User
participant "Giao diện" as UI
participant "Hệ thống" as System
participant "CSDL" as DB

== Khởi tạo ${titleLower} ==

activate User
User -> UI : ${step1}
activate UI
UI --> User : ${step2}
deactivate UI

User -> UI : ${step3}
activate UI
User -> UI : ${step4}

UI -> System : ${funcSystem}
activate System
System -> DB : ${funcDb}
activate DB
DB -> DB : Kiểm tra dữ liệu

${altBlock}

deactivate System
deactivate UI
deactivate User
@enduml`;
}

// UC Data
const ucs = {
  // UC01: Đăng ký
  uc01: generateStyleV2(
    "Đăng ký",
    "Bạn đọc",
    "Chọn chức năng đăng ký",
    "Hiển thị form đăng ký",
    "Nhập thông tin cá nhân",
    "Gửi yêu cầu đăng ký",
    "submitRegister(info)",
    "checkUser(email)",
    "Đăng ký thành công",
    "Email đã tồn tại",
  ),

  // UC02: Đăng nhập (Fix logic: bỏ activate DB thừa ở nhánh else)
  uc02: `@startuml
title Biểu đồ tuần tự đăng nhập
autonumber
skinparam maxMessageSize 200
skinparam wrapWidth 300

actor "Bạn đọc\\nThủ thư\\nAdmin" as User
participant "Giao diện" as UI
participant "Hệ thống" as System
participant "CSDL" as DB

== Khởi tạo đăng nhập ==

activate User
User -> UI : Chọn chức năng đăng nhập
activate UI
UI --> User : Hiển thị form đăng nhập
deactivate UI

User -> UI : Nhập thông tin đăng nhập
activate UI
User -> UI : Gửi yêu cầu đăng nhập

UI -> System : submitLogin(thông tin)
activate System
System -> DB : queryUser(tài khoản, mật khẩu)
activate DB
DB -> DB : Kiểm tra dữ liệu

alt Tài khoản hợp lệ
    DB --> System : Thông tin hợp lệ
    deactivate DB
    
    System -> UI : loginSuccess()
    activate UI
    UI --> User : Hiển thị thông báo thành công
    UI -> User : Chuyển đến trang chủ
    deactivate UI
else Tài khoản không hợp lệ
    DB --> System : Không tồn tại / Sai mật khẩu
    deactivate DB
    
    System --> UI : loginFail()
    activate UI
    UI --> User : Hiển thị thông báo lỗi
    UI --> User : Quay lại màn hình đăng nhập
    deactivate UI
end
deactivate System
deactivate UI
deactivate User
@enduml`,

  uc03: generateStyleV2(
    "Đăng xuất",
    "Người dùng",
    "Chọn đăng xuất",
    "Yêu cầu xác nhận",
    "Xác nhận đồng ý",
    "Gửi lệnh đăng xuất",
    "logout()",
    "clearSession()",
    "Đăng xuất thành công",
    "Lỗi hệ thống",
  ),
  uc04: generateStyleV2(
    "Quên mật khẩu",
    "Bạn đọc",
    "Chọn quên mật khẩu",
    "Form nhập email",
    "Nhập email đăng ký",
    "Gửi yêu cầu reset",
    "requestReset()",
    "findEmail()",
    "Gửi mã OTP thành công",
    "Email không tồn tại",
  ),
  uc05: generateStyleV2(
    "Tra cứu sách",
    "Bạn đọc",
    "Chọn menu Tra cứu",
    "Giao diện tìm kiếm",
    "Nhập từ khóa",
    "Tìm kiếm",
    "searchBooks()",
    "queryBooks()",
    "",
    "",
    false,
  ),
  uc06: generateStyleV2(
    "Xem chi tiết",
    "Bạn đọc",
    "Chọn sách từ danh sách",
    "Chi tiết sách",
    "Xem thông tin",
    "Tải chi tiết",
    "getBookDetail(id)",
    "queryBook(id)",
    "Hiển thị thông tin",
    "Sách không tồn tại",
  ),
  uc07: generateStyleV2(
    "Gia hạn sách",
    "Bạn đọc",
    "Chọn sách đang mượn",
    "Thông tin phiếu mượn",
    "Nhấn nút Gia hạn",
    "Yêu cầu gia hạn",
    "extendLoan()",
    "checkLoanReq()",
    "Gia hạn thành công",
    "Không đủ điều kiện gia hạn",
  ),
  uc08: generateStyleV2(
    "Mượn sách",
    "Bạn đọc",
    "Chọn sách cần mượn",
    "Chi tiết sách",
    "Nhấn Mượn sách",
    "Yêu cầu phiếu",
    "borrowBook()",
    "checkBookStock()",
    "Mượn sách thành công",
    "Sách hết hoặc lỗi",
  ),
  uc09: generateStyleV2(
    "Trả sách",
    "Bạn đọc",
    "Sách của tôi -> Đang mượn",
    "Danh sách sách mượn",
    "Chọn sách -> Trả",
    "Xác nhận trả",
    "returnBook()",
    "updateLoanStatus()",
    "Trả sách thành công",
    "Lỗi cập nhật",
  ),
  uc10: generateStyleV2(
    "Đánh giá",
    "Bạn đọc",
    "Vào xem chi tiết",
    "Form đánh giá",
    "Nhập nội dung & Sao",
    "Gửi đánh giá",
    "submitReview()",
    "saveReview()",
    "Đánh giá thành công",
    "Lỗi khi lưu",
  ),
  uc11: generateStyleV2(
    "Thanh toán",
    "Thủ thư",
    "Tìm độc giả nợ",
    "Thông tin phiếu phạt",
    "Nhập số tiền thu",
    "Xác nhận thanh toán",
    "processPayment()",
    "updateFine()",
    "Thanh toán thành công",
    "Lỗi cập nhật",
  ),
  uc12: generateStyleV2(
    "Lịch sử",
    "Bạn đọc",
    "Vào trang cá nhân",
    "Menu Lịch sử",
    "Chọn xem lịch sử",
    "Tải danh sách",
    "getHistory()",
    "queryHistory()",
    "",
    "",
    false,
  ),
  uc13: generateStyleV2(
    "Cập nhật info",
    "Người dùng",
    "Vào trang Profile",
    "Form thông tin",
    "Sửa dữ liệu",
    "Lưu thay đổi",
    "updateProfile()",
    "saveProfile()",
    "Cập nhật thành công",
    "Dữ liệu không hợp lệ",
  ),
  uc14: generateStyleV2(
    "Lập phiếu",
    "Thủ thư",
    "Quét mã sách & thẻ",
    "Form phiếu mượn",
    "Kiểm tra & Xác nhận",
    "Tạo phiếu",
    "createLoan()",
    "checkConditions()",
    "Lập phiếu thành công",
    "Độc giả bị khoá/Sách hết",
  ),
  uc15: generateStyleV2(
    "QL Sách",
    "Thủ thư",
    "Vào trang Quản lý",
    "Danh sách sách",
    "Nhập thông tin sách",
    "Lưu sách",
    "saveBook()",
    "insertBook()",
    "Lưu thành công",
    "Lỗi dữ liệu",
  ),
  uc16: generateStyleV2(
    "QL Bạn đọc",
    "Thủ thư",
    "Vào trang Bạn đọc",
    "Danh sách độc giả",
    "Chọn khoá/mở khoá",
    "Cập nhật trạng thái",
    "updateUserStatus()",
    "saveStatus()",
    "Cập nhật thành công",
    "Lỗi",
  ),
  uc17: generateStyleV2(
    "Tình trạng sách",
    "Thủ thư",
    "Tra cứu mã sách",
    "Thông tin tình trạng",
    "Cập nhật hỏng/mất",
    "Lưu tình trạng",
    "updateCondition()",
    "saveCondition()",
    "Cập nhật thành công",
    "Lỗi",
  ),
  uc18: generateStyleV2(
    "Quá hạn",
    "Hệ thống",
    "Trigger Cron Job",
    "Danh sách quá hạn",
    "Tính phí phạt",
    "Xử lý vi phạm",
    "processOverdue()",
    "updateFines()",
    "Xử lý hoàn tất",
    "Lỗi",
  ),
  uc19: generateStyleV2(
    "Thống kê",
    "Admin",
    "Vào trang Thống kê",
    "Dashboard",
    "Chọn bộ lọc",
    "Xem báo cáo",
    "getStats()",
    "queryAggregates()",
    "",
    "",
    false,
  ),
  uc20: generateStyleV2(
    "QL Tài khoản",
    "Admin",
    "Vào quản lý User",
    "Danh sách nhân viên",
    "Cấp quyền",
    "Lưu phân quyền",
    "updateRole()",
    "saveRole()",
    "Phân quyền thành công",
    "Lỗi",
  ),
  uc21: generateStyleV2(
    "Phân quyền",
    "Admin",
    "Chọn nhóm quyền",
    "Bảng chức năng",
    "Tích chọn quyền",
    "Lưu cấu hình",
    "savePermissions()",
    "updatePerms()",
    "Lưu thành công",
    "Lỗi",
  ),
  uc22: generateStyleV2(
    "Cấu hình",
    "Admin",
    "Vào trang Cấu hình",
    "Form tham số",
    "Sửa quy định",
    "Lưu tham số",
    "updateConfig()",
    "saveConfig()",
    "Lưu thành công",
    "Giá trị không hợp lệ",
  ),
  uc23: generateStyleV2(
    "Báo cáo",
    "Admin",
    "Chọn loại báo cáo",
    "Preview báo cáo",
    "Chọn định dạng",
    "Xuất file",
    "exportReport()",
    "fetchReportData()",
    "",
    "",
    false,
  ),
  uc09: generateStyleV2(
    "Trả sách",
    "Bạn đọc",
    "Sách của tôi -> Đang mượn",
    "Danh sách sách mượn",
    "Chọn sách -> Trả",
    "Xác nhận trả",
    "returnBook()",
    "updateLoanStatus()",
    "Trả sách thành công",
    "Lỗi cập nhật",
  ),
};

// --- REPLACE LOGIC ---
let count = 0;
Object.keys(ucs).forEach((ucId) => {
  const newCode = ucs[ucId];

  // Try to find block using div id
  const startRegex = new RegExp(`<div id="${ucId}"`, "i");
  const match = htmlContent.match(startRegex);

  if (match) {
    const start = match.index;
    const nextMatch = htmlContent.substring(start + 1).match(/<div id="uc/i);
    const end = nextMatch ? start + 1 + nextMatch.index : htmlContent.length;

    let block = htmlContent.substring(start, end);

    const headerIndex = block.indexOf(">Sequence Diagram<");
    if (headerIndex !== -1) {
      const subBlock = block.substring(headerIndex);
      const umlRegex = /data-uml='([\s\S]*?)'/;
      const m = subBlock.match(umlRegex);

      if (m) {
        const oldAttribute = m[0];
        const cleanNewCode = newCode.replace(/'/g, "&#39;");
        const newAttribute = `data-uml='${cleanNewCode}'`;

        const newSubBlock = subBlock.replace(oldAttribute, newAttribute);
        const newBlock = block.substring(0, headerIndex) + newSubBlock;

        htmlContent = htmlContent.replace(block, newBlock);
        count++;
        console.log(`Updated Sequence for ${ucId}`);
      }
    }
  }
});

fs.writeFileSync(filePath, htmlContent, "utf8");
console.log(`\nFixed ACTIVATION issues in ${count} sequences.`);
