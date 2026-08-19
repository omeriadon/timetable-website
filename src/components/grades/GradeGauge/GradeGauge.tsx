import Symbol from "@/components/controls/Symbol/Symbol";

export default function GradeGauge({
	value,
	color: _color,
	symbol,
}: {
	value: number | null;
	color: string;
	symbol: string;
}) {
	const percentage =
		value === null ? 0 : Math.max(0, Math.min(100, value * 100));
	return (
		<span>
			<span>
				{value === null ? (
					<Symbol name={symbol} />
				) : (
					`${Math.round(percentage)}%`
				)}
			</span>
		</span>
	);
}
