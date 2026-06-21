import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FilterSidebarProps {
  categories: string[];
  brands: string[];
  selectedCategories: string[];
  selectedBrands: string[];
  minPrice: string;
  maxPrice: string;
  onCategoryToggle: (cat: string) => void;
  onBrandToggle: (brand: string) => void;
  onMinPriceChange: (val: string) => void;
  onMaxPriceChange: (val: string) => void;
  onClearFilters: () => void;
  resultCount: number;
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
        {title}
      </h4>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}

function FilterItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "text-left text-sm transition-opacity duration-300",
        active ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <span className={cn("mr-2 inline-block h-2 w-2 border border-foreground transition-all", active ? "bg-foreground" : "bg-transparent")} />
      {label}
    </button>
  );
}

export function FilterSidebar(props: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      {/* Botón solo visible en móvil */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between border-b border-border py-2 md:hidden"
      >
        <span className="text-[11px] uppercase tracking-[0.22em]">Filtrar selección</span>
        <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen ? "rotate-180" : "")} />
      </button>

      {/* ESTRUCTURA DE ESCRITORIO:
        - md:flex (siempre visible en escritorio)
        - El estado isOpen solo afecta en < md (móvil)
      */}
      <div className={cn("flex-col gap-8 md:flex", isOpen ? "flex" : "hidden md:flex")}>
        <FilterGroup title="Categoría">
          {props.categories.map((cat) => (
            <FilterItem
              key={cat}
              label={cat}
              active={props.selectedCategories.includes(cat)}
              onClick={() => props.onCategoryToggle(cat)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Marca">
          {props.brands.map((brand) => (
            <FilterItem
              key={brand}
              label={brand}
              active={props.selectedBrands.includes(brand)}
              onClick={() => props.onBrandToggle(brand)}
            />
          ))}
        </FilterGroup>

        <FilterGroup title="Precio (€)">
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              placeholder="Mín"
              value={props.minPrice}
              onChange={(e) => props.onMinPriceChange(e.target.value)}
              className="w-full border-b border-foreground/20 bg-transparent py-1 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
            <span className="text-sm text-muted-foreground">—</span>
            <input
              type="number"
              min={0}
              placeholder="Máx"
              value={props.maxPrice}
              onChange={(e) => props.onMaxPriceChange(e.target.value)}
              className="w-full border-b border-foreground/20 bg-transparent py-1 text-sm text-foreground transition-all placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
            />
          </div>
        </FilterGroup>

        <button
          onClick={props.onClearFilters}
          className="text-left text-[11px] uppercase tracking-[0.22em] text-muted-foreground underline underline-offset-4"
        >
          Limpiar todo
        </button>

        <div className="hidden border-t border-border/40 pt-4 md:block">
          <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            {props.resultCount} {props.resultCount === 1 ? "resultado" : "resultados"}
          </span>
        </div>
      </div>
    </div>
  );
}