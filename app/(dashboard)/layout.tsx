import { Sidebar } from "@/components/sidebar";
import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: { user } } = await createServerClient().auth.getUser();
  if (!user) redirect("/login");
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar user={{
        email: user.email || "",
        name: typeof user.user_metadata?.full_name === "string"
          ? user.user_metadata.full_name : "",
      }} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
