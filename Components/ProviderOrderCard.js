import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "./CustomButton";
import { Fonts } from "../constants";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const ProviderOrderCard = ({ service, token }) => {
  const navigation = useNavigation();

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return {
          backgroundColor: "#f8fcff",
          borderColor: "#004AAD",
          textColor: "#004AAD",
        };
      case "accepted":
        return {
          backgroundColor: "#fffcfc",
          borderColor: "#FFA487",
          textColor: "#FFA487",
        };
      case "confirmed":
        return {
          backgroundColor: "#fffdfa",
          borderColor: "#FFC62B",
          textColor: "#FFC62B",
        };
      case "completed":
        return {
          backgroundColor: "#fbfefc",
          borderColor: "#6BC497",
          textColor: "#6BC497",
        };
      case "rejected":
        return {
          backgroundColor: "#fff1f0",
          borderColor: "#dc3545",
          textColor: "#dc3545",
        };
      case "canceled":
        return {
          backgroundColor: "#fff1f0",
          borderColor: "#dc3545",
          textColor: "#dc3545",
        };
      default:
        return {
          backgroundColor: "#eee",
          borderColor: "#ccc",
          textColor: "#333",
        };
    }
  };

  const statusStyle = getStatusStyle(service.status);

  const serviceImage =
    service.serviceId?.mainImage?.secure_url ||
    (Array.isArray(service.serviceId?.mainImage) &&
      service.serviceId.mainImage[0]?.secure_url) ||
    require("../assets/plumber.jpg");

  const userAvatar =
    service.userId?.avatar?.secure_url ||
    (Array.isArray(service.userId?.avatar) &&
      service.userId.avatar[0]?.secure_url) ||
    require("../assets/picProvider.png");

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.statusBadge,
          {
            backgroundColor: statusStyle.backgroundColor,
            borderColor: statusStyle.borderColor,
            borderWidth: 1,
          },
        ]}
      >
        <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
          {service.status}
        </Text>
      </View>

      <View style={styles.mainImageContainer}>
        <Image
          source={
            typeof serviceImage === "string"
              ? { uri: serviceImage }
              : serviceImage
          }
          style={styles.mainImage}
        />
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text style={styles.ratingText}>{service.rating || "4.5"}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.techRow}>
          <Image
            source={
              typeof userAvatar === "string" ? { uri: userAvatar } : userAvatar
            }
            style={styles.avatar}
          />
          <View style={styles.techInfo}>
            <Text style={styles.techName}>
              {service.userId?.name || "مزود الخدمة"}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={14} color="#777" />
              <Text style={styles.location}>
                {service.location || "الموقع غير محدد"}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.serviceRow}>
          <Text style={styles.serviceName}>
            {service.serviceId?.title || "خدمة غير محددة"}
          </Text>
          <Text style={styles.price}>
            {service.serviceId
              ? `${service.serviceId.minPrice}-${service.serviceId.maxPrice}`
              : "غير محدد"}
          </Text>
        </View>

        <View style={styles.buttonsRow}>
          <CustomButton
            title="تفاصيل طلب"
            onPress={() =>
              navigation.navigate("ProviderServiceDetailsScreen", {
                order: service,
                token: token,
                orderId: service._id,
              })
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
  mainImageContainer: {
    width: width * 0.3,
    height: width * 0.3,
    borderRadius: 12,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
    aspectRatio: 1,
  },
  ratingContainer: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "transparent",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: Fonts.REGULAR,
    color: "#333",
  },
  statusBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 16,
    zIndex: 10,
  },
  statusText: { fontSize: 10, fontFamily: Fonts.BOLD },
  content: { flex: 1, paddingHorizontal: 8, justifyContent: "space-between" },
  techRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 8,
  },
  avatar: { width: 36, height: 36, borderRadius: 18, marginLeft: 8 },
  techInfo: { alignItems: "flex-end" },
  techName: { fontSize: 14, fontFamily: Fonts.BOLD, color: "#333" },
  location: { fontSize: 12, color: "#777", fontFamily: Fonts.REGULAR },
  serviceRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
  },
  serviceName: { fontSize: 14, fontFamily: Fonts.BOLD, color: "#1F1F1F" },
  price: { fontSize: 13, fontFamily: Fonts.BOLD, color: "#000000" },
  locationRow: { flexDirection: "row-reverse", alignItems: "center" },
  buttonsRow: { flexDirection: "row", justifyContent: "flex-start" },
  detailsBtn: { flex: 1, paddingVertical: 6, maxWidth: "100%" },
});

export default ProviderOrderCard;
