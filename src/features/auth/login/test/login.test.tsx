import { fireEvent, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LoginPage from "../LoginPage";
import { loginSchema } from "../schemas/login.schema";
import { renderAuthPage } from "../../test/test-utils";

describe("LoginPage", () => {
  it("renders the login form", () => {
    renderAuthPage(<LoginPage />);

    expect(screen.getByTestId("login-page")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Welcome back" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("shows validation messages for an empty submission", async () => {
    renderAuthPage(<LoginPage />);

    fireEvent.click(screen.getByTestId("login-submit-button"));

    expect(
      await screen.findByText("Please enter a valid email address"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password is required"),
    ).toBeInTheDocument();
  });
});

describe("loginSchema", () => {
  it("normalizes a valid email", () => {
    expect(
      loginSchema.parse({
        email: "ADMIN@EXAMPLE.COM",
        password: "password123",
      }),
    ).toEqual({ email: "admin@example.com", password: "password123" });
  });
});
