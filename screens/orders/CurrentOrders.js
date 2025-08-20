import React, { useEffect, useState } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import OrderCard from "../../Components/OrderCard";

const EmptyState = ({ message }) => (
  <View style={{ alignItems: "center", marginTop: 40 }}>
    <Text style={{ fontSize: 16, color: "#666" }}>{message}</Text>
  </View>
);

export const CurrentOrders = ({ navigation, route }) => {
  const token = route.params?.token;
  const BASE_URL =
    route.params?.baseUrl || "https://f27ad2cde96b.ngrok-free.app";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getMyOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allOrders = res.data || [];
      const current = allOrders.filter((order) =>
        ["pending", "accepted", "confirmed"].includes(
          order.status?.toLowerCase()
        )
      );
      setOrders(current);
    } catch (err) {
      if (err.response?.data?.message === "you have no orders yet") {
        setOrders([]);
      } else {
        console.log("Error fetching orders", err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [BASE_URL, token]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (orders.length === 0) return <EmptyState message="لا يوجد طلبات حالية" />;

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {orders.map((order) => (
        <OrderCard
          key={order._id}
          order={order}
          navigation={navigation}
          showChat={true}
          token={token}
          baseUrl={BASE_URL}
        />
      ))}
    </ScrollView>
  );
};

export default CurrentOrders;
