import { getCookie } from "$lib/utils/cookies";
import { API_BASE_URL } from "../utils/config";

export interface TimeSlot {
    id: number;
    startTimeUtc: string;
    endTimeUtc: string;
    isBooked: boolean;
    notes: string | null;
    bookedByUserId: number | null;
    bookedByUserEmail: string | null;
    createdAtUtc: string;
    updatedAtUtc: string;
}

export interface CreateTimeSlotRequest {
    startTimeUtc: string;
    endTimeUtc: string;
    notes?: string | null;
}

export interface CreateBulkTimeSlotsRequest {
    fromUtc: string;
    toUtc: string;
    slotLengthMinutes: number;
}

function authHeaders(): Record<string, string> {
    const token = getCookie("jwt");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Der skete en fejl.");
    }

    const contentType = response.headers.get("content-type");
    if (!contentType?.includes("application/json")) {
        return undefined as T;
    }

    return response.json();
}

export async function getAvailableSlots(): Promise<TimeSlot[]> {
    const response = await fetch(`${API_BASE_URL}/timeslots/available`, {
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function getMyBookings(): Promise<TimeSlot[]> {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function bookSlot(id: number): Promise<TimeSlot> {
    const response = await fetch(`${API_BASE_URL}/timeslots/${id}/book`, {
        method: "POST",
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function cancelBooking(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function getAllTimeSlots(): Promise<TimeSlot[]> {
    const response = await fetch(`${API_BASE_URL}/timeslots`, {
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function createTimeSlot(dto: CreateTimeSlotRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/timeslots`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(dto)
    });
    return handleResponse(response);
}

export async function createBulkTimeSlots(dto: CreateBulkTimeSlotsRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/timeslots/bulk`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(dto)
    });
    return handleResponse(response);
}

export async function updateTimeSlot(id: number, dto: CreateTimeSlotRequest): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/timeslots/${id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(dto)
    });
    return handleResponse(response);
}

export async function deleteTimeSlot(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/timeslots/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function getBookingsByUser(userId: number): Promise<TimeSlot[]> {
    const response = await fetch(`${API_BASE_URL}/bookings/user/${userId}`, {
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function adminCancelBooking(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/bookings/${id}/admin`, {
        method: "DELETE",
        headers: authHeaders()
    });
    return handleResponse(response);
}