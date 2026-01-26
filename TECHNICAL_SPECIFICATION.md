Dưới đây là **Tài liệu Đặc tả Kỹ thuật (Technical Specification) - Phiên bản 5.0 (Final)**.

Bản tài liệu này là sự kết tinh của toàn bộ quá trình thảo luận, chuyển đổi kiến trúc từ "SSG tĩnh hoàn toàn" sang **"Modular Web Engine"** với khả năng Tự động hóa cao (Automation) và Tự định nghĩa (Self-Describing).

---

# TÀI LIỆU ĐẶC TẢ KỸ THUẬT: CAPELLA WEB ENGINE (v5.0)

**Codename:** Capella Prism
**Kiến trúc:** Modular Hybrid + Template Dispatcher + Self-Describing Schema.
**Mục tiêu:** Xây dựng "Nhà máy sản xuất Web" tốc độ cao, độc lập module, chi phí vận hành thấp nhất.

---

## 1. NGUYÊN TẮC CỐT LÕI (CORE PRINCIPLES)

1. **Isolation (Độc lập tuyệt đối):** Mỗi sản phẩm (Landing Page, Web App, Main Site) là một thư mục riêng biệt (`/components/modules/[Name]`). Việc sửa lỗi hay copy code của module này không bao giờ ảnh hưởng module kia.
2. **Self-Describing Modules (Module tự định nghĩa):** Code giao diện (`index.tsx`) và Cấu hình dữ liệu (`schema.ts`) nằm chung một chỗ.
3. **Automated Mapping (Khớp nối tự động):** Hệ thống tự động quét các module để sinh ra trường nhập liệu trong CMS và luồng điều hướng (Routing) mà không cần code thủ công (`switch/case`).
4. **Hybrid Rendering:** Hỗ trợ song song **Static HTML** (cho Landing Page SEO) và **Dynamic Client** (cho Web App) trên cùng một tên miền.

---

## 2. TECHNOLOGY STACK (CÔNG NGHỆ)

| Thành phần | Công nghệ | Vai trò |
| --- | --- | --- |
| **Core Framework** | **Next.js 14+ (App Router)** | Dispatcher trung tâm điều phối giao diện. |
| **CMS** | **Payload CMS v3** | Headless CMS. Cấu hình tự động sinh theo Module. |
| **Storage** | **Cloudflare R2** | Lưu trữ ảnh/video miễn phí băng thông (Zero Egress). |
| **Infrastructure** | **Vercel** (Frontend) + **VPS** (Backend) | Frontend chạy Edge Network. Backend (AI/DB) chạy Docker. |
| **Automation** | **Node.js Scripts** | Tự động tạo file registry đăng ký module. |

---

## 3. CẤU TRÚC THƯ MỤC (DIRECTORY STRUCTURE)

Cấu trúc này được quy hoạch để hỗ trợ hàng nghìn module mà không bị rối.

```bash
/src
  /app
    /_sites
      /[site]
        page.tsx          # DISPATCHER: Nhà ga trung chuyển (Code cực ngắn)
    /api                  # API Proxy: Cầu nối cho Web App gọi Backend an toàn
  
  /components
    /modules              # KHO MODUN (Mỗi folder là 1 thế giới riêng)
      
      # --- MODULE LOẠI 1: LANDING PAGE (TĨNH) ---
      /LuxuryYachtLP
        index.tsx         # UI Code (Server Component)
        schema.ts         # Data Config (Payload Fields)
        styles.module.css # CSS riêng biệt
      
      # --- MODULE LOẠI 2: WEB APP (ĐỘNG) ---
      /BookingAppV1
        index.tsx         # UI Code (Client Component - "use client")
        schema.ts         # Data Config (API Keys, Settings)
        /hooks            # Logic riêng của App
        /components       # UI con của App

    registry.ts           # AUTO-GENERATED: File đăng ký danh sách module
  
  /payload
    /collections
      Tenants.ts          # Collection chính, load config từ registry.ts
  
  /scripts
    generate-registry.js  # Script tự động quét folder modules

```

---

