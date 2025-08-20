import React, { useEffect, useState, useContext } from "react";
import {
  View,
  ActivityIndicator,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import axios from "axios";
import OrderCard from "../../Components/OrderCard";
import { UserContext } from "../../screens/Context/UserContext";

const EmptyState = ({ message }) => (
  <View style={{ alignItems: "center", marginTop: 40 }}>
    <Text style={{ fontSize: 16, color: "#666" }}>{message}</Text>
  </View>
);

export const PastOrders = ({ navigation }) => {
  const { token } = useContext(UserContext);
  const BASE_URL = "https://3c97880a675a.ngrok-free.app";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/getMyOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allOrders = res.data || [];
      const past = allOrders.filter((order) =>
        ["completed", "canceled", "rejected"].includes(
          order.status?.toLowerCase()
        )
      );
      setOrders(past);
    } catch (err) {
      if (err.response?.data?.message === "you have no orders yet") {
        setOrders([]);
      } else {
        console.log("Error fetching past orders", err);
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
  if (orders.length === 0) return <EmptyState message="لا يوجد طلبات سابقة" />;

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
          showChat={false}
          token={token}
          baseUrl={BASE_URL}
        />
      ))}
    </ScrollView>
  );
};

export default PastOrders;
