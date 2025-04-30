"use client";

import { isInput } from "@/types/form"; // isInputの型定義が必要
import type { JSX } from "react";
import type { formProps } from "@/types/form"; // formPropsの型定義が必要

const Form: React.FC<formProps> = ({
  title,
  formClass,
  inputContents,
  state,
  action,
}) => {
  return (
    // formClassは <form> タグに適用される
    <div className={formClass}>
      {" "}
      {/* divで囲むことで、メッセージをform外に表示できる */}
      <form action={action} className="space-y-4">
        {" "}
        {/* フォーム要素間のスペース */}
        {/* フォームタイトル */}
        <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          {title}
        </h3>
        {/* 入力フィールドのループ */}
        {inputContents.map((content) => {
          let inputElement: JSX.Element | null = null;

          // input か select かを判定
          if (isInput(content)) {
            // input要素
            if (content.state) {
              inputElement = (
                <input
                  type={content.inputType || "text"} // デフォルトはtext
                  id={content.id}
                  name={content.id}
                  placeholder={content.placeholder}
                  aria-disabled={content.areaDisabled}
                  readOnly={content.readOnly}
                  // 共通のスタイルクラス
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white disabled:bg-gray-100"
                  // controlled component の場合
                  value={content.state?.value ?? ""} // undefinedなら空文字
                  onChange={(e) => content.state?.setValue(e.target.value)}
                  // required などの属性も content に含められる
                />
              );
            } else {
              inputElement = (
                <input
                  type={content.inputType || "text"} // デフォルトはtext
                  id={content.id}
                  name={content.id}
                  placeholder={content.placeholder}
                  // 共通のスタイルクラス
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white disabled:bg-gray-100"
                />
              );
            }
          } else if (content.options && Array.isArray(content.options)) {
            // select要素
            inputElement = (
              <select
                id={content.id}
                name={content.id}
                // 共通のスタイルクラス
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 bg-white"
                // controlled component の場合
                value={content.state?.value ?? ""}
                onChange={(e) => content.state?.setValue(e.target.value)}
              >
                {/* placeholder的な選択肢 (任意) */}
                {/* <option value="" disabled>{content.placeholder || '選択してください'}</option> */}
                {content.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          }

          // ラベルと入力要素をレンダリング
          return (
            <div key={content.id}>
              {" "}
              {/* keyは一意なidを使用 */}
              <label
                htmlFor={content.id}
                className="block text-sm font-medium text-gray-700"
              >
                {content.name}
              </label>
              {inputElement}
            </div>
          );
        })}
        {/* 送信ボタン */}
        <div className="pt-5">
          {" "}
          {/* ボタンの上のスペース */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
            // ローディング状態などを考慮する場合は disabled 属性や表示内容を変更
          >
            {/* ボタンテキストは固定かpropsで渡す */}
            編集内容を保存
          </button>
        </div>
      </form>
      {/* 状態メッセージ */}
      {state?.msg && (
        <div
          className={`mt-4 text-sm text-center ${
            state.success ? "text-green-600" : "text-red-600"
          }`}
        >
          {state.msg}
        </div>
      )}
    </div>
  );
};

export default Form;
