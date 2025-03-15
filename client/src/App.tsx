import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ProductListing from "@/pages/product-listing";
import ProductDetail from "@/pages/product-detail";
import ProductCreate from "@/pages/product-create";
import ProfilePage from "@/pages/profile-page";
import DashboardPage from "@/pages/dashboard-page";
import RequestProject from "@/pages/request-project";
import MessagingPage from "@/pages/messaging-page";
import NewsPage from "@/pages/news-page";
import AboutPage from "@/pages/about-page";
import { ProtectedRoute } from "@/lib/protected-route";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/products" component={ProductListing} />
          <ProtectedRoute path="/products/create" component={ProductCreate} />
          <Route path="/products/:id" component={ProductDetail} />
          <Route path="/news" component={NewsPage} />
          <Route path="/about" component={AboutPage} />
          <ProtectedRoute path="/profile" component={ProfilePage} />
          <ProtectedRoute path="/dashboard" component={DashboardPage} />
          <ProtectedRoute path="/request-project" component={RequestProject} />
          <ProtectedRoute path="/messages" component={MessagingPage} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
