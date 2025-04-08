import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザー新規登録",
  description: "新しいユーザーを登録するためのフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children};</>;
}
