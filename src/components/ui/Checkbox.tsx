"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export type CheckboxProps = ComponentPropsWithoutRef<
	typeof BaseCheckbox.Root
> & {
	label?: string;
};

export function Checkbox({ className, label, ...props }: CheckboxProps) {
	return (
		<BaseCheckbox.Root
			aria-label={label}
			className={cn(styles.checkbox, className)}
			{...props}
		>
			<BaseCheckbox.Indicator className={styles.checkboxIndicator}>
				<span aria-hidden="true">✓</span>
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
}
