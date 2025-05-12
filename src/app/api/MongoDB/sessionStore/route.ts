import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import SessionStore from "@/models/SessionStore";

export async function GET(req: Request){
    try{
        const headers = await req.headers;
        const sid = headers.get("sid");

        if(!sid){
            console.log("headersの中にsidが含まれていません");
            return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
        }
            
        await connectDB();
        const sessionStore = await SessionStore.findOne({ sid: sid });
        
        if(!sessionStore){     
            console.log("指定されたsidに対応するデータが見つかりませんでした");
            return NextResponse.json({ message: "This sid is invalid" }, { status: 200 });
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

        const { query } = body;

        if(query === "createSession"){
            const { id, sid } = body;
            if(!id || !sid) return NextResponse.json({ error: "This request is invalid" }, { status: 400 });
            
            const expireDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); //三日後に自動削除
    
            await connectDB();
            
            const newSessionStore = new SessionStore({
                id,
                sid,
                expireAt: expireDate
            });
            await newSessionStore.save();
            
            return NextResponse.json({
                status: 201,
                message: "SessionStore saved",
                newSessionStore
            })
        }else if(query === "deleteSession"){
            const { sid } = body;

            if(!sid){
                return NextResponse.json(
                    { error: "This request is invalid" },
                    { status: 200 }
                );
            }

            await connectDB();

            const deletedSession = await SessionStore.deleteOne({ sid: sid });

            if(deletedSession.deletedCount === 1){
                return NextResponse.json({ message: "SessionStore deleted", deletedSession });
            }else{
                return NextResponse.json({ message : "This sid is invalid"}, { status: 200 });
            }
        }else{
            return NextResponse.json({ message: "This query is invalid" }, { status: 200 });
        }
    }catch(e){
        console.error(e);
        return NextResponse.json({ error: "Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request){
    try{
        
    }catch(e){
        return NextResponse.json({ error: e }, { status: 500 });
    }
}