"use client";

import { useState, useEffect } from "react";
import { FriendCard } from "@/components/FriendCard"; // FriendCardもTailwindでスタイルされていることを想定
import { useUser } from "@/context/UserContext";
import {
  getFriendRequests,
  isFriend,
  isUserIdExisting,
  sendFriendRequest,
} from "@/lib/actions/userActions";
import type { FriendRequest } from "@/types/user";

const FriendsManagement = () => {
  const [requestId, setRequestId] = useState("");
  const [requestStatus, setRequestStatus] = useState<{ type: 'idle' | 'error' | 'success' | 'info', message: string }>({ type: 'idle', message: "" }); // ステータスとメッセージを管理
  const [receivedRequests, setReceivedRequests] = useState<FriendRequest[]>([]);
  const [isRequestLoading, setIsRequestLoading] = useState(false);
  const { user } = useUser();

  // エラー/成功メッセージをクリアするヘルパー関数
  const clearRequestStatus = () => {
    setRequestStatus({ type: 'idle', message: '' });
  };

  // Inputが変更されたらメッセージをクリア
  useEffect(() => {
    if (requestId) {
      clearRequestStatus();
    }
  }, [requestId]);


  const sendFriendRequestHandler = async () => {
    setIsRequestLoading(true);
    setRequestStatus({ type: 'idle', message: '' }); // Reset status on new request

    try {
      if (!user) {
        setRequestStatus({ type: 'error', message: "ユーザー情報が見つかりません。" });
        return;
      }
      if (!requestId.trim()) {
          setRequestStatus({ type: 'error', message: "ユーザーIDを入力してください。" });
          return;
      }
      if (requestId === user.id) {
        setRequestStatus({ type: 'error', message: "自分自身にリクエストを送ることはできません。" });
        return; // ここで処理を終了させる
      }

      const isUserExisting = await isUserIdExisting(requestId);
      if (!isUserExisting) {
        setRequestStatus({ type: 'error', message: "入力されたIDと一致するユーザーが存在しません。" });
        return;
      }

      const alreadyFriend = await isFriend(user.friends, requestId);
      if (alreadyFriend) {
        setRequestStatus({ type: 'info', message: `ユーザー (${alreadyFriend}) は既にフレンドです。`}); // Use 'info' type
        return;
      }

      const res = await sendFriendRequest(user.id, requestId);

      // すでに同じリクエストが存在したとき
      if (res?.error === "Conflict") {
        setRequestStatus({ type: 'info', message: "そのユーザーにはすでにリクエストを送信済みです。" }); // Use 'info' type
      } else if (res?.newFriendRequest) {
        setRequestStatus({ type: 'success', message: "フレンドリクエストを送信しました。" });
        setRequestId("");
      } else {
        setRequestStatus({ type: 'error', message: "リクエスト送信中にエラーが発生しました。" });
      }

    } catch (error) {
        console.error("Error sending friend request:", error);
        setRequestStatus({ type: 'error', message: "予期せぬエラーが発生しました。" });
    } finally {
      setIsRequestLoading(false);
    }
  };

  useEffect(() => {
    if (user?._id) {
      getFriendRequests(user._id)
        .then((result) => {
          if (result) {
             setReceivedRequests(result);
          } else {
             setReceivedRequests([]);
          }
        })
        .catch(error => {
           console.error("Failed to fetch friend requests:", error);
           setReceivedRequests([]);
        });
    } else {
      setReceivedRequests([]);
    }
  }, [user]);

  const getStatusMessageClass = () => {
    switch (requestStatus.type) {
      case 'error':
        return 'text-red-600';
      case 'success':
        return 'text-green-600';
      case 'info':
          return 'text-blue-600';
      default:
        return 'text-gray-500';
    }
  };


  return (
    // 全体を囲むコンテナ: 中央寄せ、最大幅、背景、影、パディング
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6 sm:p-8 my-8">
      {/* メインタイトル */}
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        フレンド管理
      </h1>

      {/* フレンド一覧セクション */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">
          フレンド一覧
        </h2>
        <div className="space-y-4">
          {user?.friends && user.friends.length > 0 ? (
            user.friends.map((friend) => (
              <FriendCard
                key={friend.id}
                friendId={friend.id}
                familyName={friend.familyName}
                firstName={friend.firstName}
                iconUrl={friend.iconUrl}
                // isFriendCard={true} // 必要であればFriendCard側でスタイルを分けるためのprop
              />
            ))
          ) : (
            <p className="text-gray-500 italic pl-4">現在、フレンドはいません。</p>
          )}
        </div>
      </div>

      {/* フレンドリクエストセクション */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-700 border-b pb-2 mb-6">
          フレンドリクエスト
        </h2>

        {/* 受信したリクエスト */}
        <div className="mb-8">
          <h3 className="text-xl font-medium text-gray-600 mb-4">
            受信したリクエスト
          </h3>
          <div className="space-y-4">
            {receivedRequests.length > 0 ? (
              receivedRequests.map((request) => (
                <FriendCard
                  key={request._id} // MongoDBの_idをkeyに
                  request_id={request._id} // FriendCardに渡すrequestのID
                  friendId={request.sender.id}
                  familyName={request.sender.familyName}
                  firstName={request.sender.firstName}

                  requestDate={request.createdAt}
                  // isRequestCard={true} // 必要であればFriendCard側でスタイルを分けるためのprop
                />
              ))
            ) : (
              <p className="text-gray-500 italic pl-4">現在、受信したリクエストはありません。</p>
            )}
          </div>
        </div>

        {/* リクエスト送信フォーム */}
        <div>
          <h3 className="text-xl font-medium text-gray-600 mb-4">
            リクエスト送信
          </h3>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <input
              type="text"
              className="flex-grow block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={requestId}
              placeholder="リクエストするユーザーのID"
              onChange={(e) => setRequestId(e.target.value)}
              aria-label="リクエストするユーザーのID" // アクセシビリティ向上のため
            />
            <button
              className={`inline-flex justify-center items-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white whitespace-nowrap flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${ // ★ whitespace-nowrap と flex-shrink-0 を追加
                isRequestLoading
                  ? "bg-gray-400 cursor-not-allowed" // ローディング中/無効状態
                  : "bg-indigo-600 hover:bg-indigo-700" // 通常/ホバー状態
              }`}
              onClick={sendFriendRequestHandler}
              disabled={isRequestLoading}
            >
              {isRequestLoading ? (
                <>
                  {/* ローディングスピナー */}
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  送信中...
                </>
              ) : (
                "送信"
              )}
            </button>
          </div>
           {/* ステータスメッセージ */}
           {requestStatus.message && (
            <p className={`mt-3 text-sm ${getStatusMessageClass()}`}>
              {requestStatus.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendsManagement;