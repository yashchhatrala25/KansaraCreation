import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";
import { validatePhone, validatePincode, validateEmail, validateRequired } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kc_admin_token")?.value;
    const session = token ? verifyAdminToken(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let orders = await db.order.findMany();

    if (status && status !== "All") {
      orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
    }

    const formatted = orders.map((o) => {
      let items = [];
      try {
        items = typeof o.items === "string" ? JSON.parse(o.items) : o.items;
      } catch {
        items = [];
      }
      return {
        ...o,
        items,
      };
    });

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("Orders GET error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      phone,
      email,
      address,
      city,
      state,
      pincode,
      items,
      paymentMethod,
    } = body;

    // Field validations
    const nameVal = validateRequired(customerName, "Full Name");
    if (!nameVal.isValid) return NextResponse.json({ error: nameVal.error }, { status: 400 });

    const phoneVal = validatePhone(phone || "");
    if (!phoneVal.isValid) return NextResponse.json({ error: phoneVal.error }, { status: 400 });

    const emailVal = validateEmail(email || "");
    if (!emailVal.isValid) return NextResponse.json({ error: emailVal.error }, { status: 400 });

    const addrVal = validateRequired(address, "Address");
    if (!addrVal.isValid) return NextResponse.json({ error: addrVal.error }, { status: 400 });

    const cityVal = validateRequired(city, "City");
    if (!cityVal.isValid) return NextResponse.json({ error: cityVal.error }, { status: 400 });

    const stateVal = validateRequired(state, "State");
    if (!stateVal.isValid) return NextResponse.json({ error: stateVal.error }, { status: 400 });

    const pinVal = validatePincode(pincode || "");
    if (!pinVal.isValid) return NextResponse.json({ error: pinVal.error }, { status: 400 });

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total from items
    const total = items.reduce((sum: number, it: any) => sum + (it.price || 0) * (it.quantity || 1), 0);

    const newOrder = await db.order.create({
      data: {
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim().toLowerCase(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        items: JSON.stringify(items),
        total,
        status: "Pending",
        paymentMethod: paymentMethod === "UPI" ? "UPI (Online)" : "Cash on Delivery",
      },
    });

    return NextResponse.json(
      {
        success: true,
        orderId: newOrder.id,
        order: {
          ...newOrder,
          items,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Order POST error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
