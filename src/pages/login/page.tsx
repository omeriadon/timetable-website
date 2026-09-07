import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSignal } from "solid-js";
import { useNavigate } from "@tanstack/solid-router";
import { apiRequest, PMSTTAPIError } from "@/lib/api/client";
import type { TokenResponse } from "@/lib/api/contracts";
import { websiteInstallationID } from "@/lib/auth/installation";
import Symbol from "@/components/controls/Symbol/Symbol";
import styles from "./page.module.css";
import { safeReturnTo } from "@/lib/returnTo";

type Mode = "sign-in" | "sign-up" | "verify";

export default function LoginPage() {
	const navigate = useNavigate();
	const [mode, setMode] = createSignal<Mode>("sign-in");
	const [email, setEmail] = createSignal("");
	const [password, setPassword] = createSignal("");
	const [code, setCode] = createSignal("");
	const [error, setError] = createSignal("");
	const [isSubmitting, setIsSubmitting] = createSignal(false);

	async function submit(
		event: SubmitEvent & { currentTarget: HTMLFormElement },
	) {
		event.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			const installationID = websiteInstallationID();
			if (mode() === "sign-in") {
				await apiRequest<TokenResponse>("auth/login", {
					method: "POST",
					body: JSON.stringify({
						email: email(),
						password: password(),
						installationID,
					}),
				});
				await navigate({ to: returnDestination(), replace: true });
				return;
			}

			if (mode() === "sign-up") {
				await apiRequest("auth/request-code", {
					method: "POST",
					body: JSON.stringify({ email: email(), installationID }),
				});
				setMode("verify");
				return;
			}

			await apiRequest<TokenResponse>("auth/verify-code-register", {
				method: "POST",
				body: JSON.stringify({
					email: email(),
					password: password(),
					code: code(),
					installationID,
				}),
			});
			await navigate({ to: returnDestination(), replace: true });
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
		<main class={styles.page}>
			<section class={styles.card} aria-labelledby="login-title">
				<div class={styles.brandMark} aria-hidden="true">
					T
				</div>
				<p class={styles.eyebrow}>Timetable</p>
				<h1 id="login-title">
					{mode() === "sign-in"
						? "Welcome back"
						: mode() === "sign-up"
							? "Create your account"
							: "Verify your email"}
				</h1>
				<p class={styles.intro}>
					{mode() === "verify"
						? `Enter the six-digit code sent to ${email()}.`
						: "Your school week, in one place."}
				</p>

				<form class={styles.form} onSubmit={submit}>
					<label>
						<span>Email address</span>
						<Input
							type="email"
							value={email()}
							onChange={(event) => setEmail(event.target.value)}
							autoComplete="email"
							maxLength={100}
							required
							disabled={mode() === "verify"}
						/>
					</label>
					<label>
						<span>Password</span>
						<Input
							type="password"
							value={password()}
							onChange={(event) => setPassword(event.target.value)}
							autoComplete={
								mode() === "sign-in" ? "current-password" : "new-password"
							}
							minLength={8}
							maxLength={100}
							required
						/>
					</label>
					{mode() === "verify" ? (
						<label>
							<span>Verification code</span>
							<Input
								inputMode="numeric"
								autoComplete="one-time-code"
								value={code()}
								onChange={(event) =>
									setCode(event.target.value.replace(/\D/g, "").slice(0, 6))
								}
								required
							/>
						</label>
					) : null}
					{error() ? (
						<p class={styles.error} role="alert">
							{error()}
						</p>
					) : null}
					<Button
						class={styles.submit}
						type="submit"
						disabled={isSubmitting()}
					>
						<Symbol
							name={
								isSubmitting()
									? "ellipsis.circle"
									: mode() === "sign-in"
										? "arrow.right"
										: mode() === "sign-up"
											? "paperplane"
											: "checkmark.circle"
							}
							class={styles.actionIcon}
						/>
						{isSubmitting()
							? "Please wait"
							: mode() === "sign-in"
								? "Sign in"
								: mode() === "sign-up"
									? "Send verification code"
									: "Create account"}
					</Button>
				</form>

				{mode() !== "verify" ? (
					<Button
						class={styles.switchMode}
						type="button"
						onClick={() =>
							setMode(mode() === "sign-in" ? "sign-up" : "sign-in")
						}
					>
						<Symbol
							name={mode() === "sign-in" ? "person.badge.plus" : "arrow.left"}
							class={styles.actionIcon}
						/>
						{mode() === "sign-in"
							? "Create an account"
							: "I already have an account"}
					</Button>
				) : null}
			</section>
		</main>
	);
}

function returnDestination() {
	const value =
		typeof window === "undefined"
			? null
			: new URLSearchParams(window.location.search).get("returnTo");

	return safeReturnTo(value, "/today");
}