## 4. CƠ CHẾ HOẠT ĐỘNG (MECHANISMS)

### 4.1. The Self-Describing Module (Cấu trúc Module chuẩn)

Mỗi module bắt buộc phải có file `schema.ts` để "tự giới thiệu" với hệ thống nó cần dữ liệu gì.

**Ví dụ: `src/components/modules/LuxuryYachtLP/schema.ts**`

```typescript
export const moduleKey = 'luxury-yacht-lp'; // ID duy nhất
export const moduleLabel = 'Luxury Yacht Landing Page'; // Tên hiện trong CMS

// Module này cần nhập những gì?
export const fields = [
  { name: 'heroTitle', type: 'text', required: true },
  { name: 'gallery', type: 'array', fields: [ {name: 'image', type: 'upload'} ] }
];

```

### 4.2. The Auto-Registry (Cơ chế đăng ký tự động)

Script `scripts/generate-registry.js` sẽ chạy trước khi `dev` hoặc `build`. Nó quét folder `/modules` và tạo ra file `registry.ts`:

**File sinh ra: `src/components/modules/registry.ts**`

```typescript
// FILE NÀY ĐƯỢC SINH TỰ ĐỘNG - KHÔNG SỬA TAY
import * as LuxuryYachtLP_Schema from './LuxuryYachtLP/schema';
import { LuxuryYachtLP as LuxuryYachtLP_Component } from './LuxuryYachtLP';

export const MODULES = [
  { config: LuxuryYachtLP_Schema, Component: LuxuryYachtLP_Component },
  // ... các modules khác
];

export const ComponentMap = {
  'luxury-yacht-lp': LuxuryYachtLP_Component,
  // ... map key -> component
};

```

### 4.3. The Smart CMS (Payload Automation)

Collection `Tenants` không còn hard-code. Nó đọc `MODULES` để tự vẽ giao diện nhập liệu.

**File: `src/payload/collections/Tenants.ts**`

```typescript
import { MODULES } from '@/components/modules/registry';

export const Tenants = {
  slug: 'tenants',
  fields: [
    { name: 'subdomain', type: 'text', required: true },
    
    // 1. Dropdown chọn Module (Tự động cập nhật options)
    {
      name: 'templateId',
      type: 'select',
      options: MODULES.map(m => ({ label: m.config.moduleLabel, value: m.config.moduleKey }))
    },

    // 2. Loop qua Modules để tạo Group Field động
    ...MODULES.map(mod => ({
      name: `content_${mod.config.moduleKey.replace(/-/g, '_')}`, // Biến đổi tên: luxury_yacht_lp
      type: 'group',
      label: `Config: ${mod.config.moduleLabel}`,
      admin: {
        condition: (data) => data.templateId === mod.config.moduleKey // Chỉ hiện khi chọn đúng
      },
      fields: mod.config.fields // Load fields từ schema.ts
    }))
  ]
}

```

### 4.4. The Dispatcher (Bộ điều phối)

File `page.tsx` cực kỳ gọn nhẹ, không cần `switch/case` dài dòng.

**File: `src/app/_sites/[site]/page.tsx**`

```tsx
import { ComponentMap } from '@/components/modules/registry';

export default async function PageDispatcher({ params }) {
  const tenant = await getTenant(params.site);
  
  // 1. Tìm Component dựa vào ID
  const ModuleComponent = ComponentMap[tenant.templateId];
  if (!ModuleComponent) return <NotFound />;

  // 2. Lấy đúng cục data của module đó
  const contentKey = `content_${tenant.templateId.replace(/-/g, '_')}`;
  const data = tenant[contentKey];

  // 3. Render
  return <ModuleComponent data={data} />;
}

```

---

## 5. QUY TRÌNH LÀM VIỆC (WORKFLOWS)

### 5.1. Quy trình tạo Sản phẩm mới (Clone & Modify)

Dành cho Developer muốn tạo một Web App mới dựa trên cái cũ.

