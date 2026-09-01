import { describe, expect, test } from "bun:test";
import { buildUpstreamPath, logoutDispatch } from "./webApi";

describe("web API forwarding", () => {
	test("preserves v1 paths and query strings", () => {
		expect(buildUpstreamPath("v1/account", "?detail=true")).toBe(
			"v1/account?detail=true",
		);
	});

	test("dispatches logout only as upstream DELETE", () => {
		expect(logoutDispatch("DELETE")).toEqual({
			path: "v1/auth/logout",
			method: "DELETE",
		});
		expect(logoutDispatch("POST")).toBeNull();
	});
});
