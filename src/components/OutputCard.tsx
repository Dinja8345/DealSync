import type { outputContent } from "@/types/card";

const OutputCard = ({ contents }: { contents: outputContent[] }) => {
  const cardClass = "flex justify-center pt-5";
  const contentsClass =
    "flex flex-col justify-end w-lg rounded-md shadow-xl bg-sky-200 p-5 m-1";
  const titleClass = "text-black text-center font-bold italic mb-2";
  const textClass = "flex-1 text-black text-center pr-2";
  return (
    <>
      {contents.map((content) => {
        return (
          <div className={cardClass} key={content.id}>
            <div className={contentsClass}>
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
      <div className="flex justify-center pt-3 ">
        <a href="/transactions/add">新規作成</a>
      </div>
    </>
  );
};

export default OutputCard;
