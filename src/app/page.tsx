"use client";

import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { useToolbar } from "@/components/Toolbar";

export const dynamic = "force-dynamic";

export default function Home() {
	const [notice, setNotice] = useState("Your week is ready to review.");
	const setToolbar = useToolbar();

	useEffect(() => {
		setToolbar({
			title: "Overview",
			actions: [
				{
					label: "Add overview",
					icon: "chart.bar.xaxis.svg",
					onPress: () => setNotice("New overview item created."),
				},
			],
		});
	}, [setToolbar]);

	return (
		<main
			style={{
				width: "100%",
				minHeight: "100%",
				overflowY: "auto",
				padding: "24px",
				boxSizing: "border-box",
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "16px",
					width: "100%",
				}}
			>
				{Array.from({ length: 18 }, (_, index) => {
					const titles = [
						"Morning briefing",
						"Design system review",
						"Research synthesis",
						"Project checkpoint",
						"Team planning",
						"Client workshop",
						"Release preparation",
						"Weekly retrospective",
					];
					const descriptions = [
						"Review priorities, open questions, and the next set of decisions.",
						"Compare the latest component states across the product surfaces.",
						"Turn the collected notes into a focused set of practical findings.",
						"Check the work in progress before it moves into the next stage.",
					];
					const colors = [
						["#ff6b6b", "#ff8787"],
						["#845ef7", "#b197fc"],
						["#339af0", "#74c0fc"],
						["#20c997", "#63e6be"],
						["#fcc419", "#ffe066"],
						["#ff922b", "#ffc078"],
						["#e64980", "#f783ac"],
						["#15aabf", "#66d9e8"],
					];

					const [start, end] = colors[index % colors.length];

					return (
						<div
							key={index}
							style={{
								width: "100%",
								minHeight: index % 4 === 0 ? "180px" : "110px",
								padding: "22px 24px",
								borderRadius: "26px",
								boxSizing: "border-box",
								display: "flex",
								alignItems: "center",
								justifyContent: "space-between",
								background: `linear-gradient(135deg, ${start}, ${end})`,
								color: "white",
								boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
								position: "relative",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									position: "absolute",
									width: "180px",
									height: "180px",
									borderRadius: "50%",
									right: "-50px",
									top: "-70px",
									background: "rgba(255,255,255,0.16)",
								}}
							/>

							<div
								style={{
									position: "absolute",
									width: "100px",
									height: "100px",
									borderRadius: "50%",
									right: "90px",
									bottom: "-65px",
									background: "rgba(255,255,255,0.1)",
								}}
							/>

							<div
								style={{
									position: "relative",
									zIndex: 1,
									display: "flex",
									flexDirection: "column",
									gap: "7px",
								}}
							>
								<span
									style={{
										fontSize: "12px",
										fontWeight: 700,
										letterSpacing: "0.08em",
										textTransform: "uppercase",
										opacity: 0.72,
									}}
								>
									Placeholder {index + 1}
								</span>

								<strong
									style={{
										fontSize: index % 4 === 0 ? "30px" : "21px",
										lineHeight: 1.05,
									}}
								>
									{titles[index % titles.length]}
								</strong>

								<span
									style={{
										fontSize: "14px",
										opacity: 0.78,
									}}
								>
									{descriptions[index % descriptions.length]}
								</span>

								<div
									style={{
										display: "flex",
										alignItems: "center",
										gap: "8px",
										marginTop: "8px",
									}}
								>
									<span
										style={{
											padding: "5px 9px",
											borderRadius: "999px",
											background: "rgba(255,255,255,0.18)",
											fontSize: "11px",
											fontWeight: 700,
										}}
									>
										{`${8 + index}:30 AM`}
									</span>
									<span
										style={{
											padding: "5px 9px",
											borderRadius: "999px",
											background: "rgba(0,0,0,0.12)",
											fontSize: "11px",
										}}
									>
										{index % 2 === 0 ? "In progress" : "Review"}
									</span>
								</div>
							</div>

							<div
								style={{
									position: "relative",
									zIndex: 1,
									width: "48px",
									height: "48px",
									flexShrink: 0,
									borderRadius: "16px",
									background: "rgba(255,255,255,0.2)",
									backdropFilter: "blur(12px)",
									display: "grid",
									placeItems: "center",
									fontSize: "18px",
									fontWeight: 700,
								}}
							>
								{index + 1}
							</div>
						</div>
					);
				})}
			</div>
		</main>
	);
}
