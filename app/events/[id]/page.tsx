'use client'

import { use } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEvent } from '../../hooks/use-events'
import { formatEventDate } from '../../utils/date'
import { formatNumber } from '../../utils/number'
import EventCard from '@/app/components/event-card'

type PageProps = {
  params: Promise<{ id: string }>
}

export default function EventDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const eventId = parseInt(id, 10)
  const { data: event, isLoading, error } = useEvent(eventId)

  if (isLoading) {
    return (
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-gray-400">Loading event details...</div>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">Event not found</div>
        </div>
      </div>
    )
  }

  const teams = event.teams
    ? typeof event.teams === 'string'
      ? JSON.parse(event.teams)
      : event.teams
    : []
  const tags = event.tags
    ? typeof event.tags === 'string'
      ? JSON.parse(event.tags)
      : event.tags
    : []

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-green-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'completed':
        return 'bg-gray-500'
      case 'ongoing':
        return 'bg-blue-500'
      case 'draft':
        return 'bg-gray-400'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  const formatDateRange = (
    startDate: Date | string,
    endDate: Date | string,
  ) => {
    const start =
      typeof startDate === 'string' ? new Date(startDate) : startDate
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate

    const startFormatted = formatEventDate(start)
    const endFormatted = formatEventDate(end)

    return `${startFormatted} - ${endFormatted} (${event.timezone || 'GMT-6'})`
  }

  return (
    <div className="w-full py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-6 flex-col">
        <div className="flex gap-6">
          <div
            className="flex-1 p-5 rounded-xl  bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(68.68%_83.22%_at_50%_100%,rgba(0,133,254,0.2)_0%,rgba(0,133,254,0)_100%)]
             border border-solid border-[#343A44] backdrop-blur-[50px]"
          >
            {true && (
              <div className="relative w-[60%] h-64 rounded-lg overflow-hidden">
                <Image
                  src={'/event-image.svg'}
                  alt={event.name}
                  width={1200}
                  height={256}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="absolute top-[35%] left-[2%] w-30 h-30 border-8 rounded-full border-[#1E232A]/90 overflow-hidden flex items-center justify-center ">
              {true ? (
                <Image
                  src={'/event-logo.svg'}
                  alt={event.name}
                  width={150}
                  height={150}
                  className="object-cover"
                />
              ) : (
                <span className="text-white text-xl font-semibold">
                  {event?.name?.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div className="flex gap-2 mt-2">
              <h1 className="ml-35 text-white text-2xl font-semibold w-[35%] overflow-hidden text-ellipsis line-clamp-2">
                {event?.name}
              </h1>
              <span>{event?.status}</span>
              <button className="px-4 py-2 bg-gray-700/50 rounded-lg text-white text-sm w-fit h-fit">
                <Image src="/edit.svg" alt="Delete" width={20} height={20} />
              </button>
              <button className="px-4 py-2 bg-gray-700/50 rounded-lg text-white text-sm w-fit h-fit">
                <Image src="/disable.svg" alt="Delete" width={20} height={20} />
              </button>
              <button className="px-4 py-2 bg-gray-700/50 rounded-lg text-white text-sm w-fit h-fit">
                <Image src="/delete.svg" alt="Delete" width={20} height={20} />
              </button>
            </div>
            <div className="text-gray-400 text-sm mt-6">
              {event?.description}
            </div>
            <div className="flex justify-between items-center gap-4 mt-2">
              <div className="space-y-4 border-b border-gray-700 p-4 bg-gray-700/50 rounded-lg flex-1">
                <div className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path
                      d="M6 2V6M14 2V6M3 10H17M5 4H15C16.1046 4 17 4.89543 17 6V16C17 17.1046 16.1046 18 15 18H5C3.89543 18 3 17.1046 3 16V6C3 4.89543 3.89543 4 5 4Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="text-white">
                    {formatDateRange(event.startDate, event.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path
                      d="M10 2C7.79086 2 6 3.79086 6 6C6 8.20914 7.79086 10 10 10C12.2091 10 14 8.20914 14 6C14 3.79086 12.2091 2 10 2ZM10 12C6.68629 12 4 13.7909 4 16V18H16V16C16 13.7909 13.3137 12 10 12Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-white">
                    {event.category && event.subCategory
                      ? `${event.category}, ${event.subCategory}`
                      : event.category ||
                        event.subCategory ||
                        'Sports, Baseball'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-gray-400"
                  >
                    <path
                      d="M10 10C11.3807 10 12.5 8.88071 12.5 7.5C12.5 6.11929 11.3807 5 10 5C8.61929 5 7.5 6.11929 7.5 7.5C7.5 8.88071 8.61929 10 10 10Z"
                      fill="currentColor"
                    />
                    <path
                      d="M10 18C14.4183 18 18 14.4183 18 10C18 5.58172 14.4183 2 10 2C5.58172 2 2 5.58172 2 10C2 14.4183 5.58172 18 10 18Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <span className="text-white">{event.location}</span>
                </div>
              </div>

              {/* Policy and Organizer */}
              <div className="flex flex-col gap-4">
                {event.policy && (
                  <div className="px-4 py-2 bg-gray-700/50 rounded-lg">
                    <span className="text-gray-400 text-sm">Policy</span>
                    <p className="text-white text-sm mt-1">{event.policy}</p>
                  </div>
                )}
                {event.organizer && (
                  <div className="px-4 py-2 bg-gray-700/50 rounded-lg flex flex-col gap-2">
                    <span className="text-gray-400 text-sm">Organizer</span>
                    <div className="flex items-center gap-2">
                      {event.organizerLogo && (
                        <Image
                          src={'/event-logo.svg'}
                          alt={event.organizer}
                          width={20}
                          height={20}
                          className="rounded"
                        />
                      )}
                      <span className="text-white text-sm">
                        {event.organizer}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-[222px] shrink-0">
            {/* Event Summary */}
            <div
              className=" relative p-5 rounded-xl transition-all duration-300 ease-out bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(68.68%_83.22%_at_50%_100%,rgba(0,133,254,0.2)_0%,rgba(0,133,254,0)_100%)] 
    border border-solid border-[#343A44] backdrop-blur-[50px]"
            >
              {/* Starry background effect */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-32 right-16 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-48 left-12 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-32 right-20 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-20 left-24 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute top-24 right-8 w-1 h-1 bg-white rounded-full"></div>
                <div className="absolute bottom-40 left-16 w-1 h-1 bg-white rounded-full"></div>
              </div>

              <div className="relative z-10">
                <h2 className="text-white text-lg font-semibold mb-6">
                  Event Summary
                </h2>

                <div className="space-y-4">
                  {/* Total Tickets Sold Card */}
                  <EventCard
                    icon="/ticket.svg"
                    title="Total Tickets Sold"
                    value="2,000"
                  />
                  {/* Total Revenue Card */}
                  <EventCard
                    icon="/revenue.svg"
                    title="Total Revenue"
                    value="2,000"
                  />

                  {/* Unique Attendees Card */}
                  <EventCard
                    icon="/unique.svg"
                    title="Unique Attendees"
                    value="1,398"
                  />
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 12L6 8L10 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  </div>
                  <button className="text-gray-400 hover:text-white transition-colors">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M6 4L10 8L6 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {/* Teams Section */}
          <div className="flex gap-4">
            {teams.length > 0 && (
              <div className="bg-gray-800/50 border w-[400px] border-[#343A44] rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-lg font-semibold">Teams</h2>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    See all
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {teams.map((team: any, index: number) => (
                    <div key={index} className="flex  items-center gap-2">
                      {team.logo && (
                        <Image
                          src={'/event-logo.svg'}
                          alt={team.name || 'Team'}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                      )}
                      <span className="text-white">{team.name || 'Team'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="bg-gray-800/50 border flex-1 border-[#343A44] rounded-lg p-6 mb-6">
                <h2 className="text-white text-lg font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => {
                    const colors = [
                      'bg-red-500/20 text-red-400',
                      'bg-green-500/20 text-green-400',
                      'bg-purple-500/20 text-purple-400',
                      'bg-orange-500/20 text-orange-400',
                      'bg-blue-500/20 text-blue-400',
                      'bg-cyan-500/20 text-cyan-400',
                      'bg-emerald-500/20 text-emerald-400',
                      'bg-teal-500/20 text-teal-400',
                      'bg-pink-500/20 text-pink-400',
                    ]
                    const colorClass =
                      colors[index % colors.length] ||
                      'bg-gray-500/20 text-gray-400'
                    return (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
                      >
                        {tag}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tabbed Interface */}
          <div className="bg-gray-800/50 border border-[#343A44] rounded-lg">
            {/* Tabs */}
            <div className="border-b border-[#343A44]">
              <div className="flex gap-1 px-4">
                {[
                  'Ticket Collections',
                  'Ticket Categories',
                  'Attendee List',
                  'Promotions / Discounts',
                  'Seat chart',
                ].map((tab, index) => (
                  <button
                    key={tab}
                    className={`px-4 py-3 text-sm font-medium transition-colors ${
                      index === 0
                        ? 'text-white border-b-2 border-blue-500'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-lg font-semibold">
                  Ticket Collection
                </h3>
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3 3H17V17H3V3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 7H13M7 11H13M7 15H10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors">
                    + Attach Collection
                  </button>
                </div>
              </div>
              <div className="text-center py-12 text-gray-400">
                <p className="mb-2">No Ticket Collection Attached</p>
                <p className="text-sm">
                  Attach a ticket collection to enable publishing and sales.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Event Summary Sidebar */}
      </div>
    </div>
  )
}
