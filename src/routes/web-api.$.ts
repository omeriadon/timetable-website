import { createFileRoute } from "@tanstack/react-router";
import type { TokenResponse } from "@/lib/api/contracts";
import {
	authenticatedPMSTTRequest,
	clearSession,
	pmsttRequest,
	writeSession,
} from "@/lib/server/pmstt.server";
import { buildUpstreamPath, dispatchLogout } from "@/lib/server/webApi";

async function jsonResponse(upstream: Response) {
	const payload = await upstream.json().catch(() => ({}));
	return Response.json(payload, {
		status: upstream.status,
		headers: { "Cache-Control": "no-store" },
	});
}

async function handler({
	request,
	params,
}: {
	request: Request;
	params: { _splat?: string };
}) {
	const path = params._splat ?? "";
	if (path === "session" && request.method === "GET") {
		const { response: upstream, tokens } =
			await authenticatedPMSTTRequest("v1/account");
		const response = await jsonResponse(upstream);
		if (tokens) writeSession(tokens);
		if (upstream.status === 401) clearSession();
		return response;
	}
	if (path === "auth/logout") {
		const logout = await dispatchLogout(
			request.method,
			authenticatedPMSTTRequest,
		);
		if (!logout) {
			return new Response(null, { status: 405 });
		}

		const { response: upstream } = logout;
		const response = new Response(upstream.body, {
			status: upstream.status,
			headers: {
				"Content-Type":
					upstream.headers.get("Content-Type") ?? "application/json",
				"Cache-Control": "no-store",
			},
		});
		clearSession();
		return response;
	}
	if (path.startsWith("auth/") && request.method === "POST") {
		const action = path.slice("auth/".length);
		if (!["request-code", "verify-code-register", "login"].includes(action))
			return Response.json(
				{ error: { reason: "Unknown authentication action." } },
				{ status: 404 },
			);
		const body = await request.json();
		const upstream = await pmsttRequest(`v1/auth/${action}`, {
			method: "POST",
			body: JSON.stringify({ ...body, platform: "website" }),
		});
		const payload = (await upstream.json().catch(() => ({}))) as TokenResponse;
		const response = Response.json(
			upstream.ok && ["verify-code-register", "login"].includes(action)
				? { user: payload.user }
				: payload,
			{ status: upstream.status, headers: { "Cache-Control": "no-store" } },
		);
		if (upstream.ok && ["verify-code-register", "login"].includes(action))
			writeSession(payload);
		return response;
	}
	const upstreamPath = buildUpstreamPath(path, new URL(request.url).search);
	const body = ["GET", "HEAD"].includes(request.method)
		? undefined
		: await request.arrayBuffer();
	const { response: upstream, tokens } = await authenticatedPMSTTRequest(
		upstreamPath,
		{
			method: request.method,
			body: body?.byteLength ? body : undefined,
			headers: request.headers.get("Content-Type")
				? { "Content-Type": request.headers.get("Content-Type")! }
				: undefined,
		},
	);
	const response = new Response(upstream.body, {
		status: upstream.status,
		headers: {
			"Content-Type":
				upstream.headers.get("Content-Type") ?? "application/json",
			"Cache-Control": "no-store",
		},
	});
	if (tokens) writeSession(tokens);
	if (upstream.status === 401) clearSession();
	return response;
}

export const Route = createFileRoute("/web-api/$")({
	server: {
		handlers: { GET: handler, POST: handler, PUT: handler, DELETE: handler },
	},
});
