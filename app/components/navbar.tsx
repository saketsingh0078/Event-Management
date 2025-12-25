'use client';

import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useWallet } from '../hooks/use-wallet';

export const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { wallet, connect, disconnect, isConnecting, isPhantomInstalled } =
    useWallet();

  // Check if we're on an event details page
  const isEventDetailsPage =
    pathname.startsWith('/events/') && pathname !== '/events';

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
              {isEventDetailsPage ? (
                <>
                  <button
                    onClick={() => router.push('/events')}
                    className="text-white hover:text-blue-400 transition-colors cursor-pointer"
                  >
                    Event
                  </button>
                  <span className="text-[#A4A7AA]"> / </span>
                  <span className="text-white">Event Details</span>
                </>
              ) : (
                <span className="text-white">Events</span>
              )}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Solana Wallet Connect Button */}
            {wallet.connected ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-[linear-gradient(91.18deg,rgba(255,255,255,0.1)_2.64%,rgba(255,255,255,0.05)_95.85%)] rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-purple-300 text-sm font-medium">
                  {wallet.publicKey?.toString().slice(0, 4)}...
                  {wallet.publicKey?.toString().slice(-4)}
                </span>
                <button
                  onClick={disconnect}
                  className="text-purple-300 hover:text-purple-200 text-xs ml-2"
                  title="Disconnect wallet"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={connect}
                disabled={isConnecting}
                className="px-4 cursor-pointer py-2  bg-[linear-gradient(91.18deg,rgba(255,255,255,0.1)_2.64%,rgba(255,255,255,0.05)_95.85%)] text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isConnecting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 2L2 7L12 12L22 7L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 17L12 22L22 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12L12 17L22 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {isPhantomInstalled ? 'Connect Wallet' : 'Install Phantom'}
                  </>
                )}
              </button>
            )}

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
  );
};
