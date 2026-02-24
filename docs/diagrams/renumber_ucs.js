const fs = require("fs");
const path = require("path");

const filePaths = [
  path.join(__dirname, "viewer_complete.html"),
  path.join(__dirname, "update_ucs.js"),
  path.join(__dirname, "update_usecases_diagrams.js"),
  path.join(__dirname, "update_sequences_v2.js"),
  path.join(__dirname, "update_activity_diagrams.js"),
];

// Define mapping Old -> New
// Order matters! If we replace uc09 -> uc10 immediately, then we might replace the new uc10 -> uc11.
// So we must process in reverse order or use unique placeholders.
// Reverse order:
// uc22 -> uc23
// uc21 -> uc22
// ...
// uc09 -> uc10
// uc23 -> uc09 (The odd one out)

// Let's create a specific chain.
const shiftMap = [];
for (let i = 22; i >= 9; i--) {
  let oldNum = i < 10 ? "0" + i : "" + i;
  let newNum = i + 1 < 10 ? "0" + (i + 1) : "" + (i + 1);
  shiftMap.push({
    old: `uc${oldNum}`,
    new: `uc${newNum}`,
    oldLbl: `${i}.`,
    newLbl: `${i + 1}.`,
    oldCode: `UC0${oldNum}`,
    newCode: `UC0${newNum}`,
  });
}
// Add the moved one
shiftMap.push({
  old: "uc23",
  new: "uc09",
  oldLbl: "23.",
  newLbl: "9.",
  oldCode: "UC023",
  newCode: "UC009",
});

function processContent(content) {
  // 1. Placeholder phase: Replace all target keys with placeholders
  // This defines what we are looking for.
  // We are looking for:
  // - id="ucXX"
  // - href="#ucXX"
  // - ucs.ucXX or ucXX: (in JS)
  // - UCXX: (Text)
  // - UC0XX (Code)
  // - XX.Tên (Navbar label)

  // To ignore collisions, we transform OLD -> PLACEHOLDER first for ALL, then PLACEHOLDER -> NEW

  let processed = content;

  // Create placeholders
  shiftMap.forEach((item) => {
    item.placeholder = `__PLACEHOLDER_${item.old}__`;
    // ID & anchor & JS key ref
    // Matches: id="uc09", href="#uc09", uc09: , "uc09"
    // We need to be careful not to match "uc09" inside a bigger string like "uc099" if it existed, but here we have fixed format.
    // JS Keys: "uc09:" or "uc09 :"

    // Regex for ID/Hash/Key: (uc\d{2})
    // We replace specific patterns.

    // Pattern 1: ucXX (generic lower case identifier used in IDs, hrefs, js keys)
    // usage: "uc09", '#uc09', id="uc09", uc09:
    processed = processed.replace(new RegExp(item.old, "g"), item.placeholder);

    // Pattern 2: UCXX (Uppercase displayed in Headers)
    // usage: UC09:
    const oldUpper = item.old.toUpperCase(); // UC09
    const placeUpper = item.placeholder.toUpperCase();
    processed = processed.replace(new RegExp(oldUpper, "g"), placeUpper);

    // Pattern 3: Navbar Labels "9.Đánh giá" -> "10.Đánh giá"
    // In file: ">9.Đánh giá<", " 9.Đánh giá"
    // To be safe, look for ">" + item.oldLbl
    // item.oldLbl is "9." or "23."
    // Using simplified replace for labels might be tricky if text varies.
    // Let's rely on specific known context in viewer_complete.html if possible.
    // Navbar format: <a href="#uc09">9.Đánh giá</a>
    // The href is already handled by Pattern 1.
    // Now handling the text content "9." -> "10."
    // We should replace ">9." with ">__PL_LBL_9.__"
    processed = processed.replace(
      new RegExp(`>${item.oldLbl}`, "g"),
      `>__PLLBL_${item.old}__`,
    );

    // Pattern 4: Table Code UC009
    // item.oldCode is UC009.
    // processed = processed.replace(new RegExp(item.oldCode, 'g'), `__PLCODE_${item.old}__`);
    // Actually Pattern 2 (UC09) might catch UC009 if we are not careful?
    // UC09 vs UC009. UC09 is 4 chars. UC009 is 5.
    // My Pattern 2 replace UC09 will turn UC009 into __PLACEHOLDER__09 ? No.
    // UC09 -> PL
    // UC009 -> UC009 (matches UC09 part?) -> No, UC09 matches UC09.
    // UC009 contains UC00 if we look for UC09 it might not match if it is 009.
    // Let's handle UC0XX specifically.

    processed = processed.replace(
      new RegExp(item.oldCode, "g"),
      `__PLCODE_${item.old}__`,
    );
  });

  // 2. Decode Phase
  shiftMap.forEach((item) => {
    // Generic ucXX
    processed = processed.replace(new RegExp(item.placeholder, "g"), item.new);

    // Upper UCXX
    processed = processed.replace(
      new RegExp(item.placeholder.toUpperCase(), "g"),
      item.new.toUpperCase(),
    );

    // Navbar Labels
    processed = processed.replace(
      new RegExp(`>__PLLBL_${item.old}__`, "g"),
      `>${item.newLbl}`,
    );

    // Codes UC0XX
    processed = processed.replace(
      new RegExp(`__PLCODE_${item.old}__`, "g"),
      item.newCode,
    );
  });

  return processed;
}

filePaths.forEach((fp) => {
  if (fs.existsSync(fp)) {
    console.log(`Processing ${path.basename(fp)}...`);
    const content = fs.readFileSync(fp, "utf8");
    const newContent = processContent(content);
    fs.writeFileSync(fp, newContent, "utf8");
  } else {
    console.error(`File not found: ${fp}`);
  }
});
console.log("Renumbering complete.");
