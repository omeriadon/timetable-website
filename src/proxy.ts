import { NextResponse, type NextRequest } from "next/server";

const sessionCookies =
	process.env.NODE_ENV === "production"
		? [
				"__Host-timetable.website.access",
				"__Host-timetable.website.refresh",
				"timetable.website.access",
				"timetable.website.refresh",
			]
		: ["timetable.website.access", "timetable.website.refresh"];

export function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const hasSession = sessionCookies.some((name) => request.cookies.has(name));

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
