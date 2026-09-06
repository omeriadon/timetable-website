import { describe, expect, test } from "bun:test";
import { responseFor } from "./solid-migration-fixture";

const request = (path: string, init?: RequestInit) =>
	responseFor(new Request(`http://fixture.test/api/${path}`, init));

describe("Solid migration fixture", () => {
	test("authenticates and returns the populated account", async () => {
		const login = await request("v1/auth/login", {
			method: "POST",
			body: JSON.stringify({
				email: "owner@example.test",
				password: "fixture-password",
			}),
		});
		const payload = await login.json();

		expect(login.status).toBe(200);
		expect(payload.accessToken).toBe("fixture-access");
		expect(payload.user.authority).toBe("systemOwner");
	});

	test("keeps settings mutations observable by later reads", async () => {
		const update = await request("v1/settings", {
			method: "PUT",
			body: JSON.stringify({ futureEventRange: "oneMonth" }),
		});
		const updated = await update.json();
		const current = await (await request("v1/settings")).json();

		expect(updated.futureEventRange).toBe("oneMonth");
		expect(current.futureEventRange).toBe("oneMonth");
		expect(current.serverRevision).toBeGreaterThan(1);
	});

	test("rejects endpoints that are absent from the fixture", async () => {
		const response = await request("v1/not-real");
		const payload = await response.json();

		expect(response.status).toBe(404);
		expect(payload.error.reason).toContain("No fixture for GET v1/not-real");
	});
});
