"use client"

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { setUser } = useUser();

  useEffect(() => {
    setUser(undefined);
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">ログアウトしました</h1>
        <p className="text-gray-600">
          セッションが正常に終了しました。
        </p>
        <div className="mt-6">
          <a
            href="/users/login" // ログインページへのリンク
            className="inline-block px-6 py-2 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-200"
          >
            ログインページへ
          </a>
        </div>
      </div>
    </div>
  );
}
