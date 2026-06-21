import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, BookOpen } from "lucide-react";

export const Route = createFileRoute("/editorial")({
  component: EditorialPage,
});

const ARTICLES = [
  {
    id: "1",
    title: "La luz como ornamento: El proceso detrás del lino lavado",
    excerpt: "Viajamos a los talleres donde el tejido descansa bajo el sol para lograr una fluidez orgánica inigualable.",
    content: "El lino de Maison no se produce en masa; se cultiva. En nuestros talleres, cada lote de lino crudo pasa por un proceso de lavado con piedra volcánica y agua templada, seguido de un secado natural al aire libre. Este método expone el tejido a los rayos del sol del trópico, rompiendo la rigidez natural de la fibra sin debilitarla. El resultado es una prenda con una caída líquida, una textura que respira y un matiz sutil que cambia según la luz del día. No diseñamos ropa para una temporada, diseñamos texturas que guardan la memoria del clima.",
    date: "14 Jun 2026",
    category: "Artesanías",
    // Nueva URL de alta resolución garantizada (Textura de lino/ropa minimalista)
    image: "https://images.unsplash.com/photo-1545042679-41d22b2ca130?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Despacio: Manifiesto contra la tendencia efímera",
    excerpt: "Por qué cortamos solo piezas diseñadas para envejecer con dignidad y carácter.",
    content: "La moda contemporánea se mueve a un ritmo que destruye la apreciación del detalle. En Maison, operamos bajo el concepto de 'Sastrería de Pausa'. Una sola pieza puede tomar hasta doce horas de corte y confección manual. Elegimos costuras francesas invisibles y dobladillos reforzados porque entendemos que una prenda debe ser una estructura duradera. Al reducir nuestro catálogo a lanzamientos limitados, aseguramos que cada hilo tenga un propósito y que cada diseño merezca existir en tu armario por décadas.",
    date: "08 Jun 2026",
    category: "Filosofía",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "3",
    title: "La anatomía de una costura francesa",
    excerpt: "Los detalles técnicos que diferencian una prenda industrial de una obra de costura arquitectónica.",
    content: "La costura francesa es el secreto mejor guardado del acabado limpio. Al encerrar completamente los bordes deshilachados dentro de un doble pespunte, eliminamos la necesidad de remallados industriales rígidos. Esto no solo hace que el interior de la prenda sea tan hermoso como el exterior, sino que evita la fricción con la piel, permitiendo que las camisas y vestidos fluyan de manera natural con el movimiento del cuerpo.",
    date: "29 May 2026",
    category: "Sastrería",
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=800&auto=format&fit=crop",
  }
];

function EditorialPage() {
  const [activeArticle, setActiveArticle] = useState<typeof ARTICLES[0] | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      <header className="mx-auto max-w-7xl px-6 pt-16 pb-12 flex flex-col gap-3 text-center items-center">
        <span className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
          Maison Journal
        </span>
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground">
          Crónicas de Diseño
        </h1>
        <p className="text-xs text-muted-foreground tracking-wide max-w-sm mt-2 leading-relaxed">
          Ensayos sobre espacio, proporción y la calma del trabajo manual.
        </p>
      </header>

      <main className="mx-auto max-w-7xl px-6 mt-12 grid grid-cols-1 md:grid-cols-12 gap-12">
        {/* Artículo Destacado Principal */}
        <article className="md:col-span-12 grid grid-cols-1 md:grid-cols-12 gap-8 items-center border-b border-border/30 pb-16">
          <div className="md:col-span-7 aspect-[16/10] overflow-hidden bg-muted">
            <img
              src={ARTICLES[0].image}
              alt={ARTICLES[0].title}
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-101"
            />
          </div>
          <div className="md:col-span-5 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground">
              <span>{ARTICLES[0].category}</span>
              <span>·</span>
              <span>{ARTICLES[0].date}</span>
            </div>
            <h2 
              onClick={() => setActiveArticle(ARTICLES[0])}
              className="font-serif text-xl md:text-3xl leading-tight hover:underline cursor-pointer text-foreground"
            >
              {ARTICLES[0].title}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {ARTICLES[0].excerpt}
            </p>
            <button
              onClick={() => setActiveArticle(ARTICLES[0])}
              className="mt-2 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-foreground underline underline-offset-4 hover:opacity-75"
            >
              <BookOpen className="h-3 w-3" /> Leer Ensayo
            </button>
          </div>
        </article>

        {/* Artículos Secundarios */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {ARTICLES.slice(1).map((art) => (
            <article key={art.id} className="flex flex-col gap-4 group">
              <div className="aspect-[4/3] overflow-hidden bg-muted w-full">
                <img
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
              </div>
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-muted-foreground mt-2">
                <span>{art.category}</span>
                <span>·</span>
                <span>{art.date}</span>
              </div>
              <h3 
                onClick={() => setActiveArticle(art)}
                className="font-serif text-lg md:text-xl text-foreground group-hover:underline cursor-pointer"
              >
                {art.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {art.excerpt}
              </p>
              <button
                onClick={() => setActiveArticle(art)}
                className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-foreground underline underline-offset-4 hover:opacity-75 self-start mt-1"
              >
                <BookOpen className="h-3 w-3" /> Leer Ensayo
              </button>
            </article>
          ))}
        </div>
      </main>

      {/* Box Informativo / Modal de Lectura Editorial */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="h-full w-full max-w-2xl bg-background p-8 md:p-12 shadow-2xl overflow-y-auto flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-border/40 pb-4">
                <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  {activeArticle.category} — {activeArticle.date}
                </span>
                <button 
                  onClick={() => setActiveArticle(null)}
                  className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <h2 className="font-serif text-2xl md:text-4xl text-foreground leading-tight">
                {activeArticle.title}
              </h2>

              <div className="aspect-[16/9] overflow-hidden bg-muted w-full my-6">
                <img src={activeArticle.image} alt="" className="w-full h-full object-cover" />
              </div>

              <p className="font-serif text-lg text-foreground/90 italic leading-relaxed border-l-2 border-foreground/30 pl-4">
                {activeArticle.excerpt}
              </p>

              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line pt-2">
                {activeArticle.content}
              </p>
            </div>

            <div className="mt-12 pt-6 border-t border-border/40">
              <button
                onClick={() => setActiveArticle(null)}
                className="w-full bg-black text-background text-[11px] uppercase tracking-[0.22em] py-4 text-center hover:opacity-90 transition-opacity"
              >
                Cerrar Lectura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}