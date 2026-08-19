"use client";

import { Switch as BaseSwitch } from "@base-ui/react/switch";
import type { ComponentPropsWithoutRef } from "react";

export type SwitchProps = ComponentPropsWithoutRef<typeof BaseSwitch.Root> & {
	label?: string;
};

export function Switch({ className, label, ...props }: SwitchProps) {
	return (
		<BaseSwitch.Root aria-label={label} className={className} {...props}>
			<BaseSwitch.Thumb />
		</BaseSwitch.Root>
	);
}
