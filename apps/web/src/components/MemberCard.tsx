"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteMemberAction } from "@/app/dashboard/members/actions";
import type { Member } from "@odmooca/shared";

interface MemberCardProps {
  member: Member;
  onEdit: (member: Member) => void;
}

export function MemberCard({ member, onEdit }: MemberCardProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Excluir o membro "${member.name}"?`)) return;

    setDeleting(true);
    await deleteMemberAction(member.id);
    setDeleting(false);
  }

  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{member.name}</h3>
        <p className="text-sm text-muted-foreground">{member.email}</p>
        {member.phone && (
          <p className="text-xs text-muted-foreground">{member.phone}</p>
        )}
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(member)}>
          Editar
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? "..." : "Excluir"}
        </Button>
      </div>
    </div>
  );
}
