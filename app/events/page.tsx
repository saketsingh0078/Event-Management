'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEvents } from '../hooks/use-events';
import { StatCard } from '../components/card';
import { DataTable } from '../components/data-table';
import { CreateEventModal } from '../components/create-event-modal';
import { EventActionsDropdown } from '../components/event-actions-dropdown';
import { ColumnDef } from '@tanstack/react-table';
import type { Event } from '@/db/schema';
import { formatEventDate, getDateRange } from '../utils/date';
import { formatNumber } from '../utils/number';

const EventsPage = () => {
  const router = useRouter();
  const [selectedRange, setSelectedRange] = useState('Custom');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const limit = 10;

  // Get date range based on selectedRange
  const dateRange = getDateRange(selectedRange);

  const { data, isLoading, error } = useEvents({
    page,
    limit,
    search: search || undefined,
    status: statusFilter || undefined,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
  });

  const events = data?.events || [];
  const pagination = data?.pagination;

  const stats = {
    total: pagination?.total || 0,
    upcoming: events.filter((e) => e.status === 'upcoming').length,
    ongoing: events.filter((e) => e.status === 'ongoing').length,
    cancelled: events.filter((e) => e.status === 'cancelled').length,
  };

  const statsData = [
    {
      icon: (
        <Image src="/total-events.svg" alt="Tickets" width={28} height={28} />
      ),
      title: 'Total Events',
      value: stats.total,
      change: Math.floor(Math.random() * 10) + 1,
      changeLabel: 'From last week',
      isPositive: Math.random() > 0.5,
    },
    {
      icon: <Image src="/upcoming.svg" alt="Tickets" width={28} height={28} />,
      title: 'Upcoming Events',
      value: stats.upcoming,
      change: Math.floor(Math.random() * 10) + 1,
      changeLabel: 'From last week',
      isPositive: Math.random() > 0.5,
    },
    {
      icon: <Image src="/ongoing.svg" alt="Tickets" width={28} height={28} />,
      title: 'Ongoing Events',
      value: stats.ongoing,
      change: Math.floor(Math.random() * 10) + 1,
      changeLabel: 'From last week',
      isPositive: Math.random() > 0.5,
    },
    {
      icon: <Image src="/cancelled.svg" alt="Tickets" width={28} height={28} />,
      title: 'Cancelled Events',
      value: stats.cancelled,
      change: Math.floor(Math.random() * 10) + 1,
      changeLabel: 'From last week',
      isPositive: Math.random() > 0.5,
    },
  ];
  const timeRanges = ['1D', '7D', '1M', '3M', 'Custom'];

  // Status color mapping
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
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Event Logo Component with error handling
  const EventLogo = ({
    logoUrl,
    eventName,
  }: {
    logoUrl: string;
    eventName: string;
  }) => {
    const [imageError, setImageError] = useState(false);

    if (!logoUrl || imageError) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-white text-xs font-semibold">
            {eventName.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    // Check if it's a valid URL
    const isValidUrl =
      logoUrl.startsWith('http://') ||
      logoUrl.startsWith('https://') ||
      logoUrl.startsWith('/');

    if (!isValidUrl) {
      return (
        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
          <span className="text-white text-xs font-semibold">
            {eventName.charAt(0).toUpperCase()}
          </span>
        </div>
      );
    }

    return (
      <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
        <Image
          src={logoUrl}
          alt={eventName}
          width={40}
          height={40}
          className="object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  };

  // Table columns definition
  const columns = useMemo<ColumnDef<Event>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Event Name',
        cell: ({ row }) => {
          const event = row.original;
          const teams = event.teams
            ? typeof event.teams === 'string'
              ? JSON.parse(event.teams)
              : event.teams
            : [];
          const logoUrl = event.logoUrl || teams[0]?.logo || '';

          return (
            <div className="flex items-center gap-3">
              <EventLogo logoUrl={logoUrl} eventName={event.name} />
              <span className="text-white truncate max-w-[200px]">
                {event.name}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'startDate',
        header: 'Date & Time',
        cell: ({ row }) => {
          const date = row.original.startDate;
          // Handle both Date objects and ISO strings consistently
          const dateValue =
            date instanceof Date ? date : new Date(date as string);
          return (
            <span className="text-white">{formatEventDate(dateValue)}</span>
          );
        },
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: ({ row }) => {
          return <span className="text-white">{row.original.location}</span>;
        },
      },
      {
        accessorKey: 'ticketsSold',
        header: 'Tickets Sold',
        cell: ({ row }) => {
          return (
            <span className="text-white">
              {formatNumber(row.original.ticketsSold || 0)}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            <div className="flex items-center gap-2 px-2 py-1 border border-[#343A44] rounded-2xl w-fit h-fit">
              <div
                className={`w-2 h-2 rounded-full ${getStatusColor(status)}`}
              />
              <span className="text-white">{getStatusLabel(status)}</span>
            </div>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => {
          return (
            <EventActionsDropdown
              event={row.original}
              onEdit={(event) => setEditingEvent(event)}
            />
          );
        },
      },
    ],
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1); // Reset to first page on search
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setPage(1); // Reset to first page on filter change
  };

  const handleDateRangeChange = (range: string) => {
    setSelectedRange(range);
    setPage(1); // Reset to first page on date range change
  };

  return (
    <div className="w-full py-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8 px-4 sm:px-6 lg:px-8">
        {/* Left side - Title */}
        <h1 className="text-white text-2xl font-semibold">Event Overview</h1>

        {/* Right side - Controls */}
        <div className="flex items-center gap-4 rounded-lg">
          {/* Time Range Selector */}
          <div className="flex items-center bg-gray-800/50 rounded-lg  bg-[linear-gradient(91.18deg,rgba(255,255,255,0.1)_2.64%,rgba(255,255,255,0.05)_95.85%)] p-2 gap-1">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => handleDateRangeChange(range)}
                className={`px-4 cursor-pointer py-2 rounded-md text-sm font-medium  transition-colors ${
                  selectedRange === range
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          {/* Settings Icon */}
          <button className="bg-[linear-gradient(91.18deg,rgba(255,255,255,0.1)_2.64%,rgba(255,255,255,0.05)_95.85%)] p-4 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors">
            <Image src="/setting.svg" alt="Settings" width={20} height={20} />
          </button>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-4 sm:px-6 lg:px-8">
        {isLoading
          ? // Shimmer loading cards
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`shimmer-${index}`}
                className="relative p-5 border border-solid rounded-xl
                backdrop-blur-[50px]
                border-[#343A44]
                bg-[radial-gradient(111.15%_100%_at_49.9%_0%,rgba(198,225,255,0.08)_0%,rgba(198,225,255,0.04)_100%),radial-gradient(50%_77.89%_at_50%_0%,rgba(244,179,1,0.05)_0%,rgba(244,179,1,0)_100%)]"
              >
                <div className="relative flex flex-col gap-[24px]">
                  {/* Icon and Title */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 rounded animate-shimmer"></div>
                    <div className="w-32 h-4 rounded animate-shimmer"></div>
                  </div>
                  {/* Value */}
                  <div className="mb-4">
                    <div className="w-24 h-10 rounded animate-shimmer"></div>
                  </div>
                  {/* Change indicator */}
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded animate-shimmer"></div>
                    <div className="w-12 h-4 rounded animate-shimmer"></div>
                    <div className="w-24 h-3 rounded animate-shimmer"></div>
                  </div>
                </div>
              </div>
            ))
          : // Actual stat cards
            statsData.map((stat) => <StatCard key={stat.title} {...stat} />)}
      </div>

      {/* Events Table Section */}
      <div className="mt-8 px-4 sm:px-6 lg:px-8">
        <DataTable
          columns={columns}
          data={events}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={(event) => {
            router.push(`/events/${event.id}`);
          }}
          renderHeaderActions={() => (
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* Left side - Title with count */}
              <h2 className="text-white text-xl font-semibold">
                Events ({formatNumber(pagination?.total || 0)})
              </h2>

              {/* Right side - Search, Filter, Upload, Create Event */}
              <div className="flex items-center gap-4 w-full sm:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 sm:flex-initial">
                  <Image
                    src="/search.svg"
                    alt="Search"
                    width={16}
                    height={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2"
                  />
                  <input
                    type="text"
                    placeholder="Search by event, location"
                    value={search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full sm:w-[300px] pl-10 pr-4 py-2 bg-gray-800/50 border border-[#343A44] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Filter Button */}
                <div className="relative">
                  <button
                    onClick={() => {
                      // Toggle filter dropdown - you can implement this later
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-[#343A44] rounded-lg text-white hover:bg-gray-700/50 transition-colors"
                  >
                    Filter
                    <Image
                      src="/down-arrow.svg"
                      alt="Filter"
                      width={16}
                      height={16}
                    />
                  </button>
                  {/* Filter dropdown can be added here */}
                </div>

                {/* Upload Icon */}
                <button className="p-2 rounded-lg bg-gray-800/50 border border-[#343A44] hover:bg-gray-700/50 transition-colors">
                  <Image src="/file.svg" alt="Upload" width={20} height={20} />
                </button>

                {/* Create Event Button */}
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M8 3V13M3 8H13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Create Event
                </button>
              </div>
            </div>
          )}
        />
      </div>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />

      {/* Edit Event Modal */}
      <CreateEventModal
        isOpen={!!editingEvent}
        onClose={() => setEditingEvent(null)}
        event={editingEvent}
      />
    </div>
  );
};

export default EventsPage;
