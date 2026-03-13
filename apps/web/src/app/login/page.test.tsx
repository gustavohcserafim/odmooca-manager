import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./page";

// Mock Supabase client
const mockSignInWithOtp = vi.fn();
vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    auth: {
      signInWithOtp: mockSignInWithOtp,
    },
  }),
}));

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the login page title", () => {
    render(<LoginPage />);
    expect(screen.getByText("OD Mooca Manager")).toBeInTheDocument();
  });

  it("renders the email input field", () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText("seu@email.com")).toBeInTheDocument();
  });

  it("renders the login button", () => {
    render(<LoginPage />);
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("shows validation error for empty email", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    const button = screen.getByRole("button", { name: /entrar/i });
    await user.click(button);

    expect(mockSignInWithOtp).not.toHaveBeenCalled();
  });

  it("calls signInWithOtp with valid email", async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<LoginPage />);

    const input = screen.getByPlaceholderText("seu@email.com");
    await user.type(input, "test@example.com");

    const button = screen.getByRole("button", { name: /entrar/i });
    await user.click(button);

    expect(mockSignInWithOtp).toHaveBeenCalledWith({
      email: "test@example.com",
      options: {
        emailRedirectTo: expect.stringContaining("/auth/callback"),
      },
    });
  });

  it("shows success message after sending magic link", async () => {
    mockSignInWithOtp.mockResolvedValue({ error: null });
    const user = userEvent.setup();
    render(<LoginPage />);

    const input = screen.getByPlaceholderText("seu@email.com");
    await user.type(input, "test@example.com");

    const button = screen.getByRole("button", { name: /entrar/i });
    await user.click(button);

    expect(
      await screen.findByText(/verifique seu e-mail/i)
    ).toBeInTheDocument();
  });

  it("shows error message on auth failure", async () => {
    mockSignInWithOtp.mockResolvedValue({
      error: { message: "Rate limit exceeded" },
    });
    const user = userEvent.setup();
    render(<LoginPage />);

    const input = screen.getByPlaceholderText("seu@email.com");
    await user.type(input, "test@example.com");

    const button = screen.getByRole("button", { name: /entrar/i });
    await user.click(button);

    expect(await screen.findByText(/rate limit exceeded/i)).toBeInTheDocument();
  });
});
