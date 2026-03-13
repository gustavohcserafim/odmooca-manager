"use server";

import { revalidatePath } from "next/cache";
import {
  addAssignment,
  removeAssignment,
  updateScheduleStatus,
} from "@/services/schedules";
import type { ActionState } from "@/lib/actions";

export async function addAssignmentAction(
  scheduleId: string,
  eventId: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const memberId = formData.get("member_id") as string;
  const ministryId = formData.get("ministry_id") as string;
  const role = formData.get("role") as string;

  if (!memberId) {
    return { success: false, errors: { member_id: "Selecione um membro" } };
  }
  if (!ministryId) {
    return {
      success: false,
      errors: { ministry_id: "Selecione um ministério" },
    };
  }
  if (!role?.trim()) {
    return { success: false, errors: { role: "Informe a função" } };
  }

  try {
    await addAssignment(scheduleId, memberId, ministryId, role.trim());
    revalidatePath(`/dashboard/events/${eventId}/schedule`);
    return { success: true, message: "Voluntário escalado!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao escalar voluntário",
    };
  }
}

export async function removeAssignmentAction(
  assignmentId: string,
  eventId: string
): Promise<ActionState> {
  try {
    await removeAssignment(assignmentId);
    revalidatePath(`/dashboard/events/${eventId}/schedule`);
    return { success: true, message: "Voluntário removido da escala!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao remover voluntário",
    };
  }
}

export async function updateScheduleStatusAction(
  scheduleId: string,
  eventId: string,
  status: string
): Promise<ActionState> {
  try {
    await updateScheduleStatus(scheduleId, status);
    revalidatePath(`/dashboard/events/${eventId}/schedule`);
    return {
      success: true,
      message: `Escala ${status === "published" ? "publicada" : "atualizada"}!`,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Erro ao atualizar status",
    };
  }
}
