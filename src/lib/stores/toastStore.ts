import { writable } from 'svelte/store';

export const toastStore = writable<{
	visible: boolean;
	message: string;
	type: 'success' | 'error' | 'info';
}>({
	visible: false,
	message: '',
	type: 'error'
});

let currentToastId = 0;

export function triggerToast(
	message: string,
	type: 'success' | 'error' | 'info',
	duration: number = 3000
) {
	const toastId = ++currentToastId;
	toastStore.set({ visible: true, message, type });

	setTimeout(() => {
		if (toastId === currentToastId) {
			toastStore.set({ visible: false, message: '', type });
		}
	}, duration);
}