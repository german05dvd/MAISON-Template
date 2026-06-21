import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ShoppingBag, Shield, Truck, RefreshCw } from "lucide-react";
import { products } from "@/components/product-grid";
import { useCartStore } from "@/stores/cart-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/productos/$id")({
  component: ProductDetailPage,
});

const SIZES = ["XS", "S", "M", "L", "XL"];

function ProductDetailPage() {
  const { id } = Route.useParams();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const addItem = useCartStore((s) => s.addItem);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 text-center">
        <h2 className="font-serif text-2xl text-foreground">Pieza no encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">La pieza que buscas no forma parte de la colección actual.</p>
        <Link to="/" className="mt-6 border border-foreground px-6 py-2.5 text-[11px] uppercase tracking-[0.22em]">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor, selecciona una talla antes de añadir al carrito.");
      return;
    }

    addItem({
      id: `${product.id}-${selectedSize}`,
      name: `${product.name} (${selectedSize})`,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
    });

    toast.success(`${product.name} añadido al pedido.`);
  };

  const relatedProducts = products
    .filter((p) => (p.category === product.category || p.brand === product.brand) && p.id !== product.id)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <div className="mx-auto max-w-7xl px-6 pt-8">
        <Link to="/" className="group inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft strokeWidth={1} className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Volver al catálogo
        </Link>
      </div>

      <main className="mx-auto max-w-7xl px-6 mt-10 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
        <div className="md:col-span-7 space-y-6">
          <div className="overflow-hidden bg-muted aspect-[3/4] w-full">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-muted aspect-[3/4] opacity-80 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Vista Detalle
            </div>
            <div className="bg-muted aspect-[3/4] opacity-80 flex items-center justify-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Textura Lino Crudo
            </div>
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="md:sticky md:top-24 space-y-8">
            <div>
              <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                {product.brand} — {product.category}
              </span>
              <h1 className="mt-2 font-serif text-3xl md:text-4xl tracking-tight leading-none text-foreground">
                {product.name}
              </h1>
              <p className="mt-4 font-serif text-xl md:text-2xl text-foreground">
                {product.price}
              </p>
            </div>

            <div className="h-px w-full bg-border/40" />

            <p className="text-sm leading-relaxed text-muted-foreground">
              Una pieza de sastrería artesanal confeccionada bajo estándares estrictos de caída y fluidez. 
              Ideal para climas cálidos y composiciones de capas de alta costura. Totalmente forrado en satén ligero.
            </p>

            <div className="space-y-4">
              <div className="flex justify-between text-[11px] uppercase tracking-[0.22em]">
                <span className="text-muted-foreground">Seleccionar Talla</span>
                <button className="underline underline-offset-4 hover:opacity-70">Guía de tallas</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={cn(
                      "h-12 min-w-12 border px-3 text-xs tracking-wider transition-all duration-200",
                      selectedSize === size
                        ? "border-foreground bg-foreground text-background font-medium"
                        : "border-border hover:border-foreground/50"
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="flex w-full items-center justify-center gap-3 bg-black py-4 text-[11px] uppercase tracking-[0.28em] text-background transition-opacity hover:opacity-90"
            >
              <ShoppingBag strokeWidth={1.5} className="h-4 w-4" />
              Añadir al pedido
            </button>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Truck strokeWidth={1} className="h-4 w-4 shrink-0 text-foreground" />
                <span>Envío express de cortesía en compras superiores a €500</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <RefreshCw strokeWidth={1} className="h-4 w-4 shrink-0 text-foreground" />
                <span>Cambios y devoluciones editoriales dentro de 14 días</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <Shield strokeWidth={1} className="h-4 w-4 shrink-0 text-foreground" />
                <span>Autenticidad garantizada y empaque Maison de firmas</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {relatedProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-6 mt-24 pt-16 border-t border-border/40">
          <h3 className="font-serif text-xl md:text-2xl mb-8">Completar el Look</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8">
            {relatedProducts.map((p) => (
              <Link key={p.id} to={`/productos/${p.id}`} className="group flex flex-col gap-3">
                <div className="overflow-hidden bg-muted aspect-[3/4]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{p.brand}</span>
                  <h4 className="text-sm font-medium text-foreground group-hover:underline">{p.name}</h4>
                  <span className="text-xs text-muted-foreground">{p.price}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}