const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
let htmlContent = fs.readFileSync(filePath, "utf8");

// --- HÀM TẠO SEQUENCE DIAGRAM THEO CHUẨN ---
// Template này đảm bảo tất cả UC đều có cấu trúc: Admin/User -> Giao diện -> Hệ thống -> Database
function generateSequence(
  title,
  actorName,
  userActionFirst,
  uiShow,
  userActionSubmit,
  systemRequest,
  dbQuery,
  dbCheckGroup,
  dbUpdateAction
) {
  let checkBlock = "";

  if (dbCheckGroup) {
    // Logic có kiểm tra (Thêm/Sửa/Xóa/Giao dịch)
    checkBlock = `
    group Kiểm tra
        else Dữ liệu không hợp lệ / Lỗi
            DB --> System : Phản hồi: Lỗi/Không tồn tại
            System --> UI : Thông báo lỗi
            UI -> UI : Hiển thị lỗi
        else Hợp lệ
            DB --> System : Phản hồi: Hợp lệ
            ${
              dbUpdateAction
                ? `System -> DB : ${dbUpdateAction}\n            DB --> System : Xác nhận thành công`
                : ""
            }
            System --> UI : Thông báo thành công
            UI -> UI : Chuyển hướng / Cập nhật UI
    end`;
  } else {
    // Logic tra cứu đơn giản (Search/View)
    checkBlock = `
    DB --> System : Trả về kết quả dữ liệu
    System --> UI : Hiển thị dữ liệu lên màn hình`;
  }

  return `@startuml
skinparam backgroundColor white
actor "${actorName}" as User
boundary "Giao diện" as UI
control "Hệ thống" as System
database "Database" as DB

autonumber

User -> UI : ${userActionFirst}
activate UI
UI --> User : ${uiShow}
deactivate UI

User -> UI : ${userActionSubmit}
activate UI

UI -> System : ${systemRequest}
activate System

System -> DB : ${dbQuery}
activate DB
${checkBlock}

deactivate DB
deactivate System
deactivate UI
@enduml`;
}

