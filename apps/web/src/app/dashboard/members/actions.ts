"use server";

import { revalidatePath } from "next/cache";
import { validateMemberInput } from "@/core/members";
import {
  createMember,
  updateMember,
  deleteMember,
} from "@/services/members";
import type { ActionState } from "@/lib/actions";

export async function createMemberAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  const validation = validateMemberInput({ name, email, phone });
  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  try {
    await createMember(validation.data!);
    revalidatePath("/dashboard/members");
    return { success: true, message: "Membro cadastrado com sucesso!" };
  } catch (error) {
    const msg =
      error instanceof Error ? error.message : "Erro ao cadastrar membro";
    if (msg.includes("duplicate key") || msg.includes("unique")) {
      return {
        success: false,
        errors: { email: "Este e-mail já está cadastrado" },
      };
    }
    return { success: false, message: msg };
  }
}

export async function updateMemberAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  const validation = validateMemberInput({ name, email, phone });
  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  try {
    await updateMember(id, validation.data!);
    revalidatePath("/dashboard/members");
    return { success: true, message: "Membro atualizado com sucesso!" };
  } catch (error) {
    const msg =
      error instanceof Error
        ? error.message
        : "Erro ao atualizar membro";
    if (msg.includes("duplicate key") || msg.includes("unique")) {
      return {
        success: false,
        errors: { email: "Este e-mail já está cadastrado" },
      };
    }
    return { success: false, message: msg };
  }
}

export async function deleteMemberAction(
  id: string
): Promise<ActionState> {
  try {
    await deleteMember(id);
    revalidatePath("/dashboard/members");
    return { success: true, message: "Membro excluído com sucesso!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao excluir membro",
    };
  }
}
