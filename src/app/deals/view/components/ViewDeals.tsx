"use client";

import Modal from "@/components/Modal";
import Form from "@/components/Form";
import OutputCard from "@/components/OutputCard";
import { useState, useEffect, useActionState } from "react";
import { getCardsInfo, editDeal, deleteDeal } from "@/lib/actions/dealActions";
import { getUserInfo } from "@/lib/actions/userActions";
import { useUser } from "@/context/UserContext";

import type { deal } from "@/types/card";
import type { userMsg } from "@/lib/actions/userActions";

const ViewDeals = () => {
  const [contents, setContents] = useState<deal[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deleteContentId, setDeleteContentId] = useState<string>("");
  const [modalContent, setModalContent] = useState<deal | undefined>();
  const [modalName, setModalName] = useState<string>("");
  const [modalFormat, setModalFormat] = useState<string>("");
  const [modalMoney, setModalMoney] = useState<string>("");
  const [modalDueDate, setModalDueDate] = useState<string>("");
  const [modalMemo, setModalMemo] = useState<string>("");
  const [msg, setMsg] = useState<userMsg>({ msg: "", success: false });
  const { user } = useUser();


  const handleEdit = async (msg: userMsg, formData: FormData) => {
    formData.append("_id", modalContent?._id as string);
    const result = await editDeal(msg, formData);
    if (result.success === true) {
      closeEditModal();
    }
    setMsg(result);
    return result;
  };

  const [editMsg, editAction] = useActionState<userMsg, FormData>(handleEdit, {
    msg: "",
    success: false,
  });

  const openEditModal = () => {
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setMsg({ msg: "", success: false });
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      const deals = await getCardsInfo(user.id)
      setContents(deals);
      return deals;
    };

    fetchData().then((deals) => {
      console.log(deals);
    });
  }, [isEditModalOpen, isDeleteModalOpen]);
  console.log(contents);
  useEffect(() => {
    if (modalContent) {
      setModalFormat(modalContent.format);
      setModalName(modalContent.name);
      setModalMoney(modalContent.money);
      setModalMemo(modalContent.memo);
      setModalDueDate(modalContent.dueDate);
    }
  }, [modalContent]);

  const modaldeals = [
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
        id={user?.id}
        contents={contents}
        openEditModal={openEditModal}
        setEditModalContent={setModalContent}
        openDeleteModal={openDeleteModal}
        setDeleteContentId={setDeleteContentId}
      />
      <div className="flex justify-center pt-3">
        <a href="/deals/add">新規作成</a>
      </div>
      <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal}>
        <div className="flex flex-col items-center justify-center p-6">
          <div className="text-lg font-bold mb-4">本当に削除しますか?</div>
          <div className="flex space-x-4">
            <button
              className="bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
              onClick={async() => {
                await deleteDeal(deleteContentId);
                closeDeleteModal();
              }}
            >
              はい
            </button>
            <button
              className="bg-gray-300 text-black font-bold py-2 px-4 rounded hover:bg-gray-400"
              onClick={closeDeleteModal}
            >
              いいえ
            </button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isEditModalOpen} closeModal={closeEditModal}>
        <Form
          title="貸し借り編集"
          formClass=""
          inputContents={modaldeals}
          state={msg}
          action={editAction}
        ></Form>
      </Modal>
    </>
  );
};

export default ViewDeals;
