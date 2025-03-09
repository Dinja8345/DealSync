import Card from "@/components/Card";

import { content } from "@/types/card";

const Addtransactions = () => {
  const contents: content[] = [
    {
        name: "名前",
        id: "name",
        placeholder: "相手の名前",
        inputType: "text"
    },
    {
        name: "¥",
        id: "money",
        placeholder: "金額",
        inputType: "number"
    }
];

  return <Card title="新しい貸し借り" contents={contents} />;
};

export default Addtransactions;
