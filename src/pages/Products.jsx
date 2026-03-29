import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { useState } from "react";
import { Package } from "lucide-react";

const Products = () => {
  const { products, categories, loading } = useProducts();
  const [filter, setFilter] = useState("all");

  const safeProducts = products || [];
  const safeCategories = categories || [];

  const filtered =
    filter === "all"
      ? safeProducts
      : safeProducts.filter((p) => p.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-secondary mb-6">All Tiles</h1>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "all"
                ? "bg-primary text-white"
                : "bg-white text-gray-700 hover:bg-gray-100 border"
            }`}
          >
            All
          </button>
          {safeCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === cat
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100 border"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Package size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No products found</p>
            <button
              onClick={() => setFilter("all")}
              className="text-primary hover:underline mt-2"
            >
              View all products →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
