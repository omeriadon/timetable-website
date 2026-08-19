"use client";

import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import type { ComponentPropsWithoutRef } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";

export type CheckboxProps = ComponentPropsWithoutRef<
	typeof BaseCheckbox.Root
> & {
	label?: string;
};

export function Checkbox({ className, label, ...props }: CheckboxProps) {
	return (
		<BaseCheckbox.Root aria-label={label} className={className} {...props}>
			<BaseCheckbox.Indicator>
				<Symbol name="checkmark" />
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
}
