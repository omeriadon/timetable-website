import { Button } from "@/components/ui/button";
import type { JSX } from "solid-js";
import { useDrawer } from "../Drawer/Drawer";

type DrawerTriggerProps = {
	children: JSX.Element;
	content: () => JSX.Element;
	className?: string;
	ariaLabel: string;
};

export default function DrawerTrigger({
	children,
	content,
	className,
			ariaLabel,
}: DrawerTriggerProps) {
	const { openDrawer } = useDrawer();

	return (
		<Button
			type="button"
			class={className}
			aria-label={ariaLabel}
			onClick={() => openDrawer(content)}
		>
			{children}
		</Button>
	);
}
