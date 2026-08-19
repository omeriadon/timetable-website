import { NextRequest, NextResponse } from "next/server";
import type { TokenResponse } from "@/lib/api/contracts";
import { pmsttRequest, writeSession } from "@/lib/server/pmstt";

const publicActions = new Set([
	"request-code",
	"verify-code-register",
	"login",
]);
const sessionActions = new Set(["verify-code-register", "login"]);

export async function POST(
	request: NextRequest,
	context: { params: Promise<{ action: string }> },
) {
	const { action } = await context.params;

	if (!publicActions.has(action)) {
		return NextResponse.json(
			{ error: { reason: "Unknown authentication action." } },
			{ status: 404 },
		);
	}

	const body = await request.json();
	const upstream = await pmsttRequest("v1/auth/" + action, {
		method: "POST",
		body: JSON.stringify({ ...body, platform: "website" }),
	});
	const payload = await upstream.json().catch(() => ({}));
	const clientPayload =
		upstream.ok && sessionActions.has(action)
			? { user: (payload as TokenResponse).user }
			: payload;
	const response = NextResponse.json(clientPayload, {
		status: upstream.status,
	});
	response.headers.set("Cache-Control", "no-store");

	if (upstream.ok && sessionActions.has(action)) {
		writeSession(response, payload as TokenResponse);
	}

	return response;
}
