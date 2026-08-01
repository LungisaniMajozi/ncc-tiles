import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrdersContext";
import { downloadOrderPDF } from "../../utils/pdfGenerator";
import emailjs from "@emailjs/browser";
import API_BASE_URL from "../../config/api";

const TrackOrder = () => {
    const { user, isAuth } = useAuth();
    const { orders, fetchUserOrders } = useOrders();
    const [loading, setLoading] = useState(true);

    const handleCancelOrder = async (order) => {
        if (!window.confirm(`Are you sure you want to cancel order ${order.orderNumber}?`)) return;

        try {
            const res = await fetch(`${API_BASE_URL}/orders/${order.id}/cancel`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("ncc_token")}`,
                },
            });
            if (!res.ok) throw new Error("Failed to cancel order");
            
            // Send cancellation email
            const params = {
                order_number: `⚠️ [CANCELLED] ${order.orderNumber} ⚠️`,
                order_date: new Date(order.created_at).toLocaleDateString(),
                payment_method: order.paymentMethod || "EFT",
                order_total: `R${order.total_amount.toFixed(2)}`,
                delivery_fee: `R${(order.delivery_fee || 0).toFixed(2)}`,
                customer_name: order.customerName || user.name,
                customer_phone: order.phone || "",
                customer_email: order.email || user.email,
                customer_address: order.address || "",
                customer_town: order.city || "",
                payment_instruction_1: "THIS ORDER WAS CANCELLED BY THE CUSTOMER.",
                payment_instruction_2: "Do not process this order.",
                payment_instruction_3: "",
                company_address: "9692 de Luba Crescent, Clayville Ext 79",
                company_phone: "067 045 8628",
                to_email: import.meta.env.VITE_EMAILJS_ADMIN_EMAIL || "info@ncctiles.co.za",
                to_name: "NCC Tiles Admin",
                from_name: order.customerName || user.name,
                reply_to: order.email || user.email,
                items: order.items.map(i => ({
                    name: i.product?.name || "Unknown",
                    quantity: i.quantity,
                    price: `R${i.price}`,
                    total: `R${(i.price * i.quantity).toFixed(2)}`
                }))
            };

            await emailjs.send(
                import.meta.env.VITE_EMAILJS_SERVICE_ID,
                import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
                params,
                import.meta.env.VITE_EMAILJS_USER_ID,
            );

            if (fetchUserOrders) fetchUserOrders();
            alert("Order cancelled successfully.");
        } catch (err) {
            console.error("Cancellation Error", err);
            alert("Failed to cancel order. Please try again or contact support.");
        }
    };

    useEffect(() => {
        if(isAuth()){
            if (fetchUserOrders) {
                fetchUserOrders().then(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }
    }, [isAuth]);

    if (!isAuth()) return <div className="p-8 text-center text-xl pt-24 mt-8">Please log in to track your orders.</div>;

    if (loading) return <div className="p-8 text-center pt-24 mt-8">Loading your orders...</div>;

    return (
        <div className="max-w-7xl mx-auto p-4 py-8 pt-8">
            <h1 className="text-3xl font-bold text-secondary mb-8">My Orders</h1>
            {!orders || orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order.id} className="bg-white rounded-xl shadow p-6">
                            <div className="flex justify-between items-center mb-4 border-b pb-4">
                                <div>
                                    <h3 className="font-semibold text-lg text-secondary">
                                      Order {order.orderNumber ? `#${order.orderNumber}` : `#${order.id}`}
                                    </h3>
                                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <div className="text-right flex items-center space-x-4">
                                    {(order.status.toLowerCase() === "pending" || order.status.toLowerCase() === "pending_payment" || order.status.toLowerCase() === "pending payment") && (
                                        <button 
                                            onClick={() => handleCancelOrder(order)}
                                            className="text-red-500 text-sm hover:underline font-medium"
                                        >
                                            ❌ Cancel Order
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => downloadOrderPDF(order)}
                                        className="text-primary text-sm hover:underline font-medium"
                                    >
                                        ⬇ Download Receipt
                                    </button>
                                    <span className={`px-4 py-1.5 rounded-full text-sm font-medium capitalize ${
                                        order.status.toLowerCase() === "pending" || order.status.toLowerCase() === "pending_payment" ? "bg-yellow-100 text-yellow-800" :
                                        order.status.toLowerCase() === "processing" || order.status.toLowerCase() === "paid" ? "bg-blue-100 text-blue-800" :
                                        order.status.toLowerCase() === "completed" ? "bg-green-100 text-green-800" :
                                        "bg-gray-100 text-gray-800"
                                    }`}>
                                        {order.status.replace("_", " ")}
                                    </span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {order.items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            {item.product ? item.product.name : "Archived Tile Product"} x {item.quantity}
                                        </span>
                                        <span className="font-medium">R{(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>R{order.total_amount.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default TrackOrder;
