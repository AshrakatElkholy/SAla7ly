import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Entypo } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BASE_URL = "https://98c21eeda706.ngrok-free.app";

export default function ServiceDetailsScreen({ route, navigation }) {
  const serviceId = route?.params?.serviceId;
  console.log("Service ID:", serviceId);

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otherServices, setOtherServices] = useState([]);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/user/getService/${serviceId}`
        );
        setService(data);

        navigation.setOptions({ title: data.title });

        const { data: allServices } = await axios.get(
          `${BASE_URL}/user/getServiceByCategory/${data.categoryId._id}`
        );
        setOtherServices(allServices.services);
      } catch (error) {
        console.error(
          "خطأ في تحميل الخدمة:",
          error.response?.data || error.message
        );
        Alert.alert("خطأ", "لم يتم تحميل بيانات الخدمة");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      // لو حابب، ممكن تحط هنا عنوان مؤقت قبل ما ييجي الرد من السيرفر
      navigation.setOptions({ title: `تفاصيل الخدمة رقم ${serviceId}` });

      fetchService();
    }
  }, [serviceId, navigation]);

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleServiceBookNow = async () => {
    if (!service) return;

    Alert.alert("تأكيد الحجز", `هل تريد حجز خدمة "${service.title}"؟`, [
      { text: "إلغاء", style: "cancel" },
      {
        text: "تأكيد",
        onPress: async () => {
          const newOrder = {
            id: Date.now(),
            name: service.title,
            status: "قيد التنفيذ",
            ...service,
          };

          try {
            const existingOrders = await AsyncStorage.getItem("orders");
            const orders = existingOrders ? JSON.parse(existingOrders) : [];
            orders.push(newOrder);
            await AsyncStorage.setItem("orders", JSON.stringify(orders));
            Alert.alert("تم الحجز", `تم حجز خدمة ${service.title} بنجاح!`);
            navigation.navigate("OrdersScreen", { order: newOrder });
          } catch (error) {
            console.error("فشل في حفظ الطلب:", error);
          }
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#004AAD" />
        <Text>جاري تحميل الخدمة...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>لم يتم العثور على الخدمة</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {/* صورة الخدمة */}
        <View style={styles.headerImageWrapper}>
          <Image
            source={{ uri: service.mainImage?.secure_url }}
            style={styles.headerImage}
          />
          <View style={styles.imageTopButtons}>
            <TouchableOpacity
              style={styles.circleBtn}
              onPress={handleBackPress}
            >
              <Entypo name="chevron-right" size={24} color="gray" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.circleBtnBookmark}>
              <Image
                source={require("../assets/bookmark.png")}
                width={20}
                height={20}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* العنوان والتقييم */}
          <View style={styles.titleSection}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.ratingText}>⭐ 4.5 (51)</Text>
          </View>

          <View style={styles.divider} />

          {/* وصف الخدمة */}
          <Text style={styles.sectionTitle}>عن الخدمة</Text>
          <Text style={styles.descriptionText}>{service.description}</Text>

          <View style={styles.divider} />

          {/* مقدم الخدمة */}
          <Text style={styles.sectionTitle}>مقدم الخدمة</Text>
          <View style={styles.providerSection}>
            <Image
              source={{ uri: service.providerId?.profilePic?.secure_url }}
              style={styles.avatar}
            />
            <View style={styles.providerInfo}>
              <Text style={styles.providerName}>
                {service.providerId?.name}
              </Text>
              <Text style={styles.providerSubtitle}>
                {service.providerId?.address}
              </Text>
              <View style={styles.categoryTag}>
                <Text style={styles.categoryText}>
                  {service.categoryId?.title}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.detailButton}
              onPress={() => navigation.navigate("ProviderProfileScreen")}
            >
              <Text style={styles.detailButtonText}>تفاصيل</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* الحجز والسعر */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.bookButtonFooter}
              onPress={handleServiceBookNow}
            >
              <Text style={styles.bookButtonTextFooter}>احجز الآن</Text>
            </TouchableOpacity>
            <Text style={styles.priceRange}>
              ({service.minPrice}-{service.maxPrice}) ج.م
            </Text>
          </View>

          <View style={styles.divider} />

          {/* ✅ الخدمات الأخرى */}
          <Text style={styles.sectionTitle}>خدمات أخري في نفس الفئة</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {otherServices.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.otherServiceCard}
                onPress={() =>
                  navigation.push("ServiceDetailsScreen", {
                    serviceId: item._id,
                  })
                }
              >
                <Image
                  source={{ uri: item.mainImage?.secure_url }}
                  style={styles.otherServiceImage}
                />
                <Text style={styles.otherServiceTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.otherServicePrice}>
                  {item.minPrice}-{item.maxPrice} ج.م
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#fff" },
  container: { flex: 1, backgroundColor: "#fff" },
  headerImageWrapper: { position: "relative" },
  headerImage: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  imageTopButtons: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  circleBtn: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  circleBtnBookmark: {
    width: 40,
    height: 40,
    borderRadius: 18,
    backgroundColor: "#8A8AA3",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  content: { padding: 20 },
  titleSection: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceTitle: { fontSize: 20, fontWeight: "bold", textAlign: "right" },
  ratingText: { fontSize: 14, color: "#666" },
  sectionTitle: {
    marginTop: 15,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "right",
  },
  descriptionText: {
    marginTop: 5,
    color: "#555",
    lineHeight: 22,
    textAlign: "right",
  },
  divider: { height: 1, backgroundColor: "#ccc", marginVertical: 10 },
  providerSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  avatar: { width: 50, height: 50, borderRadius: 25 },
  providerInfo: { flex: 1, marginRight: 10 },
  providerName: { fontWeight: "bold", fontSize: 14, textAlign: "right" },
  providerSubtitle: { fontSize: 12, color: "#666", textAlign: "right" },
  categoryTag: {
    backgroundColor: "#dff0df",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  categoryText: { color: "#2e8b57", fontSize: 12 },
  detailButton: {
    borderWidth: 1,
    borderColor: "#004AAD",
    paddingVertical: 4,
    paddingHorizontal: 15,
    borderRadius: 15,
  },
  detailButtonText: {
    color: "#004AAD",
    fontWeight: "600",
    paddingHorizontal: 20,
  },
  footer: {
    padding: 20,
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRange: { fontSize: 16, fontWeight: "bold" },
  bookButtonFooter: {
    backgroundColor: "#004AAD",
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  bookButtonTextFooter: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  otherServiceCard: {
    width: 140,
    marginRight: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    elevation: 3,
    alignItems: "center",
  },
  otherServiceImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
  },
  otherServiceTitle: {
    marginTop: 5,
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  otherServicePrice: {
    fontSize: 12,
    color: "#666",
    marginTop: 3,
    textAlign: "center",
  },
});