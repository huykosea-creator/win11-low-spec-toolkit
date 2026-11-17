/**
 * ==============================================================================
 *  WINDOWS 11 TOOLKIT - IMPORT SCAN & SECURITY AUDIT MODULE
 *  Thẩm định an toàn, đối chiếu SHA-256, quét mã độc AST và nhập vào Lịch Sử Quét
 * ==============================================================================
 */

let currentImportToken = null;
let currentImportFile = null;
let isAuditing = false;

function openImportScanModal() {
  const modal = document.getElementById("modalImportScan");
  if (!modal) return;
  resetImportModalUI();
  modal.classList.add("active");
  modal.style.display = "flex";
}

function closeImportScanModal() {
  const modal = document.getElementById("modalImportScan");
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
  currentImportToken = null;
  currentImportFile = null;
}

function resetImportModalUI() {
  currentImportToken = null;
  currentImportFile = null;
  isAuditing = false;

  const fileInput = document.getElementById("importScanFileInput");
  if (fileInput) fileInput.value = "";

  const dropzone = document.getElementById("importDropzone");
  if (dropzone) {
    dropzone.style.display = "block";
    dropzone.style.background = "#f0f9ff";
    dropzone.style.borderColor = "#0284c7";
  }

  const inspectionSec = document.getElementById("importInspectionSection");
  if (inspectionSec) inspectionSec.style.display = "none";

  const verdictBanner = document.getElementById("importVerdictBanner");
  if (verdictBanner) verdictBanner.style.display = "none";

  const taskPreview = document.getElementById("importTaskPreviewCard");
  if (taskPreview) taskPreview.style.display = "none";

  const btnPreview = document.getElementById("btnPreviewImportReport");
  if (btnPreview) btnPreview.style.display = "none";

  const btnReset = document.getElementById("btnResetImportFile");
  if (btnReset) btnReset.style.display = "none";

  const btnConfirm = document.getElementById("btnConfirmImportTask");
  if (btnConfirm) {
    btnConfirm.disabled = true;
    btnConfirm.style.opacity = "0.5";
    btnConfirm.style.cursor = "not-allowed";
    btnConfirm.innerHTML = `<span>✔ Xác Nhận Thêm Vào Lịch Sử Quét</span>`;
  }
}

function handleImportDragOver(e) {
  e.preventDefault();
  const dropzone = document.getElementById("importDropzone");
  if (dropzone) {
    dropzone.style.background = "#e0f2fe";
    dropzone.style.borderColor = "#0369a1";
  }
}

function handleImportDragLeave(e) {
  e.preventDefault();
  const dropzone = document.getElementById("importDropzone");
  if (dropzone) {
    dropzone.style.background = "#f0f9ff";
    dropzone.style.borderColor = "#0284c7";
  }
}

function handleImportDrop(e) {
  e.preventDefault();
  const dropzone = document.getElementById("importDropzone");
  if (dropzone) {
    dropzone.style.background = "#f0f9ff";
    dropzone.style.borderColor = "#0284c7";
  }

  if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    const file = e.dataTransfer.files[0];
    startSecurityAudit(file);
  }
}

function handleImportFileSelect(e) {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];
    startSecurityAudit(file);
  }
}

const DEFAULT_STEPS = [
  { id: 1, icon: "📦", name: "Cấu trúc tệp tin & Khử tệp nhị phân lạ (.exe, .bat, .vbs)" },
  { id: 2, icon: "🔐", name: "Đối chiếu chữ ký băm mật mã học (SHA-256)" },
  { id: 3, icon: "🛡️", name: "Phân tích cú pháp Script & Mã độc HTML" },
  { id: 4, icon: "📄", name: "Thẩm định an toàn tệp cấu hình JSON (info.json, apps.json)" },
  { id: 5, icon: "🌐", name: "Kiểm tra lá chắn cô lập trình duyệt (Content Security Policy)" },
  { id: 6, icon: "🧪", name: "Tự động làm sạch & Khử trùng mã độc (Auto-Sanitize)" }
];

function renderInitialStepList() {
  const container = document.getElementById("importStepList");
  if (!container) return;

  container.innerHTML = DEFAULT_STEPS.map(s => `
    <div id="import-step-${s.id}" style="display:flex; align-items:flex-start; gap:10px; padding:9px 12px; background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; transition:all 0.3s ease;">
      <div id="import-step-icon-${s.id}" style="font-size:16px; line-height:1; min-width:20px; text-align:center;">
        <span class="step-spinner" style="display:inline-block; animation:spin 1s linear infinite;">⏳</span>
      </div>
      <div style="flex:1;">
        <div style="font-size:12.5px; font-weight:700; color:#334155;" id="import-step-name-${s.id}">
          ${s.name}
        </div>
        <div style="font-size:11px; color:#94a3b8; margin-top:2px;" id="import-step-desc-${s.id}">
          Đang chuẩn bị kiểm tra...
        </div>
      </div>
    </div>
  `).join("");
}

