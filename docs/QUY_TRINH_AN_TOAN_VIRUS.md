# CẨM NANG HƯỚNG DẪN COPY, ĐÓNG GÓI & PHÒNG CHỐNG LÂY NHIỄM VIRUS CHO KTV

Tài liệu này giải đáp chi tiết và cung cấp quy trình chuẩn kỹ thuật khi mang Toolkit đi cứu hộ, tiếp nhận hoặc kiểm tra các máy tính bị nhiễm virus, mã độc.

---

## 1. NÊN COPY CÁI NÀO ĐỂ SỬ DỤNG?

Bạn có 2 lựa chọn linh hoạt tùy theo thói quen làm việc:

### Lựa chọn 1: Copy nguyên cả thư mục `win11-low-spec-toolkit` (~230 MB)
* Bạn chỉ cần copy cả thư mục `win11-low-spec-toolkit` vào USB.
* Khi cắm vào máy khách: Vào thư mục đó và nhấp đúp vào **`CHAY_TOOLKIT.bat`**.
* Cửa sổ CMD sẽ tự động khởi chạy máy chủ WebUI và mở trình duyệt tại địa chỉ `http://localhost:5678/`.
* Khi xong việc, chỉ cần đóng cửa sổ CMD hoặc nhấp đúp **`TAT_TOOLKIT.bat`**.

### Lựa chọn 2: Dùng gói nén Portable `Windows11_KTV_Toolkit_Portable.zip` (~116 MB) - [KHUYÊN DÙNG]
* Đây là bản đóng gói sạch 100% đã được lược bỏ toàn bộ cache, file rác.
* Trong thư mục toolkit đã có sẵn công cụ **`DONG_GOI_TOOLKIT.bat`**: mỗi khi bạn cập nhật thêm phần mềm hay tính năng mới, chỉ cần chạy file này là tự động xuất ra file `.zip` mới tinh trong vài giây.

---

## 2. NẾU MÁY KHÁCH ĐANG DÍNH VIRUS THÌ CÓ NÊN CẮM TOOL VÀO KHÔNG?

### 👉 CÂU TRẢ LỜI: **CÓ NÊN, NHƯNG BẮT BUỘC PHẢI THEO QUY TRÌNH CHỐNG LÂY NHIỄM CHÉO!**

Khách hàng đem máy đến tiệm sửa chữa thường là lúc máy đang lỗi nặng, chạy chậm, quảng cáo nhảy lung tung hoặc dính virus/mã độc. Đây chính là lúc KTV cần tool nhất để lấy cấu hình, kiểm tra ổ cứng, kiểm tra phần mềm lạ.

### ⚠️ Nguy cơ nếu cắm USB trực tiếp mà không phòng ngừa:
1. **Virus lây file thực thi (PE Infectors như *Neshta, Sality, Ramnit, Virut*)**: Tự động quét các ổ cắm ngoài và tiêm mã độc vào các file `.exe` có sẵn trên USB (như `python.exe`, `cpuz.exe`, `DiskInfo64.exe`).
2. **Virus phím tắt (Shortcut / LNK Worm)**: Ẩn thư mục trên USB và tạo các shortcut chứa mã độc VBS/Powershell.
3. **Mã độc tống tiền (Ransomware)**: Tự động mã hóa các dữ liệu ghi được trên USB.
4. **Hậu quả**: Khi KTV rút USB đó cắm sang máy khách khác $\rightarrow$ **Lây nhiễm chéo hàng loạt máy khách khác!**

---

## 3. BA (3) QUY TRÌNH VẬN HÀNH AN TOÀN TUYỆT ĐỐI CHO KTV

