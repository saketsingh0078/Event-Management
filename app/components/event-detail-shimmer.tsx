export function EventDetailShimmer() {
  return (
    <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-6 flex-col">
        <div className="flex gap-6">
          {/* Main Content Card */}
          <div
            className="flex-1 p-5 rounded-xl bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(68.68%_83.22%_at_50%_100%,rgba(0,133,254,0.2)_0%,rgba(0,133,254,0)_100%)]
             border border-solid border-[#343A44] backdrop-blur-[50px]"
          >
            {/* Event Image */}
            <div className="relative w-[60%] h-64 rounded-lg overflow-hidden animate-shimmer"></div>

            {/* Event Logo */}
            <div className="absolute top-[35%] left-[2%] w-30 h-30 border-8 rounded-full border-[#1E232A]/90 overflow-hidden flex items-center justify-center animate-shimmer"></div>

            {/* Title and Status Row */}
            <div className="flex gap-2 mt-2">
              <div className="ml-35 w-[35%] h-8 rounded-lg animate-shimmer"></div>
              <div className="w-20 h-8 rounded-lg animate-shimmer"></div>
              <div className="w-10 h-10 rounded-lg animate-shimmer"></div>
              <div className="w-10 h-10 rounded-lg animate-shimmer"></div>
              <div className="w-10 h-10 rounded-lg animate-shimmer"></div>
            </div>

            {/* Description */}
            <div className="mt-6 space-y-2">
              <div className="w-full h-4 rounded animate-shimmer"></div>
              <div className="w-5/6 h-4 rounded animate-shimmer"></div>
              <div className="w-4/6 h-4 rounded animate-shimmer"></div>
            </div>

            {/* Details Section */}
            <div className="flex justify-between items-center gap-4 mt-2">
              <div className="space-y-4 border-b border-gray-700 p-4 bg-gray-700/50 rounded-lg flex-1">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded animate-shimmer"></div>
                  <div className="w-48 h-4 rounded animate-shimmer"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded animate-shimmer"></div>
                  <div className="w-40 h-4 rounded animate-shimmer"></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded animate-shimmer"></div>
                  <div className="w-36 h-4 rounded animate-shimmer"></div>
                </div>
              </div>

              {/* Policy and Organizer */}
              <div className="flex flex-col gap-4">
                <div className="px-4 py-2 bg-gray-700/50 rounded-lg">
                  <div className="w-16 h-3 rounded animate-shimmer mb-2"></div>
                  <div className="w-32 h-3 rounded animate-shimmer"></div>
                </div>
                <div className="px-4 py-2 bg-gray-700/50 rounded-lg">
                  <div className="w-20 h-3 rounded animate-shimmer mb-2"></div>
                  <div className="w-28 h-3 rounded animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-[222px] shrink-0">
            <div
              className="relative p-5 rounded-xl transition-all duration-300 ease-out bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(68.68%_83.22%_at_50%_100%,rgba(0,133,254,0.2)_0%,rgba(0,133,254,0)_100%)] 
    border border-solid border-[#343A44] backdrop-blur-[50px]"
            >
              <div className="relative z-10">
                <div className="w-32 h-6 rounded animate-shimmer mb-6"></div>

                <div className="space-y-4">
                  {/* Event Cards */}
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-gray-700/30 rounded-lg border border-[#343A44]"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 rounded animate-shimmer"></div>
                        <div className="w-32 h-4 rounded animate-shimmer"></div>
                      </div>
                      <div className="w-20 h-6 rounded animate-shimmer"></div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <div className="w-4 h-4 rounded animate-shimmer"></div>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full animate-shimmer"
                      ></div>
                    ))}
                  </div>
                  <div className="w-4 h-4 rounded animate-shimmer"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Teams and Tags Section */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-4">
            {/* Teams Shimmer */}
            <div className="bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(59.96%_88.85%_at_100%_99.92%,rgba(0,133,254,0.1)_0%,rgba(0,133,254,0)_100%)] border w-[400px] border-[#343A44] rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-20 h-6 rounded animate-shimmer"></div>
                <div className="w-16 h-4 rounded animate-shimmer"></div>
              </div>
              <div className="flex flex-col gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full animate-shimmer"></div>
                    <div className="w-24 h-4 rounded animate-shimmer"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tags Shimmer */}
            <div className="bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(59.96%_88.85%_at_100%_99.92%,rgba(0,133,254,0.1)_0%,rgba(0,133,254,0)_100%)] border flex-1 border-[#343A44] rounded-lg p-6 mb-6">
              <div className="w-16 h-6 rounded animate-shimmer mb-4"></div>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-8 rounded-full animate-shimmer"
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabbed Interface Shimmer */}
          <div className="bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(69.98%_541.77%_at_100%_0%,rgba(35,98,201,0.06)_0%,rgba(35,98,201,0)_100%)] border border-[#343A44] rounded-lg p-6">
            <div className="bg-gray-800/50 border border-[#343A44] rounded-lg">
              {/* Tabs */}
              <div className="px-4 py-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-24 h-8 rounded-lg animate-shimmer"
                    ></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-40 h-6 rounded animate-shimmer"></div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg animate-shimmer"></div>
                  <div className="w-36 h-10 rounded-lg animate-shimmer"></div>
                </div>
              </div>
              <div className="text-center py-12">
                <div className="w-64 h-4 rounded animate-shimmer mx-auto mb-2"></div>
                <div className="w-80 h-3 rounded animate-shimmer mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
