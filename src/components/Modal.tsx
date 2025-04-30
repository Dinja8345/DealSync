//z軸の関係上、このmodalは使用するコンポーネントの一番下の行で呼び出してください

import type { ReactNode } from 'react';

interface ModalProps {
  isOpen: boolean;
  closeModal?: (...args: any[]) => any;
  children: ReactNode;
}

const Modal = ({ isOpen, closeModal, children }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    // オーバーレイ: 画面全体を覆い、背景を暗くする
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 transition-opacity duration-300 ease-in-out"
      // オーバーレイクリックで閉じる場合 (オプション)
      onClick={closeModal}
    >
      {/* モーダルコンテンツエリア: クリックイベントが親(オーバーレイ)に伝播しないように */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 my-8 p-6 transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()} // コンテンツクリックで閉じないように
      >
        {/* 閉じるボタン (closeModalが提供されている場合のみ表示) */}
        {closeModal && (
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-full p-1 transition duration-150 ease-in-out"
            onClick={closeModal}
            aria-label="閉じる" // アクセシビリティのため
          >
            {/* Heroicon: x-mark */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {children}
      </div>
    </div>
  );
};

export default Modal;