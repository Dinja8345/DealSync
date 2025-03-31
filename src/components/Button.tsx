interface buttonProps {
  text: string,
  onClick?(...args: any[]): any;
}

const buttonClass =
  "rounded-md bg-indigo-600 font-bold text-white w-30 my-2";

const Button: React.FC<buttonProps> = ({ text="クリック", onClick }) => {
    return <button className={buttonClass} onClick={onClick}>{text}</button>;
};

export default Button;
export type { buttonProps };