"use server";

import { revalidatePath } from "next/cache";
import { validateEventInput } from "@/core/events";
import type { EventType } from "@odmooca/shared";
import { createEvent, updateEvent, deleteEvent } from "@/services/events";
import type { ActionState } from "@/lib/actions";

export async function createEventAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const date = formData.get("date") as string;

  const validation = validateEventInput({
    name,
    type: type as EventType,
    date,
  });
  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  try {
    await createEvent(validation.data!);
    revalidatePath("/dashboard/events");
    return { success: true, message: "Evento criado com sucesso!" };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro ao criar evento",
    };
  }
}

export async function updateEventAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const type = formData.get("type") as string;
  const date = formData.get("date") as string;

  const validation = validateEventInput({
    name,
    type: type as EventType,
    date,
  });
  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  try {
    await updateEvent(id, validation.data!);
    revalidatePath("/dashboard/events");
    return { success: true, message: "Evento atualizado com sucesso!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao atualizar evento",
    };
  }
}

export async function deleteEventAction(id: string): Promise<ActionState> {
  try {
    await deleteEvent(id);
    revalidatePath("/dashboard/events");
    return { success: true, message: "Evento excluído com sucesso!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao excluir evento",
    };
  }
}
