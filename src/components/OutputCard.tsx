import type { Dispatch, SetStateAction } from "react";
import type { outputContent } from "@/types/card";

export interface outputCardProps{
  contents: outputContent[],
  openModal: () => void
  setModalContent: Dispatch<SetStateAction<outputContent | undefined>>
}

const OutputCard = ({ contents, openModal, setModalContent }: outputCardProps) => {
  const cardClass = "flex justify-center pt-5";
  const contentsClass =
    "flex flex-col justify-end w-lg rounded-md shadow-xl bg-sky-200 p-5 m-1 relative";
  const titleClass = "text-black text-center font-bold italic mb-2";
  const textClass = "flex-1 text-black text-center pr-2";
  const editButtonClass = "text--500 absolute top-3 right-5 focus:outline-none";
  
  return (
    <>
      {contents.map((content) => {
        return (
          <div className={cardClass} key={content._id}>
            <div className={contentsClass}>
              <button className={editButtonClass} onClick={() => {
                setModalContent(content);
                openModal();
              }}>編集</button>
              <div className={titleClass}>
                {content.name}-{content.format}
              </div>
              <div className={textClass}>金額: \{content.money}</div>
              <div className={textClass}>期日: {content.dueDate}</div>
              <div className={textClass}>メモ: {content.memo}</div>
              <div className={textClass}>返済ステータス: {content.status}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OutputCard;
