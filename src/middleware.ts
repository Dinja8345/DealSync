import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  console.log(req.nextUrl.pathname);
  if (req.nextUrl.pathname === "/users/login") {
    const cookie = req.cookies.get("sid");
    const sid = cookie?.value;
    if (!sid) {
      return NextResponse.next();
    }

    const sessionDbData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`,
      {
        headers: {
          "Content-Type": "application/json",
          "sid": sid,
        },
      }
    );

    const id = sessionDbData.data.id;

    if (!id) {
      return NextResponse.next();
    }
    
    const userDbData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
      {
        headers: {
          "Content-Type": "application/json",
          "id": id,
        },
      }
    );

    const user = userDbData.data?.user;

    if(!user){
        return NextResponse.next();
    }

    console.log("Hello!", user.familyName);

    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_API_URL}/deals/view`)
    );
  }else if(req.nextUrl.pathname === "/deals/add" || req.nextUrl.pathname === "/deals/view"){
    const cookie = req.cookies.get("sid");
    const sid = cookie?.value;
    if (!sid) {
      return NextResponse.redirect(
        new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/login`)
      );
    }

    const sessionDbData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/sessionStore`,
      {
        headers: {
          "Content-Type": "application/json",
          "sid": sid,
        },
      }
    );

    const id = sessionDbData.data.id;

    if (!id) {
      return NextResponse.redirect(
        new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/login`)
      );
    }
    
    const userDbData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
      {
        headers: {
          "Content-Type": "application/json",
          "id": id,
        },
      }
    );

    const user = userDbData.data?.user;

    if(user){
        return NextResponse.next();
    }else{
      return NextResponse.redirect(
        new URL(`${process.env.NEXT_PUBLIC_API_URL}/users/login`)
      );
    }
  }
}
