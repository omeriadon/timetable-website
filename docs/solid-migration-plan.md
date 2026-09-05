# SolidJS migration plan

Status: planned, not implemented. Baseline: `c74d4303`, recorded 2026-09-05. [Inventory, checks, build sizes, and Graphify assessment](solid-migration-baseline.md).

## Goal and protected scope

Replace React with SolidJS throughout the website while preserving its routes, SSR, authentication, API behavior, appearance, accessibility, and deployment contract. Measure client transfer, interaction cost, and lifecycle behavior before claiming a performance improvement.

Keep TanStack Start and Router, Vite, Nitro's Bun preset, CSS modules, Tailwind, existing design tokens, icons, fonts, and PMSTT endpoints. Preserve the current component/page/feature/server directory boundaries except where React-specific interfaces must change.

Excluded: SolidStart or another router rewrite, a visual redesign, a backend/database migration, new product features, speculative state-management abstractions, wholesale component regeneration, asset replacement, and unrelated cleanup. This repository is the website, not the PMSTT server; do not push or deploy as part of this work.

Completion requires all existing routes and interactions to work in Solid, no React runtime in the shipped graph, passing typecheck/tests/production build, browser parity, and documented before/after performance results. Passing compilation alone is insufficient.

## Target and dependency decisions

Use **TanStack Start's Solid adapter**, not the separate SolidStart framework. This preserves the existing file-route, loader, server-function, and Nitro architecture. Official [Solid setup](https://github.com/TanStack/router/blob/main/docs/start/framework/solid/build-from-scratch.md) documents the adapter, Solid JSX settings, and Vite plugin ordering.

| Current dependency                                                   | Target                                                                                                                   |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `react`, `react-dom`                                                 | `solid-js`                                                                                                               |
| `@tanstack/react-start`                                              | `@tanstack/solid-start`                                                                                                  |
| `@tanstack/react-router`                                             | `@tanstack/solid-router`                                                                                                 |
| `@vitejs/plugin-react`                                               | `vite-plugin-solid`, with SSR enabled                                                                                    |
| `@types/react`, `@types/react-dom`                                   | Remove; use Solid JSX/component/event types                                                                              |
| `@base-ui/react`                                                     | Native elements for simple wrappers; Kobalte for complex controls; Corvu drawer, subject to the compatibility gate below |
| `lucide-react`                                                       | `lucide-solid`, retaining the current glyphs                                                                             |
| `shadcn`, React-oriented `components.json`                           | Remove when React generation is retired; preserve the hand-maintained components and styles                              |
| `fitty`, `ogl`, `clsx`, `class-variance-authority`, `tailwind-merge` | Retain where currently used                                                                                              |
| Vite, Nitro, Bun, TypeScript, Tailwind, `tw-animate-css`             | Retain; change versions only if the adapter's actual peer requirements demand it                                         |

