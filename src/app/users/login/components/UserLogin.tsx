"use client";

import Form from "@/components/Form";
import { useUser } from "@/context/UserContext";
import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/lib/actions/userActions";
import type { inputContent } from "@/types/form";
import type { userMsg } from "@/lib/actions/userActions";

const UserLogin = () => {
  const [id, setId] = useState<string>("");
  const router = useRouter();
  const { setUser } = useUser();

  const handleSubmit = async (
    state: any,
    formData: FormData
  ): Promise<userMsg> => {
    const result = await loginUser(state, formData);
    if (result.success) {
      setUser(result.user);
      router.push("/deals/view");
    }
    return result;
  };

  const [loginMsg, loginAction] = useActionState<userMsg, FormData>(
    handleSubmit,
    { msg: "", success: false }
  );

  const inputContents: inputContent[] = [
    {
      name: "id",
      id: "id",
      placeholder: "ユーザーid",
      inputType: "id",
      state: {
        value: id,
        setValue: setId,
      },
    },
    {
      name: "パスワード",
      id: "password",
      placeholder: "5文字以上32文字以下",
      inputType: "password",
    },
  ];

  return (
    <>
      <div className="p-10">
        <Form
          title="ログイン"
          inputContents={inputContents}
          state={loginMsg}
          action={loginAction}
        />
      </div>
    </>
  );
};
export default UserLogin;
