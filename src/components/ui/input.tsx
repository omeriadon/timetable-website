import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./input.module.css";

function Input(props: JSX.InputHTMLAttributes<HTMLInputElement> & { className?: string }) {
	const [local, rest] = splitProps(props, ["class", "className"]);
	return <input {...rest} data-slot="input" class={cn(styles.input, local.class ?? local.className)} />;
}

export { Input };
