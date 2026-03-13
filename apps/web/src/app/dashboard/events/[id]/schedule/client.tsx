"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  addAssignmentAction,
  removeAssignmentAction,
  updateScheduleStatusAction,
} from "./actions";
import type { ScheduleWithAssignments } from "@/services/schedules";
import type { Member, Ministry } from "@odmooca/shared";
import type { ActionState } from "@/lib/actions";

interface ScheduleClientProps {
  eventId: string;
  schedule: ScheduleWithAssignments;
  members: Member[];
  ministries: Ministry[];
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Rascunho",
  published: "Publicada",
  archived: "Arquivada",
};

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-yellow-500/10 text-yellow-600",
  published: "bg-green-500/10 text-green-600",
  archived: "bg-zinc-500/10 text-zinc-500",
};

export function ScheduleClient({
  eventId,
  schedule,
  members,
  ministries,
}: ScheduleClientProps) {
  const [addOpen, setAddOpen] = useState(false);

  const initialState: ActionState = { success: false };
  const boundAction = addAssignmentAction.bind(null, schedule.id, eventId);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  // Close dialog and reset form after successful assignment
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      setAddOpen(false);
    }
  }, [state]);

  // Group assignments by ministry
  const byMinistry = schedule.assignments.reduce(
    (acc, a) => {
      const key = a.ministry_name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(a);
      return acc;
    },
    {} as Record<string, typeof schedule.assignments>
  );

  return (
    <>
      {/* Status and Actions Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[schedule.status] ?? ""}`}
          >
            {STATUS_LABELS[schedule.status] ?? schedule.status}
          </span>
          <span className="text-sm text-muted-foreground">
            {schedule.assignments.length} voluntário(s) escalado(s)
          </span>
        </div>
        <div className="flex gap-2">
          {schedule.status === "draft" && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() =>
                updateScheduleStatusAction(schedule.id, eventId, "published")
              }
            >
              Publicar Escala
            </Button>
          )}
          <Button size="sm" onClick={() => setAddOpen(true)}>
            + Escalar Voluntário
          </Button>
        </div>
      </div>

      {/* Add Assignment Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalar Voluntário</DialogTitle>
          </DialogHeader>
          <form
            ref={formRef}
            action={formAction}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="member_id">Membro *</Label>
              <select
                id="member_id"
                name="member_id"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="">Selecione...</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {state.errors?.member_id && (
                <p className="text-sm text-destructive">
                  {state.errors.member_id}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="ministry_id">Ministério *</Label>
              <select
                id="ministry_id"
                name="ministry_id"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                required
              >
                <option value="">Selecione...</option>
                {ministries.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {state.errors?.ministry_id && (
                <p className="text-sm text-destructive">
                  {state.errors.ministry_id}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="role">Função *</Label>
              <Input
                id="role"
                name="role"
                placeholder="Ex: Vocalista, Guitarrista, Operador..."
                required
              />
              {state.errors?.role && (
                <p className="text-sm text-destructive">{state.errors.role}</p>
              )}
            </div>

            {state.message && !state.success && (
              <p className="text-sm text-destructive">{state.message}</p>
            )}

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Escalando..." : "Escalar"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Assignments List grouped by Ministry */}
      {schedule.assignments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed bg-card p-12 text-center">
          <p className="text-lg font-medium">Escala vazia</p>
          <p className="text-sm text-muted-foreground">
            Adicione voluntários para montar a escala deste evento
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {Object.entries(byMinistry).map(([ministry, assignments]) => (
            <div key={ministry} className="rounded-xl border bg-card shadow-sm">
              <div className="border-b px-4 py-2">
                <h3 className="text-sm font-semibold text-muted-foreground">
                  {ministry}
                </h3>
              </div>
              <div className="divide-y">
                {assignments.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{a.member_name}</p>
                      <p className="text-xs text-muted-foreground">{a.role}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => removeAssignmentAction(a.id, eventId)}
                    >
                      Remover
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
