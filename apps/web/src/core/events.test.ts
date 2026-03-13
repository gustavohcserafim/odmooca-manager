import { describe, it, expect } from "vitest";
import {
  validateEventName,
  validateEventDate,
  validateEventInput,
  EVENT_TYPE_LABELS,
  type EventInput,
} from "./events";

describe("Event Validation", () => {
  describe("validateEventName", () => {
    it("rejects empty name", () => {
      expect(validateEventName("")).toBe("Nome do evento é obrigatório");
    });

    it("rejects whitespace-only name", () => {
      expect(validateEventName("   ")).toBe("Nome do evento é obrigatório");
    });

    it("rejects name shorter than 3 characters", () => {
      expect(validateEventName("Ab")).toBe(
        "Nome deve ter pelo menos 3 caracteres"
      );
    });

    it("rejects name longer than 150 characters", () => {
      expect(validateEventName("A".repeat(151))).toBe(
        "Nome deve ter no máximo 150 caracteres"
      );
    });

    it("accepts valid name", () => {
      expect(validateEventName("Culto Domingo")).toBeNull();
    });
  });

  describe("validateEventDate", () => {
    it("rejects empty date", () => {
      expect(validateEventDate("")).toBe("Data é obrigatória");
    });

    it("rejects invalid date format", () => {
      expect(validateEventDate("not-a-date")).toBe("Data inválida");
    });

    it("accepts valid ISO date", () => {
      expect(validateEventDate("2025-03-16T10:00")).toBeNull();
    });
  });

  describe("validateEventInput", () => {
    it("returns errors for empty input", () => {
      const input: EventInput = { name: "", type: "sunday_service", date: "" };
      const result = validateEventInput(input);
      expect(result.success).toBe(false);
      expect(result.errors?.name).toBeDefined();
      expect(result.errors?.date).toBeDefined();
    });

    it("returns success for valid input", () => {
      const input: EventInput = {
        name: "Culto Domingo",
        type: "sunday_service",
        date: "2025-03-16T10:00",
      };
      const result = validateEventInput(input);
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Culto Domingo");
    });

    it("trims name", () => {
      const input: EventInput = {
        name: "  Culto  ",
        type: "sunday_service",
        date: "2025-03-16T10:00",
      };
      const result = validateEventInput(input);
      expect(result.data?.name).toBe("Culto");
    });

    it("rejects invalid event type", () => {
      const input: EventInput = {
        name: "Culto",
        type: "invalid" as unknown as EventInput["type"],
        date: "2025-03-16T10:00",
      };
      const result = validateEventInput(input);
      expect(result.success).toBe(false);
      expect(result.errors?.type).toBeDefined();
    });
  });

  describe("EVENT_TYPE_LABELS", () => {
    it("has labels for all event types", () => {
      expect(EVENT_TYPE_LABELS.sunday_service).toBe("Culto de Domingo");
      expect(EVENT_TYPE_LABELS.wednesday_service).toBe("Culto de Quarta");
      expect(EVENT_TYPE_LABELS.special_event).toBe("Evento Especial");
    });
  });
});
