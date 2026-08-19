"use client";

import type { CSSProperties } from "react";
import type { ProfileAppearance } from "@/lib/api/contracts";
import styles from "./ProfileColourGrid.module.css";

type Colour = ProfileAppearance["colours"][number];

type ProfileColourGridProps = {
  selection: Colour[];
  onChange: (selection: Colour[]) => void;
};

type ForegroundColourGridProps = {
  selection: Colour;
  onChange: (selection: Colour) => void;
};

const columnCount = 15;

export function ProfileColourGrid({
  selection,
  onChange,
}: ProfileColourGridProps) {
  const palette = makePalette(6, columnCount, true, 0.92, 0.08);

  return (
    <div
      className={styles.grid}
      style={{ "--profile-grid-columns": columnCount } as CSSProperties}
    >
      {palette.map((colour, index) => {
        const selected = selection.some((item) => sameColour(item, colour));
        return (
          <button
            key={`background-${index}`}
            type="button"
            className={selected ? styles.swatchSelected : styles.swatch}
            style={{ background: rgba(colour) }}
            onClick={() => {
              if (selected) {
                if (selection.length > 1) {
                  onChange(
                    selection.filter((item) => !sameColour(item, colour)),
                  );
                }
                return;
              }
              onChange([...selection.slice(-2), colour]);
            }}
            aria-label={`Background colour ${index + 1}`}
            aria-pressed={selected}
          />
        );
      })}
    </div>
  );
}

export function ProfileForegroundColourGrid({
  selection,
  onChange,
}: ForegroundColourGridProps) {
  const palette = makePalette(2, columnCount - 1, false, 0.7, 0.3);
  const monochrome: Colour[] = [
    { r: 1, g: 1, b: 1, a: 1 },
    { r: 0, g: 0, b: 0, a: 1 },
  ];
  const colours = [...palette, ...monochrome];

  return (
    <div
      className={styles.grid}
      style={{ "--profile-grid-columns": columnCount } as CSSProperties}
    >
      {colours.map((colour, index) => {
        const selected = sameColour(selection, colour);
        return (
          <button
            key={`foreground-${index}`}
            type="button"
            className={selected ? styles.swatchSelected : styles.swatch}
            style={{ background: rgba(colour) }}
            onClick={() => onChange(colour)}
            aria-label={`Foreground colour ${index + 1}`}
            aria-pressed={selected}
          />
        );
      })}
    </div>
  );
}

function makePalette(
  rowCount: number,
  columns: number,
  includesMonochrome: boolean,
  topLightness: number,
  bottomLightness: number,
) {
  const colours: Colour[] = [];
  for (let row = 0; row < rowCount; row += 1) {
    const progress = rowCount === 1 ? 0.5 : row / (rowCount - 1);
    const lightness =
      topLightness - progress * (topLightness - bottomLightness);
    for (let column = 0; column < columns; column += 1) {
      colours.push(hslToColour(column / columns, 0.75, lightness));
    }
  }
  if (includesMonochrome) {
    for (let column = 0; column < columns; column += 1) {
      const lightness = 1 - column / (columns - 1);
      colours.push({ r: lightness, g: lightness, b: lightness, a: 1 });
    }
  }
  return colours;
}

function hslToColour(
  hue: number,
  saturation: number,
  lightness: number,
): Colour {
  const q =
    lightness < 0.5
      ? lightness * (1 + saturation)
      : lightness + saturation - lightness * saturation;
  const p = 2 * lightness - q;
  const channel = (value: number) => {
    let next = value;
    if (next < 0) next += 1;
    if (next > 1) next -= 1;
    if (next < 1 / 6) return p + (q - p) * 6 * next;
    if (next < 1 / 2) return q;
    if (next < 2 / 3) return p + (q - p) * (2 / 3 - next) * 6;
    return p;
  };
  return {
    r: channel(hue + 1 / 3),
    g: channel(hue),
    b: channel(hue - 1 / 3),
    a: 1,
  };
}

function sameColour(left: Colour, right: Colour) {
  return (
    Math.abs(left.r - right.r) < 0.002 &&
    Math.abs(left.g - right.g) < 0.002 &&
    Math.abs(left.b - right.b) < 0.002
  );
}

function rgba(colour: Colour) {
  return `rgba(${Math.round(colour.r * 255)} ${Math.round(colour.g * 255)} ${Math.round(colour.b * 255)} / ${colour.a})`;
}
