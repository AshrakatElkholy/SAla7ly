import React, { useState, useEffect, useContext } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { RefreshControl } from 'react-native';
import axios from 'axios';
import { UserContext } from '../../../../screens/Context/UserContext';

const PastOrdersProvider = ({ navigation }) => {
  const BASE_URL = "https://45df9571624f.ngrok-free.app";
  const { token } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      if (!token) {
        console.error("No token available for API call");
        setOrders([]);
        return;
      }

      console.log("Fetching orders with token:", token);
      
      const res = await axios.get(`${BASE_URL}/provider/getMyOrders`, {
        headers: { 
          Authorization: `bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const allOrders = res.data || [];
      const pastOrders = allOrders
        .filter((order) =>
          ["completed", "rejected", "canceled"].includes(
            order.status?.toLowerCase()
          )
        )
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      setOrders(pastOrders);
    } catch (err) {
      console.error("Error fetching past orders:", err.message);
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response data:", err.response.data);
      }
      setOrders([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token]); // Re-fetch when token changes

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#4F77F7" />;
  }

  if (orders.length === 0) {
    return <EmptyState message="لا يوجد طلبات منتهية" />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {orders.map((order) => (
        <ProviderOrderCard
          key={order._id}
          service={order}
          navigation={navigation}
          token={userToken} // Pass the resolved token
          baseUrl={BASE_URL}
        />
      ))}
    </ScrollView>
  );
};