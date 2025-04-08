"use client"

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(undefined);
  })

  return (
    <>  
      <div>ログアウトしました</div>
    </>
  );
}
