import { createFileRoute } from "@tanstack/solid-router";
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
			const params = Route.useParams();
			const data = Route.useLoaderData();
			return <Page section={params().section} data={data()} />;
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
