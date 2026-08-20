import { Button as ButtonPrimitive } from "@base-ui/react/button";

import { cn } from "@/lib/utils";

import styles from "./button.module.css";

type ButtonVariant =
	"default" | "outline" | "secondary" | "ghost" | "destructive" | "link";

type ButtonSize =
	"default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";

function Button({
	className,
	variant = "default",
	size = "default",
	fullWidth = false,
	type = "button",
	...props
}: ButtonPrimitive.Props & {
	variant?: ButtonVariant;
	size?: ButtonSize;
	fullWidth?: boolean;
}) {
	return (
		<ButtonPrimitive
			type={type}
			data-slot="button"
			data-variant={variant}
			data-size={size}
			className={cn(styles.button, fullWidth && styles.fullWidth, className)}
			{...props}
		/>
	);
}

export { Button };
