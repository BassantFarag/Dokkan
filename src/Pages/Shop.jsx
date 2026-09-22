import SearchCart from "../components/SearchCart";
import FilterSidebar from "../components/FilterSidebar";
import Product from "../components/ProductCard";
import { useState, useEffect } from "react";
import { getAllProducts } from "../api/productApi";
import { toast } from "react-toastify";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "Default",
  });

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name?.toLowerCase().includes(search.toLowerCase()) ||
        product.category?.toLowerCase().includes(search.toLowerCase());

      const productCategory = product.category?.toLowerCase() || "";
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

  return (
    <div className="min-h-screen bg-brand-main text-brand-primary pb-10 pt-24 sm:pt-28 md:pt-32 transition-colors duration-300">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    
        <SearchCart search={search} setSearch={setSearch} />

   
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
          <div className="lg:col-span-1">
            <FilterSidebar filter={filter} setFilter={setFilter} />
          </div>

          
          <main className="lg:col-span-3">
            {loading ? (
              <div className="flex items-center justify-center min-h-[300px]">
                <p className="text-brand-secondary text-base sm:text-lg md:text-xl">
                  Loading...
                </p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                {filteredProducts.map((item) => (
                  <Product key={item._id || item.id} product={item} />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center min-h-[300px] bg-brand-card rounded-2xl border border-brand-border">
                <p className="text-brand-secondary text-sm sm:text-base md:text-lg text-center">
                  No products found.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}