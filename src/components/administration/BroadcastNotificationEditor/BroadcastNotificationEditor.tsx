"use client";

import { useState } from "react";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
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
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
        />
      </label>
      <label>
        Subtitle
        <input
          value={subtitle}
          onChange={(event) => setSubtitle(event.target.value)}
          maxLength={200}
        />
      </label>
      <label>
        Message
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          maxLength={2000}
          rows={4}
        />
      </label>
      <button
        type="button"
        className={styles.adminAction}
        onClick={send}
        disabled={!title.trim()}
      >
        <SymbolIcon name="megaphone" />
        <span>Broadcast notification</span>
      </button>
      {status ? (
        <p className={styles.detail} role="status">
          {status}
        </p>
      ) : null}
    </section>
  );
}
