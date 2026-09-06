import { createSignal, onMount } from "solid-js";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import type { AboutContributor } from "@/lib/api/contracts";
import styles from "./AboutEditor.module.css";

export default function AboutEditor() {
	const [contributors, setContributors] = createSignal<AboutContributor[]>([]);
	const [error, setError] = createSignal<string | null>(null);

	const [isLocalhost, setIsLocalhost] = createSignal(false);

	onMount(() => {
		const hostname = window.location.hostname;
		setIsLocalhost(
			hostname === "localhost" ||
				hostname === "[::1]" ||
				Boolean(
					hostname.match(
						/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
					),
				),
		);
	});

	onMount(() => {
		apiRequest<AboutContributor[]>("v1/about")
			.then(setContributors)
			.catch((requestError: Error) => setError(requestError.message));
	});

	return (
		<section className={styles.page}>
			<div className={styles.content}>
				<div className={styles.icon}>
					<img
						src="/icon-512.webp"
						width={300}
						height={300}
						alt=""
						aria-hidden="true"
					/>

					{isLocalhost() && (
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
					{contributors().map((contributor) => (
						<div className={styles.contributor} key={contributor.id}>
							<span>{contributor.name}</span>
							<span>{contributor.role}</span>
						</div>
					))}

					{!contributors().length && !error() && (
						<p className={styles.status}>Loading contributors…</p>
					)}
				</section>

				{error() && (
					<p className={styles.error} role="alert">
						{error()}
					</p>
				)}

				<p className={styles.copyright}>
					© {new Date().getFullYear()}, JDCQ. All rights reserved.
				</p>
			</div>
		</section>
	);
}
