import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrders } from "../../context/OrdersContext";
import { downloadOrderPDF } from "../../utils/pdfGenerator";

const TrackOrder = () => {
    const { user, isAuth } = useAuth();
    const { orders, fetchUserOrders } = useOrders();
    const [loading, setLoading] = useState(true);

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
