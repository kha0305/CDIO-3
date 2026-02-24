// Script to update all Use Cases with table format + copy buttons for each row
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
let html = fs.readFileSync(filePath, "utf8");

// UC data with table format
const ucData = {
  uc01: {
    code: "UC001",
    name: "Đăng ký",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc bạn đọc đăng ký tài khoản mới để sử dụng dịch vụ thư viện",
    actorSteps:
      "1. Truy cập trang đăng ký\n2. Nhập thông tin cá nhân (họ tên, email, mật khẩu)\n3. Nhấn nút Đăng ký",
    systemSteps:
      "4. Kiểm tra định dạng thông tin\n5. Kiểm tra email đã tồn tại chưa\n6. Tạo tài khoản mới\n7. Hiển thị thông báo thành công",
    preCondition: "Bạn đọc chưa có tài khoản trong hệ thống",
    postCondition: "Tài khoản bạn đọc được tạo thành công",
  },
  uc02: {
    code: "UC002",
    name: "Đăng nhập",
    actor: "Bạn đọc/ Thủ thư/ Admin",
    desc: "Use case mô tả việc người dùng đăng nhập vào hệ thống",
    actorSteps:
      "1. Truy cập trang đăng nhập\n2. Nhập tên đăng nhập và mật khẩu\n3. Nhấn nút Đăng nhập",
    systemSteps:
      "4. Kiểm tra tài khoản tồn tại\n5. Xác thực mật khẩu\n6. Tạo phiên đăng nhập (JWT Token)\n7. Chuyển hướng đến trang chủ theo vai trò",
    preCondition: "Người dùng đã có tài khoản trong hệ thống",
    postCondition: "Người dùng được xác thực và đăng nhập thành công",
  },
  uc03: {
    code: "UC003",
    name: "Đăng xuất",
    actor: "Bạn đọc/ Thủ thư/ Admin",
    desc: "Use case mô tả việc đăng xuất khỏi hệ thống",
    actorSteps: "1. Chọn chức năng đăng xuất",
    systemSteps:
      "2. Hệ thống đăng xuất tài khoản người dùng ra khỏi hệ thống\n3. Hệ thống quay lại trang đăng nhập",
    preCondition: "Đã đăng nhập",
    postCondition: "Không có",
  },
  uc04: {
    code: "UC004",
    name: "Quên mật khẩu",
    actor: "Bạn đọc/ Thủ thư/ Admin",
    desc: "Use case mô tả việc khôi phục mật khẩu khi người dùng quên",
    actorSteps:
      "1. Truy cập trang quên mật khẩu\n2. Nhập email đã đăng ký\n3. Click link reset trong email\n4. Nhập mật khẩu mới",
    systemSteps:
      "5. Kiểm tra email tồn tại\n6. Tạo token reset\n7. Gửi email kèm link reset\n8. Cập nhật mật khẩu mới",
    preCondition: "Người dùng có tài khoản với email hợp lệ",
    postCondition: "Mật khẩu được đặt lại thành công",
  },
  uc05: {
    code: "UC005",
    name: "Tra cứu sách",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc tìm kiếm sách trong thư viện",
    actorSteps:
      "1. Nhập từ khóa tìm kiếm\n2. Chọn bộ lọc (thể loại, tác giả)\n3. Xem kết quả",
    systemSteps:
      "4. Tìm kiếm sách theo tiêu chí\n5. Lọc kết quả theo bộ lọc\n6. Hiển thị danh sách sách phù hợp",
    preCondition: "Không yêu cầu",
    postCondition: "Hiển thị danh sách sách phù hợp với từ khóa",
  },
  uc06: {
    code: "UC006",
    name: "Xem chi tiết sách",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc xem thông tin chi tiết của một quyển sách",
    actorSteps: "1. Chọn sách từ danh sách\n2. Click xem chi tiết",
    systemSteps:
      "3. Hiển thị thông tin sách (tên, tác giả, ISBN...)\n4. Hiển thị tình trạng sách\n5. Hiển thị đánh giá từ người đọc",
    preCondition: "Đã đăng nhập",
    postCondition: "Hiển thị đầy đủ thông tin chi tiết sách",
  },
  uc07: {
    code: "UC007",
    name: "Gia hạn mượn",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc gia hạn thời gian mượn sách",
    actorSteps:
      "1. Xem sách đang mượn\n2. Chọn sách cần gia hạn\n3. Nhấn nút Gia hạn",
    systemSteps:
      "4. Kiểm tra số lần gia hạn\n5. Kiểm tra có người đặt trước không\n6. Cập nhật ngày trả mới (+14 ngày)\n7. Thông báo thành công",
    preCondition: "Đã đăng nhập, đang mượn sách, chưa gia hạn tối đa",
    postCondition: "Ngày trả sách được cập nhật thêm 14 ngày",
  },
  uc08: {
    code: "UC008",
    name: "Mượn sách",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc bạn đọc đăng ký mượn sách trực tuyến",
    actorSteps: "1. Tìm sách cần mượn\n2. Click nút Mượn sách",
    systemSteps:
      "3. Kiểm tra tình trạng sách\n4. Tạo yêu cầu mượn\n5. Gửi thông báo xác nhận",
    preCondition: "Đã đăng nhập, sách còn sẵn",
    postCondition: "Yêu cầu mượn được ghi nhận",
  },
  uc10: {
    code: "UC010",
    name: "Đánh giá sách",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc đánh giá và viết nhận xét về sách",
    actorSteps:
      "1. Xem chi tiết sách đã mượn\n2. Nhập số sao (1-5)\n3. Viết nhận xét\n4. Gửi đánh giá",
    systemSteps:
      "5. Kiểm tra đã mượn sách chưa\n6. Lưu đánh giá\n7. Cập nhật điểm trung bình sách",
    preCondition: "Đã đăng nhập và đã từng mượn sách đó",
    postCondition: "Đánh giá được lưu và hiển thị",
  },
  uc11: {
    code: "UC011",
    name: "Thanh toán phạt",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc thanh toán các khoản phạt",
    actorSteps:
      "1. Xem danh sách phiếu phạt\n2. Chọn phiếu cần thanh toán\n3. Chọn phương thức thanh toán\n4. Xác nhận thanh toán",
    systemSteps:
      "5. Hiển thị chi tiết phiếu phạt\n6. Xử lý thanh toán\n7. Cập nhật trạng thái: Đã thanh toán",
    preCondition: "Đã đăng nhập, có phiếu phạt chưa thanh toán",
    postCondition: "Phiếu phạt được đánh dấu đã thanh toán",
  },
  uc12: {
    code: "UC012",
    name: "Xem lịch sử mượn",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc xem lịch sử mượn/trả sách",
    actorSteps: "1. Truy cập Lịch sử mượn\n2. Chọn bộ lọc theo thời gian",
    systemSteps:
      "3. Hiển thị sách đang mượn\n4. Hiển thị lịch sử đã trả\n5. Cho phép gia hạn từ danh sách",
    preCondition: "Đã đăng nhập",
    postCondition: "Hiển thị đầy đủ lịch sử mượn/trả sách",
  },
  uc13: {
    code: "UC013",
    name: "Cập nhật thông tin cá nhân",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc cập nhật thông tin cá nhân",
    actorSteps: "1. Truy cập Hồ sơ\n2. Chỉnh sửa thông tin\n3. Lưu thay đổi",
    systemSteps:
      "4. Xác thực thông tin\n5. Cập nhật vào cơ sở dữ liệu\n6. Thông báo thành công",
    preCondition: "Đã đăng nhập",
    postCondition: "Thông tin cá nhân được cập nhật thành công",
  },
  uc14: {
    code: "UC014",
    name: "Lập phiếu mượn",
    actor: "Thủ thư",
    desc: "Use case mô tả việc tạo phiếu mượn sách cho bạn đọc",
    actorSteps:
      "1. Nhập mã bạn đọc\n2. Nhập mã sách cần mượn\n3. Xác nhận tạo phiếu",
    systemSteps:
      "4. Kiểm tra thẻ bạn đọc còn hiệu lực\n5. Kiểm tra sách còn sẵn\n6. Tạo phiếu mượn\n7. Cập nhật số lượng sách",
    preCondition: "Thủ thư đã đăng nhập, bạn đọc có thẻ hợp lệ, sách còn sẵn",
    postCondition: "Phiếu mượn được tạo, số lượng sách giảm",
  },
  uc15: {
    code: "UC015",
    name: "Quản lý sách",
    actor: "Thủ thư",
    desc: "Use case mô tả việc quản lý danh mục sách trong thư viện",
    actorSteps: "1. Truy cập Quản lý sách\n2. Thêm/Sửa/Xóa sách",
    systemSteps:
      "3. Xác thực thông tin sách\n4. Cập nhật cơ sở dữ liệu\n5. Thông báo kết quả",
    preCondition: "Thủ thư đã đăng nhập",
    postCondition: "Danh mục sách được cập nhật",
  },
  uc16: {
    code: "UC016",
    name: "Quản lý bạn đọc",
    actor: "Thủ thư",
    desc: "Use case mô tả việc quản lý thông tin và thẻ bạn đọc",
    actorSteps: "1. Truy cập Quản lý bạn đọc\n2. Thêm/Sửa/Khóa thẻ bạn đọc",
    systemSteps:
      "3. Xác thực thông tin\n4. Cập nhật trạng thái thẻ\n5. Thông báo kết quả",
    preCondition: "Thủ thư đã đăng nhập",
    postCondition: "Thông tin bạn đọc được cập nhật",
  },
  uc17: {
    code: "UC017",
    name: "Cập nhật trạng thái sách",
    actor: "Thủ thư",
    desc: "Use case mô tả việc cập nhật trạng thái của từng bản sách",
    actorSteps:
      "1. Tìm sách cần cập nhật\n2. Chọn trạng thái mới (Hư hỏng/Mất/Thanh lý/Khả dụng)",
    systemSteps: "3. Cập nhật trạng thái sách\n4. Thông báo thành công",
    preCondition: "Thủ thư đã đăng nhập",
    postCondition: "Trạng thái sách được cập nhật",
  },
  uc18: {
    code: "UC018",
    name: "Xử lý quá hạn",
    actor: "Thủ thư",
    desc: "Use case mô tả việc quản lý các trường hợp mượn sách quá hạn",
    actorSteps: "1. Xem danh sách quá hạn\n2. Chọn gửi nhắc nhở hoặc tạo phạt",
    systemSteps:
      "3. Tính tiền phạt theo số ngày\n4. Gửi thông báo cho bạn đọc\n5. Tạo phiếu phạt nếu cần",
    preCondition: "Thủ thư đã đăng nhập, có phiếu mượn quá hạn",
    postCondition: "Bạn đọc được thông báo, phiếu phạt được tạo",
  },
  uc19: {
    code: "UC019",
    name: "Thống kê/Báo cáo",
    actor: "Thủ thư",
    desc: "Use case mô tả việc xem các báo cáo thống kê hoạt động thư viện",
    actorSteps:
      "1. Truy cập Thống kê\n2. Chọn loại thống kê và khoảng thời gian\n3. Xuất báo cáo nếu cần",
    systemSteps:
      "4. Tổng hợp dữ liệu\n5. Hiển thị biểu đồ\n6. Xuất file Excel/PDF",
    preCondition: "Thủ thư đã đăng nhập",
    postCondition: "Hiển thị biểu đồ và dữ liệu thống kê",
  },
  uc20: {
    code: "UC020",
    name: "Quản lý tài khoản",
    actor: "Admin",
    desc: "Use case mô tả việc quản lý tài khoản Thủ thư và Bạn đọc",
    actorSteps:
      "1. Truy cập Quản lý tài khoản\n2. Chọn loại tài khoản (Thủ thư/Bạn đọc)\n3. Thêm/Khóa/Mở khóa tài khoản",
    systemSteps:
      "4. Xác thực thông tin\n5. Tạo tài khoản mới (nếu thêm)\n6. Gửi email thông báo\n7. Cập nhật trạng thái tài khoản",
    preCondition: "Admin đã đăng nhập",
    postCondition: "Tài khoản được tạo/cập nhật thành công",
  },
  uc21: {
    code: "UC021",
    name: "Phân quyền tài khoản",
    actor: "Admin",
    desc: "Use case mô tả việc quản lý quyền hạn của các tài khoản",
    actorSteps:
      "1. Truy cập Phân quyền\n2. Chọn tài khoản\n3. Gán hoặc thu hồi quyền",
    systemSteps:
      "4. Hiển thị quyền hiện tại\n5. Cập nhật quyền mới\n6. Thông báo thành công",
    preCondition: "Admin đã đăng nhập",
    postCondition: "Quyền hạn tài khoản được cập nhật",
  },
  uc22: {
    code: "UC022",
    name: "Cấu hình quy định hệ thống",
    actor: "Admin",
    desc: "Use case mô tả việc cấu hình các quy định hoạt động của thư viện",
    actorSteps:
      "1. Truy cập Cài đặt\n2. Thay đổi các tham số (số sách tối đa, thời hạn mượn, mức phạt...)",
    systemSteps: "3. Xác thực giá trị mới\n4. Lưu cài đặt\n5. Ghi log thay đổi",
    preCondition: "Admin đã đăng nhập",
    postCondition: "Cài đặt hệ thống được cập nhật",
  },
  uc23: {
    code: "UC023",
    name: "Xem báo cáo",
    actor: "Admin",
    desc: "Use case mô tả việc xem các báo cáo tổng hợp về hoạt động hệ thống",
    actorSteps:
      "1. Truy cập Báo cáo\n2. Chọn loại báo cáo\n3. Xuất báo cáo nếu cần",
    systemSteps:
      "4. Tổng hợp dữ liệu Dashboard\n5. Hiển thị biểu đồ thống kê\n6. Xuất file báo cáo",
    preCondition: "Admin đã đăng nhập",
    postCondition: "Hiển thị dashboard với dữ liệu thống kê",
  },
  uc09: {
    code: "UC009",
    name: "Trả sách",
    actor: "Bạn đọc",
    desc: "Use case mô tả việc bạn đọc trả tài liệu thông qua hệ thống trực tuyến",
    actorSteps:
      "1. Truy cập Sách của tôi\n2. Chọn tab Đang mượn\n3. Nhấn nút Trả sách\n4. Xác nhận trả",
    systemSteps:
      "5. Kiểm tra sách\n6. Cập nhật trạng thái Đã trả\n7. Tính phí phạt (nếu có)\n8. Thông báo thành công",
    preCondition: "Đã đăng nhập, có sách đang mượn",
    postCondition: "Sách được trả, trạng thái cập nhật",
  },
};

