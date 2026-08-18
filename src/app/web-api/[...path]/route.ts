import { NextRequest, NextResponse } from "next/server";
import { authenticatedPMSTTRequest, clearSession, writeSession } from "@/lib/server/pmstt";

async function forward(
	request: NextRequest,
	context: { params: Promise<{ path: string[] }> },
) {
	const { path } = await context.params;
	const body = ["GET", "HEAD"].includes(request.method) ? undefined : await request.text();
	const { response: upstream, tokens } = await authenticatedPMSTTRequest(path.join("/"), {
		method: request.method,
		body: body || undefined,
	});
	const response = new NextResponse(upstream.body, {
		status: upstream.status,
		headers: {
			"Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
		},
	});

	if (tokens) {
		writeSession(response, tokens);
	}

	if (upstream.status === 401) {
		clearSession(response);
	}

	return response;
}

export const GET = forward;
export const POST = forward;
export const PUT = forward;
export const DELETE = forward;
