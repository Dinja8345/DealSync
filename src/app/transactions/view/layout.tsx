import type { Metadata } from "next";

export const metadata : Metadata = {
    title: "貸し借り一覧",
    description: "貸し借りの一覧を確認できます",
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