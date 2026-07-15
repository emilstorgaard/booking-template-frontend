import { userStore } from "$lib/stores/auth";
import { setCookie, deleteCookie } from "$lib/utils/cookies"
import { API_BASE_URL } from "./config";

export async function login(email: string, password: string) {
    if (!email || !password || typeof email !== "string" || typeof password !== "string") {
        throw new Error("Email og password er påkrævet.");
    }

    const formData = new URLSearchParams();
    formData.append("Email", email);
    formData.append("Password", password);

    const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Login fejlede");
    }

    console.log("Login successful", response.ok);

    const data = await response.json();

    const { token } = data

    setCookie("jwt", token, {
        "max-age": 60 * 60 * 24 * 30,
        path: '/',
        samesite: 'lax',
        secure: true // kun over https
    });
    return
}

export async function signup(email: string, password: string, confirmPassword: string) {
    if (!email || !password || !confirmPassword || typeof email !== "string" || typeof password !== "string" || typeof confirmPassword !== "string") {
        throw new Error("Email og password er påkrævet.");
    }

    if (password != confirmPassword) {
        throw new Error("Passwords does not match!.");
    }

    const formData = new URLSearchParams();
    formData.append("Email", email);
    formData.append("Password", password);

    const response = await fetch(`${API_BASE_URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Signup fejlede");
    }

    return
}

export async function logout() {
    deleteCookie("jwt");
    userStore.set(null);

    return;
}