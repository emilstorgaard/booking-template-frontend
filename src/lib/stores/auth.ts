import { writable } from 'svelte/store';

export interface AuthUser {
	uid: string;
	email: string;
	roles: string[];
	jwt: string;
}

export const userStore = writable<AuthUser | null>(null);

export function hasRole(user: AuthUser | null, role: string): boolean {
	return !!user?.roles?.includes(role);
}