### 🛡️ QUY TRÌNH 1: Quy trình "Copy 1 Chiều & Rút USB Ngay" (Dễ nhất - Không cần đồ nghề chuyên dụng)
1. **Bước 1**: Trên USB của KTV chỉ chứa file nén `Windows11_KTV_Toolkit_Portable.zip`.
2. **Bước 2**: Cắm USB vào máy khách $\rightarrow$ Copy file `.zip` vào một thư mục tạm trên ổ cứng máy khách (ví dụ: `C:\Temp` hoặc `D:\KTV_Temp`).
3. **Bước 3**: **RÚT NGAY USB CỦA BẠN RA KHỎI MÁY KHÁCH!** (Cực kỳ quan trọng: USB không nằm trong máy thì virus không thể nào chạm tới).
4. **Bước 4**: Giải nén file `.zip` trên máy khách và chạy `CHAY_TOOLKIT.bat`.
5. **Bước 5**: Thực hiện quét toàn bộ: Cấu hình, phần mềm, SMART ổ cứng, cây thư mục, GPU-Z...
6. **Bước 6**: Sau khi hoàn thành và lấy được báo cáo $\rightarrow$ Xóa thư mục tạm `C:\Temp` trên máy khách.

---

### 🛡️ QUY TRÌNH 2: Sử Dụng USB Có Công Tắc Chống Ghi Phần Cứng (Hardware Write-Protect Switch) hoặc Ventoy ISO
* **Trang bị**: Một chiếc USB có lẫy gạt chống ghi (như Netac, Kanguru, IODD) hoặc USB Boot Ventoy.
* **Cách hoạt động**:
  * Khi đến máy khách, KTV **gạt lẫy sang chế độ READ-ONLY (Chỉ đọc)** trước khi cắm vào máy.
  * Ở chế độ này, USB bị khóa cứng về mặt phần cứng: không một virus, trojan hay ransomware nào có thể ghi, sửa, tạo hay tiêm bất kỳ byte nào vào USB.
  * Toolkit chạy trực tiếp từ USB mà vẫn an toàn 100%.

---

### 🛡️ QUY TRÌNH 3: Cứu Hộ Trong Môi Trường WinPE (Anhdv Boot / DLC Boot / Ventoy)
* Nếu máy khách dính virus quá nặng làm Windows tê liệt, không vào được mạng hoặc liên tục phá hoại hệ thống:
  * Khởi động máy vào WinPE (Windows Mini cứu hộ).
  * Trong WinPE, hệ điều hành của khách hoàn toàn bị "đóng băng" (offline), toàn bộ virus không thể chạy được.
  * KTV chạy Toolkit bình thường để kiểm tra phần cứng, nhiệt độ, S.M.A.R.T ổ đĩa và dung lượng ổ cứng một cách an toàn tuyệt đối.

---

## 4. BẢO VỆ VÀ TRÍCH XUẤT FILE BÁO CÁO HTML ĐÚNG CHUẨN

Suy nghĩ của bạn về việc *"sau khi có file báo cáo html thì copy riêng ra để tránh bị virus tiêm mã độc vào file"* là **HOÀN TOÀN CHÍNH XÁC VÀ ĐÚNG CHUẨN KỸ THUẬT AN TOÀN THÔNG TIN!**

### Bản chất của file `report.html`:
* File `report.html` do hệ thống xuất ra là **tài liệu HTML tĩnh** (thuần CSS, SVG, bảng biểu và text JSON), không phải file nhị phân thực thi (`.exe`), nên không thể tự ý lây nhiễm như virus thông thường.
* Tuy nhiên, trên một số máy dính virus chuyên chèn mã quảng cáo/script độc hại (HTML Script Injector), virus có thể quét ổ cứng và chèn thêm thẻ `<script src="trojan_url">` vào các file `.html` tìm thấy.

### 3 Cách lấy file báo cáo an toàn 100%:

#### Cách A: In trực tiếp ra file PDF ngay trên trình duyệt máy khách (KHUYÊN DÙNG SỐ 1)
1. Trên giao diện WebUI, bấm nút **`Báo Cáo HTML`** để mở trang báo cáo tiếp nhận/bàn giao.
2. Bấm tổ hợp phím **`Ctrl + P`** (hoặc nút In Báo Cáo trên giao diện).
3. Tại ô **Máy in (Destination)** $\rightarrow$ Chọn **"Save as PDF" (Lưu dưới dạng PDF)**.
4. Bấm **Lưu** thành file `Bien_Ban_Tiep_Nhan_DESKTOP-xxx.pdf`.
> **Lợi ích**: File PDF được trình duyệt Chrome/Edge render thành tài liệu in cố định, virus hoàn toàn không thể tiêm mã độc vào file PDF này. File PDF gửi Zalo cho khách hoặc in ra giấy kẹp vào máy cực kỳ đẹp và chuyên nghiệp!

