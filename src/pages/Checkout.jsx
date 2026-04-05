import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import emailjs from "@emailjs/browser";

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderCartItems, setOrderCartItems] = useState([]);
  const [isSending, setIsSending] = useState(false);

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

  // 🇿 Gauteng Towns
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

  // 📧 Company Info
  const companyEmail = "info@ncctiles.co.za";
  const adminEmail = import.meta.env.VITE_EMAILJS_ADMIN_EMAIL || companyEmail;
  const companyPhone1 = "067 045 8628";
  const companyPhone2 = "063 993 9627";
  const companyPhone3 = "063 448 1130";
  const companyAddress = "9692 de Luba Crescent, Clayville Ext 79";

  // 🔹 Generate PDF Receipt - TEXT ONLY (NO IMAGES)
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

    // Header
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

    // Title & Order Info
    doc.setTextColor(30, 64, 175);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER CONFIRMATION", 14, 48);
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

    // Customer Box
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

    // Items Table (TEXT ONLY)
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("ORDER ITEMS", 14, 125);

    const tableData = cartItems.map((item) => [
      item.code || "N/A",
      item.name || "Unknown Product",
      item.size || item.sizes?.[0] || "600x600",
      `${item.quantity || 1} m²`,
      formatPrice(item.price || 0),
      formatPrice((item.price || 0) * (item.quantity || 1)),
    ]);

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

    // Totals
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: ${formatPrice(subtotal)}`, 140, finalY);
    doc.text(`Delivery: To be calculated (Manual)`, 140, finalY + 5);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 64, 175);
    doc.text(`Total: ${formatPrice(subtotal)} (+ delivery)`, 140, finalY + 12);

    // Payment Instructions
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
      doc.text("• Banking details will be provided via email", 14, finalY + 34);
      doc.text(
        "• Delivery will be scheduled after payment confirmation",
        14,
        finalY + 38,
      );
    }

    // Notes
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

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text("Thank you for choosing NCC Tiles Supplier!", 105, 280, {
      align: "center",
    });

    return { doc, pdfBase64: doc.output("datauristring") };
  };

  // 🔹 Download PDF
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
    const items = orderCartItems.length > 0 ? orderCartItems : cart;
    if (items.length === 0) return alert("⚠️ No items available");
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
        items,
      );
      doc.save(`${orderNumber}.pdf`);
    } catch (err) {
      console.error("PDF Error:", err);
      alert("❌ Error generating PDF");
    }
  };

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
      order_total: formatPrice(orderData.subtotal),
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
    if (!formData.paymentMethod) return alert("⚠️ Select payment method");

    setIsSending(true);
    const orderNumber = `NCC-${Date.now().toString().slice(-8)}`;
    const orderDate = new Date().toLocaleDateString("en-ZA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    const customerName = `${formData.firstName} ${formData.lastName}`;

    const orderData = {
      orderNumber,
      orderDate,
      customerName,
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
      const emailResult = await sendOrderEmail(orderData, cart);
      addOrder({
        ...orderData,
        items: cart,
        pdfBase64,
        emailSent: emailResult.success,
      });
      setOrderCartItems([...cart]);
      setTimeout(() => {
        setOrderComplete(true);
        window.orderDataForSuccessPage = orderData;
      }, 800);
    } catch (err) {
      console.error("Order Error:", err);
      alert("⚠️ Order saved locally. Email may have failed.");
      setOrderComplete(true);
      window.orderDataForSuccessPage = orderData;
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
                downloadPDF(
                  od.orderNumber,
                  od.orderDate,
                  od.paymentMethod,
                  od.customerName,
                  od.phone,
                  od.email,
                  od.address,
                  od.city,
                  od.postalCode,
                  od.subtotal,
                )
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
              Total: {formatPrice(od.subtotal)} (+ delivery)
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
                  {gautengTowns.map((t) => (
                    <option key={t} value={t}>
                      {t}
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
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.paymentMethod === "cod" ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
                  onClick={() =>
                    setFormData({ ...formData, paymentMethod: "cod" })
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Cash on Delivery</span>
                    <DollarSign className="text-green-600" />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Pay when you receive your order. Cash or EFT accepted.
                  </p>
                </div>
                <div
                  className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${formData.paymentMethod === "eft" ? "border-primary bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}
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
                  <p className="text-sm text-gray-600 mt-2">
                    Banking details emailed after submission.
                  </p>
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-start space-x-3">
                <Mail
                  className="text-blue-600 flex-shrink-0 mt-0.5"
                  size={20}
                />
                <div>
                  <p className="font-semibold text-blue-800">
                    📧 Email Notification
                  </p>
                  <p className="text-sm text-blue-700">
                    Admin notified instantly. Download receipt after submission.
                  </p>
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
                  disabled={!formData.paymentMethod || isSending}
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
                      <span>Submit & Notify Admin</span>
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
