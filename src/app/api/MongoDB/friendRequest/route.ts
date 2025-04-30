import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import FriendRequest from "@/models/FriendRequest";


export async function POST(req: Request){
    try{
        const body = await req.json();
        const { sender, receiver } = body;
        
        if(!sender || !receiver) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });

        await connectDB();

        // 同じ内容のリクエストが登録済みかを調べる
        const isExistingRequest = await FriendRequest.findOne({
            sender: sender,
            receiver: receiver,
        });

        if(isExistingRequest){
            return NextResponse.json(
                { error: "Conflict" },
                { status: 409 }
            )
        }
        
        const newFriendRequest = new FriendRequest({
            sender: sender,
            receiver: receiver,
        });

        await newFriendRequest.save();
        return NextResponse.json({
            message: "FriendRequest saved",
            newFriendRequest: newFriendRequest.toObject(),
        })

    }catch(e){
        console.error(e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}