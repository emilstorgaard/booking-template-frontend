import { getContentByPath } from '$lib/api/umbraco';
import type { HomePage } from '$lib/types/homePage';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
    const page = (await getContentByPath('forside', fetch)) as HomePage;

    return {
        page
    };
};