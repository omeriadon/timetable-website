"use client";

import {
	forwardRef,
	useState,
	type ImgHTMLAttributes,
	type ReactNode,
} from "react";
import styles from "../controls.module.css";

export type SymbolProps = Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"alt" | "children" | "src"
> & {
	/** The exact SwiftUI system-name spelling, for example `calendar.badge.clock`. */
	name: string;
	/** Optional text fallback used when the exported SVG is unavailable. */
	fallback?: ReactNode;
	/** Set this when the symbol conveys meaning instead of decorating nearby text. */
	alt?: string;
};

function normalizeSymbolName(name: string) {
	return name.trim().replace(/\.svg$/i, "");
}

const Symbol = forwardRef<HTMLImageElement, SymbolProps>(function Symbol(
	{ name, fallback, alt, className, onError, ...props },
	ref,
) {
	const normalizedName = normalizeSymbolName(name);
	const [failedName, setFailedName] = useState<string | null>(null);
	const decorative = !alt;
	const resolvedClassName = className ?? styles.symbolIcon;

	if (failedName === normalizedName && fallback !== undefined) {
		return (
			<span
				className={resolvedClassName}
				aria-hidden={decorative || undefined}
				aria-label={decorative ? undefined : alt}
				role={decorative ? undefined : "img"}
			>
				{fallback}
			</span>
		);
	}

	return (
		<img
			{...props}
			ref={ref}
			className={resolvedClassName}
			src={`/icons/${encodeURIComponent(normalizedName)}.svg`}
			alt={alt ?? ""}
			aria-hidden={decorative || undefined}
			decoding="async"
			onError={(event) => {
				setFailedName(normalizedName);
				onError?.(event);
			}}
		/>
	);
});

Symbol.displayName = "Symbol";

export default Symbol;
