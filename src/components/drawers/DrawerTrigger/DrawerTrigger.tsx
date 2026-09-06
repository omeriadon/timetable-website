import { Button } from "@/components/ui/button";
import type { JSX } from "solid-js";
import { useDrawer } from "../Drawer/Drawer";

type DrawerTriggerProps = {
	children: JSX.Element;
	content: JSX.Element | (() => JSX.Element);
	className?: string;
	class?: string;
	key?: string | number;
	ariaLabel: string;
};

export default function DrawerTrigger({
	children,
	content,
	className,
	class: classValue,
	ariaLabel,
}: DrawerTriggerProps) {
	const { openDrawer } = useDrawer();

	return (
		<Button
			type="button"
			class={className ?? classValue}
			aria-label={ariaLabel}
			onClick={() => openDrawer(content)}
		>
			{children}
		</Button>
	);
}
