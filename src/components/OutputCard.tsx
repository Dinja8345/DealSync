import Confetti from "@/components/Confetti";
import { useState } from "react";
import { changeDealStatus } from "@/lib/actions/dealActions";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { deal, formats, tranStatus } from "@/types/card";

// 取引が他人が登録したものだった場合、dbに登録されている形式と逆のものを返す
const invertDealType = (format: formats): formats => {
  if (format === "借り") {
    return "貸し";
  } else {
    return "借り";
  }
};

export interface outputCardProps {
  id?: string;
  contents: deal[];
  setContents: Dispatch<SetStateAction<deal[]>>;
  openEditModal: () => void;
  setEditModalContent: Dispatch<SetStateAction<deal | undefined>>;
  openDeleteModal: () => void;
  setDeleteContentId: Dispatch<SetStateAction<string>>;
}

const OutputCard = ({
  id,
  contents,
  setContents,
  openEditModal,
  setEditModalContent,
  openDeleteModal,
  setDeleteContentId,
}: outputCardProps) => {

  const cardClass = "flex justify-center pt-5";
  const contentsClass =
    "flex flex-col justify-end w-lg rounded-md shadow-xl p-5 m-1 relative ";
  const registrantColorClass = "bg-sky-200";
  const unRegistrantColorClass = "bg-yellow-200";
  const titleClass = "text-black text-center font-bold italic mb-2";
  const textClass = "flex-1 text-black text-center pr-2";
  const buttonContainerClass = "absolute top-2 right-2 flex";
  const statusContainerClass = "group flex-1 mr-5 flex justify-center";
  const editButtonClass =
    "text-white bg-green-500 hover:bg-green-700 font-bold py-1 px-4 rounded mx-1 mt-1";
  const deleteButtonClass =
    "text-white bg-red-500 hover:bg-red-700 font-bold py-1 px-4 rounded mx-1 mt-1";
  const checkboxClass =
    "opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity mr-1";


  const changeStatus = async(e: ChangeEvent<HTMLInputElement>, content: deal) => {
    const _id = e.target.dataset.id as string;

    // deals[]stateのidが一致するdealのstatusに楽観的変更を行う
    const isChecked = e.target.checked;
    const status: tranStatus = isChecked ? "返済済み" : "未返済";

    
    await changeDealStatus(_id, status);
    
    setContents(prevDeals => 
      prevDeals.map(deal => 
        deal._id === _id
        ? { ...deal, status}
        : deal
      )
    )
    
    // 返済済みになるなら紙吹雪を発射
    if(isChecked){
      setShowRightConfetti(true);
      setShowLeftConfetti(true);
    }
  };

  const [showRightConfetti, setShowRightConfetti] = useState<boolean>(false);
  const [showLeftConfetti, setShowLeftConfetti] = useState<boolean>(false);
  
  return (
    <>
      {contents.map((content) => {
        return (
          <div className={cardClass} key={content._id}>
            {id === content.registrantId ? (
              //自分が登録したカード
              <div className={contentsClass + registrantColorClass}>
                <div className={titleClass}>
                  {content.name}-{content.format}
                </div>
                <div className={textClass}>金額: \{content.money}</div>
                <div className={textClass}>期日: {content.dueDate}</div>
                <div className={textClass}>メモ: {content.memo}</div>
                <div className={statusContainerClass}>
                  <input
                    data-id={content._id}
                    type="checkbox"
                    className={checkboxClass}
                    onChange={(e) => {
                      changeStatus(e, content);
                    }}
                    checked={content.status === "返済済み"}
                  />
                  <div>
                    返済ステータス: {content.status}
                  </div>
                </div>
                <div className={buttonContainerClass}>
                  <button
                    className={editButtonClass}
                    onClick={() => {
                      setEditModalContent(content);
                      openEditModal();
                    }}
                  >
                    編集
                  </button>
                  <button
                    className={deleteButtonClass}
                    onClick={() => {
                      setDeleteContentId(content._id);
                      openDeleteModal();
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            ) : (
              //他人が登録したカード
              <div className={contentsClass + unRegistrantColorClass}>
                <div className={titleClass}>
                  {content.registrantId}が追加-{invertDealType(content.format)}
                </div>
                <div className={textClass}>金額: \{content.money}</div>
                <div className={textClass}>期日: {content.dueDate}</div>
                <div className={textClass}>メモ: {content.memo}</div>
                <div className={textClass}>
                  返済ステータス: {content.status}
                </div>
              </div>
            )}
          </div>
        );
      })}
      <Confetti
        showRightConfetti={showRightConfetti} 
        setShowRightConfetti={setShowRightConfetti}
        showLeftConfetti={showLeftConfetti}
        setShowLeftConfetti={setShowLeftConfetti}
      />
    </>
  );
};

export default OutputCard;
