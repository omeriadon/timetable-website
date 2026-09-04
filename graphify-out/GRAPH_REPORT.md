# Graph Report - src (2026-09-04)

## Corpus Check

- Corpus is ~44,746 words - fits in a single context window. You may not need a graph.

## Summary

- 746 nodes · 2490 edges · 30 communities (26 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)

- Domain Models
- UI Component Primitives
- Timetable Domain Types
- Settings Controls
- Generated Route Types
- Grades and Users
- Application Shell
- Server Page Data
- Calendar Import
- Dashboard Schedule
- PMSTT Authentication
- Weekly Timetable
- Assessment Scheduling
- Friend Timetables
- Friend Location Status
- Administration Statistics
- Class Comparisons
- Application Routes
- Storage Administration
- Profiles and Requests
- Landing Page
- Administration Records
- Subject Context Sheet
- Administration Page
- Term Dates
- Visual Effects
- Classes Route
- Friends Route
- Settings Route

## God Nodes (most connected - your core abstractions)

1. `cn()` - 97 edges
2. `apiRequest()` - 86 edges
3. `useDrawer()` - 79 edges
4. `Symbol` - 75 edges
5. `Button()` - 55 edges
6. `DrawerFooter()` - 28 edges
7. `useToolbar()` - 27 edges
8. `Input()` - 27 edges
9. `ListRow()` - 27 edges
10. `List()` - 25 edges

## Surprising Connections (you probably didn't know these)

- `AdminUserEditorSheet()` --calls--> `apiRequest()` [EXTRACTED]
  components/administration/AdminUserEditorSheet/AdminUserEditorSheet.tsx → lib/api/client.ts
- `ATARSettingsDrawer()` --calls--> `useDrawer()` [EXTRACTED]
  pages/grades/page.tsx → components/drawers/Drawer/Drawer.tsx
- `DrawerOverlay()` --calls--> `cn()` [EXTRACTED]
  components/ui/drawer.tsx → lib/utils.ts
- `DrawerSwipeHandle()` --calls--> `cn()` [EXTRACTED]
  components/ui/drawer.tsx → lib/utils.ts
- `MobileTabBar()` --calls--> `apiRequest()` [EXTRACTED]
  components/MobileTabBar/MobileTabBar.tsx → lib/api/client.ts

## Import Cycles

- None detected.

## Communities (30 total, 3 thin omitted)

### Community 0 - "Domain Models"

Cohesion: 0.05
Nodes (105): AdminAboutContributorsEditor(), Draft, emptyDraft, AdminAdministratorsEditor(), AdminAppVersionEditor(), AppVersionRequirement, initialValue, AdminAuthorityChangeDrawer() (+97 more)

### Community 1 - "UI Component Primitives"

