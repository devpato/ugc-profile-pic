import './globals.css'
import { Inter } from 'next/font/google'
import Script from 'next/script'

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
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-gray-300">My Profile</a></li>
            <li><a href="/posts" className="hover:text-gray-300">My Posts</a></li>
          </ul>
        </nav>
        {children}
        <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="beforeInteractive" />
      </body>
    </html>
  )
}