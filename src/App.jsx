import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import CustomerLogin from "./pages/Auth/CustomerLogin";
import CustomerRegister from "./pages/Auth/CustomerRegister";
import TrackOrder from "./pages/Customer/TrackOrder";
import AdminDashboard from "./pages/Admin/Dashboard";
import ProductManager from "./pages/Admin/ProductManager";
import Orders from "./pages/Admin/Orders";
import AdminManager from "./pages/Admin/AdminManager";
import DeliveryManager from "./pages/Admin/DeliveryManager";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import Profile from "./pages/Customer/Profile";
import Forgot from "./pages/Auth/Forgot";
import Reset from "./pages/Auth/Reset";
import About from "./pages/About";
import Testimonials from "./pages/Testimonials";
import ProtectedRoute from "./components/ProtectedRoute";
import { FaTiktok, FaWhatsapp } from "react-icons/fa";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ScrollToTop />
      <Navbar />
      <CartSidebar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/login" element={<CustomerLogin />} />
          <Route path="/register" element={<CustomerRegister />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/reset-password" element={<Reset />} />
          <Route path="/about" element={<About />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/track-order" element={
            <ProtectedRoute requireAdmin={false}>
              <TrackOrder />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requireAdmin={false}>
              <Profile />
            </ProtectedRoute>
          } />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <ProductManager />
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
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute>
                <AdminManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/delivery"
            element={
              <ProtectedRoute>
                <DeliveryManager />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-0 flex flex-col gap-4 items-end z-50 overflow-hidden pb-4 pt-4">
        <a
          href="https://www.tiktok.com/@karabo0941?is_from_webapp=1&sender_device=pc"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-black text-white pl-4 pr-6 py-3 rounded-l-full shadow-2xl hover:bg-gray-800 transition-transform duration-300 flex items-center justify-start gap-4 cursor-pointer font-semibold translate-x-[calc(100%-3.8rem)] hover:translate-x-0"
          aria-label="See more combos on TikTok"
        >
          <FaTiktok size={24} className="flex-shrink-0" />
          <span className="whitespace-nowrap">See more combos on tiktok</span>
        </a>
        <a
          href="https://wa.me/27670458628?text=Hello%20NCC%20Tiles,%20I%20would%20like%20to%20make%20an%20enquiry!"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white pl-4 pr-6 py-3 rounded-l-full shadow-2xl hover:bg-green-600 transition-transform duration-300 flex items-center justify-start gap-4 cursor-pointer font-semibold translate-x-[calc(100%-3.8rem)] hover:translate-x-0"
          aria-label="Chat to us on WhatsApp"
        >
          <FaWhatsapp size={24} className="flex-shrink-0" />
          <span className="whitespace-nowrap">Chat to us</span>
        </a>
      </div>
    </div>
  );
}

export default App;