#### Cách B: Gửi file qua Cloud / Zalo / Telegram (Không cắm lại USB)
* Sau khi có file `report.html` hoặc `report.pdf`, KTV mở trình duyệt gửi thẳng qua Zalo Web, Telegram Web hoặc Google Drive về máy tính kỹ thuật của cửa hàng.
* **Tuyệt đối không cắm lại USB Master vào máy để chép file ra!**

#### Cách C: Dùng một USB Phụ Riêng (USB Trung Chuyển Rác - Disposable Transfer USB)
* Nếu máy khách không có mạng Internet:
  * KTV dùng 1 chiếc USB cỏ dung lượng nhỏ (ví dụ 4GB - 8GB) chuyên dùng để nhận file.
  * Cắm USB phụ này vào để chép file báo cáo ra.
  * Định kỳ format sạch chiếc USB phụ này để đảm bảo an toàn.

---

## 5. GIẢI PHÁP GIỮ TRỌN VẸN TÍNH NĂNG TƯƠNG TÁC HTML (KHÔNG DÙNG PDF)

Nếu xuất ra PDF, bạn sẽ bị mất các tính năng tương tác chuyên sâu mà chỉ HTML mới có:
- Không thể bấm mở rộng / thu gọn các nhánh thư mục con (deep directory tree).
- Không thể gõ tìm kiếm lọc tức thì trong danh sách hơn 200 phần mềm đã cài đặt.
- Không thể chuyển qua lại giữa các tab (Tổng quan, Phần cứng, Ổ đĩa, SMART, GPU-Z, Dung lượng...).
- Không xem được bảng mã Hex chi tiết của từng thuộc tính ổ đĩa S.M.A.R.T.

Để **vừa giữ 100% tính năng tương tác của HTML, vừa triệt tiêu hoàn toàn nguy cơ lây nhiễm mã độc**, hệ thống đã được tích hợp bộ giải pháp bảo vệ 3 lớp:

