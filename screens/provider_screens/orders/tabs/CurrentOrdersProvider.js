import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ProviderOrderCard from "../../../../Components/ProviderOrderCard";

const mockOrders = [
  {
    id: 1,
    status: "قيد تنفيذ",
    category: "نجار",
    priceRange: "500 ج.م",
    description: "تصليح باب",
  },
  {
    id: 2,
    status: "المعلقه",
    category: "سباك",
    priceRange: "800 ج.م",
    description: "صيانة مطبخ",
  },
];

const CurrentOrdersProvider = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const current = mockOrders.filter((order) =>
      ["قيد تنفيذ", "المعلقه"].includes(order.status)
    );
    setOrders(current);
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
          لا توجد طلبات حالية
        </Text>
      )}
    </View>
  );
};

export default CurrentOrdersProvider;
