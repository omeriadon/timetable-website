import type { Metadata } from "next";
import Sidebar from "../components/Sidebar";
import styles from "./layout.module.css";
import "./globals.css";

export const metadata: Metadata = {
	title: "Timetable",
	description: "Timetable",
	icons: {
		icon: "/favicon.svg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<div className={styles.appShell}>
					<Sidebar />
					<div className={styles.pageContent}>{children}</div>
				</div>
			</body>
		</html>
	);
}
