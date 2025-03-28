// "use client";

import Button from "@/components/Button";
import { isInput } from "@/types/form";

import type { JSX } from "react";
import type { formProps } from "@/types/form";

const Form: React.FC<formProps> = ({ title, inputContents, state, action }) => {
  
  const formClass =
    "";
  const titleClass = "text-black font-bold italic mb-2";
  const labelClass = "flex-1 text-black text-right pr-2";
  const inputClass =
  "flex-5 bg-teal-50 rounded-sm outline-2 outline-zinc-400 px-1.5";

  return (
    <>
      <form className={formClass} action={action}>
        <h3 className={titleClass}>{title}</h3>
        {inputContents.map((content) => {
          let inputElement: JSX.Element = <></>;
          if (isInput(content)) {
            if(content.state === undefined){
              inputElement = (
                <input
                  type={content.inputType}
                  id={content.id}
                  name={content.id}
                  placeholder={content.placeholder}
                  className={inputClass}
                  />
                );
            }else{
              inputElement = (
                <input
                  type={content.inputType}
                  id={content.id}
                  name={content.id}
                  placeholder={content.placeholder}
                  aria-disabled={content.areaDisabled}
                  readOnly={content.readOnly}
                  className={inputClass}
                  value={content.state.value}
                  onChange={(e) => {
                    content.state?.setValue(e.target.value);
                  }}
                  />
                );
            }
          } else {
            inputElement = (
              <select name={content.id} id={content.id} className={inputClass} key={content.id} value={content.state?.value} onChange={(e) => content.state?.setValue(e.target.value)}>
                {content.options.map((option) => {
                  return <option key={option + "-option"} value={option}>{option}</option>;
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
        <div className="flex justify-end mt-4 mb-3">
        <Button text={"登録"}/>
        </div>
      </form>
      <div>{state.msg}</div>
    </>
  );
};

export default Form;
