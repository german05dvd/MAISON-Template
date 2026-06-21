import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import heroMain from "@/assets/hero-main.jpg";
import heroSecondary from "@/assets/hero-secondary.jpg";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-7xl grid-cols-1 gap-14 px-6 pt-10 pb-20 md:grid-cols-12 md:gap-10 md:pt-20 md:pb-32">
      {/* Left column — text (40%) */}
      <div className="order-1 md:col-span-5 md:pt-12 lg:pt-20">
        <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
          Colección Limitada
        </p>

        <h1 className="mt-6 font-serif text-[2.75rem] leading-[0.95] tracking-[-0.02em] text-foreground sm:text-6xl lg:text-7xl xl:text-[5.5rem]">
          Colección<br />
          Havana:<br />
          <span className="italic">Solsticio '24</span>
        </h1>

        <p className="mt-8 max-w-md text-sm leading-relaxed text-muted-foreground">
          Una oda al sol del trópico y al lino crudo. Veintiún piezas atemporales,
          cortadas a mano en talleres centenarios, donde la luz se vuelve textura
          y el tiempo, ornamento.
        </p>

        <Link
          to="/colecciones"
          className="group mt-10 flex w-fit items-center gap-3 py-3 text-[11px] uppercase tracking-[0.22em] text-foreground transition-opacity hover:opacity-50"
        >
          <span className="border-b border-foreground">
            Descubre la Colección
          </span>
          <ArrowRight
            strokeWidth={1.5}
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Right composition — editorial collage (60%) */}
      <div className="relative order-2 md:col-span-7">
        <div className="relative mx-auto aspect-[3/4] w-full max-w-sm sm:max-w-md md:max-w-none">
          {/* Main image */}
          <div className="relative z-10 aspect-[3/4] w-[78%] overflow-hidden md:-mt-6">
            <img
              src={heroMain}
              alt="Modelo con vestido de lino crema en una calle de La Habana al atardecer"
              width={1024}
              height={1366}
              fetchPriority="high"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Secondary image */}
          <div className="absolute right-0 top-[28%] z-20 aspect-[3/4] w-[44%] overflow-hidden shadow-2xl">
            <img
              src={heroSecondary}
              alt="Detalle editorial de joyería dorada sobre seda marfil"
              width={1024}
              height={1366}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
