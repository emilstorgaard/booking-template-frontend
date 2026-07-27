import { userStore } from "$lib/stores/auth";
import { setCookie, deleteCookie } from "$lib/utils/cookies"
import { API_BASE_URL } from "./config";

interface LoginResponse {
    token: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface SignupRequest {
    email: string;
    password: string;
    confirmPassword: string;
}

function authHeaders(): Record<string, string> {
    return {
        "Content-Type": "application/json"
    };
}

async function handleAuthResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error ?? errorData?.title ?? "Der skete en fejl.");
    }
    return response.json();
}

export async function login(dto: LoginRequest) {
    if (!dto.email || !dto.password || typeof dto.email !== "string" || typeof dto.password !== "string") {
        throw new Error("Email og password er påkrævet.");
    }

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(dto)
    });

    const { token } = await handleAuthResponse<LoginResponse>(response);

    setCookie("jwt", token, {
        "max-age": 60 * 60 * 24 * 30,
        path: '/',
        samesite: 'lax',
        secure: true
    });
    return
}

export async function signup(dto: SignupRequest) {
    if (!dto.email || !dto.password || !dto.confirmPassword || typeof dto.email !== "string" || typeof dto.password !== "string" || typeof dto.confirmPassword !== "string") {
        throw new Error("Email og password er påkrævet.");
    }

    if (dto.password != dto.confirmPassword) {
        throw new Error("Passwords does not match!.");
    }

    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email: dto.email, password: dto.password })
    });

    return handleAuthResponse(response);
}

export async function logout() {
    deleteCookie("jwt");
    userStore.set(null);

    return;
}