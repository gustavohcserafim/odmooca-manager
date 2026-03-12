// ── Member Validation (Pure business logic, no framework dependencies) ───────

import type { ValidationResult } from "./ministries";

export interface MemberInput {
  name: string;
  email: string;
  phone?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateMemberName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Nome é obrigatório";
  if (trimmed.length < 2) return "Nome deve ter pelo menos 2 caracteres";
  if (trimmed.length > 150) return "Nome deve ter no máximo 150 caracteres";
  return null;
}

export function validateMemberEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return "E-mail é obrigatório";
  if (!EMAIL_REGEX.test(trimmed)) return "E-mail inválido";
  return null;
}

export function validateMemberPhone(
  phone: string | undefined
): string | null {
  if (!phone || !phone.trim()) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 10)
    return "Telefone deve ter pelo menos 10 dígitos";
  return null;
}

export function validateMemberInput(
  input: MemberInput
): ValidationResult<MemberInput> {
  const errors: Record<string, string> = {};

  const nameError = validateMemberName(input.name);
  if (nameError) errors.name = nameError;

  const emailError = validateMemberEmail(input.email);
  if (emailError) errors.email = emailError;

  const phoneError = validateMemberPhone(input.phone);
  if (phoneError) errors.phone = phoneError;

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: input.name.trim(),
      email: input.email.trim(),
      phone: input.phone?.trim() || undefined,
    },
  };
}
