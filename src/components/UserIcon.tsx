"use client";

export interface UserIconProps {
  familyName: string;
  firstName: string;
  iconUrl?: string;
  custumIconClass?: string;
  textPadding?: string
  onClick?: any;
}

const UserIcon: React.FC<UserIconProps> = ({
  familyName,
  firstName,
  iconUrl,
  custumIconClass,
  textPadding,
  onClick,
}) => {
  const iconClass = custumIconClass ? custumIconClass : "w-12 h-12 text-xl"; // 48px に拡大
  const padding = textPadding ? textPadding : "px-3";
  return (
    <>
      {iconUrl ? (
        <img
          src={iconUrl}
          alt="ユーザーアイコン"
          className={iconClass + " rounded-full object-cover cursor-pointer"}
          onClick={onClick}
        />
      ) : (
        <div
          onClick={onClick}
          className={
            iconClass +
            " bg-blue-100 text-blue-800 font-bold rounded-full flex items-center justify-center " +
            padding
          }
        >
          <div className="flex-1">
            <div className="flex justify-center">
              <div>{familyName[0]}</div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex justify-center">
              <div>{firstName[0]}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UserIcon;
