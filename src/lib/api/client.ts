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
		const payload = await response.json().catch(() => ({}));
		const errorPayload = payload.error ?? payload;
		const message =
			errorPayload.reason ??
			errorPayload.message ??
			(response.status === 401
				? "Your email or password is incorrect."
				: response.status === 403
					? "This account is not permitted to use the website. Contact an administrator if you believe this is incorrect."
					: response.status === 429
						? "Too many requests. Wait a moment and try again."
						: response.status >= 500
							? "Timetable is temporarily unavailable. Try again shortly."
							: "The request could not be completed. Check your details and try again.");
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
