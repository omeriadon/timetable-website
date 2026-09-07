import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./textarea.module.css";

function Textarea(
	props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & {
		className?: string;
	},
) {
	const [local, rest] = splitProps(props, [
		"class",
		"className",
		"onInput",
		"onChange",
	]);
	const handleInput = (
		event: InputEvent & { currentTarget: HTMLTextAreaElement },
	) => {
		invokeHandler(local.onInput, event);
		invokeHandler(local.onChange, event);
	};
	return (
		<textarea
			{...rest}
			onInput={handleInput}
			data-slot="textarea"
			class={cn(styles.textarea, local.class ?? local.className)}
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

export { Textarea };
