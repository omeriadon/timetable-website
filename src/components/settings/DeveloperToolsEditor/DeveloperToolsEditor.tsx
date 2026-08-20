"use client";

import { useEffect, useState } from "react";

import Symbol from "@/components/controls/Symbol/Symbol";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { apiRequest } from "@/lib/api/client";
import { websiteInstallationID } from "@/lib/auth/installation";

import styles from "@/components/settings/Settings.module.css";

type DebugState = {
	isActive: boolean;
	canUpdate: boolean;
};

const liveActivityTransitions = [
	"morning",
	"period1",
	"recess",
	"lunch",
	"period6",
	"finished",
] as const;

const statusBadges = ["progress", "success", "warning"] as const;

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
		setLastServerSync(sync);

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
			const body = {
				installationID: websiteInstallationID(),
				...(action === "update" ? { transition } : {}),
			};

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
		const keys = Array.from(
			{ length: window.localStorage.length },
			(_, index) => window.localStorage.key(index),
		).filter((key): key is string => key !== null);

		for (const key of keys) {
			if (key.toLowerCase().includes("tip")) {
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
						id="release-app-icon"
						aria-label="Release App Icon"
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

				<div className={styles.actionRow}>
					<Button
						type="button"
						onClick={() => void runLiveActivityAction("start")}
					>
						<Symbol name="play.fill" fallback=">" />
						Start
					</Button>

					<Button
						type="button"
						variant="outline"
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

				<div className={styles.actionRow}>
					{statusBadges.map((badge) => (
						<Button
							key={badge}
							type="button"
							variant="outline"
							onClick={() => setStatus(`${badge} status badge requested.`)}
						>
							{badge}
						</Button>
					))}
				</div>

				<div className={styles.actionRow}>
					<Button
						type="button"
						variant="outline"
						onClick={() => window.location.reload()}
					>
						<Symbol name="widget.large" fallback="[]" />
						Reload Data
					</Button>

					<Button type="button" variant="outline" onClick={resetTips}>
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

			{debugState?.canUpdate && (
				<section className={styles.card}>
					<div className={styles.actionRow}>
						{liveActivityTransitions.map((transition) => (
							<Button
								key={transition}
								type="button"
								variant="outline"
								onClick={() => void runLiveActivityAction("update", transition)}
							>
								{transition}
							</Button>
						))}
					</div>
				</section>
			)}

			{status && (
				<p className={styles.detailNote} role="status">
					{status}
				</p>
			)}

			{error && (
				<p className={styles.error} role="alert">
					{error}
				</p>
			)}
		</main>
	);
}
