import { createFileRoute } from "@tanstack/react-router";
import Page from "@/pages/friends/page";
import { loadFriends } from "@/lib/server/page-data.functions";
export const Route = createFileRoute("/_authenticated/friends")({
	loader: async ({ context }) => ({
		...(await loadFriends()),
		account: context.account,
	}),
	head: () => ({ meta: [{ title: "Friends · Timetable" }] }),
	component: () => <Page data={Route.useLoaderData()} />,
	pendingComponent: () => <p role="status">Loading friends…</p>,
	errorComponent: ({ error }) => (
		<p role="alert">Unable to load friends: {error.message}</p>
	),
});
