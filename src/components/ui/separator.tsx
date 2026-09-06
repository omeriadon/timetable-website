import { Separator as SeparatorPrimitive } from "@kobalte/core/separator";

import { cn } from "@/lib/utils";

import styles from "./separator.module.css";

function Separator({
	className,
	orientation = "horizontal",
	...props
}: any) {
	return (
		<SeparatorPrimitive
			data-slot="separator"
			orientation={orientation}
			class={cn(styles.separator, className)}
			{...props}
		/>
	);
}

export { Separator };
