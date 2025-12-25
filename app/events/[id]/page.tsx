'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEvent, useDeleteEvent } from '../../hooks/use-events';
import { formatEventDate } from '../../utils/date';
import EventCard from '@/app/components/event-card';
import { EventDetailShimmer } from '@/app/components/event-detail-shimmer';
import { CreateEventModal } from '@/app/components/create-event-modal';

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function EventDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const eventId = parseInt(id, 10);
  const { data: event, isLoading, error } = useEvent(eventId);
  const deleteEvent = useDeleteEvent();
  const [imageError, setImageError] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const [organizerLogoError, setOrganizerLogoError] = useState(false);
  const [teamLogoErrors, setTeamLogoErrors] = useState<Record<number, boolean>>(
    {},
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  if (isLoading) {
    return <EventDetailShimmer />;
  }

  if (error || !event) {
    return (
      <div className="w-full py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">Event not found</div>
        </div>
      </div>
    );
  }

  const teams = event.teams
    ? typeof event.teams === 'string'
      ? JSON.parse(event.teams)
      : event.teams
    : [];
  const tags = event.tags
    ? typeof event.tags === 'string'
      ? JSON.parse(event.tags)
      : event.tags
    : [];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'bg-green-500';
      case 'cancelled':
        return 'bg-red-500';
      case 'completed':
        return 'bg-gray-500';
      case 'ongoing':
        return 'bg-blue-500';
      case 'draft':
        return 'bg-gray-400';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatDateRange = (
    startDate: Date | string,
    endDate: Date | string,
  ) => {
    const start =
      typeof startDate === 'string' ? new Date(startDate) : startDate;
    const end = typeof endDate === 'string' ? new Date(endDate) : endDate;

    const startFormatted = formatEventDate(start);
    const endFormatted = formatEventDate(end);

    return `${startFormatted} - ${endFormatted} (${event.timezone || 'GMT-6'})`;
  };

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete "${event.name}"? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteEvent.mutateAsync(event.id);
        router.push('/events');
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  return (
    <div className="w-full py-10 px-4 sm:px-6 lg:px-8">
      <div className="flex gap-6 flex-col">
        <div className="flex gap-6 flex-col lg:flex-row">
          <div
            className="flex-1 p-5 rounded-xl  bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(68.68%_83.22%_at_50%_100%,rgba(0,133,254,0.2)_0%,rgba(0,133,254,0)_100%)]
             border border-solid border-[#343A44] backdrop-blur-[50px]"
          >
            <div className="relative w-[60%] h-64 rounded-lg overflow-hidden">
              <Image
                src={
                  event.imageUrl && !imageError
                    ? event.imageUrl
                    : '/event-image.svg'
                }
                alt={event.name}
                width={1200}
                height={256}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            </div>
            <div className="absolute top-[35%] left-[2%] w-30 h-30 border-8 rounded-full border-[#1E232A]/90 overflow-hidden flex items-center justify-center ">
              <Image
                src={
                  event.logoUrl && !logoError
                    ? event.logoUrl
                    : '/event-logo.svg'
                }
                alt={event.name}
                width={150}
                height={150}
                className="object-cover"
                onError={() => setLogoError(true)}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <h1 className="ml-35 text-white text-2xl font-semibold w-[35%] overflow-hidden text-ellipsis line-clamp-2">
                {event?.name}
              </h1>
              <span className="bg-[linear-gradient(91.18deg,rgba(255,255,255,0.1)_2.64%,rgba(255,255,255,0.05)_95.85%)] rounded-lg text-white text-sm w-fit h-fit px-2 py-1 flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(
                    event?.status,
                  )}`}
                ></div>
                {getStatusLabel(event?.status)}
              </span>
              <button
                onClick={handleEdit}
                className="px-4 cursor-pointer  py-2 bg-[linear-gradient(91.18deg,rgba(255,255,255,0.1)_2.64%,rgba(255,255,255,0.05)_95.85%)] rounded-lg text-white text-sm w-fit h-fit hover:bg-gray-700/50 transition-colors"
              >
                <Image src="/edit.svg" alt="Edit" width={20} height={20} />
              </button>
              <button className="px-4  py-2 bg-[linear-gradient(91.18deg,rgba(255,255,255,0.1)_2.64%,rgba(255,255,255,0.05)_95.85%)] rounded-lg text-white text-sm w-fit h-fit hover:bg-gray-700/50 transition-colors">
                <Image
                  src="/disable.svg"
                  alt="Disable"
                  width={20}
                  height={20}
                />
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteEvent.isPending}
                className="px-4 cursor-pointer py-2 bg-[linear-gradient(91.18deg,rgba(255,255,255,0.1)_2.64%,rgba(255,255,255,0.05)_95.85%)] rounded-lg text-white text-sm w-fit h-fit hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Image src="/delete.svg" alt="Delete" width={20} height={20} />
              </button>
            </div>
            <div className="text-gray-400 text-base mt-6">
              {event?.description}
            </div>
            <div className="flex justify-between items-center gap-4 mt-2 ">
              <div className="space-y-4 border-b border-gray-700 p-4 bg-gray-700/50 rounded-lg flex-1">
                <div className="flex items-center gap-3">
                  <Image
                    src="/timeline.svg"
                    alt="Timeline"
                    width={24}
                    height={24}
                    className="text-gray-400"
                  />
                  <span className="text-white">
                    {formatDateRange(event.startDate, event.endDate)}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/group.svg"
                    alt="Category"
                    width={24}
                    height={24}
                    className="text-gray-400"
                  />
                  <span className="text-white">
                    {event.category && event.subCategory
                      ? `${event.category}, ${event.subCategory}`
                      : event.category ||
                        event.subCategory ||
                        'Sports, Baseball'}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Image
                    src="/location.svg"
                    alt="Location"
                    width={24}
                    height={24}
                    className="text-gray-400"
                  />
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
                      <Image
                        src={
                          event.organizerLogo && !organizerLogoError
                            ? event.organizerLogo
                            : '/event-logo.svg'
                        }
                        alt={event.organizer}
                        width={20}
                        height={20}
                        className="rounded-full"
                        onError={() => setOrganizerLogoError(true)}
                      />
                      <span className="text-white text-sm">
                        {event.organizer}
                      </span>
                    </div>
                  </div>
                )}
                {event.nftMintAddress && (
                  <div className="px-4 py-2  from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-lg flex flex-col gap-2">
                    <span className="text-purple-300 text-sm font-medium">
                      NFT Certificate
                    </span>
                    <div className="flex items-center gap-2">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-purple-400"
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
                      <a
                        href={`https://solscan.io/token/${event.nftMintAddress}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-300 text-sm hover:text-purple-200 underline truncate max-w-[200px]"
                        title={event.nftMintAddress}
                      >
                        {event.nftMintAddress.slice(0, 8)}...
                        {event.nftMintAddress.slice(-8)}
                      </a>
                    </div>
                    <p className="text-gray-400 text-xs mt-1">
                      View on Solscan (Devnet)
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="w-full shrink-0 lg:w-[222px]">
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
                    value={event.ticketsSold?.toString() || '0'}
                  />
                  {/* Total Revenue Card */}
                  <EventCard
                    icon="/revenue.svg"
                    title="Total Revenue"
                    value={event.totalRevenue?.toString() || '0'}
                  />

                  {/* Unique Attendees Card */}
                  <EventCard
                    icon="/unique.svg"
                    title="Unique Attendees"
                    value={event.uniqueAttendees?.toString() || '0'}
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
              <div className="bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(59.96%_88.85%_at_100%_99.92%,rgba(0,133,254,0.1)_0%,rgba(0,133,254,0)_100%)] border w-[400px] border-[#343A44] rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-white text-lg font-semibold">Teams</h2>
                  <button className="text-blue-400 hover:text-blue-300 text-sm">
                    See all
                  </button>
                </div>
                <div className="flex flex-col gap-4">
                  {teams.map((team: any, index: number) => (
                    <div key={index} className="flex  items-center gap-2">
                      <Image
                        src={
                          team.logo && !teamLogoErrors[index]
                            ? team.logo
                            : '/event-logo.svg'
                        }
                        alt={team.name || 'Team'}
                        width={24}
                        height={24}
                        className="rounded-full"
                        onError={() =>
                          setTeamLogoErrors((prev) => ({
                            ...prev,
                            [index]: true,
                          }))
                        }
                      />
                      <span className="text-white">{team.name || 'Team'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div className="bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(59.96%_88.85%_at_100%_99.92%,rgba(0,133,254,0.1)_0%,rgba(0,133,254,0)_100%)] border flex-1 border-[#343A44] rounded-lg p-6 mb-6">
                <h2 className="text-white text-lg font-semibold mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string, index: number) => {
                    const colors = [
                      'bg-red-500/20 bg-[linear-gradient(91.18deg,rgba(241,81,80,0.1)_2.64%,rgba(241,81,80,0.05)_95.85%)]',
                      'bg-green-500/20 bg-[linear-gradient(91.18deg,rgba(47,193,109,0.1)_2.64%,rgba(47,193,109,0.05)_95.85%)]',
                      'bg-purple-500/20 bg-[linear-gradient(91.18deg,rgba(118,67,205,0.1)_2.64%,rgba(118,67,205,0.05)_95.85%)]',
                      'bg-orange-500/20 bg-[linear-gradient(91.18deg,rgba(252,142,10,0.1)_2.64%,rgba(252,142,10,0.05)_95.85%)]',
                      'bg-blue-500/20 bg-[linear-gradient(91.18deg,rgba(0,181,212,0.1)_2.64%,rgba(0,181,212,0.05)_95.85%)]',
                      'bg-cyan-500/20 bg-[linear-gradient(91.18deg,rgba(0,133,254,0.1)_2.64%,rgba(0,133,254,0.05)_95.85%)]',
                      'bg-emerald-500/20 bg-[linear-gradient(91.18deg,rgba(216,166,72,0.1)_2.64%,rgba(216,166,72,0.05)_95.85%)]',
                      'bg-teal-500/20 bg-[linear-gradient(91.18deg,rgba(116,170,80,0.1)_2.64%,rgba(116,170,80,0.05)_95.85%)]',
                      'bg-pink-500/20 bg-[linear-gradient(91.18deg,rgba(215,91,143,0.1)_2.64%,rgba(215,91,143,0.05)_95.85%)]',
                    ];
                    const colorClass =
                      colors[index % colors.length] ||
                      'bg-gray-500/20 text-gray-400';
                    return (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}
                      >
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tabbed Interface */}
          <div className="bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(69.98%_541.77%_at_100%_0%,rgba(35,98,201,0.06)_0%,rgba(35,98,201,0)_100%)] border border-[#343A44] rounded-lg p-6">
            <div className="bg-gray-800/50 border border-[#343A44] rounded-lg">
              {/* Tabs */}
              <div className="px-4 py-2">
                <div className="flex gap-1">
                  {[
                    'Ticket Collections',
                    'Ticket Categories',
                    'Attendee List',
                    'Promotions / Discounts',
                    'Seat chart',
                  ].map((tab, index) => (
                    <button
                      key={tab}
                      className={`px-4 py-2 text-sm font-medium transition-all rounded-lg ${
                        index === 0
                          ? 'text-white bg-gray-700/80 shadow-sm'
                          : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
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

      {/* Edit Event Modal */}
      <CreateEventModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        event={event}
      />
    </div>
  );
}