function updateStepStatus(stepId, status, details) {
  const row = document.getElementById(`import-step-${stepId}`);
  const icon = document.getElementById(`import-step-icon-${stepId}`);
  const desc = document.getElementById(`import-step-desc-${stepId}`);
  if (!row || !icon || !desc) return;

  if (status === "passed") {
    row.style.borderColor = "#bbf7d0";
    row.style.background = "#f0fdf4";
    icon.innerHTML = `<span style="color:#16a34a; font-weight:900; font-size:16px;">✔</span>`;
  } else if (status === "fixed") {
    row.style.borderColor = "#bfdbfe";
    row.style.background = "#eff6ff";
    icon.innerHTML = `<span style="color:#0284c7; font-weight:900; font-size:16px;">✨</span>`;
  } else if (status === "warning") {
    row.style.borderColor = "#fef08a";
    row.style.background = "#fefce8";
    icon.innerHTML = `<span style="color:#ca8a04; font-weight:900; font-size:16px;">⚠️</span>`;
  } else if (status === "blocked") {
    row.style.borderColor = "#fecaca";
    row.style.background = "#fef2f2";
    icon.innerHTML = `<span style="color:#dc2626; font-weight:900; font-size:16px;">✖</span>`;
  }

  if (details) {
    desc.innerText = details;
    desc.style.color = (status === "passed" || status === "fixed") ? "#475569" : "#b45309";
  }
}

async function startSecurityAudit(file) {
  if (!file) return;

  const validExts = [".html", ".htm", ".zip"];
  const lowerName = file.name.toLowerCase();
  const isValid = validExts.some(ext => lowerName.endsWith(ext));
  if (!isValid) {
    alert("Định dạng tệp không được hỗ trợ! Vui lòng chọn file báo cáo .html hoặc file gói .zip.");
    return;
  }

  currentImportFile = file;
  isAuditing = true;

  // Ẩn dropzone, hiện vùng tiến trình
  const dropzone = document.getElementById("importDropzone");
  const inspectionSec = document.getElementById("importInspectionSection");
  if (dropzone) dropzone.style.display = "none";
  if (inspectionSec) inspectionSec.style.display = "flex";

  renderInitialStepList();

  const progressBar = document.getElementById("importProgressBar");
  const progressPercent = document.getElementById("importProgressPercent");
  const progressStatus = document.getElementById("importProgressStatusText");

  if (progressStatus) progressStatus.innerText = `🔍 Đang tải lên và thẩm định tệp: ${file.name}...`;

  // Hiệu ứng bước chạy tiến trình
  let pct = 15;
  if (progressBar) progressBar.style.width = pct + "%";
  if (progressPercent) progressPercent.innerText = pct + "%";

  const timer1 = setTimeout(() => {
    pct = 40;
    if (progressBar) progressBar.style.width = pct + "%";
    if (progressPercent) progressPercent.innerText = pct + "%";
    if (progressStatus) progressStatus.innerText = "🔐 Đang băm tính toán SHA-256 & kiểm tra cú pháp AST...";
  }, 400);

  const timer2 = setTimeout(() => {
    pct = 75;
    if (progressBar) progressBar.style.width = pct + "%";
    if (progressPercent) progressPercent.innerText = pct + "%";
    if (progressStatus) progressStatus.innerText = "🛡️ Đang quét phát hiện mã độc nhúng & lá chắn CSP...";
  }, 800);

  try {
    const uploadUrl = `/api/scans/import_verify?filename=${encodeURIComponent(file.name)}`;
    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/octet-stream"
      },
      body: file
    });

    clearTimeout(timer1);
    clearTimeout(timer2);

    const data = await response.json();

    if (progressBar) progressBar.style.width = "100%";
    if (progressPercent) progressPercent.innerText = "100%";

    if (data.status !== "ok" || !data.session) {
      if (progressStatus) progressStatus.innerText = `❌ Lỗi khi thẩm định: ${data.message || "Tệp tin không hợp lệ"}`;
      alert(`Không thể thẩm định tệp tin: ${data.message || "Lỗi không xác định"}`);
      return;
    }

    const session = data.session;
    currentImportToken = session.token;

    if (progressStatus) progressStatus.innerText = "✔ Hoàn tất quá trình thẩm tra an toàn 6 bước!";

    // Cập nhật chi tiết 6 bước từ backend
    if (Array.isArray(session.steps)) {
      session.steps.forEach(s => {
        updateStepStatus(s.id, s.status, s.details);
      });
    }

    // Hiển thị Banner Verdict
    renderVerdictBanner(session);

    // Hiển thị Card Preview thông tin lượt quét
    renderTaskPreviewCard(session);

    // Kích hoạt các nút hành động
    const btnPreview = document.getElementById("btnPreviewImportReport");
    if (btnPreview) btnPreview.style.display = "inline-flex";

    const btnReset = document.getElementById("btnResetImportFile");
    if (btnReset) btnReset.style.display = "inline-flex";

    const btnConfirm = document.getElementById("btnConfirmImportTask");
    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.style.opacity = "1";
      btnConfirm.style.cursor = "pointer";
    }

  } catch (err) {
    clearTimeout(timer1);
    clearTimeout(timer2);
    if (progressStatus) progressStatus.innerText = `❌ Lỗi kết nối máy chủ: ${err.message}`;
    alert(`Lỗi khi gửi tệp lên máy chủ kiểm tra: ${err.message}`);
  }
}

