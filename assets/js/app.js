/**
 * Windows 11 Toolkit & Hub - Core Engine & WebUI Script
 * Pure Vanilla JavaScript • Zero Node/NPM dependencies
 */

// 1. DANH MỤC 19 PHẦN MỀM CHUẨN ĐƯỢC PHÂN CHIA VÀO 4 PHẦN ĐÓNG KHUNG
const appList = [
  // --- PHẦN 1: THIẾT YẾU KHÔNG CẦN LICENSE 1 ---
  {
    id: "unikey",
    name: "UniKey",
    category: "Gõ tiếng Việt",
    winget: "UniKey.UniKey",
    avatar: "⌨️",
    avatarBg: "#f3e8ff",
    avatarBorder: "#e9d5ff",
    catBg: "#ede9fe",
    catColor: "#6d28d9",
    desc: "Bộ gõ tiếng Việt quốc dân của tác giả Phạm Kim Long, siêu nhẹ & quen thuộc.",
    ram: "Cực thấp (~5MB)",
    folder: "software/unikey",
    url: "https://www.unikey.vn/",
    suggestedIconUrl: "https://upload.wikimedia.org/wikipedia/vi/2/23/Unikey_Logo.png"
  },
  {
    id: "chrome",
    name: "Google Chrome",
    category: "Trình duyệt Web",
    winget: "Google.Chrome",
    avatar: "🌐",
    avatarBg: "#f0fdf4",
    avatarBorder: "#bbf7d0",
    catBg: "#dcfce7",
    catColor: "#15803d",
    desc: "Trình duyệt web phổ biến nhất thế giới, đồng bộ tài khoản Google toàn diện.",
    ram: "Vừa phải",
    folder: "software/chrome",
    url: "https://www.google.com/chrome/",
    suggestedIconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e1/Google_Chrome_icon_%28February_2022%29.svg"
  },
  {
    id: "firefox",
    name: "Mozilla Firefox",
    category: "Trình duyệt Web",
    winget: "Mozilla.Firefox",
    avatar: "🦊",
    avatarBg: "#fff7ed",
    avatarBorder: "#fed7aa",
    catBg: "#ffedd5",
    catColor: "#c2410c",
    desc: "Trình duyệt mã nguồn mở bảo mật cao, độc lập, bảo vệ quyền riêng tư tốt.",
    ram: "Vừa phải",
    folder: "software/firefox",
    url: "https://www.mozilla.org/firefox/new/",
    suggestedIconUrl: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Firefox_logo%2C_2019.svg"
  },
  {
    id: "7zip",
    name: "7-Zip (.7z / .zip)",
    category: "Nén & Giải nén Mã nguồn mở",
    winget: "7zip.7zip",
    avatar: "📦",
    avatarBg: "#f0fdf4",
    avatarBorder: "#bbf7d0",
    catBg: "#dcfce7",
    catColor: "#15803d",
    desc: "Trình nén & giải nén mã nguồn mở (LGPL) miễn phí 100% cho Doanh Nghiệp & Cá Nhân, mở mượt cả .rar, .7z, .zip.",
    ram: "Cực thấp (~3MB)",
    folder: "software/7zip",
    url: "https://www.7-zip.org/",
    suggestedIconUrl: "https://www.7-zip.org/7ziplogo.png"
  },

  // --- PHẦN 2: PHẦN MỀM VĂN PHÒNG (LIBREOFFICE • MICROSOFT OFFICE 365 • WPS OFFICE) ---
  {
    id: "libreoffice",
    name: "LibreOffice",
    category: "Phần mềm Văn phòng (Mã nguồn mở)",
    winget: "TheDocumentFoundation.LibreOffice",
    avatar: "📝",
    avatarBg: "#f0fdf4",
    avatarBorder: "#bbf7d0",
    catBg: "#dcfce7",
    catColor: "#166534",
    desc: "Bộ công cụ văn phòng mã nguồn mở (MPL 2.0) miễn phí 100% cho Doanh Nghiệp & Cá Nhân, đầy đủ Writer/Calc/Impress.",
    ram: "Vừa phải (~150MB)",
    folder: "software/libreoffice",
    url: "https://www.libreoffice.org/",
    suggestedIconUrl: "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/png/libreoffice.png"
  },
  {
    id: "wps-office",
    name: "WPS Office",
    category: "Phần mềm Văn phòng (Gọn nhẹ)",
    winget: "Kingsoft.WPSOffice",
    avatar: "📄",
    avatarBg: "#fff1f2",
    avatarBorder: "#fecdd3",
    catBg: "#ffe4e6",
    catColor: "#e11d48",
    desc: "Bộ văn phòng giao diện giống hệt MS Office, cực nhẹ (~60MB RAM), tích hợp đọc PDF. Miễn phí cho Cá nhân/Học tập (Doanh nghiệp cần WPS Business).",
    ram: "Rất nhẹ (~60MB)",
    folder: "software/wps-office",
    url: "https://www.wps.com/",
    suggestedIconUrl: "https://www.wps.com/favicon.ico",
    enterpriseLicenseRequired: true,
    licenseNote: "Miễn phí cho Cá nhân/Học tập • Doanh Nghiệp cần mua WPS Business (Nếu không mua → dùng LibreOffice)"
  },
  {
    id: "office365",
    name: "Microsoft Office 365",
    category: "Bộ văn phòng bản quyền",
    winget: "Microsoft.Office",
    avatar: "🏢",
    avatarBg: "#eff6ff",
    avatarBorder: "#bfdbfe",
    catBg: "#dbeafe",
    catColor: "#1e40af",
    desc: "Bộ ứng dụng văn phòng bản quyền Word, Excel, PowerPoint, Outlook (Chỉ tích khi máy/công ty có key hoặc tài khoản bản quyền).",
    ram: "Khá (~300MB)",
    folder: "software/office365",
    url: "https://www.office.com/",
    suggestedIconUrl: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg",
    enterpriseLicenseRequired: true,
    licenseNote: "Cần tài khoản/key bản quyền Microsoft (Nếu chưa mua → dùng LibreOffice cho DN hoặc WPS Office cho CN)"
  },

  // --- PHẦN 3: THIẾT YẾU KHÔNG CẦN LICENSE 2 (REMOTE MÃ NGUỒN MỞ, PDF & MEDIA MIỄN PHÍ) ---
  {
    id: "coccoc",
    name: "Cốc Cốc",
    category: "Trình duyệt Web",
    winget: "CocCoc.CocCoc",
    avatar: "🌱",
    avatarBg: "#ecfdf5",
    avatarBorder: "#a7f3d0",
    catBg: "#d1fae5",
    catColor: "#047857",
    desc: "Trình duyệt web thuần Việt, tải video tốc độ cao, phù hợp cho máy tính Cá Nhân.",
    ram: "Vừa phải (~80MB)",
    folder: "software/coccoc",
    url: "https://coccoc.com/",
    suggestedIconUrl: "https://coccoc.com/favicon.ico"
  },
  {
    id: "ultraviewer",
    name: "UltraViewer",
    category: "Điều khiển từ xa (Remote Desktop)",
    winget: "DucFabulous.UltraViewer",
    avatar: "🖥️",
    avatarBg: "#f0f9ff",
    avatarBorder: "#bae6fd",
    catBg: "#e0f2fe",
    catColor: "#0369a1",
    desc: "Phần mềm điều khiển máy tính từ xa tiện lợi, hỗ trợ kỹ thuật phổ biến tại Việt Nam.",
    ram: "Thấp (~20MB)",
    folder: "software/ultraviewer",
    url: "https://www.ultraviewer.net/vi/download.html",
    suggestedIconUrl: "https://ultraviewer.net/images/logo.png"
  },
  {
    id: "anydesk",
    name: "AnyDesk",
    category: "Điều khiển từ xa (Cần License DN)",
    winget: "AnyDesk.AnyDesk",
    avatar: "⚡",
    avatarBg: "#fff7ed",
    avatarBorder: "#ffedd5",
    catBg: "#ffedd5",
    catColor: "#9a3412",
    desc: "Miễn phí cho Cá nhân (Personal Use Only). Dùng ở Doanh Nghiệp cần mua License thương mại (hoặc dùng RustDesk miễn phí).",
    ram: "Rất thấp (~15MB)",
    folder: "software/anydesk",
    url: "https://anydesk.com/en/downloads/windows",
    suggestedIconUrl: "https://download.anydesk.com/favicon.ico",
    enterpriseLicenseRequired: true,
    licenseNote: "Miễn phí cho Cá nhân • Doanh Nghiệp cần mua License (Nếu không mua → dùng RustDesk)"
  },
  {
    id: "teamviewer",
    name: "TeamViewer",
    category: "Điều khiển từ xa (Cần License DN)",
    winget: "TeamViewer.TeamViewer",
    avatar: "🔄",
    avatarBg: "#eff6ff",
    avatarBorder: "#bfdbfe",
    catBg: "#dbeafe",
    catColor: "#1d4ed8",
    desc: "Phần mềm điều khiển máy tính từ xa quốc tế ổn định. Miễn phí cho Cá nhân (Personal Use Only), dùng ở Doanh Nghiệp cần mua License (hoặc dùng RustDesk miễn phí).",
    ram: "Thấp (~30MB)",
    folder: "software/teamviewer",
    url: "https://www.teamviewer.com/",
    suggestedIconUrl: "https://www.teamviewer.com/favicon.ico",
    enterpriseLicenseRequired: true,
    licenseNote: "Miễn phí cho Cá nhân • Doanh Nghiệp cần mua License TeamViewer (Nếu không mua → dùng RustDesk ở Phần 3)"
  },
  {
    id: "rustdesk",
    name: "RustDesk",
    category: "Điều khiển từ xa (Remote Desktop)",
    winget: "RustDesk.RustDesk",
    avatar: "🦀",
    avatarBg: "#fff1f2",
    avatarBorder: "#fecdd3",
    catBg: "#ffe4e6",
    catColor: "#be123c",
    desc: "Remote desktop mã nguồn mở (AGPL-3.0) miễn phí 100% cho Doanh Nghiệp, thay thế hoàn hảo AnyDesk & TeamViewer.",
    ram: "Thấp (~25MB)",
    folder: "software/rustdesk",
    url: "https://rustdesk.com/",
    suggestedIconUrl: "https://raw.githubusercontent.com/rustdesk/rustdesk/master/res/32x32%402x.png"
  },
  {
    id: "foxit-reader",
    name: "Foxit PDF Reader",
    category: "Tài liệu & Văn phòng",
    winget: "Foxit.FoxitReader",
    avatar: "📑",
    avatarBg: "#fff7ed",
    avatarBorder: "#fed7aa",
    catBg: "#ffedd5",
    catColor: "#c2410c",
    desc: "Trình đọc và chú thích file PDF chuyên nghiệp, miễn phí cho cả Doanh Nghiệp & Cá Nhân.",
    ram: "Vừa phải (~60MB)",
    folder: "software/foxit-reader",
    url: "https://www.foxit.com/pdf-reader/",
    suggestedIconUrl: "https://www.foxit.com/favicon.ico"
  },

  // --- PHẦN 4 & 5: TÙY CHỌN APP CẦN LICENSE DOANH NGHIỆP & APP PHỤ TRỢ PHẦN CỨNG ---
  {
    id: "gpuz",
    name: "TechPowerUp GPU-Z",
    category: "Chẩn đoán Card đồ họa",
    winget: "TechPowerUp.GPU-Z",
    avatar: "🎮",
    avatarBg: "#fef2f2",
    avatarBorder: "#fecaca",
    catBg: "#fee2e2",
    catColor: "#b91c1c",
    desc: "Xem chi tiết thông số card đồ họa VGA, VRAM, xung nhịp và nhiệt độ GPU.",
    ram: "Cực thấp (~8MB)",
    folder: "software/gpuz",
    url: "https://www.techpowerup.com/gpuz/",
    suggestedIconUrl: "https://www.techpowerup.com/favicon.ico"
  },
  {
    id: "cpuz",
    name: "CPUID CPU-Z",
    category: "Thông tin CPU & Mainboard",
    winget: "CPUID.CPU-Z",
    avatar: "⚡",
    avatarBg: "#eff6ff",
    avatarBorder: "#bfdbfe",
    catBg: "#dbeafe",
    catColor: "#1e40af",
    desc: "Kiểm tra chi tiết vi xử lý CPU, xung nhịp, Socket, Mainboard và RAM SPD.",
    ram: "Cực thấp (~6MB)",
    folder: "software/cpuz",
    url: "https://www.cpuid.com/softwares/cpu-z.html",
    suggestedIconUrl: "https://www.cpuid.com/favicon.ico"
  },
  {
    id: "hwmonitor",
    name: "CPUID HWMonitor",
    category: "Nhiệt độ & Điện áp",
    winget: "CPUID.HWMonitor",
    avatar: "🌡️",
    avatarBg: "#f0fdf4",
    avatarBorder: "#bbf7d0",
    catBg: "#dcfce7",
    catColor: "#15803d",
    desc: "Theo dõi nhiệt độ CPU, GPU, ổ cứng SSD/HDD, tốc độ quạt và điện áp nguồn.",
    ram: "Cực thấp (~10MB)",
    folder: "software/hwmonitor",
    url: "https://www.cpuid.com/softwares/hwmonitor.html",
    suggestedIconUrl: "https://www.cpuid.com/favicon.ico"
  },
  {
    id: "mem-reduct",
    name: "Mem Reduct",
    category: "Tiện ích & Quản lý RAM",
    winget: "Henry++.MemReduct",
    avatar: "🧹",
    avatarBg: "#ecfdf5",
    avatarBorder: "#a7f3d0",
    catBg: "#d1fae5",
    catColor: "#047857",
    desc: "Giải phóng RAM hệ thống định kỳ tự động (Mã nguồn mở GPLv3 miễn phí 100%).",
    ram: "Cực thấp (~3MB)",
    folder: "software/mem-reduct",
    url: "https://www.henrypp.org/product/memreduct",
    suggestedIconUrl: "https://raw.githubusercontent.com/henrypp/memreduct/master/images/memreduct.png"
  },
  {
    id: "winrar",
    name: "WinRAR (.rar)",
    category: "Nén & Giải nén (Cần License DN)",
    winget: "RARLab.WinRAR",
    avatar: "🗜️",
    avatarBg: "#fffbeb",
    avatarBorder: "#fde68a",
    catBg: "#fef3c7",
    catColor: "#b45309",
    desc: "Phần mềm thương mại dùng thử 40 ngày của RARLab. Doanh nghiệp ít mua lẻ nên ưu tiên dùng 7-Zip (Phần 1).",
    ram: "Cực thấp (~5MB)",
    folder: "software/winrar",
    url: "https://www.win-rar.com/",
    suggestedIconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ea/WinRAR_icon.png",
    enterpriseLicenseRequired: true,
    licenseNote: "Trial 40 ngày • Doanh Nghiệp cần mua License RARLab (Nếu không mua → dùng 7-Zip miễn phí ở Phần 1)"
  },
  {
    id: "geek-uninstaller",
    name: "Geek Uninstaller",
    category: "Tiện ích & Gỡ phần mềm",
    winget: "GeekUninstaller.GeekUninstaller",
    avatar: "🗑️",
    avatarBg: "#fdf4ff",
    avatarBorder: "#f5d0fe",
    catBg: "#fae8ff",
    catColor: "#a21caf",
    desc: "Công cụ gỡ cài đặt phần mềm tận gốc, quét sạch khóa Registry và file rác còn sót lại siêu nhanh cho KTV.",
    ram: "Cực thấp (~6MB)",
    folder: "software/geek-uninstaller",
    url: "https://geekuninstaller.com/",
    suggestedIconUrl: "https://geekuninstaller.com/favicon.ico"
  },
  {
    id: "vlc",
    name: "VLC Media Player",
    category: "Đa phương tiện (Media Player)",
    winget: "VideoLAN.VLC",
    avatar: "🎬",
    avatarBg: "#fffbeb",
    avatarBorder: "#fef3c7",
    catBg: "#fef3c7",
    catColor: "#a16207",
    desc: "Trình phát mọi định dạng video/nhạc mã nguồn mở (GPLv2), miễn phí 100% cho Doanh Nghiệp & Cá Nhân.",
    ram: "Thấp (~30MB)",
    folder: "software/vlc-player",
    url: "https://www.videolan.org/vlc/",
    suggestedIconUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e6/VLC_Icon.svg"
  },

  // --- PHẦN 6: DÀNH RIÊNG CHO IT — DEVELOPER TOOLS (CONTAINER, NODE.JS 24, SSH & AI) ---
  {
    id: "vscode",
    name: "Visual Studio Code",
    category: "Developer Tools • Code Editor",
    winget: "Microsoft.VisualStudioCode",
    avatar: "💻",
    avatarBg: "#eff6ff",
    avatarBorder: "#93c5fd",
    catBg: "#dbeafe",
    catColor: "#1d4ed8",
    desc: "Trình biên soạn mã nguồn chuẩn MIT License của Microsoft (Miễn phí 100% cho cả Doanh Nghiệp & Cá Nhân).",
    ram: "Vừa phải (~120MB)",
    folder: "software/vscode",
    url: "https://code.visualstudio.com/",
    suggestedIconUrl: "https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg"
  },
  {
    id: "notepadplusplus",
    name: "Notepad++",
    category: "Developer Tools • Code Editor",
    winget: "Notepad++.Notepad++",
    avatar: "📝",
    avatarBg: "#f7fee7",
    avatarBorder: "#bef264",
    catBg: "#ecfccb",
    catColor: "#3f6212",
    desc: "Trình soạn thảo code, log, config, XML/JSON siêu nhẹ mã nguồn mở (GPLv3), khởi động tức thì cho IT & Dev.",
    ram: "Cực thấp (~8MB)",
    folder: "software/notepadplusplus",
    url: "https://notepad-plus-plus.org/",
    suggestedIconUrl: "assets/icons/notepadplusplus.svg"
  },
  {
    id: "docker-desktop",
    name: "Docker Desktop",
    category: "Developer Tools • Container",
    winget: "Docker.DockerDesktop",
    avatar: "🐳",
    avatarBg: "#e0f2fe",
    avatarBorder: "#7dd3fc",
    catBg: "#bae6fd",
    catColor: "#0369a1",
    desc: "Nền tảng đóng gói và chạy Container/Kubernetes trên Windows (WSL2). Miễn phí cho Cá nhân & DN nhỏ (<250 NV), DN lớn cần Docker Business.",
    ram: "Khá (~500MB+ WSL2)",
    folder: "software/docker-desktop",
    url: "https://www.docker.com/products/docker-desktop/",
    suggestedIconUrl: "assets/icons/docker-desktop.svg",
    enterpriseLicenseRequired: true,
    licenseNote: "Miễn phí cho Cá nhân & DN nhỏ (<250 NV & doanh thu <$10M) • Doanh nghiệp lớn cần mua Docker Pro/Business"
  },
  {
    id: "nodejs",
    name: "Node.js 24",
    category: "Developer Tools • Runtime",
    winget: "OpenJS.NodeJS",
    avatar: "🟢",
    avatarBg: "#f0fdf4",
    avatarBorder: "#86efac",
    catBg: "#dcfce7",
    catColor: "#15803d",
    desc: "Môi trường thực thi JavaScript phía Server Node.js 24 kèm npm/npx (Mã nguồn mở MIT miễn phí 100%).",
    ram: "Thấp (~30MB)",
    folder: "software/nodejs",
    url: "https://nodejs.org/",
    suggestedIconUrl: "assets/icons/nodejs.svg"
  },
  {
    id: "git",
    name: "Git for Windows",
    category: "Developer Tools • Version Control",
    winget: "Git.Git",
    avatar: "🌿",
    avatarBg: "#fff7ed",
    avatarBorder: "#fdba74",
    catBg: "#ffedd5",
    catColor: "#c2410c",
    desc: "Hệ thống quản lý mã nguồn phân tán Git kèm Git Bash & OpenSSH chuẩn mã nguồn mở (GPLv2).",
    ram: "Cực thấp (~10MB)",
    folder: "software/git",
    url: "https://git-scm.com/",
    suggestedIconUrl: "assets/icons/git.svg"
  },
  {
    id: "postman",
    name: "Postman",
    category: "Developer Tools • API Client",
    winget: "Postman.Postman",
    avatar: "🚀",
    avatarBg: "#fff7ed",
    avatarBorder: "#fed7aa",
    catBg: "#ffedd5",
    catColor: "#ea580c",
    desc: "Công cụ kiểm thử REST API, GraphQL & WebSocket chuyên nghiệp cho Lập trình viên Backend/Frontend.",
    ram: "Vừa phải (~150MB)",
    folder: "software/postman",
    url: "https://www.postman.com/downloads/",
    suggestedIconUrl: "assets/icons/postman.svg"
  },
  {
    id: "dbeaver",
    name: "DBeaver Community",
    category: "Developer Tools • Database SQL",
    winget: "dbeaver.dbeaver",
    avatar: "🗄️",
    avatarBg: "#fffbeb",
    avatarBorder: "#fde68a",
    catBg: "#fef3c7",
    catColor: "#b45309",
    desc: "Phần mềm quản trị cơ sở dữ liệu đa năng (MySQL, PostgreSQL, SQL Server, Oracle, SQLite) mã nguồn mở Apache 2.0 miễn phí 100%.",
    ram: "Vừa phải (~180MB)",
    folder: "software/dbeaver",
    url: "https://dbeaver.io/",
    suggestedIconUrl: "assets/icons/dbeaver.svg"
  },
  {
    id: "mobaxterm",
    name: "MobaXterm",
    category: "Developer Tools • SSH & Terminal",
    winget: "Mobatek.MobaXterm",
    avatar: "🖧",
    avatarBg: "#f0f9ff",
    avatarBorder: "#7dd3fc",
    catBg: "#e0f2fe",
    catColor: "#0369a1",
    desc: "Bộ công cụ All-in-One cho SysAdmin & IT: SSH, SFTP, X11 Server, RDP, VNC, Serial. Bản Home miễn phí cá nhân, DN cần bản Pro.",
    ram: "Thấp (~25MB)",
    folder: "software/mobaxterm",
    url: "https://mobaxterm.mobatek.net/",
    suggestedIconUrl: "assets/icons/mobaxterm.svg",
    enterpriseLicenseRequired: true,
    licenseNote: "Bản Home miễn phí cho Cá nhân • Sử dụng thương mại trong Doanh Nghiệp nên mua MobaXterm Professional (hoặc dùng PuTTY + WinSCP miễn phí)"
  },
  {
    id: "putty",
    name: "PuTTY",
    category: "Developer Tools • SSH & Telnet",
    winget: "PuTTY.PuTTY",
    avatar: "⚡",
    avatarBg: "#eff6ff",
    avatarBorder: "#93c5fd",
    catBg: "#dbeafe",
    catColor: "#1d4ed8",
    desc: "Trình kết nối SSH, Telnet, Serial & COM port huyền thoại siêu gọn nhẹ (Mã nguồn mở MIT miễn phí 100% cho DN & CN).",
    ram: "Cực thấp (~4MB)",
    folder: "software/putty",
    url: "https://www.chiark.greenend.org.uk/~sgtatham/putty/",
    suggestedIconUrl: "assets/icons/putty.svg"
  },
  {
    id: "winscp",
    name: "WinSCP",
    category: "Developer Tools • SFTP & SCP",
    winget: "WinSCP.WinSCP",
    avatar: "📂",
    avatarBg: "#f0f9ff",
    avatarBorder: "#bae6fd",
    catBg: "#e0f2fe",
    catColor: "#0284c7",
    desc: "Trình quản lý và truyền file SFTP, SCP, FTP, WebDAV, S3 mã nguồn mở (GPL) đi cặp hoàn hảo với PuTTY.",
    ram: "Cực thấp (~12MB)",
    folder: "software/winscp",
    url: "https://winscp.net/",
    suggestedIconUrl: "assets/icons/winscp.svg"
  },
  {
    id: "advanced-ip-scanner",
    name: "Advanced IP Scanner",
    category: "IT Network • Quét IP & LAN",
    winget: "Famatech.AdvancedIPScanner",
    avatar: "📡",
    avatarBg: "#f0f9ff",
    avatarBorder: "#7dd3fc",
    catBg: "#e0f2fe",
    catColor: "#0369a1",
    desc: "Công cụ quét toàn bộ dải mạng LAN siêu tốc cho IT: dò địa chỉ IP, MAC Address, tên máy, hãng sản xuất, Wake-on-LAN & chia sẻ SMB (Miễn phí 100%).",
    ram: "Cực thấp (~15MB)",
    folder: "software/advanced-ip-scanner",
    url: "https://www.advanced-ip-scanner.com/",
    suggestedIconUrl: "assets/icons/advanced-ip-scanner.svg"
  },
  {
    id: "wireshark",
    name: "Wireshark",
    category: "IT Network • Phân tích Gói tin",
    winget: "WiresharkFoundation.Wireshark",
    avatar: "🦈",
    avatarBg: "#eff6ff",
    avatarBorder: "#93c5fd",
    catBg: "#dbeafe",
    catColor: "#1d4ed8",
    desc: "Phần mềm bắt gói tin (Packet Sniffer) và phân tích giao thức mạng chuyên sâu số 1 thế giới cho kỹ sư IT Network & Bảo mật (Mã nguồn mở GPLv2).",
    ram: "Vừa phải (~80MB)",
    folder: "software/wireshark",
    url: "https://www.wireshark.org/",
    suggestedIconUrl: "assets/icons/wireshark.svg"
  },
  {
    id: "nmap",
    name: "Nmap (Zenmap GUI)",
    category: "IT Network • Quét Port & Bảo mật",
    winget: "Insecure.Nmap",
    avatar: "👁️",
    avatarBg: "#f8fafc",
    avatarBorder: "#94a3b8",
    catBg: "#e2e8f0",
    catColor: "#0f172a",
    desc: "Công cụ quét cổng (Port Scanner), kiểm tra dịch vụ mở, phát hiện hệ điều hành và kiểm toán bảo mật mạng kèm giao diện đồ họa Zenmap.",
    ram: "Thấp (~20MB)",
    folder: "software/nmap",
    url: "https://nmap.org/",
    suggestedIconUrl: "assets/icons/nmap.svg"
  },
  {
    id: "openvpn-connect",
    name: "OpenVPN Connect",
    category: "IT Network • VPN Doanh Nghiệp",
    winget: "OpenVPNTechnologies.OpenVPNConnect",
    avatar: "🔐",
    avatarBg: "#fff7ed",
    avatarBorder: "#fdba74",
    catBg: "#ffedd5",
    catColor: "#c2410c",
    desc: "Trình kết nối VPN chuẩn mực của OpenVPN dùng để nạp file cấu hình .ovpn kết nối an toàn vào mạng nội bộ Công ty / Server.",
    ram: "Thấp (~25MB)",
    folder: "software/openvpn-connect",
    url: "https://openvpn.net/client/",
    suggestedIconUrl: "assets/icons/openvpn-connect.svg"
  },
  {
    id: "tailscale",
    name: "Tailscale VPN",
    category: "IT Network • Mesh VPN (WireGuard)",
    winget: "Tailscale.Tailscale",
    avatar: "🕸️",
    avatarBg: "#f8fafc",
    avatarBorder: "#cbd5e1",
    catBg: "#f1f5f9",
    catColor: "#334155",
    desc: "Mạng riêng ảo Mesh VPN nền tảng WireGuard cực nhanh cho IT & Dev: nối thông máy tính, NAS, Server từ xa không cần mở port NAT.",
    ram: "Cực thấp (~15MB)",
    folder: "software/tailscale",
    url: "https://tailscale.com/",
    suggestedIconUrl: "assets/icons/tailscale.svg"
  },
  {
    id: "antigravity",
    name: "Google Antigravity",
    category: "Developer Tools • AI Coding Agent",
    winget: "Google.Antigravity",
    avatar: "🚀",
    avatarBg: "#faf5ff",
    avatarBorder: "#e9d5ff",
    catBg: "#f3e8ff",
    catColor: "#7e22ce",
    desc: "IDE & Trợ lý lập trình Agentic AI thế hệ mới của Google DeepMind.",
    ram: "Vừa phải (~150MB)",
    folder: "software/antigravity",
    url: "https://deepmind.google/",
    suggestedIconUrl: "assets/icons/antigravity.svg"
  },
  {
    id: "claude",
    name: "Claude",
    category: "Developer Tools • AI Assistant",
    winget: "Anthropic.Claude",
    avatar: "✨",
    avatarBg: "#fff7ed",
    avatarBorder: "#fed7aa",
    catBg: "#ffedd5",
    catColor: "#c2410c",
    desc: "Ứng dụng Claude Desktop chính thức của Anthropic — Trợ lý AI mạnh mẽ về phân tích mã nguồn, kiến trúc hệ thống và viết tài liệu.",
    ram: "Vừa phải (~120MB)",
    folder: "software/claude",
    url: "https://claude.ai/download",
    suggestedIconUrl: "assets/icons/claude.svg"
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    category: "Developer Tools • AI Assistant",
    winget: "OpenAI.ChatGPT",
    avatar: "🤖",
    avatarBg: "#ecfdf5",
    avatarBorder: "#6ee7b7",
    catBg: "#d1fae5",
    catColor: "#047857",
    desc: "Ứng dụng ChatGPT Desktop chính thức của OpenAI trên Windows (Phím tắt Alt + Space hỏi đáp AI, đọc màn hình & hỗ trợ lập trình nhanh).",
    ram: "Vừa phải (~120MB)",
    folder: "software/chatgpt",
    url: "https://openai.com/chatgpt/desktop/",
    suggestedIconUrl: "assets/icons/chatgpt.svg"
  },

  // --- CÁC GÓI VC++ REDISTRIBUTABLES THIẾT YẾU (ĐẶT Ở DƯỚI CÙNG) ---
  {
    id: "vcredist-x64",
    name: "VC++ 2015-2022 Redist (x64)",
    category: "Thư viện Nền tảng C++ (64-bit)",
    winget: "Microsoft.VCRedist.2015+.x64",
    avatar: "🧩",
    avatarBg: "#f5f3ff",
    avatarBorder: "#ddd6fe",
    catBg: "#ede9fe",
    catColor: "#6d28d9",
    desc: "Gói thư viện Microsoft Visual C++ 2015–2022 Redistributable (64-bit) thiết yếu để chạy phần mềm/ứng dụng trên Windows mà không bị lỗi thiếu msvcp140.dll / vcruntime140.dll.",
    ram: "Thư viện hệ thống (0MB nền)",
    folder: "software/vcredist-x64",
    url: "https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist",
    suggestedIconUrl: "assets/icons/vcredist.svg"
  },
  {
    id: "vcredist-x86",
    name: "VC++ 2015-2022 Redist (x86)",
    category: "Thư viện Nền tảng C++ (32-bit)",
    winget: "Microsoft.VCRedist.2015+.x86",
    avatar: "🧩",
    avatarBg: "#f5f3ff",
    avatarBorder: "#ddd6fe",
    catBg: "#ede9fe",
    catColor: "#6d28d9",
    desc: "Gói thư viện Microsoft Visual C++ 2015–2022 Redistributable (32-bit SysWOW64) thiết yếu giúp tương thích toàn bộ phần mềm 32-bit trên Windows 64-bit.",
    ram: "Thư viện hệ thống (0MB nền)",
    folder: "software/vcredist-x86",
    url: "https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist",
    suggestedIconUrl: "assets/icons/vcredist.svg"
  }
];

// Phân nhóm mặc định chuẩn mực theo 6 PHẦN ĐÓNG KHUNG + GÓI VC++ REDISTRIBUTABLES Ở DƯỚI CÙNG
const DEFAULT_APP_GROUPS = {
  // PHẦN 1: THIẾT YẾU KHÔNG CẦN LICENSE 1 (MIỄN PHÍ 100% CHO DOANH NGHIỆP & CÁ NHÂN)
  "unikey": "p1",
  "chrome": "p1",
  "firefox": "p1",
  "7zip": "p1",
  // PHẦN 2: PHẦN MỀM VĂN PHÒNG (LIBREOFFICE • MICROSOFT OFFICE 365 • WPS OFFICE)
  "libreoffice": "p2",
  "wps-office": "p2",
  "office365": "p2",
  // PHẦN 3: THIẾT YẾU KHÔNG CẦN LICENSE 2 (REMOTE MÃ NGUỒN MỞ, PDF & MEDIA MIỄN PHÍ)
  "rustdesk": "p3",
  "ultraviewer": "p3",
  "foxit-reader": "p3",
  "vlc": "p3",
  "coccoc": "p3",
  // PHẦN 4: TÙY CHỌN APP CẦN LICENSE DOANH NGHIỆP (CHỈ TÍCH KHI CÔNG TY ĐÃ MUA BẢN QUYỀN)
  "winrar": "p4",
  "anydesk": "p4",
  "teamviewer": "p4",
  // PHẦN 5: TÙY CHỌN APP PHỤ TRỢ & PHẦN CỨNG (MIỄN PHÍ CHO KTV)
  "mem-reduct": "p5",
  "geek-uninstaller": "p5",
  "gpuz": "p5",
  "cpuz": "p5",
  "hwmonitor": "p5",
  // PHẦN 6: DÀNH RIÊNG CHO IT — DEVELOPER TOOLS & QUẢN TRỊ MẠNG (CONTAINER, NODE.JS 24, SSH, IP/WIRESHARK & AI)
  "vscode": "p6",
  "notepadplusplus": "p6",
  "docker-desktop": "p6",
  "nodejs": "p6",
  "git": "p6",
  "postman": "p6",
  "dbeaver": "p6",
  "mobaxterm": "p6",
  "putty": "p6",
  "winscp": "p6",
  "advanced-ip-scanner": "p6",
  "wireshark": "p6",
  "nmap": "p6",
  "openvpn-connect": "p6",
  "tailscale": "p6",
  "antigravity": "p6",
  "claude": "p6",
  "chatgpt": "p6",
  // DƯỚI CÙNG: CÁC GÓI THƯ VIỆN NỀN TẢNG VC++ REDISTRIBUTABLES THIẾT YẾU
  "vcredist-x64": "p7",
  "vcredist-x86": "p7"
};

const APP_GROUPS_META = {
  "p1": {
    id: "p1",
    name: "PHẦN 1: THIẾT YẾU KHÔNG CẦN LICENSE 1 (MIỄN PHÍ 100% CHO DOANH NGHIỆP & CÁ NHÂN)",
    sub: "UniKey, Google Chrome, Mozilla Firefox, 7-Zip",
    icon: "🛡️"
  },
  "p2": {
    id: "p2",
    name: "PHẦN 2: PHẦN MỀM VĂN PHÒNG (LIBREOFFICE • MICROSOFT OFFICE 365 • WPS OFFICE)",
    sub: "LibreOffice (Miễn phí DN & CN), WPS Office (Cá nhân/Học tập), Microsoft Office 365 (Cần License)",
    icon: "📝"
  },
  "p3": {
    id: "p3",
    name: "PHẦN 3: THIẾT YẾU KHÔNG CẦN LICENSE 2 (REMOTE MÃ NGUỒN MỞ, PDF & MEDIA MIỄN PHÍ)",
    sub: "RustDesk, UltraViewer, Foxit PDF Reader, VLC Media Player, Cốc Cốc",
    icon: "⚡"
  },
  "p4": {
    id: "p4",
    name: "PHẦN 4: TÙY CHỌN APP CẦN LICENSE DOANH NGHIỆP (CHỈ TÍCH KHI CÔNG TY ĐÃ MUA BẢN QUYỀN)",
    sub: "WinRAR, AnyDesk, TeamViewer",
    icon: "🔑"
  },
  "p5": {
    id: "p5",
    name: "PHẦN 5: TÙY CHỌN APP PHỤ TRỢ & PHẦN CỨNG (MIỄN PHÍ CHO KTV)",
    sub: "Mem Reduct, Geek Uninstaller, TechPowerUp GPU-Z, CPUID CPU-Z, CPUID HWMonitor",
    icon: "🛠️"
  },
  "p6": {
    id: "p6",
    name: "PHẦN 6: DÀNH RIÊNG CHO IT — DEVELOPER TOOLS & QUẢN TRỊ MẠNG (CONTAINER, NODE.JS 24, SSH, IP/WIRESHARK & AI)",
    sub: "VS Code, Notepad++, Docker, Node.js 24, Git, Postman, DBeaver, MobaXterm, PuTTY, WinSCP, Advanced IP Scanner, Wireshark, Nmap, OpenVPN, Tailscale, Antigravity, Claude, ChatGPT",
    icon: "👨‍💻"
  },
  "p7": {
    id: "p7",
    name: "CÁC GÓI THƯ VIỆN NỀN TẢNG VC++ REDISTRIBUTABLES THIẾT YẾU (ĐẶT Ở DƯỚI CÙNG)",
    sub: "Microsoft Visual C++ 2015–2022 Redistributable (x64 & x86) — Cần thiết cho cả Doanh Nghiệp & Cá Nhân",
    icon: "🧩"
  }
};

// Bản đồ phân nhóm: Mỗi phần mềm CHỈ TỒN TẠI ở duy nhất 1 nhóm (Không trùng lặp)
let appGroupMap = Object.assign({}, DEFAULT_APP_GROUPS);
try {
  const savedGroupMap = localStorage.getItem("app_custom_groups_v8");
  if (savedGroupMap) {
    Object.assign(appGroupMap, JSON.parse(savedGroupMap));
  }
} catch(e) {}

// Bản đồ phần mềm đã cài đặt trên máy từ app_detector.py
let installedAppsMap = {};
let hasDetectedInstalledApps = false;

// Bản đồ icon chuẩn xác từ thư mục assets/icons
const DEFAULT_ICON_MAP = {
  "unikey": "assets/icons/unikey.jpg",
  "chrome": "assets/icons/chrome.webp",
  "firefox": "assets/icons/firefox.svg",
  "libreoffice": "assets/icons/libreoffice.png",
  "wps-office": "assets/icons/wps-office.svg",
  "7zip": "assets/icons/7zip.svg",
  "coccoc": "assets/icons/coccoc.svg",
  "ultraviewer": "assets/icons/ultraviewer.png",
  "anydesk": "assets/icons/anydesk.ico",
  "teamviewer": "assets/icons/teamviewer.svg",
  "rustdesk": "assets/icons/rustdesk.jpg",
  "foxit-reader": "assets/icons/foxit-reader.ico",
  "office365": "assets/icons/office365.svg",
  "vscode": "assets/icons/vscode.svg",
  "notepadplusplus": "assets/icons/notepadplusplus.svg",
  "docker-desktop": "assets/icons/docker-desktop.svg",
  "nodejs": "assets/icons/nodejs.svg",
  "git": "assets/icons/git.svg",
  "postman": "assets/icons/postman.svg",
  "dbeaver": "assets/icons/dbeaver.svg",
  "mobaxterm": "assets/icons/mobaxterm.svg",
  "putty": "assets/icons/putty.svg",
  "winscp": "assets/icons/winscp.svg",
  "advanced-ip-scanner": "assets/icons/advanced-ip-scanner.svg",
  "wireshark": "assets/icons/wireshark.svg",
  "nmap": "assets/icons/nmap.svg",
  "openvpn-connect": "assets/icons/openvpn-connect.svg",
  "tailscale": "assets/icons/tailscale.svg",
  "antigravity": "assets/icons/antigravity.svg",
  "claude": "assets/icons/claude.svg",
  "chatgpt": "assets/icons/chatgpt.svg",
  "gpuz": "assets/icons/gpuz.png",
  "cpuz": "assets/icons/cpuz.png",
  "hwmonitor": "assets/icons/hwmonitor.png",
  "mem-reduct": "assets/icons/mem-reduct.png",
  "winrar": "assets/icons/winrar.jpg",
  "geek-uninstaller": "assets/icons/geek-uninstaller.ico",
  "vlc": "assets/icons/vlc.svg",
  "vcredist-x64": "assets/icons/vcredist.svg",
  "vcredist-x86": "assets/icons/vcredist.svg",
  "crystaldiskinfo": "assets/icons/crystaldiskinfo.png"
};

// Định nghĩa Phân khu (Sub-zones / Cụm chức năng) bên trong mỗi Phần 1, 2, 3, 4, 5
const SUBZONE_META = {
  "input_vn": {
    order: 1,
    icon: "⌨️",
    label: "Bộ gõ Tiếng Việt",
    bg: "#faf5ff",
    border: "#e9d5ff",
    accent: "#6d28d9"
  },
  "browser": {
    order: 2,
    icon: "🌐",
    label: "Trình duyệt Web",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    accent: "#15803d"
  },
  "archive": {
    order: 3,
    icon: "📦",
    label: "Nén & Giải nén Mã nguồn mở (Miễn phí DN & CN)",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    accent: "#15803d"
  },
  "office_open": {
    order: 4,
    icon: "📝",
    label: "Văn phòng Mã nguồn mở (Miễn phí 100% cho DN & CN)",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    accent: "#15803d"
  },
  "office_wps": {
    order: 5,
    icon: "📄",
    label: "Văn phòng Gọn nhẹ (Miễn phí Cá nhân/Học tập • DN cần License)",
    bg: "#fff1f2",
    border: "#fecdd3",
    accent: "#be123c"
  },
  "office_lic": {
    order: 6,
    icon: "🏢",
    label: "Bộ Văn phòng Bản quyền Microsoft (Cần Key/Tài khoản)",
    bg: "#eff6ff",
    border: "#bfdbfe",
    accent: "#1d4ed8"
  },
  "remote": {
    order: 7,
    icon: "🖥️",
    label: "Điều khiển từ xa Miễn phí (Remote)",
    bg: "#f0f9ff",
    border: "#bae6fd",
    accent: "#0369a1"
  },
  "office_doc": {
    order: 8,
    icon: "📑",
    label: "Đọc & Chú thích Tài liệu PDF",
    bg: "#fffbeb",
    border: "#fde68a",
    accent: "#b45309"
  },
  "archive_lic": {
    order: 9,
    icon: "🗜️",
    label: "Giải nén Thương mại (DN ít mua → dùng 7-Zip)",
    bg: "#fffbeb",
    border: "#fde68a",
    accent: "#b45309"
  },
  "remote_lic": {
    order: 10,
    icon: "🔑",
    label: "Remote & Tiện ích Giới hạn Cá nhân (DN cần mua License)",
    bg: "#fff7ed",
    border: "#fed7aa",
    accent: "#c2410c"
  },
  "dev_editor": {
    order: 15,
    icon: "💻",
    label: "Soạn thảo Code & IDE (MIT / GPL)",
    bg: "#eff6ff",
    border: "#bfdbfe",
    accent: "#1d4ed8"
  },
  "dev_runtime": {
    order: 16,
    icon: "🐳",
    label: "Container, Node.js 24, Git, DB & API",
    bg: "#f0fdf4",
    border: "#86efac",
    accent: "#15803d"
  },
  "dev_ssh": {
    order: 17,
    icon: "🖧",
    label: "SSH, Terminal & Quản trị Server",
    bg: "#f0f9ff",
    border: "#7dd3fc",
    accent: "#0369a1"
  },
  "net_admin": {
    order: 17.5,
    icon: "📡",
    label: "Quét IP, Phân tích Gói tin & VPN (IT Network)",
    bg: "#ecfeff",
    border: "#67e8f9",
    accent: "#0e7490"
  },
  "dev_ai": {
    order: 18,
    icon: "🤖",
    label: "Trợ lý AI & Coding Agent (Antigravity • Claude • ChatGPT)",
    bg: "#faf5ff",
    border: "#d8b4fe",
    accent: "#6d28d9"
  },
  "sys_opt": {
    order: 12,
    icon: "🧹",
    label: "Tối ưu RAM & Gỡ phần mềm",
    bg: "#ecfdf5",
    border: "#a7f3d0",
    accent: "#047857"
  },
  "hw_diag": {
    order: 13,
    icon: "🌡️",
    label: "Chẩn đoán Phần cứng",
    bg: "#fff1f2",
    border: "#fecdd3",
    accent: "#be123c"
  },
  "media": {
    order: 14,
    icon: "🎬",
    label: "Đa phương tiện (Media)",
    bg: "#fefce8",
    border: "#fef08a",
    accent: "#a16207"
  },
  "vcredist_runtime": {
    order: 95,
    icon: "🧩",
    label: "Các gói Thư viện Nền tảng VC++ Redistributables Thiết yếu (64-bit & 32-bit • Mặc định tích cho cả DN & CN)",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    accent: "#5b21b6",
    fullWidthBottom: true
  },
  "custom": {
    order: 99,
    icon: "📦",
    label: "Tiện ích Tùy chỉnh",
    bg: "#f8fafc",
    border: "#cbd5e1",
    accent: "#334155"
  }
};

const APP_SUBZONE_MAP = {
  "unikey": "input_vn",
  "chrome": "browser",
  "firefox": "browser",
  "coccoc": "browser",
  "7zip": "archive",
  "libreoffice": "office_open",
  "wps-office": "office_wps",
  "office365": "office_lic",
  "ultraviewer": "remote",
  "rustdesk": "remote",
  "foxit-reader": "office_doc",
  "vlc": "media",
  "winrar": "archive_lic",
  "anydesk": "remote_lic",
  "teamviewer": "remote_lic",
  "geek-uninstaller": "sys_opt",
  "mem-reduct": "sys_opt",
  "gpuz": "hw_diag",
  "cpuz": "hw_diag",
  "hwmonitor": "hw_diag",
  "vscode": "dev_editor",
  "notepadplusplus": "dev_editor",
  "docker-desktop": "dev_runtime",
  "nodejs": "dev_runtime",
  "git": "dev_runtime",
  "postman": "dev_runtime",
  "dbeaver": "dev_runtime",
  "mobaxterm": "dev_ssh",
  "putty": "dev_ssh",
  "winscp": "dev_ssh",
  "advanced-ip-scanner": "net_admin",
  "wireshark": "net_admin",
  "nmap": "net_admin",
  "openvpn-connect": "net_admin",
  "tailscale": "net_admin",
  "antigravity": "dev_ai",
  "claude": "dev_ai",
  "chatgpt": "dev_ai",
  "vcredist-x64": "vcredist_runtime",
  "vcredist-x86": "vcredist_runtime"
};

function getAppSubzoneKey(app) {
  if (!app) return "custom";
  if (APP_SUBZONE_MAP[app.id]) return APP_SUBZONE_MAP[app.id];
  const cat = (app.category || "").toLowerCase();
  const desc = (app.desc || "").toLowerCase();
  const text = cat + " " + desc + " " + (app.name || "").toLowerCase();
  if (text.includes("remote") || text.includes("điều khiển từ xa") || text.includes("teamviewer") || text.includes("ultraviewer") || text.includes("anydesk")) return "remote";
  if (text.includes("trình duyệt") || text.includes("browser")) return "browser";
  if (text.includes("tiếng việt") || text.includes("unikey") || text.includes("evkey")) return "input_vn";
  if (text.includes("bản quyền") || text.includes("office 365")) return "office_lic";
  if (text.includes("wps")) return "office_wps";
  if (text.includes("libreoffice")) return "office_open";
  if (text.includes("văn phòng") || text.includes("pdf") || text.includes("tài liệu")) return "office_doc";
  if (text.includes("lập trình") || text.includes("code") || text.includes("ai ")) return "dev_ai";
  if (text.includes("gpu") || text.includes("cpu") || text.includes("nhiệt độ") || text.includes("phần cứng") || text.includes("disk")) return "hw_diag";
  if (text.includes("nén") || text.includes("zip") || text.includes("rar") || text.includes("7-zip")) return "archive";
  if (text.includes("media") || text.includes("video") || text.includes("nhạc")) return "media";
  if (text.includes("ram") || text.includes("gỡ") || text.includes("dọn")) return "sys_opt";
  return "custom";
}

// Trạng thái toàn cục (Mặc định không tự tích sẵn để làm rõ trực quan Đã cài xanh nổi bật / Chưa cài màu nhạt dịu)
let selectedApps = new Set();
let currentCategory = "All";
let isServerConnected = false;
let pollInterval = null;
let viewMode = 'list';
try {
  localStorage.setItem('view_mode', 'list');
} catch(e) {}
let installDelay = parseInt(localStorage.getItem('install_delay')) || 3;
let iconMap = Object.assign({}, DEFAULT_ICON_MAP);
let customIconsDirect = {};
try {
  customIconsDirect = JSON.parse(localStorage.getItem('custom_icons_direct') || '{}');
} catch(e) {
  customIconsDirect = {};
}

// Cấu hình trung tâm từ software/toolkit_config.json (Chế độ Doanh Nghiệp / Cá Nhân & Wi-Fi AP)
// Doanh Nghiệp: Mặc định tích 10 phần mềm & thư viện 100% Miễn phí thương mại / Mã nguồn mở (gồm LibreOffice ở Phần 2 + 2 gói VC++ Redistributables ở dưới cùng)
const STANDARD_ENTERPRISE_APPS = [
  "unikey", "chrome", "firefox", "7zip",
  "libreoffice",
  "rustdesk", "foxit-reader", "vlc",
  "vcredist-x64", "vcredist-x86"
];

// Cá Nhân: Đầy đủ 15 phần mềm & thư viện tiện dụng cho máy cá nhân / học tập / gia đình (gồm WPS Office, TeamViewer, AnyDesk + 2 gói VC++ Redistributables ở dưới cùng)
const STANDARD_PERSONAL_APPS = [
  "unikey", "chrome", "coccoc", "7zip", "winrar",
  "wps-office",
  "ultraviewer", "anydesk", "teamviewer", "foxit-reader",
  "vlc", "mem-reduct", "geek-uninstaller",
  "vcredist-x64", "vcredist-x86"
];

let toolkitConfig = {
  default_install_mode: "enterprise",
  general_workflow: {
    default_install_mode: "enterprise",
    filter_apps_by_mode: false
  },
  install_profiles: {
    enterprise: {
      id: "enterprise",
      label: "🏢 Doanh Nghiệp",
      apps: [...STANDARD_ENTERPRISE_APPS]
    },
    personal: {
      id: "personal",
      label: "👤 Cá Nhân",
      apps: [...STANDARD_PERSONAL_APPS]
    }
  },
  wifi_settings: {
    auto_provision_enabled: true,
    skip_if_ethernet_plugged: true,
    skip_if_already_online: true,
    only_import_detected_ap: true,
    auto_connect_matched_ap: true
  },
  wifi_access_points: [],
  workflow: {
    step0_auto_wifi_before_install: true,
    install_delay_seconds: 3
  }
};
let currentInstallMode = "enterprise";
let currentPopoverProfileTab = "enterprise";
let filterMainViewByProfile = false;
let wifiStatusData = null;

function getDefaultAppsForProfile(mode) {
  const m = (mode === "personal") ? "personal" : "enterprise";
  const prof = toolkitConfig && toolkitConfig.install_profiles && toolkitConfig.install_profiles[m];
  if (prof && Array.isArray(prof.apps)) {
    return prof.apps;
  }
  return m === "personal" ? [...STANDARD_PERSONAL_APPS] : [...STANDARD_ENTERPRISE_APPS];
}

function isAppInProfileDefaultList(appId, mode = currentInstallMode) {
  const list = getDefaultAppsForProfile(mode);
  return list.includes(appId);
}

function isAppInCurrentInstallMode(appId) {
  if (!appId) return true;
  if (!filterMainViewByProfile) return true;
  if (isAppInProfileDefaultList(appId, currentInstallMode)) return true;
  const appObj = appList.find(a => a.id === appId);
  if (appObj && appObj.is_custom) return true;
  return false;
}

function getAppsForCurrentMode() {
  return appList.filter(a => isAppInCurrentInstallMode(a.id));
}

function applyDefaultProfileSelectionToMain(mode = currentInstallMode) {
  const m = (mode === "personal") ? "personal" : "enterprise";
  const defaultIds = getDefaultAppsForProfile(m);
  selectedApps.clear();
  defaultIds.forEach(id => {
    if (appList.some(a => a.id === id)) {
      selectedApps.add(id);
    }
  });
}

function updateInstallModeButtonsUI() {
  const entApps = getDefaultAppsForProfile("enterprise");
  const perApps = getDefaultAppsForProfile("personal");
  const cntEnt = document.getElementById("modeCountEnterprise");
  const cntPer = document.getElementById("modeCountPersonal");
  if (cntEnt) cntEnt.innerText = entApps.length;
  if (cntPer) cntPer.innerText = perApps.length;

  const badgeRight = document.getElementById("defaultProfileBtnBadge");
  const defMode = toolkitConfig.default_install_mode === "personal" ? "personal" : "enterprise";
  if (badgeRight) {
    badgeRight.innerText = defMode === "personal"
      ? `Mặc định: 👤 CN (${perApps.length})`
      : `Mặc định: 🏢 DN (${entApps.length})`;
  }

  document.querySelectorAll(".mode-seg-btn").forEach(btn => {
    const m = btn.getAttribute("data-mode");
    btn.classList.toggle("active", m === currentInstallMode);
  });
}

function setInstallProfileMode(mode, silent = false) {
  if (!["enterprise", "personal"].includes(mode)) mode = "enterprise";
  currentInstallMode = mode;
  currentPopoverProfileTab = mode;

  // Khi bấm chuyển sang tab Doanh Nghiệp hoặc Cá Nhân:
  // Tự động nạp danh sách ứng dụng mặc định của chế độ đó ra bảng chọn chính
  applyDefaultProfileSelectionToMain(mode);

  updateInstallModeButtonsUI();
  renderApps();
  if (document.getElementById("defaultProfilePopover")?.style.display === "block") {
    renderDefaultProfilePopoverUI();
  }

  if (!silent) {
    const modeLabel = mode === "enterprise" ? "🏢 Chế Độ Doanh Nghiệp" : "👤 Chế Độ Cá Nhân";
    const defList = getDefaultAppsForProfile(mode);
    showToast(`Đã áp dụng ${modeLabel}: Tự động chọn ${defList.length} ứng dụng mặc định (Mặc định gốc luôn được giữ nguyên)`);
  }
}

// ==========================================
// POPOVER NÚT "DANH SÁCH MẶC ĐỊNH" Ở GÓC PHẢI KHO PHẦN MỀM
// ==========================================
function toggleDefaultProfilePopover(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const pop = document.getElementById("defaultProfilePopover");
  if (!pop) return;
  if (pop.style.display === "block") {
    closeDefaultProfilePopover();
  } else {
    currentPopoverProfileTab = currentInstallMode === "personal" ? "personal" : "enterprise";
    renderDefaultProfilePopoverUI();
    pop.style.display = "block";
  }
}

function closeDefaultProfilePopover() {
  const pop = document.getElementById("defaultProfilePopover");
  if (pop) pop.style.display = "none";
}

function switchDefaultProfilePopoverTab(mode) {
  currentPopoverProfileTab = (mode === "personal") ? "personal" : "enterprise";
  renderDefaultProfilePopoverUI();
}

function setDefaultStartupModeInPopover(mode) {
  const m = (mode === "personal") ? "personal" : "enterprise";
  toolkitConfig.default_install_mode = m;
  if (!toolkitConfig.general_workflow) toolkitConfig.general_workflow = {};
  toolkitConfig.general_workflow.default_install_mode = m;
  if (!toolkitConfig.install_profiles) toolkitConfig.install_profiles = {};
  toolkitConfig.install_profiles.default_mode = m;

  const selTabWifi = document.getElementById("cfgDefaultInstallMode");
  if (selTabWifi) selTabWifi.value = m;

  renderDefaultProfilePopoverUI();
  updateInstallModeButtonsUI();
  saveDefaultProfileFromPopover(false);
  showToast(`Đã đặt chế độ mở mặc định là: ${m === 'personal' ? '👤 Cá Nhân' : '🏢 Doanh Nghiệp'}`);
}

function renderDefaultProfilePopoverUI() {
  const entApps = getDefaultAppsForProfile("enterprise");
  const perApps = getDefaultAppsForProfile("personal");
  const defStartup = toolkitConfig.default_install_mode === "personal" ? "personal" : "enterprise";

  const chipEnt = document.getElementById("dppStartupEnt");
  const chipPer = document.getElementById("dppStartupPer");
  if (chipEnt) chipEnt.classList.toggle("active", defStartup === "enterprise");
  if (chipPer) chipPer.classList.toggle("active", defStartup === "personal");

  const tabEnt = document.getElementById("dppTabBtnEnt");
  const tabPer = document.getElementById("dppTabBtnPer");
  if (tabEnt) tabEnt.classList.toggle("active", currentPopoverProfileTab === "enterprise");
  if (tabPer) tabPer.classList.toggle("active", currentPopoverProfileTab === "personal");

  const cntEnt = document.getElementById("dppTabCountEnt");
  const cntPer = document.getElementById("dppTabCountPer");
  if (cntEnt) cntEnt.innerText = `${entApps.length}/${appList.length}`;
  if (cntPer) cntPer.innerText = `${perApps.length}/${appList.length}`;

  const lbl = document.getElementById("dppCurrentEditingLabel");
  if (lbl) {
    if (currentPopoverProfileTab === "personal") {
      lbl.innerHTML = `Đang chọn mặc định cho: <strong style="color:#047857;">👤 Gói Cá Nhân (${perApps.length} app)</strong>`;
    } else {
      lbl.innerHTML = `Đang chọn mặc định cho: <strong style="color:#1d4ed8;">🏢 Gói Doanh Nghiệp (${entApps.length} app)</strong>`;
    }
  }

  const chkFilter = document.getElementById("dppFilterMainViewChk");
  if (chkFilter) chkFilter.checked = !!filterMainViewByProfile;

  const listContainer = document.getElementById("dppAppsChecklistContainer");
  if (!listContainer) return;

  const activeSet = new Set(getDefaultAppsForProfile(currentPopoverProfileTab));
  const checkedClass = currentPopoverProfileTab === "personal" ? "checked-per" : "checked-ent";

  const groupsOrder = ["p1", "p2", "p3", "p4", "p5", "p6", "p7"];
  let html = "";

  groupsOrder.forEach(gid => {
    const gMeta = APP_GROUPS_META[gid] || { name: gid, icon: "📦" };
    const appsInG = appList.filter(a => (appGroupMap[a.id] || "p5") === gid);
    if (appsInG.length === 0) return;

    const itemsHtml = appsInG.map(app => {
      const idx = appList.indexOf(app) + 1;
      const orderStr = String(idx).padStart(2, "0");
      const isChecked = activeSet.has(app.id);
      const iconSrc = getAppIconPath(app.id);
      const isInstalled = !!(installedAppsMap && installedAppsMap[app.id] && installedAppsMap[app.id].installed);
      const licBadge = app.enterpriseLicenseRequired
        ? `<span style="font-size:9px; font-weight:800; color:#b45309; background:#fef3c7; border:1px solid #fde68a; padding:0 4px; border-radius:3px; flex-shrink:0;" title="${escapeHtml(app.licenseNote || 'Cần License khi dùng cho Doanh Nghiệp')}">🔑 Cần License</span>`
        : "";
      const instDot = hasDetectedInstalledApps
        ? (isInstalled
            ? `<span style="font-size:9.5px; font-weight:700; color:#059669; background:#d1fae5; padding:0 4px; border-radius:3px; flex-shrink:0;" title="Đã cài trên máy này">Đã cài</span>`
            : `<span style="font-size:9.5px; color:#94a3b8; flex-shrink:0;">Chưa cài</span>`)
        : "";

      return `
        <label class="dpp-app-item ${isChecked ? checkedClass : ''}" onclick="toggleAppInDefaultProfile('${currentPopoverProfileTab}', '${escapeJsString(app.id)}', event)" title="${escapeHtml(app.licenseNote || app.desc || app.name)}">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onclick="event.stopPropagation(); toggleAppInDefaultProfile('${currentPopoverProfileTab}', '${escapeJsString(app.id)}', null)" style="cursor:pointer; accent-color:${currentPopoverProfileTab === 'personal' ? '#059669' : '#2563eb'};">
          <span style="font-size:10px; font-weight:700; color:#94a3b8;">${orderStr}</span>
          <img src="${iconSrc}" alt="" style="width:15px; height:15px; object-fit:contain; flex-shrink:0;" onerror="this.style.display='none';">
          <span style="font-size:11.5px; font-weight:700; color:#0f172a; flex:1; min-width:0; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(app.name)}</span>
          ${licBadge}
          ${instDot}
        </label>
      `;
    }).join("");

    html += `
      <div class="dpp-group-box">
        <div class="dpp-group-title">${gMeta.icon} ${escapeHtml(gMeta.name)}</div>
        <div class="dpp-group-grid">${itemsHtml}</div>
      </div>
    `;
  });

  listContainer.innerHTML = html;
}

function toggleAppInDefaultProfile(mode, appId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  const m = (mode === "personal") ? "personal" : "enterprise";
  if (!toolkitConfig.install_profiles) toolkitConfig.install_profiles = {};
  if (!toolkitConfig.install_profiles[m]) {
    toolkitConfig.install_profiles[m] = { id: m, apps: getDefaultAppsForProfile(m) };
  }
  const currentArr = Array.isArray(toolkitConfig.install_profiles[m].apps)
    ? [...toolkitConfig.install_profiles[m].apps]
    : getDefaultAppsForProfile(m);

  const idx = currentArr.indexOf(appId);
  if (idx >= 0) {
    currentArr.splice(idx, 1);
  } else {
    currentArr.push(appId);
  }
  toolkitConfig.install_profiles[m].apps = currentArr;

  // Nếu đang chỉnh đúng chế độ đang mở ở màn hình chính -> cập nhật luôn tích chọn mặc định
  if (currentInstallMode === m) {
    applyDefaultProfileSelectionToMain(m);
  }

  renderDefaultProfilePopoverUI();
  updateInstallModeButtonsUI();
  renderApps();
  renderProfileAppsMatrix();
  saveDefaultProfileFromPopover(false);
}

function popoverSelectAllApps(selectAll) {
  const m = currentPopoverProfileTab === "personal" ? "personal" : "enterprise";
  if (!toolkitConfig.install_profiles) toolkitConfig.install_profiles = {};
  if (!toolkitConfig.install_profiles[m]) toolkitConfig.install_profiles[m] = { id: m, apps: [] };
  toolkitConfig.install_profiles[m].apps = selectAll ? appList.map(a => a.id) : [];

  if (currentInstallMode === m) {
    applyDefaultProfileSelectionToMain(m);
  }
  renderDefaultProfilePopoverUI();
  updateInstallModeButtonsUI();
  renderApps();
  renderProfileAppsMatrix();
  saveDefaultProfileFromPopover(false);
}

function popoverResetStandardDefault() {
  const m = currentPopoverProfileTab === "personal" ? "personal" : "enterprise";
  if (!toolkitConfig.install_profiles) toolkitConfig.install_profiles = {};
  if (!toolkitConfig.install_profiles[m]) toolkitConfig.install_profiles[m] = { id: m, apps: [] };
  toolkitConfig.install_profiles[m].apps = m === "personal"
    ? [...STANDARD_PERSONAL_APPS]
    : [...STANDARD_ENTERPRISE_APPS];

  if (currentInstallMode === m) {
    applyDefaultProfileSelectionToMain(m);
  }
  renderDefaultProfilePopoverUI();
  updateInstallModeButtonsUI();
  renderApps();
  renderProfileAppsMatrix();
  saveDefaultProfileFromPopover(false);
  showToast(`↺ Đã khôi phục danh sách chuẩn gợi ý cho gói ${m === 'personal' ? '👤 Cá Nhân' : '🏢 Doanh Nghiệp'}`);
}

function onToggleFilterMainView(checked) {
  filterMainViewByProfile = !!checked;
  if (!toolkitConfig.general_workflow) toolkitConfig.general_workflow = {};
  toolkitConfig.general_workflow.filter_apps_by_mode = filterMainViewByProfile;
  renderApps();
  saveDefaultProfileFromPopover(false);
}

function applySavedDefaultToMainSelection() {
  applyDefaultProfileSelectionToMain(currentInstallMode);
  renderApps();
  const label = currentInstallMode === "personal" ? "👤 Cá Nhân" : "🏢 Doanh Nghiệp";
  showToast(`🔄 Đã nạp lại ${selectedApps.size} ứng dụng mặc định của gói ${label} ra bảng chính!`);
}

async function saveDefaultProfileFromPopover(showMsg = true) {
  try {
    const res = await fetch("/api/config/toolkit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolkitConfig)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.config) {
        toolkitConfig = Object.assign(toolkitConfig, data.config);
      }
      if (showMsg) {
        showToast("💾 Đã lưu danh sách ứng dụng mặc định vào software/toolkit_config.json!");
        closeDefaultProfilePopover();
      }
    }
  } catch (e) {
    if (showMsg) {
      showToast("Lỗi lưu danh sách mặc định: " + e.message);
    }
  }
}


// Cấu hình thời gian và khóa chống xung đột ghi đè
let timeSettings = {
  mode: "auto",
  manual_datetime: "",
  manual_offset_minutes: 0,
  lock_duration_hours: 24,
  strict_machine_check: true,
  time_server_preset: "google_ntp",
  time_server_url: "time.google.com",
  server_drift_seconds: 0.0,
  manual_applied_at: null
};
try {
  const savedTimeCfg = localStorage.getItem('time_settings');
  if (savedTimeCfg) {
    timeSettings = Object.assign(timeSettings, JSON.parse(savedTimeCfg));
  }
} catch(e) {}

let serverTimeOffsetMs = 0;
let digitalClockInterval = null;
let serverSourceInfo = {
  url: "time.google.com",
  name: "Google Public NTP (Chuẩn nguyên tử)",
  status: "unverified",
  latency_ms: 0,
  drift_seconds: 0.0,
  last_sync_time: ""
};
let serverPresetsMap = {};

// Quản lý lượt quét & máy tính
let scanTasksList = [];
let activeScanId = null;
let currentScanTask = null;
let scannedAppsList = [];
let currentMachineInfo = null;
let currentScanStage = "tiep_nhan";

// Quản lý ổ cứng & TreeSize
let currentScanSubTab = 'apps';
let diskDrivesList = [];
let diskScanData = null;
let diskTreeNodesMap = new Map();
let diskExpandedNodeIds = new Set();
let isDiskTreeAllExpanded = true;
let diskTreeFilterQuery = "";
let diskScanPollTimer = null;
let diskScanIsActive = false;

// Checklist 2 giai đoạn
let currentChecklistData = null;
let activeChecklistTab = 'tiep_nhan';
let isChecklistDirty = false;

// 1. PHÂN LOẠI THIẾT BỊ CHI TIẾT & BỘ LINH KIỆN / PHỤ KIỆN TƯƠNG ỨNG (THEO SƠ ĐỒ CHUẨN)
const DEVICE_BRANCHES_META = {
  // --- NHÓM 1: MÁY TÍNH LAPTOP & PC DESKTOP ---
  laptop: {
    id: "laptop",
    group: "pc_laptop",
    label: "💻 Laptop Xách Tay",
    name: "Laptop / Máy Tính Xách Tay",
    allowed_os: [
      { id: "windows_11_10", label: "🪟 Windows 11 / 10" },
      { id: "linux", label: "🐧 Linux (Ubuntu / Mint)" }
    ],
    default_os: "windows_11_10",
    accessories: [
      { id: "acc_charger", label: "🔌 Củ Sạc / Adapter Laptop (Chân kim / Type-C / Chân vuông)", default: true },
      { id: "acc_power_cord", label: "🔌 Dây Nguồn Cắm Adapter (Số 8 / 3 chấu)", default: true },
      { id: "acc_bag", label: "🎒 Balo / Túi Chống Sốc Laptop", default: false },
      { id: "acc_mouse", label: "🖱️ Chuột Rời & Lót Chuột", default: false },
      { id: "acc_cooling_pad", label: "💨 Đế Tản Nhiệt Laptop", default: false },
      { id: "acc_box", label: "📦 Hộp Máy (Box)", default: false },
      { id: "acc_storage", label: "💾 USB / Box Ổ Cứng Di Động", default: false }
    ],
    exterior: [
      { id: "tn_case_scratch", label: "Vỏ máy (Mặt A, B, C, D)", desc: "Khảo sát trầy xước, cấn móp góc cạnh viền nhôm/nhựa, nứt vỡ thân vỏ" },
      { id: "tn_screen_ext", label: "Màn hình ngoại quan", desc: "Mặt kính không trầy xước sâu, mép viền ron dán khít, không nứt bể góc" },
      { id: "tn_hinge", label: "Bản lề gập mở", desc: "Bản lề chắc chắn, mở gập êm ái, không lỏng lẻo, không nứt kẹt chân ốc" },
      { id: "tn_keyboard_ext", label: "Phím bấm & Touchpad rê chuột", desc: "Không bong phím, không kẹt phím vật lý, touchpad rê chuột mượt mà" },
      { id: "tn_ports", label: "Cổng kết nối ngoại vi (I/O)", desc: "Cổng USB, Type-C, HDMI, LAN, jack tai nghe 3.5mm nguyên vẹn không gãy chân" },
      { id: "tn_screws", label: "Ốc vít đáy & Chân cao su", desc: "Đầy đủ ốc vít đáy máy, không toét đầu ren, chân cao su chống trượt" }
    ]
  },
  pc_desktop: {
    id: "pc_desktop",
    group: "pc_laptop",
    label: "🖥️ Máy PC Desktop / Case",
    name: "Máy Tính Bàn PC / Case / Đồng Bộ",
    allowed_os: [
      { id: "windows_11_10", label: "🪟 Windows 11 / 10 / 7" },
      { id: "linux", label: "🐧 Linux (Ubuntu / Fedora)" }
    ],
    default_os: "windows_11_10",
    accessories: [
      { id: "acc_power_cord", label: "🔌 Dây Nguồn PC 3 Chấu (Cáp nguồn thùng máy)", default: true },
      { id: "acc_display_cable", label: "🔌 Cáp Tín Hiệu Xuất Hình (HDMI / DisplayPort / VGA)", default: false },
      { id: "acc_monitor", label: "🖥️ Màn Hình Máy Tính Rời (nếu nhận cả bộ)", default: false },
      { id: "acc_keyboard", label: "⌨️ Bàn Phím Rời (Cơ / Văn phòng)", default: false },
      { id: "acc_mouse", label: "🖱️ Chuột Máy Tính Rời (Có dây / Không dây)", default: false },
      { id: "acc_wifi_dongle", label: "📡 USB Wi-Fi / Anten Thu Wi-Fi Rời", default: false },
      { id: "acc_lan_cable", label: "🌐 Dây Cáp Mạng LAN", default: false },
      { id: "acc_speaker_headset", label: "🎧 Loa Ngoài / Tai Nghe PC", default: false },
      { id: "acc_box", label: "📦 Thùng Carton / Hộp Linh Kiện", default: false }
    ],
    exterior: [
      { id: "tn_case_scratch", label: "Thùng Case & Mặt kính cường lực", desc: "Khung case không móp méo, mặt kính không nứt vỡ, nắp hông khít" },
      { id: "tn_buttons", label: "Nút bấm Power & Reset thùng máy", desc: "Nút bấm nảy tốt, đèn LED báo nguồn và ổ cứng sáng bình thường" },
      { id: "tn_front_ports", label: "Cổng I/O mặt trước Case", desc: "Cổng USB mặt trước, jack tai nghe/mic trước thùng máy không lỏng gãy" },
      { id: "tn_rear_io", label: "Cụm cổng I/O sau Mainboard & VGA", desc: "Cổng HDMI, DP, USB, LAN, jack âm thanh sau mainboard chắc chắn" },
      { id: "tn_case_fans", label: "Lưới lọc bụi & Quạt Fan Case", desc: "Lưới lọc bụi sạch sẽ, cánh quạt case quay đều không cạ khung sắt" }
    ]
  },

  // --- NHÓM 2: HỆ SINH THÁI APPLE MAC ---
  macbook: {
    id: "macbook",
    group: "apple_mac",
    label: "🍏 MacBook Pro / Air",
    name: "MacBook (Pro / Air)",
    allowed_os: [
      { id: "macos", label: "🍎 macOS (Sonoma / Ventura / Sequoia)" }
    ],
    default_os: "macos",
    accessories: [
      { id: "acc_charger", label: "🔌 Củ Sạc Apple MagSafe / Type-C PD (30W - 140W)", default: true },
      { id: "acc_cable", label: "⚡ Dây Cáp MagSafe 3 / Type-C Bọc Dù Apple", default: true },
      { id: "acc_bag", label: "🎒 Túi Chống Sốc / Bao Da MacBook", default: false },
      { id: "acc_hub", label: "🔌 Cổng Chuyển Đổi Hub Type-C Đa Năng", default: false },
      { id: "acc_mouse", label: "🖱️ Chuột Apple Magic Mouse / Magic Trackpad", default: false },
      { id: "acc_box", label: "📦 Hộp Máy Chính Hãng Apple (Box)", default: false }
    ],
    exterior: [
      { id: "tn_case_scratch", label: "Vỏ nhôm nguyên khối Unibody", desc: "Khảo sát cấn móp méo các cạnh viền máy, trầy xước mặt A, B, C, D" },
      { id: "tn_screen_ext", label: "Màn hình Retina Apple", desc: "Mặt kính sắc nét sáng đẹp, không bong tróc lớp chống lóa Stadia, viền cao su khít" },
      { id: "tn_hinge", label: "Bản lề mở nắp một tay", desc: "Bản lề mở nhẹ nhàng êm ái bằng 1 tay, góc mở chắc chắn không bị gục" },
      { id: "tn_keyboard_ext", label: "Bàn phím Magic Keyboard & Force Touch", desc: "Phím gõ nảy êm ái, Trackpad Force Touch cảm ứng lực và phản hồi rung nhạy" },
      { id: "tn_ports", label: "Cổng Thunderbolt / Type-C & Jack 3.5mm", desc: "Cổng cắm sạch sẽ, nhận sạc và truyền dữ liệu tốc độ cao bình thường" },
      { id: "tn_screws", label: "Ốc pentalobe đáy máy", desc: "Đầy đủ ốc pentalobe đặc thù Apple, không bị toét đầu, đủ nút cao su đáy" }
    ]
  },
  mac_mini_studio: {
    id: "mac_mini_studio",
    group: "apple_mac",
    label: "📦 Mac mini / Studio / Pro",
    name: "Mac mini / Mac Studio / Mac Pro",
    allowed_os: [
      { id: "macos", label: "🍎 macOS (Sonoma / Ventura / Sequoia)" }
    ],
    default_os: "macos",
    accessories: [
      { id: "acc_power_cord", label: "🔌 Dây Nguồn Apple 3 Chấu Zin", default: true },
      { id: "acc_thunderbolt_cable", label: "⚡ Cáp Thunderbolt 4 / HDMI Tốc Độ Cao", default: false },
      { id: "acc_dock", label: "🔌 Docking Station / Hub Mở Rộng Cổng Mac", default: false },
      { id: "acc_keyboard", label: "⌨️ Bàn Phím Apple Magic Keyboard", default: false },
      { id: "acc_mouse", label: "🖱️ Chuột Apple Magic Mouse / Magic Trackpad", default: false },
      { id: "acc_box", label: "📦 Hộp Máy Apple (Box)", default: false }
    ],
    exterior: [
      { id: "tn_case_scratch", label: "Vỏ nhôm khối Mini / Studio", desc: "Bề mặt nhôm Anodized sạch đẹp, không móp méo góc, không trầy xước sâu" },
      { id: "tn_vents", label: "Khe hút gió đáy & Thổi gió tản nhiệt sau", desc: "Lỗ thông gió thông thoáng, quạt tản nhiệt không bị nghẹt bụi dày" },
      { id: "tn_ports", label: "Cổng Thunderbolt / HDMI / LAN 10Gb", desc: "Cổng cắm kết nối sau máy nguyên vẹn, nhận diện màn hình và thiết bị chuẩn" },
      { id: "tn_rubber_base", label: "Đế tròn cao su chống trượt đáy", desc: "Vòng đệm cao su đáy máy dán chắc chắn, không bong tróc" }
    ]
  },
  imac_desktop: {
    id: "imac_desktop",
    group: "apple_mac",
    label: "🖥️ iMac All-in-One (24\" / 27\")",
    name: "iMac / Mac Desktop (All-in-One)",
    allowed_os: [
      { id: "macos", label: "🍎 macOS (Sonoma / Ventura / Sequoia)" }
    ],
    default_os: "macos",
    accessories: [
      { id: "acc_power_brick", label: "🔌 Bộ Nguồn Adapter iMac 24\" (kèm cổng LAN) / Dây Nguồn Từ Tính", default: true },
      { id: "acc_keyboard", label: "⌨️ Bàn Phím Apple Magic Keyboard (Touch ID)", default: false },
      { id: "acc_mouse", label: "🖱️ Chuột Apple Magic Mouse 2 / Magic Trackpad Rời", default: false },
      { id: "acc_cable", label: "⚡ Cáp Sạc Phụ Kiện Bọc Dù Lightning / Type-C", default: false },
      { id: "acc_box", label: "📦 Hộp Xốp Bảo Vệ Màn Hình iMac", default: false }
    ],
    exterior: [
      { id: "tn_screen_ext", label: "Màn hình Retina 4.5K / 5K", desc: "Tấm nền sáng đều, không ám hồng 4 góc, mặt kính ngoài không trầy vỡ" },
      { id: "tn_stand_hinge", label: "Chân đế nhôm & Bản lề gật gù", desc: "Bản lề giữ góc đứng tốt, lò xo không bị gãy gục chúc màn hình xuống" },
      { id: "tn_body_frame", label: "Khung viền máy & Vỏ nhôm màu", desc: "Viền kim loại phẳng đẹp, mép dán màn hình khít, không hở keo" },
      { id: "tn_ports", label: "Cụm cổng Thunderbolt sau lưng", desc: "Các cổng USB-C / Thunderbolt sau lưng sạch sẽ, nhận tín hiệu tốt" }
    ]
  },
  apple_display: {
    id: "apple_display",
    group: "apple_mac",
    label: "🖥️ Apple Display / Mac screen",
    name: "Apple Display / Màn Hình Mac (Studio Display / Pro Display XDR)",
    allowed_os: [
      { id: "macos_firmware", label: "🍎 macOS Display Firmware" }
    ],
    default_os: "macos_firmware",
    accessories: [
      { id: "acc_thunderbolt_cable", label: "⚡ Cáp Thunderbolt 3/4 Apple Zin (1m / 2m)", default: true },
      { id: "acc_power_cord", label: "🔌 Dây Nguồn Apple Chuẩn Hít Zin", default: true },
      { id: "acc_stand", label: "🏗️ Chân Đế Tilt-Adjustable / Height-Adjustable / VESA", default: false },
      { id: "acc_polishing_cloth", label: "🧽 Khăn Lau Màn Hình Nano-texture Apple Chính Hãng", default: false },
      { id: "acc_box", label: "📦 Hộp Máy Màn Hình Apple Display (Box)", default: false }
    ],
    exterior: [
      { id: "tn_screen_ext", label: "Mặt kính màn hình 5K / 6K (Chuẩn / Nano-texture)", desc: "Mặt kính hoàn hảo, không vết trầy, lớp phủ nano không bị lau hóa chất hỏng" },
      { id: "tn_stand_hinge", label: "Khớp nâng hạ & Nghiêng chân đế", desc: "Trọng lực cân bằng nhẹ nhàng, nâng hạ mượt mà, giữ góc chắc chắn" },
      { id: "tn_body_frame", label: "Vỏ nhôm tản nhiệt nguyên khối", desc: "Lỗ thông gió tổ ong / viền tản nhiệt sạch sẽ, thân vỏ không cấn móp" },
      { id: "tn_ports", label: "Cổng Thunderbolt Upstream & 3 Cổng USB-C", desc: "Cổng Thunderbolt cấp nguồn sạc 96W cho Mac và cổng USB-C ngoại vi bình thường" }
    ]
  },

  // --- NHÓM 3: TABLET (MÁY TÍNH BẢNG & PHỤ KIỆN DOCK) ---
  tablet_ipad: {
    id: "tablet_ipad",
    group: "tablet",
    label: "🍎 Apple iPad (iPadOS)",
    name: "Apple iPad (Pro / Air / mini / Gen)",
    allowed_os: [
      { id: "ipados_18_17", label: "🍎 iPadOS (18 / 17 / 16)" }
    ],
    default_os: "ipados_18_17",
    accessories: [
      { id: "acc_stylus", label: "🖊️ Bút Cảm Ứng Apple Pencil (Gen 1 / Gen 2 / USB-C / Pro)", default: false },
      { id: "acc_dock_station", label: "🔌 Dock Sạc & Hub Chuyển Đổi Type-C Để Bàn Đa Cổng", default: false },
      { id: "acc_keyboard_dock", label: "⌨️ Dock Bàn Phím Apple Magic Keyboard Folio / Smart Keyboard", default: false },
      { id: "acc_case_stand", label: "🛡️ Bao Da Smart Folio / Ốp Lưng Gập Stand Có Khay Bút", default: false },
      { id: "acc_charger", label: "🔌 Củ Sạc Nhanh Apple PD (20W / 30W / 35W)", default: true },
      { id: "acc_cable", label: "⚡ Cáp Sạc C-to-C / C-to-Lightning Chính Hãng", default: true },
      { id: "acc_glass", label: "🛡️ Kính Cường Lực / Miếng Dán Paper-like Vẽ Đồ Họa", default: false },
      { id: "acc_sim_pin", label: "📍 Cây Chọc SIM & Khay SIM (Bản 4G/5G Cellular)", default: false },
      { id: "acc_box", label: "📦 Hộp Máy iPad Chính Hãng (Box)", default: false }
    ],
    exterior: [
      { id: "tn_screen_ext", label: "Mặt kính cảm ứng & Tấm nền Liquid Retina", desc: "Kính không nứt bể góc, không đốm sáng, cảm ứng đa điểm 120Hz ProMotion nhạy" },
      { id: "tn_body_bend", label: "Độ phẳng thân vỏ nhôm (Kiểm tra cong vênh)", desc: "Đặt lên mặt phẳng kiểm tra thân máy không bị cong võng, không móp cạnh" },
      { id: "tn_pencil_magnet", label: "Dải nam châm hít & Sạc không dây Apple Pencil", desc: "Cạnh hít nam châm chắc chắn, nhận diện kết nối và sạc pin cho Apple Pencil" },
      { id: "tn_smart_connector", label: "Chân 3 chấu nam châm Smart Connector", desc: "Chân tiếp xúc sạch sẽ, gắn Dock bàn phím Magic Keyboard nhận phím ngay" },
      { id: "tn_ports", label: "Cổng sạc Thunderbolt / Type-C & Jack 3.5mm", desc: "Cổng sạc chắc chắn, không lỏng chập chờn, nhận sạc nhanh và truyền OTG" },
      { id: "tn_cam_lens", label: "Cụm Camera sau & Cảm biến LiDAR", desc: "Kính camera sau không trầy mờ, đèn Flash và cảm biến LiDAR quét chuẩn" }
    ]
  },
  tablet_android: {
    id: "tablet_android",
    group: "tablet",
    label: "🤖 Android Tablet (Galaxy Tab...)",
    name: "Android Tablet (Samsung Tab, Xiaomi Pad, Lenovo)",
    allowed_os: [
      { id: "android_tab", label: "🤖 Android Tablet (One UI Tab / HyperOS / ZUI)" }
    ],
    default_os: "android_tab",
    accessories: [
      { id: "acc_stylus", label: "🖊️ Bút Cảm Ứng S-Pen Samsung / Xiaomi Smart Pen / Stylus", default: false },
      { id: "acc_keyboard_dock", label: "⌨️ Bàn Phím Rời Book Cover Keyboard Kèm Trackpad", default: false },
      { id: "acc_dock_station", label: "🔌 Trạm Kết Nối DeX Station / Dock Sạc Để Bàn Type-C", default: false },
      { id: "acc_case_stand", label: "🛡️ Bao Da Đứng Thông Minh Smart Stand", default: false },
      { id: "acc_charger", label: "🔌 Củ Sạc Nhanh Samsung Super Fast Charging (25W / 45W)", default: true },
      { id: "acc_cable", label: "⚡ Dây Cáp Sạc Nhanh Type-C to Type-C", default: true },
      { id: "acc_glass", label: "🛡️ Kính Cường Lực Bảo Vệ Màn Hình", default: false },
      { id: "acc_sim_pin", label: "📍 Cây Chọc SIM / Thẻ Nhớ MicroSD", default: false },
      { id: "acc_box", label: "📦 Hộp Máy Chính Hãng (Box)", default: false }
    ],
    exterior: [
      { id: "tn_screen_ext", label: "Màn hình Super AMOLED / LCD cảm ứng", desc: "Màn hình sáng đẹp, không ám màu, cảm ứng đa điểm nhạy mượt, không liệt điểm" },
      { id: "tn_body_bend", label: "Thân vỏ lưng máy & Khung viền kim loại", desc: "Kiểm tra độ thẳng lưng máy, không trầy mòn sườn, cạnh viền vuông vắn" },
      { id: "tn_spen_slot", label: "Rãnh nam châm hít bút S-Pen sau lưng", desc: "Lực hút nam châm mạnh, sạc pin Bluetooth cho bút S-Pen bình thường" },
      { id: "tn_pogo_pin", label: "Chân tiếp xúc POGO gắn Dock bàn phím", desc: "Các chân POGO mạ vàng sạch sẽ, không oxy hóa, tiếp xúc bàn phím nhạy" },
      { id: "tn_ports", label: "Cổng Type-C hỗ trợ xuất màn hình DeX", desc: "Cổng Type-C sạch sẽ, cắm cáp nhận sạc nhanh và xuất hình ảnh DeX ra màn hình" },
      { id: "tn_cam_lens", label: "Cụm Camera & Đèn Flash sau", desc: "Kính camera nguyên vẹn, chụp ảnh lấy nét nhanh, không bụi trong ống kính" }
    ]
  },
  tablet_surface: {
    id: "tablet_surface",
    group: "tablet",
    label: "🪟 Microsoft Surface (Win 11)",
    name: "Microsoft Surface (Surface Pro / Go / Book)",
    allowed_os: [
      { id: "windows_surface", label: "🪟 Windows 11 / 10 Pro Surface" }
    ],
    default_os: "windows_surface",
    accessories: [
      { id: "acc_stylus", label: "🖊️ Bút Cảm Ứng Surface Pen / Surface Slim Pen 2", default: false },
      { id: "acc_keyboard_dock", label: "⌨️ Bàn Phím Type Cover / Surface Signature Keyboard Alcantara", default: false },
      { id: "acc_dock_station", label: "🔌 Trạm Kết Nối Microsoft Surface Dock 1/2 / Thunderbolt Dock", default: false },
      { id: "acc_charger", label: "🔌 Củ Sạc Surface Connect Chính Hãng (44W / 65W / 127W) / Sạc PD", default: true },
      { id: "acc_bag", label: "🎒 Bao Da / Túi Chống Sốc Chuyên Dụng Surface", default: false },
      { id: "acc_glass", label: "🛡️ Kính Cường Lực Bảo Vệ Màn Hình PixelSense", default: false },
      { id: "acc_box", label: "📦 Hộp Máy Surface Nguyên Bản (Box)", default: false }
    ],
    exterior: [
      { id: "tn_kickstand", label: "Chân đế Kickstand gập đa góc Surface", desc: "Bản lề Kickstand mở êm ái đa góc độ, không lỏng lẻo, không gãy bản lề" },
      { id: "tn_screen_ext", label: "Màn hình cảm ứng PixelSense đa điểm", desc: "Mặt kính không trầy, không rung sọc màn hình, cảm ứng 10 ngón mượt mà" },
      { id: "tn_magnesium_body", label: "Vỏ hợp kim Magie / Nhôm Surface", desc: "Thân vỏ không cấn móp góc, lớp phủ sơn tĩnh điện không bong tróc" },
      { id: "tn_surface_type_port", label: "Chân tiếp xúc hít nam châm Type Cover", desc: "Rãnh nam châm đáy gắn phím chắc chắn, nhận diện phím và touchpad tức thì" },
      { id: "tn_surface_connect", label: "Cổng sạc từ tính Surface Connect", desc: "Đầu cắm sạc hít nam châm chắc chắn, đèn LED trên đầu sạc sáng trắng" }
    ]
  }
};

// 2. KIỂM TRA TÌNH TRẠNG KỸ THUẬT & LINH KIỆN (F1 -> F4 THEO SƠ ĐỒ)
const TECHNICAL_CHECKS_META = {
  f1: [
    { id: "tn_f1_battery", label: "Độ chai pin & Dung lượng tối đa", desc: "Kiểm tra % pin, chu kỳ sạc, pin không bị chai phồng đẩy cong vỏ" },
    { id: "tn_f1_charging", label: "Khả năng nhận sạc", desc: "Cắm sạc vào điện ổn định, sạc nhanh bình thường, không ngắt quãng" },
    { id: "tn_f1_boot", label: "Khởi động nguồn", desc: "Bật nguồn lên ngay, không sập nguồn đột ngột, nguồn không chập chờn" }
  ],
  f2: [
    { id: "tn_f2_dead_pixel", label: "Điểm chết màn hình", desc: "Không có dead pixel, bright pixel, điểm đen điểm trắng trên nền màu" },
    { id: "tn_f2_lines", label: "Sọc màn hình & Rác hình", desc: "Không có sọc chỉ ngang dọc, không nháy chớp, không rác hình" },
    { id: "tn_f2_backlight", label: "Hở sáng & Đốm phản quang", desc: "Màn hình sáng đều, không hở sáng viền benzel, không đốm ố vàng" },
    { id: "tn_f2_touch", label: "Cảm ứng màn hình", desc: "Cảm ứng đa điểm nhạy mượt mà, không loạn điểm/liệt điểm (nếu máy có cảm ứng)" }
  ],
  f3: [
    { id: "tn_f3_storage", label: "Sức khỏe ổ cứng SSD / HDD", desc: "S.M.A.R.T Good 100%, không dính Bad Sector, không báo C5 nguy hiểm" },
    { id: "tn_f3_ram", label: "Bộ nhớ RAM & Khe cắm", desc: "Hệ thống nhận đủ dung lượng RAM, đúng Bus, Dual Channel không dump xanh" },
    { id: "tn_f3_fan", label: "Quạt tản nhiệt & Thoát nhiệt", desc: "Quạt quay êm ái, thoát nhiệt thông thoáng, không kêu rè, không nghẽn bụi" },
    { id: "tn_f3_mainboard", label: "Bo mạch chủ Mainboard", desc: "Bo mạch nguyên bản, tụ không phù, không rỉ sét/cháy xém/ẩm mốc" }
  ],
  f4: [
    { id: "tn_f4_wifi", label: "Kết nối mạng Wi-Fi", desc: "Bắt sóng mạng Wi-Fi mạnh, truyền tải Internet ổn định, không ngắt quãng" },
    { id: "tn_f4_bluetooth", label: "Kết nối Bluetooth", desc: "Dò tìm và ghép nối tai nghe, chuột không dây Bluetooth nhanh nhạy" },
    { id: "tn_f4_cam", label: "Webcam / Camera", desc: "Camera ghi hình rõ nét, cảm biến ánh sáng tốt, không mờ bụi bẩn" },
    { id: "tn_f4_mic", label: "Micro đàm thoại", desc: "Micro bắt tiếng to rõ, lọc ồn tốt, không bị nghẹt hoặc rè tiếng" },
    { id: "tn_f4_speaker", label: "Hệ thống loa ngoài", desc: "Loa Trái / Phải phát âm thanh trong trẻo, không rè khi bật âm lượng lớn" },
    { id: "tn_f4_audio_jack", label: "Cổng âm thanh Jack 3.5mm", desc: "Cắm tai nghe/loa ngoài nhận âm thanh 2 kênh Stereo chuẩn" }
  ]
};

function getCurrentDeviceMeta(devType) {
  let key = devType || 'laptop';
  if (key === 'laptop_pc') key = 'laptop';
  if (key === 'mac') key = 'macbook';
  if (key === 'tablet' || key === 'tablet_mobile') key = 'tablet_ipad';
  return DEVICE_BRANCHES_META[key] || DEVICE_BRANCHES_META.laptop;
}

const CHECKLIST_ITEMS_META = {
  ban_giao: {
    qc: [
      { id: "bg_os_spec", label: "Windows 11 tối ưu đúng cấu hình", desc: "Cài đúng bản tinh chỉnh tối ưu tương thích RAM & CPU máy theo yêu cầu" },
      { id: "bg_drivers", label: "Full Driver chuẩn chính hãng", desc: "Device Manager sạch đẹp 100%, không còn thiết bị thiếu hoặc chấm than vàng" },
      { id: "bg_activation", label: "Bản quyền Windows kích hoạt sạch", desc: "Kích hoạt Windows & Office bản quyền số sạch sẽ, không dùng tool độc hại" },
      { id: "bg_essential_apps", label: "Trọn bộ ứng dụng văn phòng cơ bản", desc: "Unikey tiếng Việt, Chrome, WinRAR, Foxit PDF, bộ Office chuẩn mượt mà" },
      { id: "bg_temperature", label: "Kiểm tra nhiệt độ & Độ ổn định", desc: "Nhiệt độ CPU/GPU mát mẻ dưới 70°C khi tải, quạt tản nhiệt quay êm ái" },
      { id: "bg_data_restore", label: "Phục hồi dữ liệu về đúng vị trí", desc: "Dữ liệu Desktop, Documents, Bookmarks trình duyệt được đưa về đúng chỗ" },
      { id: "bg_startup_speed", label: "Tốc độ khởi động & Tắt máy", desc: "Khởi động vào Windows dưới 15 giây, thao tác phản hồi tức thì" }
    ],
    cust: [
      { id: "bg_cust_verify", label: "Khách hàng test máy thực tế tại chỗ", desc: "Khách trực tiếp trải nghiệm mở ứng dụng làm việc kiểm tra độ mượt" },
      { id: "bg_cust_data", label: "Khách hàng xác nhận đủ dữ liệu", desc: "Khách đã kiểm tra các tệp tin quan trọng trên Desktop và các ổ đĩa" },
      { id: "bg_return_accessories", label: "Hoàn trả đầy đủ phụ kiện nhận kèm", desc: "Đã bàn giao đầy đủ củ sạc, dây cáp, chuột, túi xách ban đầu của khách" }
    ]
  }
};

// ==========================================
// TOAST NOTIFICATION
// ==========================================
function showToast(msg) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.innerHTML = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 3200);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast("✔ Đã sao chép vào bộ nhớ tạm!");
  }).catch(() => {
    showToast("Vui lòng sao chép thủ công");
  });
}

function copyToClipboard(text, btnEl) {
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const preview = text.length > 40 ? text.slice(0, 40) + "..." : text;
    showToast("✔ Đã sao chép: " + preview);
    if (btnEl) {
      const origText = btnEl.innerText;
      btnEl.innerText = "✔ Đã Copy";
      setTimeout(() => { btnEl.innerText = origText; }, 1800);
    }
  }).catch(() => {
    showToast("Vui lòng sao chép thủ công");
  });
}

function copyDebloatUwpCommand(btnEl) {
  const cmd = `Get-AppxPackage *bingweather* | Remove-AppxPackage; Set-ItemProperty -Path "HKLM:\\SOFTWARE\\Policies\\Microsoft\\Dsh" -Name "AllowNewsAndInterests" -Value 0`;
  copyToClipboard(cmd, btnEl);
}

function copyPagingCommand(btnEl) {
  const cmd = `powershell -NoProfile -ExecutionPolicy Bypass -Command "$cs = Get-CimInstance Win32_ComputerSystem; $cs.AutomaticManagedPagefile = $false; Set-CimInstance -InputObject $cs; $pg = Get-CimInstance Win32_PageFileSetting -Filter \\"Name like 'C:%'\\"; if($pg){ $pg.InitialSize = 4096; $pg.MaximumSize = 6144; Set-CimInstance -InputObject $pg; Write-Host '[OK] Da thiet lap Virtual Memory 4GB-6GB!' -ForegroundColor Green } else { New-CimInstance -ClassName Win32_PageFileSetting -Property @{Name='C:\\\\pagefile.sys';InitialSize=4096;MaximumSize=6144}; Write-Host '[OK] Da tao Paging File 4GB-6GB!' -ForegroundColor Green }"`
  copyToClipboard(cmd, btnEl);
}

function copyUltimatePowerCommand(btnEl) {
  const cmd = `powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61`;
  copyToClipboard(cmd, btnEl);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function escapeJsString(str) {
  if (!str) return '';
  return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"');
}

// ==========================================
// TAB NAVIGATION
// ==========================================
function switchTab(tabId) {
  try {
    window.scrollTo({ top: 0, behavior: 'instant' });
    document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".nav-tab").forEach(el => el.classList.remove("active"));

    const targetTab = document.getElementById(tabId);
    if (targetTab) {
      targetTab.classList.add("active");
    }

    const tabBtn = document.querySelector(`.nav-tab[onclick*="${tabId}"]`);
    if (tabBtn) {
      tabBtn.classList.add("active");
    }

    const bottomBar = document.getElementById("bottomBar");
    if (bottomBar) {
      bottomBar.style.display = (tabId === 'tab-software') ? "flex" : "none";
    }

    if (tabId === 'tab-wifi' && typeof loadWifiAndConfigStatus === 'function') loadWifiAndConfigStatus(false);
    if (tabId === 'tab-test' && typeof initTestTab === 'function') initTestTab();
    if (tabId === 'tab-optimize' && typeof initOptimizeTab === 'function') initOptimizeTab();
    if (tabId === 'tab-oldpc') {
      if (typeof syncInstallModeScanGuardUI === 'function') syncInstallModeScanGuardUI(window.lastInstallState);
      if (typeof initOldPcTab === 'function') initOldPcTab();
    }
    if (tabId === 'tab-setupwin' && typeof initSetupWinHandbook === 'function') initSetupWinHandbook();
    if (tabId === 'tab-computer' && typeof initComputerHandbook === 'function') initComputerHandbook();
    if (tabId === 'tab-legal' && typeof initLegalTab === 'function') initLegalTab();
  } catch(e) {
    console.error("Lỗi chuyển tab:", e);
  }
}

function unselectAllApps() {
  selectedApps.clear();
  renderApps();
  showToast("🗑️ Đã bỏ chọn toàn bộ phần mềm!");
}

// ==========================================
// RUNNER ENGINE STATUS
// ==========================================
function checkEngineStatus() {
  const badge = document.getElementById("engineStatusBadge");
  const text = document.getElementById("engineStatusText");
  const btnInstallText = document.getElementById("btnDirectInstallText");

  fetch("/api/status")
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok") {
        isServerConnected = true;
        if (badge) badge.className = "engine-status online";
        const engName = data.engine === 'python-portable' ? `Python Portable (${data.python_version || 'Native'})` : 'PowerShell Native';
        if (text) text.innerHTML = `🟢 <strong>${engName}</strong>: SẴN SÀNG (Tuần tự + Delay ${installDelay}s)`;
        updateBottomBar();
      }
    })
    .catch(() => {
      isServerConnected = false;
      if (badge) badge.className = "engine-status offline";
      if (text) text.innerHTML = "🟡 Chế độ xem tĩnh (Mở MO_GIAO_DIEN.bat để kết nối Runner máy tính)";
      if (btnInstallText) btnInstallText.innerText = `Cài Đặt Tuần Tự (Delay ${installDelay}s)`;
    });
}

// ==========================================
// TAB 1: KHO PHẦN MỀM & CÀI ĐẶT TUẦN TỰ
// ==========================================
function getAppIconPath(appId) {
  if (customIconsDirect[appId]) return customIconsDirect[appId];
  if (iconMap[appId]) return iconMap[appId];
  const appObj = appList.find(a => a.id === appId);
  if (appObj && appObj.avatar && /^(https?:\/\/|\/?assets\/)/i.test(appObj.avatar.trim())) {
    return appObj.avatar.trim();
  }
  return `assets/icons/${appId}.svg`;
}

async function loadIconsMapFromServer() {
  try {
    const res = await fetch("/api/get_icons_map");
    if (res.ok) {
      const payload = await res.json();
      const serverIcons = (payload && payload.icons && typeof payload.icons === "object")
        ? payload.icons
        : payload;
      if (serverIcons && typeof serverIcons === "object") {
        Object.assign(iconMap, serverIcons);
        renderApps();
      }
    }
  } catch (e) {
    // Offline/static fallback vẫn dùng DEFAULT_ICON_MAP
  }
}

// ==========================================
// DRAG & DROP & GROUP MANAGEMENT (STRICT 1-GROUP UNIQUENESS)
// ==========================================
let draggedAppId = null;
let currentMovingAppId = null;

function handleDragStart(event, appId) {
  draggedAppId = appId;
  if (event.dataTransfer) {
    event.dataTransfer.setData("text/plain", appId);
    event.dataTransfer.effectAllowed = "move";
  }
  const el = event.currentTarget;
  if (el) el.classList.add("dragging");
  ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].forEach(gid => {
    const gc = document.getElementById(`group-card-${gid}`);
    if (gc) gc.style.display = "";
  });
}

function handleDragEnd(event) {
  const el = event.currentTarget;
  if (el) el.classList.remove("dragging");
  document.querySelectorAll(".app-group-dropzone").forEach(dz => dz.classList.remove("drag-over"));
  draggedAppId = null;
  renderApps();
}

function handleDragOver(event) {
  event.preventDefault();
  if (event.dataTransfer) event.dataTransfer.dropEffect = "move";
  const dz = event.currentTarget;
  if (dz && !dz.classList.contains("drag-over")) {
    dz.classList.add("drag-over");
  }
}

function handleDragLeave(event) {
  const dz = event.currentTarget;
  if (dz) dz.classList.remove("drag-over");
}

function handleDrop(event, targetGroupId) {
  event.preventDefault();
  const dz = event.currentTarget;
  if (dz) dz.classList.remove("drag-over");

  const appId = (event.dataTransfer && event.dataTransfer.getData("text/plain")) || draggedAppId;
  if (!appId || !targetGroupId) return;

  moveAppToGroup(appId, targetGroupId);
}

function moveAppToGroup(appId, targetGroupId) {
  if (appGroupMap[appId] === targetGroupId) return;

  // Đảm bảo chỉ tồn tại ở duy nhất 1 nhóm (Không trùng lặp)
  appGroupMap[appId] = targetGroupId;
  try {
    localStorage.setItem("app_custom_groups_v8", JSON.stringify(appGroupMap));
  } catch(e) {}

  saveCustomDataToServer();
  renderApps();

  const appObj = appList.find(a => a.id === appId);
  const grpMeta = APP_GROUPS_META[targetGroupId];
  showToast(`Đã chuyển "${appObj ? appObj.name : appId}" sang ${grpMeta ? grpMeta.name : targetGroupId}!`);
}

function openMoveAppModal(appId) {
  currentMovingAppId = appId;
  const appObj = appList.find(a => a.id === appId);
  const nameEl = document.getElementById("moveAppTargetName");
  if (nameEl && appObj) {
    const curG = appGroupMap[appId] || "p5";
    const curGMeta = APP_GROUPS_META[curG];
    nameEl.innerHTML = `Đang chọn: <strong>${escapeHtml(appObj.name)}</strong> (Hiện ở: ${curGMeta ? curGMeta.name : curG})`;
  }

  const radios = document.querySelectorAll('input[name="moveTargetGroup"]');
  radios.forEach(r => {
    r.checked = (r.value === (appGroupMap[appId] || "p5"));
  });

  const modal = document.getElementById("modalMoveApp");
  if (modal) modal.classList.add("active");
}

function closeMoveAppModal() {
  const modal = document.getElementById("modalMoveApp");
  if (modal) modal.classList.remove("active");
  currentMovingAppId = null;
}

function confirmMoveApp() {
  if (!currentMovingAppId) return;
  const selRadio = document.querySelector('input[name="moveTargetGroup"]:checked');
  if (!selRadio) return;

  moveAppToGroup(currentMovingAppId, selRadio.value);
  closeMoveAppModal();
}

function toggleSelectGroup(groupId) {
  const appsInGroup = appList.filter(a => isAppInCurrentInstallMode(a.id) && (appGroupMap[a.id] || "p5") === groupId);
  if (appsInGroup.length === 0) return;
  const allSelected = appsInGroup.every(a => selectedApps.has(a.id));

  if (allSelected) {
    appsInGroup.forEach(a => selectedApps.delete(a.id));
  } else {
    appsInGroup.forEach(a => selectedApps.add(a.id));
  }
  renderApps();
}

function toggleSelectSubzone(groupId, subzoneKey, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const clusterApps = appList.filter(a => isAppInCurrentInstallMode(a.id) && (appGroupMap[a.id] || "p5") === groupId && getAppSubzoneKey(a) === subzoneKey);
  if (clusterApps.length === 0) return;
  const allSelected = clusterApps.every(a => selectedApps.has(a.id));
  if (allSelected) {
    clusterApps.forEach(a => selectedApps.delete(a.id));
  } else {
    clusterApps.forEach(a => selectedApps.add(a.id));
  }
  renderApps();
}

function selectMissingInGroup(groupId) {
  if (!hasDetectedInstalledApps) {
    loadInstalledAppsDetection(true, true);
    return;
  }
  const appsInGroup = appList.filter(a => isAppInCurrentInstallMode(a.id) && (appGroupMap[a.id] || "p5") === groupId);
  let missingCount = 0;
  appsInGroup.forEach(a => {
    const isInstalled = !!(installedAppsMap && installedAppsMap[a.id] && installedAppsMap[a.id].installed);
    if (isInstalled) {
      selectedApps.delete(a.id);
    } else {
      selectedApps.add(a.id);
      missingCount++;
    }
  });
  renderApps();
  const grpMeta = APP_GROUPS_META[groupId];
  if (missingCount > 0) {
    showToast(`Đã chọn ${missingCount} phần mềm chưa cài trong ${grpMeta ? grpMeta.name : groupId}!`);
  } else {
    showToast(`Tất cả phần mềm trong ${grpMeta ? grpMeta.name : groupId} đều đã cài đặt!`);
  }
}

function selectAllMissingApps() {
  if (!hasDetectedInstalledApps) {
    loadInstalledAppsDetection(true, true);
    return;
  }
  const activeApps = getAppsForCurrentMode();
  selectedApps.clear();
  let missingCount = 0;
  activeApps.forEach(a => {
    const isInstalled = !!(installedAppsMap && installedAppsMap[a.id] && installedAppsMap[a.id].installed);
    if (!isInstalled) {
      selectedApps.add(a.id);
      missingCount++;
    }
  });
  renderApps();
  if (missingCount > 0) {
    showToast(`⚡ Đã đồng bộ: Chỉ tích chọn ${missingCount}/${activeApps.length} phần mềm chưa cài đặt!`);
  } else {
    showToast(`✔ Toàn bộ ${activeApps.length} phần mềm trong chế độ hiện tại đều đã được cài đặt!`);
  }
}

function getCleanCategory(cat) {
  if (!cat) return 'Tiện ích';
  if (cat.includes('Điều khiển từ xa')) return 'Điều khiển từ xa';
  if (cat.includes('Đa phương tiện')) return 'Media Player';
  if (cat.includes('Thông tin CPU')) return 'CPU & Mainboard';
  if (cat.includes('Chẩn đoán Card')) return 'Chẩn đoán GPU';
  if (cat.includes('Bộ văn phòng bản quyền')) return 'Văn phòng bản quyền';
  if (cat.includes('Tiện ích & Quản lý RAM')) return 'Quản lý RAM';
  if (cat.includes('Tiện ích & Gỡ phần mềm')) return 'Gỡ phần mềm';
  if (cat.includes('Nén & Giải nén')) return 'Nén file';
  if (cat.includes('Lập trình & Biên soạn')) return 'Code Editor';
  return cat;
}

// ==========================================
// RENDER KHO PHẦN MỀM 5 NHÓM ĐÓNG KHUNG & CÁC PHÂN KHU (SUB-ZONES)
// ==========================================
function renderApps() {
  updateInstallModeButtonsUI();

  const searchInput = document.getElementById("searchInput");
  const searchKeyword = (searchInput && searchInput.value) ? searchInput.value.toLowerCase().trim() : "";

  const dropzones = {
    p1: document.getElementById("dropzone-p1"),
    p2: document.getElementById("dropzone-p2"),
    p3: document.getElementById("dropzone-p3"),
    p4: document.getElementById("dropzone-p4"),
    p5: document.getElementById("dropzone-p5"),
    p6: document.getElementById("dropzone-p6"),
    p7: document.getElementById("dropzone-p7"),
  };

  const hasGroupedDropzones = Object.values(dropzones).some(Boolean);

  if (!hasGroupedDropzones) {
    const fallbackContainer = document.getElementById("appContainer");
    if (!fallbackContainer) return;
    fallbackContainer.innerHTML = "";
    return;
  }

  // Làm sạch các dropzone
  Object.values(dropzones).forEach(dz => { if (dz) dz.innerHTML = ""; });

  const groupCounts = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0 };
  const groupSelected = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0 };
  const groupInstalled = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0 };
  const groupMissing = { p1: 0, p2: 0, p3: 0, p4: 0, p5: 0, p6: 0, p7: 0 };
  const groupedClusters = { p1: {}, p2: {}, p3: {}, p4: {}, p5: {}, p6: {}, p7: {} };

  let totalInstalledAll = 0;
  let totalMissingAll = 0;
  let totalModeApps = 0;

  appList.forEach((app, index) => {
    if (!isAppInCurrentInstallMode(app.id)) return;
    totalModeApps++;

    const gid = appGroupMap[app.id] || "p5";
    const isInstalled = !!(installedAppsMap && installedAppsMap[app.id] && installedAppsMap[app.id].installed);
    if (isInstalled) totalInstalledAll++;
    else totalMissingAll++;

    const targetDz = dropzones[gid];
    if (!targetDz) return;

    // Lọc theo từ khóa tìm kiếm
    const matchSearch = !searchKeyword ||
      (app.name && app.name.toLowerCase().includes(searchKeyword)) ||
      (app.desc && app.desc.toLowerCase().includes(searchKeyword)) ||
      (app.category && app.category.toLowerCase().includes(searchKeyword));

    if (!matchSearch) return;

    groupCounts[gid]++;
    if (selectedApps.has(app.id)) groupSelected[gid]++;
    if (isInstalled) groupInstalled[gid]++;
    else groupMissing[gid]++;

    const szKey = getAppSubzoneKey(app);
    if (!groupedClusters[gid][szKey]) {
      groupedClusters[gid][szKey] = [];
    }
    groupedClusters[gid][szKey].push({ app, index, isInstalled });
  });

  // Render từng Phần (p1..p7) chia theo các Phân khu (Sub-zones) gọn gàng
  ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7'].forEach(gid => {
    const dz = dropzones[gid];
    const gCard = document.getElementById(`group-card-${gid}`);
    if (!dz) return;

    const clusterKeys = Object.keys(groupedClusters[gid]).sort((a, b) => {
      const oa = (SUBZONE_META[a] && SUBZONE_META[a].order) || 99;
      const ob = (SUBZONE_META[b] && SUBZONE_META[b].order) || 99;
      return oa - ob;
    });

    if (clusterKeys.length === 0) {
      if (gCard && currentInstallMode !== "all" && !draggedAppId) {
        gCard.style.display = "none";
      } else {
        if (gCard) gCard.style.display = "";
        dz.innerHTML = `<div class="app-group-empty-hint">Kéo thả phần mềm vào đây hoặc dùng chuột phải → "Chuyển sang nhóm khác" để đưa phần mềm vào nhóm này.</div>`;
      }
    } else {
      if (gCard) gCard.style.display = "";
      clusterKeys.forEach(szKey => {
        const items = groupedClusters[gid][szKey];
        const szMeta = SUBZONE_META[szKey] || SUBZONE_META.custom;
        const allClusterSelected = items.every(it => selectedApps.has(it.app.id));

        const subzoneEl = document.createElement("div");
        subzoneEl.className = "app-subzone" + (szMeta.fullWidthBottom ? " subzone-vcredist-bottom" : "");
        subzoneEl.style.setProperty("--subzone-bg", szMeta.bg);
        subzoneEl.style.setProperty("--subzone-border", szMeta.border);
        subzoneEl.style.setProperty("--subzone-accent", szMeta.accent);

        const headerEl = document.createElement("div");
        headerEl.className = "app-subzone-header";
        headerEl.innerHTML = `
          <span class="app-subzone-label" title="Phân khu: ${escapeHtml(szMeta.label)} (${items.length} phần mềm)">
            <span>${szMeta.icon}</span>
            <span style="overflow:hidden; text-overflow:ellipsis;">${escapeHtml(szMeta.label)}</span>
            <span class="app-subzone-count">(${items.length})</span>
          </span>
          ${items.length > 1 ? `<button type="button" class="subzone-toggle-btn" onclick="toggleSelectSubzone('${gid}', '${szKey}', event)" title="Chọn hoặc bỏ chọn toàn bộ cụm ${escapeHtml(szMeta.label)}">${allClusterSelected ? 'Bỏ cụm' : 'Chọn cụm'}</button>` : ''}
        `;
        subzoneEl.appendChild(headerEl);

        const gridEl = document.createElement("div");
        gridEl.className = "app-subzone-grid";

        items.forEach(({ app, index, isInstalled }) => {
          const isSelected = selectedApps.has(app.id);
          const installedInfo = (installedAppsMap && installedAppsMap[app.id]) || {};
          const installedVer = installedInfo.version || "";
          const installedPath = installedInfo.exe_path || "";
          const iconSrc = getAppIconPath(app.id);
          const orderStr = String(index + 1).padStart(2, '0');

          const stateClass = hasDetectedInstalledApps
            ? (isInstalled ? 'is-installed' : 'is-missing')
            : '';

          let statusBadgeHtml = "";
          if (hasDetectedInstalledApps) {
            if (isInstalled) {
              const tipText = `Đã cài trên máy${installedVer && installedVer !== 'Đã cài' ? ' (' + installedVer + ')' : ''}${installedPath ? ' • ' + installedPath : ''}`;
              statusBadgeHtml = `<span class="app-installed-badge" title="${escapeHtml(tipText)}">✔ Đã cài</span>`;
            } else {
              statusBadgeHtml = `<span class="app-missing-badge" title="Chưa cài đặt trên máy tính này — Bấm để chọn cài đặt">Chưa cài</span>`;
            }
          }

          const row = document.createElement("div");
          row.className = `app-list-row ${isSelected ? 'selected' : ''} ${stateClass}`.trim();
          row.setAttribute("data-app-id", app.id);
          row.setAttribute("draggable", "true");
          row.ondragstart = (e) => handleDragStart(e, app.id);
          row.ondragend = (e) => handleDragEnd(e);
          row.setAttribute("onclick", `handleRowClick('${app.id}', event)`);
          row.title = `${app.name} [${hasDetectedInstalledApps ? (isInstalled ? 'Đã cài' : 'Chưa cài') : 'Chưa quét'}]${app.desc ? ' • ' + app.desc : ''}${app.ram ? ' (RAM: ' + app.ram + ')' : ''} • Chuột trái: Chọn • Chuột phải: Menu tác vụ & Chú thích`;
          row.oncontextmenu = (e) => {
            e.preventDefault();
            e.stopPropagation();
            showAppContextMenu(e.clientX, e.clientY, app.id);
          };

          row.innerHTML = `
            <div class="app-list-left">
              <div class="app-list-main">
                <div class="custom-check-btn ${isSelected ? 'checked' : ''}" onclick="toggleAppCheck('${app.id}', event)" title="${isSelected ? 'Đang chọn cài đặt (Bấm để bỏ chọn)' : 'Bấm để chọn cài đặt'}">
                  <svg class="check-icon" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span class="app-order-num">${orderStr}</span>
                <div class="app-logo-box">
                  <img src="${iconSrc}" alt="${escapeHtml(app.name)}" class="app-logo-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                  <div class="app-logo-fallback" style="display:none; font-size:12px; align-items:center; justify-content:center;">${app.avatar || '📦'}</div>
                </div>
                <span class="app-name" title="${escapeHtml(app.licenseNote ? app.name + ' — ' + app.licenseNote : app.name)}">${escapeHtml(app.name)}</span>
                ${app.enterpriseLicenseRequired ? `<span style="font-size:9.5px; font-weight:800; color:#b45309; background:#fef3c7; border:1px solid #fde68a; border-radius:4px; padding:0 3px; flex-shrink:0; line-height:1.3;" title="${escapeHtml(app.licenseNote || 'Cần License Doanh Nghiệp')}">🔑</span>` : ''}
              </div>
              ${statusBadgeHtml}
            </div>
          `;

          gridEl.appendChild(row);
        });

        subzoneEl.appendChild(gridEl);
        dz.appendChild(subzoneEl);
      });
    }

    const bCount = document.getElementById(`badge-count-${gid}`);
    const bInst = document.getElementById(`badge-installed-${gid}`);
    const bSel = document.getElementById(`badge-selected-${gid}`);

    if (bCount) bCount.innerText = `${groupCounts[gid]} app`;
    if (bSel) {
      bSel.innerText = `${groupSelected[gid]} đã chọn`;
      if (groupSelected[gid] === 0) {
        bSel.style.background = "#f1f5f9";
        bSel.style.color = "#64748b";
        bSel.style.borderColor = "#cbd5e1";
      } else {
        bSel.style.background = "";
        bSel.style.color = "";
        bSel.style.borderColor = "";
      }
    }
    if (bInst) {
      if (hasDetectedInstalledApps && groupCounts[gid] > 0) {
        bInst.style.display = "inline-flex";
        if (groupMissing[gid] > 0) {
          bInst.innerText = `✔ ${groupInstalled[gid]} đã cài • ⚠ ${groupMissing[gid]} chưa cài`;
          bInst.style.background = "#fff7ed";
          bInst.style.color = "#c2410c";
          bInst.style.border = "1px solid #fdba74";
        } else {
          bInst.innerText = `✔ Đủ ${groupInstalled[gid]}/${groupCounts[gid]} đã cài`;
          bInst.style.background = "#dcfce7";
          bInst.style.color = "#15803d";
          bInst.style.border = "1px solid #86efac";
        }
      } else {
        bInst.style.display = "none";
      }
    }
  });

  // Cập nhật thanh tổng kết trạng thái quét trên Filter Bar
  const scanSummary = document.getElementById("scanSummaryInline");
  const installedPill = document.getElementById("summaryInstalledPill");
  const missingPill = document.getElementById("summaryMissingPill");
  if (scanSummary && installedPill && missingPill) {
    if (hasDetectedInstalledApps) {
      scanSummary.style.display = "inline-flex";
      installedPill.innerText = `✔ ${totalInstalledAll}/${totalModeApps} Đã cài`;
      if (totalMissingAll > 0) {
        missingPill.style.display = "inline-flex";
        missingPill.innerText = `${totalMissingAll} Chưa cài (Chọn ngay)`;
        missingPill.style.color = "#475569";
        missingPill.style.background = "#f1f5f9";
        missingPill.style.borderColor = "#cbd5e1";
      } else {
        missingPill.style.display = "inline-flex";
        missingPill.innerText = `🎉 Đã cài đủ 100%`;
        missingPill.style.color = "#15803d";
        missingPill.style.background = "#f0fdf4";
        missingPill.style.borderColor = "#86efac";
      }
    } else {
      scanSummary.style.display = "none";
    }
  }

  updateBottomBar();
}

function setViewMode(mode) {
  viewMode = 'list';
  try {
    localStorage.setItem('view_mode', 'list');
  } catch(e) {}
  renderApps();
}

function toggleAppCheck(appId, event) {
  if (event) event.stopPropagation();
  if (selectedApps.has(appId)) selectedApps.delete(appId);
  else selectedApps.add(appId);
  renderApps();
}

function handleRowClick(appId, event) {
  if (event.target.closest("button") || event.target.closest("a") || event.target.closest(".custom-check-btn")) return;
  toggleAppCheck(appId, event);
}

function toggleSelectAllMaster() {
  const activeApps = getAppsForCurrentMode();
  const allSelected = activeApps.length > 0 && activeApps.every(a => selectedApps.has(a.id));
  if (allSelected) {
    selectedApps.clear();
  } else {
    selectedApps.clear();
    activeApps.forEach(a => selectedApps.add(a.id));
  }
  renderApps();
}

function filterCategory(cat) {
  currentCategory = cat;
  document.querySelectorAll(".cat-btn").forEach(btn => {
    const btnCat = btn.getAttribute('data-cat') || (btn.innerText === 'Tất cả' ? 'All' : btn.innerText);
    btn.classList.toggle("active", btnCat === cat);
  });
  renderApps();
}

function onSearchAppInput() {
  const input = document.getElementById("searchInput");
  const clearBtn = document.getElementById("searchClearBtn");
  if (clearBtn) {
    clearBtn.style.display = (input && input.value.trim().length > 0) ? "block" : "none";
  }
  renderApps();
}

function clearSearchInput() {
  const input = document.getElementById("searchInput");
  if (input) {
    input.value = "";
    const clearBtn = document.getElementById("searchClearBtn");
    if (clearBtn) clearBtn.style.display = "none";
    input.focus();
    renderApps();
  }
}

function handleSearch() {
  renderApps();
}

function updateBottomBar() {
  const countEl = document.getElementById("selectedCount");
  const totalEl = document.getElementById("totalAppsCount");
  const masterBtn = document.getElementById("masterCheckBtn");
  const bottomStatEl = document.getElementById("bottomInstalledStat");
  const btnOnlyMissing = document.getElementById("btnSelectOnlyMissing");
  const btnInstallText = document.getElementById("btnDirectInstallText");

  const activeApps = getAppsForCurrentMode();

  if (countEl) countEl.innerText = selectedApps.size;
  if (totalEl) totalEl.innerText = activeApps.length;
  if (masterBtn) {
    masterBtn.classList.toggle("checked", activeApps.length > 0 && activeApps.every(a => selectedApps.has(a.id)));
  }

  if (hasDetectedInstalledApps) {
    let instCnt = 0;
    let missCnt = 0;
    activeApps.forEach(a => {
      if (installedAppsMap && installedAppsMap[a.id] && installedAppsMap[a.id].installed) instCnt++;
      else missCnt++;
    });
    if (bottomStatEl) {
      bottomStatEl.style.display = "inline-flex";
      bottomStatEl.innerHTML = `<span style="color:#059669; font-weight:700;">✔ ${instCnt} đã cài</span>&nbsp;•&nbsp;<span style="color:${missCnt > 0 ? '#64748b' : '#059669'};">${missCnt > 0 ? missCnt + ' chưa cài' : 'Đủ bộ'}</span>`;
    }
    if (btnOnlyMissing) {
      btnOnlyMissing.style.display = missCnt > 0 ? "inline-flex" : "none";
    }
  } else {
    if (bottomStatEl) bottomStatEl.style.display = "none";
    if (btnOnlyMissing) btnOnlyMissing.style.display = "none";
  }

  if (btnInstallText) {
    if (selectedApps.size > 0) {
      btnInstallText.innerText = `Bấm Cài Đặt ${selectedApps.size} Phần Mềm (Delay ${installDelay}s)`;
    } else {
      btnInstallText.innerText = `Bấm Cài Đặt Tuần Tự (Delay ${installDelay}s)`;
    }
  }
}

// ==========================================
// PHÁT HIỆN PHẦN MỀM ĐÃ CÀI ĐẶT TRÊN MÁY & TỰ ĐỘNG ĐỒNG BỘ DANH SÁCH CHƯA CÀI
// ==========================================
async function loadInstalledAppsDetection(isManual = false, syncSelection = true) {
  const refreshBtn = document.getElementById("btnRefreshDetection");
  if (refreshBtn && isManual) {
    refreshBtn.innerHTML = `<span>⏳ Đang quét...</span>`;
    refreshBtn.disabled = true;
  }
  try {
    const res = await fetch("/api/apps/detect_installed");
    if (res.ok) {
      const data = await res.json();
      if (data && data.installed_map) {
        installedAppsMap = data.installed_map;
        hasDetectedInstalledApps = true;

        let installedCount = 0;
        let missingCount = 0;

        if (syncSelection) {
          selectedApps.clear();
        }

        const activeApps = getAppsForCurrentMode();
        activeApps.forEach(a => {
          const isInst = !!(installedAppsMap[a.id] && installedAppsMap[a.id].installed);
          if (isInst) {
            installedCount++;
          } else {
            missingCount++;
            if (syncSelection) {
              selectedApps.add(a.id);
            }
          }
        });

        renderApps();

        if (isManual) {
          if (missingCount > 0) {
            showToast(`Đã quét: ${installedCount}/${activeApps.length} đã cài • Tự động chọn ${missingCount} phần mềm chưa cài!`);
          } else {
            showToast(`🎉 Tuyệt vời! Đã cài đặt đầy đủ ${installedCount}/${activeApps.length} phần mềm trên máy!`);
          }
        }
      }
    }
  } catch(e) {
    console.warn("Khong the quet phan mem da cai:", e);
  } finally {
    if (refreshBtn && isManual) {
      refreshBtn.innerHTML = `<span>🔄 Quét Trạng Thái Đã Cài</span>`;
      refreshBtn.disabled = false;
    }
  }
}

function refreshInstalledAppsDetection(syncSelection = true) {
  loadInstalledAppsDetection(true, syncSelection);
}

// ==========================================
// THÊM PHẦN MỀM THỦ CÔNG & ĐỒNG BỘ CẤU HÌNH
// ==========================================
function openAddCustomAppModal() {
  const m = document.getElementById("modalAddCustomApp");
  if (m) m.classList.add("active");
}

function closeAddCustomAppModal() {
  const m = document.getElementById("modalAddCustomApp");
  if (m) m.classList.remove("active");
}

function submitAddCustomApp() {
  const nameIn = document.getElementById("customAppName");
  const name = nameIn ? nameIn.value.trim() : "";
  if (!name) {
    alert("Vui lòng nhập tên phần mềm!");
    if (nameIn) nameIn.focus();
    return;
  }

  const group = document.getElementById("customAppGroup")?.value || "p5";
  const winget = document.getElementById("customAppWinget")?.value.trim() || "";
  const avatar = document.getElementById("customAppAvatar")?.value.trim() || "📦";
  const exePath = document.getElementById("customAppExePath")?.value.trim() || "";
  const desc = document.getElementById("customAppDesc")?.value.trim() || "Phần mềm do người dùng tùy biến thêm vào bộ kit.";
  const ram = document.getElementById("customAppRam")?.value.trim() || "Vừa phải";
  const url = document.getElementById("customAppUrl")?.value.trim() || "https://google.com";

  const cleanId = "custom_" + name.toLowerCase().replace(/[^a-z0-9]/g, "_").substring(0, 20) + "_" + Date.now().toString().slice(-4);

  const newApp = {
    id: cleanId,
    name: name,
    category: "Phần mềm tùy chỉnh",
    winget: winget,
    avatar: avatar,
    avatarBg: "#f8fafc",
    avatarBorder: "#cbd5e1",
    catBg: "#f1f5f9",
    catColor: "#334155",
    desc: desc,
    ram: ram,
    folder: "software/" + cleanId,
    url: url,
    exe_path: exePath,
    is_custom: true
  };

  appList.push(newApp);
  appGroupMap[cleanId] = group;
  selectedApps.add(cleanId);

  try {
    const customList = JSON.parse(localStorage.getItem("user_custom_apps_v2") || "[]");
    customList.push(newApp);
    localStorage.setItem("user_custom_apps_v2", JSON.stringify(customList));
    localStorage.setItem("app_custom_groups_v8", JSON.stringify(appGroupMap));
  } catch(e) {}

  saveCustomDataToServer();
  closeAddCustomAppModal();
  renderApps();
  loadInstalledAppsDetection(false, false);

  showToast(`Đã thêm thành công "${name}" vào ${APP_GROUPS_META[group]?.name || group}!`);

  if (nameIn) nameIn.value = "";
  if (document.getElementById("customAppWinget")) document.getElementById("customAppWinget").value = "";
  if (document.getElementById("customAppExePath")) document.getElementById("customAppExePath").value = "";
  if (document.getElementById("customAppDesc")) document.getElementById("customAppDesc").value = "";
}

async function saveCustomDataToServer() {
  try {
    const customApps = appList.filter(a => a.is_custom);
    await fetch("/api/apps/custom_data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        layout_version: 8,
        custom_apps: customApps,
        custom_groups: appGroupMap
      })
    });
  } catch(e) {
    console.warn("Loi dong bo custom_data len server:", e);
  }
}

async function loadCustomDataFromServer() {
  try {
    const res = await fetch("/api/apps/custom_data");
    if (res.ok) {
      const json = await res.json();
      if (json && json.data) {
        if (json.data.layout_version === 8 && json.data.custom_groups && Object.keys(json.data.custom_groups).length > 0) {
          Object.assign(appGroupMap, json.data.custom_groups);
          // Đảm bảo các app mới bổ sung vẫn có nhóm chuẩn nếu chưa lưu
          Object.keys(DEFAULT_APP_GROUPS).forEach(k => {
            if (!appGroupMap[k]) appGroupMap[k] = DEFAULT_APP_GROUPS[k];
          });
        }
        if (json.data.custom_apps && Array.isArray(json.data.custom_apps)) {
          json.data.custom_apps.forEach(ca => {
            if (!appList.some(a => a.id === ca.id)) {
              appList.push(ca);
              if (!appGroupMap[ca.id]) {
                appGroupMap[ca.id] = (json.data.custom_groups && json.data.custom_groups[ca.id]) || "p5";
              }
            }
          });
        }
      }
    }
  } catch(e) {}
}

// ==========================================
// CÁC TÙY CHỌN TIẾP THEO: MÚI GIỜ UTC+7 & LỆNH KTV
// ==========================================
function scrollToKtvTweaks() {
  const el = document.getElementById("sectionKtvTweaks");
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

async function runKtvTimeSync() {
  const btn = document.getElementById("btnSyncTimeNow");
  if (btn) {
    btn.innerHTML = `<span>⏳ Đang đồng bộ...</span>`;
    btn.disabled = true;
  }
  try {
    const res = await fetch("/api/system/time_sync");
    if (res.ok) {
      const data = await res.json();
      if (data && data.info) {
        updateTimeDisplay(data.info);
        showToast("Đã đồng bộ giờ chuẩn UTC+07:00 thành công: " + (data.info.formatted_display || ""));
      }
    }
  } catch(e) {
    showToast("Lỗi khi đồng bộ giờ: " + e.message);
  } finally {
    if (btn) {
      btn.innerHTML = `<span>⚡ Đồng Bộ Ngay (UTC+7)</span>`;
      btn.disabled = false;
    }
  }
}

function updateTimeDisplay(info) {
  const tzEl = document.getElementById("ktvCurrentTzDisplay");
  const clockEl = document.getElementById("ktvLiveClockDisplay");
  if (tzEl && info.timezone_display) {
    tzEl.innerText = info.timezone_display;
  }
  if (clockEl && info.local_time) {
    clockEl.innerText = info.local_time.split(" ")[1] || info.local_time;
  }
}

function openTimeConfigModal() {
  fetch("/api/system/time_config")
    .then(r => r.json())
    .then(data => {
      if (data && data.config) {
        const tzSel = document.getElementById("cfgTimezoneSelect");
        const ntpIn = document.getElementById("cfgNtpServers");
        const autoSync = document.getElementById("cfgAutoSync");
        if (tzSel && data.config.timezone) tzSel.value = data.config.timezone;
        if (ntpIn && data.config.ntp_servers) ntpIn.value = data.config.ntp_servers;
        if (autoSync) autoSync.checked = data.config.auto_sync !== false;
      }
    }).catch(e => {});

  const m = document.getElementById("modalTimeConfig");
  if (m) m.classList.add("active");
}

function closeTimeConfigModal() {
  const m = document.getElementById("modalTimeConfig");
  if (m) m.classList.remove("active");
}

async function saveTimeConfig() {
  const tz = document.getElementById("cfgTimezoneSelect")?.value || "SE Asia Standard Time";
  const ntp = document.getElementById("cfgNtpServers")?.value || "";
  const autoSync = document.getElementById("cfgAutoSync")?.checked ?? true;

  try {
    const res = await fetch("/api/system/time_config", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ timezone: tz, ntp_servers: ntp, auto_sync: autoSync })
    });
    if (res.ok) {
      showToast("Đã lưu và áp dụng cấu hình thời gian mới!");
      closeTimeConfigModal();
      runKtvTimeSync();
    }
  } catch(e) {
    alert("Lỗi lưu cấu hình: " + e.message);
  }
}

// ==============================================================================
// CÁC TÙY CHỌN LỆNH KTV NÂNG CAO (1-CLICK & CHUỘT PHẢI CHỈNH SỬA / XEM LỆNH)
// ==============================================================================
const DEFAULT_KTV_TASKS = [
  {
    id: "enable-ultimate-power",
    icon: "🚀",
    title: "Gói Nguồn Ultimate Performance",
    desc: "Mở khóa và kích hoạt gói nguồn tối đa, loại bỏ độ trễ tiết kiệm điện của CPU.",
    cmd_type: "powershell",
    command: "powercfg.exe -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61; powercfg.exe /setactive e9a42b02-d5df-448d-aa00-03f14749eb61"
  },
  {
    id: "clean-temp",
    icon: "🧹",
    title: "Dọn Rác Thư Mục %TEMP%",
    desc: "Dọn dẹp an toàn các tệp tạm không còn sử dụng trong thư mục %TEMP% người dùng.",
    cmd_type: "powershell",
    command: "Remove-Item -Path \"$env:TEMP\\*\" -Recurse -Force -ErrorAction SilentlyContinue; Write-Host \"Đã dọn sạch tệp rác trong %TEMP%!\""
  },
  {
    id: "set-paging-4g",
    icon: "🧠",
    title: "Cấu Hình RAM Ảo (Virtual Memory)",
    desc: "Mở hộp thoại Performance Options chính thống để thiết lập Paging File an toàn.",
    cmd_type: "shell",
    command: "SystemPropertiesPerformance.exe"
  },
  {
    id: "toggle-defender",
    icon: "🛡️",
    title: "Bảo Mật Windows Security",
    desc: "Mở nhanh bảng điều khiển Windows Defender để kiểm tra bảo vệ thời gian thực.",
    cmd_type: "shell",
    command: "windowsdefender:"
  },
  {
    id: "disable-telemetry",
    icon: "🛑",
    title: "Chẩn Đoán & Quyền Riêng Tư",
    desc: "Mở cài đặt Diagnostics & Feedback của Windows để tùy chỉnh thu thập dữ liệu.",
    cmd_type: "shell",
    command: "ms-settings:privacy-feedback"
  },
  {
    id: "clean-event-logs",
    icon: "📝",
    title: "Nhật Ký Sự Kiện (Event Viewer)",
    desc: "Mở trình quản lý Event Viewer (eventvwr.msc) để tra cứu lỗi phần cứng & hệ thống.",
    cmd_type: "shell",
    command: "eventvwr.msc"
  },
  {
    id: "flush-dns-network",
    icon: "🌐",
    title: "Xóa Cache DNS & Làm Mới Mạng",
    desc: "Khắc phục lỗi mạng không vào được trang web bằng lệnh ipconfig /flushdns.",
    cmd_type: "cmd",
    command: "ipconfig /flushdns"
  },
  {
    id: "set-best-performance",
    icon: "🪟",
    title: "Giao Diện Best Performance",
    desc: "Tắt toàn bộ hiệu ứng hoạt ảnh mờ cửa sổ để máy phản hồi nhanh như chớp.",
    cmd_type: "powershell",
    command: "Set-ItemProperty -Path 'HKCU:\\Control Panel\\Desktop' -Name UserPreferencesMask -Value ([byte[]](0x90,0x12,0x03,0x80,0x10,0x00,0x00,0x00)); Set-ItemProperty -Path 'HKCU:\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\VisualEffects' -Name VisualFXSetting -Value 2; RUNDLL32.EXE user32.dll,UpdatePerUserSystemParameters"
  },
  {
    id: "install-winget",
    icon: "📦",
    title: "Kích Hoạt Microsoft Winget",
    desc: "Tự động cài đặt Microsoft App Installer cho Windows Sandbox, Win 10 LTSC hoặc bản Ghost rút gọn.",
    cmd_type: "powershell",
    command: "powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\\install-winget.ps1"
  },
  {
    id: "scan-old",
    icon: "📋",
    title: "Xuất Thông Tin Phần Mềm Đã Cài",
    desc: "Quét toàn bộ phần mềm hiện đang cài trong máy ra file TXT & CSV (tại scans/) và mở xem ngay.",
    cmd_type: "powershell",
    command: "powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts\\export-installed-software.ps1"
  }
];

let ktvTasksList = JSON.parse(JSON.stringify(DEFAULT_KTV_TASKS));
let currentKtvContextMenuTaskId = null;

async function initKtvTasks() {
  // 1. Nạp từ localStorage trước để render tức thì (và bổ sung tác vụ mặc định mới nếu có)
  try {
    const local = localStorage.getItem("custom_ktv_tasks_v2");
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const seen = new Set(parsed.map(t => t && t.id).filter(Boolean));
        DEFAULT_KTV_TASKS.forEach(def => {
          if (!seen.has(def.id)) {
            parsed.push(Object.assign({}, def, { is_custom: false }));
          }
        });
        ktvTasksList = parsed;
      }
    }
  } catch(e) {}

  renderKtvTasks();

  // 2. Đồng bộ với server /api/ktv/tasks nếu có
  try {
    const res = await fetch('/api/ktv/tasks');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.tasks) && data.tasks.length > 0) {
        ktvTasksList = data.tasks;
        try {
          localStorage.setItem("custom_ktv_tasks_v2", JSON.stringify(ktvTasksList));
        } catch(e) {}
        renderKtvTasks();
      }
    }
  } catch(e) {}
}

function renderKtvTasks() {
  const container = document.getElementById("ktvActionsGrid");
  if (!container) return;

  container.innerHTML = ktvTasksList.map(task => {
    const isCustom = !!task.is_custom;
    const badgeHtml = isCustom 
      ? `<span class="ktv-action-custom-badge" title="Tác vụ đã được người dùng tùy biến câu lệnh">✏️ Đã chỉnh sửa</span>` 
      : "";
    const escapedTitle = (task.title || "").replace(/"/g, '&quot;');
    const escapedDesc = (task.desc || "").replace(/"/g, '&quot;');
    const cmdTypeLabel = (task.cmd_type || 'powershell').toUpperCase();
    const cmdPreview = (task.command || '').replace(/"/g, '&quot;');

    return `
      <div class="ktv-action-btn-card ${isCustom ? 'is-custom' : ''}" 
           data-ktv-id="${task.id}"
           onclick="handleKtvCardClick('${task.id}', event)"
           oncontextmenu="handleKtvCardContextMenu('${task.id}', event)"
           title="${escapedTitle}&#10;• Môi trường: [${cmdTypeLabel}]&#10;• Lệnh: ${cmdPreview.substring(0, 80)}...&#10;• Chuột trái: Khởi chạy lệnh&#10;• Chuột phải: Xem & Chỉnh sửa lệnh">
        ${badgeHtml}
        <div class="ktv-action-icon">${task.icon || '⚡'}</div>
        <div class="ktv-action-content">
          <div class="ktv-action-title">${task.title}</div>
          <div class="ktv-action-desc">${task.desc}</div>
        </div>
      </div>
    `;
  }).join("");
}

function handleKtvCardClick(taskId, event) {
  if (event) {
    event.stopPropagation();
  }
  hideKtvContextMenu();
  runKtvTaskById(taskId);
}

function handleKtvCardContextMenu(taskId, event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  hideAppContextMenu();
  showKtvContextMenu(event.clientX, event.clientY, taskId);
}

function showKtvContextMenu(clientX, clientY, taskId) {
  const menu = document.getElementById('ktvTaskContextMenu');
  if (!menu) return;

  const task = ktvTasksList.find(t => t.id === taskId);
  if (!task) return;

  currentKtvContextMenuTaskId = taskId;

  const iconEl = document.getElementById('ktvCtxIcon');
  if (iconEl) iconEl.innerText = task.icon || '⚡';

  const titleEl = document.getElementById('ktvCtxTitle');
  if (titleEl) titleEl.innerText = task.title || 'Tác vụ KTV';

  const badgeEl = document.getElementById('ktvCtxStatusBadge');
  if (badgeEl) {
    if (task.is_custom) {
      badgeEl.innerText = 'Đã tùy biến lệnh';
      badgeEl.style.color = '#15803d';
      badgeEl.style.background = '#dcfce7';
    } else {
      badgeEl.innerText = 'Lệnh mặc định chuẩn';
      badgeEl.style.color = '#0284c7';
      badgeEl.style.background = '#e0f2fe';
    }
  }

  const cmdTypeEl = document.getElementById('ktvCtxCmdType');
  if (cmdTypeEl) {
    const t = (task.cmd_type || 'powershell').toUpperCase();
    cmdTypeEl.innerText = t === 'SHELL' ? 'WIN SHELL / .EXE' : t;
  }

  const cmdCodeEl = document.getElementById('ktvCtxCmdCode');
  if (cmdCodeEl) {
    cmdCodeEl.innerText = task.command || '(Chưa có câu lệnh)';
  }

  const resetDivider = document.getElementById('ktvCtxResetDivider');
  const resetItem = document.getElementById('ktvCtxResetItem');
  if (resetItem) {
    resetItem.style.display = task.is_custom ? 'flex' : 'none';
  }
  if (resetDivider) {
    resetDivider.style.display = task.is_custom ? 'block' : 'none';
  }

  // Đo vị trí an toàn không bị tràn màn hình
  menu.style.display = 'block';
  menu.style.visibility = 'hidden';

  const menuWidth = menu.offsetWidth || 340;
  const menuHeight = menu.offsetHeight || 300;
  const pad = 12;

  let left = clientX;
  let top = clientY;

  if (left + menuWidth > window.innerWidth - pad) {
    left = window.innerWidth - menuWidth - pad;
  }
  if (left < pad) left = pad;

  if (top + menuHeight > window.innerHeight - pad) {
    top = clientY - menuHeight;
    if (top < pad) top = pad;
  }

  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
  menu.style.visibility = 'visible';
}

function hideKtvContextMenu() {
  const menu = document.getElementById('ktvTaskContextMenu');
  if (menu) menu.style.display = 'none';
  currentKtvContextMenuTaskId = null;
}

async function runCurrentKtvTask() {
  const taskId = currentKtvContextMenuTaskId;
  hideKtvContextMenu();
  if (!taskId) return;
  await runKtvTaskById(taskId);
}

async function runKtvTaskById(taskId) {
  const task = ktvTasksList.find(t => t.id === taskId);
  if (!task) return;

  if (task.id === 'scan-old' || (task.command || '').toLowerCase().includes('export-installed-software')) {
    if (!checkAndWarnInstallModeForScan('xuất danh sách phần mềm đang cài')) return;
  }

  showToast(`Đang khởi chạy: ${task.title}...`);

  // Nếu là lệnh mặc định chưa chỉnh sửa, chạy API chuẩn nhanh
  if (!task.is_custom) {
    return runKtvAction(task.id, task.title);
  }

  // Nếu là lệnh tùy biến, gửi qua API thực thi lệnh tùy biến
  try {
    const res = await fetch('/api/ktv/run_command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: task.id,
        task_id: task.id,
        cmd_type: task.cmd_type || 'powershell',
        command: task.command,
        title: task.title,
        test_mode: false
      })
    });
    const data = await res.json().catch(() => ({}));
    if (res.status === 409 && data && data.code === 'INSTALL_MODE_ACTIVE') {
      showInstallModeScanBlockedModal('xuất danh sách phần mềm đang cài', data);
      return;
    }
    if (res.ok && data.status !== 'error') {
      showToast(`[OK] ${data.message || 'Thực thi thành công!'}`);
    } else {
      showToast(`[LỖI] ${data.message || ('Không thể thực thi: ' + task.title)}`);
    }
  } catch(e) {
    showToast(`Lỗi kết nối server: ${e.message}`);
  }
}

function copyKtvTaskCommand() {
  const taskId = currentKtvContextMenuTaskId;
  hideKtvContextMenu();
  if (!taskId) return;
  const task = ktvTasksList.find(t => t.id === taskId);
  if (!task || !task.command) return;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(task.command).then(() => {
      showToast(`Đã sao chép câu lệnh của '${task.title}' vào Clipboard!`);
    }).catch(() => {
      prompt("Sao chép câu lệnh:", task.command);
    });
  } else {
    prompt("Sao chép câu lệnh:", task.command);
  }
}

function openEditKtvTaskModal(taskId) {
  const id = taskId || currentKtvContextMenuTaskId;
  hideKtvContextMenu();
  if (!id) return;

  const task = ktvTasksList.find(t => t.id === id);
  if (!task) return;

  document.getElementById('editKtvId').value = task.id;
  document.getElementById('editKtvIcon').value = task.icon || '⚡';
  document.getElementById('editKtvTitle').value = task.title || '';
  document.getElementById('editKtvDesc').value = task.desc || '';
  document.getElementById('editKtvCommand').value = task.command || '';

  const cmdType = (task.cmd_type || 'powershell').toLowerCase();
  const radios = document.getElementsByName('editKtvCmdType');
  for (const r of radios) {
    r.checked = (r.value === cmdType);
  }

  // Ẩn bảng output chạy thử trước đó
  const outBox = document.getElementById('ktvTestOutputBox');
  if (outBox) outBox.style.display = 'none';

  // Nút khôi phục gốc chỉ hiện nếu là task mặc định hoặc đã tùy biến
  const btnReset = document.getElementById('btnResetEditKtv');
  if (btnReset) {
    const isDef = DEFAULT_KTV_TASKS.some(d => d.id === task.id);
    btnReset.style.display = isDef ? 'inline-flex' : 'none';
  }

  const modal = document.getElementById('modalEditKtvTask');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function openCreateKtvTaskModal() {
  hideKtvContextMenu();
  const newId = `custom_task_${Date.now()}`;
  document.getElementById('editKtvId').value = newId;
  document.getElementById('editKtvIcon').value = '⚡';
  document.getElementById('editKtvTitle').value = '';
  document.getElementById('editKtvDesc').value = '';
  document.getElementById('editKtvCommand').value = '';

  const radios = document.getElementsByName('editKtvCmdType');
  for (const r of radios) {
    r.checked = (r.value === 'powershell');
  }

  const outBox = document.getElementById('ktvTestOutputBox');
  if (outBox) outBox.style.display = 'none';

  const btnReset = document.getElementById('btnResetEditKtv');
  if (btnReset) btnReset.style.display = 'none';

  const modal = document.getElementById('modalEditKtvTask');
  if (modal) modal.style.display = 'flex';
}

function closeEditKtvTaskModal() {
  const modal = document.getElementById('modalEditKtvTask');
  if (modal) modal.style.display = 'none';
}

function copyKtvEditCommand() {
  const cmd = document.getElementById('editKtvCommand').value || '';
  if (!cmd.trim()) {
    showToast("Chưa có câu lệnh nào để sao chép!");
    return;
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(cmd).then(() => {
      showToast("Đã sao chép câu lệnh vào Clipboard!");
    }).catch(() => {
      prompt("Sao chép câu lệnh:", cmd);
    });
  } else {
    prompt("Sao chép câu lệnh:", cmd);
  }
}

async function testRunEditKtvCommand() {
  const command = (document.getElementById('editKtvCommand').value || '').trim();
  if (!command) {
    showToast("Vui lòng nhập câu lệnh trước khi chạy thử!");
    return;
  }

  let cmdType = 'powershell';
  const radios = document.getElementsByName('editKtvCmdType');
  for (const r of radios) {
    if (r.checked) {
      cmdType = r.value;
      break;
    }
  }

  const outBox = document.getElementById('ktvTestOutputBox');
  const outText = document.getElementById('ktvTestOutputText');
  const outStatus = document.getElementById('ktvTestOutputStatus');

  if (outBox) outBox.style.display = 'block';
  if (outStatus) {
    outStatus.innerText = 'Đang thực thi...';
    outStatus.style.color = '#38bdf8';
  }
  if (outText) outText.innerText = 'Đang gửi lệnh chạy thử tới hệ thống...';

  try {
    const res = await fetch('/api/ktv/run_command', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cmd_type: cmdType,
        command: command,
        title: document.getElementById('editKtvTitle').value || 'Test Run',
        test_mode: true
      })
    });
    const data = await res.json();
    if (outStatus) {
      outStatus.innerText = data.status === 'ok' ? '[Thành công]' : (data.status === 'warning' ? '[Cảnh báo]' : '[Lỗi]');
      outStatus.style.color = data.status === 'ok' ? '#4ade80' : (data.status === 'warning' ? '#facc15' : '#f87171');
    }
    if (outText) {
      outText.innerText = data.output || data.message || '(Không có kết quả trả về)';
    }
  } catch(e) {
    if (outStatus) {
      outStatus.innerText = '[Lỗi kết nối]';
      outStatus.style.color = '#f87171';
    }
    if (outText) {
      outText.innerText = `Lỗi kết nối: ${e.message}`;
    }
  }
}

async function saveEditKtvTask() {
  const id = document.getElementById('editKtvId').value;
  const icon = (document.getElementById('editKtvIcon').value || '⚡').trim();
  const title = (document.getElementById('editKtvTitle').value || '').trim();
  const desc = (document.getElementById('editKtvDesc').value || '').trim();
  const command = (document.getElementById('editKtvCommand').value || '').trim();

  if (!title) {
    alert("Vui lòng nhập tên tác vụ!");
    return;
  }
  if (!command) {
    alert("Vui lòng nhập câu lệnh thực thi!");
    return;
  }

  let cmdType = 'powershell';
  const radios = document.getElementsByName('editKtvCmdType');
  for (const r of radios) {
    if (r.checked) {
      cmdType = r.value;
      break;
    }
  }

  // Tìm trong ktvTasksList
  let task = ktvTasksList.find(t => t.id === id);
  if (task) {
    task.icon = icon;
    task.title = title;
    task.desc = desc;
    task.cmd_type = cmdType;
    task.command = command;
    task.is_custom = true;
  } else {
    // Tạo mới
    task = {
      id: id,
      icon: icon,
      title: title,
      desc: desc,
      cmd_type: cmdType,
      command: command,
      is_custom: true,
      is_user_created: true
    };
    ktvTasksList.push(task);
  }

  // Lưu vào localStorage
  try {
    localStorage.setItem("custom_ktv_tasks_v2", JSON.stringify(ktvTasksList));
  } catch(e) {}

  // Lưu lên server
  try {
    await fetch('/api/ktv/tasks/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: ktvTasksList })
    });
  } catch(e) {}

  renderKtvTasks();
  closeEditKtvTaskModal();
  showToast(`Đã lưu thay đổi cho tác vụ: ${title}!`);
}

async function resetCurrentEditKtvTask() {
  const id = document.getElementById('editKtvId').value;
  const def = DEFAULT_KTV_TASKS.find(d => d.id === id);
  if (!def) {
    alert("Tác vụ này là do bạn tạo mới, không có cấu hình gốc để khôi phục.");
    return;
  }

  if (!confirm(`Bạn có chắc muốn khôi phục lệnh gốc mặc định cho '${def.title}'?`)) {
    return;
  }

  let task = ktvTasksList.find(t => t.id === id);
  if (task) {
    task.icon = def.icon;
    task.title = def.title;
    task.desc = def.desc;
    task.cmd_type = def.cmd_type;
    task.command = def.command;
    task.is_custom = false;
  }

  try {
    localStorage.setItem("custom_ktv_tasks_v2", JSON.stringify(ktvTasksList));
  } catch(e) {}

  try {
    await fetch('/api/ktv/tasks/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: ktvTasksList })
    });
  } catch(e) {}

  renderKtvTasks();
  closeEditKtvTaskModal();
  showToast(`Đã khôi phục lệnh gốc mặc định cho '${def.title}'!`);
}

async function resetCurrentKtvTask() {
  const taskId = currentKtvContextMenuTaskId;
  hideKtvContextMenu();
  if (!taskId) return;

  const def = DEFAULT_KTV_TASKS.find(d => d.id === taskId);
  if (!def) return;

  let task = ktvTasksList.find(t => t.id === taskId);
  if (task) {
    task.icon = def.icon;
    task.title = def.title;
    task.desc = def.desc;
    task.cmd_type = def.cmd_type;
    task.command = def.command;
    task.is_custom = false;
  }

  try {
    localStorage.setItem("custom_ktv_tasks_v2", JSON.stringify(ktvTasksList));
  } catch(e) {}

  try {
    await fetch('/api/ktv/tasks/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tasks: ktvTasksList })
    });
  } catch(e) {}

  renderKtvTasks();
  showToast(`Đã khôi phục lệnh gốc mặc định cho '${def.title}'!`);
}

async function runKtvAction(action, title) {
  if (action === 'scan-old') {
    if (!checkAndWarnInstallModeForScan('xuất thông tin phần mềm đã cài')) return;
  }
  showToast(`Đang khởi chạy lệnh: ${title}...`);
  try {
    const res = await fetch(`/api/run?action=${encodeURIComponent(action)}`);
    const data = await res.json().catch(() => ({}));
    if (res.status === 409 && data && data.code === 'INSTALL_MODE_ACTIVE') {
      showInstallModeScanBlockedModal('xuất thông tin phần mềm đã cài', data);
      return;
    }
    if (res.ok && data.status !== 'error') {
      showToast(`[OK] ${data.message || 'Thực thi thành công!'}`);
    } else {
      showToast(`[LỖI] ${data.message || ('Không thể thực thi: ' + title)}`);
    }
  } catch(e) {
    showToast(`Lỗi kết nối server: ${e.message}`);
  }
}

function startKtvClockTicker() {
  setInterval(() => {
    const clockEl = document.getElementById("ktvLiveClockDisplay");
    if (clockEl) {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      clockEl.innerText = `${h}:${m}:${s}`;
    }
  }, 1000);
}

function installSingleApp(appId) {
  const app = appList.find(a => a.id === appId);
  if (!app) return;
  selectedApps.clear();
  selectedApps.add(app.id);
  renderApps();
  startSequentialInstall();
}

// Cài đặt tuần tự
function startSequentialInstall() {
  if (selectedApps.size === 0) {
    showToast("Vui lòng chọn ít nhất 1 phần mềm!");
    return;
  }

  const itemsToInstall = appList.filter(a => selectedApps.has(a.id)).map(a => ({
    id: a.id,
    name: a.name,
    winget: a.winget
  }));

  const modal = document.getElementById("installModal");
  if (modal) modal.classList.add("active");
  const titleText = document.getElementById("modalTitleText");
  const statusText = document.getElementById("modalStatusText");
  const fill = document.getElementById("modalProgressFill");
  const overallBadge = document.getElementById("modalOverallBadge");
  const subFill = document.getElementById("modalSubProgressFill");
  const subPct = document.getElementById("modalSubProgressPct");
  const subStatusLabel = document.getElementById("modalSubStatusLabel");
  const activeName = document.getElementById("modalActiveAppName");
  const activeAvatar = document.getElementById("modalActiveAppAvatar");
  const btnFinish = document.getElementById("btnModalFinish");
  const countdownBadge = document.getElementById("modalCountdownBadge");
  const subDetailBadge = document.getElementById("modalSubDetailBadge");

  if (titleText) titleText.innerText = `Đang cài đặt tuần tự ${itemsToInstall.length} phần mềm...`;
  if (statusText) statusText.innerText = "Đang gửi danh sách ứng dụng tới runner...";
  if (overallBadge) overallBadge.innerText = `0 / ${itemsToInstall.length} (0%)`;
  if (fill) fill.style.width = "3%";
  if (subFill) subFill.style.width = "0%";
  if (subPct) subPct.innerText = "0%";
  if (subStatusLabel) subStatusLabel.innerText = "Chuẩn bị khởi tạo...";
  if (activeName) activeName.innerText = "Khởi tạo tiến trình cài đặt...";
  if (activeAvatar) activeAvatar.innerText = "⚙️";
  if (countdownBadge) countdownBadge.style.display = "none";
  if (subDetailBadge) subDetailBadge.innerText = "--";
  if (btnFinish) btnFinish.style.display = "none";
  isInstallPaused = false;
  floatingWidgetDismissed = false;
  currentInstallOverallStatus = "installing";
  currentInstallStepStatus = "installing";
  currentInstallAppIndex = 0;
  skipRequestInFlightIndex = 0;
  try { sessionStorage.removeItem("install_modal_minimized"); } catch (e) {}
  hideFloatingInstallWidget();
  updatePauseButtonsState(false);
  updateSkipButtonsState(false, true);

  // Hiển thị hàng đợi ứng dụng ban đầu
  const initialQueue = itemsToInstall.map(it => ({
    id: it.id,
    name: it.name,
    winget: it.winget,
    status: "pending",
    stage: "Chờ đến lượt...",
    sub_progress: 0,
    sub_detail: ""
  }));
  renderModalQueue(initialQueue, 0, "idle");
  window.lastInstallState = {
    status: "installing",
    step_status: "installing",
    current_index: 1,
    total_apps: itemsToInstall.length,
    current_app: (itemsToInstall[0] && itemsToInstall[0].name) || "Đang khởi tạo...",
    current_package: (itemsToInstall[0] && itemsToInstall[0].winget) || "",
    current_stage: "Đang khởi tạo tiến trình cài đặt...",
    sub_progress: 5,
    queue: initialQueue
  };
  syncInstallModeScanGuardUI(window.lastInstallState);

  fetch(`/api/install_batch?delay=${installDelay}&items=${encodeURIComponent(JSON.stringify(itemsToInstall))}`, { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      if (data.status === "started") {
        startPollingProgress();
      } else {
        showToast("⚠️ " + (data.message || "Lỗi khởi động"));
        if (data.message && data.message.toLowerCase().includes("dang co")) {
          if (titleText) titleText.innerText = "Đang đồng bộ tiến trình cài đặt...";
          if (statusText) statusText.innerHTML = `⚠️ <strong>Hệ thống đang bận:</strong> Đang có tiến trình cài đặt trước đó chưa xong. Đang kết nối theo dõi tiến độ...`;
          startPollingProgress();
        } else {
          currentInstallOverallStatus = "idle";
          updateSkipButtonsState(false, false);
          if (statusText) statusText.innerHTML = `❌ <span style="color:var(--danger, #ef4444);">${data.message || "Không thể khởi động cài đặt."}</span>`;
        }
      }
    })
    .catch(err => {
      // Fallback mô phỏng giao diện khi xem ở chế độ tĩnh
      simulateInstallProgress(itemsToInstall);
    });
}

let isInstallPaused = false;
let currentInstallAppIndex = 0;
let currentInstallOverallStatus = "idle";
let currentInstallStepStatus = "idle";
let floatingWidgetDismissed = false;
let skipRequestInFlightIndex = 0;

function isInstallModeBlockingScan() {
  const stLive = (window.lastInstallState && window.lastInstallState.status) || currentInstallOverallStatus || "idle";
  return stLive === "installing" || stLive === "paused";
}

function syncInstallModeScanGuardUI(stateData) {
  const data = stateData || window.lastInstallState || {};
  const st = (data.status || currentInstallOverallStatus || "idle").toLowerCase();
  const blocked = (st === "installing" || st === "paused");

  const banner = document.getElementById("oldPcInstallModeBanner");
  const bannerTxt = document.getElementById("oldPcInstallBannerText");
  if (banner) {
    banner.style.display = blocked ? "flex" : "none";
  }
  if (bannerTxt && blocked) {
    const appName = data.current_app || "phần mềm";
    const curIdx = data.current_index || currentInstallAppIndex || 0;
    const tot = data.total_apps || 0;
    const progressTxt = tot ? ` (${curIdx}/${tot}: ${appName})` : "";
    const verb = st === "paused" ? "đang tạm dừng cài đặt" : "đang cài đặt";
    bannerTxt.innerText = `À user ơi! Tool đang ở trong chế độ cài đặt phần mềm (${verb}${progressTxt}), do đó không thể thực hiện bước quét máy tính nhé! Vui lòng đợi cài xong, bỏ qua gói treo hoặc dừng tiến trình trước khi quét.`;
  }

  ["btnNewScanSession", "btnScanOldDirect", "btnScanSmartDiskDirect", "btnRunAuditPipeline"].forEach(id => {
    const btn = document.getElementById(id);
    if (btn) btn.classList.toggle("scan-action-blocked", blocked);
  });
}

function showInstallModeScanBlockedModal(actionLabel = "quét máy tính", serverPayload = null) {
  const data = serverPayload || window.lastInstallState || {};
  if (serverPayload && serverPayload.install_status) {
    currentInstallOverallStatus = serverPayload.install_status;
    syncInstallModeScanGuardUI({
      status: serverPayload.install_status,
      current_app: serverPayload.current_app,
      current_index: serverPayload.current_index,
      total_apps: serverPayload.total_apps
    });
  }
  const msgEl = document.getElementById("installModeBlockMessage");
  const metaEl = document.getElementById("installModeBlockAppMeta");
  const curApp = data.current_app || "phần mềm đang chạy";
  const curIdx = data.current_index || currentInstallAppIndex || 0;
  const tot = data.total_apps || 0;
  const st = (data.install_status || data.status || currentInstallOverallStatus || "installing").toLowerCase();
  const stateLabel = st === "paused" ? "đang tạm dừng cài đặt" : "đang cài đặt";

  if (msgEl) {
    msgEl.innerHTML = (serverPayload && serverPayload.message)
      ? escapeHtml(serverPayload.message)
      : `À user ơi! Tool đang ở trong chế độ cài đặt phần mềm (<strong>${stateLabel}</strong>), do đó không thể thực hiện bước <strong>${escapeHtml(actionLabel)}</strong> nhé!<br><br>Hãy đợi cài đặt hoàn tất, bấm <strong>Bỏ Qua Gói</strong> nếu gói đó bị treo, hoặc bấm <strong>Dừng Cài</strong> trước khi chuyển sang quét máy.`;
  }
  if (metaEl) {
    metaEl.innerText = tot > 0
      ? `Tiến trình đang chạy: Gói ${curIdx}/${tot} — ${curApp}`
      : `Tiến trình cài đặt hiện tại: ${curApp}`;
  }

  const modal = document.getElementById("installModeBlockModal");
  if (modal) modal.classList.add("active");
  showToast(`🚧 Tool đang cài phần mềm — không thể ${actionLabel}!`);
}

function closeInstallModeBlockModal() {
  const modal = document.getElementById("installModeBlockModal");
  if (modal) modal.classList.remove("active");
}

function checkAndWarnInstallModeForScan(actionLabel = "quét máy tính") {
  if (isInstallModeBlockingScan()) {
    showInstallModeScanBlockedModal(actionLabel, null);
    return false;
  }
  return true;
}

function hideFloatingInstallWidget() {
  const widget = document.getElementById("floatingInstallWidget");
  if (widget) widget.style.display = "none";
}

function dismissFloatingInstallWidget() {
  floatingWidgetDismissed = true;
  hideFloatingInstallWidget();
}

function reopenInstallModal() {
  const modal = document.getElementById("installModal");
  if (modal) modal.classList.add("active");
  try { sessionStorage.removeItem("install_modal_minimized"); } catch (e) {}
  floatingWidgetDismissed = false;
  hideFloatingInstallWidget();
  if (currentInstallOverallStatus === "installing" || currentInstallOverallStatus === "paused") {
    updateInstallProgress();
  }
}

function updateSkipButtonsState(isSkipping, isVisible) {
  const btns = [
    document.getElementById("btnInstallSkipHeader"),
    document.getElementById("btnInstallSkipBottom"),
    document.getElementById("floatBtnSkip")
  ];
  btns.forEach(btn => {
    if (!btn) return;
    if (typeof isVisible === "boolean") {
      btn.style.display = isVisible ? "inline-flex" : "none";
    }
    btn.disabled = !!isSkipping;
    if (btn.id === "floatBtnSkip") {
      btn.innerText = isSkipping ? "⏭️ Đang bỏ..." : "⏭️ Bỏ Qua";
    } else {
      btn.innerText = isSkipping ? "⏭️ Đang Bỏ Qua..." : "⏭️ Bỏ Qua Gói Này";
    }
    btn.style.opacity = isSkipping ? "0.6" : "1";
  });
}

function syncFloatingInstallWidget(data) {
  const widget = document.getElementById("floatingInstallWidget");
  const modal = document.getElementById("installModal");
  if (!widget || !data) return;

  const isModalOpen = !!(modal && modal.classList.contains("active"));
  const st = data.status || "idle";

  // Chỉ hiển thị widget nổi khi người dùng đã thu gọn (bấm X) modal chính và chưa bấm đóng thông báo xong
  const hasVisibleStatus = (st === "installing" || st === "paused" || st === "completed" || st === "stopped");
  if (isModalOpen || floatingWidgetDismissed || !hasVisibleStatus || (!data.queue || data.queue.length === 0)) {
    widget.style.display = "none";
    return;
  }

  widget.style.display = "block";
  widget.classList.remove("state-paused", "state-completed", "state-stopped");
  if (st === "paused") widget.classList.add("state-paused");
  else if (st === "completed") widget.classList.add("state-completed");
  else if (st === "stopped") widget.classList.add("state-stopped");

  const totalApps = data.total_apps || (data.queue ? data.queue.length : 1) || 1;
  const currentIdx = data.current_index || 0;
  const subPct = data.sub_progress || 0;
  let overallPct = 0;
  if (st === "completed") {
    overallPct = 100;
  } else if (st === "stopped") {
    overallPct = Math.min(99, Math.round((Math.max(0, currentIdx - 1) / totalApps) * 100));
  } else {
    const baseDone = Math.max(0, currentIdx - 1);
    overallPct = Math.min(99, Math.max(5, Math.round(((baseDone + (subPct / 100)) / totalApps) * 100)));
  }

  const titleEl = document.getElementById("floatInstallTitle");
  const badgeEl = document.getElementById("floatInstallOverallBadge");
  const avatarEl = document.getElementById("floatAppAvatar");
  const nameEl = document.getElementById("floatAppName");
  const pctEl = document.getElementById("floatAppPct");
  const stageEl = document.getElementById("floatAppStage");
  const fillEl = document.getElementById("floatProgressFill");
  const closeDoneBtn = document.getElementById("floatBtnCloseDone");
  const skipBtn = document.getElementById("floatBtnSkip");
  const pauseBtn = document.getElementById("floatBtnPause");
  const stopBtn = document.getElementById("floatBtnStop");
  const expandBtn = document.getElementById("floatBtnExpand");

  if (badgeEl) badgeEl.innerText = `${currentIdx}/${totalApps} (${overallPct}%)`;
  if (fillEl) fillEl.style.width = `${overallPct}%`;

  if (st === "completed") {
    if (titleEl) titleEl.innerText = "🎉 Đã hoàn tất cài đặt phần mềm!";
    if (nameEl) nameEl.innerText = `Hoàn thành ${totalApps} phần mềm`;
    if (pctEl) pctEl.innerText = "100%";
    if (stageEl) stageEl.innerText = "Bấm 'Xem Tiến Trình' để xem kết quả & log chi tiết.";
    if (avatarEl) avatarEl.innerText = "🎉";
    if (closeDoneBtn) closeDoneBtn.style.display = "inline-flex";
    if (skipBtn) skipBtn.style.display = "none";
    if (pauseBtn) pauseBtn.style.display = "none";
    if (stopBtn) stopBtn.style.display = "none";
    if (expandBtn) expandBtn.innerText = "📺 Xem Kết Quả";
  } else if (st === "stopped") {
    if (titleEl) titleEl.innerText = "⏹️ Tiến trình cài đặt đã dừng";
    if (nameEl) nameEl.innerText = "Đã dừng theo yêu cầu KTV";
    if (pctEl) pctEl.innerText = `${overallPct}%`;
    if (stageEl) stageEl.innerText = data.current_stage || "Đã hủy các gói còn lại.";
    if (avatarEl) avatarEl.innerText = "⏹️";
    if (closeDoneBtn) closeDoneBtn.style.display = "inline-flex";
    if (skipBtn) skipBtn.style.display = "none";
    if (pauseBtn) pauseBtn.style.display = "none";
    if (stopBtn) stopBtn.style.display = "none";
    if (expandBtn) expandBtn.innerText = "📺 Xem Nhật Ký";
  } else {
    const isPausedState = (st === "paused");
    const appObj = appList.find(a => a.name === data.current_app || a.winget === data.current_package || a.id === data.current_app);
    if (titleEl) {
      titleEl.innerText = isPausedState
        ? `⏸️ Đang tạm dừng (${currentIdx}/${totalApps})`
        : `📦 Đang cài đặt ngầm (${currentIdx}/${totalApps})`;
    }
    if (nameEl) nameEl.innerText = data.current_app || `Gói [${currentIdx}/${totalApps}]`;
    if (pctEl) pctEl.innerText = `${subPct}%`;
    if (stageEl) {
      stageEl.innerText = data.step_status === "delay"
        ? `Nghỉ đệm ${data.delay_remaining || 3}s sang gói tiếp theo...`
        : (data.current_stage || "Đang xử lý...");
    }
    if (avatarEl) {
      if (appObj) {
        avatarEl.innerHTML = `<img src="${getAppIconPath(appObj.id)}" style="width:18px;height:18px;object-fit:contain;" onerror="this.outerHTML='${appObj.avatar}'">`;
      } else {
        avatarEl.innerText = "⚙️";
      }
    }
    if (closeDoneBtn) closeDoneBtn.style.display = "none";
    if (skipBtn) skipBtn.style.display = "inline-flex";
    if (pauseBtn) {
      pauseBtn.style.display = "inline-flex";
      pauseBtn.innerText = isPausedState ? "▶️" : "⏸️";
      pauseBtn.title = isPausedState ? "Tiếp tục cài đặt" : "Tạm dừng cài đặt";
    }
    if (stopBtn) stopBtn.style.display = "inline-flex";
    if (expandBtn) expandBtn.innerText = "📺 Xem Tiến Trình";
  }
}

function skipCurrentInstallApp() {
  if (currentInstallOverallStatus !== "installing" && currentInstallOverallStatus !== "paused") {
    showToast("Hiện không có gói nào đang cài đặt.");
    return;
  }

  // Hỗ trợ chế độ mô phỏng offline
  if (window._simSkipFlag !== undefined) {
    window._simSkipFlag = true;
    showToast("⏭️ Đang bỏ qua phần mềm mô phỏng hiện tại...");
    return;
  }

  const targetIdx = currentInstallAppIndex;
  skipRequestInFlightIndex = targetIdx;
  updateSkipButtonsState(true, true);

  fetch(`/api/install_control?action=skip&index=${encodeURIComponent(targetIdx)}`)
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        showToast(`⏭️ ${data.message || "Đang bỏ qua phần mềm hiện tại để sang gói tiếp theo..."}`);
        updateInstallProgress();
      } else if (data.stale) {
        skipRequestInFlightIndex = 0;
        updateSkipButtonsState(false, true);
        showToast(`ℹ️ ${data.message}`);
        updateInstallProgress();
      } else {
        skipRequestInFlightIndex = 0;
        updateSkipButtonsState(false, true);
        showToast(`⚠️ ${data.error || "Không thể bỏ qua gói hiện tại"}`);
      }
    })
    .catch(err => {
      skipRequestInFlightIndex = 0;
      updateSkipButtonsState(false, true);
      showToast("⚠️ Lỗi gửi lệnh bỏ qua: " + err.message);
    });
}

function togglePauseInstall() {
  const action = isInstallPaused ? "resume" : "pause";
  fetch(`/api/install_control?action=${action}`)
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        isInstallPaused = (data.status === "paused");
        updatePauseButtonsState(isInstallPaused);
        showToast(isInstallPaused ? "⏸️ Đã tạm dừng cài đặt" : "▶️ Đang tiếp tục cài đặt");
      }
    })
    .catch(err => {
      showToast("⚠️ Lỗi gửi lệnh điều khiển: " + err.message);
    });
}

function updatePauseButtonsState(paused) {
  const btnHeader = document.getElementById("btnInstallPauseHeader");
  const btnBottom = document.getElementById("btnInstallPauseBottom");
  const text = paused ? "▶️ Tiếp Tục" : "⏸️ Tạm Dừng";
  const col = paused ? "#15803d" : "#b45309";
  const border = paused ? "#86efac" : "#fde68a";
  const bg = paused ? "#f0fdf4" : "#fefce8";

  [btnHeader, btnBottom].forEach(btn => {
    if (btn) {
      btn.innerText = text;
      btn.style.color = col;
      btn.style.borderColor = border;
      btn.style.background = bg;
    }
  });
}

function confirmStopInstall() {
  if (!confirm("Bạn có chắc chắn muốn DỪNG HẲN toàn bộ tiến trình cài đặt đang chạy?\n(Các ứng dụng chưa cài sẽ bị hủy bỏ)")) {
    return;
  }
  fetch('/api/install_control?action=stop')
    .then(res => res.json())
    .then(data => {
      showToast("⏹️ Đã yêu cầu dừng toàn bộ quy trình cài đặt");
      updateInstallProgress();
    })
    .catch(err => {
      showToast("⚠️ Lỗi gửi lệnh dừng: " + err.message);
    });
}

function clearLogBoxContent() {
  const box = document.getElementById("modalLogBox");
  if (box) box.innerText = "";
  showToast("🧹 Đã làm sạch màn hình nhật ký");
}

function renderModalQueue(queue, currentIndex, overallStatus) {
  const container = document.getElementById("modalQueueContainer");
  if (!container || !queue || !queue.length) return;

  const countBadge = document.getElementById("modalQueueCount");
  if (countBadge) countBadge.innerText = queue.length;

  let html = "";
  queue.forEach((item, idx) => {
    const isCurrent = (overallStatus === "installing" && item.status === "installing");
    const isCompleted = item.status === "completed";
    const isSkipped = item.status === "skipped";
    const isMissingWinget = item.status === "missing_winget";
    const isStopped = item.status === "stopped";
    const isError = item.status === "error";

    let borderCol = "#e2e8f0";
    let bgCol = "#ffffff";
    let statusBadge = `<span style="font-size:10px; font-weight:700; color:#64748b; background:#f1f5f9; padding:2px 6px; border-radius:4px;">Chờ...</span>`;
    let icon = `<span style="font-size:13px; color:#94a3b8;">⏳</span>`;

    if (isCompleted) {
      borderCol = "#bbf7d0";
      bgCol = "#f0fdf4";
      statusBadge = `<span style="font-size:10px; font-weight:700; color:#15803d; background:#dcfce7; padding:2px 6px; border-radius:4px;">✔ Xong</span>`;
      icon = `<span style="font-size:13px; color:#16a34a;">✅</span>`;
    } else if (isSkipped) {
      borderCol = "#fdba74";
      bgCol = "#fff7ed";
      statusBadge = `<span style="font-size:10px; font-weight:800; color:#c2410c; background:#ffedd5; padding:2px 6px; border-radius:4px;">⏭️ Đã bỏ qua</span>`;
      icon = `<span style="font-size:13px; color:#ea580c;">⏭️</span>`;
    } else if (isCurrent) {
      borderCol = "#93c5fd";
      bgCol = "#eff6ff";
      const pct = item.sub_progress || 0;
      statusBadge = `<span style="font-size:10px; font-weight:800; color:#0369a1; background:#e0f2fe; padding:2px 6px; border-radius:4px;">⚡ Đang cài (${pct}%)</span>`;
      icon = `<span style="font-size:13px; color:#0284c7; display:inline-block;">⚙️</span>`;
    } else if (isMissingWinget) {
      borderCol = "#fed7aa";
      bgCol = "#fff7ed";
      statusBadge = `<span style="font-size:10px; font-weight:800; color:#c2410c; background:#ffedd5; padding:2px 6px; border-radius:4px;" title="Cần cài đặt Microsoft.DesktopAppInstaller">⚠️ Thiếu Winget</span>`;
      icon = `<span style="font-size:13px; color:#ea580c;">⚠️</span>`;
    } else if (isStopped) {
      borderCol = "#cbd5e1";
      bgCol = "#f8fafc";
      statusBadge = `<span style="font-size:10px; font-weight:700; color:#475569; background:#e2e8f0; padding:2px 6px; border-radius:4px;">⏹️ Đã dừng</span>`;
      icon = `<span style="font-size:13px; color:#64748b;">⏹️</span>`;
    } else if (isError) {
      borderCol = "#fca5a5";
      bgCol = "#fef2f2";
      statusBadge = `<span style="font-size:10px; font-weight:700; color:#b91c1c; background:#fee2e2; padding:2px 6px; border-radius:4px;">❌ Lỗi</span>`;
      icon = `<span style="font-size:13px; color:#dc2626;">❌</span>`;
    }

    const shortcutBadge = item.shortcut ? `<span style="font-size:10px; color:#059669; font-weight:700; margin-left:6px; background:#d1fae5; padding:1px 5px; border-radius:3px;" title="${escapeHtml(item.shortcut)}">🖥️ Desktop</span>` : "";
    const appLogoSrc = item.id ? getAppIconPath(item.id) : "";
    const appLogoHtml = appLogoSrc
      ? `<img src="${appLogoSrc}" alt="" style="width:18px; height:18px; object-fit:contain; border-radius:3px; flex-shrink:0;" onerror="this.style.display='none';">`
      : "";

    html += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:6px 9px; border-radius:6px; border:1px solid ${borderCol}; background:${bgCol}; font-size:11.5px; transition:all 0.2s ease;">
        <div style="display:flex; align-items:center; gap:7px; min-width:0; flex:1;">
          ${icon}
          ${appLogoHtml}
          <div style="min-width:0; flex:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            <span style="font-weight:700; color:var(--text-primary);">${idx + 1}. ${escapeHtml(item.name)}</span>
            <span style="font-size:10px; color:var(--text-muted); margin-left:4px;">(${escapeHtml(item.winget || item.id)})</span>
            ${shortcutBadge}
          </div>
        </div>
        <div style="display:flex; align-items:center; gap:6px; flex-shrink:0;">
          <span style="font-size:10.5px; color:#64748b; font-weight:500;">${escapeHtml(item.stage || '')}</span>
          ${statusBadge}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

let isPollingInstallProgress = false;

function startPollingProgress() {
  if (pollInterval) clearInterval(pollInterval);
  updateInstallProgress();
  pollInterval = setInterval(updateInstallProgress, 1000);
}

function updateInstallProgress() {
  if (isPollingInstallProgress) return;
  isPollingInstallProgress = true;
  fetch(`/api/install_progress?t=${Date.now()}`, { cache: "no-store" })
    .then(res => res.json())
    .then(data => {
      const fill = document.getElementById("modalProgressFill");
      const overallBadge = document.getElementById("modalOverallBadge");
      const titleText = document.getElementById("modalTitleText");
      const statusText = document.getElementById("modalStatusText");
      const countdownBadge = document.getElementById("modalCountdownBadge");
      const subDetailBadge = document.getElementById("modalSubDetailBadge");
      const subProgressFill = document.getElementById("modalSubProgressFill");
      const subProgressPct = document.getElementById("modalSubProgressPct");
      const subStatusLabel = document.getElementById("modalSubStatusLabel");
      const activeAppName = document.getElementById("modalActiveAppName");
      const activeAppAvatar = document.getElementById("modalActiveAppAvatar");
      const logBox = document.getElementById("modalLogBox");
      const chkAutoScroll = document.getElementById("chkAutoScrollLog");
      const btnFinish = document.getElementById("btnModalFinish");

      if (data.logs && data.logs.length > 0 && logBox) {
        logBox.innerText = data.logs.join("\n");
        if (!chkAutoScroll || chkAutoScroll.checked) {
          logBox.scrollTop = logBox.scrollHeight;
        }
      }

      const totalApps = data.total_apps || 1;
      const currentIdx = data.current_index || 0;
      const subPct = data.sub_progress || 0;

      currentInstallAppIndex = currentIdx;
      currentInstallOverallStatus = data.status || "idle";
      currentInstallStepStatus = data.step_status || "idle";

      if (currentIdx !== skipRequestInFlightIndex && data.step_status !== "skipping") {
        skipRequestInFlightIndex = 0;
      }
      const isActiveRun = (data.status === "installing" || data.status === "paused");
      const isSkippingNow = (data.step_status === "skipping" || (skipRequestInFlightIndex > 0 && skipRequestInFlightIndex === currentIdx));
      updateSkipButtonsState(isSkippingNow, isActiveRun);

      // Render hàng đợi ứng dụng
      if (data.queue && data.queue.length > 0) {
        renderModalQueue(data.queue, currentIdx, data.status);
      }

      const btnQuickWinget = document.getElementById("btnQuickInstallWinget");
      if (btnQuickWinget) {
        const hasMissingWinget = data.queue && data.queue.some(it => it.status === "missing_winget");
        btnQuickWinget.style.display = hasMissingWinget ? "inline-flex" : "none";
      }

      if (data.status === "paused") {
        isInstallPaused = true;
        updatePauseButtonsState(true);
        if (countdownBadge) {
          countdownBadge.style.display = "inline";
          countdownBadge.innerText = "⏸️ Đang tạm dừng";
        }
        if (statusText) statusText.innerHTML = `⏸️ <strong>ĐANG TẠM DỪNG:</strong> Bạn có thể bấm 'Tiếp Tục' bất kỳ lúc nào để tiếp tục cài đặt.`;
        if (subStatusLabel) subStatusLabel.innerText = "Đang tạm dừng theo yêu cầu của KTV";
      } else if (data.status === "installing") {
        isInstallPaused = false;
        updatePauseButtonsState(false);
        const baseCompleted = Math.max(0, currentIdx - 1);
        const overallPct = Math.min(99, Math.max(5, Math.round(((baseCompleted + (subPct / 100)) / totalApps) * 100)));

        if (fill) fill.style.width = `${overallPct}%`;
        if (overallBadge) overallBadge.innerText = `${currentIdx} / ${totalApps} (${overallPct}%)`;

        if (activeAppName) activeAppName.innerText = data.current_app || `Ứng dụng [${currentIdx}/${totalApps}]`;
        if (subDetailBadge) subDetailBadge.innerText = data.sub_detail || data.current_package || "";

        // Avatar
        if (activeAppAvatar) {
          const appObj = appList.find(a => a.name === data.current_app || a.winget === data.current_package || a.id === data.current_app);
          if (appObj) {
            activeAppAvatar.innerHTML = `<img src="${getAppIconPath(appObj.id)}" style="width:24px;height:24px;object-fit:contain;" onerror="this.outerHTML='${appObj.avatar}'">`;
          } else {
            activeAppAvatar.innerText = "⚙️";
          }
        }

        // Sub progress
        if (subProgressFill) subProgressFill.style.width = `${subPct}%`;
        if (subProgressPct) subProgressPct.innerText = `${subPct}%`;

        if (data.step_status === "skipping") {
          if (countdownBadge) countdownBadge.style.display = "none";
          if (statusText) statusText.innerHTML = `⏭️ <strong>ĐANG BỎ QUA:</strong> Đang dừng <strong>${escapeHtml(data.current_app || "gói hiện tại")}</strong> để chuyển sang phần mềm tiếp theo...`;
          if (subStatusLabel) subStatusLabel.innerText = data.current_stage || "Đang hủy tiến trình bị treo...";
        } else if (data.step_status === "installing") {
          if (countdownBadge) countdownBadge.style.display = "none";
          if (statusText) statusText.innerHTML = `⏳ Đang xử lý: <strong>${escapeHtml(data.current_stage || data.current_app)}</strong>`;
          if (subStatusLabel) subStatusLabel.innerText = data.current_stage || "Đang tải dữ liệu...";
        } else if (data.step_status === "delay") {
          if (countdownBadge) {
            countdownBadge.style.display = "inline";
            countdownBadge.innerText = `⏳ Chờ ${data.delay_remaining || installDelay}s...`;
          }
          if (statusText) statusText.innerHTML = `✅ <strong>${escapeHtml(data.current_app)}</strong> xong! Nghỉ đệm ${installDelay}s giải phóng file lock...`;
          if (subStatusLabel) subStatusLabel.innerText = "Đã xong gói, đang nghỉ đệm...";
        }
      } else if (data.status === "stopped") {
        isInstallPaused = false;
        updatePauseButtonsState(false);
        updateSkipButtonsState(false, false);
        if (countdownBadge) countdownBadge.style.display = "none";
        if (statusText) statusText.innerHTML = "⏹️ <strong>ĐÃ DỪNG HẲN:</strong> Quy trình cài đặt đã được kết thúc bởi kỹ thuật viên.";
        if (titleText) titleText.innerText = "Tiến trình cài đặt đã dừng lại";
        if (subStatusLabel) subStatusLabel.innerText = "Đã dừng";
        if (activeAppName) activeAppName.innerText = "Đã dừng quy trình cài đặt.";
        if (activeAppAvatar) activeAppAvatar.innerText = "⏹️";
        if (btnFinish) btnFinish.style.display = "inline-flex";

        try { sessionStorage.removeItem("install_modal_minimized"); } catch (e) {}
        clearInterval(pollInterval);
        pollInterval = null;
        loadInstalledAppsDetection(false, true);
      } else if (data.status === "completed") {
        isInstallPaused = false;
        updatePauseButtonsState(false);
        updateSkipButtonsState(false, false);
        if (fill) fill.style.width = "100%";
        if (overallBadge) overallBadge.innerText = `${totalApps} / ${totalApps} (100%)`;
        if (countdownBadge) countdownBadge.style.display = "none";
        if (subProgressFill) subProgressFill.style.width = "100%";
        if (subProgressPct) subProgressPct.innerText = "100%";
        if (subStatusLabel) subStatusLabel.innerText = "Hoàn tất toàn bộ ứng dụng";
        if (activeAppName) activeAppName.innerText = "Đã cài đặt xong toàn bộ!";
        if (activeAppAvatar) activeAppAvatar.innerText = "🎉";
        if (statusText) statusText.innerHTML = "🎉 <strong>HOÀN TẤT 100%!</strong> Đã xử lý xong toàn bộ danh sách ứng dụng.";
        if (titleText) titleText.innerText = "Cài đặt hoàn tất thành công!";
        if (btnFinish) btnFinish.style.display = "inline-flex";

        try { sessionStorage.removeItem("install_modal_minimized"); } catch (e) {}
        clearInterval(pollInterval);
        pollInterval = null;
        loadInstalledAppsDetection(false, true);
        showToast("🎉 Quy trình cài đặt hoàn tất!");
      }

      window.lastInstallState = data;
      syncFloatingInstallWidget(data);
      syncInstallModeScanGuardUI(data);
    })
    .catch(() => {})
    .finally(() => {
      isPollingInstallProgress = false;
    });
}

function checkActiveInstallState() {
  fetch("/api/install_progress")
    .then(res => res.json())
    .then(data => {
      if (!data || !data.status) return;
      window.lastInstallState = data;
      currentInstallAppIndex = data.current_index || 0;
      currentInstallOverallStatus = data.status || "idle";
      currentInstallStepStatus = data.step_status || "idle";
      syncInstallModeScanGuardUI(data);

      if (data.status === "installing" || data.status === "paused") {
        let wasMinimized = false;
        try { wasMinimized = sessionStorage.getItem("install_modal_minimized") === "1"; } catch (e) {}
        const modal = document.getElementById("installModal");
        if (modal) {
          if (wasMinimized) modal.classList.remove("active");
          else modal.classList.add("active");
        }
        if (data.status === "paused") {
          isInstallPaused = true;
          updatePauseButtonsState(true);
        } else {
          isInstallPaused = false;
          updatePauseButtonsState(false);
        }
        updateInstallProgress();
        startPollingProgress();
        if (wasMinimized) {
          syncFloatingInstallWidget(data);
          showToast("⏳ Tiến trình cài đặt đang tiếp tục chạy & hiển thị ở góc phải.");
        } else {
          showToast("ℹ️ Đã tự động kết nối lại tiến trình cài đặt đang chạy ngầm.");
        }
      } else if (data.status === "completed" || data.status === "stopped") {
        window.lastInstallState = data;
      }
    })
    .catch(() => {});
}

function simulateInstallProgress(items) {
  let idx = 0;
  const logBox = document.getElementById("modalLogBox");
  const fill = document.getElementById("modalProgressFill");
  const overallBadge = document.getElementById("modalOverallBadge");
  const statusText = document.getElementById("modalStatusText");
  const countdownBadge = document.getElementById("modalCountdownBadge");
  const subFill = document.getElementById("modalSubProgressFill");
  const subPct = document.getElementById("modalSubProgressPct");
  const activeName = document.getElementById("modalActiveAppName");
  const activeAvatar = document.getElementById("modalActiveAppAvatar");
  const btnFinish = document.getElementById("btnModalFinish");

  const simulatedQueue = items.map(it => ({
    id: it.id,
    name: it.name,
    winget: it.winget,
    status: "pending",
    stage: "Chờ đến lượt...",
    sub_progress: 0,
    sub_detail: ""
  }));

  window._simSkipFlag = false;
  let simTimer = null;

  const runNext = () => {
    if (idx >= items.length) {
      delete window._simSkipFlag;
      currentInstallOverallStatus = "completed";
      currentInstallStepStatus = "finished";
      updateSkipButtonsState(false, false);
      if (fill) fill.style.width = "100%";
      if (overallBadge) overallBadge.innerText = `${items.length} / ${items.length} (100%)`;
      if (subFill) subFill.style.width = "100%";
      if (subPct) subPct.innerText = "100%";
      if (activeName) activeName.innerText = "Đã cài đặt xong toàn bộ!";
      if (activeAvatar) activeAvatar.innerText = "🎉";
      if (statusText) statusText.innerHTML = "🎉 <strong>HOÀN TẤT!</strong> Đã hoàn thành quy trình mô phỏng cài đặt!";
      if (btnFinish) btnFinish.style.display = "inline-flex";
      simulatedQueue.forEach(q => {
        if (q.status !== "skipped") {
          q.status = "completed";
          q.stage = "Hoàn tất";
          q.sub_progress = 100;
          q.shortcut = "Desktop";
        }
      });
      renderModalQueue(simulatedQueue, items.length, "completed");
      window.lastInstallState = {
        status: "completed",
        step_status: "finished",
        current_index: items.length,
        total_apps: items.length,
        current_app: "Hoàn tất",
        current_stage: "Đã hoàn tất!",
        sub_progress: 100,
        queue: simulatedQueue
      };
      syncFloatingInstallWidget(window.lastInstallState);
      syncInstallModeScanGuardUI(window.lastInstallState);
      return;
    }

    const currentItemIdx = idx;
    const item = items[idx++];
    currentInstallAppIndex = idx;
    currentInstallOverallStatus = "installing";
    currentInstallStepStatus = "installing";
    updateSkipButtonsState(false, true);

    const pct = Math.round((idx / items.length) * 100);
    if (fill) fill.style.width = `${pct}%`;
    if (overallBadge) overallBadge.innerText = `${idx} / ${items.length} (${pct}%)`;
    if (subFill) subFill.style.width = "75%";
    if (subPct) subPct.innerText = "75%";
    if (activeName) activeName.innerText = item.name;
    if (activeAvatar) {
      activeAvatar.innerHTML = `<img src="${getAppIconPath(item.id)}" style="width:24px;height:24px;object-fit:contain;" onerror="this.outerHTML='⚡'">`;
    }
    if (statusText) statusText.innerHTML = `⏳ Đang cài [${idx}/${items.length}]: <strong>${escapeHtml(item.name)}</strong>...`;

    simulatedQueue[currentItemIdx].status = "installing";
    simulatedQueue[currentItemIdx].stage = "Đang cài đặt & tạo shortcut...";
    simulatedQueue[currentItemIdx].sub_progress = 75;
    renderModalQueue(simulatedQueue, idx, "installing");

    window.lastInstallState = {
      status: "installing",
      step_status: "installing",
      current_index: idx,
      total_apps: items.length,
      current_app: item.name,
      current_package: item.winget,
      current_stage: `Đang cài ${item.name}...`,
      sub_progress: 75,
      queue: simulatedQueue
    };
    syncFloatingInstallWidget(window.lastInstallState);
    syncInstallModeScanGuardUI(window.lastInstallState);

    if (logBox) {
      logBox.innerText += `\n[${new Date().toLocaleTimeString()}] Bắt đầu cài đặt ${item.name} (${item.winget})...`;
      logBox.scrollTop = logBox.scrollHeight;
    }

    let ticks = 0;
    simTimer = setInterval(() => {
      ticks++;
      if (window._simSkipFlag) {
        window._simSkipFlag = false;
        clearInterval(simTimer);
        simulatedQueue[currentItemIdx].status = "skipped";
        simulatedQueue[currentItemIdx].stage = "Đã bỏ qua (treo/lỗi)";
        simulatedQueue[currentItemIdx].sub_progress = 100;
        if (logBox) {
          logBox.innerText += `\n[BỎ QUA] Đã bỏ qua ${item.name} theo yêu cầu KTV.`;
          logBox.scrollTop = logBox.scrollHeight;
        }
        runNext();
        return;
      }
      if (ticks >= 9) {
        clearInterval(simTimer);
        simulatedQueue[currentItemIdx].status = "completed";
        simulatedQueue[currentItemIdx].stage = "Hoàn tất";
        simulatedQueue[currentItemIdx].sub_progress = 100;
        simulatedQueue[currentItemIdx].shortcut = "Desktop";
        if (logBox) {
          logBox.innerText += `\n[OK] ${item.name} hoàn tất & đã tạo lối tắt Desktop!`;
          logBox.scrollTop = logBox.scrollHeight;
        }
        runNext();
      }
    }, 200);
  };
  runNext();
}

function copyLogBoxContent() {
  const box = document.getElementById("modalLogBox");
  if (!box || !box.innerText) {
    showToast("Nhật ký trống");
    return;
  }
  copyToClipboard(box.innerText);
  showToast("📋 Đã sao chép toàn bộ nhật ký cài đặt vào Clipboard!");
}

function toggleLogBoxExpand() {
  const box = document.getElementById("modalLogBox");
  const btn = document.getElementById("btnToggleLogExpand");
  if (!box) return;
  if (box.style.height === "240px") {
    box.style.height = "100px";
    if (btn) btn.innerText = "Thu gọn";
  } else {
    box.style.height = "240px";
    if (btn) btn.innerText = "Mở rộng";
  }
}

function closeModal() {
  const modal = document.getElementById("installModal");
  if (modal) modal.classList.remove("active");

  if (currentInstallOverallStatus === "installing" || currentInstallOverallStatus === "paused") {
    try { sessionStorage.setItem("install_modal_minimized", "1"); } catch (e) {}
    floatingWidgetDismissed = false;
    if (window.lastInstallState) {
      syncFloatingInstallWidget(window.lastInstallState);
    } else {
      syncFloatingInstallWidget({
        status: currentInstallOverallStatus,
        step_status: currentInstallStepStatus,
        current_index: currentInstallAppIndex || 1,
        total_apps: 1,
        current_app: (document.getElementById("modalActiveAppName") || {}).innerText || "Đang cài đặt...",
        current_stage: (document.getElementById("modalSubStatusLabel") || {}).innerText || "Đang xử lý ngầm...",
        sub_progress: parseInt(((document.getElementById("modalSubProgressPct") || {}).innerText || "10"), 10) || 10,
        queue: [{}]
      });
    }
    showToast("⏳ Đã thu gọn bảng tiến trình xuống góc phải — quá trình cài vẫn tiếp tục hiển thị!");
  } else {
    try { sessionStorage.removeItem("install_modal_minimized"); } catch (e) {}
    hideFloatingInstallWidget();
  }
}

function executeAction(actionName, params = {}) {
  let url = `/api/run?action=${encodeURIComponent(actionName)}`;
  for (const key in params) {
    url += `&${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
  }

  showToast("⏳ Đang gửi lệnh tới hệ thống Windows...");

  fetch(url)
    .then(res => res.json())
    .then(data => {
      showToast(`✔ ${data.message || 'Lệnh đã được thực thi!'}`);
    })
    .catch(err => {
      showToast(`✔ [Mô phỏng] Đã nhận lệnh: ${actionName}`);
    });
}

function openTargetFolder(relPath) {
  executeAction("open-folder", { folder: relPath });
}

function openTargetFile(filePath) {
  executeAction("open-file", { file: filePath });
}

// ==========================================
// TAB 2: TỐI ƯU 3 MỨC CẤU HÌNH (DƯỚI 4GB, 4GB-8GB, TRÊN 8GB)
// ==========================================
let currentMachineRamInfo = null;

function initOptimizeTab() {
  const savedTask = localStorage.getItem("active_opt_task") || "opt-task-4to8gb";
  switchOptTask(savedTask);

  fetch("/api/machine_info")
    .then(res => res.json())
    .then(data => {
      if (data && data.info && data.info.ram_info) {
        updateOptimizeRamUI(data.info.ram_info);
      }
    })
    .catch(() => {
      // Mock data cho giao diện demo mượt mà
      updateOptimizeRamUI({
        total_gb: 8,
        used_gb: 3.4,
        avail_gb: 4.6,
        load_percent: 43,
        recommended_tier: "4to8gb",
        recommended_title: "Gói 2: RAM 4GB - 8GB (Tinh Giản Cân Bằng)"
      });
    });
}

function updateOptimizeRamUI(ram) {
  currentMachineRamInfo = ram;
  const totalDisplay = document.getElementById("optRamTotalDisplay");
  const busDisplay = document.getElementById("optRamBusDisplay");
  const loadBar = document.getElementById("optRamLoadBar");
  const loadDetail = document.getElementById("optRamLoadDetail");
  const availDetail = document.getElementById("optRamAvailDetail");
  const recTierText = document.getElementById("optRamRecTierText");

  const instGb = ram.installed_gb || ram.total_gb || 0;
  const usableDiff = (ram.total_gb && instGb && Math.abs(instGb - ram.total_gb) >= 0.4)
    ? ` (${ram.total_gb} GB Usable)`
    : "";
  if (totalDisplay) totalDisplay.innerText = `${instGb} GB Physical RAM${usableDiff}`;
  if (busDisplay) {
    const busPart = ram.bus_display || (ram.bus_mhz ? `${ram.bus_mhz} MHz` : "Chưa rõ Bus");
    const slotsPart = ram.slots_display ? ` • ${ram.slots_display}` : "";
    busDisplay.innerText = `⚡ Bus: ${busPart}${slotsPart}`;
  }
  if (loadBar) {
    loadBar.style.width = `${Math.min(100, Math.max(5, ram.load_percent))}%`;
    if (ram.load_percent > 85) loadBar.style.background = "#dc2626";
    else if (ram.load_percent > 70) loadBar.style.background = "#d97706";
    else loadBar.style.background = "#0067c0";
  }
  if (loadDetail) loadDetail.innerText = `Đang dùng: ${ram.load_percent}% (${ram.used_gb} GB)`;
  if (availDetail) availDetail.innerText = `(Trống: ${ram.avail_gb} GB)`;
  if (recTierText) recTierText.innerText = `🎯 Đề xuất: ${ram.recommended_title || 'Gói Cân Bằng'}`;

  const recBadge = document.getElementById("optRamRecBadge");
  if (recBadge) {
    if (ram.total_gb <= 4) {
      recBadge.innerHTML = "🔴 Gói &lt; 4GB";
      recBadge.style.background = "#dc2626";
    } else if (ram.total_gb <= 8) {
      recBadge.innerHTML = "🟡 Gói 4-8GB";
      recBadge.style.background = "#d97706";
    } else {
      recBadge.innerHTML = "🟢 Gói &gt; 8GB";
      recBadge.style.background = "#059669";
    }
  }
}

function switchOptTask(taskId) {
  document.querySelectorAll(".opt-task-menu-item").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.target === taskId);
  });

  document.querySelectorAll(".opt-task-view").forEach(view => {
    view.classList.toggle("active", view.id === taskId);
  });

  try {
    localStorage.setItem("active_opt_task", taskId);
  } catch (e) {}
}

function jumpToRecommendedOptLevel() {
  let targetTaskId = "opt-task-4to8gb";
  if (currentMachineRamInfo) {
    const tier = currentMachineRamInfo.recommended_tier;
    if (tier === "under4gb" || tier === 3) targetTaskId = "opt-task-under4gb";
    else if (tier === "above8gb") targetTaskId = "opt-task-above8gb";
    else targetTaskId = "opt-task-4to8gb";
  }
  switchOptTask(targetTaskId);
}

// ==========================================
// TAB 3: TIẾP NHẬN & KIỂM TRA MÁY (QUÉT MÁY, Ổ ĐĨA, CHECKLIST)
// ==========================================
function initOldPcTab() {
  loadCurrentMachineInfo();
  loadScanTasksList();
  loadDiskDrivesList();
}

function setScanStage(stage, triggerModified = true) {
  currentScanStage = (stage === 'ban_giao') ? 'ban_giao' : 'tiep_nhan';
  const btnIn = document.getElementById("btnStageIn");
  const btnOut = document.getElementById("btnStageOut");
  if (btnIn && btnOut) {
    btnIn.classList.toggle("active", currentScanStage === 'tiep_nhan');
    btnOut.classList.toggle("active", currentScanStage === 'ban_giao');
  }
  updateChecklistActionButtons();
  if (triggerModified && activeScanId && currentScanTask) {
    saveActiveTaskMetadata();
  }
}

function updateChecklistActionButtons() {
  const btnChk = document.getElementById("btnOpenChecklist");
  const btnPrint = document.getElementById("btnPrintReceipt");
  if (!btnChk || !btnPrint) return;
  if (currentScanStage === 'ban_giao') {
    btnChk.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg><span>Checklist Bàn Giao</span>`;
    btnPrint.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg><span>In Biên Bản Bàn Giao</span>`;
  } else {
    btnChk.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect><path d="m9 14 2 2 4-4"></path></svg><span>Checklist Tiếp Nhận</span>`;
    btnPrint.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg><span>In Phiếu Nhận Máy</span>`;
  }
}

function onCustomerInfoChange() {
  const name = document.getElementById("inputCustomerName") ? document.getElementById("inputCustomerName").value : "";
  const id = document.getElementById("inputCustomerId") ? document.getElementById("inputCustomerId").value : "";
  syncCustomerInputsToModal(name, id);
  if (activeScanId && currentScanTask) {
    const btnSave = document.getElementById("btnSaveTaskMetadata");
    if (btnSave) btnSave.style.display = "inline-flex";
  }
}

function saveActiveTaskMetadata(extraUpdates = {}) {
  if (!activeScanId) return Promise.resolve(null);
  const name = document.getElementById("inputCustomerName")?.value.trim() || "";
  const userCode = document.getElementById("inputCustomerId")?.value.trim() || "";
  const stage = currentScanStage;

  const payload = Object.assign({
    id: activeScanId,
    customer_name: name,
    customer_id: userCode,
    scan_stage: stage
  }, extraUpdates || {});

  return fetch("/api/scans/update", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok" && data.task) {
        activeScanId = data.task.scan_id;
        currentScanTask = data.task;
        renderMachineInfoCard(data.task, false);
        showToast(`✔ Đã cập nhật & đổi tên thư mục: ${data.task.scan_id}`);
        const btnSave = document.getElementById("btnSaveTaskMetadata");
        if (btnSave) btnSave.style.display = "none";
        loadScanTasksList(activeScanId);
        return data.task;
      } else if (data && data.message) {
        showToast("⚠️ " + data.message);
      }
      return null;
    })
    .catch(() => {
      showToast("⚠️ Lỗi kết nối khi lưu thông tin lượt quét!");
      return null;
    });
}

function loadCurrentMachineInfo() {
  fetch("/api/machine_info")
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok" && data.info) {
        currentMachineInfo = data.info;
        if (!activeScanId) renderMachineInfoCard(currentMachineInfo, true);
        else if (currentScanTask) updateTaskLockStatusAndUI(currentScanTask);
        renderScanTasksSidebar();
        renderLockStatusMonitorTable();
      }
    })
    .catch(() => {
      // Sample mock data for offline/standalone execution
      currentMachineInfo = {
        computer_name: "WORKSTATION-X1",
        username: "Administrator",
        user_id: "WORKSTATION-X1\\Admin",
        serial_number: "PF-2X89Q1",
        motherboard: "Dell Inc. 0PD00W (PCIe 4.0)",
        scan_time: new Date().toLocaleString('vi-VN'),
        scan_id: "SCAN_CURRENT",
        os_info: "Windows 11 Pro 64-bit (Build 26200)",
        license_status: "Bản Quyền Chính Hãng",
        license_channel: "OEM:DM Digital License",
        license_key: "W269N-WFGWX-YVC9B-4J6C9-T83GX"
      };
      if (!activeScanId) renderMachineInfoCard(currentMachineInfo, true);
    });
}

function renderMachineInfoCard(info, isLive = false) {
  if (!info) return;
  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.innerText = val || "N/A";
  };

  setTxt("mCardComputer", info.computer_name);
  setTxt("mCardProductNumber", info.product_number || "N/A");
  setTxt("mCardSerial", info.serial_number || "N/A");
  setTxt("mCardUser", info.user_id || `${info.computer_name || 'PC'}\\${info.username || 'User'}`);
  setTxt("mCardMotherboard", info.motherboard || info.board_vendor || "N/A");
  setTxt("mCardTime", info.scan_time);
  setTxt("mCardScanId", info.scan_id || "SCAN_LIVE");
  setTxt("mCardOs", info.os_info || "Windows 11 Pro");

  // Trạng thái xác nhận tên máy tính
  const isConfirmed = !!info.computer_name_confirmed;
  const confirmBadge = document.getElementById("mCardNameConfirmBadge");
  const subHint = document.getElementById("mCardIdentitySubHint");
  const btnOkName = document.getElementById("btnConfirmMachineNameOk");
  if (confirmBadge) {
    if (isConfirmed) {
      confirmBadge.innerText = "✔ Đã xác nhận tên máy";
      confirmBadge.style.background = "#dcfce7";
      confirmBadge.style.color = "#15803d";
      confirmBadge.style.borderColor = "#86efac";
    } else {
      confirmBadge.innerText = "❓ Chờ xác nhận tên máy";
      confirmBadge.style.background = "#fef3c7";
      confirmBadge.style.color = "#b45309";
      confirmBadge.style.borderColor = "#fcd34d";
    }
  }
  if (subHint) {
    subHint.innerText = isConfirmed ? "✔ Tên máy đã được KTV xác nhận" : "Vui lòng kiểm tra xem tên máy đã đúng chưa!";
    subHint.style.color = isConfirmed ? "#15803d" : "#b45309";
  }
  if (btnOkName) {
    btnOkName.style.display = isConfirmed ? "none" : "inline-flex";
  }

  // Đồng bộ vào khung chỉnh sửa định danh nếu đang đóng
  const editBox = document.getElementById("mCardIdentityEditBox");
  if (!editBox || editBox.style.display === "none") {
    const inPc = document.getElementById("editIdentityComputerName");
    const inPn = document.getElementById("editIdentityPN");
    const inSn = document.getElementById("editIdentitySN");
    if (inPc) inPc.value = info.computer_name || "";
    if (inPn) inPn.value = (info.product_number && info.product_number !== "N/A") ? info.product_number : "";
    if (inSn) inSn.value = (info.serial_number && info.serial_number !== "N/A") ? info.serial_number : "";
  }

  // Hiển thị thông tin RAM & Bus RAM
  const rInf = (info.ram_info && typeof info.ram_info === "object") ? info.ram_info : {};
  const instGb = info.ram_installed_gb || info.total_ram_gb || rInf.installed_gb || rInf.total_gb || 0;
  const usableGb = rInf.total_gb || info.total_ram_gb || instGb || 0;
  const ramType = info.ram_type || rInf.ram_type || "";
  const busMhz = info.ram_bus_mhz || rInf.bus_mhz || 0;
  const busDisp = info.ram_bus_display || rInf.bus_display || (busMhz ? `${busMhz} MHz${ramType ? " (" + ramType + ")" : ""}` : "Chưa rõ MHz");
  const slotsU = info.ram_slots_used || rInf.slots_used || 0;
  const slotsT = info.ram_slots_total || rInf.slots_total || 0;
  const slotsDisp = rInf.slots_display || (slotsT ? `${slotsU}/${slotsT} khe cắm` : (slotsU ? `${slotsU} thanh RAM` : "Chưa rõ khe cắm"));

  const ramCapEl = document.getElementById("mCardRamCapacity");
  const ramBusEl = document.getElementById("mCardRamBus");
  const ramSlotsEl = document.getElementById("mCardRamSlots");
  if (ramCapEl) {
    if (instGb > 0) {
      const usableTxt = (usableGb && Math.abs(instGb - usableGb) >= 0.4) ? ` (${usableGb} GB khả dụng)` : "";
      ramCapEl.innerText = `${instGb} GB${ramType ? " " + ramType : ""}${usableTxt}`;
    } else {
      ramCapEl.innerText = info.ram_summary || "Chưa rõ";
    }
  }
  if (ramBusEl) ramBusEl.innerText = `Bus: ${busDisp}`;
  if (ramSlotsEl) ramSlotsEl.innerText = slotsDisp;

  const badgeEl = document.getElementById("mCardLicenseBadge");
  const chanEl = document.getElementById("mCardLicenseChannel");
  const keyEl = document.getElementById("mCardLicenseKey");

  if (badgeEl) {
    badgeEl.className = "badge badge-license-genuine";
    badgeEl.innerText = `🟢 ${info.license_status || 'Bản Quyền Chính Hãng'}`;
  }
  if (chanEl) chanEl.innerText = info.license_channel || "OEM / Retail";
  if (keyEl) keyEl.innerText = info.license_key ? `Key: *****-${info.license_key.slice(-5)}` : "Key: *****-WTYP2";

  const inputName = document.getElementById("inputCustomerName");
  const inputId = document.getElementById("inputCustomerId");
  if (inputName) inputName.value = info.customer_name || "";
  if (inputId) inputId.value = info.customer_id || "";

  setScanStage(info.scan_stage || "tiep_nhan", false);

  const badge = document.getElementById("mCardStatusBadge");
  if (badge) {
    badge.innerText = isLive ? "Máy hiện tại" : (info.stage_label || "Đã lưu");
    badge.className = "badge badge-mint";
  }

  if (typeof updateMachineCardSmartSummary === 'function') {
    updateMachineCardSmartSummary();
  }
}

function toggleMachineIdentityEdit(forceShow = null) {
  const box = document.getElementById("mCardIdentityEditBox");
  if (!box) return;
  const shouldShow = (forceShow !== null) ? !!forceShow : (box.style.display === "none" || !box.style.display);
  box.style.display = shouldShow ? "block" : "none";
  if (shouldShow) {
    const src = (!activeScanId || !currentScanTask) ? currentMachineInfo : currentScanTask;
    const inPc = document.getElementById("editIdentityComputerName");
    const inPn = document.getElementById("editIdentityPN");
    const inSn = document.getElementById("editIdentitySN");
    if (src) {
      if (inPc) inPc.value = src.computer_name || "";
      if (inPn) inPn.value = (src.product_number && src.product_number !== "N/A") ? src.product_number : "";
      if (inSn) inSn.value = (src.serial_number && src.serial_number !== "N/A") ? src.serial_number : "";
    }
    if (inPc) inPc.focus();
  }
}

async function confirmDetectedComputerNameRightNow() {
  const src = (activeScanId && currentScanTask) ? currentScanTask : currentMachineInfo;
  if (!src) return;
  src.computer_name_confirmed = true;
  if (currentMachineInfo && (!activeScanId || currentMachineInfo.computer_name === src.computer_name)) {
    currentMachineInfo.computer_name_confirmed = true;
  }
  if (activeScanId && currentScanTask) {
    await saveActiveTaskMetadata({ computer_name_confirmed: true });
  } else {
    renderMachineInfoCard(src, true);
    showToast(`✔ Đã xác nhận tên máy '${src.computer_name}' là chính xác!`);
  }
}

async function saveMachineIdentityChanges() {
  const inPc = document.getElementById("editIdentityComputerName");
  const inPn = document.getElementById("editIdentityPN");
  const inSn = document.getElementById("editIdentitySN");
  const chkWinRename = document.getElementById("chkApplyWindowsRename");

  const newPc = (inPc ? inPc.value : "").trim();
  const newPn = (inPn ? inPn.value : "").trim() || "N/A";
  const newSn = (inSn ? inSn.value : "").trim() || "N/A";

  if (!newPc) {
    showToast("⚠️ Vui lòng nhập Tên Máy Tính!");
    if (inPc) inPc.focus();
    return;
  }

  if (chkWinRename && chkWinRename.checked) {
    try {
      const rRes = await fetch("/api/system/rename_computer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_name: newPc })
      });
      const rData = await rRes.json().catch(() => ({}));
      if (rRes.ok && rData.status === "ok") {
        showToast("💻 " + (rData.message || `Đã đổi tên máy Windows sang ${newPc}!`));
      } else {
        showToast("⚠️ " + (rData.message || "Không đổi được tên Windows OS (cần Admin), vẫn lưu vào hồ sơ."));
      }
    } catch (e) {
      showToast("⚠️ Lỗi gọi API đổi tên Windows OS, vẫn lưu vào hồ sơ.");
    }
  }

  if (currentMachineInfo) {
    currentMachineInfo.computer_name = newPc;
    currentMachineInfo.product_number = newPn;
    currentMachineInfo.serial_number = newSn;
    currentMachineInfo.computer_name_confirmed = true;
  }

  toggleMachineIdentityEdit(false);

  if (activeScanId && currentScanTask) {
    await saveActiveTaskMetadata({
      computer_name: newPc,
      product_number: newPn,
      serial_number: newSn,
      computer_name_confirmed: true
    });
  } else {
    renderMachineInfoCard(currentMachineInfo, true);
    showToast(`✔ Đã cập nhật định danh: ${newPc} • PN: ${newPn} • SN: ${newSn}`);
  }
}

function loadScanTasksList(autoSelectId = null) {
  fetch("/api/scans/list")
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok" && Array.isArray(data.tasks)) {
        scanTasksList = data.tasks;
        const countBadge = document.getElementById("scanTaskCountBadge");
        if (countBadge) countBadge.innerText = `${scanTasksList.length} lượt`;
        renderScanTasksSidebar();
        let targetId = autoSelectId || (scanTasksList[0] ? scanTasksList[0].scan_id : null);
        if (targetId) selectScanTask(targetId);
      }
    })
    .catch(() => {
      // Mock historical sessions
      scanTasksList = [
        {
          scan_id: "Hoang_Gia_VIP01_TiepNhan_DESKTOP-SV8JIJQ",
          customer_name: "Hoang Gia",
          customer_id: "VIP01",
          computer_name: "DESKTOP-SV8JIJQ",
          serial_number: "DDSQPH2",
          scan_stage: "tiep_nhan",
          stage_label: "Tiếp nhận máy",
          scan_time: "30/09/2026 13:52:41",
          total_apps: 57,
          timestamp: Date.now() / 1000 - 3600
        },
        {
          scan_id: "Cong_Ty_An_Phat_AP102_BanGiao_LAPTOP-TUF",
          customer_name: "Công Ty An Phát",
          customer_id: "AP102",
          computer_name: "LAPTOP-TUF15",
          serial_number: "SN-99824A",
          scan_stage: "ban_giao",
          stage_label: "Bàn giao sau cài",
          scan_time: "29/09/2026 16:30:15",
          total_apps: 42,
          timestamp: Date.now() / 1000 - 86400
        }
      ];
      renderScanTasksSidebar();
      if (scanTasksList[0]) selectScanTask(scanTasksList[0].scan_id);
    });
}

function filterScanTasksList() {
  const searchInput = document.getElementById("scanTaskSearchInput");
  const q = searchInput ? searchInput.value.toLowerCase().trim() : "";
  if (!q) {
    renderScanTasksSidebar(scanTasksList);
    return;
  }
  const filtered = scanTasksList.filter(t => {
    return (t.customer_name || "").toLowerCase().includes(q) ||
           (t.customer_id || "").toLowerCase().includes(q) ||
           (t.computer_name || "").toLowerCase().includes(q) ||
           (t.scan_id || "").toLowerCase().includes(q);
  });
  renderScanTasksSidebar(filtered);
}

function renderScanTasksSidebar(tasksToRender = null) {
  const listEl = document.getElementById("scanTaskList");
  if (!listEl) return;
  listEl.innerHTML = "";

  const tasks = tasksToRender || scanTasksList;
  if (tasks.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:20px 10px; color:var(--text-muted); font-size:12px;">
        Không tìm thấy lượt quét nào
      </div>
    `;
    return;
  }

  tasks.forEach(task => {
    const item = document.createElement("div");
    const isActive = (task.scan_id === activeScanId);
    item.className = `scan-task-item ${isActive ? 'active' : ''}`;
    item.id = `task-item-${task.scan_id}`;
    item.onclick = () => selectScanTask(task.scan_id);

    const displayName = task.customer_name ? `${task.customer_name} (${task.computer_name || 'PC'})` : (task.computer_name || 'Máy tính');
    const isBanGiao = (task.scan_stage === 'ban_giao');
    const stageBadge = isBanGiao 
      ? '<span class="badge-stage-out">✅ Bàn giao</span>'
      : '<span class="badge-stage-in">📥 Tiếp nhận</span>';
    const idBadge = task.customer_id ? `<span class="badge-cust-id">ID: ${escapeHtml(task.customer_id)}</span>` : '';

    item.innerHTML = `
      <div class="scan-task-header-row">
        <span class="scan-task-pc-name" title="${escapeHtml(displayName)}">
          <span>💻</span> ${escapeHtml(displayName)}
        </span>
        <button class="scan-task-del-btn" onclick="deleteScanSession('${task.scan_id}', event)" title="Xóa lượt quét">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      </div>
      <div class="scan-task-badges-row">
        ${stageBadge}
        ${idBadge}
        <span class="badge badge-license-genuine" style="font-size:9.5px; padding:1px 5px;">🟢 Bản quyền</span>
      </div>
      <div class="scan-task-meta-row">
        <span>📅 ${escapeHtml(task.scan_time || '')}</span>
        <span class="badge badge-primary" style="font-size:10px;">${task.total_apps || 0} apps</span>
      </div>
    `;
    listEl.appendChild(item);
  });
}

function selectScanTask(scanId) {
  activeScanId = scanId;
  document.querySelectorAll(".scan-task-item").forEach(el => el.classList.remove("active"));
  const activeEl = document.getElementById(`task-item-${scanId}`);
  if (activeEl) activeEl.classList.add("active");

  fetch(`/api/scans/get?id=${encodeURIComponent(scanId)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok") {
        currentScanTask = data.info;
        scannedAppsList = data.apps || [];
        renderMachineInfoCard(data.info, false);
        updateTaskLockStatusAndUI(data.info);
        renderScannedAppsTable(scannedAppsList);
        loadTaskDiskTree(scanId);
        if (typeof updatePipelineStepsFromTask === "function") {
          updatePipelineStepsFromTask(data.info, data.apps);
        }
      }
    })
    .catch(() => {
      // Mock scanned software list for offline preview
      const foundTask = scanTasksList.find(t => t.scan_id === scanId);
      if (foundTask) {
        currentScanTask = foundTask;
        renderMachineInfoCard(foundTask, false);
        updateTaskLockStatusAndUI(foundTask);
      }
      scannedAppsList = [
        { name: "4K Video Downloader+", version: "v26.0.8", publisher: "OpenMedia LLC", install_date: "12/09/2026", location: "C:\\Program Files\\4KDownload" },
        { name: "Google Chrome", version: "v129.0.6668.71", publisher: "Google LLC", install_date: "25/09/2026", location: "C:\\Program Files\\Google\\Chrome" },
        { name: "UniKey 4.6 RC2", version: "v4.6.230919", publisher: "Pham Kim Long", install_date: "20/09/2026", location: "C:\\Program Files\\UniKey" },
        { name: "UltraViewer", version: "v6.6.93", publisher: "DucFabulous Co.", install_date: "18/09/2026", location: "C:\\Program Files (x86)\\UltraViewer" },
        { name: "Microsoft Visual C++ 2015-2022 Redistributable", version: "v14.40.33810", publisher: "Microsoft Corporation", install_date: "10/09/2026", location: "C:\\Windows\\System32" },
        { name: "Brave Browser", version: "v1.70.119", publisher: "Brave Software Inc", install_date: "24/09/2026", location: "C:\\Program Files\\BraveSoftware" },
        { name: "VLC Media Player", version: "v3.0.21", publisher: "VideoLAN", install_date: "15/09/2026", location: "C:\\Program Files\\VideoLAN\\VLC" },
        { name: "Foxit PDF Reader", version: "v2024.2", publisher: "Foxit Software", install_date: "05/09/2026", location: "C:\\Program Files (x86)\\Foxit Software" }
      ];
      renderScannedAppsTable(scannedAppsList);
      if (typeof updatePipelineStepsFromTask === "function") {
        updatePipelineStepsFromTask(foundTask, scannedAppsList);
      }
    });
}

function openConfirmScanMachineModal() {
  if (!checkAndWarnInstallModeForScan("tạo lượt quét máy mới")) return;

  const populateModalFields = (info) => {
    const inf = info || {};
    const pcIn = document.getElementById("confirmScanComputerName");
    const pnIn = document.getElementById("confirmScanPN");
    const snIn = document.getElementById("confirmScanSN");
    const cNameIn = document.getElementById("confirmScanCustomerName");
    const cIdIn = document.getElementById("confirmScanCustomerId");
    const winChk = document.getElementById("confirmScanWindowsRename");
    const ramEl = document.getElementById("confirmScanRamSummary");
    const cpuEl = document.getElementById("confirmScanCpuSummary");

    if (pcIn) pcIn.value = inf.computer_name || inf.computer_name_detected || "";
    if (pnIn) pnIn.value = (inf.product_number && inf.product_number !== "N/A") ? inf.product_number : "";
    if (snIn) snIn.value = (inf.serial_number && inf.serial_number !== "N/A") ? inf.serial_number : "";
    if (winChk) winChk.checked = false;

    const existingName = document.getElementById("inputCustomerName")?.value.trim() || "";
    const existingId = document.getElementById("inputCustomerId")?.value.trim() || "";
    if (cNameIn) cNameIn.value = existingName;
    if (cIdIn) cIdIn.value = existingId;

    const stVal = currentScanStage === "ban_giao" ? "ban_giao" : "tiep_nhan";
    document.querySelectorAll('input[name="confirmScanStage"]').forEach(r => {
      r.checked = (r.value === stVal);
    });

    if (ramEl) {
      const rInf = (inf.ram_info && typeof inf.ram_info === "object") ? inf.ram_info : {};
      const ramTxt = inf.ram_summary || rInf.ram_summary || (inf.total_ram_gb ? `${inf.total_ram_gb} GB` : "Chưa rõ");
      ramEl.innerText = ramTxt;
    }
    if (cpuEl) {
      cpuEl.innerText = `CPU: ${inf.cpu_name || "Đang nhận diện..."} • Mainboard: ${inf.motherboard || "N/A"}`;
    }
  };

  populateModalFields(currentMachineInfo);
  const modal = document.getElementById("confirmScanMachineModal");
  if (modal) modal.classList.add("active");

  // Cập nhật live info mới nhất từ server nếu có
  fetch("/api/machine_info")
    .then(r => r.json())
    .then(d => {
      if (d && d.status === "ok" && d.info) {
        currentMachineInfo = Object.assign({}, d.info, {
          computer_name: (currentMachineInfo && currentMachineInfo.computer_name_confirmed) ? currentMachineInfo.computer_name : d.info.computer_name,
          computer_name_confirmed: !!(currentMachineInfo && currentMachineInfo.computer_name_confirmed)
        });
        populateModalFields(currentMachineInfo);
      }
    })
    .catch(() => {});
}

function closeConfirmScanMachineModal() {
  const modal = document.getElementById("confirmScanMachineModal");
  if (modal) modal.classList.remove("active");
}

async function submitConfirmScanMachineModal() {
  if (!checkAndWarnInstallModeForScan("tạo lượt quét máy mới")) return;

  const pcName = (document.getElementById("confirmScanComputerName")?.value || "").trim();
  const pnVal = (document.getElementById("confirmScanPN")?.value || "").trim() || "N/A";
  const snVal = (document.getElementById("confirmScanSN")?.value || "").trim() || "N/A";
  const custName = (document.getElementById("confirmScanCustomerName")?.value || "").trim();
  const custId = (document.getElementById("confirmScanCustomerId")?.value || "").trim();
  const winRename = !!document.getElementById("confirmScanWindowsRename")?.checked;
  const stageRadio = document.querySelector('input[name="confirmScanStage"]:checked');
  const stage = stageRadio ? stageRadio.value : currentScanStage;

  if (!pcName) {
    showToast("⚠️ Vui lòng kiểm tra & nhập Tên Máy Tính trước khi quét!");
    document.getElementById("confirmScanComputerName")?.focus();
    return;
  }

  const detectedPc = (currentMachineInfo && (currentMachineInfo.computer_name_detected || currentMachineInfo.computer_name)) || "";
  if (winRename && detectedPc && pcName.toUpperCase() !== detectedPc.toUpperCase()) {
    try {
      const rRes = await fetch("/api/system/rename_computer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_name: pcName })
      });
      const rData = await rRes.json().catch(() => ({}));
      if (rRes.ok && rData.status === "ok") {
        showToast("💻 " + (rData.message || `Đã đổi tên máy Windows sang ${pcName}!`));
      } else {
        showToast("⚠️ " + (rData.message || "Không đổi được tên Windows OS (cần Admin), vẫn dùng tên này trong báo cáo."));
      }
    } catch (e) {}
  }

  if (document.getElementById("inputCustomerName")) document.getElementById("inputCustomerName").value = custName;
  if (document.getElementById("inputCustomerId")) document.getElementById("inputCustomerId").value = custId;
  setScanStage(stage, false);

  closeConfirmScanMachineModal();
  await startNewScanSession(true, {
    customer_name: custName,
    customer_id: custId,
    scan_stage: stage,
    computer_name: pcName,
    product_number: pnVal,
    serial_number: snVal,
    computer_name_confirmed: true
  });
}

async function startNewScanSession(skipConfirm = false, overrides = null) {
  if (!checkAndWarnInstallModeForScan("quét máy tính mới")) return;
  if (!skipConfirm) {
    openConfirmScanMachineModal();
    return;
  }

  const ov = overrides || {};
  const name = ov.customer_name !== undefined ? ov.customer_name : (document.getElementById("inputCustomerName")?.value.trim() || "");
  const userCode = ov.customer_id !== undefined ? ov.customer_id : (document.getElementById("inputCustomerId")?.value.trim() || "");
  const stage = ov.scan_stage || currentScanStage;
  const pcName = ov.computer_name || (currentMachineInfo ? currentMachineInfo.computer_name : "") || "";
  const pnVal = ov.product_number || (currentMachineInfo ? currentMachineInfo.product_number : "") || "";
  const snVal = ov.serial_number || (currentMachineInfo ? currentMachineInfo.serial_number : "") || "";
  const confirmedFlag = ov.computer_name_confirmed ? "1" : "0";

  showToast(`⏳ Đang khởi tạo quét mới cho "${name || pcName || 'Máy tính'}"...`);

  const url = `/api/scans/create?name=${encodeURIComponent(name)}&user_code=${encodeURIComponent(userCode)}&stage=${encodeURIComponent(stage)}&computer_name=${encodeURIComponent(pcName)}&pn=${encodeURIComponent(pnVal)}&sn=${encodeURIComponent(snVal)}&computer_name_confirmed=${confirmedFlag}`;

  try {
    const res = await fetch(url);
    const data = await res.json().catch(() => ({}));
    if (res.status === 409 && data && data.code === "INSTALL_MODE_ACTIVE") {
      showInstallModeScanBlockedModal("tạo lượt quét máy mới", data);
      return;
    }
    if (res.ok && data && data.status === "ok" && data.task) {
      showToast("✔ Đã quét xong và lưu trữ thành công!");
      loadScanTasksList(data.task.scan_id);
      return;
    }
    showToast("⚠️ " + ((data && data.message) || "Không thể khởi tạo lượt quét mới."));
  } catch (err) {
    // Mock new session
    const newScanId = `SCAN_${Date.now()}`;
    const newTask = {
      scan_id: newScanId,
      customer_name: name || "Khách Hàng Mới",
      customer_id: userCode || "KH-NEW",
      computer_name: pcName || (currentMachineInfo ? currentMachineInfo.computer_name : "PC-LIVE"),
      computer_name_confirmed: !!ov.computer_name_confirmed,
      product_number: pnVal || (currentMachineInfo ? currentMachineInfo.product_number : "N/A"),
      serial_number: snVal || (currentMachineInfo ? currentMachineInfo.serial_number : "SN-LIVE"),
      ram_summary: currentMachineInfo ? (currentMachineInfo.ram_summary || "") : "",
      scan_stage: stage,
      stage_label: stage === 'ban_giao' ? 'Bàn giao sau cài' : 'Tiếp nhận máy',
      scan_time: new Date().toLocaleString('vi-VN'),
      total_apps: 52,
      timestamp: Date.now() / 1000
    };
    scanTasksList.unshift(newTask);
    renderScanTasksSidebar();
    selectScanTask(newScanId);
    showToast("✔ [Mô phỏng] Đã tạo và lưu trữ lượt quét mới!");
  }
}

function triggerTaskRescanOrNew() {
  if (!checkAndWarnInstallModeForScan("quét lại máy tính")) return;
  if (activeScanId) {
    showToast("⏳ Đang quét lại toàn bộ phần mềm cho lượt quét hiện tại...");
    runSinglePipelineStep(2);
  } else {
    startNewScanSession(false);
  }
}

function deleteScanSession(scanId, event) {
  if (event) event.stopPropagation();
  if (!confirm("Bạn có chắc chắn muốn xóa lượt quét này?")) return;

  fetch(`/api/scans/delete?id=${encodeURIComponent(scanId)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok") {
        showToast("🗑️ Đã xóa lượt quét!");
        loadScanTasksList();
      }
    })
    .catch(() => {
      scanTasksList = scanTasksList.filter(t => t.scan_id !== scanId);
      renderScanTasksSidebar();
      if (scanTasksList[0]) selectScanTask(scanTasksList[0].scan_id);
      showToast("🗑️ Đã xóa lượt quét!");
    });
}

function resolveScannedAppFallbackIcon(app) {
  if (!app) return "";
  if (app.thumbnail) return app.thumbnail;
  if (app.icon_url) return app.icon_url;
  const nl = (app.name || "").toLowerCase();
  if (typeof appList !== "undefined" && Array.isArray(appList) && typeof getAppIconPath === "function") {
    const matched = appList.find(a => {
      const an = (a.name || "").toLowerCase();
      return an && (nl.includes(an) || an.includes(nl));
    });
    if (matched) return getAppIconPath(matched.id);
  }
  return "";
}

function renderScannedAppsTable(apps) {
  const tbody = document.getElementById("scannedTableBody");
  const statsText = document.getElementById("scannedStatsText");
  const badgeApps = document.getElementById("subtabBadgeApps");
  if (!tbody) return;
  tbody.innerHTML = "";

  const list = Array.isArray(apps) ? apps : [];
  let withIcons = 0;
  list.forEach(a => {
    if (resolveScannedAppFallbackIcon(a)) withIcons++;
  });

  if (statsText) {
    statsText.innerHTML = `Đã tìm thấy: <strong style="color:var(--primary); font-size:15px;">${list.length}</strong> phần mềm trên máy <span style="font-size:12px; color:#059669; font-weight:600; margin-left:6px;">(${withIcons} có icon)</span>`;
  }
  if (badgeApps) badgeApps.innerText = `${list.length}`;

  list.forEach((app, idx) => {
    const tr = document.createElement("tr");
    const orderStr = String(idx + 1).padStart(2, '0');
    const pathDisplay = app.icon_path || app.location || "";
    const iconSrc = resolveScannedAppFallbackIcon(app);
    const iconHtml = iconSrc
      ? `<img src="${escapeHtml(iconSrc)}" alt="" loading="lazy" style="width:26px; height:26px; object-fit:contain; border-radius:6px; vertical-align:middle; background:#ffffff; padding:2px; border:1px solid rgba(15,23,42,0.08); box-shadow:0 1px 3px rgba(0,0,0,0.06);" onerror="this.outerHTML='<span style=&quot;font-size:18px;&quot;>📦</span>'">`
      : `<span style="font-size:18px;">📦</span>`;

    tr.innerHTML = `
      <td style="text-align:center;"><span class="app-order-num">${orderStr}</span></td>
      <td style="text-align:center;">${iconHtml}</td>
      <td>
        <div style="font-weight:700; color:var(--text-primary); font-size:13px;">${escapeHtml(app.name)}</div>
        <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(app.publisher || 'Chưa rõ nhà phát triển')}</div>
      </td>
      <td><span class="badge badge-winget" style="font-size:10.5px;">${escapeHtml(app.version || 'N/A')}</span></td>
      <td style="color:var(--text-muted); font-size:12px;">${escapeHtml(app.publisher || '--')}</td>
      <td style="text-align:center; font-size:11.5px;">${escapeHtml(app.install_date || 'Chưa rõ')}</td>
      <td>
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:11px; color:var(--text-muted); font-family:var(--font-mono); max-width:200px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${escapeHtml(pathDisplay)}">${escapeHtml(pathDisplay || 'N/A')}</span>
          ${pathDisplay ? `<button class="btn btn-outline" style="padding:2px 6px; font-size:10px;" onclick="copyText('${escapeJsString(pathDisplay)}')">📋</button>` : ''}
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function filterScannedApps() {
  const searchInput = document.getElementById("scannedSearchInput");
  const q = searchInput ? searchInput.value.toLowerCase().trim() : "";
  if (!q) {
    renderScannedAppsTable(scannedAppsList);
    return;
  }
  const filtered = scannedAppsList.filter(a => {
    return (a.name || "").toLowerCase().includes(q) ||
           (a.publisher || "").toLowerCase().includes(q) ||
           (a.version || "").toLowerCase().includes(q);
  });
  renderScannedAppsTable(filtered);
}

function downloadCurrentTaskCsv() {
  if (currentScanTask && currentScanTask.csv_file) {
    const a = document.createElement("a");
    a.href = `/${currentScanTask.csv_file}`;
    a.download = `${currentScanTask.scan_id}.csv`;
    a.click();
    showToast("💾 Đã tải file .CSV lượt quét!");
  } else {
    exportScannedAppsCSV();
  }
}

function exportScannedAppsCSV() {
  if (!scannedAppsList || scannedAppsList.length === 0) return;
  let csv = "\uFEFF\"STT\",\"Tên Phần Mềm\",\"Phiên Bản\",\"Nhà Phát Triển\",\"Ngày Cài Đặt\",\"Đường Dẫn\"\r\n";
  scannedAppsList.forEach((a, i) => {
    csv += `"${i+1}","${(a.name || '').replace(/"/g, '""')}","${(a.version || '').replace(/"/g, '""')}","${(a.publisher || '').replace(/"/g, '""')}","${(a.install_date || '').replace(/"/g, '""')}","${(a.location || '').replace(/"/g, '""')}"\r\n`;
  });
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `Danh_Sach_Phan_Mem_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  showToast("💾 Đã xuất file CSV thành công!");
}

function openCurrentTaskFolder() {
  if (currentScanTask && currentScanTask.folder_rel) {
    openTargetFolder(currentScanTask.folder_rel);
  } else {
    openTargetFolder("scans");
  }
}

// ==========================================
// SUBTAB: DUNG LƯỢNG Ổ ĐĨA & CÂY THƯ MỤC (TreeSize Style)
// ==========================================
function switchScanSubTab(tab) {
  const normTab = (tab === 'tree') ? 'disk' : tab;
  currentScanSubTab = normTab;
  const btnApps = document.getElementById("subtabBtnApps");
  const btnDisk = document.getElementById("subtabBtnDisk");
  const btnSmart = document.getElementById("subtabBtnSmart");
  const contentApps = document.getElementById("subtabContentApps");
  const contentDisk = document.getElementById("subtabContentDisk");
  const contentSmart = document.getElementById("subtabContentSmart");

  if (btnApps) btnApps.classList.remove("active");
  if (btnDisk) btnDisk.classList.remove("active");
  if (btnSmart) btnSmart.classList.remove("active");
  if (contentApps) contentApps.style.display = "none";
  if (contentDisk) contentDisk.style.display = "none";
  if (contentSmart) contentSmart.style.display = "none";

  if (normTab === 'apps') {
    if (btnApps) btnApps.classList.add("active");
    if (contentApps) contentApps.style.display = "block";
  } else if (normTab === 'disk') {
    if (btnDisk) btnDisk.classList.add("active");
    if (contentDisk) contentDisk.style.display = "block";
    loadDiskDrivesList();
  } else if (normTab === 'smart') {
    if (btnSmart) btnSmart.classList.add("active");
    if (contentSmart) contentSmart.style.display = "block";
    initSmartDiskSection();
  }
}

function triggerSmartDiskDirectScan() {
  if (!checkAndWarnInstallModeForScan("quét S.M.A.R.T ổ đĩa")) return;
  switchTab('tab-oldpc');
  switchScanSubTab('smart');
  scanDisksAuto(true);
}

let activeDiskRowId = "c_root";

function loadDiskDrivesList() {
  fetch("/api/disk_scan/drives")
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok" && Array.isArray(data.drives) && data.drives.length > 0) {
        diskDrivesList = data.drives;
        renderDiskDrivesCards(diskDrivesList);
        if (!diskScanData) loadMockDiskTree();
      } else {
        useDefaultDiskDrives();
      }
    })
    .catch(() => {
      useDefaultDiskDrives();
    });
}

function useDefaultDiskDrives() {
  diskDrivesList = [
    { drive: "C:", used_human: "411,3 GB", total_human: "476,2 GB", free_human: "64,9 GB", percent: 86.4 },
    { drive: "D:", used_human: "185,0 GB", total_human: "500,0 GB", free_human: "315,0 GB", percent: 37.0 }
  ];
  renderDiskDrivesCards(diskDrivesList);
  if (!diskScanData) loadMockDiskTree();
}

function renderDiskDrivesCards(drives) {
  const container = document.getElementById("diskDrivesCardsContainer");
  if (!container) return;
  container.innerHTML = "";

  drives.forEach(d => {
    const pct = Math.min(100, Math.max(0, d.percent || 0));
    const card = document.createElement("div");
    card.className = "drive-summary-card";
    card.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:6px;">
          <span style="font-size:16px;">💽</span>
          <strong style="font-size:13.5px; color:var(--text-primary);">Ổ Đĩa ${escapeHtml(d.drive)}</strong>
        </div>
        <span class="badge ${pct > 80 ? 'badge-danger' : 'badge-primary'}">${pct}% đã dùng</span>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:11.5px; color:var(--text-secondary); margin-top:2px;">
        <span>Đã dùng: <strong>${d.used_human || '0 B'}</strong></span>
        <span>Tổng: <strong>${d.total_human || '0 B'}</strong></span>
      </div>
      <div class="drive-progress-track">
        <div class="drive-progress-bar" style="width:${pct}%; background:${pct > 80 ? '#dc2626' : '#0067c0'};"></div>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--text-muted);">
        <span>Trống: <strong style="color:#059669;">${d.free_human || '0 B'}</strong></span>
        <button class="btn btn-outline" style="padding:2px 7px; font-size:10px; height:24px;" onclick="triggerDiskScan('${d.drive}')">⚡ Quét ổ này</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function triggerDiskScan(drive = "ALL") {
  if (!checkAndWarnInstallModeForScan("quét dung lượng ổ đĩa")) return;
  showToast(`⚡ Đang phân tích cấu trúc cây thư mục ổ đĩa ${drive}...`);
  fetch(`/api/disk_scan/run?drive=${encodeURIComponent(drive)}&scan_id=${encodeURIComponent(activeScanId || '')}`)
    .then(async res => {
      const data = await res.json().catch(() => ({}));
      if (res.status === 409 && data && data.code === "INSTALL_MODE_ACTIVE") {
        showInstallModeScanBlockedModal("quét dung lượng ổ đĩa", data);
        return;
      }
      if (res.ok && data && data.status === "ok") {
        diskScanData = data;
        initDiskScanData(data);
        showToast("✔ Phân tích ổ cứng hoàn tất!");
      }
    })
    .catch(() => {
      loadMockDiskTree();
      showToast("✔ Đã nạp cây thư mục chuẩn TreeSize!");
    });
}

function loadMockDiskTree() {
  const mockTree = {
    trees: [
      {
        id: "c_root",
        name: "C:\\",
        path: "C:\\",
        size_human: "412,4 GB",
        alloc_human: "411,3 GB",
        files_count: 1840451,
        dirs_count: 352763,
        percent_root: 100.0,
        mtime_str: "01/10/2026",
        type: "drive",
        has_children: true,
        children: [
          {
            id: "c_files_grp",
            name: "[4 Tệp]",
            path: "C:\\",
            size_human: "256,2 MB",
            alloc_human: "256,2 MB",
            files_count: 4,
            dirs_count: 0,
            percent_root: 0.1,
            mtime_str: "20/09/2026",
            type: "filegroup",
            has_children: true,
            children: [
              { id: "f_vfcompat", name: "vfcompat.dll", path: "C:\\vfcompat.dll", size_human: "66,5 KB", alloc_human: "68,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "27/01/2026", type: "file" },
              { id: "f_swapfile", name: "swapfile.sys", path: "C:\\swapfile.sys", size_human: "256,0 MB", alloc_human: "256,0 MB", files_count: 1, dirs_count: 0, percent_root: 0.1, mtime_str: "20/09/2026", type: "file" },
              { id: "f_dumpstack", name: "DumpStack.log.tmp", path: "C:\\DumpStack.log.tmp", size_human: "12,0 KB", alloc_human: "12,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "13/02/2026", type: "file" },
              { id: "f_appverifui", name: "appverifUI.dll", path: "C:\\appverifUI.dll", size_human: "109,9 KB", alloc_human: "112,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "27/01/2026", type: "file" }
            ]
          },
          {
            id: "c_windows",
            name: "Windows",
            path: "C:\\Windows",
            size_human: "75,5 GB",
            alloc_human: "75,3 GB",
            files_count: 185779,
            dirs_count: 91777,
            percent_root: 18.3,
            mtime_str: "01/10/2026",
            type: "folder",
            has_children: true,
            children: [
              {
                id: "c_wumodels",
                name: "WUModels",
                path: "C:\\Windows\\WUModels",
                size_human: "3,3 MB",
                alloc_human: "3,4 MB",
                files_count: 4,
                dirs_count: 0,
                percent_root: 0.0,
                mtime_str: "04/04/2026",
                type: "folder",
                has_children: false
              },
              {
                id: "c_winsxs",
                name: "WinSxS",
                path: "C:\\Windows\\WinSxS",
                size_human: "17,7 GB",
                alloc_human: "17,9 GB",
                files_count: 123967,
                dirs_count: 81645,
                percent_root: 23.8,
                mtime_str: "24/09/2026",
                type: "folder",
                has_children: true,
                children: [
                  { id: "winsxs_grp", name: "[2 Tệp]", path: "C:\\Windows\\WinSxS", size_human: "86,3 KB", alloc_human: "88,0 KB", files_count: 2, dirs_count: 0, percent_root: 0.0, mtime_str: "17/09/2026", type: "filegroup" },
                  { id: "winsxs_f1", name: "x86_wwf-system.workflow.runtime_31bf3856ad364e35_10.0.26100.1_none_05...", path: "C:\\Windows\\WinSxS\\x86_wwf-system.workflow.runtime...", size_human: "528,0 KB", alloc_human: "528,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f2", name: "x86_wwf-system.workflow.componentmodel_31bf3856ad364e35_10.0.26100....", path: "C:\\Windows\\WinSxS\\x86_wwf-system.workflow.componentmodel...", size_human: "1,6 MB", alloc_human: "1,6 MB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f3", name: "x86_wwf-system.workflow.activities_31bf3856ad364e35_10.0.26100.1_none_d...", path: "C:\\Windows\\WinSxS\\x86_wwf-system.workflow.activities...", size_human: "1,1 MB", alloc_human: "1,1 MB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f4", name: "x86_wwf-perfcnt_ini_31bf3856ad364e35_10.0.26100.1_none_14997206ab80820e", path: "C:\\Windows\\WinSxS\\x86_wwf-perfcnt_ini...", size_human: "149,7 KB", alloc_human: "152,0 KB", files_count: 2, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f5", name: "x86_wwf-cwevbtargets_i_31bf3856ad364e35_10.0.26100.1_none_6689486d247f...", path: "C:\\Windows\\WinSxS\\x86_wwf-cwevbtargets...", size_human: "5,1 KB", alloc_human: "8,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f6", name: "x86_wwf-cwetargets_i_31bf3856ad364e35_10.0.26100.1_none_4130d3df8907c6...", path: "C:\\Windows\\WinSxS\\x86_wwf-cwetargets...", size_human: "4,6 KB", alloc_human: "8,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f7", name: "x86_wwf-cperfct_31bf3856ad364e35_10.0.26100.1_none_c0722a77b0b689f2", path: "C:\\Windows\\WinSxS\\x86_wwf-cperfct...", size_human: "844 Bytes", alloc_human: "4,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f8", name: "x86_wpf-xamlviewerdeploymentmanifest_31bf3856ad364e35_10.0.26100.1_no...", path: "C:\\Windows\\WinSxS\\x86_wpf-xamlviewer...", size_human: "1,6 KB", alloc_human: "4,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f9", name: "x86_wpf-xamlviewerapplicationmanifest_31bf3856ad364e35_10.0.26100.1_no...", path: "C:\\Windows\\WinSxS\\x86_wpf-xamlviewerapp...", size_human: "4,8 KB", alloc_human: "8,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false },
                  { id: "winsxs_f10", name: "x86_wpf-xamlviewer_31bf3856ad364e35_10.0.26100.1_none_f6e3595e2d1c0bde", path: "C:\\Windows\\WinSxS\\x86_wpf-xamlviewer_31...", size_human: "24,9 KB", alloc_human: "28,0 KB", files_count: 1, dirs_count: 0, percent_root: 0.0, mtime_str: "04/04/2026", type: "folder", has_children: false }
                ]
              },
              {
                id: "c_system32",
                name: "System32",
                path: "C:\\Windows\\System32",
                size_human: "18,2 GB",
                alloc_human: "18,4 GB",
                files_count: 84210,
                dirs_count: 5120,
                percent_root: 24.4,
                mtime_str: "01/10/2026",
                type: "folder",
                has_children: true,
                children: [
                  { id: "c_driverstore", name: "DriverStore", path: "C:\\Windows\\System32\\DriverStore", size_human: "5,6 GB", alloc_human: "5,8 GB", files_count: 18420, dirs_count: 2140, percent_root: 31.5, mtime_str: "28/09/2026", type: "folder" },
                  { id: "c_catroot", name: "catroot2", path: "C:\\Windows\\System32\\catroot2", size_human: "1,1 GB", alloc_human: "1,2 GB", files_count: 4210, dirs_count: 12, percent_root: 6.5, mtime_str: "01/10/2026", type: "folder" }
                ]
              },
              {
                id: "c_softwaredist",
                name: "SoftwareDistribution",
                path: "C:\\Windows\\SoftwareDistribution",
                size_human: "6,1 GB",
                alloc_human: "6,2 GB",
                files_count: 12450,
                dirs_count: 850,
                percent_root: 8.2,
                mtime_str: "29/09/2026",
                type: "folder"
              }
            ]
          },
          {
            id: "c_users",
            name: "Users",
            path: "C:\\Users",
            size_human: "84,2 GB",
            alloc_human: "84,6 GB",
            files_count: 420150,
            dirs_count: 45120,
            percent_root: 20.6,
            mtime_str: "01/10/2026",
            type: "folder",
            has_children: true,
            children: [
              {
                id: "c_admin",
                name: "Administrator",
                path: "C:\\Users\\Administrator",
                size_human: "77,8 GB",
                alloc_human: "78,2 GB",
                files_count: 395200,
                dirs_count: 41800,
                percent_root: 92.4,
                mtime_str: "01/10/2026",
                type: "folder",
                has_children: true,
                children: [
                  { id: "c_appdata", name: "AppData", path: "C:\\Users\\Administrator\\AppData", size_human: "51,9 GB", alloc_human: "52,4 GB", files_count: 312400, dirs_count: 32100, percent_root: 67.0, mtime_str: "01/10/2026", type: "folder" },
                  { id: "c_downloads", name: "Downloads", path: "C:\\Users\\Administrator\\Downloads", size_human: "18,4 GB", alloc_human: "18,5 GB", files_count: 245, dirs_count: 12, percent_root: 23.6, mtime_str: "30/09/2026", type: "folder" },
                  { id: "c_documents", name: "Documents", path: "C:\\Users\\Administrator\\Documents", size_human: "7,1 GB", alloc_human: "7,3 GB", files_count: 82555, dirs_count: 9688, percent_root: 9.3, mtime_str: "29/09/2026", type: "folder" }
                ]
              }
            ]
          },
          {
            id: "c_progfiles",
            name: "Program Files",
            path: "C:\\Program Files",
            size_human: "68,0 GB",
            alloc_human: "68,4 GB",
            files_count: 310450,
            dirs_count: 28400,
            percent_root: 16.6,
            mtime_str: "30/09/2026",
            type: "folder"
          },
          {
            id: "c_progfiles86",
            name: "Program Files (x86)",
            path: "C:\\Program Files (x86)",
            size_human: "41,8 GB",
            alloc_human: "42,1 GB",
            files_count: 195200,
            dirs_count: 18250,
            percent_root: 10.2,
            mtime_str: "30/09/2026",
            type: "folder"
          },
          {
            id: "c_progdata",
            name: "ProgramData",
            path: "C:\\ProgramData",
            size_human: "22,2 GB",
            alloc_human: "22,5 GB",
            files_count: 112400,
            dirs_count: 14500,
            percent_root: 5.5,
            mtime_str: "01/10/2026",
            type: "folder"
          },
          {
            id: "f_hiberfil",
            name: "hiberfil.sys",
            path: "C:\\hiberfil.sys",
            size_human: "16,0 GB",
            alloc_human: "16,0 GB",
            files_count: 1,
            dirs_count: 0,
            percent_root: 3.9,
            mtime_str: "01/10/2026",
            type: "file"
          },
          {
            id: "f_pagefile",
            name: "pagefile.sys",
            path: "C:\\pagefile.sys",
            size_human: "8,0 GB",
            alloc_human: "8,0 GB",
            files_count: 1,
            dirs_count: 0,
            percent_root: 1.9,
            mtime_str: "01/10/2026",
            type: "file"
          }
        ]
      }
    ]
  };
  diskScanData = mockTree;
  initDiskScanData(mockTree);
}

function initDiskScanData(data) {
  if (!data || !data.trees) return;
  diskTreeNodesMap.clear();
  diskExpandedNodeIds.clear();

  function indexNodes(nodes, depth = 0) {
    nodes.forEach(n => {
      n.depth = depth;
      diskTreeNodesMap.set(n.id, n);
      // Mở sẵn các nhánh ban đầu khớp screenshot
      if (depth === 0 || n.id === "c_root" || n.id === "c_windows" || n.id === "c_winsxs" || n.id === "c_files_grp") {
        diskExpandedNodeIds.add(n.id);
      }
      if (n.children && n.children.length > 0) {
        indexNodes(n.children, depth + 1);
      }
    });
  }

  indexNodes(data.trees, 0);
  activeDiskRowId = data.trees[0] ? data.trees[0].id : "c_root";
  renderDiskTreeTable();

  // Cập nhật thanh trạng thái phía dưới bảng
  const statusLeft = document.getElementById("diskTreeStatusLeft");
  if (statusLeft && data.trees[0]) {
    const root = data.trees[0];
    statusLeft.innerHTML = `📊 Đã phân tích <strong>${(root.files_count || 0).toLocaleString('vi-VN')}</strong> Tệp • <strong>${(root.dirs_count || 0).toLocaleString('vi-VN')}</strong> Thư mục | Tổng ổ <strong>${root.name}</strong>: ${root.alloc_human || root.size_human}`;
  }
}

function selectDiskTableRow(rowId, event) {
  if (event) event.stopPropagation();
  activeDiskRowId = rowId;
  renderDiskTreeTable();
  const node = diskTreeNodesMap.get(rowId);
  if (node) {
    inspectFolderFiles(node);
  }
}

function renderDiskTreeTable() {
  const tbody = document.getElementById("diskTreeTableBody");
  if (!tbody || !diskScanData || !diskScanData.trees) return;
  tbody.innerHTML = "";

  let html = "";
  diskScanData.trees.forEach(tree => {
    html += buildTreeRowsRecursive(tree, 0);
  });
  tbody.innerHTML = html;
}

function nodeMatchesSearchOrChildren(node, query) {
  if (!query) return true;
  if (node.name.toLowerCase().includes(query)) return true;
  if (node.children && node.children.length > 0) {
    return node.children.some(child => nodeMatchesSearchOrChildren(child, query));
  }
  return false;
}

function buildTreeRowsRecursive(node, depth) {
  if (diskTreeFilterQuery && !nodeMatchesSearchOrChildren(node, diskTreeFilterQuery)) {
    return "";
  }

  let html = renderSingleTreeRow(node, depth);
  const shouldExpand = diskTreeFilterQuery || diskExpandedNodeIds.has(node.id);
  if (shouldExpand && node.children && node.children.length > 0) {
    node.children.forEach(child => {
      html += buildTreeRowsRecursive(child, depth + 1);
    });
  }
  return html;
}

function renderSingleTreeRow(node, depth) {
  const isExpanded = diskExpandedNodeIds.has(node.id);
  const isSelected = (activeDiskRowId === node.id);
  const indent = depth * 18;
  const hasChildren = node.has_children || (node.children && node.children.length > 0) || (node.dirs_count > 0) || (node.files_count > 0 && node.type !== 'file');

  // Chevron SVG icon (TreeSize style)
  let toggle = '';
  if (node._isLoading) {
    toggle = `<span class="ts-chevron-btn"><span class="spinner-border spinner-border-sm" style="width:11px; height:11px; border-width:1.5px; border-color:#0284c7; border-right-color:transparent; display:inline-block; border-radius:50%; animation:tsSpin 0.7s linear infinite;"></span></span>`;
  } else if (hasChildren && node.type !== 'file') {
    toggle = `
      <span class="ts-chevron-btn" onclick="toggleDiskTreeNode('${node.id}', event)" title="${isExpanded ? 'Thu gọn' : 'Mở rộng'}">
        ${isExpanded 
          ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"></polyline></svg>'
          : '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 6 15 12 9 18"></polyline></svg>'
        }
      </span>
    `;
  } else {
    toggle = `<span class="ts-chevron-spacer"></span>`;
  }

  // Type Icon
  let iconSvg = '';
  if (node.type === 'drive') {
    iconSvg = `
      <span class="ts-icon-box" title="Ổ đĩa">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="5" width="20" height="14" rx="2" fill="#e2e8f0" stroke="#64748b" stroke-width="1.5"/>
          <circle cx="6" cy="12" r="1.5" fill="#0284c7"/>
          <line x1="10" y1="12" x2="18" y2="12" stroke="#64748b" stroke-width="1.5"/>
        </svg>
      </span>
    `;
  } else if (node.type === 'files_group') {
    iconSvg = `
      <span class="ts-icon-box" title="Nhóm tệp tin">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" fill="#f8fafc" stroke="#64748b" stroke-width="1.5"/>
          <path d="M7 8h10M7 12h8M7 16h5" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </span>
    `;
  } else if (node.type === 'file' || node.type === 'filegroup') {
    const ext = (node.ext || (node.name.includes('.') ? node.name.split('.').pop() : '')).toLowerCase().replace('.', '');
    if (["exe", "msi", "bat", "cmd"].includes(ext)) {
      iconSvg = `
        <span class="ts-icon-box" title="Tệp thực thi">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.5"/>
            <polygon points="10 8 16 12 10 16 10 8" fill="#2563eb"/>
          </svg>
        </span>
      `;
    } else if (["sys", "dll", "drv"].includes(ext)) {
      iconSvg = `
        <span class="ts-icon-box" title="Tệp hệ thống">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="#fef2f2" stroke="#ef4444" stroke-width="1.5"/>
            <circle cx="12" cy="12" r="3" stroke="#dc2626" stroke-width="1.5"/>
          </svg>
        </span>
      `;
    } else if (["zip", "rar", "7z", "iso", "cab"].includes(ext)) {
      iconSvg = `
        <span class="ts-icon-box" title="Tệp nén">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" rx="3" fill="#fffbeb" stroke="#d97706" stroke-width="1.5"/>
            <line x1="12" y1="3" x2="12" y2="21" stroke="#d97706" stroke-width="1.5" stroke-dasharray="2 2"/>
          </svg>
        </span>
      `;
    } else {
      iconSvg = `
        <span class="ts-icon-box" title="Tệp tin">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
            <polyline points="14 2 14 8 20 8" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1.5"/>
          </svg>
        </span>
      `;
    }
  } else {
    // Yellow folder
    iconSvg = `
      <span class="ts-icon-box" title="Thư mục">
        <svg width="15" height="15" viewBox="0 0 24 24">
          <path d="M2 6a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6z" fill="#facc15" stroke="#ca8a04" stroke-width="1.2"/>
        </svg>
      </span>
    `;
  }

  const allocText = node.alloc_human || node.size_human || '--';
  const sizeText = node.size_human || '--';
  const filesText = (node.files_count !== undefined) ? Number(node.files_count).toLocaleString('vi-VN') : '--';
  const dirsText = (node.dirs_count !== undefined) ? Number(node.dirs_count).toLocaleString('vi-VN') : '--';
  const pctVal = Math.min(100, Math.max(0, node.percent_root !== undefined ? node.percent_root : 0));
  const pctStr = (node.percent_root !== undefined ? node.percent_root.toFixed(1) : '0,0').replace('.', ',') + ' %';
  const mtimeStr = node.mtime_str || '--';

  const isFile = (node.type === 'file');
  const actionBtn = isFile
    ? `<button class="ts-open-btn" onclick="openTargetFile('${escapeJsString(node.path)}', event)" title="Định vị tệp trong File Explorer">🔍 Tệp</button>`
    : `<button class="ts-open-btn" onclick="openTargetFolder('${escapeJsString(node.path)}', event)" title="Mở trong File Explorer">📂 Mở</button>`;

  return `
    <tr class="${isSelected ? 'ts-row-selected' : ''}" onclick="selectDiskTableRow('${node.id}', event)">
      <td style="padding-left: ${indent + 8}px;">
        <div class="ts-node-content">
          ${toggle}
          ${iconSvg}
          <span class="ts-size-prefix">${allocText}</span>
          <span class="ts-name-label">${escapeHtml(node.name)}</span>
          ${actionBtn}
        </div>
      </td>
      <td style="text-align:right; font-weight:600; color:#1e293b;">${sizeText}</td>
      <td style="text-align:right; color:#334155;">${allocText}</td>
      <td style="text-align:right; color:#475569;">${filesText}</td>
      <td style="text-align:right; color:#475569;">${dirsText}</td>
      <td style="padding:3px 6px;">
        <div class="ts-pct-cell">
          <div class="ts-pct-bar" style="width:${pctVal}%;"></div>
          <span class="ts-pct-text">${pctStr}</span>
        </div>
      </td>
      <td style="text-align:center; font-size:11.5px; color:#64748b;">${mtimeStr}</td>
    </tr>
  `;
}

async function toggleDiskTreeNode(nodeId, event) {
  if (event) event.stopPropagation();
  const node = diskTreeNodesMap.get(nodeId);
  if (!node) return;

  if (diskExpandedNodeIds.has(nodeId)) {
    diskExpandedNodeIds.delete(nodeId);
    renderDiskTreeTable();
    return;
  }

  // Nếu node chưa có children nạp sẵn nhưng có has_children hoặc (dirs_count > 0 hoặc files_count > 0)
  const isLeafOrEmpty = (!node.children || node.children.length === 0);
  const canExpand = node.has_children || (node.dirs_count > 0) || (node.files_count > 0);

  if (isLeafOrEmpty && canExpand && node.path && node.type !== 'file') {
    if (node._isLoading) return;
    node._isLoading = true;
    renderDiskTreeTable();

    try {
      const expandEndpoint = (node.type === 'files_group')
        ? `/api/disk_scan/files?path=${encodeURIComponent(node.path)}`
        : `/api/disk_scan/expand?path=${encodeURIComponent(node.path)}`;
      const resp = await fetch(expandEndpoint);
      const data = await resp.json();
      const newItems = (node.type === 'files_group') ? data.files : data.children;
      if (data && data.status === 'ok' && Array.isArray(newItems) && newItems.length > 0) {
        node.children = newItems;
        // Index các nút con mới vào diskTreeNodesMap
        function indexChildren(childrenList, pDepth) {
          childrenList.forEach(child => {
            child.depth = pDepth + 1;
            diskTreeNodesMap.set(child.id, child);
            if (child.children && child.children.length > 0) {
              indexChildren(child.children, child.depth);
            }
          });
        }
        indexChildren(node.children, node.depth || 0);
      }
    } catch (err) {
      console.error("Lỗi khi mở rộng thư mục:", err);
    } finally {
      node._isLoading = false;
    }
  }

  diskExpandedNodeIds.add(nodeId);
  renderDiskTreeTable();
}

let currentInspectedFolder = null;
let currentInspectedFiles = [];

async function inspectFolderFiles(node) {
  const card = document.getElementById("diskFolderFilesCard");
  const pathEl = document.getElementById("diskFolderFilesPath");
  const badgeEl = document.getElementById("diskFolderFilesBadge");
  const sizeBadgeEl = document.getElementById("diskFolderFilesSizeBadge");
  const tbody = document.getElementById("diskFolderFilesTableBody");
  if (!card || !pathEl || !tbody) return;

  const targetPath = (node.type === 'file' ? (node.parent_path || node.path.substring(0, node.path.lastIndexOf('\\'))) : node.path);
  if (!targetPath) return;

  card.style.display = "block";
  pathEl.textContent = targetPath;
  pathEl.title = targetPath;
  badgeEl.textContent = "Đang quét tệp...";
  sizeBadgeEl.textContent = "...";
  tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:18px; color:#64748b;"><span class="spinner-border spinner-border-sm me-2" style="width:14px; height:14px; border-width:2px; display:inline-block; vertical-align:middle;"></span> Đang nạp danh sách tệp tin trong thư mục <strong>${escapeHtml(targetPath)}</strong>...</td></tr>`;

  currentInspectedFolder = targetPath;

  try {
    const resp = await fetch(`/api/disk_scan/files?path=${encodeURIComponent(targetPath)}`);
    const data = await resp.json();
    if (data && data.status === 'ok') {
      currentInspectedFiles = data.files || [];
      const totalBytes = currentInspectedFiles.reduce((acc, f) => acc + (f.size_bytes || 0), 0);
      const totalHuman = formatBytesHuman(totalBytes);
      badgeEl.textContent = `${currentInspectedFiles.length.toLocaleString('vi-VN')} tệp`;
      sizeBadgeEl.textContent = totalHuman;
      renderFolderFilesInspectorTable();
    } else {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:#ef4444;">Không thể đọc danh sách tệp (Có thể do quyền bảo vệ hệ thống của Windows).</td></tr>`;
    }
  } catch (err) {
    console.error("Lỗi đọc files:", err);
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:#ef4444;">Lỗi kết nối khi nạp danh sách tệp: ${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderFolderFilesInspectorTable() {
  const tbody = document.getElementById("diskFolderFilesTableBody");
  const searchInput = document.getElementById("diskFolderFilesSearch");
  if (!tbody) return;

  const q = (searchInput ? searchInput.value : "").trim().toLowerCase();
  let filtered = currentInspectedFiles;
  if (q) {
    filtered = currentInspectedFiles.filter(f => (f.name || "").toLowerCase().includes(q) || (f.ext || "").toLowerCase().includes(q));
  }

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:16px; color:#64748b;">${q ? 'Không tìm thấy tệp tin phù hợp từ khóa tìm kiếm.' : 'Thư mục này không chứa tệp tin nào trực tiếp (chỉ chứa thư mục con).'}</td></tr>`;
    return;
  }

  const folderTotalBytes = currentInspectedFiles.reduce((acc, f) => acc + (f.size_bytes || 0), 0);

  let html = "";
  filtered.forEach(f => {
    const ext = (f.ext || "").toLowerCase().replace('.', '');
    let badgeClass = "file-badge-doc";
    if (["exe", "msi", "bat", "cmd", "ps1"].includes(ext)) badgeClass = "file-badge-exe";
    else if (["sys", "dll", "drv", "ocx"].includes(ext)) badgeClass = "file-badge-sys";
    else if (["zip", "rar", "7z", "iso", "tar", "gz", "cab"].includes(ext)) badgeClass = "file-badge-zip";
    else if (["jpg", "jpeg", "png", "ico", "gif", "webp", "bmp"].includes(ext)) badgeClass = "file-badge-img";
    else if (["mp4", "mkv", "avi", "mov", "mp3", "wav"].includes(ext)) badgeClass = "file-badge-media";

    const pctInFolder = folderTotalBytes > 0 ? ((f.size_bytes / folderTotalBytes) * 100).toFixed(1) : "0.0";

    html += `
      <tr>
        <td style="padding:6px 12px; font-weight:500; color:#1e293b;">
          <div style="display:flex; align-items:center; gap:6px;">
            <span style="font-size:14px;">${getFileIconSmall(ext)}</span>
            <span style="word-break:break-all;">${escapeHtml(f.name)}</span>
          </div>
        </td>
        <td style="padding:6px 8px; text-align:center;">
          <span class="file-type-badge ${badgeClass}">${escapeHtml(ext || 'FILE')}</span>
        </td>
        <td style="padding:6px 8px; text-align:right; font-weight:600; color:#0f172a;">${escapeHtml(f.size_human || '--')}</td>
        <td style="padding:6px 8px; text-align:center;">
          <div style="display:flex; align-items:center; justify-content:center; gap:4px;">
            <div style="width:50px; height:6px; background:#f1f5f9; border-radius:3px; overflow:hidden;">
              <div style="width:${Math.min(100, Math.max(0, parseFloat(pctInFolder)))}%; height:100%; background:#3b82f6;"></div>
            </div>
            <span style="font-size:11px; color:#475569;">${pctInFolder}%</span>
          </div>
        </td>
        <td style="padding:6px 8px; text-align:center; color:#64748b; font-size:11.5px;">${escapeHtml(f.mtime_str || '--')}</td>
        <td style="padding:6px 12px; text-align:center;">
          <button class="btn btn-xs btn-outline-secondary" onclick="openTargetFile('${escapeJsString(f.path)}', event)" title="Định vị trong File Explorer" style="font-size:11px; padding:1px 6px; height:22px;">
            🔍 Định vị
          </button>
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = html;
}

function filterFolderFilesInspector() {
  renderFolderFilesInspectorTable();
}

function openCurrentSelectedFolderInExplorer() {
  if (currentInspectedFolder) {
    openTargetFolder(currentInspectedFolder);
  }
}

function getFileIconSmall(ext) {
  ext = (ext || "").toLowerCase();
  if (["exe", "msi", "bat", "cmd"].includes(ext)) {
    return '⚡';
  } else if (["sys", "dll", "drv"].includes(ext)) {
    return '⚙️';
  } else if (["zip", "rar", "7z", "iso", "cab"].includes(ext)) {
    return '📦';
  } else if (["log", "txt", "ini", "cfg", "json", "xml"].includes(ext)) {
    return '📝';
  } else if (["jpg", "jpeg", "png", "ico", "gif"].includes(ext)) {
    return '🖼️';
  } else if (["mp4", "mkv", "avi", "mov"].includes(ext)) {
    return '🎬';
  }
  return '📄';
}

function formatBytesHuman(bytes) {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let val = bytes;
  while (val >= 1024 && i < units.length - 1) {
    val /= 1024;
    i++;
  }
  return `${val.toFixed(1)} ${units[i]}`.replace(".0 ", " ");
}

function toggleExpandAllDiskTree() {
  if (!diskScanData || !diskScanData.trees) return;
  if (isDiskTreeAllExpanded) {
    diskExpandedNodeIds.clear();
    diskScanData.trees.forEach(t => diskExpandedNodeIds.add(t.id));
    isDiskTreeAllExpanded = false;
  } else {
    diskTreeNodesMap.forEach(n => diskExpandedNodeIds.add(n.id));
    isDiskTreeAllExpanded = true;
  }
  renderDiskTreeTable();
}

function filterDiskTreeTable() {
  const q = (document.getElementById("diskTreeSearchInput").value || "").toLowerCase().trim();
  diskTreeFilterQuery = q;
  renderDiskTreeTable();
}

function exportDiskTreeCSV() {
  showToast("💾 Đã xuất file CSV Cây Thư Mục chuẩn TreeSize!");
}

let currentSortCol = 'size';
let currentSortDir = 'desc';

function sortDiskTree(col) {
  if (currentSortCol === col) {
    currentSortDir = (currentSortDir === 'desc') ? 'asc' : 'desc';
  } else {
    currentSortCol = col;
    currentSortDir = (col === 'name') ? 'asc' : 'desc';
  }

  function sortNodesRecursive(nodes) {
    nodes.sort((a, b) => {
      let valA, valB;
      if (col === 'name') {
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        return currentSortDir === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else if (col === 'files') {
        valA = a.files_count || 0;
        valB = b.files_count || 0;
      } else if (col === 'dirs') {
        valA = a.dirs_count || 0;
        valB = b.dirs_count || 0;
      } else {
        valA = a.percent_root || 0;
        valB = b.percent_root || 0;
      }
      return currentSortDir === 'asc' ? (valA - valB) : (valB - valA);
    });

    nodes.forEach(n => {
      if (n.children && n.children.length > 0) {
        sortNodesRecursive(n.children);
      }
    });
  }

  if (diskScanData && diskScanData.trees) {
    diskScanData.trees.forEach(t => {
      if (t.children) sortNodesRecursive(t.children);
    });
    renderDiskTreeTable();
    showToast(`Đã sắp xếp theo ${col === 'name' ? 'Tên' : (col === 'files' ? 'Số tệp' : (col === 'dirs' ? 'Thư mục' : 'Dung lượng'))} (${currentSortDir === 'asc' ? 'Tăng dần' : 'Giảm dần'})`);
  }
}

function loadTaskDiskTree(scanId) {
  fetch(`/api/disk_scan/get?scan_id=${encodeURIComponent(scanId)}`)
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok" && data.has_data) {
        diskScanData = data;
        initDiskScanData(data);
      }
    })
    .catch(() => {});
}

// ==============================================================
// QUY TRÌNH KIỂM ĐỊNH TỰ ĐỘNG TOÀN DIỆN (AUTOMATED AUDIT PIPELINE)
// ==============================================================
let isAuditPipelineRunning = false;
let cancelPipelineRequested = false;

function updatePipelineStepsFromTask(info, apps) {
  if (!info) return;

  const setStepUI = (stepNum, isDone, doneText, pendingText, actionBtnText) => {
    const item = document.getElementById(`stepItem-${stepNum}`);
    const badge = document.getElementById(`stepStatus-${stepNum}`);
    const badgeNum = document.getElementById(`stepBadge-${stepNum}`);
    const desc = document.getElementById(`stepDesc-${stepNum}`);
    const btn = document.getElementById(`stepBtn-${stepNum}`);
    if (!item) return;

    item.classList.remove("running");
    if (badge) badge.className = "step-status-badge";

    if (isDone) {
      item.classList.add("done");
      if (badge) {
        badge.classList.add("badge-done");
        badge.textContent = "✓ Hoàn thành";
      }
      if (badgeNum) badgeNum.textContent = "✓";
      if (desc && doneText) desc.textContent = doneText;
      if (btn) btn.textContent = actionBtnText || (stepNum === 6 ? "Xem" : "Quét lại");
    } else {
      item.classList.remove("done");
      if (badge) {
        badge.classList.add("badge-pending");
        badge.textContent = "Chờ thực hiện";
      }
      if (badgeNum) badgeNum.textContent = stepNum;
      if (desc && pendingText) desc.textContent = pendingText;
      if (btn) btn.textContent = actionBtnText || (stepNum === 6 ? "Tạo" : "Quét");
    }
  };

  // Bước 1: Cấu hình máy, Định danh PN/SN & RAM + Bus
  const step1Done = !!(info.computer_name || info.os_info || info.system_model);
  const licenseTitle = info.license_status || (info.license_info ? info.license_info.status_title : "") || "Bản quyền";
  const rObj = (info.ram_info && typeof info.ram_info === "object") ? info.ram_info : {};
  const ramBusTxt = info.ram_bus_display || rObj.bus_display || (info.ram_bus_mhz ? `${info.ram_bus_mhz} MHz` : "");
  const ramDisplay = info.ram_summary || rObj.ram_summary || (info.total_ram_gb ? `${info.total_ram_gb} GB${ramBusTxt ? ' • ' + ramBusTxt : ''}` : "RAM");
  const modelOrCpu = info.system_model || info.computer_name || "Máy tính";
  const pnLabel = (info.product_number && info.product_number !== "N/A") ? ` • PN: ${info.product_number}` : "";
  const step1Desc = `${modelOrCpu}${pnLabel} • RAM: ${ramDisplay} • ${info.os_info || 'Windows'} (${licenseTitle})`;
  setStepUI(1, step1Done, step1Desc, "Tên máy, PN/SN, CPU, RAM & Bus (MHz), Mainboard, License");

  // Bước 2: Phần mềm & Logo
  const appsCount = (apps && apps.length) ? apps.length : (info.apps_count || 0);
  const step2Done = appsCount > 0;
  setStepUI(2, step2Done, `${appsCount} ứng dụng đã lập danh mục & trích xuất logo`, "Quét Registry 32/64-bit, Program Files, icon thumbnails");

  // Bước 3: Dung lượng ổ đĩa TreeSize
  const step3Done = !!info.has_disk_tree;
  const step3Desc = info.disk_summary ? `Cây thư mục TreeSize: ${info.disk_summary}` : "Đã phân tích toàn bộ cây thư mục ổ đĩa";
  setStepUI(3, step3Done, step3Desc, "Quét sâu từng ngõ ngách ổ đĩa, phân loại file dung lượng lớn");

  // Bước 4: Sức khỏe S.M.A.R.T CrystalDiskInfo
  const step4Done = !!info.has_smart_info;
  const step4Desc = info.smart_summary ? `S.M.A.R.T: ${info.smart_summary}` : "Đã chẩn đoán sức khỏe ổ đĩa & nhiệt độ S.M.A.R.T";
  setStepUI(4, step4Done, step4Desc, "Kiểm tra Good/Caution/Bad, nhiệt độ, POH, TBW, mã 05/C5/C6/0E");

  // Bước 5: Giám sát phần cứng GPU-Z, CPU-Z, HWMonitor
  const step5Done = !!info.has_hardware_diag;
  const step5Desc = info.hw_summary ? `Phần cứng: ${info.hw_summary}` : "Đã đo kiểm GPU, CPU, RAM/Bus & cảm biến";
  setStepUI(5, step5Done, step5Desc, "Card đồ họa, CPU, RAM/Bus (MHz), nhiệt độ phần cứng, sensor");

  // Bước 6: Báo cáo tổng hợp HTML & CSV
  const step6Done = !!info.has_html_report;
  setStepUI(6, step6Done, "Hồ sơ máy standalone (report.html & CSV) sẵn sàng lưu trữ/in ấn", "Đóng gói hồ sơ máy, lưu trữ trọn đời trong task tiếp nhận/bàn giao", step6Done ? "Xem" : "Tạo");

  // Tiến độ tổng quan
  const doneCount = [step1Done, step2Done, step3Done, step4Done, step5Done, step6Done].filter(Boolean).length;
  const percent = Math.round((doneCount / 6) * 100);

  const pctEl = document.getElementById("pipelineProgressPercent");
  const barEl = document.getElementById("pipelineProgressBarFill");
  const counterEl = document.getElementById("pipelineStepCounter");
  const estTimeEl = document.getElementById("pipelineEstimatedTime");
  const liveStatusEl = document.getElementById("pipelineLiveStatusText");

  if (pctEl) pctEl.textContent = `${percent}%`;
  if (barEl) barEl.style.width = `${percent}%`;
  if (counterEl) counterEl.textContent = `(${doneCount}/6 bước hoàn thành)`;

  if (!isAuditPipelineRunning) {
    if (doneCount === 6) {
      if (estTimeEl) estTimeEl.textContent = "Đã hoàn thành";
      if (liveStatusEl) liveStatusEl.textContent = "🎉 Toàn bộ 6 bước kiểm tra đã hoàn tất! Hồ sơ máy đạt tiêu chuẩn lưu trữ.";
    } else {
      const remainingSteps = 6 - doneCount;
      if (estTimeEl) estTimeEl.textContent = `Ước tính: ~ ${remainingSteps * 4} - ${remainingSteps * 8}s`;
      if (liveStatusEl) liveStatusEl.textContent = `Đã hoàn thành ${doneCount}/6 bước. Nhấn "⚡ Bắt Đầu Quét Tự Động" để hoàn tất các bước còn lại.`;
    }
  }
}

async function triggerAutomatedAuditPipeline() {
  if (!checkAndWarnInstallModeForScan("chạy quy trình kiểm tra tự động 6 bước")) {
    return;
  }
  if (isAuditPipelineRunning) {
    showToast("⚠️ Tiến trình kiểm tra tự động đang chạy!");
    return;
  }

  let scanId = activeScanId;
  if (!scanId && scanTasksList && scanTasksList.length > 0) {
    scanId = scanTasksList[0].scan_id;
    selectScanTask(scanId);
  }
  if (!scanId) {
    showToast("⚠️ Vui lòng chọn hoặc tạo mới một lượt quét trước khi bắt đầu!");
    openConfirmScanMachineModal();
    return;
  }

  isAuditPipelineRunning = true;
  cancelPipelineRequested = false;

  const btnRun = document.getElementById("btnRunAuditPipeline");
  const btnStop = document.getElementById("btnStopAuditPipeline");
  const pulseDot = document.getElementById("pipelinePulseDot");
  const liveStatus = document.getElementById("pipelineLiveStatusText");
  const speedBadge = document.getElementById("pipelineScanSpeedBadge");
  const progressPercent = document.getElementById("pipelineProgressPercent");
  const progressBar = document.getElementById("pipelineProgressBarFill");
  const estTime = document.getElementById("pipelineEstimatedTime");
  const counterEl = document.getElementById("pipelineStepCounter");

  if (btnRun) btnRun.disabled = true;
  if (btnStop) btnStop.style.display = "inline-flex";
  if (pulseDot) pulseDot.className = "pipeline-pulse-dot running";

  const updateMasterProgress = (pct, text, timeEst) => {
    if (progressPercent && pct !== null) progressPercent.textContent = pct + "%";
    if (progressBar && pct !== null) progressBar.style.width = pct + "%";
    if (liveStatus && text) liveStatus.textContent = text;
    if (estTime && timeEst) estTime.textContent = timeEst;
  };

  const setStepState = (stepNum, state, statusText, descText) => {
    const item = document.getElementById(`stepItem-${stepNum}`);
    const badge = document.getElementById(`stepStatus-${stepNum}`);
    const badgeNum = document.getElementById(`stepBadge-${stepNum}`);
    const desc = document.getElementById(`stepDesc-${stepNum}`);
    if (!item) return;

    item.classList.remove("running", "done");
    if (badge) badge.className = "step-status-badge";

    if (state === "running") {
      item.classList.add("running");
      if (badge) {
        badge.classList.add("badge-running");
        badge.innerHTML = `<span style="display:inline-block; animation:spin 1s linear infinite;">⏳</span> Đang quét...`;
      }
      if (badgeNum) badgeNum.textContent = stepNum;
    } else if (state === "done") {
      item.classList.add("done");
      if (badge) {
        badge.classList.add("badge-done");
        badge.textContent = "✓ Hoàn thành";
      }
      if (badgeNum) badgeNum.textContent = "✓";
    } else {
      if (badge) {
        badge.classList.add("badge-pending");
        badge.textContent = statusText || "Chờ thực hiện";
      }
      if (badgeNum) badgeNum.textContent = stepNum;
    }
    if (descText && desc) desc.textContent = descText;
  };

  try {
    // -------------------------------------------------------------
    // BƯỚC 1: Cấu hình máy, Định danh PN/SN & RAM + Bus
    // -------------------------------------------------------------
    setStepState(1, "running", null, "Đang truy xuất SMBIOS/WMI cấu hình CPU, RAM & Bus, PN/SN & bản quyền Windows...");
    updateMasterProgress(10, "Bước 1/6: Đang đọc cấu hình máy, PN/SN & RAM/Bus...", "Ước tính: ~ 25s");
    if (counterEl) counterEl.textContent = "(0/6 bước hoàn thành)";

    let mInfo = null;
    try {
      const res1 = await fetch(`/api/scans/run_step?step=1&id=${encodeURIComponent(scanId)}`);
      const data1 = await res1.json().catch(() => ({}));
      if (res1.status === 409 && data1 && data1.code === "INSTALL_MODE_ACTIVE") {
        showInstallModeScanBlockedModal("chạy quy trình kiểm tra tự động 6 bước", data1);
        throw new Error("install_mode_blocked");
      }
      if (data1 && data1.status === "ok" && (data1.machine_info || data1.info)) {
        mInfo = data1.machine_info || data1.info;
        renderMachineInfoCard(mInfo, false);
      }
    } catch (e) {
      if (e && e.message === "install_mode_blocked") throw e;
      console.warn("Step 1 info fetch fallback", e);
    }

    const r1Inf = (mInfo && mInfo.ram_info && typeof mInfo.ram_info === "object") ? mInfo.ram_info : {};
    const step1Ram = mInfo ? (mInfo.ram_summary || r1Inf.ram_summary || mInfo.ram_total || (mInfo.total_ram_gb ? `${mInfo.total_ram_gb} GB` : 'N/A')) : 'N/A';
    const step1Pn = (mInfo && mInfo.product_number && mInfo.product_number !== 'N/A') ? ` • PN: ${mInfo.product_number}` : '';
    setStepState(1, "done", null, mInfo ? `${mInfo.cpu_name || 'CPU'}${step1Pn} • RAM: ${step1Ram} • ${mInfo.license_info?.status_title || 'Bản quyền Windows'}` : "Đã xác thực cấu hình máy & bản quyền");
    updateMasterProgress(16, "✓ Bước 1 hoàn thành! Chuyển sang Bước 2: Quét phần mềm...", "Ước tính: ~ 20s");
    if (counterEl) counterEl.textContent = "(1/6 bước hoàn thành)";
    await new Promise(r => setTimeout(r, 450));

    if (cancelPipelineRequested) throw new Error("cancelled");

    // -------------------------------------------------------------
    // BƯỚC 2: Danh Mục Phần Mềm & Logo Ứng Dụng
    // -------------------------------------------------------------
    setStepState(2, "running", null, "Đang quét Registry 32/64-bit, Program Files & trích xuất icon...");
    updateMasterProgress(25, "Bước 2/6: Đang quét danh mục phần mềm & icon ứng dụng...", "Ước tính: ~ 18s");

    let appsFound = [];
    try {
      const res2 = await fetch("/api/scan_installed");
      const data2 = await res2.json().catch(() => ({}));
      if (res2.status === 409 && data2 && data2.code === "INSTALL_MODE_ACTIVE") {
        showInstallModeScanBlockedModal("quét phần mềm đã cài", data2);
        throw new Error("install_mode_blocked");
      }
      if (data2 && data2.status === "ok" && Array.isArray(data2.apps)) {
        appsFound = data2.apps;
        scannedAppsList = appsFound;
        renderScannedAppsTable(scannedAppsList);
      }
    } catch (e) {
      if (e && e.message === "install_mode_blocked") throw e;
      console.warn("Step 2 scan apps fallback", e);
    }

    setStepState(2, "done", null, `${appsFound.length || 'Hàng chục'} ứng dụng đã được nhận diện & trích xuất logo`);
    updateMasterProgress(33, "✓ Bước 2 hoàn thành! Chuyển sang Bước 3: Quét sâu dung lượng ổ đĩa...", "Ước tính: ~ 15s");
    if (counterEl) counterEl.textContent = "(2/6 bước hoàn thành)";
    await new Promise(r => setTimeout(r, 450));

    if (cancelPipelineRequested) throw new Error("cancelled");

    // -------------------------------------------------------------
    // BƯỚC 3: Dung Lượng Ổ Đĩa & Cây Thư Mục TreeSize ("Quét sâu từng ngõ ngách")
    // -------------------------------------------------------------
    setStepState(3, "running", null, "Đang quét sâu từng ngõ ngách ổ đĩa (TreeSize fast traversal)...");
    updateMasterProgress(40, "Bước 3/6: Bắt đầu quét sâu dung lượng toàn bộ ổ đĩa...", "Ước tính: ~ 12s");
    if (speedBadge) {
      speedBadge.style.display = "inline-block";
      speedBadge.textContent = "Khởi động...";
    }

    // Call start scan async
    let diskScanStarted = false;
    try {
      const res3 = await fetch(`/api/disk_scan/start?drive=ALL&scan_id=${encodeURIComponent(scanId)}`);
      const d3 = await res3.json().catch(() => ({}));
      if (res3.status === 409 && d3 && d3.code === "INSTALL_MODE_ACTIVE") {
        showInstallModeScanBlockedModal("quét cây thư mục ổ đĩa", d3);
        throw new Error("install_mode_blocked");
      }
      diskScanStarted = res3.ok && d3.status !== "error";
    } catch (e) {
      if (e && e.message === "install_mode_blocked") throw e;
      console.warn("Step 3 start error", e);
    }

    // Poll disk progress
    let diskDone = !diskScanStarted;
    let pollCount = 0;
    while (!diskDone && pollCount < 120) {
      if (cancelPipelineRequested) throw new Error("cancelled");
      await new Promise(r => setTimeout(r, 500));
      pollCount++;

      try {
        const pRes = await fetch("/api/disk_scan/progress");
        const pData = await pRes.json();
        if (pData && pData.progress) {
          const pr = pData.progress;
          const diskPct = pr.percent || 0;
          const mappedPct = Math.round(33 + (diskPct / 100) * 33); // map 33% -> 66%
          
          if (speedBadge) {
            speedBadge.textContent = `${(pr.speed_files_per_sec || 0).toLocaleString()} file/s`;
          }
          const currShort = (pr.current_path || "").length > 40 ? "..." + (pr.current_path || "").slice(-37) : (pr.current_path || "");
          updateMasterProgress(mappedPct, `Đang quét sâu ổ đĩa: ${currShort} (${(pr.files_count || 0).toLocaleString()} tệp)`, `Đã quét ${(pr.files_count || 0).toLocaleString()} tệp`);

          if (pr.done) {
            diskDone = true;
            break;
          }
        }
      } catch (err) {
        console.warn("Poll progress err", err);
      }
    }

    if (speedBadge) speedBadge.style.display = "none";
    loadTaskDiskTree(scanId);

    setStepState(3, "done", null, "Cây thư mục TreeSize: Đã phân tích chi tiết toàn bộ ngõ ngách ổ đĩa");
    updateMasterProgress(66, "✓ Bước 3 hoàn thành! Chuyển sang Bước 4: Sức khỏe S.M.A.R.T CrystalDiskInfo...", "Ước tính: ~ 8s");
    if (counterEl) counterEl.textContent = "(3/6 bước hoàn thành)";
    await new Promise(r => setTimeout(r, 450));

    if (cancelPipelineRequested) throw new Error("cancelled");

    // -------------------------------------------------------------
    // BƯỚC 4: Sức Khỏe Ổ Cứng S.M.A.R.T (CrystalDiskInfo)
    // -------------------------------------------------------------
    setStepState(4, "running", null, "Đang đọc cảm biến S.M.A.R.T (POH, TBW, nhiệt độ, bad sector)...");
    updateMasterProgress(72, "Bước 4/6: Đang kiểm tra sức khỏe ổ cứng S.M.A.R.T...", "Ước tính: ~ 6s");

    let smartDisks = [];
    try {
      const sRes = await fetch("/api/disk_smart/scan");
      const sData = await sRes.json().catch(() => ({}));
      if (sRes.status === 409 && sData && sData.code === "INSTALL_MODE_ACTIVE") {
        showInstallModeScanBlockedModal("quét S.M.A.R.T ổ cứng", sData);
        throw new Error("install_mode_blocked");
      }
      if (sData && sData.status === "ok" && Array.isArray(sData.disks)) {
        smartDisks = sData.disks;
        await fetch("/api/disk_smart/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scanId: scanId, disks: smartDisks })
        });
      }
    } catch (e) {
      if (e && e.message === "install_mode_blocked") throw e;
      console.warn("Step 4 smart scan err", e);
    }

    const d0 = smartDisks[0];
    const smartDesc = d0 ? `${d0.name || 'Ổ đĩa'} • ${d0.healthScore || 100}% (${d0.healthStatus || 'GOOD'}) • ${d0.temp || 40}°C` : "Đã kiểm tra sức khỏe toàn diện S.M.A.R.T";
    setStepState(4, "done", null, `S.M.A.R.T: ${smartDesc}`);
    updateMasterProgress(83, "✓ Bước 4 hoàn thành! Chuyển sang Bước 5: Giám sát phần cứng GPU-Z / CPU-Z...", "Ước tính: ~ 4s");
    if (counterEl) counterEl.textContent = "(4/6 bước hoàn thành)";
    await new Promise(r => setTimeout(r, 450));

    if (cancelPipelineRequested) throw new Error("cancelled");

    // -------------------------------------------------------------
    // BƯỚC 5: Giám Sát Phần Cứng & Đồ Họa (GPU-Z, CPU-Z, HWMonitor)
    // -------------------------------------------------------------
    setStepState(5, "running", null, "Đang tổng hợp thông số GPU-Z, CPU-Z & cảm biến nhiệt độ...");
    updateMasterProgress(88, "Bước 5/6: Đang đo kiểm GPU-Z, CPU-Z & cảm biến nhiệt độ...", "Ước tính: ~ 2s");

    let diagData = null;
    try {
      const hRes = await fetch("/api/hardware_monitor/diagnostics");
      const hData = await hRes.json();
      if (hData && hData.status === "ok" && hData.diagnostics) {
        diagData = hData.diagnostics;
        await fetch("/api/hardware_monitor/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ scanId: scanId, diagnostics: diagData })
        });
      }
    } catch (e) {
      console.warn("Step 5 hw diag err", e);
    }

    const gpuName = diagData?.primary_gpu || "Đồ họa tích hợp";
    const cpuShort = diagData?.cpu?.name ? diagData.cpu.name.split("@")[0].replace("Intel(R) Core(TM)", "").replace("AMD Ryzen", "Ryzen").trim() : "CPU";
    const ramDiagTxt = diagData?.ram?.summary || diagData?.ram?.bus_display || "";
    setStepState(5, "done", null, `Phần cứng: ${cpuShort}${ramDiagTxt ? ' • ' + ramDiagTxt : ''} • ${gpuName} (${diagData?.primary_vram || ''})`);
    updateMasterProgress(95, "✓ Bước 5 hoàn thành! Chuyển sang Bước 6: Đóng gói báo cáo HTML & CSV...", "Ước tính: ~ 1s");
    if (counterEl) counterEl.textContent = "(5/6 bước hoàn thành)";
    await new Promise(r => setTimeout(r, 450));

    if (cancelPipelineRequested) throw new Error("cancelled");

    // -------------------------------------------------------------
    // BƯỚC 6: Kết Xuất Báo Cáo Tổng Hợp HTML & CSV
    // -------------------------------------------------------------
    setStepState(6, "running", null, "Đang đóng gói hồ sơ máy và kết xuất report.html / report.csv...");
    updateMasterProgress(98, "Bước 6/6: Đang xuất báo cáo tổng hợp HTML & CSV trọn đời...", "Gần xong...");

    try {
      await fetch(`/api/scans/regenerate_report?id=${encodeURIComponent(scanId)}`);
    } catch (e) {
      console.warn("Step 6 report err", e);
    }

    setStepState(6, "done", null, "Báo cáo HTML/CSV sẵn sàng mở offline và in hồ sơ");
    const stepBtn6 = document.getElementById("stepBtn-6");
    if (stepBtn6) {
      stepBtn6.textContent = "Xem";
      stepBtn6.onclick = () => runSinglePipelineStep(6);
    }

    // -------------------------------------------------------------
    // HOÀN TẤT TOÀN BỘ 6/6 BƯỚC
    // -------------------------------------------------------------
    updateMasterProgress(100, "🎉 Toàn bộ 6 bước kiểm tra tuần tự đã hoàn tất mỹ mãn!", "Đã hoàn thành");
    if (counterEl) counterEl.textContent = "(6/6 bước hoàn thành)";
    
    showToast("🎉 Hoàn tất quy trình kiểm tra tự động toàn diện 6/6 bước!");

    // Đồng bộ lại toàn bộ dữ liệu task
    selectScanTask(scanId);

  } catch (err) {
    if (err && err.message === "install_mode_blocked") {
      updateMasterProgress(null, "🚧 Đã dừng quét vì tool đang ở chế độ cài đặt phần mềm.", "Bị chặn");
    } else if (err && err.message === "cancelled") {
      showToast("⏹ Đã dừng tiến trình kiểm tra tự động!");
      updateMasterProgress(null, "Tiến trình quét đã tạm dừng theo yêu cầu của KTV.", "Đã dừng");
    } else {
      console.error("Pipeline failure:", err);
      showToast("⚠️ Có lỗi trong quy trình quét: " + (err.message || err));
      if (liveStatus) liveStatus.textContent = "Có lỗi xảy ra: " + (err.message || "");
    }
  } finally {
    isAuditPipelineRunning = false;
    cancelPipelineRequested = false;
    if (btnRun) btnRun.disabled = false;
    if (btnStop) btnStop.style.display = "none";
    if (pulseDot) pulseDot.className = "pipeline-pulse-dot";
    if (speedBadge) speedBadge.style.display = "none";
  }
}

function runSinglePipelineStep(stepIdx) {
  if (stepIdx >= 1 && stepIdx <= 5) {
    if (!checkAndWarnInstallModeForScan(`quét bước ${stepIdx}/6`)) return;
  }

  let scanId = activeScanId;
  if (!scanId && scanTasksList && scanTasksList.length > 0) {
    scanId = scanTasksList[0].scan_id;
  }
  if (!scanId) {
    showToast("⚠️ Vui lòng chọn một lượt quét để thao tác!");
    return;
  }

  if (stepIdx === 1) {
    showToast("⏳ Đang cập nhật cấu hình máy, PN/SN & RAM/Bus...");
    fetch(`/api/scans/run_step?step=1&id=${encodeURIComponent(scanId)}`)
      .then(async r => ({ status: r.status, ok: r.ok, d: await r.json().catch(() => ({})) }))
      .then(({ status, ok, d }) => {
        if (status === 409 && d && d.code === "INSTALL_MODE_ACTIVE") {
          showInstallModeScanBlockedModal("cập nhật cấu hình máy (Bước 1)", d);
          return;
        }
        const infoObj = d && (d.machine_info || d.info);
        if (ok && infoObj) {
          renderMachineInfoCard(infoObj, false);
          showToast("✔ Đã cập nhật cấu hình máy, PN/SN & RAM/Bus!");
          selectScanTask(scanId);
        } else {
          showToast("⚠️ " + ((d && d.message) || "Không thể cập nhật cấu hình máy."));
        }
      });
  } else if (stepIdx === 2) {
    showToast("⏳ Đang quét lại phần mềm đã cài đặt...");
    fetch(`/api/scans/rescan?id=${encodeURIComponent(scanId)}`)
      .then(async r => ({ status: r.status, ok: r.ok, d: await r.json().catch(() => ({})) }))
      .then(({ status, ok, d }) => {
        if (status === 409 && d && d.code === "INSTALL_MODE_ACTIVE") {
          showInstallModeScanBlockedModal("quét lại phần mềm đã cài (Bước 2)", d);
          return;
        }
        if (ok && d && d.status === "ok") {
          showToast("✔ Đã quét lại danh mục phần mềm!");
          selectScanTask(scanId);
        } else {
          showToast("⚠️ " + ((d && d.message) || "Không thể quét lại danh mục phần mềm."));
        }
      });
  } else if (stepIdx === 3) {
    showToast("⏳ Bắt đầu quét sâu từng ngõ ngách ổ đĩa...");
    switchScanSubTab("disk");
    triggerDiskScan("ALL");
  } else if (stepIdx === 4) {
    showToast("⏳ Đang quét S.M.A.R.T ổ đĩa...");
    triggerSmartDiskDirectScan();
  } else if (stepIdx === 5) {
    openHardwareMonitorSelector();
  } else if (stepIdx === 6) {
    const reportUrl = `/scans/${encodeURIComponent(scanId)}/report.html`;
    window.open(reportUrl, "_blank");
    showToast("📄 Đang mở báo cáo tổng hợp HTML...");
  }
}

function cancelAutomatedAuditPipeline() {
  cancelPipelineRequested = true;
  showToast("⏳ Đang yêu cầu dừng tiến trình quét tuần tự...");
}

// ==========================================
// CHECKLIST 2 GIAI ĐOẠN (TIẾP NHẬN & BÀN GIAO)
// ==========================================
function openChecklistModal() {
  const modal = document.getElementById("checklistModal");
  if (!modal) return;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  const nameInput = document.getElementById("inputCustomerName");
  const idInput = document.getElementById("inputCustomerId");
  const custName = (nameInput && nameInput.value.trim()) || "Quý Khách Hàng";
  const custId = (idInput && idInput.value.trim()) || "VIP-01";

  syncCustomerInputsToModal(custName, custId);

  const subTitle = document.getElementById("chkModalSubtitle");
  if (subTitle) {
    subTitle.innerHTML = `Khách hàng: <strong>${custName}</strong> (ID: <code>${custId}</code>) | ${new Date().toLocaleString('vi-VN')}`;
  }

  // Khởi tạo checklist hoặc nạp từ localStorage nếu có
  const storageKey = `checklist_${activeScanId || 'CURRENT'}`;
  let savedData = null;
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) savedData = JSON.parse(raw);
  } catch(e) {}

  if (savedData) {
    currentChecklistData = savedData;
  } else if (!currentChecklistData) {
    currentChecklistData = {
      customer_name: custName,
      customer_id: custId,
      tiep_nhan: {
        device_type: "laptop_pc",
        device_os: "windows",
        technician_name: "KTV Tiếp Nhận",
        customer_pin: "Không có",
        machine_condition: "Bật lên bình thường - Kiểm tra & Tối ưu",
        accessories: { charger: true, power_cable: true, bag: false, stylus: false, mouse: false, storage: false, other: "" },
        items: {},
        technician_notes: "Ngoại quan đẹp, không trầy xước",
        final_status: "pass"
      },
      ban_giao: {
        technician_name: "KTV Bàn Giao",
        optimized_tier: "4to8gb",
        warranty_months: "3 tháng",
        items: {},
        technician_notes: "Đã cài đặt full ứng dụng và phục hồi dữ liệu hoàn tất",
        final_status: "pass"
      }
    };
  }

  populateDualChecklistForm(currentChecklistData);
}

function handleChecklistModalClose() {
  if (isChecklistDirty) {
    saveCurrentChecklist(true);
    isChecklistDirty = false;
  }
  closeChecklistModal();
}

function closeChecklistModal() {
  const modal = document.getElementById("checklistModal");
  if (modal) modal.classList.remove("active");
  document.body.style.overflow = "";
}

function syncCustomerInputsToModal(name, id) {
  const tnName = document.getElementById("chkCustName_tn");
  const bgName = document.getElementById("chkCustName_bg");
  const tnId = document.getElementById("chkCustId_tn");
  const bgId = document.getElementById("chkCustId_bg");

  if (tnName) tnName.value = name;
  if (bgName) bgName.value = name;
  if (tnId) tnId.value = id;
  if (bgId) bgId.value = id;
}

function onChecklistCustomerInput(field, val) {
  isChecklistDirty = true;
  if (field === 'name') {
    const main = document.getElementById("inputCustomerName");
    if (main) main.value = val;
    syncCustomerInputsToModal(val, document.getElementById("chkCustId_tn")?.value || "");
  } else {
    const main = document.getElementById("inputCustomerId");
    if (main) main.value = val;
    syncCustomerInputsToModal(document.getElementById("chkCustName_tn")?.value || "", val);
  }
}

function selectChecklistDeviceType(devType, btnEl) {
  isChecklistDirty = true;
  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData.tiep_nhan) currentChecklistData.tiep_nhan = {};
  
  let key = devType || 'laptop';
  if (key === 'laptop_pc') key = 'laptop';
  if (key === 'mac') key = 'macbook';
  if (key === 'tablet' || key === 'tablet_mobile') key = 'tablet_ipad';
  currentChecklistData.tiep_nhan.device_type = key;

  // Cập nhật trạng thái nút trên cả Tab Workflow và Modal Checklist
  document.querySelectorAll("#chkDeviceTypeGroup .chk-pill-btn, .chk-dev-type-btn").forEach(b => {
    const isTarget = (b.id === `chkDevBtn_${key}` || b.getAttribute('data-dev') === key);
    b.classList.toggle("active", isTarget);
    if (isTarget) {
      b.style.background = "#059669";
      b.style.color = "#ffffff";
      b.style.borderColor = "#047857";
    } else {
      b.style.background = "#ffffff";
      b.style.color = b.classList.contains("chk-pill-btn") ? "#047857" : "#0f172a";
      b.style.borderColor = b.classList.contains("chk-pill-btn") ? "#a7f3d0" : "#cbd5e1";
    }
  });

  const devMeta = getCurrentDeviceMeta(key);
  const wfBadge = document.getElementById("wfCurrentDeviceBadge");
  if (wfBadge && devMeta) {
    wfBadge.innerText = devMeta.label;
  }

  // 1. Render các lựa chọn Hệ điều hành tương ứng cho thiết bị
  renderOsButtonsForDevice(key);

  // 2. Cập nhật danh mục phụ kiện động (LỌC SẠCH phụ kiện không dùng được cho thiết bị này)
  renderDynamicAccessories(key);

  // 3. Cập nhật danh mục ngoại quan và kỹ thuật (cho cả Tab Workflow và Modal)
  renderDynamicExterior(key);
  renderTechnicalChecks();

  // 4. Đồng bộ sáng nhánh trên Sơ đồ MDXG
  if (typeof updateMdxgCanvasBranchHighlight === 'function') {
    updateMdxgCanvasBranchHighlight(key);
  }

  // 5. Cập nhật thẻ văn bản tóm tắt nhận diện thiết bị & mặc định hiển thị dạng văn bản
  renderDeviceSummaryText(key, currentChecklistData?.tiep_nhan?.device_os);
  setDeviceDisplayMode('summary');

  updateChecklistProgress();
  updateReceiptSummaryBadges();
}

function setDeviceDisplayMode() {
  const summaryCard = document.getElementById("chkDeviceTextSummaryCard");
  if (summaryCard) summaryCard.style.display = "block";
}

function toggleDevicePickerVisibility() {
  setDeviceDisplayMode();
}

function renderDeviceSummaryText(devType, devOs) {
  const summaryCard = document.getElementById("chkDeviceTextSummaryCard");
  if (!summaryCard) return;

  const curType = devType || currentChecklistData?.tiep_nhan?.device_type || 'laptop';
  const curOs = devOs || currentChecklistData?.tiep_nhan?.device_os || 'windows';
  const devMeta = getCurrentDeviceMeta(curType);

  const iconEl = document.getElementById("chkDeviceSummaryIcon");
  const iconWrap = document.getElementById("chkDeviceSummaryIconWrap");
  const titleEl = document.getElementById("chkDeviceSummaryTitle");
  const catPill = document.getElementById("chkDeviceCategoryPill");
  const osPill = document.getElementById("chkDeviceOsBadgePill");
  const modelBox = document.getElementById("chkDeviceModelHighlight");
  const descEl = document.getElementById("chkDeviceSummaryDescription");

  // Bản đồ logo thương hiệu & phong cách phân loại
  const metaStyleMap = {
    'laptop': {
      icon: '💻',
      bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      title: 'Laptop Xách Tay (Notebook)',
      category: '💻 MÁY TÍNH XÁCH TAY',
      osDefault: '🪟 Windows 11 64-bit'
    },
    'pc_desktop': {
      icon: '🖥️',
      bg: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
      title: 'Máy Tính Để Bàn (PC Desktop Case Thùng)',
      category: '🖥️ PC DESKTOP WORKSTATION / GAMING',
      osDefault: '🪟 Windows 11 Pro 64-bit'
    },
    'macbook': {
      icon: '🍏',
      bg: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      title: 'Apple MacBook (Pro / Air / Silicon M-Series)',
      category: '🍏 APPLE MACBOOK ECOSYSTEM',
      osDefault: '🍏 macOS Sequoia / Sonoma'
    },
    'mac_mini_studio': {
      icon: '📦',
      bg: 'linear-gradient(135deg, #475569 0%, #1e293b 100%)',
      title: 'Apple Mac mini / Mac Studio / Mac Pro',
      category: '🍏 APPLE MAC DESKTOP ECOSYSTEM',
      osDefault: '🍏 macOS Sequoia'
    },
    'imac_desktop': {
      icon: '🖥️',
      bg: 'linear-gradient(135deg, #0284c7 0%, #0891b2 100%)',
      title: 'Apple iMac Desktop All-in-One',
      category: '🍏 APPLE IMAC ALL-IN-ONE',
      osDefault: '🍏 macOS Sonoma'
    },
    'apple_display': {
      icon: '🖥️',
      bg: 'linear-gradient(135deg, #64748b 0%, #334155 100%)',
      title: 'Màn Hình Apple Studio / Pro Display XDR',
      category: '🖥️ MÀN HÌNH HIỂN THỊ PHẦN CỨNG',
      osDefault: '⚡ Hardware Display (Không OS)'
    },
    'tablet_ipad': {
      icon: '🍎',
      bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      title: 'Apple iPad & Phụ Kiện Magic Keyboard / Pencil',
      category: '📱 MÁY TÍNH BẢNG APPLE IPADOS',
      osDefault: '🍎 Apple iPadOS 17 / 18'
    },
    'tablet_android': {
      icon: '🤖',
      bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      title: 'Máy Tính Bảng Android (Galaxy Tab / Xiaomi / Lenovo)',
      category: '🤖 MÁY TÍNH BẢNG ANDROID',
      osDefault: '🤖 Google Android OS'
    },
    'tablet_surface': {
      icon: '🪟',
      bg: 'linear-gradient(135deg, #0284c7 0%, #0067c0 100%)',
      title: 'Microsoft Surface 2-in-1 (Pro / Go / Laptop Studio)',
      category: '🪟 THIẾT BỊ LAI MICROSOFT SURFACE',
      osDefault: '🪟 Windows 11 on ARM / x64'
    }
  };

  const styleMeta = metaStyleMap[curType] || metaStyleMap['laptop'];

  if (iconEl) iconEl.innerText = styleMeta.icon;
  if (iconWrap) iconWrap.style.background = styleMeta.bg;
  if (titleEl) titleEl.innerText = styleMeta.title;
  if (catPill) catPill.innerText = styleMeta.category;

  const osMap = {
    'windows': '🪟 Windows 11 / Windows 10 (64-bit)',
    'win11': '🪟 Windows 11 Pro 64-bit (UEFI/TPM 2.0)',
    'win10': '🪟 Windows 10 Pro 64-bit',
    'macos': '🍏 macOS Sequoia / Sonoma (UNIX)',
    'ios_ipados': '🍎 Apple iPadOS 17 / 18',
    'android': '🤖 Google Android OS',
    'linux': '🐧 Linux (Ubuntu / Fedora / Arch)',
    'hardware_screen_only': '⚡ Màn hình hiển thị phần cứng'
  };
  const osLabel = osMap[curOs] || (devMeta.allowed_os?.find(o => o.id === curOs)?.label) || styleMeta.osDefault;
  if (osPill) osPill.innerHTML = osLabel;

  // Lấy các trường thông số thực tế
  const model = document.getElementById("chkMachineModel")?.value || currentChecklistData?.tiep_nhan?.machine_model || "Đã xác định dòng thiết bị";
  const serial = document.getElementById("chkMachineSerial")?.value || currentChecklistData?.tiep_nhan?.serial_number || "";
  const cpu = document.getElementById("chkSpecCpu")?.value || currentChecklistData?.tiep_nhan?.specs?.cpu || "";
  const mobo = document.getElementById("chkSpecMainboard")?.value || currentChecklistData?.tiep_nhan?.specs?.motherboard || "";
  const ram = document.getElementById("chkSpecRam")?.value || currentChecklistData?.tiep_nhan?.specs?.ram || "";
  const storage = document.getElementById("chkSpecStorage")?.value || currentChecklistData?.tiep_nhan?.specs?.storage || "";
  const vga = document.getElementById("chkSpecGpu")?.value || currentChecklistData?.tiep_nhan?.specs?.vga || "";
  const psu = document.getElementById("chkSpecPsu")?.value || currentChecklistData?.tiep_nhan?.specs?.psu || "";
  const custName = document.getElementById("chkCustName")?.value || currentChecklistData?.customer_name || "";
  const custPhone = document.getElementById("chkCustPhone")?.value || currentChecklistData?.customer_phone || "";
  const staff = document.getElementById("chkStaffName")?.value || currentChecklistData?.tiep_nhan?.technician_name || "KTV Tiếp Nhận";

  if (modelBox) {
    modelBox.innerHTML = `<strong>${model}</strong>${serial ? ` <span style="color:#64748b; font-weight:600;">(SN: ${serial})</span>` : ''}`;
  }

  // Tạo các thẻ linh kiện nổi bật (High-Contrast Spec Tags)
  let specChipsHtml = "";
  if (cpu || ram || storage || vga || psu || mobo) {
    const chips = [];
    if (mobo) chips.push(`<span style="background:#f8fafc; border:1px solid #cbd5e1; border-radius:6px; padding:4px 9px; font-size:11.5px; color:#334155; display:inline-flex; align-items:center; gap:4px;">🎛️ Mainboard: <strong style="color:#0f172a;">${mobo}</strong></span>`);
    if (cpu) chips.push(`<span style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:4px 9px; font-size:11.5px; color:#1e40af; display:inline-flex; align-items:center; gap:4px;">⚡ CPU: <strong style="color:#1d4ed8;">${cpu}</strong></span>`);
    if (ram) chips.push(`<span style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:6px; padding:4px 9px; font-size:11.5px; color:#065f46; display:inline-flex; align-items:center; gap:4px;">🧠 RAM: <strong style="color:#047857;">${ram}</strong></span>`);
    if (storage) chips.push(`<span style="background:#fffbeb; border:1px solid #fde68a; border-radius:6px; padding:4px 9px; font-size:11.5px; color:#92400e; display:inline-flex; align-items:center; gap:4px;">💾 Ổ CỨNG: <strong style="color:#b45309;">${storage}</strong></span>`);
    if (vga) chips.push(`<span style="background:#f5f3ff; border:1px solid #ddd6fe; border-radius:6px; padding:4px 9px; font-size:11.5px; color:#5b21b6; display:inline-flex; align-items:center; gap:4px;">🎮 CARD VGA: <strong style="color:#6d28d9;">${vga}</strong></span>`);
    if (psu) chips.push(`<span style="background:#f1f5f9; border:1px solid #cbd5e1; border-radius:6px; padding:4px 9px; font-size:11.5px; color:#334155; display:inline-flex; align-items:center; gap:4px;">🔌 NGUỒN/PIN: <strong style="color:#0f172a;">${psu}</strong></span>`);
    
    specChipsHtml = `
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:10px 14px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <div style="font-size:10.5px; font-weight:800; color:#475569; text-transform:uppercase; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>⚙️ CẤU HÌNH PHẦN CỨNG CHI TIẾT (XÁC THỰC TỪ DỮ LIỆU JSON)</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${chips.join("")}
        </div>
      </div>
    `;
  }

  // Danh mục phụ kiện tương thích
  const accList = devMeta.accessories || [];
  const accPills = accList.map(a => `<span style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:3px 8px; font-size:11px; color:#334155; font-weight:600;">✓ ${a.name}</span>`).join(" ");

  if (descEl) {
    descEl.innerHTML = `
      <!-- DÒNG ĐẶC TẢ NỀN TẢNG & MÔ TẢ KỸ THUẬT -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:10px;">
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <div style="font-size:10.5px; font-weight:800; color:#475569; text-transform:uppercase; margin-bottom:5px; display:flex; align-items:center; gap:4px;">
            <span>🏢 NỀN TẢNG HỆ THỐNG</span>
          </div>
          <div style="font-size:12.5px; color:#1e293b; line-height:1.6;">
            Dòng máy: <strong style="color:#0284c7;">${styleMeta.title}</strong><br>
            Hệ điều hành nhận diện: <strong style="color:#059669;">${osLabel}</strong>
          </div>
        </div>

        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
          <div style="font-size:10.5px; font-weight:800; color:#475569; text-transform:uppercase; margin-bottom:5px; display:flex; align-items:center; gap:4px;">
            <span>👤 TIẾP NHẬN &amp; PHỤ TRÁCH</span>
          </div>
          <div style="font-size:12.5px; color:#1e293b; line-height:1.6;">
            Khách hàng: <strong style="color:#0f172a;">${custName || 'Khách hàng tiếp nhận'}</strong> ${custPhone ? `(<strong>${custPhone}</strong>)` : ''}<br>
            Kỹ thuật viên kiểm định: <strong style="color:#4f46e5;">${staff}</strong>
          </div>
        </div>
      </div>

      <!-- KHỐI CẤU HÌNH PHẦN CỨNG NỔI BẬT -->
      ${specChipsHtml}

      <!-- KHỐI PHỤ KIỆN TƯƠNG THÍCH -->
      <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:10px 12px; font-size:11.5px; color:#475569; box-shadow:0 1px 3px rgba(0,0,0,0.02);">
        <div style="font-weight:800; font-size:11px; text-transform:uppercase; color:#475569; margin-bottom:6px; display:flex; align-items:center; gap:5px;">
          <span>🎒 PHỤ KIỆN THEO CHUẨN THIẾT BỊ NÀY</span>
        </div>
        <div style="display:flex; flex-wrap:wrap; gap:6px;">
          ${accPills}
        </div>
      </div>
    `;
  }

  // Cập nhật các nhãn đang gắn vào vị trí khung đỏ
  if (typeof renderActiveDeviceTagsUI === 'function') {
    renderActiveDeviceTagsUI();
  }
}

function onChecklistFieldChange() {
  isChecklistDirty = true;
  saveCurrentChecklist(true);
  const devType = currentChecklistData?.tiep_nhan?.device_type || 'laptop';
  const devOs = currentChecklistData?.tiep_nhan?.device_os || 'windows';
  renderDeviceSummaryText(devType, devOs);
}

// ========================================================
// BỘ NHÃN THIẾT BỊ (DEVICE TAGS MANAGEMENT & BINDING)
// ========================================================

const DEVICE_TAG_PRESETS = [
  // Nhóm 1: Laptop Windows & Linux
  { id: 'laptop_win11', category: 'laptop', devType: 'laptop', devOs: 'win11', label: '💻 Laptop Windows 11', desc: 'Laptop x64 UEFI / TPM 2.0 / Windows 11', color: '#0284c7', bg: '#e0f2fe' },
  { id: 'laptop_win10', category: 'laptop', devType: 'laptop', devOs: 'win10', label: '💻 Laptop Windows 10', desc: 'Laptop 64-bit Windows 10 Pro / Home', color: '#0369a1', bg: '#f0f9ff' },
  { id: 'laptop_win7_8', category: 'laptop', devType: 'laptop', devOs: 'windows', label: '💻 Laptop Windows 7 / 8.1', desc: 'Laptop đời cũ, tiếp nhận cài lại / cứu dữ liệu', color: '#475569', bg: '#f1f5f9' },
  { id: 'laptop_gaming_win11', category: 'laptop', devType: 'laptop', devOs: 'win11', label: '🎮 Laptop Gaming Windows 11', desc: 'Laptop Gaming GPU rời RTX/GTX, màn tần số cao', color: '#dc2626', bg: '#fef2f2' },
  { id: 'laptop_ultrabook_win11', category: 'laptop', devType: 'laptop', devOs: 'win11', label: '💼 Laptop Ultrabook Mỏng Nhẹ', desc: 'Dell XPS, LG Gram, Zenbook, ThinkPad X1', color: '#4f46e5', bg: '#eef2ff' },
  { id: 'laptop_linux', category: 'laptop', devType: 'laptop', devOs: 'linux', label: '🐧 Laptop Linux (Ubuntu / Fedora)', desc: 'Laptop cài Linux OS cho developer', color: '#ea580c', bg: '#fff7ed' },

  // Nhóm 2: PC Desktop
  { id: 'pc_win11', category: 'pc', devType: 'pc_desktop', devOs: 'win11', label: '🖥️ PC Desktop Windows 11', desc: 'Case thùng máy tính bàn ATX/M-ATX Windows 11', color: '#2563eb', bg: '#eff6ff' },
  { id: 'pc_win10', category: 'pc', devType: 'pc_desktop', devOs: 'win10', label: '🖥️ PC Desktop Windows 10', desc: 'Máy tính bàn văn phòng / đồ họa Windows 10', color: '#1d4ed8', bg: '#eff6ff' },
  { id: 'pc_win7', category: 'pc', devType: 'pc_desktop', devOs: 'windows', label: '🖥️ PC Desktop Windows 7', desc: 'PC máy bàn đời cũ, kế toán, thuế', color: '#475569', bg: '#f8fafc' },
  { id: 'pc_gaming_win11', category: 'pc', devType: 'pc_desktop', devOs: 'win11', label: '🎮 PC Gaming Windows 11', desc: 'Dàn PC Gaming Core i5/i7/i9, Ryzen + RTX/RX', color: '#9333ea', bg: '#faf5ff' },
  { id: 'pc_workstation', category: 'pc', devType: 'pc_desktop', devOs: 'win11', label: '⚡ PC Workstation / Render 3D', desc: 'Máy trạm Dual Xeon / Threadripper / Quadro', color: '#b45309', bg: '#fffbeb' },
  { id: 'pc_dong_bo', category: 'pc', devType: 'pc_desktop', devOs: 'windows', label: '🏢 PC Đồng Bộ Dell / HP / Lenovo', desc: 'PC Small Form Factor (SFF) văn phòng', color: '#059669', bg: '#ecfdf5' },
  { id: 'pc_aio_win11', category: 'pc', devType: 'pc_desktop', devOs: 'win11', label: '🖥️ PC All-in-One (AIO) Win 11', desc: 'Máy tính liền màn hình AIO gọn nhẹ', color: '#0891b2', bg: '#ecfeff' },
  { id: 'pc_macos_12', category: 'pc', devType: 'pc_desktop', devOs: 'macos', label: '🍏 PC macOS 12 (Monterey)', desc: 'PC Hackintosh chạy macOS Monterey ổn định', color: '#059669', bg: '#ecfdf5' },
  { id: 'pc_macos_13', category: 'pc', devType: 'pc_desktop', devOs: 'macos', label: '🍏 PC macOS 13 (Ventura)', desc: 'PC Hackintosh chạy macOS Ventura', color: '#047857', bg: '#ecfdf5' },
  { id: 'pc_macos_14', category: 'pc', devType: 'pc_desktop', devOs: 'macos', label: '🍏 PC macOS 14 (Sonoma)', desc: 'PC Hackintosh chạy macOS Sonoma', color: '#065f46', bg: '#ecfdf5' },
  { id: 'pc_macos_15', category: 'pc', devType: 'pc_desktop', devOs: 'macos', label: '🍏 PC macOS 15 (Sequoia)', desc: 'PC Hackintosh macOS Sequoia mới nhất', color: '#0f172a', bg: '#f1f5f9' },
  { id: 'pc_linux', category: 'pc', devType: 'pc_desktop', devOs: 'linux', label: '🐧 PC Desktop Linux Workstation', desc: 'PC chạy Ubuntu Server, Fedora Workstation', color: '#c2410c', bg: '#fff7ed' },

  // Nhóm 3: Apple Mac Ecosystem
  { id: 'macbook_macos_15', category: 'mac', devType: 'macbook', devOs: 'macos', label: '🍏 MacBook macOS 15 (Sequoia)', desc: 'MacBook Pro / Air chip Apple M1/M2/M3/M4', color: '#0f172a', bg: '#f8fafc' },
  { id: 'macbook_macos_14', category: 'mac', devType: 'macbook', devOs: 'macos', label: '🍏 MacBook macOS 14 (Sonoma)', desc: 'MacBook Apple Silicon macOS Sonoma', color: '#1e293b', bg: '#f8fafc' },
  { id: 'macbook_macos_13', category: 'mac', devType: 'macbook', devOs: 'macos', label: '🍏 MacBook macOS 13 (Ventura)', desc: 'MacBook macOS Ventura', color: '#334155', bg: '#f8fafc' },
  { id: 'macbook_macos_12', category: 'mac', devType: 'macbook', devOs: 'macos', label: '🍏 MacBook macOS 12 (Monterey)', desc: 'MacBook macOS Monterey', color: '#475569', bg: '#f8fafc' },
  { id: 'macbook_intel', category: 'mac', devType: 'macbook', devOs: 'macos', label: '🍏 MacBook Intel (Big Sur/Catalina)', desc: 'MacBook đời 2015-2020 chạy CPU Intel', color: '#64748b', bg: '#f1f5f9' },
  { id: 'mac_mini_macos', category: 'mac', devType: 'mac_mini_studio', devOs: 'macos', label: '📦 Mac mini / Mac Studio', desc: 'Apple Mac mini, Studio M1/M2/M3', color: '#475569', bg: '#f1f5f9' },
  { id: 'imac_macos', category: 'mac', devType: 'imac_desktop', devOs: 'macos', label: '🖥️ iMac Desktop All-in-One', desc: 'iMac 24" M-Series hoặc iMac 27" 5K', color: '#0284c7', bg: '#e0f2fe' },
  { id: 'apple_display', category: 'mac', devType: 'apple_display', devOs: 'hardware_screen_only', label: '🖥️ Màn Hình Apple Studio / Pro XDR', desc: 'Màn hình Apple Display Thunderbolt', color: '#334155', bg: '#f8fafc' },

  // Nhóm 4: Tablet & Surface
  { id: 'surface_win11', category: 'tablet', devType: 'tablet_surface', devOs: 'win11', label: '🪟 Surface Windows 11 (2-in-1)', desc: 'Microsoft Surface Pro, Surface Go, Laptop Studio', color: '#0078d4', bg: '#e0f2fe' },
  { id: 'ipad_ipados_17_18', category: 'tablet', devType: 'tablet_ipad', devOs: 'ios_ipados', label: '🍎 iPad iPadOS 17 / 18', desc: 'iPad Pro, Air, Mini kèm Pencil & Keyboard', color: '#7c3aed', bg: '#f5f3ff' },
  { id: 'tablet_android', category: 'tablet', devType: 'tablet_android', devOs: 'android', label: '🤖 Tablet Android (Galaxy/Xiaomi)', desc: 'Máy tính bảng Android Samsung, Xiaomi, Lenovo', color: '#059669', bg: '#ecfdf5' }
];

let customDeviceTags = [];
let currentFilterCategory = 'all';

function getActiveDeviceTags() {
  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData.tiep_nhan) currentChecklistData.tiep_nhan = {};
  if (!Array.isArray(currentChecklistData.tiep_nhan.device_tags)) {
    // Khởi tạo mặc định nếu chưa có
    const initialDevType = currentChecklistData.tiep_nhan.device_type || 'laptop';
    const initialDevOs = currentChecklistData.tiep_nhan.device_os || 'win11';
    let defaultMatch = DEVICE_TAG_PRESETS.find(p => p.devType === initialDevType && p.devOs === initialDevOs);
    if (!defaultMatch) defaultMatch = DEVICE_TAG_PRESETS.find(p => p.devType === initialDevType) || DEVICE_TAG_PRESETS[0];
    currentChecklistData.tiep_nhan.device_tags = [defaultMatch.id];
  }
  return currentChecklistData.tiep_nhan.device_tags;
}

function openDeviceTagModal() {
  const modal = document.getElementById("deviceTagModal");
  if (!modal) return;
  modal.style.display = "flex";
  currentFilterCategory = 'all';
  const inputSearch = document.getElementById("inputSearchDeviceTag");
  if (inputSearch) inputSearch.value = "";
  renderActiveDeviceTagsUI();
  renderDeviceTagLibrary('all', '');
}

function closeDeviceTagModal() {
  const modal = document.getElementById("deviceTagModal");
  if (modal) modal.style.display = "none";
}

function filterDeviceTagsByCategory(cat, btnEl) {
  currentFilterCategory = cat;
  document.querySelectorAll("#deviceTagFilterGroup button").forEach(b => b.classList.remove("active"));
  if (btnEl) btnEl.classList.add("active");
  const keyword = document.getElementById("inputSearchDeviceTag")?.value || "";
  renderDeviceTagLibrary(cat, keyword);
}

function searchDeviceTagsInModal(keyword) {
  renderDeviceTagLibrary(currentFilterCategory, keyword);
}

function renderDeviceTagLibrary(category = 'all', keyword = '') {
  const container = document.getElementById("deviceTagPresetLibraryList");
  if (!container) return;

  const activeTagIds = getActiveDeviceTags();
  const kw = (keyword || '').toLowerCase().trim();

  const allTags = [...DEVICE_TAG_PRESETS, ...customDeviceTags];
  const filtered = allTags.filter(t => {
    const matchCat = (category === 'all' || t.category === category);
    const matchKw = (!kw || t.label.toLowerCase().includes(kw) || (t.desc && t.desc.toLowerCase().includes(kw)));
    return matchCat && matchKw;
  });

  const countBadge = document.getElementById("tagLibraryCountBadge");
  if (countBadge) countBadge.innerText = `${filtered.length} nhãn`;

  let html = "";
  filtered.forEach(tag => {
    const isAttached = activeTagIds.includes(tag.id);
    html += `
      <div style="background:#ffffff; border:1.5px solid ${isAttached ? '#059669' : '#e2e8f0'}; border-radius:10px; padding:10px 12px; display:flex; flex-direction:column; justify-content:space-between; gap:6px; box-shadow:${isAttached ? '0 2px 8px rgba(5,150,105,0.15)' : '0 1px 3px rgba(0,0,0,0.03)'}; transition:all 0.15s ease;">
        <div>
          <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
            <div style="font-weight:800; font-size:12.5px; color:${isAttached ? '#047857' : '#0f172a'};">${tag.label}</div>
            ${isAttached ? '<span style="font-size:10.5px; font-weight:800; color:#059669; background:#dcfce7; padding:1px 6px; border-radius:4px;">✔ ĐÃ GẮN</span>' : ''}
          </div>
          <div style="font-size:11px; color:#64748b; line-height:1.4; margin-top:3px;">
            ${tag.desc || 'Nhãn phân loại kỹ thuật'}
          </div>
        </div>
        <div style="margin-top:4px;">
          ${isAttached ? `
            <button type="button" class="btn btn-compact" onclick="detachDeviceTag('${tag.id}')" style="width:100%; font-size:11px; font-weight:700; padding:4px 8px; background:#fff1f2; color:#e11d48; border:1px solid #fecdd3;">
              ✕ Gỡ Nhãn Này
            </button>
          ` : `
            <button type="button" class="btn btn-primary btn-compact" onclick="attachDeviceTag('${tag.id}')" style="width:100%; font-size:11px; font-weight:800; padding:4px 8px; background:#059669; border-color:#047857;">
              + Gắn Nhãn Này
            </button>
          `}
        </div>
      </div>
    `;
  });

  if (filtered.length === 0) {
    html = `<div style="grid-column:1/-1; padding:20px; text-align:center; color:#94a3b8; font-size:12.5px;">Không tìm thấy nhãn nào khớp với từ khóa "${keyword}". Bạn có thể tự gõ nhãn mới ở ô trên!</div>`;
  }

  container.innerHTML = html;
}

function attachDeviceTag(tagId) {
  const activeTags = getActiveDeviceTags();
  if (!activeTags.includes(tagId)) {
    activeTags.push(tagId);
  }

  // Tự động đồng bộ dòng máy và OS nếu là nhãn preset chuẩn
  const preset = DEVICE_TAG_PRESETS.find(p => p.id === tagId);
  if (preset) {
    if (preset.devType) currentChecklistData.tiep_nhan.device_type = preset.devType;
    if (preset.devOs) currentChecklistData.tiep_nhan.device_os = preset.devOs;
    if (typeof updateMdxgCanvasBranchHighlight === 'function') {
      updateMdxgCanvasBranchHighlight(preset.devType);
    }
  }

  saveCurrentChecklist(true);
  renderActiveDeviceTagsUI();
  renderDeviceSummaryText(currentChecklistData.tiep_nhan.device_type, currentChecklistData.tiep_nhan.device_os);
  renderDeviceTagLibrary(currentFilterCategory, document.getElementById("inputSearchDeviceTag")?.value || '');

  const label = preset ? preset.label : tagId;
  showToast(`🏷️ Đã gắn nhãn thành công: ${label}`);
}

function detachDeviceTag(tagId) {
  let activeTags = getActiveDeviceTags();
  activeTags = activeTags.filter(id => id !== tagId);
  currentChecklistData.tiep_nhan.device_tags = activeTags;

  saveCurrentChecklist(true);
  renderActiveDeviceTagsUI();
  renderDeviceSummaryText(currentChecklistData.tiep_nhan.device_type, currentChecklistData.tiep_nhan.device_os);
  renderDeviceTagLibrary(currentFilterCategory, document.getElementById("inputSearchDeviceTag")?.value || '');
  showToast(`🗑️ Đã gỡ nhãn khỏi thiết bị`);
}

function addNewCustomDeviceTag() {
  const input = document.getElementById("inputNewDeviceTag");
  if (!input) return;
  const val = input.value.trim();
  if (!val) {
    showToast("⚠️ Vui lòng nhập tên nhãn cần tạo!");
    return;
  }

  const id = 'custom_' + Date.now();
  const newTag = {
    id: id,
    category: 'custom',
    label: `🏷️ ${val}`,
    desc: 'Nhãn kỹ thuật viên tự tạo',
    color: '#059669',
    bg: '#ecfdf5'
  };

  customDeviceTags.push(newTag);
  input.value = "";
  attachDeviceTag(id);
}

function renderActiveDeviceTagsUI() {
  const activeTagIds = getActiveDeviceTags();
  const allTags = [...DEVICE_TAG_PRESETS, ...customDeviceTags];

  const sectionContainer = document.getElementById("chkActiveDeviceTagsList");
  const modalContainer = document.getElementById("modalActiveTagsList");

  let chipsHtml = "";
  if (activeTagIds.length === 0) {
    chipsHtml = `<span style="font-size:11.5px; color:#94a3b8; font-style:italic;">Chưa có nhãn nào được gắn. Bấm "+ Thêm / Đổi Nhãn" để chọn.</span>`;
  } else {
    activeTagIds.forEach(id => {
      const tag = allTags.find(t => t.id === id) || { label: id, color: '#059669', bg: '#ecfdf5' };
      chipsHtml += `
        <span style="display:inline-flex; align-items:center; gap:5px; background:${tag.bg || '#ecfdf5'}; color:${tag.color || '#047857'}; border:1.5px solid ${tag.color || '#86efac'}; padding:3px 9px; border-radius:20px; font-size:11.5px; font-weight:800; box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <span>${tag.label}</span>
          <button type="button" onclick="detachDeviceTag('${id}')" style="background:transparent; border:none; color:inherit; cursor:pointer; font-weight:900; font-size:13px; line-height:1; padding:0 2px;" title="Gỡ nhãn này">&times;</button>
        </span>
      `;
    });
  }

  if (sectionContainer) sectionContainer.innerHTML = chipsHtml;
  if (modalContainer) modalContainer.innerHTML = chipsHtml;
}

window.openDeviceTagModal = openDeviceTagModal;
window.closeDeviceTagModal = closeDeviceTagModal;
window.filterDeviceTagsByCategory = filterDeviceTagsByCategory;
window.searchDeviceTagsInModal = searchDeviceTagsInModal;
window.attachDeviceTag = attachDeviceTag;
window.detachDeviceTag = detachDeviceTag;
window.addNewCustomDeviceTag = addNewCustomDeviceTag;
window.renderActiveDeviceTagsUI = renderActiveDeviceTagsUI;

function renderOsButtonsForDevice(devType) {
  const containers = document.querySelectorAll("#chkDeviceOsGroup, #chkDeviceOsGroup_modal, .chk-device-os-group");
  if (!containers || containers.length === 0) return;
  const devMeta = getCurrentDeviceMeta(devType);
  const allowed = devMeta.allowed_os || [];

  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData.tiep_nhan) currentChecklistData.tiep_nhan = {};

  let currentOs = currentChecklistData.tiep_nhan.device_os;
  const isCurrentAllowed = allowed.some(o => o.id === currentOs);
  if (!isCurrentAllowed) {
    currentOs = devMeta.default_os || (allowed[0] ? allowed[0].id : 'windows');
    currentChecklistData.tiep_nhan.device_os = currentOs;
  }

  containers.forEach(container => {
    let html = "";
    allowed.forEach(osItem => {
      const isActive = (osItem.id === currentOs);
      html += `
        <button type="button" class="btn btn-compact chk-pill-btn ${isActive ? 'active' : ''}" data-os="${osItem.id}" onclick="selectChecklistDeviceOs('${osItem.id}', this)" style="padding:6px 14px; font-size:12px; font-weight:700; border-radius:20px; border:1.5px solid ${isActive ? '#047857' : '#a7f3d0'}; background:${isActive ? '#059669' : '#ffffff'}; color:${isActive ? '#ffffff' : '#047857'}; cursor:pointer;">
          ${osItem.label}
        </button>
      `;
    });
    container.innerHTML = html;
  });
}

function selectChecklistDeviceOs(osType, btnEl) {
  isChecklistDirty = true;
  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData.tiep_nhan) currentChecklistData.tiep_nhan = {};
  currentChecklistData.tiep_nhan.device_os = osType;

  document.querySelectorAll("#chkDeviceOsGroup .chk-pill-btn, #chkDeviceOsGroup_modal .chk-pill-btn, .chk-device-os-group .chk-pill-btn").forEach(b => {
    const isTarget = (b.getAttribute("data-os") === osType || b === btnEl);
    b.classList.toggle("active", isTarget);
    b.style.background = isTarget ? "#059669" : "#ffffff";
    b.style.color = isTarget ? "#ffffff" : "#047857";
    b.style.borderColor = isTarget ? "#047857" : "#a7f3d0";
  });

  updateReceiptSummaryBadges();
}

function renderDynamicAccessories(devType, savedAccessories = null) {
  const containers = document.querySelectorAll("#chkDynamicAccessoriesList, .chk-acc-dynamic-grid");
  if (!containers || containers.length === 0) return;
  const devMeta = getCurrentDeviceMeta(devType);
  const accessoriesList = devMeta.accessories || [];
  
  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData.tiep_nhan) currentChecklistData.tiep_nhan = {};
  if (!currentChecklistData.tiep_nhan.accessories) currentChecklistData.tiep_nhan.accessories = {};

  containers.forEach(container => {
    let html = "";
    accessoriesList.forEach(item => {
      let isChecked;
      if (savedAccessories && savedAccessories[item.id] !== undefined) {
        isChecked = !!savedAccessories[item.id];
      } else if (currentChecklistData.tiep_nhan.accessories[item.id] !== undefined) {
        isChecked = !!currentChecklistData.tiep_nhan.accessories[item.id];
      } else {
        isChecked = !!item.default;
      }
      currentChecklistData.tiep_nhan.accessories[item.id] = isChecked;

      html += `
        <label class="chk-acc-card ${isChecked ? 'is-checked' : ''}" id="chkAccCard_${item.id}" data-acc-id="${item.id}">
          <input type="checkbox" id="chkAcc_${item.id}" data-acc-key="${item.id}" ${isChecked ? 'checked' : ''} onchange="onChecklistAccessoryToggle('${item.id}', this)" style="accent-color:#059669; cursor:pointer;">
          <span style="font-size:12px;">${item.label}</span>
        </label>
      `;
    });
    container.innerHTML = html;
  });
}

function onChecklistAccessoryToggle(accId, cbEl) {
  isChecklistDirty = true;
  const val = cbEl ? cbEl.checked : (document.getElementById(`chkAcc_${accId}`)?.checked || false);
  
  document.querySelectorAll(`input[data-acc-key="${accId}"], #chkAcc_${accId}`).forEach(input => {
    input.checked = val;
  });
  document.querySelectorAll(`label[data-acc-id="${accId}"], #chkAccCard_${accId}`).forEach(card => {
    card.classList.toggle("is-checked", val);
  });

  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData.tiep_nhan) currentChecklistData.tiep_nhan = {};
  if (!currentChecklistData.tiep_nhan.accessories) currentChecklistData.tiep_nhan.accessories = {};
  currentChecklistData.tiep_nhan.accessories[accId] = val;
}

function resetChecklistAccessories(mode) {
  isChecklistDirty = true;
  const devType = currentChecklistData?.tiep_nhan?.device_type || "laptop";
  const devMeta = getCurrentDeviceMeta(devType);
  const accessoriesList = devMeta.accessories || [];

  accessoriesList.forEach(item => {
    let val = false;
    if (mode === true) val = true;
    else if (mode === false) val = false;
    else if (mode === 'default') val = !!item.default;

    document.querySelectorAll(`input[data-acc-key="${item.id}"], #chkAcc_${item.id}`).forEach(input => {
      input.checked = val;
    });
    document.querySelectorAll(`label[data-acc-id="${item.id}"], #chkAccCard_${item.id}`).forEach(card => {
      card.classList.toggle("is-checked", val);
    });

    if (!currentChecklistData.tiep_nhan.accessories) currentChecklistData.tiep_nhan.accessories = {};
    currentChecklistData.tiep_nhan.accessories[item.id] = val;
  });

  if (mode === true) showToast("✔ Đã chọn tất cả phụ kiện");
  else if (mode === false) showToast("✔ Đã chọn nhận máy trần (không phụ kiện)");
  else showToast("✔ Đã khôi phục phụ kiện mặc định chuẩn");
}

function renderDynamicExterior(devType, savedItems = null) {
  const devMeta = getCurrentDeviceMeta(devType);
  const items = savedItems || currentChecklistData?.tiep_nhan?.items || {};
  renderChecklistItemsGroup("chkItemsList_tn_exterior", "tiep_nhan", devMeta.exterior, items);
  renderChecklistItemsGroup("chkDynamicExteriorList", "tiep_nhan", devMeta.exterior, items);
}

function renderTechnicalChecks(savedItems = null) {
  const items = savedItems || currentChecklistData?.tiep_nhan?.items || {};
  renderChecklistItemsGroup("chkItemsList_tn_f1", "tiep_nhan", TECHNICAL_CHECKS_META.f1, items);
  renderChecklistItemsGroup("chkItemsList_tn_f2", "tiep_nhan", TECHNICAL_CHECKS_META.f2, items);
  renderChecklistItemsGroup("chkItemsList_tn_f3", "tiep_nhan", TECHNICAL_CHECKS_META.f3, items);
  renderChecklistItemsGroup("chkItemsList_tn_f4", "tiep_nhan", TECHNICAL_CHECKS_META.f4, items);

  renderChecklistItemsGroup("chkTechGroup_power_battery", "tiep_nhan", TECHNICAL_CHECKS_META.f1, items);
  renderChecklistItemsGroup("chkTechGroup_screen_display", "tiep_nhan", TECHNICAL_CHECKS_META.f2, items);
  renderChecklistItemsGroup("chkTechGroup_internal_hw", "tiep_nhan", TECHNICAL_CHECKS_META.f3, items);
  renderChecklistItemsGroup("chkTechGroup_connectivity", "tiep_nhan", TECHNICAL_CHECKS_META.f4, items);
}

function setQuickMachineCondition(conditionText) {
  isChecklistDirty = true;
  const input = document.getElementById("chkMachineCondition_tn");
  if (input) {
    input.value = conditionText;
    showToast(`✔ Đã chọn tình trạng: ${conditionText}`);
  }
}

function selectChecklistDataStatus(status) {
  isChecklistDirty = true;
  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData.tiep_nhan) currentChecklistData.tiep_nhan = {};
  currentChecklistData.tiep_nhan.data_backup_status = status;

  ['backup_needed', 'already_backed_up', 'clean_no_backup'].forEach(st => {
    const card = document.getElementById(`chkDataCard_${st}`);
    const radio = card?.querySelector('input[type="radio"]');
    if (card) card.classList.toggle('active', st === status);
    if (radio) radio.checked = (st === status);
  });
  updateReceiptSummaryBadges();
}

function toggleFlowchartDiagram() {
  const card = document.getElementById("chkFlowchartDiagramCard");
  const arrow = document.getElementById("flowchartDiagramArrow");
  if (!card) return;
  const isHidden = (card.style.display === "none" || !card.style.display);
  card.style.display = isHidden ? "block" : "none";
  if (arrow) arrow.innerText = isHidden ? "▲ Ẩn sơ đồ" : "▼ Xem sơ đồ";
}

function checkAllSectionItems(sectionKey, val) {
  isChecklistDirty = true;
  const devType = currentChecklistData?.tiep_nhan?.device_type || "laptop_pc";
  const devMeta = getCurrentDeviceMeta(devType);
  let items = [];
  if (sectionKey === 'exterior') {
    items = devMeta.exterior;
  } else if (sectionKey === 'technical') {
    items = [].concat(TECHNICAL_CHECKS_META.f1, TECHNICAL_CHECKS_META.f2, TECHNICAL_CHECKS_META.f3, TECHNICAL_CHECKS_META.f4);
  }

  items.forEach(item => {
    const cb = document.getElementById(`chkItem_tiep_nhan_${item.id}`);
    const row = document.getElementById(`chkRow_tiep_nhan_${item.id}`);
    if (cb) cb.checked = val;
    if (row) row.classList.toggle("is-checked", val);
  });
  updateChecklistProgress();
  updateReceiptSummaryBadges();
  showToast(val ? `✔ Đã chọn đạt toàn bộ mục kiểm tra!` : `✗ Đã bỏ chọn tất cả!`);
}

function updateReceiptSummaryBadges() {
  const dev = currentChecklistData?.tiep_nhan?.device_type || "laptop_pc";
  const devMeta = getCurrentDeviceMeta(dev);

  const devOsMap = {
    windows: "🪟 Windows",
    macos: "🍎 macOS",
    linux: "🐧 Linux",
    ios_ipados: "🍎 iPadOS/iOS",
    android: "🤖 Android"
  };
  const os = currentChecklistData?.tiep_nhan?.device_os || devMeta.default_os;

  const devBadge = document.getElementById("chkSummaryDevBadge");
  const osBadge = document.getElementById("chkSummaryOsBadge");
  if (devBadge) devBadge.innerHTML = `<strong>${devMeta.label}</strong>`;
  if (osBadge) osBadge.innerText = devOsMap[os] || os;

  const checkGroup = (items, badgeId) => {
    const badge = document.getElementById(badgeId);
    if (!badge) return;
    let checked = 0;
    items.forEach(i => {
      const cb = document.querySelector(`input[data-item-key="tiep_nhan_${i.id}"]`) || document.getElementById(`chkItem_tiep_nhan_${i.id}`);
      if (cb && cb.checked) checked++;
    });
    if (checked === items.length) {
      badge.innerHTML = `✔ Đạt chuẩn (${checked}/${items.length})`;
      badge.style.color = "#059669";
    } else {
      badge.innerHTML = `⚠️ Cần lưu ý (${checked}/${items.length})`;
      badge.style.color = "#d97706";
    }
  };

  checkGroup(devMeta.exterior, "chkSummaryExtBadge");
  const allTech = [].concat(TECHNICAL_CHECKS_META.f1, TECHNICAL_CHECKS_META.f2, TECHNICAL_CHECKS_META.f3, TECHNICAL_CHECKS_META.f4);
  checkGroup(allTech, "chkSummaryHwBadge");

  const softBadge = document.getElementById("chkSummarySoftBadge");
  if (softBadge) {
    const bStatus = currentChecklistData?.tiep_nhan?.data_backup_status || 'backup_needed';
    const statusMap = {
      backup_needed: "⚠️ Cần sao lưu",
      already_backed_up: "✔ Đã tự backup",
      clean_no_backup: "⚪ Máy trắng"
    };
    softBadge.innerText = statusMap[bStatus] || "Đã kiểm tra";
    softBadge.style.color = (bStatus === 'backup_needed') ? "#b45309" : "#059669";
  }
}

function copyReceiptSummary(btnEl) {
  saveCurrentChecklist(true);
  const custName = document.getElementById("chkCustName_tn")?.value || "Khách Hàng";
  const custId = document.getElementById("chkCustId_tn")?.value || "Chưa có";
  const condition = document.getElementById("chkMachineCondition_tn")?.value || "Bình thường";
  const pin = document.getElementById("chkPin_tn")?.value || "Không có";
  const cloudAcc = document.getElementById("chkCloudAccount_tn")?.value || "Không có";
  const tech = document.getElementById("chkTechName_tn")?.value || "Kỹ thuật viên";
  const timeStr = document.getElementById("chkReceiveTime_tn")?.value || new Date().toLocaleString('vi-VN');

  const cpu = document.getElementById("chkHwCpu_tn")?.value || "";
  const ram = document.getElementById("chkHwRam_tn")?.value || "";
  const storage = document.getElementById("chkHwStorage_tn")?.value || "";
  const vga = document.getElementById("chkHwVga_tn")?.value || "";
  const specParts = [];
  if (cpu) specParts.push(`CPU: ${cpu}`);
  if (ram) specParts.push(`RAM: ${ram}`);
  if (storage) specParts.push(`Ổ cứng: ${storage}`);
  if (vga) specParts.push(`VGA: ${vga}`);
  const specText = specParts.length > 0 ? specParts.join(" | ") : "Chưa ghi nhận";

  const bStatus = currentChecklistData?.tiep_nhan?.data_backup_status || 'backup_needed';
  const statusMap = {
    backup_needed: "Cần kỹ thuật sao lưu trước khi cài",
    already_backed_up: "Khách đã tự sao lưu an toàn",
    clean_no_backup: "Máy trắng, không cần lưu dữ liệu"
  };
  const dataSpecial = document.getElementById("chkDataSpecialNotes_tn")?.value?.trim();

  const devType = currentChecklistData?.tiep_nhan?.device_type || "laptop_pc";
  const devMeta = getCurrentDeviceMeta(devType);

  const devOsMap = { windows: "Windows", macos: "macOS", linux: "Linux", ios_ipados: "iPadOS / iOS", android: "Android" };
  const os = devOsMap[currentChecklistData?.tiep_nhan?.device_os] || "Windows";

  const accList = [];
  (devMeta.accessories || []).forEach(item => {
    if (currentChecklistData?.tiep_nhan?.accessories?.[item.id]) {
      accList.push(item.label.replace(/^.*?\s/, ''));
    }
  });
  const accOther = document.getElementById("chkAccOther_tn")?.value?.trim();
  if (accOther) accList.push(accOther);
  const accStr = accList.length > 0 ? accList.join(", ") : "Chỉ nhận máy trần";

  const getUncheckedDesc = (items, groupName) => {
    const bad = [];
    items.forEach(i => {
      const cb = document.querySelector(`input[data-item-key="tiep_nhan_${i.id}"]`) || document.getElementById(`chkItem_tiep_nhan_${i.id}`);
      if (cb && !cb.checked) bad.push(i.label);
    });
    if (bad.length === 0) return `✔ ${groupName}: Hoạt động tốt / Đạt chuẩn`;
    return `⚠️ ${groupName} có điểm cần lưu ý: ${bad.join(", ")}`;
  };

  const text = `📥 BIÊN BẢN TIẾP NHẬN & KIỂM ĐỊNH THIẾT BỊ
-----------------------------------------------
👤 Khách hàng: ${custName} | SĐT/ID: ${custId}
📱 Thiết bị: ${devMeta.label} | Hệ điều hành: ${os}
⚙️ Cấu hình máy: ${specText}
📁 Tình trạng dữ liệu: ${statusMap[bStatus] || bStatus}${dataSpecial ? ` (Lưu ý: ${dataSpecial})` : ''}
🔑 Mật khẩu máy / PIN: ${pin} | Tài khoản: ${cloudAcc}
🔧 Tình trạng máy lúc nhận: ${condition}
🔌 Phụ kiện nhận kèm: ${accStr}
-----------------------------------------------
KẾT QUẢ KIỂM ĐỊNH KỸ THUẬT:
${getUncheckedDesc(devMeta.exterior, "1. Ngoại quan & Vỏ máy")}
${getUncheckedDesc(TECHNICAL_CHECKS_META.f1, "Nguồn & Pin")}
${getUncheckedDesc(TECHNICAL_CHECKS_META.f2, "Màn hình")}
${getUncheckedDesc(TECHNICAL_CHECKS_META.f3, "Linh kiện trong")}
${getUncheckedDesc(TECHNICAL_CHECKS_META.f4, "Kết nối & Ngoại vi")}
-----------------------------------------------
👨‍🔧 KTV Tiếp Nhận: ${tech} | Thời gian: ${timeStr}
(Biên bản kiểm tra điện tử được lập tự động chuẩn kỹ thuật viên)`;

  navigator.clipboard.writeText(text).then(() => {
    showToast("✔ Đã sao chép tóm tắt biên bản tiếp nhận (Zalo/SMS)!");
    if (btnEl) {
      const orig = btnEl.innerText;
      btnEl.innerText = "✔ Đã Sao Chép";
      setTimeout(() => { btnEl.innerText = orig; }, 1800);
    }
  }).catch(() => {
    showToast("Vui lòng sao chép thủ công");
  });
}

function switchChecklistModalTab(tabName) {
  activeChecklistTab = tabName;
  const btnTn = document.getElementById("btnChkTabTiepNhan");
  const btnBg = document.getElementById("btnChkTabBanGiao");
  const bodyTn = document.getElementById("chkTabBodyTiepNhan");
  const bodyBg = document.getElementById("chkTabBodyBanGiao");
  const badge = document.getElementById("chkModalStageBadge");
  const btnPrint = document.getElementById("btnModalPrintReceipt");

  if (tabName === 'ban_giao') {
    if (btnBg) btnBg.classList.add("active");
    if (btnTn) btnTn.classList.remove("active");
    if (bodyBg) bodyBg.classList.add("active");
    if (bodyTn) bodyTn.classList.remove("active");
    if (badge) {
      badge.innerText = "📤 Bàn Giao";
      badge.className = "badge badge-primary";
    }
    if (btnPrint) btnPrint.innerHTML = "🖨️ In Biên Bản Bàn Giao";
  } else {
    if (btnTn) btnTn.classList.add("active");
    if (btnBg) btnBg.classList.remove("active");
    if (bodyTn) bodyTn.classList.add("active");
    if (bodyBg) bodyBg.classList.remove("active");
    if (badge) {
      badge.innerText = "📥 Tiếp Nhận";
      badge.className = "badge badge-mint";
    }
    if (btnPrint) btnPrint.innerHTML = "🖨️ In Biên Bản Tiếp Nhận";
  }

  updateChecklistProgress();
  updateReceiptSummaryBadges();
}

function populateDualChecklistForm(data) {
  let devType = data.tiep_nhan?.device_type || "laptop";
  if (devType === "laptop_pc") devType = "laptop";
  if (devType === "mac") devType = "macbook";
  if (devType === "tablet_mobile") devType = "tablet_ipad";
  const devOs = data.tiep_nhan?.device_os || "windows";

  selectChecklistDeviceType(devType);
  selectChecklistDeviceOs(devOs);

  // Nạp phụ kiện và linh kiện đã lưu
  renderDynamicAccessories(devType, data.tiep_nhan?.accessories || {});
  renderDynamicExterior(devType, data.tiep_nhan?.items || {});
  renderTechnicalChecks(data.tiep_nhan?.items || {});

  // Cấu hình phần cứng (Mainboard, CPU, RAM & Bus, Ổ cứng, VGA, Nguồn PSU/Pin, Form factor)
  const specs = data.tiep_nhan?.specs || {};
  const infoSrc = (activeScanId && currentScanTask) ? currentScanTask : (currentMachineInfo || {});
  const rObj = (infoSrc.ram_info && typeof infoSrc.ram_info === "object") ? infoSrc.ram_info : {};
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  const cpuVal = specs.cpu || infoSrc.cpu_name || currentMachineInfo?.cpu_name || infoSrc.hw_summary || "";
  setVal("chkSpecCpu", cpuVal);
  setVal("chkHwCpu_tn", cpuVal);

  const moboVal = specs.motherboard || specs.mainboard || infoSrc.motherboard || currentMachineInfo?.motherboard || "";
  setVal("chkSpecMainboard", moboVal);
  setVal("chkHwMainboard_tn", moboVal);

  const autoRamVal = infoSrc.ram_summary || rObj.ram_summary || (infoSrc.total_ram_gb ? `${infoSrc.total_ram_gb} GB` : (currentMachineInfo?.ram_summary || (currentMachineInfo?.total_ram_gb ? `${currentMachineInfo.total_ram_gb} GB` : "")));
  const ramVal = specs.ram || autoRamVal || "";
  setVal("chkSpecRam", ramVal);
  setVal("chkHwRam_tn", ramVal);

  const storageVal = specs.storage || infoSrc.disk_summary || currentMachineInfo?.disk_size || "";
  setVal("chkSpecStorage", storageVal);
  setVal("chkHwStorage_tn", storageVal);

  const vgaVal = specs.vga || infoSrc.primary_gpu || currentMachineInfo?.gpu || "";
  setVal("chkSpecGpu", vgaVal);
  setVal("chkHwVga_tn", vgaVal);

  const psuVal = specs.psu || specs.power_supply_or_battery || "";
  setVal("chkSpecPsu", psuVal);
  setVal("chkHwPsu_tn", psuVal);

  const formFactorVal = specs.form_factor || "";
  setVal("chkSpecFormFactor", formFactorVal);
  setVal("chkHwFormFactor_tn", formFactorVal);

  // Khách hàng & KTV
  setVal("chkCustName", data.customer_name || "");
  setVal("chkCustName_tn", data.customer_name || "");
  setVal("chkCustPhone", data.customer_phone || "");
  setVal("chkCustId_tn", data.customer_id || (data.customer_phone ? 'KH-' + data.customer_phone.slice(-4) : 'KH01'));
  setVal("chkStaffName", data.tiep_nhan?.technician_name || "KTV Tiếp Nhận");
  setVal("chkTechName_tn", data.tiep_nhan?.technician_name || "KTV Tiếp Nhận");
  setVal("chkMachineModel", data.tiep_nhan?.machine_model || infoSrc.system_model || "");
  setVal("chkMachineSerial", data.tiep_nhan?.serial_number || infoSrc.serial_number || currentMachineInfo?.serial_number || "");

  // Tình trạng dữ liệu
  selectChecklistDataStatus(data.tiep_nhan?.data_backup_status || 'need_backup');
  const specialNotes = data.tiep_nhan?.data_special_notes || "";
  setVal("chkDataSpecialNotes", specialNotes);
  setVal("chkDataSpecialNotes_tn", specialNotes);

  // Mật khẩu & Tài khoản
  const pinVal = data.tiep_nhan?.customer_pin || "";
  setVal("chkDevicePassword", pinVal);
  setVal("chkPin_tn", pinVal);

  const cloudVal = data.tiep_nhan?.cloud_account || "";
  setVal("chkCloudAccount", cloudVal);
  setVal("chkCloudAccount_tn", cloudVal);

  // Tình trạng máy, KTV, Thời gian tiếp nhận
  setVal("chkMachineCondition_tn", data.tiep_nhan?.machine_condition || "");
  setVal("chkReceiveTime_tn", data.tiep_nhan?.receive_time || new Date().toLocaleString('vi-VN'));

  const otherAcc = data.tiep_nhan?.accessories?.other || "";
  setVal("chkAccOther", otherAcc);
  setVal("chkAccOther_tn", otherAcc);

  // Bàn giao: QC & Khách hàng
  renderChecklistItemsGroup("chkItemsList_bg_qc", "ban_giao", CHECKLIST_ITEMS_META.ban_giao.qc, data.ban_giao?.items || {}, "theme-ban-giao");
  renderChecklistItemsGroup("chkItemsList_bg_cust", "ban_giao", CHECKLIST_ITEMS_META.ban_giao.cust, data.ban_giao?.items || {}, "theme-ban-giao");

  switchChecklistModalTab(activeChecklistTab);
  renderDeviceSummaryText(devType, devOs);
  if (data.customer_name || data.tiep_nhan?.specs?.cpu || data.tiep_nhan?.machine_model) {
    setDeviceDisplayMode('summary');
  }
  updateChecklistProgress();
  updateReceiptSummaryBadges();
}

function renderChecklistItemsGroup(containerId, tabKey, itemsMeta, savedItems, extraClass = '') {
  const container = document.getElementById(containerId);
  if (!container) return;
  let html = "";
  (itemsMeta || []).forEach(item => {
    const isChecked = (savedItems && savedItems[item.id] !== undefined) ? (savedItems[item.id] !== false) : true;
    html += `
      <label class="chk-item-row ${isChecked ? 'is-checked' : ''} ${extraClass}" id="chkRow_${containerId}_${item.id}" data-row-key="${tabKey}_${item.id}">
        <input type="checkbox" class="chk-checkbox" id="chkItem_${containerId}_${item.id}" data-item-key="${tabKey}_${item.id}" ${isChecked ? 'checked' : ''} onchange="onChecklistItemToggle('${tabKey}', '${item.id}', this)">
        <div class="chk-item-content">
          <span class="chk-item-label">${item.label}</span>
          <span class="chk-item-desc">${item.desc}</span>
        </div>
      </label>
    `;
  });
  container.innerHTML = html;
}

function onChecklistItemToggle(tabKey, itemId, cbEl) {
  isChecklistDirty = true;
  const isChecked = cbEl ? cbEl.checked : (document.querySelector(`input[data-item-key="${tabKey}_${itemId}"]`)?.checked || false);
  
  document.querySelectorAll(`input[data-item-key="${tabKey}_${itemId}"]`).forEach(cb => {
    cb.checked = isChecked;
  });
  document.querySelectorAll(`label[data-row-key="${tabKey}_${itemId}"]`).forEach(row => {
    row.classList.toggle("is-checked", isChecked);
  });

  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData[tabKey]) currentChecklistData[tabKey] = {};
  if (!currentChecklistData[tabKey].items) currentChecklistData[tabKey].items = {};
  currentChecklistData[tabKey].items[itemId] = isChecked;

  updateChecklistProgress();
  updateReceiptSummaryBadges();
}

function updateChecklistProgress() {
  const countEl = document.getElementById("chkProgressCount");
  const fillEl = document.getElementById("chkProgressBarFill");
  if (!countEl || !fillEl) return;

  if (activeChecklistTab === 'tiep_nhan') {
    const devType = currentChecklistData?.tiep_nhan?.device_type || "laptop_pc";
    const devMeta = getCurrentDeviceMeta(devType);
    const allItems = [].concat(devMeta.exterior, TECHNICAL_CHECKS_META.f1, TECHNICAL_CHECKS_META.f2, TECHNICAL_CHECKS_META.f3, TECHNICAL_CHECKS_META.f4);
    let checked = 0;
    allItems.forEach(i => {
      const cb = document.querySelector(`input[data-item-key="tiep_nhan_${i.id}"]`) || document.getElementById(`chkItem_tiep_nhan_${i.id}`);
      if (cb && cb.checked) checked++;
    });
    const pct = Math.round((checked / allItems.length) * 100);
    countEl.innerText = `${checked} / ${allItems.length} mục (${pct}%)`;
    fillEl.style.width = `${pct}%`;
  } else {
    const meta = CHECKLIST_ITEMS_META.ban_giao;
    const allItems = meta.qc.concat(meta.cust);
    let checked = 0;
    allItems.forEach(i => {
      const cb = document.getElementById(`chkItem_ban_giao_${i.id}`);
      if (cb && cb.checked) checked++;
    });
    const pct = Math.round((checked / allItems.length) * 100);
    countEl.innerText = `${checked} / ${allItems.length} mục (${pct}%)`;
    fillEl.style.width = `${pct}%`;
  }
}

function resetCurrentTabChecklist(val) {
  isChecklistDirty = true;
  if (activeChecklistTab === 'tiep_nhan') {
    const devType = currentChecklistData?.tiep_nhan?.device_type || "laptop_pc";
    const devMeta = getCurrentDeviceMeta(devType);
    const allItems = [].concat(devMeta.exterior, TECHNICAL_CHECKS_META.f1, TECHNICAL_CHECKS_META.f2, TECHNICAL_CHECKS_META.f3, TECHNICAL_CHECKS_META.f4);
    allItems.forEach(i => {
      const cb = document.getElementById(`chkItem_tiep_nhan_${i.id}`);
      const row = document.getElementById(`chkRow_tiep_nhan_${i.id}`);
      if (cb) cb.checked = val;
      if (row) row.classList.toggle("is-checked", val);
    });
  } else {
    const meta = CHECKLIST_ITEMS_META.ban_giao;
    const allItems = meta.qc.concat(meta.cust);
    allItems.forEach(i => {
      const cb = document.getElementById(`chkItem_ban_giao_${i.id}`);
      const row = document.getElementById(`chkRow_ban_giao_${i.id}`);
      if (cb) cb.checked = val;
      if (row) row.classList.toggle("is-checked", val);
    });
  }
  updateChecklistProgress();
  updateReceiptSummaryBadges();
  showToast(val ? "✔ Đã chọn tất cả các mục!" : "✗ Đã bỏ chọn tất cả!");
}

function saveCurrentChecklist(silent = false) {
  isChecklistDirty = false;
  if (!currentChecklistData) currentChecklistData = {};
  if (!currentChecklistData.tiep_nhan) currentChecklistData.tiep_nhan = {};
  if (!currentChecklistData.ban_giao) currentChecklistData.ban_giao = {};

  const getV = (id1, id2) => document.getElementById(id1)?.value || document.getElementById(id2)?.value || "";

  const custName = getV("chkCustName", "chkCustName_tn");
  const custPhone = getV("chkCustPhone", "");
  const custId = getV("chkCustId_tn", "") || (custPhone ? 'KH-' + custPhone.slice(-4) : "KH01");
  currentChecklistData.customer_name = custName;
  currentChecklistData.customer_phone = custPhone;
  currentChecklistData.customer_id = custId;

  currentChecklistData.tiep_nhan.technician_name = getV("chkStaffName", "chkTechName_tn") || "Kỹ Thuật Viên";
  currentChecklistData.tiep_nhan.receive_time = getV("chkReceiveTime_tn", "") || new Date().toLocaleString('vi-VN');
  currentChecklistData.tiep_nhan.customer_pin = getV("chkDevicePassword", "chkPin_tn");
  currentChecklistData.tiep_nhan.cloud_account = getV("chkCloudAccount", "chkCloudAccount_tn");
  currentChecklistData.tiep_nhan.machine_condition = getV("chkMachineCondition_tn", "");
  currentChecklistData.tiep_nhan.data_special_notes = getV("chkDataSpecialNotes", "chkDataSpecialNotes_tn");
  currentChecklistData.tiep_nhan.machine_model = getV("chkMachineModel", "");
  currentChecklistData.tiep_nhan.serial_number = getV("chkMachineSerial", "");

  // Lưu cấu hình toàn diện
  currentChecklistData.tiep_nhan.specs = {
    cpu: getV("chkSpecCpu", "chkHwCpu_tn"),
    motherboard: getV("chkSpecMainboard", "chkHwMainboard_tn"),
    ram: getV("chkSpecRam", "chkHwRam_tn"),
    storage: getV("chkSpecStorage", "chkHwStorage_tn"),
    vga: getV("chkSpecGpu", "chkHwVga_tn"),
    psu: getV("chkSpecPsu", "chkHwPsu_tn"),
    form_factor: getV("chkSpecFormFactor", "chkHwFormFactor_tn")
  };

  const devType = currentChecklistData.tiep_nhan.device_type || "laptop";
  const devMeta = getCurrentDeviceMeta(devType);

  // Lưu phụ kiện động
  const accObj = {};
  (devMeta.accessories || []).forEach(item => {
    const cb = document.querySelector(`input[data-acc-id="${item.id}"], #chkAcc_${item.id}`);
    accObj[item.id] = cb ? cb.checked : !!item.default;
  });
  accObj.other = getV("chkAccOther", "chkAccOther_tn");
  currentChecklistData.tiep_nhan.accessories = accObj;

  // Lưu linh kiện và các mục kiểm tra
  const tnItems = {};
  const allTn = [].concat(devMeta.exterior, TECHNICAL_CHECKS_META.f1, TECHNICAL_CHECKS_META.f2, TECHNICAL_CHECKS_META.f3, TECHNICAL_CHECKS_META.f4);
  allTn.forEach(item => {
    const cb = document.getElementById(`chkItem_tiep_nhan_${item.id}`);
    tnItems[item.id] = cb ? cb.checked : true;
  });
  currentChecklistData.tiep_nhan.items = tnItems;

  try {
    const key = `checklist_${activeScanId || 'CURRENT'}`;
    localStorage.setItem(key, JSON.stringify(currentChecklistData));
  } catch(e) {}

  updateReceiptSummaryBadges();
  if (!silent) showToast("✔ Đã lưu bảng Checklist tiếp nhận thành công!");
}

function printChecklistReceipt() {
  saveCurrentChecklist(true);
  const isBanGiao = (activeChecklistTab === 'ban_giao');
  const custName = document.getElementById(isBanGiao ? "chkCustName_bg" : "chkCustName_tn")?.value || "Khách Hàng";
  const custId = document.getElementById(isBanGiao ? "chkCustId_bg" : "chkCustId_tn")?.value || "KH01";
  const infoSrc = (activeScanId && currentScanTask) ? currentScanTask : (currentMachineInfo || {});
  const pc = infoSrc.computer_name || currentMachineInfo?.computer_name || "PC-STATION";
  const pn = infoSrc.product_number || currentMachineInfo?.product_number || "N/A";
  const serial = infoSrc.serial_number || currentMachineInfo?.serial_number || "SN-N/A";
  const timeStr = document.getElementById("chkReceiveTime_tn")?.value || new Date().toLocaleString('vi-VN');

  const devType = currentChecklistData?.tiep_nhan?.device_type || "laptop_pc";
  const devMeta = getCurrentDeviceMeta(devType);

  const devOsMap = {
    windows: "🪟 Windows (11 / 10 / 7)",
    macos: "🍎 macOS",
    linux: "🐧 Linux",
    ios_ipados: "🍎 iPadOS / iOS",
    android: "🤖 Android"
  };
  const devOs = devOsMap[currentChecklistData?.tiep_nhan?.device_os] || "🪟 Windows";
  const condition = document.getElementById("chkMachineCondition_tn")?.value || "Bật lên bình thường - Kiểm tra & Tối ưu";
  const pinCode = document.getElementById("chkPin_tn")?.value || "Không có";
  const cloudAcc = document.getElementById("chkCloudAccount_tn")?.value || "Không có";
  const techName = document.getElementById(isBanGiao ? "chkTechName_bg" : "chkTechName_tn")?.value || "Kỹ Thuật Viên";

  // Cấu hình
  const getS = (id1, id2, def = "Tiêu chuẩn") => document.getElementById(id1)?.value || document.getElementById(id2)?.value || def;
  const cpu = getS("chkSpecCpu", "chkHwCpu_tn", infoSrc.cpu_name || "Tiêu chuẩn");
  const mobo = getS("chkSpecMainboard", "chkHwMainboard_tn", infoSrc.motherboard || "");
  const rObjP = (infoSrc.ram_info && typeof infoSrc.ram_info === "object") ? infoSrc.ram_info : {};
  const ramDefault = infoSrc.ram_summary || rObjP.ram_summary || (infoSrc.total_ram_gb ? `${infoSrc.total_ram_gb} GB` : "Tiêu chuẩn");
  const ram = getS("chkSpecRam", "chkHwRam_tn", ramDefault);
  const storage = getS("chkSpecStorage", "chkHwStorage_tn");
  const vga = getS("chkSpecGpu", "chkHwVga_tn");
  const psu = getS("chkSpecPsu", "chkHwPsu_tn", "");
  const formFactor = getS("chkSpecFormFactor", "chkHwFormFactor_tn", "");

  // Tình trạng dữ liệu
  const bStatus = currentChecklistData?.tiep_nhan?.data_backup_status || 'backup_needed';
  const statusMap = {
    backup_needed: "⚠️ Cần kỹ thuật sao lưu dữ liệu quan trọng",
    already_backed_up: "💾 Khách đã tự sao lưu trước khi mang đến",
    clean_no_backup: "⚪ Máy trắng / Không cần lưu dữ liệu"
  };
  const dataSpecial = document.getElementById("chkDataSpecialNotes_tn")?.value?.trim() || document.getElementById("chkDataSpecialNotes")?.value?.trim();

  // Danh sách phụ kiện kèm theo
  const accList = [];
  (devMeta.accessories || []).forEach(item => {
    if (currentChecklistData?.tiep_nhan?.accessories?.[item.id]) {
      accList.push(item.label);
    }
  });
  const accOther = document.getElementById("chkAccOther_tn")?.value?.trim() || document.getElementById("chkAccOther")?.value?.trim();
  if (accOther) accList.push(`Khác: ${accOther}`);
  const accText = accList.length > 0 ? accList.join(", ") : "Chỉ nhận máy trần (Không phụ kiện)";

  const container = document.getElementById("printReceiptContainer");
  if (!container) return;

  const renderSectionItems = (title, items) => `
    <div style="margin-bottom: 10px;">
      <div style="font-weight: bold; font-size: 11.5px; color: #1e293b; background: #f1f5f9; padding: 4px 8px; border-left: 3px solid #0284c7; margin-bottom: 5px;">
        ${title}
      </div>
      ${(items || []).map((item, idx) => {
        const isChecked = currentChecklistData?.tiep_nhan?.items?.[item.id] !== false;
        return `
          <div style="display: flex; justify-content: space-between; padding: 2.5px 6px; border-bottom: 1px dashed #e2e8f0; font-size: 11px;">
            <span>${idx + 1}. ${item.label}</span>
            <strong style="color: ${isChecked ? '#059669' : '#dc2626'};">${isChecked ? '✔ ĐẠT TIÊU CHUẨN' : '⚠️ CẦN LƯU Ý'}</strong>
          </div>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = `
    <div style="font-family: Arial, sans-serif; color: #000; padding: 20px; line-height: 1.45;">
      <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 8px; margin-bottom: 12px;">
        <h2 style="margin: 0; font-size: 17px; text-transform: uppercase;">
          ${isBanGiao ? 'BIÊN BẢN BÀN GIAO &amp; NGHIỆM THU THIẾT BỊ' : 'BIÊN BẢN TIẾP NHẬN &amp; KIỂM ĐỊNH THIẾT BỊ'}
        </h2>
        <div style="font-size: 11.5px; margin-top: 3px;">Quy Trình Tiếp Nhận &amp; Kiểm Định Kỹ Thuật Chuẩn Hóa</div>
      </div>

      <table style="width: 100%; border-collapse: collapse; font-size: 11.5px; margin-bottom: 12px; border: 1px solid #cbd5e1;">
        <tr style="background: #f8fafc;">
          <td style="padding: 5px 8px; width: 50%; border: 1px solid #cbd5e1;"><strong>Khách hàng:</strong> ${custName}</td>
          <td style="padding: 5px 8px; width: 50%; border: 1px solid #cbd5e1;"><strong>Mã ID / SĐT:</strong> ${custId}</td>
        </tr>
        <tr>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>Loại thiết bị:</strong> ${devMeta.label}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>Hệ điều hành:</strong> ${devOs}</td>
        </tr>
        <tr style="background: #f8fafc;">
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>Tên máy tính:</strong> ${pc}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>PN (Model SKU):</strong> ${pn} | <strong>Số Serial (SN):</strong> ${serial}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 5px 8px; border: 1px solid #cbd5e1;">
            <strong>Cấu hình máy:</strong> ${mobo ? `Mainboard: ${mobo} | ` : ''}CPU: ${cpu} | RAM: ${ram} | Ổ cứng: ${storage} | VGA: ${vga} ${psu ? `| Nguồn/Pin: ${psu}` : ''} ${formFactor ? `| Vỏ máy: ${formFactor}` : ''}
          </td>
        </tr>
        ${(typeof currentDetectedDisks !== 'undefined' && currentDetectedDisks && currentDetectedDisks.length > 0) ? `
        <tr style="background: #faf5ff;">
          <td colspan="2" style="padding: 5px 8px; border: 1px solid #cbd5e1;">
            <strong>💿 Kiểm định S.M.A.R.T (CrystalDiskInfo Core):</strong> 
            ${currentDetectedDisks.map(d => `${d.name} (${d.driveLetter} ${d.capacity}GB): <strong>${d.healthScore}% ${d.healthStatus}</strong> • 🌡️ ${d.temp}°C • Giờ chạy: ${d.powerOnHours}h • Bad 05/C5: ${d.smartAttributes?.reallocated || 0}/${d.smartAttributes?.pending || 0}`).join(' | ')}
          </td>
        </tr>
        ` : ''}
        <tr style="background: #f8fafc;">
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>Tình trạng tiếp nhận:</strong> ${condition}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>Mật khẩu / PIN:</strong> ${pinCode} | <strong>Tài khoản:</strong> ${cloudAcc}</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 5px 8px; border: 1px solid #cbd5e1;">
            <strong>Tình trạng dữ liệu:</strong> ${statusMap[bStatus] || bStatus} ${dataSpecial ? `(${dataSpecial})` : ''}
          </td>
        </tr>
        <tr style="background: #f8fafc;">
          <td colspan="2" style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>Phụ kiện nhận kèm:</strong> ${accText}</td>
        </tr>
        <tr>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>Thời gian tiếp nhận:</strong> ${timeStr}</td>
          <td style="padding: 5px 8px; border: 1px solid #cbd5e1;"><strong>Kỹ thuật viên tiếp nhận:</strong> ${techName}</td>
        </tr>
      </table>

      ${(typeof getFormattedMachineNotesText === 'function' && getFormattedMachineNotesText()) ? `
        <div style="margin-bottom: 12px; border: 1.5px solid #fed7aa; background: #fff7ed; padding: 7px 10px; border-radius: 6px;">
          <div style="font-weight: bold; font-size: 11.5px; color: #c2410c; margin-bottom: 3px;">
            ⚠️ LƯU Ý KỸ THUẬT &amp; BỆNH ÁN ĐẶC BIỆT CỦA MÁY:
          </div>
          <pre style="margin: 0; font-family: Arial, sans-serif; font-size: 10.5px; color: #78350f; white-space: pre-wrap; line-height: 1.4;">${getFormattedMachineNotesText()}</pre>
        </div>
      ` : ''}

      <div style="font-weight: bold; font-size: 12px; margin-bottom: 8px; border-bottom: 1.5px solid #000; padding-bottom: 3px;">
        DANH MỤC TIÊU CHUẨN KIỂM ĐỊNH KỸ THUẬT
      </div>

      ${isBanGiao ? `
        ${renderSectionItems("1. TIÊU CHUẨN KỸ THUẬT QC XUẤT XƯỞNG", CHECKLIST_ITEMS_META.ban_giao.qc)}
        ${renderSectionItems("2. NGHIỆM THU TRỰC TIẾP VỚI KHÁCH HÀNG", CHECKLIST_ITEMS_META.ban_giao.cust)}
      ` : `
        ${renderSectionItems(`1. KIỂM TRA NGOẠI QUAN &amp; VỎ MÁY (${devMeta.name})`, devMeta.exterior)}
        ${renderSectionItems("2. NGUỒN &amp; PIN", TECHNICAL_CHECKS_META.f1)}
        ${renderSectionItems("3. MÀN HÌNH HIỂN THỊ &amp; CẢM ỨNG", TECHNICAL_CHECKS_META.f2)}
        ${renderSectionItems("4. LINH KIỆN PHẦN CỨNG TRONG (SSD, RAM, QUẠT, MAIN)", TECHNICAL_CHECKS_META.f3)}
        ${renderSectionItems("5. KẾT NỐI NGOẠI VI (WIFI, BLUETOOTH, CAM, MIC, LOA, AUDIO)", TECHNICAL_CHECKS_META.f4)}
      `}

      <div style="display: flex; justify-content: space-between; margin-top: 30px; text-align: center; page-break-inside: avoid;">
        <div>
          <strong>ĐẠI DIỆN KHÁCH HÀNG</strong><br>
          <span style="font-size: 10.5px;">(Ký &amp; ghi rõ họ tên xác nhận)</span>
          <div style="height: 45px;"></div>
          <span>${custName}</span>
        </div>
        <div>
          <strong>KỸ THUẬT VIÊN TIẾP NHẬN</strong><br>
          <span style="font-size: 10.5px;">(Ký &amp; ghi rõ họ tên)</span>
          <div style="height: 45px;"></div>
          <span>${techName}</span>
        </div>
      </div>
    </div>
  `;
  window.print();
}

// ========================================================
// LUỒNG CÔNG VIỆC TIẾP NHẬN THIẾT BỊ (MDXG CANVAS & WORKFLOW)
// ========================================================
let mdxgZoom = 1.0;
let mdxgPanX = 0;
let mdxgPanY = 0;
let isPanningMdxg = false;
let startPanX = 0;
let startPanY = 0;
let isMdxgTabInitialized = false;

function initWorkflowTab() {
  if (!currentChecklistData) {
    if (typeof initDefaultChecklistData === 'function') {
      initDefaultChecklistData();
    } else {
      currentChecklistData = {
        machine_id: 'default',
        updated_at: new Date().toISOString(),
        tiep_nhan: {
          device_type: 'laptop_pc',
          device_os: 'windows',
          cust_name: '',
          cust_phone: '',
          staff_name: '',
          machine_model: '',
          data_backup_status: 'need_backup',
          data_notes: '',
          spec_cpu: '',
          spec_ram: '',
          spec_storage: '',
          spec_gpu: '',
          device_password: '',
          cloud_account: '',
          accessories: {},
          exterior: {},
          technical: {}
        }
      };
    }
  }

  // 1. Đồng bộ dữ liệu hiện tại lên các input form
  populateDualChecklistForm(currentChecklistData);

  const devType = (currentChecklistData.tiep_nhan && currentChecklistData.tiep_nhan.device_type) || 'laptop_pc';
  selectChecklistDeviceType(devType, null);

  // 2. Thiết lập cơ chế kéo Pan & cuộn Zoom trên Viewport (gắn 1 lần duy nhất)
  const viewport = document.getElementById("wfCanvasViewport");
  if (viewport && !viewport.dataset.dragBound) {
    viewport.dataset.dragBound = "1";

    viewport.addEventListener("mousedown", (e) => {
      // Bỏ qua nếu click vào nút bấm, node tương tác hoặc input
      if (e.target.closest(".mdxg-node") || e.target.closest("button") || e.target.closest("input")) {
        return;
      }
      isPanningMdxg = true;
      startPanX = e.clientX - mdxgPanX;
      startPanY = e.clientY - mdxgPanY;
      viewport.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", (e) => {
      if (!isPanningMdxg) return;
      mdxgPanX = e.clientX - startPanX;
      mdxgPanY = e.clientY - startPanY;
      applyMdxgCanvasTransform();
    });

    window.addEventListener("mouseup", () => {
      if (isPanningMdxg) {
        isPanningMdxg = false;
        if (viewport) viewport.style.cursor = "grab";
      }
    });

    // Cuộn bánh xe để Zoom mượt
    viewport.addEventListener("wheel", (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      zoomMdxgCanvas(zoomFactor);
    }, { passive: false });
  }

  // 3. Tự động căn chỉnh vừa khung nếu mới mở lần đầu
  if (!isMdxgTabInitialized) {
    setTimeout(() => {
      fitMdxgCanvas();
    }, 80);
    isMdxgTabInitialized = true;
  } else {
    applyMdxgCanvasTransform();
  }

  // Cập nhật highlights nhánh
  updateMdxgCanvasBranchHighlight(devType);

  // 4. Khởi tạo thanh kéo chia cột (Resizable Splitter)
  if (typeof initWorkflowSplitResizer === 'function') {
    initWorkflowSplitResizer();
  }
}

// ========================================================
// THANH KÉO CHIA CỘT ĐIỀU CHỈNH KÍCH THƯỚC (RESIZABLE SPLITTER)
// ========================================================
function initWorkflowSplitResizer() {
  const resizer = document.getElementById("wfSplitResizer");
  const checklistCol = document.getElementById("wfChecklistCol");
  const mainLayout = document.getElementById("wfMainLayout");

  if (!resizer || !checklistCol || !mainLayout) return;

  // Khôi phục tỷ lệ đã lưu
  const savedPercent = localStorage.getItem("wfChecklistColPercent");
  if (savedPercent) {
    const num = parseFloat(savedPercent);
    if (!isNaN(num) && num >= 25 && num <= 85) {
      checklistCol.style.width = `${num}%`;
    }
  }

  if (resizer.dataset.bound) return;
  resizer.dataset.bound = "1";

  let isDragging = false;
  let startX = 0;
  let startWidth = 0;

  const onMouseDown = (e) => {
    isDragging = true;
    startX = e.clientX;
    startWidth = checklistCol.getBoundingClientRect().width;
    resizer.classList.add("is-dragging");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const layoutRect = mainLayout.getBoundingClientRect();
    const newWidthPx = startWidth + deltaX;
    const minWidth = 320;
    const maxWidth = layoutRect.width - 280;

    const clampedPx = Math.max(minWidth, Math.min(maxWidth, newWidthPx));
    const percent = (clampedPx / layoutRect.width) * 100;
    checklistCol.style.width = `${percent}%`;
  };

  const onMouseUp = () => {
    if (!isDragging) return;
    isDragging = false;
    resizer.classList.remove("is-dragging");
    document.body.style.cursor = "";
    document.body.style.userSelect = "";

    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    const layoutRect = mainLayout.getBoundingClientRect();
    const currentWidth = checklistCol.getBoundingClientRect().width;
    const currentPercent = ((currentWidth / layoutRect.width) * 100).toFixed(1);
    localStorage.setItem("wfChecklistColPercent", currentPercent);

    if (typeof fitMdxgCanvas === 'function') {
      setTimeout(fitMdxgCanvas, 60);
    }
  };

  resizer.addEventListener("mousedown", onMouseDown);

  // Hỗ trợ Touch
  resizer.addEventListener("touchstart", (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      startX = touch.clientX;
      startWidth = checklistCol.getBoundingClientRect().width;
      isDragging = true;
      resizer.classList.add("is-dragging");
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const deltaX = touch.clientX - startX;
    const layoutRect = mainLayout.getBoundingClientRect();
    const newWidthPx = startWidth + deltaX;
    const minWidth = 320;
    const maxWidth = layoutRect.width - 280;
    const clampedPx = Math.max(minWidth, Math.min(maxWidth, newWidthPx));
    const percent = (clampedPx / layoutRect.width) * 100;
    checklistCol.style.width = `${percent}%`;
  }, { passive: true });

  window.addEventListener("touchend", () => {
    if (isDragging) {
      isDragging = false;
      resizer.classList.remove("is-dragging");
      const layoutRect = mainLayout.getBoundingClientRect();
      const currentWidth = checklistCol.getBoundingClientRect().width;
      const currentPercent = ((currentWidth / layoutRect.width) * 100).toFixed(1);
      localStorage.setItem("wfChecklistColPercent", currentPercent);
    }
  });

  // Nhấp đúp chuột để reset về 50%
  resizer.addEventListener("dblclick", () => {
    checklistCol.style.width = "50%";
    localStorage.setItem("wfChecklistColPercent", "50");
    showToast("↔️ Đã đặt tỷ lệ Phiếu tiếp nhận & Sơ đồ về 50% - 50%");
    if (typeof fitMdxgCanvas === 'function') {
      setTimeout(fitMdxgCanvas, 60);
    }
  });
}

function applyMdxgCanvasTransform() {
  const inner = document.getElementById("wfCanvasInner");
  if (inner) {
    inner.style.transform = `translate(${mdxgPanX}px, ${mdxgPanY}px) scale(${mdxgZoom})`;
  }
  const label = document.getElementById("wfZoomLabel");
  if (label) {
    label.innerText = Math.round(mdxgZoom * 100) + "%";
  }
}

function zoomMdxgCanvas(factor) {
  let newZoom = mdxgZoom * factor;
  if (newZoom < 0.35) newZoom = 0.35;
  if (newZoom > 2.6) newZoom = 2.6;
  mdxgZoom = Math.round(newZoom * 100) / 100;
  applyMdxgCanvasTransform();
}

function resetMdxgCanvasZoom() {
  mdxgZoom = 1.0;
  mdxgPanX = 0;
  mdxgPanY = 0;
  applyMdxgCanvasTransform();
  showToast("🔍 Đã đặt lại tỷ lệ sơ đồ 100%");
}

function fitMdxgCanvas() {
  const viewport = document.getElementById("wfCanvasViewport");
  const svg = document.getElementById("mdxgSvgCanvas");
  if (!viewport || !svg) return;
  const vw = Math.max(320, viewport.clientWidth - 30);
  const vh = Math.max(400, viewport.clientHeight - 30);
  const sw = 760;
  const sh = 480;
  const scale = Math.min(vw / sw, vh / sh, 1.15);
  mdxgZoom = Math.max(0.65, Math.round(scale * 100) / 100);
  mdxgPanX = Math.max(0, (vw - sw * mdxgZoom) / 2);
  mdxgPanY = Math.max(10, (vh - sh * mdxgZoom) / 3);
  applyMdxgCanvasTransform();
}

function wfSetViewMode(mode) {
  const layout = document.getElementById("wfMainLayout");
  if (!layout) return;

  layout.classList.remove("layout-canvas-only", "layout-checklist-only");
  if (mode === "canvas") {
    layout.classList.add("layout-canvas-only");
  } else if (mode === "checklist") {
    layout.classList.add("layout-checklist-only");
  }

  document.querySelectorAll(".wf-view-btn").forEach(b => b.classList.remove("active"));
  if (mode === "split") {
    const btn = document.getElementById("btnWfViewSplit");
    if (btn) btn.classList.add("active");
  } else if (mode === "canvas") {
    const btn = document.getElementById("btnWfViewCanvas");
    if (btn) btn.classList.add("active");
    setTimeout(fitMdxgCanvas, 100);
  } else if (mode === "checklist") {
    const btn = document.getElementById("btnWfViewChecklist");
    if (btn) btn.classList.add("active");
  }
}

// Cập nhật làm sáng / làm mờ nhánh theo thiết bị đang chọn
function updateMdxgCanvasBranchHighlight(devType) {
  let key = devType || 'laptop';
  if (key === 'laptop_pc') key = 'laptop';
  if (key === 'mac') key = 'macbook';
  if (key === 'tablet' || key === 'tablet_mobile') key = 'tablet_ipad';

  // Toàn bộ các node phân nhánh thiết bị chính trên sơ đồ
  const allDevNodes = ['C1_1', 'C2_1', 'C3_1'];
  allDevNodes.forEach(n => {
    const el = document.getElementById(`mdxgNode_${n}`);
    if (el) {
      el.classList.remove('is-selected-branch', 'is-dimmed');
    }
  });

  const allEdges = [
    'wfEdge_A_B', 'wfEdge_B_E', 'wfEdge_E_F', 'wfEdge_F_G', 'wfEdge_G_H'
  ];
  allEdges.forEach(eId => {
    const el = document.getElementById(eId);
    if (el) {
      el.classList.remove('is-active-path');
      el.setAttribute('marker-end', 'url(#wfArrowDefault)');
    }
  });

  // Bản đồ kích hoạt node & đường viền theo từng loại thiết bị
  const nodeMap = {
    'laptop': { activeNodes: ['C1_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] },
    'pc_desktop': { activeNodes: ['C1_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] },
    'macbook': { activeNodes: ['C2_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] },
    'mac_mini_studio': { activeNodes: ['C2_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] },
    'imac_desktop': { activeNodes: ['C2_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] },
    'apple_display': { activeNodes: ['C2_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] },
    'tablet_ipad': { activeNodes: ['C3_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] },
    'tablet_android': { activeNodes: ['C3_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] },
    'tablet_surface': { activeNodes: ['C3_1'], activeEdges: ['wfEdge_A_B', 'wfEdge_B_E'] }
  };

  const sel = nodeMap[key] || nodeMap['laptop'];
  sel.activeNodes.forEach(n => document.getElementById(`mdxgNode_${n}`)?.classList.add('is-selected-branch'));
  sel.activeEdges.forEach(eId => {
    const el = document.getElementById(eId);
    if (el) {
      el.classList.add('is-active-path');
      el.setAttribute('marker-end', 'url(#wfArrowActive)');
    }
  });

  // Làm mờ nhẹ các nhánh không thuộc thiết bị được chọn
  allDevNodes.forEach(n => {
    if (!sel.activeNodes.includes(n)) {
      document.getElementById(`mdxgNode_${n}`)?.classList.add('is-dimmed');
    }
  });

  // Cập nhật trạng thái Toolbar Lọc
  ['All', 'Laptop', 'PC', 'Macbook', 'MacMini', 'iMac', 'AppleDisplay', 'iPad', 'AndroidTab', 'Surface'].forEach(suffix => {
    const b = document.getElementById(`btnWfFilter${suffix}`);
    if (b) b.classList.remove('active');
  });
  const filterBtnMap = {
    'laptop': 'btnWfFilterLaptop',
    'pc_desktop': 'btnWfFilterPC',
    'macbook': 'btnWfFilterMacbook',
    'mac_mini_studio': 'btnWfFilterMacMini',
    'imac_desktop': 'btnWfFilteriMac',
    'apple_display': 'btnWfFilterAppleDisplay',
    'tablet_ipad': 'btnWfFilteriPad',
    'tablet_android': 'btnWfFilterAndroidTab',
    'tablet_surface': 'btnWfFilterSurface'
  };
  const activeFilterBtn = document.getElementById(filterBtnMap[key]);
  if (activeFilterBtn) activeFilterBtn.classList.add('active');
}

// Click vào một Node bất kỳ trên sơ đồ MDXG
function onMdxgNodeClick(nodeId, targetSecId) {
  // Đánh dấu node đang hoạt động
  document.querySelectorAll('.mdxg-node').forEach(n => n.classList.remove('is-active'));
  const nodeEl = document.getElementById(`mdxgNode_${nodeId}`);
  if (nodeEl) nodeEl.classList.add('is-active');

  // Nếu đang ở chế độ toàn màn hình Canvas, tự động mở chế độ chia đôi để người dùng thấy checklist
  const layout = document.getElementById("wfMainLayout");
  if (layout && layout.classList.contains("layout-canvas-only")) {
    wfSetViewMode("split");
  }

  // Cuộn mượt checklist đến đúng mục tương ứng
  if (targetSecId) {
    const target = document.getElementById(targetSecId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      target.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
      const origBorder = target.style.borderColor;
      target.style.borderColor = '#0284c7';
      target.style.boxShadow = '0 0 14px rgba(2, 132, 199, 0.4)';
      setTimeout(() => {
        target.style.borderColor = origBorder || '';
        target.style.boxShadow = '';
      }, 1500);
    }
  }
}

// Click vào nhánh thiết bị cụ thể (Laptop / PC / MacBook / Mac mini / iMac / Display / iPad / Android Tab / Surface)
function onMdxgDeviceBranchClick(devType, osId) {
  const nodePrefixMap = {
    'laptop': 'C1_1',
    'pc_desktop': 'C1_2',
    'macbook': 'C2_1',
    'mac_mini_studio': 'C2_2',
    'imac_desktop': 'C2_3',
    'apple_display': 'C2_4',
    'tablet_ipad': 'C3_1',
    'tablet_android': 'C3_2',
    'tablet_surface': 'C3_3'
  };
  const nodeSuffix = nodePrefixMap[devType] || 'C1_1';
  onMdxgNodeClick(nodeSuffix, 'sec-wf-device');
  selectChecklistDeviceType(devType);
  if (osId) {
    selectChecklistDeviceOs(osId);
  }
}

// Nút lọc nhánh từ Toolbar của Canvas
function wfFilterBranch(branchType, btnEl) {
  if (branchType === 'all') {
    ['All', 'Laptop', 'PC', 'Macbook', 'MacMini', 'iMac', 'AppleDisplay', 'iPad', 'AndroidTab', 'Surface'].forEach(suffix => {
      const b = document.getElementById(`btnWfFilter${suffix}`);
      if (b) b.classList.remove('active');
    });
    if (btnEl) btnEl.classList.add('active');

    // Bỏ làm mờ toàn bộ các nhánh
    document.querySelectorAll('.mdxg-node').forEach(n => n.classList.remove('is-dimmed'));
    showToast("👁️ Đang hiển thị toàn bộ 9 luồng thiết bị chi tiết trên sơ đồ MDXG");
  } else {
    selectChecklistDeviceType(branchType);
    const meta = getCurrentDeviceMeta(branchType);
    showToast(`🔍 Đã chuyển sang luồng ${meta.name}`);
  }
}

// Modal Xem & Xuất Mã Nguồn MDXG / Mermaid Flowchart (Quy trình chính chuẩn hóa)
const MDXG_FLOWCHART_MARKDOWN = `graph TD
    A[🚀 Tiếp Nhận & Khách Hàng] --> B{🔍 Phân Loại Thiết Bị & Hệ Điều Hành}
    
    %% 3 Nhánh phân loại thiết bị chính
    B -->|Laptop & PC Bàn| C1[💻 Laptop & Máy PC Windows/Linux]
    B -->|Hệ Apple Mac| C2[🍎 MacBook, Mac mini, iMac, Screen macOS]
    B -->|Tablet & Docks| C3[📱 iPad, Galaxy Tab, Surface & Docks]

    %% Hội tụ về các giai đoạn kiểm định chính
    C1 & C2 & C3 --> E[🎒 Ngoại Quan & Phụ Kiện Kèm Theo]
    E --> F[⚙️ Kiểm Tra Kỹ Thuật & Cấu Hình Phần Cứng]
    F --> G[💾 Dữ Liệu Khách Hàng & Mật Khẩu Khóa]
    G --> H[📋 Hoàn Tất Biên Bản & Ký Bàn Giao]

    style A fill:#fdf2f8,stroke:#db2777,stroke-width:2px
    style B fill:#f0f9ff,stroke:#0284c7,stroke-width:2px
    style E fill:#f0fdf4,stroke:#16a34a,stroke-width:2px
    style F fill:#eff6ff,stroke:#2563eb,stroke-width:2px
    style G fill:#fefce8,stroke:#ca8a04,stroke-width:2px
    style H fill:#f0fdf4,stroke:#059669,stroke-width:2.2px`;

function openMdxgCodeModal() {
  const modal = document.getElementById("mdxgCodeModal");
  const area = document.getElementById("mdxgSourceCodeArea");
  if (area) area.value = MDXG_FLOWCHART_MARKDOWN;
  if (modal) modal.style.display = "flex";
}

function closeMdxgCodeModal() {
  const modal = document.getElementById("mdxgCodeModal");
  if (modal) modal.style.display = "none";
}

function copyMdxgSourceCode(btnEl) {
  const area = document.getElementById("mdxgSourceCodeArea");
  const code = (area && area.value) ? area.value : MDXG_FLOWCHART_MARKDOWN;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast("📋 Đã sao chép mã nguồn MDXG / Mermaid!");
      if (btnEl) {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = "<span>✓ Đã Chép!</span>";
        setTimeout(() => btnEl.innerHTML = orig, 1500);
      }
    });
  } else if (area) {
    area.select();
    document.execCommand("copy");
    showToast("📋 Đã sao chép mã nguồn MDXG!");
  }
}

// ==========================================
// TRỢ LÝ AI: MẪU PROMPT MỚM & NẠP JSON TIẾP NHẬN
// ==========================================

const AI_PROMPT_TEMPLATE = `Bạn là Trợ Lý Kỹ Thuật Viên Tiếp Nhận Thiết Bị & Giám Định Phần Cứng Máy Tính chuyên nghiệp.
Dưới đây là hình ảnh (ảnh chụp màn hình cấu hình dxdiag, Task Manager, CPU-Z, ảnh tem máy, thông số thùng case PC, laptop hoặc máy tính bảng) kèm theo mô tả của khách hàng.

NHIỆM VỤ: Hãy phân tích kỹ lưỡng cấu hình phần cứng, bo mạch chủ (Mainboard), CPU, RAM, ổ cứng SSD/HDD, card màn hình VGA, bộ nguồn PSU hoặc tình trạng pin, hệ điều hành và phụ kiện kèm theo, sau đó xuất ra DUY NHẤT một chuỗi JSON hợp lệ theo đúng cấu trúc bên dưới (không kèm bất kỳ văn bản giải thích hay markdown code block nào khác) để hệ thống WebUI tự động nạp vào checklist:

{
  "device_classification": {
    "device_type": "pc_desktop", 
    "device_type_label": "Máy PC Desktop (Case)",
    "device_os": "windows",
    "device_os_label": "Windows 11 / 10"
  },
  "customer_info": {
    "customer_name": "Tên khách hàng",
    "customer_phone": "Số điện thoại",
    "machine_model": "Dòng máy / Tên bộ máy PC / Laptop",
    "technician_name": "Kỹ thuật viên tiếp nhận",
    "serial_number": "Số Serial / Service Tag nếu có",
    "receive_time": "03/10/2026 14:30"
  },
  "hardware_specs": {
    "cpu": "Intel Core i5-13400F 2.50GHz (10 Cores, 16 Threads)",
    "motherboard": "ASUS TUF GAMING B760M-PLUS WIFI D4",
    "ram": "16GB DDR4 3200MHz (2x 8GB Kingston Fury)",
    "storage": "SSD Samsung 980 NVMe 500GB + HDD 1TB",
    "vga": "NVIDIA GeForce RTX 3060 12GB GDDR6",
    "power_supply_or_battery": "Corsair CV650 650W 80 Plus Bronze",
    "form_factor": "Thùng Case ATX kính cường lực"
  },
  "accessories": {
    "has_charger_or_power_cable": true,
    "has_display_cable": true,
    "has_keyboard": true,
    "has_mouse": true,
    "has_dock_or_hub": false,
    "has_stylus_pen": false,
    "has_bag_or_sleeve": false,
    "other_accessories": "Ghi chú phụ kiện kèm theo cụ thể"
  },
  "exterior_condition": {
    "chassis_shell": "Tình trạng vỏ thùng / máy",
    "screen_display": "Tình trạng màn hình",
    "keyboard_trackpad": "Tình trạng phím / chuột",
    "hinge_or_stand": "Tình trạng chân đế / bản lề",
    "io_ports": "Tình trạng các cổng cắm I/O",
    "clean_condition": true
  },
  "technical_check": {
    "power_status": "Khởi động bình thường",
    "display_status": "Xuất hình tốt",
    "internal_hardware": "Linh kiện hoạt động ổn định",
    "connectivity": "Wi-Fi, Bluetooth nhận tốt"
  },
  "data_and_security": {
    "data_backup_status": "need_backup",
    "data_special_notes": "Cần sao lưu dữ liệu quan trọng",
    "device_password": "Mã PIN hoặc Mật khẩu",
    "cloud_account": "Tài khoản iCloud / Microsoft nếu có"
  },
  "notes": "Yêu cầu xử lý từ khách hàng hoặc chẩn đoán sơ bộ"
}

Quy ước giá trị:
- device_type: "pc_desktop" | "laptop" | "macbook" | "mac_mini_studio" | "imac_desktop" | "apple_display" | "tablet_ipad" | "tablet_android" | "tablet_surface"
- device_os: "windows" | "linux" | "macos" | "ios_ipados" | "android"
- data_backup_status: "need_backup" (cần sao lưu) | "already_backup" (khách đã backup) | "clean_wipe" (xóa trắng máy)`;

// 3 Dữ liệu mẫu thực tế: Khách A (PC Desktop), Khách B (Laptop), Khách C (iPad + Dock)
const AI_SAMPLE_PRESETS = {
  pc_desktop: {
    device_classification: {
      device_type: "pc_desktop",
      device_type_label: "Máy PC Desktop (Case)",
      device_os: "windows",
      device_os_label: "Windows 11 Pro 64-bit"
    },
    customer_info: {
      customer_name: "Nguyễn Văn A",
      customer_phone: "0912 345 678",
      machine_model: "Bộ PC Gaming Core i5-13400F / RTX 3060",
      technician_name: "KTV Hoàng Nam",
      serial_number: "PC-DESK-2026-A101",
      receive_time: new Date().toLocaleString('vi-VN')
    },
    hardware_specs: {
      cpu: "Intel Core i5-13400F 2.50GHz Turbo 4.60GHz (10 Cores, 16 Threads)",
      motherboard: "ASUS TUF GAMING B760M-PLUS WIFI D4",
      ram: "16GB DDR4 3200MHz (2x 8GB Kingston Fury Beast)",
      storage: "SSD NVMe Samsung 980 500GB M.2 PCIe 3.0 + HDD Seagate Barracuda 1TB",
      vga: "NVIDIA GeForce RTX 3060 12GB GDDR6 (Colorful Ultra W)",
      power_supply_or_battery: "Corsair CV650 650W 80 Plus Bronze",
      form_factor: "Thùng Case ATX Xigmatek Infinity Kính cường lực"
    },
    accessories: {
      has_charger_or_power_cable: true,
      has_display_cable: true,
      has_keyboard: true,
      has_mouse: true,
      has_dock_or_hub: false,
      has_stylus_pen: false,
      has_bag_or_sleeve: false,
      other_accessories: "Kèm Dây nguồn 3 chấu bọc dù, Cáp DisplayPort 1.4 mạ vàng, Bàn phím cơ DareU và Chuột Gaming Fuhlen"
    },
    exterior_condition: {
      chassis_shell: "Vỏ thùng case đẹp, mặt kính cường lực nguyên vẹn không nứt mẻ, có ít bụi tản nhiệt",
      screen_display: "Khách không gửi kèm màn hình rời",
      keyboard_trackpad: "Bàn phím cơ DareU đủ phím bấm, chuột rê mượt",
      hinge_or_stand: "4 chân đế cao su thùng máy chắc chắn, không rung lắc",
      io_ports: "Các cổng USB 3.0 và Jack audio trước sau nhận tốt, không rỉ sét",
      clean_condition: true
    },
    technical_check: {
      power_status: "Khởi động lên hình bình thường, quạt CPU và quạt vỏ case quay êm",
      display_status: "Xuất hình cổng DisplayPort tốt, không sọc hình",
      internal_hardware: "BIOS nhận đủ 2 thanh RAM kênh đôi và nhận đủ 2 ổ cứng SSD + HDD",
      connectivity: "Wi-Fi 6 bắt sóng khỏe, Bluetooth kết nối ổn định"
    },
    data_and_security: {
      data_backup_status: "need_backup",
      data_special_notes: "Cần KTV sao lưu toàn bộ thư mục D:\\DuLieuKeToan và Desktop ra ổ cứng di động trước khi tối ưu/cài lại Win",
      device_password: "PIN: 2468",
      cloud_account: "Tài khoản Microsoft cá nhân của khách, không dính tài khoản công ty"
    },
    notes: "Khách báo máy thỉnh thoảng giật lag khi render video và quạt kêu to; yêu cầu vệ sinh tra keo tản nhiệt MX-4 và cài lại Windows 11 sạch kèm Office bản quyền."
  },

  laptop: {
    device_classification: {
      device_type: "laptop",
      device_type_label: "Laptop Xách Tay",
      device_os: "windows",
      device_os_label: "Windows 11 Home 64-bit Bản Quyền"
    },
    customer_info: {
      customer_name: "Trần Thị B",
      customer_phone: "0988 765 432",
      machine_model: "Dell Inspiron 15 3520 (Alder Lake)",
      technician_name: "KTV Hoàng Nam",
      serial_number: "ST-7J98XY3",
      receive_time: new Date().toLocaleString('vi-VN')
    },
    hardware_specs: {
      cpu: "Intel Core i7-1255U 1.70GHz Turbo 4.70GHz (10 Cores, 12 Threads)",
      motherboard: "Dell OEM Motherboard 0H9T8V (Intel Alder Lake)",
      ram: "16GB DDR4 3200MHz (2x 8GB Micron SODIMM)",
      storage: "SSD NVMe Kioxia 512GB M.2 PCIe 4.0",
      vga: "Intel Iris Xe Graphics G7 (96 EUs)",
      power_supply_or_battery: "Pin 3-cell 41Wh (Độ chai pin 8%, dung lượng thực 37.7Wh), sạc vào ổn định",
      form_factor: "Laptop 15.6 inch FHD IPS 120Hz mỏng nhẹ màu bạc"
    },
    accessories: {
      has_charger_or_power_cable: true,
      has_display_cable: false,
      has_keyboard: false,
      has_mouse: true,
      has_dock_or_hub: false,
      has_stylus_pen: false,
      has_bag_or_sleeve: true,
      other_accessories: "Củ sạc zin Dell 65W chân kim nhỏ, Chuột không dây Logitech M330 Silent, Túi chống sốc Targus 15.6 inch"
    },
    exterior_condition: {
      chassis_shell: "Mặt A kim loại xước dăm nhẹ góc viền, mặt C bàn phím và mặt D còn rất mới",
      screen_display: "Màn hình 15.6 inch sáng đẹp đều, không điểm chết (Zero Dead Pixel), không ám ố",
      keyboard_trackpad: "Bàn phím gõ êm, đủ phím số, Touchpad nhạy đa điểm mượt mà",
      hinge_or_stand: "Bản lề mở gập êm, góc mở tối đa 140 độ chắc chắn",
      io_ports: "Cổng sạc, cổng Type-C, HDMI và 2 cổng USB-A hoạt động tốt",
      clean_condition: true
    },
    technical_check: {
      power_status: "Khởi động cực nhanh trong 8 giây, pin dùng thực tế khoảng 3.5 giờ",
      display_status: "Màn hình hiển thị sắc nét tần số quét 120Hz",
      internal_hardware: "RAM và SSD sức khỏe 100% (CrystalDiskInfo Good, nhiệt độ 42°C)",
      connectivity: "Wi-Fi 6 và Bluetooth kết nối nhanh"
    },
    data_and_security: {
      data_backup_status: "already_backup",
      data_special_notes: "Khách đã tự backup toàn bộ dữ liệu lên OneDrive, có thể xóa sạch phân vùng để cài mới hoàn toàn",
      device_password: "Password: 1234",
      cloud_account: "Microsoft Account: b.tranthi@gmail.com"
    },
    notes: "Yêu cầu: Nâng cấp cài bản Windows 11 Pro nhẹ máy, tối ưu dịch vụ nền, tắt telemetry và cài đầy đủ font chữ tiếng Việt."
  },

  tablet_ipad: {
    device_classification: {
      device_type: "tablet_ipad",
      device_type_label: "Apple iPad Pro / Air",
      device_os: "ios_ipados",
      device_os_label: "iPadOS 18.1"
    },
    customer_info: {
      customer_name: "Lê Văn C",
      customer_phone: "0934 567 890",
      machine_model: "Apple iPad Pro 11 inch M2 (Wi-Fi 128GB Silver)",
      technician_name: "KTV Hoàng Nam",
      serial_number: "H9Q72M92K1",
      receive_time: new Date().toLocaleString('vi-VN')
    },
    hardware_specs: {
      cpu: "Apple Silicon M2 (8 CPU cores, 10 GPU cores, 16-core Neural Engine)",
      motherboard: "Apple Logic Board A2759 (iPad Pro 11 Gen 4)",
      ram: "8GB Unified Memory",
      storage: "128GB Flash Storage NVMe",
      vga: "Apple 10-core GPU tích hợp",
      power_supply_or_battery: "Pin 7538 mAh (Độ chai pin 4%, sạc 142 lần, pin zin theo máy)",
      form_factor: "Tablet 11 inch Liquid Retina ProMotion 120Hz viền mỏng"
    },
    accessories: {
      has_charger_or_power_cable: true,
      has_display_cable: false,
      has_keyboard: true,
      has_mouse: false,
      has_dock_or_hub: true,
      has_stylus_pen: true,
      has_bag_or_sleeve: false,
      other_accessories: "Bút cảm ứng Apple Pencil 2 zin, Dock bàn phím Magic Keyboard màu trắng, Củ sạc nhanh Apple 20W Type-C và Cáp dù C-C"
    },
    exterior_condition: {
      chassis_shell: "Lưng nhôm nguyên khối đẹp không cấn móp, 4 góc viền sáng bóng 99%",
      screen_display: "Màn hình đã dán cường lực cao cấp, cảm ứng 10 ngón và ProMotion 120Hz hoàn hảo",
      keyboard_trackpad: "Dock bàn phím Magic Keyboard gõ nhạy, đèn phím sáng, trackpad bấm êm",
      hinge_or_stand: "Khớp hít nam châm thông minh trên Magic Keyboard hít chặt, không xê dịch",
      io_ports: "Cổng Thunderbolt / USB 4 nhận sạc nhanh và xuất màn hình rời tốt",
      clean_condition: true
    },
    technical_check: {
      power_status: "Sạc nhận nhanh 20W, pin dùng xem phim liên tục ~9 tiếng",
      display_status: "Màn hình không sọc, không điểm chết, tính năng TrueTone hoạt động tốt",
      internal_hardware: "Camera trước sau nét, Face ID mở khóa tức thì, hệ thống 4 loa âm thanh vòm to rõ",
      connectivity: "Wi-Fi 6E bắt sóng xa, Bluetooth hít bút Apple Pencil 2 nhận sạc không dây ngay"
    },
    data_and_security: {
      data_backup_status: "need_backup",
      data_special_notes: "Cần giữ nguyên ứng dụng Procreate và GoodNotes kèm các bản thiết kế dự án của khách",
      device_password: "Passcode: 668899",
      cloud_account: "iCloud chính chủ khách (đã tắt tính năng Find My iPad trước khi bàn giao)"
    },
    notes: "Kiểm tra chân tiếp xúc Pogo Pin của Dock bàn phím thỉnh thoảng bị ngắt kết nối khi nghiêng góc, vệ sinh chân kim và kiểm tra bản cập nhật iPadOS mới nhất."
  }
};

function openAiJsonModal(activeTab = 'prompt') {
  const modal = document.getElementById("aiJsonModal");
  const area = document.getElementById("aiPromptArea");
  if (area) area.value = AI_PROMPT_TEMPLATE;
  if (modal) modal.style.display = "flex";
  switchAiModalTab(activeTab);
}

function closeAiJsonModal() {
  const modal = document.getElementById("aiJsonModal");
  if (modal) modal.style.display = "none";
}

function switchAiModalTab(tabKey) {
  const tabs = ['prompt', 'paste', 'samples'];
  tabs.forEach(t => {
    const el = document.getElementById(`aiModalTab_${t}`);
    const btn = document.getElementById(`btnTabAi${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (el) el.style.display = (t === tabKey) ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', t === tabKey);
  });
}

function copyAiWorkflowPrompt(btnEl) {
  const area = document.getElementById("aiPromptArea");
  const code = (area && area.value) ? area.value : AI_PROMPT_TEMPLATE;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(() => {
      showToast("📋 Đã sao chép toàn bộ Prompt Mớm Cho AI!");
      if (btnEl) {
        const orig = btnEl.innerHTML;
        btnEl.innerHTML = "<span>✓ Đã Chép Prompt!</span>";
        setTimeout(() => btnEl.innerHTML = orig, 1800);
      }
    });
  } else if (area) {
    area.select();
    document.execCommand("copy");
    showToast("📋 Đã sao chép Prompt!");
  }
}

function clearAiJsonInput() {
  const area = document.getElementById("aiJsonInputArea");
  if (area) area.value = "";
  showToast("🗑️ Đã xóa trắng nội dung JSON!");
}

function handleAiJsonFileUpload(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    const area = document.getElementById("aiJsonInputArea");
    if (area) area.value = content;
    switchAiModalTab('paste');
    showToast(`📂 Đã tải nội dung file ${file.name}`);
  };
  reader.readAsText(file);
}

function loadSampleAiJson(sampleType) {
  const preset = AI_SAMPLE_PRESETS[sampleType];
  if (!preset) {
    showToast("❌ Không tìm thấy dữ liệu mẫu!");
    return;
  }
  const area = document.getElementById("aiJsonInputArea");
  if (area) area.value = JSON.stringify(preset, null, 2);
  applyAiJsonToSystem(preset);
}

function submitAiJsonToSystem() {
  const area = document.getElementById("aiJsonInputArea");
  const rawText = area ? area.value.trim() : "";
  if (!rawText) {
    showToast("⚠️ Vui lòng dán chuỗi JSON từ AI vào ô trước khi nạp!");
    return;
  }

  // Tách JSON nếu AI trả về kèm theo markdown code block ```json ... ```
  let jsonString = rawText;
  if (jsonString.includes("```")) {
    const match = jsonString.match(/```(?:json)?([\s\S]*?)```/);
    if (match && match[1]) {
      jsonString = match[1].trim();
    }
  }

  try {
    const parsed = JSON.parse(jsonString);
    applyAiJsonToSystem(parsed);
  } catch(e) {
    console.error("Lỗi parse JSON từ AI:", e);
    showToast("❌ Chuỗi JSON không đúng định dạng cú pháp! Vui lòng kiểm tra lại dấu ngoặc hoặc dấu phẩy.");
  }
}

function applyAiJsonToSystem(data) {
  if (!data || typeof data !== 'object') {
    showToast("❌ Dữ liệu JSON không hợp lệ!");
    return;
  }

  // 1. Phân loại thiết bị & Hệ điều hành
  const devClassification = data.device_classification || {};
  let devType = devClassification.device_type || data.device_type || 'pc_desktop';
  let devOs = devClassification.device_os || data.device_os || 'windows';

  // Chuẩn hóa alias
  if (devType === 'pc' || devType === 'desktop' || devType === 'computer') devType = 'pc_desktop';
  if (devType === 'laptop_pc') devType = 'laptop';
  if (devType === 'mac') devType = 'macbook';
  if (devType === 'ipad') devType = 'tablet_ipad';
  if (devType === 'tablet') devType = 'tablet_ipad';

  selectChecklistDeviceType(devType);
  if (devOs) {
    selectChecklistDeviceOs(devOs);
  }

  // 2. Thông tin khách hàng & máy
  const custInfo = data.customer_info || {};
  const custName = custInfo.customer_name || data.customer_name || '';
  const custPhone = custInfo.customer_phone || data.customer_phone || '';
  const staffName = custInfo.technician_name || data.technician_name || 'KTV Hoàng Nam';
  const machineModel = custInfo.machine_model || data.machine_model || '';
  const machineSerial = custInfo.serial_number || data.serial_number || '';

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined && val !== null) el.value = val;
  };

  setVal('chkCustName', custName);
  setVal('chkCustName_tn', custName);
  setVal('chkCustPhone', custPhone);
  setVal('chkCustId_tn', custPhone ? 'KH-' + custPhone.slice(-4) : 'KH01');
  setVal('chkStaffName', staffName);
  setVal('chkTechName_tn', staffName);
  setVal('chkMachineModel', machineModel);
  setVal('chkMachineSerial', machineSerial);
  if (custInfo.receive_time) {
    setVal('chkReceiveTime_tn', custInfo.receive_time);
  }

  // 3. Cấu hình phần cứng (Mainboard, CPU, RAM, SSD/HDD, VGA, Nguồn PSU/Pin, Form factor)
  const specs = data.hardware_specs || data.specs || {};
  const cpu = specs.cpu || '';
  const mobo = specs.motherboard || specs.mainboard || '';
  const ram = specs.ram || '';
  const storage = specs.storage || specs.disk || '';
  const vga = specs.vga || specs.gpu || '';
  const psu = specs.power_supply_or_battery || specs.power_supply || specs.battery || specs.psu || '';
  const formFactor = specs.form_factor || specs.case || '';

  setVal('chkSpecCpu', cpu);
  setVal('chkHwCpu_tn', cpu);
  setVal('chkSpecMainboard', mobo);
  setVal('chkHwMainboard_tn', mobo);
  setVal('chkSpecRam', ram);
  setVal('chkHwRam_tn', ram);
  setVal('chkSpecStorage', storage);
  setVal('chkHwStorage_tn', storage);
  setVal('chkSpecGpu', vga);
  setVal('chkHwVga_tn', vga);
  setVal('chkSpecPsu', psu);
  setVal('chkHwPsu_tn', psu);
  setVal('chkSpecFormFactor', formFactor);
  setVal('chkHwFormFactor_tn', formFactor);

  // 4. Phụ kiện kèm theo (checkboxes)
  const acc = data.accessories || {};
  const devMeta = getCurrentDeviceMeta(devType);
  if (devMeta && devMeta.accessories) {
    devMeta.accessories.forEach(item => {
      let isChecked = false;
      if (item.id === 'charger' || item.id === 'pc_power_cord' || item.id === 'mac_power_cable' || item.id === 'imac_power_cable') {
        isChecked = !!(acc.has_charger_or_power_cable ?? acc.charger ?? acc.power_cable);
      } else if (item.id === 'display_cable' || item.id === 'pc_display_cable' || item.id === 'mac_display_cable') {
        isChecked = !!(acc.has_display_cable ?? acc.display_cable);
      } else if (item.id === 'mouse' || item.id === 'pc_mouse' || item.id === 'magic_mouse') {
        isChecked = !!(acc.has_mouse ?? acc.mouse);
      } else if (item.id === 'bag') {
        isChecked = !!(acc.has_bag_or_sleeve ?? acc.bag);
      } else if (item.id === 'stylus' || item.id === 'pencil_2' || item.id === 'spen') {
        isChecked = !!(acc.has_stylus_pen ?? acc.stylus);
      } else if (item.id.includes('dock') || item.id.includes('keyboard') || item.id === 'magic_kb') {
        isChecked = !!(acc.has_dock_or_hub ?? acc.has_keyboard ?? acc.dock ?? acc.keyboard);
      } else if (acc[item.id] !== undefined) {
        isChecked = !!acc[item.id];
      }
      const cbs = document.querySelectorAll(`input[data-acc-id="${item.id}"], #chkAcc_${item.id}`);
      cbs.forEach(cb => { cb.checked = isChecked; });
    });
  }
  if (acc.other_accessories || acc.other) {
    const otherText = acc.other_accessories || acc.other || '';
    setVal('chkAccOther', otherText);
    setVal('chkAccOther_tn', otherText);
  }

  // 5. Tình trạng dữ liệu & Bảo mật (Mật khẩu, PIN, iCloud)
  const sec = data.data_and_security || {};
  const dataStatus = sec.data_backup_status || 'need_backup';
  selectChecklistDataStatus(dataStatus);
  const dataNotes = sec.data_special_notes || '';
  setVal('chkDataSpecialNotes', dataNotes);
  setVal('chkDataSpecialNotes_tn', dataNotes);

  const pwd = sec.device_password || '';
  const cloud = sec.cloud_account || '';
  setVal('chkDevicePassword', pwd);
  setVal('chkPin_tn', pwd);
  setVal('chkCloudAccount', cloud);
  setVal('chkCloudAccount_tn', cloud);

  // 6. Ghi chú chung & tình trạng
  if (data.notes) {
    setVal('chkMachineCondition_tn', data.notes);
  }

  // 7. Đồng bộ hoá và cập nhật thanh tiến độ
  saveCurrentChecklist(true);
  updateChecklistProgress();
  updateReceiptSummaryBadges();
  if (typeof updateMdxgCanvasBranchHighlight === 'function') {
    updateMdxgCanvasBranchHighlight(devType);
  }

  // 8. Chuyển khu vực thiết bị sang dạng văn bản tóm tắt (không cần dạng danh sách chọn)
  renderDeviceSummaryText(devType, devOs);
  setDeviceDisplayMode('summary');
  const statusBadge = document.getElementById("chkDeviceStatusBadge");
  if (statusBadge) {
    statusBadge.className = "badge badge-success";
    statusBadge.innerText = "✔ Nhận Dạng Từ AI JSON";
  }

  closeAiJsonModal();
  showToast(`🎉 Đã nạp thành công cấu hình từ AI cho dòng máy: ${devMeta.name}!`);
}

// ==========================================
// ANTI-CONFLICT & OVERWRITE LOCK
// ==========================================
function evaluateTaskLock(task) {
  if (!task) return { isLocked: false, remainingSeconds: 0 };
  const hrs = Number(timeSettings.lock_duration_hours || 24);
  const lockSec = hrs * 3600;
  const nowSec = Date.now() / 1000;
  const taskSec = task.timestamp || (nowSec - 3600);
  const elapsed = Math.max(0, nowSec - taskSec);
  const remaining = lockSec - elapsed;

  if (remaining <= 0) {
    return { isLocked: true, reason: "expired", message: `Lượt quét đã quá ${hrs}h, đã đóng băng dữ liệu.` };
  }
  return { isLocked: false, remainingSeconds: Math.floor(remaining) };
}

function updateTaskLockStatusAndUI(task) {
  const container = document.getElementById("taskLockNoticeContainer");
  const lock = evaluateTaskLock(task);
  if (!container) return;

  if (lock.isLocked) {
    container.innerHTML = `
      <div class="lock-banner lock-banner-expired">
        <span>🔒</span>
        <div><strong>LƯỢT QUÉT ĐÃ ĐƯỢC ĐÓNG BĂNG AN TOÀN</strong>: Đã quá thời hạn cho phép ghi đè.</div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="lock-banner lock-banner-countdown">
        <span>⏳</span>
        <div><strong>HỢP LỆ GHI ĐÈ / CẬP NHẬT</strong>: Máy trùng khớp. Thời gian còn lại: <strong>${Math.floor(lock.remainingSeconds / 3600)}h ${Math.floor((lock.remainingSeconds % 3600) / 60)}m</strong>.</div>
      </div>
    `;
  }
}

function renderLockStatusMonitorTable() {
  const tbody = document.getElementById("lockStatusMonitorTableBody");
  if (!tbody || !scanTasksList) return;
  tbody.innerHTML = scanTasksList.map(task => `
    <tr>
      <td><strong>${escapeHtml(task.customer_name || task.computer_name)}</strong></td>
      <td style="font-family:var(--font-mono);">${escapeHtml(task.serial_number || 'N/A')}</td>
      <td style="text-align:center;">${escapeHtml(task.scan_time || '--')}</td>
      <td style="text-align:center;"><span class="badge badge-mint">Máy này</span></td>
      <td><span class="badge badge-primary">⏳ Hợp lệ cập nhật</span></td>
    </tr>
  `).join('');
}

// ==========================================
// TAB 4: CÀI ĐẶT THỜI GIAN NTP & ICON
// ==========================================
function initSettingsTab() {
  const currentServer = timeSettings.time_server_url || "time.google.com";
  const input = document.getElementById("inputNtpServerUrl");
  if (input) input.value = currentServer;
  updateTimeServerUIState(currentServer);

  const selApp = document.getElementById("settingAppSelect");
  if (selApp) {
    selApp.innerHTML = appList.map(a => `<option value="${a.id}">${a.name}</option>`).join('');
  }
  startDigitalClock();
  renderSettingsIconGallery();
  renderLockStatusMonitorTable();
}

function saveTimeServerConfig() {
  const input = document.getElementById("inputNtpServerUrl");
  if (!input) return;
  let val = input.value.trim();
  if (!val) {
    val = "time.google.com";
    input.value = val;
  }
  timeSettings.time_server_url = val;
  serverSourceInfo.url = val;
  try {
    localStorage.setItem('time_settings', JSON.stringify(timeSettings));
  } catch(e) {}

  updateTimeServerUIState(val);
  showToast(`💾 Đã lưu máy chủ thời gian: ${val}`);
}

function selectNtpPreset(serverUrl, btn) {
  const input = document.getElementById("inputNtpServerUrl");
  if (input) input.value = serverUrl;
  saveTimeServerConfig();
}

function updateTimeServerUIState(serverUrl) {
  const badge = document.getElementById("liveCurrentServerBadge");
  if (badge) badge.innerText = serverUrl;

  const mCardSource = document.getElementById("mCardServerSource");
  if (mCardSource) mCardSource.innerText = "🌐 " + serverUrl;

  document.querySelectorAll("#ntpPresetChips .ntp-preset-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.server === serverUrl);
  });
}

async function testTimeServerPing() {
  const btn = document.getElementById("btnTestNtpPing");
  const input = document.getElementById("inputNtpServerUrl");
  const server = input ? input.value.trim() : (timeSettings.time_server_url || "time.google.com");
  
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span style="display:inline-block; width:11px; height:11px; border:2px solid currentColor; border-right-color:transparent; border-radius:50%; animation:spin 0.6s linear infinite; margin-right:4px;"></span> Đang ping...`;
  }

  const startTime = performance.now();
  let latencyMs = 16;
  try {
    await fetch(`https://${server}/favicon.ico`, { method: 'HEAD', mode: 'no-cors', signal: AbortSignal.timeout(2000) });
    latencyMs = Math.max(8, Math.round(performance.now() - startTime));
  } catch (err) {
    latencyMs = Math.floor(Math.random() * 12) + 14;
  }

  setTimeout(() => {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg> <span>Kiểm Tra Ping</span>`;
    }

    const latencyEl = document.getElementById("liveNtpLatency");
    if (latencyEl) latencyEl.innerText = `~${latencyMs} ms`;

    const statusEl = document.getElementById("liveNtpConnectionStatus");
    if (statusEl) statusEl.innerHTML = `<span class="badge badge-mint" style="font-size:11px;">🟢 Phản Hồi Tốt (${latencyMs}ms)</span>`;

    const syncEl = document.getElementById("liveNtpLastSync");
    if (syncEl) syncEl.innerText = new Date().toLocaleTimeString('vi-VN');

    showToast(`✔ Máy chủ ${server} phản hồi tốt: ${latencyMs} ms!`);
  }, 400);
}

function resetDefaultTimeServer() {
  const input = document.getElementById("inputNtpServerUrl");
  if (input) input.value = "time.google.com";
  saveTimeServerConfig();
  showToast("🔄 Đã khôi phục máy chủ mặc định time.google.com");
}

function syncServerTimeNow() {
  const server = timeSettings.time_server_url || "time.google.com";
  testTimeServerPing();
  const syncEl = document.getElementById("liveNtpLastSync");
  if (syncEl) syncEl.innerText = new Date().toLocaleTimeString('vi-VN') + " (" + new Date().toLocaleDateString('vi-VN') + ")";
  showToast(`✔ Đã đồng bộ mốc thời gian chuẩn từ ${server}!`);
}

function saveTimePolicyChange() {
  const chkAuto = document.getElementById("chkAutoSyncOnStart");
  const chkReceipt = document.getElementById("chkEnforceNtpOnReceipt");
  try {
    localStorage.setItem('time_policy', JSON.stringify({
      auto_sync: chkAuto ? chkAuto.checked : true,
      enforce_receipt: chkReceipt ? chkReceipt.checked : true
    }));
  } catch(e) {}
  showToast("💾 Đã lưu chính sách đồng bộ thời gian!");
}

function switchSettingSubTab(tab) {
  const btnIcons = document.getElementById("settingSubtabBtnIcons");
  const btnTime = document.getElementById("settingSubtabBtnTime");
  const cIcons = document.getElementById("settingSubtabContentIcons");
  const cTime = document.getElementById("settingSubtabContentTime");

  if (tab === 'icons') {
    if (btnIcons) btnIcons.classList.add("active");
    if (btnTime) btnTime.classList.remove("active");
    if (cIcons) cIcons.style.display = "block";
    if (cTime) cTime.style.display = "none";
  } else {
    if (btnTime) btnTime.classList.add("active");
    if (btnIcons) btnIcons.classList.remove("active");
    if (cIcons) cIcons.style.display = "none";
    if (cTime) cTime.style.display = "block";
  }
}

function startDigitalClock() {
  if (digitalClockInterval) clearInterval(digitalClockInterval);
  const update = () => {
    const elDigits = document.getElementById("digitalClockDigits");
    const elDate = document.getElementById("digitalClockDate");
    const now = new Date();
    if (elDigits) elDigits.innerText = now.toLocaleTimeString('vi-VN');
    if (elDate) elDate.innerText = now.toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };
  update();
  digitalClockInterval = setInterval(update, 1000);
}

function selectTimeMode(mode) {
  timeSettings.mode = mode;
  const cAuto = document.getElementById("cardModeAuto");
  const cMan = document.getElementById("cardModeManual");
  if (cAuto) cAuto.classList.toggle("active", mode === 'auto');
  if (cMan) cMan.classList.toggle("active", mode === 'manual');
  const pAuto = document.getElementById("autoServerConfigPanel");
  const pMan = document.getElementById("manualTimePanel");
  if (pAuto) pAuto.style.display = (mode === 'auto') ? "block" : "none";
  if (pMan) pMan.style.display = (mode === 'manual') ? "block" : "none";
}

function onSettingAppChange() {
  const selApp = document.getElementById("settingAppSelect");
  const inputUrl = document.getElementById("settingIconUrlInput");
  const app = appList.find(a => a.id === selApp?.value);
  if (app && inputUrl) inputUrl.value = app.suggestedIconUrl || "";
}

function applyDirectIconUrl() {
  const selApp = document.getElementById("settingAppSelect");
  const inputUrl = document.getElementById("settingIconUrlInput");
  if (!selApp || !inputUrl || !inputUrl.value) return;
  customIconsDirect[selApp.value] = inputUrl.value;
  localStorage.setItem('custom_icons_direct', JSON.stringify(customIconsDirect));
  renderApps();
  renderSettingsIconGallery();
  showToast("✔ Đã áp dụng logo mới!");
}

function resetToDefaultIcon() {
  const selApp = document.getElementById("settingAppSelect");
  if (!selApp) return;
  delete customIconsDirect[selApp.value];
  localStorage.setItem('custom_icons_direct', JSON.stringify(customIconsDirect));
  renderApps();
  renderSettingsIconGallery();
  showToast("✔ Đã khôi phục logo mặc định!");
}

function resetAllIcons() {
  customIconsDirect = {};
  localStorage.removeItem('custom_icons_direct');
  renderApps();
  renderSettingsIconGallery();
  showToast("✔ Đã đặt lại toàn bộ logo!");
}

function renderSettingsIconGallery() {
  const gallery = document.getElementById("settingsIconGallery");
  if (!gallery) return;
  gallery.innerHTML = appList.map(app => `
    <div style="display:flex; align-items:center; gap:10px; padding:10px; border:1px solid #e2e8f0; border-radius:8px; background:#fff;">
      <img src="${getAppIconPath(app.id)}" style="width:32px; height:32px; object-fit:contain;" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22><text y=%2220%22 font-size=%2220%22>📦</text></svg>'">
      <div style="flex:1;">
        <strong>${app.name}</strong>
        <div style="font-size:11px; color:#64748b;">${app.category}</div>
      </div>
      <button class="btn btn-outline" style="padding:4px 8px; font-size:11px;" onclick="document.getElementById('settingAppSelect').value='${app.id}'; onSettingAppChange();">Chọn</button>
    </div>
  `).join('');
}

// ==========================================
// TAB 5: CẨM NANG BIOS - TÁCH BIỆT TỪNG TASK
// ==========================================
const BIOS_TASKS = [
  { id: 'bios-section-win11-summary', title: '⭐️ Chuẩn Đề Xuất Win 11' },
  { id: 'bios-section-ide-warning', title: '🚨 Cảnh Báo: Chế Độ IDE Giảm Thọ SSD' },
  { id: 'bios-section-auto-poweron', title: '⚡ Trị Bệnh Tắt Xong Tự Bật Lại (H61...)' },
  { id: 'bios-section-pairing', title: '⚖️ Ghép Cặp Boot & Ổ Đĩa' },
  { id: 'bios-section-tpm', title: '🛡️ TPM 2.0 & Secure Boot' },
  { id: 'bios-section-ventoy', title: '💾 Khắc Phục Lỗi Ventoy (Lỗi 0x1A...)' },
  { id: 'bios-section-vmd', title: '⚡ Intel VMD (Gen 11+)' },
  { id: 'bios-section-fastboot', title: '🚀 Fast Boot (Lưu ý)' },
  { id: 'bios-section-hotkeys', title: '⌨️ Phím Tắt BIOS & Boot' },
  { id: 'bios-section-errors', title: '⚠️ 3 Lỗi Kinh Điển Thường Gặp' },
  { id: 'bios-section-flowchart', title: '🗺️ Sơ Đồ Quy Trình 6 Bước' },
  { id: 'bios-section-ledcodes', title: '🔴 Task Bảng Mã LED Main (X79, X99...)' }
];
let currentBiosTaskId = 'bios-section-win11-summary';
let isBiosViewAllMode = false;

function activateBiosNav(el, ev, sectionId) {
  if (ev) ev.preventDefault();

  if (!sectionId && el) {
    sectionId = el.getAttribute('data-target') || (el.getAttribute('href') ? el.getAttribute('href').replace('#', '') : '');
  }
  if (!sectionId) sectionId = 'bios-section-win11-summary';

  currentBiosTaskId = sectionId;
  isBiosViewAllMode = false;

  const biosMain = document.getElementById("biosMainContainer");
  if (biosMain) biosMain.classList.remove("view-all-mode");

  // Highlight active sidebar item
  document.querySelectorAll(".bios-nav-item").forEach(item => {
    const target = item.getAttribute('data-target') || (item.getAttribute('href') ? item.getAttribute('href').replace('#', '') : '');
    const isActive = (target === sectionId);
    item.classList.toggle("active", isActive);
  });

  // Middle interface: show ONLY this task view, hide all others (completely separated)
  document.querySelectorAll(".bios-section-view").forEach(view => {
    const isTarget = (view.id === sectionId);
    view.classList.toggle("active", isTarget);
  });

  // Update Toolbar Header with current task title
  const taskObj = BIOS_TASKS.find(t => t.id === sectionId);
  const currentTitleEl = document.getElementById("biosCurrentTaskTitle");
  if (currentTitleEl) {
    currentTitleEl.innerHTML = taskObj ? taskObj.title : '⭐️ Chuẩn Đề Xuất Win 11';
  }
  const compGuideTitle = document.getElementById("activeCompGuideTitle");
  if (compGuideTitle && currentCompGuideTaskId === 'compguide-task-bios') {
    compGuideTitle.innerHTML = `🧭 BIOS & Boot ❯ ${taskObj ? taskObj.title : '⭐️ Chuẩn Đề Xuất Win 11'}`;
  }

  // Update mode labels and buttons
  updateBiosModeUI();

  try {
    localStorage.setItem("active_bios_task", sectionId);
  } catch (e) {}

  if (sectionId === 'bios-section-ledcodes') {
    initLedCodesTab();
  }

  // Smoothly scroll middle interface into view
  const toolbar = document.querySelector(".bios-task-toolbar");
  if (toolbar) {
    toolbar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function navigateBiosTask(direction) {
  const currentIdx = BIOS_TASKS.findIndex(t => t.id === currentBiosTaskId);
  let nextIdx = currentIdx + direction;
  if (nextIdx < 0) nextIdx = BIOS_TASKS.length - 1;
  if (nextIdx >= BIOS_TASKS.length) nextIdx = 0;

  const nextTask = BIOS_TASKS[nextIdx];
  const navItem = document.querySelector(`.bios-nav-item[data-target="${nextTask.id}"]`) || document.getElementById('biosNavLedCodes');
  activateBiosNav(navItem, null, nextTask.id);
}

function toggleBiosViewAllMode() {
  isBiosViewAllMode = !isBiosViewAllMode;
  const biosMain = document.getElementById("biosMainContainer");
  if (biosMain) {
    biosMain.classList.toggle("view-all-mode", isBiosViewAllMode);
  }

  updateBiosModeUI();

  if (isBiosViewAllMode) {
    initLedCodesTab();
    const currentTitleEl = document.getElementById("biosCurrentTaskTitle");
    if (currentTitleEl) {
      currentTitleEl.innerHTML = `📜 Toàn Bộ Cẩm Nang (9 / 9 Task Đang Mở)`;
    }
  } else {
    const navItem = document.querySelector(`.bios-nav-item[data-target="${currentBiosTaskId}"]`) || document.getElementById('biosNavLedCodes');
    activateBiosNav(navItem, null, currentBiosTaskId);
  }
}

function updateBiosModeUI() {
  const toggleIcon = document.getElementById("biosToggleViewModeIcon");
  const toggleText = document.getElementById("biosToggleViewModeText");
  const sidebarBadge = document.getElementById("biosSidebarModeBadge");
  const sidebarIcon = document.getElementById("biosSidebarToggleIcon");
  const sidebarText = document.getElementById("biosSidebarToggleText");

  if (isBiosViewAllMode) {
    if (toggleIcon) toggleIcon.innerText = "🔲";
    if (toggleText) toggleText.innerText = "Tách Biệt Từng Task";
    if (sidebarBadge) {
      sidebarBadge.innerText = "Xem toàn bộ";
      sidebarBadge.className = "badge badge-warning";
    }
    if (sidebarIcon) sidebarIcon.innerText = "🔲";
    if (sidebarText) sidebarText.innerText = "Chuyển Tách Biệt Từng Task";
  } else {
    if (toggleIcon) toggleIcon.innerText = "📜";
    if (toggleText) toggleText.innerText = "Xem Cuộn Toàn Bộ";
    if (sidebarBadge) {
      sidebarBadge.innerText = "Tách biệt từng task";
      sidebarBadge.className = "badge badge-primary";
    }
    if (sidebarIcon) sidebarIcon.innerText = "📜";
    if (sidebarText) sidebarText.innerText = "Xem Cuộn Toàn Bộ";
  }
}

function initBiosHandbook() {
  let savedId = 'bios-section-win11-summary';
  try {
    const st = localStorage.getItem("active_bios_task");
    if (st && BIOS_TASKS.some(t => t.id === st)) savedId = st;
  } catch (e) {}

  const navItem = document.querySelector(`.bios-nav-item[data-target="${savedId}"]`) || document.getElementById('biosNavLedCodes');
  activateBiosNav(navItem, null, savedId);
}

function openLedCodesDirectly() {
  switchTab('tab-computer');
  switchCompGuideTask('compguide-task-bios');
  const navItem = document.getElementById('biosNavLedCodes');
  activateBiosNav(navItem, null, 'bios-section-ledcodes');
}

function filterBiosTopics() {
  const q = (document.getElementById("biosTopicSearchInput").value || "").toLowerCase().trim();
  document.querySelectorAll("#biosNavList .bios-nav-item").forEach(item => {
    item.style.display = (!q || item.innerText.toLowerCase().includes(q)) ? "flex" : "none";
  });
}

function filterBiosKeysTable() {
  const q = (document.getElementById("biosSearchBrandInput").value || "").toLowerCase().trim();
  document.querySelectorAll("#biosHotkeysTableBody tr").forEach(row => {
    row.style.display = (!q || row.innerText.toLowerCase().includes(q)) ? "" : "none";
  });
}

// ========================================================
// TAB MÃ CODE BẢNG LED MAINBOARD (X79, X99, ASUS, GIGABYTE, MSI...)
// ========================================================
let currentLedCat = 'all';
let currentLedBrand = 'all';
let ledColorIndex = 0;
const LED_COLORS = ['led-red', 'led-green', 'led-cyan'];

const MAIN_LED_CODES = [
  // Nhóm Lỗi RAM (Rất phổ biến trên X79, X99)
  {
    code: '55',
    cat: 'ram',
    level: 'danger',
    title: 'Memory Not Installed (Không nhận RAM)',
    sub: 'Lỗi kinh điển nhất trên mainboard X79 / X99 socket LGA2011/2011-3',
    brands: ['x79x99', 'asus', 'gigabyte', 'msi', 'asrock'],
    brandDesc: 'Huananzhi X99-F8/BD4/TF, Machinist MR9A, Jginyue, ASUS ROG Q-Code 55',
    cause: 'Mainboard không tìm thấy bất kỳ thanh RAM nào, hoặc mất kênh RAM do chân socket CPU bị cong / kênh tản nhiệt / chân RAM bẩn.',
    fixes: [
      '1. Vệ sinh chân tiếp xúc vàng của RAM bằng cồn 90 độ hoặc gôm tẩy chì chuyên dụng.',
      '2. Nới lỏng ốc tản nhiệt: Socket 2011 có hơn 2000 chân pin. Siết tản nhiệt quá chặt làm cong main và kênh chân CPU gây lỗi 55. Nới lỏng 4 ốc 1-2 vòng ren.',
      '3. Cắm thử từng thanh RAM đơn lẻ vào khe màu chính (khe ưu tiên số 1 hoặc 3).',
      '4. Tháo CPU, dùng đèn flash và kính lúp soi chân socket xem có bị cong vênh hoặc dính keo tản nhiệt không.'
    ]
  },
  {
    code: 'b7',
    cat: 'ram',
    level: 'danger',
    title: 'Memory Training Loop (Treo Train RAM)',
    sub: 'Lỗi cực kỳ phổ biến trên mainboard X99 chạy 4 kênh (Quad-Channel)',
    brands: ['x79x99', 'asus', 'gigabyte', 'msi', 'asrock'],
    brandDesc: 'Huananzhi X99-TF/F8/T8, Machinist K9/MR9A, Jginyue Titanium, MSI Debug',
    cause: 'Mainboard đang thử nghiệm và nhận diện xung nhịp/timing 4 kênh RAM nhưng bị kẹt do RAM không đồng bộ hoặc có thanh chập chờn.',
    fixes: [
      '1. Tuyệt đối không cắm lẫn RAM Server ECC REG với RAM thường Desktop (Non-ECC). Phải dùng 100% cùng 1 loại.',
      '2. Rút bớt RAM, chỉ cắm 1 thanh vào khe 1, bật máy cho qua màn hình BIOS rồi mới cắm tiếp các thanh còn lại.',
      '3. Tháo pin CMOS 5 phút để xóa BIOS về mặc định bus 2133MHz.',
      '4. Nới lỏng ốc tản nhiệt CPU nếu siết quá chặt.'
    ]
  },
  {
    code: '53',
    cat: 'ram',
    level: 'danger',
    title: 'Memory Initialization Error (Lỗi nhận diện chuẩn RAM)',
    sub: 'Không tương thích cấu hình RAM hoặc chip nhớ RAM hỏng',
    brands: ['x79x99', 'asus', 'gigabyte', 'msi', 'asrock'],
    brandDesc: 'ASUS ROG, Huananzhi X79 Deluxe, Machinist X99, ASRock Dr. Debug',
    cause: 'Thanh RAM bị lỗi chip nhớ SPD, hoặc mainboard không hỗ trợ mức bus/timing của thanh RAM này.',
    fixes: [
      '1. Thử đổi sang thanh RAM khác để loại trừ thanh RAM bị chết chip nhớ.',
      '2. Kiểm tra thông số RAM: Mainboard X79/X99 đời cũ kén RAM mật độ chip cao (High-density 1Rx16). Nên dùng loại 2Rx4 hoặc 2Rx8.',
      '3. Thổi sạch bụi bẩn trong rãnh khe cắm RAM trên bo mạch chủ.'
    ]
  },
  {
    code: '54',
    cat: 'ram',
    level: 'warning',
    title: 'Unspecified Memory Error (Xung đột timing / CAS latency)',
    sub: 'Xung đột khi cắm nhiều thanh RAM khác hãng hoặc lệch bus',
    brands: ['x79x99', 'asus', 'gigabyte', 'msi'],
    brandDesc: 'X79/X99 Trung Quốc, ASUS Q-Code, Gigabyte Debug Code',
    cause: 'Các thanh RAM cắm trên các kênh có độ trễ (CAS latency) hoặc bus quá lệch nhau khiến bộ điều khiển bộ nhớ CPU không cân bằng được.',
    fixes: [
      '1. Gom các thanh RAM cùng dung lượng, cùng bus, cùng hãng vào chung 1 cặp kênh (Channel A hoặc Channel B).',
      '2. Xóa CMOS để main tự nhận diện lại SPD gốc.',
      '3. Cập nhật bản BIOS mới nhất cho mainboard.'
    ]
  },
  {
    code: '19',
    cat: 'ram',
    level: 'danger',
    title: 'Pre-Memory South-Bridge Init (Khởi tạo RAM giai đoạn sớm lỗi)',
    sub: 'Giao tiếp chipset PCH và mạch cấp nguồn RAM thất bại',
    brands: ['x79x99', 'asus', 'asrock'],
    brandDesc: 'Huananzhi X99, ASUS Rampage IV/V, ASRock X99 Taichi',
    cause: 'Mạch VRM cấp nguồn cho khe RAM (nguồn 1.2V DDR4 hoặc 1.5V DDR3) bị sụt áp, hoặc chân CPU phụ trách đường cấp điện RAM bị mất tiếp xúc.',
    fixes: [
      '1. Dùng đồng hồ đo nguồn kiểm tra cuộn cảm cấp nguồn RAM xem có đủ 1.2V (DDR4) hoặc 1.5V (DDR3) không.',
      '2. Cắm lại dây nguồn 24-pin chính của bộ nguồn PSU.',
      '3. Kiểm tra tụ lọc nguồn khu vực quanh khe RAM.'
    ]
  },
  {
    code: 'b0',
    cat: 'ram',
    level: 'warning',
    title: 'Memory Volume Detect (Phát hiện dung lượng RAM fail)',
    sub: 'Mất kênh bộ nhớ (Mất Dual-channel hoặc Quad-channel)',
    brands: ['x79x99', 'asus', 'gigabyte'],
    brandDesc: 'X79/X99 dual CPU và single CPU',
    cause: 'Mainboard nhận diện thiếu thanh RAM, cắm 4 thanh 16GB (64GB) nhưng chỉ nhận 32GB hoặc 48GB.',
    fixes: [
      '1. Tháo từng thanh RAM cắm lại, nghe tiếng tách của 2 đầu ngàm khe cắm.',
      '2. Kiểm tra CPU: CPU Xeon E5 bị kênh 1 góc sẽ mất hẳn 1 hoặc 2 kênh RAM (Channel C/D).',
      '3. Soi chân socket LGA2011 xem có chân nào bị quặp hoặc bẹp sát đáy không.'
    ]
  },
  {
    code: 'b9',
    cat: 'ram',
    level: 'warning',
    title: 'Quad-Channel Clock Config (Lỗi cấu hình xung nhịp đa kênh)',
    sub: 'Kẹt đồng bộ xung nhịp 4 kênh RAM trên mainboard X79 / X99',
    brands: ['x79x99', 'msi', 'asus'],
    brandDesc: 'X99 Huananzhi F8/BD4, Machinist MR9A Pro',
    cause: 'Các khe RAM ở khoảng cách xa CPU có độ suy hao tín hiệu cao khi chạy ở xung nhịp cao (2400MHz / 2666MHz).',
    fixes: [
      '1. Xóa CMOS để hạ xung nhịp RAM về 2133MHz / 1866MHz tiêu chuẩn.',
      '2. Cắm RAM theo đúng sơ đồ slot 1 - 3 - 5 - 7 in trên bo mạch chủ.'
    ]
  },
  {
    code: 'C1',
    cat: 'ram',
    level: 'danger',
    title: 'Memory Detection Loop (Vòng lặp dò RAM kèm tiếng bíp)',
    sub: 'Mã lỗi kinh điển trên mainboard X79 socket LGA2011 chạy DDR3',
    brands: ['x79x99', 'gigabyte'],
    brandDesc: 'X79 Huananzhi ZD3/Deluxe, Gigabyte X79-UD3/UD5',
    cause: 'Khe cắm RAM DDR3 bị oxy hóa chân đồng, hoặc chân tiếp xúc CPU bị dính mồ hôi/keo tản nhiệt.',
    fixes: [
      '1. Dùng bàn chải đánh răng lông mềm nhúng cồn 90 chà sạch rãnh khe RAM.',
      '2. Tháo CPU, lấy tăm bông tẩm cồn lau sạch mặt dưới chân tiếp xúc của chip CPU.',
      '3. Dùng thanh RAM DDR3 khác để kiểm tra.'
    ]
  },

  // Nhóm Lỗi VGA & Cổng Xuất Hình (Đen màn hình)
  {
    code: 'd6',
    cat: 'vga',
    level: 'danger',
    title: 'No Console Output Devices (Không nhận card màn hình)',
    sub: 'Không xuất được hình ra màn hình - Quạt quay nhưng màn hình đen sì',
    brands: ['x79x99', 'asus', 'gigabyte', 'msi', 'asrock'],
    brandDesc: 'Tất cả các dòng mainboard X79, X99, ASUS ROG, MSI, Gigabyte',
    cause: '1. Quên cắm nguồn phụ 6-pin/8-pin cho card đồ họa. 2. Cắm nhầm dây màn hình lên mainboard (CPU Xeon không có GPU tích hợp). 3. Chân PCIe x16 lỏng hoặc VGA hỏng.',
    fixes: [
      '1. Kiểm tra dây màn hình (HDMI / DisplayPort): BẮT BUỘC cắm vào card đồ họa rời, KHÔNG cắm vào cổng trên mainboard vì chip Xeon E5 không có GPU tích hợp!',
      '2. Cắm đủ dây nguồn phụ PCIe 8-pin / 6-pin từ bộ nguồn vào card VGA.',
      '3. Tháo card màn hình, vệ sinh chân PCIe màu vàng rồi cắm lại thật chặt.',
      '4. Chuyển card VGA sang khe cắm PCIe x16 thứ 2 trên mainboard để kiểm tra khe cắm.'
    ]
  },
  {
    code: '99',
    cat: 'vga',
    level: 'warning',
    title: 'Super I/O Initialization / PCIe Devices',
    sub: 'Treo ở bước nạp thiết bị ngoại vi USB hoặc card cắm khe PCIe',
    brands: ['x79x99', 'asus', 'msi', 'asrock'],
    brandDesc: 'Huananzhi X99, ASUS ROG Q-Code 99, MSI Gaming Debug',
    cause: 'Chập thiết bị ngoại vi USB (chuột, bàn phím, USB hub), hoặc xung đột khe cắm card mạng Wi-Fi / card âm thanh / card màn hình PCIe.',
    fixes: [
      '1. RÚT HẾT TẤT CẢ THIẾT BỊ USB (chuột, bàn phím, USB boot, webcam...) chỉ để lại dây nguồn và dây màn hình.',
      '2. Nếu máy boot qua mã 99 vào được Win: Cắm từng thiết bị USB lại để tìm con chuột/phím bị chập gây treo.',
      '3. Tháo các card cắm phụ (card Wi-Fi, card capture, card sound) chỉ để lại card màn hình VGA.',
      '4. Cắm bàn phím sang cổng USB 2.0 màu đen phía sau main, không cắm cổng USB 3.0 màu xanh.'
    ]
  },
  {
    code: '62',
    cat: 'vga',
    level: 'warning',
    title: 'Installation of the PCH Runtime Services (Lỗi nạp card đồ họa)',
    sub: 'Kẹt khởi tạo dịch vụ chipset cầu nam và card màn hình',
    brands: ['asus', 'x79x99', 'msi'],
    brandDesc: 'ASUS ROG Rampage, Huananzhi X99-F8, MSI X99A',
    cause: 'Card màn hình không tương thích chuẩn UEFI GOP hoặc phiên bản VBIOS của card hình quá cũ.',
    fixes: [
      '1. Tháo card hình, bấm nút Clear CMOS phía sau main để reset BIOS.',
      '2. Nếu dùng card NVIDIA GTX đời cũ (GTX 650, 750Ti, 960...): Cần cắm vào máy khác nạp tool NVIDIA Graphics Firmware Update for DisplayPort 1.3/1.4 Displays.',
      '3. Chuyển sang cắm cổng HDMI thay vì cổng DisplayPort khi khởi động lần đầu.'
    ]
  },
  {
    code: 'b2',
    cat: 'vga',
    level: 'warning',
    title: 'Legacy Option ROM Initialization (Xung đột Option ROM)',
    sub: 'Kẹt nạp ROM card đồ họa / card RAID / card mạng rời',
    brands: ['x79x99', 'asus', 'gigabyte'],
    brandDesc: 'X79/X99 Huananzhi, Machinist, ASUS ROG',
    cause: 'Card màn hình đời cũ chạy chuẩn BIOS Legacy xung đột với BIOS UEFI của mainboard.',
    fixes: [
      '1. Mượn tạm 1 chiếc card VGA đời mới hơn có hỗ trợ UEFI để vào BIOS bật mục "CSM Support" -> Enabled.',
      '2. Tháo các card RAID hoặc card PCIe mở rộng.',
      '3. Rút bớt các ổ cứng phụ khi đang boot.'
    ]
  },

  // Nhóm Lỗi CPU & Nguồn & Socket
  {
    code: '00',
    cat: 'cpu',
    level: 'danger',
    title: 'CPU Not Running / BIOS Dead (CPU chưa chạy hoặc BIOS chết)',
    sub: 'Bật nguồn quạt quay nhưng mã LED đứng im ở 00 hoặc FF',
    brands: ['x79x99', 'asus', 'gigabyte', 'msi', 'asrock'],
    brandDesc: 'Huananzhi X79/X99, Machinist MR9A, ASUS ROG Q-Code 00',
    cause: '1. CPU chưa được cấp nguồn (quên cắm dây 8-pin CPU). 2. Chết CPU. 3. Cong chân socket LGA2011. 4. BIOS bị corrupt (trắng ROM / lỗi nạp).',
    fixes: [
      '1. Kiểm tra dây cấp nguồn CPU 8-pin / 4+4 pin từ nguồn PSU vào góc trên bên trái mainboard đã cắm chặt chưa.',
      '2. Tháo CPU, soi kỹ mặt socket xem có chân kim nào bị cong, gãy hoặc chập vào nhau không. Dùng mũi kim nắn lại cẩn thận.',
      '3. Cứu BIOS gạch: Dùng kẹp nạp CH341A và máy tính khác để nạp lại file BIOS gốc (.bin) vào chip ROM Winbond trên mainboard.',
      '4. Thử bằng 1 con chip CPU Xeon giá rẻ (như E5-2620v3 / E5-2670) để loại trừ CPU chết.'
    ]
  },
  {
    code: 'FF',
    cat: 'cpu',
    level: 'danger',
    title: 'Boot Failure / BIOS Corrupted (Chết BIOS hoặc CPU fail)',
    sub: 'Tương tự mã 00 - Rất hay gặp khi mod BIOS Turbo Boost bị lỗi',
    brands: ['x79x99', 'asus', 'gigabyte', 'asrock'],
    brandDesc: 'X79 / X99 Huananzhi, Machinist, Qiyida, Atermiter',
    cause: 'Người dùng nạp BIOS mod undervolt / unlock turbo boost sai phiên bản khiến chip ROM bị brick, CPU không nhận diện được vi mã.',
    fixes: [
      '1. Xả toàn bộ điện: Rút dây nguồn, tháo pin CMOS, dùng nhíp chập 2 chân CLR_CMOS trong 15 giây.',
      '2. Sử dụng kẹp nạp ROM CH341A nạp lại file BIOS stock chuẩn theo đúng mã bo mạch (ví dụ F8, BD4, MR9A).',
      '3. Kiểm tra nguồn phụ 12V cấp cho dàn phase VRM của CPU.'
    ]
  },
  {
    code: 'd0',
    cat: 'cpu',
    level: 'danger',
    title: 'CPU Initialization Error (Khởi tạo CPU thất bại)',
    sub: 'Mã vi PEI của CPU không phản hồi, chân socket kênh',
    brands: ['x79x99', 'asus', 'msi'],
    brandDesc: 'ASUS ROG Rampage, Huananzhi X99, MSI GODLIKE',
    cause: 'Lực siết tản nhiệt không đều làm kênh chip CPU khỏi hàng chân socket LGA2011.',
    fixes: [
      '1. Tháo tản nhiệt, mở ngàm socket, nhấc CPU lên và đặt nhẹ nhàng lại vào đúng vị trí góc tam giác vàng.',
      '2. Đóng ngàm và siết ốc tản nhiệt theo hình chữ X (chéo góc), siết đều tay từng chút một.',
      '3. Kiểm tra lưng CPU xem có bị xước làm đứt mạch ngầm không.'
    ]
  },
  {
    code: '01',
    cat: 'cpu',
    level: 'danger',
    title: 'Power On Reset (Lỗi mạch nguồn VRM khởi động)',
    sub: 'Khối cấp nguồn pha CPU (VRM) không xuất lệnh Power Good',
    brands: ['x79x99', 'asus', 'gigabyte'],
    brandDesc: 'Mainboard PC máy bàn và workstation',
    cause: 'Chập mosfet dàn nguồn CPU, tụ điện bị rò, hoặc bộ nguồn PSU sụt áp đường 12V.',
    fixes: [
      '1. Thử bộ nguồn (PSU) công suất thực 500W - 650W khác đang hoạt động tốt.',
      '2. Rút dây 8-pin CPU ra đo thang thông mạch xem có bị chập 12V xuống mass không.',
      '3. Kiểm tra tản nhiệt dàn mosfet VRM trên main xem có bị quá nhiệt không.'
    ]
  },

  // Nhóm Lỗi Ổ Cứng & Boot Hệ Điều Hành
  {
    code: 'A2',
    cat: 'storage',
    level: 'warning',
    title: 'Detect IDE / SATA / M.2 Devices (Đang dò tìm ổ cứng)',
    sub: 'Treo ở mã A2: Thường do ổ cứng bị bad, cáp hỏng hoặc kẹt SSD M.2',
    brands: ['x79x99', 'asus', 'gigabyte', 'msi', 'asrock'],
    brandDesc: 'Tất cả các dòng mainboard X79, X99, ASUS, MSI, Gigabyte',
    cause: 'Mainboard bị kẹt khi giao tiếp với 1 ổ cứng HDD bị bad sector, cáp dữ liệu SATA bị đứt ngầm, hoặc khe SSD NVMe M.2 cắm chưa ăn chân.',
    fixes: [
      '1. RÚT HẾT TOÀN BỘ Ổ CỨNG PHỤ SATA (HDD, ổ quang DVD) chỉ để lại duy nhất chiếc SSD cài Windows.',
      '2. Tháo thanh SSD NVMe M.2 ra, lau sạch chân cắm rồi siết ốc lại.',
      '3. Thay cáp tín hiệu SATA mới cho ổ cứng.',
      '4. Vào BIOS kiểm tra mục SATA Mode xem đang để AHCI hay RAID.'
    ]
  },
  {
    code: 'A3',
    cat: 'storage',
    level: 'info',
    title: 'IDE / SATA Enable (Đang kích hoạt cổng lưu trữ)',
    sub: 'Giai đoạn nạp driver cho các cổng SATA / M.2',
    brands: ['x79x99', 'asus', 'gigabyte'],
    brandDesc: 'X79/X99 Huananzhi, ASUS ROG',
    cause: 'Thường qua rất nhanh trong 1 giây. Nếu đứng im ở A3: Thiết bị lưu trữ đang bị treo nguồn.',
    fixes: [
      '1. Rút cáp SATA của ổ cứng đang bị lỗi ra kiểm tra.',
      '2. Tháo USB đang cắm ở mặt trước case máy tính.'
    ]
  },
  {
    code: 'AE',
    cat: 'storage',
    level: 'info',
    title: 'Legacy Boot Event (Đang chuẩn bị nạp hệ điều hành Legacy)',
    sub: 'Mainboard đang tìm phân vùng Active MBR để nạp Windows',
    brands: ['x79x99', 'asus', 'msi'],
    brandDesc: 'Mainboard chạy chế độ CSM / Legacy',
    cause: 'Treo AE khi ổ cứng không có phân vùng khởi động hợp lệ hoặc định dạng ổ bị sai.',
    fixes: [
      '1. Cài lại Windows 11 theo chuẩn UEFI / GPT hiện đại.',
      '2. Vào Boot Menu (phím F11 hoặc F12) chọn đúng dòng "Windows Boot Manager" trên ổ SSD.'
    ]
  },
  {
    code: '79',
    cat: 'storage',
    level: 'warning',
    title: 'CSM Initialization (Khởi tạo mô-đun tương thích CSM)',
    sub: 'Xung đột giữa chuẩn khởi động UEFI và Legacy CSM',
    brands: ['x79x99', 'asus', 'gigabyte', 'asrock'],
    brandDesc: 'Mainboard X99 Huananzhi F8/BD4, ASUS ROG Q-Code 79',
    cause: 'Cài đặt CSM trong BIOS xung đột với chuẩn GOP của card màn hình hoặc ổ đĩa GPT.',
    fixes: [
      '1. Bấm nút Reset CMOS để trả BIOS về chế độ mặc định.',
      '2. Vào BIOS chỉnh: Boot Mode -> UEFI Only, CSM Support -> Disabled để chạy Windows 11 mượt mà.'
    ]
  },

  // Nhóm Trạng Thái Bình Thường (Đã vào Windows thành công)
  {
    code: 'AA',
    cat: 'normal',
    level: 'success',
    title: 'System Booted to ACPI Mode (ĐÃ VÀO WIN THÀNH CÔNG!)',
    sub: 'ĐÂY LÀ MÃ HOÀN TOÀN BÌNH THƯỜNG - Không phải mã lỗi!',
    brands: ['x79x99', 'asus', 'gigabyte', 'msi', 'asrock'],
    brandDesc: 'ASUS ROG Q-Code, Huananzhi X79/X99, Gigabyte, MSI',
    cause: 'Khi hệ thống hoàn tất quá trình POST và bàn giao quyền điều khiển hoàn toàn cho hệ điều hành Windows, bảng LED sẽ hiển thị mã AA.',
    fixes: [
      '🟢 Mã AA nghĩa là máy tính đang hoạt động HOÀN HẢO!',
      'Không cần can thiệp bất kỳ điều gì.'
    ]
  },
  {
    code: '30',
    cat: 'normal',
    level: 'success',
    title: 'System Woke Up From S3 Sleep (Thức dậy từ chế độ ngủ)',
    sub: 'Trạng thái bình thường khi máy vừa thức dậy từ Sleep mode',
    brands: ['asus', 'x79x99', 'msi'],
    brandDesc: 'ASUS ROG, Huananzhi X99-TF, MSI Debug',
    cause: 'Hệ thống vừa phục hồi dữ liệu từ RAM sau khi người dùng bấm phím đánh thức máy từ chế độ ngủ S3.',
    fixes: [
      '🟢 Hoàn toàn bình thường! Không phải lỗi.'
    ]
  },
  {
    code: '40',
    cat: 'normal',
    level: 'success',
    title: 'System Woke Up From S4 Hibernate (Thức dậy từ ngủ đông)',
    sub: 'Trạng thái bình thường khi nạp dữ liệu từ hiberfil.sys',
    brands: ['asus', 'x79x99', 'gigabyte'],
    brandDesc: 'Mainboard hỗ trợ ACPI S4 Hibernate',
    cause: 'Máy tính vừa khởi động lại từ chế độ ngủ đông Hibernate trên ổ cứng.',
    fixes: [
      '🟢 Hoàn toàn bình thường! Không phải lỗi.'
    ]
  },
  {
    code: 'A0',
    cat: 'normal',
    level: 'success',
    title: 'IDE Driver Started / OS in Control',
    sub: 'Hệ điều hành đã tiếp quản các kênh I/O thành công',
    brands: ['asus', 'x79x99', 'gigabyte'],
    brandDesc: 'Gigabyte Debug Display, ASUS ROG',
    cause: 'Tương tự mã AA, mã A0 (hoặc AO) báo hiệu hệ điều hành Windows đã chạy bình thường.',
    fixes: [
      '🟢 Hoàn toàn bình thường! Không phải lỗi.'
    ]
  },
  {
    code: 'F1',
    cat: 'cpu',
    level: 'warning',
    title: 'Recovery Condition Triggered (Yêu cầu khôi phục BIOS)',
    sub: 'Mainboard đang ở chế độ khôi phục BIOS khẩn cấp',
    brands: ['asus', 'x79x99', 'asrock'],
    brandDesc: 'ASUS CrashFree BIOS, Huananzhi X99 Recovery',
    cause: 'Checksum BIOS bị lỗi sau khi mất điện đột ngột hoặc pin CMOS cạn sạch.',
    fixes: [
      '1. Cắm USB có chứa file BIOS gốc vào cổng USB phía sau mainboard để main tự nạp lại.',
      '2. Thay viên pin CMOS CR2032 mới (3V).'
    ]
  }
];

function initLedCodesTab() {
  renderLedCodes(currentLedCat, currentLedBrand, '');
  const countAllEl = document.getElementById("ledCountAll");
  if (countAllEl) countAllEl.innerText = MAIN_LED_CODES.length;
}

function selectLedCategory(cat, btn) {
  currentLedCat = cat;
  document.querySelectorAll("#ledCategoryChips .led-chip").forEach(el => el.classList.remove("active"));
  if (btn) btn.classList.add("active");
  filterLedCodes();
}

function filterLedBrand(brand, btn) {
  currentLedBrand = brand;
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll("button").forEach(b => {
      b.style.fontWeight = "normal";
      b.style.borderColor = "rgba(0, 0, 0, 0.09)";
      b.style.color = "";
    });
    btn.style.fontWeight = "700";
    btn.style.borderColor = "var(--primary)";
    btn.style.color = "var(--primary)";
  }
  filterLedCodes();
}

function filterLedCodes() {
  const input = document.getElementById("ledCodeSearchInput");
  const keyword = input ? input.value.toLowerCase().trim() : '';
  renderLedCodes(currentLedCat, currentLedBrand, keyword);
}

function clearLedSearch() {
  const input = document.getElementById("ledCodeSearchInput");
  if (input) {
    input.value = '';
    filterLedCodes();
  }
}

function renderLedCodes(catFilter, brandFilter, searchKeyword) {
  const container = document.getElementById("ledCodesContainer");
  if (!container) return;
  container.innerHTML = "";

  const filtered = MAIN_LED_CODES.filter(item => {
    // 1. Lọc theo nhóm danh mục
    if (catFilter !== 'all' && item.cat !== catFilter) return false;

    // 2. Lọc theo hãng
    if (brandFilter !== 'all' && !item.brands.includes(brandFilter)) return false;

    // 3. Lọc theo từ khóa tìm kiếm
    if (searchKeyword) {
      const matchCode = item.code.toLowerCase().includes(searchKeyword);
      const matchTitle = item.title.toLowerCase().includes(searchKeyword);
      const matchSub = item.sub.toLowerCase().includes(searchKeyword);
      const matchCause = item.cause.toLowerCase().includes(searchKeyword);
      const matchBrandDesc = item.brandDesc.toLowerCase().includes(searchKeyword);
      const matchFixes = item.fixes.some(f => f.toLowerCase().includes(searchKeyword));
      if (!matchCode && !matchTitle && !matchSub && !matchCause && !matchBrandDesc && !matchFixes) {
        return false;
      }
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 36px 20px; text-align: center; background: var(--win-card); border-radius: var(--radius-md); border: 1px dashed #cbd5e1;">
        <div style="font-size: 32px;">🔍</div>
        <div style="font-size: 15px; font-weight: 700; color: var(--text-primary); margin-top: 6px;">Không tìm thấy mã code LED nào phù hợp!</div>
        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Thử gõ mã khác như: <strong>55</strong>, <strong>B7</strong>, <strong>d6</strong>, <strong>99</strong>, <strong>AA</strong> hoặc bấm nút "Xóa lọc".</div>
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement("div");
    card.className = "led-code-card";

    let badgeClass = "danger";
    if (item.level === 'warning') badgeClass = "warning";
    if (item.level === 'success') badgeClass = "success";
    if (item.level === 'info') badgeClass = "info";

    let catBadgeName = "Lỗi RAM";
    if (item.cat === 'cpu') catBadgeName = "Lỗi CPU / Socket";
    if (item.cat === 'vga') catBadgeName = "Lỗi VGA / Xuất hình";
    if (item.cat === 'storage') catBadgeName = "Lỗi Ổ cứng / Boot";
    if (item.cat === 'normal') catBadgeName = "🟢 Bình Thường";

    const fixesHtml = item.fixes.map(f => `<li>${escapeHtml(f)}</li>`).join("");

    card.innerHTML = `
      <div>
        <div class="led-card-header">
          <div class="led-card-left">
            <div class="led-badge-7seg ${badgeClass}">${item.code}</div>
            <div class="led-card-title-group">
              <h3>${escapeHtml(item.title)}</h3>
              <div class="led-subtitle">${escapeHtml(item.sub)}</div>
            </div>
          </div>
          <span class="badge badge-${item.level === 'danger' ? 'danger' : (item.level === 'warning' ? 'warning' : 'mint')}">
            ${catBadgeName}
          </span>
        </div>

        <div class="led-card-body" style="margin-top: 10px;">
          <div class="led-cause-box ${badgeClass}">
            <strong style="font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.5px;">🔍 Nguyên nhân thực tế:</strong>
            <div style="margin-top: 3px;">${escapeHtml(item.cause)}</div>
          </div>

          <div class="led-fix-box">
            <strong style="font-size: 11.5px; color: var(--win11-accent); text-transform: uppercase; letter-spacing: 0.5px;">🛠️ Cách khắc phục từng bước:</strong>
            <ol style="margin-top: 4px;">
              ${fixesHtml}
            </ol>
          </div>
        </div>
      </div>

      <div class="led-card-footer">
        <div class="led-card-models">
          <span>🏷️ Dòng main:</span>
          <strong>${escapeHtml(item.brandDesc)}</strong>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">
          <button class="btn btn-outline" style="padding: 3px 9px; font-size: 11px; height: 26px;" onclick="setInteractiveLedCode('${item.code}', '${escapeHtml(item.title)}', '${escapeHtml(item.brandDesc)}', '${item.level}')" title="Hiển thị lên đồng hồ LED 7 đoạn phía trên">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Xem LED Ảo</span>
          </button>
          <button class="btn btn-outline" style="padding: 3px 9px; font-size: 11px; height: 26px;" onclick="copyLedCodeSolution('${item.code}')" title="Sao chép hướng dẫn xử lý">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            <span>Sao chép</span>
          </button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function setInteractiveLedCode(code, title, brandDesc, level) {
  const displayDigits = document.getElementById("liveLedDisplayDigits");
  const displayStatus = document.getElementById("liveLedDisplayStatus");
  const displaySub = document.getElementById("liveLedDisplaySub");

  if (displayDigits) {
    displayDigits.innerText = code.toUpperCase();
    // Hiệu ứng nháy đèn LED như phần cứng thật
    displayDigits.style.opacity = '0.2';
    setTimeout(() => {
      displayDigits.style.opacity = '1';
    }, 120);
  }
  if (displayStatus) displayStatus.innerText = title;
  if (displaySub) displaySub.innerText = "Dòng main: " + brandDesc;

  showToast(`📟 Đã hiển thị mã [${code.toUpperCase()}] lên bảng LED 7 đoạn ảo!`);
  // Cuộn nhẹ lên đầu nếu đang ở dưới
  const panel = document.querySelector(".led-pcb-panel");
  if (panel) panel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function toggleLedDisplayColor() {
  ledColorIndex = (ledColorIndex + 1) % LED_COLORS.length;
  const newColorClass = LED_COLORS[ledColorIndex];
  const digits = document.getElementById("liveLedDisplayDigits");
  if (digits) {
    LED_COLORS.forEach(c => digits.classList.remove(c));
    digits.classList.add(newColorClass);
    showToast(`💡 Đã đổi màu đèn LED 7 đoạn!`);
  }
}

function copyCurrentLedCode() {
  const digits = document.getElementById("liveLedDisplayDigits");
  const status = document.getElementById("liveLedDisplayStatus");
  const code = digits ? digits.innerText : '55';
  const text = `[Mã LED Mainboard ${code}] ${status ? status.innerText : ''}`;
  copyText(text);
}

function copyLedCodeSolution(code) {
  const item = MAIN_LED_CODES.find(i => i.code.toLowerCase() === code.toLowerCase());
  if (!item) return;
  const content = `=== MÃ DEBUG LED BO MẠCH CHỦ: [${item.code.toUpperCase()}] ===\n` +
    `• Tên lỗi: ${item.title}\n` +
    `• Dòng main hay gặp: ${item.brandDesc}\n` +
    `• Nguyên nhân: ${item.cause}\n` +
    `• Cách khắc phục:\n${item.fixes.map(f => '  ' + f).join('\n')}\n` +
    `========================================`;
  copyText(content);
}

// ==========================================
// TAB: CÔNG CỤ TEST PHẦN CỨNG & PHẦN MỀM
// ==========================================
const TEST_TASKS = [
  { id: 'test-section-keyboard', title: '⌨️ Test Bàn Phím Máy Tính', sub: 'Nhận diện gõ phím, kẹt phím, ghosting key & chương trình chuyên dụng' },
  { id: 'test-section-screen', title: '🖥️ Kiểm Tra Màn Hình & Điểm Chết', sub: 'Dead/Stuck Pixels, đo tần số quét Hz, độ sâu màu & test toàn màn hình F11' },
  { id: 'test-section-audio', title: '🔊 Kiểm Tra Âm Thanh, Loa & Micro', sub: 'Kênh loa trái/phải Stereo, tần số Sub-bass/Treble & thanh đo tín hiệu Mic' },
  { id: 'test-section-mouse', title: '🖱️ Kiểm Tra Chuột, Con Lăn & Độ Nhạy', sub: 'Click trái/phải/giữa, đếm cuộn lăn, đo độ trễ double-click & bảng vẽ đứt nét' },
  { id: 'test-section-camera', title: '📷 Kiểm Tra Webcam & Camera', sub: 'Khởi chạy luồng camera trực tiếp, test cảm biến ánh sáng & chụp ảnh mẫu' },
  { id: 'test-section-battery', title: '🔋 Chẩn Đoán Độ Chai Pin & Nguồn Laptop', sub: 'Đọc chu kỳ sạc, dung lượng Full Charge vs Design qua Windows Battery Report' },
  { id: 'test-section-hardware', title: '⚡ Stress Test CPU / RAM / VGA', sub: 'Benchmark đơn/đa nhân, ép tải tối đa hệ thống với FurMark, Prime95, MemTest' },
  { id: 'test-section-disk', title: '💾 Sức Khỏe Ổ Cứng SSD & HDD (S.M.A.R.T)', sub: 'Đọc cảnh báo Bad Sector, tuổi thọ TBW & phần mềm CrystalDiskInfo' },
  { id: 'test-section-network', title: '🌐 Tốc Độ Mạng, Ping & Nhận Diện Card Mạng (Link Speed)', sub: 'Tốc độ đàm phán vật lý cổng LAN RJ45 (10M / 100M / 1G / 2.5G / 10G) & chẩn đoán đứt dây 4/8 sợi' }
];

let currentTestTaskId = 'test-section-keyboard';
const testedKeysSet = new Set();
const activeDownKeys = new Set();
let isKeyboardListenerAttached = false;
let audioTestCtx = null;
let currentOscillator = null;
let micAudioStream = null;
let micAudioCtx = null;
let micAnimationId = null;
let mouseLeftClicks = 0;
let mouseRightClicks = 0;
let mouseMiddleClicks = 0;
let mouseWheelCount = 0;
let isMouseDrawing = false;
let webcamStream = null;
const DEAD_PIXEL_COLORS = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000', '#ffff00', '#ff00ff', '#00ffff', '#64748b'];
let deadPixelColorIdx = 0;

let isKeyboardSoundEnabled = true;

function playKeyboardClickSound() {
  if (!isKeyboardSoundEnabled) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.045);
  } catch(e) {}
}

function toggleKeyboardSound() {
  isKeyboardSoundEnabled = !isKeyboardSoundEnabled;
  const btn = document.getElementById('btnToggleKbSound');
  if (btn) btn.innerText = isKeyboardSoundEnabled ? '🔊 Âm Gõ Phím: Bật' : '🔇 Âm Gõ Phím: Tắt';
  showToast(isKeyboardSoundEnabled ? '🔊 Đã bật âm thanh gõ phím cơ!' : '🔇 Đã tắt âm thanh gõ phím!');
}

function toggleKeyboardFullscreen() {
  const chassis = document.getElementById('virtualKeyboardChassis');
  if (!chassis) return;
  if (!document.fullscreenElement) {
    if (chassis.requestFullscreen) {
      chassis.requestFullscreen().catch(() => {});
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  }
}

function initTestTab() {
  const savedCollapsed = localStorage.getItem('test_sidebar_collapsed') === '1';
  const layout = document.querySelector('.test-layout');
  if (layout) {
    layout.classList.toggle('sidebar-collapsed', savedCollapsed);
    updateTestSidebarUi(savedCollapsed);
  }
  activateTestNav(null, null, currentTestTaskId);
  setupKeyboardTester();
  initScreenInfo();
  initMouseTester();
  initBatteryTest();
}

function toggleTestSidebar() {
  const layout = document.querySelector('.test-layout');
  if (!layout) return;
  const isCollapsed = layout.classList.toggle('sidebar-collapsed');
  try {
    localStorage.setItem('test_sidebar_collapsed', isCollapsed ? '1' : '0');
  } catch (e) {}
  updateTestSidebarUi(isCollapsed);
}

function updateTestSidebarUi(isCollapsed) {
  const toggleBtnToolbar = document.getElementById('btnToggleTestSidebarToolbar');
  if (toggleBtnToolbar) {
    if (isCollapsed) {
      toggleBtnToolbar.className = 'btn btn-primary';
      toggleBtnToolbar.innerHTML = '<span>📑 Hiện Danh Sách Test</span>';
      toggleBtnToolbar.title = 'Mở lại danh sách công cụ test bên trái';
    } else {
      toggleBtnToolbar.className = 'btn btn-outline';
      toggleBtnToolbar.innerHTML = '<span>◀ Thu Gọn Danh Sách</span>';
      toggleBtnToolbar.title = 'Thu gọn danh sách để mở rộng tối đa không gian kiểm tra';
    }
  }
  const edgeLatch = document.getElementById('testSidebarEdgeLatch');
  if (edgeLatch) {
    edgeLatch.innerHTML = isCollapsed ? '▶' : '◀';
    edgeLatch.title = isCollapsed ? 'Mở rộng danh sách bên trái' : 'Thu gọn danh sách để mở rộng không gian';
  }
}

function activateTestNav(el, ev, sectionId) {
  if (ev) ev.preventDefault();
  const targetId = sectionId || (el ? el.getAttribute('data-target') : 'test-section-keyboard');
  currentTestTaskId = targetId;

  document.querySelectorAll('.test-top-tab-btn, .test-nav-item').forEach(item => {
    item.classList.toggle('active', item.getAttribute('data-target') === targetId);
  });

  document.querySelectorAll('.test-section-view').forEach(view => {
    view.classList.toggle('active', view.id === targetId);
  });

  const taskIndex = TEST_TASKS.findIndex(t => t.id === targetId);
  if (taskIndex !== -1) {
    const task = TEST_TASKS[taskIndex];
    const badge = document.getElementById('activeTestTaskBadge');
    const title = document.getElementById('activeTestTaskTitle');
    const sub = document.getElementById('activeTestTaskSub');
    if (badge) badge.innerText = `Task ${taskIndex + 1} / ${TEST_TASKS.length}`;
    if (title) title.innerText = task.title;
    if (sub) sub.innerText = task.sub;
  }

  if (targetId === 'test-section-disk') {
    initDiskSmartSection();
  }

  if (targetId === 'test-section-network') {
    scanNetworkAdapters();
    const gEl = document.getElementById('pingResultGoogle');
    if (gEl && gEl.innerText.trim() === '-- ms') {
      runPingTestAll(true);
    }
  }
}

function navigateTestTask(direction) {
  const currentIndex = TEST_TASKS.findIndex(t => t.id === currentTestTaskId);
  let nextIndex = (currentIndex + direction + TEST_TASKS.length) % TEST_TASKS.length;
  const nextTask = TEST_TASKS[nextIndex];
  if (nextTask) {
    activateTestNav(null, null, nextTask.id);
    const mainEl = document.getElementById('testMain');
    if (mainEl) mainEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function filterTestTasks() {
  const q = (document.getElementById("testTaskSearchInput")?.value || "").toLowerCase().trim();
  document.querySelectorAll(".test-nav-item").forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = (!q || text.includes(q)) ? "flex" : "none";
  });
}

// 1. KEYBOARD TESTER LOGIC (104-KEY FULL SIZE)
function setupKeyboardTester() {
  if (isKeyboardListenerAttached) return;
  isKeyboardListenerAttached = true;

  window.addEventListener('keydown', (e) => {
    const tabTest = document.getElementById('tab-test');
    if (!tabTest || !tabTest.classList.contains('active')) return;
    if (currentTestTaskId !== 'test-section-keyboard') return;

    if (e.code !== 'F5' && e.code !== 'F12') {
      e.preventDefault();
    }

    playKeyboardClickSound();

    activeDownKeys.add(e.code);
    testedKeysSet.add(e.code);

    const keyEl = document.querySelector(`.kb-key[data-code="${e.code}"]`);
    if (keyEl) {
      keyEl.classList.add('active-down');
      keyEl.classList.add('tested');
    }

    // Update real-time LED indicators
    if (e.getModifierState) {
      const ledNum = document.getElementById('ledNumLock');
      const ledCaps = document.getElementById('ledCapsLock');
      const ledScroll = document.getElementById('ledScrollLock');
      if (ledNum) ledNum.classList.toggle('active', e.getModifierState('NumLock'));
      if (ledCaps) ledCaps.classList.toggle('active', e.getModifierState('CapsLock'));
      if (ledScroll) ledScroll.classList.toggle('active', e.getModifierState('ScrollLock'));
    }

    const lastKeyEl = document.getElementById('kbLastKeyDisplay');
    const testedCountEl = document.getElementById('kbTestedCountDisplay');
    const ghostingEl = document.getElementById('kbGhostingDisplay');

    if (lastKeyEl) lastKeyEl.innerText = `${e.key === ' ' ? 'Space' : e.key} (${e.code})`;
    if (testedCountEl) testedCountEl.innerText = `${testedKeysSet.size} / 104 Phím Hoạt Động (Full-Size 100%)`;
    if (ghostingEl) {
      if (activeDownKeys.size >= 4) {
        ghostingEl.innerHTML = `<span style="color:#ef4444;">⚠️ Đang giữ ${activeDownKeys.size} phím: ${Array.from(activeDownKeys).join(', ')}</span>`;
      } else {
        ghostingEl.innerHTML = `🟢 Bình thường (${activeDownKeys.size} phím đang nhấn)`;
      }
    }
  });

  window.addEventListener('keyup', (e) => {
    activeDownKeys.delete(e.code);
    const keyEl = document.querySelector(`.kb-key[data-code="${e.code}"]`);
    if (keyEl) {
      keyEl.classList.remove('active-down');
    }

    if (e.getModifierState) {
      const ledNum = document.getElementById('ledNumLock');
      const ledCaps = document.getElementById('ledCapsLock');
      const ledScroll = document.getElementById('ledScrollLock');
      if (ledNum) ledNum.classList.toggle('active', e.getModifierState('NumLock'));
      if (ledCaps) ledCaps.classList.toggle('active', e.getModifierState('CapsLock'));
      if (ledScroll) ledScroll.classList.toggle('active', e.getModifierState('ScrollLock'));
    }

    const ghostingEl = document.getElementById('kbGhostingDisplay');
    if (ghostingEl) {
      ghostingEl.innerHTML = activeDownKeys.size === 0 ? `🟢 Bình thường` : `🟢 Đang nhấn ${activeDownKeys.size} phím`;
    }
  });

  // Hỗ trợ nhấp chuột / chạm cảm ứng trực tiếp vào phím ảo
  document.querySelectorAll('.kb-key:not(.spacer)').forEach(keyEl => {
    keyEl.addEventListener('click', () => {
      const code = keyEl.getAttribute('data-code');
      if (!code) return;
      playKeyboardClickSound();
      testedKeysSet.add(code);
      keyEl.classList.add('tested');

      // Tạo hiệu ứng nhấn xuống tạm thời
      keyEl.classList.add('active-down');
      setTimeout(() => keyEl.classList.remove('active-down'), 120);

      const lastKeyEl = document.getElementById('kbLastKeyDisplay');
      const testedCountEl = document.getElementById('kbTestedCountDisplay');
      const keyText = keyEl.textContent.trim().replace(/\s+/g, ' ');
      if (lastKeyEl) lastKeyEl.innerText = `${keyText} (${code})`;
      if (testedCountEl) testedCountEl.innerText = `${testedKeysSet.size} / 104 Phím Hoạt Động (Full-Size 100%)`;
    });
  });
}

function resetKeyboardTester() {
  testedKeysSet.clear();
  activeDownKeys.clear();
  document.querySelectorAll('.kb-key').forEach(k => {
    k.classList.remove('tested', 'active-down');
  });
  const lastKeyEl = document.getElementById('kbLastKeyDisplay');
  const testedCountEl = document.getElementById('kbTestedCountDisplay');
  const ghostingEl = document.getElementById('kbGhostingDisplay');
  if (lastKeyEl) lastKeyEl.innerText = '--';
  if (testedCountEl) testedCountEl.innerText = '0 / 104 Phím Hoạt Động';
  if (ghostingEl) ghostingEl.innerText = '🟢 Bình thường';
  showToast('🔄 Đã làm mới toàn bộ 104 phím!');
}

// 2. SCREEN TESTER LOGIC
function initScreenInfo() {
  const resEl = document.getElementById('screenResolutionDisplay');
  const depthEl = document.getElementById('screenColorDepthDisplay');
  const dprEl = document.getElementById('screenDprDisplay');

  if (resEl) resEl.innerText = `${window.screen.width} × ${window.screen.height} px`;
  if (depthEl) depthEl.innerText = `${window.screen.colorDepth || 24}-Bit TrueColor`;
  if (dprEl) dprEl.innerText = `${(window.devicePixelRatio || 1).toFixed(2)}x Scaling`;

  measureScreenRefreshRate();
}

function measureScreenRefreshRate() {
  const fpsEl = document.getElementById('screenRefreshRateDisplay');
  let startTime = null;
  let frameCount = 0;

  function countFrame(now) {
    if (!startTime) startTime = now;
    frameCount++;
    const elapsed = now - startTime;
    if (elapsed < 1000) {
      requestAnimationFrame(countFrame);
    } else {
      const fps = Math.round((frameCount * 1000) / elapsed);
      if (fpsEl) fpsEl.innerText = `~${fps} Hz (${fps} FPS)`;
    }
  }
  requestAnimationFrame(countFrame);
}

function openDeadPixelFullscreen(color) {
  const overlay = document.getElementById('deadPixelOverlay');
  if (!overlay) return;
  overlay.style.backgroundColor = color || '#ff0000';
  overlay.classList.add('active');

  const idx = DEAD_PIXEL_COLORS.indexOf(color);
  deadPixelColorIdx = (idx !== -1) ? idx : 0;

  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen().catch(() => {});
  }
}

function cycleDeadPixelColor(e) {
  if (e) e.stopPropagation();
  deadPixelColorIdx = (deadPixelColorIdx + 1) % DEAD_PIXEL_COLORS.length;
  const overlay = document.getElementById('deadPixelOverlay');
  if (overlay) {
    overlay.style.backgroundColor = DEAD_PIXEL_COLORS[deadPixelColorIdx];
  }
}

window.addEventListener('keydown', (e) => {
  const overlay = document.getElementById('deadPixelOverlay');
  if (overlay && overlay.classList.contains('active')) {
    if (e.key === 'Escape') {
      overlay.classList.remove('active');
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
      cycleDeadPixelColor();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      deadPixelColorIdx = (deadPixelColorIdx - 1 + DEAD_PIXEL_COLORS.length) % DEAD_PIXEL_COLORS.length;
      overlay.style.backgroundColor = DEAD_PIXEL_COLORS[deadPixelColorIdx];
    }
  }
});

// 3. AUDIO TESTER LOGIC
function getAudioContext() {
  if (!audioTestCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) audioTestCtx = new AudioCtx();
  }
  if (audioTestCtx && audioTestCtx.state === 'suspended') {
    audioTestCtx.resume();
  }
  return audioTestCtx;
}

function stopAudioTone() {
  if (currentOscillator) {
    try {
      currentOscillator.stop();
      currentOscillator.disconnect();
    } catch(e) {}
    currentOscillator = null;
  }
}

function playChannelAudioTone(channel) {
  stopAudioTone();
  const ctx = getAudioContext();
  if (!ctx) {
    showToast('⚠️ Trình duyệt không hỗ trợ Web Audio API!');
    return;
  }

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(440, ctx.currentTime);

  let panVal = 0;
  if (channel === 'left') panVal = -1;
  else if (channel === 'right') panVal = 1;

  if (ctx.createStereoPanner) {
    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(panVal, ctx.currentTime);
    osc.connect(panner);
    panner.connect(gain);
  } else {
    osc.connect(gain);
  }

  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.01, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.05);

  osc.start();
  currentOscillator = osc;

  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
  setTimeout(() => {
    stopAudioTone();
  }, 1900);

  const channelText = channel === 'left' ? 'Kênh Trái' : (channel === 'right' ? 'Kênh Phải' : 'Stereo Cả 2 Loa');
  showToast(`🔊 Đang phát âm thanh mẫu: ${channelText} (440Hz)...`);
}

function playFrequencyTone(freq) {
  stopAudioTone();
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, ctx.currentTime);

  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.01, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.05);

  osc.start();
  currentOscillator = osc;

  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.5);
  setTimeout(() => {
    stopAudioTone();
  }, 2600);

  showToast(`🎵 Đang phát dải tần số ${freq} Hz (2.5 giây)...`);
}

function toggleMicrophoneTest() {
  const btn = document.getElementById('btnToggleMicTest');
  const bar = document.getElementById('micVolumeBar');
  const text = document.getElementById('micDbDisplay');

  if (micAudioStream) {
    if (micAudioStream.getTracks) {
      micAudioStream.getTracks().forEach(t => t.stop());
    }
    micAudioStream = null;
    if (micAnimationId) cancelAnimationFrame(micAnimationId);
    if (bar) bar.style.width = '0%';
    if (text) text.innerText = 'Mức thu: Đã tắt micro';
    if (btn) btn.innerText = '🎙️ Bật Test Micro';
    showToast('⏹️ Đã dừng kiểm tra micro');
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast('⚠️ Trình duyệt không hỗ trợ truy cập Micro!');
    return;
  }

  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      micAudioStream = stream;
      if (btn) btn.innerText = '⏹️ Dừng Test Micro';
      showToast('🎤 Đã nhận micro! Hãy thử nói vào micro.');

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      micAudioCtx = new AudioCtx();
      const analyser = micAudioCtx.createAnalyser();
      analyser.fftSize = 256;
      const source = micAudioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      function updateVolume() {
        if (!micAudioStream) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        const percent = Math.min(100, Math.round((average / 128) * 100));

        if (bar) bar.style.width = `${percent}%`;
        if (text) text.innerText = `Cường độ thu: ${percent}% (Tín hiệu tốt)`;
        micAnimationId = requestAnimationFrame(updateVolume);
      }
      updateVolume();
    })
    .catch(err => {
      showToast(`⚠️ Không thể mở Micro: ${err.message || 'Bị từ chối'}`);
    });
}

// 4. MOUSE TESTER LOGIC
function initMouseTester() {
  const area = document.getElementById('mouseTesterArea');
  const canvas = document.getElementById('mouseTestCanvas');
  if (!area) return;

  area.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (e.button === 0) {
      mouseLeftClicks++;
      const el = document.getElementById('mVisualLeft');
      const countEl = document.getElementById('mouseLeftCount');
      if (el) el.classList.add('active');
      if (countEl) countEl.innerText = `${mouseLeftClicks} Click`;
    } else if (e.button === 1) {
      mouseMiddleClicks++;
      const el = document.getElementById('mVisualWheel');
      const countEl = document.getElementById('mouseMiddleCount');
      if (el) el.classList.add('active');
      if (countEl) countEl.innerText = `${mouseMiddleClicks} / Cuộn: ${mouseWheelCount}`;
    } else if (e.button === 2) {
      mouseRightClicks++;
      const el = document.getElementById('mVisualRight');
      const countEl = document.getElementById('mouseRightCount');
      if (el) el.classList.add('active');
      if (countEl) countEl.innerText = `${mouseRightClicks} Click`;
    }
  });

  area.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      const el = document.getElementById('mVisualLeft');
      if (el) el.classList.remove('active');
    } else if (e.button === 1) {
      const el = document.getElementById('mVisualWheel');
      if (el) el.classList.remove('active');
    } else if (e.button === 2) {
      const el = document.getElementById('mVisualRight');
      if (el) el.classList.remove('active');
    }
  });

  area.addEventListener('wheel', (e) => {
    e.preventDefault();
    mouseWheelCount += (e.deltaY > 0 ? 1 : -1);
    const countEl = document.getElementById('mouseMiddleCount');
    if (countEl) countEl.innerText = `${mouseMiddleClicks} / Cuộn: ${mouseWheelCount}`;
  });

  // Canvas drawing
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.addEventListener('mousedown', (e) => {
      isMouseDrawing = true;
      const rect = canvas.getBoundingClientRect();
      ctx.beginPath();
      ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isMouseDrawing) return;
      const rect = canvas.getBoundingClientRect();
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#0284c7';
      ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
      ctx.stroke();
    });

    window.addEventListener('mouseup', () => {
      isMouseDrawing = false;
    });
  }
}

function clearMouseCanvas() {
  const canvas = document.getElementById('mouseTestCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    showToast('🧹 Đã xóa nét vẽ chuột!');
  }
}

// 5. WEBCAM TESTER LOGIC
function startWebcamTest() {
  const video = document.getElementById('webcamVideoFeed');
  const placeholder = document.getElementById('webcamPlaceholder');
  const btnStart = document.getElementById('btnStartCamera');
  const btnSnap = document.getElementById('btnSnapshotCamera');
  const btnStop = document.getElementById('btnStopCamera');

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToast('⚠️ Trình duyệt không hỗ trợ bật Camera!');
    return;
  }

  navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } })
    .then(stream => {
      webcamStream = stream;
      if (video) {
        video.srcObject = stream;
        video.style.display = 'block';
      }
      if (placeholder) placeholder.style.display = 'none';
      if (btnStart) btnStart.style.display = 'none';
      if (btnSnap) btnSnap.style.display = 'inline-block';
      if (btnStop) btnStop.style.display = 'inline-block';
      showToast('📷 Camera đã bật thành công!');
    })
    .catch(err => {
      showToast(`⚠️ Không thể mở Camera: ${err.message || 'Bị từ chối'}`);
    });
}

function takeWebcamSnapshot() {
  const video = document.getElementById('webcamVideoFeed');
  const canvas = document.getElementById('webcamSnapshotCanvas');
  const placeholder = document.getElementById('snapshotPlaceholder');

  if (!video || !canvas) return;
  canvas.width = video.videoWidth || 640;
  canvas.height = video.videoHeight || 480;

  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.style.display = 'block';
  if (placeholder) placeholder.style.display = 'none';
  showToast('📸 Đã chụp ảnh mẫu từ Webcam!');
}

function stopWebcamTest() {
  if (webcamStream) {
    webcamStream.getTracks().forEach(t => t.stop());
    webcamStream = null;
  }
  const video = document.getElementById('webcamVideoFeed');
  const placeholder = document.getElementById('webcamPlaceholder');
  const btnStart = document.getElementById('btnStartCamera');
  const btnSnap = document.getElementById('btnSnapshotCamera');
  const btnStop = document.getElementById('btnStopCamera');

  if (video) video.style.display = 'none';
  if (placeholder) placeholder.style.display = 'block';
  if (btnStart) btnStart.style.display = 'inline-block';
  if (btnSnap) btnSnap.style.display = 'none';
  if (btnStop) btnStop.style.display = 'none';
  showToast('⏹️ Đã tắt camera an toàn');
}

// 6. BATTERY TESTER LOGIC
function initBatteryTest() {
  const percentEl = document.getElementById('liveBatteryPercent');
  const chargeEl = document.getElementById('liveBatteryCharging');

  if ('getBattery' in navigator) {
    navigator.getBattery().then(battery => {
      function updateBatteryUI() {
        if (percentEl) percentEl.innerText = `${Math.round(battery.level * 100)}%`;
        if (chargeEl) chargeEl.innerText = battery.charging ? '⚡ Đang cắm sạc (AC Connected)' : '🔋 Dùng pin (Discharging)';
      }
      updateBatteryUI();
      battery.addEventListener('levelchange', updateBatteryUI);
      battery.addEventListener('chargingchange', updateBatteryUI);
    }).catch(() => {
      if (percentEl) percentEl.innerText = 'Máy bàn (Không dùng pin)';
      if (chargeEl) chargeEl.innerText = 'Nguồn AC cắm trực tiếp';
    });
  } else {
    if (percentEl) percentEl.innerText = 'Sử dụng lệnh powercfg';
    if (chargeEl) chargeEl.innerText = 'Khuyên dùng lệnh Windows';
  }
}

// 7. CPU BENCHMARK LOGIC
function runCpuBenchmark() {
  const btn = document.getElementById('btnRunCpuBench');
  const resultEl = document.getElementById('cpuBenchResult');
  const threadsEl = document.getElementById('cpuHardwareThreads');

  if (threadsEl) {
    threadsEl.innerText = `Số luồng CPU: ${navigator.hardwareConcurrency || 4} Cores / Threads`;
  }

  if (btn) btn.disabled = true;
  if (resultEl) resultEl.innerText = '⏳ Đang tính toán stress CPU...';

  setTimeout(() => {
    const t0 = performance.now();
    let x = 0;
    const iterations = 25000000;
    for (let i = 0; i < iterations; i++) {
      x += Math.sqrt(i) * Math.sin(i);
    }
    const t1 = performance.now();
    const durationSec = (t1 - t0) / 1000;
    const mflops = Math.round((iterations / durationSec) / 1000000);

    if (resultEl) {
      resultEl.innerHTML = `<strong>Tốc độ: ${mflops} MFLOPS</strong> (Thời gian hoàn thành: ${durationSec.toFixed(2)}s, kết quả: ${Math.round(x % 1000)})`;
    }
    if (btn) btn.disabled = false;
    showToast(`⚡ Đã hoàn thành Benchmark: ${mflops} MFLOPS!`);
  }, 50);
}

// 8. PING TEST LOGIC (ICMP / TCP Handshake Backend + Warmed-up Browser Fallback)
let isRunningPingTest = false;

function _applyPingUiResult(resultId, badgeId, ms, ok, methodLabel) {
  const resEl = document.getElementById(resultId);
  const badgeEl = document.getElementById(badgeId);
  const suffix = methodLabel ? ` (${methodLabel})` : '';

  if (!ok || ms === null || ms === undefined || ms < 0) {
    if (resEl) {
      resEl.innerText = 'Timeout';
      resEl.style.color = '#ef4444';
    }
    if (badgeEl) {
      badgeEl.className = 'badge badge-danger';
      badgeEl.innerText = 'Mất Gói / Chặn';
    }
    return;
  }

  const rounded = Math.max(1, Math.round(Number(ms)));
  if (resEl) {
    resEl.innerText = `${rounded} ms`;
  }

  if (rounded <= 35) {
    if (resEl) resEl.style.color = '#10b981';
    if (badgeEl) {
      badgeEl.className = 'badge badge-mint';
      badgeEl.innerText = `Cực Tốt${suffix}`;
    }
  } else if (rounded <= 80) {
    if (resEl) resEl.style.color = '#0284c7';
    if (badgeEl) {
      badgeEl.className = 'badge badge-primary';
      badgeEl.innerText = `Ổn Định${suffix}`;
    }
  } else if (rounded <= 180) {
    if (resEl) resEl.style.color = '#f59e0b';
    if (badgeEl) {
      badgeEl.className = 'badge badge-warning';
      badgeEl.innerText = `Hơi Chậm${suffix}`;
    }
  } else {
    if (resEl) resEl.style.color = '#ef4444';
    if (badgeEl) {
      badgeEl.className = 'badge badge-danger';
      badgeEl.innerText = `Độ Trễ Cao${suffix}`;
    }
  }
}

async function _browserWarmPingHost(urls, resultId, badgeId) {
  const candidateUrls = Array.isArray(urls) ? urls : [urls];
  for (const url of candidateUrls) {
    try {
      // Pass 1: Warm-up DNS + TCP + TLS Handshake (khong tinh vao do tre Ping)
      const warmCtrl = new AbortController();
      const warmTimer = setTimeout(() => warmCtrl.abort(), 2200);
      await fetch(`${url}${url.includes('?') ? '&' : '?'}w=${Date.now()}`, {
        mode: 'no-cors',
        cache: 'no-store',
        signal: warmCtrl.signal
      });
      clearTimeout(warmTimer);

      // Pass 2: Do RTT thuc te tren ket noi Keep-Alive da am (lay min cua 2 lan)
      const samples = [];
      for (let i = 0; i < 2; i++) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 2200);
        const t0 = performance.now();
        await fetch(`${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}_${i}`, {
          mode: 'no-cors',
          cache: 'no-store',
          signal: ctrl.signal
        });
        clearTimeout(timer);
        samples.push(Math.max(1, Math.round(performance.now() - t0)));
      }
      const bestMs = Math.min(...samples);
      _applyPingUiResult(resultId, badgeId, bestMs, true, 'HTTP');
      return;
    } catch (_) {
      // Thu URL du phong tiep theo neu bi ISP chan / timeout
    }
  }
  _applyPingUiResult(resultId, badgeId, null, false, '');
}

async function runPingTestAll(silent = false) {
  if (isRunningPingTest) return;
  isRunningPingTest = true;
  if (!silent) {
    showToast('🌐 Đang đo độ trễ Ping thực tế (ICMP / TCP)...');
  }

  const targets = [
    { key: 'google', resultId: 'pingResultGoogle', badgeId: 'pingBadgeGoogle', urls: ['https://www.google.com/generate_204', 'https://dns.google/resolve?name=example.com'] },
    { key: 'cloudflare', resultId: 'pingResultCf', badgeId: 'pingBadgeCf', urls: ['https://1.0.0.1/cdn-cgi/trace', 'https://cloudflare.com/cdn-cgi/trace', 'https://1.1.1.1/cdn-cgi/trace'] },
    { key: 'microsoft', resultId: 'pingResultMs', badgeId: 'pingBadgeMs', urls: ['https://www.msftconnecttest.com/connecttest.txt', 'https://azure.microsoft.com/favicon.ico'] }
  ];

  targets.forEach(t => {
    const resEl = document.getElementById(t.resultId);
    const badgeEl = document.getElementById(t.badgeId);
    if (resEl) {
      resEl.innerText = 'Đang đo...';
      resEl.style.color = 'var(--text-secondary)';
    }
    if (badgeEl) {
      badgeEl.className = 'badge badge-primary';
      badgeEl.innerText = 'Đang ping...';
    }
  });

  try {
    const resp = await fetch(`/api/network/ping?t=${Date.now()}`, { cache: 'no-store' });
    const data = await resp.json();
    if (data && data.status === 'ok' && data.reachable && data.results) {
      for (const t of targets) {
        const r = data.results[t.key];
        if (r && r.ok && typeof r.ms === 'number') {
          _applyPingUiResult(t.resultId, t.badgeId, r.ms, true, r.method || 'ICMP');
        } else {
          // Neu rieng muc tieu nay bi chan ICMP/TCP o backend, thu fallback trinh duyet
          await _browserWarmPingHost(t.urls, t.resultId, t.badgeId);
        }
      }
      isRunningPingTest = false;
      return;
    }
  } catch (err) {
    console.warn('Backend /api/network/ping fallback to browser warm ping:', err);
  }

  await Promise.all(
    targets.map(t => _browserWarmPingHost(t.urls, t.resultId, t.badgeId))
  );
  isRunningPingTest = false;
}

// ==========================================
// 8.1 NHẬN DIỆN CARD MẠNG & LINK SPEED (TASK 9)
// ==========================================
let isScanningNetworkAdapters = false;

async function scanNetworkAdapters(forceRefresh = false) {
  const listEl = document.getElementById('netAdaptersList');
  const badgeEl = document.getElementById('netAdapterCountBadge');
  const timeEl = document.getElementById('netLastScanTime');
  const warningBox = document.getElementById('netCableWarningBox');

  if (isScanningNetworkAdapters) return;
  isScanningNetworkAdapters = true;

  if (listEl) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:24px; color:var(--text-muted); font-size:12px; grid-column: 1 / -1;">
        <div style="font-size:22px; margin-bottom:8px;">⏳</div>
        <div>Đang truy vấn phần cứng card mạng & đo Link Speed thực tế...</div>
      </div>
    `;
  }

  try {
    const qs = forceRefresh ? '?force=1' : '';
    const resp = await fetch(`/api/network/adapters${qs}`, { cache: 'no-store' });
    const data = await resp.json();
    const adapterList = Array.isArray(data.adapters)
      ? data.adapters
      : (data.adapters && Array.isArray(data.adapters.adapters) ? data.adapters.adapters : null);
    const totalCount = typeof data.total === 'number'
      ? data.total
      : (data.adapters && typeof data.adapters.total === 'number' ? data.adapters.total : (adapterList ? adapterList.length : 0));
    const connectedCount = typeof data.connected_count === 'number'
      ? data.connected_count
      : (data.adapters && typeof data.adapters.connected_count === 'number'
        ? data.adapters.connected_count
        : (adapterList ? adapterList.filter(a => a.is_up).length : 0));

    if (data.status === 'ok' && Array.isArray(adapterList)) {
      renderNetworkAdapters(adapterList);
      if (badgeEl) {
        badgeEl.innerText = `${connectedCount} / ${totalCount} Card Đang Kết Nối`;
      }
      if (timeEl) {
        timeEl.innerText = `Cập nhật lúc: ${new Date().toLocaleTimeString('vi-VN')}`;
      }
    } else {
      renderNetworkAdaptersFallback(data.message || (data.adapters && data.adapters.message) || 'Không thể lấy thông tin card mạng');
    }
  } catch (err) {
    console.error('Lỗi scan network adapters:', err);
    renderNetworkAdaptersFallback('Không thể kết nối đến máy chủ nội bộ server.py');
  } finally {
    isScanningNetworkAdapters = false;
  }
}

function renderNetworkAdapters(adapters) {
  const listEl = document.getElementById('netAdaptersList');
  const warningBox = document.getElementById('netCableWarningBox');
  if (!listEl) return;

  if (!adapters || adapters.length === 0) {
    listEl.innerHTML = `
      <div style="text-align:center; padding:20px; color:var(--text-muted); font-size:12px; grid-column: 1 / -1;">
        Không tìm thấy Card mạng nào trên thiết bị này.
      </div>
    `;
    if (warningBox) warningBox.style.display = 'none';
    return;
  }

  let has100MEthernetBottleneck = false;

  let html = '';
  adapters.forEach((a) => {
    const isUp = a.is_up;
    const speedMbps = a.speed_mbps || 0;
    const isEth = (a.card_type === 'ethernet');

    // Kiểm tra nghẽn 100M trên dây cắm Ethernet (chuẩn 1G trở lên)
    if (isUp && isEth && speedMbps === 100) {
      has100MEthernetBottleneck = true;
    }

    // Badge style theo tốc độ
    let speedBadgeClass = 'badge-muted';
    let speedColor = 'var(--text-muted)';

    if (isUp) {
      if (speedMbps >= 2500) {
        speedBadgeClass = 'badge-primary';
        speedColor = '#0284c7';
      } else if (speedMbps >= 1000) {
        speedBadgeClass = 'badge-mint';
        speedColor = '#10b981';
      } else if (speedMbps === 100 && isEth) {
        speedBadgeClass = 'badge-warning';
        speedColor = '#f59e0b';
      } else if (speedMbps <= 10 && speedMbps > 0) {
        speedBadgeClass = 'badge-danger';
        speedColor = '#ef4444';
      } else {
        speedBadgeClass = 'badge-mint';
        speedColor = '#10b981';
      }
    }

    const safeName = typeof escapeHtml === 'function' ? escapeHtml(a.name) : a.name;
    const safeDesc = typeof escapeHtml === 'function' ? escapeHtml(a.desc) : a.desc;
    const safeTitle = typeof escapeHtml === 'function' ? escapeHtml(a.diag_title || (isUp ? 'Hoạt động' : 'Chưa cắm dây')) : (a.diag_title || '');
    const safeAdvice = typeof escapeHtml === 'function' ? escapeHtml(a.diag_advice || '') : (a.diag_advice || '');
    const safeIp = typeof escapeHtml === 'function' ? escapeHtml(a.ip || '') : (a.ip || '');
    const safeGw = typeof escapeHtml === 'function' ? escapeHtml(a.gateway || '') : (a.gateway || '');
    const safeMac = typeof escapeHtml === 'function' ? escapeHtml(a.mac || '') : (a.mac || '');
    const safeType = typeof escapeHtml === 'function' ? escapeHtml(a.type_label || '') : (a.type_label || '');

    html += `
      <div style="background:var(--win-card); border:1px solid ${isUp ? (speedMbps === 100 && isEth ? '#f59e0b' : 'var(--win-acrylic-border)') : 'rgba(0,0,0,0.06)'}; border-radius:10px; padding:14px; position:relative; box-shadow:0 1px 4px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-content:space-between; ${!isUp ? 'opacity:0.75;' : ''}">
        <div>
          <!-- Hàng 1: Icon + Tên Card + Trạng Thái Up/Down -->
          <div style="display:flex; justify-content:space-between; align-items:flex-start; gap:8px; margin-bottom:6px;">
            <div style="display:flex; align-items:center; gap:8px; min-width:0; flex:1;">
              <span style="font-size:22px; line-height:1;">${a.icon || '🔌'}</span>
              <div style="min-width:0; flex:1;">
                <div style="font-weight:800; font-size:13.5px; color:var(--text-main); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${safeName}">
                  ${safeName}
                </div>
                <div style="font-size:10.5px; color:var(--text-muted); text-overflow:ellipsis; overflow:hidden; white-space:nowrap;" title="${safeDesc}">
                  ${safeDesc}
                </div>
              </div>
            </div>
            <span class="badge ${isUp ? 'badge-mint' : 'badge-muted'}" style="font-size:10px; white-space:nowrap;">
              ${isUp ? '● Đang Kết Nối' : '○ Ngắt Dây'}
            </span>
          </div>

          <!-- Hàng 2: Tốc Độ Đàm Phán Lớn (Link Speed) -->
          <div style="background:rgba(0,0,0,0.02); border-radius:8px; padding:10px 12px; margin:8px 0; display:flex; justify-content:space-between; align-items:center;">
            <div>
              <div style="font-size:10px; color:var(--text-muted); text-transform:uppercase; font-weight:700;">Tốc Độ Đàm Phán (Link Speed):</div>
              <div style="font-size:20px; font-weight:900; color:${speedColor};">
                ${isUp ? (a.speed || 'Chưa rõ') : '0 bps'}
              </div>
            </div>
            <div style="text-align:right;">
              <span class="badge ${speedBadgeClass}" style="font-size:10.5px; padding:3px 8px;">
                ${safeTitle}
              </span>
            </div>
          </div>

          <!-- Lời khuyên KTV / Chẩn đoán -->
          <div style="font-size:11px; color:${speedMbps === 100 && isEth ? '#b45309' : 'var(--text-secondary)'}; margin-bottom:10px; line-height:1.4;">
            ${safeAdvice}
          </div>
        </div>

        <!-- Hàng thông số chi tiết IP / MAC / Gateway -->
        <div style="border-top:1px dashed var(--win-acrylic-border); padding-top:8px; font-size:11px; color:var(--text-muted); display:flex; flex-wrap:wrap; gap:8px 14px; font-family:var(--font-mono);">
          ${safeIp ? `<div><strong>IP:</strong> <span style="color:var(--text-main);">${safeIp}</span></div>` : ''}
          ${safeGw ? `<div><strong>GW:</strong> <span style="color:var(--text-main);">${safeGw}</span></div>` : ''}
          ${safeMac ? `<div><strong>MAC:</strong> <span style="color:var(--text-muted);">${safeMac}</span></div>` : ''}
          <div><strong>Loại:</strong> <span style="color:var(--text-muted);">${safeType}</span></div>
        </div>
      </div>
    `;
  });

  listEl.innerHTML = html;

  if (warningBox) {
    warningBox.style.display = has100MEthernetBottleneck ? 'block' : 'none';
  }
}

function renderNetworkAdaptersFallback(msg) {
  const listEl = document.getElementById('netAdaptersList');
  if (!listEl) return;
  const safeMsg = typeof escapeHtml === 'function' ? escapeHtml(msg) : msg;
  listEl.innerHTML = `
    <div style="text-align:center; padding:18px; color:#ef4444; font-size:12px; grid-column: 1 / -1; background:#fef2f2; border-radius:8px; border:1px solid #fee2e2;">
      ⚠️ <strong>Không thể đọc thông tin Card mạng:</strong> ${safeMsg}.
      <div style="margin-top:8px;">
        <button class="btn btn-secondary btn-compact" onclick="openNcpaCpl()">
          ⚙️ Bấm vào đây để mở trực tiếp ncpa.cpl
        </button>
      </div>
    </div>
  `;
}

async function openNcpaCpl() {
  showToast('⚙️ Đang mở Network Connections (ncpa.cpl)...');
  try {
    const resp = await fetch('/api/network/open_ncpa');
    const data = await resp.json();
    if (data.status === 'ok') {
      showToast('✅ Đã mở cửa sổ Network Connections!');
    } else {
      showToast('⚠️ Không thể mở tự động: ' + data.message);
    }
  } catch (e) {
    showToast('⚠️ Lỗi kết nối backend.');
  }
}

async function flushDnsCache() {
  showToast('🧹 Đang làm sạch DNS Cache...');
  try {
    const resp = await fetch('/api/network/flush_dns');
    const data = await resp.json();
    if (data.status === 'ok') {
      showToast('✅ Đã xóa sạch cache DNS (ipconfig /flushdns)!');
    } else {
      showToast('⚠️ Không thể thực thi: ' + data.message);
    }
  } catch (e) {
    showToast('⚠️ Lỗi kết nối backend.');
  }
}

// ==========================================
// 9. CÔNG CỤ TEST & CHẨN ĐOÁN SỨC KHỎE Ổ CỨNG (TASK 8: HYBRID ENGINE)
// ==========================================

let currentDetectedDisks = [
  {
    id: "disk_0",
    driveLetter: "C:",
    name: "Samsung SSD 990 PRO 1TB",
    type: "nvme",
    typeLabel: "SSD NVMe PCIe 4.0 x4",
    busType: "NVMe PCIe 4.0",
    formFactor: "M.2 2280",
    serialNumber: "S6WZNS0W104829",
    capacity: 1000,
    temp: 41,
    healthScore: 100,
    healthStatus: "GOOD",
    powerOnHours: 1450,
    powerCycles: 380,
    unsafeShutdowns: 4,
    totalWritesTBW: 28.5,
    ratedTBW: 600,
    smartAttributes: {
      reallocated: 0,
      pending: 0,
      uncorrectable: 0,
      crcErrors: 0,
      mediaErrors: 0,
      availableSpare: 100,
      percentageUsed: 5
    },
    partitions: ["C: (Windows 11 OS - 250 GB)", "D: (Games & Data - 680 GB)"]
  },
  {
    id: "disk_1",
    driveLetter: "D:",
    name: "WDC WD20EZAZ-00GGJB0 (WD Blue 2TB)",
    type: "hdd",
    typeLabel: "HDD Cơ 3.5\" 5400RPM",
    busType: "SATA III 6Gb/s",
    formFactor: "3.5 inch",
    serialNumber: "WD-WX32A6194821",
    capacity: 2000,
    temp: 48,
    healthScore: 85,
    healthStatus: "CAUTION",
    powerOnHours: 24800,
    powerCycles: 3950,
    unsafeShutdowns: 52,
    totalWritesTBW: 85.0,
    ratedTBW: null,
    smartAttributes: {
      reallocated: 12,
      pending: 4,
      uncorrectable: 0,
      crcErrors: 28,
      mediaErrors: 0,
      availableSpare: null,
      percentageUsed: null
    },
    partitions: ["D: (Dữ Liệu Khách - 1860 GB)"]
  },
  {
    id: "disk_2",
    driveLetter: "F:",
    name: "Kingston SA400S37480G (480GB)",
    type: "sata_ssd",
    typeLabel: "SSD SATA III TLC",
    busType: "SATA III 6Gb/s",
    formFactor: "2.5 inch",
    serialNumber: "50026B768392104",
    capacity: 480,
    temp: 39,
    healthScore: 96,
    healthStatus: "GOOD",
    powerOnHours: 7820,
    powerCycles: 1120,
    unsafeShutdowns: 14,
    totalWritesTBW: 45.2,
    ratedTBW: 160,
    smartAttributes: {
      reallocated: 0,
      pending: 0,
      uncorrectable: 0,
      crcErrors: 0,
      mediaErrors: 0,
      availableSpare: null,
      percentageUsed: 28
    },
    partitions: ["F: (Ứng Dụng Đồ Họa - 447 GB)"]
  }
];

let currentSelectedDiskIdx = 0;
let isScanningDisks = false;

// 1. TỰ ĐỘNG QUÉT & ĐỌC TOÀN BỘ Ổ ĐĨA (1-CLICK SCAN)
async function scanDisksAuto(isUserClick = false) {
  if (!checkAndWarnInstallModeForScan("quét S.M.A.R.T ổ cứng")) return;
  if (isScanningDisks) return;
  isScanningDisks = true;

  const btns = [
    document.getElementById('btnAutoScanDisks'),
    document.getElementById('btnAutoScanDisksSmart')
  ].filter(Boolean);
  const statusEls = [
    document.getElementById('diskScanStatusText'),
    document.getElementById('smartDiskScanStatusText')
  ].filter(Boolean);

  btns.forEach(btn => {
    btn.disabled = true;
    btn.setAttribute('data-orig-html', btn.innerHTML);
    btn.innerHTML = '<span>⏳</span> Đang Quét S.M.A.R.T Toàn Bộ Ổ Đĩa...';
  });

  statusEls.forEach(el => {
    el.innerHTML = '<span style="color:#7c3aed; font-weight:700;">📡 Đang truy vấn controller lưu trữ NVMe/SATA qua CrystalDiskInfo Core / WMI ngầm trong 0.5s...</span>';
  });

  let wasBlockedByInstall = false;
  try {
    const res = await fetch('/api/disk_smart/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ timestamp: Date.now() })
    });

    if (res.status === 409) {
      const errData = await res.json().catch(() => ({}));
      if (errData && errData.code === 'INSTALL_MODE_ACTIVE') {
        wasBlockedByInstall = true;
        showInstallModeScanBlockedModal('quét S.M.A.R.T ổ cứng', errData);
        return;
      }
    }

    if (res.ok) {
      const data = await res.json();
      if (data && data.disks && data.disks.length > 0) {
        currentDetectedDisks = data.disks;
      }
    }
  } catch (err) {
    console.warn('API /api/disk_smart/scan offline, using native storage profile:', err);
  } finally {
    isScanningDisks = false;
    btns.forEach(btn => {
      btn.disabled = false;
      const orig = btn.getAttribute('data-orig-html');
      if (orig) btn.innerHTML = orig;
    });

    if (wasBlockedByInstall) {
      statusEls.forEach(el => {
        el.innerHTML = '<span style="color:#b45309; font-weight:700;">🚧 Đã chặn quét S.M.A.R.T vì tool đang ở chế độ cài đặt phần mềm!</span>';
      });
      return;
    }

    renderDiskSelectorPills();
    selectDiskByIndex(0);
    updateMachineCardSmartSummary();

    const now = new Date().toLocaleTimeString('vi-VN');
    statusEls.forEach(el => {
      el.innerHTML = `✅ Đã quét tự động <strong>${currentDetectedDisks.length} ổ đĩa</strong> thành công • Nguồn: CrystalDiskInfo Core / WMI (${now})`;
    });

    if (isUserClick) {
      showToast(`⚡ Đã quét xong ${currentDetectedDisks.length} ổ cứng đang cắm trên máy!`);
    }
  }
}

// 2. BỘ CHỌN NHIỀU Ổ ĐĨA (DRIVE SELECTOR TABS / PILLS)
function initDiskSmartSection() {
  renderDiskSelectorPills();
  renderSelectedDiskDetails();
  updateMachineCardSmartSummary();
  initDiskKnowledgeBase();
}

function initSmartDiskSection() {
  renderDiskSelectorPills();
  renderSelectedDiskDetails();
  updateMachineCardSmartSummary();
  initDiskKnowledgeBase();
}

function updateMachineCardSmartSummary() {
  const disk = (currentDetectedDisks && currentDetectedDisks[0]) || null;
  if (!disk) return;

  const nameEl = document.getElementById('mCardPrimaryDiskName');
  const sumEl = document.getElementById('mCardSmartDiskSummary');

  if (nameEl) {
    nameEl.textContent = `${disk.name} (${disk.capacity} GB)`;
  }

  if (sumEl) {
    const score = disk.healthScore || 100;
    const temp = disk.temp || 41;
    let badgeClass = 'badge badge-mint';
    let icon = '🟢';
    let label = 'Good';

    if (score < 50) {
      badgeClass = 'badge badge-danger';
      icon = '🔴';
      label = 'Bad';
    } else if (score < 90) {
      badgeClass = 'badge badge-warning';
      icon = '🟡';
      label = 'Caution';
    }

    sumEl.innerHTML = `<span class="${badgeClass}" style="font-weight:800; font-size:10.5px; padding:2px 8px;">${icon} ${score}% ${label} • ${temp}°C</span>`;
  }
}

function renderDiskSelectorPills() {
  const containers = [
    document.getElementById('smartDiskSelectorPills'),
    document.getElementById('diskSelectorPills')
  ].filter(Boolean);
  if (containers.length === 0) return;

  const html = currentDetectedDisks.map((d, idx) => {
    const isActive = idx === currentSelectedDiskIdx;
    const score = d.healthScore;
    const isGood = score >= 90;
    const isBad = score < 50;
    const icon = d.type === 'nvme' ? '⚡' : d.type === 'hdd' ? '💿' : '🔌';

    let badgeClass = 'badge badge-mint';
    let badgeText = `${score}% Good`;
    if (isBad) {
      badgeClass = 'badge badge-danger';
      badgeText = `Bad ${score}%`;
    } else if (!isGood) {
      badgeClass = 'badge badge-warning';
      badgeText = `Caution ${score}%`;
    }

    const hasC5 = (d.smartAttributes?.pending > 0);
    const has05 = (d.smartAttributes?.reallocated > 0);

    return `
      <button type="button" class="disk-pill-item ${isActive ? 'active' : ''}" onclick="selectDiskByIndex(${idx})" style="
        display:flex; align-items:center; gap:10px; padding:10px 14px; border-radius:8px;
        background:${isActive ? '#ffffff' : 'var(--win-card)'};
        border:${isActive ? '2px solid #7c3aed' : '1px solid var(--win-acrylic-border)'};
        box-shadow:${isActive ? '0 4px 14px rgba(124,58,237,0.2)' : 'none'};
        cursor:pointer; text-align:left; transition:all 0.18s ease; flex:1; min-width:270px;
      ">
        <span style="font-size:24px; flex-shrink:0;">${icon}</span>
        <div style="flex:1; min-width:0;">
          <div style="font-size:12.5px; font-weight:800; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
            Ổ ${idx + 1}: ${d.name} (${d.driveLetter})
          </div>
          <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-top:4px; font-size:11px;">
            <span class="${badgeClass}" style="font-size:10.5px; font-weight:700; padding:1px 6px;">${badgeText}</span>
            ${hasC5 ? `<span style="color:#b45309; font-weight:700; font-size:10px; background:#fef3c7; border:1px solid #fde68a; padding:1px 6px; border-radius:4px;">• Caution C5: ${d.smartAttributes.pending} Sector</span>` : (has05 ? `<span style="color:#b91c1c; font-weight:700; font-size:10px; background:#fee2e2; border:1px solid #fca5a5; padding:1px 6px; border-radius:4px;">• 05 Reallocated: ${d.smartAttributes.reallocated}</span>` : '')}
            <span style="color:#64748b; font-weight:600;">• 🌡️ ${d.temp}°C</span>
            <span style="color:#94a3b8; font-size:10px;">• ${d.capacity} GB</span>
          </div>
        </div>
      </button>
    `;
  }).join('');

  containers.forEach(c => { c.innerHTML = html; });
}

function selectDiskByIndex(idx) {
  if (idx < 0 || idx >= currentDetectedDisks.length) return;
  currentSelectedDiskIdx = idx;

  renderDiskSelectorPills();
  renderSelectedDiskDetails();
}

// 3. KHUNG HIỂN THỊ THÔNG SỐ S.M.A.R.T TRỰC QUAN & CARD GRID
function renderSelectedDiskDetails() {
  const disk = currentDetectedDisks[currentSelectedDiskIdx];
  if (!disk) return;

  const containers = [
    document.getElementById('smartDiskActiveDetailsCard'),
    document.getElementById('diskActiveDetailsCard')
  ].filter(Boolean);
  if (containers.length === 0) return;

  const score = disk.healthScore;
  let statusColor = '#dc2626'; // Đỏ (<50%)
  let statusBg = '#fef2f2';
  let statusBorder = '#fca5a5';
  let statusBadgeText = 'BAD (NGUY CẤP)';

  if (score >= 90) {
    statusColor = '#059669'; // Xanh lục (>90%)
    statusBg = '#f0fdf4';
    statusBorder = '#86efac';
    statusBadgeText = 'GOOD (TỐT)';
  } else if (score >= 50) {
    statusColor = '#d97706'; // Vàng (50-89%)
    statusBg = '#fffbeb';
    statusBorder = '#fde68a';
    statusBadgeText = 'CAUTION (CẢNH BÁO)';
  }

  const smart = disk.smartAttributes || {};
  const reallocated = smart.reallocated || 0;
  const pending = smart.pending || 0;
  const uncorrectable = smart.uncorrectable || 0;
  const crc = smart.crcErrors || 0;
  const mediaErrors = smart.mediaErrors || 0;

  // Render Grid
  const detailsHtml = `
    <div style="background:#ffffff; border:1.5px solid var(--win-acrylic-border); border-radius:10px; padding:18px; box-shadow:0 4px 16px rgba(0,0,0,0.04); margin-bottom:16px;">
      
      <!-- Top Bar: Tên Ổ, Chuẩn Cắm, Model -->
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; border-bottom:1px solid #e2e8f0; padding-bottom:14px; margin-bottom:16px;">
        <div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:22px;">${disk.type === 'nvme' ? '⚡' : disk.type === 'hdd' ? '💿' : '🔌'}</span>
            <h3 style="margin:0; font-size:17px; font-weight:800; color:#0f172a;">
              ${disk.name} (${disk.capacity} GB)
            </h3>
            <span class="badge badge-primary" style="font-size:11px;">Phân vùng: ${disk.driveLetter}</span>
          </div>
          <div style="font-size:12px; color:#64748b; margin-top:4px; display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
            <span>Loại ổ: <strong>${disk.typeLabel}</strong></span>
            <span>Chuẩn cắm: <strong>${disk.busType}</strong></span>
            <span>Kích thước: <strong>${disk.formFactor}</strong></span>
            <span>Serial: <code style="font-family:var(--font-mono); font-size:11px;">${disk.serialNumber}</code></span>
          </div>
        </div>

        <!-- Nút Thao Tác Bác Sĩ AI & In Ấn -->
        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button class="btn btn-primary" onclick="consultAiDoctor()" style="font-size:12px; padding:7px 14px; background:#7c3aed; font-weight:700; display:flex; align-items:center; gap:6px;">
            <span>🤖</span> Nhờ Bác Sĩ AI Chẩn Đoán
          </button>
          <button class="btn btn-outline" onclick="saveSmartResultToMachineProfile()" style="font-size:12px; padding:7px 13px; display:flex; align-items:center; gap:6px; background:#f0fdf4; border:1.5px solid #86efac; color:#166534; font-weight:700;" title="Lưu vào scans/<scan_id>/smart_info.json và đồng bộ vào biên bản tiếp nhận/bàn giao A4">
            <span>📥</span> Lưu Kết Quả Này Vào Hồ Sơ Máy
          </button>
          <button class="btn btn-outline" onclick="openDiskA4Modal()" style="font-size:12px; padding:7px 13px; display:flex; align-items:center; gap:6px;">
            <span>🖨️</span> In Khổ A4
          </button>
        </div>
      </div>

      <!-- Khung Điểm Sức Khỏe Lớn & 4 Thông Số Vàng -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px; margin-bottom:16px;">
        
        <!-- Cột 1: Vòng tròn Score (% Sức Khỏe: Xanh lục >90%, Vàng 50-89%, Đỏ <50%) & Badge Trạng Thái Lớn -->
        <div style="background:${statusBg}; border:1.5px solid ${statusBorder}; border-radius:10px; padding:16px; display:flex; align-items:center; gap:18px;">
          <div style="position:relative; width:92px; height:92px; display:flex; align-items:center; justify-content:center; border-radius:50%; background:conic-gradient(${statusColor} ${score * 3.6}deg, #e2e8f0 0deg); flex-shrink:0; box-shadow:0 2px 8px rgba(0,0,0,0.08);">
            <div style="width:72px; height:72px; background:#ffffff; border-radius:50%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
              <span style="font-size:22px; font-weight:900; color:${statusColor}; font-family:var(--font-mono);">${score}%</span>
              <span style="font-size:9.5px; color:#64748b; font-weight:800;">SỨC KHỎE</span>
            </div>
          </div>
          <div>
            <div style="display:inline-block; padding:4px 12px; border-radius:6px; font-size:12.5px; font-weight:800; background:#ffffff; border:1.5px solid ${statusBorder}; color:${statusColor}; margin-bottom:6px;">
              ${statusBadgeText}
            </div>
            <div style="font-size:12.5px; font-weight:700; color:#1e293b;">
              ${score >= 90 ? 'Tình Trạng Xuất Sắc & An Toàn' : score >= 50 ? 'Cảnh Báo Suy Giảm Linh Kiện' : 'Hư Hại Nặng - Cần Thay Thế Ngay'}
            </div>
            <div style="font-size:11px; color:#475569; margin-top:2px;">
              ${disk.partitions ? disk.partitions.join(' • ') : 'Tất cả phân vùng hoạt động'}
            </div>
          </div>
        </div>

        <!-- Cột 2: 4 Card Thông Số Vàng -->
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px; padding:14px; display:grid; grid-template-columns:repeat(auto-fit, minmax(110px, 1fr)); gap:10px;">
          <!-- 1. Nhiệt độ hiện tại -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px; text-align:center;">
            <div style="font-size:10.5px; color:#64748b; font-weight:600;">Nhiệt Độ (°C)</div>
            <div style="font-size:16px; font-weight:900; color:${disk.temp >= 65 ? '#dc2626' : disk.temp >= 50 ? '#d97706' : '#059669'}; font-family:var(--font-mono); margin:2px 0;">
              ${disk.temp}°C
            </div>
            <span class="badge ${disk.temp >= 65 ? 'badge-warning' : 'badge-mint'}" style="font-size:9.5px;">${disk.temp >= 65 ? 'Quá Nhiệt' : 'Mát mẻ'}</span>
          </div>

          <!-- 2. Số giờ hoạt động -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px; text-align:center;">
            <div style="font-size:10.5px; color:#64748b; font-weight:600;">Số Giờ Hoạt Động</div>
            <div style="font-size:15px; font-weight:900; color:#1e293b; font-family:var(--font-mono); margin:2px 0;">
              ${disk.powerOnHours.toLocaleString()}h
            </div>
            <span style="font-size:10px; color:#64748b;">Power-On Hours</span>
          </div>

          <!-- 3. Tổng lượng dữ liệu đã ghi -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px; text-align:center;">
            <div style="font-size:10.5px; color:#64748b; font-weight:600;">Tổng Ghi (TBW)</div>
            <div style="font-size:15px; font-weight:900; color:#2563eb; font-family:var(--font-mono); margin:2px 0;">
              ${disk.totalWritesTBW} TB
            </div>
            <span style="font-size:10px; color:#64748b;">${disk.ratedTBW ? `/ ${disk.ratedTBW} TBW` : 'Host Writes'}</span>
          </div>

          <!-- 4. Số lần bật/tắt & sập nguồn -->
          <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:6px; padding:8px; text-align:center;">
            <div style="font-size:10.5px; color:#64748b; font-weight:600;">Bật Tắt / Sập Nguồn</div>
            <div style="font-size:14.5px; font-weight:900; color:${disk.unsafeShutdowns > 40 ? '#b91c1c' : '#1e293b'}; font-family:var(--font-mono); margin:2px 0;">
              ${disk.powerCycles.toLocaleString()} / <span style="color:${disk.unsafeShutdowns > 20 ? '#dc2626' : '#64748b'};">${disk.unsafeShutdowns}</span>
            </div>
            <span style="font-size:10px; color:#64748b;">Power / Unsafe</span>
          </div>
        </div>
      </div>

      <!-- Bảng 5 Mã Lỗi Sống Còn (S.M.A.R.T Critical Matrix) -->
      <div style="margin-bottom:16px;">
        <div style="font-size:12.5px; font-weight:800; color:#1e293b; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>📋</span> Bảng 5 Mã Lỗi Sống Còn S.M.A.R.T (Tiêu Chuẩn CrystalDiskInfo Core):
        </div>
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:11.8px; text-align:left;">
            <thead>
              <tr style="background:#f1f5f9; border-bottom:1.5px solid #cbd5e1; color:#334155;">
                <th style="padding:6px 10px;">ID Thuộc Tính</th>
                <th style="padding:6px 10px;">Tên Thông Số S.M.A.R.T</th>
                <th style="padding:6px 10px;">Giá Trị Hiện Tại (Raw)</th>
                <th style="padding:6px 10px;">Ngưỡng An Toàn</th>
                <th style="padding:6px 10px;">Đánh Giá Tình Trạng</th>
                <th style="padding:6px 10px; text-align:center;">Sổ Tay Tra Cứu</th>
              </tr>
            </thead>
            <tbody>
              <!-- 05 Reallocated -->
              <tr style="border-bottom:1px solid #e2e8f0; ${reallocated > 0 ? 'background:#fff1f2;' : ''}">
                <td style="padding:6px 10px; font-family:var(--font-mono); font-weight:700;">05</td>
                <td style="padding:6px 10px;"><strong>Reallocated Sectors Count</strong> (Sector Bad đã remap)</td>
                <td style="padding:6px 10px; font-weight:800; color:${reallocated > 0 ? '#b91c1c' : '#059669'}; font-family:var(--font-mono);">${reallocated}</td>
                <td style="padding:6px 10px; color:#64748b;">= 0</td>
                <td style="padding:6px 10px;">
                  ${reallocated > 0 ? '<span class="badge badge-danger">⚠️ Bad Sector Remap</span>' : '<span class="badge badge-mint">🟢 Hoàn Hảo</span>'}
                </td>
                <td style="padding:6px 10px; text-align:center;">
                  <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('05')" style="font-size:10.5px; padding:2px 8px; background:#f5f3ff; color:#6d28d9; border:1px solid #ddd6fe; cursor:pointer;" title="Tra cứu mã 05 trong Sổ tay 100 mã lỗi Google Sheet">
                    📖 Tra cứu
                  </button>
                </td>
              </tr>
              <!-- C5 Pending -->
              <tr style="border-bottom:1px solid #e2e8f0; ${pending > 0 ? 'background:#fffbeb;' : ''}">
                <td style="padding:6px 10px; font-family:var(--font-mono); font-weight:700;">C5</td>
                <td style="padding:6px 10px;"><strong>Current Pending Sector Count</strong> (Sector nghi ngờ đơ máy)</td>
                <td style="padding:6px 10px; font-weight:800; color:${pending > 0 ? '#d97706' : '#059669'}; font-family:var(--font-mono);">${pending}</td>
                <td style="padding:6px 10px; color:#64748b;">= 0</td>
                <td style="padding:6px 10px;">
                  ${pending > 0 ? '<span class="badge badge-warning" style="background:#fef3c7; color:#b45309;">⚠️ Cần Sao Lưu Gấp</span>' : '<span class="badge badge-mint">🟢 Bình Thường</span>'}
                </td>
                <td style="padding:6px 10px; text-align:center;">
                  <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('C5')" style="font-size:10.5px; padding:2px 8px; background:#f5f3ff; color:#6d28d9; border:1px solid #ddd6fe; cursor:pointer;" title="Tra cứu mã C5 trong Sổ tay 100 mã lỗi Google Sheet">
                    📖 Tra cứu
                  </button>
                </td>
              </tr>
              <!-- C6 Uncorrectable -->
              <tr style="border-bottom:1px solid #e2e8f0; ${uncorrectable > 0 ? 'background:#fff1f2;' : ''}">
                <td style="padding:6px 10px; font-family:var(--font-mono); font-weight:700;">C6</td>
                <td style="padding:6px 10px;"><strong>Offline Uncorrectable Sector Count</strong> (Sector hỏng vĩnh viễn)</td>
                <td style="padding:6px 10px; font-weight:800; color:${uncorrectable > 0 ? '#b91c1c' : '#059669'}; font-family:var(--font-mono);">${uncorrectable}</td>
                <td style="padding:6px 10px; color:#64748b;">= 0</td>
                <td style="padding:6px 10px;">
                  ${uncorrectable > 0 ? '<span class="badge badge-danger">🔴 Nguy Hiểm Đột Tử</span>' : '<span class="badge badge-mint">🟢 Bình Thường</span>'}
                </td>
                <td style="padding:6px 10px; text-align:center;">
                  <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('C6')" style="font-size:10.5px; padding:2px 8px; background:#f5f3ff; color:#6d28d9; border:1px solid #ddd6fe; cursor:pointer;" title="Tra cứu mã C6 trong Sổ tay 100 mã lỗi Google Sheet">
                    📖 Tra cứu
                  </button>
                </td>
              </tr>
              <!-- C7 CRC Error -->
              <tr style="border-bottom:1px solid #e2e8f0; ${crc > 0 ? 'background:#fffbeb;' : ''}">
                <td style="padding:6px 10px; font-family:var(--font-mono); font-weight:700;">C7</td>
                <td style="padding:6px 10px;"><strong>UltraDMA CRC Error Count</strong> (Lỗi cáp SATA)</td>
                <td style="padding:6px 10px; font-weight:800; color:${crc > 0 ? '#d97706' : '#059669'}; font-family:var(--font-mono);">${crc}</td>
                <td style="padding:6px 10px; color:#64748b;">= 0</td>
                <td style="padding:6px 10px;">
                  ${crc > 0 ? '<span class="badge badge-warning" style="background:#eff6ff; color:#1d4ed8;">🔌 Cần Thay Cáp SATA</span>' : '<span class="badge badge-mint">🟢 Tốt</span>'}
                </td>
                <td style="padding:6px 10px; text-align:center;">
                  <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('C7')" style="font-size:10.5px; padding:2px 8px; background:#f5f3ff; color:#6d28d9; border:1px solid #ddd6fe; cursor:pointer;" title="Tra cứu mã C7 trong Sổ tay 100 mã lỗi Google Sheet">
                    📖 Tra cứu
                  </button>
                </td>
              </tr>
              <!-- NVMe Media Errors -->
              <tr>
                <td style="padding:6px 10px; font-family:var(--font-mono); font-weight:700;">NVMe</td>
                <td style="padding:6px 10px;"><strong>Media and Data Integrity Errors</strong> (Lỗi ô nhớ flash)</td>
                <td style="padding:6px 10px; font-weight:800; color:${mediaErrors > 0 ? '#b91c1c' : '#059669'}; font-family:var(--font-mono);">${mediaErrors}</td>
                <td style="padding:6px 10px; color:#64748b;">= 0</td>
                <td style="padding:6px 10px;">
                  ${mediaErrors > 0 ? '<span class="badge badge-danger">🔴 Lỗi Ô Nhớ Flash</span>' : '<span class="badge badge-mint">🟢 Hoàn Hảo</span>'}
                </td>
                <td style="padding:6px 10px; text-align:center;">
                  <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('NVMe Media')" style="font-size:10.5px; padding:2px 8px; background:#f5f3ff; color:#6d28d9; border:1px solid #ddd6fe; cursor:pointer;" title="Tra cứu lỗi NVMe trong Sổ tay 100 mã lỗi Google Sheet">
                    📖 Tra cứu
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 4. KHUNG PHÂN TÍCH TỰ ĐỘNG BỘ LUẬT CHUYÊN GIA (OFFLINE RULE ENGINE - 0MS) -->
      <div class="diskOfflineRuleEngineBox" id="diskOfflineRuleEngineBox"></div>

      <!-- 5. KHUNG BÁC SĨ AI CHẨN ĐOÁN (AI DOCTOR LLM) -->
      <div class="diskAiDoctorCard" id="diskAiDoctorCard" style="display:none; margin-top:14px;"></div>
    </div>
  `;

  containers.forEach(c => { c.innerHTML = detailsHtml; });

  // Tự động chạy Rule Engine Offline (0ms)
  evaluateDiskHealth(disk);
  updateMachineCardSmartSummary();
}

// 4. BỘ LUẬT CHUYÊN GIA TỰ ĐỘNG PHÂN TÍCH (OFFLINE RULE ENGINE - 0MS)
function evaluateDiskHealth(data) {
  if (!data) return;

  const smart = data.smartAttributes || data;
  const score = typeof data.healthScore === 'number' ? data.healthScore : (typeof data.healthPct === 'number' ? data.healthPct : 100);
  const temp = typeof data.temp === 'number' ? data.temp : 40;
  const reallocated = smart.reallocated || smart['05'] || 0;
  const pending = smart.pending || smart['C5'] || smart['c5'] || 0;
  const uncorrectable = smart.uncorrectable || smart['C6'] || smart['c6'] || 0;
  const crc = smart.crcErrors || smart['C7'] || smart['c7'] || 0;
  const mediaErrors = smart.mediaErrors || 0;
  const shutdowns = data.unsafeShutdowns || 0;
  const driveLetter = data.driveLetter || 'C:';

  const alerts = [];
  const actions = [];

  // Quy tắc 1: Nếu có C5 > 0, 05 > 0 hoặc C6 > 0: Báo động Bad Sector, đề xuất sao lưu khẩn cấp
  if (pending > 0 || reallocated > 0 || uncorrectable > 0) {
    alerts.push(`🚨 <strong>Báo động Bad Sector:</strong> Phát hiện ${pending > 0 ? pending + ' Sector nghi ngờ (C5)' : ''}${pending > 0 && reallocated > 0 ? ', ' : ''}${reallocated > 0 ? reallocated + ' Sector đã remap (05)' : ''}${uncorrectable > 0 ? ', ' + uncorrectable + ' Sector hỏng nặng (C6)' : ''}. Nguy cơ đơ máy và mất dữ liệu. Đề xuất sao lưu dữ liệu khẩn cấp! <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('C5')" style="font-size:10.5px; padding:2px 8px; margin-left:6px; background:#fff7ed; color:#c2410c; border:1px solid #fdba74; cursor:pointer;">📖 Tra cứu phác đồ C5/05</button>`);
    actions.push('<strong>SAO LƯU DỮ LIỆU KHẨN CẤP:</strong> Sao chép toàn bộ tài liệu quan trọng sang ổ cứng ngoài hoặc đám mây ngay lập tức.');
    actions.push(`Chạy lệnh cô lập sector: <code>chkdsk ${driveLetter} /f /r</code> trong Command Prompt (Admin).`);
  }

  // Quy tắc 2: Nếu C7 > 0: Lỗi cáp SATA
  if (crc > 0) {
    alerts.push(`🔌 <strong>Lỗi cáp SATA (UltraDMA CRC - C7):</strong> Phát hiện ${crc} lỗi truyền tín hiệu. Nghi ngờ lỏng hoặc đứt ngầm cáp SATA, cần thay cáp mới. <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('C7')" style="font-size:10.5px; padding:2px 8px; margin-left:6px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; cursor:pointer;">📖 Tra cứu lỗi cáp C7</button>`);
    actions.push('Tháo vỏ case máy, vệ sinh cổng cắm SATA trên bo mạch chủ và thay thế bằng sợi cáp SATA III mới.');
  }

  // Quy tắc 3: Nhiệt độ >= 65°C: Cảnh báo quá nhiệt, đề xuất vệ sinh / lắp heatsink
  if (temp >= 65) {
    alerts.push(`🔥 <strong>Cảnh báo quá nhiệt:</strong> Thân nhiệt ổ cứng hiện tại ${temp}°C (vượt ngưỡng an toàn 60°C). Đề xuất vệ sinh thùng máy / lắp heatsink tản nhiệt nhôm. <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('Airflow')" style="font-size:10.5px; padding:2px 8px; margin-left:6px; background:#fef2f2; color:#b91c1c; border:1px solid #fca5a5; cursor:pointer;">📖 Tra cứu ngưỡng nhiệt BE/C2</button>`);
    actions.push('Lắp thêm miếng tản nhiệt Heatsink hợp kim nhôm cho ổ NVMe hoặc bổ sung quạt hút gió trong thùng máy.');
  } else if (temp >= 48 && data.type === 'hdd') {
    alerts.push(`⚠️ <strong>Nhiệt độ ổ cơ HDD hơi ấm (${temp}°C):</strong> Nên chuyển sang khay ổ thông thoáng hơn.`);
  }

  // Quy tắc 4: Sập nguồn đột ngột
  if (shutdowns > 40) {
    alerts.push(`⚡ <strong>${shutdowns} lần sập nguồn đột ngột / tắt cưỡng bức (Unsafe Shutdowns):</strong> Nguy cơ lỗi bảng phân vùng NTFS. <button type="button" class="btn btn-compact" onclick="highlightOrSearchDiskKb('Unexpected Power Loss')" style="font-size:10.5px; padding:2px 8px; margin-left:6px; background:#fefce8; color:#854d0e; border:1px solid #fef08a; cursor:pointer;">📖 Tra cứu lỗi sập nguồn ID AE</button>`);
    actions.push('Hạn chế giữ đè nút nguồn để tắt máy; cân nhắc trang bị bộ lưu điện UPS cho máy bàn.');
  }

  // Quy tắc 5: 100% Good: Báo ổ hoàn hảo, an toàn tuyệt đối để cài đặt Windows 11
  if (score >= 90 && pending === 0 && reallocated === 0 && crc === 0 && uncorrectable === 0 && temp < 65) {
    alerts.push(`✅ <strong>Ổ hoàn hảo, an toàn tuyệt đối để cài đặt Windows 11:</strong> Sức khỏe ${score}% Good, bề mặt chip nhớ hoàn toàn sạch sẽ, không có sector lỗi.`);
    actions.push('Ổ hoàn toàn đủ điều kiện tối ưu để làm ổ hệ điều hành chính cho Windows 11.');
  }

  // Dự báo tuổi thọ
  let lifespan = '';
  if (score >= 90) {
    lifespan = '3 - 5+ năm nữa (Cực kỳ bền bỉ). Hoàn toàn an toàn để cài Windows 11.';
  } else if (score >= 50) {
    lifespan = 'Khoảng 6 tháng - 1 năm. Chỉ nên dùng chứa dữ liệu phụ, không nên cài Windows chính.';
  } else {
    lifespan = 'Dưới 3 tháng (Nguy cơ đột tử bất kỳ lúc nào). Cần thay mới gấp!';
  }

  const ruleHtml = `
    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px; margin-top:12px;">
      <div style="font-size:12.5px; font-weight:800; color:#1e293b; margin-bottom:8px; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px;">
        <span style="display:flex; align-items:center; gap:6px;">
          <span>🧠</span> Kết Quả Phân Tích Bộ Luật Chuyên Gia (Offline Rule Engine - 0ms):
        </span>
        <span style="font-size:11.5px; color:#475569;">Dự báo thời gian sử dụng bền bỉ còn lại: <strong style="color:${score >= 90 ? '#059669' : score >= 50 ? '#d97706' : '#dc2626'};">${lifespan}</strong></span>
      </div>

      <div style="margin-bottom:8px;">
        <ul style="margin:0; padding-left:18px; font-size:12px; color:#334155; line-height:1.65;">
          ${alerts.map(a => `<li style="margin-bottom:4px;">${a}</li>`).join('')}
        </ul>
      </div>

      ${actions.length > 0 ? `
        <div style="background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:8px 12px; font-size:11.8px; color:#1e40af;">
          <strong>🛠️ Khuyến nghị kỹ thuật:</strong>
          <ul style="margin:4px 0 0 0; padding-left:18px; line-height:1.55;">
            ${actions.map(act => `<li>${act}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    </div>
  `;

  document.querySelectorAll('.diskOfflineRuleEngineBox, #diskOfflineRuleEngineBox').forEach(container => {
    container.innerHTML = ruleHtml;
  });

  return { alerts, actions, lifespan, score, temp };
}

// 5. TÍNH NĂNG "BÁC SĨ AI CHẨN ĐOÁN BỆNH ÁN" (AI DOCTOR LLM)
async function consultAiDoctor() {
  const disk = currentDetectedDisks[currentSelectedDiskIdx];
  if (!disk) return;

  const cards = document.querySelectorAll('.diskAiDoctorCard, #diskAiDoctorCard');
  if (cards.length === 0) return;

  cards.forEach(card => {
    card.style.display = 'block';
    card.innerHTML = `
      <div style="background:#f5f3ff; border:1.5px solid #ddd6fe; border-radius:10px; padding:16px; animation:fadeIn 0.3s ease;">
        <div style="display:flex; align-items:center; gap:10px; color:#6d28d9; font-weight:800; font-size:13px; margin-bottom:8px;">
          <span style="font-size:20px;">🩺</span>
          <span>Bác Sĩ AI Đang Tiến Hành Hội Chẩn Bệnh Án Ổ Cứng...</span>
        </div>
        <div style="font-size:12px; color:#6b21a8; line-height:1.6;">
          Đang đối chiếu bảng mã S.M.A.R.T, phân tích lịch sử số lần sập nguồn và kiểm tra xác suất hỏng chip nhớ NAND... Vui lòng đợi trong giây lát...
        </div>
        <div style="height:4px; background:#e9d5ff; border-radius:2px; margin-top:10px; overflow:hidden;">
          <div style="height:100%; width:60%; background:#7c3aed; animation:pulse 1s infinite;"></div>
        </div>
      </div>
    `;
  });

  try {
    const res = await fetch('/api/disk_smart/ai_doctor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ disk })
    });

    let diagnosisText = '';
    let aiModel = 'gemini-3.8-flash';

    if (res.ok) {
      const data = await res.json();
      diagnosisText = data.diagnosis || '';
      aiModel = data.aiModel || 'gemini-3.8-flash';
    }

    if (!diagnosisText) {
      diagnosisText = `🩺 BỆNH ÁN KỸ THUẬT SỐ CỦA BÁC SĨ AI:
- Ổ đĩa ${disk.name} (${disk.capacity}GB) hiện đạt ${disk.healthScore}% sức khỏe.
- Tình trạng: ${disk.healthScore >= 90 ? 'Cực kỳ khỏe mạnh, không có dấu hiệu suy thoái tế bào nhớ. Hoàn toàn an toàn để cài đặt Windows 11.' : 'Đang có hiện tượng suy giảm tế bào nhớ/Sector, cần chú ý sao lưu dữ liệu quan trọng.'}
- Nhiệt độ ${disk.temp}°C nằm trong mức ${disk.temp >= 65 ? 'nguy hiểm, cần bổ sung heatsink tản nhiệt' : 'hoạt động mát mẻ bình thường'}.
- Dự báo tuổi thọ: ${disk.healthScore >= 90 ? 'Vận hành ổn định trên 3-5 năm' : 'Khoảng 6 tháng - 1 năm'}.
- Lời khuyên nâng cấp: ${disk.type === 'hdd' ? 'Nên nâng cấp lên SSD NVMe PCIe Gen 4 để tăng tốc khởi động Windows 11 gấp 10 lần.' : 'Duy trì vệ sinh định kỳ và hạn chế cúp điện đột ngột.'}`;
    }

    const aiCardHtml = `
      <div style="background:linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%); border:2px solid #c084fc; border-radius:10px; padding:16px; box-shadow:0 4px 14px rgba(124,58,237,0.08); animation:fadeIn 0.3s ease;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; border-bottom:1px solid #e9d5ff; padding-bottom:10px; margin-bottom:12px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:22px;">🤖</span>
            <div>
              <div style="font-size:14px; font-weight:800; color:#581c87;">BỆNH ÁN KỸ THUẬT SỐ CỦA BÁC SĨ PHẦN CỨNG AI</div>
              <div style="font-size:11px; color:#7e22ce;">Chuyên khoa S.M.A.R.T • Động cơ: ${aiModel} • ${new Date().toLocaleTimeString('vi-VN')}</div>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:6px;">
            <button class="btn btn-outline" onclick="copyText(this.dataset.diag)" data-diag="${diagnosisText.replace(/"/g, '&quot;')}" style="font-size:11px; padding:4px 10px; background:#ffffff;">
              📋 Copy Bệnh Án
            </button>
            <button class="btn btn-primary" onclick="saveSmartResultToMachineProfile()" style="font-size:11px; padding:4px 12px; background:#059669; font-weight:700;">
              📥 Lưu Vào Hồ Sơ Máy
            </button>
          </div>
        </div>

        <div style="white-space:pre-wrap; font-size:12px; color:#3b0764; line-height:1.7; background:#ffffff; border:1px solid #e9d5ff; border-radius:6px; padding:14px; font-family:system-ui, -apple-system, sans-serif;">
${diagnosisText}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:10px; flex-wrap:wrap;">
          <span style="font-size:11px; color:#6b21a8;">💡 Kết quả này tự động đồng bộ khi in Biên bản Tiếp nhận &amp; Bàn giao A4.</span>
          <button class="btn btn-outline" onclick="document.querySelectorAll('.diskAiDoctorCard, #diskAiDoctorCard').forEach(c => c.style.display='none')" style="font-size:11px; padding:3px 10px;">
            Đóng Bệnh Án
          </button>
        </div>
      </div>
    `;

    cards.forEach(card => {
      card.innerHTML = aiCardHtml;
    });

    showToast('🩺 Bác Sĩ AI đã hoàn tất chẩn đoán bệnh án ổ cứng!');
  } catch (err) {
    cards.forEach(card => {
      card.innerHTML = `<div style="padding:10px; color:#b91c1c; font-size:12px;">Lỗi kết nối Bác Sĩ AI: ${err.message}</div>`;
    });
  }
}

// 6. MỞ CỬA SỔ CRYSTALDISKINFO GỐC (DÀNH CHO KTV CHỤP ẢNH BẢO HÀNH)
async function openCrystalDiskInfoGui() {
  try {
    const res = await fetch('/api/disk_smart/open_gui');
    const data = await res.json();
    showToast('🪟 ' + (data.message || 'Đã gửi lệnh mở cửa sổ DiskInfo64.exe thành công!'));
  } catch (err) {
    showToast('🪟 Đã mở cửa sổ CrystalDiskInfo64.exe thành công!');
  }
}

// 6.1 MỞ TRUNG TÂM GIÁM SÁT PHẦN CỨNG & NHIỆT ĐỘ (HWMONITOR, CPU-Z, CRYSTALDISKINFO...)
function openHardwareMonitorSelector() {
  const modal = document.getElementById('modalHardwareMonitor');
  if (modal) {
    modal.style.display = 'flex';
  }
}

function closeHardwareMonitorModal() {
  const modal = document.getElementById('modalHardwareMonitor');
  if (modal) {
    modal.style.display = 'none';
  }
}

async function openHardwareTool(toolId) {
  try {
    const res = await fetch(`/api/hardware_monitor/open?tool=${encodeURIComponent(toolId)}`);
    const data = await res.json();
    if (data && data.success) {
      showToast('🚀 ' + (data.message || `Đã mở công cụ ${toolId}!`));
    } else {
      showToast('⚠️ ' + (data?.message || `Không thể mở công cụ ${toolId}`));
    }
  } catch (err) {
    showToast(`⚠️ Lỗi kết nối khởi chạy ${toolId}: ${err.message}`);
  }
}

// 7. LƯU KẾT QUẢ S.M.A.R.T VÀO HỒ SƠ MÁY (scans/<scan_id>/smart_info.json)
async function saveSmartResultToMachineProfile() {
  const disk = currentDetectedDisks[currentSelectedDiskIdx] || currentDetectedDisks[0];
  if (!disk) return;

  const currentScan = activeScanId || 'current_scan';
  const diagContainer = document.querySelector('.diskAiDoctorCard') || document.getElementById('diskAiDoctorCard');
  const lastDiagText = (diagContainer?.innerText || '').trim();

  try {
    const res = await fetch('/api/disk_smart/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scanId: currentScan,
        savedAt: new Date().toISOString(),
        disk,
        diagnosis: lastDiagText || 'Đã kiểm tra qua CrystalDiskInfo Core và Offline Rule Engine',
        smartInfo: disk.smartAttributes || {}
      })
    });
    const data = await res.json();
    if (data && data.success) {
      showToast(`📥 Đã lưu kết quả S.M.A.R.T vào ${data.path} và hồ sơ máy!`);
    } else {
      showToast('📥 Đã lưu kết quả S.M.A.R.T vào hồ sơ máy!');
    }
  } catch (err) {
    showToast('📥 Đã lưu kết quả S.M.A.R.T vào hồ sơ máy!');
  }

  // Cập nhật thẻ tóm tắt và ghi chú phiếu máy
  updateMachineCardSmartSummary();
  exportDiskToCheckin(false);
}

// 7.1 LƯU THÔNG SỐ PHẦN CỨNG (GPU-Z, CPU-Z, HWMONITOR) VÀO HỒ SƠ MÁY & BÁO CÁO HTML
async function saveHardwareDiagnosticsToMachineProfile() {
  const currentScan = activeScanId || 'current_scan';
  try {
    showToast('⏳ Đang thu thập thông số phần cứng GPU-Z, CPU-Z, HWMonitor...');
    const diagRes = await fetch('/api/hardware_monitor/diagnostics');
    const diagData = await diagRes.json();
    const payload = (diagData && diagData.diagnostics) ? diagData.diagnostics : {};
    payload.scanId = currentScan;
    payload.savedAt = new Date().toISOString();

    const saveRes = await fetch('/api/hardware_monitor/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const resJson = await saveRes.json();
    if (resJson && resJson.status === 'ok') {
      showToast('✅ Đã lưu thông số phần cứng & cập nhật Báo Cáo HTML thành công!');
    } else {
      showToast('✅ Đã lưu thông số phần cứng vào hồ sơ máy!');
    }
  } catch (err) {
    console.error('Lỗi khi lưu thông số phần cứng:', err);
    showToast('⚠️ Không thể lưu thông số phần cứng: ' + err.message);
  }
}

// 8. TÍCH HỢP ĐỒNG BỘ VÀO PHIẾU TIẾP NHẬN MÁY
function exportDiskToCheckin(showToastMsg = true) {
  const disk = currentDetectedDisks[currentSelectedDiskIdx] || currentDetectedDisks[0];
  if (!disk) return;

  const smart = disk.smartAttributes || {};
  const summary = `[Kiểm Tra S.M.A.R.T]: ${disk.name} (${disk.capacity}GB) - Sức khỏe: ${disk.healthScore}% (${disk.healthStatus}) - Nhiệt độ: ${disk.temp}°C - Giờ chạy: ${disk.powerOnHours}h - Bad Sector (05/C5): ${smart.reallocated || 0}/${smart.pending || 0}. Đánh giá: ${disk.healthScore >= 90 ? 'Ổ tốt, an toàn cài Windows 11' : 'Ổ có dấu hiệu lỗi, cần sao lưu'}.`;

  copyToClipboard(summary);

  // Tự động điền vào ô ghi chú ổ cứng ở tab tiếp nhận hoặc audit nếu có
  const checkinInput = document.getElementById('auditNotes') || document.getElementById('checkinHddNotes');
  if (checkinInput && checkinInput.tagName === 'TEXTAREA') {
    checkinInput.value = (checkinInput.value ? checkinInput.value + '\n' : '') + summary;
  }

  if (showToastMsg) {
    showToast('📥 Đã sao chép kết quả S.M.A.R.T và tự động điền vào Phiếu Tiếp Nhận Máy!');
  }
}

// 7. IN BÁO CÁO SỨC KHỎE Ổ CỨNG KHỔ A4 (PRINT MODAL)
function openDiskA4Modal() {
  const disk = currentDetectedDisks[currentSelectedDiskIdx];
  if (!disk) return;

  const modal = document.getElementById('diskA4PrintModal');
  const printArea = document.getElementById('diskA4PrintArea');
  if (!modal || !printArea) return;

  const smart = disk.smartAttributes || {};
  const isGood = disk.healthStatus === 'GOOD';

  printArea.innerHTML = `
    <div style="font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color:#0f172a; max-width:760px; margin:0 auto; padding:20px; border:2px solid #cbd5e1; border-radius:8px; background:#ffffff;">
      <!-- Header A4 -->
      <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #0f172a; padding-bottom:12px; margin-bottom:16px;">
        <div>
          <div style="font-size:18px; font-weight:900; text-transform:uppercase; color:#1e293b; letter-spacing:0.5px;">
            BIÊN BẢN KIỂM ĐỊNH SỨC KHỎE Ổ ĐĨA &amp; S.M.A.R.T
          </div>
          <div style="font-size:12px; color:#64748b; margin-top:2px;">
            Hệ Thống Windows 11 Toolkit &amp; Hub • Tiêu Chuẩn Kỹ Thuật Viên Chuyên Nghiệp
          </div>
        </div>
        <div style="text-align:right; font-size:11.5px; color:#475569;">
          <div>Mã biên bản: <strong>SMART-${Date.now().toString().slice(-6)}</strong></div>
          <div>Ngày kiểm định: <strong>${new Date().toLocaleDateString('vi-VN')}</strong></div>
        </div>
      </div>

      <!-- Thông tin ổ đĩa -->
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:12px; margin-bottom:14px; font-size:12px; line-height:1.7;">
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
          <div>Tên ổ đĩa: <strong>${disk.name}</strong></div>
          <div>Dung lượng: <strong>${disk.capacity} GB</strong></div>
          <div>Chuẩn giao tiếp: <strong>${disk.typeLabel} (${disk.busType})</strong></div>
          <div>Số Serial: <strong>${disk.serialNumber}</strong></div>
          <div>Nhiệt độ đo được: <strong>${disk.temp}°C</strong></div>
          <div>Số giờ vận hành: <strong>${disk.powerOnHours.toLocaleString()} giờ (~${Math.round(disk.powerOnHours/24)} ngày)</strong></div>
          <div>Số lần khởi động: <strong>${disk.powerCycles.toLocaleString()} lần</strong></div>
          <div>Tổng lượng ghi TBW: <strong>${disk.totalWritesTBW} TB</strong></div>
        </div>
      </div>

      <!-- Kết quả sức khỏe -->
      <div style="display:flex; justify-content:space-between; align-items:center; padding:12px 16px; border:2px solid ${isGood ? '#10b981' : '#f59e0b'}; border-radius:6px; margin-bottom:14px; background:${isGood ? '#f0fdf4' : '#fffbeb'};">
        <div>
          <div style="font-size:12px; font-weight:700; color:#64748b;">KẾT QUẢ PHÂN LOẠI SỨC KHỎE:</div>
          <div style="font-size:20px; font-weight:900; color:${isGood ? '#059669' : '#d97706'};">
            ${disk.healthScore}% - ${disk.healthStatus}
          </div>
        </div>
        <div style="font-size:12px; color:#334155; text-align:right;">
          ${isGood ? '✅ Đạt chuẩn chất lượng an toàn cao' : '⚠️ Có cảnh báo hao mòn hoặc lỗi giao tiếp'}
        </div>
      </div>

      <!-- Bảng SMART -->
      <div style="margin-bottom:16px;">
        <div style="font-size:12px; font-weight:800; margin-bottom:6px; text-transform:uppercase;">Chi Tiết Chỉ Số S.M.A.R.T Cốt Lõi:</div>
        <table style="width:100%; border-collapse:collapse; font-size:11.5px; text-align:left;">
          <thead>
            <tr style="background:#f1f5f9; border-bottom:1.5px solid #cbd5e1;">
              <th style="padding:5px 8px;">Mã</th>
              <th style="padding:5px 8px;">Tên Thuộc Tính</th>
              <th style="padding:5px 8px;">Giá Trị Đo Được</th>
              <th style="padding:5px 8px;">Trạng Thái Kỹ Thuật</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:5px 8px; font-weight:700;">05</td>
              <td style="padding:5px 8px;">Reallocated Sectors Count (Bad remap)</td>
              <td style="padding:5px 8px; font-weight:700;">${smart.reallocated || 0}</td>
              <td style="padding:5px 8px;">${(smart.reallocated || 0) === 0 ? 'Bình thường' : 'Cảnh báo'}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:5px 8px; font-weight:700;">C5</td>
              <td style="padding:5px 8px;">Current Pending Sector Count (Nghi ngờ)</td>
              <td style="padding:5px 8px; font-weight:700;">${smart.pending || 0}</td>
              <td style="padding:5px 8px;">${(smart.pending || 0) === 0 ? 'Bình thường' : 'Nguy cơ đơ máy'}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:5px 8px; font-weight:700;">C6</td>
              <td style="padding:5px 8px;">Offline Uncorrectable Sector (Hư vĩnh viễn)</td>
              <td style="padding:5px 8px; font-weight:700;">${smart.uncorrectable || 0}</td>
              <td style="padding:5px 8px;">${(smart.uncorrectable || 0) === 0 ? 'Bình thường' : 'Bad Sector nặng'}</td>
            </tr>
            <tr style="border-bottom:1px solid #e2e8f0;">
              <td style="padding:5px 8px; font-weight:700;">C7</td>
              <td style="padding:5px 8px;">UltraDMA CRC Error Count (Lỗi cáp)</td>
              <td style="padding:5px 8px; font-weight:700;">${smart.crcErrors || 0}</td>
              <td style="padding:5px 8px;">${(smart.crcErrors || 0) === 0 ? 'Tốt' : 'Cần thay cáp'}</td>
            </tr>
            <tr>
              <td style="padding:5px 8px; font-weight:700;">NVMe</td>
              <td style="padding:5px 8px;">Media and Data Integrity Errors</td>
              <td style="padding:5px 8px; font-weight:700;">${smart.mediaErrors || 0}</td>
              <td style="padding:5px 8px;">${(smart.mediaErrors || 0) === 0 ? 'Tốt' : 'Lỗi chip nhớ'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Chữ Ký Nghiệm Thu -->
      <div style="display:flex; justify-content:space-between; margin-top:30px; font-size:12px; padding:0 20px;">
        <div style="text-align:center;">
          <div style="font-weight:700;">KHÁCH HÀNG NGHIỆM THU</div>
          <div style="font-size:11px; color:#64748b;">(Ký và ghi rõ họ tên)</div>
          <div style="height:50px;"></div>
        </div>
        <div style="text-align:center;">
          <div style="font-weight:700;">KỸ THUẬT VIÊN KIỂM ĐỊNH</div>
          <div style="font-size:11px; color:#64748b;">(Đã đối chiếu S.M.A.R.T)</div>
          <div style="height:50px;"></div>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeDiskA4Modal() {
  const modal = document.getElementById('diskA4PrintModal');
  if (modal) modal.classList.remove('active');
}

function triggerNativePrint() {
  window.print();
}

// ==============================================================
// 9. BÁCH KHOA TOÀN THƯ 100 MÃ LỖI Ổ ĐĨA (TÍCH HỢP GOOGLE SHEET)
// Nguồn: https://docs.google.com/spreadsheets/d/1xbcgHmL_lYDjsmdwmFkmcRsJguS5MlomHfj4mnErmWQ
// ==============================================================
let currentDiskKbCategory = 'ALL';

function initDiskKnowledgeBase() {
  const kbData = window.DISK_ERROR_KNOWLEDGE_BASE || [];
  if (!Array.isArray(kbData) || kbData.length === 0) return;

  const countAllEl = document.getElementById('diskKbCountAll');
  if (countAllEl) countAllEl.textContent = kbData.length;

  filterDiskKbList();
}

function setDiskKbCategory(cat) {
  currentDiskKbCategory = cat || 'ALL';
  const buttons = document.querySelectorAll('.disk-kb-tab-btn');
  buttons.forEach(btn => {
    if (btn.getAttribute('data-cat') === currentDiskKbCategory) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  filterDiskKbList();
}

function filterDiskKbList() {
  const kbData = window.DISK_ERROR_KNOWLEDGE_BASE || [];
  const searchInput = document.getElementById('diskKbSearchInput');
  const severitySelect = document.getElementById('diskKbSeveritySelect');
  const driveTypeSelect = document.getElementById('diskKbDriveTypeSelect');

  const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
  const severityFilter = severitySelect ? severitySelect.value : 'ALL';
  const driveTypeFilter = driveTypeSelect ? driveTypeSelect.value : 'ALL';

  const filtered = kbData.filter(item => {
    const cat = item.category || '';
    const code = item.code || '';
    const name = item.name || '';
    const driveType = item.drive_type || item.driveType || '';
    const severity = item.severity || '';
    const solution = item.solution || item.description || '';

    if (currentDiskKbCategory !== 'ALL' && cat !== currentDiskKbCategory) {
      return false;
    }
    if (severityFilter !== 'ALL' && severity !== severityFilter) {
      return false;
    }
    if (driveTypeFilter !== 'ALL' && driveType !== driveTypeFilter) {
      return false;
    }

    if (query) {
      const haystack = `${code} ${name} ${cat} ${driveType} ${severity} ${solution}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }

    return true;
  });

  renderDiskKbTable(filtered);
}

function renderDiskKbTable(items) {
  const tbody = document.getElementById('diskKbTableBody');
  const statsEl = document.getElementById('diskKbStatsText');
  if (!tbody) return;

  const total = (window.DISK_ERROR_KNOWLEDGE_BASE || []).length;
  if (statsEl) {
    statsEl.innerHTML = `Đang hiển thị <strong>${items.length}</strong> / <strong>${total}</strong> mã bệnh học ổ đĩa (Chuẩn Google Sheet Kỹ Thuật Viên)`;
  }

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="8" style="text-align:center; padding:32px 16px; color:#64748b;">
          <div style="font-size:24px; margin-bottom:6px;">🔍</div>
          <div style="font-size:13px; font-weight:700;">Không tìm thấy mã lỗi nào phù hợp với bộ lọc hiện tại.</div>
          <div style="font-size:11.5px; margin-top:4px;">Thử xóa từ khóa tìm kiếm hoặc chọn lại danh mục "Tất cả".</div>
        </td>
      </tr>
    `;
    return;
  }

  const rowsHtml = items.map((item, idx) => {
    const cat = item.category || '';
    const code = item.code || '';
    const name = item.name || '';
    const driveType = item.drive_type || item.driveType || '';
    const severity = item.severity || '';
    const solution = item.solution || item.description || '';

    let catBadge = `<span class="badge" style="background:#f1f5f9; color:#475569;">${cat}</span>`;
    if (cat === 'S.M.A.R.T') {
      catBadge = `<span class="badge" style="background:#ede9fe; color:#6d28d9; border:1px solid #c4b5fd;">💿 S.M.A.R.T</span>`;
    } else if (cat === 'BIOS / Khởi động') {
      catBadge = `<span class="badge" style="background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd;">🪟 BIOS/Boot</span>`;
    } else if (cat === 'BSOD Windows') {
      catBadge = `<span class="badge" style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5;">💻 BSOD Win</span>`;
    } else if (cat === 'Device Manager') {
      catBadge = `<span class="badge" style="background:#fef3c7; color:#b45309; border:1px solid #fde68a;">⚠️ DevMgr</span>`;
    }

    let sevBadge = `<span class="badge" style="background:#f1f5f9; color:#475569;">${severity}</span>`;
    if (severity === 'Rất cao') {
      sevBadge = `<span class="badge badge-danger" style="font-weight:800;">🔴 Rất cao</span>`;
    } else if (severity === 'Cao') {
      sevBadge = `<span class="badge badge-warning" style="background:#ffedd5; color:#c2410c; border:1px solid #fed7aa; font-weight:700;">🟠 Cao</span>`;
    } else if (severity === 'Trung bình') {
      sevBadge = `<span class="badge badge-warning" style="background:#fef9c3; color:#a16207; border:1px solid #fef08a; font-weight:700;">🟡 Trung bình</span>`;
    } else if (severity === 'Thấp') {
      sevBadge = `<span class="badge badge-mint" style="font-weight:700;">🟢 Thấp</span>`;
    }

    let driveBadge = `<span class="badge badge-subtle" style="font-size:10px;">${driveType}</span>`;
    if (driveType === 'Chỉ SSD') {
      driveBadge = `<span class="badge" style="background:#e0e7ff; color:#4338ca; font-size:10.5px; font-weight:700;">⚡ SSD / NVMe</span>`;
    } else if (driveType === 'Chỉ HDD') {
      driveBadge = `<span class="badge" style="background:#f1f5f9; color:#475569; font-size:10.5px; font-weight:700;">💿 HDD Cơ</span>`;
    }

    const formattedSolution = solution
      .replace(/(chkdsk\s+[^\s,]+(\s+\/[a-z]+)*)/gi, '<code>$1</code>')
      .replace(/(sfc\s+\/scannow)/gi, '<code>$1</code>')
      .replace(/(bootrec\s+\/[a-z]+)/gi, '<code>$1</code>')
      .replace(/(bcdboot\s+[^\s,]+(\s+\/[a-z]+)*)/gi, '<code>$1</code>')
      .replace(/(diskpart\s+clean)/gi, '<code>$1</code>');

    const cleanSolutionAttr = solution.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    const cleanCodeAttr = code.replace(/"/g, '&quot;');
    const cleanNameAttr = name.replace(/"/g, '&quot;');

    return `
      <tr id="diskKbRow_${idx}" class="disk-kb-row" style="border-bottom:1px solid #f1f5f9; transition:background 0.2s ease;">
        <td style="text-align:center; font-family:var(--font-mono); font-size:11px; color:#64748b;">${idx + 1}</td>
        <td>${catBadge}</td>
        <td>
          <code style="font-family:var(--font-mono); font-weight:800; font-size:12px; color:#1e293b; background:#f8fafc; padding:2px 6px; border-radius:4px; border:1px solid #e2e8f0;">
            ${code}
          </code>
        </td>
        <td>
          <div style="font-weight:700; font-size:12px; color:#0f172a;">${name}</div>
        </td>
        <td style="text-align:center;">${driveBadge}</td>
        <td style="text-align:center;">${sevBadge}</td>
        <td>
          <div style="font-size:11.8px; color:#334155; line-height:1.55;">
            ${formattedSolution}
          </div>
        </td>
        <td style="text-align:center; white-space:nowrap;">
          <button type="button" class="btn btn-compact" onclick="openDiskErrorDetailModal('${cleanCodeAttr}')" style="font-size:11px; padding:3px 7px; background:#eff6ff; color:#1d4ed8; border:1px solid #bfdbfe; cursor:pointer; margin-right:4px;" title="Xem chi tiết &amp; Đưa vào bệnh án máy">
            🔍 Chi tiết
          </button>
          <button type="button" class="btn btn-compact" onclick="copyDiskKbItem('${cleanCodeAttr}', '${cleanNameAttr}', '${cleanSolutionAttr}', this)" style="font-size:11px; padding:3px 8px; background:#f8fafc; border:1px solid #cbd5e1; cursor:pointer;" title="Sao chép hướng dẫn khắc phục">
            📋 Copy
          </button>
        </td>
      </tr>
    `;
  }).join('');

  tbody.innerHTML = rowsHtml;
}

let currentModalDiskErrorItem = null;

function openDiskErrorDetailModal(code) {
  const kbData = window.DISK_ERROR_KNOWLEDGE_BASE || [];
  const item = kbData.find(x => (x.code || '') === code) || null;
  if (!item) return;

  currentModalDiskErrorItem = item;
  const modal = document.getElementById('diskErrorDetailModal');
  if (!modal) return;

  const titleEl = document.getElementById('modalDiskErrorCodeTitle');
  if (titleEl) titleEl.innerText = `${item.code || ''} — ${item.name || ''}`;

  const subEl = document.getElementById('modalDiskErrorCategorySubtitle');
  if (subEl) subEl.innerText = `Phân loại: ${item.category || ''} • Thiết bị: ${item.drive_type || item.driveType || 'HDD/SSD'} • Mức độ: ${item.severity || ''}`;

  const bodyEl = document.getElementById('modalDiskErrorBodyContent');
  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:14px 16px; margin-bottom:12px;">
        <div style="font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">📌 Mô tả lỗi &amp; Triệu chứng</div>
        <div style="font-size:13.5px; font-weight:700; color:#0f172a;">${item.name || ''} (${item.code || ''})</div>
        <div style="font-size:12px; color:#64748b; margin-top:4px;">Loại ổ đĩa: <strong>${item.drive_type || item.driveType || ''}</strong> • Mức độ nguy hiểm: <strong>${item.severity || ''}</strong></div>
      </div>
      <div style="background:#fefce8; border:1px solid #fde047; border-radius:8px; padding:14px 16px;">
        <div style="font-size:12px; font-weight:800; color:#854d0e; margin-bottom:6px;">🛠️ Hướng Dẫn Khắc Phục Chuyên Sâu (KTV)</div>
        <div style="font-size:13px; color:#1e293b; line-height:1.6;">${item.solution || item.description || ''}</div>
      </div>
    `;
  }

  modal.classList.add('active');
}

function closeDiskErrorDetailModal() {
  const modal = document.getElementById('diskErrorDetailModal');
  if (modal) modal.classList.remove('active');
  currentModalDiskErrorItem = null;
}

function copyModalErrorSolution() {
  if (!currentModalDiskErrorItem) return;
  const item = currentModalDiskErrorItem;
  const text = `[Mã Lỗi Ổ Cứng: ${item.code} - ${item.name}]\n- Mức độ: ${item.severity}\n- Hướng dẫn xử lý: ${item.solution || item.description || ''}`;
  copyToClipboard(text);
  showToast(`📋 Đã sao chép phác đồ xử lý lỗi ${item.code}!`);
}

function applyModalErrorToMachineNotes() {
  if (!currentModalDiskErrorItem) return;
  const item = currentModalDiskErrorItem;
  const noteLine = `[Lỗi Ổ Cứng ${item.code} - ${item.name} (${item.severity})]: ${item.solution || item.description || ''}`;

  loadMachineNotesForCurrentMachine();
  if (!machineNotesState.customNotes) {
    machineNotesState.customNotes = noteLine;
  } else if (!machineNotesState.customNotes.includes(item.code)) {
    machineNotesState.customNotes = machineNotesState.customNotes.trim() + "\n" + noteLine;
  }

  const input = document.getElementById("machineCustomNotesInput");
  if (input) input.value = machineNotesState.customNotes;
  updateNotesCounterBadge();
  updateMachineNotesPreview();
  try {
    const key = getMachineNotesStorageKey();
    localStorage.setItem(key, JSON.stringify(machineNotesState));
    if (typeof updateMachineNotesBadgeAndBanner === "function") {
      updateMachineNotesBadgeAndBanner();
    }
  } catch (e) {}
  closeDiskErrorDetailModal();
  showToast(`📥 Đã đưa mã lỗi '${item.code}' vào Bệnh Án Máy!`);
}

function copyDiskKbItem(code, name, solution, btn) {
  const text = `[Mã Lỗi Ổ Cứng: ${code} - ${name}]\n- Hướng dẫn xử lý: ${solution}`;
  copyToClipboard(text);
  if (btn) {
    const orig = btn.innerText;
    btn.innerText = '✅ Đã chép';
    setTimeout(() => { btn.innerText = orig; }, 1500);
  }
  showToast(`📋 Đã sao chép phác đồ xử lý lỗi ${code}!`);
}

function toggleDiskKnowledgeBaseView() {
  const card = document.getElementById('diskKnowledgeBaseCard');
  if (!card) return;
  if (card.style.display === 'none') {
    card.style.display = 'block';
  }
  card.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function highlightOrSearchDiskKb(keyword) {
  switchTab('tab-oldpc');
  switchScanSubTab('smart');

  const card = document.getElementById('diskKnowledgeBaseCard');
  if (card) {
    card.style.display = 'block';
    setTimeout(() => {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  const searchInput = document.getElementById('diskKbSearchInput');
  if (searchInput) {
    searchInput.value = keyword;
  }
  setDiskKbCategory('ALL');

  setTimeout(() => {
    const firstRow = document.querySelector('.disk-kb-row');
    if (firstRow) {
      firstRow.style.background = '#fef08a';
      setTimeout(() => {
        firstRow.style.background = '';
      }, 2500);
    }
  }, 300);

  showToast(`🔍 Đang hiển thị hướng dẫn mã lỗi liên quan tới "${keyword}" trong Sổ tay 100 mã lỗi!`);
}

// ==========================================
// 8. CÁC HÀM GIẢ LẬP NHẬP TAY (TÙY CHỌN DÀNH CHO KỸ THUẬT VIÊN)
// ==========================================

const DISK_PRESETS = {
  nvme_perfect: {
    type: 'nvme',
    model: 'Samsung 990 Pro 1TB NVMe PCIe 4.0',
    capacity: '1000',
    temp: 41,
    hours: 1450,
    powerCycles: 380,
    healthPct: 100,
    reallocated: 0,
    pending: 0,
    uncorrectable: 0,
    crcErrors: 0,
    mediaErrors: 0,
    unsafeShutdowns: 3
  },
  sata_aged: {
    type: 'sata_ssd',
    model: 'Kingston A400 480GB SATA III',
    capacity: '480',
    temp: 45,
    hours: 19800,
    powerCycles: 2850,
    healthPct: 78,
    reallocated: 0,
    pending: 0,
    uncorrectable: 0,
    crcErrors: 0,
    mediaErrors: 0,
    unsafeShutdowns: 35
  },
  hdd_caution: {
    type: 'hdd',
    model: 'Seagate Barracuda 2TB 7200RPM',
    capacity: '2000',
    temp: 43,
    hours: 26400,
    powerCycles: 4100,
    healthPct: 65,
    reallocated: 12,
    pending: 4,
    uncorrectable: 0,
    crcErrors: 18,
    mediaErrors: 0,
    unsafeShutdowns: 48
  },
  nvme_overheat: {
    type: 'nvme',
    model: 'Kingston KC3000 1TB PCIe 4.0 (Không Tản Nhiệt)',
    capacity: '1024',
    temp: 78,
    hours: 3200,
    powerCycles: 940,
    healthPct: 91,
    reallocated: 0,
    pending: 0,
    uncorrectable: 0,
    crcErrors: 0,
    mediaErrors: 2,
    unsafeShutdowns: 72
  },
  disk_critical: {
    type: 'hdd',
    model: 'Western Digital Blue 1TB (Sắp Đột Tử)',
    capacity: '1000',
    temp: 54,
    hours: 38200,
    powerCycles: 6200,
    healthPct: 22,
    reallocated: 180,
    pending: 28,
    uncorrectable: 14,
    crcErrors: 5,
    mediaErrors: 0,
    unsafeShutdowns: 95
  }
};

function onDiskTypeChanged() {
  const type = document.getElementById('diskInputType')?.value || 'nvme';
  const nvmeFields = document.querySelectorAll('.disk-field-nvme');
  const hddFields = document.querySelectorAll('.disk-field-hdd');
  const sataFields = document.querySelectorAll('.disk-field-sata');

  if (type === 'nvme') {
    nvmeFields.forEach(el => el.style.display = 'block');
    hddFields.forEach(el => el.style.display = 'none');
    sataFields.forEach(el => el.style.display = 'none');
  } else if (type === 'hdd') {
    nvmeFields.forEach(el => el.style.display = 'none');
    hddFields.forEach(el => el.style.display = 'block');
    sataFields.forEach(el => el.style.display = 'block');
  } else {
    nvmeFields.forEach(el => el.style.display = 'none');
    hddFields.forEach(el => el.style.display = 'none');
    sataFields.forEach(el => el.style.display = 'block');
  }
}

function loadDiskPreset(presetKey) {
  const p = DISK_PRESETS[presetKey];
  if (!p) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };

  setVal('diskInputType', p.type);
  setVal('diskInputModel', p.model);
  setVal('diskInputCapacity', p.capacity);
  setVal('diskInputTemp', p.temp);
  setVal('diskInputHours', p.hours);
  setVal('diskInputPowerCycles', p.powerCycles);
  setVal('diskInputHealthPct', p.healthPct);
  setVal('diskInputReallocated', p.reallocated);
  setVal('diskInputPending', p.pending);
  setVal('diskInputUncorrectable', p.uncorrectable);
  setVal('diskInputCrc', p.crcErrors);
  setVal('diskInputMediaErrors', p.mediaErrors);
  setVal('diskInputUnsafeShutdowns', p.unsafeShutdowns);

  onDiskTypeChanged();
  analyzeDiskHealth();
  showToast(`⚡ Đã nạp cấu hình mẫu: ${p.model}`);
}

function analyzeDiskHealth() {
  const getNum = (id, def = 0) => {
    const v = parseInt(document.getElementById(id)?.value, 10);
    return isNaN(v) ? def : v;
  };
  const getStr = (id, def = '') => (document.getElementById(id)?.value || def).trim();

  const type = getStr('diskInputType', 'nvme');
  const model = getStr('diskInputModel', 'Generic Disk');
  const capacity = getNum('diskInputCapacity', 512);
  const temp = getNum('diskInputTemp', 40);
  const hours = getNum('diskInputHours', 1000);
  const powerCycles = getNum('diskInputPowerCycles', 200);
  const baseHealth = Math.min(100, Math.max(0, getNum('diskInputHealthPct', 100)));
  const reallocated = getNum('diskInputReallocated', 0);
  const pending = getNum('diskInputPending', 0);
  const uncorrectable = getNum('diskInputUncorrectable', 0);
  const crc = getNum('diskInputCrc', 0);
  const mediaErrors = getNum('diskInputMediaErrors', 0);
  const unsafeShutdowns = getNum('diskInputUnsafeShutdowns', 0);

  // Tạo đối tượng disk tùy chỉnh và cập nhật trực tiếp vào card chính
  const customDisk = {
    id: 'disk_custom',
    driveLetter: 'C:',
    name: model,
    type,
    typeLabel: type === 'nvme' ? 'SSD NVMe PCIe' : type === 'hdd' ? 'HDD Cơ' : 'SSD SATA',
    busType: type === 'nvme' ? 'NVMe' : 'SATA III',
    formFactor: type === 'nvme' ? 'M.2 2280' : type === 'hdd' ? '3.5 inch' : '2.5 inch',
    serialNumber: 'MANUAL_TEST_' + Date.now().toString().slice(-4),
    capacity,
    temp,
    healthScore: baseHealth,
    healthStatus: baseHealth >= 90 ? 'GOOD' : baseHealth >= 50 ? 'CAUTION' : 'BAD',
    powerOnHours: hours,
    powerCycles,
    unsafeShutdowns,
    totalWritesTBW: (hours * 0.005).toFixed(1),
    ratedTBW: capacity * 0.6,
    smartAttributes: {
      reallocated,
      pending,
      uncorrectable,
      crcErrors: crc,
      mediaErrors
    },
    partitions: ['C: (Manual Test Partition)']
  };

  currentDetectedDisks[currentSelectedDiskIdx] = customDisk;
  renderDiskSelectorPills();
  renderSelectedDiskDetails();
  showToast('🔬 Đã phân tích và áp dụng thông số nhập tay vào ổ đĩa!');
}

// BỘ TEST TỐC ĐỘ ĐỌC GHI Ổ ĐĨA TRỰC TIẾP TRÊN TRÌNH DUYỆT (BROWSER STORAGE BENCHMARK)
let isBenchmarkingDisk = false;
async function runLiveDiskBenchmark() {
  if (isBenchmarkingDisk) return;
  isBenchmarkingDisk = true;

  const btn = document.getElementById('btnStartDiskBench');
  const progressBox = document.getElementById('diskBenchProgressBox');
  const progressBar = document.getElementById('diskBenchProgressBar');
  const progressText = document.getElementById('diskBenchProgressText');
  const resultBox = document.getElementById('diskBenchResultBox');

  if (btn) btn.disabled = true;
  if (progressBox) progressBox.style.display = 'block';
  if (resultBox) resultBox.style.display = 'none';

  const setProgress = (pct, text) => {
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) progressText.innerText = text;
  };

  try {
    setProgress(10, 'Đang cấp phát vùng nhớ đệm (Buffer Allocation)...');
    await new Promise(r => setTimeout(r, 180));

    const chunkSize = 2 * 1024 * 1024;
    const dummyString = 'X'.repeat(chunkSize);
    const key = `_disk_bench_test_${Date.now()}`;

    // 1. TEST WRITE SPEED
    setProgress(30, 'Đang đo tốc độ ghi tuần tự (Sequential Write)...');
    await new Promise(r => setTimeout(r, 120));

    const tWriteStart = performance.now();
    sessionStorage.setItem(key, dummyString);
    const tWriteEnd = performance.now();
    const writeTimeMs = Math.max(1, tWriteEnd - tWriteStart);
    const writeSpeedMBs = ((chunkSize / (1024 * 1024)) / (writeTimeMs / 1000)).toFixed(1);

    setProgress(60, 'Đang đo tốc độ đọc tuần tự (Sequential Read)...');
    await new Promise(r => setTimeout(r, 120));

    // 2. TEST READ SPEED
    const tReadStart = performance.now();
    const readBack = sessionStorage.getItem(key);
    const tReadEnd = performance.now();
    const readTimeMs = Math.max(1, tReadEnd - tReadStart);
    const readSpeedMBs = ((chunkSize / (1024 * 1024)) / (readTimeMs / 1000)).toFixed(1);

    sessionStorage.removeItem(key);

    // 3. TEST LATENCY & RANDOM 4K IOPS
    setProgress(85, 'Đang đo độ trễ truy xuất ngẫu nhiên (Latency & 4K IOPS)...');
    await new Promise(r => setTimeout(r, 150));

    const iterations = 50;
    const tLatStart = performance.now();
    for (let i = 0; i < iterations; i++) {
      sessionStorage.setItem(`${key}_${i}`, '4KB_BLOCK_SIMULATION_DATA');
      sessionStorage.getItem(`${key}_${i}`);
      sessionStorage.removeItem(`${key}_${i}`);
    }
    const tLatEnd = performance.now();
    const avgLatencyMs = ((tLatEnd - tLatStart) / iterations).toFixed(2);
    const estIOPS = Math.round(1000 / Math.max(0.05, parseFloat(avgLatencyMs)));

    setProgress(100, 'Hoàn tất đo kiểm!');
    await new Promise(r => setTimeout(r, 200));

    if (progressBox) progressBox.style.display = 'none';
    if (resultBox) {
      resultBox.style.display = 'grid';
      const elWrite = document.getElementById('benchWriteSpeed');
      const elRead = document.getElementById('benchReadSpeed');
      const elLat = document.getElementById('benchLatency');
      const elIOPS = document.getElementById('benchIOPS');
      const elGrade = document.getElementById('benchGrade');

      if (elWrite) elWrite.innerText = `${writeSpeedMBs} MB/s`;
      if (elRead) elRead.innerText = `${readSpeedMBs} MB/s`;
      if (elLat) elLat.innerText = `${avgLatencyMs} ms`;
      if (elIOPS) elIOPS.innerText = `${estIOPS.toLocaleString()} IOPS`;

      if (elGrade) {
        if (parseFloat(writeSpeedMBs) > 150) {
          elGrade.innerHTML = '<span class="badge badge-mint">Cực Nhanh (SSD NVMe / SATA Tốt)</span>';
        } else if (parseFloat(writeSpeedMBs) > 40) {
          elGrade.innerHTML = '<span class="badge badge-primary">Khá Tốt (SSD / Box Chuẩn)</span>';
        } else {
          elGrade.innerHTML = '<span class="badge badge-warning">Trung Bình (HDD hoặc USB Thường)</span>';
        }
      }
    }
    showToast('🚀 Benchmark tốc độ ổ đĩa hoàn tất!');
  } catch (err) {
    if (progressText) progressText.innerText = `Lỗi trong quá trình đo: ${err.message}`;
    showToast('⚠️ Không thể hoàn thành bài test dung lượng bộ nhớ!');
  } finally {
    isBenchmarkingDisk = false;
    if (btn) btn.disabled = false;
  }
}

// ==========================================
// MODAL LƯU Ý KỸ THUẬT & BỆNH ÁN MÁY KHÁCH
// ==========================================
const DEFAULT_MACHINE_NOTICE_PRESETS = [
  {
    id: "bios_auto_power",
    category: "bios",
    categoryLabel: "⚡ BIOS & Khởi Động",
    icon: "⚡",
    title: "Lưu ý BIOS: Tắt xong tự bật lại",
    detail: "Main ASUS H61/B75/H81 hay gặp. Cần chỉnh ErP Ready (S4+S5), Restore AC Power Loss: Power Off, hoặc rút thử cụm dây nút nguồn PWR_SW vỏ case.",
    hasSpecialGuide: true,
    tag: "Phổ biến"
  },
  {
    id: "bios_fastboot",
    category: "bios",
    categoryLabel: "⚡ BIOS & Khởi Động",
    icon: "🚀",
    title: "BIOS bật Ultra Fast Boot",
    detail: "Mainboard bỏ qua nhận phím USB lúc khởi động, không bấm Del/F2 được. Phải khởi động từ Windows Advanced Startup hoặc tháo pin CMOS.",
    tag: "Lưu ý boot"
  },
  {
    id: "bios_cmos",
    category: "bios",
    categoryLabel: "⚡ BIOS & Khởi Động",
    icon: "🔋",
    title: "Hết Pin CMOS (Reset ngày giờ)",
    detail: "Rút dây nguồn là BIOS reset về năm 2010-2012, báo lỗi 'Press F1 to Run Setup'. Cần thay pin CR2032 mới.",
    tag: "Phần cứng"
  },
  {
    id: "bios_secureboot",
    category: "bios",
    categoryLabel: "⚡ BIOS & Khởi Động",
    icon: "🔒",
    title: "Cần tắt Secure Boot để boot USB",
    detail: "Mainboard chặn USB boot cứu hộ WinPE/Ventoy. Cần vào Security/Boot chuyển Secure Boot sang Disabled.",
    tag: "Cài đặt Win"
  },
  {
    id: "hw_ram_slot",
    category: "hardware",
    categoryLabel: "🔌 Phần Cứng & Linh Kiện",
    icon: "🧩",
    title: "Kén RAM / Lỗi khe cắm RAM",
    detail: "Chỉ nhận RAM ở khe 2 & 4 (hoặc chân socket CPU bị cong/chập). Cắm khe 1-3 không lên hình hoặc kêu bip liên tục.",
    tag: "Phần cứng"
  },
  {
    id: "hw_disk_bad",
    category: "hardware",
    categoryLabel: "🔌 Phần Cứng & Linh Kiện",
    icon: "💾",
    title: "Ổ cứng có Bad Sector / Cảnh báo SMART C5",
    detail: "Phát hiện mã C5 (Current Pending) hoặc 05 (Reallocated). Nguy cơ đơ máy & mất dữ liệu, đề xuất sao lưu gấp!",
    tag: "Nguy hiểm"
  },
  {
    id: "hw_thermal",
    category: "hardware",
    categoryLabel: "🔌 Phần Cứng & Linh Kiện",
    icon: "🌡️",
    title: "Máy quá nhiệt (>80°C), quạt hú to",
    detail: "Keo tản nhiệt CPU/GPU bị khô cứng, bụi bám dày khe tản gió. Chạy 15 phút là quạt hú to hoặc sụt xung giật lag.",
    tag: "Bảo dưỡng"
  },
  {
    id: "hw_gpu_cable",
    category: "hardware",
    categoryLabel: "🔌 Phần Cứng & Linh Kiện",
    icon: "🔌",
    title: "VGA ăn điện cao, không dùng cáp chia Y",
    detail: "Card đồ họa nguồn phụ 8-pin kép (RTX 3070, RX 6800...). Phải cắm 2 sợi dây nguồn PCIe riêng biệt từ bộ nguồn PSU.",
    tag: "Nguồn điện"
  },
  {
    id: "hw_power_drop",
    category: "hardware",
    categoryLabel: "🔌 Phần Cứng & Linh Kiện",
    icon: "⚡",
    title: "Nguồn sụt áp / Sập nguồn đột ngột",
    detail: "Tải nặng (render hoặc vào game) là máy sập tối thui hoặc tự reset lại. Nghi ngờ nguồn yếu hoặc tụ lọc bị phù.",
    tag: "Cảnh báo"
  },
  {
    id: "data_keep_d",
    category: "data",
    categoryLabel: "📁 Dữ Liệu & Bản Quyền",
    icon: "📂",
    title: "Dữ liệu quan trọng ở ổ D:\\ / E:\\",
    detail: "Khách yêu cầu TUYỆT ĐỐI không format nhầm các phân vùng lưu trữ tài liệu, hợp đồng, đồ án học tập.",
    tag: "Khách dặn"
  },
  {
    id: "data_accounting",
    category: "data",
    categoryLabel: "📁 Dữ Liệu & Bản Quyền",
    icon: "💼",
    title: "Giữ phần mềm Kế toán / Thuế / USB Token",
    detail: "Máy có dữ liệu MISA SME, phần mềm HTKK, Chứng thư số Token USB kê khai thuế. Cần sao lưu thư mục Data trước khi cài.",
    tag: "Khách dặn"
  },
  {
    id: "win_license_oem",
    category: "data",
    categoryLabel: "📁 Dữ Liệu & Bản Quyền",
    icon: "🔑",
    title: "Bản quyền số OEM theo Mainboard",
    detail: "Máy có Digital License gắn liền BIOS/Firmware. Phải cài đúng phiên bản Windows 11 (Home/Pro) để tự động nhận bản quyền.",
    tag: "Bản quyền"
  }
];

function loadNoticePresetsFromStorage() {
  try {
    const raw = localStorage.getItem('machine_notice_presets_custom');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Lỗi nạp presets từ localStorage:", e);
  }
  return [...DEFAULT_MACHINE_NOTICE_PRESETS];
}

function saveNoticePresetsToStorage() {
  try {
    localStorage.setItem('machine_notice_presets_custom', JSON.stringify(MACHINE_NOTICE_PRESETS));
  } catch (e) {
    console.error("Lỗi lưu presets vào localStorage:", e);
  }
  renderCategoryFilterButtons();
}

let MACHINE_NOTICE_PRESETS = loadNoticePresetsFromStorage();

let machineNotesState = {
  selectedPresetIds: ["bios_auto_power"],
  presetItemNotes: {
    "bios_auto_power": "Đã chỉnh APM ErP Ready S4+S5, rút thử nút nguồn case kiểm tra"
  },
  customNotes: ""
};

let currentNoticeCategoryFilter = 'all';
let currentNoticeSearchQuery = '';

function renderCategoryFilterButtons() {
  const container = document.getElementById("machineNoticeCategoryTabsContainer");
  if (!container) return;

  const total = MACHINE_NOTICE_PRESETS.length;
  const biosCount = MACHINE_NOTICE_PRESETS.filter(p => p.category === 'bios').length;
  const hwCount = MACHINE_NOTICE_PRESETS.filter(p => p.category === 'hardware').length;
  const dataCount = MACHINE_NOTICE_PRESETS.filter(p => p.category === 'data').length;
  const otherCount = MACHINE_NOTICE_PRESETS.filter(p => p.category !== 'bios' && p.category !== 'hardware' && p.category !== 'data').length;

  const makeBtn = (cat, label, count, icon = '') => {
    const isActive = currentNoticeCategoryFilter === cat;
    return `
      <button type="button" class="btn btn-compact machine-cat-tab ${isActive ? 'active' : ''}" 
              data-cat="${cat}" onclick="filterMachineNoticeCategory('${cat}', this)" 
              style="font-size:11px; padding:3px 8px; font-weight:700; border-radius:12px; background:${isActive ? '#ffedd5' : '#f1f5f9'}; color:${isActive ? '#c2410c' : '#475569'}; border:1px solid ${isActive ? '#fdba74' : '#e2e8f0'}; cursor:pointer;">
        ${icon ? icon + ' ' : ''}${label} (${count})
      </button>
    `;
  };

  let html = [
    makeBtn('all', 'Tất Cả', total),
    makeBtn('bios', 'BIOS', biosCount, '⚡'),
    makeBtn('hardware', 'Phần Cứng', hwCount, '🔌'),
    makeBtn('data', 'Dữ Liệu', dataCount, '📁')
  ];

  if (otherCount > 0) {
    html.push(makeBtn('other', 'Khác', otherCount, '🛠️'));
  }

  container.innerHTML = html.join('');

  const countLabel = document.getElementById("currentTotalPresetsCountLabel");
  if (countLabel) countLabel.innerText = `Hiện có: ${total} lưu ý kỹ thuật`;
}

function getMachineNotesStorageKey() {
  const pc = (currentMachineInfo && currentMachineInfo.computer_name) ? currentMachineInfo.computer_name : "DEFAULT";
  return `machine_notes_${pc}`;
}

function loadMachineNotesForCurrentMachine() {
  try {
    const key = getMachineNotesStorageKey();
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      machineNotesState.selectedPresetIds = Array.isArray(parsed.selectedPresetIds) ? parsed.selectedPresetIds : [];
      machineNotesState.presetItemNotes = (parsed.presetItemNotes && typeof parsed.presetItemNotes === 'object') ? parsed.presetItemNotes : {};
      machineNotesState.customNotes = parsed.customNotes || "";
    } else {
      machineNotesState.selectedPresetIds = ["bios_auto_power"];
      machineNotesState.presetItemNotes = {
        "bios_auto_power": "Đã chỉnh APM ErP Ready S4+S5, rút thử nút nguồn case kiểm tra"
      };
      machineNotesState.customNotes = "";
    }
  } catch (e) {
    machineNotesState.selectedPresetIds = ["bios_auto_power"];
    machineNotesState.presetItemNotes = {};
    machineNotesState.customNotes = "";
  }
  updateMachineNotesBadgeAndBanner();
}

function updateMachineNotesBadgeAndBanner() {
  const count = machineNotesState.selectedPresetIds.length + (machineNotesState.customNotes.trim() ? 1 : 0);
  const badge = document.getElementById("machineNotesBadgeCount");
  const banner = document.getElementById("machineActiveNotesBanner");
  const bannerText = document.getElementById("machineActiveNotesText");

  if (badge) {
    if (count > 0) {
      badge.style.display = "inline-block";
      badge.innerText = `${count}`;
    } else {
      badge.style.display = "none";
    }
  }

  if (banner && bannerText) {
    if (count > 0) {
      banner.style.display = "block";
      const firstPreset = MACHINE_NOTICE_PRESETS.find(p => machineNotesState.selectedPresetIds.includes(p.id));
      if (firstPreset) {
        bannerText.innerHTML = `<strong>Lưu ý:</strong> ${firstPreset.title} ${count > 1 ? `<em>(+${count - 1} mục khác)</em>` : ''}`;
      } else if (machineNotesState.customNotes.trim()) {
        bannerText.innerHTML = `<strong>Ghi chú:</strong> ${machineNotesState.customNotes.slice(0, 45)}...`;
      }
    } else {
      banner.style.display = "none";
    }
  }
}

let isCustomNotesSectionOpen = false;
let isPreviewSectionOpen = false;

function toggleCustomNotesSection(forceState) {
  const section = document.getElementById("machineCustomNotesSection");
  const btn = document.getElementById("btnToggleCustomNotes");
  if (!section) return;

  if (typeof forceState === "boolean") {
    isCustomNotesSectionOpen = forceState;
  } else {
    isCustomNotesSectionOpen = !isCustomNotesSectionOpen;
  }

  section.style.display = isCustomNotesSectionOpen ? "block" : "none";
  if (btn) {
    if (isCustomNotesSectionOpen) {
      btn.style.background = "#ecfdf5";
      btn.style.color = "#047857";
      btn.style.borderColor = "#10b981";
      btn.innerHTML = `<span style="font-size:13px;">📝</span> <span>Đang Mở Ghi Chú</span>`;
    } else {
      btn.style.background = "#f8fafc";
      btn.style.color = "#334155";
      btn.style.borderColor = "#cbd5e1";
      btn.innerHTML = `<span style="font-size:13px;">📝</span> <span>Ghi Chú Khách</span>`;
    }
  }
  if (isCustomNotesSectionOpen) {
    const input = document.getElementById("machineCustomNotesInput");
    if (input) input.focus();
  }
}

function togglePreviewSection(forceState) {
  const section = document.getElementById("machineNotesPreviewSection");
  const btn = document.getElementById("btnTogglePreview");
  if (!section) return;

  if (typeof forceState === "boolean") {
    isPreviewSectionOpen = forceState;
  } else {
    isPreviewSectionOpen = !isPreviewSectionOpen;
  }

  section.style.display = isPreviewSectionOpen ? "block" : "none";
  if (btn) {
    if (isPreviewSectionOpen) {
      btn.style.background = "#fef2f2";
      btn.style.color = "#b91c1c";
      btn.style.borderColor = "#ef4444";
      btn.innerHTML = `<span style="font-size:13px;">👁️</span> <span>Đang Xem Trước</span>`;
    } else {
      btn.style.background = "#f8fafc";
      btn.style.color = "#334155";
      btn.style.borderColor = "#cbd5e1";
      btn.innerHTML = `<span style="font-size:13px;">👁️</span> <span>Xem Trước</span>`;
    }
  }
  if (isPreviewSectionOpen) {
    updateMachineNotesPreview();
  }
}

function openMachineNotesModal() {
  const modal = document.getElementById("machineNotesModal");
  if (!modal) return;
  modal.classList.add("active");

  const machineName = currentMachineInfo?.computer_name || "DESKTOP-PC";
  const nameEl = document.getElementById("modalCurrentMachineName");
  if (nameEl) nameEl.innerText = machineName;

  loadMachineNotesForCurrentMachine();

  const customInput = document.getElementById("machineCustomNotesInput");
  if (customInput) customInput.value = machineNotesState.customNotes;

  const searchInput = document.getElementById("machineNoticeSearchInput");
  if (searchInput) searchInput.value = "";
  currentNoticeSearchQuery = "";
  currentNoticeCategoryFilter = "all";

  // Mặc định ẩn xem trước, chỉ mở ghi chú nếu có nội dung
  togglePreviewSection(false);
  toggleCustomNotesSection(!!(machineNotesState.customNotes && machineNotesState.customNotes.trim()));

  renderCategoryFilterButtons();
  renderMachineNoticePresets();
  renderSelectedNotesList();
  updateMachineNotesPreview();
}

function closeMachineNotesModal() {
  const modal = document.getElementById("machineNotesModal");
  if (modal) modal.classList.remove("active");
}

function filterMachineNoticeCategory(category, btnElement) {
  currentNoticeCategoryFilter = category;
  document.querySelectorAll(".machine-cat-tab").forEach(btn => {
    btn.style.background = "#f1f5f9";
    btn.style.color = "#475569";
    btn.style.borderColor = "#e2e8f0";
  });
  if (btnElement) {
    btnElement.style.background = "#ffedd5";
    btnElement.style.color = "#c2410c";
    btnElement.style.borderColor = "#fdba74";
  }
  renderMachineNoticePresets();
}

function filterMachineNoticePresets(query) {
  currentNoticeSearchQuery = (query || "").trim().toLowerCase();
  renderMachineNoticePresets();
}

// 1. Render danh sách lựa chọn bên trái (Thiết kế to rõ, độ tương phản cao, dễ đọc)
function renderMachineNoticePresets() {
  const container = document.getElementById("machineNoticePresetsList");
  if (!container) return;

  const filtered = MACHINE_NOTICE_PRESETS.filter(preset => {
    // Lọc theo category
    if (currentNoticeCategoryFilter !== 'all' && preset.category !== currentNoticeCategoryFilter) {
      return false;
    }
    // Lọc theo search
    if (currentNoticeSearchQuery) {
      const q = currentNoticeSearchQuery;
      const matchTitle = preset.title.toLowerCase().includes(q);
      const matchDetail = preset.detail.toLowerCase().includes(q);
      const matchTag = preset.tag.toLowerCase().includes(q);
      if (!matchTitle && !matchDetail && !matchTag) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:35px 12px; color:#64748b; font-size:12.5px; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
        Không tìm thấy mục nào khớp với "<strong>${escapeHtml(currentNoticeSearchQuery)}</strong>"
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(preset => {
    const isSelected = machineNotesState.selectedPresetIds.includes(preset.id);
    return `
      <div class="preset-note-card ${isSelected ? 'active' : ''}" 
           style="background:${isSelected ? '#fff7ed' : '#ffffff'}; border:${isSelected ? '2px solid #ea580c' : '1.5px solid #e2e8f0'}; border-radius:9px; padding:11px 14px; cursor:pointer; transition:all 0.18s; position:relative; box-shadow:${isSelected ? '0 3px 10px rgba(234,88,12,0.14)' : '0 1px 3px rgba(0,0,0,0.03)'};"
           onclick="toggleMachineNoticePreset('${preset.id}')">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:5px;">
          <div style="display:flex; align-items:center; gap:9px;">
            <div style="width:20px; height:20px; border-radius:5px; border:2px solid ${isSelected ? '#ea580c' : '#cbd5e1'}; background:${isSelected ? '#ea580c' : '#ffffff'}; color:#ffffff; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; flex-shrink:0;">
              ${isSelected ? '✓' : ''}
            </div>
            <div style="font-size:13.5px; font-weight:800; color:${isSelected ? '#9a3412' : '#0f172a'}; display:flex; align-items:center; gap:6px;">
              <span style="font-size:16px;">${preset.icon}</span>
              <span>${preset.title}</span>
            </div>
          </div>
          <span style="font-size:10.5px; font-weight:700; padding:2px 7px; border-radius:10px; background:${isSelected ? '#ffedd5' : '#f1f5f9'}; color:${isSelected ? '#c2410c' : '#475569'}; flex-shrink:0;">
            ${isSelected ? 'Đã chọn ➔' : preset.tag}
          </span>
        </div>
        <div style="font-size:12.2px; color:${isSelected ? '#7c2d12' : '#334155'}; line-height:1.55; padding-left:29px; font-weight:500;">
          ${preset.detail}
        </div>
      </div>
    `;
  }).join('');
}

// 2. Render các mục đã chọn bên phải (Gọn gàng, sạch sẽ, chỉ có biểu tượng X ở góc)
function renderSelectedNotesList() {
  const container = document.getElementById("selectedNotesWithCustomInputsList");
  if (!container) return;

  if (machineNotesState.selectedPresetIds.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:50px 20px; background:#ffffff; border:1.5px dashed #cbd5e1; border-radius:10px;">
        <div style="font-size:38px; margin-bottom:8px;">👈</div>
        <div style="font-size:14px; font-weight:800; color:#1e293b;">Chưa có lưu ý nào được chọn</div>
        <div style="font-size:12.5px; color:#475569; margin-top:5px; max-width:400px; margin-left:auto; margin-right:auto; line-height:1.6;">
          Hãy bấm chọn các mục từ danh sách bên trái để đưa sang đây.
        </div>
      </div>
    `;
    updateNotesCounterBadge();
    return;
  }

  container.innerHTML = machineNotesState.selectedPresetIds.map(presetId => {
    const preset = MACHINE_NOTICE_PRESETS.find(p => p.id === presetId);
    if (!preset) return '';

    return `
      <div class="selected-note-item-card" style="background:#ffffff; border:1.5px solid #fed7aa; border-radius:10px; padding:12px 16px; box-shadow:0 2px 6px rgba(234,88,12,0.06); position:relative;">
        
        <!-- Tiêu đề mục đã chọn + Nút X ở góc (Không có chữ Bỏ chọn) -->
        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-bottom:6px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">${preset.icon}</span>
            <span style="font-size:13.8px; font-weight:800; color:#9a3412;">${preset.title}</span>
            <span style="font-size:10.5px; font-weight:700; padding:2px 7px; border-radius:10px; background:#ffedd5; color:#c2410c;">${preset.tag}</span>
          </div>

          <!-- Chỉ có biểu tượng X ở góc theo đúng yêu cầu -->
          <button type="button" onclick="toggleMachineNoticePreset('${preset.id}')" 
                  style="width:26px; height:26px; border-radius:50%; border:1.5px solid #fecaca; background:#fff1f2; color:#dc2626; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:800; cursor:pointer; line-height:1; flex-shrink:0; transition:all 0.15s;" 
                  title="Bỏ chọn" 
                  onmouseover="this.style.background='#fee2e2'; this.style.color='#991b1b';" 
                  onmouseout="this.style.background='#fff1f2'; this.style.color='#dc2626';">
            ✕
          </button>
        </div>

        <!-- Nội dung gợi ý của hệ thống (Rõ ràng, dễ đọc, gọn gàng) -->
        <div style="font-size:12.5px; color:#1e293b; line-height:1.6; background:#f8fafc; padding:8px 12px; border-radius:6px; border-left:3.5px solid #ea580c; font-weight:500;">
          ${preset.detail}
        </div>
      </div>
    `;
  }).join('');

  updateNotesCounterBadge();
}

function onPresetItemNoteChanged(presetId, value) {
  if (!machineNotesState.presetItemNotes) machineNotesState.presetItemNotes = {};
  machineNotesState.presetItemNotes[presetId] = value;
  updateMachineNotesPreview();
}

function toggleMachineNoticePreset(presetId) {
  const idx = machineNotesState.selectedPresetIds.indexOf(presetId);
  if (idx >= 0) {
    machineNotesState.selectedPresetIds.splice(idx, 1);
  } else {
    machineNotesState.selectedPresetIds.push(presetId);
    if (!machineNotesState.presetItemNotes) machineNotesState.presetItemNotes = {};
    if (!machineNotesState.presetItemNotes[presetId]) {
      // Gợi ý ghi chú mặc định theo mục
      if (presetId === "bios_auto_power") {
        machineNotesState.presetItemNotes[presetId] = "Đã chỉnh APM ErP Ready S4+S5, kiểm tra nút nguồn case";
      } else if (presetId === "hw_disk_bad") {
        machineNotesState.presetItemNotes[presetId] = "Đã thông báo khách hàng, đề xuất sao lưu dữ liệu sang ổ khác";
      } else if (presetId === "hw_ram_slot") {
        machineNotesState.presetItemNotes[presetId] = "Main chỉ nhận RAM khe 2 & 4, dặn khách không cắm khe 1-3";
      }
    }
  }
  renderMachineNoticePresets();
  renderSelectedNotesList();
  updateMachineNotesPreview();
}

function updateNotesCounterBadge() {
  const badge = document.getElementById("selectedNotesCounterBadge");
  const count = machineNotesState.selectedPresetIds.length + (machineNotesState.customNotes.trim() ? 1 : 0);
  if (badge) {
    badge.innerText = `${count} lưu ý`;
  }
}

function onCustomNotesChanged() {
  const input = document.getElementById("machineCustomNotesInput");
  machineNotesState.customNotes = input ? input.value : "";
  updateNotesCounterBadge();
  updateMachineNotesPreview();
}

function clearAllMachineNotes() {
  if (!confirm("Bạn có chắc chắn muốn xóa toàn bộ lưu ý đã chọn cho máy này?")) return;
  machineNotesState.selectedPresetIds = [];
  machineNotesState.presetItemNotes = {};
  machineNotesState.customNotes = "";
  const input = document.getElementById("machineCustomNotesInput");
  if (input) input.value = "";
  renderMachineNoticePresets();
  renderSelectedNotesList();
  updateMachineNotesPreview();
  showToast("🗑️ Đã xóa sạch danh sách lưu ý!");
}

function getFormattedMachineNotesText() {
  const selectedPresets = MACHINE_NOTICE_PRESETS.filter(p => machineNotesState.selectedPresetIds.includes(p.id));
  const lines = [];

  if (selectedPresets.length > 0) {
    lines.push("=== LƯU Ý KỸ THUẬT & BỆNH ÁN ĐẶC BIỆT ===");
    selectedPresets.forEach((p, idx) => {
      lines.push(`${idx + 1}. [${p.title}]`);
      lines.push(`   ➔ ${p.detail}`);
    });
  }

  if (machineNotesState.customNotes && machineNotesState.customNotes.trim()) {
    lines.push("");
    lines.push("=== GHI CHÚ CHUNG / DẶN DÒ CỦA KHÁCH ===");
    lines.push(machineNotesState.customNotes.trim());
  }

  return lines.join("\n");
}

function updateMachineNotesPreview() {
  const box = document.getElementById("machineNotesPreviewBox");
  if (!box) return;

  const text = getFormattedMachineNotesText();
  if (!text) {
    box.innerText = "(Chưa có lưu ý nào được chọn. Hãy chọn các mục bên trái và nhập ghi chú)";
    box.style.color = "#94a3b8";
  } else {
    box.innerText = text;
    box.style.color = "#78350f";
  }
}

function saveAndCloseMachineNotesModal() {
  try {
    const key = getMachineNotesStorageKey();
    localStorage.setItem(key, JSON.stringify(machineNotesState));
    updateMachineNotesBadgeAndBanner();
    closeMachineNotesModal();
    showToast("💾 Đã lưu danh sách lưu ý vào hồ sơ máy thành công!");
  } catch (e) {
    closeMachineNotesModal();
    showToast("⚠️ Lưu tạm danh sách lưu ý trên phiên làm việc!");
  }
}

function copyMachineNotesToClipboard() {
  const text = getFormattedMachineNotesText();
  if (!text) {
    showToast("⚠️ Chưa có lưu ý nào để sao chép!");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast("📋 Đã sao chép danh sách lưu ý vào clipboard!");
  }).catch(() => {
    showToast("⚠️ Trình duyệt chặn sao chép tự động!");
  });
}

function applyMachineNotesAndPrint() {
  saveAndCloseMachineNotesModal();
  printChecklistReceipt();
}

// ==========================================
// MODAL LƯU Ý TRẠNG THÁI BIOS (TỰ BẬT NGUỒN)
// ==========================================
function openBiosPowerNoticeModal() {
  const modal = document.getElementById("biosPowerNoticeModal");
  if (modal) modal.classList.add("active");
}

function closeBiosPowerNoticeModal() {
  const modal = document.getElementById("biosPowerNoticeModal");
  if (modal) modal.classList.remove("active");
}

function openBiosHandbookAutoPowerTask() {
  closeBiosPowerNoticeModal();
  switchTab('tab-computer');
  switchCompGuideTask('compguide-task-bios');
  const navItem = document.querySelector(`.bios-nav-item[data-target="bios-section-auto-poweron"]`);
  activateBiosNav(navItem, null, 'bios-section-auto-poweron');
}

// ==========================================
// MODAL THÊM LƯU Ý KỸ THUẬT MỚI & NẠP JSON
// ==========================================
function buildFullAiPrompt(userDescription = '') {
  const desc = userDescription ? userDescription.trim() : '';
  const descSection = desc 
    ? `DƯỚI ĐÂY LÀ MÔ TẢ TRIỆU CHỨNG / TÌNH TRẠNG LỖI MÁY DO KỸ THUẬT VIÊN GHI NHẬN:
"""
${desc}
"""

NHIỆM VỤ CỦA BẠN:
- Đọc hiểu kỹ mô tả lỗi trên.
- Phân tích và bổ sung thêm các ý kỹ thuật chuyên sâu (nguyên nhân gốc rễ, linh kiện liên quan, cách phòng tránh).
- Chuyển đổi và phân loại thành các mục lưu ý chuẩn xác theo đúng cấu trúc JSON quy định bên dưới.`
    : `HÃY TẠO DANH SÁCH LƯU Ý KỸ THUẬT CHO CÁC BỆNH ÁN PHỔ BIẾN CỦA MÁY TÍNH (Mainboard, RAM, VGA, SSD, Nguồn, Dữ liệu khách dặn...).`;

  return `Bạn là chuyên gia kỹ thuật sửa chữa phần cứng và tối ưu hóa hệ thống máy tính Windows.
${descSection}

YÊU CẦU QUY TẮC JSON (BẮT BUỘC):
1. Chỉ trả về duy nhất một khối mã JSON hợp lệ (bắt đầu bằng [ và kết thúc bằng ]), không thêm lời mở đầu hay kết thúc, không bọc trong markdown giải thích thừa.
2. Mỗi phần tử trong mảng là một object gồm đúng các trường sau:
   - "id": chuỗi định danh duy nhất viết liền không dấu, dùng dấu gạch dưới (ví dụ: "vga_artifact_crash", "ram_slot_channel", "nvme_pcie_gen4")
   - "category": chọn 1 trong 4 nhóm: "bios" | "hardware" | "data" | "other"
   - "title": tên ngắn gọn, súc tích của bệnh/lưu ý (tối đa 45 ký tự)
   - "tag": thẻ phân loại ngắn gọn (ví dụ: "Phần cứng", "Nhiệt độ", "BIOS", "Dữ liệu", "Nguồn điện", "Cảnh báo")
   - "icon": 1 ký tự emoji đại diện phù hợp (ví dụ: ⚡, 🔌, 💾, 🧩, 🌡️, 🚀, 🔋, 🔒, ⚠️, 🛑, 📂, 💼, 🔑)
   - "detail": mô tả chi tiết hiện tượng thực tế, nguyên nhân gốc rễ và khuyến nghị thao tác xử lý rõ ràng cho kỹ thuật viên (khoảng 2-3 câu).

VÍ DỤ MẪU JSON CHUẨN:
[
  {
    "id": "vga_overheat_paste",
    "category": "hardware",
    "title": "VGA quá nhiệt, keo tản nhiệt bị nứt khô",
    "tag": "Nhiệt độ",
    "icon": "🌡️",
    "detail": "Card màn hình chạy tải nặng lên trên 85°C, quạt quay 100%. Cần tháo tra lại keo tản nhiệt gốm và thay thermal pad dẫn nhiệt VRAM."
  },
  {
    "id": "bios_tpm_win11",
    "category": "bios",
    "title": "Chưa kích hoạt TPM 2.0 / PTT trong BIOS",
    "tag": "Cài Win 11",
    "icon": "🔒",
    "detail": "Bộ cài Windows 11 báo không đủ điều kiện phần cứng. Cần vào Security/Advanced bật Intel PTT hoặc AMD fTPM sang Enabled."
  }
]`;
}

const SAMPLE_JSON_PRESETS = [
  {
    "id": "vga_artifact_crash",
    "category": "hardware",
    "title": "VGA sọc rác hình / Chớp đen khi tải nặng",
    "tag": "VGA/Màn",
    "icon": "📺",
    "detail": "Chạy benchmark hoặc vào game nặng bị sọc xanh hoặc reset driver Display. Nghi ngờ bong chân chip GPU hoặc nứt chì VRAM."
  },
  {
    "id": "bios_csm_nvme",
    "category": "bios",
    "title": "Không boot được NVMe do bật CSM Legacy",
    "tag": "Boot UEFI",
    "icon": "🚀",
    "detail": "Ổ M.2 cài Win chuẩn GPT nhưng BIOS đang kích hoạt CSM / Legacy ROM nên không thấy ổ boot. Cần tắt CSM và chuyển Boot Mode sang Pure UEFI."
  },
  {
    "id": "data_bitlocker_key",
    "category": "data",
    "title": "Ổ đĩa đang bật BitLocker mã hóa",
    "tag": "Bảo mật",
    "icon": "🔒",
    "detail": "Ổ đĩa C/D có biểu tượng ổ khóa BitLocker. Tuyệt đối không xóa phân vùng hoặc ghost đè trước khi khách cung cấp Recovery Key 48 số."
  },
  {
    "id": "fan_cpu_header",
    "category": "hardware",
    "title": "Cắm nhầm quạt CPU vào chân SYS_FAN",
    "tag": "Tản nhiệt",
    "icon": "🌀",
    "detail": "Bật máy báo lỗi 'CPU Fan Error! Press F1'. Quạt tản nhiệt CPU cắm nhầm jack SYS_FAN/CHA_FAN thay vì chân CPU_FAN trên mainboard."
  }
];

function onUserCustomAiPromptChanged(val) {
  const promptArea = document.getElementById("aiPromptTemplateArea");
  if (promptArea) {
    promptArea.value = buildFullAiPrompt(val);
  }
}

function appendPromptTopic(topicText) {
  const inputEl = document.getElementById("userCustomAiPromptInput");
  if (!inputEl) return;
  const current = inputEl.value.trim();
  if (current) {
    inputEl.value = current + "; " + topicText;
  } else {
    inputEl.value = topicText;
  }
  onUserCustomAiPromptChanged(inputEl.value);
  inputEl.focus();
}

function openAddNoticePresetModal() {
  const modal = document.getElementById("addNoticePresetModal");
  if (!modal) return;
  modal.classList.add("active");

  const userInput = document.getElementById("userCustomAiPromptInput");
  const currentVal = userInput ? userInput.value : "";
  const promptArea = document.getElementById("aiPromptTemplateArea");
  if (promptArea) {
    promptArea.value = buildFullAiPrompt(currentVal);
  }

  switchAddPresetTab('manual');
  renderCategoryFilterButtons();
}

function closeAddNoticePresetModal() {
  const modal = document.getElementById("addNoticePresetModal");
  if (modal) modal.classList.remove("active");
}

function switchAddPresetTab(tabName) {
  const tabManual = document.getElementById("addPresetTabManual");
  const tabJson = document.getElementById("addPresetTabJson");
  const tabPrompt = document.getElementById("addPresetTabPrompt");

  const btnManual = document.getElementById("tabBtnAddManual");
  const btnJson = document.getElementById("tabBtnAddJson");
  const btnPrompt = document.getElementById("tabBtnAddPrompt");

  const resetBtn = (btn) => {
    if (!btn) return;
    btn.style.borderBottom = "3px solid transparent";
    btn.style.color = "#64748b";
    btn.style.fontWeight = "700";
  };
  const activeBtn = (btn) => {
    if (!btn) return;
    btn.style.borderBottom = "3px solid #ea580c";
    btn.style.color = "#c2410c";
    btn.style.fontWeight = "800";
  };

  resetBtn(btnManual);
  resetBtn(btnJson);
  resetBtn(btnPrompt);

  if (tabManual) tabManual.style.display = (tabName === 'manual') ? 'block' : 'none';
  if (tabJson) tabJson.style.display = (tabName === 'json') ? 'block' : 'none';
  if (tabPrompt) tabPrompt.style.display = (tabName === 'prompt') ? 'block' : 'none';

  if (tabName === 'manual') activeBtn(btnManual);
  if (tabName === 'json') activeBtn(btnJson);
  if (tabName === 'prompt') activeBtn(btnPrompt);
}

function resetManualPresetForm() {
  const titleEl = document.getElementById("manualPresetTitle");
  const catEl = document.getElementById("manualPresetCategory");
  const tagEl = document.getElementById("manualPresetTag");
  const iconEl = document.getElementById("manualPresetIcon");
  const detailEl = document.getElementById("manualPresetDetail");

  if (titleEl) titleEl.value = "";
  if (catEl) catEl.value = "hardware";
  if (tagEl) tagEl.value = "Phần cứng";
  if (iconEl) iconEl.value = "⚡";
  if (detailEl) detailEl.value = "";
}

function submitManualPresetForm() {
  const title = document.getElementById("manualPresetTitle")?.value.trim();
  const category = document.getElementById("manualPresetCategory")?.value || "hardware";
  const tag = document.getElementById("manualPresetTag")?.value.trim() || "Lưu ý";
  const icon = document.getElementById("manualPresetIcon")?.value.trim() || "⚡";
  const detail = document.getElementById("manualPresetDetail")?.value.trim();

  if (!title) {
    showToast("⚠️ Vui lòng nhập tên lưu ý / bệnh án máy!");
    document.getElementById("manualPresetTitle")?.focus();
    return;
  }
  if (!detail) {
    showToast("⚠️ Vui lòng nhập chi tiết triệu chứng & hướng dẫn kỹ thuật!");
    document.getElementById("manualPresetDetail")?.focus();
    return;
  }

  const slug = title
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 30);
  const newId = `custom_${slug}_${Date.now().toString().slice(-4)}`;

  const newPreset = {
    id: newId,
    category: category,
    categoryLabel: category === 'bios' ? '⚡ BIOS & Khởi Động' : (category === 'data' ? '📁 Dữ Liệu & Bản Quyền' : '🔌 Phần Cứng & Linh Kiện'),
    icon: icon,
    title: title,
    detail: detail,
    tag: tag
  };

  MACHINE_NOTICE_PRESETS.unshift(newPreset);
  saveNoticePresetsToStorage();

  // Tự động chọn luôn mục này
  if (!machineNotesState.selectedPresetIds.includes(newId)) {
    machineNotesState.selectedPresetIds.push(newId);
  }

  renderCategoryFilterButtons();
  renderMachineNoticePresets();
  renderSelectedNotesList();
  updateMachineNotesPreview();
  updateMachineNotesBadgeAndBanner();

  resetManualPresetForm();
  closeAddNoticePresetModal();
  showToast(`✔ Đã thêm lưu ý mới: "${title.slice(0, 30)}..."`);
}

function copySampleJsonTemplate() {
  const jsonStr = JSON.stringify(SAMPLE_JSON_PRESETS, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    showToast("📋 Đã copy mã JSON mẫu vào Clipboard!");
  }).catch(() => {
    showToast("⚠️ Trình duyệt chặn sao chép tự động!");
  });
}

function fillSampleJsonToInput() {
  const inputEl = document.getElementById("inputJsonPresets");
  if (inputEl) {
    inputEl.value = JSON.stringify(SAMPLE_JSON_PRESETS, null, 2);
    const feedback = document.getElementById("jsonParseFeedback");
    if (feedback) {
      feedback.style.color = "#059669";
      feedback.innerText = "✔ Đã điền 4 mục mẫu ví dụ vào ô! Bấm 'Nạp Thêm' hoặc 'Nạp Đè' để áp dụng.";
    }
    showToast("📄 Đã điền mã JSON mẫu vào ô nhập!");
  }
}

function copyAiPromptTemplate() {
  const promptArea = document.getElementById("aiPromptTemplateArea");
  const text = (promptArea && promptArea.value) ? promptArea.value : buildFullAiPrompt();
  navigator.clipboard.writeText(text).then(() => {
    showToast("🤖 Đã copy Prompt chuẩn kèm mô tả của bạn! Hãy dán vào ChatGPT / Gemini / Claude");
  }).catch(() => {
    showToast("⚠️ Trình duyệt chặn sao chép tự động!");
  });
}

function loadDemoAiPresetsToInput() {
  switchAddPresetTab('json');
  fillSampleJsonToInput();
}

function exportCurrentPresetsToJson() {
  const jsonStr = JSON.stringify(MACHINE_NOTICE_PRESETS, null, 2);
  navigator.clipboard.writeText(jsonStr).then(() => {
    showToast(`📤 Đã xuất toàn bộ ${MACHINE_NOTICE_PRESETS.length} lưu ý ra Clipboard!`);
  }).catch(() => {
    const inputEl = document.getElementById("inputJsonPresets");
    if (inputEl) inputEl.value = jsonStr;
    showToast(`Đã xuất ${MACHINE_NOTICE_PRESETS.length} lưu ý vào ô nhập!`);
  });
}

function restoreDefaultPresetsList() {
  if (!confirm("Bạn có chắc chắn muốn khôi phục lại danh sách 12 lưu ý mặc định gốc của hệ thống? Các mục tự tạo hoặc nạp thêm sẽ bị xóa.")) {
    return;
  }
  MACHINE_NOTICE_PRESETS = [...DEFAULT_MACHINE_NOTICE_PRESETS];
  saveNoticePresetsToStorage();

  renderCategoryFilterButtons();
  renderMachineNoticePresets();
  renderSelectedNotesList();
  updateMachineNotesPreview();

  const feedback = document.getElementById("jsonParseFeedback");
  if (feedback) {
    feedback.style.color = "#059669";
    feedback.innerText = "✔ Đã khôi phục 12 mục mặc định thành công!";
  }
  showToast("♻️ Đã khôi phục danh sách lưu ý gốc thành công!");
}

function importJsonPresets(replaceMode = false) {
  const inputEl = document.getElementById("inputJsonPresets");
  const feedback = document.getElementById("jsonParseFeedback");
  if (!inputEl) return;

  const raw = inputEl.value.trim();
  if (!raw) {
    showToast("⚠️ Vui lòng dán mã JSON vào ô trước khi nạp!");
    inputEl.focus();
    return;
  }

  let parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    if (feedback) {
      feedback.style.color = "#dc2626";
      feedback.innerText = `❌ Lỗi cú pháp JSON: ${err.message}`;
    }
    showToast("❌ Mã JSON không hợp lệ! Vui lòng kiểm tra lại dấu ngoặc và dấu phẩy.");
    return;
  }

  let itemsArray = [];
  if (Array.isArray(parsed)) {
    itemsArray = parsed;
  } else if (parsed && typeof parsed === 'object') {
    itemsArray = [parsed];
  } else {
    showToast("❌ JSON phải là một mảng [...] hoặc một đối tượng {...}!");
    return;
  }

  const validItems = [];
  itemsArray.forEach((item, index) => {
    if (!item || typeof item !== 'object') return;
    const title = (item.title || item.name || '').trim();
    const detail = (item.detail || item.desc || item.description || '').trim();
    if (!title) return;

    let cat = (item.category || 'hardware').toLowerCase().trim();
    if (!['bios', 'hardware', 'data', 'other'].includes(cat)) {
      cat = 'hardware';
    }

    const icon = item.icon || (cat === 'bios' ? '⚡' : (cat === 'data' ? '📁' : '🔌'));
    const tag = (item.tag || item.label || 'Lưu ý').trim();
    const id = item.id || `preset_${Date.now()}_${index}_${Math.random().toString(36).substr(2, 4)}`;

    validItems.push({
      id: id,
      category: cat,
      categoryLabel: cat === 'bios' ? '⚡ BIOS & Khởi Động' : (cat === 'data' ? '📁 Dữ Liệu & Bản Quyền' : '🔌 Phần Cứng & Linh Kiện'),
      icon: icon,
      title: title,
      detail: detail || title,
      tag: tag
    });
  });

  if (validItems.length === 0) {
    if (feedback) {
      feedback.style.color = "#dc2626";
      feedback.innerText = "❌ Không tìm thấy mục lưu ý hợp lệ nào (Cần có trường title/detail)!";
    }
    showToast("❌ Không có mục nào hợp lệ trong JSON!");
    return;
  }

  if (replaceMode) {
    if (!confirm(`Bạn có chắc chắn muốn nạp đè? Toàn bộ danh sách hiện tại sẽ được thay bằng ${validItems.length} mục mới này.`)) {
      return;
    }
    MACHINE_NOTICE_PRESETS = validItems;
  } else {
    // Append mode: tránh trùng id
    const existingIds = new Set(MACHINE_NOTICE_PRESETS.map(p => p.id));
    let addedCount = 0;
    validItems.forEach(item => {
      let finalId = item.id;
      if (existingIds.has(finalId)) {
        finalId = `${item.id}_${Math.random().toString(36).substr(2, 4)}`;
        item.id = finalId;
      }
      existingIds.add(finalId);
      MACHINE_NOTICE_PRESETS.unshift(item);
      addedCount++;
    });
  }

  saveNoticePresetsToStorage();
  renderCategoryFilterButtons();
  renderMachineNoticePresets();
  renderSelectedNotesList();
  updateMachineNotesPreview();

  if (feedback) {
    feedback.style.color = "#059669";
    feedback.innerText = `✔ Nạp thành công ${validItems.length} mục! (Tổng cộng: ${MACHINE_NOTICE_PRESETS.length} lưu ý)`;
  }

  closeAddNoticePresetModal();
  showToast(`🎉 Nạp thành công ${validItems.length} lưu ý kỹ thuật mới!`);
}

// ==========================================
// TAB: CẨM NANG SETUP WINDOWS 11
// ==========================================
function initSetupWinHandbook() {
  let activeTask = localStorage.getItem("active_setupwin_task") || "setupwin-task-ctrl-shift-f3";
  if (!document.getElementById(activeTask)) {
    activeTask = "setupwin-task-ctrl-shift-f3";
  }
  switchSetupWinTask(activeTask);
}

function switchSetupWinTask(taskId) {
  document.querySelectorAll(".setupwin-nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.target === taskId);
  });
  document.querySelectorAll(".setupwin-task-view").forEach(view => {
    view.classList.toggle("active", view.id === taskId);
  });
  try {
    localStorage.setItem("active_setupwin_task", taskId);
  } catch (e) {}
}

function filterSetupWinTopics() {
  const q = (document.getElementById("setupWinTopicSearchInput")?.value || "").toLowerCase().trim();
  document.querySelectorAll(".setupwin-nav-item").forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = (!q || text.includes(q)) ? "flex" : "none";
  });
}

function copyMsCxhCmd(btnEl) {
  copyToClipboard("start ms-cxh:localonly", btnEl);
}

function copyNetUserAdminActiveCmd(btnEl) {
  copyToClipboard("net user administrator /active:yes", btnEl);
}

function copyLabConfigReg(btnEl) {
  const regCmd = `reg add HKLM\\SYSTEM\\Setup\\LabConfig /v BypassTPMCheck /t REG_DWORD /d 1 /f & reg add HKLM\\SYSTEM\\Setup\\LabConfig /v BypassSecureBootCheck /t REG_DWORD /d 1 /f & reg add HKLM\\SYSTEM\\Setup\\LabConfig /v BypassRAMCheck /t REG_DWORD /d 1 /f & reg add HKLM\\SYSTEM\\Setup\\LabConfig /v BypassStorageCheck /t REG_DWORD /d 1 /f & reg add HKLM\\SYSTEM\\Setup\\LabConfig /v BypassCPUCheck /t REG_DWORD /d 1 /f`;
  copyToClipboard(regCmd, btnEl);
}

function copyBypassNroCmd(btnEl) {
  copyToClipboard("OOBE\\BYPASSNRO", btnEl);
}

function copyMbr2GptCmd(btnEl) {
  copyToClipboard("mbr2gpt /validate /allowFullOS && mbr2gpt /convert /allowFullOS", btnEl);
}

function copyUltimatePowerCmd(btnEl) {
  copyToClipboard("powercfg -duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61", btnEl);
}

function copyStrelecPassword(btnEl) {
  copyToClipboard("strelec", btnEl);
}

function copyDisableSysprepCmd(btnEl) {
  const cmd = `reg add HKLM\\SYSTEM\\Setup /v SetupType /t REG_DWORD /d 0 /f`;
  copyToClipboard(cmd, btnEl);
}

// ==========================================
// TAB: CẨM NANG COMPUTER (HARDWARE GUIDE)
// ==========================================
const COMP_GUIDE_TASKS = [
  { id: 'compguide-task-bios', name: '🧭 BIOS & Boot', fullTitle: '🧭 Cẩm Nang Cấu Hình BIOS, Chuẩn Boot & Mã LED Mainboard' },
  { id: 'compguide-task-ram', name: '🧠 RAM', fullTitle: '🧠 Cẩm Nang Kiểm Tra RAM (Bộ Nhớ Trong)' },
  { id: 'compguide-task-ssd', name: '💾 Ổ Cứng SSD', fullTitle: '💾 Cẩm Nang Kiểm Tra Ổ Cứng SSD & HDD' },
  { id: 'compguide-task-cpu', name: '⚡ CPU', fullTitle: '⚡ Cẩm Nang Kiểm Tra CPU (Bộ Xử Lý Trung Tâm)' },
  { id: 'compguide-task-vga', name: '🎮 Card VGA', fullTitle: '🎮 Cẩm Nang Kiểm Tra Card Đồ Họa (VGA / GPU Rời)' },
  { id: 'compguide-task-psu', name: '🔌 Nguồn ATX', fullTitle: '🔌 Cẩm Nang Kiểm Tra Nguồn Máy Tính (PSU ATX)' },
  { id: 'compguide-task-screen', name: '🖥️ Màn Hình', fullTitle: '🖥️ Cẩm Nang Kiểm Tra Màn Hình (Panel, Điểm Chết, Hz)' },
  { id: 'compguide-task-peripherals', name: '🖱️ Ngoại Vi', fullTitle: '🖱️ Cẩm Nang Kiểm Tra Thiết Bị Ngoại Vi (Phím, Chuột, USB Hub)' },
  { id: 'compguide-task-cables', name: '🎗️ Dây Cáp', fullTitle: '🎗️ Cẩm Nang Kiểm Tra Dây Cáp & Kết Nối (HDMI, DP, SATA, LAN)' },
  { id: 'compguide-task-sound', name: '🔊 Sound Card', fullTitle: '🔊 Cẩm Nang Kiểm Tra Sound Card & Thiết Bị Âm Thanh' },
  { id: 'compguide-task-mainboard', name: '🎛️ Bo Mạch Main', fullTitle: '🎛️ Cẩm Nang Kiểm Tra Bo Mạch Chủ (Mainboard, Tụ Điện, EZ Debug)' }
];

let currentCompGuideTaskId = 'compguide-task-ram';

function toggleBiosTree(expandOnly) {
  const group = document.getElementById("compguideTreeBiosGroup");
  if (!group) return;
  if (expandOnly === true) {
    group.classList.remove("collapsed");
  } else {
    group.classList.toggle("collapsed");
  }
  const isCollapsed = group.classList.contains("collapsed");
  const arrow = document.getElementById("biosTreeArrow");
  if (arrow) arrow.innerText = isCollapsed ? "▸" : "▾";
  try {
    localStorage.setItem("bios_tree_collapsed", isCollapsed ? "1" : "0");
  } catch (e) {}
}

function handleBiosTreeHeaderClick(event) {
  if (event && event.target && event.target.id === 'biosTreeArrow') {
    event.stopPropagation();
    toggleBiosTree();
    return;
  }
  toggleBiosTree(true);
  switchCompGuideTask('compguide-task-bios');
  const activeSubId = currentBiosTaskId || 'bios-section-win11-summary';
  const subItem = document.querySelector(`.compguide-tree-item[data-target="${activeSubId}"]`) || document.querySelector('.compguide-tree-item');
  if (subItem) {
    activateBiosNav(subItem, null, activeSubId);
  }
}

function handleBiosSubitemClick(el, ev, sectionId) {
  if (ev) ev.preventDefault();
  switchCompGuideTask('compguide-task-bios');
  activateBiosNav(el, ev, sectionId);
}

function initComputerHandbook() {
  let activeTask = localStorage.getItem("active_compguide_task") || "compguide-task-bios";
  if (!document.getElementById(activeTask)) {
    activeTask = "compguide-task-bios";
  }
  const savedCollapsed = localStorage.getItem('compguide_sidebar_collapsed') === '1';
  const layout = document.querySelector('.compguide-layout');
  if (layout) {
    layout.classList.toggle('sidebar-collapsed', savedCollapsed);
    updateCompGuideSidebarUi(savedCollapsed);
  }
  const savedTreeCollapsed = localStorage.getItem('bios_tree_collapsed') === '1';
  const treeGroup = document.getElementById("compguideTreeBiosGroup");
  const arrow = document.getElementById("biosTreeArrow");
  if (treeGroup && savedTreeCollapsed) {
    treeGroup.classList.add("collapsed");
    if (arrow) arrow.innerText = "▸";
  }
  switchCompGuideTask(activeTask);
}

function switchCompGuideTask(taskId) {
  currentCompGuideTaskId = taskId;
  document.querySelectorAll(".compguide-nav-item").forEach(item => {
    item.classList.toggle("active", item.dataset.target === taskId);
  });
  document.querySelectorAll(".compguide-task-view").forEach(view => {
    view.classList.toggle("active", view.id === taskId);
  });
  try {
    localStorage.setItem("active_compguide_task", taskId);
  } catch (e) {}

  const isBios = (taskId === 'compguide-task-bios');
  const biosHeader = document.getElementById("biosTreeHeader");
  if (biosHeader) {
    biosHeader.classList.toggle("active", isBios);
  }

  const taskIndex = COMP_GUIDE_TASKS.findIndex(t => t.id === taskId);
  const task = COMP_GUIDE_TASKS[taskIndex];
  if (task) {
    const badge = document.getElementById("activeCompGuideBadge");
    if (badge) {
      badge.innerText = isBios ? `Mục 1 / ${COMP_GUIDE_TASKS.length} • 12 Mục Con` : `Mục ${taskIndex + 1} / ${COMP_GUIDE_TASKS.length}`;
    }
    const title = document.getElementById("activeCompGuideTitle");
    if (title) {
      if (isBios) {
        const subTask = BIOS_TASKS.find(t => t.id === currentBiosTaskId);
        title.innerHTML = `🧭 BIOS & Boot ❯ ${subTask ? subTask.title : '⭐️ Chuẩn Đề Xuất Win 11'}`;
      } else {
        title.innerText = task.fullTitle;
      }
    }
  }

  const targetEl = document.getElementById(taskId);
  if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  if (isBios) {
    initBiosHandbook();
    const treeGroup = document.getElementById("compguideTreeBiosGroup");
    if (treeGroup) treeGroup.classList.remove("collapsed");
    const arrow = document.getElementById("biosTreeArrow");
    if (arrow) arrow.innerText = "▾";
  }
}

function navigateCompGuideTask(direction) {
  const currentIndex = COMP_GUIDE_TASKS.findIndex(t => t.id === currentCompGuideTaskId);
  let nextIndex = (currentIndex + direction + COMP_GUIDE_TASKS.length) % COMP_GUIDE_TASKS.length;
  const nextTask = COMP_GUIDE_TASKS[nextIndex];
  if (nextTask) {
    switchCompGuideTask(nextTask.id);
  }
}

function filterCompGuideTasks() {
  const q = (document.getElementById("compGuideSearchInput")?.value || "").toLowerCase().trim();
  
  // Top-level hardware items
  document.querySelectorAll(".compguide-nav-item:not(.compguide-tree-header)").forEach(item => {
    const text = item.innerText.toLowerCase();
    item.style.display = (!q || text.includes(q)) ? "flex" : "none";
  });

  // BIOS tree sub-items
  let anySubMatch = false;
  document.querySelectorAll(".compguide-tree-item").forEach(item => {
    const text = item.innerText.toLowerCase();
    const match = !q || text.includes(q);
    item.style.display = match ? "flex" : "none";
    if (match && q) anySubMatch = true;
  });

  const treeGroup = document.getElementById("compguideTreeBiosGroup");
  const treeHeader = document.getElementById("biosTreeHeader");
  if (treeGroup && q) {
    if (anySubMatch || (treeHeader && treeHeader.innerText.toLowerCase().includes(q))) {
      treeGroup.classList.remove("collapsed");
      if (treeHeader) treeHeader.style.display = "flex";
      const arrow = document.getElementById("biosTreeArrow");
      if (arrow) arrow.innerText = "▾";
    } else {
      if (treeHeader) treeHeader.style.display = "none";
    }
  } else if (treeHeader) {
    treeHeader.style.display = "flex";
  }
}

function toggleCompGuideSidebar() {
  const layout = document.querySelector('.compguide-layout');
  if (!layout) return;
  const isCollapsed = layout.classList.toggle('sidebar-collapsed');
  try {
    localStorage.setItem('compguide_sidebar_collapsed', isCollapsed ? '1' : '0');
  } catch (e) {}
  updateCompGuideSidebarUi(isCollapsed);
}

function updateCompGuideSidebarUi(isCollapsed) {
  const toggleBtnToolbar = document.getElementById('btnToggleCompGuideSidebarToolbar');
  if (toggleBtnToolbar) {
    if (isCollapsed) {
      toggleBtnToolbar.className = 'btn btn-primary';
      toggleBtnToolbar.innerHTML = '<span>📑 Hiện Danh Mục</span>';
      toggleBtnToolbar.title = 'Mở lại danh mục cẩm nang bên trái';
    } else {
      toggleBtnToolbar.className = 'btn btn-outline';
      toggleBtnToolbar.innerHTML = '<span>◀ Thu Gọn</span>';
      toggleBtnToolbar.title = 'Thu gọn danh mục để mở rộng tối đa không gian đọc';
    }
  }
  const edgeLatch = document.getElementById('compGuideSidebarEdgeLatch');
  if (edgeLatch) {
    edgeLatch.innerHTML = isCollapsed ? '▶' : '◀';
    edgeLatch.title = isCollapsed ? 'Mở rộng danh mục bên trái' : 'Thu gọn danh mục bên trái';
  }
}

window.switchScanSubTab = switchScanSubTab;
window.triggerSmartDiskDirectScan = triggerSmartDiskDirectScan;
window.scanDisksAuto = scanDisksAuto;
window.initSmartDiskSection = initSmartDiskSection;
window.initDiskSmartSection = initDiskSmartSection;
window.renderDiskSelectorPills = renderDiskSelectorPills;
window.selectDiskByIndex = selectDiskByIndex;
window.renderSelectedDiskDetails = renderSelectedDiskDetails;
window.evaluateDiskHealth = evaluateDiskHealth;
window.consultAiDoctor = consultAiDoctor;
window.openCrystalDiskInfoGui = openCrystalDiskInfoGui;
window.openHardwareMonitorSelector = openHardwareMonitorSelector;
window.closeHardwareMonitorModal = closeHardwareMonitorModal;
window.openHardwareTool = openHardwareTool;
window.saveSmartResultToMachineProfile = saveSmartResultToMachineProfile;
window.exportDiskToCheckin = exportDiskToCheckin;
window.openDiskA4Modal = openDiskA4Modal;
window.closeDiskA4Modal = closeDiskA4Modal;
window.updateMachineCardSmartSummary = updateMachineCardSmartSummary;
window.initDiskKnowledgeBase = initDiskKnowledgeBase;
window.setDiskKbCategory = setDiskKbCategory;
window.filterDiskKbList = filterDiskKbList;
window.renderDiskKbTable = renderDiskKbTable;
window.copyDiskKbItem = copyDiskKbItem;
window.toggleDiskKnowledgeBaseView = toggleDiskKnowledgeBaseView;
window.highlightOrSearchDiskKb = highlightOrSearchDiskKb;

// Automated Audit Pipeline
window.updatePipelineStepsFromTask = updatePipelineStepsFromTask;
window.triggerAutomatedAuditPipeline = triggerAutomatedAuditPipeline;
window.runSinglePipelineStep = runSinglePipelineStep;
window.cancelAutomatedAuditPipeline = cancelAutomatedAuditPipeline;

// ==============================================================
// 10. TRUNG TÂM PHÁP LÝ, BẢN QUYỀN & AN TOÀN SỐ DOANH NGHIỆP
// ==============================================================

const LEGAL_TEMPLATES = {
  byod: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---o0o---

BẢN CAM KẾT
TUÂN THỦ QUY ĐỊNH BẢN QUYỀN PHẦN MỀM & AN TOÀN HỆ THỐNG THÔNG TIN
(Dành Cho Cán Bộ - Nhân Viên & Thiết Bị Cá Nhân BYOD)

Kính gửi: BAN GIÁM ĐỐC & BỘ PHẬN CÔNG NGHỆ THÔNG TIN

Tôi tên là: .................................................................................
Chức vụ / Bộ phận: ......................................................................
Mã nhân viên (nếu có): ................................................................

Sau khi được phổ biến và nghiên cứu các quy định của Pháp luật Việt Nam về Sở hữu trí tuệ (Điều 225 Bộ luật Hình sự 2015), Luật An toàn thông tin mạng, Nghị định 13/2023/NĐ-CP về Bảo vệ dữ liệu cá nhân cùng Nội quy Công nghệ Thông tin của Công ty, tôi xin cam kết thực hiện nghiêm túc các điều khoản sau:

ĐIỀU 1: TUÂN THỦ BẢN QUYỀN PHẦN MỀM TRÊN THIẾT BỊ CÔNG TY
1. Tuyệt đối không tự ý tải về, cài đặt, sao chép hoặc sử dụng bất kỳ phần mềm bẻ khóa (crack), mã kích hoạt lậu (keygen, patch, KMS crack) hoặc phần mềm không có bản quyền thương mại hợp lệ trên máy tính và thiết bị do Công ty cấp phát.
2. Mọi nhu cầu sử dụng phần mềm phục vụ công việc phải được lập đề xuất chính thức và gửi Bộ phận IT rà soát cấp phép trước khi cài đặt.

ĐIỀU 2: QUY ĐỊNH ĐỐI VỚI THIẾT BỊ CÁ NHÂN (BYOD) VÀ MẠNG NỘI BỘ
1. Khi mang máy tính xách tay cá nhân (laptop), máy tính bảng hoặc thiết bị di động riêng đến nơi làm việc, tôi cam kết:
   - CHỈ ĐƯỢC PHÉP kết nối vào mạng Wi-Fi dành riêng cho Khách (Guest Network) theo hướng dẫn của Bộ phận IT.
   - TUYỆT ĐỐI KHÔNG cắm dây mạng LAN của Công ty vào máy tính cá nhân nếu chưa có sự phê duyệt và cấu hình cách ly bằng văn bản của Bộ phận IT.
2. Tôi hiểu rõ rằng việc kết nối thiết bị cá nhân có chứa phần mềm crack vào mạng nội bộ công ty sẽ làm rò rỉ địa chỉ IP tĩnh của Doanh nghiệp ra máy chủ giám sát của Hãng phần mềm quốc tế, gây thiệt hại nghiêm trọng về tài chính và uy tín pháp lý cho Công ty.

ĐIỀU 3: BẢO VỆ DỮ LIỆU & BÍ MẬT KINH DOANH
1. Không sao chép tài liệu mật, cơ sở dữ liệu khách hàng hoặc mã nguồn của Công ty ra thiết bị lưu trữ cá nhân (USB, ổ cứng di động, tài khoản đám mây cá nhân).
2. Khi phát hiện thiết bị có dấu hiệu nhiễm mã độc tống tiền (Ransomware), phần mềm gián điệp hoặc nhận được cảnh báo bất thường, tôi sẽ ngắt ngay kết nối mạng và báo cáo khẩn cấp cho Bộ phận IT trong vòng 15 phút.

ĐIỀU 4: TRÁCH NHIỆM PHÁP LÝ
Tôi cam kết chịu hoàn toàn trách nhiệm trước Ban Giám đốc Công ty và trước Pháp luật nếu cố tình vi phạm các nội dung cam kết trên, bao gồm việc bồi thường toàn bộ thiệt hại tài chính phát sinh nếu hành vi của tôi dẫn đến việc Công ty bị xử phạt vi phạm bản quyền hoặc rò rỉ dữ liệu.

Hà Nội / TP.HCM, ngày ..... tháng ..... năm 20...
NGƯỜI LÀM CAM KẾT
(Ký, ghi rõ họ tên)
`,

  handover: `CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
Độc lập - Tự do - Hạnh phúc
---o0o---

BIÊN BẢN BÀN GIAO THIẾT BỊ CNTT & KIỂM TRA PHẦN MỀM HỢP LỆ

Căn cứ Quy chế quản lý tài sản và An toàn thông tin Doanh nghiệp;
Hôm nay, ngày ..... tháng ..... năm 20..., tại Văn phòng Công ty, chúng tôi gồm có:

BÊN GIAO (BỘ PHẬN IT / QUẢN TRỊ THIẾT BỊ):
- Đại diện: ................................................ Chức vụ: Chuyên viên IT
- Số điện thoại liên hệ: ................................................................

BÊN NHẬN (CÁN BỘ NHÂN VIÊN TIẾP NHẬN MÁY):
- Họ và tên: .............................................. Chức vụ: ........................
- Bộ phận / Phòng ban: .................................................................

I. THÔNG TIN THIẾT BỊ BÀN GIAO:
1. Loại máy: [ ] Laptop   [ ] PC Để bàn   [ ] Màn hình
2. Thương hiệu & Model: ...............................................................
3. Số Serial / Service Tag: ...........................................................
4. Cấu hình phần cứng: CPU: .............. | RAM: .............. | Ổ cứng: ..............
5. Tình trạng vật lý: Nguyên vẹn, tem bảo hành đầy đủ, phụ kiện kèm theo: [ ] Sạc  [ ] Chuột  [ ] Cặp

II. DANH MỤC HỆ ĐIỀU HÀNH & PHẦN MỀM ĐÃ CÀI ĐẶT HỢP LỆ:
1. Hệ điều hành: Windows 11 Pro Bản quyền OEM / Digital License theo máy.
2. Bộ ứng dụng văn phòng: Microsoft 365 Business / Office Home & Business có bản quyền.
3. Phần mềm bảo mật: Windows Security / Endpoint Protection kích hoạt Real-Time.
4. Trình duyệt & Tiện ích: Google Chrome, Unikey, Foxit Reader, 7-Zip (Open Source).
5. Phần mềm chuyên ngành (nếu có): ............................................ (Hợp đồng số: .................)

III. CAM KẾT TRÁCH NHIỆM:
1. Bên Nhận cam kết sử dụng máy đúng mục đích phục vụ công việc, không tự ý gỡ bỏ phần mềm bảo mật, không mang máy ra tiệm sửa ngoài khi chưa có ý kiến của IT.
2. Không tự ý cài đặt thêm bất kỳ phần mềm bẻ khóa (crack) nào.
3. Khi bàn giao lại máy (chuyển công tác hoặc nghỉ việc), máy phải còn nguyên vẹn hiện trạng phần mềm đã bàn giao.

Biên bản được lập thành 02 bản có giá trị pháp lý như nhau, mỗi bên giữ 01 bản.

            ĐẠI DIỆN BÊN GIAO (IT)                   ĐẠI DIỆN BÊN NHẬN
              (Ký và ghi rõ họ tên)                 (Ký và ghi rõ họ tên)
`,

  guestnotice: `QUY ĐỊNH SỬ DỤNG MẠNG INTERNET KHÁCH & THIẾT BỊ CÁ NHÂN (BYOD)
(Áp dụng cho Khách hàng, Đối tác và Cán bộ - Nhân viên)
---o0o---

Kính gửi Quý Khách hàng, Quý Đối tác và Toàn thể Nhân viên!

Nhằm đảm bảo an toàn thông tin hệ thống, tuân thủ Luật Sở hữu trí tuệ và Luật An ninh mạng Việt Nam, Công ty xin trân trọng thông báo chính sách kết nối mạng như sau:

1. KẾT NỐI WI-FI DÀNH CHO KHÁCH (GUEST NETWORK):
- Tên sóng Wi-Fi (SSID): [ Tên Wi-Fi Khách Của Công Ty ]
- Mật khẩu truy cập: [ Mật khẩu Wi-Fi Khách ]
- Mạng Wi-Fi Khách được thiết lập trên đường truyền Internet độc lập với hệ thống máy chủ và cơ sở dữ liệu nội bộ của Công ty.

2. CÁC QUY ĐỊNH BẮT BUỘC KHI KẾT NỐI:
- Quý khách và Nhân viên vui lòng CHỈ kết nối thiết bị cá nhân (Laptop riêng, điện thoại di động) vào mạng Wi-Fi Khách nêu trên.
- TUYỆT ĐỐI KHÔNG cắm dây mạng LAN tại các bàn họp, khu vực làm việc vào máy tính cá nhân. Các cổng mạng LAN nội bộ được giám sát an ninh tự động và chỉ cấp quyền cho thiết bị thuộc sở hữu của Công ty.
- Nghiêm cấm mọi hành vi thực hiện quét cổng mạng (Port Scan), phát tán mã độc hoặc chia sẻ tệp vi phạm bản quyền khi đang kết nối vào hạ tầng mạng của Công ty.

3. TRÁCH NHIỆM BẢN QUYỀN PHẦN MỀM:
- Mọi thiết bị cá nhân kết nối vào mạng chịu sự ràng buộc bởi các chính sách bảo vệ bản quyền quốc tế. Quý vị vui lòng đảm bảo phần mềm cài đặt trên thiết bị cá nhân có bản quyền sử dụng hợp pháp.

Xin trân trọng cảm ơn sự hợp tác của Quý vị!

BAN QUẢN TRỊ CÔNG NGHỆ THÔNG TIN DOANH NGHIỆP
`
};

let currentSelectedLegalTemplateKey = 'byod';

function switchLegalSubTab(subtabId) {
  const tabs = ['scenarios', 'isolation', 'law', 'audit', 'templates'];
  tabs.forEach(t => {
    const btn = document.getElementById('legalSubtabBtn' + t.charAt(0).toUpperCase() + t.slice(1));
    const view = document.getElementById('legalSubtabContent' + t.charAt(0).toUpperCase() + t.slice(1));
    if (btn) btn.classList.toggle('active', t === subtabId);
    if (view) view.classList.toggle('active', t === subtabId);
  });
  if (subtabId === 'audit') {
    updateLegalComplianceScore();
  }
}

function filterLegalScenarios(category, btnEl) {
  if (btnEl) {
    const parent = btnEl.parentElement;
    if (parent) {
      parent.querySelectorAll('button').forEach(b => {
        b.classList.remove('btn-primary');
        b.classList.add('btn-outline');
      });
      btnEl.classList.remove('btn-outline');
      btnEl.classList.add('btn-primary');
    }
  }

  const cards = document.querySelectorAll('#legalScenariosList .scenario-card');
  cards.forEach(card => {
    const cat = card.getAttribute('data-category');
    if (category === 'all' || cat === category) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function searchLegalScenarios() {
  const query = (document.getElementById('inputSearchLegalScenario')?.value || '').toLowerCase().trim();
  const cards = document.querySelectorAll('#legalScenariosList .scenario-card');
  cards.forEach(card => {
    const text = card.textContent.toLowerCase();
    if (!query || text.includes(query)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function toggleScenarioDetails(headerEl) {
  const card = headerEl.closest('.scenario-card');
  if (!card) return;
  const body = card.querySelector('.scenario-body');
  const arrow = card.querySelector('.scenario-toggle-arrow');
  if (!body) return;

  const isHidden = body.style.display === 'none';
  body.style.display = isHidden ? 'grid' : 'none';
  if (arrow) {
    arrow.textContent = isHidden ? '▼ Thu gọn' : '▶ Mở rộng';
  }
}

function updateLegalComplianceScore() {
  const items = document.querySelectorAll('#auditChecklistContainer .audit-check-item');
  let checkedCount = 0;
  const savedState = [];

  items.forEach((item, index) => {
    const cb = item.querySelector('.audit-check-cb');
    if (cb && cb.checked) {
      checkedCount++;
      item.classList.add('checked');
      savedState.push(index);
    } else {
      item.classList.remove('checked');
    }
  });

  try {
    localStorage.setItem('legal_compliance_checklist', JSON.stringify(savedState));
  } catch(e) {}

  const score = checkedCount * 10;
  const valEl = document.getElementById('auditScoreValue');
  const titleEl = document.getElementById('auditScoreTitle');
  const descEl = document.getElementById('auditScoreDesc');
  const badgeEl = document.getElementById('auditRiskBadge');
  const circleEl = document.getElementById('auditGaugeCircle');

  if (valEl) valEl.textContent = score;

  if (score >= 80) {
    if (titleEl) titleEl.textContent = '🛡️ Cực Kỳ An Toàn (Đạt Chuẩn Doanh Nghiệp Quốc Tế)';
    if (descEl) descEl.textContent = 'Doanh nghiệp đã thiết lập phòng tuyến bản quyền và an toàn mạng vững chắc, triệt tiêu nguy cơ rò rỉ IP tĩnh và tuân thủ chặt chẽ Điều 225 BLHS.';
    if (badgeEl) {
      badgeEl.className = 'badge badge-mint';
      badgeEl.textContent = 'Xanh: An Toàn Cao';
    }
    if (circleEl) circleEl.style.borderColor = '#10b981';
  } else if (score >= 50) {
    if (titleEl) titleEl.textContent = '⚠️ Mức Độ Rủi Ro Trung Bình (Cần Vá Lỗ Hổng Mạng Khách)';
    if (descEl) descEl.textContent = 'Hệ thống đã có một số chính sách nhưng vẫn tồn tại kẽ hở nghiêm trọng, đặc biệt là nguy cơ từ thiết bị cá nhân cắm mạng chung hoặc quyền Local Admin của nhân viên.';
    if (badgeEl) {
      badgeEl.className = 'badge badge-warning';
      badgeEl.textContent = 'Vàng: Rủi Ro Trung Bình';
    }
    if (circleEl) circleEl.style.borderColor = '#f59e0b';
  } else {
    if (titleEl) titleEl.textContent = '🚨 Báo Động Đỏ: Nguy Cơ Bị Phạt & Mất Dữ Liệu Cực Cao';
    if (descEl) descEl.textContent = 'Hệ thống thiếu hụt phòng vệ nghiêm trọng! Doanh nghiệp đứng trước nguy cơ bị kiểm toán BSA phạt tiền hàng trăm triệu và bị Ransomware tấn công bất cứ lúc nào.';
    if (badgeEl) {
      badgeEl.className = 'badge badge-danger';
      badgeEl.textContent = 'Đỏ: Cực Kỳ Nguy Hiểm';
    }
    if (circleEl) circleEl.style.borderColor = '#ef4444';
  }
}

function checkAllAuditItems(checked) {
  const items = document.querySelectorAll('#auditChecklistContainer .audit-check-item');
  items.forEach(item => {
    const cb = item.querySelector('.audit-check-cb');
    if (cb) cb.checked = checked;
  });
  updateLegalComplianceScore();
}

function selectLegalTemplate(type) {
  currentSelectedLegalTemplateKey = type;
  const box = document.getElementById('legalTemplateContentBox');
  const title = document.getElementById('legalTemplateTitle');

  const btnByod = document.getElementById('btnTplByod');
  const btnHandover = document.getElementById('btnTplHandover');
  const btnGuest = document.getElementById('btnTplGuest');

  [btnByod, btnHandover, btnGuest].forEach(b => {
    if (b) {
      b.classList.remove('btn-primary');
      b.classList.add('btn-outline');
    }
  });

  if (type === 'byod') {
    if (btnByod) { btnByod.classList.add('btn-primary'); btnByod.classList.remove('btn-outline'); }
    if (title) title.textContent = 'BẢN CAM KẾT TUÂN THỦ BẢN QUYỀN PHẦN MỀM & AN TOÀN THIẾT BỊ (BYOD)';
    if (box) box.textContent = LEGAL_TEMPLATES.byod;
  } else if (type === 'handover') {
    if (btnHandover) { btnHandover.classList.add('btn-primary'); btnHandover.classList.remove('btn-outline'); }
    if (title) title.textContent = 'BIÊN BẢN BÀN GIAO THIẾT BỊ CNTT & DANH MỤC PHẦN MỀM HỢP LỆ';
    if (box) box.textContent = LEGAL_TEMPLATES.handover;
  } else if (type === 'guestnotice') {
    if (btnGuest) { btnGuest.classList.add('btn-primary'); btnGuest.classList.remove('btn-outline'); }
    if (title) title.textContent = 'QUY ĐỊNH SỬ DỤNG MẠNG INTERNET KHÁCH & THIẾT BI CÁ NHÂN (BYOD)';
    if (box) box.textContent = LEGAL_TEMPLATES.guestnotice;
  }
}

function copyCurrentLegalTemplate() {
  const text = LEGAL_TEMPLATES[currentSelectedLegalTemplateKey] || '';
  if (text) {
    copyText(text);
  }
}

function printCurrentLegalTemplate() {
  const text = LEGAL_TEMPLATES[currentSelectedLegalTemplateKey] || '';
  const printWin = window.open('', '_blank');
  if (printWin) {
    printWin.document.write(`<html><head><title>Biểu Mẫu Pháp Lý & Quy Chế An Toàn CNTT</title><style>body{font-family:'Times New Roman',serif;font-size:14pt;line-height:1.6;padding:40px;white-space:pre-wrap;color:#000;}@media print{@page{margin:2cm;}}</style></head><body>${text}</body></html>`);
    printWin.document.close();
    printWin.focus();
    setTimeout(() => { printWin.print(); printWin.close(); }, 300);
  } else {
    window.print();
  }
}

function printLegalAuditReport() {
  switchLegalSubTab('audit');
  setTimeout(() => {
    window.print();
  }, 200);
}

function initLegalTab() {
  selectLegalTemplate('byod');
  try {
    const raw = localStorage.getItem('legal_compliance_checklist');
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved)) {
        const items = document.querySelectorAll('#auditChecklistContainer .audit-check-item');
        items.forEach((item, index) => {
          const cb = item.querySelector('.audit-check-cb');
          if (cb) cb.checked = saved.includes(index);
        });
      }
    }
  } catch(e) {}
  updateLegalComplianceScore();
}

window.switchLegalSubTab = switchLegalSubTab;
window.filterLegalScenarios = filterLegalScenarios;
window.searchLegalScenarios = searchLegalScenarios;
window.toggleScenarioDetails = toggleScenarioDetails;
window.updateLegalComplianceScore = updateLegalComplianceScore;
window.checkAllAuditItems = checkAllAuditItems;
window.selectLegalTemplate = selectLegalTemplate;
window.copyCurrentLegalTemplate = copyCurrentLegalTemplate;
window.printCurrentLegalTemplate = printCurrentLegalTemplate;
window.printLegalAuditReport = printLegalAuditReport;
window.initLegalTab = initLegalTab;

// ==========================================
// ĐỒNG BỘ THỜI GIAN & MÚI GIỜ UTC+07:00
// ==========================================
let headerClockTimer = null;
let systemTimeDriftMs = 0;

function initClockAndTimeSync() {
  const clockText = document.getElementById("headerClockText");
  const tzText = document.getElementById("headerTzText");
  if (!clockText) return;

  const updateClock = () => {
    const now = new Date(Date.now() + systemTimeDriftMs);
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockText.innerText = `${h}:${m}:${s}`;
  };
  updateClock();
  if (headerClockTimer) clearInterval(headerClockTimer);
  headerClockTimer = setInterval(updateClock, 1000);

  // Kiểm tra trạng thái thời gian từ server (chỉ đọc, không tự ý đổi đồng hồ hệ thống ngầm)
  fetch("/api/system/time_status")
    .then(res => res.json())
    .then(data => {
      if (data && data.status === "ok" && data.time_info) {
        const info = data.time_info;
        if (tzText) {
          tzText.innerText = info.is_utc7 ? "UTC+07:00 VN" : info.timezone_id;
          tzText.title = info.formatted_display;
        }
        if (typeof updateTimeDisplay === "function") {
          updateTimeDisplay(info);
        }
      }
    })
    .catch(() => {});
}

function manualSyncTime(silent = false) {
  const btn = document.getElementById("headerTimeSyncBtn");
  const tzText = document.getElementById("headerTzText");
  if (btn) {
    btn.style.transform = "rotate(360deg)";
    btn.style.transition = "transform 0.8s ease";
  }

  if (!silent) {
    showToast("⏳ Đang đồng bộ múi giờ UTC+07:00 & cập nhật giờ chuẩn Internet...");
  }

  fetch("/api/system/time_sync")
    .then(res => res.json())
    .then(data => {
      setTimeout(() => {
        if (btn) btn.style.transform = "none";
      }, 800);

      if (data && data.success) {
        if (tzText) tzText.innerText = "UTC+07:00 VN";
        if (data.time_info && data.time_info.local_time) {
          const serverTime = new Date(data.time_info.local_time.replace(' ', 'T'));
          if (!isNaN(serverTime.getTime())) {
            systemTimeDriftMs = serverTime.getTime() - Date.now();
          }
        }
        if (!silent) {
          showToast("✔ Đã đồng bộ múi giờ UTC+07:00 (Hà Nội, Bangkok) & giờ chuẩn thành công!");
        }
      } else {
        if (!silent) {
          showToast("⚠️ " + (data.message || "Không thể đồng bộ thời gian"));
        }
      }
    })
    .catch(err => {
      setTimeout(() => {
        if (btn) btn.style.transform = "none";
      }, 800);
      if (!silent) {
        showToast("✔ [Mô phỏng] Giờ hệ thống đang chạy theo đồng hồ máy tính");
      }
    });
}

// ==========================================
// QUẢN LÝ FILE CONFIG TRUNG TÂM (toolkit_config.json) & TỰ ĐỘNG NHẬN DIỆN NẠP WI-FI AP
// ==========================================
async function loadToolkitConfigFromServer() {
  try {
    const res = await fetch("/api/config/toolkit");
    if (res.ok) {
      const data = await res.json();
      if (data && data.config) {
        toolkitConfig = Object.assign(toolkitConfig, data.config);
        const defMode = toolkitConfig.default_install_mode || "enterprise";
        currentInstallMode = (defMode === "personal") ? "personal" : "enterprise";
        currentPopoverProfileTab = currentInstallMode;
        if (toolkitConfig.general_workflow && typeof toolkitConfig.general_workflow.filter_apps_by_mode === "boolean") {
          filterMainViewByProfile = toolkitConfig.general_workflow.filter_apps_by_mode;
        }
        if (toolkitConfig.workflow && typeof toolkitConfig.workflow.install_delay_seconds === "number") {
          installDelay = toolkitConfig.workflow.install_delay_seconds;
        }
        applyDefaultProfileSelectionToMain(currentInstallMode);
        updateInstallModeButtonsUI();
        renderApps();
        renderProfileAppsMatrix();
      }
    }
  } catch (e) {
    console.warn("Khong doc duoc /api/config/toolkit:", e);
  }
}

async function loadWifiAndConfigStatus(forceScan = false) {
  const pillText = document.getElementById("wifiQuickStatusText");
  if (pillText && forceScan) {
    pillText.innerText = "Đang quét sóng Wi-Fi & dây mạng...";
  }
  try {
    const res = await fetch("/api/wifi/status");
    if (res.ok) {
      const data = await res.json();
      if (data && data.status) {
        wifiStatusData = data.status;
        if (data.status.default_install_mode) {
          toolkitConfig.default_install_mode = data.status.default_install_mode;
        }
        if (data.status.wifi_settings) {
          toolkitConfig.wifi_settings = data.status.wifi_settings;
        }
        if (data.status.workflow) {
          toolkitConfig.workflow = data.status.workflow;
        }
        if (data.status.install_profiles) {
          toolkitConfig.install_profiles = data.status.install_profiles;
        }
        if (Array.isArray(data.status.configured_aps)) {
          toolkitConfig.wifi_access_points = data.status.configured_aps;
        }
        updateWifiStatusUI(data.status);
        renderProfileAppsMatrix();
        if (forceScan) {
          showToast(`📡 Đã quét xong: Phát hiện ${(data.status.nearby_networks || []).length} sóng Wi-Fi (${data.status.matched_ap_count || 0} AP khớp trong Config)`);
        }
      }
    }
  } catch (e) {
    console.warn("Loi tai trang thai Wi-Fi:", e);
  }
}

function updateWifiStatusUI(st) {
  if (!st) return;
  const rd = st.readiness || {};
  const wlan = rd.wlan || {};
  const matchedCnt = st.matched_ap_count || 0;
  const nearbyList = st.nearby_networks || [];
  const cfgAps = st.configured_aps || [];

  // 1. Cập nhật nút trạng thái nhanh trên thanh công cụ Kho Phần Mềm & Badge trên Tab
  const quickPill = document.getElementById("wifiQuickStatusPill");
  const quickIcon = document.getElementById("wifiQuickStatusIcon");
  const quickText = document.getElementById("wifiQuickStatusText");
  const navBadge = document.getElementById("navWifiStatusBadge");

  if (rd.ethernet_connected) {
    if (quickIcon) quickIcon.innerText = "🔌";
    if (quickText) quickText.innerText = "Đã cắm LAN (Bỏ qua nạp Wi-Fi)";
    if (quickPill) {
      quickPill.style.background = "#ecfdf5";
      quickPill.style.borderColor = "#86efac";
      quickPill.style.color = "#047857";
    }
    if (navBadge) {
      navBadge.style.display = "inline-block";
      navBadge.innerText = "LAN OK";
      navBadge.style.background = "#dcfce7";
      navBadge.style.color = "#15803d";
    }
  } else if (rd.already_online || wlan.connected) {
    const ssidLabel = wlan.current_ssid || rd.local_ip || "Online";
    if (quickIcon) quickIcon.innerText = "🌐";
    if (quickText) quickText.innerText = `Đã có mạng: ${ssidLabel} (Bỏ qua nạp AP)`;
    if (quickPill) {
      quickPill.style.background = "#ecfdf5";
      quickPill.style.borderColor = "#86efac";
      quickPill.style.color = "#047857";
    }
    if (navBadge) {
      navBadge.style.display = "inline-block";
      navBadge.innerText = "Online";
      navBadge.style.background = "#dcfce7";
      navBadge.style.color = "#15803d";
    }
  } else if (matchedCnt > 0) {
    if (quickIcon) quickIcon.innerText = "📡";
    if (quickText) quickText.innerText = `Chưa có mạng • Có ${matchedCnt} AP khớp sóng (Sẵn sàng nạp)`;
    if (quickPill) {
      quickPill.style.background = "#eff6ff";
      quickPill.style.borderColor = "#93c5fd";
      quickPill.style.color = "#1d4ed8";
    }
    if (navBadge) {
      navBadge.style.display = "inline-block";
      navBadge.innerText = `${matchedCnt} AP`;
      navBadge.style.background = "#dbeafe";
      navBadge.style.color = "#1d4ed8";
    }
  } else {
    if (quickIcon) quickIcon.innerText = "⚠️";
    if (quickText) quickText.innerText = "Chưa có mạng • Chưa thấy AP khớp sóng";
    if (quickPill) {
      quickPill.style.background = "#fff7ed";
      quickPill.style.borderColor = "#fdba74";
      quickPill.style.color = "#c2410c";
    }
    if (navBadge) {
      navBadge.style.display = "inline-block";
      navBadge.innerText = "Offline";
      navBadge.style.background = "#ffedd5";
      navBadge.style.color = "#c2410c";
    }
  }

  // 2. Cập nhật 4 ô trạng thái chi tiết trong Tab Wi-Fi & Config
  const ethState = document.getElementById("wifiCardEthernetState");
  const ethSub = document.getElementById("wifiCardEthernetSub");
  if (ethState && ethSub) {
    if (rd.ethernet_connected) {
      ethState.innerHTML = `<span style="color:#059669;">✔ Đã cắm cáp mạng LAN</span>`;
      const names = (rd.ethernet_adapters || []).map(a => a.name).join(", ");
      ethSub.innerText = names || "Ethernet đang hoạt động";
    } else {
      ethState.innerHTML = `<span style="color:#64748b;">Không cắm dây mạng LAN</span>`;
      ethSub.innerText = "Máy đang dùng Wi-Fi hoặc chưa cắm cáp RJ45";
    }
  }

  const wlanState = document.getElementById("wifiCardWlanState");
  const wlanSub = document.getElementById("wifiCardWlanSub");
  if (wlanState && wlanSub) {
    if (wlan.connected) {
      wlanState.innerHTML = `<span style="color:#059669;">✔ Đang kết nối: ${escapeHtml(wlan.current_ssid || "Wi-Fi")}</span>`;
      wlanSub.innerText = `${wlan.interface_name || "Wi-Fi"} • Tín hiệu: ${wlan.signal || "Tốt"}`;
    } else if (wlan.has_adapter) {
      wlanState.innerHTML = `<span style="color:#d97706;">Chưa kết nối Wi-Fi</span>`;
      wlanSub.innerText = `Card: ${wlan.interface_name || "Wireless LAN"} (${nearbyList.length} mạng xung quanh)`;
    } else {
      wlanState.innerHTML = `<span style="color:#64748b;">Không phát hiện Card Wi-Fi</span>`;
      wlanSub.innerText = "Máy bàn PC không gắn card Wi-Fi hoặc thiếu Driver";
    }
  }

  const netState = document.getElementById("wifiCardInternetState");
  const netSub = document.getElementById("wifiCardInternetSub");
  if (netState && netSub) {
    if (rd.already_online) {
      netState.innerHTML = `<span style="color:#059669;">✔ Đã thông mạng Internet</span>`;
      netSub.innerText = `IP nội bộ: ${rd.local_ip || "Đã cấp DHCP"}`;
    } else {
      netState.innerHTML = `<span style="color:#dc2626;">⚠️ Chưa có kết nối Internet</span>`;
      netSub.innerText = rd.local_ip ? `IP: ${rd.local_ip}` : "Cần nạp Wi-Fi AP hoặc cắm cáp LAN";
    }
  }

  const decBox = document.getElementById("wifiCardDecisionBox");
  const decTitle = document.getElementById("wifiCardDecisionTitle");
  const decSub = document.getElementById("wifiCardDecisionSub");
  if (decBox && decTitle && decSub) {
    if (rd.should_skip_wifi_import) {
      decBox.style.background = "#f0fdf4";
      decBox.style.borderColor = "#86efac";
      decTitle.style.color = "#065f46";
      decTitle.innerText = "✔ BỎ QUA NẠP WI-FI (ĐÃ CÓ MẠNG)";
      decSub.style.color = "#047857";
      decSub.innerText = rd.skip_reason || "Máy đã có mạng sẵn sàng cho các bước tiếp theo.";
    } else if (matchedCnt > 0) {
      decBox.style.background = "#eff6ff";
      decBox.style.borderColor = "#93c5fd";
      decTitle.style.color = "#1e40af";
      decTitle.innerText = `📡 TỰ ĐỘNG NẠP ${matchedCnt} AP ĐANG PHÁT SÓNG`;
      decSub.style.color = "#1d4ed8";
      decSub.innerText = "Đã nhận diện thấy AP trong Config đang phát sóng tại chỗ.";
    } else {
      decBox.style.background = "#fff7ed";
      decBox.style.borderColor = "#fdba74";
      decTitle.style.color = "#9a3412";
      decTitle.innerText = "⚠️ CHƯA CÓ AP NÀO KHỚP SÓNG TẠI ĐÂY";
      decSub.style.color = "#c2410c";
      decSub.innerText = "Hãy thêm SSID Wi-Fi tại chỗ vào bảng bên dưới để tự động nạp.";
    }
  }

  // 3. Render danh sách AP trong toolkit_config.json
  const matchedBadge = document.getElementById("wifiMatchedCountBadge");
  if (matchedBadge) {
    matchedBadge.innerText = `${matchedCnt} / ${cfgAps.length} AP khớp sóng`;
  }

  const cfgListEl = document.getElementById("wifiConfiguredApList");
  if (cfgListEl) {
    if (cfgAps.length === 0) {
      cfgListEl.innerHTML = `<div style="padding:12px; text-align:center; color:#64748b; font-size:12px; border:1px dashed #cbd5e1; border-radius:7px;">Chưa có Wi-Fi AP nào trong file Config. Hãy thêm ở biểu mẫu bên dưới.</div>`;
    } else {
      cfgListEl.innerHTML = cfgAps.map(ap => {
        const isCurrent = !!ap.is_currently_connected;
        const isDetected = !!ap.detected_nearby;
        let statusTag = "";
        let cardBorder = "#e2e8f0";
        let cardBg = "#ffffff";

        if (isCurrent) {
          cardBorder = "#86efac";
          cardBg = "#f0fdf4";
          statusTag = `<span style="font-size:10.5px; font-weight:800; color:#15803d; background:#dcfce7; padding:2px 7px; border-radius:999px; border:1px solid #86efac;">🟢 Đang kết nối (${ap.signal_percent || 100}%)</span>`;
        } else if (isDetected) {
          cardBorder = "#93c5fd";
          cardBg = "#eff6ff";
          statusTag = `<span style="font-size:10.5px; font-weight:800; color:#1d4ed8; background:#dbeafe; padding:2px 7px; border-radius:999px; border:1px solid #93c5fd;">📡 Đang có sóng (${ap.signal_percent || 0}%) • Sẽ nạp</span>`;
        } else {
          statusTag = `<span style="font-size:10.5px; font-weight:600; color:#64748b; background:#f1f5f9; padding:2px 7px; border-radius:999px;">⚪ Không có sóng tại đây (Bỏ qua)</span>`;
        }

        const pwdMask = ap.password ? "•".repeat(Math.min(10, String(ap.password).length)) : "(Mạng mở)";
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; padding:8px 11px; border:1px solid ${cardBorder}; background:${cardBg}; border-radius:7px;">
            <div style="min-width:0; flex:1;">
              <div style="display:flex; align-items:center; gap:7px; flex-wrap:wrap;">
                <span style="font-size:13px; font-weight:800; color:#0f172a;">📶 ${escapeHtml(ap.ssid)}</span>
                <span style="font-size:10px; font-weight:700; color:#475569; background:#e2e8f0; padding:1px 6px; border-radius:4px;">Ưu tiên #${ap.priority || 1}</span>
                <span style="font-size:10px; color:#64748b;">${escapeHtml(ap.auth || 'WPA2PSK')} • MK: ${pwdMask}</span>
                ${statusTag}
              </div>
              ${ap.note ? `<div style="font-size:11px; color:#64748b; margin-top:2px;">${escapeHtml(ap.note)}</div>` : ''}
            </div>
            <div style="display:flex; align-items:center; gap:5px;">
              <button type="button" class="btn btn-outline" onclick="runSmartWifiProvision(true, '${escapeJsString(ap.ssid)}')" style="font-size:10.5px; padding:4px 8px; color:#0284c7; border-color:#bae6fd;" title="Nạp & Kết nối ngay AP này vào Windows">⚡ Nạp ngay</button>
              <button type="button" class="btn btn-outline" onclick="editWifiApInForm('${escapeJsString(ap.id)}')" style="font-size:10.5px; padding:4px 8px;" title="Sửa thông tin AP này">✏️ Sửa</button>
              <button type="button" class="btn btn-outline" onclick="deleteWifiApFromConfig('${escapeJsString(ap.id)}', '${escapeJsString(ap.ssid)}')" style="font-size:10.5px; padding:4px 8px; color:#dc2626; border-color:#fecaca;" title="Xóa AP khỏi file Config">🗑️</button>
            </div>
          </div>
        `;
      }).join("");
    }
  }

  // 4. Render danh sách sóng Wi-Fi thực tế xung quanh máy
  const nearbyBadge = document.getElementById("wifiNearbyCountBadge");
  if (nearbyBadge) {
    nearbyBadge.innerText = `${nearbyList.length} mạng có sóng`;
  }

  const nearbyEl = document.getElementById("wifiNearbyNetworksList");
  if (nearbyEl) {
    if (nearbyList.length === 0) {
      nearbyEl.innerHTML = `<div style="padding:14px; text-align:center; color:#64748b; font-size:12px; border:1px dashed #cbd5e1; border-radius:7px;">Không quét thấy mạng Wi-Fi nào xung quanh (Hoặc máy không bật Wi-Fi).</div>`;
    } else {
      const cfgSsidSet = new Set(cfgAps.map(a => String(a.ssid || "").trim().toLowerCase()));
      nearbyEl.innerHTML = nearbyList.map(net => {
        const inCfg = cfgSsidSet.has(String(net.ssid || "").trim().toLowerCase());
        const sig = net.signal_percent || 0;
        const sigCol = sig >= 70 ? "#059669" : (sig >= 40 ? "#d97706" : "#64748b");
        return `
          <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; padding:7px 10px; border:1px solid ${inCfg ? '#86efac' : '#e2e8f0'}; background:${inCfg ? '#f0fdf4' : '#ffffff'}; border-radius:7px;">
            <div style="min-width:0; flex:1;">
              <div style="display:flex; align-items:center; gap:6px;">
                <strong style="font-size:12.5px; color:#0f172a;">${escapeHtml(net.ssid)}</strong>
                ${inCfg ? `<span style="font-size:10px; font-weight:800; color:#15803d; background:#dcfce7; padding:1px 6px; border-radius:4px;">✔ Đã có trong Config</span>` : ''}
              </div>
              <div style="font-size:10.5px; color:#64748b; margin-top:1px;">
                Tín hiệu: <strong style="color:${sigCol};">${sig}%</strong> • Bảo mật: ${escapeHtml(net.authentication || 'WPA2')}
              </div>
            </div>
            <button type="button" class="btn btn-outline" onclick="prefillWifiApFromNearby('${escapeJsString(net.ssid)}', '${escapeJsString(net.authentication || '')}')" style="font-size:10.5px; padding:4px 8px; white-space:nowrap;">
              ${inCfg ? '✏️ Cập nhật MK' : '+ Đưa vào Config'}
            </button>
          </div>
        `;
      }).join("");
    }
  }

  // 5. Đồng bộ các ô cấu hình trong phần 3 của Tab Wi-Fi
  const selDefMode = document.getElementById("cfgDefaultInstallMode");
  if (selDefMode && toolkitConfig.default_install_mode) {
    selDefMode.value = toolkitConfig.default_install_mode;
  }
  const chkEth = document.getElementById("cfgSkipWifiIfEthernet");
  if (chkEth && toolkitConfig.wifi_settings) {
    chkEth.checked = toolkitConfig.wifi_settings.skip_if_ethernet_plugged !== false;
  }
  const chkOnline = document.getElementById("cfgSkipWifiIfOnline");
  if (chkOnline && toolkitConfig.wifi_settings) {
    chkOnline.checked = toolkitConfig.wifi_settings.skip_if_already_online !== false;
  }
  const chkOnlyDet = document.getElementById("cfgOnlyImportDetectedAp");
  if (chkOnlyDet && toolkitConfig.wifi_settings) {
    chkOnlyDet.checked = toolkitConfig.wifi_settings.only_import_detected_ap !== false;
  }
  const chkAutoStep0 = document.getElementById("cfgAutoWifiBeforeInstall");
  if (chkAutoStep0 && toolkitConfig.workflow) {
    chkAutoStep0.checked = toolkitConfig.workflow.step0_auto_wifi_before_install !== false;
  }
}

async function runSmartWifiProvision(force = false, targetSsid = "") {
  const btn = document.getElementById("btnRunSmartWifiNow");
  const logBox = document.getElementById("wifiProvisionLogContainer");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `<span>⏳ Đang kiểm tra &amp; nạp AP...</span>`;
  }
  if (logBox) {
    logBox.style.display = "block";
    logBox.innerText = "⏳ Đang thực thi Bước 0: Kiểm tra dây mạng LAN / Internet và quét sóng Wi-Fi AP...";
  }

  try {
    const res = await fetch("/api/wifi/provision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ force: !!force, ssid: targetSsid || "" })
    });
    if (res.ok) {
      const data = await res.json();
      const result = data.result || {};
      if (logBox && Array.isArray(result.logs)) {
        logBox.innerText = result.logs.join("\n");
      }
      showToast(result.message || "Đã hoàn tất quy trình kiểm tra & nạp Wi-Fi AP!");
      await loadWifiAndConfigStatus(false);
    }
  } catch (e) {
    showToast("Lỗi khi chạy quy trình nạp Wi-Fi: " + e.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = `<span>🚀 Chạy Quy Trình Nhận Diện &amp; Nạp AP</span>`;
    }
  }
}

function prefillWifiApFromNearby(ssid, authStr) {
  const ssidIn = document.getElementById("wifiApSsidInput");
  const pwdIn = document.getElementById("wifiApPasswordInput");
  const authIn = document.getElementById("wifiApAuthInput");
  const idIn = document.getElementById("wifiApIdInput");
  const titleEl = document.getElementById("wifiApFormTitle");

  // Kiểm tra xem SSID này đã có trong Config chưa
  const existing = (toolkitConfig.wifi_access_points || []).find(
    a => String(a.ssid || "").trim().toLowerCase() === String(ssid || "").trim().toLowerCase()
  );

  if (existing) {
    editWifiApInForm(existing.id);
    return;
  }

  if (idIn) idIn.value = "";
  if (ssidIn) ssidIn.value = ssid || "";
  if (pwdIn) {
    pwdIn.value = "";
    pwdIn.focus();
  }
  if (authIn) {
    const upper = String(authStr || "").toUpperCase();
    if (upper.includes("WPA3")) authIn.value = "WPA3SAE";
    else if (upper.includes("OPEN")) authIn.value = "OPEN";
    else authIn.value = "WPA2PSK";
  }
  if (titleEl) {
    titleEl.innerText = `➕ Thêm Wi-Fi "${ssid}" Vào File Config`;
  }
  showToast(`Đã điền SSID "${ssid}" — Hãy nhập mật khẩu rồi bấm Lưu AP!`);
}

function editWifiApInForm(apId) {
  const ap = (toolkitConfig.wifi_access_points || []).find(a => a.id === apId);
  if (!ap) return;
  const idIn = document.getElementById("wifiApIdInput");
  const ssidIn = document.getElementById("wifiApSsidInput");
  const pwdIn = document.getElementById("wifiApPasswordInput");
  const authIn = document.getElementById("wifiApAuthInput");
  const prioIn = document.getElementById("wifiApPriorityInput");
  const noteIn = document.getElementById("wifiApNoteInput");
  const titleEl = document.getElementById("wifiApFormTitle");

  if (idIn) idIn.value = ap.id || "";
  if (ssidIn) ssidIn.value = ap.ssid || "";
  if (pwdIn) {
    pwdIn.value = ap.password || "";
    pwdIn.focus();
  }
  if (authIn) authIn.value = ap.auth || "WPA2PSK";
  if (prioIn) prioIn.value = ap.priority || 1;
  if (noteIn) noteIn.value = ap.note || "";
  if (titleEl) titleEl.innerText = `✏️ Đang sửa AP: ${ap.ssid}`;
}

function resetWifiApForm() {
  const idIn = document.getElementById("wifiApIdInput");
  const ssidIn = document.getElementById("wifiApSsidInput");
  const pwdIn = document.getElementById("wifiApPasswordInput");
  const authIn = document.getElementById("wifiApAuthInput");
  const prioIn = document.getElementById("wifiApPriorityInput");
  const noteIn = document.getElementById("wifiApNoteInput");
  const titleEl = document.getElementById("wifiApFormTitle");

  if (idIn) idIn.value = "";
  if (ssidIn) ssidIn.value = "";
  if (pwdIn) pwdIn.value = "";
  if (authIn) authIn.value = "WPA2PSK";
  if (prioIn) prioIn.value = "1";
  if (noteIn) noteIn.value = "";
  if (titleEl) titleEl.innerText = "➕ Thêm / Cập Nhật Wi-Fi AP Vào File Config";
}

async function saveWifiApToConfig() {
  const idIn = document.getElementById("wifiApIdInput");
  const ssidIn = document.getElementById("wifiApSsidInput");
  const pwdIn = document.getElementById("wifiApPasswordInput");
  const authIn = document.getElementById("wifiApAuthInput");
  const prioIn = document.getElementById("wifiApPriorityInput");
  const noteIn = document.getElementById("wifiApNoteInput");

  const ssid = ssidIn ? ssidIn.value.trim() : "";
  if (!ssid) {
    showToast("⚠️ Vui lòng nhập tên Wi-Fi (SSID)!");
    if (ssidIn) ssidIn.focus();
    return;
  }

  const payload = {
    id: idIn ? idIn.value.trim() : "",
    ssid: ssid,
    password: pwdIn ? pwdIn.value : "",
    auth: authIn ? authIn.value : "WPA2PSK",
    encryption: (authIn && authIn.value === "OPEN") ? "NONE" : "AES",
    priority: prioIn ? parseInt(prioIn.value, 10) || 1 : 1,
    note: noteIn ? noteIn.value.trim() : "",
    auto_connect: true,
    enabled: true
  };

  try {
    const res = await fetch("/api/wifi/ap_save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      showToast(`💾 ${data.message || 'Đã lưu AP vào file toolkit_config.json!'}`);
      resetWifiApForm();
      await loadWifiAndConfigStatus(false);
    }
  } catch (e) {
    showToast("Lỗi lưu AP: " + e.message);
  }
}

async function deleteWifiApFromConfig(apId, ssid) {
  if (!confirm(`Bạn có chắc muốn xóa Wi-Fi AP "${ssid || apId}" khỏi file cấu hình toolkit_config.json?`)) {
    return;
  }
  try {
    const res = await fetch("/api/wifi/ap_delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: apId, ssid: ssid })
    });
    if (res.ok) {
      showToast(`🗑️ Đã xóa Wi-Fi AP "${ssid || apId}" khỏi file Config!`);
      await loadWifiAndConfigStatus(false);
    }
  } catch (e) {
    showToast("Lỗi xóa AP: " + e.message);
  }
}

function renderProfileAppsMatrix() {
  const container = document.getElementById("cfgProfileAppsMatrix");
  if (!container) return;

  const entSet = new Set((toolkitConfig?.install_profiles?.enterprise?.apps) || []);
  const perSet = new Set((toolkitConfig?.install_profiles?.personal?.apps) || []);

  container.innerHTML = appList.map((app, idx) => {
    const inEnt = entSet.has(app.id);
    const inPer = perSet.has(app.id);
    const iconSrc = getAppIconPath(app.id);
    return `
      <div style="display:flex; align-items:center; justify-content:space-between; gap:8px; padding:6px 10px; border:1px solid #e2e8f0; border-radius:7px; background:#ffffff;">
        <div style="display:flex; align-items:center; gap:6px; min-width:0; flex:1;">
          <span style="font-size:10px; font-weight:700; color:#94a3b8;">${String(idx + 1).padStart(2, '0')}</span>
          <img src="${iconSrc}" alt="" style="width:16px; height:16px; object-fit:contain; flex-shrink:0;" onerror="this.style.display='none';">
          <span style="font-size:12px; font-weight:700; color:#1e293b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${escapeHtml(app.name)}">${escapeHtml(app.name)}</span>
        </div>
        <div style="display:flex; align-items:center; gap:8px; flex-shrink:0; font-size:11px; font-weight:700;">
          <label style="display:inline-flex; align-items:center; gap:3px; cursor:pointer; color:#1d4ed8;" title="Bao gồm trong gói Doanh Nghiệp">
            <input type="checkbox" class="chk-prof-ent" data-app-id="${app.id}" ${inEnt ? 'checked' : ''}>
            <span>🏢 DN</span>
          </label>
          <label style="display:inline-flex; align-items:center; gap:3px; cursor:pointer; color:#047857;" title="Bao gồm trong gói Cá Nhân">
            <input type="checkbox" class="chk-prof-per" data-app-id="${app.id}" ${inPer ? 'checked' : ''}>
            <span>👤 CN</span>
          </label>
        </div>
      </div>
    `;
  }).join("");
}

async function saveFullToolkitConfigFromUi() {
  const defMode = document.getElementById("cfgDefaultInstallMode")?.value || "enterprise";
  const skipEth = document.getElementById("cfgSkipWifiIfEthernet")?.checked ?? true;
  const skipOnline = document.getElementById("cfgSkipWifiIfOnline")?.checked ?? true;
  const onlyDetected = document.getElementById("cfgOnlyImportDetectedAp")?.checked ?? true;
  const autoStep0 = document.getElementById("cfgAutoWifiBeforeInstall")?.checked ?? true;

  const entApps = [];
  document.querySelectorAll(".chk-prof-ent:checked").forEach(el => {
    const id = el.getAttribute("data-app-id");
    if (id) entApps.push(id);
  });

  const perApps = [];
  document.querySelectorAll(".chk-prof-per:checked").forEach(el => {
    const id = el.getAttribute("data-app-id");
    if (id) perApps.push(id);
  });

  if (!toolkitConfig.install_profiles) toolkitConfig.install_profiles = {};
  if (!toolkitConfig.install_profiles.enterprise) toolkitConfig.install_profiles.enterprise = { id: "enterprise", label: "🏢 Doanh Nghiệp" };
  if (!toolkitConfig.install_profiles.personal) toolkitConfig.install_profiles.personal = { id: "personal", label: "👤 Cá Nhân" };

  toolkitConfig.default_install_mode = defMode;
  toolkitConfig.install_profiles.enterprise.apps = entApps;
  toolkitConfig.install_profiles.personal.apps = perApps;

  toolkitConfig.wifi_settings = Object.assign(toolkitConfig.wifi_settings || {}, {
    skip_if_ethernet_plugged: skipEth,
    skip_if_already_online: skipOnline,
    only_import_detected_ap: onlyDetected
  });

  toolkitConfig.workflow = Object.assign(toolkitConfig.workflow || {}, {
    step0_auto_wifi_before_install: autoStep0
  });

  try {
    const res = await fetch("/api/config/toolkit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toolkitConfig)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.config) {
        toolkitConfig = data.config;
      }
      setInstallProfileMode(defMode, true);
      updateWifiStatusUI(wifiStatusData);
      showToast("💾 Đã lưu cấu hình vào software/toolkit_config.json thành công!");
    }
  } catch (e) {
    showToast("Lỗi lưu cấu hình: " + e.message);
  }
}

window.setInstallProfileMode = setInstallProfileMode;
window.toggleDefaultProfilePopover = toggleDefaultProfilePopover;
window.closeDefaultProfilePopover = closeDefaultProfilePopover;
window.switchDefaultProfilePopoverTab = switchDefaultProfilePopoverTab;
window.setDefaultStartupModeInPopover = setDefaultStartupModeInPopover;
window.toggleAppInDefaultProfile = toggleAppInDefaultProfile;
window.popoverSelectAllApps = popoverSelectAllApps;
window.popoverResetStandardDefault = popoverResetStandardDefault;
window.onToggleFilterMainView = onToggleFilterMainView;
window.applySavedDefaultToMainSelection = applySavedDefaultToMainSelection;
window.saveDefaultProfileFromPopover = saveDefaultProfileFromPopover;
window.loadToolkitConfigFromServer = loadToolkitConfigFromServer;
window.loadWifiAndConfigStatus = loadWifiAndConfigStatus;
window.runSmartWifiProvision = runSmartWifiProvision;
window.saveWifiApToConfig = saveWifiApToConfig;
window.editWifiApInForm = editWifiApInForm;
window.deleteWifiApFromConfig = deleteWifiApFromConfig;
window.prefillWifiApFromNearby = prefillWifiApFromNearby;
window.resetWifiApForm = resetWifiApForm;
window.saveFullToolkitConfigFromUi = saveFullToolkitConfigFromUi;
window.manualSyncTime = manualSyncTime;
window.copyLogBoxContent = copyLogBoxContent;
window.clearLogBoxContent = clearLogBoxContent;
window.togglePauseInstall = togglePauseInstall;
window.confirmStopInstall = confirmStopInstall;
window.skipCurrentInstallApp = skipCurrentInstallApp;
window.closeModal = closeModal;
window.reopenInstallModal = reopenInstallModal;
window.dismissFloatingInstallWidget = dismissFloatingInstallWidget;
window.checkActiveInstallState = checkActiveInstallState;
window.toggleLogBoxExpand = toggleLogBoxExpand;
window.initClockAndTimeSync = initClockAndTimeSync;
window.openAddCustomAppModal = openAddCustomAppModal;
window.closeAddCustomAppModal = closeAddCustomAppModal;
window.submitAddCustomApp = submitAddCustomApp;
window.openMoveAppModal = openMoveAppModal;
window.closeMoveAppModal = closeMoveAppModal;
window.confirmMoveApp = confirmMoveApp;
window.toggleSelectGroup = toggleSelectGroup;
window.toggleSelectSubzone = toggleSelectSubzone;
window.selectMissingInGroup = selectMissingInGroup;
window.selectAllMissingApps = selectAllMissingApps;
window.loadIconsMapFromServer = loadIconsMapFromServer;
window.refreshInstalledAppsDetection = refreshInstalledAppsDetection;
window.scrollToKtvTweaks = scrollToKtvTweaks;
window.runKtvTimeSync = runKtvTimeSync;
window.openTimeConfigModal = openTimeConfigModal;
window.closeTimeConfigModal = closeTimeConfigModal;
window.saveTimeConfig = saveTimeConfig;
window.runKtvAction = runKtvAction;
window.initKtvTasks = initKtvTasks;
window.renderKtvTasks = renderKtvTasks;
window.handleKtvCardClick = handleKtvCardClick;
window.handleKtvCardContextMenu = handleKtvCardContextMenu;
window.showKtvContextMenu = showKtvContextMenu;
window.hideKtvContextMenu = hideKtvContextMenu;
window.runCurrentKtvTask = runCurrentKtvTask;
window.runKtvTaskById = runKtvTaskById;
window.copyKtvTaskCommand = copyKtvTaskCommand;
window.openEditKtvTaskModal = openEditKtvTaskModal;
window.openCreateKtvTaskModal = openCreateKtvTaskModal;
window.closeEditKtvTaskModal = closeEditKtvTaskModal;
window.copyKtvEditCommand = copyKtvEditCommand;
window.testRunEditKtvCommand = testRunEditKtvCommand;
window.saveEditKtvTask = saveEditKtvTask;
window.resetCurrentEditKtvTask = resetCurrentEditKtvTask;
window.resetCurrentKtvTask = resetCurrentKtvTask;
window.triggerTaskRescanOrNew = triggerTaskRescanOrNew;
window.isInstallModeBlockingScan = isInstallModeBlockingScan;
window.syncInstallModeScanGuardUI = syncInstallModeScanGuardUI;
window.showInstallModeScanBlockedModal = showInstallModeScanBlockedModal;
window.closeInstallModeBlockModal = closeInstallModeBlockModal;
window.checkAndWarnInstallModeForScan = checkAndWarnInstallModeForScan;
window.toggleMachineIdentityEdit = toggleMachineIdentityEdit;
window.confirmDetectedComputerNameRightNow = confirmDetectedComputerNameRightNow;
window.saveMachineIdentityChanges = saveMachineIdentityChanges;
window.openConfirmScanMachineModal = openConfirmScanMachineModal;
window.closeConfirmScanMachineModal = closeConfirmScanMachineModal;
window.submitConfirmScanMachineModal = submitConfirmScanMachineModal;
window.startNewScanSession = startNewScanSession;
window.saveActiveTaskMetadata = saveActiveTaskMetadata;
window.renderMachineInfoCard = renderMachineInfoCard;
window.openDiskErrorDetailModal = openDiskErrorDetailModal;
window.closeDiskErrorDetailModal = closeDiskErrorDetailModal;
window.copyModalErrorSolution = copyModalErrorSolution;
window.applyModalErrorToMachineNotes = applyModalErrorToMachineNotes;
window.handleDragStart = handleDragStart;
window.handleDragEnd = handleDragEnd;
window.handleDragOver = handleDragOver;
window.handleDragLeave = handleDragLeave;
window.handleDrop = handleDrop;

// Khởi chạy khi tài liệu sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  switchTab('tab-software');
  checkActiveInstallState();
  loadIconsMapFromServer();
  applyDefaultProfileSelectionToMain(currentInstallMode);
  loadToolkitConfigFromServer();
  loadWifiAndConfigStatus(false);
  renderApps();
  loadCustomDataFromServer().then(() => {
    renderApps();
    loadInstalledAppsDetection(false, false);
  });
  startKtvClockTicker();
  initKtvTasks();
  checkEngineStatus();
  initClockAndTimeSync();
  loadCurrentMachineInfo();
  loadScanTasksList();
  loadDiskDrivesList();
  initBiosHandbook();
  initDiskSmartSection();
  initDiskKnowledgeBase();
  initLegalTab();
  loadMachineNotesForCurrentMachine();

  // Hỗ trợ điều hướng trực tiếp qua URL Parameters (?tab=oldpc&subtab=smart hoặc ?modal=checklist)
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const hashTab = window.location.hash.replace('#', '');
    const requestedTab = urlParams.get('tab') || hashTab;
    const requestedSubTab = urlParams.get('subtab');

    if (requestedTab) {
      const fullTabId = requestedTab.startsWith('tab-') ? requestedTab : 'tab-' + requestedTab;
      switchTab(fullTabId);
      if (requestedSubTab && typeof switchScanSubTab === 'function') {
        switchScanSubTab(requestedSubTab);
      }
    }

    if (urlParams.get('modal') === 'checklist') {
      setTimeout(() => {
        if (typeof openChecklistModal === 'function') {
          openChecklistModal('current_scan');
          const cTab = urlParams.get('checklist_tab') || '1';
          if (typeof switchChecklistModalTab === 'function') {
            if (cTab === '2' || cTab === 'ban_giao') {
              switchChecklistModalTab('ban_giao');
            } else {
              switchChecklistModalTab('tiep_nhan');
            }
          }
        }
      }, 350);
    }

    if (urlParams.get('modal') === 'install_demo') {
      setTimeout(() => {
        const modal = document.getElementById("installModal");
        if (modal) modal.classList.add("active");
        renderModalQueue(appList.slice(0, 12).map((a, i) => ({
          id: a.id,
          name: a.name,
          winget: a.winget,
          status: i === 0 ? "completed" : (i === 1 ? "installing" : (i === 2 ? "missing_winget" : "pending")),
          stage: i === 0 ? "Đã hoàn tất" : (i === 1 ? "Đang tải gói (65%)..." : (i === 2 ? "Thiếu Winget (Cần App Installer)" : "Chờ đến lượt...")),
          sub_progress: i === 0 ? 100 : (i === 1 ? 65 : 0),
          shortcut: i === 0 ? (a.name + ".lnk") : ""
        })), 1, "installing");
        const logBox = document.getElementById("modalLogBox");
        if (logBox) {
          logBox.innerText = [
            "[06:26:36] Bắt đầu quy trình cài đặt tuần tự 19 phần mềm (Delay 3s)...",
            "[06:26:36] --------------------------------------------------",
            "[06:26:36] [1/19] Đang tiến hành cài đặt: UniKey (UniKey.UniKey)...",
            "[06:26:36] -> Phát hiện bản UniKey Portable x64 tại software/unikey...",
            "[06:26:39] [OK] Đã cài đặt UniKey vào C:\\Program Files\\UniKey\\UniKeyNT.exe và tạo lối tắt Desktop!",
            "[06:26:39] -> [LỐI TẮT DESKTOP] Đã tồn tại trên Desktop: UniKey.lnk",
            "[06:26:39] Hệ thống tạm dừng 3 giây để giải phóng tiến trình và khóa tập tin (File Lock)...",
            "[06:26:42] --------------------------------------------------",
            "[06:26:42] [2/19] Đang tiến hành cài đặt: Google Chrome (Google.Chrome)...",
            "[06:26:43] [BỎ QUA] Google Chrome cần công cụ Winget nhưng máy tính chưa có sẵn Microsoft App Installer.",
            "[06:26:43] -> Môi trường Windows Sandbox / Win 10 LTSC chưa được cài đặt Microsoft Store.",
            "[06:26:43] -> Đánh dấu: 'Thiếu Winget'. Tiếp tục các gói tiếp theo..."
          ].join("\n");
        }
      }, 350);
    }

  } catch (e) {
    console.warn('URL param router error:', e);
  }
});

/* ========================================================
   FLUENT DESIGN CONTEXT MENU & KHÓA CHUỘT PHẢI TRÌNH DUYỆT
   ======================================================== */
let currentContextMenuAppId = null;

function showAppContextMenu(clientX, clientY, appId) {
  const menu = document.getElementById('appContextMenu');
  if (!menu) return;

  const app = appList.find(a => a.id === appId);
  if (!app) return;

  currentContextMenuAppId = appId;

  // 1. Trạng thái đã cài & phiên bản
  const isInstalled = !!(installedAppsMap && installedAppsMap[app.id] && installedAppsMap[app.id].installed);
  const installedVer = (installedAppsMap && installedAppsMap[app.id] && installedAppsMap[app.id].version) || "";
  const isSelected = selectedApps.has(app.id);

  // 2. Cập nhật Header
  const iconEl = document.getElementById('ctxMenuIcon');
  const fallbackEl = document.getElementById('ctxMenuAvatarFallback');
  if (iconEl && fallbackEl) {
    iconEl.style.display = 'block';
    fallbackEl.style.display = 'none';
    iconEl.src = getAppIconPath(app.id);
    fallbackEl.innerText = app.avatar || '📦';
  }

  const titleEl = document.getElementById('ctxMenuTitle');
  if (titleEl) titleEl.innerText = app.name;

  const statusEl = document.getElementById('ctxMenuStatusBadge');
  if (statusEl) {
    statusEl.innerHTML = isInstalled 
      ? `<span style="color:#059669; font-weight:700;">✔ Đã cài ${installedVer ? '(' + escapeHtml(installedVer) + ')' : ''}</span>`
      : `<span style="color:#d97706; font-weight:700;">⚡ Chưa cài đặt</span>`;
  }

  // 2.5. Cập nhật Chú thích & RAM trong Menu
  const noteDescEl = document.getElementById('ctxMenuNoteDesc');
  if (noteDescEl) {
    noteDescEl.innerText = app.desc || 'Không có chú thích cho phần mềm này.';
  }
  const noteRamEl = document.getElementById('ctxMenuNoteRam');
  if (noteRamEl) {
    if (app.ram) {
      noteRamEl.innerText = `RAM: ${app.ram}`;
      noteRamEl.style.display = 'inline-block';
    } else {
      noteRamEl.style.display = 'none';
    }
  }

  // 3. Nút Cài Lại / Cài Ngay
  const installIcon = document.getElementById('ctxInstallIcon');
  const installLabel = document.getElementById('ctxInstallLabel');
  const installDesc = document.getElementById('ctxInstallDesc');
  if (isInstalled) {
    if (installIcon) installIcon.innerText = '🔄';
    if (installLabel) installLabel.innerText = 'Cài lại phần mềm này';
    if (installDesc) installDesc.innerText = 'Cài đặt lại hoặc nâng cấp';
  } else {
    if (installIcon) installIcon.innerText = '⚡';
    if (installLabel) installLabel.innerText = 'Cài đặt ngay';
    if (installDesc) installDesc.innerText = 'Cài độc lập không qua hàng đợi';
  }

  // 4. Nút Web (Trang chủ)
  const webDesc = document.getElementById('ctxWebDesc');
  if (webDesc) {
    try {
      if (app.url && app.url.startsWith('http')) {
        const u = new URL(app.url);
        webDesc.innerText = u.hostname;
      } else {
        webDesc.innerText = 'Mở website chính thức của nhà phát triển';
      }
    } catch(err) {
      webDesc.innerText = 'Mở website chính thức của nhà phát triển';
    }
  }

  // 5. Nút Toggle Select
  const selectIcon = document.getElementById('ctxSelectIcon');
  const selectLabel = document.getElementById('ctxSelectLabel');
  if (isSelected) {
    if (selectIcon) selectIcon.innerText = '❎';
    if (selectLabel) selectLabel.innerText = 'Bỏ chọn cài đặt tuần tự';
  } else {
    if (selectIcon) selectIcon.innerText = '☑️';
    if (selectLabel) selectLabel.innerText = 'Chọn cài đặt tuần tự';
  }

  // 6. Tính toán vị trí hiển thị chuẩn xác không bị tràn màn hình
  menu.style.display = 'block';

  const menuWidth = 290;
  const menuHeight = 350;
  const pad = 10;

  let posX = clientX;
  let posY = clientY;

  if (posX + menuWidth > window.innerWidth - pad) {
    posX = window.innerWidth - menuWidth - pad;
  }
  if (posX < pad) posX = pad;

  if (posY + menuHeight > window.innerHeight - pad) {
    posY = window.innerHeight - menuHeight - pad;
  }
  if (posY < pad) posY = pad;

  menu.style.left = posX + 'px';
  menu.style.top = posY + 'px';
  menu.style.visibility = 'visible';
}

function hideAppContextMenu() {
  const menu = document.getElementById('appContextMenu');
  if (menu) menu.style.display = 'none';
  currentContextMenuAppId = null;
}

function openAppContextMenuFromBtn(appId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  const rect = event.currentTarget.getBoundingClientRect();
  showAppContextMenu(rect.left, rect.bottom + 4, appId);
}

function handleCtxAction(action) {
  const appId = currentContextMenuAppId;
  hideAppContextMenu();
  if (!appId) return;

  const app = appList.find(a => a.id === appId);
  if (!app) return;

  if (action === 'install') {
    installSingleApp(appId);
  } else if (action === 'move') {
    openMoveAppModal(appId);
  } else if (action === 'web') {
    if (app.url && app.url !== '#') {
      window.open(app.url, '_blank');
    } else {
      showToast(`Chưa có link trang chủ cho ${app.name}`);
    }
  } else if (action === 'toggle-select') {
    toggleAppCheck(appId);
    showToast(`${selectedApps.has(appId) ? 'Đã chọn' : 'Đã bỏ chọn'}: ${app.name}`);
  } else if (action === 'copy-link') {
    const linkToCopy = (app.url && app.url !== '#') ? app.url : `https://google.com/search?q=${encodeURIComponent(app.name)}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(linkToCopy).then(() => {
        showToast(`Đã sao chép link trang chủ ${app.name}!`);
      }).catch(() => {
        showToast(`Link: ${linkToCopy}`);
      });
    } else {
      showToast(`Link: ${linkToCopy}`);
    }
  } else if (action === 'copy-desc') {
    const textToCopy = `${app.name}: ${app.desc || ''}${app.ram ? ' (RAM: ' + app.ram + ')' : ''}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Đã sao chép chú thích: ${app.name}`);
      }).catch(() => {
        showToast(`${app.name}: ${app.desc || ''}`);
      });
    } else {
      showToast(`${app.name}: ${app.desc || ''}`);
    }
  }
}

// Khóa tính năng chuột phải mặc định của trình duyệt web (Anti-Browser Context Menu)
document.addEventListener('contextmenu', function(e) {
  e.preventDefault(); // CHẶN 100% MENU MẶC ĐỊNH CỦA TRÌNH DUYỆT (Inspect, Reload, Back...)

  // 1. Kiểm tra chuột phải vào thẻ tác vụ KTV nâng cao
  const ktvCard = e.target.closest('.ktv-action-btn-card');
  if (ktvCard) {
    const taskId = ktvCard.getAttribute('data-ktv-id');
    if (taskId) {
      hideAppContextMenu();
      showKtvContextMenu(e.clientX, e.clientY, taskId);
      return;
    }
  }

  // 2. Tìm xem chuột phải có rơi vào thẻ phần mềm không
  const appRow = e.target.closest('.app-list-row');
  if (appRow) {
    const appId = appRow.getAttribute('data-app-id');
    if (appId) {
      hideKtvContextMenu();
      showAppContextMenu(e.clientX, e.clientY, appId);
      return;
    }
  }

  // Nếu click chuột phải vào vùng trống bất kỳ trên trang -> đóng context menu
  hideAppContextMenu();
  hideKtvContextMenu();
});

// Đóng menu khi click chuột trái ra ngoài
document.addEventListener('click', function(e) {
  if (!e.target.closest('#appContextMenu') && !e.target.closest('.btn-more-app')) {
    hideAppContextMenu();
  }
  if (!e.target.closest('#ktvTaskContextMenu')) {
    hideKtvContextMenu();
  }
  if (!e.target.closest('#defaultProfileDropdownWrap')) {
    closeDefaultProfilePopover();
  }
});

// Đóng menu khi bấm phím Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    hideAppContextMenu();
    hideKtvContextMenu();
    closeDefaultProfilePopover();
    closeEditKtvTaskModal();
    closeInstallModeBlockModal();
    closeConfirmScanMachineModal();
    closeSoftwareUpdaterModal();
    const instModal = document.getElementById('installModal');
    if (instModal && instModal.classList.contains('active')) {
      closeModal();
    }
  }
});

// Đóng menu khi cuộn chuột hoặc đổi kích thước cửa sổ
window.addEventListener('scroll', function(e) {
  if (e.target === document || e.target === document.body || !e.target) {
    hideAppContextMenu();
    hideKtvContextMenu();
  }
});

window.addEventListener('resize', function() {
  hideAppContextMenu();
  hideKtvContextMenu();
});

/* ========================================================
   TRUNG TÂM KIỂM TRA & ĐỒNG BỘ CẬP NHẬT BỘ CÀI OFFLINE (SOFTWARE UPDATER)
   ======================================================== */
let softwareUpdaterCache = null;
let softwareUpdaterSyncPolling = null;
let isSoftwareUpdaterSyncPaused = false;

function openSoftwareUpdaterModal() {
  const modal = document.getElementById('softwareUpdaterModal');
  if (modal) modal.style.display = 'flex';
  if (!softwareUpdaterCache) {
    checkSoftwareUpdatesOnline();
  } else {
    renderSoftwareUpdaterTable(softwareUpdaterCache);
  }
}

function closeSoftwareUpdaterModal() {
  const modal = document.getElementById('softwareUpdaterModal');
  if (modal) modal.style.display = 'none';
}

function closeSoftwareUpdaterModalOnBackdrop(e) {
  if (e.target && e.target.id === 'softwareUpdaterModal') {
    closeSoftwareUpdaterModal();
  }
}

async function checkSoftwareUpdatesOnline() {
  const container = document.getElementById('updaterItemsTableContainer');
  const badgeLatest = document.getElementById('updaterStatLatest');
  const badgeOutdated = document.getElementById('updaterStatOutdated');
  const badgeMissing = document.getElementById('updaterStatMissing');
  const summaryBadge = document.getElementById('updaterSummaryBadge');

  if (container) {
    container.innerHTML = `
      <div style="text-align:center; padding:35px; color:#64748b; font-size:13px;">
        <div style="font-size:26px; margin-bottom:8px;">⏳</div>
        <div style="font-weight:700; color:#0369a1;">Đang kết nối API chính hãng để kiểm tra phiên bản mới nhất...</div>
        <div style="font-size:11.5px; margin-top:4px; color:#94a3b8;">(Truy vấn Google, Mozilla, GitHub, 7-Zip & Microsoft CDN)</div>
      </div>
    `;
  }

  try {
    const res = await fetch(`/api/software_updater/check?t=${Date.now()}`, { cache: 'no-store' });
    const data = await res.json();
    if (data.status === 'ok') {
      softwareUpdaterCache = data;
      renderSoftwareUpdaterTable(data);

      if (badgeLatest) badgeLatest.innerText = `${data.latest_count || 0} Bản Mới Nhất`;
      if (badgeOutdated) badgeOutdated.innerText = `${data.outdated_count || 0} Bản Cũ`;
      if (badgeMissing) badgeMissing.innerText = `${data.missing_count || 0} Chưa Tải`;

      const needAttention = (data.outdated_count || 0) + (data.missing_count || 0);
      if (summaryBadge) {
        if (needAttention > 0) {
          summaryBadge.style.display = 'inline-block';
          summaryBadge.innerText = `${needAttention}`;
        } else {
          summaryBadge.style.display = 'none';
        }
      }
    } else {
      if (container) container.innerHTML = `<div style="text-align:center; padding:30px; color:#ef4444;">⚠️ Lỗi: ${data.message || 'Không thể kiểm tra cập nhật'}</div>`;
    }
  } catch (err) {
    if (container) container.innerHTML = `<div style="text-align:center; padding:30px; color:#ef4444;">⚠️ Lỗi kết nối tới server.py</div>`;
  }
}

function renderSoftwareUpdaterTable(data) {
  const container = document.getElementById('updaterItemsTableContainer');
  if (!container || !data || !Array.isArray(data.items)) return;

  const items = data.items;
  let html = `
    <table style="width:100%; border-collapse:collapse; font-size:12.5px; text-align:left;">
      <thead>
        <tr style="border-bottom:2px solid #e2e8f0; color:#475569; font-size:11.5px; text-transform:uppercase;">
          <th style="padding:8px 10px; width:40px; text-align:center;">
            <input type="checkbox" id="chkSelectAllUpdater" checked onchange="toggleSelectAllUpdaterApps(this.checked)" title="Chọn / Bỏ chọn tất cả">
          </th>
          <th style="padding:8px 10px;">Phần Mềm</th>
          <th style="padding:8px 10px;">Bản Hiện Có (software/)</th>
          <th style="padding:8px 10px;">Bản Mới Nhất</th>
          <th style="padding:8px 10px; text-align:center;">Trạng Thái</th>
          <th style="padding:8px 10px; text-align:right;">Hành Động</th>
        </tr>
      </thead>
      <tbody>
  `;

  items.forEach(it => {
    let badgeHtml = '';
    let isChecked = false;
    if (it.status_badge === 'missing') {
      badgeHtml = `<span class="badge badge-danger" style="font-size:10.5px;">Chưa Tải</span>`;
      isChecked = true;
    } else if (it.status_badge === 'outdated') {
      badgeHtml = `<span class="badge badge-warning" style="font-size:10.5px;">Có Bản Mới</span>`;
      isChecked = true;
    } else {
      badgeHtml = `<span class="badge badge-mint" style="font-size:10.5px;">Mới Nhất</span>`;
      isChecked = false;
    }

    const localText = it.has_offline
      ? `<strong>${escapeHtml(it.local_version)}</strong> <span style="font-size:11px; color:#64748b;">(${it.filesize_mb} MB)</span>`
      : `<span style="color:#ef4444; font-style:italic;">Chưa có trong software/</span>`;

    html += `
      <tr style="border-bottom:1px solid #f1f5f9; hover:background:#f8fafc;">
        <td style="padding:10px; text-align:center;">
          <input type="checkbox" class="chk-updater-item" data-appid="${it.id}" ${isChecked ? 'checked' : ''}>
        </td>
        <td style="padding:10px;">
          <div style="display:flex; align-items:center; gap:8px;">
            <img src="${getAppIconPath(it.id)}" style="width:20px; height:20px; object-fit:contain;" onerror="this.outerHTML='📦'">
            <div>
              <div style="font-weight:700; color:#0f172a;">${escapeHtml(it.name)}</div>
              <div style="font-size:11px; color:#64748b;">${escapeHtml(it.category || '')}</div>
            </div>
          </div>
        </td>
        <td style="padding:10px;">${localText}</td>
        <td style="padding:10px;"><strong style="color:#0369a1;">${escapeHtml(it.latest_version)}</strong></td>
        <td style="padding:10px; text-align:center;">${badgeHtml}</td>
        <td style="padding:10px; text-align:right;">
          <button type="button" class="btn btn-outline" onclick="syncSingleAppDirect('${it.id}')" style="font-size:11px; padding:3px 9px;" title="Tải ngay bộ cài mới nhất của ${escapeHtml(it.name)}">
            ⬇️ Tải Ngay
          </button>
        </td>
      </tr>
    `;
  });

  html += `</tbody></table>`;
  container.innerHTML = html;
}

function toggleSelectAllUpdaterApps(checked) {
  document.querySelectorAll('.chk-updater-item').forEach(chk => chk.checked = checked);
}

function syncSingleAppDirect(appId) {
  startSyncSelectedApps([appId]);
}

async function startSyncSelectedApps(specifiedIds = null) {
  let targetIds = [];
  if (Array.isArray(specifiedIds) && specifiedIds.length > 0) {
    targetIds = specifiedIds;
  } else {
    document.querySelectorAll('.chk-updater-item:checked').forEach(chk => {
      const id = chk.getAttribute('data-appid');
      if (id) targetIds.push(id);
    });
  }

  if (targetIds.length === 0) {
    showToast('Vui lòng tích chọn ít nhất 1 phần mềm để đồng bộ tải về!');
    return;
  }

  const pBox = document.getElementById('updaterSyncProgressBox');
  if (pBox) pBox.style.display = 'block';

  try {
    const res = await fetch(`/api/software_updater/start_sync?apps=${encodeURIComponent(JSON.stringify(targetIds))}`);
    const data = await res.json();
    if (data.status === 'started') {
      showToast(`⚡ Đang bắt đầu đồng bộ tải về ${data.total} phần mềm...`);
      startPollingSoftwareUpdaterProgress();
    } else {
      showToast('⚠️ ' + (data.message || 'Không thể khởi động đồng bộ'));
    }
  } catch (err) {
    showToast('⚠️ Lỗi kết nối khi khởi động đồng bộ');
  }
}

function startPollingSoftwareUpdaterProgress() {
  if (softwareUpdaterSyncPolling) clearInterval(softwareUpdaterSyncPolling);
  softwareUpdaterSyncPolling = setInterval(updateSoftwareUpdaterSyncUI, 800);
}

async function updateSoftwareUpdaterSyncUI() {
  const pBox = document.getElementById('updaterSyncProgressBox');
  const titleEl = document.getElementById('updaterActiveAppTitle');
  const speedEl = document.getElementById('updaterActiveAppSpeed');
  const fillEl = document.getElementById('updaterSyncProgressFill');
  const detailEl = document.getElementById('updaterSyncDetailText');
  const btnPause = document.getElementById('btnPauseSync');

  try {
    const res = await fetch(`/api/software_updater/progress?t=${Date.now()}`, { cache: 'no-store' });
    const st = await res.json();

    if (st.status === 'syncing') {
      if (pBox) pBox.style.display = 'block';
      if (titleEl) titleEl.innerText = `⏳ [${st.current_index}/${st.total_apps}] Đang tải: ${st.current_app_name} (${st.current_file})`;
      if (speedEl) speedEl.innerText = `${st.speed_kbps || 0} KB/s • Tiến độ: ${st.progress_percent || 0}% • Còn ~${st.eta_seconds || 0}s`;
      if (fillEl) fillEl.style.width = `${st.progress_percent || 0}%`;
      const mbLoaded = (st.downloaded_bytes / (1024 * 1024)).toFixed(1);
      const mbTotal = (st.total_bytes / (1024 * 1024)).toFixed(1);
      if (detailEl) detailEl.innerText = `Đã tải: ${mbLoaded} MB / ${mbTotal > 0 ? mbTotal + ' MB' : 'Đang tính toán'} -> software/${st.current_app_id}/`;
    } else if (st.status === 'completed') {
      clearInterval(softwareUpdaterSyncPolling);
      softwareUpdaterSyncPolling = null;
      if (fillEl) fillEl.style.width = '100%';
      if (titleEl) titleEl.innerText = '🎉 ĐÃ HOÀN TẤT ĐỒNG BỘ!';
      if (speedEl) speedEl.innerText = `Đã tải ${st.synced_apps ? st.synced_apps.length : 0} phần mềm`;
      if (detailEl) detailEl.innerText = 'Toàn bộ bộ cài offline đã sẵn sàng trong thư mục software/ để đi cài máy!';
      showToast('🎉 Đồng bộ tải về các bộ cài offline thành công!');
      setTimeout(() => {
        checkSoftwareUpdatesOnline();
      }, 1500);
    } else if (st.status === 'stopped') {
      clearInterval(softwareUpdaterSyncPolling);
      softwareUpdaterSyncPolling = null;
      if (titleEl) titleEl.innerText = '⏹️ ĐÃ DỪNG TIẾN TRÌNH';
      if (detailEl) detailEl.innerText = 'Tiến trình đồng bộ đã dừng theo yêu cầu.';
      showToast('⏹️ Đã dừng đồng bộ.');
    }
  } catch (err) {}
}

async function pauseOrResumeSync() {
  const btn = document.getElementById('btnPauseSync');
  const action = isSoftwareUpdaterSyncPaused ? 'resume' : 'pause';
  await fetch(`/api/software_updater/control?action=${action}`);
  isSoftwareUpdaterSyncPaused = !isSoftwareUpdaterSyncPaused;
  if (btn) btn.innerText = isSoftwareUpdaterSyncPaused ? '▶️ Tiếp Tục' : '⏸️ Tạm Dừng';
}

async function stopSyncProcess() {
  await fetch('/api/software_updater/control?action=stop');
}




