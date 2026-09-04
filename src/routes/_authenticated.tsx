import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AppShell from "@/components/AppShell/AppShell";
import { checkSession } from "@/lib/server/session.functions";
import { safeReturnTo } from "@/lib/returnTo";

export const Route = createFileRoute("/_authenticated")({
	head: () => ({
		meta: [{ name: "robots", content: "noindex, nofollow" }],
	}),
	beforeLoad: async ({ location }) => {
		const account = await checkSession();
		if (!account) {
			const returnTo = `${location.pathname}${location.searchStr}`;
			throw redirect({
				to: "/login",
				search: { returnTo: safeReturnTo(returnTo) },
			});
		}
		return { account };
	},
	component: () => (
		<AppShell>
			<Outlet />
		</AppShell>
	),
});
