"use client"

import { useState, useActionState } from 'react';

import Form from "@/components/Form";

import { createUser } from '@/lib/actions/userActions';

import type { inputContent } from "@/types/form";
import type { userMsg } from "@/types/user";

const CreateUsers = () => {
  const [state, createUserAction, isPending] = useActionState<userMsg, any>(createUser,
    {
      msg: ""
    }
  )
  
  const [familyName, setFamilyName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  //const [sex, setSex] = useState<sexTypes>("男性");
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<string>("");

  const contents: inputContent[] = [
    {
      name: "ID",
      id: "id",
      placeholder: "他のユーザーと重複不可能",
      inputType: "text",
      state: {
        value: id,
        setValue: setId
      }
    },
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
      placeholder: "5字以上32字以下",
      inputType: "password"
    },
    {
      name: "姓",
      id: "familyName",
      placeholder: "例) 山田",
      inputType: "text",
      state: {
        value: familyName,
        setValue: setFamilyName
      }
    },
    {
      name: "名",
      id: "firstName",
      placeholder: "太郎",
      inputType: "text",
      state: {
        value: firstName,
        setValue: setFirstName
      }
    },
    {
      name: "性別",
      id: "sex",
      options: ["男性","女性","その他"],
      // state: {
      //   value: sex,
      //   setValue: setSex
      // }
    }
  ];

  return (
    <div className="flex justify-center">
      <div className="w-xl">
        <Form state={state} action={createUserAction} title="ユーザー新規登録" inputContents={contents} />
      </div>
    </div>
  );
};

export default CreateUsers;
