# SF Symbols

The SVGs in this directory are the web app's SF Symbols export set. Files keep
their SF Symbols names, including dots, so `Symbol name="calendar"`
resolves to `/icons/calendar.svg`.

The fixed website controls use these symbols:

```text
7.calendar
app.badge
arrow.clockwise.icloud
arrow.counterclockwise.circle
arrow.down.app
arrow.up.right
archivebox
bell.badge
calendar
calendar.badge.clock
calendar.badge.exclamationmark
calendar.badge.lock
calendar.day.timeline.left
character
chart.bar
chart.bar.xaxis
checkmark
checkmark.icloud
chevron.down
chevron.right
clock.arrow.trianglehead.counterclockwise.rotate.90
desktopcomputer
doc
doc.on.doc
envelope.badge
exclamationmark.bubble
externaldrive.fill
face.smiling
gear
hammer
lightbulb
line.3.horizontal
magnifyingglass
megaphone
minus
paintpalette
pencil.and.list.clipboard
person
person.2
person.2.slash
person.badge.plus
person.badge.shield.checkmark
photo
play.fill
plus
rectangle.bottomthird.inset.filled
rosette
stop.fill
tag
testtube.2
textformat.size
trash
widget.large
xmark
```

The editor defaults and runtime controls also use:

```text
book.and.wrench
lock.fill
lock.open
wrench.and.screwdriver
```

`character.svg` is the current SF Symbols Beta export used for the editor's
subject default. The iCloud symbols were copied through the right-click
`Copy Image As…` menu as SVG because Beta disables their direct File export.

When a server-provided subject, badge, or tag symbol is introduced, export the
same symbol from SF Symbols Beta into this directory before using it in the
interface.
