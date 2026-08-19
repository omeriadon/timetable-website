import styles from "@/components/IOSScreen/IOSScreen.module.css";

export type AdminRecordValue = Record<string, unknown>;

export default function AdminRecord({
  record,
  humanize,
  formatValue,
}: {
  record: AdminRecordValue;
  humanize: (key: string) => string;
  formatValue: (value: unknown) => string;
}) {
  const entries = Object.entries(record).filter(
    ([, value]) => value !== null && value !== "",
  );
  return (
    <div className={styles.adminRecord}>
      {entries.slice(0, 8).map(([key, value]) => (
        <div key={key} className={styles.adminField}>
          <span>{humanize(key)}</span>
          <strong>{formatValue(value)}</strong>
        </div>
      ))}
    </div>
  );
}
