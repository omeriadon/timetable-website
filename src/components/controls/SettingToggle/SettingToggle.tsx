"use client";

import { ListRow } from "@/components/ui/list";
import { Toggle } from "@/components/ui/toggle";
import styles from "@/components/controls/controls.module.css";

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
		<ListRow className={styles.settingToggle}>
			<span>{label}</span>
			<Toggle
				checked={enabled}
				onCheckedChange={() => onClick()}
				disabled={disabled}
				aria-label={label}
			/>
		</ListRow>
	);
}
