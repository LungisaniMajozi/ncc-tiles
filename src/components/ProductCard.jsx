import { Link } from "react-router-dom";
import { Package, TrendingUp, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    })
      .format(price)
      .replace("ZAR", "R");
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        !product.inStock ? "opacity-80" : ""
      }`}
    >
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <div
          className={`flex items-center justify-center ${product.image ? "hidden" : ""}`}
        >
          <Package size={64} className="text-gray-400" />
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          {!product.inStock && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              Out of Stock
            </span>
          )}
          {product.slipResistant && (
            <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium flex items-center space-x-1">
              <CheckCircle size={12} />
              <span>Slip Resistant</span>
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="text-xs font-mono text-gray-500 mb-1">
          {product.code}
        </div>
        <h3 className="font-bold text-lg text-secondary mb-2 line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <TrendingUp size={14} className="text-primary" />
            <span>{product.sizes?.[0] || "600x600"}</span>
          </div>
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
            <span className="text-sm font-normal text-gray-500">/m²</span>
          </span>
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {product.colors.slice(0, 3).map((color, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {color}
              </span>
            ))}
            {product.colors.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
        )}

        <Link
          to={`/products/${product.id}`}
          className={`block w-full text-center py-2.5 rounded-lg font-medium transition ${
            product.inStock
              ? "bg-primary text-white hover:bg-blue-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {product.inStock ? "View Details" : "Unavailable"}
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
