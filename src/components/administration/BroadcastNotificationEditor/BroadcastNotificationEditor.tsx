"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { useState } from "react";
import Symbol from "@/components/controls/Symbol/Symbol";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

export default function BroadcastNotificationEditor() {
	const [title, setTitle] = useState("");
	const [subtitle, setSubtitle] = useState("");
	const [body, setBody] = useState("");
	const [status, setStatus] = useState<string | null>(null);

	const send = async () => {
		setStatus(null);
		try {
			const result = await apiRequest<{ deliveredDeviceCount: number }>(
				"v1/administration/broadcast-notification",
				{
					method: "POST",
					body: JSON.stringify({
						title,
						subtitle: subtitle || null,
						body: body || null,
						respectsUserPreference: true,
					}),
				},
			);
			setStatus(`Sent to ${result.deliveredDeviceCount} devices.`);
			setTitle("");
			setSubtitle("");
			setBody("");
		} catch (requestError) {
			setStatus((requestError as Error).message);
		}
	};

	return (
		<section className={styles.formCard}>
			<label>
				Title
				<Input
					value={title}
					onChange={(event) => setTitle(event.target.value)}
					maxLength={200}
				/>
			</label>
			<label>
				Subtitle
				<Input
					value={subtitle}
					onChange={(event) => setSubtitle(event.target.value)}
					maxLength={200}
				/>
			</label>
			<label>
				Message
				<Textarea
					value={body}
					onChange={(event) => setBody(event.target.value)}
					maxLength={2000}
					rows={4}
				/>
			</label>
			<Button
				unstyled
				type="button"
				className={styles.adminAction}
				onClick={send}
				disabled={!title.trim()}
			>
				<Symbol name="megaphone" />
				<span>Broadcast notification</span>
			</Button>
			{status ? (
				<p className={styles.detail} role="status">
					{status}
				</p>
			) : null}
		</section>
	);
}
