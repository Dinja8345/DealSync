import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import SessionStore from "@/models/SessionStore";

export async function GET(req: Request){
    try{
        const headers = await req.headers;
        const sid = headers.get("sid");

        if(!sid) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
        await connectDB();
        const sessionStore = await SessionStore.findOne({ sid: sid });
        
        if(!sessionStore){
            return NextResponse.json({ error: "This sid is invalid" }, { status: 400 });
        }else{
            return NextResponse.json({ 
                message: "Get id",
                id: sessionStore.id
            });
        }
    }catch(e){
        console.error(e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function POST(req: Request){
    try{
        const body = await req.json();
        const { id, sid } = body;
        if(!id || !sid) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
        await connectDB();
        const newSessionStore = new SessionStore({
            id,
            sid
        });
        await newSessionStore.save();
        return NextResponse.json({ 
            message: "SessionStore saved",
            newSessionStore
        })
    }catch(e){
        console.error(e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}