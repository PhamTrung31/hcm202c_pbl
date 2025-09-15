import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

// Global error handlers to capture runtime exceptions for debugging
window.addEventListener("error", (ev) => {
  // avoid noisy third-party blocked requests
  try {
    // Log to console with full info
    // eslint-disable-next-line no-console
    console.error("Global error captured:", ev.error || ev.message || ev);
  } catch (e) {}
});
window.addEventListener("unhandledrejection", (ev) => {
  try {
    // eslint-disable-next-line no-console
    console.error("Unhandled promise rejection:", ev.reason);
  } catch (e) {}
});

createRoot(document.getElementById("root")!).render(<App />);
