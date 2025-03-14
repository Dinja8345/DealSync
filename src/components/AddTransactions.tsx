import InputCard from "@/components/InputCard";

import { inputContent } from "@/types/card";

const Addtransactions = () => {
  const contents: inputContent[] = [  
    {
      name: "形態",
      id: "format",
      options: [
        "借り",
        "貸し",
      ]
    },
    {
      name: "名前",
      id: "name",
      placeholder: "相手の名前",
      inputType: "text",
    },
    {
      name: "金額",
      id: "money",
      placeholder: "\\",
      inputType: "number",
    },
    {
      name: "メモ",
      id: "memo",
      placeholder: "任意",
      inputType: "text",
    },
    {
      name: "期日",
      id: "dueDate",
      placeholder: "期日",
      inputType: "date"
    },
  ];

  return <InputCard title="新しい記録" inputContents={contents} />;
};

export default Addtransactions;
