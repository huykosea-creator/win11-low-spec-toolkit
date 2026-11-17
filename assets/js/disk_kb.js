// BẢNG TRA CỨU 100 MÃ LỖI Ổ CỨNG (HDD / SSD / NVMe) TỪ GOOGLE SHEET CHUYÊN GIA
// Nguồn: https://docs.google.com/spreadsheets/d/1xbcgHmL_lYDjsmdwmFkmcRsJguS5MlomHfj4mnErmWQ
window.DISK_ERROR_KNOWLEDGE_BASE = [
  {
    "category": "S.M.A.R.T",
    "code": "ID 05 (0x05)",
    "name": "Reallocated Sectors Count",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Số lượng bad sector vật lý đã được chuyển sang sector dự phòng. Nếu tăng liên tục, ổ cứng sắp hỏng hoàn toàn. Cần sao lưu ngay và thay ổ."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C5 (0xC5)",
    "name": "Current Pending Sector Count",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Số sector không ổn định chờ kiểm tra và ánh xạ lại. Chạy chkdsk /r hoặc format cấp thấp để phân bổ lại; nếu không giảm cần thay ổ."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C6 (0xC6)",
    "name": "Offline Uncorrectable Sector Count",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Sector bị lỗi nghiêm trọng không thể đọc/ghi dù kiểm tra ngầm. Nguy cơ mất dữ liệu trực tiếp, cần cứu dữ liệu gấp."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C7 (0xC7)",
    "name": "UltraDMA CRC Error Count",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Lỗi truyền dữ liệu giữa ổ cứng và bo mạch chủ. Thường do cáp SATA/cổng kết nối bị lỏng, gãy hoặc bẩn. Kiểm tra hoặc thay cáp SATA."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 0A (0x0A)",
    "name": "Spin Retry Count",
    "drive_type": "Chỉ HDD",
    "severity": "Cao",
    "solution": "Số lần motor đĩa phải khởi động lại để đạt tốc độ vòng quay chuẩn. Dấu hiệu hỏng cơ khí hoặc nguồn điện cấp yếu."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID B8 (0xB8)",
    "name": "End-to-End Error",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Lỗi tương thích và toàn vẹn dữ liệu trong bộ nhớ đệm (cache) của ổ đĩa. Khuyến nghị thay ổ cứng sớm."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID BB (0xBB)",
    "name": "Reported Uncorrectable Errors",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Số lỗi đọc/ghi mà mã sửa lỗi phần cứng (ECC) không thể khôi phục được. Nên sao lưu dữ liệu đề phòng."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID BC (0xBC)",
    "name": "Command Timeout",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Lệnh thao tác bị hủy do ổ cứng không phản hồi kịp. Có thể do lỗi nguồn điện, cáp lỏng hoặc firmware ổ đĩa."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID E7 (SSD)",
    "name": "SSD Life Left / Wear Range Delta",
    "drive_type": "Chỉ SSD",
    "severity": "Cao",
    "solution": "Mức độ hao mòn chip nhớ flash SSD. Khi chỉ số giảm về 0-10%, các ô nhớ NAND sắp hết tuổi thọ ghi, cần thay thế."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "BIOS Error 301",
    "name": "SMART Hard Disk Error (301)",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "BIOS phát hiện ổ cứng có nguy cơ hỏng hóc vật lý sắp xảy ra. Nhấn F2 chạy chẩn đoán, sao lưu toàn bộ dữ liệu ngay lập tức."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "No Boot Device",
    "name": "No Bootable Device Found",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Máy tính không tìm thấy phân vùng hệ điều hành. Kiểm tra cáp nối, thứ tự khởi động trong BIOS hoặc cấu hình UEFI/Legacy."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "Disk Boot Failure",
    "name": "Disk Boot Failure, Insert System Disk",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Master Boot Record (MBR) hoặc tệp khởi động bị lỗi/hỏng. Dùng USB cài Windows chạy startup repair hoặc lệnh bootrec /fixmbr."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "Hard Drive Not Detected",
    "name": "Hard Disk Not Detected in BIOS",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Ổ cứng hoàn toàn không nhận diện được trong BIOS. Kiểm tra lại chân cắm SATA/NVMe, nguồn hoặc ổ cứng đã bị cháy mạch/chết controller."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "PXE-MOF",
    "name": "PXE-MOF: Exiting Intel PXE ROM",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Máy tự chuyển sang boot qua mạng LAN vì không tìm thấy ổ cứng khởi động. Kiểm tra xem ổ cứng có bị lỏng hoặc chết hay không."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "Operating System Missing",
    "name": "Missing Operating System",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Phân vùng hệ điều hành bị mất đánh dấu Active hoặc file boot BCD bị hỏng. Dùng công cụ Windows PE để rebuild BCD."
  },
  {
    "category": "BSOD Windows",
    "code": "0x0000007B",
    "name": "INACCESSIBLE_BOOT_DEVICE",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Windows không thể truy cập vào phân vùng hệ thống khi khởi động. Thường do sai chế độ SATA (AHCI/RAID) hoặc ổ cứng bị lỗi sector boot."
  },
  {
    "category": "BSOD Windows",
    "code": "0x0000007A",
    "name": "KERNEL_DATA_INPAGE_ERROR",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Không đọc được dữ liệu phân trang từ ổ cứng vào RAM. Do bad sector, lỏng cáp đĩa hoặc chết chip nhớ SSD. Kiểm tra bằng chkdsk."
  },
  {
    "category": "BSOD Windows",
    "code": "0x000000ED",
    "name": "UNMOUNTABLE_BOOT_VOLUME",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "File system phân vùng khởi động bị hỏng (corrupt). Khởi động vào Windows Recovery, mở CMD và chạy lệnh chkdsk /r C: để sửa lỗi."
  },
  {
    "category": "BSOD Windows",
    "code": "0x000000EF",
    "name": "CRITICAL_PROCESS_DIED",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Tiến trình hệ thống quan trọng bị tắt đột ngột do ổ cứng dừng phản hồi hoặc tập tin hệ thống bị hỏng. Quét sfc /scannow và kiểm tra sức khỏe ổ."
  },
  {
    "category": "BSOD Windows",
    "code": "0x00000024",
    "name": "NTFS_FILE_SYSTEM",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Lỗi nghiêm trọng trong trình điều khiển hoặc cấu trúc tệp tin hệ thống NTFS. Chạy kiểm tra ổ đĩa bằng chkdsk và kiểm tra phân mảnh."
  },
  {
    "category": "BSOD Windows",
    "code": "0x000000F4",
    "name": "CRITICAL_OBJECT_TERMINATION",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Tiến trình hệ điều hành bị chấm dứt do thiết bị lưu trữ ngắt kết nối đột ngột. Thường do cáp nguồn hoặc cáp dữ liệu tiếp xúc kém."
  },
  {
    "category": "Device Manager",
    "code": "Code 10",
    "name": "This device cannot start (Code 10)",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Trình điều khiển (driver) chipset/controller ổ cứng không khởi động được. Cập nhật driver AHCI/NVMe hoặc cài lại driver bo mạch chủ."
  },
  {
    "category": "Device Manager",
    "code": "Code 43",
    "name": "Windows has stopped this device (Code 43)",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Thiết bị thông báo lỗi phần cứng tới hệ điều hành. Thử rút ra cắm lại cổng khác, gỡ driver cài lại; nếu vẫn lỗi thì hỏng mạch điều khiển."
  },
  {
    "category": "Device Manager",
    "code": "Code 45",
    "name": "Device is not connected to computer (Code 45)",
    "drive_type": "HDD & SSD",
    "severity": "Thấp",
    "solution": "Thiết bị từng kết nối nhưng hiện bị ngắt. Cắm lại cáp dữ liệu hoặc cổng USB (nếu là ổ cứng di động), vệ sinh chân cắm."
  },
  {
    "category": "Device Manager",
    "code": "I/O Device Error",
    "name": "The request could not be performed because of an I/O device error",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Lỗi phần cứng nghiêm trọng khi đọc/ghi ổ cứng. Thường do đầu đọc ổ HDD bị hỏng hoặc chip nhớ SSD bị khóa chế độ read-only."
  },
  {
    "category": "Device Manager",
    "code": "CRC Error",
    "name": "Data error (cyclic redundancy check)",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Dữ liệu bị lỗi kiểm tra mã dư thừa tuần hoàn do bề mặt đĩa bị bad nặng hoặc cáp truyền dẫn suy hao. Hạn chế ghi thêm để tránh mất dữ liệu."
  },
  {
    "category": "Device Manager",
    "code": "RAW Format",
    "name": "Disk File System is RAW",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Bảng phân vùng (partition table) hoặc Boot Sector bị hỏng khiến Windows không nhận diện được định dạng (NTFS/FAT32). Dùng công cụ cứu dữ liệu trước khi format."
  },
  {
    "category": "Device Manager",
    "code": "Not Initialized",
    "name": "Disk Unknown, Not Initialized",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Ổ cứng chưa hoặc không thể khởi tạo MBR/GPT do chip nhớ bị hỏng hoặc mất nhận dạng firmware. Thường cần can thiệp phần cứng chuyên sâu."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 01 (0x01)",
    "name": "Raw Read Error Rate",
    "drive_type": "Chỉ HDD",
    "severity": "Cao",
    "solution": "Tần suất lỗi khi đọc dữ liệu trực tiếp từ bề mặt đĩa từ. Nếu tăng nhanh, bề mặt đĩa bị xước hoặc đầu đọc suy hao, cần sao lưu và đổi ổ."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 07 (0x07)",
    "name": "Seek Error Rate",
    "drive_type": "Chỉ HDD",
    "severity": "Trung bình",
    "solution": "Tỷ lệ lỗi định vị đầu từ cơ học trên đĩa platter. Thường do rung lắc mạnh, nhiệt độ quá cao hoặc cơ cấu dịch chuyển đầu đọc bị mòn."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 0B (0x0B)",
    "name": "Calibration Retry Count",
    "drive_type": "Chỉ HDD",
    "severity": "Cao",
    "solution": "Số lần ổ đĩa phải hiệu chuẩn lại đầu đọc sau thất bại. Dấu hiệu cơ học HDD bị lỗi nặng hoặc mạch điều khiển suy giảm chất lượng."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID BE / C2",
    "name": "Airflow / Drive Temperature",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Nhiệt độ ổ cứng vượt ngưỡng an toàn (>50°C với HDD hoặc >70°C với NVMe SSD). Cần cải thiện luồng gió tản nhiệt để tránh giảm thọ linh kiện."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C4 (0xC4)",
    "name": "Reallocation Event Count",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Tổng số lần ổ cố gắng chuyển dữ liệu từ bad sector/bad block sang vùng dự phòng. Tăng liên tục là cảnh báo hỏng hóc vật lý."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID B7 (0xB7)",
    "name": "SATA Downshift Error Count",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Số lần ổ phải hạ tốc độ truyền dữ liệu (SATA III xuống SATA II/I) do đường truyền chập chờn hoặc nhiễu tín hiệu cáp."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID E8 (SSD)",
    "name": "Available Reserved Space",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Dung lượng các block dự phòng còn lại trên SSD. Khi chỉ số này giảm về 0, SSD sẽ chuyển sang trạng thái chỉ đọc (read-only) để bảo vệ dữ liệu."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID F1 (SSD)",
    "name": "Total LBAs Written (TBW Exceeded)",
    "drive_type": "Chỉ SSD",
    "severity": "Cao",
    "solution": "Tổng dung lượng đã ghi vượt quá chỉ số TBW nhà sản xuất cam kết. SSD có thể mất bảo hành và nguy cơ lỗi cell nhớ NAND tăng cao."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 03 (NVMe)",
    "name": "NVMe Available Spare Below Threshold",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Dung lượng block nhớ dự trữ của ổ NVMe tụt xuống dưới ngưỡng an toàn theo chuẩn NVMe S.M.A.R.T log. Khuyến nghị thay thế ngay."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 05 (NVMe)",
    "name": "NVMe Media and Data Integrity Errors",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Số lần dữ liệu không thể khôi phục dù đã dùng cơ chế sửa lỗi nội bộ NVMe SSD. Dấu hiệu hỏng cell nhớ NAND hoặc chip Controller NVMe."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "NVMe Not Detected",
    "name": "M.2 NVMe SSD Not Detected in BIOS",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Khe M.2 hoặc ổ SSD NVMe không nhận trong UEFI BIOS. Thường do lỏng chân cắm M.2, thiếu driver VMD/Intel RST, hoặc chết controller SSD."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "Clicking / Beeping Noise",
    "name": "Hard Drive Clicking Noise (Click of Death)",
    "drive_type": "Chỉ HDD",
    "severity": "Rất cao",
    "solution": "Tiếng lạch cạch liên hồi từ ổ HDD khi cấp nguồn do đầu đọc liên tục va chạm với thanh chặn. Lỗi cơ khí nghiêm trọng, tắt máy ngay để cứu dữ liệu."
  },
  {
    "category": "BSOD Windows",
    "code": "0x00000124",
    "name": "WHEA_UNCORRECTABLE_ERROR",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Lỗi phần cứng nghiêm trọng do kiến trúc báo lỗi Windows (WHEA), thường kích hoạt khi ổ SSD PCIe NVMe bị mất kết nối hoặc tụt áp đột ngột."
  },
  {
    "category": "BSOD Windows",
    "code": "0x00000154",
    "name": "UNEXPECTED_STORE_EXCEPTION",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Trình quản lý bộ nhớ của Windows không thể đọc/ghi vào thiết bị lưu trữ. Thường do ổ SSD bị lỗi firmware hoặc ổ HDD bị ngắt nguồn tức thời."
  },
  {
    "category": "Device Manager",
    "code": "Event ID 129",
    "name": "Reset to device, \\Device\\RaidPort0, was issued",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Windows Event Viewer ghi nhận lệnh reset controller lưu trữ do ổ bị đóng băng (freezing/100% disk usage). Thường do lỗi cáp SATA hoặc SSD firmware."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 09 (0x09)",
    "name": "Power-On Hours (POH)",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Tổng thời gian ổ đĩa đã hoạt động (tính theo giờ). Dùng để theo dõi tuổi thọ và mức độ khấu hao phần cứng của ổ cứng."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 0C (0x0C)",
    "name": "Power Cycle Count",
    "drive_type": "HDD & SSD",
    "severity": "Thấp",
    "solution": "Số chu kỳ bật/tắt nguồn của thiết bị lưu trữ. Giúp phát hiện việc bật tắt máy quá thường xuyên hoặc sốc nguồn điện."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C8 (0xC8)",
    "name": "Write Error Rate",
    "drive_type": "Chỉ HDD",
    "severity": "Cao",
    "solution": "Tần suất phát sinh lỗi khi ghi dữ liệu lên phiến đĩa. Thường xuất phát từ cơ cấu đầu đọc/ghi suy yếu hoặc bề mặt đĩa xước nhẹ."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C0 (0xC0)",
    "name": "Power-Off Retract Count",
    "drive_type": "Chỉ HDD",
    "severity": "Trung bình",
    "solution": "Số lần đầu từ bị buộc thu về vùng đỗ khẩn cấp do sập nguồn đột ngột. Tăng nguy cơ xước đĩa từ nếu lặp lại nhiều lần."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID B4 (SSD)",
    "name": "Unused Reserved Block Count",
    "drive_type": "Chỉ SSD",
    "severity": "Cao",
    "solution": "Số block dự phòng chưa dùng trên chip nhớ SSD. Khi số lượng sụt giảm mạnh, tốc độ hao mòn ô nhớ NAND đang tăng nhanh."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID AA (SSD)",
    "name": "Reserved Block Count / Bad Block",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Số lượng block nhớ bị đánh dấu hỏng trên SSD. Khi các block dự phòng cạn kiệt, nguy cơ ổ bị khóa chỉ đọc hoặc mất dữ liệu."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 02 (NVMe)",
    "name": "Critical Warning (NVMe Log)",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Cảnh báo phần cứng nghiêm trọng từ controller NVMe (quá nhiệt, mạch suy giảm hoặc tính toàn vẹn bộ nhớ gặp sự cố)."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "SMART Error 303 / 305",
    "name": "HP Hard Drive Quick / Full Test Failed",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Mã chẩn đoán BIOS của HP xác định ổ cứng hỏng vật lý hoặc không vượt qua bài kiểm tra. Sao lưu và thay ổ mới ngay."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "Dell Error 2000-0142",
    "name": "ePSA Hard Drive Self-Test Failed",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Bộ chẩn đoán phần cứng Dell ePSA báo lỗi ổ cứng không vượt qua bài tự kiểm tra ngắn. Cần sao lưu khẩn cấp và thay ổ."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "Lenovo Error 0177",
    "name": "Bad CRC - Error in Data",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Lỗi kiểm tra toàn vẹn dữ liệu phần cứng khi POST trên dòng Lenovo/ThinkPad. Kiểm tra tiếp xúc cáp hoặc thay ổ lưu trữ."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "Dell Error 2000-0151",
    "name": "ePSA SMART Status Incorrect",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Trình chẩn đoán ePSA ghi nhận cảm biến S.M.A.R.T đã chạm ngưỡng hỏng hóc phần cứng. Cần trích xuất dữ liệu và thay thế."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "SMART Status BAD",
    "name": "SMART Status BAD, Backup and Replace",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Màn hình POST của bo mạch chủ cảnh báo ổ đĩa sắp hỏng hoàn toàn. Hệ thống khuyến cáo sao lưu và thay ổ ngay."
  },
  {
    "category": "BSOD Windows",
    "code": "0x0000001A",
    "name": "MEMORY_MANAGEMENT",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Quản lý bộ nhớ gặp lỗi phân trang I/O ghi xuống pagefile trên ổ cứng. Thường do ổ bad sector hoặc controller bị nghẽn."
  },
  {
    "category": "BSOD Windows",
    "code": "0x0000009F",
    "name": "DRIVER_POWER_STATE_FAILURE",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Trình điều khiển controller lưu trữ không chuyển đổi được trạng thái tiết kiệm điện (Sleep/Wake). Cập nhật driver AHCI/NVMe."
  },
  {
    "category": "BSOD Windows",
    "code": "0x000000F8",
    "name": "RAMDISK_BOOT_INITIALIZATION_FAILED",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Không thể nạp file khởi động từ ổ cứng vào RAM khi boot hệ điều hành. Cần kiểm tra bad sector hoặc phục hồi file boot BCD."
  },
  {
    "category": "BSOD Windows",
    "code": "0x0000003B",
    "name": "SYSTEM_SERVICE_EXCEPTION (ntfs.sys)",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Tiến trình hệ thống bị ngắt do driver ntfs.sys gặp lỗi khi đọc/ghi ổ cứng. Kiểm tra cấu trúc phân vùng bằng chkdsk."
  },
  {
    "category": "Device Manager",
    "code": "Code 22",
    "name": "This device is disabled (Code 22)",
    "drive_type": "HDD & SSD",
    "severity": "Thấp",
    "solution": "Thiết bị lưu trữ đang bị vô hiệu hóa trong hệ thống. Nhấp chuột phải vào tên ổ trong Device Manager và chọn Enable Device."
  },
  {
    "category": "Device Manager",
    "code": "Code 31",
    "name": "Windows cannot load driver (Code 31)",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Windows không tải được driver cho controller ổ đĩa do xung đột phần mềm hoặc driver lỗi. Cài đặt lại driver chipset/storage."
  },
  {
    "category": "Device Manager",
    "code": "Code 38",
    "name": "Driver previous instance loaded",
    "drive_type": "HDD & SSD",
    "severity": "Thấp",
    "solution": "Phiên bản cũ của driver lưu trữ vẫn còn kẹt trong bộ nhớ RAM sau khi rút ổ. Khởi động lại máy tính để hệ điều hành nhận lại."
  },
  {
    "category": "Device Manager",
    "code": "Code 51",
    "name": "An error detected during paging operation",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Windows Event log ghi nhận lỗi phân trang đọc/ghi dữ liệu đĩa cứng. Dấu hiệu ổ bị bad sector hoặc cáp kết nối chập chờn."
  },
  {
    "category": "Device Manager",
    "code": "Error 0x80070057",
    "name": "The parameter is incorrect",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Lỗi tham số không hợp lệ khi format hoặc phân vùng ổ cứng trong Disk Management. Do bảng phân vùng lỗi hoặc chip nhớ suy thoái."
  },
  {
    "category": "Device Manager",
    "code": "Error 0x8007045D",
    "name": "The request failed due to I/O device error",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Quá trình đọc/ghi bị hủy hoàn toàn do lỗi vào/ra phần cứng nghiêm trọng. Thường do bad sector nặng hoặc cơ cấu đầu từ bị hỏng."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID A9 (SSD)",
    "name": "Remain Life / Percentage Used",
    "drive_type": "Chỉ SSD",
    "severity": "Cao",
    "solution": "Chỉ số đo phần trăm tuổi thọ còn lại hoặc mức độ đã hao mòn của chip nhớ SSD. Khi chạm ngưỡng giới hạn, ổ đối mặt nguy cơ hỏng cell nhớ."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID AB (SSD)",
    "name": "Program Fail Count",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Số lần thao tác ghi dữ liệu vào ô nhớ flash NAND bị thất bại phần cứng. Cho thấy cell nhớ bị chai hoặc controller flash suy yếu nghiêm trọng."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID AC (SSD)",
    "name": "Erase Fail Count",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Số lần thực hiện lệnh xóa block trên chip nhớ SSD bị lỗi. Báo hiệu block nhớ flash đã chết hoàn toàn và không thể tái cấu trúc ô nhớ."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID AE (SSD)",
    "name": "Unexpected Power Loss Count",
    "drive_type": "Chỉ SSD",
    "severity": "Cao",
    "solution": "Số lần ổ SSD bị mất điện đột ngột hoặc tắt máy cưỡng bức không đúng quy trình an toàn. Nguy cơ làm hỏng bảng ánh xạ FTL bộ nhớ flash."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID B1 (SSD)",
    "name": "Wear Leveling Count",
    "drive_type": "Chỉ SSD",
    "severity": "Trung bình",
    "solution": "Số chu kỳ thuật toán san bằng hao mòn đã thực hiện trên các ô nhớ. Giúp đánh giá mức độ đồng đều khi ghi dữ liệu và tuổi thọ tổng thể của SSD."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID F2 (SSD)",
    "name": "Total LBAs Read (Host Reads)",
    "drive_type": "Chỉ SSD",
    "severity": "Thấp",
    "solution": "Tổng khối lượng dữ liệu máy chủ đã đọc từ ổ SSD (tính theo số sector LBA). Dùng kết hợp với F1 để phân tích tỷ lệ đọc/ghi và hao mòn bộ nhớ."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 0E (NVMe)",
    "name": "Media and Data Integrity Errors",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Số lần phát sinh lỗi toàn vẹn dữ liệu không thể phục hồi trên ổ NVMe (vượt ngưỡng ECC/CRC). Bất kỳ giá trị nào lớn hơn 0 đều là dấu hiệu cell nhớ NAND đang hỏng."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 04 (NVMe)",
    "name": "Percentage Used (NVMe Health)",
    "drive_type": "Chỉ SSD",
    "severity": "Cao",
    "solution": "Chỉ số phần trăm tuổi thọ thiết bị đã tiêu hao theo ước tính của nhà sản xuất (0% là mới, 100% là chạm hạn mức bảo hành TBW)."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID AD (SSD)",
    "name": "Average / Maximum Erase Count",
    "drive_type": "Chỉ SSD",
    "severity": "Trung bình",
    "solution": "Số lần xóa trung bình và tối đa trên các khối nhớ NAND flash. Chỉ số đo lường trực tiếp mức độ tiêu hao chu kỳ P/E (Program/Erase) của SSD."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C2 (NVMe)",
    "name": "Composite Temperature / Thermal Throttle",
    "drive_type": "Chỉ SSD",
    "severity": "Trung bình",
    "solution": "Cảm biến nhiệt độ tổ hợp và số lần NVMe kích hoạt cơ chế giảm xung (Thermal Throttling) do quá nhiệt. Cần trang bị tản nhiệt M.2."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 0B (NVMe)",
    "name": "NVMe Firmware Error Count",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Số lỗi phát sinh trong firmware của chip điều khiển NVMe. Cần cập nhật firmware chính hãng hoặc bảo hành thay mới."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 01 (NVMe)",
    "name": "Critical Warning - Temperature",
    "drive_type": "Chỉ SSD",
    "severity": "Cao",
    "solution": "Cảnh báo nhiệt độ vượt ngưỡng an toàn tối đa cho phép của ổ NVMe. Cần gắn thêm tản nhiệt nhôm hoặc cải thiện luồng khí case."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID 16 (0x10)",
    "name": "Helium Level (Helium Drive)",
    "drive_type": "Chỉ HDD",
    "severity": "Rất cao",
    "solution": "Cảm biến phát hiện áp suất khí Helium trong ổ HDD kín bị rò rỉ dưới mức an toàn. Nguy cơ hỏng đầu đọc, cần thay thế khẩn cấp."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID B5 (SSD)",
    "name": "Program Fail Count (Total)",
    "drive_type": "Chỉ SSD",
    "severity": "Cao",
    "solution": "Tổng số lần ghi dữ liệu vào chip nhớ flash thất bại. Cảnh báo các ô nhớ NAND bắt đầu thoái hóa, nên sao lưu dữ liệu."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID B6 (SSD)",
    "name": "Erase Fail Count (Total)",
    "drive_type": "Chỉ SSD",
    "severity": "Rất cao",
    "solution": "Tổng số lần lệnh xóa khối nhớ NAND gặp lỗi phần cứng. Dấu hiệu block flash chết hoàn toàn, nguy cơ ổ bị khóa chỉ đọc (Read-only)."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C3 (0xC3)",
    "name": "Hardware ECC Recovered",
    "drive_type": "HDD & SSD",
    "severity": "Thấp",
    "solution": "Số lỗi dữ liệu đã được sửa thành công bằng mã tự sửa lỗi phần cứng nội bộ. Thường không nguy hiểm nếu không tăng đột biến."
  },
  {
    "category": "S.M.A.R.T",
    "code": "ID C9 (0xC9)",
    "name": "Soft Read Error Rate",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Tần suất phát sinh lỗi đọc dữ liệu cấp độ phần mềm (không phải lỗi vật lý). Chạy format cấp thấp hoặc chẩn đoán đĩa để ổn định lại."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "0xc000000e",
    "name": "Windows Boot BCD Missing / Corrupt",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Tập tin cấu hình khởi động (BCD) bị mất hoặc hỏng do tắt máy đột ngột hay lỗi ổ đĩa. Khởi động USB cứu hộ chạy bootrec /rebuildbcd."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "0xc000000f",
    "name": "Windows Boot Selection Failed",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Trình khởi động không tìm thấy thiết bị hoặc tập tin hệ điều hành cần thiết. Kiểm tra cáp nối ổ và phân vùng EFI/System Reserved."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "0xc0000225",
    "name": "Winload.efi Missing or Error",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Tập tin winload.efi trong phân vùng Windows không thể nạp được do phân vùng hỏng hoặc bad sector. Cần sửa chữa phân vùng EFI."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "0xc0000034",
    "name": "BCD Configuration Missing",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Màn hình xanh Recovery báo dữ liệu cấu hình khởi động BCD bị trống. Dùng lệnh bcdboot C:\\Windows /s /f UEFI để nạp lại."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "Dell Error 2000-0155",
    "name": "ePSA Hard Drive Not Installed",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Hệ thống chẩn đoán Dell ePSA không tìm thấy kết nối vật lý tới ổ cứng. Kiểm tra lại cáp kết nối SATA/NVMe hoặc thay ổ."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "HP Error 302",
    "name": "SMART Hard Disk Not Detected",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "BIOS của máy HP hoàn toàn không nhận diện được giao tiếp dữ liệu với ổ cứng. Thử tháo lắp lại cổng cắm hoặc kiểm tra bo mạch ổ."
  },
  {
    "category": "BIOS / Khởi động",
    "code": "ASUS SMART Warning",
    "name": "ASUS SMART Status Bad - Press F1",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Mainboard ASUS dừng quá trình POST cảnh báo ổ cứng sắp hỏng. Vào BIOS vô hiệu hóa tạm để backup dữ liệu khẩn cấp rồi thay ổ mới."
  },
  {
    "category": "BSOD Windows",
    "code": "0x0000001E",
    "name": "KMODE_EXCEPTION_NOT_HANDLED",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Trình xử lý nhân phát sinh lỗi ngoại lệ khi đọc phân vùng ổ cứng. Thường do xung đột driver lưu trữ hoặc sector vùng nhớ bị lỗi."
  },
  {
    "category": "BSOD Windows",
    "code": "0x00000050",
    "name": "PAGE_FAULT_IN_NONPAGED_AREA",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Bộ nhớ ảo truy cập địa chỉ không hợp lệ trên pagefile của ổ cứng. Có thể do bad sector ổ cứng hoặc lỗi RAM."
  },
  {
    "category": "BSOD Windows",
    "code": "0x00000109",
    "name": "CRITICAL_STRUCTURE_CORRUPTION",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Cấu trúc lõi của kernel Windows bị biến đổi sai lệch do dữ liệu đọc từ ổ đĩa lưu trữ bị méo mó. Cần kiểm tra sức khỏe ổ cứng."
  },
  {
    "category": "BSOD Windows",
    "code": "0x00000119",
    "name": "VIDEO_SCHEDULER_INTERNAL_ERROR",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Lỗi trình điều phối video nhưng có thể xuất phát từ việc swap bộ nhớ đồ họa xuống ổ cứng bị tắc nghẽn hoặc trễ quá mức (I/O stall)."
  },
  {
    "category": "BSOD Windows",
    "code": "0x00000139",
    "name": "KERNEL_SECURITY_CHECK_FAILURE",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Kiểm tra tính toàn vẹn dữ liệu kernel bị thất bại do tệp hệ thống trên ổ đĩa bị suy thoái. Chạy sfc /scannow và kiểm tra lỗi ổ cứng."
  },
  {
    "category": "Device Manager",
    "code": "Code 14",
    "name": "Device requires restart (Code 14)",
    "drive_type": "HDD & SSD",
    "severity": "Thấp",
    "solution": "Thiết bị ổ lưu trữ yêu cầu khởi động lại máy để hoàn tất cài đặt cấu hình hoặc driver. Khởi động lại hệ điều hành Windows."
  },
  {
    "category": "Device Manager",
    "code": "Code 24",
    "name": "Device not present or problem (Code 24)",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Thiết bị ổ cứng đang được cài đặt không đúng cách hoặc bị tháo đột ngột. Gỡ thiết bị trong Device Manager và quét dò lại phần cứng."
  },
  {
    "category": "Device Manager",
    "code": "Code 32",
    "name": "Driver service disabled (Code 32)",
    "drive_type": "HDD & SSD",
    "severity": "Trung bình",
    "solution": "Dịch vụ driver điều khiển ổ cứng bị vô hiệu hóa trong registry hệ thống. Kích hoạt lại service lưu trữ tương ứng trong Windows Services."
  },
  {
    "category": "Device Manager",
    "code": "Code 39",
    "name": "Driver corrupt or missing (Code 39)",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Tệp tin driver của controller ổ đĩa bị hỏng hoặc thiếu thư viện liên kết. Cài lại driver chipset/controller từ trang chủ nhà sản xuất."
  },
  {
    "category": "Device Manager",
    "code": "VDS Error 0x80042405",
    "name": "VDS Error - Partition Clean Failed",
    "drive_type": "HDD & SSD",
    "severity": "Rất cao",
    "solution": "Lệnh diskpart clean thất bại do ổ cứng bị khóa bảo vệ ghi hoặc chip nhớ flash SSD hỏng. Thử chạy lại quyền Admin hoặc thay ổ."
  },
  {
    "category": "Device Manager",
    "code": "Setup Error 0x80300024",
    "name": "Windows cannot be installed to disk",
    "drive_type": "HDD & SSD",
    "severity": "Cao",
    "solution": "Trình cài đặt Windows không thể tạo phân vùng hệ thống do sai chuẩn GPT/MBR hoặc có nhiều ổ đĩa gây xung đột. Ngắt các ổ phụ khi cài."
  }
];
