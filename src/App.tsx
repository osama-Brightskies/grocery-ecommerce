import { Routes, Route, Navigate } from "react-router-dom";

// Import your page components
import Products from "./features/products/pages/Products";
import ProductDetailPage from "./features/products/pages/ProductDetailPage";
import ProductFormPage from "./features/products/pages/ProductFormPage";
import Tags from "./features/tags/pages/Tags"; // Import the new tags page
import { Sidebar } from "./components/ui/sidebar";

export default function App() {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />

          <Route path="/products" element={<Products />} />
          <Route path="/products/create" element={<ProductFormPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/products/:id/edit" element={<ProductFormPage />} />

          {/* Tags Route */}
          <Route path="/tags" element={<Tags />} />

          <Route
            path="*"
            element={
              <div className="flex items-center justify-center h-full p-8 text-muted-foreground font-semibold">
                404 - Page not found
              </div>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
