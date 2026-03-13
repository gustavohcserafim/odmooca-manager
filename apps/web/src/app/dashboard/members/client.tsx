"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MemberForm } from "@/components/MemberForm";
import { MemberCard } from "@/components/MemberCard";
import { createMemberAction, updateMemberAction } from "./actions";
import type { Member } from "@odmooca/shared";

interface MembersClientProps {
  members: Member[];
}

export function MembersClient({ members }: MembersClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);

  return (
    <>
      <Button className="self-end" onClick={() => setCreateOpen(true)}>
        + Novo Membro
      </Button>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Membro</DialogTitle>
          </DialogHeader>
          <MemberForm
            action={createMemberAction}
            onSuccess={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editMember}
        onOpenChange={(open) => !open && setEditMember(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Membro</DialogTitle>
          </DialogHeader>
          {editMember && (
            <MemberForm
              action={updateMemberAction.bind(null, editMember.id)}
              member={editMember}
              onSuccess={() => setEditMember(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {members.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-medium">Nenhum membro cadastrado</p>
          <p className="text-sm text-muted-foreground">
            Cadastre o primeiro membro para começar
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={setEditMember}
            />
          ))}
        </div>
      )}
    </>
  );
}
