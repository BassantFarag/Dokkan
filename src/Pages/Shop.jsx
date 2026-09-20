import { Search, SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import Product from "../components/ProductCard";
import { useState, useEffect } from "react";
import { getAllProducts } from "../api/productApi";
import { toast } from "react-toastify";

const Shop = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [filter, setFilter] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "Default",
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const response = await getAllProducts();
        const fetchedData = response.data.products;

        setProducts(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load products",
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((product) => {
      const productName = product.name?.toLowerCase() || "";
      const productCategory = product.category?.toLowerCase() || "";
      const searchValue = search.toLowerCase();

      const matchesSearch = productName.includes(searchValue);

      const matchesCategory =
        filter.category === "all" ||
        productCategory === filter.category.toLowerCase();

      const productPrice = Number(product.discountPrice || product.price || 0);

      const minPrice = filter.minPrice === "" ? 0 : Number(filter.minPrice);

      const maxPrice =
        filter.maxPrice === "" ? Infinity : Number(filter.maxPrice);

      const matchesMinPrice = productPrice >= minPrice;
      const matchesMaxPrice = productPrice <= maxPrice;

      return (
        matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice
      );
    })
    .sort((a, b) => {
      const priceA = Number(a.discountPrice || a.price || 0);
      const priceB = Number(b.discountPrice || b.price || 0);

      if (filter.sortBy === "LowToHigh") {
        return priceA - priceB;
      }

      if (filter.sortBy === "HighToLow") {
        return priceB - priceA;
      }

      if (filter.sortBy === "TopRated") {
        return (b.averageRating || 0) - (a.averageRating || 0);
      }

      if (filter.sortBy === "Newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }

      return 0;
    });

  return (
    <div className="min-h-screen bg-brand-main text-brand-primary pb-10 pt-24 sm:pt-28 md:pt-32 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-secondary">
              <Search className="w-4 h-4 sm:w-5 sm:h-5" strokeWidth={2.5} />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-brand-card border border-brand-border rounded-lg sm:rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-xs sm:text-sm text-brand-primary placeholder:text-brand-secondary transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="lg:hidden shrink-0 flex items-center justify-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-brand-card border border-brand-border rounded-lg sm:rounded-xl text-brand-primary hover:border-brand-gold transition-all"
          >
            {showFilters ? (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            )}

            <span className="text-xs sm:text-sm font-medium">
              {showFilters ? "Close" : "Filter"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-28">
              <FilterSidebar filter={filter} setFilter={setFilter} />
            </div>
          </aside>

          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-brand-secondary text-base sm:text-lg md:text-xl">
                  Loading...
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {filteredProducts.map((item) => (
                  <Product key={item._id || item.id} product={item} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-brand-secondary text-sm sm:text-base md:text-lg text-center">
                  No products found.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowFilters(false)}
          />

          <div className="absolute right-0 top-0 h-full w-[88%] sm:w-[70%] md:w-[55%] max-w-md bg-brand-main shadow-2xl overflow-y-auto animate-in slide-in-from-right duration-300">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 bg-brand-card border-b border-brand-border">
              <h2 className="text-base sm:text-lg font-semibold text-brand-primary">
                Filters
              </h2>

              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-brand-secondary hover:text-brand-gold hover:bg-brand-card-hover transition-all"
                aria-label="Close filters"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              <FilterSidebar filter={filter} setFilter={setFilter} />
            </div>

            <div className="sticky bottom-0 p-3 sm:p-4 bg-brand-card border-t border-brand-border">
              <button
                type="button"
                onClick={() => setShowFilters(false)}
                className="w-full py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-brand-gold text-white text-sm sm:text-base font-medium hover:bg-brand-gold-hover transition-all"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;