// --- ĐỊNH NGHĨA DỮ LIỆU CÁC USE CASE ---
const ucs = {
  uc03: generateSequence(
    "Đăng xuất",
    "Người dùng",
    "Chọn Đăng xuất",
    "Xác nhận đăng xuất?",
    "Xác nhận Đồng ý",
    "Yêu cầu đăng xuất",
    "Kiểm tra Session",
    true,
    "Hủy Session / Token"
  ),
  uc04: generateSequence(
    "Quên mật khẩu",
    "Bạn đọc",
    "Chọn Quên mật khẩu",
    "Form nhập email",
    "Nhập email & Gửi",
    "Yêu cầu reset mật khẩu",
    "Tìm email trong CSDL",
    true,
    "Tạo mã OTP / Token reset"
  ),
  uc05: generateSequence(
    "Tra cứu sách",
    "Bạn đọc",
    "Chọn menu Tra cứu",
    "Giao diện tìm kiếm",
    "Nhập từ khóa & Tìm",
    "Tìm kiếm sách",
    "Select * From Books Where...",
    false
  ),
  uc06: generateSequence(
    "Xem chi tiết",
    "Bạn đọc",
    "Chọn một quyển sách",
    "Giao diện chi tiết sách",
    "Xem thông tin & Bình luận",
    "Lấy thông tin chi tiết",
    "Select * From Books Where ID...",
    false
  ),
  uc07: generateSequence(
    "Gia hạn sách",
    "Bạn đọc",
    "Chọn sách đang mượn",
    "Thông tin phiếu mượn",
    "Nhấn nút Gia hạn",
    "Xử lý gia hạn",
    "Kiểm tra điều kiện gia hạn",
    true,
    "Cập nhật ngày hết hạn mới"
  ),
  uc08: generateSequence(
    "Đặt trước sách",
    "Bạn đọc",
    "Chọn sách muốn đặt",
    "Form đặt trước",
    "Xác nhận Đặt trước",
    "Xử lý đặt trước",
    "Kiểm tra sách có sẵn?",
    true,
    "Tạo phiếu đặt trước"
  ),
  uc09: generateSequence(
    "Đánh giá sách",
    "Bạn đọc",
    "Vào trang chi tiết",
    "Form đánh giá",
    "Nhập sao & Review",
    "Gửi đánh giá",
    "Kiểm tra quyền đánh giá",
    true,
    "Lưu đánh giá vào CSDL"
  ),
  uc10: generateSequence(
    "Thanh toán phạt",
    "Thủ thư",
    "Tra cứu độc giả nợ",
    "Thông tin phiếu phạt",
    "Thu tiền & Xác nhận",
    "Xử lý thanh toán",
    "Kiểm tra số tiền nợ",
    true,
    "Cập nhật trạng thái phiếu phạt"
  ),
  uc11: generateSequence(
    "Lịch sử mượn trả",
    "Bạn đọc",
    "Vào trang cá nhân",
    "Menu Lịch sử",
    "Chọn xem lịch sử",
    "Lấy danh sách phiếu",
    "Select * From Loans Where User...",
    false
  ),
  uc12: generateSequence(
    "Cập nhật thông tin",
    "Người dùng",
    "Vào trang Profile",
    "Form thông tin cá nhân",
    "Sửa dữ liệu & Lưu",
    "Yêu cầu cập nhật",
    "Kiểm tra dữ liệu nhập",
    true,
    "Update User Set..."
  ),
  uc13: generateSequence(
    "Lập phiếu mượn",
    "Thủ thư",
    "Quét mã sách & Thẻ",
    "Thông tin phiếu mượn",
    "Xác nhận Mượn",
    "Tạo phiếu mượn",
    "Kiểm tra (Sách còn? Thẻ khoá?)",
    true,
    "Insert Into Loans..."
  ),
  uc14: generateSequence(
    "Quản lý sách",
    "Thủ thư",
    "Vào trang quản lý sách",
    "Danh sách sách",
    "Thêm/Sửa sách",
    "Cập nhật kho sách",
    "Validata dữ liệu sách",
    true,
    "Insert/Update Books..."
  ),
  uc15: generateSequence(
    "Quản lý bạn đọc",
    "Thủ thư",
    "Vào trang QL Bạn đọc",
    "Danh sách độc giả",
    "Duyệt/Khoá tài khoản",
    "Cập nhật trạng thái",
    "Kiểm tra độc giả",
    true,
    "Update Readers Set Status..."
  ),
  uc16: generateSequence(
    "Tình trạng sách",
    "Thủ thư",
    "Tra cứu mã sách",
    "Thông tin trạng thái",
    "Cập nhật (Hỏng/Mất)",
    "Cập nhật trạng thái",
    "Kiểm tra sách tồn tại",
    true,
    "Update BookStatus..."
  ),
  uc17: generateSequence(
    "Xử lý quá hạn",
    "Hệ thống (Auto)",
    "Chạy Cron Job",
    "Danh sách quá hạn",
    "Tính phí phạt",
    "Tính toán vi phạm",
    "Quét phiếu quá hạn",
    true,
    "Tạo phiếu phạt & Khoá thẻ"
  ),
  uc18: generateSequence(
    "Thống kê",
    "Admin",
    "Vào trang Thống kê",
    "Dashboard biểu đồ",
    "Chọn mốc thời gian",
    "Yêu cầu số liệu",
    "Query Aggregate Data",
    false
  ),
  uc19: generateSequence(
    "Quản lý tài khoản",
    "Admin",
    "Vào module User",
    "Danh sách nhân viên",
    "Cấp/Thu hồi quyền",
    "Cập nhật phân quyền",
    "Kiểm tra quyền Admin",
    true,
    "Update Roles..."
  ),
  uc20: generateSequence(
    "Phân quyền",
    "Admin",
    "Chọn nhóm quyền",
    "Danh sách chức năng",
    "Tích chọn quyền hạn",
    "Lưu cấu hình quyền",
    "Kiểm tra logic quyền",
    true,
    "Save Permisisons..."
  ),
  uc21: generateSequence(
    "Cấu hình hệ thống",
    "Admin",
    "Vào trang Cấu hình",
    "Form tham số (Tiền phạt..)",
    "Sửa tham số & Lưu",
    "Lưu cấu hình",
    "Validate tham số",
    true,
    "Update Configs..."
  ),
  uc22: generateSequence(
    "Xuất báo cáo",
    "Admin",
    "Chọn loại báo cáo",
    "Preview báo cáo",
    "Nhấn nút Xuất Excel/PDF",
    "Tạo file báo cáo",
    "Lấy dữ liệu báo cáo",
    (checkBlock = false)
  ),
};

