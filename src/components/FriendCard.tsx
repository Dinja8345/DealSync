import React from "react";
import { addUserFriend, deleteFriendRequest } from "@/lib/actions/userActions";
import { useUser } from "@/context/UserContext";

type FriendCardProps = {
  userId: string;
  familyName: string;
  firstName: string;
  requestDate?: Date;
  request_id?: string;
};

export const FriendCard: React.FC<FriendCardProps> = ({
  userId,
  familyName,
  firstName,
  requestDate,
  request_id,
}) => {
  const { user } = useUser();

  const acceptFriendRequest = async () => {
    if (user) {
      await addUserFriend(user.id, userId);
    }
    await deleteFriendRequest(request_id as string);
  };

  const declineFriendRequest = async () => {
    await deleteFriendRequest(request_id as string);
  };

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-md mx-auto mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center h-full">
        {/* 左側：ユーザー情報 */}
        <div className="flex items-center gap-4 h-full">
          <div className="bg-blue-100 text-blue-800 font-bold rounded-full h-12 w-12 flex items-center justify-center text-xl">
            {familyName[0]}
            {firstName[0]}
          </div>
          <div className="flex flex-col justify-center h-full">
            <span className="text-lg font-semibold">
              {familyName} {firstName}
            </span>
            <span className="text-sm text-gray-500">ID: {userId}</span>
          </div>
        </div>

        {/* 右側：ボタンと日付/金額 */}
        <div className="flex flex-col items-end justify-center h-full">
          {requestDate && (
            <div className="flex gap-2 mb-1">
              <button
                className="w-8 h-8 rounded-2xl bg-green-500 text-white flex items-center justify-center hover:bg-green-600"
                onClick={acceptFriendRequest}
              >
                ○
              </button>
              <button
                className="w-8 h-8 rounded-2xl bg-red-500 text-white flex items-center justify-center hover:bg-red-600"
                onClick={declineFriendRequest}
              >
                ×
              </button>
            </div>
          )}
          <div className="text-sm text-gray-500">
            {requestDate ? (
              new Date(requestDate).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })
            ) : (
              <>貸し借りの総額: ¥0</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
