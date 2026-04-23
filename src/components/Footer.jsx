import {
  Phone,
  Mail,
  MapPin,
  Globe,
  Link as LinkIcon,
  ChevronRight,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaTiktok } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState } from "react";
import API_BASE_URL from "../config/api";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [message, setMessage] = useState("");

  const handleSubscribe = async () => {
    if (!email) {
      setStatus("error");
      setMessage("Please enter an email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch(`${API_BASE_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.detail || "Subscription failed. Please try again.");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  };
  return (
    <footer className="bg-[#0f172a] text-white pt-20 pb-10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-primary to-blue-400"></div>
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* Subscribe Section */}
        <div className="relative rounded-3xl mb-20 p-[1px] bg-gradient-to-r from-blue-600/50 to-purple-600/50 shadow-2xl">
          <div className="bg-[#1e293b] rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left max-w-2xl">
              <h3 className="text-3xl font-bold mb-3 text-white tracking-tight">
                Stay Inspired & Updated
              </h3>
              <p className="text-blue-200 text-lg font-light">
                Join our newsletter for the latest tile designs, installation
                advice, and exclusive promotional offers.
              </p>
            </div>
            <div className="w-full lg:w-auto flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#0f172a] text-white border border-gray-700 w-full sm:w-80 placeholder-gray-500 transition-all"
                />
                <button
                  onClick={handleSubscribe}
                  disabled={status === "loading"}
                  className={`bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-8 py-4 rounded-xl hover:from-blue-500 hover:to-blue-400 transition-all shadow-lg hover:shadow-blue-500/25 whitespace-nowrap ${status === "loading" ? "opacity-75 cursor-not-allowed" : ""}`}
                >
                  {status === "loading" ? "Subscribing..." : "Subscribe"}
                </button>
              </div>
              {message && (
                <p
                  className={`text-sm mt-1 ml-2 ${status === "success" ? "text-green-400" : "text-red-400"}`}
                >
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3
              style={{ fontFamily: "cursive" }}
              className="text-4xl font-bold text-white italic tracking-tight mb-6"
            >
              ncc Tiles
            </h3>
            <p className="text-gray-400 leading-relaxed mb-8 font-light">
              Your trusted partner for premium quality tiles, outstanding
              service, and innovative design solutions across South Africa.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="#"
                className="bg-[#1e293b] p-3 rounded-full text-gray-400 hover:text-white hover:bg-blue-600 transition-all shadow-lg hover:-translate-y-1"
                aria-label="Facebook"
              >
                <FaFacebook size={20} />
              </a>
              <a
                href="#"
                className="bg-[#1e293b] p-3 rounded-full text-gray-400 hover:text-white hover:bg-pink-600 transition-all shadow-lg hover:-translate-y-1"
                aria-label="Instagram"
              >
                <FaInstagram size={20} />
              </a>
              <a
                href="https://www.tiktok.com/@karabo0941?is_from_webapp=1&sender_device=pc"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#1e293b] p-3 rounded-full text-gray-400 hover:text-white hover:bg-black transition-all shadow-lg hover:-translate-y-1"
                aria-label="TikTok"
              >
                <FaTiktok size={20} />
              </a>
              <a
                href="#"
                className="bg-[#1e293b] p-3 rounded-full text-gray-400 hover:text-white hover:bg-blue-400 transition-all shadow-lg hover:-translate-y-1"
                aria-label="Twitter"
              >
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-2">
            <h4 className="text-lg font-semibold mb-6 text-white tracking-wide uppercase text-sm">
              Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <ul className="space-y-4 text-gray-400 font-light">
                <li className="flex items-start space-x-3 group">
                  <div className="mt-1 bg-[#1e293b] p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <MapPin size={18} className="text-blue-400" />
                  </div>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=9692+de+Luba+Crescent,+Clayville+Ext+79"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="leading-relaxed hover:text-white transition-colors"
                  >
                    9692 de Luba Crescent,
                    <br />
                    Clayville Ext 79
                  </a>
                </li>
                <li className="flex items-center space-x-3 group">
                  <div className="bg-[#1e293b] p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <Mail size={18} className="text-blue-400" />
                  </div>
                  <a
                    href="mailto:info@ncctiles.co.za"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    info@ncctiles.co.za
                  </a>
                </li>
              </ul>
              <ul className="space-y-4 text-gray-400 font-light">
                <li className="flex items-center space-x-3 group">
                  <div className="bg-[#1e293b] p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <Phone size={18} className="text-blue-400" />
                  </div>
                  <a
                    href="tel:0670458628"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    067 045 8628
                  </a>
                </li>
                <li className="flex items-center space-x-3 group">
                  <div className="bg-[#1e293b] p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <Phone size={18} className="text-blue-400" />
                  </div>
                  <a
                    href="tel:0639939627"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    063 993 9627
                  </a>
                </li>
                <li className="flex items-center space-x-3 group">
                  <div className="bg-[#1e293b] p-2 rounded-lg group-hover:bg-blue-600/20 transition-colors">
                    <Phone size={18} className="text-blue-400" />
                  </div>
                  <a
                    href="tel:0634481130"
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    063 448 1130
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 text-white tracking-wide uppercase text-sm">
              Quick Links
            </h4>
            <ul className="space-y-3 text-gray-400 font-light">
              <li>
                <Link
                  to="/products"
                  className="group flex items-center space-x-2 hover:text-white transition-colors"
                >
                  <ChevronRight
                    size={14}
                    className="text-blue-500 group-hover:translate-x-1 transition-transform"
                  />
                  <span>All Products</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="group flex items-center space-x-2 hover:text-white transition-colors"
                >
                  <ChevronRight
                    size={14}
                    className="text-blue-500 group-hover:translate-x-1 transition-transform"
                  />
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/testimonials"
                  className="group flex items-center space-x-2 hover:text-white transition-colors"
                >
                  <ChevronRight
                    size={14}
                    className="text-blue-500 group-hover:translate-x-1 transition-transform"
                  />
                  <span>Testimonials</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="group flex items-center space-x-2 hover:text-white transition-colors"
                >
                  <ChevronRight
                    size={14}
                    className="text-blue-500 group-hover:translate-x-1 transition-transform"
                  />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800/60 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm font-light">
          <p>
            &copy; {new Date().getFullYear()} NCC Tiles Supplier. All rights
            reserved.
          </p>
          <div className="flex items-center space-x-2 bg-[#1e293b] px-4 py-2 rounded-full border border-gray-800">
            <span>Proudly South African</span>
            <span className="text-lg">🇿🇦</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
