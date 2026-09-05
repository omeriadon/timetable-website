# Solid migration baseline

Recorded 2026-09-05 against `c74d4303` using Bun 1.4.1. This is planning evidence; the application remains React.

## Scope and checks

| Item                          | Result                                                                                   |
| ----------------------------- | ---------------------------------------------------------------------------------------- |
| Source inventory              | 156 `.ts`/`.tsx`/`.jsx` files under `src`, 18,111 lines including generated routes       |
| JSX surface                   | 132 TSX files and `components/GradientBlinds.jsx`                                        |
| Direct React imports          | 91 files; additional files depend on React through routing or components                 |
| Base UI imports               | 12 files                                                                                 |
| Directory distribution        | 99 components, 18 route files, 15 pages, 13 library files, 8 feature files, 3 root files |
| `bun run typecheck`           | Passed                                                                                   |
| `bun test`                    | Passed: 6 tests across 2 files, 9 assertions                                             |
| `bun run build`               | Passed: client, SSR, and Nitro Bun output                                                |
| Production entry emitted      | `.output/server/index.mjs`                                                               |
| Browser/real-user performance | Not measured during planning                                                             |

The build regenerated route formatting. That generated-only change was removed from the planning changes.

## Build asset measurements

These are all emitted client assets, including lazy routes. They are **not** the bytes downloaded by one route, a framework-only bundle measurement, or evidence of a speed improvement.

| Measurement                                           |   Bytes |
| ----------------------------------------------------- | ------: |
| JavaScript, 70 emitted assets                         | 908,832 |
| Sum of individually gzip-compressed JavaScript assets | 303,925 |
| CSS, 27 emitted assets                                | 134,526 |

Gzip measurements use Python `gzip.compress(data, mtime=0)` with its default compression level. They differ slightly from Vite's displayed gzip estimates. Compare future builds with this same method.

| Largest JS assets                          | Raw bytes | Gzip bytes |
| ------------------------------------------ | --------: | ---------: |
| `index-Cb6mElRj.js`                        |   258,039 |     81,295 |
| `testing-DNnhTqx0.js`                      |    58,856 |     17,445 |
| `_authenticated-DKrlRmLT.js`               |    57,474 |     17,449 |
| `AdminAboutContributorsEditor-CoQ94TIE.js` |    49,084 |     11,190 |
| `useOpenInteractionType-DrZvHhFq.js`       |    48,314 |     16,360 |
| `createServerFn-BLKAJSUE.js`               |    43,783 |     13,695 |
| `drawer-LwvU2OD4.js`                       |    40,092 |     14,264 |
| `select-PLoRGcj-.js`                       |    39,115 |     13,471 |

Chunk names describe emitted files, not exclusive dependency ownership. Actual route transfer and CPU measurements are required before attributing costs.

## Existing architecture

The application uses React 19, TanStack React Start/Router, Vite 8, Nitro's Bun preset, CSS modules, Tailwind 4, and Base UI React primitives. `fitty` and `ogl` are imperative browser libraries; they do not require React.

| Boundary           | Source and current behavior                                                                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Routing            | `src/router.tsx`: file routes and scroll restoration                                                                    |
| Authentication     | `src/routes/_authenticated.tsx`: `checkSession`, safe login redirect, account in route context                          |
| Dashboard SSR      | `src/lib/server/dashboard.functions.ts`: seven parallel upstream reads; route adds authenticated account                |
| Dashboard fallback | `src/features/timetable/useDashboard.ts`: eight browser requests including account; cached result and in-flight promise |
| API gateway        | `src/routes/web-api.$.ts`: auth actions, logout, proxy forwarding, no-store responses                                   |
| Session tokens     | `src/lib/server/pmstt.server.ts`: HTTP-only cookies, legacy-cookie compatibility, refresh deduplication                 |
| UI state           | `DrawerProvider`, `ToolbarProvider`, `StatusBadgeProvider` inside `AppShell`                                            |
| Control harness    | `src/pages/testing/page.tsx`: existing authenticated primitive showcase                                                 |
| Deployment         | `vite.config.ts`, `ecosystem.config.cjs`: Bun process and `.output/server/index.mjs`                                    |

The current Start plugin resolves a custom client file named `src/client.*` unless configured otherwise (`node_modules/@tanstack/start-plugin-core/src/planning.ts`). The repository config supplies no custom client entry. `src/entry-client.tsx` therefore does not establish the active hydration path; Start's default entry does.

## Route coverage

- Public: `/`, `/login`.
- Authenticated: `/today`, `/week`, `/timetable`, `/planner`, `/classes`, `/friends`, `/grades`, `/grades/$subject`, `/settings`, `/settings/$section`, `/administration`, `/administration/$section`, `/testing`.
- Server endpoint: `/web-api/$`, with explicit GET, POST, PUT, and DELETE handlers; no explicit PATCH or OPTIONS handler.
- Structural route files: `__root.tsx` and `_authenticated.tsx`. `$subject`, `$section`, and `$` use TanStack's file-route notation.

Existing tests cover safe return URLs, API path/query preservation, logout's DELETE restriction, and authenticated logout dispatch. They do not establish browser parity, session-refresh isolation, cookie rotation, SSR hydration, or lifecycle cleanup.

## Graphify evidence and limitations

The existing graph was built on 2026-09-04 from `src`: 746 nodes, 2,490 edges, 30 communities. Its manifest covers all 156 current source files. Hash comparison found only `routeTree.gen.ts` differed before the baseline build; paths and line references in the graph are relative to `src`.

Graph vocabulary expansion used: `react router route drawer toolbar dashboard session server api shell settings timetable`. The broad query reached 492 nodes and truncated at the requested output budget. Focused queries and exact node lookup were more useful:

```sh
graphify query 'drawer' --budget 2200
graphify query 'session' --budget 1500
graphify explain components_drawers_drawer_drawer_usedrawer
graphify path 'checkSession' 'authenticatedPMSTTRequest'
```

| Graph observation                                                          | Migration consequence                                                    |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `useDrawer()` has degree 79 at `components/drawers/Drawer/Drawer.tsx:L137` | Validate the drawer boundary before converting its many consumers        |
| `apiRequest()` has degree 86 at `lib/api/client.ts:L15`                    | Preserve this shared transport contract across feature ports             |
| `Symbol` has degree 75 at `components/controls/Symbol/Symbol.tsx:L30`      | Port the existing icon component once; keep the asset system             |
| `useToolbar()` has degree 27 at `components/Toolbar/Toolbar.tsx:L49`       | Audit persistent toolbar state and callbacks across route changes        |
| `checkSession → pmstt.server.ts → authenticatedPMSTTRequest()`             | Keep authentication/server code together when changing framework imports |

Degrees count graph connections, including imports and containment; they are not unique callers or runtime frequency. The authentication path is an import/containment path, not proof of a runtime call chain.

Graphify helped establish migration order and divide frontend versus server inspection. It did not establish performance bottlenecks or Solid compatibility. Direct source reads exposed the list child-introspection contract, drawer lifecycle semantics, and inactive client-entry file.

Limitations encountered: the broad query was noisy; `useDrawer` matches two different nodes and needed an exact ID; a drawer-to-API directed path query found no path; the graph omits root-level dependency/deployment configuration; the report's extraction summary is internally inconsistent about six inferred edges. Its recorded extraction token cost is zero, which does not include this planning session or agent work. No quantified time saving is claimed.

Two read-only Luna agents audited independent frontend and server/route scopes. The primary agent reviewed their findings, resolved architectural choices, and authored the migration plan.