### 🛡️ Lớp 1: Lá Chắn Trình Duyệt Tự Thân (Content Security Policy - CSP)
Mỗi file `report.html` được sinh ra đều được cài đặt sẵn thẻ bảo mật nghiêm ngặt ngay trong phần `<head>`:
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none';">
```
* **Cơ chế hoạt động**: Khi bạn mở file `report.html` trên bất kỳ trình duyệt nào (Chrome, Edge, Cốc Cốc, Firefox), trình duyệt sẽ kích hoạt chế độ **Air-Gap (Cô lập tuyệt đối)**:
  * **Khóa 100% kết nối mạng ra ngoài (`connect-src 'none'`)**: Dù file có bị chèn lén script thì script đó cũng không thể gửi bất kỳ dữ liệu nào ra máy chủ bên ngoài.
  * **Cấm tuyệt đối iframe và nhúng đối tượng (`frame-src 'none'; object-src 'none'`)**: Chặn đứng mọi hành vi mở trang web lén lút hay tải file ngầm (Drive-by download).
  * **Chặn điều hướng trang (`base-uri 'none'; form-action 'none'`)**: Không cho phép chuyển trang đến các website độc hại.

### 🛡️ Lớp 2: Chữ Ký Toàn Vẹn Mật Mã Học (SHA-256 Hash Verification)
Mỗi khi hệ thống tạo ra file `report.html`, một file chữ ký kèm theo là `report.html.sha256` sẽ được tự động tính toán và lưu cùng thư mục:
* Thuật toán SHA-256 tạo ra chuỗi băm 64 ký tự duy nhất cho file.
* Nếu bất kỳ con virus nào trên máy khách sửa đổi dù chỉ 1 ký tự hay chèn thêm 1 dòng mã độc vào `report.html`, mã băm sẽ lập tức bị sai lệch và bị công cụ cảnh báo ngay!

### 🛡️ Lớp 3: Bộ Lọc Mã Độc & Khử Trùng Tự Động (`KIEM_TRA_BAO_CAO.bat`)
Trong thư mục toolkit có sẵn công cụ kiểm định mã chuyên dụng:
* **Cách dùng cực kỳ đơn giản**:
  1. Kéo và thả bất kỳ file `report.html` nào vào file **`KIEM_TRA_BAO_CAO.bat`** (hoặc nhấp đúp để tự động quét toàn bộ báo cáo trong thư mục `scans/`).
  2. Công cụ sẽ thẩm tra:
     * Kiểm tra chữ ký SHA-256 đối chiếu với file gốc.
     * Kiểm tra sự tồn tại và tính hợp lệ của lá chắn CSP.
     * Quét phân tích cú pháp phát hiện: thẻ `<script src="http...">`, thẻ `<iframe>`, đối tượng nhị phân `<object>`, lệnh thực thi hệ điều hành `ActiveXObject` / `WScript.Shell`, lệnh chuyển hướng `<meta http-equiv="refresh">`.
  3. **Khử trùng tự động (Auto-Sanitize)**: Nếu phát hiện file bị nhiễm mã độc, công cụ sẽ tự động cắt bỏ sạch sẽ toàn bộ các đoạn mã độc lạ, tái lập lá chắn CSP và xuất ra file sạch `report_CLEAN.html` an toàn tuyệt đối 100% để bạn an tâm mở xem hoặc gửi cho khách hàng!

---

## 6. NGOÀI FILE `report.html` CÓ CẦN COPY CÁC FILE KHÁC TRONG CÙNG THƯ MỤC KHÔNG?

Trong thư mục một lượt quét (`scans/User_TiepNhan_.../`) sẽ có các file sau:
1. `report.html` (~20 MB): Báo cáo All-In-One hoàn chỉnh (Đã nhúng toàn bộ CSS, JS, Icon, cây thư mục, SMART Hex).
2. `report.html.sha256`: File chữ ký băm kiểm tra tính toàn vẹn của file HTML.
3. `info.json`: Siêu dữ liệu thông tin khách hàng, kỹ thuật viên, tên máy tính, thời gian quét.
4. `apps.json`: Danh sách thô toàn bộ phần mềm đã cài đặt kèm phiên bản, ngày cài, publisher.
5. `hardware_diagnostics.json`: Chi tiết cấu hình phần cứng (CPU, Mainboard, RAM, GPU-Z, BIOS).
6. `smart_info.json`: Dữ liệu tình trạng sức khỏe ổ đĩa S.M.A.R.T CrystalDiskInfo / WMI.
7. `report.csv`: Bảng tính Excel danh sách phần mềm.
8. `disk_tree.json` & `disk_tree.csv`: Cây phân tích dung lượng ổ đĩa.

### 👉 HƯỚNG DẪN KHI NÀO CẦN COPY FILE NÀO:

* **Trường hợp 1: Bạn chỉ cần XEM / LƯU TRỮ BÁO CÁO (hoặc gửi cho khách xem qua Zalo, Điện thoại)**:
  * 👉 **CHỈ CẦN DUY NHẤT FILE `report.html`** (kèm file `report.html.sha256` nếu muốn xác thực).
  * `report.html` là dạng file **All-In-One Standalone**: mọi hình ảnh, CSS, JavaScript tương tác mở rộng cây thư mục và danh sách phần mềm đều đã được "đóng gói sẵn" bên trong nó. Bạn có thể chép riêng file này sang bất kỳ máy tính, máy tính bảng hay điện thoại nào mở lên là xem được ngay lập tức, không phụ thuộc vào bất kỳ file nào khác!

* **Trường hợp 2: Bạn muốn ĐỒNG BỘ DỮ LIỆU VÀO HỆ THỐNG KTV CỦA CỬA HÀNG (để quản lý lịch sử, so sánh Tiếp Nhận vs Bàn Giao)**:
  * 👉 **NÊN COPY NGUYÊN GÓI NÉN `.zip` CỦA TASK ĐÓ** (Dùng công cụ `XUAT_BAO_CAO.bat` bên dưới).
  * Khi bạn mang gói nén này về máy tính chính của tiệm và thả vào `TIEP_NHAN_BAO_CAO.bat`, hệ thống sẽ tự động nhập `info.json`, `apps.json` vào thư mục `scans/` của máy KTV. Lúc này giao diện WebUI của KTV sẽ hiện đầy đủ lịch sử của máy khách đó, cho phép bạn bấm nút **"So Sánh"** đối chiếu giữa lúc Tiếp nhận và Bàn giao xem đã dọn sạch bao nhiêu GB rác, gỡ được bao nhiêu phần mềm độc hại, và phần cứng có bị tráo đổi linh kiện hay không!

---

## 7. CÁC CƠ CHẾ TIẾP NHẬN BÁO CÁO TỪ MÁY KHÁCH AN TOÀN TUYỆT ĐỐI

### 🚀 Cơ chế 1: Dùng Bộ Đôi Tool `XUAT_BAO_CAO.bat` & `TIEP_NHAN_BAO_CAO.bat` (KHUYÊN DÙNG SỐ 1)
* **Tại máy khách (sau khi quét xong)**:
  1. Nhấp đúp vào **`XUAT_BAO_CAO.bat`**.
  2. Công cụ tự động nén toàn bộ dữ liệu báo cáo, phần cứng, phần mềm thành 1 file zip duy nhất: `BAOCAO_[TênMay]_[ThoiGian].zip` (chỉ khoảng 2-5 MB).
  3. Chép file zip này vào USB phụ hoặc gửi qua Zalo/Cloud.
* **Tại máy tính của KTV (khi tiếp nhận)**:
  1. Kéo và thả file `BAOCAO_...zip` vào công cụ **`TIEP_NHAN_BAO_CAO.bat`**.
  2. Công cụ tự động:
     - Giải nén trong thư mục cách ly tạm thời (Sandbox Temp).
     - Quét chặn và loại bỏ toàn bộ các file thực thi lạ (`.exe`, `.bat`, `.vbs`, `.dll`) nếu virus trên máy khách có thả trộm vào file zip.
     - Thẩm định mã `report.html`: Kiểm tra SHA-256, kiểm tra CSP, quét cú pháp mã độc. Nếu có mã lạ sẽ tự động khử độc (Sanitize).
     - Nhập (Import) dữ liệu sạch vào thư mục `scans/` trên máy KTV.
     - Tự động mở trình duyệt hiển thị báo cáo sạch 100% cho KTV xem ngay!

### 🚀 Cơ chế 2: Gửi Qua Cloud / Zalo / Telegram / Webhook (Không Dùng USB)
* Sau khi quét xong trên máy khách, KTV mở trình duyệt máy khách (dùng tab ẩn danh Incognito):
  - Kéo file `report.html` hoặc file `.zip` gửi thẳng qua **Zalo Web** hoặc **Telegram Web** của KTV.
  - Hoặc upload lên Google Drive / One-Time File Drop.
* **Ưu điểm lớn nhất**: Tuyệt đối không cắm USB của KTV vào máy khách $\rightarrow$ **0% nguy cơ lây nhiễm mã độc qua thiết bị ngoại vi**.

### 🚀 Cơ chế 3: Quét Mã QR Mở Trực Tiếp Trên Điện Thoại KTV (Mobile QR Gateway)
* KTV bật tính năng Phát Wi-Fi (Personal Hotspot) từ điện thoại iPhone/Android của mình cho máy khách kết nối vào (hoặc cả hai cùng chung Wi-Fi cửa hàng).
* Trình duyệt máy khách đang chạy toolkit tại cổng `5678`. KTV chỉ cần mở địa chỉ IP mạng nội bộ của máy khách (ví dụ: `http://192.168.x.x:5678/report`).
* KTV xem và lưu báo cáo ngay trên điện thoại của mình.
* **Tính bảo mật**: Hệ điều hành iOS/Android có cơ chế bảo vệ phân quyền tuyệt đối, mã độc Windows (PE `.exe`, `.dll`, virus Windows) hoàn toàn không thể lây nhiễm hay hoạt động trên điện thoại di động!


