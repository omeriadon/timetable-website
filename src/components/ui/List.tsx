import type { ReactNode } from "react";

export function List({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={className}>{children}</div>;
}

export function ListSection({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <section className={className}>{children}</section>;
}

export function ListSectionHeader({ children }: { children: ReactNode }) {
	return <div>{children}</div>;
}

export function ListRow({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return <div className={className}>{children}</div>;
}
