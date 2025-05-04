import Deal from "@/models/Deal";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";

export async function GET(req: Request) {
  try {
    const headers = await req.headers;
    const query = JSON.parse(headers.get("query") as string);

    if (!query)
      return NextResponse.json(
        { error: "This request is invalid" },
        { status: 400 }
      );

    await connectDB();
    const deals = await Deal.find(query).lean();

    if (!deals) {
      return NextResponse.json(
        { error: "This sid is invalid" },
        { status: 400 }
      );
    } else {
      return NextResponse.json({
        message: "Get deals",
        deals: deals,
      });
    }
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      format,
      name,
      money,
      dueDate,
      status,
      memo,
      lenderId,
      borrowerId,
      registrantId,
    } = body;
    const requiredFields = {
      format,
      name,
      money,
      dueDate,
      status,
      registrantId,
    };

    if (Object.values(requiredFields).some((v) => !v))
      return NextResponse.json(
        { error: "This request is invalid" },
        { status: 400 }
      );
    console.log(registrantId);
    await connectDB();

    const newDeal = new Deal({
      format,
      name,
      money,
      dueDate,
      status,
      memo: memo ?? "",
      lenderId: lenderId ?? "",
      borrowerId: borrowerId ?? "",
      registrantId: registrantId,
    });
    console.log(newDeal);
    await newDeal.save();

    return NextResponse.json({
      message: "SessionStore saved",
      newDeal,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { query } = body;

    if (query === "update") {
      const { _id, format, name, money, dueDate, status, memo } = body;
      const requiredFields = {
        _id,
        format,
        name,
        money,
        dueDate,
        status,
      };

      if (Object.values(requiredFields).some((v) => !v))
        return NextResponse.json(
          { error: "This request is invalid" },
          { status: 400 }
        );
      await connectDB();

      await Deal.updateOne(
        { _id: _id },
        {
          $set: {
            format: format,
            name: name,
            money: money,
            dueDate: dueDate,
            status: status,
            memo: memo ?? ""
          },
        }
      );
    } else if (query === "changeStatus") {
      const { _id, status } = body;
      if (!status || !_id) {
        return NextResponse.json(
          { error: "This request is invalid" },
          { status: 400 }
        );
      }

      await connectDB();

      await Deal.updateOne(
        { _id: _id },
        {
          $set: {
            status: status,
          },
        }
      );
    }

    return NextResponse.json({
      message: "success update deal",
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { _id } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "This request is invalid" },
        { status: 400 }
      );
    }

    await connectDB();

    const deletedDeal = await Deal.findByIdAndDelete(_id);

    if (!deletedDeal) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Success delete deal",
      deletedDeal,
    });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}
