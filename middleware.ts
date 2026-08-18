import { NextResponse, type NextRequest } from "next/server";

const accessCookie = "timetable.website.access";
const refreshCookie = "timetable.website.refresh";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = request.cookies.has(accessCookie) || request.cookies.has(refreshCookie);

	if (pathname === "/login") {
		return hasSession
			? NextResponse.redirect(new URL("/", request.url))
			: NextResponse.next();
	}

	if (!hasSession) {
		const loginURL = new URL("/login", request.url);
		loginURL.searchParams.set("returnTo", pathname);
		return NextResponse.redirect(loginURL);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!web-api|_next|favicon.svg|icons|fonts|icon.png).*)"],
};
