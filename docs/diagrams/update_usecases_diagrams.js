const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
let htmlContent = fs.readFileSync(filePath, "utf8");

// Hàm tạo Use Case Diagram
function generateUCDiagram(
  actorName,
  ucName,
  extendsList = [],
  includesList = [],
) {
  let extendBlock = "";
  extendsList.forEach((ext) => {
    extendBlock += `
usecase "${ext}" as UC_${toId(ext)}
UC_${toId(ucName)} <.. UC_${toId(ext)} : <<extend>>`;
  });

  let includeBlock = "";
  includesList.forEach((inc) => {
    includeBlock += `
usecase "${inc}" as UC_${toId(inc)}
UC_${toId(ucName)} ..> UC_${toId(inc)} : <<include>>`;
  });

  return `@startuml
left to right direction
skinparam packageStyle rectangle
actor "${actorName}" as User
usecase "${ucName}" as UC_${toId(ucName)}
${extendBlock}
${includeBlock}
User -- UC_${toId(ucName)}
@enduml`;
}

function toId(str) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "");
}

// Data
const ucs = {
  // UC01: Đăng ký (Theo mẫu: có extend Email, SĐT)
  uc01: `@startuml
left to right direction
actor "Bạn đọc" as Reader
usecase "Đăng ký" as UC_Register
usecase "Email" as UC_Email
usecase "Số điện thoại" as UC_Phone

Reader -- UC_Register

UC_Register <.. UC_Email : <<extend>>
UC_Register <.. UC_Phone : <<extend>>
@enduml`,

  // UC02: Đăng nhập (Có extend Quên mật khẩu)
  uc02: generateUCDiagram("Người dùng", "Đăng nhập", ["Quên mật khẩu"], []),

  // UC03..UC23 (Cơ bản)
  uc03: generateUCDiagram("Người dùng", "Đăng xuất"),
  uc04: generateUCDiagram("Bạn đọc", "Quên mật khẩu", [], ["Gửi OTP"]),
  uc05: generateUCDiagram("Bạn đọc", "Tra cứu sách"),
  uc06: generateUCDiagram("Bạn đọc", "Xem chi tiết sách", ["Bình luận"]),
  uc07: generateUCDiagram("Bạn đọc", "Gia hạn sách"),
  uc08: generateUCDiagram("Bạn đọc", "Mượn sách"),
  uc09: generateUCDiagram("Bạn đọc", "Trả sách"),
  uc10: generateUCDiagram("Bạn đọc", "Đánh giá sách"),
  uc11: generateUCDiagram("Thủ thư", "Thanh toán phạt"),
  uc12: generateUCDiagram("Bạn đọc", "Xem lịch sử"),
  uc13: generateUCDiagram("Người dùng", "Cập nhật thông tin"),
  uc14: generateUCDiagram("Thủ thư", "Lập phiếu mượn", [], ["Kiểm tra thẻ"]),
  uc15: generateUCDiagram("Thủ thư", "Quản lý sách", [
    "Thêm sách",
    "Sửa sách",
    "Xóa sách",
  ]),
  uc16: generateUCDiagram("Thủ thư", "Quản lý bạn đọc", ["Khóa thẻ"]),
  uc17: generateUCDiagram("Thủ thư", "Cập nhật tình trạng sách"),
  uc18: generateUCDiagram("Hệ thống", "Xử lý quá hạn"),
  uc19: generateUCDiagram("Admin", "Thống kê"),
  uc20: generateUCDiagram("Admin", "Quản lý tài khoản", ["Phân quyền"]),
  uc21: generateUCDiagram("Admin", "Phân quyền"),
  uc22: generateUCDiagram("Admin", "Cấu hình hệ thống"),
  uc23: generateUCDiagram("Admin", "Xuất báo cáo"),
  uc09: generateUCDiagram("Bạn đọc", "Trả sách trực tuyến"),
};

// Replace Logic
let count = 0;
Object.keys(ucs).forEach((ucId) => {
  const newCode = ucs[ucId];

  const startRegex = new RegExp(`<div id="${ucId}"`, "i");
  const match = htmlContent.match(startRegex);

  if (match) {
    const start = match.index;
    const nextMatch = htmlContent.substring(start + 1).match(/<div id="uc/i);
    const end = nextMatch ? start + 1 + nextMatch.index : htmlContent.length;

    let block = htmlContent.substring(start, end);

    // Tìm Use Case Diagram IMG (Thường là img đầu tiên hoặc sau header Use Case Diagram)
    const headerIndex = block.indexOf(">Use Case Diagram<");
    if (headerIndex !== -1) {
      const subBlock = block.substring(headerIndex);
      const umlRegex = /data-uml='([^']*)'/;
      const m = subBlock.match(umlRegex);

      if (m) {
        const fullMatch = m[0];
        const cleanNewCode = newCode.replace(/'/g, "&#39;");
        const newAttribute = `data-uml='${cleanNewCode}'`;
        const newSubBlock = subBlock.replace(fullMatch, newAttribute);

        const newBlock = block.substring(0, headerIndex) + newSubBlock;
        htmlContent = htmlContent.replace(block, newBlock);
        count++;
        console.log(`Updated UC Diagram for ${ucId}`);
      }
    }
  }
});

fs.writeFileSync(filePath, htmlContent, "utf8");
console.log(`\nUpdated ${count} Use Case Diagrams.`);
