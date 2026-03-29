import { useParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { ArrowLeft, Package, Check } from "lucide-react";
import { useState } from "react";

const ProductDetails = () => {
  const { id } = useParams();
  const { getById } = useProducts();
  const { addToCart } = useCart();
  const product = getById(id);

  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(
    product?.colors?.[0] || "",
  );
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">
            Product not found
          </h2>
          <Link
            to="/products"
            className="text-primary hover:underline mt-2 inline-block"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Link
          to="/products"
          className="inline-flex items-center text-gray-600 hover:text-primary mb-6"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Products
        </Link>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 md:p-8">
            {/* Image */}
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center h-80">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <Package size={80} className="text-gray-400" />
              )}
            </div>

            {/* Details */}
            <div>
              <span className="text-sm text-gray-500">{product.code}</span>
              <h1 className="text-2xl md:text-3xl font-bold text-secondary mt-1">
                {product.name}
              </h1>
              <p className="text-gray-600 mt-3">
                {product.description || "Premium quality porcelain tile"}
              </p>

              <div className="mt-6">
                <span className="text-3xl font-bold text-primary">
                  R{product.price}
                </span>
                <span className="text-gray-500 ml-1">/ m²</span>
              </div>

              {/* Size Selection */}
              {product.sizes?.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Size
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                          selectedSize === size
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors?.length > 0 && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition ${
                          selectedColor === color
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-gray-300 hover:border-primary"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity (m²)
                </label>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 border rounded-lg hover:bg-gray-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="w-10 h-10 border rounded-lg hover:bg-gray-50"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className={`w-full mt-8 py-4 rounded-xl font-semibold text-white transition flex items-center justify-center space-x-2 ${
                  product.inStock
                    ? "bg-primary hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {product.inStock ? (
                  <>
                    <Check size={20} />
                    <span>
                      Add to Cart - R{(product.price * quantity).toFixed(2)}
                    </span>
                  </>
                ) : (
                  <span>Out of Stock</span>
                )}
              </button>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mt-4">
                {product.slipResistant && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    Slip Resistant
                  </span>
                )}
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    product.inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {product.inStock ? "✓ In Stock" : "✗ Out of Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
