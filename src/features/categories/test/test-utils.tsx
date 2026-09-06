import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

export function renderCategoriesPage(
  ui: ReactNode,
  initialEntry = "/categories",
  routePath = "/categories",
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
          <Route
            path="/categories"
            element={<div>Category list destination</div>}
          />
          <Route
            path="/categories/:slug"
            element={<div>Category detail destination</div>}
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}
