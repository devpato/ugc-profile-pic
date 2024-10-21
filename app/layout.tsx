import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import { UserProvider } from './context/UserContext'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'My App',
  description: 'A full-stack app with profile and posts',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-4">
              <li><Link href="/" className="hover:text-gray-300">My Profile</Link></li>
              <li><Link href="/posts" className="hover:text-gray-300">My Posts</Link></li>
            </ul>
          </nav>
          {children}
        </UserProvider>
        <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}