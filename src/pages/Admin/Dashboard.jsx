import { useProducts } from "../../context/ProductContext";
import { useOrders } from "../../context/OrdersContext";
import { useAuth } from "../../context/AuthContext";
import {
  Package,
  ToggleLeft,
  ToggleRight,
  Search,
  Plus,
  Edit,
  FileText,
  TrendingUp,
  ShoppingCart,
  CheckCircle,
  Clock,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const { products, toggleStock } = useProducts();
  const { orders, pendingOrders, completedOrders } = useOrders();
  const { logout } = useAuth();
  const [search, setSearch] = useState("");

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.code.toLowerCase().includes(search.toLowerCase()),
  );

  // Recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-secondary">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">Welcome back, Admin</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/orders"
              className="flex items-center space-x-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FileText size={18} />
              <span>View Orders</span>
            </Link>
            <Link
              to="/admin/delivery"
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              <MapPin size={18} />
              <span>Delivery Rates</span>
            </Link>
            <Link
              to="/admin/products"
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              <span>Manage Products</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overall Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Products</p>
                <p className="text-3xl font-bold text-secondary">
                  {products.length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package size={24} className="text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                <p className="text-3xl font-bold text-secondary">
                  {orders.length}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart size={24} className="text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {pendingOrders}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Clock size={24} className="text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed Orders</p>
                <p className="text-3xl font-bold text-green-600">
                  {completedOrders}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle size={24} className="text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">In Stock</p>
                <p className="text-xl font-bold text-green-600">
                  {products.filter((p) => p.inStock).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Out of Stock</p>
                <p className="text-xl font-bold text-red-600">
                  {products.filter((p) => !p.inStock).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="text-purple-600" size={20} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-xl font-bold text-purple-600">
                  {[...new Set(products.map((p) => p.category))].length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Quick Stock Toggle Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-secondary flex items-center">
                <Package className="mr-2" size={18} />
                Quick Stock Management
              </h2>
              <Link
                to="/admin/products"
                className="text-sm text-primary hover:underline flex items-center"
              >
                View All <TrendingUp size={14} className="ml-1" />
              </Link>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none text-sm"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filtered.slice(0, 10).map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-mono text-gray-600">
                        {product.code}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-2">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-8 h-8 object-cover rounded"
                            />
                          ) : (
                            <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                              <Package size={16} className="text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-secondary text-sm">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-semibold text-primary">
                        R{product.price}
                      </td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleStock(product.id)}
                          className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium transition ${
                            product.inStock
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {product.inStock ? (
                            <ToggleRight size={14} />
                          ) : (
                            <ToggleLeft size={14} />
                          )}
                          <span>
                            {product.inStock ? "Mark Out" : "Mark In"}
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package size={40} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No products found</p>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="font-bold text-secondary flex items-center">
                <FileText className="mr-2" size={18} />
                Recent Orders
              </h2>
              <Link
                to="/admin/orders"
                className="text-sm text-primary hover:underline flex items-center"
              >
                View All <TrendingUp size={14} className="ml-1" />
              </Link>
            </div>

            <div className="divide-y">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div key={order.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-mono font-semibold text-primary text-sm">
                          {order.orderNumber}
                        </p>
                        <p className="text-sm text-secondary">
                          {order.customerName || "Deleted User"}
                        </p>
                        <p className="text-xs text-gray-500">{order.phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          R{order.subtotal?.toFixed(2)}
                        </p>
                        <span
                          className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-700"
                                : order.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>{order.city}</span>
                      <span>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FileText size={40} className="mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-secondary mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Link
              to="/admin/products"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-primary hover:text-white transition group"
            >
              <Plus
                size={24}
                className="mb-2 text-primary group-hover:text-white"
              />
              <span className="text-sm font-medium">Add Product</span>
            </Link>
            <Link
              to="/admin/orders"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-accent hover:text-white transition group"
            >
              <FileText
                size={24}
                className="mb-2 text-accent group-hover:text-white"
              />
              <span className="text-sm font-medium">View Orders</span>
            </Link>
            <Link
              to="/admin/delivery"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-purple-600 hover:text-white transition group"
            >
              <MapPin
                size={24}
                className="mb-2 text-purple-600 group-hover:text-white"
              />
              <span className="text-sm font-medium">Delivery Rates</span>
            </Link>
            <Link
              to="/products"
              target="_blank"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-green-600 hover:text-white transition group"
            >
              <ShoppingCart
                size={24}
                className="mb-2 text-green-600 group-hover:text-white"
              />
              <span className="text-sm font-medium">View Store</span>
            </Link>
            <a
              href="tel:0670458628"
              className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded-lg hover:bg-blue-600 hover:text-white transition group"
            >
              <CheckCircle
                size={24}
                className="mb-2 text-blue-600 group-hover:text-white"
              />
              <span className="text-sm font-medium">Call Support</span>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="font-bold text-secondary mb-4">
            NCC Tiles Supplier - Contact Info
          </h2>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start space-x-3">
              <Package className="text-primary mt-0.5" size={18} />
              <div>
                <p className="font-medium text-gray-700">Address</p>
                <p className="text-gray-600">
                  9692 de Luba Crescent, Clayville Ext 79
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-accent" size={18} />
                <p className="text-gray-600">067 045 8628</p>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-accent" size={18} />
                <p className="text-gray-600">063 993 9627</p>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="text-accent" size={18} />
                <p className="text-gray-600">063 448 1130</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
