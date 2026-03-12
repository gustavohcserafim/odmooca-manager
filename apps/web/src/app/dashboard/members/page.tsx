import { getMembers } from "@/services/members";
import { MembersClient } from "./client";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Membros</h2>
          <p className="text-muted-foreground">
            Gerencie os membros da igreja
          </p>
        </div>
      </div>

      <MembersClient members={members} />
    </div>
  );
}
