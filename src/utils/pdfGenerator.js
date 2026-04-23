import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const companyEmail = "info@ncctiles.co.za";
const companyPhone1 = "067 045 8628";
const companyPhone2 = "063 993 9627";
const companyPhone3 = "063 448 1130";
const companyAddress = "9692 de Luba Crescent, Clayville Ext 79";

const formatPrice = (price) => {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    minimumFractionDigits: 2,
  })
    .format(price)
    .replace("ZAR", "R");
};

export const generatePDF = (
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
  deliveryFeeAmount,
  cartItems
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
    { align: "center" }
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

  const tableData = cartItems.map((item) => {
    // Check if the item has nested "product" object (from backend order response) or flat structure (from cart)
    const productName = item.product ? item.product.name : (item.name || "Unknown Product");
    const productCode = item.product ? item.product.code : (item.code || "N/A");
    const productSize = item.product ? (item.product.size || item.product.sizes?.[0]) : (item.size || item.sizes?.[0] || "600x600");

    return [
      productCode || "N/A",
      productName || "Unknown Product",
      productSize || "600x600",
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

  // Totals
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`Subtotal: ${formatPrice(subtotal)}`, 140, finalY);
  doc.text(
    `Delivery Fee: ${formatPrice(deliveryFeeAmount)}`,
    140,
    finalY + 5
  );
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 64, 175);
  doc.text(
    `Total: ${formatPrice(subtotal + deliveryFeeAmount)}`,
    140,
    finalY + 12
  );

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
      finalY + 30
    );
    doc.text("• We accept cash or EFT on delivery", 14, finalY + 34);
  } else {
    doc.text("• EFT Payment Required Before Delivery", 14, finalY + 30);
    doc.text("• Banking details will be provided via email", 14, finalY + 34);
    doc.text(
      "• Delivery will be scheduled after payment confirmation",
      14,
      finalY + 38
    );
  }

  // Notes
  doc.setFont("helvetica", "bold");
  doc.text("IMPORTANT NOTES:", 14, finalY + 48);
  doc.setFont("helvetica", "normal");
  doc.text(
    "• Your delivery fee has been included in the total.",
    14,
    finalY + 53
  );
  doc.text(
    "• Admin will contact you within 24 hours to confirm delivery time.",
    14,
    finalY + 57
  );
  doc.text(
    `• For queries: ${companyPhone1} | ${companyEmail}`,
    14,
    finalY + 61
  );

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text("Thank you for choosing NCC Tiles Supplier!", 105, 280, {
    align: "center",
  });

  return { doc, pdfBase64: doc.output("datauristring") };
};

export const downloadOrderPDF = (order) => {
  try {
    const subtotal = order.total_amount - (order.delivery_fee || 0);
    const orderDate = order.created_at 
      ? new Date(order.created_at).toLocaleDateString()
      : new Date().toLocaleDateString();

    const { doc } = generatePDF(
      order.orderNumber || order.id?.toString(),
      orderDate,
      order.paymentMethod || "eft",
      order.customerName || "Customer",
      order.phone || "N/A",
      order.email || "N/A",
      order.address || "N/A",
      order.city || "N/A",
      order.postalCode || "N/A",
      subtotal,
      order.delivery_fee || 0,
      order.items || []
    );
    doc.save(`${order.orderNumber || order.id}.pdf`);
  } catch (err) {
    console.error("PDF Error:", err);
    alert("❌ Error generating PDF");
  }
};
