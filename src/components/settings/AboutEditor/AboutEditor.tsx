"use client";

import { useEffect, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import type { AboutContributor } from "@/lib/api/contracts";
import styles from "./AboutEditor.module.css";

export default function AboutEditor() {
	const [contributors, setContributors] = useState<AboutContributor[]>([]);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		apiRequest<AboutContributor[]>("v1/about")
			.then(setContributors)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	return (
		<section className={styles.page}>
			<div className={styles.icon} aria-hidden="true">
				T
			</div>
			<h2>Timetable</h2>
			<p className={styles.subtitle}>
				School week planning for every platform.
			</p>
			<section
				className={styles.card}
				aria-labelledby="about-development-heading"
			>
				<h3 id="about-development-heading">Development</h3>
				{contributors.map((contributor) => (
					<div className={styles.contributor} key={contributor.id}>
						<span>{contributor.name}</span>
						<strong>{contributor.role}</strong>
					</div>
				))}
				{!contributors.length && !error ? (
					<p className={styles.status}>Loading contributors…</p>
				) : null}
			</section>
			{error ? (
				<p className={styles.error} role="alert">
					{error}
				</p>
			) : null}
			<div className={styles.version}>
				<Symbol name="hammer" fallback="⌘" />
				<span>Website client</span>
				<strong>Web</strong>
			</div>
			<p className={styles.copyright}>
				© {new Date().getFullYear()}, JDCQ. All rights reserved.
			</p>
		</section>
	);
}
