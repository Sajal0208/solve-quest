"use client"
import './globals.css'
import { RecoilRoot } from 'recoil'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <RecoilRoot>
          {children}
          <ToastContainer />
        </RecoilRoot>
      </body>
    </html>
  )
}
