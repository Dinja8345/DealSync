"use client";

export interface UserIconProps {
  familyName: string;
  firstName: string;
  iconUrl?: string;
  onClick?: any;
}

const UserIcon: React.FC<UserIconProps> = ({
  familyName,
  firstName,
  iconUrl,
  onClick,
}) => {
  const iconClass = "w-12 h-12 rounded-full object-cover cursor-pointer"; // 48px に拡大

  return (
    <>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt="ユーザーアイコン"
          className={iconClass}
          onClick={onClick}
        />
      ) : (
        <div
          onClick={onClick}
          className="bg-blue-100 text-blue-800 font-bold rounded-full h-12 w-12 flex items-center justify-center text-xl"
        >
          {familyName[0]}
          {firstName[0]}
        </div>
      )}
    </>
  );
};

export default UserIcon;
