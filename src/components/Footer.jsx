import { Phone, Mail, MapPin, Globe, Link as LinkIcon } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">NCC Tiles Supplier</h3>
            <p className="text-gray-400">
              Naeve Construction Company - Your trusted partner for premium
              quality tiles and construction materials across South Africa.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4 mt-4">
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition text-sm"
              >
                📘 Facebook
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition text-sm"
              >
                📸 Instagram
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-accent transition text-sm"
              >
                🐦 Twitter
              </a>
            </div>
          </div>

          {/* Contact Info - From PDF Document */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 text-accent flex-shrink-0" />
                <span>
                  9692 de Luba Crescent,
                  <br />
                  Clayville Ext 79
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span>067 045 8628</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span>063 993 9627</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="text-accent flex-shrink-0" />
                <span>063 448 1130</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="text-accent flex-shrink-0" />
                <span>info@ncctiles.co.za</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="/products"
                  className="hover:text-accent transition flex items-center space-x-2"
                >
                  <LinkIcon size={14} />
                  <span>All Products</span>
                </a>
              </li>
              <li>
                <a
                  href="/login"
                  className="hover:text-accent transition flex items-center space-x-2"
                >
                  <Globe size={14} />
                  <span>Admin Portal</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:0670458628"
                  className="hover:text-accent transition flex items-center space-x-2"
                >
                  <Phone size={14} />
                  <span>Call Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} NCC Tiles Supplier. All rights
            reserved.
          </p>
          <p className="mt-1 text-xs opacity-75">Proudly South African 🇿🇦</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
