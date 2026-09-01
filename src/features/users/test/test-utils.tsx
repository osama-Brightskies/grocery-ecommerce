import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

export function renderUsersPage(
  ui: ReactNode,
  initialEntry = "/users",
  routePath = "/users",
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialEntry]}>
        <Routes>
          <Route path={routePath} element={ui} />
          <Route path="/users" element={<div>User list destination</div>} />
          <Route path="/users/:userId" element={<div>User detail destination</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
