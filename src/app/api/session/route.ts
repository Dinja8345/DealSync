import { cookies } from 'next/headers';
import { getIronSession, IronSessionData } from 'iron-session';
import { NextResponse } from 'next/server';

declare module 'iron-session' {
  interface IronSessionData {
    username?: string;
    email?: string;
  }
}

export async function GET(){
    const cookieStore = await cookies();
    const SESSION_PASS = process.env.SESSION_PASS as string
    
    const session = await getIronSession<IronSessionData>(cookieStore, {
        password: SESSION_PASS,
        cookieName: "sid", 
        cookieOptions: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }
    });
    
    return NextResponse.json({
        message: "Session retrived",
        session
    })
}

export async function POST(req: Request) {
    try{
        const body = await req.json();
        const { email } = body;
        const cookieStore = await cookies();
    const SESSION_PASS = process.env.SESSION_PASS as string
    
    const session = await getIronSession<IronSessionData>(cookieStore, {
        password: SESSION_PASS,
        cookieName: "sid", 
        cookieOptions: {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax"
        }
    });
    session.email = email;

    await session.save()

    return NextResponse.json({
        message: "Session saved",
        session,
    })
    }
    catch(e){
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    
}