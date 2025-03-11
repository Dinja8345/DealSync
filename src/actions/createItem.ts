"use server";
import axios from "axios";

import { ENDPOINT } from "@/constants";

import type { cardMsg, outputContent } from "@/types/card";

export async function createItem(state:cardMsg, formData: FormData) : Promise<cardMsg> {
  const format: string = formData.get("format") as string;
  const name : string = formData.get("name") as string;
  const money: string = formData.get("money") as string;
  const dueDate: string  = formData.get("dueDate") as string;

  console.log(formData);
	const newContent: outputContent = { format: format, name: name, money: money, dueDate: dueDate };
  
	if (name === "" || money === "" || dueDate === "") {
    return { msg: "入力フィールドが空のところがあります。" };
  }

  try {
    const res = await axios.post(ENDPOINT, newContent, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
		console.log(res.data);
		return { msg: "登録に成功しました" }
  } catch (e) {
    console.error(e);
    return { msg: "登録に失敗しました" };
  }
}

export default createItem