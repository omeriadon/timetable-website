import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/grades/[subject]/page";
import { loadGradeSubject } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/grades/$subject")({
	loader: () => loadGradeSubject(),
	component: () => {
		const params = Route.useParams();
		const data = Route.useLoaderData();
		return <Page subject={params().subject} data={data()} />;
	},
	pendingComponent: () => <p role="status">Loading subject grades…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load subject grades: {error.message}</p>
	),
	head: ({ params }) => ({
		meta: [{ title: `${params.subject} · Grades · Timetable` }],
	}),
});
