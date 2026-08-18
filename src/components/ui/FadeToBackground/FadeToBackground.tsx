export function FadeToBackground({
	height = "200px",
	maxOpacity = 0.7,
	direction = "to bottom",
	steps = 16,
	className = "",
}: {
	height?: string;
	maxOpacity?: number;
	direction?: "to bottom" | "to top";
	steps?: number;
	className?: string;
}) {
	const smootherstep = (t: number): number =>
		t * t * t * (t * (t * 6 - 15) + 10);

	const stops = Array.from({ length: steps + 1 }, (_, i) => {
		const t = i / steps;
		const eased = smootherstep(t);
		const pct = (eased * maxOpacity * 100).toFixed(2);
		const pos = (t * 100).toFixed(2);
		return `color-mix(in srgb, var(--background) ${pct}%, transparent) ${pos}%`;
	});

	return (
		<div
			className={className}
			style={{
				position: "absolute",
				inset: direction === "to bottom" ? "auto 0 0 0" : "0 0 auto 0",
				height,
				pointerEvents: "none",
				background: `linear-gradient(${direction}, ${stops.join(", ")})`,
			}}
		/>
	);
}
