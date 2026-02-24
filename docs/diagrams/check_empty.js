const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
const html = fs.readFileSync(filePath, "utf8");

const emptyMatches = html.match(/data-uml=''/g);
const totalMatches = html.match(/data-uml=/g);

console.log("Total data-uml tags:", totalMatches ? totalMatches.length : 0);
console.log("Empty data-uml tags:", emptyMatches ? emptyMatches.length : 0);

if (emptyMatches) {
  // Find context of empty tags
  let pos = 0;
  while ((pos = html.indexOf("data-uml=''", pos)) !== -1) {
    // Look backwards for id="uc..."
    const lastIdIdx = html.lastIndexOf('id="uc', pos);
    if (lastIdIdx !== -1) {
      const idEnd = html.indexOf('"', lastIdIdx + 4);
      const id = html.substring(lastIdIdx + 4, idEnd);
      // Look for diagram type header nearby
      const headerStart = html.lastIndexOf("<h4", pos);
      let type = "Unknown";
      if (headerStart !== -1) {
        const headerEnd = html.indexOf("</h4>", headerStart);
        type = html.substring(headerStart, headerEnd).replace(/<[^>]*>/g, "");
      }
      console.log(`Empty diagram for ${id}: ${type.trim()}`);
    }
    pos += 1;
  }
}
