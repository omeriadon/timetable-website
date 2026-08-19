"use client";

import { useState } from "react";
import type {
  AdminEventTagSection,
  Catalogue,
} from "@/components/administration/AdminEventTagsEditor/AdminEventTagsEditor";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";
import SymbolIcon from "@/components/controls/SymbolIcon/SymbolIcon";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import { apiRequest } from "@/lib/api/client";
import styles from "@/components/sheets/Sheet/Sheet.module.css";

type AdminEventTagSectionSheetProps = {
  section: AdminEventTagSection;
  onSaved: (catalogue: Catalogue) => void;
};

export default function AdminEventTagSectionSheet({
  section,
  onSaved,
}: AdminEventTagSectionSheetProps) {
  const { closeSheet } = useSheet();
  const [displayName, setDisplayName] = useState(section.displayName);
  const [sortOrder, setSortOrder] = useState(String(section.sortOrder));
  const [isArchived, setIsArchived] = useState(section.isArchived);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    if (!displayName.trim() || saving) {
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const catalogue = await apiRequest<Catalogue>(
        `v1/administration/event-tags/sections/${section.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            displayName: displayName.trim(),
            sortOrder: Number(sortOrder) || 0,
            isArchived,
          }),
        },
      );
      onSaved(catalogue);
      closeSheet();
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.detailSheet}>
      <header className={styles.detailHeader}>
        <SymbolIcon name="tag" />
        <div>
          <h2>Edit Section</h2>
          <p>{section.category}</p>
        </div>
      </header>
      <section className={styles.formCard}>
        <label>
          Display Name
          <input
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
          />
        </label>
        <label>
          Sort Order
          <input
            type="number"
            min="0"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
          />
        </label>
        <label className={styles.editorCheck}>
          <input
            type="checkbox"
            checked={isArchived}
            onChange={(event) => setIsArchived(event.target.checked)}
          />
          Archive section
        </label>
        <div className={styles.sheetActions}>
          <SheetActionButton
            label="Cancel section edit"
            tone="destructive"
            onClick={closeSheet}
            disabled={saving}
          >
            Cancel
          </SheetActionButton>
          <SheetActionButton
            label="Save event tag section"
            onClick={() => void save()}
            disabled={saving || !displayName.trim()}
          >
            {saving ? "Saving…" : "Save"}
          </SheetActionButton>
        </div>
      </section>
      {error ? (
        <p className={styles.detailMuted} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
