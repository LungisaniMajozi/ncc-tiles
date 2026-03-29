import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import AdminLogin from "./pages/Auth/Login";
import AdminDashboard from "./pages/Admin/Dashboard";
import Orders from "./pages/Admin/Orders";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <CartSidebar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
