"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import type { ReactNode } from "react";

export function Dialog({
	trigger,
	title,
	children,
}: {
	trigger: ReactNode;
	title: ReactNode;
	children: ReactNode;
	className?: string;
}) {
	return (
		<BaseDialog.Root>
			<BaseDialog.Trigger>{trigger}</BaseDialog.Trigger>
			<BaseDialog.Portal>
				<BaseDialog.Backdrop />
				<BaseDialog.Popup>
					<BaseDialog.Title>{title}</BaseDialog.Title>
					{children}
					<BaseDialog.Close>Close</BaseDialog.Close>
				</BaseDialog.Popup>
			</BaseDialog.Portal>
		</BaseDialog.Root>
	);
}
