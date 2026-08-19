"use client";

import { Button } from "@base-ui/react/button";
import type { ReactNode } from "react";
import { useDrawer } from "../Drawer/Drawer";

type DrawerTriggerProps = {
	children: ReactNode;
	content: ReactNode;
	className?: string;
	ariaLabel: string;
};

export default function DrawerTrigger({
	children,
	content,
	className,
	ariaLabel,
}: DrawerTriggerProps) {
	const { openDrawer } = useDrawer();

	return (
		<Button
			type="button"
			className={className}
			aria-label={ariaLabel}
			onClick={() => openDrawer(content)}
		>
			{children}
		</Button>
	);
}
