module.exports = {
  apps: [
    {
      name: "timetable-website",
      script: ".next/standalone/server.js",
      cwd: "/var/www/timetable-website",
      interpreter: "/root/.bun/bin/bun",
      env_production: {
        HOSTNAME: "127.0.0.1",
        PORT: "3000",
        NODE_ENV: "production",
      },
    },
  ],
};
