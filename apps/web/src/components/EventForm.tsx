"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/actions";
import type { ChurchEvent, EventType } from "@odmooca/shared";
import { EVENT_TYPE_LABELS } from "@/core/events";

interface EventFormProps {
  action: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  event?: ChurchEvent;
  onSuccess?: () => void;
}

const initialState: ActionState = { success: false };

export function EventForm({ action, event, onSuccess }: EventFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [state, onSuccess]);

  const eventTypes: EventType[] = [
    "sunday_service",
    "wednesday_service",
    "special_event",
  ];

  // Format date for datetime-local input
  const defaultDate = event?.date
    ? new Date(event.date).toISOString().slice(0, 16)
    : "";

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Culto Domingo 16/03"
          defaultValue={event?.name ?? ""}
          required
          disabled={isPending}
        />
        {state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="type">Tipo *</Label>
        <select
          id="type"
          name="type"
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          defaultValue={event?.type ?? "sunday_service"}
          disabled={isPending}
        >
          {eventTypes.map((t) => (
            <option key={t} value={t}>
              {EVENT_TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        {state.errors?.type && (
          <p className="text-sm text-destructive">{state.errors.type}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="date">Data e Hora *</Label>
        <Input
          id="date"
          name="date"
          type="datetime-local"
          defaultValue={defaultDate}
          required
          disabled={isPending}
        />
        {state.errors?.date && (
          <p className="text-sm text-destructive">{state.errors.date}</p>
        )}
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending
          ? "Salvando..."
          : event
            ? "Atualizar Evento"
            : "Criar Evento"}
      </Button>
    </form>
  );
}
