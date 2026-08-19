"use client";

import { Button } from "@/components/ui/Button";
import type { ReactNode } from "react";
import { useSheet } from "../Sheet/Sheet";

type SheetTriggerProps = {
	children: ReactNode;
	content: ReactNode;
	className?: string;
	ariaLabel: string;
};

export default function SheetTrigger({
	children,
	content,
	className,
	ariaLabel,
}: SheetTriggerProps) {
	const { openSheet } = useSheet();

	return (
		<Button
			unstyled
			type="button"
			className={className}
			aria-label={ariaLabel}
			onClick={() => openSheet(content)}
		>
			{children}
		</Button>
	);
}
