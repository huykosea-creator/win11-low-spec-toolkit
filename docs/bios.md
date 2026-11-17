# Cẩm Nang BIOS: IDE vs AHCI, Legacy vs UEFI, MBR vs GPT

Tài liệu tóm gọn bản chất 3 thành phần cấu hình phần cứng cốt lõi trong BIOS/UEFI, cách ghép cặp chuẩn và các lỗi thường gặp khi cài đặt Windows.

---

## 1. Bản chất 3 thành phần cốt lõi

### 🔹 1. Giao tiếp ổ cứng (SATA Mode): IDE vs AHCI
* **IDE:** Chuẩn cổ xưa (thời Win XP trở về trước, cáp dẹp). Tốc độ rất chậm, không tận dụng được tốc độ SSD/HDD mới.
* **AHCI:** Chuẩn hiện đại (Windows 7/8/10/11). Hỗ trợ NCQ (xử lý đa tác vụ đọc/ghi) và Hot-plug. **Bắt buộc bật cho SSD SATA.**
> **👉 Quy tắc:** Luôn chọn **AHCI** (hoặc NVMe). Chỉ chọn IDE khi vọc máy đồ cổ/Win XP thiếu driver SATA.

### 🔹 2. Chuẩn khởi động (Boot Mode): Legacy vs UEFI
* **Legacy (BIOS cũ / CSM):** Giao diện chữ trắng nền xanh, chỉ dùng phím, khởi động chậm, bảo mật thấp.
* **UEFI:** Chuẩn mới thay thế Legacy. Giao diện đồ họa, hỗ trợ chuột, khởi động siêu nhanh (Fast Boot), tích hợp **Secure Boot** (tiêu chuẩn của Win 11).

### 🔹 3. Định dạng ổ đĩa (Partition Scheme): MBR vs GPT
* **MBR:** Chuẩn cũ, giới hạn ổ cứng tối đa **2TB** và chỉ tạo được tối đa **4 phân vùng chính (Primary)**.
* **GPT:** Chuẩn mới, hỗ trợ dung lượng cực lớn (hàng triệu TB), tạo phân vùng thoải mái, độ bền dữ liệu cao.

---

## 2. Bảng ghép cặp chuẩn chỉ ("Thằng nào đi với thằng nào?")

| Chuẩn Boot (BIOS) | Định dạng ổ cứng | Chế độ SATA | Trường hợp áp dụng |
| :--- | :--- | :--- | :--- |
| **UEFI** | **GPT** | **AHCI / NVMe** | ⭐️ **CHUẨN VÀNG HIỆN ĐẠI:** Bắt buộc cho Windows 11, khuyên dùng cho Windows 10 & máy dùng SSD. Khởi động nhanh nhất. |
| **Legacy (CSM)** | **MBR** | **AHCI** | **CHUẨN CŨ:** Phù hợp máy đời cũ từ thời Windows 7 trở về trước, hoặc mainboard không có UEFI. |
| **Legacy (CSM)** | **MBR** | **IDE** | **CHUẨN ĐỒ CỔ:** Dành riêng cho Windows XP hoặc mainboard những năm 2005 - 2008. |

---

## 3. ⚠️ 2 Lỗi "kinh điển" kỹ thuật cần tránh

### ❌ Lỗi 1: Màn hình xanh `Inaccessible Boot Device` (Mã `0x0000007B`)
* **Nguyên nhân:** Windows được cài ở chế độ AHCI nhưng vào BIOS lại đổi sang IDE (hoặc ngược lại). Windows bị thiếu driver giao tiếp khi load boot.
* **Cách khắc phục:** Vào lại BIOS chỉnh lại đúng chuẩn SATA lúc cài ban đầu.

### ❌ Lỗi 2: Không boot được vào ổ cứng (`No bootable device found`)
* **Nguyên nhân:** Lệch chuẩn giữa BIOS và định dạng ổ cứng:
  * Ổ đĩa format chuẩn **GPT** nhưng BIOS lại bật **Legacy Only**.
  * Ổ đĩa format chuẩn **MBR** nhưng BIOS lại bật **UEFI Only**.
* **Cách khắc phục:** 
  * Chỉnh lại BIOS cho khớp với định dạng ổ đĩa (hoặc bật chế độ lai **UEFI + Legacy / CSM Support**).
  * Hoặc convert ổ đĩa sang chuẩn phù hợp (`mbr2gpt` hoặc diskpart clean chuyển GPT).
