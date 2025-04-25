import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: Request){
    try{
        const headers = await req.headers;
        const query = headers.get("query");
        if(query === "idToUser"){
            const id = headers.get("id");
            if(!id) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
            await connectDB();
            const user = await User.findOne({ id: id });
            if(!user){
                return NextResponse.json({ error: "This email is invalid" }, { status: 400 });
            }else{
                return NextResponse.json({ 
                    message: "Get user",
                    user: user
                });
            }
        }else if(query === "all"){
            await connectDB();
            const users = await User.find();
            return NextResponse.json({
                message: "Get all users",
                user: users
            });
        }
    }catch(e){
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
            id
        });
        await newUser.save();
        return NextResponse.json({ 
            message: "user saved",
            newUser
        });
    }catch(e){
        console.error(e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}