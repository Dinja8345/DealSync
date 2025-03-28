"use client"

import { useEffect } from "react";
import { userLogout } from "@/lib/actions/userActions";

export default function Home() {
  useEffect(() => {
    userLogout().then();
  }, []);

  return (
    <>
      <div>ログアウトしました</div>
      <a href="login">ログインページ</a>
    </>
  );
}
