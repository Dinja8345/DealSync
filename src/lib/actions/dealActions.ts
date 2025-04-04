"use server";

import axios from "axios";

import type { tranStatus, cardMsg } from "@/types/card";
import { userMsg } from "./userActions";

const url = `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/deal`

const getCardsInfo = async (id: string) => {
  try {
    const query = `{"$or": [{ "lenderId": "${id}" }, { "borrowerId": "${id}" }]}`;
    const dealsRes = await axios.get(
      url,
      {
        headers: {
          "Content-Type": "application/json",
          id: id,
          query: query,
        },
      }
    );

    const deals = dealsRes.data.deals;

    const plainDeals = deals.map((doc: { _id: any }) => ({
      ...doc,
      _id: doc._id.toString(),
    }));

    return plainDeals;
  } catch (e) {
    console.error(e);
    return [];
  }
};

const createItem = async (
  state: cardMsg,
  formData: FormData
): Promise<cardMsg> => {
  const format: string = formData.get("format") as string;
  const name: string = formData.get("name") as string;
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
    await axios.post(url, {
      format,
      name,
      money,
      dueDate,
      status,
      memo,
      lenderId,
      borrowerId,
    });

    return { msg: "登録に成功しました" };
  } catch (e) {
    console.error(e);
    return { msg: "登録に失敗しました" };
  }
};



const editDeal = async(state: userMsg, formData: FormData) => {
  const format: string = formData.get("format") as string;
  const name: string = formData.get("name") as string;
  const money: string = formData.get("money") as string;
  const dueDate: string = formData.get("dueDate") as string;
  const status: tranStatus = "未返済";
  const memo: string = formData.get("memo") as string;
  const _id: string = formData.get("_id") as string;

  try{
    await axios.put(url, {
      format,
      name,
      money,
      dueDate,
      status,
      memo,
      _id,
    })
    return { msg: "更新に成功", success: true };
  }catch(e){
    console.log("deal更新actionでエラー: ", e);
    return { msg: "更新に失敗", success: false };
  };
};



const deleteDeal = async(_id: string): Promise<userMsg> => {
  try{
    const payload = {
      _id: _id
    }

    await axios.delete(url, {
      data: payload
    });

    return { msg:"削除に成功", success: true};
  }catch(e){
    console.log("deal削除acitonでエラー:", e);
    return { msg:"削除に失敗", success: false};
  }
}

export { getCardsInfo, createItem, editDeal, deleteDeal };
