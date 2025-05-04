import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import type { Friend } from "@/types/user";

export async function GET(req: Request){
    try{
        const headers = await req.headers;
        const query = headers.get("query");
        
        //idから一致するuserを取得
        if(query === "idToUser"){
            const id = headers.get("id");
            if(!id) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
            await connectDB();
            const user = await User.findOne({ id: id }).populate({
                path: 'friends',
                select: 'familyName firstName id'
            });

            if(!user){
                return NextResponse.json({ error: "This email is invalid" }, { status: 400 });
            }else{
                return NextResponse.json({ 
                    message: "Get user",
                    user: user
                });
            }
        //登録されている全てのuserを取得
        }else if(query === "all"){
            await connectDB();
            const users = await User.find();
            return NextResponse.json({
                message: "Get all users",
                user: users
            });
        }
    }catch(e){
        //console.log(e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function POST(req: Request){
    try{
        const body = await req.json();
        const { familyName, firstName, sex, email, password, id } = body;
        if(!familyName || !firstName || !sex || !email || !password || !id) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
        await connectDB();
        
        const newUser = new User({
            familyName,
            firstName,
            sex,
            email,
            password,
            id,
            friends: []
        });
        
        await newUser.save();
        return NextResponse.json({ 
            message: "user saved",
            newUser
        });
    }catch(e){
        console.error(e);
        return NextResponse.json({ error: e }, { status: 500 });
    }
}

export async function PUT(req: Request){
    try{
        const body = await req.json();
        const { query } = body;

        if(query === "addFriend"){
            const { userObjectId, otherUserObjectId } = body;

            await connectDB();

            // 一人目にフレンド追加
            await User.updateOne(
                {_id: userObjectId},
                {
                    $addToSet: {
                        friends: otherUserObjectId 
                    }
                }
            );

            // 二人目にフレンド追加
            await User.updateOne(
                {_id: otherUserObjectId},
                {
                    $addToSet: {
                        friends: userObjectId 
                    }
                }
            );

            return NextResponse.json({ msg: "friendAdded" });
        }else if(query === "deleteFriend"){
            try{
                const { requesterId, targetId, requesterFriends, targetFriends }: {requesterId: string, targetId: string, requesterFriends: Friend[], targetFriends: Friend[]} = body;
                
                // 不正な入力を検知
                if(!requesterId || !targetId || !requesterFriends || !targetFriends){
                    return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
                }
                
                if(requesterFriends.length === 0 || targetFriends.length === 0){
                    return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
                }
    
                const updatedRequesterFriends = requesterFriends.filter((friend) => friend.id !== targetId);
                const updatedTargetFriends = targetFriends.filter((friend) => friend.id !== requesterId);
                
                console.log(updatedRequesterFriends, updatedTargetFriends);
                
                await connectDB();
    
                // フレンドを取得して、そのフレンドの配列から相手のidを省いたものを格納する。
                await User.updateOne(
                    {id: requesterId},
                    {
                        $set: {
                            friends: updatedRequesterFriends
                        }
                    }
                );

                await User.updateOne(
                    {id: targetId},
                    {
                        $set: {
                            friends: updatedTargetFriends
                        }
                    }
                );
                
                return NextResponse.json({ msg: "friendDeleted" });
            }catch(e){
                console.log(e);
                return NextResponse.json({ error: e }, { status: 500 });
            }
        }
    }catch(e){
        console.log(e);
    }
}