import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AppShell from "@/components/AppShell/AppShell";
import { checkSession } from "@/lib/server/session.functions";
import { safeReturnTo } from "@/lib/returnTo";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		const authenticated = await checkSession();
		if (!authenticated) {
			const returnTo = `${location.pathname}${location.searchStr}`;
			throw redirect({
				to: "/login",
				search: { returnTo: safeReturnTo(returnTo) },
			});
		}
	},
	component: () => (
		<AppShell>
			<Outlet />
		</AppShell>
	),
});
