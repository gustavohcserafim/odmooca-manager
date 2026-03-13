import { getMinistries } from "@/services/ministries";
import { MinistriesClient } from "./client";

export default async function MinistriesPage() {
  const ministries = await getMinistries();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ministérios</h2>
          <p className="text-muted-foreground">
            Gerencie os ministérios da igreja
          </p>
        </div>
      </div>

      <MinistriesClient ministries={ministries} />
    </div>
  );
}
