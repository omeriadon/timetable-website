export function buildUpstreamPath(splat: string, search: string) {
	return `${splat}${search}`;
}

export function logoutDispatch(method: string) {
	return method === "DELETE"
		? { path: "v1/auth/logout", method: "DELETE" as const }
		: null;
}

export async function dispatchLogout(
	method: string,
	authenticatedRequest: (path: string, init: RequestInit) => Promise<unknown>,
) {
	const dispatch = logoutDispatch(method);
	if (!dispatch) {
		return null;
	}
	await authenticatedRequest(dispatch.path, { method: dispatch.method });
	return dispatch;
}
