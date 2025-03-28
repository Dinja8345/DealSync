import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import { getUserInfo } from "@/lib/actions/userActions";

export const metadata: Metadata = {
  title: "貸し借り追加",
  description: "貸し借りの追加フォーム",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserInfo();

  return (
    <html lang="ja">
      <body>
        <UserProvider initUser={user}>{children}</UserProvider>
      </body>
    </html>
  );
}
