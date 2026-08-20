"use client";

import { Button } from "@base-ui/react/button";
import { Toggle } from "@/components/ui/toggle";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import { websiteInstallationID } from "@/lib/auth/installation";
import styles from "@/components/settings/Settings.module.css";
import actionStyles from "@/components/ui/contentactions.module.css";

type DebugState = {
	isActive: boolean;
	canUpdate: boolean;
};

const debugStatePath = () =>
	`v1/live-activities/debug?installationID=${encodeURIComponent(websiteInstallationID())}`;

export default function DeveloperToolsEditor() {
	const [debugOffset, setDebugOffset] = useState("0");
	const [usesReleaseIcon, setUsesReleaseIcon] = useState(false);
	const [debugState, setDebugState] = useState<DebugState | null>(null);
	const [status, setStatus] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [lastServerSync, setLastServerSync] = useState<string | null>(null);

	useEffect(() => {
		setDebugOffset(
			window.localStorage.getItem("timetable.debug-offset") ?? "0",
		);
		setUsesReleaseIcon(
			window.localStorage.getItem("timetable.release-app-icon") === "true",
		);
		const sync = new Date().toISOString();
		window.localStorage.setItem("timetable.last-server-sync", sync);
		setLastServerSync(
			window.localStorage.getItem("timetable.last-server-sync") ?? sync,
		);
		void refreshDebugState();
	}, []);

	const saveOffset = (value: string) => {
		setDebugOffset(value);
		window.localStorage.setItem("timetable.debug-offset", value);
	};

	const toggleReleaseIcon = (value: boolean) => {
		setUsesReleaseIcon(value);
		window.localStorage.setItem("timetable.release-app-icon", String(value));
		setStatus(
			value
				? "Release icon preference saved."
				: "Default icon preference saved.",
		);
	};

	async function refreshDebugState() {
		try {
			setDebugState(await apiRequest<DebugState>(debugStatePath()));
		} catch {
			setDebugState(null);
		}
	}

	async function runLiveActivityAction(
		action: "start" | "stop" | "update",
		transition?: string,
	) {
		setError(null);
		setStatus(null);
		try {
			const body =
				action === "update"
					? { installationID: websiteInstallationID(), transition }
					: { installationID: websiteInstallationID() };
			const next = await apiRequest<DebugState>(
				`v1/live-activities/debug/${action}`,
				{
					method: "POST",
					body: JSON.stringify(body),
				},
			);
			setDebugState(next);
			setStatus(`Live Activity ${action} request completed.`);
		} catch (requestError) {
			setError((requestError as Error).message);
		}
	}

	const resetTips = () => {
		for (let index = 0; index < window.localStorage.length; index += 1) {
			const key = window.localStorage.key(index);
			if (key?.toLowerCase().includes("tip")) {
				window.localStorage.removeItem(key);
			}
		}
		setStatus("Website tips have been reset.");
	};

	return (
		<main className={styles.page}>
			<section className={styles.card}>
				<div className={styles.row}>
					<Symbol name="app.badge" />
					<label className={styles.label} htmlFor="release-app-icon">
						Release App Icon
					</label>
					<Toggle
						aria-label="Release App Icon"
						id="release-app-icon"
						checked={usesReleaseIcon}
						onCheckedChange={toggleReleaseIcon}
					/>
				</div>
				<div className={styles.row}>
					<Symbol name="clock.arrow.trianglehead.counterclockwise.rotate.90" />
					<label className={styles.label} htmlFor="debug-offset">
						Debug Offset
					</label>
					<Input
						id="debug-offset"
						className={styles.inlineInput}
						type="number"
						value={debugOffset}
						onChange={(event) => saveOffset(event.target.value)}
					/>
				</div>
				<div className={styles.row}>
					<Symbol name="rectangle.bottomthird.inset.filled" />
					<span className={styles.label}>Test Live Activity</span>
					<span className={styles.detail}>
						{debugState?.isActive ? "Active" : "Inactive"}
					</span>
				</div>
				<div className={actionStyles.actionRow}>
					<Button
						aria-label="Start Live Activity"
						onClick={() => void runLiveActivityAction("start")}
					>
						<Symbol name="play.fill" fallback=">" />
						Start
					</Button>
					<Button
						aria-label="Stop Live Activity"
						onClick={() => void runLiveActivityAction("stop")}
					>
						<Symbol name="stop.fill" fallback="[]" />
						Stop
					</Button>
				</div>
				<div className={styles.row}>
					<Symbol name="app.badge" />
					<span className={styles.label}>Test status badges</span>
				</div>
				<div className={actionStyles.actionRow}>
					{["progress", "success", "warning"].map((badge) => (
						<Button
							key={badge}
							aria-label={`Test ${badge} status`}
							onClick={() => setStatus(`${badge} status badge requested.`)}
						>
							{badge}
						</Button>
					))}
				</div>
				<div className={actionStyles.actionRow}>
					<Button
						aria-label="Reload website data"
						onClick={() => window.location.reload()}
					>
						<Symbol name="widget.large" fallback="[]" />
						Reload Data
					</Button>
					<Button aria-label="Reset tips" onClick={resetTips}>
						<Symbol name="lightbulb" fallback="i" />
						Reset Tips
					</Button>
				</div>
				<div className={styles.row}>
					<Symbol name="checkmark.icloud" fallback="*" />
					<span className={styles.label}>Last Server Sync</span>
					<span className={styles.detail}>
						{lastServerSync
							? new Date(lastServerSync).toLocaleString("en-AU")
							: "Never"}
					</span>
				</div>
			</section>
			{debugState?.canUpdate ? (
				<section className={styles.card}>
					{["morning", "period1", "recess", "lunch", "period6", "finished"].map(
						(transition) => (
							<Button
								key={transition}
								type="button"
								className={actionStyles.action}
								onClick={() => void runLiveActivityAction("update", transition)}
							>
								{transition}
							</Button>
						),
					)}
				</section>
			) : null}
			{status ? <p className={styles.detailNote}>{status}</p> : null}
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
		</main>
	);
}
