import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorConsoleProvider } from "@/contexts/ErrorConsoleContext";
import ErrorConsole from "@/components/ErrorConsole";
import ErrorConsoleToggle from "@/components/ErrorConsoleToggle";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import SetupAdmin from "./pages/SetupAdmin";
import NotFound from "./pages/NotFound";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import CryptoPayment from "./pages/CryptoPayment";
import Transactions from "./pages/Transactions";
import SafariGuide from "./pages/SafariGuide";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorConsoleProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/setup-admin" element={<SetupAdmin />} />
            <Route path="/safari-guide" element={<SafariGuide />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/crypto-payment" element={<CryptoPayment />} />
            <Route path="/transactions" element={<Transactions />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <ErrorConsoleToggle />
          <ErrorConsole />
        </BrowserRouter>
      </TooltipProvider>
    </ErrorConsoleProvider>
  </QueryClientProvider>
);

export default App;