Cohesion: 0.06
Nodes (67): Accordion(), AccordionContent(), AccordionItem(), AccordionTrigger(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent() (+59 more)

### Community 2 - "Timetable Domain Types"

Cohesion: 0.06
Nodes (59): MobileTabBar(), TabItem, tabs, bottomItems, Sidebar(), isActive(), renderItem(), SidebarItem (+51 more)

### Community 3 - "Settings Controls"

Cohesion: 0.07
Nodes (56): SettingToggle(), SettingToggleProps, DrawerTrigger(), DrawerTriggerProps, EventNotificationSchedule, EventNotificationScheduleDrawer(), formatTime(), offsets (+48 more)

### Community 4 - "Generated Route Types"

Cohesion: 0.05
Nodes (40): LoginPage(), getRouter(), Register, @tanstack/react-router, Route, Route, AuthenticatedAdministrationRoute, AuthenticatedAdministrationRouteChildren (+32 more)

### Community 5 - "Grades and Users"

Cohesion: 0.09
Nodes (31): AdministrationUser, AdminUserEditorSheet(), AdminUserEditorSheetProps, GradeGauge(), formatDate(), formatPercent(), GradeSubjectDrawer(), GradeSubjectDrawerProps (+23 more)

### Community 6 - "Application Shell"

Cohesion: 0.08
Nodes (23): AppShell(), DrawerProvider(), GradientBlinds(), hexToRGB(), prepStops(), ReflectedPageContent(), ReflectedPageContentProps, RouteTransition() (+15 more)

### Community 7 - "Server Page Data"

Cohesion: 0.12
Nodes (19): AdministrationData, AdministrationSectionData, GradeSubjectData, JsonValue, loadAdministrationSection, loadGrades, loadGradeSubject, loadProfileSettingsSection (+11 more)

### Community 8 - "Calendar Import"

Cohesion: 0.15
Nodes (21): CalendarImportDrawer(), availableColours, buildImportedSubjects(), CalendarProperty, classroomFromLocation(), dateInTimeZone(), decodeText(), defaultSymbols (+13 more)

### Community 9 - "Dashboard Schedule"

Cohesion: 0.16
Nodes (15): AssessmentEntryRow(), colour(), compareDate(), displayAssessmentDate(), entryDate(), entryTitle(), isCurrentPeriod(), nextScheduledSubject() (+7 more)

### Community 10 - "PMSTT Authentication"

Cohesion: 0.27
Nodes (14): TokenResponse, get(), authenticatedPMSTTRequest(), clearSession(), cookieOptions, pmsttRequest(), refreshesInFlight, refreshSession() (+6 more)

### Community 11 - "Weekly Timetable"

Cohesion: 0.21
Nodes (12): LessonDetailDrawer(), classroomName(), dayName(), SubjectContextDrawer(), SubjectContextDrawerProps, teacherName(), WeekTimetable(), WeekView() (+4 more)

### Community 12 - "Assessment Scheduling"

Cohesion: 0.24
Nodes (11): AssessmentLocation, availableLocations(), dateValue(), GradeAssessmentDrawer(), GradeAssessmentDrawerProps, locationLabel(), nearestWeekday(), nextWeekday() (+3 more)

### Community 13 - "Friend Timetables"

Cohesion: 0.24
Nodes (11): formatArrival(), FriendDetailDrawer(), locationStatusTitle(), sharedClassRows(), tabs, friendPeriods, friendScheduleTitle(), subjectAtPeriod() (+3 more)

### Community 14 - "Friend Location Status"

Cohesion: 0.24
Nodes (12): CurrentLocationStatus, FriendsData, degreesToRadians(), distanceFromSchool(), formatArrival(), FriendsPage(), locationErrorMessage(), locationStateForDistance() (+4 more)

### Community 15 - "Administration Statistics"

Cohesion: 0.24
Nodes (10): AdministrationStatistics, AdminStatisticsEditor(), DeviceOSVersionCount, formatArrival(), formatDecimal(), AdminStatisticsCountGroup(), AdminStatisticsCountGroupProps, AdminStatisticsGroup() (+2 more)

### Community 16 - "Class Comparisons"

Cohesion: 0.27
Nodes (9): classroomName(), dayName(), SubjectDetailDrawer(), teacherName(), subjectAtSlot(), TimetableComparison(), TimetableComparisonProps, TimetableSlot (+1 more)

### Community 17 - "Application Routes"

Cohesion: 0.23
Nodes (10): fetchDashboard, read(), TestingPage(), Route, Route, Route, Route, Route (+2 more)

### Community 18 - "Storage Administration"

Cohesion: 0.25
Nodes (8): AdminProfileStorageEditor(), formatBytes(), percentage(), StorageQuota, AdminStorageMetric(), AdminStorageMetricProps, AdminStorageQuotaCard(), AdminStorageQuotaCardProps

### Community 19 - "Profiles and Requests"

Cohesion: 0.36
Nodes (7): colour(), fontFamily(), fontWeight(), ProfilePicture(), ProfilePictureProps, proxiedPhotoURL(), FriendRequestsDrawer()

### Community 20 - "Landing Page"

Cohesion: 0.25
Nodes (6): featureCards, Friend, friends, LandingPage(), lessons, Route

### Community 21 - "Administration Records"

Cohesion: 0.38
Nodes (7): AdministrationSectionPage(), filterData(), formatValue(), humanize(), isRecord(), normalizeRecords(), scalarEntries()

### Community 22 - "Subject Context Sheet"

Cohesion: 0.53
Nodes (5): classroomName(), dayName(), SubjectContextSheet(), SubjectContextSheetProps, teacherName()

### Community 23 - "Administration Page"

Cohesion: 0.50
Nodes (4): loadAdministration, administrationDrawerContent(), AdministrationPage(), Route

### Community 24 - "Term Dates"

Cohesion: 0.67
Nodes (3): formatDate(), TermDateDrawer(), TermDateDrawerProps

### Community 26 - "Classes Route"

Cohesion: 0.67
Nodes (3): loadClasses, ClassesPage(), Route

## Knowledge Gaps

- **152 isolated node(s):** `TabItem`, `tabs`, `ReflectedPageContentProps`, `SidebarItem`, `topGroups` (+147 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 170 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions

_Questions this graph is uniquely positioned to answer:_

- **Why does `Symbol` connect `Domain Models` to `UI Component Primitives`, `Timetable Domain Types`, `Settings Controls`, `Grades and Users`, `Application Shell`, `Dashboard Schedule`, `Weekly Timetable`, `Assessment Scheduling`, `Friend Timetables`, `Friend Location Status`, `Administration Statistics`, `Class Comparisons`, `Storage Administration`, `Profiles and Requests`, `Landing Page`, `Subject Context Sheet`, `Term Dates`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Why does `cn()` connect `UI Component Primitives` to `Domain Models`, `Timetable Domain Types`, `Settings Controls`, `Grades and Users`, `Dashboard Schedule`, `Friend Location Status`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `apiRequest()` connect `Domain Models` to `Timetable Domain Types`, `Settings Controls`, `Grades and Users`, `Application Shell`, `Friend Timetables`, `Friend Location Status`, `Administration Statistics`, `Storage Administration`, `Profiles and Requests`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `TabItem`, `tabs`, `ReflectedPageContentProps` to the rest of the system?**
  _152 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Domain Models` be split into smaller, more focused modules?**
  _Cohesion score 0.05172259507829978 - nodes in this community are weakly interconnected._
- **Should `UI Component Primitives` be split into smaller, more focused modules?**
  _Cohesion score 0.060828680575962385 - nodes in this community are weakly interconnected._
- **Should `Timetable Domain Types` be split into smaller, more focused modules?**
  _Cohesion score 0.05939629990262902 - nodes in this community are weakly interconnected._
