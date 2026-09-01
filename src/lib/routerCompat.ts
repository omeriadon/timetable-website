import { useLocation, useNavigate, useParams as useTanStackParams } from "@tanstack/react-router";

export function usePathname() {
	return useLocation({ select: (location) => location.pathname });
}

export function useRouter() {
	const navigate = useNavigate();
	return {
		push: (href: string) => navigate({ to: href as never }),
		replace: (href: string) => navigate({ to: href as never, replace: true }),
		back: () => window.history.back(),
		refresh: () => navigate({ to: window.location.pathname as never, replace: true }),
	};
}

export function useParams<T extends Record<string, string>>() {
	return (useTanStackParams as unknown as (options: { strict: false }) => T)({ strict: false });
}
