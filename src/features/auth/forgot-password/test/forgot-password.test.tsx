import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ForgotPasswordPage from "../ForgotPasswordPage";
import { forgotPasswordSchema } from "../schemas/forgot-password.schema";
import { renderAuthPage } from "../../test/test-utils";

describe("ForgotPasswordPage", () => {
  it("renders the reset email form and information", () => {
    renderAuthPage(<ForgotPasswordPage />);

    expect(screen.getByTestId("forgot-password-page")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Reset your password" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/you will receive a 6-digit verification code/i),
    ).toBeInTheDocument();
  });

  it("validates the email field", async () => {
    renderAuthPage(<ForgotPasswordPage />);

    fireEvent.click(screen.getByTestId("forgot-password-submit-button"));

    expect(
      await screen.findByText("Please enter a valid email address"),
    ).toBeInTheDocument();
  });
});

describe("forgotPasswordSchema", () => {
  it("accepts a valid email", () => {
    expect(forgotPasswordSchema.safeParse({ email: "user@example.com" }).success)
      .toBe(true);
  });
});
