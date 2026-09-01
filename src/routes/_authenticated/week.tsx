import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/week/page";
import { fetchDashboard } from "@/lib/server/dashboard.functions";
export const Route = createFileRoute("/_authenticated/week")({
	loader: async ({ context }) => ({
		...(await fetchDashboard()),
		account: context.account,
	}),
	component: () => <Page dashboard={Route.useLoaderData()} />,
	pendingComponent: () => <p>Loading your timetable…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">
			Unable to load your timetable.{" "}
			{error instanceof Error ? error.message : "Please try again."}
		</p>
	),
	head: () => ({ meta: [{ title: "Week · Timetable" }] }),
});
