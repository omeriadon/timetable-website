import { NextResponse, type NextRequest } from "next/server";

const accessCookie = "timetable.website.access";
const refreshCookie = "timetable.website.refresh";

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession =
		request.cookies.has(accessCookie) || request.cookies.has(refreshCookie);

	if (pathname === "/login" || pathname.startsWith("/web-api")) {
		return NextResponse.next();
	}

	if (!hasSession) {
		const loginURL = new URL("/login", request.url);
		loginURL.searchParams.set("returnTo", pathname);
		return NextResponse.redirect(loginURL);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ["/((?!_next|favicon.svg|icons|fonts|icon.png).*)"],
};
