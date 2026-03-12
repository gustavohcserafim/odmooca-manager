"use server";

import { revalidatePath } from "next/cache";
import { validateMinistryInput } from "@/core/ministries";
import {
  createMinistry,
  updateMinistry,
  deleteMinistry,
} from "@/services/ministries";

export type { ActionState } from "@/lib/actions";
import type { ActionState } from "@/lib/actions";

export async function createMinistryAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const validation = validateMinistryInput({ name, description });
  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  try {
    await createMinistry(validation.data!);
    revalidatePath("/dashboard/ministries");
    return { success: true, message: "Ministério criado com sucesso!" };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao criar ministério",
    };
  }
}

export async function updateMinistryAction(
  id: string,
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  const validation = validateMinistryInput({ name, description });
  if (!validation.success) {
    return { success: false, errors: validation.errors };
  }

  try {
    await updateMinistry(id, validation.data!);
    revalidatePath("/dashboard/ministries");
    return {
      success: true,
      message: "Ministério atualizado com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao atualizar ministério",
    };
  }
}

export async function deleteMinistryAction(
  id: string
): Promise<ActionState> {
  try {
    await deleteMinistry(id);
    revalidatePath("/dashboard/ministries");
    return {
      success: true,
      message: "Ministério excluído com sucesso!",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Erro ao excluir ministério",
    };
  }
}