// CSS for copy button in table row
const copyBtnStyle = `style="padding: 2px 8px; font-size: 0.7rem; background: #6366f1; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px; white-space: nowrap;"`;

// Function to escape text for JS string
function escapeJS(text) {
  return text.replace(/'/g, "\\'").replace(/\n/g, "\\n");
}

// Function to generate table HTML for description with copy buttons
function generateTableHTML(uc, data) {
  return `
            <!-- Mô tả chức năng dạng bảng -->
            <div class="function-description" id="${uc}-desc" style="margin-bottom: 20px;">
                <table class="desc-table" style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f8fafc; width: 150px;">Mã Use Case</td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px;" colspan="2">
                            ${data.code}
                            <button onclick="copyText('${
                              data.code
                            }')" ${copyBtnStyle}>Copy</button>
                        </td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f8fafc;">Tên Use Case</td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px;" colspan="2">
                            ${data.name}
                            <button onclick="copyText('${escapeJS(
                              data.name,
                            )}')" ${copyBtnStyle}>Copy</button>
                        </td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f8fafc;">Tác nhân</td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px;" colspan="2">
                            ${data.actor}
                            <button onclick="copyText('${escapeJS(
                              data.actor,
                            )}')" ${copyBtnStyle}>Copy</button>
                        </td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f8fafc;">Mô tả</td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px;" colspan="2">
                            ${data.desc}
                            <button onclick="copyText('${escapeJS(
                              data.desc,
                            )}')" ${copyBtnStyle}>Copy</button>
                        </td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f8fafc; vertical-align: top;" rowspan="2">Dòng sự kiện</td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f1f5f9; text-align: center; width: 40%;">Tác nhân</td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f1f5f9; text-align: center;">Hệ thống</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; vertical-align: top;">
                            ${data.actorSteps.replace(/\n/g, "<br>")}
                            <br><button onclick="copyText('${escapeJS(
                              data.actorSteps,
                            )}')" ${copyBtnStyle}>Copy</button>
                        </td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; vertical-align: top;">
                            ${data.systemSteps.replace(/\n/g, "<br>")}
                            <br><button onclick="copyText('${escapeJS(
                              data.systemSteps,
                            )}')" ${copyBtnStyle}>Copy</button>
                        </td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f8fafc;">Điều kiện trước</td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px;" colspan="2">
                            ${data.preCondition}
                            <button onclick="copyText('${escapeJS(
                              data.preCondition,
                            )}')" ${copyBtnStyle}>Copy</button>
                        </td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px; font-weight: 600; background: #f8fafc;">Điều kiện sau</td>
                        <td style="border: 1px solid #e2e8f0; padding: 10px 15px;" colspan="2">
                            ${data.postCondition}
                            <button onclick="copyText('${escapeJS(
                              data.postCondition,
                            )}')" ${copyBtnStyle}>Copy</button>
                        </td>
                    </tr>
                </table>
            </div>`;
}

// First, remove all existing description sections and replace with new ones
for (const [uc, data] of Object.entries(ucData)) {
  // Update Copy Tên button - only copy the name (not the full title)
  const copyNameRegex = new RegExp(`copyText\\('UC\\d+: ${data.name}'\\)`, "g");
  html = html.replace(copyNameRegex, `copyText('${data.name}')`);

  // Also catch already updated buttons
  const alreadyUpdatedRegex = new RegExp(`copyText\\('${data.name}'\\)`, "g");
  // No change needed, already correct

  // Find and replace the description section
  const descRegex = new RegExp(
    `<!-- Mô tả chức năng[^>]*-->\\s*<div class="function-description" id="${uc}-desc"[^>]*>[\\s\\S]*?<\\/table>\\s*<\\/div>`,
    "g",
  );

  const newTable = generateTableHTML(uc, data);
  html = html.replace(descRegex, newTable.trim());
}

fs.writeFileSync(filePath, html, "utf8");
console.log("✓ Updated all Use Cases with table format and copy buttons!");
console.log("✓ Each row now has a Copy button to copy its content!");
