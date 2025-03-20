import { Schema, model, models } from "mongoose";

const transactionSchema = new Schema({
  format: { type: String, required: true, enum: ["貸し", "借り"] },
  name: { type: String, required: true },
  money: { type: String, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, required: true, enum: ["未返済", "返済済み"] },
  memo: { type: String, required: false }
});

const Transaction = models.Transaction || model('Transaction', transactionSchema);

export default Transaction;