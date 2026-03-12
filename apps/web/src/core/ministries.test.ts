import { describe, it, expect } from "vitest";
import {
  validateMinistryName,
  validateMinistryInput,
  type MinistryInput,
} from "./ministries";

describe("Ministry Validation", () => {
  describe("validateMinistryName", () => {
    it("rejects empty name", () => {
      const result = validateMinistryName("");
      expect(result).toBe("Nome do ministério é obrigatório");
    });

    it("rejects whitespace-only name", () => {
      const result = validateMinistryName("   ");
      expect(result).toBe("Nome do ministério é obrigatório");
    });

    it("rejects name shorter than 2 characters", () => {
      const result = validateMinistryName("A");
      expect(result).toBe("Nome deve ter pelo menos 2 caracteres");
    });

    it("rejects name longer than 100 characters", () => {
      const result = validateMinistryName("A".repeat(101));
      expect(result).toBe("Nome deve ter no máximo 100 caracteres");
    });

    it("accepts valid name", () => {
      const result = validateMinistryName("Louvor");
      expect(result).toBeNull();
    });

    it("trims whitespace from name", () => {
      const result = validateMinistryName("  Louvor  ");
      expect(result).toBeNull();
    });
  });

  describe("validateMinistryInput", () => {
    it("returns errors for invalid input", () => {
      const input: MinistryInput = { name: "", description: "" };
      const result = validateMinistryInput(input);
      expect(result.success).toBe(false);
      expect(result.errors?.name).toBeDefined();
    });

    it("returns success for valid input", () => {
      const input: MinistryInput = {
        name: "Louvor",
        description: "Ministério de louvor e adoração",
      };
      const result = validateMinistryInput(input);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        name: "Louvor",
        description: "Ministério de louvor e adoração",
      });
    });

    it("trims name and description", () => {
      const input: MinistryInput = {
        name: "  Louvor  ",
        description: "  Desc  ",
      };
      const result = validateMinistryInput(input);
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Louvor");
      expect(result.data?.description).toBe("Desc");
    });

    it("allows empty description", () => {
      const input: MinistryInput = { name: "Louvor" };
      const result = validateMinistryInput(input);
      expect(result.success).toBe(true);
    });

    it("rejects description longer than 500 characters", () => {
      const input: MinistryInput = {
        name: "Louvor",
        description: "A".repeat(501),
      };
      const result = validateMinistryInput(input);
      expect(result.success).toBe(false);
      expect(result.errors?.description).toBeDefined();
    });
  });
});
