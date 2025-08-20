// import React, { useEffect, useState } from "react";
// import { View, Text, ActivityIndicator } from "react-native";
// import ProviderOrderCard from "../../../../Components/ProviderOrderCard";
// import axios from "axios";

// const API_URL = "http://192.168.1.21:3000/provider/getMyOrders";
// const TOKEN =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OTllYTJmZDhlMjFhNzMxNWIyM2FiMCIsImVtYWlsIjoiYmF0ZXNoYWthbWFsQGdtYWlsLmNvbSIsInJvbGUiOiJwcm92aWRlciIsImlhdCI6MTc1NTU5ODA1NSwiZXhwIjoxNzU1Njg0NDU1fQ.XLuEIqVWBzGgdPVMVL8fmvGB7a4BhmFYGZQMI5c8XC8";

// const NewOrdersProvider = ({ navigation }) => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const res = await axios.get(API_URL, {
//           headers: { Authorization: `Bearer ${TOKEN}` },
//         });
//         const ordersList = res.data?.data || [];
//         const newOrders = ordersList.filter(
//           (order) => order.status === "pending"
//         );
//         setOrders(newOrders);
//       } catch (err) {
//         console.error("Error fetching new orders:", err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   if (loading)
//     return (
//       <ActivityIndicator
//         size="large"
//         color="#4F77F7"
//         style={{ flex: 1, marginTop: 20 }}
//       />
//     );

//   return (
//     <View>
//       {orders.length > 0 ? (
//         orders.map((order) => (
//           <ProviderOrderCard
//             key={order._id}
//             service={order}
//             navigation={navigation}
//           />
//         ))
//       ) : (
//         <Text style={{ textAlign: "center", marginTop: 20 }}>
//           لا توجد طلبات جديدة
//         </Text>
//       )}
//     </View>
//   );
// };

// export default NewOrdersProvider;
