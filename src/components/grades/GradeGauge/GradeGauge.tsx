import type { CSSProperties } from "react";
import styles from "@/app/grades/page.module.css";

export default function GradeGauge({ value, color, symbol }: { value: number | null; color: string; symbol: string }) {
	const percentage = value === null ? 0 : Math.max(0, Math.min(100, value * 100));
	return (
		<span className={styles.gauge} style={{ "--gauge-value": percentage, "--gauge-color": color } as CSSProperties}>
			<span>{value === null ? symbol : `${Math.round(percentage)}%`}</span>
		</span>
	);
}
