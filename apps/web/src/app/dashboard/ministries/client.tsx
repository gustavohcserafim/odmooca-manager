"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MinistryForm } from "@/components/MinistryForm";
import { MinistryCard } from "@/components/MinistryCard";
import {
  createMinistryAction,
  updateMinistryAction,
} from "./actions";
import type { Ministry } from "@odmooca/shared";

interface MinistriesClientProps {
  ministries: Ministry[];
}

export function MinistriesClient({ ministries }: MinistriesClientProps) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editMinistry, setEditMinistry] = useState<Ministry | null>(null);

  return (
    <>
      {/* Create Button */}
      <Button className="self-end" onClick={() => setCreateOpen(true)}>
        + Novo Ministério
      </Button>

      {/* Create Dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Ministério</DialogTitle>
          </DialogHeader>
          <MinistryForm
            action={createMinistryAction}
            onSuccess={() => setCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!editMinistry}
        onOpenChange={(open) => !open && setEditMinistry(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Ministério</DialogTitle>
          </DialogHeader>
          {editMinistry && (
            <MinistryForm
              action={updateMinistryAction.bind(null, editMinistry.id)}
              ministry={editMinistry}
              onSuccess={() => setEditMinistry(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Ministry List */}
      {ministries.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-medium">
            Nenhum ministério cadastrado
          </p>
          <p className="text-sm text-muted-foreground">
            Crie o primeiro ministério para começar
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {ministries.map((ministry) => (
            <MinistryCard
              key={ministry.id}
              ministry={ministry}
              onEdit={setEditMinistry}
            />
          ))}
        </div>
      )}
    </>
  );
}
