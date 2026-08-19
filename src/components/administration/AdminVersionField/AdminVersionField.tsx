import { Input } from "@/components/ui/Input";
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
		<label className={styles.row}>
			<span className={styles.label}>{label}</span>
			<Input
				className={styles.inlineInput}
				value={value}
				inputMode={inputMode}
				onChange={(event) => onChange(event.target.value)}
				aria-label={label}
			/>
		</label>
	);
}
