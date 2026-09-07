# Solid migration results

Recorded 2026-09-07 against the local migration worktree.

## Runtime and verification

- Solid Start `1.168.47`, Solid Router `1.170.30`, Solid `1.9.15`, `vite-plugin-solid` `2.11.14`, Vite `8.2.2`, Nitro Bun preset.
- `bun run typecheck`: passed.
- `bun test`: passed, 9 tests and 17 assertions.
- `bun run build`: passed client, SSR, and Nitro output at `.output/server/index.mjs`.
- Fixture-authenticated direct SSR returned `200` with page content for `/testing`, `/today`, `/week`, `/timetable`, `/planner`, `/classes`, `/friends`, `/grades`, `/grades/mathematics`, `/settings`, `/settings/about`, `/administration`, and `/administration/statistics`.
- Protected SSR was checked after moving `Outlet` inside the provider-owned shell; no `useToolbar` or route error boundary output remained.
- Source, package, and emitted bundles contain no React, React DOM, React TanStack adapter, or Base UI React runtime.
- The custom JSX compatibility declaration was removed. Solid JSX attributes and style names are now type-checked directly.

## Bundle comparison

Measurements use the same asset scan and deterministic gzip level as the baseline.

| Assets | React baseline | Solid result | Change |
|---|---:|---:|---:|
| JavaScript raw | 908,832 B | 708,918 B | -22.0% |
| JavaScript gzip | 306,850 B | 240,015 B | -21.8% |
| CSS raw | 134,588 B | 138,422 B | +2.8% |
| CSS gzip | 34,883 B | 35,189 B | +0.9% |

These are emitted-asset totals, not field performance. Browser FCP/LCP/CLS, interaction latency, route request counts, and resource-retention measurements remain unavailable because the browser debugger could not attach to the local tab. No field performance claim is made.

## Browser evidence

The migrated `/testing` page rendered in Chrome and exposed the full primitive showcase through the accessibility tree. Interaction automation then stopped at the browser debugger attachment boundary. Required viewport captures, visual diffs, drawer gesture checks, keyboard/focus checks, and repeated-navigation resource checks are not recorded.

The immutable inventory and capture manifest remain in [solid-ui-inventory.md](solid-ui-inventory.md) and [solid-ui-baseline/README.md](solid-ui-baseline/README.md). The missing browser evidence is an explicit limitation, not a parity claim.

## Remaining limitation

The code and server gates pass, but the browser interaction matrix is incomplete until an automation-capable local browser session is available.
