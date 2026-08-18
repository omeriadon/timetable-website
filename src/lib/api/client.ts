export class PMSTTAPIError extends Error {
	readonly status: number;
	readonly code?: string;
	readonly field?: string;

	constructor(status: number, message: string, code?: string, field?: string) {
		super(message);
		this.name = "PMSTTAPIError";
		this.status = status;
		this.code = code;
		this.field = field;
	}
}

export async function apiRequest<T>(
	path: string,
	init: RequestInit = {},
): Promise<T> {
	const response = await fetch(`/web-api/${path.replace(/^\//, "")}`, {
		...init,
		headers: {
			Accept: "application/json",
			...(init.body ? { "Content-Type": "application/json" } : {}),
			...init.headers,
		},
	});

	if (!response.ok) {
		if (
			response.status === 401 &&
			typeof window !== "undefined" &&
			window.location.pathname !== "/login"
		) {
			const returnTo = `${window.location.pathname}${window.location.search}`;
			window.location.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
		}
		const payload = await response.json().catch(() => ({}));
		const errorPayload = payload.error ?? payload;
		const upstreamMessage = errorPayload.reason ?? errorPayload.message;
		const genericUpstreamMessage = typeof upstreamMessage === "string" && [
			"The request could not be completed.",
			"The request could not be completed",
			"Request failed.",
		].includes(upstreamMessage.trim());
		const message = !upstreamMessage || genericUpstreamMessage
			? response.status === 401
				? "Your email or password is incorrect. Check both fields and try again."
				: response.status === 403
					? "The server rejected this sign-in. Your account may be unverified or not permitted to use the website."
					: response.status === 404
						? "That Timetable service is unavailable. Check the server address and try again."
						: response.status === 429
							? "Too many requests. Wait a moment and try again."
							: response.status >= 500
								? "Timetable is temporarily unavailable. Try again shortly."
								: "Timetable could not complete that request. Check the details and try again."
			: upstreamMessage;
		throw new PMSTTAPIError(
			response.status,
			message,
			errorPayload.code,
			errorPayload.field,
		);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}
