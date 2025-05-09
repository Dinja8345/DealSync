import type { ObjectId } from "mongoose";

export type newUser = {
    id: string
    email: string,
    password: string
    familyName: string,
    firstName: string,
    sex: sexTypes,
}

export type User = {
    id: string,
    email: string,
    password: string,
    familyName: string,
    firstName: string,
    iconUrl: string
    sex: sexTypes,
    friends: Friend[]
    _id: string,
}

export type Friend = {
    id: string,
    familyName: string,
    firstName: string,
    iconUrl?: string,
    _id: string,
}

export type RequestSender = {
    familyName: string,
    firstName: string,
    id: string,
}

export type FriendRequest = {
    sender: RequestSender,
    receiver: ObjectId,
    createdAt: Date,
    _id: string,
}


export type sexTypes = "男性" | "女性" | "その他"