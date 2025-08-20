import React, { useEffect, useState, useCallback, useContext } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from "react-native";
import ProviderOrderCard from "../../../../Components/ProviderOrderCard";
import axios from "axios";
import { UserContext } from "../../../../screens/Context/UserContext";

const CurrentOrdersProvider = ({ navigation, baseUrl }) => {
  const BASE_URL = baseUrl || "https://3c97880a675a.ngrok-free.app";
  const { token } = useContext(UserContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ دالة لجلب الطلبات
  const fetchOrders = useCallback(async () => {
    if (!token) return; // لو التوكن لسه محملش
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/provider/getMyOrders`, {
        headers: { Authorization: `bearer ${token}` }, // <<<<<< استخدم bearer
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
  }, [BASE_URL, token]);

  // ✅ استدعاء أول مرة بعد تحميل التوكن
  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token, fetchOrders]);

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
