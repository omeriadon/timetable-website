import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/grades/[subject]/page";
import { loadGradeSubject } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/grades/$subject")({
	loader: () => loadGradeSubject(),
	component: () => {
		const { subject } = Route.useParams();
		return <Page subject={subject} data={Route.useLoaderData()} />;
	},
	pendingComponent: () => <p role="status">Loading subject grades…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load subject grades: {error.message}</p>
	),
	head: ({ params }) => ({
		meta: [{ title: `${params.subject} · Grades · Timetable` }],
	}),
});
