"use server"

import connectDB from "@/lib/mongodb";
import Transaction from "@/models/Transaction";

const getCardInfo = async() => {
  try{
    await connectDB();
    const transactions = await Transaction.find({}).lean();

    const plainTransactions = transactions.map((doc: { _id: any }) => ({
      ...doc,
      _id: doc._id.toString()
    }))
    return plainTransactions;
  }catch(e){
    console.error(e);
    return [];
  }
}

export default getCardInfo;