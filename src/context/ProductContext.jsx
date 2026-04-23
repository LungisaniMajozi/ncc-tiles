import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API_BASE_URL from "../config/api";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const API_URL = API_BASE_URL;

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products/`);
      if (res.ok) {
        setProducts(await res.json());
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    const initialFetch = async () => {
      await fetchProducts();
      setLoading(false);
    };
    initialFetch();
  }, []);

  // Real-time polling for product updates - fetch every 5 seconds
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      await fetchProducts();
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(pollInterval);
  }, []);

  const addProduct = async (product) => {
    try {
      const res = await fetch(`${API_URL}/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...product, inStock: true }),
      });
      if (res.ok) {
        const newProduct = await res.json();
        setProducts((prev) => [...prev, newProduct]);
        return newProduct;
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  };

  const updateProduct = async (productId, updates) => {
    try {
      const res = await fetch(`${API_URL}/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const updated = await res.json();
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? updated : p)),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const deleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`${API_URL}/products/${productId}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setProducts((prev) => prev.filter((p) => p.id !== productId));
          return true;
        } else {
          const errorData = await res.json();
          alert(`Could not delete: ${errorData.detail}`);
          return false;
        }
      } catch (e) {
        console.error(e);
        alert("Network Error: Could not connect to the server.");
      }
    }
    return false;
  };

  const toggleStock = async (productId) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      await updateProduct(productId, { ...product, inStock: !product.inStock });
    }
  };

  const updateProductImage = (productId, imageData) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      updateProduct(productId, { ...product, image: imageData });
    }
  };

  const resetToDefaults = () => false; // Not needed with DB

  const getByCategory = (category) =>
    products.filter((p) => p.category === category);
  const getByType = (type) =>
    products.filter((p) => p.category && p.category.includes(type)); // Basic approximation
  const getInStock = () => products; // all are in stock
  const getById = (id) => products.find((p) => p.id === Number(id));

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const productTypes = categories;

  const searchProducts = (query) => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        productTypes,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        updateProductImage,
        resetToDefaults,
        getByCategory,
        getByType,
        getInStock,
        getById,
        searchProducts,
        totalProducts: products.length,
        inStockCount: products.length,
        outOfStockCount: 0,
        floorTilesCount: products.filter((p) => p.category?.includes("Floor"))
          .length,
        roofingCount: products.filter((p) => p.category?.includes("Roof"))
          .length,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
