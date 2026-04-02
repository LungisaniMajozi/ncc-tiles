import { Link } from "react-router-dom";
import { Package, TrendingUp, CheckCircle, Home, Hammer } from "lucide-react";
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

  const isRoofing = product.type === "roofing";

  return (
    <motion.div
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
        !product.inStock ? "opacity-80 hover:opacity-100" : ""
      }`}
    >
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden group">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.parentElement.querySelector(
                ".fallback-icon",
              ).style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback Icon */}
        <div
          className={`fallback-icon absolute inset-0 flex items-center justify-center ${product.image ? "" : ""}`}
        >
          {isRoofing ? (
            <Hammer size={64} className="text-gray-400" />
          ) : (
            <Package size={64} className="text-gray-400" />
          )}
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          {isRoofing ? (
            <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm flex items-center">
              <Hammer size={12} className="mr-1" />
              Roofing
            </span>
          ) : (
            <span className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm flex items-center">
              <Home size={12} className="mr-1" />
              Floor Tile
            </span>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col space-y-2">
          {!product.inStock && (
            <span className="bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm">
              Out of Stock
            </span>
          )}
          {product.slipResistant && (
            <span className="bg-blue-500 text-white text-xs px-2.5 py-1 rounded-full font-medium shadow-sm flex items-center">
              <CheckCircle size={12} />
              <span>Slip Resistant</span>
            </span>
          )}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
          <Link
            to={`/products/${product.id}`}
            className={`px-4 py-2 bg-white/90 text-primary font-medium rounded-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg ${
              !product.inStock ? "pointer-events-none opacity-50" : ""
            }`}
          >
            View Details
          </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Product Code */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {product.code}
          </span>
          {product.inStock && (
            <span className="text-xs text-green-600 font-medium flex items-center">
              <CheckCircle size={12} className="mr-1" />
              Available
            </span>
          )}
        </div>

        {/* Product Name */}
        <h3
          className="font-bold text-lg text-secondary mb-2 line-clamp-1"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 min-h-[40px]">
            {product.description}
          </p>
        )}

        {/* Size & Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-1.5 text-sm text-gray-600">
            <TrendingUp size={14} className="text-primary" />
            <span>
              {product.sizes?.[0] || (isRoofing ? "0.5mm" : "600x600")}
            </span>
          </div>
          <span className="text-xl font-bold text-primary">
            {formatPrice(product.price)}
            <span className="text-sm font-normal text-gray-500">
              {isRoofing ? "/m" : "/m²"}
            </span>
          </span>
        </div>

        {/* Color Options */}
        {product.colors && product.colors.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">Available in:</p>
            <div className="flex flex-wrap gap-1.5">
              {product.colors.slice(0, 4).map((color, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md hover:bg-primary hover:text-white transition-colors cursor-default"
                  title={color}
                >
                  {color}
                </span>
              ))}
              {product.colors.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                  +{product.colors.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <Link
          to={`/products/${product.id}`}
          className={`block w-full text-center py-3 rounded-lg font-semibold transition-all duration-200 ${
            product.inStock
              ? "bg-primary text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          {product.inStock ? "View Details →" : "Currently Unavailable"}
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
