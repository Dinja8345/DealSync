"use server"

import { Schema, model, models, Model } from "mongoose";

const friendRequestSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User"},
    receiver: { type: Schema.Types.ObjectId, ref: "User"},
    createdAt: { type: Date, default: Date.now },
});

const FriendRequest: Model<any> = models.FriendRequest || model('FriendRequest', friendRequestSchema);

export default FriendRequest;