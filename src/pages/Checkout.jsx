import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import { useAuth } from "../context/AuthContext";
import {
  CheckCircle,
  Phone,
  Mail,
  CreditCard,
  DollarSign,
  Download,
  Send,
} from "lucide-react";
import { motion } from "framer-motion";
import { downloadOrderPDF } from "../utils/pdfGenerator";
import emailjs from "@emailjs/browser";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const { isAuth, loading } = useAuth();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCartItems, setOrderCartItems] = useState([]);
  const [isSending, setIsSending] = useState(false);

  // 🔐 Authentication Check - Redirect if not signed in
  useEffect(() => {
    if (!loading && !isAuth()) {
      navigate("/login", { state: { from: location } });
    }
  }, [isAuth, loading, navigate, location]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    deliveryNote: "",
    paymentMethod: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-ZA", {
      style: "currency",
      currency: "ZAR",
      minimumFractionDigits: 2,
    })
      .format(price)
      .replace("ZAR", "R");
  };

  const [deliveryLocations, setDeliveryLocations] = useState([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/delivery/");
        if (res.ok) {
          const data = await res.json();
          setDeliveryLocations(data);
        }
      } catch (err) {
        console.error("Failed to fetch delivery locations", err);
      }
    };
    fetchLocations();
  }, []);

  const selectedLocation = deliveryLocations.find(
    (l) => l.town === formData.city,
  );
  const deliveryFee = selectedLocation ? selectedLocation.price : 0;
  const finalTotal = total + deliveryFee;

  // 📧 Company Info
  const companyEmail = "info@ncctiles.co.za";
  const adminEmail = import.meta.env.VITE_EMAILJS_ADMIN_EMAIL || companyEmail;
  const companyPhone1 = "067 045 8628";
  const companyPhone2 = "063 993 9627";
  const companyPhone3 = "063 448 1130";
  const companyAddress = "9692 de Luba Crescent, Clayville Ext 79";



  // 🔹 Send Email via EmailJS
  const sendOrderEmail = async (orderData, cartItems) => {
    const paymentText =
      orderData.paymentMethod === "cod"
        ? "Cash on Delivery"
        : "EFT (Pay Before Delivery)";
    const instructions =
      orderData.paymentMethod === "cod"
        ? [
            "Cash on Delivery - Pay when you receive your order",
            "We accept cash or EFT on delivery",
            "Driver will provide receipt upon payment",
          ]
        : [
            "EFT Payment Required Before Delivery",
            "Banking details will be provided via email",
            "Delivery will be scheduled after payment confirmation",
          ];

    // Fix image URLs & log for debugging
    const emailItems = cartItems.map((item) => {
      let img = "https://via.placeholder.com/60/1e40af/ffffff?text=NCC";
      if (item.image) {
        img = item.image.startsWith("http")
          ? item.image
          : `${window.location.origin}${item.image}`;
      }
      console.log("📦 Image URL:", item.name, "→", img);
      return {
        image: img,
        code: item.code || "N/A",
        name: item.name || "Unknown",
        size: item.size || item.sizes?.[0] || "600x600",
        quantity: `${item.quantity || 1} m²`,
        price: formatPrice(item.price || 0),
        total: formatPrice((item.price || 0) * (item.quantity || 1)),
      };
    });

    const params = {
      order_number: orderData.orderNumber,
      order_date: orderData.orderDate,
      payment_method: paymentText,
      order_total: formatPrice(orderData.subtotal + orderData.delivery_fee),
      delivery_fee: formatPrice(orderData.delivery_fee),
      customer_name: orderData.customerName,
      customer_phone: orderData.phone,
      customer_email: orderData.email,
      customer_address: orderData.address,
      customer_town: `${orderData.city}, ${orderData.postalCode}`,
      items: emailItems,
      payment_instruction_1: instructions[0],
      payment_instruction_2: instructions[1],
      payment_instruction_3: instructions[2],
      company_address: companyAddress,
      company_phone: `${companyPhone1} | ${companyPhone2}`,
      to_email: adminEmail,
      to_name: "NCC Tiles Admin",
      from_name: orderData.customerName,
      reply_to: orderData.email,
    };

    try {
      const res = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        params,
        import.meta.env.VITE_EMAILJS_USER_ID,
      );
      console.log("✅ Email sent:", res);
      return { success: true };
    } catch (err) {
      console.error("❌ EmailJS Error:", err);
      return { success: false };
    }
  };

  const clearOrderAndCart = () => {
    clearCart();
    setOrderCartItems([]);
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setIsSending(true);
    const orderNumber = `NCC-${Date.now().toString().slice(-8)}`;
    const customerName = `${formData.firstName} ${formData.lastName}`;

    const orderDataToSubmit = {
      orderNumber: orderNumber,
      customerName: customerName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      deliveryNote: formData.deliveryNote,
      paymentMethod: "eft",
      delivery_fee: deliveryFee,
      status: "Pending Payment",
      items: cart.map(i => ({ product_id: i.id, quantity: i.quantity, price: i.price }))
    };

    try {
      const response = await fetch("http://localhost:8000/api/orders/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("ncc_token")}`,
          },
          body: JSON.stringify(orderDataToSubmit),
      });

      if (response.ok) {
        const orderSummary = {
          orderNumber,
          orderDate: new Date().toLocaleDateString(),
          paymentMethod: "eft",
          customerName,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          subtotal: total,
          delivery_fee: deliveryFee,
        };
        
        await sendOrderEmail(orderSummary, cart);
        
        window.orderDataForSuccessPage = orderSummary;
        setOrderComplete(true);
        setOrderCartItems([...cart]);
      } else {
        alert("❌ Failed to create order. Please try again.");
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("❌ Order submission failed. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  // 📦 Empty Cart
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

  // ✅ Success Page
  if (orderComplete && window.orderDataForSuccessPage) {
    const od = window.orderDataForSuccessPage;
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full"
        >
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 mb-6 text-center">
            <p className="font-bold text-green-800 text-lg">
              ✅ Order Submitted!
            </p>
            <p className="text-green-700 mt-1">
              Ref: <span className="font-mono font-bold">{od.orderNumber}</span>
            </p>
          </div>
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-secondary mb-2 text-center">
            Download Your Receipt
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Admin notified via email. Download your PDF below.
          </p>

          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
            <h3 className="font-bold text-blue-800 mb-4">📋 Next Steps:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-800">
                    Download Receipt
                  </p>
                  <p className="text-sm text-blue-700">{od.orderNumber}.pdf</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-800">
                    Wait for Contact
                  </p>
                  <p className="text-sm text-blue-700">
                    Admin will call/email within 24h with delivery charges
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <button
              onClick={() =>
                downloadOrderPDF({
                  orderNumber: od.orderNumber,
                  created_at: new Date(od.orderDate).toISOString(),
                  paymentMethod: od.paymentMethod,
                  customerName: od.customerName,
                  phone: od.phone,
                  email: od.email,
                  address: od.address,
                  city: od.city,
                  postalCode: od.postalCode,
                  total_amount: od.subtotal + (od.delivery_fee || 0),
                  delivery_fee: od.delivery_fee,
                  items: orderCartItems
                })
              }
              className="block w-full bg-primary text-white py-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 font-semibold shadow-lg"
            >
              <Download size={20} />
              <span>Download Receipt</span>
            </button>
            <a
              href={`mailto:${companyEmail}?subject=Order Inquiry - ${od.orderNumber}`}
              className="block w-full bg-blue-100 text-blue-700 py-4 rounded-lg hover:bg-blue-200 flex items-center justify-center space-x-2 font-semibold"
            >
              <Mail size={20} />
              <span>Email Admin</span>
            </a>
            <a
              href={`tel:${companyPhone1.replace(/\s/g, "")}`}
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2 font-medium"
            >
              <Phone size={18} />
              <span>Call: {companyPhone1}</span>
            </a>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600">
              Reference:{" "}
              <span className="font-mono font-bold text-primary">
                {od.orderNumber}
              </span>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Total: {formatPrice(od.subtotal + (od.delivery_fee || 0))}{" "}
              (Includes Delivery)
            </p>
            <p className="text-sm text-gray-600">
              Payment: {od.paymentMethod === "cod" ? "Cash on Delivery" : "EFT"}
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
            <p className="font-semibold text-secondary mb-2">📧 Need Help?</p>
            <p className="text-gray-600">{companyAddress}</p>
            <p className="text-gray-600 flex items-center gap-2">
              <Mail size={14} /> {companyEmail}
            </p>
            <p className="text-gray-600">{companyPhone1}</p>
          </div>

          <button
            onClick={clearOrderAndCart}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  // Show loading state during authentication check
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // 📝 Checkout Form
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <div
            className={`flex items-center ${step >= 1 ? "text-primary" : "text-gray-400"}`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? "bg-primary text-white" : "bg-gray-200"}`}
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
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? "bg-primary text-white" : "bg-gray-200"}`}
            >
              2
            </div>
            <span className="ml-2 font-medium">Payment</span>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg p-6 max-w-3xl mx-auto"
        >
          {step === 1 ? (
            <>
              <h2 className="text-xl font-bold text-secondary mb-6">
                Delivery Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder="First Name *"
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name *"
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone *"
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email *"
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Street Address *"
                className="w-full px-4 py-3 border rounded-lg mt-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none bg-white"
                >
                  <option value="">Select Town/City *</option>
                  {deliveryLocations.map((l) => (
                    <option key={l.id} value={l.town}>
                      {l.town} (R{l.price})
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                  placeholder="Postal Code *"
                  className="px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>
              <textarea
                name="deliveryNote"
                value={formData.deliveryNote}
                onChange={handleChange}
                placeholder="Delivery Notes (Optional)"
                rows="3"
                className="w-full px-4 py-3 border rounded-lg mt-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
              <button
                type="submit"
                className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
              >
                Continue to Payment →
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-secondary mb-6">
                Bank Transfer (EFT)
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex items-start space-x-3 mb-4">
                  <CreditCard
                    className="text-blue-600 flex-shrink-0 mt-1"
                    size={24}
                  />
                  <div>
                    <p className="font-semibold text-blue-800 mb-2">
                      🏦 Direct Bank Transfer
                    </p>
                    <p className="text-sm text-blue-700 mb-3">
                      Please make your payment directly into our bank account. Your order will not be shipped until the funds have cleared in our account.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-blue-100 mb-3">
                      <p className="text-sm text-gray-800"><strong>Bank:</strong> FNB (First National Bank)</p>
                      <p className="text-sm text-gray-800"><strong>Account Name:</strong> Naeve Construction Company</p>
                      <p className="text-sm text-gray-800"><strong>Account Number:</strong> 628XXXXXXXX</p>
                      <p className="text-sm text-gray-800"><strong>Branch Code:</strong> 250655</p>
                    </div>
                    <p className="text-sm text-blue-800 font-semibold">
                      Important: Use your Order Number as the payment reference.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Order Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-semibold">{formatPrice(total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee:</span>
                    <span className="font-semibold">
                      {formatPrice(deliveryFee)}
                    </span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-semibold text-gray-800">
                      Total Amount:
                    </span>
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  disabled={isSending}
                  className="flex-1 border border-gray-300 py-4 rounded-xl hover:bg-gray-50 transition"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex-1 bg-accent text-white py-4 rounded-xl disabled:opacity-50 flex items-center justify-center space-x-2 hover:bg-blue-700 transition"
                >
                  {isSending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Place Order & Notify Admin</span>
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default Checkout;
