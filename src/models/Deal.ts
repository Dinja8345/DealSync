"use server"

import { Schema, model, models, Model } from "mongoose";

const dealSchema = new Schema({
  format: { type: String, required: true, enum: ["貸し", "借り"] },
  name: { type: String, required: true },
  money: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, required: true, enum: ["未返済", "返済済み"] },
  memo: { type: String, required: false },
  lenderId: { type: String, required: false },
  borrowerId: { type: String, required: false },
  registrantId: { type: String, required: true },
});

const Deal: Model<any> = models?.Transaction || model('Transaction', dealSchema);

export default Deal;