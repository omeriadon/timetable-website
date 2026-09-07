import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./input.module.css";

function Input(
	props: JSX.InputHTMLAttributes<HTMLInputElement> & {
		className?: string;
		autoComplete?: string;
	},
) {
	const [local, rest] = splitProps(props, [
		"class",
		"className",
		"autoComplete",
		"type",
		"onInput",
		"onChange",
	]);
	const handleInput = (
		event: InputEvent & { currentTarget: HTMLInputElement },
	) => {
		invokeHandler(local.onInput, event);
		if (local.type !== "file") {
			invokeHandler(local.onChange, event);
		}
	};
	return (
		<input
			{...rest}
			type={local.type}
			onInput={handleInput}
			onChange={local.type === "file" ? local.onChange : undefined}
			autocomplete={local.autoComplete}
			data-slot="input"
			class={cn(styles.input, local.class ?? local.className)}
		/>
	);
}

function invokeHandler(handler: unknown, event: unknown) {
	if (!handler) return;
	if (typeof handler === "function") {
		handler(event);
		return;
	}
	const bound = handler as [(data: unknown, event: unknown) => void, unknown];
	bound[0](bound[1], event);
}

export { Input };
