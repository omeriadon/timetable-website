# Timetable website

Server-rendered Timetable website built with Next.js and Bun.

## Development

```bash
bun install
bun run dev
```

## Production

```bash
bun run build
bun run start
```

Pushing `main` to the `production` Git remote deploys the application to the
Timetable production server. The remote hook installs locked dependencies,
builds the standalone Next.js application, and restarts its PM2 process.
