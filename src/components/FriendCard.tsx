// components/FriendCard.tsx
import React from "react";

type FriendCardProps = {
  userId: string;
  familyName: string;
  firstName: string;
};

export const FriendCard: React.FC<FriendCardProps> = ({
  userId,
  familyName,
  firstName,
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 w-full max-w-md mx-auto mb-4 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-center gap-4">
        <div className="bg-blue-100 text-blue-800 font-bold rounded-full h-12 w-12 flex items-center justify-center text-xl">
          {familyName[0]}
          {firstName[0]}
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-semibold">
            {familyName} {firstName}
          </span>
          <span className="text-sm text-gray-500">ID: {userId}</span>
        </div>
      </div>
    </div>
  );
};
