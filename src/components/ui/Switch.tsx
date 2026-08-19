"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./primitives.module.css";

export type SwitchProps = ComponentPropsWithoutRef<typeof BaseSwitch.Root> & {
	label?: string;
};

export function Switch({ className, label, ...props }: SwitchProps) {
	return (
		<BaseSwitch.Root
			aria-label={label}
			className={cn(styles.switch, className)}
			{...props}
		>
			<BaseSwitch.Thumb className={styles.switchThumb} />
		</BaseSwitch.Root>
	);
}
