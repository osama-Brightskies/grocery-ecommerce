import { screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import VerifyOtpPage from "../VerifyOtpPage";
import { verifyOtpSchema } from "../schemas/verify-otp.schema";
import { renderAuthPage } from "../../test/test-utils";
import { useResetFlowStore } from "@/store/useResetFlowStore";

describe("VerifyOtpPage", () => {
  afterEach(() => {
    useResetFlowStore.getState().clearResetFlow();
  });

  it("renders the code form for the stored reset email", () => {
    useResetFlowStore.getState().setResetEmail("user@example.com");
    renderAuthPage(<VerifyOtpPage />);

    expect(screen.getByTestId("verify-otp-page")).toBeInTheDocument();
    expect(screen.getByText(/user@example.com/)).toBeInTheDocument();
    expect(screen.getByTestId("resend-code-button")).toBeInTheDocument();
  });

});

describe("verifyOtpSchema", () => {
  it("accepts a six-character code", () => {
    expect(verifyOtpSchema.safeParse({ code: "123456" }).success).toBe(true);
  });

  it("rejects a code with the wrong length", () => {
    const result = verifyOtpSchema.safeParse({ code: "123" });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe(
        "Verification code must be exactly 6 digits",
      );
    }
  });
});
