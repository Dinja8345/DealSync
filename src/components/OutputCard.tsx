import type { Dispatch, SetStateAction } from "react";
import type { deal, formats } from "@/types/card";

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
  openEditModal: () => void;
  setEditModalContent: Dispatch<SetStateAction<deal | undefined>>;
  openDeleteModal: () => void;
  setDeleteContentId: Dispatch<SetStateAction<string>>;
}

const OutputCard = ({
  id,
  contents,
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
  const editButtonClass =
    "text-white bg-green-500 hover:bg-green-700 font-bold py-1 px-4 rounded mx-1 mt-1";
  const deleteButtonClass =
    "text-white bg-red-500 hover:bg-red-700 font-bold py-1 px-4 rounded mx-1 mt-1";

  return (
    <>
      {contents.map((content) => {
        return (
          <div className={cardClass} key={content._id}>
            {id === content.registrantId ? (
              <div className={contentsClass + registrantColorClass}>
                <div className={titleClass}>
                  {content.name}-{content.format}
                </div>
                <div className={textClass}>金額: \{content.money}</div>
                <div className={textClass}>期日: {content.dueDate}</div>
                <div className={textClass}>メモ: {content.memo}</div>
                <div className={textClass}>
                  返済ステータス: {content.status}
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
    </>
  );
};

export default OutputCard;
