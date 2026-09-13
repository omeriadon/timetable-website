import { createFileRoute, redirect } from "@tanstack/solid-router";
import LoginPage from "@/pages/login/page";
import { safeReturnTo } from "@/lib/returnTo";
import { checkSession } from "@/lib/server/session.functions";

export const Route = createFileRoute("/login")({
	validateSearch: (search: Record<string, unknown>) => ({
		returnTo:
			typeof search.returnTo === "string" ? search.returnTo : undefined,
	}),
	beforeLoad: async ({ search }) => {
		const account = await checkSession();
		if (account) {
			throw redirect({
				to: safeReturnTo(search.returnTo, "/today") as "/today",
			});
		}
	},
	component: LoginPage,
	head: () => ({
		meta: [
			{ title: "Log in · Timetable" },
			{ name: "robots", content: "noindex, nofollow" },
		],
	}),
});
