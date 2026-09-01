import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import SettingToggle from "@/components/controls/SettingToggle/SettingToggle";
import { apiRequest } from "@/lib/api/client";
import { useEffect } from "react";
import type { Account } from "@/lib/api/contracts";
import type { Settings } from "@/features/settings/types";
import styles from "@/components/settings/Settings.module.css";
import ConfirmationDrawer from "@/components/drawers/ConfirmationDrawer/ConfirmationDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";

type YearGroupTag = {
	id: string;
	displayName: string;
	symbol?: string | null;
};

export default function AccountSyncEditor({
	initial,
	onSignOut,
}: {
	initial: Settings;
	onSignOut: () => void;
}) {
	const [draft, setDraft] = useState(initial);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [account, setAccount] = useState<Account | null>(null);
	const [displayName, setDisplayName] = useState("");
	const [yearGroups, setYearGroups] = useState<YearGroupTag[]>([]);
	const [selectedYearGroupID, setSelectedYearGroupID] = useState("");
	const [savingYearGroup, setSavingYearGroup] = useState(false);
	const [savingAccount, setSavingAccount] = useState(false);
	const { openDrawer } = useDrawer();

	useEffect(() => {
		Promise.all([
			apiRequest<Account>("v1/account"),
			apiRequest<{
				sections: Array<{ category: string; tags: YearGroupTag[] }>;
			}>("v1/tags"),
			apiRequest<{ tagIDs: string[] }>("v1/tags/subscriptions"),
		])
			.then(([currentAccount, catalogue, subscriptions]) => {
				const tags = catalogue.sections
					.filter((section) => section.category === "yearGroup")
					.flatMap((section) => section.tags);
				setAccount(currentAccount);
				setDisplayName(currentAccount.displayName);
				setYearGroups(tags);
				setSelectedYearGroupID(subscriptions.tagIDs[0] ?? tags[0]?.id ?? "");
			})
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	const saveAccount = async () => {
		if (!account || !displayName.trim() || savingAccount) return;
		setSavingAccount(true);
		setError(null);
		try {
			const updated = await apiRequest<Account>("v1/account", {
				method: "PUT",
				body: JSON.stringify({
					displayName: displayName.trim(),
					baseRevision: account.revision,
				}),
			});
			setAccount(updated);
			setDisplayName(updated.displayName);
		} catch (requestError) {
			setError((requestError as Error).message);
		} finally {
			setSavingAccount(false);
		}
	};

	const saveYearGroup = async (tagID: string) => {
		const previous = selectedYearGroupID;
		setSelectedYearGroupID(tagID);
		setSavingYearGroup(true);
		setError(null);
		try {
			const updated = await apiRequest<{ tagIDs: string[] }>(
				"v1/tags/subscriptions",
				{
					method: "PUT",
					body: JSON.stringify({ tagIDs: [tagID] }),
				},
			);
			setSelectedYearGroupID(updated.tagIDs[0] ?? tagID);
		} catch (requestError) {
			setSelectedYearGroupID(previous);
			setError((requestError as Error).message);
		} finally {
			setSavingYearGroup(false);
		}
	};

	const confirmDeleteAccount = () => {
		openDrawer(
			<ConfirmationDrawer
				title="Delete account?"
				message="This permanently deletes your account and server data."
				confirmLabel="Delete account"
				icon="trash"
				onConfirm={async () => {
					await apiRequest("v1/account", { method: "DELETE" });
					onSignOut();
				}}
			/>,
		);
	};

	const save = async (changes: Partial<Settings>) => {
		const previous = draft;
		const next = { ...draft, ...changes };
		setDraft(next);
		setSaving(true);
		setError(null);
		try {
			const updated = await apiRequest<Settings>("v1/settings", {
				method: "PUT",
				body: JSON.stringify({
					...next,
					serverRevision: previous.serverRevision,
				}),
			});
			setDraft(updated);
		} catch (requestError) {
			setDraft(previous);
			setError((requestError as Error).message);
		} finally {
			setSaving(false);
		}
	};

	return (
		<>
			<section className={styles.card}>
				<div className={styles.row}>
					<Symbol name="person" />
					<label className={styles.label} htmlFor="account-display-name">
						Name
					</label>
					<Input
						id="account-display-name"
						value={displayName}
						disabled={!account || savingAccount}
						onChange={(event) => setDisplayName(event.target.value)}
					/>
					<Button
						type="button"
						onClick={() => void saveAccount()}
						disabled={!account || savingAccount || !displayName.trim()}
						aria-label="Save account name"
					>
						<Symbol name="checkmark" />
						Save
					</Button>
				</div>
				{account ? (
					<div className={styles.row}>
						<Symbol name="envelope" />
						<span className={styles.label}>Email</span>
						<span>{account.email}</span>
					</div>
				) : null}
				{yearGroups.length ? (
					<div className={styles.row}>
						<Symbol name="person.3" />
						<label className={styles.label} htmlFor="account-year-group">
							Year Group
						</label>
						<select
							id="account-year-group"
							value={selectedYearGroupID}
							disabled={savingYearGroup}
							onChange={(event) => void saveYearGroup(event.target.value)}
						>
							{yearGroups.map((tag) => (
								<option key={tag.id} value={tag.id}>
									{tag.displayName}
								</option>
							))}
						</select>
					</div>
				) : null}
			</section>
			<section className={styles.card}>
				<SettingToggle
					label="Class Notifications"
					enabled={draft.notificationsEnabled}
					onClick={() =>
						void save({ notificationsEnabled: !draft.notificationsEnabled })
					}
					disabled={saving}
				/>
				<SettingToggle
					label="Special Event Notifications"
					enabled={draft.broadcastNotificationsEnabled}
					onClick={() =>
						void save({
							broadcastNotificationsEnabled:
								!draft.broadcastNotificationsEnabled,
						})
					}
					disabled={saving}
				/>
				<div className={styles.row}>
					<Symbol name="calendar.badge.clock" />
					<span className={styles.label}>Delete Past Calendar Events</span>
					<Select
						value={String(draft.calendarEventAutoDeleteDays)}
						disabled={saving}
						onValueChange={(value) => {
							if (value !== null) {
								void save({
									calendarEventAutoDeleteDays: Number(value),
								});
							}
						}}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>

						<SelectContent>
							<SelectItem value="0">Never</SelectItem>
							<SelectItem value="7">After 1 week</SelectItem>
							<SelectItem value="30">After 1 month</SelectItem>
							<SelectItem value="365">After 1 year</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button
					type="button"
					className={styles.rowButton}
					onClick={async () => {
						await apiRequest("auth/logout", { method: "DELETE" });
						onSignOut();
					}}
				>
					<div className={styles.row}>
						<Symbol name="person.2.slash" />
						<span className={styles.label}>Sign Out</span>
					</div>
				</Button>
				<Button
					type="button"
					className={styles.rowButton}
					onClick={confirmDeleteAccount}
					aria-label="Delete account"
				>
					<div className={styles.row}>
						<Symbol name="trash" />
						<span className={styles.label}>Delete Account</span>
					</div>
				</Button>
			</section>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
		</>
	);
}
