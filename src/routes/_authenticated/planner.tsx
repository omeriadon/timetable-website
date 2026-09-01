import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/planner/page";
import { fetchDashboard } from "@/lib/server/dashboard.functions";
export const Route = createFileRoute("/_authenticated/planner")({
	loader: async ({ context }) => ({
		...(await fetchDashboard()),
		account: context.account,
	}),
	component: () => <Page dashboard={Route.useLoaderData()} />,
	pendingComponent: () => <p>Loading your planner…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">
			Unable to load your planner.{" "}
			{error instanceof Error ? error.message : "Please try again."}
		</p>
	),
	head: () => ({ meta: [{ title: "Planner · Timetable" }] }),
});