1. **Duplicate:** Copy folder `BookingAppV1` -> Paste thành `HotelAppV1`.
2. **Rename Config:** Mở `HotelAppV1/schema.ts`, đổi `moduleKey` thành `'hotel-app-v1'`.
3. **Run Dev:** Chạy `npm run dev`.
* Script tự động chạy -> Cập nhật Registry.
* CMS tự động có thêm option "Hotel App" và các trường nhập liệu tương ứng.


4. **Modify Code:** Sửa logic/giao diện trong folder `HotelAppV1` (Độc lập hoàn toàn).
5. **Done.**

### 5.2. Quy trình Vận hành (Content Ops)

Dành cho CEO/Marketer.

1. Vào CMS -> Tạo Tenant mới: `hotel.capellatravel.vn`.
2. Tại ô **Template**, chọn **"Hotel App"**.
3. CMS tự động ẩn hết các trường thừa, chỉ hiện ra ô nhập: **API Key, Banner Khách Sạn...**
4. Nhập liệu -> **Publish**. Web chạy ngay lập tức.

---

## 6. HẠ TẦNG & TỐI ƯU CHI PHÍ (INFRASTRUCTURE)

### 6.1. Storage: Cloudflare R2 (Bắt buộc)

* Cấu hình Payload CMS sử dụng Plugin S3 Adapter trỏ về Cloudflare R2.
* **Lợi ích:** Không tốn chi phí băng thông khi tải ảnh/video.

### 6.2. Server: Hybrid Model

* **Frontend (Next.js):** Deploy lên **Vercel** (Pro) để tận dụng Edge Network và Serverless Functions cho Dispatcher.
* **Backend Services:** Thuê 1 VPS (Singapore) cài **Coolify** để chạy:
* PostgreSQL Database.
* AI Processing Service (Python).
* Booking Logic (nếu cần xử lý background job).



---

## 7. CHECKLIST TRIỂN KHAI (ACTION PLAN)

Để chuyển đổi hệ thống sang kiến trúc v5.0 này, Dev team cần thực hiện:

1. [Setup] Khởi tạo Next.js + Payload CMS.
2. [Script] Viết script `scripts/generate-registry.js`.
3. [Architect] Tạo folder `src/components/modules` và file `registry.ts` (placeholder).
4. [Dev] Tạo 2 module mẫu để test:
* `BasicLandingPage` (Static).
* `BasicWebApp` (Client, có fetch API).
5. [Test] Chạy thử quy trình Copy folder -> Auto generate schema.

Tài liệu này là "Kim chỉ nam" cuối cùng. Hệ thống xây dựng theo mô hình này đảm bảo đáp ứng mọi yêu cầu về **Tốc độ**, **Chi phí**, **Tính linh hoạt** và **Khả năng mở rộng** vô hạn.


## 9. CÂU HỎI

### Với quy trình này, ví dụ có 1 thẻ <p> Hello <strong> Capella Travel </strong></p> hoặc chữ hiển thị trong button <Button> Đặt Ngay </Button> cần được hiển thị trên Payload CMS thì quy trình này đã đáp ứng được chưa?

Câu trả lời là: **HOÀN TOÀN ĐÁP ỨNG ĐƯỢC**, nhưng bạn cần hiểu rõ cách Payload CMS xử lý văn bản (Text) để triển khai đúng.

Với yêu cầu cụ thể của bạn:

1. Đoạn văn có định dạng: `<p> Hello <strong> Capella Travel </strong></p>`
2. Chữ trên nút: `<Button> Đặt Ngay </Button>`

Quy trình **Modular (Self-Describing)** chúng ta vừa xây dựng sẽ xử lý việc này như sau:

---

### 1. Cách định nghĩa trong `schema.ts` (Cấu hình)

Để CEO có thể bôi đậm chữ "Capella Travel" và sửa chữ "Đặt Ngay", bạn cần khai báo 2 loại field khác nhau trong file Schema của module.

**File:** `src/components/modules/WelcomeBanner/schema.ts`

