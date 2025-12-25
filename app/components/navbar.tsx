'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'

export const Navbar = () => {
  const pathname = usePathname()

  // Get the current page name for display
  const getPageName = () => {
    if (pathname === '/events') return 'Events'
    return 'Events' // Default
  }

  return (
    <nav
      className="bg-gray-900 sticky top-0 z-10 border-gray-800 border-t border-r border-b border-l-0
         border-solid
         [border-image-source:linear-gradient(180deg,rgba(198,225,255,0.24)_0%,rgba(198,225,255,0.04)_100%)]
         [border-image-slice:1] backdrop-blur-[50px]
         bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%)]
         "
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-gray-300 text-base font-normal">
              <span className="text-[#A4A7AA]">Event Management / </span>
              <span className="text-white">{getPageName()}</span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Image src="/search.svg" alt="Search" width={20} height={20} />
              </div>
              <input
                type="text"
                placeholder="Search for anything"
                className="bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>

            <div className="relative">
              <button className="text-gray-400 hover:text-gray-300 transition-colors">
                <Image
                  src="/bell.svg"
                  alt="Notification"
                  width={28}
                  height={28}
                />
              </button>

              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                4
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center">
                <Image src="/people.svg" alt="Profile" width={40} height={40} />
              </div>
              <div className="flex flex-col">
                <span className="text-gray-200 font-semibold text-sm">
                  Hailey Carter
                </span>
                <span className="text-gray-400 text-xs">Master Admin</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
