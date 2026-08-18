export type Account = {
	id: string;
	email: string;
	displayName: string;
	createdAt?: string;
	authority: string;
	revision: number;
	appearance?: ProfileAppearance;
	photo?: ProfilePhoto | null;
	badges?: ProfileBadge[];
};

export type ProfileAppearance = {
	contentKind: "photo" | "monogram" | "emoji";
	monogram: string;
	emoji: string;
	foregroundColour: { r: number; g: number; b: number; a: number };
	colours: { r: number; g: number; b: number; a: number }[];
	fontDesign?: string;
	fontWeight?: string;
};

export type ProfilePhoto = {
	url: string;
	revision: number;
};

export type ProfileBadge = {
	id: string;
	symbol: string;
	accessibilityLabel: string;
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
