import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ncc_cart");
    if (stored) setCart(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("ncc_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, size, color, qty = 1) => {
    const key = `${product.id}-${size}-${color}`;
    const existing = cart.find(
      (item) => `${item.id}-${item.size}-${item.color}` === key,
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          `${item.id}-${item.size}-${item.color}` === key
            ? { ...item, quantity: item.quantity + qty }
            : item,
        ),
      );
    } else {
      setCart([...cart, { ...product, size, color, quantity: qty, key }]);
    }
    setIsOpen(true);
  };

  const removeFromCart = (key) => {
    setCart(cart.filter((item) => item.key !== key));
  };

  const updateQty = (key, qty) => {
    if (qty <= 0) removeFromCart(key);
    else
      setCart(
        cart.map((item) =>
          item.key === key ? { ...item, quantity: qty } : item,
        ),
      );
  };

  const clearCart = () => setCart([]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        total,
        count,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
