import { cookies } from "next/headers";
import { NextResponse } from "next/server";
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
const accessCookieMaxAge = 60 * 60;
const refreshCookieMaxAge = 60 * 60 * 24 * 90;
const refreshResultGracePeriod = 5_000;
const secureCookies = process.env.NODE_ENV === "production";

type CookieStore = Awaited<ReturnType<typeof cookies>>;
type RefreshInFlightRegistry = Map<string, Promise<TokenResponse | null>>;

const runtime = globalThis as typeof globalThis & {
	__timetableWebsiteRefreshes?: RefreshInFlightRegistry;
};
const refreshesInFlight =
	runtime.__timetableWebsiteRefreshes ??
	(runtime.__timetableWebsiteRefreshes = new Map());

const sessionCookieOptions = {
	httpOnly: true,
	secure: secureCookies,
	sameSite: "lax" as const,
	path: "/",
};

export async function pmsttRequest(
	path: string,
	init: RequestInit = {},
	accessToken?: string,
): Promise<Response> {
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

export function writeSession(response: NextResponse, tokens: TokenResponse) {
	response.cookies.set(accessCookie, tokens.accessToken, {
		...sessionCookieOptions,
		maxAge: accessCookieMaxAge,
	});
	response.cookies.set(refreshCookie, tokens.refreshToken, {
		...sessionCookieOptions,
		maxAge: refreshCookieMaxAge,
	});
	if (accessCookie !== legacyAccessCookie) {
		clearCookie(response, legacyAccessCookie);
		clearCookie(response, legacyRefreshCookie);
	}
}

export function clearSession(response: NextResponse) {
	clearCookie(response, accessCookie);
	clearCookie(response, refreshCookie);
	if (accessCookie !== legacyAccessCookie) {
		clearCookie(response, legacyAccessCookie);
		clearCookie(response, legacyRefreshCookie);
	}
}

function clearCookie(response: NextResponse, name: string) {
	response.cookies.set(name, "", {
		...sessionCookieOptions,
		maxAge: 0,
	});
}

async function refreshSession(
	refreshToken: string,
): Promise<TokenResponse | null> {
	const existing = refreshesInFlight.get(refreshToken);
	if (existing) {
		return existing;
	}

	const refresh = (async () => {
		try {
			const response = await pmsttRequest("v1/auth/refresh", {
				method: "POST",
				body: JSON.stringify({ refreshToken }),
			});

			if (!response.ok) {
				return null;
			}

			return (await response.json()) as TokenResponse;
		} catch {
			return null;
		}
	})();

	refreshesInFlight.set(refreshToken, refresh);
	void refresh.then(() => {
		setTimeout(() => {
			if (refreshesInFlight.get(refreshToken) === refresh) {
				refreshesInFlight.delete(refreshToken);
			}
		}, refreshResultGracePeriod);
	});
	return refresh;
}

export async function authenticatedPMSTTRequest(
	path: string,
	init: RequestInit = {},
): Promise<{ response: Response; tokens?: TokenResponse }> {
	const cookieStore = await cookies();
	let accessToken =
		cookieStore.get(accessCookie)?.value ??
		cookieStore.get(legacyAccessCookie)?.value;
	let response = await pmsttRequest(path, init, accessToken);

	if (response.status !== 401) {
		return { response };
	}

	const refreshToken =
		cookieStore.get(refreshCookie)?.value ??
		cookieStore.get(legacyRefreshCookie)?.value;
	const tokens = refreshToken ? await refreshSession(refreshToken) : null;

	if (!tokens) {
		return { response };
	}

	accessToken = tokens.accessToken;
	response = await pmsttRequest(path, init, accessToken);
	return { response, tokens };
}
