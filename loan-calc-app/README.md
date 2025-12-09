# 💰 Loan Calculator Pro

เครื่องมือคำนวณการผ่อนชำระแบบ Kanban Board - รองรับมือถือ

## ✨ Features

- 📱 **Responsive** - ใช้งานได้ทั้ง Desktop และ Mobile
- 🎨 **Kanban Board** - จัดการรายการแบบ Trello/Slack
- ➕ **เพิ่มได้ไม่จำกัด** - บัตรเครดิต/สินเชื่อกี่รายการก็ได้
- 📅 **วันที่ผ่อนหมด** - แสดงวันที่ผ่อนหมดแต่ละรายการ
- 🔄 **2 โหมด** - กำหนดงวด หรือ กำหนดยอดผ่อน

## 🚀 Deploy to Vercel

```bash
npm install
npm run build
npx vercel
```

## 📁 Structure

```
loan-calc-app/
├── app/
│   ├── globals.css
│   ├── layout.js
│   └── page.js
├── components/
│   ├── Board.jsx
│   ├── LoanCard.jsx
│   └── SummaryBar.jsx
├── package.json
└── next.config.js
```

## 📝 License

MIT
