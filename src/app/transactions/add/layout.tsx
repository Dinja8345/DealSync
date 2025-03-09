import type { Metadata } from "next";

export const metadata : Metadata = {
    title: "貸し借り追加",
    description: "貸し借りの追加フォーム",
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