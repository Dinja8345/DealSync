import Navbar from "@/components/Navbar";
import type { Metadata } from "next";
import { UserProvider } from "@/context/UserContext";
import { getUserInfo } from "@/lib/actions/userActions";
import "./globals.css";

export const metadata: Metadata = {
  title: "ホーム画面",
  description: "DealSync(仮のホームページ)",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  const user = await getUserInfo();

  return (
    <UserProvider initUser={user}>
      <html lang="ja">
        <body>
          <div className="pt-[90px]">{children}</div>
          <Navbar />
        </body>
      </html>
    </UserProvider>
  );
}
