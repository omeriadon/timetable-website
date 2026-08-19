"use client";

import { Switch } from "@base-ui/react/switch";

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
			checked={enabled}
			onCheckedChange={onClick}
			disabled={disabled}
			aria-label={label}
		>
			<span>{label}</span>
			<span aria-hidden="true">
				<Switch.Thumb />
			</span>
		</Switch.Root>
	);
}
