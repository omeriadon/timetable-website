import { createFileRoute } from "@tanstack/solid-router";
import Page from "@/pages/friends/page";
import { loadFriends } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/friends")({
	loader: async ({ context }) => ({
		...(await loadFriends()),
		account: context.account,
	}),
	staleTime: 3 * 60 * 1000,
	gcTime: 30 * 60 * 1000,
	pendingMs: 250,
	head: () => ({ meta: [{ title: "Friends · Timetable" }] }),
	component: () => {
		const data = Route.useLoaderData();
		return <Page data={data()} />;
	},
	pendingComponent: () => <p role="status">Loading friends…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load friends: {error.message}</p>
	),
});
