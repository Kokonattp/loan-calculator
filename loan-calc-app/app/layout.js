import './globals.css'

export const metadata = {
  title: 'Loan Calculator Pro - คำนวณสินเชื่อ',
  description: 'เครื่องมือคำนวณการผ่อนชำระสินเชื่อแบบ Kanban Board รองรับบัตรเครดิต สินเชื่อบ้าน รถยนต์ และอื่นๆ',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#023852',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
