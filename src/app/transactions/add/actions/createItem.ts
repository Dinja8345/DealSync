"use server";
import crypto from "crypto";
import axios from "axios";

import { CARDS_ENDPOINT } from "@/constants";

import type { tranStatus ,cardMsg, outputContent } from "@/types/card";

export async function createItem(state:cardMsg, formData: FormData) : Promise<cardMsg> {
  const format: string = formData.get("format") as string;
  const name : string = formData.get("name") as string;
  const money: string = formData.get("money") as string;
  const dueDate: string  = formData.get("dueDate") as string;
  const status: tranStatus = "未返済";
  const memo: string  = formData.get("memo") as string;
  const id: string = crypto.randomUUID();

	const newContent: outputContent = { format, name, money, dueDate, status, memo, id };
  
	if (name === "" || money === "" || dueDate === "") {
    return { msg: "入力フィールドが空のところがあります。" };
  }

  try {
    const res = await axios.post(CARDS_ENDPOINT, newContent, {
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

export default createItem;