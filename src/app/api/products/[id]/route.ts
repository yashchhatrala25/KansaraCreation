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
    const product = await db.product.findUnique({ where: { id } });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    let images: string[] = [];
    try {
      images = typeof product.images === "string" ? JSON.parse(product.images) : product.images;
    } catch {
      images = [product.images || "/images/products/calendar-hoop.jpg"];
    }

    return NextResponse.json({
      ...product,
      images,
    });
  } catch (err: any) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
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
    const { name, description, price, category, images, stock, featured } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (price !== undefined) updateData.price = parseFloat(price) || 0;
    if (category !== undefined) updateData.category = category.trim();
    if (images !== undefined) {
      updateData.images = JSON.stringify(Array.isArray(images) ? images : [images]);
    }
    if (stock !== undefined) updateData.stock = parseInt(stock, 10) || 0;
    if (featured !== undefined) updateData.featured = Boolean(featured);

    const updated = await db.product.update({
      where: { id },
      data: updateData,
    });

    let formattedImages: string[] = [];
    try {
      formattedImages = typeof updated.images === "string" ? JSON.parse(updated.images) : updated.images;
    } catch {
      formattedImages = [updated.images || "/images/products/calendar-hoop.jpg"];
    }

    return NextResponse.json({
      ...updated,
      images: formattedImages,
    });
  } catch (err: any) {
    console.error("Product PUT error:", err);
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
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
    const deleted = await db.product.delete({ where: { id } });

    return NextResponse.json({ success: true, deletedId: deleted.id });
  } catch (err: any) {
    console.error("Product DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