function renderVerdictBanner(session) {
  const banner = document.getElementById("importVerdictBanner");
  if (!banner) return;

  banner.style.display = "flex";

  if (session.verdict === "CLEAN") {
    banner.style.background = "#f0fdf4";
    banner.style.border = "1.5px solid #86efac";
    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:26px;">🟢</span>
        <div>
          <div style="font-size:13.5px; font-weight:800; color:#15803d;">
            AN TOÀN TUYỆT ĐỐI (100% SẠCH SẼ)
          </div>
          <div style="font-size:11.5px; color:#166534; margin-top:2px;">
            Chữ ký toàn vẹn mật mã học SHA-256 hoàn toàn hợp lệ, lá chắn CSP đã kích hoạt và không có mã độc nhúng.
          </div>
        </div>
      </div>
      <span class="badge" style="background:#dcfce7; color:#15803d; border:1px solid #86efac; font-weight:800; padding:4px 10px; font-size:11px;">
        Đạt Chuẩn KTV
      </span>
    `;
  } else if (session.verdict === "SANITIZED") {
    banner.style.background = "#eff6ff";
    banner.style.border = "1.5px solid #93c5fd";
    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:26px;">✨</span>
        <div>
          <div style="font-size:13.5px; font-weight:800; color:#1d4ed8;">
            ĐÃ TỰ ĐỘNG KHỬ ĐỘC THÀNH CÔNG
          </div>
          <div style="font-size:11.5px; color:#1e40af; margin-top:2px;">
            Đã cắt bỏ các đoạn script/iframe lạ do virus chèn thêm, bổ sung lá chắn CSP và tái lập trạng thái sạch 100%.
          </div>
        </div>
      </div>
      <span class="badge" style="background:#dbeafe; color:#1d4ed8; border:1px solid #93c5fd; font-weight:800; padding:4px 10px; font-size:11px;">
        Đã Khử Trùng
      </span>
    `;
  } else {
    banner.style.background = "#fef2f2";
    banner.style.border = "1.5px solid #fca5a5";
    banner.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <span style="font-size:26px;">🛡️</span>
        <div>
          <div style="font-size:13.5px; font-weight:800; color:#b91c1c;">
            PHÁT HIỆN TỆP ĐỘC HẠI ĐÃ ĐƯỢC CÔ LẬP
          </div>
          <div style="font-size:11.5px; color:#991b1b; margin-top:2px;">
            Đã chặn đứng các file thực thi lạ trong gói nén và làm sạch toàn bộ dữ liệu báo cáo trước khi tiếp nhận.
          </div>
        </div>
      </div>
      <span class="badge" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; font-weight:800; padding:4px 10px; font-size:11px;">
        Đã Chặn Tệp Lạ
      </span>
    `;
  }
}

function renderTaskPreviewCard(session) {
  const card = document.getElementById("importTaskPreviewCard");
  if (!card) return;

  card.style.display = "block";
  const meta = session.task_preview || {};

  const custName = meta.customer_name || "Khách vãng lai";
  const compName = meta.computer_name || "DESKTOP-IMPORT";
  const stageLabel = meta.stage_label || "Tiếp Nhận Máy";
  const scanTime = meta.scan_time || "--";
  const appCount = meta.app_count || meta.total_apps || 0;
  const isBanGiao = meta.scan_stage === "ban_giao";

  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; border-bottom:1px solid #e2e8f0; padding-bottom:8px;">
      <div style="display:flex; align-items:center; gap:8px;">
        <span style="font-size:18px;">💻</span>
        <span style="font-size:13.5px; font-weight:800; color:#0f172a;">Thông Tin Lượt Quét Được Tiếp Nhận</span>
      </div>
      <span class="badge ${isBanGiao ? 'badge-primary' : 'badge-warning'}" style="font-weight:700; font-size:11px;">
        ${stageLabel}
      </span>
    </div>
    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:10px; font-size:12px;">
      <div>
        <div style="color:#64748b; font-size:10.5px; text-transform:uppercase; font-weight:700;">Khách Hàng</div>
        <div style="font-weight:700; color:#0f172a; margin-top:2px;">👤 ${custName}</div>
      </div>
      <div>
        <div style="color:#64748b; font-size:10.5px; text-transform:uppercase; font-weight:700;">Tên Máy Tính</div>
        <div style="font-weight:700; color:#0f172a; font-family:var(--font-mono); margin-top:2px;">🖥️ ${compName}</div>
      </div>
      <div>
        <div style="color:#64748b; font-size:10.5px; text-transform:uppercase; font-weight:700;">Thời Gian Ghi Nhận</div>
        <div style="font-weight:600; color:#334155; margin-top:2px;">🕒 ${scanTime}</div>
      </div>
      <div>
        <div style="color:#64748b; font-size:10.5px; text-transform:uppercase; font-weight:700;">Phần Mềm Đã Cài Đặt</div>
        <div style="font-weight:700; color:#0284c7; margin-top:2px;">📦 ${appCount} ứng dụng</div>
      </div>
    </div>
  `;
}

function previewCurrentStagedReport() {
  if (!currentImportToken) return;
  const previewUrl = `/api/scans/import_preview?token=${encodeURIComponent(currentImportToken)}`;
  window.open(previewUrl, "_blank");
}

async function confirmImportTaskToHistory() {
  if (!currentImportToken) return;

  const btnConfirm = document.getElementById("btnConfirmImportTask");
  const prevText = btnConfirm ? btnConfirm.innerHTML : "";
  if (btnConfirm) {
    btnConfirm.disabled = true;
    btnConfirm.innerHTML = `<span>⏳ Đang nạp vào lịch sử...</span>`;
  }

  try {
    const response = await fetch("/api/scans/import_confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: currentImportToken, overwrite: true })
    });

    const data = await response.json();

    if (data.status === "ok" && data.scan_id) {
      // Thông báo thành công
      if (typeof showToast === "function") {
        showToast("✔ Đã thêm lượt quét thành công vào Lịch Sử Quét Máy!");
      } else {
        alert("✔ Đã thêm lượt quét thành công vào Lịch Sử Quét Máy!");
      }

      // Đóng modal
      closeImportScanModal();

      // Cập nhật lại danh sách lịch sử và tự động chọn task mới
      if (typeof loadScanTasksList === "function") {
        loadScanTasksList(data.scan_id);
      } else {
        window.location.reload();
      }
    } else {
      alert(`Không thể thêm vào lịch sử: ${data.message || "Lỗi không xác định"}`);
      if (btnConfirm) {
        btnConfirm.disabled = false;
        btnConfirm.innerHTML = prevText;
      }
    }
  } catch (err) {
    alert(`Lỗi kết nối: ${err.message}`);
    if (btnConfirm) {
      btnConfirm.disabled = false;
      btnConfirm.innerHTML = prevText;
    }
  }
}

