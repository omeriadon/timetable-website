import type { JSX } from "solid-js";
import { splitProps } from "solid-js";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import styles from "./list.module.css";

type CommonProps = {
	className?: string;
	class?: string;
	key?: string | number;
	children?: JSX.Element | JSX.Element[];
};

export function List(
	props: CommonProps & { rowHover?: boolean; sections?: boolean },
) {
	const [local] = splitProps(props, [
		"children",
		"className",
		"class",
		"rowHover",
		"sections",
	]);
	const className = cn(
		local.rowHover && styles.rowHover,
		local.class ?? local.className,
	);

	if (local.sections) {
		return (
			<div role="list" class={cn(styles.sectionList, className)}>
				{local.children}
			</div>
		);
	}

	return (
		<Card role="list" class={className}>
			{local.children}
		</Card>
	);
}

export function ListSection(props: CommonProps) {
	const [local] = splitProps(props, ["children", "className", "class"]);
	return (
		<div class={cn(styles.section, local.class ?? local.className)}>
			{local.children}
		</div>
	);
}

export function ListSectionHeader(props: CommonProps) {
	const [local] = splitProps(props, ["children", "className", "class"]);
	return (
		<div class={cn(styles.sectionHeader, local.class ?? local.className)}>
			{local.children}
		</div>
	);
}

export function ListRow(props: CommonProps) {
	const [local] = splitProps(props, ["children", "className", "class"]);
	return (
		<div
			role="listitem"
			data-slot="list-row"
			class={cn(styles.row, local.class ?? local.className)}
		>
			{local.children}
		</div>
	);
}
