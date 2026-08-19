"use client";

import { Input } from "@/components/ui/Input";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import { useState } from "react";
import type { AdministrationUser } from "@/components/administration/AdminUserEditorSheet/AdminUserEditorSheet";
import type {
	ProfileColor,
	SpecialBadge,
} from "@/components/administration/AdminBadgesEditor/AdminBadgesEditor";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import Symbol from "@/components/controls/Symbol/Symbol";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

type AdminSpecialBadgeSheetProps = {
	badge: SpecialBadge | null;
	users: AdministrationUser[];
	onSaved: () => void;
};

const builtInBadgeIDs = new Set([
	"e93dd9c4-a5b1-4694-9795-fd0d89c05fb3",
	"0f6cd452-84ac-4482-8c23-a48f5d56148a",
]);

const symbolOptions = [
	"star.fill",
	"wrench.and.screwdriver",
	"book.and.wrench",
	"person.badge.shield.checkmark",
	"checkmark.seal",
	"rosette",
	"bell.fill",
];

export default function AdminSpecialBadgeSheet({
	badge,
	users,
	onSaved,
}: AdminSpecialBadgeSheetProps) {
	const { closeSheet } = useSheet();
	const [symbol, setSymbol] = useState(badge?.symbol ?? "star.fill");
	const [accessibilityLabel, setAccessibilityLabel] = useState(
		badge?.accessibilityLabel ?? "Badge",
	);
	const [backgroundColor, setBackgroundColor] = useState(
		toHex(badge?.backgroundColor) ?? "#2d7ff9",
	);
	const [symbolColor, setSymbolColor] = useState(
		toHex(badge?.symbolColor) ?? "#ffffff",
	);
	const [priority, setPriority] = useState(String(badge?.priority ?? 0));
	const [selectedUserIDs, setSelectedUserIDs] = useState<string[]>(
		badge?.assignedUserIDs ?? [],
	);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const isBuiltIn = badge ? builtInBadgeIDs.has(badge.id) : false;

	const toggleUser = (userID: string) => {
		setSelectedUserIDs((current) =>
			current.includes(userID)
				? current.filter((value) => value !== userID)
				: [...current, userID],
		);
	};

	const save = async () => {
		if (saving || !symbol.trim() || !accessibilityLabel.trim()) {
			return;
		}

		setSaving(true);
		setError(null);

		try {
			const request = {
				symbol: symbol.trim(),
				accessibilityLabel: accessibilityLabel.trim(),
				backgroundColor: fromHex(backgroundColor),
				symbolColor: fromHex(symbolColor),
				priority: Number(priority) || 0,
			};
			if (isBuiltIn && badge) {
				const stored = JSON.parse(
					window.localStorage.getItem("timetable.profile-badges") ?? "{}",
				) as Record<string, SpecialBadge>;
				stored[badge.id] = { ...badge, ...request };
				window.localStorage.setItem(
					"timetable.profile-badges",
					JSON.stringify(stored),
				);
				onSaved();
				closeSheet();
				return;
			}
			const saved = await apiRequest<SpecialBadge>(
				`v1/administration/badges${badge ? `/${badge.id}` : ""}`,
				{
					method: badge ? "PUT" : "POST",
					body: JSON.stringify(request),
				},
			);
			await apiRequest(`v1/administration/badges/${saved.id}/users`, {
				method: "PUT",
				body: JSON.stringify({ userIDs: selectedUserIDs }),
			});
			onSaved();
			closeSheet();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	const remove = async () => {
		if (!badge || isBuiltIn || saving) {
			return;
		}

		setSaving(true);
		setError(null);

		try {
			await apiRequest(`v1/administration/badges/${badge.id}`, {
				method: "DELETE",
			});
			onSaved();
			closeSheet();
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<div className={styles.detailSheet}>
			<header className={styles.detailHeader}>
				<div
					className={styles.detailAvatar}
					style={{ background: backgroundColor, color: symbolColor }}
				>
					<Symbol name={symbol} fallback="★" />
				</div>
				<div>
					<h2>{badge ? "Edit Badge" : "New Badge"}</h2>
					<p>{selectedUserIDs.length} users assigned</p>
				</div>
			</header>
			<section className={styles.formCard}>
				<label>
					SF Symbol
					<Select
						value={symbol}
						onChange={(event) => setSymbol(event.target.value)}
					>
						{symbolOptions.map((option) => (
							<option key={option} value={option}>
								{option}
							</option>
						))}
					</Select>
				</label>
				<label>
					Accessibility Label
					<Input
						value={accessibilityLabel}
						onChange={(event) => setAccessibilityLabel(event.target.value)}
					/>
				</label>
				<label>
					Priority
					<Input
						type="number"
						value={priority}
						onChange={(event) => setPriority(event.target.value)}
					/>
				</label>
				<label>
					Background
					<Input
						type="color"
						value={backgroundColor}
						onChange={(event) => setBackgroundColor(event.target.value)}
					/>
				</label>
				<label>
					Symbol
					<Input
						type="color"
						value={symbolColor}
						onChange={(event) => setSymbolColor(event.target.value)}
					/>
				</label>
			</section>
			{!isBuiltIn ? (
				<section className={styles.detailCard}>
					<h3>Users</h3>
					{users.map((user) => (
						<label key={user.id} className={styles.editorCheck}>
							<Checkbox
								label={user.displayName}
								checked={selectedUserIDs.includes(user.id)}
								onCheckedChange={() => toggleUser(user.id)}
							/>
							{user.displayName}
						</label>
					))}
				</section>
			) : null}
			{error ? (
				<p className={styles.detailMuted} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.sheetActions}>
				{badge && !isBuiltIn ? (
					<SheetActionButton
						label="Delete badge"
						tone="destructive"
						onClick={() => void remove()}
						disabled={saving}
					>
						Delete
					</SheetActionButton>
				) : null}
				<SheetActionButton
					label={badge ? "Save badge" : "Create badge"}
					onClick={() => void save()}
					disabled={saving || !symbol.trim() || !accessibilityLabel.trim()}
				>
					{saving ? "Saving…" : badge ? "Save" : "Create"}
				</SheetActionButton>
			</div>
		</div>
	);
}

function toHex(color?: ProfileColor | null) {
	if (!color) {
		return null;
	}

	return `#${[color.red, color.green, color.blue]
		.map((value) =>
			Math.round(value * 255)
				.toString(16)
				.padStart(2, "0"),
		)
		.join("")}`;
}

function fromHex(value: string): ProfileColor {
	const normalized = value.replace("#", "");
	const channel = (start: number) =>
		parseInt(normalized.slice(start, start + 2), 16) / 255;

	return {
		red: channel(0),
		green: channel(2),
		blue: channel(4),
		alpha: 1,
	};
}
