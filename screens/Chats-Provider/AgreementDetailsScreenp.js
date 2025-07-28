import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import ServiceCard from "../../Components/ServiceCard";

const NewOfferScreen = ({ navigation }) => {
  const [finalCost, setFinalCost] = useState("");

  const handleSend = () => {
    if (finalCost.trim() !== "") {
      navigation.navigate("ProviderChatScreen", { cost: finalCost });
    }
  };

  const dummyService = {
    id: 1,
    title: "تنظيف مكيفات",
    price: "150 جنيه",
    provider: "شركة الصيانة السريعة",
    rating: "4.5",
    reviews: "(51)",
    image: require("../../assets/providerBG.png"),
    avatar: require("../../assets/banner.jpg"),
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>عرض جديد</Text>
        <TouchableOpacity
          style={styles.arrowBtn}
          onPress={() => navigation.goBack()}
        >
          <FontAwesome name="angle-right" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 20}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* 1. تفاصيل مشكلة */}
          <Text style={styles.sectionTitle}>تفاصيل مشكلة</Text>
          <Image
            source={require("../../assets/providerBG.png")}
            style={styles.problemImage}
          />
          <Text style={styles.description}>
            Lorem ipsum dolor sit amet consectetur. Eu praesent lorem quisque
            praesent dolor ultrices nam urna auctor. Habitant turpis tristique
            bibendum nec. Semper sed dictum dui risus
          </Text>

          {/* 2. تفاصيل العميل */}
          <Text style={styles.sectionTitle}>تفاصيل العميل</Text>
          <View style={styles.clientBox}>
            <Image
              source={require("../../assets/banner.jpg")}
              style={styles.clientAvatar}
            />
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={styles.clientName}>احمد علي</Text>
              <Text style={styles.clientLocation}>محطة الرمل</Text>
              <Text style={styles.clientPhone}>012279501554</Text>
            </View>
          </View>

          {/* 3. يوم الحجز */}
          <Text style={styles.sectionTitle}>يوم الحجز</Text>
          <View style={styles.bookingBox}>
            <TextInput style={styles.timeInput} value="1:00 pm" />
            <Text style={styles.timeLabel}>ساعة</Text>

            <View style={styles.dayBox}>
              <Text style={styles.dayLabel}>S</Text>
              <Text style={styles.dayValue}>27</Text>
            </View>

            <Text style={styles.timeLabel}>يوم</Text>
          </View>

          {/* 4. الخدمة */}
          <Text style={styles.sectionTitle}>الخدمة</Text>
          <ServiceCard
            service={dummyService}
            navigation={navigation}
            showBookButton={false}
          />

          {/* 5. التكلفة النهائية */}
          <Text style={styles.sectionTitle}>التكلفة النهائية</Text>
          <TextInput
            placeholder="اكتب التكلفة"
            value={finalCost}
            onChangeText={setFinalCost}
            keyboardType="numeric"
            style={styles.priceInput}
          />

          {/* 6. الأزرار */}
          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
              <Text style={styles.sendText}>إرسال</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.rejectBtn}>
              <Text style={styles.rejectText}>رفض خدمه</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default NewOfferScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    backgroundColor: "#F5F8FF",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "Almarai-Bold",
    marginRight: 10,
    color: "#121217",
  },
  arrowBtn: {
    backgroundColor: "#004AAD",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
    textAlign: "right",
    marginBottom: 8,
    marginTop: 16,
  },
  problemImage: {
    width: "100%",
    height: 150,
    borderRadius: 12,
    marginBottom: 10,
  },
  description: {
    textAlign: "right",
    color: "#444",
    fontSize: 14,
    lineHeight: 20,
  },
  clientBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },
  clientAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginLeft: 10,
  },
  clientName: {
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "right",
  },
  clientLocation: {
    fontSize: 13,
    color: "#888",
    textAlign: "right",
  },
  clientPhone: {
    fontSize: 13,
    color: "#000",
    textAlign: "right",
  },
  bookingBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 8,
    minWidth: 80,
    textAlign: "center",
  },
  timeLabel: {
    fontSize: 14,
    color: "#000",
  },
  dayBox: {
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  dayLabel: {
    fontSize: 12,
    color: "#888",
  },
  dayValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
  priceInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    textAlign: "right",
    marginBottom: 20,
  },
  buttonsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
  sendBtn: {
    flex: 1,
    backgroundColor: "#004AAD",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  sendText: {
    color: "#fff",
    fontWeight: "bold",
  },
  rejectBtn: {
    flex: 1,
    borderColor: "#004AAD",
    borderWidth: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  rejectText: {
    color: "#004AAD",
    fontWeight: "bold",
  },
});
