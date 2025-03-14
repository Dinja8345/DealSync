import type{ outputContent } from "@/types/card";

const OutputCard = ({ contents }: { contents: outputContent[] }) => {
  const cardClass = "flex justify-center pt-5";
  const contentsClass =
    "flex flex-col justify-end w-sm rounded-md shadow-xl bg-sky-200 p-5 m-1";
  const titleClass = "text-black text-center font-bold italic mb-2";
  const textClass = "flex-1 text-black text-center pr-2";
  const buttonClass =
    "rounded-md bg-indigo-600 font-bold text-white w-30 mt-3 mb-1 mr-5 self-end";
  return (
    <>
      {contents.map((content) => {
        return (
          <div className={cardClass} key={content.id}>
            <div className={contentsClass}>
              <div className={titleClass}>{content.name}-{content.format}</div>
              <div className={textClass}>金額: \{content.money}</div>
              <div className={textClass}>期日: {content.dueDate}</div>
              <div className={textClass}>メモ: {content.memo}</div>
              <div className={textClass}>:返済ステータス: {content.status}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default OutputCard;
