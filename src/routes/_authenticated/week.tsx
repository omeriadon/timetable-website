import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/week/page";
import { fetchDashboard } from "@/lib/server/dashboard.functions";
export const Route = createFileRoute("/_authenticated/week")({
	loader: async ({ context }) => ({
		...(await fetchDashboard()),
		account: context.account,
	}),
	staleTime: 5 * 60 * 1000,
	gcTime: 30 * 60 * 1000,
	pendingMs: 250,
	component: () => {
		const dashboard = Route.useLoaderData();
		return <Page dashboard={dashboard()} />;
	},
	pendingComponent: () => <p>Loading your timetable…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">
			Unable to load your timetable.{" "}
			{error instanceof Error ? error.message : "Please try again."}
		</p>
	),
	head: () => ({ meta: [{ title: "Week · Timetable" }] }),
});
