"use client";

import { Button as BaseButton } from "@base-ui/react/button";
import type { ReactNode } from "react";
import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
import { glassButtonProps } from "@/components/LiquidGlass/presets";
import styles from "../controls.module.css";

type GlassButtonProps = {
	children: ReactNode;
	label: string;
	onClick?: () => void;
	className?: string;
	size?: "regular" | "compact";
	disabled?: boolean;
	tone?: "regular" | "prominent" | "destructive";
};

export default function GlassButton({
	children,
	label,
	onClick,
	className,
	size = "regular",
	disabled = false,
	tone = "regular",
}: GlassButtonProps) {
	return (
		<BaseButton
			nativeButton={false}
			render={<LiquidGlass {...glassButtonProps} />}
			className={`${styles.glassButton} ${styles[size]} ${styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`]} ${disabled ? styles.disabled : ""} ${className ?? ""}`}
			onClick={onClick}
			disabled={disabled}
			aria-label={label}
		>
			{children}
		</BaseButton>
	);
}
