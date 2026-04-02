import { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context)
    throw new Error("useProducts must be used within ProductProvider");
  return context;
};

// 🇿🇦 NCC - Complete Product Catalog (Floor Tiles + Roofing Sheets)
const defaultProducts = [
  // ========== FLOOR TILES - 600x600 GLOSSY ==========
  {
    id: 1,
    code: "MSG66002M",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    type: "floor-tile",
    sizes: ["600x600"],
    colors: ["White", "Beige", "Grey", "Black"],
    price: 459.99,
    inStock: true,
    image: "/tiles/msg66002m.jpg",
    description: "Premium glossy porcelain tile for elegant interiors",
  },
  {
    id: 2,
    code: "MSG66003M",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    type: "floor-tile",
    sizes: ["600x600"],
    colors: ["Cream", "Ivory", "Brown"],
    price: 479.99,
    inStock: true,
    image: "/tiles/msg66003m.jpg",
    description: "High-quality glossy finish with rich color options",
  },
  {
    id: 3,
    code: "MSG66004M",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    type: "floor-tile",
    sizes: ["600x600"],
    colors: ["Pearl", "Sand", "Charcoal"],
    price: 469.99,
    inStock: true,
    image: "/tiles/msg66004m.jpg",
    description: "Versatile glossy tile for modern spaces",
  },
  {
    id: 4,
    code: "MSG66005S",
    name: "Glossy Porcelain Tile",
    category: "600x600 Glossy",
    type: "floor-tile",
    sizes: ["600x600"],
    colors: ["Marble White", "Marble Grey"],
    price: 499.99,
    inStock: true,
    image: "/tiles/msg66005s.jpg",
    description: "Luxury marble-effect glossy porcelain",
  },

  // ========== FLOOR TILES - 600x600 POLISHED ==========
  {
    id: 5,
    code: "NRP660016",
    name: "Polished Porcelain Tile",
    category: "600x600 Polished",
    type: "floor-tile",
    sizes: ["600x600"],
    colors: ["Marble White", "Marble Grey", "Marble Black"],
    price: 529.99,
    inStock: true,
    image: "/tiles/nrp660016.jpg",
    description: "Elegant polished finish with marble aesthetics",
  },
  {
    id: 6,
    code: "NRP660024",
    name: "Polished Porcelain Tile",
    category: "600x600 Polished",
    type: "floor-tile",
    sizes: ["600x600"],
    colors: ["Ivory Polish", "Grey Polish"],
    price: 549.99,
    inStock: false,
    image: "/tiles/nrp660024.jpg",
    description: "Premium polished porcelain for luxury applications",
  },

  // ========== FLOOR TILES - 600x600 MATT ==========
  {
    id: 7,
    code: "MSM66031M",
    name: "Matt Porcelain Tile",
    category: "600x600 Matt",
    type: "floor-tile",
    sizes: ["600x600"],
    colors: ["Matte White", "Matte Grey", "Matte Beige"],
    price: 429.99,
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
    type: "floor-tile",
    sizes: ["600x600"],
    colors: ["Stone Grey", "Earth Brown"],
    price: 439.99,
    inStock: true,
    slipResistant: true,
    image: "/tiles/msm66032m.jpg",
    description: "Natural stone look with safety grip surface",
  },

  // ========== FLOOR TILES - 60x120 LARGE FORMAT ==========
  {
    id: 9,
    code: "NRP61011",
    name: "Large Format Glazed Tile",
    category: "60x120 Glazed",
    type: "floor-tile",
    sizes: ["60x120"],
    colors: ["White", "Grey", "Beige", "Anthracite"],
    price: 659.99,
    inStock: true,
    image: "/tiles/nrp61011.jpg",
    description: "Modern large format glazed tile for spacious areas",
  },
  {
    id: 10,
    code: "NRP61012",
    name: "Large Format Glazed Tile",
    category: "60x120 Glazed",
    type: "floor-tile",
    sizes: ["60x120"],
    colors: ["Marble Effect", "Concrete Grey"],
    price: 689.99,
    inStock: true,
    image: "/tiles/nrp61012.jpg",
    description: "Contemporary large tile with designer finishes",
  },
  {
    id: 11,
    code: "NRP61003",
    name: "Large Format Polished Tile",
    category: "60x120 Polished",
    type: "floor-tile",
    sizes: ["60x120"],
    colors: ["Marble White", "Marble Grey"],
    price: 729.99,
    inStock: false,
    image: "/tiles/nrp61003.jpg",
    description: "Luxury polished large format for premium projects",
  },
  {
    id: 12,
    code: "NRP61004",
    name: "Large Format Polished Tile",
    category: "60x120 Polished",
    type: "floor-tile",
    sizes: ["60x120"],
    colors: ["Ivory Polish", "Pearl Grey"],
    price: 749.99,
    inStock: true,
    image: "/tiles/nrp61004.jpg",
    description: "High-end polished tile for statement installations",
  },

  // ========== ROOFING SHEETS - NEW PRODUCTS ==========
  {
    id: 13,
    code: "DA02",
    name: "IBR Roof Sheet",
    category: "Roofing Sheets",
    type: "roofing",
    sizes: ["0.5mm", "0.6mm"],
    colors: ["White", "Blue", "Brown", "Grey", "Green", "Red"],
    price: 185.0,
    inStock: true,
    image: "/roofing/ibr-da02.jpg",
    description:
      "IBR (Inverted Box Rib) roofing sheet - popular choice for residential and commercial roofing",
    unit: "per meter",
  },
  {
    id: 14,
    code: "DA04",
    name: "Corrugated Roof Sheet",
    category: "Roofing Sheets",
    type: "roofing",
    sizes: ["0.5mm", "0.6mm"],
    colors: ["White", "Blue", "Brown", "Grey", "Green", "Red"],
    price: 175.0,
    inStock: true,
    image: "/roofing/corrugated-da04.jpg",
    description:
      "Traditional corrugated roofing sheet - durable and cost-effective",
    unit: "per meter",
  },
  {
    id: 15,
    code: "DA07",
    name: "Widespan Roof Sheet",
    category: "Roofing Sheets",
    type: "roofing",
    sizes: ["0.5mm", "0.6mm"],
    colors: ["White", "Blue", "Brown", "Grey", "Green", "Red"],
    price: 195.0,
    inStock: true,
    image: "/roofing/widespan-da07.jpg",
    description: "Widespan roofing sheet - wider coverage, fewer sheets needed",
    unit: "per meter",
  },
  {
    id: 16,
    code: "DA03",
    name: "Tile Effect Roof Sheet (Grey)",
    category: "Roofing Sheets",
    type: "roofing",
    sizes: ["0.5mm", "0.6mm"],
    colors: ["Grey", "Brown", "Green"],
    price: 210.0,
    inStock: true,
    image: "/roofing/tile-da03.jpg",
    description:
      "Tile effect roofing sheet - combines durability with aesthetic appeal",
    unit: "per meter",
  },
  {
    id: 17,
    code: "DA05",
    name: "Tile Effect Roof Sheet (Brown)",
    category: "Roofing Sheets",
    type: "roofing",
    sizes: ["0.5mm", "0.6mm"],
    colors: ["Brown", "Terracotta", "Red"],
    price: 210.0,
    inStock: true,
    image: "/roofing/tile-da05.jpg",
    description: "Tile effect roofing sheet in brown/terracotta finish",
    unit: "per meter",
  },
  {
    id: 18,
    code: "DA08",
    name: "Tile Effect Roof Sheet (Green)",
    category: "Roofing Sheets",
    type: "roofing",
    sizes: ["0.5mm", "0.6mm"],
    colors: ["Green", "Forest Green"],
    price: 210.0,
    inStock: true,
    image: "/roofing/tile-da08.jpg",
    description: "Tile effect roofing sheet in green finish",
    unit: "per meter",
  },
];

const DATA_VERSION = "v2.0-ncc-with-roofing";

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
    if (window.confirm("Are you sure you want to delete this product?")) {
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
    if (
      window.confirm(
        "⚠️ This will delete all custom products and restore defaults. Continue?",
      )
    ) {
      localStorage.setItem("ncc_products", JSON.stringify(defaultProducts));
      localStorage.setItem("ncc_data_version", DATA_VERSION);
      setProducts(defaultProducts);
      return true;
    }
    return false;
  };

  const getByCategory = (category) =>
    products.filter((p) => p.category === category);
  const getByType = (type) => products.filter((p) => p.type === type);
  const getInStock = () => products.filter((p) => p.inStock);
  const getById = (id) => products.find((p) => p.id === Number(id));

  const categories = [...new Set(products.map((p) => p.category))].sort();
  const productTypes = [...new Set(products.map((p) => p.type))];

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
        inStockCount: products.filter((p) => p.inStock).length,
        outOfStockCount: products.filter((p) => !p.inStock).length,
        floorTilesCount: products.filter((p) => p.type === "floor-tile").length,
        roofingCount: products.filter((p) => p.type === "roofing").length,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export default ProductContext;
