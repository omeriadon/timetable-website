"use client";

import { Button } from "@base-ui/react/button";
import { NativeSelect as Select } from "@/components/ui/NativeSelect";
import { Textarea } from "@/components/ui/Textarea";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "./FeedbackEditor.module.css";

export default function FeedbackEditor() {
	const [category, setCategory] = useState("Feedback");
	const [message, setMessage] = useState("");
	const [status, setStatus] = useState<string | null>(null);
	const [sending, setSending] = useState(false);

	const submit = async () => {
		if (!message.trim() || sending) return;
		setSending(true);
		setStatus(null);
		try {
			await apiRequest("v1/report/feedback", {
				method: "POST",
				body: JSON.stringify({ category, message: message.trim() }),
			});
			setMessage("");
			setStatus("Feedback sent.");
		} catch (error) {
			setStatus((error as Error).message);
		} finally {
			setSending(false);
		}
	};

	return (
		<section className={styles.card}>
			<div className={styles.row}>
				<Symbol name="exclamationmark.bubble" />
				<label htmlFor="feedback-category">Type</label>
				<Select
					id="feedback-category"
					value={category}
					onChange={(event) => setCategory(event.target.value)}
				>
					<option>Feedback</option>
					<option>Bug Report</option>
				</Select>
			</div>
			<label className={styles.messageLabel} htmlFor="feedback-message">
				Describe the {category.toLowerCase()}
			</label>
			<Textarea
				id="feedback-message"
				value={message}
				maxLength={4000}
				rows={8}
				onChange={(event) => setMessage(event.target.value)}
			/>
			<div className={styles.actions}>
				<Button
					type="button"
					aria-label="Send feedback"
					onClick={() => void submit()}
				>
					<Symbol name="checkmark" fallback="✓" />
				</Button>
			</div>
			{status ? (
				<p className={styles.status} role="status">
					{status}
				</p>
			) : null}
		</section>
	);
}
