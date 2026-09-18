import { useState, useEffect } from "react";
import { Heart, ShoppingCart, Star } from "lucide-react";
import axios from "axios";

export const Product = () => {
  const [product, setProduct] = useState({
    name: "",
    category: "",
    discountPrice: "",
    price: "",
    stock: "",
    numReviews: "",
    images: [],
  });

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          "https://dokkan-store-api.vercel.app/api/products",
        );
        setProduct(response.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    getProduct();
  }, []);

  if (!product) {
    return (
      <div className="justify-center items-center translate-y-50 translate-x-50 text-center text-3xl text-brand-primary">
        Loading...
      </div>
    );
  }

  return (
    <div className="w-full bg-brand-card border border-brand-border rounded-2xl shadow-sm p-3 ml-10 flex flex-col gap-2.5 relative text-brand-primary">
      <div className="flex items-center justify-between w-full">
        <span className="px-3 py-0.5 text-xs font-medium bg-brand-main text-brand-secondary rounded-full">
          {product.category}
        </span>

        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 text-xs font-semibold bg-brand-gold/20 text-brand-gold rounded-full">
            {product.stock}
          </span>

          <button className="p-1.5 rounded-full bg-brand-main border border-brand-border shadow-sm text-brand-secondary hover:text-brand-gold transition-colors">
            <Heart className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="w-full h-40 rounded-xl overflow-hidden bg-brand-main flex items-center justify-center">
        <img
          src={product.images?.[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-brand-primary pt-2">
          {product.name}
        </h3>

        {/* عايزه تتعدل */}

        <div className="flex items-center gap-1 pt-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3.5 w-3.5 ${
                  star <= Math.round(product.averageRating)
                    ? "fill-brand-gold text-brand-gold"
                    : "text-brand-border"
                }`}
              />
            ))}
          </div>

          <span className="text-[10px] text-brand-secondary ml-0.5">
            ({product.numReviews})
          </span>
        </div>

        <div className="flex items-baseline gap-2 pt-6">
          <span className="text-2xl font-bold text-brand-gold">
            {product.discountPrice}
          </span>

          <span className="text-xl text-brand-secondary line-through">
            {product.price}
          </span>
        </div>
      </div>

      <button className="w-full py-3 mt-2 bg-brand-gold hover:bg-brand-gold-hover text-brand-main font-medium rounded-xl flex items-center justify-center gap-1.5 text-xs transition-colors shadow-sm">
        <ShoppingCart className="h-4 w-4" />
        Add to Cart
      </button>
    </div>
  );
};

export default Product;
