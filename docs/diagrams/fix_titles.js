const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
let html = fs.readFileSync(filePath, "utf8");

// Replace UC08 Title
// User screenshot showed "UC08: Đặt trước sách"
let newHtml = html.replace(
  /<h2 class="section-title">UC08:.*<\/h2>/,
  '<h2 class="section-title">UC08: Mượn sách</h2>',
);

// Replace UC09 Title
// User screenshot showed "UC09: Trả sách trực tuyến"
newHtml = newHtml.replace(
  /<h2 class="section-title">UC09:.*<\/h2>/,
  '<h2 class="section-title">UC09: Trả sách</h2>',
);

// Also update the Copy Text buttons if they are hardcoded
// UC08 Button
newHtml = newHtml.replace(
  /onclick="copyText\('Đặt trước sách'\)"/,
  "onclick=\"copyText('Mượn sách')\"",
);
// UC09 Button
newHtml = newHtml.replace(
  /onclick="copyText\('Trả sách trực tuyến'\)"/,
  "onclick=\"copyText('Trả sách')\"",
);

if (html !== newHtml) {
  fs.writeFileSync(filePath, newHtml, "utf8");
  console.log("Updated Titles for UC08 and UC09.");
} else {
  console.log("No changes made. Titles might haven't matched expected regex.");
  // Debug: Print what we found
  const match08 = html.match(/<h2 class="section-title">UC08:.*<\/h2>/);
  console.log("Found UC08:", match08 ? match08[0] : "Not Found");
  const match09 = html.match(/<h2 class="section-title">UC09:.*<\/h2>/);
  console.log("Found UC09:", match09 ? match09[0] : "Not Found");
}
