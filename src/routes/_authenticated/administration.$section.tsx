import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/administration/[section]/page";
import { loadAdministrationSection } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/administration/$section")(
	{
		loader: ({ params }) =>
			loadAdministrationSection({
				data: {
					endpoint: [
						"calendar",
						"school-events",
						"term-dates",
						"pupil-free-days",
					].includes(params.section)
						? "v1/administration/calendar"
						: undefined,
				},
			}),
		component: () => {
			const { section } = Route.useParams();
			return <Page section={section} data={Route.useLoaderData()} />;
		},
		pendingComponent: () => (
			<p role="status">Loading administration section…</p>
		),
		errorComponent: ({ error }) => (
			<p role="alert">Unable to load administration section: {error.message}</p>
		),
		head: ({ params }) => ({
			meta: [{ title: `${params.section} · Administration · Timetable` }],
		}),
	},
);
