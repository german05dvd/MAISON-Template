import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Hero } from "@/components/hero";
import { ProductGrid, products } from "@/components/product-grid";
import { FilterSidebar } from "@/components/filter-sidebar";
import { useSearch } from "@/context/SearchContext";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { searchQuery, setSearchQuery } = useSearch();
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();
  const brands = Array.from(new Set(products.map((p) => p.brand))).sort();

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setMinPrice("");
    setMaxPrice("");
    setSearchQuery("");
  };

  const filteredCount = products.filter((p) => {
    const q = (searchQuery ?? "").toString().trim().toLowerCase();
    
    const matchesSearch = q === "" || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q);
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(p.category);
    const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
    
    const price = parseFloat(p.price.replace(/[^0-9.]/g, ""));
    const min = minPrice ? parseFloat(minPrice) : 0;
    const max = maxPrice ? parseFloat(maxPrice) : Infinity;
    const matchesPrice = price >= min && price <= max;

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  }).length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <Hero />
        <section id="catalogo" className="bg-background py-20 md:py-28 scroll-mt-24">
          <div className="mx-auto flex max-w-7xl flex-col gap-12 px-6 md:flex-row">
            <aside className="w-full shrink-0 md:w-56">
              <FilterSidebar
                categories={categories}
                brands={brands}
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onCategoryToggle={(cat) => setSelectedCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat])}
                onBrandToggle={(brand) => setSelectedBrands(prev => prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand])}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onClearFilters={clearFilters}
                resultCount={filteredCount}
              />
            </aside>
            <div className="min-w-0 flex-1">
              <ProductGrid
                searchQuery={searchQuery}
                selectedCategories={selectedCategories}
                selectedBrands={selectedBrands}
                minPrice={minPrice}
                maxPrice={maxPrice}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}