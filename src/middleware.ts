import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname === "/users/login") {
    console.log("middleware");
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

    const email = sessionDbData.data.email;

    if (!email) {
      return NextResponse.next();
    }

    console.log(email);

    const userDbData = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/MongoDB/user`,
      {
        headers: {
          "Content-Type": "application/json",
          "email": email,
        },
      }
    );

    const user = userDbData.data?.user;

    if(!user){
        return NextResponse.next();
    }

    console.log("Hello!", user.familyName);

    return NextResponse.redirect(
      new URL(`${process.env.NEXT_PUBLIC_API_URL}/transactions/view`)
    );
  }
}
