import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Resume Builder - Day 1",
  description: "TypeScript and Next.js Learning Project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, backgroundColor: "#0f172a", color: "#f8fafc", fontFamily: "system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
