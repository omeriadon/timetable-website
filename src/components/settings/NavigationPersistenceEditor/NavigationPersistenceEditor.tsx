"use client";

import { useEffect, useState } from "react";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import styles from "@/components/IOSScreen/IOSScreen.module.css";

const storageKey = "timetable.persist-navigation";

export default function NavigationPersistenceEditor() {
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored !== null) {
      setIsEnabled(stored === "true");
    }
  }, []);

  const update = (value: boolean) => {
    setIsEnabled(value);
    window.localStorage.setItem(storageKey, String(value));
  };

  return (
    <section className={styles.card}>
      <div className={styles.row}>
        <SymbolIcon name="arrow.counterclockwise.circle" fallback="↻" />
        <label className={styles.label} htmlFor="restore-navigation">
          Restore Navigation
        </label>
        <input
          id="restore-navigation"
          type="checkbox"
          checked={isEnabled}
          onChange={(event) => update(event.target.checked)}
        />
      </div>
      <p className={styles.detailNote}>
        Restore the selected tab, sidebar, and navigation path when reopening
        Timetable.
      </p>
    </section>
  );
}
