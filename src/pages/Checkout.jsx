import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  CreditCard,
  Truck,
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    deliveryNote: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      setProcessing(true);
      setTimeout(() => {
        setOrderComplete(true);
        clearCart();
        setProcessing(false);
      }, 3000);
    }
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">
            Your cart is empty
          </h2>
          <button
            onClick={() => navigate("/products")}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We will contact you within 24 hours to
            confirm delivery.
          </p>
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">Order Reference</p>
            <p className="text-lg font-mono font-bold text-primary">
              NCC-{Date.now().toString().slice(-8)}
            </p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 1 ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              1
            </div>
            <span className="ml-2 font-medium">Details</span>
          </div>
          <div
            className={`w-16 h-1 mx-4 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}
          ></div>
          <div
            className={`flex items-center ${step >= 2 ? "text-primary" : "text-gray-400"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                step >= 2 ? "bg-primary text-white" : "bg-gray-200"
              }`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              {step === 1 ? (
                <>
                  <h2 className="text-xl font-bold text-secondary mb-6 flex items-center">
                    <User className="mr-2" size={20} /> Delivery Information
                  </h2>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="inline mr-1" size={14} /> Phone *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="inline mr-1" size={14} /> Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline mr-1" size={14} /> Street
                      Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Province *
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      >
                        <option value="">Select</option>
                        <option value="Gauteng">Gauteng</option>
                        <option value="Western Cape">Western Cape</option>
                        <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                        <option value="Eastern Cape">Eastern Cape</option>
                        <option value="Limpopo">Limpopo</option>
                        <option value="Mpumalanga">Mpumalanga</option>
                        <option value="North West">North West</option>
                        <option value="Free State">Free State</option>
                        <option value="Northern Cape">Northern Cape</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delivery Notes (Optional)
                    </label>
                    <textarea
                      name="deliveryNote"
                      value={formData.deliveryNote}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                      placeholder="Gate code, delivery instructions, etc."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
                  >
                    Continue to Payment →
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-secondary mb-6 flex items-center">
                    <CreditCard className="mr-2" size={20} /> Payment Method
                  </h2>

                  <div className="space-y-4">
                    <div className="border-2 border-primary bg-blue-50 p-4 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                          <span className="font-medium">Cash on Delivery</span>
                        </div>
                        <span className="text-green-600 font-medium">Free</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2 ml-8">
                        Pay when your order is delivered. We accept cash or EFT.
                      </p>
                    </div>

                    <div className="border p-4 rounded-xl opacity-60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          <span className="font-medium">Credit/Debit Card</span>
                        </div>
                        <span className="text-gray-400">Coming Soon</span>
                      </div>
                    </div>

                    <div className="border p-4 rounded-xl opacity-60">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                          <span className="font-medium">EFT Bank Transfer</span>
                        </div>
                        <span className="text-gray-400">Coming Soon</span>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="mt-6 bg-gray-50 p-4 rounded-xl">
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-2 text-sm">
                      {cart.map((item) => (
                        <div key={item.key} className="flex justify-between">
                          <span className="text-gray-600">
                            {item.name} x {item.quantity} ({item.size})
                          </span>
                          <span className="font-medium">
                            R{(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-primary">
                          R{total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex-1 border border-gray-300 py-4 rounded-xl font-semibold hover:bg-gray-50"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      disabled={processing}
                      className="flex-1 bg-accent text-white py-4 rounded-xl font-semibold hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center"
                    >
                      {processing ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Truck className="mr-2" size={18} />
                          Place Order - R{total.toFixed(2)}
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-secondary mb-4">Order Summary</h3>

              <div className="space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.key} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-gray-400">
                          {item.quantity}x
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-secondary line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {item.size} | {item.color}
                      </p>
                      <p className="text-sm font-bold text-primary">
                        R{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>R{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery</span>
                  <span className="text-green-600">Calculated</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">R{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-sm mb-3">Need Help?</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p className="flex items-center space-x-2">
                    <Phone size={14} />
                    <span>067 045 8628</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Phone size={14} />
                    <span>063 993 9627</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <Mail size={14} />
                    <span>info@ncctiles.co.za</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
