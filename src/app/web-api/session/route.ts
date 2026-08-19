import { NextResponse } from "next/server";
import {
	authenticatedPMSTTRequest,
	clearSession,
	writeSession,
} from "@/lib/server/pmstt";

export async function GET() {
	const { response: upstream, tokens } =
		await authenticatedPMSTTRequest("v1/account");
	const payload = await upstream.json().catch(() => ({}));
	const response = NextResponse.json(payload, { status: upstream.status });

	if (tokens) {
		writeSession(response, tokens);
	}

	if (upstream.status === 401) {
		clearSession(response);
	}

	return response;
}
