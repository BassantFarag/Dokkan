import { Search } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import Product from "../components/product";
import { useState } from "react";

const Shop = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
  category: "all",
  minPrice: "",
  maxPrice: "",
  sortBy: "Default",
});

  return (
    <div className="min-h-screen bg-brand-main text-brand-primary pb-12 pt-32 md:pt-28 transition-colors duration-300">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">

        <div className="w-full mb-8 flex items-center gap-2">
          <div className="relative flex-1">

          
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-secondary">
              <Search className="h-5 w-5" strokeWidth={2.5} />
            </div>

           
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-brand-card border border-brand-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-sm text-brand-primary placeholder:text-brand-secondary transition-all"
            />

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-1">
            <FilterSidebar
              filter={filter}
              setFilter={setFilter}
             />
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Product />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Shop;