```typescript
export const moduleKey = 'welcome-banner';
export const moduleLabel = 'Welcome Banner';

export const fields = [
  // 1. Xử lý đoạn văn có Bôi đậm/Nghiêng (Rich Text)
  { 
    name: 'greetingText', 
    type: 'richText', // <--- Đây là chìa khóa. Nó cung cấp bộ soạn thảo giống Word.
    required: true,
    editor: lexicalEditor({
      features: ({ defaultFeatures }) => [
        ...defaultFeatures,
        BoldFeature(), // Cho phép bôi đậm
        ItalicFeature(),
      ],
    }),
  },

  // 2. Xử lý chữ trên nút (Plain Text)
  { 
    name: 'buttonLabel', 
    type: 'text', // Chỉ nhập chữ thường, không định dạng
    defaultValue: 'Đặt Ngay', // Giá trị mặc định
    required: true, 
  }
];

```

**Kết quả trong trang Admin (CMS):**

* **Ô `greetingText`:** CEO sẽ thấy một khung soạn thảo. Họ gõ "Hello Capella Travel", sau đó bôi đen chữ "Capella Travel" và bấm nút **B (Bold)**. Giao diện y hệt Word.
* **Ô `buttonLabel`:** CEO thấy một ô input nhỏ để gõ chữ "Đặt Ngay" hoặc sửa thành "Book Now".

---

### 2. Cách hiển thị trong `index.tsx` (Frontend)

Đây là điểm quan trọng. Payload CMS không lưu chuỗi HTML thô (`<p>...`) vào database (để bảo mật XSS). Nó lưu dưới dạng **JSON**.

Ví dụ dữ liệu CMS trả về cho Frontend:

```json
{
  "greetingText": {
    "root": {
      "children": [
        { "text": "Hello ", "format": 0 },
        { "text": "Capella Travel", "format": 1 } // Format 1 = Bold
      ]
    }
  },
  "buttonLabel": "Đặt Ngay"
}

```

Bạn cần một hàm helper để biến cục JSON kia thành HTML.

**File:** `src/components/modules/WelcomeBanner/index.tsx`

```tsx
import { RichText } from '@payloadcms/richtext-lexical/react'; // Helper có sẵn của Payload

export const WelcomeBanner = ({ data }) => {
  return (
    <div className="banner">
      {/* 1. Hiển thị đoạn văn Rich Text */}
      <div className="content">
        {/* Component này tự động biến JSON thành <p>Hello <strong>...</strong></p> */}
        <RichText data={data.greetingText} />
      </div>

      {/* 2. Hiển thị nút bấm */}
      <button className="btn-primary">
        {data.buttonLabel}
      </button>
    </div>
  );
};

```

---

### 3. Tại sao cách này Tốt hơn việc cho phép nhập HTML trực tiếp?

Bạn có thể thắc mắc: *"Tại sao không cho CEO gõ thẳng `<p>Hello <strong>...` vào?"*

Lý do quy trình này ưu việt hơn:

1. **An toàn (Security):** Nếu cho phép nhập HTML raw, hacker (hoặc nhân viên sơ ý) có thể chèn mã độc `<script>...` vào và làm sập web. Rich Text Editor chặn đứng việc này.
2. **Nhất quán giao diện:**
* Nếu dùng Rich Text: Frontend kiểm soát được là thẻ `<strong>` hay thẻ `<b>` hay thẻ `<span class="font-bold">`.
* Nếu CEO tự gõ HTML: Hôm nay họ gõ `<strong>`, ngày mai họ gõ `<b style="font-weight:900">`. Web của bạn sẽ "nát" về mặt style.


3. **Dễ dùng:** CEO/Marketer không biết code. Họ chỉ biết dùng Word. Rich Text Editor đáp ứng đúng thói quen đó.

### Kết luận

Quy trình **Self-Describing Modules (v5.0)** hoàn toàn đáp ứng được việc hiển thị từ cấu trúc phức tạp (Rich Text) đến đơn giản (Button Label).

* Bạn dùng field **`richText`** cho các đoạn văn cần format (bôi đậm, link, xuống dòng).
* Bạn dùng field **`text`** cho các nhãn nút, tiêu đề ngắn.
* Mọi thứ được định nghĩa gọn gàng trong file `schema.ts` của từng module.

