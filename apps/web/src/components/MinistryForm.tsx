"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/actions";
import type { Ministry } from "@odmooca/shared";

interface MinistryFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  ministry?: Ministry;
  onSuccess?: () => void;
}

const initialState: ActionState = { success: false };

export function MinistryForm({
  action,
  ministry,
  onSuccess,
}: MinistryFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
      onSuccess?.();
    }
  }, [state, onSuccess]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Ex: Louvor, Mídia, Recepção..."
          defaultValue={ministry?.name ?? ""}
          required
          disabled={isPending}
        />
        {state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Breve descrição do ministério (opcional)"
          defaultValue={ministry?.description ?? ""}
          disabled={isPending}
          rows={3}
        />
        {state.errors?.description && (
          <p className="text-sm text-destructive">{state.errors.description}</p>
        )}
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      {state.message && state.success && (
        <p className="text-sm text-green-600">{state.message}</p>
      )}

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending
          ? "Salvando..."
          : ministry
            ? "Atualizar Ministério"
            : "Criar Ministério"}
      </Button>
    </form>
  );
}
