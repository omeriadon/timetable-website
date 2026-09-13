import {
	deleteCookie,
	getCookie,
	setCookie,
} from "@tanstack/solid-start/server";
import type { TokenResponse } from "@/lib/api/contracts";

const apiBaseURL =
	process.env.PMSTT_API_BASE_URL ?? "https://timetable.adonis.pt/api";
const accessCookie =
	process.env.NODE_ENV === "production"
		? "__Host-timetable.website.access"
		: "timetable.website.access";
const refreshCookie =
	process.env.NODE_ENV === "production"
		? "__Host-timetable.website.refresh"
		: "timetable.website.refresh";
const legacyAccessCookie = "timetable.website.access";
const legacyRefreshCookie = "timetable.website.refresh";
const secureCookies = process.env.NODE_ENV === "production";
const refreshesInFlight = new Map<string, Promise<TokenResponse | null>>();

// --- Short-lived server cache for authenticated GETs ---
// A new browser tab is a full server load: the server runs beforeLoad + the
// route loader before the page can mount, and the server cannot see the
// browser's localStorage cache. Without this, every cold tab pays full
// upstream round trips (session check + 7 dashboard reads) before first paint.
type UpstreamGetCacheEntry = { at: number; status: number; payload: unknown };
const upstreamGetCache = new Map<string, UpstreamGetCacheEntry>();
const UPSTREAM_GET_TTL_MS = 30_000;
const UPSTREAM_GET_MAX_ENTRIES = 200;
const UPSTREAM_GET_MAX_BYTES = 1_000_000;

function hashToken(token: string): string {
	let hash = 0x811c9dc5;
	for (let index = 0; index < token.length; index++) {
		hash ^= token.charCodeAt(index);
		hash = Math.imul(hash, 0x01000193);
	}
	return (hash >>> 0).toString(16);
}

function upstreamGetCacheKey(path: string): string | null {
	const accessToken = getCookie(accessCookie) ?? getCookie(legacyAccessCookie);
	if (!accessToken) return null;
	return `${hashToken(accessToken)} ${path}`;
}

function readUpstreamGetCache(path: string): UpstreamGetCacheEntry | null {
	const key = upstreamGetCacheKey(path);
	if (!key) return null;
	const entry = upstreamGetCache.get(key);
	if (!entry) return null;
	if (Date.now() - entry.at > UPSTREAM_GET_TTL_MS) {
		upstreamGetCache.delete(key);
		return null;
	}
	return entry;
}

function writeUpstreamGetCache(path: string, status: number, payload: unknown) {
	const key = upstreamGetCacheKey(path);
	if (!key) return;
	let size = UPSTREAM_GET_MAX_BYTES + 1;
	try {
		size = JSON.stringify(payload)?.length ?? size;
	} catch {
		return;
	}
	// Never cache blobs or oversized payloads (e.g. profile photos via proxy).
	if (size > UPSTREAM_GET_MAX_BYTES) return;
	if (upstreamGetCache.size >= UPSTREAM_GET_MAX_ENTRIES) {
		const oldest = upstreamGetCache.keys().next();
		if (!oldest.done) upstreamGetCache.delete(oldest.value);
	}
	upstreamGetCache.set(key, { at: Date.now(), status, payload });
}

function invalidateUpstreamGetCache() {
	const accessToken = getCookie(accessCookie) ?? getCookie(legacyAccessCookie);
	if (!accessToken) return;
	const prefix = `${hashToken(accessToken)} `;
	for (const key of upstreamGetCache.keys()) {
		if (key.startsWith(prefix)) upstreamGetCache.delete(key);
	}
}

export async function pmsttRequest(
	path: string,
	init: RequestInit = {},
	accessToken?: string,
) {
	return fetch(`${apiBaseURL}/${path.replace(/^\//, "")}`, {
		...init,
		headers: {
			Accept: "application/json",
			...(init.body ? { "Content-Type": "application/json" } : {}),
			...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
			...init.headers,
		},
		cache: "no-store",
	});
}

const cookieOptions = {
	httpOnly: true,
	secure: secureCookies,
	sameSite: "lax" as const,
	path: "/",
};

export function writeSession(tokens: TokenResponse) {
	setCookie(accessCookie, tokens.accessToken, {
		...cookieOptions,
		maxAge: 60 * 60,
	});
	setCookie(refreshCookie, tokens.refreshToken, {
		...cookieOptions,
		maxAge: 60 * 60 * 24 * 90,
	});
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
			const response = await pmsttRequest("v1/auth/refresh", {
				method: "POST",
				body: JSON.stringify({ refreshToken }),
			});
			return response.ok ? ((await response.json()) as TokenResponse) : null;
		} catch {
			return null;
		}
	})();
	refreshesInFlight.set(refreshToken, refresh);
	void refresh.then(() =>
		setTimeout(() => {
			if (refreshesInFlight.get(refreshToken) === refresh)
				refreshesInFlight.delete(refreshToken);
		}, 5000),
	);
	return refresh;
}

export async function authenticatedPMSTTRequest(
	path: string,
	init: RequestInit = {},
) {
	const method = (init.method ?? "GET").toUpperCase();
	const hasBody = init.body != null;
	if (method === "GET" && !hasBody) {
		const hit = readUpstreamGetCache(path);
		if (hit) {
			return {
				response: Response.json(hit.payload, { status: hit.status }),
				cached: true as const,
			};
		}
	}
	let accessToken = getCookie(accessCookie) ?? getCookie(legacyAccessCookie);
	let response = await pmsttRequest(path, init, accessToken);
	if (response.status !== 401) {
		if (method === "GET" && !hasBody && response.ok) {
			const payload = await response
				.clone()
				.json()
				.catch(() => undefined);
			if (payload !== undefined) {
				writeUpstreamGetCache(path, response.status, payload);
			}
		} else if (method !== "GET" && response.ok) {
			// Mutations invalidate this user's cached reads so the next
			// loader sees fresh data.
			invalidateUpstreamGetCache();
		}
		return { response };
	}
	const refreshToken =
		getCookie(refreshCookie) ?? getCookie(legacyRefreshCookie);
	const tokens = refreshToken ? await refreshSession(refreshToken) : null;
	if (!tokens) return { response };
	response = await pmsttRequest(path, init, tokens.accessToken);
	if (method === "GET" && !hasBody && response.ok) {
		const payload = await response
			.clone()
			.json()
			.catch(() => undefined);
		if (payload !== undefined) {
			writeUpstreamGetCache(path, response.status, payload);
		}
	} else if (method !== "GET" && response.ok) {
		invalidateUpstreamGetCache();
	}
	return { response, tokens };
}
