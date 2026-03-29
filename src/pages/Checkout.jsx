import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import {
  CheckCircle,
  Phone,
  Mail,
  MapPin,
  User,
  CreditCard,
  DollarSign,
  Package,
  Download,
  MessageCircle,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderData, setOrderData] = useState(null);

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

  // 🇿🇦 Gauteng Towns - Alphabetically Sorted
  const gautengTowns = [
    "Alberton",
    "Arcadia",
    "Atteridgeville",
    "Auckland Park",
    "Benoni",
    "Berea",
    "Blairgowrie",
    "Boksburg",
    "Braamfontein",
    "Brakpan",
    "Bronkhorstspruit",
    "Brooklyn",
    "Bryanston",
    "Carletonville",
    "Centurion",
    "Clayville",
    "Clubview",
    "Constantia Park",
    "Coronationville",
    "Craighall",
    "Craighall Park",
    "Cullinan",
    "De Deur",
    "Doringkloof",
    "Edenvale",
    "Eldorado Park",
    "Eldoraigne",
    "Ennerdale",
    "Faerie Glen",
    "Ferndale",
    "Fordsburg",
    "Fourways",
    "Ga-Rankuwa",
    "Garsfontein",
    "Germiston",
    "Greenside",
    "Hammanskraal",
    "Hatfield",
    "Heidelberg",
    "Hillbrow",
    "Houghton",
    "Irene",
    "Johannesburg",
    "Joubert Park",
    "Kempton Park",
    "Killarney",
    "Krugersdorp",
    "Lenasia",
    "Lone Hill",
    "Lyttelton",
    "Lynnwood",
    "Mabopane",
    "Mamelodi",
    "Mayfair",
    "Menlyn",
    "Menlo Park",
    "Midrand",
    "Midvaal",
    "Melville",
    "Meyerton",
    "Moreleta Park",
    "Newclare",
    "Newlands",
    "Newtown",
    "Nigel",
    "Norwood",
    "Orange Farm",
    "Parkhurst",
    "Parktown",
    "Paulshof",
    "Pretoria",
    "Pretoria Central",
    "Pretoria East",
    "Pretoria North",
    "Pretoria West",
    "Proclamation Hill",
    "Randburg",
    "Randfontein",
    "Rivonia",
    "Riverlea",
    "Roodepoort",
    "Rosebank",
    "Sandton",
    "Silver Lakes",
    "Sophiatown",
    "Soshanguve",
    "Soweto",
    "Springs",
    "Sunnyside",
    "Temba",
    "The Reeds",
    "Vanderbijlpark",
    "Vereeniging",
    "Waterkloof",
    "Westbury",
    "Westcliff",
    "Westonaria",
    "Woodmead",
    "Yeoville",
    "Zwartkop",
  ].sort();

  // 📞 Company Info (from PDF document)
  const adminWhatsApp = "27670458628";
  const companyPhone1 = "067 045 8628";
  const companyPhone2 = "063 993 9627";
  const companyPhone3 = "063 448 1130";
  const companyAddress = "9692 de Luba Crescent, Clayville Ext 79";
  const companyEmail = "info@ncctiles.co.za";

  // Generate PDF Receipt with Product Images - FIXED VERSION
  const generatePDF = (orderData, cartItems) => {
    const doc = new jsPDF();

    // Header - NCC Blue background
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("NCC TILES SUPPLIER", 105, 18, { align: "center" });
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Naeve Construction Company", 105, 26, { align: "center" });

    // Company Info (from PDF)
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.text(companyAddress, 105, 34, { align: "center" });
    doc.text(
      `Tel: ${companyPhone1} | ${companyPhone2} | ${companyPhone3}`,
      105,
      39,
      { align: "center" },
    );

    // Order Title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text("ORDER RECEIPT", 14, 55);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Order Reference: ${orderData.orderNumber}`, 14, 63);
    doc.text(`Date: ${orderData.date}`, 14, 69);

    const paymentText =
      orderData.paymentMethod === "cod"
        ? "Payment Method: Cash on Delivery"
        : "Payment Method: EFT (Pay Before Delivery)";
    doc.text(paymentText, 14, 75);

    // Customer Details Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(249, 250, 251);
    doc.rect(14, 80, 182, 35, "FD");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 18, 88);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${orderData.customerName}`, 18, 96);
    doc.text(`Phone: ${orderData.phone}`, 18, 102);
    doc.text(`Email: ${orderData.email}`, 18, 108);
    doc.text(`Address: ${orderData.address}`, 18, 114);
    doc.text(`Town: ${orderData.city}, ${orderData.postalCode}`, 18, 120);

    // Order Items Section
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER ITEMS", 14, 135);

    // Start position for items
    let yPos = 145;

    // Process each cart item
    for (const item of cartItems) {
      // Safety check - skip if item is invalid
      if (!item || !item.name) continue;

      // Product image (with better error handling)
      if (item.image) {
        try {
          // Add image with error handling
          doc.addImage(item.image, "JPEG", 14, yPos - 3, 18, 18);
        } catch (e) {
          // Fallback: draw placeholder box
          doc.setFillColor(240, 240, 240);
          doc.rect(14, yPos - 3, 18, 18, "F");
          doc.setFontSize(8);
          doc.setTextColor(150, 150, 150);
          doc.text("IMG", 23, yPos + 7, { align: "center" });
          doc.setTextColor(0, 0, 0);
        }
      } else {
        // No image: draw placeholder
        doc.setFillColor(240, 240, 240);
        doc.rect(14, yPos - 3, 18, 18, "F");
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("No Image", 23, yPos + 7, { align: "center" });
        doc.setTextColor(0, 0, 0);
      }

      // Product details (with safe property access)
      const productName = item.name || "Unknown Product";
      const productCode = item.code || "N/A";
      const productSize = item.size || item.sizes?.[0] || "600x600";
      const productColor = item.color || item.colors?.[0] || "N/A";
      const productQty = item.quantity || 1;
      const productPrice = item.price || 0;

      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(`${productName}`, 40, yPos);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text(`Code: ${productCode}`, 40, yPos + 4);
      doc.text(`Size: ${productSize} | Color: ${productColor}`, 40, yPos + 8);
      doc.text(`Qty: ${productQty} m²`, 40, yPos + 12);

      // Price (right aligned)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.text(`${formatPrice(productPrice)}/m²`, 145, yPos);
      doc.setTextColor(30, 64, 175);
      doc.text(`${formatPrice(productPrice * productQty)}`, 185, yPos, {
        align: "right",
      });
      doc.setTextColor(0, 0, 0);

      // Move to next item position
      yPos += 28;

      // Add new page if needed
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
        // Re-add header on new page
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("ORDER ITEMS (continued)", 14, yPos);
        yPos += 10;
      }
    }

    // Totals Section
    if (yPos > 240) {
      doc.addPage();
      yPos = 30;
    }

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: ${formatPrice(orderData.subtotal)}`, 140, yPos);
    doc.text(`Delivery: To be calculated (Manual)`, 140, yPos + 6);

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(
      `Total: ${formatPrice(orderData.subtotal)} (+ delivery)`,
      140,
      yPos + 14,
    );

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.setFont("helvetica", "normal");
    doc.text("Thank you for choosing NCC Tiles Supplier!", 105, 280, {
      align: "center",
    });

    return doc;
  };

  // Download PDF Receipt - with debug logging
  const downloadPDF = () => {
    if (!orderData) {
      console.error("No order data available");
      return;
    }

    // Get current cart items
    const cartItems = cart || [];

    if (cartItems.length === 0) {
      console.error("Cart is empty - cannot generate PDF");
      alert("⚠️ No items in cart to generate receipt");
      return;
    }

    console.log("Generating PDF with items:", cartItems);

    try {
      const pdf = generatePDF(orderData, cartItems);
      pdf.save(`NCC-Order-${orderData.orderNumber}.pdf`);
      console.log("PDF downloaded successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("❌ Error generating PDF. Please try again or contact support.");
    }
  };

  // Send to WhatsApp - Opens in NEW TAB + Shows success page immediately
  const sendToWhatsApp = () => {
    if (!orderData) return;

    const paymentText =
      orderData.paymentMethod === "cod"
        ? "💵 Cash on Delivery"
        : "🏦 EFT (Pay Before Delivery)";

    // SHORT WhatsApp message (only reference + basic info)
    const message = `🏗️ NEW ORDER - NCC TILES

📋 Ref: ${orderData.orderNumber}
👤 Customer: ${orderData.customerName}
📞 Phone: ${orderData.phone}
📍 Town: ${orderData.city}
💰 Total: ${formatPrice(orderData.subtotal)} (+ delivery)
💳 Payment: ${paymentText}

📄 Receipt available for download

⚠️ Action: Calculate delivery & contact customer`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;

    // ✅ Show alert BEFORE opening WhatsApp (prevents confusion)
    alert(
      "📱 WhatsApp will open in a NEW TAB.\n\n✅ After sending the message, SWITCH BACK to this tab to download your receipt.",
    );

    // ✅ Open WhatsApp in NEW TAB (doesn't navigate away from your site)
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // ✅ Save order to admin system
    addOrder({
      ...orderData,
      items: cart,
      status: "pending",
    });

    // ✅ Show success page IMMEDIATELY (no delay)
    setOrderComplete(true);
    clearCart();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (step === 1) {
      setStep(2);
    } else {
      if (!formData.paymentMethod) {
        alert("⚠️ Please select a payment method");
        return;
      }

      // Create order data
      const newOrderData = {
        orderNumber: `NCC-${Date.now().toString().slice(-8)}`,
        date: new Date().toLocaleDateString("en-ZA", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        customerName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        deliveryNote: formData.deliveryNote,
        paymentMethod: formData.paymentMethod,
        subtotal: total,
        status: "pending",
      };

      setOrderData(newOrderData);
      sendToWhatsApp(); // Opens WhatsApp + shows success page
    }
  };

  // Empty cart state
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

  // Success page after WhatsApp sent
  if (orderComplete && orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full"
        >
          {/* ⚠️ BIG NOTICE AT TOP */}
          <div className="bg-amber-100 border-2 border-amber-400 rounded-xl p-4 mb-6 text-center">
            <p className="font-bold text-amber-800 text-lg">
              🔄 WhatsApp Opened in Another Tab
            </p>
            <p className="text-amber-700 mt-1">
              After sending your message on WhatsApp,{" "}
              <span className="font-semibold">switch back to this tab</span> to
              download your receipt.
            </p>
          </div>

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-secondary mb-2 text-center">
            Order Submitted!
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Reference:{" "}
            <span className="font-mono font-bold">{orderData.orderNumber}</span>
          </p>

          {/* Steps */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
            <h3 className="font-bold text-blue-800 mb-4">✅ What Happened:</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-800">WhatsApp Opened</p>
                  <p className="text-sm text-blue-700">
                    Message sent to admin: {companyPhone1}
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-800">
                    Download Receipt
                  </p>
                  <p className="text-sm text-blue-700">
                    Click button below to get your PDF receipt
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={downloadPDF}
              className="block w-full bg-primary text-white py-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 font-semibold shadow-lg"
            >
              <Download size={20} />
              <span>Download Receipt (PDF)</span>
            </button>

            {/* Helper text */}
            <p className="text-center text-xs text-gray-500">
              💡 Still on WhatsApp? Click your browser's back button or switch
              tabs to return here.
            </p>

            <a
              href={`https://wa.me/${adminWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 font-semibold"
            >
              <MessageCircle size={20} />
              <span>Open WhatsApp Again</span>
            </a>

            <a
              href={`tel:${companyPhone1.replace(/\s/g, "")}`}
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2 font-medium"
            >
              <Phone size={18} />
              <span>Call Us: {companyPhone1}</span>
            </a>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-1">Order Reference</p>
            <p className="text-xl font-mono font-bold text-primary">
              {orderData.orderNumber}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Total: {formatPrice(orderData.subtotal)} (+ delivery)
            </p>
            <p className="text-sm text-gray-600">
              Payment:{" "}
              {orderData.paymentMethod === "cod" ? "Cash on Delivery" : "EFT"}
            </p>
          </div>

          {/* Company Contact Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
            <p className="font-semibold text-secondary mb-2">📞 Need Help?</p>
            <p className="text-gray-600">{companyAddress}</p>
            <p className="text-gray-600">{companyPhone1}</p>
            <p className="text-gray-600">{companyPhone2}</p>
            <p className="text-gray-600">{companyPhone3}</p>
            <p className="text-gray-600">{companyEmail}</p>
          </div>

          <button
            onClick={() => navigate("/")}
            className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50"
          >
            Continue Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  // Checkout form
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Progress Steps */}
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
                  className="px-4 py-3 border rounded-lg"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder="Last Name *"
                  className="px-4 py-3 border rounded-lg"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="Phone *"
                  className="px-4 py-3 border rounded-lg"
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email *"
                  className="px-4 py-3 border rounded-lg"
                />
              </div>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Street Address *"
                className="w-full px-4 py-3 border rounded-lg mt-4"
              />
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="px-4 py-3 border rounded-lg"
                >
                  <option value="">Select Town/City *</option>
                  {gautengTowns.map((town) => (
                    <option key={town} value={town}>
                      {town}
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
                  className="px-4 py-3 border rounded-lg"
                />
              </div>
              <textarea
                name="deliveryNote"
                value={formData.deliveryNote}
                onChange={handleChange}
                placeholder="Delivery Notes (Optional)"
                rows="3"
                className="w-full px-4 py-3 border rounded-lg mt-4"
              />
              <button
                type="submit"
                className="w-full mt-6 bg-primary text-white py-4 rounded-xl font-semibold"
              >
                Continue →
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-secondary mb-6">
                Payment Method
              </h2>
              <div className="space-y-4 mb-6">
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer ${formData.paymentMethod === "cod" ? "border-primary bg-blue-50" : "border-gray-200"}`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "cod" })
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Cash on Delivery</span>
                    <DollarSign className="text-green-600" />
                  </div>
                </div>
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer ${formData.paymentMethod === "eft" ? "border-primary bg-blue-50" : "border-gray-200"}`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "eft" })
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">
                      EFT - Pay Before Delivery
                    </span>
                    <CreditCard className="text-blue-600" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border py-4 rounded-xl"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!formData.paymentMethod}
                  className="flex-1 bg-accent text-white py-4 rounded-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  <MessageCircle size={18} />
                  <span>Notify Admin on WhatsApp</span>
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
