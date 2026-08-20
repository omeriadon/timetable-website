"use client";

import { Select } from "@/components/ui/select";
import type { ProfileAppearance } from "@/lib/api/contracts";
import styles from "./ProfileFontPicker.module.css";

type Props = {
	design: string;
	weight: string;
	onDesignChange: (value: string) => void;
	onWeightChange: (value: string) => void;
};

const designs = ["default", "serif", "monospaced", "rounded"];
const weights = [
	"ultraLight",
	"thin",
	"light",
	"regular",
	"medium",
	"semibold",
	"bold",
	"heavy",
	"black",
];

export default function ProfileFontPicker({
	design,
	weight,
	onDesignChange,
	onWeightChange,
}: Props) {
	return (
		<div className={styles.picker}>
			<label>
				<span>Design</span>
				<Select
					value={design}
					onChange={(event) => onDesignChange(event.target.value)}
				>
					{designs.map((item) => (
						<option key={item} value={item}>
							{item === "default"
								? "Default"
								: item[0].toUpperCase() + item.slice(1)}
						</option>
					))}
				</Select>
			</label>
			<label>
				<span>Weight</span>
				<Select
					value={weight}
					onChange={(event) => onWeightChange(event.target.value)}
				>
					{weights.map((item) => (
						<option key={item} value={item}>
							{item[0].toUpperCase() + item.slice(1)}
						</option>
					))}
				</Select>
			</label>
		</div>
	);
}

export type ProfileFontValues = Pick<
	ProfileAppearance,
	"fontDesign" | "fontWeight"
>;
