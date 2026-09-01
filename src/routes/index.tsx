import { createFileRoute } from "@tanstack/react-router";
import LandingPage from "@/app/page";
export const Route = createFileRoute("/")({ component: LandingPage });
