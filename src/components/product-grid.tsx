import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export type Product = {
  id: string;
  name: string;
  price: string;
  priceNum: number;
  image: string;
  category: string;
  brand: string;
};

export const products: Product[] = [
  {
    id: "1",
    name: "Blazer Lino Camel",
    price: "€ 480",
    priceNum: 480,
    image: product1,
    category: "Ropa",
    brand: "Maison",
  },
  {
    id: "2",
    name: "Vestido Slip Marfil",
    price: "€ 320",
    priceNum: 320,
    image: product2,
    category: "Ropa",
    brand: "Atelier Lumière",
  },
  {
    id: "3",
    name: "Bolso Cuero Cognac",
    price: "€ 690",
    priceNum: 690,
    image: product3,
    category: "Accesorios",
    brand: "Maison",
  },
  {
    id: "4",
    name: "Pantalón Crudo Amplio",
    price: "€ 295",
    priceNum: 295,
    image: product4,
    category: "Ropa",
    brand: "Atelier Lumière",
  },
  {
    id: "5",
    name: "Pendientes Gota Oro",
    price: "€ 215",
    priceNum: 215,
    image: product5,
    category: "Joyería",
    brand: "Orfèvre",
  },
  {
    id: "6",
    name: "Knit Cashmere Avena",
    price: "€ 410",
    priceNum: 410,
    image: product6,
    category: "Ropa",
    brand: "Maison",
  },
];

function ratioFor(index: number): "3/4" | "4/5" {
  return index % 3 === 0 ? "3/4" : "4/5";
}

function ProductCard({
  product,
  index,
}: {
  product: Product;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);
  const ratio = ratioFor(index);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNum: product.priceNum,
      image: product.image,
    });
    toast.success("Añadido al carrito", {
      description: `${product.name} · ${product.price}`,
    });
  };

  return (
    <article className="group flex flex-col">
      <div
        className="relative w-full overflow-hidden bg-muted"
        style={{ aspectRatio: ratio.replace("/", " / ") }}
      >
        {!loaded && (
          <div
            aria-hidden
            className="absolute inset-0 animate-pulse"
            style={{ backgroundColor: "oklch(0.93 0.006 80)" }}
          />
        )}
        <Link to="/productos/$id" params={{ id: product.id }}>
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            onLoad={() => setLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105",
              loaded ? "opacity-100" : "opacity-0",
            )}
          />
        </Link>

        <button
          type="button"
          onClick={handleAdd}
          className="absolute inset-x-0 bottom-0 z-10 hidden translate-y-full bg-black py-3 text-center text-[11px] uppercase tracking-[0.22em] text-background transition-all duration-300 ease-in-out group-hover:translate-y-0 md:block"
        >
          Añadir al Carrito
        </button>
      </div>

      <div className="mt-3 flex flex-col items-start gap-0.5">
        <Link to="/productos/$id" params={{ id: product.id }} className="hover:underline">
          <h3 className="font-serif text-sm text-foreground">{product.name}</h3>
        </Link>
        <p className="font-sans text-sm tabular-nums text-foreground">
          {product.price}
        </p>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        className="mt-2 block w-full bg-black py-2.5 text-center text-[10px] uppercase tracking-[0.22em] text-background md:hidden"
      >
        Añadir al Carrito
      </button>
    </article>
  );
}

function ProductSkeleton({ index }: { index: number }) {
  const ratio = ratioFor(index);
  return (
    <div className="flex flex-col">
      <div
        className="w-full animate-pulse"
        style={{
          aspectRatio: ratio.replace("/", " / "),
          backgroundColor: "oklch(0.93 0.006 80)",
        }}
      />
      <div className="mt-3 flex flex-col gap-2">
        <div
          className="h-3 w-2/3 animate-pulse"
          style={{ backgroundColor: "oklch(0.93 0.006 80)" }}
        />
        <div
          className="h-3 w-1/4 animate-pulse"
          style={{ backgroundColor: "oklch(0.93 0.006 80)" }}
        />
      </div>
    </div>
  );
}

interface ProductGridProps {
  searchQuery: string;
  selectedCategories: string[];
  selectedBrands: string[];
  minPrice: string;
  maxPrice: string;
  onClearFilters: () => void;
}

export function ProductGrid({
  searchQuery,
  selectedCategories,
  selectedBrands,
  minPrice,
  maxPrice,
  onClearFilters,
}: ProductGridProps) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  const filtered = loading
    ? []
    : products.filter((p) => {
        const q = searchQuery.trim().toLowerCase();
        const matchesSearch =
          q === "" ||
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q);

        const matchesCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(p.category);

        const matchesBrand =
          selectedBrands.length === 0 || selectedBrands.includes(p.brand);

        const min = minPrice !== "" ? Number(minPrice) : -Infinity;
        const max = maxPrice !== "" ? Number(maxPrice) : Infinity;
        const matchesPrice = p.priceNum >= min && p.priceNum <= max;

        return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
      });

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-col gap-3">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Catálogo — Solsticio '24
        </span>
        <h2 className="font-serif text-3xl leading-[1.05] text-foreground md:text-5xl">
          Piezas seleccionadas
        </h2>
      </header>

      {filtered.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center gap-6 py-24">
          <p className="max-w-md text-center font-serif text-xl text-foreground md:text-2xl">
            No se encontraron productos que coincidan con tu búsqueda
          </p>
          <button
            type="button"
            onClick={onClearFilters}
            className="border border-foreground px-8 py-3 text-[11px] uppercase tracking-[0.22em] text-foreground transition-all duration-300 hover:bg-foreground hover:text-background"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16">
          {loading
            ? products.map((_, i) => <ProductSkeleton key={i} index={i} />)
            : filtered.map((p, i) => (
                <ProductCard key={p.id} product={p} index={i} />
              ))}
        </div>
      )}
    </div>
  );
}