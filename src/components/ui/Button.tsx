"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export type ButtonProps = ComponentPropsWithoutRef<typeof BaseButton> & {
	variant?: "regular" | "prominent" | "destructive" | "plain";
	size?: "regular" | "compact";
	unstyled?: boolean;
};

export function Button({
	className,
	variant = "regular",
	size = "regular",
	unstyled = false,
	...props
}: ButtonProps) {
	return (
		<BaseButton
			className={cn(
				!unstyled && styles.button,
				!unstyled && size === "compact" && styles.buttonCompact,
				!unstyled && variant === "prominent" && styles.buttonProminent,
				!unstyled && variant === "destructive" && styles.buttonDestructive,
				!unstyled && variant === "plain" && styles.buttonPlain,
				className,
			)}
			{...props}
		/>
	);
}
