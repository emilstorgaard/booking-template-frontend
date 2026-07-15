import { userStore } from "$lib/stores/auth";
import { getCookie } from "./cookies";
import { decodeJwtPayload } from "./jwt";

export async function fetchUserData() {
	const jwt = getCookie('jwt')

	if (!jwt) {
		console.warn("JWT not found in cookies. User might not be logged in.");
		return;
	}

	const claims = decodeJwtPayload(jwt);

	if (!claims) {
		userStore.set(null);
		return;
	}

	const roles = Array.isArray(claims.role) ? claims.role : claims.role ? [claims.role] : [];

	userStore.set({
		uid: claims.sub,
		email: claims.email,
		roles,
		jwt
	});
}