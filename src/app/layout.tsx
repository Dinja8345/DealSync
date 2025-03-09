import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ホーム画面",
  description: "DebtSync(仮のホームページ)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        {children}
      </body>
    </html>
  );
}
