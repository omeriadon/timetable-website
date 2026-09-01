import { Link as TanStackLink } from "@tanstack/react-router";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof TanStackLink>, "to"> & {
	to?: string;
	href?: string;
};

export default function RouterLink({ href, to, ...props }: Props) {
	return <TanStackLink to={(to ?? href ?? "/") as never} {...props} />;
}
