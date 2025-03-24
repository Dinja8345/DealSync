"use server";

import axios from "axios";
import crypto from "crypto";
import { cookies } from "next/headers";
import hashPassword from "@/app/users/api/hashPassword";

import type { sexTypes } from "@/types/user";

export default async function createUser(state: any, formData: FormData) {
  const familyName = formData.get("familyName") as string;
  const firstName = formData.get("firstName") as string;
  const sex = formData.get("sex") as sexTypes;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (familyName === "") {
    return { msg: "姓が未入力です" };
  } else if (firstName === "") {
    return { msg: "名が未入力です" };
  } else if (email === "") {
    return { msg: "メールアドレスが未入力です" };
  } else if (password === "") {
    return { msg: "パスワードが未入力です" };
  }

  if (password.length < 5) {
    return { msg: "パスワードは5字以上である必要があります" };
  } else if (password.length > 32) {
    return { msg: "パスワードは32字以下である必要があります" };
  }

  const hashedPass = await hashPassword(password);

  try {    
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`, { familyName, firstName, sex, email, password: hashedPass });
    
    const sid = crypto.randomBytes(32).toString("hex");
      (await cookies()).set('sid',sid,{
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24時間
        path: "/"
      });

    const dbRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`, { sid, email });

    return { msg: "登録に成功しました" };
  } catch (e) {
    console.error(e);
    return { msg: "登録に失敗しました" };
  }
}
