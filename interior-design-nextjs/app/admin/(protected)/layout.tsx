import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // ✅ MUST await
  const token = cookieStore.get("admin_token");

  if (!token) {
    redirect("/admin/login");
  }

  const res = await fetch(
    `${process.env.BACKEND_URL}/auth/admin/validate`,
    {
      headers: {
        Cookie: `admin_token=${token.value}`,
      },
      cache: "no-store",
    }
  );

  if (!res.ok) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
