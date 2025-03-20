import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  familyName: { type: String, required: true },
  firstName: { type: String, required: true },
  sex: { type: String, required: true, enum: ['男性', '女性', 'その他']},
  email: { type: String, required: true, unique: true },
  id: { type: String, required: false, unique: true },
  password: { type: String, required: true },
});

const User = models.User || model('User', userSchema);

export default User;