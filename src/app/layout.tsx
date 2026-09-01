import "./globals.css";
import AppShell from "@/components/AppShell/AppShell";
import { cn } from "@/lib/utils";

const inter = { variable: "" };

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={cn("font-sans", inter.variable)}>
			<body>
				<AppShell>{children}</AppShell>
			</body>
		</html>
	);
}
