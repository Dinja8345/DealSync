import type { Metadata } from "next";
import '@/app/globals.css';

export const metadata: Metadata = {
  title: "テスト",
  description: "開発用",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <body>{children}</body>;
}
