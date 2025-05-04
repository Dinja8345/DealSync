import React, { useEffect, useState } from "react";
import { addUserFriend, deleteFriend, deleteFriendRequest, getUserInfo } from "@/lib/actions/userActions";
import { useUser } from "@/context/UserContext";
import { calcUnpaidNetBalanceWithUser } from "@/lib/actions/dealActions";
import { motion, AnimatePresence } from "framer-motion";

type FriendCardProps = {
  friendId: string;
  familyName: string;
  firstName: string;
  requestDate?: Date;
  request_id?: string;
};

export const FriendCard: React.FC<FriendCardProps> = ({
  friendId,
  familyName,
  firstName,
  requestDate,
  request_id,
}) => {
  const [price, setPrice] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, setUser } = useUser();

  const acceptFriendRequest = async () => {
    if (user) {
      await addUserFriend(user.id, friendId);
    }
    await deleteFriendRequest(request_id as string);

    const updatedUser = await getUserInfo();
    setUser(updatedUser);
  };

  const declineFriendRequest = async () => {
    await deleteFriendRequest(request_id as string);

    const updatedUser = await getUserInfo();
    setUser(updatedUser);
  };

  const deleteFriendHandler = async() => {
    if(user){
      console.log(user.id, friendId);
      await deleteFriend(user.id, friendId);

      const updatedUser = await getUserInfo();
      setUser(updatedUser);
    }
  }

  useEffect(() => {
    const fetchBalance = async () => {
      if (user?.id) {
        const balance = await calcUnpaidNetBalanceWithUser(user.id, friendId);
        setPrice(balance);
      }
    };

    fetchBalance();
  }, [user]);

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
            <span className="text-sm text-gray-500">ID: {friendId}</span>
          </div>
        </div>

        {/* 右側：requestDate の有無で切り替え */}
        {requestDate ? (
          <div className="flex flex-col items-end justify-between h-full min-h-[64px]">
            {/* 承諾・拒否ボタン */}
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

            {/* 日付表示 */}
            <div className="text-sm text-gray-500">
              {new Date(requestDate).toLocaleDateString("ja-JP", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-end justify-between h-full min-h-[64px] relative">
            {/* 三点リーダー */}
            <button
              className="mb-2 w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 flex items-center justify-center"
              onClick={() => setIsMenuOpen((prev) => !prev)}
            >
              ⋯
            </button>

            {/* スライドメニュー */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-10 right-0 bg-white border border-gray-200 shadow-lg rounded-md w-32 z-10"
                >
                  <button
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      deleteFriendHandler();
                      setIsMenuOpen(false);
                    }}
                  >
                    削除
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 金額表示 */}
            <div className="text-sm text-gray-500">
              未返済貸し借りの総額: ¥{price ?? "0"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
