import { createFileRoute } from "@tanstack/react-router";
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
		const { section } = Route.useParams();
		return <Page section={section} data={Route.useLoaderData()} />;
	},
	pendingComponent: () => <p role="status">Loading settings section…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load settings: {error.message}</p>
	),
	head: ({ params }) => ({
		meta: [{ title: `${params.section} · Settings · Timetable` }],
	}),
});
