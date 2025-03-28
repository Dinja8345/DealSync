"use server"

import axios from "axios";
import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";

import type { tranStatus, cardMsg } from "@/types/card";

const getCardInfo = async(id: string) => {
  try{
    const query = `{"$or": [{ "lenderId": "${id}" }, { "borrowerId": "${id}" }]}`;
    const dealsRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/deal`,{
      headers: {
        "Content-Type": "application/json",
        "id": id,
        "query": query
      }
    });

    const deals = dealsRes.data.deals;

    const plainDeals = deals.map((doc: { _id: any }) => ({
      ...doc,
      _id: doc._id.toString()
    }));

    return plainDeals;
  }catch(e){
    console.error(e);
    return [];
  }
}



const createItem = async(state:cardMsg, formData: FormData) : Promise<cardMsg> => {
  const format: string = formData.get("format") as string;
  const name : string = formData.get("name") as string;
  const money: string = formData.get("money") as string;
  const dueDate: string = formData.get("dueDate") as string;
  const status: tranStatus = "未返済";
  const memo: string = formData.get("memo") as string;
  const lenderId = formData.get("lenderId") as string;
  const borrowerId = formData.get("borrowerId") as string;

	if (name === "" || money === "" || dueDate === "") {
    return { msg: "入力フィールドが空のところがあります。" };
  }

  try {
    await connectDB();
		const newContent = new Deal({
      format,
      name,
      money,
      dueDate,
      status,
      memo,
      lenderId,
      borrowerId,
    });

    await newContent.save();
		return { msg: "登録に成功しました" }
  } catch (e) {
    console.error(e);
    return { msg: "登録に失敗しました" };
  }
}


export { getCardInfo, createItem };