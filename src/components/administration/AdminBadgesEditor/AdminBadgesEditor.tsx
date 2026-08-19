"use client";

import { useEffect, useMemo, useState } from "react";
import AdminSpecialBadgeSheet from "@/components/administration/AdminSpecialBadgeSheet/AdminSpecialBadgeSheet";
import type { AdministrationUser } from "@/components/administration/AdminUserEditorSheet/AdminUserEditorSheet";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

export type ProfileColor = {
	red: number;
	green: number;
	blue: number;
	alpha: number;
};

export type SpecialBadge = {
	id: string;
	symbol: string;
	backgroundColor: ProfileColor | null;
	symbolColor: ProfileColor | null;
	priority: number;
	accessibilityLabel: string;
	assignedUserIDs: string[];
};

const builtInBadges: SpecialBadge[] = [
	{
		id: "e93dd9c4-a5b1-4694-9795-fd0d89c05fb3",
		symbol: "wrench.and.screwdriver",
		backgroundColor: { red: 0, green: 0, blue: 0, alpha: 1 },
		symbolColor: { red: 1, green: 1, blue: 1, alpha: 1 },
		priority: 100,
		accessibilityLabel: "System Administrator",
		assignedUserIDs: [],
	},
	{
		id: "0f6cd452-84ac-4482-8c23-a48f5d56148a",
		symbol: "book.and.wrench",
		backgroundColor: { red: 0.16, green: 0.45, blue: 0.95, alpha: 1 },
		symbolColor: { red: 1, green: 1, blue: 1, alpha: 1 },
		priority: 90,
		accessibilityLabel: "Administrator",
		assignedUserIDs: [],
	},
];

const builtInBadgeIDs = new Set(builtInBadges.map((badge) => badge.id));

export default function AdminBadgesEditor() {
	const { openSheet } = useSheet();
	const [badges, setBadges] = useState<SpecialBadge[] | null>(null);
	const [users, setUsers] = useState<AdministrationUser[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [isReordering, setIsReordering] = useState(false);
	const [saving, setSaving] = useState(false);

	const load = () => {
		setError(null);
		Promise.all([
			apiRequest<SpecialBadge[]>("v1/administration/badges"),
			apiRequest<AdministrationUser[]>("v1/administration/users"),
		])
			.then(([loadedBadges, loadedUsers]) => {
				const stored = JSON.parse(
					window.localStorage.getItem("timetable.profile-badges") ?? "{}",
				) as Record<string, Partial<SpecialBadge>>;
				const authorityBadges = builtInBadges.map((badge) => ({
					...badge,
					...stored[badge.id],
					assignedUserIDs: loadedUsers
						.filter((user) =>
							badge.accessibilityLabel === "System Administrator"
								? user.authority === "systemOwner"
								: user.authority === "administrator",
						)
						.map((user) => user.id),
				}));
				setBadges([...authorityBadges, ...loadedBadges]);
				setUsers(loadedUsers);
			})
			.catch((requestError: Error) => setError(requestError.message));
	};

	useEffect(load, []);

	const displayedBadges = useMemo(
		() =>
			[...(badges ?? [])].sort((left, right) => right.priority - left.priority),
		[badges],
	);

	const moveBadge = async (badgeID: string, direction: -1 | 1) => {
		if (saving || !badges) {
			return;
		}

		const ordered = [...displayedBadges];
		const currentIndex = ordered.findIndex((badge) => badge.id === badgeID);
		const nextIndex = currentIndex + direction;
		if (currentIndex < 0 || nextIndex < 0 || nextIndex >= ordered.length) {
			return;
		}

		const [moved] = ordered.splice(currentIndex, 1);
		ordered.splice(nextIndex, 0, moved);
		setSaving(true);
		setError(null);
		try {
			const customBadgeIDs = ordered
				.filter((badge) => !builtInBadgeIDs.has(badge.id))
				.map((badge) => badge.id);
			const updated = await apiRequest<SpecialBadge[]>(
				"v1/administration/badges/order",
				{
					method: "PUT",
					body: JSON.stringify({ badgeIDs: customBadgeIDs }),
				},
			);
			const updatedByID = new Map(updated.map((badge) => [badge.id, badge]));
			setBadges(ordered.map((badge) => updatedByID.get(badge.id) ?? badge));
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<main className={styles.page}>
			<div className={styles.adminToolbar}>
				<p className={styles.detail}>
					Built-in authority badges and custom badges
				</p>
				<SheetActionButton
					label="Add badge"
					onClick={() =>
						openSheet(
							<AdminSpecialBadgeSheet
								badge={null}
								users={users}
								onSaved={load}
							/>,
						)
					}
				>
					<SymbolIcon name="plus" fallback="+" />
					Add Badge
				</SheetActionButton>
				<button
					type="button"
					className={styles.adminAction}
					onClick={() => setIsReordering((value) => !value)}
					aria-pressed={isReordering}
				>
					<SymbolIcon name="line.3.horizontal" fallback="=" />
					{isReordering ? "Done" : "Reorder"}
				</button>
			</div>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			{badges === null ? (
				<p className={styles.loading}>Loading badges...</p>
			) : displayedBadges.length === 0 ? (
				<p className={styles.emptyRow}>No badges have been created.</p>
			) : (
				<section className={styles.card} aria-label="Badges">
					{displayedBadges.map((badge, index) => (
						<div className={styles.rowWithAction} key={badge.id}>
							<button
								type="button"
								className={styles.rowButton}
								onClick={() =>
									openSheet(
										<AdminSpecialBadgeSheet
											badge={badge}
											users={users}
											onSaved={load}
										/>,
									)
								}
								aria-label={`Edit ${badge.accessibilityLabel}`}
							>
								<div className={styles.row}>
									<span
										className={styles.badgePreview}
										style={{
											background: colorToCSS(badge.backgroundColor),
											color: colorToCSS(badge.symbolColor),
										}}
									>
										<SymbolIcon name={badge.symbol} fallback="*" />
									</span>
									<span>
										<strong className={styles.label}>
											{badge.accessibilityLabel}
										</strong>
										<small className={styles.detail}>
											{badge.assignedUserIDs.length} users
										</small>
									</span>
									<span className={styles.chevron}>›</span>
								</div>
							</button>
							{isReordering ? (
								<div className={styles.reorderButtons}>
									<button
										type="button"
										onClick={() => void moveBadge(badge.id, -1)}
										disabled={saving || index === 0}
										aria-label={`Move ${badge.accessibilityLabel} up`}
									>
										^
									</button>
									<button
										type="button"
										onClick={() => void moveBadge(badge.id, 1)}
										disabled={saving || index === displayedBadges.length - 1}
										aria-label={`Move ${badge.accessibilityLabel} down`}
									>
										v
									</button>
								</div>
							) : null}
						</div>
					))}
				</section>
			)}
		</main>
	);
}

function colorToCSS(color: ProfileColor | null) {
	if (!color) {
		return "#000000";
	}

	return `rgba(${Math.round(color.red * 255)}, ${Math.round(
		color.green * 255,
	)}, ${Math.round(color.blue * 255)}, ${color.alpha})`;
}
