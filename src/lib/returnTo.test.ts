import { describe, expect, test } from "bun:test";
import { safeReturnTo } from "./returnTo";

describe("safe returnTo", () => {
	test("accepts local paths with query strings", () => {
		expect(safeReturnTo("/today?view=week")).toBe("/today?view=week");
	});

	test("rejects absolute and protocol-relative URLs", () => {
		expect(safeReturnTo("https://evil.example")).toBe("/");
		expect(safeReturnTo("//evil.example")).toBe("/");
	});
});
