import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSearch } from "@/context/SearchContext";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/colecciones")({
  component: ColeccionesPage,
});

const COLLECTIONS = [
  {
    id: "havana-solsticio",
    title: "Havana: Solsticio '24",
    tagline: "Colección Actual",
    searchTerm: "Lino", // Filtra piezas que usen lino en el catálogo
    description: "Una oda al sol de trópico y al lino crudo. Piezas atemporales cortadas a mano donde la luz se vuelve textura.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop",
    align: "left",
  },
  {
    id: "archivo-lineas",
    title: "Líneas de Sombra",
    tagline: "Otoño / Invierno",
    searchTerm: "Atelier Lumière", // Filtra por la marca específica
    description: "Sastrería structured y siluetas fluidas en una paleta monocromática de lanas ligeras y sedas opacas.",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
    align: "right",
  },
  {
    id: "esencia-minimal",
    title: "El Elogio de la Materia",
    tagline: "Permanente",
    searchTerm: "Maison", // Filtra por la línea clásica de Maison
    description: "Una selección rigurosa de básicos esenciales elevados. Algodón orgánico de fibra larga y acabados invisibles.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop",
    align: "left",
  }
];

function ColeccionesPage() {
  const { setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleCollectionClick = (term: string) => {
    setSearchQuery(term);
    navigate({ to: "/", hash: "catalogo" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="mx-auto max-w-7xl px-6 pt-16 pb-12 flex flex-col gap-3 border-b border-border/40">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Antología Visual
        </span>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-foreground">
          Colecciones
        </h1>
      </header>

      <main className="mx-auto max-w-7xl px-6 mt-16 space-y-24 md:space-y-36">
        {COLLECTIONS.map((col) => (
          <div key={col.id} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-center">
            <div className={`flex flex-col gap-6 md:col-span-5 ${col.align === "right" ? "md:order-2 md:col-start-8" : "md:col-start-1"}`}>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground font-medium">
                  {col.tagline}
                </span>
                <h2 className="font-serif text-2xl md:text-4xl text-foreground">
                  {col.title}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground max-w-md">
                {col.description}
              </p>
              <button
                onClick={() => handleCollectionClick(col.searchTerm)}
                className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-foreground hover:opacity-70 transition-opacity mt-2 text-left focus:outline-none"
              >
                Explorar piezas
                <ArrowRight strokeWidth={1.2} className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className={`md:col-span-7 overflow-hidden aspect-[16/10] bg-muted relative ${col.align === "right" ? "md:order-1 md:col-start-1" : "md:col-start-6"}`}>
              <img
                src={col.image}
                alt={col.title}
                loading="lazy"
                className="h-full w-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-102"
              />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}