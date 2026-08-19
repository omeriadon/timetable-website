"use client";

import { Menu as BaseMenu } from "@base-ui/react/menu";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export function Menu({
	label,
	children,
	className,
}: {
	label: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<BaseMenu.Root>
			<BaseMenu.Trigger className={cn(styles.menuTrigger, className)}>
				{label}
			</BaseMenu.Trigger>
			<BaseMenu.Portal>
				<BaseMenu.Positioner sideOffset={4} align="start">
					<BaseMenu.Popup className={styles.menuPopup}>
						<div className={styles.menuList}>{children}</div>
					</BaseMenu.Popup>
				</BaseMenu.Positioner>
			</BaseMenu.Portal>
		</BaseMenu.Root>
	);
}

export function MenuItem({
	children,
	onClick,
	className,
}: {
	children: ReactNode;
	onClick?: () => void;
	className?: string;
}) {
	return (
		<BaseMenu.Item className={cn(styles.menuItem, className)} onClick={onClick}>
			{children}
		</BaseMenu.Item>
	);
}
