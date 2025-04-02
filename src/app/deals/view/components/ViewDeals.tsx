"use client";

import Modal from "@/components/Modal";
import Form from "@/components/Form";
import OutputCard from "@/components/OutputCard";
import { useState, useEffect, useActionState } from "react";
import { getCardsInfo, editDeal } from "@/lib/actions/dealActions";
import { getUserInfo } from "@/lib/actions/userActions";

import type { outputContent } from "@/types/card";
import type { userMsg } from "@/lib/actions/userActions";

const ViewDeals = () => {
  const [contents, setContents] = useState<outputContent[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<outputContent | undefined>();
  const [modalName, setModalName] = useState<string>("");
  const [modalFormat, setModalFormat] = useState<string>("");
  const [modalMoney, setModalMoney] = useState<string>("");
  const [modalDueDate, setModalDueDate] = useState<string>("");
  const [modalMemo, setModalMemo] = useState<string>("");

  const handleEdit = async(msg: userMsg, formData: FormData) => {
    formData.append("_id", modalContent?._id as string);
    const result = await editDeal(msg, formData);
    console.log(result);
    if(result.success === true){
      setIsOpen(false);
      console.log(isOpen);
    }
    return result;
  }

  const [editMsg, editAction] = useActionState<userMsg, FormData>(handleEdit, {
    msg: "",
    success: false,
  });

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      const deals = await getCardsInfo(user.id);
      setContents(deals);
      return deals;
    };

    fetchData().then((deals) => {
      console.log(deals);
    });
  }, [isOpen]);

  useEffect(() => {
    if (modalContent) {
      setModalFormat(modalContent.format);
      setModalName(modalContent.name);
      setModalMoney(modalContent.money);
      setModalMemo(modalContent.memo);
      setModalDueDate(modalContent.dueDate);
    }
  }, [modalContent]);

  const modalOutputContents = [
    {
      name: "形態",
      id: "format",
      options: ["貸し", "借り"],
      state: {
        value: modalFormat,
        setValue: setModalFormat,
      },
    },
    {
      name: "名前",
      id: "name",
      placeholder: "相手の名前",
      inputType: "text",
      state: {
        value: modalName,
        setValue: setModalName,
      },
    },
    {
      name: "金額",
      id: "money",
      placeholder: "\\",
      inputType: "number",
      state: {
        value: modalMoney,
        setValue: setModalMoney,
      },
    },
    {
      name: "メモ",
      id: "memo",
      placeholder: "任意",
      inputType: "text",
      state: {
        value: modalMemo,
        setValue: setModalMemo,
      },
    },
    {
      name: "期日",
      id: "dueDate",
      placeholder: "期日",
      inputType: "date",
      state: {
        value: modalDueDate,
        setValue: setModalDueDate,
      },
    },
  ];

  return (
    <>
      <OutputCard
        contents={contents}
        openModal={openModal}
        setModalContent={setModalContent}
      />
      <div className="flex justify-center pt-3">
        <a href="/deals/add">新規作成</a>
      </div>
      <Modal isOpen={isOpen} closeModal={closeModal}>
        <Form
          title="貸し借り編集"
          formClass=""
          inputContents={modalOutputContents}
          state={editMsg}
          action={editAction}
        ></Form>
      </Modal>
    </>
  );
};

export default ViewDeals;