/**
 * ==============================================================================
 *  CHỨC NĂNG ĐÓNG GÓI XUẤT FILE ZIP KÈM CHỮ KÝ SHA-256 (SAFE TASK EXPORTER)
 * ==============================================================================
 */

async function exportCurrentTaskZip() {
  let activeId = null;
  if (typeof currentScanTask !== "undefined" && currentScanTask && currentScanTask.scan_id) {
    activeId = currentScanTask.scan_id;
  } else if (typeof scanTasksList !== "undefined" && Array.isArray(scanTasksList) && scanTasksList.length > 0) {
    activeId = scanTasksList[0].scan_id || scanTasksList[0].folder;
  }

  if (!activeId) {
    if (typeof showToast === "function") {
      showToast("⚠️ Vui lòng chọn một lượt quét từ danh sách trước khi xuất!");
    } else {
      alert("Vui lòng chọn một lượt quét từ danh sách trước khi xuất!");
    }
    return;
  }

  openExportZipModal(activeId);
}

function openExportZipModal(scanId) {
  const modal = document.getElementById("modalExportZipResult");
  if (!modal) return;

  const loading = document.getElementById("exportZipLoading");
  const content = document.getElementById("exportZipContent");
  const errBox = document.getElementById("exportZipError");

  if (loading) loading.style.display = "flex";
  if (content) content.style.display = "none";
  if (errBox) errBox.style.display = "none";
  modal.classList.add("active");
  modal.style.display = "flex";

  fetch(`/api/scans/export_zip?id=${encodeURIComponent(scanId)}`)
    .then(res => res.json())
    .then(data => {
      if (loading) loading.style.display = "none";
      if (data && data.status === "ok") {
        renderExportZipSuccess(data);
      } else {
        showExportZipError(data.message || "Không thể đóng gói file zip.");
      }
    })
    .catch(err => {
      if (loading) loading.style.display = "none";
      showExportZipError(err.message || "Lỗi kết nối máy chủ");
    });
}

