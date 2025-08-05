import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ProviderOrderCard from "../../../../Components/ProviderOrderCard";

const mockOrders = [
  {
    id: 1,
    status: "جديد",
    category: "نجار",
    priceRange: "500 ج.م",
    description: "تصليح باب",
  },
  {
    id: 2,
    status: "قيد تنفيذ",
    category: "كهربائي",
    priceRange: "300 ج.م",
    description: "أسلاك",
  },
];

const NewOrdersProvider = ({ navigation }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const newOrders = mockOrders.filter((order) => order.status === "جديد");
    setOrders(newOrders);
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
          لا توجد طلبات جديدة
        </Text>
      )}
    </View>
  );
};

export default NewOrdersProvider;
