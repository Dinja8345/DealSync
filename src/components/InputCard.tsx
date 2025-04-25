import Form from "@/components/Form";

import type { formProps } from "@/types/form";

const InputCard: React.FC<formProps> = ({ title, inputContents, state, action }) => {
  const cardClass =
    "flex pt-5 flex-col justify-end w-lg rounded-md shadow-xl bg-sky-200 p-5 m-1";
  return (
    <div className={"my-5"}>
      <div className={cardClass}>
        <Form title={title} inputContents={inputContents} state={state} action={action} />
      </div>
    </div>
  );
};

export default InputCard;
