// ── Ministry Validation (Pure business logic, no framework dependencies) ─────

export interface MinistryInput {
  name: string;
  description?: string;
}

export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: Record<string, string>;
}

/**
 * Validates a ministry name.
 * Returns an error message string, or null if valid.
 */
export function validateMinistryName(name: string): string | null {
  const trimmed = name.trim();

  if (!trimmed) {
    return "Nome do ministério é obrigatório";
  }

  if (trimmed.length < 2) {
    return "Nome deve ter pelo menos 2 caracteres";
  }

  if (trimmed.length > 100) {
    return "Nome deve ter no máximo 100 caracteres";
  }

  return null;
}

/**
 * Validates the full ministry input.
 * Returns a ValidationResult with cleaned data or field-level errors.
 */
export function validateMinistryInput(
  input: MinistryInput
): ValidationResult<MinistryInput> {
  const errors: Record<string, string> = {};

  const nameError = validateMinistryName(input.name);
  if (nameError) {
    errors.name = nameError;
  }

  if (input.description && input.description.trim().length > 500) {
    errors.description = "Descrição deve ter no máximo 500 caracteres";
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
    },
  };
}
