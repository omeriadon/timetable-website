import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/settings/[section]/page";
import {
	loadProfileSettingsSection,
	loadSettingsSection,
} from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/settings/$section")({
	loader: ({ params }) =>
		params.section === "profile-appearance"
			? loadProfileSettingsSection()
			: loadSettingsSection(),
	component: () => {
		const params = Route.useParams();
		const data = Route.useLoaderData();
		return <Page section={params().section} data={data()} />;
	},
	pendingComponent: () => <p role="status">Loading settings section…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load settings: {error.message}</p>
	),
	head: ({ params }) => ({
		meta: [{ title: `${params.section} · Settings · Timetable` }],
	}),
});
