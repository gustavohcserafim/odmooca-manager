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
      <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link
              href="/dashboard"
              className="text-2xl font-heading font-black uppercase tracking-tighter text-primary leading-none"
            >
              Onda Dura
              <br />
              Mooca
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-bold uppercase tracking-wider">
              <Link
                href="/dashboard/ministries"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Ministérios
              </Link>
              <Link
                href="/dashboard/members"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Membros
              </Link>
              <Link
                href="/dashboard/events"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Eventos
              </Link>
            </nav>
          </div>
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="text-sm font-bold uppercase tracking-wider text-muted-foreground hover:text-destructive transition-colors"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
