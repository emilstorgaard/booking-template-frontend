import { writable } from 'svelte/store';

export type AuthModal = 'login' | 'register' | null;

export const authModalStore = writable<AuthModal>(null);

export function openLoginModal() {
	authModalStore.set('login');
}

export function openRegisterModal() {
	authModalStore.set('register');
}

export function closeAuthModal() {
	authModalStore.set(null);
}