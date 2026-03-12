"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { deleteMinistryAction } from "@/app/dashboard/ministries/actions";
import type { Ministry } from "@odmooca/shared";

interface MinistryCardProps {
  ministry: Ministry;
  onEdit: (ministry: Ministry) => void;
}

export function MinistryCard({ ministry, onEdit }: MinistryCardProps) {
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`Excluir o ministério "${ministry.name}"?`)) return;

    setDeleting(true);
    await deleteMinistryAction(ministry.id);
    setDeleting(false);
  }

  return (
    <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="font-semibold">{ministry.name}</h3>
        {ministry.description && (
          <p className="text-sm text-muted-foreground">
            {ministry.description}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(ministry)}
        >
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
