"use server"

import { Schema, model, models, Model } from "mongoose";

const sessionStoreSchema = new Schema({
    sid: { type: String, required: true},
    email: { type: String, required: true}
});

const SessionStore: Model<any> = models?.SessionStore || model('SessionStore', sessionStoreSchema);

export default SessionStore;