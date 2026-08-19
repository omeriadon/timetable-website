"use client";

import { useState } from "react";
import styles from "../controls.module.css";

type SymbolIconProps = {
	name: string;
	fallback?: string;
	className?: string;
};

export default function SymbolIcon({
	name,
	fallback,
	className,
}: SymbolIconProps) {
	const normalizedName = name.replace(/\.svg$/, "");
	const [failedName, setFailedName] = useState<string | null>(null);

	if (failedName === normalizedName && fallback) {
		return (
			<span className={className ?? styles.symbolIcon} aria-hidden="true">
				{fallback}
			</span>
		);
	}

	return (
		<img
			className={className ?? styles.symbolIcon}
			src={`/icons/${normalizedName}.svg`}
			alt=""
			aria-hidden="true"
			onError={() => setFailedName(normalizedName)}
		/>
	);
}
