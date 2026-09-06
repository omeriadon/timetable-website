import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./textarea.module.css";

function Textarea(props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }) {
	const [local, rest] = splitProps(props, ["class", "className"]);
	return <textarea {...rest} data-slot="textarea" class={cn(styles.textarea, local.class ?? local.className)} />;
}

export { Textarea };
