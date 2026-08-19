"use client";

import { Switch } from "@base-ui/react/switch";
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
		<Switch.Root
			className={styles.settingToggle}
			checked={enabled}
			onCheckedChange={onClick}
			disabled={disabled}
			aria-label={label}
		>
			<span>{label}</span>
			<span
				className={
					enabled ? `${styles.switch} ${styles.switchOn}` : styles.switch
				}
				aria-hidden="true"
			>
				<Switch.Thumb className={styles.switchThumb} />
			</span>
		</Switch.Root>
	);
}
