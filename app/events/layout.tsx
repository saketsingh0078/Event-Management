import { Navbar } from '../components/navbar'

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#050810]">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}
