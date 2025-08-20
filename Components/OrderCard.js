import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { Fonts } from "../constants";

const statusColors = {
  pending: { label: "قيد الانتظار", color: "#F2B705", bg: "#FFF6DC" },
  accepted: { label: "تم القبول", color: "#336EBD", bg: "#e6edf7" },
  rejected: { label: "مرفوض", color: "#FF675D", bg: "#fff1f0" },
  completed: { label: "تم التنفيذ", color: "#6BC497", bg: "#fbfefc" },
  canceled: { label: "ملغي", color: "#FF675D", bg: "#fff1f0" },
  confirmed: { label: "مؤكد", color: "#4F77F7", bg: "#EDF1FF" },
};

const OrderCard = ({ order, showChat = false, navigation }) => {
  const { id, status, serviceId, providerId } = order;

  const statusStyle = statusColors[status] || { color: "#999", bg: "#EEE" };

  return (
    <View style={styles.card}>
      {/* صورة الخدمة */}
      <Image
        source={
          serviceId?.mainImage?.secure_url
            ? { uri: serviceId.mainImage.secure_url }
            : require("../assets/plumber.jpg")
        }
        style={styles.image}
      />

      <View style={styles.content}>
        {/* Badge الحالة */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: statusStyle.bg,
              borderColor: statusStyle.color,
              borderWidth: 1,
            },
          ]}
        >
          <Text
            style={{
              color: statusStyle.color,
              fontSize: 10,
              fontFamily: Fonts.BOLD,
            }}
          >
            {status}
          </Text>
        </View>

        <View style={styles.titleWithTechInfo}>
          <Image
            source={
              providerId?.profilePic?.secure_url
                ? { uri: providerId.profilePic.secure_url }
                : require("../assets/picProvider.png")
            }
            style={styles.avatarLarge}
          />

          <View style={styles.titleColumn}>
            <Text style={styles.title}>{serviceId?.title || "خدمة"}</Text>
            <Text style={styles.technicianName}>
              {providerId?.name || "مزود الخدمة"}
            </Text>
          </View>
        </View>

        <View style={styles.buttonsRow}>
          {showChat && (
            <TouchableOpacity style={styles.chatButton}>
              <Ionicons name="chatbubble-outline" size={18} color="#4F77F7" />
            </TouchableOpacity>
          )}

          <CustomButton
            title="تفاصيل"
            onPress={() =>
              navigation.navigate("ServiceDetailsScreen", { orderId: id })
            }
            type="outline"
            color="#4F77F7"
            style={styles.detailsBtn}
            textStyle={{ fontSize: 14 }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row-reverse",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  image: {
    width: 113,
    height: 114,
    borderRadius: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    left: 5,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
    zIndex: 10,
    fontFamily: Fonts.BOLD,
  },
  title: {
    fontSize: 14,
    fontFamily: Fonts.BOLD,
    marginBottom: 2,
    color: "#4B4B4B",
  },
  userInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: 6,
  },
  technicianName: {
    fontSize: 12,
    color: "#000000",
    fontFamily: Fonts.REGULAR,
  },
  buttonsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 8,
  },
  chatButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: "#EDF1FF",
  },

  avatarLarge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  titleWithTechInfo: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
  },
  titleColumn: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginRight: 6,
  },

  detailsBtn: {
    width: 170,
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
});

export default OrderCard;
