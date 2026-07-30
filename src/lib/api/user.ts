import { getCookie } from "$lib/utils/cookies";
import { API_BASE_URL } from "../utils/config";

export interface User {
    id: number;
    email: string;
    roles: string[];
    createdAtUtc: string;
    updatedAtUtc: string;
}

export interface UpdateUserRequest {
    email: string;
}

export interface UpdateUserResponse {
    message: string;
    token: string;
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

export async function updateUser(dto: UpdateUserRequest): Promise<UpdateUserResponse> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(dto)
    });
    return handleResponse(response);
}

export async function deleteUser(): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        method: "DELETE",
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_BASE_URL}/users`, {
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function getUserById(id: number): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        headers: authHeaders()
    });
    return handleResponse(response);
}

export async function adminDeleteUser(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: "DELETE",
        headers: authHeaders()
    });
    return handleResponse(response);
}