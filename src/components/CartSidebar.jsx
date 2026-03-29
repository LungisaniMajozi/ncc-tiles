import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

const CartSidebar = () => {
  const {
    isOpen,
    setIsOpen,
    cart,
    removeFromCart,
    updateQty,
    total,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    setIsOpen(false);
    navigate("/checkout");
  };

  // Format price in Rand
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <div className="flex items-center space-x-3">
                <ShoppingCart className="text-primary" size={24} />
                <h2 className="text-xl font-bold text-secondary">Your Cart</h2>
                <span className="bg-primary text-white text-sm px-2 py-1 rounded-full">
                  {cart.length} {cart.length === 1 ? "item" : "items"}
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <Package size={64} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">Your cart is empty</p>
                  <Link
                    to="/products"
                    onClick={() => setIsOpen(false)}
                    className="text-primary font-medium hover:underline"
                  >
                    Browse Products →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-4 p-4 bg-gray-50 rounded-xl"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                              e.target.parentElement.innerHTML =
                                '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>';
                            }}
                          />
                        ) : (
                          <Package size={32} className="text-gray-400" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1">
                        <h3 className="font-semibold text-secondary text-sm mb-1">
                          {item.name}
                        </h3>
                        <p className="text-xs text-gray-500 mb-2 font-mono">
                          {item.code}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-2">
                          {item.size && (
                            <span className="text-xs bg-white px-2 py-1 rounded border">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="text-xs bg-white px-2 py-1 rounded border">
                              Color: {item.color}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between">
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() =>
                                updateQty(item.key, item.quantity - 1)
                              }
                              className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQty(item.key, item.quantity + 1)
                              }
                              className="w-7 h-7 flex items-center justify-center border rounded hover:bg-gray-100"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Price & Remove */}
                          <div className="flex items-center space-x-3">
                            <span className="font-bold text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.key)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Total & Checkout */}
            {cart.length > 0 && (
              <div className="border-t p-6 space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(total)}</span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium text-green-600">
                    Calculated at checkout
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-secondary">Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ShoppingCart size={18} />
                </button>

                {/* Continue Shopping */}
                <Link
                  to="/products"
                  onClick={() => setIsOpen(false)}
                  className="block text-center text-sm text-gray-600 hover:text-primary transition"
                >
                  Continue Shopping →
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;
