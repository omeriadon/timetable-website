import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/planner/page";
export const Route = createFileRoute("/_authenticated/planner")({ component: Page });
