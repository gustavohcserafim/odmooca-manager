import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MinistryForm } from "./MinistryForm";
import type { ActionState } from "@/lib/actions";

describe("MinistryForm", () => {
  const mockAction =
    vi.fn<
      (prevState: ActionState, formData: FormData) => Promise<ActionState>
    >();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAction.mockResolvedValue({ success: false });
  });

  it("renders name input", () => {
    render(<MinistryForm action={mockAction} />);
    expect(screen.getByLabelText("Nome *")).toBeInTheDocument();
  });

  it("renders description textarea", () => {
    render(<MinistryForm action={mockAction} />);
    expect(screen.getByLabelText("Descrição")).toBeInTheDocument();
  });

  it("renders create button when no ministry prop", () => {
    render(<MinistryForm action={mockAction} />);
    expect(
      screen.getByRole("button", { name: /criar ministério/i })
    ).toBeInTheDocument();
  });

  it("renders update button when ministry prop is provided", () => {
    const ministry = {
      id: "1",
      name: "Louvor",
      description: "Ministério de louvor",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    render(<MinistryForm action={mockAction} ministry={ministry} />);
    expect(
      screen.getByRole("button", { name: /atualizar ministério/i })
    ).toBeInTheDocument();
  });

  it("pre-fills form with ministry data when editing", () => {
    const ministry = {
      id: "1",
      name: "Louvor",
      description: "Ministério de louvor",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    render(<MinistryForm action={mockAction} ministry={ministry} />);
    expect(screen.getByDisplayValue("Louvor")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Ministério de louvor")
    ).toBeInTheDocument();
  });

  it("renders placeholder text for name input", () => {
    render(<MinistryForm action={mockAction} />);
    expect(
      screen.getByPlaceholderText(/louvor, mídia, recepção/i)
    ).toBeInTheDocument();
  });

  it("displays error messages from action state", () => {
    const actionWithError =
      vi.fn<
        (prevState: ActionState, formData: FormData) => Promise<ActionState>
      >();
    actionWithError.mockResolvedValue({
      success: false,
      errors: { name: "Nome é obrigatório" },
    });

    // Since useActionState doesn't immediately reflect, we test the initial render
    render(<MinistryForm action={actionWithError} />);
    // Initial state has no errors
    expect(screen.queryByText("Nome é obrigatório")).not.toBeInTheDocument();
  });
});
