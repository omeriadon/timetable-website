import { createServerFn } from "@tanstack/react-start";
export const checkSession = createServerFn({ method: "GET" }).handler(
	async () => {
		const { authenticatedPMSTTRequest, clearSession, writeSession } =
			await import("@/lib/server/pmstt.server");
		const { response, tokens } = await authenticatedPMSTTRequest("v1/account");
		if (tokens) {
			writeSession(tokens);
		}
		if (response.status === 401) {
			clearSession();
		}
		return response.ok;
	},
);
