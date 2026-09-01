import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/classes/page";
export const Route = createFileRoute("/_authenticated/classes")({ component: Page });
