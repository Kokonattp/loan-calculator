import './globals.css'
import { AuthProvider } from '../contexts/AuthContext'

export const metadata = {
  title: 'Loan Calculator Pro | คำนวณการผ่อนชำระ',
  description: 'คำนวณการผ่อนชำระทุกประเภท - บัตรเครดิต, สินเชื่อบ้าน, สินเชื่อรถยนต์, สินเชื่อส่วนบุคคล',
  keywords: 'คำนวณผ่อน, สินเชื่อ, บัตรเครดิต, ผ่อนบ้าน, ผ่อนรถ, loan calculator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="th">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💰</text></svg>" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
