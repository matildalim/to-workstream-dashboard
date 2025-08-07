//import './globals.css'

export const metadata = {
  title: 'Transformation Office Dashboard',
  description: 'Monitor program health, track milestones, and oversee deliverable progress',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800">{children}</body>
    </html>
  )
}
