import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getAllProducts } from "../api/productApi"; 

const RelatedProducts = ({ currentProductId, category }) => {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        setLoading(true);
        const res = await getAllProducts();
        
        // استخراج مصفوفة المنتجات بناءً على هيكل الـ API لديك
        const products = res.data?.products || res.products || res.data || [];
        
        // تصفية المنتجات:
        // 1. استبعاد المنتج الحالي
        // 2. تصفية المنتجات التي تنتمي لنفس الـ category (نص مقارنة مباشرة)
        const filtered = products.filter((item) => {
          const itemId = item._id || item.id;
          const isNotCurrent = String(itemId) !== String(currentProductId);
          const isSameCategory = category ? item.category === category : true;
          
          return isNotCurrent && isSameCategory;
        });
        
        // إذا لم توجد منتجات كافية في نفس القسم، نعرض منتجات أخرى كبديل حتى لا يظهر الفراغ
        const finalProducts = filtered.length > 0 
          ? filtered 
          : products.filter(item => String(item._id || item.id) !== String(currentProductId));
        
        setRelated(finalProducts.slice(0, 4)); // عرض أول 4 منتجات مرتبطة
      } catch (error) {
        console.error("Error loading related products:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentProductId) {
      fetchRelated();
    }
  }, [currentProductId, category]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Loader2 className="animate-spin text-brand-gold" size={30} />
      </div>
    );
  }

  if (related.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-semibold text-brand-primary mb-6">
        Related Products
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {related.map((item) => {
          const imgUrl = item.images?.[0]?.url || item.images?.[0] || item.image || "";
          const itemId = item._id || item.id;
          return (
            <Link
              key={itemId}
              to={`/products/${itemId}`}
              className="bg-brand-card rounded-2xl p-4 border border-brand-border flex flex-col justify-between hover:scale-105 transition-all duration-300"
            >
              <div className="h-48 flex items-center justify-center mb-4">
                <img
                  src={imgUrl}
                  alt={item.name}
                  className="max-h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-brand-primary truncate">
                  {item.name}
                </h3>
                <p className="text-brand-gold font-bold mt-2">
                  EGP {item.discountPrice || item.price}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedProducts;