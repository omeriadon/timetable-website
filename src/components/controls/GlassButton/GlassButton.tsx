"use client";

import type { KeyboardEvent, ReactNode } from "react";
import LiquidGlass from "@/components/LiquidGlass/LiquidGlass";
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
	const activate = (event: KeyboardEvent<HTMLDivElement>) => {
		if (!disabled && (event.key === "Enter" || event.key === " ") && onClick) {
			event.preventDefault();
			onClick();
		}
	};

	return (
		<LiquidGlass
			radius={999}
			scale={-80}
			border={0}
			alpha={20}
			inputBlur={12}
			outputBlur={1}
			red={10}
			green={10}
			blue={0}
			frost={0}
			saturation={1.3}
			interactive
			dragFollow={0.05}
			dragDistance={38}
			dragPressScale={1.06}
			dragDuration={0.35}
			dragReleaseDuration={0.45}
			dragStretch={0.18}
			dragSquash={0.12}
			dragBounce={0.25}
			filterPadding={32}
			className={`${styles.glassButton} ${styles[size]} ${styles[`tone${tone[0].toUpperCase()}${tone.slice(1)}`]} ${disabled ? styles.disabled : ""} ${className ?? ""}`}
			onClick={disabled ? undefined : onClick}
			onKeyDown={activate}
			role="button"
			aria-label={label}
			aria-disabled={disabled}
			tabIndex={0}
		>
			{children}
		</LiquidGlass>
	);
}
