import { buttonProps } from '@/types/card';

const buttonClass =
  "rounded-md bg-indigo-600 font-bold text-white w-30";

const Button: React.FC<buttonProps> = ({ text="クリック" }) => {
    return <button className={buttonClass}>{text}</button>;
};

export default Button;