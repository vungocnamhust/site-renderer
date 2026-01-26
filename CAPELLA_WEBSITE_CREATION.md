# Hướng dẫn tạo website CapellaTravel.com (AsiaTours Theme)

Tài liệu này mô tả quy trình tạo website **CapellaTravel.com** sử dụng **Capella Modular Web Engine** với giao diện (theme) **AsiaTours** đã được tích hợp sẵn.

## 1. Tổng quan kiến trúc

Website CapellaTravel.com sẽ được vận hành như một **Tenant** mới trong hệ thống.
- **Engine**: Capella Modular Web Engine (Next.js + Payload CMS).
- **Theme/Module**: `AsiaToursTravelWeb` (Module đã clone từ asiatours.com).
- **Cơ chế**: Dữ liệu cấu hình (Logo, Banner, Tours) được lưu độc lập trong Payload CMS, giao diện được render bởi module dùng chung.

---

## 2. Các bước thực hiện

### Bước 1: Truy cập Admin CMS
1. Truy cập vào trang quản trị (Local: `http://localhost:3000/admin`).
2. Đăng nhập bằng tài khoản Administrator.

### Bước 2: Tạo Tenant "Capella Travel"
1. Trong menu bên trái, chọn collection **Tenants**.
2. Bấm nút **Create New**.
3. Điền thông tin cơ bản:
   - **Name**: `Capella Travel`
   - **Subdomain**: `capella` (cho môi trường dev) hoặc `www` (nếu map domain chính).
   - **Domain**: `capellatravel.com` (Dùng cho production routing).
   - **Template**: Chọn **Asia Tours Travel Website**.
     * *Lưu ý: Đây là bước quan trọng nhất để kích hoạt theme AsiaTours.*

### Bước 3: Cấu hình Giao diện (Theme Config)
Sau khi chọn Template, các trường cấu hình riêng cho theme AsiaTours sẽ xuất hiện. Cần điền đầy đủ:

#### A. Site Settings
- **Site Name**: `Capella Travel`
- **Logo**: Upload file logo của Capella Travel (SVG hoặc PNG transparent).
- **Contact Email**: `info@capellatravel.com`
- **Contact Phone**: Số hotline của Capella.

#### B. Hero Section (Banner trang chủ)
- **Background Image**: Chọn ảnh chất lượng cao (1920x1080) thể hiện phong cách Capella (ví dụ: Vịnh Hạ Long, Hội An luxury).
- **Title**: *Ví dụ:* "Experience the Essence of Vietnam"
- **Subtitle**: *Ví dụ:* "Luxury bespoke travel experiences curated just for you."

#### C. Footer
- **About Text**: Đoạn giới thiệu ngắn về Capella Travel.
- **Copyright**: "© 2026 Capella Travel. All rights reserved."

### Bước 4: Tạo và Gán Nội dung (Content)

Hệ thống sử dụng cơ chế **Shared Collections** (Tours, Blogs) có phân quyền theo Tenant.

#### A. Tạo Tours
1. Vào collection **Tours**.
2. Bấm **Create New**.
3. Điền thông tin Tour (Title, Itinerary, Images...).
4. **Quan trọng**: Tại trường **Tenant**, chọn `Capella Travel`.
   * *Điều này đảm bảo Tour thuộc về site Capella.*
5. Bấm **Save**.

#### B. Chọn Tours hiển thị trang chủ (Featured)
1. Quay lại Tenant **Capella Travel**.
2. Tìm mục **Featured Tours**.
3. Add các Tour vừa tạo ở bước trên vào list này.
4. Bấm **Save**.

---

## 3. Kiểm tra hiển thị (Verification)

Sau khi lưu cấu hình, truy cập website để kiểm tra:

- **Môi trường Local**: `http://capella.localhost:3000`
- **Môi trường Production**: `https://capellatravel.com`

**Checklist kiểm tra:**
- [ ] **Logo**: Hiển thị đúng logo Capella ở Header.
- **Màu sắc**: Giao diện giữ nguyên layout AsiaTours (vàng/đen chủ đạo hoặc theo CSS module).
- **Nội dung**:
  - Hero banner đúng ảnh và text đã nhập.
  - Danh sách Featured Tours hiển thị đúng các tour đã chọn.
  - Footer thông tin chính xác.

---

## 4. Ghi chú Kỹ thuật (Cho Developer)

Nếu cần tùy biến sâu hơn (CSS, Layout) riêng cho Capella mà không muốn ảnh hưởng module gốc:

1. **Option 1 (Config):** Nếu chỉ đổi màu sắc, update file `schema.ts` của module `AsiaToursTravelWeb` để thêm trường chọn màu (Primary Color) và dùng inline style hoặc CSS variable.
2. **Option 2 (New Module):** Nếu layout thay đổi quá 30%:
   - Duplicate folder `src/components/modules/AsiaToursTravelWeb`.
   - Đổi tên thành `CapellaLuxuryWeb`.
   - Update `schema.ts` (đổi `moduleKey`).
   - Chạy `npm run registry:generate`.
   - Chọn Template mới trong Tenant.
