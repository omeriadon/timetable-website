import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/planner/page";
import { PlannerPending } from "@/lib/cache/pending";
import { fetchDashboard } from "@/lib/server/dashboard.functions";
export const Route = createFileRoute("/_authenticated/planner")({
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
	pendingComponent: PlannerPending,
	errorComponent: ({ error }) => (
		<p role="alert">
			Unable to load your planner.{" "}
			{error instanceof Error ? error.message : "Please try again."}
		</p>
	),
	head: () => ({ meta: [{ title: "Planner · Timetable" }] }),
});
