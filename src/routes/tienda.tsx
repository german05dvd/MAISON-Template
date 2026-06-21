import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSearch } from "@/context/SearchContext";

export const Route = createFileRoute("/tienda")({
  component: TiendaCuradaPage,
});

const DEPARTMENTS = [
  {
    name: "Sastrería & Ropa exterior",
    searchTerm: "Blazer",
    count: "4 Piezas",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Joyería Fina",
    searchTerm: "Anillo",
    count: "1 Pieza",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Objetos de Cuero",
    searchTerm: "Bolso",
    count: "1 Pieza",
    image: "https://images.unsplash.com/photo-1547949003-9792a18a2601?q=80&w=800&auto=format&fit=crop",
  }
];

function TiendaCuradaPage() {
  const { setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleDepartmentClick = (term: string) => {
    setSearchQuery(term);
    navigate({ to: "/", hash: "catalogo" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="mx-auto max-w-7xl px-6 pt-16 pb-12 flex flex-col gap-3 border-b border-border/40">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Boutique En Línea
        </span>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-foreground">
          Departamentos
        </h1>
      </header>

      <main className="mx-auto max-w-7xl px-6 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {DEPARTMENTS.map((dept, index) => (
            <button
              key={index}
              onClick={() => handleDepartmentClick(dept.searchTerm)}
              className="group flex flex-col gap-4 text-left relative overflow-hidden focus:outline-none w-full"
            >
              <div className="aspect-[3/4] w-full bg-muted overflow-hidden relative">
                <img
                  src={dept.image}
                  alt={dept.name}
                  className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-103"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
              </div>
              <div className="flex justify-between items-baseline mt-2 px-1 w-full">
                <h3 className="font-serif text-base text-foreground group-hover:underline">
                  {dept.name}
                </h3>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {dept.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}