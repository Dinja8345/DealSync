"use server"

import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";

import type { tranStatus ,cardMsg } from "@/types/card";

const getCardInfo = async() => {
  try{
    await connectDB();
    const deals = await Deal.find({}).lean();

    const plainDeals = deals.map((doc: { _id: any }) => ({
      ...doc,
      _id: doc._id.toString()
    }))
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
  const dueDate: string  = formData.get("dueDate") as string;
  const status: tranStatus = "未返済";
  const memo: string  = formData.get("memo") as string;
  
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
      memo
    });
    await newContent.save();
		return { msg: "登録に成功しました" }
  } catch (e) {
    console.error(e);
    return { msg: "登録に失敗しました" };
  }
}


export { getCardInfo, createItem };