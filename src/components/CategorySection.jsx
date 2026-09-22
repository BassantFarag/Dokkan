import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Tv, 
  Shirt, 
  Sparkles, 
  ShoppingBag, 
  Footprints, 
  Watch, 
  Layers 
} from "lucide-react";
import { getAllProducts } from "../api/productApi";


const categoryIcons = {
  electronics: Tv,
  clothing: Shirt,
  fashion: Shirt,
  shoes: Footprints,
  watches: Watch,
  default: Layers,
};

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts()
      .then((res) => {
        const products = res.data.products || [];

        const categoryMap = products.reduce((acc, product) => {
          if (product.category) {
            const catLower = product.category.toLowerCase();
            if (!acc[catLower]) {
              acc[catLower] = {
                name: product.category,
                count: 0,
              };
            }
            acc[catLower].count += 1;
          }
          return acc;
        }, {});

        setCategories(Object.values(categoryMap));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/shop?category=${encodeURIComponent(categoryName.toLowerCase())}`);
  };

  if (loading) {
    return (
      <div className="py-16 text-center text-[#8D837D] text-sm">
        Loading Categories...
      </div>
    );
  }

  return (
    <section className="py-16 px-6 text-[#1C1713] dark:text-[#EBE8E5]">
      <div className="max-w-7xl mx-auto text-center space-y-10">
     
        <div className="space-y-2">
          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Shop by Category
          </h2>
          <p className="text-sm text-[#8D837D]">
            Browse our wide range of categories
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const IconComponent =
              categoryIcons[cat.name.toLowerCase()] || categoryIcons.default;

            return (
              <div
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group relative cursor-pointer overflow-hidden rounded-[24px] border border-[#8D837D]/20 bg-[#EBE8E5]/40 p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-[#BAAB9A] hover:shadow-xl dark:border-[#8D837D]/25 dark:bg-[#1C1713]/70 dark:hover:border-[#BAAB9A]"
              >
                <div className="flex flex-col items-center space-y-4">
    
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDD4C1]/50 text-[#5C422B] transition-transform duration-300 group-hover:scale-110 dark:bg-[#3D342B] dark:text-[#BAAB9A]">
                    <IconComponent className="h-7 w-7" />
                  </div>

                  {/* Info */}
                  <div className="text-center space-y-1">
                    <h3 className="text-base font-bold capitalize text-[#1C1713] dark:text-[#EBE8E5]">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-[#8D837D]">
                      {cat.count} {cat.count === 1 ? "product" : "products"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}