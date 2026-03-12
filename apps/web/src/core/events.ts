// ── Event Validation (Pure business logic) ──────────────────────────

import type { EventType } from "@odmooca/shared";
import type { ValidationResult } from "./ministries";

export interface EventInput {
  name: string;
  type: EventType;
  date: string;
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  sunday_service: "Culto de Domingo",
  wednesday_service: "Culto de Quarta",
  special_event: "Evento Especial",
};

const VALID_EVENT_TYPES: EventType[] = [
  "sunday_service",
  "wednesday_service",
  "special_event",
];

export function validateEventName(name: string): string | null {
  const trimmed = name.trim();
  if (!trimmed) return "Nome do evento é obrigatório";
  if (trimmed.length < 3)
    return "Nome deve ter pelo menos 3 caracteres";
  if (trimmed.length > 150)
    return "Nome deve ter no máximo 150 caracteres";
  return null;
}

export function validateEventDate(date: string): string | null {
  if (!date.trim()) return "Data é obrigatória";
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return "Data inválida";
  return null;
}

export function validateEventInput(
  input: EventInput
): ValidationResult<EventInput> {
  const errors: Record<string, string> = {};

  const nameError = validateEventName(input.name);
  if (nameError) errors.name = nameError;

  if (!VALID_EVENT_TYPES.includes(input.type)) {
    errors.type = "Tipo de evento inválido";
  }

  const dateError = validateEventDate(input.date);
  if (dateError) errors.date = dateError;

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return {
    success: true,
    data: {
      name: input.name.trim(),
      type: input.type,
      date: input.date,
    },
  };
}
