import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { cn } from "@/lib/utils";
import styles from "./Symbol.module.css";

export type SymbolProps = Omit<JSX.HTMLAttributes<HTMLSpanElement>, "children"> & {
	name?: string;
	src?: string;
	fallback?: JSX.Element;
	alt?: string;
	className?: string;
};

function normalizeSymbolName(name: string) {
	return name.trim().replace(/\.svg$/i, "");
}

function Symbol(props: SymbolProps) {
	const [local, rest] = splitProps(props, [
		"name",
		"src",
		"fallback",
		"alt",
		"class",
		"className",
	]);
	const normalizedName = local.name ? normalizeSymbolName(local.name) : null;
	const imageSource =
		local.src ??
		(normalizedName
			? `/icons/${encodeURIComponent(normalizedName)}.svg`
			: null);
	const decorative = !local.alt;

	if (!imageSource) {
		return local.fallback !== undefined ? (
			<span
				{...rest}
				class={cn(styles.fallback, local.class ?? local.className)}
				aria-hidden={decorative || undefined}
				aria-label={decorative ? undefined : local.alt}
				role={decorative ? undefined : "img"}
			>
				{local.fallback}
			</span>
		) : null;
	}

	return (
		<span
			{...rest}
			class={cn(styles.symbol, local.class ?? local.className)}
			aria-hidden={decorative || undefined}
			aria-label={decorative ? undefined : local.alt}
			role={decorative ? undefined : "img"}
			style={{ "--symbol-image": `url("${imageSource}")` }}
		/>
	);
}

export default Symbol;
