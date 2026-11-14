# لوحة تحكم منصة «مَسار | MASAR» — SAIRNA Dashboard

لوحة الإدارة المركزية لمنصة **مَسار | MASAR** لحجز رحلات البولمانات بين المحافظات السورية، مبنية بنفس التقنيات والهيكلية المعمارية ونظام التصميم المعتمد في الموقع المرجعي (`reference.zip`) ووفق دليل الهوية البصرية المرفق.

## التقنيات والمعمارية (Tech Stack & Architecture)
- **الإطار الأساسي:** React 19 + Vite 6
- **التصميم والهوية البصرية:** Tailwind CSS v4 (`@import "tailwindcss";`) مع نظام ألوان التراث السوري المعاصر (الأزرق الدمشقي `#163A5F`، الأخضر الحلبي `#2E6F5E`، الذهبي التدمري `#C88A32`، الحجري الكلسي `#F7F4EE`، الرمادي البازلتي `#23272D`، وأحمر الوردة الشامية `#B83B3B`) وشريط الأبلق السوري (`ablaq-ribbon`).
- **الخطوط الرقمية:** `Readex Pro` للعناوين، `IBM Plex Sans Arabic` للنصوص، و`Plus Jakarta Sans` للأرقام والأسعار (`tabular-nums`).
- **إدارة الحالة والبيانات:**
  - `@tanstack/react-query` لجلب البيانات وتحديثها وإبطال الكاش تلقائياً بعد كل عملية إنشاء أو تعديل أو حذف.
  - `zustand` لإدارة جلسة المشرف (`use-auth-store.js`)، المظهر الليلي/النهاري (`use-theme-store.js`)، الإشعارات (`use-toast-store.js`)، وحالة الفلاتر والنوافذ (`use-dashboard-store.js`).
  - `axios` مع Interceptors لإرفاق رمز التوثيق (`Bearer Token`) تلقائياً في `src/services/api-client.js`.
- **الرسوم البيانية والأيقونات:** `recharts` + `lucide-react` عبر مكون `SairnaIcon`.

## الربط مع الباك إند (SAIRNA BACKEND)
- **Dashboard Base URL:** `https://sairna.abdulrahman-hares.com/api/v1/dashboard`
- **Health Check:** `https://sairna.abdulrahman-hares.com/api/v1/health`
- **Dashboard Swagger:** `https://sairna.abdulrahman-hares.com/api/docs/dashboard`

### بيانات دخول المشرف (Admin Credentials)
- **البريد الإلكتروني:** `admin@gmail.com`
- **كلمة المرور:** `1111111111111111`
- **الصلاحية:** `ADMIN`
- **مسار الدخول:** `POST /api/v1/dashboard/auth/login`

## الوحدات والصفحات المتوفرة
1. **تسجيل دخول المشرف (`/login`):** مربوط مع `POST /auth/login` مع زر تعبئة تلقائية لبيانات المشرف المعتمد.
2. **لوحة القيادة والإحصائيات (`/overview` أو `/`):** مربوطة مع `GET /overview` وتعرض المؤشرات الخمسة الرئيسية، الإيرادات المؤكدة، الرسوم البيانية لأداء الشركات وتوزيع حالات الحجوزات، وأحدث الرحلات والتذاكر.
3. **إدارة رحلات البولمان (`/trips`):** مربوطة مع `GET /trips`، `GET /trips/{id}`، `POST /trips`، `PATCH /trips/{id}`، و`DELETE /trips/{id}` مع محاكي ومخطط تفاعلي لمقاعد البولمان (VIP 2+1 والسياحي 2+2).
4. **إدارة الحجوزات والتذاكر (`/bookings`):** مربوطة مع `GET /bookings`، `GET /bookings/{id}`، و`POST /bookings/{id}/cancel` مع نافذة معاينة تذكرة الصعود الإلكترونية (`E-Ticket QR`).
5. **إدارة شركات النقل المعتمدة (`/companies`):** مربوطة مع `GET /companies`، `POST /companies`، `PATCH /companies/{id}`، و`DELETE /companies/{id}`.
6. **المحافظات والكراجات السورية (`/cities`):** مربوطة مع `GET /cities` مع خريطة تفاعلية لمسارات القوافل بين المحافظات وحاسبة المسافات البرية.
7. **المسافرون والحسابات (`/users`):** مربوطة مع `GET /users` و`GET /users/{id}` مع نافذة استعراض سجل حجوزات ومدفوعات كل مسافر.

## طريقة التشغيل
```bash
npm install
npm run dev
```
ولبناء نسخة الإنتاج:
```bash
npm run build
```
