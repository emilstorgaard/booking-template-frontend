import jwt, { type JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET_KEY } from '$env/static/private';
import type { Handle } from '@sveltejs/kit';

export const validateToken = (token: string): JwtPayload | null => {
	try {
		const decoded = jwt.verify(token, JWT_SECRET_KEY, { ignoreNotBefore: false, clockTolerance: 10 });
		return typeof decoded === 'string' ? null : decoded;
	} catch (error: any) {
		console.error('Token validation error:', error);
		return null;
	}
};
export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('jwt');

	if (token) {
		const decodedToken = validateToken(token);

		if (decodedToken) {
			const { sub, email, role } = decodedToken as { sub: string; email: string; role: string | string[] };

			const roles = Array.isArray(role) ? role : role ? [role] : [];

			event.locals.user = { uid: sub, email, roles, jwt: token };
		} else {
			event.cookies.delete('jwt', { path: '/' });
		}
	}

	const response = await resolve(event);
	return response;
};