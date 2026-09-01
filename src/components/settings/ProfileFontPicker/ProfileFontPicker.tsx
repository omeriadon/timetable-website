import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ListRow } from "@/components/ui/list";
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
			<ListRow>
				<span>Design</span>
				<Select
					value={design}
					onValueChange={(value) => {
						if (value !== null) {
							onDesignChange(value);
						}
					}}
				>
					<SelectTrigger aria-label="Font design">
						<SelectValue>{fontLabel(design)}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{designs.map((item) => (
							<SelectItem key={item} value={item}>
								{fontLabel(item)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</ListRow>
			<ListRow>
				<span>Weight</span>
				<Select
					value={weight}
					onValueChange={(value) => {
						if (value !== null) {
							onWeightChange(value);
						}
					}}
				>
					<SelectTrigger aria-label="Font weight">
						<SelectValue>{fontLabel(weight)}</SelectValue>
					</SelectTrigger>
					<SelectContent>
						{weights.map((item) => (
							<SelectItem key={item} value={item}>
								{fontLabel(item)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</ListRow>
		</div>
	);
}

function fontLabel(value: string) {
	return value === "default"
		? "Default"
		: value[0].toUpperCase() + value.slice(1);
}

export type ProfileFontValues = Pick<
	ProfileAppearance,
	"fontDesign" | "fontWeight"
>;
