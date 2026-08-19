"use client";

import type { ReactNode } from "react";
import GlassButton from "@/components/controls/GlassButton/GlassButton";
import styles from "./SheetActionButton.module.css";

export default function SheetActionButton({
  label,
  children,
  onClick,
  disabled = false,
  tone = "prominent",
}: {
  label: string;
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  tone?: "prominent" | "destructive";
}) {
  return (
    <GlassButton
      label={label}
      onClick={onClick}
      disabled={disabled}
      tone={tone}
      size="compact"
      className={styles.button}
    >
      {children}
    </GlassButton>
  );
}
