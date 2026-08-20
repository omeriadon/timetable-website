"use client";

import {
	forwardRef,
	useState,
	type ImgHTMLAttributes,
	type ReactNode,
} from "react";

export type SymbolProps = Omit<
	ImgHTMLAttributes<HTMLImageElement>,
	"alt" | "children" | "src"
> & {
	/** The exact SwiftUI system-name spelling, for example `calendar.badge.clock`. */
	name?: string;
	/** An explicit image source for photos or non-symbol branded assets. */
	src?: string;
	/** Optional text fallback used when the exported SVG is unavailable. */
	fallback?: ReactNode;
	/** Set this when the symbol conveys meaning instead of decorating nearby text. */
	alt?: string;
};

function normalizeSymbolName(name: string) {
	return name.trim().replace(/\.svg$/i, "");
}

const Symbol = forwardRef<HTMLImageElement, SymbolProps>(function Symbol(
	{ name, src, fallback, alt, className, onError, ...props },
	ref,
) {
	const normalizedName = name ? normalizeSymbolName(name) : null;
	const imageSource =
		src ??
		(normalizedName
			? `/icons/${encodeURIComponent(normalizedName)}.svg`
			: null);
	const [failedName, setFailedName] = useState<string | null>(null);
	const decorative = !alt;
	if (imageSource === null) {
		return fallback !== undefined ? (
			<span
				className={className}
				data-default-symbol={className ? undefined : ""}
				aria-hidden={decorative || undefined}
				aria-label={decorative ? undefined : alt}
				role={decorative ? undefined : "img"}
			>
				{fallback}
			</span>
		) : null;
	}

	if (failedName === imageSource && fallback !== undefined) {
		return (
			<span
				className={className}
				data-default-symbol={className ? undefined : ""}
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
			className={className}
			data-default-symbol={className ? undefined : ""}
			src={imageSource}
			alt={alt ?? ""}
			aria-hidden={decorative || undefined}
			decoding="async"
			onError={(event) => {
				setFailedName(imageSource);
				onError?.(event);
			}}
		/>
	);
});

Symbol.displayName = "Symbol";

export default Symbol;
