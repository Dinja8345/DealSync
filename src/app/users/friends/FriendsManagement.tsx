"use client";

import { useState } from "react";
import { FriendCard } from "@/components/FriendCard";
import { useUser } from "@/context/UserContext";
import {
  isFriend,
  isUserIdExisting,
  sendFriendRequest,
} from "@/lib/actions/userActions";

const FriendsManagement = () => {
  const [requestId, setRequestId] = useState("");
  const [requestErrorMsg, setRequestErrorMsg] = useState("");
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const { user } = useUser();

  const sendFriendRequestHandler = async () => {
    setIsRequestLoading(true);
    try {
      if (requestId === user?.id) {
        setRequestErrorMsg("このidはあなたのidです");
      } else {
        const isUserExisting = await isUserIdExisting(requestId);
        if (isUserExisting && user) {
          const result = await isFriend(user.friends, requestId);

          if (!result) {
            const res = await sendFriendRequest(user.id, requestId);
            console.log(res);

            if (res?.error === "Conflict") {
              setRequestErrorMsg(
                "そのユーザーにはすでにリクエストを送信しています。"
              );
            } else if (res?.newFriendRequest) {
              setRequestErrorMsg("フレンドリクエストを送信しました。");
            } else {
              setRequestErrorMsg("リクエスト送信中にエラー。");
            }
          } else {
            setRequestErrorMsg(result + "このユーザーはすでにフレンドです。");
          }
        } else {
          setRequestErrorMsg("入力されたidと一致するユーザーが存在しません。");
        }
      }
      // requestIdと一致するuserがいればフレンドリクエストをdbに登録
    } finally {
      setIsRequestLoading(false);
    }
  };

  const inputClass =
    "flex-[5] bg-teal-50 rounded-sm outline-2 outline-zinc-400 ";
  const buttonClass = "flex-1 rounded-md font-bold text-white w-30 ";

  return (
    <div>
      <div className="flex items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 p-5 pb-2">フレンド管理</h1>
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 p-5 pb-2">フレンド一覧</h2>
        {user?.friends.map((friend) => {
          return (
            <FriendCard
              key={friend.id}
              userId={friend.id}
              familyName={friend.familyName}
              firstName={friend.firstName}
            />
          );
        })}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-4 p-5 pb-2">フレンドリクエスト</h2>
        <div className="flex mx-10 gap-2">
          <input
            type="text"
            className={inputClass}
            value={requestId}
            placeholder="リクエストするユーザーのid"
            onChange={(e) => setRequestId(e.target.value)}
          />
          <button
            className={
              buttonClass +
              (isRequestLoading ? " bg-gray-500" : " bg-indigo-600")
            }
            onClick={sendFriendRequestHandler}
            disabled={isRequestLoading}
          >
            {isRequestLoading ? "送信中" : "送信"}
          </button>
        </div>
        <div className="mx-10">{requestErrorMsg}</div>
      </div>
    </div>
  );
};

export default FriendsManagement;
