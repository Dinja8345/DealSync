import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ユーザーログイン",
  description: "ログインフォーム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <body>{children};</body>;
}
