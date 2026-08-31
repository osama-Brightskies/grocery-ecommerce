import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AuthLayout from "../AuthLayout";
import { render } from "@testing-library/react";

function renderLayout(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="*" element={<div>auth content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("AuthLayout", () => {
  it("uses the forgot-password quote for the reset flow", () => {
    renderLayout("/auth/forgot-password");

    expect(screen.getByTestId("auth-layout")).toBeInTheDocument();
    expect(screen.getByTestId("auth-left-banner")).toBeInTheDocument();
    expect(
      screen.getByText(/Fresh products\. Clear operations/),
    ).toBeInTheDocument();
    expect(screen.getByText("auth content")).toBeInTheDocument();
  });

  it("uses the default quote for other auth routes", () => {
    renderLayout("/auth/login");

    expect(
      screen.getByText(/Keep your shelves fresh and your data even fresher/),
    ).toBeInTheDocument();
  });
});
