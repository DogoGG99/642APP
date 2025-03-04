import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";
import { LanguageProvider } from "@/contexts/LanguageContext"; // Added import

import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import DashboardPage from "@/pages/dashboard-page";
import ClientsPage from "@/pages/clients-page";
import InventoryPage from "@/pages/inventory-page";
import ReservationsPage from "@/pages/reservations-page";
import BillingPage from "@/pages/billing-page";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={DashboardPage} />
      <ProtectedRoute path="/clients" component={ClientsPage} />
      <ProtectedRoute path="/inventory" component={InventoryPage} />
      <ProtectedRoute path="/reservations" component={ReservationsPage} />
      <ProtectedRoute path="/billing" component={BillingPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider> {/* Added LanguageProvider */}
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </LanguageProvider> {/* Closed LanguageProvider */}
    </QueryClientProvider>
  );
}

export default App;