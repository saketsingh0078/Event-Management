'use client';

import { useState, useRef, useEffect } from 'react';
import { useDeleteEvent } from '../hooks/use-events';
import type { Event } from '@/db/schema';

interface EventActionsDropdownProps {
  event: Event;
  onEdit: (event: Event) => void;
}

export function EventActionsDropdown({
  event,
  onEdit,
}: EventActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const deleteEvent = useDeleteEvent();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDelete = async () => {
    if (
      confirm(
        `Are you sure you want to delete "${event.name}"? This action cannot be undone.`,
      )
    ) {
      try {
        await deleteEvent.mutateAsync(event.id);
        setIsOpen(false);
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event. Please try again.');
      }
    }
  };

  const handleEdit = () => {
    onEdit(event);
    setIsOpen(false);
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="text-gray-400 hover:text-white cursor-pointer"
        type="button"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="10" cy="4" r="1.5" fill="currentColor" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" />
          <circle cx="10" cy="16" r="1.5" fill="currentColor" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="py-1 flex flex-col gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }}
              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
              type="button"
            >
              Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={deleteEvent.isPending}
              className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              type="button"
            >
              {deleteEvent.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
