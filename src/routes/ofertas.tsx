import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, X, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/ofertas")({
  component: ArchivoPage,
});

const ARCHIVE_PIECES = [
  {
    id: "arch-1",
    name: "Top Seda Asimétrico",
    originalPrice: "€ 260",
    archivePrice: "€ 175",
    brand: "Atelier Lumière",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=600&auto=format&fit=crop",
    note: "Última unidad disponible · Talla S"
  },
  {
    id: "arch-2",
    name: "Cinturón Doble Hebilla",
    originalPrice: "€ 185",
    archivePrice: "€ 110",
    brand: "Maison",
    // Enlace actualizado con una textura de cuero y hebilla garantizada
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=600&auto=format&fit=crop",
    note: "Muestra de catálogo original"
  }
];

function ArchivoPage() {
  const [selectedPiece, setSelectedPiece] = useState<typeof ARCHIVE_PIECES[0] | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedPiece(null);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="mx-auto max-w-7xl px-6 pt-16 pb-12 flex flex-col gap-3 border-b border-border/40">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Acceso Limitado
        </span>
        <h1 className="font-serif text-4xl md:text-6xl tracking-tight text-foreground">
          Piezas de Archivo
        </h1>
      </header>

      <main className="mx-auto max-w-7xl px-6 mt-12">
        <div className="mb-12 flex items-start gap-3 bg-muted/40 p-4 border border-border/40 max-w-xl">
          <ShieldAlert strokeWidth={1.5} className="h-5 w-5 text-foreground/80 shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            Estas piezas corresponden a muestras editoriales finales o últimos excedentes de colecciones pasadas. Debido a su naturaleza exclusiva y stock limitado, no admiten cambios ni devoluciones.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8">
          {ARCHIVE_PIECES.map((piece) => (
            <article key={piece.id} className="group flex flex-col">
              <div className="aspect-[3/4] w-full bg-muted overflow-hidden relative">
                <img
                  src={piece.image}
                  alt={piece.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                />
                <span className="absolute top-3 left-3 bg-background border px-2 py-0.5 text-[9px] uppercase tracking-widest text-foreground font-medium">
                  Archivo
                </span>
              </div>

              <div className="mt-3 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {piece.brand}
                </span>
                <h3 className="font-serif text-sm text-foreground">
                  {piece.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-sans text-xs text-muted-foreground line-through">
                    {piece.originalPrice}
                  </span>
                  <span className="font-sans text-sm font-medium text-foreground tabular-nums">
                    {piece.archivePrice}
                  </span>
                </div>
                <span className="text-[10px] italic text-muted-foreground/80 mt-1">
                  {piece.note}
                </span>
              </div>

              <button
                onClick={() => setSelectedPiece(piece)}
                className="mt-3 block w-full border border-foreground bg-transparent py-2 text-center text-[10px] uppercase tracking-[0.22em] text-foreground transition-colors hover:bg-black hover:text-background focus:outline-none"
              >
                Solicitar pieza
              </button>
            </article>
          ))}
        </div>
      </main>

      {/* Box Informativo / Modal de Solicitud de Archivo */}
      {selectedPiece && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-background w-full max-w-md p-6 md:p-8 border border-border relative shadow-xl">
            <button
              onClick={() => setSelectedPiece(null)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleOrderSubmit} className="space-y-5">
                <div>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{selectedPiece.brand}</span>
                  <h2 className="font-serif text-xl text-foreground">{selectedPiece.name}</h2>
                  <p className="text-xs text-muted-foreground mt-1">Precio especial de archivo: <span className="font-medium text-foreground">{selectedPiece.archivePrice}</span></p>
                </div>

                <div className="border-t border-b border-border/40 py-3 text-xs text-muted-foreground leading-relaxed">
                  Estás solicitando una pieza numerada de stock crítico. Déjanos tus datos de contacto para verificar las medidas en el atelier físico y confirmar la asignación de la prenda.
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Nombre Completo</label>
                    <input required type="text" className="w-full border border-border bg-transparent p-2 text-sm focus:outline-none focus:border-foreground" />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Canal de Contacto (Teléfono o Email)</label>
                    <input required type="text" className="w-full border border-border bg-transparent p-2 text-sm focus:outline-none focus:border-foreground" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-black text-background text-[10px] uppercase tracking-[0.22em] py-3 hover:opacity-90 transition-opacity mt-2"
                >
                  Enviar solicitud de reserva
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center space-y-3 animate-fade-in">
                <CheckCircle2 className="h-10 w-10 text-foreground" strokeWidth={1.2} />
                <h3 className="font-serif text-lg">Solicitud Recibida</h3>
                <p className="text-xs text-muted-foreground max-w-xs">
                  Hemos bloqueado la unidad provisionalmente. Un asesor se comunicará contigo en breve para ultimar los detalles.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}