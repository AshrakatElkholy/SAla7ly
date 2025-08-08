import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useEffect, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import CustomHeaderWithLines from "../../Components/CustomHeaderTemp";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomServiceCard from "../../Components/CustomServiceCard";
import CustomButton from "../../Components/CustomButton";
import { Fonts } from "../../constants";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;
const ProviderServiceDetailsScreen = ({ navigation, route }) => {
  const service = {
    image: require("../../assets/plumber.jpg"),
    category: "صيانة مطبخ",
    title: "محطة الرمل",
    rating: 4.5,
    reviews: 51,
    description:
      "Lorem ipsum dolor sit amet consectetur. Eu praesent lorem quisque praesent dolor ultrices nam urna auctor. Habitant turpis tristique bibendum nec. Semper sed dictum dui risus",
    priceRange: "500-600 ج.م",
    date: "S 27",
    time: "1:00 PM",
    customer: {
      name: "احمد علي",
      address: "محطة الرمل",
      phone: "012279501554",
      image: require("../../assets/picProvider.png"),
    },
  };
  const [workingHours, setWorkingHours] = useState([]);

  const updateOrderStatus = async (orderId, userId, newStatus) => {
    try {
      const providerOrdersData = await AsyncStorage.getItem("providerOrders");
      const providerOrders = providerOrdersData
        ? JSON.parse(providerOrdersData)
        : [];

      const updatedProviderOrders = providerOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await AsyncStorage.setItem(
        "providerOrders",
        JSON.stringify(updatedProviderOrders)
      );

      const userOrdersData = await AsyncStorage.getItem(
        `orders_user_${userId}`
      );
      const userOrders = userOrdersData ? JSON.parse(userOrdersData) : [];

      const updatedUserOrders = userOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      await AsyncStorage.setItem(
        `orders_user_${userId}`,
        JSON.stringify(updatedUserOrders)
      );
    } catch (error) {
      console.log("خطأ أثناء تحديث حالة الطلب:", error);
    }
  };

  const handleReject = async () => {
    const currentOrder = route.params?.order;
    if (!currentOrder || !currentOrder.userId) return;

    await updateOrderStatus(currentOrder.id, currentOrder.userId, "منتهي");
    navigation.replace("NewOrdersProvider");
  };

  const handleAccept = async () => {
    const currentOrder = route.params?.order;
    if (!currentOrder || !currentOrder.userId) return;

    await updateOrderStatus(currentOrder.id, currentOrder.userId, "قيد تنفيذ");
    navigation.navigate("CurrentOrdersProvider", { refresh: Date.now() });
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem("workingHours");
        if (data) {
          setWorkingHours(JSON.parse(data));
        }
      } catch (error) {
        console.log("فشل تحميل مواعيد العمل:", error);
      }
    };

    loadData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* عنوان */}
        <View style={styles.customHeaderContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          ></TouchableOpacity>
          <Text style={styles.customHeaderTitle}>تفاصيل الخدمة</Text>
        </View>

        {/* تفاصيل المشكلة */}
        <Text style={styles.sectionTitle}>تفاصيل مشكلة</Text>
        <Image source={service.image} style={styles.mainImage} />
        <Text style={styles.description}>{service.description}</Text>

        {/* تفاصيل العميل */}
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

        {/* يوم الحجز */}
        <Text style={styles.sectionTitle}>يوم الحجز</Text>
        <View style={styles.dateContainer}>
          {/* الساعة + تسمية */}
          <View style={styles.timeWrapper}>
            <View style={styles.timeBox}>
              <Text style={styles.timeText}>
                {workingHours[0]?.from || "غير محدد"}
              </Text>
            </View>
            <Text style={styles.label}>ساعة</Text>
          </View>

          {/* Spacer */}
          <View style={styles.flexSpacer} />

          {/* اليوم + تسمية */}
          <View style={styles.dayWrapper}>
            <View style={styles.dayBox}>
              <Text style={styles.dayShort}>
                {workingHours[0]?.day?.slice(0, 1) || "?"}
              </Text>
              <Text style={styles.dayNumber}>{new Date().getDate()}</Text>
            </View>
            <Text style={styles.label}>يوم</Text>
          </View>
        </View>

        {/* تفاصيل الخدمة */}
        <Text style={styles.sectionTitle}>الخدمة</Text>
        <CustomServiceCard
          category={service.category}
          rating={service.rating}
          reviews={service.reviews}
          image={service.image}
          priceRange={service.priceRange}
          craftsmanName="مصطفى عبد الرازق"
        />

        {/* أزرار التحكم */}
        <View style={styles.buttonContainer}>
          <CustomButton
            title="رفض العرض"
            onPress={handleReject}
            type="outline"
            color="#d00"
            textStyle={{ fontSize: 16 }}
            style={{ flex: 1, marginHorizontal: 5 }}
          />
          <CustomButton
            title="قبول"
            onPress={handleAccept}
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
