import { NextResponse } from "next/server";
import { authenticatedPMSTTRequest, clearSession } from "@/lib/server/pmstt";

export async function DELETE() {
	const { response: upstream } = await authenticatedPMSTTRequest(
		"v1/auth/logout",
		{
			method: "DELETE",
		},
	);
	const response = NextResponse.json(
		upstream.status === 204
			? { ok: true }
			: await upstream.json().catch(() => ({})),
		{ status: upstream.status },
	);
	clearSession(response);
	return response;
}
