export function buildUpstreamPath(splat: string, search: string) {
	return `${splat}${search}`;
}

export function logoutDispatch(method: string) {
	return method === "DELETE"
		? { path: "v1/auth/logout", method: "DELETE" as const }
		: null;
}
