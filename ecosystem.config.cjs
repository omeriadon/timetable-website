module.exports = {
	apps: [
		{
			name: "timetable-website",
			script: ".output/server/index.mjs",
			cwd: "/var/www/timetable-website",
			interpreter: "bun",
			env_production: {
				HOST: "127.0.0.1",
				PORT: "3000",
				NODE_ENV: "production",
			},
		},
	],
};
