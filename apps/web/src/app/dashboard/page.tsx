import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Bem-vindo, {user?.email}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Ministérios
          </h3>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Voluntários
          </h3>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground">
            Próximo Evento
          </h3>
          <p className="mt-2 text-3xl font-bold">—</p>
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        🚧 Em construção — funcionalidades em breve
      </p>
    </div>
  );
}
