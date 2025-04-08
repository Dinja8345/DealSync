"use client";

import InputCard from "@/components/InputCard";
import Modal from "@/components/Modal";
import { useState, useEffect, useActionState } from "react";
import { addDeal } from "@/lib/actions/dealActions";
import { inputContent } from "@/types/form";
import { useUser } from "@/context/UserContext";

import type { cardMsg, formats } from "@/types/card";

const Addtransactions = () => {
  const [format, setFormat] = useState<formats>("貸し");
  const [name, setName] = useState("");
  const [money, setMoney] = useState("");
  const [memo, setMemo] = useState("");
  const [lenderId, setLenderId] = useState("");
  const [borrowerId, setBorrowerId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const { user } = useUser();

  const handleAdd = async(msg: cardMsg, formData: FormData) => {
    formData.append("registrantId", user?.id as string);
    const result = await addDeal(msg, formData);
    return result;
  }  

  const [msg, createItemAction, isPending] = useActionState<cardMsg, any>(
    handleAdd,
    {
      msg: "",
    }
  );

  useEffect(() => {
    if (format == "貸し") {
      setLenderId(user?.id as string);
      setBorrowerId("");
    } else if (format == "借り") {
      setBorrowerId(user?.id as string);
      setLenderId("");
    }
  }, [format]);

  const contents: inputContent[] = [
    {
      name: "形態",
      id: "format",
      options: ["貸し", "借り"],
      state: {
        value: format,
        setValue: setFormat,
      },
    },
    {
      name: "名前",
      id: "name",
      placeholder: "相手の名前",
      inputType: "text",
      state: {
        value: name,
        setValue: setName,
      },
    },
    {
      name: "金額",
      id: "money",
      placeholder: "\\",
      inputType: "number",
      state: {
        value: money,
        setValue: setMoney,
      },
    },
    {
      name: "メモ",
      id: "memo",
      placeholder: "任意",
      inputType: "text",
      state: {
        value: memo,
        setValue: setMemo,
      },
    },
    {
      name: "貸す",
      id: "lenderId",
      placeholder: "貸す人のid(任意)",
      inputType: "input",
      areaDisabled: format === "貸し",
      readOnly: format === "貸し",
      state: {
        value: lenderId,
        setValue: setLenderId,
      },
    },
    {
      name: "借りる",
      id: "borrowerId",
      placeholder: "借りる人のid(任意)",
      inputType: "input",
      areaDisabled: format === "借り",
      readOnly: format === "借り",
      state: {
        value: borrowerId,
        setValue: setBorrowerId,
      },
    },
    {
      name: "期日",
      id: "dueDate",
      placeholder: "期日",
      inputType: "date",
      state: {
        value: dueDate,
        setValue: setDueDate,
      },
    },
  ];

  return (
    <div>
      {isPending ? (
        <Modal isOpen={isPending}>
          <div>送信中</div>
        </Modal>
      ) : (
        <>
          <div className="flex justify-center">
            <InputCard
              title="新しい記録"
              inputContents={contents}
              state={msg}
              action={createItemAction}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Addtransactions;
