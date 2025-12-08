# 💰 Loan Calculator Pro - Kanban Style

เครื่องมือคำนวณการผ่อนชำระแบบ Kanban Board สวยงาม พร้อมระบบ Login และบันทึกข้อมูล

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)
![Firebase](https://img.shields.io/badge/Firebase-Auth+DB-FFCA28?style=flat-square&logo=firebase)

## ✨ Features

- 🎨 **Kanban Board Style** - UI แบบ Trello/Slack
- 📊 **Sticky Summary Bar** - ยอดรวมอยู่ด้านบนเห็นชัดเจน
- ➕ **เพิ่มได้ไม่จำกัด** - เพิ่มบัตรเครดิต/สินเชื่อกี่รายการก็ได้
- 🎯 **6 ประเภท** - บัตรเครดิต, บ้าน, รถ, ส่วนบุคคล, การศึกษา, อื่นๆ
- 🔄 **2 โหมดคำนวณ** - กำหนดงวด หรือ กำหนดยอดผ่อน
- 📱 **Responsive** - รองรับทุกขนาดหน้าจอ
- 🔐 **Login** - Google, LINE, Face ID/Fingerprint
- ☁️ **Cloud Sync** - บันทึกข้อมูลอัตโนมัติ

## 🔐 Authentication Setup

### 1. Firebase Setup (Google Login + Database)

```bash
# 1. ไปที่ https://console.firebase.google.com
# 2. สร้าง Project ใหม่
# 3. เปิดใช้งาน Authentication > Sign-in method > Google
# 4. เปิดใช้งาน Firestore Database
# 5. ไป Project Settings > General > Your apps > Add app (Web)
# 6. คัดลอกค่า config
```

สร้างไฟล์ `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

#### Firestore Security Rules

ไปที่ Firestore Database > Rules แล้วใส่:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 2. LINE Login Setup (Optional)

```bash
# 1. ไปที่ https://developers.line.biz/console/
# 2. สร้าง Provider
# 3. สร้าง LINE Login Channel
# 4. ตั้งค่า Callback URL: https://your-domain.com
# 5. เปิดใช้งาน OpenID Connect
```

เพิ่มใน `.env.local`:

```env
NEXT_PUBLIC_LINE_CHANNEL_ID=your_channel_id
```

### 3. Face ID / Fingerprint

- ใช้งานได้อัตโนมัติบน browser ที่รองรับ WebAuthn
- รองรับ: Chrome, Safari, Edge บน iOS, Android, macOS, Windows
- ต้องใช้ HTTPS (ยกเว้น localhost)

## 🚀 Deploy to Vercel

### วิธีที่ 1: GitHub

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_REPO_URL
git push -u origin main

# 2. Go to vercel.com and import repo
# 3. ใส่ Environment Variables ใน Vercel Dashboard
```

### วิธีที่ 2: Vercel CLI

```bash
npm install -g vercel
vercel

# ใส่ Environment Variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... etc
```

### วิธีที่ 3: Local Development

```bash
# 1. Copy environment file
cp .env.example .env.local

# 2. แก้ไขค่าใน .env.local

# 3. Install & Run
npm install
npm run dev

# Open http://localhost:3000
```

## 📁 Project Structure

```
loan-calc-app/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── Board.jsx
│   ├── LoanCard.jsx
│   ├── SummaryBar.jsx
│   ├── LoginModal.jsx
│   └── UserMenu.jsx
├── contexts/
│   └── AuthContext.js
├── lib/
│   ├── firebase.js
│   ├── lineAuth.js
│   └── biometric.js
├── .env.example
└── tailwind.config.js
```

## 🎨 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Navy | `#023852` | Header, Text |
| Teal | `#079FA0` | Accent, Switch |
| Mint | `#9FD8C5` | Success |
| Yellow | `#FAC005` | Highlight |
| Orange | `#F58B01` | Warning |
| Red | `#DC2E2F` | Error |

## 📝 License

MIT License

---

Made with ❤️ using Next.js + Firebase + Tailwind CSS
