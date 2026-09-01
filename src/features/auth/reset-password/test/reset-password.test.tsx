import { act, fireEvent, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import ResetPasswordPage from "../ResetPasswordPage";
import { resetPasswordSchema } from "../schemas/reset-password.schema";
import { renderAuthPage } from "../../test/test-utils";
import { useResetFlowStore } from "@/store/useResetFlowStore";

describe("ResetPasswordPage", () => {
  afterEach(() => {
    act(() => {
      useResetFlowStore.getState().clearResetFlow();
    });
  });

  it("renders the password reset form with a reset token", () => {
    act(() => {
      useResetFlowStore.getState().setResetToken("reset-token");
    });
    renderAuthPage(<ResetPasswordPage />);

    expect(screen.getByTestId("reset-password-page")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Create new password" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("reset-password-form")).toBeInTheDocument();
  });

  it("validates both password fields", async () => {
    act(() => {
      useResetFlowStore.getState().setResetToken("reset-token");
    });
    renderAuthPage(<ResetPasswordPage />);

    fireEvent.click(screen.getByTestId("reset-password-submit-button"));

    expect(
      await screen.findByText("Password must be at least 8 characters"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Please confirm your new password"),
    ).toBeInTheDocument();
  });
});

describe("resetPasswordSchema", () => {
  it("rejects mismatched passwords", () => {
    const result = resetPasswordSchema.safeParse({
      newPassword: "password123",
      confirmPassword: "different123",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("Passwords do not match");
    }
  });
});
