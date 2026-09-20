import { Search, SlidersHorizontal, X } from "lucide-react";
import FilterSidebar from "../components/FilterSidebar";
import Product from "../components/ProductCard";
import { useState, useEffect } from "react";
import {getAllProducts} from '../api/productApi'
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

        const response = await getAllProducts()

        const fetchedData = response.data.products ;

        setProducts(Array.isArray(fetchedData) ? fetchedData : []);
      } catch (error) {
       toast.error(error.response?.data?.message || error.message || "Failed to load products");
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
      // Search filter
      const matchesSearch = productName.includes(searchValue);
      // Category filter
      const matchesCategory =
        filter.category === "all" ||
        productCategory === filter.category.toLowerCase();
      // Price filter
      const productPrice = Number(
        product.discountPrice || product.price || 0
      );

      const minPrice =
        filter.minPrice === "" ? 0 : Number(filter.minPrice);

      const maxPrice =
        filter.maxPrice === "" ? Infinity : Number(filter.maxPrice);

      const matchesMinPrice = productPrice >= minPrice;
      const matchesMaxPrice = productPrice <= maxPrice;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesMinPrice &&
        matchesMaxPrice
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
    <div className="min-h-screen bg-brand-main text-brand-primary pb-12 pt-32 md:pt-28 transition-colors duration-300">
      <div className="px-4 md:px-8 max-w-7xl mx-auto">

        <div className="w-full mb-8 flex items-center gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-brand-secondary">
              <Search
                className="h-5 w-5"
                strokeWidth={2.5}
              />
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-3 bg-brand-card border border-brand-border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-gold focus:border-transparent text-sm text-brand-primary placeholder:text-brand-secondary transition-all"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowFilters((prev) => !prev)}
            className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 bg-brand-card border border-brand-border rounded-xl text-brand-primary hover:border-brand-gold transition-all"
          >
            {showFilters ? (
              <X className="h-5 w-5" />
            ) : (
              <SlidersHorizontal className="h-5 w-5" />
            )}

            <span className="text-sm font-medium">
              {showFilters ? "Close" : "Filter"}
            </span>
          </button>
        </div>

        {showFilters && (
          <div className="lg:hidden mb-6">
            <FilterSidebar
              filter={filter}
              setFilter={setFilter}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="hidden lg:block lg:col-span-1">
            <FilterSidebar
              filter={filter}
              setFilter={setFilter}
            />
          </div>

          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {loading ? (
              <p className="text-brand-secondary col-span-full text-center text-xl">
                Loading...
              </p>
            ) : filteredProducts.length > 0 ? (
              filteredProducts.map((item) => (
                <Product
                  key={item._id || item.id}
                  product={item}
                />
              ))
            ) : (
              <p className="text-brand-secondary col-span-full text-center text-xl">
                No products found.
              </p>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default Shop;

