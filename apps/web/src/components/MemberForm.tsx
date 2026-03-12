"use client";

import { useActionState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/actions";
import type { Member } from "@odmooca/shared";

interface MemberFormProps {
  action: (
    prevState: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  member?: Member;
  onSuccess?: () => void;
}

const initialState: ActionState = { success: false };

export function MemberForm({ action, member, onSuccess }: MemberFormProps) {
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

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Nome *</Label>
        <Input
          id="name"
          name="name"
          placeholder="Nome completo"
          defaultValue={member?.name ?? ""}
          required
          disabled={isPending}
        />
        {state.errors?.name && (
          <p className="text-sm text-destructive">{state.errors.name}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="email@exemplo.com"
          defaultValue={member?.email ?? ""}
          required
          disabled={isPending}
        />
        {state.errors?.email && (
          <p className="text-sm text-destructive">{state.errors.email}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="(11) 99999-8888"
          defaultValue={member?.phone ?? ""}
          disabled={isPending}
        />
        {state.errors?.phone && (
          <p className="text-sm text-destructive">{state.errors.phone}</p>
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
          : member
            ? "Atualizar Membro"
            : "Cadastrar Membro"}
      </Button>
    </form>
  );
}
