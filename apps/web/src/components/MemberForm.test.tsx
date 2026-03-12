import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemberForm } from "./MemberForm";
import type { ActionState } from "@/lib/actions";

describe("MemberForm", () => {
  const mockAction = vi.fn<
    (prevState: ActionState, formData: FormData) => Promise<ActionState>
  >();

  beforeEach(() => {
    vi.clearAllMocks();
    mockAction.mockResolvedValue({ success: false });
  });

  it("renders name input", () => {
    render(<MemberForm action={mockAction} />);
    expect(screen.getByLabelText("Nome *")).toBeInTheDocument();
  });

  it("renders email input", () => {
    render(<MemberForm action={mockAction} />);
    expect(screen.getByLabelText("E-mail *")).toBeInTheDocument();
  });

  it("renders phone input", () => {
    render(<MemberForm action={mockAction} />);
    expect(screen.getByLabelText("Telefone")).toBeInTheDocument();
  });

  it("renders create button when no member prop", () => {
    render(<MemberForm action={mockAction} />);
    expect(
      screen.getByRole("button", { name: /cadastrar membro/i })
    ).toBeInTheDocument();
  });

  it("renders update button when member prop is provided", () => {
    const member = {
      id: "1",
      name: "João",
      email: "joao@email.com",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    render(<MemberForm action={mockAction} member={member} />);
    expect(
      screen.getByRole("button", { name: /atualizar membro/i })
    ).toBeInTheDocument();
  });

  it("pre-fills form with member data when editing", () => {
    const member = {
      id: "1",
      name: "João Silva",
      email: "joao@email.com",
      phone: "11999887766",
      isActive: true,
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    };
    render(<MemberForm action={mockAction} member={member} />);
    expect(screen.getByDisplayValue("João Silva")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("joao@email.com")
    ).toBeInTheDocument();
    expect(screen.getByDisplayValue("11999887766")).toBeInTheDocument();
  });

  it("renders placeholder text for inputs", () => {
    render(<MemberForm action={mockAction} />);
    expect(
      screen.getByPlaceholderText("Nome completo")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("email@exemplo.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("(11) 99999-8888")
    ).toBeInTheDocument();
  });
});
