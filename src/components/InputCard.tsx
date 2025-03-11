import Form from "@/components/Form";

import type { inputCardProps } from '@/types/card';

const InputCard: React.FC<inputCardProps> = ({ title, inputContents }) => {
  const cardClass = "flex justify-center pt-5"
  return (
    <>
      <div className={cardClass}>
        <Form title={title} inputContents={inputContents} />
      </div>
    </>
  );
};

export default InputCard;
