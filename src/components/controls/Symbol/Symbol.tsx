"use client";

import {
	forwardRef,
	type CSSProperties,
	type HTMLAttributes,
	type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import styles from "./Symbol.module.css";

export type SymbolProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
	/** The exact SwiftUI system-name spelling, for example `calendar.badge.clock`. */
	name?: string;

	/** An explicit image source. */
	src?: string;

	/** Optional text fallback. */
	fallback?: ReactNode;

	/** Set when the symbol conveys meaning instead of decorating nearby text. */
	alt?: string;
};

function normalizeSymbolName(name: string) {
	return name.trim().replace(/\.svg$/i, "");
}

const Symbol = forwardRef<HTMLSpanElement, SymbolProps>(function Symbol(
	{ name, src, fallback, alt, className, style, ...props },
	ref,
) {
	const normalizedName = name ? normalizeSymbolName(name) : null;

	const imageSource =
		src ??
		(normalizedName
			? `/icons/${encodeURIComponent(normalizedName)}.svg`
			: null);

	const decorative = !alt;

	if (!imageSource) {
		return fallback !== undefined ? (
			<span
				{...props}
				ref={ref}
				className={cn(styles.fallback, className)}
				aria-hidden={decorative || undefined}
				aria-label={decorative ? undefined : alt}
				role={decorative ? undefined : "img"}
			>
				{fallback}
			</span>
		) : null;
	}

	return (
		<span
			{...props}
			ref={ref}
			className={cn(styles.symbol, className)}
			aria-hidden={decorative || undefined}
			aria-label={decorative ? undefined : alt}
			role={decorative ? undefined : "img"}
			style={
				{
					"--symbol-image": `url("${imageSource}")`,
					...style,
				} as CSSProperties
			}
		/>
	);
});

Symbol.displayName = "Symbol";

export default Symbol;
