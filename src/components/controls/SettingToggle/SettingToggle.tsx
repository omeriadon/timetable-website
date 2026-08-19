"use client";

import styles from "../controls.module.css";

type SettingToggleProps = {
	label: string;
	enabled: boolean;
	onClick: () => void;
	disabled?: boolean;
};

export default function SettingToggle({
	label,
	enabled,
	onClick,
	disabled = false,
}: SettingToggleProps) {
	return (
		<button
			type="button"
			className={styles.settingToggle}
			onClick={onClick}
			disabled={disabled}
			aria-pressed={enabled}
		>
			<span>{label}</span>
			<span
				className={
					enabled ? `${styles.switch} ${styles.switchOn}` : styles.switch
				}
				aria-hidden="true"
			>
				<span className={styles.switchThumb} />
			</span>
		</button>
	);
}
