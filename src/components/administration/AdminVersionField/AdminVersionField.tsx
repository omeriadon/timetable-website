import { Input } from "@/components/ui/input";
import styles from "@/components/administration/Administration.module.css";

type AdminVersionFieldProps = {
	label: string;
	value: string;
	inputMode?: "numeric";
	onChange: (value: string) => void;
};

export default function AdminVersionField({
	label,
	value,
	inputMode,
	onChange,
}: AdminVersionFieldProps) {
	return (
		<label class={styles.row}>
			<span class={styles.label}>{label}</span>
			<Input
				class={styles.inlineInput}
				value={value}
				inputMode={inputMode}
				onChange={(event) => onChange(event.target.value)}
				aria-label={label}
			/>
		</label>
	);
}
