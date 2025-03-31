import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ログアウト",
  description: "仮ログアウトルート",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <body>
        {children}
      </body>
  );
}
