'use client';

import { useState, useEffect } from 'react';
import { useCreateEvent, useUpdateEvent } from '../hooks/use-events';
import { motion, AnimatePresence } from 'framer-motion';
import { createEventSchema } from '../lib/validations/event';
import type {
  CreateEventInput,
  UpdateEventInput,
} from '../lib/validations/event';
import type { Event } from '@/db/schema';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  event?: Event | null; // For editing
}

export function CreateEventModal({
  isOpen,
  onClose,
  onSuccess,
  event,
}: CreateEventModalProps) {
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const isEditMode = !!event;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [organizerLogoPreview, setOrganizerLogoPreview] = useState<string>('');
  const [tagsInput, setTagsInput] = useState<string>('');
  const [formData, setFormData] = useState<Partial<CreateEventInput>>({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    category: '',
    subCategory: '',
    status: 'draft',
    ticketsSold: 0,
    totalRevenue: 0,
    uniqueAttendees: 0,
    imageUrl: '',
    logoUrl: '',
    policy: '',
    organizer: '',
    organizerLogo: '',
    teams: [],
    tags: [],
    timezone: 'GMT-6',
  });

  // Populate form when editing
  useEffect(() => {
    if (isOpen && event) {
      const startDate = event.startDate
        ? new Date(event.startDate).toISOString().slice(0, 16)
        : '';
      const endDate = event.endDate
        ? new Date(event.endDate).toISOString().slice(0, 16)
        : '';

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

      setFormData({
        name: event.name || '',
        description: event.description || '',
        startDate,
        endDate,
        location: event.location || '',
        category: event.category || '',
        subCategory: event.subCategory || '',
        status:
          (event.status as
            | 'draft'
            | 'upcoming'
            | 'ongoing'
            | 'completed'
            | 'cancelled') || 'draft',
        ticketsSold: event.ticketsSold || 0,
        totalRevenue: event.totalRevenue || 0,
        uniqueAttendees: event.uniqueAttendees || 0,
        imageUrl: event.imageUrl || '',
        logoUrl: event.logoUrl || '',
        policy: event.policy || '',
        organizer: event.organizer || '',
        organizerLogo: event.organizerLogo || '',
        teams,
        tags,
        timezone: event.timezone || 'GMT-6',
      });
      setTagsInput(tags.join(', '));
      setOrganizerLogoPreview(event.organizerLogo || '');
    } else if (!isOpen) {
      // Reset form when modal closes
      setFormData({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        location: '',
        category: '',
        subCategory: '',
        status: 'draft',
        ticketsSold: 0,
        totalRevenue: 0,
        uniqueAttendees: 0,
        imageUrl: '',
        logoUrl: '',
        policy: '',
        organizer: '',
        organizerLogo: '',
        teams: [],
        tags: [],
        timezone: 'GMT-6',
      });
      setErrors({});
      setOrganizerLogoPreview('');
      setTagsInput('');
    }
  }, [isOpen, event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      // Convert datetime-local format to ISO string
      const submitData = {
        ...formData,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : '',
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : '',
      };
      const validated = createEventSchema.parse(submitData);

      if (isEditMode && event) {
        await updateEvent.mutateAsync({
          id: event.id,
          data: validated as UpdateEventInput,
        });
      } else {
        await createEvent.mutateAsync(validated);
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as {
          issues: Array<{ path: string[]; message: string }>;
        };
        const newErrors: Record<string, string> = {};
        zodError.issues.forEach((issue) => {
          const path = issue.path[0] as string;
          newErrors[path] = issue.message;
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        setErrors({ submit: error.message });
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    if (
      name === 'ticketsSold' ||
      name === 'totalRevenue' ||
      name === 'uniqueAttendees'
    ) {
      // For number inputs, parse the value
      // Allow empty string to be converted to 0, or parse valid numbers
      const numValue = value === '' ? 0 : parseInt(value, 10);
      if (!isNaN(numValue) && numValue >= 0) {
        setFormData((prev) => ({
          ...prev,
          [name]: numValue,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Update organizer logo preview
    if (name === 'organizerLogo') {
      setOrganizerLogoPreview(value);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTagsInput(value);

    // Split by comma and trim each tag, but keep the input value
    const tags = value
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    setFormData((prev) => ({
      ...prev,
      tags: tags.length > 0 ? tags : [],
    }));
  };

  const removeTag = (indexToRemove: number) => {
    const newTags =
      formData.tags?.filter((_, index) => index !== indexToRemove) || [];
    setFormData((prev) => ({
      ...prev,
      tags: newTags,
    }));
    // Update input to reflect removed tag
    setTagsInput(newTags.join(', '));
  };

  const addTeam = () => {
    setFormData((prev) => ({
      ...prev,
      teams: [...(prev.teams || []), { name: '', logo: '' }],
    }));
  };

  const removeTeam = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      teams: prev.teams?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateTeam = (index: number, field: 'name' | 'logo', value: string) => {
    setFormData((prev) => {
      const teams = [...(prev.teams || [])];
      teams[index] = { ...teams[index], [field]: value };
      return { ...prev, teams };
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto pointer-events-auto"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white">
                    {isEditMode ? 'Edit Event' : 'Create New Event'}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18 6L6 18M6 6L18 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Event Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.description && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  {/* Event Banner Image */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Event Banner Image
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        placeholder="Paste image URL"
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.imageUrl && (
                        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-600">
                          <img
                            src={formData.imageUrl}
                            alt="Event banner preview"
                            className="w-full h-full object-cover"
                            onError={() => {
                              setErrors((prev) => ({
                                ...prev,
                                imageUrl: 'Failed to load image',
                              }));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                imageUrl: '',
                              }));
                            }}
                            className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                          >
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 16 16"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 4L4 12M4 4L12 12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      {errors.imageUrl && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.imageUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Event Logo */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Event Logo
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="logoUrl"
                        value={formData.logoUrl}
                        onChange={handleChange}
                        placeholder="Paste logo URL"
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {formData.logoUrl && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
                          <img
                            src={formData.logoUrl}
                            alt="Event logo preview"
                            className="w-full h-full object-cover"
                            onError={() => {
                              setErrors((prev) => ({
                                ...prev,
                                logoUrl: 'Failed to load image',
                              }));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({ ...prev, logoUrl: '' }));
                            }}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 3L3 9M3 3L9 9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      {errors.logoUrl && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.logoUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Start Date *
                      </label>
                      <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.startDate && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.startDate}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        End Date *
                      </label>
                      <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      {errors.endDate && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.endDate}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    {errors.location && (
                      <p className="text-red-400 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g., Sports"
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Sub Category
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        placeholder="e.g., Baseball"
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Tickets Sold
                      </label>
                      <input
                        type="number"
                        name="ticketsSold"
                        value={formData.ticketsSold ?? ''}
                        onChange={handleChange}
                        min="0"
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Total Revenue
                      </label>
                      <input
                        type="number"
                        name="totalRevenue"
                        value={formData.totalRevenue ?? ''}
                        onChange={handleChange}
                        min="0"
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-white">
                        Unique Attendees
                      </label>
                      <input
                        type="number"
                        name="uniqueAttendees"
                        value={formData.uniqueAttendees ?? ''}
                        onChange={handleChange}
                        min="0"
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Organizer
                    </label>
                    <input
                      type="text"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Organizer Logo */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Organizer Logo
                    </label>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="organizerLogo"
                        value={formData.organizerLogo}
                        onChange={handleChange}
                        placeholder="Paste organizer logo URL"
                        className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {organizerLogoPreview && (
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-600">
                          <img
                            src={organizerLogoPreview}
                            alt="Organizer logo preview"
                            className="w-full h-full object-cover"
                            onError={() => {
                              setErrors((prev) => ({
                                ...prev,
                                organizerLogo: 'Failed to load image',
                              }));
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                organizerLogo: '',
                              }));
                              setOrganizerLogoPreview('');
                            }}
                            className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1"
                          >
                            <svg
                              width="12"
                              height="12"
                              viewBox="0 0 12 12"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M9 3L3 9M3 3L9 9"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                        </div>
                      )}
                      {errors.organizerLogo && (
                        <p className="text-red-400 text-sm mt-1">
                          {errors.organizerLogo}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Teams */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-white">
                        Teams
                      </label>
                      <button
                        type="button"
                        onClick={addTeam}
                        className="text-sm text-blue-400 hover:text-blue-300"
                      >
                        + Add Team
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.teams && formData.teams.length > 0 ? (
                        formData.teams.map((team, index) => (
                          <div
                            key={index}
                            className="flex gap-3 items-start p-3 bg-gray-700/50 rounded-lg"
                          >
                            <div className="flex-1 space-y-2">
                              <input
                                type="text"
                                placeholder="Team name"
                                value={team.name}
                                onChange={(e) =>
                                  updateTeam(index, 'name', e.target.value)
                                }
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                              <input
                                type="text"
                                placeholder="Team logo URL (optional)"
                                value={team.logo || ''}
                                onChange={(e) =>
                                  updateTeam(index, 'logo', e.target.value)
                                }
                                className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeTeam(index)}
                              className="text-red-400 hover:text-red-300 mt-2"
                            >
                              <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 20"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M5 5L15 15M15 5L5 15"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 text-sm">
                          No teams added. Click "Add Team" to add one.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={handleTagsChange}
                      placeholder="Enter tags separated by commas (e.g., sports, baseball, live)"
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-gray-400 text-xs mt-1">
                      Separate multiple tags with commas
                    </p>
                    {formData.tags && formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-600/20 text-blue-300 rounded text-sm flex items-center gap-1"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => removeTag(index)}
                              className="hover:text-blue-100"
                            >
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 12 12"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 3L3 9M3 3L9 9"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-white">
                      Policy
                    </label>
                    <input
                      type="text"
                      name="policy"
                      value={formData.policy}
                      onChange={handleChange}
                      className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {errors.submit && (
                    <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                      <p className="text-red-400">{errors.submit}</p>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 cursor-pointer bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createEvent.isPending || updateEvent.isPending}
                      className="flex-1 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createEvent.isPending || updateEvent.isPending
                        ? isEditMode
                          ? 'Updating...'
                          : 'Creating...'
                        : isEditMode
                          ? 'Update Event'
                          : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
