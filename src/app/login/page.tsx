"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest, PMSTTAPIError } from "@/lib/api/client";
import type { TokenResponse } from "@/lib/api/contracts";
import { websiteInstallationID } from "@/lib/auth/installation";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";

type Mode = "sign-in" | "sign-up" | "verify";

export default function LoginPage() {
	const router = useRouter();
	const [mode, setMode] = useState<Mode>("sign-in");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [code, setCode] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		let active = true;
		apiRequest("session")
			.then(() => {
				if (active) {
					router.replace("/");
				}
			})
			.catch(() => undefined);
		return () => {
			active = false;
		};
	}, [router]);

	async function submit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			const installationID = websiteInstallationID();
			if (mode === "sign-in") {
				await apiRequest<TokenResponse>("auth/login", {
					method: "POST",
					body: JSON.stringify({ email, password, installationID }),
				});
				router.replace("/");
				router.refresh();
				return;
			}

			if (mode === "sign-up") {
				await apiRequest("auth/request-code", {
					method: "POST",
					body: JSON.stringify({ email, installationID }),
				});
				setMode("verify");
				return;
			}

			await apiRequest<TokenResponse>("auth/verify-code-register", {
				method: "POST",
				body: JSON.stringify({ email, password, code, installationID }),
			});
			router.replace("/");
			router.refresh();
		} catch (requestError) {
			setError(
				requestError instanceof PMSTTAPIError
					? requestError.message
					: "The account could not be authenticated.",
			);
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<main className={styles.page}>
			<section className={styles.card} aria-labelledby="login-title">
				<div className={styles.brandMark} aria-hidden="true">
					T
				</div>
				<p className={styles.eyebrow}>Timetable</p>
				<h1 id="login-title">
					{mode === "sign-in"
						? "Welcome back"
						: mode === "sign-up"
							? "Create your account"
							: "Verify your email"}
				</h1>
				<p className={styles.intro}>
					{mode === "verify"
						? `Enter the six-digit code sent to ${email}.`
						: "Your school week, in one place."}
				</p>

				<form className={styles.form} onSubmit={submit}>
					<label>
						<span>School email</span>
						<Input
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							autoComplete="email"
							required
							disabled={mode === "verify"}
						/>
					</label>
					<label>
						<span>Password</span>
						<Input
							type="password"
							value={password}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete={
								mode === "sign-in" ? "current-password" : "new-password"
							}
							minLength={8}
							required
						/>
					</label>
					{mode === "verify" ? (
						<label>
							<span>Verification code</span>
							<Input
								inputMode="numeric"
								autoComplete="one-time-code"
								value={code}
								onChange={(event) =>
									setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
								}
								required
							/>
						</label>
					) : null}
					{error ? (
						<p className={styles.error} role="alert">
							{error}
						</p>
					) : null}
					<Button
						unstyled
						className={styles.submit}
						type="submit"
						disabled={isSubmitting}
					>
						<Symbol
							name={
								isSubmitting
									? "ellipsis.circle"
									: mode === "sign-in"
										? "arrow.right"
										: mode === "sign-up"
											? "paperplane"
											: "checkmark.circle"
							}
							className={styles.actionIcon}
						/>
						{isSubmitting
							? "Please wait"
							: mode === "sign-in"
								? "Sign in"
								: mode === "sign-up"
									? "Send verification code"
									: "Create account"}
					</Button>
				</form>

				{mode !== "verify" ? (
					<Button
						unstyled
						className={styles.switchMode}
						type="button"
						onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}
					>
						<Symbol
							name={mode === "sign-in" ? "person.badge.plus" : "arrow.left"}
							className={styles.actionIcon}
						/>
						{mode === "sign-in"
							? "Create an account"
							: "I already have an account"}
					</Button>
				) : null}
			</section>
		</main>
	);
}
