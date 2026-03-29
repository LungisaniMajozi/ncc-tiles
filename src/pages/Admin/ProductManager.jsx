import { useState } from "react";
import { useProducts } from "../../context/ProductContext";
import {
  Plus,
  Edit,
  Trash2,
  Upload,
  X,
  Save,
  Image as ImageIcon,
  Tag,
  Layers,
  CheckCircle,
  XCircle,
  Package,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const ProductManager = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories } =
    useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStock, setFilterStock] = useState("all");

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    category: "",
    sizes: ["600x600"],
    colors: [""],
    price: "",
    inStock: true,
    slipResistant: false,
    image: null,
    description: "",
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [newCategory, setNewCategory] = useState("");
  const [showCategoryInput, setShowCategoryInput] = useState(false);

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      category: "",
      sizes: ["600x600"],
      colors: [""],
      price: "",
      inStock: true,
      slipResistant: false,
      image: null,
      description: "",
    });
    setImagePreview(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product) => {
    setFormData({
      code: product.code || "",
      name: product.name || "",
      category: product.category || "",
      sizes: product.sizes || ["600x600"],
      colors: product.colors || [""],
      price: product.price || "",
      inStock: product.inStock !== undefined ? product.inStock : true,
      slipResistant: product.slipResistant || false,
      image: product.image || null,
      description: product.description || "",
    });
    setImagePreview(product.image);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        setFormData({ ...formData, image: imageData });
        setImagePreview(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (index, value) => {
    const newColors = [...formData.colors];
    newColors[index] = value;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    setFormData({ ...formData, colors: [...formData.colors, ""] });
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData({ ...formData, colors: newColors });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.code ||
      !formData.name ||
      !formData.category ||
      !formData.price
    ) {
      alert("Please fill in all required fields");
      return;
    }

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      colors: formData.colors.filter((c) => c.trim() !== ""),
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
      alert("✅ Product updated successfully!");
    } else {
      addProduct(productData);
      alert("✅ Product added successfully!");
    }
    resetForm();
  };

  // Safe filtering with null checks
  const filteredProducts = (products || []).filter((p) => {
    const name = p?.name?.toLowerCase() || "";
    const code = p?.code?.toLowerCase() || "";
    const category = p?.category || "";
    const search = searchQuery.toLowerCase();

    const matchesSearch = name.includes(search) || code.includes(search);
    const matchesCategory =
      filterCategory === "all" || category === filterCategory;
    const matchesStock =
      filterStock === "all" ||
      (filterStock === "instock" && p.inStock) ||
      (filterStock === "outstock" && !p.inStock);
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Safe categories array
  const safeCategories = categories || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-secondary">
                Product Manager
              </h1>
              <p className="text-sm text-gray-500">
                Add, edit, and manage your tile inventory
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              <span>Add Product</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-xl font-bold text-secondary">
                  {products?.length || 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="text-xl font-bold text-green-600">
                  {(products || []).filter((p) => p.inStock).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-xl font-bold text-red-600">
                  {(products || []).filter((p) => !p.inStock).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Layers className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-xl font-bold text-purple-600">
                  {safeCategories.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="all">All Categories</option>
                {safeCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock Status
              </label>
              <select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="all">All Products</option>
                <option value="instock">In Stock</option>
                <option value="outstock">Out of Stock</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon size={20} className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                      {product.code || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-secondary">
                          {product.name || "Unnamed"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.sizes?.[0] || "600x600"}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.category || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-primary">
                      R{product.price?.toFixed(2) || "0.00"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          product.inStock
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {product.inStock ? "In Stock" : "Out"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Package size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No products found</p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={resetForm}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-4 md:inset-10 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-xl font-bold text-secondary">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={24} className="text-gray-600" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 h-32 bg-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={40} className="text-gray-400" />
                        )}
                      </div>
                      <div>
                        <label className="inline-flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition">
                          <Upload size={18} />
                          <span>Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-2">
                          Max 5MB (JPG, PNG)
                        </p>
                        {imagePreview && (
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(null);
                              setFormData({ ...formData, image: null });
                            }}
                            className="text-sm text-red-600 hover:text-red-700 mt-2"
                          >
                            Remove Image
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Code & Name */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Code *
                      </label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) =>
                          setFormData({ ...formData, code: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g., MSG66002M"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        placeholder="e.g., Glossy Porcelain Tile"
                        required
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                        required
                      >
                        <option value="">Select Category</option>
                        {safeCategories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowCategoryInput(!showCategoryInput)}
                        className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    {showCategoryInput && (
                      <div className="flex space-x-2 mt-2">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="New category name"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (newCategory.trim()) {
                              setFormData({
                                ...formData,
                                category: newCategory.trim(),
                              });
                              setNewCategory("");
                              setShowCategoryInput(false);
                            }
                          }}
                          className="px-4 py-2 bg-primary text-white rounded-lg"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Price & Stock */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price per m² (R) *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">
                          R
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value })
                          }
                          className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Status
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={formData.inStock}
                            onChange={() =>
                              setFormData({ ...formData, inStock: true })
                            }
                            className="text-primary"
                          />
                          <span className="text-green-600 font-medium">
                            In Stock
                          </span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="radio"
                            checked={!formData.inStock}
                            onChange={() =>
                              setFormData({ ...formData, inStock: false })
                            }
                            className="text-primary"
                          />
                          <span className="text-red-600 font-medium">
                            Out of Stock
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Tag className="inline mr-1" size={14} /> Sizes
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["600x600", "60x120", "80x80", "30x60"].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, sizes: [size] })
                          }
                          className={`px-4 py-2 border rounded-lg text-sm ${
                            formData.sizes.includes(size)
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-gray-300 hover:border-primary"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Layers className="inline mr-1" size={14} /> Available
                      Colors
                    </label>
                    <div className="space-y-2">
                      {formData.colors.map((color, index) => (
                        <div key={index} className="flex space-x-2">
                          <input
                            type="text"
                            value={color}
                            onChange={(e) =>
                              handleColorChange(index, e.target.value)
                            }
                            placeholder={`Color ${index + 1}`}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                          />
                          <button
                            type="button"
                            onClick={() => removeColor(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            disabled={formData.colors.length === 1}
                          >
                            <X size={18} />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={addColor}
                        className="text-sm text-primary hover:text-blue-700 flex items-center space-x-1"
                      >
                        <Plus size={14} />
                        <span>Add Color</span>
                      </button>
                    </div>
                  </div>

                  {/* Slip Resistant */}
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.slipResistant}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            slipResistant: e.target.checked,
                          })
                        }
                        className="text-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">
                        Slip Resistant
                      </span>
                    </label>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Product description..."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-primary text-white py-3 rounded-lg font-semibold hover:bg-blue-700 flex items-center justify-center space-x-2"
                    >
                      <Save size={18} />
                      <span>
                        {editingProduct ? "Update Product" : "Add Product"}
                      </span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductManager;
