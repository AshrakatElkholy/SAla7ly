import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import OrderCard from "../../Components/OrderCard";

const PastOrders = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await AsyncStorage.getItem("orders");
        const parsed = data ? JSON.parse(data) : [];

        const past = parsed.filter(
          (order) => order.status === "ملغي" || order.status === "تم التنفيذ"
        );

        setOrders(past);
      } catch (err) {
        console.log("Error fetching past orders", err);
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
        <Text style={{ fontSize: 16, color: "#666" }}>لا يوجد طلبات سابقة</Text>
      </View>
    );
  }

  return (
    <View>
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} showChat={false} />
      ))}
    </View>
  );
};

export default PastOrders;
