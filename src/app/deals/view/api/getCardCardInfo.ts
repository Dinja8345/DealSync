"use server"

import connectDB from "@/lib/mongodb";
import Deal from "@/models/Deal";

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

export default getCardInfo;