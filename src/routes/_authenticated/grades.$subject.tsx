import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/grades/[subject]/page";
export const Route = createFileRoute("/_authenticated/grades/$subject")({
	component: () => {
		const { subject } = Route.useParams();
		return <Page subject={subject} />;
	},
});
