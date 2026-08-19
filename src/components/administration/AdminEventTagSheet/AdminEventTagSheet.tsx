"use client";

import { useState } from "react";
import type {
  AdminEventTag,
  AdminEventTagSection,
} from "../AdminEventTagsEditor/AdminEventTagsEditor";
import { apiRequest } from "@/lib/api/client";
import { useSheet } from "@/components/sheets/Sheet/Sheet";
import styles from "@/components/sheets/Sheet/Sheet.module.css";
import SheetActionButton from "@/components/controls/SheetActionButton/SheetActionButton";

export default function AdminEventTagSheet({
  tag,
  section,
  onSaved,
}: {
  tag: AdminEventTag | null;
  section: AdminEventTagSection;
  onSaved: () => void;
}) {
  const { closeSheet } = useSheet();
  const [displayName, setDisplayName] = useState(tag?.displayName ?? "");
  const [slug, setSlug] = useState(tag?.slug ?? "");
  const [symbol, setSymbol] = useState(tag?.symbol ?? "tag");
  const [colorHex, setColorHex] = useState(tag?.colorHex ?? "#BD3547");
  const [isArchived, setIsArchived] = useState(tag?.isArchived ?? false);
  const [associatedNames, setAssociatedNames] = useState(
    tag?.associatedNames.join("\n") ?? "",
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await apiRequest(
        `v1/administration/event-tags${tag ? `/${tag.id}` : ""}`,
        {
          method: tag ? "PUT" : "POST",
          body: JSON.stringify({
            sectionID: section.id,
            slug: slug.trim(),
            displayName: displayName.trim(),
            symbol: symbol.trim() || null,
            colorHex,
            sortOrder: tag?.sortOrder ?? section.tags.length,
            isArchived,
            associatedNames: associatedNames
              .split(/\r?\n/)
              .map((value) => value.trim())
              .filter(Boolean),
          }),
        },
      );
      onSaved();
      closeSheet();
    } catch (requestError) {
      setError((requestError as Error).message);
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!tag) return;
    setSaving(true);
    try {
      await apiRequest(`v1/administration/event-tags/${tag.id}`, {
        method: "DELETE",
      });
      onSaved();
      closeSheet();
    } catch (requestError) {
      setError((requestError as Error).message);
      setSaving(false);
    }
  };
  return (
    <div className={styles.detailSheet}>
      <header className={styles.detailHeader}>
        <div>
          <h2>{tag ? "Edit Tag" : "Add Tag"}</h2>
          <p>{section.displayName}</p>
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
          Slug
          <input
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
          />
        </label>
        <label>
          Symbol
          <input
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
          />
        </label>
        <label>
          Colour
          <input
            type="color"
            value={colorHex}
            onChange={(event) => setColorHex(event.target.value)}
          />
        </label>
        <label>
          Associated Names
          <textarea
            rows={3}
            value={associatedNames}
            onChange={(event) => setAssociatedNames(event.target.value)}
          />
        </label>
        <label className={styles.editorCheck}>
          <input
            type="checkbox"
            checked={isArchived}
            onChange={(event) => setIsArchived(event.target.checked)}
          />{" "}
          Archive tag
        </label>
        <div className={styles.sheetActions}>
          {tag ? (
            <SheetActionButton
              label="Delete event tag"
              tone="destructive"
              onClick={() => void remove()}
              disabled={saving}
            >
              Delete
            </SheetActionButton>
          ) : null}
          <SheetActionButton
            label="Save event tag"
            onClick={() => void save()}
            disabled={saving || !displayName.trim() || !slug.trim()}
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
