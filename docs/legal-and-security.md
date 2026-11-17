# Đánh giá Rủi ro Pháp lý và An ninh Mạng

Tài liệu này giải đáp cụ thể các câu hỏi liên quan đến tính hợp pháp, chính sách của Microsoft và rủi ro an toàn thông tin khi cài đặt/tối ưu Windows 11 không qua đường chính thống.

---

## 1. Rủi ro pháp lý

### Đối với người dùng cá nhân (Gia đình, học sinh, sinh viên, nghiên cứu):
* **Rủi ro gần như bằng 0:**
  * Microsoft cho phép tải trực tiếp file ISO Windows 11 từ trang chủ hoàn toàn miễn phí.
  * Khi cài đặt mà không nhập Product Key hoặc không kích hoạt (Active), Windows chuyển sang trạng thái "Unactivated Grace Period". Bạn chỉ bị giới hạn một số tính năng như đổi hình nền, chủ đề (Personalization) và xuất hiện dòng watermark ở góc màn hình.
  * Việc sử dụng lệnh `slmgr /rearm` là một tính năng chính thức tích hợp sẵn trong hệ điều hành của Microsoft dành cho mục đích dùng thử/đánh giá lại hệ thống.
  * Microsoft chưa từng có tiền lệ khởi kiện hay xử phạt hành chính người dùng cá nhân vì sử dụng Windows chưa kích hoạt hoặc cài đặt trên phần cứng không đạt chuẩn.

### Đối với doanh nghiệp, văn phòng, tổ chức thương mại:
* **Rủi ro rất cao (Bắt buộc phải tuân thủ bản quyền):**
  * Theo Luật Sở hữu trí tuệ tại Việt Nam và thỏa thuận cấp phép người dùng cuối (EULA) của Microsoft, các pháp nhân kinh doanh sử dụng phần mềm không có bản quyền hợp lệ (Commercial License) sẽ bị:
    - Xử phạt vi phạm hành chính với số tiền lớn.
    - Buộc truy thu và bồi thường chi phí mua giấy phép phần mềm.
    - Ảnh hưởng nghiêm trọng đến uy tín của doanh nghiệp nếu có đoàn thanh tra liên ngành (Bộ Thông tin Truyền thông, Cục Cảnh sát Phòng chống tội phạm công nghệ cao) hoặc BSA kiểm tra.

---

## 2. Rủi ro an ninh mạng & kỹ thuật

### Nguy cơ từ các công cụ Crack/Kích hoạt trôi nổi:
* **Cảnh báo nghiêm trọng:** Tránh xa các file `.exe` kích hoạt lậu trôi nổi trên internet (như các bản KMSPico không rõ nguồn gốc, file patch, crack).
* Các công cụ này thường đính kèm:
  - **Trojan/Info-stealer:** Tự động lấy cắp tài khoản trình duyệt (Google, Facebook), mật khẩu, cookie phiên đăng nhập và ví tiền điện tử.
  - **Botnet/Backdoor:** Biến máy tính của bạn thành một node cho các cuộc tấn công DDoS hoặc máy đào tiền ảo ngầm, làm CPU/RAM máy yếu càng thêm kiệt quệ.

### Cập nhật hệ thống (Windows Update):
* Khi cài đặt Windows 11 trên CPU/TPM không hỗ trợ:
  - Máy vẫn nhận được các bản vá bảo mật nhỏ định kỳ hàng tháng (Cumulative Updates).
  - Tuy nhiên, với các bản cập nhật tính năng lớn hàng năm (Feature Updates, ví dụ từ 23H2 lên 24H2), Microsoft có thể chặn cập nhật tự động. Khi đó người dùng cần nâng cấp thủ công bằng file ISO hoặc USB Rufus mới.
