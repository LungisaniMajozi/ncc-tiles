import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
};

// 🇿🇦 NCC Tiles - Official Product Catalog (12 products from PDF)
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
    price: 459.99,
    inStock: true,
    image: null,
    description: "Premium glossy porcelain tile for elegant interiors",
  },
  {
    id: 2,
    code: "MSG66003M",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    sizes: ["600x600"],
    colors: ["Cream", "Ivory", "Brown"],
    price: 479.99,
    inStock: true,
    image: null,
    description: "High-quality glossy finish with rich color options",
  },
  {
    id: 3,
    code: "MSG66004M",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    sizes: ["600x600"],
    colors: ["Pearl", "Sand", "Charcoal"],
    price: 469.99,
    inStock: true,
    image: null,
    description: "Versatile glossy tile for modern spaces",
  },
  {
    id: 4,
    code: "MSG66005S",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    sizes: ["600x600"],
    colors: ["Marble White", "Marble Grey"],
    price: 499.99,
    inStock: true,
    image: null,
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
    price: 529.99,
    inStock: true,
    image: null,
    description: "Elegant polished finish with marble aesthetics",
  },
  {
    id: 6,
    code: "NRP660024",
    name: "Polished Porcelain Tile",
    category: "600x600 Polished",
    sizes: ["600x600"],
    colors: ["Ivory Polish", "Grey Polish"],
    price: 549.99,
    inStock: false,
    image: null,
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
    price: 429.99,
    inStock: true,
    slipResistant: true,
    image: null,
    description: "Slip-resistant matt finish for bathrooms & kitchens",
  },
  {
    id: 8,
    code: "MSM66032M",
    name: "Matt Porcelain Tile",
    category: "600x600 Matt",
    sizes: ["600x600"],
    colors: ["Stone Grey", "Earth Brown"],
    price: 439.99,
    inStock: true,
    slipResistant: true,
    image: null,
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
    price: 659.99,
    inStock: true,
    image: null,
    description: "Modern large format glazed tile for spacious areas",
  },
  {
    id: 10,
    code: "NRP61012",
    name: "Large Format Glazed Tile",
    category: "60x120 Glazed",
    sizes: ["60x120"],
    colors: ["Marble Effect", "Concrete Grey"],
    price: 689.99,
    inStock: true,
    image: null,
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
    price: 729.99,
    inStock: false,
    image: null,
    description: "Luxury polished large format for premium projects",
  },
  {
    id: 12,
    code: "NRP61004",
    name: "Large Format Polished Tile",
    category: "60x120 Polished",
    sizes: ["60x120"],
    colors: ["Ivory Polish", "Pearl Grey"],
    price: 749.99,
    inStock: true,
    image: null,
    description: "High-end polished tile for statement installations",
  },
];

// 🔄 Data versioning to ensure consistency across environments
const DATA_VERSION = "v1.0-ncc-official";

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from localStorage or use defaults
  useEffect(() => {
    const loadProducts = () => {
      try {
        const stored = localStorage.getItem("ncc_products");
        const storedVersion = localStorage.getItem("ncc_data_version");

        // If version mismatch or no data, use defaults
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

  // Save to localStorage whenever products change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem("ncc_products", JSON.stringify(products));
      } catch (error) {
        console.error("Error saving products:", error);
      }
    }
  }, [products, loading]);

  // 🔧 Admin: Add new product
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

  // 🔧 Admin: Update product
  const updateProduct = (productId, updates) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p,
      ),
    );
  };

  // 🔧 Admin: Delete product
  const deleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      return true;
    }
    return false;
  };

  // 🔧 Admin: Toggle stock status
  const toggleStock = (productId) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p)),
    );
  };

  // 🔧 Admin: Update product image
  const updateProductImage = (productId, imageData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, image: imageData } : p)),
    );
  };

  // 🔧 Admin: Reset to default 12 products
  const resetToDefaults = () => {
    if (
      window.confirm(
        "⚠️ This will delete all custom products and restore the official 12 NCC products. Continue?",
      )
    ) {
      localStorage.setItem("ncc_products", JSON.stringify(defaultProducts));
      localStorage.setItem("ncc_data_version", DATA_VERSION);
      setProducts(defaultProducts);
      return true;
    }
    return false;
  };

  // 🔍 Filter helpers
  const getByCategory = (category) =>
    products.filter((p) => p.category === category);

  const getInStock = () => products.filter((p) => p.inStock);

  const getById = (id) => products.find((p) => p.id === Number(id));

  const categories = [...new Set(products.map((p) => p.category))].sort();

  // 🔍 Search functionality
  const searchProducts = (query) => {
    const q = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.code?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q),
    );
  };

  // 📊 Stats
  const totalProducts = products.length;
  const inStockCount = products.filter((p) => p.inStock).length;
  const outOfStockCount = products.filter((p) => !p.inStock).length;

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
        totalProducts,
        inStockCount,
        outOfStockCount,
        defaultCount: defaultProducts.length,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
