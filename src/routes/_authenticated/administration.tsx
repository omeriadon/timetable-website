import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/administration/page";
import { loadAdministration } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/administration")({
	loader: () => loadAdministration(),
	head: () => ({ meta: [{ title: "Administration · Timetable" }] }),
	component: () => {
		const data = Route.useLoaderData();
		return <Page data={data()} />;
	},
	pendingComponent: () => <p role="status">Loading administration…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load administration: {error.message}</p>
	),
});
