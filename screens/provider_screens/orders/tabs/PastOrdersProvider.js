import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ProviderOrderCard from "../../../../Components/ProviderOrderCard";

const mockOrders = [
  {
    id: 1,
    status: "ملغي",
    date: "2024-04-10",
    category: "دهان",
    priceRange: "1000 ج.م",
    description: "دهان غرفة",
  },
  {
    id: 2,
    status: "تم التنفيذ",
    date: "2024-05-01",
    category: "سباك",
    priceRange: "700 ج.م",
    description: "تغيير حنفية",
  },
];

const PastOrdersProvider = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const past = mockOrders
      .filter((order) => ["ملغي", "تم التنفيذ"].includes(order.status))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
    setOrders(past);
  }, []);

  return (
    <View>
      {orders.length > 0 ? (
        orders.map((order) => (
          <ProviderOrderCard
            key={order.id}
            service={order}
            navigation={navigation}
          />
        ))
      ) : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          لا يوجد طلبات منتهية
        </Text>
      )}
    </View>
  );
};

export default PastOrdersProvider;
