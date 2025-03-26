"use server";

import axios from "axios";
import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import hashPassword from "@/lib/hashPassword";
import verifyPassword from "@/lib/verifyPassword";
import User from "@/models/User";
import { cookies } from "next/headers";

import type { sexTypes } from "@/types/user";

const getUserInfo = async () => {
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid");

  const sessionDbData = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`,
    {
      headers: {
        "Content-Type": "application/json",
        "sid": sid?.value,
      },
    }
  );

  const id = sessionDbData.data.id;

  if (!id) {
    throw new Error("sidに該当するidが存在しません");
  }

  const userData = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
    {
      headers: {
        "Content-Type": "application/json",
        "id": id,
      },
    }
  );

  const user = userData.data.user;
  
  if(!user){
    throw new Error("idに該当するuserが存在しません");
  }

  return user;

};



const createUser = async(state: any, formData: FormData) => {
  const familyName = formData.get("familyName") as string;
  const firstName = formData.get("firstName") as string;
  const sex = formData.get("sex") as sexTypes;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const id = formData.get("id") as string;

  if (familyName === "") {
    return { msg: "姓が未入力です" };
  } else if (firstName === "") {
    return { msg: "名が未入力です" };
  } else if (email === "") {
    return { msg: "メールアドレスが未入力です" };
  } else if (password === "") {
    return { msg: "パスワードが未入力です" };
  } else if (id === ""){
    return { msg: "idが未入力です" };
  }

  if (password.length < 5) {
    return { msg: "パスワードは5字以上である必要があります" };
  } else if (password.length > 32) {
    return { msg: "パスワードは32字以下である必要があります" };
  }

  const hashedPass = await hashPassword(password);

  try {    
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`, { familyName, firstName, sex, email, password: hashedPass, id });
    
    const sid = crypto.randomBytes(32).toString("hex");
      (await cookies()).set('sid',sid,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24時間
        path: "/"
      });

    const dbRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`, { sid, id });

    return { msg: "登録に成功しました" };
  } catch (e) {
    console.error(e);
    return { msg: "登録に失敗しました" };
  }
}



const loginUser = async(state: any, formData: FormData) => {
  try {
    await connectDB();
    const id = formData.get("id") as string;
    const inputedPass = formData.get("password") as string;
    const storedUser = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,{
      headers: {
        "Content-Type": "application/json",
        "id": id
      },
    });
    console.log(storedUser.data);
    if (!storedUser.data.user) {
      return { msg: "そのidは登録されていません" };
    }
    const storedPass = storedUser.data.user.password;

    const isMatch: boolean = await verifyPassword(inputedPass, storedPass);
    if (isMatch) {
      const sid = crypto.randomBytes(32).toString("hex");
      (await cookies()).set('sid',sid,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24時間
        path: "/"
      });

      const dbRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`, { sid, id });
      
      return { msg: "ログインに成功" };
    } else {
      return { msg: "idまたはパスワードが一致していません" };
    }
  } catch (e) {
    console.error(e);
    return { msg: "ログイン中にエラーが発生しました。" };
  }
}

export { getUserInfo, createUser, loginUser };
