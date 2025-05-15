import FriendsManagement from "./components/FriendsManagement";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'フレンド管理',
  description: 'フレンドの情報を確認したり、フレンドリクエストを送ることができます。',
}

export default function Home(){
  return (
    <FriendsManagement />
  );
};
