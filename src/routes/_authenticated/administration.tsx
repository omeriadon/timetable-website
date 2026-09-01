import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/administration/page";
export const Route = createFileRoute("/_authenticated/administration")({ component: Page });
