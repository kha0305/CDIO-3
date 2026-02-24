const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
let html = fs.readFileSync(filePath, "utf8");

// 1. Extract UC23 Content
const uc23StartMarker = "<!-- UC23: TRẢ SÁCH TRỰC TUYẾN -->";
const uc23Regex =
  /<!-- UC23: TRẢ SÁCH TRỰC TUYẾN -->[\s\S]*?<div id="uc23"[\s\S]*?<\/div>\s*<\/div>/; // Note: there might be nested divs, need to be careful.
// Let's use a safer approach finding the ID
const uc23StartIdx = html.indexOf(uc23StartMarker);
if (uc23StartIdx === -1) {
  console.log("Could not find UC23 marker");
  process.exit(1);
}

// Find end of UC23. It ends before the <script> tag or </div> close of container or body.
// In the file, UC23 was added at the end of container.
// Let's find the closing div of the section.
// The section div starts at `<div id="uc23" class="section">`
const uc23DivStart = html.indexOf('<div id="uc23"', uc23StartIdx);
// We need to match the closing tag. Since there are nested divs, we count.
let cursor = uc23DivStart;
let openDivs = 0;
let foundStart = false;

// Simple parse to find the matching closing div for id="uc23"
while (cursor < html.length) {
  if (html.substring(cursor, cursor + 4) === "<div") {
    openDivs++;
    foundStart = true;
    cursor += 4;
  } else if (html.substring(cursor, cursor + 5) === "</div") {
    openDivs--;
    cursor += 5;
  } else {
    cursor++;
  }

  if (foundStart && openDivs === 0) break;
}

const uc23Block = html.substring(uc23StartIdx, cursor);
console.log("Extracted UC23 Block length:", uc23Block.length);

// Remove UC23 from original spot
let newHtml = html.replace(uc23Block, "");

// Clean up any extra newlines left behind
// logic: empty

// 2. Insert UC23 after UC08
const uc08Marker = "<!-- UC08"; // Find UC08 start
const uc09Marker = "<!-- UC09"; // Find UC09 start to insert before

const uc09Idx = newHtml.indexOf(uc09Marker);
if (uc09Idx === -1) {
  console.log("Could not find UC09 marker to insert before");
  // Backup plan: insert after UC08 div end?
  // Let's try to find UC08 end.
  // .. but UC09 marker is reliable if file structure is consistent.
}

// Insert before UC09
newHtml =
  newHtml.substring(0, uc09Idx) +
  uc23Block +
  "\n\n        " +
  newHtml.substring(uc09Idx);

// 3. Update Navbar
// Current: ... <a href="#uc08">8.Đặt trước</a><a href="#uc09">9.Đánh giá</a> ... <a href="#uc23">23.Trả sách</a>
// Goal: ... <a href="#uc08">8.Mượn sách</a><a href="#uc23">Trả sách</a><a href="#uc09">9.Đánh giá</a> ...

// First, remove the old UC23 link
const nav23Regex = /<a href="#uc23">23.Trả sách<\/a>/;
newHtml = newHtml.replace(nav23Regex, "");

// Insert new UC23 link after UC08 link
// Find UC08 link. It might be named "8.Đặt trước" or "8.Mượn sách" depending on previous edits.
// Based on previous turn, we renamed UC08 but the Navbar text in HTML might still be "8.Đặt trước" if we didn't update it explicitly in HTML (we only updated the JS generator).
// Wait, `update_ucs.js` updates the Content body, not the Navbar.
// The Navbar is static HTML in `viewer_complete.html`.
// I need to update the Navbar labels too!

// Let's find the Navbar section
const navStart = newHtml.indexOf('<div class="nav-bar">');
const navEnd = newHtml.indexOf("</div>", navStart);
let navbar = newHtml.substring(navStart, navEnd);

// Fix Label for UC08
navbar = navbar.replace(">8.Đặt trước<", ">8.Mượn sách<");

// Insert UC23 link after UC08
const link08 = '<a href="#uc08">8.Mượn sách</a>';
const link23 = '<a href="#uc23">23.Trả sách</a>';

if (navbar.includes(link08)) {
  navbar = navbar.replace(link08, link08 + link23);
} else {
  // Maybe it still says '8.Đặt trước'?
  navbar = navbar.replace('<a href="#uc08">8.Đặt trước</a>', link08 + link23);
}

// Replace navbar in HTML
newHtml = newHtml.substring(0, navStart) + navbar + newHtml.substring(navEnd);

fs.writeFileSync(filePath, newHtml, "utf8");
console.log("Reordered UC23 to be after UC08 and updated Navbar.");
