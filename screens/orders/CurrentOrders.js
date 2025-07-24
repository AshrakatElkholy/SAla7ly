import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderCard from "../../Components/OrderCard";

const CurrentOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleCancelOrder = async (orderId) => {
    try {
      const data = await AsyncStorage.getItem("orders");
      const parsed = data ? JSON.parse(data) : [];

      const updatedOrders = parsed.map((order) =>
        order.id === orderId ? { ...order, status: "ملغي" } : order
      );

      await AsyncStorage.setItem("orders", JSON.stringify(updatedOrders));

      const current = updatedOrders.filter(
        (order) => order.status === "قيد التنفيذ" || order.status === "معلق"
      );
      setOrders(current);
    } catch (err) {
      console.log("Error canceling order", err);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await AsyncStorage.getItem("orders");
        const parsed = data ? JSON.parse(data) : [];
        const current = parsed.filter(
          (order) => order.status === "قيد التنفيذ" || order.status === "معلق"
        );

        setOrders(current);
      } catch (err) {
        console.log("Error fetching orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (orders.length === 0) {
    return (
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Text style={{ fontSize: 16, color: "#666" }}>لا يوجد طلبات حالية</Text>
      </View>
    );
  }

  return (
    <View>
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
          showChat={true}
          onCancel={handleCancelOrder}
        />
      ))}
    </View>
  );
};

export default CurrentOrders;
