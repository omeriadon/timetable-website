"use client";

import { useEffect, useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import type { AboutContributor } from "@/lib/api/contracts";
import styles from "./AboutEditor.module.css";
import Image from "@/components/NextImage";

export default function AboutEditor() {
	const [contributors, setContributors] = useState<AboutContributor[]>([]);
	const [error, setError] = useState<string | null>(null);

	const isLocalhost = Boolean(
		window.location.hostname === "localhost" ||
		window.location.hostname === "[::1]" ||
		window.location.hostname.match(
			/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
		),
	);

	useEffect(() => {
		apiRequest<AboutContributor[]>("v1/about")
			.then(setContributors)
			.catch((requestError: Error) => setError(requestError.message));
	}, []);

	return (
		<section className={styles.page}>
			<div className={styles.content}>
				<div className={styles.icon}>
					<Image
						src="/icon.png"
						width={300}
						height={300}
						alt=""
						aria-hidden="true"
					/>

					{isLocalhost && (
						<div className={styles.overlay}>
							<Symbol name="ant" fallback="⚠" />
							<span>DEBUG</span>
						</div>
					)}
				</div>

				<h2>Timetable</h2>

				<section
					className={styles.card}
					aria-labelledby="about-development-heading"
				>
					{contributors.map((contributor) => (
						<div className={styles.contributor} key={contributor.id}>
							<span>{contributor.name}</span>
							<span>{contributor.role}</span>
						</div>
					))}

					{!contributors.length && !error && (
						<p className={styles.status}>Loading contributors…</p>
					)}
				</section>

				{error && (
					<p className={styles.error} role="alert">
						{error}
					</p>
				)}

				<p className={styles.copyright}>
					© {new Date().getFullYear()}, JDCQ. All rights reserved.
				</p>
			</div>
		</section>
	);
}
