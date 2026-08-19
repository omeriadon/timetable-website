"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export function Popover({
	trigger,
	children,
	className,
}: {
	trigger: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<BasePopover.Root>
			<BasePopover.Trigger className={styles.menuTrigger}>
				{trigger}
			</BasePopover.Trigger>
			<BasePopover.Portal>
				<BasePopover.Positioner sideOffset={4}>
					<BasePopover.Popup className={cn(styles.popoverPopup, className)}>
						{children}
					</BasePopover.Popup>
				</BasePopover.Positioner>
			</BasePopover.Portal>
		</BasePopover.Root>
	);
}
