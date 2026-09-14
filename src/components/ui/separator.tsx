import { Separator as SeparatorPrimitive } from "@kobalte/core/separator";
import type { ComponentProps } from "solid-js";

import { cn } from "@/lib/utils";

import styles from "./separator.module.css";

function Separator({
	className,
	orientation = "horizontal",
	...props
}: ComponentProps<typeof SeparatorPrimitive> & { className?: string }) {
	return (
		<SeparatorPrimitive
			data-slot="separator"
			orientation={orientation}
			{...props}
			class={cn(styles.separator, className ?? props.class)}
		/>
	);
}

export { Separator };
