import { redirect } from '@sveltejs/kit';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	if (!locals.user?.roles.includes('Admin')) {
		throw redirect(303, '/');
	}
	return {};
};