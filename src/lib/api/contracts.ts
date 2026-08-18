export type Account = {
	id: string;
	email: string;
	displayName: string;
	createdAt?: string;
	authority: string;
	revision: number;
};

export type TokenResponse = {
	accessToken: string;
	refreshToken: string;
	user: Account;
};

export type APIError = {
	error?: {
		code?: string;
		reason?: string;
		field?: string;
	};
};
