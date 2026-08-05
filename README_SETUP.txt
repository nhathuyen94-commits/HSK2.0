# UZHOU Hán Ngữ — bản chuẩn bị đăng web

## Đã có
- Giữ nguyên website HTML + thư mục audio hiện tại.
- Thêm khung đăng nhập Supabase.
- Thêm dashboard học viên.
- Thêm mô hình khóa học HSK1–HSK4.
- Thêm schema database `supabase/schema.sql`.
- Thêm khung trang Admin.
- Không chứa Supabase service_role key.

## Việc cần làm trước khi chạy
1. Tạo project Supabase.
2. Vào SQL Editor và chạy `supabase/schema.sql`.
3. Tạo file `supabase-config.js` từ `supabase-config.example.js`.
4. Điền Project URL và anon/publishable key.
5. Deploy toàn bộ thư mục `github-deploy` lên Netlify/GitHub.

## Lưu ý quan trọng
Bản này là bộ khung an toàn để bắt đầu. Chưa bật policy cho admin sửa quyền học viên vì cần xác định chính xác tài khoản admin đầu tiên.
Không đưa service_role key lên HTML/JavaScript phía trình duyệt.


## Quy tắc miễn phí đã thêm
- Bài 01–05 của mỗi cấp có nội dung được đánh dấu 🎁 MIỄN PHÍ.
- Khách chưa đăng nhập vẫn có thể mở 5 bài đầu.
- Từ bài 06 trở đi, website yêu cầu đăng nhập.
- Sau khi kết nối Supabase hoàn chỉnh, bài 06+ sẽ tiếp tục được kiểm tra quyền khóa học.


## Quy tắc bài học
- Bài 1-5: miễn phí.
- Bài 6 trở đi: cần tài khoản đã được cấp khóa tương ứng trong `user_courses`.
- Ví dụ: user có `course_id = hsk3` thì được mở Bài 6-20 HSK3.
- Nếu chưa được cấp HSK3, hệ thống chặn trước khi mở bài trả phí.
- Khi `expires_at` hết hạn, quyền cũng tự động bị chặn.
- Không đưa `service_role` key vào frontend.


## Trang Admin
Đăng nhập bằng tài khoản có profiles.role = admin và mở /admin/. Nhập email học viên, chọn HSK, chọn ngày hết hạn hoặc bỏ trống, rồi bấm Cấp quyền. Có thể thu hồi từ danh sách.
