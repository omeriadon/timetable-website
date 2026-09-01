import { deleteCookie, getCookie, setCookie } from "@tanstack/react-start/server";
import type { TokenResponse } from "@/lib/api/contracts";

const apiBaseURL = process.env.PMSTT_API_BASE_URL ?? "https://timetable.adonis.pt/api";
const accessCookie = process.env.NODE_ENV === "production" ? "__Host-timetable.website.access" : "timetable.website.access";
const refreshCookie = process.env.NODE_ENV === "production" ? "__Host-timetable.website.refresh" : "timetable.website.refresh";
const legacyAccessCookie = "timetable.website.access";
const legacyRefreshCookie = "timetable.website.refresh";
const secureCookies = process.env.NODE_ENV === "production";
const refreshesInFlight = new Map<string, Promise<TokenResponse | null>>();

export async function pmsttRequest(path: string, init: RequestInit = {}, accessToken?: string) {
	return fetch(`${apiBaseURL}/${path.replace(/^\//, "")}`, {
		...init,
		headers: { Accept: "application/json", ...(init.body ? { "Content-Type": "application/json" } : {}), ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}), ...init.headers },
		cache: "no-store",
	});
}

const cookieOptions = { httpOnly: true, secure: secureCookies, sameSite: "lax" as const, path: "/" };

export function writeSession(tokens: TokenResponse) {
	setCookie(accessCookie, tokens.accessToken, { ...cookieOptions, maxAge: 60 * 60 });
	setCookie(refreshCookie, tokens.refreshToken, { ...cookieOptions, maxAge: 60 * 60 * 24 * 90 });
	if (accessCookie !== legacyAccessCookie) {
		deleteCookie(legacyAccessCookie, cookieOptions);
		deleteCookie(legacyRefreshCookie, cookieOptions);
	}
}

export function clearSession() {
	deleteCookie(accessCookie, cookieOptions);
	deleteCookie(refreshCookie, cookieOptions);
	if (accessCookie !== legacyAccessCookie) {
		deleteCookie(legacyAccessCookie, cookieOptions);
		deleteCookie(legacyRefreshCookie, cookieOptions);
	}
}

async function refreshSession(refreshToken: string) {
	const existing = refreshesInFlight.get(refreshToken);
	if (existing) return existing;
	const refresh = (async () => {
		try {
			const response = await pmsttRequest("v1/auth/refresh", { method: "POST", body: JSON.stringify({ refreshToken }) });
			return response.ok ? await response.json() as TokenResponse : null;
		} catch { return null; }
	})();
	refreshesInFlight.set(refreshToken, refresh);
	void refresh.then(() => setTimeout(() => { if (refreshesInFlight.get(refreshToken) === refresh) refreshesInFlight.delete(refreshToken); }, 5000));
	return refresh;
}

export async function authenticatedPMSTTRequest(path: string, init: RequestInit = {}) {
	let accessToken = getCookie(accessCookie) ?? getCookie(legacyAccessCookie);
	let response = await pmsttRequest(path, init, accessToken);
	if (response.status !== 401) return { response };
	const refreshToken = getCookie(refreshCookie) ?? getCookie(legacyRefreshCookie);
	const tokens = refreshToken ? await refreshSession(refreshToken) : null;
	if (!tokens) return { response };
	response = await pmsttRequest(path, init, tokens.accessToken);
	return { response, tokens };
}
