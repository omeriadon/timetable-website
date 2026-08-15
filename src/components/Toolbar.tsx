import type { ReactNode } from "react";
import { Plus, Search } from "lucide-react";
import styles from "./Toolbar.module.css";

type ToolbarProps = {
	title: string;
	subtitle?: string;
	searchPlaceholder?: string;
	searchValue?: string;
	onSearchChange?: (value: string) => void;
	onAdd?: () => void;
	children?: ReactNode;
};

export default function Toolbar({
	title,
	subtitle,
	searchPlaceholder,
	searchValue = "",
	onSearchChange,
	onAdd,
	children,
}: ToolbarProps) {
	return (
		<header className={styles.toolbar}>
			<div className={styles.heading}>
				<p className={styles.eyebrow}>Workspace</p>
				<h1>{title}</h1>
				{subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
			</div>

			<div className={styles.actions}>
				{searchPlaceholder ? (
					<label className={styles.search}>
						<Search size={16} aria-hidden="true" />
						<span className="sr-only">Search {title}</span>
						<input
							value={searchValue}
							placeholder={searchPlaceholder}
							onChange={(event) => onSearchChange?.(event.target.value)}
						/>
					</label>
				) : null}
				{children}
				{onAdd ? (
					<button
						type="button"
						className={styles.addButton}
						onClick={onAdd}
						aria-label={`Add item to ${title}`}
					>
						<Plus size={16} aria-hidden="true" />
						<span>Add item</span>
					</button>
				) : null}
			</div>
		</header>
	);
}
