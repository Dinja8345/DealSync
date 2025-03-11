"use client";

import { useActionState } from "react";

import { createItem } from "@/actions/createItem";
import { isInput } from "@/types/card";

import type { JSX } from "react";
import type { inputCardProps, cardMsg } from "@/types/card";

const Form: React.FC<inputCardProps> = ({ title, inputContents }) => {
  const [state, createItemAction] = useActionState<cardMsg, any>(createItem, {
    msg: "",
  });

  const formClass =
    "flex flex-col justify-end w-sm rounded-md shadow-xl bg-sky-200 p-5 m-1";
  const titleClass = "text-black font-bold italic mb-2";
  const labelClass = "flex-1 text-black text-right pr-2";
  const inputClass =
    "flex-5 bg-teal-50 rounded-sm outline-2 outline-zinc-400 px-1.5";
  const buttonClass =
    "rounded-md bg-indigo-600 font-bold text-white w-30 mt-3 mb-1 mr-5 self-end";

  return (
    <>
      <form className={formClass} action={createItemAction}>
        <h3 className={titleClass}>{title}</h3>
        {inputContents.map((content) => {
          let inputElement: JSX.Element = <></>;
          if (isInput(content)) {
            inputElement = (
              <input
                type={content.inputType}
                id={content.id}
                name={content.id}
                placeholder={content.placeholder}
                className={inputClass}
              />
            );
          } else {
            inputElement = (
              <select name={content.id} id={content.id} className={inputClass}>
                {content.options.map((option) => {
                  return <option key={option + "-option"}>{option}</option>;
                })}
              </select>
            );
          }
          return (
            <div className="flex my-2" key={content.name}>
              <label htmlFor="content.name" className={labelClass}>
                {content.name + ":"}
              </label>
              {inputElement}
            </div>
          );
        })}
        <button className={buttonClass}>登録</button>
      </form>
      <div>{state.msg}</div>
    </>
  );
};

export default Form;
