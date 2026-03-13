import { describe, it, expect } from "vitest";
import {
  validateMemberName,
  validateMemberEmail,
  validateMemberPhone,
  validateMemberInput,
  type MemberInput,
} from "./members";

describe("Member Validation", () => {
  describe("validateMemberName", () => {
    it("rejects empty name", () => {
      expect(validateMemberName("")).toBe("Nome é obrigatório");
    });

    it("rejects whitespace-only name", () => {
      expect(validateMemberName("   ")).toBe("Nome é obrigatório");
    });

    it("rejects name shorter than 2 characters", () => {
      expect(validateMemberName("A")).toBe(
        "Nome deve ter pelo menos 2 caracteres"
      );
    });

    it("rejects name longer than 150 characters", () => {
      expect(validateMemberName("A".repeat(151))).toBe(
        "Nome deve ter no máximo 150 caracteres"
      );
    });

    it("accepts valid name", () => {
      expect(validateMemberName("João Silva")).toBeNull();
    });

    it("trims whitespace", () => {
      expect(validateMemberName("  João  ")).toBeNull();
    });
  });

  describe("validateMemberEmail", () => {
    it("rejects empty email", () => {
      expect(validateMemberEmail("")).toBe("E-mail é obrigatório");
    });

    it("rejects invalid email format", () => {
      expect(validateMemberEmail("invalid")).toBe("E-mail inválido");
    });

    it("rejects email without @", () => {
      expect(validateMemberEmail("joao.com")).toBe("E-mail inválido");
    });

    it("accepts valid email", () => {
      expect(validateMemberEmail("joao@email.com")).toBeNull();
    });

    it("trims whitespace", () => {
      expect(validateMemberEmail("  joao@email.com  ")).toBeNull();
    });
  });

  describe("validateMemberPhone", () => {
    it("accepts empty phone (optional)", () => {
      expect(validateMemberPhone("")).toBeNull();
    });

    it("accepts undefined phone", () => {
      expect(validateMemberPhone(undefined)).toBeNull();
    });

    it("rejects phone shorter than 10 digits", () => {
      expect(validateMemberPhone("123456789")).toBe(
        "Telefone deve ter pelo menos 10 dígitos"
      );
    });

    it("accepts valid phone with 11 digits", () => {
      expect(validateMemberPhone("11999887766")).toBeNull();
    });

    it("accepts phone with formatting", () => {
      expect(validateMemberPhone("(11) 99988-7766")).toBeNull();
    });
  });

  describe("validateMemberInput", () => {
    it("returns errors for empty input", () => {
      const input: MemberInput = { name: "", email: "" };
      const result = validateMemberInput(input);
      expect(result.success).toBe(false);
      expect(result.errors?.name).toBeDefined();
      expect(result.errors?.email).toBeDefined();
    });

    it("returns success for valid input", () => {
      const input: MemberInput = {
        name: "João Silva",
        email: "joao@email.com",
      };
      const result = validateMemberInput(input);
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        name: "João Silva",
        email: "joao@email.com",
        phone: undefined,
      });
    });

    it("trims all fields", () => {
      const input: MemberInput = {
        name: "  João  ",
        email: "  joao@email.com  ",
        phone: "  11999887766  ",
      };
      const result = validateMemberInput(input);
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("João");
      expect(result.data?.email).toBe("joao@email.com");
      expect(result.data?.phone).toBe("11999887766");
    });

    it("allows optional phone", () => {
      const input: MemberInput = {
        name: "João",
        email: "joao@email.com",
      };
      const result = validateMemberInput(input);
      expect(result.success).toBe(true);
    });

    it("collects all field errors at once", () => {
      const input: MemberInput = {
        name: "",
        email: "invalid",
        phone: "123",
      };
      const result = validateMemberInput(input);
      expect(result.success).toBe(false);
      expect(Object.keys(result.errors!)).toHaveLength(3);
    });
  });
});
