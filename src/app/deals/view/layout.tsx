import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import { getUserInfo } from "@/lib/actions/userActions";

export const metadata: Metadata = {
  title: "貸し借り一覧",
  description: "貸し借りの一覧を確認できます",
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
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
