const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
let content = fs.readFileSync(filePath, "utf8");

// Thay thế "alt [Condition]" thành "group Kiểm tra"
// Pattern: newline + spaces + alt + spaces + text
content = content.replace(/(\n\s*)alt\s+[^\n\r]+/g, '$1group "Kiểm tra"');

fs.writeFileSync(filePath, content, "utf8");
console.log("Đã thay thế tất cả 'alt' thành 'group \"Kiểm tra\"'");
