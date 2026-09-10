import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

export function renderOrdersPage(
  ui: ReactNode,
  initialEntry = "/orders",
  routePath = "/orders",
) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path={routePath} element={ui} />
          <Route path="/orders" element={<div>Orders destination</div>} />
          <Route path="/orders/:guid" element={<div>Order destination</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
