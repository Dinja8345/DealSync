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
  const [isEditCheckModalOpen, setIsEditCheckModalOpen] =
    useState<boolean>(false);
  const [tmpEditFormData, setTmpEditFormData] = useState<FormData>();
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

  // 編集フォーム入力後の確認modal出現&必要情報保存
  const editCheck = (formData: FormData) => {
    formData.append("_id", modalContent?._id as string);
    setTmpEditFormData(formData);
    openEditCheckModal();
  };

  //　編集確認が受諾された後に保存されていた情報を使用して変更
  const handleEdit = async () => {
    const result = await editDeal(tmpEditFormData as FormData);
    if (result.success === true) {
      closeEditModal();
    }
    closeEditCheckModal();
    setMsg(result);
    return result;
  };

  const openEditModal = () => {
    setMsg({ msg: "", success: false });
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setMsg({ msg: "", success: false });
  };

  const openEditCheckModal = () => {
    setIsEditCheckModalOpen(true);
  };

  const closeEditCheckModal = () => {
    setIsEditCheckModalOpen(false);
    setTmpEditFormData(undefined);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  //　初回ロード、edit,delete時に取引情報更新
  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserInfo();
      const deals = await getCardsInfo(user.id);
      setContents(deals);
      return deals;
    };

    fetchData().then((deals) => {
      //console.log(deals);
    });
  }, [isEditModalOpen, isDeleteModalOpen]);

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
              onClick={async () => {
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
          action={editCheck}
        ></Form>
        <Modal isOpen={isEditCheckModalOpen} closeModal={closeEditCheckModal}>
          <div className="flex justify-center mb-3">
            <div>変更を保存しますか?</div>
          </div>
          <div className="flex justify-center gap-10">
            <button
              onClick={handleEdit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              はい
            </button>
            <button
              onClick={closeEditCheckModal}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              いいえ
            </button>
          </div>
        </Modal>
      </Modal>
    </>
  );
};

export default ViewDeals;
