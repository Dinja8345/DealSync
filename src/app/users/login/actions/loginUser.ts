"use server";

import crypto from "crypto";
import axios from "axios";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import verifyPassword from "@/app/users/api/verifyPassword";

export default async function loginUser(state: any, formData: FormData) {
  try {
    await connectDB();
    const email = formData.get("email") as string;
    const inputedPass = formData.get("password") as string;
    const storedUsers = await User.findOne({ email: email });
    if (!storedUsers) {
      return { msg: "そのメールアドレスは登録されていません" };
    }
    const storedPass = storedUsers.password;

    const isMatch: boolean = await verifyPassword(inputedPass, storedPass);
    if (isMatch) {
      const sid = crypto.randomBytes(32).toString("hex");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/session`, { sid });
      const dbRes = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`, { sid, email });
      //console.log(res.data);
      return { msg: "ログインに成功" };
    } else {
      return { msg: "メールアドレスまたはパスワードが一致していません" };
    }
  } catch (e) {
    console.error(e);
    return { msg: "ログイン中にエラーが発生しました。" };
  }
}
