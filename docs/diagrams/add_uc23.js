const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "viewer_complete.html");
let html = fs.readFileSync(filePath, "utf8");

// Define new UC HTML structure
const uc23Html = `
        <!-- UC23: TRẢ SÁCH TRỰC TUYẾN -->
        <div id="uc23" class="section">
            <div class="section-header">
                <div style="display: flex; align-items: center; gap: 15px; flex-wrap: wrap;">
                    <h2 class="section-title">UC23: Trả sách trực tuyến</h2>
                    <span class="badge badge-reader">Bạn đọc</span>
                </div>
                <div class="copy-buttons" style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button onclick="copyText('Trả sách trực tuyến')" class="copy-btn" title="Copy tên chức năng">
                        Copy Tên
                    </button>
                    <button onclick="copyText(document.getElementById('uc23-desc').innerText)" class="copy-btn" title="Copy mô tả">
                        Copy Mô tả
                    </button>
                </div>
            </div>
            
            <!-- Mô tả chức năng dạng bảng -->
            <div class="function-description" id="uc23-desc" style="margin-bottom: 20px;">
                <!-- Content will be populated by update_ucs.js -->
                <table class="desc-table"></table>
            </div>

            <div class="grid">
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0; color: #475569; border-left: 4px solid var(--primary); padding-left: 10px; font-size: 0.95rem;">Use Case Diagram</h4>
                        <button onclick="copyImageFromCard(this)" class="copy-img-btn" title="Copy ảnh sơ đồ">
                            Copy Ảnh
                        </button>
                    </div>
                    <img class="plantuml-img" data-uml=''>
                </div>
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0; color: #475569; border-left: 4px solid var(--primary); padding-left: 10px; font-size: 0.95rem;">Activity Diagram</h4>
                        <button onclick="copyImageFromCard(this)" class="copy-img-btn" title="Copy ảnh sơ đồ">
                            Copy Ảnh
                        </button>
                    </div>
                    <img class="plantuml-img" data-uml=''>
                </div>
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h4 style="margin: 0; color: #475569; border-left: 4px solid var(--primary); padding-left: 10px; font-size: 0.95rem;">Sequence Diagram</h4>
                        <button onclick="copyImageFromCard(this)" class="copy-img-btn" title="Copy ảnh sơ đồ">
                            Copy Ảnh
                        </button>
                    </div>
                    <img class="plantuml-img" data-uml=''>
                </div>
            </div>
        </div>
`;

if (html.includes('id="uc23"')) {
  console.log("UC23 already exists.");
} else {
  // Find where the container ends (</div> just before <script>)
  const scriptStart = html.indexOf("<script>", html.length - 20000); // Search from end
  const lastDiv = html.lastIndexOf("</div>", scriptStart);

  if (lastDiv !== -1) {
    html = html.substring(0, lastDiv) + uc23Html + html.substring(lastDiv);

    // Update Navbar
    const navbarEnd = html.indexOf('<a href="#uc22">22.Báo cáo</a>');
    if (navbarEnd !== -1) {
      const navbarInsert = `<a href="#uc23">23.Trả sách</a>`;
      html = html.replace(
        '<a href="#uc22">22.Báo cáo</a>',
        '<a href="#uc22">22.Báo cáo</a>' + navbarInsert,
      );
    }

    fs.writeFileSync(filePath, html, "utf8");
    console.log("Added UC23 structure to viewer_complete.html");
  } else {
    console.error("Could not find insertion point.");
  }
}
