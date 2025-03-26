"use server";

import axios from "axios";

import { cookies } from "next/headers";

const getUserInfo = async () => {
  const cookieStore = await cookies();
  const sid = cookieStore.get("sid");

  const sessionDbData = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`,
    {
      headers: {
        "Content-Type": "application/json",
        sid: sid?.value,
      },
    }
  );

  const id = sessionDbData.data.id;

  if (!id) {
    throw new Error("sidに該当するidが存在しません");
  }

  const userData = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
    {
      headers: {
        "Content-Type": "application/json",
        id: id,
      },
    }
  );

  const user = userData.data.user;
  
  if(!user){
    throw new Error("idに該当するuserが存在しません");
  }

  return user;

};

export default getUserInfo;
