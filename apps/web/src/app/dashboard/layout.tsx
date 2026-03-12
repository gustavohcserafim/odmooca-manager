import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-lg font-semibold">
              OD Mooca
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link
                href="/dashboard/ministries"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Ministérios
              </Link>
              <Link
                href="/dashboard/members"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Membros
              </Link>
              <Link
                href="/dashboard/events"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Eventos
              </Link>
            </nav>
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-4 py-6">{children}</main>
    </div>
  );
}
