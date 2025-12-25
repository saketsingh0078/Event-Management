"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Event } from "@/db/schema";
import type { CreateEventInput, UpdateEventInput } from "@/app/lib/validations/event";

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

type EventsResponse = {
  events: Event[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type EventFilters = {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

async function fetchEvents(filters?: EventFilters): Promise<EventsResponse> {
  const params = new URLSearchParams();
  if (filters?.status) params.append("status", filters.status);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const response = await fetch(`/api/events?${params.toString()}`);
  
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response. This usually means the database is not configured. Please check your DATABASE_URL environment variable. Response: ${text.substring(0, 200)}`);
  }

  const result: ApiResponse<EventsResponse> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || result.message || "Failed to fetch events");
  }

  return result.data;
}

async function fetchEvent(id: number): Promise<Event> {
  const response = await fetch(`/api/events/${id}`);
  
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response. This usually means the database is not configured. Please check your DATABASE_URL environment variable. Response: ${text.substring(0, 200)}`);
  }

  const result: ApiResponse<Event> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || result.message || "Failed to fetch event");
  }

  return result.data;
}

async function createEvent(data: CreateEventInput): Promise<Event> {
  const response = await fetch("/api/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response. This usually means the database is not configured. Please check your DATABASE_URL environment variable. Response: ${text.substring(0, 200)}`);
  }

  const result: ApiResponse<Event> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || result.message || "Failed to create event");
  }

  return result.data;
}

async function updateEvent(
  id: number,
  data: UpdateEventInput
): Promise<Event> {
  const response = await fetch(`/api/events/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response. This usually means the database is not configured. Please check your DATABASE_URL environment variable. Response: ${text.substring(0, 200)}`);
  }

  const result: ApiResponse<Event> = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error || result.message || "Failed to update event");
  }

  return result.data;
}

async function deleteEvent(id: number): Promise<void> {
  const response = await fetch(`/api/events/${id}`, {
    method: "DELETE",
  });

  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    throw new Error(`Server returned non-JSON response. This usually means the database is not configured. Please check your DATABASE_URL environment variable. Response: ${text.substring(0, 200)}`);
  }

  const result: ApiResponse<{ message: string }> = await response.json();

  if (!result.success) {
    throw new Error(result.error || result.message || "Failed to delete event");
  }
}

export function useEvents(filters?: EventFilters) {
  return useQuery({
    queryKey: ["events", filters],
    queryFn: () => fetchEvents(filters),
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateEventInput }) =>
      updateEvent(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", variables.id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
    },
  });
}