### với quy trình này, ví dụ tôi có 2 web, 1 web html, js, css thuần và 1 trang react web động call api và lazy load... Khi tôi đóng gói và đưa vào 2 folder trong project này, sau đó tôi cần cụ thể làm những gì để deploy và chỉnh sửa được trên payload production

Đây là hướng dẫn **"Cầm tay chỉ việc" (Step-by-step)** để bạn di chuyển (migrate) 2 trang web cũ vào hệ thống "Nhà máy Web" (Web Engine) mới, sau đó deploy và quản trị.

Giả sử:

1. **Web A (Static):** Là một landing page `index.html`, `style.css`, `script.js` thuần.
2. **Web B (Dynamic):** Là một React App (ví dụ create-react-app), có call API.

---

### GIAI ĐOẠN 1: ĐÓNG GÓI (PACKAGING)

Chúng ta sẽ biến 2 web này thành 2 **Module** trong thư mục `src/components/modules`.

#### Bước 1: Xử lý Web A (HTML/CSS/JS Thuần) -> Biến thành Module Tĩnh

Mục tiêu: Chuyển đổi HTML sang JSX (React Server Component).

1. **Tạo thư mục:** `src/components/modules/SimpleLanding`.
2. **Copy CSS:** Đổi tên `style.css` cũ thành `styles.module.css` và copy vào thư mục này.
3. **Tạo file `schema.ts` (Cấu hình những chỗ muốn sửa):**
```typescript
export const moduleKey = 'simple-landing';
export const moduleLabel = 'Simple Landing Page (Static)';
export const fields = [
  { name: 'headline', type: 'text', required: true }, // Chỗ nào muốn sửa thì tạo field
  { name: 'bannerImage', type: 'upload', relationTo: 'media' }
];

```


4. **Tạo file `index.tsx` (Chuyển HTML vào đây):**
* Mở `index.html` cũ, copy toàn bộ nội dung trong thẻ `<body>`.
* Dán vào `return (...)` của React.
* Đổi `class=` thành `className=`.
* Thay các đoạn text cứng bằng biến `data.headline`.


```tsx
import styles from './styles.module.css';

export const SimpleLanding = ({ data }) => {
  return (
    <div className={styles.container}>
       {/* Thay vì cứng <img src="anh-cu.jpg">, hãy dùng data từ CMS */}
       <img src={data.bannerImage.url} alt="Banner" className={styles.banner} />

       {/* Thay vì cứng <h1>Xin chào</h1> */}
       <h1>{data.headline}</h1>

       {/* Nội dung HTML cũ giữ nguyên */}
       <div className={styles.content}>
          <p>Nội dung tĩnh...</p>
       </div>
    </div>
  );
};

```



#### Bước 2: Xử lý Web B (React App) -> Biến thành Module Động

Mục tiêu: Biến nó thành Next.js Client Component.

1. **Tạo thư mục:** `src/components/modules/DynamicWebApp`.
2. **Copy Source Code:** Copy toàn bộ component, hooks, utils của dự án React cũ vào đây.
3. **Tạo file `schema.ts` (Cấu hình API):**
```typescript
export const moduleKey = 'dynamic-web-app';
export const moduleLabel = 'Dynamic Web App (React)';
export const fields = [
  { name: 'apiEndpoint', type: 'text', required: true },
  { name: 'apiKey', type: 'text' } // Để CEO nhập key thật khi lên prod
];

```


4. **Tạo file `index.tsx` (Root Component):**
* **Quan trọng:** Phải thêm `"use client";` ở dòng đầu tiên.
* Nhận `data` từ props để lấy cấu hình API.


```tsx
"use client"; 
import { useState, useEffect } from 'react';
// Import các component con của app cũ
import Dashboard from './components/Dashboard'; 

export const DynamicWebApp = ({ data }) => {
  const { apiEndpoint, apiKey } = data; // Lấy config từ CMS

  return (
    <div className="dynamic-app-wrapper">
       <Dashboard endpoint={apiEndpoint} token={apiKey} />
    </div>
  );
};

```



