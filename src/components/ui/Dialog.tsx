"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export function Dialog({
	trigger,
	title,
	children,
	className,
}: {
	trigger: ReactNode;
	title: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<BaseDialog.Root>
			<BaseDialog.Trigger className={styles.button}>
				{trigger}
			</BaseDialog.Trigger>
			<BaseDialog.Portal>
				<BaseDialog.Backdrop className={styles.drawerBackdrop} />
				<BaseDialog.Popup className={cn(styles.drawerPopup, className)}>
					<BaseDialog.Title className={styles.drawerTitle}>
						{title}
					</BaseDialog.Title>
					{children}
					<BaseDialog.Close className={cn(styles.button, styles.buttonCompact)}>
						Close
					</BaseDialog.Close>
				</BaseDialog.Popup>
			</BaseDialog.Portal>
		</BaseDialog.Root>
	);
}
