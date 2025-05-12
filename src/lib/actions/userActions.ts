"use server";

import axios, { AxiosError } from "axios";
import crypto from "crypto";
import hashPassword from "@/lib/hashPassword";
import verifyPassword from "@/lib/verifyPassword";
import { cookies } from "next/headers";
import type { Friend, sexTypes, User } from "@/types/user";

// ログインしているユーザの情報を取得
const getUserInfo = async () => {
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid");

  if (!sid?.value) {
    return null;
  }

  const sessionDbData = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`,
    {
      headers: {
        "Content-Type": "application/json",
        sid: sid?.value,
      },
    }
  );

  const id = sessionDbData.data.id;

  if (!id) {
    return;
    //throw new Error("sidに該当するidが存在しません");
  }

  const userData = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
    {
      headers: {
        "Content-Type": "application/json",
        query: "idToUser",
        id: id,
      },
    }
  );

  const user = userData.data.user;

  if (!user) {
    throw new Error("idに該当するuserが存在しません");
  }

  return user;
};

interface userMsg {
  msg: string;
  success: boolean;
  user?: User;
}

// ユーザ登録
const createUser = async (state: any, formData: FormData): Promise<userMsg> => {
  const familyName = formData.get("familyName") as string;
  const firstName = formData.get("firstName") as string;
  const sex = formData.get("sex") as sexTypes;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const id = formData.get("id") as string;

  if (familyName === "") {
    return { msg: "姓が未入力です", success: false };
  } else if (firstName === "") {
    return { msg: "名が未入力です", success: false };
  } else if (email === "") {
    return { msg: "メールアドレスが未入力です", success: false };
  } else if (password === "") {
    return { msg: "パスワードが未入力です", success: false };
  } else if (id === "") {
    return { msg: "idが未入力です", success: false };
  }

  if (password.length < 5) {
    return { msg: "パスワードは5字以上である必要があります", success: false };
  } else if (password.length > 32) {
    return { msg: "パスワードは32字以下である必要があります", success: false };
  }

  const hashedPass = await hashPassword(password);

  try {
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`, {
      familyName,
      firstName,
      sex,
      email,
      password: hashedPass,
      id,
    });

    const sid = crypto.randomBytes(32).toString("hex");
    (await cookies()).set("sid", sid, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 3,// ３日間
      path: "/",
    });

    const dbRes = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`,
      { sid, id }
    );
    return { msg: "登録に成功", success: true };
  } catch (e) {
    console.error(e);
    return { msg: "登録に失敗しました", success: false };
  }
};

// ユーザログイン
const loginUser = async (state: any, formData: FormData): Promise<userMsg> => {
  try {
    const id = formData.get("id") as string;
    const inputedPass = formData.get("password") as string;
    const storedUser = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
      {
        headers: {
          "Content-Type": "application/json",
          query: "idToUser",
          id: id,
        },
      }
    );

    //console.log(storedUser.data);

    if (!storedUser.data.user) {
      return { msg: "そのidは登録されていません", success: false };
    }
    const storedPass = storedUser.data.user.password;

    const isMatch: boolean = await verifyPassword(inputedPass, storedPass);
    if (isMatch) {
      const sid = crypto.randomBytes(32).toString("hex");
      (await cookies()).set("sid", sid, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 3, // 3日間
        path: "/",
      });

      const dbRes = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`,
        { 
          query: "createSession",
          sid,
          id
        }
      );
    } else {
      return { msg: "idまたはパスワードが一致していません", success: false };
    }

    return { msg: "ログイン完了", success: true, user: storedUser.data.user };
  } catch (e) {
    console.error(e);
    return { msg: "ログイン中にエラーが発生しました。", success: false };
  }
};

// dbから全てのuser情報を配列にして返す
const getAllUsersInfo = async (): Promise<User[]> => {
  const allUsersData = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
    {
      headers: {
        "Content-Type": "application/json",
        query: "all",
      },
    }
  );

  const allUsers = allUsersData.data.user;
  return allUsers;
};

