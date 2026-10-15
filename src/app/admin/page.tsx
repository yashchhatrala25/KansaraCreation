import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyAdminToken } from "@/lib/auth";

export default async function AdminIndexPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("kc_admin_token")?.value;
  const session = token ? verifyAdminToken(token) : null;

  if (!session) {
    redirect("/admin/login");
  }

  redirect("/admin/dashboard");
}
