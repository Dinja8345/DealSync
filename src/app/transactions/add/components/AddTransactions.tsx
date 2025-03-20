"use client"

import { useState, useActionState } from 'react';

import InputCard from "@/components/InputCard";

import createItem from "@/app/transactions/add/actions/createItem";
import { inputContent } from "@/types/form";

import type { cardMsg } from "@/types/card";

const Addtransactions = () => {
  const [name, setName] = useState("");
  const [money, setMoney] = useState("");
  const [memo, setMemo] = useState("");

  const [state, createItemAction] = useActionState<cardMsg, any>(createItem, {
    msg: "",
  });

  const contents: inputContent[] = [
    {
      name: "形態",
      id: "format",
      options: ["借り", "貸し"],
    },
    {
      name: "名前",
      id: "name",
      placeholder: "相手の名前",
      inputType: "text",
      state: {
        value: name,
        setValue: setName
      }
    },
    {
      name: "金額",
      id: "money",
      placeholder: "\\",
      inputType: "number",
      state: {
        value: money,
        setValue: setMoney
      }
    },
    {
      name: "メモ",
      id: "memo",
      placeholder: "任意",
      inputType: "text",
      state: {
        value: memo,
        setValue: setMemo
      }
    },
    {
      name: "期日",
      id: "dueDate",
      placeholder: "期日",
      inputType: "date",
    },
  ];

  return (
    <div>
      <div className="flex justify-center ">
        <InputCard title="新しい記録" inputContents={contents} state={state} action={createItemAction}/>
      </div>
      <div className="flex justify-center pt-3">
        <a href="/transactions/view">一覧へ</a>
      </div>
    </div>
  );
};

export default Addtransactions;
