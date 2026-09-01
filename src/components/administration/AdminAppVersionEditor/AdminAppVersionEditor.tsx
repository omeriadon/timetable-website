import { Button } from "@/components/ui/button";
import { useEffect, useMemo, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/administration/Administration.module.css";
import adminStyles from "@/components/administration/Administration.module.css";
import AdminVersionField from "@/components/administration/AdminVersionField/AdminVersionField";
import { DrawerFooter } from "@/components/ui/drawer";

type AppVersionRequirement = {
	appVersion: string;
	appBuild: number;
	macVersion: string;
	macBuild: number;
};

const initialValue: AppVersionRequirement = {
	appVersion: "0.0.0",
	appBuild: 0,
	macVersion: "0.0.0",
	macBuild: 0,
};

export default function AdminAppVersionEditor() {
	const [draft, setDraft] = useState<AppVersionRequirement>(initialValue);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [status, setStatus] = useState<string | null>(null);

	useEffect(() => {
		let active = true;
		apiRequest<AppVersionRequirement>("v1/administration/app-version")
			.then((value) => {
				if (active) {
					setDraft(value);
				}
			})
			.catch((error: Error) => active && setStatus(error.message))
			.finally(() => active && setLoading(false));
		return () => {
			active = false;
		};
	}, []);

	const valid = useMemo(() => {
		const version = (value: string) => /^\d+\.\d+\.\d+$/.test(value);
		return (
			version(draft.appVersion) &&
			version(draft.macVersion) &&
			draft.appBuild >= 0 &&
			draft.macBuild >= 0
		);
	}, [draft]);

	const update = <K extends keyof AppVersionRequirement>(
		key: K,
		value: AppVersionRequirement[K],
	) => {
		setDraft((current) => ({ ...current, [key]: value }));
	};

	const save = async () => {
		if (!valid || saving) {
			return;
		}
		setSaving(true);
		setStatus(null);
		try {
			const saved = await apiRequest<AppVersionRequirement>(
				"v1/administration/app-version",
				{
					method: "PUT",
					body: JSON.stringify(draft),
				},
			);
			setDraft(saved);
			setStatus("App versions saved.");
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return <p className={styles.loading}>Loading app versions…</p>;
	}

	return (
		<main className={styles.page}>
			<section className={styles.card} aria-labelledby="ios-version-heading">
				<div className={styles.row}>
					<Symbol name="app.badge" />
					<strong className={styles.label} id="ios-version-heading">
						iOS and iPadOS
					</strong>
				</div>
				<AdminVersionField
					label="Version"
					value={draft.appVersion}
					onChange={(value) => update("appVersion", value)}
				/>
				<AdminVersionField
					label="Build"
					value={String(draft.appBuild)}
					inputMode="numeric"
					onChange={(value) =>
						update("appBuild", Math.max(0, Number(value) || 0))
					}
				/>
			</section>
			<section className={styles.card} aria-labelledby="mac-version-heading">
				<div className={styles.row}>
					<Symbol name="desktopcomputer" fallback="▣" />
					<strong className={styles.label} id="mac-version-heading">
						macOS
					</strong>
				</div>
				<AdminVersionField
					label="Version"
					value={draft.macVersion}
					onChange={(value) => update("macVersion", value)}
				/>
				<AdminVersionField
					label="Build"
					value={String(draft.macBuild)}
					inputMode="numeric"
					onChange={(value) =>
						update("macBuild", Math.max(0, Number(value) || 0))
					}
				/>
			</section>
			{status ? (
				<p
					className={status.endsWith("saved.") ? styles.loading : styles.error}
					role="status"
				>
					{status}
				</p>
			) : null}
			<DrawerFooter>
				<Button
					fullWidth
					type="button"
					className={adminStyles.profileSave}
					onClick={() => void save()}
					disabled={!valid || saving}
				>
					<Symbol name="checkmark" fallback="✓" />
					{saving ? "Saving…" : "Save App Versions"}
				</Button>
			</DrawerFooter>
		</main>
	);
}
