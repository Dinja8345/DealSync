"use client";

import UserIcon from "@/components/UserIcon";
import { useUser } from "@/context/UserContext";

export default function Home() {
  const { user } = useUser();

  if (!user) {
    return <div>ログインしてください</div>;
  }

  return (
    <div className="mt-4">
      <div className="flex justify-center">
        <UserIcon
          familyName={user.familyName}
          firstName={user.firstName}
          iconUrl={user.iconUrl}
          custumIconClass={"w-48 h-48 text-6xl"}
          textPadding="px-5"
        />
      </div>
      <div className="flex justify-center">
        <div className="text-2xl font-bold">{user.familyName + " " + user.firstName}</div>
      </div>
      <form action=""></form>
    </div>
  );
}
