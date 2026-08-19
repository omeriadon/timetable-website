import styles from "@/components/IOSScreen/IOSScreen.module.css";

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
      <input
        className={styles.inlineInput}
        value={value}
        inputMode={inputMode}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
      />
    </label>
  );
}
