import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/settings/page";
import { loadSettings } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/settings")({
	loader: async ({ context }) => ({
		...(await loadSettings()),
		account: context.account,
	}),
	head: () => ({ meta: [{ title: "Settings · Timetable" }] }),
	component: () => <Page data={Route.useLoaderData()} />,
	pendingComponent: () => <p role="status">Loading settings…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load settings: {error.message}</p>
	),
});
