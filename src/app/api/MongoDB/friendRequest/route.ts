import FriendRequest from "@/models/FriendRequest";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request){
    try{
        const headers = await req.headers;
        const _id = headers.get("_id"); //ユーザーのObjectId
        if(!_id) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });

        await connectDB();

        const friendRequests = await FriendRequest.find({receiver: _id}).populate({
            path: 'sender',
            select: 'familyName firstName id'
        });

        //console.log(friendRequests);

        return NextResponse.json({
            message: "get FriendRequests",
            friendRequests: friendRequests
        });

    }catch(e){
        console.log(e);
        return NextResponse.json({ error: "Internal ServerError" }, { status: 500 });
    }
}


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
        return NextResponse.json({ error: "Internal ServerError" }, { status: 500 });
    }
}


export async function DELETE(req: Request){
    try{
        const body = await req.json();
        const { _id } = body;
        if(!_id) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
        
        await connectDB();

        const deletedRequest = await FriendRequest.deleteOne({ _id: _id });

        if(deletedRequest.deletedCount === 1){
            return NextResponse.json({ message: "FriendRequest deleted", deletedRequest });
        }else{
            return NextResponse.json({ message: "This _id is invalid"}, { status: 204 });
        }
    }catch(e){
        console.log(e);
        return NextResponse.json({ error: "Internal ServerError" }, { status: 500 });
    }
}