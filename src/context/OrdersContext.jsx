import { createContext, useContext, useState, useEffect } from "react";

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders must be used within OrdersProvider");
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("ncc_orders");
    if (stored) {
      setOrders(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading) {
      localStorage.setItem("ncc_orders", JSON.stringify(orders));
    }
  }, [orders, loading]);

  // Add new order
  const addOrder = (orderData) => {
    const newOrder = {
      ...orderData,
      id: Date.now(),
      status: "pending", // pending, processing, completed, cancelled
      createdAt: new Date().toISOString(),
    };
    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  // Update order status
  const updateOrderStatus = (orderId, status) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId
          ? { ...order, status, updatedAt: new Date().toISOString() }
          : order,
      ),
    );
  };

  // Delete order
  const deleteOrder = (orderId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this order? This cannot be undone.",
      )
    ) {
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
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
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
