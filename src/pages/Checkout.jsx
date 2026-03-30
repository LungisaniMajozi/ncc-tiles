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
  const [orderCartItems, setOrderCartItems] = useState([]);

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

  // 📞 Company Info (from PDF documents)
  const adminWhatsApp = "27670458628";
  const companyPhone1 = "067 045 8628";
  const companyPhone2 = "063 993 9627";
  const companyPhone3 = "063 448 1130";
  const companyAddress = "9692 de Luba Crescent, Clayville Ext 79";
  const companyEmail = "info@ncctiles.co.za";

  // Generate PDF Receipt
  const generatePDF = (
    orderNumber,
    orderDate,
    paymentMethod,
    customerName,
    phone,
    email,
    address,
    city,
    postalCode,
    subtotal,
    cartItems,
  ) => {
    const doc = new jsPDF();

    // ========== HEADER (Blue Background) ==========
    doc.setFillColor(30, 64, 175);
    doc.rect(0, 0, 210, 35, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("NCC TILES SUPPLIER", 105, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Naeve Construction Company", 105, 22, { align: "center" });

    doc.setFontSize(8);
    doc.text(companyAddress, 105, 28, { align: "center" });
    doc.text(
      `Tel: ${companyPhone1} | ${companyPhone2} | ${companyPhone3}`,
      105,
      33,
      { align: "center" },
    );

    // ========== ORDER CONFIRMATION TITLE ==========
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER CONFIRMATION", 14, 48);

    // ========== ORDER DETAILS ==========
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);
    doc.text(`Order Reference: ${orderNumber}`, 14, 56);
    doc.text(`Date: ${orderDate}`, 14, 61);

    const paymentText =
      paymentMethod === "cod"
        ? "Payment Method: Cash on Delivery"
        : "Payment Method: EFT (Pay Before Delivery)";
    doc.text(paymentText, 14, 66);

    // ========== CUSTOMER DETAILS BOX ==========
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(249, 250, 251);
    doc.rect(14, 72, 182, 40, "FD");

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CUSTOMER DETAILS", 18, 80);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text(`Name: ${customerName}`, 18, 87);
    doc.text(`Phone: ${phone}`, 18, 92);
    doc.text(`Email: ${email}`, 18, 97);
    doc.text(`Address: ${address}`, 18, 102);
    doc.text(`Town: ${city}, ${postalCode}`, 18, 107);

    // ========== ORDER ITEMS TABLE ==========
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER ITEMS", 14, 125);

    // Prepare table data
    const tableData = cartItems.map((item) => {
      return [
        item.code || "N/A",
        item.name || "Unknown",
        item.size || item.sizes?.[0] || "600x600",
        `${item.quantity || 1} m²`,
        formatPrice(item.price || 0),
        formatPrice((item.price || 0) * (item.quantity || 1)),
      ];
    });

    autoTable(doc, {
      startY: 130,
      head: [["Code", "Product", "Size", "Qty", "Price/m²", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [30, 64, 175],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 8,
      },
      bodyStyles: { fontSize: 8 },
      styles: { cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 50 },
        2: { cellWidth: 20 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
      },
    });

    // ========== TOTALS SECTION ==========
    const finalY = doc.lastAutoTable.finalY + 10;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: ${formatPrice(subtotal)}`, 140, finalY);
    doc.text(`Delivery: To be calculated (Manual)`, 140, finalY + 5);

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(`Total: ${formatPrice(subtotal)} (+ delivery)`, 140, finalY + 12);

    // ========== PAYMENT INSTRUCTIONS ==========
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT INSTRUCTIONS:", 14, finalY + 25);

    doc.setFont("helvetica", "normal");
    if (paymentMethod === "cod") {
      doc.text(
        "• Cash on Delivery - Pay when you receive your order",
        14,
        finalY + 30,
      );
      doc.text("• We accept cash or EFT on delivery", 14, finalY + 34);
    } else {
      doc.text("• EFT Payment Required Before Delivery", 14, finalY + 30);
      doc.text(
        "• Banking details will be provided via WhatsApp",
        14,
        finalY + 34,
      );
      doc.text(
        "• Delivery will be scheduled after payment confirmation",
        14,
        finalY + 38,
      );
    }

    // ========== IMPORTANT NOTES ==========
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTANT NOTES:", 14, finalY + 48);

    doc.setFont("helvetica", "normal");
    doc.text(
      "• Delivery charges will be calculated manually based on location",
      14,
      finalY + 53,
    );
    doc.text(
      "• Admin will contact you within 24 hours with final amount",
      14,
      finalY + 57,
    );
    doc.text(
      `• For queries: ${companyPhone1} | ${companyEmail}`,
      14,
      finalY + 61,
    );

    // ========== FOOTER ==========
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for choosing NCC Tiles Supplier!", 105, 280, {
      align: "center",
    });

    // ✅ Convert PDF to base64 for persistent storage
    const pdfBase64 = doc.output("datauristring");

    return { doc, pdfBase64 };
  };

  // Download PDF Receipt
  const downloadPDF = (
    orderNumber,
    orderDate,
    paymentMethod,
    customerName,
    phone,
    email,
    address,
    city,
    postalCode,
    subtotal,
  ) => {
    const cartItems = orderCartItems.length > 0 ? orderCartItems : cart;

    if (cartItems.length === 0) {
      alert("⚠️ No items available to generate receipt");
      return;
    }

    try {
      const { doc } = generatePDF(
        orderNumber,
        orderDate,
        paymentMethod,
        customerName,
        phone,
        email,
        address,
        city,
        postalCode,
        subtotal,
        cartItems,
      );
      doc.save(`${orderNumber}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("❌ Error generating PDF. Please try again.");
    }
  };

  // Clear cart and navigate
  const clearOrderAndCart = () => {
    clearCart();
    setOrderCartItems([]);
    navigate("/");
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

      // ✅ STEP 1: Generate order number ONCE
      const orderNumber = `NCC-${Date.now().toString().slice(-8)}`;

      // ✅ STEP 2: Create order date
      const orderDate = new Date().toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      // ✅ STEP 3: Create customer name
      const customerName = `${formData.firstName} ${formData.lastName}`;

      // ✅ STEP 4: Create order data object (use this EVERYWHERE)
      const orderData = {
        orderNumber: orderNumber,
        orderDate: orderDate,
        customerName: customerName,
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

      // ✅ STEP 5: Show alert BEFORE opening WhatsApp
      const paymentText =
        orderData.paymentMethod === "cod"
          ? "💵 Cash on Delivery"
          : "🏦 EFT (Pay Before Delivery)";

      const whatsappMessage = `🏗️ NEW ORDER - NCC TILES

📋 Ref: ${orderData.orderNumber}
👤 Customer: ${orderData.customerName}
📞 Phone: ${orderData.phone}
📍 Town: ${orderData.city}
💰 Total: ${formatPrice(orderData.subtotal)} (+ delivery)
💳 Payment: ${paymentText}

📄 Receipt available for download

⚠️ Action: Calculate delivery & contact customer`;

      alert(`📱 WhatsApp will now open.

✅ IMPORTANT: After sending your message, COME BACK to this page to download your receipt.

Your order reference is: ${orderData.orderNumber}`);

      // ✅ STEP 6: Open WhatsApp
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappUrl = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;
      window.open(whatsappUrl, "_blank");

      // ✅ STEP 7: Store cart items for PDF generation
      setOrderCartItems([...cart]);

      // ✅ STEP 8: Generate PDF and save order
      try {
        const { pdfBase64 } = generatePDF(
          orderData.orderNumber,
          orderData.orderDate,
          orderData.paymentMethod,
          orderData.customerName,
          orderData.phone,
          orderData.email,
          orderData.address,
          orderData.city,
          orderData.postalCode,
          orderData.subtotal,
          cart,
        );

        // ✅ STEP 9: Save order to admin system with PDF
        addOrder({
          ...orderData,
          items: cart,
          pdfBase64: pdfBase64,
        });

        // ✅ STEP 10: Show success page
        setTimeout(() => {
          setOrderComplete(true);
          // Store orderData for success page display
          window.orderDataForSuccessPage = orderData;
        }, 1000);
      } catch (error) {
        console.error("Error saving order:", error);
        // Still show success page even if PDF fails
        setTimeout(() => {
          setOrderComplete(true);
          window.orderDataForSuccessPage = orderData;
        }, 1000);
      }
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

  // Success page - ALL REFERENCES MATCH
  if (orderComplete && window.orderDataForSuccessPage) {
    const orderData = window.orderDataForSuccessPage;

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full"
        >
          {/* Notice - Shows correct reference */}
          <div className="bg-green-100 border-2 border-green-400 rounded-xl p-4 mb-6 text-center">
            <p className="font-bold text-green-800 text-lg">
              ✅ Order Submitted Successfully!
            </p>
            <p className="text-green-700 mt-1">
              Reference:{" "}
              <span className="font-mono font-bold">
                {orderData.orderNumber}
              </span>
            </p>
          </div>

          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-secondary mb-2 text-center">
            Download Your Receipt
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Your order has been saved to our system
          </p>

          {/* Steps */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl mb-6">
            <h3 className="font-bold text-blue-800 mb-4">
              📋 What to do next:
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-semibold text-blue-800">
                    Download Receipt
                  </p>
                  <p className="text-sm text-blue-700">
                    Click button below to download PDF:{" "}
                    <span className="font-mono">
                      {orderData.orderNumber}.pdf
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-semibold text-blue-800">Contact Admin</p>
                  <p className="text-sm text-blue-700">
                    Admin will contact you within 24 hours
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() =>
                downloadPDF(
                  orderData.orderNumber,
                  orderData.orderDate,
                  orderData.paymentMethod,
                  orderData.customerName,
                  orderData.phone,
                  orderData.email,
                  orderData.address,
                  orderData.city,
                  orderData.postalCode,
                  orderData.subtotal,
                )
              }
              className="block w-full bg-primary text-white py-4 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 font-semibold shadow-lg"
            >
              <Download size={20} />
              <span>Download Receipt ({orderData.orderNumber}.pdf)</span>
            </button>

            <a
              href={`https://wa.me/${adminWhatsApp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 flex items-center justify-center space-x-2 font-semibold"
            >
              <MessageCircle size={20} />
              <span>Contact Admin on WhatsApp</span>
            </a>

            <a
              href={`tel:${companyPhone1.replace(/\s/g, "")}`}
              className="block w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2 font-medium"
            >
              <Phone size={18} />
              <span>Call Us: {companyPhone1}</span>
            </a>
          </div>

          {/* Order Summary - All references match */}
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

          {/* Company Contact */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm">
            <p className="font-semibold text-secondary mb-2">📞 Need Help?</p>
            <p className="text-gray-600">{companyAddress}</p>
            <p className="text-gray-600">{companyPhone1}</p>
            <p className="text-gray-600">{companyPhone2}</p>
            <p className="text-gray-600">{companyPhone3}</p>
            <p className="text-gray-600">{companyEmail}</p>
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
