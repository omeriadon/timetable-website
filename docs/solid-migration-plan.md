# SolidJS migration plan

Status: planned, not implemented. Baseline: `c74d4303`, recorded 2026-09-05. [Inventory, checks, build sizes, and Graphify assessment](solid-migration-baseline.md).

## Goal and protected scope

Replace React with SolidJS throughout the website while preserving its routes, SSR, authentication, API behavior, appearance, accessibility, and deployment contract. Measure client transfer, interaction cost, and lifecycle behavior before claiming a performance improvement.

Keep TanStack Start and Router, Vite, Nitro's Bun preset, CSS modules, Tailwind, existing design tokens, icons, fonts, and PMSTT endpoints. Preserve the current component/page/feature/server directory boundaries except where React-specific interfaces must change.

Excluded: SolidStart or another router rewrite, a visual redesign, a backend/database migration, new product features, speculative state-management abstractions, wholesale component regeneration, asset replacement, and unrelated cleanup. Never push to any remote or deployment target, trigger a deployment, or publish this migration. All commits and verification remain local.

Completion requires all existing routes and interactions to work in Solid, no React runtime in the shipped graph, passing typecheck/tests/production build, identical documented UI appearance and behavior verified through browser control, and documented before/after performance results. Passing compilation alone is insufficient.

## Target and dependency decisions

Use **TanStack Start's Solid adapter**, not the separate SolidStart framework. This preserves the existing file-route, loader, server-function, and Nitro architecture. Official [Solid setup](https://github.com/TanStack/router/blob/main/docs/start/framework/solid/build-from-scratch.md) documents the adapter, Solid JSX settings, and Vite plugin ordering.

| Current dependency                                                   | Target                                                                                                                    |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `react`, `react-dom`                                                 | `solid-js`                                                                                                                |
| `@tanstack/react-start`                                              | `@tanstack/solid-start`                                                                                                   |
| `@tanstack/react-router`                                             | `@tanstack/solid-router`                                                                                                  |
| `@vitejs/plugin-react`                                               | `vite-plugin-solid`, with SSR enabled                                                                                     |
| `@types/react`, `@types/react-dom`                                   | Remove; use Solid JSX/component/event types                                                                               |
| `@base-ui/react`                                                     | Port the existing local components in place; adapt only their React-dependent internals while preserving their contracts  |
| `lucide-react`                                                       | `lucide-solid`, retaining the current glyphs                                                                              |
| `shadcn`, React-oriented `components.json`                           | Preserve shared variables, CSS behavior, and existing local components; retire generator tooling only if no longer needed |
| `fitty`, `ogl`, `clsx`, `class-variance-authority`, `tailwind-merge` | Retain where currently used                                                                                               |
| Vite, Nitro, Bun, TypeScript, Tailwind, `tw-animate-css`             | Retain; change versions only if the adapter's actual peer requirements demand it                                          |

The components already in `src/components` are the implementation to migrate. Keep their files, styling, variants, and public interfaces wherever Solid permits; fix migration bugs in place. Do not regenerate them from shadcn or substitute another library's component collection. No replacement component library is prescribed.

`src/styles/globals.css` imports `shadcn/tailwind.css`. Preserve shared variables, theme values, utilities, animation variants, and CSS import ordering, including `design-tokens.css`. Retain that CSS dependency if it remains useful. If removing the package, first preserve the required CSS locally with its license notices and verify identical computed styles. Package removal is not itself a migration goal.

The local files still delegate some behavior to `@base-ui/react`; those React internals cannot run unchanged in Solid. Adapt that boundary inside the existing components. Prefer existing code and native behavior where they fully preserve the contract. Only if a proven behavior cannot be ported cleanly should a minimal Solid-compatible primitive be used internally, with the reason documented and the same browser parity checks. Do not replace the visible components, rebuild a UI kit, or introduce fragile handwritten focus/gesture machinery to avoid a dependency.

Resolve exact published versions with Bun during the compatibility gate, inspect their peer requirements, and commit the resulting `bun.lock` with the runtime change. Do not assume matching React/Solid TanStack version numbers. Official upstream documentation was fetched successfully; registry metadata lookup failed during planning, so a complete installable version tuple is not yet verified.

## Commit and execution strategy

Before any migration implementation or preparatory component changes, create exactly one empty commit:

```sh
git commit --allow-empty -m "last react commit"
```

Record its hash. This is the entire revert plan; no rollback procedure or rollback automation is required. The implementing agent creates this checkpoint, not the agent amending this document. Never rewrite user changes. Match the repository's lowercase, imperative commit subjects.

React elements cannot be rendered as Solid children, and changing the global JSX compiler invalidates the existing component tree. Avoid a temporary dual-runtime bridge or duplicate application. Perform the conversion in the ordered work slices below, then commit the complete validated runtime switch as one atomic change. The conversion workspace can be temporarily non-buildable; its intermediate slices are not release checkpoints.

| Commit boundary                          | Contents and gate                                                                                                                                                                                                   |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `record solid migration baseline`        | Planning inventory, existing checks, asset measurements, Graphify evidence                                                                                                                                          |
| `plan solid migration`                   | This implementation sequence, acceptance criteria, and browser inventory requirements                                                                                                                               |
| `last react commit`                      | One empty commit immediately before implementation; the only revert checkpoint                                                                                                                                      |
| `document react ui`                      | Browser inventory, component/state coverage, screenshots, and interaction recordings before changing UI                                                                                                             |
| `add migration regression checks`        | Minimal behavior checks and repeatable baseline scenarios that pass against React                                                                                                                                   |
| `prepare components for solid migration` | Only independently useful, required interface changes: explicit list sections and lazy drawer content factories, with every React caller updated and checked. Omit this commit if these cannot be separated cleanly |
| `migrate website to solid`               | Dependency/config switch, complete JSX and reactive-state conversion, regenerated routes, in-place component ports, removal of obsolete React-only setup, README update. Commit only after the complete gate passes |
| `reduce measured client overhead`        | Only profiling-backed improvements remaining after parity; separate from framework behavior changes; omit if unnecessary                                                                                            |
| `record solid migration results`         | Final compatibility versions, browser results, performance comparison, limitations, and refreshed Graphify evidence                                                                                                 |

Within the cutover, review diffs by slice rather than generating one mechanical rewrite. Assign implementation subagents by the work:

| Work                                                                                                                                        | Agent | Reasoning      |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ----- | -------------- |
| Structural or architectural work: runtime/router/server boundaries, provider ownership, reactivity contracts, shared primitive architecture | Astra | low, always    |
| UI work: in-place component/page ports, styling, browser inventory, visual comparison and corrections within settled contracts              | Luna  | medium, always |

Astra settles structural contracts before Luna ports their consumers. Split mixed tasks at that boundary. Use the actual named agents exposed by the implementation environment; do not silently substitute another model if a requested agent is unavailable. The primary agent coordinates, reviews, checks acceptance, and reports results.

Give each agent explicit file ownership, the baseline evidence, required behavior, and verification criteria. Prohibit overlapping edits. Require changed-file, browser-evidence, check, and unresolved-issue reports. Coordinate access to shared browser sessions so agents do not interrupt each other's scenarios. The primary agent creates only validated atomic commits; internal cutover slices are reviewed working changes, not independently releasable states.

## Phase 1: document every existing UI before changing it

Use browser control (Browser Use, CUA, or the available equivalent) to open and operate the running React website. This is mandatory hands-on inspection, not a source-only inventory. Start at `/testing`, then visit every route and feature drawer to cover components and variants missing from that page. The existing planning baseline contains no completed browser audit; the implementing agent must produce it before porting UI.

1. Run the current React app with the recorded dependency lockfile. Use synthetic accounts/data and a local PMSTT fixture service selected with `PMSTT_API_BASE_URL` for authenticated, error, delayed, and mutation flows. Exercise the real gateway/server functions. Never send test broadcasts, emails, edits, or destructive actions to production data.
2. Enumerate the actual UI components and their rendered usages. Cross-reference that list with `/testing` and every route in the baseline. The checklist must account for every component, including feature-specific components outside `src/components/ui`; mark coverage gaps explicitly and visit the actual feature or add a minimal case to the existing testing page.
3. Create `docs/solid-ui-inventory.md` and store reference captures under `docs/solid-ui-baseline/`. For each component record its source file, route, exact reproduction steps, variant/props, viewport/theme, state, screenshot or recording path, expected behavior, and related shared variables/CSS. Include typography, dimensions, spacing, borders/radii, colour, shadows, blur, alignment, layering, scroll behavior, and motion timing. These artifacts are implementation deliverables, not already-completed evidence.
4. Exercise every available variant and applicable state: default, hover, pressed/dragged, keyboard focus, disabled, selected, expanded/collapsed, empty, loading, validation error, success, controlled updates, and narrow/wide layout. Cover buttons, inputs/textareas, fields/labels/errors, lists/sections/rows/cards, separators, icons, accordion, menus, popovers, selects, sliders, toggles, alerts, drawers, navigation/toolbars, badges, profile controls, charts, timetable views, and visual effects. Source inventory, not this example list, determines completeness.
5. Open every distinct drawer and its nested flows. Document opening/closing, overlay and content geometry, swipe directions, snap points, interrupted gestures, scroll interaction, footer portals, nested scaling/dimming, Escape/backdrop dismissal, focus restoration, and reduced motion. Record transitions as well as static endpoints.
6. Capture at 390, 700, 701, and 1440 CSS pixels and every supported appearance/theme. Fix browser/version, device pixel ratio, zoom, fonts, time/timezone, data, scroll position, and cache conditions. Wait for fonts/assets to load. Keep the reference captures immutable; do not update them to match the migrated result.
7. Keep the six existing Bun tests. Add only migration-sensitive behavior checks that pass against React. Record production per-route JS transfer, parse/evaluation cost, FCP/LCP/CLS, observed interaction latency, request counts, long tasks, and retained resources after repeated navigation. Use at least five timing runs per scenario, with matching CPU/network settings, and compare medians and spread. Lab interaction timings are not field INP.

Exit: the inventory links every rendered component and applicable state to browser evidence. An unvisited component is incomplete, not implicitly covered by `/testing`. Missing access or data remains an explicit unfinished item; do not claim full coverage without inspecting it.

## Phase 2: prove compatibility before the full port

Use a disposable local directory outside the application tree for a minimal Solid adapter probe. It must use the project's Vite/Nitro/Bun combination and in-place ports of the current local components; do not commit another permanent app.

- Confirm the published package tuple installs without invalid peers and produces `.output/server/index.mjs` using `nitro({ preset: "bun" })`.
- Render a real SSR route, hydrate it, navigate between routes, and run a server function with request-scoped cookie reads/writes.
- Mount the ported existing drawer with a nested drawer, the existing select/popover, and a footer portal. Check focus trapping, Escape, outside clicks, keyboard selection, scrolling, close completion, and reduced motion. A portaled select must not dismiss its parent drawer or escape the focus trap.
- Validate the grades drawer's actual snap values/direction and the custom switch's pointer behavior. Preserve the existing state attributes and snap semantics; map any unavoidable internal differences inside the local component.
- Prove Solid's default client entry works. Retain a custom entry only for a demonstrated requirement.

Exit: record exact dependency versions and concrete probe results. If a port fails, repair the local component or its internal primitive boundary and repeat the affected checks. Keep the original styling and behavior; do not remove gestures/accessibility to make the probe pass.

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

**Simple controls:** port the current button/input/textarea/label/separator/fieldset components in place, retaining their markup and styling. Use native internals only where they preserve all existing behavior. Keep variants, disabled states, data attributes, ARIA, and ref forwarding. Native elements are insufficient replacements for the keyboard/focus/positioning behavior of a custom select or menu.

**Complex controls:** port the existing accordion, alert dialog, menu, popover, select, slider, and switch in place. Repair React-specific composition and ownership at the local boundary, updating consumers only where necessary. Preserve the CSS state attributes and DOM contract; do not adopt another library's visual defaults or re-skin a replacement component kit.

**Drawers:** convert `ui/drawer.tsx`, its CSS, `drawers/Drawer`, `DrawerTrigger`, and every `openDrawer` caller together. Change eager JSX content to factories so form state and effects are created once per mounted drawer, under the correct contexts. Preserve stack order, unique IDs, close-top behavior, ancestor dismissal, reopening, swipe/snap behavior, footer hosting, focus restoration, and removal only after exit completion. Reduced-motion/no-transition closure must still dispose content. Replace `React.Children` close-button detection with an explicit prop and update affected callers.

**Switch:** preserve `toggle.tsx` click/keyboard/pointer behavior, drag threshold, pointer capture/cancellation, controlled/uncontrolled modes, disabled handling, and exactly one change callback. Do not replace it with a click-only approximation.

Exit: every affected inventory entry, including all feature drawer variants, passes the browser comparison loop below and its keyboard, pointer, accessibility, layout, and lifecycle checks.

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

**Browser comparison loop:** run the same documented steps against Solid using browser control. For each inventory entry:

1. Reproduce the reference viewport, theme, data, focus, scroll, and interaction state. Capture the migrated output with the same settings, including transition recordings where applicable.
2. Compare before/after side by side and use screenshot overlays/diffs to locate discrepancies. Inspect computed styles and layout when a difference is found. Require identical visible appearance and interaction behavior, not merely similar overall screenshots.
3. Fix the cause in the existing component, its reactive state, or the shared CSS variable/style that owns the behavior. Keep changes clear and local. Do not stack CSS overrides, add unexplained magic offsets or timeouts, manipulate rendered DOM around Solid, suppress events, or weaken focus/accessibility to hide a mismatch.
4. Repeat the browser scenario and capture after each correction until no unexplained visual difference remains. Normalize genuinely nondeterministic content before comparison and document any unavoidable rendering noise; never mask a real component difference or refresh the baseline to pass.
5. Recheck keyboard/pointer behavior, controlled values, failed-save/retry, cancellation, cleanup, and any other consumers of the corrected shared component. A screenshot match with broken behavior fails. Repeated drawer open/close and navigation must not accumulate DOM, listeners, timers, or GPU resources.
6. Record reference/after evidence and the result for every component/state in the inventory. After shared fixes, rerun the full inventory and feature flows. Do not finish with outstanding appearance or reliability mismatches.

Visual identity and implementation quality are both acceptance requirements. Browser inspection and the correction loop are the primary UI verification; typechecking, builds, or a single showcase screenshot cannot substitute for them.

**Performance gate:** compare the same production scenarios from Phase 1. Require lower representative route JS transfer and a measurable improvement in at least one target interaction or hydration CPU scenario outside baseline run variance. Allow no repeatable regression greater than 10% in median LCP or interaction latency on representative routes; investigate variability rather than accepting noisy wins. CLS must not worsen. Request counts must not grow, SSR must not double-fetch on hydration, and repeated flows must not retain additional resources. These are project acceptance targets, not predicted Solid results.

If the gain is absent, profile bundle composition, duplicate navigation requests, reactive subscriptions, and WebGL/layout cost. Make only targeted changes backed by the measurements, in a separate commit. Do not claim success from a smaller framework package while total route cost worsens.

**Removal gate:** inspect package/lock and emitted modules for React, React DOM, React TanStack adapters, Base UI React, and React types. Remove obsolete runtime imports and framework dependencies; preserve any still-required shadcn CSS/shared variables rather than treating package deletion as a success criterion. Historical documentation and Graphify records may legitimately mention React; scope source/bundle checks accordingly. No placeholder route, compatibility shim, custom JSX bridge, temporary probe, or unused alternative application remains.

## Final record

Keep the existing Bun launch path, PM2 host/port contract, and static caching rules. Build and run locally; never push or trigger deployment.

Record the final versions, completed UI inventory, before/after browser evidence, behavior checks, per-route transfer/timing comparisons, and remaining limitations. Refresh Graphify once the coherent source change is complete, preserving the `src` scan root; review source-backed edges and keep generated graph changes in the final evidence commit. Do not rebuild it after every file edit.

No performance improvement or visual identity is currently established. This document defines the work for the implementing agent; the empty checkpoint and browser inventory are still to be completed before UI migration.