function closeExportZipModal() {
  const modal = document.getElementById("modalExportZipResult");
  if (modal) {
    modal.classList.remove("active");
    modal.style.display = "none";
  }
}

function showExportZipError(msg) {
  const errBox = document.getElementById("exportZipError");
  if (errBox) {
    errBox.innerHTML = `⚠️ <b>Lỗi Đóng Gói:</b> ${msg}`;
    errBox.style.display = "block";
  }
}

function renderExportZipSuccess(data) {
  const content = document.getElementById("exportZipContent");
  if (!content) return;
  content.style.display = "block";

  const elName = document.getElementById("exportZipName");
  if (elName) elName.textContent = data.zip_name || "Gói_Báo_Cáo.zip";

  const elSize = document.getElementById("exportZipSize");
  if (elSize) elSize.textContent = data.zip_size_human || "N/A";

  const elFiles = document.getElementById("exportZipFilesCount");
  if (elFiles) elFiles.textContent = `${data.file_count || 0} tệp`;

  const elRatio = document.getElementById("exportZipRatio");
  if (elRatio) elRatio.textContent = `-${data.ratio_percent || 0}%`;

  const elShaReport = document.getElementById("exportZipShaReport");
  if (elShaReport) elShaReport.textContent = data.sha256_html || "(Không tìm thấy report.html)";

  const elShaZip = document.getElementById("exportZipShaZip");
  if (elShaZip) elShaZip.textContent = data.sha256_zip || "N/A";

  const btnDl = document.getElementById("btnDownloadExportedZip");
  if (btnDl && data.download_url) {
    btnDl.href = data.download_url;
    btnDl.setAttribute("download", data.zip_name);
  }
}

function copyExportHash(elementId, btnElement) {
  const target = document.getElementById(elementId);
  if (!target) return;
  const text = target.textContent.trim();
  if (!text || text.startsWith("---")) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      showCopyHashFeedback(btnElement);
    }).catch(() => {
      fallbackCopyText(text, btnElement);
    });
  } else {
    fallbackCopyText(text, btnElement);
  }
}

function fallbackCopyText(text, btnElement) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    document.execCommand("copy");
    showCopyHashFeedback(btnElement);
  } catch (e) {
    alert("Đã chọn mã: " + text);
  }
  document.body.removeChild(ta);
}

function showCopyHashFeedback(btnElement) {
  if (!btnElement) return;
  const originalHtml = btnElement.innerHTML;
  btnElement.innerHTML = `✔ Đã Chép!`;
  btnElement.style.background = "#10b981";
  btnElement.style.color = "#ffffff";
  btnElement.style.borderColor = "#059669";
  setTimeout(() => {
    btnElement.innerHTML = originalHtml;
    btnElement.style.background = "";
    btnElement.style.color = "";
    btnElement.style.borderColor = "";
  }, 1800);
}

// Tự động kích hoạt khi có tham số show_export_zip hoặc hash #export-zip
function checkAutoExportZip() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("show_export_zip") === "1" || (window.location.hash && window.location.hash.includes("export-zip"))) {
    let tid = (typeof currentScanTask !== "undefined" && currentScanTask && currentScanTask.scan_id) || "User_TiepNhan_DESKTOP-SV8JIJQ_20261014_052223";
    openExportZipModal(tid);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", checkAutoExportZip);
} else {
  checkAutoExportZip();
}


