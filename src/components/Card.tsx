import type { CardProps } from '@/types/card';

const Card: React.FC<CardProps> = ({ title, contents }) => {
  const formClass = "flex flex-col justify-end w-sm rounded-md shadow-xl bg-blue-200 p-5 m-1";
  const titleClass = "text-black font-bold italic mb-2"
	const labelClass = "flex-1 text-black text-right pr-2";
  const inputClass = "flex-5 bg-teal-50 rounded-sm outline-2 outline-zinc-400 px-1.5";
	const buttonClass = "rounded-md bg-violet-700 font-bold text-white w-30 justify-self-end"

  return (
    <>
      <div className="flex justify-center pt-5">
        <form className={formClass} action="">
					<h3 className={titleClass}>{title}</h3>
					{contents.map((content) => {
						return (
							<div className='flex my-2' key={content.id}>
								<label htmlFor={content.id} className={labelClass}>{content.name + ":"}</label>
								<input type={content.inputType} id={content.id} placeholder={content.placeholder} className={inputClass}/>
							</div>
						)
					})}
					<button className={buttonClass}>登録</button>
        </form>
      </div>
    </>
  );
};

export default Card;
