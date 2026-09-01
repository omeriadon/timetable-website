export function safeReturnTo(value: string | undefined) {
	if (!value || !value.startsWith("/") || value.startsWith("//")) {
		return "/";
	}
	return value;
}
