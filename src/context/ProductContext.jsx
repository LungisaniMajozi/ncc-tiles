import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
};

// 🇿🇦 NCC Tiles - Official 12 Products from PDF
// Prices in South African Rand (R) per m²
const defaultProducts = [
  // 600x600 Glossy
  {
    id: 1,
    code: "MSG66002M",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    sizes: ["600x600"],
    colors: ["White", "Beige", "Grey", "Black"],
    price: 45.99,
    inStock: true,
    image: "/tiles/msg66002m.jpg",
    description: "Premium glossy porcelain tile for elegant interiors",
  },
  {
    id: 2,
    code: "MSG66003M",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    sizes: ["600x600"],
    colors: ["Cream", "Ivory", "Brown"],
    price: 47.99,
    inStock: true,
    image: "/tiles/msg66003m.jpg",
    description: "High-quality glossy finish with rich color options",
  },
  {
    id: 3,
    code: "MSG66004M",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    sizes: ["600x600"],
    colors: ["Pearl", "Sand", "Charcoal"],
    price: 46.99,
    inStock: true,
    image: "/tiles/msg66004m.jpg",
    description: "Versatile glossy tile for modern spaces",
  },
  {
    id: 4,
    code: "MSG66005S",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    sizes: ["600x600"],
    colors: ["Marble White", "Marble Grey"],
    price: 49.99,
    inStock: true,
    image: "/tiles/msg66005s.jpg",
    description: "Luxury marble-effect glossy porcelain",
  },

  // 600x600 Polished
  {
    id: 5,
    code: "NRP660016",
    name: "Polished Porcelain Tile",
    category: "600x600 Polished",
    sizes: ["600x600"],
    colors: ["Marble White", "Marble Grey", "Marble Black"],
    price: 52.99,
    inStock: true,
    image: "/tiles/nrp660016.jpg",
    description: "Elegant polished finish with marble aesthetics",
  },
  {
    id: 6,
    code: "NRP660024",
    name: "Polished Porcelain Tile",
    category: "600x600 Polished",
    sizes: ["600x600"],
    colors: ["Ivory Polish", "Grey Polish"],
    price: 54.99,
    inStock: false,
    image: "/tiles/nrp660024.jpg",
    description: "Premium polished porcelain for luxury applications",
  },

  // 600x600 Matt (Slip Resistant)
  {
    id: 7,
    code: "MSM66031M",
    name: "Matt Porcelain Tile",
    category: "600x600 Matt",
    sizes: ["600x600"],
    colors: ["Matte White", "Matte Grey", "Matte Beige"],
    price: 42.99,
    inStock: true,
    slipResistant: true,
    image: "/tiles/msm66031m.jpg",
    description: "Slip-resistant matt finish for bathrooms & kitchens",
  },
  {
    id: 8,
    code: "MSM66032M",
    name: "Matt Porcelain Tile",
    category: "600x600 Matt",
    sizes: ["600x600"],
    colors: ["Stone Grey", "Earth Brown"],
    price: 43.99,
    inStock: true,
    slipResistant: true,
    image: "/tiles/msm66032m.jpg",
    description: "Natural stone look with safety grip surface",
  },

  // 60x120 Glazed
  {
    id: 9,
    code: "NRP61011",
    name: "Large Format Glazed Tile",
    category: "60x120 Glazed",
    sizes: ["60x120"],
    colors: ["White", "Grey", "Beige", "Anthracite"],
    price: 65.99,
    inStock: true,
    image: "/tiles/nrp61011.jpg",
    description: "Modern large format glazed tile for spacious areas",
  },
  {
    id: 10,
    code: "NRP61012",
    name: "Large Format Glazed Tile",
    category: "60x120 Glazed",
    sizes: ["60x120"],
    colors: ["Marble Effect", "Concrete Grey"],
    price: 68.99,
    inStock: true,
    image: "/tiles/nrp61012.jpg",
    description: "Contemporary large tile with designer finishes",
  },

  // 60x120 Polished
  {
    id: 11,
    code: "NRP61003",
    name: "Large Format Polished Tile",
    category: "60x120 Polished",
    sizes: ["60x120"],
    colors: ["Marble White", "Marble Grey"],
    price: 72.99,
    inStock: false,
    image: "/tiles/nrp61003.jpg",
    description: "Luxury polished large format for premium projects",
  },
  {
    id: 12,
    code: "NRP61004",
    name: "Large Format Polished Tile",
    category: "60x120 Polished",
    sizes: ["60x120"],
    colors: ["Ivory Polish", "Pearl Grey"],
    price: 74.99,
    inStock: true,
    image: "/tiles/nrp61004.jpg",
    description: "High-end polished tile for statement installations",
  },
];

const DATA_VERSION = "v1.0-ncc-12products";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = () => {
      try {
        const stored = localStorage.getItem("ncc_products");
        const storedVersion = localStorage.getItem("ncc_data_version");

        if (storedVersion !== DATA_VERSION || !stored) {
          localStorage.setItem("ncc_products", JSON.stringify(defaultProducts));
          localStorage.setItem("ncc_data_version", DATA_VERSION);
          setProducts(defaultProducts);
        } else {
          setProducts(JSON.parse(stored));
        }
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts(defaultProducts);
      }
      setLoading(false);
    };
    loadProducts();
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem("ncc_products", JSON.stringify(products));
      } catch (error) {
        console.error("Error saving products:", error);
      }
    }
  }, [products, loading]);

  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      inStock: product.inStock !== undefined ? product.inStock : true,
      createdAt: new Date().toISOString(),
    };
    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
  };

  const deleteProduct = (productId) => {
    if (window.confirm("Delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return true;
    }
    return false;
  };

  const toggleStock = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p)),
    );
  };

  const updateProductImage = (productId, imageData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, image: imageData } : p)),
    );
  };

  const resetToDefaults = () => {
    if (window.confirm("⚠️ Reset to official 12 NCC products?")) {
      localStorage.setItem("ncc_products", JSON.stringify(defaultProducts));
      localStorage.setItem("ncc_data_version", DATA_VERSION);
      setProducts(defaultProducts);
      return true;
    }
    return false;
  };

  const getByCategory = (category) =>
    products.filter((p) => p.category === category);
  const getInStock = () => products.filter((p) => p.inStock);
  const getById = (id) => products.find((p) => p.id === Number(id));
  const categories = [...new Set(products.map((p) => p.category))].sort();

  const searchProducts = (query) => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleStock,
        updateProductImage,
        resetToDefaults,
        getByCategory,
        getInStock,
        getById,
        searchProducts,
        totalProducts: products.length,
        inStockCount: products.filter((p) => p.inStock).length,
        outOfStockCount: products.filter((p) => !p.inStock).length,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
