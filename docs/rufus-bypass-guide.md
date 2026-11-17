# Hướng dẫn tạo USB cài Windows 11 Bypass TPM, CPU và RAM

Tài liệu này hướng dẫn cách tạo USB cài đặt Windows 11 có thể cài đặt được trên mọi máy tính cũ, không có chip bảo mật TPM 2.0, không hỗ trợ Secure Boot hoặc có dung lượng RAM dưới 4GB.

---

## 1. Chuẩn bị

1. **USB dung lượng tối thiểu 8GB** (Lưu ý: Dữ liệu trên USB sẽ bị xóa sạch khi tạo bộ cài).
2. **File ISO Windows 11 gốc:** Tải trực tiếp từ [Microsoft Windows 11 Download](https://www.microsoft.com/software-download/windows11).
3. **Phần mềm Rufus:** Tải bản Portable mới nhất từ [rufus.ie](https://rufus.ie).

---

## 2. Các bước thực hiện bằng Rufus

1. Cắm USB vào máy tính và mở file `rufus.exe`.
2. Tại mục **Device**, chọn đúng USB của bạn.
3. Tại mục **Boot selection**, nhấn **SELECT** và trỏ đến file ISO Windows 11 vừa tải.
4. Tại mục **Partition scheme**:
   - Chọn **GPT** nếu máy tính hỗ trợ UEFI (đa số máy từ năm 2013 trở lại đây).
   - Chọn **MBR** nếu máy quá cũ chỉ hỗ trợ BIOS chuẩn Legacy.
5. Nhấn nút **START** ở góc dưới.
6. Hộp thoại **Windows User Experience** sẽ xuất hiện, hãy đánh dấu chọn các mục sau:
   - ✅ **Remove requirement for 4GB+ RAM, Secure Boot and TPM 2.0**: Vượt qua rào cản phần cứng.
   - ✅ **Remove requirement for an online Microsoft account**: Cho phép tạo tài khoản Local (offline), giúp máy nhẹ hơn và không phải kết nối mạng trong quá trình cài đặt ban đầu.
   - *(Tùy chọn)* ✅ **Disable data collection (Skip privacy questions)**: Tắt bớt các câu hỏi quyền riêng tư/telemetry.
7. Nhấn **OK** và chờ Rufus ghi dữ liệu vào USB (khoảng 10 - 20 phút tùy tốc độ USB).

---

## 3. Cài đặt vào máy

1. Khởi động lại máy cần cài đặt, nhấn phím chọn Boot Menu (F12, F11, F9, hoặc Esc tùy dòng máy: Dell, HP, Asus, Lenovo...).
2. Chọn khởi động từ USB.
3. Tiến hành các bước cài đặt Windows bình thường. Hệ thống sẽ không hiển thị thông báo "This PC can't run Windows 11" nữa.
