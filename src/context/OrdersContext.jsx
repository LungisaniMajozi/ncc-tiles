import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import API_BASE_URL from "../config/api";

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within OrdersProvider");
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, isAuth, isAdmin } = useAuth();

  const API_URL = API_BASE_URL;

  const fetchOrders = async () => {
    if (!token || !isAdmin()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
    setLoading(false);
  };

  const fetchUserOrders = async () => {
    if (!token || !isAuth()) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setOrders(await res.json());
    } catch (err) {
      console.error("Failed to fetch user orders", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin()) fetchOrders();
    else if (isAuth()) fetchUserOrders();
  }, [token, isAdmin, isAuth]);

  // Add new order
  const addOrder = async (orderData) => {
    try {
      const backendOrderData = {
        orderNumber: orderData.orderNumber,
        customerName: orderData.customerName,
        phone: orderData.phone,
        email: orderData.email,
        address: orderData.address,
        city: orderData.city,
        postalCode: orderData.postalCode,
        deliveryNote: orderData.deliveryNote,
        paymentMethod: orderData.paymentMethod,
        pdfBase64: orderData.pdfBase64,
        emailSent: orderData.emailSent,
        status: orderData.status,
        items: orderData.items.map((i) => ({
          product_id: i.id,
          quantity: i.quantity || 1,
          price: i.price || 0,
        })),
      };
      const res = await fetch(`${API_URL}/orders/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(backendOrderData),
      });
      if (res.ok) {
        const newOrder = await res.json();
        setOrders((prev) => [newOrder, ...prev]);
        return newOrder;
      } else {
        console.error("Order creation failed", await res.json());
      }
    } catch (error) {
      console.error(error);
    }
    return null;
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Delete order
  const deleteOrder = (orderId) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
      return true;
    }
    return false;
  };

  // Get order by ID
  const getOrderById = (id) => orders.find((order) => order.id === Number(id));

  // Get orders by status
  const getOrdersByStatus = (status) =>
    orders.filter((order) => order.status === status);

  // Stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const completedOrders = orders.filter((o) => o.status === "Completed").length;

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        fetchOrders,
        fetchUserOrders,
        addOrder,
        updateOrderStatus,
        deleteOrder,
        getOrderById,
        getOrdersByStatus,
        totalOrders,
        pendingOrders,
        completedOrders,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};

export default OrdersContext;
