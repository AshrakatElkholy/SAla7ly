import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import ProviderOrderCard from "../../../../Components/ProviderOrderCard";
import axios from "axios";
import { ScrollView } from "react-native-gesture-handler";

const CurrentOrdersProvider = ({ navigation, baseUrl, token }) => {
  const BASE_URL = baseUrl || "https://7a6280fbc949.ngrok-free.app";

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/provider/getMyOrders`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Full API response:", res.data);

        const ordersList = res.data || [];
        const currentOrders = ordersList.filter((order) =>
          ["pending", "accepted", "confirmed"].includes(
            order.status?.toLowerCase()
          )
        );

        setOrders(currentOrders);
      } catch (err) {
        console.error("Error fetching current orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [BASE_URL, token]);

  if (loading)
    return (
      <ActivityIndicator
        size="large"
        color="#4F77F7"
        style={{ flex: 1, marginTop: 20 }}
      />
    );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchOrders} />
      }
    >
      {orders.length > 0 ? (
        orders.map((order) => (
          <ProviderOrderCard
            key={order._id}
            service={order}
            navigation={navigation}
            token={token}
            baseUrl={BASE_URL}
          />
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          لا توجد طلبات حالية
        </Text>
      )}
    </ScrollView>
  );
};

export default CurrentOrdersProvider;
