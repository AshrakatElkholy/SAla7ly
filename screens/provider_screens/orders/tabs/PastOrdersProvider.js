import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const PastOrdersProvider = ({ navigation, token: propToken }) => {
  const BASE_URL = "https://f27ad2cde96b.ngrok-free.app";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userToken, setUserToken] = useState(propToken || null);

  // ✅ Get token from AsyncStorage if not provided as prop
  const getToken = async () => {
    try {
      if (propToken) {
        setUserToken(propToken);
        return propToken;
      }
      
      const storedToken = await AsyncStorage.getItem('access_token');
      console.log("User Token from AsyncStorage:", storedToken);
      
      if (storedToken) {
        setUserToken(storedToken);
        return storedToken;
      }
      
      console.warn("No token found in AsyncStorage or props");
      return null;
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  };

  const fetchOrders = async () => {
    try {
      // Get token first
      const currentToken = await getToken();
      
      if (!currentToken) {
        console.error("No token available for API call");
        setOrders([]);
        return;
      }

      console.log("Fetching orders with token:", currentToken);
      
      const res = await axios.get(`${BASE_URL}/provider/getMyOrders`, {
        headers: { 
          Authorization: `bearer ${currentToken}`,
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
  }, [propToken]); // Re-fetch when propToken changes

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