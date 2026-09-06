# React UI baseline captures

This directory is reserved for immutable browser captures for the Solid migration baseline.

Capture status: none yet. On 2026-09-06, approved browser control attempted `http://localhost:3000/testing` and was denied because the admin-enforced browser security policy could not be verified. The server/fixture was not accessed through an indirect workaround, and no screenshots or recordings were fabricated.

Required capture naming:

`<route>__<state>__<viewport>-<theme>__reference.png`

Use widths `390`, `700`, `701`, and `1440`; keep DPR/zoom/fonts/timezone/data fixed. Add recordings as `<route>__<flow>__<viewport>-<theme>__reference.webm` when the browser tool supports them. Never overwrite a reference capture to match migrated output.
