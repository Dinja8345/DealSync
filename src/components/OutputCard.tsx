import Confetti from "@/components/Confetti";
import { useState } from "react";
import { changeDealStatus } from "@/lib/actions/dealActions";
import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import type { deal, formats, tranStatus } from "@/types/card";

// 取引が他人が登録したものだった場合、dbに登録されている形式と逆のものを返す
// (この関数は変更しない)
const invertDealType = (format: formats): formats => {
  if (format === "借り") {
    return "貸し";
  } else {
    return "借り";
  }
};

// Propsインターフェース (変更しない)
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

  // ステータス変更ロジック (変更しない)
  const changeStatus = async(e: ChangeEvent<HTMLInputElement>, content: deal) => {
    const _id = e.target.dataset.id as string;
    const isChecked = e.target.checked;
    const status: tranStatus = isChecked ? "返済済み" : "未返済";

    // 楽観的UI更新
    setContents(prevDeals =>
      prevDeals.map(deal =>
        deal._id === _id
        ? { ...deal, status}
        : deal
      )
    )

    await changeDealStatus(_id, status);

    // Confetti表示
    if(isChecked){
      setShowRightConfetti(true);
      setShowLeftConfetti(true);
    }
  };

  // Confetti State (変更しない)
  const [showRightConfetti, setShowRightConfetti] = useState<boolean>(false);
  const [showLeftConfetti, setShowLeftConfetti] = useState<boolean>(false);

  return (
    <>
      {contents.map((content) => {
        const isUserRegistrant = id === content.registrantId;
        const cardBorderColor = isUserRegistrant ? "border-sky-400" : "border-yellow-400";

        return (
          <div key={content._id} className="w-full max-w-md mx-auto">
            {/* カード本体 */}
            <div
              className={`bg-white rounded-lg shadow-lg p-5 relative border-t-4 ${cardBorderColor} space-y-3`}
            >
              {/* 編集・削除ボタン (自分登録時のみ表示) */}
              {isUserRegistrant && (
                <div className="absolute top-3 right-3 flex space-x-2">
                  <button
                    className="p-1 text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-full"
                    onClick={() => {
                      setEditModalContent(content);
                      openEditModal();
                    }}
                    aria-label="編集"
                  >
                    {/* Heroicon: pencil-square */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                    </svg>
                  </button>
                  <button
                     className="p-1 text-gray-500 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full"
                    onClick={() => {
                      setDeleteContentId(content._id);
                      openDeleteModal();
                    }}
                    aria-label="削除"
                  >
                    {/* Heroicon: trash */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                </div>
              )}

              {/* カードタイトル */}
              <div className="text-lg font-semibold text-gray-800 text-center pt-2">
                {isUserRegistrant
                  ? `${content.name} - ${content.format}`
                  : `${content.registrantId} が追加 - ${invertDealType(content.format)}`}
              </div>

              {/* 詳細情報 */}
              <div className="space-y-1 text-sm text-gray-600 border-t border-gray-200 pt-3 mt-3">
                 <div className="flex justify-between">
                    <span className="font-medium text-gray-700">金額:</span>
                    <span>¥{content.money.toLocaleString()}</span> {/* 金額をカンマ区切りに */}
                 </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-gray-700">期日:</span>
                    <span>{content.dueDate || "無期限"}</span> {/* 未設定の場合の表示 */}
                 </div>
                 {content.memo && ( // メモがある場合のみ表示
                    <div className="pt-1">
                       <span className="font-medium text-gray-700 block mb-1">メモ:</span>
                       <p className="text-xs bg-gray-50 p-2 rounded">{content.memo}</p>
                    </div>
                 )}
              </div>


              {/* 返済ステータス */}
              <div className="group flex items-center justify-center pt-2 mt-2">
                 {isUserRegistrant ? (
                   <>
                     {/* チェックボックス (自分登録時のみ表示・操作可能) */}
                     <input
                       data-id={content._id}
                       type="checkbox"
                       className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-200 ease-in-out h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer mr-2"
                       onChange={(e) => {
                         changeStatus(e, content);
                       }}
                       checked={content.status === "返済済み"}
                       aria-labelledby={`status-label-${content._id}`} // ラベルと関連付け
                     />
                     <label id={`status-label-${content._id}`} className="text-sm text-gray-700 font-medium">
                       返済ステータス: {content.status}
                     </label>
                   </>
                 ) : (
                   // 他人登録時はテキスト表示のみ
                   <div className="text-sm text-gray-700 font-medium">
                      返済ステータス: {content.status}
                   </div>
                 )}
              </div>

            </div>
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