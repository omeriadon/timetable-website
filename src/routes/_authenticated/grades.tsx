import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/grades/page";
import { loadGrades } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/grades")({
	loader: () => loadGrades(),
	head: () => ({ meta: [{ title: "Grades · Timetable" }] }),
	component: () => <Page data={Route.useLoaderData()} />,
	pendingComponent: () => <p role="status">Loading grades…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load grades: {error.message}</p>
	),
});
