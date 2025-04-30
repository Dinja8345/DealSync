import React from 'react';
import Form from "@/components/Form";
import type { formProps } from "@/types/form";

const InputCard: React.FC<formProps> = ({ title, inputContents, state, action }) => {
  const cardClass =
    "bg-white rounded-lg shadow-lg p-5 space-y-4 w-full max-w-md mx-auto my-5 border-t-4 border-sky-400"; // OutputCardのスタイルを適用

  return (
    <div className="w-full">
      <div className={cardClass}>
        <Form title={title} inputContents={inputContents} state={state} action={action} />
      </div>
    </div>
  );
};

export default InputCard;
