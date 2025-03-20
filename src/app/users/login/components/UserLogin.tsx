"use client"

import { useState, useActionState } from "react";

import loginUser from "@/app/users/login/actions/loginUser";
import Form from "@/components/Form";

import type { inputContent } from "@/types/form";
import type { userMsg } from "@/types/user";

const UserLogin = () => {
  const [email, setEmail] = useState<string>("");
	const [loginMsg, loginAction] = useActionState<userMsg,FormData>(loginUser,{ msg: "" });

  const inputContents: inputContent[] = [
    {
      name: "メールアドレス",
      id: "email",
      placeholder: "example@exp.com",
      inputType: "email",
      state: {
        value: email,
        setValue: setEmail
      }
    },
    {
      name: "パスワード",
      id: "password",
      placeholder: "5文字以上32文字以下",
      inputType: "password"
    }
  ]

  return (
    <>
      <div>ログインページ</div>
      <Form title="ログイン" inputContents={inputContents} state={loginMsg} action={loginAction} />
    </>
  );
};

export default UserLogin;