---

### GIAI ĐOẠN 2: ĐĂNG KÝ VÀO HỆ THỐNG (REGISTRATION)

Nếu bạn đã setup script tự động `generate-registry.js` như bài trước:

1. Mở Terminal.
2. Chạy lệnh: `npm run dev`.
3. **Xong!** Hệ thống tự động quét 2 folder mới, cập nhật `registry.ts` và đẩy config vào Payload CMS.

*(Nếu chưa có script, bạn phải vào `registry.ts` import thủ công 2 module này).*

---

### GIAI ĐOẠN 3: DEPLOY LÊN PRODUCTION

Bạn đang dùng Vercel (Frontend) + VPS (Backend/DB).

1. **Commit Code:**
```bash
git add .
git commit -m "Add SimpleLanding and DynamicWebApp modules"
git push origin main

```


2. **Vercel (Tự động):**
* Vercel phát hiện code mới -> Tự động Build -> Deploy.
* Sau khoảng 2 phút, code mới đã lên sóng (Site vẫn chạy bình thường, chưa có gì thay đổi hiển thị vì bạn chưa tạo trang mới).



---

### GIAI ĐOẠN 4: THAO TÁC TRÊN CMS (Dành cho CEO/Admin)

Bây giờ code đã sẵn sàng trên Cloud, bạn vào trang Admin để tạo ra 2 trang web thực tế.

**Bước 1: Truy cập CMS**

* Vào `admin.capellatravel.vn` (hoặc link production của bạn).

**Bước 2: Tạo trang Web Tĩnh (Từ Web A)**

1. Vào Collection **Tenants** -> **Create New**.
2. Tên: "Landing Page Khuyến Mãi".
3. Subdomain: `khuyenmai` (Web sẽ chạy tại `khuyenmai.capellatravel.vn`).
4. **Template:** Chọn **"Simple Landing Page (Static)"** trong dropdown.
5. *Ngay lập tức, CMS hiện ra các ô nhập liệu của Web A:*
* Headline: Nhập "Chào mừng mùa hè 2025".
* Banner Image: Upload ảnh.


6. Bấm **Publish**.

**Bước 3: Tạo trang Web Động (Từ Web B)**

1. Vào Collection **Tenants** -> **Create New**.
2. Tên: "Hệ thống Booking".
3. Subdomain: `booking` (Web sẽ chạy tại `booking.capellatravel.vn`).
4. **Template:** Chọn **"Dynamic Web App (React)"**.
5. *CMS hiện ra ô nhập liệu cấu hình:*
* API Endpoint: Nhập `https://api.myservice.com/v1`.
* API Key: Nhập key bí mật.


6. Bấm **Publish**.

---

### GIAI ĐOẠN 5: CHỈNH SỬA SAU NÀY (MAINTENANCE)

Sẽ có 2 loại chỉnh sửa:

**Loại 1: Sửa nội dung (Chữ, Ảnh, Cấu hình API)**

* **Ai làm:** CEO / Content.
* **Cách làm:** Vào CMS -> Sửa text -> Bấm Save.
* **Kết quả:**
* Web Động (`booking`): Cập nhật ngay lập tức (vì client fetch config mới).
* Web Tĩnh (`khuyenmai`): Cập nhật sau vài giây (nhờ cơ chế Revalidation).



**Loại 2: Sửa Code (Đổi màu CSS, Thêm tính năng React, Đổi Layout)**

* **Ai làm:** Developer.
* **Cách làm:**
1. Mở VS Code máy local.
2. Vào folder `src/components/modules/SimpleLanding`.
3. Sửa file CSS hoặc JSX.
4. Git Push.


* **Kết quả:** Vercel build lại và cập nhật code mới cho toàn bộ các trang đang dùng template đó.

### TỔNG KẾT

Với quy trình này:

1. **Code (Web A, Web B)** nằm độc lập trong folder.
2. **Data (Chữ, Ảnh)** nằm trong CMS.
3. **Deploy** chỉ là việc `git push`.
4. **Tạo trang mới** chỉ là việc click chuột trên CMS.