import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/grades/[subject]/page";
import { GradeSubjectPending } from "@/lib/cache/pending";
import { loadGradeSubject } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/grades/$subject")({
	loader: () => loadGradeSubject(),
	staleTime: 10 * 60 * 1000,
	gcTime: 30 * 60 * 1000,
	pendingMs: 250,
	component: () => {
		const params = Route.useParams();
		const data = Route.useLoaderData();
		return <Page subject={params().subject} data={data()} />;
	},
	pendingComponent: GradeSubjectPending,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load subject grades: {error.message}</p>
	),
	head: ({ params }) => ({
		meta: [{ title: `${params.subject} · Grades · Timetable` }],
	}),
});
