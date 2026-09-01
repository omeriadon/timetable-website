import { describe, expect, test } from "bun:test";
import { buildUpstreamPath, dispatchLogout, logoutDispatch } from "./webApi";

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

	test("logout gateway uses the authenticated request", async () => {
		let call: { path: string; method: string } | undefined;
		await dispatchLogout("DELETE", async (path, init) => {
			call = { path, method: init.method ?? "" };
		});
		expect(call).toEqual({ path: "v1/auth/logout", method: "DELETE" });
	});
});
