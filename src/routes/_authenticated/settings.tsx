import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/settings/page";
import { loadSettings } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/settings")({
	loader: async ({ context }) => ({
		...(await loadSettings()),
		account: context.account,
	}),
	staleTime: 30 * 60 * 1000,
	gcTime: 60 * 60 * 1000,
	pendingMs: 250,
	head: () => ({ meta: [{ title: "Settings · Timetable" }] }),
	component: () => {
		const data = Route.useLoaderData();
		return <Page data={data()} />;
	},
	pendingComponent: () => <p role="status">Loading settings…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load settings: {error.message}</p>
	),
});
