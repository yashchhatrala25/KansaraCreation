import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { page, sessionId, device } = body;

    if (!page || !sessionId) {
      return NextResponse.json({ error: "Page and sessionId are required" }, { status: 400 });
    }

    const visit = await db.visit.create({
      data: {
        page,
        sessionId,
        device: device || "desktop",
      },
    });

    return NextResponse.json({ success: true, id: visit.id });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 });
  }
}