Kobalte supplies controlled, accessible complex controls; its [select documentation](https://kobalte.dev/docs/core/components/select/) covers keyboard navigation, labeling, focus, and option rendering. [Corvu Drawer](https://corvu.dev/docs/primitives/drawer/) documents four sides, snapping, scroll handling, and transition state. These are candidates with a required working integration check, not a claim of drop-in compatibility with Base UI.

Resolve exact published versions with Bun during the compatibility gate, inspect their peer requirements, and commit the resulting `bun.lock` with the runtime change. Do not assume matching React/Solid TanStack version numbers. Official upstream documentation was fetched successfully; registry metadata lookup failed during planning, so a complete installable version tuple is not yet verified.

## Commit and execution strategy

Use a local migration branch or isolated worktree from the recorded React checkpoint. Never rewrite user changes. Match the repository's lowercase, imperative commit subjects.

React elements cannot be rendered as Solid children, and changing the global JSX compiler invalidates the existing component tree. Avoid a temporary dual-runtime bridge or duplicate application. Perform the conversion in the ordered work slices below, then commit the complete validated runtime switch as one atomic change. The conversion workspace can be temporarily non-buildable; its intermediate slices are not release checkpoints.

| Commit boundary                          | Contents and gate                                                                                                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `record solid migration baseline`        | Planning inventory, existing checks, asset measurements, Graphify evidence                                                                                                                                          |
| `plan solid migration`                   | This implementation sequence, acceptance criteria, risks, and rollback                                                                                                                                              |
| `add migration regression checks`        | Minimal behavior checks and repeatable baseline scenarios that pass against React                                                                                                                                   |
| `prepare components for solid migration` | Only independently useful, required interface changes: explicit list sections and lazy drawer content factories, with every React caller updated and checked. Omit this commit if these cannot be separated cleanly |
| `migrate website to solid`               | Dependency/config switch, complete JSX and reactive-state conversion, regenerated routes, primitive replacements, removal of React-only setup, README update. Commit only after the complete gate passes            |
| `reduce measured client overhead`        | Only profiling-backed improvements remaining after parity; separate from framework behavior changes; omit if unnecessary                                                                                            |
| `record solid migration results`         | Final compatibility versions, browser results, performance comparison, limitations, and refreshed Graphify evidence                                                                                                 |

Within the cutover, review diffs by slice rather than generating one mechanical rewrite. One Luna implementation agent owns shared primitives, providers, and runtime integration. After those contracts settle, a second Luna may own a disjoint feature subtree, such as administration. Use medium reasoning for these multi-file ports. The primary agent owns architecture, review, acceptance decisions, and final reporting. Assign explicit files, prohibit overlapping edits, and require changed-file/check/issue reports. The primary agent creates only the validated commit checkpoints in the table. Internal cutover slices are reviewed working changes, not separate commits or independently releasable states.

## Phase 1: establish reproducible behavior and performance

1. Preserve the recorded React revision and lockfile. Use `bun install --frozen-lockfile` when preparing a fresh comparison worktree.
2. Extend the existing Bun checks only around migration-sensitive logic: session refresh/proxy behavior and any new drawer/list contract. Keep the six existing tests intact. Pure timetable checks should cover one representative date/calendar boundary when that logic is touched.
3. Capture production-browser behavior for `/`, `/login`, `/today`, `/week`, `/grades`, `/friends`, `/settings/appearance`, `/settings/about`, `/administration`, and `/testing`.
4. Use synthetic accounts/data and a local PMSTT fixture service selected with `PMSTT_API_BASE_URL` for repeatable authenticated, error, delayed, and mutation flows. Exercise the real website gateway/server functions. Never send test broadcasts, emails, edits, or destructive actions to production data.
5. Record desktop and mobile screenshots at 390, 700, 701, and 1440 CSS pixels; include light/dark appearance, open/nested drawers, empty/loading/error states, and focused controls. Fix time/timezone, data, viewport, browser version, CPU/network throttling, and cache conditions across comparisons.
6. Use production output for timing. Record per-route JS transfer, parse/evaluation cost, FCP/LCP/CLS, observed interaction latency, request counts, long tasks, and retained DOM/listeners after repeated navigation. Use at least five runs per scenario and compare medians with the spread. Lab interaction timings are not field INP.

Exit: baseline scenarios and expected behavior are recorded and repeatable. Existing build sizes alone do not satisfy this phase's runtime measurements.

## Phase 2: prove compatibility before the full port

Use a disposable local directory outside the application tree for a minimal Solid adapter probe. It must use the project's Vite/Nitro/Bun combination and the intended UI packages; do not commit another permanent app.

- Confirm the published package tuple installs without invalid peers and produces `.output/server/index.mjs` using `nitro({ preset: "bun" })`.
- Render a real SSR route, hydrate it, navigate between routes, and run a server function with request-scoped cookie reads/writes.
- Mount a nested Corvu drawer containing a Kobalte select/popover and a footer portal. Check focus trapping, Escape, outside clicks, keyboard selection, scrolling, close completion, and reduced motion. A portaled select must not dismiss its parent drawer or escape the focus trap.
- Validate the grades drawer's actual snap values/direction and the custom switch's pointer behavior. Different primitive attribute names and snap units require explicit mapping.
- Prove Solid's default client entry works. Retain a custom entry only for a demonstrated requirement.

Exit: record exact dependency versions and concrete probe results. If a primitive fails, replace that candidate at this gate and repeat the affected checks. Do not spread an unproven wrapper through the feature tree or remove gestures/accessibility to make the probe pass.

## Phase 3: runtime, routing, and server boundaries

Owned files: `package.json`, `bun.lock`, `vite.config.ts`, `tsconfig.json`, `src/router.tsx`, `src/routes/**`, `src/entry-client.tsx`, `src/lib/server/**`, and generated route metadata. Protect `ecosystem.config.cjs` as part of this deployment boundary; it should require no edit.

- Set TypeScript JSX to `preserve` and `jsxImportSource` to `solid-js`. Keep strict checking and current aliases. Use the Solid Start plugin before `viteSolid({ ssr: true })`, retaining Tailwind and all Nitro cache rules.
- Replace framework imports and router type registration. Regenerate `routeTree.gen.ts`; do not hand-port generated declarations.
- Port the root HTML document using Solid hydration support, head/scripts, and the appropriate Suspense boundary. Preserve metadata, canonical/social tags, manifest, icons, font preload, and server-rendered content.
- Remove the inactive `entry-client.tsx` and use the adapter default. If a custom entry proves necessary, configure the supported path explicitly and follow the installed version's hydration API. The official [client-entry guide](https://github.com/TanStack/router/blob/main/docs/start/framework/solid/guide/client-entry-point.md) confirms that custom entries are optional.
- Keep route paths, the authenticated parent, context, loaders, dynamic params, redirects, pending/error displays, and scroll restoration. Solid router data hooks return accessors: read them reactively rather than passing the accessor as page data or capturing a one-time value.
- Port `createServerFn` and server-cookie imports without changing endpoint contracts. Preserve server-only token code and request isolation. Check the browser build contains no server implementation or credentials.
- Retain the seven-request server dashboard aggregation plus account from route context. Preserve the separate eight-request client fallback used by today/week/planner initially; do not accidentally run it immediately after an SSR-loaded dashboard. The timetable page instead owns editable local timetable state initialized from its loader and must retain successful edits.

Exit: every public/protected route and server endpoint is accounted for, direct requests and client navigation resolve identically, and no obsolete React module registration remains. Final full build waits until every reachable JSX component is converted.

## Phase 4: shared controls and Solid ownership

Convert dependency hubs first: `Symbol`, DOM wrappers, `List`, complex controls, drawers, then providers. Preserve CSS modules, visual tokens, DOM hooks, and public props where they remain meaningful.

| Area                  | Required conversion                                                                                                                                               |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React state/memo      | Signals for mutable state; derived accessors or `createMemo` for tracked computations; stores only for nested updates that need them                              |
| Props/context         | Read reactive properties in tracked scopes; use `splitProps`/`mergeProps` where appropriate; never freeze data by destructuring reactive props                    |
| Effects               | Use `onMount` for one-time browser setup, tracked effects for changing inputs, and `onCleanup` for subscriptions/resources; no copied React dependency arrays     |
| Event handlers        | Map controlled text editing to Solid's input semantics; capture `event.currentTarget` values before async work; preserve checkbox/select and composition behavior |
| Collections           | Use `For` for changing entities and `Index` only for stable positions; preserve identity deliberately when immutable updates replace records                      |
| Conditional rendering | Use reactive branches/`Show`; a component's one-time early return must not lock a loading or empty state                                                          |
| Imperative JSX        | Store lazy component/content factories, instantiate them inside the mounted Solid owner, and dispose them when removed                                            |
| Types/refs            | Replace React node/event/ref types; use Solid refs and JSX attributes; translate style object names and SVG attributes where required                             |

Solid's [props guidance](https://docs.solidjs.com/concepts/components/props) explicitly explains why destructuring can lose reactivity. Import replacement alone will compile some broken views.

**Lists:** `ui/list.tsx` currently introspects child component types. Replace that with explicit section composition: a sectioned list mode, and sections receiving a header slot plus row children, while ordinary lists keep their existing card wrapper. Update the three actual section callers: administration page, `NotificationSettingsEditor`, and testing page. Preserve header-outside-card layout, group/list/listitem roles, separators, row-hover styling, and section ordering. Do not inspect rendered DOM to recover React element metadata.

**Simple controls:** use native button/input/textarea/label/separator/fieldset elements where existing behavior permits. Keep variants, disabled states, data attributes, ARIA, and ref forwarding. Native elements are insufficient replacements for the keyboard/focus/positioning behavior of a custom select or menu.

**Complex controls:** port accordion, alert dialog, menu, popover, select, slider, and switch wrappers to the verified primitives. Translate Base UI's `render` composition to the target's supported composition API and update all consumers. Map actual state attributes used by CSS; do not assume existing selectors will continue working.

**Drawers:** convert `ui/drawer.tsx`, its CSS, `drawers/Drawer`, `DrawerTrigger`, and every `openDrawer` caller together. Change eager JSX content to factories so form state and effects are created once per mounted drawer, under the correct contexts. Preserve stack order, unique IDs, close-top behavior, ancestor dismissal, reopening, swipe/snap behavior, footer hosting, focus restoration, and removal only after exit completion. Reduced-motion/no-transition closure must still dispose content. Replace `React.Children` close-button detection with an explicit prop and update affected callers.

**Switch:** preserve `toggle.tsx` click/keyboard/pointer behavior, drag threshold, pointer capture/cancellation, controlled/uncontrolled modes, disabled handling, and exactly one change callback. Do not replace it with a click-only approximation.

Exit: `/testing` and representative nested feature drawers pass keyboard, pointer, screen-reader semantics, list-layout, and lifecycle checks.

## Phase 5: shell, data lifecycle, and features

| Order and owned scope                                                                           | Acceptance focus                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AppShell`, toolbar, status badges, navigation, theme sync, reflected content, route transition | Persistent context remains reactive; search/actions update on navigation; badge live regions and timeout cleanup; active links and 700px breakpoint; correct `/settings/about` background |
| `useDashboard`, clock, compact-layout adapter                                                   | SSR initial data consumed once; fallback request deduplication; errors can retry; latest data remains reactive; minute/debug-offset updates; timer/listener disposal                      |
| Landing and login pages                                                                         | SEO/SSR intact; all login/code/registration states; validation/errors/pending state; safe return URL and cache reset                                                                      |
| Timetable, today, week, planner, classes and related drawers                                    | Stable lesson/event identity, date navigation, current period, filters, comparisons, calendar import, create/edit/delete, nested details                                                  |
| Grades and subject detail                                                                       | Subject/assessment CRUD, charts/gauge values, assessment-date/location rules, ATAR settings, snapping drawer                                                                              |
| Friends and friend drawers                                                                      | Search/request lifecycle, friend detail schedule/comparison, location permission denied/unavailable/success, personal arrival status, pending/error states                                |
| Settings and section editors                                                                    | Profile/photo/font/colour, theme propagation, notifications/lead times/schedules, archived events, sync, feedback, About                                                                  |
| Administration and section editors                                                              | Account/authority/access changes, badges/tags, calendars, contributors, app version, statistics/storage, email/report/broadcast interfaces; test mutations only against fixtures          |
| Testing page                                                                                    | Every existing showcase interaction remains reachable and functional                                                                                                                      |

Keep pure domain modules unchanged unless a type-only React dependency forces a small move: timetable types/layout/event ranges/calendar import/friend schedules, API contracts/client, return URL helper, installation identity, and utility functions. Do not rewrite their algorithms as part of rendering migration.

`RouteTransition` currently remounts by pathname through React `key`. Reproduce that reset with a keyed Solid boundary; a literal `key` attribute does not provide the same behavior. Check route search changes separately so they do not reset forms unnecessarily.

Do not put authenticated state in a server-global Solid signal. Keep state request/provider scoped; a client dashboard cache must not receive SSR user data at module scope. Preserve logout/reset behavior and prevent a stale in-flight result from repopulating a reset session. Preserve deduplication without broadening the cache's lifetime across users.

For `GradientBlinds`, `fitty` consumers, and the custom switch, retain imperative code behind mount/update/cleanup boundaries. Release RAF loops, WebGL resources, canvases, observers, fitting instances, and pointer listeners. About-page GPU cost will not disappear merely because React is removed.

## Phase 6: complete parity and performance gates

Run focused checks while editing; run the full typecheck, Bun tests, and production build at the completed cutover. Run browser checks against production output and the fixture upstream.

**Authentication/server gate:** production cookies keep `__Host-` names, HTTP-only/Secure/SameSite=Lax/Path=/ attributes, one-hour access and 90-day refresh lifetimes, and legacy-cookie cleanup. Verify fresh/expired/invalid sessions, refresh success/failure and concurrent requests, two-user isolation, redirect path/query preservation, logout DELETE/405 behavior, tokens excluded from JSON/HTML/browser chunks, API methods/body/query/status forwarding, no-store gateway responses, and existing administration section restrictions. Preserve upstream authorization; frontend visibility is not a security boundary. Keep the explicit GET/POST/PUT/DELETE gateway handlers without adding PATCH/OPTIONS handlers. The generic proxy accepts non-auth splat paths: preserve its raw request body, incoming Content-Type, query string, response stream/status, and selected response headers. Auth POST actions retain their separate allowlist; do not accidentally apply that allowlist to generic API traffic.

**Route/SSR gate:** direct-load and client-navigate every route listed in the baseline. Cover refresh, back/forward, dynamic parameter changes, query strings, invalid paths, loading/error/empty states, route titles, and scroll restoration. No hydration mismatches from dates, randomness, local storage, media queries, or portals. Preserve current fallback behavior where a route has no custom boundary.

**Browser gate:** inspect 390/700/701/1440 widths, theme states, keyboard-only navigation, visible focus, labels and error announcements, nested drawer focus/scroll/portal behavior, footer action order, control values, failed save/retry, and cancelled async work. Repeat navigation/open-close cycles and verify that detached elements, listeners, timers, and GPU resources do not accumulate. Use one minimal repeatable browser flow for nontrivial drawer/switch behavior rather than a large new test framework.

**Performance gate:** compare the same production scenarios from Phase 1. Require lower representative route JS transfer and a measurable improvement in at least one target interaction or hydration CPU scenario outside baseline run variance. Allow no repeatable regression greater than 10% in median LCP or interaction latency on representative routes; investigate variability rather than accepting noisy wins. CLS must not worsen. Request counts must not grow, SSR must not double-fetch on hydration, and repeated flows must not retain additional resources. These are project acceptance targets, not predicted Solid results.

If the gain is absent, profile bundle composition, duplicate navigation requests, reactive subscriptions, and WebGL/layout cost. Make only targeted changes backed by the measurements, in a separate commit. Do not claim success from a smaller framework package while total route cost worsens.

**Removal gate:** inspect package/lock and emitted modules for React, React DOM, React TanStack adapters, Base UI React, React types, and React-only generators. Historical documentation and Graphify records may legitimately mention React; scope source/bundle checks accordingly. No placeholder route, compatibility shim, custom JSX bridge, temporary probe, or unused alternative application remains.

## Rollback and final record

Before cutover, the React checkpoint remains the usable application. A failed compatibility/parity gate returns work to its owning slice, not to deployment. If the completed cutover must be reversed, revert the coordinated migration commit and its dependent optimisations together, restoring `package.json`, `bun.lock`, Vite/TS config, generated routes, and source as a unit. Rebuild the restored revision; no data migration is involved.

Keep the existing Bun launch path, PM2 host/port contract, and static caching rules. The official [Solid hosting guide](https://github.com/TanStack/router/blob/main/docs/start/framework/solid/guide/hosting.md) inherits Nitro/Bun deployment instructions from the shared hosting guide. Prove this with the production probe/build instead of changing hosting platforms.

Record the final versions, checks, screenshots/scenarios, per-route transfer and timing comparisons, unresolved limitations, and rollback revision. Refresh Graphify once the coherent source change is complete, preserving the `src` scan root; review source-backed edges and keep generated graph changes in the final evidence commit. Do not rebuild it after every file edit.

No performance improvement is currently established. Planning is complete when the inventory, strategy, dependencies and compatibility gate, all feature scopes, acceptance criteria, commit boundaries, and rollback are reviewable; implementation begins with Phase 1.
