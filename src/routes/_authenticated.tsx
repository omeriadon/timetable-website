import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import AppShell from "@/components/AppShell/AppShell";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: async ({ location }) => {
		const response = await fetch("/web-api/session", { credentials: "include" });
		if (!response.ok) {
			const returnTo = `${location.pathname}${location.searchStr}`;
			throw redirect({ to: "/login", search: { returnTo } });
		}
	},
	component: () => <AppShell><Outlet /></AppShell>,
});
