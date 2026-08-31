import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

function Example() {
  return <h1>Vitest is configured</h1>;
}

describe("Vitest setup", () => {
  it("renders with React Testing Library", () => {
    render(<Example />);

    expect(
      screen.getByRole("heading", { name: /vitest is configured/i }),
    ).toBeInTheDocument();
  });
});
