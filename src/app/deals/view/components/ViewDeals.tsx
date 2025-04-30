"use client";

import Modal from "@/components/Modal";
import Form from "@/components/Form";
import OutputCard from "@/components/OutputCard";
import { useState, useEffect } from "react";
import { getCardsInfo, editDeal, deleteDeal } from "@/lib/actions/dealActions";
import { getUserInfo } from "@/lib/actions/userActions";
import { useUser } from "@/context/UserContext";

import type { deal } from "@/types/card";
import type { userMsg } from "@/lib/actions/userActions";

const ViewDeals = () => {
  const [contents, setContents] = useState<deal[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isEditCheckModalOpen, setIsEditCheckModalOpen] = useState<boolean>(false);
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

  const editCheck = (formData: FormData) => {
    formData.append("_id", modalContent?._id as string);
    setTmpEditFormData(formData);
    openEditCheckModal();
  };

  const handleEdit = async () => {
    if (!tmpEditFormData) return;
    const result = await editDeal(tmpEditFormData);
    if (result.success === true) {
      closeEditModal();
    }
    closeEditCheckModal();
    setMsg(result);
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        if (user?.id) {
          const deals = await getCardsInfo(user.id);
          if (isMounted) {
            setContents(deals || []);
          }
        } else {
          const userInfo = await getUserInfo();
          if (userInfo?.id) {
            const deals = await getCardsInfo(userInfo.id);
            if (isMounted) {
              setContents(deals || []);
            }
          } else if (isMounted) {
            setContents([]);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setContents([]);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [user, msg.success]);

  useEffect(() => {
    if (msg.success && msg.msg) {
      const timer = setTimeout(() => {
        setMsg({ msg: "", success: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg]);

  useEffect(() => {
    if (modalContent) {
      setModalFormat(modalContent.format);
      setModalName(modalContent.name);
      setModalMoney(String(modalContent.money));
      setModalMemo(modalContent.memo || "");
      setModalDueDate(modalContent.dueDate || "");
    } else {
      setModalFormat("");
      setModalName("");
      setModalMoney("");
      setModalMemo("");
      setModalDueDate("");
    }
  }, [modalContent]);

  const modalContents = [
    { name: "形態", id: "format", options: ["貸し", "借り"], state: { value: modalFormat, setValue: setModalFormat } },
    { name: "名前", id: "name", placeholder: "相手の名前", inputType: "text", state: { value: modalName, setValue: setModalName } },
    { name: "金額", id: "money", placeholder: "金額（円）", inputType: "number", state: { value: modalMoney, setValue: setModalMoney } },
    { name: "メモ", id: "memo", placeholder: "任意", inputType: "text", state: { value: modalMemo, setValue: setModalMemo } },
    { name: "期日", id: "dueDate", placeholder: "期日", inputType: "date", state: { value: modalDueDate, setValue: setModalDueDate } },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {msg.msg && (
        <div className={`mb-4 p-4 rounded-md text-center ${msg.success ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {msg.msg}
        </div>
      )}

      <div className="space-y-6">
        {contents.length > 0 ? (
          <OutputCard
            id={user?.id}
            contents={contents}
            setContents={setContents}
            openEditModal={openEditModal}
            setEditModalContent={setModalContent}
            openDeleteModal={openDeleteModal}
            setDeleteContentId={setDeleteContentId}
          />
        ) : (
          <p className="text-center text-gray-500">表示できる取引情報はありません。</p>
        )}
      </div>

      <div className="flex justify-center pt-8">
        <a
          href="/deals/add"
          className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          新規作成
        </a>
      </div>

      {/* 削除確認モーダル */}
      <Modal isOpen={isDeleteModalOpen} closeModal={closeDeleteModal}>
        <div className="flex flex-col items-center justify-center p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">本当に削除しますか？</h3>
          <p className="text-gray-600 mb-6 text-center">この操作は元に戻せません。</p>
          <div className="flex space-x-4">
            <button
              className="px-6 py-2 bg-red-600 text-white font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              onClick={async () => {
                const result = await deleteDeal(deleteContentId);
                setMsg(result);
                closeDeleteModal();
              }}
            >
              削除する
            </button>
            <button
              className="px-6 py-2 bg-gray-200 text-gray-800 font-medium rounded-md shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out"
              onClick={closeDeleteModal}
            >
              いいえ
            </button>
          </div>
        </div>
      </Modal>

      {/* 編集モーダル */}
      <Modal isOpen={isEditModalOpen} closeModal={closeEditModal}>
        <Form
          title="貸し借り編集"
          formClass="p-4"
          inputContents={modalContents}
          state={msg}
          action={editCheck}
        />
        {/* 編集確認モーダル（ネスト） */}
        <Modal isOpen={isEditCheckModalOpen} closeModal={closeEditCheckModal}>
          <div className="flex flex-col items-center justify-center p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-6">変更を保存しますか？</h3>
            <div className="flex space-x-4">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                はい
              </button>
              <button
                onClick={closeEditCheckModal}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 transition duration-150 ease-in-out"
              >
                いいえ
              </button>
            </div>
          </div>
        </Modal>
      </Modal>
    </div>
  );
};

export default ViewDeals;
