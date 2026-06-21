import { createFileRoute, Link } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { title: "Pedido confirmado — Maison" },
      { name: "description", content: "Tu pedido ha sido procesado con éxito." },
      { property: "og:title", content: "Pedido confirmado — Maison" },
      { property: "og:description", content: "Tu pedido ha sido procesado con éxito." },
    ],
  }),
  component: OrderConfirmedPage,
});

function OrderConfirmedPage() {
  const reference = `MSN-${Date.now().toString(36).toUpperCase().slice(-8)}`;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto flex min-h-[calc(100vh-120px)] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-foreground/80">
          <Check strokeWidth={1.25} className="h-7 w-7" />
        </div>

        <span className="mt-10 text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Confirmación 04
        </span>

        <h1 className="mt-4 font-serif text-4xl leading-[1.05] md:text-6xl">
          Tu pedido ha sido confirmado
        </h1>

        <p className="mt-6 max-w-lg text-sm text-muted-foreground md:text-base">
          Gracias por tu compra. Hemos recibido tu pedido y enviaremos un correo
          con los detalles del envío en las próximas horas.
        </p>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-b border-border/60 px-10 py-6">
          <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Número de referencia
          </span>
          <span className="font-mono text-lg tracking-[0.18em]">{reference}</span>
        </div>

        <Link
          to="/"
          className="mt-12 inline-flex items-center justify-center bg-black px-10 py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-opacity duration-300 hover:opacity-80"
        >
          Volver a la tienda
        </Link>
      </main>
    </div>
  );
}
