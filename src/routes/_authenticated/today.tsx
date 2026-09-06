import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/today/page";
import { fetchDashboard } from "@/lib/server/dashboard.functions";
export const Route = createFileRoute("/_authenticated/today")({
	loader: async ({ context }) => ({
		...(await fetchDashboard()),
		account: context.account,
	}),
	component: () => {
		const dashboard = Route.useLoaderData();
		return <Page dashboard={dashboard()} />;
	},
	pendingComponent: () => <p>Loading your timetable…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">
			Unable to load today&apos;s timetable.{" "}
			{error instanceof Error ? error.message : "Please try again."}
		</p>
	),
	head: () => ({ meta: [{ title: "Today · Timetable" }] }),
});
