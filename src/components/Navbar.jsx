import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, LogOut, Menu, X, Package } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count, setIsOpen } = useCart();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <nav className="fixed w-full bg-white/90 backdrop-blur-md shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/ncc_logo.png" alt="NCC Tiles Logo" className="h-12 object-contain" />
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-primary font-medium"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-gray-700 hover:text-primary font-medium"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-primary font-medium"
            >
              About Us
            </Link>
            <Link
              to="/testimonials"
              className="text-gray-700 hover:text-primary font-medium"
            >
              Testimonials
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                className="text-gray-700 hover:text-primary font-medium"
              >
                Admin
              </Link>
            )}
            {user && !isAdmin() && (
              <>
                <Link
                  to="/track-order"
                  className="text-gray-700 hover:text-primary font-medium"
                >
                  Track Orders
                </Link>
                <Link
                  to="/profile"
                  className="text-gray-700 hover:text-primary font-medium"
                >
                  My Profile
                </Link>
              </>
            )}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm font-medium text-gray-700">
                  {user.name}
                </span>
                <button
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 text-gray-700 hover:text-primary"
              >
                <User size={18} />
                <span className="text-sm">Login</span>
              </Link>
            )}

            <button className="hidden md:block bg-secondary text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition">
              Get Free Quote
            </button>

            <button
              onClick={() => setIsOpen(true)}
              className="relative p-2 text-gray-700 hover:text-primary"
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t">
            <Link
              to="/"
              className="block py-2 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/products"
              className="block py-2 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block py-2 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/testimonials"
              className="block py-2 text-gray-700"
              onClick={() => setMenuOpen(false)}
            >
              Testimonials
            </Link>
            {isAdmin() && (
              <Link
                to="/admin"
                className="block py-2 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Admin
              </Link>
            )}
            {user && !isAdmin() && (
              <>
                <Link
                  to="/track-order"
                  className="block py-2 text-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  Track Orders
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700"
                  onClick={() => setMenuOpen(false)}
                >
                  My Profile
                </Link>
              </>
            )}
            {!user ? (
              <Link
                to="/login"
                className="block py-2 text-gray-700"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 text-red-600"
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
