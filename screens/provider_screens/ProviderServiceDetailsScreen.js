import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Alert,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomServiceCard from "../../Components/CustomServiceCard";
import CustomButton from "../../Components/CustomButton";
import { Fonts } from "../../constants";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext"; // ✅ Import your context

const screenWidth = Dimensions.get("window").width;

const ProviderServiceDetailsScreen = ({ navigation, route }) => {
  const { token } = useContext(AuthContext); // ✅ Get token from context
  const currentOrder = route.params?.order;

  const service = {
    image: currentOrder?.serviceId?.mainImage?.secure_url
      ? { uri: currentOrder.serviceId.mainImage.secure_url }
      : require("../../assets/plumber.jpg"),
    category: currentOrder?.serviceId?.title || "غير محدد",
    title: currentOrder?.serviceId?.title || "غير محدد",
    rating: 4.5,
    reviews: 51,
    description: currentOrder?.description || "لا يوجد وصف",
    priceRange: `${currentOrder?.serviceId?.minPrice || 0}-${currentOrder?.serviceId?.maxPrice || 0} ج.م`,
    customer: {
      name: currentOrder?.userId?.name || "غير محدد",
      address: currentOrder?.userId?.address || "غير محدد",
      phone: currentOrder?.userId?.phone || "غير محدد",
      image: require("../../assets/picProvider.png"),
    },
  };

  const BASE_URL = "https://f27ad2cde96b.ngrok-free.app";

  const updateOrderStatus = async (status) => {
    console.log("Sending orderId:", currentOrder._id, "with status:", status);
    try {
      // ✅ Check order first
      const checkOrder = await axios.get(
        `${BASE_URL}/provider/orders/${currentOrder._id}`,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ use token from context
          timeout: 5000,
        }
      );

      if (!checkOrder.data) {
        Alert.alert("خطأ", "الأوردر غير موجود أو تم حذفه");
        return;
      }

      // ✅ Update order status
      const response = await axios.post(
        `${BASE_URL}/provider/acceptOrRejectOrder`,
        { orderId: currentOrder._id, status },
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ use token from context
          timeout: 5000,
        }
      );

      console.log("Response data:", response.data);
      Alert.alert("تم بنجاح", `تم تحديث الطلب إلى ${status}`);

      // ✅ Navigate after update
      navigation.replace(
        status === "accepted" ? "CurrentOrdersProvider" : "NewOrdersProvider"
      );
    } catch (error) {
      console.log("Axios Error:", error);
      if (error.response) {
        console.log("Response data:", error.response.data);
        if (error.response.status === 404) {
          Alert.alert("خطأ", "الأوردر غير موجود أو تم حذفه");
        } else {
          Alert.alert(
            "حدث خطأ",
            error.response.data.message || "فشل تحديث حالة الطلب"
          );
        }
      } else if (error.request) {
        console.log("No response received:", error.request);
        Alert.alert("حدث خطأ", "لم يتم تلقي رد من السيرفر");
      } else {
        console.log("Error message:", error.message);
        Alert.alert("حدث خطأ", error.message);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.customHeaderContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.customHeaderTitle}>تفاصيل الخدمة</Text>
        </View>

        <Text style={styles.sectionTitle}>تفاصيل مشكلة</Text>
        <Image source={service.image} style={styles.mainImage} />
        <Text style={styles.description}>{service.description}</Text>

        <Text style={styles.sectionTitle}>تفاصيل العميل</Text>
        <View style={styles.clientCard}>
          <Image source={service.customer.image} style={styles.clientImage} />
          <View style={{ flex: 1, marginRight: 10 }}>
            <Text style={styles.clientName}>{service.customer.name}</Text>
            <View style={styles.clientRow}>
              <Ionicons name="location-outline" size={16} color="#777" />
              <Text style={styles.clientAddress}>
                {service.customer.address}
              </Text>
            </View>
            <View style={styles.clientRow}>
              <Ionicons name="call-outline" size={16} color="#777" />
              <Text style={styles.clientPhone}>{service.customer.phone}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>الخدمة</Text>
        <CustomServiceCard
          category={service.category}
          rating={service.rating}
          reviews={service.reviews}
          image={service.image}
          priceRange={service.priceRange}
          craftsmanName={currentOrder?.providerId?.name || "غير محدد"}
        />

        <View style={styles.buttonContainer}>
          <CustomButton
            title="رفض العرض"
            onPress={() => updateOrderStatus("rejected")}
            type="outline"
            color="#d00"
            textStyle={{ fontSize: 16 }}
            style={{ flex: 1, marginHorizontal: 5 }}
          />
          <CustomButton
            title="قبول"
            onPress={() => updateOrderStatus("accepted")}
            type="filled"
            color="#004AAD"
            textStyle={{ fontSize: 16 }}
            style={{ flex: 1, marginHorizontal: 5 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProviderServiceDetailsScreen;
