# React UI inventory for Solid migration

Baseline commit: `c74d4303`  
Inventory scope: all rendered React components under `src/components`, all route/page renderers, and the `/testing` showcase.  
Source inventory date: 2026-09-06. Browser capture status: blocked pending the local fixture server and admin browser policy.

## Browser protocol

Required viewport widths are 390, 700, 701, and 1440 CSS px. Use a fixed DPR, zoom 100%, loaded fonts/assets, a fixed clock/timezone, and fixture-backed data. Record both light/system-dark/dark where the UI exposes the theme control. Every row below requires default, hover, pressed, keyboard focus, disabled, selected, expanded/collapsed, loading, empty, validation-error, success, controlled-update, and narrow/wide checks where the component supports that state.

The first approved attempt navigated Chrome to `http://localhost:3000/testing`; browser access was denied because the admin-enforced security policy could not be verified. No screenshot, recording, login, mutation, or production request was fabricated. The capture manifest is in [`solid-ui-baseline/README.md`](solid-ui-baseline/README.md).

## Route matrix

| Route | Source renderer | Rendered feature surface | Required data/state coverage |
|---|---|---|---|
| `/` | `src/pages/page.tsx` | landing, reflected content, gradient/WebGL effect, CTA | default, loaded assets, narrow/wide, light/dark |
| `/login` | `src/pages/login/page.tsx` | sign-in, registration, code verification, return URL | empty, focused, pending, invalid, API error, success |
| `/today` | `src/pages/today/page.tsx` | timetable mode navigation, today lessons/events | loaded, empty, current period, date changes, drawer states |
| `/week` | `src/pages/week/page.tsx` | week timetable, event rows, friend comparison | loaded/empty, selected day, narrow/wide, detail drawer |
| `/timetable` | `src/pages/timetable/page.tsx` | editable timetable, week grid, editor drawer | loaded, save/error, add/edit/delete, cancelled drawer |
| `/planner` | `src/pages/planner/page.tsx` | planner calendar/events | loaded/empty, date navigation, event create/edit/delete |
| `/classes` | `src/pages/classes/page.tsx` | subject list and subject detail drawer | loaded/empty, selected subject, nested actions |
| `/friends` | `src/pages/friends/page.tsx` | friend list/search/requests, arrival status | loaded/empty, search/pending/error, permission states, reorder |
| `/grades` | `src/pages/grades/page.tsx` | grade gauges, subject drawers, ATAR settings | loaded/empty, assessment CRUD, validation/save/error |
| `/grades/$subject` | `src/pages/grades/[subject]/page.tsx` | subject assessments and grade drawer | valid/invalid subject, add/edit/delete, errors |
| `/settings` | `src/pages/settings/page.tsx` | profile, appearance, notifications, calendar import, navigation rows | loaded, save/error, selects/toggles, drawers |
| `/settings/$section` | `src/pages/settings/[section]/page.tsx` | profile/appearance/sync/notifications/archive/feedback/about | each section default, pending/error/success, back navigation |
| `/administration` | `src/pages/administration/page.tsx` | administration section list and editors | permitted account, loading/error, all section drawers |
| `/administration/$section` | `src/pages/administration/[section]/page.tsx` | section editor/detail records | permitted/denied, empty/error, mutation confirmation |
| `/testing` | `src/pages/testing/page.tsx` | primitive and interaction showcase | every showcase variant and nested interaction |

Structural route files `src/routes/__root.tsx`, `src/routes/_authenticated.tsx`, and `src/routes/web-api.$.ts` are included in the route/SSR boundary but do not add visible component rows. Authentication and administration coverage require the synthetic fixture account; without it, those states remain blocked rather than inferred.

## Rendered component catalog

Each entry is a source-to-render cross-reference. `testing` means the component is directly exercised by `/testing`; route names identify feature usage. Shared CSS is co-located `.module.css` or the shared files [`src/styles/globals.css`](../src/styles/globals.css), [`src/styles/design-tokens.css`](../src/styles/design-tokens.css), and [`src/styles/layout.module.css`](../src/styles/layout.module.css).

### Shared UI primitives

| Component/source | Rendered usage | States/props to capture |
|---|---|---|
| `ui/accordion.tsx` | testing fonts/buttons/fields/lists sections | single/multiple, collapsed/expanded, keyboard |
| `ui/alert-dialog.tsx` | testing | closed/open, cancel/action, focus trap |
| `ui/button.tsx` | all routes; testing | default/outline/secondary/destructive/link/ghost; xs/sm/default/lg/icon; disabled/focus/pressed |
| `ui/card.tsx` | feature editors and testing | default/content/header/footer |
| `ui/drawer.tsx` | feature drawers and testing | open/closed, overlay, focus, Escape, swipe/snap |
| `ui/dropdown-menu.tsx` | testing and toolbar/actions | item, checkbox, radio, submenu, disabled, keyboard |
| `ui/field.tsx` | testing and forms | labels/descriptions/errors, orientations, disabled |
| `ui/input.tsx`, `ui/textarea.tsx`, `ui/label.tsx` | login, settings, friends, grades, testing | empty/focused/filled/invalid/disabled |
| `ui/list.tsx` | settings, administration, friends, grades, testing | sections, headers, rows, hover |
| `ui/popover.tsx` | testing and settings controls | open/closed, outside click, focus |
| `ui/sectioncard.tsx` | settings/administration/testing | default and action states |
| `ui/select.tsx` | settings/forms/testing | selected/open/keyboard/disabled |
| `ui/separator.tsx` | testing and page sections | horizontal/vertical |
| `ui/slider.tsx` | settings/testing | min/max, keyboard, drag, disabled |
| `ui/toggle.tsx` | settings/testing | on/off, focus, disabled |
| `ui/skiper-ui/skiper41.tsx` | visual effects where imported | blur layers, narrow/wide |

### Shell, controls, timetable, grades, settings, and drawers

| Source group | Components | Rendered routes |
|---|---|---|
| shell | `AppShell`, `Toolbar`, `Sidebar`, `MobileTabBar`, `RouteTransition`, `ReflectedPageContent`, `StatusBadge`, `ThemeSettingsSync`, `GradientBlinds` | all; landing/settings/about |
| controls | `Symbol`, `ProfilePicture`, `SettingToggle` | all authenticated; testing |
| timetable | `TimetableModeNavigation`, `TodayView`, `WeekView`, `WeekTimetable`, `PlannerView`, `EventRow`, `TimetableComparison` | today/week/timetable/planner/friends |
| grades | `GradeGauge`, `GradeSubjectDrawer` | grades and subject detail |
| settings | `NavigationRow`, `AppearanceSettingsEditor`, `ProfileAppearanceEditor`, `ProfileColourGrid`, `ProfileForegroundColourGrid`, `ProfileFontPicker`, `NotificationSettingsEditor`, `ArchivedEventsEditor`, `FeedbackEditor`, `AboutEditor`, `AccountSyncEditor` | settings and every settings section |
| calendar/event drawers | `CalendarEventDrawer`, `CalendarImportDrawer`, `EventNotificationScheduleDrawer`, `TermDateDrawer`, `TimetableEditorDrawer`, `LessonDetailDrawer`, `SubjectDetailDrawer`, `SubjectContextDrawer`, `SubjectContextSheet`, `ConfirmationDrawer`, `MessageDrawer` | planner/timetable/classes/settings/grades |
| friend/navigation drawers | `NavigationDrawer`, `QuickSettingsDrawer`, `FriendDetailDrawer`, `FriendRequestsDrawer`, `FriendSearchDrawer`, `NotificationLeadTimesDrawer`, `Drawer`, `DrawerTrigger` | shell/friends/settings |

### Administration components

| Source group | Components | Route |
|---|---|---|
| editors | `AdminStatisticsEditor`, `AdminUsersEditor`, `AdminUserReportsEditor`, `AdminCalendarEditor`, `AdminEventTagsEditor`, `BroadcastNotificationEditor`, `AdminBroadcastHistoryEditor`, `AdminEmailLogEditor`, `AdminAboutContributorsEditor`, `AdminAdministratorsEditor`, `AdminAppVersionEditor`, `AdminDevelopmentAccessEditor`, `AdminProfileStorageEditor`, `AdminBadgesEditor`, `TestEmailButton` | administration and administration sections |
| nested drawers/rows | `AdminAuthorityChangeDrawer`, `AdminBroadcastDetailDrawer`, `AdminBroadcastDetailRow`, `AdminCalendarEntryDrawer`, `AdminDevelopmentAccessChangeDrawer`, `AdminEventTagDrawer`, `AdminEventTagSectionDrawer`, `AdminSpecialBadgeDrawer`, `AdminUserEditorDrawer`, `AdminUserEditorSheet` | administration editor flows |
| records/statistics | `AdminRecord`, `AdminStatisticsGroup`, `AdminStatisticsCountGroup`, `AdminStorageMetric`, `AdminStorageQuotaCard`, `AdminVersionField` | administration sections |

## `/testing` showcase inventory

The source page declares these sections: Fonts (five font families at 12/18/28/40 px), Buttons (six variants, four size classes, four icon sizes, disabled variants), Fields (input, textarea, select, toggles, responsive fields, description/error), Lists (sections/headers/rows), Cards/section cards, Popover, Dropdown menu (checkbox/radio/submenu/shortcut), Alert dialog, Drawer, Profile picture, Symbols, separators, slider, and setting toggle. Exercise each accordion open/close and keyboard focus. The page state includes `switched`, `menuChecked`, `menuTheme`, and `settingEnabled`, so controlled updates must be recorded.

## Visual and lifecycle checklist

For each rendered row record computed typography/font, dimensions, spacing, border/radius, colour, shadow/blur, alignment, z-order, scroll container, portal target, and transition duration/easing. For drawers also record swipe direction, snap points, interrupted gesture, nested dimming/scaling, footer portal, backdrop/Escape dismissal, focus restoration, and reduced-motion behavior. For imperative `GradientBlinds`, record canvas/WebGL resource cleanup after navigation and repeated mount/unmount.

## Coverage status

Source coverage is complete for the files listed above. Browser coverage is **blocked** for all routes and all four viewport widths until the local fixture-backed React server can be opened through approved browser control. No visual parity or performance claim is made. Authentication, administration, mutations, delayed/error responses, location permission outcomes, and real drawer interactions remain explicit unfinished coverage items.
