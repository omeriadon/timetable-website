"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";
import { Button } from "@/components/ui/button";
import ConfirmationDrawer from "@/components/drawers/ConfirmationDrawer/ConfirmationDrawer";
import { useDrawer } from "@/components/drawers/Drawer/Drawer";
import { List, ListRow } from "@/components/ui/list";

type UserReport = {
	id: string;
	reporterID: string;
	reporterDisplayName?: string | null;
	reportedUserID: string;
	reportedUserDisplayName?: string | null;
	action: "pending" | "noAction" | "accountDeleted" | "approved" | "rejected";
	createdAt?: string | null;
};

export default function AdminUserReportsEditor() {
	const { openDrawer } = useDrawer();
	const [reports, setReports] = useState<UserReport[]>([]);
	const [query, setQuery] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState<string | null>(null);
	useEffect(() => {
		apiRequest<UserReport[]>("v1/administration/user-reports")
			.then(setReports)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);
	const filtered = useMemo(() => {
		const value = query.trim().toLowerCase();
		return value
			? reports.filter((report) =>
					`${report.reporterDisplayName ?? ""} ${report.reportedUserDisplayName ?? ""} ${report.action}`
						.toLowerCase()
						.includes(value),
				)
			: reports;
	}, [query, reports]);
	const resolve = async (
		report: UserReport,
		action: "noAction" | "accountDeleted",
	) => {
		setBusy(report.id);
		setError(null);
		try {
			const updated = await apiRequest<UserReport>(
				`v1/administration/user-reports/${report.id}`,
				{ method: "PUT", body: JSON.stringify({ action }) },
			);
			setReports((current) =>
				current.map((item) => (item.id === updated.id ? updated : item)),
			);
		} catch (requestError) {
			setError((requestError as Error).message);
			if (action === "accountDeleted") throw requestError;
		} finally {
			setBusy(null);
		}
	};
	const resolveReport = (
		report: UserReport,
		action: "noAction" | "accountDeleted",
	) => {
		if (action === "accountDeleted") {
			openDrawer(
				<ConfirmationDrawer
					title="Delete reported account"
					message={`Delete ${report.reportedUserDisplayName ?? "this account"}? This cannot be undone.`}
					confirmLabel="Delete account"
					onConfirm={() => resolve(report, action)}
				/>,
			);
			return;
		}
		void resolve(report, action);
	};
	return (
		<main className={styles.page}>
			<label className={adminStyles.adminSearch}>
				<Symbol name="magnifyingglass" fallback="⌕" />
				<Input
					value={query}
					onChange={(event) => setQuery(event.target.value)}
					placeholder="Search reports"
				/>
			</label>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<List rowHover>
				{filtered.map((report) => (
					<ListRow key={report.id} className={adminStyles.reportCard}>
						<div className={adminStyles.reportHeader}>
							<Symbol name="exclamationmark.bubble" />
							<strong>
								{report.reportedUserDisplayName ?? report.reportedUserID}
							</strong>
							<span className={styles.detail}>
								{statusLabel(report.action)}
							</span>
						</div>
						<div className={adminStyles.reportMeta}>
							Reported by {report.reporterDisplayName ?? report.reporterID}
							{report.createdAt
								? ` · ${new Date(report.createdAt).toLocaleDateString("en-AU")}`
								: ""}
						</div>
						{report.action === "pending" ? (
							<div className={adminStyles.reportActions}>
								<Button
									aria-label="Leave account unchanged"
									onClick={() => resolveReport(report, "noAction")}
									disabled={busy === report.id}
								>
									<Symbol name="checkmark" fallback="✓" /> Do Nothing
								</Button>
								<Button
									aria-label="Delete reported account"
									onClick={() => resolveReport(report, "accountDeleted")}
									disabled={busy === report.id}
								>
									<Symbol name="trash" fallback="×" /> Delete Account
								</Button>
							</div>
						) : null}
					</ListRow>
				))}
				{!filtered.length ? (
					<p className={styles.loading}>
						{reports.length ? "No matching reports." : "Loading reports…"}
					</p>
				) : null}
			</List>
		</main>
	);
}

function statusLabel(action: UserReport["action"]) {
	return action === "noAction"
		? "No action"
		: action === "accountDeleted"
			? "Account deleted"
			: action === "pending"
				? "Pending"
				: action[0].toUpperCase() + action.slice(1);
}
