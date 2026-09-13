import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/classes/page";
import { loadClasses } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/classes")({
	loader: () => loadClasses(),
	staleTime: 15 * 60 * 1000,
	gcTime: 30 * 60 * 1000,
	pendingMs: 250,
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
