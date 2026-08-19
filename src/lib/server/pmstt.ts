import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { TokenResponse } from "@/lib/api/contracts";

const apiBaseURL =
	process.env.PMSTT_API_BASE_URL ?? "https://timetable.adonis.pt/api";
const accessCookie = "timetable.website.access";
const refreshCookie = "timetable.website.refresh";

type CookieStore = Awaited<ReturnType<typeof cookies>>;

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
	const secure = process.env.NODE_ENV === "production";

	response.cookies.set(accessCookie, tokens.accessToken, {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 15,
	});
	response.cookies.set(refreshCookie, tokens.refreshToken, {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: 60 * 60 * 24 * 90,
	});
}

export function clearSession(response: NextResponse) {
	response.cookies.set(accessCookie, "", { path: "/", maxAge: 0 });
	response.cookies.set(refreshCookie, "", { path: "/", maxAge: 0 });
}

async function refreshSession(
	cookieStore: CookieStore,
): Promise<TokenResponse | null> {
	const refreshToken = cookieStore.get(refreshCookie)?.value;

	if (!refreshToken) {
		return null;
	}

	const response = await pmsttRequest("v1/auth/refresh", {
		method: "POST",
		body: JSON.stringify({ refreshToken }),
	});

	if (!response.ok) {
		return null;
	}

	return response.json() as Promise<TokenResponse>;
}

export async function authenticatedPMSTTRequest(
	path: string,
	init: RequestInit = {},
): Promise<{ response: Response; tokens?: TokenResponse }> {
	const cookieStore = await cookies();
	let accessToken = cookieStore.get(accessCookie)?.value;
	let response = await pmsttRequest(path, init, accessToken);

	if (response.status !== 401) {
		return { response };
	}

	const tokens = await refreshSession(cookieStore);

	if (!tokens) {
		return { response };
	}

	accessToken = tokens.accessToken;
	response = await pmsttRequest(path, init, accessToken);
	return { response, tokens };
}