// 渡された2つのidのフレンドにお互いを追加する
const addUserFriend = async (userId: string, otherUserId: string) => {
  try {
    const isUserExisting = await isUserIdExisting(userId);
    const isOtherUserExisting = await isUserIdExisting(otherUserId);

    if (isUserExisting && isOtherUserExisting) {
      const userData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
        {
          headers: {
            "Content-Type": "application/json",
            query: "idToUser",
            id: userId,
          },
        }
      );

      const otherUserData = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
        {
          headers: {
            "Content-Type": "application/json",
            query: "idToUser",
            id: otherUserId,
          },
        }
      );

      const userObjectId = userData.data.user._id;
      const otherUserObjectId = otherUserData.data.user._id;

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`, {
        query: "addFriend",
        userObjectId: userObjectId,
        otherUserObjectId: otherUserObjectId,
      });
    } else {
      console.log("どちらかのidが存在しません");
    }
  } catch (e) {
    console.log(e);
  }
};

interface Msg {
  message?: string;
  error?: string;
  newFriendRequest?: {
    _id: string;
    sender: string;
    receiver: string;
    createdAt?: string;
  };
}


// フレンドリクエストをdbに登録
const sendFriendRequest = async (
  senderId: string,
  receiverId: string
): Promise<Msg | undefined> => {
  try {
    const senderUserData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
      {
        headers: {
          "Content-Type": "application/json",
          query: "idToUser",
          id: senderId,
        },
      }
    );
    const sender = senderUserData.data.user;

    const receiverData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
      {
        headers: {
          "Content-Type": "application/json",
          query: "idToUser",
          id: receiverId,
        },
      }
    );
    const receiver = receiverData.data.user;

    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/friendRequest`,
      {
        sender: sender._id,
        receiver: receiver._id,
      }
    );

    return res.data;
  } catch (e) {
    const err = e as AxiosError<Msg>;
    if (err.response?.data) return err.response.data;
    console.log(e);
    return undefined;
  }
};


// フレンドリクエストを取得
const getFriendRequests = async (_id: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/friendRequest`,
      {
        headers: {
          "Content-Type": "application/json",
          _id: _id,
        },
      }
    );

    return res.data.friendRequests;
  } catch (e) {
    console.error(e);
  }
};

//　フレンドリクエストを削除
const deleteFriendRequest = async(_id: string) => {
  try {
    const payload = {
      _id: _id,
    };

    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/friendRequest`,
      {
        data: payload,
      }
    );

    return res.data;
  } catch (e) {
    console.log(e);
  }
};


export interface deleteMsg{
  success: boolean;
  msg: string;
}

// お互いのフレンドから削除
const deleteFriend = async(requesterId: string, targetId: string): Promise<deleteMsg> => {

  try{
    
    const isRequesterExisting = await isUserIdExisting(requesterId);
    if(!isRequesterExisting){
      return { success: false, msg: "エラー: あなたのidが存在しません。" };
    }

    const isTargetExisting = await isUserIdExisting(targetId);
    if(!isTargetExisting){
      return { success: false, msg: "指定された相手のidが存在しません。" };
    }

    const requesterInfo = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
      {
        headers: {
          "Content-Type": "application/json",
          query: "idToUser",
          id: requesterId
        }
      }
    );

    const requesterFriends = requesterInfo.data.user.friends;

    const targetInfo = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
      {
        headers: {
          "Content-Type": "application/json",
          query: "idToUser",
          id: targetId
        }
      }
    );

    const targetFriends = targetInfo.data.user.friends;

    const result = await axios.put(
       `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,{
        query: "deleteFriend",
        requesterId: requesterId, 
        targetId: targetId,
        requesterFriends: requesterFriends,
        targetFriends: targetFriends
       });

    return { success: true, msg: "フレンド削除に成功しました。" };
  }catch(e){
    console.log(e);
    return { success: false, msg: "フレンド削除中にエラー" };
  }
}

const getSid = async(): Promise<string | undefined> => {
  const sidData = (await cookies()).get("sid");
  return sidData?.value;
}

const userLogout = async (sid: string) => {
  try{
    if(sid){
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`,
          {
            query: "deleteSession",
            sid: sid
          }
      );
    }
  
    (await cookies()).delete("sid");
  }catch(e){
    console.log(e);
  }
};

// 受け取ったidから全てのuser.idを走査し、一致するものがあるかを返す
const isUserIdExisting = async (id: string): Promise<boolean> => {
  const users = await getAllUsersInfo();
  return users.some((user) => user.id === id);
};

// すでにフレンドかどうかを返す
const isFriend = (myFriends: Friend[], targetId: string): boolean => {
  return myFriends.some((friend) => {
    return friend.id === targetId;
  });
};

export {
  getUserInfo,
  getSid,
  createUser,
  loginUser,
  userLogout,
  getAllUsersInfo,
  addUserFriend,
  isUserIdExisting,
  isFriend,
  sendFriendRequest,
  getFriendRequests,
  deleteFriendRequest,
  deleteFriend,
};
export type { userMsg };
