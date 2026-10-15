import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await db.order.findUnique({ where: { id } });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    let items = [];
    try {
      items = typeof order.items === "string" ? JSON.parse(order.items) : order.items;
    } catch {
      items = [];
    }

    return NextResponse.json({ ...order, items });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kc_admin_token")?.value;
    const session = token ? verifyAdminToken(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const validStatuses = ["Pending", "Confirmed", "Packed", "Shipped", "Delivered", "Cancelled"];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await db.order.update({
      where: { id },
      data: { status },
    });

    let items = [];
    try {
      items = typeof updated.items === "string" ? JSON.parse(updated.items) : updated.items;
    } catch {
      items = [];
    }

    return NextResponse.json({
      success: true,
      order: {
        ...updated,
        items,
      },
    });
  } catch (err: any) {
    console.error("Order PATCH error:", err);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
