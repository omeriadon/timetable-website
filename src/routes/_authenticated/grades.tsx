import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/grades/page";
import { GradesPending } from "@/lib/cache/pending";
import { loadGrades } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/grades")({
	loader: () => loadGrades(),
	staleTime: 10 * 60 * 1000,
	gcTime: 30 * 60 * 1000,
	pendingMs: 250,
	head: () => ({ meta: [{ title: "Grades · Timetable" }] }),
	component: () => {
		const data = Route.useLoaderData();
		return <Page data={data()} />;
	},
	pendingComponent: GradesPending,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load grades: {error.message}</p>
	),
});
