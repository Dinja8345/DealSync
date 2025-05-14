"use client"

import Form from "@/components/Form";
import { useState, useActionState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/actions/userActions';
import { useUser } from "@/context/UserContext";
import type { inputContent } from "@/types/form";
import type { userMsg } from "@/lib/actions/userActions";
import type { sexTypes } from "@/types/user";

const CreateUsers = () => {
  const router = useRouter();
  const { user, setUser } = useUser();

  const handleSubmit = async(state: any, formData: FormData): Promise<userMsg> =>{
    const result = await createUser(state, formData);
    if(result.success){
      setUser(result.user);
    } 
      
    return result;
  }

  const [familyName, setFamilyName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [sex, setSex] = useState<sexTypes>("男性");
  const [email, setEmail] = useState<string>("");
  const [id, setId] = useState<string>("");

  const [state, createUserAction, isPending] = useActionState<userMsg, any>(handleSubmit,
    {
      msg: "",
      success: false
    }
  )

  useEffect(() => {
    console.log();
    if(user){
      router.push("/deals/view");
    }
  },[user])

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
      state: {
        value: sex,
        setValue: setSex
      }
    }
  ];

  return (
    <div className="flex justify-center">
      <div className="w-xl">
        <Form state={state} action={createUserAction} title="ユーザー新規登録" inputContents={contents} btnText="登録" />
      </div>
    </div>
  );
};

export default CreateUsers;
