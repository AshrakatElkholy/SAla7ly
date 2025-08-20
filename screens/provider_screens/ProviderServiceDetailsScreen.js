import React, { useState } from "react";
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

const screenWidth = Dimensions.get("window").width;

const ProviderServiceDetailsScreen = ({ navigation, route }) => {
  const currentOrder = route.params?.order;
  const token = route.params?.token;
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

  const API_CONFIG = {
    BASE_URL: "https://7a6280fbc949.ngrok-free.app",
    TOKEN: token,
  };
  const updateOrderStatus = async (status) => {
    console.log("Sending orderId:", currentOrder._id, "with status:", status);
    try {
      const checkOrder = await axios.get(
        `${API_CONFIG.BASE_URL}/provider/orders/${currentOrder._id}`,
        {
          headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
          timeout: 5000,
        }
      );

      if (!checkOrder.data) {
        Alert.alert("خطأ", "الأوردر غير موجود أو تم حذفه");
        return;
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}/provider/acceptOrRejectOrder`,
        { orderId: currentOrder._id, status },
        {
          headers: { Authorization: `Bearer ${API_CONFIG.TOKEN}` },
          timeout: 5000,
        }
      );
      console.log("Response data:", response.data);
      Alert.alert("تم بنجاح", `تم تحديث الطلب إلى ${status}`);
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
          ></TouchableOpacity>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: Fonts.BOLD,
    color: "#000000",
    marginTop: 20,
    marginHorizontal: 16,
    textAlign: "right",
  },
  mainImage: {
    width: "90%",
    height: 150,
    borderRadius: 8,
    marginVertical: 10,
    alignSelf: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 20,
    textAlign: "right",
    paddingHorizontal: 16,
    fontFamily: Fonts.REGULAR,
  },
  clientCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },
  clientImage: { width: 75, height: 75, borderRadius: 25 },
  clientName: {
    fontSize: 16,
    textAlign: "right",
    fontFamily: Fonts.BOLD,
  },
  clientRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 4,
  },
  clientAddress: {
    fontSize: 14,
    color: "#121217",
    marginRight: 4,
    fontFamily: Fonts.REGULAR,
  },
  clientPhone: {
    fontSize: 14,
    color: "#121217",
    marginRight: 4,
    fontFamily: Fonts.REGULAR,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 10,
  },

  timeWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  timeBox: {
    minWidth: "30%",
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },

  timeText: {
    fontSize: 14,
    color: "#000",
    fontFamily: Fonts.REGULAR,
  },

  dayWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  dayBox: {
    width: screenWidth * 0.13,
    height: 70,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  dayShort: {
    fontSize: 12,
    color: "#777",
    fontFamily: Fonts.REGULAR,
  },

  dayNumber: {
    fontSize: 20,
    color: "#000",
    fontWeight: "bold",
  },

  label: {
    fontSize: 16,
    color: "#000000",
    fontFamily: Fonts.REGULAR,
  },

  flexSpacer: {
    flex: 1,
  },

  serviceCard: {
    flexDirection: "row-reverse",
    padding: 12,
    backgroundColor: "#f9f9f9",
    margin: 16,
    borderRadius: 8,
    elevation: 2,
  },
  craftsmanNameWrapper: {
    paddingHorizontal: 16,
    marginTop: -8,
    marginBottom: 12,
  },

  craftsmanName: {
    fontSize: 14,
    color: "#004AAD",
    fontWeight: "bold",
    textAlign: "right",
  },

  serviceCardImage: { width: 60, height: 60, borderRadius: 8 },
  serviceCardTitle: { fontSize: 14, fontWeight: "bold", textAlign: "right" },
  ratingRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 4,
  },
  ratingText: { fontSize: 12, fontWeight: "bold", marginHorizontal: 4 },
  reviewsText: { fontSize: 12, color: "#777" },
  price: { fontSize: 12, color: "#444", marginTop: 4 },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  rejectBtn: { backgroundColor: "#eee" },
  acceptBtn: { backgroundColor: "#004AAD" },
  rejectText: { color: "#000", fontWeight: "bold" },
  acceptText: { color: "#fff", fontWeight: "bold" },
  customHeaderContainer: {
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    marginBottom: 12,
  },

  backButton: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -18 }],
  },

  backIconWrapper: {
    backgroundColor: "#004AAD",
    padding: 6,
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  customHeaderTitle: {
    fontSize: 24,
    fontFamily: Fonts.BOLD,
    color: "#000",
    textAlign: "center",
  },
});
