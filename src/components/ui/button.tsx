import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./button.module.css";

type ButtonVariant =
	| "default"
	| "outline"
	| "secondary"
	| "ghost"
	| "destructive"
	| "link";

type ButtonSize =
	| "default"
	| "xs"
	| "sm"
	| "lg"
	| "icon"
	| "icon-xs"
	| "icon-sm"
	| "icon-lg";

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	className?: string;
	key?: unknown;
	variant?: ButtonVariant;
	size?: ButtonSize;
	fullWidth?: boolean;
	flexible?: boolean;
};

function Button(props: ButtonProps) {
	const [local, rest] = splitProps(props, [
		"children",
		"class",
		"className",
		"variant",
		"size",
		"fullWidth",
		"flexible",
		"type",
	]);

	return (
		<button
			{...rest}
			type={local.type ?? "button"}
			data-slot="button"
			data-variant={local.variant ?? "default"}
			data-size={local.size ?? "default"}
			class={cn(
				styles.button,
				local.fullWidth && styles.fullWidth,
				local.flexible && styles.flexible,
				local.class ?? local.className,
			)}
		>
			{local.children}
		</button>
	);
}

export { Button };
