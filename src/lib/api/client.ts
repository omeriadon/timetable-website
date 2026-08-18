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
		throw new PMSTTAPIError(
			response.status,
			payload.error?.reason ?? "The request could not be completed.",
			payload.error?.code,
			payload.error?.field,
		);
	}

	if (response.status === 204) {
		return undefined as T;
	}

	return response.json() as Promise<T>;
}
