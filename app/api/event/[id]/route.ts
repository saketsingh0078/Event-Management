import { NextRequest, NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/app/lib/api-response";
import { deleteEvent, getEventById, updateEvent } from "@/app/lib/services/event-service";
import { updateEventSchema } from "@/app/lib/validations/event";

type RouteParams = {
    params: Promise<{ id: string }>;
  };

export async function GET(
    request: NextRequest,
    { params }: RouteParams
  ) {
    try {
      console.log("params", params);
      const { id } = await params;
      console.log("id", id);
      const eventId = parseInt(id, 10);
  
      if (isNaN(eventId)) {
        return NextResponse.json(
          errorResponse("VALIDATION_ERROR", "Invalid event ID"),
          { status: 400 }
        );
      }
  
      const event = await getEventById(eventId);
  
      if (!event) {
        return NextResponse.json(
          errorResponse("NOT_FOUND", "Event not found"),
          { status: 404 }
        );
      }
  
      return NextResponse.json(successResponse(event));
    } catch (error) {
      console.error("Error in GET /api/events/[id]:", error);
      if (error instanceof Error) {
        if (error.message.includes("DATABASE_URL") || error.message.includes("database")) {
          return NextResponse.json(
            errorResponse("DATABASE_ERROR", "Database connection failed. Please check your DATABASE_URL environment variable."),
            { status: 500 }
          );
        }
        return NextResponse.json(
          errorResponse("INTERNAL_ERROR", error.message),
          { status: 500 }
        );
      }
      return NextResponse.json(
        errorResponse("INTERNAL_ERROR", "An unknown error occurred"),
        { status: 500 }
      );
    }
}


export async function PUT(
    request: NextRequest,
    { params }: RouteParams
  ) {
    try {
      const { id } = await params;
      const eventId = parseInt(id, 10);
  
      if (isNaN(eventId)) {
        return NextResponse.json(
          errorResponse("VALIDATION_ERROR", "Invalid event ID"),
          { status: 400 }
        );
      }
  
      const body = await request.json();
      const validatedData = updateEventSchema.parse(body);
  
      const updateData: Record<string, unknown> = {};
  
      if (validatedData.name !== undefined) updateData.name = validatedData.name;
      if (validatedData.description !== undefined)
        updateData.description = validatedData.description;
      if (validatedData.startDate !== undefined)
        updateData.startDate = new Date(validatedData.startDate);
      if (validatedData.endDate !== undefined)
        updateData.endDate = new Date(validatedData.endDate);
      if (validatedData.location !== undefined)
        updateData.location = validatedData.location;
      if (validatedData.category !== undefined)
        updateData.category = validatedData.category;
      if (validatedData.subCategory !== undefined)
        updateData.subCategory = validatedData.subCategory;
      if (validatedData.status !== undefined)
        updateData.status = validatedData.status;
      if (validatedData.ticketsSold !== undefined)
        updateData.ticketsSold = validatedData.ticketsSold;
      if (validatedData.totalRevenue !== undefined)
        updateData.totalRevenue = validatedData.totalRevenue;
      if (validatedData.uniqueAttendees !== undefined)
        updateData.uniqueAttendees = validatedData.uniqueAttendees;
      if (validatedData.imageUrl !== undefined)
        updateData.imageUrl = validatedData.imageUrl || null;
      if (validatedData.logoUrl !== undefined)
        updateData.logoUrl = validatedData.logoUrl || null;
      if (validatedData.policy !== undefined)
        updateData.policy = validatedData.policy || null;
      if (validatedData.organizer !== undefined)
        updateData.organizer = validatedData.organizer || null;
      if (validatedData.organizerLogo !== undefined)
        updateData.organizerLogo = validatedData.organizerLogo || null;
      if (validatedData.teams !== undefined)
        updateData.teams = validatedData.teams
          ? JSON.stringify(validatedData.teams)
          : null;
      if (validatedData.tags !== undefined)
        updateData.tags = validatedData.tags
          ? JSON.stringify(validatedData.tags)
          : null;
      if (validatedData.timezone !== undefined)
        updateData.timezone = validatedData.timezone;
  
      const updatedEvent = await updateEvent(eventId, updateData);
  
      if (!updatedEvent) {
        return NextResponse.json(
          errorResponse("NOT_FOUND", "Event not found"),
          { status: 404 }
        );
      }
  
      return NextResponse.json(successResponse(updatedEvent));
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === "ZodError") {
          return NextResponse.json(
            errorResponse("VALIDATION_ERROR", error.message),
            { status: 400 }
          );
        }
        return NextResponse.json(
          errorResponse("INTERNAL_ERROR", error.message),
          { status: 500 }
        );
      }
      return NextResponse.json(
        errorResponse("INTERNAL_ERROR", "An unknown error occurred"),
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    request: NextRequest,
    { params }: RouteParams
  ) {
    try {
      console.log("params", params);
      const { id } = await params;
      console.log("id", id);
      const eventId = parseInt(id, 10);
  
      if (isNaN(eventId)) {
        return NextResponse.json(
          errorResponse("VALIDATION_ERROR", "Invalid event ID"),
          { status: 400 }
        );
      }
  
      const deleted = await deleteEvent(eventId);
  
      if (!deleted) {
        return NextResponse.json(
          errorResponse("NOT_FOUND", "Event not found"),
          { status: 404 }
        );
      }
  
      return NextResponse.json(successResponse({ message: "Event deleted successfully" }));
    } catch (error) {
      console.error("Error in GET /api/events/[id]:", error);
      if (error instanceof Error) {
        if (error.message.includes("DATABASE_URL") || error.message.includes("database")) {
          return NextResponse.json(
            errorResponse("DATABASE_ERROR", "Database connection failed. Please check your DATABASE_URL environment variable."),
            { status: 500 }
          );
        }
        return NextResponse.json(
          errorResponse("INTERNAL_ERROR", error.message),
          { status: 500 }
        );
      }
      return NextResponse.json(
        errorResponse("INTERNAL_ERROR", "An unknown error occurred"),
        { status: 500 }
      );
    }
  }
  
  