import { Link } from "react-router-dom";
import { Package, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const ProductCard = ({ product }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${!product.inStock ? "opacity-80" : ""}`}
    >
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package size={64} className="text-gray-400" />
        )}
        {!product.inStock && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Out of Stock
          </span>
        )}
        {product.slipResistant && (
          <span className="absolute top-3 left-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Slip Resistant
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="text-xs text-gray-500 mb-1">{product.code}</div>
        <h3 className="font-bold text-lg text-secondary mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || "Premium porcelain tile"}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <TrendingUp size={14} className="text-primary" />
            <span>{product.sizes?.[0] || "600x600"}</span>
          </div>
          <span className="text-xl font-bold text-primary">
            R{product.price}
            <span className="text-sm font-normal text-gray-500">/m²</span>
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {product.colors?.slice(0, 3).map((c, i) => (
            <span
              key={i}
              className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
            >
              {c}
            </span>
          ))}
          {product.colors?.length > 3 && (
            <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
              +{product.colors.length - 3}
            </span>
          )}
        </div>

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
