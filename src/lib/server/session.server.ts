import { createServerFn } from "@tanstack/react-start";
import {
	authenticatedPMSTTRequest,
	clearSession,
	writeSession,
} from "@/lib/server/pmstt.server";

export const checkSession = createServerFn({ method: "GET" }).handler(
	async () => {
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
