"use client";

import { Switch } from "@base-ui/react/switch";
import { ListRow } from "@/components/ui/list";
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
			<Switch.Root
				className={styles.switch}
				checked={enabled}
				onCheckedChange={onClick}
				disabled={disabled}
				aria-label={label}
			>
				<Switch.Thumb className={styles.switchThumb} />
			</Switch.Root>
		</ListRow>
	);
}
