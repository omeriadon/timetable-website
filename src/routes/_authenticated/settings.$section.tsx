import { createFileRoute } from "@tanstack/react-router";
import Page from "@/app/settings/[section]/page";
export const Route = createFileRoute("/_authenticated/settings/$section")({ component: Page });
