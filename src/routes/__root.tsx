import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { SiteHeader } from "@/components/site-header";
import { CartDrawer } from "@/components/cart-drawer";
import { SearchProvider, useSearch } from "@/context/SearchContext"; // <--- Importación corregida
import { useState } from "react";

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <HeaderContainer onOpenCart={() => setIsCartOpen(true)} />
        <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        <Outlet />
      </SearchProvider>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

function HeaderContainer({ onOpenCart }: { onOpenCart: () => void }) {
  const { searchQuery, setSearchQuery } = useSearch(); 
  return <SiteHeader searchQuery={searchQuery} onSearchChange={setSearchQuery} onOpenCart={onOpenCart} />;
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: RootComponent,
});