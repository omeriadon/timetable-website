"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ReactNode } from "react";

export function Menu({
	label,
	children,
}: {
	label: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<BaseMenu.Root>
			<BaseMenu.Trigger>{label}</BaseMenu.Trigger>
			<BaseMenu.Portal>
				<BaseMenu.Positioner sideOffset={4} align="start">
					<BaseMenu.Popup>{children}</BaseMenu.Popup>
				</BaseMenu.Positioner>
			</BaseMenu.Portal>
		</BaseMenu.Root>
	);
}

export function MenuItem({
	children,
	onClick,
}: {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
}) {
	return <BaseMenu.Item onClick={onClick}>{children}</BaseMenu.Item>;
}
