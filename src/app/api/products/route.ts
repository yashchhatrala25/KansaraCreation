import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import { verifyAdminToken } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const query = searchParams.get("q")?.toLowerCase();
    const featured = searchParams.get("featured");

    let products = await db.product.findMany();

    if (category && category !== "All") {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }

    if (featured === "true") {
      products = products.filter((p) => p.featured === true);
    }

    if (query) {
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query)
      );
    }

    // Parse images array safely
    const formatted = products.map((p) => {
      let images: string[] = [];
      try {
        images = typeof p.images === "string" ? JSON.parse(p.images) : p.images;
      } catch {
        images = [p.images || "/images/products/calendar-hoop.jpg"];
      }
      return {
        ...p,
        images,
      };
    });

    return NextResponse.json(formatted);
  } catch (err: any) {
    console.error("Products GET error:", err);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("kc_admin_token")?.value;
    const session = token ? verifyAdminToken(token) : null;

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, price, category, images, stock, featured } = body;

    if (!name || !description || price === undefined || !category) {
      return NextResponse.json(
        { error: "Name, description, price, and category are required" },
        { status: 400 }
      );
    }

    const imageArray = Array.isArray(images) ? images : [images || "/images/products/calendar-hoop.jpg"];

    const newProduct = await db.product.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        category: category.trim(),
        images: JSON.stringify(imageArray),
        stock: parseInt(stock, 10) || 10,
        featured: Boolean(featured),
      },
    });

    return NextResponse.json(
      {
        ...newProduct,
        images: imageArray,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Product POST error:", err);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}
