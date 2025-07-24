// components/ServiceCard.js
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";

const ServiceCard = ({
  service,
  onToggleFavorite,
  isFavorite,
  cardStyle = "horizontal",
  showBookButton = true,
}) => {
  const isHorizontal = cardStyle === "horizontal";

  return (
    <TouchableOpacity activeOpacity={0.9}>
      <View
        style={[
          styles.serviceCard,
          isHorizontal ? styles.horizontalCard : styles.verticalCard,
        ]}
      >
        <View style={styles.serviceImageContainer}>
          <Image source={service.image} style={styles.serviceImage} />

          <TouchableOpacity
            style={styles.favoriteBadge}
            onPress={() => {
              onToggleFavorite && onToggleFavorite(service);
            }}
          >
            <FontAwesome
              name="bookmark"
              size={14}
              color={isFavorite ? "#2196F3" : "white"}
            />
          </TouchableOpacity>

          <View style={styles.ratingBadge}>
            <FontAwesome name="star" size={12} color="#FFD700" />
            <Text style={styles.ratingText}>{service.rating}</Text>
            <Text style={styles.reviewsText}>{service.reviews}</Text>
          </View>
        </View>

        <View style={styles.serviceInfo}>
          {/* Avatar + Info Row */}
          <View style={styles.infoRow}>
            <Image source={service.avatar} style={styles.avatar} />

            <View style={styles.serviceInfoText}>
              <View style={styles.serviceTitleRow}>
                <Text style={styles.servicePrice}>{service.price}</Text>
                <Text style={styles.serviceTitle}>{service.title}</Text>
              </View>
              <Text style={styles.serviceProvider}>{service.provider}</Text>
            </View>
          </View>

          {showBookButton && (
            <TouchableOpacity style={styles.bookButton}>
              <Text style={styles.bookButtonText}>احجز الان</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  serviceCard: {
    backgroundColor: "#ffffff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
    marginBottom: 15,
  },
  horizontalCard: { width: 300, marginRight: 10 },
  verticalCard: { width: "100%" },
  serviceImageContainer: {
    position: "relative",
    height: 120,
    overflow: "hidden",
  },
  serviceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    alignSelf: "center",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: "row",
    alignItems: "center",
    opacity: 0.6, // 👈 add this line
  },

  favoriteBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    borderRadius: 15,
    padding: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    opacity: 0.6, // 👈 semi-transparent
  },

  ratingText: {
    fontSize: 12,
    color: "#333",
    marginHorizontal: 3,
  },
  reviewsText: {
    fontSize: 10,
    color: "#666",
  },
  serviceInfo: { padding: 12 },
  serviceTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 8,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },

  serviceInfoText: {
    flex: 1,
  },

  serviceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right",
    flex: 1,
  },
  serviceProvider: {
    fontSize: 12,
    color: "#666",
    marginBottom: 12,
    textAlign: "right",
  },
  servicePrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
    textAlign: "left",
  },
  bookButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#004AAD",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  bookButtonText: {
    color: "#004AAD",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default ServiceCard;
