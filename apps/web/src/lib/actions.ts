// Shared type for Server Action return values
export type ActionState = {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
};
