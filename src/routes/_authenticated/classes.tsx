import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/classes/page";
import { loadClasses } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/classes")({
	loader: () => loadClasses(),
	head: () => ({ meta: [{ title: "Classes · Timetable" }] }),
	component: () => {
		const data = Route.useLoaderData();
		return <Page data={data()} />;
	},
	pendingComponent: () => <p role="status">Loading classes…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load classes: {error.message}</p>
	),
});