// --- LOGIC THAY THẾ TRONG HTML ---
let updatedCount = 0;

// Regex tìm khối Sequence Diagram:
// Tìm <div id="ucXX"> ... Tìm đến <h4>Sequence Diagram</h4> ... Tìm đến <img ... data-uml='CODE'>
// Vì regex lookahead phức tạp, ta sẽ split file theo từng UC ID để xử lý an toàn hơn.

Object.keys(ucs).forEach((ucId) => {
  const newUml = ucs[ucId];

  // Tìm vị trí bắt đầu của UC
  const ucStartRegex = new RegExp(`<div id="${ucId}"`, "i");
  const match = htmlContent.match(ucStartRegex);

  if (match) {
    const startIndex = match.index;
    // Tìm vị trí kết thúc của UC (hoặc bắt đầu UC tiếp theo)
    const nextUcMatch = htmlContent
      .substring(startIndex + 1)
      .match(/<div id="uc/i);
    const endIndex = nextUcMatch
      ? startIndex + 1 + nextUcMatch.index
      : htmlContent.length;

    let ucBlock = htmlContent.substring(startIndex, endIndex);

    // Tìm và thay thế phần data-uml của Sequence Diagram trong khối này
    // Giả sử Sequence Diagram là thẻ img thứ 2 hoặc thẻ img nằm sau chữ "Sequence Diagram"

    // Cách an toàn: Tìm chuỗi "Sequence Diagram", sau đó tìm thẻ img data-uml gần nhất
    let seqHeaderIndex = ucBlock.indexOf(">Sequence Diagram<");
    if (seqHeaderIndex !== -1) {
      const blockAfterHeader = ucBlock.substring(seqHeaderIndex);

      // Tìm data-uml='...code...'
      // Regex bắt nội dung trong data-uml='...'
      // Lưu ý: data-uml có thể chứa ký tự xuống dòng
      const umlRegex = /data-uml='([^']+)'/;
      const umlMatch = blockAfterHeader.match(umlRegex);

      if (umlMatch) {
        // Thay thế trong blockAfterHeader trước
        const oldUmlCode = umlMatch[1];
        // Thực hiện replace string
        const newBlockAfterHeader = blockAfterHeader.replace(
          oldUmlCode,
          newUml
        );

        // Ghép lại toàn bộ file
        const newUcBlock =
          ucBlock.substring(0, seqHeaderIndex) + newBlockAfterHeader;

        // Thay thế khối UC cũ bằng khối UC mới trong toàn bộ nội dung
        htmlContent = htmlContent.replace(ucBlock, newUcBlock);
        updatedCount++;
        console.log(`Updated Sequence for ${ucId}`);
      } else {
        console.log(
          `Warning: No data-uml found for Sequence Diagram in ${ucId}`
        );
      }
    } else {
      console.log(`Warning: Sequence Diagram header not found in ${ucId}`);
    }
  }
});

fs.writeFileSync(filePath, htmlContent, "utf8");
console.log(
  `\nHoàn tất! Đã cập nhật ${updatedCount} Sequence Diagrams theo cấu trúc chuẩn.`
);
