"use client";

import { type ReactNode, useLayoutEffect, useRef } from "react";
import styles from "@/app/layout.module.css";

type ReflectedPageContentProps = {
  children: ReactNode;
};

export default function ReflectedPageContent({
  children,
}: ReflectedPageContentProps) {
  const sourceRef = useRef<HTMLDivElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const source = sourceRef.current;
    const mirror = mirrorRef.current;

    if (!source || !mirror) {
      return;
    }

    let pendingFrame: number | undefined;

    const updateMirror = () => {
      const clone = source.cloneNode(true) as HTMLElement;

      clone.removeAttribute("data-reflection-source");
      clone.removeAttribute("id");

      for (const element of clone.querySelectorAll("[id]")) {
        element.removeAttribute("id");
      }

      mirror.replaceChildren(clone);
    };

    const scheduleMirrorUpdate = () => {
      if (pendingFrame !== undefined) {
        return;
      }

      pendingFrame = window.requestAnimationFrame(() => {
        pendingFrame = undefined;
        updateMirror();
      });
    };

    updateMirror();

    const observer = new MutationObserver(scheduleMirrorUpdate);
    observer.observe(source, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();

      if (pendingFrame !== undefined) {
        window.cancelAnimationFrame(pendingFrame);
      }
    };
  }, [children]);

  return (
    <div className={styles.pageContent}>
      <div
        ref={mirrorRef}
        className={styles.reflectionMirror}
        aria-hidden="true"
        inert
      />
      <div
        ref={sourceRef}
        className={styles.contentSurface}
        data-reflection-source
      >
        {children}
      </div>
    </div>
  );
}
