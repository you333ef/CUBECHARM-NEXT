# تشخيص Main-Thread Work على صفحة البروفايل

## أرقام Lighthouse
| الفئة | الوقت |
|--------|--------|
| Script Evaluation | 5,391 ms |
| Other | 4,018 ms |
| Script Parsing & Compilation | 3,133 ms |
| Garbage Collection | 177 ms |
| Style & Layout | 163 ms |
| Parse HTML & CSS | 60 ms |

---

## أسباب مُحددة

### 1. **PrimeReact (أكبر سبب متوقع)**
- **الملف:** `app/userportal/profilee/page.tsx` يستورد **HeadlessDemo** (DELETE_CONFIRM) **ستاتيك**.
- **DELETE_CONFIRM** يستورد:
  - `primereact` (ConfirmDialog, Toast, Button)
  - `primereact/resources/themes/lara-light-blue/theme.css`
  - `primereact/resources/primereact.min.css`
  - `primeicons/primeicons.css`
- مكتبة PrimeReact ثقيلة → تزيد **Script Parsing & Compilation** و **Script Evaluation** في الـ main bundle للصفحة.
- **الحل:** استبدال نافذة حذف الستوري فقط بمودال خفيف (بدون PrimeReact) أو تحميل HeadlessDemo ديناميكياً عند الحاجة.

### 2. **Swiper يُحمّل مع أول رسم للصفحة**
- **StoryViewer** مُحمّل ديناميكياً لكنه **مُعرض في الشجرة من أول اللود** → Next يحمّل الـ chunk فوراً.
- **StoryViewer** يعتمد على **Swiper** (swiper/react + modules + CSS).
- **ADsAnd_Videos** (ديناميكي أيضاً) يستخدم **Swiper** مرة ثانية → احتمال تحميل/تقييم Swiper مرتين (حسب الـ chunks).
- **الحل:** عدم عرض **StoryViewer** إلا بعد أول حدث `openStory` (أي عند أول ضغطة على ستوري) حتى لا يُحمّل Swiper مع الـ initial load.

### 3. **Personal_Data_Profile ستاتيك**
- الصفحة تستورد **Personal_Data_Profile** بشكل عادي (غير dynamic).
- معه يُحمّل: Next/Image، react-icons (Fa, Io)، useFollow، AuthContext، إلخ في الـ main bundle.
- يمكن تأجيله بـ dynamic إن لزم، مع مراعاة الـ layout shift.

### 4. **StoriesProfilee (ديناميكي)**
- عند تحميل الـ chunk يُسحب معه: **PostOptionDialogClient** (ReactDOM)، **HeadlessDemo** (PrimeReact مرة أخرى إن كان في نفس الـ chunk).
- إزالة PrimeReact من الـ page يقلل الحاجة لحمله في أكثر من مكان.

### 5. **مكتبات ثقيلة في المشروع**
- `package.json`: **swiper**, **primereact**, **react-icons**, **lucide-react**, **framer-motion**, **recharts**, **@ffmpeg**, **photo-sphere-viewer** …
- أي منها في الـ critical path يزيد Parsing و Evaluation.

---

## ملخص الإجراءات المُطبقة/المقترحة

| إجراء | التأثير المتوقع |
|--------|------------------|
| عدم عرض StoryViewer حتى يفتح المستخدم ستوري | تقليل تحميل وتقييم Swiper عند الـ FCP/LCP |
| استبدال HeadlessDemo بمودال حذف خفيف في صفحة البروفايل فقط | إزالة PrimeReact من main bundle للصفحة → أقل Parsing و Evaluation |
| (اختياري) جعل Personal_Data_Profile ديناميكي | تأخير جزء من الـ JS بعد أول رسم |

---

## ملاحظة عن "Other" (4 ثواني)
"Other" غالباً يشمل تنفيذ مهام أخرى على الـ main thread (مثلاً من مكتبات أو layout/paint). تقليل الـ JS المُحمّل (PrimeReact + Swiper المؤجل) يساعد في خفضها أيضاً.
